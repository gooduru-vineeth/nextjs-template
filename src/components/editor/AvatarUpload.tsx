'use client';

import { useRef, useState } from 'react';

type AvatarUploadProps = {
  currentUrl?: string;
  name: string;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  size?: 'sm' | 'md' | 'lg';
};

const placeholderColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return placeholderColors[Math.abs(hash) % placeholderColors.length] || 'bg-gray-500';
}

export function AvatarUpload({
  currentUrl,
  name,
  onUpload,
  onRemove,
  size = 'md',
}: AvatarUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsLoading(true);

    try {
      // Read and resize the image
      const dataUrl = await resizeImage(file, 200, 200);
      onUpload(dataUrl);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image');
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const color = getColorFromName(name);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Avatar display */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`relative ${sizeClasses[size]} overflow-hidden rounded-full transition-opacity ${
          isHovering ? 'opacity-80' : 'opacity-100'
        } ${isLoading ? 'cursor-wait' : 'cursor-pointer'}`}
        title="Click to upload avatar"
      >
        {currentUrl
          ? (
              <img
                src={currentUrl}
                alt={name}
                className="size-full object-cover"
              />
            )
          : (
              <div className={`flex size-full items-center justify-center text-white ${color}`}>
                {isLoading
                  ? (
                      <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )
                  : (
                      <span className="text-sm font-medium">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
              </div>
            )}

        {/* Hover overlay */}
        {isHovering && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </button>

      {/* Remove button */}
      {currentUrl && isHovering && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
          title="Remove avatar"
        >
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Helper function to resize image
async function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        // Make it square for avatar
        const size = Math.min(width, height);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw centered and cropped
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// Avatar picker with preset options
type AvatarPickerProps = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

const presetAvatars = [
  // Placeholder URLs - these would be actual avatar images
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Dana',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Eden',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Finn',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai',
];

export function AvatarPicker({ onSelect, onClose }: AvatarPickerProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Choose an Avatar
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {presetAvatars.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onSelect(url);
              onClose();
            }}
            className="size-10 overflow-hidden rounded-full border-2 border-transparent hover:border-blue-500"
          >
            <img src={url} alt={`Avatar ${idx + 1}`} className="size-full object-cover" />
          </button>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        Click an avatar to use it, or upload your own
      </p>
    </div>
  );
}
