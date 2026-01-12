'use client';

import {
  ChevronDown,
  Download,
  Film,
  Info,
  Layers,
  Loader2,
  Music,
  Pause,
  Play,
  RefreshCw,
  Settings,
  SkipBack,
  SkipForward,
  Video,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type VideoFrame = {
  id: string;
  imageData: string;
  duration: number;
  timestamp: number;
};

export type VideoExportSettings = {
  width: number;
  height: number;
  frameRate: 24 | 30 | 60;
  format: 'mp4' | 'webm' | 'mov';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  codec: 'h264' | 'h265' | 'vp9' | 'vp8';
  bitrate: number;
  includeAudio: boolean;
  audioSource?: string;
  loop: boolean;
  transition: 'none' | 'fade' | 'slide' | 'zoom' | 'dissolve';
  transitionDuration: number;
};

export type VideoExporterProps = {
  frames: VideoFrame[];
  onExport?: (settings: VideoExportSettings) => void;
  onFrameAdd?: (frame: VideoFrame) => void;
  onFrameRemove?: (frameId: string) => void;
  onFrameReorder?: (fromIndex: number, toIndex: number) => void;
  onSettingsChange?: (settings: Partial<VideoExportSettings>) => void;
  defaultSettings?: Partial<VideoExportSettings>;
  isExporting?: boolean;
  exportProgress?: number;
  audioSources?: { id: string; name: string; url: string }[];
  variant?: 'full' | 'compact' | 'modal' | 'inline' | 'minimal';
  showPreview?: boolean;
  showSettings?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function VideoExporter({
  frames,
  onExport,
  onFrameAdd: _onFrameAdd,
  onFrameRemove,
  onFrameReorder: _onFrameReorder,
  onSettingsChange,
  defaultSettings,
  isExporting = false,
  exportProgress = 0,
  audioSources = [],
  variant = 'full',
  showPreview = true,
  showSettings = true,
  darkMode = false,
  className = '',
}: VideoExporterProps) {
  // Reserved for frame management
  void _onFrameAdd;
  void _onFrameReorder;

  const [settings, setSettings] = useState<VideoExportSettings>({
    width: 1920,
    height: 1080,
    frameRate: 30,
    format: 'mp4',
    quality: 'high',
    codec: 'h264',
    bitrate: 8000,
    includeAudio: false,
    loop: false,
    transition: 'none',
    transitionDuration: 500,
    ...defaultSettings,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(80);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const presetSizes = [
    { label: '720p HD', width: 1280, height: 720 },
    { label: '1080p Full HD', width: 1920, height: 1080 },
    { label: '4K UHD', width: 3840, height: 2160 },
    { label: 'Instagram Square', width: 1080, height: 1080 },
    { label: 'Instagram Story', width: 1080, height: 1920 },
    { label: 'Twitter/X', width: 1280, height: 720 },
    { label: 'TikTok', width: 1080, height: 1920 },
    { label: 'YouTube Shorts', width: 1080, height: 1920 },
  ];

  const updateSettings = useCallback((updates: Partial<VideoExportSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onSettingsChange?.(updates);
  }, [settings, onSettingsChange]);

  const handleExport = useCallback(() => {
    onExport?.(settings);
  }, [onExport, settings]);

  const formatFileSize = (quality: string, width: number, height: number, frameCount: number, frameRate: number): string => {
    const qualityMultiplier = { low: 0.5, medium: 1, high: 2, ultra: 4 }[quality] || 1;
    const bytesPerSecond = (width * height * frameRate * qualityMultiplier) / 100;
    const duration = frameCount / frameRate;
    const totalBytes = bytesPerSecond * duration;
    if (totalBytes > 1024 * 1024 * 1024) {
      return `~${(totalBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    if (totalBytes > 1024 * 1024) {
      return `~${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `~${(totalBytes / 1024).toFixed(0)} KB`;
  };

  const formatDuration = (frameCount: number, frameRate: number): string => {
    const seconds = frameCount / frameRate;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Video size={16} className={mutedColor} />
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
          Export Video
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
            <Video size={18} className="text-red-500" />
            <span className={`font-medium ${textColor}`}>Video Export</span>
          </div>
          <span className={`text-sm ${mutedColor}`}>
            {frames.length}
            {' '}
            frames •
            {formatDuration(frames.length, settings.frameRate)}
          </span>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1">
            <label className={`text-xs ${mutedColor} mb-1 block`}>Resolution</label>
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
          <div className="flex-1">
            <label className={`text-xs ${mutedColor} mb-1 block`}>Format</label>
            <select
              value={settings.format}
              onChange={e => updateSettings({ format: e.target.value as VideoExportSettings['format'] })}
              className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            >
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
              <option value="mov">MOV</option>
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
                  Export Video
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
          <h3 className={`font-semibold ${textColor}`}>Export Video</h3>
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
              <div className="absolute right-2 bottom-2 left-2 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <span className="text-xs text-white">
                    {currentFrame + 1}
                    /
                    {frames.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick settings */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className={`text-xs ${mutedColor} mb-1 block`}>Resolution</label>
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
            <label className={`text-xs ${mutedColor} mb-1 block`}>Frame Rate</label>
            <select
              value={settings.frameRate}
              onChange={e => updateSettings({ frameRate: Number.parseInt(e.target.value) as VideoExportSettings['frameRate'] })}
              className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            >
              <option value={24}>24 fps (Cinema)</option>
              <option value={30}>30 fps (Standard)</option>
              <option value={60}>60 fps (Smooth)</option>
            </select>
          </div>
        </div>

        {/* Advanced settings */}
        {showAdvanced && (
          <div className={`border-t ${borderColor} mb-4 space-y-3 pt-4`}>
            <div>
              <label className={`text-xs ${mutedColor} mb-1 block`}>Format</label>
              <select
                value={settings.format}
                onChange={e => updateSettings({ format: e.target.value as VideoExportSettings['format'] })}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
              >
                <option value="mp4">MP4 (Most compatible)</option>
                <option value="webm">WebM (Web optimized)</option>
                <option value="mov">MOV (Apple)</option>
              </select>
            </div>
            <div>
              <label className={`text-xs ${mutedColor} mb-1 block`}>Quality</label>
              <select
                value={settings.quality}
                onChange={e => updateSettings({ quality: e.target.value as VideoExportSettings['quality'] })}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
              >
                <option value="low">Low (Smaller file)</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra (Larger file)</option>
              </select>
            </div>
            <div>
              <label className={`text-xs ${mutedColor} mb-1 block`}>Transition</label>
              <select
                value={settings.transition}
                onChange={e => updateSettings({ transition: e.target.value as VideoExportSettings['transition'] })}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="dissolve">Dissolve</option>
              </select>
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
          <span>{formatDuration(frames.length, settings.frameRate)}</span>
          <span>{formatFileSize(settings.quality, settings.width, settings.height, frames.length, settings.frameRate)}</span>
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
                  Export Video
                </>
              )}
        </button>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`${bgColor} w-full max-w-2xl rounded-2xl shadow-2xl ${className}`}>
        <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Video size={24} className="text-red-500" />
            <h2 className={`text-lg font-semibold ${textColor}`}>Export Video</h2>
          </div>
          <span className={`text-sm ${mutedColor}`}>
            {frames.length}
            {' '}
            frames
          </span>
        </div>

        <div className="p-6">
          {/* Preview */}
          {showPreview && frames.length > 0 && (
            <div className={`${inputBg} mb-6 rounded-xl p-6`}>
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <img
                    src={frames[currentFrame]?.imageData}
                    alt={`Frame ${currentFrame + 1}`}
                    className="max-h-48 max-w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
                  className={`p-2 ${bgColor} rounded-full shadow`}
                >
                  <SkipBack size={16} className={textColor} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full bg-blue-500 p-3 text-white shadow"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1))}
                  className={`p-2 ${bgColor} rounded-full shadow`}
                >
                  <SkipForward size={16} className={textColor} />
                </button>
                <div className="flex flex-1 gap-1">
                  {frames.slice(0, Math.min(frames.length, 20)).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentFrame(idx)}
                      className={`h-1.5 flex-1 rounded-full ${currentFrame === idx ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
                <span className={`text-sm ${mutedColor}`}>
                  {formatDuration(frames.length, settings.frameRate)}
                </span>
              </div>
            </div>
          )}

          {/* Settings */}
          {showSettings && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Resolution</label>
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
                        (
                        {size.width}
                        ×
                        {size.height}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Format</label>
                  <select
                    value={settings.format}
                    onChange={e => updateSettings({ format: e.target.value as VideoExportSettings['format'] })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  >
                    <option value="mp4">MP4 (Most compatible)</option>
                    <option value="webm">WebM (Web optimized)</option>
                    <option value="mov">MOV (Apple/Pro)</option>
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Frame Rate</label>
                  <select
                    value={settings.frameRate}
                    onChange={e => updateSettings({ frameRate: Number.parseInt(e.target.value) as VideoExportSettings['frameRate'] })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  >
                    <option value={24}>24 fps (Cinema)</option>
                    <option value={30}>30 fps (Standard)</option>
                    <option value={60}>60 fps (Smooth)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Quality</label>
                  <select
                    value={settings.quality}
                    onChange={e => updateSettings({ quality: e.target.value as VideoExportSettings['quality'] })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  >
                    <option value="low">Low (Smaller file)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Recommended)</option>
                    <option value="ultra">Ultra (Larger file)</option>
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium ${textColor} mb-2 block`}>Transition</label>
                  <select
                    value={settings.transition}
                    onChange={e => updateSettings({ transition: e.target.value as VideoExportSettings['transition'] })}
                    className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  >
                    <option value="none">None</option>
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                    <option value="dissolve">Dissolve</option>
                  </select>
                </div>

                {/* Audio */}
                {audioSources.length > 0 && (
                  <div>
                    <label className={`text-sm font-medium ${textColor} mb-2 block`}>Background Audio</label>
                    <select
                      value={settings.audioSource || ''}
                      onChange={e => updateSettings({ audioSource: e.target.value, includeAudio: !!e.target.value })}
                      className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                    >
                      <option value="">No audio</option>
                      {audioSources.map(source => (
                        <option key={source.id} value={source.url}>{source.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estimated info */}
          <div className={`mt-6 p-4 ${inputBg} flex items-center justify-between rounded-lg`}>
            <div className="flex items-center gap-2">
              <Info size={16} className={mutedColor} />
              <span className={`text-sm ${mutedColor}`}>Estimated file size:</span>
            </div>
            <span className={`text-sm font-medium ${textColor}`}>
              {formatFileSize(settings.quality, settings.width, settings.height, frames.length, settings.frameRate)}
            </span>
          </div>
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
          <Video size={24} className="text-red-500" />
          <div>
            <h2 className={`text-lg font-semibold ${textColor}`}>Video Exporter</h2>
            <p className={`text-sm ${mutedColor}`}>
              {frames.length}
              {' '}
              frames •
              {' '}
              {formatDuration(frames.length, settings.frameRate)}
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
                  Export Video
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
                        <div className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                          {settings.width}
                          {' '}
                          ×
                          {settings.height}
                        </div>
                      </div>
                    )
                  : (
                      <div className="text-center">
                        <Film size={48} className={`mx-auto mb-4 ${mutedColor}`} />
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
                    <SkipBack size={16} className={mutedColor} />
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
                    <SkipForward size={16} className={mutedColor} />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2 ${hoverBg} rounded-lg`}
                  >
                    {isMuted ? <VolumeX size={16} className={mutedColor} /> : <Volume2 size={16} className={mutedColor} />}
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
                    {formatDuration(currentFrame, settings.frameRate)}
                    {' '}
                    /
                    {' '}
                    {formatDuration(frames.length, settings.frameRate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings panel */}
        {showSettings && (
          <div className="w-80 space-y-6 p-6">
            {/* Resolution */}
            <div>
              <label className={`text-sm font-medium ${textColor} mb-2 block`}>Resolution</label>
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
                    (
                    {size.width}
                    ×
                    {size.height}
                    )
                  </option>
                ))}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className={`text-sm font-medium ${textColor} mb-2 block`}>Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['mp4', 'webm', 'mov'] as const).map(format => (
                  <button
                    key={format}
                    onClick={() => updateSettings({ format })}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      settings.format === format ? 'bg-blue-500 text-white' : `${inputBg} ${textColor} ${hoverBg}`
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame rate */}
            <div>
              <label className={`text-sm font-medium ${textColor} mb-2 block`}>Frame Rate</label>
              <div className="grid grid-cols-3 gap-2">
                {([24, 30, 60] as const).map(fps => (
                  <button
                    key={fps}
                    onClick={() => updateSettings({ frameRate: fps })}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      settings.frameRate === fps ? 'bg-blue-500 text-white' : `${inputBg} ${textColor} ${hoverBg}`
                    }`}
                  >
                    {fps}
                    {' '}
                    fps
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div>
              <label className={`text-sm font-medium ${textColor} mb-2 block`}>Quality</label>
              <select
                value={settings.quality}
                onChange={e => updateSettings({ quality: e.target.value as VideoExportSettings['quality'] })}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              >
                <option value="low">Low (Smaller file)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Recommended)</option>
                <option value="ultra">Ultra (Larger file)</option>
              </select>
            </div>

            {/* Transition */}
            <div>
              <label className={`text-sm font-medium ${textColor} mb-2 block`}>Transition</label>
              <select
                value={settings.transition}
                onChange={e => updateSettings({ transition: e.target.value as VideoExportSettings['transition'] })}
                className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              >
                <option value="none">None</option>
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="dissolve">Dissolve</option>
              </select>
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
                  <label className={`text-sm ${textColor} mb-2 block`}>Codec</label>
                  <select
                    value={settings.codec}
                    onChange={e => updateSettings({ codec: e.target.value as VideoExportSettings['codec'] })}
                    className={`w-full px-3 py-2 ${bgColor} ${textColor} rounded-lg border ${borderColor} text-sm`}
                  >
                    <option value="h264">H.264 (Most compatible)</option>
                    <option value="h265">H.265/HEVC (Better compression)</option>
                    <option value="vp9">VP9 (Web)</option>
                  </select>
                </div>
                <div>
                  <label className={`text-sm ${textColor} mb-2 block`}>Bitrate (kbps)</label>
                  <input
                    type="number"
                    value={settings.bitrate}
                    onChange={e => updateSettings({ bitrate: Number.parseInt(e.target.value) })}
                    className={`w-full px-3 py-2 ${bgColor} ${textColor} rounded-lg border ${borderColor} text-sm`}
                  />
                </div>
                {settings.transition !== 'none' && (
                  <div>
                    <label className={`text-sm ${textColor} mb-2 block`}>Transition Duration (ms)</label>
                    <input
                      type="number"
                      value={settings.transitionDuration}
                      onChange={e => updateSettings({ transitionDuration: Number.parseInt(e.target.value) })}
                      className={`w-full px-3 py-2 ${bgColor} ${textColor} rounded-lg border ${borderColor} text-sm`}
                    />
                  </div>
                )}
                <label className={`flex items-center gap-2 ${textColor} text-sm`}>
                  <input
                    type="checkbox"
                    checked={settings.loop}
                    onChange={e => updateSettings({ loop: e.target.checked })}
                    className="rounded"
                  />
                  Loop video
                </label>
              </div>
            )}

            {/* Audio */}
            {audioSources.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Music size={16} className={mutedColor} />
                  <label className={`text-sm font-medium ${textColor}`}>Background Audio</label>
                </div>
                <select
                  value={settings.audioSource || ''}
                  onChange={e => updateSettings({ audioSource: e.target.value, includeAudio: !!e.target.value })}
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                >
                  <option value="">No audio</option>
                  {audioSources.map(source => (
                    <option key={source.id} value={source.url}>{source.name}</option>
                  ))}
                </select>
                {settings.includeAudio && (
                  <div className="mt-2 flex items-center gap-2">
                    <Volume2 size={14} className={mutedColor} />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={e => setVolume(Number.parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className={`text-xs ${mutedColor} w-8`}>
                      {volume}
                      %
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Estimated info */}
            <div className={`p-4 ${inputBg} space-y-2 rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${mutedColor}`}>Estimated size</span>
                <span className={`text-sm font-medium ${textColor}`}>
                  {formatFileSize(settings.quality, settings.width, settings.height, frames.length, settings.frameRate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${mutedColor}`}>Duration</span>
                <span className={`text-sm font-medium ${textColor}`}>
                  {formatDuration(frames.length, settings.frameRate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${mutedColor}`}>Resolution</span>
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
          <span className={`text-sm font-medium ${textColor}`}>Timeline</span>
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
                className="h-14 w-20 object-cover"
              />
              <span className={`absolute right-0 bottom-0 left-0 text-center text-xs ${bgColor} py-0.5`}>
                {idx + 1}
              </span>
              {selectedFrameId === frame.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); onFrameRemove?.(frame.id);
                  }}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-xs text-white"
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
                <span className={`text-sm ${textColor}`}>Encoding video...</span>
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
