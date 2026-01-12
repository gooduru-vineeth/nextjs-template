'use client';

import {
  Award,
  ChevronRight,
  Clock,
  Crown,
  DollarSign,
  Download,
  Gift,
  Heart,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type RewardType = 'cash' | 'credits' | 'subscription' | 'merchandise' | 'badge' | 'feature';
export type EarningSource = 'template-sales' | 'referrals' | 'competition' | 'content' | 'engagement' | 'milestone';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type CreatorTier = 'starter' | 'rising' | 'established' | 'pro' | 'elite';

export type Earning = {
  id: string;
  source: EarningSource;
  description: string;
  amount: number;
  date: Date;
  status: PayoutStatus;
  referenceId?: string;
};

export type ContentReward = {
  id: string;
  type: RewardType;
  title: string;
  description: string;
  value: number;
  requirement: string;
  progress: number;
  maxProgress: number;
  claimed: boolean;
  expiresAt?: Date;
};

export type CreatorStats = {
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingPayout: number;
  templateSales: number;
  totalDownloads: number;
  totalViews: number;
  avgRating: number;
  followers: number;
  tier: CreatorTier;
  tierProgress: number;
  nextTierAt: number;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  icon: 'star' | 'users' | 'download' | 'dollar' | 'heart' | 'crown';
  requirement: number;
  current: number;
  reward: number;
  rewardType: RewardType;
  achieved: boolean;
  achievedAt?: Date;
};

export type ReferralInfo = {
  code: string;
  link: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  pendingRewards: number;
  conversionRate: number;
};

export type ContentRewardsProps = {
  creatorStats?: CreatorStats;
  earnings?: Earning[];
  rewards?: ContentReward[];
  milestones?: Milestone[];
  referralInfo?: ReferralInfo;
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onClaimReward?: (rewardId: string) => void;
  onRequestPayout?: () => void;
  onShareReferral?: () => void;
};

// Mock data generators
const generateMockCreatorStats = (): CreatorStats => ({
  totalEarnings: 12450,
  thisMonthEarnings: 2340,
  pendingPayout: 890,
  templateSales: 156,
  totalDownloads: 4532,
  totalViews: 28450,
  avgRating: 4.8,
  followers: 1234,
  tier: 'established',
  tierProgress: 75,
  nextTierAt: 20000,
});

const generateMockEarnings = (): Earning[] => [
  {
    id: 'e1',
    source: 'template-sales',
    description: 'Modern Dashboard Pro sold',
    amount: 45,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed',
    referenceId: 'TXN-001',
  },
  {
    id: 'e2',
    source: 'referrals',
    description: 'Referral bonus - John D. upgraded to Pro',
    amount: 25,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed',
    referenceId: 'REF-042',
  },
  {
    id: 'e3',
    source: 'competition',
    description: 'Winter Design Challenge - 2nd Place',
    amount: 500,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'processing',
    referenceId: 'COMP-12',
  },
  {
    id: 'e4',
    source: 'template-sales',
    description: 'E-commerce Template Bundle sold',
    amount: 89,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'completed',
    referenceId: 'TXN-002',
  },
  {
    id: 'e5',
    source: 'milestone',
    description: '1000 Downloads Milestone Bonus',
    amount: 100,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'completed',
    referenceId: 'MILE-05',
  },
  {
    id: 'e6',
    source: 'content',
    description: 'Featured tutorial bonus',
    amount: 50,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'completed',
    referenceId: 'CONT-08',
  },
];

const generateMockRewards = (): ContentReward[] => [
  {
    id: 'r1',
    type: 'credits',
    title: 'Upload 5 Templates',
    description: 'Upload 5 high-quality templates this month',
    value: 50,
    requirement: '5 templates uploaded',
    progress: 3,
    maxProgress: 5,
    claimed: false,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'r2',
    type: 'cash',
    title: 'First Sale Bonus',
    description: 'Make your first template sale',
    value: 25,
    requirement: 'First sale completed',
    progress: 1,
    maxProgress: 1,
    claimed: false,
  },
  {
    id: 'r3',
    type: 'badge',
    title: 'Community Helper',
    description: 'Answer 10 community questions',
    value: 0,
    requirement: '10 helpful answers',
    progress: 7,
    maxProgress: 10,
    claimed: false,
  },
  {
    id: 'r4',
    type: 'feature',
    title: 'Featured Creator',
    description: 'Get featured on the homepage',
    value: 0,
    requirement: 'Reach 500 followers',
    progress: 1234,
    maxProgress: 500,
    claimed: true,
  },
];

const generateMockMilestones = (): Milestone[] => [
  {
    id: 'm1',
    title: 'Rising Star',
    description: 'Reach 100 downloads',
    icon: 'download',
    requirement: 100,
    current: 4532,
    reward: 25,
    rewardType: 'credits',
    achieved: true,
    achievedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm2',
    title: 'Popular Creator',
    description: 'Reach 1000 downloads',
    icon: 'download',
    requirement: 1000,
    current: 4532,
    reward: 100,
    rewardType: 'cash',
    achieved: true,
    achievedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm3',
    title: 'Download Champion',
    description: 'Reach 5000 downloads',
    icon: 'download',
    requirement: 5000,
    current: 4532,
    reward: 250,
    rewardType: 'cash',
    achieved: false,
  },
  {
    id: 'm4',
    title: 'Community Favorite',
    description: 'Reach 500 followers',
    icon: 'users',
    requirement: 500,
    current: 1234,
    reward: 50,
    rewardType: 'credits',
    achieved: true,
    achievedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm5',
    title: 'Influencer',
    description: 'Reach 2000 followers',
    icon: 'users',
    requirement: 2000,
    current: 1234,
    reward: 200,
    rewardType: 'cash',
    achieved: false,
  },
  {
    id: 'm6',
    title: 'Top Earner',
    description: 'Earn $10,000 total',
    icon: 'dollar',
    requirement: 10000,
    current: 12450,
    reward: 500,
    rewardType: 'cash',
    achieved: true,
    achievedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

const generateMockReferralInfo = (): ReferralInfo => ({
  code: 'CREATOR2024',
  link: 'https://mockflow.com/ref/CREATOR2024',
  totalReferrals: 45,
  activeReferrals: 32,
  totalEarned: 1250,
  pendingRewards: 125,
  conversionRate: 28.5,
});

// Helper functions
const getSourceIcon = (source: EarningSource) => {
  const icons: Record<EarningSource, typeof Gift> = {
    'template-sales': ShoppingCart,
    'referrals': Users,
    'competition': Award,
    'content': Star,
    'engagement': Heart,
    'milestone': Target,
  };
  return icons[source];
};

const getSourceColor = (source: EarningSource): string => {
  const colors: Record<EarningSource, string> = {
    'template-sales': 'text-green-500',
    'referrals': 'text-blue-500',
    'competition': 'text-amber-500',
    'content': 'text-purple-500',
    'engagement': 'text-pink-500',
    'milestone': 'text-orange-500',
  };
  return colors[source];
};

const getTierInfo = (tier: CreatorTier): { label: string; color: string; icon: typeof Star } => {
  const tiers: Record<CreatorTier, { label: string; color: string; icon: typeof Star }> = {
    starter: { label: 'Starter', color: 'text-gray-500', icon: Star },
    rising: { label: 'Rising', color: 'text-blue-500', icon: TrendingUp },
    established: { label: 'Established', color: 'text-green-500', icon: Award },
    pro: { label: 'Pro', color: 'text-purple-500', icon: Zap },
    elite: { label: 'Elite', color: 'text-amber-500', icon: Crown },
  };
  return tiers[tier];
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
};

const getMilestoneIcon = (icon: Milestone['icon']) => {
  const icons: Record<Milestone['icon'], typeof Star> = {
    star: Star,
    users: Users,
    download: Download,
    dollar: DollarSign,
    heart: Heart,
    crown: Crown,
  };
  return icons[icon];
};

// Main component
export default function ContentRewards({
  creatorStats = generateMockCreatorStats(),
  earnings = generateMockEarnings(),
  rewards = generateMockRewards(),
  milestones = generateMockMilestones(),
  referralInfo = generateMockReferralInfo(),
  variant = 'full',
  onClaimReward,
  onRequestPayout,
  onShareReferral,
}: ContentRewardsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'rewards' | 'referrals'>('overview');

  const tierInfo = getTierInfo(creatorStats.tier);
  const TierIcon = tierInfo.icon;

  if (variant === 'widget') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Your Earnings</span>
          </div>
          <span className={`flex items-center gap-1 text-xs ${tierInfo.color}`}>
            <TierIcon className="h-3 w-3" />
            {tierInfo.label}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(creatorStats.totalEarnings)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +
            {formatCurrency(creatorStats.thisMonthEarnings)}
            {' '}
            this month
          </p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            {formatCurrency(creatorStats.pendingPayout)}
            {' '}
            pending
          </span>
          <button
            onClick={onRequestPayout}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Request Payout →
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Gift className="h-5 w-5 text-amber-500" />
            Creator Rewards
          </h3>
          <div className={`flex items-center gap-1 text-sm ${tierInfo.color}`}>
            <TierIcon className="h-4 w-4" />
            {tierInfo.label}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Earnings</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(creatorStats.totalEarnings)}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              +
              {formatCurrency(creatorStats.thisMonthEarnings)}
            </p>
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="space-y-2">
          {earnings.slice(0, 3).map((earning) => {
            const SourceIcon = getSourceIcon(earning.source);
            return (
              <div key={earning.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <SourceIcon className={`h-4 w-4 ${getSourceColor(earning.source)}`} />
                  <span className="max-w-[150px] truncate text-sm text-gray-600 dark:text-gray-300">
                    {earning.description}
                  </span>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +
                  {formatCurrency(earning.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    const pendingRewards = rewards.filter(r => !r.claimed && r.progress >= r.maxProgress);

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Gift className="h-5 w-5 text-amber-500" />
            Creator Dashboard
          </h3>
          <div className={`flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800 ${tierInfo.color}`}>
            <TierIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {tierInfo.label}
              {' '}
              Creator
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(creatorStats.totalEarnings)}</p>
            <p className="text-xs text-green-600 dark:text-green-400">
              +
              {formatCurrency(creatorStats.thisMonthEarnings)}
              {' '}
              this month
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="mb-2 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Template Sales</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{creatorStats.templateSales}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {creatorStats.totalDownloads.toLocaleString()}
              {' '}
              downloads
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{creatorStats.followers.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {creatorStats.totalViews.toLocaleString()}
              {' '}
              profile views
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{creatorStats.avgRating}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(creatorStats.avgRating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pending Rewards Alert */}
        {pendingRewards.length > 0 && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-amber-800 dark:text-amber-200">
                  {pendingRewards.length}
                  {' '}
                  reward
                  {pendingRewards.length > 1 ? 's' : ''}
                  {' '}
                  ready to claim!
                </span>
              </div>
              <button
                onClick={() => pendingRewards[0] && onClaimReward?.(pendingRewards[0].id)}
                className="rounded-lg bg-amber-500 px-3 py-1 text-sm text-white hover:bg-amber-600"
              >
                Claim Now
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Recent Earnings</h4>
          <div className="space-y-2">
            {earnings.slice(0, 4).map((earning) => {
              const SourceIcon = getSourceIcon(earning.source);
              return (
                <div
                  key={earning.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-white p-2 dark:bg-gray-700 ${getSourceColor(earning.source)}`}>
                      <SourceIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{earning.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(earning.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +
                    {formatCurrency(earning.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Gift className="h-6 w-6 text-amber-500" />
              Content Rewards
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Earn rewards for creating amazing content
            </p>
          </div>
          <div className="text-right">
            <div className={`flex items-center justify-end gap-2 ${tierInfo.color}`}>
              <TierIcon className="h-5 w-5" />
              <span className="font-semibold">
                {tierInfo.label}
                {' '}
                Creator
              </span>
            </div>
            <div className="mt-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${creatorStats.tierProgress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatCurrency(creatorStats.nextTierAt - creatorStats.totalEarnings)}
                  {' '}
                  to Pro
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['overview', 'earnings', 'rewards', 'referrals'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(creatorStats.totalEarnings)}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  +
                  {formatCurrency(creatorStats.thisMonthEarnings)}
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending Payout</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(creatorStats.pendingPayout)}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{creatorStats.totalDownloads.toLocaleString()}</p>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Target className="h-5 w-5 text-orange-500" />
                Milestones
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {milestones.map((milestone) => {
                  const MilestoneIcon = getMilestoneIcon(milestone.icon);
                  const progress = Math.min((milestone.current / milestone.requirement) * 100, 100);

                  return (
                    <div
                      key={milestone.id}
                      className={`rounded-xl border p-4 ${
                        milestone.achieved
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className={`rounded-lg p-2 ${
                          milestone.achieved
                            ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                        >
                          <MilestoneIcon className="h-5 w-5" />
                        </div>
                        {milestone.achieved && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-800 dark:text-green-300">
                            Achieved
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{milestone.description}</p>

                      <div className="mb-2">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {milestone.current.toLocaleString()}
                            {' '}
                            /
                            {milestone.requirement.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {Math.round(progress)}
                            %
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-2 rounded-full ${
                              milestone.achieved
                                ? 'bg-green-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                          <Gift className="h-4 w-4" />
                          {milestone.rewardType === 'cash'
                            ? formatCurrency(milestone.reward)
                            : `${milestone.reward} credits`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Earnings History</h3>
              <button
                onClick={onRequestPayout}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Request Payout (
                {formatCurrency(creatorStats.pendingPayout)}
                )
              </button>
            </div>

            <div className="space-y-3">
              {earnings.map((earning) => {
                const SourceIcon = getSourceIcon(earning.source);
                return (
                  <div
                    key={earning.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl bg-gray-100 p-3 dark:bg-gray-800 ${getSourceColor(earning.source)}`}>
                        <SourceIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{earning.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{new Date(earning.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{earning.source.replace('-', ' ')}</span>
                          {earning.referenceId && (
                            <>
                              <span>•</span>
                              <span>{earning.referenceId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        +
                        {formatCurrency(earning.amount)}
                      </p>
                      <span className={`rounded px-2 py-0.5 text-xs ${
                        earning.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : earning.status === 'processing'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                      >
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Available Rewards</h3>

            <div className="grid gap-4 md:grid-cols-2">
              {rewards.map((reward) => {
                const isClaimable = reward.progress >= reward.maxProgress && !reward.claimed;
                const progress = Math.min((reward.progress / reward.maxProgress) * 100, 100);

                return (
                  <div
                    key={reward.id}
                    className={`rounded-xl border p-4 ${
                      reward.claimed
                        ? 'border-gray-200 opacity-60 dark:border-gray-700'
                        : isClaimable
                          ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{reward.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{reward.description}</p>
                      </div>
                      {reward.value > 0 && (
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {reward.type === 'cash' ? formatCurrency(reward.value) : `${reward.value} credits`}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">{reward.requirement}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {reward.progress}
                          {' '}
                          /
                          {reward.maxProgress}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-2 rounded-full ${
                            reward.claimed
                              ? 'bg-gray-400'
                              : isClaimable
                                ? 'bg-amber-500'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {reward.expiresAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Expires
                          {' '}
                          {new Date(reward.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                      {isClaimable
                        ? (
                            <button
                              onClick={() => onClaimReward?.(reward.id)}
                              className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                            >
                              <Sparkles className="h-4 w-4" />
                              Claim Reward
                            </button>
                          )
                        : reward.claimed
                          ? (
                              <span className="text-sm text-gray-500 dark:text-gray-400">Claimed</span>
                            )
                          : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                            )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6">
            {/* Referral Link */}
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Your Referral Link</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Earn $25 for each user who upgrades to Pro using your link
              </p>

              <div className="mb-4 flex gap-2">
                <div className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                  <code className="text-sm text-gray-600 dark:text-gray-300">{referralInfo.link}</code>
                </div>
                <button
                  onClick={onShareReferral}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Copy Link
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Code:
                  {' '}
                  <code className="rounded bg-white px-2 py-1 font-mono dark:bg-gray-800">{referralInfo.code}</code>
                </span>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Referrals</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{referralInfo.totalReferrals}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Active Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{referralInfo.activeReferrals}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Earned</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(referralInfo.totalEarned)}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Conversion Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {referralInfo.conversionRate}
                  %
                </p>
              </div>
            </div>

            {/* Pending Rewards */}
            {referralInfo.pendingRewards > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        {formatCurrency(referralInfo.pendingRewards)}
                        {' '}
                        pending referral rewards
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Rewards are paid out monthly
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
