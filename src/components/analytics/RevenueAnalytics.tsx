'use client';

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Download,
  PieChart,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';
export type RevenueMetric = 'mrr' | 'arr' | 'ltv' | 'arpu' | 'cac';
export type TimeRange = '7d' | '30d' | '90d' | '365d' | 'all';

export type RevenueDataPoint = {
  date: Date;
  mrr: number;
  newMrr: number;
  expansionMrr: number;
  churnMrr: number;
  contractionMrr: number;
  netNewMrr: number;
};

export type TierBreakdown = {
  tier: SubscriptionTier;
  customers: number;
  mrr: number;
  percentOfTotal: number;
  avgRevenue: number;
  growth: number;
};

export type CohortRevenue = {
  cohort: string;
  month0: number;
  month3: number;
  month6: number;
  month12: number;
  totalLtv: number;
};

export type RevenueStats = {
  mrr: number;
  mrrGrowth: number;
  arr: number;
  arrGrowth: number;
  arpu: number;
  arpuGrowth: number;
  ltv: number;
  ltvGrowth: number;
  cac: number;
  cacGrowth: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  netRevenueRetention: number;
  grossRevenueRetention: number;
  churnRate: number;
  expansionRate: number;
  totalCustomers: number;
  paidCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
};

export type RevenueAnalyticsProps = {
  stats?: RevenueStats;
  revenueHistory?: RevenueDataPoint[];
  tierBreakdown?: TierBreakdown[];
  cohortRevenue?: CohortRevenue[];
  variant?: 'full' | 'compact' | 'widget' | 'breakdown';
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  onExport?: () => void;
  className?: string;
};

// Tier configuration
const tierConfig: Record<SubscriptionTier, { label: string; color: string; bgColor: string }> = {
  free: { label: 'Free', color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-700' },
  pro: { label: 'Pro', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  team: { label: 'Team', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  enterprise: { label: 'Enterprise', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
};

// Format currency
const formatCurrency = (value: number, compact = false): string => {
  if (compact && value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (compact && value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Mock data generators
const generateMockStats = (): RevenueStats => ({
  mrr: 125800,
  mrrGrowth: 8.5,
  arr: 1509600,
  arrGrowth: 12.3,
  arpu: 42.50,
  arpuGrowth: 5.2,
  ltv: 850,
  ltvGrowth: 8.1,
  cac: 125,
  cacGrowth: -3.5,
  ltvCacRatio: 6.8,
  paybackPeriod: 2.9,
  netRevenueRetention: 112,
  grossRevenueRetention: 94,
  churnRate: 3.2,
  expansionRate: 15.5,
  totalCustomers: 28900,
  paidCustomers: 2960,
  newCustomers: 320,
  churnedCustomers: 95,
});

const generateMockRevenueHistory = (): RevenueDataPoint[] => {
  const data: RevenueDataPoint[] = [];
  let baseMrr = 95000;

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const newMrr = 8000 + Math.random() * 4000;
    const expansionMrr = 3000 + Math.random() * 2000;
    const churnMrr = 2000 + Math.random() * 1500;
    const contractionMrr = 500 + Math.random() * 500;
    const netNewMrr = newMrr + expansionMrr - churnMrr - contractionMrr;

    baseMrr += netNewMrr;

    data.push({
      date,
      mrr: baseMrr,
      newMrr,
      expansionMrr,
      churnMrr,
      contractionMrr,
      netNewMrr,
    });
  }

  return data;
};

const generateMockTierBreakdown = (): TierBreakdown[] => [
  { tier: 'free', customers: 25940, mrr: 0, percentOfTotal: 0, avgRevenue: 0, growth: 15.2 },
  { tier: 'pro', customers: 1850, mrr: 46250, percentOfTotal: 36.8, avgRevenue: 25, growth: 12.5 },
  { tier: 'team', customers: 890, mrr: 53400, percentOfTotal: 42.4, avgRevenue: 60, growth: 18.3 },
  { tier: 'enterprise', customers: 220, mrr: 26150, percentOfTotal: 20.8, avgRevenue: 119, growth: 25.1 },
];

const generateMockCohortRevenue = (): CohortRevenue[] => [
  { cohort: 'Jan 2026', month0: 8500, month3: 7800, month6: 7200, month12: 6500, totalLtv: 78000 },
  { cohort: 'Dec 2025', month0: 7800, month3: 7200, month6: 6800, month12: 6200, totalLtv: 74400 },
  { cohort: 'Nov 2025', month0: 7200, month3: 6600, month6: 6100, month12: 5500, totalLtv: 66000 },
  { cohort: 'Oct 2025', month0: 6500, month3: 5900, month6: 5400, month12: 4800, totalLtv: 57600 },
];

export function RevenueAnalytics({
  stats: propStats,
  revenueHistory: propHistory,
  tierBreakdown: propBreakdown,
  cohortRevenue: propCohortRevenue,
  variant = 'full',
  timeRange = '30d',
  onTimeRangeChange,
  onExport,
  className = '',
}: RevenueAnalyticsProps) {
  const [activeView, setActiveView] = useState<'overview' | 'breakdown' | 'cohorts' | 'movements'>('overview');
  const [selectedRange, setSelectedRange] = useState<TimeRange>(timeRange);

  const stats = propStats || generateMockStats();
  const revenueHistory = propHistory || generateMockRevenueHistory();
  const tierBreakdown = propBreakdown || generateMockTierBreakdown();
  const cohortRevenue = propCohortRevenue || generateMockCohortRevenue();

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  const latestMovements = useMemo(() => {
    const latest = revenueHistory[revenueHistory.length - 1];
    return latest || { newMrr: 0, expansionMrr: 0, churnMrr: 0, contractionMrr: 0, netNewMrr: 0 };
  }, [revenueHistory]);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue</h3>
          </div>
          <span className={`flex items-center gap-1 text-sm ${stats.mrrGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.mrrGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {Math.abs(stats.mrrGrowth)}
            %
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.mrr, true)}</p>
            <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatCurrency(stats.arr, true)}</p>
              <p className="text-xs text-gray-500">ARR</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.paidCustomers.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Paid Customers</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Breakdown variant
  if (variant === 'breakdown') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <PieChart className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Revenue by Plan</h3>
          </div>
        </div>

        {/* Visual breakdown */}
        <div className="mb-4 flex h-6 overflow-hidden rounded-full">
          {tierBreakdown.filter(t => t.mrr > 0).map(tier => (
            <div
              key={tier.tier}
              className={tierConfig[tier.tier].bgColor}
              style={{ width: `${tier.percentOfTotal}%` }}
              title={`${tierConfig[tier.tier].label}: ${tier.percentOfTotal}%`}
            />
          ))}
        </div>

        <div className="space-y-3">
          {tierBreakdown.filter(t => t.tier !== 'free').map(tier => (
            <div key={tier.tier} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${tierConfig[tier.tier].bgColor}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{tierConfig[tier.tier].label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(tier.mrr)}
                </span>
                <span className={`text-xs ${tier.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tier.growth >= 0 ? '+' : ''}
                  {tier.growth}
                  %
                </span>
              </div>
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
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Analytics</h3>
              <p className="text-sm text-gray-500">Key SaaS metrics</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.mrr, true)}</p>
            <p className="text-sm text-gray-500">MRR</p>
            <p className={`mt-1 flex items-center gap-1 text-xs ${stats.mrrGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.mrrGrowth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(stats.mrrGrowth)}
              % from last month
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.arr, true)}</p>
            <p className="text-sm text-gray-500">ARR</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.netRevenueRetention}
              %
            </p>
            <p className="text-xs text-gray-500">NRR</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.ltvCacRatio}
              x
            </p>
            <p className="text-xs text-gray-500">LTV:CAC</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.churnRate}
              %
            </p>
            <p className="text-xs text-gray-500">Churn</p>
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
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Analytics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your SaaS revenue metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              {(['7d', '30d', '90d', '365d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedRange === range
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Main metrics */}
        <div className="grid grid-cols-6 gap-4">
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="mb-1 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">MRR</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.mrr, true)}</p>
            <p className={`flex items-center gap-1 text-xs ${stats.mrrGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.mrrGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(stats.mrrGrowth)}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">ARR</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.arr, true)}</p>
            <p className={`flex items-center gap-1 text-xs ${stats.arrGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.arrGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(stats.arrGrowth)}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">ARPU</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.arpu)}</p>
            <p className={`flex items-center gap-1 text-xs ${stats.arpuGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.arpuGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(stats.arpuGrowth)}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">LTV</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.ltv)}</p>
            <p className="text-xs text-gray-500">
              {stats.ltvCacRatio}
              x CAC
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">NRR</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.netRevenueRetention}
              %
            </p>
            <p className="text-xs text-gray-500">Net retention</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Churn</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.churnRate}
              %
            </p>
            <p className="text-xs text-red-600">
              {stats.churnedCustomers}
              {' '}
              customers
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 p-2">
          {(['overview', 'breakdown', 'cohorts', 'movements'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {view === 'overview' && 'Overview'}
              {view === 'breakdown' && 'Plan Breakdown'}
              {view === 'cohorts' && 'Cohort Analysis'}
              {view === 'movements' && 'MRR Movements'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* MRR Trend Chart (simplified bar representation) */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">MRR Trend</h3>
              <div className="flex h-48 items-end gap-2">
                {revenueHistory.map((point, index) => {
                  const maxMrr = Math.max(...revenueHistory.map(p => p.mrr));
                  const height = (point.mrr / maxMrr) * 100;
                  return (
                    <div key={index} className="flex flex-1 flex-col items-center">
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-green-500 to-green-400 transition-all hover:from-green-600 hover:to-green-500"
                        style={{ height: `${height}%` }}
                        title={`${point.date.toLocaleDateString()}: ${formatCurrency(point.mrr)}`}
                      />
                      <span className="mt-2 text-xs text-gray-500">
                        {point.date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-sm text-gray-500">Paid Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.paidCustomers.toLocaleString()}</p>
                <p className="flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  +
                  {stats.newCustomers}
                  {' '}
                  this month
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-sm text-gray-500">CAC</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.cac)}</p>
                <p className={`flex items-center gap-1 text-xs ${stats.cacGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.cacGrowth <= 0 ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                  {Math.abs(stats.cacGrowth)}
                  % from last month
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-sm text-gray-500">Payback Period</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.paybackPeriod}
                  {' '}
                  mo
                </p>
                <p className="text-xs text-gray-500">Time to recover CAC</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <p className="mb-1 text-sm text-gray-500">Expansion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.expansionRate}
                  %
                </p>
                <p className="text-xs text-gray-500">Upgrades & add-ons</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'breakdown' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Revenue by Plan</h3>
            <div className="space-y-4">
              {tierBreakdown.map(tier => (
                <div key={tier.tier} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg px-3 py-1 ${tierConfig[tier.tier].bgColor}`}>
                        <span className={`font-medium ${tierConfig[tier.tier].color}`}>
                          {tierConfig[tier.tier].label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {tier.customers.toLocaleString()}
                        {' '}
                        customers
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(tier.mrr)}</p>
                      <p className={`text-sm ${tier.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tier.growth >= 0 ? '+' : ''}
                        {tier.growth}
                        % growth
                      </p>
                    </div>
                  </div>
                  {tier.mrr > 0 && (
                    <>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className={`h-full rounded-full ${tierConfig[tier.tier].bgColor}`}
                          style={{ width: `${tier.percentOfTotal}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {tier.percentOfTotal}
                          % of MRR
                        </span>
                        <span>
                          Avg:
                          {formatCurrency(tier.avgRevenue)}
                          /customer
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'cohorts' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Cohort Revenue Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th className="pb-3 font-medium">Cohort</th>
                    <th className="pb-3 text-center font-medium">Month 0</th>
                    <th className="pb-3 text-center font-medium">Month 3</th>
                    <th className="pb-3 text-center font-medium">Month 6</th>
                    <th className="pb-3 text-center font-medium">Month 12</th>
                    <th className="pb-3 text-center font-medium">Total LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {cohortRevenue.map(cohort => (
                    <tr key={cohort.cohort} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{cohort.cohort}</td>
                      <td className="py-3 text-center">{formatCurrency(cohort.month0)}</td>
                      <td className="py-3 text-center">
                        <span className={cohort.month3 < cohort.month0 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}>
                          {formatCurrency(cohort.month3)}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={cohort.month6 < cohort.month3 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}>
                          {formatCurrency(cohort.month6)}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={cohort.month12 < cohort.month6 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}>
                          {formatCurrency(cohort.month12)}
                        </span>
                      </td>
                      <td className="py-3 text-center font-medium text-green-600">
                        {formatCurrency(cohort.totalLtv)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'movements' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">MRR Movements This Month</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Positive movements */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-green-600">Additions</h4>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">New MRR</span>
                    <span className="font-bold text-green-600">
                      +
                      {formatCurrency(latestMovements.newMrr)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">From new customers</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Expansion MRR</span>
                    <span className="font-bold text-green-600">
                      +
                      {formatCurrency(latestMovements.expansionMrr)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">From upgrades & add-ons</p>
                </div>
              </div>

              {/* Negative movements */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-red-600">Subtractions</h4>
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Churn MRR</span>
                    <span className="font-bold text-red-600">
                      -
                      {formatCurrency(latestMovements.churnMrr)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">From cancellations</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Contraction MRR</span>
                    <span className="font-bold text-red-600">
                      -
                      {formatCurrency(latestMovements.contractionMrr)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">From downgrades</p>
                </div>
              </div>
            </div>

            {/* Net result */}
            <div className={`mt-6 rounded-lg p-6 ${latestMovements.netNewMrr >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">Net New MRR</p>
                  <p className="text-sm text-gray-500">Total change this month</p>
                </div>
                <p className={`text-3xl font-bold ${latestMovements.netNewMrr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {latestMovements.netNewMrr >= 0 ? '+' : ''}
                  {formatCurrency(latestMovements.netNewMrr)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RevenueAnalytics;
