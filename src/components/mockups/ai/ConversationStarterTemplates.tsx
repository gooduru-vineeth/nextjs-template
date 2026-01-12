'use client';

import { useState } from 'react';

type Category = 'general' | 'coding' | 'writing' | 'analysis' | 'creative' | 'business' | 'education' | 'productivity';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

type ConversationTemplate = {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  expectedResponse?: string;
  tags: string[];
  usageCount?: number;
  isFavorite?: boolean;
};

type ConversationStarterTemplatesProps = {
  onSelectTemplate: (template: ConversationTemplate) => void;
  onPreview?: (template: ConversationTemplate) => void;
  category?: Category;
  showFilters?: boolean;
  showFavorites?: boolean;
  favorites?: string[];
  onToggleFavorite?: (templateId: string) => void;
  className?: string;
};

const categoryInfo: Record<Category, { label: string; icon: React.ReactNode; color: string }> = {
  general: {
    label: 'General',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  coding: {
    label: 'Coding',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  writing: {
    label: 'Writing',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  analysis: {
    label: 'Analysis',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  creative: {
    label: 'Creative',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  business: {
    label: 'Business',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  education: {
    label: 'Education',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  productivity: {
    label: 'Productivity',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
};

const difficultyLabels: Record<Difficulty, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-green-600 dark:text-green-400' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400' },
  advanced: { label: 'Advanced', color: 'text-red-600 dark:text-red-400' },
};

// Sample templates
const sampleTemplates: ConversationTemplate[] = [
  // General
  {
    id: 'general-1',
    title: 'Friendly Introduction',
    description: 'Start a friendly conversation with an AI assistant',
    category: 'general',
    difficulty: 'beginner',
    prompt: 'Hello! Can you introduce yourself and tell me what you can help me with?',
    tags: ['introduction', 'getting-started'],
    usageCount: 15420,
  },
  {
    id: 'general-2',
    title: 'Ask for Recommendations',
    description: 'Get personalized recommendations on any topic',
    category: 'general',
    difficulty: 'beginner',
    prompt: 'I\'m looking for recommendations on [topic]. What would you suggest?',
    tags: ['recommendations', 'advice'],
    usageCount: 8932,
  },
  // Coding
  {
    id: 'coding-1',
    title: 'Debug Code',
    description: 'Get help debugging your code with detailed analysis',
    category: 'coding',
    difficulty: 'intermediate',
    prompt: 'I have this code that isn\'t working as expected. Can you help me debug it?\n\n```\n[paste your code here]\n```\n\nThe expected behavior is [describe] but I\'m getting [describe issue].',
    tags: ['debugging', 'troubleshooting'],
    usageCount: 24510,
  },
  {
    id: 'coding-2',
    title: 'Code Review',
    description: 'Request a thorough code review with suggestions',
    category: 'coding',
    difficulty: 'advanced',
    prompt: 'Please review this code for best practices, potential bugs, and performance improvements:\n\n```\n[paste your code here]\n```',
    tags: ['code-review', 'best-practices'],
    usageCount: 18234,
  },
  {
    id: 'coding-3',
    title: 'Explain Algorithm',
    description: 'Get a clear explanation of how an algorithm works',
    category: 'coding',
    difficulty: 'intermediate',
    prompt: 'Can you explain how [algorithm name] works? Please include its time complexity, use cases, and a simple implementation example.',
    tags: ['algorithms', 'learning'],
    usageCount: 12876,
  },
  // Writing
  {
    id: 'writing-1',
    title: 'Blog Post Outline',
    description: 'Generate a structured outline for a blog post',
    category: 'writing',
    difficulty: 'beginner',
    prompt: 'Help me create an outline for a blog post about [topic]. The target audience is [audience] and the goal is to [goal].',
    tags: ['blog', 'outline', 'content'],
    usageCount: 9654,
  },
  {
    id: 'writing-2',
    title: 'Email Draft',
    description: 'Draft a professional email for various scenarios',
    category: 'writing',
    difficulty: 'beginner',
    prompt: 'Help me write a professional email to [recipient] about [purpose]. The tone should be [formal/casual/friendly].',
    tags: ['email', 'professional', 'communication'],
    usageCount: 21345,
  },
  // Analysis
  {
    id: 'analysis-1',
    title: 'Data Analysis',
    description: 'Analyze data and extract meaningful insights',
    category: 'analysis',
    difficulty: 'intermediate',
    prompt: 'Please analyze this data and provide key insights:\n\n[paste your data]\n\nI\'m particularly interested in [specific aspects].',
    tags: ['data', 'insights', 'statistics'],
    usageCount: 7823,
  },
  {
    id: 'analysis-2',
    title: 'Pros and Cons Analysis',
    description: 'Get a balanced analysis of options',
    category: 'analysis',
    difficulty: 'beginner',
    prompt: 'Can you provide a detailed pros and cons analysis of [option 1] vs [option 2] for [use case]?',
    tags: ['comparison', 'decision-making'],
    usageCount: 13456,
  },
  // Creative
  {
    id: 'creative-1',
    title: 'Story Starter',
    description: 'Get creative prompts to start your story',
    category: 'creative',
    difficulty: 'beginner',
    prompt: 'Give me an interesting story starter for a [genre] story. Include a unique character and an unexpected situation.',
    tags: ['story', 'fiction', 'creative-writing'],
    usageCount: 6543,
  },
  {
    id: 'creative-2',
    title: 'Brainstorm Ideas',
    description: 'Generate creative ideas for any project',
    category: 'creative',
    difficulty: 'beginner',
    prompt: 'Help me brainstorm 10 creative ideas for [project/topic]. Think outside the box and include both practical and unconventional suggestions.',
    tags: ['brainstorming', 'ideas', 'creativity'],
    usageCount: 11234,
  },
  // Business
  {
    id: 'business-1',
    title: 'Business Plan Section',
    description: 'Draft a section of your business plan',
    category: 'business',
    difficulty: 'intermediate',
    prompt: 'Help me write the [section name] section of my business plan for [business description]. Include relevant metrics and market analysis.',
    tags: ['business-plan', 'strategy'],
    usageCount: 5678,
  },
  {
    id: 'business-2',
    title: 'Meeting Agenda',
    description: 'Create a structured meeting agenda',
    category: 'business',
    difficulty: 'beginner',
    prompt: 'Create a meeting agenda for a [meeting type] meeting about [topic]. Duration is [X] minutes with [N] participants.',
    tags: ['meeting', 'agenda', 'organization'],
    usageCount: 8765,
  },
  // Education
  {
    id: 'education-1',
    title: 'Explain Concept',
    description: 'Get a clear explanation of any concept',
    category: 'education',
    difficulty: 'beginner',
    prompt: 'Explain [concept] to me like I\'m a [level] student. Use analogies and examples to make it easy to understand.',
    tags: ['learning', 'explanation', 'teaching'],
    usageCount: 19876,
  },
  {
    id: 'education-2',
    title: 'Quiz Questions',
    description: 'Generate quiz questions for studying',
    category: 'education',
    difficulty: 'intermediate',
    prompt: 'Create 10 quiz questions about [topic] with varying difficulty levels. Include the answers at the end.',
    tags: ['quiz', 'study', 'testing'],
    usageCount: 7654,
  },
  // Productivity
  {
    id: 'productivity-1',
    title: 'Task Breakdown',
    description: 'Break down a complex task into manageable steps',
    category: 'productivity',
    difficulty: 'beginner',
    prompt: 'Help me break down this task into actionable steps: [task description]. Include estimated time for each step.',
    tags: ['tasks', 'planning', 'organization'],
    usageCount: 14567,
  },
  {
    id: 'productivity-2',
    title: 'Summarize Document',
    description: 'Get a concise summary of any document',
    category: 'productivity',
    difficulty: 'beginner',
    prompt: 'Please summarize the following document in bullet points, highlighting the key takeaways:\n\n[paste document]',
    tags: ['summary', 'notes', 'reading'],
    usageCount: 23456,
  },
];

export function ConversationStarterTemplates({
  onSelectTemplate,
  onPreview,
  category: filterCategory,
  showFilters = true,
  showFavorites = true,
  favorites = [],
  onToggleFavorite,
  className = '',
}: ConversationStarterTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(filterCategory || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredTemplates = sampleTemplates.filter((template) => {
    if (selectedCategory !== 'all' && template.category !== selectedCategory) {
      return false;
    }
    if (selectedDifficulty !== 'all' && template.difficulty !== selectedDifficulty) {
      return false;
    }
    if (showOnlyFavorites && !favorites.includes(template.id)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        template.title.toLowerCase().includes(query)
        || template.description.toLowerCase().includes(query)
        || template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filters */}
      {showFilters && (
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {(Object.entries(categoryInfo) as [Category, typeof categoryInfo[Category]][]).map(([cat, info]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? info.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {info.icon}
                {info.label}
              </button>
            ))}
          </div>

          {/* Difficulty and Favorites filter */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {diff === 'all' ? 'All Levels' : difficultyLabels[diff].label}
                </button>
              ))}
            </div>
            {showFavorites && (
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  showOnlyFavorites
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <svg className={`size-4 ${showOnlyFavorites ? 'fill-current' : ''}`} fill={showOnlyFavorites ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Favorites
              </button>
            )}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isFavorite={favorites.includes(template.id)}
            onSelect={() => onSelectTemplate(template)}
            onPreview={onPreview ? () => onPreview(template) : undefined}
            onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(template.id) : undefined}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center">
          <svg className="mx-auto size-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}

// Template Card Component
type TemplateCardProps = {
  template: ConversationTemplate;
  isFavorite: boolean;
  onSelect: () => void;
  onPreview?: () => void;
  onToggleFavorite?: () => void;
};

function TemplateCard({
  template,
  isFavorite,
  onSelect,
  onPreview,
  onToggleFavorite,
}: TemplateCardProps) {
  const catInfo = categoryInfo[template.category];
  const diffInfo = difficultyLabels[template.difficulty];

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 right-2 rounded-full p-1 text-gray-400 transition-colors hover:text-yellow-500"
        >
          <svg
            className={`size-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      )}

      {/* Category badge */}
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${catInfo.color}`}>
          {catInfo.icon}
          {catInfo.label}
        </span>
        <span className={`text-xs font-medium ${diffInfo.color}`}>
          {diffInfo.label}
        </span>
      </div>

      {/* Title and description */}
      <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
        {template.title}
      </h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
        {template.description}
      </p>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1">
        {template.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          >
            #
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {template.usageCount?.toLocaleString()}
          {' '}
          uses
        </span>
        <div className="flex gap-2">
          {onPreview && (
            <button
              onClick={onPreview}
              className="rounded-lg px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Preview
            </button>
          )}
          <button
            onClick={onSelect}
            className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-600"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}

// Template Preview Modal
type TemplatePreviewModalProps = {
  template: ConversationTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUse: (template: ConversationTemplate) => void;
};

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onUse,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {template.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {template.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt Template
          </h4>
          <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
            <pre className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {template.prompt}
            </pre>
          </div>
        </div>

        {template.expectedResponse && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Expected Response Style
            </h4>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <pre className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {template.expectedResponse}
              </pre>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onUse(template);
              onClose();
            }}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
}

export type { Category, ConversationTemplate, Difficulty };
