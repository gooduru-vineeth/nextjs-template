'use client';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Monitor,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Share2,
  Smartphone,
  Tablet,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
type DeviceType = 'desktop' | 'tablet' | 'mobile';
type Orientation = 'portrait' | 'landscape';

type DeviceFrame = {
  id: string;
  name: string;
  type: DeviceType;
  width: number;
  height: number;
  scale?: number;
};

type PreviewModeProps = {
  variant?: 'full' | 'compact' | 'modal';
  mockupContent?: React.ReactNode;
  mockupImage?: string;
  title?: string;
  onExit?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  className?: string;
};

// Device presets
const deviceFrames: DeviceFrame[] = [
  { id: 'desktop', name: 'Desktop', type: 'desktop', width: 1440, height: 900 },
  { id: 'laptop', name: 'Laptop', type: 'desktop', width: 1280, height: 800 },
  { id: 'ipad-pro', name: 'iPad Pro', type: 'tablet', width: 1024, height: 1366 },
  { id: 'ipad', name: 'iPad', type: 'tablet', width: 768, height: 1024 },
  { id: 'iphone-14-pro', name: 'iPhone 14 Pro', type: 'mobile', width: 393, height: 852 },
  { id: 'iphone-se', name: 'iPhone SE', type: 'mobile', width: 375, height: 667 },
  { id: 'pixel-7', name: 'Pixel 7', type: 'mobile', width: 412, height: 915 },
  { id: 'galaxy-s22', name: 'Galaxy S22', type: 'mobile', width: 360, height: 780 },
];

export default function PreviewMode({
  variant = 'full',
  mockupContent,
  mockupImage,
  title = 'Mockup Preview',
  onExit,
  onExport,
  onShare,
  className = '',
}: PreviewModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceFrame>(deviceFrames[0]!);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [zoom, setZoom] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const totalSlides = 1; // Can be increased for multi-page mockups

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 10, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 10, 25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  const toggleOrientation = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Auto-advance slides when playing
  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 3000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPlaying, totalSlides]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen();
        } else {
          onExit?.();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleZoomReset();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onExit, toggleFullscreen, handleZoomIn, handleZoomOut, handleZoomReset, handlePrevSlide, handleNextSlide, togglePlayback]);

  const deviceWidth = orientation === 'portrait' ? selectedDevice.width : selectedDevice.height;
  const deviceHeight = orientation === 'portrait' ? selectedDevice.height : selectedDevice.width;

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFullscreen}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              onClick={onExit}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex min-h-[200px] items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
          {mockupImage
            ? (
                <img src={mockupImage} alt="Mockup preview" className="max-h-full max-w-full rounded-lg shadow-lg" />
              )
            : (
                mockupContent || (
                  <div className="text-sm text-gray-400">No preview available</div>
                )
              )}
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`fixed inset-0 z-50 bg-black/90 ${className}`}>
        {/* Close button */}
        <button
          onClick={onExit}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Preview content */}
        <div className="flex h-full w-full items-center justify-center p-8">
          <div
            style={{
              width: deviceWidth * (zoom / 100),
              height: deviceHeight * (zoom / 100),
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center',
            }}
            className="overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800"
          >
            {mockupImage
              ? (
                  <img src={mockupImage} alt="Mockup preview" className="h-full w-full object-contain" />
                )
              : (
                  mockupContent || (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No preview available
                    </div>
                  )
                )}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <div className="mx-auto max-w-2xl rounded-xl bg-white/10 p-3 backdrop-blur-lg">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 rounded-lg bg-black/20 p-1">
                <button onClick={handleZoomOut} className="rounded p-2 text-white hover:bg-white/10">
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-2 text-sm font-medium text-white">
                  {zoom}
                  %
                </span>
                <button onClick={handleZoomIn} className="rounded p-2 text-white hover:bg-white/10">
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {deviceFrames.slice(0, 4).map(device => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`rounded p-2 ${
                      selectedDevice.id === device.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                    title={device.name}
                  >
                    {getDeviceIcon(device.type)}
                  </button>
                ))}
              </div>

              {onExport && (
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div
      className={`flex h-full flex-col bg-gray-100 dark:bg-gray-900 ${className}`}
      onMouseMove={() => !showControls && setShowControls(true)}
    >
      {/* Top toolbar */}
      <div className={`flex items-center justify-between border-b border-gray-200 bg-white p-4 transition-opacity dark:border-gray-700 dark:bg-gray-800 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <EyeOff className="h-5 w-5" />
            <span className="text-sm">Exit Preview</span>
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <h2 className="font-medium text-gray-900 dark:text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Device selector */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            {['desktop', 'tablet', 'mobile'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedDevice(deviceFrames.find(d => d.type === type) || deviceFrames[0]!)}
                className={`rounded p-2 ${
                  selectedDevice.type === type
                    ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {getDeviceIcon(type as DeviceType)}
              </button>
            ))}
          </div>

          {/* Device dropdown */}
          <select
            value={selectedDevice.id}
            onChange={e => setSelectedDevice(deviceFrames.find(d => d.id === e.target.value) || deviceFrames[0]!)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {deviceFrames.map(device => (
              <option key={device.id} value={device.id}>
                {device.name}
                {' '}
                (
                {device.width}
                ×
                {device.height}
                )
              </option>
            ))}
          </select>

          {/* Orientation toggle */}
          <button
            onClick={toggleOrientation}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Toggle orientation"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-700">
            <button onClick={handleZoomOut} className="rounded-l-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button onClick={handleZoomReset} className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600">
              {zoom}
              %
            </button>
            <button onClick={handleZoomIn} className="rounded-r-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-600">
              <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>

          {/* Actions */}
          <div className="ml-2 flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            )}
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex flex-1 items-center justify-center overflow-auto p-8">
        <div
          className="relative overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-gray-800"
          style={{
            width: deviceWidth,
            height: deviceHeight,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center',
          }}
        >
          {/* Device frame decoration */}
          <div className="pointer-events-none absolute inset-0">
            {selectedDevice.type === 'mobile' && (
              <>
                <div className="absolute top-2 left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
                <div className="absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full bg-gray-300 dark:bg-gray-600" />
              </>
            )}
          </div>

          {/* Content */}
          {mockupImage
            ? (
                <img src={mockupImage} alt="Mockup preview" className="h-full w-full object-contain" />
              )
            : (
                mockupContent || (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No preview available
                  </div>
                )
              )}
        </div>
      </div>

      {/* Bottom controls for multi-page */}
      {totalSlides > 1 && (
        <div className={`border-t border-gray-200 bg-white p-4 transition-opacity dark:border-gray-700 dark:bg-gray-800 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlayback}
              className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentSlide + 1}
              {' '}
              /
              {totalSlides}
            </span>

            <button
              onClick={handleNextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className={`absolute bottom-4 left-4 text-xs text-gray-500 transition-opacity dark:text-gray-400 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        Press
        {' '}
        <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">F</kbd>
        {' '}
        for fullscreen,
        {' '}
        <kbd className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">Esc</kbd>
        {' '}
        to exit
      </div>
    </div>
  );
}

// Suppress unused variable warnings
void RefreshCw;

export type { DeviceFrame, DeviceType, PreviewModeProps };
