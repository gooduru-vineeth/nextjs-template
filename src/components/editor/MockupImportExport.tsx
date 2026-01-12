'use client';

import { useRef, useState } from 'react';

type MockupImportExportProps<T, A> = {
  mockupData: T;
  appearanceData: A;
  mockupType: 'chat' | 'ai' | 'social';
  platform: string;
  mockupName?: string;
  onImport: (data: T, appearance: A) => void;
};

type ExportedMockup<T, A> = {
  version: string;
  exportedAt: string;
  mockupType: 'chat' | 'ai' | 'social';
  platform: string;
  name?: string;
  data: T;
  appearance: A;
};

export function MockupImportExport<T, A>({
  mockupData,
  appearanceData,
  mockupType,
  platform,
  mockupName,
  onImport,
}: MockupImportExportProps<T, A>) {
  const [isOpen, setIsOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const exportData: ExportedMockup<T, A> = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      mockupType,
      platform,
      name: mockupName,
      data: mockupData,
      appearance: appearanceData,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `mockflow-${mockupType}-${platform}-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setImportError(null);

    try {
      const text = await file.text();
      const imported = JSON.parse(text) as ExportedMockup<T, A>;

      // Validate the imported data
      if (!imported.version) {
        throw new Error('Invalid mockup file: missing version');
      }

      if (!imported.data) {
        throw new Error('Invalid mockup file: missing data');
      }

      if (imported.mockupType !== mockupType) {
        throw new Error(`This file contains a ${imported.mockupType} mockup, but you're in the ${mockupType} editor. Please use the correct editor.`);
      }

      // Import the data
      onImport(imported.data, imported.appearance);
      setIsOpen(false);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to import mockup');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyToClipboard = async () => {
    const exportData: ExportedMockup<T, A> = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      mockupType,
      platform,
      name: mockupName,
      data: mockupData,
      appearance: appearanceData,
    };

    const json = JSON.stringify(exportData, null, 2);

    try {
      await navigator.clipboard.writeText(json);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        title="Import/Export mockup"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        Import/Export
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="p-4">
            <h3 className="mb-3 font-medium text-gray-900 dark:text-white">Import / Export Mockup</h3>

            {/* Export Section */}
            <div className="mb-4 space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Export your mockup as JSON to save or share
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    exportSuccess
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {exportSuccess
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
                          Export JSON
                        </>
                      )}
                </button>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="Copy JSON to clipboard"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-gray-200 dark:border-gray-600" />

            {/* Import Section */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Import a previously exported mockup
              </p>
              <button
                type="button"
                onClick={handleImportClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-3 py-3 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 dark:border-gray-600 dark:text-gray-400"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Choose JSON File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Import Error */}
              {importError && (
                <div className="rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {importError}
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="mt-4 rounded-lg bg-yellow-50 p-2 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-500">
              <strong>Note:</strong>
              {' '}
              Importing will replace your current mockup data
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
