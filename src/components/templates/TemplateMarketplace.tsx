'use client';

import {
  CheckCircle2,
  Crown,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Grid,
  Heart,
  List,
  Search,
  Sparkles,
  Star,
  Store,
  User,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type TemplateCategory
  = | 'chat'
    | 'ai'
    | 'social'
    | 'email'
    | 'business'
    | 'creative'
    | 'educational'
    | 'other';

export type TemplatePricing = 'free' | 'premium' | 'pro';

export type SortOption = 'popular' | 'newest' | 'rating' | 'downloads' | 'trending';

export type TemplateAuthor = {
  id: string;
  name: string;
  avatar?: string;
  verified: boolean;
  profileUrl?: string;
};

export type MarketplaceTemplate = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: TemplateCategory;
  tags: string[];
  author: TemplateAuthor;
  pricing: TemplatePricing;
  price?: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  viewCount: number;
  favorites: number;
  createdAt: Date;
  updatedAt: Date;
  platforms: string[];
  featured?: boolean;
  new?: boolean;
};

export type TemplateMarketplaceProps = {
  templates?: MarketplaceTemplate[];
  onTemplateSelect?: (template: MarketplaceTemplate) => void;
  onTemplatePreview?: (template: MarketplaceTemplate) => void;
  onTemplateDownload?: (template: MarketplaceTemplate) => void;
  onTemplateFavorite?: (template: MarketplaceTemplate) => void;
  userFavorites?: string[];
  userDownloaded?: string[];
  className?: string;
};

// ============================================================================
// Sample Data
// ============================================================================

const sampleTemplates: MarketplaceTemplate[] = [
  {
    id: '1',
    name: 'iMessage Conversation Pro',
    description: 'Professional iMessage mockup with all status indicators and reactions',
    thumbnail: '/templates/imessage-pro.png',
    category: 'chat',
    tags: ['imessage', 'ios', 'apple', 'reactions'],
    author: { id: 'a1', name: 'MockMaster', verified: true },
    pricing: 'free',
    rating: 4.8,
    reviewCount: 124,
    downloadCount: 5420,
    viewCount: 12500,
    favorites: 892,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-20'),
    platforms: ['imessage'],
    featured: true,
  },
  {
    id: '2',
    name: 'ChatGPT Interface Kit',
    description: 'Complete ChatGPT mockup with code blocks, artifacts, and streaming',
    thumbnail: '/templates/chatgpt-kit.png',
    category: 'ai',
    tags: ['chatgpt', 'openai', 'ai', 'code'],
    author: { id: 'a2', name: 'AIDesigner', verified: true },
    pricing: 'premium',
    price: 9.99,
    rating: 4.9,
    reviewCount: 89,
    downloadCount: 2100,
    viewCount: 8900,
    favorites: 456,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-04-01'),
    platforms: ['chatgpt', 'claude'],
    featured: true,
    new: true,
  },
  {
    id: '3',
    name: 'WhatsApp Business Pack',
    description: 'WhatsApp templates for business messaging scenarios',
    thumbnail: '/templates/whatsapp-business.png',
    category: 'business',
    tags: ['whatsapp', 'business', 'professional'],
    author: { id: 'a3', name: 'TemplateHub', verified: false },
    pricing: 'free',
    rating: 4.5,
    reviewCount: 67,
    downloadCount: 3200,
    viewCount: 7800,
    favorites: 234,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-15'),
    platforms: ['whatsapp'],
  },
  {
    id: '4',
    name: 'Discord Community Starter',
    description: 'Discord server mockup with channels, roles, and reactions',
    thumbnail: '/templates/discord-community.png',
    category: 'chat',
    tags: ['discord', 'gaming', 'community'],
    author: { id: 'a4', name: 'GamerDesigns', verified: true },
    pricing: 'free',
    rating: 4.7,
    reviewCount: 156,
    downloadCount: 8900,
    viewCount: 21000,
    favorites: 1200,
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2024-02-28'),
    platforms: ['discord'],
  },
  {
    id: '5',
    name: 'Slack Enterprise Suite',
    description: 'Professional Slack mockups for enterprise presentations',
    thumbnail: '/templates/slack-enterprise.png',
    category: 'business',
    tags: ['slack', 'enterprise', 'b2b', 'professional'],
    author: { id: 'a5', name: 'ProTemplates', verified: true },
    pricing: 'pro',
    price: 24.99,
    rating: 4.9,
    reviewCount: 42,
    downloadCount: 890,
    viewCount: 4500,
    favorites: 167,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-10'),
    platforms: ['slack'],
    new: true,
  },
  {
    id: '6',
    name: 'Twitter/X Thread Builder',
    description: 'Create realistic Twitter thread mockups with metrics',
    thumbnail: '/templates/twitter-thread.png',
    category: 'social',
    tags: ['twitter', 'x', 'thread', 'social'],
    author: { id: 'a6', name: 'SocialMock', verified: true },
    pricing: 'premium',
    price: 4.99,
    rating: 4.6,
    reviewCount: 98,
    downloadCount: 4100,
    viewCount: 11200,
    favorites: 567,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-03-25'),
    platforms: ['twitter'],
  },
  {
    id: '7',
    name: 'Claude AI Workspace',
    description: 'Anthropic Claude interface with artifacts and tools',
    thumbnail: '/templates/claude-workspace.png',
    category: 'ai',
    tags: ['claude', 'anthropic', 'ai', 'artifacts'],
    author: { id: 'a2', name: 'AIDesigner', verified: true },
    pricing: 'premium',
    price: 12.99,
    rating: 4.8,
    reviewCount: 34,
    downloadCount: 780,
    viewCount: 3400,
    favorites: 189,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-04-05'),
    platforms: ['claude'],
    new: true,
  },
  {
    id: '8',
    name: 'Instagram DM Collection',
    description: 'Instagram direct message templates with story mentions',
    thumbnail: '/templates/instagram-dm.png',
    category: 'social',
    tags: ['instagram', 'dm', 'stories', 'social'],
    author: { id: 'a7', name: 'InstaDesigns', verified: false },
    pricing: 'free',
    rating: 4.4,
    reviewCount: 78,
    downloadCount: 5600,
    viewCount: 14000,
    favorites: 890,
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-02-10'),
    platforms: ['instagram'],
  },
];

// ============================================================================
// Sub-Components
// ============================================================================

type FilterBarProps = {
  search: string;
  onSearchChange: (search: string) => void;
  category: TemplateCategory | 'all';
  onCategoryChange: (category: TemplateCategory | 'all') => void;
  pricing: TemplatePricing | 'all';
  onPricingChange: (pricing: TemplatePricing | 'all') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
};

function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  pricing,
  onPricingChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const categories: Array<{ value: TemplateCategory | 'all'; label: string }> = [
    { value: 'all', label: 'All Categories' },
    { value: 'chat', label: 'Chat Apps' },
    { value: 'ai', label: 'AI Interfaces' },
    { value: 'social', label: 'Social Media' },
    { value: 'business', label: 'Business' },
    { value: 'creative', label: 'Creative' },
    { value: 'educational', label: 'Educational' },
    { value: 'other', label: 'Other' },
  ];

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'downloads', label: 'Most Downloads' },
    { value: 'trending', label: 'Trending' },
  ];

  return (
    <div className="space-y-3">
      {/* Search & View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border bg-white py-2 pr-4 pl-10 dark:bg-gray-800"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors
            ${showFilters ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>

        <div className="flex items-center overflow-hidden rounded-lg border">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <select
            value={category}
            onChange={e => onCategoryChange(e.target.value as TemplateCategory | 'all')}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm dark:bg-gray-700"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={pricing}
            onChange={e => onPricingChange(e.target.value as TemplatePricing | 'all')}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm dark:bg-gray-700"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="pro">Pro</option>
          </select>

          <select
            value={sort}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm dark:bg-gray-700"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

type TemplateCardProps = {
  template: MarketplaceTemplate;
  onSelect: () => void;
  onPreview: () => void;
  onDownload: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  isDownloaded: boolean;
  viewMode: 'grid' | 'list';
};

function TemplateCard({
  template,
  onSelect,
  onPreview,
  onDownload,
  onFavorite,
  isFavorited,
  isDownloaded,
  viewMode,
}: TemplateCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPricingBadge = () => {
    switch (template.pricing) {
      case 'free':
        return (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            Free
          </span>
        );
      case 'premium':
        return (
          <span className="flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            <Crown className="h-3 w-3" />
            $
            {template.price}
          </span>
        );
      case 'pro':
        return (
          <span className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Zap className="h-3 w-3" />
            Pro $
            {template.price}
          </span>
        );
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onSelect}
        className="flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:bg-gray-800"
      >
        {/* Thumbnail */}
        <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <Store className="h-6 w-6" />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate font-medium">{template.name}</h3>
            {template.featured && (
              <Sparkles className="h-4 w-4 flex-shrink-0 text-yellow-500" />
            )}
            {template.new && (
              <span className="rounded bg-blue-500 px-1.5 py-0.5 text-xs text-white">New</span>
            )}
          </div>
          <p className="truncate text-sm text-gray-500">{template.description}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {template.rating}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(template.downloadCount)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {template.author.name}
              {template.author.verified && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {getPricingBadge()}
          <button
            onClick={(e) => {
              e.stopPropagation(); onFavorite();
            }}
            className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isFavorited ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onPreview();
            }}
            className="rounded p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onDownload();
            }}
            className={`
              rounded px-3 py-1.5 text-sm font-medium transition-colors
              ${isDownloaded
        ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
        : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
          >
            {isDownloaded ? 'Downloaded' : 'Get'}
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer overflow-hidden rounded-lg border bg-white transition-all hover:border-blue-300 hover:shadow-md dark:bg-gray-800"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
        <div className="flex h-full w-full items-center justify-center text-gray-400">
          <Store className="h-12 w-12" />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {template.featured && (
            <span className="flex items-center gap-1 rounded bg-yellow-500 px-2 py-0.5 text-xs text-white">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          {template.new && (
            <span className="rounded bg-blue-500 px-2 py-0.5 text-xs text-white">New</span>
          )}
        </div>

        {/* Pricing */}
        <div className="absolute top-2 right-2">
          {getPricingBadge()}
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation(); onPreview();
            }}
            className="rounded-full bg-white p-3 hover:bg-gray-100"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onDownload();
            }}
            className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="mb-1 truncate font-medium">{template.name}</h3>
        <p className="mb-2 line-clamp-2 text-sm text-gray-500">{template.description}</p>

        {/* Author */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
            <User className="h-3 w-3" />
          </div>
          <span className="text-xs text-gray-500">{template.author.name}</span>
          {template.author.verified && (
            <CheckCircle2 className="h-3 w-3 text-blue-500" />
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {template.rating}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {formatNumber(template.downloadCount)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); onFavorite();
            }}
            className={`rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isFavorited ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

type FeaturedBannerProps = {
  templates: MarketplaceTemplate[];
  onSelect: (template: MarketplaceTemplate) => void;
};

function FeaturedBanner({ templates, onSelect }: FeaturedBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredTemplate = templates[activeIndex];

  if (!featuredTemplate) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium opacity-90">Featured Template</span>
        </div>

        <h2 className="mb-2 text-2xl font-bold">{featuredTemplate.name}</h2>
        <p className="mb-4 max-w-lg text-white/80">{featuredTemplate.description}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelect(featuredTemplate)}
            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-gray-100"
          >
            View Template
          </button>

          <div className="flex items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {featuredTemplate.rating}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {featuredTemplate.downloadCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      {templates.length > 1 && (
        <div className="absolute right-4 bottom-4 flex items-center gap-2">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function TemplateMarketplace({
  templates = sampleTemplates,
  onTemplateSelect,
  onTemplatePreview,
  onTemplateDownload,
  onTemplateFavorite,
  userFavorites = [],
  userDownloaded = [],
  className = '',
}: TemplateMarketplaceProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all');
  const [pricing, setPricing] = useState<TemplatePricing | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const featuredTemplates = useMemo(() => {
    return templates.filter(t => t.featured);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchLower)
        || t.description.toLowerCase().includes(searchLower)
        || t.tags.some(tag => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Filter by category
    if (category !== 'all') {
      result = result.filter(t => t.category === category);
    }

    // Filter by pricing
    if (pricing !== 'all') {
      result = result.filter(t => t.pricing === pricing);
    }

    // Sort
    switch (sort) {
      case 'popular':
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'trending':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    return result;
  }, [templates, search, category, pricing, sort]);

  const handleSelect = useCallback((template: MarketplaceTemplate) => {
    onTemplateSelect?.(template);
  }, [onTemplateSelect]);

  const handlePreview = useCallback((template: MarketplaceTemplate) => {
    onTemplatePreview?.(template);
  }, [onTemplatePreview]);

  const handleDownload = useCallback((template: MarketplaceTemplate) => {
    onTemplateDownload?.(template);
  }, [onTemplateDownload]);

  const handleFavorite = useCallback((template: MarketplaceTemplate) => {
    onTemplateFavorite?.(template);
  }, [onTemplateFavorite]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-bold">Template Marketplace</h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            {filteredTemplates.length}
            {' '}
            templates
          </span>
        </div>
      </div>

      {/* Featured Banner */}
      {featuredTemplates.length > 0 && !search && category === 'all' && (
        <FeaturedBanner
          templates={featuredTemplates}
          onSelect={handleSelect}
        />
      )}

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        pricing={pricing}
        onPricingChange={setPricing}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Template Grid/List */}
      {filteredTemplates.length === 0
        ? (
            <div className="py-12 text-center text-gray-500">
              <Store className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p className="font-medium">No templates found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )
        : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-3'
            }
            >
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleSelect(template)}
                  onPreview={() => handlePreview(template)}
                  onDownload={() => handleDownload(template)}
                  onFavorite={() => handleFavorite(template)}
                  isFavorited={userFavorites.includes(template.id)}
                  isDownloaded={userDownloaded.includes(template.id)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
    </div>
  );
}

// ============================================================================
// Template Detail Modal
// ============================================================================

export type TemplateDetailProps = {
  template: MarketplaceTemplate;
  onClose: () => void;
  onDownload: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  isDownloaded: boolean;
};

export function TemplateDetail({
  template,
  onClose,
  onDownload,
  onFavorite,
  isFavorited,
  isDownloaded,
}: TemplateDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4 dark:bg-gray-800">
          <h2 className="text-lg font-bold">{template.name}</h2>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="mb-6 flex h-64 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
            <Store className="h-16 w-16 text-gray-400" />
          </div>

          {/* Info Grid */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-2 font-medium">About</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{template.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-700">
                <span className="text-sm text-gray-500">Rating</span>
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                  {' '}
                  (
                  {template.reviewCount}
                  {' '}
                  reviews)
                </span>
              </div>

              <div className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-700">
                <span className="text-sm text-gray-500">Downloads</span>
                <span className="font-medium">{template.downloadCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between rounded bg-gray-50 p-3 dark:bg-gray-700">
                <span className="text-sm text-gray-500">Updated</span>
                <span className="font-medium">{template.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="mb-6 flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{template.author.name}</span>
                  {template.author.verified && (
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <span className="text-sm text-gray-500">Template Creator</span>
              </div>
            </div>

            {template.author.profileUrl && (
              <a
                href={template.author.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
              >
                View Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onDownload}
              className={`
                flex flex-1 items-center justify-center gap-2 rounded-lg py-3 font-medium transition-colors
                ${isDownloaded
      ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
      : 'bg-blue-500 text-white hover:bg-blue-600'}
              `}
            >
              {isDownloaded
                ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Downloaded
                    </>
                  )
                : (
                    <>
                      <Download className="h-5 w-5" />
                      {template.pricing === 'free' ? 'Download Free' : `Get for $${template.price}`}
                    </>
                  )}
            </button>

            <button
              onClick={onFavorite}
              className={`
                rounded-lg border p-3 transition-colors
                ${isFavorited
      ? 'border-red-300 bg-red-50 text-red-500 dark:bg-red-900/20'
      : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default TemplateMarketplace;
