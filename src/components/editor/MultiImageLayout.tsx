'use client';

import { Columns, Grid, Image, LayoutGrid, Maximize2, Move, Plus, Rows, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ImageItem = {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
};

export type LayoutType = 'grid' | 'masonry' | 'carousel' | 'collage' | 'stack' | 'single';

export type MultiImageLayoutProps = {
  variant?: 'full' | 'compact' | 'preview' | 'editor';
  images?: ImageItem[];
  onChange?: (images: ImageItem[]) => void;
  layout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
  maxImages?: number;
  editable?: boolean;
  showCaptions?: boolean;
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
  gap?: number;
  className?: string;
};

const defaultImages: ImageItem[] = [
  { id: '1', url: '', alt: 'Image 1' },
  { id: '2', url: '', alt: 'Image 2' },
  { id: '3', url: '', alt: 'Image 3' },
];

const MultiImageLayout: React.FC<MultiImageLayoutProps> = ({
  variant = 'full',
  images = defaultImages,
  onChange,
  layout = 'grid',
  onLayoutChange,
  maxImages = 10,
  editable = true,
  showCaptions = false,
  aspectRatio = 'square',
  gap = 4,
  className = '',
}) => {
  const [imageList, setImageList] = useState<ImageItem[]>(images);
  const [currentLayout, setCurrentLayout] = useState<LayoutType>(layout);

  useEffect(() => {
    setImageList(images);
  }, [images]);

  useEffect(() => {
    setCurrentLayout(layout);
  }, [layout]);

  const addImage = useCallback(() => {
    if (imageList.length >= maxImages) {
      return;
    }

    const newImage: ImageItem = {
      id: `img-${Date.now()}`,
      url: '',
      alt: `Image ${imageList.length + 1}`,
    };

    const newImages = [...imageList, newImage];
    setImageList(newImages);
    onChange?.(newImages);
  }, [imageList, maxImages, onChange]);

  const removeImage = useCallback((id: string) => {
    const newImages = imageList.filter(img => img.id !== id);
    setImageList(newImages);
    onChange?.(newImages);
  }, [imageList, onChange]);

  const updateImage = useCallback((id: string, updates: Partial<ImageItem>) => {
    const newImages = imageList.map(img =>
      img.id === id ? { ...img, ...updates } : img,
    );
    setImageList(newImages);
    onChange?.(newImages);
  }, [imageList, onChange]);

  const handleLayoutChange = useCallback((newLayout: LayoutType) => {
    setCurrentLayout(newLayout);
    onLayoutChange?.(newLayout);
  }, [onLayoutChange]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '4:3':
        return 'aspect-[4/3]';
      case '16:9':
        return 'aspect-video';
      default:
        return '';
    }
  };

  const getLayoutIcon = (layoutType: LayoutType) => {
    switch (layoutType) {
      case 'grid':
        return <Grid size={16} />;
      case 'masonry':
        return <LayoutGrid size={16} />;
      case 'carousel':
        return <Columns size={16} />;
      case 'collage':
        return <LayoutGrid size={16} />;
      case 'stack':
        return <Rows size={16} />;
      case 'single':
        return <Maximize2 size={16} />;
      default:
        return <Grid size={16} />;
    }
  };

  const ImagePlaceholder: React.FC<{ image: ImageItem; index: number; size?: 'sm' | 'md' | 'lg' }> = ({
    image,
    index,
    size = 'md',
  }) => {
    const sizeClasses = {
      sm: 'min-h-[60px]',
      md: 'min-h-[100px]',
      lg: 'min-h-[200px]',
    };

    return (
      <div
        className={`relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${getAspectRatioClass()} ${sizeClasses[size]} group`}
      >
        {image.url
          ? (
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            )
          : (
              <div className="flex h-full w-full flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <Image size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
                <span className="mt-1 text-xs">
                  Image
                  {index + 1}
                </span>
              </div>
            )}

        {editable && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => removeImage(image.id)}
              className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
            <button className="rounded-lg bg-white p-2 text-gray-800 hover:bg-gray-100">
              <Move size={16} />
            </button>
          </div>
        )}

        {showCaptions && image.caption && (
          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="truncate text-xs text-white">{image.caption}</p>
          </div>
        )}
      </div>
    );
  };

  const renderLayout = () => {
    switch (currentLayout) {
      case 'single':
        return (
          <div className="w-full">
            {imageList[0] && <ImagePlaceholder image={imageList[0]} index={0} size="lg" />}
          </div>
        );

      case 'carousel':
        return (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imageList.map((image, index) => (
              <div key={image.id} className="w-48 flex-shrink-0">
                <ImagePlaceholder image={image} index={index} size="md" />
              </div>
            ))}
          </div>
        );

      case 'stack':
        return (
          <div className="space-y-2">
            {imageList.map((image, index) => (
              <ImagePlaceholder key={image.id} image={image} index={index} size="lg" />
            ))}
          </div>
        );

      case 'collage':
        if (imageList.length === 1) {
          return <ImagePlaceholder image={imageList[0]!} index={0} size="lg" />;
        }
        if (imageList.length === 2) {
          return (
            <div className="grid grid-cols-2 gap-1">
              {imageList.map((image, index) => (
                <ImagePlaceholder key={image.id} image={image} index={index} size="md" />
              ))}
            </div>
          );
        }
        if (imageList.length === 3) {
          return (
            <div className="grid grid-cols-2 gap-1">
              <div className="row-span-2">
                <ImagePlaceholder image={imageList[0]!} index={0} size="lg" />
              </div>
              <ImagePlaceholder image={imageList[1]!} index={1} size="sm" />
              <ImagePlaceholder image={imageList[2]!} index={2} size="sm" />
            </div>
          );
        }
        if (imageList.length >= 4) {
          return (
            <div className="grid grid-cols-2 gap-1">
              <ImagePlaceholder image={imageList[0]!} index={0} size="md" />
              <ImagePlaceholder image={imageList[1]!} index={1} size="md" />
              <ImagePlaceholder image={imageList[2]!} index={2} size="md" />
              <div className="relative">
                <ImagePlaceholder image={imageList[3]!} index={3} size="md" />
                {imageList.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                    <span className="text-xl font-bold text-white">
                      +
                      {imageList.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        }
        return null;

      case 'masonry':
        return (
          <div className="columns-2 gap-2 space-y-2">
            {imageList.map((image, index) => (
              <div key={image.id} className="break-inside-avoid">
                <ImagePlaceholder image={image} index={index} size={index % 3 === 0 ? 'lg' : 'md'} />
              </div>
            ))}
          </div>
        );

      case 'grid':
      default:
        const cols = imageList.length <= 2 ? imageList.length : imageList.length <= 4 ? 2 : 3;
        return (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {imageList.map((image, index) => (
              <ImagePlaceholder key={image.id} image={image} index={index} size="md" />
            ))}
          </div>
        );
    }
  };

  // Preview variant - just shows the layout
  if (variant === 'preview') {
    return (
      <div className={className}>
        {renderLayout()}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Layout selector */}
        <div className="flex items-center gap-1">
          {(['grid', 'collage', 'carousel', 'stack'] as LayoutType[]).map(layoutType => (
            <button
              key={layoutType}
              onClick={() => handleLayoutChange(layoutType)}
              className={`rounded-lg p-2 transition-colors ${
                currentLayout === layoutType
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={layoutType}
            >
              {getLayoutIcon(layoutType)}
            </button>
          ))}
        </div>

        {/* Layout preview */}
        {renderLayout()}

        {/* Add image button */}
        {editable && imageList.length < maxImages && (
          <button
            onClick={addImage}
            className="w-full rounded-lg border border-dashed border-blue-300 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={14} className="mr-1 inline" />
            Add Image (
            {imageList.length}
            /
            {maxImages}
            )
          </button>
        )}
      </div>
    );
  }

  // Editor variant
  if (variant === 'editor') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Image list editor */}
        <div className="space-y-2">
          {imageList.map(image => (
            <div
              key={image.id}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                {image.url
                  ? (
                      <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                    )
                  : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Image size={20} className="text-gray-400" />
                      </div>
                    )}
              </div>
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  value={image.url}
                  onChange={e => updateImage(image.id, { url: e.target.value })}
                  placeholder="Image URL"
                  className="mb-1 w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
                {showCaptions && (
                  <input
                    type="text"
                    value={image.caption || ''}
                    onChange={e => updateImage(image.id, { caption: e.target.value })}
                    placeholder="Caption"
                    className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
                  />
                )}
              </div>
              <button
                onClick={() => removeImage(image.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {editable && imageList.length < maxImages && (
          <button
            onClick={addImage}
            className="w-full rounded-lg border border-dashed border-blue-300 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={14} className="mr-1 inline" />
            Add Image
          </button>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Image size={18} />
            Image Layout
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {imageList.length}
            /
            {maxImages}
            {' '}
            images
          </span>
        </div>
      </div>

      {/* Layout selector */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Layout Style</div>
        <div className="flex flex-wrap gap-2">
          {(['grid', 'masonry', 'carousel', 'collage', 'stack', 'single'] as LayoutType[]).map(layoutType => (
            <button
              key={layoutType}
              onClick={() => handleLayoutChange(layoutType)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                currentLayout === layoutType
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
              }`}
            >
              {getLayoutIcon(layoutType)}
              <span className="text-sm capitalize">{layoutType}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</div>
        {renderLayout()}
      </div>

      {/* Add image */}
      {editable && (
        <div className="p-4">
          {imageList.length < maxImages
            ? (
                <button
                  onClick={addImage}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 p-3 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Plus size={16} />
                  Add Image
                </button>
              )
            : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Maximum
                  {' '}
                  {maxImages}
                  {' '}
                  images reached
                </p>
              )}
        </div>
      )}
    </div>
  );
};

export default MultiImageLayout;
