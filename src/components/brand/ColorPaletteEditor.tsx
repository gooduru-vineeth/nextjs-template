'use client';

import { Check, Copy, Lock, Palette, Plus, RefreshCw, Trash2, Unlock } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ColorSwatch = {
  id: string;
  name: string;
  hex: string;
  locked?: boolean;
};

export type ColorPalette = {
  id: string;
  name: string;
  colors: ColorSwatch[];
  createdAt?: Date;
};

export type ColorPaletteEditorProps = {
  variant?: 'full' | 'compact' | 'inline' | 'picker';
  palette?: ColorPalette;
  onChange?: (palette: ColorPalette) => void;
  editable?: boolean;
  maxColors?: number;
  showPresets?: boolean;
  presets?: ColorPalette[];
  className?: string;
};

const defaultPalette: ColorPalette = {
  id: 'default',
  name: 'Brand Colors',
  colors: [
    { id: '1', name: 'Primary', hex: '#3B82F6' },
    { id: '2', name: 'Secondary', hex: '#10B981' },
    { id: '3', name: 'Accent', hex: '#8B5CF6' },
    { id: '4', name: 'Neutral', hex: '#6B7280' },
    { id: '5', name: 'Background', hex: '#F9FAFB' },
  ],
};

const presetPalettes: ColorPalette[] = [
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: [
      { id: '1', name: 'Deep Sea', hex: '#1E3A5F' },
      { id: '2', name: 'Wave', hex: '#3B82F6' },
      { id: '3', name: 'Sky', hex: '#7DD3FC' },
      { id: '4', name: 'Foam', hex: '#E0F2FE' },
      { id: '5', name: 'Sand', hex: '#FEF3C7' },
    ],
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: [
      { id: '1', name: 'Dusk', hex: '#7C3AED' },
      { id: '2', name: 'Coral', hex: '#F43F5E' },
      { id: '3', name: 'Orange', hex: '#F97316' },
      { id: '4', name: 'Gold', hex: '#FBBF24' },
      { id: '5', name: 'Peach', hex: '#FED7AA' },
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: [
      { id: '1', name: 'Pine', hex: '#14532D' },
      { id: '2', name: 'Leaf', hex: '#22C55E' },
      { id: '3', name: 'Moss', hex: '#84CC16' },
      { id: '4', name: 'Bark', hex: '#78716C' },
      { id: '5', name: 'Cream', hex: '#FEFCE8' },
    ],
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: [
      { id: '1', name: 'Black', hex: '#0F0F0F' },
      { id: '2', name: 'Dark Gray', hex: '#404040' },
      { id: '3', name: 'Gray', hex: '#737373' },
      { id: '4', name: 'Light Gray', hex: '#D4D4D4' },
      { id: '5', name: 'White', hex: '#FAFAFA' },
    ],
  },
];

const ColorPaletteEditor: React.FC<ColorPaletteEditorProps> = ({
  variant = 'full',
  palette = defaultPalette,
  onChange,
  editable = true,
  maxColors = 10,
  showPresets = true,
  presets = presetPalettes,
  className = '',
}) => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(palette);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPalette(palette);
  }, [palette]);

  const updatePalette = useCallback((updates: Partial<ColorPalette>) => {
    const newPalette = { ...currentPalette, ...updates };
    setCurrentPalette(newPalette);
    onChange?.(newPalette);
  }, [currentPalette, onChange]);

  const addColor = useCallback(() => {
    if (currentPalette.colors.length >= maxColors) {
      return;
    }

    const newColor: ColorSwatch = {
      id: `color-${Date.now()}`,
      name: `Color ${currentPalette.colors.length + 1}`,
      hex: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
    };

    updatePalette({ colors: [...currentPalette.colors, newColor] });
  }, [currentPalette, maxColors, updatePalette]);

  const removeColor = useCallback((id: string) => {
    updatePalette({ colors: currentPalette.colors.filter(c => c.id !== id) });
  }, [currentPalette, updatePalette]);

  const updateColor = useCallback((id: string, updates: Partial<ColorSwatch>) => {
    const newColors = currentPalette.colors.map(c =>
      c.id === id ? { ...c, ...updates } : c,
    );
    updatePalette({ colors: newColors });
  }, [currentPalette, updatePalette]);

  const copyColor = useCallback(async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  }, []);

  const applyPreset = useCallback((preset: ColorPalette) => {
    const newPalette = { ...preset, id: currentPalette.id };
    setCurrentPalette(newPalette);
    onChange?.(newPalette);
  }, [currentPalette.id, onChange]);

  const generateRandomPalette = useCallback(() => {
    const randomColors: ColorSwatch[] = [];
    for (let i = 0; i < 5; i++) {
      randomColors.push({
        id: `color-${i}`,
        name: ['Primary', 'Secondary', 'Accent', 'Neutral', 'Background'][i]!,
        hex: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
      });
    }
    updatePalette({ colors: randomColors });
  }, [updatePalette]);

  const toggleLock = useCallback((id: string) => {
    const color = currentPalette.colors.find(c => c.id === id);
    if (color) {
      updateColor(id, { locked: !color.locked });
    }
  }, [currentPalette, updateColor]);

  // Inline variant - just color swatches
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {currentPalette.colors.map(color => (
          <button
            key={color.id}
            onClick={() => copyColor(color.hex)}
            className="h-8 w-8 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 dark:border-gray-800"
            style={{ backgroundColor: color.hex }}
            title={`${color.name}: ${color.hex}`}
          />
        ))}
      </div>
    );
  }

  // Picker variant
  if (variant === 'picker') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex flex-wrap gap-2">
          {currentPalette.colors.map(color => (
            <div key={color.id} className="group relative">
              {editable
                ? (
                    <input
                      type="color"
                      value={color.hex}
                      onChange={e => updateColor(color.id, { hex: e.target.value })}
                      className="h-10 w-10 cursor-pointer rounded-lg border-2 border-white shadow dark:border-gray-800"
                    />
                  )
                : (
                    <div
                      className="h-10 w-10 cursor-pointer rounded-lg border-2 border-white shadow dark:border-gray-800"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColor(color.hex)}
                    />
                  )}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-gray-800 px-1 text-[8px] whitespace-nowrap text-white opacity-0 group-hover:opacity-100">
                {color.hex}
              </div>
            </div>
          ))}
          {editable && currentPalette.colors.length < maxColors && (
            <button
              onClick={addColor}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 dark:border-gray-600"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentPalette.name}
          </span>
          {editable && (
            <button
              onClick={generateRandomPalette}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Generate random palette"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>

        <div className="mb-3 flex gap-2">
          {currentPalette.colors.map(color => (
            <div key={color.id} className="group relative flex-1">
              <div
                className="h-12 cursor-pointer rounded-lg transition-transform hover:scale-105"
                style={{ backgroundColor: color.hex }}
                onClick={() => copyColor(color.hex)}
              />
              <span className="absolute inset-x-0 -bottom-5 text-center text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 dark:text-gray-400">
                {color.hex}
              </span>
            </div>
          ))}
        </div>

        {showPresets && (
          <div className="mt-4 flex gap-1 border-t border-gray-200 pt-3 dark:border-gray-700">
            {presets.slice(0, 4).map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="flex flex-1 gap-0.5 rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={preset.name}
              >
                {preset.colors.slice(0, 3).map(c => (
                  <div
                    key={c.id}
                    className="h-4 flex-1 first:rounded-l last:rounded-r"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </button>
            ))}
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
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-gray-500" />
            {editable
              ? (
                  <input
                    type="text"
                    value={currentPalette.name}
                    onChange={e => updatePalette({ name: e.target.value })}
                    className="border-b border-transparent bg-transparent font-semibold text-gray-800 outline-none hover:border-gray-300 focus:border-blue-500 dark:text-gray-200 dark:hover:border-gray-600"
                  />
                )
              : (
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {currentPalette.name}
                  </h4>
                )}
          </div>
          {editable && (
            <button
              onClick={generateRandomPalette}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <RefreshCw size={14} />
              Randomize
            </button>
          )}
        </div>
      </div>

      {/* Palette preview */}
      <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex h-16 overflow-hidden rounded-lg shadow-inner">
          {currentPalette.colors.map(color => (
            <div
              key={color.id}
              className="group relative flex-1 cursor-pointer transition-all hover:flex-[1.5]"
              style={{ backgroundColor: color.hex }}
              onClick={() => copyColor(color.hex)}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                {copiedColor === color.hex
                  ? (
                      <Check size={20} className="text-white" />
                    )
                  : (
                      <Copy size={16} className="text-white" />
                    )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color list */}
      <div className="space-y-3 p-4">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Colors</div>
        {currentPalette.colors.map(color => (
          <div
            key={color.id}
            className="flex items-center gap-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
          >
            {editable
              ? (
                  <input
                    type="color"
                    value={color.hex}
                    onChange={e => updateColor(color.id, { hex: e.target.value })}
                    disabled={color.locked}
                    className="h-10 w-10 cursor-pointer rounded-lg border-0"
                  />
                )
              : (
                  <div
                    className="h-10 w-10 rounded-lg"
                    style={{ backgroundColor: color.hex }}
                  />
                )}

            <div className="min-w-0 flex-1">
              {editable
                ? (
                    <input
                      type="text"
                      value={color.name}
                      onChange={e => updateColor(color.id, { name: e.target.value })}
                      className="w-full border-b border-transparent bg-transparent text-sm font-medium text-gray-800 hover:border-gray-300 dark:text-gray-200 dark:hover:border-gray-600"
                    />
                  )
                : (
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {color.name}
                    </div>
                  )}
              <div className="text-xs text-gray-500 uppercase dark:text-gray-400">
                {color.hex}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => copyColor(color.hex)}
                className="rounded p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Copy hex"
              >
                {copiedColor === color.hex ? <Check size={14} /> : <Copy size={14} />}
              </button>
              {editable && (
                <>
                  <button
                    onClick={() => toggleLock(color.id)}
                    className={`rounded p-1.5 ${
                      color.locked
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                    title={color.locked ? 'Unlock' : 'Lock'}
                  >
                    {color.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                  <button
                    onClick={() => removeColor(color.id)}
                    className="rounded p-1.5 text-gray-400 hover:text-red-500"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {editable && currentPalette.colors.length < maxColors && (
          <button
            onClick={addColor}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 p-3 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={16} />
            Add Color
          </button>
        )}
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Preset Palettes
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="rounded-lg border border-gray-200 p-2 text-left transition-colors hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600"
              >
                <div className="mb-2 flex h-6 overflow-hidden rounded">
                  {preset.colors.map(c => (
                    <div
                      key={c.id}
                      className="flex-1"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <div className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteEditor;
