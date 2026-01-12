'use client';

import {
  Activity,
  AlertTriangle,
  Bell,
  Clock,
  Download,
  Eye,
  Heart,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
  Target,
  TrendingDown,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type ChurnRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type InterventionType = 'email' | 'in-app' | 'support' | 'discount' | 'feature';
export type InterventionStatus = 'pending' | 'sent' | 'engaged' | 'converted' | 'churned';

export type ChurnRiskFactor = {
  factor: string;
  impact: number;
  description: string;
  trend: 'improving' | 'declining' | 'stable';
};

export type AtRiskUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  riskLevel: ChurnRiskLevel;
  riskScore: number;
  daysSinceLastActive: number;
  subscriptionTier: string;
  monthlyRevenue: number;
  riskFactors: ChurnRiskFactor[];
  suggestedInterventions: string[];
  lastIntervention?: {
    type: InterventionType;
    date: Date;
    status: InterventionStatus;
  };
};

export type ChurnPredictionModel = {
  accuracy: number;
  lastTrainedAt: Date;
  totalPredictions: number;
  correctPredictions: number;
  falsePositives: number;
  falseNegatives: number;
};

export type InterventionStats = {
  type: InterventionType;
  sent: number;
  engaged: number;
  converted: number;
  successRate: number;
};

export type ChurnStats = {
  atRiskTotal: number;
  atRiskRevenue: number;
  predictedChurnRate: number;
  actualChurnRate: number;
  preventedChurns: number;
  savedRevenue: number;
  interventionsSent: number;
  interventionsEngaged: number;
};

export type ChurnPredictionProps = {
  atRiskUsers?: AtRiskUser[];
  stats?: ChurnStats;
  model?: ChurnPredictionModel;
  interventionStats?: InterventionStats[];
  variant?: 'full' | 'compact' | 'widget' | 'list';
  onViewUser?: (userId: string) => void;
  onSendIntervention?: (userId: string, type: InterventionType) => void;
  onExport?: () => void;
  className?: string;
};

// Risk level configuration
const riskLevelConfig: Record<ChurnRiskLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low Risk', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  medium: { label: 'Medium Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  high: { label: 'High Risk', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  critical: { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
};

const interventionTypeConfig: Record<InterventionType, { label: string; icon: React.ReactNode }> = {
  'email': { label: 'Email Campaign', icon: <Mail className="h-4 w-4" /> },
  'in-app': { label: 'In-App Message', icon: <Bell className="h-4 w-4" /> },
  'support': { label: 'Support Outreach', icon: <MessageSquare className="h-4 w-4" /> },
  'discount': { label: 'Discount Offer', icon: <Zap className="h-4 w-4" /> },
  'feature': { label: 'Feature Highlight', icon: <Target className="h-4 w-4" /> },
};

// Mock data generators
const generateMockAtRiskUsers = (): AtRiskUser[] => [
  {
    id: 'user-1',
    name: 'Alex Thompson',
    email: 'alex@company.com',
    riskLevel: 'critical',
    riskScore: 92,
    daysSinceLastActive: 21,
    subscriptionTier: 'Pro',
    monthlyRevenue: 49,
    riskFactors: [
      { factor: 'Inactivity', impact: 45, description: '21 days since last login', trend: 'declining' },
      { factor: 'Feature Usage', impact: 30, description: 'Using only 2 of 12 features', trend: 'declining' },
      { factor: 'Support Tickets', impact: 17, description: '3 unresolved issues', trend: 'stable' },
    ],
    suggestedInterventions: ['email', 'support'],
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@startup.io',
    riskLevel: 'high',
    riskScore: 78,
    daysSinceLastActive: 14,
    subscriptionTier: 'Team',
    monthlyRevenue: 99,
    riskFactors: [
      { factor: 'Declining Usage', impact: 35, description: '60% drop in mockups created', trend: 'declining' },
      { factor: 'Team Inactivity', impact: 28, description: '2 of 5 team members inactive', trend: 'declining' },
      { factor: 'Payment Issue', impact: 15, description: 'Failed payment attempt', trend: 'stable' },
    ],
    suggestedInterventions: ['in-app', 'discount'],
    lastIntervention: { type: 'email', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'sent' },
  },
  {
    id: 'user-3',
    name: 'Marcus Johnson',
    email: 'marcus@agency.co',
    riskLevel: 'high',
    riskScore: 75,
    daysSinceLastActive: 12,
    subscriptionTier: 'Enterprise',
    monthlyRevenue: 299,
    riskFactors: [
      { factor: 'Competitor Research', impact: 40, description: 'Visited competitor pricing page', trend: 'stable' },
      { factor: 'Export Decrease', impact: 25, description: '75% fewer exports this month', trend: 'declining' },
      { factor: 'Contract Renewal', impact: 10, description: 'Contract expires in 30 days', trend: 'stable' },
    ],
    suggestedInterventions: ['support', 'feature'],
  },
  {
    id: 'user-4',
    name: 'Elena Rodriguez',
    email: 'elena@design.studio',
    riskLevel: 'medium',
    riskScore: 55,
    daysSinceLastActive: 8,
    subscriptionTier: 'Pro',
    monthlyRevenue: 49,
    riskFactors: [
      { factor: 'Session Duration', impact: 30, description: 'Avg session 3min (was 15min)', trend: 'declining' },
      { factor: 'Feature Discovery', impact: 25, description: 'Never used templates', trend: 'stable' },
    ],
    suggestedInterventions: ['in-app', 'feature'],
    lastIntervention: { type: 'in-app', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'engaged' },
  },
  {
    id: 'user-5',
    name: 'David Kim',
    email: 'david@tech.corp',
    riskLevel: 'medium',
    riskScore: 48,
    daysSinceLastActive: 5,
    subscriptionTier: 'Team',
    monthlyRevenue: 99,
    riskFactors: [
      { factor: 'Billing Inquiry', impact: 25, description: 'Asked about downgrade options', trend: 'stable' },
      { factor: 'Usage Pattern', impact: 23, description: 'Sporadic usage last 2 weeks', trend: 'improving' },
    ],
    suggestedInterventions: ['email', 'discount'],
  },
  {
    id: 'user-6',
    name: 'Aisha Patel',
    email: 'aisha@creative.co',
    riskLevel: 'low',
    riskScore: 28,
    daysSinceLastActive: 2,
    subscriptionTier: 'Pro',
    monthlyRevenue: 49,
    riskFactors: [
      { factor: 'Slight Decline', impact: 18, description: 'Usage down 15% from last month', trend: 'improving' },
      { factor: 'Feature Adoption', impact: 10, description: 'Not using AI features', trend: 'stable' },
    ],
    suggestedInterventions: ['feature'],
  },
];

const generateMockStats = (): ChurnStats => ({
  atRiskTotal: 1280,
  atRiskRevenue: 89500,
  predictedChurnRate: 4.2,
  actualChurnRate: 3.8,
  preventedChurns: 156,
  savedRevenue: 12400,
  interventionsSent: 890,
  interventionsEngaged: 342,
});

const generateMockModel = (): ChurnPredictionModel => ({
  accuracy: 87.5,
  lastTrainedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  totalPredictions: 15600,
  correctPredictions: 13650,
  falsePositives: 980,
  falseNegatives: 970,
});

const generateMockInterventionStats = (): InterventionStats[] => [
  { type: 'email', sent: 450, engaged: 135, converted: 52, successRate: 11.6 },
  { type: 'in-app', sent: 320, engaged: 186, converted: 78, successRate: 24.4 },
  { type: 'support', sent: 85, engaged: 72, converted: 45, successRate: 52.9 },
  { type: 'discount', sent: 125, engaged: 98, converted: 67, successRate: 53.6 },
  { type: 'feature', sent: 210, engaged: 126, converted: 42, successRate: 20.0 },
];

export function ChurnPrediction({
  atRiskUsers: propUsers,
  stats: propStats,
  model: propModel,
  interventionStats: propInterventionStats,
  variant = 'full',
  onViewUser,
  onSendIntervention,
  onExport,
  className = '',
}: ChurnPredictionProps) {
  const [riskFilter, setRiskFilter] = useState<ChurnRiskLevel | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'interventions' | 'model'>('users');

  const atRiskUsers = propUsers || generateMockAtRiskUsers();
  const stats = propStats || generateMockStats();
  const model = propModel || generateMockModel();
  const interventionStats = propInterventionStats || generateMockInterventionStats();

  const filteredUsers = useMemo(() => {
    return atRiskUsers
      .filter(u => riskFilter === 'all' || u.riskLevel === riskFilter)
      .sort((a, b) => b.riskScore - a.riskScore);
  }, [atRiskUsers, riskFilter]);

  const riskDistribution = useMemo(() => {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    atRiskUsers.forEach(u => distribution[u.riskLevel]++);
    return distribution;
  }, [atRiskUsers]);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Churn Risk</h3>
          </div>
          <span className="text-sm text-gray-500">
            {stats.atRiskTotal}
            {' '}
            at risk
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Predicted Churn</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {stats.predictedChurnRate}
              %
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">At-Risk Revenue</span>
            <span className="font-medium text-red-600">
              $
              {stats.atRiskRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Saved This Month</span>
            <span className="font-medium text-green-600">
              $
              {stats.savedRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // List variant
  if (variant === 'list') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">At-Risk Users</h3>
          </div>
          <span className="text-sm text-gray-500">
            {filteredUsers.length}
            {' '}
            users
          </span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {filteredUsers.slice(0, 5).map(user => (
            <div
              key={user.id}
              className="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => onViewUser?.(user.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-medium text-white">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.subscriptionTier}
                    {' '}
                    • $
                    {user.monthlyRevenue}
                    /mo
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${riskLevelConfig[user.riskLevel].bgColor} ${riskLevelConfig[user.riskLevel].color}`}>
                    {user.riskScore}
                    %
                  </span>
                </div>
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
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Churn Prediction</h3>
              <p className="text-sm text-gray-500">
                Model accuracy:
                {model.accuracy}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-2xl font-bold text-red-600">{stats.atRiskTotal}</p>
            <p className="text-sm text-gray-500">At-Risk Users</p>
            <p className="text-xs text-red-600">
              $
              {stats.atRiskRevenue.toLocaleString()}
              {' '}
              at risk
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-2xl font-bold text-green-600">{stats.preventedChurns}</p>
            <p className="text-sm text-gray-500">Prevented</p>
            <p className="text-xs text-green-600">
              $
              {stats.savedRevenue.toLocaleString()}
              {' '}
              saved
            </p>
          </div>
        </div>

        {/* Risk distribution */}
        <div className="mb-4 flex items-center gap-2">
          {Object.entries(riskDistribution).map(([level, count]) => (
            <div
              key={level}
              className="h-2 flex-1 rounded-full"
              style={{
                backgroundColor: level === 'critical'
                  ? '#EF4444'
                  : level === 'high'
                    ? '#F97316'
                    : level === 'medium' ? '#EAB308' : '#22C55E',
                opacity: count > 0 ? 1 : 0.2,
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Critical:
            {riskDistribution.critical}
          </span>
          <span>
            High:
            {riskDistribution.high}
          </span>
          <span>
            Medium:
            {riskDistribution.medium}
          </span>
          <span>
            Low:
            {riskDistribution.low}
          </span>
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
            <div className="rounded-xl bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Churn Prediction</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Identify and prevent customer churn</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-700"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-5 gap-4">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">At Risk</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.atRiskTotal}</p>
            <p className="text-xs text-gray-500">
              $
              {stats.atRiskRevenue.toLocaleString()}
              {' '}
              MRR
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Predicted</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.predictedChurnRate}
              %
            </p>
            <p className="text-xs text-gray-500">churn rate</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Actual</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.actualChurnRate}
              %
            </p>
            <p className="text-xs text-gray-500">churn rate</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="mb-1 flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Prevented</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.preventedChurns}</p>
            <p className="text-xs text-green-600">
              $
              {stats.savedRevenue.toLocaleString()}
              {' '}
              saved
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Engagement</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {((stats.interventionsEngaged / stats.interventionsSent) * 100).toFixed(1)}
              %
            </p>
            <p className="text-xs text-gray-500">intervention rate</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 p-2">
          {(['users', 'interventions', 'model'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'users' && 'At-Risk Users'}
              {tab === 'interventions' && 'Interventions'}
              {tab === 'model' && 'Model Performance'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'users' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setRiskFilter(level)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      riskFilter === level
                        ? level === 'all'
                          ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                          : `${riskLevelConfig[level].bgColor} ${riskLevelConfig[level].color}`
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {level === 'all' ? 'All' : riskLevelConfig[level].label}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {filteredUsers.length}
                {' '}
                users
              </span>
            </div>

            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                          <span className={`rounded px-2 py-0.5 text-xs font-medium ${riskLevelConfig[user.riskLevel].bgColor} ${riskLevelConfig[user.riskLevel].color}`}>
                            {user.riskScore}
                            % risk
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                          <span>{user.subscriptionTier}</span>
                          <span>•</span>
                          <span>
                            $
                            {user.monthlyRevenue}
                            /mo
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {user.daysSinceLastActive}
                            d inactive
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.suggestedInterventions.slice(0, 2).map(type => (
                        <button
                          key={type}
                          onClick={() => onSendIntervention?.(user.id, type as InterventionType)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-900/20"
                          title={interventionTypeConfig[type as InterventionType].label}
                        >
                          {interventionTypeConfig[type as InterventionType].icon}
                        </button>
                      ))}
                      <button
                        onClick={() => onViewUser?.(user.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Risk factors */}
                  <div className="grid grid-cols-3 gap-3">
                    {user.riskFactors.map((factor, index) => (
                      <div key={index} className="rounded-lg bg-gray-50 p-2 dark:bg-gray-700/50">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{factor.factor}</span>
                          <span className={`text-xs ${
                            factor.trend === 'improving'
                              ? 'text-green-600'
                              : factor.trend === 'declining' ? 'text-red-600' : 'text-gray-500'
                          }`}
                          >
                            {factor.impact}
                            %
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{factor.description}</p>
                      </div>
                    ))}
                  </div>

                  {user.lastIntervention && (
                    <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                      <p className="text-xs text-gray-500">
                        Last intervention:
                        {' '}
                        {interventionTypeConfig[user.lastIntervention.type].label}
                        {' '}
                        •
                        {' '}
                        {new Date(user.lastIntervention.date).toLocaleDateString()}
                        {' '}
                        •
                        <span className={`ml-1 ${
                          user.lastIntervention.status === 'engaged'
                            ? 'text-green-600'
                            : user.lastIntervention.status === 'converted'
                              ? 'text-blue-600'
                              : user.lastIntervention.status === 'churned' ? 'text-red-600' : 'text-gray-500'
                        }`}
                        >
                          {user.lastIntervention.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'interventions' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Intervention Performance</h3>
            <div className="space-y-4">
              {interventionStats.map(stat => (
                <div key={stat.type} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                        {interventionTypeConfig[stat.type].icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {interventionTypeConfig[stat.type].label}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {stat.sent}
                          {' '}
                          sent this month
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {stat.successRate}
                        %
                      </p>
                      <p className="text-xs text-gray-500">success rate</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.sent}</p>
                      <p className="text-xs text-gray-500">Sent</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{stat.engaged}</p>
                      <p className="text-xs text-gray-500">Engaged</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{stat.converted}</p>
                      <p className="text-xs text-gray-500">Converted</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="bg-gray-300 dark:bg-gray-600"
                      style={{ width: `${((stat.sent - stat.engaged) / stat.sent) * 100}%` }}
                    />
                    <div
                      className="bg-blue-400"
                      style={{ width: `${((stat.engaged - stat.converted) / stat.sent) * 100}%` }}
                    />
                    <div
                      className="bg-green-500"
                      style={{ width: `${(stat.converted / stat.sent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'model' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Model Performance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/50">
                <div className="mb-6 text-center">
                  <p className="mb-2 text-5xl font-bold text-green-600">
                    {model.accuracy}
                    %
                  </p>
                  <p className="text-gray-500">Model Accuracy</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Predictions</span>
                    <span className="font-medium text-gray-900 dark:text-white">{model.totalPredictions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Correct Predictions</span>
                    <span className="font-medium text-green-600">{model.correctPredictions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Trained</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.lastTrainedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">False Positives</span>
                    <span className="text-yellow-600">{model.falsePositives}</span>
                  </div>
                  <p className="text-sm text-gray-500">Users predicted to churn who didn&apos;t</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-yellow-400"
                      style={{ width: `${(model.falsePositives / model.totalPredictions) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">False Negatives</span>
                    <span className="text-red-600">{model.falseNegatives}</span>
                  </div>
                  <p className="text-sm text-gray-500">Users who churned but weren&apos;t predicted</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-red-400"
                      style={{ width: `${(model.falseNegatives / model.totalPredictions) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Tip:</strong>
                    {' '}
                    The model uses engagement patterns, feature usage, billing history,
                    and support interactions to predict churn risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChurnPrediction;
