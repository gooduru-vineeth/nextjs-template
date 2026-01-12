'use client';

import type { DeviceType } from '@/components/mockups/common/DeviceFrame';
import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import type { SocialAppearance, SocialComment, SocialMockupData, SocialPost } from '@/types/Mockup';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ExportPanel } from '@/components/editor/ExportPanel';
import { KeyboardShortcutsHelp } from '@/components/editor/KeyboardShortcutsHelp';
import { MockupImportExport } from '@/components/editor/MockupImportExport';
import { UndoRedoControls } from '@/components/editor/UndoRedoControls';
import { DeviceFrame } from '@/components/mockups/common/DeviceFrame';
import { FacebookMockup } from '@/components/mockups/social/FacebookMockup';
import { InstagramMockup } from '@/components/mockups/social/InstagramMockup';
import { LinkedInMockup } from '@/components/mockups/social/LinkedInMockup';
import { TikTokMockup } from '@/components/mockups/social/TikTokMockup';
import { TwitterMockup } from '@/components/mockups/social/TwitterMockup';
import { formatLastSaved, useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUndoRedo } from '@/hooks/useUndoRedo';

type SocialPlatform = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'tiktok';

const defaultPost: SocialPost = {
  id: '1',
  authorId: 'author',
  content: 'Just launched our new product! Check it out and let me know what you think. Really excited about this one.',
  timestamp: '2h ago',
  likes: 1250,
  comments: 89,
  shares: 234,
  views: 15000,
  isVerified: true,
  hashtags: ['launch', 'product', 'excited'],
};

const defaultData: SocialMockupData = {
  author: {
    id: 'author',
    name: 'John Doe',
    avatarUrl: '',
    isOnline: true,
  },
  post: defaultPost,
  comments: [
    {
      id: 'c1',
      authorId: 'user1',
      authorName: 'Sarah Johnson',
      content: 'Congratulations! This looks amazing!',
      timestamp: '1h ago',
      likes: 24,
    },
    {
      id: 'c2',
      authorId: 'user2',
      authorName: 'Mike Chen',
      content: 'Can\'t wait to try it out!',
      timestamp: '45m ago',
      likes: 12,
    },
  ],
};

const defaultAppearance: SocialAppearance = {
  theme: 'light',
  showEngagement: true,
  showComments: true,
  showVerified: true,
  deviceFrame: 'none',
};

const platforms: { id: SocialPlatform; name: string; icon: string }[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '👤' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
];

type EditorState = {
  platform: SocialPlatform;
  data: SocialMockupData;
  appearance: SocialAppearance;
  deviceFrame: DeviceType;
};

// Combined state for undo/redo
type MockupState = {
  data: SocialMockupData;
  appearance: SocialAppearance;
};

export default function SocialEditorPage() {
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'export'>('content');
  const [deviceFrame, setDeviceFrame] = useState<DeviceType>('none');
  const mockupRef = useRef<HTMLDivElement>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Use undo/redo for mockup state (data + appearance)
  const {
    state: mockupState,
    setState: setMockupState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetMockupState,
  } = useUndoRedo<MockupState>({
    data: defaultData,
    appearance: defaultAppearance,
  });

  // Extract data and appearance from combined state
  const { data, appearance } = mockupState;

  // Setters that update the combined state
  const setData = useCallback((newData: SocialMockupData | ((prev: SocialMockupData) => SocialMockupData)) => {
    setMockupState(prev => ({
      ...prev,
      data: typeof newData === 'function' ? newData(prev.data) : newData,
    }));
  }, [setMockupState]);

  const setAppearance = useCallback((newAppearance: SocialAppearance | ((prev: SocialAppearance) => SocialAppearance)) => {
    setMockupState(prev => ({
      ...prev,
      appearance: typeof newAppearance === 'function' ? newAppearance(prev.appearance) : newAppearance,
    }));
  }, [setMockupState]);

  const editorState = useMemo<EditorState>(
    () => ({ platform, data, appearance, deviceFrame }),
    [platform, data, appearance, deviceFrame],
  );

  const handleLoadSavedData = useCallback((savedData: unknown) => {
    const state = savedData as EditorState;
    if (state.platform) {
      setPlatform(state.platform);
    }
    if (state.data && state.appearance) {
      resetMockupState({ data: state.data, appearance: state.appearance });
    } else {
      if (state.data) {
        setData(state.data);
      }
      if (state.appearance) {
        setAppearance(state.appearance);
      }
    }
    if (state.deviceFrame) {
      setDeviceFrame(state.deviceFrame);
    }
  }, [resetMockupState, setData, setAppearance]);

  const {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
    clearSaved,
  } = useAutoSave({
    key: 'mockflow-social-editor-draft',
    data: editorState,
    debounceMs: 2000,
    enabled: true,
    onLoad: handleLoadSavedData,
  });

  const updatePost = (updates: Partial<SocialPost>) => {
    setData({
      ...data,
      post: { ...data.post, ...updates },
    });
  };

  const updateAuthor = (updates: Partial<SocialMockupData['author']>) => {
    setData({
      ...data,
      author: { ...data.author, ...updates },
    });
  };

  const addComment = () => {
    const newComment: SocialComment = {
      id: Date.now().toString(),
      authorId: 'new-user',
      authorName: 'New User',
      content: 'New comment...',
      timestamp: 'Just now',
      likes: 0,
    };
    setData({
      ...data,
      comments: [...(data.comments || []), newComment],
    });
  };

  const updateComment = (id: string, content: string) => {
    setData({
      ...data,
      comments: (data.comments || []).map(c =>
        c.id === id ? { ...c, content } : c,
      ),
    });
  };

  const deleteComment = (id: string) => {
    setData({
      ...data,
      comments: (data.comments || []).filter(c => c.id !== id),
    });
  };

  // Toggle theme handler
  const toggleTheme = useCallback(() => {
    setAppearance(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // Define keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    {
      key: 'z',
      modifiers: { ctrl: true },
      action: undo,
      description: 'Undo',
      enabled: canUndo,
    },
    {
      key: 'z',
      modifiers: { ctrl: true, shift: true },
      action: redo,
      description: 'Redo',
      enabled: canRedo,
    },
    {
      key: 'y',
      modifiers: { ctrl: true },
      action: redo,
      description: 'Redo (Alt)',
      enabled: canRedo,
    },
    {
      key: 's',
      modifiers: { ctrl: true },
      action: saveNow,
      description: 'Save draft',
    },
    {
      key: 'e',
      modifiers: { ctrl: true },
      action: () => setActiveTab('export'),
      description: 'Open export panel',
    },
    {
      key: 'd',
      modifiers: { ctrl: true },
      action: toggleTheme,
      description: 'Toggle dark/light theme',
    },
    {
      key: 'Enter',
      modifiers: { ctrl: true },
      action: addComment,
      description: 'Add new comment',
    },
    {
      key: '1',
      modifiers: { ctrl: true },
      action: () => setPlatform('linkedin'),
      description: 'Switch to LinkedIn',
    },
    {
      key: '2',
      modifiers: { ctrl: true },
      action: () => setPlatform('instagram'),
      description: 'Switch to Instagram',
    },
    {
      key: '3',
      modifiers: { ctrl: true },
      action: () => setPlatform('twitter'),
      description: 'Switch to Twitter/X',
    },
    {
      key: '?',
      modifiers: { shift: true },
      action: () => setShowShortcutsHelp(true),
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'Escape',
      modifiers: {},
      action: () => setShowShortcutsHelp(false),
      description: 'Close dialogs',
    },
  ], [saveNow, toggleTheme, addComment, undo, redo, canUndo, canRedo]);

  // Register keyboard shortcuts
  useKeyboardShortcuts({ shortcuts });

  const renderMockup = () => {
    switch (platform) {
      case 'linkedin':
        return <LinkedInMockup data={data} appearance={appearance} />;
      case 'instagram':
        return <InstagramMockup data={data} appearance={appearance} />;
      case 'twitter':
        return <TwitterMockup data={data} appearance={appearance} />;
      case 'facebook':
        return <FacebookMockup data={data} appearance={appearance} />;
      case 'tiktok':
        return <TikTokMockup data={data} appearance={appearance} />;
      default:
        return <LinkedInMockup data={data} appearance={appearance} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-96 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Platform Selector */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Platform</h2>
          <div className="grid grid-cols-3 gap-2">
            {platforms.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`flex flex-col items-center rounded-lg border px-3 py-2 text-sm transition-all ${
                  platform === p.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className="mt-1">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['content', 'appearance', 'export'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Author Info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Author</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Name</label>
                    <input
                      type="text"
                      value={data.author.name}
                      onChange={e => updateAuthor({ name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Avatar URL</label>
                    <input
                      type="text"
                      value={data.author.avatarUrl || ''}
                      onChange={e => updateAuthor({ avatarUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.post.isVerified || false}
                      onChange={e => updatePost({ isVerified: e.target.checked })}
                      className="size-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Verified account</span>
                  </label>
                </div>
              </div>

              {/* Post Content */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Post Content</h3>
                <textarea
                  value={data.post.content}
                  onChange={e => updatePost({ content: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  placeholder="What's on your mind?"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Hashtags (comma-separated)</label>
                <input
                  type="text"
                  value={(data.post.hashtags || []).join(', ')}
                  onChange={e => updatePost({ hashtags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="launch, product, tech"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Media */}
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Media URL</label>
                <input
                  type="text"
                  value={(data.post.mediaUrls || [])[0] || ''}
                  onChange={e => updatePost({ mediaUrls: e.target.value ? [e.target.value] : undefined })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Engagement Stats */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Engagement</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Likes</label>
                    <input
                      type="number"
                      value={data.post.likes}
                      onChange={e => updatePost({ likes: Number.parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Comments</label>
                    <input
                      type="number"
                      value={data.post.comments}
                      onChange={e => updatePost({ comments: Number.parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Shares/Reposts</label>
                    <input
                      type="number"
                      value={data.post.shares}
                      onChange={e => updatePost({ shares: Number.parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Views</label>
                    <input
                      type="number"
                      value={data.post.views || 0}
                      onChange={e => updatePost({ views: Number.parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Timestamp</label>
                <input
                  type="text"
                  value={data.post.timestamp}
                  onChange={e => updatePost({ timestamp: e.target.value })}
                  placeholder="2h ago"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {/* Comments */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Comments</h3>
                  <button
                    type="button"
                    onClick={addComment}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {(data.comments || []).map(comment => (
                    <div key={comment.id} className="rounded-lg border border-gray-200 p-2 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => deleteComment(comment.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={comment.content}
                        onChange={e => updateComment(comment.id, e.target.value)}
                        className="mt-1 w-full rounded border border-gray-200 bg-transparent px-2 py-1 text-sm dark:border-gray-600 dark:text-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                      appearance.theme === 'light'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                      appearance.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showEngagement !== false}
                    onChange={e => setAppearance({ ...appearance, showEngagement: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show engagement stats</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showComments !== false}
                    onChange={e => setAppearance({ ...appearance, showComments: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show comments</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showVerified !== false}
                    onChange={e => setAppearance({ ...appearance, showVerified: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show verification badge</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <ExportPanel
              mockupRef={mockupRef}
              currentDeviceFrame={deviceFrame}
              onDeviceFrameChange={setDeviceFrame}
            />
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Social Media Editor
            </h1>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              {platforms.find(p => p.id === platform)?.name}
            </span>
            <div className="ml-2 border-l border-gray-200 pl-4 dark:border-gray-600">
              <UndoRedoControls
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MockupImportExport
              mockupData={data}
              appearanceData={appearance}
              mockupType="social"
              platform={platform}
              onImport={(importedData, importedAppearance) => {
                resetMockupState({ data: importedData, appearance: importedAppearance });
              }}
            />
            <button
              type="button"
              onClick={saveNow}
              disabled={isSaving || !hasUnsavedChanges}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
            >
              {isSaving
                ? (
                    <>
                      <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  )
                : (
                    'Save Draft'
                  )}
            </button>
            <button
              type="button"
              onClick={clearSaved}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400"
              title="Clear saved draft"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShowShortcutsHelp(true)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400"
              title="Keyboard shortcuts (?)"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-gradient-to-br from-gray-100 to-gray-200 p-8 dark:from-gray-800 dark:to-gray-900">
          <div
            ref={mockupRef}
            className="transform overflow-hidden rounded-lg transition-transform hover:scale-[1.01]"
            style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))' }}
          >
            <DeviceFrame device={deviceFrame}>
              {renderMockup()}
            </DeviceFrame>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-2 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>
              Platform:
              {' '}
              {platform}
            </span>
            <span>
              Comments:
              {' '}
              {(data.comments || []).length}
            </span>
            <span>
              Frame:
              {' '}
              {deviceFrame === 'none' ? 'None' : deviceFrame}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isSaving
              ? (
                  <>
                    <svg className="size-3 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                )
              : hasUnsavedChanges
                ? (
                    <>
                      <span className="size-2 rounded-full bg-yellow-500" />
                      <span>Unsaved changes</span>
                    </>
                  )
                : lastSaved
                  ? (
                      <>
                        <span className="size-2 rounded-full bg-green-500" />
                        <span>
                          Saved
                          {' '}
                          {formatLastSaved(lastSaved)}
                        </span>
                      </>
                    )
                  : (
                      <>
                        <span className="size-2 rounded-full bg-gray-400" />
                        <span>Not saved</span>
                      </>
                    )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp
          shortcuts={shortcuts}
          onClose={() => setShowShortcutsHelp(false)}
        />
      )}
    </div>
  );
}
