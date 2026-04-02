import { useEffect, useState } from 'react';

const COLORS = ['#7c6af7', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;
    const newPieces = Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${randomBetween(5, 95)}%`,
      delay: `${randomBetween(0, 0.4)}s`,
      duration: `${randomBetween(0.7, 1.2)}s`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(6, 12),
      rotate: randomBetween(0, 360),
    }));
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 1600);
    return () => clearTimeout(t);
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div style={styles.wrap} aria-hidden>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration} ${p.delay} ease-out forwards`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 999,
    overflow: 'hidden',
  },
};
