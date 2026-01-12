'use client';

import {
  Check,
  ChevronDown,
  Copy,
  FileText,
  Info,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type VariableType = 'text' | 'number' | 'date' | 'auto';

type NamingVariable = {
  id: string;
  name: string;
  description: string;
  type: VariableType;
  example: string;
  token: string;
};

type NamingPreset = {
  id: string;
  name: string;
  pattern: string;
  description: string;
  isDefault?: boolean;
};

type NamingSettings = {
  separator: '_' | '-' | '.';
  caseStyle: 'lowercase' | 'uppercase' | 'camelCase' | 'PascalCase' | 'kebab-case' | 'snake_case';
  includeTimestamp: boolean;
  timestampFormat: 'unix' | 'iso' | 'date' | 'datetime';
  maxLength: number;
  sanitize: boolean;
};

type ExportNamingConventionsProps = {
  variant?: 'full' | 'compact' | 'inline';
  onSave?: (pattern: string, settings: NamingSettings) => void;
  onPresetSelect?: (preset: NamingPreset) => void;
  className?: string;
};

// Available variables
const availableVariables: NamingVariable[] = [
  { id: 'mockup-name', name: 'Mockup Name', description: 'Name of the mockup', type: 'text', example: 'homepage-hero', token: '{mockup-name}' },
  { id: 'platform', name: 'Platform', description: 'Platform type (whatsapp, chatgpt, etc)', type: 'text', example: 'whatsapp', token: '{platform}' },
  { id: 'project', name: 'Project', description: 'Project name', type: 'text', example: 'marketing-campaign', token: '{project}' },
  { id: 'version', name: 'Version', description: 'Version number', type: 'number', example: 'v2', token: '{version}' },
  { id: 'date', name: 'Date', description: 'Export date', type: 'date', example: '2024-01-15', token: '{date}' },
  { id: 'time', name: 'Time', description: 'Export time', type: 'date', example: '14-30', token: '{time}' },
  { id: 'timestamp', name: 'Timestamp', description: 'Full timestamp', type: 'date', example: '1705323000', token: '{timestamp}' },
  { id: 'counter', name: 'Counter', description: 'Auto-incrementing number', type: 'auto', example: '001', token: '{counter}' },
  { id: 'format', name: 'Format', description: 'Export format', type: 'auto', example: 'png', token: '{format}' },
  { id: 'width', name: 'Width', description: 'Export width', type: 'number', example: '1440', token: '{width}' },
  { id: 'height', name: 'Height', description: 'Export height', type: 'number', example: '900', token: '{height}' },
];

// Default presets
const defaultPresets: NamingPreset[] = [
  { id: 'simple', name: 'Simple', pattern: '{mockup-name}', description: 'Just the mockup name', isDefault: true },
  { id: 'versioned', name: 'Versioned', pattern: '{mockup-name}_{version}', description: 'Name with version number' },
  { id: 'dated', name: 'Dated', pattern: '{mockup-name}_{date}', description: 'Name with export date' },
  { id: 'full', name: 'Full Details', pattern: '{project}_{mockup-name}_{version}_{date}', description: 'Complete naming with all details' },
  { id: 'platform', name: 'Platform Based', pattern: '{platform}_{mockup-name}_{counter}', description: 'Organized by platform' },
  { id: 'dimensions', name: 'With Dimensions', pattern: '{mockup-name}_{width}x{height}', description: 'Includes export dimensions' },
];

export default function ExportNamingConventions({
  variant = 'full',
  onSave,
  onPresetSelect,
  className = '',
}: ExportNamingConventionsProps) {
  const [pattern, setPattern] = useState('{mockup-name}_{version}_{date}');
  const [settings, setSettings] = useState<NamingSettings>({
    separator: '_',
    caseStyle: 'lowercase',
    includeTimestamp: false,
    timestampFormat: 'date',
    maxLength: 100,
    sanitize: true,
  });
  const [presets, setPresets] = useState<NamingPreset[]>(defaultPresets);
  const [activePreset, setActivePreset] = useState<string | null>('versioned');
  const [showVariables, setShowVariables] = useState(false);

  const generatePreview = useCallback(() => {
    let preview = pattern;

    // Replace variables with examples
    availableVariables.forEach((variable) => {
      preview = preview.replace(new RegExp(variable.token.replace(/[{}]/g, '\\$&'), 'g'), variable.example);
    });

    // Apply case style
    switch (settings.caseStyle) {
      case 'lowercase':
        preview = preview.toLowerCase();
        break;
      case 'uppercase':
        preview = preview.toUpperCase();
        break;
      case 'camelCase':
        preview = preview.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
        break;
      case 'PascalCase':
        preview = preview.charAt(0).toUpperCase() + preview.slice(1).replace(/[-_](.)/g, (_, c) => c.toUpperCase());
        break;
      case 'kebab-case':
        preview = preview.replace(/[_\s]+/g, '-').toLowerCase();
        break;
      case 'snake_case':
        preview = preview.replace(/[-\s]+/g, '_').toLowerCase();
        break;
    }

    // Sanitize
    if (settings.sanitize) {
      preview = preview.replace(/[^\w-.]/g, '');
    }

    // Truncate
    if (preview.length > settings.maxLength) {
      preview = preview.substring(0, settings.maxLength);
    }

    return `${preview}.png`;
  }, [pattern, settings]);

  const insertVariable = useCallback((token: string) => {
    setPattern(prev => prev + token);
    setActivePreset(null);
  }, []);

  const selectPreset = useCallback((preset: NamingPreset) => {
    setPattern(preset.pattern);
    setActivePreset(preset.id);
    onPresetSelect?.(preset);
  }, [onPresetSelect]);

  const savePreset = useCallback(() => {
    const newPreset: NamingPreset = {
      id: `custom-${Date.now()}`,
      name: 'Custom Preset',
      pattern,
      description: 'Custom naming convention',
    };
    setPresets(prev => [...prev, newPreset]);
    setActivePreset(newPreset.id);
  }, [pattern]);

  const handleSave = useCallback(() => {
    onSave?.(pattern, settings);
  }, [pattern, settings, onSave]);

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative flex-1">
          <input
            type="text"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setActivePreset(null);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Enter naming pattern..."
          />
          <button
            onClick={() => setShowVariables(!showVariables)}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="px-2 text-sm text-gray-500">→</span>
        <code className="rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          {generatePreview()}
        </code>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Export Naming</h3>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
        </div>

        {/* Pattern input */}
        <div className="mb-3">
          <input
            type="text"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setActivePreset(null);
            }}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Preview */}
        <div className="flex items-center gap-2 rounded bg-gray-50 p-2 dark:bg-gray-700/50">
          <FileText className="h-4 w-4 text-gray-400" />
          <code className="truncate font-mono text-sm text-gray-700 dark:text-gray-300">
            {generatePreview()}
          </code>
        </div>

        {/* Quick presets */}
        <div className="mt-3 flex flex-wrap gap-1">
          {presets.slice(0, 4).map(preset => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className={`rounded px-2 py-1 text-xs ${
                activePreset === preset.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {preset.name}
            </button>
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
            <FileText className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Export Naming Conventions</h2>
              <p className="text-sm text-gray-500">Customize how your exported files are named</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>

        {/* Pattern builder */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900 dark:text-white">Naming Pattern</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pattern}
              onChange={(e) => {
                setPattern(e.target.value);
                setActivePreset(null);
              }}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 font-mono text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter naming pattern using {variables}"
            />
            <button
              onClick={() => setShowVariables(!showVariables)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Variable
              <ChevronDown className={`h-4 w-4 transition-transform ${showVariables ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Variables dropdown */}
          {showVariables && (
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              {availableVariables.map(variable => (
                <button
                  key={variable.id}
                  onClick={() => insertVariable(variable.token)}
                  className="flex items-start gap-2 rounded-lg p-2 text-left hover:bg-white dark:hover:bg-gray-700"
                >
                  <code className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {variable.token}
                  </code>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{variable.name}</p>
                    <p className="truncate text-xs text-gray-500">{variable.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Preview */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <span className="text-sm text-gray-500">Preview:</span>
            <code className="flex-1 font-mono text-gray-900 dark:text-white">
              {generatePreview()}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(generatePreview())}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Presets */}
        <div className="w-1/3 border-r border-gray-200 p-6 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Presets</h3>
            <button
              onClick={savePreset}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Save as preset
            </button>
          </div>
          <div className="space-y-2">
            {presets.map(preset => (
              <div
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  activePreset === preset.id
                    ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-2 border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{preset.name}</span>
                  {activePreset === preset.id && <Check className="h-4 w-4 text-blue-500" />}
                </div>
                <p className="mb-2 text-xs text-gray-500">{preset.description}</p>
                <code className="block truncate font-mono text-xs text-gray-600 dark:text-gray-400">
                  {preset.pattern}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="flex-1 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
            <Settings className="h-4 w-4" />
            Formatting Options
          </h3>
          <div className="space-y-4">
            {/* Separator */}
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">Separator</label>
              <div className="flex gap-2">
                {(['_', '-', '.'] as const).map(sep => (
                  <button
                    key={sep}
                    onClick={() => setSettings(prev => ({ ...prev, separator: sep }))}
                    className={`rounded-lg px-4 py-2 font-mono text-sm ${
                      settings.separator === sep
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {sep === '_' ? 'underscore' : sep === '-' ? 'hyphen' : 'dot'}
                  </button>
                ))}
              </div>
            </div>

            {/* Case style */}
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">Case Style</label>
              <select
                value={settings.caseStyle}
                onChange={e => setSettings(prev => ({ ...prev, caseStyle: e.target.value as NamingSettings['caseStyle'] }))}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="lowercase">lowercase</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="camelCase">camelCase</option>
                <option value="PascalCase">PascalCase</option>
                <option value="kebab-case">kebab-case</option>
                <option value="snake_case">snake_case</option>
              </select>
            </div>

            {/* Max length */}
            <div>
              <label className="mb-2 block text-sm text-gray-700 dark:text-gray-300">
                Maximum Length:
                {' '}
                {settings.maxLength}
                {' '}
                characters
              </label>
              <input
                type="range"
                min="20"
                max="255"
                value={settings.maxLength}
                onChange={e => setSettings(prev => ({ ...prev, maxLength: Number(e.target.value) }))}
                className="w-full"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.sanitize}
                  onChange={e => setSettings(prev => ({ ...prev, sanitize: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sanitize special characters</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.includeTimestamp}
                  onChange={e => setSettings(prev => ({ ...prev, includeTimestamp: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Always include timestamp</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900">
        <Info className="h-4 w-4" />
        Tip: Use variables in curly braces like
        {' '}
        {'{mockup-name}'}
        {' '}
        to create dynamic file names
      </div>
    </div>
  );
}

// Suppress unused variable warnings
void Trash2;
void RefreshCw;

export type { ExportNamingConventionsProps, NamingPreset, NamingSettings, NamingVariable };
