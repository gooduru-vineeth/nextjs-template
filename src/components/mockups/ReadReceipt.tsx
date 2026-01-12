'use client';

type ReadStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type ReadReceiptProps = {
  status: ReadStatus;
  platform?: Platform;
  timestamp?: string;
  showTimestamp?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeConfig = {
  sm: { icon: 'size-3', text: 'text-[10px]', gap: 'gap-0.5' },
  md: { icon: 'size-4', text: 'text-xs', gap: 'gap-1' },
  lg: { icon: 'size-5', text: 'text-sm', gap: 'gap-1.5' },
};

export function ReadReceipt({
  status,
  platform = 'generic',
  timestamp,
  showTimestamp = true,
  size = 'md',
  className = '',
}: ReadReceiptProps) {
  const sizeStyle = sizeConfig[size];

  const getStatusColor = () => {
    switch (platform) {
      case 'whatsapp':
        return status === 'read' ? 'text-[#53bdeb]' : 'text-gray-400';
      case 'imessage':
        return status === 'read' ? 'text-blue-500' : 'text-gray-400';
      case 'messenger':
        return status === 'read' ? 'text-[#0084ff]' : 'text-gray-400';
      case 'telegram':
        return status === 'read' ? 'text-[#3390ec]' : 'text-gray-400';
      default:
        return status === 'read' ? 'text-blue-500' : 'text-gray-400';
    }
  };

  const renderIcon = () => {
    const color = getStatusColor();

    switch (status) {
      case 'sending':
        return (
          <svg
            className={`${sizeStyle.icon} animate-spin text-gray-400`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );

      case 'sent':
        if (platform === 'whatsapp' || platform === 'telegram') {
          // Single check
          return (
            <svg className={`${sizeStyle.icon} text-gray-400`} viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          );
        }
        return (
          <svg className={`${sizeStyle.icon} text-gray-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );

      case 'delivered':
        if (platform === 'whatsapp' || platform === 'telegram') {
          // Double check
          return (
            <svg className={`${sizeStyle.icon} text-gray-400`} viewBox="0 0 18 16" fill="currentColor">
              <path d="M15.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L8.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
              <path d="M11.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L4.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          );
        }
        if (platform === 'messenger') {
          // Filled circle with check
          return (
            <svg className={`${sizeStyle.icon} text-gray-400`} viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
              <path fill="white" d="M10 14.59l-2.29-2.3-1.42 1.42L10 17.41l8-8-1.41-1.41z" />
            </svg>
          );
        }
        return (
          <svg className={`${sizeStyle.icon} text-gray-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );

      case 'read':
        if (platform === 'whatsapp' || platform === 'telegram') {
          // Double blue check
          return (
            <svg className={`${sizeStyle.icon} ${color}`} viewBox="0 0 18 16" fill="currentColor">
              <path d="M15.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L8.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
              <path d="M11.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L4.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          );
        }
        if (platform === 'messenger') {
          // User avatar (read indicator)
          return (
            <div className={`${sizeStyle.icon} overflow-hidden rounded-full bg-gray-300`}>
              <svg className="size-full text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          );
        }
        if (platform === 'imessage') {
          // "Read" text
          return (
            <span className={`${sizeStyle.text} font-medium ${color}`}>Read</span>
          );
        }
        return (
          <svg className={`${sizeStyle.icon} ${color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );

      case 'failed':
        return (
          <svg className={`${sizeStyle.icon} text-red-500`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center ${sizeStyle.gap} ${className}`}>
      {showTimestamp && timestamp && (
        <span className={`${sizeStyle.text} text-gray-400`}>{timestamp}</span>
      )}
      {renderIcon()}
    </div>
  );
}

// Detailed read receipt with "read by" info for group chats
type DetailedReadReceiptProps = {
  readBy: Array<{ name: string; avatarUrl?: string; readAt: string }>;
  totalRecipients: number;
  platform?: Platform;
  className?: string;
};

export function DetailedReadReceipt({
  readBy,
  totalRecipients,
  platform = 'generic',
  className = '',
}: DetailedReadReceiptProps) {
  const readCount = readBy.length;
  const isAllRead = readCount === totalRecipients;

  return (
    <div className={`rounded-lg bg-gray-50 p-3 dark:bg-gray-800 ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Read by
          {' '}
          {readCount}
          {' '}
          of
          {' '}
          {totalRecipients}
        </span>
        <ReadReceipt
          status={isAllRead ? 'read' : 'delivered'}
          platform={platform}
          showTimestamp={false}
        />
      </div>

      <div className="space-y-2">
        {readBy.map((reader, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-6 overflow-hidden rounded-full bg-gray-300">
                {reader.avatarUrl
                  ? (
                      <img src={reader.avatarUrl} alt={reader.name} className="size-full object-cover" />
                    )
                  : (
                      <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                        {reader.name[0]}
                      </div>
                    )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{reader.name}</span>
            </div>
            <span className="text-xs text-gray-400">{reader.readAt}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${(readCount / totalRecipients) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Status label component (Delivered, Read, etc.)
type StatusLabelProps = {
  status: ReadStatus;
  timestamp?: string;
  platform?: Platform;
  className?: string;
};

export function StatusLabel({ status, timestamp, platform = 'generic', className = '' }: StatusLabelProps) {
  const getLabel = () => {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return platform === 'imessage' ? `Read ${timestamp || ''}`.trim() : 'Seen';
      case 'failed':
        return 'Failed';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'read':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <span className={`text-xs ${getColor()} ${className}`}>
      {getLabel()}
    </span>
  );
}
