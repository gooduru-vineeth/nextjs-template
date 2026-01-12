'use client';

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  Download as DownloadIcon,
  Eye,
  FileImage,
  Layers,
  LineChart,
  MousePointer,
  RefreshCw,
  Share2,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
export type UsageMetric = {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: number;
  icon?: typeof BarChart3;
  color?: string;
};

export type TimeSeriesData = {
  date: string;
  value: number;
  label?: string;
};

export type UsageBreakdown = {
  category: string;
  value: number;
  percent: number;
  color: string;
};

export type UsageAlert = {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  threshold?: number;
  current?: number;
  createdAt: Date;
};

export type UsagePlan = {
  name: string;
  mockupsLimit: number;
  mockupsUsed: number;
  storageLimit: number;
  storageUsed: number;
  exportsLimit: number;
  exportsUsed: number;
  apiCallsLimit: number;
  apiCallsUsed: number;
  renewsAt?: Date;
};

type UsageDashboardProps = {
  metrics?: UsageMetric[];
  timeSeriesData?: TimeSeriesData[];
  breakdown?: UsageBreakdown[];
  alerts?: UsageAlert[];
  plan?: UsagePlan;
  dateRange?: { start: Date; end: Date };
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
  onRefresh?: () => void;
  onExportData?: (format: 'csv' | 'json' | 'pdf') => void;
  onDismissAlert?: (alertId: string) => void;
  onUpgradePlan?: () => void;
  isLoading?: boolean;
  variant?: 'full' | 'compact' | 'widget';
  className?: string;
};

// Date range presets
const DATE_PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This month', days: -1 },
  { label: 'Last month', days: -2 },
  { label: 'This year', days: -3 },
];

// Default metrics
const DEFAULT_METRICS: UsageMetric[] = [
  { id: 'mockups', name: 'Mockups Created', value: 0, unit: '', icon: FileImage, color: 'blue' },
  { id: 'exports', name: 'Exports', value: 0, unit: '', icon: Download, color: 'green' },
  { id: 'shares', name: 'Shares', value: 0, unit: '', icon: Share2, color: 'purple' },
  { id: 'views', name: 'Total Views', value: 0, unit: '', icon: Eye, color: 'orange' },
];

// Usage Meter Component
function UsageMeter({
  label,
  used,
  limit,
  unit = '',
  color = 'blue',
  showPercent = true,
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  color?: string;
  showPercent?: boolean;
}) {
  const percent = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const isWarning = percent >= 80;
  const isDanger = percent >= 95;

  const getBarColor = () => {
    if (isDanger) {
      return 'bg-red-500';
    }
    if (isWarning) {
      return 'bg-yellow-500';
    }
    if (color === 'blue') {
      return 'bg-blue-500';
    }
    if (color === 'green') {
      return 'bg-green-500';
    }
    if (color === 'purple') {
      return 'bg-purple-500';
    }
    if (color === 'orange') {
      return 'bg-orange-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {used.toLocaleString()}
          {unit}
          {' '}
          /
          {' '}
          {limit.toLocaleString()}
          {unit}
          {showPercent && (
            <span className={`ml-2 ${isDanger ? 'text-red-500' : isWarning ? 'text-yellow-500' : ''}`}>
              (
              {percent.toFixed(0)}
              %)
            </span>
          )}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({
  metric,
  onClick,
}: {
  metric: UsageMetric;
  onClick?: () => void;
}) {
  const Icon = metric.icon || BarChart3;

  const getColorClasses = () => {
    switch (metric.color) {
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'purple':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'orange':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      case 'red':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${
        onClick ? 'cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-gray-600' : ''
      }`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${getColorClasses()}`}>
          <Icon className="h-5 w-5" />
        </div>
        {metric.trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {metric.trend === 'up'
              ? (
                  <ArrowUpRight className="h-4 w-4" />
                )
              : metric.trend === 'down'
                ? (
                    <ArrowDownRight className="h-4 w-4" />
                  )
                : null}
            {metric.trendPercent !== undefined && (
              <span>
                {metric.trendPercent}
                %
              </span>
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {metric.value.toLocaleString()}
          {metric.unit && <span className="ml-1 text-sm font-normal text-gray-500">{metric.unit}</span>}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{metric.name}</p>
      </div>
      {metric.previousValue !== undefined && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          Previous:
          {' '}
          {metric.previousValue.toLocaleString()}
          {metric.unit}
        </p>
      )}
    </div>
  );
}

// Simple Bar Chart Component
function SimpleBarChart({
  data,
  height = 200,
}: {
  data: TimeSeriesData[];
  height?: number;
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 flex items-end gap-1">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div
              key={index}
              className="group flex flex-1 flex-col items-center"
            >
              <div
                className="relative w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                style={{ height: `${barHeight}%`, minHeight: item.value > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.value.toLocaleString()}
                </div>
              </div>
              {data.length <= 12 && (
                <span className="mt-1 max-w-full truncate text-xs text-gray-400">
                  {item.label || item.date}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pie Chart Component
function SimplePieChart({
  data,
  size = 160,
}: {
  data: UsageBreakdown[];
  size?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  const segments = data.map((item) => {
    const startPercent = cumulativePercent;
    cumulativePercent += item.percent;
    return {
      ...item,
      startPercent,
      endPercent: cumulativePercent,
    };
  });

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * (percent / 100 - 0.25));
    const y = Math.sin(2 * Math.PI * (percent / 100 - 0.25));
    return [x, y];
  };

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox="-1 -1 2 2">
        {segments.map((segment, index) => {
          const [startX, startY] = getCoordinatesForPercent(segment.startPercent);
          const [endX, endY] = getCoordinatesForPercent(segment.endPercent);
          const largeArcFlag = segment.percent > 50 ? 1 : 0;
          const pathData = [
            `M ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'L 0 0',
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={segment.color}
              className="cursor-pointer transition-opacity hover:opacity-80"
            />
          );
        })}
        <circle r="0.6" fill="white" className="dark:fill-gray-800" />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-900 text-[0.2px] font-bold dark:fill-gray-100"
        >
          {total.toLocaleString()}
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.percent.toFixed(0)}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Alert Card Component
function AlertCard({
  alert,
  onDismiss,
}: {
  alert: UsageAlert;
  onDismiss?: () => void;
}) {
  const getTypeStyles = () => {
    switch (alert.type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getIconColor = () => {
    switch (alert.type) {
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getTypeStyles()} flex items-start gap-3`}>
      <Activity className={`mt-0.5 h-5 w-5 ${getIconColor()}`} />
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{alert.title}</h4>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
        {alert.threshold !== undefined && alert.current !== undefined && (
          <div className="mt-2">
            <UsageMeter
              label=""
              used={alert.current}
              limit={alert.threshold}
              showPercent={false}
              color={alert.type === 'danger' ? 'red' : alert.type === 'warning' ? 'yellow' : 'blue'}
            />
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Main Usage Dashboard Component
export function UsageDashboard({
  metrics = DEFAULT_METRICS,
  timeSeriesData = [],
  breakdown = [],
  alerts = [],
  plan,
  dateRange,
  onDateRangeChange,
  onRefresh,
  onExportData,
  onDismissAlert,
  onUpgradePlan,
  isLoading = false,
  variant = 'full',
  className = '',
}: UsageDashboardProps) {
  const [selectedPreset, setSelectedPreset] = useState(DATE_PRESETS[1]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'pie'>('bar');

  // Silence unused variable warnings
  void dateRange;
  void onDateRangeChange;
  void activeChart;

  const handlePresetChange = useCallback((preset: typeof DATE_PRESETS[0]) => {
    setSelectedPreset(preset);
    setShowDatePicker(false);
  }, []);

  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Usage Overview</h3>
          <Activity className="h-4 w-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {metrics.slice(0, 4).map(metric => (
            <div key={metric.id} className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {metric.value.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{metric.name}</p>
            </div>
          ))}
        </div>
        {plan && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <UsageMeter
              label="Plan Usage"
              used={plan.mockupsUsed}
              limit={plan.mockupsLimit}
            />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
            <BarChart3 className="h-5 w-5" />
            Usage Dashboard
          </h3>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-4 gap-3">
            {metrics.slice(0, 4).map((metric) => {
              const Icon = metric.icon || BarChart3;
              return (
                <div key={metric.id} className="text-center">
                  <Icon className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {metric.value.toLocaleString()}
                  </p>
                  <p className="truncate text-xs text-gray-500">{metric.name}</p>
                </div>
              );
            })}
          </div>
          {plan && (
            <div className="space-y-3">
              <UsageMeter label="Mockups" used={plan.mockupsUsed} limit={plan.mockupsLimit} />
              <UsageMeter label="Storage" used={plan.storageUsed} limit={plan.storageLimit} unit=" GB" color="purple" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Usage Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor your usage and resource consumption
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{selectedPreset?.label}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showDatePicker && (
                <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {DATE_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetChange(preset)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedPreset?.label === preset.label
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw className={`h-5 w-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <DownloadIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Export</span>
              </button>

              {showExportMenu && (
                <div className="absolute top-full right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {(['csv', 'json', 'pdf'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => {
                        onExportData?.(format);
                        setShowExportMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Export as
                      {' '}
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={() => onDismissAlert?.(alert.id)}
              />
            ))}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(metric => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Plan Usage */}
        {plan && (
          <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <CreditCard className="h-5 w-5" />
                  {plan.name}
                  {' '}
                  Plan
                </h3>
                {plan.renewsAt && (
                  <p className="mt-1 text-sm text-gray-500">
                    Renews on
                    {' '}
                    {plan.renewsAt.toLocaleDateString()}
                  </p>
                )}
              </div>
              {onUpgradePlan && (
                <button
                  onClick={onUpgradePlan}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Zap className="h-4 w-4" />
                  Upgrade Plan
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <UsageMeter
                label="Mockups"
                used={plan.mockupsUsed}
                limit={plan.mockupsLimit}
                color="blue"
              />
              <UsageMeter
                label="Storage"
                used={plan.storageUsed}
                limit={plan.storageLimit}
                unit=" GB"
                color="purple"
              />
              <UsageMeter
                label="Exports"
                used={plan.exportsUsed}
                limit={plan.exportsLimit}
                color="green"
              />
              <UsageMeter
                label="API Calls"
                used={plan.apiCallsUsed}
                limit={plan.apiCallsLimit}
                color="orange"
              />
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Time Series Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Activity Over Time</h3>
              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setActiveChart('bar')}
                  className="rounded bg-white p-1.5 shadow-sm dark:bg-gray-600"
                >
                  <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setActiveChart('line')}
                  className="rounded p-1.5 hover:bg-white dark:hover:bg-gray-600"
                >
                  <LineChart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            {timeSeriesData.length > 0
              ? (
                  <SimpleBarChart data={timeSeriesData} height={250} />
                )
              : (
                  <div className="flex h-[250px] items-center justify-center text-gray-400">
                    No data available for the selected period
                  </div>
                )}
          </div>

          {/* Breakdown Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-6 font-semibold text-gray-900 dark:text-gray-100">Usage Breakdown</h3>
            {breakdown.length > 0
              ? (
                  <SimplePieChart data={breakdown} />
                )
              : (
                  <div className="flex h-[200px] items-center justify-center text-gray-400">
                    No breakdown data available
                  </div>
                )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
            <Clock className="mb-2 h-5 w-5 opacity-80" />
            <p className="text-2xl font-bold">24.5h</p>
            <p className="text-sm opacity-80">Time Saved</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
            <MousePointer className="mb-2 h-5 w-5 opacity-80" />
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm opacity-80">Total Clicks</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
            <Layers className="mb-2 h-5 w-5 opacity-80" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm opacity-80">Templates Used</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
            <Users className="mb-2 h-5 w-5 opacity-80" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm opacity-80">Collaborators</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Usage Summary Widget
export function UsageSummaryWidget({
  used,
  limit,
  type = 'mockups',
  showUpgrade = true,
  onUpgrade,
  className = '',
}: {
  used: number;
  limit: number;
  type?: 'mockups' | 'storage' | 'exports' | 'api';
  showUpgrade?: boolean;
  onUpgrade?: () => void;
  className?: string;
}) {
  const percent = limit > 0 ? (used / limit) * 100 : 0;
  const labels: Record<string, string> = {
    mockups: 'Mockups',
    storage: 'Storage (GB)',
    exports: 'Exports',
    api: 'API Calls',
  };

  const getBarColor = () => {
    if (percent >= 90) {
      return 'bg-red-500';
    }
    if (percent >= 75) {
      return 'bg-yellow-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{labels[type]}</span>
        <span className="text-sm text-gray-500">
          {percent.toFixed(0)}
          % used
        </span>
      </div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${getBarColor()}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {used.toLocaleString()}
          {' '}
          /
          {limit.toLocaleString()}
        </span>
        {showUpgrade && percent >= 75 && (
          <button
            onClick={onUpgrade}
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}

export default UsageDashboard;
