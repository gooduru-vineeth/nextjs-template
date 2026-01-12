'use client';

import {
  Bookmark,
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Heart,
  Lightbulb,
  Play,
  Search,
  Share2,
  Tag,
  TrendingUp,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type PostCategory = 'tutorial' | 'guide' | 'case-study' | 'news' | 'tips' | 'industry-insights';
export type PostType = 'article' | 'video' | 'interactive';
export type PostStatus = 'draft' | 'published' | 'archived';

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: PostCategory;
  type: PostType;
  status: PostStatus;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  coverImage: string;
  readTime: number;
  publishedAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  featured: boolean;
  series?: {
    id: string;
    name: string;
    order: number;
  };
};

export type BlogSeries = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  postCount: number;
  completedPosts: number;
};

export type BlogStats = {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  avgReadTime: number;
  topCategory: PostCategory;
  publishedThisMonth: number;
};

export type BlogPlatformProps = {
  posts?: BlogPost[];
  series?: BlogSeries[];
  stats?: BlogStats;
  variant?: 'full' | 'compact' | 'widget' | 'featured';
  onReadPost?: (postId: string) => void;
  onLikePost?: (postId: string) => void;
  onBookmarkPost?: (postId: string) => void;
  onSharePost?: (postId: string) => void;
  className?: string;
};

// Category configuration
const categoryConfig: Record<PostCategory, { label: string; color: string; icon: React.ReactNode }> = {
  'tutorial': { label: 'Tutorial', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <BookOpen className="h-4 w-4" /> },
  'guide': { label: 'Guide', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <FileText className="h-4 w-4" /> },
  'case-study': { label: 'Case Study', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Lightbulb className="h-4 w-4" /> },
  'news': { label: 'News', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <TrendingUp className="h-4 w-4" /> },
  'tips': { label: 'Tips & Tricks', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <Lightbulb className="h-4 w-4" /> },
  'industry-insights': { label: 'Industry Insights', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', icon: <Eye className="h-4 w-4" /> },
};

// Reserved for future post type filtering UI
const _postTypeConfig: Record<PostType, { label: string; icon: React.ReactNode }> = {
  article: { label: 'Article', icon: <FileText className="h-4 w-4" /> },
  video: { label: 'Video', icon: <Video className="h-4 w-4" /> },
  interactive: { label: 'Interactive', icon: <Play className="h-4 w-4" /> },
};
void _postTypeConfig;

// Mock data generators
const generateMockPosts = (): BlogPost[] => [
  {
    id: 'post-1',
    title: 'Getting Started with Chat Mockups: A Complete Guide',
    slug: 'getting-started-chat-mockups',
    excerpt: 'Learn how to create professional chat mockups in minutes with our comprehensive guide covering WhatsApp, iMessage, and more.',
    category: 'guide',
    type: 'article',
    status: 'published',
    author: { id: 'author-1', name: 'Sarah Chen', role: 'Product Designer' },
    coverImage: '/blog/chat-mockups-guide.jpg',
    readTime: 8,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    views: 12500,
    likes: 892,
    comments: 45,
    tags: ['chat', 'mockups', 'beginner', 'guide'],
    featured: true,
  },
  {
    id: 'post-2',
    title: 'How Acme Corp Increased Conversions by 40% with Social Proof Mockups',
    slug: 'acme-corp-case-study',
    excerpt: 'Discover how Acme Corp used our platform to create compelling social proof mockups that dramatically improved their conversion rates.',
    category: 'case-study',
    type: 'article',
    status: 'published',
    author: { id: 'author-2', name: 'Marcus Johnson', role: 'Content Lead' },
    coverImage: '/blog/acme-case-study.jpg',
    readTime: 12,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views: 8900,
    likes: 567,
    comments: 28,
    tags: ['case-study', 'social-proof', 'conversions'],
    featured: true,
  },
  {
    id: 'post-3',
    title: 'AI Chat Interface Design: Best Practices for 2026',
    slug: 'ai-chat-interface-best-practices',
    excerpt: 'Stay ahead of the curve with our expert insights on designing AI chat interfaces that users love.',
    category: 'industry-insights',
    type: 'article',
    status: 'published',
    author: { id: 'author-3', name: 'Elena Rodriguez', role: 'UX Researcher' },
    coverImage: '/blog/ai-chat-design.jpg',
    readTime: 15,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    views: 15200,
    likes: 1234,
    comments: 89,
    tags: ['AI', 'design', 'trends', 'UX'],
    featured: false,
  },
  {
    id: 'post-4',
    title: '10 Quick Tips for Better Social Media Mockups',
    slug: 'social-media-mockup-tips',
    excerpt: 'Elevate your social media mockups with these 10 professional tips from our design team.',
    category: 'tips',
    type: 'video',
    status: 'published',
    author: { id: 'author-1', name: 'Sarah Chen', role: 'Product Designer' },
    coverImage: '/blog/social-tips.jpg',
    readTime: 6,
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    views: 9800,
    likes: 756,
    comments: 34,
    tags: ['social-media', 'tips', 'design'],
    featured: false,
  },
  {
    id: 'post-5',
    title: 'Creating Realistic WhatsApp Conversations: Step-by-Step Tutorial',
    slug: 'whatsapp-tutorial',
    excerpt: 'Follow along as we create a pixel-perfect WhatsApp conversation mockup from scratch.',
    category: 'tutorial',
    type: 'interactive',
    status: 'published',
    author: { id: 'author-4', name: 'David Kim', role: 'Tutorial Creator' },
    coverImage: '/blog/whatsapp-tutorial.jpg',
    readTime: 20,
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    views: 22400,
    likes: 1890,
    comments: 156,
    tags: ['whatsapp', 'tutorial', 'step-by-step'],
    featured: false,
    series: { id: 'series-1', name: 'Platform Masterclass', order: 1 },
  },
  {
    id: 'post-6',
    title: 'New Feature: AI-Powered Content Generation',
    slug: 'ai-content-generation-launch',
    excerpt: 'Introducing our latest feature that uses AI to generate realistic conversation content for your mockups.',
    category: 'news',
    type: 'article',
    status: 'published',
    author: { id: 'author-5', name: 'Product Team', role: 'MockFlow' },
    coverImage: '/blog/ai-feature-launch.jpg',
    readTime: 4,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    views: 18500,
    likes: 2100,
    comments: 234,
    tags: ['AI', 'new-feature', 'announcement'],
    featured: true,
  },
];

const generateMockSeries = (): BlogSeries[] => [
  {
    id: 'series-1',
    name: 'Platform Masterclass',
    description: 'Master every mockup platform with our comprehensive series',
    coverImage: '/blog/series-masterclass.jpg',
    postCount: 8,
    completedPosts: 5,
  },
  {
    id: 'series-2',
    name: 'Design Fundamentals',
    description: 'Learn the core principles of mockup design',
    coverImage: '/blog/series-fundamentals.jpg',
    postCount: 6,
    completedPosts: 6,
  },
  {
    id: 'series-3',
    name: 'Advanced Techniques',
    description: 'Take your mockups to the next level',
    coverImage: '/blog/series-advanced.jpg',
    postCount: 4,
    completedPosts: 2,
  },
];

const generateMockStats = (): BlogStats => ({
  totalPosts: 156,
  totalViews: 2450000,
  totalLikes: 189000,
  avgReadTime: 8.5,
  topCategory: 'tutorial',
  publishedThisMonth: 12,
});

export function BlogPlatform({
  posts: propPosts,
  series: propSeries,
  stats: propStats,
  variant = 'full',
  onReadPost,
  onLikePost,
  onBookmarkPost,
  onSharePost,
  className = '',
}: BlogPlatformProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'series'>('latest');

  const posts = propPosts || generateMockPosts();
  const series = propSeries || generateMockSeries();
  const stats = propStats || generateMockStats();

  const filteredPosts = useMemo(() => {
    return posts
      .filter(p => p.status === 'published')
      .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
      .filter(p =>
        searchQuery === ''
        || p.title.toLowerCase().includes(searchQuery.toLowerCase())
        || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())),
      );
  }, [posts, categoryFilter, searchQuery]);

  const sortedPosts = useMemo(() => {
    if (activeTab === 'popular') {
      return [...filteredPosts].sort((a, b) => b.views - a.views);
    }
    return [...filteredPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [filteredPosts, activeTab]);

  const featuredPosts = useMemo(() => {
    return posts.filter(p => p.featured && p.status === 'published').slice(0, 3);
  }, [posts]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Latest Posts</h3>
          </div>
          <span className="text-sm text-gray-500">
            {stats.publishedThisMonth}
            {' '}
            new
          </span>
        </div>
        <div className="space-y-3">
          {sortedPosts.slice(0, 3).map(post => (
            <div
              key={post.id}
              className="-mx-2 flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => onReadPost?.(post.id)}
            >
              <div className="h-12 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">{post.title}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {post.readTime}
                  {' '}
                  min read
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Featured Articles</h3>
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
            View all
            {' '}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {featuredPosts.map((post, index) => (
            <div
              key={post.id}
              className={`group cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
              onClick={() => onReadPost?.(post.id)}
            >
              <div className={`rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 ${index === 0 ? 'h-64' : 'h-28'} relative mb-3 overflow-hidden`}>
                {post.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                      <Play className="ml-1 h-5 w-5 text-gray-900" />
                    </div>
                  </div>
                )}
                <span className={`absolute top-3 left-3 rounded px-2 py-0.5 text-xs ${categoryConfig[post.category].color}`}>
                  {categoryConfig[post.category].label}
                </span>
              </div>
              <h4 className={`font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white ${index === 0 ? 'text-lg' : 'text-sm'} line-clamp-2`}>
                {post.title}
              </h4>
              {index === 0 && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">{post.excerpt}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                  {' '}
                  min
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatNumber(post.views)}
                </span>
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
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Blog & Resources</h3>
              <p className="text-sm text-gray-500">
                {stats.totalPosts}
                {' '}
                articles
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedPosts.slice(0, 4).map(post => (
            <div
              key={post.id}
              className="-mx-2 flex cursor-pointer items-start gap-4 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => onReadPost?.(post.id)}
            >
              <div className="h-14 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-xs ${categoryConfig[post.category].color}`}>
                    {categoryConfig[post.category].label}
                  </span>
                  {post.type === 'video' && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Video className="h-3 w-3" />
                      {' '}
                      Video
                    </span>
                  )}
                </div>
                <h4 className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">{post.title}</h4>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  <span>
                    {post.readTime}
                    {' '}
                    min read
                  </span>
                  <span>
                    {formatNumber(post.views)}
                    {' '}
                    views
                  </span>
                </div>
              </div>
            </div>
          ))}
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
            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Blog & Resources</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tutorials, guides, and industry insights</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</p>
            <p className="text-sm text-gray-500">Total Posts</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(stats.totalViews)}</p>
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.avgReadTime}
              m
            </p>
            <p className="text-sm text-gray-500">Avg Read Time</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publishedThisMonth}</p>
            <p className="text-sm text-gray-500">This Month</p>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex gap-1">
          {(['latest', 'popular', 'series'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as PostCategory | 'all')}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryConfig).map(([cat, config]) => (
              <option key={cat} value={cat}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'series'
          ? (
              <div className="grid grid-cols-3 gap-4">
                {series.map(s => (
                  <div key={s.id} className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
                    <div className="h-32 bg-gradient-to-br from-purple-400 to-blue-500" />
                    <div className="p-4">
                      <h4 className="mb-1 font-semibold text-gray-900 dark:text-white">{s.name}</h4>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-500">{s.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {s.postCount}
                          {' '}
                          lessons
                        </span>
                        <div className="h-1.5 w-20 rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${(s.completedPosts / s.postCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          : (
              <div className="grid grid-cols-2 gap-6">
                {sortedPosts.map(post => (
                  <div
                    key={post.id}
                    className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    onClick={() => onReadPost?.(post.id)}
                  >
                    <div className="relative h-40 bg-gradient-to-br from-blue-400 to-purple-500">
                      {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
                            <Play className="ml-1 h-6 w-6 text-gray-900" />
                          </div>
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 rounded px-2 py-0.5 text-xs ${categoryConfig[post.category].color}`}>
                        {categoryConfig[post.category].label}
                      </span>
                      {post.featured && (
                        <span className="absolute top-3 right-3 rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white">
                        {post.title}
                      </h4>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-500">{post.excerpt}</p>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                            {' '}
                            min
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {formatNumber(post.views)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); onLikePost?.(post.id);
                            }}
                            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); onBookmarkPost?.(post.id);
                            }}
                            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Bookmark className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); onSharePost?.(post.id);
                            }}
                            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </div>
  );
}

export default BlogPlatform;
