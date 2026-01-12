'use client';

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  Keyboard,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
export type HotkeyCategory = 'navigation' | 'editing' | 'file' | 'view' | 'tools' | 'custom';

export type Hotkey = {
  id: string;
  name: string;
  description: string;
  category: HotkeyCategory;
  keys: string[];
  isCustom: boolean;
  isEnabled: boolean;
};

export type HotkeyConflict = {
  hotkeyId: string;
  conflictsWith: string;
  keys: string[];
};

export type HotkeyCustomizerProps = {
  variant?: 'full' | 'compact' | 'widget';
  hotkeys?: Hotkey[];
  onUpdateHotkey?: (hotkey: Hotkey) => void;
  onResetToDefaults?: () => void;
  onImport?: (hotkeys: Hotkey[]) => void;
  onExport?: () => void;
};

// Default hotkeys
const defaultHotkeys: Hotkey[] = [
  // Navigation
  { id: '1', name: 'Go to Dashboard', description: 'Navigate to the dashboard', category: 'navigation', keys: ['Ctrl', 'D'], isCustom: false, isEnabled: true },
  { id: '2', name: 'Go to Templates', description: 'Navigate to templates gallery', category: 'navigation', keys: ['Ctrl', 'T'], isCustom: false, isEnabled: true },
  { id: '3', name: 'Go to Settings', description: 'Open settings panel', category: 'navigation', keys: ['Ctrl', ','], isCustom: false, isEnabled: true },
  { id: '4', name: 'Search', description: 'Open global search', category: 'navigation', keys: ['Ctrl', 'K'], isCustom: false, isEnabled: true },

  // Editing
  { id: '5', name: 'Undo', description: 'Undo last action', category: 'editing', keys: ['Ctrl', 'Z'], isCustom: false, isEnabled: true },
  { id: '6', name: 'Redo', description: 'Redo last undone action', category: 'editing', keys: ['Ctrl', 'Shift', 'Z'], isCustom: false, isEnabled: true },
  { id: '7', name: 'Copy', description: 'Copy selected element', category: 'editing', keys: ['Ctrl', 'C'], isCustom: false, isEnabled: true },
  { id: '8', name: 'Paste', description: 'Paste from clipboard', category: 'editing', keys: ['Ctrl', 'V'], isCustom: false, isEnabled: true },
  { id: '9', name: 'Cut', description: 'Cut selected element', category: 'editing', keys: ['Ctrl', 'X'], isCustom: false, isEnabled: true },
  { id: '10', name: 'Delete', description: 'Delete selected element', category: 'editing', keys: ['Delete'], isCustom: false, isEnabled: true },
  { id: '11', name: 'Duplicate', description: 'Duplicate selected element', category: 'editing', keys: ['Ctrl', 'Shift', 'D'], isCustom: false, isEnabled: true },
  { id: '12', name: 'Select All', description: 'Select all elements', category: 'editing', keys: ['Ctrl', 'A'], isCustom: false, isEnabled: true },

  // File
  { id: '13', name: 'New Mockup', description: 'Create a new mockup', category: 'file', keys: ['Ctrl', 'N'], isCustom: false, isEnabled: true },
  { id: '14', name: 'Save', description: 'Save current mockup', category: 'file', keys: ['Ctrl', 'S'], isCustom: false, isEnabled: true },
  { id: '15', name: 'Save As', description: 'Save mockup with new name', category: 'file', keys: ['Ctrl', 'Shift', 'S'], isCustom: false, isEnabled: true },
  { id: '16', name: 'Export', description: 'Export mockup', category: 'file', keys: ['Ctrl', 'E'], isCustom: false, isEnabled: true },
  { id: '17', name: 'Close', description: 'Close current mockup', category: 'file', keys: ['Ctrl', 'W'], isCustom: false, isEnabled: true },

  // View
  { id: '18', name: 'Zoom In', description: 'Zoom in on canvas', category: 'view', keys: ['Ctrl', '+'], isCustom: false, isEnabled: true },
  { id: '19', name: 'Zoom Out', description: 'Zoom out on canvas', category: 'view', keys: ['Ctrl', '-'], isCustom: false, isEnabled: true },
  { id: '20', name: 'Fit to Screen', description: 'Fit mockup to screen', category: 'view', keys: ['Ctrl', '0'], isCustom: false, isEnabled: true },
  { id: '21', name: 'Toggle Grid', description: 'Show/hide grid overlay', category: 'view', keys: ['Ctrl', 'G'], isCustom: false, isEnabled: true },
  { id: '22', name: 'Toggle Rulers', description: 'Show/hide rulers', category: 'view', keys: ['Ctrl', 'R'], isCustom: false, isEnabled: true },
  { id: '23', name: 'Fullscreen', description: 'Toggle fullscreen mode', category: 'view', keys: ['F11'], isCustom: false, isEnabled: true },

  // Tools
  { id: '24', name: 'Select Tool', description: 'Switch to select tool', category: 'tools', keys: ['V'], isCustom: false, isEnabled: true },
  { id: '25', name: 'Text Tool', description: 'Switch to text tool', category: 'tools', keys: ['T'], isCustom: false, isEnabled: true },
  { id: '26', name: 'Shape Tool', description: 'Switch to shape tool', category: 'tools', keys: ['R'], isCustom: false, isEnabled: true },
  { id: '27', name: 'Hand Tool', description: 'Switch to pan/hand tool', category: 'tools', keys: ['H'], isCustom: false, isEnabled: true },
  { id: '28', name: 'Zoom Tool', description: 'Switch to zoom tool', category: 'tools', keys: ['Z'], isCustom: false, isEnabled: true },
];

// Helper functions
const getCategoryLabel = (category: HotkeyCategory): string => {
  const labels: Record<HotkeyCategory, string> = {
    navigation: 'Navigation',
    editing: 'Editing',
    file: 'File',
    view: 'View',
    tools: 'Tools',
    custom: 'Custom',
  };
  return labels[category];
};

const formatKeys = (keys: string[]): string => {
  return keys
    .map((key) => {
      if (key === 'Ctrl') {
        return '⌃';
      }
      if (key === 'Shift') {
        return '⇧';
      }
      if (key === 'Alt') {
        return '⌥';
      }
      if (key === 'Meta' || key === 'Command' || key === 'Cmd') {
        return '⌘';
      }
      return key;
    })
    .join(' + ');
};

const parseKeyEvent = (e: KeyboardEvent): string[] => {
  const keys: string[] = [];
  if (e.ctrlKey || e.metaKey) {
    keys.push('Ctrl');
  }
  if (e.shiftKey) {
    keys.push('Shift');
  }
  if (e.altKey) {
    keys.push('Alt');
  }

  const key = e.key;
  if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    keys.push(key.length === 1 ? key.toUpperCase() : key);
  }

  return keys;
};

// Main Component
export default function HotkeyCustomizer({
  variant = 'full',
  hotkeys: initialHotkeys = defaultHotkeys,
  onUpdateHotkey,
  onResetToDefaults,
  onImport,
  onExport,
}: HotkeyCustomizerProps) {
  const [hotkeys, setHotkeys] = useState<Hotkey[]>(initialHotkeys);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<HotkeyCategory | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recordingKeys, setRecordingKeys] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<HotkeyCategory>>(new Set(['navigation', 'editing']));
  const [conflicts, setConflicts] = useState<HotkeyConflict[]>([]);

  // Check for conflicts
  useEffect(() => {
    const newConflicts: HotkeyConflict[] = [];
    hotkeys.forEach((hotkey, i) => {
      if (!hotkey.isEnabled) {
        return;
      }
      hotkeys.slice(i + 1).forEach((other) => {
        if (!other.isEnabled) {
          return;
        }
        if (JSON.stringify(hotkey.keys) === JSON.stringify(other.keys)) {
          newConflicts.push({
            hotkeyId: hotkey.id,
            conflictsWith: other.name,
            keys: hotkey.keys,
          });
        }
      });
    });
    setConflicts(newConflicts);
  }, [hotkeys]);

  // Recording handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (editingId === null) {
      return;
    }

    e.preventDefault();
    const keys = parseKeyEvent(e);
    if (keys.length > 0) {
      setRecordingKeys(keys);
    }
  }, [editingId]);

  useEffect(() => {
    if (editingId !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [editingId, handleKeyDown]);

  const startEditing = (id: string) => {
    const hotkey = hotkeys.find(h => h.id === id);
    if (hotkey) {
      setEditingId(id);
      setRecordingKeys(hotkey.keys);
    }
  };

  const saveEditing = () => {
    if (editingId && recordingKeys.length > 0) {
      const updatedHotkey = hotkeys.find(h => h.id === editingId);
      if (updatedHotkey) {
        const newHotkey = { ...updatedHotkey, keys: recordingKeys };
        setHotkeys(prev => prev.map(h => (h.id === editingId ? newHotkey : h)));
        onUpdateHotkey?.(newHotkey);
      }
    }
    setEditingId(null);
    setRecordingKeys([]);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setRecordingKeys([]);
  };

  const toggleHotkey = (id: string) => {
    setHotkeys(prev =>
      prev.map((h) => {
        if (h.id === id) {
          const updated = { ...h, isEnabled: !h.isEnabled };
          onUpdateHotkey?.(updated);
          return updated;
        }
        return h;
      }),
    );
  };

  const toggleCategory = (category: HotkeyCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const filteredHotkeys = hotkeys.filter((h) => {
    if (filterCategory !== 'all' && h.category !== filterCategory) {
      return false;
    }
    if (searchQuery && !h.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const hotkeysByCategory = filteredHotkeys.reduce((acc, h) => {
    if (!acc[h.category]) {
      acc[h.category] = [];
    }
    acc[h.category].push(h);
    return acc;
  }, {} as Record<HotkeyCategory, Hotkey[]>);

  const hasConflict = (id: string) => conflicts.some(c => c.hotkeyId === id);

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Shortcuts</span>
          </div>
          <span className="text-xs text-gray-500">
            {hotkeys.filter(h => h.isEnabled).length}
            {' '}
            active
          </span>
        </div>
        <div className="space-y-2">
          {hotkeys.slice(0, 4).map(h => (
            <div key={h.id} className="flex items-center justify-between text-xs">
              <span className="truncate text-gray-600 dark:text-gray-400">{h.name}</span>
              <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-800">
                {formatKeys(h.keys)}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gray-900 dark:text-white">Keyboard Shortcuts</span>
            </div>
            <span className="text-sm text-gray-500">
              {hotkeys.filter(h => h.isEnabled).length}
              {' '}
              active
            </span>
          </div>
        </div>
        <div className="max-h-64 overflow-auto p-4">
          <div className="space-y-2">
            {hotkeys.slice(0, 10).map(h => (
              <div
                key={h.id}
                className="flex items-center justify-between py-1.5"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{h.name}</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {formatKeys(h.keys)}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Keyboard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize hotkeys for quick actions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => onImport?.([])}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button
              onClick={onResetToDefaults}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Conflicts warning */}
      {conflicts.length > 0 && (
        <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {conflicts.length}
            {' '}
            shortcut conflict
            {conflicts.length > 1 ? 's' : ''}
            {' '}
            detected
          </p>
        </div>
      )}

      {/* Search and filters */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className="w-full rounded-lg border-0 bg-gray-100 py-2 pr-4 pl-10 text-sm dark:bg-gray-800"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as HotkeyCategory | 'all')}
            className="rounded-lg border-0 bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800"
          >
            <option value="all">All Categories</option>
            <option value="navigation">Navigation</option>
            <option value="editing">Editing</option>
            <option value="file">File</option>
            <option value="view">View</option>
            <option value="tools">Tools</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Hotkeys list */}
      <div className="max-h-[600px] overflow-auto p-6">
        {Object.entries(hotkeysByCategory).map(([category, categoryHotkeys]) => (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleCategory(category as HotkeyCategory)}
              className="flex w-full items-center gap-2 py-2 text-left"
            >
              {expandedCategories.has(category as HotkeyCategory)
                ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )
                : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
              <span className="font-medium text-gray-900 dark:text-white">
                {getCategoryLabel(category as HotkeyCategory)}
              </span>
              <span className="text-xs text-gray-500">
                (
                {categoryHotkeys.length}
                )
              </span>
            </button>

            {expandedCategories.has(category as HotkeyCategory) && (
              <div className="mt-2 ml-6 space-y-2">
                {categoryHotkeys.map(hotkey => (
                  <div
                    key={hotkey.id}
                    className={`flex items-center gap-4 rounded-lg p-3 transition-colors ${
                      editingId === hotkey.id
                        ? 'border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                    } ${!hotkey.isEnabled ? 'opacity-50' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={hotkey.isEnabled}
                      onChange={() => toggleHotkey(hotkey.id)}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {hotkey.name}
                        </span>
                        {hotkey.isCustom && (
                          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600 dark:bg-purple-900/30">
                            Custom
                          </span>
                        )}
                        {hasConflict(hotkey.id) && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <p className="truncate text-xs text-gray-500">{hotkey.description}</p>
                    </div>

                    {editingId === hotkey.id
                      ? (
                          <div className="flex items-center gap-2">
                            <div className="min-w-[120px] rounded-lg border-2 border-purple-500 bg-white px-3 py-2 text-center dark:bg-gray-900">
                              <kbd className="font-mono text-sm text-purple-600 dark:text-purple-400">
                                {recordingKeys.length > 0 ? formatKeys(recordingKeys) : 'Press keys...'}
                              </kbd>
                            </div>
                            <button
                              onClick={saveEditing}
                              className="rounded-lg p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      : (
                          <div className="flex items-center gap-2">
                            <kbd className="rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {formatKeys(hotkey.keys)}
                            </kbd>
                            <button
                              onClick={() => startEditing(hotkey.id)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-purple-50 hover:text-purple-500 dark:hover:bg-purple-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredHotkeys.length === 0 && (
          <div className="py-12 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No shortcuts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Add custom shortcut */}
      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-3 text-gray-500 transition-colors hover:border-purple-500 hover:text-purple-500 dark:border-gray-700">
          <Plus className="h-4 w-4" />
          Add Custom Shortcut
        </button>
      </div>
    </div>
  );
}
