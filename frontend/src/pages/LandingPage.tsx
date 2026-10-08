import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  Sliders,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SplitText } from '../components/fx/SplitText';
import { HeroPhoneOrbit } from '../components/fx/HeroPhoneOrbit';
import { SignalOrb3D } from '../components/fx/SignalOrb3D';
import { PlatformMarquee } from '../components/fx/PlatformMarquee';
import { MagneticButton } from '../components/fx/MagneticButton';
import { SpotlightCard } from '../components/fx/SpotlightCard';
import { ProofNumbersStrip } from '../components/sections/ProofNumbersStrip';
import { HowItWorksStepper } from '../components/sections/HowItWorksStepper';
import { PipelineExplorer } from '../components/PipelineExplorer';

interface LandingPageProps {
  onStartPredictor: () => void;
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPredictor,
  onNavigate,
}) => {
  const plates = [
    {
      plate: 'Plate 01',
      num: '01',
      title: 'Precision Lifestyle Scoring',
      desc: 'Predict your continuous mental wellness score (0 to 100) based on validated non-linear Random Forest trees.',
      page: 'predictor',
      icon: Sparkles,
      tag: 'CALIBRATED SCORING',
    },
    {
      plate: 'Plate 02',
      num: '02',
      title: 'Real-Time What-If Engine',
      desc: 'Tweak physical activity, late-night screen curfew, and study logs with real-time delta score synthesis.',
      page: 'simulator',
      icon: Sliders,
      tag: 'COUNTERFACTUAL SIMULATOR',
    },
    {
      plate: 'Plate 03',
      num: '03',
      title: 'Population Atlas & Correlates',
      desc: 'Explore bivariate distributions, sleep-anxiety correlations, and platform breakdown with instant cross-filters.',
      page: 'insights',
      icon: BarChart3,
      tag: '5,000 COHORT RECORDS',
    },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* =========================================================================
          HERO: PINNED SCROLL STORY IN 3 BEATS
          - Beat 1: Statement headline with mixed bold and light weights + split-text reveal
          - Beat 2: 3D Signal Orb & Phone Orbit morphing
          - Beat 3: Riotters proof-number strip counting up
          ========================================================================= */}
      <section className="relative min-h-[92dvh] flex flex-col justify-between px-3 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          {/* Left Column: Editorial Statement (Beat 1) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            {/* Numbered section label & status tag */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-mono font-semibold text-primary"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>01 // THE SCROLL LEAVES A MARK</span>
            </motion.div>

            {/* Editorial Heading mixing bold and light weights */}
            <h1 className="text-[clamp(2.3rem,6.2vw,4.8rem)] font-extrabold tracking-tight font-display leading-[1.06] text-content-primary">
              <span className="block font-light text-content-secondary">
                Your daily scroll,
              </span>
              <span className="text-gradient block font-black">
                <SplitText type="chars" delay={0.1}>
                  decoded.
                </SplitText>
              </span>
            </h1>

            {/* Subtitle statement */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-sm sm:text-lg text-content-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Every unlock and late-night feed leaves a mathematical footprint. MindScroll AI turns invisible digital habits into a visible, calibrated wellness signal backed by 5,000 student lives.
            </motion.p>

            {/* CTAs styled with Vertex3D bracket notation */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <MagneticButton
                strength={0.25}
                onClick={onStartPredictor}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider rounded-2xl shadow-xl shadow-primary/25 min-h-[48px] bg-gradient-to-r from-primary to-accent text-white"
                data-cursor="view"
              >
                <span>[ CHECK MY SCORE ]</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <MagneticButton
                strength={0.2}
                variant="glass"
                onClick={() => onNavigate('insights')}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-mono uppercase tracking-wider rounded-2xl min-h-[48px]"
                data-cursor="view"
              >
                <span>[ EXPLORE COHORT DATA ]</span>
              </MagneticButton>
            </motion.div>

            {/* Compact disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="pt-2 max-w-xl mx-auto lg:mx-0"
            >
              <DisclaimerBanner compact />
            </motion.div>
          </div>

          {/* Right Column: 3D Hero Element & Orbiting Apps (Beat 2) */}
          <div className="lg:col-span-5 flex items-center justify-center relative min-h-[380px] sm:min-h-[460px]">
            {/* Ambient Reactive Signal Orb in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
              <SignalOrb3D size="md" interactive={false} />
            </div>

            {/* Foreground Pinned Phone with Orbiting Social Apps */}
            <div className="relative z-10 w-full flex items-center justify-center">
              <HeroPhoneOrbit />
            </div>
          </div>
        </div>

        {/* Small uppercase caption & scroll prompt */}
        <div className="w-full flex justify-center items-center pt-4 pb-2 text-[10px] sm:text-xs font-mono text-content-muted tracking-widest uppercase">
          <div className="flex items-center gap-1.5 animate-bounce">
            <span>SCROLL TO DISCOVER</span>
            <ChevronDown className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </section>

      {/* Beat 3: Proof-number strip counting up */}
      <ProofNumbersStrip />

      {/* Scrolling Platform Ticker */}
      <section className="border-b border-border-subtle bg-card/30 backdrop-blur-sm">
        <PlatformMarquee />
      </section>

      {/* Interactive Pipeline Explorer: "How the model thinks" */}
      <PipelineExplorer />

      {/* 4-Step Stepper: "How it works" */}
      <HowItWorksStepper onStartPredictor={onStartPredictor} />

      {/* Feature Showcase Grid with Plate 01 / Plate 02 Numbering */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase block mb-1">
            04 // THE APPLICATION SUITE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-content-primary">
            Modular Plates for <span className="text-gradient">Student Well-being</span>
          </h2>
          <p className="text-xs sm:text-sm text-content-muted mt-2">
            Independent research tools calibrated to uncover cognitive resilience metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plates.map((plate) => {
            const Icon = plate.icon;
            return (
              <SpotlightCard
                key={plate.plate}
                onClick={() => onNavigate(plate.page)}
                className="cursor-pointer h-full transition-transform hover:-translate-y-1.5"
                data-cursor="view"
              >
                <div className="p-7 flex flex-col justify-between h-full space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-primary">
                        [{plate.plate}]
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-subtle border border-border-subtle text-content-muted">
                        {plate.tag}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-content-primary font-display mb-2">
                      {plate.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
                      {plate.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-subtle text-xs font-mono font-semibold text-primary">
                    <span>[ LAUNCH PLATE ]</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Model Transparency & Governance Card Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <div className="p-8 sm:p-10 rounded-3xl border border-border-subtle bg-gradient-to-br from-card to-subtle/50 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>MODEL TRANSPARENCY & ETHICS SPECIFICATION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-content-primary">
                Tuned Random Forest Regressor · Version 2.4.0
              </h3>
              <p className="text-xs sm:text-sm text-content-secondary max-w-2xl leading-relaxed">
                Trained on 5,000 student records with 5-fold cross-validation, achieving an R² of 0.864 and MAE of ±0.37.
                Complete feature weights, data cards, and ethical considerations are published in the Model Governance Card.
              </p>
            </div>
            <MagneticButton
              variant="glass"
              onClick={() => onNavigate('model-card')}
              className="px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap rounded-2xl"
              data-cursor="view"
            >
              [ VIEW MODEL CARD DETAILS ]
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
