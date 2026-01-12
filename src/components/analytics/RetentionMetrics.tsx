'use client';

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type RetentionPeriod = 'daily' | 'weekly' | 'monthly';
export type TimeRange = '7d' | '30d' | '90d' | '365d';

export type RetentionDataPoint = {
  period: number;
  retained: number;
  percentage: number;
};

export type RetentionCurve = {
  cohort: string;
  startDate: Date;
  userCount: number;
  data: RetentionDataPoint[];
  avgRetention: number;
};

export type RetentionSegment = {
  id: string;
  name: string;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  trend: number;
};

export type RetentionBenchmark = {
  metric: string;
  yourValue: number;
  industryAvg: number;
  topPerformers: number;
  percentile: number;
};

export type RetentionStats = {
  overallRetention30d: number;
  overallRetention90d: number;
  retentionTrend: number;
  avgSessionsPerUser: number;
  avgTimeToFirstValue: number;
  reactivatedUsers: number;
  atRiskUsers: number;
  churnedThisMonth: number;
};

export type RetentionMetricsProps = {
  curves?: RetentionCurve[];
  segments?: RetentionSegment[];
  benchmarks?: RetentionBenchmark[];
  stats?: RetentionStats;
  variant?: 'full' | 'compact' | 'widget' | 'curve';
  period?: RetentionPeriod;
  timeRange?: TimeRange;
  onPeriodChange?: (period: RetentionPeriod) => void;
  onTimeRangeChange?: (range: TimeRange) => void;
  onExport?: () => void;
  className?: string;
};

// Mock data generators
const generateMockCurves = (): RetentionCurve[] => [
  {
    cohort: 'This Week',
    startDate: new Date(),
    userCount: 1250,
    data: [
      { period: 0, retained: 1250, percentage: 100 },
      { period: 1, retained: 875, percentage: 70 },
      { period: 2, retained: 688, percentage: 55 },
      { period: 3, retained: 563, percentage: 45 },
      { period: 4, retained: 500, percentage: 40 },
      { period: 5, retained: 463, percentage: 37 },
      { period: 6, retained: 438, percentage: 35 },
      { period: 7, retained: 413, percentage: 33 },
    ],
    avgRetention: 52,
  },
  {
    cohort: 'Last Week',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    userCount: 1180,
    data: [
      { period: 0, retained: 1180, percentage: 100 },
      { period: 1, retained: 802, percentage: 68 },
      { period: 2, retained: 614, percentage: 52 },
      { period: 3, retained: 495, percentage: 42 },
      { period: 4, retained: 437, percentage: 37 },
      { period: 5, retained: 401, percentage: 34 },
      { period: 6, retained: 378, percentage: 32 },
      { period: 7, retained: 354, percentage: 30 },
    ],
    avgRetention: 49,
  },
  {
    cohort: '2 Weeks Ago',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    userCount: 1320,
    data: [
      { period: 0, retained: 1320, percentage: 100 },
      { period: 1, retained: 950, percentage: 72 },
      { period: 2, retained: 752, percentage: 57 },
      { period: 3, retained: 620, percentage: 47 },
      { period: 4, retained: 554, percentage: 42 },
      { period: 5, retained: 514, percentage: 39 },
      { period: 6, retained: 488, percentage: 37 },
      { period: 7, retained: 462, percentage: 35 },
    ],
    avgRetention: 54,
  },
];

const generateMockSegments = (): RetentionSegment[] => [
  { id: 'seg-1', name: 'Free Users', day1: 45, day7: 22, day30: 12, day90: 8, trend: -2.5 },
  { id: 'seg-2', name: 'Pro Users', day1: 78, day7: 55, day30: 42, day90: 35, trend: 4.2 },
  { id: 'seg-3', name: 'Team Users', day1: 85, day7: 68, day30: 58, day90: 52, trend: 6.8 },
  { id: 'seg-4', name: 'Enterprise', day1: 92, day7: 82, day30: 75, day90: 71, trend: 3.1 },
  { id: 'seg-5', name: 'Mobile Only', day1: 52, day7: 28, day30: 15, day90: 9, trend: -4.5 },
  { id: 'seg-6', name: 'Desktop Only', day1: 68, day7: 45, day30: 32, day90: 25, trend: 1.2 },
];

const generateMockBenchmarks = (): RetentionBenchmark[] => [
  { metric: 'Day 1 Retention', yourValue: 65, industryAvg: 55, topPerformers: 75, percentile: 72 },
  { metric: 'Day 7 Retention', yourValue: 42, industryAvg: 35, topPerformers: 52, percentile: 68 },
  { metric: 'Day 30 Retention', yourValue: 28, industryAvg: 22, topPerformers: 38, percentile: 65 },
  { metric: 'DAU/MAU Ratio', yourValue: 32, industryAvg: 25, topPerformers: 45, percentile: 62 },
];

const generateMockStats = (): RetentionStats => ({
  overallRetention30d: 28.5,
  overallRetention90d: 18.2,
  retentionTrend: 3.5,
  avgSessionsPerUser: 4.2,
  avgTimeToFirstValue: 3.5,
  reactivatedUsers: 450,
  atRiskUsers: 1280,
  churnedThisMonth: 890,
});

export function RetentionMetrics({
  curves: propCurves,
  segments: propSegments,
  benchmarks: propBenchmarks,
  stats: propStats,
  variant = 'full',
  period = 'weekly',
  onPeriodChange,
  onExport,
  className = '',
}: RetentionMetricsProps) {
  const [activePeriod, setActivePeriod] = useState<RetentionPeriod>(period);
  const [activeView, setActiveView] = useState<'curve' | 'segments' | 'benchmarks'>('curve');

  const curves = propCurves || generateMockCurves();
  const segments = propSegments || generateMockSegments();
  const benchmarks = propBenchmarks || generateMockBenchmarks();
  const stats = propStats || generateMockStats();

  const handlePeriodChange = (newPeriod: RetentionPeriod) => {
    setActivePeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const maxPeriod = useMemo(() => {
    return Math.max(...curves.flatMap(c => c.data.map(d => d.period)));
  }, [curves]);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Retention</h3>
          </div>
          <span className={`flex items-center gap-1 text-sm ${stats.retentionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.retentionTrend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(stats.retentionTrend)}
            %
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.overallRetention30d}
              %
            </p>
            <p className="text-xs text-gray-500">30-Day Retention</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.overallRetention90d}
              %
            </p>
            <p className="text-xs text-gray-500">90-Day Retention</p>
          </div>
        </div>
      </div>
    );
  }

  // Curve variant (retention curve visualization)
  if (variant === 'curve') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Retention Curve</h3>
          </div>
        </div>

        {/* Simple bar visualization for retention curve */}
        <div className="space-y-4">
          {curves[0]?.data.map(point => (
            <div key={point.period} className="flex items-center gap-4">
              <span className="w-16 text-sm text-gray-500 dark:text-gray-400">
                Day
                {' '}
                {point.period}
              </span>
              <div className="h-8 flex-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${point.percentage}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium text-gray-900 dark:text-white">
                {point.percentage}
                %
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Retention Metrics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">User retention analysis</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.overallRetention30d}
              %
            </p>
            <p className="text-sm text-gray-500">30-Day Retention</p>
            <p className={`mt-1 flex items-center gap-1 text-xs ${stats.retentionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.retentionTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stats.retentionTrend >= 0 ? '+' : ''}
              {stats.retentionTrend}
              % from last period
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.overallRetention90d}
              %
            </p>
            <p className="text-sm text-gray-500">90-Day Retention</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
            <p className="text-lg font-bold text-blue-600">{stats.avgSessionsPerUser}</p>
            <p className="text-xs text-gray-500">Sessions/User</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
            <p className="text-lg font-bold text-yellow-600">{stats.atRiskUsers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">At Risk</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
            <p className="text-lg font-bold text-green-600">{stats.reactivatedUsers}</p>
            <p className="text-xs text-gray-500">Reactivated</p>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Retention Metrics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Analyze user retention and engagement</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              {(['daily', 'weekly', 'monthly'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activePeriod === p
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={onExport}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-5 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">30-Day</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.overallRetention30d}
              %
            </p>
            <p className={`flex items-center gap-1 text-xs ${stats.retentionTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.retentionTrend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(stats.retentionTrend)}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">90-Day</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.overallRetention90d}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Time to Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgTimeToFirstValue}
              m
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">At Risk</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.atRiskUsers.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Reactivated</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reactivatedUsers}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 p-2">
          {(['curve', 'segments', 'benchmarks'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {view === 'curve' && 'Retention Curve'}
              {view === 'segments' && 'By Segment'}
              {view === 'benchmarks' && 'Benchmarks'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'curve' && (
          <div>
            <div className="mb-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Retention by Cohort</h3>
              {/* Retention curve visualization */}
              <div className="space-y-6">
                {curves.map(curve => (
                  <div key={curve.cohort}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{curve.cohort}</span>
                      <span className="text-sm text-gray-500">
                        {curve.userCount.toLocaleString()}
                        {' '}
                        users
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {curve.data.map((point, index) => (
                        <div key={index} className="flex-1">
                          <div
                            className="h-8 rounded transition-all"
                            style={{
                              backgroundColor: `rgba(16, 185, 129, ${point.percentage / 100})`,
                            }}
                            title={`Day ${point.period}: ${point.percentage}%`}
                          />
                          <p className="mt-1 text-center text-xs text-gray-500">
                            D
                            {point.period}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Period labels */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700">
              <span>Day 0 (Signup)</span>
              <ArrowRight className="h-4 w-4" />
              <span>
                Day
                {maxPeriod}
              </span>
            </div>
          </div>
        )}

        {activeView === 'segments' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Retention by User Segment</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="pb-3 font-medium">Segment</th>
                    <th className="pb-3 text-center font-medium">Day 1</th>
                    <th className="pb-3 text-center font-medium">Day 7</th>
                    <th className="pb-3 text-center font-medium">Day 30</th>
                    <th className="pb-3 text-center font-medium">Day 90</th>
                    <th className="pb-3 text-center font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {segments.map(segment => (
                    <tr key={segment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{segment.name}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          segment.day1 >= 70
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : segment.day1 >= 50
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                        >
                          {segment.day1}
                          %
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          segment.day7 >= 50
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : segment.day7 >= 30
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                        >
                          {segment.day7}
                          %
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          segment.day30 >= 30
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : segment.day30 >= 15
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                        >
                          {segment.day30}
                          %
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          segment.day90 >= 20
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : segment.day90 >= 10
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                        >
                          {segment.day90}
                          %
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`flex items-center justify-center gap-1 text-sm ${segment.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {segment.trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {Math.abs(segment.trend)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'benchmarks' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Industry Benchmarks</h3>
            <div className="space-y-4">
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">{benchmark.metric}</span>
                    <span className="text-sm text-gray-500">
                      {benchmark.percentile}
                      th percentile
                    </span>
                  </div>
                  <div className="relative h-6 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    {/* Industry average marker */}
                    <div
                      className="absolute top-0 bottom-0 z-10 w-0.5 bg-gray-400"
                      style={{ left: `${benchmark.industryAvg}%` }}
                    />
                    {/* Top performers marker */}
                    <div
                      className="absolute top-0 bottom-0 z-10 w-0.5 bg-green-400"
                      style={{ left: `${benchmark.topPerformers}%` }}
                    />
                    {/* Your value */}
                    <div
                      className={`h-full rounded-full transition-all ${
                        benchmark.yourValue >= benchmark.industryAvg ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${benchmark.yourValue}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Your:
                      {' '}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {benchmark.yourValue}
                        %
                      </span>
                    </span>
                    <span className="text-gray-500">
                      Industry:
                      {' '}
                      <span className="font-medium">
                        {benchmark.industryAvg}
                        %
                      </span>
                    </span>
                    <span className="text-gray-500">
                      Top:
                      {' '}
                      <span className="font-medium text-green-600">
                        {benchmark.topPerformers}
                        %
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RetentionMetrics;
