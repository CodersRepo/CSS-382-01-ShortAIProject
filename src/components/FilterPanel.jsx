import { useState } from 'react';
import { GENRES, MOODS, PLATFORMS } from '../data/movies';

const LANGUAGES = [
  'English', 'Korean', 'French', 'Japanese', 'Spanish',
  'German', 'Italian', 'Portuguese', 'Chinese', 'Hindi',
  'Arabic', 'Russian',
];

const RATING_OPTIONS = [6, 7, 8, 9];

export default function FilterPanel({ filters, onFiltersChange, onReset, onSurprise, live }) {
  const [collapsed, setCollapsed] = useState(false);

  function toggle(key, value) {
    const arr = filters[key];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onFiltersChange({ ...filters, [key]: next });
  }

  function setRuntime(value) {
    onFiltersChange({ ...filters, runtime: value });
  }

  function setYearRange(idx, value) {
    const next = [...filters.yearRange];
    next[idx] = Number(value);
    if (idx === 0 && next[0] > next[1]) next[1] = next[0];
    if (idx === 1 && next[1] < next[0]) next[0] = next[1];
    onFiltersChange({ ...filters, yearRange: next });
  }

  function setRating(val) {
    onFiltersChange({ ...filters, minRating: filters.minRating === val ? 0 : val });
  }

  function setSearch(val) {
    onFiltersChange({ ...filters, search: val });
  }

  function setSort(val) {
    onFiltersChange({ ...filters, sort: val });
  }

  const activeCount = [
    filters.genres.length,
    filters.moods.length,
    filters.platforms.length,
    filters.languages.length,
    filters.runtime !== 'any' ? 1 : 0,
    filters.minRating > 0 ? 1 : 0,
    filters.search.length > 0 ? 1 : 0,
    (filters.yearRange[0] !== 1980 || filters.yearRange[1] !== 2024) ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div style={styles.panel}>
      <div style={styles.panelHeader}>
        <div style={styles.panelTitle}>
          <span>🎛</span>
          <span>Filters</span>
          {activeCount > 0 && <span style={styles.activeBadge}>{activeCount} active</span>}
          {live && <span style={styles.liveDot} title="Connected to TMDB">● LIVE</span>}
        </div>
        <div style={styles.headerActions}>
          {activeCount > 0 && (
            <button style={styles.resetBtn} onClick={onReset}>
              ↺ Reset
            </button>
          )}
          <button style={styles.collapseBtn} onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '▼ Show filters' : '▲ Hide filters'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div style={styles.body}>
          {/* Search + Sort row */}
          <div style={styles.row}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="Search movies…"
                value={filters.search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search movies"
              />
              {filters.search && (
                <button style={styles.clearSearch} onClick={() => setSearch('')} aria-label="Clear search">✕</button>
              )}
            </div>
            <div style={styles.sortWrap}>
              <span style={{ fontSize: 14, color: 'var(--text2)', whiteSpace: 'nowrap' }}>Sort by</span>
              <select
                style={styles.sortSelect}
                value={filters.sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Sort by"
              >
                <option value="rating">Rating</option>
                <option value="year">Year</option>
                <option value="runtime">Runtime</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Genre */}
          <FilterSection label="Genre" icon="🎭">
            <div style={styles.chips}>
              {GENRES.map(g => (
                <Chip
                  key={g}
                  label={g}
                  active={filters.genres.includes(g)}
                  onClick={() => toggle('genres', g)}
                  color="accent"
                />
              ))}
            </div>
          </FilterSection>

          {/* Mood */}
          <FilterSection label="Mood" icon="🎭">
            <div style={styles.chips}>
              {MOODS.map(m => (
                <Chip
                  key={m}
                  label={m}
                  active={filters.moods.includes(m)}
                  onClick={() => toggle('moods', m)}
                  color="pink"
                />
              ))}
            </div>
          </FilterSection>

          {/* Runtime + Year Row */}
          <div style={styles.twoCol}>
            <FilterSection label="Runtime" icon="⏱">
              <div style={styles.chips}>
                {[
                  { label: 'Any', value: 'any' },
                  { label: '< 90 min', value: 'short' },
                  { label: '90–120 min', value: 'medium' },
                  { label: '120–150 min', value: 'long' },
                  { label: '150+ min', value: 'epic' },
                ].map(opt => (
                  <Chip
                    key={opt.value}
                    label={opt.label}
                    active={filters.runtime === opt.value}
                    onClick={() => setRuntime(opt.value)}
                    color="yellow"
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection label={`Year: ${filters.yearRange[0]} – ${filters.yearRange[1]}`} icon="📅">
              <div style={styles.sliderGroup}>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{filters.yearRange[0]}</span>
                  <input
                    type="range"
                    min={1980}
                    max={2024}
                    value={filters.yearRange[0]}
                    onChange={e => setYearRange(0, e.target.value)}
                    style={styles.slider}
                    aria-label="Year from"
                  />
                </div>
                <div style={styles.sliderRow}>
                  <span style={styles.sliderLabel}>{filters.yearRange[1]}</span>
                  <input
                    type="range"
                    min={1980}
                    max={2024}
                    value={filters.yearRange[1]}
                    onChange={e => setYearRange(1, e.target.value)}
                    style={styles.slider}
                    aria-label="Year to"
                  />
                </div>
              </div>
            </FilterSection>
          </div>

          {/* Rating */}
          <FilterSection label="Min Rating" icon="⭐">
            <div style={styles.chips}>
              <Chip
                label="Any"
                active={filters.minRating === 0}
                onClick={() => setRating(0)}
                color="yellow"
              />
              {RATING_OPTIONS.map(r => (
                <Chip
                  key={r}
                  label={`${r}+`}
                  active={filters.minRating === r}
                  onClick={() => setRating(r)}
                  color="yellow"
                />
              ))}
            </div>
          </FilterSection>

          {/* Platforms */}
          <FilterSection label="Streaming Platform" icon="📺">
            <div style={styles.chips}>
              {PLATFORMS.map(p => (
                <Chip
                  key={p}
                  label={p}
                  active={filters.platforms.includes(p)}
                  onClick={() => toggle('platforms', p)}
                  color="green"
                  icon={PLATFORM_ICONS[p]}
                />
              ))}
            </div>
          </FilterSection>

          {/* Language */}
          <FilterSection label="Language" icon="🌍">
            <div style={styles.chips}>
              {LANGUAGES.map(l => (
                <Chip
                  key={l}
                  label={l}
                  active={filters.languages.includes(l)}
                  onClick={() => toggle('languages', l)}
                  color="accent"
                />
              ))}
            </div>
          </FilterSection>

          {/* Surprise Me */}
          <button style={styles.surpriseBtn} onClick={onSurprise}>
            <span>🎲</span>
            <span>Surprise Me!</span>
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSection({ label, icon, children }) {
  return (
    <div style={secStyles.wrap}>
      <div style={secStyles.label}>
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

const PLATFORM_ICONS = {
  Netflix: '🔴',
  Hulu: '🟢',
  Prime: '🔵',
  'Disney+': '✨',
  Max: '🟣',
};

function Chip({ label, active, onClick, color, icon }) {
  const colorMap = {
    accent: { active: 'rgba(124,106,247,0.25)', border: '#7c6af7', text: '#a78bfa' },
    pink: { active: 'rgba(244,114,182,0.2)', border: '#f472b6', text: '#f472b6' },
    yellow: { active: 'rgba(251,191,36,0.2)', border: '#fbbf24', text: '#fbbf24' },
    green: { active: 'rgba(52,211,153,0.2)', border: '#34d399', text: '#34d399' },
  };
  const c = colorMap[color] || colorMap.accent;

  return (
    <button
      style={{
        ...chipStyles.base,
        background: active ? c.active : 'var(--bg3)',
        border: `1px solid ${active ? c.border : 'var(--border)'}`,
        color: active ? c.text : 'var(--text2)',
        transform: active ? 'scale(1.04)' : 'scale(1)',
        fontWeight: active ? 600 : 400,
      }}
      onClick={onClick}
      aria-pressed={active}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

const chipStyles = {
  base: {
    padding: '6px 14px',
    borderRadius: 100,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    whiteSpace: 'nowrap',
  },
};

const secStyles = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};

const styles = {
  panel: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
  },
  liveDot: {
    fontSize: 11,
    fontWeight: 700,
    color: '#34d399',
    marginLeft: 4,
    letterSpacing: '0.02em',
  },
  activeBadge: {
    background: 'rgba(124,106,247,0.2)',
    color: '#a78bfa',
    border: '1px solid rgba(124,106,247,0.3)',
    borderRadius: 100,
    padding: '2px 10px',
    fontSize: 11,
    fontWeight: 600,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  resetBtn: {
    background: 'rgba(248,113,113,0.15)',
    border: '1px solid rgba(248,113,113,0.3)',
    color: '#f87171',
    borderRadius: 8,
    padding: '5px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  collapseBtn: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text2)',
    borderRadius: 8,
    padding: '5px 12px',
    fontSize: 13,
    cursor: 'pointer',
  },
  body: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  row: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  searchWrap: {
    flex: 1,
    minWidth: 200,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 12px',
    height: 40,
  },
  searchIcon: { fontSize: 14, color: 'var(--text3)' },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontSize: 14,
  },
  clearSearch: {
    background: 'none',
    border: 'none',
    color: 'var(--text3)',
    cursor: 'pointer',
    fontSize: 13,
    padding: 2,
  },
  sortWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sortSelect: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 12px',
    height: 40,
    color: 'var(--text)',
    fontSize: 14,
    cursor: 'pointer',
    outline: 'none',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  sliderGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sliderLabel: {
    fontSize: 12,
    color: 'var(--text2)',
    width: 34,
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },
  slider: {
    flex: 1,
    accentColor: '#7c6af7',
    cursor: 'pointer',
  },
  surpriseBtn: {
    background: 'linear-gradient(135deg, #7c6af7, #f472b6)',
    border: 'none',
    borderRadius: 12,
    padding: '12px 24px',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    boxShadow: '0 4px 20px rgba(124,106,247,0.4)',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
};
