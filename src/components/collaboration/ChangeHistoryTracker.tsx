'use client';

import {
  ArrowLeftRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit3,
  Eye,
  Filter,
  History,
  Image,
  Layers,
  MessageSquare,
  Minus,
  Move,
  Palette,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Trash2,
  Type,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ChangeType
  = | 'create'
    | 'update'
    | 'delete'
    | 'move'
    | 'copy'
    | 'style'
    | 'content'
    | 'settings'
    | 'batch';

export type ChangeCategory
  = | 'message'
    | 'participant'
    | 'style'
    | 'layout'
    | 'media'
    | 'settings'
    | 'template';

export type ChangeDetail = {
  field: string;
  oldValue?: unknown;
  newValue?: unknown;
  displayOld?: string;
  displayNew?: string;
};

export type HistoryEntry = {
  id: string;
  type: ChangeType;
  category: ChangeCategory;
  description: string;
  details?: ChangeDetail[];
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId?: string;
  targetType?: string;
  targetName?: string;
  canUndo: boolean;
  batchId?: string;
  snapshot?: object;
};

export type ChangeHistoryTrackerProps = {
  entries?: HistoryEntry[];
  currentUserId?: string;
  onUndo?: (entryId: string) => void;
  onRestore?: (entryId: string) => void;
  onPreview?: (entry: HistoryEntry) => void;
  onCompare?: (entryA: string, entryB: string) => void;
  onExport?: () => void;
  onClearHistory?: () => void;
  maxEntries?: number;
  variant?: 'full' | 'compact' | 'sidebar';
  className?: string;
};

// ============================================================================
// Sample Data
// ============================================================================

const sampleEntries: HistoryEntry[] = [
  {
    id: 'h1',
    type: 'update',
    category: 'message',
    description: 'Updated message content',
    details: [
      { field: 'text', oldValue: 'Hello', newValue: 'Hello, how are you?', displayOld: 'Hello', displayNew: 'Hello, how are you?' },
    ],
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    userId: 'u1',
    userName: 'John Doe',
    targetId: 'msg-1',
    targetType: 'message',
    targetName: 'Message 1',
    canUndo: true,
  },
  {
    id: 'h2',
    type: 'style',
    category: 'style',
    description: 'Changed bubble color',
    details: [
      { field: 'backgroundColor', oldValue: '#3b82f6', newValue: '#8b5cf6', displayOld: 'Blue', displayNew: 'Purple' },
    ],
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    userId: 'u1',
    userName: 'John Doe',
    targetId: 'style-1',
    targetType: 'style',
    canUndo: true,
  },
  {
    id: 'h3',
    type: 'create',
    category: 'message',
    description: 'Added new message',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    userId: 'u2',
    userName: 'Sarah Chen',
    targetId: 'msg-2',
    targetType: 'message',
    targetName: 'Message 2',
    canUndo: true,
  },
  {
    id: 'h4',
    type: 'delete',
    category: 'participant',
    description: 'Removed participant',
    details: [
      { field: 'name', oldValue: 'Guest User', displayOld: 'Guest User' },
    ],
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    userId: 'u1',
    userName: 'John Doe',
    targetId: 'p-3',
    targetType: 'participant',
    targetName: 'Guest User',
    canUndo: true,
  },
  {
    id: 'h5',
    type: 'batch',
    category: 'layout',
    description: 'Reordered 3 messages',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    userId: 'u2',
    userName: 'Sarah Chen',
    canUndo: true,
    batchId: 'batch-1',
  },
  {
    id: 'h6',
    type: 'settings',
    category: 'settings',
    description: 'Changed platform to WhatsApp',
    details: [
      { field: 'platform', oldValue: 'imessage', newValue: 'whatsapp', displayOld: 'iMessage', displayNew: 'WhatsApp' },
    ],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    userId: 'u1',
    userName: 'John Doe',
    canUndo: true,
  },
  {
    id: 'h7',
    type: 'create',
    category: 'media',
    description: 'Added image attachment',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    userId: 'u2',
    userName: 'Sarah Chen',
    targetId: 'media-1',
    targetType: 'image',
    targetName: 'screenshot.png',
    canUndo: true,
  },
  {
    id: 'h8',
    type: 'update',
    category: 'participant',
    description: 'Updated participant avatar',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    userId: 'u1',
    userName: 'John Doe',
    targetId: 'p-1',
    targetType: 'participant',
    targetName: 'User 1',
    canUndo: false,
  },
];

// ============================================================================
// Sub-Components
// ============================================================================

type ChangeTypeIconProps = {
  type: ChangeType;
  category: ChangeCategory;
};

function ChangeTypeIcon({ type, category }: ChangeTypeIconProps) {
  // Category-specific icons
  const categoryIcons: Record<ChangeCategory, React.ReactNode> = {
    message: <MessageSquare className="h-4 w-4" />,
    participant: <User className="h-4 w-4" />,
    style: <Palette className="h-4 w-4" />,
    layout: <Layers className="h-4 w-4" />,
    media: <Image className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    template: <Copy className="h-4 w-4" />,
  };

  // Type-specific colors
  const typeColors: Record<ChangeType, string> = {
    create: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    update: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    delete: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    move: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    copy: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    style: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    content: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    settings: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    batch: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${typeColors[type]}`}>
      {categoryIcons[category]}
    </div>
  );
}

type ChangeTypeBadgeProps = {
  type: ChangeType;
};

function ChangeTypeBadge({ type }: ChangeTypeBadgeProps) {
  const labels: Record<ChangeType, { text: string; icon: React.ReactNode }> = {
    create: { text: 'Created', icon: <Plus className="h-3 w-3" /> },
    update: { text: 'Updated', icon: <Edit3 className="h-3 w-3" /> },
    delete: { text: 'Deleted', icon: <Minus className="h-3 w-3" /> },
    move: { text: 'Moved', icon: <Move className="h-3 w-3" /> },
    copy: { text: 'Copied', icon: <Copy className="h-3 w-3" /> },
    style: { text: 'Styled', icon: <Palette className="h-3 w-3" /> },
    content: { text: 'Content', icon: <Type className="h-3 w-3" /> },
    settings: { text: 'Settings', icon: <Settings className="h-3 w-3" /> },
    batch: { text: 'Batch', icon: <Layers className="h-3 w-3" /> },
  };

  const label = labels[type];

  return (
    <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700">
      {label.icon}
      {label.text}
    </span>
  );
}

type HistoryEntryItemProps = {
  entry: HistoryEntry;
  onUndo?: () => void;
  onPreview?: () => void;
  onCompare?: () => void;
  showDetails?: boolean;
};

function HistoryEntryItem({
  entry,
  onUndo,
  onPreview,
  onCompare,
  showDetails = true,
}: HistoryEntryItemProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    if (days === 1) {
      return 'Yesterday';
    }
    if (days < 7) {
      return `${days}d ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="group">
      <div
        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setExpanded(!expanded)}
      >
        <ChangeTypeIcon type={entry.type} category={entry.category} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{entry.description}</span>
            <ChangeTypeBadge type={entry.type} />
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {entry.userName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimestamp(entry.timestamp)}
            </span>
            {entry.targetName && (
              <span className="truncate">
                →
                {' '}
                {entry.targetName}
              </span>
            )}
          </div>

          {/* Quick preview of changes */}
          {showDetails && entry.details && entry.details.length > 0 && !expanded && (
            <div className="mt-1 truncate text-xs text-gray-400">
              {entry.details[0]!.displayOld}
              {' '}
              →
              {entry.details[0]!.displayNew}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare();
              }}
              className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Compare"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          )}
          {entry.canUndo && onUndo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUndo();
              }}
              className="rounded p-1.5 text-blue-500 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Undo"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Expand indicator */}
        {entry.details && entry.details.length > 0 && (
          <button className="p-1 text-gray-400">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Expanded details */}
      {expanded && entry.details && entry.details.length > 0 && (
        <div className="mr-3 mb-2 ml-11 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="mb-2 text-xs font-medium text-gray-500">Changes</p>
          <div className="space-y-2">
            {entry.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="min-w-[80px] text-gray-500">
                  {detail.field}
                  :
                </span>
                <div className="flex items-center gap-2">
                  {detail.displayOld !== undefined && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-red-600 line-through dark:bg-red-900/30 dark:text-red-400">
                      {detail.displayOld}
                    </span>
                  )}
                  {detail.displayNew !== undefined && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="rounded bg-green-100 px-2 py-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        {detail.displayNew}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type FilterPanelProps = {
  filters: {
    type: ChangeType | 'all';
    category: ChangeCategory | 'all';
    userId: string | 'all';
    dateRange: 'all' | 'today' | 'week' | 'month';
  };
  onFilterChange: (filters: FilterPanelProps['filters']) => void;
  users: Array<{ id: string; name: string }>;
};

function FilterPanel({ filters, onFilterChange, users }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
      <select
        value={filters.type}
        onChange={e => onFilterChange({ ...filters, type: e.target.value as ChangeType | 'all' })}
        className="rounded border bg-white px-2 py-1.5 text-sm dark:bg-gray-700"
      >
        <option value="all">All Types</option>
        <option value="create">Created</option>
        <option value="update">Updated</option>
        <option value="delete">Deleted</option>
        <option value="move">Moved</option>
        <option value="style">Styled</option>
        <option value="settings">Settings</option>
      </select>

      <select
        value={filters.category}
        onChange={e => onFilterChange({ ...filters, category: e.target.value as ChangeCategory | 'all' })}
        className="rounded border bg-white px-2 py-1.5 text-sm dark:bg-gray-700"
      >
        <option value="all">All Categories</option>
        <option value="message">Messages</option>
        <option value="participant">Participants</option>
        <option value="style">Styles</option>
        <option value="layout">Layout</option>
        <option value="media">Media</option>
        <option value="settings">Settings</option>
      </select>

      <select
        value={filters.userId}
        onChange={e => onFilterChange({ ...filters, userId: e.target.value })}
        className="rounded border bg-white px-2 py-1.5 text-sm dark:bg-gray-700"
      >
        <option value="all">All Users</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>

      <select
        value={filters.dateRange}
        onChange={e => onFilterChange({ ...filters, dateRange: e.target.value as FilterPanelProps['filters']['dateRange'] })}
        className="rounded border bg-white px-2 py-1.5 text-sm dark:bg-gray-700"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ChangeHistoryTracker({
  entries = sampleEntries,
  currentUserId: _currentUserId,
  onUndo,
  onRestore: _onRestore,
  onPreview,
  onCompare,
  onExport,
  onClearHistory,
  maxEntries = 100,
  variant = 'full',
  className = '',
}: ChangeHistoryTrackerProps) {
  // Reserved for future use
  void _currentUserId;
  void _onRestore;
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterPanelProps['filters']>({
    type: 'all',
    category: 'all',
    userId: 'all',
    dateRange: 'all',
  });
  const [compareMode, setCompareMode] = useState(false);
  const [compareEntries, setCompareEntries] = useState<[string | null, string | null]>([null, null]);

  const users = useMemo(() => {
    const userMap = new Map<string, string>();
    entries.forEach((entry) => {
      if (!userMap.has(entry.userId)) {
        userMap.set(entry.userId, entry.userName);
      }
    });
    return Array.from(userMap.entries()).map(([id, name]) => ({ id, name }));
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = [...entries];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(e =>
        e.description.toLowerCase().includes(searchLower)
        || e.userName.toLowerCase().includes(searchLower)
        || e.targetName?.toLowerCase().includes(searchLower),
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(e => e.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(e => e.category === filters.category);
    }

    // User filter
    if (filters.userId !== 'all') {
      result = result.filter(e => e.userId === filters.userId);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoff: Date;
      switch (filters.dateRange) {
        case 'today':
          cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoff = new Date(0);
      }
      result = result.filter(e => e.timestamp >= cutoff);
    }

    // Limit entries
    return result.slice(0, maxEntries);
  }, [entries, search, filters, maxEntries]);

  const handleEntrySelect = useCallback((entry: HistoryEntry) => {
    if (compareMode) {
      if (!compareEntries[0]) {
        setCompareEntries([entry.id, null]);
      } else if (!compareEntries[1]) {
        onCompare?.(compareEntries[0]!, entry.id);
        setCompareMode(false);
        setCompareEntries([null, null]);
      }
    }
  }, [compareMode, compareEntries, onCompare]);

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = new Map<string, HistoryEntry[]>();

    filteredEntries.forEach((entry) => {
      const date = entry.timestamp.toDateString();
      const existing = groups.get(date) || [];
      existing.push(entry);
      groups.set(date, existing);
    });

    return groups;
  }, [filteredEntries]);

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium">
            <History className="h-4 w-4" />
            Recent Changes
          </span>
          <span className="text-xs text-gray-500">
            {entries.length}
            {' '}
            changes
          </span>
        </div>

        <div className="space-y-1">
          {entries.slice(0, 5).map(entry => (
            <div
              key={entry.id}
              className="flex items-center gap-2 rounded p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <ChangeTypeIcon type={entry.type} category={entry.category} />
              <span className="flex-1 truncate">{entry.description}</span>
              {entry.canUndo && onUndo && (
                <button
                  onClick={() => onUndo(entry.id)}
                  className="rounded p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex h-full flex-col ${className}`}>
        <div className="flex items-center justify-between border-b p-3">
          <span className="flex items-center gap-2 font-medium">
            <History className="h-4 w-4" />
            History
          </span>
          <span className="text-xs text-gray-500">{filteredEntries.length}</span>
        </div>

        <div className="p-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded border py-1.5 pr-3 pl-8 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEntries.map(entry => (
            <HistoryEntryItem
              key={entry.id}
              entry={entry}
              onUndo={() => onUndo?.(entry.id)}
              onPreview={() => onPreview?.(entry)}
              showDetails={false}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-500" />
          <h2 className="font-bold">Change History</h2>
          <span className="text-sm text-gray-500">
            (
            {filteredEntries.length}
            {' '}
            changes)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onCompare && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareEntries([null, null]);
              }}
              className={`
                flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors
                ${compareMode
              ? 'bg-blue-500 text-white'
              : 'border hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Compare
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Export history"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          {onClearHistory && (
            <button
              onClick={onClearHistory}
              className="rounded-lg p-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Clear history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full rounded-lg border py-2 pr-4 pl-10"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors
              ${showFilters ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : ''}
            `}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            users={users}
          />
        )}
      </div>

      {/* Compare mode indicator */}
      {compareMode && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <ArrowLeftRight className="h-4 w-4" />
          <span className="text-sm">
            {!compareEntries[0]
              ? 'Select the first entry to compare'
              : 'Now select the second entry'}
          </span>
          <button
            onClick={() => {
              setCompareMode(false);
              setCompareEntries([null, null]);
            }}
            className="ml-auto rounded p-1 hover:bg-blue-100 dark:hover:bg-blue-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Grouped entries */}
      <div className="space-y-6">
        {filteredEntries.length === 0
          ? (
              <div className="py-12 text-center text-gray-500">
                <History className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p className="font-medium">No history found</p>
                <p className="text-sm">Changes will appear here as you edit</p>
              </div>
            )
          : (
              Array.from(groupedEntries.entries()).map(([date, group]) => (
                <div key={date}>
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      {formatGroupDate(date)}
                    </span>
                    <span className="text-xs text-gray-400">
                      (
                      {group.length}
                      )
                    </span>
                  </div>

                  <div className="divide-y rounded-lg border">
                    {group.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => handleEntrySelect(entry)}
                        className={compareMode ? 'cursor-pointer' : ''}
                      >
                        <HistoryEntryItem
                          entry={entry}
                          onUndo={onUndo ? () => onUndo(entry.id) : undefined}
                          onPreview={onPreview ? () => onPreview(entry) : undefined}
                          onCompare={onCompare
                            ? () => {
                                setCompareMode(true);
                                setCompareEntries([entry.id, null]);
                              }
                            : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  );
}

// ============================================================================
// Undo/Redo Manager Hook
// ============================================================================

type UndoRedoState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function useUndoRedo<T>(initialState: T) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    setState((prev) => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prev.present)
        : newState;

      return {
        past: [...prev.past, prev.present].slice(-50), // Keep last 50
        present: nextState,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) {
        return prev;
      }

      const newPast = [...prev.past];
      const newPresent = newPast.pop()!;

      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) {
        return prev;
      }

      const newFuture = [...prev.future];
      const newPresent = newFuture.shift()!;

      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: T) => {
    setState({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: state.past.length,
  };
}

// ============================================================================
// Exports
// ============================================================================

export default ChangeHistoryTracker;
