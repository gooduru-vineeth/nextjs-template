'use client';

import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  GitBranch,
  GitCommit,
  History,
  Info,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Trash2,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type VersionStatus = 'draft' | 'published' | 'archived' | 'deprecated';

export type VersionChange = {
  type: 'added' | 'modified' | 'removed';
  path: string;
  description: string;
};

export type TemplateVersion = {
  id: string;
  version: string;
  name?: string;
  description?: string;
  status: VersionStatus;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: VersionChange[];
  parentVersionId?: string;
  snapshot?: object;
  tags?: string[];
  downloadCount?: number;
};

export type VersionBranch = {
  id: string;
  name: string;
  currentVersionId: string;
  isMain: boolean;
  createdAt: Date;
};

export type TemplateVersioningProps = {
  versions?: TemplateVersion[];
  branches?: VersionBranch[];
  currentVersionId?: string;
  currentBranchId?: string;
  onVersionSelect?: (version: TemplateVersion) => void;
  onVersionRestore?: (version: TemplateVersion) => void;
  onVersionDelete?: (versionId: string) => void;
  onVersionCreate?: (description: string, name?: string) => void;
  onVersionTag?: (versionId: string, tag: string) => void;
  onBranchCreate?: (name: string) => void;
  onBranchSwitch?: (branchId: string) => void;
  onCompare?: (versionA: string, versionB: string) => void;
  variant?: 'full' | 'compact' | 'timeline';
  className?: string;
};

// ============================================================================
// Sample Data
// ============================================================================

const sampleVersions: TemplateVersion[] = [
  {
    id: 'v6',
    version: '2.1.0',
    name: 'Dark Mode Support',
    description: 'Added comprehensive dark mode styling',
    status: 'published',
    createdAt: new Date('2024-04-10T14:30:00'),
    createdBy: { id: 'u1', name: 'John Doe' },
    changes: [
      { type: 'added', path: 'styles/dark-theme.css', description: 'Dark mode color scheme' },
      { type: 'modified', path: 'components/bubble.tsx', description: 'Theme-aware styling' },
    ],
    parentVersionId: 'v5',
    tags: ['dark-mode', 'latest'],
    downloadCount: 234,
  },
  {
    id: 'v5',
    version: '2.0.0',
    name: 'Major Redesign',
    description: 'Complete UI overhaul with new components',
    status: 'published',
    createdAt: new Date('2024-03-28T10:15:00'),
    createdBy: { id: 'u1', name: 'John Doe' },
    changes: [
      { type: 'added', path: 'components/reactions.tsx', description: 'Message reactions' },
      { type: 'modified', path: 'components/message.tsx', description: 'New message layout' },
      { type: 'removed', path: 'components/legacy-bubble.tsx', description: 'Removed old component' },
    ],
    parentVersionId: 'v4',
    tags: ['major'],
  },
  {
    id: 'v4',
    version: '1.2.0',
    description: 'Added typing indicators',
    status: 'archived',
    createdAt: new Date('2024-03-15T16:45:00'),
    createdBy: { id: 'u2', name: 'Jane Smith' },
    changes: [
      { type: 'added', path: 'components/typing.tsx', description: 'Typing indicator component' },
    ],
    parentVersionId: 'v3',
  },
  {
    id: 'v3',
    version: '1.1.1',
    description: 'Bug fixes for avatar display',
    status: 'archived',
    createdAt: new Date('2024-03-01T09:20:00'),
    createdBy: { id: 'u1', name: 'John Doe' },
    changes: [
      { type: 'modified', path: 'components/avatar.tsx', description: 'Fixed image sizing' },
    ],
    parentVersionId: 'v2',
  },
  {
    id: 'v2',
    version: '1.1.0',
    description: 'Added group chat support',
    status: 'archived',
    createdAt: new Date('2024-02-20T11:30:00'),
    createdBy: { id: 'u2', name: 'Jane Smith' },
    changes: [
      { type: 'added', path: 'components/group-header.tsx', description: 'Group chat header' },
      { type: 'modified', path: 'components/message.tsx', description: 'Multi-participant support' },
    ],
    parentVersionId: 'v1',
  },
  {
    id: 'v1',
    version: '1.0.0',
    name: 'Initial Release',
    description: 'First public version',
    status: 'deprecated',
    createdAt: new Date('2024-02-01T08:00:00'),
    createdBy: { id: 'u1', name: 'John Doe' },
    changes: [
      { type: 'added', path: 'components/message.tsx', description: 'Message component' },
      { type: 'added', path: 'components/bubble.tsx', description: 'Chat bubble' },
      { type: 'added', path: 'components/avatar.tsx', description: 'User avatar' },
    ],
    tags: ['initial'],
  },
];

const sampleBranches: VersionBranch[] = [
  { id: 'main', name: 'main', currentVersionId: 'v6', isMain: true, createdAt: new Date('2024-02-01') },
  { id: 'feature-video', name: 'feature/video-messages', currentVersionId: 'v4', isMain: false, createdAt: new Date('2024-03-20') },
];

// ============================================================================
// Sub-Components
// ============================================================================

type VersionStatusBadgeProps = {
  status: VersionStatus;
};

function VersionStatusBadge({ status }: VersionStatusBadgeProps) {
  const styles: Record<VersionStatus, string> = {
    draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    deprecated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

type ChangeTypeBadgeProps = {
  type: VersionChange['type'];
};

function ChangeTypeBadge({ type }: ChangeTypeBadgeProps) {
  const styles: Record<VersionChange['type'], { bg: string; text: string }> = {
    added: { bg: 'bg-green-500', text: '+' },
    modified: { bg: 'bg-blue-500', text: '~' },
    removed: { bg: 'bg-red-500', text: '-' },
  };

  return (
    <span className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white ${styles[type].bg}`}>
      {styles[type].text}
    </span>
  );
}

type VersionItemProps = {
  version: TemplateVersion;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  onCompare?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
};

function VersionItem({
  version,
  isSelected,
  isCurrent,
  onSelect,
  onRestore,
  onDelete,
  onCompare,
  expanded,
  onToggleExpand,
}: VersionItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    }
    if (days === 1) {
      return 'Yesterday';
    }
    if (days < 7) {
      return `${days} days ago`;
    }
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`
        overflow-hidden rounded-lg border transition-all
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700'}
        ${isCurrent ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800'}
      `}
    >
      {/* Header */}
      <div
        onClick={onSelect}
        className="cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="mt-1 rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {expanded
                ? (
                    <ChevronDown className="h-4 w-4" />
                  )
                : (
                    <ChevronRight className="h-4 w-4" />
                  )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-medium">
                  v
                  {version.version}
                </span>
                {version.name && (
                  <span className="text-gray-500">
                    -
                    {version.name}
                  </span>
                )}
                <VersionStatusBadge status={version.status} />
                {isCurrent && (
                  <span className="rounded bg-blue-500 px-2 py-0.5 text-xs text-white">
                    Current
                  </span>
                )}
              </div>

              {version.description && (
                <p className="mt-1 text-sm text-gray-500">{version.description}</p>
              )}

              <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {version.createdBy.name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(version.createdAt)}
                </span>
                {version.downloadCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {version.downloadCount}
                  </span>
                )}
              </div>

              {version.tags && version.tags.length > 0 && (
                <div className="mt-2 flex items-center gap-1">
                  {version.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-full right-0 z-20 mt-1 min-w-[140px] rounded-lg border bg-white py-1 shadow-lg dark:bg-gray-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </button>

                  {onCompare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompare();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowLeftRight className="h-3 w-3" />
                      Compare
                    </button>
                  )}

                  {!isCurrent && onRestore && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </button>
                  )}

                  {version.status !== 'published' && onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Changes */}
      {expanded && version.changes.length > 0 && (
        <div className="border-t bg-gray-50/50 px-3 pt-0 pb-3 dark:bg-gray-900/30">
          <p className="mt-2 mb-2 text-xs font-medium text-gray-500">Changes</p>
          <div className="space-y-1.5">
            {version.changes.map((change, index) => (
              <div key={index} className="flex items-start gap-2">
                <ChangeTypeBadge type={change.type} />
                <div className="min-w-0 flex-1">
                  <code className="text-xs break-all text-gray-600 dark:text-gray-400">
                    {change.path}
                  </code>
                  <p className="text-xs text-gray-500">{change.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type CreateVersionDialogProps = {
  onSubmit: (description: string, name?: string) => void;
  onCancel: () => void;
};

function CreateVersionDialog({ onSubmit, onCancel }: CreateVersionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim(), name.trim() || undefined);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800"
      >
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <GitCommit className="h-5 w-5" />
          Create New Version
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Version Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Dark Mode Support"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description *
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what changed in this version..."
              className="h-24 w-full resize-none rounded-lg border px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!description.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Create Version
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TemplateVersioning({
  versions = sampleVersions,
  branches = sampleBranches,
  currentVersionId = 'v6',
  currentBranchId = 'main',
  onVersionSelect,
  onVersionRestore,
  onVersionDelete,
  onVersionCreate,
  onVersionTag: _onVersionTag,
  onBranchCreate,
  onBranchSwitch,
  onCompare,
  variant = 'full',
  className = '',
}: TemplateVersioningProps) {
  void _onVersionTag; // Reserved for future tag management UI

  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[string | null, string | null]>([null, null]);

  const _currentBranch = useMemo(() => {
    return branches.find(b => b.id === currentBranchId);
  }, [branches, currentBranchId]);
  void _currentBranch; // Reserved for branch info display

  const sortedVersions = useMemo(() => {
    return [...versions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [versions]);

  const handleToggleExpand = useCallback((versionId: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(versionId)) {
        next.delete(versionId);
      } else {
        next.add(versionId);
      }
      return next;
    });
  }, []);

  const handleVersionSelect = useCallback((version: TemplateVersion) => {
    if (compareMode) {
      if (!compareVersions[0]) {
        setCompareVersions([version.id, null]);
      } else if (!compareVersions[1]) {
        setCompareVersions([compareVersions[0], version.id]);
        onCompare?.(compareVersions[0]!, version.id);
        setCompareMode(false);
        setCompareVersions([null, null]);
      }
    } else {
      setSelectedVersion(version.id);
      onVersionSelect?.(version);
    }
  }, [compareMode, compareVersions, onVersionSelect, onCompare]);

  const handleCreateVersion = useCallback((description: string, name?: string) => {
    onVersionCreate?.(description, name);
    setShowCreateDialog(false);
  }, [onVersionCreate]);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-gray-400" />
          <select
            value={currentBranchId}
            onChange={e => onBranchSwitch?.(e.target.value)}
            className="rounded border bg-white px-2 py-1 text-sm dark:bg-gray-800"
          >
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-gray-400" />
          <select
            value={currentVersionId}
            onChange={(e) => {
              const version = versions.find(v => v.id === e.target.value);
              if (version) {
                onVersionSelect?.(version);
              }
            }}
            className="rounded border bg-white px-2 py-1 text-sm dark:bg-gray-800"
          >
            {sortedVersions.map(version => (
              <option key={version.id} value={version.id}>
                v
                {version.version}
                {' '}
                {version.name ? `- ${version.name}` : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowCreateDialog(true)}
          className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Create new version"
        >
          <Plus className="h-4 w-4" />
        </button>

        {showCreateDialog && (
          <CreateVersionDialog
            onSubmit={handleCreateVersion}
            onCancel={() => setShowCreateDialog(false)}
          />
        )}
      </div>
    );
  }

  if (variant === 'timeline') {
    return (
      <div className={`relative ${className}`}>
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-4">
          {sortedVersions.map(version => (
            <div key={version.id} className="relative flex items-start gap-4 pl-2">
              {/* Timeline dot */}
              <div
                className={`
                  relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2
                  ${version.id === currentVersionId
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'}
                `}
              >
                {version.id === currentVersionId && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono font-medium">
                    v
                    {version.version}
                  </span>
                  {version.name && (
                    <span className="text-sm text-gray-500">
                      -
                      {version.name}
                    </span>
                  )}
                  <VersionStatusBadge status={version.status} />
                </div>

                {version.description && (
                  <p className="text-sm text-gray-500">{version.description}</p>
                )}

                <p className="mt-1 text-xs text-gray-400">
                  {version.createdBy.name}
                  {' '}
                  •
                  {version.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
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
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-gray-500" />
          <h2 className="font-bold">Version History</h2>
        </div>

        <div className="flex items-center gap-2">
          {onCompare && (
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareVersions([null, null]);
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

          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            New Version
          </button>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <GitBranch className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">Branch:</span>
        <select
          value={currentBranchId}
          onChange={e => onBranchSwitch?.(e.target.value)}
          className="rounded border bg-white px-2 py-1 text-sm dark:bg-gray-700"
        >
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
              {' '}
              {branch.isMain && '(main)'}
            </option>
          ))}
        </select>

        {onBranchCreate && (
          <button
            onClick={() => {
              const name = prompt('Enter branch name:');
              if (name) {
                onBranchCreate(name);
              }
            }}
            className="ml-auto rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Create branch"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Compare Mode Info */}
      {compareMode && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          <Info className="h-4 w-4" />
          <span className="text-sm">
            {!compareVersions[0]
              ? 'Select the first version to compare'
              : !compareVersions[1]
                  ? 'Now select the second version'
                  : 'Comparing versions...'}
          </span>
          <button
            onClick={() => {
              setCompareMode(false);
              setCompareVersions([null, null]);
            }}
            className="ml-auto rounded p-1 hover:bg-blue-100 dark:hover:bg-blue-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Version List */}
      <div className="space-y-3">
        {sortedVersions.map(version => (
          <VersionItem
            key={version.id}
            version={version}
            isSelected={
              selectedVersion === version.id
              || compareVersions.includes(version.id)
            }
            isCurrent={version.id === currentVersionId}
            onSelect={() => handleVersionSelect(version)}
            onRestore={() => onVersionRestore?.(version)}
            onDelete={() => onVersionDelete?.(version.id)}
            onCompare={onCompare
              ? () => {
                  setCompareMode(true);
                  setCompareVersions([version.id, null]);
                }
              : undefined}
            expanded={expandedVersions.has(version.id)}
            onToggleExpand={() => handleToggleExpand(version.id)}
          />
        ))}
      </div>

      {/* Create Version Dialog */}
      {showCreateDialog && (
        <CreateVersionDialog
          onSubmit={handleCreateVersion}
          onCancel={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  );
}

// ============================================================================
// Version Comparison Component
// ============================================================================

export type VersionComparisonProps = {
  versionA: TemplateVersion;
  versionB: TemplateVersion;
  onClose: () => void;
};

export function VersionComparison({
  versionA,
  versionB,
  onClose,
}: VersionComparisonProps) {
  const allPaths = useMemo(() => {
    const paths = new Set<string>();
    versionA.changes.forEach(c => paths.add(c.path));
    versionB.changes.forEach(c => paths.add(c.path));
    return Array.from(paths);
  }, [versionA, versionB]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4 dark:bg-gray-800">
          <h2 className="flex items-center gap-2 font-bold">
            <ArrowLeftRight className="h-5 w-5" />
            Comparing Versions
          </h2>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Version Headers */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono font-bold">
                  v
                  {versionA.version}
                </span>
                <VersionStatusBadge status={versionA.status} />
              </div>
              <p className="text-sm text-gray-500">{versionA.description}</p>
              <p className="mt-2 text-xs text-gray-400">
                {versionA.createdAt.toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono font-bold">
                  v
                  {versionB.version}
                </span>
                <VersionStatusBadge status={versionB.status} />
              </div>
              <p className="text-sm text-gray-500">{versionB.description}</p>
              <p className="mt-2 text-xs text-gray-400">
                {versionB.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Changes Comparison */}
          <h3 className="mb-3 font-medium">Changes</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">File</th>
                  <th className="px-4 py-2 text-center">
                    v
                    {versionA.version}
                  </th>
                  <th className="px-4 py-2 text-center">
                    v
                    {versionB.version}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allPaths.map((path) => {
                  const changeA = versionA.changes.find(c => c.path === path);
                  const changeB = versionB.changes.find(c => c.path === path);

                  return (
                    <tr key={path} className="border-t">
                      <td className="px-4 py-2 font-mono text-xs">{path}</td>
                      <td className="px-4 py-2 text-center">
                        {changeA ? <ChangeTypeBadge type={changeA.type} /> : '-'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {changeB ? <ChangeTypeBadge type={changeB.type} /> : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default TemplateVersioning;
