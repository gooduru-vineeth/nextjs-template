'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Image,
  Layers,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

export type MetricData = {
  label: string;
  value: number;
  previousValue?: number;
  unit?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'gray';
};

export type ChartDataPoint = {
  label: string;
  value: number;
  category?: string;
};

export type UsageAnalyticsDashboardProps = {
  metrics: MetricData[];
  chartData?: ChartDataPoint[];
  timeRange?: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange?: (range: 'day' | 'week' | 'month' | 'year') => void;
  variant?: 'full' | 'compact' | 'cards' | 'minimal';
  title?: string;
  className?: string;
};

export default function UsageAnalyticsDashboard({
  metrics,
  chartData = [],
  timeRange = 'week',
  onTimeRangeChange,
  variant = 'full',
  title = 'Usage Analytics',
  className = '',
}: UsageAnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const handleTimeRangeChange = (range: 'day' | 'week' | 'month' | 'year') => {
    setSelectedTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const getPercentageChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) {
      return null;
    }
    return ((current - previous) / previous) * 100;
  };

  const defaultColorStyle = { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-100 dark:bg-blue-900/50' };

  const getColorClasses = (color?: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: defaultColorStyle,
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', icon: 'bg-green-100 dark:bg-green-900/50' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', icon: 'bg-purple-100 dark:bg-purple-900/50' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', icon: 'bg-orange-100 dark:bg-orange-900/50' },
      gray: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', icon: 'bg-gray-100 dark:bg-gray-700' },
    };
    return colors[color || 'blue'] || defaultColorStyle;
  };

  const defaultColors = getColorClasses() || defaultColorStyle;

  const formatValue = (value: number, unit?: string) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${unit ? ` ${unit}` : ''}`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K${unit ? ` ${unit}` : ''}`;
    }
    return `${value}${unit ? ` ${unit}` : ''}`;
  };

  const timeRanges = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
  ] as const;

  const defaultIcons = [
    <Image key="image" size={18} />,
    <Download key="download" size={18} />,
    <Clock key="clock" size={18} />,
    <FileText key="file" size={18} />,
    <Users key="users" size={18} />,
    <Layers key="layers" size={18} />,
  ];

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {metrics.slice(0, 3).map((metric, index) => {
          const colors = (metric.color ? getColorClasses(metric.color) : defaultColors) || defaultColorStyle;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`text-sm ${colors.text}`}>
                {metric.label}
                :
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatValue(metric.value, metric.unit)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-2 gap-4 md:grid-cols-4 ${className}`}>
        {metrics.map((metric, index) => {
          const colors = (metric.color ? getColorClasses(metric.color) : defaultColors) || defaultColorStyle;
          const percentChange = getPercentageChange(metric.value, metric.previousValue);

          return (
            <div
              key={index}
              className={`rounded-xl p-4 ${colors.bg} border border-gray-100 dark:border-gray-700`}
            >
              <div className="mb-2 flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${colors.icon} ${colors.text} flex items-center justify-center`}>
                  {metric.icon || defaultIcons[index % defaultIcons.length]}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatValue(metric.value, metric.unit)}
                </span>
                {percentChange !== null && (
                  <span className={`flex items-center text-sm ${
                    percentChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                  >
                    {percentChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(percentChange).toFixed(1)}
                    %
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <select
            value={selectedTimeRange}
            onChange={e => handleTimeRangeChange(e.target.value as 'day' | 'week' | 'month' | 'year')}
            className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            {timeRanges.map(range => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.slice(0, 4).map((metric, index) => {
            const colors = (metric.color ? getColorClasses(metric.color) : defaultColors) || defaultColorStyle;
            const percentChange = getPercentageChange(metric.value, metric.previousValue);

            return (
              <div key={index} className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${colors.icon} ${colors.text} flex items-center justify-center`}>
                  {metric.icon || defaultIcons[index % defaultIcons.length]}
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{metric.label}</span>
                    {percentChange !== null && (
                      <span className={percentChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                        (
                        {percentChange >= 0 ? '+' : ''}
                        {percentChange.toFixed(0)}
                        %)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your platform usage and performance</p>
            </div>
          </div>

          <div className="relative">
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
              <Calendar size={16} />
              {timeRanges.find(r => r.id === selectedTimeRange)?.label}
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Time Range Tabs */}
        <div className="mt-4 flex gap-2">
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => handleTimeRangeChange(range.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                selectedTimeRange === range.id
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((metric, index) => {
            const colors = (metric.color ? getColorClasses(metric.color) : defaultColors) || defaultColorStyle;
            const percentChange = getPercentageChange(metric.value, metric.previousValue);

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg ${colors.icon} ${colors.text} flex items-center justify-center`}>
                    {metric.icon || defaultIcons[index % defaultIcons.length]}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatValue(metric.value, metric.unit)}
                  </span>
                </div>

                {percentChange !== null && (
                  <div className={`flex items-center gap-1 text-sm ${
                    percentChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                  >
                    {percentChange >= 0
                      ? (
                          <TrendingUp size={16} />
                        )
                      : (
                          <TrendingDown size={16} />
                        )}
                    <span>
                      {Math.abs(percentChange).toFixed(1)}
                      % from previous period
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="p-6">
          <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">Activity Overview</h3>

          <div className="flex h-48 items-end gap-2">
            {chartData.map((point, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300"
                  style={{ height: `${(point.value / maxChartValue) * 100}%`, minHeight: '4px' }}
                  title={`${point.label}: ${point.value}`}
                />
                <span className="max-w-full truncate text-xs text-gray-500 dark:text-gray-400">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-b-2xl bg-gray-50 px-6 py-4 dark:bg-gray-900/50">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated:
          {' '}
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
