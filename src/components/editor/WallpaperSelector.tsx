'use client';

import { useState } from 'react';

type Wallpaper = {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'pattern' | 'image';
  value: string;
  thumbnail?: string;
  category: 'solid' | 'gradient' | 'pattern' | 'nature' | 'abstract' | 'custom';
};

const defaultWallpapers: Wallpaper[] = [
  // Solid Colors
  { id: 'solid_white', name: 'White', type: 'color', value: '#ffffff', category: 'solid' },
  { id: 'solid_light_gray', name: 'Light Gray', type: 'color', value: '#f3f4f6', category: 'solid' },
  { id: 'solid_gray', name: 'Gray', type: 'color', value: '#9ca3af', category: 'solid' },
  { id: 'solid_dark', name: 'Dark', type: 'color', value: '#1f2937', category: 'solid' },
  { id: 'solid_black', name: 'Black', type: 'color', value: '#000000', category: 'solid' },
  { id: 'solid_blue', name: 'Blue', type: 'color', value: '#3b82f6', category: 'solid' },
  { id: 'solid_green', name: 'Green', type: 'color', value: '#22c55e', category: 'solid' },
  { id: 'solid_purple', name: 'Purple', type: 'color', value: '#a855f7', category: 'solid' },

  // Gradients
  { id: 'gradient_blue', name: 'Ocean Blue', type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'gradient' },
  { id: 'gradient_sunset', name: 'Sunset', type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'gradient' },
  { id: 'gradient_forest', name: 'Forest', type: 'gradient', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', category: 'gradient' },
  { id: 'gradient_midnight', name: 'Midnight', type: 'gradient', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)', category: 'gradient' },
  { id: 'gradient_peach', name: 'Peach', type: 'gradient', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', category: 'gradient' },
  { id: 'gradient_aurora', name: 'Aurora', type: 'gradient', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', category: 'gradient' },

  // Patterns
  { id: 'pattern_dots', name: 'Dots', type: 'pattern', value: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', category: 'pattern' },
  { id: 'pattern_grid', name: 'Grid', type: 'pattern', value: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)', category: 'pattern' },
  { id: 'pattern_diagonal', name: 'Diagonal Lines', type: 'pattern', value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 11px)', category: 'pattern' },

  // WhatsApp-style backgrounds
  { id: 'wa_light', name: 'WhatsApp Light', type: 'color', value: '#efeae2', category: 'pattern' },
  { id: 'wa_dark', name: 'WhatsApp Dark', type: 'color', value: '#0b141a', category: 'pattern' },

  // iMessage backgrounds
  { id: 'imessage_light', name: 'iMessage Light', type: 'color', value: '#ffffff', category: 'pattern' },
  { id: 'imessage_dark', name: 'iMessage Dark', type: 'color', value: '#000000', category: 'pattern' },
];

const categories = [
  { id: 'all', label: 'All' },
  { id: 'solid', label: 'Solid Colors' },
  { id: 'gradient', label: 'Gradients' },
  { id: 'pattern', label: 'Patterns' },
  { id: 'custom', label: 'Custom' },
];

type WallpaperSelectorProps = {
  selectedWallpaper?: Wallpaper;
  onSelect: (wallpaper: Wallpaper) => void;
  platform?: 'whatsapp' | 'imessage' | 'discord' | 'slack' | 'telegram' | 'messenger';
};

export function WallpaperSelector({ selectedWallpaper, onSelect, platform }: WallpaperSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customColor, setCustomColor] = useState('#ffffff');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const filteredWallpapers = activeCategory === 'all'
    ? defaultWallpapers
    : defaultWallpapers.filter(w => w.category === activeCategory);

  const handleCustomColorSelect = () => {
    const customWallpaper: Wallpaper = {
      id: `custom_${customColor}`,
      name: 'Custom Color',
      type: 'color',
      value: customColor,
      category: 'custom',
    };
    onSelect(customWallpaper);
    setShowCustomPicker(false);
  };

  const getWallpaperStyle = (wallpaper: Wallpaper): React.CSSProperties => {
    if (wallpaper.type === 'color') {
      return { backgroundColor: wallpaper.value };
    }
    if (wallpaper.type === 'gradient' || wallpaper.type === 'pattern') {
      return { background: wallpaper.value };
    }
    if (wallpaper.type === 'image') {
      return { backgroundImage: `url(${wallpaper.value})`, backgroundSize: 'cover' };
    }
    return {};
  };

  // Platform-specific recommendations
  const platformRecommendations: Record<string, string[]> = {
    whatsapp: ['wa_light', 'wa_dark', 'solid_light_gray'],
    imessage: ['imessage_light', 'imessage_dark', 'gradient_blue'],
    discord: ['solid_dark', 'gradient_midnight', 'solid_gray'],
    slack: ['solid_white', 'solid_light_gray', 'gradient_aurora'],
    telegram: ['solid_blue', 'gradient_blue', 'solid_light_gray'],
    messenger: ['solid_white', 'gradient_blue', 'gradient_peach'],
  };

  const recommendedIds = platform ? platformRecommendations[platform] || [] : [];
  const recommendedWallpapers = defaultWallpapers.filter(w => recommendedIds.includes(w.id));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Background</h3>
        <button
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Custom Color
        </button>
      </div>

      {/* Custom Color Picker */}
      {showCustomPicker && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={e => setCustomColor(e.target.value)}
              className="size-10 cursor-pointer rounded border-0"
            />
            <input
              type="text"
              value={customColor}
              onChange={e => setCustomColor(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm uppercase dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={handleCustomColorSelect}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Platform Recommendations */}
      {platform && recommendedWallpapers.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Recommended for
            {platform}
          </p>
          <div className="flex gap-2">
            {recommendedWallpapers.map(wallpaper => (
              <button
                key={wallpaper.id}
                onClick={() => onSelect(wallpaper)}
                className={`size-10 rounded-lg border-2 transition-all ${
                  selectedWallpaper?.id === wallpaper.id
                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
                }`}
                style={getWallpaperStyle(wallpaper)}
                title={wallpaper.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Wallpaper Grid */}
      <div className="grid grid-cols-6 gap-2">
        {filteredWallpapers.map(wallpaper => (
          <button
            key={wallpaper.id}
            onClick={() => onSelect(wallpaper)}
            className={`aspect-square rounded-lg border-2 transition-all ${
              selectedWallpaper?.id === wallpaper.id
                ? 'border-blue-500 ring-2 ring-blue-500/30'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
            }`}
            style={getWallpaperStyle(wallpaper)}
            title={wallpaper.name}
          />
        ))}
      </div>

      {/* Selected Info */}
      {selectedWallpaper && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
          <div className="flex items-center gap-2">
            <div
              className="size-6 rounded border border-gray-200 dark:border-gray-600"
              style={getWallpaperStyle(selectedWallpaper)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{selectedWallpaper.name}</span>
          </div>
          <button
            onClick={() => onSelect(defaultWallpapers[0]!)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
