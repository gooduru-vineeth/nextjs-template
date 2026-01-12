'use client';

import { useState } from 'react';

type Template = {
  id: string;
  name: string;
  description: string;
  category: 'chat' | 'social' | 'ai' | 'email' | 'notification';
  platform: string;
  thumbnail: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  stats: {
    uses: number;
    likes: number;
    rating: number;
  };
  isPremium: boolean;
  isNew?: boolean;
  tags: string[];
};

const mockTemplates: Template[] = [
  {
    id: 'tpl_1',
    name: 'Customer Support Chat',
    description: 'Professional customer support conversation template with automated responses and resolution flow.',
    category: 'chat',
    platform: 'WhatsApp',
    thumbnail: '/templates/customer-support.png',
    author: { name: 'MockFlow Team', verified: true },
    stats: { uses: 2450, likes: 342, rating: 4.8 },
    isPremium: false,
    tags: ['business', 'support', 'professional'],
  },
  {
    id: 'tpl_2',
    name: 'Team Standup',
    description: 'Daily standup meeting format for agile teams with status updates and blockers.',
    category: 'chat',
    platform: 'Slack',
    thumbnail: '/templates/team-standup.png',
    author: { name: 'Sarah Designer', verified: true },
    stats: { uses: 1820, likes: 256, rating: 4.7 },
    isPremium: false,
    tags: ['team', 'agile', 'standup'],
  },
  {
    id: 'tpl_3',
    name: 'Product Launch',
    description: 'Announcement post for new product launches with engagement-optimized format.',
    category: 'social',
    platform: 'LinkedIn',
    thumbnail: '/templates/product-launch.png',
    author: { name: 'Marketing Pro' },
    stats: { uses: 3200, likes: 489, rating: 4.9 },
    isPremium: true,
    isNew: true,
    tags: ['marketing', 'announcement', 'product'],
  },
  {
    id: 'tpl_4',
    name: 'AI Code Assistant',
    description: 'Developer-focused AI conversation with code snippets and explanations.',
    category: 'ai',
    platform: 'ChatGPT',
    thumbnail: '/templates/ai-code.png',
    author: { name: 'Dev Templates', verified: true },
    stats: { uses: 1560, likes: 198, rating: 4.6 },
    isPremium: true,
    tags: ['developer', 'coding', 'technical'],
  },
  {
    id: 'tpl_5',
    name: 'Order Confirmation',
    description: 'E-commerce order confirmation email with tracking and delivery details.',
    category: 'email',
    platform: 'Gmail',
    thumbnail: '/templates/order-confirmation.png',
    author: { name: 'E-commerce Hub' },
    stats: { uses: 890, likes: 124, rating: 4.5 },
    isPremium: false,
    tags: ['ecommerce', 'transactional', 'order'],
  },
  {
    id: 'tpl_6',
    name: 'Friend Chat',
    description: 'Casual conversation between friends with emojis and casual language.',
    category: 'chat',
    platform: 'iMessage',
    thumbnail: '/templates/friend-chat.png',
    author: { name: 'MockFlow Team', verified: true },
    stats: { uses: 4100, likes: 567, rating: 4.8 },
    isPremium: false,
    tags: ['casual', 'friends', 'personal'],
  },
  {
    id: 'tpl_7',
    name: 'Gaming Server',
    description: 'Discord server conversation for gaming communities with roles and reactions.',
    category: 'chat',
    platform: 'Discord',
    thumbnail: '/templates/gaming-server.png',
    author: { name: 'Gaming Templates' },
    stats: { uses: 2780, likes: 423, rating: 4.7 },
    isPremium: false,
    isNew: true,
    tags: ['gaming', 'community', 'discord'],
  },
  {
    id: 'tpl_8',
    name: 'App Update',
    description: 'Push notification template for app updates and new feature announcements.',
    category: 'notification',
    platform: 'iOS',
    thumbnail: '/templates/app-update.png',
    author: { name: 'Mobile UX' },
    stats: { uses: 650, likes: 89, rating: 4.4 },
    isPremium: true,
    tags: ['mobile', 'notification', 'update'],
  },
];

const categories = [
  { id: 'all', label: 'All Templates', icon: '🎨' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'ai', label: 'AI Assistants', icon: '🤖' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'notification', label: 'Notifications', icon: '🔔' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`size-4 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = mockTemplates
    .filter((template) => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch
        = template.name.toLowerCase().includes(searchQuery.toLowerCase())
          || template.description.toLowerCase().includes(searchQuery.toLowerCase())
          || template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPremium = !showPremiumOnly || template.isPremium;
      return matchesCategory && matchesSearch && matchesPremium;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stats.uses - a.stats.uses;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'rating':
          return b.stats.rating - a.stats.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Template Gallery</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start with professionally designed templates for any use case
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Submit Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <svg className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'popular' | 'newest' | 'rating')}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                showPremiumOnly
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Premium
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <div className="flex h-full items-center justify-center text-4xl opacity-50">
                  {template.category === 'chat' && '💬'}
                  {template.category === 'social' && '📱'}
                  {template.category === 'ai' && '🤖'}
                  {template.category === 'email' && '✉️'}
                  {template.category === 'notification' && '🔔'}
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {template.isNew && (
                    <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                  {template.isPremium && (
                    <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-medium text-white">
                      Premium
                    </span>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Use Template
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    {template.platform}
                  </span>
                  <StarRating rating={template.stats.rating} />
                </div>

                <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {template.author.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {template.author.name}
                    </span>
                    {template.author.verified && (
                      <svg className="size-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {template.stats.uses.toLocaleString()}
                    {' '}
                    uses
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      #
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No templates found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredTemplates.length > 0 && (
          <div className="mt-8 text-center">
            <button className="rounded-lg border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              Load More Templates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
