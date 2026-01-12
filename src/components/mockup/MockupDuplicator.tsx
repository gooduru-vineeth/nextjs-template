'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Folder,
  FolderPlus,
  Search,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type MockupInfo = {
  id: string;
  name: string;
  thumbnail?: string;
  type: 'chat' | 'social' | 'ai' | 'email' | 'website' | 'other';
  createdAt: Date;
  updatedAt: Date;
};

export type FolderInfo = {
  id: string;
  name: string;
  parentId?: string;
  mockupCount: number;
};

export type MockupDuplicatorProps = {
  mockup: MockupInfo;
  folders: FolderInfo[];
  currentFolderId?: string;
  variant?: 'full' | 'compact' | 'modal' | 'dropdown' | 'minimal';
  darkMode?: boolean;
  className?: string;
  onDuplicate?: (mockupId: string, targetFolderId?: string, newName?: string) => void;
  onCreateFolder?: (name: string, parentId?: string) => void;
  onCancel?: () => void;
};

export default function MockupDuplicator({
  mockup,
  folders,
  currentFolderId,
  variant = 'full',
  darkMode = false,
  className = '',
  onDuplicate,
  onCreateFolder,
  onCancel,
}: MockupDuplicatorProps) {
  const [newName, setNewName] = useState(`${mockup.name} (Copy)`);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(currentFolderId);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  const rootFolders = folders.filter(f => !f.parentId);
  const getChildFolders = (parentId: string) => folders.filter(f => f.parentId === parentId);

  const filteredFolders = searchQuery
    ? folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : folders;

  const toggleFolderExpanded = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const handleDuplicate = useCallback(async () => {
    if (!newName.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      await onDuplicate?.(mockup.id, selectedFolderId, newName.trim());
    } finally {
      setIsProcessing(false);
    }
  }, [mockup.id, selectedFolderId, newName, onDuplicate]);

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) {
      return;
    }

    onCreateFolder?.(newFolderName.trim(), selectedFolderId);
    setNewFolderName('');
    setShowCreateFolder(false);
  }, [newFolderName, selectedFolderId, onCreateFolder]);

  const getTypeIcon = (type: MockupInfo['type']) => {
    switch (type) {
      case 'chat':
        return '💬';
      case 'social':
        return '📱';
      case 'ai':
        return '🤖';
      case 'email':
        return '📧';
      case 'website':
        return '🌐';
      default:
        return '📄';
    }
  };

  const renderFolderTree = (parentId?: string, depth = 0) => {
    const foldersToRender = parentId
      ? getChildFolders(parentId)
      : rootFolders;

    if (searchQuery) {
      return filteredFolders.map(folder => renderFolderItem(folder, 0));
    }

    return foldersToRender.map(folder => (
      <div key={folder.id}>
        {renderFolderItem(folder, depth)}
        {expandedFolders.has(folder.id) && (
          <div className="ml-4">
            {renderFolderTree(folder.id, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderFolderItem = (folder: FolderInfo, depth: number) => {
    const hasChildren = getChildFolders(folder.id).length > 0;
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div
        key={folder.id}
        onClick={() => setSelectedFolderId(folder.id)}
        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
          isSelected
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            : `${hoverBg} ${textColor}`
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFolderExpanded(folder.id);
            }}
            className={mutedColor}
          >
            {isExpanded
              ? (
                  <ChevronDown className="h-4 w-4" />
                )
              : (
                  <ChevronRight className="h-4 w-4" />
                )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        <Folder className={`h-4 w-4 ${isSelected ? '' : 'text-yellow-500'}`} />
        <span className="flex-1 truncate">{folder.name}</span>
        <span className={`text-xs ${isSelected ? 'text-blue-600 dark:text-blue-400' : mutedColor}`}>
          {folder.mockupCount}
        </span>
        {isSelected && <Check className="h-4 w-4" />}
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <button
        onClick={() => onDuplicate?.(mockup.id, currentFolderId)}
        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${hoverBg} ${textColor} ${className}`}
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </button>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`${bgColor} rounded-lg border ${borderColor} w-64 shadow-lg ${className}`}>
        <div className={`border-b p-3 ${borderColor}`}>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="New name"
            className={`w-full rounded-lg border px-3 py-2 text-sm ${borderColor} ${bgColor} ${textColor}`}
          />
        </div>

        <div className="max-h-48 overflow-y-auto p-2">
          <button
            onClick={() => setSelectedFolderId(undefined)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              !selectedFolderId
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : `${hoverBg} ${textColor}`
            }`}
          >
            <Folder className="h-4 w-4" />
            <span>Root folder</span>
            {!selectedFolderId && <Check className="ml-auto h-4 w-4" />}
          </button>
          {rootFolders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolderId(folder.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                selectedFolderId === folder.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : `${hoverBg} ${textColor}`
              }`}
            >
              <Folder className="h-4 w-4 text-yellow-500" />
              <span className="flex-1 truncate text-left">{folder.name}</span>
              {selectedFolderId === folder.id && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>

        <div className={`border-t p-2 ${borderColor}`}>
          <button
            onClick={handleDuplicate}
            disabled={isProcessing || !newName.trim()}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm ${
              isProcessing || !newName.trim()
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Copy className="h-4 w-4" />
            {isProcessing ? 'Duplicating...' : 'Duplicate'}
          </button>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border ${borderColor} p-4 ${className}`}>
        <div className="mb-4 flex items-center gap-3">
          <div className={`rounded-lg p-2 ${cardBg}`}>
            <Copy className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className={`font-medium ${textColor}`}>Duplicate Mockup</h3>
            <p className={`text-sm ${mutedColor}`}>{mockup.name}</p>
          </div>
        </div>

        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New name"
          className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor} mb-3`}
        />

        <select
          value={selectedFolderId || ''}
          onChange={e => setSelectedFolderId(e.target.value || undefined)}
          className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor} mb-4`}
        >
          <option value="">Root folder</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className={`flex-1 rounded-lg px-4 py-2 ${hoverBg} ${textColor}`}
          >
            Cancel
          </button>
          <button
            onClick={handleDuplicate}
            disabled={isProcessing || !newName.trim()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 ${
              isProcessing || !newName.trim()
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Copy className="h-4 w-4" />
            {isProcessing ? 'Duplicating...' : 'Duplicate'}
          </button>
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`${bgColor} w-full max-w-lg rounded-xl shadow-xl ${className}`}>
        <div className={`flex items-center justify-between border-b p-4 ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor}`}>Duplicate Mockup</h2>
          <button
            onClick={onCancel}
            className={`rounded-lg p-2 ${hoverBg} ${mutedColor}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Mockup preview */}
          <div className={`flex items-center gap-3 rounded-lg p-3 ${cardBg}`}>
            {mockup.thumbnail
              ? (
                  <img
                    src={mockup.thumbnail}
                    alt={mockup.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )
              : (
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-2xl dark:bg-gray-700">
                    {getTypeIcon(mockup.type)}
                  </div>
                )}
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${textColor} truncate`}>{mockup.name}</p>
              <p className={`text-sm ${mutedColor}`}>
                Last updated
                {' '}
                {mockup.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* New name */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>New name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Enter new name"
              className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor}`}
            />
          </div>

          {/* Folder selection */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>Destination folder</label>
            <div className={`rounded-lg border ${borderColor} max-h-48 overflow-y-auto`}>
              <button
                onClick={() => setSelectedFolderId(undefined)}
                className={`flex w-full items-center gap-2 px-3 py-2 ${
                  !selectedFolderId
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : `${hoverBg} ${textColor}`
                }`}
              >
                <Folder className="h-4 w-4" />
                <span>Root folder</span>
                {!selectedFolderId && <Check className="ml-auto h-4 w-4" />}
              </button>
              {renderFolderTree()}
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-end gap-2 border-t p-4 ${borderColor}`}>
          <button
            onClick={onCancel}
            className={`rounded-lg px-4 py-2 ${hoverBg} ${textColor}`}
          >
            Cancel
          </button>
          <button
            onClick={handleDuplicate}
            disabled={isProcessing || !newName.trim()}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              isProcessing || !newName.trim()
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Copy className="h-4 w-4" />
            {isProcessing ? 'Duplicating...' : 'Duplicate'}
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
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${cardBg}`}>
            <Copy className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${textColor}`}>Duplicate Mockup</h2>
            <p className={`text-sm ${mutedColor}`}>Create a copy of your mockup</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className={`rounded-lg p-2 ${hoverBg} ${mutedColor}`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0 dark:divide-gray-700">
        {/* Source mockup */}
        <div className="p-4">
          <h3 className={`text-sm font-medium ${textColor} mb-3`}>Original Mockup</h3>

          <div className={`rounded-lg p-4 ${cardBg}`}>
            {mockup.thumbnail
              ? (
                  <img
                    src={mockup.thumbnail}
                    alt={mockup.name}
                    className="mb-3 h-32 w-full rounded-lg object-cover"
                  />
                )
              : (
                  <div className="mb-3 flex h-32 w-full items-center justify-center rounded-lg bg-gray-200 text-4xl dark:bg-gray-700">
                    {getTypeIcon(mockup.type)}
                  </div>
                )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className={`h-4 w-4 ${mutedColor}`} />
                <span className={`font-medium ${textColor}`}>{mockup.name}</span>
              </div>
              <div className={`text-sm ${mutedColor}`}>
                Type:
                {' '}
                {mockup.type.charAt(0).toUpperCase() + mockup.type.slice(1)}
              </div>
              <div className={`text-sm ${mutedColor}`}>
                Created:
                {' '}
                {mockup.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Destination settings */}
        <div className="space-y-4 p-4">
          <h3 className={`text-sm font-medium ${textColor} mb-3`}>Copy Settings</h3>

          {/* New name */}
          <div>
            <label className={`block text-sm font-medium ${textColor} mb-1`}>New name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Enter new name"
              className={`w-full rounded-lg border px-4 py-2 ${borderColor} ${bgColor} ${textColor}`}
            />
          </div>

          {/* Folder selection */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={`text-sm font-medium ${textColor}`}>Destination folder</label>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
              >
                <FolderPlus className="h-4 w-4" />
                New folder
              </button>
            </div>

            {/* Search folders */}
            <div className="relative mb-2">
              <Search className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 ${mutedColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search folders..."
                className={`w-full rounded-lg border py-2 pr-4 pl-9 ${borderColor} ${bgColor} ${textColor}`}
              />
            </div>

            {/* Folder tree */}
            <div className={`rounded-lg border ${borderColor} max-h-64 overflow-y-auto`}>
              <button
                onClick={() => setSelectedFolderId(undefined)}
                className={`flex w-full items-center gap-2 px-3 py-2 ${
                  !selectedFolderId
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : `${hoverBg} ${textColor}`
                }`}
              >
                <Folder className="h-4 w-4" />
                <span className="flex-1 text-left">Root folder</span>
                {!selectedFolderId && <Check className="h-4 w-4" />}
              </button>
              {renderFolderTree()}
            </div>
          </div>

          {/* Create folder inline */}
          {showCreateFolder && (
            <div className={`rounded-lg p-3 ${cardBg} space-y-2`}>
              <div className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4 text-blue-500" />
                <span className={`text-sm font-medium ${textColor}`}>Create new folder</span>
              </div>
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className={`w-full rounded-lg border px-3 py-2 text-sm ${borderColor} ${bgColor} ${textColor}`}
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className={`rounded px-3 py-1 text-sm ${hoverBg} ${textColor}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className={`rounded px-3 py-1 text-sm ${
                    newFolderName.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'cursor-not-allowed bg-gray-200 text-gray-400'
                  }`}
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between border-t p-4 ${borderColor} ${cardBg}`}>
        <div className={`text-sm ${mutedColor}`}>
          {selectedFolderId
            ? (
                <span>
                  Will be saved to:
                  {' '}
                  <span className="font-medium">{folders.find(f => f.id === selectedFolderId)?.name}</span>
                </span>
              )
            : (
                <span>Will be saved to root folder</span>
              )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className={`rounded-lg px-4 py-2 ${hoverBg} ${textColor}`}
          >
            Cancel
          </button>
          <button
            onClick={handleDuplicate}
            disabled={isProcessing || !newName.trim()}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 ${
              isProcessing || !newName.trim()
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <Copy className="h-4 w-4" />
            {isProcessing ? 'Duplicating...' : 'Duplicate Mockup'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Export preset configurations
export const mockupDuplicatorPresets = {
  quick: {
    variant: 'minimal' as const,
  },
  dropdown: {
    variant: 'dropdown' as const,
  },
  form: {
    variant: 'compact' as const,
  },
  dialog: {
    variant: 'modal' as const,
  },
  detailed: {
    variant: 'full' as const,
  },
};
