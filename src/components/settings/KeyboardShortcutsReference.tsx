'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Command,
  Copy,
  Keyboard,
  Printer,
  Search,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ShortcutCategory = 'general' | 'editing' | 'navigation' | 'export' | 'collaboration' | 'view';
type ReferenceVariant = 'full' | 'compact' | 'modal' | 'tooltip';

type KeyboardShortcut = {
  id: string;
  action: string;
  description: string;
  keys: string[];
  category: ShortcutCategory;
  isCustom?: boolean;
  platform?: 'all' | 'mac' | 'windows';
};

type ShortcutGroup = {
  category: ShortcutCategory;
  label: string;
  icon: React.ReactNode;
  shortcuts: KeyboardShortcut[];
};

export type KeyboardShortcutsReferenceProps = {
  variant?: ReferenceVariant;
  shortcuts?: KeyboardShortcut[];
  onClose?: () => void;
  className?: string;
};

// Default shortcuts
const defaultShortcuts: KeyboardShortcut[] = [
  // General
  { id: '1', action: 'Save', description: 'Save current mockup', keys: ['⌘', 'S'], category: 'general', platform: 'mac' },
  { id: '2', action: 'Save', description: 'Save current mockup', keys: ['Ctrl', 'S'], category: 'general', platform: 'windows' },
  { id: '3', action: 'Save As', description: 'Save as new file', keys: ['⌘', 'Shift', 'S'], category: 'general', platform: 'mac' },
  { id: '4', action: 'New Mockup', description: 'Create new mockup', keys: ['⌘', 'N'], category: 'general', platform: 'mac' },
  { id: '5', action: 'Open', description: 'Open existing mockup', keys: ['⌘', 'O'], category: 'general', platform: 'mac' },
  { id: '6', action: 'Duplicate', description: 'Duplicate current mockup', keys: ['⌘', 'D'], category: 'general', platform: 'mac' },
  { id: '7', action: 'Delete', description: 'Delete selected item', keys: ['⌫'], category: 'general' },
  { id: '8', action: 'Quick Actions', description: 'Open quick actions menu', keys: ['⌘', 'K'], category: 'general', platform: 'mac' },

  // Editing
  { id: '10', action: 'Undo', description: 'Undo last action', keys: ['⌘', 'Z'], category: 'editing', platform: 'mac' },
  { id: '11', action: 'Redo', description: 'Redo last action', keys: ['⌘', 'Shift', 'Z'], category: 'editing', platform: 'mac' },
  { id: '12', action: 'Cut', description: 'Cut selected element', keys: ['⌘', 'X'], category: 'editing', platform: 'mac' },
  { id: '13', action: 'Copy', description: 'Copy selected element', keys: ['⌘', 'C'], category: 'editing', platform: 'mac' },
  { id: '14', action: 'Paste', description: 'Paste copied element', keys: ['⌘', 'V'], category: 'editing', platform: 'mac' },
  { id: '15', action: 'Select All', description: 'Select all elements', keys: ['⌘', 'A'], category: 'editing', platform: 'mac' },
  { id: '16', action: 'Add Message', description: 'Add new message', keys: ['⌘', 'Enter'], category: 'editing', platform: 'mac' },
  { id: '17', action: 'Toggle Sender', description: 'Switch message sender', keys: ['Tab'], category: 'editing' },

  // Navigation
  { id: '20', action: 'Next Message', description: 'Move to next message', keys: ['↓'], category: 'navigation' },
  { id: '21', action: 'Previous Message', description: 'Move to previous message', keys: ['↑'], category: 'navigation' },
  { id: '22', action: 'First Message', description: 'Go to first message', keys: ['⌘', '↑'], category: 'navigation', platform: 'mac' },
  { id: '23', action: 'Last Message', description: 'Go to last message', keys: ['⌘', '↓'], category: 'navigation', platform: 'mac' },
  { id: '24', action: 'Go to Dashboard', description: 'Return to dashboard', keys: ['⌘', 'Shift', 'D'], category: 'navigation', platform: 'mac' },
  { id: '25', action: 'Next Tab', description: 'Switch to next tab', keys: ['⌘', ']'], category: 'navigation', platform: 'mac' },
  { id: '26', action: 'Previous Tab', description: 'Switch to previous tab', keys: ['⌘', '['], category: 'navigation', platform: 'mac' },

  // Export
  { id: '30', action: 'Quick Export', description: 'Export as PNG', keys: ['⌘', 'E'], category: 'export', platform: 'mac' },
  { id: '31', action: 'Export Options', description: 'Open export dialog', keys: ['⌘', 'Shift', 'E'], category: 'export', platform: 'mac' },
  { id: '32', action: 'Copy to Clipboard', description: 'Copy mockup as image', keys: ['⌘', 'Shift', 'C'], category: 'export', platform: 'mac' },
  { id: '33', action: 'Download All', description: 'Download all mockups', keys: ['⌘', 'Shift', 'D'], category: 'export', platform: 'mac' },

  // Collaboration
  { id: '40', action: 'Share', description: 'Share mockup', keys: ['⌘', 'Shift', 'S'], category: 'collaboration', platform: 'mac' },
  { id: '41', action: 'Add Comment', description: 'Add a comment', keys: ['⌘', 'Shift', 'M'], category: 'collaboration', platform: 'mac' },
  { id: '42', action: 'Show Comments', description: 'Toggle comment panel', keys: ['⌘', '/'], category: 'collaboration', platform: 'mac' },

  // View
  { id: '50', action: 'Zoom In', description: 'Zoom in', keys: ['⌘', '+'], category: 'view', platform: 'mac' },
  { id: '51', action: 'Zoom Out', description: 'Zoom out', keys: ['⌘', '-'], category: 'view', platform: 'mac' },
  { id: '52', action: 'Reset Zoom', description: 'Reset to 100%', keys: ['⌘', '0'], category: 'view', platform: 'mac' },
  { id: '53', action: 'Full Screen', description: 'Toggle full screen', keys: ['F'], category: 'view' },
  { id: '54', action: 'Preview Mode', description: 'Toggle preview mode', keys: ['P'], category: 'view' },
  { id: '55', action: 'Dark Mode', description: 'Toggle dark mode', keys: ['⌘', 'Shift', 'L'], category: 'view', platform: 'mac' },
  { id: '56', action: 'Grid', description: 'Toggle grid overlay', keys: ['G'], category: 'view' },
];

const categoryLabels: Record<ShortcutCategory, string> = {
  general: 'General',
  editing: 'Editing',
  navigation: 'Navigation',
  export: 'Export',
  collaboration: 'Collaboration',
  view: 'View',
};

export default function KeyboardShortcutsReference({
  variant = 'full',
  shortcuts = defaultShortcuts,
  onClose,
  className = '',
}: KeyboardShortcutsReferenceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<ShortcutCategory>>(
    new Set(['general', 'editing', 'navigation', 'export', 'collaboration', 'view']),
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [platform] = useState<'mac' | 'windows'>('mac');

  const filteredShortcuts = shortcuts.filter((s) => {
    const matchesSearch = !searchQuery
      || s.action.toLowerCase().includes(searchQuery.toLowerCase())
      || s.description.toLowerCase().includes(searchQuery.toLowerCase())
      || s.keys.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = !s.platform || s.platform === 'all' || s.platform === platform;
    return matchesSearch && matchesPlatform;
  });

  const groupedShortcuts = filteredShortcuts.reduce((groups, shortcut) => {
    if (!groups[shortcut.category]) {
      groups[shortcut.category] = [];
    }
    groups[shortcut.category]!.push(shortcut);
    return groups;
  }, {} as Record<ShortcutCategory, KeyboardShortcut[]>);

  const toggleCategory = useCallback((category: ShortcutCategory) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  const handleCopyShortcut = useCallback((shortcut: KeyboardShortcut) => {
    navigator.clipboard.writeText(shortcut.keys.join(' + '));
    setCopiedId(shortcut.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const renderKeys = (keys: string[]) => (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="flex items-center gap-1">
          <kbd className="rounded border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {key}
          </kbd>
          {i < keys.length - 1 && <span className="text-gray-400">+</span>}
        </span>
      ))}
    </div>
  );

  // Tooltip variant - minimal
  if (variant === 'tooltip') {
    return (
      <div className={`rounded-lg bg-gray-900 p-3 text-white shadow-xl ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          <span className="text-sm font-medium">Shortcuts</span>
        </div>
        <div className="space-y-1">
          {filteredShortcuts.slice(0, 5).map(shortcut => (
            <div key={shortcut.id} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-300">{shortcut.action}</span>
              {renderKeys(shortcut.keys)}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">Press ? for more</p>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center gap-2 border-b border-gray-200 p-3 dark:border-gray-800">
          <Keyboard className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Shortcuts</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="border-b border-gray-200 last:border-0 dark:border-gray-800">
              <button
                onClick={() => toggleCategory(category as ShortcutCategory)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {categoryLabels[category as ShortcutCategory]}
                {expandedCategories.has(category as ShortcutCategory)
                  ? (
                      <ChevronDown className="h-4 w-4" />
                    )
                  : (
                      <ChevronRight className="h-4 w-4" />
                    )}
              </button>
              {expandedCategories.has(category as ShortcutCategory) && (
                <div className="space-y-1 px-3 pb-2">
                  {categoryShortcuts.map(shortcut => (
                    <div key={shortcut.id} className="flex items-center justify-between py-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{shortcut.action}</span>
                      {renderKeys(shortcut.keys)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className={`max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-900 ${className}`}>
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </h3>
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="max-h-96 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="p-4">
                <h4 className="mb-3 text-sm font-medium tracking-wider text-gray-500 uppercase">
                  {categoryLabels[category as ShortcutCategory]}
                </h4>
                <div className="grid gap-2">
                  {categoryShortcuts.map(shortcut => (
                    <div
                      key={shortcut.id}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{shortcut.action}</p>
                        <p className="text-sm text-gray-500">{shortcut.description}</p>
                      </div>
                      {renderKeys(shortcut.keys)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </h2>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search shortcuts..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Shortcuts list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category as ShortcutCategory)}
              className="flex w-full items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {categoryLabels[category as ShortcutCategory]}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {categoryShortcuts.length}
                  {' '}
                  shortcuts
                </span>
                {expandedCategories.has(category as ShortcutCategory)
                  ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )
                  : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
              </div>
            </button>

            {expandedCategories.has(category as ShortcutCategory) && (
              <div className="px-4 pb-4">
                <div className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Shortcut</th>
                        <th className="w-12 px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryShortcuts.map(shortcut => (
                        <tr key={shortcut.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                            {shortcut.action}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {shortcut.description}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {renderKeys(shortcut.keys)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleCopyShortcut(shortcut)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              title="Copy shortcut"
                            >
                              {copiedId === shortcut.id
                                ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  )
                                : (
                                    <Copy className="h-4 w-4" />
                                  )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <Command className="h-4 w-4" />
          Press
          {' '}
          <kbd className="rounded border bg-white px-1.5 py-0.5 text-xs dark:bg-gray-700">?</kbd>
          {' '}
          to toggle this reference
        </p>
      </div>
    </div>
  );
}

export type { KeyboardShortcut, ReferenceVariant, ShortcutCategory, ShortcutGroup };
