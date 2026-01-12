'use client';

import {
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Grid,
  Heart,
  Layout,
  List,
  Palette,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

// Types
type TemplateCategory = 'social' | 'email' | 'chat' | 'landing' | 'presentation' | 'marketing' | 'ecommerce';
type IndustryType = 'tech' | 'healthcare' | 'finance' | 'education' | 'retail' | 'travel' | 'food' | 'fitness';
type GoalType = 'engagement' | 'conversion' | 'awareness' | 'retention' | 'support' | 'education';
type ViewMode = 'grid' | 'list';

type Template = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  industries: IndustryType[];
  goals: GoalType[];
  popularity: number;
  rating: number;
  useCount: number;
  tags: string[];
  estimatedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isNew?: boolean;
  isTrending?: boolean;
  isPremium?: boolean;
};

type UserPreferences = {
  industry?: IndustryType;
  goals: GoalType[];
  favoriteCategories: TemplateCategory[];
  recentlyUsed: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
};

type RecommendationConfig = {
  showPersonalized: boolean;
  showTrending: boolean;
  showNew: boolean;
  maxRecommendations: number;
  primaryColor: string;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type SmartTemplateRecommendationsProps = {
  variant?: Variant;
  config?: Partial<RecommendationConfig>;
  userPreferences?: Partial<UserPreferences>;
  onSelectTemplate?: (template: Template) => void;
  onFavorite?: (templateId: string) => void;
  className?: string;
};

// Default configuration
const defaultConfig: RecommendationConfig = {
  showPersonalized: true,
  showTrending: true,
  showNew: true,
  maxRecommendations: 12,
  primaryColor: '#6366F1',
};

const defaultPreferences: UserPreferences = {
  industry: 'tech',
  goals: ['engagement', 'conversion'],
  favoriteCategories: ['social', 'marketing'],
  recentlyUsed: [],
  skillLevel: 'intermediate',
};

// Sample templates
const sampleTemplates: Template[] = [
  {
    id: '1',
    name: 'Product Launch Social Campaign',
    description: 'Complete social media template set for announcing new products',
    category: 'social',
    industries: ['tech', 'retail', 'fitness'],
    goals: ['awareness', 'engagement'],
    popularity: 95,
    rating: 4.9,
    useCount: 12500,
    tags: ['product launch', 'social media', 'campaign'],
    estimatedTime: 15,
    difficulty: 'beginner',
    isTrending: true,
  },
  {
    id: '2',
    name: 'SaaS Onboarding Email Series',
    description: 'Automated email sequence for new user onboarding',
    category: 'email',
    industries: ['tech', 'education'],
    goals: ['retention', 'education'],
    popularity: 88,
    rating: 4.8,
    useCount: 8900,
    tags: ['email', 'onboarding', 'saas'],
    estimatedTime: 30,
    difficulty: 'intermediate',
  },
  {
    id: '3',
    name: 'Customer Support Chat Flow',
    description: 'Conversational templates for common support scenarios',
    category: 'chat',
    industries: ['tech', 'retail', 'finance'],
    goals: ['support', 'retention'],
    popularity: 82,
    rating: 4.7,
    useCount: 6700,
    tags: ['chat', 'support', 'customer service'],
    estimatedTime: 20,
    difficulty: 'beginner',
  },
  {
    id: '4',
    name: 'E-commerce Product Page',
    description: 'High-converting product page layout with reviews and CTAs',
    category: 'ecommerce',
    industries: ['retail', 'fitness', 'food'],
    goals: ['conversion', 'engagement'],
    popularity: 91,
    rating: 4.9,
    useCount: 15200,
    tags: ['ecommerce', 'product', 'conversion'],
    estimatedTime: 25,
    difficulty: 'intermediate',
    isNew: true,
  },
  {
    id: '5',
    name: 'Healthcare Newsletter',
    description: 'Professional newsletter template for medical practices',
    category: 'email',
    industries: ['healthcare'],
    goals: ['education', 'engagement'],
    popularity: 76,
    rating: 4.6,
    useCount: 3400,
    tags: ['healthcare', 'newsletter', 'professional'],
    estimatedTime: 20,
    difficulty: 'beginner',
  },
  {
    id: '6',
    name: 'Financial Services Landing Page',
    description: 'Trust-building landing page for financial products',
    category: 'landing',
    industries: ['finance'],
    goals: ['conversion', 'awareness'],
    popularity: 84,
    rating: 4.8,
    useCount: 5600,
    tags: ['finance', 'landing page', 'trust'],
    estimatedTime: 35,
    difficulty: 'advanced',
    isPremium: true,
  },
  {
    id: '7',
    name: 'Fitness App Promotion',
    description: 'Social media mockups for fitness app marketing',
    category: 'social',
    industries: ['fitness', 'healthcare'],
    goals: ['awareness', 'conversion'],
    popularity: 87,
    rating: 4.7,
    useCount: 7800,
    tags: ['fitness', 'app', 'promotion'],
    estimatedTime: 10,
    difficulty: 'beginner',
    isTrending: true,
  },
  {
    id: '8',
    name: 'Travel Booking Confirmation',
    description: 'Email templates for booking confirmations and itineraries',
    category: 'email',
    industries: ['travel'],
    goals: ['support', 'engagement'],
    popularity: 79,
    rating: 4.5,
    useCount: 4200,
    tags: ['travel', 'booking', 'confirmation'],
    estimatedTime: 15,
    difficulty: 'beginner',
  },
];

// Category icons
const categoryIcons: Record<TemplateCategory, React.ReactNode> = {
  social: <Users className="h-4 w-4" />,
  email: <Target className="h-4 w-4" />,
  chat: <Zap className="h-4 w-4" />,
  landing: <Layout className="h-4 w-4" />,
  presentation: <Eye className="h-4 w-4" />,
  marketing: <TrendingUp className="h-4 w-4" />,
  ecommerce: <Palette className="h-4 w-4" />,
};

// Goal colors
const goalColors: Record<GoalType, string> = {
  engagement: '#3B82F6',
  conversion: '#10B981',
  awareness: '#8B5CF6',
  retention: '#F59E0B',
  support: '#EC4899',
  education: '#06B6D4',
};

export function SmartTemplateRecommendations({
  variant = 'full',
  config: initialConfig,
  userPreferences: initialPreferences,
  onSelectTemplate,
  onFavorite,
  className = '',
}: SmartTemplateRecommendationsProps) {
  const [config] = useState<RecommendationConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [preferences] = useState<UserPreferences>({
    ...defaultPreferences,
    ...initialPreferences,
  });
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedGoal, setSelectedGoal] = useState<GoalType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate recommendation scores
  const scoredTemplates = useMemo(() => {
    return sampleTemplates.map((template) => {
      let score = template.popularity;

      // Boost for industry match
      if (preferences.industry && template.industries.includes(preferences.industry)) {
        score += 20;
      }

      // Boost for goal match
      const goalMatches = template.goals.filter(g => preferences.goals.includes(g)).length;
      score += goalMatches * 15;

      // Boost for category preference
      if (preferences.favoriteCategories.includes(template.category)) {
        score += 10;
      }

      // Boost for trending
      if (template.isTrending) {
        score += 5;
      }

      // Boost for new
      if (template.isNew) {
        score += 5;
      }

      return { ...template, recommendationScore: score };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }, [preferences]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return scoredTemplates.filter((template) => {
      if (selectedCategory !== 'all' && template.category !== selectedCategory) {
        return false;
      }
      if (selectedGoal !== 'all' && !template.goals.includes(selectedGoal)) {
        return false;
      }
      return true;
    }).slice(0, config.maxRecommendations);
  }, [scoredTemplates, selectedCategory, selectedGoal, config.maxRecommendations]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId],
    );
    onFavorite?.(templateId);
  }, [onFavorite]);

  // Render Template Card
  const renderTemplateCard = (template: Template & { recommendationScore: number }) => (
    <div
      key={template.id}
      onClick={() => onSelectTemplate?.(template)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-500">
        {template.isNew && (
          <span className="absolute top-2 left-2 rounded bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
            NEW
          </span>
        )}
        {template.isTrending && (
          <span className="absolute top-2 left-2 flex items-center space-x-1 rounded bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
            <TrendingUp className="h-3 w-3" />
            <span>TRENDING</span>
          </span>
        )}
        {template.isPremium && (
          <span className="absolute top-2 right-2 flex items-center space-x-1 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
            <Star className="h-3 w-3" />
            <span>PRO</span>
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTemplate?.(template);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Use Template</span>
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(template.id);
          }}
          className="absolute right-2 bottom-2 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${favorites.includes(template.id) ? 'fill-current text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center space-x-2">
          <span
            className="rounded p-1"
            style={{ backgroundColor: `${config.primaryColor}20`, color: config.primaryColor }}
          >
            {categoryIcons[template.category]}
          </span>
          <span className="text-xs text-gray-500 capitalize dark:text-gray-400">
            {template.category}
          </span>
        </div>
        <h3 className="mb-1 line-clamp-1 font-semibold text-gray-900 dark:text-white">
          {template.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {template.description}
        </p>

        {/* Goals */}
        <div className="mb-3 flex flex-wrap gap-1">
          {template.goals.map(goal => (
            <span
              key={goal}
              className="rounded-full px-2 py-0.5 text-xs capitalize"
              style={{
                backgroundColor: `${goalColors[goal]}20`,
                color: goalColors[goal],
              }}
            >
              {goal}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{template.rating}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>
                {(template.useCount / 1000).toFixed(1)}
                k
              </span>
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>
              {template.estimatedTime}
              min
            </span>
          </span>
        </div>
      </div>
    </div>
  );

  // Render Template List Item
  const renderTemplateListItem = (template: Template & { recommendationScore: number }) => (
    <div
      key={template.id}
      onClick={() => onSelectTemplate?.(template)}
      className="group flex cursor-pointer items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative h-16 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
        {template.isTrending && (
          <TrendingUp className="absolute top-1 left-1 h-4 w-4 text-white" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center space-x-2">
          <h3 className="truncate font-medium text-gray-900 dark:text-white">
            {template.name}
          </h3>
          {template.isNew && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-600 dark:bg-green-900/30">NEW</span>
          )}
        </div>
        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
          {template.description}
        </p>
        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-400">
          <span className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500" />
            <span>{template.rating}</span>
          </span>
          <span>{template.category}</span>
          <span>
            {template.estimatedTime}
            min
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(template.id);
          }}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Heart className={`h-5 w-5 ${favorites.includes(template.id) ? 'fill-current text-red-500' : 'text-gray-400'}`} />
        </button>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <Sparkles className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">Recommended for You</span>
          </div>
          <div className="space-y-3">
            {filteredTemplates.slice(0, 3).map(template => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate?.(template)}
                className="flex cursor-pointer items-center space-x-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </p>
                  <p className="text-xs text-gray-500">{template.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <Sparkles className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className="font-medium text-gray-900 dark:text-white">Smart Recommendations</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <div className="text-center text-white">
            <Target className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">AI-Powered</p>
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
            <Sparkles className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">Recommended Templates</span>
          </div>
          <button
            onClick={handleRefresh}
            className={`rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.slice(0, 4).map(template => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate?.(template)}
                className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="mb-2 aspect-video rounded bg-gradient-to-br from-indigo-500 to-purple-500" />
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {template.name}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-500">{template.rating}</span>
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
                <Sparkles className="h-5 w-5" style={{ color: config.primaryColor }} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Smart Recommendations
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <Grid className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  <List className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <button
                onClick={handleRefresh}
                className={`rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  selectedCategory === 'all'
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                style={selectedCategory === 'all' ? { backgroundColor: config.primaryColor } : undefined}
              >
                All
              </button>
              {Object.keys(categoryIcons).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as TemplateCategory)}
                  className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
                    selectedCategory === cat
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: config.primaryColor } : undefined}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Goal Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(goalColors).map(goal => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(selectedGoal === goal ? 'all' : goal as GoalType)}
                  className={`rounded-full px-3 py-1.5 text-xs capitalize ${
                    selectedGoal === goal
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedGoal === goal
                      ? goalColors[goal as GoalType]
                      : `${goalColors[goal as GoalType]}20`,
                    color: selectedGoal === goal ? 'white' : goalColors[goal as GoalType],
                  }}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized Section */}
        {config.showPersonalized && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Target className="h-5 w-5" style={{ color: config.primaryColor }} />
                <span>Recommended for You</span>
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Based on your preferences
              </span>
            </div>
            {viewMode === 'grid'
              ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTemplates.map(template => renderTemplateCard(template))}
                  </div>
                )
              : (
                  <div className="space-y-3">
                    {filteredTemplates.map(template => renderTemplateListItem(template))}
                  </div>
                )}
          </div>
        )}

        {/* Trending Section */}
        {config.showTrending && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span>Trending Now</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scoredTemplates
                .filter(t => t.isTrending)
                .slice(0, 4)
                .map(template => renderTemplateCard(template))}
            </div>
          </div>
        )}

        {/* New Templates Section */}
        {config.showNew && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Zap className="h-5 w-5 text-green-500" />
                <span>New Templates</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scoredTemplates
                .filter(t => t.isNew)
                .slice(0, 4)
                .map(template => renderTemplateCard(template))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartTemplateRecommendations;
