import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Moon,
  Clock,
  Dumbbell,
  HeartPulse,
  Info,
  Zap,
} from 'lucide-react';
import { PredictRequest, WhatIfResponse } from '../types/api';
import { api } from '../lib/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { GlassCard } from '../components/GlassCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MagneticButton } from '../components/fx/MagneticButton';
import { useTheme } from '../hooks/useTheme';

interface SimulatorPageProps {
  baselineInput: PredictRequest;
  onNavigate: (page: string) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  baselineInput,
  onNavigate,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Simulator editable values
  const [usage, setUsage] = useState(baselineInput.Avg_Daily_Usage_Hours);
  const [sleep, setSleep] = useState(baselineInput.Sleep_Hours_Per_Night);
  const [activity, setActivity] = useState(baselineInput.Physical_Activity_Hours);
  const [stress, setStress] = useState(baselineInput.Stress_Level);

  const [simulation, setSimulation] = useState<WhatIfResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<any>(null);

  // Debounced API call to /whatif
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.whatIf({
          baseline: baselineInput,
          Avg_Daily_Usage_Hours: usage,
          Sleep_Hours_Per_Night: sleep,
          Physical_Activity_Hours: activity,
          Stress_Level: stress,
        });
        setSimulation(res);
      } catch (err) {
        console.error('What-if error:', err);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [usage, sleep, activity, stress, baselineInput]);

  const handleReset = () => {
    setUsage(baselineInput.Avg_Daily_Usage_Hours);
    setSleep(baselineInput.Sleep_Hours_Per_Night);
    setActivity(baselineInput.Physical_Activity_Hours);
    setStress(baselineInput.Stress_Level);
  };

  const applyPreset = (preset: 'detox' | 'sleep' | 'exam' | 'active') => {
    if (preset === 'detox') {
      setUsage(1.5);
      setSleep(7.5);
      setActivity(1.5);
      setStress('Low');
    } else if (preset === 'sleep') {
      setSleep(8.5);
      setUsage(Math.max(1.0, baselineInput.Avg_Daily_Usage_Hours - 2.0));
      setStress('Low');
    } else if (preset === 'exam') {
      setUsage(6.5);
      setSleep(4.5);
      setActivity(0.2);
      setStress('Very High');
    } else if (preset === 'active') {
      setActivity(2.5);
      setSleep(8.0);
      setUsage(3.0);
      setStress('Medium');
    }
  };

  const delta = simulation ? simulation.delta : 0;
  const isPositive = delta > 0;
  const isNegative = delta < 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Interactive Simulation Laboratory
          </span>
          <h1 className="text-3xl font-extrabold font-display text-content-primary mt-1">
            What-If Habit Simulator
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Adjust lifestyle variables below to observe live predicted shifts against your baseline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MagneticButton
            variant="glass"
            strength={0.15}
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </MagneticButton>
        </div>
      </div>

      {/* Quick Scenario Presets */}
      <div className="mb-8">
        <label className="text-[11px] font-semibold text-content-muted uppercase tracking-wider block mb-2">
          Quick Preset Scenarios
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => applyPreset('detox')}
            className="p-3.5 rounded-xl glass-panel hover:border-emerald-500/50 hover:bg-emerald-500/[0.05] text-left transition-all group"
            data-cursor="drag"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Digital Detox</span>
            </div>
            <p className="text-[11px] text-content-secondary">1.5h screens, 7.5h sleep, active</p>
          </button>

          <button
            onClick={() => applyPreset('sleep')}
            className="p-3.5 rounded-xl glass-panel hover:border-purple-500/50 hover:bg-purple-500/[0.05] text-left transition-all group"
            data-cursor="drag"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-purple-500 mb-1">
              <Moon className="w-3.5 h-3.5" />
              <span>Sleep Optimization</span>
            </div>
            <p className="text-[11px] text-content-secondary">8.5h sleep, reduced night screen</p>
          </button>

          <button
            onClick={() => applyPreset('active')}
            className="p-3.5 rounded-xl glass-panel hover:border-amber-500/50 hover:bg-amber-500/[0.05] text-left transition-all group"
            data-cursor="drag"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Active Athlete</span>
            </div>
            <p className="text-[11px] text-content-secondary">2.5h exercise, 8.0h rest window</p>
          </button>

          <button
            onClick={() => applyPreset('exam')}
            className="p-3.5 rounded-xl glass-panel hover:border-rose-500/50 hover:bg-rose-500/[0.05] text-left transition-all group"
            data-cursor="drag"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500 mb-1">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Finals Exam Crunch</span>
            </div>
            <p className="text-[11px] text-content-secondary">4.5h sleep, high stress, 6.5h screens</p>
          </button>
        </div>
      </div>

      {/* Main Simulator Workspace (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Sliders Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Slider 1: Screen Time */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <label className="text-xs font-bold text-content-primary">Daily Screen Time</label>
              </div>
              <span className="text-base font-mono font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                {usage.toFixed(1)} hrs/day
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={12.0}
              step={0.1}
              value={usage}
              onChange={(e) => setUsage(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
              <span>Baseline: {baselineInput.Avg_Daily_Usage_Hours.toFixed(1)}h</span>
              <span className="text-primary font-medium">
                {usage < baselineInput.Avg_Daily_Usage_Hours
                  ? `${(baselineInput.Avg_Daily_Usage_Hours - usage).toFixed(1)}h less screen time`
                  : usage > baselineInput.Avg_Daily_Usage_Hours
                  ? `+${(usage - baselineInput.Avg_Daily_Usage_Hours).toFixed(1)}h more screen time`
                  : 'Same as baseline'}
              </span>
            </div>
          </GlassCard>

          {/* Slider 2: Sleep */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-500" />
                <label className="text-xs font-bold text-content-primary">Sleep Hours Per Night</label>
              </div>
              <span className="text-base font-mono font-bold text-purple-500 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                {sleep.toFixed(1)} hrs/night
              </span>
            </div>
            <input
              type="range"
              min={4.0}
              max={11.0}
              step={0.25}
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
              <span>Baseline: {baselineInput.Sleep_Hours_Per_Night.toFixed(1)}h</span>
              <span className="text-purple-500 font-medium">
                {sleep > baselineInput.Sleep_Hours_Per_Night
                  ? `+${(sleep - baselineInput.Sleep_Hours_Per_Night).toFixed(1)}h more rest`
                  : sleep < baselineInput.Sleep_Hours_Per_Night
                  ? `${(baselineInput.Sleep_Hours_Per_Night - sleep).toFixed(1)}h sleep deficit`
                  : 'Same as baseline'}
              </span>
            </div>
          </GlassCard>

          {/* Slider 3: Physical Activity */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-500" />
                <label className="text-xs font-bold text-content-primary">Daily Physical Activity</label>
              </div>
              <span className="text-base font-mono font-bold text-emerald-500 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {activity.toFixed(2)} hrs/day
              </span>
            </div>
            <input
              type="range"
              min={0.0}
              max={4.0}
              step={0.25}
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-[10px] text-content-muted mt-1.5">
              <span>Baseline: {baselineInput.Physical_Activity_Hours.toFixed(2)}h</span>
              <span className="text-emerald-500 font-medium">
                {activity > baselineInput.Physical_Activity_Hours
                  ? `+${(activity - baselineInput.Physical_Activity_Hours).toFixed(2)}h activity boost`
                  : 'Same as baseline'}
              </span>
            </div>
          </GlassCard>

          {/* Segmented Control: Stress */}
          <GlassCard className="p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-amber-500" />
                <label className="text-xs font-bold text-content-primary">Subjective Stress Level</label>
              </div>
              <span className="text-xs font-mono font-bold text-amber-500">
                Current: {stress}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 bg-input/70 p-1.5 rounded-2xl border border-border-subtle relative">
              {['Low', 'Medium', 'High', 'Very High'].map((lvl) => {
                const isSelected = stress === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStress(lvl)}
                    className={`relative py-2.5 px-2 rounded-xl text-xs font-semibold transition-colors focus:outline-none z-10 ${
                      isSelected ? 'text-white' : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="sim-stress-pill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-hover shadow-md shadow-primary/30 z-[-1]"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    {lvl}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Live Simulation Display Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Background Live Glow */}
            <div
              className={`absolute inset-0 blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${
                isPositive
                  ? 'bg-emerald-500'
                  : isNegative
                  ? 'bg-rose-500'
                  : 'bg-primary'
              }`}
            />

            <span className="text-[10px] uppercase font-bold tracking-widest text-content-muted mb-2">
              Live Predicted Score
            </span>

            {/* Gauge */}
            {simulation && (
              <ScoreGauge
                score={simulation.predicted_score}
                minScore={3.6}
                maxScore={9.4}
                size={260}
                showDetails={false}
              />
            )}

            {/* Animated Delta Badge with 3D Flip */}
            <div className="mt-4 flex items-center justify-center" style={{ perspective: 600 }}>
              <motion.div
                key={delta}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                className={`px-4 py-2 rounded-full border text-sm font-extrabold flex items-center gap-2 shadow-lg ${
                  isPositive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500 shadow-emerald-500/10'
                    : isNegative
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 shadow-rose-500/10'
                    : 'bg-subtle border-border-subtle text-content-secondary'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : isNegative ? (
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                ) : (
                  <Info className="w-4 h-4 text-content-muted" />
                )}
                <span>
                  {delta > 0 ? `+${delta.toFixed(2)}` : delta < 0 ? delta.toFixed(2) : '±0.00'}{' '}
                  Delta vs Baseline
                </span>
              </motion.div>
            </div>

            {/* Baseline comparison stats */}
            {simulation && (
              <div className="w-full mt-6 pt-5 border-t border-border-subtle grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-subtle/60 border border-border-subtle">
                  <span className="text-content-muted text-[10px] block uppercase">Baseline</span>
                  <span className="text-lg font-bold text-content-secondary font-display">
                    {simulation.baseline_score.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-content-muted block mt-0.5">
                    {simulation.baseline_band}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-subtle/60 border border-border-subtle">
                  <span className="text-content-muted text-[10px] block uppercase">Simulated</span>
                  <span className="text-lg font-bold text-content-primary font-display">
                    {simulation.predicted_score.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-primary block mt-0.5 font-semibold">
                    {simulation.predicted_band}
                  </span>
                </div>
              </div>
            )}

            {/* Simulation Explanatory Note */}
            {simulation && (
              <p className="text-xs text-content-secondary mt-4 leading-relaxed">
                {simulation.note}
              </p>
            )}
          </GlassCard>

          <DisclaimerBanner compact />
        </div>
      </div>
    </div>
  );
};
