import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Home, Compass } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { MagneticButton } from '../components/fx/MagneticButton';

export const NotFoundPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <GlassCard className="max-w-md w-full text-center p-8 border border-border-subtle shadow-2xl relative overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -6, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 shadow-lg shadow-primary/10"
        >
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '20s' }} />
        </motion.div>

        <h1 className="text-5xl font-extrabold font-display text-content-primary">404</h1>
        <h2 className="text-lg font-bold text-content-secondary mt-2">Lost in the Algorithm</h2>
        <p className="text-xs text-content-muted mt-2 leading-relaxed">
          The requested view could not be located in MindScroll AI. Let's redirect you back to the assessment homepage.
        </p>

        <div className="mt-6">
          <MagneticButton
            strength={0.25}
            onClick={() => onNavigate('landing')}
            className="w-full py-3 text-xs font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            data-cursor="view"
          >
            <Home className="w-4 h-4" />
            <span>Return to Assessment Home</span>
          </MagneticButton>
        </div>
      </GlassCard>
    </div>
  );
};
