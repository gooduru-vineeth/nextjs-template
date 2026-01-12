'use client';

import { useEffect, useState } from 'react';

export type TypingUser = {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
};

export type TypingIndicatorProps = {
  users: TypingUser[];
  maxDisplayUsers?: number;
  animated?: boolean;
  showNames?: boolean;
  showAvatars?: boolean;
  platform?: 'whatsapp' | 'imessage' | 'telegram' | 'slack' | 'discord' | 'messenger' | 'generic';
  variant?: 'dots' | 'text' | 'bubble' | 'inline' | 'minimal' | 'avatar';
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
  className?: string;
};

export default function TypingIndicator({
  users,
  maxDisplayUsers = 3,
  animated = true,
  showNames = true,
  showAvatars = true,
  platform = 'generic',
  variant = 'dots',
  size = 'md',
  darkMode = false,
  className = '',
}: TypingIndicatorProps) {
  const [dotIndex, setDotIndex] = useState(0);

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-gray-100';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';

  const sizeClasses = {
    sm: { dot: 'w-1.5 h-1.5', text: 'text-xs', avatar: 'w-5 h-5', bubble: 'px-3 py-1.5' },
    md: { dot: 'w-2 h-2', text: 'text-sm', avatar: 'w-6 h-6', bubble: 'px-4 py-2' },
    lg: { dot: 'w-2.5 h-2.5', text: 'text-base', avatar: 'w-8 h-8', bubble: 'px-5 py-2.5' },
  };

  const sizes = sizeClasses[size];

  useEffect(() => {
    if (!animated) {
      return;
    }

    const interval = setInterval(() => {
      setDotIndex(prev => (prev + 1) % 3);
    }, 300);

    return () => clearInterval(interval);
  }, [animated]);

  if (users.length === 0) {
    return null;
  }

  const displayUsers = users.slice(0, maxDisplayUsers);
  const remainingCount = users.length - maxDisplayUsers;

  const getTypingText = () => {
    if (users.length === 1) {
      return showNames ? `${users[0]?.name} is typing...` : 'typing...';
    }
    if (users.length === 2) {
      return showNames ? `${users[0]?.name} and ${users[1]?.name} are typing...` : '2 people are typing...';
    }
    if (users.length > 2) {
      return showNames ? `${users[0]?.name} and ${users.length - 1} others are typing...` : `${users.length} people are typing...`;
    }
    return '';
  };

  const getPlatformStyles = () => {
    switch (platform) {
      case 'whatsapp':
        return {
          bubbleBg: darkMode ? 'bg-green-900' : 'bg-green-100',
          dotColor: 'bg-green-500',
        };
      case 'imessage':
        return {
          bubbleBg: darkMode ? 'bg-gray-700' : 'bg-gray-200',
          dotColor: 'bg-gray-500',
        };
      case 'telegram':
        return {
          bubbleBg: darkMode ? 'bg-blue-900' : 'bg-blue-100',
          dotColor: 'bg-blue-500',
        };
      case 'slack':
        return {
          bubbleBg: darkMode ? 'bg-purple-900' : 'bg-purple-100',
          dotColor: 'bg-purple-500',
        };
      case 'discord':
        return {
          bubbleBg: 'bg-gray-700',
          dotColor: 'bg-white',
        };
      case 'messenger':
        return {
          bubbleBg: darkMode ? 'bg-blue-900' : 'bg-blue-100',
          dotColor: 'bg-blue-600',
        };
      default:
        return {
          bubbleBg: bgColor,
          dotColor: 'bg-gray-400',
        };
    }
  };

  const platformStyles = getPlatformStyles();

  const renderDots = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`${sizes.dot} rounded-full ${platformStyles.dotColor} transition-all duration-300 ${
            animated ? (dotIndex === i ? 'scale-110 opacity-100' : 'scale-100 opacity-40') : ''
          }`}
          style={{
            animationDelay: animated ? `${i * 150}ms` : undefined,
          }}
        />
      ))}
    </div>
  );

  const renderAvatars = () => (
    <div className="flex -space-x-2">
      {displayUsers.map(user => (
        <div
          key={user.id}
          className={`${sizes.avatar} flex items-center justify-center overflow-hidden rounded-full border-2 border-white text-xs font-medium text-white dark:border-gray-900`}
          style={{ backgroundColor: user.color || '#6366f1' }}
          title={user.name}
        >
          {user.avatar
            ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              )
            : (
                user.name.charAt(0).toUpperCase()
              )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className={`${sizes.avatar} flex items-center justify-center rounded-full border-2 border-white bg-gray-400 text-xs font-medium text-white dark:border-gray-900`}>
          +
          {remainingCount}
        </div>
      )}
    </div>
  );

  // Minimal variant - just dots
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {renderDots()}
      </div>
    );
  }

  // Text variant - just text
  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`${sizes.text} ${mutedColor} italic`}>
          {getTypingText()}
        </span>
      </div>
    );
  }

  // Avatar variant - avatars with dots
  if (variant === 'avatar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showAvatars && renderAvatars()}
        <div className="flex flex-col">
          {showNames && (
            <span className={`${sizes.text} ${textColor} font-medium`}>
              {users.length === 1 ? users[0]?.name : `${users.length} people`}
            </span>
          )}
          <div className="flex items-center gap-2">
            {renderDots()}
            <span className={`${sizes.text} ${mutedColor}`}>typing</span>
          </div>
        </div>
      </div>
    );
  }

  // Inline variant - compact inline display
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${sizes.text} ${mutedColor} ${className}`}>
        {showAvatars && users.length <= 2 && (
          <div className="flex -space-x-1">
            {displayUsers.map(user => (
              <div
                key={user.id}
                className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-white text-[8px] font-medium text-white dark:border-gray-900"
                style={{ backgroundColor: user.color || '#6366f1' }}
              >
                {user.avatar
                  ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    )
                  : (
                      user.name.charAt(0).toUpperCase()
                    )}
              </div>
            ))}
          </div>
        )}
        <span className="italic">{getTypingText()}</span>
      </span>
    );
  }

  // Bubble variant (default) - full bubble like in chat apps
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {/* Avatar */}
      {showAvatars && users.length === 1 && (
        <div
          className={`${sizes.avatar} flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-medium text-white`}
          style={{ backgroundColor: users[0]?.color || '#6366f1' }}
        >
          {users[0]?.avatar
            ? (
                <img src={users[0].avatar} alt={users[0].name} className="h-full w-full object-cover" />
              )
            : (
                users[0]?.name.charAt(0).toUpperCase()
              )}
        </div>
      )}

      {/* Multiple avatars stacked */}
      {showAvatars && users.length > 1 && (
        <div className="flex flex-shrink-0 -space-x-1">
          {displayUsers.map(user => (
            <div
              key={user.id}
              className={`${sizes.avatar} flex items-center justify-center overflow-hidden rounded-full border-2 border-white text-xs font-medium text-white dark:border-gray-900`}
              style={{ backgroundColor: user.color || '#6366f1' }}
            >
              {user.avatar
                ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  )
                : (
                    user.name.charAt(0).toUpperCase()
                  )}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className={`${sizes.avatar} flex items-center justify-center rounded-full border-2 border-white bg-gray-400 text-xs text-white dark:border-gray-900`}>
              +
              {remainingCount}
            </div>
          )}
        </div>
      )}

      {/* Typing bubble */}
      <div className="flex flex-col">
        {showNames && users.length > 0 && (
          <span className={`${sizes.text} ${mutedColor} mb-1`}>
            {users.length === 1 ? users[0]?.name : `${users.length} people`}
          </span>
        )}
        <div className={`${platformStyles.bubbleBg} ${sizes.bubble} inline-flex items-center gap-2 rounded-2xl rounded-bl-sm`}>
          {renderDots()}
        </div>
      </div>
    </div>
  );
}

// Export preset configurations for different platforms
export const typingIndicatorPresets = {
  whatsapp: {
    platform: 'whatsapp' as const,
    variant: 'bubble' as const,
    animated: true,
    showAvatars: true,
    showNames: true,
  },
  imessage: {
    platform: 'imessage' as const,
    variant: 'bubble' as const,
    animated: true,
    showAvatars: false,
    showNames: false,
  },
  slack: {
    platform: 'slack' as const,
    variant: 'text' as const,
    animated: true,
    showAvatars: true,
    showNames: true,
  },
  discord: {
    platform: 'discord' as const,
    variant: 'inline' as const,
    animated: true,
    showAvatars: false,
    showNames: true,
  },
  telegram: {
    platform: 'telegram' as const,
    variant: 'text' as const,
    animated: true,
    showAvatars: false,
    showNames: true,
  },
};
