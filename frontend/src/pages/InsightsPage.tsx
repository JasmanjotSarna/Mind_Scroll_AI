import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  Filter,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../lib/api';
import { InsightsResponse, DatasetOptionsResponse } from '../types/api';
import { GlassCard } from '../components/GlassCard';
import { Skeleton } from '../components/SkeletonLoader';
import { useTheme } from '../hooks/useTheme';

interface InsightsPageProps {
  options: DatasetOptionsResponse | null;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ options }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters
  const [genderFilter, setGenderFilter] = useState('All');
  const [academicFilter, setAcademicFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');

  const activeFiltersCount =
    (genderFilter !== 'All' ? 1 : 0) +
    (academicFilter !== 'All' ? 1 : 0) +
    (countryFilter !== 'All' ? 1 : 0);

  const fetchInsightsData = async () => {
    setLoading(true);
    try {
      const data = await api.getInsights({
        gender: genderFilter,
        academic_level: academicFilter,
        country: countryFilter,
      });
      setInsights(data);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, [genderFilter, academicFilter, countryFilter]);

  const resetFilters = () => {
    setGenderFilter('All');
    setAcademicFilter('All');
    setCountryFilter('All');
  };

  const corrVariables = [
    { key: 'Avg_Daily_Usage_Hours', label: 'Screen Time' },
    { key: 'Sleep_Hours_Per_Night', label: 'Sleep' },
    { key: 'Physical_Activity_Hours', label: 'Activity' },
    { key: 'Daily_Unlocks', label: 'Unlocks' },
    { key: 'Study_Hours', label: 'Study' },
    { key: 'Mental_Health_Score', label: 'Wellness' },
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 1) return isDark ? 'bg-white/20 text-white font-bold' : 'bg-black/15 text-content-primary font-bold';
    if (val > 0.5) return 'bg-emerald-500/25 text-emerald-600 dark:text-emerald-300 font-semibold';
    if (val > 0.2) return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400';
    if (val > 0) return 'bg-emerald-500/5 text-content-secondary';
    if (val < -0.6) return 'bg-rose-500/25 text-rose-600 dark:text-rose-300 font-semibold';
    if (val < -0.2) return 'bg-rose-500/15 text-rose-600 dark:text-rose-400';
    return 'bg-rose-500/5 text-content-secondary';
  };

  const axisStroke = isDark ? '#71717A' : '#9A8B80';
  const gridStroke = isDark ? '#27272A' : '#E5E7EB';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Exploratory Data Analysis
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-content-primary mt-1">
            Population Insights Dashboard
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Empirical relationships across 5,000 university and secondary school survey respondents.
          </p>
        </div>

        {/* Mobile Filter Trigger Button (< md) */}
        <div className="w-full md:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-panel border border-border-subtle text-xs font-semibold text-content-primary min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              <span>Filter Cohort</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
            <span className="text-[11px] text-primary font-bold">Adjust & Filter →</span>
          </button>
        </div>

        {/* Desktop Filter Controls Bar (>= md) */}
        <div className="hidden md:flex flex-wrap items-center gap-2.5 p-2 rounded-2xl glass-panel border border-border-subtle">
          <div className="flex items-center gap-1 text-xs text-content-muted px-2 font-medium">
            <Filter className="w-3.5 h-3.5 text-primary" />
            <span>Filters:</span>
          </div>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-input border border-border-subtle rounded-xl px-2.5 py-1.5 text-xs text-content-primary focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="All">All Genders</option>
            {options?.genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Academic Level Filter */}
          <select
            value={academicFilter}
            onChange={(e) => setAcademicFilter(e.target.value)}
            className="bg-input border border-border-subtle rounded-xl px-2.5 py-1.5 text-xs text-content-primary focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="All">All Academic Levels</option>
            {options?.academic_levels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-input border border-border-subtle rounded-xl px-2.5 py-1.5 text-xs text-content-primary focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="All">All Countries</option>
            {options?.top_10_countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-primary hover:underline px-2 py-1 font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-base/95 backdrop-blur-2xl border-t border-border-subtle rounded-t-3xl p-5 shadow-2xl max-h-[85dvh] overflow-y-auto pb-safe"
            >
              <div className="w-12 h-1.5 bg-border-subtle rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <h3 className="text-base font-bold text-content-primary font-display">
                    Filter Cohort Dimensions
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-xl text-content-muted hover:text-content-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-content-muted block mb-1.5">
                    Gender Identity
                  </label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full bg-input border border-border-subtle rounded-xl p-3 text-xs text-content-primary min-h-[44px]"
                  >
                    <option value="All">All Genders</option>
                    {options?.genders.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-content-muted block mb-1.5">
                    Academic Degree Level
                  </label>
                  <select
                    value={academicFilter}
                    onChange={(e) => setAcademicFilter(e.target.value)}
                    className="w-full bg-input border border-border-subtle rounded-xl p-3 text-xs text-content-primary min-h-[44px]"
                  >
                    <option value="All">All Academic Levels</option>
                    {options?.academic_levels.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-content-muted block mb-1.5">
                    Country of Residence
                  </label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full bg-input border border-border-subtle rounded-xl p-3 text-xs text-content-primary min-h-[44px]"
                  >
                    <option value="All">All Countries</option>
                    {options?.top_10_countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-3 text-xs font-semibold rounded-xl border border-border-subtle text-content-muted hover:text-content-primary min-h-[44px]"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-3 text-xs font-bold rounded-xl bg-primary text-white shadow-lg shadow-primary/25 min-h-[44px]"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cohort Key Metric Banners */}
      {insights && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-4">
            <span className="text-[10px] uppercase font-bold text-content-muted tracking-wider">Filtered Cohort</span>
            <div className="text-2xl font-bold font-display text-content-primary mt-1">
              {insights.key_stats.total_students.toLocaleString()} students
            </div>
            <span className="text-[10px] text-content-muted">In sample partition</span>
          </GlassCard>

          <GlassCard className="p-4">
            <span className="text-[10px] uppercase font-bold text-content-muted tracking-wider">Avg Mental Score</span>
            <div className="text-2xl font-bold font-display text-primary mt-1">
              {insights.key_stats.avg_score.toFixed(2)} / 10
            </div>
            <span className="text-[10px] text-content-muted">Range: 3.6 – 9.4</span>
          </GlassCard>

          <GlassCard className="p-4">
            <span className="text-[10px] uppercase font-bold text-content-muted tracking-wider">Avg Screen Time</span>
            <div className="text-2xl font-bold font-display text-orange-500 mt-1">
              {insights.key_stats.avg_daily_usage.toFixed(1)} hrs/day
            </div>
            <span className="text-[10px] text-content-muted">{insights.key_stats.avg_unlocks} phone unlocks</span>
          </GlassCard>

          <GlassCard className="p-4">
            <span className="text-[10px] uppercase font-bold text-content-muted tracking-wider">Avg Sleep</span>
            <div className="text-2xl font-bold font-display text-purple-500 mt-1">
              {insights.key_stats.avg_sleep.toFixed(1)} hrs/night
            </div>
            <span className="text-[10px] text-content-muted">{insights.key_stats.avg_physical_activity}h physical activity</span>
          </GlassCard>
        </div>
      )}

      {/* Charts Grid: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : insights ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {/* Chart 1: Score Distribution Histogram */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold font-display text-content-primary">
                Mental Health Score Distribution
              </h3>
              <p className="text-xs text-content-secondary">
                Frequency histogram across 12 discrete score bins.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.score_distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="bin" tick={{ fill: axisStroke, fontSize: 10 }} stroke={gridStroke} />
                  <YAxis tick={{ fill: axisStroke, fontSize: 10 }} stroke={gridStroke} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl border border-border-subtle text-xs shadow-xl">
                            <p className="font-bold text-content-primary">Score Bin: {d.bin}</p>
                            <p className="text-primary font-mono mt-1 font-semibold">Count: {d.count} ({d.pct}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#FF6B1A" radius={[4, 4, 0, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 2: Usage vs Score Scatter */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold font-display text-content-primary">
                Score vs. Daily Usage (Scatter Plot)
              </h3>
              <p className="text-xs text-content-secondary">
                Shows clear negative gradient as screen time rises past 5 hours.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    type="number"
                    dataKey="usage"
                    name="Daily Usage"
                    unit="h"
                    tick={{ fill: axisStroke, fontSize: 10 }}
                    stroke={gridStroke}
                  />
                  <YAxis
                    type="number"
                    dataKey="score"
                    name="Score"
                    domain={[3.5, 9.5]}
                    tick={{ fill: axisStroke, fontSize: 10 }}
                    stroke={gridStroke}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl border border-border-subtle text-xs shadow-xl">
                            <p className="font-bold text-content-primary">{d.platform} User</p>
                            <p className="text-content-secondary">Screen Time: {d.usage} hrs</p>
                            <p className="text-primary font-bold">Score: {d.score}</p>
                            <p className="text-content-muted text-[10px]">Stress: {d.stress} | Sleep: {d.sleep}h</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={insights.usage_vs_score} fill="#FF8A3D" opacity={0.75} isAnimationActive={true} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 3: Score by Stress Level */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold font-display text-content-primary">
                Score by Reported Stress Level
              </h3>
              <p className="text-xs text-content-secondary">
                Significant drop in wellness scores as stress shifts from Low to Very High.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.score_by_stress}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="stress_level" tick={{ fill: axisStroke, fontSize: 11 }} stroke={gridStroke} />
                  <YAxis domain={[0, 10]} tick={{ fill: axisStroke, fontSize: 10 }} stroke={gridStroke} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl border border-border-subtle text-xs shadow-xl">
                            <p className="font-bold text-content-primary">{d.stress_level} Stress</p>
                            <p className="text-emerald-500 font-mono font-semibold">Mean Score: {d.avg_score}</p>
                            <p className="text-content-secondary">Range: {d.min} - {d.max}</p>
                            <p className="text-content-muted">Avg Usage: {d.avg_usage} hrs/day</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avg_score" radius={[4, 4, 0, 0]} isAnimationActive={true}>
                    {insights.score_by_stress.map((entry, index) => {
                      const colors = {
                        Low: '#10B981',
                        Medium: '#F59E0B',
                        High: '#F97316',
                        'Very High': '#EF4444',
                      }[entry.stress_level] || '#FF6B1A';
                      return <Cell key={`cell-${index}`} fill={colors} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 4: Sleep Duration vs Score */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold font-display text-content-primary">
                Score vs. Sleep Duration
              </h3>
              <p className="text-xs text-content-secondary">
                Restful 7+ hour sleep windows directly correlate with higher cognitive scores.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insights.sleep_vs_score}>
                  <defs>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="sleep_range" tick={{ fill: axisStroke, fontSize: 10 }} stroke={gridStroke} />
                  <YAxis domain={[4, 9]} tick={{ fill: axisStroke, fontSize: 10 }} stroke={gridStroke} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl border border-border-subtle text-xs shadow-xl">
                            <p className="font-bold text-content-primary">Sleep: {d.sleep_range}</p>
                            <p className="text-purple-500 font-mono font-semibold">Avg Score: {d.avg_score}</p>
                            <p className="text-content-secondary">Sample Count: {d.student_count}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="avg_score"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#sleepGrad)"
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 5: Platform Usage Breakdown */}
          <GlassCard className="p-6">
            <div className="mb-4">
              <h3 className="text-base font-bold font-display text-content-primary">
                Platform Adoption & Average Scores
              </h3>
              <p className="text-xs text-content-secondary">
                Student count distribution across primary social apps.
              </p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={insights.platform_usage.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis type="number" tick={{ fill: axisStroke, fontSize: 10 }} stroke={gridStroke} />
                  <YAxis dataKey="platform" type="category" tick={{ fill: isDark ? '#D4D4D8' : '#1A1410', fontSize: 11 }} stroke={gridStroke} width={80} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="glass-panel p-2.5 rounded-xl border border-border-subtle text-xs shadow-xl">
                            <p className="font-bold text-content-primary">{d.platform}</p>
                            <p className="text-content-secondary">Students: {d.count}</p>
                            <p className="text-primary font-bold">Avg Score: {d.avg_score}</p>
                            <p className="text-content-muted">Avg Usage: {d.avg_usage}h/day</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 6: Correlation Heatmap (Spans full width across grid) */}
          <GlassCard className="p-6 md:col-span-2 xl:col-span-3">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold font-display text-content-primary">
                  Correlation Heatmap
                </h3>
                <p className="text-xs text-content-secondary">
                  Pearson correlation coefficients between numerical lifestyle variables.
                </p>
              </div>

              {/* Mobile Horizontal Scroll Hint */}
              <div className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-subtle text-[10px] text-content-muted border border-border-subtle self-start">
                <span>← Swipe table horizontally →</span>
              </div>
            </div>

            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <table className="w-full min-w-[500px] text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-content-muted font-normal"></th>
                    {corrVariables.map((v) => (
                      <th key={v.key} className="p-2 text-[10px] uppercase font-bold text-content-muted">
                        {v.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {corrVariables.map((row) => (
                    <tr key={row.key} className="border-t border-border-subtle">
                      <td className="p-2 text-left font-semibold text-content-primary text-[11px]">
                        {row.label}
                      </td>
                      {corrVariables.map((col) => {
                        const val = insights.correlation_matrix[row.key]?.[col.key] ?? 0;
                        return (
                          <td key={col.key} className="p-1">
                            <div
                              className={`py-2 px-1 rounded-lg text-xs font-mono transition-colors ${getHeatmapColor(
                                val
                              )}`}
                              title={`${row.label} vs ${col.label}: ${val}`}
                            >
                              {val > 0 && val !== 1 ? `+${val}` : val}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      ) : null}
    </div>
  );
};
