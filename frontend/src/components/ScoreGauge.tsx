import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { getBandDetails } from '../lib/utils';
import { Badge } from './ui/Badge';

interface ScoreGaugeProps {
  score: number;
  minScore?: number;
  maxScore?: number;
  size?: number;
  showDetails?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  minScore = 3.6,
  maxScore = 9.4,
  size = 280,
  showDetails = true,
}) => {
  const band = getBandDetails(score);

  // Normalize score to 0..1 based on CSV range
  const normalized = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));

  // SVG Gauge geometry (half circle)
  const radius = size * 0.4;
  const strokeWidth = size * 0.07;
  const cx = size / 2;
  const cy = size * 0.55;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference * (1 - normalized);

  const springScore = useSpring(minScore, { stiffness: 45, damping: 15 });
  const displayScore = useTransform(springScore, (val) => val.toFixed(2));

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  const badgeVariant =
    band.band === 'Good'
      ? 'good'
      : band.band === 'Moderate'
      ? 'moderate'
      : band.band === 'Needs Attention'
      ? 'attention'
      : 'concern';

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full max-w-full">
      <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[1/0.65] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="w-full h-full overflow-visible"
        >
          {/* Background Track (semi-circle) */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="var(--line)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Scale ticks */}
          <line
            x1={cx - radius}
            y1={cy + 8}
            x2={cx - radius}
            y2={cy + 16}
            stroke="var(--line)"
            strokeWidth="2"
          />
          <line
            x1={cx}
            y1={cy - radius - 16}
            x2={cx}
            y2={cy - radius - 8}
            stroke="var(--line)"
            strokeWidth="2"
          />
          <line
            x1={cx + radius}
            y1={cy + 8}
            x2={cx + radius}
            y2={cy + 16}
            stroke="var(--line)"
            strokeWidth="2"
          />

          {/* Clean Animated Sweeping Arc reading status color CSS variable */}
          <motion.path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={band.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Central Pivot point */}
          <circle
            cx={cx}
            cy={cy}
            r={strokeWidth * 0.4}
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="2"
          />
        </svg>

        {/* Central Score Digits */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
          <motion.div
            className="text-4xl sm:text-5xl font-bold tracking-tight font-display transition-colors duration-300"
            style={{ color: band.color }}
          >
            <motion.span>{displayScore}</motion.span>
          </motion.div>
          <span className="text-[11px] uppercase tracking-wider text-muted font-mono mt-1">
            Predicted Wellness Score
          </span>
        </div>
      </div>

      {/* Min & Max Labels */}
      <div className="w-full flex justify-between px-6 text-xs text-muted font-mono mt-2" style={{ maxWidth: size }}>
        <span>Min: {minScore}</span>
        <span className="opacity-75">Scale (3.6 – 9.4)</span>
        <span>Max: {maxScore}</span>
      </div>

      {/* Band Badge */}
      {showDetails && (
        <div className="mt-4">
          <Badge variant={badgeVariant} size="md">
            <span
              className="w-2 h-2 rounded-full inline-block mr-1"
              style={{ backgroundColor: band.color }}
            />
            {band.band}
          </Badge>
        </div>
      )}
    </div>
  );
};
