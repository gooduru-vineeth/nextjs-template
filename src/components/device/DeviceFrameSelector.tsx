'use client';

import {
  Check,
  ChevronDown,
  Laptop,
  Monitor,
  Plus,
  Search,
  Smartphone,
  Star,
  Tablet,
  Watch,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type DeviceCategory = 'iphone' | 'android' | 'ipad' | 'tablet' | 'desktop' | 'laptop' | 'watch';
type Orientation = 'portrait' | 'landscape';

type DeviceFrame = {
  id: string;
  name: string;
  category: DeviceCategory;
  width: number;
  height: number;
  bezels: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  notch?: boolean;
  dynamicIsland?: boolean;
  homeIndicator?: boolean;
  year?: number;
  color?: string;
  popular?: boolean;
};

type DeviceFrameSelectorProps = {
  variant?: 'full' | 'compact' | 'dropdown';
  selectedDevice?: DeviceFrame;
  onSelect?: (device: DeviceFrame) => void;
  orientation?: Orientation;
  onOrientationChange?: (orientation: Orientation) => void;
  showColors?: boolean;
  className?: string;
};

// Device frames database
const deviceFrames: DeviceFrame[] = [
  // iPhones
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', category: 'iphone', width: 430, height: 932, bezels: { top: 59, bottom: 21, left: 0, right: 0 }, dynamicIsland: true, homeIndicator: true, year: 2023, popular: true },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', category: 'iphone', width: 393, height: 852, bezels: { top: 59, bottom: 21, left: 0, right: 0 }, dynamicIsland: true, homeIndicator: true, year: 2023, popular: true },
  { id: 'iphone-15', name: 'iPhone 15', category: 'iphone', width: 393, height: 852, bezels: { top: 54, bottom: 21, left: 0, right: 0 }, dynamicIsland: true, homeIndicator: true, year: 2023 },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', category: 'iphone', width: 393, height: 852, bezels: { top: 59, bottom: 21, left: 0, right: 0 }, dynamicIsland: true, homeIndicator: true, year: 2022, popular: true },
  { id: 'iphone-14', name: 'iPhone 14', category: 'iphone', width: 390, height: 844, bezels: { top: 47, bottom: 21, left: 0, right: 0 }, notch: true, homeIndicator: true, year: 2022 },
  { id: 'iphone-se', name: 'iPhone SE (3rd gen)', category: 'iphone', width: 375, height: 667, bezels: { top: 20, bottom: 44, left: 0, right: 0 }, year: 2022 },
  { id: 'iphone-13', name: 'iPhone 13', category: 'iphone', width: 390, height: 844, bezels: { top: 47, bottom: 21, left: 0, right: 0 }, notch: true, homeIndicator: true, year: 2021 },
  { id: 'iphone-12', name: 'iPhone 12', category: 'iphone', width: 390, height: 844, bezels: { top: 47, bottom: 21, left: 0, right: 0 }, notch: true, homeIndicator: true, year: 2020 },

  // Android
  { id: 'pixel-8-pro', name: 'Google Pixel 8 Pro', category: 'android', width: 448, height: 998, bezels: { top: 32, bottom: 16, left: 0, right: 0 }, homeIndicator: true, year: 2023, popular: true },
  { id: 'pixel-8', name: 'Google Pixel 8', category: 'android', width: 412, height: 915, bezels: { top: 32, bottom: 16, left: 0, right: 0 }, homeIndicator: true, year: 2023 },
  { id: 'galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra', category: 'android', width: 440, height: 984, bezels: { top: 28, bottom: 16, left: 0, right: 0 }, homeIndicator: true, year: 2024, popular: true },
  { id: 'galaxy-s24', name: 'Samsung Galaxy S24', category: 'android', width: 412, height: 920, bezels: { top: 28, bottom: 16, left: 0, right: 0 }, homeIndicator: true, year: 2024 },
  { id: 'galaxy-fold-5', name: 'Samsung Galaxy Fold 5', category: 'android', width: 904, height: 1024, bezels: { top: 24, bottom: 24, left: 0, right: 0 }, year: 2023 },

  // iPads
  { id: 'ipad-pro-12.9', name: 'iPad Pro 12.9"', category: 'ipad', width: 1024, height: 1366, bezels: { top: 24, bottom: 24, left: 24, right: 24 }, homeIndicator: true, year: 2022, popular: true },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', category: 'ipad', width: 834, height: 1194, bezels: { top: 24, bottom: 24, left: 24, right: 24 }, homeIndicator: true, year: 2022 },
  { id: 'ipad-air', name: 'iPad Air', category: 'ipad', width: 820, height: 1180, bezels: { top: 24, bottom: 24, left: 24, right: 24 }, homeIndicator: true, year: 2022 },
  { id: 'ipad-mini', name: 'iPad mini', category: 'ipad', width: 744, height: 1133, bezels: { top: 20, bottom: 20, left: 20, right: 20 }, homeIndicator: true, year: 2021 },
  { id: 'ipad-10th', name: 'iPad (10th gen)', category: 'ipad', width: 820, height: 1180, bezels: { top: 28, bottom: 28, left: 28, right: 28 }, homeIndicator: true, year: 2022 },

  // Desktop
  { id: 'imac-24', name: 'iMac 24"', category: 'desktop', width: 2560, height: 1440, bezels: { top: 64, bottom: 80, left: 64, right: 64 }, year: 2021, popular: true },
  { id: 'studio-display', name: 'Apple Studio Display', category: 'desktop', width: 2560, height: 1440, bezels: { top: 52, bottom: 52, left: 52, right: 52 }, year: 2022 },
  { id: 'dell-ultrasharp', name: 'Dell UltraSharp 27"', category: 'desktop', width: 2560, height: 1440, bezels: { top: 16, bottom: 40, left: 16, right: 16 }, year: 2023 },
  { id: 'lg-ultrafine', name: 'LG UltraFine 27"', category: 'desktop', width: 2560, height: 1440, bezels: { top: 16, bottom: 48, left: 16, right: 16 }, year: 2022 },

  // Laptops
  { id: 'macbook-pro-16', name: 'MacBook Pro 16"', category: 'laptop', width: 3456, height: 2234, bezels: { top: 32, bottom: 0, left: 0, right: 0 }, notch: true, year: 2023, popular: true },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14"', category: 'laptop', width: 3024, height: 1964, bezels: { top: 32, bottom: 0, left: 0, right: 0 }, notch: true, year: 2023 },
  { id: 'macbook-air-15', name: 'MacBook Air 15"', category: 'laptop', width: 2880, height: 1864, bezels: { top: 32, bottom: 0, left: 0, right: 0 }, notch: true, year: 2023 },
  { id: 'macbook-air-13', name: 'MacBook Air 13"', category: 'laptop', width: 2560, height: 1664, bezels: { top: 32, bottom: 0, left: 0, right: 0 }, notch: true, year: 2022 },

  // Watch
  { id: 'apple-watch-ultra', name: 'Apple Watch Ultra', category: 'watch', width: 410, height: 502, bezels: { top: 12, bottom: 12, left: 12, right: 12 }, year: 2023, popular: true },
  { id: 'apple-watch-9-45mm', name: 'Apple Watch Series 9 (45mm)', category: 'watch', width: 396, height: 484, bezels: { top: 12, bottom: 12, left: 12, right: 12 }, year: 2023 },
  { id: 'apple-watch-9-41mm', name: 'Apple Watch Series 9 (41mm)', category: 'watch', width: 352, height: 430, bezels: { top: 10, bottom: 10, left: 10, right: 10 }, year: 2023 },
];

const categoryIcons: Record<DeviceCategory, React.ReactNode> = {
  iphone: <Smartphone className="h-4 w-4" />,
  android: <Smartphone className="h-4 w-4" />,
  ipad: <Tablet className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  desktop: <Monitor className="h-4 w-4" />,
  laptop: <Laptop className="h-4 w-4" />,
  watch: <Watch className="h-4 w-4" />,
};

const categoryLabels: Record<DeviceCategory, string> = {
  iphone: 'iPhone',
  android: 'Android',
  ipad: 'iPad',
  tablet: 'Tablet',
  desktop: 'Desktop',
  laptop: 'Laptop',
  watch: 'Watch',
};

export default function DeviceFrameSelector({
  variant = 'full',
  selectedDevice,
  onSelect,
  orientation = 'portrait',
  onOrientationChange,
  showColors = true,
  className = '',
}: DeviceFrameSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['iphone-15-pro', 'pixel-8-pro']));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredDevices = deviceFrames.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularDevices = deviceFrames.filter(d => d.popular);
  const favoriteDevices = deviceFrames.filter(d => favorites.has(d.id));

  const handleSelect = useCallback((device: DeviceFrame) => {
    onSelect?.(device);
    setIsDropdownOpen(false);
  }, [onSelect]);

  const toggleFavorite = useCallback((deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(deviceId)) {
        next.delete(deviceId);
      } else {
        next.add(deviceId);
      }
      return next;
    });
  }, []);

  const getDeviceDimensions = (device: DeviceFrame) => {
    if (orientation === 'landscape') {
      return `${device.height}×${device.width}`;
    }
    return `${device.width}×${device.height}`;
  };

  // Suppress unused variable warning
  void showColors;

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:border-gray-500"
        >
          {selectedDevice
            ? (
                <>
                  {categoryIcons[selectedDevice.category]}
                  <span>{selectedDevice.name}</span>
                </>
              )
            : (
                <>
                  <Smartphone className="h-4 w-4" />
                  <span>Select device</span>
                </>
              )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
            <div className="absolute top-full left-0 z-20 mt-1 max-h-80 w-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-2 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search devices..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="p-1">
                {filteredDevices.map(device => (
                  <button
                    key={device.id}
                    onClick={() => handleSelect(device)}
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${
                      selectedDevice?.id === device.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {categoryIcons[device.category]}
                    <span className="flex-1">{device.name}</span>
                    <span className="text-xs text-gray-500">{getDeviceDimensions(device)}</span>
                    {selectedDevice?.id === device.id && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Device Frame</h3>
          {onOrientationChange && (
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => onOrientationChange('portrait')}
                className={`rounded p-1.5 ${orientation === 'portrait' ? 'bg-white shadow dark:bg-gray-600' : ''}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <button
                onClick={() => onOrientationChange('landscape')}
                className={`rounded p-1.5 ${orientation === 'landscape' ? 'bg-white shadow dark:bg-gray-600' : ''}`}
              >
                <Smartphone className="h-4 w-4 rotate-90" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {popularDevices.slice(0, 8).map(device => (
            <button
              key={device.id}
              onClick={() => handleSelect(device)}
              className={`rounded-lg p-2 text-center ${
                selectedDevice?.id === device.id
                  ? 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20'
                  : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="mx-auto mb-1 text-gray-500">{categoryIcons[device.category]}</div>
              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">{device.name.split(' ').slice(-2).join(' ')}</p>
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Device Frames</h2>
          {onOrientationChange && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => onOrientationChange('portrait')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  orientation === 'portrait'
                    ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Portrait
              </button>
              <button
                onClick={() => onOrientationChange('landscape')}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                  orientation === 'landscape'
                    ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Smartphone className="h-4 w-4 rotate-90" />
                Landscape
              </button>
            </div>
          )}
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as DeviceCategory | 'all')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Devices</option>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6">
        {/* Favorites */}
        {favoriteDevices.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <Star className="h-4 w-4 text-yellow-500" />
              Favorites
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {favoriteDevices.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isSelected={selectedDevice?.id === device.id}
                  isFavorite={true}
                  orientation={orientation}
                  onSelect={() => handleSelect(device)}
                  onToggleFavorite={e => toggleFavorite(device.id, e)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All devices */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            {selectedCategory === 'all' ? 'All Devices' : categoryLabels[selectedCategory]}
            <span className="ml-2 font-normal text-gray-500">
              (
              {filteredDevices.length}
              )
            </span>
          </h3>
          <div className="grid max-h-[400px] grid-cols-4 gap-3 overflow-y-auto">
            {filteredDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice?.id === device.id}
                isFavorite={favorites.has(device.id)}
                orientation={orientation}
                onSelect={() => handleSelect(device)}
                onToggleFavorite={e => toggleFavorite(device.id, e)}
              />
            ))}
          </div>
        </div>

        {/* Custom device */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            <Plus className="h-4 w-4" />
            Add Custom Device
          </button>
        </div>
      </div>
    </div>
  );
}

// Device card component
function DeviceCard({
  device,
  isSelected,
  isFavorite,
  orientation,
  onSelect,
  onToggleFavorite,
}: {
  device: DeviceFrame;
  isSelected: boolean;
  isFavorite: boolean;
  orientation: Orientation;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const dimensions = orientation === 'landscape'
    ? `${device.height}×${device.width}`
    : `${device.width}×${device.height}`;

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-lg p-3 transition-all ${
        isSelected
          ? 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20'
          : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700'
      }`}
    >
      <button
        onClick={onToggleFavorite}
        className={`absolute top-2 right-2 rounded p-1 ${
          isFavorite ? 'text-yellow-500' : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-yellow-500'
        }`}
      >
        <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <div className="flex flex-col items-center">
        <div className="mb-2 flex h-16 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-400 dark:bg-gray-600">
          {categoryIcons[device.category]}
        </div>
        <p className="text-center text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
        <p className="text-xs text-gray-500">{dimensions}</p>
        {device.year && (
          <span className="mt-1 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-600 dark:text-gray-400">
            {device.year}
          </span>
        )}
      </div>

      {isSelected && (
        <div className="absolute right-2 bottom-2">
          <Check className="h-4 w-4 text-blue-500" />
        </div>
      )}
    </div>
  );
}

export type { DeviceCategory, DeviceFrame, DeviceFrameSelectorProps };
