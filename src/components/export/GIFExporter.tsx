'use client';

import {
  ChevronDown,
  Download,
  Film,
  Image,
  Info,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RefreshCw,
  Repeat,
  Settings,
  Sliders,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type GIFFrame = {
  id: string;
  imageData: string;
  delay: number;
  timestamp: number;
};

export type GIFExportSettings = {
  width: number;
  height: number;
  quality: number;
  frameDelay: number;
  loop: boolean | number;
  optimize: boolean;
  dithering: 'none' | 'floyd-steinberg' | 'ordered';
  colorDepth: 8 | 16 | 32 | 64 | 128 | 256;
  preserveTransparency: boolean;
};

export type GIFExporterProps = {
  frames: GIFFrame[];
  onExport?: (settings: GIFExportSettings) => void;
  onFrameAdd?: (frame: GIFFrame) => void;
  onFrameRemove?: (frameId: string) => void;
  onFrameReorder?: (fromIndex: number, toIndex: number) => void;
  onSettingsChange?: (settings: Partial<GIFExportSettings>) => void;
  defaultSettings?: Partial<GIFExportSettings>;
  isExporting?: boolean;
  exportProgress?: number;
  variant?: 'full' | 'compact' | 'modal' | 'inline' | 'minimal';
  showPreview?: boolean;
  showSettings?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function GIFExporter({
  frames,
  onExport,
  onFrameAdd: _onFrameAdd,
  onFrameRemove,
  onFrameReorder: _onFrameReorder,
  onSettingsChange,
  defaultSettings,
  isExporting = false,
  exportProgress = 0,
  variant = 'full',
  showPreview = true,
  showSettings = true,
  darkMode = false,
  className = '',
}: GIFExporterProps) {
  // Reserved for frame management
  void _onFrameAdd;
  void _onFrameReorder;

  const [settings, setSettings] = useState<GIFExportSettings>({
    width: 480,
    height: 320,
    quality: 80,
    frameDelay: 100,
    loop: true,
    optimize: true,
    dithering: 'floyd-steinberg',
    colorDepth: 256,
    preserveTransparency: false,
    ...defaultSettings,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const presetSizes = [
    { label: 'Original', width: 0, height: 0 },
    { label: 'Small (240p)', width: 320, height: 240 },
    { label: 'Medium (480p)', width: 640, height: 480 },
    { label: 'Large (720p)', width: 1280, height: 720 },
    { label: 'Social (Square)', width: 480, height: 480 },
    { label: 'Twitter', width: 480, height: 270 },
    { label: 'Instagram', width: 480, height: 480 },
  ];

  const updateSettings = useCallback((updates: Partial<GIFExportSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onSettingsChange?.(updates);
  }, [settings, onSettingsChange]);

  const handleExport = useCallback(() => {
    onExport?.(settings);
  }, [onExport, settings]);

  const formatFileSize = (quality: number, width: number, height: number, frameCount: number): string => {
    // Rough estimation
    const bytesPerFrame = (width * height * (quality / 100)) / 10;
    const totalBytes = bytesPerFrame * frameCount;
    if (totalBytes > 1024 * 1024) {
      return `~${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `~${(totalBytes / 1024).toFixed(0)} KB`;
  };

  const formatDuration = (frameCount: number, delay: number): string => {
    const totalMs = frameCount * delay;
    const seconds = totalMs / 1000;
    return `${seconds.toFixed(1)}s`;
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Film size={16} className={mutedColor} />
          <span className={`text-sm ${textColor}`}>
            {frames.length}
            {' '}
            frames
          </span>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || frames.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Export GIF
        </button>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film size={18} className={mutedColor} />
            <span className={`font-medium ${textColor}`}>GIF Export</span>
          </div>
          <span className={`text-sm ${mutedColor}`}>
            {frames.length}
            {' '}
            frames •
            {formatDuration(frames.length, settings.frameDelay)}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1">
            <label className={`text-xs ${mutedColor} mb-1 block`}>Size</label>
            <select
              value={`${settings.width}x${settings.height}`}
              onChange={(e) => {
                const [w, h] = e.target.value.split('x').map(Number);
                updateSettings({ width: w, height: h });
              }}
              className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            >
              {presetSizes.map(size => (
                <option key={size.label} value={`${size.width}x${size.height}`}>
                  {size.label}
                  {' '}
                  {size.width > 0 && `(${size.width}×${size.height})`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className={`text-xs ${mutedColor} mb-1 block`}>Quality</label>
            <select
              value={settings.quality}
              onChange={e => updateSettings({ quality: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            >
              <option value={60}>Low (smaller file)</option>
              <option value={80}>Medium</option>
              <option value={100}>High (larger file)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting || frames.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {isExporting
            ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Exporting...
                  {' '}
                  {exportProgress}
                  %
                </>
              )
            : (
                <>
                  <Download size={16} />
                  Export GIF
                </>
              )}
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} border ${borderColor} rounded-xl p-4 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Export as GIF</h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`text-sm ${mutedColor} flex items-center gap-1`}
          >
            <Settings size={14} />
            Settings
          </button>
        </div>

        {/* Preview */}
        {showPreview && frames.length > 0 && (
          <div className={`${inputBg} mb-4 flex items-center justify-center rounded-lg p-4`}>
            <div className="relative">
              <img
                src={frames[currentFrame]?.imageData}
                alt={`Frame ${currentFrame + 1}`}
                className="max-h-40 max-w-full rounded"
              />
              <div className="absolute right-2 bottom-2 left-2 flex justify-center gap-1">
                {frames.slice(0, 10).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFrame(idx)}
                    className={`h-2 w-2 rounded-full ${currentFrame === idx ? 'bg-blue-500' : 'bg-gray-400'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick settings */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className={`text-xs ${mutedColor} mb-1 block`}>Size</label>
            <select
              value={`${settings.width}x${settings.height}`}
              onChange={(e) => {
                const [w, h] = e.target.value.split('x').map(Number);
                updateSettings({ width: w, height: h });
              }}
              className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            >
              {presetSizes.map(size => (
                <option key={size.label} value={`${size.width}x${size.height}`}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`text-xs ${mutedColor} mb-1 block`}>Speed</label>
            <select
              value={settings.frameDelay}
              onChange={e => updateSettings({ frameDelay: Number.parseInt(e.target.value) })}
              className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            >
              <option value={50}>Fast (50ms)</option>
              <option value={100}>Normal (100ms)</option>
              <option value={200}>Slow (200ms)</option>
              <option value={500}>Very slow (500ms)</option>
            </select>
          </div>
        </div>

        {/* Advanced settings */}
        {showAdvanced && (
          <div className={`border-t ${borderColor} mb-4 space-y-3 pt-4`}>
            <div>
              <label className={`text-xs ${mutedColor} mb-1 block`}>
                Quality (
                {settings.quality}
                %)
              </label>
              <input
                type="range"
                min={20}
                max={100}
                value={settings.quality}
                onChange={e => updateSettings({ quality: Number.parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className={`flex items-center gap-2 ${textColor} text-sm`}>
                <input
                  type="checkbox"
                  checked={settings.loop === true}
                  onChange={e => updateSettings({ loop: e.target.checked })}
                  className="rounded"
                />
                Loop forever
              </label>
              <label className={`flex items-center gap-2 ${textColor} text-sm`}>
                <input
                  type="checkbox"
                  checked={settings.optimize}
                  onChange={e => updateSettings({ optimize: e.target.checked })}
                  className="rounded"
                />
                Optimize
              </label>
            </div>
          </div>
        )}

        {/* Info */}
        <div className={`flex items-center justify-between text-xs ${mutedColor} mb-4`}>
          <span>
            {frames.length}
            {' '}
            frames
          </span>
          <span>{formatDuration(frames.length, settings.frameDelay)}</span>
          <span>{formatFileSize(settings.quality, settings.width, settings.height, frames.length)}</span>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={isExporting || frames.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white disabled:opacity-50"
        >
          {isExporting
            ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Exporting...
                  {' '}
                  {exportProgress}
                  %
                </>
              )
            : (
                <>
                  <Download size={18} />
                  Export GIF
                </>
              )}
        </button>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`${bgColor} w-full max-w-lg rounded-2xl shadow-2xl ${className}`}>
        <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
          <h2 className={`text-lg font-semibold ${textColor}`}>Export as GIF</h2>
          <span className={`text-sm ${mutedColor}`}>
            {frames.length}
            {' '}
            frames
          </span>
        </div>

        <div className="p-6">
          {/* Preview */}
          {showPreview && frames.length > 0 && (
            <div className={`${inputBg} mb-6 flex flex-col items-center rounded-xl p-6`}>
              <div className="relative mb-4">
                <img
                  src={frames[currentFrame]?.imageData}
                  alt={`Frame ${currentFrame + 1}`}
                  className="max-h-48 max-w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 ${bgColor} rounded-full shadow`}
                >
                  {isPlaying ? <Pause size={20} className={textColor} /> : <Play size={20} className={textColor} />}
                </button>
                <div className="flex flex-1 gap-1">
                  {frames.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentFrame(idx)}
                      className={`h-1.5 flex-1 rounded-full ${currentFrame === idx ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {showSettings && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Size</label>
                  <select
                    value={`${settings.width}x${settings.height}`}
                    onChange={(e) => {
                      const [w, h] = e.target.value.split('x').map(Number);
                      updateSettings({ width: w, height: h });
                    }}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  >
                    {presetSizes.map(size => (
                      <option key={size.label} value={`${size.width}x${size.height}`}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Frame Delay</label>
                  <select
                    value={settings.frameDelay}
                    onChange={e => updateSettings({ frameDelay: Number.parseInt(e.target.value) })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  >
                    <option value={50}>50ms (Fast)</option>
                    <option value={100}>100ms (Normal)</option>
                    <option value={200}>200ms (Slow)</option>
                    <option value={500}>500ms (Very Slow)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className={`text-sm font-medium ${textColor}`}>Quality</label>
                  <span className={`text-sm ${mutedColor}`}>
                    {settings.quality}
                    %
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={settings.quality}
                  onChange={e => updateSettings({ quality: Number.parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className={`flex items-center gap-2 ${textColor} text-sm`}>
                  <input
                    type="checkbox"
                    checked={settings.loop === true}
                    onChange={e => updateSettings({ loop: e.target.checked })}
                    className="rounded"
                  />
                  <Repeat size={14} />
                  Loop
                </label>
                <label className={`flex items-center gap-2 ${textColor} text-sm`}>
                  <input
                    type="checkbox"
                    checked={settings.optimize}
                    onChange={e => updateSettings({ optimize: e.target.checked })}
                    className="rounded"
                  />
                  <Sliders size={14} />
                  Optimize
                </label>
              </div>

              {/* Estimated file info */}
              <div className={`flex items-center justify-between p-3 ${inputBg} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <Info size={14} className={mutedColor} />
                  <span className={`text-sm ${mutedColor}`}>Estimated size:</span>
                </div>
                <span className={`text-sm font-medium ${textColor}`}>
                  {formatFileSize(settings.quality, settings.width, settings.height, frames.length)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={`border-t p-4 ${borderColor} flex justify-end gap-3`}>
          <button className={`px-4 py-2 ${inputBg} ${textColor} rounded-lg ${hoverBg}`}>
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || frames.length === 0}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 font-medium text-white disabled:opacity-50"
          >
            {isExporting
              ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {exportProgress}
                    %
                  </>
                )
              : (
                  <>
                    <Download size={18} />
                    Export
                  </>
                )}
          </button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Film size={24} className="text-purple-500" />
          <div>
            <h2 className={`text-lg font-semibold ${textColor}`}>GIF Exporter</h2>
            <p className={`text-sm ${mutedColor}`}>
              {frames.length}
              {' '}
              frames •
              {' '}
              {formatDuration(frames.length, settings.frameDelay)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExporting
            ? (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
                  <Loader2 size={16} className="animate-spin text-blue-500" />
                  <span className="text-sm font-medium text-blue-500">
                    {exportProgress}
                    %
                  </span>
                </div>
              )
            : (
                <button
                  onClick={handleExport}
                  disabled={frames.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white disabled:opacity-50"
                >
                  <Download size={16} />
                  Export GIF
                </button>
              )}
        </div>
      </div>

      <div className="flex">
        {/* Preview panel */}
        {showPreview && (
          <div className={`flex-1 border-r p-6 ${borderColor}`}>
            <div className={`${inputBg} flex h-full flex-col rounded-xl`}>
              {/* Preview area */}
              <div className="flex flex-1 items-center justify-center p-8">
                {frames.length > 0
                  ? (
                      <div className="relative">
                        <img
                          src={frames[currentFrame]?.imageData}
                          alt={`Frame ${currentFrame + 1}`}
                          className="max-h-64 max-w-full rounded-lg shadow-xl"
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-blue-500/20" />
                      </div>
                    )
                  : (
                      <div className="text-center">
                        <Image size={48} className={`mx-auto mb-4 ${mutedColor}`} />
                        <p className={mutedColor}>No frames to preview</p>
                      </div>
                    )}
              </div>

              {/* Playback controls */}
              <div className={`border-t p-4 ${borderColor}`}>
                <div className="mb-4 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentFrame(0)}
                    className={`p-2 ${hoverBg} rounded-lg`}
                  >
                    <RefreshCw size={16} className={mutedColor} />
                  </button>
                  <button
                    onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                    className={`p-2 ${hoverBg} rounded-lg`}
                  >
                    <Minimize2 size={16} className={mutedColor} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full bg-blue-500 p-3 text-white"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={() => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1))}
                    className={`p-2 ${hoverBg} rounded-lg`}
                  >
                    <Maximize2 size={16} className={mutedColor} />
                  </button>
                </div>

                {/* Timeline */}
                <div className="flex gap-1">
                  {frames.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentFrame(idx)}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        idx === currentFrame ? 'bg-blue-500' : idx < currentFrame ? 'bg-blue-300' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between">
                  <span className={`text-xs ${mutedColor}`}>
                    Frame
                    {currentFrame + 1}
                  </span>
                  <span className={`text-xs ${mutedColor}`}>
                    {frames.length}
                    {' '}
                    total
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="w-80 space-y-6 p-6">
            {/* Size */}
            <div>
              <label className={`text-sm font-medium ${textColor} mb-2 block`}>Output Size</label>
              <select
                value={`${settings.width}x${settings.height}`}
                onChange={(e) => {
                  const [w, h] = e.target.value.split('x').map(Number);
                  updateSettings({ width: w, height: h });
                }}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              >
                {presetSizes.map(size => (
                  <option key={size.label} value={`${size.width}x${size.height}`}>
                    {size.label}
                    {' '}
                    {size.width > 0 && `(${size.width}×${size.height})`}
                  </option>
                ))}
              </select>

              {/* Custom size */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={settings.width}
                    onChange={e => updateSettings({ width: Number.parseInt(e.target.value) || 480 })}
                    placeholder="Width"
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={settings.height}
                    onChange={e => updateSettings({ height: Number.parseInt(e.target.value) || 320 })}
                    placeholder="Height"
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}
                  />
                </div>
              </div>
            </div>

            {/* Quality */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={`text-sm font-medium ${textColor}`}>Quality</label>
                <span className={`text-sm ${mutedColor}`}>
                  {settings.quality}
                  %
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={settings.quality}
                onChange={e => updateSettings({ quality: Number.parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="mt-1 flex justify-between">
                <span className={`text-xs ${mutedColor}`}>Smaller file</span>
                <span className={`text-xs ${mutedColor}`}>Better quality</span>
              </div>
            </div>

            {/* Frame delay */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className={`text-sm font-medium ${textColor}`}>Frame Delay</label>
                <span className={`text-sm ${mutedColor}`}>
                  {settings.frameDelay}
                  ms
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={settings.frameDelay}
                onChange={e => updateSettings({ frameDelay: Number.parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className={`flex items-center justify-between ${textColor}`}>
                <div className="flex items-center gap-2">
                  <Repeat size={16} className={mutedColor} />
                  <span className="text-sm">Loop animation</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.loop === true}
                  onChange={e => updateSettings({ loop: e.target.checked })}
                  className="rounded"
                />
              </label>
              <label className={`flex items-center justify-between ${textColor}`}>
                <div className="flex items-center gap-2">
                  <Sliders size={16} className={mutedColor} />
                  <span className="text-sm">Optimize file size</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.optimize}
                  onChange={e => updateSettings({ optimize: e.target.checked })}
                  className="rounded"
                />
              </label>
            </div>

            {/* Advanced settings */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex w-full items-center justify-between px-3 py-2 ${inputBg} rounded-lg ${hoverBg}`}
            >
              <span className={`text-sm ${textColor}`}>Advanced Settings</span>
              <ChevronDown size={16} className={`${mutedColor} ${showAdvanced ? 'rotate-180' : ''} transition-transform`} />
            </button>

            {showAdvanced && (
              <div className={`space-y-4 p-4 ${inputBg} rounded-lg`}>
                <div>
                  <label className={`text-sm ${textColor} mb-2 block`}>Dithering</label>
                  <select
                    value={settings.dithering}
                    onChange={e => updateSettings({ dithering: e.target.value as GIFExportSettings['dithering'] })}
                    className={`w-full px-3 py-2 ${bgColor} ${textColor} rounded-lg border ${borderColor} text-sm`}
                  >
                    <option value="none">None</option>
                    <option value="floyd-steinberg">Floyd-Steinberg</option>
                    <option value="ordered">Ordered</option>
                  </select>
                </div>
                <div>
                  <label className={`text-sm ${textColor} mb-2 block`}>Color Depth</label>
                  <select
                    value={settings.colorDepth}
                    onChange={e => updateSettings({ colorDepth: Number.parseInt(e.target.value) as GIFExportSettings['colorDepth'] })}
                    className={`w-full px-3 py-2 ${bgColor} ${textColor} rounded-lg border ${borderColor} text-sm`}
                  >
                    <option value={256}>256 colors (best)</option>
                    <option value={128}>128 colors</option>
                    <option value={64}>64 colors</option>
                    <option value={32}>32 colors</option>
                    <option value={16}>16 colors</option>
                  </select>
                </div>
                <label className={`flex items-center gap-2 ${textColor} text-sm`}>
                  <input
                    type="checkbox"
                    checked={settings.preserveTransparency}
                    onChange={e => updateSettings({ preserveTransparency: e.target.checked })}
                    className="rounded"
                  />
                  Preserve transparency
                </label>
              </div>
            )}

            {/* Estimated info */}
            <div className={`p-4 ${inputBg} space-y-2 rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${mutedColor}`}>Estimated size</span>
                <span className={`text-sm font-medium ${textColor}`}>
                  {formatFileSize(settings.quality, settings.width, settings.height, frames.length)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${mutedColor}`}>Duration</span>
                <span className={`text-sm font-medium ${textColor}`}>
                  {formatDuration(frames.length, settings.frameDelay)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${mutedColor}`}>Dimensions</span>
                <span className={`text-sm font-medium ${textColor}`}>
                  {settings.width}
                  {' '}
                  ×
                  {settings.height}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Frame timeline */}
      <div className={`border-t p-4 ${borderColor}`}>
        <div className="mb-3 flex items-center gap-2">
          <Layers size={16} className={mutedColor} />
          <span className={`text-sm font-medium ${textColor}`}>Frame Timeline</span>
          <span className={`text-xs ${mutedColor}`}>
            (
            {frames.length}
            {' '}
            frames)
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {frames.map((frame, idx) => (
            <button
              key={frame.id}
              onClick={() => {
                setCurrentFrame(idx); setSelectedFrameId(frame.id);
              }}
              className={`relative flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                selectedFrameId === frame.id ? 'border-blue-500' : borderColor
              }`}
            >
              <img
                src={frame.imageData}
                alt={`Frame ${idx + 1}`}
                className="h-12 w-16 object-cover"
              />
              <span className={`absolute right-0 bottom-0 left-0 text-center text-xs ${bgColor} py-0.5`}>
                {idx + 1}
              </span>
              {selectedFrameId === frame.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); onFrameRemove?.(frame.id);
                  }}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white"
                >
                  ×
                </button>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Export progress */}
      {isExporting && (
        <div className={`border-t p-4 ${borderColor} ${inputBg}`}>
          <div className="flex items-center gap-4">
            <Loader2 size={20} className="animate-spin text-blue-500" />
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className={`text-sm ${textColor}`}>Exporting GIF...</span>
                <span className={`text-sm ${mutedColor}`}>
                  {exportProgress}
                  %
                </span>
              </div>
              <div className={`h-2 ${bgColor} overflow-hidden rounded-full`}>
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
