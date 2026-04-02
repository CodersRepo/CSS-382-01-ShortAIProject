import { useState } from 'react';

export default function Navbar({ theme, onToggleTheme, favCount, onOpenFavs, watchedCount, live }) {

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.logo}>🎬</span>
          <span style={styles.title}>MoviePicker</span>
          {live && (
            <span style={styles.livePill} title="Connected to The Movie Database">
              ● TMDB
            </span>
          )}
        </div>

        <div style={styles.actions}>
          <button
            style={styles.iconBtn}
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <button style={styles.favBtn} onClick={onOpenFavs} aria-label="Open favorites">
            <span style={styles.favIcon}>♥</span>
            <span style={styles.favLabel}>Favorites</span>
            {favCount > 0 && <span style={styles.badge}>{favCount}</span>}
          </button>

          {watchedCount > 0 && (
            <div style={styles.watchedPill} title="Movies watched">
              <span>👁</span>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{watchedCount}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  logo: { fontSize: 24 },
  title: {
    fontSize: 20,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #7c6af7, #f472b6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    width: 38,
    height: 38,
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  favBtn: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 14px',
    height: 38,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    position: 'relative',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  favIcon: { color: '#f472b6', fontSize: 16 },
  favLabel: { color: 'var(--text2)', fontSize: 13, fontWeight: 500 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    background: '#f472b6',
    color: '#fff',
    borderRadius: '50%',
    width: 18,
    height: 18,
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePill: {
    fontSize: 10,
    fontWeight: 700,
    color: '#34d399',
    background: 'rgba(52,211,153,0.12)',
    border: '1px solid rgba(52,211,153,0.3)',
    borderRadius: 100,
    padding: '2px 8px',
    letterSpacing: '0.04em',
  },
  watchedPill: {
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 10px',
    height: 38,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    color: 'var(--text2)',
  },
};
