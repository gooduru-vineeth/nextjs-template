'use client';

import {
  Award,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  Gift,
  Medal,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Trophy,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type CompetitionStatus = 'upcoming' | 'active' | 'voting' | 'completed';
export type CompetitionCategory = 'ui-design' | 'landing-page' | 'dashboard' | 'mobile-app' | 'e-commerce' | 'saas' | 'portfolio' | 'open';
export type PrizeType = 'cash' | 'subscription' | 'merchandise' | 'feature' | 'recognition';

export type Prize = {
  id: string;
  place: number;
  type: PrizeType;
  title: string;
  value: number;
  description: string;
};

export type CompetitionEntry = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  templateId: string;
  templateName: string;
  thumbnailUrl: string;
  submittedAt: Date;
  votes: number;
  views: number;
  rank?: number;
  isWinner: boolean;
};

export type Competition = {
  id: string;
  title: string;
  description: string;
  category: CompetitionCategory;
  status: CompetitionStatus;
  theme: string;
  bannerUrl: string;
  startDate: Date;
  endDate: Date;
  votingEndDate: Date;
  prizes: Prize[];
  entries: CompetitionEntry[];
  totalEntries: number;
  totalVotes: number;
  rules: string[];
  judges: { id: string; name: string; role: string; avatar: string }[];
  sponsored: boolean;
  sponsorName?: string;
  sponsorLogo?: string;
};

export type CompetitionStats = {
  totalCompetitions: number;
  activeCompetitions: number;
  totalParticipants: number;
  totalPrizesAwarded: number;
  avgEntriesPerCompetition: number;
};

export type TemplateCompetitionsProps = {
  competitions?: Competition[];
  stats?: CompetitionStats;
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onEnterCompetition?: (competitionId: string) => void;
  onVote?: (entryId: string) => void;
  onViewEntry?: (entryId: string) => void;
};

// Mock data generator
const generateMockCompetitions = (): Competition[] => {
  const userNames1 = ['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'Alex Kim', 'Jordan Lee', 'Taylor Swift', 'Chris Martin', 'Lisa Park'];
  const templateNames1 = ['Frosty Landing', 'Snow Peak', 'Ice Crystal', 'Winter Dreams', 'Arctic Glow', 'Snowfall', 'Frozen Beauty', 'Cozy Winter'];
  const userNames2 = ['James Wilson', 'Nina Patel', 'Robert Chang', 'Maria Garcia', 'Tom Anderson', 'Sophie Brown'];
  const templateNames2 = ['DataFlow Pro', 'Analytics Hub', 'Insight Master', 'Metrics View', 'Chart Central', 'Stats Dashboard'];
  const userNames4 = ['Winner One', 'Runner Up', 'Third Place'];
  const templateNames4 = ['ShopLux', 'CartMaster', 'BuyNow Pro'];
  const votes4 = [1250, 980, 756];
  const views4 = [5200, 4100, 3200];

  return [
    {
      id: 'comp-1',
      title: 'Winter Design Challenge 2024',
      description: 'Create stunning winter-themed landing pages that capture the magic of the season.',
      category: 'landing-page',
      status: 'active',
      theme: 'Winter Wonderland',
      bannerUrl: '/competitions/winter-2024.jpg',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      votingEndDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      prizes: [
        { id: 'p1', place: 1, type: 'cash', title: 'Grand Prize', value: 5000, description: '$5,000 cash prize' },
        { id: 'p2', place: 2, type: 'cash', title: 'Runner Up', value: 2500, description: '$2,500 cash prize' },
        { id: 'p3', place: 3, type: 'subscription', title: 'Third Place', value: 500, description: '1 year Pro subscription' },
      ],
      entries: Array.from({ length: 8 }, (_, i) => ({
        id: `entry-1-${i}`,
        userId: `user-${i}`,
        userName: userNames1[i] || `User ${i}`,
        userAvatar: `/avatars/user-${i}.jpg`,
        templateId: `template-${i}`,
        templateName: templateNames1[i] || `Template ${i}`,
        thumbnailUrl: `/entries/entry-${i}.jpg`,
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        votes: Math.floor(Math.random() * 500) + 50,
        views: Math.floor(Math.random() * 2000) + 200,
        rank: i + 1,
        isWinner: false,
      })),
      totalEntries: 156,
      totalVotes: 4832,
      rules: [
        'Original designs only - no templates or AI-generated content',
        'Must include winter/holiday theme elements',
        'Responsive design required',
        'Maximum 3 entries per participant',
      ],
      judges: [
        { id: 'j1', name: 'Amanda Rivers', role: 'Design Director', avatar: '/judges/amanda.jpg' },
        { id: 'j2', name: 'David Park', role: 'UX Lead', avatar: '/judges/david.jpg' },
      ],
      sponsored: true,
      sponsorName: 'DesignCo',
      sponsorLogo: '/sponsors/designco.png',
    },
    {
      id: 'comp-2',
      title: 'Dashboard Masters',
      description: 'Design the most intuitive and beautiful analytics dashboard.',
      category: 'dashboard',
      status: 'voting',
      theme: 'Data Visualization',
      bannerUrl: '/competitions/dashboard-masters.jpg',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      votingEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      prizes: [
        { id: 'p4', place: 1, type: 'cash', title: 'Grand Prize', value: 3000, description: '$3,000 cash prize' },
        { id: 'p5', place: 2, type: 'subscription', title: 'Runner Up', value: 1000, description: '2 years Pro subscription' },
      ],
      entries: Array.from({ length: 6 }, (_, i) => ({
        id: `entry-2-${i}`,
        userId: `user-${i + 10}`,
        userName: userNames2[i] || `User ${i + 10}`,
        userAvatar: `/avatars/user-${i + 10}.jpg`,
        templateId: `template-${i + 10}`,
        templateName: templateNames2[i] || `Template ${i + 10}`,
        thumbnailUrl: `/entries/entry-${i + 10}.jpg`,
        submittedAt: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000),
        votes: Math.floor(Math.random() * 800) + 100,
        views: Math.floor(Math.random() * 3000) + 500,
        rank: i + 1,
        isWinner: false,
      })),
      totalEntries: 89,
      totalVotes: 3421,
      rules: [
        'Must be a functional dashboard design',
        'Include at least 5 different chart types',
        'Dark mode support required',
      ],
      judges: [
        { id: 'j3', name: 'Kevin Zhang', role: 'Product Designer', avatar: '/judges/kevin.jpg' },
      ],
      sponsored: false,
    },
    {
      id: 'comp-3',
      title: 'Mobile App UI Challenge',
      description: 'Design innovative mobile app interfaces for the next generation.',
      category: 'mobile-app',
      status: 'upcoming',
      theme: 'Future of Mobile',
      bannerUrl: '/competitions/mobile-ui.jpg',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      votingEndDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      prizes: [
        { id: 'p6', place: 1, type: 'cash', title: 'Grand Prize', value: 10000, description: '$10,000 cash prize' },
        { id: 'p7', place: 2, type: 'cash', title: 'Runner Up', value: 5000, description: '$5,000 cash prize' },
        { id: 'p8', place: 3, type: 'cash', title: 'Third Place', value: 2500, description: '$2,500 cash prize' },
      ],
      entries: [],
      totalEntries: 0,
      totalVotes: 0,
      rules: [
        'iOS or Android design guidelines must be followed',
        'Include at least 5 screens',
        'Prototype animations encouraged',
      ],
      judges: [
        { id: 'j4', name: 'Lisa Chen', role: 'Mobile Lead at TechCorp', avatar: '/judges/lisa.jpg' },
        { id: 'j5', name: 'Mark Stevens', role: 'App Designer', avatar: '/judges/mark.jpg' },
      ],
      sponsored: true,
      sponsorName: 'MobileFirst Inc',
      sponsorLogo: '/sponsors/mobilefirst.png',
    },
    {
      id: 'comp-4',
      title: 'E-Commerce Excellence',
      description: 'Create the ultimate online shopping experience.',
      category: 'e-commerce',
      status: 'completed',
      theme: 'Shop of the Future',
      bannerUrl: '/competitions/ecommerce.jpg',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      votingEndDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      prizes: [
        { id: 'p9', place: 1, type: 'cash', title: 'Grand Prize', value: 7500, description: '$7,500 cash prize' },
        { id: 'p10', place: 2, type: 'cash', title: 'Runner Up', value: 3000, description: '$3,000 cash prize' },
      ],
      entries: Array.from({ length: 3 }, (_, i) => ({
        id: `entry-4-${i}`,
        userId: `user-${i + 20}`,
        userName: userNames4[i] || `User ${i + 20}`,
        userAvatar: `/avatars/user-${i + 20}.jpg`,
        templateId: `template-${i + 20}`,
        templateName: templateNames4[i] || `Template ${i + 20}`,
        thumbnailUrl: `/entries/entry-${i + 20}.jpg`,
        submittedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        votes: votes4[i] ?? 0,
        views: views4[i] ?? 0,
        rank: i + 1,
        isWinner: i === 0,
      })),
      totalEntries: 203,
      totalVotes: 8932,
      rules: [
        'Full e-commerce flow required',
        'Mobile-responsive design',
        'Checkout process must be included',
      ],
      judges: [
        { id: 'j6', name: 'Rachel Kim', role: 'E-commerce Expert', avatar: '/judges/rachel.jpg' },
      ],
      sponsored: true,
      sponsorName: 'ShopifyPlus',
      sponsorLogo: '/sponsors/shopify.png',
    },
  ];
};

const generateMockStats = (): CompetitionStats => ({
  totalCompetitions: 47,
  activeCompetitions: 3,
  totalParticipants: 12450,
  totalPrizesAwarded: 125000,
  avgEntriesPerCompetition: 145,
});

// Helper functions
const getStatusColor = (status: CompetitionStatus): string => {
  const colors: Record<CompetitionStatus, string> = {
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    voting: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };
  return colors[status];
};

const getStatusIcon = (status: CompetitionStatus) => {
  const icons: Record<CompetitionStatus, typeof Trophy> = {
    upcoming: Calendar,
    active: Flame,
    voting: ThumbsUp,
    completed: Trophy,
  };
  return icons[status];
};

const getCategoryLabel = (category: CompetitionCategory): string => {
  const labels: Record<CompetitionCategory, string> = {
    'ui-design': 'UI Design',
    'landing-page': 'Landing Page',
    'dashboard': 'Dashboard',
    'mobile-app': 'Mobile App',
    'e-commerce': 'E-Commerce',
    'saas': 'SaaS',
    'portfolio': 'Portfolio',
    'open': 'Open Category',
  };
  return labels[category];
};

const formatTimeRemaining = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) {
    return 'Ended';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }
  if (hours > 0) {
    return `${hours}h remaining`;
  }
  return 'Ending soon';
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
};

// Main component
export default function TemplateCompetitions({
  competitions = generateMockCompetitions(),
  stats = generateMockStats(),
  variant = 'full',
  onEnterCompetition,
  onVote: _onVote,
  onViewEntry,
}: TemplateCompetitionsProps) {
  void _onVote; // Reserved for future voting UI
  const [selectedStatus, setSelectedStatus] = useState<CompetitionStatus | 'all'>('all');
  // State for future competition detail view
  const [_selectedCompetition, _setSelectedCompetition] = useState<Competition | null>(null);
  void _selectedCompetition;

  const filteredCompetitions = selectedStatus === 'all'
    ? competitions
    : competitions.filter(c => c.status === selectedStatus);

  if (variant === 'widget') {
    const activeCompetition = competitions.find(c => c.status === 'active');

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Active Competition</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Flame className="h-3 w-3" />
            Live
          </span>
        </div>

        {activeCompetition
          ? (
              <div>
                <h4 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                  {activeCompetition.title}
                </h4>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  {activeCompetition.totalEntries}
                  {' '}
                  entries •
                  {formatTimeRemaining(activeCompetition.endDate)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Gift className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {formatCurrency(activeCompetition.prizes[0]?.value || 0)}
                      {' '}
                      prize
                    </span>
                  </div>
                  <button
                    onClick={() => onEnterCompetition?.(activeCompetition.id)}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Enter Now →
                  </button>
                </div>
              </div>
            )
          : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No active competitions</p>
            )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Trophy className="h-5 w-5 text-amber-500" />
            Competitions
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {stats.activeCompetitions}
            {' '}
            active
          </span>
        </div>

        <div className="space-y-3">
          {competitions.slice(0, 3).map((comp) => {
            const StatusIcon = getStatusIcon(comp.status);
            return (
              <div
                key={comp.id}
                className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => _setSelectedCompetition(comp)}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${getStatusColor(comp.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{comp.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {comp.totalEntries}
                      {' '}
                      entries •
                      {getCategoryLabel(comp.category)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Trophy className="h-5 w-5 text-amber-500" />
            Competition Stats
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Competitions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCompetitions}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Active Now</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeCompetitions}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Total Participants</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalParticipants.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <Gift className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Prizes Awarded</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalPrizesAwarded)}</p>
          </div>
        </div>

        {/* Active Competitions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Competitions</h4>
          {competitions.filter(c => c.status === 'active' || c.status === 'voting').map(comp => (
            <div
              key={comp.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(comp.status)}`}>
                  {comp.status.charAt(0).toUpperCase() + comp.status.slice(1)}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{comp.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comp.totalEntries}
                    {' '}
                    entries •
                    {formatTimeRemaining(comp.status === 'voting' ? comp.votingEndDate : comp.endDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onEnterCompetition?.(comp.id)}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                {comp.status === 'voting' ? 'Vote' : 'Enter'}
              </button>
            </div>
          ))}
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
              <Trophy className="h-6 w-6 text-amber-500" />
              Template Competitions
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Compete with designers worldwide and win amazing prizes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(stats.totalPrizesAwarded)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total prizes awarded</p>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'active', 'voting', 'upcoming', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Competition Cards */}
      <div className="p-6">
        <div className="grid gap-6">
          {filteredCompetitions.map((comp) => {
            const StatusIcon = getStatusIcon(comp.status);
            const totalPrizeValue = comp.prizes.reduce((sum, p) => sum + p.value, 0);

            return (
              <div
                key={comp.id}
                className="overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
              >
                {/* Banner */}
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                  {comp.sponsored && (
                    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-2 py-1 dark:bg-gray-900/90">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Sponsored by
                        {' '}
                        {comp.sponsorName}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(comp.status)}`}>
                      <StatusIcon className="h-3 w-3" />
                      {comp.status.charAt(0).toUpperCase() + comp.status.slice(1)}
                    </span>
                  </div>
                  <div className="absolute right-3 bottom-3 left-3">
                    <h3 className="text-xl font-bold text-white">{comp.title}</h3>
                    <p className="text-sm text-white/80">{comp.theme}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{comp.description}</p>

                  {/* Stats Row */}
                  <div className="mb-4 flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>
                        {comp.totalEntries}
                        {' '}
                        entries
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <ThumbsUp className="h-4 w-4" />
                      <span>
                        {comp.totalVotes.toLocaleString()}
                        {' '}
                        votes
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeRemaining(comp.status === 'voting' ? comp.votingEndDate : comp.endDate)}</span>
                    </div>
                    <span className={`rounded px-2 py-0.5 text-xs ${
                      comp.category === 'ui-design'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : comp.category === 'dashboard'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                    >
                      {getCategoryLabel(comp.category)}
                    </span>
                  </div>

                  {/* Prizes */}
                  <div className="mb-4">
                    <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Gift className="h-4 w-4 text-amber-500" />
                      Prizes (
                      {formatCurrency(totalPrizeValue)}
                      {' '}
                      total)
                    </h4>
                    <div className="flex gap-2">
                      {comp.prizes.slice(0, 3).map((prize, i) => {
                        const icons = [Trophy, Medal, Award];
                        const colors = ['text-amber-500', 'text-gray-400', 'text-orange-600'];
                        const Icon = icons[i] || Award;
                        return (
                          <div
                            key={prize.id}
                            className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800"
                          >
                            <Icon className={`h-4 w-4 ${colors[i]}`} />
                            <div>
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{prize.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(prize.value)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Entries (for active/voting) */}
                  {(comp.status === 'active' || comp.status === 'voting') && comp.entries.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {comp.status === 'voting' ? 'Top Entries' : 'Recent Entries'}
                      </h4>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {comp.entries.slice(0, 4).map((entry, i) => (
                          <div
                            key={entry.id}
                            onClick={() => onViewEntry?.(entry.id)}
                            className="group w-32 flex-shrink-0 cursor-pointer"
                          >
                            <div className="relative mb-1 h-20 overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 ring-blue-500 group-hover:ring-2 dark:from-gray-700 dark:to-gray-600">
                              {comp.status === 'voting' && (
                                <div className="absolute top-1 left-1 rounded bg-amber-500 px-1.5 py-0.5 text-xs font-medium text-white">
                                  #
                                  {i + 1}
                                </div>
                              )}
                              <div className="absolute right-1 bottom-1 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
                                <Star className="h-3 w-3" />
                                {entry.votes}
                              </div>
                            </div>
                            <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                              {entry.templateName}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                              by
                              {' '}
                              {entry.userName}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Winners (for completed) */}
                  {comp.status === 'completed' && (
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Winners
                      </h4>
                      <div className="flex gap-3">
                        {comp.entries.slice(0, 3).map((entry, i) => (
                          <div key={entry.id} className="flex items-center gap-2">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              i === 0
                                ? 'bg-amber-100 text-amber-600'
                                : i === 1
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-orange-100 text-orange-600'
                            }`}
                            >
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.userName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {entry.votes}
                                {' '}
                                votes
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Judges */}
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Judges:</span>
                      <div className="flex -space-x-2">
                        {comp.judges.map(judge => (
                          <div
                            key={judge.id}
                            className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 dark:border-gray-900"
                            title={`${judge.name} - ${judge.role}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    {comp.status === 'active' && (
                      <button
                        onClick={() => onEnterCompetition?.(comp.id)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <Target className="h-4 w-4" />
                        Enter Competition
                      </button>
                    )}
                    {comp.status === 'voting' && (
                      <button
                        onClick={() => onEnterCompetition?.(comp.id)}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Vote Now
                      </button>
                    )}
                    {comp.status === 'upcoming' && (
                      <button
                        onClick={() => onEnterCompetition?.(comp.id)}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Calendar className="h-4 w-4" />
                        Remind Me
                      </button>
                    )}
                    {comp.status === 'completed' && comp.entries[0] && (
                      <button
                        onClick={() => onViewEntry?.(comp.entries[0]!.id)}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                        View Winners
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
