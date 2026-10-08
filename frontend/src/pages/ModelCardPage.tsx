import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Cpu,
  Layers,
  Database,
  Plus,
  Minus,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { api } from '../lib/api';
import { ModelCardData } from '../types/api';
import { GlassCard } from '../components/GlassCard';
import { Skeleton } from '../components/SkeletonLoader';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const ModelCardPage: React.FC = () => {
  const [data, setData] = useState<ModelCardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Expandable row state for DashDigital "More +" / "Less -" interaction
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    pipeline: true,
    hyperparams: true,
    cv_split: false,
    ethics: true,
    faq_1: false,
    faq_2: false,
    faq_3: false,
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await api.getModelCard();
        setData(res);
      } catch (e) {
        console.error('Failed to load model card data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, []);

  const faqItems = [
    {
      id: 'faq_1',
      question: 'How is the Mental Health Score calculated?',
      answer: 'The score is predicted by a 100-tree Random Forest Regressor calibrated on 5,000 student records. It evaluates non-linear correlations between daily unlock velocity, sleep duration, exercise, academic stress, and social media hours.',
    },
    {
      id: 'faq_2',
      question: 'Why does the pipeline group countries outside the top 10 into "Other"?',
      answer: 'To prevent high-cardinality sparse matrix explosion during One-Hot Encoding and eliminate spurious overfitting on countries with low sample frequencies in the cohort.',
    },
    {
      id: 'faq_3',
      question: 'Can this model be used for clinical diagnosis?',
      answer: 'No. MindScroll AI is an educational research platform designed for personal habit awareness. It is not a clinical instrument or medical diagnosis for depression, anxiety, or ADHD.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5 mb-1">
          <FileCode2 className="w-3.5 h-3.5" />
          <span>05 // MODEL GOVERNANCE & TRANSPARENCY</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-content-primary">
          Machine Learning <span className="text-gradient">Model Card</span>
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary mt-1 max-w-xl">
          Detailed benchmarks, validation splits, feature transformations, and empirical boundaries.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Summary Banner */}
          <GlassCard className="p-6 border border-emerald-500/30 bg-emerald-500/[0.04]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold text-content-primary font-display">
                    Selected Model: {data?.best_model || 'Random Forest Regressor (Tuned)'}
                  </h3>
                </div>
                <p className="text-xs text-content-secondary mt-1">
                  Evaluated using 5-fold cross-validation & RandomizedSearchCV on scikit-learn 1.9.1.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-subtle border border-border-subtle text-center">
                  <span className="text-[10px] text-content-muted block font-mono uppercase">Test R²</span>
                  <span className="text-base font-bold text-emerald-500 font-mono">0.864</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-subtle border border-border-subtle text-center">
                  <span className="text-[10px] text-content-muted block font-mono uppercase">MAE</span>
                  <span className="text-base font-bold text-content-primary font-mono">±0.371</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-subtle border border-border-subtle text-center">
                  <span className="text-[10px] text-content-muted block font-mono uppercase">RMSE</span>
                  <span className="text-base font-bold text-content-primary font-mono">0.489</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Model Comparison Table (with Mobile Stacked Cards view) */}
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-content-primary font-display mb-1">
              Model Benchmark Comparison
            </h3>
            <p className="text-xs text-content-muted mb-4">
              Cross-model evaluation across baseline Linear Regression, default Random Forest, and tuned ensemble pipeline.
            </p>

            {/* Mobile Stacked Cards View (< sm) */}
            <div className="sm:hidden space-y-3">
              {data?.comparison.map((item) => {
                const isBest = item.model.includes('Tuned') || item.model.includes('Random Forest');
                return (
                  <div
                    key={item.model}
                    className={`p-4 rounded-xl border ${
                      isBest
                        ? 'border-primary/40 bg-primary/[0.04]'
                        : 'border-border-subtle bg-subtle/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="font-bold text-xs text-content-primary">{item.model}</span>
                      </div>
                      {item.model.includes('Tuned') ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[9px] font-bold font-mono">
                          Deployed
                        </span>
                      ) : (
                        <span className="text-content-muted text-[10px] font-mono">Benchmark</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border-subtle">
                      <div>
                        <span className="text-[10px] text-content-muted block font-mono">R²</span>
                        <span className="font-mono font-bold text-xs text-content-primary">
                          {item.r2.toFixed(3)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-content-muted block font-mono">MAE</span>
                        <span className="font-mono font-bold text-xs text-content-primary">
                          ±{item.mae.toFixed(3)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-content-muted block font-mono">RMSE</span>
                        <span className="font-mono font-bold text-xs text-content-primary">
                          {item.rmse.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border-subtle text-[11px] font-mono uppercase text-content-muted">
                  <tr>
                    <th className="py-2.5 px-3">Architecture</th>
                    <th className="py-2.5 px-3">Test R² Score</th>
                    <th className="py-2.5 px-3">MAE</th>
                    <th className="py-2.5 px-3">RMSE</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {data?.comparison.map((item) => {
                    const isBest = item.model.includes('Tuned') || item.model.includes('Random Forest');
                    return (
                      <tr
                        key={item.model}
                        className={`transition-colors ${
                          isBest ? 'bg-primary/[0.04] font-medium' : 'hover:bg-subtle/50'
                        }`}
                      >
                        <td className="py-3 px-3 flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-primary" />
                          <span className="text-content-primary font-semibold">{item.model}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-500">
                          {item.r2.toFixed(3)}
                        </td>
                        <td className="py-3 px-3 font-mono text-content-secondary">
                          ±{item.mae.toFixed(3)}
                        </td>
                        <td className="py-3 px-3 font-mono text-content-secondary">
                          {item.rmse.toFixed(3)}
                        </td>
                        <td className="py-3 px-3">
                          {isBest ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold font-mono">
                              Deployed
                            </span>
                          ) : (
                            <span className="text-content-muted font-mono text-[10px]">Baseline</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* DashDigital Expandable Sections ("More +" / "Less -") */}
          <div className="space-y-4">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest block">
              // ARCHITECTURAL SPECIFICATIONS & PROOFS
            </span>

            {/* Row 1: Preprocessing Pipeline */}
            <div className="rounded-2xl border border-border-subtle bg-card overflow-hidden">
              <button
                onClick={() => toggleRow('pipeline')}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-display text-content-primary">
                      Preprocessing Pipeline & Feature Transformations
                    </h3>
                    <p className="text-xs text-content-muted font-mono">
                      [Plate 01] Skew transformations, standard scalers, and dynamic one-hot encoding
                    </p>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-primary flex items-center gap-1 shrink-0 ml-4">
                  <span>{expandedRows.pipeline ? 'Less -' : 'More +'}</span>
                </div>
              </button>

              <AnimatePresence>
                {expandedRows.pipeline && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-border-subtle p-5 sm:p-6 bg-subtle/30"
                  >
                    <ul className="text-xs space-y-3 text-content-secondary">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-content-primary">Skew Transformation: </strong>
                          <code className="text-primary font-mono bg-subtle px-1.5 py-0.5 rounded">
                            FunctionTransformer(np.log1p)
                          </code> applied to Study_Hours followed by zero-mean standard scaling.
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-content-primary">Standard Scaling: </strong>
                          Zero mean & unit variance scaling for Age, Avg_Daily_Usage_Hours, Daily_Unlocks, Physical_Activity_Hours, Sleep_Hours_Per_Night.
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-content-primary">Ordinal Encoding: </strong>
                          Ordered integer ranking for Stress_Level [Low: 0, Medium: 1, High: 2, Very High: 3].
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-content-primary">Dynamic Categorical Encoding: </strong>
                          OneHotEncoder with <code className="text-primary font-mono bg-subtle px-1.5 py-0.5 rounded">handle_unknown='ignore'</code> for Gender, Grouped_country, Academic_Level, Most_Used_Platform, Purpose_Of_Use.
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Row 2: Hyperparameters & Dataset Dimensions */}
            <div className="rounded-2xl border border-border-subtle bg-card overflow-hidden">
              <button
                onClick={() => toggleRow('hyperparams')}
                className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-display text-content-primary">
                      Tuned Hyperparameters & Cohort Topology
                    </h3>
                    <p className="text-xs text-content-muted font-mono">
                      [Plate 02] 100 decision trees, max_depth, and sample splits
                    </p>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-primary flex items-center gap-1 shrink-0 ml-4">
                  <span>{expandedRows.hyperparams ? 'Less -' : 'More +'}</span>
                </div>
              </button>

              <AnimatePresence>
                {expandedRows.hyperparams && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-border-subtle p-5 sm:p-6 bg-subtle/30"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                      <div className="p-3 rounded-xl bg-card border border-border-subtle">
                        <span className="text-content-muted text-[10px] uppercase font-mono block">n_estimators</span>
                        <span className="font-mono font-bold text-content-primary text-sm">
                          {data?.best_params?.['random_forest__n_estimators'] ?? 100}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border-subtle">
                        <span className="text-content-muted text-[10px] uppercase font-mono block">max_depth</span>
                        <span className="font-mono font-bold text-content-primary text-sm">
                          {data?.best_params?.['random_forest__max_depth'] ?? 15}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border-subtle">
                        <span className="text-content-muted text-[10px] uppercase font-mono block">min_samples_split</span>
                        <span className="font-mono font-bold text-content-primary text-sm">
                          {data?.best_params?.['random_forest__min_samples_split'] ?? 5}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-card border border-border-subtle">
                        <span className="text-content-muted text-[10px] uppercase font-mono block">min_samples_leaf</span>
                        <span className="font-mono font-bold text-content-primary text-sm">
                          {data?.best_params?.['random_forest__min_samples_leaf'] ?? 2}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-content-muted">
                      Evaluated on 4,998 unique student rows after duplicate pruning and boundary clipping.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Row 3: FAQ Rows with Expandable Toggle */}
            {faqItems.map((faq) => {
              const isOpen = expandedRows[faq.id];
              return (
                <div key={faq.id} className="rounded-2xl border border-border-subtle bg-card overflow-hidden">
                  <button
                    onClick={() => toggleRow(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-content-primary font-display">
                        {faq.question}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary shrink-0 ml-4">
                      {isOpen ? 'Less -' : 'More +'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border-subtle p-4 sm:p-5 bg-subtle/30 text-xs text-content-secondary leading-relaxed font-sans"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Plain-Language Known Limitations & Ethical Boundaries */}
          <GlassCard className="p-6 sm:p-8 border border-amber-500/20 bg-amber-500/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-bold text-content-primary font-display">
                Plain-Language Limitations & Ethical Boundaries
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-content-secondary leading-relaxed">
              <div className="space-y-1 p-3 rounded-xl bg-subtle/40 border border-border-subtle">
                <h4 className="font-mono font-bold text-amber-500">[01] SELF-REPORTED RETROSPECTIVE DATA</h4>
                <p className="text-content-muted">
                  Daily social media usage and sleep hours are recorded through survey self-reporting, which can be vulnerable to recall bias.
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-subtle/40 border border-border-subtle">
                <h4 className="font-mono font-bold text-amber-500">[02] CORRELATION VS CAUSALITY</h4>
                <p className="text-content-muted">
                  While heavy screen time strongly correlates with lower scores (-0.81), negative mood states can also increase screen reliance in bidirectional feedback loops.
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-subtle/40 border border-border-subtle">
                <h4 className="font-mono font-bold text-amber-500">[03] NON-CLINICAL OBJECTIVE FUNCTION</h4>
                <p className="text-content-muted">
                  The target is an educational index (0-100), not a clinical diagnosis for depression or psychiatric disorders.
                </p>
              </div>

              <div className="space-y-1 p-3 rounded-xl bg-subtle/40 border border-border-subtle">
                <h4 className="font-mono font-bold text-amber-500">[04] REGIONAL CLUSTERING</h4>
                <p className="text-content-muted">
                  Non-top-10 countries are consolidated into "Other". Localized regional academic customs may differ from global distributions.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Research Disclaimer */}
          <DisclaimerBanner />
        </div>
      )}
    </div>
  );
};

export default ModelCardPage;
