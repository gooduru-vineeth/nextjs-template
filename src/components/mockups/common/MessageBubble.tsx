'use client';

import type { ChatMessage, MessageStatus, ThemeMode } from '@/types/Mockup';

type ReplyData = {
  senderName: string;
  content: string;
  isSenderReply?: boolean; // true if the repliedTo message was from current user
};

// Function to parse and render formatted text with markdown-like syntax
function FormattedText({ text, className }: { text: string; className?: string }) {
  // Parse formatting markers: *bold*, _italic_, ~strikethrough~, `code`, [link](url)
  const parseFormattedText = (content: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remaining = content;
    let key = 0;

    // Regex patterns for each format type (order matters - more specific first)
    const patterns: { regex: RegExp; render: (match: RegExpMatchArray, k: number) => React.ReactNode }[] = [
      // Links: [text](url)
      {
        regex: /\[([^\]]+)\]\(([^)]+)\)/,
        render: (match, k) => (
          <a
            key={k}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
          >
            {match[1]}
          </a>
        ),
      },
      // Inline code: `code`
      {
        regex: /`([^`]+)`/,
        render: (match, k) => (
          <code
            key={k}
            className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.9em] dark:bg-white/10"
          >
            {match[1]}
          </code>
        ),
      },
      // Bold: *text* or **text**
      {
        regex: /\*\*([^*]+)\*\*|\*([^*]+)\*/,
        render: (match, k) => (
          <strong key={k}>{match[1] || match[2]}</strong>
        ),
      },
      // Italic: _text_
      {
        regex: /_([^_]+)_/,
        render: (match, k) => (
          <em key={k}>{match[1]}</em>
        ),
      },
      // Strikethrough: ~text~ or ~~text~~
      {
        regex: /~~([^~]+)~~|~([^~]+)~/,
        render: (match, k) => (
          <span key={k} className="line-through">{match[1] || match[2]}</span>
        ),
      },
    ];

    while (remaining.length > 0) {
      let earliestMatch: {
        index: number;
        length: number;
        match: RegExpMatchArray;
        render: (match: RegExpMatchArray, k: number) => React.ReactNode;
      } | null = null;

      // Find the earliest matching pattern
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match && match.index !== undefined) {
          if (!earliestMatch || match.index < earliestMatch.index) {
            earliestMatch = {
              index: match.index,
              length: match[0].length,
              match,
              render: pattern.render,
            };
          }
        }
      }

      if (earliestMatch) {
        // Add text before the match (with URL auto-linking)
        if (earliestMatch.index > 0) {
          const beforeText = remaining.slice(0, earliestMatch.index);
          result.push(...parseUrls(beforeText, key));
          key += 10; // Reserve some keys for URL parsing
        }

        // Add the formatted text
        result.push(earliestMatch.render(earliestMatch.match, key++));

        // Continue with the rest
        remaining = remaining.slice(earliestMatch.index + earliestMatch.length);
      } else {
        // No more matches, add remaining text with URL auto-linking
        result.push(...parseUrls(remaining, key));
        break;
      }
    }

    return result;
  };

  // Auto-link plain URLs
  const parseUrls = (text: string, startKey: number): React.ReactNode[] => {
    const urlRegex = /(https?:\/\/[^\s<>[\]]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={startKey + i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
          >
            {part}
          </a>
        );
      }
      return part;
    }).filter(part => part !== '');
  };

  return (
    <span className={className}>
      {parseFormattedText(text)}
    </span>
  );
}

type MessageBubbleProps = {
  message: ChatMessage;
  isSender: boolean;
  theme?: ThemeMode;
  platform?: 'whatsapp' | 'imessage' | 'telegram' | 'messenger' | 'slack' | 'discord';
  showAvatar?: boolean;
  avatarUrl?: string;
  senderName?: string;
  showStatus?: boolean;
  bubbleColorSender?: string;
  bubbleColorReceiver?: string;
  replyData?: ReplyData;
};

function StatusIcon({ status, theme }: { status: MessageStatus; theme: ThemeMode }) {
  const iconColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const readColor = 'text-blue-500';

  switch (status) {
    case 'sending':
      return (
        <svg className={`size-3.5 ${iconColor}`} viewBox="0 0 16 15" fill="currentColor">
          <circle cx="8" cy="7.5" r="2" />
        </svg>
      );
    case 'sent':
      return (
        <svg className={`size-3.5 ${iconColor}`} viewBox="0 0 16 15" fill="currentColor">
          <path d="M10.91 3.316l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.517.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
        </svg>
      );
    case 'delivered':
      return (
        <svg className={`size-3.5 ${iconColor}`} viewBox="0 0 16 15" fill="currentColor">
          <path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51zm-5 0l-.478-.372a.365.365 0 00-.51.063L3.666 9.879a.32.32 0 01-.484.033L.891 7.769a.366.366 0 00-.517.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
        </svg>
      );
    case 'read':
      return (
        <svg className={`size-3.5 ${readColor}`} viewBox="0 0 16 15" fill="currentColor">
          <path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51zm-5 0l-.478-.372a.365.365 0 00-.51.063L3.666 9.879a.32.32 0 01-.484.033L.891 7.769a.366.366 0 00-.517.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
        </svg>
      );
    case 'failed':
      return (
        <svg className="size-3.5 text-red-500" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7v-2h2v2zm0-4H7V3h2v6z" />
        </svg>
      );
    default:
      return null;
  }
}

export function MessageBubble({
  message,
  isSender,
  theme = 'light',
  platform = 'whatsapp',
  showAvatar = true,
  avatarUrl,
  senderName,
  showStatus = true,
  bubbleColorSender,
  bubbleColorReceiver,
  replyData,
}: MessageBubbleProps) {
  const isDark = theme === 'dark';

  // Platform-specific styling
  const getBubbleStyle = () => {
    // Slack and Discord don't use bubbles - return transparent
    if (platform === 'slack' || platform === 'discord') {
      return { backgroundColor: 'transparent' };
    }

    if (isSender) {
      if (bubbleColorSender) {
        return { backgroundColor: bubbleColorSender };
      }
      switch (platform) {
        case 'whatsapp':
          return { backgroundColor: isDark ? '#005c4b' : '#dcf8c6' };
        case 'imessage':
          return { backgroundColor: '#007aff' };
        case 'telegram':
          return { backgroundColor: isDark ? '#2b5278' : '#effdde' };
        case 'messenger':
          return { backgroundColor: '#0084ff' };
        default:
          return { backgroundColor: isDark ? '#005c4b' : '#dcf8c6' };
      }
    } else {
      if (bubbleColorReceiver) {
        return { backgroundColor: bubbleColorReceiver };
      }
      switch (platform) {
        case 'whatsapp':
          return { backgroundColor: isDark ? '#202c33' : '#ffffff' };
        case 'imessage':
          return { backgroundColor: isDark ? '#3a3a3c' : '#e9e9eb' };
        case 'telegram':
          return { backgroundColor: isDark ? '#182533' : '#ffffff' };
        case 'messenger':
          return { backgroundColor: isDark ? '#3a3a3c' : '#e4e6eb' };
        default:
          return { backgroundColor: isDark ? '#202c33' : '#ffffff' };
      }
    }
  };

  const getTextColor = () => {
    // Slack and Discord always use the same text color
    if (platform === 'slack' || platform === 'discord') {
      return isDark ? 'text-gray-200' : 'text-gray-900';
    }
    if (isSender) {
      switch (platform) {
        case 'imessage':
        case 'messenger':
          return 'text-white';
        default:
          return isDark ? 'text-white' : 'text-gray-900';
      }
    }
    return isDark ? 'text-white' : 'text-gray-900';
  };

  const getTimestampColor = () => {
    // Slack and Discord timestamp color
    if (platform === 'slack' || platform === 'discord') {
      return isDark ? 'text-gray-500' : 'text-gray-400';
    }
    if (isSender) {
      switch (platform) {
        case 'imessage':
        case 'messenger':
          return 'text-white/70';
        default:
          return isDark ? 'text-gray-400' : 'text-gray-500';
      }
    }
    return isDark ? 'text-gray-400' : 'text-gray-500';
  };

  // Slack and Discord use a different layout
  const isThreadedLayout = platform === 'slack' || platform === 'discord';

  // Handle deleted message
  if (message.isDeleted) {
    return (
      <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} px-4 py-1`}>
        <div
          className={`rounded-lg px-3 py-2 italic ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
        >
          This message was deleted
        </div>
      </div>
    );
  }

  // Slack and Discord use threaded layout (horizontal with avatar on left)
  if (isThreadedLayout) {
    return (
      <div className={`flex gap-3 px-4 py-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
        {/* Avatar */}
        {showAvatar
          ? (
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
            )
          : (
              <div className="w-9" />
            )}

        {/* Message Content */}
        <div className="min-w-0 flex-1">
          {/* Header with name and timestamp */}
          <div className="flex items-baseline gap-2">
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {senderName || 'Unknown'}
            </span>
            <span className={`text-xs ${getTimestampColor()}`}>
              {message.timestamp}
            </span>
            {message.isEdited && (
              <span className={`text-xs italic ${getTimestampColor()}`}>(edited)</span>
            )}
          </div>

          {/* Reply preview */}
          {message.replyToId && replyData && (
            <div className={`mb-2 rounded border-l-2 border-blue-500 pl-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <div className="text-xs font-semibold text-blue-500">
                {replyData.senderName}
              </div>
              <div className={`line-clamp-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {replyData.content}
              </div>
            </div>
          )}

          {/* Media content */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="mb-2">
              <img
                src={message.mediaUrl}
                alt="Shared image"
                className="max-h-60 max-w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Voice message */}
          {message.type === 'voice' && (
            <div className="flex items-center gap-2">
              {/* Play button */}
              <button
                type="button"
                className={`flex size-10 flex-shrink-0 items-center justify-center rounded-full ${isDark ? 'bg-[#00a884]' : 'bg-[#00a884]'}`}
              >
                <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              {/* Waveform visualization */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex h-6 items-center gap-0.5">
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const height = Math.sin(idx * 0.5) * 0.4 + 0.5 + Math.random() * 0.2;
                    return (
                      <div
                        key={idx}
                        className={`w-0.5 rounded-full ${isDark ? 'bg-[#8696a0]' : 'bg-[#54656f]'}`}
                        style={{ height: `${Math.max(15, height * 100)}%` }}
                      />
                    );
                  })}
                </div>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {message.duration || '0:00'}
                </span>
              </div>
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <div className={`text-[15px] break-words whitespace-pre-wrap ${getTextColor()}`}>
              <FormattedText text={message.content} />
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {message.reactions.map((reaction, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}
                >
                  {reaction.emoji}
                  {' '}
                  {reaction.count > 1 && reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard bubble layout for other platforms
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} px-4 py-0.5`}>
      <div className={`flex max-w-[75%] gap-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {showAvatar && !isSender && (
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

        {/* Message Content */}
        <div
          className={`rounded-2xl px-3 py-2 ${getTextColor()}`}
          style={getBubbleStyle()}
        >
          {/* Sender name for group chats */}
          {senderName && !isSender && (
            <div className="mb-1 text-xs font-semibold text-blue-500">
              {senderName}
            </div>
          )}

          {/* Reply preview */}
          {message.replyToId && replyData && (
            <div className={`mb-2 rounded-lg p-2 ${isDark ? 'bg-black/20' : 'bg-black/5'}`}>
              <div className="flex items-center">
                <div className={`mr-2 h-full w-1 rounded-full ${replyData.isSenderReply ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-semibold ${replyData.isSenderReply ? 'text-green-500' : 'text-blue-500'}`}>
                    {replyData.isSenderReply ? 'You' : replyData.senderName}
                  </div>
                  <div className={`line-clamp-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {replyData.content}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media content */}
          {message.type === 'image' && message.mediaUrl && (
            <div className="mb-2">
              <img
                src={message.mediaUrl}
                alt="Shared image"
                className="max-h-60 max-w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Voice message */}
          {message.type === 'voice' && (
            <div className="flex items-center gap-2">
              {/* Play button */}
              <button
                type="button"
                className={`flex size-9 flex-shrink-0 items-center justify-center rounded-full ${
                  isSender && (platform === 'imessage' || platform === 'messenger')
                    ? 'bg-white/20'
                    : 'bg-[#00a884]'
                }`}
              >
                <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              {/* Waveform visualization */}
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex h-5 items-center gap-0.5">
                  {Array.from({ length: 25 }).map((_, idx) => {
                    const height = Math.sin(idx * 0.5 + 1) * 0.4 + 0.5;
                    return (
                      <div
                        key={idx}
                        className={`w-0.5 rounded-full ${
                          isSender && (platform === 'imessage' || platform === 'messenger')
                            ? 'bg-white/60'
                            : isDark ? 'bg-[#8696a0]' : 'bg-[#54656f]'
                        }`}
                        style={{ height: `${Math.max(20, height * 100)}%` }}
                      />
                    );
                  })}
                </div>
                <span className="text-xs opacity-60">
                  {message.duration || '0:00'}
                </span>
              </div>
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <div className="text-sm break-words whitespace-pre-wrap">
              <FormattedText text={message.content} />
            </div>
          )}

          {/* Timestamp and status */}
          <div className={`mt-1 flex items-center justify-end gap-1 ${getTimestampColor()}`}>
            {message.isEdited && (
              <span className="text-[10px] italic">edited</span>
            )}
            <span className="text-[10px]">{message.timestamp}</span>
            {showStatus && isSender && message.status && (
              <StatusIcon status={message.status} theme={theme} />
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {message.reactions.map((reaction, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  {reaction.emoji}
                  {' '}
                  {reaction.count > 1 && reaction.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
