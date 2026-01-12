'use client';

import {
  AlertCircle,
  Check,
  Crop,
  Download,
  Eye,
  File,
  FileAudio,
  Film,
  Image as ImageIcon,
  Link,
  Loader2,
  RotateCw,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export type MediaFile = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'other';
  mimeType: string;
  size: number;
  url?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
  progress?: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
};

export type MediaUploaderProps = {
  files?: MediaFile[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  allowMultiple?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  variant?: 'full' | 'compact' | 'dropzone' | 'inline' | 'minimal';
  darkMode?: boolean;
  className?: string;
  onFilesSelect?: (files: File[]) => void;
  onFileRemove?: (fileId: string) => void;
  onFileRetry?: (fileId: string) => void;
  onUpload?: (files: File[]) => Promise<void>;
};

export default function MediaUploader({
  files = [],
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  acceptedTypes = ['image/*', 'video/*', 'audio/*'],
  allowMultiple = true,
  showPreview = true,
  showProgress = true,
  variant = 'full',
  darkMode = false,
  className = '',
  onFilesSelect,
  onFileRemove,
  onFileRetry,
  onUpload,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const getFileTypeIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'video':
        return <Film className="h-5 w-5" />;
      case 'audio':
        return <FileAudio className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: MediaFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'complete':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File exceeds maximum size of ${formatFileSize(maxSize)}`;
    }

    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(`${category}/`);
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return 'File type not accepted';
    }

    return null;
  };

  const handleFiles = useCallback((selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);

    if (!allowMultiple && fileArray.length > 1) {
      fileArray.splice(1);
    }

    const remainingSlots = maxFiles - files.length;
    if (fileArray.length > remainingSlots) {
      fileArray.splice(remainingSlots);
    }

    const validFiles = fileArray.filter((file) => {
      const error = validateFile(file);
      if (error) {
        console.warn(`File ${file.name} rejected: ${error}`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onFilesSelect?.(validFiles);
    }
  }, [allowMultiple, maxFiles, files.length, onFilesSelect, maxSize, acceptedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length > 0 && onUpload) {
      // In a real implementation, you'd convert MediaFile back to File
      // For now, this is a placeholder
      await onUpload([]);
    }
  }, [files, onUpload]);

  const renderDropzone = () => (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      className={`
        cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all
        ${isDragging
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      : `${borderColor} ${hoverBg}`
    }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={allowMultiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      <div className={`flex flex-col items-center gap-3 ${isDragging ? 'text-blue-500' : mutedColor}`}>
        <Upload className={`h-12 w-12 ${isDragging ? 'animate-bounce' : ''}`} />
        <div>
          <p className={`font-medium ${textColor}`}>
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="mt-1 text-sm">
            or
            {' '}
            <span className="text-blue-500 hover:underline">browse</span>
            {' '}
            to upload
          </p>
        </div>
        <div className="text-xs">
          <p>
            Accepted:
            {acceptedTypes.join(', ')}
          </p>
          <p>
            Max size:
            {formatFileSize(maxSize)}
          </p>
        </div>
      </div>
    </div>
  );

  const renderFileItem = (file: MediaFile) => (
    <div
      key={file.id}
      className={`flex items-center gap-3 rounded-lg p-3 ${cardBg} group`}
    >
      {/* Thumbnail or icon */}
      {showPreview && file.thumbnail
        ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="h-12 w-12 cursor-pointer rounded object-cover"
              onClick={() => setPreviewFile(file)}
            />
          )
        : (
            <div className={`h-12 w-12 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center ${mutedColor}`}>
              {getFileTypeIcon(file.type)}
            </div>
          )}

      {/* File info */}
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${textColor} truncate`}>{file.name}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className={mutedColor}>{formatFileSize(file.size)}</span>
          {file.width && file.height && (
            <>
              <span className={mutedColor}>•</span>
              <span className={mutedColor}>
                {file.width}
                ×
                {file.height}
              </span>
            </>
          )}
          {file.duration && (
            <>
              <span className={mutedColor}>•</span>
              <span className={mutedColor}>
                {Math.floor(file.duration / 60)}
                :
                {String(Math.floor(file.duration % 60)).padStart(2, '0')}
              </span>
            </>
          )}
        </div>

        {/* Progress bar */}
        {showProgress && file.status === 'uploading' && file.progress !== undefined && (
          <div className="mt-2">
            <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <p className={`text-xs ${mutedColor} mt-1`}>
              {file.progress}
              %
            </p>
          </div>
        )}

        {/* Error message */}
        {file.status === 'error' && file.error && (
          <p className="mt-1 text-xs text-red-500">{file.error}</p>
        )}
      </div>

      {/* Status and actions */}
      <div className="flex items-center gap-2">
        {getStatusIcon(file.status)}

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {file.status === 'complete' && file.url && (
            <>
              <button
                onClick={() => setPreviewFile(file)}
                className={`rounded p-1.5 ${hoverBg} ${mutedColor}`}
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className={`rounded p-1.5 ${hoverBg} ${mutedColor}`}
                title="Copy link"
              >
                <Link className="h-4 w-4" />
              </button>
              <button
                className={`rounded p-1.5 ${hoverBg} ${mutedColor}`}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </>
          )}
          {file.status === 'error' && (
            <button
              onClick={() => onFileRetry?.(file.id)}
              className="rounded p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
              title="Retry"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onFileRemove?.(file.id)}
            className="rounded p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            title="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreviewModal = () => {
    if (!previewFile) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        onClick={() => setPreviewFile(null)}
      >
        <div
          className={`${bgColor} max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl`}
          onClick={e => e.stopPropagation()}
        >
          <div className={`flex items-center justify-between border-b p-4 ${borderColor}`}>
            <div>
              <h3 className={`font-medium ${textColor}`}>{previewFile.name}</h3>
              <p className={`text-sm ${mutedColor}`}>{formatFileSize(previewFile.size)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className={`rounded p-2 ${hoverBg} ${mutedColor}`}>
                <ZoomIn className="h-5 w-5" />
              </button>
              <button className={`rounded p-2 ${hoverBg} ${mutedColor}`}>
                <ZoomOut className="h-5 w-5" />
              </button>
              <button className={`rounded p-2 ${hoverBg} ${mutedColor}`}>
                <Crop className="h-5 w-5" />
              </button>
              <button className={`rounded p-2 ${hoverBg} ${mutedColor}`}>
                <RotateCw className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPreviewFile(null)}
                className={`rounded p-2 ${hoverBg} ${mutedColor}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex min-h-[400px] items-center justify-center p-4">
            {previewFile.type === 'image' && previewFile.url && (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-h-[60vh] max-w-full object-contain"
              />
            )}
            {previewFile.type === 'video' && previewFile.url && (
              <video
                src={previewFile.url}
                controls
                className="max-h-[60vh] max-w-full"
              />
            )}
            {previewFile.type === 'audio' && previewFile.url && (
              <audio src={previewFile.url} controls className="w-full" />
            )}
            {!['image', 'video', 'audio'].includes(previewFile.type) && (
              <div className={`text-center ${mutedColor}`}>
                <File className="mx-auto mb-2 h-16 w-16" />
                <p>Preview not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <button
          onClick={openFileDialog}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${hoverBg} ${textColor} ${className}`}
        >
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <button
          onClick={openFileDialog}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${borderColor} ${hoverBg} ${textColor}`}
        >
          <Upload className="h-4 w-4" />
          Choose files
        </button>
        <span className={`text-sm ${mutedColor}`}>
          {files.length > 0 ? `${files.length} file(s) selected` : 'No files selected'}
        </span>
      </div>
    );
  }

  // Dropzone variant
  if (variant === 'dropzone') {
    return (
      <div className={className}>
        {renderDropzone()}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map(renderFileItem)}
          </div>
        )}
        {renderPreviewModal()}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border ${borderColor} p-4 ${className}`}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`
            cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all
            ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `${borderColor} ${hoverBg}`}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={allowMultiple}
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          <Upload className={`mx-auto mb-2 h-8 w-8 ${mutedColor}`} />
          <p className={`text-sm ${textColor}`}>Drop files or click to upload</p>
        </div>

        {files.length > 0 && (
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
            {files.map(file => (
              <div
                key={file.id}
                className={`flex items-center gap-2 rounded p-2 ${cardBg}`}
              >
                {getFileTypeIcon(file.type)}
                <span className={`flex-1 text-sm ${textColor} truncate`}>{file.name}</span>
                {getStatusIcon(file.status)}
                <button
                  onClick={() => onFileRemove?.(file.id)}
                  className="rounded p-1 text-red-500 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {renderPreviewModal()}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b p-4 ${borderColor}`}>
        <div>
          <h2 className={`text-lg font-semibold ${textColor}`}>Upload Media</h2>
          <p className={`text-sm ${mutedColor}`}>
            {files.length}
            {' '}
            /
            {maxFiles}
            {' '}
            files
          </p>
        </div>
        {files.some(f => f.status === 'pending') && (
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Upload className="h-4 w-4" />
            Upload All
          </button>
        )}
      </div>

      {/* Dropzone */}
      <div className="p-4">
        {renderDropzone()}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className={`border-t p-4 ${borderColor}`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`font-medium ${textColor}`}>Files</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={mutedColor}>
                {files.filter(f => f.status === 'complete').length}
                {' '}
                complete
              </span>
              {files.some(f => f.status === 'uploading') && (
                <>
                  <span className={mutedColor}>•</span>
                  <span className="text-blue-500">
                    {files.filter(f => f.status === 'uploading').length}
                    {' '}
                    uploading
                  </span>
                </>
              )}
              {files.some(f => f.status === 'error') && (
                <>
                  <span className={mutedColor}>•</span>
                  <span className="text-red-500">
                    {files.filter(f => f.status === 'error').length}
                    {' '}
                    failed
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {files.map(renderFileItem)}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className={`flex items-center justify-between border-t p-4 ${borderColor} ${cardBg} text-sm`}>
        <div className={mutedColor}>
          Total size:
          {' '}
          {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
        </div>
        <div className={mutedColor}>
          Max:
          {' '}
          {formatFileSize(maxSize)}
          {' '}
          per file
        </div>
      </div>

      {renderPreviewModal()}
    </div>
  );
}

// Export preset configurations
export const mediaUploaderPresets = {
  image: {
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024,
    maxFiles: 20,
  },
  video: {
    acceptedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSize: 100 * 1024 * 1024,
    maxFiles: 5,
  },
  audio: {
    acceptedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
    maxSize: 50 * 1024 * 1024,
    maxFiles: 10,
  },
  document: {
    acceptedTypes: ['application/pdf', 'application/msword', 'text/plain'],
    maxSize: 25 * 1024 * 1024,
    maxFiles: 10,
  },
  all: {
    acceptedTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
    maxSize: 50 * 1024 * 1024,
    maxFiles: 10,
  },
};
