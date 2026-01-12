'use client';

import { Edit2, ExternalLink, FileText, Globe, Image, Link, Play, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type LinkPreviewData = {
  url: string;
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  type?: 'article' | 'video' | 'website' | 'product' | 'profile';
};

export type LinkPreviewCardProps = {
  variant?: 'full' | 'compact' | 'minimal' | 'large' | 'twitter' | 'facebook';
  preview?: LinkPreviewData;
  onChange?: (preview: LinkPreviewData) => void;
  editable?: boolean;
  showFavicon?: boolean;
  showImage?: boolean;
  className?: string;
};

const defaultPreview: LinkPreviewData = {
  url: 'https://example.com/article',
  title: 'Article Title Goes Here',
  description: 'This is a brief description of the article or webpage content that gives readers an idea of what to expect.',
  image: '',
  siteName: 'Example.com',
  favicon: '',
  type: 'article',
};

const LinkPreviewCard: React.FC<LinkPreviewCardProps> = ({
  variant = 'full',
  preview = defaultPreview,
  onChange,
  editable = false,
  showFavicon = true,
  showImage = true,
  className = '',
}) => {
  const [previewData, setPreviewData] = useState<LinkPreviewData>(preview);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPreviewData(preview);
  }, [preview]);

  const handleChange = useCallback((field: keyof LinkPreviewData, value: string) => {
    const newPreview = { ...previewData, [field]: value };
    setPreviewData(newPreview);
    onChange?.(newPreview);
  }, [previewData, onChange]);

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'video':
        return <Play size={14} />;
      case 'article':
        return <FileText size={14} />;
      case 'product':
        return <ExternalLink size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  // Minimal variant - just link text
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link size={14} className="text-gray-400" />
        <a
          href={previewData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {previewData.title || getDomain(previewData.url)}
        </a>
        {editable && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Edit2 size={12} />
          </button>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {showImage && previewData.image
          ? (
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${previewData.image})` }}
                />
              </div>
            )
          : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                <Image size={20} className="text-gray-400" />
              </div>
            )}
        <div className="min-w-0 flex-1">
          {editable
            ? (
                <input
                  type="text"
                  value={previewData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  className="w-full truncate border-b border-transparent bg-transparent text-sm font-medium text-gray-800 hover:border-gray-300 dark:text-gray-200 dark:hover:border-gray-600"
                />
              )
            : (
                <div className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {previewData.title}
                </div>
              )}
          <div className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
            {showFavicon && (
              previewData.favicon
                ? (
                    <div
                      className="h-3 w-3 rounded bg-cover bg-center"
                      style={{ backgroundImage: `url(${previewData.favicon})` }}
                    />
                  )
                : (
                    <Globe size={10} />
                  )
            )}
            <span>{previewData.siteName || getDomain(previewData.url)}</span>
          </div>
        </div>
        <ExternalLink size={14} className="flex-shrink-0 text-gray-400" />
      </div>
    );
  }

  // Twitter variant
  if (variant === 'twitter') {
    return (
      <div className={`overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 ${className}`}>
        {showImage && previewData.image && (
          <div className="h-32 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${previewData.image})` }}
            />
          </div>
        )}
        <div className="p-3">
          {editable
            ? (
                <>
                  <input
                    type="text"
                    value={previewData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="w-full border-b border-transparent bg-transparent text-sm font-medium text-gray-900 hover:border-gray-300 dark:text-gray-100 dark:hover:border-gray-600"
                  />
                  <textarea
                    value={previewData.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                    className="mt-1 w-full resize-none border-b border-transparent bg-transparent text-sm text-gray-500 hover:border-gray-300 dark:text-gray-400 dark:hover:border-gray-600"
                    rows={2}
                  />
                </>
              )
            : (
                <>
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {previewData.title}
                  </div>
                  {previewData.description && (
                    <div className="mt-0.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {previewData.description}
                    </div>
                  )}
                </>
              )}
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <Link size={12} />
            <span>{getDomain(previewData.url)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Facebook variant
  if (variant === 'facebook') {
    return (
      <div className={`border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {showImage && previewData.image && (
          <div className="h-44 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${previewData.image})` }}
            />
          </div>
        )}
        <div className="p-3">
          <div className="text-xs text-gray-500 uppercase dark:text-gray-400">
            {getDomain(previewData.url)}
          </div>
          {editable
            ? (
                <>
                  <input
                    type="text"
                    value={previewData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="mt-1 w-full border-b border-transparent bg-transparent font-semibold text-gray-900 hover:border-gray-300 dark:text-gray-100 dark:hover:border-gray-600"
                  />
                  <textarea
                    value={previewData.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                    className="mt-1 w-full resize-none border-b border-transparent bg-transparent text-sm text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:border-gray-600"
                    rows={2}
                  />
                </>
              )
            : (
                <>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                    {previewData.title}
                  </div>
                  {previewData.description && (
                    <div className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {previewData.description}
                    </div>
                  )}
                </>
              )}
        </div>
      </div>
    );
  }

  // Large variant
  if (variant === 'large') {
    return (
      <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {showImage && (
          <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
            {previewData.image
              ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${previewData.image})` }}
                  />
                )
              : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Image size={48} className="text-gray-300 dark:text-gray-600" />
                  </div>
                )}
            {previewData.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
                  <Play size={24} className="ml-1 text-gray-800" />
                </div>
              </div>
            )}
            {editable && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-2 right-2 rounded-lg bg-white p-2 shadow dark:bg-gray-800"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="mb-2 flex items-center gap-2">
            {showFavicon && (
              <div className="flex h-4 w-4 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                {previewData.favicon
                  ? (
                      <div
                        className="h-full w-full rounded bg-cover bg-center"
                        style={{ backgroundImage: `url(${previewData.favicon})` }}
                      />
                    )
                  : (
                      <Globe size={10} className="text-gray-400" />
                    )}
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {previewData.siteName || getDomain(previewData.url)}
            </span>
            {getTypeIcon(previewData.type)}
          </div>

          {editable && isEditing
            ? (
                <>
                  <input
                    type="text"
                    value={previewData.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className="mb-2 w-full rounded border border-gray-200 bg-transparent p-1 text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <textarea
                    value={previewData.description || ''}
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full resize-none rounded border border-gray-200 bg-transparent p-1 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400"
                    rows={3}
                  />
                  <input
                    type="text"
                    value={previewData.url}
                    onChange={e => handleChange('url', e.target.value)}
                    className="mt-2 w-full rounded border border-gray-200 bg-transparent p-1 text-xs text-gray-500 dark:border-gray-700"
                    placeholder="URL"
                  />
                </>
              )
            : (
                <>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {previewData.title}
                  </h3>
                  {previewData.description && (
                    <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                      {previewData.description}
                    </p>
                  )}
                </>
              )}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`flex gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {showImage && (
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
          {previewData.image
            ? (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${previewData.image})` }}
                />
              )
            : (
                <div className="flex h-full w-full items-center justify-center">
                  <Image size={24} className="text-gray-300 dark:text-gray-600" />
                </div>
              )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          {showFavicon && (
            <div className="flex h-4 w-4 items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
              {previewData.favicon
                ? (
                    <div
                      className="h-full w-full rounded bg-cover bg-center"
                      style={{ backgroundImage: `url(${previewData.favicon})` }}
                    />
                  )
                : (
                    <Globe size={10} className="text-gray-400" />
                  )}
            </div>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {previewData.siteName || getDomain(previewData.url)}
          </span>
        </div>

        {editable
          ? (
              <>
                <input
                  type="text"
                  value={previewData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  className="mb-1 w-full border-b border-transparent bg-transparent font-semibold text-gray-900 hover:border-gray-300 dark:text-gray-100 dark:hover:border-gray-600"
                />
                <textarea
                  value={previewData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full resize-none border-b border-transparent bg-transparent text-sm text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:border-gray-600"
                  rows={2}
                />
              </>
            )
          : (
              <>
                <h4 className="mb-1 truncate font-semibold text-gray-900 dark:text-gray-100">
                  {previewData.title}
                </h4>
                {previewData.description && (
                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {previewData.description}
                  </p>
                )}
              </>
            )}
      </div>

      {editable && (
        <button
          onClick={() => {
            setPreviewData(defaultPreview);
            onChange?.(defaultPreview);
          }}
          className="self-start p-1 text-gray-400 hover:text-red-500"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default LinkPreviewCard;
