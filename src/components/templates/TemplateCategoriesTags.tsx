'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  Filter,
  FolderOpen,
  Hash,
  Layers,
  MoreHorizontal,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type TemplateTag = {
  id: string;
  name: string;
  color: string;
  count?: number;
  description?: string;
};

export type TemplateCategory = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  order: number;
  count?: number;
  children?: TemplateCategory[];
};

export type TemplateCategoriesTagsProps = {
  categories?: TemplateCategory[];
  tags?: TemplateTag[];
  selectedCategories?: string[];
  selectedTags?: string[];
  onCategorySelect?: (categoryId: string) => void;
  onTagSelect?: (tagId: string) => void;
  onCategoryCreate?: (category: Omit<TemplateCategory, 'id' | 'order'>) => void;
  onCategoryUpdate?: (category: TemplateCategory) => void;
  onCategoryDelete?: (categoryId: string) => void;
  onTagCreate?: (tag: Omit<TemplateTag, 'id'>) => void;
  onTagUpdate?: (tag: TemplateTag) => void;
  onTagDelete?: (tagId: string) => void;
  editable?: boolean;
  variant?: 'sidebar' | 'inline' | 'dropdown';
  className?: string;
};

// ============================================================================
// Sample Data
// ============================================================================

const defaultCategories: TemplateCategory[] = [
  {
    id: 'chat',
    name: 'Chat Apps',
    description: 'Messaging platform mockups',
    icon: '💬',
    color: '#3b82f6',
    order: 1,
    count: 45,
    children: [
      { id: 'imessage', name: 'iMessage', parentId: 'chat', order: 1, count: 12 },
      { id: 'whatsapp', name: 'WhatsApp', parentId: 'chat', order: 2, count: 15 },
      { id: 'telegram', name: 'Telegram', parentId: 'chat', order: 3, count: 8 },
      { id: 'messenger', name: 'Messenger', parentId: 'chat', order: 4, count: 10 },
    ],
  },
  {
    id: 'ai',
    name: 'AI Interfaces',
    description: 'AI chatbot and assistant mockups',
    icon: '🤖',
    color: '#8b5cf6',
    order: 2,
    count: 28,
    children: [
      { id: 'chatgpt', name: 'ChatGPT', parentId: 'ai', order: 1, count: 12 },
      { id: 'claude', name: 'Claude', parentId: 'ai', order: 2, count: 8 },
      { id: 'gemini', name: 'Gemini', parentId: 'ai', order: 3, count: 5 },
      { id: 'perplexity', name: 'Perplexity', parentId: 'ai', order: 4, count: 3 },
    ],
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Social platform mockups',
    icon: '📱',
    color: '#ec4899',
    order: 3,
    count: 35,
    children: [
      { id: 'twitter', name: 'Twitter/X', parentId: 'social', order: 1, count: 14 },
      { id: 'instagram', name: 'Instagram', parentId: 'social', order: 2, count: 12 },
      { id: 'linkedin', name: 'LinkedIn', parentId: 'social', order: 3, count: 9 },
    ],
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'Team communication tools',
    icon: '👥',
    color: '#10b981',
    order: 4,
    count: 22,
    children: [
      { id: 'slack', name: 'Slack', parentId: 'collaboration', order: 1, count: 12 },
      { id: 'discord', name: 'Discord', parentId: 'collaboration', order: 2, count: 10 },
    ],
  },
];

const defaultTags: TemplateTag[] = [
  { id: 't1', name: 'Dark Mode', color: '#1f2937', count: 34 },
  { id: 't2', name: 'Light Mode', color: '#f3f4f6', count: 56 },
  { id: 't3', name: 'Mobile', color: '#3b82f6', count: 78 },
  { id: 't4', name: 'Desktop', color: '#6366f1', count: 45 },
  { id: 't5', name: 'Group Chat', color: '#10b981', count: 23 },
  { id: 't6', name: 'Direct Message', color: '#f59e0b', count: 42 },
  { id: 't7', name: 'Reactions', color: '#ec4899', count: 31 },
  { id: 't8', name: 'Voice/Video', color: '#8b5cf6', count: 18 },
  { id: 't9', name: 'File Sharing', color: '#06b6d4', count: 25 },
  { id: 't10', name: 'Threads', color: '#84cc16', count: 19 },
];

const tagColors = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
];

// ============================================================================
// Sub-Components
// ============================================================================

type CategoryItemProps = {
  category: TemplateCategory;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: (category: TemplateCategory) => void;
  onDelete?: () => void;
  editable: boolean;
  depth?: number;
};

function CategoryItem({
  category,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  editable,
  depth = 0,
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const hasChildren = category.children && category.children.length > 0;

  const handleSaveEdit = () => {
    if (editName.trim() && onEdit) {
      onEdit({ ...category, name: editName.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div
        className={`
          group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5
          ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={onSelect}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {isExpanded
              ? (
                  <ChevronDown className="h-3 w-3" />
                )
              : (
                  <ChevronRight className="h-3 w-3" />
                )}
          </button>
        )}

        {!hasChildren && <div className="w-4" />}

        {category.icon && <span className="text-sm">{category.icon}</span>}

        {isEditing
          ? (
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                className="flex-1 rounded border px-1 py-0.5 text-sm"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
            )
          : (
              <span className={`flex-1 text-sm ${isSelected ? 'font-medium' : ''}`}>
                {category.name}
              </span>
            )}

        {category.count !== undefined && (
          <span className="text-xs text-gray-400">{category.count}</span>
        )}

        {editable && !isEditing && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="rounded p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <MoreHorizontal className="h-3 w-3" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute top-full right-0 z-20 mt-1 min-w-[120px] rounded-lg border bg-white py-1 shadow-lg dark:bg-gray-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {category.children!.map(child => (
            <CategoryItem
              key={child.id}
              category={child}
              isSelected={false}
              onSelect={() => {}}
              editable={editable}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type TagEditorProps = {
  tag?: TemplateTag;
  onSave: (tag: Omit<TemplateTag, 'id'>) => void;
  onCancel: () => void;
};

function TagEditor({ tag, onSave, onCancel }: TagEditorProps) {
  const [name, setName] = useState(tag?.name || '');
  const [color, setColor] = useState(tag?.color || tagColors[0]!);
  const [description, setDescription] = useState(tag?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name: name.trim(), color, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
      <div>
        <label className="mb-1 block text-xs text-gray-500">Tag Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter tag name"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Color</label>
        <div className="flex flex-wrap gap-2">
          {tagColors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`
                h-6 w-6 rounded-full transition-transform
                ${color === c ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-500">Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief description"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {tag ? 'Update' : 'Create'}
          {' '}
          Tag
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

type TagBadgeProps = {
  tag: TemplateTag;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editable: boolean;
  size?: 'sm' | 'md';
};

function TagBadge({
  tag,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  editable,
  size = 'md',
}: TagBadgeProps) {
  const [showMenu, setShowMenu] = useState(false);

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`
          ${sizeClasses} flex items-center gap-1.5 rounded-full transition-all
          ${isSelected
      ? 'ring-2 ring-blue-500 ring-offset-1'
      : 'hover:opacity-80'}
        `}
        style={{
          backgroundColor: `${tag.color}20`,
          color: tag.color,
          border: `1px solid ${tag.color}40`,
        }}
      >
        <Hash className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        {tag.name}
        {tag.count !== undefined && (
          <span className="opacity-60">
            (
            {tag.count}
            )
          </span>
        )}
      </button>

      {editable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="absolute -top-1 -right-1 rounded-full bg-gray-100 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700"
        >
          <MoreHorizontal className="h-3 w-3" />
        </button>
      )}

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-full right-0 z-20 mt-1 min-w-[100px] rounded-lg border bg-white py-1 shadow-lg dark:bg-gray-800">
            <button
              onClick={() => {
                onEdit?.();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete?.();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TemplateCategoriesTags({
  categories = defaultCategories,
  tags = defaultTags,
  selectedCategories = [],
  selectedTags = [],
  onCategorySelect,
  onTagSelect,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  onTagCreate,
  onTagUpdate,
  onTagDelete,
  editable = false,
  variant = 'sidebar',
  className = '',
}: TemplateCategoriesTagsProps) {
  const [categorySearch, setCategorySearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [showNewTag, setShowNewTag] = useState(false);
  const [editingTag, setEditingTag] = useState<TemplateTag | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredCategories = useMemo(() => {
    if (!categorySearch) {
      return categories;
    }
    const search = categorySearch.toLowerCase();
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(search)
      || cat.children?.some(child => child.name.toLowerCase().includes(search)),
    );
  }, [categories, categorySearch]);

  const filteredTags = useMemo(() => {
    if (!tagSearch) {
      return tags;
    }
    const search = tagSearch.toLowerCase();
    return tags.filter(tag => tag.name.toLowerCase().includes(search));
  }, [tags, tagSearch]);

  const handleCreateCategory = useCallback(() => {
    if (newCategoryName.trim() && onCategoryCreate) {
      onCategoryCreate({ name: newCategoryName.trim() });
      setNewCategoryName('');
      setShowNewCategory(false);
    }
  }, [newCategoryName, onCategoryCreate]);

  const handleCreateTag = useCallback((tagData: Omit<TemplateTag, 'id'>) => {
    onTagCreate?.(tagData);
    setShowNewTag(false);
  }, [onTagCreate]);

  const handleUpdateTag = useCallback((tagData: Omit<TemplateTag, 'id'>) => {
    if (editingTag) {
      onTagUpdate?.({ ...tagData, id: editingTag.id });
      setEditingTag(null);
    }
  }, [editingTag, onTagUpdate]);

  if (variant === 'inline') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Tags Only - Inline */}
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <TagBadge
              key={tag.id}
              tag={tag}
              isSelected={selectedTags.includes(tag.id)}
              onSelect={() => onTagSelect?.(tag.id)}
              onEdit={() => setEditingTag(tag)}
              onDelete={() => onTagDelete?.(tag.id)}
              editable={editable}
              size="sm"
            />
          ))}

          {editable && (
            <button
              onClick={() => setShowNewTag(true)}
              className="flex items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Plus className="h-3 w-3" />
              Add Tag
            </button>
          )}
        </div>

        {(showNewTag || editingTag) && (
          <TagEditor
            tag={editingTag || undefined}
            onSave={editingTag ? handleUpdateTag : handleCreateTag}
            onCancel={() => {
              setShowNewTag(false);
              setEditingTag(null);
            }}
          />
        )}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button className="flex w-full items-center justify-between rounded-lg border px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>
              {selectedCategories.length + selectedTags.length > 0
                ? `${selectedCategories.length + selectedTags.length} selected`
                : 'Filter by category or tag'}
            </span>
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Categories */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <FolderOpen className="h-4 w-4" />
            Categories
          </h3>
          {editable && (
            <button
              onClick={() => setShowNewCategory(true)}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative mb-2">
          <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={categorySearch}
            onChange={e => setCategorySearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-md border py-1.5 pr-3 pl-8 text-sm"
          />
        </div>

        {showNewCategory && (
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 rounded border px-2 py-1 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateCategory();
                }
                if (e.key === 'Escape') {
                  setShowNewCategory(false);
                }
              }}
            />
            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className="rounded bg-blue-500 p-1 text-white disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowNewCategory(false)}
              className="rounded border p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="space-y-0.5">
          <button
            onClick={() => onCategorySelect?.('all')}
            className={`
              flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm
              ${selectedCategories.length === 0
      ? 'bg-blue-100 font-medium dark:bg-blue-900/30'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            <Layers className="h-4 w-4" />
            All Templates
            <span className="ml-auto text-xs text-gray-400">
              {categories.reduce((sum, cat) => sum + (cat.count || 0), 0)}
            </span>
          </button>

          {filteredCategories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={selectedCategories.includes(category.id)}
              onSelect={() => onCategorySelect?.(category.id)}
              onEdit={onCategoryUpdate}
              onDelete={() => onCategoryDelete?.(category.id)}
              editable={editable}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <Tag className="h-4 w-4" />
            Tags
          </h3>
          {editable && (
            <button
              onClick={() => setShowNewTag(true)}
              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative mb-2">
          <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={tagSearch}
            onChange={e => setTagSearch(e.target.value)}
            placeholder="Search tags..."
            className="w-full rounded-md border py-1.5 pr-3 pl-8 text-sm"
          />
        </div>

        {(showNewTag || editingTag) && (
          <TagEditor
            tag={editingTag || undefined}
            onSave={editingTag ? handleUpdateTag : handleCreateTag}
            onCancel={() => {
              setShowNewTag(false);
              setEditingTag(null);
            }}
          />
        )}

        <div className="flex flex-wrap gap-2">
          {filteredTags.map(tag => (
            <TagBadge
              key={tag.id}
              tag={tag}
              isSelected={selectedTags.includes(tag.id)}
              onSelect={() => onTagSelect?.(tag.id)}
              onEdit={() => setEditingTag(tag)}
              onDelete={() => onTagDelete?.(tag.id)}
              editable={editable}
              size="sm"
            />
          ))}

          {filteredTags.length === 0 && tagSearch && (
            <p className="py-2 text-sm text-gray-500">No tags found</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Tag Input Component
// ============================================================================

export type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
};

export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add tags...',
  maxTags = 10,
  className = '',
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!input) {
      return suggestions.filter(s => !value.includes(s));
    }
    return suggestions.filter(
      s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s),
    );
  }, [input, suggestions, value]);

  const handleAdd = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const handleRemove = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      handleRemove(value[value.length - 1]!);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 rounded-lg border bg-white p-2 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-800">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          >
            #
            {tag}
            <button
              onClick={() => handleRemove(tag)}
              className="rounded p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {value.length < maxTags && (
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="min-w-[100px] flex-1 bg-transparent py-1 text-sm outline-none"
          />
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-white shadow-lg dark:bg-gray-800">
          {filteredSuggestions.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => handleAdd(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              #
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <p className="mt-1 text-xs text-gray-400">
        {value.length}
        /
        {maxTags}
        {' '}
        tags
      </p>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default TemplateCategoriesTags;
