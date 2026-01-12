'use client';

import type { ChatAppearance, ChatMockupData, iMessageConfig, Participant } from '@/types/Mockup';
import { MessageBubble } from '../common/MessageBubble';
import { StatusBar } from '../common/StatusBar';
import { TypingIndicator } from '../common/TypingIndicator';

type iMessageMockupProps = {
  data: ChatMockupData;
  appearance: ChatAppearance;
  config?: iMessageConfig;
  currentUserId?: string;
};

function IMessageHeader({
  participant,
  isGroup,
  chatName,
  chatAvatar,
  theme,
}: {
  participant?: Participant;
  isGroup?: boolean;
  chatName?: string;
  chatAvatar?: string;
  theme: 'light' | 'dark';
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-[#f6f6f6]';
  const textColor = isDark ? 'text-white' : 'text-black';
  const name = isGroup ? chatName : participant?.name || 'Contact';
  const avatar = isGroup ? chatAvatar : participant?.avatarUrl;

  return (
    <div className={`${bgColor}`}>
      {/* Top navigation */}
      <div className="flex h-11 items-center justify-between px-4">
        <button className="flex items-center text-[#007aff]" type="button">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Messages</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="text-[#007aff]" type="button">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z" />
            </svg>
          </button>
          <button className="text-[#007aff]" type="button">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.54 3H5.26A2.26 2.26 0 003 5.26v10.28A2.26 2.26 0 005.26 18h4.73v3l4.95-3h.6A2.26 2.26 0 0018 15.54V5.26A2.26 2.26 0 0015.54 3z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Profile section */}
      <div className="flex flex-col items-center pt-2 pb-4">
        {/* Avatar */}
        {avatar
          ? (
              <img
                src={avatar}
                alt={name}
                className="size-16 rounded-full object-cover"
              />
            )
          : (
              <div className="flex size-16 items-center justify-center rounded-full bg-gray-400">
                <svg className="size-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

        {/* Name */}
        <div className={`mt-2 text-base font-semibold ${textColor}`}>{name}</div>

        {/* Action buttons */}
        <div className="mt-3 flex gap-8">
          <button className="flex flex-col items-center" type="button">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#e9e9eb]">
              <svg className="size-5 text-[#007aff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <span className="mt-1 text-xs text-[#007aff]">call</span>
          </button>

          <button className="flex flex-col items-center" type="button">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#e9e9eb]">
              <svg className="size-5 text-[#007aff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            </div>
            <span className="mt-1 text-xs text-[#007aff]">FaceTime</span>
          </button>

          <button className="flex flex-col items-center" type="button">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#e9e9eb]">
              <svg className="size-5 text-[#007aff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span className="mt-1 text-xs text-[#007aff]">info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function IMessageInputBar({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-[#f6f6f6]';

  return (
    <div className={`flex items-center gap-2 px-3 py-2 ${bgColor}`}>
      {/* Plus button */}
      <button className="text-[#007aff]" type="button">
        <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Text input */}
      <div className={`flex flex-1 items-center rounded-full border px-4 py-2 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>
        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>iMessage</span>
      </div>

      {/* Send button */}
      <button className="flex size-8 items-center justify-center rounded-full bg-[#007aff] text-white" type="button">
        <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
}

export function iMessageMockup({
  data,
  appearance,
  config = {},
  currentUserId = 'user',
}: iMessageMockupProps) {
  const { participants, messages, chatName, chatAvatar, isGroup } = data;
  const {
    theme = 'light',
    wallpaper,
    showTimestamps = true,
    showAvatars = true,
    showStatus = true,
  } = appearance;
  const { time = '9:41', batteryLevel = 100, signalStrength = 4, carrier } = config;

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-black' : 'bg-white';

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

      {/* iMessage Header */}
      <IMessageHeader
        participant={otherParticipant}
        isGroup={isGroup}
        chatName={chatName}
        chatAvatar={chatAvatar}
        theme={theme}
      />

      {/* Chat Area */}
      <div
        className={`flex-1 overflow-y-auto py-4 ${bgColor}`}
        style={{
          height: 'calc(100% - 16rem)',
          // Handle both gradient presets and image URLs
          background: wallpaper?.startsWith('linear-gradient') ? wallpaper : undefined,
          backgroundImage: wallpaper && !wallpaper.startsWith('linear-gradient')
            ? (wallpaper.startsWith('url(') ? wallpaper : `url(${wallpaper})`)
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Date separator */}
        <div className="mb-4 flex justify-center">
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Today
          </span>
        </div>

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
              platform="imessage"
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
              platform="imessage"
              senderName={typingParticipant.name}
              avatarUrl={typingParticipant.avatarUrl}
              showAvatar={showAvatars && isGroup}
            />
          ))}
      </div>

      {/* Input Bar */}
      <IMessageInputBar theme={theme} />
    </div>
  );
}

// Export with capitalized name for consistency
export { iMessageMockup as IMessageMockup };
