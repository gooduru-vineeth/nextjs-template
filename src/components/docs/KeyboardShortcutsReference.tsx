'use client';

import { useState } from 'react';

type ShortcutGroup = {
  title: string;
  icon: React.ReactNode;
  shortcuts: {
    keys: string[];
    description: string;
    macKeys?: string[];
  }[];
};

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'General',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    shortcuts: [
      { keys: ['Ctrl', 'S'], macKeys: ['Cmd', 'S'], description: 'Save draft' },
      { keys: ['Ctrl', 'Z'], macKeys: ['Cmd', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], macKeys: ['Cmd', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'Y'], macKeys: ['Cmd', 'Y'], description: 'Redo (alternative)' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Escape'], description: 'Close dialogs / Cancel' },
    ],
  },
  {
    title: 'Editor',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    shortcuts: [
      { keys: ['Ctrl', 'Enter'], macKeys: ['Cmd', 'Enter'], description: 'Add new message' },
      { keys: ['Ctrl', 'D'], macKeys: ['Cmd', 'D'], description: 'Toggle dark/light theme' },
      { keys: ['Ctrl', 'T'], macKeys: ['Cmd', 'T'], description: 'Open templates' },
      { keys: ['Ctrl', 'E'], macKeys: ['Cmd', 'E'], description: 'Open export panel' },
      { keys: ['Tab'], description: 'Move to next input field' },
      { keys: ['Shift', 'Tab'], description: 'Move to previous input field' },
    ],
  },
  {
    title: 'Platform Switching',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    shortcuts: [
      { keys: ['Ctrl', '1'], macKeys: ['Cmd', '1'], description: 'Switch to WhatsApp' },
      { keys: ['Ctrl', '2'], macKeys: ['Cmd', '2'], description: 'Switch to iMessage' },
      { keys: ['Ctrl', '3'], macKeys: ['Cmd', '3'], description: 'Switch to Discord' },
      { keys: ['Ctrl', '4'], macKeys: ['Cmd', '4'], description: 'Switch to Telegram' },
      { keys: ['Ctrl', '5'], macKeys: ['Cmd', '5'], description: 'Switch to Messenger' },
      { keys: ['Ctrl', '6'], macKeys: ['Cmd', '6'], description: 'Switch to Slack' },
    ],
  },
  {
    title: 'Text Formatting',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    shortcuts: [
      { keys: ['Ctrl', 'B'], macKeys: ['Cmd', 'B'], description: 'Bold text' },
      { keys: ['Ctrl', 'I'], macKeys: ['Cmd', 'I'], description: 'Italic text' },
      { keys: ['Ctrl', 'U'], macKeys: ['Cmd', 'U'], description: 'Underline text' },
      { keys: ['Ctrl', '`'], macKeys: ['Cmd', '`'], description: 'Code formatting' },
      { keys: ['Ctrl', 'K'], macKeys: ['Cmd', 'K'], description: 'Insert link' },
    ],
  },
  {
    title: 'Messages',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    shortcuts: [
      { keys: ['Delete'], description: 'Delete selected message' },
      { keys: ['Ctrl', 'D'], macKeys: ['Cmd', 'D'], description: 'Duplicate message' },
      { keys: ['Arrow Up'], description: 'Move message up' },
      { keys: ['Arrow Down'], description: 'Move message down' },
      { keys: ['Ctrl', 'Arrow Up'], macKeys: ['Cmd', 'Arrow Up'], description: 'Move to first' },
      { keys: ['Ctrl', 'Arrow Down'], macKeys: ['Cmd', 'Arrow Down'], description: 'Move to last' },
    ],
  },
  {
    title: 'Export',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    shortcuts: [
      { keys: ['Ctrl', 'Shift', 'E'], macKeys: ['Cmd', 'Shift', 'E'], description: 'Quick export PNG' },
      { keys: ['Ctrl', 'Shift', 'C'], macKeys: ['Cmd', 'Shift', 'C'], description: 'Copy to clipboard' },
      { keys: ['Ctrl', 'Shift', 'S'], macKeys: ['Cmd', 'Shift', 'S'], description: 'Save to cloud' },
    ],
  },
  {
    title: 'Full Screen Editor',
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    shortcuts: [
      { keys: ['F11'], description: 'Toggle full screen' },
      { keys: ['Ctrl', '+'], macKeys: ['Cmd', '+'], description: 'Zoom in' },
      { keys: ['Ctrl', '-'], macKeys: ['Cmd', '-'], description: 'Zoom out' },
      { keys: ['Ctrl', '0'], macKeys: ['Cmd', '0'], description: 'Reset zoom' },
      { keys: ['Ctrl', 'G'], macKeys: ['Cmd', 'G'], description: 'Toggle grid' },
      { keys: ['Ctrl', 'M'], macKeys: ['Cmd', 'M'], description: 'Toggle minimap' },
      { keys: ['Alt', 'Drag'], description: 'Pan canvas' },
    ],
  },
];

export function KeyboardShortcutsReference() {
  const [isMac, setIsMac] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detect Mac on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().includes('MAC'));
    }
  });

  const filteredGroups = shortcutGroups
    .map(group => ({
      ...group,
      shortcuts: group.shortcuts.filter(
        shortcut =>
          shortcut.description.toLowerCase().includes(searchQuery.toLowerCase())
          || shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    }))
    .filter(group => group.shortcuts.length > 0);

  const renderKey = (key: string) => (
    <kbd className="inline-flex min-w-[2rem] items-center justify-center rounded bg-gray-200 px-2 py-1 font-mono text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
      {key}
    </kbd>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Keyboard Shortcuts Reference
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Master MockFlow with these keyboard shortcuts for faster workflow
          </p>
        </div>

        {/* Platform Toggle */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${!isMac ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            Windows/Linux
          </span>
          <button
            type="button"
            onClick={() => setIsMac(!isMac)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none ${
              isMac ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isMac ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isMac ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
            macOS
          </span>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400"
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
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Shortcut Groups */}
        <div className="space-y-8">
          {filteredGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Group Header */}
              <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                <div className="text-gray-600 dark:text-gray-400">{group.icon}</div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{group.title}</h2>
                <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                  {group.shortcuts.length}
                  {' '}
                  shortcuts
                </span>
              </div>

              {/* Shortcuts List */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {group.shortcuts.map((shortcut, shortcutIndex) => {
                  const keys = isMac && shortcut.macKeys ? shortcut.macKeys : shortcut.keys;
                  return (
                    <div
                      key={shortcutIndex}
                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center gap-1">
                            {renderKey(key)}
                            {keyIndex < keys.length - 1 && (
                              <span className="text-gray-400">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pro Tips
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              Press
              {' '}
              <kbd className="mx-1 rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-800">?</kbd>
              {' '}
              anywhere in the editor to quickly see available shortcuts
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              Most shortcuts work the same on Windows/Linux (Ctrl) and Mac (Cmd)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              Use platform number shortcuts (Ctrl/Cmd + 1-6) to quickly switch between chat platforms
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
              In full-screen mode, hold Alt and drag to pan around the canvas
            </li>
          </ul>
        </div>

        {/* Print Button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print this page
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsReference;
