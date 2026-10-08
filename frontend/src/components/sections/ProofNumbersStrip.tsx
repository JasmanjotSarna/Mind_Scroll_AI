import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Layers, Trophy, Globe } from 'lucide-react';

interface ProofItem {
  target: number;
  decimals?: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: any;
}

const METRICS: ProofItem[] = [
  {
    target: 5000,
    suffix: '',
    label: 'STUDENT PROFILES',
    sublabel: 'Verified academic cohort records',
    icon: Users,
  },
  {
    target: 12,
    suffix: '',
    label: 'LIFESTYLE SENSORS',
    sublabel: 'Unlocks, sleep, study & exercise',
    icon: Layers,
  },
  {
    target: 0.864,
    decimals: 3,
    suffix: '',
    label: 'MODEL R² SCORE',
    sublabel: 'Tuned Random Forest regression',
    icon: Trophy,
  },
  {
    target: 10,
    suffix: '+',
    label: 'GLOBAL REGIONS',
    sublabel: 'Top-10 frequency calibrated',
    icon: Globe,
  },
];

export const ProofNumbersStrip: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1600;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts(
        METRICS.map((m) => {
          return m.target * ease;
        })
      );

      if (progress >= 1) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="w-full py-8 border-y border-border-subtle bg-subtle/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {METRICS.map((item, idx) => {
            const Icon = item.icon;
            const displayedValue = item.decimals
              ? counts[idx].toFixed(item.decimals)
              : Math.floor(counts[idx]).toLocaleString();

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-card/50 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-content-primary tracking-tight tabular-nums">
                    {displayedValue}
                    <span className="text-primary text-xl sm:text-2xl ml-0.5">{item.suffix}</span>
                  </div>
                  <div className="font-mono text-[10px] sm:text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                    {item.label}
                  </div>
                  <p className="text-[11px] text-content-muted mt-0.5 leading-tight">
                    {item.sublabel}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
