'use client';

import { useMemo, useState } from 'react';

export type GalleryTemplate = {
  id: string;
  name: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  platform: string;
  industry: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  previewMessages: number;
  likes: number;
  downloads: number;
  createdAt: string;
  featured?: boolean;
  premium?: boolean;
};

type TemplateGalleryProps = {
  templates: GalleryTemplate[];
  onSelect?: (template: GalleryTemplate) => void;
  onLike?: (templateId: string) => void;
  showFilters?: boolean;
  initialCategory?: string;
};

const platformIcons: Record<string, React.ReactNode> = {
  whatsapp: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  imessage: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2c-.352 1.017.566 1.935 1.584 1.584l3.032-.892A9.958 9.958 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  ),
  telegram: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  instagram: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
    </svg>
  ),
  twitter: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  slack: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
};

const categories = [
  'All',
  'Business',
  'E-commerce',
  'Customer Support',
  'Marketing',
  'Social',
  'Gaming',
  'Education',
];

const industries = [
  'All',
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Travel',
  'Food',
  'Entertainment',
];

const platforms = [
  'All',
  'WhatsApp',
  'iMessage',
  'Telegram',
  'Instagram',
  'Twitter',
  'Slack',
];

export function TemplateGallery({
  templates,
  onSelect,
  onLike,
  showFilters = true,
  initialCategory,
}: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'downloads'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTemplates = useMemo(() => {
    return templates
      .filter((template) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch
            = template.name.toLowerCase().includes(query)
              || template.description.toLowerCase().includes(query)
              || template.tags.some(tag => tag.toLowerCase().includes(query));
          if (!matchesSearch) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && template.category !== selectedCategory) {
          return false;
        }

        // Industry filter
        if (selectedIndustry !== 'All' && template.industry !== selectedIndustry) {
          return false;
        }

        // Platform filter
        if (selectedPlatform !== 'All'
          && template.platform.toLowerCase() !== selectedPlatform.toLowerCase()) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'downloads':
            return b.downloads - a.downloads;
          case 'popular':
          default:
            return b.likes - a.likes;
        }
      });
  }, [templates, searchQuery, selectedCategory, selectedIndustry, selectedPlatform, sortBy]);

  const featuredTemplates = useMemo(() =>
    templates.filter(t => t.featured).slice(0, 3), [templates]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Template Gallery</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse and use community templates to jumpstart your mockups
          </p>
        </div>
      </div>

      {/* Featured Section */}
      {featuredTemplates.length > 0 && (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <svg className="size-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured Templates
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredTemplates.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelect?.(template)}
                className="group relative overflow-hidden rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 text-left transition-all hover:shadow-lg dark:border-yellow-800/50 dark:from-yellow-900/20 dark:to-orange-900/20"
              >
                <div className="absolute -top-4 -right-4 text-6xl opacity-10">
                  {platformIcons[template.platform.toLowerCase()]}
                </div>
                <div className="relative">
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    Featured
                  </span>
                  <h4 className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>

            {/* Industry */}
            <select
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind === 'All' ? 'All Industries' : ind}</option>
              ))}
            </select>

            {/* Platform */}
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
            >
              {platforms.map(plat => (
                <option key={plat} value={plat}>{plat === 'All' ? 'All Platforms' : plat}</option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="downloads">Most Downloads</option>
              </select>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-600 dark:bg-gray-700">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded p-1.5 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                >
                  <svg className="size-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded p-1.5 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
                >
                  <svg className="size-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Showing
        {' '}
        {filteredTemplates.length}
        {' '}
        template
        {filteredTemplates.length !== 1 ? 's' : ''}
      </div>

      {/* Template Grid/List */}
      {filteredTemplates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
          <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              onClick={() => onSelect?.(template)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {template.thumbnailUrl
                  ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${template.thumbnailUrl})` }}
                      />
                    )
                  : (
                      <div className="flex size-full items-center justify-center text-gray-400">
                        {platformIcons[template.platform.toLowerCase()] || (
                          <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    )}
                {template.premium && (
                  <span className="absolute top-2 right-2 rounded bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-xs font-medium text-white">
                    PRO
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <span className="text-gray-400">
                    {platformIcons[template.platform.toLowerCase()]}
                  </span>
                </div>
                <p className="mb-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="mb-3 flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike?.(template.id);
                      }}
                      className="flex items-center gap-1 hover:text-red-500"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {template.likes}
                    </button>
                    <span className="flex items-center gap-1">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {template.downloads}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {template.author.avatar
                      ? (
                          <div
                            className="size-5 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${template.author.avatar})` }}
                          />
                        )
                      : (
                          <div className="flex size-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                            {template.author.name.charAt(0)}
                          </div>
                        )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {template.author.name}
                    </span>
                    {template.author.verified && (
                      <svg className="size-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              onClick={() => onSelect?.(template)}
            >
              {/* Thumbnail */}
              <div className="size-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {template.thumbnailUrl
                  ? (
                      <div
                        className="size-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${template.thumbnailUrl})` }}
                      />
                    )
                  : (
                      <div className="flex size-full items-center justify-center text-gray-400">
                        {platformIcons[template.platform.toLowerCase()]}
                      </div>
                    )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  {template.premium && (
                    <span className="rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-xs font-medium text-white">
                      PRO
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                  {template.description}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  <span className="capitalize">{template.platform}</span>
                  <span>•</span>
                  <span>{template.category}</span>
                  <span>•</span>
                  <span>
                    {template.previewMessages}
                    {' '}
                    messages
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {template.likes}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {template.downloads}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sample gallery templates for demo
export function generateSampleGalleryTemplates(): GalleryTemplate[] {
  return [
    {
      id: 'tmpl_1',
      name: 'E-commerce Support Chat',
      description: 'Professional customer service conversation template for online stores',
      author: { name: 'MockFlow Team', verified: true },
      platform: 'whatsapp',
      industry: 'Retail',
      category: 'Customer Support',
      tags: ['support', 'e-commerce', 'professional'],
      previewMessages: 8,
      likes: 234,
      downloads: 1205,
      createdAt: new Date().toISOString(),
      featured: true,
    },
    {
      id: 'tmpl_2',
      name: 'Viral Tweet Thread',
      description: 'Engaging Twitter thread format for maximum engagement',
      author: { name: 'SocialPro', verified: true },
      platform: 'twitter',
      industry: 'Technology',
      category: 'Marketing',
      tags: ['viral', 'thread', 'engagement'],
      previewMessages: 5,
      likes: 189,
      downloads: 876,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      featured: true,
    },
    {
      id: 'tmpl_3',
      name: 'Tech Startup Pitch',
      description: 'Perfect for showcasing startup investor conversations',
      author: { name: 'StartupKit' },
      platform: 'imessage',
      industry: 'Technology',
      category: 'Business',
      tags: ['startup', 'pitch', 'investor'],
      previewMessages: 12,
      likes: 156,
      downloads: 543,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'tmpl_4',
      name: 'Restaurant Booking',
      description: 'Table reservation conversation for restaurants',
      author: { name: 'FoodieDesigns' },
      platform: 'whatsapp',
      industry: 'Food',
      category: 'Business',
      tags: ['restaurant', 'booking', 'reservation'],
      previewMessages: 6,
      likes: 98,
      downloads: 421,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 'tmpl_5',
      name: 'Gaming Discord Chat',
      description: 'Esports team communication mockup',
      author: { name: 'GameMockups', verified: true },
      platform: 'slack',
      industry: 'Entertainment',
      category: 'Gaming',
      tags: ['gaming', 'esports', 'team'],
      previewMessages: 15,
      likes: 312,
      downloads: 1567,
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      featured: true,
      premium: true,
    },
    {
      id: 'tmpl_6',
      name: 'Travel Itinerary',
      description: 'Share travel plans with friends and family',
      author: { name: 'WanderlustUI' },
      platform: 'telegram',
      industry: 'Travel',
      category: 'Social',
      tags: ['travel', 'vacation', 'planning'],
      previewMessages: 10,
      likes: 87,
      downloads: 298,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
    },
  ];
}
