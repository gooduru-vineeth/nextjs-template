'use client';

import {
  Bell,
  Heart,
  Image,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Phone,
  Share,
  X,
} from 'lucide-react';

export type NotificationPlatform = 'ios' | 'android' | 'macos' | 'windows' | 'generic';
export type NotificationType = 'message' | 'call' | 'mention' | 'reaction' | 'share' | 'system';

export type NotificationAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
};

export type NotificationData = {
  app: {
    name: string;
    icon?: string;
  };
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  preview?: string;
  mediaUrl?: string;
  groupCount?: number;
  isRead?: boolean;
  actions?: NotificationAction[];
};

export type MessagingNotificationMockupProps = {
  notification: NotificationData;
  platform?: NotificationPlatform;
  variant?: 'banner' | 'lock-screen' | 'notification-center' | 'inline' | 'toast';
  showActions?: boolean;
  expanded?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function MessagingNotificationMockup({
  notification,
  platform = 'ios',
  variant = 'banner',
  showActions = true,
  expanded = false,
  darkMode = false,
  className = '',
}: MessagingNotificationMockupProps) {
  const getTypeIcon = () => {
    switch (notification.type) {
      case 'call':
        return <Phone size={16} />;
      case 'mention':
        return <MessageCircle size={16} />;
      case 'reaction':
        return <Heart size={16} />;
      case 'share':
        return <Share size={16} />;
      case 'system':
        return <Bell size={16} />;
      default:
        return <MessageCircle size={16} />;
    }
  };

  const getPlatformStyles = () => {
    switch (platform) {
      case 'ios':
        return {
          bg: darkMode ? 'bg-gray-800/95' : 'bg-white/95',
          text: darkMode ? 'text-white' : 'text-gray-900',
          muted: darkMode ? 'text-gray-400' : 'text-gray-500',
          border: 'rounded-2xl',
          shadow: 'shadow-lg',
          backdrop: 'backdrop-blur-xl',
        };
      case 'android':
        return {
          bg: darkMode ? 'bg-gray-800' : 'bg-white',
          text: darkMode ? 'text-white' : 'text-gray-900',
          muted: darkMode ? 'text-gray-400' : 'text-gray-600',
          border: 'rounded-lg',
          shadow: 'shadow-md',
          backdrop: '',
        };
      case 'macos':
        return {
          bg: darkMode ? 'bg-gray-800/90' : 'bg-white/90',
          text: darkMode ? 'text-white' : 'text-gray-900',
          muted: darkMode ? 'text-gray-400' : 'text-gray-500',
          border: 'rounded-xl',
          shadow: 'shadow-xl',
          backdrop: 'backdrop-blur-xl',
        };
      case 'windows':
        return {
          bg: darkMode ? 'bg-gray-900' : 'bg-white',
          text: darkMode ? 'text-white' : 'text-gray-900',
          muted: darkMode ? 'text-gray-400' : 'text-gray-600',
          border: 'rounded-md',
          shadow: 'shadow-lg',
          backdrop: '',
        };
      default:
        return {
          bg: darkMode ? 'bg-gray-800' : 'bg-white',
          text: darkMode ? 'text-white' : 'text-gray-900',
          muted: darkMode ? 'text-gray-400' : 'text-gray-600',
          border: 'rounded-lg',
          shadow: 'shadow-md',
          backdrop: '',
        };
    }
  };

  const styles = getPlatformStyles();

  // Toast variant
  if (variant === 'toast') {
    return (
      <div className={`${styles.bg} ${styles.border} ${styles.shadow} ${styles.backdrop} flex max-w-sm items-start gap-3 p-4 ${className}`}>
        {/* App Icon */}
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
          {notification.app.icon
            ? (
                <img src={notification.app.icon} alt={notification.app.name} className="h-full w-full object-cover" />
              )
            : (
                <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
                  {getTypeIcon()}
                </div>
              )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-xs font-medium ${styles.muted} tracking-wider uppercase`}>
              {notification.app.name}
            </span>
            <span className={`text-xs ${styles.muted}`}>{notification.timestamp}</span>
          </div>
          <h4 className={`font-semibold ${styles.text} truncate`}>{notification.title}</h4>
          <p className={`text-sm ${styles.muted} truncate`}>{notification.body}</p>
        </div>

        {/* Close */}
        <button className={`p-1 ${styles.muted} hover:opacity-70`}>
          <X size={16} />
        </button>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 ${!notification.isRead ? (darkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''} ${className}`}>
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white">
            {notification.sender?.avatar
              ? (
                  <img src={notification.sender.avatar} alt={notification.sender.name} className="h-full w-full object-cover" />
                )
              : notification.app.icon
                ? (
                    <img src={notification.app.icon} alt={notification.app.name} className="h-full w-full object-cover" />
                  )
                : (
                    notification.sender?.name.charAt(0) || notification.app.name.charAt(0)
                  )}
          </div>
          {!notification.isRead && (
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 dark:border-gray-800" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className={`font-semibold ${styles.text}`}>{notification.title}</span>
            <span className={`text-xs ${styles.muted}`}>{notification.timestamp}</span>
          </div>
          <p className={`text-sm ${styles.muted} truncate`}>{notification.body}</p>
        </div>

        <button className={`p-2 ${styles.muted} hover:opacity-70`}>
          <MoreHorizontal size={18} />
        </button>
      </div>
    );
  }

  // Notification Center variant
  if (variant === 'notification-center') {
    return (
      <div className={`${styles.bg} ${styles.border} ${styles.shadow} ${styles.backdrop} overflow-hidden ${className}`}>
        {/* Header */}
        <div className={`flex items-center gap-3 border-b px-4 py-3 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className="h-8 w-8 overflow-hidden rounded-lg">
            {notification.app.icon
              ? (
                  <img src={notification.app.icon} alt={notification.app.name} className="h-full w-full object-cover" />
                )
              : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-500 text-sm text-white">
                    {notification.app.name.charAt(0)}
                  </div>
                )}
          </div>
          <span className={`flex-1 text-sm font-medium ${styles.text}`}>{notification.app.name}</span>
          <span className={`text-xs ${styles.muted}`}>{notification.timestamp}</span>
          <button className={`p-1 ${styles.muted} hover:opacity-70`}>
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {notification.sender && (
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {notification.sender.avatar
                  ? (
                      <img src={notification.sender.avatar} alt={notification.sender.name} className="h-full w-full object-cover" />
                    )
                  : (
                      notification.sender.name.charAt(0)
                    )}
              </div>
              <span className={`font-semibold ${styles.text}`}>{notification.sender.name}</span>
            </div>
          )}

          <h4 className={`font-semibold ${styles.text} mb-1`}>{notification.title}</h4>
          <p className={`${styles.muted} ${expanded ? '' : 'line-clamp-2'}`}>{notification.body}</p>

          {notification.mediaUrl && (
            <div className="mt-3 overflow-hidden rounded-lg">
              <img src={notification.mediaUrl} alt="Preview" className="h-32 w-full object-cover" />
            </div>
          )}

          {notification.groupCount && notification.groupCount > 1 && (
            <p className={`mt-2 text-sm ${styles.muted}`}>
              +
              {notification.groupCount - 1}
              {' '}
              more messages
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && notification.actions && notification.actions.length > 0 && (
          <div className={`flex border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            {notification.actions.map((action, index) => (
              <button
                key={action.id}
                className={`flex-1 py-3 text-sm font-medium ${
                  action.destructive ? 'text-red-500' : 'text-blue-500'
                } ${index > 0 ? `border-l ${darkMode ? 'border-gray-700' : 'border-gray-100'}` : ''}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Lock Screen variant
  if (variant === 'lock-screen') {
    return (
      <div className={`${styles.bg} ${styles.border} ${styles.shadow} ${styles.backdrop} p-4 ${className}`}>
        <div className="flex items-start gap-3">
          {/* App Icon */}
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl">
            {notification.app.icon
              ? (
                  <img src={notification.app.icon} alt={notification.app.name} className="h-full w-full object-cover" />
                )
              : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
                    {getTypeIcon()}
                  </div>
                )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-medium ${styles.muted}`}>
                {notification.app.name}
                {' '}
                •
                {notification.timestamp}
              </span>
            </div>
            {notification.sender && (
              <h4 className={`font-semibold ${styles.text}`}>{notification.sender.name}</h4>
            )}
            <p className={`${styles.text} ${expanded ? '' : 'line-clamp-2'}`}>{notification.body}</p>

            {notification.preview && (
              <div className="mt-2 flex items-center gap-2">
                <Image size={14} className={styles.muted} />
                <span className={`text-sm ${styles.muted}`}>Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reply (iOS style) */}
        {platform === 'ios' && expanded && (
          <div className={`mt-3 border-t pt-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Reply..."
                className={`flex-1 px-3 py-2 text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} rounded-full`}
              />
              <button className="rounded-full bg-blue-500 p-2 text-white">
                <Mic size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Banner variant (default)
  return (
    <div className={`${styles.bg} ${styles.border} ${styles.shadow} ${styles.backdrop} ${className}`}>
      {/* Main Content */}
      <div className="flex items-start gap-3 p-4">
        {/* App Icon / Avatar */}
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-xl">
            {notification.sender?.avatar
              ? (
                  <img src={notification.sender.avatar} alt={notification.sender.name} className="h-full w-full object-cover" />
                )
              : notification.app.icon
                ? (
                    <img src={notification.app.icon} alt={notification.app.name} className="h-full w-full object-cover" />
                  )
                : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getTypeIcon()}
                    </div>
                  )}
          </div>
          {/* App badge overlay */}
          {notification.sender && notification.app.icon && (
            <div className="absolute -right-1 -bottom-1 h-6 w-6 overflow-hidden rounded-md border-2 border-white dark:border-gray-800">
              <img src={notification.app.icon} alt={notification.app.name} className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${styles.text}`}>
                {notification.sender?.name || notification.app.name}
              </span>
              {notification.type === 'call' && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700'}`}>
                  Incoming Call
                </span>
              )}
            </div>
            <span className={`text-xs ${styles.muted}`}>{notification.timestamp}</span>
          </div>

          {notification.title !== notification.sender?.name && (
            <h4 className={`font-medium ${styles.text} mb-0.5`}>{notification.title}</h4>
          )}

          <p className={`${styles.muted} ${expanded ? '' : 'line-clamp-2'}`}>{notification.body}</p>

          {/* Media Preview */}
          {notification.mediaUrl && (
            <div className="mt-2 max-w-[200px] overflow-hidden rounded-lg">
              <img src={notification.mediaUrl} alt="Media" className="h-auto w-full" />
            </div>
          )}

          {/* Group Count */}
          {notification.groupCount && notification.groupCount > 1 && (
            <p className={`mt-1 text-xs ${styles.muted}`}>
              {notification.groupCount}
              {' '}
              messages from this conversation
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && notification.type === 'call' && (
        <div className={`flex border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button className="flex flex-1 items-center justify-center gap-2 py-3 font-medium text-red-500">
            <Phone size={18} className="rotate-135" />
            Decline
          </button>
          <button className={`flex flex-1 items-center justify-center gap-2 border-l py-3 font-medium text-green-500 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <Phone size={18} />
            Answer
          </button>
        </div>
      )}

      {showActions && notification.actions && notification.actions.length > 0 && notification.type !== 'call' && (
        <div className={`flex border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          {notification.actions.map((action, index) => (
            <button
              key={action.id}
              className={`flex-1 py-3 text-sm font-medium ${
                action.destructive ? 'text-red-500' : 'text-blue-500'
              } ${index > 0 ? `border-l ${darkMode ? 'border-gray-700' : 'border-gray-100'}` : ''}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
