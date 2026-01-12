'use client';

import { useCallback, useState } from 'react';

type Mockup = {
  id: string;
  name: string;
  type: 'chat' | 'social' | 'ai' | 'email' | 'notification';
  platform: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
};

type Folder = {
  id: string;
  name: string;
  color: string;
  mockupCount: number;
  createdAt: string;
};

// Mock data
const mockFolders: Folder[] = [
  { id: 'folder_1', name: 'Marketing Campaigns', color: 'blue', mockupCount: 12, createdAt: 'Jan 5, 2026' },
  { id: 'folder_2', name: 'Product Demos', color: 'green', mockupCount: 8, createdAt: 'Jan 8, 2026' },
  { id: 'folder_3', name: 'Client Projects', color: 'purple', mockupCount: 15, createdAt: 'Jan 10, 2026' },
  { id: 'folder_4', name: 'Social Media', color: 'pink', mockupCount: 6, createdAt: 'Jan 12, 2026' },
];

const mockMockups: Mockup[] = [
  { id: 'mockup_1', name: 'Customer Support Flow', type: 'chat', platform: 'WhatsApp', createdAt: 'Jan 15, 2026', updatedAt: '2 hours ago', isStarred: true },
  { id: 'mockup_2', name: 'Product Launch Post', type: 'social', platform: 'LinkedIn', createdAt: 'Jan 14, 2026', updatedAt: '1 day ago', isStarred: false },
  { id: 'mockup_3', name: 'AI Assistant Demo', type: 'ai', platform: 'ChatGPT', createdAt: 'Jan 13, 2026', updatedAt: '2 days ago', isStarred: true },
  { id: 'mockup_4', name: 'Team Standup', type: 'chat', platform: 'Slack', createdAt: 'Jan 12, 2026', updatedAt: '3 days ago', isStarred: false },
  { id: 'mockup_5', name: 'Feature Announcement', type: 'social', platform: 'Twitter', createdAt: 'Jan 11, 2026', updatedAt: '4 days ago', isStarred: false },
  { id: 'mockup_6', name: 'Welcome Email', type: 'email', platform: 'Gmail', createdAt: 'Jan 10, 2026', updatedAt: '5 days ago', isStarred: true },
  { id: 'mockup_7', name: 'App Notification', type: 'notification', platform: 'iOS', createdAt: 'Jan 9, 2026', updatedAt: '6 days ago', isStarred: false },
  { id: 'mockup_8', name: 'Discord Server Chat', type: 'chat', platform: 'Discord', createdAt: 'Jan 8, 2026', updatedAt: '1 week ago', isStarred: false },
];

const folderColors: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' },
};

const typeIcons: Record<string, string> = {
  chat: '💬',
  social: '📱',
  ai: '🤖',
  email: '✉️',
  notification: '🔔',
};

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'updated' | 'created';

export default function ProjectsPage() {
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [mockups, setMockups] = useState<Mockup[]>(mockMockups);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('updated');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const filteredMockups = mockups
    .filter((mockup) => {
      const matchesSearch = mockup.name.toLowerCase().includes(searchQuery.toLowerCase())
        || mockup.platform.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStarred = !showStarredOnly || mockup.isStarred;
      return matchesSearch && matchesStarred;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return 0; // Already sorted by updated in mock data
      }
    });

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) {
      return;
    }
    const newFolder: Folder = {
      id: `folder_${Date.now()}`,
      name: newFolderName,
      color: newFolderColor,
      mockupCount: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setNewFolderColor('blue');
    setShowCreateFolderModal(false);
  }, [newFolderName, newFolderColor]);

  const toggleStar = useCallback((mockupId: string) => {
    setMockups(prev => prev.map(m =>
      m.id === mockupId ? { ...m, isStarred: !m.isStarred } : m,
    ));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Projects</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your mockups and organize them into folders
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                New Folder
              </button>
              <a
                href="/editor"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Mockup
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Folders Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Folders</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {folders.map((folder) => {
              const defaultColors = { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' };
              const colors = folderColors[folder.color] ?? defaultColors;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(selectedFolder === folder.id ? null : folder.id)}
                  className={`group rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                    selectedFolder === folder.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className={`mb-3 flex size-12 items-center justify-center rounded-lg ${colors.bg}`}>
                    <svg className={`size-6 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="truncate font-medium text-gray-900 dark:text-white">{folder.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {folder.mockupCount}
                    {' '}
                    mockups
                  </p>
                </button>
              );
            })}
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-4 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
            >
              <svg className="mb-2 size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Add Folder</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <svg className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search mockups..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => setShowStarredOnly(!showStarredOnly)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                showStarredOnly
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className={`size-5 ${showStarredOnly ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Starred
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="name">Name</option>
            </select>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-l-lg p-2 ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-r-lg p-2 ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mockups */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showStarredOnly ? 'Starred Mockups' : 'All Mockups'}
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredMockups.length}
            {' '}
            mockup
            {filteredMockups.length !== 1 ? 's' : ''}
          </span>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMockups.map(mockup => (
              <div
                key={mockup.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <div className="flex h-full items-center justify-center text-4xl opacity-50">
                    {typeIcons[mockup.type]}
                  </div>
                  {/* Star button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleStar(mockup.id);
                    }}
                    className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-800/80"
                  >
                    <svg
                      className={`size-5 ${mockup.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <a href={`/editor?id=${mockup.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Edit Mockup
                    </a>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {mockup.platform}
                    </span>
                    {mockup.isStarred && (
                      <svg className="size-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="mb-1 truncate font-semibold text-gray-900 dark:text-white">{mockup.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Updated
                    {mockup.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMockups.map(mockup => (
                  <tr key={mockup.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{typeIcons[mockup.type]}</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{mockup.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize dark:text-gray-400">{mockup.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{mockup.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{mockup.updatedAt}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStar(mockup.id)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-yellow-500 dark:hover:bg-gray-700"
                        >
                          <svg className={`size-5 ${mockup.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                        <a href={`/editor?id=${mockup.id}`} className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700">
                          Edit
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredMockups.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No mockups found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search.' : 'Create your first mockup to get started.'}
            </p>
            <a href="/editor" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Mockup
            </a>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Folder</h2>
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="e.g., Marketing Campaigns"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(folderColors).map((color) => {
                    const colors = folderColors[color];
                    return (
                      <button
                        key={color}
                        onClick={() => setNewFolderColor(color)}
                        className={`flex size-10 items-center justify-center rounded-lg transition-transform hover:scale-110 ${colors?.bg} ${
                          newFolderColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                      >
                        <svg className={`size-5 ${colors?.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
