'use client';

import {
  BarChart3,
  ChevronRight,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type FeatureCategory = 'core' | 'advanced' | 'premium' | 'beta' | 'deprecated';
export type UsageLevel = 'none' | 'low' | 'medium' | 'high' | 'power';
export type TimeGranularity = 'hour' | 'day' | 'week' | 'month';

export type FeatureUsage = {
  id: string;
  name: string;
  category: FeatureCategory;
  usageCount: number;
  uniqueUsers: number;
  avgSessionsPerUser: number;
  adoptionRate: number;
  retentionImpact: number;
  trend: number;
  heatmapData: number[]; // 24 hours or 7 days depending on granularity
  topUserSegments: string[];
};

export type UsageByHour = {
  hour: number;
  usage: number;
  users: number;
};

export type UsageByDay = {
  day: string;
  usage: number;
  users: number;
};

export type FeatureCorrelation = {
  feature1: string;
  feature2: string;
  correlation: number;
  combinedUsage: number;
};

export type FeatureUsageStats = {
  totalFeatures: number;
  mostUsedFeature: string;
  leastUsedFeature: string;
  avgAdoptionRate: number;
  avgRetentionImpact: number;
  newFeaturesLaunched: number;
  deprecatedFeatures: number;
};

export type FeatureUsageHeatmapProps = {
  features?: FeatureUsage[];
  usageByHour?: UsageByHour[];
  usageByDay?: UsageByDay[];
  correlations?: FeatureCorrelation[];
  stats?: FeatureUsageStats;
  variant?: 'full' | 'compact' | 'widget' | 'grid';
  granularity?: TimeGranularity;
  onFeatureClick?: (featureId: string) => void;
  onExport?: () => void;
  className?: string;
};

// Category configuration
const categoryConfig: Record<FeatureCategory, { label: string; color: string }> = {
  core: { label: 'Core', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  advanced: { label: 'Advanced', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  premium: { label: 'Premium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  beta: { label: 'Beta', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  deprecated: { label: 'Deprecated', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400' },
};

// Utility to get usage color
const getUsageColor = (value: number, max: number): string => {
  const intensity = max > 0 ? value / max : 0;
  if (intensity === 0) {
    return 'bg-gray-100 dark:bg-gray-800';
  }
  if (intensity < 0.25) {
    return 'bg-blue-100 dark:bg-blue-900/30';
  }
  if (intensity < 0.5) {
    return 'bg-blue-300 dark:bg-blue-800/50';
  }
  if (intensity < 0.75) {
    return 'bg-blue-500 dark:bg-blue-700';
  }
  return 'bg-blue-700 dark:bg-blue-600';
};

// Mock data generators
const generateMockFeatures = (): FeatureUsage[] => [
  {
    id: 'feat-1',
    name: 'Chat Mockup Creator',
    category: 'core',
    usageCount: 45200,
    uniqueUsers: 12500,
    avgSessionsPerUser: 3.6,
    adoptionRate: 78,
    retentionImpact: 85,
    trend: 12.5,
    heatmapData: [120, 85, 45, 30, 25, 40, 180, 450, 620, 580, 520, 480, 420, 510, 580, 620, 550, 480, 380, 320, 280, 220, 180, 150],
    topUserSegments: ['Pro Users', 'Designers'],
  },
  {
    id: 'feat-2',
    name: 'AI Response Generator',
    category: 'premium',
    usageCount: 28900,
    uniqueUsers: 8200,
    avgSessionsPerUser: 3.5,
    adoptionRate: 52,
    retentionImpact: 72,
    trend: 28.3,
    heatmapData: [80, 60, 35, 20, 15, 30, 120, 320, 480, 450, 420, 380, 350, 420, 480, 520, 480, 420, 320, 260, 220, 180, 140, 100],
    topUserSegments: ['Enterprise', 'Power Users'],
  },
  {
    id: 'feat-3',
    name: 'Template Library',
    category: 'core',
    usageCount: 38500,
    uniqueUsers: 15200,
    avgSessionsPerUser: 2.5,
    adoptionRate: 95,
    retentionImpact: 68,
    trend: 5.2,
    heatmapData: [150, 100, 60, 40, 35, 50, 200, 480, 650, 620, 580, 540, 480, 550, 620, 680, 620, 560, 450, 380, 320, 260, 210, 170],
    topUserSegments: ['Free Users', 'New Users'],
  },
  {
    id: 'feat-4',
    name: 'Export to PDF',
    category: 'advanced',
    usageCount: 22100,
    uniqueUsers: 9800,
    avgSessionsPerUser: 2.3,
    adoptionRate: 62,
    retentionImpact: 55,
    trend: -3.5,
    heatmapData: [60, 45, 25, 15, 12, 25, 100, 280, 420, 400, 380, 350, 320, 380, 420, 460, 420, 380, 300, 240, 200, 160, 120, 80],
    topUserSegments: ['Teams', 'Enterprise'],
  },
  {
    id: 'feat-5',
    name: 'Brand Kit Manager',
    category: 'premium',
    usageCount: 8500,
    uniqueUsers: 2800,
    avgSessionsPerUser: 3.0,
    adoptionRate: 18,
    retentionImpact: 82,
    trend: 45.2,
    heatmapData: [30, 22, 12, 8, 6, 15, 60, 180, 280, 260, 240, 220, 200, 240, 280, 320, 280, 240, 180, 140, 110, 90, 70, 50],
    topUserSegments: ['Enterprise', 'Agency'],
  },
  {
    id: 'feat-6',
    name: 'Real-time Collaboration',
    category: 'beta',
    usageCount: 4200,
    uniqueUsers: 1500,
    avgSessionsPerUser: 2.8,
    adoptionRate: 9,
    retentionImpact: 78,
    trend: 125.8,
    heatmapData: [15, 10, 5, 3, 2, 8, 40, 120, 180, 170, 160, 150, 140, 160, 180, 200, 180, 160, 120, 90, 70, 55, 40, 25],
    topUserSegments: ['Teams', 'Early Adopters'],
  },
  {
    id: 'feat-7',
    name: 'Social Media Mockups',
    category: 'core',
    usageCount: 32400,
    uniqueUsers: 11800,
    avgSessionsPerUser: 2.7,
    adoptionRate: 74,
    retentionImpact: 65,
    trend: 8.7,
    heatmapData: [110, 75, 45, 30, 25, 40, 160, 400, 560, 520, 480, 440, 400, 460, 520, 580, 520, 460, 360, 300, 250, 200, 160, 130],
    topUserSegments: ['Marketers', 'Content Creators'],
  },
  {
    id: 'feat-8',
    name: 'Version History',
    category: 'advanced',
    usageCount: 12800,
    uniqueUsers: 5600,
    avgSessionsPerUser: 2.3,
    adoptionRate: 35,
    retentionImpact: 58,
    trend: 2.1,
    heatmapData: [40, 30, 18, 12, 10, 20, 80, 220, 340, 320, 300, 280, 260, 300, 340, 380, 340, 300, 240, 190, 150, 120, 90, 60],
    topUserSegments: ['Pro Users', 'Teams'],
  },
];

const generateMockUsageByHour = (): UsageByHour[] => {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    usage: Math.floor(Math.random() * 5000) + (hour >= 9 && hour <= 17 ? 3000 : 500),
    users: Math.floor(Math.random() * 1000) + (hour >= 9 && hour <= 17 ? 800 : 100),
  }));
};

const generateMockUsageByDay = (): UsageByDay[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    usage: Math.floor(Math.random() * 30000) + (day === 'Sat' || day === 'Sun' ? 5000 : 15000),
    users: Math.floor(Math.random() * 5000) + (day === 'Sat' || day === 'Sun' ? 1000 : 3000),
  }));
};

const generateMockCorrelations = (): FeatureCorrelation[] => [
  { feature1: 'Chat Mockup Creator', feature2: 'Template Library', correlation: 0.85, combinedUsage: 32000 },
  { feature1: 'AI Response Generator', feature2: 'Chat Mockup Creator', correlation: 0.72, combinedUsage: 24000 },
  { feature1: 'Brand Kit Manager', feature2: 'Export to PDF', correlation: 0.68, combinedUsage: 6500 },
  { feature1: 'Social Media Mockups', feature2: 'Template Library', correlation: 0.78, combinedUsage: 28000 },
];

const generateMockStats = (): FeatureUsageStats => ({
  totalFeatures: 24,
  mostUsedFeature: 'Chat Mockup Creator',
  leastUsedFeature: 'Real-time Collaboration',
  avgAdoptionRate: 52.8,
  avgRetentionImpact: 68.5,
  newFeaturesLaunched: 3,
  deprecatedFeatures: 1,
});

export function FeatureUsageHeatmap({
  features: propFeatures,
  usageByHour: propUsageByHour,
  usageByDay: propUsageByDay,
  correlations: propCorrelations,
  stats: propStats,
  variant = 'full',
  onFeatureClick,
  onExport,
  className = '',
}: FeatureUsageHeatmapProps) {
  const [categoryFilter, setCategoryFilter] = useState<FeatureCategory | 'all'>('all');
  const [activeView, setActiveView] = useState<'heatmap' | 'features' | 'correlations'>('heatmap');

  const features = propFeatures || generateMockFeatures();
  const usageByHour = propUsageByHour || generateMockUsageByHour();
  const usageByDay = propUsageByDay || generateMockUsageByDay();
  const correlations = propCorrelations || generateMockCorrelations();
  const stats = propStats || generateMockStats();

  const filteredFeatures = useMemo(() => {
    return features
      .filter(f => categoryFilter === 'all' || f.category === categoryFilter)
      .sort((a, b) => b.usageCount - a.usageCount);
  }, [features, categoryFilter]);

  const maxHourlyUsage = useMemo(() => {
    return Math.max(...usageByHour.map(h => h.usage));
  }, [usageByHour]);

  const maxDailyUsage = useMemo(() => {
    return Math.max(...usageByDay.map(d => d.usage));
  }, [usageByDay]);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Feature Usage</h3>
          </div>
        </div>
        <div className="space-y-3">
          {filteredFeatures.slice(0, 4).map(feature => (
            <div key={feature.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{feature.name}</p>
                <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${feature.adoptionRate}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {feature.adoptionRate}
                %
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid variant (simple heatmap grid)
  if (variant === 'grid') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Usage by Hour</h3>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {usageByHour.slice(0, 24).map(hour => (
            <div
              key={hour.hour}
              className={`aspect-square rounded ${getUsageColor(hour.usage, maxHourlyUsage)} cursor-pointer transition-colors hover:ring-2 hover:ring-blue-400`}
              title={`${hour.hour}:00 - ${hour.usage.toLocaleString()} actions`}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>12am</span>
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
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Feature Usage</h3>
              <p className="text-sm text-gray-500">
                {stats.totalFeatures}
                {' '}
                features tracked
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.avgAdoptionRate}
              %
            </p>
            <p className="text-sm text-gray-500">Avg Adoption</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stats.avgRetentionImpact}
              %
            </p>
            <p className="text-sm text-gray-500">Retention Impact</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Features</p>
          {filteredFeatures.slice(0, 5).map(feature => (
            <div
              key={feature.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => onFeatureClick?.(feature.id)}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{feature.name}</p>
                  <span className={`rounded px-1.5 py-0.5 text-xs ${categoryConfig[feature.category].color}`}>
                    {categoryConfig[feature.category].label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {feature.usageCount.toLocaleString()}
                  {' '}
                  uses
                </p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${feature.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {feature.trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(feature.trend)}
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
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feature Usage Analytics</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Understand how users engage with features</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-5 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Features</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFeatures}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Avg Adoption</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgAdoptionRate}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Retention Impact</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgRetentionImpact}
              %
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">New Features</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newFeaturesLaunched}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Top Feature</span>
            </div>
            <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{stats.mostUsedFeature}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 p-2">
          {(['heatmap', 'features', 'correlations'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {view === 'heatmap' && 'Usage Heatmap'}
              {view === 'features' && 'Feature List'}
              {view === 'correlations' && 'Correlations'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'heatmap' && (
          <div className="space-y-8">
            {/* Hourly usage heatmap */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Usage by Hour of Day</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-24 gap-1">
                  {usageByHour.map(hour => (
                    <div
                      key={hour.hour}
                      className={`h-12 rounded ${getUsageColor(hour.usage, maxHourlyUsage)} group relative cursor-pointer transition-colors hover:ring-2 hover:ring-blue-400`}
                    >
                      <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {hour.hour}
                        :00 -
                        {hour.usage.toLocaleString()}
                        {' '}
                        actions
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-1 text-xs text-gray-500">
                  {[0, 4, 8, 12, 16, 20].map(h => (
                    <span key={h}>
                      {h}
                      :00
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily usage */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Usage by Day of Week</h3>
              <div className="space-y-2">
                {usageByDay.map(day => (
                  <div key={day.day} className="flex items-center gap-4">
                    <span className="w-12 text-sm text-gray-500">{day.day}</span>
                    <div className="h-8 flex-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                        style={{ width: `${(day.usage / maxDailyUsage) * 100}%` }}
                      />
                    </div>
                    <span className="w-24 text-right text-sm text-gray-600 dark:text-gray-400">
                      {day.usage.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature heatmap grid */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Feature Usage Patterns</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="pb-2 font-medium">Feature</th>
                      {Array.from({ length: 24 }, (_, i) => (
                        <th key={i} className="w-6 pb-2 text-center font-medium">{i}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatures.slice(0, 6).map((feature) => {
                      const featureMax = Math.max(...feature.heatmapData);
                      return (
                        <tr key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-2 pr-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                            {feature.name}
                          </td>
                          {feature.heatmapData.map((value, i) => (
                            <td key={i} className="p-0.5">
                              <div
                                className={`h-4 w-4 rounded-sm ${getUsageColor(value, featureMax)}`}
                                title={`${i}:00 - ${value} uses`}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'features' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value as FeatureCategory | 'all')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryConfig).map(([cat, config]) => (
                    <option key={cat} value={cat}>{config.label}</option>
                  ))}
                </select>
              </div>
              <span className="text-sm text-gray-500">
                {filteredFeatures.length}
                {' '}
                features
              </span>
            </div>

            <div className="space-y-3">
              {filteredFeatures.map(feature => (
                <div
                  key={feature.id}
                  className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  onClick={() => onFeatureClick?.(feature.id)}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h4>
                        <span className={`rounded px-2 py-0.5 text-xs ${categoryConfig[feature.category].color}`}>
                          {categoryConfig[feature.category].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>
                          {feature.usageCount.toLocaleString()}
                          {' '}
                          uses
                        </span>
                        <span>•</span>
                        <span>
                          {feature.uniqueUsers.toLocaleString()}
                          {' '}
                          users
                        </span>
                        <span>•</span>
                        <span>
                          {feature.avgSessionsPerUser}
                          {' '}
                          sessions/user
                        </span>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${feature.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {feature.trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium">
                        {Math.abs(feature.trend)}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {feature.adoptionRate}
                        %
                      </p>
                      <p className="text-xs text-gray-500">Adoption</p>
                    </div>
                    <div className="rounded bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {feature.retentionImpact}
                        %
                      </p>
                      <p className="text-xs text-gray-500">Retention Impact</p>
                    </div>
                    <div className="col-span-2 rounded bg-gray-50 p-2 dark:bg-gray-700/50">
                      <p className="mb-1 text-xs text-gray-500">Top Segments</p>
                      <div className="flex items-center gap-1">
                        {feature.topUserSegments.map((segment, i) => (
                          <span key={i} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {segment}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'correlations' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Feature Correlations</h3>
            <p className="mb-6 text-sm text-gray-500">
              Features that are frequently used together by the same users.
            </p>
            <div className="space-y-3">
              {correlations.map((corr, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-900 dark:text-white">{corr.feature1}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{corr.feature2}</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {(corr.correlation * 100).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                      style={{ width: `${corr.correlation * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {corr.combinedUsage.toLocaleString()}
                    {' '}
                    users use both features
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Insight:</strong>
                {' '}
                Users who adopt
                {correlations[0]?.feature1}
                {' '}
                are
                {((correlations[0]?.correlation || 0) * 100).toFixed(0)}
                % more likely
                to also use
                {correlations[0]?.feature2}
                . Consider bundling these features in onboarding.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeatureUsageHeatmap;
