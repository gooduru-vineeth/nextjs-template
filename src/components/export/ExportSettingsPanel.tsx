'use client';

import {
  Archive,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Download,
  FileText,
  Folder,
  Globe,
  Image,
  Layers,
  Monitor,
  Palette,
  Settings,
  Smartphone,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf' | 'webp' | 'html' | 'css' | 'json' | 'figma';
export type ExportQuality = 'low' | 'medium' | 'high' | 'max';
export type ExportScale = '0.5x' | '1x' | '2x' | '3x' | '4x';

export type ExportPreset = {
  id: string;
  name: string;
  format: ExportFormat;
  scale: ExportScale;
  quality: ExportQuality;
  suffix?: string;
  platform?: 'ios' | 'android' | 'web' | 'all';
};

export type ExportOptions = {
  format: ExportFormat;
  quality: ExportQuality;
  scale: ExportScale;
  includeBackground: boolean;
  flattenLayers: boolean;
  optimizeForWeb: boolean;
  preserveTransparency: boolean;
  embedFonts: boolean;
  includeMetadata: boolean;
  outputPath?: string;
};

export type ExportSettingsPanelProps = {
  options: ExportOptions;
  presets?: ExportPreset[];
  onOptionsChange?: (options: ExportOptions) => void;
  onExport?: (options: ExportOptions) => void;
  onSavePreset?: (preset: ExportPreset) => void;
  onSelectPreset?: (preset: ExportPreset) => void;
  variant?: 'full' | 'compact' | 'dialog' | 'inline' | 'minimal';
  showPresets?: boolean;
  showAdvanced?: boolean;
  selectedItems?: number;
  darkMode?: boolean;
  className?: string;
};

export default function ExportSettingsPanel({
  options,
  presets = [],
  onOptionsChange,
  onExport,
  onSavePreset,
  onSelectPreset,
  variant = 'full',
  showPresets = true,
  showAdvanced = true,
  selectedItems = 1,
  darkMode = false,
  className = '',
}: ExportSettingsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['format', 'quality']));
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const formatOptions: { value: ExportFormat; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'png', label: 'PNG', icon: <Image size={16} />, description: 'Lossless with transparency' },
    { value: 'jpg', label: 'JPG', icon: <Image size={16} />, description: 'Compressed, no transparency' },
    { value: 'svg', label: 'SVG', icon: <Code size={16} />, description: 'Scalable vector graphics' },
    { value: 'webp', label: 'WebP', icon: <Globe size={16} />, description: 'Modern web format' },
    { value: 'pdf', label: 'PDF', icon: <FileText size={16} />, description: 'Document format' },
    { value: 'html', label: 'HTML', icon: <Code size={16} />, description: 'Web code export' },
    { value: 'css', label: 'CSS', icon: <Palette size={16} />, description: 'Styles only' },
    { value: 'json', label: 'JSON', icon: <Code size={16} />, description: 'Data export' },
  ];

  const scaleOptions: ExportScale[] = ['0.5x', '1x', '2x', '3x', '4x'];
  const qualityOptions: { value: ExportQuality; label: string; description: string }[] = [
    { value: 'low', label: 'Low', description: 'Smallest file size' },
    { value: 'medium', label: 'Medium', description: 'Balanced quality' },
    { value: 'high', label: 'High', description: 'Better quality' },
    { value: 'max', label: 'Maximum', description: 'Best quality' },
  ];

  const defaultPresets: ExportPreset[] = [
    { id: 'web-1x', name: 'Web 1x', format: 'png', scale: '1x', quality: 'high', platform: 'web' },
    { id: 'web-2x', name: 'Web 2x', format: 'png', scale: '2x', quality: 'high', suffix: '@2x', platform: 'web' },
    { id: 'ios', name: 'iOS Assets', format: 'png', scale: '3x', quality: 'max', platform: 'ios' },
    { id: 'android', name: 'Android Assets', format: 'webp', scale: '2x', quality: 'high', platform: 'android' },
    { id: 'social', name: 'Social Media', format: 'jpg', scale: '1x', quality: 'high', platform: 'web' },
    { id: 'print', name: 'Print Ready', format: 'pdf', scale: '4x', quality: 'max', platform: 'all' },
  ];

  const allPresets = [...defaultPresets, ...presets];

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  const handleOptionChange = useCallback(<K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    onOptionsChange?.({ ...options, [key]: value });
  }, [options, onOptionsChange]);

  const handleSavePreset = useCallback(() => {
    if (presetName.trim()) {
      const newPreset: ExportPreset = {
        id: `preset-${Date.now()}`,
        name: presetName.trim(),
        format: options.format,
        scale: options.scale,
        quality: options.quality,
      };
      onSavePreset?.(newPreset);
      setPresetName('');
      setShowPresetModal(false);
    }
  }, [presetName, options, onSavePreset]);

  const handleApplyPreset = useCallback((preset: ExportPreset) => {
    onOptionsChange?.({
      ...options,
      format: preset.format,
      scale: preset.scale,
      quality: preset.quality,
    });
    onSelectPreset?.(preset);
  }, [options, onOptionsChange, onSelectPreset]);

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'ios':
        return <Smartphone size={14} />;
      case 'android':
        return <Smartphone size={14} />;
      case 'web':
        return <Globe size={14} />;
      default:
        return <Monitor size={14} />;
    }
  };

  const renderFormatSelector = (compact = false) => (
    <div className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-4 gap-2'}>
      {formatOptions.slice(0, compact ? 4 : 8).map(format => (
        <button
          key={format.value}
          onClick={() => handleOptionChange('format', format.value)}
          className={`flex items-center gap-2 rounded-lg border p-3 transition-colors ${
            options.format === format.value
              ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              : `${borderColor} ${hoverBg}`
          }`}
        >
          {format.icon}
          <div className="text-left">
            <span className={`text-sm font-medium ${options.format === format.value ? '' : textColor}`}>
              {format.label}
            </span>
            {!compact && (
              <p className={`text-xs ${mutedColor} mt-0.5`}>{format.description}</p>
            )}
          </div>
        </button>
      ))}
    </div>
  );

  const renderScaleSelector = () => (
    <div className="flex gap-2">
      {scaleOptions.map(scale => (
        <button
          key={scale}
          onClick={() => handleOptionChange('scale', scale)}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            options.scale === scale
              ? 'bg-blue-500 text-white'
              : `${inputBg} ${textColor} ${hoverBg}`
          }`}
        >
          {scale}
        </button>
      ))}
    </div>
  );

  const renderQualitySelector = () => (
    <div className="space-y-2">
      {qualityOptions.map(quality => (
        <button
          key={quality.value}
          onClick={() => handleOptionChange('quality', quality.value)}
          className={`flex w-full items-center justify-between rounded-lg border p-3 transition-colors ${
            options.quality === quality.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : `${borderColor} ${hoverBg}`
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              options.quality === quality.value
                ? 'border-blue-500 bg-blue-500'
                : `${borderColor}`
            }`}
            >
              {options.quality === quality.value && <Check size={12} className="text-white" />}
            </div>
            <div className="text-left">
              <span className={`font-medium ${textColor}`}>{quality.label}</span>
              <p className={`text-xs ${mutedColor}`}>{quality.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderToggleOption = (key: keyof ExportOptions, label: string, description?: string) => (
    <div className={`flex items-center justify-between py-2 ${borderColor} border-b last:border-0`}>
      <div>
        <span className={`text-sm ${textColor}`}>{label}</span>
        {description && <p className={`text-xs ${mutedColor}`}>{description}</p>}
      </div>
      <button
        onClick={() => handleOptionChange(key, !options[key] as boolean)}
        className={`h-6 w-10 rounded-full transition-colors ${
          options[key] ? 'bg-blue-500' : inputBg
        }`}
      >
        <div className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          options[key] ? 'translate-x-5' : 'translate-x-1'
        }`}
        />
      </button>
    </div>
  );

  const renderPresetList = (compact = false) => (
    <div className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-3 gap-3'}>
      {allPresets.slice(0, compact ? 4 : 6).map(preset => (
        <button
          key={preset.id}
          onClick={() => handleApplyPreset(preset)}
          className={`flex items-center gap-2 rounded-lg border p-3 ${borderColor} ${hoverBg} text-left transition-colors`}
        >
          {getPlatformIcon(preset.platform)}
          <div>
            <span className={`text-sm font-medium ${textColor}`}>{preset.name}</span>
            <p className={`text-xs ${mutedColor}`}>
              {preset.format.toUpperCase()}
              {' '}
              •
              {preset.scale}
            </p>
          </div>
        </button>
      ))}
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-3">
          <select
            value={options.format}
            onChange={e => handleOptionChange('format', e.target.value as ExportFormat)}
            className={`px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}
          >
            {formatOptions.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={options.scale}
            onChange={e => handleOptionChange('scale', e.target.value as ExportScale)}
            className={`px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}
          >
            {scaleOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => onExport?.(options)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${mutedColor}`}>Format:</span>
          <div className="flex gap-1">
            {formatOptions.slice(0, 4).map(f => (
              <button
                key={f.value}
                onClick={() => handleOptionChange('format', f.value)}
                className={`rounded-lg px-3 py-1 text-sm ${
                  options.format === f.value
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${textColor}`
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${mutedColor}`}>Scale:</span>
          <div className="flex gap-1">
            {scaleOptions.slice(0, 3).map(s => (
              <button
                key={s}
                onClick={() => handleOptionChange('scale', s)}
                className={`rounded-lg px-3 py-1 text-sm ${
                  options.scale === s
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${textColor}`
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => onExport?.(options)}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Export Settings</h3>
          <span className={`text-sm ${mutedColor}`}>
            {selectedItems}
            {' '}
            item(s)
          </span>
        </div>

        <div className="space-y-4">
          {/* Format */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Format</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {formatOptions.slice(0, 4).map(f => (
                <button
                  key={f.value}
                  onClick={() => handleOptionChange('format', f.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    options.format === f.value
                      ? 'bg-blue-500 text-white'
                      : `${inputBg} ${textColor}`
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Scale</span>
            <div className="mt-2 flex gap-2">
              {scaleOptions.map(s => (
                <button
                  key={s}
                  onClick={() => handleOptionChange('scale', s)}
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    options.scale === s
                      ? 'bg-blue-500 text-white'
                      : `${inputBg} ${textColor}`
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onExport?.(options)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    );
  }

  // Dialog variant
  if (variant === 'dialog') {
    return (
      <div className={`${bgColor} w-full max-w-xl rounded-xl shadow-2xl ${className}`}>
        {/* Header */}
        <div className={`border-b p-6 ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor}`}>Export</h2>
          <p className={`${mutedColor} mt-1`}>
            Exporting
            {' '}
            {selectedItems}
            {' '}
            item
            {selectedItems !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Quick presets */}
          {showPresets && (
            <div>
              <h3 className={`text-sm font-medium ${textColor} mb-3`}>Quick Presets</h3>
              {renderPresetList(true)}
            </div>
          )}

          {/* Format */}
          <div>
            <h3 className={`text-sm font-medium ${textColor} mb-3`}>Format</h3>
            {renderFormatSelector(true)}
          </div>

          {/* Scale & Quality */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className={`text-sm font-medium ${textColor} mb-3`}>Scale</h3>
              {renderScaleSelector()}
            </div>
            <div>
              <h3 className={`text-sm font-medium ${textColor} mb-3`}>Quality</h3>
              <select
                value={options.quality}
                onChange={e => handleOptionChange('quality', e.target.value as ExportQuality)}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              >
                {qualityOptions.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Options */}
          {showAdvanced && (
            <div className={`p-4 ${inputBg} rounded-lg`}>
              {renderToggleOption('includeBackground', 'Include background')}
              {renderToggleOption('preserveTransparency', 'Preserve transparency')}
              {renderToggleOption('optimizeForWeb', 'Optimize for web')}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t p-6 ${borderColor} flex justify-end gap-3`}>
          <button className={`px-4 py-2 ${inputBg} ${textColor} rounded-lg ${hoverBg}`}>
            Cancel
          </button>
          <button
            onClick={() => onExport?.(options)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            <Download size={16} />
            Export
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>Export Settings</h2>
            <p className={`${mutedColor} mt-1`}>
              Configure export options for
              {' '}
              {selectedItems}
              {' '}
              item
              {selectedItems !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPresetModal(true)}
              className={`flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
            >
              <Copy size={16} />
              Save Preset
            </button>
            <button
              onClick={() => onExport?.(options)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
        {/* Presets */}
        {showPresets && (
          <section>
            <button
              onClick={() => toggleSection('presets')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
            >
              {expandedSections.has('presets') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Archive size={16} />
              <span className="font-medium">Export Presets</span>
            </button>
            {expandedSections.has('presets') && renderPresetList()}
          </section>
        )}

        {/* Format */}
        <section>
          <button
            onClick={() => toggleSection('format')}
            className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
          >
            {expandedSections.has('format') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Image size={16} />
            <span className="font-medium">File Format</span>
          </button>
          {expandedSections.has('format') && renderFormatSelector()}
        </section>

        {/* Scale */}
        <section>
          <button
            onClick={() => toggleSection('scale')}
            className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
          >
            {expandedSections.has('scale') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Layers size={16} />
            <span className="font-medium">Scale</span>
          </button>
          {expandedSections.has('scale') && renderScaleSelector()}
        </section>

        {/* Quality */}
        <section>
          <button
            onClick={() => toggleSection('quality')}
            className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
          >
            {expandedSections.has('quality') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Settings size={16} />
            <span className="font-medium">Quality</span>
          </button>
          {expandedSections.has('quality') && renderQualitySelector()}
        </section>

        {/* Advanced Options */}
        {showAdvanced && (
          <section>
            <button
              onClick={() => toggleSection('advanced')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
            >
              {expandedSections.has('advanced') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Settings size={16} />
              <span className="font-medium">Advanced Options</span>
            </button>
            {expandedSections.has('advanced') && (
              <div className={`p-4 ${inputBg} rounded-lg`}>
                {renderToggleOption('includeBackground', 'Include background', 'Export with background color')}
                {renderToggleOption('flattenLayers', 'Flatten layers', 'Merge all layers into one')}
                {renderToggleOption('preserveTransparency', 'Preserve transparency', 'Keep transparent areas')}
                {renderToggleOption('optimizeForWeb', 'Optimize for web', 'Reduce file size for web')}
                {renderToggleOption('embedFonts', 'Embed fonts', 'Include fonts in export')}
                {renderToggleOption('includeMetadata', 'Include metadata', 'Add file information')}
              </div>
            )}
          </section>
        )}

        {/* Output path */}
        <section>
          <h3 className={`text-sm font-medium ${textColor} mb-3 flex items-center gap-2`}>
            <Folder size={16} className={mutedColor} />
            Output Location
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={options.outputPath || ''}
              onChange={e => handleOptionChange('outputPath', e.target.value)}
              placeholder="Choose folder..."
              className={`flex-1 px-4 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
            />
            <button className={`px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}>
              Browse
            </button>
          </div>
        </section>
      </div>

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${bgColor} w-96 rounded-xl p-6 shadow-2xl`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Save Export Preset</h3>
            <input
              type="text"
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              placeholder="Preset name"
              className={`w-full px-4 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} mb-4`}
              autoFocus
            />
            <div className={`p-3 ${inputBg} mb-4 rounded-lg`}>
              <p className={`text-sm ${mutedColor}`}>
                Format:
                {' '}
                {options.format.toUpperCase()}
                {' '}
                • Scale:
                {' '}
                {options.scale}
                {' '}
                • Quality:
                {' '}
                {options.quality}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPresetModal(false)}
                className={`px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
