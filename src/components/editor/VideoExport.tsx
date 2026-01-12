'use client';

import type { VideoEncoderSettings } from '@/lib/videoEncoder';
import { useEffect, useState } from 'react';
import {
  downloadVideo,
  encodeVideo,
  estimateVideoSize,
  isVideoEncodingSupported,

} from '@/lib/videoEncoder';

type VideoExportProps = {
  mockupRef: React.RefObject<HTMLDivElement | null>;
  messageCount: number;
};

const defaultSettings: VideoEncoderSettings = {
  animation: 'reveal',
  duration: 5,
  fps: 30,
  resolution: '1080p',
  format: 'webm',
};

export function VideoExport({ mockupRef, messageCount }: VideoExportProps) {
  const [settings, setSettings] = useState<VideoEncoderSettings>(defaultSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isVideoEncodingSupported());
  }, []);

  const handleExport = async () => {
    if (!mockupRef.current) {
      alert('Mockup not ready for export');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setStatusText('Initializing...');
    setPreviewUrl(null);

    try {
      const blob = await encodeVideo(mockupRef.current, settings, {
        onProgress: (p, status) => {
          setProgress(p);
          setStatusText(status);
        },
        onError: (error) => {
          console.error('Video export error:', error);
        },
      });

      // Create preview URL
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Auto-download
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadVideo(blob, `mockup-${timestamp}.${settings.format}`);
    } catch (error) {
      console.error('Video export failed:', error);
      alert('Failed to export video. Please try again.');
    } finally {
      setIsExporting(false);
      setProgress(0);
      setStatusText('');
    }
  };

  const handleClearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  if (!isSupported) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">Video export not supported</span>
        </div>
        <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-500">
          Your browser doesn&apos;t support video recording. Please use Chrome, Firefox, or Edge for video export.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <div className="flex items-center gap-2">
        <svg className="size-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 className="font-medium text-red-700 dark:text-red-400">Video Export (MP4/WebM)</h3>
        <span className="rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-800 dark:text-red-300">
          Pro
        </span>
      </div>

      {/* Animation Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Animation Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: 'reveal', label: 'Message Reveal', desc: 'Messages appear one by one' },
            { value: 'typing', label: 'Typing Effect', desc: 'Simulates typing animation' },
            { value: 'scroll', label: 'Smooth Scroll', desc: 'Scrolls through conversation' },
            { value: 'none', label: 'Static', desc: 'No animation (single frame)' },
          ] as const).map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSettings({ ...settings, animation: option.value })}
              className={`rounded-lg border p-3 text-left transition-all ${
                settings.animation === option.value
                  ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
              }`}
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Duration</span>
          <span className="text-gray-500">
            {settings.duration}
            s
          </span>
        </label>
        <input
          type="range"
          min="3"
          max="30"
          step="1"
          value={settings.duration}
          onChange={e => setSettings({ ...settings, duration: Number(e.target.value) })}
          className="w-full accent-red-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>3s</span>
          <span>30s</span>
        </div>
      </div>

      {/* FPS */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Frame Rate
        </label>
        <div className="flex gap-2">
          {([24, 30, 60] as const).map(fps => (
            <button
              key={fps}
              type="button"
              onClick={() => setSettings({ ...settings, fps })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                settings.fps === fps
                  ? 'border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {fps}
              {' '}
              FPS
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resolution
        </label>
        <div className="flex gap-2">
          {(['720p', '1080p', '4k'] as const).map(res => (
            <button
              key={res}
              type="button"
              onClick={() => setSettings({ ...settings, resolution: res })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm uppercase ${
                settings.resolution === res
                  ? 'border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Format
        </label>
        <div className="flex gap-2">
          {(['webm', 'mp4'] as const).map(format => (
            <button
              key={format}
              type="button"
              onClick={() => setSettings({ ...settings, format })}
              disabled={format === 'mp4'} // MP4 requires additional encoding
              className={`flex-1 rounded-lg border px-3 py-2 text-sm uppercase ${
                settings.format === format
                  ? 'border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {format}
              {format === 'mp4' && <span className="ml-1 text-xs">(soon)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg bg-gray-100 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <p>
          <strong>Messages:</strong>
          {' '}
          {messageCount}
          {' '}
          |
          {' '}
          <strong>Est. Size:</strong>
          {' '}
          {estimateVideoSize(settings)}
          {' '}
          |
          {' '}
          <strong>Frames:</strong>
          {' '}
          {settings.duration * settings.fps}
        </p>
      </div>

      {/* Export Button */}
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isExporting
          ? (
              <>
                <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>
                  Exporting...
                  {progress}
                  %
                </span>
              </>
            )
          : (
              <>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export as Video</span>
              </>
            )}
      </button>

      {/* Progress Bar with Status */}
      {isExporting && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {statusText && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {statusText}
            </p>
          )}
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </span>
            <button
              type="button"
              onClick={handleClearPreview}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-black dark:border-gray-700">
            <video
              src={previewUrl}
              controls
              autoPlay
              loop
              muted
              className="mx-auto max-h-64 w-auto"
            />
          </div>
          <p className="text-center text-xs text-green-600 dark:text-green-400">
            Video exported successfully! Check your downloads folder.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
        <p className="font-medium">Tips:</p>
        <ul className="mt-1 list-inside list-disc space-y-1 text-blue-600 dark:text-blue-500">
          <li>Lower resolution exports faster</li>
          <li>30 FPS is recommended for social media</li>
          <li>WebM files can be converted to MP4 using free tools</li>
        </ul>
      </div>
    </div>
  );
}
