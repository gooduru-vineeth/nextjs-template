'use client';

import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import { useEffect } from 'react';
import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

type KeyboardShortcutsHelpProps = {
  shortcuts: KeyboardShortcut[];
  onClose: () => void;
};

export function KeyboardShortcutsHelp({ shortcuts, onClose }: KeyboardShortcutsHelpProps) {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Group shortcuts by category
  const categories = {
    'File Operations': shortcuts.filter(s =>
      ['s', 'e', 'n'].includes(s.key.toLowerCase()) && s.modifiers?.ctrl,
    ),
    'Navigation': shortcuts.filter(s =>
      ['1', '2', '3', '4', '5', '6', 't'].includes(s.key.toLowerCase()) && s.modifiers?.ctrl,
    ),
    'Editor Actions': shortcuts.filter(s =>
      ['z', 'd', 'Enter'].includes(s.key),
    ),
    'View': shortcuts.filter(s =>
      ['/', '?'].includes(s.key) || s.key === 'Escape',
    ),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-6 p-4">
          {Object.entries(categories).map(([category, categoryShortcuts]) => (
            categoryShortcuts.length > 0 && (
              <div key={category}>
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <kbd className="ml-4 shrink-0 rounded bg-gray-200 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
          Press
          {' '}
          <kbd className="rounded bg-gray-200 px-1.5 py-0.5 font-mono dark:bg-gray-600">?</kbd>
          {' '}
          anytime to show this help
        </div>
      </div>
    </div>
  );
}
