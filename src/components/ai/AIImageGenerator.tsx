'use client';

import {
  ChevronDown,
  Download,
  Expand,
  Heart,
  History,
  Image,
  Loader2,
  RefreshCw,
  Settings2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ImageStyle = 'realistic' | 'artistic' | 'cartoon' | 'sketch' | 'watercolor' | '3d' | 'pixel' | 'anime';
type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';
type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';

type GeneratedImage = {
  id: string;
  prompt: string;
  negativePrompt?: string;
  imageUrl: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  seed: number;
  createdAt: Date;
  isFavorite: boolean;
};

type GenerationSettings = {
  style: ImageStyle;
  aspectRatio: AspectRatio;
  quality: 'standard' | 'hd' | 'ultra';
  variations: number;
  seed?: number;
  guidanceScale: number;
  steps: number;
};

type AIImageGeneratorConfig = {
  defaultStyle: ImageStyle;
  defaultAspectRatio: AspectRatio;
  maxVariations: number;
  showHistory: boolean;
  showAdvancedSettings: boolean;
  primaryColor: string;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type AIImageGeneratorProps = {
  variant?: Variant;
  config?: Partial<AIImageGeneratorConfig>;
  onGenerate?: (prompt: string, settings: GenerationSettings) => void;
  onImageSelect?: (image: GeneratedImage) => void;
  className?: string;
};

// Default configuration
const defaultConfig: AIImageGeneratorConfig = {
  defaultStyle: 'realistic',
  defaultAspectRatio: '1:1',
  maxVariations: 4,
  showHistory: true,
  showAdvancedSettings: true,
  primaryColor: '#8B5CF6',
};

// Style options
const styleOptions: { value: ImageStyle; label: string; description: string }[] = [
  { value: 'realistic', label: 'Realistic', description: 'Photo-realistic images' },
  { value: 'artistic', label: 'Artistic', description: 'Creative artistic style' },
  { value: 'cartoon', label: 'Cartoon', description: 'Cartoon-style illustrations' },
  { value: 'sketch', label: 'Sketch', description: 'Hand-drawn sketch look' },
  { value: 'watercolor', label: 'Watercolor', description: 'Watercolor painting style' },
  { value: '3d', label: '3D Render', description: '3D rendered graphics' },
  { value: 'pixel', label: 'Pixel Art', description: 'Retro pixel art style' },
  { value: 'anime', label: 'Anime', description: 'Anime/manga style' },
];

// Aspect ratio options
const aspectRatioOptions: { value: AspectRatio; label: string; dimensions: string }[] = [
  { value: '1:1', label: 'Square', dimensions: '1024x1024' },
  { value: '16:9', label: 'Landscape', dimensions: '1792x1024' },
  { value: '9:16', label: 'Portrait', dimensions: '1024x1792' },
  { value: '4:3', label: 'Standard', dimensions: '1365x1024' },
  { value: '3:4', label: 'Portrait+', dimensions: '1024x1365' },
  { value: '21:9', label: 'Ultrawide', dimensions: '2048x878' },
];

// Sample history
const sampleHistory: GeneratedImage[] = [
  {
    id: '1',
    prompt: 'A futuristic cityscape at sunset with flying cars',
    imageUrl: '',
    style: 'realistic',
    aspectRatio: '16:9',
    seed: 12345,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    isFavorite: true,
  },
  {
    id: '2',
    prompt: 'A magical forest with glowing mushrooms',
    imageUrl: '',
    style: 'artistic',
    aspectRatio: '1:1',
    seed: 67890,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isFavorite: false,
  },
  {
    id: '3',
    prompt: 'A cute robot playing with a cat',
    imageUrl: '',
    style: 'cartoon',
    aspectRatio: '1:1',
    seed: 11111,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isFavorite: true,
  },
];

// Prompt suggestions
const promptSuggestions = [
  'A serene mountain landscape at golden hour',
  'An abstract geometric pattern with vibrant colors',
  'A cozy coffee shop interior with warm lighting',
  'A futuristic space station orbiting Earth',
  'A vintage car on a desert highway',
  'A mystical dragon in a crystal cave',
];

export function AIImageGenerator({
  variant = 'full',
  config: initialConfig,
  onGenerate,
  onImageSelect,
  className = '',
}: AIImageGeneratorProps) {
  const [config] = useState<AIImageGeneratorConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    style: config.defaultStyle,
    aspectRatio: config.defaultAspectRatio,
    quality: 'standard',
    variations: 1,
    guidanceScale: 7.5,
    steps: 30,
  });
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [history, setHistory] = useState<GeneratedImage[]>(sampleHistory);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSettings = useCallback((updates: Partial<GenerationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      return;
    }

    setStatus('generating');
    onGenerate?.(prompt, settings);

    // Simulate generation
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        negativePrompt: negativePrompt || undefined,
        imageUrl: '',
        style: settings.style,
        aspectRatio: settings.aspectRatio,
        seed: settings.seed ?? Math.floor(Math.random() * 1000000),
        createdAt: new Date(),
        isFavorite: false,
      };
      setHistory(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
      setStatus('complete');
    }, 3000);
  }, [prompt, negativePrompt, settings, onGenerate]);

  const handleSelectImage = useCallback((image: GeneratedImage) => {
    setSelectedImage(image);
    onImageSelect?.(image);
  }, [onImageSelect]);

  const toggleFavorite = useCallback((imageId: string) => {
    setHistory(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, isFavorite: !img.isFavorite } : img,
      ),
    );
  }, []);

  const usePromptSuggestion = useCallback((suggestion: string) => {
    setPrompt(suggestion);
  }, []);

  // Render Style Selector
  const renderStyleSelector = () => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Style
      </label>
      <div className="grid grid-cols-4 gap-2">
        {styleOptions.map(option => (
          <button
            key={option.value}
            onClick={() => updateSettings({ style: option.value })}
            className={`rounded-lg border p-3 text-center transition-all ${
              settings.style === option.value
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className="mx-auto mb-1 h-8 w-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400" />
            <p className={`text-xs font-medium ${settings.style === option.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {option.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  // Render Aspect Ratio Selector
  const renderAspectRatioSelector = () => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Aspect Ratio
      </label>
      <div className="flex flex-wrap gap-2">
        {aspectRatioOptions.map(option => (
          <button
            key={option.value}
            onClick={() => updateSettings({ aspectRatio: option.value })}
            className={`rounded-lg border px-3 py-2 text-sm transition-all ${
              settings.aspectRatio === option.value
                ? 'border-purple-500 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Render Generation Preview
  const renderGenerationPreview = () => {
    const aspectClass = {
      '1:1': 'aspect-square',
      '16:9': 'aspect-video',
      '9:16': 'aspect-[9/16]',
      '4:3': 'aspect-[4/3]',
      '3:4': 'aspect-[3/4]',
      '21:9': 'aspect-[21/9]',
    }[settings.aspectRatio];

    return (
      <div className={`${aspectClass} relative max-h-[400px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800`}>
        {status === 'generating'
          ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-500" />
                <p className="font-medium text-gray-600 dark:text-gray-400">Generating your image...</p>
                <p className="text-sm text-gray-500">This may take a few seconds</p>
              </div>
            )
          : selectedImage
            ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <div className="text-center text-white">
                    <Image className="mx-auto mb-4 h-16 w-16 opacity-50" />
                    <p className="text-sm opacity-75">Generated Image Preview</p>
                  </div>
                </div>
              )
            : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Sparkles className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="font-medium text-gray-600 dark:text-gray-400">Your creation will appear here</p>
                  <p className="text-sm text-gray-500">Enter a prompt and click Generate</p>
                </div>
              )}
      </div>
    );
  };

  // Render History Item
  const renderHistoryItem = (image: GeneratedImage) => (
    <div
      key={image.id}
      onClick={() => handleSelectImage(image)}
      className={`group relative cursor-pointer overflow-hidden rounded-lg ${
        selectedImage?.id === image.id ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(image.id);
          }}
          className="mr-2 rounded-full bg-white/20 p-2 hover:bg-white/30"
        >
          <Heart className={`h-4 w-4 ${image.isFavorite ? 'fill-current text-red-500' : 'text-white'}`} />
        </button>
        <button className="rounded-full bg-white/20 p-2 hover:bg-white/30">
          <Download className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <Wand2 className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">AI Image Generator</span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your image..."
            rows={2}
            className="mb-3 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
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
          <Wand2 className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className="font-medium text-gray-900 dark:text-white">AI Image Generator</span>
        </div>
        <div className="flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="text-center text-white">
            <Sparkles className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">Create AI Images</p>
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
            <Wand2 className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">AI Image Generator</span>
          </div>
          <button
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            Generate
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your image..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {history.slice(0, 6).map(img => renderHistoryItem(img))}
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
                <Wand2 className="h-5 w-5" style={{ color: config.primaryColor }} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                AI Image Generator
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
          {/* Left Panel - Settings */}
          <div className="space-y-6 lg:col-span-1">
            {/* Prompt Input */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Describe Your Image</h3>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="A serene mountain landscape at golden hour with snow-capped peaks..."
                rows={4}
                className="mb-3 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />

              {/* Prompt Suggestions */}
              <div className="mb-4">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Try a suggestion:</p>
                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => usePromptSuggestion(suggestion)}
                      className="max-w-[200px] truncate rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Negative Prompt */}
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
                      Negative Prompt
                    </label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={e => setNegativePrompt(e.target.value)}
                      placeholder="What to avoid (e.g., blurry, low quality)"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Guidance Scale:
                      {' '}
                      {settings.guidanceScale}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={settings.guidanceScale}
                      onChange={e => updateSettings({ guidanceScale: Number.parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Steps:
                      {' '}
                      {settings.steps}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={settings.steps}
                      onChange={e => updateSettings({ steps: Number.parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Style Selector */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {renderStyleSelector()}
            </div>

            {/* Aspect Ratio */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {renderAspectRatioSelector()}
            </div>

            {/* Quality & Variations */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quality
                  </label>
                  <select
                    value={settings.quality}
                    onChange={e => updateSettings({ quality: e.target.value as 'standard' | 'hd' | 'ultra' })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="hd">HD</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Variations:
                    {' '}
                    {settings.variations}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={config.maxVariations}
                    value={settings.variations}
                    onChange={e => updateSettings({ variations: Number.parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
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
                      <span>Generate Image</span>
                    </>
                  )}
            </button>
          </div>

          {/* Right Panel - Preview & History */}
          <div className="space-y-6 lg:col-span-2">
            {/* Preview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Preview</h3>
                {selectedImage && (
                  <div className="flex items-center space-x-2">
                    <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <RefreshCw className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Expand className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Download className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>
              {renderGenerationPreview()}

              {/* Image Info */}
              {selectedImage && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Prompt:</span>
                    {' '}
                    {selectedImage.prompt}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>
                      Style:
                      {selectedImage.style}
                    </span>
                    <span>
                      Aspect:
                      {selectedImage.aspectRatio}
                    </span>
                    <span>
                      Seed:
                      {selectedImage.seed}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            {config.showHistory && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Generations</h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {history.slice(0, 12).map(img => renderHistoryItem(img))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIImageGenerator;
