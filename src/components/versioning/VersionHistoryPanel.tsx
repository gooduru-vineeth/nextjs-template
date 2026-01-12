'use client';

import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Eye,
  GitBranch,
  GitCommit,
  RotateCcw,
  Star,
  Tag,
  Trash2,
  User,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type VersionAuthor = {
  id: string;
  name: string;
  avatar?: string;
};

export type Version = {
  id: string;
  number: string;
  title: string;
  description?: string;
  author: VersionAuthor;
  timestamp: string;
  isStarred?: boolean;
  isCurrent?: boolean;
  changes?: number;
  tags?: string[];
  preview?: string;
};

export type VersionGroup = {
  id: string;
  label: string;
  date: string;
  versions: Version[];
};

export type VersionHistoryPanelProps = {
  versions: Version[];
  currentVersionId?: string;
  onSelectVersion?: (version: Version) => void;
  onRestoreVersion?: (version: Version) => void;
  onPreviewVersion?: (version: Version) => void;
  onDownloadVersion?: (version: Version) => void;
  onDeleteVersion?: (version: Version) => void;
  onToggleStar?: (versionId: string) => void;
  onCompareVersions?: (v1: Version, v2: Version) => void;
  variant?: 'full' | 'compact' | 'timeline' | 'panel' | 'minimal';
  showPreview?: boolean;
  showActions?: boolean;
  groupByDate?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function VersionHistoryPanel({
  versions,
  currentVersionId,
  onSelectVersion,
  onRestoreVersion,
  onPreviewVersion,
  onDownloadVersion,
  onDeleteVersion,
  onToggleStar,
  onCompareVersions,
  variant = 'full',
  showPreview = true,
  showActions = true,
  groupByDate = true,
  darkMode = false,
  className = '',
}: VersionHistoryPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['today', 'yesterday']));
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[Version | null, Version | null]>([null, null]);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  // Group versions by date
  const groupVersions = useCallback((): VersionGroup[] => {
    if (!groupByDate) {
      return [{ id: 'all', label: 'All Versions', date: '', versions }];
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: VersionGroup[] = [];
    const todayVersions: Version[] = [];
    const yesterdayVersions: Version[] = [];
    const olderVersions: Version[] = [];

    versions.forEach((version) => {
      const vDate = new Date(version.timestamp);
      if (vDate.toDateString() === today.toDateString()) {
        todayVersions.push(version);
      } else if (vDate.toDateString() === yesterday.toDateString()) {
        yesterdayVersions.push(version);
      } else {
        olderVersions.push(version);
      }
    });

    if (todayVersions.length > 0) {
      groups.push({ id: 'today', label: 'Today', date: today.toDateString(), versions: todayVersions });
    }
    if (yesterdayVersions.length > 0) {
      groups.push({ id: 'yesterday', label: 'Yesterday', date: yesterday.toDateString(), versions: yesterdayVersions });
    }
    if (olderVersions.length > 0) {
      groups.push({ id: 'older', label: 'Older', date: '', versions: olderVersions });
    }

    return groups;
  }, [versions, groupByDate]);

  const versionGroups = groupVersions();

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const handleVersionClick = useCallback((version: Version) => {
    if (compareMode) {
      if (!compareVersions[0]) {
        setCompareVersions([version, null]);
      } else if (!compareVersions[1]) {
        setCompareVersions([compareVersions[0], version]);
        onCompareVersions?.(compareVersions[0], version);
      } else {
        setCompareVersions([version, null]);
      }
    } else {
      setSelectedVersion(version);
      onSelectVersion?.(version);
    }
  }, [compareMode, compareVersions, onSelectVersion, onCompareVersions]);

  const renderVersionItem = (version: Version, compact = false) => {
    const isSelected = selectedVersion?.id === version.id;
    const isCurrent = version.isCurrent || version.id === currentVersionId;
    const isCompareSelected = compareVersions[0]?.id === version.id || compareVersions[1]?.id === version.id;

    return (
      <div
        key={version.id}
        onClick={() => handleVersionClick(version)}
        className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors ${
          isSelected || isCompareSelected
            ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
            : `${hoverBg} border border-transparent`
        }`}
      >
        {/* Timeline dot */}
        <div className="flex flex-col items-center pt-1">
          <div className={`h-3 w-3 rounded-full ${isCurrent ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
          {!compact && <div className={`h-full w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mt-1`} />}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${textColor}`}>{version.title}</span>
            {isCurrent && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600 dark:bg-green-900/30 dark:text-green-400">
                Current
              </span>
            )}
            {version.isStarred && <Star size={14} className="text-amber-500" fill="currentColor" />}
          </div>

          <div className="mt-1 flex items-center gap-3">
            <span className={`text-xs ${mutedColor} font-mono`}>
              v
              {version.number}
            </span>
            <span className={`text-xs ${mutedColor}`}>{version.timestamp}</span>
          </div>

          {!compact && version.description && (
            <p className={`text-sm ${mutedColor} mt-1 truncate`}>{version.description}</p>
          )}

          {/* Author and tags */}
          {!compact && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {version.author.avatar
                  ? (
                      <img src={version.author.avatar} alt={version.author.name} className="h-5 w-5 rounded-full" />
                    )
                  : (
                      <div className={`h-5 w-5 rounded-full ${inputBg} flex items-center justify-center`}>
                        <User size={12} className={mutedColor} />
                      </div>
                    )}
                <span className={`text-xs ${mutedColor}`}>{version.author.name}</span>
              </div>

              {version.tags && version.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {version.tags.slice(0, 2).map(tag => (
                    <span key={tag} className={`px-1.5 py-0.5 text-xs ${inputBg} ${mutedColor} rounded`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {version.changes && (
                <span className={`text-xs ${mutedColor}`}>
                  {version.changes}
                  {' '}
                  changes
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && !compact && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation(); onPreviewVersion?.(version);
              }}
              className={`p-1.5 ${mutedColor} ${hoverBg} rounded-lg`}
              title="Preview"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onRestoreVersion?.(version);
              }}
              className={`p-1.5 ${mutedColor} ${hoverBg} rounded-lg`}
              title="Restore"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onToggleStar?.(version.id);
              }}
              className={`p-1.5 ${version.isStarred ? 'text-amber-500' : mutedColor} ${hoverBg} rounded-lg`}
              title="Star"
            >
              <Star size={14} fill={version.isStarred ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} p-3 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Clock size={14} className={mutedColor} />
          <span className={`text-sm ${mutedColor}`}>
            {versions.length}
            {' '}
            versions
          </span>
        </div>
        {versions.slice(0, 3).map(version => (
          <button
            key={version.id}
            onClick={() => onSelectVersion?.(version)}
            className={`w-full rounded-lg p-2 text-left ${hoverBg} text-sm ${textColor}`}
          >
            v
            {version.number}
            {' '}
            -
            {' '}
            {version.title}
          </button>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Version History</h3>
          <span className={`text-xs ${mutedColor}`}>
            {versions.length}
            {' '}
            versions
          </span>
        </div>
        <div className="space-y-1">
          {versions.slice(0, 4).map(v => renderVersionItem(v, true))}
        </div>
        {versions.length > 4 && (
          <button className={`mt-2 w-full py-2 text-sm text-blue-500 ${hoverBg} rounded-lg`}>
            View all versions
          </button>
        )}
      </div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className={`${bgColor} ${className}`}>
        <div className="relative pl-8">
          {/* Timeline line */}
          <div className={`absolute top-0 bottom-0 left-3 w-0.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

          {versions.map((version, index) => {
            const isCurrent = version.isCurrent || version.id === currentVersionId;

            return (
              <div key={version.id} className={`relative pb-6 ${index === versions.length - 1 ? '' : ''}`}>
                {/* Timeline dot */}
                <div className={`absolute -left-5 h-4 w-4 rounded-full border-2 ${
                  isCurrent
                    ? 'border-green-500 bg-green-500'
                    : `${bgColor} ${borderColor}`
                }`}
                />

                {/* Content */}
                <div
                  className={`ml-4 rounded-lg border p-4 ${borderColor} ${hoverBg} cursor-pointer`}
                  onClick={() => handleVersionClick(version)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${textColor}`}>{version.title}</span>
                      <span className={`text-xs ${mutedColor} font-mono`}>
                        v
                        {version.number}
                      </span>
                    </div>
                    <span className={`text-xs ${mutedColor}`}>{version.timestamp}</span>
                  </div>

                  {version.description && (
                    <p className={`text-sm ${mutedColor} mt-1`}>{version.description}</p>
                  )}

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User size={12} className={mutedColor} />
                      <span className={`text-xs ${mutedColor}`}>{version.author.name}</span>
                    </div>
                    {version.changes && (
                      <span className={`text-xs ${mutedColor}`}>
                        {version.changes}
                        {' '}
                        changes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Panel variant
  if (variant === 'panel') {
    return (
      <div className={`${bgColor} flex h-full w-80 flex-col border-l ${borderColor} ${className}`}>
        {/* Header */}
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`font-semibold ${textColor}`}>Version History</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`rounded-lg p-1.5 ${compareMode ? 'bg-blue-500 text-white' : `${mutedColor} ${hoverBg}`}`}
                title="Compare versions"
              >
                <GitBranch size={14} />
              </button>
            </div>
          </div>

          {compareMode && (
            <div className={`p-2 ${inputBg} rounded-lg text-xs ${mutedColor}`}>
              {compareVersions[0] && compareVersions[1]
                ? (
                    <span>
                      Comparing v
                      {compareVersions[0].number}
                      {' '}
                      → v
                      {compareVersions[1].number}
                    </span>
                  )
                : compareVersions[0]
                  ? (
                      <span>Select second version to compare</span>
                    )
                  : (
                      <span>Select two versions to compare</span>
                    )}
            </div>
          )}
        </div>

        {/* Versions list */}
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {versionGroups.map(group => (
            <div key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                className={`flex w-full items-center gap-2 px-2 py-1 ${mutedColor} ${hoverBg} rounded-lg`}
              >
                {expandedGroups.has(group.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-xs font-medium">{group.label}</span>
                <span className="text-xs">
                  (
                  {group.versions.length}
                  )
                </span>
              </button>

              {expandedGroups.has(group.id) && (
                <div className="mt-2 space-y-1">
                  {group.versions.map(v => renderVersionItem(v, true))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-6 ${borderColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>Version History</h2>
            <p className={`${mutedColor} mt-1`}>
              {versions.length}
              {' '}
              versions saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                compareMode ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`
              }`}
            >
              <GitBranch size={16} />
              Compare
            </button>
          </div>
        </div>

        {compareMode && (
          <div className={`mt-4 p-3 ${inputBg} flex items-center gap-3 rounded-lg`}>
            <GitCommit size={16} className={mutedColor} />
            {compareVersions[0]
              ? (
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 ${bgColor} rounded text-sm ${textColor}`}>
                      v
                      {compareVersions[0].number}
                    </span>
                    <ArrowRight size={14} className={mutedColor} />
                    {compareVersions[1]
                      ? (
                          <span className={`px-2 py-1 ${bgColor} rounded text-sm ${textColor}`}>
                            v
                            {compareVersions[1].number}
                          </span>
                        )
                      : (
                          <span className={`text-sm ${mutedColor}`}>Select version</span>
                        )}
                  </div>
                )
              : (
                  <span className={`text-sm ${mutedColor}`}>Select two versions to compare</span>
                )}
            {(compareVersions[0] || compareVersions[1]) && (
              <button
                onClick={() => setCompareVersions([null, null])}
                className={`ml-auto text-sm ${mutedColor} hover:underline`}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex">
        {/* Versions list */}
        <div className={`flex-1 p-6 ${showPreview && selectedVersion ? `border-r ${borderColor}` : ''}`}>
          {versionGroups.map(group => (
            <div key={group.id} className="mb-6">
              <button
                onClick={() => toggleGroup(group.id)}
                className={`mb-3 flex items-center gap-2 ${mutedColor} ${hoverBg} rounded-lg px-2 py-1`}
              >
                {expandedGroups.has(group.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Calendar size={14} />
                <span className="text-sm font-medium">{group.label}</span>
                <span className="text-xs">
                  (
                  {group.versions.length}
                  )
                </span>
              </button>

              {expandedGroups.has(group.id) && (
                <div className="group space-y-2">
                  {group.versions.map(v => renderVersionItem(v))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview panel */}
        {showPreview && selectedVersion && (
          <div className="w-96 p-6">
            <div className="sticky top-6">
              <h3 className={`font-semibold ${textColor} mb-4`}>Preview</h3>

              {/* Preview image */}
              <div className={`aspect-video ${inputBg} mb-4 overflow-hidden rounded-lg`}>
                {selectedVersion.preview
                  ? (
                      <img src={selectedVersion.preview} alt={selectedVersion.title} className="h-full w-full object-cover" />
                    )
                  : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Eye size={32} className={mutedColor} />
                      </div>
                    )}
              </div>

              {/* Version details */}
              <div className="space-y-3">
                <div>
                  <span className={`text-xs ${mutedColor}`}>Title</span>
                  <p className={`font-medium ${textColor}`}>{selectedVersion.title}</p>
                </div>

                <div>
                  <span className={`text-xs ${mutedColor}`}>Version</span>
                  <p className={`font-mono ${textColor}`}>
                    v
                    {selectedVersion.number}
                  </p>
                </div>

                {selectedVersion.description && (
                  <div>
                    <span className={`text-xs ${mutedColor}`}>Description</span>
                    <p className={`text-sm ${textColor}`}>{selectedVersion.description}</p>
                  </div>
                )}

                <div>
                  <span className={`text-xs ${mutedColor}`}>Author</span>
                  <div className="mt-1 flex items-center gap-2">
                    {selectedVersion.author.avatar
                      ? (
                          <img src={selectedVersion.author.avatar} alt={selectedVersion.author.name} className="h-6 w-6 rounded-full" />
                        )
                      : (
                          <div className={`h-6 w-6 rounded-full ${inputBg} flex items-center justify-center`}>
                            <User size={14} className={mutedColor} />
                          </div>
                        )}
                    <span className={textColor}>{selectedVersion.author.name}</span>
                  </div>
                </div>

                {selectedVersion.tags && selectedVersion.tags.length > 0 && (
                  <div>
                    <span className={`text-xs ${mutedColor}`}>Tags</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedVersion.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 text-xs ${inputBg} ${mutedColor} rounded`}>
                          <Tag size={10} className="mr-1 inline" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => onRestoreVersion?.(selectedVersion)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
                  >
                    <RotateCcw size={16} />
                    Restore
                  </button>
                  <button
                    onClick={() => onDownloadVersion?.(selectedVersion)}
                    className={`p-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteVersion?.(selectedVersion)}
                    className={`p-2 ${inputBg} rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
