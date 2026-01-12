'use client';

import type { ChatAppearance, ChatMockupData, MessengerConfig, Participant } from '@/types/Mockup';
import { MessageBubble } from '../common/MessageBubble';
import { StatusBar } from '../common/StatusBar';
import { TypingIndicator } from '../common/TypingIndicator';

type MessengerMockupProps = {
  data: ChatMockupData;
  appearance: ChatAppearance;
  config?: MessengerConfig;
  currentUserId?: string;
};

function MessengerHeader({
  participant,
  isGroup,
  chatName,
  chatAvatar,
  isActive,
  lastActive,
  participantCount,
  theme,
}: {
  participant?: Participant;
  isGroup?: boolean;
  chatName?: string;
  chatAvatar?: string;
  isActive?: boolean;
  lastActive?: string;
  participantCount?: number;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#242526]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-black';
  const subtextColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const name = isGroup ? chatName : participant?.name || 'Contact';
  const avatar = isGroup ? chatAvatar : participant?.avatarUrl;
  const online = participant?.isOnline || isActive;
  const subtitle = isGroup
    ? `${participantCount || 0} members`
    : participant?.isTyping
      ? 'Typing...'
      : online
        ? 'Active now'
        : lastActive || 'Active recently';

  return (
    <div className={`flex h-16 items-center gap-3 border-b px-4 ${bgColor} ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Back button */}
      <button className={`${isDark ? 'text-[#0084ff]' : 'text-[#0084ff]'}`} type="button">
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Avatar with online indicator */}
      <div className="relative">
        {avatar
          ? (
              <img
                src={avatar}
                alt={name}
                className="size-10 rounded-full object-cover"
              />
            )
          : (
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0084ff]">
                <span className="text-lg font-medium text-white">
                  {(name || 'C').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
        {online && (
          <div className={`absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 bg-green-500 ${isDark ? 'border-[#242526]' : 'border-white'}`} />
        )}
      </div>

      {/* Name and status */}
      <div className="flex-1">
        <div className={`text-base font-semibold ${textColor}`}>{name}</div>
        <div className={`text-xs ${subtextColor}`}>{subtitle}</div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button className="text-[#0084ff]" type="button">
          <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </button>
        <button className="text-[#0084ff]" type="button">
          <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </button>
        <button className="text-[#0084ff]" type="button">
          <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function MessengerInputBar({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#242526]' : 'bg-white';
  const inputBg = isDark ? 'bg-[#3a3b3c]' : 'bg-[#f0f2f5]';
  const textColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const iconColor = isDark ? 'text-[#0084ff]' : 'text-[#0084ff]';

  return (
    <div className={`flex items-center gap-2 border-t px-2 py-3 ${bgColor} ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      {/* Grid menu button */}
      <button className={iconColor} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
        </svg>
      </button>

      {/* Camera button */}
      <button className={iconColor} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 15h-3v-2h3v-3h2v3h2v2h-2v3h-2v-3z" />
        </svg>
      </button>

      {/* Image button */}
      <button className={iconColor} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </button>

      {/* Mic button */}
      <button className={iconColor} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
        </svg>
      </button>

      {/* Text input */}
      <div className={`flex flex-1 items-center rounded-full px-4 py-2.5 ${inputBg}`}>
        <span className={textColor}>Aa</span>
        <button className={`ml-auto ${textColor}`} type="button">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </button>
      </div>

      {/* Like/thumbs up button */}
      <button className={iconColor} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
        </svg>
      </button>
    </div>
  );
}

export function MessengerMockup({
  data,
  appearance,
  config = {},
  currentUserId = 'user',
}: MessengerMockupProps) {
  const { participants, messages, chatName, chatAvatar, isGroup } = data;
  const {
    theme = 'light',
    wallpaper,
    showTimestamps = true,
    showAvatars = true,
    showStatus = true,
  } = appearance;
  const { time = '9:41', batteryLevel = 100, signalStrength = 4, carrier, isActive, lastActive } = config;

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#242526]' : 'bg-white';

  // Find the other participant for 1:1 chats
  const otherParticipant = participants.find(p => p.id !== currentUserId);

  // Get participant by ID
  const getParticipant = (id: string) => participants.find(p => p.id === id);

  return (
    <div className="w-[375px] overflow-hidden rounded-[40px] shadow-2xl" style={{ height: '812px' }}>
      {/* Status Bar */}
      <StatusBar
        time={time}
        batteryLevel={batteryLevel}
        signalStrength={signalStrength}
        carrier={carrier}
        theme={theme}
        variant="ios"
      />

      {/* Messenger Header */}
      <MessengerHeader
        participant={otherParticipant}
        isGroup={isGroup}
        chatName={chatName}
        chatAvatar={chatAvatar}
        isActive={isActive}
        lastActive={lastActive}
        participantCount={participants.length}
        theme={theme}
      />

      {/* Chat Area */}
      <div
        className={`flex-1 overflow-y-auto py-2 ${bgColor}`}
        style={{
          height: 'calc(100% - 12rem)',
          // Handle both gradient presets and image URLs
          background: wallpaper?.startsWith('linear-gradient') ? wallpaper : undefined,
          backgroundImage: wallpaper && !wallpaper.startsWith('linear-gradient')
            ? (wallpaper.startsWith('url(') ? wallpaper : `url(${wallpaper})`)
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Messages */}
        {messages.map((message, index) => {
          const isSender = message.senderId === currentUserId;
          const participant = getParticipant(message.senderId);
          const isLastFromSender = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;

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
              platform="messenger"
              showAvatar={showAvatars && isLastFromSender && !isSender}
              avatarUrl={participant?.avatarUrl}
              senderName={isGroup && !isSender ? participant?.name : undefined}
              showStatus={showStatus && showTimestamps && isLastFromSender && isSender}
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
              platform="messenger"
              senderName={typingParticipant.name}
              avatarUrl={typingParticipant.avatarUrl}
              showAvatar={showAvatars}
            />
          ))}
      </div>

      {/* Input Bar */}
      <MessengerInputBar theme={theme} />
    </div>
  );
}
