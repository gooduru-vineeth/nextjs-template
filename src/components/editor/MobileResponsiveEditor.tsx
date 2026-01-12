'use client';

import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  EyeOff,
  Grid,
  Hand,
  Layers,
  Maximize2,
  Menu,
  Minimize2,
  Minus,
  Monitor,
  MousePointer,
  Move,
  Plus,
  Redo,
  RotateCw,
  Save,
  Settings,
  Share2,
  Smartphone,
  Tablet,
  Undo,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Types
export type DeviceMode = 'mobile' | 'tablet' | 'desktop';
export type OrientationMode = 'portrait' | 'landscape';
export type InteractionMode = 'select' | 'pan' | 'zoom';
export type GestureType = 'tap' | 'double-tap' | 'long-press' | 'swipe' | 'pinch' | 'rotate';

export type ViewportSize = {
  width: number;
  height: number;
  label: string;
};

export type TouchGesture = {
  type: GestureType;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  scale?: number;
  rotation?: number;
  timestamp: number;
};

export type MobileEditorState = {
  device: DeviceMode;
  orientation: OrientationMode;
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showLayers: boolean;
  interactionMode: InteractionMode;
};

export type MobileResponsiveEditorProps = {
  variant?: 'full' | 'compact' | 'widget';
  initialDevice?: DeviceMode;
  onDeviceChange?: (device: DeviceMode) => void;
  onZoomChange?: (zoom: number) => void;
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  children?: React.ReactNode;
};

// Device presets
const devicePresets: Record<DeviceMode, ViewportSize[]> = {
  mobile: [
    { width: 375, height: 667, label: 'iPhone SE' },
    { width: 390, height: 844, label: 'iPhone 14' },
    { width: 428, height: 926, label: 'iPhone 14 Pro Max' },
    { width: 360, height: 740, label: 'Android Small' },
    { width: 412, height: 915, label: 'Pixel 7' },
    { width: 393, height: 873, label: 'Galaxy S21' },
  ],
  tablet: [
    { width: 744, height: 1133, label: 'iPad Mini' },
    { width: 820, height: 1180, label: 'iPad Air' },
    { width: 1024, height: 1366, label: 'iPad Pro 12.9"' },
    { width: 800, height: 1280, label: 'Android Tablet' },
    { width: 912, height: 1368, label: 'Surface Pro' },
  ],
  desktop: [
    { width: 1280, height: 720, label: 'HD (720p)' },
    { width: 1366, height: 768, label: 'HD+' },
    { width: 1440, height: 900, label: 'WXGA+' },
    { width: 1920, height: 1080, label: 'Full HD' },
    { width: 2560, height: 1440, label: 'QHD' },
    { width: 3840, height: 2160, label: '4K UHD' },
  ],
};

// Helper functions
const getDeviceIcon = (device: DeviceMode) => {
  const icons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };
  return icons[device];
};

// Main Component
export default function MobileResponsiveEditor({
  variant = 'full',
  initialDevice = 'mobile',
  onDeviceChange,
  onZoomChange,
  onSave,
  onExport,
  onShare,
  children,
}: MobileResponsiveEditorProps) {
  const [state, setState] = useState<MobileEditorState>({
    device: initialDevice,
    orientation: 'portrait',
    zoom: 100,
    panX: 0,
    panY: 0,
    showGrid: false,
    showLayers: false,
    interactionMode: 'select',
  });
  const [selectedPreset, setSelectedPreset] = useState<ViewportSize>(devicePresets[initialDevice]?.[0] ?? devicePresets.mobile[0]!);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastGesture, setLastGesture] = useState<TouchGesture | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; distance?: number } | null>(null);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch0 = e.touches[0];
    const touch1 = e.touches[1];
    if (e.touches.length === 1 && touch0) {
      touchStartRef.current = {
        x: touch0.clientX,
        y: touch0.clientY,
      };
    } else if (e.touches.length === 2 && touch0 && touch1) {
      const distance = Math.hypot(
        touch0.clientX - touch1.clientX,
        touch0.clientY - touch1.clientY,
      );
      touchStartRef.current = {
        x: (touch0.clientX + touch1.clientX) / 2,
        y: (touch0.clientY + touch1.clientY) / 2,
        distance,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) {
      return;
    }
    const touch0 = e.touches[0];
    const touch1 = e.touches[1];

    if (e.touches.length === 1 && state.interactionMode === 'pan' && touch0) {
      const deltaX = touch0.clientX - touchStartRef.current.x;
      const deltaY = touch0.clientY - touchStartRef.current.y;
      setState(prev => ({
        ...prev,
        panX: prev.panX + deltaX,
        panY: prev.panY + deltaY,
      }));
      touchStartRef.current = {
        x: touch0.clientX,
        y: touch0.clientY,
      };
    } else if (e.touches.length === 2 && touchStartRef.current.distance && touch0 && touch1) {
      const newDistance = Math.hypot(
        touch0.clientX - touch1.clientX,
        touch0.clientY - touch1.clientY,
      );
      const scale = newDistance / touchStartRef.current.distance;
      const newZoom = Math.max(25, Math.min(400, state.zoom * scale));
      setState(prev => ({ ...prev, zoom: newZoom }));
      onZoomChange?.(newZoom);
      touchStartRef.current.distance = newDistance;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const changedTouch0 = e.changedTouches[0];
    if (touchStartRef.current && e.changedTouches.length === 1 && changedTouch0) {
      const endX = changedTouch0.clientX;
      const endY = changedTouch0.clientY;
      const deltaX = endX - touchStartRef.current.x;
      const deltaY = endY - touchStartRef.current.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 10) {
        setLastGesture({
          type: 'tap',
          startX: touchStartRef.current.x,
          startY: touchStartRef.current.y,
          timestamp: Date.now(),
        });
      } else if (distance > 50) {
        setLastGesture({
          type: 'swipe',
          startX: touchStartRef.current.x,
          startY: touchStartRef.current.y,
          endX,
          endY,
          timestamp: Date.now(),
        });
      }
    }
    touchStartRef.current = null;
  };

  // Device and zoom handlers
  const handleDeviceChange = (device: DeviceMode) => {
    setState(prev => ({ ...prev, device }));
    const presets = devicePresets[device];
    if (presets?.[0]) {
      setSelectedPreset(presets[0]);
    }
    setShowDeviceMenu(false);
    onDeviceChange?.(device);
  };

  const handlePresetChange = (preset: ViewportSize) => {
    setSelectedPreset(preset);
  };

  const handleZoom = (delta: number) => {
    const newZoom = Math.max(25, Math.min(400, state.zoom + delta));
    setState(prev => ({ ...prev, zoom: newZoom }));
    onZoomChange?.(newZoom);
  };

  const handleOrientationToggle = () => {
    setState(prev => ({
      ...prev,
      orientation: prev.orientation === 'portrait' ? 'landscape' : 'portrait',
    }));
    setSelectedPreset(prev => ({
      ...prev,
      width: prev.height,
      height: prev.width,
    }));
  };

  const resetView = () => {
    setState(prev => ({ ...prev, zoom: 100, panX: 0, panY: 0 }));
    onZoomChange?.(100);
  };

  // Get current viewport dimensions
  const viewportWidth = state.orientation === 'portrait' ? selectedPreset.width : selectedPreset.height;
  const viewportHeight = state.orientation === 'portrait' ? selectedPreset.height : selectedPreset.width;

  void lastGesture;

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Device Preview</span>
          <div className="flex gap-1">
            {(['mobile', 'tablet', 'desktop'] as DeviceMode[]).map((device) => {
              const Icon = getDeviceIcon(device);
              return (
                <button
                  key={device}
                  onClick={() => handleDeviceChange(device)}
                  className={`rounded p-1.5 ${
                    state.device === device
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {selectedPreset.label}
          :
          {viewportWidth}
          {' '}
          ×
          {viewportHeight}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        {/* Compact toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {(['mobile', 'tablet', 'desktop'] as DeviceMode[]).map((device) => {
              const Icon = getDeviceIcon(device);
              return (
                <button
                  key={device}
                  onClick={() => handleDeviceChange(device)}
                  className={`rounded-lg p-2 transition-colors ${
                    state.device === device
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleZoom(-10)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm text-gray-600 dark:text-gray-400">
              {state.zoom}
              %
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Preview area */}
        <div className="flex min-h-[300px] items-center justify-center bg-gray-100 p-4 dark:bg-gray-800">
          <div
            className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-900"
            style={{
              width: viewportWidth * (state.zoom / 100) * 0.3,
              height: viewportHeight * (state.zoom / 100) * 0.3,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-gray-100 dark:bg-gray-900">
      {/* Top toolbar */}
      <div
        className={`flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 transition-transform dark:border-gray-700 dark:bg-gray-800 ${
          showToolbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Device selector */}
          <div className="relative">
            <button
              onClick={() => setShowDeviceMenu(!showDeviceMenu)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {(() => {
                const Icon = getDeviceIcon(state.device);
                return <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />;
              })()}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedPreset.label}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {showDeviceMenu && (
              <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                {(['mobile', 'tablet', 'desktop'] as DeviceMode[]).map(device => (
                  <div key={device}>
                    <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase dark:bg-gray-700/50 dark:text-gray-400">
                      {device}
                    </div>
                    {devicePresets[device].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          handleDeviceChange(device);
                          handlePresetChange(preset);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedPreset.label === preset.label
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{preset.label}</span>
                          <span className="text-gray-400 dark:text-gray-500">
                            {preset.width}
                            {' '}
                            ×
                            {preset.height}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orientation toggle */}
          <button
            onClick={handleOrientationToggle}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={`Switch to ${state.orientation === 'portrait' ? 'landscape' : 'portrait'}`}
          >
            <RotateCw className="h-5 w-5" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-700">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              {state.zoom}
              %
            </span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Reset view */}
          <button
            onClick={resetView}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Reset view"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Interaction mode */}
          <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => setState(prev => ({ ...prev, interactionMode: 'select' }))}
              className={`rounded p-2 ${
                state.interactionMode === 'select'
                  ? 'bg-white shadow-sm dark:bg-gray-600'
                  : 'text-gray-500'
              }`}
            >
              <MousePointer className="h-4 w-4" />
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, interactionMode: 'pan' }))}
              className={`rounded p-2 ${
                state.interactionMode === 'pan'
                  ? 'bg-white shadow-sm dark:bg-gray-600'
                  : 'text-gray-500'
              }`}
            >
              <Hand className="h-4 w-4" />
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, interactionMode: 'zoom' }))}
              className={`rounded p-2 ${
                state.interactionMode === 'zoom'
                  ? 'bg-white shadow-sm dark:bg-gray-600'
                  : 'text-gray-500'
              }`}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* View toggles */}
          <button
            onClick={() => setState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
            className={`rounded-lg p-2 ${
              state.showGrid
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle grid"
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setState(prev => ({ ...prev, showLayers: !prev.showLayers }))}
            className={`rounded-lg p-2 ${
              state.showLayers
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Toggle layers"
          >
            <Layers className="h-5 w-5" />
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Actions */}
          <button
            onClick={onSave}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Save"
          >
            <Save className="h-5 w-5" />
          </button>
          <button
            onClick={onExport}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Export"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onShare}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main canvas area */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid overlay */}
        {state.showGrid && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * (state.zoom / 100)}px ${20 * (state.zoom / 100)}px`,
            }}
          />
        )}

        {/* Device frame */}
        <div
          className="absolute transition-all duration-200 ease-out"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${state.panX}px, ${state.panY}px) scale(${state.zoom / 100})`,
          }}
        >
          <div
            className={`overflow-hidden rounded-3xl border-8 bg-white shadow-2xl dark:bg-gray-800 ${
              state.device === 'mobile'
                ? 'border-gray-800 dark:border-gray-600'
                : state.device === 'tablet'
                  ? 'border-gray-700 dark:border-gray-500'
                  : 'border-gray-600 dark:border-gray-400'
            }`}
            style={{
              width: viewportWidth,
              height: viewportHeight,
            }}
          >
            {/* Device notch for mobile */}
            {state.device === 'mobile' && state.orientation === 'portrait' && (
              <div className="absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-gray-800 dark:bg-gray-600" />
            )}

            {/* Content area */}
            <div className="h-full w-full overflow-auto">
              {children || (
                <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <Move className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p className="text-sm">Drop content here</p>
                    <p className="mt-1 text-xs">or start editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Layers panel */}
        {state.showLayers && (
          <div className="absolute top-4 right-4 z-20 w-64 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Layers</span>
              <button
                onClick={() => setState(prev => ({ ...prev, showLayers: false }))}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-64 overflow-auto p-2">
              <div className="space-y-1">
                {['Background', 'Header', 'Content', 'Footer'].map((layer, i) => (
                  <div
                    key={layer}
                    className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <button className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {i === 1 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{layer}</span>
                    </div>
                    <div className="flex gap-0.5">
                      <button className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile floating action buttons */}
      {isTouchDevice && (
        <div className="absolute right-6 bottom-6 z-30 flex flex-col gap-2">
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="rounded-full bg-blue-600 p-4 text-white shadow-lg"
          >
            {showToolbar ? <Minimize2 className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      )}

      {/* Bottom toolbar for mobile */}
      {isTouchDevice && (
        <div className="flex items-center justify-around border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <Undo className="h-5 w-5" />
            <span className="text-xs">Undo</span>
          </button>
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <Redo className="h-5 w-5" />
            <span className="text-xs">Redo</span>
          </button>
          <button
            onClick={onSave}
            className="flex flex-col items-center gap-1 text-blue-600"
          >
            <Save className="h-5 w-5" />
            <span className="text-xs">Save</span>
          </button>
          <button
            onClick={onExport}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <Download className="h-5 w-5" />
            <span className="text-xs">Export</span>
          </button>
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-1 text-gray-500"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}
