'use client';

import {
  Award,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crown,
  Download,
  Eye,
  Flame,
  Globe,
  Grid3X3,
  Heart,
  Layers,
  LayoutList,
  MessageCircle,
  Palette,
  Search,
  Share2,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// Types
export type GalleryAuthor = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  followers: number;
  mockupsCount: number;
  pro?: boolean;
};

export type GalleryMockup = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  author: GalleryAuthor;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  downloads: number;
  comments: number;
  featured: boolean;
  trending: boolean;
  createdAt: Date;
  updatedAt: Date;
  license: 'free' | 'premium' | 'attribution';
  isLiked?: boolean;
  isSaved?: boolean;
};

export type GalleryComment = {
  id: string;
  author: GalleryAuthor;
  content: string;
  likes: number;
  createdAt: Date;
  replies?: GalleryComment[];
};

export type GalleryCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
};

export type GalleryFilters = {
  category: string;
  sortBy: 'trending' | 'recent' | 'popular' | 'downloads';
  license: 'all' | 'free' | 'premium';
  timeRange: 'all' | 'week' | 'month' | 'year';
};

export type CommunityGalleryProps = {
  variant?: 'full' | 'grid' | 'compact';
  mockups?: GalleryMockup[];
  categories?: GalleryCategory[];
  onMockupClick?: (mockup: GalleryMockup) => void;
  onLike?: (mockupId: string) => void;
  onSave?: (mockupId: string) => void;
  onShare?: (mockup: GalleryMockup) => void;
  onDownload?: (mockup: GalleryMockup) => void;
  onAuthorClick?: (author: GalleryAuthor) => void;
  onFilterChange?: (filters: GalleryFilters) => void;
  className?: string;
};

// Mock data generators
const generateMockAuthors = (): GalleryAuthor[] => [
  { id: '1', name: 'Sarah Chen', username: 'sarahdesigns', avatar: '/avatars/sarah.jpg', verified: true, followers: 12500, mockupsCount: 48, pro: true },
  { id: '2', name: 'Alex Rivera', username: 'alexr', avatar: '/avatars/alex.jpg', verified: true, followers: 8200, mockupsCount: 32, pro: true },
  { id: '3', name: 'Jordan Taylor', username: 'jtdesign', avatar: '/avatars/jordan.jpg', verified: false, followers: 3400, mockupsCount: 15 },
  { id: '4', name: 'Maria Santos', username: 'mariaux', avatar: '/avatars/maria.jpg', verified: true, followers: 21000, mockupsCount: 87, pro: true },
  { id: '5', name: 'Chris Park', username: 'chrispark', avatar: '/avatars/chris.jpg', verified: false, followers: 1800, mockupsCount: 8 },
];

const generateMockMockups = (authors: GalleryAuthor[]): GalleryMockup[] => [
  {
    id: '1',
    title: 'Modern E-commerce Dashboard',
    description: 'A clean and modern dashboard design for e-commerce platforms with real-time analytics',
    thumbnail: '/mockups/ecommerce-dashboard.jpg',
    images: ['/mockups/ecommerce-dashboard.jpg', '/mockups/ecommerce-dashboard-2.jpg'],
    author: authors[0]!,
    category: 'dashboards',
    tags: ['dashboard', 'e-commerce', 'analytics', 'modern'],
    likes: 1250,
    views: 15800,
    downloads: 890,
    comments: 45,
    featured: true,
    trending: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    license: 'free',
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'Fitness App Mobile UI Kit',
    description: 'Complete UI kit for fitness and health tracking mobile applications',
    thumbnail: '/mockups/fitness-app.jpg',
    images: ['/mockups/fitness-app.jpg', '/mockups/fitness-app-2.jpg', '/mockups/fitness-app-3.jpg'],
    author: authors[1]!,
    category: 'mobile',
    tags: ['mobile', 'fitness', 'health', 'ui-kit'],
    likes: 980,
    views: 12400,
    downloads: 650,
    comments: 32,
    featured: false,
    trending: true,
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18'),
    license: 'premium',
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    title: 'SaaS Landing Page Template',
    description: 'High-converting landing page design for SaaS products',
    thumbnail: '/mockups/saas-landing.jpg',
    images: ['/mockups/saas-landing.jpg'],
    author: authors[3]!,
    category: 'landing-pages',
    tags: ['landing', 'saas', 'conversion', 'marketing'],
    likes: 2100,
    views: 28500,
    downloads: 1560,
    comments: 78,
    featured: true,
    trending: false,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-10'),
    license: 'free',
    isLiked: false,
    isSaved: true,
  },
  {
    id: '4',
    title: 'Banking App Concept',
    description: 'Modern banking application with intuitive money management features',
    thumbnail: '/mockups/banking-app.jpg',
    images: ['/mockups/banking-app.jpg', '/mockups/banking-app-2.jpg'],
    author: authors[2]!,
    category: 'mobile',
    tags: ['mobile', 'banking', 'fintech', 'finance'],
    likes: 756,
    views: 9200,
    downloads: 420,
    comments: 28,
    featured: false,
    trending: false,
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-22'),
    license: 'attribution',
    isLiked: false,
    isSaved: false,
  },
  {
    id: '5',
    title: 'Restaurant Website Design',
    description: 'Elegant website design for restaurants and cafes with online ordering',
    thumbnail: '/mockups/restaurant-web.jpg',
    images: ['/mockups/restaurant-web.jpg', '/mockups/restaurant-web-2.jpg'],
    author: authors[4]!,
    category: 'websites',
    tags: ['website', 'restaurant', 'food', 'ordering'],
    likes: 540,
    views: 6800,
    downloads: 310,
    comments: 19,
    featured: false,
    trending: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-21'),
    license: 'free',
    isLiked: true,
    isSaved: false,
  },
  {
    id: '6',
    title: 'Social Media Dashboard Pro',
    description: 'Professional social media management dashboard with multi-platform support',
    thumbnail: '/mockups/social-dashboard.jpg',
    images: ['/mockups/social-dashboard.jpg'],
    author: authors[0]!,
    category: 'dashboards',
    tags: ['dashboard', 'social-media', 'analytics', 'management'],
    likes: 1890,
    views: 22400,
    downloads: 1120,
    comments: 56,
    featured: true,
    trending: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
    license: 'premium',
    isLiked: false,
    isSaved: false,
  },
];

const defaultCategories: GalleryCategory[] = [
  { id: 'all', name: 'All', icon: <Grid3X3 className="h-4 w-4" />, count: 1250 },
  { id: 'dashboards', name: 'Dashboards', icon: <Layers className="h-4 w-4" />, count: 342 },
  { id: 'mobile', name: 'Mobile Apps', icon: <Globe className="h-4 w-4" />, count: 456 },
  { id: 'websites', name: 'Websites', icon: <Globe className="h-4 w-4" />, count: 289 },
  { id: 'landing-pages', name: 'Landing Pages', icon: <Palette className="h-4 w-4" />, count: 163 },
];

// Sub-components
const MockupCard: React.FC<{
  mockup: GalleryMockup;
  variant?: 'default' | 'compact';
  onClick?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onAuthorClick?: () => void;
}> = ({ mockup, variant = 'default', onClick, onLike, onSave, onShare, onAuthorClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [, setShowMenu] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
          <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-medium text-gray-900 dark:text-white">{mockup.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            by
            {mockup.author.name}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {formatNumber(mockup.likes)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {formatNumber(mockup.views)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false); setShowMenu(false);
      }}
    >
      {/* Thumbnail */}
      <div
        onClick={onClick}
        className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-700"
      >
        <div className="h-full w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {mockup.featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">
              <Crown className="h-3 w-3" />
              Featured
            </span>
          )}
          {mockup.trending && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-xs font-medium text-white">
              <Flame className="h-3 w-3" />
              Trending
            </span>
          )}
        </div>

        {/* License Badge */}
        <div className="absolute top-3 right-3">
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
            mockup.license === 'free'
              ? 'bg-green-500 text-white'
              : mockup.license === 'premium'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-500 text-white'
          }`}
          >
            {mockup.license === 'free' ? 'Free' : mockup.license === 'premium' ? 'Premium' : 'Attribution'}
          </span>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation(); onLike?.();
              }}
              className={`rounded-full p-3 transition-colors ${
                mockup.isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${mockup.isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onSave?.();
              }}
              className={`rounded-full p-3 transition-colors ${
                mockup.isSaved
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              {mockup.isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onShare?.();
              }}
              className="rounded-full bg-white/90 p-3 text-gray-700 transition-colors hover:bg-white"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          onClick={onClick}
          className="mb-2 line-clamp-1 cursor-pointer font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
        >
          {mockup.title}
        </h3>

        {/* Author */}
        <div
          onClick={(e) => {
            e.stopPropagation(); onAuthorClick?.();
          }}
          className="group/author mb-3 flex cursor-pointer items-center gap-2"
        >
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <span className="text-sm text-gray-600 group-hover/author:text-blue-600 dark:text-gray-300 dark:group-hover/author:text-blue-400">
            {mockup.author.name}
          </span>
          {mockup.author.verified && (
            <span className="text-blue-500">
              <Award className="h-3.5 w-3.5" />
            </span>
          )}
          {mockup.author.pro && (
            <span className="rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              PRO
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {mockup.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className={`h-4 w-4 ${mockup.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {formatNumber(mockup.likes)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {formatNumber(mockup.views)}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {formatNumber(mockup.downloads)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {mockup.comments}
          </span>
        </div>
      </div>
    </div>
  );
};

const CategoryPill: React.FC<{
  category: GalleryCategory;
  isActive: boolean;
  onClick: () => void;
}> = ({ category, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
    }`}
  >
    {category.icon}
    {category.name}
    <span className={`rounded-full px-1.5 py-0.5 text-xs ${
      isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
    }`}
    >
      {category.count}
    </span>
  </button>
);

const MockupDetailModal: React.FC<{
  mockup: GalleryMockup;
  isOpen: boolean;
  onClose: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onAuthorClick?: () => void;
}> = ({ mockup, isOpen, onClose, onLike, onSave, onShare, onDownload, onAuthorClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-700 hover:bg-white dark:bg-gray-700/90 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="relative aspect-[4/3] bg-gray-100 lg:w-2/3 dark:bg-gray-900">
            <div className="h-full w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />

            {/* Image Navigation */}
            {mockup.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                  className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-2"
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(i => Math.min(mockup.images.length - 1, i + 1))}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-2"
                  disabled={currentImageIndex === mockup.images.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {mockup.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="overflow-y-auto p-6 lg:w-1/3">
            {/* Badges */}
            <div className="mb-4 flex gap-2">
              {mockup.featured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Crown className="h-3 w-3" />
                  Featured
                </span>
              )}
              {mockup.trending && (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                  <Flame className="h-3 w-3" />
                  Trending
                </span>
              )}
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                mockup.license === 'free'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : mockup.license === 'premium'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              >
                {mockup.license === 'free' ? 'Free' : mockup.license === 'premium' ? 'Premium' : 'Attribution'}
              </span>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{mockup.title}</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">{mockup.description}</p>

            {/* Author */}
            <div
              onClick={onAuthorClick}
              className="mb-6 flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{mockup.author.name}</span>
                  {mockup.author.verified && <Award className="h-4 w-4 text-blue-500" />}
                  {mockup.author.pro && (
                    <span className="rounded bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      PRO
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  @
                  {mockup.author.username}
                  {' '}
                  ·
                  {' '}
                  {mockup.author.followers.toLocaleString()}
                  {' '}
                  followers
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{mockup.likes.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{mockup.views.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{mockup.downloads.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{mockup.comments}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {mockup.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  #
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onDownload}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              <button
                onClick={onLike}
                className={`rounded-lg border p-3 transition-colors ${
                  mockup.isLiked
                    ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`h-5 w-5 ${mockup.isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onSave}
                className={`rounded-lg border p-3 transition-colors ${
                  mockup.isSaved
                    ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {mockup.isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
              </button>
              <button
                onClick={onShare}
                className="rounded-lg border border-gray-200 p-3 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Date */}
            <div className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Created
                {' '}
                {mockup.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export const CommunityGallery: React.FC<CommunityGalleryProps> = ({
  variant = 'full',
  mockups: propMockups,
  categories: propCategories,
  onMockupClick,
  onLike,
  onSave,
  onShare,
  onDownload,
  onAuthorClick,
  onFilterChange,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GalleryFilters>({
    category: 'all',
    sortBy: 'trending',
    license: 'all',
    timeRange: 'all',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMockup, setSelectedMockup] = useState<GalleryMockup | null>(null);
  const [mockupStates, setMockupStates] = useState<Record<string, { isLiked: boolean; isSaved: boolean }>>({});

  // Use props or mock data
  const authors = useMemo(() => generateMockAuthors(), []);
  const mockups = propMockups || generateMockMockups(authors);
  const categories = propCategories || defaultCategories;

  // Apply mockup states
  const mockupsWithState = useMemo(() =>
    mockups.map(m => ({
      ...m,
      isLiked: mockupStates[m.id]?.isLiked ?? m.isLiked,
      isSaved: mockupStates[m.id]?.isSaved ?? m.isSaved,
    })), [mockups, mockupStates]);

  // Filter and sort mockups
  const filteredMockups = useMemo(() => {
    let filtered = mockupsWithState;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(query)
        || m.description.toLowerCase().includes(query)
        || m.tags.some(t => t.toLowerCase().includes(query))
        || m.author.name.toLowerCase().includes(query),
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(m => m.category === filters.category);
    }

    // License filter
    if (filters.license !== 'all') {
      filtered = filtered.filter(m => m.license === filters.license);
    }

    // Sort
    switch (filters.sortBy) {
      case 'trending':
        filtered = [...filtered].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.views - a.views);
        break;
      case 'recent':
        filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.likes - a.likes);
        break;
      case 'downloads':
        filtered = [...filtered].sort((a, b) => b.downloads - a.downloads);
        break;
    }

    return filtered;
  }, [mockupsWithState, searchQuery, filters]);

  const handleFilterChange = useCallback((newFilters: Partial<GalleryFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  }, [filters, onFilterChange]);

  const handleLike = useCallback((mockupId: string) => {
    setMockupStates(prev => ({
      ...prev,
      [mockupId]: {
        ...prev[mockupId],
        isLiked: !prev[mockupId]?.isLiked,
        isSaved: prev[mockupId]?.isSaved ?? false,
      },
    }));
    onLike?.(mockupId);
  }, [onLike]);

  const handleSave = useCallback((mockupId: string) => {
    setMockupStates(prev => ({
      ...prev,
      [mockupId]: {
        ...prev[mockupId],
        isSaved: !prev[mockupId]?.isSaved,
        isLiked: prev[mockupId]?.isLiked ?? false,
      },
    }));
    onSave?.(mockupId);
  }, [onSave]);

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Community Gallery</h3>
          <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">View all</button>
        </div>
        <div className="space-y-2">
          {filteredMockups.slice(0, 5).map(mockup => (
            <MockupCard
              key={mockup.id}
              mockup={mockup}
              variant="compact"
              onClick={() => onMockupClick?.(mockup)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Grid variant
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {filteredMockups.map(mockup => (
          <MockupCard
            key={mockup.id}
            mockup={mockup}
            onClick={() => onMockupClick?.(mockup)}
            onLike={() => handleLike(mockup.id)}
            onSave={() => handleSave(mockup.id)}
            onShare={() => onShare?.(mockup)}
            onAuthorClick={() => onAuthorClick?.(mockup.author)}
          />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Community Gallery</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Discover mockups from the community
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search mockups..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <CategoryPill
            key={category.id}
            category={category}
            isActive={filters.category === category.id}
            onClick={() => handleFilterChange({ category: category.id })}
          />
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center dark:bg-gray-800/50">
        <div className="flex items-center gap-4">
          <select
            value={filters.sortBy}
            onChange={e => handleFilterChange({ sortBy: e.target.value as GalleryFilters['sortBy'] })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="trending">Trending</option>
            <option value="recent">Recent</option>
            <option value="popular">Most Liked</option>
            <option value="downloads">Most Downloaded</option>
          </select>

          <select
            value={filters.license}
            onChange={e => handleFilterChange({ license: e.target.value as GalleryFilters['license'] })}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Licenses</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredMockups.length}
            {' '}
            mockups
          </span>
          <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {viewMode === 'grid'
        ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMockups.map(mockup => (
                <MockupCard
                  key={mockup.id}
                  mockup={mockup}
                  onClick={() => setSelectedMockup(mockup)}
                  onLike={() => handleLike(mockup.id)}
                  onSave={() => handleSave(mockup.id)}
                  onShare={() => onShare?.(mockup)}
                  onAuthorClick={() => onAuthorClick?.(mockup.author)}
                />
              ))}
            </div>
          )
        : (
            <div className="space-y-3">
              {filteredMockups.map(mockup => (
                <MockupCard
                  key={mockup.id}
                  mockup={mockup}
                  variant="compact"
                  onClick={() => setSelectedMockup(mockup)}
                />
              ))}
            </div>
          )}

      {/* Empty State */}
      {filteredMockups.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No mockups found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMockup && (
        <MockupDetailModal
          mockup={selectedMockup}
          isOpen={true}
          onClose={() => setSelectedMockup(null)}
          onLike={() => handleLike(selectedMockup.id)}
          onSave={() => handleSave(selectedMockup.id)}
          onShare={() => onShare?.(selectedMockup)}
          onDownload={() => onDownload?.(selectedMockup)}
          onAuthorClick={() => onAuthorClick?.(selectedMockup.author)}
        />
      )}
    </div>
  );
};

// Export sub-components
export { CategoryPill, MockupCard, MockupDetailModal };

export default CommunityGallery;
