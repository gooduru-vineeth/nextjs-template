'use client';

import {
  ChevronDown,
  ChevronRight,
  Command,
  Edit,
  Info,
  Keyboard,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export type ShortcutCategory = 'general' | 'editing' | 'view' | 'tools' | 'file' | 'selection' | 'alignment' | 'custom';

export type KeyCombination = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

export type Shortcut = {
  id: string;
  name: string;
  description?: string;
  category: ShortcutCategory;
  keys: KeyCombination;
  isCustom?: boolean;
  isEnabled?: boolean;
};

export type ShortcutGroup = {
  id: string;
  name: string;
  category: ShortcutCategory;
  shortcuts: Shortcut[];
};

export type ShortcutKeyPanelProps = {
  shortcuts: Shortcut[];
  onEditShortcut?: (shortcutId: string, keys: KeyCombination) => void;
  onResetShortcut?: (shortcutId: string) => void;
  onToggleShortcut?: (shortcutId: string) => void;
  onAddCustomShortcut?: (shortcut: Omit<Shortcut, 'id'>) => void;
  onDeleteShortcut?: (shortcutId: string) => void;
  variant?: 'full' | 'compact' | 'modal' | 'sidebar' | 'minimal';
  showSearch?: boolean;
  showEdit?: boolean;
  platform?: 'mac' | 'windows' | 'linux';
  darkMode?: boolean;
  className?: string;
};

export default function ShortcutKeyPanel({
  shortcuts,
  onEditShortcut,
  onResetShortcut,
  onToggleShortcut: _onToggleShortcut,
  onAddCustomShortcut,
  onDeleteShortcut,
  variant = 'full',
  showSearch = true,
  showEdit = true,
  platform = 'mac',
  darkMode = false,
  className = '',
}: ShortcutKeyPanelProps) {
  // Reserved for toggle shortcut functionality
  void _onToggleShortcut;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShortcutCategory | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['general', 'editing']));
  const [editingShortcutId, setEditingShortcutId] = useState<string | null>(null);
  const [recordingKeys, setRecordingKeys] = useState<KeyCombination | null>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const categoryLabels: Record<ShortcutCategory, string> = {
    general: 'General',
    editing: 'Editing',
    view: 'View',
    tools: 'Tools',
    file: 'File',
    selection: 'Selection',
    alignment: 'Alignment',
    custom: 'Custom',
  };

  const getModifierSymbol = (modifier: string) => {
    if (platform === 'mac') {
      switch (modifier) {
        case 'ctrl': return '⌃';
        case 'alt': return '⌥';
        case 'shift': return '⇧';
        case 'meta': return '⌘';
        default: return modifier;
      }
    } else {
      switch (modifier) {
        case 'ctrl': return 'Ctrl';
        case 'alt': return 'Alt';
        case 'shift': return 'Shift';
        case 'meta': return 'Win';
        default: return modifier;
      }
    }
  };

  const formatKeyDisplay = (key: string) => {
    const specialKeys: Record<string, string> = {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Backspace: '⌫',
      Delete: '⌦',
      Enter: '↵',
      Tab: '⇥',
      Escape: 'Esc',
      Space: 'Space',
    };
    return specialKeys[key] || key.toUpperCase();
  };

  const renderKeyCombo = (keys: KeyCombination, compact = false) => {
    const parts: string[] = [];
    if (keys.meta) {
      parts.push(getModifierSymbol('meta'));
    }
    if (keys.ctrl) {
      parts.push(getModifierSymbol('ctrl'));
    }
    if (keys.alt) {
      parts.push(getModifierSymbol('alt'));
    }
    if (keys.shift) {
      parts.push(getModifierSymbol('shift'));
    }
    parts.push(formatKeyDisplay(keys.key));

    if (platform === 'mac') {
      return (
        <span className={`font-mono ${compact ? 'text-xs' : 'text-sm'} ${textColor}`}>
          {parts.join('')}
        </span>
      );
    }

    return (
      <span className={`${compact ? 'text-xs' : 'text-sm'}`}>
        {parts.map((part, i) => (
          <span key={i}>
            <kbd className={`px-1.5 py-0.5 ${inputBg} ${textColor} rounded border ${borderColor} font-mono`}>
              {part}
            </kbd>
            {i < parts.length - 1 && <span className={mutedColor}> + </span>}
          </span>
        ))}
      </span>
    );
  };

  // Group shortcuts by category
  const groupedShortcuts = useMemo(() => {
    const filtered = shortcuts.filter((s) => {
      const matchesSearch = searchQuery === ''
        || s.name.toLowerCase().includes(searchQuery.toLowerCase())
        || s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const groups: ShortcutGroup[] = [];
    const categoryMap = new Map<ShortcutCategory, Shortcut[]>();

    filtered.forEach((shortcut) => {
      const existing = categoryMap.get(shortcut.category) || [];
      categoryMap.set(shortcut.category, [...existing, shortcut]);
    });

    categoryMap.forEach((shortcuts, category) => {
      groups.push({
        id: category,
        name: categoryLabels[category],
        category,
        shortcuts,
      });
    });

    return groups;
  }, [shortcuts, searchQuery, selectedCategory, categoryLabels]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (editingShortcutId) {
      e.preventDefault();
      setRecordingKeys({
        key: e.key,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
        meta: e.metaKey,
      });
    }
  };

  const saveShortcut = () => {
    if (editingShortcutId && recordingKeys) {
      onEditShortcut?.(editingShortcutId, recordingKeys);
      setEditingShortcutId(null);
      setRecordingKeys(null);
    }
  };

  const renderShortcutItem = (shortcut: Shortcut, compact = false) => {
    const isEditing = editingShortcutId === shortcut.id;

    return (
      <div
        key={shortcut.id}
        className={`flex items-center justify-between ${compact ? 'py-1.5' : 'py-3'} ${borderColor} border-b last:border-0 ${hoverBg} -mx-2 rounded px-2`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`${compact ? 'text-sm' : ''} ${textColor} ${!shortcut.isEnabled ? 'opacity-50' : ''}`}>
              {shortcut.name}
            </span>
            {shortcut.isCustom && (
              <span className={`px-1.5 py-0.5 text-xs ${inputBg} ${mutedColor} rounded`}>
                Custom
              </span>
            )}
          </div>
          {!compact && shortcut.description && (
            <p className={`text-xs ${mutedColor} mt-0.5`}>{shortcut.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isEditing
            ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`px-3 py-1 ${inputBg} ${textColor} rounded border ${borderColor} w-32 text-center text-sm`}
                    placeholder="Press keys..."
                    onKeyDown={handleKeyDown}
                    value={recordingKeys ? '' : ''}
                    readOnly
                    autoFocus
                  />
                  {recordingKeys && renderKeyCombo(recordingKeys)}
                  <button
                    onClick={saveShortcut}
                    className="rounded p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Command size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingShortcutId(null); setRecordingKeys(null);
                    }}
                    className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            : (
                <>
                  {renderKeyCombo(shortcut.keys, compact)}
                  {showEdit && !compact && (
                    <div className="ml-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => setEditingShortcutId(shortcut.id)}
                        className={`p-1 ${mutedColor} ${hoverBg} rounded`}
                        title="Edit shortcut"
                      >
                        <Edit size={14} />
                      </button>
                      {shortcut.isCustom && (
                        <button
                          onClick={() => onDeleteShortcut?.(shortcut.id)}
                          className={`p-1 text-red-500 ${hoverBg} rounded`}
                          title="Delete shortcut"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      {!shortcut.isCustom && (
                        <button
                          onClick={() => onResetShortcut?.(shortcut.id)}
                          className={`p-1 ${mutedColor} ${hoverBg} rounded`}
                          title="Reset to default"
                        >
                          <Info size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
        </div>
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} p-3 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Keyboard size={14} className={mutedColor} />
          <span className={`text-sm font-medium ${textColor}`}>Shortcuts</span>
        </div>
        <div className="space-y-1">
          {shortcuts.slice(0, 5).map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <span className={`text-xs ${mutedColor}`}>{s.name}</span>
              {renderKeyCombo(s.keys, true)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        {showSearch && (
          <div className="relative mb-3">
            <Search size={14} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className={`w-full py-2 pr-3 pl-9 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            />
          </div>
        )}
        <div className="space-y-1">
          {groupedShortcuts.slice(0, 2).flatMap(g => g.shortcuts.slice(0, 3)).map(s =>
            renderShortcutItem(s, true),
          )}
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-72 flex-col border-r ${borderColor} ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <h3 className={`font-semibold ${textColor} mb-3`}>Keyboard Shortcuts</h3>
          {showSearch && (
            <div className="relative">
              <Search size={14} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full py-2 pr-3 pl-9 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {groupedShortcuts.map(group => (
            <div key={group.id} className="mb-2">
              <button
                onClick={() => toggleGroup(group.id)}
                className={`flex w-full items-center gap-2 px-2 py-1.5 ${mutedColor} ${hoverBg} rounded-lg`}
              >
                {expandedGroups.has(group.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span className="text-sm font-medium">{group.name}</span>
                <span className="ml-auto text-xs">{group.shortcuts.length}</span>
              </button>

              {expandedGroups.has(group.id) && (
                <div className="group mt-1 ml-4 space-y-1">
                  {group.shortcuts.map(s => renderShortcutItem(s, true))}
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
      <div className={`${bgColor} flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl shadow-2xl ${className}`}>
        {/* Header */}
        <div className={`border-b p-6 ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor}`}>Keyboard Shortcuts</h2>
          <p className={`${mutedColor} mt-1`}>
            Learn and customize keyboard shortcuts
          </p>

          {showSearch && (
            <div className="relative mt-4">
              <Search size={16} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className={`w-full py-2 pr-4 pl-10 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              />
            </div>
          )}

          {/* Category tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : `${inputBg} ${mutedColor}`
              }`}
            >
              All
            </button>
            {(Object.keys(categoryLabels) as ShortcutCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${mutedColor}`
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {groupedShortcuts.map(group => (
            <div key={group.id} className="mb-6">
              <h3 className={`text-sm font-semibold ${textColor} mb-3`}>{group.name}</h3>
              <div className="group space-y-1">
                {group.shortcuts.map(s => renderShortcutItem(s))}
              </div>
            </div>
          ))}

          {groupedShortcuts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Keyboard size={48} className={mutedColor} />
              <p className={`mt-4 ${mutedColor}`}>No shortcuts found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t p-4 ${borderColor} flex justify-between`}>
          <button
            onClick={() => onAddCustomShortcut?.({
              name: 'New Shortcut',
              category: 'custom',
              keys: { key: '' },
              isCustom: true,
              isEnabled: true,
            })}
            className={`flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
          >
            <Plus size={16} />
            Add Custom
          </button>
          <button className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
            Done
          </button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-6 ${borderColor}`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>Keyboard Shortcuts</h2>
            <p className={`${mutedColor} mt-1`}>
              {shortcuts.length}
              {' '}
              shortcuts available
            </p>
          </div>
          <button
            onClick={() => onAddCustomShortcut?.({
              name: 'New Shortcut',
              category: 'custom',
              keys: { key: '' },
              isCustom: true,
              isEnabled: true,
            })}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Shortcut
          </button>
        </div>

        {showSearch && (
          <div className="relative">
            <Search size={16} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts..."
              className={`w-full py-2 pr-4 pl-10 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
            />
          </div>
        )}

        {/* Category filter */}
        <div className="mt-4 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : `${inputBg} ${mutedColor}`
            }`}
          >
            All
          </button>
          {(Object.keys(categoryLabels) as ShortcutCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : `${inputBg} ${mutedColor}`
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {groupedShortcuts.map(group => (
          <div key={group.id} className="mb-6">
            <button
              onClick={() => toggleGroup(group.id)}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
            >
              {expandedGroups.has(group.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Keyboard size={16} />
              <span className="font-medium">{group.name}</span>
              <span className="ml-auto text-sm">
                (
                {group.shortcuts.length}
                )
              </span>
            </button>

            {expandedGroups.has(group.id) && (
              <div className="group space-y-1">
                {group.shortcuts.map(s => renderShortcutItem(s))}
              </div>
            )}
          </div>
        ))}

        {groupedShortcuts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Keyboard size={48} className={mutedColor} />
            <p className={`mt-4 ${mutedColor}`}>No shortcuts found</p>
          </div>
        )}
      </div>
    </div>
  );
}
