'use client';

import {
  Clock,
  Command,
  Copy,
  Download,
  FileText,
  Image,
  Keyboard,
  Maximize2,
  MessageSquare,
  Palette,
  Plus,
  Redo2,
  Save,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  Undo2,
  Users,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Types
type ActionCategory = 'file' | 'edit' | 'view' | 'mockup' | 'export' | 'settings';

type QuickAction = {
  id: string;
  label: string;
  description?: string;
  category: ActionCategory;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  starred?: boolean;
};

type QuickActionsMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  actions?: QuickAction[];
  recentActions?: string[];
  onActionSelect?: (actionId: string) => void;
  className?: string;
};

// Default actions
const defaultActions: QuickAction[] = [
  // File actions
  { id: 'new-mockup', label: 'New Mockup', description: 'Create a new mockup', category: 'file', icon: <Plus className="h-4 w-4" />, shortcut: '⌘N', action: () => {} },
  { id: 'save', label: 'Save', description: 'Save current mockup', category: 'file', icon: <Save className="h-4 w-4" />, shortcut: '⌘S', action: () => {} },
  { id: 'save-as', label: 'Save As...', description: 'Save with a new name', category: 'file', icon: <Save className="h-4 w-4" />, shortcut: '⌘⇧S', action: () => {} },
  { id: 'duplicate', label: 'Duplicate', description: 'Duplicate current mockup', category: 'file', icon: <Copy className="h-4 w-4" />, shortcut: '⌘D', action: () => {} },

  // Edit actions
  { id: 'undo', label: 'Undo', description: 'Undo last action', category: 'edit', icon: <Undo2 className="h-4 w-4" />, shortcut: '⌘Z', action: () => {} },
  { id: 'redo', label: 'Redo', description: 'Redo last action', category: 'edit', icon: <Redo2 className="h-4 w-4" />, shortcut: '⌘⇧Z', action: () => {} },
  { id: 'delete', label: 'Delete', description: 'Delete selected', category: 'edit', icon: <Trash2 className="h-4 w-4" />, shortcut: '⌫', action: () => {} },

  // View actions
  { id: 'zoom-in', label: 'Zoom In', description: 'Increase zoom level', category: 'view', icon: <ZoomIn className="h-4 w-4" />, shortcut: '⌘+', action: () => {} },
  { id: 'zoom-out', label: 'Zoom Out', description: 'Decrease zoom level', category: 'view', icon: <ZoomOut className="h-4 w-4" />, shortcut: '⌘-', action: () => {} },
  { id: 'fit-to-screen', label: 'Fit to Screen', description: 'Fit mockup to screen', category: 'view', icon: <Maximize2 className="h-4 w-4" />, shortcut: '⌘0', action: () => {} },
  { id: 'fullscreen', label: 'Fullscreen', description: 'Enter fullscreen mode', category: 'view', icon: <Maximize2 className="h-4 w-4" />, shortcut: 'F', action: () => {} },

  // Mockup actions
  { id: 'add-message', label: 'Add Message', description: 'Add a new message', category: 'mockup', icon: <MessageSquare className="h-4 w-4" />, shortcut: '⌘Enter', action: () => {} },
  { id: 'add-participant', label: 'Add Participant', description: 'Add a new participant', category: 'mockup', icon: <Users className="h-4 w-4" />, action: () => {} },
  { id: 'add-image', label: 'Add Image', description: 'Add an image attachment', category: 'mockup', icon: <Image className="h-4 w-4" />, action: () => {} },
  { id: 'change-theme', label: 'Change Theme', description: 'Switch light/dark mode', category: 'mockup', icon: <Palette className="h-4 w-4" />, action: () => {} },

  // Export actions
  { id: 'export-png', label: 'Export PNG', description: 'Export as PNG image', category: 'export', icon: <Download className="h-4 w-4" />, shortcut: '⌘⇧E', action: () => {} },
  { id: 'export-pdf', label: 'Export PDF', description: 'Export as PDF document', category: 'export', icon: <FileText className="h-4 w-4" />, action: () => {} },
  { id: 'share', label: 'Share', description: 'Share mockup link', category: 'export', icon: <Share2 className="h-4 w-4" />, shortcut: '⌘⇧S', action: () => {} },
  { id: 'copy-image', label: 'Copy as Image', description: 'Copy to clipboard', category: 'export', icon: <Copy className="h-4 w-4" />, shortcut: '⌘⇧C', action: () => {} },

  // Settings actions
  { id: 'preferences', label: 'Preferences', description: 'Open preferences', category: 'settings', icon: <Settings className="h-4 w-4" />, shortcut: '⌘,', action: () => {} },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View all shortcuts', category: 'settings', icon: <Keyboard className="h-4 w-4" />, shortcut: '?', action: () => {} },
];

const categoryLabels: Record<ActionCategory, string> = {
  file: 'File',
  edit: 'Edit',
  view: 'View',
  mockup: 'Mockup',
  export: 'Export',
  settings: 'Settings',
};

const categoryIcons: Record<ActionCategory, React.ReactNode> = {
  file: <FileText className="h-4 w-4" />,
  edit: <Undo2 className="h-4 w-4" />,
  view: <ZoomIn className="h-4 w-4" />,
  mockup: <MessageSquare className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

export default function QuickActionsMenu({
  isOpen,
  onClose,
  actions = defaultActions,
  recentActions = [],
  onActionSelect,
  className = '',
}: QuickActionsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [starredActions, setStarredActions] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter actions based on search
  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase())
    || action.description?.toLowerCase().includes(searchQuery.toLowerCase())
    || action.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get recent actions
  const recentActionItems = recentActions
    .map(id => actions.find(a => a.id === id))
    .filter(Boolean) as QuickAction[];

  // Get starred actions
  const starredActionItems = actions.filter(a => starredActions.has(a.id));

  // Group actions by category
  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category]!.push(action);
    return acc;
  }, {} as Record<ActionCategory, QuickAction[]>);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            handleActionSelect(filteredActions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[data-action-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleActionSelect = useCallback((action: QuickAction) => {
    action.action();
    onActionSelect?.(action.id);
    onClose();
  }, [onActionSelect, onClose]);

  const toggleStarred = useCallback((actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredActions((prev) => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu */}
      <div className={`fixed top-[20%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2 ${className}`}>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <Command className="h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none dark:text-white"
            />
            <kbd className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700">
              ESC
            </kbd>
          </div>

          {/* Actions list */}
          <div ref={listRef} className="max-h-96 overflow-y-auto p-2">
            {/* Recent actions */}
            {!searchQuery && recentActionItems.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
                  <Clock className="h-3 w-3" />
                  Recent
                </div>
                {recentActionItems.map((action, i) => (
                  <ActionItem
                    key={`recent-${action.id}`}
                    action={action}
                    isSelected={selectedIndex === i}
                    isStarred={starredActions.has(action.id)}
                    onSelect={() => handleActionSelect(action)}
                    onToggleStar={e => toggleStarred(action.id, e)}
                  />
                ))}
              </div>
            )}

            {/* Starred actions */}
            {!searchQuery && starredActionItems.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
                  <Star className="h-3 w-3" />
                  Starred
                </div>
                {starredActionItems.map(action => (
                  <ActionItem
                    key={`starred-${action.id}`}
                    action={action}
                    isSelected={false}
                    isStarred={true}
                    onSelect={() => handleActionSelect(action)}
                    onToggleStar={e => toggleStarred(action.id, e)}
                  />
                ))}
              </div>
            )}

            {/* Grouped actions */}
            {searchQuery ? (
              // Search results
              filteredActions.length > 0
                ? (
                    <div>
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
                        <Search className="h-3 w-3" />
                        Results (
                        {filteredActions.length}
                        )
                      </div>
                      {filteredActions.map((action, i) => (
                        <ActionItem
                          key={action.id}
                          action={action}
                          isSelected={selectedIndex === i}
                          isStarred={starredActions.has(action.id)}
                          onSelect={() => handleActionSelect(action)}
                          onToggleStar={e => toggleStarred(action.id, e)}
                        />
                      ))}
                    </div>
                  )
                : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <Search className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                      <p>
                        No actions found for &quot;
                        {searchQuery}
                        &quot;
                      </p>
                    </div>
                  )
            ) : (
              // Categorized view
              Object.entries(groupedActions).map(([category, categoryActions]) => (
                <div key={category} className="mb-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 uppercase">
                    {categoryIcons[category as ActionCategory]}
                    {categoryLabels[category as ActionCategory]}
                  </div>
                  {categoryActions.map((action) => {
                    const globalIndex = filteredActions.indexOf(action);
                    return (
                      <ActionItem
                        key={action.id}
                        action={action}
                        isSelected={selectedIndex === globalIndex}
                        isStarred={starredActions.has(action.id)}
                        onSelect={() => handleActionSelect(action)}
                        onToggleStar={e => toggleStarred(action.id, e)}
                      />
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">↵</kbd>
                Select
              </span>
            </div>
            <span>
              <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">⌘K</kbd>
              to open
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Action item component
function ActionItem({
  action,
  isSelected,
  isStarred,
  onSelect,
  onToggleStar,
}: {
  action: QuickAction;
  isSelected: boolean;
  isStarred: boolean;
  onSelect: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      data-action-item
      onClick={onSelect}
      className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className={`text-gray-400 ${isSelected ? 'text-blue-600 dark:text-blue-400' : ''}`}>
        {action.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
          {action.label}
        </p>
        {action.description && (
          <p className="truncate text-xs text-gray-500">{action.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStar}
          className={`rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
            isStarred ? 'text-yellow-500 opacity-100' : 'text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} />
        </button>
        {action.shortcut && (
          <kbd className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-500 dark:bg-gray-700">
            {action.shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
}

export type { ActionCategory, QuickAction, QuickActionsMenuProps };
