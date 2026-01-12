'use client';

import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Hash,
  History,
  Image,
  MessageSquare,
  RefreshCw,
  Sliders,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Wand2,
  Zap,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Types
export type ContentType = 'chat-message' | 'social-post' | 'ai-response' | 'email-content' | 'headline' | 'bio' | 'hashtags';
export type ToneType = 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous' | 'empathetic' | 'persuasive';
export type LengthType = 'short' | 'medium' | 'long';

export type GenerationSettings = {
  tone: ToneType;
  length: LengthType;
  creativity: number; // 0-100
  includeEmoji: boolean;
  language: string;
};

export type GeneratedContent = {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  settings: GenerationSettings;
  timestamp: Date;
  rating?: 'up' | 'down';
  isSaved?: boolean;
};

export type ContentTemplate = {
  id: string;
  name: string;
  description: string;
  type: ContentType;
  promptTemplate: string;
  defaultSettings: Partial<GenerationSettings>;
  icon: React.ReactNode;
};

export type AIContentGeneratorProps = {
  variant?: 'full' | 'compact' | 'inline';
  onGenerate?: (content: GeneratedContent) => void;
  onApply?: (content: string) => void;
  initialPrompt?: string;
  contentType?: ContentType;
  showHistory?: boolean;
  showTemplates?: boolean;
  className?: string;
};

// Content templates
const contentTemplates: ContentTemplate[] = [
  {
    id: 'chat-message',
    name: 'Chat Message',
    description: 'Generate realistic chat messages',
    type: 'chat-message',
    promptTemplate: 'Write a chat message about: {topic}',
    defaultSettings: { tone: 'casual', length: 'short' },
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    description: 'Create engaging social media content',
    type: 'social-post',
    promptTemplate: 'Create a social media post about: {topic}',
    defaultSettings: { tone: 'friendly', length: 'medium', includeEmoji: true },
    icon: <Hash className="h-4 w-4" />,
  },
  {
    id: 'ai-response',
    name: 'AI Assistant Response',
    description: 'Generate AI chatbot responses',
    type: 'ai-response',
    promptTemplate: 'Respond as an AI assistant to: {topic}',
    defaultSettings: { tone: 'professional', length: 'medium' },
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    id: 'email-content',
    name: 'Email Content',
    description: 'Draft professional email content',
    type: 'email-content',
    promptTemplate: 'Write an email about: {topic}',
    defaultSettings: { tone: 'professional', length: 'medium' },
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: 'headline',
    name: 'Headline',
    description: 'Create attention-grabbing headlines',
    type: 'headline',
    promptTemplate: 'Create a headline for: {topic}',
    defaultSettings: { tone: 'persuasive', length: 'short' },
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: 'bio',
    name: 'Bio / About',
    description: 'Write profile descriptions',
    type: 'bio',
    promptTemplate: 'Write a bio for: {topic}',
    defaultSettings: { tone: 'professional', length: 'medium' },
    icon: <Image className="h-4 w-4" />,
  },
];

// Mock content generator
const generateMockContent = (type: ContentType, _prompt: string, settings: GenerationSettings): string => {
  const responses: Record<ContentType, string[]> = {
    'chat-message': [
      'Hey! Just wanted to check in and see how you\'re doing. It\'s been a while since we caught up! 😊',
      'That sounds amazing! I can\'t believe you managed to pull that off. We should celebrate! 🎉',
      'Thanks for letting me know. I\'ll take a look at it later today and get back to you.',
      'Haha, you\'re hilarious! That joke really made my day 😂',
    ],
    'social-post': [
      '🚀 Exciting news! We just launched our new feature that\'s going to change the game. Check it out and let us know what you think! #innovation #tech #newlaunch',
      'Had the most incredible experience today. Sometimes life surprises you in the best ways possible ✨ #blessed #grateful',
      'Pro tip: Always take time for yourself. Self-care isn\'t selfish, it\'s necessary 💪 #selfcare #wellness #mindfulness',
    ],
    'ai-response': [
      'I\'d be happy to help you with that! Based on what you\'ve described, here are a few suggestions that might work well for your situation...',
      'That\'s a great question! Let me break this down into a few key points to make it easier to understand...',
      'I understand your concern. Here\'s what I recommend based on best practices and my analysis of similar situations...',
    ],
    'email-content': [
      'Dear Team,\n\nI hope this message finds you well. I wanted to provide a quick update on our progress this week...',
      'Hi [Name],\n\nThank you for reaching out. I\'ve reviewed your request and would like to discuss a few options...',
      'Good morning,\n\nFollowing up on our conversation yesterday, I\'ve attached the documents you requested...',
    ],
    'headline': [
      '10 Game-Changing Strategies That Will Transform Your Business',
      'The Secret to Success That Nobody Talks About',
      'Breaking: Revolutionary Discovery Changes Everything We Know',
      'Why This Simple Hack Is Going Viral Right Now',
    ],
    'bio': [
      'Creative professional with 10+ years of experience in digital design. Passionate about creating meaningful experiences that connect people and brands.',
      'Entrepreneur | Speaker | Author | Helping businesses grow through innovative solutions and strategic thinking.',
      '🎨 Designer by day, coffee enthusiast always. Creating beautiful things one pixel at a time.',
    ],
    'hashtags': [
      '#tech #innovation #startup #business #growth #success #entrepreneurship',
      '#design #creativity #ui #ux #webdesign #digitalart #inspiration',
      '#marketing #socialmedia #branding #digital #strategy #content',
    ],
  };

  const options = responses[type] || responses['chat-message'];
  let content = options[Math.floor(Math.random() * options.length)]!;

  // Adjust based on settings
  if (!settings.includeEmoji) {
    content = content.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  }

  if (settings.length === 'short' && content.length > 100) {
    content = `${content.substring(0, 100)}...`;
  } else if (settings.length === 'long') {
    content = `${content}\n\n${options[(options.indexOf(content) + 1) % options.length]}`;
  }

  return content.trim();
};

// Settings panel component
export const SettingsPanel: React.FC<{
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
  compact?: boolean;
}> = ({ settings, onChange, compact = false }) => {
  const tones: ToneType[] = ['professional', 'casual', 'friendly', 'formal', 'humorous', 'empathetic', 'persuasive'];
  const lengths: LengthType[] = ['short', 'medium', 'long'];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={settings.tone}
          onChange={e => onChange({ ...settings, tone: e.target.value as ToneType })}
          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          {tones.map(tone => (
            <option key={tone} value={tone} className="capitalize">
              {tone}
            </option>
          ))}
        </select>
        <select
          value={settings.length}
          onChange={e => onChange({ ...settings, length: e.target.value as LengthType })}
          className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          {lengths.map(length => (
            <option key={length} value={length} className="capitalize">
              {length}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={settings.includeEmoji}
            onChange={e => onChange({ ...settings, includeEmoji: e.target.checked })}
            className="rounded"
          />
          <span>😊</span>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tone</label>
        <div className="flex flex-wrap gap-2">
          {tones.map(tone => (
            <button
              key={tone}
              onClick={() => onChange({ ...settings, tone })}
              className={`rounded-full px-3 py-1.5 text-sm capitalize transition-colors ${
                settings.tone === tone
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Length</label>
        <div className="flex gap-2">
          {lengths.map(length => (
            <button
              key={length}
              onClick={() => onChange({ ...settings, length })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm capitalize transition-colors ${
                settings.length === length
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {length}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Creativity:
          {' '}
          {settings.creativity}
          %
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.creativity}
          onChange={e => onChange({ ...settings, creativity: Number.parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Predictable</span>
          <span>Creative</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Emoji</label>
        <button
          onClick={() => onChange({ ...settings, includeEmoji: !settings.includeEmoji })}
          className={`h-6 w-12 rounded-full transition-colors ${
            settings.includeEmoji ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div
            className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              settings.includeEmoji ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

// Generated content card
export const ContentCard: React.FC<{
  content: GeneratedContent;
  onCopy?: () => void;
  onApply?: () => void;
  onRate?: (rating: 'up' | 'down') => void;
  onSave?: () => void;
  onRegenerate?: () => void;
}> = ({ content, onCopy, onApply, onRate, onSave, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="p-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{content.content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRate?.('up')}
            className={`rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              content.rating === 'up' ? 'text-green-500' : 'text-gray-400'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRate?.('down')}
            className={`rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              content.rating === 'down' ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
          <button
            onClick={onSave}
            className={`rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 ${
              content.isSaved ? 'text-yellow-500' : 'text-gray-400'
            }`}
          >
            {content.isSaved ? <Star className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {onApply && (
            <button
              onClick={onApply}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              <Wand2 className="h-4 w-4" />
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  variant = 'full',
  onGenerate,
  onApply,
  initialPrompt = '',
  contentType: initialType = 'chat-message',
  showHistory = true,
  showTemplates = true,
  className = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [contentType, setContentType] = useState<ContentType>(initialType);
  const [settings, setSettings] = useState<GenerationSettings>({
    tone: 'casual',
    length: 'medium',
    creativity: 50,
    includeEmoji: true,
    language: 'en',
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'saved'>('generate');

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const content = generateMockContent(contentType, prompt, settings);
    const newContent: GeneratedContent = {
      id: `gen-${Date.now()}`,
      type: contentType,
      prompt,
      content,
      settings: { ...settings },
      timestamp: new Date(),
    };

    setGeneratedContent(prev => [newContent, ...prev]);
    onGenerate?.(newContent);
    setIsGenerating(false);
  }, [prompt, contentType, settings, onGenerate]);

  const handleSelectTemplate = (template: ContentTemplate) => {
    setContentType(template.type);
    setSettings(prev => ({ ...prev, ...template.defaultSettings }));
    setPrompt(template.promptTemplate.replace('{topic}', ''));
  };

  // Inline variant - minimal UI for embedding
  if (variant === 'inline') {
    return (
      <div className={`${className}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating
              ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )
              : (
                  <Sparkles className="h-4 w-4" />
                )}
            Generate
          </button>
        </div>
        {generatedContent.length > 0 && (
          <div className="mt-3">
            <ContentCard
              content={generatedContent[0]!}
              onApply={() => onApply?.(generatedContent[0]!.content)}
            />
          </div>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 p-2 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">AI Content Generator</h3>
        </div>
        <div className="space-y-3 p-4">
          <select
            value={contentType}
            onChange={e => setContentType(e.target.value as ContentType)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          >
            {contentTemplates.map(t => (
              <option key={t.id} value={t.type}>
                {t.name}
              </option>
            ))}
          </select>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
          <SettingsPanel settings={settings} onChange={setSettings} compact />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating
              ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )
              : (
                  <Sparkles className="h-4 w-4" />
                )}
            Generate Content
          </button>
          {generatedContent.length > 0 && (
            <ContentCard
              content={generatedContent[0]!}
              onApply={() => onApply?.(generatedContent[0]!.content)}
            />
          )}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sidebar - Templates */}
      {showTemplates && (
        <div className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">AI Generator</h2>
                <p className="text-xs text-gray-500">Create content with AI</p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 p-2 dark:border-gray-700">
            <div className="flex">
              {(['generate', 'history', 'saved'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'generate' && (
              <div className="space-y-1">
                <p className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">Templates</p>
                {contentTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`w-full rounded-lg p-3 text-left transition-colors ${
                      contentType === template.type
                        ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2 text-gray-500 dark:bg-gray-700">
                        {template.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'history' && showHistory && (
              <div className="space-y-2">
                {generatedContent.length === 0
                  ? (
                      <div className="py-8 text-center text-gray-500">
                        <History className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p className="text-sm">No history yet</p>
                      </div>
                    )
                  : (
                      generatedContent.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setPrompt(item.prompt)}
                          className="w-full rounded-lg p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="truncate text-sm text-gray-900 dark:text-white">{item.prompt}</div>
                          <div className="mt-1 text-xs text-gray-500">
                            {item.timestamp.toLocaleTimeString()}
                          </div>
                        </button>
                      ))
                    )}
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-2">
                {generatedContent.filter(c => c.isSaved).length === 0
                  ? (
                      <div className="py-8 text-center text-gray-500">
                        <Bookmark className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p className="text-sm">No saved content</p>
                      </div>
                    )
                  : (
                      generatedContent
                        .filter(c => c.isSaved)
                        .map(item => (
                          <div
                            key={item.id}
                            className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                          >
                            <div className="line-clamp-2 text-sm text-gray-900 dark:text-white">{item.content}</div>
                          </div>
                        ))
                    )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Input area */}
        <div className="border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="flex items-center gap-4">
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value as ContentType)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                {contentTemplates.map(t => (
                  <option key={t.id} value={t.type}>
                    {t.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                  showSettings
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Sliders className="h-4 w-4" />
                Settings
                {showSettings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>

            {showSettings && <SettingsPanel settings={settings} onChange={setSettings} />}

            <div className="relative">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe what you want to generate..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-3 bottom-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-white shadow-lg hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating
                  ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    )
                  : (
                      <Sparkles className="h-5 w-5" />
                    )}
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {generatedContent.length === 0
              ? (
                  <div className="py-16 text-center">
                    <Wand2 className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                    <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                      Ready to Generate
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Enter a prompt above and click Generate to create AI-powered content
                    </p>
                  </div>
                )
              : (
                  generatedContent.map(content => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onApply={() => onApply?.(content.content)}
                      onRate={(rating) => {
                        setGeneratedContent(prev =>
                          prev.map(c => (c.id === content.id ? { ...c, rating } : c)),
                        );
                      }}
                      onSave={() => {
                        setGeneratedContent(prev =>
                          prev.map(c => (c.id === content.id ? { ...c, isSaved: !c.isSaved } : c)),
                        );
                      }}
                      onRegenerate={handleGenerate}
                    />
                  ))
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator;
