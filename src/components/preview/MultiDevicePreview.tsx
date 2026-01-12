'use client';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Grid,
  Laptop,
  Layers,
  Monitor,
  Plus,
  RotateCw,
  Share2,
  Smartphone,
  Tablet,
  Watch,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop' | 'watch';
type Orientation = 'portrait' | 'landscape';
type PreviewLayout = 'grid' | 'carousel' | 'stack' | 'comparison';
type PreviewVariant = 'full' | 'compact' | 'minimal';

type DeviceConfig = {
  id: string;
  name: string;
  type: DeviceType;
  width: number;
  height: number;
  scale: number;
  pixelRatio: number;
  orientation: Orientation;
};

type PreviewDevice = {
  id: string;
  config: DeviceConfig;
  isActive: boolean;
  isLocked: boolean;
};

export type MultiDevicePreviewProps = {
  variant?: PreviewVariant;
  mockupUrl?: string;
  devices?: PreviewDevice[];
  layout?: PreviewLayout;
  syncScroll?: boolean;
  showDeviceFrames?: boolean;
  onDeviceAdd?: (device: DeviceConfig) => void;
  onDeviceRemove?: (deviceId: string) => void;
  onLayoutChange?: (layout: PreviewLayout) => void;
  onExport?: (devices: PreviewDevice[]) => void;
  className?: string;
};

// Default device presets
const defaultDevices: DeviceConfig[] = [
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', type: 'phone', width: 393, height: 852, scale: 1, pixelRatio: 3, orientation: 'portrait' },
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', type: 'phone', width: 430, height: 932, scale: 1, pixelRatio: 3, orientation: 'portrait' },
  { id: 'pixel-8', name: 'Pixel 8', type: 'phone', width: 412, height: 915, scale: 1, pixelRatio: 2.625, orientation: 'portrait' },
  { id: 'galaxy-s24', name: 'Galaxy S24', type: 'phone', width: 360, height: 780, scale: 1, pixelRatio: 3, orientation: 'portrait' },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', type: 'tablet', width: 834, height: 1194, scale: 1, pixelRatio: 2, orientation: 'portrait' },
  { id: 'ipad-air', name: 'iPad Air', type: 'tablet', width: 820, height: 1180, scale: 1, pixelRatio: 2, orientation: 'portrait' },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14"', type: 'laptop', width: 1512, height: 982, scale: 1, pixelRatio: 2, orientation: 'landscape' },
  { id: 'macbook-air-13', name: 'MacBook Air 13"', type: 'laptop', width: 1470, height: 956, scale: 1, pixelRatio: 2, orientation: 'landscape' },
  { id: 'desktop-1080p', name: 'Desktop 1080p', type: 'desktop', width: 1920, height: 1080, scale: 1, pixelRatio: 1, orientation: 'landscape' },
  { id: 'desktop-4k', name: 'Desktop 4K', type: 'desktop', width: 3840, height: 2160, scale: 1, pixelRatio: 2, orientation: 'landscape' },
  { id: 'apple-watch-ultra', name: 'Apple Watch Ultra', type: 'watch', width: 410, height: 502, scale: 1, pixelRatio: 2, orientation: 'portrait' },
];

const mockPreviewDevices: PreviewDevice[] = [
  { id: '1', config: defaultDevices[0]!, isActive: true, isLocked: false },
  { id: '2', config: defaultDevices[4]!, isActive: true, isLocked: false },
  { id: '3', config: defaultDevices[6]!, isActive: true, isLocked: false },
];

export default function MultiDevicePreview({
  variant = 'full',
  mockupUrl: _mockupUrl = '/api/placeholder/400/800',
  devices = mockPreviewDevices,
  layout: initialLayout = 'grid',
  syncScroll = true,
  showDeviceFrames = true,
  onDeviceAdd,
  onDeviceRemove,
  onLayoutChange,
  onExport,
  className = '',
}: MultiDevicePreviewProps) {
  const [activeDevices, setActiveDevices] = useState<PreviewDevice[]>(devices);
  const [layout, setLayout] = useState<PreviewLayout>(initialLayout);
  const [zoom, setZoom] = useState(100);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | 'all'>('all');

  // Suppress unused variable warning - available for future use
  void _mockupUrl;
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handleLayoutChange = useCallback((newLayout: PreviewLayout) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  }, [onLayoutChange]);

  const handleAddDevice = useCallback((device: DeviceConfig) => {
    const newDevice: PreviewDevice = {
      id: `${device.id}-${Date.now()}`,
      config: device,
      isActive: true,
      isLocked: false,
    };
    setActiveDevices(prev => [...prev, newDevice]);
    onDeviceAdd?.(device);
    setShowDeviceSelector(false);
  }, [onDeviceAdd]);

  const handleRemoveDevice = useCallback((deviceId: string) => {
    setActiveDevices(prev => prev.filter(d => d.id !== deviceId));
    onDeviceRemove?.(deviceId);
  }, [onDeviceRemove]);

  const handleToggleOrientation = useCallback((deviceId: string) => {
    setActiveDevices(prev => prev.map((d) => {
      if (d.id === deviceId) {
        const newOrientation: Orientation = d.config.orientation === 'portrait' ? 'landscape' : 'portrait';
        return {
          ...d,
          config: {
            ...d.config,
            orientation: newOrientation,
            width: d.config.height,
            height: d.config.width,
          },
        };
      }
      return d;
    }));
  }, []);

  const handleExport = useCallback(() => {
    onExport?.(activeDevices);
  }, [activeDevices, onExport]);

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'phone': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'watch': return <Watch className="h-4 w-4" />;
    }
  };

  const filteredDevicePresets = selectedDeviceType === 'all'
    ? defaultDevices
    : defaultDevices.filter(d => d.type === selectedDeviceType);

  const getScaledDimensions = (device: DeviceConfig) => {
    const scaleFactor = zoom / 100;
    const baseScale = variant === 'compact' ? 0.3 : variant === 'minimal' ? 0.2 : 0.4;
    return {
      width: device.width * baseScale * scaleFactor,
      height: device.height * baseScale * scaleFactor,
    };
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Layers className="h-4 w-4" />
            Preview
          </h3>
          <span className="text-xs text-gray-500">
            {activeDevices.length}
            {' '}
            devices
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeDevices.map((device) => {
            const dims = getScaledDimensions(device.config);
            return (
              <div
                key={device.id}
                className="flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                style={{ width: dims.width, height: dims.height }}
              >
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  {getDeviceIcon(device.config.type)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Multi-Device Preview</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeviceSelector(true)}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
              </button>
              <select
                value={layout}
                onChange={e => handleLayoutChange(e.target.value as PreviewLayout)}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="grid">Grid</option>
                <option value="carousel">Carousel</option>
                <option value="stack">Stack</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className={`flex ${layout === 'grid' ? 'flex-wrap gap-3' : 'gap-3 overflow-x-auto'}`}>
            {activeDevices.map((device) => {
              const dims = getScaledDimensions(device.config);
              return (
                <div key={device.id} className="relative flex-shrink-0">
                  <div
                    className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                    style={{ width: dims.width, height: dims.height }}
                  >
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      {getDeviceIcon(device.config.type)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDevice(device.id)}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="mt-1 max-w-[100px] truncate text-center text-xs text-gray-500">
                    {device.config.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Multi-Device Preview</h2>
            <p className="mt-0.5 text-sm text-gray-500">Preview your mockup across multiple devices</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export All
            </button>
            <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {/* Layout selector */}
          <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {(['grid', 'carousel', 'stack', 'comparison'] as PreviewLayout[]).map(l => (
              <button
                key={l}
                onClick={() => handleLayoutChange(l)}
                className={`rounded px-3 py-1 text-sm capitalize transition-colors ${
                  layout === l
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="ml-4 flex items-center gap-1">
            <button
              onClick={() => setZoom(z => Math.max(25, z - 25))}
              disabled={zoom <= 25}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm text-gray-600 dark:text-gray-400">
              {zoom}
              %
            </span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 25))}
              disabled={zoom >= 200}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={syncScroll}
              onChange={() => {}}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            Sync scroll
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showDeviceFrames}
              onChange={() => {}}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            Show frames
          </label>
          <button
            onClick={() => setShowDeviceSelector(true)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add Device
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="min-h-[400px] bg-gray-50 p-6 dark:bg-gray-950">
        {layout === 'carousel' ? (
          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                disabled={carouselIndex === 0}
                className="absolute left-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {activeDevices[carouselIndex] && (
                <div className="text-center">
                  <div
                    className="relative mx-auto overflow-hidden rounded-2xl border-4 border-gray-300 bg-gray-100 shadow-xl dark:border-gray-600 dark:bg-gray-800"
                    style={getScaledDimensions(activeDevices[carouselIndex]!.config)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      {getDeviceIcon(activeDevices[carouselIndex]!.config.type)}
                      <span className="ml-2 text-sm">{activeDevices[carouselIndex]!.config.name}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {activeDevices[carouselIndex]!.config.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activeDevices[carouselIndex]!.config.width}
                      {' '}
                      x
                      {activeDevices[carouselIndex]!.config.height}
                    </span>
                    <button
                      onClick={() => handleToggleOrientation(activeDevices[carouselIndex]!.id)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <RotateCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setCarouselIndex(i => Math.min(activeDevices.length - 1, i + 1))}
                disabled={carouselIndex >= activeDevices.length - 1}
                className="absolute right-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {activeDevices.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === carouselIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : layout === 'comparison' ? (
          <div className="flex items-start justify-center gap-8">
            {activeDevices.slice(0, 2).map((device) => {
              const dims = getScaledDimensions(device.config);
              return (
                <div key={device.id} className="text-center">
                  <div
                    className="relative overflow-hidden rounded-2xl border-4 border-gray-300 bg-gray-100 shadow-xl dark:border-gray-600 dark:bg-gray-800"
                    style={{ width: dims.width, height: dims.height }}
                  >
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="absolute top-2 right-2 z-10 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      {getDeviceIcon(device.config.type)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{device.config.name}</p>
                    <p className="text-xs text-gray-500">
                      {device.config.width}
                      {' '}
                      x
                      {' '}
                      {device.config.height}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : layout === 'stack' ? (
          <div className="flex items-center justify-center">
            <div className="relative">
              {activeDevices.map((device, index) => {
                const dims = getScaledDimensions(device.config);
                const offset = index * 30;
                return (
                  <div
                    key={device.id}
                    className="absolute overflow-hidden rounded-2xl border-4 border-gray-300 bg-gray-100 shadow-xl dark:border-gray-600 dark:bg-gray-800"
                    style={{
                      width: dims.width,
                      height: dims.height,
                      left: offset,
                      top: offset,
                      zIndex: activeDevices.length - index,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      {getDeviceIcon(device.config.type)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Grid layout
          <div className="flex flex-wrap justify-center gap-6">
            {activeDevices.map((device) => {
              const dims = getScaledDimensions(device.config);
              return (
                <div key={device.id} className="text-center">
                  <div className="group relative">
                    <div
                      className="overflow-hidden rounded-2xl border-4 border-gray-300 bg-gray-100 shadow-xl transition-transform hover:scale-105 dark:border-gray-600 dark:bg-gray-800"
                      style={{ width: dims.width, height: dims.height }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {getDeviceIcon(device.config.type)}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleToggleOrientation(device.id)}
                        className="rounded bg-white p-1 shadow hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        <RotateCw className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="rounded bg-red-500 p-1 text-white shadow hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{device.config.name}</p>
                  <p className="text-xs text-gray-500">
                    {device.config.width}
                    {' '}
                    x
                    {' '}
                    {device.config.height}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Device selector modal */}
      {showDeviceSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Device</h3>
              <button
                onClick={() => setShowDeviceSelector(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Device type filter */}
            <div className="border-b border-gray-200 p-4 dark:border-gray-800">
              <div className="flex gap-2 overflow-x-auto">
                {(['all', 'phone', 'tablet', 'laptop', 'desktop', 'watch'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedDeviceType(type)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm whitespace-nowrap ${
                      selectedDeviceType === type
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {type === 'all'
                      ? (
                          <Grid className="h-4 w-4" />
                        )
                      : (
                          getDeviceIcon(type)
                        )}
                    <span className="capitalize">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Device list */}
            <div className="max-h-96 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredDevicePresets.map(device => (
                  <button
                    key={device.id}
                    onClick={() => handleAddDevice(device)}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</p>
                      <p className="text-xs text-gray-500">
                        {device.width}
                        {' '}
                        x
                        {' '}
                        {device.height}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { DeviceConfig, DeviceType, Orientation, PreviewDevice, PreviewLayout, PreviewVariant };
