import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Download,
  Sliders,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Smartphone,
  Moon,
  Activity,
  HeartPulse,
  Sun,
  EyeOff,
  BellOff,
  Dumbbell,
  Wind
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { PredictResponse, PredictRequest } from '../types/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { ProgressRing } from '../components/ProgressRing';
import { GlassCard } from '../components/GlassCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { MagneticButton } from '../components/fx/MagneticButton';
import { getBandDetails } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';

interface ResultPageProps {
  result: PredictResponse;
  input: PredictRequest;
  onSimulate: () => void;
  onReset: () => void;
  onToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  input,
  onSimulate,
  onReset,
  onToast,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const band = getBandDetails(result.score);

  // Trigger celebration confetti if score is Good or Thriving
  useEffect(() => {
    if (result.score >= 6.6) {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B1A', '#FF8A3D', '#10B981', '#8B5CF6'],
        });
      } catch (e) {}
    }
  }, [result.score]);

  const handleDownloadPDF = () => {
    window.print();
    onToast('Exporting Report', 'Printer / PDF dialogue generated.', 'success');
  };

  const getSuggestionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-orange-500" />;
      case 'Moon': return <Moon className="w-5 h-5 text-purple-500" />;
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-500" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-emerald-500" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-pink-500" />;
      case 'EyeOff': return <EyeOff className="w-5 h-5 text-blue-500" />;
      case 'BellOff': return <BellOff className="w-5 h-5 text-amber-500" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-500" />;
      default: return <Lightbulb className="w-5 h-5 text-primary" />;
    }
  };

  const factorChartData = result.top_factors.map((f) => ({
    name: f.factor,
    weight: f.weight,
    impact: f.impact,
    description: f.description,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:py-2">
      {/* Action Bar (Top) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 no-print">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Analysis Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-content-primary">
            Your Mental Wellness Assessment
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <MagneticButton
            variant="glass"
            strength={0.15}
            onClick={handleDownloadPDF}
            className="px-3.5 sm:px-4 py-2.5 text-xs min-h-[44px] flex items-center gap-2"
            data-cursor="view"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Download PDF</span>
          </MagneticButton>

          <MagneticButton
            strength={0.2}
            onClick={onSimulate}
            className="px-3.5 sm:px-4 py-2.5 text-xs min-h-[44px] flex items-center gap-2"
            data-cursor="view"
          >
            <Sliders className="w-4 h-4" />
            <span>Simulate</span>
          </MagneticButton>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl glass-panel hover:bg-card-hover text-content-secondary hover:text-content-primary transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Start New Assessment"
            aria-label="Start new assessment"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Score & Band Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Animated Gauge Card */}
        <GlassCard className="lg:col-span-2 flex flex-col items-center justify-center p-4 sm:p-8 text-center relative overflow-hidden">
          <ScoreGauge score={result.score} minScore={3.6} maxScore={9.4} size={280} />

          <p className="text-xs text-content-secondary mt-6 max-w-lg leading-relaxed">
            {result.band_description}
          </p>

          <div className="mt-4 pt-4 border-t border-border-subtle w-full flex items-center justify-between text-[11px] text-content-muted font-mono">
            <span>Model: {result.confidence_note}</span>
            <span>Percentile: Top {result.percentile}%</span>
          </div>
        </GlassCard>

        {/* Quick Profile Summary & Percentile Ring */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-3">
              Cohort Standing
            </h3>
            <ProgressRing
              progress={result.percentile}
              size={120}
              strokeWidth={9}
              color={band.color}
              sublabel="Percentile"
            />
            <p className="text-xs text-content-secondary mt-4 leading-relaxed">
              Your predicted score ranks above{' '}
              <strong className="text-content-primary">{result.percentile}%</strong> of evaluated students in the dataset.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-content-muted">
              Input Snapshot
            </h3>
            <div className="text-xs space-y-2 text-content-secondary">
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-content-muted">Daily Screen Time</span>
                <span className="font-semibold text-content-primary">{input.Avg_Daily_Usage_Hours.toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-content-muted">Sleep Duration</span>
                <span className="font-semibold text-content-primary">{input.Sleep_Hours_Per_Night.toFixed(1)} hrs</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-1">
                <span className="text-content-muted">Physical Activity</span>
                <span className="font-semibold text-content-primary">{input.Physical_Activity_Hours.toFixed(2)} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Reported Stress</span>
                <span className="font-semibold text-primary">{input.Stress_Level}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Driving Factors Chart with Sequential Animation */}
      <GlassCard className="p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold font-display text-content-primary">
              What's Driving Your Score
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              Impact of individual lifestyle factors relative to cohort baselines (+ pushes score up, - pulls score down).
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-content-secondary">Positive Buffer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-content-secondary">Negative Drag</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={factorChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[-1.2, 1.2]}
                tick={{ fill: isDark ? '#71717A' : '#6B5E55', fontSize: 11 }}
                stroke={isDark ? '#27272A' : '#E5E7EB'}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: isDark ? '#D4D4D8' : '#1A1410', fontSize: 12, fontWeight: 500 }}
                stroke={isDark ? '#27272A' : '#E5E7EB'}
                width={130}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-panel p-3 rounded-xl border border-border-subtle shadow-xl text-xs max-w-xs">
                        <p className="font-bold text-content-primary">{data.name}</p>
                        <p className={`font-mono font-semibold mt-1 ${data.weight >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Estimated Weight: {data.weight > 0 ? `+${data.weight}` : data.weight}
                        </p>
                        <p className="text-content-secondary mt-1 leading-relaxed">{data.description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="weight" radius={[4, 4, 4, 4]} isAnimationActive={true} animationDuration={1200}>
                {factorChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.weight >= 0 ? '#10B981' : '#EF4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Factors Breakdown Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 pt-6 border-t border-border-subtle">
          {result.top_factors.map((f, i) => (
            <motion.div
              key={f.factor}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.4 }}
              className="p-3.5 rounded-xl bg-subtle/60 border border-border-subtle flex items-start gap-3"
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  f.impact === 'positive'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-rose-500/10 text-rose-500'
                }`}
              >
                {f.impact === 'positive' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
              <div className="text-xs">
                <span className="font-semibold text-content-primary">{f.factor}: </span>
                <span className="text-content-secondary">{f.description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Actionable Recommendations */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold font-display text-content-primary">
            Actionable Lifestyle Recommendations
          </h2>
          <p className="text-xs text-content-muted mt-0.5">
            Non-clinical, plain-language adjustments tailored to your sleep and screen patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.suggestions.map((sug, idx) => (
            <GlassCard key={idx} className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle shrink-0">
                {getSuggestionIcon(sug.icon)}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-content-primary">{sug.title}</h4>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {sug.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Simulator Bridge Banner */}
      <GlassCard className="p-6 mb-8 border border-primary/30 bg-primary/[0.04] no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-content-primary flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Wondering how small changes would improve this score?</span>
            </h3>
            <p className="text-xs text-content-secondary mt-1">
              Test what happens if you add 1 hour of sleep or reduce daily social media by 90 minutes.
            </p>
          </div>
          <MagneticButton
            strength={0.2}
            onClick={onSimulate}
            className="px-6 py-2.5 text-xs font-bold whitespace-nowrap shadow-lg shadow-primary/20"
            data-cursor="view"
          >
            Launch What-If Simulator
          </MagneticButton>
        </div>
      </GlassCard>

      {/* Visible Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};
