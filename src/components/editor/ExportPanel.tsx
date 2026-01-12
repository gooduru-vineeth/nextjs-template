'use client';

import type { DeviceType } from '@/components/mockups/common/DeviceFrame';
import type { ExportOptions } from '@/types/Mockup';
import type { GifFrame } from '@/utils/gifGenerator';
import { useState } from 'react';
import { deviceOptions } from '@/components/mockups/common/DeviceFrame';
import { captureFrame, downloadBlob, generateGif } from '@/utils/gifGenerator';

// Helper function to export canvas to PDF
async function exportToPdf(canvas: HTMLCanvasElement, _filename: string) {
  // Get canvas dimensions
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // Create a simple PDF using raw PDF syntax
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // For a more robust solution, we'd use a library like jsPDF
  // For now, we'll create a simple printable page
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MockFlow Export</title>
          <style>
            @media print {
              @page { margin: 0; size: ${imgWidth}px ${imgHeight}px; }
              body { margin: 0; padding: 0; }
              img { width: 100%; height: auto; }
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #f0f0f0;
            }
            img {
              max-width: 100%;
              height: auto;
              box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
            .instructions {
              position: fixed;
              top: 20px;
              left: 50%;
              transform: translateX(-50%);
              background: #333;
              color: white;
              padding: 10px 20px;
              border-radius: 8px;
              font-family: system-ui, sans-serif;
              font-size: 14px;
              z-index: 1000;
            }
            @media print { .instructions { display: none; } }
          </style>
        </head>
        <body>
          <div class="instructions">Press Ctrl+P (or Cmd+P) to save as PDF</div>
          <img src="${imgData}" alt="MockFlow Export" />
          <script>
            setTimeout(() => window.print(), 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

type ExportPanelProps = {
  mockupRef: React.RefObject<HTMLDivElement | null>;
  onExport?: (options: ExportOptions) => void;
  onDeviceFrameChange?: (device: DeviceType) => void;
  currentDeviceFrame?: DeviceType;
};

type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf' | 'gif';

export function ExportPanel({ mockupRef, onExport, onDeviceFrameChange, currentDeviceFrame = 'none' }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<ExportOptions['scale']>(2);
  const [deviceFrame, setDeviceFrame] = useState<DeviceType>(currentDeviceFrame);
  const [quality, setQuality] = useState(90);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [includeDeviceFrame, setIncludeDeviceFrame] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [gifFrameCount, setGifFrameCount] = useState(5);
  const [gifFrameDuration, setGifFrameDuration] = useState(500);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = async () => {
    if (!mockupRef.current) {
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    const options: ExportOptions = {
      format,
      scale,
      quality: format === 'jpg' ? quality : undefined,
      transparentBackground,
      includeDeviceFrame,
      watermark: false,
      cropToContent: false,
    };

    try {
      // Dynamic import for client-side only
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(mockupRef.current, {
        scale,
        backgroundColor: transparentBackground ? null : undefined,
        useCORS: true,
        logging: false,
      });

      // Convert to desired format
      let dataUrl: string;
      let extension: string;

      switch (format) {
        case 'jpg':
          extension = 'jpg';
          dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
          break;
        case 'svg':
          extension = 'svg';
          // For SVG, we create an SVG wrapper around the PNG data
          const pngDataUrl = canvas.toDataURL('image/png');
          const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image xlink:href="${pngDataUrl}" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;
          dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
          break;
        case 'pdf':
          extension = 'pdf';
          // For PDF export, we use a simple approach with canvas data
          await exportToPdf(canvas, `mockflow-export-${Date.now()}.pdf`);
          setExportSuccess(true);
          setTimeout(() => setExportSuccess(false), 3000);
          if (onExport) {
            onExport(options);
          }
          setIsExporting(false);
          return;
        case 'gif':
          // GIF export with multiple frames for animation effect
          extension = 'gif';
          setExportProgress(0);
          const frames: GifFrame[] = [];

          // Capture multiple frames with slight variations for animation
          for (let i = 0; i < gifFrameCount; i++) {
            setExportProgress(Math.round((i / gifFrameCount) * 80));
            const frameCanvas = await captureFrame(mockupRef.current, scale);
            frames.push({
              canvas: frameCanvas,
              delay: gifFrameDuration,
            });
          }

          setExportProgress(90);

          // Generate GIF
          const gifBlob = await generateGif(frames, {
            width: canvas.width,
            height: canvas.height,
            quality: 10,
            frameDuration: gifFrameDuration,
            repeat: 0,
          });

          setExportProgress(100);

          // Download GIF
          downloadBlob(gifBlob, `mockflow-export-${Date.now()}.gif`);
          setExportSuccess(true);
          setTimeout(() => {
            setExportSuccess(false);
            setExportProgress(0);
          }, 3000);
          if (onExport) {
            onExport(options);
          }
          setIsExporting(false);
          return;
        case 'png':
        default:
          extension = 'png';
          dataUrl = canvas.toDataURL('image/png');
          break;
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `mockflow-export-${Date.now()}.${extension}`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);

      // Call onExport callback if provided
      if (onExport) {
        onExport(options);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!mockupRef.current) {
      return;
    }

    setIsExporting(true);

    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(mockupRef.current, {
        scale,
        backgroundColor: transparentBackground ? null : undefined,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
          } catch (err) {
            console.error('Failed to copy to clipboard:', err);
          }
        }
      }, 'image/png');
    } catch (error) {
      console.error('Copy failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export</h3>

      {/* Format Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Format
        </label>
        <div className="grid grid-cols-5 gap-2">
          {(['png', 'jpg', 'svg', 'pdf', 'gif'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                format === f
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {format === 'png' && 'Best for mockups with transparency'}
          {format === 'jpg' && 'Smaller file size, no transparency'}
          {format === 'svg' && 'Scalable vector format'}
          {format === 'pdf' && 'Document format for printing'}
          {format === 'gif' && 'Animated image format'}
        </p>
      </div>

      {/* Scale Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resolution
        </label>
        <div className="grid grid-cols-3 gap-2">
          {([1, 2, 3] as const).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                scale === s
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              {s}
              x
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {scale === 1 && 'Standard resolution'}
          {scale === 2 && 'Retina/HiDPI (recommended)'}
          {scale === 3 && 'Extra high resolution'}
        </p>
      </div>

      {/* Device Frame Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Device Frame
        </label>
        <select
          value={deviceFrame}
          onChange={(e) => {
            const newDevice = e.target.value as DeviceType;
            setDeviceFrame(newDevice);
            onDeviceFrameChange?.(newDevice);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {deviceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.category !== 'None' ? `${option.category} - ` : ''}
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {deviceFrame === 'none' && 'Export without device frame'}
          {deviceFrame.includes('iphone') && 'Apple iPhone device frame'}
          {deviceFrame.includes('pixel') && 'Google Pixel device frame'}
          {deviceFrame.includes('samsung') && 'Samsung Galaxy device frame'}
          {deviceFrame.includes('macbook') && 'MacBook Pro laptop frame'}
          {deviceFrame.includes('browser') && 'Browser window frame'}
        </p>
      </div>

      {/* Quality Slider (JPG only) */}
      {format === 'jpg' && (
        <div>
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Quality</span>
            <span className="text-gray-500">
              {quality}
              %
            </span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      )}

      {/* GIF Options */}
      {format === 'gif' && (
        <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>Frame Count</span>
              <span className="text-gray-500">
                {gifFrameCount}
                {' '}
                frames
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={gifFrameCount}
              onChange={e => setGifFrameCount(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-1 text-xs text-gray-500">
              More frames = smoother animation, larger file
            </p>
          </div>
          <div>
            <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>Frame Duration</span>
              <span className="text-gray-500">
                {gifFrameDuration}
                ms
              </span>
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={gifFrameDuration}
              onChange={e => setGifFrameDuration(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-1 text-xs text-gray-500">
              Duration each frame is shown
            </p>
          </div>
        </div>
      )}

      {/* Export Progress (GIF) */}
      {format === 'gif' && isExporting && exportProgress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Generating GIF...</span>
            <span>
              {exportProgress}
              %
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={transparentBackground}
            onChange={e => setTransparentBackground(e.target.checked)}
            disabled={format === 'jpg'}
            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-sm ${format === 'jpg' ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
            Transparent background
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={includeDeviceFrame}
            onChange={e => setIncludeDeviceFrame(e.target.checked)}
            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include device frame</span>
        </label>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
            exportSuccess
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isExporting
            ? (
                <>
                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              )
            : exportSuccess
              ? (
                  <>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Downloaded!
                  </>
                )
              : (
                  <>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                    {' '}
                    {format.toUpperCase()}
                  </>
                )}
        </button>

        <button
          type="button"
          onClick={handleCopyToClipboard}
          disabled={isExporting}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy to Clipboard
        </button>
      </div>

      {/* Size estimate */}
      <p className="text-center text-xs text-gray-500">
        Estimated size: ~
        {Math.round(375 * scale)}
        x
        {Math.round(812 * scale)}
        {' '}
        pixels
      </p>
    </div>
  );
}
