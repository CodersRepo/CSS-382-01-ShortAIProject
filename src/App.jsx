import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MOVIES } from './data/movies';
import {
  discoverMovies, searchMovies, mapMovie, fetchTrending,
  LANG_TO_CODE,
} from './services/tmdb';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterPanel from './components/FilterPanel';
import ResultsSection from './components/ResultsSection';
import MovieModal from './components/MovieModal';
import FavoritesPanel from './components/FavoritesPanel';
import ApiSetupBanner from './components/ApiSetupBanner';
import Confetti from './components/Confetti';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? '';
const LIVE = !!API_KEY;

const DEFAULT_FILTERS = {
  genres: [],
  moods: [],
  runtime: 'any',
  yearRange: [1980, 2024],
  minRating: 0,
  platforms: [],
  languages: [],
  search: '',
  sort: 'rating',
};

// ─── localStorage helpers ────────────────────────────────────────────────────
function getSavedStates() {
  try { return JSON.parse(localStorage.getItem('mp_states') ?? '{}'); }
  catch { return {}; }
}
function saveSavedStates(map) {
  try { localStorage.setItem('mp_states', JSON.stringify(map)); }
  catch {}
}
function getInitialTheme() {
  try { return localStorage.getItem('mp_theme') ?? 'dark'; }
  catch { return 'dark'; }
}

// ─── Mock filtering (offline mode) ──────────────────────────────────────────
function runtimeBounds(val) {
  switch (val) {
    case 'short':  return { min: 0, max: 89 };
    case 'medium': return { min: 90, max: 120 };
    case 'long':   return { min: 121, max: 150 };
    case 'epic':   return { min: 151, max: 9999 };
    default:       return { min: 0, max: 9999 };
  }
}
function filterMock(movies, filters) {
  let r = [...movies];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    r = r.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genre.some(g => g.toLowerCase().includes(q))
    );
  }
  if (filters.genres.length)    r = r.filter(m => filters.genres.some(g => m.genre.includes(g)));
  if (filters.moods.length)     r = r.filter(m => filters.moods.some(mo => m.mood.includes(mo)));
  if (filters.platforms.length) r = r.filter(m => filters.platforms.some(p => m.platforms.includes(p)));
  if (filters.languages.length) r = r.filter(m => filters.languages.includes(m.language));
  if (filters.runtime !== 'any') {
    const { min, max } = runtimeBounds(filters.runtime);
    r = r.filter(m => m.runtime >= min && m.runtime <= max);
  }
  if (filters.minRating > 0) r = r.filter(m => m.rating >= filters.minRating);
  r = r.filter(m => m.year >= filters.yearRange[0] && m.year <= filters.yearRange[1]);
  r.sort((a, b) => {
    switch (filters.sort) {
      case 'rating':  return b.rating - a.rating;
      case 'year':    return b.year - a.year;
      case 'runtime': return a.runtime - b.runtime;
      case 'title':   return a.title.localeCompare(b.title);
      default: return 0;
    }
  });
  return r;
}

// ─── Match score + reason ────────────────────────────────────────────────────
function calcScore(movie, filters) {
  let total = 0, matched = 0;
  if (filters.genres.length)    { total++; if (filters.genres.some(g => movie.genre.includes(g))) matched++; }
  if (filters.moods.length)     { total++; if (filters.moods.some(m => movie.mood.includes(m))) matched++; }
  if (filters.platforms.length) { total++; if (filters.platforms.some(p => movie.platforms.includes(p))) matched++; }
  if (filters.languages.length) { total++; if (filters.languages.includes(movie.language)) matched++; }
  if (filters.runtime !== 'any') {
    const { min, max } = runtimeBounds(filters.runtime);
    total++; if (movie.runtime >= min && movie.runtime <= max) matched++;
  }
  if (filters.minRating > 0) { total++; if (movie.rating >= filters.minRating) matched++; }
  return total === 0 ? 100 : Math.round((matched / total) * 100);
}
function buildReason(movie, filters) {
  const parts = [];
  if (filters.genres.length) {
    const m = filters.genres.filter(g => movie.genre.includes(g));
    if (m.length) parts.push(`Genre: ${m.join(', ')}`);
  }
  if (filters.moods.length) {
    const m = filters.moods.filter(mo => movie.mood.includes(mo));
    if (m.length) parts.push(`Mood: ${m.join(', ')}`);
  }
  if (filters.runtime !== 'any') {
    const labels = { short:'<90 min', medium:'90–120 min', long:'120–150 min', epic:'150+ min' };
    parts.push(`Runtime: ${labels[filters.runtime]}`);
  }
  if (filters.platforms.length) {
    const m = filters.platforms.filter(p => movie.platforms.includes(p));
    if (m.length) parts.push(`On: ${m.join(', ')}`);
  }
  return parts.length ? `Matches your ${parts.join(' · ')} preferences` :
    `Top rated: ${movie.rating}/10 · ${movie.year}`;
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Live (TMDB) state
  const [liveMovies, setLiveMovies]         = useState([]);
  const [livePage, setLivePage]             = useState(1);
  const [liveTotalPages, setLiveTotalPages] = useState(1);
  const [liveTotalResults, setLiveTotalResults] = useState(0);
  const [liveLoading, setLiveLoading]       = useState(false);
  const [liveError, setLiveError]           = useState(null);

  // Mock state (offline)
  const [mockMovies, setMockMovies] = useState(() => {
    const saved = getSavedStates();
    return MOVIES.map(m => ({ ...m, favorite: saved[m.id]?.favorite ?? false, watched: saved[m.id]?.watched ?? false }));
  });

  // Shared per-movie state (favorite/watched for live movies stored in savedStates)
  const [savedStates, setSavedStates] = useState(getSavedStates);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showFavs, setShowFavs]           = useState(false);
  const [confetti, setConfetti]           = useState(false);
  const [rerollOffset, setRerollOffset]   = useState(0);

  const filterTimer = useRef(null);
  const abortRef    = useRef(null);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mp_theme', theme);
  }, [theme]);

  // Persist savedStates
  useEffect(() => {
    saveSavedStates(savedStates);
    // also sync mock movies
    setMockMovies(prev => prev.map(m => ({
      ...m,
      favorite: savedStates[m.id]?.favorite ?? m.favorite,
      watched:  savedStates[m.id]?.watched  ?? m.watched,
    })));
  }, [savedStates]);

  // ── TMDB fetch ──────────────────────────────────────────────────────────────
  const fetchLive = useCallback(async (f, page, append = false) => {
    if (!LIVE) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLiveLoading(true);
    setLiveError(null);
    try {
      let raw;
      if (f.search) {
        raw = await searchMovies({ query: f.search, page, apiKey: API_KEY });
      } else {
        raw = await discoverMovies({ filters: f, page, apiKey: API_KEY });
      }
      const mapped = raw.movies.map(m => mapMovie(m, savedStates[m.id]));

      // Client-side extra filters (language multi, platform)
      let filtered = mapped;
      if (f.languages.length > 1) {
        filtered = filtered.filter(m => f.languages.includes(m.language));
      }
      if (f.platforms.length > 0) {
        filtered = filtered.filter(m => f.platforms.some(p => m.platforms.includes(p)));
      }

      setLiveMovies(prev => append ? [...prev, ...filtered] : filtered);
      setLivePage(raw.page);
      setLiveTotalPages(raw.totalPages);
      setLiveTotalResults(raw.totalResults);
    } catch (err) {
      if (err.name !== 'AbortError') setLiveError(err.message);
    } finally {
      setLiveLoading(false);
    }
  }, [savedStates]);

  // Fetch on filter change (debounced 400ms)
  useEffect(() => {
    if (!LIVE) return;
    clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => {
      setRerollOffset(0);
      fetchLive(filters, 1, false);
    }, 400);
    return () => clearTimeout(filterTimer.current);
  }, [filters, fetchLive]);

  // Initial load: trending
  useEffect(() => {
    if (!LIVE) return;
    (async () => {
      setLiveLoading(true);
      try {
        const raw = await fetchTrending(API_KEY);
        const mapped = raw.map(m => mapMovie(m, {}));
        setLiveMovies(mapped);
        setLiveTotalResults(raw.length);
      } catch (err) {
        setLiveError(err.message);
      } finally {
        setLiveLoading(false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function loadMore() {
    const nextPage = livePage + 1;
    if (nextPage <= liveTotalPages) {
      fetchLive(filters, nextPage, true);
    }
  }

  // ── Derived movie list ───────────────────────────────────────────────────────
  const displayMovies = useMemo(() => {
    if (LIVE) {
      return liveMovies.map(m => ({
        ...m,
        favorite: savedStates[m.id]?.favorite ?? false,
        watched:  savedStates[m.id]?.watched  ?? false,
      }));
    }
    return filterMock(mockMovies, filters);
  }, [LIVE, liveMovies, mockMovies, filters, savedStates]);

  const matchScores = useMemo(() => {
    const map = {};
    displayMovies.forEach(m => { map[m.id] = calcScore(m, filters); });
    return map;
  }, [displayMovies, filters]);

  const topMatchIdx = rerollOffset % Math.max(displayMovies.length, 1);
  const topMatch    = displayMovies[topMatchIdx] ?? null;
  const matchReason = topMatch ? buildReason(topMatch, filters) : null;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleFiltersChange(f) {
    setFilters(f);
    setRerollOffset(0);
  }
  function handleReset() { setFilters(DEFAULT_FILTERS); setRerollOffset(0); }

  function handleSurprise() {
    if (!displayMovies.length) return;
    setRerollOffset(Math.floor(Math.random() * displayMovies.length));
    setConfetti(true);
    setTimeout(() => setConfetti(false), 100);
  }
  function handleReroll() {
    if (displayMovies.length <= 1) return;
    setRerollOffset(p => (p + 1) % displayMovies.length);
  }
  function handleRelaxFilters() {
    const f = { ...filters };
    if (f.genres.length)       { f.genres = []; }
    else if (f.moods.length)   { f.moods = []; }
    else if (f.runtime !== 'any') { f.runtime = 'any'; }
    else if (f.minRating > 0)  { f.minRating = 0; }
    else if (f.platforms.length) { f.platforms = []; }
    else if (f.languages.length) { f.languages = []; }
    setFilters(f);
  }

  function toggleState(id, key) {
    setSavedStates(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: !(prev[id]?.[key] ?? false) },
    }));
  }
  const handleToggleFav     = id => toggleState(id, 'favorite');
  const handleToggleWatched = id => toggleState(id, 'watched');

  const favIds      = Object.entries(savedStates).filter(([, v]) => v.favorite).map(([k]) => +k);
  const watchedCount = Object.values(savedStates).filter(v => v.watched).length;

  // All movies (mock + live deduplicated) for favorites panel
  const allMoviesMap = useMemo(() => {
    const m = {};
    mockMovies.forEach(mv => { m[mv.id] = mv; });
    liveMovies.forEach(mv => { m[mv.id] = mv; });
    return m;
  }, [mockMovies, liveMovies]);
  const allMoviesList = useMemo(() =>
    Object.values(allMoviesMap).map(m => ({
      ...m,
      favorite: savedStates[m.id]?.favorite ?? false,
      watched:  savedStates[m.id]?.watched  ?? false,
    })),
    [allMoviesMap, savedStates]
  );

  const totalCount = LIVE ? liveTotalResults : mockMovies.length;
  const hasMore    = LIVE && livePage < liveTotalPages;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Confetti active={confetti} />

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        favCount={favIds.length}
        onOpenFavs={() => setShowFavs(true)}
        watchedCount={watchedCount}
        live={LIVE}
      />

      <Hero
        matchCount={LIVE ? displayMovies.length : displayMovies.length}
        totalCount={totalCount}
        live={LIVE}
        totalResults={LIVE ? liveTotalResults : totalCount}
      />

      <main style={styles.main}>
        {!LIVE && <ApiSetupBanner />}

        <div style={styles.layout}>
          <aside style={styles.sidebar}>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleReset}
              onSurprise={handleSurprise}
              live={LIVE}
            />
          </aside>

          <div style={styles.results}>
            {liveError && (
              <div style={styles.errorBanner}>
                ⚠️ TMDB error: {liveError} — check your API key.
              </div>
            )}
            <ResultsSection
              movies={displayMovies}
              topMatch={topMatch}
              onSelect={setSelectedMovie}
              onToggleFav={handleToggleFav}
              onToggleWatched={handleToggleWatched}
              matchScores={matchScores}
              onReroll={handleReroll}
              isLoading={liveLoading && displayMovies.length === 0}
              isLoadingMore={liveLoading && displayMovies.length > 0}
              onRelaxFilters={handleRelaxFilters}
              hasMore={hasMore}
              onLoadMore={loadMore}
              live={LIVE}
              totalResults={LIVE ? liveTotalResults : displayMovies.length}
            />
          </div>
        </div>
      </main>

      {selectedMovie && (
        <MovieModal
          movie={{ ...selectedMovie, ...savedStates[selectedMovie.id], favorite: savedStates[selectedMovie.id]?.favorite ?? false, watched: savedStates[selectedMovie.id]?.watched ?? false }}
          onClose={() => setSelectedMovie(null)}
          onToggleFav={handleToggleFav}
          onToggleWatched={handleToggleWatched}
          matchReason={selectedMovie.id === topMatch?.id ? matchReason : null}
          apiKey={API_KEY}
        />
      )}

      {showFavs && (
        <FavoritesPanel
          movies={allMoviesList}
          favIds={favIds}
          onClose={() => setShowFavs(false)}
          onSelect={setSelectedMovie}
          onToggleFav={handleToggleFav}
        />
      )}
    </div>
  );
}

const styles = {
  main: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '32px 24px 64px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '340px 1fr',
    gap: 28,
    alignItems: 'start',
  },
  sidebar: {
    position: 'sticky',
    top: 80,
  },
  results: { minWidth: 0 },
  errorBanner: {
    background: 'rgba(248,113,113,0.12)',
    border: '1px solid rgba(248,113,113,0.3)',
    color: '#f87171',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 13,
    marginBottom: 16,
  },
};
