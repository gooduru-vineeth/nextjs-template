'use client';

import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronRight,
  Copy,
  Download,
  Edit,
  FileText,
  Folder,
  Grid3X3,
  Info,
  Layers,
  Link2,
  Lock,
  Palette,
  Plus,
  RefreshCw,
  Sliders,
  Square,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type DesignComponentCategory = 'buttons' | 'inputs' | 'cards' | 'navigation' | 'feedback' | 'layout' | 'typography';
export type TokenType = 'color' | 'spacing' | 'typography' | 'shadow' | 'border' | 'animation';
export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';

export type DesignToken = {
  id: string;
  name: string;
  type: TokenType;
  value: string;
  description?: string;
  category: string;
  isLocked: boolean;
  lastModified: Date;
  modifiedBy?: string;
};

export type ComponentSpec = {
  id: string;
  name: string;
  category: DesignComponentCategory;
  description: string;
  variants: string[];
  props: { name: string; type: string; required: boolean; default?: string }[];
  tokens: string[];
  usage: number;
  lastUpdated: Date;
  status: 'stable' | 'beta' | 'deprecated';
};

export type StyleGuideRule = {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  enabled: boolean;
  autoFix: boolean;
};

export type DesignSystemConfig = {
  name: string;
  version: string;
  lastSync: Date;
  syncStatus: SyncStatus;
  source: 'figma' | 'sketch' | 'custom';
  tokens: DesignToken[];
  components: ComponentSpec[];
  rules: StyleGuideRule[];
};

export type DesignSystemIntegrationProps = {
  config?: DesignSystemConfig;
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onSyncDesignSystem?: () => void;
  onUpdateToken?: (tokenId: string, value: string) => void;
  onToggleRule?: (ruleId: string) => void;
  onImportTokens?: (file: File) => void;
  onExportTokens?: () => void;
};

// Mock data
const generateMockConfig = (): DesignSystemConfig => ({
  name: 'MockFlow Design System',
  version: '2.5.0',
  lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
  syncStatus: 'synced',
  source: 'figma',
  tokens: [
    { id: 't1', name: 'Primary', type: 'color', value: '#3B82F6', category: 'Brand', isLocked: true, lastModified: new Date() },
    { id: 't2', name: 'Secondary', type: 'color', value: '#8B5CF6', category: 'Brand', isLocked: true, lastModified: new Date() },
    { id: 't3', name: 'Success', type: 'color', value: '#10B981', category: 'Semantic', isLocked: false, lastModified: new Date() },
    { id: 't4', name: 'Warning', type: 'color', value: '#F59E0B', category: 'Semantic', isLocked: false, lastModified: new Date() },
    { id: 't5', name: 'Error', type: 'color', value: '#EF4444', category: 'Semantic', isLocked: false, lastModified: new Date() },
    { id: 't6', name: 'Background', type: 'color', value: '#FFFFFF', category: 'Surface', isLocked: false, lastModified: new Date() },
    { id: 't7', name: 'Background Dark', type: 'color', value: '#111827', category: 'Surface', isLocked: false, lastModified: new Date() },
    { id: 't8', name: 'Text Primary', type: 'color', value: '#111827', category: 'Text', isLocked: false, lastModified: new Date() },
    { id: 't9', name: 'spacing-xs', type: 'spacing', value: '4px', category: 'Spacing', isLocked: false, lastModified: new Date() },
    { id: 't10', name: 'spacing-sm', type: 'spacing', value: '8px', category: 'Spacing', isLocked: false, lastModified: new Date() },
    { id: 't11', name: 'spacing-md', type: 'spacing', value: '16px', category: 'Spacing', isLocked: false, lastModified: new Date() },
    { id: 't12', name: 'spacing-lg', type: 'spacing', value: '24px', category: 'Spacing', isLocked: false, lastModified: new Date() },
    { id: 't13', name: 'font-heading', type: 'typography', value: 'Inter, sans-serif', category: 'Typography', isLocked: true, lastModified: new Date() },
    { id: 't14', name: 'font-body', type: 'typography', value: 'Inter, sans-serif', category: 'Typography', isLocked: true, lastModified: new Date() },
    { id: 't15', name: 'shadow-sm', type: 'shadow', value: '0 1px 2px rgba(0,0,0,0.05)', category: 'Effects', isLocked: false, lastModified: new Date() },
    { id: 't16', name: 'shadow-md', type: 'shadow', value: '0 4px 6px rgba(0,0,0,0.1)', category: 'Effects', isLocked: false, lastModified: new Date() },
    { id: 't17', name: 'radius-sm', type: 'border', value: '4px', category: 'Border', isLocked: false, lastModified: new Date() },
    { id: 't18', name: 'radius-md', type: 'border', value: '8px', category: 'Border', isLocked: false, lastModified: new Date() },
  ],
  components: [
    { id: 'c1', name: 'Button', category: 'buttons', description: 'Primary interaction element', variants: ['primary', 'secondary', 'outline', 'ghost'], props: [{ name: 'variant', type: 'string', required: false, default: 'primary' }, { name: 'size', type: 'string', required: false, default: 'md' }, { name: 'disabled', type: 'boolean', required: false, default: 'false' }], tokens: ['Primary', 'Secondary', 'spacing-md', 'radius-md'], usage: 1245, lastUpdated: new Date(), status: 'stable' },
    { id: 'c2', name: 'Input', category: 'inputs', description: 'Text input field', variants: ['default', 'error', 'success', 'disabled'], props: [{ name: 'type', type: 'string', required: false, default: 'text' }, { name: 'placeholder', type: 'string', required: false }, { name: 'error', type: 'string', required: false }], tokens: ['Text Primary', 'Background', 'radius-md', 'shadow-sm'], usage: 892, lastUpdated: new Date(), status: 'stable' },
    { id: 'c3', name: 'Card', category: 'cards', description: 'Container for grouped content', variants: ['default', 'elevated', 'outlined', 'interactive'], props: [{ name: 'variant', type: 'string', required: false, default: 'default' }, { name: 'padding', type: 'string', required: false, default: 'md' }], tokens: ['Background', 'shadow-md', 'radius-md', 'spacing-lg'], usage: 756, lastUpdated: new Date(), status: 'stable' },
    { id: 'c4', name: 'Badge', category: 'feedback', description: 'Status indicator', variants: ['default', 'success', 'warning', 'error', 'info'], props: [{ name: 'variant', type: 'string', required: false, default: 'default' }, { name: 'size', type: 'string', required: false, default: 'md' }], tokens: ['Success', 'Warning', 'Error', 'radius-sm'], usage: 534, lastUpdated: new Date(), status: 'stable' },
    { id: 'c5', name: 'Modal', category: 'feedback', description: 'Dialog overlay', variants: ['default', 'fullscreen', 'drawer'], props: [{ name: 'open', type: 'boolean', required: true }, { name: 'onClose', type: 'function', required: true }], tokens: ['Background', 'shadow-lg', 'radius-lg'], usage: 423, lastUpdated: new Date(), status: 'stable' },
    { id: 'c6', name: 'Tabs', category: 'navigation', description: 'Tab navigation', variants: ['default', 'pills', 'underline'], props: [{ name: 'activeTab', type: 'string', required: true }, { name: 'onChange', type: 'function', required: true }], tokens: ['Primary', 'Text Primary', 'spacing-sm'], usage: 312, lastUpdated: new Date(), status: 'beta' },
  ],
  rules: [
    { id: 'r1', name: 'Use Design Tokens', description: 'All colors, spacing, and typography must use design tokens instead of hardcoded values', severity: 'error', category: 'Consistency', enabled: true, autoFix: true },
    { id: 'r2', name: 'Accessible Contrast', description: 'Text and background colors must meet WCAG AA contrast requirements', severity: 'error', category: 'Accessibility', enabled: true, autoFix: false },
    { id: 'r3', name: 'Responsive Units', description: 'Use rem/em units instead of px for typography', severity: 'warning', category: 'Responsiveness', enabled: true, autoFix: true },
    { id: 'r4', name: 'Consistent Spacing', description: 'Use spacing tokens (4px increments) for all margins and padding', severity: 'warning', category: 'Consistency', enabled: true, autoFix: true },
    { id: 'r5', name: 'Component Composition', description: 'Prefer composition over custom implementations', severity: 'info', category: 'Best Practices', enabled: true, autoFix: false },
    { id: 'r6', name: 'Dark Mode Support', description: 'All components should support dark mode variants', severity: 'warning', category: 'Theming', enabled: true, autoFix: false },
    { id: 'r7', name: 'Focus States', description: 'Interactive elements must have visible focus states', severity: 'error', category: 'Accessibility', enabled: true, autoFix: false },
    { id: 'r8', name: 'Loading States', description: 'Async components should show loading indicators', severity: 'info', category: 'UX', enabled: false, autoFix: false },
  ],
});

// Helper functions
const getTokenIcon = (type: TokenType) => {
  const icons: Record<TokenType, typeof Palette> = {
    color: Palette,
    spacing: Grid3X3,
    typography: Type,
    shadow: Layers,
    border: Square,
    animation: RefreshCw,
  };
  return icons[type];
};

const getSeverityColor = (severity: 'error' | 'warning' | 'info'): string => {
  const colors: Record<'error' | 'warning' | 'info', string> = {
    error: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    warning: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    info: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  };
  return colors[severity];
};

const getSyncStatusColor = (status: SyncStatus): string => {
  const colors: Record<SyncStatus, string> = {
    synced: 'text-green-500',
    pending: 'text-amber-500',
    conflict: 'text-orange-500',
    error: 'text-red-500',
  };
  return colors[status];
};

const getStatusBadge = (status: 'stable' | 'beta' | 'deprecated'): { color: string; label: string } => {
  const badges: Record<'stable' | 'beta' | 'deprecated', { color: string; label: string }> = {
    stable: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Stable' },
    beta: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Beta' },
    deprecated: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Deprecated' },
  };
  return badges[status];
};

// Main Component
export default function DesignSystemIntegration({
  config = generateMockConfig(),
  variant = 'full',
  onSyncDesignSystem,
  onUpdateToken: _onUpdateToken,
  onToggleRule,
  onImportTokens: _onImportTokens,
  onExportTokens,
}: DesignSystemIntegrationProps) {
  void _onUpdateToken;
  void _onImportTokens;
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'rules' | 'settings'>('tokens');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToken = (tokenName: string) => {
    navigator.clipboard.writeText(`var(--${tokenName.toLowerCase().replace(/\s+/g, '-')})`);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const tokenCategories = [...new Set(config.tokens.map(t => t.category))];
  const filteredTokens = config.tokens.filter((token) => {
    const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
    const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (variant === 'widget') {
    const colorTokens = config.tokens.filter(t => t.type === 'color').slice(0, 6);
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Design System</span>
          </div>
          <span className={`text-xs ${getSyncStatusColor(config.syncStatus)}`}>
            {config.syncStatus === 'synced' ? '● Synced' : config.syncStatus}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {colorTokens.map(token => (
            <div
              key={token.id}
              className="h-8 w-8 rounded-lg border border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: token.value }}
              title={token.name}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">
            {config.tokens.length}
            {' '}
            tokens •
            {config.components.length}
            {' '}
            components
          </span>
          <button
            onClick={onSyncDesignSystem}
            className="text-purple-600 hover:underline dark:text-purple-400"
          >
            Sync →
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Palette className="h-5 w-5 text-purple-500" />
            Design System
          </h3>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-xs ${getSyncStatusColor(config.syncStatus)}`}>
              <CheckCircle className="h-3 w-3" />
              {config.syncStatus}
            </span>
            <button
              onClick={onSyncDesignSystem}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{config.tokens.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tokens</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{config.components.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Components</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{config.rules.filter(r => r.enabled).length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Rules Active</p>
          </div>
        </div>

        {/* Color Palette Preview */}
        <div>
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Color Palette</p>
          <div className="flex gap-1">
            {config.tokens.filter(t => t.type === 'color').slice(0, 8).map(token => (
              <div
                key={token.id}
                className="h-8 flex-1 rounded first:rounded-l-lg last:rounded-r-lg"
                style={{ backgroundColor: token.value }}
                title={token.name}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Palette className="h-5 w-5 text-purple-500" />
              {config.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              v
              {config.version}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getSyncStatusColor(config.syncStatus)} bg-gray-100 dark:bg-gray-800`}>
              <CheckCircle className="h-3 w-3" />
              {config.syncStatus === 'synced' ? 'Synced' : config.syncStatus}
            </span>
            <button
              onClick={onSyncDesignSystem}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-700"
            >
              <RefreshCw className="h-4 w-4" />
              Sync
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Colors</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.tokens.filter(t => t.type === 'color').length}
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Spacing</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.tokens.filter(t => t.type === 'spacing').length}
            </p>
          </div>
          <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Components</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{config.components.length}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Active Rules</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.rules.filter(r => r.enabled).length}
              /
              {config.rules.length}
            </p>
          </div>
        </div>

        {/* Recent Components */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Top Components</h4>
          <div className="space-y-2">
            {config.components.slice(0, 4).map((comp) => {
              const badge = getStatusBadge(comp.status);
              return (
                <div
                  key={comp.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{comp.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {comp.variants.length}
                        {' '}
                        variants
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${badge.color}`}>{badge.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comp.usage}
                      {' '}
                      uses
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Palette className="h-6 w-6 text-purple-500" />
              Design System Integration
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {config.name}
              {' '}
              • v
              {config.version}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
              <Link2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Connected to Figma</span>
              <span className={`flex items-center gap-1 text-xs ${getSyncStatusColor(config.syncStatus)}`}>
                <CheckCircle className="h-3 w-3" />
              </span>
            </div>
            <button
              onClick={onSyncDesignSystem}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['tokens', 'components', 'rules', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'tokens' && (
          <div>
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tokens..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm dark:border-gray-700 dark:bg-gray-800"
                  />
                  <Sliders className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="all">All Categories</option>
                  {tokenCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onExportTokens}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <Upload className="h-4 w-4" />
                  Import
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700">
                  <Plus className="h-4 w-4" />
                  Add Token
                </button>
              </div>
            </div>

            {/* Token Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTokens.map((token) => {
                const TokenIcon = getTokenIcon(token.type);
                return (
                  <div
                    key={token.id}
                    className="rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {token.type === 'color'
                          ? (
                              <div
                                className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700"
                                style={{ backgroundColor: token.value }}
                              />
                            )
                          : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <TokenIcon className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{token.name}</span>
                            {token.isLocked && <Lock className="h-3 w-3 text-gray-400" />}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{token.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToken(token.name)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {copiedToken === token.name
                          ? (
                              <Check className="h-4 w-4 text-green-500" />
                            )
                          : (
                              <Copy className="h-4 w-4" />
                            )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {token.value}
                      </code>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        {!token.isLocked && (
                          <button className="p-1 text-gray-400 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-4">
            {config.components.map((comp) => {
              const badge = getStatusBadge(comp.status);
              return (
                <div
                  key={comp.id}
                  className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                        <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{comp.name}</h4>
                          <span className={`rounded px-2 py-0.5 text-xs ${badge.color}`}>{badge.label}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{comp.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{comp.usage}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">instances</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Variants:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{comp.variants.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Props:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{comp.props.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Tokens:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{comp.tokens.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            {config.rules.map(rule => (
              <div
                key={rule.id}
                className={`rounded-xl border p-4 ${
                  rule.enabled
                    ? 'border-gray-200 dark:border-gray-700'
                    : 'border-gray-100 opacity-60 dark:border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${getSeverityColor(rule.severity)}`}>
                      {rule.severity === 'error'
                        ? (
                            <AlertCircle className="h-5 w-5" />
                          )
                        : rule.severity === 'warning'
                          ? (
                              <AlertCircle className="h-5 w-5" />
                            )
                          : (
                              <Info className="h-5 w-5" />
                            )}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{rule.name}</h4>
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                          {rule.category}
                        </span>
                        {rule.autoFix && (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Auto-fix
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{rule.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleRule?.(rule.id)}
                    className={`relative h-6 w-12 rounded-full transition-colors ${
                      rule.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                        rule.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Source Connection */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h4 className="mb-4 font-medium text-gray-900 dark:text-white">Design Source</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Figma</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">mockflow-design-system</p>
                  </div>
                </div>
                <button className="rounded-lg px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30">
                  Change Source
                </button>
              </div>
            </div>

            {/* Sync Settings */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h4 className="mb-4 font-medium text-gray-900 dark:text-white">Sync Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Auto-sync on save</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically sync when design files are saved</p>
                  </div>
                  <button className="relative h-6 w-12 rounded-full bg-purple-600">
                    <div className="absolute top-1 h-4 w-4 translate-x-7 rounded-full bg-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Notify on conflicts</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Get notified when sync conflicts occur</p>
                  </div>
                  <button className="relative h-6 w-12 rounded-full bg-purple-600">
                    <div className="absolute top-1 h-4 w-4 translate-x-7 rounded-full bg-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">Preserve local overrides</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Keep local changes during sync</p>
                  </div>
                  <button className="relative h-6 w-12 rounded-full bg-gray-300 dark:bg-gray-700">
                    <div className="absolute top-1 h-4 w-4 translate-x-1 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <h4 className="mb-4 font-medium text-gray-900 dark:text-white">Export Options</h4>
              <div className="grid grid-cols-3 gap-3">
                <button className="rounded-lg border border-gray-200 p-3 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <FileText className="mx-auto mb-1 h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">CSS Variables</span>
                </button>
                <button className="rounded-lg border border-gray-200 p-3 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <FileText className="mx-auto mb-1 h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Tailwind Config</span>
                </button>
                <button className="rounded-lg border border-gray-200 p-3 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <FileText className="mx-auto mb-1 h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">JSON Tokens</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
