'use client';

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Gift,
  Globe,
  Heart,
  Megaphone,
  MessageSquare,
  Share2,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Twitter,
  Users,
  Youtube,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type AmbassadorTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type AmbassadorStatus = 'pending' | 'active' | 'inactive' | 'alumni';
export type ActivityType = 'content' | 'referral' | 'event' | 'support' | 'feedback' | 'social';

export type Ambassador = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: AmbassadorTier;
  status: AmbassadorStatus;
  joinedAt: Date;
  location: string;
  specialty: string[];
  socialLinks: {
    twitter?: string;
    youtube?: string;
    blog?: string;
    linkedin?: string;
  };
  stats: {
    totalPoints: number;
    monthlyPoints: number;
    referrals: number;
    contentPieces: number;
    eventsHosted: number;
    communityHelps: number;
  };
  rewards: {
    earned: number;
    pending: number;
    redeemed: number;
  };
  badges: Badge[];
  activities: Activity[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  points: number;
  completedAt: Date;
  verified: boolean;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'swag' | 'credit' | 'feature' | 'experience';
  available: boolean;
  stock?: number;
};

export type ProgramStats = {
  totalAmbassadors: number;
  activeAmbassadors: number;
  totalReferrals: number;
  totalContent: number;
  totalEventsHosted: number;
  monthlyGrowth: number;
  totalPointsAwarded: number;
  totalRewardsRedeemed: number;
};

export type AmbassadorProgramProps = {
  ambassadors?: Ambassador[];
  rewards?: Reward[];
  programStats?: ProgramStats;
  variant?: 'full' | 'compact' | 'leaderboard' | 'dashboard';
  onApplyToProgram?: () => void;
  onViewAmbassador?: (ambassadorId: string) => void;
  onRedeemReward?: (rewardId: string) => void;
  currentUserId?: string;
};

// Tier configuration
const tierConfig: Record<AmbassadorTier, { label: string; color: string; minPoints: number; icon: React.ReactNode }> = {
  bronze: { label: 'Bronze', color: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30', minPoints: 0, icon: <Shield className="h-4 w-4" /> },
  silver: { label: 'Silver', color: 'text-slate-500 bg-slate-100 dark:bg-slate-700/50', minPoints: 500, icon: <Shield className="h-4 w-4" /> },
  gold: { label: 'Gold', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30', minPoints: 2000, icon: <Award className="h-4 w-4" /> },
  platinum: { label: 'Platinum', color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30', minPoints: 5000, icon: <Crown className="h-4 w-4" /> },
  diamond: { label: 'Diamond', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30', minPoints: 10000, icon: <Sparkles className="h-4 w-4" /> },
};

const activityConfig: Record<ActivityType, { label: string; icon: React.ReactNode; basePoints: number }> = {
  content: { label: 'Content Creation', icon: <BookOpen className="h-4 w-4" />, basePoints: 100 },
  referral: { label: 'Referral', icon: <Users className="h-4 w-4" />, basePoints: 50 },
  event: { label: 'Event Hosting', icon: <Calendar className="h-4 w-4" />, basePoints: 200 },
  support: { label: 'Community Support', icon: <MessageSquare className="h-4 w-4" />, basePoints: 25 },
  feedback: { label: 'Product Feedback', icon: <Target className="h-4 w-4" />, basePoints: 75 },
  social: { label: 'Social Sharing', icon: <Share2 className="h-4 w-4" />, basePoints: 15 },
};

// Mock data generator
const generateMockAmbassadors = (): Ambassador[] => {
  const names = ['Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Kim', 'Aisha Patel', 'James Wilson', 'Yuki Tanaka', 'Olivia Brown'];
  const specialties = ['UI Design', 'Prototyping', 'Design Systems', 'Mobile Design', 'Web Design', 'UX Research', 'Accessibility', 'Animation'];
  const locations = ['San Francisco, CA', 'New York, NY', 'London, UK', 'Tokyo, Japan', 'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia', 'Singapore'];
  const tiers: AmbassadorTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

  return names.map((name, index) => ({
    id: `amb-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    tier: tiers[index % 5]!,
    status: (index < 7 ? 'active' : 'inactive') as AmbassadorStatus,
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    location: locations[index % locations.length]!,
    specialty: [specialties[index % specialties.length]!, specialties[(index + 3) % specialties.length]!],
    socialLinks: {
      twitter: `https://twitter.com/${name.toLowerCase().replace(' ', '')}`,
      youtube: index % 3 === 0 ? `https://youtube.com/@${name.toLowerCase().replace(' ', '')}` : undefined,
      blog: index % 2 === 0 ? `https://${name.toLowerCase().replace(' ', '')}.design` : undefined,
    },
    stats: {
      totalPoints: 1000 + Math.floor(Math.random() * 9000),
      monthlyPoints: 100 + Math.floor(Math.random() * 500),
      referrals: Math.floor(Math.random() * 50),
      contentPieces: Math.floor(Math.random() * 30),
      eventsHosted: Math.floor(Math.random() * 10),
      communityHelps: Math.floor(Math.random() * 100),
    },
    rewards: {
      earned: 500 + Math.floor(Math.random() * 2000),
      pending: Math.floor(Math.random() * 200),
      redeemed: Math.floor(Math.random() * 1000),
    },
    badges: [
      { id: 'badge-1', name: 'Early Adopter', description: 'Joined the program early', icon: '🌟', earnedAt: new Date(), rarity: 'rare' },
      { id: 'badge-2', name: 'Content Creator', description: 'Created 10+ content pieces', icon: '✍️', earnedAt: new Date(), rarity: 'common' },
    ],
    activities: [
      { id: 'act-1', type: 'content', title: 'Tutorial Published', description: 'Created a mockup tutorial', points: 100, completedAt: new Date(), verified: true },
      { id: 'act-2', type: 'referral', title: 'New User Referred', description: 'Referred a new premium user', points: 50, completedAt: new Date(), verified: true },
    ],
  }));
};

const generateMockRewards = (): Reward[] => [
  { id: 'rew-1', name: 'MockFlow T-Shirt', description: 'Premium cotton t-shirt with logo', pointsCost: 500, category: 'swag', available: true, stock: 50 },
  { id: 'rew-2', name: '$25 Credit', description: 'Account credit for premium features', pointsCost: 1000, category: 'credit', available: true },
  { id: 'rew-3', name: 'Early Access', description: 'Early access to new features', pointsCost: 750, category: 'feature', available: true },
  { id: 'rew-4', name: '1-on-1 Design Review', description: 'Personal design review with our team', pointsCost: 2000, category: 'experience', available: true, stock: 5 },
  { id: 'rew-5', name: 'Conference Ticket', description: 'Ticket to annual design conference', pointsCost: 5000, category: 'experience', available: true, stock: 10 },
  { id: 'rew-6', name: 'Lifetime Pro Account', description: 'Free Pro account forever', pointsCost: 10000, category: 'credit', available: true, stock: 3 },
];

const generateMockStats = (): ProgramStats => ({
  totalAmbassadors: 156,
  activeAmbassadors: 124,
  totalReferrals: 2847,
  totalContent: 892,
  totalEventsHosted: 67,
  monthlyGrowth: 12.5,
  totalPointsAwarded: 487500,
  totalRewardsRedeemed: 234,
});

export function AmbassadorProgram({
  ambassadors: propAmbassadors,
  rewards: propRewards,
  programStats: propStats,
  variant = 'full',
  onApplyToProgram,
  onViewAmbassador,
  onRedeemReward,
}: AmbassadorProgramProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'rewards' | 'activities'>('overview');
  const [tierFilter, setTierFilter] = useState<AmbassadorTier | 'all'>('all');

  const ambassadors = propAmbassadors || generateMockAmbassadors();
  const rewards = propRewards || generateMockRewards();
  const stats = propStats || generateMockStats();

  const filteredAmbassadors = useMemo(() => {
    return ambassadors
      .filter(a => tierFilter === 'all' || a.tier === tierFilter)
      .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);
  }, [ambassadors, tierFilter]);

  const topAmbassadors = useMemo(() => {
    return [...ambassadors]
      .filter(a => a.status === 'active')
      .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints)
      .slice(0, 10);
  }, [ambassadors]);

  // Leaderboard variant
  if (variant === 'leaderboard') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
              <Trophy className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Ambassador Leaderboard</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top performers this month</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {topAmbassadors.slice(0, 5).map((ambassador, index) => (
            <div
              key={ambassador.id}
              className="flex cursor-pointer items-center gap-4 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
              onClick={() => onViewAmbassador?.(ambassador.id)}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                index === 0
                  ? 'bg-yellow-100 text-yellow-700'
                  : index === 1
                    ? 'bg-slate-100 text-slate-700'
                    : index === 2
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
              }`}
              >
                {index + 1}
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 font-medium text-white">
                {ambassador.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">{ambassador.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${tierConfig[ambassador.tier].color}`}>
                    {tierConfig[ambassador.tier].label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{ambassador.stats.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dashboard variant
  if (variant === 'dashboard') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Ambassador Program</h3>
          </div>
          <button
            onClick={onApplyToProgram}
            className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-purple-700"
          >
            Join Program
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAmbassadors}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Ambassadors</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Ambassadors</p>
          {topAmbassadors.slice(0, 3).map((ambassador, index) => (
            <div key={ambassador.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <span className="w-4 text-sm font-medium text-gray-500">{index + 1}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm text-white">
                {ambassador.name.charAt(0)}
              </div>
              <span className="flex-1 truncate text-sm text-gray-900 dark:text-white">{ambassador.name}</span>
              <span className="text-sm text-gray-500">
                {ambassador.stats.totalPoints.toLocaleString()}
                {' '}
                pts
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
            <Award className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Become an Ambassador</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Join our community of design advocates</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-purple-600">{stats.activeAmbassadors}</p>
            <p className="text-xs text-gray-500">Ambassadors</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{stats.totalContent}</p>
            <p className="text-xs text-gray-500">Content Created</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{stats.totalReferrals.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Referrals</p>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Gift className="h-4 w-4 text-purple-500" />
            <span>Earn rewards for creating content</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Get early access to new features</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Join an exclusive community</span>
          </div>
        </div>

        <button
          onClick={onApplyToProgram}
          className="w-full rounded-lg bg-purple-600 py-2.5 font-medium text-white transition-colors hover:bg-purple-700"
        >
          Apply Now
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 dark:bg-purple-900/30">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ambassador Program</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Join our community of design advocates</p>
            </div>
          </div>
          <button
            onClick={onApplyToProgram}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
          >
            <Megaphone className="h-4 w-4" />
            Apply to Program
          </button>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Ambassadors</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAmbassadors}</p>
            <p className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +
              {stats.monthlyGrowth}
              % this month
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Referrals</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total referrals made</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Content</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContent}</p>
            <p className="text-xs text-gray-500">Pieces created</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Rewards</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRewardsRedeemed}</p>
            <p className="text-xs text-gray-500">Redeemed by ambassadors</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-1 p-2">
          {(['overview', 'leaderboard', 'rewards', 'activities'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Program benefits */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Program Benefits</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 w-fit rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                    <Gift className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Exclusive Rewards</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Earn points for swag, credits, and exclusive experiences</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 w-fit rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Early Access</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to try new features before anyone else</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 w-fit rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Global Community</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect with designers and creators worldwide</p>
                </div>
              </div>
            </div>

            {/* Tier system */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Ambassador Tiers</h3>
              <div className="flex gap-2">
                {Object.entries(tierConfig).map(([tier, config]) => (
                  <div key={tier} className={`flex-1 rounded-lg border p-4 ${tierFilter === tier ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                    <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-2 py-1 ${config.color}`}>
                      {config.icon}
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {config.minPoints.toLocaleString()}
                      + points
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to earn points */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">How to Earn Points</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(activityConfig).map(([type, config]) => (
                  <div key={type} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{config.label}</p>
                      <p className="text-xs text-gray-500">
                        {config.basePoints}
                        + points per activity
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Top Ambassadors</h3>
              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value as AmbassadorTier | 'all')}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Tiers</option>
                {Object.entries(tierConfig).map(([tier, config]) => (
                  <option key={tier} value={tier}>{config.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              {filteredAmbassadors.map((ambassador, index) => (
                <div
                  key={ambassador.id}
                  className="flex cursor-pointer items-center gap-4 rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                  onClick={() => onViewAmbassador?.(ambassador.id)}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                    index === 0
                      ? 'bg-yellow-100 text-yellow-700'
                      : index === 1
                        ? 'bg-slate-100 text-slate-700'
                        : index === 2
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  }`}
                  >
                    {index < 3 ? <Trophy className="h-5 w-5" /> : index + 1}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-lg font-semibold text-white">
                    {ambassador.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{ambassador.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${tierConfig[ambassador.tier].color}`}>
                        {tierConfig[ambassador.tier].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {ambassador.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {ambassador.stats.referrals}
                        {' '}
                        referrals
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ambassador.socialLinks.twitter && (
                      <a href={ambassador.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-500" onClick={e => e.stopPropagation()}>
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {ambassador.socialLinks.youtube && (
                      <a href={ambassador.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-red-500" onClick={e => e.stopPropagation()}>
                        <Youtube className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{ambassador.stats.totalPoints.toLocaleString()}</p>
                    <p className="flex items-center justify-end gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +
                      {ambassador.stats.monthlyPoints}
                      {' '}
                      this month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Available Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              {rewards.map(reward => (
                <div key={reward.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-3 flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${
                      reward.category === 'swag'
                        ? 'bg-purple-100 dark:bg-purple-900/30'
                        : reward.category === 'credit'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : reward.category === 'feature'
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}
                    >
                      {reward.category === 'swag' && <Gift className="h-5 w-5 text-purple-600" />}
                      {reward.category === 'credit' && <Star className="h-5 w-5 text-green-600" />}
                      {reward.category === 'feature' && <Zap className="h-5 w-5 text-blue-600" />}
                      {reward.category === 'experience' && <Crown className="h-5 w-5 text-yellow-600" />}
                    </div>
                    {reward.stock && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700">
                        {reward.stock}
                        {' '}
                        left
                      </span>
                    )}
                  </div>
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{reward.name}</h4>
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-600">
                      {reward.pointsCost.toLocaleString()}
                      {' '}
                      pts
                    </span>
                    <button
                      onClick={() => onRedeemReward?.(reward.id)}
                      disabled={!reward.available}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        reward.available
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'cursor-not-allowed bg-gray-200 text-gray-500'
                      }`}
                    >
                      {reward.available ? 'Redeem' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Recent Community Activities</h3>
            <div className="space-y-3">
              {ambassadors.slice(0, 5).flatMap(ambassador =>
                ambassador.activities.map(activity => ({
                  ...activity,
                  ambassadorName: ambassador.name,
                  ambassadorTier: ambassador.tier,
                })),
              ).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 10).map(activity => (
                <div key={activity.id} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                  <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
                    {activityConfig[activity.type].icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      {activity.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by
                      {' '}
                      {activity.ambassadorName}
                      {' '}
                      •
                      {' '}
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">
                      +
                      {activity.points}
                      {' '}
                      pts
                    </p>
                    <p className="flex items-center justify-end gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AmbassadorProgram;
