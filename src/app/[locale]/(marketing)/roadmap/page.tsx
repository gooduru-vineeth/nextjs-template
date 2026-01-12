'use client';

import { useState } from 'react';

type FeatureStatus = 'completed' | 'in_progress' | 'planned' | 'considering';
type FeatureCategory = 'mockups' | 'editor' | 'export' | 'collaboration' | 'integrations' | 'platform';

type RoadmapFeature = {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  category: FeatureCategory;
  votes: number;
  quarter?: string;
  releaseVersion?: string;
};

const features: RoadmapFeature[] = [
  // Completed
  {
    id: 'feat_1',
    title: 'WhatsApp, iMessage, Discord Mockups',
    description: 'Create realistic chat mockups for popular messaging platforms',
    status: 'completed',
    category: 'mockups',
    votes: 2450,
    releaseVersion: '1.0',
  },
  {
    id: 'feat_2',
    title: 'ChatGPT, Claude, Gemini AI Mockups',
    description: 'Build AI chat interface mockups with code blocks and markdown',
    status: 'completed',
    category: 'mockups',
    votes: 1890,
    releaseVersion: '2.0',
  },
  {
    id: 'feat_3',
    title: 'Social Media Post Mockups',
    description: 'LinkedIn, Instagram, Twitter, Facebook, TikTok mockups',
    status: 'completed',
    category: 'mockups',
    votes: 2120,
    releaseVersion: '2.0',
  },
  {
    id: 'feat_4',
    title: 'Email Mockups',
    description: 'Gmail, Outlook, and Apple Mail mockups',
    status: 'completed',
    category: 'mockups',
    votes: 1560,
    releaseVersion: '2.3',
  },
  {
    id: 'feat_5',
    title: 'PNG, PDF, SVG Export',
    description: 'High-resolution exports in multiple formats',
    status: 'completed',
    category: 'export',
    votes: 3200,
    releaseVersion: '1.0',
  },
  {
    id: 'feat_6',
    title: 'Device Frames',
    description: 'iPhone, Android, and desktop browser frames',
    status: 'completed',
    category: 'export',
    votes: 1780,
    releaseVersion: '2.0',
  },
  {
    id: 'feat_7',
    title: 'Team Workspaces',
    description: 'Collaborate with team members on mockups',
    status: 'completed',
    category: 'collaboration',
    votes: 1450,
    releaseVersion: '2.4',
  },
  {
    id: 'feat_8',
    title: 'Comments & Annotations',
    description: 'Add comments and annotations to mockups',
    status: 'completed',
    category: 'collaboration',
    votes: 1230,
    releaseVersion: '2.4',
  },
  // In Progress
  {
    id: 'feat_9',
    title: 'Video Export (MP4)',
    description: 'Export animated mockups as MP4 videos',
    status: 'in_progress',
    category: 'export',
    votes: 2340,
    quarter: 'Q1 2026',
  },
  {
    id: 'feat_10',
    title: 'Figma Plugin',
    description: 'Import/export mockups directly from Figma',
    status: 'in_progress',
    category: 'integrations',
    votes: 1890,
    quarter: 'Q1 2026',
  },
  {
    id: 'feat_11',
    title: 'Real-time Collaboration',
    description: 'Edit mockups together in real-time',
    status: 'in_progress',
    category: 'collaboration',
    votes: 1670,
    quarter: 'Q1 2026',
  },
  // Planned
  {
    id: 'feat_12',
    title: 'AI-Powered Mockup Generation',
    description: 'Generate mockups from text descriptions using AI',
    status: 'planned',
    category: 'editor',
    votes: 4560,
    quarter: 'Q2 2026',
  },
  {
    id: 'feat_13',
    title: 'Website/Landing Page Mockups',
    description: 'Create mockups of websites and landing pages',
    status: 'planned',
    category: 'mockups',
    votes: 2890,
    quarter: 'Q2 2026',
  },
  {
    id: 'feat_14',
    title: 'Slack Integration',
    description: 'Create and share mockups directly in Slack',
    status: 'planned',
    category: 'integrations',
    votes: 1450,
    quarter: 'Q2 2026',
  },
  {
    id: 'feat_15',
    title: 'Custom Template Builder',
    description: 'Create and sell custom templates on marketplace',
    status: 'planned',
    category: 'platform',
    votes: 1230,
    quarter: 'Q2 2026',
  },
  {
    id: 'feat_16',
    title: 'Mobile App (iOS/Android)',
    description: 'Native mobile apps for creating mockups on the go',
    status: 'planned',
    category: 'platform',
    votes: 3450,
    quarter: 'Q3 2026',
  },
  {
    id: 'feat_17',
    title: 'Browser Extension',
    description: 'Capture and create mockups from any webpage',
    status: 'planned',
    category: 'platform',
    votes: 2120,
    quarter: 'Q3 2026',
  },
  // Considering
  {
    id: 'feat_18',
    title: 'Voice Interface Mockups',
    description: 'Alexa, Siri, Google Assistant mockups',
    status: 'considering',
    category: 'mockups',
    votes: 890,
  },
  {
    id: 'feat_19',
    title: 'AR/VR Mockups',
    description: '3D interface mockups for AR/VR applications',
    status: 'considering',
    category: 'mockups',
    votes: 670,
  },
  {
    id: 'feat_20',
    title: 'On-Premise Deployment',
    description: 'Self-hosted version for enterprise customers',
    status: 'considering',
    category: 'platform',
    votes: 450,
  },
  {
    id: 'feat_21',
    title: 'Notion Integration',
    description: 'Embed and manage mockups in Notion',
    status: 'considering',
    category: 'integrations',
    votes: 1120,
  },
];

const statusConfig: Record<FeatureStatus, { label: string; color: string; bgColor: string }> = {
  completed: {
    label: 'Completed',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  planned: {
    label: 'Planned',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  considering: {
    label: 'Under Consideration',
    color: 'text-gray-700 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
  },
};

const categoryLabels: Record<FeatureCategory, string> = {
  mockups: 'Mockup Types',
  editor: 'Editor Features',
  export: 'Export & Download',
  collaboration: 'Collaboration',
  integrations: 'Integrations',
  platform: 'Platform',
};

type FeatureCardProps = {
  feature: RoadmapFeature;
  onVote: (id: string) => void;
};

function FeatureCard({ feature, onVote }: FeatureCardProps) {
  const config = statusConfig[feature.status];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}>
            {config.label}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
        </div>
        <button
          onClick={() => onVote(feature.id)}
          className="flex shrink-0 flex-col items-center rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
        >
          <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.votes}</span>
        </button>
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {categoryLabels[feature.category]}
        </span>
        {feature.quarter && (
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            {feature.quarter}
          </span>
        )}
        {feature.releaseVersion && (
          <span className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-600 dark:bg-green-900/20 dark:text-green-400">
            v
            {feature.releaseVersion}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [selectedStatus, setSelectedStatus] = useState<FeatureStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | 'all'>('all');
  const [featureVotes, setFeatureVotes] = useState<Record<string, number>>(
    Object.fromEntries(features.map(f => [f.id, f.votes])),
  );

  const handleVote = (id: string) => {
    setFeatureVotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const filteredFeatures = features
    .filter(f => selectedStatus === 'all' || f.status === selectedStatus)
    .filter(f => selectedCategory === 'all' || f.category === selectedCategory)
    .map(f => ({ ...f, votes: featureVotes[f.id] || f.votes }))
    .sort((a, b) => b.votes - a.votes);

  const statusCounts = {
    completed: features.filter(f => f.status === 'completed').length,
    in_progress: features.filter(f => f.status === 'in_progress').length,
    planned: features.filter(f => f.status === 'planned').length,
    considering: features.filter(f => f.status === 'considering').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Product Roadmap</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            See what we&apos;re working on and what&apos;s coming next. Vote for features you want to see!
          </p>

          {/* Status Summary */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {(Object.entries(statusCounts) as [FeatureStatus, number][]).map(([status, count]) => {
              const config = statusConfig[status];
              return (
                <div key={status} className={`rounded-lg px-4 py-2 ${config.bgColor}`}>
                  <span className={`text-2xl font-bold ${config.color}`}>{count}</span>
                  <span className={`ml-2 text-sm ${config.color}`}>{config.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {(Object.keys(statusConfig) as FeatureStatus[]).map((status) => {
              const config = statusConfig[status];
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? `${config.bgColor} ${config.color}`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as FeatureCategory | 'all')}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {(Object.entries(categoryLabels) as [FeatureCategory, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} onVote={handleVote} />
          ))}
        </div>

        {filteredFeatures.length === 0 && (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No features found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
          </div>
        )}

        {/* Request Feature CTA */}
        <div className="mt-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Have a Feature Request?</h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            We&apos;re always looking for ways to improve MockFlow. Submit your feature request and help shape the future of the product.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact?reason=feature"
              className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Submit Feature Request
            </a>
            <a
              href="https://github.com/mockflow/roadmap"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
