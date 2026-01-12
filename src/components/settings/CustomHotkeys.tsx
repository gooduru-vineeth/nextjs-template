'use client';

import {
  AlertTriangle,
  Check,
  Command,
  Edit2,
  Keyboard,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
type HotkeyCategory = 'general' | 'editing' | 'navigation' | 'export' | 'collaboration';

type Hotkey = {
  id: string;
  action: string;
  description: string;
  category: HotkeyCategory;
  keys: string[];
  isDefault: boolean;
  isCustom: boolean;
  conflict?: string;
};

type HotkeyGroup = {
  category: HotkeyCategory;
  label: string;
  hotkeys: Hotkey[];
};

type CustomHotkeysProps = {
  variant?: 'full' | 'compact' | 'widget';
  onSave?: (hotkeys: Hotkey[]) => void;
  onReset?: () => void;
  className?: string;
};

// Default hotkeys
const defaultHotkeys: Hotkey[] = [
  // General
  { id: 'save', action: 'save', description: 'Save mockup', category: 'general', keys: ['⌘', 'S'], isDefault: true, isCustom: false },
  { id: 'save-as', action: 'save-as', description: 'Save as...', category: 'general', keys: ['⌘', 'Shift', 'S'], isDefault: true, isCustom: false },
  { id: 'undo', action: 'undo', description: 'Undo', category: 'general', keys: ['⌘', 'Z'], isDefault: true, isCustom: false },
  { id: 'redo', action: 'redo', description: 'Redo', category: 'general', keys: ['⌘', 'Shift', 'Z'], isDefault: true, isCustom: false },
  { id: 'copy', action: 'copy', description: 'Copy', category: 'general', keys: ['⌘', 'C'], isDefault: true, isCustom: false },
  { id: 'paste', action: 'paste', description: 'Paste', category: 'general', keys: ['⌘', 'V'], isDefault: true, isCustom: false },
  { id: 'delete', action: 'delete', description: 'Delete selected', category: 'general', keys: ['Backspace'], isDefault: true, isCustom: false },
  { id: 'select-all', action: 'select-all', description: 'Select all', category: 'general', keys: ['⌘', 'A'], isDefault: true, isCustom: false },

  // Editing
  { id: 'add-message', action: 'add-message', description: 'Add new message', category: 'editing', keys: ['⌘', 'Enter'], isDefault: true, isCustom: false },
  { id: 'edit-message', action: 'edit-message', description: 'Edit selected message', category: 'editing', keys: ['Enter'], isDefault: true, isCustom: false },
  { id: 'duplicate', action: 'duplicate', description: 'Duplicate element', category: 'editing', keys: ['⌘', 'D'], isDefault: true, isCustom: false },
  { id: 'toggle-sender', action: 'toggle-sender', description: 'Toggle message sender', category: 'editing', keys: ['Tab'], isDefault: true, isCustom: false },
  { id: 'add-emoji', action: 'add-emoji', description: 'Open emoji picker', category: 'editing', keys: ['⌘', 'E'], isDefault: true, isCustom: false },
  { id: 'format-bold', action: 'format-bold', description: 'Bold text', category: 'editing', keys: ['⌘', 'B'], isDefault: true, isCustom: false },
  { id: 'format-italic', action: 'format-italic', description: 'Italic text', category: 'editing', keys: ['⌘', 'I'], isDefault: true, isCustom: false },

  // Navigation
  { id: 'zoom-in', action: 'zoom-in', description: 'Zoom in', category: 'navigation', keys: ['⌘', '+'], isDefault: true, isCustom: false },
  { id: 'zoom-out', action: 'zoom-out', description: 'Zoom out', category: 'navigation', keys: ['⌘', '-'], isDefault: true, isCustom: false },
  { id: 'zoom-fit', action: 'zoom-fit', description: 'Fit to screen', category: 'navigation', keys: ['⌘', '0'], isDefault: true, isCustom: false },
  { id: 'fullscreen', action: 'fullscreen', description: 'Toggle fullscreen', category: 'navigation', keys: ['F'], isDefault: true, isCustom: false },
  { id: 'preview', action: 'preview', description: 'Toggle preview mode', category: 'navigation', keys: ['P'], isDefault: true, isCustom: false },
  { id: 'toggle-sidebar', action: 'toggle-sidebar', description: 'Toggle sidebar', category: 'navigation', keys: ['⌘', '\\'], isDefault: true, isCustom: false },

  // Export
  { id: 'export-png', action: 'export-png', description: 'Export as PNG', category: 'export', keys: ['⌘', 'Shift', 'E'], isDefault: true, isCustom: false },
  { id: 'export-quick', action: 'export-quick', description: 'Quick export', category: 'export', keys: ['⌘', 'Shift', 'X'], isDefault: true, isCustom: false },
  { id: 'copy-image', action: 'copy-image', description: 'Copy as image', category: 'export', keys: ['⌘', 'Shift', 'C'], isDefault: true, isCustom: false },

  // Collaboration
  { id: 'share', action: 'share', description: 'Share mockup', category: 'collaboration', keys: ['⌘', 'Shift', 'S'], isDefault: true, isCustom: false },
  { id: 'comment', action: 'comment', description: 'Add comment', category: 'collaboration', keys: ['C'], isDefault: true, isCustom: false },
  { id: 'invite', action: 'invite', description: 'Invite collaborator', category: 'collaboration', keys: ['⌘', 'Shift', 'I'], isDefault: true, isCustom: false },
];

const categoryLabels: Record<HotkeyCategory, string> = {
  general: 'General',
  editing: 'Editing',
  navigation: 'Navigation',
  export: 'Export',
  collaboration: 'Collaboration',
};

export default function CustomHotkeys({
  variant = 'full',
  onSave,
  onReset,
  className = '',
}: CustomHotkeysProps) {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(defaultHotkeys);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recordingKeys, setRecordingKeys] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HotkeyCategory | 'all'>('all');
  const [hasChanges, setHasChanges] = useState(false);

  // Key recording effect
  useEffect(() => {
    if (!editingId) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const keys: string[] = [];

      if (e.metaKey) {
        keys.push('⌘');
      }
      if (e.ctrlKey) {
        keys.push('Ctrl');
      }
      if (e.altKey) {
        keys.push('Alt');
      }
      if (e.shiftKey) {
        keys.push('Shift');
      }

      const key = e.key;
      if (!['Meta', 'Control', 'Alt', 'Shift'].includes(key)) {
        keys.push(key.length === 1 ? key.toUpperCase() : key);
      }

      if (keys.length > 0) {
        setRecordingKeys(keys);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingId]);

  const checkConflicts = useCallback((keys: string[], excludeId: string): string | undefined => {
    const keyString = keys.join('+');
    const conflicting = hotkeys.find(h => h.id !== excludeId && h.keys.join('+') === keyString);
    return conflicting?.description;
  }, [hotkeys]);

  const saveHotkeyEdit = useCallback((id: string) => {
    if (recordingKeys.length === 0) {
      setEditingId(null);
      return;
    }

    const conflict = checkConflicts(recordingKeys, id);

    setHotkeys(prev => prev.map((h) => {
      if (h.id === id) {
        return { ...h, keys: recordingKeys, isCustom: true, conflict };
      }
      return h;
    }));

    setEditingId(null);
    setRecordingKeys([]);
    setHasChanges(true);
  }, [recordingKeys, checkConflicts]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setRecordingKeys([]);
  }, []);

  const resetHotkey = useCallback((id: string) => {
    const original = defaultHotkeys.find(h => h.id === id);
    if (original) {
      setHotkeys(prev => prev.map(h => h.id === id ? { ...original } : h));
      setHasChanges(true);
    }
  }, []);

  const resetAllHotkeys = useCallback(() => {
    setHotkeys(defaultHotkeys);
    setHasChanges(true);
    onReset?.();
  }, [onReset]);

  const saveAllChanges = useCallback(() => {
    onSave?.(hotkeys);
    setHasChanges(false);
  }, [hotkeys, onSave]);

  const filteredHotkeys = hotkeys.filter((h) => {
    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesSearch = h.description.toLowerCase().includes(searchQuery.toLowerCase())
      || h.keys.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedHotkeys: HotkeyGroup[] = Object.entries(categoryLabels).map(([category, label]) => ({
    category: category as HotkeyCategory,
    label,
    hotkeys: filteredHotkeys.filter(h => h.category === category),
  })).filter(g => g.hotkeys.length > 0);

  const renderKeyCombo = (keys: string[]) => (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i}>
          <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {key === '⌘' ? <Command className="inline h-3 w-3" /> : key}
          </kbd>
          {i < keys.length - 1 && <span className="mx-0.5 text-gray-400">+</span>}
        </span>
      ))}
    </div>
  );

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Keyboard className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Shortcuts</span>
        </div>
        <div className="space-y-1 text-xs">
          {hotkeys.slice(0, 4).map(h => (
            <div key={h.id} className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{h.description}</span>
              {renderKeyCombo(h.keys)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h3>
          <button
            onClick={resetAllHotkeys}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Reset All
          </button>
        </div>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {hotkeys.slice(0, 10).map(h => (
            <div key={h.id} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">{h.description}</span>
              {renderKeyCombo(h.keys)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-3 w-3" />
                Unsaved changes
              </span>
            )}
            <button
              onClick={resetAllHotkeys}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All
            </button>
            <button
              onClick={saveAllChanges}
              disabled={!hasChanges}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as HotkeyCategory | 'all')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hotkey Groups */}
      <div className="max-h-[500px] space-y-8 overflow-y-auto p-6">
        {groupedHotkeys.map(group => (
          <div key={group.category}>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-white">
              {group.label}
            </h3>
            <div className="space-y-2">
              {group.hotkeys.map(hotkey => (
                <div
                  key={hotkey.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    hotkey.conflict
                      ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30'
                  } ${editingId === hotkey.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{hotkey.description}</span>
                      {hotkey.isCustom && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Custom
                        </span>
                      )}
                      {hotkey.conflict && (
                        <span className="flex items-center gap-1 rounded bg-yellow-100 px-1.5 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <AlertTriangle className="h-3 w-3" />
                          Conflicts with:
                          {' '}
                          {hotkey.conflict}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingId === hotkey.id
                      ? (
                          <>
                            <div className="min-w-[120px] rounded border-2 border-dashed border-blue-400 bg-blue-100 px-3 py-1.5 text-center dark:bg-blue-900/30">
                              {recordingKeys.length > 0
                                ? (
                                    renderKeyCombo(recordingKeys)
                                  )
                                : (
                                    <span className="text-sm text-blue-600 dark:text-blue-400">Press keys...</span>
                                  )}
                            </div>
                            <button
                              onClick={() => saveHotkeyEdit(hotkey.id)}
                              className="rounded p-1.5 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )
                      : (
                          <>
                            {renderKeyCombo(hotkey.keys)}
                            <button
                              onClick={() => {
                                setEditingId(hotkey.id);
                                setRecordingKeys([]);
                              }}
                              className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {hotkey.isCustom && (
                              <button
                                onClick={() => resetHotkey(hotkey.id)}
                                className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Shortcut */}
      <div className="border-t border-gray-200 p-6 dark:border-gray-700">
        <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          <Plus className="h-4 w-4" />
          Add Custom Shortcut
        </button>
      </div>
    </div>
  );
}

// Suppress unused variable warnings
void Trash2;

export type { CustomHotkeysProps, Hotkey, HotkeyCategory };
