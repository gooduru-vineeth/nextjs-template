'use client';

import { AlertCircle, Check, Eye, Trash2, Type, Upload, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

export type CustomFont = {
  id: string;
  name: string;
  family: string;
  style: string;
  weight: number;
  format: string;
  size: number;
  uploadedAt: Date;
  previewUrl?: string;
};

export type FontUploaderProps = {
  variant?: 'full' | 'compact' | 'modal' | 'inline';
  fonts?: CustomFont[];
  onFontUpload?: (font: CustomFont) => void;
  onFontDelete?: (fontId: string) => void;
  onFontSelect?: (font: CustomFont) => void;
  selectedFontId?: string;
  maxFileSize?: number; // in bytes
  allowedFormats?: string[];
  maxFonts?: number;
  className?: string;
};

const defaultFormats = ['.ttf', '.otf', '.woff', '.woff2'];

const FontUploader: React.FC<FontUploaderProps> = ({
  variant = 'full',
  fonts = [],
  onFontUpload,
  onFontDelete,
  onFontSelect,
  selectedFontId,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  allowedFormats = defaultFormats,
  maxFonts = 20,
  className = '',
}) => {
  const [uploadedFonts, setUploadedFonts] = useState<CustomFont[]>(fonts);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFont, setPreviewFont] = useState<CustomFont | null>(null);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFormatFromFile = (filename: string): string => {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    const formatMap: Record<string, string> = {
      '.ttf': 'truetype',
      '.otf': 'opentype',
      '.woff': 'woff',
      '.woff2': 'woff2',
    };
    return formatMap[ext] || 'unknown';
  };

  const validateFile = useCallback((file: File): string | null => {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedFormats.includes(ext)) {
      return `Invalid format. Allowed: ${allowedFormats.join(', ')}`;
    }

    if (file.size > maxFileSize) {
      return `File too large. Max size: ${formatFileSize(maxFileSize)}`;
    }

    if (uploadedFonts.length >= maxFonts) {
      return `Maximum ${maxFonts} fonts allowed`;
    }

    return null;
  }, [allowedFormats, maxFileSize, maxFonts, uploadedFonts.length]);

  const processFont = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const fontName = file.name.replace(/\.[^.]+$/, '');
    const fontFamily = fontName.replace(/[-_]/g, ' ');

    const newFont: CustomFont = {
      id: `font-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: fontName,
      family: fontFamily,
      style: 'normal',
      weight: 400,
      format: getFormatFromFile(file.name),
      size: file.size,
      uploadedAt: new Date(),
      previewUrl: URL.createObjectURL(file),
    };

    // Load font into document
    try {
      const fontFace = new FontFace(fontFamily, `url(${newFont.previewUrl})`);
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch {
      // Font loading failed, but we can still add it
      console.warn('Font loading failed, but continuing...');
    }

    setUploadedFonts(prev => [...prev, newFont]);
    onFontUpload?.(newFont);
  }, [validateFile, onFontUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(processFont);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFont]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    Array.from(files).forEach(processFont);
  }, [processFont]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDelete = useCallback((fontId: string) => {
    const font = uploadedFonts.find(f => f.id === fontId);
    if (font?.previewUrl) {
      URL.revokeObjectURL(font.previewUrl);
    }
    setUploadedFonts(prev => prev.filter(f => f.id !== fontId));
    onFontDelete?.(fontId);
  }, [uploadedFonts, onFontDelete]);

  const handleSelect = useCallback((font: CustomFont) => {
    onFontSelect?.(font);
  }, [onFontSelect]);

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Upload size={14} />
          <span>Upload Font</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        {uploadedFonts.length > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {uploadedFonts.length}
            {' '}
            font
            {uploadedFonts.length !== 1 ? 's' : ''}
            {' '}
            uploaded
          </span>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {uploadedFonts.map(font => (
          <button
            key={font.id}
            onClick={() => handleSelect(font)}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1 text-sm transition-all ${
              selectedFontId === font.id
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            style={{ fontFamily: font.family }}
          >
            <Type size={12} />
            <span>{font.name}</span>
          </button>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
        >
          <Upload size={12} />
          <span>Add</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
      </div>
    );
  }

  // Modal variant - just the content, wrapping modal is external
  if (variant === 'modal') {
    return (
      <div className={`p-4 ${className}`}>
        {/* Upload area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
        >
          <Upload size={40} className="mx-auto mb-3 text-gray-400" />
          <div className="mb-1 text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragging ? 'Drop fonts here' : 'Upload Custom Fonts'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Drag & drop or click to browse
          </div>
          <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Supported:
            {' '}
            {allowedFormats.join(', ')}
            {' '}
            • Max:
            {' '}
            {formatFileSize(maxFileSize)}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Uploaded fonts list */}
        {uploadedFonts.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Fonts (
              {uploadedFonts.length}
              /
              {maxFonts}
              )
            </div>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {uploadedFonts.map(font => (
                <div
                  key={font.id}
                  className={`flex items-center justify-between rounded-lg border p-2 transition-all ${
                    selectedFontId === font.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                  }`}
                >
                  <div
                    className="flex flex-1 cursor-pointer items-center gap-2"
                    onClick={() => handleSelect(font)}
                  >
                    <Type size={16} className="text-gray-500" />
                    <div>
                      <div
                        className="font-medium text-gray-800 dark:text-gray-200"
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {font.format.toUpperCase()}
                        {' '}
                        •
                        {formatFileSize(font.size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedFontId === font.id && (
                      <Check size={14} className="text-blue-600" />
                    )}
                    <button
                      onClick={() => setPreviewFont(font)}
                      className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Preview"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(font.id)}
                      className="rounded p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview panel */}
        {previewFont && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Preview:
                {' '}
                {previewFont.name}
              </div>
              <button
                onClick={() => setPreviewFont(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              className="mb-2 w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
              placeholder="Enter preview text..."
            />
            <div
              className="rounded border border-gray-200 bg-white p-4 text-lg text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              style={{ fontFamily: previewFont.family }}
            >
              {previewText}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <Type size={20} />
          Custom Fonts
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload custom fonts to use in your mockups
        </p>
      </div>

      <div className="p-4">
        {/* Upload area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }`}
        >
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <div className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragging ? 'Drop your fonts here' : 'Upload Custom Fonts'}
          </div>
          <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Drag and drop font files or click to browse
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            <Upload size={16} />
            Choose Files
          </div>
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Supported formats:
            {' '}
            {allowedFormats.join(', ')}
            {' '}
            • Maximum file size:
            {' '}
            {formatFileSize(maxFileSize)}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedFormats.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Uploaded fonts grid */}
        {uploadedFonts.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Fonts (
                {uploadedFonts.length}
                /
                {maxFonts}
                )
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {uploadedFonts.map(font => (
                <div
                  key={font.id}
                  className={`rounded-lg border p-4 transition-all ${
                    selectedFontId === font.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleSelect(font)}
                    >
                      <div
                        className="mb-1 truncate text-xl font-medium text-gray-800 dark:text-gray-200"
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">
                          {font.format.toUpperCase()}
                        </span>
                        <span>{formatFileSize(font.size)}</span>
                      </div>
                    </div>
                    <div className="ml-2 flex items-center gap-1">
                      {selectedFontId === font.id && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      <button
                        onClick={() => setPreviewFont(font)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        title="Preview font"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(font.id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        title="Delete font"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Font preview */}
                  <div
                    className="mt-3 rounded border border-gray-200 bg-white p-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    style={{ fontFamily: font.family }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview modal */}
        {previewFont && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Font Preview
                </h4>
                <button
                  onClick={() => setPreviewFont(null)}
                  className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview Text
                  </label>
                  <input
                    type="text"
                    value={previewText}
                    onChange={e => setPreviewText(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                    placeholder="Enter custom preview text..."
                  />
                </div>

                <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                  <div
                    className="mb-4 text-2xl text-gray-800 dark:text-gray-200"
                    style={{ fontFamily: previewFont.family }}
                  >
                    {previewText}
                  </div>
                  <div
                    className="mb-2 text-base text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: previewFont.family }}
                  >
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </div>
                  <div
                    className="mb-2 text-base text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: previewFont.family }}
                  >
                    abcdefghijklmnopqrstuvwxyz
                  </div>
                  <div
                    className="text-base text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: previewFont.family }}
                  >
                    0123456789 !@#$%^&*()
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{previewFont.name}</span>
                  <span>
                    {previewFont.format.toUpperCase()}
                    {' '}
                    •
                    {' '}
                    {formatFileSize(previewFont.size)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setPreviewFont(null)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSelect(previewFont);
                    setPreviewFont(null);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  <Check size={14} />
                  Use This Font
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FontUploader;
