'use client';

import { useState } from 'react';

type ExportFormat = 'png' | 'jpeg' | 'webp' | 'svg' | 'pdf' | 'gif';

type ExportOptions = {
  format: ExportFormat;
  quality: number;
  scale: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  includeDeviceFrame: boolean;
  includeBackground: boolean;
  transparentBackground: boolean;
  fileName: string;
};

type ExportPreset = {
  id: string;
  name: string;
  description: string;
  options: Partial<ExportOptions>;
  icon?: string;
};

const defaultOptions: ExportOptions = {
  format: 'png',
  quality: 1,
  scale: 2,
  maintainAspectRatio: true,
  includeDeviceFrame: true,
  includeBackground: true,
  transparentBackground: false,
  fileName: 'mockup',
};

const presets: ExportPreset[] = [
  {
    id: 'social-twitter',
    name: 'Twitter Post',
    description: '1200 x 675 px',
    options: { width: 1200, height: 675, format: 'png' },
    icon: '🐦',
  },
  {
    id: 'social-instagram',
    name: 'Instagram Post',
    description: '1080 x 1080 px',
    options: { width: 1080, height: 1080, format: 'png' },
    icon: '📸',
  },
  {
    id: 'social-linkedin',
    name: 'LinkedIn Post',
    description: '1200 x 627 px',
    options: { width: 1200, height: 627, format: 'png' },
    icon: '💼',
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: '1920 x 1080 px',
    options: { width: 1920, height: 1080, format: 'png', scale: 2 },
    icon: '📊',
  },
  {
    id: 'web-hd',
    name: 'Web HD',
    description: '2x scale PNG',
    options: { scale: 2, format: 'png' },
    icon: '🖥️',
  },
  {
    id: 'web-small',
    name: 'Web Optimized',
    description: 'Compressed JPEG',
    options: { format: 'jpeg', quality: 0.8, scale: 1 },
    icon: '🌐',
  },
  {
    id: 'print',
    name: 'Print Quality',
    description: '4x scale PNG',
    options: { scale: 4, format: 'png' },
    icon: '🖨️',
  },
  {
    id: 'animation',
    name: 'Animation',
    description: 'Animated GIF',
    options: { format: 'gif' },
    icon: '🎬',
  },
];

type ExportOptionsPanelProps = {
  options?: Partial<ExportOptions>;
  onChange: (options: ExportOptions) => void;
  onExport: (options: ExportOptions) => void;
  isExporting?: boolean;
  showPresets?: boolean;
  className?: string;
};

export function ExportOptionsPanel({
  options: initialOptions,
  onChange,
  onExport,
  isExporting = false,
  showPresets = true,
  className = '',
}: ExportOptionsPanelProps) {
  const [options, setOptions] = useState<ExportOptions>({
    ...defaultOptions,
    ...initialOptions,
  });
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const handleChange = (partial: Partial<ExportOptions>) => {
    const newOptions = { ...options, ...partial };
    setOptions(newOptions);
    onChange(newOptions);
  };

  const handlePresetSelect = (preset: ExportPreset) => {
    const newOptions = { ...options, ...preset.options };
    setOptions(newOptions);
    onChange(newOptions);
  };

  const handleExport = () => {
    onExport(options);
  };

  const formatInfo: Record<ExportFormat, { label: string; description: string }> = {
    png: { label: 'PNG', description: 'Best quality, supports transparency' },
    jpeg: { label: 'JPEG', description: 'Smaller file size, no transparency' },
    webp: { label: 'WebP', description: 'Modern format, good compression' },
    svg: { label: 'SVG', description: 'Vector format, scalable' },
    pdf: { label: 'PDF', description: 'Document format, print-ready' },
    gif: { label: 'GIF', description: 'Animated format' },
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Export Options</h3>
      </div>

      {/* Tab Navigation */}
      {showPresets && (
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'presets'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Custom
          </button>
        </div>
      )}

      <div className="p-4">
        {/* Presets Tab */}
        {showPresets && activeTab === 'presets' && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              >
                <span className="text-xl">{preset.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{preset.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{preset.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Custom Tab / Format Selection */}
        {(!showPresets || activeTab === 'custom') && (
          <div className="space-y-4">
            {/* Format */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(formatInfo) as ExportFormat[]).map(format => (
                  <button
                    key={format}
                    onClick={() => handleChange({ format })}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      options.format === format
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {formatInfo[format].label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">{formatInfo[options.format].description}</p>
            </div>

            {/* Quality (for JPEG/WebP) */}
            {(options.format === 'jpeg' || options.format === 'webp') && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality</label>
                  <span className="text-sm text-gray-500">
                    {Math.round(options.quality * 100)}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={options.quality}
                  onChange={e => handleChange({ quality: Number.parseFloat(e.target.value) })}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                />
              </div>
            )}

            {/* Scale */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Scale</label>
                <span className="text-sm text-gray-500">
                  {options.scale}
                  x
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={options.scale}
                onChange={e => handleChange({ scale: Number.parseFloat(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            </div>

            {/* Custom Dimensions */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Size</label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.maintainAspectRatio}
                    onChange={e => handleChange({ maintainAspectRatio: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-xs text-gray-500">Lock ratio</span>
                </label>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Width"
                    value={options.width || ''}
                    onChange={e => handleChange({ width: e.target.value ? Number.parseInt(e.target.value) : undefined })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <span className="flex items-center text-gray-400">×</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Height"
                    value={options.height || ''}
                    onChange={e => handleChange({ height: e.target.value ? Number.parseInt(e.target.value) : undefined })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">Include Device Frame</span>
                <input
                  type="checkbox"
                  checked={options.includeDeviceFrame}
                  onChange={e => handleChange({ includeDeviceFrame: e.target.checked })}
                  className="rounded"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">Include Background</span>
                <input
                  type="checkbox"
                  checked={options.includeBackground}
                  onChange={e => handleChange({ includeBackground: e.target.checked })}
                  className="rounded"
                />
              </label>
              {options.format === 'png' && (
                <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Transparent Background</span>
                  <input
                    type="checkbox"
                    checked={options.transparentBackground}
                    onChange={e => handleChange({ transparentBackground: e.target.checked })}
                    className="rounded"
                  />
                </label>
              )}
            </div>

            {/* File Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">File Name</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={options.fileName}
                  onChange={e => handleChange({ fileName: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <span className="text-sm text-gray-500">
                  .
                  {options.format}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isExporting
            ? (
                <>
                  <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              )
            : (
                <>
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                  {' '}
                  {formatInfo[options.format].label}
                </>
              )}
        </button>
      </div>
    </div>
  );
}

// Compact export button with dropdown
type QuickExportButtonProps = {
  onExport: (format: ExportFormat) => void;
  isExporting?: boolean;
  className?: string;
};

export function QuickExportButton({ onExport, isExporting = false, className = '' }: QuickExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formats: { format: ExportFormat; label: string }[] = [
    { format: 'png', label: 'PNG' },
    { format: 'jpeg', label: 'JPEG' },
    { format: 'svg', label: 'SVG' },
    { format: 'pdf', label: 'PDF' },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isExporting
          ? (
              <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )
          : (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
        Export
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {formats.map(({ format, label }) => (
            <button
              key={format}
              onClick={() => {
                onExport(format);
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type { ExportFormat, ExportOptions, ExportPreset };
