export default function ApiSetupBanner() {
  return (
    <div style={styles.wrap}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <span style={styles.icon}>🔑</span>
          <div>
            <p style={styles.title}>Connect to TMDB for thousands of real movies</p>
            <p style={styles.sub}>
              Currently showing 25 demo movies. Add a free TMDB API key to unlock the full database.
            </p>
          </div>
        </div>
        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noreferrer"
          style={styles.btn}
        >
          Get free API key →
        </a>
      </div>
      <div style={styles.steps}>
        <Step n="1" text="Sign up free at themoviedb.org" />
        <Arrow />
        <Step n="2" text='Go to Settings → API → copy "API Key (v3 auth)"' />
        <Arrow />
        <Step n="3" text="Add VITE_TMDB_API_KEY=your_key to .env.local" />
        <Arrow />
        <Step n="4" text="Restart the dev server (npm run dev)" />
      </div>
    </div>
  );
}

function Step({ n, text }) {
  return (
    <div style={stepStyles.wrap}>
      <span style={stepStyles.num}>{n}</span>
      <span style={stepStyles.text}>{text}</span>
    </div>
  );
}

function Arrow() {
  return <span style={{ color: 'var(--text3)', fontSize: 18, margin: '0 4px' }}>›</span>;
}

const styles = {
  wrap: {
    background: 'rgba(124,106,247,0.08)',
    border: '1px solid rgba(124,106,247,0.25)',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '16px 20px',
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  icon: { fontSize: 24, flexShrink: 0 },
  title: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    color: 'var(--text2)',
    lineHeight: 1.5,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7c6af7, #f472b6)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    padding: '10px 20px 14px',
    borderTop: '1px solid rgba(124,106,247,0.15)',
    background: 'rgba(124,106,247,0.04)',
  },
};

const stepStyles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  num: {
    background: 'rgba(124,106,247,0.25)',
    color: '#a78bfa',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  text: {
    fontSize: 11,
    color: 'var(--text2)',
  },
};
