'use client';

import {
  Activity,
  Calendar,
  Download,
  Eye,
  Filter,
  Globe,
  Layers,
  Monitor,
  Plus,
  RefreshCw,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type SegmentType = 'behavioral' | 'demographic' | 'geographic' | 'technographic' | 'custom';
export type SegmentStatus = 'active' | 'draft' | 'archived';
export type ComparisonOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between' | 'in' | 'not_in';

export type SegmentCondition = {
  id: string;
  property: string;
  operator: ComparisonOperator;
  value: string | number | string[] | [number, number];
  logicalOperator?: 'and' | 'or';
};

export type UserSegment = {
  id: string;
  name: string;
  description: string;
  type: SegmentType;
  status: SegmentStatus;
  conditions: SegmentCondition[];
  userCount: number;
  percentageOfTotal: number;
  growth: number;
  avgRevenue: number;
  avgEngagement: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  color: string;
};

export type CohortData = {
  cohortId: string;
  cohortName: string;
  startDate: Date;
  userCount: number;
  retentionByWeek: number[];
  avgLifetimeValue: number;
  avgSessionDuration: number;
  conversionRate: number;
};

export type SegmentComparison = {
  segmentId: string;
  segmentName: string;
  metrics: {
    name: string;
    value: number;
    percentile: number;
  }[];
};

export type SegmentStats = {
  totalUsers: number;
  totalSegments: number;
  activeSegments: number;
  avgSegmentSize: number;
  topGrowingSegment: string;
  topRevenueSegment: string;
};

export type UserSegmentationProps = {
  segments?: UserSegment[];
  cohorts?: CohortData[];
  stats?: SegmentStats;
  variant?: 'full' | 'compact' | 'widget' | 'cohort';
  onCreateSegment?: (segment: Partial<UserSegment>) => void;
  onUpdateSegment?: (segmentId: string, updates: Partial<UserSegment>) => void;
  onDeleteSegment?: (segmentId: string) => void;
  onExportSegment?: (segmentId: string) => void;
  onViewSegmentUsers?: (segmentId: string) => void;
  className?: string;
};

// Segment type configuration
const segmentTypeConfig: Record<SegmentType, { label: string; color: string; icon: React.ReactNode }> = {
  behavioral: { label: 'Behavioral', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Activity className="h-4 w-4" /> },
  demographic: { label: 'Demographic', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Users className="h-4 w-4" /> },
  geographic: { label: 'Geographic', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <Globe className="h-4 w-4" /> },
  technographic: { label: 'Technographic', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <Monitor className="h-4 w-4" /> },
  custom: { label: 'Custom', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: <Target className="h-4 w-4" /> },
};

// Mock data generators
const generateMockSegments = (): UserSegment[] => [
  {
    id: 'seg-1',
    name: 'Power Users',
    description: 'Users who create 10+ mockups per week',
    type: 'behavioral',
    status: 'active',
    conditions: [
      { id: 'c1', property: 'mockups_per_week', operator: 'greater_than', value: 10 },
      { id: 'c2', property: 'subscription_tier', operator: 'in', value: ['pro', 'team'], logicalOperator: 'and' },
    ],
    userCount: 2450,
    percentageOfTotal: 8.5,
    growth: 12.3,
    avgRevenue: 45.00,
    avgEngagement: 85,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdBy: 'Admin',
    color: '#3B82F6',
  },
  {
    id: 'seg-2',
    name: 'Enterprise Prospects',
    description: 'Team users with high activity likely to upgrade',
    type: 'behavioral',
    status: 'active',
    conditions: [
      { id: 'c1', property: 'team_size', operator: 'greater_than', value: 5 },
      { id: 'c2', property: 'feature_usage', operator: 'contains', value: 'collaboration', logicalOperator: 'and' },
    ],
    userCount: 890,
    percentageOfTotal: 3.1,
    growth: 25.7,
    avgRevenue: 89.00,
    avgEngagement: 78,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: 'Marketing',
    color: '#8B5CF6',
  },
  {
    id: 'seg-3',
    name: 'At-Risk Users',
    description: 'Users with declining engagement',
    type: 'behavioral',
    status: 'active',
    conditions: [
      { id: 'c1', property: 'days_since_login', operator: 'greater_than', value: 14 },
      { id: 'c2', property: 'subscription_status', operator: 'equals', value: 'active', logicalOperator: 'and' },
    ],
    userCount: 1240,
    percentageOfTotal: 4.3,
    growth: -8.5,
    avgRevenue: 25.00,
    avgEngagement: 22,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: 'Success',
    color: '#EF4444',
  },
  {
    id: 'seg-4',
    name: 'Mobile Users',
    description: 'Users primarily using mobile devices',
    type: 'technographic',
    status: 'active',
    conditions: [
      { id: 'c1', property: 'primary_device', operator: 'equals', value: 'mobile' },
    ],
    userCount: 5670,
    percentageOfTotal: 19.6,
    growth: 18.2,
    avgRevenue: 15.00,
    avgEngagement: 62,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: 'Product',
    color: '#10B981',
  },
  {
    id: 'seg-5',
    name: 'US Enterprise',
    description: 'Enterprise users in the United States',
    type: 'geographic',
    status: 'active',
    conditions: [
      { id: 'c1', property: 'country', operator: 'equals', value: 'US' },
      { id: 'c2', property: 'subscription_tier', operator: 'equals', value: 'enterprise', logicalOperator: 'and' },
    ],
    userCount: 456,
    percentageOfTotal: 1.6,
    growth: 32.1,
    avgRevenue: 299.00,
    avgEngagement: 91,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdBy: 'Sales',
    color: '#F59E0B',
  },
];

const generateMockCohorts = (): CohortData[] => [
  {
    cohortId: 'coh-1',
    cohortName: 'January 2026',
    startDate: new Date('2026-01-01'),
    userCount: 3200,
    retentionByWeek: [100, 68, 52, 45, 41, 38, 35, 33],
    avgLifetimeValue: 125.50,
    avgSessionDuration: 18.5,
    conversionRate: 8.2,
  },
  {
    cohortId: 'coh-2',
    cohortName: 'December 2025',
    startDate: new Date('2025-12-01'),
    userCount: 2890,
    retentionByWeek: [100, 72, 58, 49, 44, 40, 37, 35],
    avgLifetimeValue: 142.30,
    avgSessionDuration: 21.2,
    conversionRate: 9.1,
  },
  {
    cohortId: 'coh-3',
    cohortName: 'November 2025',
    startDate: new Date('2025-11-01'),
    userCount: 2650,
    retentionByWeek: [100, 65, 48, 42, 38, 35, 32, 30],
    avgLifetimeValue: 98.70,
    avgSessionDuration: 15.8,
    conversionRate: 6.8,
  },
  {
    cohortId: 'coh-4',
    cohortName: 'October 2025',
    startDate: new Date('2025-10-01'),
    userCount: 2420,
    retentionByWeek: [100, 70, 55, 47, 42, 39, 36, 34],
    avgLifetimeValue: 135.20,
    avgSessionDuration: 19.4,
    conversionRate: 8.5,
  },
];

const generateMockStats = (): SegmentStats => ({
  totalUsers: 28900,
  totalSegments: 12,
  activeSegments: 8,
  avgSegmentSize: 2408,
  topGrowingSegment: 'US Enterprise',
  topRevenueSegment: 'Enterprise Prospects',
});

export function UserSegmentation({
  segments: propSegments,
  cohorts: propCohorts,
  stats: propStats,
  variant = 'full',
  onCreateSegment,
  onDeleteSegment,
  onExportSegment,
  onViewSegmentUsers,
  className = '',
}: UserSegmentationProps) {
  const [activeTab, setActiveTab] = useState<'segments' | 'cohorts' | 'compare'>('segments');
  const [typeFilter, setTypeFilter] = useState<SegmentType | 'all'>('all');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const segments = propSegments || generateMockSegments();
  const cohorts = propCohorts || generateMockCohorts();
  const stats = propStats || generateMockStats();

  const filteredSegments = useMemo(() => {
    return segments.filter(s =>
      s.status === 'active' && (typeFilter === 'all' || s.type === typeFilter),
    ).sort((a, b) => b.userCount - a.userCount);
  }, [segments, typeFilter]);

  const toggleSegmentSelection = (segmentId: string) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId],
    );
  };

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">User Segments</h3>
          </div>
          <span className="text-sm text-gray-500">
            {stats.activeSegments}
            {' '}
            active
          </span>
        </div>
        <div className="space-y-3">
          {filteredSegments.slice(0, 4).map(segment => (
            <div key={segment.id} className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{segment.name}</p>
                <p className="text-xs text-gray-500">
                  {segment.userCount.toLocaleString()}
                  {' '}
                  users
                </p>
              </div>
              <div className={`flex items-center gap-1 text-xs ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {segment.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(segment.growth)}
                %
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Cohort variant
  if (variant === 'cohort') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Cohort Analysis</h3>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="pb-3 font-medium">Cohort</th>
                <th className="pb-3 text-center font-medium">Users</th>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                  <th key={week} className="pb-3 text-center font-medium">
                    W
                    {week}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {cohorts.map(cohort => (
                <tr key={cohort.cohortId}>
                  <td className="py-3 font-medium text-gray-900 dark:text-white">{cohort.cohortName}</td>
                  <td className="py-3 text-center text-gray-600 dark:text-gray-400">{cohort.userCount.toLocaleString()}</td>
                  {cohort.retentionByWeek.map((retention, index) => (
                    <td key={index} className="py-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          retention >= 50
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : retention >= 30
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {retention}
                        %
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">User Segmentation</h3>
              <p className="text-sm text-gray-500">
                {stats.totalUsers.toLocaleString()}
                {' '}
                total users
              </p>
            </div>
          </div>
          <button
            onClick={() => onCreateSegment?.({})}
            className="rounded-lg bg-purple-600 p-2 text-white transition-colors hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSegments}</p>
            <p className="text-sm text-gray-500">Active Segments</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgSegmentSize.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Avg Segment Size</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredSegments.slice(0, 5).map(segment => (
            <div
              key={segment.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              onClick={() => onViewSegmentUsers?.(segment.id)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${segment.color}20` }}>
                {segmentTypeConfig[segment.type].icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">{segment.name}</p>
                <p className="text-xs text-gray-500">
                  {segment.userCount.toLocaleString()}
                  {' '}
                  users (
                  {segment.percentageOfTotal}
                  %)
                </p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {segment.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(segment.growth)}
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
            <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/30">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Segmentation</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Analyze and segment your user base</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => onCreateSegment?.({})}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              Create Segment
            </button>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Users</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Active Segments</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSegments}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Top Growing</span>
            </div>
            <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{stats.topGrowingSegment}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Target className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Top Revenue</span>
            </div>
            <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{stats.topRevenueSegment}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 p-2">
          {(['segments', 'cohorts', 'compare'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'segments' && 'Segments'}
              {tab === 'cohorts' && 'Cohort Analysis'}
              {tab === 'compare' && 'Compare'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'segments' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value as SegmentType | 'all')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Types</option>
                  {Object.entries(segmentTypeConfig).map(([type, config]) => (
                    <option key={type} value={type}>{config.label}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-gray-500">
                {filteredSegments.length}
                {' '}
                segments
              </p>
            </div>

            <div className="space-y-3">
              {filteredSegments.map(segment => (
                <div
                  key={segment.id}
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${segment.color}20` }}
                      >
                        {segmentTypeConfig[segment.type].icon}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{segment.name}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-xs ${segmentTypeConfig[segment.type].color}`}>
                            {segmentTypeConfig[segment.type].label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{segment.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onViewSegmentUsers?.(segment.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onExportSegment?.(segment.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteSegment?.(segment.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{segment.userCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Users</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {segment.percentageOfTotal}
                        %
                      </p>
                      <p className="text-xs text-gray-500">of Total</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className={`flex items-center justify-center gap-1 text-lg font-bold ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {segment.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {Math.abs(segment.growth)}
                        %
                      </p>
                      <p className="text-xs text-gray-500">Growth</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        $
                        {segment.avgRevenue.toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500">Avg Revenue</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-700/50">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {segment.avgEngagement}
                        %
                      </p>
                      <p className="text-xs text-gray-500">Engagement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cohorts' && (
          <div>
            <div className="mb-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Retention by Cohort</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      <th className="pb-3 font-medium">Cohort</th>
                      <th className="pb-3 text-center font-medium">Users</th>
                      <th className="pb-3 text-center font-medium">LTV</th>
                      <th className="pb-3 text-center font-medium">Conv.</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
                        <th key={week} className="pb-3 text-center font-medium">
                          W
                          {week}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {cohorts.map(cohort => (
                      <tr key={cohort.cohortId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{cohort.cohortName}</span>
                          </div>
                        </td>
                        <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                          {cohort.userCount.toLocaleString()}
                        </td>
                        <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                          $
                          {cohort.avgLifetimeValue.toFixed(0)}
                        </td>
                        <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                          {cohort.conversionRate}
                          %
                        </td>
                        {cohort.retentionByWeek.map((retention, index) => (
                          <td key={index} className="py-3 text-center">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                                retention >= 50
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : retention >= 30
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {retention}
                              %
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cohort metrics summary */}
            <div className="grid grid-cols-4 gap-4">
              {cohorts.slice(0, 4).map(cohort => (
                <div key={cohort.cohortId} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <p className="mb-2 font-medium text-gray-900 dark:text-white">{cohort.cohortName}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Avg Session</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {cohort.avgSessionDuration}
                        m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">LTV</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        $
                        {cohort.avgLifetimeValue.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Week 8 Ret.</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {cohort.retentionByWeek[7]}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Select segments to compare their metrics side by side.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-4">
              {filteredSegments.map(segment => (
                <button
                  key={segment.id}
                  onClick={() => toggleSegmentSelection(segment.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-colors ${
                    selectedSegments.includes(segment.id)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{segment.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {segment.userCount.toLocaleString()}
                    {' '}
                    users
                  </p>
                </button>
              ))}
            </div>

            {selectedSegments.length >= 2 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-3 text-left font-medium text-gray-500">Metric</th>
                      {selectedSegments.map((segmentId) => {
                        const segment = segments.find(s => s.id === segmentId);
                        return segment
                          ? (
                              <th key={segmentId} className="pb-3 text-center font-medium text-gray-900 dark:text-white">
                                {segment.name}
                              </th>
                            )
                          : null;
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr>
                      <td className="py-3 text-gray-500">User Count</td>
                      {selectedSegments.map((segmentId) => {
                        const segment = segments.find(s => s.id === segmentId);
                        return segment
                          ? (
                              <td key={segmentId} className="py-3 text-center font-medium text-gray-900 dark:text-white">
                                {segment.userCount.toLocaleString()}
                              </td>
                            )
                          : null;
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-500">Growth</td>
                      {selectedSegments.map((segmentId) => {
                        const segment = segments.find(s => s.id === segmentId);
                        return segment
                          ? (
                              <td key={segmentId} className={`py-3 text-center font-medium ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {segment.growth >= 0 ? '+' : ''}
                                {segment.growth}
                                %
                              </td>
                            )
                          : null;
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-500">Avg Revenue</td>
                      {selectedSegments.map((segmentId) => {
                        const segment = segments.find(s => s.id === segmentId);
                        return segment
                          ? (
                              <td key={segmentId} className="py-3 text-center font-medium text-gray-900 dark:text-white">
                                $
                                {segment.avgRevenue.toFixed(2)}
                              </td>
                            )
                          : null;
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-500">Engagement</td>
                      {selectedSegments.map((segmentId) => {
                        const segment = segments.find(s => s.id === segmentId);
                        return segment
                          ? (
                              <td key={segmentId} className="py-3 text-center font-medium text-gray-900 dark:text-white">
                                {segment.avgEngagement}
                                %
                              </td>
                            )
                          : null;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedSegments.length < 2 && (
              <p className="py-8 text-center text-gray-500">
                Select at least 2 segments to compare
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSegmentation;
