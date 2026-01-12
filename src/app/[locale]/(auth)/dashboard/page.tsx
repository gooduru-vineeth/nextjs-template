import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { MockupGridEnhanced } from '@/components/dashboard/MockupGridEnhanced';
import { getCurrentUser } from '@/libs/Auth';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard - MockFlow',
  };
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
              {user?.name ? `, ${user.name}` : ''}
              !
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your mockups and create new designs
            </p>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Mockup
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Actions - Chat */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Chat Mockups
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {[
              { name: 'WhatsApp', icon: '💬', platform: 'whatsapp' },
              { name: 'iMessage', icon: '💭', platform: 'imessage' },
              { name: 'Discord', icon: '🎮', platform: 'discord' },
              { name: 'Telegram', icon: '✈️', platform: 'telegram' },
              { name: 'Messenger', icon: '💬', platform: 'messenger' },
              { name: 'Slack', icon: '💼', platform: 'slack' },
            ].map(item => (
              <Link
                key={item.platform}
                href={`/editor?platform=${item.platform}`}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="mb-2 text-3xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions - AI */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            AI Chat Mockups
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'ChatGPT', icon: '🤖', platform: 'chatgpt' },
              { name: 'Claude', icon: '🧠', platform: 'claude' },
              { name: 'Gemini', icon: '✨', platform: 'gemini' },
              { name: 'Perplexity', icon: '🔍', platform: 'perplexity' },
            ].map(item => (
              <Link
                key={item.platform}
                href={`/editor/ai?platform=${item.platform}`}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-purple-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="mb-2 text-3xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions - Social Media */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Social Media Mockups
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              { name: 'LinkedIn', icon: '💼', platform: 'linkedin' },
              { name: 'Instagram', icon: '📷', platform: 'instagram' },
              { name: 'Twitter/X', icon: '🐦', platform: 'twitter' },
            ].map(item => (
              <Link
                key={item.platform}
                href={`/editor/social?platform=${item.platform}`}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-green-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="mb-2 text-3xl">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* All Mockups */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Mockups
            </h2>
          </div>
          <MockupGridEnhanced initialLimit={12} />
        </div>

        {/* Stats */}
        <DashboardStats />
      </div>
    </div>
  );
}
