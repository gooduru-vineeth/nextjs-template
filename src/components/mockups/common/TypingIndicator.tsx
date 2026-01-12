'use client';

import type { ThemeMode } from '@/types/Mockup';

type TypingIndicatorProps = {
  theme?: ThemeMode;
  platform?: 'whatsapp' | 'imessage' | 'telegram' | 'messenger' | 'slack' | 'discord';
  senderName?: string;
  avatarUrl?: string;
  showAvatar?: boolean;
};

export function TypingIndicator({
  theme = 'light',
  platform = 'whatsapp',
  senderName,
  avatarUrl,
  showAvatar = true,
}: TypingIndicatorProps) {
  const isDark = theme === 'dark';

  // Platform-specific bubble styling
  const getBubbleStyle = () => {
    switch (platform) {
      case 'whatsapp':
        return isDark ? 'bg-[#202c33]' : 'bg-white';
      case 'imessage':
        return isDark ? 'bg-[#3a3a3c]' : 'bg-[#e9e9eb]';
      case 'telegram':
        return isDark ? 'bg-[#182533]' : 'bg-white';
      case 'messenger':
        return isDark ? 'bg-[#3a3a3c]' : 'bg-[#e4e6eb]';
      default:
        return isDark ? 'bg-[#202c33]' : 'bg-white';
    }
  };

  // Slack and Discord use a different layout
  const isThreadedLayout = platform === 'slack' || platform === 'discord';

  if (isThreadedLayout) {
    return (
      <div className={`flex gap-3 px-4 py-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            {avatarUrl
              ? (
                  <img
                    src={avatarUrl}
                    alt={senderName || 'Avatar'}
                    className={`size-9 rounded ${platform === 'slack' ? '' : 'rounded-full'} object-cover`}
                  />
                )
              : (
                  <div className={`flex size-9 items-center justify-center ${platform === 'slack' ? 'rounded' : 'rounded-full'} ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>
                      {senderName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
          </div>
        )}
        {!showAvatar && <div className="w-9" />}

        {/* Typing indicator */}
        <div className="min-w-0 flex-1">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {senderName || 'Someone'}
            {' '}
            is typing
            <span className="inline-flex">
              <span className="animate-[bounce_1s_ease-in-out_0ms_infinite]">.</span>
              <span className="animate-[bounce_1s_ease-in-out_150ms_infinite]">.</span>
              <span className="animate-[bounce_1s_ease-in-out_300ms_infinite]">.</span>
            </span>
          </span>
        </div>
      </div>
    );
  }

  // Standard bubble layout
  return (
    <div className="flex justify-start px-4 py-0.5">
      <div className="flex max-w-[75%] gap-2">
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            {avatarUrl
              ? (
                  <img
                    src={avatarUrl}
                    alt={senderName || 'Avatar'}
                    className="size-8 rounded-full object-cover"
                  />
                )
              : (
                  <div className={`flex size-8 items-center justify-center rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>
                      {senderName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
          </div>
        )}

        {/* Typing bubble with animated dots */}
        <div className={`rounded-2xl px-4 py-3 ${getBubbleStyle()}`}>
          <div className="flex items-center gap-1">
            <span
              className={`inline-block size-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`}
              style={{
                animation: 'typingBounce 1.4s ease-in-out infinite',
                animationDelay: '0ms',
              }}
            />
            <span
              className={`inline-block size-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`}
              style={{
                animation: 'typingBounce 1.4s ease-in-out infinite',
                animationDelay: '200ms',
              }}
            />
            <span
              className={`inline-block size-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`}
              style={{
                animation: 'typingBounce 1.4s ease-in-out infinite',
                animationDelay: '400ms',
              }}
            />
          </div>
        </div>
      </div>

      {/* Inline keyframes animation */}
      <style jsx>
        {`
        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}
      </style>
    </div>
  );
}
