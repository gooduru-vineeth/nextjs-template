'use client';

import {
  BadgeCheck,
  Briefcase,
  Calendar,
  Crown,
  Dribbble,
  Eye,
  Flame,
  Github,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Search,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Twitter,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// Types
export type SocialLinks = {
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  dribbble?: string;
  instagram?: string;
};

export type UserStats = {
  mockups: number;
  likes: number;
  views: number;
  downloads: number;
  followers: number;
  following: number;
};

export type UserBadge = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
};

export type ShowcaseUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  company?: string;
  role?: string;
  joinedAt: Date;
  verified: boolean;
  pro: boolean;
  stats: UserStats;
  badges: UserBadge[];
  socialLinks: SocialLinks;
  specialties: string[];
  isFollowing?: boolean;
  rank?: number;
};

export type ShowcaseMockup = {
  id: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
};

export type UserShowcaseProps = {
  variant?: 'full' | 'card' | 'list' | 'leaderboard';
  users?: ShowcaseUser[];
  featuredUser?: ShowcaseUser;
  userMockups?: ShowcaseMockup[];
  onUserClick?: (user: ShowcaseUser) => void;
  onFollow?: (userId: string) => void;
  onMessage?: (userId: string) => void;
  onShare?: (user: ShowcaseUser) => void;
  className?: string;
};

// Mock data
const generateMockBadges = (): UserBadge[] => [
  { id: '1', name: 'Early Adopter', icon: <Sparkles className="h-4 w-4" />, description: 'Joined during beta', earnedAt: new Date('2024-01-01'), rarity: 'rare' },
  { id: '2', name: 'Trendsetter', icon: <Flame className="h-4 w-4" />, description: '10 trending mockups', earnedAt: new Date('2024-02-15'), rarity: 'epic' },
  { id: '3', name: 'Community Star', icon: <Star className="h-4 w-4" />, description: '1000+ likes received', earnedAt: new Date('2024-02-20'), rarity: 'rare' },
  { id: '4', name: 'Pro Designer', icon: <Crown className="h-4 w-4" />, description: 'Pro subscription member', earnedAt: new Date('2024-01-15'), rarity: 'legendary' },
  { id: '5', name: 'Helpful Hero', icon: <Heart className="h-4 w-4" />, description: '100+ helpful comments', earnedAt: new Date('2024-02-10'), rarity: 'common' },
];

const generateMockUsers = (): ShowcaseUser[] => [
  {
    id: '1',
    name: 'Sarah Chen',
    username: 'sarahdesigns',
    avatar: '/avatars/sarah.jpg',
    coverImage: '/covers/sarah-cover.jpg',
    bio: 'UI/UX Designer passionate about creating beautiful and functional interfaces. Previously at Google, now freelancing.',
    location: 'San Francisco, CA',
    company: 'Freelance',
    role: 'Senior UI Designer',
    joinedAt: new Date('2023-06-15'),
    verified: true,
    pro: true,
    stats: { mockups: 48, likes: 12500, views: 158000, downloads: 8900, followers: 12500, following: 342 },
    badges: generateMockBadges().slice(0, 4),
    socialLinks: { website: 'https://sarahchen.design', twitter: 'sarahdesigns', dribbble: 'sarahchen', linkedin: 'sarahchen' },
    specialties: ['Dashboard Design', 'Mobile Apps', 'Design Systems'],
    isFollowing: false,
    rank: 1,
  },
  {
    id: '2',
    name: 'Alex Rivera',
    username: 'alexr',
    avatar: '/avatars/alex.jpg',
    bio: 'Product designer crafting delightful experiences. Love minimalism and clean interfaces.',
    location: 'New York, NY',
    company: 'Stripe',
    role: 'Product Designer',
    joinedAt: new Date('2023-08-20'),
    verified: true,
    pro: true,
    stats: { mockups: 32, likes: 8200, views: 92000, downloads: 5400, followers: 8200, following: 156 },
    badges: generateMockBadges().slice(0, 3),
    socialLinks: { twitter: 'alexrivera', dribbble: 'alexr', github: 'alexrivera' },
    specialties: ['Web Design', 'Fintech', 'SaaS'],
    isFollowing: true,
    rank: 2,
  },
  {
    id: '3',
    name: 'Maria Santos',
    username: 'mariaux',
    avatar: '/avatars/maria.jpg',
    bio: 'Creative director and UI enthusiast. Building beautiful products that people love.',
    location: 'London, UK',
    company: 'Figma',
    role: 'Creative Director',
    joinedAt: new Date('2023-04-10'),
    verified: true,
    pro: true,
    stats: { mockups: 87, likes: 21000, views: 285000, downloads: 14200, followers: 21000, following: 89 },
    badges: generateMockBadges(),
    socialLinks: { website: 'https://mariasantos.co', twitter: 'mariaux', linkedin: 'mariasantos', instagram: 'mariaux' },
    specialties: ['Brand Identity', 'Landing Pages', 'E-commerce'],
    isFollowing: false,
    rank: 3,
  },
  {
    id: '4',
    name: 'Jordan Taylor',
    username: 'jtdesign',
    avatar: '/avatars/jordan.jpg',
    bio: 'Designing the future, one pixel at a time. Open for collaborations.',
    location: 'Austin, TX',
    company: 'Independent',
    role: 'UI/UX Designer',
    joinedAt: new Date('2023-11-05'),
    verified: false,
    pro: false,
    stats: { mockups: 15, likes: 3400, views: 42000, downloads: 1800, followers: 3400, following: 234 },
    badges: generateMockBadges().slice(0, 2),
    socialLinks: { twitter: 'jtdesign', dribbble: 'jordant' },
    specialties: ['Mobile Design', 'Illustrations'],
    isFollowing: false,
    rank: 4,
  },
  {
    id: '5',
    name: 'Chris Park',
    username: 'chrispark',
    avatar: '/avatars/chris.jpg',
    bio: 'Frontend developer turned designer. Building bridges between code and creativity.',
    location: 'Seoul, Korea',
    company: 'Notion',
    role: 'Design Engineer',
    joinedAt: new Date('2024-01-10'),
    verified: true,
    pro: false,
    stats: { mockups: 8, likes: 1800, views: 24000, downloads: 920, followers: 1800, following: 445 },
    badges: generateMockBadges().slice(0, 1),
    socialLinks: { github: 'chrispark', twitter: 'chrispark_dev' },
    specialties: ['Design Systems', 'Component Libraries'],
    isFollowing: true,
    rank: 5,
  },
];

const generateMockMockups = (): ShowcaseMockup[] => [
  { id: '1', title: 'Modern Dashboard', thumbnail: '/mockups/dashboard.jpg', likes: 1250, views: 15800 },
  { id: '2', title: 'Mobile Banking App', thumbnail: '/mockups/banking.jpg', likes: 980, views: 12400 },
  { id: '3', title: 'E-commerce UI Kit', thumbnail: '/mockups/ecommerce.jpg', likes: 2100, views: 28500 },
  { id: '4', title: 'Social Media App', thumbnail: '/mockups/social.jpg', likes: 756, views: 9200 },
  { id: '5', title: 'Travel Booking', thumbnail: '/mockups/travel.jpg', likes: 540, views: 6800 },
  { id: '6', title: 'Fitness Tracker', thumbnail: '/mockups/fitness.jpg', likes: 890, views: 11200 },
];

// Sub-components
const UserAvatar: React.FC<{
  user: ShowcaseUser;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}> = ({ user, size = 'md', showBadge = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 ring-2 ring-white dark:ring-gray-800`} />
      {showBadge && user.verified && (
        <div className="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-0.5 text-white">
          <BadgeCheck className="h-3.5 w-3.5" />
        </div>
      )}
      {showBadge && user.pro && !user.verified && (
        <div className="absolute -right-1 -bottom-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 p-0.5 text-white">
          <Crown className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
};

const StatItem: React.FC<{
  label: string;
  value: number;
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-xl font-bold text-gray-900 dark:text-white">
        {icon}
        {formatNumber(value)}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
};

const BadgeDisplay: React.FC<{
  badge: UserBadge;
  size?: 'sm' | 'md';
}> = ({ badge, size = 'md' }) => {
  const rarityColors = {
    common: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600',
    rare: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    epic: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    legendary: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 ${rarityColors[badge.rarity]} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
      title={badge.description}
    >
      {badge.icon}
      <span className="font-medium">{badge.name}</span>
    </div>
  );
};

const UserCard: React.FC<{
  user: ShowcaseUser;
  onClick?: () => void;
  onFollow?: () => void;
  compact?: boolean;
}> = ({ user, onClick, onFollow, compact = false }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <UserAvatar user={user} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-gray-900 dark:text-white">{user.name}</span>
            {user.pro && (
              <span className="rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                PRO
              </span>
            )}
          </div>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            @
            {user.username}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatNumber(user.stats.followers)}
          {' '}
          followers
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />

      {/* Avatar */}
      <div className="-mt-10 px-4">
        <UserAvatar user={user} size="lg" />
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3
                onClick={onClick}
                className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                {user.name}
              </h3>
              {user.pro && (
                <span className="rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  PRO
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @
              {user.username}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); onFollow?.();
            }}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              user.isFollowing
                ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {user.isFollowing
              ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Following
                  </>
                )
              : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
          </button>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>

        {/* Location & Role */}
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {user.company}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <StatItem label="Mockups" value={user.stats.mockups} />
          <StatItem label="Followers" value={user.stats.followers} />
          <StatItem label="Likes" value={user.stats.likes} />
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.badges.slice(0, 3).map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} size="sm" />
            ))}
            {user.badges.length > 3 && (
              <span className="self-center text-xs text-gray-500 dark:text-gray-400">
                +
                {user.badges.length - 3}
                {' '}
                more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const LeaderboardRow: React.FC<{
  user: ShowcaseUser;
  rank: number;
  onClick?: () => void;
  onFollow?: () => void;
}> = ({ user, rank, onClick, onFollow }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getRankStyle = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Rank */}
      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${getRankStyle()}`}>
        {rank <= 3
          ? (
              <Trophy className="h-5 w-5" />
            )
          : (
              rank
            )}
      </div>

      {/* User Info */}
      <div
        onClick={onClick}
        className="flex flex-1 cursor-pointer items-center gap-3"
      >
        <UserAvatar user={user} size="md" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
              {user.name}
            </span>
            {user.pro && (
              <span className="rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                PRO
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @
            {user.username}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden items-center gap-6 text-sm text-gray-500 sm:flex dark:text-gray-400">
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{user.stats.mockups}</div>
          <div className="text-xs">Mockups</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(user.stats.likes)}</div>
          <div className="text-xs">Likes</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900 dark:text-white">{formatNumber(user.stats.followers)}</div>
          <div className="text-xs">Followers</div>
        </div>
      </div>

      {/* Follow Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); onFollow?.();
        }}
        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          user.isFollowing
            ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {user.isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      </button>
    </div>
  );
};

const UserProfile: React.FC<{
  user: ShowcaseUser;
  mockups: ShowcaseMockup[];
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}> = ({ user, mockups, onFollow, onMessage, onShare }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const socialIcons: Record<keyof SocialLinks, React.ReactNode> = {
    website: <Globe className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    github: <Github className="h-5 w-5" />,
    dribbble: <Dribbble className="h-5 w-5" />,
    instagram: <Instagram className="h-5 w-5" />,
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
            <UserAvatar user={user} size="xl" />
            <div className="flex-1 sm:mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                {user.verified && <BadgeCheck className="h-6 w-6 text-blue-500" />}
                {user.pro && (
                  <span className="rounded bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                @
                {user.username}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onFollow}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                  user.isFollowing
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {user.isFollowing
                  ? (
                      <>
                        <UserCheck className="h-5 w-5" />
                        Following
                      </>
                    )
                  : (
                      <>
                        <UserPlus className="h-5 w-5" />
                        Follow
                      </>
                    )}
              </button>
              <button
                onClick={onMessage}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Mail className="h-5 w-5" />
              </button>
              <button
                onClick={onShare}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-6 text-gray-600 dark:text-gray-300">{user.bio}</p>

          {/* Meta Info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user.location}
              </span>
            )}
            {user.company && (
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {user.role}
                {' '}
                at
                {user.company}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined
              {' '}
              {user.joinedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex gap-2">
            {Object.entries(user.socialLinks).map(([key, value]) =>
              value
                ? (
                    <a
                      key={key}
                      href={key === 'website' ? value : `https://${key}.com/${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      {socialIcons[key as keyof SocialLinks]}
                    </a>
                  )
                : null,
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6 sm:grid-cols-6 dark:border-gray-700">
            <StatItem label="Mockups" value={user.stats.mockups} />
            <StatItem label="Likes" value={user.stats.likes} />
            <StatItem label="Views" value={user.stats.views} />
            <StatItem label="Downloads" value={user.stats.downloads} />
            <StatItem label="Followers" value={user.stats.followers} />
            <StatItem label="Following" value={user.stats.following} />
          </div>
        </div>
      </div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Badges</h2>
          <div className="flex flex-wrap gap-2">
            {user.badges.map(badge => (
              <BadgeDisplay key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {/* Specialties */}
      {user.specialties.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Specialties</h2>
          <div className="flex flex-wrap gap-2">
            {user.specialties.map(specialty => (
              <span
                key={specialty}
                className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mockups */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Mockups</h2>
          <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {mockups.slice(0, 6).map(mockup => (
            <div
              key={mockup.id}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              <div className="h-full w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
              <div className="absolute inset-0 flex items-end bg-black/0 transition-colors group-hover:bg-black/50">
                <div className="w-full p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <h4 className="truncate text-sm font-medium text-white">{mockup.title}</h4>
                  <div className="mt-1 flex items-center gap-3 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(mockup.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(mockup.views)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main component
export const UserShowcase: React.FC<UserShowcaseProps> = ({
  variant = 'full',
  users: propUsers,
  featuredUser: propFeaturedUser,
  userMockups: propMockups,
  onUserClick,
  onFollow,
  onMessage,
  onShare,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});

  // Use props or mock data
  const users = propUsers || generateMockUsers();
  const featuredUser = propFeaturedUser || users[0]!;
  const mockups = propMockups || generateMockMockups();

  // Apply follow states
  const usersWithState = useMemo(() =>
    users.map(u => ({
      ...u,
      isFollowing: followStates[u.id] ?? u.isFollowing,
    })), [users, followStates]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return usersWithState;
    }
    const query = searchQuery.toLowerCase();
    return usersWithState.filter(u =>
      u.name.toLowerCase().includes(query)
      || u.username.toLowerCase().includes(query)
      || u.bio.toLowerCase().includes(query),
    );
  }, [usersWithState, searchQuery]);

  const handleFollow = useCallback((userId: string) => {
    setFollowStates(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    onFollow?.(userId);
  }, [onFollow]);

  // List variant (compact)
  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            compact
            onClick={() => onUserClick?.(user)}
            onFollow={() => handleFollow(user.id)}
          />
        ))}
      </div>
    );
  }

  // Card grid variant
  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onClick={() => onUserClick?.(user)}
            onFollow={() => handleFollow(user.id)}
          />
        ))}
      </div>
    );
  }

  // Leaderboard variant
  if (variant === 'leaderboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Designers</h2>
            <p className="text-gray-500 dark:text-gray-400">This month&apos;s most active community members</p>
          </div>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option>This Month</option>
            <option>This Week</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user, index) => (
            <LeaderboardRow
              key={user.id}
              user={user}
              rank={index + 1}
              onClick={() => onUserClick?.(user)}
              onFollow={() => handleFollow(user.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant (profile page style)
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search designers..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Featured User Profile */}
      {!searchQuery && (
        <UserProfile
          user={{ ...featuredUser, isFollowing: followStates[featuredUser.id] ?? featuredUser.isFollowing }}
          mockups={mockups}
          onFollow={() => handleFollow(featuredUser.id)}
          onMessage={() => onMessage?.(featuredUser.id)}
          onShare={() => onShare?.(featuredUser)}
        />
      )}

      {/* Other Users */}
      {(searchQuery || !featuredUser) && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => onUserClick?.(user)}
              onFollow={() => handleFollow(user.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

// Export sub-components
export { BadgeDisplay, LeaderboardRow, StatItem, UserAvatar, UserCard, UserProfile };

export default UserShowcase;
