import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Cpu,
  Layers,
  Database,
} from 'lucide-react';
import { api } from '../lib/api';
import { ModelCardData } from '../types/api';
import { GlassCard } from '../components/GlassCard';
import { Skeleton } from '../components/SkeletonLoader';

export const ModelCardPage: React.FC = () => {
  const [data, setData] = useState<ModelCardData | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5" />
          Model Governance & Transparency
        </span>
        <h1 className="text-3xl font-extrabold font-display text-content-primary mt-1">
          Machine Learning Model Card
        </h1>
        <p className="text-xs text-content-secondary mt-1">
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
                  <span className="text-[10px] text-content-muted block uppercase">Test R²</span>
                  <span className="text-base font-bold text-emerald-500 font-mono">0.864</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-subtle border border-border-subtle text-center">
                  <span className="text-[10px] text-content-muted block uppercase">MAE</span>
                  <span className="text-base font-bold text-content-primary font-mono">±0.371</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-subtle border border-border-subtle text-center">
                  <span className="text-[10px] text-content-muted block uppercase">RMSE</span>
                  <span className="text-base font-bold text-content-primary font-mono">0.489</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Model Comparison Table */}
          <GlassCard className="p-6">
            <h3 className="text-base font-bold text-content-primary font-display mb-2">
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
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[9px] font-bold">
                          Deployed
                        </span>
                      ) : (
                        <span className="text-content-muted text-[10px]">Benchmark</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border-subtle">
                      <div>
                        <span className="text-content-muted block text-[10px]">Testing R²</span>
                        <span className="font-mono font-bold text-emerald-500">{item.r2.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-content-muted block text-[10px]">Training R²</span>
                        <span className="font-mono text-content-secondary">{item.train_r2.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-content-muted block text-[10px]">MAE</span>
                        <span className="font-mono text-content-secondary">{item.mae.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-content-muted block text-[10px]">RMSE</span>
                        <span className="font-mono text-content-secondary">{item.rmse.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop / Tablet Table View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-content-muted text-[11px] uppercase">
                    <th className="py-3 px-4 font-semibold">Model Pipeline</th>
                    <th className="py-3 px-4 font-semibold">Testing R²</th>
                    <th className="py-3 px-4 font-semibold">Training R²</th>
                    <th className="py-3 px-4 font-semibold">MAE</th>
                    <th className="py-3 px-4 font-semibold">RMSE</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {data?.comparison.map((item) => {
                    const isBest = item.model.includes('Tuned') || item.model.includes('Random Forest');
                    return (
                      <tr key={item.model} className={isBest ? 'bg-primary/[0.04]' : ''}>
                        <td className="py-3.5 px-4 font-semibold text-content-primary flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-primary" />
                          <span>{item.model}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-500">
                          {item.r2.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-content-secondary">
                          {item.train_r2.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-content-secondary">
                          {item.mae.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-content-secondary">
                          {item.rmse.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.model.includes('Tuned') ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-semibold">
                              Deployed
                            </span>
                          ) : (
                            <span className="text-content-muted text-[10px]">Benchmark</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Hyperparameters & Pipeline Preprocessing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
                  Preprocessing Pipeline Details
                </h3>
              </div>
              <ul className="text-xs space-y-2.5 text-content-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-content-primary">Skew Transformation: </strong>
                    <code className="text-primary font-mono bg-subtle px-1.5 py-0.5 rounded">FunctionTransformer(np.log1p)</code> applied to Study_Hours followed by StandardScaler.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-content-primary">Standard Scaling: </strong>
                    Zero mean & unit variance scaling for Age, Avg_Daily_Usage_Hours, Daily_Unlocks, Physical_Activity_Hours, Sleep_Hours_Per_Night.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-content-primary">Ordinal Encoding: </strong>
                    Ordered levels for Stress_Level [Low, Medium, High, Very High].
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-content-primary">Dynamic Categorical Encoding: </strong>
                    OneHotEncoder with <code className="text-primary font-mono bg-subtle px-1.5 py-0.5 rounded">handle_unknown='ignore'</code> for Gender, Grouped_country, Academic_Level, Most_Used_Platform, Purpose_Of_Use.
                  </div>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider">
                  Tuned Hyperparameters
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-subtle/80 border border-border-subtle">
                  <span className="text-content-muted text-[10px] uppercase block">n_estimators</span>
                  <span className="font-mono font-bold text-content-primary text-sm">
                    {data?.best_params?.['random_forest__n_estimators'] ?? 100}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-subtle/80 border border-border-subtle">
                  <span className="text-content-muted text-[10px] uppercase block">max_depth</span>
                  <span className="font-mono font-bold text-content-primary text-sm">
                    {data?.best_params?.['random_forest__max_depth'] ?? 15}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-subtle/80 border border-border-subtle">
                  <span className="text-content-muted text-[10px] uppercase block">min_samples_split</span>
                  <span className="font-mono font-bold text-content-primary text-sm">
                    {data?.best_params?.['random_forest__min_samples_split'] ?? 5}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-subtle/80 border border-border-subtle">
                  <span className="text-content-muted text-[10px] uppercase block">min_samples_leaf</span>
                  <span className="font-mono font-bold text-content-primary text-sm">
                    {data?.best_params?.['random_forest__min_samples_leaf'] ?? 2}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-content-muted leading-relaxed border-t border-border-subtle pt-3">
                Total Dataset Size: <strong className="text-content-primary">4,998 unique student rows</strong> (after duplicate pruning and boundary clipping).
              </div>
            </GlassCard>
          </div>

          {/* Known Limitations & Ethical Boundaries */}
          <GlassCard className="p-6 border border-amber-500/20 bg-amber-500/[0.03]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-content-primary font-display">
                Known Limitations & Ethical Boundary Considerations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-content-secondary leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-semibold text-amber-500">1. Self-Reported Survey Data</h4>
                <p className="text-content-muted">
                  Daily social media usage and sleep hours are collected through retrospective student self-reporting,
                  which can introduce subjective bias compared to background passive telemetry.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-amber-500">2. Correlation is Not Causation</h4>
                <p className="text-content-muted">
                  While heavy screen time strongly correlates with lower scores (-0.81), negative emotional states may also drive
                  higher screen reliance (reverse causality or bidirectional feedback loops).
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-amber-500">3. Non-Clinical Objective Function</h4>
                <p className="text-content-muted">
                  The target metric is a synthetic wellness index (3.6 – 9.4), not a DSM-5 clinical diagnosis of depression, anxiety, or ADHD.
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-amber-500">4. Cultural & Regional Representation</h4>
                <p className="text-content-muted">
                  The dataset consolidates non-top-10 countries into "Other". Localized student lifestyle customs may not fully generalize across all demographics.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
