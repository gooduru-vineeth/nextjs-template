'use client';

import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { useCallback, useState } from 'react';

export type MockupItem = {
  id: string;
  name: string;
  element: HTMLElement | null;
  selected: boolean;
};

type BatchExportProps = {
  mockups: MockupItem[];
  onSelectionChange: (id: string, selected: boolean) => void;
};

type ExportSettings = {
  format: 'png' | 'jpeg' | 'webp';
  quality: number; // 0.1 to 1
  scale: number; // 1, 2, or 3
  includeTimestamp: boolean;
  namingPattern: 'numbered' | 'name' | 'name-timestamp';
};

const defaultSettings: ExportSettings = {
  format: 'png',
  quality: 0.92,
  scale: 2,
  includeTimestamp: false,
  namingPattern: 'name',
};

export function BatchExport({ mockups, onSelectionChange }: BatchExportProps) {
  const [settings, setSettings] = useState<ExportSettings>(defaultSettings);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState('');

  const selectedCount = mockups.filter(m => m.selected).length;

  const handleSelectAll = useCallback(() => {
    const allSelected = mockups.every(m => m.selected);
    mockups.forEach(m => onSelectionChange(m.id, !allSelected));
  }, [mockups, onSelectionChange]);

  const generateFilename = (mockup: MockupItem, index: number): string => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const ext = settings.format;

    switch (settings.namingPattern) {
      case 'numbered':
        return `mockup-${String(index + 1).padStart(3, '0')}.${ext}`;
      case 'name-timestamp':
        return `${mockup.name}-${timestamp}.${ext}`;
      case 'name':
      default:
        return `${mockup.name}.${ext}`;
    }
  };

  const captureElement = async (element: HTMLElement): Promise<Blob> => {
    const canvas = await html2canvas(element, {
      scale: settings.scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    return new Promise((resolve, reject) => {
      const mimeType = `image/${settings.format}`;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        mimeType,
        settings.quality,
      );
    });
  };

  const handleExport = async () => {
    const selectedMockups = mockups.filter(m => m.selected && m.element);

    if (selectedMockups.length === 0) {
      alert('Please select at least one mockup to export');
      return;
    }

    setIsExporting(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder('mockups');

      if (!folder) {
        throw new Error('Failed to create zip folder');
      }

      for (let i = 0; i < selectedMockups.length; i++) {
        const mockup = selectedMockups[i]!;
        setCurrentItem(mockup.name);
        setProgress(Math.round(((i + 0.5) / selectedMockups.length) * 80));

        if (!mockup.element) {
          continue;
        }

        try {
          const blob = await captureElement(mockup.element);
          const filename = generateFilename(mockup, i);
          folder.file(filename, blob);
        } catch (err) {
          console.error(`Failed to capture ${mockup.name}:`, err);
        }

        setProgress(Math.round(((i + 1) / selectedMockups.length) * 80));
      }

      setCurrentItem('Creating ZIP file...');
      setProgress(85);

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      }, (metadata) => {
        setProgress(85 + Math.round(metadata.percent * 0.15));
      });

      // Download the zip
      const timestamp = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mockups-${timestamp}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setCurrentItem('Complete!');
    } catch (error) {
      console.error('Batch export failed:', error);
      alert('Failed to export mockups. Please try again.');
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setProgress(0);
        setCurrentItem('');
      }, 1000);
    }
  };

  const estimateSize = (): string => {
    // Rough estimate: ~200KB per mockup at 2x scale PNG
    const baseSize = settings.format === 'png' ? 200 : settings.format === 'jpeg' ? 100 : 80;
    const scaleMultiplier = settings.scale;
    const qualityMultiplier = settings.format === 'png' ? 1 : settings.quality;
    const estimated = selectedCount * baseSize * scaleMultiplier * qualityMultiplier;

    if (estimated >= 1024) {
      return `~${(estimated / 1024).toFixed(1)} MB`;
    }
    return `~${Math.round(estimated)} KB`;
  };

  return (
    <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg className="size-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <h3 className="font-medium text-blue-700 dark:text-blue-400">Batch Export</h3>
      </div>

      {/* Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCount}
            {' '}
            of
            {mockups.length}
            {' '}
            selected
          </span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {mockups.every(m => m.selected) ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="max-h-32 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
          {mockups.map(mockup => (
            <label
              key={mockup.id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={mockup.selected}
                onChange={e => onSelectionChange(mockup.id, e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600"
              />
              <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                {mockup.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Format
        </label>
        <div className="flex gap-2">
          {(['png', 'jpeg', 'webp'] as const).map(format => (
            <button
              key={format}
              type="button"
              onClick={() => setSettings({ ...settings, format })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm uppercase ${
                settings.format === format
                  ? 'border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
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
          <label className="mb-2 flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Quality</span>
            <span className="text-gray-500">
              {Math.round(settings.quality * 100)}
              %
            </span>
          </label>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={settings.quality}
            onChange={e => setSettings({ ...settings, quality: Number(e.target.value) })}
            className="w-full accent-blue-600"
          />
        </div>
      )}

      {/* Scale */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Resolution
        </label>
        <div className="flex gap-2">
          {([1, 2, 3] as const).map(scale => (
            <button
              key={scale}
              type="button"
              onClick={() => setSettings({ ...settings, scale })}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                settings.scale === scale
                  ? 'border-blue-500 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
              }`}
            >
              {scale}
              x
            </button>
          ))}
        </div>
      </div>

      {/* Naming Pattern */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          File Naming
        </label>
        <select
          value={settings.namingPattern}
          onChange={e => setSettings({ ...settings, namingPattern: e.target.value as ExportSettings['namingPattern'] })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="name">By Name (chat-mockup.png)</option>
          <option value="numbered">Numbered (mockup-001.png)</option>
          <option value="name-timestamp">Name + Timestamp</option>
        </select>
      </div>

      {/* Info */}
      <div className="rounded-lg bg-gray-100 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <p>
          <strong>Selected:</strong>
          {' '}
          {selectedCount}
          {' '}
          mockups |
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
        disabled={isExporting || selectedCount === 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>
                  Export
                  {selectedCount}
                  {' '}
                  Mockup
                  {selectedCount !== 1 ? 's' : ''}
                  {' '}
                  as ZIP
                </span>
              </>
            )}
      </button>

      {/* Progress */}
      {isExporting && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {currentItem && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              {currentItem}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
