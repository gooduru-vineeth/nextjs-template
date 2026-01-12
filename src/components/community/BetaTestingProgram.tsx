'use client';

import {
  Activity,
  Bug,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FlaskConical,
  Lightbulb,
  MessageSquare,
  Search,
  Star,
  Trophy,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type BetaTesterStatus = 'pending' | 'active' | 'inactive' | 'graduated';
export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'general';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export type BetaTester = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: BetaTesterStatus;
  joinedAt: Date;
  lastActiveAt: Date;
  feedbackCount: number;
  bugsReported: number;
  featuresRequested: number;
  engagementScore: number;
  tier: 'standard' | 'power' | 'vip';
  featuresAccess: string[];
  notes?: string;
};

export type BetaFeedback = {
  id: string;
  testerId: string;
  testerName: string;
  type: FeedbackType;
  priority: FeedbackPriority;
  title: string;
  description: string;
  createdAt: Date;
  status: 'new' | 'reviewed' | 'in-progress' | 'resolved' | 'declined';
  feature?: string;
  upvotes: number;
  comments: number;
};

export type BetaFeature = {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'testing' | 'released';
  releaseDate?: Date;
  testersWithAccess: number;
  feedbackCount: number;
};

export type BetaProgramStats = {
  totalTesters: number;
  activeTesters: number;
  pendingApplications: number;
  totalFeedback: number;
  unresolvedBugs: number;
  featuresInTesting: number;
  averageEngagement: number;
};

export type BetaTestingProgramProps = {
  variant?: 'full' | 'dashboard' | 'widget';
  testers?: BetaTester[];
  feedback?: BetaFeedback[];
  features?: BetaFeature[];
  stats?: BetaProgramStats;
  onInviteTester?: (email: string) => void;
  onUpdateTester?: (tester: BetaTester) => void;
  onRemoveTester?: (testerId: string) => void;
  onResolveFeedback?: (feedbackId: string) => void;
  onExport?: (type: 'testers' | 'feedback') => void;
  className?: string;
};

// Mock data generators
const generateMockTesters = (): BetaTester[] => {
  const now = new Date();
  const names = [
    'Alice Johnson',
    'Bob Smith',
    'Carol Williams',
    'David Brown',
    'Emma Davis',
    'Frank Miller',
    'Grace Wilson',
    'Henry Taylor',
    'Ivy Anderson',
    'Jack Thomas',
  ];

  return names.map((name, index) => ({
    id: `tester-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    status: (['active', 'active', 'active', 'pending', 'inactive'] as BetaTesterStatus[])[index % 5]!,
    joinedAt: new Date(now.getTime() - (30 - index * 3) * 24 * 60 * 60 * 1000),
    lastActiveAt: new Date(now.getTime() - index * 2 * 24 * 60 * 60 * 1000),
    feedbackCount: Math.floor(Math.random() * 20) + 5,
    bugsReported: Math.floor(Math.random() * 10),
    featuresRequested: Math.floor(Math.random() * 8),
    engagementScore: Math.floor(Math.random() * 40) + 60,
    tier: (['vip', 'power', 'standard', 'standard', 'power'] as const)[index % 5]!,
    featuresAccess: ['new-editor', 'ai-features', 'collaboration'].slice(0, (index % 3) + 1),
  }));
};

const generateMockFeedback = (): BetaFeedback[] => {
  const now = new Date();
  const feedbackItems = [
    { type: 'bug', priority: 'high', title: 'Export crashes on large mockups', feature: 'Export' },
    { type: 'feature', priority: 'medium', title: 'Add dark mode for editor', feature: 'Editor' },
    { type: 'improvement', priority: 'low', title: 'Faster loading times', feature: 'Performance' },
    { type: 'bug', priority: 'critical', title: 'Login fails on Safari', feature: 'Auth' },
    { type: 'feature', priority: 'high', title: 'Team collaboration tools', feature: 'Collaboration' },
    { type: 'general', priority: 'low', title: 'Great onboarding experience!', feature: undefined },
    { type: 'improvement', priority: 'medium', title: 'Better keyboard shortcuts', feature: 'Editor' },
    { type: 'bug', priority: 'medium', title: 'Avatar upload issues', feature: 'Profile' },
  ];

  return feedbackItems.map((item, index) => ({
    id: `feedback-${index + 1}`,
    testerId: `tester-${(index % 5) + 1}`,
    testerName: ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis'][index % 5]!,
    type: item.type as FeedbackType,
    priority: item.priority as FeedbackPriority,
    title: item.title,
    description: `Detailed description of ${item.title.toLowerCase()}...`,
    createdAt: new Date(now.getTime() - index * 3 * 24 * 60 * 60 * 1000),
    status: (['new', 'reviewed', 'in-progress', 'resolved', 'new'] as const)[index % 5]!,
    feature: item.feature,
    upvotes: Math.floor(Math.random() * 15) + 1,
    comments: Math.floor(Math.random() * 8),
  }));
};

const generateMockFeatures = (): BetaFeature[] => {
  return [
    {
      id: 'feature-1',
      name: 'AI Content Generator',
      description: 'Generate mockup content using AI',
      status: 'testing',
      testersWithAccess: 25,
      feedbackCount: 18,
    },
    {
      id: 'feature-2',
      name: 'Real-time Collaboration',
      description: 'Work together with team members in real-time',
      status: 'development',
      testersWithAccess: 10,
      feedbackCount: 12,
    },
    {
      id: 'feature-3',
      name: 'Advanced Export Options',
      description: 'Export to more formats with better quality',
      status: 'testing',
      releaseDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      testersWithAccess: 50,
      feedbackCount: 34,
    },
    {
      id: 'feature-4',
      name: 'Template Marketplace',
      description: 'Buy and sell custom templates',
      status: 'planning',
      testersWithAccess: 0,
      feedbackCount: 8,
    },
  ];
};

// Helper components
const StatusBadge: React.FC<{ status: BetaTesterStatus }> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    graduated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: FeedbackPriority }> = ({ priority }) => {
  const styles = {
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const TypeIcon: React.FC<{ type: FeedbackType; className?: string }> = ({ type, className = 'w-4 h-4' }) => {
  const icons = {
    bug: <Bug className={className} />,
    feature: <Lightbulb className={className} />,
    improvement: <Star className={className} />,
    general: <MessageSquare className={className} />,
  };
  return icons[type];
};

const TierBadge: React.FC<{ tier: BetaTester['tier'] }> = ({ tier }) => {
  const styles = {
    standard: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    power: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    vip: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  const icons = {
    standard: null,
    power: <Star className="h-3 w-3" />,
    vip: <Trophy className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium uppercase ${styles[tier]}`}>
      {icons[tier]}
      {tier}
    </span>
  );
};

// Tester card component
export const TesterCard: React.FC<{
  tester: BetaTester;
  onView?: () => void;
  onRemove?: () => void;
}> = ({ tester, onView, onRemove }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
            {tester.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">{tester.name}</span>
              <TierBadge tier={tester.tier} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{tester.email}</div>
          </div>
        </div>
        <StatusBadge status={tester.status} />
      </div>

      <div className="mb-3 grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Feedback</div>
          <div className="font-semibold text-gray-900 dark:text-white">{tester.feedbackCount}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Bugs</div>
          <div className="font-semibold text-gray-900 dark:text-white">{tester.bugsReported}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Engagement</div>
          <div className={`font-semibold ${tester.engagementScore >= 80 ? 'text-green-600' : tester.engagementScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {tester.engagementScore}
            %
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Joined
          {' '}
          {tester.joinedAt.toLocaleDateString()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="rounded p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <UserMinus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Feedback item component
export const FeedbackItem: React.FC<{
  feedback: BetaFeedback;
  onResolve?: () => void;
}> = ({ feedback, onResolve }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`rounded p-1.5 ${
            feedback.type === 'bug'
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : feedback.type === 'feature'
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                : feedback.type === 'improvement'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}
          >
            <TypeIcon type={feedback.type} />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{feedback.title}</span>
        </div>
        <PriorityBadge priority={feedback.priority} />
      </div>

      <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{feedback.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{feedback.testerName}</span>
          {feedback.feature && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
              {feedback.feature}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {feedback.upvotes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {feedback.comments}
          </span>
        </div>
        {feedback.status !== 'resolved' && onResolve && (
          <button
            onClick={onResolve}
            className="flex items-center gap-1 rounded bg-green-100 px-3 py-1 text-sm text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
          >
            <CheckCircle className="h-4 w-4" />
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

// Main component
export const BetaTestingProgram: React.FC<BetaTestingProgramProps> = ({
  variant = 'full',
  testers: propTesters,
  feedback: propFeedback,
  features: propFeatures,
  stats: propStats,
  onInviteTester,
  onUpdateTester: _onUpdateTester,
  onRemoveTester,
  onResolveFeedback,
  onExport,
  className = '',
}) => {
  const [testers] = useState<BetaTester[]>(() => propTesters || generateMockTesters());
  const [feedback] = useState<BetaFeedback[]>(() => propFeedback || generateMockFeedback());
  const [features] = useState<BetaFeature[]>(() => propFeatures || generateMockFeatures());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BetaTesterStatus | 'all'>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'testers' | 'feedback' | 'features'>('testers');
  const [inviteEmail, setInviteEmail] = useState('');

  const stats = useMemo(() => propStats || {
    totalTesters: testers.length,
    activeTesters: testers.filter(t => t.status === 'active').length,
    pendingApplications: testers.filter(t => t.status === 'pending').length,
    totalFeedback: feedback.length,
    unresolvedBugs: feedback.filter(f => f.type === 'bug' && f.status !== 'resolved').length,
    featuresInTesting: features.filter(f => f.status === 'testing').length,
    averageEngagement: Math.round(testers.reduce((sum, t) => sum + t.engagementScore, 0) / testers.length),
  }, [testers, feedback, features, propStats]);

  const filteredTesters = useMemo(() => {
    return testers.filter((tester) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!tester.name.toLowerCase().includes(query) && !tester.email.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (statusFilter !== 'all' && tester.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [testers, searchQuery, statusFilter]);

  const filteredFeedback = useMemo(() => {
    return feedback.filter((f) => {
      if (feedbackFilter !== 'all' && f.type !== feedbackFilter) {
        return false;
      }
      return true;
    });
  }, [feedback, feedbackFilter]);

  const handleInvite = () => {
    if (inviteEmail && onInviteTester) {
      onInviteTester(inviteEmail);
      setInviteEmail('');
    }
  };

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <FlaskConical className="h-5 w-5" />
            Beta Program
          </h3>
          <span className="text-sm text-gray-500">
            {stats.activeTesters}
            {' '}
            active
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Pending Applications</span>
            <span className="font-semibold text-yellow-600">{stats.pendingApplications}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Unresolved Bugs</span>
            <span className="font-semibold text-red-600">{stats.unresolvedBugs}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Avg. Engagement</span>
            <span className="font-semibold text-green-600">
              {stats.averageEngagement}
              %
            </span>
          </div>
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
            Beta Testing Program
          </h2>
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTesters}</div>
            <div className="text-sm text-gray-500">Active Testers</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-red-600">{stats.unresolvedBugs}</div>
            <div className="text-sm text-gray-500">Unresolved Bugs</div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-purple-600">{stats.featuresInTesting}</div>
            <div className="text-sm text-gray-500">Features Testing</div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testers.slice(0, 4).map(tester => (
            <TesterCard key={tester.id} tester={tester} />
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
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 text-white">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Beta Testing Program</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage beta testers and collect feedback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onExport && (
              <button
                onClick={() => onExport('testers')}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-xs">Total</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalTesters}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Active</span>
            </div>
            <div className="text-xl font-bold text-green-600">{stats.activeTesters}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Pending</span>
            </div>
            <div className="text-xl font-bold text-yellow-600">{stats.pendingApplications}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Feedback</span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalFeedback}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Bug className="h-4 w-4" />
              <span className="text-xs">Bugs</span>
            </div>
            <div className="text-xl font-bold text-red-600">{stats.unresolvedBugs}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <FlaskConical className="h-4 w-4" />
              <span className="text-xs">Testing</span>
            </div>
            <div className="text-xl font-bold text-purple-600">{stats.featuresInTesting}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Star className="h-4 w-4" />
              <span className="text-xs">Engagement</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {stats.averageEngagement}
              %
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {(['testers', 'feedback', 'features'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Testers tab */}
        {activeTab === 'testers' && (
          <div>
            {/* Invite and search */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex min-w-[300px] flex-1 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search testers..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as BetaTesterStatus | 'all')}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {onInviteTester && (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email to invite..."
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
                  />
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </button>
                </div>
              )}
            </div>

            {/* Testers grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTesters.map(tester => (
                <TesterCard
                  key={tester.id}
                  tester={tester}
                  onRemove={() => onRemoveTester?.(tester.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Feedback tab */}
        {activeTab === 'feedback' && (
          <div>
            <div className="mb-6 flex gap-2">
              {(['all', 'bug', 'feature', 'improvement', 'general'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFeedbackFilter(type)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    feedbackFilter === type
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredFeedback.map(item => (
                <FeedbackItem
                  key={item.id}
                  feedback={item}
                  onResolve={() => onResolveFeedback?.(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features tab */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map(feature => (
              <div
                key={feature.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
                    feature.status === 'released'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : feature.status === 'testing'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : feature.status === 'development'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                  >
                    {feature.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {feature.testersWithAccess}
                    {' '}
                    testers
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {feature.feedbackCount}
                    {' '}
                    feedback
                  </span>
                  {feature.releaseDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {feature.releaseDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BetaTestingProgram;
