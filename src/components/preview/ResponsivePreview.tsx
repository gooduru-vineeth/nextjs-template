'use client';

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Monitor,
  Plus,
  RefreshCw,
  RotateCcw,
  Settings,
  Smartphone,
  Tablet,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type DevicePreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'custom';
  isCustom?: boolean;
  platform?: 'ios' | 'android' | 'web';
};

export type ResponsivePreviewProps = {
  content: React.ReactNode;
  presets?: DevicePreset[];
  currentDevice?: DevicePreset;
  zoom?: number;
  onDeviceChange?: (device: DevicePreset) => void;
  onZoomChange?: (zoom: number) => void;
  onAddDevice?: (device: DevicePreset) => void;
  onRemoveDevice?: (deviceId: string) => void;
  onRotate?: (device: DevicePreset) => void;
  variant?: 'full' | 'compact' | 'toolbar' | 'sidebar' | 'minimal';
  showRulers?: boolean;
  showControls?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function ResponsivePreview({
  content,
  presets,
  currentDevice,
  zoom = 1,
  onDeviceChange,
  onZoomChange,
  onAddDevice,
  onRemoveDevice: _onRemoveDevice,
  onRotate,
  variant = 'full',
  showRulers = true,
  showControls = true,
  darkMode = false,
  className = '',
}: ResponsivePreviewProps) {
  // Reserved for remove device functionality
  void _onRemoveDevice;

  const defaultPresets: DevicePreset[] = [
    { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, deviceType: 'mobile', platform: 'ios' },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932, deviceType: 'mobile', platform: 'ios' },
    { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, deviceType: 'mobile', platform: 'android' },
    { id: 'ipad-pro', name: 'iPad Pro 11"', width: 834, height: 1194, deviceType: 'tablet', platform: 'ios' },
    { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, deviceType: 'tablet', platform: 'ios' },
    { id: 'surface-pro', name: 'Surface Pro', width: 912, height: 1368, deviceType: 'tablet', platform: 'web' },
    { id: 'macbook-13', name: 'MacBook 13"', width: 1440, height: 900, deviceType: 'desktop', platform: 'web' },
    { id: 'desktop-hd', name: 'Desktop HD', width: 1920, height: 1080, deviceType: 'desktop', platform: 'web' },
    { id: 'desktop-4k', name: '4K Display', width: 3840, height: 2160, deviceType: 'desktop', platform: 'web' },
  ];

  const devicePresets = presets && presets.length > 0 ? presets : defaultPresets;
  // Default to first preset - defaultPresets is guaranteed to have items
  const initialDevice = currentDevice ?? devicePresets[0] ?? defaultPresets[0]!;
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(initialDevice);
  const [isRotated, setIsRotated] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', width: 375, height: 812 });

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';
  const canvasBg = darkMode ? 'bg-gray-950' : 'bg-gray-100';

  const deviceWidth = isRotated ? selectedDevice.height : selectedDevice.width;
  const deviceHeight = isRotated ? selectedDevice.width : selectedDevice.height;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone size={16} />;
      case 'tablet':
        return <Tablet size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  const handleDeviceSelect = useCallback((device: DevicePreset) => {
    setSelectedDevice(device);
    setIsRotated(false);
    onDeviceChange?.(device);
  }, [onDeviceChange]);

  const handleRotate = useCallback(() => {
    setIsRotated(!isRotated);
    onRotate?.(selectedDevice);
  }, [isRotated, selectedDevice, onRotate]);

  const handleZoom = useCallback((delta: number) => {
    const newZoom = Math.max(0.25, Math.min(2, currentZoom + delta));
    setCurrentZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [currentZoom, onZoomChange]);

  const handleAddDevice = useCallback(() => {
    if (newDevice.name && newDevice.width && newDevice.height) {
      const device: DevicePreset = {
        id: `custom-${Date.now()}`,
        name: newDevice.name,
        width: newDevice.width,
        height: newDevice.height,
        deviceType: 'custom',
        isCustom: true,
      };
      onAddDevice?.(device);
      setNewDevice({ name: '', width: 375, height: 812 });
      setShowAddModal(false);
    }
  }, [newDevice, onAddDevice]);

  const renderDeviceSelector = (compact = false) => (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'} overflow-x-auto`}>
      {['mobile', 'tablet', 'desktop'].map((type) => {
        const typeDevices = devicePresets.filter(d => d.deviceType === type);
        if (typeDevices.length === 0) {
          return null;
        }

        return (
          <div key={type} className="flex gap-1">
            {typeDevices.map(device => (
              <button
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className={`flex items-center gap-2 ${compact ? 'px-2 py-1' : 'px-3 py-2'} rounded-lg whitespace-nowrap transition-colors ${
                  selectedDevice.id === device.id
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${textColor} ${hoverBg}`
                }`}
                title={`${device.width} × ${device.height}`}
              >
                {getDeviceIcon(device.deviceType)}
                {!compact && <span className="text-sm">{device.name}</span>}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );

  const renderZoomControls = () => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleZoom(-0.1)}
        className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
        disabled={currentZoom <= 0.25}
      >
        <ZoomOut size={16} className={mutedColor} />
      </button>
      <span className={`text-sm ${textColor} w-12 text-center`}>
        {Math.round(currentZoom * 100)}
        %
      </span>
      <button
        onClick={() => handleZoom(0.1)}
        className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
        disabled={currentZoom >= 2}
      >
        <ZoomIn size={16} className={mutedColor} />
      </button>
      <button
        onClick={() => {
          setCurrentZoom(1); onZoomChange?.(1);
        }}
        className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
        title="Reset zoom"
      >
        <RefreshCw size={16} className={mutedColor} />
      </button>
    </div>
  );

  const renderRuler = (horizontal: boolean) => {
    const size = horizontal ? deviceWidth : deviceHeight;
    const ticks = [];
    const step = 50;

    for (let i = 0; i <= size; i += step) {
      ticks.push(
        <div
          key={i}
          className={`absolute ${horizontal ? 'top-0 h-full' : 'left-0 w-full'} flex ${horizontal ? 'flex-col' : 'flex-row'} items-${horizontal ? 'center' : 'center'}`}
          style={horizontal ? { left: i * currentZoom } : { top: i * currentZoom }}
        >
          <div className={`${horizontal ? 'h-2 w-px' : 'h-px w-2'} ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
          <span className={`text-[8px] ${mutedColor} ml-0.5`}>{i}</span>
        </div>,
      );
    }

    return (
      <div className={`absolute ${horizontal ? 'top-0 right-0 left-0 h-5' : 'top-0 bottom-0 left-0 w-5'} ${inputBg} overflow-hidden`}>
        {ticks}
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-3 ${className}`}>
        <div className="flex gap-1">
          {['mobile', 'tablet', 'desktop'].map((type) => {
            const isSelected = selectedDevice.deviceType === type;
            return (
              <button
                key={type}
                onClick={() => {
                  const device = devicePresets.find(d => d.deviceType === type);
                  if (device) {
                    handleDeviceSelect(device);
                  }
                }}
                className={`rounded-lg p-2 ${isSelected ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
              >
                {getDeviceIcon(type)}
              </button>
            );
          })}
        </div>
        <span className={`text-xs ${mutedColor}`}>
          {deviceWidth}
          {' '}
          ×
          {deviceHeight}
        </span>
      </div>
    );
  }

  // Toolbar variant
  if (variant === 'toolbar') {
    return (
      <div className={`${bgColor} border ${borderColor} flex items-center gap-4 rounded-lg p-2 ${className}`}>
        {renderDeviceSelector(true)}
        <div className={`h-6 w-px ${borderColor}`} />
        <button
          onClick={handleRotate}
          className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
          title="Rotate device"
        >
          <RotateCcw size={16} className={mutedColor} />
        </button>
        <div className={`h-6 w-px ${borderColor}`} />
        {renderZoomControls()}
        <span className={`text-xs ${mutedColor} ml-2`}>
          {deviceWidth}
          {' '}
          ×
          {deviceHeight}
        </span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Preview</h3>
          <div className="flex items-center gap-2">
            {renderZoomControls()}
          </div>
        </div>

        {renderDeviceSelector(true)}

        <div className={`mt-4 ${canvasBg} flex items-center justify-center overflow-hidden rounded-lg p-4`}>
          <div
            className={`${bgColor} overflow-hidden rounded-lg shadow-xl`}
            style={{
              width: deviceWidth * currentZoom,
              height: deviceHeight * currentZoom,
              maxHeight: 300,
            }}
          >
            <div
              className="h-full w-full overflow-auto"
              style={{ transform: `scale(${currentZoom})`, transformOrigin: 'top left' }}
            >
              {content}
            </div>
          </div>
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
            <h3 className={`font-semibold ${textColor}`}>Responsive Preview</h3>
            <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}>
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Device type groups */}
          {['mobile', 'tablet', 'desktop'].map((type) => {
            const typeDevices = devicePresets.filter(d => d.deviceType === type);
            if (typeDevices.length === 0) {
              return null;
            }

            return (
              <div key={type}>
                <span className={`text-xs font-medium ${mutedColor} flex items-center gap-1 tracking-wider uppercase`}>
                  {getDeviceIcon(type)}
                  {type}
                </span>
                <div className="mt-2 space-y-1">
                  {typeDevices.map(device => (
                    <button
                      key={device.id}
                      onClick={() => handleDeviceSelect(device)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 ${
                        selectedDevice.id === device.id
                          ? 'bg-blue-500 text-white'
                          : `${hoverBg} ${textColor}`
                      }`}
                    >
                      <span className="text-sm">{device.name}</span>
                      <span className={`text-xs ${selectedDevice.id === device.id ? 'text-blue-100' : mutedColor}`}>
                        {device.width}
                        ×
                        {device.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Custom devices */}
          <div>
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>
              Custom
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className={`mt-2 flex w-full items-center justify-center gap-2 px-3 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
            >
              <Plus size={14} />
              Add Device
            </button>
          </div>
        </div>

        {/* Current device info */}
        <div className={`border-t p-4 ${borderColor}`}>
          <div className="mb-2 flex items-center justify-between">
            <span className={`font-medium ${textColor}`}>{selectedDevice.name}</span>
            <button
              onClick={handleRotate}
              className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}
            >
              <RotateCcw size={14} />
            </button>
          </div>
          <p className={`text-sm ${mutedColor}`}>
            {deviceWidth}
            {' '}
            ×
            {deviceHeight}
            px
            {isRotated && ' (rotated)'}
          </p>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full flex-col ${className}`}>
      {/* Header */}
      {showControls && (
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${textColor}`}>Responsive Preview</h2>
            <div className="flex items-center gap-2">
              {renderZoomControls()}
              <button
                onClick={handleRotate}
                className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
                title="Rotate device"
              >
                <RotateCcw size={16} className={mutedColor} />
              </button>
              <button
                className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
                title="Fullscreen"
              >
                <Maximize2 size={16} className={mutedColor} />
              </button>
            </div>
          </div>

          {/* Device selector */}
          <div className="flex items-center justify-between">
            {renderDeviceSelector()}
            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-3 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
            >
              <Plus size={16} />
              Custom
            </button>
          </div>
        </div>
      )}

      {/* Preview area */}
      <div className={`flex-1 ${canvasBg} relative overflow-auto`}>
        {/* Rulers */}
        {showRulers && (
          <>
            {renderRuler(true)}
            {renderRuler(false)}
          </>
        )}

        {/* Device frame */}
        <div
          className={`absolute ${showRulers ? 'top-8 left-8' : 'top-4 left-4'}`}
          style={{
            width: deviceWidth * currentZoom + 40,
            height: deviceHeight * currentZoom + 40,
          }}
        >
          {/* Device header */}
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {getDeviceIcon(selectedDevice.deviceType)}
              <span className={`text-sm ${textColor}`}>{selectedDevice.name}</span>
            </div>
            <span className={`text-xs ${mutedColor}`}>
              {deviceWidth}
              {' '}
              ×
              {deviceHeight}
            </span>
          </div>

          {/* Device frame */}
          <div
            className={`${bgColor} overflow-hidden rounded-xl border-8 shadow-2xl ${
              darkMode ? 'border-gray-800' : 'border-gray-900'
            }`}
            style={{
              width: deviceWidth * currentZoom,
              height: deviceHeight * currentZoom,
            }}
          >
            {/* Status bar for mobile */}
            {selectedDevice.deviceType === 'mobile' && (
              <div className={`h-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-between px-4`}>
                <span className={`text-xs ${mutedColor}`}>9:41</span>
                <div className="flex items-center gap-1">
                  <div className={`h-1.5 w-3 ${mutedColor} rounded-sm bg-current`} />
                  <div className={`h-1.5 w-3 ${mutedColor} rounded-sm bg-current`} />
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className="h-full w-full overflow-auto"
              style={{
                transform: `scale(${currentZoom})`,
                transformOrigin: 'top left',
                width: deviceWidth,
                height: deviceHeight - (selectedDevice.deviceType === 'mobile' ? 24 : 0),
              }}
            >
              {content}
            </div>

            {/* Home indicator for mobile */}
            {selectedDevice.deviceType === 'mobile' && (
              <div className={`h-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <div className={`h-1 w-32 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation for multiple screens */}
      <div className={`border-t p-3 ${borderColor} flex items-center justify-center gap-2`}>
        <button className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
          <ChevronLeft size={16} className={mutedColor} />
        </button>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-blue-500' : `${inputBg}`}`}
            />
          ))}
        </div>
        <button className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
          <ChevronRight size={16} className={mutedColor} />
        </button>
      </div>

      {/* Add custom device modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${bgColor} w-96 rounded-xl p-6 shadow-2xl`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Add Custom Device</h3>

            <div className="space-y-4">
              <div>
                <label className={`text-sm ${mutedColor} mb-1 block`}>Device Name</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={e => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="My Device"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${mutedColor} mb-1 block`}>Width (px)</label>
                  <input
                    type="number"
                    value={newDevice.width}
                    onChange={e => setNewDevice({ ...newDevice, width: Number.parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  />
                </div>
                <div>
                  <label className={`text-sm ${mutedColor} mb-1 block`}>Height (px)</label>
                  <input
                    type="number"
                    value={newDevice.height}
                    onChange={e => setNewDevice({ ...newDevice, height: Number.parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className={`px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                disabled={!newDevice.name || !newDevice.width || !newDevice.height}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
