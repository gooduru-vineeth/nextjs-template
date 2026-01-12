'use client';

import { useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type ReplyMessage = {
  id: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  contentType?: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker';
  thumbnailUrl?: string;
};

type MessageReplyQuoteProps = {
  reply: ReplyMessage;
  platform?: Platform;
  sender?: 'sent' | 'received';
  accentColor?: string;
  onClick?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
};

// Get platform-specific accent colors
const getPlatformAccentColor = (platform: Platform, sender: 'sent' | 'received'): string => {
  switch (platform) {
    case 'whatsapp':
      return sender === 'sent' ? '#25d366' : '#34b7f1';
    case 'imessage':
      return sender === 'sent' ? '#007aff' : '#8e8e93';
    case 'messenger':
      return '#0084ff';
    case 'telegram':
      return '#3390ec';
    case 'discord':
      return '#5865f2';
    case 'slack':
      return '#4a154b';
    default:
      return '#3b82f6';
  }
};

// Content type icons
const contentTypeIcons = {
  image: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  video: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  audio: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  ),
  document: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  sticker: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const contentTypeLabels = {
  image: 'Photo',
  video: 'Video',
  audio: 'Voice message',
  document: 'Document',
  sticker: 'Sticker',
};

export function MessageReplyQuote({
  reply,
  platform = 'generic',
  sender = 'received',
  accentColor,
  onClick,
  onClose,
  showCloseButton = false,
  className = '',
}: MessageReplyQuoteProps) {
  const color = accentColor || getPlatformAccentColor(platform, sender);

  const getContainerStyle = () => {
    const baseStyle = 'flex cursor-pointer items-stretch gap-2 rounded-lg transition-colors';

    switch (platform) {
      case 'whatsapp':
        return `${baseStyle} bg-black/5 dark:bg-white/5 p-2`;
      case 'imessage':
        return `${baseStyle} bg-gray-100 dark:bg-gray-800 p-2`;
      case 'messenger':
        return `${baseStyle} bg-gray-100 dark:bg-gray-800 p-2`;
      case 'telegram':
        return `${baseStyle} bg-black/5 dark:bg-white/5 py-1 px-2`;
      case 'discord':
        return `${baseStyle} border-l-2 py-1 px-2` + ` border-l-[${color}]`;
      case 'slack':
        return `${baseStyle} border-l-4 bg-gray-50 dark:bg-gray-800/50 py-1 px-2`;
      default:
        return `${baseStyle} border-l-4 bg-gray-100 dark:bg-gray-800 py-2 px-3`;
    }
  };

  const getSenderNameStyle = () => {
    switch (platform) {
      case 'whatsapp':
      case 'telegram':
        return 'text-xs font-semibold';
      case 'discord':
        return 'text-sm font-semibold';
      case 'slack':
        return 'text-sm font-bold';
      default:
        return 'text-xs font-medium';
    }
  };

  const getContentStyle = () => {
    switch (platform) {
      case 'whatsapp':
        return 'text-sm text-gray-600 dark:text-gray-400 line-clamp-1';
      case 'telegram':
        return 'text-sm text-gray-600 dark:text-gray-400 line-clamp-2';
      case 'discord':
        return 'text-sm text-gray-400 line-clamp-1';
      case 'slack':
        return 'text-sm text-gray-600 dark:text-gray-400 line-clamp-1';
      default:
        return 'text-sm text-gray-500 dark:text-gray-400 line-clamp-2';
    }
  };

  const renderContent = () => {
    if (reply.contentType && reply.contentType !== 'text') {
      const icon = contentTypeIcons[reply.contentType];
      const label = contentTypeLabels[reply.contentType];

      return (
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
      );
    }

    return <p className={getContentStyle()}>{reply.content}</p>;
  };

  // Telegram-specific style with left border
  if (platform === 'telegram') {
    return (
      <div
        className={`flex cursor-pointer items-stretch gap-2 rounded-lg bg-black/5 px-2 py-1 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 ${className}`}
        onClick={onClick}
      >
        <div
          className="w-0.5 shrink-0 self-stretch rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={getSenderNameStyle()}
            style={{ color }}
          >
            {reply.senderName}
          </span>
          {renderContent()}
        </div>
        {reply.thumbnailUrl && (
          <img
            src={reply.thumbnailUrl}
            alt=""
            className="size-10 shrink-0 rounded object-cover"
          />
        )}
        {showCloseButton && onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // WhatsApp style
  if (platform === 'whatsapp') {
    return (
      <div
        className={`flex cursor-pointer items-stretch gap-2 rounded-lg bg-black/5 p-2 transition-colors hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 ${className}`}
        onClick={onClick}
      >
        <div
          className="w-1 shrink-0 self-stretch rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={getSenderNameStyle()}
            style={{ color }}
          >
            {reply.senderName}
          </span>
          {renderContent()}
        </div>
        {reply.thumbnailUrl && (
          <img
            src={reply.thumbnailUrl}
            alt=""
            className="size-12 shrink-0 rounded object-cover"
          />
        )}
        {showCloseButton && onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Discord style with quote formatting
  if (platform === 'discord') {
    return (
      <div
        className={`flex cursor-pointer items-start gap-2 py-1 ${className}`}
        onClick={onClick}
      >
        <div
          className="mt-0.5 h-full w-1 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {reply.senderAvatar && (
            <img
              src={reply.senderAvatar}
              alt={reply.senderName}
              className="size-4 shrink-0 rounded-full"
            />
          )}
          <span className="text-xs font-semibold text-gray-300">
            {reply.senderName}
          </span>
          <span className="line-clamp-1 text-sm text-gray-400">
            {reply.content}
          </span>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-700 hover:text-gray-300"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Slack style with thread indicator
  if (platform === 'slack') {
    return (
      <div
        className={`flex cursor-pointer items-stretch gap-2 rounded border-l-4 bg-gray-50 px-2 py-1 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 ${className}`}
        style={{ borderLeftColor: color }}
        onClick={onClick}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2">
            {reply.senderAvatar && (
              <img
                src={reply.senderAvatar}
                alt={reply.senderName}
                className="size-5 shrink-0 rounded"
              />
            )}
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {reply.senderName}
            </span>
          </div>
          <p className="line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
            {reply.content}
          </p>
        </div>
        {reply.thumbnailUrl && (
          <img
            src={reply.thumbnailUrl}
            alt=""
            className="size-10 shrink-0 rounded object-cover"
          />
        )}
        {showCloseButton && onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Generic / default style
  return (
    <div
      className={`${getContainerStyle()} ${className}`}
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={getSenderNameStyle()}
          style={{ color }}
        >
          {reply.senderName}
        </span>
        {renderContent()}
      </div>
      {reply.thumbnailUrl && (
        <img
          src={reply.thumbnailUrl}
          alt=""
          className="size-10 shrink-0 rounded object-cover"
        />
      )}
      {showCloseButton && onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Reply composer (shows when replying to a message)
type ReplyComposerProps = {
  reply: ReplyMessage;
  platform?: Platform;
  onCancel: () => void;
  className?: string;
};

export function ReplyComposer({
  reply,
  platform = 'generic',
  onCancel,
  className = '',
}: ReplyComposerProps) {
  const color = getPlatformAccentColor(platform, 'sent');

  return (
    <div className={`flex items-center gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <svg className="size-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
      <div
        className="flex min-w-0 flex-1 flex-col border-l-2 pl-2"
        style={{ borderLeftColor: color }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color }}
        >
          {reply.senderName}
        </span>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
          {reply.contentType && reply.contentType !== 'text'
            ? contentTypeLabels[reply.contentType]
            : reply.content}
        </p>
      </div>
      <button
        onClick={onCancel}
        className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Hook for managing reply state
export function useMessageReply() {
  const [replyTo, setReplyTo] = useState<ReplyMessage | null>(null);

  const startReply = (message: ReplyMessage) => {
    setReplyTo(message);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  return {
    replyTo,
    startReply,
    cancelReply,
    isReplying: replyTo !== null,
  };
}

// Forward message indicator
type ForwardIndicatorProps = {
  forwardedFrom?: string;
  platform?: Platform;
  className?: string;
};

export function ForwardIndicator({
  forwardedFrom,
  platform = 'generic',
  className = '',
}: ForwardIndicatorProps) {
  const getText = () => {
    if (platform === 'telegram') {
      return forwardedFrom ? `Forwarded from ${forwardedFrom}` : 'Forwarded message';
    }
    if (platform === 'whatsapp') {
      return 'Forwarded';
    }
    return forwardedFrom ? `Forwarded from ${forwardedFrom}` : 'Forwarded';
  };

  return (
    <div className={`flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="italic">{getText()}</span>
    </div>
  );
}

export type { ReplyMessage };
