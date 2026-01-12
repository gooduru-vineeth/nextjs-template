'use client';

import {
  Bookmark,
  CheckCircle,
  Eye,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Plus,
  Search,
  Tag,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ThreadStatus = 'open' | 'resolved' | 'closed' | 'pinned';
type SortOption = 'recent' | 'popular' | 'trending' | 'unanswered';
type ForumVariant = 'full' | 'compact' | 'widget';

type ForumCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  color: string;
};

type ThreadAuthor = {
  id: string;
  name: string;
  avatar?: string;
  role: 'member' | 'moderator' | 'admin' | 'staff';
  reputation: number;
};

type ForumThread = {
  id: string;
  title: string;
  content: string;
  author: ThreadAuthor;
  category: ForumCategory;
  status: ThreadStatus;
  tags: string[];
  createdAt: string;
  lastActivity: string;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  isBookmarked: boolean;
  hasAcceptedAnswer: boolean;
};

type ForumReply = {
  id: string;
  content: string;
  author: ThreadAuthor;
  createdAt: string;
  likeCount: number;
  isAcceptedAnswer: boolean;
};

export type CommunityForumProps = {
  variant?: ForumVariant;
  categories?: ForumCategory[];
  threads?: ForumThread[];
  currentUser?: ThreadAuthor;
  onCreateThread?: (thread: Partial<ForumThread>) => void;
  onReply?: (threadId: string, content: string) => void;
  onLike?: (threadId: string) => void;
  onBookmark?: (threadId: string) => void;
  onReport?: (threadId: string, reason: string) => void;
  className?: string;
};

// Mock data
const mockCategories: ForumCategory[] = [
  { id: '1', name: 'General Discussion', description: 'Chat about anything mockup related', icon: 'chat', threadCount: 245, color: 'blue' },
  { id: '2', name: 'Feature Requests', description: 'Suggest new features', icon: 'lightbulb', threadCount: 128, color: 'purple' },
  { id: '3', name: 'Help & Support', description: 'Get help from the community', icon: 'help', threadCount: 312, color: 'green' },
  { id: '4', name: 'Showcase', description: 'Share your work', icon: 'star', threadCount: 89, color: 'yellow' },
  { id: '5', name: 'Tips & Tutorials', description: 'Learn and teach', icon: 'book', threadCount: 156, color: 'orange' },
];

const mockThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Best practices for iPhone mockup screenshots',
    content: 'Looking for advice on creating professional iPhone mockups...',
    author: { id: '1', name: 'Sarah Designer', role: 'member', reputation: 1250 },
    category: mockCategories[0]!,
    status: 'open',
    tags: ['iphone', 'best-practices', 'screenshots'],
    createdAt: '2024-01-10T10:00:00Z',
    lastActivity: '2024-01-12T14:30:00Z',
    viewCount: 342,
    likeCount: 28,
    replyCount: 15,
    isPinned: true,
    isBookmarked: false,
    hasAcceptedAnswer: false,
  },
  {
    id: '2',
    title: 'How to export mockups in bulk?',
    content: 'Is there a way to export multiple mockups at once?',
    author: { id: '2', name: 'Mike Developer', role: 'member', reputation: 890 },
    category: mockCategories[2]!,
    status: 'resolved',
    tags: ['export', 'bulk', 'workflow'],
    createdAt: '2024-01-11T09:00:00Z',
    lastActivity: '2024-01-11T16:45:00Z',
    viewCount: 156,
    likeCount: 12,
    replyCount: 8,
    isPinned: false,
    isBookmarked: true,
    hasAcceptedAnswer: true,
  },
  {
    id: '3',
    title: 'Feature Request: Dark mode for editor',
    content: 'It would be great to have a dark mode option...',
    author: { id: '3', name: 'Alex UI', role: 'moderator', reputation: 3420 },
    category: mockCategories[1]!,
    status: 'open',
    tags: ['dark-mode', 'editor', 'ui'],
    createdAt: '2024-01-09T15:00:00Z',
    lastActivity: '2024-01-12T10:20:00Z',
    viewCount: 567,
    likeCount: 89,
    replyCount: 34,
    isPinned: true,
    isBookmarked: false,
    hasAcceptedAnswer: false,
  },
  {
    id: '4',
    title: 'My latest app store mockups - feedback welcome!',
    content: 'Just finished these mockups for my new app...',
    author: { id: '4', name: 'Creative Pro', role: 'member', reputation: 2100 },
    category: mockCategories[3]!,
    status: 'open',
    tags: ['showcase', 'app-store', 'feedback'],
    createdAt: '2024-01-12T08:00:00Z',
    lastActivity: '2024-01-12T12:15:00Z',
    viewCount: 234,
    likeCount: 45,
    replyCount: 12,
    isPinned: false,
    isBookmarked: false,
    hasAcceptedAnswer: false,
  },
];

export default function CommunityForum({
  variant = 'full',
  categories = mockCategories,
  threads = mockThreads,
  onCreateThread,
  onReply: _onReply,
  onLike,
  onBookmark,
  onReport: _onReport,
  className = '',
}: CommunityForumProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [_selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  // Suppress unused variable warnings - these are available for future use
  void _onReply;
  void _onReport;
  void _selectedThread;

  const filteredThreads = threads.filter((thread) => {
    const matchesCategory = !selectedCategory || thread.category.id === selectedCategory;
    const matchesSearch = !searchQuery
      || thread.title.toLowerCase().includes(searchQuery.toLowerCase())
      || thread.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) {
      return -1;
    }
    if (!a.isPinned && b.isPinned) {
      return 1;
    }

    switch (sortBy) {
      case 'popular':
        return b.likeCount - a.likeCount;
      case 'trending':
        return b.viewCount - a.viewCount;
      case 'unanswered':
        return a.replyCount - b.replyCount;
      case 'recent':
      default:
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    }
  });

  const handleCreateThread = useCallback(() => {
    if (onCreateThread) {
      onCreateThread({
        title: 'New Thread',
        content: '',
        tags: [],
      });
    }
    setShowNewThreadModal(false);
  }, [onCreateThread]);

  const handleLike = useCallback((threadId: string) => {
    onLike?.(threadId);
  }, [onLike]);

  const handleBookmark = useCallback((threadId: string) => {
    onBookmark?.(threadId);
  }, [onBookmark]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    }
    if (hours > 0) {
      return `${hours}h ago`;
    }
    return 'Just now';
  };

  const getRoleBadge = (role: ThreadAuthor['role']) => {
    switch (role) {
      case 'admin':
        return <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">Admin</span>;
      case 'moderator':
        return <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Mod</span>;
      case 'staff':
        return <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Staff</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ThreadStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            Resolved
          </span>
        );
      case 'closed':
        return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-400">Closed</span>;
      case 'pinned':
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Pin className="h-3 w-3" />
            Pinned
          </span>
        );
      default:
        return null;
    }
  };

  // Widget variant - compact view for sidebar
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <MessageSquare className="h-4 w-4" />
            Community
          </h3>
          <span className="text-xs text-gray-500">
            {threads.length}
            {' '}
            threads
          </span>
        </div>
        <div className="space-y-3">
          {sortedThreads.slice(0, 5).map(thread => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className="w-full rounded p-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <p className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">
                {thread.isPinned && <Pin className="mr-1 inline h-3 w-3 text-yellow-500" />}
                {thread.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {thread.replyCount}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {thread.likeCount}
                </span>
              </div>
            </button>
          ))}
        </div>
        <button className="mt-3 w-full text-sm text-blue-600 hover:underline dark:text-blue-400">
          View all discussions
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Community Forum</h2>
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Thread
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search threads..."
                className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-9 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>
        <div className="max-h-96 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
          {sortedThreads.map(thread => (
            <button
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className="w-full p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {thread.isPinned && <Pin className="h-3 w-3 flex-shrink-0 text-yellow-500" />}
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{thread.title}</p>
                    {thread.hasAcceptedAnswer && <CheckCircle className="h-3 w-3 flex-shrink-0 text-green-500" />}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span>{thread.author.name}</span>
                    <span>{formatTimeAgo(thread.lastActivity)}</span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {thread.replyCount}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Community Forum</h2>
            <p className="mt-1 text-sm text-gray-500">Connect, learn, and share with other designers</p>
          </div>
          <button
            onClick={() => setShowNewThreadModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Thread
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search threads, tags, or topics..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory || ''}
              onChange={e => setSelectedCategory(e.target.value || null)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
              !selectedCategory
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All (
            {threads.length}
            )
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {cat.name}
              {' '}
              (
              {cat.threadCount}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {sortedThreads.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No threads found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          sortedThreads.map(thread => (
            <div
              key={thread.id}
              className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex items-start gap-4">
                {/* Author avatar */}
                <div className="flex-shrink-0">
                  {thread.author.avatar
                    ? (
                        <img src={thread.author.avatar} alt={thread.author.name} className="h-10 w-10 rounded-full" />
                      )
                    : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                </div>

                {/* Thread content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {thread.isPinned && (
                          <Pin className="h-4 w-4 text-yellow-500" />
                        )}
                        <button
                          onClick={() => setSelectedThread(thread)}
                          className="text-base font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        >
                          {thread.title}
                        </button>
                        {thread.hasAcceptedAnswer && (
                          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Solved
                          </span>
                        )}
                        {getStatusBadge(thread.status)}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{thread.author.name}</span>
                        {getRoleBadge(thread.author.role)}
                        <span>in</span>
                        <span className="text-blue-600 dark:text-blue-400">{thread.category.name}</span>
                        <span>.</span>
                        <span>{formatTimeAgo(thread.lastActivity)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleBookmark(thread.id)}
                        className={`rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          thread.isBookmarked ? 'text-yellow-500' : 'text-gray-400'
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {thread.tags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleLike(thread.id)}
                      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {thread.likeCount}
                    </button>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {thread.replyCount}
                      {' '}
                      replies
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {thread.viewCount}
                      {' '}
                      views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load more */}
      {sortedThreads.length > 0 && (
        <div className="border-t border-gray-200 p-4 text-center dark:border-gray-800">
          <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Load more threads
          </button>
        </div>
      )}

      {/* New thread modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white dark:bg-gray-900">
            <div className="border-b border-gray-200 p-6 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Thread</h3>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  placeholder="What's your question or topic?"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <textarea
                  rows={6}
                  placeholder="Describe your question or topic in detail..."
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags separated by commas"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-800">
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Create Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { ForumCategory, ForumReply, ForumThread, ForumVariant, SortOption, ThreadAuthor, ThreadStatus };
