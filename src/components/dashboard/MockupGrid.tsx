'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Mockup = {
  id: number;
  name: string;
  type: 'chat' | 'ai' | 'social';
  platform: string;
  thumbnailUrl: string | null;
  updatedAt: string;
  isPublic: boolean;
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

function formatTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return then.toLocaleDateString();
}

function getEditorPath(type: string, platform: string): string {
  switch (type) {
    case 'ai':
      return `/editor/ai?platform=${platform}`;
    case 'social':
      return `/editor/social?platform=${platform}`;
    default:
      return `/editor?platform=${platform}`;
  }
}

export function MockupGrid() {
  const [mockups, setMockups] = useState<Mockup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMockups() {
      try {
        const response = await fetch('/api/mockups?limit=6');
        if (!response.ok) {
          throw new Error('Failed to fetch mockups');
        }
        const data = await response.json();
        setMockups(data.mockups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mockups');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMockups();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this mockup?')) {
      return;
    }

    try {
      const response = await fetch(`/api/mockups/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete mockup');
      }
      setMockups(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete mockup');
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="aspect-[4/3] animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-700 underline hover:no-underline dark:text-red-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (mockups.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-600 dark:bg-gray-800/50">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <svg className="size-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No mockups yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first mockup
        </p>
        <Link
          href="/editor"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Mockup
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockups.map(mockup => (
        <div
          key={mockup.id}
          className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            {mockup.thumbnailUrl
              ? (
                  <img
                    src={mockup.thumbnailUrl}
                    alt={mockup.name}
                    className="size-full object-cover"
                  />
                )
              : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl opacity-30">
                      {platformIcons[mockup.platform] || '📄'}
                    </span>
                  </div>
                )}
            {/* Public badge */}
            {mockup.isPublic && (
              <div className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                Public
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Link
                href={`${getEditorPath(mockup.type, mockup.platform)}&id=${mockup.id}`}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                Edit
              </Link>
              {mockup.isPublic && (
                <Link
                  href={`/mockup/${mockup.id}`}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View
                </Link>
              )}
              <button
                type="button"
                onClick={() => handleDelete(mockup.id)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">{mockup.name}</h3>
              {mockup.isPublic && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/mockup/${mockup.id}`);
                    alert('Share link copied to clipboard!');
                  }}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                  title="Copy share link"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="capitalize">{mockup.platform}</span>
              <span>•</span>
              <span>{formatTimeAgo(mockup.updatedAt)}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Create new card */}
      <Link
        href="/editor"
        className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800/50"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <svg className="size-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Create New</span>
      </Link>
    </div>
  );
}
