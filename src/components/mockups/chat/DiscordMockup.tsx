'use client';

import type { ChatMockupData, DiscordConfig, Participant } from '@/types/Mockup';
import { TypingIndicator } from '../common/TypingIndicator';

type DiscordMockupProps = {
  data: ChatMockupData;
  config?: DiscordConfig;
  currentUserId?: string;
  showSidebar?: boolean;
};

// Discord uses its own dark theme
const discordColors = {
  bg: '#313338',
  bgSecondary: '#2b2d31',
  bgTertiary: '#1e1f22',
  textNormal: '#dbdee1',
  textMuted: '#949ba4',
  textLink: '#00a8fc',
  channelIcon: '#80848e',
  online: '#23a55a',
  idle: '#f0b232',
  dnd: '#f23f43',
  offline: '#80848e',
  blurple: '#5865f2',
  green: '#57f287',
  mentionBg: 'rgba(88, 101, 242, 0.3)',
};

function DiscordSidebar({
  serverName,
  channelName,
  channels,
}: {
  serverName: string;
  channelName: string;
  channels?: { name: string; type: 'text' | 'voice' }[];
}) {
  const defaultChannels = channels || [
    { name: 'welcome', type: 'text' as const },
    { name: 'general', type: 'text' as const },
    { name: 'random', type: 'text' as const },
    { name: 'Voice Chat', type: 'voice' as const },
  ];

  return (
    <div className="flex h-full w-60" style={{ backgroundColor: discordColors.bgSecondary }}>
      {/* Server list */}
      <div className="flex w-[72px] flex-col items-center gap-2 py-3" style={{ backgroundColor: discordColors.bgTertiary }}>
        {/* Home button */}
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#5865f2] text-white transition-all hover:rounded-xl">
          <svg className="size-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.73 4.87l-15.5 8.87a.5.5 0 00-.01.87l2.14 1.28a.5.5 0 00.51 0l3.35-1.92 2.24 4.94a.5.5 0 00.89.06l7.58-13.52a.5.5 0 00-.2-.58z" />
          </svg>
        </div>

        <div className="mx-2 h-0.5 w-8 rounded-full bg-gray-700" />

        {/* Server icon */}
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#5865f2] text-white transition-all hover:rounded-xl">
          <span className="text-lg font-semibold">{serverName.charAt(0)}</span>
        </div>
      </div>

      {/* Channel list */}
      <div className="flex flex-1 flex-col">
        {/* Server header */}
        <div
          className="flex h-12 items-center justify-between border-b border-black/20 px-4"
          style={{ backgroundColor: discordColors.bgSecondary }}
        >
          <span className="font-semibold" style={{ color: discordColors.textNormal }}>{serverName}</span>
          <svg className="size-4" style={{ color: discordColors.textMuted }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="mb-1 flex items-center px-1">
            <svg className="mr-1 size-3" style={{ color: discordColors.channelIcon }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: discordColors.channelIcon }}>
              Text Channels
            </span>
          </div>

          {defaultChannels.filter(c => c.type === 'text').map(channel => (
            <div
              key={channel.name}
              className={`mb-0.5 flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 ${
                channel.name === channelName ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <span style={{ color: discordColors.channelIcon }}>#</span>
              <span
                className="text-sm"
                style={{ color: channel.name === channelName ? discordColors.textNormal : discordColors.channelIcon }}
              >
                {channel.name}
              </span>
            </div>
          ))}

          <div className="mt-4 mb-1 flex items-center px-1">
            <svg className="mr-1 size-3" style={{ color: discordColors.channelIcon }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z" />
            </svg>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: discordColors.channelIcon }}>
              Voice Channels
            </span>
          </div>

          {defaultChannels.filter(c => c.type === 'voice').map(channel => (
            <div
              key={channel.name}
              className="mb-0.5 flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 hover:bg-white/5"
            >
              <svg className="size-4" style={{ color: discordColors.channelIcon }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z" />
              </svg>
              <span className="text-sm" style={{ color: discordColors.channelIcon }}>{channel.name}</span>
            </div>
          ))}
        </div>

        {/* User panel */}
        <div className="flex h-[52px] items-center gap-2 px-2" style={{ backgroundColor: discordColors.bgTertiary }}>
          <div className="relative">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#5865f2]">
              <span className="text-xs font-medium text-white">U</span>
            </div>
            <div className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2" style={{ borderColor: discordColors.bgTertiary, backgroundColor: discordColors.online }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: discordColors.textNormal }}>Username</div>
            <div className="text-xs" style={{ color: discordColors.textMuted }}>Online</div>
          </div>
          <div className="flex gap-2">
            <button type="button" style={{ color: discordColors.textMuted }}>
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>
            <button type="button" style={{ color: discordColors.textMuted }}>
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM6 11c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2a4 4 0 01-8 0H6z" />
              </svg>
            </button>
            <button type="button" style={{ color: discordColors.textMuted }}>
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscordMessage({
  message,
  sender,
  showAvatar,
  replyData,
}: {
  message: {
    id: string;
    content: string;
    timestamp: string;
    reactions?: { emoji: string; count: number }[];
    replyToId?: string;
  };
  sender: Participant;
  showAvatar: boolean;
  replyData?: {
    senderName: string;
    content: string;
    senderAvatarUrl?: string;
  };
}) {
  // Role colors
  const roleColors: Record<string, string> = {
    admin: '#f47fff',
    member: discordColors.textNormal,
    bot: discordColors.blurple,
  };

  const nameColor = roleColors[sender.role || 'member'];

  return (
    <div className={`group flex gap-4 px-4 py-0.5 hover:bg-white/[0.02] ${showAvatar ? 'mt-4' : ''}`}>
      {showAvatar
        ? (
            <div className="flex-shrink-0">
              {sender.avatarUrl
                ? (
                    <img
                      src={sender.avatarUrl}
                      alt={sender.name}
                      className="size-10 rounded-full object-cover"
                    />
                  )
                : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-[#5865f2]">
                      <span className="text-sm font-medium text-white">
                        {sender.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
            </div>
          )
        : (
            <div className="w-10 flex-shrink-0">
              <span
                className="hidden text-[10px] group-hover:inline"
                style={{ color: discordColors.textMuted }}
              >
                {message.timestamp}
              </span>
            </div>
          )}

      <div className="min-w-0 flex-1">
        {/* Reply indicator */}
        {replyData && (
          <div className="mb-1 flex items-center gap-1.5 text-xs">
            <div className="h-[10px] w-6 rounded-tl-md border-t-2 border-l-2" style={{ borderColor: discordColors.textMuted }} />
            <div className="size-4 overflow-hidden rounded-full" style={{ backgroundColor: discordColors.textMuted }}>
              {replyData.senderAvatarUrl
                ? (
                    <img src={replyData.senderAvatarUrl} alt={replyData.senderName} className="size-full object-cover" />
                  )
                : (
                    <span className="flex size-full items-center justify-center text-[8px] text-white">
                      {replyData.senderName.charAt(0).toUpperCase()}
                    </span>
                  )}
            </div>
            <span className="font-medium" style={{ color: discordColors.textMuted }}>
              {replyData.senderName}
            </span>
            <span className="truncate" style={{ color: discordColors.textMuted }}>
              {replyData.content.length > 50 ? `${replyData.content.slice(0, 50)}...` : replyData.content}
            </span>
          </div>
        )}

        {showAvatar && (
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ color: nameColor }}>
              {sender.name}
            </span>
            {sender.role === 'bot' && (
              <span className="rounded bg-[#5865f2] px-1 py-0.5 text-[10px] font-medium text-white">
                BOT
              </span>
            )}
            <span className="text-xs" style={{ color: discordColors.textMuted }}>
              {message.timestamp}
            </span>
          </div>
        )}

        <div className="text-sm" style={{ color: discordColors.textNormal }}>
          {message.content}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((reaction, idx) => (
              <button
                key={idx}
                type="button"
                className="flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs hover:border-white/20"
              >
                <span>{reaction.emoji}</span>
                <span style={{ color: discordColors.textMuted }}>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DiscordInputBar({ channelName }: { channelName: string }) {
  return (
    <div className="px-4 pb-6">
      <div
        className="flex items-center gap-4 rounded-lg px-4 py-2.5"
        style={{ backgroundColor: discordColors.bgTertiary }}
      >
        <button type="button" style={{ color: discordColors.channelIcon }}>
          <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        </button>

        <input
          type="text"
          placeholder={`Message #${channelName}`}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: discordColors.textNormal }}
          disabled
        />

        <div className="flex gap-4">
          <button type="button" style={{ color: discordColors.channelIcon }}>
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.5 3A6.5 6.5 0 0116 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 019.5 16 6.5 6.5 0 013 9.5 6.5 6.5 0 019.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z" />
            </svg>
          </button>
          <button type="button" style={{ color: discordColors.channelIcon }}>
            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DiscordMockup({
  data,
  config = {},
  currentUserId = 'user',
  showSidebar = true,
}: DiscordMockupProps) {
  const { participants, messages, chatName } = data;
  const {
    serverName = 'My Server',
    channelName = chatName || 'general',
    memberCount = 128,
    onlineCount = 42,
  } = config;

  // Get participant by ID
  const getParticipant = (id: string): Participant =>
    participants.find(p => p.id === id) || { id, name: 'Unknown' };

  // Track previous sender to determine when to show avatar
  let previousSenderId = '';

  return (
    <div
      className="flex overflow-hidden rounded-lg shadow-2xl"
      style={{ width: showSidebar ? '900px' : '640px', height: '600px', backgroundColor: discordColors.bg }}
    >
      {/* Sidebar */}
      {showSidebar && (
        <DiscordSidebar
          serverName={serverName}
          channelName={channelName}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Channel header */}
        <div
          className="flex h-12 items-center justify-between border-b border-black/20 px-4"
          style={{ backgroundColor: discordColors.bg }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: discordColors.channelIcon }}>#</span>
            <span className="font-semibold" style={{ color: discordColors.textNormal }}>{channelName}</span>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" style={{ color: discordColors.channelIcon }}>
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 18v-4h-4v4h4zm-6-4H6v4h8v-4zm6-6v4h-4v-4h4zm-6 0H6v4h8V8zm6-6v4h-4V2h4zM14 2H6v4h8V2z" />
              </svg>
            </button>
            <button type="button" style={{ color: discordColors.channelIcon }}>
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
            <div
              className="flex items-center gap-1 rounded px-2 py-1"
              style={{ backgroundColor: discordColors.bgTertiary }}
            >
              <svg className="size-4" style={{ color: discordColors.textMuted }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span className="text-xs" style={{ color: discordColors.textMuted }}>Search</span>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Welcome message */}
          <div className="mb-4 px-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#5865f2]">
              <span className="text-2xl font-bold text-white">#</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold" style={{ color: discordColors.textNormal }}>
              Welcome to #
              {channelName}
              !
            </h2>
            <p className="mt-2 text-sm" style={{ color: discordColors.textMuted }}>
              This is the start of the #
              {channelName}
              {' '}
              channel.
            </p>
          </div>

          {/* Messages */}
          {messages.map((message) => {
            const sender = getParticipant(message.senderId);
            const showAvatar = message.senderId !== previousSenderId;
            previousSenderId = message.senderId;

            // Find the replied-to message if replyToId exists
            let replyData: { senderName: string; content: string; senderAvatarUrl?: string } | undefined;
            if (message.replyToId) {
              const repliedMessage = messages.find(m => m.id === message.replyToId);
              if (repliedMessage) {
                const repliedSender = getParticipant(repliedMessage.senderId);
                replyData = {
                  senderName: repliedSender?.name || 'Unknown',
                  content: repliedMessage.content,
                  senderAvatarUrl: repliedSender?.avatarUrl,
                };
              }
            }

            return (
              <DiscordMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  timestamp: message.timestamp,
                  reactions: message.reactions,
                  replyToId: message.replyToId,
                }}
                sender={sender}
                showAvatar={showAvatar}
                replyData={replyData}
              />
            );
          })}

          {/* Typing indicator - show when any non-current user is typing */}
          {participants
            .filter(p => p.id !== currentUserId && p.isTyping)
            .map(typingParticipant => (
              <TypingIndicator
                key={`typing-${typingParticipant.id}`}
                theme="dark"
                platform="discord"
                senderName={typingParticipant.name}
                avatarUrl={typingParticipant.avatarUrl}
                showAvatar
              />
            ))}
        </div>

        {/* Input bar */}
        <DiscordInputBar channelName={channelName} />
      </div>

      {/* Member list (optional) */}
      {showSidebar && (
        <div className="w-60 overflow-y-auto" style={{ backgroundColor: discordColors.bgSecondary }}>
          <div className="px-4 py-6">
            <div className="mb-2 text-xs font-semibold uppercase" style={{ color: discordColors.channelIcon }}>
              Online —
              {' '}
              {onlineCount}
            </div>
            {participants.filter(p => p.isOnline !== false).slice(0, 5).map(participant => (
              <div key={participant.id} className="flex items-center gap-3 rounded px-2 py-1 hover:bg-white/5">
                <div className="relative">
                  {participant.avatarUrl
                    ? (
                        <img
                          src={participant.avatarUrl}
                          alt={participant.name}
                          className="size-8 rounded-full object-cover"
                        />
                      )
                    : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#5865f2]">
                          <span className="text-xs font-medium text-white">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                  <div
                    className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2"
                    style={{
                      borderColor: discordColors.bgSecondary,
                      backgroundColor: participant.isOnline ? discordColors.online : discordColors.offline,
                    }}
                  />
                </div>
                <span className="text-sm" style={{ color: discordColors.textNormal }}>{participant.name}</span>
              </div>
            ))}

            <div className="mt-6 mb-2 text-xs font-semibold uppercase" style={{ color: discordColors.channelIcon }}>
              Offline —
              {' '}
              {memberCount - onlineCount}
            </div>
            {participants.filter(p => p.isOnline === false).slice(0, 3).map(participant => (
              <div key={participant.id} className="flex items-center gap-3 rounded px-2 py-1 opacity-50 hover:bg-white/5">
                <div className="relative">
                  <div className="flex size-8 items-center justify-center rounded-full bg-gray-600">
                    <span className="text-xs font-medium text-white">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2"
                    style={{ borderColor: discordColors.bgSecondary, backgroundColor: discordColors.offline }}
                  />
                </div>
                <span className="text-sm" style={{ color: discordColors.textMuted }}>{participant.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
