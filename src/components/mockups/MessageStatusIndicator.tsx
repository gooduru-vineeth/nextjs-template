'use client';

import { useEffect, useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'pending';

type MessageStatusIndicatorProps = {
  status: MessageStatus;
  platform?: Platform;
  timestamp?: Date | string;
  showText?: boolean;
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

const statusLabels: Record<MessageStatus, string> = {
  sending: 'Sending...',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Failed',
  pending: 'Pending',
};

const sizeClasses = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

const textSizeClasses = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// WhatsApp-style checkmarks
function WhatsAppStatus({ status, size, animated }: { status: MessageStatus; size: string; animated: boolean }) {
  const baseClass = `${sizeClasses[size as keyof typeof sizeClasses]} transition-all duration-200`;

  if (status === 'sending') {
    return (
      <svg className={`${baseClass} ${animated ? 'animate-pulse' : ''} text-gray-400`} viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="10" />
      </svg>
    );
  }

  if (status === 'pending') {
    return (
      <svg className={`${baseClass} text-gray-400`} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 4a4 4 0 100 8 4 4 0 000-8zm0 6.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
      </svg>
    );
  }

  if (status === 'failed') {
    return (
      <svg className={`${baseClass} text-red-500`} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110 1.5.75.75 0 010-1.5zm0-7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4.5z" />
      </svg>
    );
  }

  // Single check for sent
  if (status === 'sent') {
    return (
      <svg className={`${baseClass} text-gray-400`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Double check for delivered/read
  const isRead = status === 'read';
  return (
    <svg className={`${baseClass} ${isRead ? 'text-[#53bdeb]' : 'text-gray-400'}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// iMessage style
function IMessageStatus({ status, size, timestamp }: { status: MessageStatus; size: string; timestamp?: string }) {
  if (status === 'sending') {
    return <span className={`${textSizeClasses[size as keyof typeof textSizeClasses]} text-gray-400`}>Sending...</span>;
  }

  if (status === 'failed') {
    return (
      <span className={`${textSizeClasses[size as keyof typeof textSizeClasses]} text-red-500`}>
        Not Delivered
      </span>
    );
  }

  if (status === 'read' && timestamp) {
    return (
      <span className={`${textSizeClasses[size as keyof typeof textSizeClasses]} text-gray-500`}>
        Read
        {' '}
        {timestamp}
      </span>
    );
  }

  if (status === 'delivered') {
    return (
      <span className={`${textSizeClasses[size as keyof typeof textSizeClasses]} text-gray-500`}>
        Delivered
      </span>
    );
  }

  return null;
}

// Messenger style
function MessengerStatus({ status, size, avatarUrl }: { status: MessageStatus; size: string; avatarUrl?: string }) {
  const baseClass = `${sizeClasses[size as keyof typeof sizeClasses]} rounded-full`;

  if (status === 'sending') {
    return (
      <div className={`${baseClass} animate-pulse border-2 border-gray-300`} />
    );
  }

  if (status === 'failed') {
    return (
      <svg className={`${sizeClasses[size as keyof typeof sizeClasses]} text-red-500`} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110 1.5.75.75 0 010-1.5zm0-7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4.5z" />
      </svg>
    );
  }

  if (status === 'sent') {
    return (
      <div className={`${baseClass} flex items-center justify-center border-2 border-gray-400`}>
        <svg className="size-2/3 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  if (status === 'delivered') {
    return (
      <div className={`${baseClass} flex items-center justify-center bg-gray-400`}>
        <svg className="size-2/3 text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // Read - show avatar
  if (status === 'read') {
    return avatarUrl
      ? (
          <img src={avatarUrl} alt="Seen by" className={`${baseClass} object-cover`} />
        )
      : (
          <div className={`${baseClass} flex items-center justify-center bg-blue-500 text-white`}>
            <svg className="size-2/3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
  }

  return null;
}

// Telegram style
function TelegramStatus({ status, size, animated }: { status: MessageStatus; size: string; animated: boolean }) {
  const baseClass = `${sizeClasses[size as keyof typeof sizeClasses]} transition-all duration-200`;

  if (status === 'sending') {
    return (
      <svg className={`${baseClass} ${animated ? 'animate-spin' : ''} text-gray-400`} viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="10" />
      </svg>
    );
  }

  if (status === 'pending') {
    return (
      <svg className={`${baseClass} text-gray-400`} viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="3" />
      </svg>
    );
  }

  if (status === 'failed') {
    return (
      <svg className={`${baseClass} text-red-500`} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110 1.5.75.75 0 010-1.5zm0-7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4.5z" />
      </svg>
    );
  }

  if (status === 'sent') {
    return (
      <svg className={`${baseClass} text-gray-400`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Delivered or read
  const isRead = status === 'read';
  return (
    <svg className={`${baseClass} ${isRead ? 'text-green-500' : 'text-gray-400'}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Discord doesn't show delivery status in the same way
function DiscordStatus({ status, size }: { status: MessageStatus; size: string }) {
  const baseClass = textSizeClasses[size as keyof typeof textSizeClasses];

  if (status === 'sending') {
    return <span className={`${baseClass} text-gray-400 italic`}>Sending...</span>;
  }

  if (status === 'failed') {
    return (
      <span className={`${baseClass} flex items-center gap-1 text-red-500`}>
        <svg className="size-3" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110 1.5.75.75 0 010-1.5zm0-7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4.5z" />
        </svg>
        Message not sent
      </span>
    );
  }

  return null; // Discord doesn't show sent/delivered/read status
}

// Slack style
function SlackStatus({ status, size }: { status: MessageStatus; size: string }) {
  const baseClass = textSizeClasses[size as keyof typeof textSizeClasses];

  if (status === 'sending') {
    return <span className={`${baseClass} text-gray-400 italic`}>Sending...</span>;
  }

  if (status === 'failed') {
    return (
      <span className={`${baseClass} flex items-center gap-1 text-red-500`}>
        Failed to send
        <button className="text-blue-500 hover:underline">Retry</button>
      </span>
    );
  }

  return null; // Slack doesn't show sent/delivered/read status
}

// Generic status
function GenericStatus({ status, size, animated }: { status: MessageStatus; size: string; animated: boolean }) {
  const baseClass = `${sizeClasses[size as keyof typeof sizeClasses]} transition-all duration-200`;

  if (status === 'sending') {
    return (
      <svg className={`${baseClass} ${animated ? 'animate-spin' : ''} text-gray-400`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="6" strokeDasharray="20" strokeDashoffset="10" />
      </svg>
    );
  }

  if (status === 'failed') {
    return (
      <svg className={`${baseClass} text-red-500`} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 10.5a.75.75 0 110 1.5.75.75 0 010-1.5zm0-7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 4.5z" />
      </svg>
    );
  }

  const colors = {
    sent: 'text-gray-400',
    delivered: 'text-green-500',
    read: 'text-blue-500',
    pending: 'text-gray-300',
    sending: 'text-gray-400',
    failed: 'text-red-500',
  };

  return (
    <svg className={`${baseClass} ${colors[status]}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MessageStatusIndicator({
  status,
  platform = 'generic',
  timestamp,
  showText = false,
  animated = true,
  size = 'sm',
  className = '',
}: MessageStatusIndicatorProps) {
  const formattedTimestamp = timestamp
    ? typeof timestamp === 'string'
      ? timestamp
      : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  const renderStatus = () => {
    switch (platform) {
      case 'whatsapp':
        return <WhatsAppStatus status={status} size={size} animated={animated} />;
      case 'imessage':
        return <IMessageStatus status={status} size={size} timestamp={formattedTimestamp} />;
      case 'messenger':
        return <MessengerStatus status={status} size={size} />;
      case 'telegram':
        return <TelegramStatus status={status} size={size} animated={animated} />;
      case 'discord':
        return <DiscordStatus status={status} size={size} />;
      case 'slack':
        return <SlackStatus status={status} size={size} />;
      default:
        return <GenericStatus status={status} size={size} animated={animated} />;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {renderStatus()}
      {showText && platform !== 'imessage' && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
}

// Animated status that transitions through states
type AnimatedStatusTransitionProps = {
  targetStatus: MessageStatus;
  platform?: Platform;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  transitionDuration?: number; // ms per state
  className?: string;
};

export function AnimatedStatusTransition({
  targetStatus,
  platform = 'generic',
  size = 'sm',
  transitionDuration = 500,
  className = '',
}: AnimatedStatusTransitionProps) {
  const [currentStatus, setCurrentStatus] = useState<MessageStatus>('sending');

  const statusOrder: MessageStatus[] = ['sending', 'sent', 'delivered', 'read'];

  useEffect(() => {
    const targetIndex = statusOrder.indexOf(targetStatus);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < targetIndex) {
        currentIndex++;
        const nextStatus = statusOrder[currentIndex];
        if (nextStatus) {
          setCurrentStatus(nextStatus);
        }
      } else {
        clearInterval(interval);
      }
    }, transitionDuration);

    return () => clearInterval(interval);
  }, [targetStatus, transitionDuration]);

  return (
    <MessageStatusIndicator
      status={currentStatus}
      platform={platform}
      size={size}
      animated
      className={className}
    />
  );
}

// Status with timestamp
type StatusWithTimestampProps = {
  status: MessageStatus;
  timestamp: Date | string;
  platform?: Platform;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

export function StatusWithTimestamp({
  status,
  timestamp,
  platform = 'generic',
  size = 'sm',
  className = '',
}: StatusWithTimestampProps) {
  const formattedTime = typeof timestamp === 'string'
    ? timestamp
    : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`${textSizeClasses[size]} text-gray-500`}>
        {formattedTime}
      </span>
      <MessageStatusIndicator
        status={status}
        platform={platform}
        size={size}
      />
    </div>
  );
}

// Group read receipts (for group chats)
type GroupReadReceiptProps = {
  readers: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
    readAt?: Date;
  }>;
  totalMembers: number;
  maxAvatars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

export function GroupReadReceipt({
  readers,
  totalMembers,
  maxAvatars = 3,
  size = 'sm',
  className = '',
}: GroupReadReceiptProps) {
  const avatarSizeClasses = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  };

  const displayedReaders = readers.slice(0, maxAvatars);
  const remainingCount = readers.length - maxAvatars;

  if (readers.length === 0) {
    return (
      <span className={`${textSizeClasses[size]} text-gray-400`}>
        Sent
      </span>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-1">
        {displayedReaders.map(reader => (
          <div
            key={reader.id}
            className={`${avatarSizeClasses[size]} rounded-full border border-white dark:border-gray-900`}
            title={reader.name}
          >
            {reader.avatarUrl
              ? (
                  <img
                    src={reader.avatarUrl}
                    alt={reader.name}
                    className="size-full rounded-full object-cover"
                  />
                )
              : (
                  <div className="flex size-full items-center justify-center rounded-full bg-blue-500 text-[8px] font-bold text-white">
                    {reader.name[0]}
                  </div>
                )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={`${avatarSizeClasses[size]} flex items-center justify-center rounded-full border border-white bg-gray-200 text-[8px] font-bold text-gray-600 dark:border-gray-900 dark:bg-gray-700 dark:text-gray-300`}
          >
            +
            {remainingCount}
          </div>
        )}
      </div>
      {readers.length < totalMembers && (
        <span className={`ml-1 ${textSizeClasses[size]} text-gray-400`}>
          {readers.length}
          /
          {totalMembers}
        </span>
      )}
    </div>
  );
}

export type { MessageStatus };
