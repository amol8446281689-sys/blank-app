import { useState, useEffect } from 'react';

interface Balloon {
  id: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  sway: number;
}

const BALLOON_COLORS = [
  '#ff4b4b', // Streamlit red
  '#ff8c42', // orange
  '#ffc43d', // yellow
  '#00c0f2', // cyan
  '#1dd1a1', // green
  '#5f27cd', // purple
  '#ff6b81', // pink
  '#54a0ff', // blue
];

export function FloatingBalloons({ triggerKey }: { triggerKey: number }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    if (triggerKey === 0) return;

    const count = 28;
    const newBalloons: Balloon[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      left: 5 + Math.random() * 90,
      size: 40 + Math.random() * 32,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      delay: Math.random() * 2.5,
      duration: 3.5 + Math.random() * 2,
      sway: (Math.random() - 0.5) * 60,
    }));

    setBalloons(newBalloons);

    const timer = setTimeout(() => {
      setBalloons([]);
    }, 6500);

    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (balloons.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-120px] transition-transform"
          style={{
            left: `${b.left}%`,
            animation: `floatUp ${b.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${b.delay}s forwards`,
          }}
        >
          <div
            style={{
              animation: `sway ${b.duration * 0.75}s ease-in-out infinite alternate`,
              transform: `translateX(${b.sway}px)`,
            }}
          >
            <svg
              width={b.size}
              height={b.size * 1.3}
              viewBox="0 0 60 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              {/* Balloon oval body */}
              <ellipse
                cx="30"
                cy="30"
                rx="28"
                ry="30"
                fill={b.color}
              />
              {/* Balloon highlight */}
              <ellipse
                cx="20"
                cy="20"
                rx="6"
                ry="10"
                transform="rotate(-25 20 20)"
                fill="#ffffff"
                fillOpacity="0.35"
              />
              {/* Knot */}
              <polygon
                points="26,60 34,60 31,64 29,64"
                fill={b.color}
              />
              {/* String */}
              <path
                d="M30 64 C28 69, 33 72, 30 78"
                stroke="rgba(120, 120, 120, 0.6)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          90% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(-125vh);
            opacity: 0;
          }
        }
        @keyframes sway {
          0% {
            transform: translateX(-18px);
          }
          100% {
            transform: translateX(18px);
          }
        }
      `}</style>
    </div>
  );
}
