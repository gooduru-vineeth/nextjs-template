'use client';

import {
  BookOpen,
  Box,
  Check,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  Filter,
  Grid,
  Layers,
  List,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  Upload,
  User,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type ComponentCategory
  = | 'buttons'
    | 'inputs'
    | 'cards'
    | 'navigation'
    | 'feedback'
    | 'layout'
    | 'data-display'
    | 'overlays'
    | 'typography'
    | 'media';

export type ComponentStatus = 'stable' | 'beta' | 'deprecated' | 'experimental';

export type ComponentVariant = {
  id: string;
  name: string;
  description?: string;
  props: Record<string, unknown>;
  preview?: string;
};

export type LibraryComponent = {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  status: ComponentStatus;
  version: string;
  author: string;
  tags: string[];
  variants: ComponentVariant[];
  code: string;
  usage: string;
  props: {
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
  }[];
  dependencies?: string[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  isFavorite?: boolean;
};

export type ComponentLibraryProps = {
  variant?: 'full' | 'compact' | 'browser';
  components?: LibraryComponent[];
  onSelect?: (component: LibraryComponent) => void;
  onCopyCode?: (code: string) => void;
  onCreateComponent?: () => void;
  onEditComponent?: (component: LibraryComponent) => void;
  onDeleteComponent?: (componentId: string) => void;
  readOnly?: boolean;
  className?: string;
};

// Mock data generator
const generateMockComponents = (): LibraryComponent[] => {
  const statuses: ComponentStatus[] = ['stable', 'beta', 'deprecated', 'experimental'];

  const componentDefs = [
    { name: 'Button', category: 'buttons', desc: 'Versatile button component with multiple variants' },
    { name: 'IconButton', category: 'buttons', desc: 'Compact button with icon only' },
    { name: 'ButtonGroup', category: 'buttons', desc: 'Group of related buttons' },
    { name: 'TextField', category: 'inputs', desc: 'Text input with label and validation' },
    { name: 'Select', category: 'inputs', desc: 'Dropdown selection component' },
    { name: 'Checkbox', category: 'inputs', desc: 'Checkbox input with label' },
    { name: 'Toggle', category: 'inputs', desc: 'Toggle switch component' },
    { name: 'Card', category: 'cards', desc: 'Container card with header and footer' },
    { name: 'ProfileCard', category: 'cards', desc: 'User profile display card' },
    { name: 'StatsCard', category: 'cards', desc: 'Statistics display card' },
    { name: 'Navbar', category: 'navigation', desc: 'Top navigation bar' },
    { name: 'Sidebar', category: 'navigation', desc: 'Side navigation menu' },
    { name: 'Breadcrumbs', category: 'navigation', desc: 'Navigation breadcrumbs' },
    { name: 'Tabs', category: 'navigation', desc: 'Tab navigation component' },
    { name: 'Alert', category: 'feedback', desc: 'Alert notification banner' },
    { name: 'Toast', category: 'feedback', desc: 'Toast notification popup' },
    { name: 'Progress', category: 'feedback', desc: 'Progress bar component' },
    { name: 'Spinner', category: 'feedback', desc: 'Loading spinner indicator' },
    { name: 'Container', category: 'layout', desc: 'Responsive container wrapper' },
    { name: 'Grid', category: 'layout', desc: 'Grid layout system' },
  ];

  return componentDefs.map((def, index) => ({
    id: `comp-${index}`,
    name: def.name,
    description: def.desc,
    category: def.category as ComponentCategory,
    status: statuses[Math.floor(Math.random() * statuses.length)]!,
    version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    author: ['John Doe', 'Sarah Smith', 'Mike Chen'][Math.floor(Math.random() * 3)]!,
    tags: ['responsive', 'accessible', 'themed', 'animated'].slice(0, Math.floor(Math.random() * 3) + 1),
    variants: [
      { id: 'default', name: 'Default', props: {} },
      { id: 'primary', name: 'Primary', props: { variant: 'primary' } },
      { id: 'secondary', name: 'Secondary', props: { variant: 'secondary' } },
    ],
    code: `import { ${def.name} } from '@mockflow/components';

export default function Example() {
  return <${def.name} />;
}`,
    usage: `<${def.name} variant="primary" />`,
    props: [
      { name: 'variant', type: 'string', required: false, default: '"default"', description: 'Visual variant of the component' },
      { name: 'size', type: '"sm" | "md" | "lg"', required: false, default: '"md"', description: 'Size of the component' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable the component' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
    ],
    dependencies: ['react', 'tailwindcss'],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    usageCount: Math.floor(Math.random() * 500),
    isFavorite: Math.random() > 0.7,
  }));
};

// Helper components
const StatusBadge: React.FC<{ status: ComponentStatus }> = ({ status }) => {
  const styles = {
    stable: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    beta: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    deprecated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    experimental: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

const CategoryIcon: React.FC<{ category: ComponentCategory; className?: string }> = ({ category, className = 'w-4 h-4' }) => {
  const icons: Record<ComponentCategory, React.ReactNode> = {
    'buttons': <Box className={className} />,
    'inputs': <Edit className={className} />,
    'cards': <Layers className={className} />,
    'navigation': <Grid className={className} />,
    'feedback': <Zap className={className} />,
    'layout': <Grid className={className} />,
    'data-display': <Eye className={className} />,
    'overlays': <Layers className={className} />,
    'typography': <BookOpen className={className} />,
    'media': <Eye className={className} />,
  };
  return <>{icons[category]}</>;
};

// Component card
export const ComponentCard: React.FC<{
  component: LibraryComponent;
  onSelect?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  readOnly?: boolean;
  view?: 'grid' | 'list';
}> = ({ component, onSelect, onCopy, onEdit, onDelete, onToggleFavorite, readOnly, view = 'grid' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(component.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  if (view === 'list') {
    return (
      <div
        className="flex cursor-pointer items-center gap-4 border-b border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
        onClick={onSelect}
      >
        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
          <CategoryIcon category={component.category} className="h-5 w-5 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">{component.name}</span>
            <StatusBadge status={component.status} />
            {component.isFavorite && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
          </div>
          <div className="truncate text-sm text-gray-500 dark:text-gray-400">{component.description}</div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          v
          {component.version}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-500" />}
          </button>
          {!readOnly && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation(); onEdit?.();
                }}
                className="rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 text-gray-500" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); onDelete?.();
                }}
                className="rounded-lg p-2 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-500"
      onClick={onSelect}
    >
      {/* Preview area */}
      <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="text-gray-400 dark:text-gray-500">
          <CategoryIcon category={component.category} className="h-12 w-12" />
        </div>
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className="rounded bg-white p-1.5 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-500" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onToggleFavorite?.();
            }}
            className="rounded bg-white p-1.5 shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
            title="Toggle favorite"
          >
            <Star className={`h-3.5 w-3.5 ${component.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">{component.name}</h3>
          <StatusBadge status={component.status} />
        </div>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{component.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {component.category}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            v
            {component.version}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {component.usageCount}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {component.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component detail panel
export const ComponentDetailPanel: React.FC<{
  component: LibraryComponent;
  onClose: () => void;
  onCopyCode?: () => void;
}> = ({ component, onClose, onCopyCode }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props' | 'usage'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(component.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopyCode?.();
  };

  return (
    <div className="flex h-full flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
              <CategoryIcon category={component.category} className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{component.name}</h2>
              <div className="flex items-center gap-2">
                <StatusBadge status={component.status} />
                <span className="text-xs text-gray-500">
                  v
                  {component.version}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{component.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['preview', 'code', 'props', 'usage'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <div className="text-center text-gray-400 dark:text-gray-500">
                <CategoryIcon category={component.category} className="mx-auto mb-4 h-16 w-16" />
                <p>Component preview</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Variants</h4>
              <div className="grid grid-cols-3 gap-2">
                {component.variants.map(variant => (
                  <button
                    key={variant.id}
                    className="rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-blue-500 dark:border-gray-700"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{variant.name}</div>
                    {variant.description && (
                      <div className="text-xs text-gray-500">{variant.description}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Source Code</h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 dark:bg-gray-950">
              <code className="text-sm text-gray-300">{component.code}</code>
            </pre>
          </div>
        )}

        {activeTab === 'props' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Props</h4>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Default</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {component.props.map(prop => (
                    <tr key={prop.name}>
                      <td className="px-4 py-2">
                        <code className="text-blue-600 dark:text-blue-400">{prop.name}</code>
                        {prop.required && <span className="ml-1 text-red-500">*</span>}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-400">
                        {prop.type}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-500">
                        {prop.default || '-'}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {prop.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Basic Usage</h4>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 dark:bg-gray-950">
              <code className="text-sm text-gray-300">{component.usage}</code>
            </pre>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h5 className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-300">Dependencies</h5>
              <div className="flex flex-wrap gap-2">
                {component.dependencies?.map(dep => (
                  <span key={dep} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 p-4 text-xs text-gray-500 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {component.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Updated
            {' '}
            {component.updatedAt.toLocaleDateString()}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          {component.usageCount}
          {' '}
          uses
        </span>
      </div>
    </div>
  );
};

// Main component
export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  variant = 'full',
  components: propComponents,
  onSelect,
  onCopyCode,
  onCreateComponent,
  onEditComponent,
  onDeleteComponent,
  readOnly = false,
  className = '',
}) => {
  const [components] = useState<LibraryComponent[]>(() => propComponents || generateMockComponents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [selectedComponent, setSelectedComponent] = useState<LibraryComponent | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComponentStatus | 'all'>('all');

  const categories: ComponentCategory[] = [
    'buttons',
    'inputs',
    'cards',
    'navigation',
    'feedback',
    'layout',
    'data-display',
    'overlays',
    'typography',
    'media',
  ];

  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch
          = comp.name.toLowerCase().includes(query)
            || comp.description.toLowerCase().includes(query)
            || comp.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && comp.category !== selectedCategory) {
        return false;
      }

      // Status
      if (statusFilter !== 'all' && comp.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [components, searchQuery, selectedCategory, statusFilter]);

  // Browser variant - simple component picker
  if (variant === 'browser') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-3 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {filteredComponents.map(comp => (
              <button
                key={comp.id}
                onClick={() => {
                  setSelectedComponent(comp);
                  onSelect?.(comp);
                }}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selectedComponent?.id === comp.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">{comp.name}</div>
                <div className="text-xs text-gray-500 capitalize">{comp.category}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Box className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Component Library</h3>
          </div>
          <span className="text-sm text-gray-500">
            {components.length}
            {' '}
            components
          </span>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {filteredComponents.slice(0, 8).map(comp => (
              <div
                key={comp.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                onClick={() => onSelect?.(comp)}
              >
                <CategoryIcon category={comp.category} className="h-4 w-4 text-gray-500" />
                <span className="flex-1 text-sm text-gray-900 dark:text-white">{comp.name}</span>
                <StatusBadge status={comp.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2 text-white">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Components</h2>
              <p className="text-xs text-gray-500">
                {components.length}
                {' '}
                available
              </p>
            </div>
          </div>
          {!readOnly && onCreateComponent && (
            <button
              onClick={onCreateComponent}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              New Component
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span className="flex-1">All Components</span>
            <span className="text-xs text-gray-500">{components.length}</span>
          </button>
          {categories.map((category) => {
            const count = components.filter(c => c.category === category).length;
            if (count === 0) {
              return null;
            }
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left capitalize transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <CategoryIcon category={category} />
                <span className="flex-1">{category.replace('-', ' ')}</span>
                <span className="text-xs text-gray-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Upload className="h-4 w-4" />
            </button>
            <button className="rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Filter bar */}
          {showFilters && (
            <div className="mt-4 flex items-center gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as ComponentStatus | 'all')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="all">All</option>
                  <option value="stable">Stable</option>
                  <option value="beta">Beta</option>
                  <option value="experimental">Experimental</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Components grid/list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredComponents.length === 0
            ? (
                <div className="py-12 text-center">
                  <Box className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No components found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )
            : viewMode === 'grid'
              ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredComponents.map(comp => (
                      <ComponentCard
                        key={comp.id}
                        component={comp}
                        view="grid"
                        readOnly={readOnly}
                        onSelect={() => {
                          setSelectedComponent(comp);
                          onSelect?.(comp);
                        }}
                        onCopy={() => onCopyCode?.(comp.code)}
                        onEdit={() => onEditComponent?.(comp)}
                        onDelete={() => onDeleteComponent?.(comp.id)}
                      />
                    ))}
                  </div>
                )
              : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    {filteredComponents.map(comp => (
                      <ComponentCard
                        key={comp.id}
                        component={comp}
                        view="list"
                        readOnly={readOnly}
                        onSelect={() => {
                          setSelectedComponent(comp);
                          onSelect?.(comp);
                        }}
                        onCopy={() => onCopyCode?.(comp.code)}
                        onEdit={() => onEditComponent?.(comp)}
                        onDelete={() => onDeleteComponent?.(comp.id)}
                      />
                    ))}
                  </div>
                )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedComponent && (
        <div className="w-96 flex-shrink-0">
          <ComponentDetailPanel
            component={selectedComponent}
            onClose={() => setSelectedComponent(null)}
            onCopyCode={() => onCopyCode?.(selectedComponent.code)}
          />
        </div>
      )}
    </div>
  );
};

export default ComponentLibrary;
