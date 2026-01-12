'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Component,
  Copy,
  Download,
  Filter,
  Folder,
  Grid,
  Heart,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export type ComponentCategory = 'all' | 'buttons' | 'inputs' | 'cards' | 'navigation' | 'layout' | 'feedback' | 'data' | 'custom';

export type LibraryComponent = {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  preview?: string;
  variants?: number;
  downloads?: number;
  isFavorite?: boolean;
  isNew?: boolean;
  author?: string;
  version?: string;
};

export type ComponentCategory_Item = {
  id: ComponentCategory;
  label: string;
  icon: React.ReactNode;
  count: number;
};

export type ComponentLibraryPanelProps = {
  components: LibraryComponent[];
  categories?: ComponentCategory_Item[];
  onSelectComponent?: (component: LibraryComponent) => void;
  onAddComponent?: (component: LibraryComponent) => void;
  onToggleFavorite?: (componentId: string) => void;
  onDuplicateComponent?: (component: LibraryComponent) => void;
  variant?: 'full' | 'compact' | 'sidebar' | 'modal' | 'minimal';
  showSearch?: boolean;
  showFilters?: boolean;
  showCategories?: boolean;
  defaultView?: 'grid' | 'list';
  darkMode?: boolean;
  className?: string;
};

export default function ComponentLibraryPanel({
  components,
  categories,
  onSelectComponent,
  onAddComponent,
  onToggleFavorite,
  onDuplicateComponent,
  variant = 'full',
  showSearch = true,
  showFilters = true,
  showCategories = true,
  defaultView = 'grid',
  darkMode = false,
  className = '',
}: ComponentLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const defaultCategories: ComponentCategory_Item[] = [
    { id: 'all', label: 'All Components', icon: <Grid size={16} />, count: components.length },
    { id: 'buttons', label: 'Buttons', icon: <Component size={16} />, count: 0 },
    { id: 'inputs', label: 'Inputs', icon: <Component size={16} />, count: 0 },
    { id: 'cards', label: 'Cards', icon: <Component size={16} />, count: 0 },
    { id: 'navigation', label: 'Navigation', icon: <Component size={16} />, count: 0 },
    { id: 'layout', label: 'Layout', icon: <Component size={16} />, count: 0 },
    { id: 'feedback', label: 'Feedback', icon: <Component size={16} />, count: 0 },
    { id: 'data', label: 'Data Display', icon: <Component size={16} />, count: 0 },
  ];

  const categoryItems = categories || defaultCategories;

  const filteredComponents = useMemo(() => {
    return components.filter((component) => {
      const matchesSearch = searchQuery === ''
        || component.name.toLowerCase().includes(searchQuery.toLowerCase())
        || component.description.toLowerCase().includes(searchQuery.toLowerCase())
        || component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [components, searchQuery, selectedCategory]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const renderSearchBar = () => (
    <div className={`relative ${variant === 'compact' ? 'mb-3' : 'mb-4'}`}>
      <Search size={16} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search components..."
        className={`w-full py-2 pr-4 pl-9 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
      />
    </div>
  );

  const renderFilters = () => (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
          <Filter size={16} className={mutedColor} />
        </button>
        <span className={`text-sm ${mutedColor}`}>
          {filteredComponents.length}
          {' '}
          components
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        >
          <Grid size={16} />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );

  const renderCategorySidebar = () => (
    <div className={`w-48 flex-shrink-0 border-r ${borderColor} pr-4`}>
      <h3 className={`text-sm font-semibold ${textColor} mb-3`}>Categories</h3>
      <div className="space-y-1">
        {categoryItems.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : `${mutedColor} ${hoverBg}`
            }`}
          >
            {category.icon}
            <span className="flex-1 text-left">{category.label}</span>
            <span className={`text-xs ${selectedCategory === category.id ? 'text-blue-100' : ''}`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderComponentCard = (component: LibraryComponent) => (
    <div
      key={component.id}
      className={`${inputBg} overflow-hidden rounded-lg border ${borderColor} ${hoverBg} group cursor-pointer transition-all`}
      onClick={() => onSelectComponent?.(component)}
    >
      {/* Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        {component.preview
          ? (
              <img src={component.preview} alt={component.name} className="h-full w-full object-cover" />
            )
          : (
              <div className="flex h-full w-full items-center justify-center">
                <Component size={32} className={mutedColor} />
              </div>
            )}

        {/* Overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation(); onAddComponent?.(component);
            }}
            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onDuplicateComponent?.(component);
            }}
            className="rounded-lg bg-white p-2 text-gray-900 hover:bg-gray-100"
          >
            <Copy size={16} />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {component.isNew && (
            <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
              New
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation(); onToggleFavorite?.(component.id);
          }}
          className={`absolute top-2 right-2 rounded-full p-1.5 ${
            component.isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
          }`}
        >
          <Heart size={14} fill={component.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className={`font-medium ${textColor} truncate`}>{component.name}</h4>
        <p className={`text-xs ${mutedColor} mt-1 truncate`}>{component.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {component.variants && (
              <span className={`text-xs ${mutedColor}`}>
                {component.variants}
                {' '}
                variants
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {component.downloads && (
              <span className={`text-xs ${mutedColor} flex items-center gap-1`}>
                <Download size={12} />
                {component.downloads}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComponentListItem = (component: LibraryComponent) => (
    <div
      key={component.id}
      className={`flex items-center gap-4 rounded-lg border p-3 ${borderColor} ${hoverBg} cursor-pointer transition-colors`}
      onClick={() => onSelectComponent?.(component)}
    >
      {/* Preview thumbnail */}
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        {component.preview
          ? (
              <img src={component.preview} alt={component.name} className="h-full w-full object-cover" />
            )
          : (
              <Component size={24} className={mutedColor} />
            )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className={`font-medium ${textColor}`}>{component.name}</h4>
          {component.isNew && (
            <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
              New
            </span>
          )}
        </div>
        <p className={`text-sm ${mutedColor} mt-0.5 truncate`}>{component.description}</p>
        <div className="mt-1 flex items-center gap-3">
          <span className={`text-xs ${mutedColor}`}>{component.category}</span>
          {component.variants && (
            <span className={`text-xs ${mutedColor}`}>
              {component.variants}
              {' '}
              variants
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); onToggleFavorite?.(component.id);
          }}
          className={`rounded-lg p-2 ${component.isFavorite ? 'text-red-500' : mutedColor} ${hoverBg}`}
        >
          <Heart size={18} fill={component.isFavorite ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); onAddComponent?.(component);
          }}
          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          <Plus size={18} />
        </button>
        <button className={`p-2 ${mutedColor} ${hoverBg} rounded-lg`}>
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} p-3 ${className}`}>
        {showSearch && renderSearchBar()}
        <div className="space-y-2">
          {filteredComponents.slice(0, 5).map(component => (
            <button
              key={component.id}
              onClick={() => onSelectComponent?.(component)}
              className={`flex w-full items-center gap-3 rounded-lg p-2 ${hoverBg} text-left transition-colors`}
            >
              <div className={`h-8 w-8 rounded-lg ${inputBg} flex items-center justify-center`}>
                <Component size={16} className={mutedColor} />
              </div>
              <span className={`text-sm ${textColor}`}>{component.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        {showSearch && renderSearchBar()}
        <div className="grid grid-cols-2 gap-2">
          {filteredComponents.slice(0, 6).map(component => (
            <button
              key={component.id}
              onClick={() => onSelectComponent?.(component)}
              className={`rounded-lg p-3 ${inputBg} ${hoverBg} text-left transition-colors`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Component size={16} className={mutedColor} />
                {component.isFavorite && <Star size={12} className="text-amber-500" fill="currentColor" />}
              </div>
              <h4 className={`text-sm font-medium ${textColor} truncate`}>{component.name}</h4>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-64 flex-col border-r ${borderColor} ${className}`}>
        <div className="p-4 border-b ${borderColor}">
          <h2 className={`font-semibold ${textColor} mb-3`}>Component Library</h2>
          {showSearch && renderSearchBar()}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {categoryItems.map(category => (
            <div key={category.id} className="mb-1">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 ${hoverBg} transition-colors`}
              >
                {expandedCategories.has(category.id)
                  ? (
                      <ChevronDown size={14} className={mutedColor} />
                    )
                  : (
                      <ChevronRight size={14} className={mutedColor} />
                    )}
                <Folder size={14} className={mutedColor} />
                <span className={`text-sm ${textColor} flex-1 text-left`}>{category.label}</span>
                <span className={`text-xs ${mutedColor}`}>{category.count}</span>
              </button>

              {expandedCategories.has(category.id) && (
                <div className="mt-1 ml-6 space-y-1">
                  {filteredComponents
                    .filter(c => category.id === 'all' || c.category === category.id)
                    .slice(0, 5)
                    .map(component => (
                      <button
                        key={component.id}
                        onClick={() => onSelectComponent?.(component)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${mutedColor} ${hoverBg} text-left transition-colors`}
                      >
                        <Component size={12} />
                        <span className="truncate">{component.name}</span>
                      </button>
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
      <div className={`${bgColor} flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl shadow-2xl ${className}`}>
        {/* Header */}
        <div className={`border-b p-6 ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Component Library</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              {showSearch && renderSearchBar()}
            </div>
            {showFilters && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
                >
                  <List size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Category tabs */}
          {showCategories && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {categoryItems.slice(0, 6).map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : `${inputBg} ${mutedColor} hover:bg-gray-200 dark:hover:bg-gray-700`
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'grid'
            ? (
                <div className="grid grid-cols-3 gap-4">
                  {filteredComponents.map(renderComponentCard)}
                </div>
              )
            : (
                <div className="space-y-2">
                  {filteredComponents.map(renderComponentListItem)}
                </div>
              )}
        </div>

        {/* Footer */}
        <div className={`border-t p-4 ${borderColor} flex items-center justify-between`}>
          <span className={`text-sm ${mutedColor}`}>
            {filteredComponents.length}
            {' '}
            components available
          </span>
          <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            <Check size={16} />
            Done
          </button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full ${className}`}>
      {/* Sidebar */}
      {showCategories && renderCategorySidebar()}

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Component Library</h2>
          {showSearch && renderSearchBar()}
          {showFilters && renderFilters()}
        </div>

        {/* Components */}
        {viewMode === 'grid'
          ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredComponents.map(renderComponentCard)}
              </div>
            )
          : (
              <div className="space-y-2">
                {filteredComponents.map(renderComponentListItem)}
              </div>
            )}

        {filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Component size={48} className={mutedColor} />
            <p className={`mt-4 ${mutedColor}`}>No components found</p>
            <button
              onClick={() => {
                setSearchQuery(''); setSelectedCategory('all');
              }}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
