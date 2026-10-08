import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion or already loaded this session
    const hasLoaded = sessionStorage.getItem('mindscroll_preloaded');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasLoaded || prefersReducedMotion) {
      onComplete();
      return;
    }

    const startTime = Date.now();
    const duration = 1800; // 1.8s smooth countdown

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(rawProgress);

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          sessionStorage.setItem('mindscroll_preloaded', 'true');
          setTimeout(onComplete, 800); // Allow curtain reveal animation to conclude
        }, 200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#0A0A0A] text-[#FFF8F1] px-6 py-10 overflow-hidden select-none"
        >
          {/* Header branding tag */}
          <div className="w-full flex justify-between items-center text-[11px] font-mono tracking-widest text-[#FF8A3D] uppercase">
            <span>[ SYSTEM INIT // V2.4 ]</span>
            <span>MINDSCROLL AI</span>
          </div>

          {/* Central Signal Line and Big Counter */}
          <div className="flex flex-col items-center justify-center my-auto w-full max-w-xl text-center">
            {/* Fluid Large Editorial Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-7xl sm:text-9xl md:text-[11rem] font-bold font-display tracking-tight text-white mb-4 tabular-nums flex items-baseline justify-center"
            >
              <span>{progress.toString().padStart(2, '0')}</span>
              <span className="text-3xl sm:text-5xl md:text-6xl text-[#FF6B1A] font-light ml-1">%</span>
            </motion.div>

            {/* Glowing animated SVG signal line */}
            <div className="w-full max-w-md h-12 relative flex items-center justify-center mb-6">
              <svg
                viewBox="0 0 400 40"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Background faint path */}
                <path
                  d="M 0 20 Q 100 20 150 20 T 200 20 T 250 20 T 400 20"
                  fill="none"
                  stroke="rgba(255, 107, 26, 0.15)"
                  strokeWidth="2"
                />
                {/* Drawing signal wave */}
                <motion.path
                  d="M 0 20 Q 50 20 100 5 T 150 35 T 200 5 T 250 35 T 300 10 T 350 25 T 400 20"
                  fill="none"
                  stroke="url(#signalGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="500"
                  strokeDashoffset={500 - (progress / 100) * 500}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
                <defs>
                  <linearGradient id="signalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B1A" />
                    <stop offset="50%" stopColor="#FF8A3D" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <p className="text-xs sm:text-sm font-mono tracking-widest text-[#A1A1AA] uppercase">
              DECODING HABITUAL SIGNALS // THE SCROLL LEAVES A MARK
            </p>
          </div>

          {/* Footer bar */}
          <div className="w-full flex justify-between items-center text-[10px] sm:text-xs font-mono text-[#71717A]">
            <span>LOADING LATENT WEIGHTS</span>
            <span className="animate-pulse text-[#FF8A3D]">READY TO AWAKEN</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
