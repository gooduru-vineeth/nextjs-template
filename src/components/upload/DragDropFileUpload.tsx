'use client';

import {
  AlertCircle,
  CheckCircle,
  Cloud,
  File,
  FileText,
  Folder,
  Image,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// Types
type FileType = 'image' | 'document' | 'any';
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  status: UploadStatus;
  progress: number;
  error?: string;
};

type DragDropFileUploadProps = {
  variant?: 'full' | 'compact' | 'inline';
  accept?: FileType;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<string[]>;
  onRemove?: (fileId: string) => void;
  onFilesChange?: (files: UploadedFile[]) => void;
  placeholder?: string;
  className?: string;
};

const acceptedTypes: Record<FileType, string> = {
  image: 'image/*',
  document: '.pdf,.doc,.docx,.txt,.csv,.json',
  any: '*/*',
};

const fileTypeIcons: Record<string, React.ReactNode> = {
  'image/': <Image className="h-5 w-5" />,
  'application/pdf': <FileText className="h-5 w-5" />,
  'text/': <FileText className="h-5 w-5" />,
  'default': <File className="h-5 w-5" />,
};

const getFileIcon = (type: string) => {
  for (const [key, icon] of Object.entries(fileTypeIcons)) {
    if (type.startsWith(key)) {
      return icon;
    }
  }
  return fileTypeIcons.default;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export default function DragDropFileUpload({
  variant = 'full',
  accept = 'any',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  onUpload,
  onRemove,
  onFilesChange,
  placeholder = 'Drag and drop files here, or click to browse',
  className = '',
}: DragDropFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`;
    }
    if (accept === 'image' && !file.type.startsWith('image/')) {
      return `File "${file.name}" is not an image`;
    }
    return null;
  }, [maxSize, accept]);

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    setError(null);
    const newFiles: File[] = [];
    const errors: string[] = [];

    // Convert FileList to array and validate
    const fileArray = Array.from(fileList);

    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        newFiles.push(file);
      }
    }

    if (errors.length > 0) {
      setError(errors[0]!);
    }

    if (newFiles.length === 0) {
      return;
    }

    // Create upload entries
    const uploadEntries: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'uploading' as UploadStatus,
      progress: 0,
    }));

    setFiles((prev) => {
      const updated = [...prev, ...uploadEntries];
      onFilesChange?.(updated);
      return updated;
    });

    // Simulate upload with progress
    if (onUpload) {
      try {
        const urls = await onUpload(newFiles);
        setFiles((prev) => {
          const updated = prev.map((f, i) => {
            const entryIndex = prev.length - uploadEntries.length + i;
            if (entryIndex >= prev.length - uploadEntries.length) {
              return {
                ...f,
                status: 'success' as UploadStatus,
                progress: 100,
                url: urls[i - (prev.length - uploadEntries.length)],
              };
            }
            return f;
          });
          onFilesChange?.(updated);
          return updated;
        });
      } catch {
        setFiles((prev) => {
          const updated = prev.map((f) => {
            if (f.status === 'uploading') {
              return { ...f, status: 'error' as UploadStatus, error: 'Upload failed' };
            }
            return f;
          });
          onFilesChange?.(updated);
          return updated;
        });
      }
    } else {
      // Mock successful upload
      setTimeout(() => {
        setFiles((prev) => {
          const updated = prev.map((f) => {
            if (f.status === 'uploading') {
              return { ...f, status: 'success' as UploadStatus, progress: 100 };
            }
            return f;
          });
          onFilesChange?.(updated);
          return updated;
        });
      }, 1500);
    }
  }, [files.length, maxFiles, validateFile, onUpload, onFilesChange]);

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
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      const updated = prev.filter(f => f.id !== fileId);
      onFilesChange?.(updated);
      return updated;
    });
    onRemove?.(fileId);
  }, [onRemove, onFilesChange]);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <button
          onClick={openFilePicker}
          className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-blue-900/20"
        >
          <Upload className="h-4 w-4" />
          Upload files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes[accept]}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700"
              >
                {file.status === 'uploading' && <Loader2 className="h-3 w-3 animate-spin" />}
                {file.status === 'success' && <CheckCircle className="h-3 w-3 text-green-500" />}
                {file.status === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
                <span className="max-w-[100px] truncate text-gray-700 dark:text-gray-300">{file.name}</span>
                <button onClick={() => handleRemoveFile(file.id)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div
        className={`relative ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          onClick={openFilePicker}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-3 transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
            <Upload className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isDragging ? 'Drop files here' : 'Click or drag files'}
            </p>
            <p className="text-xs text-gray-500">
              Max
              {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes[accept]}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={`m-4 cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes[accept]}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            isDragging ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
          }`}
          >
            {isDragging
              ? (
                  <Cloud className="h-8 w-8 text-blue-500" />
                )
              : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
          </div>

          <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {isDragging ? 'Drop your files here' : placeholder}
          </p>
          <p className="mb-4 text-sm text-gray-500">
            {accept === 'image' ? 'Images only' : accept === 'document' ? 'Documents only' : 'All files'}
            {' '}
            • Max
            {formatFileSize(maxSize)}
            {' '}
            per file • Up to
            {maxFiles}
            {' '}
            files
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Folder className="h-4 w-4" />
            Browse Files
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="px-4 pb-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Uploaded files (
              {files.length}
              )
            </h3>
            <button
              onClick={() => {
                files.forEach((f) => {
                  if (f.preview) {
                    URL.revokeObjectURL(f.preview);
                  }
                });
                setFiles([]);
                onFilesChange?.([]);
              }}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove all
            </button>
          </div>

          <div className="space-y-2">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
              >
                {/* Preview */}
                {file.preview
                  ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )
                  : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400">
                        {getFileIcon(file.type)}
                      </div>
                    )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>

                  {/* Progress bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <span title={file.error}>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveFile(file.id)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { DragDropFileUploadProps, FileType, UploadedFile };
