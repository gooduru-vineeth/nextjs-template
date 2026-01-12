'use client';

type TypingStyle = 'dots' | 'wave' | 'pulse' | 'bounce';
type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type TypingIndicatorProps = {
  platform?: Platform;
  style?: TypingStyle;
  contactName?: string;
  showAvatar?: boolean;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const platformStyles: Record<Platform, { bg: string; dotColor: string; text: string }> = {
  whatsapp: {
    bg: 'bg-white dark:bg-[#202c33]',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    text: 'text-gray-500 dark:text-gray-400',
  },
  imessage: {
    bg: 'bg-[#e5e5ea] dark:bg-[#3a3a3c]',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    text: 'text-gray-500 dark:text-gray-400',
  },
  messenger: {
    bg: 'bg-[#f0f0f0] dark:bg-gray-700',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    text: 'text-gray-500 dark:text-gray-400',
  },
  telegram: {
    bg: 'bg-white dark:bg-gray-700',
    dotColor: 'bg-[#3390ec]',
    text: 'text-[#3390ec]',
  },
  discord: {
    bg: 'bg-transparent',
    dotColor: 'bg-gray-400',
    text: 'text-gray-400',
  },
  slack: {
    bg: 'bg-transparent',
    dotColor: 'bg-gray-400',
    text: 'text-gray-400',
  },
  generic: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    text: 'text-gray-500 dark:text-gray-400',
  },
};

const sizeConfig = {
  sm: { dot: 'size-1.5', gap: 'gap-0.5', padding: 'px-3 py-2', avatar: 'size-6', text: 'text-xs' },
  md: { dot: 'size-2', gap: 'gap-1', padding: 'px-4 py-2.5', avatar: 'size-8', text: 'text-sm' },
  lg: { dot: 'size-2.5', gap: 'gap-1.5', padding: 'px-5 py-3', avatar: 'size-10', text: 'text-base' },
};

export function TypingIndicator({
  platform = 'generic',
  style = 'dots',
  contactName,
  showAvatar = false,
  avatarUrl,
  size = 'md',
  className = '',
}: TypingIndicatorProps) {
  const platformStyle = platformStyles[platform];
  const sizeStyle = sizeConfig[size];

  const renderDots = () => {
    const baseStyle = `${sizeStyle.dot} rounded-full ${platformStyle.dotColor}`;

    switch (style) {
      case 'wave':
        return (
          <div className={`flex items-center ${sizeStyle.gap}`}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`${baseStyle} animate-bounce`}
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.6s' }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`flex items-center ${sizeStyle.gap}`}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`${baseStyle} animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case 'bounce':
        return (
          <div className={`flex items-end ${sizeStyle.gap}`}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={baseStyle}
                style={{
                  animation: 'typingBounce 1.2s infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
            <style jsx>
              {`
              @keyframes typingBounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-8px); }
              }
            `}
            </style>
          </div>
        );

      default: // dots
        return (
          <div className={`flex items-center ${sizeStyle.gap}`}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={baseStyle}
                style={{
                  animation: 'typingDots 1.4s infinite',
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
            <style jsx>
              {`
              @keyframes typingDots {
                0%, 60%, 100% { opacity: 0.3; }
                30% { opacity: 1; }
              }
            `}
            </style>
          </div>
        );
    }
  };

  // Discord/Slack style (text-based)
  if (platform === 'discord' || platform === 'slack') {
    return (
      <div className={`flex items-center gap-2 ${platformStyle.text} ${sizeStyle.text} ${className}`}>
        {showAvatar && (
          <div className={`${sizeStyle.avatar} shrink-0 overflow-hidden rounded-full bg-gray-300`}>
            {avatarUrl
              ? (
                  <img src={avatarUrl} alt={contactName || 'User'} className="size-full object-cover" />
                )
              : (
                  <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                    {contactName?.[0] || 'U'}
                  </div>
                )}
          </div>
        )}
        <span>
          {contactName
            ? (
                <>
                  <span className="font-medium">{contactName}</span>
                  {' '}
                  is typing
                </>
              )
            : (
                'Someone is typing'
              )}
        </span>
        {renderDots()}
      </div>
    );
  }

  // Telegram style (text above bubble)
  if (platform === 'telegram') {
    return (
      <div className={`${className}`}>
        <div className={`mb-1 ${platformStyle.text} ${sizeStyle.text}`}>
          {contactName || 'User'}
          {' '}
          is typing...
        </div>
      </div>
    );
  }

  // Bubble style (WhatsApp, iMessage, Messenger, Generic)
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      {showAvatar && (
        <div className={`${sizeStyle.avatar} shrink-0 overflow-hidden rounded-full bg-gray-300`}>
          {avatarUrl
            ? (
                <img src={avatarUrl} alt={contactName || 'User'} className="size-full object-cover" />
              )
            : (
                <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                  {contactName?.[0] || 'U'}
                </div>
              )}
        </div>
      )}
      <div
        className={`inline-flex items-center ${sizeStyle.padding} ${platformStyle.bg} rounded-2xl rounded-bl-sm`}
      >
        {renderDots()}
      </div>
    </div>
  );
}

// Multi-user typing indicator for group chats
type MultiUserTypingProps = {
  users: Array<{ name: string; avatarUrl?: string }>;
  platform?: Platform;
  maxDisplay?: number;
  className?: string;
};

export function MultiUserTypingIndicator({
  users,
  platform = 'generic',
  maxDisplay = 3,
  className = '',
}: MultiUserTypingProps) {
  const platformStyle = platformStyles[platform];

  if (users.length === 0) {
    return null;
  }

  const displayedUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  const getTypingText = () => {
    if (users.length === 1 && users[0]) {
      return `${users[0].name} is typing...`;
    } else if (users.length === 2 && users[0] && users[1]) {
      return `${users[0].name} and ${users[1].name} are typing...`;
    } else if (remainingCount > 0) {
      return `${displayedUsers.map(u => u.name).join(', ')} and ${remainingCount} more are typing...`;
    } else {
      return `${users.map(u => u.name).join(', ')} are typing...`;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Stacked avatars */}
      <div className="flex -space-x-2">
        {displayedUsers.map((user, index) => (
          <div
            key={index}
            className="relative size-6 overflow-hidden rounded-full border-2 border-white bg-gray-300 dark:border-gray-800"
            style={{ zIndex: displayedUsers.length - index }}
          >
            {user.avatarUrl
              ? (
                  <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
                )
              : (
                  <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                    {user.name[0]}
                  </div>
                )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="relative flex size-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400">
            +
            {remainingCount}
          </div>
        )}
      </div>

      {/* Typing text */}
      <span className={`text-sm ${platformStyle.text}`}>{getTypingText()}</span>

      {/* Animated dots */}
      <div className="flex items-center gap-0.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`size-1 rounded-full ${platformStyle.dotColor}`}
            style={{
              animation: 'typingDots 1.4s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style jsx>
          {`
          @keyframes typingDots {
            0%, 60%, 100% { opacity: 0.3; }
            30% { opacity: 1; }
          }
        `}
        </style>
      </div>
    </div>
  );
}
