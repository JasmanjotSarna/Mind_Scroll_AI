import React, { useEffect, useState } from 'react';
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
  Wind,
  Copy,
  Check
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
import { SignalOrb3D } from '../components/fx/SignalOrb3D';
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
  const [copied, setCopied] = useState(false);

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

  const handleCopySummary = () => {
    const summaryText = `MindScroll AI // Mental Health Assessment
-------------------------------------------
Predicted Score: ${result.score.toFixed(2)} / 10.0 (${result.band})
Stress Level: ${input.Stress_Level}
Daily Screen Time: ${input.Avg_Daily_Usage_Hours} hrs/day
Daily Unlocks: ${input.Daily_Unlocks}
Sleep: ${input.Sleep_Hours_Per_Night} hrs/night
Physical Activity: ${input.Physical_Activity_Hours} hrs/day

Key Factors:
${result.top_factors.map((f) => `• ${f.factor} (${f.impact}): ${f.description}`).join('\n')}

Recommendations:
${result.suggestions.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}
-------------------------------------------
Educational research platform powered by tuned Random Forest regressor.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    onToast('Summary Copied', 'Assessment copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
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
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary block mb-1">
            04 // ASSESSMENT SYNTHESIS
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-content-primary">
            Your Mental Wellness <span className="text-gradient">Signal</span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Summary Button */}
          <button
            onClick={handleCopySummary}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl border border-border-subtle bg-card hover:bg-card-hover text-xs font-mono font-semibold transition-all min-h-[44px] flex items-center gap-2 text-content-primary"
            title="Copy Text Summary to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-primary" />}
            <span>[ {copied ? 'COPIED' : 'COPY SUMMARY'} ]</span>
          </button>

          <MagneticButton
            variant="glass"
            strength={0.15}
            onClick={handleDownloadPDF}
            className="px-3.5 sm:px-4 py-2.5 text-xs font-mono font-semibold min-h-[44px] flex items-center gap-2"
            data-cursor="view"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>[ DOWNLOAD PDF ]</span>
          </MagneticButton>

          <MagneticButton
            strength={0.2}
            onClick={onSimulate}
            className="px-3.5 sm:px-4 py-2.5 text-xs font-mono font-semibold min-h-[44px] flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white"
            data-cursor="view"
          >
            <Sliders className="w-4 h-4" />
            <span>[ TRY WHAT-IF ]</span>
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

      {/* Main Hero Results Grid with Reactive Signal Orb & Sweeping Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8">
        {/* Left Column: Sweeping Gauge with Settling Orb (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden h-full">
            {/* Ambient Settling 3D Signal Orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <SignalOrb3D score={result.score * 10} stressLevel={input.Stress_Level as any} size="sm" interactive={false} />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold mb-2">
                ESTIMATED WELLNESS SCORE
              </span>

              {/* Sweeping Gauge with Glowing Trail */}
              <div className="my-3">
                <ScoreGauge score={result.score} size={280} />
              </div>

              {/* Band Label Pill */}
              <div
                className="mt-3 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border inline-flex items-center gap-2"
                style={{
                  backgroundColor: `${band.color}18`,
                  borderColor: `${band.color}45`,
                  color: band.color,
                }}
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: band.color }} />
                <span>[{band.band} PROFILE]</span>
              </div>

              <p className="text-xs sm:text-sm text-content-secondary mt-3 max-w-md leading-relaxed font-sans">
                Calibrated against 5,000 student records. Category: <strong className="text-content-primary">{result.band}</strong>.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Key Metrics Telemetry (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <GlassCard className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider block mb-1">
                TELEMETRY CONTEXT
              </span>
              <h3 className="text-base font-bold font-display text-content-primary mb-3">
                Student Profile Baseline
              </h3>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-content-muted">Reported Stress:</span>
                  <span className="font-bold text-content-primary">{input.Stress_Level}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-content-muted">Daily Screen Time:</span>
                  <span className="font-bold text-primary">{input.Avg_Daily_Usage_Hours} hrs/day</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-content-muted">Phone Pickups:</span>
                  <span className="font-bold text-content-primary">{input.Daily_Unlocks} unlocks</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border-subtle">
                  <span className="text-content-muted">Sleep Duration:</span>
                  <span className="font-bold text-emerald-500">{input.Sleep_Hours_Per_Night} hrs/night</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-content-muted">Active Exercise:</span>
                  <span className="font-bold text-content-primary">{input.Physical_Activity_Hours} hrs/day</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Driving Factors Chart with Sequential Animation */}
      <GlassCard className="p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase block mb-1">
              LATENT INFLUENCES
            </span>
            <h2 className="text-xl font-bold font-display text-content-primary">
              What's Driving Your Score
            </h2>
            <p className="text-xs text-content-muted mt-0.5">
              Impact of individual lifestyle factors relative to cohort baselines (+ pushes score up, - pulls score down).
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-content-secondary">Buffer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-content-secondary">Drag</span>
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

      {/* Actionable Recommendations with Plate 01 / Plate 02 Numbering */}
      <div className="mb-8">
        <div className="mb-4">
          <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase block mb-1">
            05 // INTERVENTION PROTOCOL
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-content-primary">
            Numbered Suggestion Plates
          </h2>
          <p className="text-xs text-content-muted mt-0.5">
            Non-clinical, behavioral micro-nudges tailored to your sleep and screen patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.suggestions.map((sug, idx) => (
            <GlassCard key={idx} className="p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-subtle border border-border-subtle shrink-0">
                    {getSuggestionIcon(sug.icon)}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-primary font-bold">
                      [Plate 0{idx + 1}]
                    </span>
                    <h4 className="text-sm font-bold text-content-primary">{sug.title}</h4>
                  </div>
                </div>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed font-sans">
                {sug.description}
              </p>
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
            className="px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent text-white"
            data-cursor="view"
          >
            [ LAUNCH WHAT-IF SIMULATOR ]
          </MagneticButton>
        </div>
      </GlassCard>

      {/* Visible Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
};

export default ResultPage;
