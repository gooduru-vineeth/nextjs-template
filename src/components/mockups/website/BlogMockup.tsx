'use client';

import {
  ArrowLeft,
  Bookmark,
  Clock,
  Copy,
  Facebook,
  FileText,
  Heart,
  Linkedin,
  Menu,
  MessageCircle,
  Search,
  Tag,
  ThumbsUp,
  Twitter,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type BlogStyle = 'modern' | 'classic' | 'minimal' | 'magazine' | 'technical';
type LayoutType = 'single' | 'grid' | 'list' | 'masonry';
type ColorScheme = 'light' | 'dark' | 'custom';

type Author = {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  role: string;
  socialLinks?: { platform: string; url: string }[];
};

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Author;
  publishedAt: Date;
  readTime: number;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
};

type Comment = {
  id: string;
  author: Author;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
};

type BlogConfig = {
  style: BlogStyle;
  layout: LayoutType;
  colorScheme: ColorScheme;
  primaryColor: string;
  blogName: string;
  tagline: string;
  posts: BlogPost[];
  categories: string[];
  showRelatedPosts: boolean;
  showAuthorBio: boolean;
  showComments: boolean;
  showTableOfContents: boolean;
  showShareButtons: boolean;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type BlogMockupProps = {
  variant?: Variant;
  config?: Partial<BlogConfig>;
  onConfigChange?: (config: BlogConfig) => void;
  className?: string;
};

// Default author
const defaultAuthor: Author = {
  id: '1',
  name: 'Alex Thompson',
  bio: 'Senior Developer and Tech Writer with 10+ years of experience building scalable applications.',
  role: 'Senior Developer',
  socialLinks: [
    { platform: 'twitter', url: '#' },
    { platform: 'linkedin', url: '#' },
  ],
};

// Default posts
const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications in 2025',
    excerpt: 'Learn the best practices for building large-scale React applications that perform well and are maintainable.',
    content: `
## Introduction

Building scalable React applications requires careful consideration of architecture, state management, and performance optimization.

## Key Principles

### 1. Component Architecture

Design your components with reusability in mind. Use composition over inheritance.

### 2. State Management

Choose the right state management solution for your needs - Context API for simple cases, or Redux/Zustand for complex applications.

### 3. Performance Optimization

Implement lazy loading, memoization, and code splitting to ensure your application stays fast as it grows.

## Conclusion

By following these principles, you can build React applications that scale gracefully and remain maintainable over time.
    `,
    author: defaultAuthor,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readTime: 8,
    category: 'Development',
    tags: ['React', 'JavaScript', 'Architecture'],
    likes: 342,
    comments: 48,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    title: 'The Future of AI in Software Development',
    excerpt: 'Exploring how artificial intelligence is transforming the way we write, test, and deploy code.',
    content: 'Full article content here...',
    author: { ...defaultAuthor, id: '2', name: 'Sarah Chen', role: 'AI Researcher' },
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    readTime: 12,
    category: 'AI',
    tags: ['AI', 'Machine Learning', 'Future Tech'],
    likes: 567,
    comments: 89,
  },
  {
    id: '3',
    title: 'Mastering TypeScript: Advanced Patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns that will level up your code quality.',
    content: 'Full article content here...',
    author: defaultAuthor,
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: 15,
    category: 'TypeScript',
    tags: ['TypeScript', 'Types', 'Best Practices'],
    likes: 234,
    comments: 31,
  },
];

// Default comments
const defaultComments: Comment[] = [
  {
    id: '1',
    author: { id: '3', name: 'Mike Johnson', bio: '', role: 'Full Stack Developer' },
    content: 'Great article! The section on state management was particularly helpful.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 12,
    replies: [
      {
        id: '1a',
        author: defaultAuthor,
        content: 'Thanks Mike! Glad you found it useful.',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
        likes: 3,
      },
    ],
  },
  {
    id: '2',
    author: { id: '4', name: 'Emily Davis', bio: '', role: 'Frontend Engineer' },
    content: 'Would love to see more examples of the code splitting patterns mentioned.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 8,
  },
];

const defaultConfig: BlogConfig = {
  style: 'modern',
  layout: 'single',
  colorScheme: 'light',
  primaryColor: '#3B82F6',
  blogName: 'TechBlog',
  tagline: 'Insights for Modern Developers',
  posts: defaultPosts,
  categories: ['Development', 'AI', 'TypeScript', 'Design', 'Career'],
  showRelatedPosts: true,
  showAuthorBio: true,
  showComments: true,
  showTableOfContents: true,
  showShareButtons: true,
};

// Social icons mapping
const socialIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
};

export function BlogMockup({
  variant = 'full',
  config: initialConfig,
  onConfigChange,
  className = '',
}: BlogMockupProps) {
  const [config, setConfig] = useState<BlogConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [selectedPost, setSelectedPost] = useState<string | null>(config.posts[0]?.id ?? null);
  const [comments] = useState<Comment[]>(defaultComments);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const updateConfig = useCallback((updates: Partial<BlogConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  const isDark = config.colorScheme === 'dark';
  const currentPost = config.posts.find(p => p.id === selectedPost);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Render Header
  const renderHeader = () => (
    <header className={`sticky top-0 z-50 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} border-b`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6" style={{ color: config.primaryColor }} />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {config.blogName}
              </span>
            </div>
            <nav className="hidden items-center space-x-6 md:flex">
              {config.categories.slice(0, 5).map(category => (
                <a
                  key={category}
                  href="#"
                  className={`text-sm font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  {category}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className={`rounded-lg p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <Search className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            <button
              className="p-2 md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className={`h-5 w-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            </button>
            <button
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-white md:flex"
              style={{ backgroundColor: config.primaryColor }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Render Post Card
  const renderPostCard = (post: BlogPost, size: 'large' | 'medium' | 'small' = 'medium') => (
    <article
      key={post.id}
      onClick={() => setSelectedPost(post.id)}
      className={`group cursor-pointer ${size === 'large' ? 'col-span-2' : ''}`}
    >
      {/* Featured Image */}
      <div className={`${size === 'large' ? 'aspect-[2/1]' : 'aspect-video'} mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-500`}>
        <div className="flex h-full w-full items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-medium text-white">Read Article</span>
        </div>
      </div>

      {/* Category */}
      <div className="mb-2 flex items-center space-x-2">
        <span
          className="text-xs font-semibold tracking-wide uppercase"
          style={{ color: config.primaryColor }}
        >
          {post.category}
        </span>
        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {post.readTime}
          {' '}
          min read
        </span>
      </div>

      {/* Title */}
      <h3 className={`mb-2 font-bold group-hover:underline ${size === 'large' ? 'text-2xl' : 'text-lg'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className={`mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {post.excerpt}
      </p>

      {/* Author & Date */}
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-medium text-white">
          {post.author.name.charAt(0)}
        </div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {post.author.name}
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {formatDate(post.publishedAt)}
          </p>
        </div>
      </div>
    </article>
  );

  // Render Single Post View
  const renderSinglePost = () => {
    if (!currentPost) {
      return null;
    }

    return (
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPost(null)}
          className={`mb-8 flex items-center space-x-2 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to posts</span>
        </button>

        {/* Category & Read Time */}
        <div className="mb-4 flex items-center space-x-3">
          <span
            className="rounded-full px-3 py-1 text-sm font-medium text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            {currentPost.category}
          </span>
          <span className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Clock className="mr-1 h-4 w-4" />
            {currentPost.readTime}
            {' '}
            min read
          </span>
        </div>

        {/* Title */}
        <h1 className={`mb-6 text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {currentPost.title}
        </h1>

        {/* Author Info */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-8 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
              {currentPost.author.name.charAt(0)}
            </div>
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentPost.author.name}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(currentPost.publishedAt)}
              </p>
            </div>
          </div>
          {config.showShareButtons && (
            <div className="flex items-center space-x-2">
              {Object.entries(socialIcons).map(([platform, icon]) => (
                <button
                  key={platform}
                  className={`rounded-lg p-2 ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                >
                  {icon}
                </button>
              ))}
              <button className={`rounded-lg p-2 ${isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <Copy className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="mb-8 aspect-video rounded-xl bg-gradient-to-br from-blue-500 to-purple-500" />

        {/* Content */}
        <div className={`prose ${isDark ? 'prose-invert' : ''} mb-12 max-w-none`}>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentPost.content}
          </p>
        </div>

        {/* Tags */}
        <div className="mb-8 flex flex-wrap gap-2">
          {currentPost.tags.map(tag => (
            <span
              key={tag}
              className={`flex items-center space-x-1 rounded-full px-3 py-1 text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>

        {/* Engagement Bar */}
        <div className={`flex items-center justify-between border-y py-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-6">
            <button className={`flex items-center space-x-2 ${currentPost.isLiked ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Heart className={`h-5 w-5 ${currentPost.isLiked ? 'fill-current' : ''}`} />
              <span>{currentPost.likes}</span>
            </button>
            <button className={`flex items-center space-x-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <MessageCircle className="h-5 w-5" />
              <span>{currentPost.comments}</span>
            </button>
          </div>
          <button className={`flex items-center space-x-2 ${currentPost.isSaved ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Bookmark className={`h-5 w-5 ${currentPost.isSaved ? 'fill-current' : ''}`} />
            <span>Save</span>
          </button>
        </div>

        {/* Author Bio */}
        {config.showAuthorBio && (
          <div className={`mt-8 rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-start space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-semibold text-white">
                {currentPost.author.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Written by
                  {' '}
                  {currentPost.author.name}
                </p>
                <p className={`mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentPost.author.role}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentPost.author.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {config.showComments && (
          <div className="mt-12">
            <h3 className={`mb-6 text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Comments (
              {comments.length}
              )
            </h3>
            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-sm font-medium text-white">
                      {comment.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center space-x-2">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {comment.author.name}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className={`mb-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4">
                        <button className={`flex items-center space-x-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-13 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-medium text-white">
                            {reply.author.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center space-x-2">
                              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {reply.author.name}
                              </span>
                              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  };

  // Render Post Grid
  const renderPostGrid = () => (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {config.posts.map((post, index) => renderPostCard(post, index === 0 ? 'large' : 'medium'))}
      </div>
    </div>
  );

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{config.blogName}</span>
          </div>
          <div className="space-y-3">
            {config.posts.slice(0, 3).map(post => (
              <div key={post.id} className={`rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(post.publishedAt)}
                  {' '}
                  •
                  {post.readTime}
                  {' '}
                  min
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border p-4 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <FileText className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Blog Mockup</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="text-center text-white">
            <FileText className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">{config.blogName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {config.blogName}
            </span>
          </div>
          <select
            className={`rounded-lg border px-3 py-1 text-sm ${isDark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            value={config.style}
            onChange={e => updateConfig({ style: e.target.value as BlogStyle })}
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="magazine">Magazine</option>
            <option value="technical">Technical</option>
          </select>
        </div>
        <div className="h-[400px] overflow-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {config.posts.slice(0, 4).map(post => (
              <div key={post.id} className={`rounded-lg border p-3 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <div className="mb-2 aspect-video rounded bg-gradient-to-br from-blue-500 to-purple-500" />
                <p className={`line-clamp-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {post.readTime}
                  {' '}
                  min •
                  {post.likes}
                  {' '}
                  likes
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} ${className}`}>
      {renderHeader()}
      {selectedPost ? renderSinglePost() : renderPostGrid()}
    </div>
  );
}

export default BlogMockup;
