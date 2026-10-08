import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Smartphone, Cpu, CheckCircle } from 'lucide-react';

interface StepItem {
  number: string;
  plate: string;
  title: string;
  tagline: string;
  description: string;
  microcopy: string;
  icon: any;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    plate: 'Plate 01',
    title: 'Habit Observation',
    tagline: 'CAPTURING THE PASSIVE SIGNAL',
    description: 'You log your daily unlock frequency, average social screen duration, sleep schedule, and perceived stress score.',
    microcopy: 'Don\'t worry—we don\'t judge your 2 AM memes.',
    icon: Smartphone,
  },
  {
    number: '02',
    plate: 'Plate 02',
    title: 'Feature Normalization',
    tagline: 'DE-SKEWING & TOP-10 MAPPING',
    description: 'The scikit-learn pipeline applies log1p to study hours, maps country clusters, and normalizes screen time against student baselines.',
    microcopy: 'Turning raw chaos into clean mathematical vectors.',
    icon: Cpu,
  },
  {
    number: '03',
    plate: 'Plate 03',
    title: 'Random Forest Inference',
    tagline: '100 DECISION TREES AGGREGATING',
    description: 'An ensemble of 100 orthogonal trees evaluates non-linear trade-offs between physical exercise, unlocks, and late-night social scrolling.',
    microcopy: 'Checking 100 parallel universes of student habit data.',
    icon: Sparkles,
  },
  {
    number: '04',
    plate: 'Plate 04',
    title: 'Calibrated Action Plan',
    tagline: 'MINDSCROLL SCORE & INTERVENTIONS',
    description: 'Receive an empirical score (0-100), risk band category, and actionable lifestyle micro-nudges to safeguard your cognitive reserves.',
    microcopy: 'Real science. Zero generic horoscope fluff.',
    icon: CheckCircle,
  },
];

export const HowItWorksStepper: React.FC<{ onStartPredictor: () => void }> = ({ onStartPredictor }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const prevStep = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1));
  const nextStep = () => setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : 0));

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase block mb-1">
              03 // HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-content-primary">
              Four Beats of <span className="text-gradient">Algorithmic Clarity</span>
            </h2>
            <p className="text-xs sm:text-sm text-content-muted mt-1 max-w-md">
              A transparent, 4-step pipeline from self-reported student habits to personalized cognitive restoration.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-card hover:bg-card-hover text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1 font-mono text-xs"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>[ PREV ]</span>
            </button>
            <span className="font-mono text-xs px-2 text-content-primary font-bold">
              {step.number} / 04
            </span>
            <button
              onClick={nextStep}
              className="px-3 py-2 rounded-xl border border-border-subtle bg-card hover:bg-card-hover text-content-secondary hover:text-content-primary transition-colors flex items-center gap-1 font-mono text-xs"
              aria-label="Next step"
            >
              <span>[ NEXT ]</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {STEPS.map((s, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <button
                key={s.number}
                onClick={() => setCurrentStep(idx)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-md shadow-primary/10'
                    : isCompleted
                    ? 'border-border-subtle bg-subtle/50 opacity-80'
                    : 'border-border-subtle bg-subtle/20 opacity-50 hover:opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-primary font-bold">
                    [{s.plate}]
                  </span>
                  <span className="font-mono text-[10px] text-content-muted">
                    {s.number}
                  </span>
                </div>
                <div className="text-xs font-bold font-display text-content-primary truncate hidden sm:block">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-8 sm:p-12 rounded-3xl bg-card border border-border-subtle shadow-xl relative overflow-hidden"
          >
            {/* Background subtle watermark number */}
            <div className="absolute -bottom-8 -right-6 font-display font-extrabold text-[12rem] text-content-primary/5 select-none pointer-events-none leading-none">
              {step.number}
            </div>

            <div className="max-w-2xl relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5 shadow-lg shadow-primary/20 flex items-center justify-center">
                  <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
                    {step.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-content-primary">
                    {step.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-sans">
                {step.description}
              </p>

              {/* Riotters signature playful micro-copy accent */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 font-mono text-xs text-primary">
                <span>✦</span>
                <span>{step.microcopy}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartPredictor}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
                >
                  [ TEST YOUR HABITS NOW ]
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
