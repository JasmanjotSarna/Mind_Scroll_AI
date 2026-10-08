import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Brain,
  Smartphone,
  Moon,
  Zap,
  Sliders,
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SplitText } from '../components/fx/SplitText';
import { HeroPhoneOrbit } from '../components/fx/HeroPhoneOrbit';
import { PlatformMarquee } from '../components/fx/PlatformMarquee';
import { MagneticButton } from '../components/fx/MagneticButton';
import { SpotlightCard } from '../components/fx/SpotlightCard';
import { TiltCard } from '../components/fx/TiltCard';

interface LandingPageProps {
  onStartPredictor: () => void;
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPredictor,
  onNavigate,
}) => {
  const statCards = [
    {
      label: 'Avg Daily Screen Time',
      value: '5.1 hrs',
      subtext: 'Up to 9.2 hrs peak in high-stress student clusters',
      icon: Smartphone,
      gradient: 'from-orange-500/20 to-amber-500/10',
      border: 'border-orange-500/30',
      iconColor: 'text-orange-400',
    },
    {
      label: 'Sleep & Wellness Link',
      value: '+0.77',
      subtext: 'Strongest positive predictive protective buffer against cognitive fatigue',
      icon: Moon,
      gradient: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Model Accuracy',
      value: '86.4% R²',
      subtext: 'Tuned Random Forest Regressor evaluated on 5,000 students',
      icon: Brain,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Precision Lifestyle Scoring',
      desc: 'Predict your mental wellness index (3.6 – 9.4) based on real multi-factor regression models.',
      page: 'predictor',
    },
    {
      icon: Sliders,
      title: 'Live What-If Simulator',
      desc: 'Tweak sleep hours, screen time, and exercise with real-time score delta feedback.',
      page: 'simulator',
    },
    {
      icon: BarChart3,
      title: 'Population Insights',
      desc: 'Explore interactive distributions, sleep correlations, and platform breakdowns with instant filters.',
      page: 'insights',
    },
  ];

  return (
    <div className="relative w-full">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85dvh] flex items-center justify-center px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & Call to Action (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-primary/30 text-xs font-semibold text-primary shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>Machine Learning Research & Assessment</span>
            </motion.div>

            {/* Split Text Heading with Fluid clamp() */}
            <h1 className="text-[clamp(2.1rem,6vw,4.5rem)] font-extrabold tracking-tight font-display leading-[1.08] text-content-primary">
              <span className="block">How does your</span>
              <span className="text-gradient-orange block mt-1">
                <SplitText type="chars" delay={0.15}>
                  screen time
                </SplitText>
              </span>
              <span className="block mt-1">affect your mind?</span>
            </h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-sm sm:text-lg text-content-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Unpack the hidden mathematical correlations between social media consumption,
              sleep hygiene, academic stress, and mental well-being across 5,000 students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <MagneticButton
                strength={0.25}
                onClick={onStartPredictor}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base rounded-2xl shadow-xl shadow-primary/25 min-h-[48px]"
                data-cursor="view"
              >
                <span>Check My Score</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <MagneticButton
                strength={0.2}
                variant="glass"
                onClick={() => onNavigate('insights')}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-4 text-xs sm:text-sm rounded-2xl min-h-[48px]"
                data-cursor="view"
              >
                <BarChart3 className="w-4 h-4 text-primary" />
                <span>Explore Dataset Insights</span>
              </MagneticButton>
            </motion.div>

            {/* Disclaimer Bar under Hero */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-2 sm:pt-4 max-w-xl mx-auto lg:mx-0"
            >
              <DisclaimerBanner compact />
            </motion.div>
          </div>

          {/* Right Column: 3D Looping Phone Element & Orbiting Apps (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <HeroPhoneOrbit />
          </div>
        </div>
      </section>

      {/* Infinite Platform Marquee */}
      <section className="border-y border-border-subtle bg-card/40 backdrop-blur-md">
        <PlatformMarquee />
      </section>

      {/* 3 Animated Stat Cards from Dataset */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            Empirical Findings
          </span>
          <h2 className="text-3xl font-bold font-display text-content-primary mt-1">
            Insights from 5,000 Student Records
          </h2>
          <p className="text-xs text-content-muted mt-2">
            Aggregated empirical findings extracted from real academic and digital lifestyle surveys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <TiltCard key={card.label} maxTilt={10}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-content-muted">
                      {card.label}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-subtle ${card.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-display text-content-primary tracking-tight">
                    {card.value}
                  </div>
                  <p className="text-xs text-content-secondary mt-2 leading-relaxed">
                    {card.subtext}
                  </p>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* Feature Showcase Grid with Spotlight Hover Effects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-primary">
            Interactive Suite
          </span>
          <h2 className="text-3xl font-bold font-display text-content-primary mt-1">
            Engineered for Deep Behavioral Clarity
          </h2>
          <p className="text-xs text-content-muted mt-2">
            Tools designed to help students, mentors, and researchers understand and balance digital stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <SpotlightCard
                key={feat.title}
                onClick={() => onNavigate(feat.page)}
                className="cursor-pointer h-full transition-transform hover:-translate-y-1"
                data-cursor="view"
              >
                <div className="p-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-content-primary font-display mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-content-secondary leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Scientific Transparency Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <GlassCard className="p-8 border border-border-subtle bg-subtle/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Transparent Machine Learning Pipeline</span>
              </div>
              <h3 className="text-xl font-bold font-display text-content-primary">
                Tuned Random Forest Regression Pipeline
              </h3>
              <p className="text-xs text-content-secondary max-w-2xl leading-relaxed">
                Evaluated against Linear Regression baseline, yielding a test MAE of ±0.37 on 4,998 survey responses.
                Study hours receive logarithmic transforms while screen time and sleep metrics undergo zero-mean standard scaling.
              </p>
            </div>
            <MagneticButton
              variant="glass"
              onClick={() => onNavigate('model-card')}
              className="px-6 py-3 text-xs font-semibold whitespace-nowrap"
              data-cursor="view"
            >
              View Full Model Card
            </MagneticButton>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
