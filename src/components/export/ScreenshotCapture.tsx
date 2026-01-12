'use client';

import { useCallback, useState } from 'react';

type CaptureFormat = 'png' | 'jpeg' | 'webp';
type CaptureMode = 'full' | 'selection' | 'visible';

type CaptureSettings = {
  format: CaptureFormat;
  quality: number;
  scale: number;
  includeBackground: boolean;
  padding: number;
  borderRadius: number;
  shadow: boolean;
};

type ScreenshotCaptureProps = {
  targetRef: React.RefObject<HTMLElement>;
  onCapture?: (dataUrl: string, blob: Blob) => void;
  defaultSettings?: Partial<CaptureSettings>;
  className?: string;
};

const defaultCaptureSettings: CaptureSettings = {
  format: 'png',
  quality: 1,
  scale: 2,
  includeBackground: true,
  padding: 0,
  borderRadius: 0,
  shadow: false,
};

export function ScreenshotCapture({
  targetRef,
  onCapture,
  defaultSettings,
  className = '',
}: ScreenshotCaptureProps) {
  const [settings, setSettings] = useState<CaptureSettings>({
    ...defaultCaptureSettings,
    ...defaultSettings,
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const captureScreenshot = useCallback(async () => {
    if (!targetRef.current) {
      return;
    }

    setIsCapturing(true);

    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(targetRef.current, {
        scale: settings.scale,
        backgroundColor: settings.includeBackground ? null : 'transparent',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Apply post-processing if needed
      let finalCanvas = canvas;

      if (settings.padding > 0 || settings.borderRadius > 0 || settings.shadow) {
        finalCanvas = applyEffects(canvas, settings);
      }

      // Convert to desired format
      const mimeType = `image/${settings.format}`;
      const quality = settings.format === 'png' ? 1 : settings.quality;
      const dataUrl = finalCanvas.toDataURL(mimeType, quality);

      // Convert to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      setPreviewUrl(dataUrl);
      onCapture?.(dataUrl, blob);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [targetRef, settings, onCapture]);

  const applyEffects = (sourceCanvas: HTMLCanvasElement, settings: CaptureSettings): HTMLCanvasElement => {
    const { padding, borderRadius, shadow } = settings;

    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    if (!ctx) {
      return sourceCanvas;
    }

    const shadowOffset = shadow ? 20 : 0;
    const shadowBlur = shadow ? 40 : 0;

    newCanvas.width = sourceCanvas.width + padding * 2 + shadowOffset;
    newCanvas.height = sourceCanvas.height + padding * 2 + shadowOffset;

    // Draw shadow
    if (shadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffset / 2;
      ctx.shadowOffsetY = shadowOffset / 2;
    }

    // Draw rounded rectangle background
    if (borderRadius > 0) {
      ctx.beginPath();
      roundRect(ctx, padding, padding, sourceCanvas.width, sourceCanvas.height, borderRadius);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.clip();
    }

    // Draw the source canvas
    ctx.drawImage(sourceCanvas, padding, padding);

    return newCanvas;
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  };

  const downloadScreenshot = () => {
    if (!previewUrl) {
      return;
    }

    const link = document.createElement('a');
    link.download = `screenshot-${Date.now()}.${settings.format}`;
    link.href = previewUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!previewUrl) {
      return;
    }

    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Screenshot Capture</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          {/* Format */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
            <div className="flex gap-2">
              {(['png', 'jpeg', 'webp'] as CaptureFormat[]).map(format => (
                <button
                  key={format}
                  onClick={() => setSettings({ ...settings, format })}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium uppercase transition-colors ${
                    settings.format === format
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Quality (for JPEG/WebP) */}
          {settings.format !== 'png' && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality</label>
                <span className="text-sm text-gray-500">
                  {Math.round(settings.quality * 100)}
                  %
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.quality}
                onChange={e => setSettings({ ...settings, quality: Number.parseFloat(e.target.value) })}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
              />
            </div>
          )}

          {/* Scale */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Scale</label>
              <span className="text-sm text-gray-500">
                {settings.scale}
                x
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={settings.scale}
              onChange={e => setSettings({ ...settings, scale: Number.parseFloat(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
            />
          </div>

          {/* Padding */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Padding</label>
              <span className="text-sm text-gray-500">
                {settings.padding}
                px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={settings.padding}
              onChange={e => setSettings({ ...settings, padding: Number.parseInt(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
            />
          </div>

          {/* Border Radius */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Border Radius</label>
              <span className="text-sm text-gray-500">
                {settings.borderRadius}
                px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              step="4"
              value={settings.borderRadius}
              onChange={e => setSettings({ ...settings, borderRadius: Number.parseInt(e.target.value) })}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-600"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={settings.shadow}
                onChange={e => setSettings({ ...settings, shadow: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Shadow</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeBackground}
                onChange={e => setSettings({ ...settings, includeBackground: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Include Background</span>
            </label>
          </div>
        </div>
      )}

      {/* Capture Button */}
      <button
        onClick={captureScreenshot}
        disabled={isCapturing}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isCapturing
          ? (
              <>
                <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Capturing...
              </>
            )
          : (
              <>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capture Screenshot
              </>
            )}
      </button>

      {/* Preview */}
      {previewUrl && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</span>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Copy to clipboard"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={downloadScreenshot}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Download"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
            <img
              src={previewUrl}
              alt="Screenshot preview"
              className="max-h-48 w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Quick capture button for toolbar
type QuickCaptureButtonProps = {
  targetRef: React.RefObject<HTMLElement>;
  onCapture?: (dataUrl: string, blob: Blob) => void;
  className?: string;
};

export function QuickCaptureButton({ targetRef, onCapture, className = '' }: QuickCaptureButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    if (!targetRef.current) {
      return;
    }

    setIsCapturing(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      onCapture?.(dataUrl, blob);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      onClick={handleCapture}
      disabled={isCapturing}
      className={`rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700 ${className}`}
      title="Take screenshot"
    >
      {isCapturing
        ? (
            <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )
        : (
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
    </button>
  );
}

export type { CaptureFormat, CaptureMode, CaptureSettings };
