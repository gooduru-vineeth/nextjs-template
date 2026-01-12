'use client';

import Link from 'next/link';
import { useState } from 'react';

type ShowcaseItem = {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    verified: boolean;
    bio: string;
    followers: number;
  };
  mockupType: 'chat' | 'social' | 'ai' | 'email' | 'notification';
  platform: string;
  thumbnail?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  tags: string[];
  createdAt: string;
  isFeatured: boolean;
};

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'showcase_1',
    title: 'E-commerce Customer Journey',
    description: 'A complete customer support flow showcasing how online retailers can handle inquiries from browsing to post-purchase.',
    author: {
      name: 'Alex Rivera',
      username: 'alexrivera',
      verified: true,
      bio: 'UX Designer | Creating mockups for better user experiences',
      followers: 12500,
    },
    mockupType: 'chat',
    platform: 'WhatsApp',
    stats: { views: 45000, likes: 3240, comments: 156, shares: 890 },
    tags: ['e-commerce', 'customer-service', 'whatsapp'],
    createdAt: 'Jan 5, 2026',
    isFeatured: true,
  },
  {
    id: 'showcase_2',
    title: 'SaaS Product Launch Campaign',
    description: 'Multi-platform social media campaign mockups for a SaaS product launch including LinkedIn, Twitter, and Instagram.',
    author: {
      name: 'Marketing Maven',
      username: 'marketingmaven',
      verified: true,
      bio: 'Growth Marketer | Helping startups scale through content',
      followers: 8900,
    },
    mockupType: 'social',
    platform: 'LinkedIn',
    stats: { views: 38000, likes: 2890, comments: 234, shares: 1200 },
    tags: ['saas', 'marketing', 'launch'],
    createdAt: 'Jan 8, 2026',
    isFeatured: true,
  },
  {
    id: 'showcase_3',
    title: 'AI Coding Assistant Tutorial',
    description: 'Step-by-step tutorial showing how AI coding assistants can help developers write better code faster.',
    author: {
      name: 'Dev Tutorials',
      username: 'devtutorials',
      verified: false,
      bio: 'Making coding accessible to everyone',
      followers: 5600,
    },
    mockupType: 'ai',
    platform: 'ChatGPT',
    stats: { views: 67000, likes: 5430, comments: 432, shares: 2100 },
    tags: ['ai', 'coding', 'tutorial'],
    createdAt: 'Jan 10, 2026',
    isFeatured: true,
  },
  {
    id: 'showcase_4',
    title: 'Newsletter Design Showcase',
    description: 'Beautiful email newsletter designs for various industries including tech, fashion, and finance.',
    author: {
      name: 'Email Designer',
      username: 'emaildesigner',
      verified: true,
      bio: 'Email design specialist | 500+ campaigns designed',
      followers: 7200,
    },
    mockupType: 'email',
    platform: 'Gmail',
    stats: { views: 23000, likes: 1890, comments: 98, shares: 560 },
    tags: ['email', 'newsletter', 'design'],
    createdAt: 'Jan 12, 2026',
    isFeatured: false,
  },
  {
    id: 'showcase_5',
    title: 'Mobile App Notification Flow',
    description: 'Complete notification strategy for a fitness app including onboarding, reminders, and achievements.',
    author: {
      name: 'App UX Pro',
      username: 'appuxpro',
      verified: false,
      bio: 'Mobile app designer | iOS & Android specialist',
      followers: 4300,
    },
    mockupType: 'notification',
    platform: 'iOS',
    stats: { views: 18500, likes: 1340, comments: 87, shares: 340 },
    tags: ['mobile', 'notifications', 'ux'],
    createdAt: 'Jan 14, 2026',
    isFeatured: false,
  },
  {
    id: 'showcase_6',
    title: 'Discord Community Setup',
    description: 'How to create an engaging Discord server with welcome flows, roles, and community guidelines.',
    author: {
      name: 'Community Builder',
      username: 'communitybuilder',
      verified: true,
      bio: 'Building communities that thrive',
      followers: 9800,
    },
    mockupType: 'chat',
    platform: 'Discord',
    stats: { views: 34000, likes: 2670, comments: 312, shares: 890 },
    tags: ['discord', 'community', 'engagement'],
    createdAt: 'Jan 16, 2026',
    isFeatured: true,
  },
  {
    id: 'showcase_7',
    title: 'Viral Twitter Thread Strategy',
    description: 'Anatomy of viral Twitter threads with examples and best practices for maximum engagement.',
    author: {
      name: 'Thread Master',
      username: 'threadmaster',
      verified: true,
      bio: '10M+ impressions monthly | Teaching Twitter growth',
      followers: 45000,
    },
    mockupType: 'social',
    platform: 'Twitter',
    stats: { views: 89000, likes: 7800, comments: 567, shares: 4500 },
    tags: ['twitter', 'viral', 'growth'],
    createdAt: 'Jan 18, 2026',
    isFeatured: true,
  },
  {
    id: 'showcase_8',
    title: 'Claude for Research',
    description: 'How researchers are using Claude AI for literature review, data analysis, and paper writing.',
    author: {
      name: 'Research AI',
      username: 'researchai',
      verified: false,
      bio: 'Exploring AI applications in academic research',
      followers: 3200,
    },
    mockupType: 'ai',
    platform: 'Claude',
    stats: { views: 28000, likes: 2100, comments: 189, shares: 670 },
    tags: ['claude', 'research', 'academic'],
    createdAt: 'Jan 20, 2026',
    isFeatured: false,
  },
];

const categories = [
  { id: 'all', label: 'All', icon: '🎨' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'social', label: 'Social', icon: '📱' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'notification', label: 'Notifications', icon: '🔔' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

type ShowcaseCardProps = {
  item: ShowcaseItem;
};

function ShowcaseCard({ item }: ShowcaseCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <div className="flex h-full items-center justify-center">
          <span className="text-5xl opacity-30">
            {categories.find(c => c.id === item.mockupType)?.icon || '📄'}
          </span>
        </div>
        {/* Featured Badge */}
        {item.isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white">
              <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Featured
            </span>
          </div>
        )}
        {/* Platform */}
        <div className="absolute right-4 bottom-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
          {item.platform}
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            View Project
          </button>
          <button className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {item.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {item.description}
        </p>

        {/* Author */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-medium text-white">
            {item.author.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-900 dark:text-white">{item.author.name}</span>
              {item.author.verified && (
                <svg className="size-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              @
              {item.author.username}
              {' '}
              ·
              {' '}
              {formatNumber(item.author.followers)}
              {' '}
              followers
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(item.stats.views)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {formatNumber(item.stats.likes)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {formatNumber(item.stats.comments)}
            </span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{item.createdAt}</span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            >
              #
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type CreatorCardProps = {
  creator: ShowcaseItem['author'] & { mockupCount: number };
};

function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
        {creator.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="font-semibold text-gray-900 dark:text-white">{creator.name}</span>
          {creator.verified && (
            <svg className="size-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatNumber(creator.followers)}
          {' '}
          followers ·
          {creator.mockupCount}
          {' '}
          mockups
        </p>
      </div>
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
        Follow
      </button>
    </div>
  );
}

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = showcaseItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.mockupType === selectedCategory;
    const matchesSearch
      = item.title.toLowerCase().includes(searchQuery.toLowerCase())
        || item.description.toLowerCase().includes(searchQuery.toLowerCase())
        || item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredItems = showcaseItems.filter(item => item.isFeatured);

  // Get unique creators
  const creators = Array.from(
    new Map(
      showcaseItems.map(item => [item.author.username, { ...item.author, mockupCount: showcaseItems.filter(i => i.author.username === item.author.username).length }]),
    ).values(),
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Community Showcase</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">
            Discover amazing mockups created by our community. Get inspired and share your own creations.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <svg
                className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search showcases, creators, or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-0 bg-white/10 py-4 pr-4 pl-12 text-white placeholder-purple-200 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-white text-purple-700'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Creators */}
      <div className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Creators</h2>
            <Link href="/creators" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View all creators
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {creators.map(creator => (
              <CreatorCard key={creator.username} creator={creator} />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Showcases */}
      {featuredItems.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Featured Projects</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredItems.slice(0, 3).map(item => (
                <ShowcaseCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Showcases */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredItems.length}
            {' '}
            projects
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg
              className="mx-auto size-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No projects found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or category filter.
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="mt-8 text-center">
            <button className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              Load More Projects
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Share Your Work</h2>
          <p className="mt-4 text-lg text-blue-100">
            Created something amazing? Share it with the MockFlow community and get featured.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Create Mockup
            </Link>
            <button className="rounded-lg bg-white/20 px-8 py-3 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30">
              Submit to Showcase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
