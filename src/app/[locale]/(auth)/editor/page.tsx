'use client';

import type { DeviceType } from '@/components/mockups/common/DeviceFrame';
import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import type { ChatAppearance, ChatMockupData } from '@/types/Mockup';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ConversationBuilder } from '@/components/editor/ConversationBuilder';
import { ExportPanel } from '@/components/editor/ExportPanel';
import { KeyboardShortcutsHelp } from '@/components/editor/KeyboardShortcutsHelp';
import { MockupImportExport } from '@/components/editor/MockupImportExport';
import { SaveMockupModal } from '@/components/editor/SaveMockupModal';
import { TemplateSelector } from '@/components/editor/TemplateSelector';
import { UndoRedoControls } from '@/components/editor/UndoRedoControls';
import { DiscordMockup } from '@/components/mockups/chat/DiscordMockup';
import { IMessageMockup } from '@/components/mockups/chat/iMessageMockup';
import { MessengerMockup } from '@/components/mockups/chat/MessengerMockup';
import { SlackMockup } from '@/components/mockups/chat/SlackMockup';
import { TelegramMockup } from '@/components/mockups/chat/TelegramMockup';
import { WhatsAppMockup } from '@/components/mockups/chat/WhatsAppMockup';
import { DeviceFrame } from '@/components/mockups/common/DeviceFrame';
import { OnboardingTutorial, useOnboarding } from '@/components/onboarding/OnboardingTutorial';
import { formatLastSaved, useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMockupSave } from '@/hooks/useMockupSave';
import { useUndoRedo } from '@/hooks/useUndoRedo';

type Platform = 'whatsapp' | 'imessage' | 'discord' | 'telegram' | 'messenger' | 'slack';

// Default mock data
const defaultData: ChatMockupData = {
  participants: [
    { id: 'user', name: 'You', isOnline: true },
    { id: 'contact', name: 'John Doe', isOnline: true },
  ],
  messages: [
    {
      id: '1',
      senderId: 'contact',
      content: 'Hey! How are you doing?',
      timestamp: '10:30 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      senderId: 'user',
      content: 'I\'m doing great, thanks for asking! How about you?',
      timestamp: '10:31 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: '3',
      senderId: 'contact',
      content: 'Pretty good! Just working on some new projects. Would love to catch up soon!',
      timestamp: '10:32 AM',
      status: 'read',
      type: 'text',
    },
    {
      id: '4',
      senderId: 'user',
      content: 'Absolutely! Let\'s grab coffee this weekend.',
      timestamp: '10:33 AM',
      status: 'delivered',
      type: 'text',
    },
  ],
  isGroup: false,
  lastSeen: 'last seen today at 10:30 AM',
};

const defaultAppearance: ChatAppearance = {
  theme: 'light',
  showTimestamps: true,
  showAvatars: true,
  showStatus: true,
  deviceFrame: 'iphone',
  fontSize: 'medium',
};

const platforms: { id: Platform; name: string; icon: string }[] = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'imessage', name: 'iMessage', icon: '💭' },
  { id: 'discord', name: 'Discord', icon: '🎮' },
  { id: 'telegram', name: 'Telegram', icon: '✈️' },
  { id: 'messenger', name: 'Messenger', icon: '💬' },
  { id: 'slack', name: 'Slack', icon: '💼' },
];

type EditorState = {
  platform: Platform;
  data: ChatMockupData;
  appearance: ChatAppearance;
  deviceFrame: DeviceType;
};

// Combined state for undo/redo
type MockupState = {
  data: ChatMockupData;
  appearance: ChatAppearance;
};

export default function EditorPage() {
  const [platform, setPlatform] = useState<Platform>('whatsapp');
  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'export'>('content');
  const [deviceFrame, setDeviceFrame] = useState<DeviceType>('iphone-15-pro');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [mockupId, setMockupId] = useState<number | null>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

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
  const setData = useCallback((newData: ChatMockupData | ((prev: ChatMockupData) => ChatMockupData)) => {
    setMockupState(prev => ({
      ...prev,
      data: typeof newData === 'function' ? newData(prev.data) : newData,
    }));
  }, [setMockupState]);

  const setAppearance = useCallback((newAppearance: ChatAppearance | ((prev: ChatAppearance) => ChatAppearance)) => {
    setMockupState(prev => ({
      ...prev,
      appearance: typeof newAppearance === 'function' ? newAppearance(prev.appearance) : newAppearance,
    }));
  }, [setMockupState]);

  // Cloud save hook
  const { isSaving: isCloudSaving, saveToCloud, updateInCloud } = useMockupSave();

  // Onboarding
  const { showOnboarding, completeOnboarding } = useOnboarding();

  // Combine all state for auto-save
  const editorState = useMemo<EditorState>(
    () => ({ platform, data, appearance, deviceFrame }),
    [platform, data, appearance, deviceFrame],
  );

  // Handle loading saved data
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

  // Auto-save hook
  const {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
    clearSaved,
  } = useAutoSave({
    key: 'mockflow-editor-draft',
    data: editorState,
    debounceMs: 2000,
    enabled: true,
    onLoad: handleLoadSavedData,
  });

  const handleDataChange = useCallback((newData: ChatMockupData, newAppearance: ChatAppearance) => {
    setMockupState({ data: newData, appearance: newAppearance });
  }, [setMockupState]);

  // Add new message handler for keyboard shortcut
  const handleAddMessage = useCallback(() => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content: '',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'sent' as const,
      type: 'text' as const,
    };
    setData(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    setActiveTab('content');
  }, []);

  // Toggle theme handler
  const toggleTheme = useCallback(() => {
    setAppearance(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // Handle save to cloud
  const handleSaveToCloud = useCallback(async (name: string, isPublic: boolean) => {
    if (mockupId) {
      // Update existing mockup
      const success = await updateInCloud({
        id: mockupId,
        name,
        data: data as unknown as Record<string, unknown>,
        appearance: appearance as unknown as Record<string, unknown>,
        isPublic,
      });
      return success;
    } else {
      // Create new mockup
      const result = await saveToCloud({
        name,
        type: 'chat',
        platform,
        data: data as unknown as Record<string, unknown>,
        appearance: appearance as unknown as Record<string, unknown>,
        isPublic,
      });
      if (result) {
        setMockupId(result.id);
        return true;
      }
      return false;
    }
  }, [mockupId, data, appearance, platform, saveToCloud, updateInCloud]);

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
      key: 't',
      modifiers: { ctrl: true },
      action: () => setShowTemplates(true),
      description: 'Open templates',
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
      action: handleAddMessage,
      description: 'Add new message',
    },
    {
      key: '1',
      modifiers: { ctrl: true },
      action: () => setPlatform('whatsapp'),
      description: 'Switch to WhatsApp',
    },
    {
      key: '2',
      modifiers: { ctrl: true },
      action: () => setPlatform('imessage'),
      description: 'Switch to iMessage',
    },
    {
      key: '3',
      modifiers: { ctrl: true },
      action: () => setPlatform('discord'),
      description: 'Switch to Discord',
    },
    {
      key: '4',
      modifiers: { ctrl: true },
      action: () => setPlatform('telegram'),
      description: 'Switch to Telegram',
    },
    {
      key: '5',
      modifiers: { ctrl: true },
      action: () => setPlatform('messenger'),
      description: 'Switch to Messenger',
    },
    {
      key: '6',
      modifiers: { ctrl: true },
      action: () => setPlatform('slack'),
      description: 'Switch to Slack',
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
      action: () => {
        setShowTemplates(false);
        setShowShortcutsHelp(false);
        setShowSaveModal(false);
      },
      description: 'Close dialogs',
    },
  ], [saveNow, handleAddMessage, toggleTheme, undo, redo, canUndo, canRedo]);

  // Register keyboard shortcuts
  useKeyboardShortcuts({ shortcuts });

  const handleTemplateSelect = useCallback((templateData: ChatMockupData, templateAppearance: ChatAppearance) => {
    resetMockupState({ data: templateData, appearance: templateAppearance });
    setShowTemplates(false);
  }, [resetMockupState]);

  const renderMockup = () => {
    switch (platform) {
      case 'whatsapp':
        return (
          <WhatsAppMockup
            data={data}
            appearance={appearance}
            currentUserId="user"
          />
        );
      case 'imessage':
        return (
          <IMessageMockup
            data={data}
            appearance={appearance}
            currentUserId="user"
          />
        );
      case 'discord':
        return (
          <DiscordMockup
            data={data}
            currentUserId="user"
            showSidebar={false}
          />
        );
      case 'telegram':
        return (
          <TelegramMockup
            data={data}
            appearance={appearance}
            currentUserId="user"
          />
        );
      case 'messenger':
        return (
          <MessengerMockup
            data={data}
            appearance={appearance}
            currentUserId="user"
          />
        );
      case 'slack':
        return (
          <SlackMockup
            data={data}
            appearance={appearance}
            currentUserId="user"
            showSidebar={false}
          />
        );
      default:
        return (
          <WhatsAppMockup
            data={data}
            appearance={appearance}
            currentUserId="user"
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar - Editor Controls */}
      <div className="w-96 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Platform Selector */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Platform</h2>
            <button
              type="button"
              onClick={() => setShowTemplates(true)}
              className="flex items-center gap-1 rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Templates
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {platforms.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`flex flex-col items-center rounded-lg border px-3 py-2 text-xs transition-all ${
                  platform === p.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="mb-1 text-lg">{p.icon}</span>
                <span>{p.name}</span>
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
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'content' && (
            <ConversationBuilder
              data={data}
              appearance={appearance}
              onChange={handleDataChange}
            />
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
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                      appearance.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
                    checked={appearance.showTimestamps !== false}
                    onChange={e => setAppearance({ ...appearance, showTimestamps: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show timestamps</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showAvatars !== false}
                    onChange={e => setAppearance({ ...appearance, showAvatars: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show avatars</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showStatus !== false}
                    onChange={e => setAppearance({ ...appearance, showStatus: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show message status</span>
                </label>
              </div>

              {/* Wallpaper/Background */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Chat Background
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: undefined, label: 'Default', preview: 'bg-gray-100 dark:bg-gray-800' },
                    { value: 'whatsapp', label: 'WhatsApp', preview: 'bg-[#e5ddd5]' },
                    { value: 'imessage', label: 'iMessage', preview: 'bg-white' },
                    { value: 'gradient-blue', label: 'Blue', preview: 'bg-gradient-to-b from-blue-400 to-blue-600' },
                    { value: 'gradient-purple', label: 'Purple', preview: 'bg-gradient-to-b from-purple-400 to-purple-600' },
                    { value: 'gradient-green', label: 'Green', preview: 'bg-gradient-to-b from-green-400 to-green-600' },
                    { value: 'gradient-pink', label: 'Pink', preview: 'bg-gradient-to-b from-pink-400 to-pink-600' },
                    { value: 'gradient-orange', label: 'Orange', preview: 'bg-gradient-to-b from-orange-400 to-orange-600' },
                    { value: 'dark', label: 'Dark', preview: 'bg-gray-900' },
                    { value: 'telegram', label: 'Telegram', preview: 'bg-[#0e1621]' },
                  ].map(bg => (
                    <button
                      key={bg.label}
                      type="button"
                      onClick={() => setAppearance({ ...appearance, wallpaper: bg.value })}
                      className={`relative h-16 rounded-lg border-2 transition-all ${bg.preview} ${
                        appearance.wallpaper === bg.value
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
                      }`}
                      title={bg.label}
                    >
                      {appearance.wallpaper === bg.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="size-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bubble Colors */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bubble Colors
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-xs text-gray-500">Your messages</span>
                    <div className="flex gap-2">
                      {[
                        { value: undefined, color: 'bg-green-500' },
                        { value: '#25D366', color: 'bg-[#25D366]' },
                        { value: '#007AFF', color: 'bg-[#007AFF]' },
                        { value: '#5865F2', color: 'bg-[#5865F2]' },
                        { value: '#8B5CF6', color: 'bg-violet-500' },
                        { value: '#EC4899', color: 'bg-pink-500' },
                        { value: '#F59E0B', color: 'bg-amber-500' },
                        { value: '#6B7280', color: 'bg-gray-500' },
                      ].map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, bubbleColorSender: c.value })}
                          className={`size-6 rounded-full ${c.color} ${
                            appearance.bubbleColorSender === c.value
                              ? 'ring-2 ring-blue-500 ring-offset-2'
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-xs text-gray-500">Their messages</span>
                    <div className="flex gap-2">
                      {[
                        { value: undefined, color: 'bg-white border border-gray-300' },
                        { value: '#E5E5EA', color: 'bg-[#E5E5EA]' },
                        { value: '#F3F4F6', color: 'bg-gray-100' },
                        { value: '#374151', color: 'bg-gray-700' },
                        { value: '#1F2937', color: 'bg-gray-800' },
                        { value: '#FEF3C7', color: 'bg-amber-100' },
                        { value: '#DBEAFE', color: 'bg-blue-100' },
                        { value: '#F3E8FF', color: 'bg-purple-100' },
                      ].map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAppearance({ ...appearance, bubbleColorReceiver: c.value })}
                          className={`size-6 rounded-full ${c.color} ${
                            appearance.bubbleColorReceiver === c.value
                              ? 'ring-2 ring-blue-500 ring-offset-2'
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Size
                </label>
                <div className="flex gap-2">
                  {([
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ] as const).map(size => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => setAppearance({ ...appearance, fontSize: size.value })}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                        (appearance.fontSize || 'medium') === size.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
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
              Mockup Editor
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
              mockupType="chat"
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
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 rounded-lg border border-green-500 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {mockupId ? 'Update' : 'Save to Cloud'}
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
            className="transform transition-transform hover:scale-[1.01]"
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
              Messages:
              {' '}
              {data.messages.length}
            </span>
            <span>
              Participants:
              {' '}
              {data.participants.length}
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

      {/* Template Selector Modal */}
      {showTemplates && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <KeyboardShortcutsHelp
          shortcuts={shortcuts}
          onClose={() => setShowShortcutsHelp(false)}
        />
      )}

      {/* Save Mockup Modal */}
      <SaveMockupModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveToCloud}
        defaultName={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Mockup`}
        isSaving={isCloudSaving}
        isUpdate={mockupId !== null}
      />

      {/* Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial
          onComplete={completeOnboarding}
          onSkip={completeOnboarding}
        />
      )}
    </div>
  );
}
