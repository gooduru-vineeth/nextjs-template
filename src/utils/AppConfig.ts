import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'MockFlow',
  description: 'Create professional mockups in minutes',
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix,
};

// Supported mockup platforms
export const MockupPlatforms = {
  chat: {
    whatsapp: { name: 'WhatsApp', icon: 'whatsapp' },
    imessage: { name: 'iMessage', icon: 'imessage' },
    discord: { name: 'Discord', icon: 'discord' },
    telegram: { name: 'Telegram', icon: 'telegram' },
    messenger: { name: 'Messenger', icon: 'messenger' },
    slack: { name: 'Slack', icon: 'slack' },
  },
  ai: {
    chatgpt: { name: 'ChatGPT', icon: 'chatgpt' },
    claude: { name: 'Claude', icon: 'claude' },
    gemini: { name: 'Gemini', icon: 'gemini' },
    perplexity: { name: 'Perplexity', icon: 'perplexity' },
  },
  social: {
    linkedin: { name: 'LinkedIn', icon: 'linkedin' },
    instagram: { name: 'Instagram', icon: 'instagram' },
    twitter: { name: 'X/Twitter', icon: 'twitter' },
    facebook: { name: 'Facebook', icon: 'facebook' },
    tiktok: { name: 'TikTok', icon: 'tiktok' },
  },
} as const;

export type ChatPlatform = keyof typeof MockupPlatforms.chat;
export type AIPlatform = keyof typeof MockupPlatforms.ai;
export type SocialPlatform = keyof typeof MockupPlatforms.social;
export type MockupPlatform = ChatPlatform | AIPlatform | SocialPlatform;
