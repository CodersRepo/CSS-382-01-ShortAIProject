export default function Hero({ matchCount, totalCount, live, totalResults }) {
  return (
    <div style={styles.hero}>
      <div style={styles.inner}>
        <div style={styles.badge}>
          {live ? '🎬 Powered by TMDB' : '🎥 Demo Mode'}
        </div>
        <h1 style={styles.heading}>
          Find your next<br />
          <span style={styles.gradient}>perfect movie</span>
        </h1>
        <p style={styles.sub}>
          Dial in your vibe, set your filters, and discover exactly what to watch tonight.
        </p>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statNum}>{matchCount.toLocaleString()}</span>
            <span style={styles.statLabel}>Showing</span>
          </div>
          <div style={styles.divider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {live ? (totalResults ?? totalCount).toLocaleString() : totalCount}
            </span>
            <span style={styles.statLabel}>{live ? 'In Database' : 'Total Movies'}</span>
          </div>
          {!live && (
            <>
              <div style={styles.divider} />
              <div style={styles.stat}>
                <span style={styles.statNum}>
                  {totalCount > 0 ? Math.round((matchCount / totalCount) * 100) : 0}%
                </span>
                <span style={styles.statLabel}>Match Rate</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.orbs} aria-hidden>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />
      </div>
    </div>
  );
}

const styles = {
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: '64px 24px 48px',
    background: 'var(--bg)',
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(124,106,247,0.15)',
    border: '1px solid rgba(124,106,247,0.3)',
    borderRadius: 100,
    padding: '4px 14px',
    fontSize: 12,
    fontWeight: 600,
    color: '#a78bfa',
    marginBottom: 20,
    letterSpacing: '0.02em',
  },
  heading: {
    fontSize: 'clamp(36px, 6vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    color: 'var(--text)',
    marginBottom: 16,
  },
  gradient: {
    background: 'linear-gradient(135deg, #7c6af7 0%, #f472b6 50%, #fbbf24 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sub: {
    fontSize: 18,
    color: 'var(--text2)',
    maxWidth: 480,
    lineHeight: 1.6,
    marginBottom: 32,
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statNum: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--accent2)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 12,
    color: 'var(--text3)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  divider: {
    width: 1,
    height: 36,
    background: 'var(--border)',
  },
  orbs: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
  },
  orb1: {
    width: 400, height: 400,
    background: 'rgba(124,106,247,0.12)',
    top: -100, right: '10%',
  },
  orb2: {
    width: 300, height: 300,
    background: 'rgba(244,114,182,0.1)',
    bottom: -80, right: '30%',
  },
  orb3: {
    width: 200, height: 200,
    background: 'rgba(251,191,36,0.08)',
    top: 0, right: '5%',
  },
};
