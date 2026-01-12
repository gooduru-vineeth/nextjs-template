'use client';

import type { ChatAppearance, ChatMockupData, Participant, TelegramConfig } from '@/types/Mockup';
import { MessageBubble } from '../common/MessageBubble';
import { StatusBar } from '../common/StatusBar';
import { TypingIndicator } from '../common/TypingIndicator';

type TelegramMockupProps = {
  data: ChatMockupData;
  appearance: ChatAppearance;
  config?: TelegramConfig;
  currentUserId?: string;
};

function TelegramHeader({
  participant,
  isGroup,
  chatName,
  chatAvatar,
  lastSeen,
  participantCount,
  theme,
  isSecret,
}: {
  participant?: Participant;
  isGroup?: boolean;
  chatName?: string;
  chatAvatar?: string;
  lastSeen?: string;
  participantCount?: number;
  theme: 'light' | 'dark';
  isSecret?: boolean;
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#212121]' : 'bg-[#517da2]';
  const name = isGroup ? chatName : participant?.name || 'Contact';
  const avatar = isGroup ? chatAvatar : participant?.avatarUrl;
  const subtitle = isGroup
    ? `${participantCount || 0} members`
    : participant?.isTyping
      ? 'typing...'
      : participant?.isOnline
        ? 'online'
        : lastSeen || 'last seen recently';

  return (
    <div className={`flex h-14 items-center gap-3 px-4 ${bgColor}`}>
      {/* Back button */}
      <button className="text-white" type="button">
        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Avatar */}
      {avatar
        ? (
            <img
              src={avatar}
              alt={name}
              className="size-10 rounded-full object-cover"
            />
          )
        : (
            <div className={`flex size-10 items-center justify-center rounded-full ${isSecret ? 'bg-green-500' : 'bg-blue-400'}`}>
              {isSecret
                ? (
                    <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                  )
                : (
                    <span className="text-lg font-medium text-white">
                      {(name || 'C').charAt(0).toUpperCase()}
                    </span>
                  )}
            </div>
          )}

      {/* Name and status */}
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-medium text-white">{name}</span>
          {isSecret && (
            <svg className="size-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          )}
        </div>
        <div className="text-xs text-white/70">{subtitle}</div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <button className="text-white" type="button">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </button>
        <button className="text-white" type="button">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function TelegramInputBar({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#212121]' : 'bg-white';
  const inputBg = isDark ? 'bg-[#2b2b2b]' : 'bg-[#f0f0f0]';
  const textColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`flex items-center gap-2 px-2 py-2 ${bgColor}`}>
      {/* Attachment button */}
      <button className={`p-2 ${textColor}`} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 015 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 005 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
        </svg>
      </button>

      {/* Text input */}
      <div className={`flex flex-1 items-center gap-2 rounded-full px-4 py-2 ${inputBg}`}>
        <span className={textColor}>Message</span>
        {/* Emoji button inside input */}
        <button className={`ml-auto ${textColor}`} type="button">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </button>
      </div>

      {/* Voice message button */}
      <button className={`p-2 ${textColor}`} type="button">
        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
        </svg>
      </button>
    </div>
  );
}

export function TelegramMockup({
  data,
  appearance,
  config = {},
  currentUserId = 'user',
}: TelegramMockupProps) {
  const { participants, messages, chatName, chatAvatar, isGroup, lastSeen } = data;
  const {
    theme = 'light',
    wallpaper,
    showTimestamps = true,
    showAvatars = true,
    showStatus = true,
  } = appearance;
  const { time = '9:41', batteryLevel = 100, signalStrength = 4, carrier, isSecret = false } = config;

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-[#0e1621]' : 'bg-[#c8d9e5]';

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

      {/* Telegram Header */}
      <TelegramHeader
        participant={otherParticipant}
        isGroup={isGroup}
        chatName={chatName}
        chatAvatar={chatAvatar}
        lastSeen={lastSeen}
        participantCount={participants.length}
        theme={theme}
        isSecret={isSecret}
      />

      {/* Chat Area */}
      <div
        className={`flex-1 overflow-y-auto py-2 ${bgColor}`}
        style={{
          height: 'calc(100% - 11rem)',
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
              platform="telegram"
              showAvatar={showAvatars && isGroup && !isSender}
              avatarUrl={participant?.avatarUrl}
              senderName={isGroup && !isSender ? participant?.name : undefined}
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
              platform="telegram"
              senderName={typingParticipant.name}
              avatarUrl={typingParticipant.avatarUrl}
              showAvatar={showAvatars && isGroup}
            />
          ))}
      </div>

      {/* Input Bar */}
      <TelegramInputBar theme={theme} />
    </div>
  );
}
