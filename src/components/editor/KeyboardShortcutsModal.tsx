'use client';

import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { useCallback, useEffect, useState } from 'react';
import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

// Default shortcuts for the mockup editor
export const DEFAULT_EDITOR_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
  // File operations
  { key: 'n', modifiers: { ctrl: true }, description: 'New mockup' },
  { key: 'o', modifiers: { ctrl: true }, description: 'Open mockup' },
  { key: 's', modifiers: { ctrl: true }, description: 'Save mockup' },

  // Editing
  { key: 'z', modifiers: { ctrl: true }, description: 'Undo' },
  { key: 'z', modifiers: { ctrl: true, shift: true }, description: 'Redo' },
  { key: 'y', modifiers: { ctrl: true }, description: 'Redo (alternative)' },
  { key: 'a', modifiers: { ctrl: true }, description: 'Select all messages' },
  { key: 'd', modifiers: { ctrl: true }, description: 'Duplicate selected' },
  { key: 'Delete', description: 'Delete selected' },
  { key: 'Backspace', description: 'Delete selected' },
  { key: 'Enter', modifiers: { ctrl: true }, description: 'Add new message' },

  // Export
  { key: 'e', modifiers: { ctrl: true }, description: 'Export mockup' },
  { key: 'e', modifiers: { ctrl: true, shift: true }, description: 'Quick export as PNG' },
  { key: 'p', modifiers: { ctrl: true }, description: 'Preview mockup' },
  { key: 'c', modifiers: { ctrl: true, shift: true }, description: 'Copy to clipboard' },

  // View
  { key: '+', modifiers: { ctrl: true }, description: 'Zoom in' },
  { key: '-', modifiers: { ctrl: true }, description: 'Zoom out' },
  { key: '0', modifiers: { ctrl: true }, description: 'Reset zoom' },
  { key: 'f', modifiers: { ctrl: true }, description: 'Toggle fullscreen' },

  // Navigation
  { key: 'ArrowUp', modifiers: { alt: true }, description: 'Move message up' },
  { key: 'ArrowDown', modifiers: { alt: true }, description: 'Move message down' },
  { key: '/', modifiers: { ctrl: true }, description: 'Focus search' },
  { key: 'k', modifiers: { ctrl: true }, description: 'Open command palette' },

  // General
  { key: '?', modifiers: { shift: true }, description: 'Show keyboard shortcuts' },
  { key: 'Escape', description: 'Close modal / deselect' },
  { key: ',', modifiers: { ctrl: true }, description: 'Open settings' },
];

// Group shortcuts by category for display
type ShortcutCategory = {
  name: string;
  shortcuts: Omit<KeyboardShortcut, 'action'>[];
};

function categorizeShortcuts(shortcuts: Omit<KeyboardShortcut, 'action'>[]): ShortcutCategory[] {
  const categories: Record<string, Omit<KeyboardShortcut, 'action'>[]> = {
    'File Operations': [],
    'Editing': [],
    'Export': [],
    'View': [],
    'Navigation': [],
    'General': [],
  };

  for (const shortcut of shortcuts) {
    const desc = shortcut.description.toLowerCase();
    if (desc.includes('new') || desc.includes('open') || desc.includes('save')) {
      categories['File Operations']!.push(shortcut);
    } else if (desc.includes('undo') || desc.includes('redo') || desc.includes('select') || desc.includes('duplicate') || desc.includes('delete') || desc.includes('add')) {
      categories.Editing!.push(shortcut);
    } else if (desc.includes('export') || desc.includes('copy') || desc.includes('preview')) {
      categories.Export!.push(shortcut);
    } else if (desc.includes('zoom') || desc.includes('fullscreen')) {
      categories.View!.push(shortcut);
    } else if (desc.includes('move') || desc.includes('search') || desc.includes('command') || desc.includes('palette')) {
      categories.Navigation!.push(shortcut);
    } else {
      categories.General!.push(shortcut);
    }
  }

  return Object.entries(categories)
    .filter(([, items]) => items.length > 0)
    .map(([name, items]) => ({ name, shortcuts: items }));
}

type KeyboardShortcutsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = categorizeShortcuts(DEFAULT_EDITOR_SHORTCUTS);

  // Filter shortcuts based on search
  const filteredCategories = searchQuery
    ? categories.map(cat => ({
        name: cat.name,
        shortcuts: cat.shortcuts.filter(s =>
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
          || s.key.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      })).filter(cat => cat.shortcuts.length > 0)
    : categories;

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Keyboard Shortcuts
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Press
              {' '}
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-700">
                Shift + ?
              </kbd>
              {' '}
              anytime to show this dialog
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="relative">
            <svg
              className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="max-h-[50vh] overflow-y-auto p-4">
          {filteredCategories.length === 0
            ? (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No shortcuts found for &ldquo;
                  {searchQuery}
                  &rdquo;
                </div>
              )
            : (
                <div className="space-y-6">
                  {filteredCategories.map(category => (
                    <div key={category.name}>
                      <h3 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        {category.name}
                      </h3>
                      <div className="space-y-2">
                        {category.shortcuts.map((shortcut, index) => (
                          <div
                            key={`${shortcut.key}-${index}`}
                            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50"
                          >
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {shortcut.description}
                            </span>
                            <kbd className="rounded bg-gray-200 px-2 py-1 font-mono text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                              {formatShortcut(shortcut as KeyboardShortcut)}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
          <span className="font-medium">Tip:</span>
          {' '}
          On macOS, use
          {' '}
          <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-600">⌘</kbd>
          {' '}
          instead of Ctrl
        </div>
      </div>
    </div>
  );
}

// Hook to easily add shortcut modal to any component
export function useShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  // Listen for Shift+? to open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  return {
    isOpen,
    open,
    close,
    toggle,
    Modal: () => <KeyboardShortcutsModal isOpen={isOpen} onClose={close} />,
  };
}
