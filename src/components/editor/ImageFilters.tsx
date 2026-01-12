'use client';

import { Check, Contrast, Droplets, Image, RotateCcw, Sliders, Sparkles, Sun } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type FilterSettings = {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  opacity: number;
};

export type ImageFilterPreset = {
  id: string;
  name: string;
  filters: Partial<FilterSettings>;
  thumbnail?: string;
};

export type ImageFiltersProps = {
  variant?: 'full' | 'compact' | 'presets-only' | 'sliders-only';
  filters?: FilterSettings;
  onChange?: (filters: FilterSettings) => void;
  presets?: ImageFilterPreset[];
  showPreview?: boolean;
  previewImage?: string;
  className?: string;
};

const defaultFilters: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  opacity: 100,
};

const defaultPresets: ImageFilterPreset[] = [
  { id: 'none', name: 'Original', filters: {} },
  { id: 'vivid', name: 'Vivid', filters: { brightness: 105, contrast: 110, saturation: 130 } },
  { id: 'dramatic', name: 'Dramatic', filters: { contrast: 125, saturation: 90, brightness: 95 } },
  { id: 'vintage', name: 'Vintage', filters: { sepia: 30, contrast: 90, saturation: 80 } },
  { id: 'noir', name: 'Noir', filters: { grayscale: 100, contrast: 120 } },
  { id: 'warm', name: 'Warm', filters: { sepia: 20, saturation: 110, brightness: 102 } },
  { id: 'cool', name: 'Cool', filters: { hueRotate: 15, saturation: 90, brightness: 98 } },
  { id: 'fade', name: 'Fade', filters: { contrast: 85, saturation: 80, brightness: 105 } },
  { id: 'pop', name: 'Pop', filters: { saturation: 150, contrast: 105 } },
  { id: 'muted', name: 'Muted', filters: { saturation: 60, contrast: 95 } },
  { id: 'dream', name: 'Dream', filters: { blur: 1, brightness: 108, saturation: 90 } },
  { id: 'sharp', name: 'Sharp', filters: { contrast: 115, brightness: 102, saturation: 105 } },
];

const ImageFilters: React.FC<ImageFiltersProps> = ({
  variant = 'full',
  filters = defaultFilters,
  onChange,
  presets = defaultPresets,
  showPreview = true,
  previewImage,
  className = '',
}) => {
  const [filterSettings, setFilterSettings] = useState<FilterSettings>(filters);
  const [selectedPreset, setSelectedPreset] = useState<string>('none');

  useEffect(() => {
    setFilterSettings(filters);
  }, [filters]);

  const handleFilterChange = useCallback((key: keyof FilterSettings, value: number) => {
    const newFilters = { ...filterSettings, [key]: value };
    setFilterSettings(newFilters);
    onChange?.(newFilters);
    setSelectedPreset('custom');
  }, [filterSettings, onChange]);

  const applyPreset = useCallback((preset: ImageFilterPreset) => {
    const newFilters = { ...defaultFilters, ...preset.filters };
    setFilterSettings(newFilters);
    onChange?.(newFilters);
    setSelectedPreset(preset.id);
  }, [onChange]);

  const resetFilters = useCallback(() => {
    setFilterSettings(defaultFilters);
    onChange?.(defaultFilters);
    setSelectedPreset('none');
  }, [onChange]);

  const getFilterStyle = (): React.CSSProperties => {
    return {
      filter: `
        brightness(${filterSettings.brightness}%)
        contrast(${filterSettings.contrast}%)
        saturate(${filterSettings.saturation}%)
        blur(${filterSettings.blur}px)
        grayscale(${filterSettings.grayscale}%)
        sepia(${filterSettings.sepia}%)
        hue-rotate(${filterSettings.hueRotate}deg)
      `,
      opacity: filterSettings.opacity / 100,
    };
  };

  const FilterSlider: React.FC<{
    label: string;
    icon: React.ReactNode;
    value: number;
    min: number;
    max: number;
    defaultVal: number;
    unit?: string;
    onChange: (value: number) => void;
  }> = ({ label, icon, value, min, max, defaultVal, unit = '%', onChange }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {value}
          {unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
        />
        {value !== defaultVal && (
          <button
            onClick={() => onChange(defaultVal)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Reset"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
    </div>
  );

  // Presets-only variant
  if (variant === 'presets-only') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</div>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-all ${
                selectedPreset === preset.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Sliders-only variant
  if (variant === 'sliders-only') {
    return (
      <div className={`space-y-4 ${className}`}>
        <FilterSlider
          label="Brightness"
          icon={<Sun size={14} />}
          value={filterSettings.brightness}
          min={0}
          max={200}
          defaultVal={100}
          onChange={v => handleFilterChange('brightness', v)}
        />
        <FilterSlider
          label="Contrast"
          icon={<Contrast size={14} />}
          value={filterSettings.contrast}
          min={0}
          max={200}
          defaultVal={100}
          onChange={v => handleFilterChange('contrast', v)}
        />
        <FilterSlider
          label="Saturation"
          icon={<Droplets size={14} />}
          value={filterSettings.saturation}
          min={0}
          max={200}
          defaultVal={100}
          onChange={v => handleFilterChange('saturation', v)}
        />
        <FilterSlider
          label="Blur"
          icon={<Sparkles size={14} />}
          value={filterSettings.blur}
          min={0}
          max={20}
          defaultVal={0}
          unit="px"
          onChange={v => handleFilterChange('blur', v)}
        />
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Quick presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {presets.slice(0, 6).map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs transition-all ${
                selectedPreset === preset.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Basic sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Brightness</span>
              <span className="text-xs text-gray-400">
                {filterSettings.brightness}
                %
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              value={filterSettings.brightness}
              onChange={e => handleFilterChange('brightness', Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Contrast</span>
              <span className="text-xs text-gray-400">
                {filterSettings.contrast}
                %
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              value={filterSettings.contrast}
              onChange={e => handleFilterChange('contrast', Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Sliders size={18} />
            Image Filters
          </h4>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Preview</div>
          <div className="h-32 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
            {previewImage
              ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    style={getFilterStyle()}
                  />
                )
              : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
                    style={getFilterStyle()}
                  >
                    <Image size={32} className="text-white/50" />
                  </div>
                )}
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Presets</div>
        <div className="grid grid-cols-4 gap-2">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`relative rounded-lg border p-2 transition-all ${
                selectedPreset === preset.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <div
                className="mb-1 h-12 w-full rounded bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
                style={{
                  filter: `
                    brightness(${(preset.filters.brightness || 100)}%)
                    contrast(${(preset.filters.contrast || 100)}%)
                    saturate(${(preset.filters.saturation || 100)}%)
                    grayscale(${(preset.filters.grayscale || 0)}%)
                    sepia(${(preset.filters.sepia || 0)}%)
                  `,
                }}
              />
              <div className="truncate text-center text-xs text-gray-700 dark:text-gray-300">
                {preset.name}
              </div>
              {selectedPreset === preset.id && (
                <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4 p-4">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Adjustments</div>

        <FilterSlider
          label="Brightness"
          icon={<Sun size={14} />}
          value={filterSettings.brightness}
          min={0}
          max={200}
          defaultVal={100}
          onChange={v => handleFilterChange('brightness', v)}
        />

        <FilterSlider
          label="Contrast"
          icon={<Contrast size={14} />}
          value={filterSettings.contrast}
          min={0}
          max={200}
          defaultVal={100}
          onChange={v => handleFilterChange('contrast', v)}
        />

        <FilterSlider
          label="Saturation"
          icon={<Droplets size={14} />}
          value={filterSettings.saturation}
          min={0}
          max={200}
          defaultVal={100}
          onChange={v => handleFilterChange('saturation', v)}
        />

        <FilterSlider
          label="Blur"
          icon={<Sparkles size={14} />}
          value={filterSettings.blur}
          min={0}
          max={20}
          defaultVal={0}
          unit="px"
          onChange={v => handleFilterChange('blur', v)}
        />

        <FilterSlider
          label="Grayscale"
          icon={<Image size={14} />}
          value={filterSettings.grayscale}
          min={0}
          max={100}
          defaultVal={0}
          onChange={v => handleFilterChange('grayscale', v)}
        />

        <FilterSlider
          label="Sepia"
          icon={<Image size={14} />}
          value={filterSettings.sepia}
          min={0}
          max={100}
          defaultVal={0}
          onChange={v => handleFilterChange('sepia', v)}
        />

        <FilterSlider
          label="Hue Rotate"
          icon={<RotateCcw size={14} />}
          value={filterSettings.hueRotate}
          min={0}
          max={360}
          defaultVal={0}
          unit="°"
          onChange={v => handleFilterChange('hueRotate', v)}
        />

        <FilterSlider
          label="Opacity"
          icon={<Image size={14} />}
          value={filterSettings.opacity}
          min={0}
          max={100}
          defaultVal={100}
          onChange={v => handleFilterChange('opacity', v)}
        />
      </div>
    </div>
  );
};

export default ImageFilters;
