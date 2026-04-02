import { useState } from 'react';
import MovieCard from './MovieCard';

export default function ResultsSection({
  movies,
  topMatch,
  onSelect,
  onToggleFav,
  onToggleWatched,
  matchScores,
  onReroll,
  isLoading,
  isLoadingMore,
  onRelaxFilters,
  hasMore,
  onLoadMore,
  live,
  totalResults,
}) {

  if (isLoading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Finding your perfect match…</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🎭</div>
        <h3 style={styles.emptyTitle}>No movies found</h3>
        <p style={styles.emptySub}>Try relaxing a few filters to see more results.</p>
        <button style={styles.relaxBtn} onClick={onRelaxFilters}>
          ✦ Relax Filters
        </button>
      </div>
    );
  }

  const others = topMatch
    ? movies.filter(m => m.id !== topMatch.id)
    : movies.slice(1);

  return (
    <div style={styles.wrap}>
      {/* Top match hero card */}
      {topMatch && (
        <div style={styles.heroSection}>
          <div style={styles.heroLabel}>
            <span style={styles.heroBadge}>🏆 Tonight's Pick</span>
            <button style={styles.rerollBtn} onClick={onReroll} title="Try another recommendation">
              🔄 Not this one
            </button>
          </div>

          <div style={styles.heroCard} onClick={() => onSelect(topMatch)} tabIndex={0} role="button"
            aria-label={`View details for ${topMatch.title}`}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(topMatch)}>
            <div style={styles.heroImg}>
              <img
                src={topMatch.poster}
                alt={topMatch.title}
                style={styles.heroImgEl}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div style={styles.heroOverlay} />
              {matchScores[topMatch.id] !== undefined && (
                <div style={styles.matchRing}>
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                    <circle
                      cx="32" cy="32" r="26" fill="none"
                      stroke={matchScores[topMatch.id] >= 80 ? '#34d399' : matchScores[topMatch.id] >= 60 ? '#fbbf24' : '#f87171'}
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${(matchScores[topMatch.id] / 100) * 163} 163`}
                    />
                  </svg>
                  <span style={styles.matchPct}>{matchScores[topMatch.id]}%</span>
                </div>
              )}
            </div>

            <div style={styles.heroContent}>
              <div style={styles.heroTags}>
                {topMatch.genre.map(g => (
                  <span key={g} style={styles.heroTag}>{g}</span>
                ))}
              </div>
              <h2 style={styles.heroTitle}>{topMatch.title}</h2>
              <p style={styles.heroDesc}>{topMatch.description}</p>

              <div style={styles.heroMeta}>
                <span>⭐ {topMatch.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                <span>{topMatch.year}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                <span>{topMatch.runtime} min</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
                <span>🌍 {topMatch.language}</span>
              </div>

              <div style={styles.heroPlatforms}>
                {topMatch.platforms.map(p => (
                  <span key={p} style={styles.heroPlatform}>{p}</span>
                ))}
              </div>

              <div style={styles.heroActions}>
                <button
                  style={{
                    ...styles.heroBtn,
                    background: topMatch.favorite ? 'rgba(244,114,182,0.3)' : 'rgba(255,255,255,0.12)',
                    border: `1px solid ${topMatch.favorite ? '#f472b6' : 'rgba(255,255,255,0.2)'}`,
                    color: topMatch.favorite ? '#f472b6' : '#fff',
                  }}
                  onClick={e => { e.stopPropagation(); onToggleFav(topMatch.id); }}
                >
                  {topMatch.favorite ? '♥ Saved' : '♡ Save'}
                </button>
                <button
                  style={{
                    ...styles.heroBtn,
                    background: topMatch.watched ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.12)',
                    border: `1px solid ${topMatch.watched ? '#34d399' : 'rgba(255,255,255,0.2)'}`,
                    color: topMatch.watched ? '#34d399' : '#fff',
                  }}
                  onClick={e => { e.stopPropagation(); onToggleWatched(topMatch.id); }}
                >
                  👁 {topMatch.watched ? 'Watched' : 'Mark Watched'}
                </button>
                <button style={{ ...styles.heroBtn, background: 'rgba(124,106,247,0.3)', border: '1px solid rgba(124,106,247,0.5)', color: '#c4b5fd' }}
                  onClick={e => { e.stopPropagation(); onSelect(topMatch); }}>
                  ℹ Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of other movies */}
      {others.length > 0 && (
        <div style={styles.gridSection}>
          <div style={styles.gridHeader}>
            <h3 style={styles.gridTitle}>
              {others.length} More Matches
              {live && totalResults > movies.length && (
                <span style={styles.totalNote}> of {totalResults.toLocaleString()} total</span>
              )}
            </h3>
          </div>
          <div style={styles.grid}>
            {others.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={onSelect}
                onToggleFav={onToggleFav}
                onToggleWatched={onToggleWatched}
                matchScore={matchScores[movie.id]}
              />
            ))}
          </div>

          {/* Load More */}
          {(hasMore || isLoadingMore) && (
            <div style={styles.loadMoreWrap}>
              <button
                style={styles.loadMoreBtn}
                onClick={onLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <span style={styles.btnSpinner} />
                    Loading…
                  </>
                ) : (
                  <>⬇ Load More Movies</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
  },
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 80,
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid var(--border)',
    borderTop: '3px solid #7c6af7',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: 'var(--text2)',
    fontSize: 15,
    animation: 'pulse 1.5s ease infinite',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '80px 24px',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    textAlign: 'center',
  },
  emptyIcon: { fontSize: 56 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text)',
  },
  emptySub: {
    fontSize: 14,
    color: 'var(--text2)',
    maxWidth: 360,
  },
  relaxBtn: {
    marginTop: 8,
    background: 'linear-gradient(135deg, #7c6af7, #f472b6)',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  heroLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  heroBadge: {
    fontSize: 14,
    fontWeight: 700,
    color: '#fbbf24',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  rerollBtn: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  heroCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    minHeight: 320,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  heroImg: {
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--bg3)',
  },
  heroImgEl: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.6))',
    pointerEvents: 'none',
  },
  matchRing: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchPct: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
  },
  heroContent: {
    padding: '28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%)',
  },
  heroTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroTag: {
    padding: '3px 10px',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
    background: 'rgba(124,106,247,0.2)',
    color: '#a78bfa',
    border: '1px solid rgba(124,106,247,0.3)',
  },
  heroTitle: {
    fontSize: 'clamp(20px, 3vw, 28px)',
    fontWeight: 800,
    color: 'var(--text)',
    lineHeight: 1.2,
  },
  heroDesc: {
    fontSize: 14,
    color: 'var(--text2)',
    lineHeight: 1.6,
    flex: 1,
  },
  heroMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: 'var(--text2)',
    flexWrap: 'wrap',
  },
  heroPlatforms: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  heroPlatform: {
    fontSize: 11,
    padding: '3px 10px',
    borderRadius: 6,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text3)',
    fontWeight: 500,
  },
  heroActions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    paddingTop: 4,
  },
  heroBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
  },
  gridSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  gridHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--text)',
  },
  totalNote: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--text3)',
  },
  loadMoreWrap: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 16,
  },
  loadMoreBtn: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '12px 32px',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s',
  },
  btnSpinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid var(--border)',
    borderTop: '2px solid #7c6af7',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
};
