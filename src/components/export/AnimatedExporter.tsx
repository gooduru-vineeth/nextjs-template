'use client';

import {
  AlertCircle,
  Check,
  ChevronDown,
  Download,
  Eye,
  Film,
  Loader2,
  Pause,
  Play,
  Settings,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ExportFormat = 'gif' | 'mp4' | 'webm';
type AnimationType = 'typing' | 'scroll' | 'transition' | 'fade' | 'slide';
type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

// AnimationFrame type is available for future use
// interface AnimationFrame {
//   id: string;
//   type: AnimationType;
//   duration: number;
//   delay: number;
//   easing: string;
// }

type ExportSettings = {
  format: ExportFormat;
  quality: ExportQuality;
  fps: number;
  width: number;
  height: number;
  loop: boolean;
  duration: number;
  backgroundColor?: string;
};

type AnimatedExporterProps = {
  variant?: 'full' | 'compact' | 'widget';
  mockupId?: string;
  onExport?: (settings: ExportSettings) => void;
  onPreview?: () => void;
  className?: string;
};

// Format configurations
const formatConfig = {
  gif: { label: 'GIF', icon: '🖼️', description: 'Animated image, works everywhere', maxFps: 30 },
  mp4: { label: 'MP4', icon: '🎬', description: 'High quality video with audio', maxFps: 60 },
  webm: { label: 'WebM', icon: '🎞️', description: 'Web-optimized video format', maxFps: 60 },
};

const qualityConfig = {
  low: { label: 'Low', scale: 0.5, bitrate: '1M', description: 'Smaller file, fast export' },
  medium: { label: 'Medium', scale: 0.75, bitrate: '2.5M', description: 'Balanced quality and size' },
  high: { label: 'High', scale: 1, bitrate: '5M', description: 'Great quality, larger file' },
  ultra: { label: 'Ultra', scale: 1.5, bitrate: '10M', description: 'Maximum quality, slowest' },
};

const animationTypes: { type: AnimationType; label: string; icon: string; description: string }[] = [
  { type: 'typing', label: 'Typing Animation', icon: '⌨️', description: 'Simulate message typing' },
  { type: 'scroll', label: 'Scroll Animation', icon: '📜', description: 'Scroll through conversation' },
  { type: 'transition', label: 'Screen Transition', icon: '🔄', description: 'Transition between states' },
  { type: 'fade', label: 'Fade Effect', icon: '✨', description: 'Fade in/out elements' },
  { type: 'slide', label: 'Slide Animation', icon: '➡️', description: 'Slide elements into view' },
];

const resolutionPresets = [
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Twitter Post', width: 1200, height: 675 },
  { label: 'LinkedIn Post', width: 1200, height: 627 },
  { label: 'HD (1080p)', width: 1920, height: 1080 },
  { label: '4K', width: 3840, height: 2160 },
  { label: 'Custom', width: 0, height: 0 },
];

export default function AnimatedExporter({
  variant = 'full',
  onExport,
  onPreview,
  className = '',
}: AnimatedExporterProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'gif',
    quality: 'medium',
    fps: 24,
    width: 1080,
    height: 1080,
    loop: true,
    duration: 5,
  });

  const [selectedAnimations, setSelectedAnimations] = useState<AnimationType[]>(['typing']);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [estimatedSize] = useState('~2.4 MB');

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          onExport?.(settings);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  }, [settings, onExport]);

  const handleAnimationToggle = useCallback((type: AnimationType) => {
    setSelectedAnimations(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  }, []);

  const handleResolutionPreset = useCallback((width: number, height: number) => {
    if (width > 0 && height > 0) {
      setSettings(prev => ({ ...prev, width, height }));
    }
  }, []);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Film className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Animated Export</span>
        </div>
        <button
          onClick={handleExport}
          className="w-full rounded bg-purple-600 py-2 text-sm text-white hover:bg-purple-700"
        >
          Export GIF
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Animated Export</h3>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {(['gif', 'mp4', 'webm'] as ExportFormat[]).map(format => (
            <button
              key={format}
              onClick={() => setSettings(prev => ({ ...prev, format }))}
              className={`rounded-lg border p-2 text-center text-sm transition-colors ${
                settings.format === format
                  ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{formatConfig[format].icon}</span>
              <p className="mt-1">{formatConfig[format].label}</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {isExporting
            ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                  {' '}
                  {exportProgress}
                  %
                </>
              )
            : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                  {' '}
                  {formatConfig[settings.format].label}
                </>
              )}
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Film className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Animated Export</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create animated GIFs and videos</p>
            </div>
          </div>
          <button
            onClick={onPreview}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
        {/* Left: Settings */}
        <div className="space-y-6 p-6">
          {/* Format Selection */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Export Format</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['gif', 'mp4', 'webm'] as ExportFormat[]).map(format => (
                <button
                  key={format}
                  onClick={() => setSettings(prev => ({ ...prev, format }))}
                  className={`rounded-xl border-2 p-4 text-center transition-all ${
                    settings.format === format
                      ? 'scale-105 border-purple-500 bg-purple-50 shadow-lg dark:bg-purple-900/30'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="mb-2 block text-3xl">{formatConfig[format].icon}</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatConfig[format].label}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatConfig[format].description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Animation Types */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Animation Effects</h3>
            <div className="space-y-2">
              {animationTypes.map(anim => (
                <button
                  key={anim.type}
                  onClick={() => handleAnimationToggle(anim.type)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedAnimations.includes(anim.type)
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{anim.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{anim.label}</p>
                    <p className="text-xs text-gray-500">{anim.description}</p>
                  </div>
                  {selectedAnimations.includes(anim.type) && (
                    <Check className="h-5 w-5 text-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Quality</h3>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'ultra'] as ExportQuality[]).map(quality => (
                <button
                  key={quality}
                  onClick={() => setSettings(prev => ({ ...prev, quality }))}
                  className={`rounded-lg border p-3 text-center transition-colors ${
                    settings.quality === quality
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">{qualityConfig[quality].label}</p>
                  <p className="text-xs text-gray-500">
                    {qualityConfig[quality].scale}
                    x
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Settings className="h-4 w-4" />
              Advanced Settings
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                {/* FPS */}
                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    Frame Rate:
                    {' '}
                    {settings.fps}
                    {' '}
                    FPS
                  </label>
                  <input
                    type="range"
                    min="12"
                    max={formatConfig[settings.format].maxFps}
                    value={settings.fps}
                    onChange={e => setSettings(prev => ({ ...prev, fps: Number.parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                    Duration:
                    {' '}
                    {settings.duration}
                    s
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={settings.duration}
                    onChange={e => setSettings(prev => ({ ...prev, duration: Number.parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                {/* Resolution */}
                <div>
                  <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">Resolution</label>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={settings.width}
                      onChange={e => setSettings(prev => ({ ...prev, width: Number.parseInt(e.target.value) }))}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      value={settings.height}
                      onChange={e => setSettings(prev => ({ ...prev, height: Number.parseInt(e.target.value) }))}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                      placeholder="Height"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resolutionPresets.filter(p => p.width > 0).map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => handleResolutionPreset(preset.width, preset.height)}
                        className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loop */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loop Animation</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.loop}
                      onChange={e => setSettings(prev => ({ ...prev, loop: e.target.checked }))}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview & Export */}
        <div className="space-y-6 p-6">
          {/* Preview */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  {isPreviewPlaying
                    ? (
                        <Pause className="h-8 w-8 text-purple-600" />
                      )
                    : (
                        <Play className="ml-1 h-8 w-8 text-purple-600" />
                      )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Animation Preview</p>
              </div>
            </div>

            {/* Preview Controls */}
            <div className="absolute right-4 bottom-4 left-4">
              <div className="flex items-center gap-3 rounded-lg bg-black/50 p-3 backdrop-blur-sm">
                <button
                  onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                >
                  {isPreviewPlaying
                    ? (
                        <Pause className="h-5 w-5 text-white" />
                      )
                    : (
                        <Play className="ml-0.5 h-5 w-5 text-white" />
                      )}
                </button>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: isPreviewPlaying ? '100%' : '0%' }}
                  />
                </div>
                <span className="font-mono text-xs text-white">
                  {settings.duration}
                  s
                </span>
              </div>
            </div>
          </div>

          {/* Export Info */}
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {settings.width}
                x
                {settings.height}
              </p>
              <p className="text-xs text-gray-500">Resolution</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{settings.fps}</p>
              <p className="text-xs text-gray-500">FPS</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{estimatedSize}</p>
              <p className="text-xs text-gray-500">Est. Size</p>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  Exporting
                  {' '}
                  {formatConfig[settings.format].label}
                  ...
                </span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  {exportProgress}
                  %
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-purple-200 dark:bg-purple-900">
                <div
                  className="h-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || selectedAnimations.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {isExporting
              ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Exporting...
                  </>
                )
              : (
                  <>
                    <Download className="h-5 w-5" />
                    Export
                    {' '}
                    {formatConfig[settings.format].label}
                  </>
                )}
          </button>

          {/* Warning if no animations */}
          {selectedAnimations.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Select at least one animation effect
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export type { AnimatedExporterProps, AnimationType, ExportFormat, ExportQuality, ExportSettings };
