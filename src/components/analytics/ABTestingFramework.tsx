'use client';

import {
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  FlaskConical,
  Pause,
  Play,
  Plus,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';
export type VariantType = 'control' | 'treatment';
export type MetricType = 'conversion' | 'engagement' | 'revenue' | 'retention' | 'custom';

export type ExperimentVariant = {
  id: string;
  name: string;
  type: VariantType;
  description: string;
  trafficAllocation: number; // percentage
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue?: number;
  confidence?: number;
  isWinner?: boolean;
};

export type ExperimentMetric = {
  id: string;
  name: string;
  type: MetricType;
  isPrimary: boolean;
  goal: 'increase' | 'decrease';
  baselineValue: number;
  currentValue: number;
  improvement: number;
  statisticalSignificance: number;
};

export type Experiment = {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  status: ExperimentStatus;
  startDate: Date;
  endDate?: Date;
  targetAudience: string;
  trafficPercentage: number;
  variants: ExperimentVariant[];
  metrics: ExperimentMetric[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalVisitors: number;
  daysRunning: number;
  minimumSampleSize: number;
  hasReachedSignificance: boolean;
};

export type ABTestingFrameworkProps = {
  variant?: 'full' | 'dashboard' | 'widget';
  experiments?: Experiment[];
  onCreateExperiment?: () => void;
  onUpdateExperiment?: (experiment: Experiment) => void;
  onDeleteExperiment?: (experimentId: string) => void;
  onStartExperiment?: (experimentId: string) => void;
  onStopExperiment?: (experimentId: string) => void;
  onDeclareWinner?: (experimentId: string, variantId: string) => void;
  className?: string;
};

// Mock data generator
const generateMockExperiments = (): Experiment[] => {
  const now = new Date();

  return [
    {
      id: 'exp-1',
      name: 'CTA Button Color Test',
      description: 'Testing whether a green CTA button performs better than blue',
      hypothesis: 'Changing the CTA button from blue to green will increase conversion rate by 15%',
      status: 'running',
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      targetAudience: 'All users on pricing page',
      trafficPercentage: 50,
      variants: [
        {
          id: 'var-1a',
          name: 'Control (Blue)',
          type: 'control',
          description: 'Original blue button',
          trafficAllocation: 50,
          visitors: 12450,
          conversions: 623,
          conversionRate: 5.0,
          confidence: 95,
        },
        {
          id: 'var-1b',
          name: 'Treatment (Green)',
          type: 'treatment',
          description: 'New green button',
          trafficAllocation: 50,
          visitors: 12380,
          conversions: 742,
          conversionRate: 5.99,
          confidence: 97,
          isWinner: true,
        },
      ],
      metrics: [
        {
          id: 'met-1',
          name: 'Conversion Rate',
          type: 'conversion',
          isPrimary: true,
          goal: 'increase',
          baselineValue: 5.0,
          currentValue: 5.99,
          improvement: 19.8,
          statisticalSignificance: 97,
        },
        {
          id: 'met-2',
          name: 'Click-through Rate',
          type: 'engagement',
          isPrimary: false,
          goal: 'increase',
          baselineValue: 12.3,
          currentValue: 14.2,
          improvement: 15.4,
          statisticalSignificance: 92,
        },
      ],
      createdBy: 'Sarah Johnson',
      createdAt: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      totalVisitors: 24830,
      daysRunning: 14,
      minimumSampleSize: 20000,
      hasReachedSignificance: true,
    },
    {
      id: 'exp-2',
      name: 'Homepage Hero Headline',
      description: 'Testing different value propositions in the hero section',
      hypothesis: 'A more specific headline will increase sign-ups by 20%',
      status: 'running',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      targetAudience: 'New visitors',
      trafficPercentage: 100,
      variants: [
        {
          id: 'var-2a',
          name: 'Generic Headline',
          type: 'control',
          description: 'Create Amazing Mockups',
          trafficAllocation: 33,
          visitors: 8234,
          conversions: 412,
          conversionRate: 5.0,
        },
        {
          id: 'var-2b',
          name: 'Specific Headline',
          type: 'treatment',
          description: 'Create Chat Mockups in Minutes',
          trafficAllocation: 33,
          visitors: 8156,
          conversions: 489,
          conversionRate: 5.99,
        },
        {
          id: 'var-2c',
          name: 'Social Proof Headline',
          type: 'treatment',
          description: 'Join 10,000+ Designers Creating Mockups',
          trafficAllocation: 34,
          visitors: 8390,
          conversions: 503,
          conversionRate: 5.99,
        },
      ],
      metrics: [
        {
          id: 'met-3',
          name: 'Sign-up Rate',
          type: 'conversion',
          isPrimary: true,
          goal: 'increase',
          baselineValue: 5.0,
          currentValue: 5.7,
          improvement: 14.0,
          statisticalSignificance: 78,
        },
      ],
      createdBy: 'Mike Chen',
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      totalVisitors: 24780,
      daysRunning: 7,
      minimumSampleSize: 30000,
      hasReachedSignificance: false,
    },
    {
      id: 'exp-3',
      name: 'Pricing Page Layout',
      description: 'Testing a simplified pricing table vs detailed feature comparison',
      hypothesis: 'A simplified layout will reduce decision fatigue and increase conversions',
      status: 'completed',
      startDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      targetAudience: 'Users who visited pricing page',
      trafficPercentage: 50,
      variants: [
        {
          id: 'var-3a',
          name: 'Detailed Layout',
          type: 'control',
          description: 'Full feature comparison table',
          trafficAllocation: 50,
          visitors: 15670,
          conversions: 627,
          conversionRate: 4.0,
        },
        {
          id: 'var-3b',
          name: 'Simplified Layout',
          type: 'treatment',
          description: 'Clean 3-tier pricing cards',
          trafficAllocation: 50,
          visitors: 15830,
          conversions: 791,
          conversionRate: 5.0,
          isWinner: true,
        },
      ],
      metrics: [
        {
          id: 'met-4',
          name: 'Purchase Rate',
          type: 'conversion',
          isPrimary: true,
          goal: 'increase',
          baselineValue: 4.0,
          currentValue: 5.0,
          improvement: 25.0,
          statisticalSignificance: 99,
        },
      ],
      createdBy: 'Emily Davis',
      createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      totalVisitors: 31500,
      daysRunning: 30,
      minimumSampleSize: 25000,
      hasReachedSignificance: true,
    },
    {
      id: 'exp-4',
      name: 'Onboarding Flow Test',
      description: 'Testing guided tour vs self-exploration for new users',
      hypothesis: 'A guided onboarding will improve 7-day retention by 30%',
      status: 'draft',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      targetAudience: 'New sign-ups',
      trafficPercentage: 20,
      variants: [
        {
          id: 'var-4a',
          name: 'Self-Exploration',
          type: 'control',
          description: 'Current experience without guidance',
          trafficAllocation: 50,
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
        },
        {
          id: 'var-4b',
          name: 'Guided Tour',
          type: 'treatment',
          description: 'Step-by-step interactive tutorial',
          trafficAllocation: 50,
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
        },
      ],
      metrics: [
        {
          id: 'met-5',
          name: '7-Day Retention',
          type: 'retention',
          isPrimary: true,
          goal: 'increase',
          baselineValue: 35.0,
          currentValue: 0,
          improvement: 0,
          statisticalSignificance: 0,
        },
      ],
      createdBy: 'John Smith',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      totalVisitors: 0,
      daysRunning: 0,
      minimumSampleSize: 5000,
      hasReachedSignificance: false,
    },
  ];
};

// Helper components
const StatusBadge: React.FC<{ status: ExperimentStatus }> = ({ status }) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    running: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    archived: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const icons = {
    draft: <Edit className="h-3 w-3" />,
    running: <Play className="h-3 w-3" />,
    paused: <Pause className="h-3 w-3" />,
    completed: <CheckCircle className="h-3 w-3" />,
    archived: <XCircle className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const ImprovementBadge: React.FC<{ improvement: number; goal: 'increase' | 'decrease' }> = ({ improvement, goal }) => {
  const isPositive = (goal === 'increase' && improvement > 0) || (goal === 'decrease' && improvement < 0);
  const Icon = improvement > 0 ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
        isPositive
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}
    >
      <Icon className="h-3 w-3" />
      {improvement > 0 ? '+' : ''}
      {improvement.toFixed(1)}
      %
    </span>
  );
};

const ProgressBar: React.FC<{ current: number; target: number; showLabel?: boolean }> = ({
  current,
  target,
  showLabel = true,
}) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${
            percentage >= 100 ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{current.toLocaleString()}</span>
          <span>
            {target.toLocaleString()}
            {' '}
            needed
          </span>
        </div>
      )}
    </div>
  );
};

// Variant comparison component
export const VariantComparison: React.FC<{ variants: ExperimentVariant[] }> = ({ variants }) => {
  const control = variants.find(v => v.type === 'control');

  return (
    <div className="space-y-3">
      {variants.map(variant => (
        <div
          key={variant.id}
          className={`rounded-lg border p-4 ${
            variant.isWinner
              ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">{variant.name}</span>
              {variant.type === 'control' && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  Control
                </span>
              )}
              {variant.isWinner && (
                <span className="flex items-center gap-1 rounded bg-green-200 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-400">
                  <Award className="h-3 w-3" />
                  Winner
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {variant.trafficAllocation}
              % traffic
            </span>
          </div>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{variant.description}</p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">Visitors</div>
              <div className="font-semibold text-gray-900 dark:text-white">{variant.visitors.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Conversions</div>
              <div className="font-semibold text-gray-900 dark:text-white">{variant.conversions.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">Rate</div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {variant.conversionRate.toFixed(2)}
                  %
                </span>
                {control && variant.type !== 'control' && (
                  <ImprovementBadge
                    improvement={((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100}
                    goal="increase"
                  />
                )}
              </div>
            </div>
          </div>
          {variant.confidence && (
            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Statistical Confidence</span>
                <span
                  className={`font-medium ${
                    variant.confidence >= 95
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {variant.confidence}
                  %
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Experiment card component
export const ExperimentCard: React.FC<{
  experiment: Experiment;
  onView?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ experiment, onView, onStart, onStop, onEdit: _onEdit, onDelete: _onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const primaryMetric = experiment.metrics.find(m => m.isPrimary);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{experiment.name}</h3>
              <StatusBadge status={experiment.status} />
              {experiment.hasReachedSignificance && (
                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Significant
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{experiment.description}</p>
          </div>
          {primaryMetric && primaryMetric.improvement !== 0 && (
            <ImprovementBadge improvement={primaryMetric.improvement} goal={primaryMetric.goal} />
          )}
        </div>

        <div className="mb-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Visitors</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {experiment.totalVisitors.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Variants</div>
            <div className="font-semibold text-gray-900 dark:text-white">{experiment.variants.length}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Running</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {experiment.daysRunning}
              {' '}
              days
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Traffic</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {experiment.trafficPercentage}
              %
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Sample Size Progress</span>
            <span className="text-gray-700 dark:text-gray-300">
              {Math.round((experiment.totalVisitors / experiment.minimumSampleSize) * 100)}
              %
            </span>
          </div>
          <ProgressBar current={experiment.totalVisitors} target={experiment.minimumSampleSize} showLabel={false} />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
          <div className="flex items-center gap-2">
            {experiment.status === 'draft' && onStart && (
              <button
                onClick={onStart}
                className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-sm text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
              >
                <Play className="h-4 w-4" />
                Start
              </button>
            )}
            {experiment.status === 'running' && onStop && (
              <button
                onClick={onStop}
                className="flex items-center gap-1 rounded-lg bg-yellow-100 px-3 py-1.5 text-sm text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            )}
            <button
              onClick={onView}
              className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 pb-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="pt-4">
            <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Hypothesis</h4>
            <p className="mb-4 text-sm text-gray-600 italic dark:text-gray-400">
              &quot;
              {experiment.hypothesis}
              &quot;
            </p>

            <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Variants</h4>
            <VariantComparison variants={experiment.variants} />

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              Started
              {' '}
              {experiment.startDate.toLocaleDateString()}
              {experiment.endDate && ` • Ended ${experiment.endDate.toLocaleDateString()}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
export const ABTestingFramework: React.FC<ABTestingFrameworkProps> = ({
  variant = 'full',
  experiments: propExperiments,
  onCreateExperiment,
  onUpdateExperiment,
  onDeleteExperiment,
  onStartExperiment,
  onStopExperiment,
  onDeclareWinner: _onDeclareWinner,
  className = '',
}) => {
  const [experiments] = useState<Experiment[]>(() => propExperiments || generateMockExperiments());
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | 'all'>('all');

  const filteredExperiments = useMemo(() => {
    if (statusFilter === 'all') {
      return experiments;
    }
    return experiments.filter(e => e.status === statusFilter);
  }, [experiments, statusFilter]);

  const stats = useMemo(() => ({
    total: experiments.length,
    running: experiments.filter(e => e.status === 'running').length,
    completed: experiments.filter(e => e.status === 'completed').length,
    winners: experiments.filter(e => e.variants.some(v => v.isWinner)).length,
  }), [experiments]);

  // Widget variant
  if (variant === 'widget') {
    const runningExperiments = experiments.filter(e => e.status === 'running');
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <FlaskConical className="h-5 w-5" />
            A/B Tests
          </h3>
          <span className="text-sm text-gray-500">
            {stats.running}
            {' '}
            running
          </span>
        </div>
        <div className="space-y-3 p-4">
          {runningExperiments.slice(0, 3).map((exp) => {
            const primaryMetric = exp.metrics.find(m => m.isPrimary);
            return (
              <div key={exp.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{exp.name}</div>
                  <div className="text-xs text-gray-500">
                    {exp.daysRunning}
                    {' '}
                    days running
                  </div>
                </div>
                {primaryMetric && primaryMetric.improvement !== 0 && (
                  <ImprovementBadge improvement={primaryMetric.improvement} goal={primaryMetric.goal} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Dashboard variant
  if (variant === 'dashboard') {
    return (
      <div className={`${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <FlaskConical className="h-6 w-6" />
            A/B Testing
          </h2>
          {onCreateExperiment && (
            <button
              onClick={onCreateExperiment}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Experiment
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {experiments.slice(0, 4).map(experiment => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              onStart={() => onStartExperiment?.(experiment.id)}
              onStop={() => onStopExperiment?.(experiment.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">A/B Testing</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Run experiments to optimize your product
              </p>
            </div>
          </div>
          {onCreateExperiment && (
            <button
              onClick={onCreateExperiment}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Experiment
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <FlaskConical className="h-4 w-4" />
              <span className="text-sm">Total Experiments</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Play className="h-4 w-4" />
              <span className="text-sm">Running</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.running}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Award className="h-4 w-4" />
              <span className="text-sm">With Winners</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.winners}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['all', 'running', 'draft', 'completed', 'paused', 'archived'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'All Experiments' : status}
            </button>
          ))}
        </div>

        {/* Experiments list */}
        <div className="space-y-4">
          {filteredExperiments.length === 0
            ? (
                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                  <FlaskConical className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No Experiments Found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {statusFilter === 'all'
                      ? 'Create your first A/B test to start experimenting'
                      : `No ${statusFilter} experiments found`}
                  </p>
                </div>
              )
            : (
                filteredExperiments.map(experiment => (
                  <ExperimentCard
                    key={experiment.id}
                    experiment={experiment}
                    onStart={() => onStartExperiment?.(experiment.id)}
                    onStop={() => onStopExperiment?.(experiment.id)}
                    onEdit={() => onUpdateExperiment?.(experiment)}
                    onDelete={() => onDeleteExperiment?.(experiment.id)}
                  />
                ))
              )}
        </div>
      </div>
    </div>
  );
};

export default ABTestingFramework;
