'use client';

import { useCallback, useRef, useState } from 'react';

type UploadedImage = {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
};

type ImageUploaderProps = {
  onUpload: (images: UploadedImage[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  multiple?: boolean;
  showPreview?: boolean;
  className?: string;
};

const defaultAcceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export function ImageUploader({
  onUpload,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = defaultAcceptedTypes,
  multiple = true,
  showPreview = true,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setIsProcessing(true);
    setError(null);

    const fileArray = Array.from(files);

    // Validate file count
    if (fileArray.length + uploadedImages.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      setIsProcessing(false);
      return;
    }

    const newImages: UploadedImage[] = [];

    for (const file of fileArray) {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setError(`File type ${file.type} not supported`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds ${formatSize(maxSize)} limit`);
        continue;
      }

      try {
        const dimensions = await getImageDimensions(file);
        const uploadedImage: UploadedImage = {
          id: generateId(),
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          ...dimensions,
        };
        newImages.push(uploadedImage);
      } catch {
        setError(`Failed to process ${file.name}`);
      }
    }

    if (newImages.length > 0) {
      const allImages = [...uploadedImages, ...newImages];
      setUploadedImages(allImages);
      onUpload(allImages);
    }

    setIsProcessing(false);
  }, [uploadedImages, maxFiles, maxSize, acceptedTypes, onUpload]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    const image = uploadedImages.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    const newImages = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(newImages);
    onUpload(newImages);
  };

  const handleClear = () => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    onUpload([]);
    setError(null);
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Upload Images</h3>
        {uploadedImages.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <svg
          className={`mx-auto size-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isDragging
            ? (
                'Drop images here'
              )
            : (
                <>
                  Drag and drop images, or
                  {' '}
                  <span className="text-blue-500">browse</span>
                </>
              )}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {acceptedTypes.map(t => t.split('/')[1]?.toUpperCase()).join(', ')}
          {' '}
          • Max
          {formatSize(maxSize)}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
          <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </div>
      )}

      {/* Preview Grid */}
      {showPreview && uploadedImages.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {uploadedImages.length}
              {' '}
              image
              {uploadedImages.length !== 1 ? 's' : ''}
              {' '}
              selected
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {uploadedImages.map(image => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(image.id);
                    }}
                    className="rounded-full bg-white p-1.5 text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="truncate text-xs text-white">{image.name}</p>
                  <p className="text-[10px] text-gray-300">
                    {image.width}
                    ×
                    {image.height}
                    {' '}
                    •
                    {formatSize(image.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact upload button for inline use
type CompactImageUploadProps = {
  onUpload: (image: UploadedImage) => void;
  accept?: string[];
  maxSize?: number;
  className?: string;
};

export function CompactImageUpload({
  onUpload,
  accept = defaultAcceptedTypes,
  maxSize = 5 * 1024 * 1024,
  className = '',
}: CompactImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!accept.includes(file.type)) {
      alert('File type not supported');
      return;
    }

    if (file.size > maxSize) {
      alert('File too large');
      return;
    }

    setIsUploading(true);

    try {
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      onUpload({
        id: Math.random().toString(36).substring(2, 9),
        file,
        url,
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.width,
        height: img.height,
      });
    } catch {
      alert('Failed to process image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <button
      onClick={() => fileInputRef.current?.click()}
      disabled={isUploading}
      className={`flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
      {isUploading
        ? (
            <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )
        : (
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
      Upload Image
    </button>
  );
}

export type { UploadedImage };
