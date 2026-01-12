'use client';

import {
  Check,
  Grid,
  Image,
  Layers,
  Palette,
  Upload,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// Types
type WallpaperType = 'solid' | 'gradient' | 'pattern' | 'image' | 'blur';
type PatternType = 'dots' | 'grid' | 'lines' | 'waves' | 'triangles' | 'circles';
type WallpaperVariant = 'full' | 'compact' | 'picker';

type WallpaperConfig = {
  type: WallpaperType;
  solidColor?: string;
  gradientColors?: [string, string];
  gradientAngle?: number;
  pattern?: PatternType;
  patternColor?: string;
  patternOpacity?: number;
  imageUrl?: string;
  imageBlur?: number;
  imageBrightness?: number;
  imageScale?: number;
};

type SavedWallpaper = {
  id: string;
  name: string;
  config: WallpaperConfig;
  thumbnail?: string;
};

export type CustomWallpaperProps = {
  variant?: WallpaperVariant;
  currentConfig?: WallpaperConfig;
  savedWallpapers?: SavedWallpaper[];
  onApply?: (config: WallpaperConfig) => void;
  onSave?: (config: WallpaperConfig, name: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
};

// Preset colors
const solidColors = [
  '#1a1a1a',
  '#2d2d2d',
  '#404040',
  '#525252',
  '#0f172a',
  '#1e293b',
  '#334155',
  '#475569',
  '#0c4a6e',
  '#075985',
  '#0369a1',
  '#0284c7',
  '#14532d',
  '#166534',
  '#15803d',
  '#16a34a',
  '#7c2d12',
  '#9a3412',
  '#c2410c',
  '#ea580c',
  '#713f12',
  '#92400e',
  '#b45309',
  '#d97706',
  '#581c87',
  '#6b21a8',
  '#7c3aed',
  '#8b5cf6',
  '#831843',
  '#9d174d',
  '#be185d',
  '#db2777',
];

// Preset gradients
const presetGradients: [string, string][] = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#ff9a9e', '#fecfef'],
  ['#ffecd2', '#fcb69f'],
  ['#11998e', '#38ef7d'],
  ['#fc5c7d', '#6a82fb'],
  ['#0f0c29', '#302b63'],
  ['#1a1a2e', '#16213e'],
];

// Pattern options
const patterns: { type: PatternType; label: string }[] = [
  { type: 'dots', label: 'Dots' },
  { type: 'grid', label: 'Grid' },
  { type: 'lines', label: 'Lines' },
  { type: 'waves', label: 'Waves' },
  { type: 'triangles', label: 'Triangles' },
  { type: 'circles', label: 'Circles' },
];

const defaultConfig: WallpaperConfig = {
  type: 'solid',
  solidColor: '#1a1a1a',
  gradientColors: ['#667eea', '#764ba2'],
  gradientAngle: 135,
  pattern: 'dots',
  patternColor: '#ffffff',
  patternOpacity: 0.1,
  imageBlur: 0,
  imageBrightness: 100,
  imageScale: 100,
};

export default function CustomWallpaper({
  variant = 'full',
  currentConfig = defaultConfig,
  savedWallpapers = [],
  onApply,
  onSave,
  onDelete: _onDelete,
  className = '',
}: CustomWallpaperProps) {
  const [config, setConfig] = useState<WallpaperConfig>(currentConfig);
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suppress unused variable warning - available for future use
  void _onDelete;

  const updateConfig = useCallback((updates: Partial<WallpaperConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateConfig({
          type: 'image',
          imageUrl: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [updateConfig]);

  const handleApply = useCallback(() => {
    onApply?.(config);
  }, [config, onApply]);

  const handleSave = useCallback(() => {
    if (saveName.trim()) {
      onSave?.(config, saveName.trim());
      setSaveName('');
      setShowSaveDialog(false);
    }
  }, [config, saveName, onSave]);

  const getWallpaperStyle = (wallpaperConfig: WallpaperConfig): React.CSSProperties => {
    switch (wallpaperConfig.type) {
      case 'solid':
        return { backgroundColor: wallpaperConfig.solidColor };
      case 'gradient':
        return {
          background: `linear-gradient(${wallpaperConfig.gradientAngle}deg, ${wallpaperConfig.gradientColors?.[0]} 0%, ${wallpaperConfig.gradientColors?.[1]} 100%)`,
        };
      case 'image':
        return {
          backgroundImage: wallpaperConfig.imageUrl ? `url(${wallpaperConfig.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `blur(${wallpaperConfig.imageBlur}px) brightness(${wallpaperConfig.imageBrightness}%)`,
        };
      case 'pattern':
        return {
          backgroundColor: wallpaperConfig.solidColor || '#1a1a1a',
        };
      default:
        return {};
    }
  };

  const renderPatternOverlay = () => {
    if (config.type !== 'pattern' || !config.pattern) {
      return null;
    }

    const patternStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      opacity: config.patternOpacity,
      pointerEvents: 'none',
    };

    switch (config.pattern) {
      case 'dots':
        return (
          <div style={{
            ...patternStyle,
            backgroundImage: `radial-gradient(${config.patternColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
          />
        );
      case 'grid':
        return (
          <div style={{
            ...patternStyle,
            backgroundImage: `linear-gradient(${config.patternColor} 1px, transparent 1px), linear-gradient(90deg, ${config.patternColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
          />
        );
      case 'lines':
        return (
          <div style={{
            ...patternStyle,
            backgroundImage: `repeating-linear-gradient(45deg, ${config.patternColor} 0, ${config.patternColor} 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px',
          }}
          />
        );
      default:
        return null;
    }
  };

  // Picker variant - simple color/gradient picker
  if (variant === 'picker') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="mb-3 flex gap-2">
          {(['solid', 'gradient'] as WallpaperType[]).map(type => (
            <button
              key={type}
              onClick={() => updateConfig({ type })}
              className={`rounded px-3 py-1 text-sm capitalize ${
                config.type === type
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {config.type === 'solid' && (
          <div className="grid grid-cols-8 gap-1">
            {solidColors.slice(0, 16).map(color => (
              <button
                key={color}
                onClick={() => updateConfig({ solidColor: color })}
                className={`h-6 w-6 rounded border ${
                  config.solidColor === color ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {config.type === 'gradient' && (
          <div className="grid grid-cols-4 gap-1">
            {presetGradients.slice(0, 8).map((grad, i) => (
              <button
                key={i}
                onClick={() => updateConfig({ gradientColors: grad })}
                className={`h-8 rounded border ${
                  config.gradientColors?.[0] === grad[0] ? 'border-blue-500 ring-1 ring-blue-300' : 'border-gray-200 dark:border-gray-700'
                }`}
                style={{ background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)` }}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleApply}
          className="mt-3 w-full rounded bg-blue-600 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
              style={getWallpaperStyle(config)}
            >
              {renderPatternOverlay()}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">Wallpaper</h4>
              <p className="text-sm text-gray-500 capitalize">{config.type}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {(['solid', 'gradient', 'pattern', 'image'] as WallpaperType[]).map(type => (
              <button
                key={type}
                onClick={() => updateConfig({ type })}
                className={`rounded px-2 py-1 text-xs capitalize ${
                  config.type === type
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {config.type === 'image' && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 w-full rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-blue-400 dark:border-gray-700"
              >
                <Upload className="mx-auto mb-1 h-4 w-4" />
                Upload Image
              </button>
            </>
          )}

          <button
            onClick={handleApply}
            className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm text-white hover:bg-blue-700"
          >
            Apply Wallpaper
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Image className="h-5 w-5" />
          Custom Wallpaper
        </h2>
        <p className="mt-1 text-sm text-gray-500">Customize the background for your mockups</p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
        {/* Preview */}
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</p>
          <div
            className="relative mx-auto aspect-[9/16] max-w-[200px] overflow-hidden rounded-2xl border border-gray-200 shadow-lg dark:border-gray-700"
            style={getWallpaperStyle(config)}
          >
            {renderPatternOverlay()}
            {/* Mock phone UI overlay */}
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-center justify-between p-3">
                <span className="text-xs text-white/70">9:41</span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-white/70" />
                </div>
              </div>
              <div className="flex flex-1 items-end p-3">
                <div className="w-full space-y-2">
                  <div className="rounded-lg bg-white/20 p-2 backdrop-blur">
                    <div className="h-2 w-3/4 rounded bg-white/40" />
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-lg bg-blue-500/80 p-2 backdrop-blur">
                    <div className="h-2 w-full rounded bg-white/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-6">
          {/* Type selector */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Type</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { type: 'solid', icon: Palette, label: 'Solid Color' },
                { type: 'gradient', icon: Layers, label: 'Gradient' },
                { type: 'pattern', icon: Grid, label: 'Pattern' },
                { type: 'image', icon: Image, label: 'Image' },
              ] as const).map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => updateConfig({ type })}
                  className={`flex items-center gap-2 rounded-lg border-2 p-3 ${
                    config.type === type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${config.type === type ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Solid color options */}
          {config.type === 'solid' && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Color</p>
              <div className="grid grid-cols-8 gap-2">
                {solidColors.map(color => (
                  <button
                    key={color}
                    onClick={() => updateConfig({ solidColor: color })}
                    className={`h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                      config.solidColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-3">
                <label className="text-xs text-gray-500">Custom Color</label>
                <input
                  type="color"
                  value={config.solidColor || '#1a1a1a'}
                  onChange={e => updateConfig({ solidColor: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Gradient options */}
          {config.type === 'gradient' && (
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Preset Gradients</p>
                <div className="grid grid-cols-4 gap-2">
                  {presetGradients.map((grad, i) => (
                    <button
                      key={i}
                      onClick={() => updateConfig({ gradientColors: grad })}
                      className={`h-12 rounded-lg border-2 transition-transform hover:scale-105 ${
                        config.gradientColors?.[0] === grad[0] && config.gradientColors?.[1] === grad[1]
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-transparent'
                      }`}
                      style={{ background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)` }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  Angle:
                  {config.gradientAngle}
                  °
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={config.gradientAngle || 135}
                  onChange={e => updateConfig({ gradientAngle: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Pattern options */}
          {config.type === 'pattern' && (
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Pattern</p>
                <div className="grid grid-cols-3 gap-2">
                  {patterns.map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={() => updateConfig({ pattern: type })}
                      className={`rounded-lg border-2 p-3 text-sm ${
                        config.pattern === type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  Pattern Opacity:
                  {Math.round((config.patternOpacity || 0.1) * 100)}
                  %
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(config.patternOpacity || 0.1) * 100}
                  onChange={e => updateConfig({ patternOpacity: Number(e.target.value) / 100 })}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Image options */}
          {config.type === 'image' && (
            <div className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-500 hover:border-blue-400 hover:text-blue-500 dark:border-gray-700"
                >
                  <Upload className="mx-auto mb-2 h-8 w-8" />
                  <span>Click to upload image</span>
                </button>
              </div>
              {config.imageUrl && (
                <>
                  <div>
                    <label className="text-sm text-gray-500">
                      Blur:
                      {config.imageBlur}
                      px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={config.imageBlur || 0}
                      onChange={e => updateConfig({ imageBlur: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Brightness:
                      {config.imageBrightness}
                      %
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={config.imageBrightness || 100}
                      onChange={e => updateConfig({ imageBrightness: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Saved wallpapers */}
      {savedWallpapers.length > 0 && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Saved Wallpapers</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {savedWallpapers.map(wallpaper => (
              <div key={wallpaper.id} className="flex-shrink-0">
                <button
                  onClick={() => setConfig(wallpaper.config)}
                  className="relative h-20 w-16 overflow-hidden rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700"
                  style={getWallpaperStyle(wallpaper.config)}
                />
                <p className="mt-1 w-16 truncate text-center text-xs text-gray-500">{wallpaper.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between border-t border-gray-200 p-4 dark:border-gray-800">
        <button
          onClick={() => setShowSaveDialog(true)}
          className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Save Preset
        </button>
        <button
          onClick={handleApply}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Check className="h-4 w-4" />
          Apply Wallpaper
        </button>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Save Wallpaper</h3>
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Enter a name"
              className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
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

export type { PatternType, SavedWallpaper, WallpaperConfig, WallpaperType, WallpaperVariant };
