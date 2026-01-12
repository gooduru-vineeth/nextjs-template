'use client';

import Link from 'next/link';
import { useState } from 'react';

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  category: 'tutorials' | 'updates' | 'tips' | 'case-studies' | 'announcements';
  tags: string[];
  thumbnail?: string;
  readTime: number;
  publishedAt: string;
  isFeatured: boolean;
  views: number;
};

const blogPosts: BlogPost[] = [
  {
    id: 'post_1',
    slug: 'getting-started-with-mockflow',
    title: 'Getting Started with MockFlow: A Complete Guide',
    excerpt: 'Learn how to create stunning chat mockups in minutes. This comprehensive guide covers everything from basic setup to advanced features.',
    author: { name: 'MockFlow Team', role: 'Product Team' },
    category: 'tutorials',
    tags: ['beginner', 'guide', 'mockups'],
    readTime: 8,
    publishedAt: 'Jan 20, 2026',
    isFeatured: true,
    views: 15420,
  },
  {
    id: 'post_2',
    slug: 'mockflow-2-0-release',
    title: 'MockFlow 2.0: New Features and Improvements',
    excerpt: 'We are excited to announce MockFlow 2.0 with AI-powered mockup generation, new social media templates, and improved export options.',
    author: { name: 'Sarah Chen', role: 'CEO' },
    category: 'announcements',
    tags: ['release', 'features', 'update'],
    readTime: 5,
    publishedAt: 'Jan 18, 2026',
    isFeatured: true,
    views: 28900,
  },
  {
    id: 'post_3',
    slug: 'designing-realistic-whatsapp-mockups',
    title: 'Designing Realistic WhatsApp Mockups',
    excerpt: 'Tips and tricks for creating WhatsApp conversation mockups that look authentic, including status indicators, typing animations, and more.',
    author: { name: 'Design Team', role: 'Design' },
    category: 'tips',
    tags: ['whatsapp', 'design', 'realism'],
    readTime: 6,
    publishedAt: 'Jan 15, 2026',
    isFeatured: false,
    views: 9870,
  },
  {
    id: 'post_4',
    slug: 'how-acme-corp-uses-mockflow',
    title: 'How Acme Corp Increased Conversions by 40% Using MockFlow',
    excerpt: 'A deep dive into how Acme Corp transformed their marketing strategy using chat mockups for social proof and testimonials.',
    author: { name: 'Marketing Team', role: 'Marketing' },
    category: 'case-studies',
    tags: ['case-study', 'marketing', 'success'],
    readTime: 10,
    publishedAt: 'Jan 12, 2026',
    isFeatured: true,
    views: 12340,
  },
  {
    id: 'post_5',
    slug: 'ai-chat-mockups-best-practices',
    title: 'Creating AI Chat Mockups: Best Practices',
    excerpt: 'Learn how to create realistic ChatGPT, Claude, and Gemini mockups with proper formatting, code blocks, and markdown rendering.',
    author: { name: 'Alex Rivera', role: 'Content Lead' },
    category: 'tutorials',
    tags: ['ai', 'chatgpt', 'claude'],
    readTime: 7,
    publishedAt: 'Jan 10, 2026',
    isFeatured: false,
    views: 8560,
  },
  {
    id: 'post_6',
    slug: 'mockflow-api-introduction',
    title: 'Introducing the MockFlow API',
    excerpt: 'Automate your mockup creation with our new API. Generate thousands of mockups programmatically for your marketing campaigns.',
    author: { name: 'Engineering Team', role: 'Engineering' },
    category: 'updates',
    tags: ['api', 'automation', 'developers'],
    readTime: 12,
    publishedAt: 'Jan 8, 2026',
    isFeatured: false,
    views: 6780,
  },
  {
    id: 'post_7',
    slug: 'social-media-mockup-strategies',
    title: '10 Social Media Mockup Strategies That Work',
    excerpt: 'Discover proven strategies for using social media mockups in your marketing campaigns, from testimonials to product announcements.',
    author: { name: 'Marketing Team', role: 'Marketing' },
    category: 'tips',
    tags: ['social-media', 'marketing', 'strategies'],
    readTime: 9,
    publishedAt: 'Jan 5, 2026',
    isFeatured: false,
    views: 11230,
  },
  {
    id: 'post_8',
    slug: 'mockflow-for-educators',
    title: 'Using MockFlow in Education: A Teacher Guide',
    excerpt: 'How educators are using MockFlow to create engaging educational content and teach digital literacy to students.',
    author: { name: 'Community Team', role: 'Community' },
    category: 'case-studies',
    tags: ['education', 'teachers', 'students'],
    readTime: 8,
    publishedAt: 'Jan 2, 2026',
    isFeatured: false,
    views: 4560,
  },
];

const categories = [
  { id: 'all', label: 'All Posts', icon: '📚' },
  { id: 'tutorials', label: 'Tutorials', icon: '📖' },
  { id: 'updates', label: 'Updates', icon: '🚀' },
  { id: 'tips', label: 'Tips & Tricks', icon: '💡' },
  { id: 'case-studies', label: 'Case Studies', icon: '📊' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
];

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

function BlogCard({ post, featured = false }: BlogCardProps) {
  const categoryInfo = categories.find(c => c.id === post.category);

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-xl md:grid-cols-2 dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Thumbnail */}
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-500 to-indigo-600 md:aspect-auto">
          <div className="flex h-full items-center justify-center p-8">
            <span className="text-7xl opacity-50">{categoryInfo?.icon || '📄'}</span>
          </div>
        </div>
        {/* Content */}
        <div className="flex flex-col justify-center p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {categoryInfo?.label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {post.readTime}
              {' '}
              min read
            </span>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {post.title}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">{post.excerpt}</p>
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{post.author.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{post.publishedAt}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <div className="flex h-full items-center justify-center">
          <span className="text-4xl opacity-50">{categoryInfo?.icon || '📄'}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {categoryInfo?.label}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {post.readTime}
            {' '}
            min read
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {post.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{post.publishedAt}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch
      = post.title.toLowerCase().includes(searchQuery.toLowerCase())
        || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        || post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.isFeatured);
  const regularPosts = filteredPosts.filter(post => !post.isFeatured || selectedCategory !== 'all');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">MockFlow Blog</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Tutorials, tips, and updates to help you create amazing mockups
            </p>
          </div>

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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {selectedCategory === 'all' && featuredPosts.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-100 px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Featured Articles</h2>
            <div className="space-y-6">
              {featuredPosts.slice(0, 2).map(post => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Posts Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedCategory === 'all' ? 'Latest Articles' : categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredPosts.length}
                {' '}
                articles
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {(selectedCategory === 'all' ? regularPosts : filteredPosts).map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
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
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No articles found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or category filter.
                </p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="mt-8 text-center">
                <button className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full shrink-0 lg:w-80">
            <div className="sticky top-4 space-y-6">
              {/* Newsletter */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">Subscribe to Newsletter</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Get the latest tutorials and updates delivered to your inbox.
                </p>
                <form className="mt-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Popular Tags */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['tutorials', 'whatsapp', 'ai', 'marketing', 'tips', 'api', 'design', 'social-media'].map(tag => (
                    <span
                      key={tag}
                      className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    >
                      #
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Most Read */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Most Read</h3>
                <div className="space-y-4">
                  {blogPosts
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((post, index) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="group flex items-start gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          {index + 1}
                        </span>
                        <div>
                          <p className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                            {post.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {formatNumber(post.views)}
                            {' '}
                            views
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                <h3 className="font-semibold">Start Creating</h3>
                <p className="mt-2 text-sm text-blue-100">
                  Ready to create your first mockup? Get started for free.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Try MockFlow Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
