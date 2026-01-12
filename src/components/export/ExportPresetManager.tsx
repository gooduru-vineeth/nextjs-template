'use client';

import { Check, ChevronDown, Copy, Download, Edit2, FileImage, Image, Plus, Settings, Star, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ExportPreset = {
  id: string;
  name: string;
  format: 'png' | 'jpg' | 'svg' | 'pdf' | 'webp';
  quality: number;
  scale: number;
  width?: number;
  height?: number;
  transparent?: boolean;
  includeDeviceFrame?: boolean;
  includeWatermark?: boolean;
  isDefault?: boolean;
  isFavorite?: boolean;
  category?: 'social' | 'print' | 'web' | 'custom';
};

export type ExportPresetManagerProps = {
  variant?: 'full' | 'compact' | 'dropdown' | 'grid';
  presets?: ExportPreset[];
  selectedPreset?: string;
  onChange?: (presets: ExportPreset[]) => void;
  onSelect?: (preset: ExportPreset) => void;
  onExport?: (preset: ExportPreset) => void;
  editable?: boolean;
  className?: string;
};

const defaultPresets: ExportPreset[] = [
  { id: '1', name: 'Instagram Post', format: 'png', quality: 95, scale: 2, width: 1080, height: 1080, category: 'social', isFavorite: true },
  { id: '2', name: 'Instagram Story', format: 'png', quality: 95, scale: 2, width: 1080, height: 1920, category: 'social' },
  { id: '3', name: 'Twitter Post', format: 'png', quality: 90, scale: 2, width: 1200, height: 675, category: 'social' },
  { id: '4', name: 'LinkedIn Post', format: 'png', quality: 90, scale: 2, width: 1200, height: 627, category: 'social' },
  { id: '5', name: 'Facebook Cover', format: 'png', quality: 90, scale: 2, width: 820, height: 312, category: 'social' },
  { id: '6', name: 'Web 2x', format: 'png', quality: 90, scale: 2, transparent: true, category: 'web', isDefault: true },
  { id: '7', name: 'Print High Quality', format: 'png', quality: 100, scale: 3, category: 'print' },
  { id: '8', name: 'PDF Document', format: 'pdf', quality: 100, scale: 1, category: 'print' },
];

const formatIcons: Record<string, React.ReactNode> = {
  png: <FileImage size={16} />,
  jpg: <Image size={16} />,
  svg: <FileImage size={16} />,
  pdf: <FileImage size={16} />,
  webp: <Image size={16} />,
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  social: { label: 'Social', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  print: { label: 'Print', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  web: { label: 'Web', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  custom: { label: 'Custom', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
};

const ExportPresetManager: React.FC<ExportPresetManagerProps> = ({
  variant = 'full',
  presets = defaultPresets,
  selectedPreset,
  onChange,
  onSelect,
  onExport,
  editable = true,
  className = '',
}) => {
  const [presetList, setPresetList] = useState<ExportPreset[]>(presets);
  const [selected, setSelected] = useState<string>(selectedPreset || presets.find(p => p.isDefault)?.id || '');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setPresetList(presets);
  }, [presets]);

  useEffect(() => {
    if (selectedPreset) {
      setSelected(selectedPreset);
    }
  }, [selectedPreset]);

  const selectPreset = useCallback((preset: ExportPreset) => {
    setSelected(preset.id);
    onSelect?.(preset);
    setIsOpen(false);
  }, [onSelect]);

  const toggleFavorite = useCallback((id: string) => {
    const newPresets = presetList.map(p =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p,
    );
    setPresetList(newPresets);
    onChange?.(newPresets);
  }, [presetList, onChange]);

  const deletePreset = useCallback((id: string) => {
    const newPresets = presetList.filter(p => p.id !== id);
    setPresetList(newPresets);
    onChange?.(newPresets);
    if (selected === id && newPresets.length > 0) {
      setSelected(newPresets[0]!.id);
    }
  }, [presetList, onChange, selected]);

  const duplicatePreset = useCallback((preset: ExportPreset) => {
    const newPreset: ExportPreset = {
      ...preset,
      id: `preset-${Date.now()}`,
      name: `${preset.name} (Copy)`,
      isDefault: false,
      isFavorite: false,
    };
    const newPresets = [...presetList, newPreset];
    setPresetList(newPresets);
    onChange?.(newPresets);
  }, [presetList, onChange]);

  const addPreset = useCallback(() => {
    const newPreset: ExportPreset = {
      id: `preset-${Date.now()}`,
      name: 'New Preset',
      format: 'png',
      quality: 90,
      scale: 2,
      category: 'custom',
    };
    const newPresets = [...presetList, newPreset];
    setPresetList(newPresets);
    onChange?.(newPresets);
    setEditingId(newPreset.id);
  }, [presetList, onChange]);

  const updatePresetName = useCallback((id: string, name: string) => {
    const newPresets = presetList.map(p =>
      p.id === id ? { ...p, name } : p,
    );
    setPresetList(newPresets);
    onChange?.(newPresets);
    setEditingId(null);
  }, [presetList, onChange]);

  const selectedPresetData = presetList.find(p => p.id === selected);
  const favoritePresets = presetList.filter(p => p.isFavorite);

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
        >
          <div className="flex items-center gap-3">
            {selectedPresetData && formatIcons[selectedPresetData.format]}
            <div className="text-left">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {selectedPresetData?.name || 'Select preset'}
              </div>
              {selectedPresetData && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPresetData.width}
                  ×
                  {selectedPresetData.height || 'auto'}
                  {' '}
                  •
                  {selectedPresetData.format.toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {Object.keys(categoryLabels).map((category) => {
              const categoryPresets = presetList.filter(p => p.category === category);
              if (categoryPresets.length === 0) {
                return null;
              }
              return (
                <div key={category}>
                  <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    {categoryLabels[category]?.label}
                  </div>
                  {categoryPresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selected === preset.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {formatIcons[preset.format]}
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{preset.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {preset.width && preset.height ? `${preset.width}×${preset.height}` : `${preset.scale}x`}
                          {' '}
                          •
                          {preset.format.toUpperCase()}
                        </div>
                      </div>
                      {preset.isFavorite && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
                      {selected === preset.id && <Check size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Grid variant - cards layout
  if (variant === 'grid') {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-2 gap-3">
          {presetList.map(preset => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                selected === preset.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              {preset.isFavorite && (
                <Star size={12} className="absolute top-2 right-2 fill-yellow-400 text-yellow-400" />
              )}
              <div className="mb-2 flex items-center gap-2">
                {formatIcons[preset.format]}
                <span className={`rounded px-1.5 py-0.5 text-xs ${categoryLabels[preset.category || 'custom']?.color}`}>
                  {categoryLabels[preset.category || 'custom']?.label}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{preset.name}</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {preset.width && preset.height ? `${preset.width}×${preset.height}` : `${preset.scale}x scale`}
              </div>
            </button>
          ))}
          {editable && (
            <button
              onClick={addPreset}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500 dark:border-gray-600"
            >
              <Plus size={20} />
              <span className="text-sm">Add Preset</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Preset</span>
          {selectedPresetData && (
            <button
              onClick={() => onExport?.(selectedPresetData)}
              className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
            >
              <Download size={14} />
              Export
            </button>
          )}
        </div>

        {/* Favorites */}
        {favoritePresets.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
            {favoritePresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`flex-shrink-0 rounded-lg px-3 py-2 text-sm transition-all ${
                  selected === preset.id
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected preset details */}
        {selectedPresetData && (
          <div className="rounded-lg bg-white p-3 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{selectedPresetData.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPresetData.format.toUpperCase()}
                  {' '}
                  •
                  {selectedPresetData.width}
                  ×
                  {selectedPresetData.height || 'auto'}
                  {' '}
                  •
                  {selectedPresetData.quality}
                  % quality
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(selectedPresetData.id)}
                className={`rounded p-1.5 ${
                  selectedPresetData.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                <Star size={16} fill={selectedPresetData.isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        )}
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
            <Settings size={18} />
            Export Presets
          </h4>
          {editable && (
            <button
              onClick={addPreset}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Plus size={16} />
              New Preset
            </button>
          )}
        </div>
      </div>

      {/* Preset list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {Object.keys(categoryLabels).map((category) => {
          const categoryPresets = presetList.filter(p => p.category === category);
          if (categoryPresets.length === 0) {
            return null;
          }
          return (
            <div key={category}>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <span className={`rounded px-1.5 py-0.5 ${categoryLabels[category]?.color}`}>
                  {categoryLabels[category]?.label}
                </span>
                <span>
                  (
                  {categoryPresets.length}
                  )
                </span>
              </div>
              {categoryPresets.map(preset => (
                <div
                  key={preset.id}
                  className={`group p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    selected === preset.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Format icon */}
                    <div className={`rounded-lg p-2 ${selected === preset.id ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                      {formatIcons[preset.format]}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {editingId === preset.id
                          ? (
                              <input
                                type="text"
                                defaultValue={preset.name}
                                autoFocus
                                onBlur={e => updatePresetName(preset.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updatePresetName(preset.id, e.currentTarget.value);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingId(null);
                                  }
                                }}
                                className="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                              />
                            )
                          : (
                              <span className="font-medium text-gray-800 dark:text-gray-200">{preset.name}</span>
                            )}
                        {preset.isDefault && (
                          <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {preset.format.toUpperCase()}
                        {' '}
                        •
                        {preset.width && preset.height ? `${preset.width}×${preset.height}` : `${preset.scale}x`}
                        {' '}
                        •
                        {preset.quality}
                        % quality
                        {preset.transparent && ' • Transparent'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleFavorite(preset.id)}
                        className={`rounded-lg p-2 ${
                          preset.isFavorite
                            ? 'text-yellow-400'
                            : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-yellow-400'
                        }`}
                      >
                        <Star size={16} fill={preset.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                      {editable && (
                        <>
                          <button
                            onClick={() => setEditingId(preset.id)}
                            className="rounded-lg p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => duplicatePreset(preset)}
                            className="rounded-lg p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          >
                            <Copy size={16} />
                          </button>
                          {!preset.isDefault && (
                            <button
                              onClick={() => deletePreset(preset.id)}
                              className="rounded-lg p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => selectPreset(preset)}
                        className={`ml-2 rounded-lg px-3 py-1.5 text-sm ${
                          selected === preset.id
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {selected === preset.id ? 'Selected' : 'Use'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Export button */}
      {selectedPresetData && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <button
            onClick={() => onExport?.(selectedPresetData)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-medium text-white hover:bg-blue-600"
          >
            <Download size={18} />
            Export with "
            {selectedPresetData.name}
            "
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportPresetManager;
