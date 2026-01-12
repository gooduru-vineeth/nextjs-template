'use client';

import type { ChatAppearance, ChatMockupData, SlackConfig } from '@/types/Mockup';
import { MessageBubble } from '../common/MessageBubble';
import { TypingIndicator } from '../common/TypingIndicator';

type SlackMockupProps = {
  data: ChatMockupData;
  appearance: ChatAppearance;
  config?: SlackConfig;
  currentUserId?: string;
  showSidebar?: boolean;
};

function SlackSidebar({
  workspaceName,
  channelName,
  channelType,
  isStarred,
  theme,
}: {
  workspaceName?: string;
  channelName?: string;
  channelType?: 'public' | 'private' | 'dm';
  isStarred?: boolean;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#1a1d21]' : 'bg-[#3f0e40]';
  const hoverBg = isDark ? 'hover:bg-[#26282c]' : 'hover:bg-[#350d36]';
  const activeBg = isDark ? 'bg-[#1264a3]' : 'bg-[#1264a3]';
  const textColor = isDark ? 'text-gray-300' : 'text-white/80';
  const activeTextColor = 'text-white';

  const channels = [
    { name: 'general', type: 'public' as const },
    { name: 'random', type: 'public' as const },
    { name: 'announcements', type: 'public' as const },
    { name: channelName || 'team', type: channelType || ('public' as const) },
  ];

  return (
    <div className={`flex w-64 flex-col ${bgColor}`}>
      {/* Workspace header */}
      <div className={`flex items-center justify-between border-b px-4 py-3 ${isDark ? 'border-gray-700' : 'border-white/10'}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{workspaceName || 'Workspace'}</span>
          <svg className="size-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <button className={`rounded p-1 ${hoverBg}`} type="button">
          <svg className="size-5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>

      {/* Threads */}
      <div className={`flex items-center gap-2 px-4 py-2 ${hoverBg}`}>
        <svg className="size-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className={textColor}>Threads</span>
      </div>

      {/* DMs */}
      <div className={`flex items-center gap-2 px-4 py-2 ${hoverBg}`}>
        <svg className="size-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className={textColor}>Direct messages</span>
      </div>

      {/* Channels section */}
      <div className="mt-4">
        <div className={`flex items-center justify-between px-4 py-1 ${hoverBg}`}>
          <span className={`text-sm font-medium ${textColor}`}>Channels</span>
          <button className="text-white/60" type="button">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        </div>

        {/* Channel list */}
        {channels.map(channel => (
          <div
            key={channel.name}
            className={`flex items-center gap-2 px-4 py-1.5 ${
              channel.name === channelName ? activeBg : hoverBg
            }`}
          >
            {channel.type === 'private'
              ? (
                  <svg className="size-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                )
              : (
                  <span className="text-sm text-white/60">#</span>
                )}
            <span className={channel.name === channelName ? activeTextColor : textColor}>
              {channel.name}
            </span>
            {isStarred && channel.name === channelName && (
              <svg className="ml-auto size-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlackHeader({
  channelName,
  channelType,
  isStarred,
  participantCount,
  theme,
}: {
  channelName?: string;
  channelType?: 'public' | 'private' | 'dm';
  isStarred?: boolean;
  participantCount?: number;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#1a1d21]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtextColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`flex h-12 items-center justify-between border-b px-4 ${bgColor} ${borderColor}`}>
      <div className="flex items-center gap-2">
        {channelType === 'private'
          ? (
              <svg className={`size-4 ${subtextColor}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            )
          : channelType === 'dm'
            ? null
            : (
                <span className={`text-lg font-bold ${subtextColor}`}>#</span>
              )}
        <span className={`font-bold ${textColor}`}>{channelName || 'general'}</span>
        {isStarred && (
          <button className="text-gray-400 hover:text-yellow-400" type="button">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        )}
        <svg className={`size-4 ${subtextColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="flex items-center gap-3">
        {/* Members */}
        <button className={`flex items-center gap-1 ${subtextColor}`} type="button">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-sm">{participantCount || 2}</span>
        </button>

        {/* Huddle */}
        <button className={subtextColor} type="button">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>

        {/* Pins */}
        <button className={subtextColor} type="button">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function SlackInputBar({
  channelName,
  theme,
}: {
  channelName?: string;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#1a1d21]' : 'bg-white';
  const inputBg = isDark ? 'bg-[#222529]' : 'bg-white';
  const borderColor = isDark ? 'border-gray-600' : 'border-gray-300';
  const textColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const iconColor = isDark ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`px-4 py-3 ${bgColor}`}>
      <div className={`flex items-center rounded-lg border px-3 py-2 ${inputBg} ${borderColor}`}>
        {/* Plus button */}
        <button className={iconColor} type="button">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>

        {/* Input text */}
        <div className={`mx-3 flex-1 ${textColor}`}>
          Message #
          {channelName || 'general'}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className={iconColor} type="button">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
          <button className={iconColor} type="button">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
            </svg>
          </button>
          <button className={iconColor} type="button">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
            </svg>
          </button>
          <button className="rounded bg-green-700 p-1.5 text-white" type="button">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function SlackMockup({
  data,
  appearance,
  config = {},
  currentUserId = 'user',
  showSidebar = true,
}: SlackMockupProps) {
  const { participants, messages, chatName } = data;
  const {
    theme = 'light',
    showTimestamps = true,
    showAvatars = true,
    showStatus = true,
  } = appearance;
  const { workspaceName, channelName = chatName, channelType = 'public', isStarred } = config;

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#1a1d21]' : 'bg-white';

  // Get participant by ID
  const getParticipant = (id: string) => participants.find(p => p.id === id);

  return (
    <div className="flex overflow-hidden rounded-lg shadow-2xl" style={{ width: showSidebar ? '900px' : '636px', height: '600px' }}>
      {/* Sidebar */}
      {showSidebar && (
        <SlackSidebar
          workspaceName={workspaceName}
          channelName={channelName}
          channelType={channelType}
          isStarred={isStarred}
          theme={theme}
        />
      )}

      {/* Main content */}
      <div className={`flex flex-1 flex-col ${bgColor}`}>
        {/* Header */}
        <SlackHeader
          channelName={channelName}
          channelType={channelType}
          isStarred={isStarred}
          participantCount={participants.length}
          theme={theme}
        />

        {/* Messages area */}
        <div className={`flex-1 overflow-y-auto px-4 py-4 ${bgColor}`}>
          {messages.map((message) => {
            const isSender = message.senderId === currentUserId;
            const participant = getParticipant(message.senderId);

            // Find the replied-to message if replyToId exists
            let replyData: { senderName: string; content: string; isSenderReply?: boolean } | undefined;
            if (message.replyToId) {
              const repliedMessage = messages.find(m => m.id === message.replyToId);
              if (repliedMessage) {
                const repliedParticipant = getParticipant(repliedMessage.senderId);
                replyData = {
                  senderName: repliedParticipant?.name || 'Unknown',
                  content: repliedMessage.content,
                  isSenderReply: repliedMessage.senderId === currentUserId,
                };
              }
            }

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isSender={isSender}
                theme={theme}
                platform="slack"
                showAvatar={showAvatars}
                avatarUrl={participant?.avatarUrl}
                senderName={participant?.name}
                showStatus={showStatus && showTimestamps}
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
                theme={theme}
                platform="slack"
                senderName={typingParticipant.name}
                avatarUrl={typingParticipant.avatarUrl}
                showAvatar={showAvatars}
              />
            ))}
        </div>

        {/* Input Bar */}
        <SlackInputBar channelName={channelName} theme={theme} />
      </div>
    </div>
  );
}
