'use client';

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  RefreshCw,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type TimeRange = '7d' | '30d' | '90d' | '12m' | 'custom';
// MetricType is available for future use: type MetricType = 'users' | 'revenue' | 'retention' | 'engagement';

type CohortData = {
  cohort: string;
  size: number;
  retentionByWeek: number[];
};

type ChurnPrediction = {
  userId: string;
  email: string;
  riskScore: number;
  lastActive: string;
  daysInactive: number;
  predictedChurnDate?: string;
  factors: string[];
};

type MetricCard = {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease';
  format: 'number' | 'currency' | 'percentage';
  trend: number[];
};

type AdvancedAnalyticsDashboardProps = {
  variant?: 'full' | 'compact' | 'widget';
  onExport?: (format: 'csv' | 'pdf') => void;
  onDateRangeChange?: (range: TimeRange) => void;
  className?: string;
};

// Mock data
const mockMetrics: MetricCard[] = [
  {
    id: 'm1',
    title: 'Monthly Recurring Revenue',
    value: 52450,
    change: 12.5,
    changeType: 'increase',
    format: 'currency',
    trend: [42000, 44500, 46200, 48100, 50200, 52450],
  },
  {
    id: 'm2',
    title: 'Active Users',
    value: 12847,
    change: 8.3,
    changeType: 'increase',
    format: 'number',
    trend: [11200, 11450, 11800, 12100, 12500, 12847],
  },
  {
    id: 'm3',
    title: '30-Day Retention',
    value: 78.5,
    change: -2.1,
    changeType: 'decrease',
    format: 'percentage',
    trend: [82, 80.5, 79.8, 79.2, 78.8, 78.5],
  },
  {
    id: 'm4',
    title: 'Monthly Churn Rate',
    value: 3.2,
    change: 0.5,
    changeType: 'increase',
    format: 'percentage',
    trend: [2.4, 2.6, 2.8, 2.9, 3.0, 3.2],
  },
];

const mockCohorts: CohortData[] = [
  { cohort: 'Jan 2024', size: 1250, retentionByWeek: [100, 72, 58, 48, 42, 38, 35, 32] },
  { cohort: 'Feb 2024', size: 1480, retentionByWeek: [100, 75, 62, 52, 45, 40, 36] },
  { cohort: 'Mar 2024', size: 1320, retentionByWeek: [100, 70, 55, 46, 40, 35] },
  { cohort: 'Apr 2024', size: 1650, retentionByWeek: [100, 78, 64, 54, 48] },
  { cohort: 'May 2024', size: 1890, retentionByWeek: [100, 76, 60, 50] },
  { cohort: 'Jun 2024', size: 2100, retentionByWeek: [100, 74, 58] },
];

const mockChurnPredictions: ChurnPrediction[] = [
  { userId: 'u1', email: 'john@example.com', riskScore: 92, lastActive: '2024-01-05', daysInactive: 7, predictedChurnDate: '2024-01-20', factors: ['No logins in 7 days', 'Cancelled subscription inquiry', 'Low feature usage'] },
  { userId: 'u2', email: 'sarah@company.com', riskScore: 85, lastActive: '2024-01-08', daysInactive: 4, predictedChurnDate: '2024-01-25', factors: ['Decreased activity', 'Support ticket unresolved'] },
  { userId: 'u3', email: 'mike@startup.io', riskScore: 78, lastActive: '2024-01-10', daysInactive: 2, factors: ['Team size reduced', 'Billing issue'] },
  { userId: 'u4', email: 'emma@design.co', riskScore: 65, lastActive: '2024-01-11', daysInactive: 1, factors: ['Export frequency dropped', 'Competitor research detected'] },
];

const formatValue = (value: number | string, format: 'number' | 'currency' | 'percentage'): string => {
  if (typeof value === 'string') {
    return value;
  }
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'number':
      return new Intl.NumberFormat('en-US').format(value);
    default:
      return String(value);
  }
};

const getRetentionColor = (value: number): string => {
  if (value >= 70) {
    return 'bg-green-500';
  }
  if (value >= 50) {
    return 'bg-green-400';
  }
  if (value >= 30) {
    return 'bg-yellow-400';
  }
  if (value >= 15) {
    return 'bg-orange-400';
  }
  return 'bg-red-400';
};

export default function AdvancedAnalyticsDashboard({
  variant = 'full',
  onExport,
  onDateRangeChange,
  className = '',
}: AdvancedAnalyticsDashboardProps) {
  const [metrics] = useState<MetricCard[]>(mockMetrics);
  const [cohorts] = useState<CohortData[]>(mockCohorts);
  const [churnPredictions] = useState<ChurnPrediction[]>(mockChurnPredictions);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'cohorts' | 'churn'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  }, []);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
    onDateRangeChange?.(range);
  }, [onDateRangeChange]);

  const totalAtRisk = churnPredictions.filter(p => p.riskScore >= 70).length;
  const avgRetention = cohorts.reduce((sum, c) => sum + (c.retentionByWeek[3] || 0), 0) / cohorts.length;

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Analytics</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">MRR</p>
            <p className="font-bold text-gray-900 dark:text-white">{formatValue(metrics[0]!.value, 'currency')}</p>
          </div>
          <div>
            <p className="text-gray-500">Users</p>
            <p className="font-bold text-gray-900 dark:text-white">{formatValue(metrics[1]!.value, 'number')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Key Metrics</h3>
          <select
            value={timeRange}
            onChange={e => handleTimeRangeChange(e.target.value as TimeRange)}
            className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="90d">90 days</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {metrics.slice(0, 4).map(metric => (
            <div key={metric.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="mb-1 text-xs text-gray-500">{metric.title}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatValue(metric.value, metric.format)}
              </p>
              <div className={`flex items-center gap-1 text-xs ${
                metric.changeType === 'increase' && metric.id !== 'm4' ? 'text-green-600' : 'text-red-600'
              }`}
              >
                {metric.changeType === 'increase' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(metric.change)}
                %
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Analytics</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cohort analysis, churn prediction & insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={e => handleTimeRangeChange(e.target.value as TimeRange)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => onExport?.('csv')}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map(metric => (
            <div key={metric.id} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  (metric.changeType === 'increase' && metric.id !== 'm4') ? 'text-green-600' : 'text-red-600'
                }`}
                >
                  {metric.changeType === 'increase' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(metric.change)}
                  %
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValue(metric.value, metric.format)}
              </p>
              {/* Mini trend chart */}
              <div className="mt-2 flex h-8 items-end gap-1">
                {metric.trend.map((val, i) => {
                  const max = Math.max(...metric.trend);
                  const min = Math.min(...metric.trend);
                  const height = ((val - min) / (max - min)) * 100;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        (metric.changeType === 'increase' && metric.id !== 'm4') ? 'bg-green-400' : 'bg-red-400'
                      } ${i === metric.trend.length - 1 ? 'opacity-100' : 'opacity-40'}`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex px-6">
          {(['overview', 'cohorts', 'churn'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'cohorts' ? 'Cohort Analysis' : tab === 'churn' ? 'Churn Prediction' : 'Overview'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-green-500" />
                Revenue Trend
              </h3>
              <div className="flex h-48 items-end justify-between gap-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                  const heights = [60, 68, 72, 78, 85, 100];
                  return (
                    <div key={month} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-green-500 to-green-400 transition-all"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs text-gray-500">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Growth */}
            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                <Users className="h-5 w-5 text-blue-500" />
                User Growth
              </h3>
              <div className="flex h-48 items-end justify-between gap-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                  const heights = [55, 62, 70, 78, 88, 100];
                  return (
                    <div key={month} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs text-gray-500">{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="col-span-2 grid grid-cols-4 gap-4">
              <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                <Activity className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">4.2</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Avg. Session Duration (min)</p>
              </div>
              <div className="rounded-xl bg-green-50 p-4 text-center dark:bg-green-900/20">
                <Target className="mx-auto mb-2 h-6 w-6 text-green-500" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">68%</p>
                <p className="text-xs text-green-600 dark:text-green-400">Feature Adoption Rate</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                <Zap className="mx-auto mb-2 h-6 w-6 text-purple-500" />
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">$89</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Avg. Revenue Per User</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                <Clock className="mx-auto mb-2 h-6 w-6 text-orange-500" />
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">18</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Avg. Days to Convert</p>
              </div>
            </div>
          </div>
        )}

        {/* Cohorts Tab */}
        {activeTab === 'cohorts' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Retention by Cohort</h3>
              <p className="text-sm text-gray-500">Week-over-week retention rates</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-500">
                    <th className="pb-3 text-left font-medium">Cohort</th>
                    <th className="pb-3 text-left font-medium">Size</th>
                    <th className="pb-3 text-center font-medium">Week 0</th>
                    <th className="pb-3 text-center font-medium">Week 1</th>
                    <th className="pb-3 text-center font-medium">Week 2</th>
                    <th className="pb-3 text-center font-medium">Week 3</th>
                    <th className="pb-3 text-center font-medium">Week 4</th>
                    <th className="pb-3 text-center font-medium">Week 5</th>
                    <th className="pb-3 text-center font-medium">Week 6</th>
                    <th className="pb-3 text-center font-medium">Week 7</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map(cohort => (
                    <tr key={cohort.cohort} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{cohort.cohort}</td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">{cohort.size.toLocaleString()}</td>
                      {Array.from({ length: 8 }).map((_, i) => {
                        const value = cohort.retentionByWeek[i];
                        return (
                          <td key={i} className="py-3 text-center">
                            {value !== undefined
                              ? (
                                  <span className={`inline-block rounded px-2 py-1 text-xs font-medium text-white ${getRetentionColor(value)}`}>
                                    {value}
                                    %
                                  </span>
                                )
                              : (
                                  <span className="text-gray-300">—</span>
                                )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Insight:</strong>
                {' '}
                Average 4-week retention is
                {avgRetention.toFixed(1)}
                %.
                June 2024 cohort shows the best early retention at 74% in week 1.
              </p>
            </div>
          </div>
        )}

        {/* Churn Tab */}
        {activeTab === 'churn' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Churn Risk Predictions</h3>
                <p className="text-sm text-gray-500">AI-powered predictions based on user behavior</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 dark:bg-red-900/20">
                <span className="font-bold text-red-600 dark:text-red-400">{totalAtRisk}</span>
                <span className="text-sm text-red-600 dark:text-red-400">users at high risk</span>
              </div>
            </div>

            <div className="space-y-3">
              {churnPredictions.map(prediction => (
                <div
                  key={prediction.userId}
                  className={`rounded-lg border-l-4 p-4 ${
                    prediction.riskScore >= 80
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : prediction.riskScore >= 60
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${
                        prediction.riskScore >= 80
                          ? 'bg-red-500'
                          : prediction.riskScore >= 60 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                      >
                        {prediction.riskScore}
                        %
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{prediction.email}</p>
                        <p className="text-sm text-gray-500">
                          Last active:
                          {' '}
                          {new Date(prediction.lastActive).toLocaleDateString()}
                          (
                          {prediction.daysInactive}
                          {' '}
                          days ago)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {prediction.predictedChurnDate && (
                        <span className="text-sm text-red-600 dark:text-red-400">
                          Est. churn:
                          {' '}
                          {new Date(prediction.predictedChurnDate).toLocaleDateString()}
                        </span>
                      )}
                      <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                        Take Action
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {prediction.factors.map((factor, i) => (
                      <span key={i} className="rounded bg-white px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <p className="text-sm text-purple-800 dark:text-purple-300">
                <strong>Recommendation:</strong>
                {' '}
                Consider launching a re-engagement campaign for the
                {totalAtRisk}
                {' '}
                high-risk users.
                Offer a personalized demo or discount to reduce potential churn.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { AdvancedAnalyticsDashboardProps, ChurnPrediction, CohortData, MetricCard, TimeRange };
