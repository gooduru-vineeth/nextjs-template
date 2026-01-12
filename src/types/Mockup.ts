// Types for mockup data structures

// Common types
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ThemeMode = 'light' | 'dark';

// Participant in a conversation
export type Participant = {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  role?: 'admin' | 'member' | 'bot';
};

// Base message interface
export type BaseMessage = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO string or custom format
  status?: MessageStatus;
  isDeleted?: boolean;
  replyToId?: string;
  reactions?: MessageReaction[];
};

export type MessageReaction = {
  emoji: string;
  count: number;
  userIds?: string[];
};

// Chat platform specific message types
export type ChatMessage = {
  type: 'text' | 'image' | 'voice' | 'video' | 'document' | 'sticker' | 'location';
  mediaUrl?: string;
  mediaPreview?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string; // For voice/video
  isEdited?: boolean; // Shows "edited" indicator
} & BaseMessage;

// AI chat specific message
export type AIMessage = {
  role: 'user' | 'assistant' | 'system';
  model?: string;
  codeBlocks?: CodeBlock[];
  artifacts?: Artifact[];
  isStreaming?: boolean;
  tokenCount?: number;
} & BaseMessage;

export type CodeBlock = {
  language: string;
  code: string;
  filename?: string;
};

export type Artifact = {
  type: 'code' | 'document' | 'image' | 'chart';
  title: string;
  content: string;
};

// Social media post
export type SocialPost = {
  id: string;
  authorId: string;
  content: string;
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | 'carousel' | 'poll';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  views?: number;
  isVerified?: boolean;
  hashtags?: string[];
  mentions?: string[];
};

export type SocialComment = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: SocialComment[];
};

// Appearance settings
export type ChatAppearance = {
  theme: ThemeMode;
  wallpaper?: string;
  bubbleColorSender?: string;
  bubbleColorReceiver?: string;
  fontSize?: 'small' | 'medium' | 'large';
  showTimestamps?: boolean;
  showAvatars?: boolean;
  showStatus?: boolean;
  deviceFrame?: 'iphone' | 'android' | 'none';
};

export type AIAppearance = {
  theme: ThemeMode;
  showSidebar?: boolean;
  showModelSelector?: boolean;
  showTokenCount?: boolean;
  codeTheme?: 'github' | 'dracula' | 'monokai' | 'vscode';
};

export type SocialAppearance = {
  theme: ThemeMode;
  showEngagement?: boolean;
  showComments?: boolean;
  showVerified?: boolean;
  deviceFrame?: 'iphone' | 'android' | 'none';
};

// Full mockup data structures
export type ChatMockupData = {
  participants: Participant[];
  messages: ChatMessage[];
  chatName?: string;
  chatAvatar?: string;
  isGroup?: boolean;
  lastSeen?: string;
};

export type AIMockupData = {
  messages: AIMessage[];
  systemPrompt?: string;
  model: string;
  conversationTitle?: string;
};

export type SocialMockupData = {
  author: Participant;
  post: SocialPost;
  comments?: SocialComment[];
};

// Union types for mockup data
export type MockupData = ChatMockupData | AIMockupData | SocialMockupData;
export type MockupAppearance = ChatAppearance | AIAppearance | SocialAppearance;

// Platform-specific configurations
export type WhatsAppConfig = {
  batteryLevel?: number;
  signalStrength?: number;
  carrier?: string;
  time?: string;
  isEncrypted?: boolean;
};

export type iMessageConfig = {
  batteryLevel?: number;
  signalStrength?: number;
  carrier?: string;
  time?: string;
  isFaceTime?: boolean;
};

export type DiscordConfig = {
  serverName?: string;
  channelName?: string;
  channelType?: 'text' | 'voice' | 'thread';
  memberCount?: number;
  onlineCount?: number;
};

export type SlackConfig = {
  workspaceName?: string;
  channelName?: string;
  channelType?: 'public' | 'private' | 'dm';
  isStarred?: boolean;
};

export type TelegramConfig = {
  batteryLevel?: number;
  signalStrength?: number;
  carrier?: string;
  time?: string;
  isSecret?: boolean;
  lastSeen?: string;
};

export type MessengerConfig = {
  batteryLevel?: number;
  signalStrength?: number;
  carrier?: string;
  time?: string;
  isActive?: boolean;
  lastActive?: string;
};

// Export options
export type ExportOptions = {
  format: 'png' | 'jpg' | 'svg' | 'pdf' | 'gif';
  scale: 1 | 2 | 3;
  quality?: number; // 0-100 for jpg
  transparentBackground?: boolean;
  includeDeviceFrame?: boolean;
  watermark?: boolean;
  cropToContent?: boolean;
};

// Helper type to ensure type safety with database jsonb fields
export type MockupType = 'chat' | 'ai' | 'social';
export type MockupPlatform
  = | 'whatsapp'
    | 'imessage'
    | 'discord'
    | 'telegram'
    | 'messenger'
    | 'slack'
    | 'chatgpt'
    | 'claude'
    | 'gemini'
    | 'perplexity'
    | 'linkedin'
    | 'instagram'
    | 'twitter'
    | 'facebook'
    | 'tiktok';
