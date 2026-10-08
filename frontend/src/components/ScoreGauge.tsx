import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { getBandDetails } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const band = getBandDetails(score);

  // Normalize score to 0..1 based on CSV range
  const normalized = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));

  // SVG Gauge geometry (half circle)
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const cx = size / 2;
  const cy = size * 0.55;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference * (1 - normalized);

  const springScore = useSpring(minScore, { stiffness: 40, damping: 14 });
  const displayScore = useTransform(springScore, (val) => val.toFixed(2));

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full max-w-full">
      <div className="relative w-full max-w-[260px] sm:max-w-[300px] aspect-[1/0.65] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Dynamic Gradient along the arc */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>

            {/* Glowing trail filter */}
            <filter id="gaugeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={isDark ? "6" : "3"} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track (semi-circle) */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Scale ticks */}
          <line
            x1={cx - radius}
            y1={cy + 8}
            x2={cx - radius}
            y2={cy + 16}
            stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
            strokeWidth="2"
          />
          <line
            x1={cx}
            y1={cy - radius - 16}
            x2={cx}
            y2={cy - radius - 8}
            stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
            strokeWidth="2"
          />
          <line
            x1={cx + radius}
            y1={cy + 8}
            x2={cx + radius}
            y2={cy + 16}
            stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}
            strokeWidth="2"
          />

          {/* Glowing Animated Sweeping Arc */}
          <motion.path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            filter="url(#gaugeGlow)"
          />

          {/* Central Pivot point */}
          <circle
            cx={cx}
            cy={cy}
            r={strokeWidth * 0.4}
            fill={isDark ? "#27272A" : "#FFFFFF"}
            stroke={isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)"}
            strokeWidth="2"
          />
        </svg>

        {/* Central Score Digits */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
          <motion.div
            className="text-5xl font-extrabold tracking-tight font-display transition-colors duration-500"
            style={{ color: band.color }}
          >
            <motion.span>{displayScore}</motion.span>
          </motion.div>
          <span className="text-xs uppercase tracking-widest text-content-muted font-medium mt-1">
            Mental Health Score
          </span>
        </div>
      </div>

      {/* Min & Max Labels */}
      <div className="w-full flex justify-between px-6 text-xs text-content-muted font-mono mt-1" style={{ maxWidth: size }}>
        <span>Min: {minScore}</span>
        <span className="font-medium">Scale (3.6 – 9.4)</span>
        <span>Max: {maxScore}</span>
      </div>

      {/* Band Badge */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className={`mt-4 px-4 py-1.5 rounded-full border text-sm font-semibold tracking-wide flex items-center gap-2 transition-colors duration-500 ${band.badgeClass}`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: band.color }}
          />
          {band.band}
        </motion.div>
      )}
    </div>
  );
};
