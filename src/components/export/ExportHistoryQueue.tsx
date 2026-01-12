'use client';

import {
  Archive,
  CheckCircle,
  Clock,
  Copy,
  Download,
  File,
  FileImage,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf' | 'webp' | 'gif' | 'zip';
type HistoryVariant = 'full' | 'compact' | 'sidebar';
type SortOption = 'recent' | 'oldest' | 'size' | 'name';
type FilterOption = 'all' | 'completed' | 'failed' | 'pending';

type ExportHistoryItem = {
  id: string;
  name: string;
  format: ExportFormat;
  status: ExportStatus;
  size: number;
  mockupName: string;
  createdAt: string;
  expiresAt?: string;
  downloadUrl?: string;
  thumbnail?: string;
};

export type ExportHistoryQueueProps = {
  variant?: HistoryVariant;
  items?: ExportHistoryItem[];
  onDownload?: (itemId: string) => void;
  onRetry?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
  onClearAll?: () => void;
  onCopyLink?: (itemId: string) => void;
  className?: string;
};

// Mock data
const mockHistoryItems: ExportHistoryItem[] = [
  {
    id: '1',
    name: 'iphone-chat-mockup.png',
    format: 'png',
    status: 'completed',
    size: 245000,
    mockupName: 'iPhone Chat',
    createdAt: '2024-01-12T14:30:00Z',
    expiresAt: '2024-01-19T14:30:00Z',
    downloadUrl: '/exports/1.png',
  },
  {
    id: '2',
    name: 'instagram-story-set.zip',
    format: 'zip',
    status: 'completed',
    size: 1250000,
    mockupName: 'Instagram Stories Pack',
    createdAt: '2024-01-12T12:15:00Z',
    expiresAt: '2024-01-19T12:15:00Z',
    downloadUrl: '/exports/2.zip',
  },
  {
    id: '3',
    name: 'presentation-slides.pdf',
    format: 'pdf',
    status: 'processing',
    size: 0,
    mockupName: 'Product Demo',
    createdAt: '2024-01-12T14:35:00Z',
  },
  {
    id: '4',
    name: 'twitter-thread.png',
    format: 'png',
    status: 'failed',
    size: 0,
    mockupName: 'Twitter Thread',
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: '5',
    name: 'android-screenshot.jpg',
    format: 'jpg',
    status: 'expired',
    size: 180000,
    mockupName: 'Android Chat',
    createdAt: '2024-01-05T09:00:00Z',
    expiresAt: '2024-01-12T09:00:00Z',
  },
  {
    id: '6',
    name: 'claude-conversation.png',
    format: 'png',
    status: 'pending',
    size: 0,
    mockupName: 'Claude AI Chat',
    createdAt: '2024-01-12T14:40:00Z',
  },
];

export default function ExportHistoryQueue({
  variant = 'full',
  items = mockHistoryItems,
  onDownload,
  onRetry,
  onDelete,
  onClearAll,
  onCopyLink,
  className = '',
}: ExportHistoryQueueProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'png':
      case 'jpg':
      case 'webp':
      case 'gif':
        return <FileImage className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'zip':
        return <Archive className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ExportStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: ExportStatus) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'failed': return 'Failed';
      case 'processing': return 'Processing';
      case 'expired': return 'Expired';
      case 'pending': return 'Queued';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return '-';
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
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

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = !searchQuery
        || item.name.toLowerCase().includes(searchQuery.toLowerCase())
        || item.mockupName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'size':
          return b.size - a.size;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleToggleSelect = useCallback((itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const completedCount = items.filter(i => i.status === 'completed').length;
  const pendingCount = items.filter(i => i.status === 'pending' || i.status === 'processing').length;

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-3 dark:border-gray-800">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Download className="h-4 w-4" />
            Export Queue
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {pendingCount > 0 ? `${pendingCount} pending` : `${completedCount} ready`}
          </p>
        </div>
        <div className="max-h-80 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
          {filteredItems.slice(0, 5).map(item => (
            <div key={item.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <p className="flex-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </p>
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
              {item.status === 'completed' && (
                <button
                  onClick={() => onDownload?.(item.id)}
                  className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
        {items.length > 5 && (
          <div className="border-t border-gray-200 p-3 dark:border-gray-800">
            <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              View all (
              {items.length}
              )
            </button>
          </div>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Export History</h3>
          <div className="flex items-center gap-2">
            <select
              value={filterBy}
              onChange={e => setFilterBy(e.target.value as FilterOption)}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="max-h-96 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
          {filteredItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex min-w-0 items-center gap-3">
                {getStatusIcon(item.status)}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                </div>
              </div>
              {item.status === 'completed' && (
                <button
                  onClick={() => onDownload?.(item.id)}
                  className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
              {item.status === 'failed' && (
                <button
                  onClick={() => onRetry?.(item.id)}
                  className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Export History</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {completedCount}
              {' '}
              exports ready,
              {pendingCount}
              {' '}
              in queue
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
              <button
                onClick={() => selectedItems.forEach(id => onDelete?.(id))}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4" />
                Delete (
                {selectedItems.size}
                )
              </button>
            )}
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search exports..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={e => setFilterBy(e.target.value as FilterOption)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="size">File Size</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="w-8 px-4 py-3">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(new Set(filteredItems.map(i => i.id)));
                    } else {
                      setSelectedItems(new Set());
                    }
                  }}
                  checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">File</th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Mockup</th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Date</th>
              <th className="w-24 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredItems.length === 0
              ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Download className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500">No exports found</p>
                    </td>
                  </tr>
                )
              : (
                  filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded bg-gray-100 p-2 dark:bg-gray-800">
                            {getFormatIcon(item.format)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{item.format}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.mockupName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={`text-sm ${
                            item.status === 'completed'
                              ? 'text-green-600 dark:text-green-400'
                              : item.status === 'failed'
                                ? 'text-red-600 dark:text-red-400'
                                : item.status === 'processing'
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500'
                          }`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{formatFileSize(item.size)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {item.status === 'completed' && (
                            <>
                              <button
                                onClick={() => onDownload?.(item.id)}
                                className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => onCopyLink?.(item.id)}
                                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Copy link"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {item.status === 'failed' && (
                            <button
                              onClick={() => onRetry?.(item.id)}
                              className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                              title="Retry"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete?.(item.id)}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { ExportFormat, ExportHistoryItem, ExportStatus, FilterOption, HistoryVariant, SortOption };
