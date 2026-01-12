'use client';

import {
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Hash,
  History,
  Loader2,
  Mail,
  MessageSquare,
  PenTool,
  RefreshCw,
  Settings2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Wand2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ContentType = 'headline' | 'tagline' | 'description' | 'cta' | 'social' | 'email' | 'bio' | 'caption';
type ToneStyle = 'professional' | 'casual' | 'friendly' | 'formal' | 'humorous' | 'persuasive' | 'inspirational';
type LengthOption = 'short' | 'medium' | 'long';
type GenerationStatus = 'idle' | 'generating' | 'complete';

type GeneratedContent = {
  id: string;
  type: ContentType;
  prompt: string;
  content: string;
  tone: ToneStyle;
  createdAt: Date;
  isSaved: boolean;
  feedback?: 'positive' | 'negative';
};

type CopywriterConfig = {
  defaultType: ContentType;
  defaultTone: ToneStyle;
  variationsCount: number;
  showHistory: boolean;
  showTemplates: boolean;
  primaryColor: string;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type AICopywriterPanelProps = {
  variant?: Variant;
  config?: Partial<CopywriterConfig>;
  onGenerate?: (prompt: string, type: ContentType, tone: ToneStyle) => void;
  onCopy?: (content: string) => void;
  className?: string;
};

// Default configuration
const defaultConfig: CopywriterConfig = {
  defaultType: 'headline',
  defaultTone: 'professional',
  variationsCount: 3,
  showHistory: true,
  showTemplates: true,
  primaryColor: '#10B981',
};

// Content type options
const contentTypeOptions: { value: ContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'headline', label: 'Headline', icon: <FileText className="h-4 w-4" />, description: 'Attention-grabbing titles' },
  { value: 'tagline', label: 'Tagline', icon: <Hash className="h-4 w-4" />, description: 'Memorable brand slogans' },
  { value: 'description', label: 'Description', icon: <MessageSquare className="h-4 w-4" />, description: 'Product or service descriptions' },
  { value: 'cta', label: 'Call to Action', icon: <PenTool className="h-4 w-4" />, description: 'Compelling action buttons' },
  { value: 'social', label: 'Social Post', icon: <Hash className="h-4 w-4" />, description: 'Social media content' },
  { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" />, description: 'Email subject lines and body' },
  { value: 'bio', label: 'Bio', icon: <FileText className="h-4 w-4" />, description: 'Personal or company bios' },
  { value: 'caption', label: 'Caption', icon: <MessageSquare className="h-4 w-4" />, description: 'Image and video captions' },
];

// Tone options
const toneOptions: { value: ToneStyle; label: string; example: string }[] = [
  { value: 'professional', label: 'Professional', example: 'Clear and authoritative' },
  { value: 'casual', label: 'Casual', example: 'Relaxed and approachable' },
  { value: 'friendly', label: 'Friendly', example: 'Warm and welcoming' },
  { value: 'formal', label: 'Formal', example: 'Polished and traditional' },
  { value: 'humorous', label: 'Humorous', example: 'Witty and entertaining' },
  { value: 'persuasive', label: 'Persuasive', example: 'Convincing and compelling' },
  { value: 'inspirational', label: 'Inspirational', example: 'Motivating and uplifting' },
];

// Sample templates
const sampleTemplates: { type: ContentType; prompt: string }[] = [
  { type: 'headline', prompt: 'A headline for a productivity app' },
  { type: 'tagline', prompt: 'A tagline for an eco-friendly brand' },
  { type: 'description', prompt: 'A product description for wireless earbuds' },
  { type: 'cta', prompt: 'A CTA button for a newsletter signup' },
  { type: 'social', prompt: 'A Twitter post announcing a product launch' },
  { type: 'email', prompt: 'An email subject line for a sale announcement' },
];

// Sample generated content
const sampleGenerations: string[][] = [
  ['Transform Your Day with Intelligent Productivity', 'Work Smarter, Not Harder - Your Tasks, Simplified', 'The Future of Productivity is Here'],
  ['Green Today. Better Tomorrow.', 'Sustainability Meets Style', 'Kind to Earth, Kind to You'],
  ['Experience crystal-clear audio with our premium wireless earbuds. Featuring active noise cancellation and 24-hour battery life.', 'Immerse yourself in pure sound...'],
  ['Start Your Free Trial', 'Join 10,000+ Happy Users', 'Unlock Your Potential'],
];

// Sample history
const sampleHistory: GeneratedContent[] = [
  {
    id: '1',
    type: 'headline',
    prompt: 'A headline for a SaaS product',
    content: 'Supercharge Your Workflow with AI-Powered Automation',
    tone: 'professional',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isSaved: true,
  },
  {
    id: '2',
    type: 'tagline',
    prompt: 'A tagline for a fitness app',
    content: 'Your Journey, Your Pace, Your Victory',
    tone: 'inspirational',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isSaved: false,
  },
  {
    id: '3',
    type: 'cta',
    prompt: 'CTA for free trial',
    content: 'Start Your Free 14-Day Trial',
    tone: 'persuasive',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isSaved: true,
  },
];

export function AICopywriterPanel({
  variant = 'full',
  config: initialConfig,
  onGenerate,
  onCopy,
  className = '',
}: AICopywriterPanelProps) {
  const [config] = useState<CopywriterConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<ContentType>(config.defaultType);
  const [tone, setTone] = useState<ToneStyle>(config.defaultTone);
  const [length, setLength] = useState<LengthOption>('medium');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generations, setGenerations] = useState<string[]>([]);
  const [history, setHistory] = useState<GeneratedContent[]>(sampleHistory);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywords, setKeywords] = useState('');

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      return;
    }

    setStatus('generating');
    onGenerate?.(prompt, contentType, tone);

    // Simulate generation
    setTimeout(() => {
      const typeIndex = contentTypeOptions.findIndex(t => t.value === contentType);
      const mockResults = sampleGenerations[typeIndex % sampleGenerations.length] ?? [
        'AI-generated content will appear here',
        'Try again with a different prompt',
        'Explore various tones for different results',
      ];
      setGenerations(mockResults);
      setStatus('complete');

      // Add to history
      const newEntry: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType,
        prompt,
        content: mockResults[0] ?? '',
        tone,
        createdAt: new Date(),
        isSaved: false,
      };
      setHistory(prev => [newEntry, ...prev]);
    }, 2000);
  }, [prompt, contentType, tone, onGenerate]);

  const handleCopy = useCallback((content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    onCopy?.(content);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [onCopy]);

  const handleUseTemplate = useCallback((template: { type: ContentType; prompt: string }) => {
    setContentType(template.type);
    setPrompt(template.prompt);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item,
      ),
    );
  }, []);

  const sendFeedback = useCallback((id: string, feedback: 'positive' | 'negative') => {
    setHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, feedback } : item,
      ),
    );
  }, []);

  // Render Content Type Selector
  const renderContentTypeSelector = () => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Content Type
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {contentTypeOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setContentType(option.value)}
            className={`rounded-lg border p-3 text-left transition-all ${
              contentType === option.value
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className={`${contentType === option.value ? 'text-green-600 dark:text-green-400' : 'text-gray-500'} mb-1`}>
              {option.icon}
            </div>
            <p className={`text-sm font-medium ${contentType === option.value ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {option.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Render Tone Selector
  const renderToneSelector = () => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Tone of Voice
      </label>
      <div className="flex flex-wrap gap-2">
        {toneOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setTone(option.value)}
            className={`rounded-lg border px-3 py-2 text-sm transition-all ${
              tone === option.value
                ? 'border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Render Generation Results
  const renderResults = () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">Generated Content</h3>
      {generations.map((content, index) => (
        <div
          key={index}
          className="group rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="mb-3 text-gray-900 dark:text-white">{content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(content, index)}
                className="flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {copiedIndex === index
                  ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Copied!</span>
                      </>
                    )
                  : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
              </button>
              <button
                className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Regenerate"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button className="rounded-lg p-1.5 hover:bg-green-50 dark:hover:bg-green-900/20">
                <ThumbsUp className="h-4 w-4 text-gray-400 hover:text-green-500" />
              </button>
              <button className="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20">
                <ThumbsDown className="h-4 w-4 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <PenTool className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">AI Copywriter</span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what you need..."
            rows={2}
            className="mb-3 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <div className="mb-3 flex items-center space-x-2">
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value as ContentType)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {contentTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as ToneStyle)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {toneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || status === 'generating'}
            className="w-full rounded-lg py-2 font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: config.primaryColor }}
          >
            {status === 'generating' ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <PenTool className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className="font-medium text-gray-900 dark:text-white">AI Copywriter</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
          <div className="text-center text-white">
            <Sparkles className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">Generate Copy</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <PenTool className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">AI Copywriter</span>
          </div>
          <button
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Wand2 className="mr-1 inline h-4 w-4" />
            Generate
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="What do you need to write?"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="max-h-[250px] space-y-2 overflow-auto">
            {history.slice(0, 5).map(item => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <p className="truncate text-sm text-gray-900 dark:text-white">{item.content}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {item.type}
                    {' '}
                    •
                    {' '}
                    {item.tone}
                  </span>
                  <button
                    onClick={() => toggleSaved(item.id)}
                    className={`p-1 ${item.isSaved ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${config.primaryColor}20` }}
              >
                <PenTool className="h-5 w-5" style={{ color: config.primaryColor }} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                AI Copywriter
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <History className="h-5 w-5 text-gray-500" />
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Settings2 className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Panel - Input */}
          <div className="space-y-6 lg:col-span-2">
            {/* Main Input */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">What do you want to write?</h3>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your product, service, or campaign... Be specific about your target audience and goals."
                rows={4}
                className="mb-4 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />

              {/* Quick Templates */}
              {config.showTemplates && (
                <div className="mb-4">
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Quick templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {sampleTemplates.slice(0, 4).map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleUseTemplate(template)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        {template.prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Options */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mb-3 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                <span>Advanced Options</span>
              </button>

              {showAdvanced && (
                <div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Keywords to include (comma separated)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={e => setKeywords(e.target.value)}
                      placeholder="e.g., innovative, sustainable, premium"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content Length
                    </label>
                    <div className="flex space-x-2">
                      {(['short', 'medium', 'long'] as LengthOption[]).map(option => (
                        <button
                          key={option}
                          onClick={() => setLength(option)}
                          className={`rounded-lg border px-4 py-2 text-sm capitalize ${
                            length === option
                              ? 'border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20'
                              : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Type Selector */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {renderContentTypeSelector()}
            </div>

            {/* Tone Selector */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {renderToneSelector()}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === 'generating'}
              className="flex w-full items-center justify-center space-x-2 rounded-xl py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: config.primaryColor }}
            >
              {status === 'generating'
                ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  )
                : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Copy</span>
                    </>
                  )}
            </button>

            {/* Results */}
            {status === 'complete' && generations.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                {renderResults()}
              </div>
            )}
          </div>

          {/* Right Panel - History */}
          {config.showHistory && (
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">History</h3>
                  <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    Clear All
                  </button>
                </div>
                <div className="max-h-[600px] space-y-3 overflow-auto">
                  {history.map(item => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 capitalize dark:bg-gray-700 dark:text-gray-400">
                          {item.type}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleSaved(item.id)}
                            className={`p-1 ${item.isSaved ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            <Bookmark className={`h-4 w-4 ${item.isSaved ? 'fill-current' : ''}`} />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="mb-2 line-clamp-2 text-sm text-gray-900 dark:text-white">
                        {item.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{item.tone}</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => sendFeedback(item.id, 'positive')}
                            className={`p-1 ${item.feedback === 'positive' ? 'text-green-500' : 'text-gray-400'}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => sendFeedback(item.id, 'negative')}
                            className={`p-1 ${item.feedback === 'negative' ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AICopywriterPanel;
