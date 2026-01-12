'use client';

import {
  ArrowLeft,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Facebook,
  Heart,
  Link2,
  Linkedin,
  MessageSquare,
  Share2,
  Tag,
  Twitter,
  User,
} from 'lucide-react';

export type BlogAuthor = {
  name: string;
  avatar?: string;
  bio?: string;
  twitter?: string;
};

export type BlogPost = {
  title: string;
  subtitle?: string;
  content: string;
  featuredImage?: string;
  author: BlogAuthor;
  publishedAt: string;
  readTime: string;
  category?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
};

export type RelatedPost = {
  id: string;
  title: string;
  thumbnail?: string;
  author: string;
  readTime: string;
};

export type BlogPostMockupProps = {
  post: BlogPost;
  relatedPosts?: RelatedPost[];
  variant?: 'full' | 'compact' | 'card' | 'minimal' | 'featured';
  showSidebar?: boolean;
  showComments?: boolean;
  showRelated?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function BlogPostMockup({
  post,
  relatedPosts = [],
  variant = 'full',
  showSidebar = false,
  showRelated = true,
  darkMode = false,
  className = '',
}: BlogPostMockupProps) {
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`${bgColor} overflow-hidden rounded-xl border ${borderColor} cursor-pointer transition-shadow hover:shadow-lg ${className}`}>
        {post.featuredImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <div className="p-5">
          {post.category && (
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
              {post.category}
            </span>
          )}
          <h3 className={`text-lg font-bold ${textColor} mt-2 line-clamp-2`}>{post.title}</h3>
          {post.subtitle && (
            <p className={`${mutedColor} mt-2 line-clamp-2 text-sm`}>{post.subtitle}</p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">
              {post.author.avatar
                ? (
                    <img src={post.author.avatar} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
                  )
                : (
                    post.author.name.charAt(0)
                  )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor}`}>{post.author.name}</p>
              <p className={`text-xs ${mutedColor}`}>
                {post.publishedAt}
                {' '}
                ·
                {' '}
                {post.readTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        {post.featuredImage
          ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-96 w-full object-cover"
              />
            )
          : (
              <div className="h-96 w-full bg-gradient-to-br from-blue-600 to-purple-600" />
            )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-8">
          {post.category && (
            <span className="mb-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur">
              {post.category}
            </span>
          )}
          <h2 className="mb-3 text-3xl font-bold text-white">{post.title}</h2>
          {post.subtitle && (
            <p className="mb-4 line-clamp-2 text-lg text-white/80">{post.subtitle}</p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur">
                {post.author.avatar
                  ? (
                      <img src={post.author.avatar} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
                    )
                  : (
                      <User size={20} />
                    )}
              </div>
              <span className="font-medium text-white">{post.author.name}</span>
            </div>
            <span className="text-white/60">·</span>
            <span className="text-white/80">{post.publishedAt}</span>
            <span className="text-white/60">·</span>
            <span className="text-white/80">{post.readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <article className={`${bgColor} ${className}`}>
        <header className="mb-8">
          <h1 className={`text-3xl font-bold md:text-4xl ${textColor} mb-4`}>{post.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className={mutedColor}>{post.author.name}</span>
            <span className={mutedColor}>·</span>
            <span className={mutedColor}>{post.publishedAt}</span>
            <span className={mutedColor}>·</span>
            <span className={mutedColor}>{post.readTime}</span>
          </div>
        </header>
        <div className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
          <div className={textColor} dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex gap-4 p-4 ${bgColor} rounded-xl border ${borderColor} ${className}`}>
        {post.featuredImage && (
          <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {post.category && (
            <span className="text-xs font-semibold text-blue-600 uppercase dark:text-blue-400">
              {post.category}
            </span>
          )}
          <h3 className={`font-bold ${textColor} line-clamp-2`}>{post.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className={mutedColor}>{post.author.name}</span>
            <span className={mutedColor}>·</span>
            <span className={mutedColor}>{post.readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${bgColor} min-h-screen ${className}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-10 ${bgColor} border-b ${borderColor}`}>
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <button className={`flex items-center gap-2 ${mutedColor} hover:${textColor}`}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-3">
            <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${mutedColor}`}>
              <Share2 size={18} />
            </button>
            <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${post.isBookmarked ? 'text-blue-500' : mutedColor}`}>
              <Bookmark size={18} fill={post.isBookmarked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Main Content */}
        <main className={`mx-auto max-w-4xl flex-1 px-4 py-8 ${showSidebar ? 'lg:mr-80' : ''}`}>
          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {post.category}
              </span>
            )}
            <h1 className={`text-3xl font-bold md:text-4xl lg:text-5xl ${textColor} mb-4 leading-tight`}>
              {post.title}
            </h1>
            {post.subtitle && (
              <p className={`text-xl ${mutedColor} mb-6`}>{post.subtitle}</p>
            )}

            {/* Author & Meta */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-medium text-white">
                  {post.author.avatar
                    ? (
                        <img src={post.author.avatar} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
                      )
                    : (
                        post.author.name.charAt(0)
                      )}
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>{post.author.name}</p>
                  {post.author.bio && (
                    <p className={`text-sm ${mutedColor}`}>{post.author.bio}</p>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-4 text-sm ${mutedColor}`}>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="h-auto w-full"
              />
            </div>
          )}

          {/* Content */}
          <article className={`prose ${darkMode ? 'prose-invert' : ''} prose-lg mb-8 max-w-none`}>
            <div className={textColor} dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b ${borderColor}">
              <Tag size={16} className={mutedColor} />
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} cursor-pointer rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Engagement */}
          <div className={`flex items-center justify-between border-y py-4 ${borderColor} mb-8`}>
            <div className="flex items-center gap-6">
              <button className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : mutedColor} hover:text-red-500`}>
                <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes || 0}</span>
              </button>
              <button className={`flex items-center gap-2 ${mutedColor} hover:${textColor}`}>
                <MessageSquare size={20} />
                <span>{post.comments || 0}</span>
              </button>
            </div>

            {/* Share */}
            <div className="flex items-center gap-2">
              <span className={`text-sm ${mutedColor}`}>Share:</span>
              <button className="rounded-full p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                <Twitter size={18} />
              </button>
              <button className="rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                <Facebook size={18} />
              </button>
              <button className="rounded-full p-2 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                <Linkedin size={18} />
              </button>
              <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${mutedColor}`}>
                <Link2 size={18} />
              </button>
            </div>
          </div>

          {/* Author Bio */}
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} mb-8`}>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-medium text-white">
                {post.author.avatar
                  ? (
                      <img src={post.author.avatar} alt={post.author.name} className="h-full w-full rounded-full object-cover" />
                    )
                  : (
                      post.author.name.charAt(0)
                    )}
              </div>
              <div>
                <p className={`text-sm ${mutedColor} mb-1 tracking-wider uppercase`}>Written by</p>
                <h3 className={`text-lg font-bold ${textColor}`}>{post.author.name}</h3>
                {post.author.bio && (
                  <p className={`${mutedColor} mt-2`}>{post.author.bio}</p>
                )}
                {post.author.twitter && (
                  <a href={`https://twitter.com/${post.author.twitter}`} className="mt-2 inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
                    <Twitter size={14} />
                    @
                    {post.author.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {showRelated && relatedPosts.length > 0 && (
            <section>
              <h2 className={`text-xl font-bold ${textColor} mb-4`}>Related Posts</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedPosts.map(related => (
                  <div
                    key={related.id}
                    className={`flex gap-4 rounded-xl border p-4 ${borderColor} cursor-pointer transition-shadow hover:shadow-md`}
                  >
                    {related.thumbnail && (
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={related.thumbnail}
                          alt={related.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-medium ${textColor} line-clamp-2`}>{related.title}</h3>
                      <p className={`text-sm ${mutedColor} mt-1`}>
                        {related.author}
                        {' '}
                        ·
                        {related.readTime}
                      </p>
                    </div>
                    <ChevronRight size={18} className={mutedColor} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        {showSidebar && (
          <aside className={`fixed top-16 right-0 bottom-0 hidden w-80 border-l p-6 lg:block ${borderColor} overflow-y-auto`}>
            <div className="space-y-6">
              {/* Table of Contents */}
              <div>
                <h3 className={`text-sm font-semibold ${textColor} mb-3 tracking-wider uppercase`}>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {['Introduction', 'Getting Started', 'Key Features', 'Conclusion'].map((item, index) => (
                    <a
                      key={index}
                      href={`#section-${index}`}
                      className={`block text-sm ${mutedColor} hover:${textColor} transition-all hover:pl-2`}
                    >
                      {item}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Newsletter */}
              <div className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold ${textColor} mb-2`}>Subscribe</h3>
                <p className={`text-sm ${mutedColor} mb-3`}>Get the latest posts delivered right to your inbox.</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                />
                <button className="w-full rounded-lg bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-600">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
