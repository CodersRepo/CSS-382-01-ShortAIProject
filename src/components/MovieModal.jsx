import { useEffect, useState } from 'react';

const GENRE_COLORS = {
  Action: '#f87171', Comedy: '#fbbf24', Drama: '#60a5fa',
  'Sci-Fi': '#a78bfa', Horror: '#f472b6', Romance: '#fb7185',
  Thriller: '#f97316', Animation: '#34d399',
};
const MOOD_COLORS = {
  'Feel-good': '#34d399', Dark: '#94a3b8', Emotional: '#f472b6',
  'Mind-bending': '#a78bfa', Relaxing: '#60a5fa', Suspenseful: '#f97316',
  Inspirational: '#fbbf24', Funny: '#fb923c',
};

export default function MovieModal({ movie, onClose, onToggleFav, onToggleWatched, matchReason }) {
  const [imgError, setImgError] = useState(false);
  const [favAnim, setFavAnim] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!movie) return null;

  function handleFav() {
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 400);
    onToggleFav(movie.id);
  }

  const stars = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div style={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label={movie.title}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header image section */}
        <div style={styles.imageSection}>
          {!imgError ? (
            <img
              src={movie.poster}
              alt={movie.title}
              style={styles.image}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={styles.imageFallback}><span style={{ fontSize: 64 }}>🎬</span></div>
          )}
          <div style={styles.imageOverlay} />

          {/* Close */}
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close modal">✕</button>

          {/* Title over image */}
          <div style={styles.imageContent}>
            <div style={styles.genreRow}>
              {movie.genre.map(g => (
                <span key={g} style={{
                  ...styles.genreTag,
                  background: `${GENRE_COLORS[g] || '#7c6af7'}33`,
                  color: GENRE_COLORS[g] || '#a78bfa',
                  border: `1px solid ${GENRE_COLORS[g] || '#7c6af7'}55`,
                }}>{g}</span>
              ))}
            </div>
            <h2 style={styles.title}>{movie.title}</h2>
            <div style={styles.metaRow}>
              <span style={styles.metaItem}>📅 {movie.year}</span>
              <span style={styles.dot}>·</span>
              <span style={styles.metaItem}>⏱ {movie.runtime} min</span>
              <span style={styles.dot}>·</span>
              <span style={styles.metaItem}>🌍 {movie.language}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {/* Rating */}
          <div style={styles.ratingSection}>
            <div style={styles.ratingBig}>
              <span style={styles.ratingNum}>{movie.rating}</span>
              <span style={styles.ratingMax}>/10</span>
            </div>
            <div style={styles.starsRow}>
              {stars.map(s => (
                <span key={s} style={{
                  ...styles.star,
                  color: s <= Math.round(movie.rating) ? '#fbbf24' : 'var(--border)',
                }}>★</span>
              ))}
            </div>
          </div>

          {/* Match reason */}
          {matchReason && (
            <div style={styles.reasonBox}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <p style={styles.reasonText}>{matchReason}</p>
            </div>
          )}

          {/* Description */}
          <p style={styles.description}>{movie.description}</p>

          {/* Moods */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Mood</div>
            <div style={styles.tagRow}>
              {movie.mood.map(m => (
                <span key={m} style={{
                  ...styles.moodTag,
                  background: `${MOOD_COLORS[m] || '#7c6af7'}22`,
                  color: MOOD_COLORS[m] || '#a78bfa',
                  border: `1px solid ${MOOD_COLORS[m] || '#7c6af7'}44`,
                }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Available on</div>
            <div style={styles.tagRow}>
              {movie.platforms.map(p => (
                <span key={p} style={styles.platformTag}>{p}</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              style={{
                ...styles.actionBtn,
                ...styles.favBtn,
                background: movie.favorite
                  ? 'rgba(244,114,182,0.2)'
                  : 'var(--bg3)',
                border: `1px solid ${movie.favorite ? '#f472b6' : 'var(--border)'}`,
                color: movie.favorite ? '#f472b6' : 'var(--text2)',
                animation: favAnim ? 'heartPop 0.4s ease' : 'none',
              }}
              onClick={handleFav}
            >
              {movie.favorite ? '♥' : '♡'} {movie.favorite ? 'Saved' : 'Save'}
            </button>
            <button
              style={{
                ...styles.actionBtn,
                background: movie.watched ? 'rgba(52,211,153,0.2)' : 'var(--bg3)',
                border: `1px solid ${movie.watched ? '#34d399' : 'var(--border)'}`,
                color: movie.watched ? '#34d399' : 'var(--text2)',
              }}
              onClick={() => onToggleWatched(movie.id)}
            >
              👁 {movie.watched ? 'Watched' : 'Mark Watched'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 540,
    maxHeight: '90vh',
    overflow: 'auto',
    animation: 'popIn 0.25s ease',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  imageSection: {
    position: 'relative',
    height: 280,
    overflow: 'hidden',
    background: 'var(--bg3)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg3)',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: 8,
    width: 32,
    height: 32,
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
  },
  genreRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  genreTag: {
    padding: '3px 10px',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: 8,
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  dot: { color: 'rgba(255,255,255,0.4)' },
  body: {
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  ratingSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  ratingBig: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 2,
  },
  ratingNum: {
    fontSize: 36,
    fontWeight: 800,
    color: '#fbbf24',
    lineHeight: 1,
  },
  ratingMax: {
    fontSize: 14,
    color: 'var(--text3)',
  },
  starsRow: {
    display: 'flex',
    gap: 2,
  },
  star: {
    fontSize: 16,
    transition: 'color 0.15s',
  },
  reasonBox: {
    background: 'rgba(124,106,247,0.12)',
    border: '1px solid rgba(124,106,247,0.25)',
    borderRadius: 12,
    padding: '12px 16px',
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  reasonText: {
    fontSize: 13,
    color: '#c4b5fd',
    lineHeight: 1.5,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: 'var(--text2)',
    lineHeight: 1.65,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  moodTag: {
    padding: '4px 12px',
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 600,
  },
  platformTag: {
    fontSize: 12,
    padding: '4px 12px',
    borderRadius: 8,
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text2)',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    paddingTop: 4,
  },
  actionBtn: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.2s',
    minWidth: 120,
  },
  favBtn: {},
};
