'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Box,
  ChevronRight,
  Clock,
  Command,
  Copy,
  Download,
  Edit2,
  Eye,
  FileText,
  FolderOpen,
  Grid,
  Image,
  Layers,
  Layout,
  Lock,
  Move,
  Palette,
  Plus,
  Redo,
  Save,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  Type,
  Undo,
  Unlock,
  Upload,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type QuickAction = {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  category?: string;
  isRecent?: boolean;
  isFavorite?: boolean;
  disabled?: boolean;
  action?: () => void;
  subActions?: QuickAction[];
};

export type QuickActionMenuProps = {
  actions: QuickAction[];
  recentActions?: QuickAction[];
  favoriteActions?: QuickAction[];
  onAction?: (actionId: string) => void;
  onSearch?: (query: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
  variant?: 'full' | 'compact' | 'floating' | 'spotlight' | 'minimal';
  showCategories?: boolean;
  showRecent?: boolean;
  showFavorites?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function QuickActionMenu({
  actions,
  recentActions = [],
  favoriteActions = [],
  onAction,
  onSearch,
  onClose,
  isOpen = true,
  variant = 'full',
  showCategories = true,
  showRecent = true,
  showFavorites = true,
  darkMode = false,
  className = '',
}: QuickActionMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const selectedBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const categories = [...new Set(actions.filter(a => a.category).map(a => a.category!))];

  const filteredActions = actions.filter((action) => {
    const matchesSearch = !searchQuery
      || action.label.toLowerCase().includes(searchQuery.toLowerCase())
      || action.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || action.category === activeCategory;
    return matchesSearch && matchesCategory && !action.disabled;
  });

  const allVisibleActions = [
    ...(showFavorites && favoriteActions.length > 0 && !searchQuery ? favoriteActions : []),
    ...(showRecent && recentActions.length > 0 && !searchQuery ? recentActions : []),
    ...filteredActions,
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    onSearch?.(searchQuery);
  }, [searchQuery, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allVisibleActions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (allVisibleActions[selectedIndex]) {
          const action = allVisibleActions[selectedIndex];
          if (action.subActions && action.subActions.length > 0) {
            setExpandedAction(expandedAction === action.id ? null : action.id);
          } else {
            action.action?.();
            onAction?.(action.id);
            onClose?.();
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          const prevIndex = categories.indexOf(activeCategory || '') - 1;
          setActiveCategory(prevIndex >= 0 ? categories[prevIndex] ?? null : null);
        } else {
          const nextIndex = categories.indexOf(activeCategory || '') + 1;
          setActiveCategory(nextIndex < categories.length ? categories[nextIndex] ?? null : null);
        }
        break;
    }
  }, [allVisibleActions, selectedIndex, expandedAction, onAction, onClose, activeCategory, categories]);

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const renderAction = (action: QuickAction, index: number, isNested = false) => {
    const isSelected = index === selectedIndex;
    const isExpanded = expandedAction === action.id;
    const hasSubActions = action.subActions && action.subActions.length > 0;

    return (
      <div key={action.id}>
        <button
          data-index={index}
          onClick={() => {
            if (hasSubActions) {
              setExpandedAction(isExpanded ? null : action.id);
            } else {
              action.action?.();
              onAction?.(action.id);
              onClose?.();
            }
          }}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
            isSelected ? selectedBg : hoverBg
          } ${isNested ? 'ml-6' : ''}`}
        >
          {action.icon && (
            <span className={`flex-shrink-0 ${isSelected ? 'text-blue-500' : mutedColor}`}>
              {action.icon}
            </span>
          )}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className={`${textColor} ${isSelected ? 'font-medium' : ''}`}>
                {action.label}
              </span>
              {action.isFavorite && <Star size={12} className="fill-yellow-500 text-yellow-500" />}
              {action.isRecent && <Clock size={12} className={mutedColor} />}
            </div>
            {action.description && (
              <span className={`text-xs ${mutedColor}`}>{action.description}</span>
            )}
          </div>
          {action.shortcut && (
            <kbd className={`px-2 py-0.5 text-xs ${inputBg} ${mutedColor} rounded border ${borderColor}`}>
              {action.shortcut}
            </kbd>
          )}
          {hasSubActions && (
            <ChevronRight size={14} className={`${mutedColor} ${isExpanded ? 'rotate-90' : ''} transition-transform`} />
          )}
        </button>

        {isExpanded && action.subActions && (
          <div className="mt-1 space-y-1">
            {action.subActions.map((subAction, subIndex) =>
              renderAction(subAction, filteredActions.length + subIndex, true),
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return null;
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} border ${borderColor} w-64 rounded-lg shadow-lg ${className}`}>
        <div className={`flex items-center gap-2 border-b px-3 py-2 ${borderColor}`}>
          <Search size={14} className={mutedColor} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className={`flex-1 bg-transparent ${textColor} text-sm outline-none`}
          />
        </div>
        <div className="max-h-48 overflow-y-auto p-1" ref={listRef}>
          {filteredActions.slice(0, 8).map((action, index) => (
            <button
              key={action.id}
              data-index={index}
              onClick={() => {
                action.action?.(); onAction?.(action.id); onClose?.();
              }}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm ${
                index === selectedIndex ? selectedBg : hoverBg
              } ${textColor}`}
            >
              {action.icon}
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} border ${borderColor} w-80 rounded-xl shadow-xl ${className}`}>
        <div className={`flex items-center gap-3 border-b px-4 py-3 ${borderColor}`}>
          <Command size={16} className={mutedColor} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className={`flex-1 bg-transparent ${textColor} outline-none`}
          />
          <kbd className={`px-2 py-0.5 text-xs ${inputBg} ${mutedColor} rounded`}>ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2" ref={listRef}>
          {allVisibleActions.slice(0, 10).map((action, index) => renderAction(action, index))}
          {allVisibleActions.length === 0 && (
            <div className={`py-6 text-center ${mutedColor}`}>
              <p className="text-sm">No actions found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 pt-20" onClick={onClose}>
        <div
          className={`${bgColor} border ${borderColor} w-96 rounded-xl shadow-2xl ${className}`}
          onClick={e => e.stopPropagation()}
        >
          <div className={`flex items-center gap-3 border-b px-4 py-3 ${borderColor}`}>
            <Search size={18} className={mutedColor} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search actions..."
              className={`flex-1 bg-transparent ${textColor} text-lg outline-none`}
            />
          </div>

          {showCategories && categories.length > 0 && (
            <div className={`flex gap-1 border-b px-3 py-2 ${borderColor} overflow-x-auto`}>
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded px-2 py-1 text-xs whitespace-nowrap ${
                  !activeCategory ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded px-2 py-1 text-xs whitespace-nowrap ${
                    activeCategory === cat ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="max-h-80 overflow-y-auto p-2" ref={listRef}>
            {showFavorites && favoriteActions.length > 0 && !searchQuery && (
              <div className="mb-3">
                <span className={`text-xs ${mutedColor} px-2 font-medium`}>Favorites</span>
                <div className="mt-1 space-y-1">
                  {favoriteActions.map((action, index) => renderAction(action, index))}
                </div>
              </div>
            )}

            {showRecent && recentActions.length > 0 && !searchQuery && (
              <div className="mb-3">
                <span className={`text-xs ${mutedColor} px-2 font-medium`}>Recent</span>
                <div className="mt-1 space-y-1">
                  {recentActions.map((action, index) => renderAction(action, favoriteActions.length + index))}
                </div>
              </div>
            )}

            <div className="space-y-1">
              {filteredActions.map((action, index) =>
                renderAction(action, favoriteActions.length + recentActions.length + index),
              )}
            </div>

            {allVisibleActions.length === 0 && (
              <div className={`py-8 text-center ${mutedColor}`}>
                <Search size={32} className="mx-auto mb-2 opacity-50" />
                <p>No actions found</p>
              </div>
            )}
          </div>

          <div className={`border-t px-4 py-2 ${borderColor} flex items-center justify-between`}>
            <div className="flex items-center gap-4 text-xs ${mutedColor}">
              <span className="flex items-center gap-1">
                <kbd className={`px-1 ${inputBg} rounded`}>↑↓</kbd>
                {' '}
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1 ${inputBg} rounded`}>↵</kbd>
                {' '}
                select
              </span>
            </div>
            <button onClick={onClose} className={`text-xs ${mutedColor}`}>
              <kbd className={`px-1.5 py-0.5 ${inputBg} rounded`}>ESC</kbd>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Spotlight variant
  if (variant === 'spotlight') {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-32" onClick={onClose}>
        <div
          className={`${bgColor} w-[600px] overflow-hidden rounded-2xl shadow-2xl ${className}`}
          onClick={e => e.stopPropagation()}
        >
          <div className={`flex items-center gap-4 border-b px-6 py-4 ${borderColor}`}>
            <Command size={24} className="text-blue-500" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to do?"
              className={`flex-1 bg-transparent ${textColor} text-xl outline-none placeholder:text-gray-400`}
            />
          </div>

          <div className="max-h-96 overflow-y-auto" ref={listRef}>
            {!searchQuery && (
              <>
                {showFavorites && favoriteActions.length > 0 && (
                  <div className={`border-b px-4 py-3 ${borderColor}`}>
                    <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
                      Favorites
                    </span>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {favoriteActions.slice(0, 6).map(action => (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.action?.(); onAction?.(action.id); onClose?.();
                          }}
                          className={`flex flex-col items-center gap-2 p-3 ${inputBg} rounded-lg ${hoverBg}`}
                        >
                          <span className="text-blue-500">{action.icon}</span>
                          <span className={`text-xs ${textColor} text-center`}>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showRecent && recentActions.length > 0 && (
                  <div className={`border-b px-4 py-3 ${borderColor}`}>
                    <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
                      Recent
                    </span>
                    <div className="mt-2 space-y-1">
                      {recentActions.slice(0, 5).map((action, index) => renderAction(action, index))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="p-2">
              {showCategories && !searchQuery && categories.length > 0
                ? (
                    categories.map((category) => {
                      const categoryActions = filteredActions.filter(a => a.category === category);
                      if (categoryActions.length === 0) {
                        return null;
                      }

                      return (
                        <div key={category} className="mb-4">
                          <span className={`text-xs font-semibold ${mutedColor} px-2 tracking-wider uppercase`}>
                            {category}
                          </span>
                          <div className="mt-2 space-y-1">
                            {categoryActions.map((action, index) => renderAction(action, index))}
                          </div>
                        </div>
                      );
                    })
                  )
                : (
                    <div className="space-y-1">
                      {filteredActions.map((action, index) => renderAction(action, index))}
                    </div>
                  )}

              {allVisibleActions.length === 0 && (
                <div className={`py-12 text-center ${mutedColor}`}>
                  <Zap size={48} className="mx-auto mb-4 opacity-30" />
                  <p className={textColor}>No matching actions</p>
                  <p className="mt-1 text-sm">Try a different search term</p>
                </div>
              )}
            </div>
          </div>

          <div className={`border-t px-4 py-3 ${borderColor} ${inputBg} flex items-center justify-between`}>
            <div className={`flex items-center gap-6 text-xs ${mutedColor}`}>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white px-1.5 py-0.5 shadow dark:bg-gray-700">↑</kbd>
                <kbd className="rounded bg-white px-1.5 py-0.5 shadow dark:bg-gray-700">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white px-1.5 py-0.5 shadow dark:bg-gray-700">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white px-1.5 py-0.5 shadow dark:bg-gray-700">Tab</kbd>
                to filter
              </span>
            </div>
            <span className={`text-xs ${mutedColor}`}>
              {allVisibleActions.length}
              {' '}
              actions
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} w-full max-w-2xl shadow-xl ${className}`}>
      {/* Header */}
      <div className={`border-b p-4 ${borderColor}`}>
        <div className="flex items-center gap-4">
          <div className={`flex flex-1 items-center gap-3 ${inputBg} rounded-lg px-4 py-2.5`}>
            <Search size={18} className={mutedColor} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search actions, commands, or shortcuts..."
              className={`flex-1 bg-transparent ${textColor} outline-none`}
            />
            <kbd className={`px-2 py-0.5 text-xs ${mutedColor} border ${borderColor} rounded`}>
              ⌘K
            </kbd>
          </div>
          <button onClick={onClose} className={`p-2 ${hoverBg} rounded-lg`}>
            <span className={`text-sm ${mutedColor}`}>ESC</span>
          </button>
        </div>

        {showCategories && categories.length > 0 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                !activeCategory ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor} ${hoverBg}`
              }`}
            >
              All Actions
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor} ${hoverBg}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex" style={{ height: '400px' }}>
        {/* Main list */}
        <div className="flex-1 overflow-y-auto p-2" ref={listRef}>
          {showFavorites && favoriteActions.length > 0 && !searchQuery && !activeCategory && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 px-2">
                <Star size={14} className="text-yellow-500" />
                <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
                  Favorites
                </span>
              </div>
              <div className="space-y-1">
                {favoriteActions.map((action, index) => renderAction(action, index))}
              </div>
            </div>
          )}

          {showRecent && recentActions.length > 0 && !searchQuery && !activeCategory && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 px-2">
                <Clock size={14} className={mutedColor} />
                <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
                  Recent
                </span>
              </div>
              <div className="space-y-1">
                {recentActions.map((action, index) => renderAction(action, favoriteActions.length + index))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-2 px-2">
              <Zap size={14} className={mutedColor} />
              <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
                {activeCategory || 'All Actions'}
              </span>
              <span className={`text-xs ${mutedColor}`}>
                (
                {filteredActions.length}
                )
              </span>
            </div>
            <div className="space-y-1">
              {filteredActions.map((action, index) =>
                renderAction(action, favoriteActions.length + recentActions.length + index),
              )}
            </div>
          </div>

          {allVisibleActions.length === 0 && (
            <div className={`py-12 text-center ${mutedColor}`}>
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className={textColor}>No actions found</p>
              <p className="mt-1 text-sm">Try searching for something else</p>
            </div>
          )}
        </div>

        {/* Quick access sidebar */}
        <div className={`w-48 border-l ${borderColor} p-3`}>
          <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
            Quick Access
          </span>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { icon: <Plus size={16} />, label: 'New' },
              { icon: <Copy size={16} />, label: 'Copy' },
              { icon: <Trash2 size={16} />, label: 'Delete' },
              { icon: <Undo size={16} />, label: 'Undo' },
              { icon: <Redo size={16} />, label: 'Redo' },
              { icon: <Save size={16} />, label: 'Save' },
              { icon: <Download size={16} />, label: 'Export' },
              { icon: <Upload size={16} />, label: 'Import' },
              { icon: <Share2 size={16} />, label: 'Share' },
            ].map(item => (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 p-2 ${inputBg} rounded-lg ${hoverBg}`}
                title={item.label}
              >
                <span className={mutedColor}>{item.icon}</span>
                <span className={`text-[10px] ${mutedColor}`}>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <span className={`text-xs font-semibold ${mutedColor} tracking-wider uppercase`}>
              View
            </span>
            <div className="mt-2 space-y-1">
              {[
                { icon: <Grid size={14} />, label: 'Grid View' },
                { icon: <Layers size={14} />, label: 'Layers' },
                { icon: <Eye size={14} />, label: 'Preview' },
              ].map(item => (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 ${hoverBg} ${textColor} text-sm`}
                >
                  <span className={mutedColor}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t px-4 py-3 ${borderColor} flex items-center justify-between`}>
        <div className={`flex items-center gap-6 text-xs ${mutedColor}`}>
          <span className="flex items-center gap-1.5">
            <kbd className={`px-1.5 py-0.5 ${inputBg} rounded border ${borderColor}`}>↑</kbd>
            <kbd className={`px-1.5 py-0.5 ${inputBg} rounded border ${borderColor}`}>↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className={`px-1.5 py-0.5 ${inputBg} rounded border ${borderColor}`}>↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className={`px-1.5 py-0.5 ${inputBg} rounded border ${borderColor}`}>Tab</kbd>
            Categories
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${mutedColor}`}>
            Press
            {' '}
            <kbd className={`px-1.5 py-0.5 ${inputBg} rounded border ${borderColor}`}>?</kbd>
            {' '}
            for help
          </span>
        </div>
      </div>
    </div>
  );
}

// Default actions for demonstration
export const defaultQuickActions: QuickAction[] = [
  { id: 'new-screen', label: 'New Screen', icon: <FileText size={16} />, shortcut: '⌘N', category: 'Create' },
  { id: 'new-component', label: 'New Component', icon: <Box size={16} />, shortcut: '⌘⇧N', category: 'Create' },
  { id: 'add-frame', label: 'Add Frame', icon: <Layout size={16} />, shortcut: 'F', category: 'Create' },
  { id: 'add-text', label: 'Add Text', icon: <Type size={16} />, shortcut: 'T', category: 'Create' },
  { id: 'add-image', label: 'Add Image', icon: <Image size={16} />, shortcut: '⌘⇧K', category: 'Create' },
  { id: 'add-shape', label: 'Add Shape', icon: <Box size={16} />, shortcut: 'R', category: 'Create' },
  { id: 'edit-colors', label: 'Edit Colors', icon: <Palette size={16} />, category: 'Edit' },
  { id: 'edit-typography', label: 'Edit Typography', icon: <Type size={16} />, category: 'Edit' },
  { id: 'align-left', label: 'Align Left', icon: <AlignLeft size={16} />, shortcut: '⌘⇧L', category: 'Align' },
  { id: 'align-center', label: 'Align Center', icon: <AlignCenter size={16} />, shortcut: '⌘⇧C', category: 'Align' },
  { id: 'align-right', label: 'Align Right', icon: <AlignRight size={16} />, shortcut: '⌘⇧R', category: 'Align' },
  { id: 'move', label: 'Move Selection', icon: <Move size={16} />, shortcut: 'V', category: 'Edit' },
  { id: 'duplicate', label: 'Duplicate', icon: <Copy size={16} />, shortcut: '⌘D', category: 'Edit' },
  { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, shortcut: '⌫', category: 'Edit' },
  { id: 'undo', label: 'Undo', icon: <Undo size={16} />, shortcut: '⌘Z', category: 'Edit' },
  { id: 'redo', label: 'Redo', icon: <Redo size={16} />, shortcut: '⌘⇧Z', category: 'Edit' },
  { id: 'save', label: 'Save', icon: <Save size={16} />, shortcut: '⌘S', category: 'File' },
  { id: 'open', label: 'Open File', icon: <FolderOpen size={16} />, shortcut: '⌘O', category: 'File' },
  { id: 'export', label: 'Export', icon: <Download size={16} />, shortcut: '⌘⇧E', category: 'File' },
  { id: 'share', label: 'Share', icon: <Share2 size={16} />, shortcut: '⌘⇧S', category: 'Collaborate' },
  { id: 'invite', label: 'Invite Team', icon: <Users size={16} />, category: 'Collaborate' },
  { id: 'lock', label: 'Lock Layer', icon: <Lock size={16} />, shortcut: '⌘⇧L', category: 'Layer' },
  { id: 'unlock', label: 'Unlock Layer', icon: <Unlock size={16} />, category: 'Layer' },
  { id: 'preview', label: 'Preview', icon: <Eye size={16} />, shortcut: '⌘P', category: 'View' },
  { id: 'edit', label: 'Edit Mode', icon: <Edit2 size={16} />, shortcut: '⌘E', category: 'View' },
  { id: 'settings', label: 'Settings', icon: <Settings size={16} />, shortcut: '⌘,', category: 'App' },
];
