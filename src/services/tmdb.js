const BASE = 'https://api.themoviedb.org/3';
export const IMG = 'https://image.tmdb.org/t/p/w500';
export const IMG_ORIG = 'https://image.tmdb.org/t/p/original';

// Our display genre names → TMDB genre IDs
export const GENRE_TO_ID = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  'Sci-Fi': 878,
  Horror: 27,
  Romance: 10749,
  Thriller: 53,
  Animation: 16,
};

// TMDB genre IDs → our display names (expanded)
export const ID_TO_GENRE = {
  28: 'Action',
  35: 'Comedy',
  18: 'Drama',
  878: 'Sci-Fi',
  27: 'Horror',
  10749: 'Romance',
  53: 'Thriller',
  16: 'Animation',
  80: 'Crime',
  9648: 'Mystery',
  14: 'Fantasy',
  12: 'Adventure',
  10751: 'Family',
  10752: 'War',
  37: 'Western',
  99: 'Documentary',
  10402: 'Music',
  36: 'History',
};

// Mood → TMDB genre IDs (OR logic – any of these genres = this mood)
const MOOD_GENRES = {
  'Feel-good':    [35, 16, 10749, 10751, 12],
  'Dark':         [27, 53, 80, 9648],
  'Emotional':    [18, 10749, 10402],
  'Mind-bending': [878, 9648, 14],
  'Relaxing':     [16, 35, 10749, 10751],
  'Suspenseful':  [53, 27, 9648, 80],
  'Inspirational':[18, 28, 10752, 36],
  'Funny':        [35, 16],
};

export function inferMoods(genreIds) {
  const moods = new Set();
  for (const [mood, ids] of Object.entries(MOOD_GENRES)) {
    if (ids.some(id => genreIds.includes(id))) moods.add(mood);
  }
  return Array.from(moods);
}

const ALL_PLATFORMS = ['Netflix', 'Hulu', 'Prime', 'Disney+', 'Max'];
export function assignPlatforms(id) {
  const seed = id % 5;
  const count = (id % 3) + 1;
  const out = new Set();
  for (let i = 0; i < count; i++) out.add(ALL_PLATFORMS[(seed + i) % 5]);
  return Array.from(out);
}

export const LANG_TO_CODE = {
  English:    'en',
  Korean:     'ko',
  French:     'fr',
  Japanese:   'ja',
  Spanish:    'es',
  German:     'de',
  Italian:    'it',
  Portuguese: 'pt',
  Chinese:    'zh',
  Hindi:      'hi',
  Arabic:     'ar',
  Russian:    'ru',
};
const CODE_TO_LANG = Object.fromEntries(Object.entries(LANG_TO_CODE).map(([k, v]) => [v, k]));

export function mapMovie(m, savedState = {}) {
  const genreIds = m.genre_ids ?? (m.genres?.map(g => g.id) ?? []);
  return {
    id: m.id,
    title: m.title,
    genre: genreIds.map(id => ID_TO_GENRE[id]).filter(Boolean),
    mood: inferMoods(genreIds),
    runtime: m.runtime ?? 0,
    year: m.release_date ? +m.release_date.slice(0, 4) : 0,
    rating: Math.round((m.vote_average ?? 0) * 10) / 10,
    platforms: assignPlatforms(m.id),
    language: CODE_TO_LANG[m.original_language] ?? m.original_language ?? 'Other',
    description: m.overview ?? '',
    poster: m.poster_path ? `${IMG}${m.poster_path}` : null,
    backdrop: m.backdrop_path ? `${IMG_ORIG}${m.backdrop_path}` : null,
    popularity: m.popularity ?? 0,
    voteCount: m.vote_count ?? 0,
    favorite: savedState.favorite ?? false,
    watched: savedState.watched ?? false,
    live: true,
  };
}

function sortBy(sort) {
  switch (sort) {
    case 'rating':  return 'vote_average.desc';
    case 'year':    return 'primary_release_date.desc';
    case 'title':   return 'title.asc';
    default:        return 'popularity.desc';
  }
}

function runtimeRange(val) {
  switch (val) {
    case 'short':  return [0, 89];
    case 'medium': return [90, 120];
    case 'long':   return [121, 150];
    case 'epic':   return [151, 9999];
    default:       return [0, 9999];
  }
}

export async function discoverMovies({ filters, page = 1, apiKey }) {
  const p = new URLSearchParams({
    api_key: apiKey,
    language: 'en-US',
    page,
    sort_by: sortBy(filters.sort),
    include_adult: false,
    'vote_count.gte': 30,
  });

  // Genres + moods → genre IDs (union with OR/pipe)
  const gids = new Set();
  (filters.genres ?? []).forEach(g => GENRE_TO_ID[g] && gids.add(GENRE_TO_ID[g]));
  (filters.moods ?? []).forEach(m => (MOOD_GENRES[m] ?? []).forEach(id => gids.add(id)));
  if (gids.size) p.set('with_genres', [...gids].join('|'));

  // Runtime
  if (filters.runtime !== 'any') {
    const [mn, mx] = runtimeRange(filters.runtime);
    if (mn > 0)   p.set('with_runtime.gte', mn);
    if (mx < 9999) p.set('with_runtime.lte', mx);
  }

  // Year
  const [y0, y1] = filters.yearRange ?? [1900, 2030];
  p.set('primary_release_date.gte', `${y0}-01-01`);
  p.set('primary_release_date.lte', `${y1}-12-31`);

  // Rating
  if ((filters.minRating ?? 0) > 0) p.set('vote_average.gte', filters.minRating);

  // Language (single only for API; multiple handled client-side)
  if ((filters.languages ?? []).length === 1) {
    p.set('with_original_language', LANG_TO_CODE[filters.languages[0]] ?? filters.languages[0]);
  }

  const res = await fetch(`${BASE}/discover/movie?${p}`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  return {
    movies: data.results,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
    page: data.page,
  };
}

export async function searchMovies({ query, page = 1, apiKey }) {
  const p = new URLSearchParams({
    api_key: apiKey,
    query,
    language: 'en-US',
    page,
    include_adult: false,
  });
  const res = await fetch(`${BASE}/search/movie?${p}`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  return {
    movies: data.results,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
    page: data.page,
  };
}

export async function fetchMovieDetails(id, apiKey) {
  const res = await fetch(`${BASE}/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=credits`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function fetchTrending(apiKey) {
  const res = await fetch(`${BASE}/trending/movie/week?api_key=${apiKey}&language=en-US`);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  return data.results;
}
