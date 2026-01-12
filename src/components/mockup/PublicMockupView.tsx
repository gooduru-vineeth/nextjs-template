'use client';

import type { DeviceType } from '@/components/mockups/common/DeviceFrame';
import type { AIAppearance, AIMockupData, ChatAppearance, ChatMockupData, SocialAppearance, SocialMockupData } from '@/types/Mockup';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChatGPTMockup } from '@/components/mockups/ai/ChatGPTMockup';
import { ClaudeMockup } from '@/components/mockups/ai/ClaudeMockup';
import { GeminiMockup } from '@/components/mockups/ai/GeminiMockup';
import { PerplexityMockup } from '@/components/mockups/ai/PerplexityMockup';
import { DiscordMockup } from '@/components/mockups/chat/DiscordMockup';
import { IMessageMockup } from '@/components/mockups/chat/iMessageMockup';
import { MessengerMockup } from '@/components/mockups/chat/MessengerMockup';
import { SlackMockup } from '@/components/mockups/chat/SlackMockup';
import { TelegramMockup } from '@/components/mockups/chat/TelegramMockup';
import { WhatsAppMockup } from '@/components/mockups/chat/WhatsAppMockup';
import { DeviceFrame } from '@/components/mockups/common/DeviceFrame';
import { InstagramMockup } from '@/components/mockups/social/InstagramMockup';
import { LinkedInMockup } from '@/components/mockups/social/LinkedInMockup';
import { TwitterMockup } from '@/components/mockups/social/TwitterMockup';

type PublicMockupViewProps = {
  mockup: {
    id: number;
    name: string;
    type: 'chat' | 'ai' | 'social';
    platform: string;
    data: Record<string, unknown>;
    appearance: Record<string, unknown>;
    createdAt: string;
  };
};

const platformIcons: Record<string, string> = {
  whatsapp: '💬',
  imessage: '💭',
  discord: '🎮',
  telegram: '✈️',
  messenger: '💬',
  slack: '💼',
  chatgpt: '🤖',
  claude: '🧠',
  gemini: '✨',
  perplexity: '🔍',
  linkedin: '💼',
  instagram: '📷',
  twitter: '🐦',
};

export function PublicMockupView({ mockup }: PublicMockupViewProps) {
  const [copied, setCopied] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<DeviceType>('iphone-15-pro');
  const mockupRef = useRef<HTMLDivElement>(null);

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMockup = () => {
    const { type, platform, data, appearance } = mockup;

    if (type === 'chat') {
      const chatData = data as unknown as ChatMockupData;
      const chatAppearance = appearance as unknown as ChatAppearance;

      switch (platform) {
        case 'whatsapp':
          return <WhatsAppMockup data={chatData} appearance={chatAppearance} currentUserId="user" />;
        case 'imessage':
          return <IMessageMockup data={chatData} appearance={chatAppearance} currentUserId="user" />;
        case 'discord':
          return <DiscordMockup data={chatData} currentUserId="user" showSidebar={false} />;
        case 'telegram':
          return <TelegramMockup data={chatData} appearance={chatAppearance} currentUserId="user" />;
        case 'messenger':
          return <MessengerMockup data={chatData} appearance={chatAppearance} currentUserId="user" />;
        case 'slack':
          return <SlackMockup data={chatData} appearance={chatAppearance} currentUserId="user" showSidebar={false} />;
        default:
          return <WhatsAppMockup data={chatData} appearance={chatAppearance} currentUserId="user" />;
      }
    }

    if (type === 'ai') {
      const aiData = data as unknown as AIMockupData;
      const aiAppearance = appearance as unknown as AIAppearance;

      switch (platform) {
        case 'chatgpt':
          return <ChatGPTMockup data={aiData} appearance={aiAppearance} />;
        case 'claude':
          return <ClaudeMockup data={aiData} appearance={aiAppearance} />;
        case 'gemini':
          return <GeminiMockup data={aiData} appearance={aiAppearance} />;
        case 'perplexity':
          return <PerplexityMockup data={aiData} appearance={aiAppearance} />;
        default:
          return <ChatGPTMockup data={aiData} appearance={aiAppearance} />;
      }
    }

    if (type === 'social') {
      const socialData = data as unknown as SocialMockupData;
      const socialAppearance = appearance as unknown as SocialAppearance;

      switch (platform) {
        case 'linkedin':
          return <LinkedInMockup data={socialData} appearance={socialAppearance} />;
        case 'instagram':
          return <InstagramMockup data={socialData} appearance={socialAppearance} />;
        case 'twitter':
          return <TwitterMockup data={socialData} appearance={socialAppearance} />;
        default:
          return <LinkedInMockup data={socialData} appearance={socialAppearance} />;
      }
    }

    return <div>Unsupported mockup type</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">MockFlow</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{platformIcons[mockup.platform] || '📄'}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{mockup.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyShareLink}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {copied
                ? (
                    <>
                      <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  )
                : (
                    <>
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </>
                  )}
            </button>
            <Link
              href="/editor"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Device Frame Selector */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {(['none', 'iphone-15-pro', 'iphone-14', 'pixel-8', 'galaxy-s24'] as DeviceType[]).map(frame => (
            <button
              key={frame}
              type="button"
              onClick={() => setDeviceFrame(frame)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                deviceFrame === frame
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {frame === 'none' ? 'No Frame' : frame.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Mockup Preview */}
        <div className="flex items-center justify-center">
          <div
            ref={mockupRef}
            className="transform transition-transform"
            style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))' }}
          >
            <DeviceFrame device={deviceFrame}>
              {renderMockup()}
            </DeviceFrame>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="capitalize">{mockup.platform}</span>
          <span>•</span>
          <span className="capitalize">
            {mockup.type}
            {' '}
            Mockup
          </span>
          <span>•</span>
          <span>
            Created
            {new Date(mockup.createdAt).toLocaleDateString()}
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white/50 py-6 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created with
            {' '}
            <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
              MockFlow
            </Link>
            {' '}
            — Create professional mockups in minutes
          </p>
        </div>
      </footer>
    </div>
  );
}
