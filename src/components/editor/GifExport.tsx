'use client';

import type { GifEncoderSettings } from '@/lib/gifEncoder';
import { useState } from 'react';
import { downloadBlob, encodeGif, estimateGifSize } from '@/lib/gifEncoder';

type GifExportProps = {
  mockupRef: React.RefObject<HTMLDivElement | null>;
  messageCount: number;
};

type GifSettings = GifEncoderSettings;

const defaultSettings: GifSettings = {
  animation: 'reveal',
  frameDuration: 500,
  quality: 'medium',
  width: 400,
  loop: true,
};

export function GifExport({ mockupRef, messageCount }: GifExportProps) {
  const [settings, setSettings] = useState<GifSettings>(defaultSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const estimateSize = () => {
    return estimateGifSize(messageCount, settings);
  };

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
      const blob = await encodeGif(mockupRef.current, settings, {
        onProgress: (p, status) => {
          setProgress(p);
          setStatusText(status);
        },
        onError: (error) => {
          console.error('GIF export error:', error);
        },
      });

      // Create preview URL
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Auto-download
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `mockup-${timestamp}.gif`);
    } catch (error) {
      console.error('GIF export failed:', error);
      alert('Failed to export GIF. Please try again.');
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

  return (
    <div className="space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
      <div className="flex items-center gap-2">
        <svg className="size-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 className="font-medium text-purple-700 dark:text-purple-400">Animated GIF Export</h3>
        <span className="rounded-full bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-800 dark:text-purple-300">
          Beta
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
            { value: 'scroll', label: 'Scroll Up', desc: 'Messages scroll into view' },
            { value: 'none', label: 'Static', desc: 'No animation (single frame)' },
          ] as const).map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSettings({ ...settings, animation: option.value })}
              className={`rounded-lg border p-3 text-left transition-all ${
                settings.animation === option.value
                  ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
              }`}
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{option.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Duration */}
      {settings.animation !== 'none' && (
        <div>
          <label className="mb-2 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Frame Duration</span>
            <span className="text-gray-500">
              {settings.frameDuration}
              ms
            </span>
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={settings.frameDuration}
            onChange={e => setSettings({ ...settings, frameDuration: Number(e.target.value) })}
            className="w-full accent-purple-600"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>
      )}

      {/* Quality */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quality
        </label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map(q => (
            <button
              key={q}
              type="button"
              onClick={() => setSettings({ ...settings, quality: q })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${
                settings.quality === q
                  ? 'border-purple-500 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Width */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Width
        </label>
        <select
          value={settings.width}
          onChange={e => setSettings({ ...settings, width: Number(e.target.value) })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
        >
          <option value={320}>320px (Small)</option>
          <option value={400}>400px (Medium)</option>
          <option value={600}>600px (Large)</option>
          <option value={800}>800px (Full)</option>
        </select>
      </div>

      {/* Loop Toggle */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.loop}
          onChange={e => setSettings({ ...settings, loop: e.target.checked })}
          className="size-4 rounded border-gray-300 text-purple-600"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Loop animation</span>
      </label>

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
          {estimateSize()}
        </p>
      </div>

      {/* Export Button */}
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                <span>Export as GIF</span>
              </>
            )}
      </button>

      {/* Progress Bar with Status */}
      {isExporting && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
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
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <img
              src={previewUrl}
              alt="GIF Preview"
              className="mx-auto max-h-64 w-auto"
            />
          </div>
          <p className="text-center text-xs text-green-600 dark:text-green-400">
            GIF exported successfully! Check your downloads folder.
          </p>
        </div>
      )}
    </div>
  );
}
