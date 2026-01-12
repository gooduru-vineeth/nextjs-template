'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  Check,
  ChevronDown,
  ChevronRight,
  Columns,
  Grid,
  Layout,
  LayoutGrid,
  LayoutList,
  Maximize2,
  Move,
  Rows,
  Settings,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type LayoutType = 'grid' | 'flex' | 'stack' | 'masonry' | 'auto';
export type Alignment = 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around';
export type Direction = 'horizontal' | 'vertical';

export type LayoutSuggestion = {
  id: string;
  name: string;
  description: string;
  type: LayoutType;
  preview?: string;
  confidence: number;
  settings: LayoutSettings;
};

export type LayoutSettings = {
  type: LayoutType;
  direction: Direction;
  gap: number;
  padding: number;
  columns?: number;
  rows?: number;
  alignItems: Alignment;
  justifyContent: Alignment;
  wrap?: boolean;
  autoFit?: boolean;
  minItemWidth?: number;
};

export type LayoutElement = {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type SmartLayoutEngineProps = {
  elements: LayoutElement[];
  currentSettings?: LayoutSettings;
  suggestions?: LayoutSuggestion[];
  onApplyLayout?: (settings: LayoutSettings) => void;
  onApplySuggestion?: (suggestion: LayoutSuggestion) => void;
  onSettingsChange?: (settings: LayoutSettings) => void;
  onAutoArrange?: () => void;
  variant?: 'full' | 'compact' | 'toolbar' | 'sidebar' | 'minimal';
  showSuggestions?: boolean;
  showAdvanced?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function SmartLayoutEngine({
  elements,
  currentSettings,
  suggestions = [],
  onApplyLayout,
  onApplySuggestion,
  onSettingsChange,
  onAutoArrange,
  variant = 'full',
  showSuggestions = true,
  showAdvanced = true,
  darkMode = false,
  className = '',
}: SmartLayoutEngineProps) {
  const defaultSettings: LayoutSettings = {
    type: 'flex',
    direction: 'horizontal',
    gap: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'start',
    wrap: true,
    autoFit: false,
    columns: 3,
    minItemWidth: 200,
  };

  const [settings, setSettings] = useState<LayoutSettings>(currentSettings || defaultSettings);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['layout', 'alignment']));

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const layoutTypes: { type: LayoutType; label: string; icon: React.ReactNode }[] = [
    { type: 'flex', label: 'Flex', icon: <Rows size={16} /> },
    { type: 'grid', label: 'Grid', icon: <Grid size={16} /> },
    { type: 'stack', label: 'Stack', icon: <LayoutList size={16} /> },
    { type: 'masonry', label: 'Masonry', icon: <LayoutGrid size={16} /> },
    { type: 'auto', label: 'Auto', icon: <Sparkles size={16} /> },
  ];

  const alignmentOptions: { value: Alignment; label: string }[] = [
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'end', label: 'End' },
    { value: 'stretch', label: 'Stretch' },
    { value: 'space-between', label: 'Space Between' },
    { value: 'space-around', label: 'Space Around' },
  ];

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

  const handleSettingChange = useCallback(<K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  }, [settings, onSettingsChange]);

  const handleApply = useCallback(() => {
    onApplyLayout?.(settings);
  }, [settings, onApplyLayout]);

  const renderLayoutTypeSelector = (compact = false) => (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
      {layoutTypes.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => handleSettingChange('type', type)}
          className={`flex items-center gap-2 ${compact ? 'p-2' : 'px-3 py-2'} rounded-lg transition-colors ${
            settings.type === type
              ? 'bg-blue-500 text-white'
              : `${inputBg} ${textColor} ${hoverBg}`
          }`}
          title={label}
        >
          {icon}
          {!compact && <span className="text-sm">{label}</span>}
        </button>
      ))}
    </div>
  );

  const renderDirectionSelector = () => (
    <div className="flex gap-2">
      <button
        onClick={() => handleSettingChange('direction', 'horizontal')}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
          settings.direction === 'horizontal'
            ? 'bg-blue-500 text-white'
            : `${inputBg} ${textColor} ${hoverBg}`
        }`}
      >
        <Columns size={16} />
        <span className="text-sm">Horizontal</span>
      </button>
      <button
        onClick={() => handleSettingChange('direction', 'vertical')}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
          settings.direction === 'vertical'
            ? 'bg-blue-500 text-white'
            : `${inputBg} ${textColor} ${hoverBg}`
        }`}
      >
        <Rows size={16} />
        <span className="text-sm">Vertical</span>
      </button>
    </div>
  );

  const renderAlignmentGrid = () => (
    <div className="grid grid-cols-3 gap-2">
      {/* Horizontal alignment */}
      <button
        onClick={() => handleSettingChange('justifyContent', 'start')}
        className={`rounded-lg p-2 ${settings.justifyContent === 'start' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => handleSettingChange('justifyContent', 'center')}
        className={`rounded-lg p-2 ${settings.justifyContent === 'center' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => handleSettingChange('justifyContent', 'end')}
        className={`rounded-lg p-2 ${settings.justifyContent === 'end' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>

      {/* Vertical alignment */}
      <button
        onClick={() => handleSettingChange('alignItems', 'start')}
        className={`rounded-lg p-2 ${settings.alignItems === 'start' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        title="Align Top"
      >
        <AlignVerticalJustifyStart size={16} />
      </button>
      <button
        onClick={() => handleSettingChange('alignItems', 'center')}
        className={`rounded-lg p-2 ${settings.alignItems === 'center' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        title="Align Middle"
      >
        <AlignVerticalJustifyCenter size={16} />
      </button>
      <button
        onClick={() => handleSettingChange('alignItems', 'end')}
        className={`rounded-lg p-2 ${settings.alignItems === 'end' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
        title="Align Bottom"
      >
        <AlignVerticalJustifyEnd size={16} />
      </button>
    </div>
  );

  const renderSpacingInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={`text-xs ${mutedColor} mb-1 block`}>Gap</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="64"
            step="4"
            value={settings.gap}
            onChange={e => handleSettingChange('gap', Number.parseInt(e.target.value))}
            className="flex-1"
          />
          <span className={`text-sm ${textColor} w-8 text-right`}>{settings.gap}</span>
        </div>
      </div>
      <div>
        <label className={`text-xs ${mutedColor} mb-1 block`}>Padding</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="64"
            step="4"
            value={settings.padding}
            onChange={e => handleSettingChange('padding', Number.parseInt(e.target.value))}
            className="flex-1"
          />
          <span className={`text-sm ${textColor} w-8 text-right`}>{settings.padding}</span>
        </div>
      </div>
    </div>
  );

  const renderGridSettings = () => {
    if (settings.type !== 'grid') {
      return null;
    }

    return (
      <div className="space-y-4">
        <div>
          <label className={`text-xs ${mutedColor} mb-1 block`}>Columns</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="12"
              value={settings.columns || 3}
              onChange={e => handleSettingChange('columns', Number.parseInt(e.target.value))}
              className="flex-1"
            />
            <span className={`text-sm ${textColor} w-8 text-right`}>{settings.columns || 3}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-sm ${textColor}`}>Auto-fit</span>
          <button
            onClick={() => handleSettingChange('autoFit', !settings.autoFit)}
            className={`h-6 w-10 rounded-full transition-colors ${
              settings.autoFit ? 'bg-blue-500' : inputBg
            }`}
          >
            <div className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              settings.autoFit ? 'translate-x-5' : 'translate-x-1'
            }`}
            />
          </button>
        </div>

        {settings.autoFit && (
          <div>
            <label className={`text-xs ${mutedColor} mb-1 block`}>Min Item Width</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="100"
                max="400"
                step="20"
                value={settings.minItemWidth || 200}
                onChange={e => handleSettingChange('minItemWidth', Number.parseInt(e.target.value))}
                className="flex-1"
              />
              <span className={`text-sm ${textColor} w-12 text-right`}>
                {settings.minItemWidth || 200}
                px
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSuggestionCard = (suggestion: LayoutSuggestion) => (
    <button
      key={suggestion.id}
      onClick={() => onApplySuggestion?.(suggestion)}
      className={`w-full rounded-lg border p-3 ${borderColor} ${hoverBg} text-left transition-colors`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className={`font-medium ${textColor}`}>{suggestion.name}</h4>
          <p className={`text-xs ${mutedColor} mt-0.5`}>{suggestion.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <Sparkles size={12} className="text-amber-500" />
          <span className="text-xs text-amber-500">
            {Math.round(suggestion.confidence * 100)}
            %
          </span>
        </div>
      </div>
      {suggestion.preview && (
        <div className={`mt-2 p-2 ${inputBg} rounded`}>
          <div className="flex gap-1">
            {Array.from({ length: 4 }).fill(0).map((_, i) => (
              <div key={i} className={`h-8 flex-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded`} />
            ))}
          </div>
        </div>
      )}
    </button>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-2 rounded-lg p-3 ${className}`}>
        {renderLayoutTypeSelector(true)}
        <button
          onClick={onAutoArrange}
          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          title="Auto-arrange"
        >
          <Wand2 size={16} />
        </button>
      </div>
    );
  }

  // Toolbar variant
  if (variant === 'toolbar') {
    return (
      <div className={`${bgColor} border ${borderColor} flex items-center gap-4 rounded-lg p-2 ${className}`}>
        {renderLayoutTypeSelector(true)}
        <div className={`h-6 w-px ${borderColor}`} />
        {renderAlignmentGrid()}
        <div className={`h-6 w-px ${borderColor}`} />
        <div className="flex items-center gap-2">
          <span className={`text-xs ${mutedColor}`}>Gap:</span>
          <input
            type="number"
            value={settings.gap}
            onChange={e => handleSettingChange('gap', Number.parseInt(e.target.value) || 0)}
            className={`w-12 px-2 py-1 text-sm ${inputBg} ${textColor} rounded border ${borderColor}`}
          />
        </div>
        <button
          onClick={handleApply}
          className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Layout</h3>
          <span className={`text-xs ${mutedColor}`}>
            {elements.length}
            {' '}
            elements
          </span>
        </div>

        <div className="space-y-4">
          {renderLayoutTypeSelector()}
          {renderAlignmentGrid()}

          <button
            onClick={handleApply}
            className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
          >
            Apply Layout
          </button>
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-72 flex-col border-l ${borderColor} ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${textColor}`}>Smart Layout</h3>
            <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}>
              <Settings size={16} />
            </button>
          </div>
          <p className={`text-xs ${mutedColor} mt-1`}>
            {elements.length}
            {' '}
            elements selected
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Layout type */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Type</span>
            <div className="mt-2">{renderLayoutTypeSelector()}</div>
          </div>

          {/* Direction */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Direction</span>
            <div className="mt-2">{renderDirectionSelector()}</div>
          </div>

          {/* Alignment */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Alignment</span>
            <div className="mt-2">{renderAlignmentGrid()}</div>
          </div>

          {/* Spacing */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Spacing</span>
            <div className="mt-2">{renderSpacingInputs()}</div>
          </div>

          {/* Grid settings */}
          {settings.type === 'grid' && (
            <div>
              <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Grid</span>
              <div className="mt-2">{renderGridSettings()}</div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div>
              <span className={`text-xs font-medium ${mutedColor} flex items-center gap-1 tracking-wider uppercase`}>
                <Sparkles size={12} />
                Suggestions
              </span>
              <div className="mt-2 space-y-2">
                {suggestions.slice(0, 3).map(renderSuggestionCard)}
              </div>
            </div>
          )}
        </div>

        <div className={`border-t p-4 ${borderColor} space-y-2`}>
          <button
            onClick={onAutoArrange}
            className={`flex w-full items-center justify-center gap-2 py-2 ${inputBg} ${textColor} rounded-lg ${hoverBg}`}
          >
            <Wand2 size={16} />
            Auto-arrange
          </button>
          <button
            onClick={handleApply}
            className="w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
          >
            Apply Layout
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
            <h2 className={`text-xl font-semibold ${textColor}`}>Smart Layout Engine</h2>
            <p className={`${mutedColor} mt-1`}>
              Arrange
              {' '}
              {elements.length}
              {' '}
              elements automatically
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAutoArrange}
              className={`flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
            >
              <Wand2 size={16} />
              Auto-arrange
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <Check size={16} />
              Apply Layout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main settings */}
        <div className="flex-1 space-y-6 p-6">
          {/* Layout Type */}
          <section>
            <button
              onClick={() => toggleSection('layout')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
            >
              {expandedSections.has('layout') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Layout size={16} />
              <span className="font-medium">Layout Type</span>
            </button>
            {expandedSections.has('layout') && (
              <div className="space-y-4">
                {renderLayoutTypeSelector()}
                {renderDirectionSelector()}
              </div>
            )}
          </section>

          {/* Alignment */}
          <section>
            <button
              onClick={() => toggleSection('alignment')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
            >
              {expandedSections.has('alignment') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <AlignCenter size={16} />
              <span className="font-medium">Alignment</span>
            </button>
            {expandedSections.has('alignment') && renderAlignmentGrid()}
          </section>

          {/* Spacing */}
          <section>
            <button
              onClick={() => toggleSection('spacing')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
            >
              {expandedSections.has('spacing') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Maximize2 size={16} />
              <span className="font-medium">Spacing</span>
            </button>
            {expandedSections.has('spacing') && renderSpacingInputs()}
          </section>

          {/* Grid Settings */}
          {settings.type === 'grid' && showAdvanced && (
            <section>
              <button
                onClick={() => toggleSection('grid')}
                className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
              >
                {expandedSections.has('grid') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Grid size={16} />
                <span className="font-medium">Grid Settings</span>
              </button>
              {expandedSections.has('grid') && renderGridSettings()}
            </section>
          )}

          {/* Advanced */}
          {showAdvanced && (
            <section>
              <button
                onClick={() => toggleSection('advanced')}
                className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} mb-3 rounded-lg px-2 py-1`}
              >
                {expandedSections.has('advanced') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Settings size={16} />
                <span className="font-medium">Advanced</span>
              </button>
              {expandedSections.has('advanced') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${textColor}`}>Wrap elements</span>
                    <button
                      onClick={() => handleSettingChange('wrap', !settings.wrap)}
                      className={`h-6 w-10 rounded-full transition-colors ${
                        settings.wrap ? 'bg-blue-500' : inputBg
                      }`}
                    >
                      <div className={`h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        settings.wrap ? 'translate-x-5' : 'translate-x-1'
                      }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className={`text-sm ${textColor} mb-2 block`}>Justify Content</label>
                    <select
                      value={settings.justifyContent}
                      onChange={e => handleSettingChange('justifyContent', e.target.value as Alignment)}
                      className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                    >
                      {alignmentOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`text-sm ${textColor} mb-2 block`}>Align Items</label>
                    <select
                      value={settings.alignItems}
                      onChange={e => handleSettingChange('alignItems', e.target.value as Alignment)}
                      className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                    >
                      {alignmentOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Suggestions sidebar */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={`w-72 border-l p-6 ${borderColor}`}>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <h3 className={`font-semibold ${textColor}`}>AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {suggestions.map(renderSuggestionCard)}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className={`border-t p-6 ${borderColor}`}>
        <h3 className={`text-sm font-medium ${textColor} mb-3 flex items-center gap-2`}>
          <Move size={14} className={mutedColor} />
          Preview
        </h3>
        <div className={`p-4 ${inputBg} min-h-[120px] rounded-lg`}>
          <div
            className="flex flex-wrap gap-2"
            style={{
              gap: settings.gap,
              padding: settings.padding,
              flexDirection: settings.direction === 'vertical' ? 'column' : 'row',
              justifyContent: settings.justifyContent === 'start'
                ? 'flex-start'
                : settings.justifyContent === 'end' ? 'flex-end' : settings.justifyContent,
              alignItems: settings.alignItems === 'start'
                ? 'flex-start'
                : settings.alignItems === 'end' ? 'flex-end' : settings.alignItems,
            }}
          >
            {elements.slice(0, 6).map((el, i) => (
              <div
                key={el.id}
                className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} flex items-center justify-center rounded text-xs ${mutedColor}`}
                style={{
                  width: settings.type === 'grid' ? 'auto' : el.width / 4,
                  height: el.height / 4,
                  minWidth: 40,
                  minHeight: 40,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
