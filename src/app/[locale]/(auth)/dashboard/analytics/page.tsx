'use client';

import { useState } from 'react';

type TimeRange = '7d' | '30d' | '90d' | '12m';

type MetricData = {
  label: string;
  value: number;
  previousValue: number;
  format: 'number' | 'percentage' | 'time';
};

type ChartDataPoint = {
  date: string;
  mockups: number;
  exports: number;
};

// Mock data for demonstration
const mockMetrics: MetricData[] = [
  { label: 'Mockups Created', value: 156, previousValue: 132, format: 'number' },
  { label: 'Exports Generated', value: 423, previousValue: 367, format: 'number' },
  { label: 'Time Saved', value: 48, previousValue: 42, format: 'time' },
  { label: 'Template Usage', value: 73, previousValue: 68, format: 'percentage' },
];

const mockChartData: ChartDataPoint[] = [
  { date: 'Jan 1', mockups: 12, exports: 32 },
  { date: 'Jan 2', mockups: 18, exports: 45 },
  { date: 'Jan 3', mockups: 15, exports: 38 },
  { date: 'Jan 4', mockups: 22, exports: 56 },
  { date: 'Jan 5', mockups: 28, exports: 72 },
  { date: 'Jan 6', mockups: 24, exports: 61 },
  { date: 'Jan 7', mockups: 31, exports: 78 },
];

const mockPlatformUsage = [
  { platform: 'WhatsApp', count: 45, percentage: 29 },
  { platform: 'iMessage', count: 32, percentage: 21 },
  { platform: 'Discord', count: 28, percentage: 18 },
  { platform: 'Slack', count: 22, percentage: 14 },
  { platform: 'Instagram', count: 18, percentage: 12 },
  { platform: 'Other', count: 11, percentage: 6 },
];

const mockTemplateUsage = [
  { template: 'Customer Support', uses: 45 },
  { template: 'Team Chat', uses: 38 },
  { template: 'Social Conversation', uses: 32 },
  { template: 'Product Demo', uses: 28 },
  { template: 'AI Assistant', uses: 24 },
];

const mockRecentActivity = [
  { action: 'Created WhatsApp mockup', user: 'Sarah J.', time: '5 min ago' },
  { action: 'Exported to PNG', user: 'Mike C.', time: '12 min ago' },
  { action: 'Used Instagram template', user: 'Emily B.', time: '25 min ago' },
  { action: 'Shared mockup link', user: 'Sarah J.', time: '1 hour ago' },
  { action: 'Created Discord mockup', user: 'Alex K.', time: '2 hours ago' },
];

function formatValue(value: number, format: MetricData['format']): string {
  switch (format) {
    case 'percentage':
      return `${value}%`;
    case 'time':
      return `${value}h`;
    default:
      return value.toLocaleString();
  }
}

function calculateChange(current: number, previous: number): { value: number; isPositive: boolean } {
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
}

function MetricCard({ metric }: { metric: MetricData }) {
  const change = calculateChange(metric.value, metric.previousValue);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
      <div className="mt-2 flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatValue(metric.value, metric.format)}
        </p>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          change.isPositive ? 'text-green-600' : 'text-red-600'
        }`}
        >
          {change.isPositive
            ? (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )
            : (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
          {change.value}
          %
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">vs previous period</p>
    </div>
  );
}

function SimpleBarChart({ data }: { data: ChartDataPoint[] }) {
  const maxValue = Math.max(...data.flatMap(d => [d.mockups, d.exports]));

  return (
    <div className="flex h-64 items-end gap-4">
      {data.map((point, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end justify-center gap-1" style={{ height: '200px' }}>
            <div
              className="w-4 rounded-t bg-blue-500"
              style={{ height: `${(point.mockups / maxValue) * 100}%` }}
              title={`Mockups: ${point.mockups}`}
            />
            <div
              className="w-4 rounded-t bg-green-500"
              style={{ height: `${(point.exports / maxValue) * 100}%` }}
              title={`Exports: ${point.exports}`}
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{point.date}</span>
        </div>
      ))}
    </div>
  );
}

function PlatformUsageChart({ data }: { data: typeof mockPlatformUsage }) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-gray-500',
  ];

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.platform}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.platform}</span>
            <span className="text-gray-500 dark:text-gray-400">
              {item.count}
              {' '}
              (
              {item.percentage}
              %)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full ${colors[index % colors.length]}`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track your mockup creation and usage metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value as TimeRange)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockMetrics.map(metric => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Activity Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Overview</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Mockups</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Exports</span>
                </div>
              </div>
            </div>
            <SimpleBarChart data={mockChartData} />
          </div>

          {/* Platform Usage */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Platform Usage</h2>
            <PlatformUsageChart data={mockPlatformUsage} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Popular Templates */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Popular Templates</h2>
            <div className="space-y-4">
              {mockTemplateUsage.map((template, index) => (
                <div key={template.template} className="flex items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{template.template}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {template.uses}
                      {' '}
                      uses
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Stats */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Export Statistics</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <svg className="size-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">287</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">PNG Exports</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <svg className="size-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">98</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">JPG Exports</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <svg className="size-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">26</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">PDF Exports</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <svg className="size-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">SVG Exports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
