'use client';

import {
  ChevronDown,
  Clock,
  History,
  Redo2,
  RotateCcw,
  Trash2,
  Undo2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
type ActionType = 'add' | 'delete' | 'modify' | 'reorder' | 'style' | 'content';
type ManagerVariant = 'toolbar' | 'panel' | 'dropdown' | 'minimal';

type HistoryAction = {
  id: string;
  type: ActionType;
  label: string;
  description: string;
  timestamp: string;
  data?: unknown;
  preview?: string;
};

type HistoryState = {
  past: HistoryAction[];
  future: HistoryAction[];
  current: HistoryAction | null;
};

export type UndoRedoManagerProps = {
  variant?: ManagerVariant;
  history?: HistoryState;
  maxHistory?: number;
  onUndo?: () => void;
  onRedo?: () => void;
  onJumpTo?: (actionId: string) => void;
  onClearHistory?: () => void;
  className?: string;
};

// Mock history data
const mockHistory: HistoryState = {
  past: [
    { id: '1', type: 'add', label: 'Added message', description: 'Added "Hello there!" message', timestamp: '2024-01-12T14:20:00Z' },
    { id: '2', type: 'modify', label: 'Changed sender', description: 'Changed sender to "John"', timestamp: '2024-01-12T14:21:00Z' },
    { id: '3', type: 'style', label: 'Changed background', description: 'Applied dark theme background', timestamp: '2024-01-12T14:22:00Z' },
    { id: '4', type: 'add', label: 'Added message', description: 'Added reply message', timestamp: '2024-01-12T14:23:00Z' },
    { id: '5', type: 'content', label: 'Edited text', description: 'Modified message content', timestamp: '2024-01-12T14:24:00Z' },
  ],
  future: [
    { id: '6', type: 'delete', label: 'Deleted message', description: 'Removed last message', timestamp: '2024-01-12T14:25:00Z' },
  ],
  current: { id: '5', type: 'content', label: 'Edited text', description: 'Modified message content', timestamp: '2024-01-12T14:24:00Z' },
};

export default function UndoRedoManager({
  variant = 'toolbar',
  history = mockHistory,
  maxHistory = 50,
  onUndo,
  onRedo,
  onJumpTo,
  onClearHistory,
  className = '',
}: UndoRedoManagerProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleUndo = useCallback(() => {
    if (canUndo) {
      onUndo?.();
    }
  }, [canUndo, onUndo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      onRedo?.();
    }
  }, [canRedo, onRedo]);

  const handleJumpTo = useCallback((actionId: string) => {
    onJumpTo?.(actionId);
    setShowHistory(false);
  }, [onJumpTo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'add': return '+';
      case 'delete': return '−';
      case 'modify': return '✎';
      case 'reorder': return '↕';
      case 'style': return '🎨';
      case 'content': return 'T';
      default: return '•';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Minimal variant - just buttons
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-800"
          title="Undo (⌘Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-800"
          title="Redo (⌘⇧Z)"
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Toolbar variant
  if (variant === 'toolbar') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="rounded p-2 text-gray-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-700"
            title={`Undo: ${history.past[history.past.length - 1]?.label || 'Nothing to undo'}`}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="rounded p-2 text-gray-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-700"
            title={`Redo: ${history.future[0]?.label || 'Nothing to redo'}`}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <History className="h-4 w-4" />
            History
            <ChevronDown className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>

          {showHistory && (
            <div className="absolute top-full right-0 z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-900 dark:text-white">History</span>
                <button
                  onClick={onClearHistory}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {/* Future actions */}
                {history.future.slice().reverse().map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleJumpTo(action.id)}
                    className="flex w-full items-center gap-3 p-3 text-left opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs dark:bg-gray-700">
                      {getActionIcon(action.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-900 dark:text-white">{action.label}</p>
                      <p className="text-xs text-gray-500">{formatTime(action.timestamp)}</p>
                    </div>
                  </button>
                ))}

                {/* Current action */}
                {history.current && (
                  <div className="flex items-center gap-3 border-l-2 border-blue-500 bg-blue-50 p-3 dark:bg-blue-900/20">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs text-blue-600 dark:bg-blue-800 dark:text-blue-400">
                      {getActionIcon(history.current.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{history.current.label}</p>
                      <p className="text-xs text-gray-500">Current</p>
                    </div>
                  </div>
                )}

                {/* Past actions */}
                {history.past.slice().reverse().map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleJumpTo(action.id)}
                    className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs dark:bg-gray-700">
                      {getActionIcon(action.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-900 dark:text-white">{action.label}</p>
                      <p className="text-xs text-gray-500">{formatTime(action.timestamp)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <History className="h-4 w-4" />
          <span>
            History (
            {history.past.length}
            )
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
        </button>

        {showHistory && (
          <div className="absolute top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 p-2 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm disabled:opacity-50 dark:bg-gray-800"
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm disabled:opacity-50 dark:bg-gray-800"
                >
                  <Redo2 className="h-4 w-4" />
                  Redo
                </button>
              </div>
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto p-2">
              {[...history.past].reverse().map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => handleJumpTo(action.id)}
                  onMouseEnter={() => setSelectedAction(action.id)}
                  onMouseLeave={() => setSelectedAction(null)}
                  className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                    selectedAction === action.id
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-200 font-mono text-xs dark:bg-gray-700">
                    {history.past.length - index}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                    <p className="truncate text-xs text-gray-500">{action.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpTo(action.id);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-500"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
            {history.past.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">
                No history yet
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Panel variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <History className="h-5 w-5" />
            History
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
            >
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {history.past.length}
          {' '}
          changes ·
          {maxHistory - history.past.length}
          {' '}
          remaining
        </p>
      </div>

      {/* Timeline */}
      <div className="max-h-80 overflow-y-auto p-4">
        {history.past.length === 0
          ? (
              <div className="py-8 text-center text-gray-500">
                <Clock className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm">No history yet</p>
                <p className="text-xs">Start editing to create history</p>
              </div>
            )
          : (
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-gray-200 dark:bg-gray-700" />
                <div className="space-y-4">
                  {[...history.past].reverse().map((action, index) => (
                    <div
                      key={action.id}
                      className="group relative pl-8"
                    >
                      <div className={`absolute left-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        index === 0
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                      >
                        {getActionIcon(action.type)}
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                          <p className="text-xs text-gray-500">{action.description}</p>
                          <p className="mt-1 text-xs text-gray-400">{formatTime(action.timestamp)}</p>
                        </div>
                        <button
                          onClick={() => handleJumpTo(action.id)}
                          className="p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-500"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
      </div>

      {/* Footer */}
      {history.past.length > 0 && (
        <div className="border-t border-gray-200 p-3 dark:border-gray-800">
          <button
            onClick={onClearHistory}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}

export type { ActionType, HistoryAction, HistoryState, ManagerVariant };
