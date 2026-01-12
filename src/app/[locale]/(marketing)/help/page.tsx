'use client';

import Link from 'next/link';
import { useState } from 'react';

type HelpArticle = {
  id: string;
  title: string;
  description: string;
  category: string;
  slug: string;
  views: number;
};

type HelpCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
};

const categories: HelpCategory[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of MockFlow and create your first mockup',
    icon: '🚀',
    articleCount: 8,
  },
  {
    id: 'chat-mockups',
    name: 'Chat Mockups',
    description: 'Create WhatsApp, iMessage, Slack, and other chat mockups',
    icon: '💬',
    articleCount: 12,
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Design LinkedIn, Instagram, Twitter, and other social posts',
    icon: '📱',
    articleCount: 10,
  },
  {
    id: 'ai-mockups',
    name: 'AI Chat Mockups',
    description: 'Build ChatGPT, Claude, and other AI interface mockups',
    icon: '🤖',
    articleCount: 6,
  },
  {
    id: 'export',
    name: 'Export & Download',
    description: 'Export your mockups in various formats and resolutions',
    icon: '📤',
    articleCount: 5,
  },
  {
    id: 'account',
    name: 'Account & Billing',
    description: 'Manage your account, subscription, and payment methods',
    icon: '👤',
    articleCount: 7,
  },
  {
    id: 'team',
    name: 'Team & Collaboration',
    description: 'Work with your team using shared workspaces and comments',
    icon: '👥',
    articleCount: 6,
  },
  {
    id: 'api',
    name: 'API & Integrations',
    description: 'Connect MockFlow with other tools and automate workflows',
    icon: '🔌',
    articleCount: 4,
  },
];

const popularArticles: HelpArticle[] = [
  {
    id: 'art_1',
    title: 'How to create your first mockup',
    description: 'Step-by-step guide to creating a professional mockup in minutes',
    category: 'Getting Started',
    slug: 'create-first-mockup',
    views: 15420,
  },
  {
    id: 'art_2',
    title: 'Exporting mockups as PNG, JPG, or PDF',
    description: 'Learn about all export options and best practices',
    category: 'Export & Download',
    slug: 'export-options',
    views: 12300,
  },
  {
    id: 'art_3',
    title: 'Creating realistic WhatsApp conversations',
    description: 'Tips for making WhatsApp mockups look authentic',
    category: 'Chat Mockups',
    slug: 'whatsapp-mockups',
    views: 9870,
  },
  {
    id: 'art_4',
    title: 'Adding team members to your workspace',
    description: 'Invite colleagues and collaborate on mockups',
    category: 'Team & Collaboration',
    slug: 'add-team-members',
    views: 7650,
  },
  {
    id: 'art_5',
    title: 'Upgrading to Pro or Team plan',
    description: 'Compare plans and upgrade your subscription',
    category: 'Account & Billing',
    slug: 'upgrade-plan',
    views: 6430,
  },
  {
    id: 'art_6',
    title: 'Using device frames for mockups',
    description: 'Add iPhone, Android, or desktop frames to your exports',
    category: 'Export & Download',
    slug: 'device-frames',
    views: 5890,
  },
];

type ArticleCardProps = {
  article: HelpArticle;
};

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/help/${article.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
    >
      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {article.title}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{article.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{article.category}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {article.views.toLocaleString()}
          {' '}
          views
        </span>
      </div>
    </Link>
  );
}

type CategoryCardProps = {
  category: HelpCategory;
};

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/help/category/${category.id}`}
      className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
    >
      <div className="mb-4 text-4xl">{category.icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {category.name}
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {category.articleCount}
        {' '}
        articles
      </span>
    </Link>
  );
}

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = popularArticles.filter(
    article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
      || article.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Help Center</h1>
          <p className="mt-4 text-lg text-blue-100">
            Find answers to your questions and learn how to get the most out of MockFlow
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
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-0 bg-white py-4 pr-4 pl-12 text-gray-900 shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Documentation
            </Link>
            <Link
              href="/blog"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Blog & Tutorials
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="border-b border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Search Results (
              {filteredArticles.length}
              )
            </h2>
            {filteredArticles.length > 0
              ? (
                  <div className="space-y-3">
                    {filteredArticles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )
              : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
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
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No results found</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Try different keywords or browse our categories below.
                    </p>
                  </div>
                )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Popular Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support CTA */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Still need help?</h2>
              <p className="mt-4 text-gray-300">
                Our support team is available to help you with any questions or issues. We typically respond within 24 hours.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row md:justify-end">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-6 py-3 text-center font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@mockflow.com"
                className="rounded-lg border border-white/30 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-white/10"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Tutorials</h2>
            <Link href="/docs#videos" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View all videos
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Getting Started with MockFlow', duration: '4:32' },
              { title: 'Creating Chat Mockups', duration: '8:15' },
              { title: 'Export Options Explained', duration: '6:20' },
            ].map((video, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-indigo-600">
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-full bg-white/90 p-4 transition-transform group-hover:scale-110">
                      <svg className="size-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute right-2 bottom-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status & Updates */}
      <div className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* System Status */}
            <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
                <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <span className="size-2 rounded-full bg-green-500" />
                  All Systems Operational
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All MockFlow services are running normally. Last checked 2 minutes ago.
              </p>
              <Link
                href="/status"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                View status page
              </Link>
            </div>

            {/* Latest Updates */}
            <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Updates</h3>
                <Link href="/changelog" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View changelog
                </Link>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    New
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Pinterest mockups now available</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Jan 10, 2026</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Improved
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Faster export performance</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Jan 8, 2026</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
