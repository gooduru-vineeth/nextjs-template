'use client';

import {
  Calendar,
  ChevronRight,
  Download,
  Flag,
  Globe,
  Heart,
  Share2,
  Shield,
  Smartphone,
  Star,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type AppStorePlatform = 'ios' | 'android';
export type AppCategory = 'productivity' | 'social' | 'entertainment' | 'utilities' | 'health' | 'finance' | 'education' | 'games';

export type AppScreenshot = {
  id: string;
  url: string;
  alt: string;
};

export type AppReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  developerResponse?: {
    content: string;
    date: Date;
  };
};

export type AppInfo = {
  name: string;
  subtitle: string;
  developer: string;
  developerUrl?: string;
  icon: string;
  rating: number;
  ratingCount: number;
  category: AppCategory;
  price: number;
  inAppPurchases: boolean;
  age: string;
  rank?: number;
  description: string;
  whatsNew: string;
  version: string;
  size: string;
  languages: string[];
  compatibility: string;
  privacyUrl?: string;
  screenshots: AppScreenshot[];
  reviews: AppReview[];
};

export type AppStoreMockupEditorProps = {
  platform?: AppStorePlatform;
  appInfo?: AppInfo;
  variant?: 'full' | 'compact' | 'preview';
  onPlatformChange?: (platform: AppStorePlatform) => void;
  onExport?: () => void;
};

// Mock data
const generateMockAppInfo = (): AppInfo => ({
  name: 'MockFlow',
  subtitle: 'Create Beautiful Mockups',
  developer: 'MockFlow Inc.',
  developerUrl: 'https://mockflow.com',
  icon: '/app-icon.png',
  rating: 4.8,
  ratingCount: 12543,
  category: 'productivity',
  price: 0,
  inAppPurchases: true,
  age: '4+',
  rank: 12,
  description: `MockFlow is the easiest way to create stunning mockups for your app, website, or social media. Whether you're a designer, developer, or marketer, MockFlow helps you create professional-looking mockups in minutes.

Features:
• Create realistic chat mockups (WhatsApp, iMessage, Messenger)
• Design beautiful social media posts (Instagram, Twitter, TikTok)
• Generate email mockups (Gmail, Outlook, Apple Mail)
• Customize every detail with our intuitive editor
• Export in high resolution (PNG, JPG, PDF)
• Access 1000+ templates

What's included:
✓ 50+ free templates
✓ Real-time preview
✓ Dark mode support
✓ Cloud sync across devices
✓ Team collaboration (Pro)

Perfect for:
- UX/UI designers creating presentations
- Marketers showcasing app features
- Developers documenting their work
- Content creators making engaging posts`,
  whatsNew: `Version 2.5.0

• NEW: Email mockup editor with Gmail, Outlook, and Apple Mail templates
• NEW: App store listing mockup generator
• Improved: Faster export speeds (up to 2x)
• Fixed: Dark mode rendering issues
• Fixed: Memory optimization for large projects

Thanks for using MockFlow! Rate us if you enjoy the app.`,
  version: '2.5.0',
  size: '45.2 MB',
  languages: ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Korean'],
  compatibility: 'iOS 15.0 or later. Compatible with iPhone, iPad, and iPod touch.',
  privacyUrl: 'https://mockflow.com/privacy',
  screenshots: [
    { id: 's1', url: '/screenshots/1.png', alt: 'Main editor' },
    { id: 's2', url: '/screenshots/2.png', alt: 'Template gallery' },
    { id: 's3', url: '/screenshots/3.png', alt: 'Export options' },
    { id: 's4', url: '/screenshots/4.png', alt: 'Dark mode' },
    { id: 's5', url: '/screenshots/5.png', alt: 'Collaboration' },
  ],
  reviews: [
    {
      id: 'r1',
      author: 'DesignerPro123',
      rating: 5,
      title: 'Best mockup tool ever!',
      content: 'I\'ve tried many mockup tools and this is by far the best. The interface is intuitive and the output is stunning. Highly recommend!',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      helpful: 42,
      developerResponse: {
        content: 'Thank you so much for the kind words! We\'re thrilled you\'re enjoying MockFlow. Stay tuned for more exciting features!',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    },
    {
      id: 'r2',
      author: 'AppDeveloper_Mike',
      rating: 4,
      title: 'Great app, needs more templates',
      content: 'Love the app! Would be perfect with more social media templates. Looking forward to updates.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      helpful: 28,
    },
    {
      id: 'r3',
      author: 'MarketingGuru',
      rating: 5,
      title: 'A must-have for marketers',
      content: 'This app has saved me hours of work. Creating mockups for presentations is now a breeze. Worth every penny!',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      helpful: 156,
    },
  ],
});

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const getCategoryLabel = (category: AppCategory): string => {
  const labels: Record<AppCategory, string> = {
    productivity: 'Productivity',
    social: 'Social Networking',
    entertainment: 'Entertainment',
    utilities: 'Utilities',
    health: 'Health & Fitness',
    finance: 'Finance',
    education: 'Education',
    games: 'Games',
  };
  return labels[category];
};

// iOS App Store Component
const IOSAppStore = ({ appInfo }: { appInfo: AppInfo }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  return (
    <div className="mx-auto max-w-[375px] overflow-hidden rounded-2xl bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-28 w-28 items-center justify-center rounded-[22px] bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <span className="text-4xl font-bold text-white">M</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{appInfo.name}</h1>
            <p className="text-sm text-gray-500">{appInfo.subtitle}</p>
            <p className="mt-1 text-sm text-blue-500">{appInfo.developer}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="flex-1 rounded-full bg-blue-500 py-2 text-sm font-semibold text-white">
            GET
          </button>
          <button className="ml-2 p-2">
            <Share2 className="h-5 w-5 text-blue-500" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-around border-b border-gray-100 py-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-lg font-semibold text-gray-500">{appInfo.rating}</span>
            <Star className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400">
            {formatNumber(appInfo.ratingCount)}
            {' '}
            Ratings
          </p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-500">{appInfo.age}</p>
          <p className="text-xs text-gray-400">Age</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-500">
            #
            {appInfo.rank}
          </p>
          <p className="text-xs text-gray-400">{getCategoryLabel(appInfo.category)}</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="text-center">
          <Smartphone className="mx-auto h-5 w-5 text-gray-400" />
          <p className="text-xs text-gray-400">iPhone</p>
        </div>
      </div>

      {/* Screenshots */}
      <div className="border-b border-gray-100 p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Preview</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {appInfo.screenshots.map((screenshot, i) => (
            <div
              key={screenshot.id}
              className="h-64 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                Screenshot
                {' '}
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's New */}
      <div className="border-b border-gray-100 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">What's New</h2>
          <span className="text-sm text-gray-500">
            Version
            {appInfo.version}
          </span>
        </div>
        <p className={`text-sm whitespace-pre-line text-gray-600 ${!showWhatsNew ? 'line-clamp-3' : ''}`}>
          {appInfo.whatsNew}
        </p>
        {appInfo.whatsNew.length > 150 && (
          <button
            onClick={() => setShowWhatsNew(!showWhatsNew)}
            className="mt-1 text-sm text-blue-500"
          >
            {showWhatsNew ? 'less' : 'more'}
          </button>
        )}
      </div>

      {/* Description */}
      <div className="border-b border-gray-100 p-4">
        <p className={`text-sm whitespace-pre-line text-gray-600 ${!showFullDescription ? 'line-clamp-4' : ''}`}>
          {appInfo.description}
        </p>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-1 text-sm text-blue-500"
        >
          {showFullDescription ? 'less' : 'more'}
        </button>
      </div>

      {/* Developer Info */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-500">{appInfo.developer}</p>
            <p className="text-xs text-gray-500">Developer</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="border-b border-gray-100 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ratings & Reviews</h2>
          <button className="text-sm text-blue-500">See All</button>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900">{appInfo.rating}</p>
            <p className="text-xs text-gray-500">out of 5</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < stars ? 'fill-gray-400 text-gray-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <div className="h-1 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-1 rounded-full bg-gray-400"
                    style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Review */}
        {appInfo.reviews[0] && (
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">{appInfo.reviews[0].title}</p>
              <p className="text-xs text-gray-500">{appInfo.reviews[0].date.toLocaleDateString()}</p>
            </div>
            <div className="mb-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < appInfo.reviews[0]!.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <p className="line-clamp-3 text-sm text-gray-600">{appInfo.reviews[0].content}</p>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Information</h2>
        <div className="space-y-3">
          {[
            { label: 'Provider', value: appInfo.developer },
            { label: 'Size', value: appInfo.size },
            { label: 'Category', value: getCategoryLabel(appInfo.category) },
            { label: 'Compatibility', value: 'iPhone, iPad' },
            { label: 'Languages', value: `${appInfo.languages.length} Languages` },
            { label: 'Age Rating', value: appInfo.age },
            { label: 'Price', value: appInfo.price === 0 ? 'Free' : `$${appInfo.price}` },
            { label: 'In-App Purchases', value: appInfo.inAppPurchases ? 'Yes' : 'No' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Google Play Store Component
const GooglePlayStore = ({ appInfo }: { appInfo: AppInfo }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="mx-auto max-w-[375px] overflow-hidden rounded-2xl bg-[#1f1f1f] text-white shadow-xl">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-medium text-white">{appInfo.name}</h1>
            <p className="text-sm text-green-400">{appInfo.developer}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-400">Contains ads</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">In-app purchases</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{appInfo.rating}</span>
            <Star className="h-3 w-3 fill-white text-white" />
          </div>
          <span className="text-sm text-gray-400">
            {formatNumber(appInfo.ratingCount)}
            {' '}
            reviews
          </span>
          <span className="text-sm text-gray-400">{appInfo.size}</span>
          <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">{appInfo.age}</span>
        </div>

        {/* Install Button */}
        <button className="mt-4 w-full rounded-lg bg-green-600 py-3 font-medium text-white">
          Install
        </button>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-center gap-8">
          <button className="flex flex-col items-center gap-1">
            <Share2 className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Share</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Heart className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Add to wishlist</span>
          </button>
        </div>
      </div>

      {/* Screenshots */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {appInfo.screenshots.map((screenshot, i) => (
            <div
              key={screenshot.id}
              className="h-56 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-700"
            >
              <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                Screenshot
                {' '}
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-medium">About this app</h2>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
        <p className={`text-sm whitespace-pre-line text-gray-400 ${!showFullDescription ? 'line-clamp-4' : ''}`}>
          {appInfo.description}
        </p>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-1 text-sm text-green-400"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      </div>

      {/* What's New */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-medium">What's new</h2>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
        <p className="line-clamp-3 text-sm text-gray-400">{appInfo.whatsNew}</p>
      </div>

      {/* Ratings */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-medium">Ratings and reviews</h2>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-5xl font-light">{appInfo.rating}</p>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(appInfo.rating) ? 'fill-green-400 text-green-400' : 'text-gray-600'}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">{formatNumber(appInfo.ratingCount)}</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-2 text-xs text-gray-500">{stars}</span>
                <div className="h-2 flex-1 rounded-full bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-green-400"
                    style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Review */}
        {appInfo.reviews[0] && (
          <div className="mt-4 rounded-lg bg-gray-800 p-3">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-medium">
                {appInfo.reviews[0].author[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{appInfo.reviews[0].author}</p>
                <p className="text-xs text-gray-500">{appInfo.reviews[0].date.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < appInfo.reviews[0]!.rating ? 'fill-green-400 text-green-400' : 'text-gray-600'}`}
                />
              ))}
            </div>
            <p className="line-clamp-3 text-sm text-gray-400">{appInfo.reviews[0].content}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="text-xs text-gray-500">Was this review helpful?</span>
              <div className="flex items-center gap-2">
                <button className="text-xs text-gray-400">Yes</button>
                <button className="text-xs text-gray-400">No</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Data Safety */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-medium">Data safety</h2>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex items-start gap-3 rounded-lg bg-gray-800 p-3">
          <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
          <div>
            <p className="text-sm text-gray-300">Safety starts with understanding how developers collect and share your data.</p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="border-t border-gray-700 px-4 py-3">
        <div className="space-y-3">
          {[
            { icon: Flag, label: 'Updated', value: 'Jan 10, 2026' },
            { icon: Download, label: 'Downloads', value: '100K+' },
            { icon: Calendar, label: 'Released', value: 'Mar 15, 2024' },
            { icon: Globe, label: 'Developer', value: appInfo.developer },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm text-gray-300">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function AppStoreMockupEditor({
  platform = 'ios',
  appInfo = generateMockAppInfo(),
  variant = 'full',
  onPlatformChange,
  onExport,
}: AppStoreMockupEditorProps) {
  const [currentPlatform, setCurrentPlatform] = useState(platform);

  const handlePlatformChange = (newPlatform: AppStorePlatform) => {
    setCurrentPlatform(newPlatform);
    onPlatformChange?.(newPlatform);
  };

  if (variant === 'preview') {
    return (
      <div className="flex w-full justify-center">
        {currentPlatform === 'ios'
          ? (
              <IOSAppStore appInfo={appInfo} />
            )
          : (
              <GooglePlayStore appInfo={appInfo} />
            )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Smartphone className="h-5 w-5 text-blue-500" />
            App Store Mockup Editor
          </h2>
          <button
            onClick={onExport}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Export
          </button>
        </div>

        {/* Platform Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Platform:</span>
          <div className="flex gap-1">
            <button
              onClick={() => handlePlatformChange('ios')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentPlatform === 'ios'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              iOS App Store
            </button>
            <button
              onClick={() => handlePlatformChange('android')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                currentPlatform === 'android'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              Google Play
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center bg-gray-100 p-6 dark:bg-gray-800">
        {currentPlatform === 'ios'
          ? (
              <IOSAppStore appInfo={appInfo} />
            )
          : (
              <GooglePlayStore appInfo={appInfo} />
            )}
      </div>
    </div>
  );
}
