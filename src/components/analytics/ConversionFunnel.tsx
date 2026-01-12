'use client';

import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileText,
  MousePointer,
  Percent,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type FunnelStepType = 'visit' | 'signup' | 'activation' | 'conversion' | 'retention' | 'custom';

export type FunnelStep = {
  id: string;
  name: string;
  type: FunnelStepType;
  description?: string;
  visitors: number;
  conversionRate: number; // rate from previous step
  dropOffRate: number;
  averageTimeSpent: number; // seconds
  previousStepId?: string;
};

export type FunnelData = {
  id: string;
  name: string;
  description?: string;
  steps: FunnelStep[];
  totalVisitors: number;
  overallConversionRate: number;
  dateRange: { start: Date; end: Date };
  comparisonPeriod?: {
    overallConversionRate: number;
    change: number;
  };
};

export type FunnelSegment = {
  id: string;
  name: string;
  color: string;
  data: FunnelData;
};

export type ConversionFunnelProps = {
  variant?: 'full' | 'compact' | 'widget';
  funnels?: FunnelData[];
  segments?: FunnelSegment[];
  selectedFunnelId?: string;
  onSelectFunnel?: (funnelId: string) => void;
  onExport?: (funnel: FunnelData, format: 'csv' | 'pdf') => void;
  onRefresh?: () => void;
  showComparison?: boolean;
  className?: string;
};

// Step type icons
const stepIcons: Record<FunnelStepType, React.ReactNode> = {
  visit: <Eye className="h-4 w-4" />,
  signup: <FileText className="h-4 w-4" />,
  activation: <MousePointer className="h-4 w-4" />,
  conversion: <CreditCard className="h-4 w-4" />,
  retention: <CheckCircle className="h-4 w-4" />,
  custom: <Target className="h-4 w-4" />,
};

// Mock data generator
const generateMockFunnels = (): FunnelData[] => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'funnel-signup',
      name: 'Sign-up Funnel',
      description: 'Track users from landing page to account creation',
      steps: [
        {
          id: 'step-1',
          name: 'Landing Page Visit',
          type: 'visit',
          visitors: 50000,
          conversionRate: 100,
          dropOffRate: 0,
          averageTimeSpent: 45,
        },
        {
          id: 'step-2',
          name: 'Pricing Page View',
          type: 'visit',
          description: 'Users who viewed pricing',
          visitors: 15000,
          conversionRate: 30,
          dropOffRate: 70,
          averageTimeSpent: 120,
          previousStepId: 'step-1',
        },
        {
          id: 'step-3',
          name: 'Sign-up Started',
          type: 'signup',
          description: 'Users who clicked sign up',
          visitors: 6000,
          conversionRate: 40,
          dropOffRate: 60,
          averageTimeSpent: 30,
          previousStepId: 'step-2',
        },
        {
          id: 'step-4',
          name: 'Sign-up Completed',
          type: 'signup',
          description: 'Users who completed registration',
          visitors: 4200,
          conversionRate: 70,
          dropOffRate: 30,
          averageTimeSpent: 90,
          previousStepId: 'step-3',
        },
        {
          id: 'step-5',
          name: 'Email Verified',
          type: 'activation',
          description: 'Users who verified their email',
          visitors: 3780,
          conversionRate: 90,
          dropOffRate: 10,
          averageTimeSpent: 180,
          previousStepId: 'step-4',
        },
      ],
      totalVisitors: 50000,
      overallConversionRate: 7.56,
      dateRange: { start: thirtyDaysAgo, end: now },
      comparisonPeriod: {
        overallConversionRate: 6.8,
        change: 11.2,
      },
    },
    {
      id: 'funnel-purchase',
      name: 'Purchase Funnel',
      description: 'Track users from sign-up to first purchase',
      steps: [
        {
          id: 'step-p1',
          name: 'Active Users',
          type: 'activation',
          visitors: 10000,
          conversionRate: 100,
          dropOffRate: 0,
          averageTimeSpent: 0,
        },
        {
          id: 'step-p2',
          name: 'Viewed Pricing',
          type: 'visit',
          visitors: 4500,
          conversionRate: 45,
          dropOffRate: 55,
          averageTimeSpent: 90,
          previousStepId: 'step-p1',
        },
        {
          id: 'step-p3',
          name: 'Started Checkout',
          type: 'conversion',
          visitors: 1800,
          conversionRate: 40,
          dropOffRate: 60,
          averageTimeSpent: 60,
          previousStepId: 'step-p2',
        },
        {
          id: 'step-p4',
          name: 'Completed Purchase',
          type: 'conversion',
          visitors: 1260,
          conversionRate: 70,
          dropOffRate: 30,
          averageTimeSpent: 120,
          previousStepId: 'step-p3',
        },
      ],
      totalVisitors: 10000,
      overallConversionRate: 12.6,
      dateRange: { start: thirtyDaysAgo, end: now },
      comparisonPeriod: {
        overallConversionRate: 10.2,
        change: 23.5,
      },
    },
    {
      id: 'funnel-onboarding',
      name: 'Onboarding Funnel',
      description: 'Track new user onboarding completion',
      steps: [
        {
          id: 'step-o1',
          name: 'New Sign-ups',
          type: 'signup',
          visitors: 5000,
          conversionRate: 100,
          dropOffRate: 0,
          averageTimeSpent: 0,
        },
        {
          id: 'step-o2',
          name: 'Profile Setup',
          type: 'activation',
          visitors: 4250,
          conversionRate: 85,
          dropOffRate: 15,
          averageTimeSpent: 120,
          previousStepId: 'step-o1',
        },
        {
          id: 'step-o3',
          name: 'First Mockup Created',
          type: 'activation',
          visitors: 3400,
          conversionRate: 80,
          dropOffRate: 20,
          averageTimeSpent: 300,
          previousStepId: 'step-o2',
        },
        {
          id: 'step-o4',
          name: 'First Export',
          type: 'activation',
          visitors: 2720,
          conversionRate: 80,
          dropOffRate: 20,
          averageTimeSpent: 60,
          previousStepId: 'step-o3',
        },
        {
          id: 'step-o5',
          name: 'Invited Team Member',
          type: 'activation',
          visitors: 816,
          conversionRate: 30,
          dropOffRate: 70,
          averageTimeSpent: 45,
          previousStepId: 'step-o4',
        },
      ],
      totalVisitors: 5000,
      overallConversionRate: 16.32,
      dateRange: { start: thirtyDaysAgo, end: now },
    },
  ];
};

// Helper components
const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Funnel step visualization
export const FunnelStepBar: React.FC<{
  step: FunnelStep;
  maxVisitors: number;
  index: number;
  totalSteps: number;
  showDropOff?: boolean;
}> = ({ step, maxVisitors, index, totalSteps, showDropOff = true }) => {
  const widthPercent = (step.visitors / maxVisitors) * 100;
  const isFirst = index === 0;
  const isLast = index === totalSteps - 1;

  return (
    <div className="relative">
      {/* Step bar */}
      <div className="flex items-center gap-4">
        <div className="w-32 shrink-0">
          <div className="mb-1 flex items-center gap-2">
            <div className="rounded bg-blue-100 p-1.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {stepIcons[step.type]}
            </div>
            <span className="truncate text-sm font-medium text-gray-900 dark:text-white">{step.name}</span>
          </div>
          {step.description && (
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
          )}
        </div>

        <div className="relative flex-1">
          <div className="h-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <div
              className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 pr-3 transition-all duration-500"
              style={{ width: `${widthPercent}%` }}
            >
              {widthPercent > 20 && (
                <span className="text-sm font-semibold text-white">{formatNumber(step.visitors)}</span>
              )}
            </div>
          </div>
          {widthPercent <= 20 && (
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatNumber(step.visitors)}
            </span>
          )}
        </div>

        <div className="w-24 shrink-0 text-right">
          {!isFirst && (
            <div className={`text-sm font-semibold ${step.conversionRate >= 50 ? 'text-green-600' : step.conversionRate >= 25 ? 'text-yellow-600' : 'text-red-600'}`}>
              {step.conversionRate.toFixed(1)}
              %
            </div>
          )}
          <div className="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            {formatTime(step.averageTimeSpent)}
          </div>
        </div>
      </div>

      {/* Drop-off indicator */}
      {showDropOff && !isLast && step.dropOffRate > 0 && (
        <div className="ml-32 py-2 pl-4">
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="font-medium text-red-600 dark:text-red-400">
              {step.dropOffRate.toFixed(1)}
              % drop-off
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatNumber(Math.round(step.visitors * (step.dropOffRate / 100)))}
              {' '}
              users lost
            </span>
          </div>
        </div>
      )}

      {/* Connector */}
      {!isLast && (
        <div className="ml-32 flex h-8 items-center pl-4">
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// Funnel summary card
export const FunnelSummaryCard: React.FC<{
  funnel: FunnelData;
  selected?: boolean;
  onClick?: () => void;
}> = ({ funnel, selected, onClick }) => {
  const hasImprovement = funnel.comparisonPeriod && funnel.comparisonPeriod.change !== 0;
  const isPositive = funnel.comparisonPeriod && funnel.comparisonPeriod.change > 0;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 dark:bg-blue-900/20 dark:ring-blue-800'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">{funnel.name}</h3>
        {hasImprovement && (
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {isPositive ? '+' : ''}
            {funnel.comparisonPeriod!.change.toFixed(1)}
            %
          </span>
        )}
      </div>
      {funnel.description && (
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{funnel.description}</p>
      )}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Visitors</div>
          <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(funnel.totalVisitors)}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Steps</div>
          <div className="font-semibold text-gray-900 dark:text-white">{funnel.steps.length}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Conversion</div>
          <div className="font-semibold text-green-600">
            {funnel.overallConversionRate.toFixed(1)}
            %
          </div>
        </div>
      </div>
    </div>
  );
};

// Bottleneck alert component
export const BottleneckAlert: React.FC<{ step: FunnelStep; previousStep: FunnelStep }> = ({
  step,
  previousStep,
}) => {
  if (step.dropOffRate < 50) {
    return null;
  }

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <div>
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
            High Drop-off Detected
          </h4>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
            {step.dropOffRate.toFixed(0)}
            % of users drop off between &quot;
            {previousStep.name}
            &quot; and &quot;
            {step.name}
            &quot;.
            Consider optimizing this step to improve conversion.
          </p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="text-yellow-700 dark:text-yellow-400">
              Lost users:
              {' '}
              {formatNumber(Math.round(previousStep.visitors * (step.dropOffRate / 100)))}
            </span>
            <span className="text-yellow-700 dark:text-yellow-400">
              Avg. time:
              {' '}
              {formatTime(step.averageTimeSpent)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  variant = 'full',
  funnels: propFunnels,
  selectedFunnelId: propSelectedId,
  onSelectFunnel,
  onExport,
  onRefresh,
  showComparison = true,
  className = '',
}) => {
  const [funnels] = useState<FunnelData[]>(() => propFunnels || generateMockFunnels());
  const [selectedFunnelId, setSelectedFunnelId] = useState<string>(propSelectedId || funnels[0]?.id || '');

  const selectedFunnel = useMemo(() => {
    return funnels.find(f => f.id === selectedFunnelId) || funnels[0];
  }, [funnels, selectedFunnelId]);

  const bottlenecks = useMemo(() => {
    if (!selectedFunnel) {
      return [];
    }
    return selectedFunnel.steps.filter((step, index) => {
      if (index === 0) {
        return false;
      }
      return step.dropOffRate >= 50;
    }).map((step, _index) => ({
      step,
      previousStep: selectedFunnel.steps[selectedFunnel.steps.findIndex(s => s.id === step.id) - 1]!,
    }));
  }, [selectedFunnel]);

  const handleSelectFunnel = (funnelId: string) => {
    setSelectedFunnelId(funnelId);
    onSelectFunnel?.(funnelId);
  };

  // Widget variant
  if (variant === 'widget') {
    const funnel = selectedFunnel;
    if (!funnel) {
      return null;
    }

    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Target className="h-5 w-5" />
            Funnel Overview
          </h3>
          <span
            className={`text-sm font-semibold ${
              funnel.overallConversionRate >= 10 ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {funnel.overallConversionRate.toFixed(1)}
            %
          </span>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {funnel.steps.map(step => (
              <div key={step.id} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">{step.name}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(step.visitors)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Target className="h-5 w-5" />
            Conversion Funnels
          </h3>
        </div>
        <div className="space-y-3 p-4">
          {funnels.map(funnel => (
            <FunnelSummaryCard
              key={funnel.id}
              funnel={funnel}
              selected={funnel.id === selectedFunnelId}
              onClick={() => handleSelectFunnel(funnel.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  if (!selectedFunnel) {
    return null;
  }
  const maxVisitors = Math.max(...selectedFunnel.steps.map(s => s.visitors));

  return (
    <div className={`min-h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-blue-500 p-3 text-white">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conversion Funnels</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analyze user journey and identify drop-off points
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RefreshCw className="h-5 w-5 text-gray-500" />
              </button>
            )}
            {onExport && (
              <button
                onClick={() => onExport(selectedFunnel, 'csv')}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}
          </div>
        </div>

        {/* Funnel selector */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {funnels.map(funnel => (
            <button
              key={funnel.id}
              onClick={() => handleSelectFunnel(funnel.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                funnel.id === selectedFunnelId
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {funnel.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main funnel visualization */}
          <div className="space-y-6 lg:col-span-2">
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Total Visitors</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(selectedFunnel.totalVisitors)}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Percent className="h-4 w-4" />
                  <span className="text-sm">Conversion Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    {selectedFunnel.overallConversionRate.toFixed(1)}
                    %
                  </span>
                  {showComparison && selectedFunnel.comparisonPeriod && (
                    <span
                      className={`text-sm font-medium ${
                        selectedFunnel.comparisonPeriod.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {selectedFunnel.comparisonPeriod.change > 0 ? '+' : ''}
                      {selectedFunnel.comparisonPeriod.change.toFixed(1)}
                      %
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(selectedFunnel.steps[selectedFunnel.steps.length - 1]?.visitors || 0)}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm">Total Drop-off</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {(100 - selectedFunnel.overallConversionRate).toFixed(1)}
                  %
                </div>
              </div>
            </div>

            {/* Funnel visualization */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                {selectedFunnel.name}
              </h2>
              <div className="space-y-2">
                {selectedFunnel.steps.map((step, index) => (
                  <FunnelStepBar
                    key={step.id}
                    step={step}
                    maxVisitors={maxVisitors}
                    index={index}
                    totalSteps={selectedFunnel.steps.length}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - insights and bottlenecks */}
          <div className="space-y-6">
            {/* Bottlenecks */}
            {bottlenecks.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bottlenecks Detected
                </h3>
                {bottlenecks.map(({ step, previousStep }) => (
                  <BottleneckAlert key={step.id} step={step} previousStep={previousStep} />
                ))}
              </div>
            )}

            {/* Step details */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Step Details</h3>
              <div className="space-y-4">
                {selectedFunnel.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">{step.name}</span>
                      <span className="text-sm text-gray-500">
                        Step
                        {index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Visitors:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{formatNumber(step.visitors)}</span>
                      </div>
                      {index > 0 && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Conv:</span>
                          <span className="ml-1 text-gray-900 dark:text-white">
                            {step.conversionRate.toFixed(1)}
                            %
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Time:</span>
                        <span className="ml-1 text-gray-900 dark:text-white">{formatTime(step.averageTimeSpent)}</span>
                      </div>
                      {index > 0 && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Drop:</span>
                          <span className="ml-1 text-red-600">
                            {step.dropOffRate.toFixed(1)}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              {selectedFunnel.dateRange.start.toLocaleDateString()}
              {' '}
              -
              {' '}
              {selectedFunnel.dateRange.end.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;
