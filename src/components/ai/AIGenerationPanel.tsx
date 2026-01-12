'use client';

import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  Image,
  Loader2,
  MessageSquare,
  Palette,
  RefreshCw,
  Sliders,
  Sparkles,
  Type,
  Wand2,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type GenerationType = 'text' | 'image' | 'layout' | 'style' | 'content';

export type GenerationPreset = {
  id: string;
  name: string;
  type: GenerationType;
  description: string;
  prompt?: string;
};

export type GenerationResult = {
  id: string;
  type: GenerationType;
  content: string;
  preview?: string;
  timestamp: Date;
};

export type AIGenerationPanelProps = {
  onGenerate: (prompt: string, type: GenerationType, options?: Record<string, unknown>) => Promise<GenerationResult>;
  presets?: GenerationPreset[];
  recentResults?: GenerationResult[];
  variant?: 'full' | 'compact' | 'inline' | 'sidebar';
  defaultType?: GenerationType;
  showPresets?: boolean;
  showHistory?: boolean;
  className?: string;
};

export default function AIGenerationPanel({
  onGenerate,
  presets = [],
  recentResults = [],
  variant = 'full',
  defaultType = 'text',
  showPresets = true,
  showHistory = true,
  className = '',
}: AIGenerationPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<GenerationType>(defaultType);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const generationTypes: { type: GenerationType; label: string; icon: React.ReactNode; description: string }[] = [
    { type: 'text', label: 'Text', icon: <Type size={18} />, description: 'Generate copy and content' },
    { type: 'image', label: 'Image', icon: <Image size={18} />, description: 'Generate images from descriptions' },
    { type: 'layout', label: 'Layout', icon: <Sliders size={18} />, description: 'Suggest mockup layouts' },
    { type: 'style', label: 'Style', icon: <Palette size={18} />, description: 'Generate color schemes and styles' },
    { type: 'content', label: 'Content', icon: <MessageSquare size={18} />, description: 'Generate full conversations' },
  ];

  const defaultPresets: GenerationPreset[] = [
    { id: '1', name: 'Viral Tweet', type: 'text', description: 'Generate engaging tweet content' },
    { id: '2', name: 'Product Announcement', type: 'text', description: 'Announce a new product or feature' },
    { id: '3', name: 'Customer Testimonial', type: 'content', description: 'Generate realistic testimonial' },
    { id: '4', name: 'Profile Picture', type: 'image', description: 'Generate avatar placeholder' },
    { id: '5', name: 'Color Palette', type: 'style', description: 'Generate brand color scheme' },
    { id: '6', name: 'Grid Layout', type: 'layout', description: 'Suggest multi-image layout' },
  ];

  const displayPresets = presets.length > 0 ? presets : defaultPresets;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await onGenerate(prompt, selectedType);
      setCurrentResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedType, onGenerate]);

  const handleCopy = useCallback(() => {
    if (currentResult?.content) {
      navigator.clipboard.writeText(currentResult.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentResult]);

  const handlePresetSelect = useCallback((preset: GenerationPreset) => {
    setSelectedType(preset.type);
    if (preset.prompt) {
      setPrompt(preset.prompt);
    }
  }, []);

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative flex-1">
          <Sparkles size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe what to generate..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
          Generate
        </button>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`flex w-80 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {/* Header */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">AI Generation</h2>
          </div>
        </div>

        {/* Type Selection */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2">
            {generationTypes.slice(0, 3).map(gt => (
              <button
                key={gt.type}
                onClick={() => setSelectedType(gt.type)}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-colors ${
                  selectedType === gt.type
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {gt.icon}
                <span className="text-xs">{gt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="flex-1 space-y-4 p-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Describe the ${selectedType} you want to generate...`}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900"
            />
          </div>

          {/* Quick Presets */}
          {showPresets && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Presets
              </label>
              <div className="space-y-1">
                {displayPresets.filter(p => p.type === selectedType).slice(0, 3).map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 py-3 font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating
              ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                )
              : (
                  <>
                    <Wand2 size={18} />
                    Generate
                  </>
                )}
          </button>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Generation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generate content with AI</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            {generationTypes.slice(0, 4).map(gt => (
              <button
                key={gt.type}
                onClick={() => setSelectedType(gt.type)}
                className={`flex-1 rounded-lg py-2 text-sm transition-colors ${
                  selectedType === gt.type
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                {gt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Generation</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generate mockup content with AI assistance</p>
          </div>
        </div>
      </div>

      {/* Type Selection */}
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Generation Type
        </label>
        <div className="grid grid-cols-5 gap-3">
          {generationTypes.map(gt => (
            <button
              key={gt.type}
              onClick={() => setSelectedType(gt.type)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                selectedType === gt.type
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <div className={`${selectedType === gt.type ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                {gt.icon}
              </div>
              <span className={`text-sm font-medium ${
                selectedType === gt.type ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
              }`}
              >
                {gt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-4 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`Describe the ${selectedType} you want to generate...`}
            rows={4}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        {/* Presets */}
        {showPresets && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {displayPresets.filter(p => p.type === selectedType).map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <Zap size={14} />
            Advanced Options
            <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Creativity</span>
                <input type="range" min="0" max="100" defaultValue="50" className="w-32" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Max Length</span>
                <input type="range" min="50" max="500" defaultValue="200" className="w-32" />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating
              ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                )
              : (
                  <>
                    <Wand2 size={18} />
                    Generate
                  </>
                )}
          </button>
          {currentResult && (
            <button
              onClick={() => handleGenerate()}
              className="rounded-xl border border-gray-200 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <RefreshCw size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {currentResult && (
        <div className="border-t border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Generated Result</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            {currentResult.preview && (
              <img src={currentResult.preview} alt="Generated" className="mb-3 w-full rounded-lg" />
            )}
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{currentResult.content}</p>
          </div>
        </div>
      )}

      {/* History */}
      {showHistory && recentResults.length > 0 && (
        <div className="border-t border-gray-100 p-6 dark:border-gray-700">
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Recent Generations</h3>
          <div className="space-y-2">
            {recentResults.slice(0, 5).map(result => (
              <div
                key={result.id}
                className="cursor-pointer rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                    {result.content.substring(0, 50)}
                    ...
                  </span>
                  <span className="text-xs text-gray-500 capitalize dark:text-gray-400">{result.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
