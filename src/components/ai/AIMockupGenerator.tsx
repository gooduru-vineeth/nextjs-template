'use client';

import {
  Check,
  ChevronRight,
  Copy,
  Download,
  Grid3X3,
  Heart,
  Image,
  Layers,
  Layout,
  Loader2,
  Monitor,
  Palette,
  RefreshCw,
  Settings,
  Share2,
  Smartphone,
  Sparkles,
  Tablet,
  Type,
  Wand2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type MockupStyle = 'minimal' | 'modern' | 'playful' | 'corporate' | 'elegant' | 'bold';
export type MockupType = 'landing-page' | 'dashboard' | 'mobile-app' | 'e-commerce' | 'portfolio' | 'saas' | 'blog';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';
export type ColorScheme = 'light' | 'dark' | 'auto';

export type GenerationPrompt = {
  text: string;
  type: MockupType;
  style: MockupStyle;
  colorScheme: ColorScheme;
  primaryColor?: string;
  device: DeviceType;
  includeComponents: string[];
};

export type GeneratedMockup = {
  id: string;
  prompt: GenerationPrompt;
  thumbnailUrl: string;
  fullUrl: string;
  createdAt: Date;
  liked: boolean;
  downloads: number;
  variations: string[];
};

export type GenerationHistory = {
  id: string;
  prompt: string;
  mockupType: MockupType;
  createdAt: Date;
  thumbnailUrl: string;
  status: GenerationStatus;
};

export type AICredits = {
  available: number;
  used: number;
  total: number;
  resetDate: Date;
};

export type AIMockupGeneratorProps = {
  credits?: AICredits;
  history?: GenerationHistory[];
  generatedMockups?: GeneratedMockup[];
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onGenerate?: (prompt: GenerationPrompt) => void;
  onDownload?: (mockupId: string) => void;
  onLike?: (mockupId: string) => void;
  onShare?: (mockupId: string) => void;
  onSelectVariation?: (mockupId: string, variationIndex: number) => void;
};

// Mock data generators
const generateMockCredits = (): AICredits => ({
  available: 47,
  used: 53,
  total: 100,
  resetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
});

const generateMockHistory = (): GenerationHistory[] => [
  {
    id: 'h1',
    prompt: 'Modern SaaS dashboard with analytics widgets and dark theme',
    mockupType: 'dashboard',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    thumbnailUrl: '/generated/dash-1.jpg',
    status: 'completed',
  },
  {
    id: 'h2',
    prompt: 'E-commerce product page with reviews and related items',
    mockupType: 'e-commerce',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    thumbnailUrl: '/generated/ecom-1.jpg',
    status: 'completed',
  },
  {
    id: 'h3',
    prompt: 'Mobile fitness app with workout tracking',
    mockupType: 'mobile-app',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    thumbnailUrl: '/generated/mobile-1.jpg',
    status: 'completed',
  },
  {
    id: 'h4',
    prompt: 'Landing page for AI startup with gradient hero',
    mockupType: 'landing-page',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    thumbnailUrl: '/generated/landing-1.jpg',
    status: 'completed',
  },
];

const generateMockMockups = (): GeneratedMockup[] => [
  {
    id: 'm1',
    prompt: {
      text: 'Modern SaaS dashboard with analytics widgets and dark theme',
      type: 'dashboard',
      style: 'modern',
      colorScheme: 'dark',
      primaryColor: '#6366f1',
      device: 'desktop',
      includeComponents: ['charts', 'tables', 'cards', 'sidebar'],
    },
    thumbnailUrl: '/generated/dash-1.jpg',
    fullUrl: '/generated/dash-1-full.jpg',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    liked: true,
    downloads: 12,
    variations: ['/generated/dash-1-v1.jpg', '/generated/dash-1-v2.jpg', '/generated/dash-1-v3.jpg'],
  },
  {
    id: 'm2',
    prompt: {
      text: 'E-commerce product page with reviews and related items',
      type: 'e-commerce',
      style: 'minimal',
      colorScheme: 'light',
      primaryColor: '#10b981',
      device: 'desktop',
      includeComponents: ['gallery', 'reviews', 'cart', 'recommendations'],
    },
    thumbnailUrl: '/generated/ecom-1.jpg',
    fullUrl: '/generated/ecom-1-full.jpg',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    liked: false,
    downloads: 8,
    variations: ['/generated/ecom-1-v1.jpg', '/generated/ecom-1-v2.jpg'],
  },
];

// Helper functions
const getStyleIcon = (style: MockupStyle) => {
  const icons: Record<MockupStyle, typeof Sparkles> = {
    minimal: Layout,
    modern: Zap,
    playful: Sparkles,
    corporate: Grid3X3,
    elegant: Palette,
    bold: Type,
  };
  return icons[style];
};

const getDeviceIcon = (device: DeviceType) => {
  const icons: Record<DeviceType, typeof Monitor> = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };
  return icons[device];
};

const getTypeLabel = (type: MockupType): string => {
  const labels: Record<MockupType, string> = {
    'landing-page': 'Landing Page',
    'dashboard': 'Dashboard',
    'mobile-app': 'Mobile App',
    'e-commerce': 'E-Commerce',
    'portfolio': 'Portfolio',
    'saas': 'SaaS',
    'blog': 'Blog',
  };
  return labels[type];
};

const componentOptions: Record<MockupType, string[]> = {
  'landing-page': ['hero', 'features', 'testimonials', 'pricing', 'cta', 'footer', 'navigation'],
  'dashboard': ['sidebar', 'charts', 'tables', 'cards', 'stats', 'notifications', 'filters'],
  'mobile-app': ['navigation', 'cards', 'lists', 'forms', 'tabs', 'bottom-nav', 'modals'],
  'e-commerce': ['gallery', 'cart', 'reviews', 'filters', 'recommendations', 'checkout', 'search'],
  'portfolio': ['hero', 'projects', 'about', 'skills', 'contact', 'timeline', 'testimonials'],
  'saas': ['hero', 'features', 'pricing', 'integrations', 'faq', 'demo', 'testimonials'],
  'blog': ['header', 'articles', 'sidebar', 'comments', 'categories', 'author', 'newsletter'],
};

// Main component
export default function AIMockupGenerator({
  credits = generateMockCredits(),
  history = generateMockHistory(),
  generatedMockups = generateMockMockups(),
  variant = 'full',
  onGenerate,
  onDownload,
  onLike,
  onShare,
  onSelectVariation,
}: AIMockupGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState<MockupType>('landing-page');
  const [selectedStyle, setSelectedStyle] = useState<MockupStyle>('modern');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [selectedComponents, setSelectedComponents] = useState<string[]>(['hero', 'features', 'cta']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // State for future mockup detail view
  const [_selectedMockup, _setSelectedMockup] = useState<GeneratedMockup | null>(null);
  void _selectedMockup; void _setSelectedMockup;

  const handleGenerate = () => {
    if (!prompt.trim() || credits.available <= 0) {
      return;
    }

    setIsGenerating(true);
    onGenerate?.({
      text: prompt,
      type: selectedType,
      style: selectedStyle,
      colorScheme,
      primaryColor,
      device: selectedDevice,
      includeComponents: selectedComponents,
    });

    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const toggleComponent = (component: string) => {
    setSelectedComponents(prev =>
      prev.includes(component)
        ? prev.filter(c => c !== component)
        : [...prev, component],
    );
  };

  if (variant === 'widget') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">AI Generator</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {credits.available}
            {' '}
            credits left
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Describe your mockup..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isGenerating
            ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              )
            : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate
                </>
              )}
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Wand2 className="h-5 w-5 text-purple-500" />
            AI Mockup Generator
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Zap className="h-3 w-3 text-amber-500" />
            {credits.available}
            {' '}
            /
            {credits.total}
          </div>
        </div>

        {/* Quick Type Selection */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(['landing-page', 'dashboard', 'mobile-app', 'e-commerce'] as MockupType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedType === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {getTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="relative mb-4">
          <textarea
            placeholder="Describe your mockup in detail..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating || credits.available <= 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isGenerating
            ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              )
            : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Mockup
                </>
              )}
        </button>

        {/* Recent */}
        {history.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Recent generations</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {history.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  className="h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 ring-purple-500 hover:ring-2 dark:from-gray-700 dark:to-gray-600"
                  onClick={() => setPrompt(item.prompt)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Wand2 className="h-5 w-5 text-purple-500" />
            AI Mockup Generator
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${(credits.available / credits.total) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {credits.available}
                {' '}
                credits
              </span>
            </div>
          </div>
        </div>

        {/* Generator */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Describe your mockup
              </label>
              <textarea
                placeholder="A modern SaaS landing page with a gradient hero section, feature cards, pricing table, and testimonial carousel..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Type</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as MockupType)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {(['landing-page', 'dashboard', 'mobile-app', 'e-commerce', 'portfolio', 'saas', 'blog'] as MockupType[]).map(type => (
                    <option key={type} value={type}>{getTypeLabel(type)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Style</label>
                <select
                  value={selectedStyle}
                  onChange={e => setSelectedStyle(e.target.value as MockupStyle)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {(['minimal', 'modern', 'playful', 'corporate', 'elegant', 'bold'] as MockupStyle[]).map(style => (
                    <option key={style} value={style}>{style.charAt(0).toUpperCase() + style.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || credits.available <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-medium text-white disabled:opacity-50"
            >
              {isGenerating
                ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating mockup...
                    </>
                  )
                : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Mockup (1 credit)
                    </>
                  )}
            </button>
          </div>

          {/* Preview Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              {isGenerating
                ? (
                    <div className="text-center">
                      <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-purple-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Generating your mockup...</p>
                    </div>
                  )
                : generatedMockups.length > 0 && generatedMockups[0]
                  ? (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Latest:
                          {generatedMockups[0].prompt.text.slice(0, 50)}
                          ...
                        </p>
                      </div>
                    )
                  : (
                      <div className="text-center">
                        <Image className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your mockup will appear here</p>
                      </div>
                    )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Wand2 className="h-6 w-6 text-purple-500" />
              AI Mockup Generator
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Transform your ideas into stunning mockups with AI
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-gray-900 dark:text-white">{credits.available}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  /
                  {credits.total}
                  {' '}
                  credits
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Resets
                {' '}
                {new Date(credits.resetDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="space-y-6 lg:col-span-2">
            {/* Prompt Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Describe your mockup
              </label>
              <textarea
                placeholder="A modern SaaS landing page with a gradient hero section featuring a product screenshot, feature cards with icons, pricing table with 3 tiers, customer testimonials carousel, and a footer with newsletter signup..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Be specific about layout, colors, components, and style for best results
              </p>
            </div>

            {/* Type Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mockup Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['landing-page', 'dashboard', 'mobile-app', 'e-commerce', 'portfolio', 'saas', 'blog'] as MockupType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      selectedType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {getTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Design Style
              </label>
              <div className="grid grid-cols-6 gap-2">
                {(['minimal', 'modern', 'playful', 'corporate', 'elegant', 'bold'] as MockupStyle[]).map((style) => {
                  const StyleIcon = getStyleIcon(style);
                  return (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`rounded-xl p-3 text-center transition-all ${
                        selectedStyle === style
                          ? 'border-2 border-purple-500 bg-purple-100 dark:bg-purple-900/30'
                          : 'border-2 border-transparent bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:hover:border-gray-600'
                      }`}
                    >
                      <StyleIcon className={`mx-auto mb-1 h-5 w-5 ${
                        selectedStyle === style ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                      }`}
                      />
                      <span className={`text-xs font-medium ${
                        selectedStyle === style ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'
                      }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Device & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Device
                </label>
                <div className="flex gap-2">
                  {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map((device) => {
                    const DeviceIcon = getDeviceIcon(device);
                    return (
                      <button
                        key={device}
                        onClick={() => setSelectedDevice(device)}
                        className={`flex flex-1 flex-col items-center gap-1 rounded-lg p-3 transition-colors ${
                          selectedDevice === device
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        <DeviceIcon className="h-5 w-5" />
                        <span className="text-xs font-medium capitalize">{device}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color Scheme
                </label>
                <div className="flex gap-2">
                  {(['light', 'dark', 'auto'] as ColorScheme[]).map(scheme => (
                    <button
                      key={scheme}
                      onClick={() => setColorScheme(scheme)}
                      className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        colorScheme === scheme
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Settings className="h-4 w-4" />
                Advanced Options
                <ChevronRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  {/* Primary Color */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                        <button
                          key={color}
                          onClick={() => setPrimaryColor(color)}
                          className={`h-8 w-8 rounded-lg transition-all ${
                            primaryColor === color ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Components */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Include Components
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {componentOptions[selectedType].map(component => (
                        <button
                          key={component}
                          onClick={() => toggleComponent(component)}
                          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            selectedComponents.includes(component)
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {selectedComponents.includes(component) && <Check className="h-3 w-3" />}
                          {component.charAt(0).toUpperCase() + component.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || credits.available <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 text-lg font-semibold text-white disabled:opacity-50"
            >
              {isGenerating
                ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      Generating your mockup...
                    </>
                  )
                : (
                    <>
                      <Sparkles className="h-6 w-6" />
                      Generate Mockup
                    </>
                  )}
            </button>
          </div>

          {/* Right Column - Results & History */}
          <div className="space-y-6">
            {/* Latest Generation */}
            {(isGenerating || generatedMockups.length > 0) && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isGenerating ? 'Generating...' : 'Latest Result'}
                </label>
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  {isGenerating
                    ? (
                        <div className="flex h-full w-full flex-col items-center justify-center">
                          <div className="relative">
                            <div className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-800" />
                            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                          </div>
                          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Creating your mockup...</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">This may take 10-30 seconds</p>
                        </div>
                      )
                    : generatedMockups[0]
                      ? (
                          (() => {
                            const mockup = generatedMockups[0];
                            return (
                              <div className="group relative h-full w-full">
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                                  <Layers className="h-12 w-12 text-purple-300 dark:text-purple-700" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                  <button
                                    onClick={() => onDownload?.(mockup.id)}
                                    className="rounded-lg bg-white p-2 text-gray-700 hover:bg-gray-100"
                                  >
                                    <Download className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => onLike?.(mockup.id)}
                                    className={`rounded-lg p-2 ${
                                      mockup.liked
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    <Heart className={`h-5 w-5 ${mockup.liked ? 'fill-current' : ''}`} />
                                  </button>
                                  <button
                                    onClick={() => onShare?.(mockup.id)}
                                    className="rounded-lg bg-white p-2 text-gray-700 hover:bg-gray-100"
                                  >
                                    <Share2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })()
                        )
                      : null}
                </div>

                {/* Variations */}
                {!isGenerating && generatedMockups[0] && generatedMockups[0].variations.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Variations</p>
                    <div className="flex gap-2">
                      {generatedMockups[0].variations.map((_, i) => {
                        const mockupId = generatedMockups[0]?.id;
                        return (
                          <button
                            key={i}
                            onClick={() => mockupId && onSelectVariation?.(mockupId, i)}
                            className="h-12 w-16 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 ring-purple-500 hover:ring-2 dark:from-gray-700 dark:to-gray-600"
                          />
                        );
                      })}
                      <button className="flex h-12 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 dark:border-gray-600">
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent Generations
              </label>
              <div className="space-y-2">
                {history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setPrompt(item.prompt)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-900 dark:text-white">{item.prompt}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {getTypeLabel(item.mockupType)}
                        {' '}
                        •
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Copy className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-purple-800 dark:text-purple-200">
                <Sparkles className="h-4 w-4" />
                Tips for better results
              </h4>
              <ul className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
                <li>• Be specific about layout and component placement</li>
                <li>• Mention color preferences and visual style</li>
                <li>• Reference specific design elements you want</li>
                <li>• Use industry terms (hero, CTA, card, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
