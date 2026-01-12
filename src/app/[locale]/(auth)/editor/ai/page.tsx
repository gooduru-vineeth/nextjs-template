'use client';

import type { PromptTemplate } from '@/components/editor/PromptLibrary';
import type { DeviceType } from '@/components/mockups/common/DeviceFrame';
import type { KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';
import type { AIAppearance, AIMessage, AIMockupData } from '@/types/Mockup';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ExportPanel } from '@/components/editor/ExportPanel';
import { KeyboardShortcutsHelp } from '@/components/editor/KeyboardShortcutsHelp';
import { MockupImportExport } from '@/components/editor/MockupImportExport';
import { PromptLibrary } from '@/components/editor/PromptLibrary';
import { UndoRedoControls } from '@/components/editor/UndoRedoControls';
import { ChatGPTMockup } from '@/components/mockups/ai/ChatGPTMockup';
import { ClaudeMockup } from '@/components/mockups/ai/ClaudeMockup';
import { GeminiMockup } from '@/components/mockups/ai/GeminiMockup';
import { PerplexityMockup } from '@/components/mockups/ai/PerplexityMockup';
import { DeviceFrame } from '@/components/mockups/common/DeviceFrame';
import { formatLastSaved, useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUndoRedo } from '@/hooks/useUndoRedo';

type AIPlatform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity';

const defaultMessages: AIMessage[] = [
  {
    id: '1',
    senderId: 'user',
    role: 'user',
    content: 'Can you help me write a Python function to calculate the Fibonacci sequence?',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    senderId: 'assistant',
    role: 'assistant',
    content: `I'd be happy to help you write a Python function for the Fibonacci sequence! Here are a few different approaches:

### Recursive Approach
The classic recursive implementation:

\`\`\`python
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
\`\`\`

### Iterative Approach
A more efficient iterative version:

\`\`\`python
def fibonacci_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
\`\`\`

The iterative approach is **much more efficient** with O(n) time complexity compared to O(2^n) for the recursive version.`,
    timestamp: new Date().toISOString(),
    model: 'gpt-4o',
  },
];

const defaultData: AIMockupData = {
  messages: defaultMessages,
  model: 'gpt-4o',
  conversationTitle: 'Fibonacci Function Help',
};

const defaultAppearance: AIAppearance = {
  theme: 'dark',
  showSidebar: true,
  showModelSelector: true,
  showTokenCount: false,
  codeTheme: 'vscode',
};

const platforms: { id: AIPlatform; name: string; icon: string }[] = [
  { id: 'chatgpt', name: 'ChatGPT', icon: '🤖' },
  { id: 'claude', name: 'Claude', icon: '🧠' },
  { id: 'gemini', name: 'Gemini', icon: '✨' },
  { id: 'perplexity', name: 'Perplexity', icon: '🔍' },
];

const models: Record<AIPlatform, { id: string; name: string }[]> = {
  chatgpt: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  ],
  claude: [
    { id: 'claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' },
  ],
  perplexity: [
    { id: 'sonar-large', name: 'Sonar Large' },
    { id: 'sonar-small', name: 'Sonar Small' },
    { id: 'codellama-70b', name: 'CodeLlama 70B' },
  ],
};

type EditorState = {
  platform: AIPlatform;
  data: AIMockupData;
  appearance: AIAppearance;
  deviceFrame: DeviceType;
};

// Combined state for undo/redo
type MockupState = {
  data: AIMockupData;
  appearance: AIAppearance;
};

export default function AIEditorPage() {
  const [platform, setPlatform] = useState<AIPlatform>('chatgpt');
  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'export'>('content');
  const [deviceFrame, setDeviceFrame] = useState<DeviceType>('none');
  const mockupRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);

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
  const setData = useCallback((newData: AIMockupData | ((prev: AIMockupData) => AIMockupData)) => {
    setMockupState(prev => ({
      ...prev,
      data: typeof newData === 'function' ? newData(prev.data) : newData,
    }));
  }, [setMockupState]);

  const setAppearance = useCallback((newAppearance: AIAppearance | ((prev: AIAppearance) => AIAppearance)) => {
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
    key: 'mockflow-ai-editor-draft',
    data: editorState,
    debounceMs: 2000,
    enabled: true,
    onLoad: handleLoadSavedData,
  });

  const addMessage = (role: 'user' | 'assistant') => {
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      senderId: role,
      role,
      content: role === 'user' ? 'Enter your message here...' : 'Enter AI response here...',
      timestamp: new Date().toISOString(),
      model: role === 'assistant' ? data.model : undefined,
    };
    setData({ ...data, messages: [...data.messages, newMessage] });
    setEditingMessageId(newMessage.id);
  };

  const updateMessage = (id: string, content: string) => {
    setData({
      ...data,
      messages: data.messages.map(msg =>
        msg.id === id ? { ...msg, content } : msg,
      ),
    });
  };

  const deleteMessage = (id: string) => {
    setData({
      ...data,
      messages: data.messages.filter(msg => msg.id !== id),
    });
  };

  const moveMessage = (id: string, direction: 'up' | 'down') => {
    const index = data.messages.findIndex(msg => msg.id === id);
    if (index === -1) {
      return;
    }
    if (direction === 'up' && index === 0) {
      return;
    }
    if (direction === 'down' && index === data.messages.length - 1) {
      return;
    }

    const newMessages = [...data.messages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newMessages[index]!;
    newMessages[index] = newMessages[targetIndex]!;
    newMessages[targetIndex] = temp;
    setData({ ...data, messages: newMessages });
  };

  // Handle selecting a prompt from the library
  const handleSelectPrompt = useCallback((prompt: PromptTemplate) => {
    const messages: AIMessage[] = [];

    // Add user message from prompt
    messages.push({
      id: Date.now().toString(),
      senderId: 'user',
      role: 'user',
      content: prompt.userPrompt,
      timestamp: new Date().toISOString(),
    });

    // Add AI response if available
    if (prompt.aiResponse) {
      messages.push({
        id: (Date.now() + 1).toString(),
        senderId: 'assistant',
        role: 'assistant',
        content: prompt.aiResponse,
        timestamp: new Date().toISOString(),
        model: data.model,
      });
    }

    setData({
      ...data,
      messages,
      systemPrompt: prompt.systemPrompt || data.systemPrompt,
      conversationTitle: prompt.title,
    });

    setShowPromptLibrary(false);
  }, [data, setData]);

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
      action: () => addMessage('user'),
      description: 'Add user message',
    },
    {
      key: 'Enter',
      modifiers: { ctrl: true, shift: true },
      action: () => addMessage('assistant'),
      description: 'Add AI response',
    },
    {
      key: '1',
      modifiers: { ctrl: true },
      action: () => {
        setPlatform('chatgpt');
        setData(prev => ({ ...prev, model: models.chatgpt[0]?.id ?? 'gpt-4o' }));
      },
      description: 'Switch to ChatGPT',
    },
    {
      key: '2',
      modifiers: { ctrl: true },
      action: () => {
        setPlatform('claude');
        setData(prev => ({ ...prev, model: models.claude[0]?.id ?? 'claude-3-opus' }));
      },
      description: 'Switch to Claude',
    },
    {
      key: '3',
      modifiers: { ctrl: true },
      action: () => {
        setPlatform('gemini');
        setData(prev => ({ ...prev, model: models.gemini[0]?.id ?? 'gemini-1.5-pro' }));
      },
      description: 'Switch to Gemini',
    },
    {
      key: '4',
      modifiers: { ctrl: true },
      action: () => {
        setPlatform('perplexity');
        setData(prev => ({ ...prev, model: models.perplexity[0]?.id ?? 'sonar-large' }));
      },
      description: 'Switch to Perplexity',
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
        setShowShortcutsHelp(false);
        setEditingMessageId(null);
      },
      description: 'Close dialogs',
    },
  ], [saveNow, toggleTheme, undo, redo, canUndo, canRedo]);

  // Register keyboard shortcuts
  useKeyboardShortcuts({ shortcuts });

  const renderMockup = () => {
    switch (platform) {
      case 'chatgpt':
        return <ChatGPTMockup data={data} appearance={appearance} />;
      case 'claude':
        return <ClaudeMockup data={data} appearance={appearance} />;
      case 'gemini':
        return <GeminiMockup data={data} appearance={appearance} />;
      case 'perplexity':
        return <PerplexityMockup data={data} appearance={appearance} />;
      default:
        return <ChatGPTMockup data={data} appearance={appearance} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Sidebar - Editor Controls */}
      <div className="w-96 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Platform Selector */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">AI Platform</h2>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPlatform(p.id);
                  const platformModels = models[p.id];
                  setData({ ...data, model: platformModels[0]?.id ?? 'default' });
                }}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  platform === p.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model Selector */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Model</h2>
          <select
            value={data.model}
            onChange={e => setData({ ...data, model: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {models[platform].map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
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
            <div className="space-y-4">
              {/* Conversation Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Conversation Title
                </label>
                <input
                  type="text"
                  value={data.conversationTitle || ''}
                  onChange={e => setData({ ...data, conversationTitle: e.target.value })}
                  placeholder="New conversation"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
              </div>

              {/* System Prompt */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    System Prompt
                  </label>
                  <span className="text-xs text-gray-400">(optional)</span>
                </div>
                <textarea
                  value={data.systemPrompt || ''}
                  onChange={e => setData({ ...data, systemPrompt: e.target.value })}
                  placeholder="You are a helpful assistant..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Sets the AI&apos;s behavior and context. Displayed in Claude/ChatGPT mockups.
                </p>
              </div>

              {/* Prompt Library Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPromptLibrary(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Browse Prompt Library
                </button>
              </div>

              {/* Messages */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Messages
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addMessage('user')}
                      className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                      + User
                    </button>
                    <button
                      type="button"
                      onClick={() => addMessage('assistant')}
                      className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      + AI
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {data.messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg border p-3 ${
                        msg.role === 'user'
                          ? 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50'
                          : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className={`text-xs font-medium ${
                          msg.role === 'user' ? 'text-gray-600 dark:text-gray-400' : 'text-blue-600 dark:text-blue-400'
                        }`}
                        >
                          {msg.role === 'user' ? 'User' : 'AI Assistant'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveMessage(msg.id, 'up')}
                            disabled={index === 0}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30 dark:hover:bg-gray-600"
                          >
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMessage(msg.id, 'down')}
                            disabled={index === data.messages.length - 1}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30 dark:hover:bg-gray-600"
                          >
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMessage(msg.id)}
                            className="rounded p-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {editingMessageId === msg.id
                        ? (
                            <div>
                              <textarea
                                value={msg.content}
                                onChange={e => updateMessage(msg.id, e.target.value)}
                                onBlur={() => setEditingMessageId(null)}
                                rows={6}
                                className="w-full rounded border border-gray-300 bg-white p-2 text-sm dark:border-gray-500 dark:bg-gray-800 dark:text-gray-200"
                                autoFocus
                                placeholder="Enter message content. Use ```language for code blocks."
                              />
                              <p className="mt-1 text-xs text-gray-400">
                                Tip: Use ```python or ```javascript for code blocks
                              </p>
                            </div>
                          )
                        : (
                            <div
                              onClick={() => setEditingMessageId(msg.id)}
                              className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                            >
                              <p className="line-clamp-3 whitespace-pre-wrap">{msg.content}</p>
                              <span className="mt-1 text-xs text-gray-400">Click to edit</span>
                            </div>
                          )}
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
                    checked={appearance.showSidebar !== false}
                    onChange={e => setAppearance({ ...appearance, showSidebar: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show sidebar</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showModelSelector !== false}
                    onChange={e => setAppearance({ ...appearance, showModelSelector: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show model selector</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={appearance.showTokenCount === true}
                    onChange={e => setAppearance({ ...appearance, showTokenCount: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show token count</span>
                </label>
              </div>

              {/* Code Theme */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code Block Theme
                </label>
                <select
                  value={appearance.codeTheme || 'vscode'}
                  onChange={e => setAppearance({ ...appearance, codeTheme: e.target.value as AIAppearance['codeTheme'] })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="vscode">VS Code Dark</option>
                  <option value="github">GitHub</option>
                  <option value="dracula">Dracula</option>
                  <option value="monokai">Monokai</option>
                </select>
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
              AI Chat Editor
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
              mockupType="ai"
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
            className="max-h-[90vh] transform overflow-hidden rounded-lg transition-transform hover:scale-[1.01]"
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
              Model:
              {' '}
              {data.model}
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

      {/* Prompt Library Modal */}
      {showPromptLibrary && (
        <PromptLibrary
          onSelectPrompt={handleSelectPrompt}
          onClose={() => setShowPromptLibrary(false)}
        />
      )}
    </div>
  );
}
