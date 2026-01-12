'use client';

import {
  AlignCenter,
  AlignLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Columns,
  Eye,
  Grid3X3,
  Layers,
  Layout,
  Lightbulb,
  Maximize2,
  Move,
  RefreshCw,
  Rows,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  X,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type LayoutPattern = 'grid' | 'masonry' | 'flex' | 'sidebar' | 'split' | 'hero' | 'card' | 'list';
export type SuggestionType = 'layout' | 'spacing' | 'alignment' | 'hierarchy' | 'responsive' | 'accessibility';
export type SuggestionPriority = 'high' | 'medium' | 'low';
export type SuggestionStatus = 'pending' | 'applied' | 'dismissed';

export type LayoutSuggestion = {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  priority: SuggestionPriority;
  status: SuggestionStatus;
  impact: string;
  beforePreview?: string;
  afterPreview?: string;
  autoApplicable: boolean;
  affectedElements: string[];
  confidence: number;
};

export type LayoutAnalysis = {
  overallScore: number;
  layoutPattern: LayoutPattern;
  issues: { type: string; count: number }[];
  strengths: string[];
  recommendations: LayoutSuggestion[];
};

export type LayoutTemplate = {
  id: string;
  name: string;
  pattern: LayoutPattern;
  description: string;
  preview: string;
  popularity: number;
  applicableTo: string[];
};

export type SmartLayoutSuggestionsProps = {
  analysis?: LayoutAnalysis;
  suggestions?: LayoutSuggestion[];
  templates?: LayoutTemplate[];
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onApplySuggestion?: (suggestionId: string) => void;
  onDismissSuggestion?: (suggestionId: string) => void;
  onApplyTemplate?: (templateId: string) => void;
  onRefreshAnalysis?: () => void;
  onFeedback?: (suggestionId: string, helpful: boolean) => void;
};

// Mock data generators
const generateMockAnalysis = (): LayoutAnalysis => ({
  overallScore: 78,
  layoutPattern: 'grid',
  issues: [
    { type: 'spacing', count: 3 },
    { type: 'alignment', count: 2 },
    { type: 'hierarchy', count: 1 },
  ],
  strengths: [
    'Consistent grid structure',
    'Good visual hierarchy in header',
    'Responsive breakpoints defined',
  ],
  recommendations: generateMockSuggestions(),
});

const generateMockSuggestions = (): LayoutSuggestion[] => [
  {
    id: 's1',
    type: 'spacing',
    title: 'Inconsistent spacing detected',
    description: 'The spacing between cards varies from 16px to 24px. Standardizing to 20px would improve visual consistency.',
    priority: 'high',
    status: 'pending',
    impact: 'Visual consistency +15%',
    autoApplicable: true,
    affectedElements: ['.card-grid', '.feature-section', '.testimonial-row'],
    confidence: 92,
  },
  {
    id: 's2',
    type: 'alignment',
    title: 'Text alignment improvement',
    description: 'Center-aligning the hero section headline would create better visual balance with the call-to-action button.',
    priority: 'medium',
    status: 'pending',
    impact: 'Engagement +8%',
    autoApplicable: true,
    affectedElements: ['.hero-headline', '.hero-subtext'],
    confidence: 85,
  },
  {
    id: 's3',
    type: 'hierarchy',
    title: 'Improve visual hierarchy',
    description: 'Increasing the font size difference between h2 and h3 headings would strengthen the content hierarchy.',
    priority: 'medium',
    status: 'pending',
    impact: 'Readability +12%',
    autoApplicable: true,
    affectedElements: ['h2', 'h3'],
    confidence: 88,
  },
  {
    id: 's4',
    type: 'responsive',
    title: 'Mobile breakpoint optimization',
    description: 'The 3-column grid should switch to single column at 768px instead of 640px for better mobile readability.',
    priority: 'high',
    status: 'pending',
    impact: 'Mobile UX +20%',
    autoApplicable: true,
    affectedElements: ['.grid-cols-3'],
    confidence: 95,
  },
  {
    id: 's5',
    type: 'accessibility',
    title: 'Contrast ratio improvement',
    description: 'The muted text color (#9CA3AF) on white background has a 3.5:1 ratio. Darkening to #6B7280 would meet WCAG AA standards.',
    priority: 'high',
    status: 'pending',
    impact: 'Accessibility +25%',
    autoApplicable: true,
    affectedElements: ['.text-muted', '.caption'],
    confidence: 98,
  },
  {
    id: 's6',
    type: 'layout',
    title: 'Consider sidebar layout',
    description: 'Based on the content structure, a sidebar layout might improve navigation and content discovery.',
    priority: 'low',
    status: 'pending',
    impact: 'Navigation +10%',
    autoApplicable: false,
    affectedElements: ['main', 'nav'],
    confidence: 72,
  },
];

const generateMockTemplates = (): LayoutTemplate[] => [
  {
    id: 't1',
    name: 'Dashboard Grid',
    pattern: 'grid',
    description: 'Flexible grid layout with responsive cards',
    preview: '/templates/dashboard-grid.png',
    popularity: 89,
    applicableTo: ['dashboard', 'analytics', 'admin'],
  },
  {
    id: 't2',
    name: 'Sidebar Navigation',
    pattern: 'sidebar',
    description: 'Fixed sidebar with scrollable content area',
    preview: '/templates/sidebar-nav.png',
    popularity: 95,
    applicableTo: ['dashboard', 'app', 'settings'],
  },
  {
    id: 't3',
    name: 'Hero Split',
    pattern: 'split',
    description: '50/50 split layout for landing pages',
    preview: '/templates/hero-split.png',
    popularity: 82,
    applicableTo: ['landing', 'marketing', 'product'],
  },
  {
    id: 't4',
    name: 'Card Masonry',
    pattern: 'masonry',
    description: 'Pinterest-style masonry grid layout',
    preview: '/templates/masonry.png',
    popularity: 76,
    applicableTo: ['gallery', 'portfolio', 'blog'],
  },
  {
    id: 't5',
    name: 'List View',
    pattern: 'list',
    description: 'Clean list layout for data-heavy pages',
    preview: '/templates/list-view.png',
    popularity: 71,
    applicableTo: ['table', 'inbox', 'feed'],
  },
];

// Helper functions
const getTypeIcon = (type: SuggestionType) => {
  const icons: Record<SuggestionType, typeof Layout> = {
    layout: Layout,
    spacing: Move,
    alignment: AlignCenter,
    hierarchy: Layers,
    responsive: Maximize2,
    accessibility: Eye,
  };
  return icons[type];
};

const getTypeColor = (type: SuggestionType): string => {
  const colors: Record<SuggestionType, string> = {
    layout: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    spacing: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    alignment: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
    hierarchy: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    responsive: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30',
    accessibility: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30',
  };
  return colors[type];
};

const getPriorityColor = (priority: SuggestionPriority): string => {
  const colors: Record<SuggestionPriority, string> = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };
  return colors[priority];
};

const getPatternIcon = (pattern: LayoutPattern) => {
  const icons: Record<LayoutPattern, typeof Layout> = {
    grid: Grid3X3,
    masonry: Square,
    flex: Columns,
    sidebar: Layout,
    split: Rows,
    hero: Maximize2,
    card: Square,
    list: AlignLeft,
  };
  return icons[pattern];
};

const getScoreColor = (score: number): string => {
  if (score >= 80) {
    return 'text-green-600 dark:text-green-400';
  }
  if (score >= 60) {
    return 'text-amber-600 dark:text-amber-400';
  }
  return 'text-red-600 dark:text-red-400';
};

// Main component
export default function SmartLayoutSuggestions({
  analysis = generateMockAnalysis(),
  suggestions = generateMockSuggestions(),
  templates = generateMockTemplates(),
  variant = 'full',
  onApplySuggestion,
  onDismissSuggestion,
  onApplyTemplate,
  onRefreshAnalysis,
  onFeedback,
}: SmartLayoutSuggestionsProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'templates' | 'analysis'>('suggestions');
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<SuggestionPriority | 'all'>('all');

  const filteredSuggestions = filterPriority === 'all'
    ? suggestions
    : suggestions.filter(s => s.priority === filterPriority);

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high' && s.status === 'pending');

  if (variant === 'widget') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Smart Layout</span>
          </div>
          <span className={`text-lg font-bold ${getScoreColor(analysis.overallScore)}`}>
            {analysis.overallScore}
          </span>
        </div>

        {highPrioritySuggestions.length > 0
          ? (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  {highPrioritySuggestions.length}
                  {' '}
                  high-priority suggestion
                  {highPrioritySuggestions.length > 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {highPrioritySuggestions.slice(0, 2).map((suggestion) => {
                    const TypeIcon = getTypeIcon(suggestion.type);
                    return (
                      <div
                        key={suggestion.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <TypeIcon className={`h-4 w-4 ${getTypeColor(suggestion.type).split(' ')[0]}`} />
                          <span className="max-w-[120px] truncate text-xs text-gray-700 dark:text-gray-300">
                            {suggestion.title}
                          </span>
                        </div>
                        <button
                          onClick={() => onApplySuggestion?.(suggestion.id)}
                          className="text-xs text-purple-600 hover:underline dark:text-purple-400"
                        >
                          Apply
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          : (
              <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                Layout looks great!
              </p>
            )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Layout Suggestions
          </h3>
          <button
            onClick={onRefreshAnalysis}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Score */}
        <div className="mb-4 flex items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90 transform">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                className={getScoreColor(analysis.overallScore)}
                strokeWidth="4"
                strokeDasharray={`${(analysis.overallScore / 100) * 126} 126`}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Layout Score</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {pendingSuggestions.length}
              {' '}
              suggestions available
            </p>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          {pendingSuggestions.slice(0, 3).map((suggestion) => {
            const TypeIcon = getTypeIcon(suggestion.type);
            return (
              <div
                key={suggestion.id}
                className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <div className={`rounded-lg p-1.5 ${getTypeColor(suggestion.type)}`}>
                    <TypeIcon className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{suggestion.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.impact}</p>
                  </div>
                </div>
                <button
                  onClick={() => onApplySuggestion?.(suggestion.id)}
                  className="rounded-lg p-1.5 text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Smart Layout Analysis
          </h3>
          <button
            onClick={onRefreshAnalysis}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
            <p className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>{analysis.overallScore}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Overall Score</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{highPrioritySuggestions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">High Priority</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{pendingSuggestions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
            <div className="flex items-center justify-center gap-1">
              {(() => {
                const PatternIcon = getPatternIcon(analysis.layoutPattern);
                return <PatternIcon className="h-6 w-6 text-purple-500" />;
              })()}
            </div>
            <p className="mt-1 text-xs text-gray-500 capitalize dark:text-gray-400">{analysis.layoutPattern}</p>
          </div>
        </div>

        {/* Top Suggestions */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Top Recommendations</h4>
          <div className="space-y-2">
            {highPrioritySuggestions.slice(0, 3).map((suggestion) => {
              const TypeIcon = getTypeIcon(suggestion.type);
              return (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${getTypeColor(suggestion.type)}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{suggestion.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.impact}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.confidence}
                      % confident
                    </span>
                    <button
                      onClick={() => onApplySuggestion?.(suggestion.id)}
                      className="rounded-lg bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
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
              <Sparkles className="h-6 w-6 text-purple-500" />
              Smart Layout Suggestions
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              AI-powered recommendations to improve your layout
            </p>
          </div>
          <button
            onClick={onRefreshAnalysis}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Re-analyze
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['suggestions', 'templates', 'analysis'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'suggestions' && pendingSuggestions.length > 0 && (
                <span className="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-xs">
                  {pendingSuggestions.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Filter by priority:</span>
                <div className="flex gap-1">
                  {(['all', 'high', 'medium', 'low'] as const).map(priority => (
                    <button
                      key={priority}
                      onClick={() => setFilterPriority(priority)}
                      className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                        filterPriority === priority
                          ? priority === 'all'
                            ? 'bg-purple-600 text-white'
                            : getPriorityColor(priority)
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  filteredSuggestions.filter(s => s.status === 'pending' && s.autoApplicable).forEach((s) => {
                    onApplySuggestion?.(s.id);
                  });
                }}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Zap className="h-4 w-4" />
                Apply All Auto-fixable
              </button>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3">
              {filteredSuggestions.map((suggestion) => {
                const TypeIcon = getTypeIcon(suggestion.type);
                const isExpanded = expandedSuggestion === suggestion.id;

                return (
                  <div
                    key={suggestion.id}
                    className={`overflow-hidden rounded-xl border transition-all ${
                      suggestion.status === 'applied'
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : suggestion.status === 'dismissed'
                          ? 'border-gray-200 opacity-50 dark:border-gray-700'
                          : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Header */}
                    <div
                      className="cursor-pointer p-4"
                      onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2 ${getTypeColor(suggestion.type)}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h4>
                              <span className={`rounded px-2 py-0.5 text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                                {suggestion.priority}
                              </span>
                              {suggestion.autoApplicable && (
                                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                  Auto-fixable
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {suggestion.status === 'pending' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onApplySuggestion?.(suggestion.id);
                                }}
                                className="rounded-lg p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDismissSuggestion?.(suggestion.id);
                                }}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          {suggestion.status === 'applied' && (
                            <span className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                              <Check className="h-4 w-4" />
                              Applied
                            </span>
                          )}
                          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 px-4 pt-2 pb-4 dark:border-gray-700">
                        <div className="mb-4 grid gap-4 md:grid-cols-2">
                          {/* Impact */}
                          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Impact</span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white">{suggestion.impact}</p>
                          </div>

                          {/* Confidence */}
                          <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                            <div className="mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className="h-2 rounded-full bg-purple-500"
                                  style={{ width: `${suggestion.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {suggestion.confidence}
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Affected Elements */}
                        <div className="mb-4">
                          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Affected Elements</p>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.affectedElements.map(element => (
                              <code
                                key={element}
                                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              >
                                {element}
                              </code>
                            ))}
                          </div>
                        </div>

                        {/* Feedback */}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onFeedback?.(suggestion.id, true)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30"
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onFeedback?.(suggestion.id, false)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              const PatternIcon = getPatternIcon(template.pattern);
              return (
                <div
                  key={template.id}
                  className="overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
                >
                  {/* Preview */}
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                    <PatternIcon className="h-12 w-12 text-gray-400" />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {template.popularity}
                        % match
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {template.applicableTo.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => onApplyTemplate?.(template.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-purple-600 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                      Apply Template
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="flex items-center gap-8 rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="8"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    className={getScoreColor(analysis.overallScore)}
                    strokeWidth="8"
                    strokeDasharray={`${(analysis.overallScore / 100) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">out of 100</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Layout Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Pattern Detected</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const PatternIcon = getPatternIcon(analysis.layoutPattern);
                        return <PatternIcon className="h-5 w-5 text-purple-500" />;
                      })()}
                      <span className="font-medium text-gray-900 capitalize dark:text-white">
                        {analysis.layoutPattern}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Issues Found</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {analysis.issues.reduce((sum, i) => sum + i.count, 0)}
                      {' '}
                      total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues Breakdown */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Issues by Type</h4>
              <div className="space-y-2">
                {analysis.issues.map(issue => (
                  <div key={issue.type} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600 capitalize dark:text-gray-400">{issue.type}</div>
                    <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(issue.count / 5) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm font-medium text-gray-900 dark:text-white">{issue.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Strengths</h4>
              <div className="space-y-2">
                {analysis.strengths.map((strength, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
