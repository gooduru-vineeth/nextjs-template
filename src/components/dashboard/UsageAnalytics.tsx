'use client';

import { useMemo, useState } from 'react';

type UsageData = {
  totalMockups: number;
  totalExports: number;
  totalTemplatesUsed: number;
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  apiCalls: number;
  apiLimit: number;
  mockupsByPlatform: Record<string, number>;
  exportsByFormat: Record<string, number>;
  dailyActivity: { date: string; mockups: number; exports: number }[];
  recentMockups: { id: string; name: string; platform: string; createdAt: string; exports: number }[];
};

type UsageAnalyticsProps = {
  data: UsageData;
  period?: '7d' | '30d' | '90d' | 'all';
  onPeriodChange?: (period: '7d' | '30d' | '90d' | 'all') => void;
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  trend?: { value: number; isPositive: boolean };
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive
                ? (
                    <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )
                : (
                    <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
              {Math.abs(trend.value)}
              % vs last period
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  label,
  current,
  max,
  color = 'blue',
}: {
  label: string;
  current: number;
  max: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const percentage = Math.min((current / max) * 100, 100);
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {current.toLocaleString()}
          {' '}
          /
          {max.toLocaleString()}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function MiniBarChart({
  data,
  label,
}: {
  data: { label: string; value: number }[];
  label: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</h4>
      <div className="space-y-2">
        {data.map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-20 truncate text-xs text-gray-500 dark:text-gray-400">
              {item.label}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
              <div
                className="h-full rounded bg-blue-500 transition-all duration-300"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityChart({
  data,
}: {
  data: { date: string; mockups: number; exports: number }[];
}) {
  const maxValue = Math.max(
    ...data.flatMap(d => [d.mockups, d.exports]),
    1,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Activity</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="size-2 rounded bg-blue-500" />
            <span className="text-gray-500 dark:text-gray-400">Mockups</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded bg-green-500" />
            <span className="text-gray-500 dark:text-gray-400">Exports</span>
          </div>
        </div>
      </div>

      <div className="flex h-32 items-end gap-1">
        {data.map((day, index) => (
          <div key={index} className="group relative flex flex-1 flex-col items-center gap-0.5">
            {/* Tooltip */}
            <div className="absolute -top-16 left-1/2 z-10 hidden -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
              <p className="font-medium">{day.date}</p>
              <p>
                Mockups:
                {day.mockups}
              </p>
              <p>
                Exports:
                {day.exports}
              </p>
            </div>

            {/* Bars */}
            <div className="flex w-full items-end justify-center gap-0.5" style={{ height: '100%' }}>
              <div
                className="w-2 rounded-t bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                style={{ height: `${(day.mockups / maxValue) * 100}%`, minHeight: day.mockups > 0 ? '4px' : '0' }}
              />
              <div
                className="w-2 rounded-t bg-green-500 transition-all duration-300 hover:bg-green-600"
                style={{ height: `${(day.exports / maxValue) * 100}%`, minHeight: day.exports > 0 ? '4px' : '0' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1">
        {data.map((day, index) => (
          <div key={index} className="flex-1 text-center text-xs text-gray-400">
            {index % 3 === 0 ? day.date.slice(-5) : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export function UsageAnalytics({ data, period = '30d', onPeriodChange }: UsageAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'recent'>('overview');

  const platformData = useMemo(() =>
    Object.entries(data.mockupsByPlatform)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5), [data.mockupsByPlatform]);

  const formatData = useMemo(() =>
    Object.entries(data.exportsByFormat)
      .map(([label, value]) => ({ label: label.toUpperCase(), value }))
      .sort((a, b) => b.value - a.value), [data.exportsByFormat]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Usage Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your mockup creation and export activity
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          {(['7d', '30d', '90d', 'all'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange?.(p)}
              className={`rounded px-3 py-1 text-sm ${
                period === p
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        {(['overview', 'breakdown', 'recent'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-1 pb-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Mockups"
              value={data.totalMockups.toLocaleString()}
              icon={(
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              color="blue"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Exports"
              value={data.totalExports.toLocaleString()}
              icon={(
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              color="green"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Templates Used"
              value={data.totalTemplatesUsed}
              icon={(
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              )}
              color="purple"
            />
            <StatCard
              title="API Calls"
              value={data.apiCalls.toLocaleString()}
              subtitle={`of ${data.apiLimit.toLocaleString()} limit`}
              icon={(
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              color="orange"
            />
          </div>

          {/* Usage Limits */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">Usage Limits</h3>
            <div className="space-y-4">
              <ProgressBar
                label="Storage"
                current={data.storageUsed}
                max={data.storageLimit}
                color="blue"
              />
              <ProgressBar
                label="API Calls (Monthly)"
                current={data.apiCalls}
                max={data.apiLimit}
                color="orange"
              />
            </div>
          </div>

          {/* Activity Chart */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <ActivityChart data={data.dailyActivity} />
          </div>
        </div>
      )}

      {/* Breakdown Tab */}
      {activeTab === 'breakdown' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <MiniBarChart data={platformData} label="Mockups by Platform" />
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <MiniBarChart data={formatData} label="Exports by Format" />
          </div>
        </div>
      )}

      {/* Recent Tab */}
      {activeTab === 'recent' && (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Platform</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Created</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 dark:text-gray-400">Exports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.recentMockups.map(mockup => (
                  <tr key={mockup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{mockup.name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize dark:text-gray-400">
                      {mockup.platform}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {new Date(mockup.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                      {mockup.exports}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Sample data generator for demo/testing
export function generateSampleUsageData(): UsageData {
  const days = 30;
  const dailyActivity = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      date: date.toISOString().slice(0, 10),
      mockups: Math.floor(Math.random() * 10) + 1,
      exports: Math.floor(Math.random() * 15),
    };
  });

  return {
    totalMockups: 156,
    totalExports: 423,
    totalTemplatesUsed: 12,
    storageUsed: 245,
    storageLimit: 1024,
    apiCalls: 1234,
    apiLimit: 5000,
    mockupsByPlatform: {
      WhatsApp: 45,
      iMessage: 38,
      Telegram: 28,
      Instagram: 22,
      Twitter: 15,
      Slack: 8,
    },
    exportsByFormat: {
      png: 280,
      jpeg: 85,
      webp: 38,
      html: 20,
    },
    dailyActivity,
    recentMockups: [
      { id: '1', name: 'Product Launch Chat', platform: 'whatsapp', createdAt: new Date().toISOString(), exports: 12 },
      { id: '2', name: 'Customer Support', platform: 'telegram', createdAt: new Date(Date.now() - 86400000).toISOString(), exports: 8 },
      { id: '3', name: 'Team Discussion', platform: 'slack', createdAt: new Date(Date.now() - 172800000).toISOString(), exports: 5 },
      { id: '4', name: 'Viral Tweet Thread', platform: 'twitter', createdAt: new Date(Date.now() - 259200000).toISOString(), exports: 23 },
      { id: '5', name: 'AI Assistant Demo', platform: 'imessage', createdAt: new Date(Date.now() - 345600000).toISOString(), exports: 15 },
    ],
  };
}
