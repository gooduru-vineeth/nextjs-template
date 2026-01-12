'use client';

import { Banknote, Briefcase, Check, ChevronRight, Clock, GraduationCap, HeartPulse, MessageSquare, Search, ShoppingCart, Star, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ScenarioTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  industry?: string;
  icon?: React.ReactNode;
  thumbnail?: string;
  popularity?: number;
  isNew?: boolean;
  isPremium?: boolean;
  tags?: string[];
  previewCount?: number;
};

export type ScenarioCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
};

export type ScenarioTemplateSelectorProps = {
  variant?: 'full' | 'compact' | 'grid' | 'list' | 'carousel';
  templates?: ScenarioTemplate[];
  categories?: ScenarioCategory[];
  selectedTemplate?: string;
  selectedCategory?: string;
  onSelect?: (template: ScenarioTemplate) => void;
  onCategoryChange?: (category: string) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
};

const defaultCategories: ScenarioCategory[] = [
  { id: 'all', name: 'All Templates', icon: <Zap size={18} /> },
  { id: 'saas', name: 'SaaS', icon: <Briefcase size={18} />, description: 'Software product demos' },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart size={18} />, description: 'Online shopping scenarios' },
  { id: 'healthcare', name: 'Healthcare', icon: <HeartPulse size={18} />, description: 'Medical communications' },
  { id: 'education', name: 'Education', icon: <GraduationCap size={18} />, description: 'Learning and courses' },
  { id: 'finance', name: 'Finance', icon: <Banknote size={18} />, description: 'Banking and finance' },
  { id: 'support', name: 'Customer Support', icon: <MessageSquare size={18} />, description: 'Support scenarios' },
  { id: 'social', name: 'Social Media', icon: <Users size={18} />, description: 'Social engagement' },
];

const defaultTemplates: ScenarioTemplate[] = [
  { id: '1', name: 'Product Demo Request', description: 'A prospect asks about product features', category: 'saas', industry: 'SaaS', popularity: 95, isNew: false, tags: ['sales', 'demo'], previewCount: 1250 },
  { id: '2', name: 'Customer Onboarding', description: 'Welcome new users to your platform', category: 'saas', industry: 'SaaS', popularity: 88, tags: ['onboarding', 'welcome'], previewCount: 980 },
  { id: '3', name: 'Order Confirmation', description: 'Confirm a customer purchase', category: 'ecommerce', industry: 'E-commerce', popularity: 92, tags: ['orders', 'confirmation'], previewCount: 2100 },
  { id: '4', name: 'Shipping Update', description: 'Notify customer about delivery status', category: 'ecommerce', industry: 'E-commerce', popularity: 85, tags: ['shipping', 'notification'], previewCount: 1500 },
  { id: '5', name: 'Appointment Reminder', description: 'Remind patients of upcoming visits', category: 'healthcare', industry: 'Healthcare', popularity: 78, isPremium: true, tags: ['appointment', 'reminder'], previewCount: 650 },
  { id: '6', name: 'Test Results', description: 'Share lab results with patients', category: 'healthcare', industry: 'Healthcare', popularity: 72, isPremium: true, tags: ['results', 'medical'], previewCount: 420 },
  { id: '7', name: 'Course Enrollment', description: 'Student enrolls in online course', category: 'education', industry: 'Education', popularity: 80, isNew: true, tags: ['enrollment', 'courses'], previewCount: 890 },
  { id: '8', name: 'Assignment Feedback', description: 'Teacher provides assignment feedback', category: 'education', industry: 'Education', popularity: 75, tags: ['feedback', 'grading'], previewCount: 720 },
  { id: '9', name: 'Transaction Alert', description: 'Notify user of account activity', category: 'finance', industry: 'Finance', popularity: 90, tags: ['banking', 'alert'], previewCount: 1800 },
  { id: '10', name: 'Support Ticket', description: 'Customer reports an issue', category: 'support', popularity: 88, tags: ['support', 'ticket'], previewCount: 2500 },
  { id: '11', name: 'Influencer DM', description: 'Brand outreach to influencer', category: 'social', popularity: 82, isNew: true, tags: ['influencer', 'outreach'], previewCount: 1100 },
];

const ScenarioTemplateSelector: React.FC<ScenarioTemplateSelectorProps> = ({
  variant = 'full',
  templates = defaultTemplates,
  categories = defaultCategories,
  selectedTemplate,
  selectedCategory,
  onSelect,
  onCategoryChange,
  showSearch = true,
  showFilters = true,
  className = '',
}) => {
  const [selected, setSelected] = useState<string>(selectedTemplate || '');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'name'>('popular');

  useEffect(() => {
    if (selectedTemplate) {
      setSelected(selectedTemplate);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedCategory) {
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleSelect = useCallback((template: ScenarioTemplate) => {
    setSelected(template.id);
    onSelect?.(template);
  }, [onSelect]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  }, [onCategoryChange]);

  const filteredTemplates = templates
    .filter(t => activeCategory === 'all' || t.category === activeCategory)
    .filter(t => !searchQuery
      || t.name.toLowerCase().includes(searchQuery.toLowerCase())
      || t.description.toLowerCase().includes(searchQuery.toLowerCase())
      || t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'new':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // List variant
  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
              selected === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{template.name}</span>
                {template.isNew && (
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    New
                  </span>
                )}
                {template.isPremium && (
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>
    );
  }

  // Grid variant
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {filteredTemplates.map(template => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`relative rounded-xl border-2 p-4 text-left transition-all ${
              selected === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
          >
            {template.isNew && (
              <span className="absolute top-2 right-2 rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                New
              </span>
            )}
            <div className="mb-1 font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
            <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} />
                {template.popularity}
                %
              </span>
              {template.previewCount && (
                <span>
                  {template.previewCount.toLocaleString()}
                  {' '}
                  uses
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="max-h-60 space-y-2 overflow-y-auto">
          {filteredTemplates.slice(0, 6).map(template => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className={`w-full rounded-lg p-3 text-left transition-all ${
                selected === template.id
                  ? 'bg-blue-100 dark:bg-blue-900/30'
                  : 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
              <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
          <Briefcase size={18} />
          Scenario Templates
        </h4>
      </div>

      {/* Search and filters */}
      {(showSearch || showFilters) && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex gap-3">
            {showSearch && (
              <div className="relative flex-1">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2 pr-4 pl-10 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            )}
            {showFilters && (
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'popular' | 'new' | 'name')}
                className="rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="popular">Most Popular</option>
                <option value="new">Newest First</option>
                <option value="name">Alphabetical</option>
              </select>
            )}
          </div>
        </div>
      )}

      {/* Categories sidebar + templates grid */}
      <div className="flex">
        {/* Categories */}
        <div className="w-48 border-r border-gray-200 p-3 dark:border-gray-700">
          <div className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates grid */}
        <div className="flex-1 p-4">
          <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            {filteredTemplates.length}
            {' '}
            template
            {filteredTemplates.length !== 1 ? 's' : ''}
            {' '}
            found
          </div>
          <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                  selected === template.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                {/* Badges */}
                <div className="absolute top-2 right-2 flex gap-1">
                  {template.isNew && (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      New
                    </span>
                  )}
                  {template.isPremium && (
                    <span className="rounded bg-yellow-100 p-1 dark:bg-yellow-900/30">
                      <Star size={10} className="fill-yellow-500 text-yellow-500" />
                    </span>
                  )}
                </div>

                {selected === template.id && (
                  <div className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <Check size={12} className="text-white" />
                  </div>
                )}

                <div className="mb-1 pr-16 font-medium text-gray-900 dark:text-gray-100">{template.name}</div>
                <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    {template.popularity}
                    %
                  </span>
                  {template.previewCount && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {template.previewCount.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {template.tags && template.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioTemplateSelector;
