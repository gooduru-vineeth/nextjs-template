'use client';

import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit,
  Eye,
  Grid3X3,
  Layers,
  Lock,
  Palette,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Type,
  Unlock,
  Upload,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type ColorToken = {
  id: string;
  name: string;
  value: string;
  category: 'primary' | 'secondary' | 'neutral' | 'semantic' | 'accent';
  description?: string;
  usage?: string;
};

export type TypographyToken = {
  id: string;
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
  category: 'heading' | 'body' | 'display' | 'caption' | 'label';
};

export type SpacingToken = {
  id: string;
  name: string;
  value: string;
  pxValue: number;
  usage?: string;
};

export type ShadowToken = {
  id: string;
  name: string;
  value: string;
  category: 'sm' | 'md' | 'lg' | 'xl';
};

export type BorderRadiusToken = {
  id: string;
  name: string;
  value: string;
};

export type DesignSystem = {
  id: string;
  name: string;
  version: string;
  description?: string;
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  shadows: ShadowToken[];
  borderRadius: BorderRadiusToken[];
  isLocked: boolean;
  lastUpdated: Date;
  createdBy: string;
};

export type DesignSystemManagerProps = {
  variant?: 'full' | 'compact' | 'picker';
  designSystem?: DesignSystem;
  onSave?: (system: DesignSystem) => void;
  onExport?: (system: DesignSystem, format: 'json' | 'css' | 'scss' | 'tailwind') => void;
  onImport?: (file: File) => void;
  readOnly?: boolean;
  className?: string;
};

// Default design system
const createDefaultDesignSystem = (): DesignSystem => ({
  id: 'default',
  name: 'MockFlow Design System',
  version: '1.0.0',
  description: 'Default design system for mockup creation',
  isLocked: false,
  lastUpdated: new Date(),
  createdBy: 'System',
  colors: [
    { id: 'primary-500', name: 'Primary', value: '#3B82F6', category: 'primary', description: 'Main brand color' },
    { id: 'primary-600', name: 'Primary Dark', value: '#2563EB', category: 'primary' },
    { id: 'primary-400', name: 'Primary Light', value: '#60A5FA', category: 'primary' },
    { id: 'secondary-500', name: 'Secondary', value: '#8B5CF6', category: 'secondary' },
    { id: 'neutral-50', name: 'Gray 50', value: '#F9FAFB', category: 'neutral' },
    { id: 'neutral-100', name: 'Gray 100', value: '#F3F4F6', category: 'neutral' },
    { id: 'neutral-500', name: 'Gray 500', value: '#6B7280', category: 'neutral' },
    { id: 'neutral-900', name: 'Gray 900', value: '#111827', category: 'neutral' },
    { id: 'success', name: 'Success', value: '#10B981', category: 'semantic', description: 'Success states' },
    { id: 'warning', name: 'Warning', value: '#F59E0B', category: 'semantic', description: 'Warning states' },
    { id: 'error', name: 'Error', value: '#EF4444', category: 'semantic', description: 'Error states' },
    { id: 'info', name: 'Info', value: '#3B82F6', category: 'semantic', description: 'Info states' },
  ],
  typography: [
    { id: 'display', name: 'Display', fontFamily: 'Inter', fontSize: '48px', fontWeight: 700, lineHeight: '1.1', category: 'display' },
    { id: 'h1', name: 'Heading 1', fontFamily: 'Inter', fontSize: '36px', fontWeight: 700, lineHeight: '1.2', category: 'heading' },
    { id: 'h2', name: 'Heading 2', fontFamily: 'Inter', fontSize: '30px', fontWeight: 600, lineHeight: '1.25', category: 'heading' },
    { id: 'h3', name: 'Heading 3', fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, lineHeight: '1.3', category: 'heading' },
    { id: 'h4', name: 'Heading 4', fontFamily: 'Inter', fontSize: '20px', fontWeight: 600, lineHeight: '1.4', category: 'heading' },
    { id: 'body-lg', name: 'Body Large', fontFamily: 'Inter', fontSize: '18px', fontWeight: 400, lineHeight: '1.6', category: 'body' },
    { id: 'body', name: 'Body', fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, lineHeight: '1.5', category: 'body' },
    { id: 'body-sm', name: 'Body Small', fontFamily: 'Inter', fontSize: '14px', fontWeight: 400, lineHeight: '1.5', category: 'body' },
    { id: 'caption', name: 'Caption', fontFamily: 'Inter', fontSize: '12px', fontWeight: 400, lineHeight: '1.4', category: 'caption' },
    { id: 'label', name: 'Label', fontFamily: 'Inter', fontSize: '14px', fontWeight: 500, lineHeight: '1.4', category: 'label' },
  ],
  spacing: [
    { id: 'xs', name: 'Extra Small', value: '0.25rem', pxValue: 4 },
    { id: 'sm', name: 'Small', value: '0.5rem', pxValue: 8 },
    { id: 'md', name: 'Medium', value: '1rem', pxValue: 16 },
    { id: 'lg', name: 'Large', value: '1.5rem', pxValue: 24 },
    { id: 'xl', name: 'Extra Large', value: '2rem', pxValue: 32 },
    { id: '2xl', name: '2X Large', value: '3rem', pxValue: 48 },
    { id: '3xl', name: '3X Large', value: '4rem', pxValue: 64 },
  ],
  shadows: [
    { id: 'sm', name: 'Small', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', category: 'sm' },
    { id: 'md', name: 'Medium', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', category: 'md' },
    { id: 'lg', name: 'Large', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', category: 'lg' },
    { id: 'xl', name: 'Extra Large', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', category: 'xl' },
  ],
  borderRadius: [
    { id: 'none', name: 'None', value: '0' },
    { id: 'sm', name: 'Small', value: '0.25rem' },
    { id: 'md', name: 'Medium', value: '0.375rem' },
    { id: 'lg', name: 'Large', value: '0.5rem' },
    { id: 'xl', name: 'Extra Large', value: '0.75rem' },
    { id: '2xl', name: '2X Large', value: '1rem' },
    { id: 'full', name: 'Full', value: '9999px' },
  ],
});

// Helper components
export const ColorSwatch: React.FC<{
  color: ColorToken;
  onEdit?: () => void;
  onCopy?: () => void;
  selected?: boolean;
  readOnly?: boolean;
}> = ({ color, onEdit, onCopy, selected, readOnly }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div
      className={`group relative rounded-lg border p-3 transition-all ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
      }`}
    >
      <div
        className="mb-2 h-12 w-full rounded-md border border-gray-200 dark:border-gray-600"
        style={{ backgroundColor: color.value }}
      />
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{color.name}</div>
        <div className="font-mono text-xs text-gray-500 dark:text-gray-400">{color.value}</div>
        {color.description && (
          <div className="text-xs text-gray-400 dark:text-gray-500">{color.description}</div>
        )}
      </div>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={handleCopy}
          className="rounded bg-white p-1 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-gray-500" />}
        </button>
        {!readOnly && onEdit && (
          <button
            onClick={onEdit}
            className="rounded bg-white p-1 shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Edit className="h-3 w-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

export const TypographyPreview: React.FC<{
  typography: TypographyToken;
  onEdit?: () => void;
  readOnly?: boolean;
}> = ({ typography, onEdit, readOnly }) => {
  return (
    <div className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{typography.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {typography.fontFamily}
            {' '}
            ·
            {typography.fontSize}
            {' '}
            ·
            {typography.fontWeight}
          </div>
        </div>
        {!readOnly && onEdit && (
          <button
            onClick={onEdit}
            className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Edit className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
      <div
        style={{
          fontFamily: typography.fontFamily,
          fontSize: typography.fontSize,
          fontWeight: typography.fontWeight,
          lineHeight: typography.lineHeight,
          letterSpacing: typography.letterSpacing,
        }}
        className="text-gray-900 dark:text-white"
      >
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  );
};

export const SpacingPreview: React.FC<{
  spacing: SpacingToken;
}> = ({ spacing }) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <div
        className="rounded bg-blue-500"
        style={{ width: spacing.value, height: spacing.value, minWidth: '4px', minHeight: '4px' }}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{spacing.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {spacing.value}
          {' '}
          (
          {spacing.pxValue}
          px)
        </div>
      </div>
    </div>
  );
};

// Section component
type SectionType = 'colors' | 'typography' | 'spacing' | 'shadows' | 'borderRadius';

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onAdd?: () => void;
  readOnly?: boolean;
}> = ({ title, icon, children, defaultOpen = true, onAdd, readOnly }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div
        className="flex cursor-pointer items-center justify-between bg-gray-50 p-4 dark:bg-gray-800/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-gray-500 dark:text-gray-400">{icon}</span>
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
        {!readOnly && onAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

// Main component
export const DesignSystemManager: React.FC<DesignSystemManagerProps> = ({
  variant = 'full',
  designSystem: propDesignSystem,
  onSave,
  onExport,
  onImport: _onImport,
  readOnly = false,
  className = '',
}) => {
  const [designSystem, setDesignSystem] = useState<DesignSystem>(
    () => propDesignSystem || createDefaultDesignSystem(),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<SectionType>('colors');

  const filteredColors = useMemo(() => {
    if (!searchQuery) {
      return designSystem.colors;
    }
    const query = searchQuery.toLowerCase();
    return designSystem.colors.filter(
      c => c.name.toLowerCase().includes(query) || c.value.toLowerCase().includes(query),
    );
  }, [designSystem.colors, searchQuery]);

  const colorsByCategory = useMemo(() => {
    const categories: Record<string, ColorToken[]> = {};
    filteredColors.forEach((color) => {
      if (!categories[color.category]) {
        categories[color.category] = [];
      }
      categories[color.category]!.push(color);
    });
    return categories;
  }, [filteredColors]);

  const handleExport = (format: 'json' | 'css' | 'scss' | 'tailwind') => {
    if (onExport) {
      onExport(designSystem, format);
    }
  };

  const toggleLock = () => {
    setDesignSystem({ ...designSystem, isLocked: !designSystem.isLocked });
  };

  // Picker variant - compact color/token picker
  if (variant === 'picker') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="mb-3 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {(['colors', 'typography', 'spacing'] as SectionType[]).map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                activeSection === section
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {activeSection === 'colors' && (
            <div className="grid grid-cols-4 gap-2">
              {filteredColors.map(color => (
                <button
                  key={color.id}
                  className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  title={`${color.name}: ${color.value}`}
                >
                  <div
                    className="mx-auto h-8 w-8 rounded-md border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="mt-1 truncate text-xs text-gray-600 dark:text-gray-400">{color.name}</div>
                </button>
              ))}
            </div>
          )}
          {activeSection === 'typography' && (
            <div className="space-y-2">
              {designSystem.typography.map(typo => (
                <button
                  key={typo.id}
                  className="w-full rounded p-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{typo.name}</div>
                  <div className="text-xs text-gray-500">
                    {typo.fontSize}
                    {' '}
                    ·
                    {' '}
                    {typo.fontWeight}
                  </div>
                </button>
              ))}
            </div>
          )}
          {activeSection === 'spacing' && (
            <div className="space-y-2">
              {designSystem.spacing.map(space => (
                <button
                  key={space.id}
                  className="flex w-full items-center gap-3 rounded p-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div
                    className="rounded bg-blue-500"
                    style={{ width: space.pxValue, height: space.pxValue, minWidth: '4px', minHeight: '4px' }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{space.name}</div>
                    <div className="text-xs text-gray-500">{space.value}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
            <Palette className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{designSystem.name}</h3>
              <div className="text-xs text-gray-500">
                v
                {designSystem.version}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLock}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={designSystem.isLocked ? 'Unlock' : 'Lock'}
            >
              {designSystem.isLocked
                ? (
                    <Lock className="h-4 w-4 text-gray-500" />
                  )
                : (
                    <Unlock className="h-4 w-4 text-gray-500" />
                  )}
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Colors</div>
            <div className="flex flex-wrap gap-2">
              {designSystem.colors.slice(0, 8).map(color => (
                <div
                  key={color.id}
                  className="h-8 w-8 rounded-md border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color.value }}
                  title={`${color.name}: ${color.value}`}
                />
              ))}
              {designSystem.colors.length > 8 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-500 dark:bg-gray-800">
                  +
                  {designSystem.colors.length - 8}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{designSystem.typography.length}</div>
              <div className="text-xs text-gray-500">Typography</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{designSystem.spacing.length}</div>
              <div className="text-xs text-gray-500">Spacing</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{designSystem.shadows.length}</div>
              <div className="text-xs text-gray-500">Shadows</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-3 text-white">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{designSystem.name}</h2>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  v
                  {designSystem.version}
                </span>
                {designSystem.isLocked && <Lock className="h-4 w-4 text-gray-400" />}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{designSystem.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLock}
              className={`rounded-lg p-2 transition-colors ${
                designSystem.isLocked
                  ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={designSystem.isLocked ? 'Unlock design system' : 'Lock design system'}
            >
              {designSystem.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </button>
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Import"
            >
              <Upload className="h-4 w-4" />
            </button>
            <div className="group relative">
              <button className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Download className="h-4 w-4" />
                Export
              </button>
              <div className="invisible absolute right-0 z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
                {(['json', 'css', 'scss', 'tailwind'] as const).map(format => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full px-4 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Export as
                    {' '}
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            {onSave && (
              <button
                onClick={() => onSave(designSystem)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
        {/* Colors */}
        <Section
          title="Colors"
          icon={<Palette className="h-4 w-4" />}
          onAdd={() => {}}
          readOnly={readOnly || designSystem.isLocked}
        >
          <div className="space-y-6">
            {Object.entries(colorsByCategory).map(([category, colors]) => (
              <div key={category}>
                <h4 className="mb-3 text-sm font-medium text-gray-700 capitalize dark:text-gray-300">
                  {category}
                </h4>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                  {colors.map(color => (
                    <ColorSwatch
                      key={color.id}
                      color={color}
                      readOnly={readOnly || designSystem.isLocked}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section
          title="Typography"
          icon={<Type className="h-4 w-4" />}
          onAdd={() => {}}
          readOnly={readOnly || designSystem.isLocked}
        >
          <div className="space-y-3">
            {designSystem.typography.map(typo => (
              <TypographyPreview
                key={typo.id}
                typography={typo}
                readOnly={readOnly || designSystem.isLocked}
              />
            ))}
          </div>
        </Section>

        {/* Spacing */}
        <Section
          title="Spacing"
          icon={<Grid3X3 className="h-4 w-4" />}
          onAdd={() => {}}
          readOnly={readOnly || designSystem.isLocked}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {designSystem.spacing.map(space => (
              <SpacingPreview key={space.id} spacing={space} />
            ))}
          </div>
        </Section>

        {/* Shadows */}
        <Section
          title="Shadows"
          icon={<Layers className="h-4 w-4" />}
          onAdd={() => {}}
          readOnly={readOnly || designSystem.isLocked}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {designSystem.shadows.map(shadow => (
              <div
                key={shadow.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                style={{ boxShadow: shadow.value }}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">{shadow.name}</div>
                <div className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{shadow.value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Border Radius */}
        <Section
          title="Border Radius"
          icon={<Settings className="h-4 w-4" />}
          onAdd={() => {}}
          readOnly={readOnly || designSystem.isLocked}
        >
          <div className="grid grid-cols-4 gap-4 md:grid-cols-7">
            {designSystem.borderRadius.map(radius => (
              <div key={radius.id} className="text-center">
                <div
                  className="mx-auto mb-2 h-16 w-16 bg-blue-500"
                  style={{ borderRadius: radius.value }}
                />
                <div className="text-sm font-medium text-gray-900 dark:text-white">{radius.name}</div>
                <div className="text-xs text-gray-500">{radius.value}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Created by
            {' '}
            {designSystem.createdBy}
          </span>
          <span className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Last updated
            {' '}
            {designSystem.lastUpdated.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {designSystem.colors.length}
            {' '}
            colors
          </span>
          <span>·</span>
          <span>
            {designSystem.typography.length}
            {' '}
            typography
          </span>
          <span>·</span>
          <span>
            {designSystem.spacing.length}
            {' '}
            spacing
          </span>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemManager;
