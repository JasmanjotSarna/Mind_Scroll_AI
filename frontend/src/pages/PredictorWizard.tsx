import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Smartphone,
  HeartPulse,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Clock,
  Unlock,
  BookOpen,
  Dumbbell,
  Moon
} from 'lucide-react';
import { PredictRequest, DatasetOptionsResponse } from '../types/api';
import { GlassCard } from '../components/GlassCard';
import { PredictorSkeleton } from '../components/SkeletonLoader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MagneticButton } from '../components/fx/MagneticButton';
import { SignalOrb3D } from '../components/fx/SignalOrb3D';

interface PredictorWizardProps {
  options: DatasetOptionsResponse | null;
  loadingOptions: boolean;
  onPredict: (data: PredictRequest) => Promise<void>;
  isPredicting: boolean;
  initialValues?: PredictRequest | null;
  onRetryOptions: () => void;
}

export const PredictorWizard: React.FC<PredictorWizardProps> = ({
  options,
  loadingOptions,
  onPredict,
  isPredicting,
  initialValues,
  onRetryOptions,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Form State initialized with defaults
  const [formData, setFormData] = useState<PredictRequest>(() => {
    if (initialValues) return initialValues;
    return {
      Age: 21,
      Gender: 'Female',
      Country: 'USA',
      Academic_Level: 'Undergraduate',
      Most_Used_Platform: 'Instagram',
      Purpose_Of_Use: 'Entertainment',
      Avg_Daily_Usage_Hours: 5.5,
      Daily_Unlocks: 80,
      Study_Hours: 4.0,
      Physical_Activity_Hours: 1.0,
      Sleep_Hours_Per_Night: 6.5,
      Stress_Level: 'Medium',
    };
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof PredictRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const steps = [
    { number: 1, title: 'About You', icon: User, desc: 'Demographics & academic status' },
    { number: 2, title: 'Social Media', icon: Smartphone, desc: 'Usage patterns & screen habits' },
    { number: 3, title: 'Lifestyle & Sleep', icon: HeartPulse, desc: 'Rest, activity & stress' },
    { number: 4, title: 'Review & Predict', icon: CheckCircle2, desc: 'Confirmation before ML run' },
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.Gender) errors.Gender = 'Select your gender';
      if (!formData.Country) errors.Country = 'Select your country';
      if (!formData.Academic_Level) errors.Academic_Level = 'Select academic level';
      if (formData.Age < 10 || formData.Age > 80) errors.Age = 'Enter age between 10 and 80';
    } else if (step === 2) {
      if (!formData.Most_Used_Platform) errors.Most_Used_Platform = 'Select most used platform';
      if (!formData.Purpose_Of_Use) errors.Purpose_Of_Use = 'Select primary purpose';
      if (formData.Avg_Daily_Usage_Hours < 0 || formData.Avg_Daily_Usage_Hours > 24)
        errors.Avg_Daily_Usage_Hours = 'Usage must be between 0 and 24 hours';
    } else if (step === 3) {
      if (!formData.Stress_Level) errors.Stress_Level = 'Select stress level';
      if (formData.Sleep_Hours_Per_Night < 0 || formData.Sleep_Hours_Per_Night > 24)
        errors.Sleep_Hours_Per_Night = 'Sleep must be between 0 and 24 hours';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      await onPredict(formData);
    }
  };

  // Directional Animation Variants
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.25, ease: 'easeIn' as const },
    }),
  };

  if (loadingOptions) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <PredictorSkeleton />
      </div>
    );
  }

  if (!options) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <GlassCard className="border-rose-500/30">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-content-primary">Could Not Load Dataset Parameters</h3>
          <p className="text-xs text-content-secondary mt-2">
            The backend API is unreachable or still starting up. Please check if the FastAPI server is running.
          </p>
          <button
            onClick={onRetryOptions}
            className="mt-6 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </GlassCard>
      </div>
    );
  }

  if (isPredicting) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="w-full h-full rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display text-content-primary">
              Evaluating Predictive Pipeline...
            </h3>
            <p className="text-xs text-content-secondary mt-2 max-w-sm mx-auto">
              Transforming features through ColumnTransformer, computing skew adjustments, and running Random Forest Regressor inference.
            </p>
          </div>
          <PredictorSkeleton />
        </motion.div>
      </div>
    );
  }

  const estimatedScore = Math.max(
    20,
    Math.min(
      95,
      65 -
        (formData.Avg_Daily_Usage_Hours - 4) * 3 +
        (formData.Sleep_Hours_Per_Night - 6) * 4 -
        (formData.Stress_Level === 'Very High'
          ? 18
          : formData.Stress_Level === 'High'
          ? 10
          : formData.Stress_Level === 'Medium'
          ? 0
          : -8) +
        (formData.Physical_Activity_Hours - 1) * 3
    )
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 relative">
      {/* Background Signal Orb reacting to inputs */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-25 z-0 overflow-hidden">
        <SignalOrb3D score={estimatedScore} stressLevel={formData.Stress_Level as any} size="lg" interactive={false} />
      </div>

      <div className="relative z-10">
        {/* Title & Large Step Counter */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              [ STEP 0{currentStep} / 04 ]
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25">
              SIGNAL TRACKER
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-content-primary">
            Student Lifestyle <span className="text-gradient">Predictor</span>
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1.5 max-w-md mx-auto">
            Complete the four sections below to calibrate your mental health signal.
          </p>
        </div>

        {/* Progress Bar & Steps Tabs */}
        <div className="mb-6 sm:mb-8">
        {/* Mobile Compact Step Header (< sm) */}
        <div className="sm:hidden flex items-center justify-between p-3 rounded-xl glass-panel border border-border-subtle mb-3">
          <div className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: 'w-4 h-4 text-primary' })}
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                Step {currentStep} of 4
              </span>
              <span className="text-xs font-bold text-content-primary">
                {steps[currentStep - 1].title}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <div
                key={s.number}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s.number === currentStep
                    ? 'bg-primary scale-125 shadow-sm shadow-primary'
                    : s.number < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-border-subtle'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tablet & Desktop Step Grid (>= sm) */}
        <div className="hidden sm:grid grid-cols-4 gap-2 mb-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  if (s.number < currentStep || validateStep(currentStep)) {
                    setDirection(s.number > currentStep ? 1 : -1);
                    setCurrentStep(s.number);
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'glass-panel border-primary/50 bg-primary/[0.08] shadow-lg shadow-primary/10'
                    : isDone
                    ? 'glass-panel border-emerald-500/30 text-emerald-500'
                    : 'glass-panel border-border-subtle text-content-muted opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-primary' : isDone ? 'text-emerald-500' : 'text-content-muted'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Step {s.number}
                  </span>
                </div>
                <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-content-primary' : 'text-content-secondary'}`}>
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Linear Progress Indicator with Neon Glow */}
        <div className="w-full h-1.5 bg-subtle rounded-full overflow-hidden border border-border-subtle relative">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-hover shadow-lg shadow-primary"
            initial={{ width: '25%' }}
            animate={{ width: `${(currentStep / 4) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </div>

      {/* Main Form Wizard Card */}
      <GlassCard className="p-6 sm:p-8 border border-border-subtle shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait" custom={direction}>
            {/* STEP 1: ABOUT YOU */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-display text-content-primary">About You</h2>
                  <p className="text-xs text-content-secondary mt-1">
                    Demographic indicators used for population normalization.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Age */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-content-primary">Age</label>
                      <span className="text-xs font-mono text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10">
                        {formData.Age} years
                      </span>
                    </div>
                    <input
                      type="range"
                      min={options.numeric_ranges.Age.min}
                      max={options.numeric_ranges.Age.max}
                      step={1}
                      value={formData.Age}
                      onChange={(e) => updateField('Age', parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
                      <span>{options.numeric_ranges.Age.min}</span>
                      <span>Avg: {options.numeric_ranges.Age.mean}</span>
                      <span>{options.numeric_ranges.Age.max}</span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle">
                    <label className="text-xs font-semibold text-content-primary block mb-2">Gender</label>
                    <div className="grid grid-cols-2 gap-2">
                      {options.genders.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => updateField('Gender', g)}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                            formData.Gender === g
                              ? 'border-primary bg-primary/15 text-primary font-bold shadow-sm'
                              : 'border-border-subtle text-content-secondary hover:text-content-primary hover:bg-card-hover'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle">
                    <label className="text-xs font-semibold text-content-primary block mb-1.5">
                      Country of Residence
                    </label>
                    <select
                      value={formData.Country}
                      onChange={(e) => updateField('Country', e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-input border border-border-subtle text-xs text-content-primary focus:outline-none focus:border-primary transition-colors shadow-sm"
                    >
                      {options.countries.map((c) => (
                        <option key={c} value={c}>
                          {c} {options.top_10_countries.includes(c) ? '★' : ''}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] text-content-muted block mt-1.5">
                      ★ Top 10 represented countries in the dataset
                    </span>
                  </div>

                  {/* Academic Level */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle">
                    <label className="text-xs font-semibold text-content-primary block mb-1.5">
                      Academic Level
                    </label>
                    <select
                      value={formData.Academic_Level}
                      onChange={(e) => updateField('Academic_Level', e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-input border border-border-subtle text-xs text-content-primary focus:outline-none focus:border-primary transition-colors shadow-sm"
                    >
                      {options.academic_levels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: SOCIAL MEDIA HABITS */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-display text-content-primary">Social Media Consumption</h2>
                  <p className="text-xs text-content-secondary mt-1">
                    Platform preferences, engagement purpose, and daily screen exposure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Primary Platform */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle">
                    <label className="text-xs font-semibold text-content-primary block mb-1.5">
                      Most Used Platform
                    </label>
                    <select
                      value={formData.Most_Used_Platform}
                      onChange={(e) => updateField('Most_Used_Platform', e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-input border border-border-subtle text-xs text-content-primary focus:outline-none focus:border-primary transition-colors"
                    >
                      {options.platforms.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle">
                    <label className="text-xs font-semibold text-content-primary block mb-1.5">
                      Primary Purpose of Use
                    </label>
                    <select
                      value={formData.Purpose_Of_Use}
                      onChange={(e) => updateField('Purpose_Of_Use', e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-input border border-border-subtle text-xs text-content-primary focus:outline-none focus:border-primary transition-colors"
                    >
                      {options.purposes.map((purp) => (
                        <option key={purp} value={purp}>
                          {purp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Avg Daily Usage Hours Slider */}
                  <div className="sm:col-span-2 p-5 rounded-xl bg-subtle/60 border border-border-subtle">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <label className="text-xs font-semibold text-content-primary">
                          Average Daily Social Media Usage
                        </label>
                      </div>
                      <span className="text-base font-mono font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        {formData.Avg_Daily_Usage_Hours.toFixed(1)} hrs/day
                      </span>
                    </div>
                    <input
                      type="range"
                      min={options.numeric_ranges.Avg_Daily_Usage_Hours.min}
                      max={options.numeric_ranges.Avg_Daily_Usage_Hours.max}
                      step={0.1}
                      value={formData.Avg_Daily_Usage_Hours}
                      onChange={(e) => updateField('Avg_Daily_Usage_Hours', parseFloat(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
                      <span>{options.numeric_ranges.Avg_Daily_Usage_Hours.min}h (Minimal)</span>
                      <span>Dataset Mean: {options.numeric_ranges.Avg_Daily_Usage_Hours.mean}h</span>
                      <span>{options.numeric_ranges.Avg_Daily_Usage_Hours.max}h (Heavy)</span>
                    </div>
                  </div>

                  {/* Daily Phone Unlocks Slider */}
                  <div className="sm:col-span-2 p-5 rounded-xl bg-subtle/60 border border-border-subtle">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-primary" />
                        <label className="text-xs font-semibold text-content-primary">
                          Daily Phone Unlocks / Pickups
                        </label>
                      </div>
                      <span className="text-base font-mono font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        {formData.Daily_Unlocks} unlocks
                      </span>
                    </div>
                    <input
                      type="range"
                      min={options.numeric_ranges.Daily_Unlocks.min}
                      max={options.numeric_ranges.Daily_Unlocks.max}
                      step={1}
                      value={formData.Daily_Unlocks}
                      onChange={(e) => updateField('Daily_Unlocks', parseInt(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
                      <span>{options.numeric_ranges.Daily_Unlocks.min} unlocks</span>
                      <span>Avg: {options.numeric_ranges.Daily_Unlocks.mean}</span>
                      <span>{options.numeric_ranges.Daily_Unlocks.max} unlocks</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LIFESTYLE & SLEEP */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-display text-content-primary">Lifestyle & Recovery</h2>
                  <p className="text-xs text-content-secondary mt-1">
                    Sleep duration, physical exercise, study habits, and psychological stress.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Sleep Hours Slider */}
                  <div className="p-5 rounded-xl bg-subtle/60 border border-border-subtle">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-purple-400" />
                        <label className="text-xs font-semibold text-content-primary">
                          Sleep Hours Per Night
                        </label>
                      </div>
                      <span className="text-base font-mono font-bold text-purple-500 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                        {formData.Sleep_Hours_Per_Night.toFixed(1)} hrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={options.numeric_ranges.Sleep_Hours_Per_Night.min}
                      max={options.numeric_ranges.Sleep_Hours_Per_Night.max}
                      step={0.25}
                      value={formData.Sleep_Hours_Per_Night}
                      onChange={(e) => updateField('Sleep_Hours_Per_Night', parseFloat(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
                      <span>{options.numeric_ranges.Sleep_Hours_Per_Night.min}h</span>
                      <span>Healthy Target: 7.0 - 8.5h</span>
                      <span>{options.numeric_ranges.Sleep_Hours_Per_Night.max}h</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Physical Activity Slider */}
                    <div className="p-5 rounded-xl bg-subtle/60 border border-border-subtle">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-emerald-500" />
                          <label className="text-xs font-semibold text-content-primary">
                            Daily Physical Activity
                          </label>
                        </div>
                        <span className="text-sm font-mono font-bold text-emerald-500">
                          {formData.Physical_Activity_Hours.toFixed(2)}h
                        </span>
                      </div>
                      <input
                        type="range"
                        min={options.numeric_ranges.Physical_Activity_Hours.min}
                        max={options.numeric_ranges.Physical_Activity_Hours.max}
                        step={0.25}
                        value={formData.Physical_Activity_Hours}
                        onChange={(e) => updateField('Physical_Activity_Hours', parseFloat(e.target.value))}
                        className="w-full mt-2"
                      />
                      <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
                        <span>0h (Sedentary)</span>
                        <span>{options.numeric_ranges.Physical_Activity_Hours.max}h (Active)</span>
                      </div>
                    </div>

                    {/* Study Hours */}
                    <div className="p-5 rounded-xl bg-subtle/60 border border-border-subtle">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          <label className="text-xs font-semibold text-content-primary">
                            Daily Study Hours
                          </label>
                        </div>
                        <span className="text-sm font-mono font-bold text-blue-500">
                          {formData.Study_Hours.toFixed(1)}h
                        </span>
                      </div>
                      <input
                        type="range"
                        min={options.numeric_ranges.Study_Hours.min}
                        max={options.numeric_ranges.Study_Hours.max}
                        step={0.5}
                        value={formData.Study_Hours}
                        onChange={(e) => updateField('Study_Hours', parseFloat(e.target.value))}
                        className="w-full mt-2"
                      />
                      <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
                        <span>0h</span>
                        <span>Avg: {options.numeric_ranges.Study_Hours.mean}h</span>
                        <span>{options.numeric_ranges.Study_Hours.max}h</span>
                      </div>
                    </div>
                  </div>

                  {/* Segmented Control for Stress Level with Sliding Pill (layoutId) */}
                  <div className="p-5 rounded-xl bg-subtle/60 border border-border-subtle">
                    <label className="text-xs font-semibold text-content-primary block mb-3">
                      Subjective Academic & Life Stress Level
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-input/70 p-1.5 rounded-2xl border border-border-subtle relative">
                      {options.stress_levels.map((lvl) => {
                        const isSelected = formData.Stress_Level === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updateField('Stress_Level', lvl)}
                            className={`relative py-3 px-2 rounded-xl text-xs font-semibold transition-colors focus:outline-none z-10 ${
                              isSelected ? 'text-white' : 'text-content-secondary hover:text-content-primary'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="stress-pill"
                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-hover shadow-md shadow-primary/30 z-[-1]"
                                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                              />
                            )}
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW & PREDICT */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold font-display text-content-primary">Review Your Inputs</h2>
                  <p className="text-xs text-content-secondary mt-1">
                    Check your profile summary before executing the machine learning model.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Demographics Card */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </div>
                    <div className="text-xs text-content-secondary space-y-1">
                      <p><span className="text-content-muted">Age:</span> {formData.Age} years</p>
                      <p><span className="text-content-muted">Gender:</span> {formData.Gender}</p>
                      <p><span className="text-content-muted">Country:</span> {formData.Country}</p>
                      <p><span className="text-content-muted">Academic:</span> {formData.Academic_Level}</p>
                    </div>
                  </div>

                  {/* Media Card */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Social Media</span>
                    </div>
                    <div className="text-xs text-content-secondary space-y-1">
                      <p><span className="text-content-muted">App:</span> {formData.Most_Used_Platform}</p>
                      <p><span className="text-content-muted">Purpose:</span> {formData.Purpose_Of_Use}</p>
                      <p><span className="text-content-muted">Usage:</span> <strong className="text-content-primary">{formData.Avg_Daily_Usage_Hours.toFixed(1)}h / day</strong></p>
                      <p><span className="text-content-muted">Unlocks:</span> {formData.Daily_Unlocks} / day</p>
                    </div>
                  </div>

                  {/* Lifestyle Card */}
                  <div className="p-4 rounded-xl bg-subtle/60 border border-border-subtle space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Lifestyle</span>
                    </div>
                    <div className="text-xs text-content-secondary space-y-1">
                      <p><span className="text-content-muted">Sleep:</span> <strong className="text-content-primary">{formData.Sleep_Hours_Per_Night.toFixed(1)}h / night</strong></p>
                      <p><span className="text-content-muted">Activity:</span> {formData.Physical_Activity_Hours.toFixed(2)}h / day</p>
                      <p><span className="text-content-muted">Study:</span> {formData.Study_Hours.toFixed(1)}h / day</p>
                      <p><span className="text-content-muted">Stress:</span> <span className="font-semibold text-primary">{formData.Stress_Level}</span></p>
                    </div>
                  </div>
                </div>

                <DisclaimerBanner compact />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation & Submit Buttons with Touch Targets >= 44px */}
          <div className="mt-8 pt-5 border-t border-border-subtle flex flex-row items-center justify-between gap-3">
            {currentStep > 1 ? (
              <MagneticButton
                type="button"
                variant="glass"
                strength={0.2}
                onClick={prevStep}
                className="px-5 py-3 text-xs font-mono font-semibold min-h-[48px] flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>[ PREV STEP ]</span>
              </MagneticButton>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <MagneticButton
                type="button"
                strength={0.25}
                onClick={nextStep}
                className="px-6 py-3 text-xs font-mono font-semibold min-h-[48px] flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white"
              >
                <span>[ NEXT STEP ]</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            ) : (
              <MagneticButton
                type="submit"
                strength={0.3}
                disabled={isPredicting}
                className="px-5 sm:px-8 py-3.5 text-xs sm:text-sm font-mono font-bold shadow-xl shadow-primary/30 min-h-[48px] flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white"
              >
                <Sparkles className="w-4 h-4" />
                <span>[ RUN INFERENCE ]</span>
              </MagneticButton>
            )}
          </div>
        </form>
      </GlassCard>
      </div>
    </div>
  );
};
