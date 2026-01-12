'use client';

import Link from 'next/link';
import { useState } from 'react';

type Template = {
  id: string;
  name: string;
  description: string;
  category: 'chat' | 'social' | 'ai' | 'email' | 'notification' | 'business';
  platform: string;
  thumbnail?: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  stats: {
    uses: number;
    likes: number;
    views: number;
  };
  tags: string[];
  isPremium: boolean;
  isFeatured: boolean;
  createdAt: string;
};

const templates: Template[] = [
  {
    id: 'tmpl_1',
    name: 'Customer Support Flow',
    description: 'Professional customer support conversation template with common responses and escalation paths.',
    category: 'chat',
    platform: 'WhatsApp',
    author: { name: 'MockFlow Team', verified: true },
    stats: { uses: 15420, likes: 892, views: 45000 },
    tags: ['support', 'business', 'whatsapp'],
    isPremium: false,
    isFeatured: true,
    createdAt: 'Jan 5, 2026',
  },
  {
    id: 'tmpl_2',
    name: 'Product Launch Announcement',
    description: 'Eye-catching LinkedIn post template for announcing new product launches and features.',
    category: 'social',
    platform: 'LinkedIn',
    author: { name: 'Sarah Chen', verified: true },
    stats: { uses: 8930, likes: 456, views: 28000 },
    tags: ['marketing', 'launch', 'linkedin'],
    isPremium: true,
    isFeatured: true,
    createdAt: 'Jan 8, 2026',
  },
  {
    id: 'tmpl_3',
    name: 'AI Code Review Assistant',
    description: 'ChatGPT conversation showing AI-assisted code review with detailed explanations.',
    category: 'ai',
    platform: 'ChatGPT',
    author: { name: 'Dev Community', verified: false },
    stats: { uses: 12340, likes: 1023, views: 52000 },
    tags: ['coding', 'ai', 'developer'],
    isPremium: false,
    isFeatured: true,
    createdAt: 'Jan 10, 2026',
  },
  {
    id: 'tmpl_4',
    name: 'Weekly Newsletter',
    description: 'Clean and professional email newsletter template with sections for content highlights.',
    category: 'email',
    platform: 'Gmail',
    author: { name: 'Email Pro', verified: true },
    stats: { uses: 6780, likes: 345, views: 19000 },
    tags: ['newsletter', 'email', 'marketing'],
    isPremium: true,
    isFeatured: false,
    createdAt: 'Jan 12, 2026',
  },
  {
    id: 'tmpl_5',
    name: 'Team Standup Meeting',
    description: 'Slack conversation template for daily standup updates with status indicators.',
    category: 'chat',
    platform: 'Slack',
    author: { name: 'Agile Teams', verified: false },
    stats: { uses: 9450, likes: 567, views: 31000 },
    tags: ['team', 'standup', 'slack'],
    isPremium: false,
    isFeatured: false,
    createdAt: 'Jan 14, 2026',
  },
  {
    id: 'tmpl_6',
    name: 'App Download Notification',
    description: 'iOS push notification sequence for app download milestones and engagement.',
    category: 'notification',
    platform: 'iOS',
    author: { name: 'Mobile First', verified: true },
    stats: { uses: 4230, likes: 234, views: 15000 },
    tags: ['mobile', 'notification', 'ios'],
    isPremium: false,
    isFeatured: false,
    createdAt: 'Jan 16, 2026',
  },
  {
    id: 'tmpl_7',
    name: 'Viral Thread Template',
    description: 'Twitter/X thread template optimized for maximum engagement and retweets.',
    category: 'social',
    platform: 'Twitter',
    author: { name: 'Social Guru', verified: true },
    stats: { uses: 18920, likes: 2345, views: 89000 },
    tags: ['viral', 'twitter', 'thread'],
    isPremium: true,
    isFeatured: true,
    createdAt: 'Jan 18, 2026',
  },
  {
    id: 'tmpl_8',
    name: 'Discord Welcome Flow',
    description: 'Automated welcome message sequence for new Discord server members.',
    category: 'chat',
    platform: 'Discord',
    author: { name: 'Community Builder', verified: false },
    stats: { uses: 7650, likes: 432, views: 24000 },
    tags: ['discord', 'community', 'welcome'],
    isPremium: false,
    isFeatured: false,
    createdAt: 'Jan 20, 2026',
  },
  {
    id: 'tmpl_9',
    name: 'Invoice Email',
    description: 'Professional invoice email template with payment details and branding.',
    category: 'email',
    platform: 'Outlook',
    author: { name: 'Business Suite', verified: true },
    stats: { uses: 5430, likes: 287, views: 16500 },
    tags: ['invoice', 'business', 'email'],
    isPremium: true,
    isFeatured: false,
    createdAt: 'Jan 22, 2026',
  },
  {
    id: 'tmpl_10',
    name: 'Claude Code Assistant',
    description: 'Claude AI conversation showing advanced coding assistance with explanations.',
    category: 'ai',
    platform: 'Claude',
    author: { name: 'AI Enthusiast', verified: false },
    stats: { uses: 11200, likes: 876, views: 43000 },
    tags: ['claude', 'ai', 'coding'],
    isPremium: false,
    isFeatured: true,
    createdAt: 'Jan 24, 2026',
  },
  {
    id: 'tmpl_11',
    name: 'Instagram Story Promo',
    description: 'Engaging Instagram story mockup for product promotions and sales.',
    category: 'social',
    platform: 'Instagram',
    author: { name: 'Insta Pro', verified: true },
    stats: { uses: 14560, likes: 1567, views: 67000 },
    tags: ['instagram', 'story', 'promo'],
    isPremium: true,
    isFeatured: false,
    createdAt: 'Jan 26, 2026',
  },
  {
    id: 'tmpl_12',
    name: 'Meeting Reminder',
    description: 'Professional meeting reminder notification template for business apps.',
    category: 'notification',
    platform: 'Android',
    author: { name: 'Productivity Plus', verified: false },
    stats: { uses: 3890, likes: 198, views: 12000 },
    tags: ['meeting', 'reminder', 'android'],
    isPremium: false,
    isFeatured: false,
    createdAt: 'Jan 28, 2026',
  },
];

const categories = [
  { id: 'all', label: 'All Templates', icon: '📚' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'ai', label: 'AI Assistants', icon: '🤖' },
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

type TemplateCardProps = {
  template: Template;
};

function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <div className="flex h-full items-center justify-center">
          <span className="text-4xl opacity-50">
            {categories.find(c => c.id === template.category)?.icon || '📄'}
          </span>
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.isFeatured && (
            <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-medium text-white">
              Featured
            </span>
          )}
          {template.isPremium && (
            <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-0.5 text-xs font-medium text-white">
              Premium
            </span>
          )}
        </div>
        {/* Platform Badge */}
        <div className="absolute right-3 bottom-3 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {template.platform}
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Use Template
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {template.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {template.description}
        </p>

        {/* Author */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
            {template.author.name.charAt(0)}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{template.author.name}</span>
          {template.author.verified && (
            <svg className="size-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {formatNumber(template.stats.uses)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {formatNumber(template.stats.likes)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {formatNumber(template.stats.views)}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
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

export default function TemplateShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'trending'>('popular');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch
      = template.name.toLowerCase().includes(searchQuery.toLowerCase())
        || template.description.toLowerCase().includes(searchQuery.toLowerCase())
        || template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPremium = !showPremiumOnly || template.isPremium;
    return matchesCategory && matchesSearch && matchesPremium;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.uses - a.stats.uses;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'trending':
        return b.stats.likes - a.stats.likes;
      default:
        return 0;
    }
  });

  const featuredTemplates = templates.filter(t => t.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Template Gallery</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Browse thousands of professionally designed mockup templates. Start creating stunning mockups in seconds.
          </p>

          {/* Search Bar */}
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
                placeholder="Search templates by name, category, or tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-0 bg-white/10 py-4 pr-4 pl-12 text-white placeholder-blue-200 backdrop-blur-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex justify-center gap-8 text-sm">
            <div>
              <div className="text-2xl font-bold">
                {templates.length * 100}
                +
              </div>
              <div className="text-blue-200">Templates</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatNumber(templates.reduce((acc, t) => acc + t.stats.uses, 0))}</div>
              <div className="text-blue-200">Uses</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-blue-200">Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Templates</h2>
              <Link href="#all" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredTemplates.slice(0, 4).map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="all">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-64">
            <div className="sticky top-4 space-y-6">
              {/* Categories */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Filters</h3>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPremiumOnly}
                    onChange={e => setShowPremiumOnly(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Premium only</span>
                </label>
              </div>

              {/* CTA */}
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white">
                <h3 className="font-semibold">Create Your Own</h3>
                <p className="mt-1 text-sm text-blue-100">
                  Start from scratch and design your perfect mockup.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-3 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Template Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {sortedTemplates.length}
                {' '}
                templates found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'popular' | 'recent' | 'trending')}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="recent">Most Recent</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sortedTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {sortedTemplates.length === 0 && (
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No templates found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Load More */}
            {sortedTemplates.length > 0 && (
              <div className="mt-8 text-center">
                <button className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  Load More Templates
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Template CTA */}
      <div className="border-t border-gray-200 bg-gray-100 px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Your Templates</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Created an amazing mockup template? Share it with the community and help others create stunning designs.
          </p>
          <button className="mt-6 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700">
            Submit Your Template
          </button>
        </div>
      </div>
    </div>
  );
}
