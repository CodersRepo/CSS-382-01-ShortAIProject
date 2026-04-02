import { useEffect } from 'react';

export default function FavoritesPanel({ movies, favIds, onClose, onSelect, onToggleFav }) {
  const favMovies = movies.filter(m => favIds.includes(m.id));

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

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Favorites">
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <span style={{ color: '#f472b6', fontSize: 20 }}>♥</span>
            <span>Favorites</span>
            {favMovies.length > 0 && (
              <span style={styles.count}>{favMovies.length}</span>
            )}
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close favorites">✕</button>
        </div>

        <div style={styles.body}>
          {favMovies.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 48 }}>💔</div>
              <p style={styles.emptyText}>No favorites yet.</p>
              <p style={styles.emptySub}>Click the ♡ on any movie to save it here.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {favMovies.map(movie => (
                <div
                  key={movie.id}
                  style={styles.item}
                  onClick={() => { onSelect(movie); onClose(); }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${movie.title}`}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (onSelect(movie), onClose())}
                >
                  <div style={styles.thumb}>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={styles.thumbImg}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div style={styles.info}>
                    <p style={styles.itemTitle}>{movie.title}</p>
                    <p style={styles.itemMeta}>{movie.year} · ⭐ {movie.rating} · {movie.runtime} min</p>
                    <div style={styles.itemGenres}>
                      {movie.genre.slice(0, 2).map(g => (
                        <span key={g} style={styles.itemGenre}>{g}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    style={styles.removeBtn}
                    onClick={e => { e.stopPropagation(); onToggleFav(movie.id); }}
                    aria-label={`Remove ${movie.title} from favorites`}
                    title="Remove from favorites"
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(6px)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 0.2s ease',
  },
  panel: {
    background: 'var(--surface)',
    borderLeft: '1px solid var(--border)',
    width: '100%',
    maxWidth: 400,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.25s ease',
    boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
  },
  header: {
    padding: '18px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--surface2)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--text)',
  },
  count: {
    background: '#f472b6',
    color: '#fff',
    borderRadius: '50%',
    width: 22,
    height: 22,
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    width: 32,
    height: 32,
    color: 'var(--text2)',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    overflow: 'auto',
    padding: 16,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '60px 24px',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: 600,
    color: 'var(--text)',
  },
  emptySub: {
    fontSize: 13,
    color: 'var(--text3)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  item: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '10px 12px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
  },
  thumb: {
    width: 48,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    background: 'var(--bg3)',
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemMeta: {
    fontSize: 11,
    color: 'var(--text3)',
  },
  itemGenres: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  itemGenre: {
    fontSize: 10,
    padding: '2px 7px',
    borderRadius: 100,
    background: 'rgba(124,106,247,0.2)',
    color: '#a78bfa',
    border: '1px solid rgba(124,106,247,0.3)',
    fontWeight: 600,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#f472b6',
    fontSize: 18,
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 8,
    transition: 'transform 0.15s',
    flexShrink: 0,
  },
};
