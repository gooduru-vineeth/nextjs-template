'use client';

import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  Info,
  LineChart,
  PieChart,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// Types
export type TimeRange = {
  start: Date;
  end: Date;
  label: string;
};

export type MetricData = {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
};

export type ROIMetrics = {
  totalRevenue: MetricData;
  costSavings: MetricData;
  timesSaved: MetricData;
  clientsWon: MetricData;
  proposalsCreated: MetricData;
  proposalsApproved: MetricData;
  averageProjectValue: MetricData;
  conversionRate: MetricData;
};

export type ProjectMetrics = {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  revenue: number;
  timeSpent: number;
  mockupsCreated: number;
  revisionsCount: number;
  startDate: Date;
  endDate?: Date;
};

export type ClientMetrics = {
  id: string;
  name: string;
  company: string;
  totalProjects: number;
  totalRevenue: number;
  averageProjectValue: number;
  satisfactionScore: number;
  lastProjectDate: Date;
};

export type TimelineDataPoint = {
  date: string;
  revenue: number;
  projects: number;
  clients: number;
  mockups: number;
};

export type IndustryBreakdown = {
  industry: string;
  projects: number;
  revenue: number;
  percentage: number;
};

export type BusinessInsight = {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
  createdAt: Date;
};

export type BusinessAnalyticsProps = {
  variant?: 'full' | 'dashboard' | 'widget';
  roiMetrics?: ROIMetrics;
  projects?: ProjectMetrics[];
  clients?: ClientMetrics[];
  timelineData?: TimelineDataPoint[];
  industryBreakdown?: IndustryBreakdown[];
  insights?: BusinessInsight[];
  onExportReport?: (format: 'pdf' | 'csv' | 'excel') => void;
  onRefresh?: () => void;
  onTimeRangeChange?: (range: TimeRange) => void;
  className?: string;
};

// Mock data generators
const generateMockROIMetrics = (): ROIMetrics => ({
  totalRevenue: { current: 125000, previous: 98000, change: 27000, changePercent: 27.5, trend: 'up' },
  costSavings: { current: 45000, previous: 38000, change: 7000, changePercent: 18.4, trend: 'up' },
  timesSaved: { current: 320, previous: 280, change: 40, changePercent: 14.3, trend: 'up' },
  clientsWon: { current: 24, previous: 18, change: 6, changePercent: 33.3, trend: 'up' },
  proposalsCreated: { current: 48, previous: 42, change: 6, changePercent: 14.3, trend: 'up' },
  proposalsApproved: { current: 36, previous: 28, change: 8, changePercent: 28.6, trend: 'up' },
  averageProjectValue: { current: 5200, previous: 5450, change: -250, changePercent: -4.6, trend: 'down' },
  conversionRate: { current: 75, previous: 66.7, change: 8.3, changePercent: 12.4, trend: 'up' },
});

const generateMockProjects = (): ProjectMetrics[] => [
  { id: '1', name: 'E-commerce Redesign', client: 'TechCorp', status: 'completed', revenue: 12500, timeSpent: 45, mockupsCreated: 24, revisionsCount: 3, startDate: new Date('2024-01-15'), endDate: new Date('2024-02-28') },
  { id: '2', name: 'Mobile App UI', client: 'StartupXYZ', status: 'active', revenue: 8500, timeSpent: 32, mockupsCreated: 18, revisionsCount: 2, startDate: new Date('2024-02-01') },
  { id: '3', name: 'Dashboard Design', client: 'FinanceHub', status: 'active', revenue: 15000, timeSpent: 28, mockupsCreated: 12, revisionsCount: 1, startDate: new Date('2024-02-10') },
  { id: '4', name: 'Landing Page', client: 'MarketingPro', status: 'completed', revenue: 3500, timeSpent: 12, mockupsCreated: 6, revisionsCount: 2, startDate: new Date('2024-01-20'), endDate: new Date('2024-02-05') },
  { id: '5', name: 'SaaS Platform UI', client: 'CloudSoft', status: 'pending', revenue: 22000, timeSpent: 0, mockupsCreated: 0, revisionsCount: 0, startDate: new Date('2024-03-01') },
];

const generateMockClients = (): ClientMetrics[] => [
  { id: '1', name: 'John Smith', company: 'TechCorp', totalProjects: 5, totalRevenue: 45000, averageProjectValue: 9000, satisfactionScore: 4.8, lastProjectDate: new Date('2024-02-28') },
  { id: '2', name: 'Sarah Johnson', company: 'StartupXYZ', totalProjects: 3, totalRevenue: 22500, averageProjectValue: 7500, satisfactionScore: 4.9, lastProjectDate: new Date('2024-02-15') },
  { id: '3', name: 'Mike Chen', company: 'FinanceHub', totalProjects: 8, totalRevenue: 72000, averageProjectValue: 9000, satisfactionScore: 4.7, lastProjectDate: new Date('2024-02-10') },
  { id: '4', name: 'Emily Davis', company: 'MarketingPro', totalProjects: 2, totalRevenue: 8000, averageProjectValue: 4000, satisfactionScore: 4.5, lastProjectDate: new Date('2024-02-05') },
];

const generateMockTimeline = (): TimelineDataPoint[] => [
  { date: '2024-01', revenue: 28000, projects: 8, clients: 12, mockups: 45 },
  { date: '2024-02', revenue: 35000, projects: 10, clients: 15, mockups: 62 },
  { date: '2024-03', revenue: 32000, projects: 9, clients: 14, mockups: 58 },
  { date: '2024-04', revenue: 42000, projects: 12, clients: 18, mockups: 78 },
  { date: '2024-05', revenue: 38000, projects: 11, clients: 16, mockups: 65 },
  { date: '2024-06', revenue: 50000, projects: 14, clients: 22, mockups: 92 },
];

const generateMockIndustryBreakdown = (): IndustryBreakdown[] => [
  { industry: 'Technology', projects: 28, revenue: 85000, percentage: 35 },
  { industry: 'Finance', projects: 18, revenue: 62000, percentage: 25 },
  { industry: 'Healthcare', projects: 12, revenue: 45000, percentage: 18 },
  { industry: 'E-commerce', projects: 15, revenue: 38000, percentage: 15 },
  { industry: 'Education', projects: 8, revenue: 18000, percentage: 7 },
];

const generateMockInsights = (): BusinessInsight[] => [
  { id: '1', type: 'opportunity', title: 'High-Value Client Potential', description: 'TechCorp has shown 40% increase in project requests. Consider offering a retainer package.', impact: 'high', actionable: true, action: 'Create Proposal', createdAt: new Date() },
  { id: '2', type: 'achievement', title: 'Conversion Rate Up!', description: 'Your proposal-to-project conversion rate has increased by 12.4% this quarter.', impact: 'medium', actionable: false, createdAt: new Date() },
  { id: '3', type: 'warning', title: 'Revenue Dip in Healthcare', description: 'Healthcare sector revenue decreased by 15% compared to last quarter.', impact: 'medium', actionable: true, action: 'Analyze Trends', createdAt: new Date() },
  { id: '4', type: 'tip', title: 'Optimize Your Workflow', description: 'Projects with fewer than 3 revisions have 25% higher profit margins.', impact: 'low', actionable: true, action: 'View Best Practices', createdAt: new Date() },
];

// Sub-components
const MetricCard: React.FC<{
  title: string;
  metric: MetricData;
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percent' | 'hours';
  className?: string;
}> = ({ title, metric, icon, format = 'number', className = '' }) => {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'hours':
        return `${value}h`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          metric.trend === 'up'
            ? 'text-green-600 dark:text-green-400'
            : metric.trend === 'down'
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400'
        }`}
        >
          {metric.trend === 'up'
            ? <ArrowUpRight className="h-4 w-4" />
            : metric.trend === 'down' ? <ArrowDownRight className="h-4 w-4" /> : null}
          {Math.abs(metric.changePercent).toFixed(1)}
          %
        </div>
      </div>
      <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
        {formatValue(metric.current)}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        vs.
        {' '}
        {formatValue(metric.previous)}
        {' '}
        last period
      </div>
    </div>
  );
};

const MiniChart: React.FC<{
  data: number[];
  color?: string;
  height?: number;
}> = ({ data, color = '#3B82F6', height = 40 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((max - value) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const InsightCard: React.FC<{
  insight: BusinessInsight;
  onAction?: () => void;
}> = ({ insight, onAction }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'opportunity': return <Target className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'achievement': return <Award className="h-5 w-5" />;
      case 'tip': return <Info className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (insight.type) {
      case 'opportunity': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'achievement': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'tip': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getColors()}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              insight.impact === 'high'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : insight.impact === 'medium'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
            >
              {insight.impact}
              {' '}
              impact
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
          {insight.actionable && insight.action && (
            <button
              onClick={onAction}
              className="mt-2 text-sm font-medium hover:underline"
            >
              {insight.action}
              {' '}
              →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectRow: React.FC<{
  project: ProjectMetrics;
  onClick?: () => void;
}> = ({ project, onClick }) => {
  const statusColors = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
    >
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{project.client}</div>
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-900 dark:text-white">
        $
        {project.revenue.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
        {project.timeSpent}
        h
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{project.mockupsCreated}</td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{project.revisionsCount}</td>
    </tr>
  );
};

const IndustryBar: React.FC<{
  data: IndustryBreakdown;
  maxPercentage: number;
}> = ({ data, maxPercentage }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700 dark:text-gray-300">{data.industry}</span>
      <span className="text-gray-500 dark:text-gray-400">
        $
        {data.revenue.toLocaleString()}
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
      <div
        className="h-full rounded-full bg-blue-500 transition-all duration-500 dark:bg-blue-400"
        style={{ width: `${(data.percentage / maxPercentage) * 100}%` }}
      />
    </div>
    <div className="text-xs text-gray-400 dark:text-gray-500">
      {data.projects}
      {' '}
      projects (
      {data.percentage}
      %)
    </div>
  </div>
);

// Time range presets
const timeRangePresets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This year', days: 365 },
  { label: 'All time', days: -1 },
];

// Main component
export const BusinessAnalytics: React.FC<BusinessAnalyticsProps> = ({
  variant = 'full',
  roiMetrics: propROIMetrics,
  projects: propProjects,
  clients: propClients,
  timelineData: propTimeline,
  industryBreakdown: propIndustry,
  insights: propInsights,
  onExportReport,
  onRefresh,
  onTimeRangeChange,
  className = '',
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRangePresets[1]!);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'clients' | 'insights'>('overview');
  const [isExporting, setIsExporting] = useState(false);

  // Use props or mock data
  const roiMetrics = propROIMetrics || generateMockROIMetrics();
  const projects = propProjects || generateMockProjects();
  const clients = propClients || generateMockClients();
  const timelineData = propTimeline || generateMockTimeline();
  const industryBreakdown = propIndustry || generateMockIndustryBreakdown();
  const insights = propInsights || generateMockInsights();

  const handleTimeRangeChange = useCallback((preset: typeof timeRangePresets[0]) => {
    setSelectedTimeRange(preset);
    if (onTimeRangeChange) {
      const end = new Date();
      const start = preset.days === -1
        ? new Date(0)
        : new Date(Date.now() - preset.days * 24 * 60 * 60 * 1000);
      onTimeRangeChange({ start, end, label: preset.label });
    }
  }, [onTimeRangeChange]);

  const handleExport = useCallback(async (format: 'pdf' | 'csv' | 'excel') => {
    setIsExporting(true);
    try {
      if (onExportReport) {
        await onExportReport(format);
      }
    } finally {
      setIsExporting(false);
    }
  }, [onExportReport]);

  const maxIndustryPercentage = useMemo(() =>
    Math.max(...industryBreakdown.map(i => i.percentage)), [industryBreakdown]);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Business Overview</h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $
              {roiMetrics.totalRevenue.current.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {roiMetrics.clientsWon.current}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Clients</div>
          </div>
        </div>
        <div className="mt-4 h-12">
          <MiniChart data={timelineData.map(d => d.revenue)} />
        </div>
      </div>
    );
  }

  // Dashboard variant
  if (variant === 'dashboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Analytics</h2>
          <div className="flex items-center gap-2">
            <select
              value={selectedTimeRange.label}
              onChange={(e) => {
                const preset = timeRangePresets.find(p => p.label === e.target.value);
                if (preset) {
                  handleTimeRangeChange(preset);
                }
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {timeRangePresets.map(preset => (
                <option key={preset.label} value={preset.label}>{preset.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard title="Total Revenue" metric={roiMetrics.totalRevenue} icon={<DollarSign className="h-5 w-5" />} format="currency" />
          <MetricCard title="Clients Won" metric={roiMetrics.clientsWon} icon={<Users className="h-5 w-5" />} />
          <MetricCard title="Time Saved" metric={roiMetrics.timesSaved} icon={<Clock className="h-5 w-5" />} format="hours" />
          <MetricCard title="Conversion Rate" metric={roiMetrics.conversionRate} icon={<Target className="h-5 w-5" />} format="percent" />
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Key Insights</h3>
          <div className="grid gap-3">
            {insights.slice(0, 2).map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Business Analytics</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Track your ROI and business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTimeRange.label}
            onChange={(e) => {
              const preset = timeRangePresets.find(p => p.label === e.target.value);
              if (preset) {
                handleTimeRangeChange(preset);
              }
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {timeRangePresets.map(preset => (
              <option key={preset.label} value={preset.label}>{preset.label}</option>
            ))}
          </select>
          <button
            onClick={onRefresh}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {(['overview', 'projects', 'clients', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ROI Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Revenue" metric={roiMetrics.totalRevenue} icon={<DollarSign className="h-5 w-5" />} format="currency" />
            <MetricCard title="Cost Savings" metric={roiMetrics.costSavings} icon={<TrendingUp className="h-5 w-5" />} format="currency" />
            <MetricCard title="Time Saved" metric={roiMetrics.timesSaved} icon={<Clock className="h-5 w-5" />} format="hours" />
            <MetricCard title="Clients Won" metric={roiMetrics.clientsWon} icon={<Users className="h-5 w-5" />} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Proposals Created" metric={roiMetrics.proposalsCreated} icon={<FileText className="h-5 w-5" />} />
            <MetricCard title="Proposals Approved" metric={roiMetrics.proposalsApproved} icon={<CheckCircle className="h-5 w-5" />} />
            <MetricCard title="Avg. Project Value" metric={roiMetrics.averageProjectValue} icon={<Briefcase className="h-5 w-5" />} format="currency" />
            <MetricCard title="Conversion Rate" metric={roiMetrics.conversionRate} icon={<Target className="h-5 w-5" />} format="percent" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Timeline */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
                <LineChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-48">
                <MiniChart data={timelineData.map(d => d.revenue)} height={192} />
              </div>
              <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                {timelineData.map(d => (
                  <span key={d.date}>{d.date}</span>
                ))}
              </div>
            </div>

            {/* Industry Breakdown */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Industry Breakdown</h3>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {industryBreakdown.map(data => (
                  <IndustryBar key={data.industry} data={data} maxPercentage={maxIndustryPercentage} />
                ))}
              </div>
            </div>
          </div>

          {/* Top Insights */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Business Insights</h3>
              <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                View all
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {insights.slice(0, 4).map(insight => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Project Performance</h3>
              <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Mockups</th>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Revisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {projects.map(project => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map(client => (
            <div
              key={client.id}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{client.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{client.company}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">{client.satisfactionScore}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    $
                    {client.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {client.totalProjects}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Avg. project value: $
                  {client.averageProjectValue.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
};

// Export sub-components
export { IndustryBar, InsightCard, MetricCard, MiniChart, ProjectRow };

export default BusinessAnalytics;
