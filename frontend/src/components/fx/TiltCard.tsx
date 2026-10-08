import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 350, damping: 25 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);
  const glareOpacity = useTransform(smoothY, [0, 0.5, 1], [0.3, 0.1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-2xl glass-panel ${className}`}
      >
        {/* Dynamic Glare Highlight */}
        {glare && (
          <motion.div
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle at calc(${x.get()} * 100%) calc(${y.get()} * 100%), rgba(255,255,255,0.25) 0%, transparent 60%)`,
            }}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay transition-opacity duration-200"
          />
        )}

        {/* Card Content with 3D depth */}
        <div style={{ transform: 'translateZ(18px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
