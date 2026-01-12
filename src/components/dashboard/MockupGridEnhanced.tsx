'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Mockup = {
  id: number;
  name: string;
  type: 'chat' | 'ai' | 'social';
  platform: string;
  thumbnailUrl: string | null;
  updatedAt: string;
  createdAt: string;
  isPublic: boolean;
};

type MockupGridEnhancedProps = {
  initialLimit?: number;
};

type SortField = 'updatedAt' | 'createdAt' | 'name';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'chat' | 'ai' | 'social';

const platformIcons: Record<string, string> = {
  whatsapp: '💬',
  imessage: '💭',
  discord: '🎮',
  telegram: '✈️',
  messenger: '💬',
  slack: '💼',
  chatgpt: '🤖',
  claude: '🧠',
  gemini: '✨',
  perplexity: '🔍',
  linkedin: '💼',
  instagram: '📷',
  twitter: '🐦',
};

function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return then.toLocaleDateString();
}

function getEditorPath(type: string, platform: string): string {
  switch (type) {
    case 'ai':
      return `/editor/ai?platform=${platform}`;
    case 'social':
      return `/editor/social?platform=${platform}`;
    default:
      return `/editor?platform=${platform}`;
  }
}

export function MockupGridEnhanced({ initialLimit = 12 }: MockupGridEnhancedProps) {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(initialLimit);

  const fetchMockups = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String((page - 1) * limit),
      });

      if (filterType !== 'all') {
        params.set('type', filterType);
      }

      const response = await fetch(`/api/mockups?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mockups');
      }
      const data = await response.json();
      setMockups(data.mockups || []);
      setTotalCount(data.total || data.mockups?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mockups');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filterType]);

  useEffect(() => {
    fetchMockups();
  }, [fetchMockups]);

  // Client-side search and sort (for already fetched mockups)
  const filteredAndSortedMockups = mockups
    .filter((mockup) => {
      if (!searchQuery) {
        return true;
      }
      const query = searchQuery.toLowerCase();
      return (
        mockup.name.toLowerCase().includes(query)
        || mockup.platform.toLowerCase().includes(query)
        || mockup.type.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this mockup?')) {
      return;
    }

    try {
      const response = await fetch(`/api/mockups/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete mockup');
      }
      setMockups(prev => prev.filter(m => m.id !== id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete mockup');
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center md:justify-between dark:border-gray-700 dark:bg-gray-800">
        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <svg
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search mockups..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as FilterType);
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="chat">Chat</option>
              <option value="ai">AI</option>
              <option value="social">Social</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort:</span>
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as SortField)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="updatedAt">Last Modified</option>
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              title={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
            >
              {sortOrder === 'asc'
                ? (
                    <svg className="size-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  )
                : (
                    <svg className="size-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: limit }, (_, i) => i).map(i => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={fetchMockups}
            className="mt-2 text-sm text-red-700 underline hover:no-underline dark:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredAndSortedMockups.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-800/50">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <svg className="size-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {searchQuery ? 'No mockups found' : 'No mockups yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first mockup'}
          </p>
          {!searchQuery && (
            <Link
              href="/editor"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Mockup
            </Link>
          )}
        </div>
      )}

      {/* Mockup Grid */}
      {!isLoading && !error && filteredAndSortedMockups.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedMockups.map(mockup => (
            <div
              key={mockup.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {mockup.thumbnailUrl
                  ? (
                      <img
                        src={mockup.thumbnailUrl}
                        alt={mockup.name}
                        className="size-full object-cover"
                      />
                    )
                  : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl opacity-30">
                          {platformIcons[mockup.platform] || '📄'}
                        </span>
                      </div>
                    )}
                {/* Type badge */}
                <div className="absolute top-2 right-2 rounded-full bg-gray-900/70 px-2 py-0.5 text-xs font-medium text-white capitalize">
                  {mockup.type}
                </div>
                {/* Public badge */}
                {mockup.isPublic && (
                  <div className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                    Public
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`${getEditorPath(mockup.type, mockup.platform)}&id=${mockup.id}`}
                    className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                  {mockup.isPublic && (
                    <Link
                      href={`/mockup/${mockup.id}`}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(mockup.id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-medium text-gray-900 dark:text-white" title={mockup.name}>
                    {mockup.name}
                  </h3>
                  {mockup.isPublic && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/mockup/${mockup.id}`);
                        alert('Share link copied to clipboard!');
                      }}
                      className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                      title="Copy share link"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span>{platformIcons[mockup.platform] || '📄'}</span>
                    <span className="capitalize">{mockup.platform}</span>
                  </span>
                  <span>•</span>
                  <span>{formatTimeAgo(mockup.updatedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing
            {' '}
            {(page - 1) * limit + 1}
            {' '}
            -
            {' '}
            {Math.min(page * limit, totalCount)}
            {' '}
            of
            {' '}
            {totalCount}
            {' '}
            mockups
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`size-8 rounded-lg text-sm font-medium ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
