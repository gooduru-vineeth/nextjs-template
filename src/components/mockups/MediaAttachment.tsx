'use client';

import { useState } from 'react';

type MediaType = 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'sticker';
type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type MediaAttachmentData = {
  id: string;
  type: MediaType;
  url?: string;
  thumbnail?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // for audio/video
  width?: number;
  height?: number;
  mimeType?: string;
  // Location specific
  latitude?: number;
  longitude?: number;
  locationName?: string;
  // Contact specific
  contactName?: string;
  contactPhone?: string;
  contactAvatar?: string;
  // Sticker specific
  stickerPack?: string;
};

type MediaAttachmentProps = {
  media: MediaAttachmentData;
  platform?: Platform;
  sender?: 'sent' | 'received';
  onClick?: () => void;
  onDownload?: () => void;
  showControls?: boolean;
  maxWidth?: number;
  className?: string;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function MediaAttachment({
  media,
  platform = 'generic',
  sender = 'received',
  onClick,
  onDownload,
  showControls = true,
  maxWidth = 280,
  className = '',
}: MediaAttachmentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getBubbleStyle = () => {
    if (platform === 'whatsapp') {
      return sender === 'sent'
        ? 'bg-[#dcf8c6] dark:bg-[#005c4b]'
        : 'bg-white dark:bg-[#202c33]';
    }
    if (platform === 'imessage') {
      return sender === 'sent'
        ? 'bg-[#007aff]'
        : 'bg-[#e5e5ea] dark:bg-[#3a3a3c]';
    }
    if (platform === 'messenger') {
      return sender === 'sent'
        ? 'bg-[#0084ff]'
        : 'bg-[#f0f0f0] dark:bg-gray-700';
    }
    return sender === 'sent'
      ? 'bg-blue-500'
      : 'bg-gray-200 dark:bg-gray-700';
  };

  const renderImage = () => (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-lg ${className}`}
      style={{ maxWidth }}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
          <svg className="size-8 animate-pulse text-gray-400" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <img
        src={media.url || media.thumbnail}
        alt="Image attachment"
        className="w-full object-cover"
        style={{
          aspectRatio: media.width && media.height ? `${media.width}/${media.height}` : 'auto',
        }}
        onLoad={() => setIsLoaded(true)}
      />
      {showControls && (
        <div className="absolute right-2 bottom-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload?.();
            }}
            className="rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  const renderVideo = () => (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-lg ${className}`}
      style={{ maxWidth }}
      onClick={onClick}
    >
      {media.thumbnail
        ? (
            <img src={media.thumbnail} alt="Video thumbnail" className="w-full object-cover" />
          )
        : (
            <div className="flex aspect-video items-center justify-center bg-gray-900">
              <svg className="size-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12l-6-4v8l6-4z" />
              </svg>
            </div>
          )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-black/50 p-3">
          <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      {media.duration && (
        <div className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {formatDuration(media.duration)}
        </div>
      )}
    </div>
  );

  const renderAudio = () => (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ${getBubbleStyle()} ${className}`}
      style={{ maxWidth }}
    >
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white"
      >
        {isPlaying
          ? (
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            )
          : (
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
      </button>
      <div className="flex-1">
        <div className="h-1 rounded-full bg-gray-300 dark:bg-gray-600">
          <div className="h-full w-1/3 rounded-full bg-blue-500" />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0:00</span>
          <span>{media.duration ? formatDuration(media.duration) : '--:--'}</span>
        </div>
      </div>
    </div>
  );

  const renderDocument = () => (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ${getBubbleStyle()} ${className}`}
      style={{ maxWidth }}
      onClick={onClick}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
        <svg className="size-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {media.fileName || 'Document'}
        </p>
        <p className="text-xs text-gray-500">
          {media.fileSize ? formatFileSize(media.fileSize) : 'Unknown size'}
          {media.mimeType && ` • ${media.mimeType.split('/')[1]?.toUpperCase()}`}
        </p>
      </div>
      {showControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload?.();
          }}
          className="rounded-full p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      )}
    </div>
  );

  const renderLocation = () => (
    <div
      className={`cursor-pointer overflow-hidden rounded-lg ${className}`}
      style={{ maxWidth }}
      onClick={onClick}
    >
      <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
        {media.url
          ? (
              <img src={media.url} alt="Location" className="size-full object-cover" />
            )
          : (
              <div className="flex size-full items-center justify-center">
                <svg className="size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
          <svg className="size-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
      </div>
      {media.locationName && (
        <div className={`p-2 ${getBubbleStyle()}`}>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{media.locationName}</p>
          {media.latitude && media.longitude && (
            <p className="text-xs text-gray-500">
              {media.latitude.toFixed(6)}
              ,
              {media.longitude.toFixed(6)}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ${getBubbleStyle()} ${className}`}
      style={{ maxWidth }}
      onClick={onClick}
    >
      <div className="size-12 shrink-0 overflow-hidden rounded-full bg-gray-300">
        {media.contactAvatar
          ? (
              <img src={media.contactAvatar} alt={media.contactName} className="size-full object-cover" />
            )
          : (
              <div className="flex size-full items-center justify-center text-lg font-medium text-gray-600">
                {media.contactName?.[0] || '?'}
              </div>
            )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-white">
          {media.contactName || 'Contact'}
        </p>
        {media.contactPhone && (
          <p className="text-sm text-gray-500">{media.contactPhone}</p>
        )}
      </div>
    </div>
  );

  const renderSticker = () => (
    <div
      className={`cursor-pointer ${className}`}
      style={{ maxWidth: 150 }}
      onClick={onClick}
    >
      <img
        src={media.url || media.thumbnail}
        alt="Sticker"
        className="w-full object-contain"
      />
    </div>
  );

  switch (media.type) {
    case 'image':
      return renderImage();
    case 'video':
      return renderVideo();
    case 'audio':
      return renderAudio();
    case 'document':
      return renderDocument();
    case 'location':
      return renderLocation();
    case 'contact':
      return renderContact();
    case 'sticker':
      return renderSticker();
    default:
      return renderDocument();
  }
}

// Media type selector for adding attachments
type MediaTypeSelectorProps = {
  onSelect: (type: MediaType) => void;
  platform?: Platform;
  className?: string;
};

export function MediaTypeSelector({ onSelect, platform = 'generic', className = '' }: MediaTypeSelectorProps) {
  const mediaTypes: { type: MediaType; icon: string; label: string; color: string }[] = [
    { type: 'image', icon: '🖼️', label: 'Image', color: 'bg-purple-100 text-purple-600' },
    { type: 'video', icon: '🎬', label: 'Video', color: 'bg-red-100 text-red-600' },
    { type: 'audio', icon: '🎵', label: 'Audio', color: 'bg-orange-100 text-orange-600' },
    { type: 'document', icon: '📄', label: 'Document', color: 'bg-blue-100 text-blue-600' },
    { type: 'location', icon: '📍', label: 'Location', color: 'bg-green-100 text-green-600' },
    { type: 'contact', icon: '👤', label: 'Contact', color: 'bg-cyan-100 text-cyan-600' },
    { type: 'sticker', icon: '😀', label: 'Sticker', color: 'bg-yellow-100 text-yellow-600' },
  ];

  // Filter based on platform
  const filteredTypes = platform === 'slack' || platform === 'discord'
    ? mediaTypes.filter(t => ['image', 'video', 'audio', 'document'].includes(t.type))
    : mediaTypes;

  return (
    <div className={`grid grid-cols-4 gap-2 ${className}`}>
      {filteredTypes.map(({ type, icon, label, color }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex flex-col items-center gap-1 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <div className={`flex size-10 items-center justify-center rounded-full ${color}`}>
            <span className="text-lg">{icon}</span>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
        </button>
      ))}
    </div>
  );
}

export type { MediaAttachmentData, MediaType };
