import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';

interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: 'primary' | 'glass' | 'ghost';
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.35,
  variant = 'primary',
  onClick,
  ...props
}) => {
  const { ref, x, y } = useMagnetic(strength);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = ref.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const rippleX = e.clientX - rect.left - size / 2;
      const rippleY = e.clientY - rect.top - size / 2;

      const newRipple: Ripple = {
        x: rippleX,
        y: rippleY,
        size,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) onClick(e);
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-primary/30',
    glass:
      'glass-panel hover:bg-card-hover text-content-primary border-border-subtle hover:border-primary/40',
    ghost:
      'bg-transparent hover:bg-card text-content-secondary hover:text-content-primary border border-transparent',
  }[variant];

  return (
    <motion.button
      ref={ref as any}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={`relative overflow-hidden transition-colors rounded-xl font-semibold select-none ${variantStyles} ${className}`}
      {...props}
    >
      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/25 pointer-events-none animate-ping"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear forwards',
          }}
        />
      ))}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
