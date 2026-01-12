'use client';

import { useState } from 'react';

type ChangeType = 'feature' | 'improvement' | 'fix' | 'breaking';

type ChangelogEntry = {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: {
    type: ChangeType;
    text: string;
  }[];
  highlights?: string[];
};

const changelog: ChangelogEntry[] = [
  {
    id: 'v2.5.0',
    version: '2.5.0',
    date: 'Jan 10, 2026',
    title: 'Pinterest Mockups & Export Improvements',
    description: 'This release brings Pinterest mockups and significant improvements to our export system.',
    changes: [
      { type: 'feature', text: 'Added Pinterest pin mockup templates' },
      { type: 'feature', text: 'New YouTube video card mockup' },
      { type: 'improvement', text: 'Faster PNG export with better compression' },
      { type: 'improvement', text: 'Enhanced device frame rendering quality' },
      { type: 'fix', text: 'Fixed dark mode toggle not persisting' },
      { type: 'fix', text: 'Resolved emoji rendering issues on Windows' },
    ],
    highlights: ['Pinterest mockups', 'YouTube mockups', '2x faster exports'],
  },
  {
    id: 'v2.4.0',
    version: '2.4.0',
    date: 'Jan 5, 2026',
    title: 'Team Workspaces & Collaboration',
    description: 'Collaborate with your team using shared workspaces, comments, and real-time editing.',
    changes: [
      { type: 'feature', text: 'Team workspaces with role-based permissions' },
      { type: 'feature', text: 'Comments and annotations on mockups' },
      { type: 'feature', text: 'Shareable mockup links with password protection' },
      { type: 'improvement', text: 'Updated dashboard UI for better organization' },
      { type: 'improvement', text: 'Added keyboard shortcuts for common actions' },
      { type: 'fix', text: 'Fixed SVG export text alignment issues' },
    ],
    highlights: ['Team workspaces', 'Comments & annotations'],
  },
  {
    id: 'v2.3.0',
    version: '2.3.0',
    date: 'Dec 28, 2025',
    title: 'Email Mockups & Apple Mail Support',
    description: 'Create professional email mockups with support for Gmail, Outlook, and Apple Mail.',
    changes: [
      { type: 'feature', text: 'Gmail email mockup template' },
      { type: 'feature', text: 'Outlook email mockup template' },
      { type: 'feature', text: 'Apple Mail mockup template (macOS & iOS)' },
      { type: 'feature', text: 'Email attachment previews' },
      { type: 'improvement', text: 'Better HTML rendering in email bodies' },
      { type: 'fix', text: 'Fixed signature alignment in email mockups' },
    ],
    highlights: ['Email mockups', 'Apple Mail support'],
  },
  {
    id: 'v2.2.0',
    version: '2.2.0',
    date: 'Dec 20, 2025',
    title: 'AI Chat Interface Updates',
    description: 'Major updates to AI chat mockups with new platforms and features.',
    changes: [
      { type: 'feature', text: 'Perplexity AI mockup template' },
      { type: 'feature', text: 'Generic AI chat template for custom interfaces' },
      { type: 'feature', text: 'Code syntax highlighting in AI responses' },
      { type: 'feature', text: 'Mathematical notation rendering (LaTeX)' },
      { type: 'improvement', text: 'Updated ChatGPT interface to latest design' },
      { type: 'improvement', text: 'Better markdown rendering in Claude mockups' },
      { type: 'fix', text: 'Fixed code block copy button positioning' },
    ],
    highlights: ['Perplexity AI mockups', 'LaTeX support'],
  },
  {
    id: 'v2.1.0',
    version: '2.1.0',
    date: 'Dec 12, 2025',
    title: 'Social Media Story & Reel Mockups',
    description: 'Create Instagram Stories, TikTok videos, and social media analytics mockups.',
    changes: [
      { type: 'feature', text: 'Instagram Story mockup template' },
      { type: 'feature', text: 'TikTok video mockup template' },
      { type: 'feature', text: 'Reels mockup template' },
      { type: 'feature', text: 'Social media analytics mockup' },
      { type: 'feature', text: 'Sponsored post mockup with ad labels' },
      { type: 'improvement', text: 'Added more emoji reactions for posts' },
      { type: 'fix', text: 'Fixed video play button alignment' },
    ],
    highlights: ['Stories & Reels', 'Analytics mockups'],
  },
  {
    id: 'v2.0.0',
    version: '2.0.0',
    date: 'Dec 1, 2025',
    title: 'MockFlow 2.0 - Complete Redesign',
    description: 'A complete redesign of MockFlow with new editor, improved performance, and tons of new features.',
    changes: [
      { type: 'feature', text: 'All-new mockup editor with live preview' },
      { type: 'feature', text: 'Dark mode support across the platform' },
      { type: 'feature', text: 'PDF export with multiple pages' },
      { type: 'feature', text: 'SVG export for scalable graphics' },
      { type: 'feature', text: 'Device frames for iPhone, Android, and desktop' },
      { type: 'improvement', text: '3x faster export performance' },
      { type: 'improvement', text: 'Completely redesigned dashboard' },
      { type: 'improvement', text: 'Better mobile responsiveness' },
      { type: 'breaking', text: 'Minimum browser versions updated (Chrome 90+, Firefox 88+, Safari 14+)' },
      { type: 'breaking', text: 'Legacy export formats (GIF) temporarily removed' },
    ],
    highlights: ['New editor', 'Dark mode', '3x faster'],
  },
  {
    id: 'v1.5.0',
    version: '1.5.0',
    date: 'Nov 15, 2025',
    title: 'App Store Mockups & Notifications',
    description: 'Create iOS App Store and Google Play listing mockups, plus push notifications.',
    changes: [
      { type: 'feature', text: 'iOS App Store listing mockup' },
      { type: 'feature', text: 'Google Play Store listing mockup' },
      { type: 'feature', text: 'Push notification mockups (iOS & Android)' },
      { type: 'improvement', text: 'Updated star rating component' },
      { type: 'fix', text: 'Fixed app icon rendering on retina displays' },
    ],
    highlights: ['App Store mockups', 'Notifications'],
  },
  {
    id: 'v1.4.0',
    version: '1.4.0',
    date: 'Nov 1, 2025',
    title: 'LinkedIn & Facebook Mockups',
    description: 'Professional social media mockups for LinkedIn posts and Facebook.',
    changes: [
      { type: 'feature', text: 'LinkedIn post mockup template' },
      { type: 'feature', text: 'Facebook post mockup template' },
      { type: 'feature', text: 'Verification badge toggle for profiles' },
      { type: 'feature', text: 'Comment section builder' },
      { type: 'improvement', text: 'Better profile picture handling' },
      { type: 'fix', text: 'Fixed engagement metrics formatting' },
    ],
    highlights: ['LinkedIn mockups', 'Facebook mockups'],
  },
];

const changeTypeBadges: Record<ChangeType, { label: string; className: string }> = {
  feature: {
    label: 'New',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  improvement: {
    label: 'Improved',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  fix: {
    label: 'Fixed',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  breaking: {
    label: 'Breaking',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

type ChangelogCardProps = {
  entry: ChangelogEntry;
  isLatest?: boolean;
};

function ChangelogCard({ entry, isLatest = false }: ChangelogCardProps) {
  return (
    <div className="relative pb-12 last:pb-0">
      {/* Timeline line */}
      <div className="absolute top-10 bottom-0 left-6 w-px bg-gray-200 dark:bg-gray-700" />

      {/* Timeline dot */}
      <div className="absolute top-2 left-4 z-10">
        <div className={`size-4 rounded-full border-2 ${isLatest ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'}`} />
      </div>

      {/* Content */}
      <div className="ml-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            v
            {entry.version}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{entry.date}</span>
          {isLatest && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
              Latest
            </span>
          )}
        </div>

        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{entry.title}</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">{entry.description}</p>

        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {entry.highlights.map((highlight, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Changes */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <ul className="space-y-3">
            {entry.changes.map((change, index) => {
              const badge = changeTypeBadges[change.type];
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{change.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ChangelogPage() {
  const [filter, setFilter] = useState<'all' | ChangeType>('all');

  const filteredChangelog = changelog.map(entry => ({
    ...entry,
    changes: filter === 'all' ? entry.changes : entry.changes.filter(c => c.type === filter),
  })).filter(entry => entry.changes.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Changelog</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Track all the latest updates, features, and improvements to MockFlow.
          </p>

          {/* Subscribe */}
          <div className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
              Subscribe
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Get notified when we release new features.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
          {(['all', 'feature', 'improvement', 'fix', 'breaking'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {type === 'all' ? 'All Changes' : changeTypeBadges[type].label}
            </button>
          ))}
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredChangelog.length > 0
          ? (
              <div>
                {filteredChangelog.map((entry, index) => (
                  <ChangelogCard key={entry.id} entry={entry} isLatest={index === 0} />
                ))}
              </div>
            )
          : (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                <svg
                  className="mx-auto size-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No changes found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try selecting a different filter.
                </p>
              </div>
            )}
      </div>

      {/* Roadmap CTA */}
      <div className="border-t border-gray-200 bg-gray-100 px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What's Coming Next?</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Check out our public roadmap to see what features we're working on and vote for your favorites.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#roadmap"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              View Roadmap
            </a>
            <a
              href="#feedback"
              className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Request a Feature
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
