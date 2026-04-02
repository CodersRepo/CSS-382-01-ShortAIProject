import { useState } from 'react';

const GENRE_COLORS = {
  Action: '#f87171',
  Comedy: '#fbbf24',
  Drama: '#60a5fa',
  'Sci-Fi': '#a78bfa',
  Horror: '#f472b6',
  Romance: '#fb7185',
  Thriller: '#f97316',
  Animation: '#34d399',
};

export default function MovieCard({ movie, onSelect, onToggleFav, onToggleWatched, matchScore }) {
  const [favAnim, setFavAnim] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleFav(e) {
    e.stopPropagation();
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 400);
    onToggleFav(movie.id);
  }

  function handleWatched(e) {
    e.stopPropagation();
    onToggleWatched(movie.id);
  }

  return (
    <div
      style={{
        ...styles.card,
        opacity: movie.watched ? 0.65 : 1,
      }}
      onClick={() => onSelect(movie)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${movie.title}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(movie)}
    >
      {/* Poster */}
      <div style={styles.posterWrap}>
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            style={styles.poster}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={styles.posterFallback}>
            <span style={{ fontSize: 48 }}>🎬</span>
          </div>
        )}
        <div style={styles.posterOverlay} />

        {/* Match score badge */}
        {matchScore !== undefined && (
          <div style={{ ...styles.scoreBadge, background: matchScoreColor(matchScore) }}>
            {matchScore}%
          </div>
        )}

        {/* Watched overlay */}
        {movie.watched && (
          <div style={styles.watchedOverlay}>
            <span style={{ fontSize: 24 }}>✓</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Watched</span>
          </div>
        )}

        {/* Action buttons */}
        <div style={styles.cardActions}>
          <button
            style={{
              ...styles.actionBtn,
              color: movie.favorite ? '#f472b6' : 'rgba(255,255,255,0.7)',
              animation: favAnim ? 'heartPop 0.4s ease' : 'none',
            }}
            onClick={handleFav}
            aria-label={movie.favorite ? 'Remove from favorites' : 'Add to favorites'}
            title={movie.favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {movie.favorite ? '♥' : '♡'}
          </button>
          <button
            style={{
              ...styles.actionBtn,
              color: movie.watched ? '#34d399' : 'rgba(255,255,255,0.7)',
            }}
            onClick={handleWatched}
            aria-label={movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
            title={movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
          >
            {movie.watched ? '👁' : '👁'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.genreRow}>
          {movie.genre.slice(0, 2).map(g => (
            <span
              key={g}
              style={{
                ...styles.genreTag,
                background: `${GENRE_COLORS[g] || '#7c6af7'}22`,
                color: GENRE_COLORS[g] || '#7c6af7',
                borderColor: `${GENRE_COLORS[g] || '#7c6af7'}44`,
              }}
            >
              {g}
            </span>
          ))}
          {movie.genre.length > 2 && (
            <span style={styles.moreTag}>+{movie.genre.length - 2}</span>
          )}
        </div>

        <h3 style={styles.title} title={movie.title}>{movie.title}</h3>

        <p style={styles.desc}>{movie.description}</p>

        <div style={styles.meta}>
          <span style={styles.metaItem}>⭐ {movie.rating}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.metaItem}>{movie.year}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.metaItem}>{movie.runtime} min</span>
        </div>

        <div style={styles.platforms}>
          {movie.platforms.slice(0, 3).map(p => (
            <span key={p} style={styles.platformTag}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function matchScoreColor(score) {
  if (score >= 80) return 'rgba(52,211,153,0.9)';
  if (score >= 60) return 'rgba(251,191,36,0.9)';
  return 'rgba(248,113,113,0.9)';
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    animation: 'fadeIn 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  posterWrap: {
    position: 'relative',
    aspectRatio: '2/3',
    overflow: 'hidden',
    background: 'var(--bg3)',
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  posterFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg3)',
  },
  posterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  scoreBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 8,
    padding: '3px 8px',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    backdropFilter: 'blur(4px)',
  },
  watchedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    color: '#34d399',
    pointerEvents: 'none',
  },
  cardActions: {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  actionBtn: {
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: 8,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'transform 0.15s, color 0.15s',
  },
  content: {
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  genreRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  genreTag: {
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid',
  },
  moreTag: {
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 11,
    color: 'var(--text3)',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  desc: {
    fontSize: 12,
    color: 'var(--text2)',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: 'var(--text2)',
    marginTop: 'auto',
  },
  metaItem: { color: 'var(--text2)' },
  dot: { color: 'var(--text3)' },
  platforms: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  platformTag: {
    fontSize: 10,
    padding: '2px 7px',
    borderRadius: 6,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text3)',
    fontWeight: 500,
  },
};
