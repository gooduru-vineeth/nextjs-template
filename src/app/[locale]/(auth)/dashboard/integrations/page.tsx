'use client';

import { useState } from 'react';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'storage' | 'communication' | 'automation' | 'design';
  status: 'connected' | 'available' | 'coming_soon';
  connectedAt?: string;
};

const integrations: Integration[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate mockup creation and export with 5,000+ apps',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#FF4A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    category: 'automation',
    status: 'available',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Share mockups directly to Slack channels and messages',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" fill="#E01E5A" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#E01E5A" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" fill="#36C5F0" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" fill="#36C5F0" />
        <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" fill="#2EB67D" />
        <path d="M14 20.5v-1.5h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z" fill="#2EB67D" />
        <path d="M10 9.5c0 .83-.67 1.5-1.5 1.5h-5C2.67 11 2 10.33 2 9.5S2.67 8 3.5 8h5c.83 0 1.5.67 1.5 1.5z" fill="#ECB22E" />
        <path d="M10 3.5V5H8.5C7.67 5 7 4.33 7 3.5S7.67 2 8.5 2s1.5.67 1.5 1.5z" fill="#ECB22E" />
      </svg>
    ),
    category: 'communication',
    status: 'connected',
    connectedAt: 'Jan 5, 2026',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Save and sync mockups to your Google Drive folders',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none">
        <path d="M8 2l7 12H1l7-12z" fill="#4285F4" />
        <path d="M8 2l7 12h8l-7-12H8z" fill="#FBBC04" />
        <path d="M1 14l4 7h14l-4-7H1z" fill="#34A853" />
      </svg>
    ),
    category: 'storage',
    status: 'available',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Automatically backup mockups to Dropbox',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="#0061FF">
        <path d="M6 2l6 3.75L6 9.5l-6-3.75L6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM6 13l6 3.75L6 20.5l-6-3.75L6 13zm12 0l6 3.75-6 3.75-6-3.75 6-3.75zm-6-6.5L6 9.5l6 3.75 6-3.75-6-3.75z" />
      </svg>
    ),
    category: 'storage',
    status: 'available',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Embed mockups in Notion pages and databases',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.024c-.466-.373-.98-.466-1.54-.42L3.153 2.75c-.466.047-.56.28-.373.513l1.68 1.433v.513zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.746.327-.746.933zm14.337.745c.093.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.168.514-1.634.514-.746 0-.933-.234-1.494-.934l-4.577-7.186v6.952l1.447.327s0 .84-1.167.84l-3.22.187c-.094-.187 0-.653.327-.746l.84-.233V9.854L7.379 9.62c-.094-.42.14-1.026.793-1.073l3.454-.233 4.763 7.278v-6.44l-1.214-.14c-.094-.514.28-.886.746-.933l3.221-.186zm-12.21-4.76l14.15-.84c1.634-.14 2.054.093 2.054 1.54v13.437c0 1.167-.42 1.774-1.727 1.867l-15.037.933c-.98.047-1.447-.093-1.96-.746l-3.127-4.053c-.56-.747-.793-1.307-.793-1.96V4.987c0-.84.327-1.54 1.448-1.634l4.993.42z" />
      </svg>
    ),
    category: 'storage',
    status: 'available',
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Import mockups into Figma as components',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none">
        <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" fill="#0ACF83" />
        <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" fill="#A259FF" />
        <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" fill="#F24E1E" />
        <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" fill="#FF7262" />
        <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" fill="#1ABCFE" />
      </svg>
    ),
    category: 'design',
    status: 'coming_soon',
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Send real-time notifications when mockups are created or exported',
    icon: (
      <svg className="size-8 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    category: 'automation',
    status: 'available',
  },
  {
    id: 'sketch',
    name: 'Sketch',
    description: 'Export mockups directly to Sketch files',
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="#F7B500">
        <path d="M12 1.25l-9 8.5 9 13 9-13-9-8.5zM12 1.25l4.5 8.5H7.5l4.5-8.5z" />
        <path d="M3 9.75l4.5 0L12 22.75 3 9.75zM21 9.75l-4.5 0L12 22.75 21 9.75z" fill="#FDA200" />
      </svg>
    ),
    category: 'design',
    status: 'coming_soon',
  },
];

const categories = [
  { id: 'all', label: 'All Integrations' },
  { id: 'storage', label: 'Storage' },
  { id: 'communication', label: 'Communication' },
  { id: 'automation', label: 'Automation' },
  { id: 'design', label: 'Design Tools' },
];

function StatusBadge({ status }: { status: Integration['status'] }) {
  const styles = {
    connected: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    available: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    coming_soon: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  };

  const labels = {
    connected: 'Connected',
    available: 'Available',
    coming_soon: 'Coming Soon',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase())
      || integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const handleConnect = (integrationId: string) => {
    setConnectingId(integrationId);
    // Simulate connection process
    setTimeout(() => {
      setConnectingId(null);
      // In a real app, this would update the integration status
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Connect MockFlow with your favorite tools and services
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {connectedCount}
                {' '}
                Connected
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredIntegrations.map(integration => (
            <div
              key={integration.id}
              className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h3>
                    <StatusBadge status={integration.status} />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                {integration.description}
              </p>

              {integration.connectedAt && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Connected on
                  {' '}
                  {integration.connectedAt}
                </p>
              )}

              <div className="mt-6">
                {integration.status === 'connected'
                  ? (
                      <div className="flex gap-2">
                        <button className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                          Configure
                        </button>
                        <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30">
                          Disconnect
                        </button>
                      </div>
                    )
                  : integration.status === 'available'
                    ? (
                        <button
                          onClick={() => handleConnect(integration.id)}
                          disabled={connectingId === integration.id}
                          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {connectingId === integration.id
                            ? (
                                <span className="flex items-center justify-center gap-2">
                                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Connecting...
                                </span>
                              )
                            : (
                                'Connect'
                              )}
                        </button>
                      )
                    : (
                        <button
                          disabled
                          className="w-full cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 dark:bg-gray-700"
                        >
                          Coming Soon
                        </button>
                      )}
              </div>
            </div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No integrations found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* API Section */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Build Custom Integrations</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Use our REST API to build custom integrations and automate your workflow.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                View Documentation
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Generate API Key
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/80 p-4 dark:bg-gray-800/80">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <svg className="size-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Create Mockups</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Programmatically generate mockups from your data
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-4 dark:bg-gray-800/80">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <svg className="size-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Export Images</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Download mockups in any format via API
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-4 dark:bg-gray-800/80">
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <svg className="size-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Webhooks</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Get real-time notifications for events
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
