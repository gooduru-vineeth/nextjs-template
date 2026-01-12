'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Eye,
  Filter,
  GitBranch,
  GitCommit,
  GitMerge,
  Plus,
  RotateCcw,
  Search,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type Version = {
  id: string;
  name: string;
  description?: string;
  timestamp: Date;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: VersionChange[];
  tags?: string[];
  parentId?: string;
  branchId?: string;
  isAutoSave?: boolean;
  thumbnail?: string;
};

export type VersionChange = {
  type: 'add' | 'modify' | 'delete';
  target: string;
  description: string;
};

export type Branch = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  parentBranchId?: string;
  isDefault?: boolean;
  isProtected?: boolean;
  headVersionId?: string;
};

export type VersionControlSystemProps = {
  mockupId: string;
  versions: Version[];
  branches: Branch[];
  currentVersionId?: string;
  currentBranchId?: string;
  variant?: 'full' | 'compact' | 'sidebar' | 'modal' | 'minimal';
  darkMode?: boolean;
  className?: string;
  onVersionSelect?: (version: Version) => void;
  onVersionRestore?: (version: Version) => void;
  onVersionCreate?: (name: string, description?: string) => void;
  onVersionDelete?: (version: Version) => void;
  onBranchCreate?: (name: string, fromVersionId: string) => void;
  onBranchSwitch?: (branch: Branch) => void;
  onBranchMerge?: (sourceBranch: Branch, targetBranch: Branch) => void;
  onBranchDelete?: (branch: Branch) => void;
  onExportHistory?: () => void;
  onImportHistory?: (data: unknown) => void;
};

export default function VersionControlSystem({
  versions,
  branches,
  currentVersionId,
  currentBranchId,
  variant = 'full',
  darkMode = false,
  className = '',
  onVersionSelect,
  onVersionRestore,
  onVersionCreate,
  onVersionDelete,
  onBranchCreate,
  onBranchSwitch,
  onBranchMerge,
  onBranchDelete,
  onExportHistory,
}: VersionControlSystemProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'manual' | 'autosave'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState(currentBranchId || branches.find(b => b.isDefault)?.id);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[string?, string?]>([undefined, undefined]);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  const currentBranch = branches.find(b => b.id === selectedBranchId);
  const branchVersions = versions.filter(v => v.branchId === selectedBranchId);

  const filteredVersions = branchVersions.filter((v) => {
    const matchesSearch = !searchQuery
      || v.name.toLowerCase().includes(searchQuery.toLowerCase())
      || v.description?.toLowerCase().includes(searchQuery.toLowerCase())
      || v.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === 'all'
      || (filterType === 'manual' && !v.isAutoSave)
      || (filterType === 'autosave' && v.isAutoSave);

    return matchesSearch && matchesFilter;
  });

  const toggleVersionExpanded = useCallback((versionId: string) => {
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

  const handleCreateVersion = useCallback(() => {
    if (newVersionName.trim() && onVersionCreate) {
      onVersionCreate(newVersionName.trim(), newVersionDescription.trim() || undefined);
      setNewVersionName('');
      setNewVersionDescription('');
      setShowCreateVersion(false);
    }
  }, [newVersionName, newVersionDescription, onVersionCreate]);

  const handleCreateBranch = useCallback(() => {
    if (newBranchName.trim() && currentVersionId && onBranchCreate) {
      onBranchCreate(newBranchName.trim(), currentVersionId);
      setNewBranchName('');
      setShowCreateBranch(false);
    }
  }, [newBranchName, currentVersionId, onBranchCreate]);

  const handleCompareSelect = useCallback((versionId: string) => {
    setCompareVersions((prev) => {
      if (!prev[0]) {
        return [versionId, undefined];
      }
      if (!prev[1]) {
        return [prev[0], versionId];
      }
      return [versionId, undefined];
    });
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    if (days < 7) {
      return `${days}d ago`;
    }
    return date.toLocaleDateString();
  };

  const renderVersion = (version: Version) => {
    const isExpanded = expandedVersions.has(version.id);
    const isCurrent = version.id === currentVersionId;
    const isCompareSelected = compareVersions.includes(version.id);

    return (
      <div
        key={version.id}
        className={`border ${borderColor} overflow-hidden rounded-lg ${
          isCurrent ? 'ring-2 ring-blue-500' : ''
        } ${isCompareSelected ? 'ring-2 ring-purple-500' : ''}`}
      >
        <div
          className={`flex items-center gap-3 p-3 ${hoverBg} cursor-pointer`}
          onClick={() => toggleVersionExpanded(version.id)}
        >
          <button className={`${mutedColor}`}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <GitCommit className={`h-5 w-5 ${version.isAutoSave ? 'text-gray-400' : 'text-blue-500'}`} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${textColor} truncate`}>{version.name}</span>
              {version.isAutoSave && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  Auto
                </span>
              )}
              {isCurrent && (
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  Current
                </span>
              )}
            </div>
            {version.description && (
              <p className={`text-sm ${mutedColor} truncate`}>{version.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            {version.author.avatar
              ? (
                  <img src={version.author.avatar} alt={version.author.name} className="h-6 w-6 rounded-full" />
                )
              : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs">
                    {version.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
            <span className={mutedColor}>{formatDate(version.timestamp)}</span>
          </div>

          {compareMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCompareSelect(version.id);
              }}
              className={`rounded p-1 ${
                isCompareSelected
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900'
                  : `${hoverBg} ${mutedColor}`
              }`}
            >
              {isCompareSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          )}
        </div>

        {isExpanded && (
          <div className={`border-t ${borderColor} p-3 ${cardBg}`}>
            {version.tags && version.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {version.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {version.changes.length > 0 && (
              <div className="mb-3">
                <h4 className={`text-sm font-medium ${textColor} mb-2`}>Changes</h4>
                <ul className="space-y-1">
                  {version.changes.map((change, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className={`
                        mt-1.5 inline-block h-1.5 w-1.5 rounded-full
                        ${change.type === 'add' ? 'bg-green-500' : ''}
                        ${change.type === 'modify' ? 'bg-yellow-500' : ''}
                        ${change.type === 'delete' ? 'bg-red-500' : ''}
                      `}
                      />
                      <span className={mutedColor}>
                        <span className="font-medium">
                          {change.target}
                          :
                        </span>
                        {' '}
                        {change.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => onVersionSelect?.(version)}
                className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${hoverBg} ${textColor}`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              {!isCurrent && (
                <button
                  onClick={() => onVersionRestore?.(version)}
                  className="flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </button>
              )}
              <button
                onClick={() => {
                  setShowCreateBranch(true);
                }}
                className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${hoverBg} ${textColor}`}
              >
                <GitBranch className="h-4 w-4" />
                Branch
              </button>
              <button
                className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${hoverBg} ${mutedColor}`}
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
              {!isCurrent && !version.isAutoSave && (
                <button
                  onClick={() => onVersionDelete?.(version)}
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBranchSelector = () => (
    <div className="relative">
      <button
        onClick={() => setShowBranchDropdown(!showBranchDropdown)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${borderColor} ${hoverBg} ${textColor}`}
      >
        <GitBranch className="h-4 w-4" />
        <span className="font-medium">{currentBranch?.name || 'Select branch'}</span>
        {currentBranch?.isProtected && (
          <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            Protected
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </button>

      {showBranchDropdown && (
        <div className={`absolute top-full left-0 mt-1 w-64 ${bgColor} border ${borderColor} z-10 rounded-lg shadow-lg`}>
          <div className="space-y-1 p-2">
            {branches.map(branch => (
              <button
                key={branch.id}
                onClick={() => {
                  setSelectedBranchId(branch.id);
                  onBranchSwitch?.(branch);
                  setShowBranchDropdown(false);
                }}
                className={`flex w-full items-center gap-2 rounded px-3 py-2 ${
                  branch.id === selectedBranchId ? 'bg-blue-50 dark:bg-blue-900' : hoverBg
                } ${textColor}`}
              >
                <GitBranch className="h-4 w-4" />
                <span className="flex-1 truncate text-left">{branch.name}</span>
                {branch.isDefault && (
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                    Default
                  </span>
                )}
                {branch.id === selectedBranchId && <Check className="h-4 w-4 text-blue-500" />}
              </button>
            ))}
          </div>
          <div className={`border-t ${borderColor} p-2`}>
            <button
              onClick={() => {
                setShowBranchDropdown(false);
                setShowCreateBranch(true);
              }}
              className={`flex w-full items-center gap-2 rounded px-3 py-2 ${hoverBg} ${textColor}`}
            >
              <Plus className="h-4 w-4" />
              Create new branch
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <GitCommit className={`h-4 w-4 ${mutedColor}`} />
        <span className={`text-sm ${textColor}`}>
          {versions.length}
          {' '}
          versions
        </span>
        <span className={mutedColor}>·</span>
        <span className={`text-sm ${mutedColor}`}>
          {formatDate(versions[0]?.timestamp || new Date())}
        </span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border ${borderColor} p-3 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          {renderBranchSelector()}
          <button
            onClick={() => setShowCreateVersion(true)}
            className="flex items-center gap-1 rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Save
          </button>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filteredVersions.slice(0, 5).map(version => (
            <div
              key={version.id}
              onClick={() => onVersionSelect?.(version)}
              className={`flex cursor-pointer items-center gap-3 rounded p-2 ${hoverBg} ${
                version.id === currentVersionId ? 'ring-1 ring-blue-500' : ''
              }`}
            >
              <GitCommit className="h-4 w-4 text-blue-500" />
              <span className={`flex-1 truncate ${textColor}`}>{version.name}</span>
              <span className={`text-xs ${mutedColor}`}>{formatDate(version.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full flex-col ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-3`}>Version History</h3>
          {renderBranchSelector()}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {filteredVersions.map(renderVersion)}
        </div>

        <div className={`border-t p-4 ${borderColor}`}>
          <button
            onClick={() => setShowCreateVersion(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Create Checkpoint
          </button>
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`${bgColor} flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl shadow-xl ${className}`}>
        <div className={`flex items-center justify-between border-b p-4 ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor}`}>Version Control</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportHistory}
              className={`rounded p-2 ${hoverBg} ${mutedColor}`}
              title="Export history"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              className={`rounded p-2 ${hoverBg} ${mutedColor}`}
              title="Import history"
            >
              <Upload className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className={`flex items-center gap-4 border-b p-4 ${borderColor}`}>
          {renderBranchSelector()}

          <div className="relative flex-1">
            <Search className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${mutedColor}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search versions..."
              className={`w-full rounded-lg border py-2 pr-4 pl-9 ${borderColor} ${bgColor} ${textColor}`}
            />
          </div>

          <div className="flex items-center gap-1 rounded-lg border ${borderColor} p-1">
            {(['all', 'manual', 'autosave'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded px-3 py-1 text-sm ${
                  filterType === type
                    ? 'bg-blue-500 text-white'
                    : `${hoverBg} ${textColor}`
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {filteredVersions.map(renderVersion)}
          {filteredVersions.length === 0 && (
            <div className={`py-8 text-center ${mutedColor}`}>
              <GitCommit className="mx-auto mb-2 h-12 w-12 opacity-30" />
              <p>No versions found</p>
            </div>
          )}
        </div>

        <div className={`flex items-center justify-between border-t p-4 ${borderColor}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                compareMode ? 'bg-purple-500 text-white' : `${hoverBg} ${textColor}`
              }`}
            >
              <GitMerge className="h-4 w-4" />
              Compare
            </button>
            {compareMode && compareVersions[0] && compareVersions[1] && (
              <span className={`text-sm ${mutedColor}`}>
                Comparing 2 versions
              </span>
            )}
          </div>
          <button
            onClick={() => setShowCreateVersion(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Create Checkpoint
          </button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b p-4 ${borderColor}`}>
        <div className="flex items-center gap-4">
          <h2 className={`text-xl font-semibold ${textColor}`}>Version Control</h2>
          {renderBranchSelector()}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
              compareMode ? 'bg-purple-500 text-white' : `border ${borderColor} ${hoverBg} ${textColor}`
            }`}
          >
            <GitMerge className="h-4 w-4" />
            {compareMode ? 'Exit Compare' : 'Compare'}
          </button>
          <button
            onClick={onExportHistory}
            className={`rounded-lg border p-2 ${borderColor} ${hoverBg} ${mutedColor}`}
            title="Export history"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowCreateVersion(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            Create Checkpoint
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className={`flex items-center gap-4 border-b p-4 ${borderColor}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${mutedColor}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search versions..."
            className={`w-full rounded-lg border py-2 pr-4 pl-9 ${borderColor} ${bgColor} ${textColor}`}
          />
        </div>

        <div className={`flex items-center gap-2 ${mutedColor}`}>
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filter:</span>
        </div>

        <div className={`flex items-center gap-1 rounded-lg border ${borderColor} p-1`}>
          {(['all', 'manual', 'autosave'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded px-3 py-1 text-sm ${
                filterType === type
                  ? 'bg-blue-500 text-white'
                  : `${hoverBg} ${textColor}`
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Branch info */}
      {currentBranch && (
        <div className={`flex items-center justify-between px-4 py-3 ${cardBg}`}>
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-blue-500" />
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${textColor}`}>{currentBranch.name}</span>
                {currentBranch.isDefault && (
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-300">
                    Default
                  </span>
                )}
              </div>
              {currentBranch.description && (
                <p className={`text-sm ${mutedColor}`}>{currentBranch.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-sm ${mutedColor}`}>
              {branchVersions.length}
              {' '}
              versions
            </span>
            {!currentBranch.isDefault && !currentBranch.isProtected && (
              <>
                <button
                  onClick={() => {
                    const defaultBranch = branches.find(b => b.isDefault);
                    if (defaultBranch) {
                      onBranchMerge?.(currentBranch, defaultBranch);
                    }
                  }}
                  className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${hoverBg} ${textColor}`}
                >
                  <GitMerge className="h-4 w-4" />
                  Merge
                </button>
                <button
                  onClick={() => onBranchDelete?.(currentBranch)}
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Version list */}
      <div className="max-h-[500px] space-y-3 overflow-y-auto p-4">
        {filteredVersions.map(renderVersion)}
        {filteredVersions.length === 0 && (
          <div className={`py-12 text-center ${mutedColor}`}>
            <GitCommit className="mx-auto mb-3 h-16 w-16 opacity-30" />
            <p className="mb-1 text-lg">No versions found</p>
            <p className="text-sm">Create your first checkpoint to start tracking changes</p>
          </div>
        )}
      </div>

      {/* Compare bar */}
      {compareMode && (compareVersions[0] || compareVersions[1]) && (
        <div className={`flex items-center justify-between border-t p-4 ${borderColor} bg-purple-50 dark:bg-purple-900/20`}>
          <div className="flex items-center gap-4">
            <span className={textColor}>
              {compareVersions[0] ? 'Version 1 selected' : 'Select first version'}
            </span>
            <span className={mutedColor}>vs</span>
            <span className={textColor}>
              {compareVersions[1] ? 'Version 2 selected' : 'Select second version'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareVersions([undefined, undefined])}
              className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${hoverBg} ${textColor}`}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
            <button
              disabled={!compareVersions[0] || !compareVersions[1]}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                compareVersions[0] && compareVersions[1]
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              <Eye className="h-4 w-4" />
              View Diff
            </button>
          </div>
        </div>
      )}

      {/* Create version modal */}
      {showCreateVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${bgColor} w-full max-w-md rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Create Checkpoint</h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>Name</label>
                <input
                  type="text"
                  value={newVersionName}
                  onChange={e => setNewVersionName(e.target.value)}
                  placeholder="e.g., Added hero section"
                  className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>Description (optional)</label>
                <textarea
                  value={newVersionDescription}
                  onChange={e => setNewVersionDescription(e.target.value)}
                  placeholder="Describe the changes..."
                  rows={3}
                  className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor} resize-none`}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCreateVersion(false)}
                className={`rounded-lg px-4 py-2 ${hoverBg} ${textColor}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVersion}
                disabled={!newVersionName.trim()}
                className={`rounded-lg px-4 py-2 ${
                  newVersionName.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create branch modal */}
      {showCreateBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${bgColor} w-full max-w-md rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Create Branch</h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textColor} mb-1`}>Branch name</label>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={e => setNewBranchName(e.target.value)}
                  placeholder="e.g., feature/new-header"
                  className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor}`}
                />
              </div>

              <div className={`flex items-center gap-2 rounded-lg p-3 ${cardBg}`}>
                <GitCommit className="h-4 w-4 text-blue-500" />
                <span className={`text-sm ${mutedColor}`}>
                  Branching from current version
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCreateBranch(false)}
                className={`rounded-lg px-4 py-2 ${hoverBg} ${textColor}`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBranch}
                disabled={!newBranchName.trim()}
                className={`rounded-lg px-4 py-2 ${
                  newBranchName.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
              >
                Create Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export preset configurations
export const versionControlPresets = {
  simple: {
    variant: 'compact' as const,
  },
  detailed: {
    variant: 'full' as const,
  },
  panel: {
    variant: 'sidebar' as const,
  },
  dialog: {
    variant: 'modal' as const,
  },
};
