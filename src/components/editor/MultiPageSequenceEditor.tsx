'use client';

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Layers,
  Pause,
  Play,
  Plus,
  Settings,
  SkipBack,
  SkipForward,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

export type PageData = {
  id: string;
  title: string;
  content: React.ReactNode | null;
  thumbnail?: string;
  duration?: number; // in milliseconds
  transition?: 'none' | 'fade' | 'slide' | 'zoom';
  isVisible: boolean;
  metadata?: Record<string, unknown>;
};

export type MultiPageSequenceEditorProps = {
  pages: PageData[];
  onChange: (pages: PageData[]) => void;
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  variant?: 'full' | 'compact' | 'filmstrip' | 'timeline' | 'sidebar';
  showPreview?: boolean;
  allowReorder?: boolean;
  maxPages?: number;
  className?: string;
};

export default function MultiPageSequenceEditor({
  pages,
  onChange,
  currentPageIndex,
  onPageChange,
  variant = 'full',
  showPreview = true,
  allowReorder = true,
  maxPages = 20,
  className = '',
}: MultiPageSequenceEditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const currentPage = pages[currentPageIndex];

  const handleAddPage = useCallback(() => {
    if (pages.length >= maxPages) {
      return;
    }

    const newPage: PageData = {
      id: `page-${Date.now()}`,
      title: `Page ${pages.length + 1}`,
      content: null,
      duration: 3000,
      transition: 'fade',
      isVisible: true,
    };

    onChange([...pages, newPage]);
    onPageChange(pages.length);
  }, [pages, maxPages, onChange, onPageChange]);

  const handleDeletePage = useCallback((index: number) => {
    if (pages.length <= 1) {
      return;
    }

    const newPages = pages.filter((_, i) => i !== index);
    onChange(newPages);

    if (currentPageIndex >= newPages.length) {
      onPageChange(newPages.length - 1);
    } else if (currentPageIndex > index) {
      onPageChange(currentPageIndex - 1);
    }
  }, [pages, currentPageIndex, onChange, onPageChange]);

  const handleDuplicatePage = useCallback((index: number) => {
    if (pages.length >= maxPages) {
      return;
    }

    const pageToDuplicate = pages[index]!;
    const newPage: PageData = {
      ...pageToDuplicate,
      id: `page-${Date.now()}`,
      title: `${pageToDuplicate.title} (Copy)`,
    };

    const newPages = [...pages.slice(0, index + 1), newPage, ...pages.slice(index + 1)];
    onChange(newPages);
    onPageChange(index + 1);
  }, [pages, maxPages, onChange, onPageChange]);

  const handleToggleVisibility = useCallback((index: number) => {
    const newPages = pages.map((page, i) =>
      i === index ? { ...page, isVisible: !page.isVisible } : page,
    );
    onChange(newPages);
  }, [pages, onChange]);

  const handleUpdatePage = useCallback((index: number, updates: Partial<PageData>) => {
    const newPages = pages.map((page, i) =>
      i === index ? { ...page, ...updates } : page,
    );
    onChange(newPages);
  }, [pages, onChange]);

  const handleDragStart = useCallback((index: number) => {
    if (!allowReorder) {
      return;
    }
    setDraggedIndex(index);
  }, [allowReorder]);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    const newPages = [...pages];
    const [draggedPage] = newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage!);

    onChange(newPages);
    setDraggedIndex(index);
  }, [draggedIndex, pages, onChange]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const navigateToPage = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPageIndex > 0) {
      onPageChange(currentPageIndex - 1);
    } else if (direction === 'next' && currentPageIndex < pages.length - 1) {
      onPageChange(currentPageIndex + 1);
    }
  }, [currentPageIndex, pages.length, onPageChange]);

  // Filmstrip variant
  if (variant === 'filmstrip') {
    return (
      <div className={`bg-gray-900 ${className}`}>
        <div className="flex items-center gap-2 overflow-x-auto p-2">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => onPageChange(index)}
              className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                index === currentPageIndex
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              {page.thumbnail
                ? (
                    <img src={page.thumbnail} alt={page.title} className="h-full w-full object-cover" />
                  )
                : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                  )}
              {!page.isVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <EyeOff size={12} className="text-gray-400" />
                </div>
              )}
            </button>
          ))}
          <button
            onClick={handleAddPage}
            disabled={pages.length >= maxPages}
            className="flex h-14 w-20 flex-shrink-0 items-center justify-center rounded border-2 border-dashed border-gray-700 text-gray-500 transition-colors hover:border-gray-500 hover:text-gray-400 disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    const totalDuration = pages.reduce((sum, page) => sum + (page.duration || 3000), 0);

    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {/* Playback Controls */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(0)}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => onPageChange(pages.length - 1)}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <SkipForward size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={14} />
            <span>
              {(totalDuration / 1000).toFixed(1)}
              s total
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-3">
          <div className="relative h-16 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
            <div className="absolute inset-0 flex">
              {pages.map((page, index) => {
                const widthPercent = ((page.duration || 3000) / totalDuration) * 100;
                return (
                  <button
                    key={page.id}
                    onClick={() => onPageChange(index)}
                    className={`relative h-full border-r border-gray-200 transition-colors dark:border-gray-700 ${
                      index === currentPageIndex
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <div className="absolute inset-1 overflow-hidden rounded">
                      {page.thumbnail
                        ? (
                            <img src={page.thumbnail} alt={page.title} className="h-full w-full object-cover opacity-60" />
                          )
                        : (
                            <div className="h-full w-full bg-gray-300 dark:bg-gray-700" />
                          )}
                    </div>
                    <span className="absolute bottom-1 left-1 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {/* Header */}
        <div className="border-b border-gray-200 p-3 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pages</span>
            </div>
            <span className="text-xs text-gray-500">
              {pages.length}
              /
              {maxPages}
            </span>
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {pages.map((page, index) => (
            <div
              key={page.id}
              draggable={allowReorder}
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => onPageChange(index)}
              className={`group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors ${
                index === currentPageIndex
                  ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  : 'border border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50'
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              {allowReorder && (
                <GripVertical size={14} className="cursor-grab text-gray-400" />
              )}

              <div className="h-7 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                {page.thumbnail
                  ? (
                      <img src={page.thumbnail} alt={page.title} className="h-full w-full object-cover" />
                    )
                  : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-500">
                        {index + 1}
                      </div>
                    )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                  {page.title}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); handleToggleVisibility(index);
                  }}
                  className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {page.isVisible
                    ? (
                        <Eye size={12} className="text-gray-500" />
                      )
                    : (
                        <EyeOff size={12} className="text-gray-400" />
                      )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); handleDeletePage(index);
                  }}
                  className="rounded p-1 text-gray-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <div className="border-t border-gray-200 p-2 dark:border-gray-700">
          <button
            onClick={handleAddPage}
            disabled={pages.length >= maxPages}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Plus size={16} />
            Add Page
          </button>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => navigateToPage('prev')}
          disabled={currentPageIndex === 0}
          className="dark:hover:bg-gray-750 rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
        >
          <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => onPageChange(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentPageIndex
                  ? 'w-6 bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
              }`}
              title={page.title}
            />
          ))}
        </div>

        <button
          onClick={() => navigateToPage('next')}
          disabled={currentPageIndex === pages.length - 1}
          className="dark:hover:bg-gray-750 rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
        >
          <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
        </button>

        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          {currentPageIndex + 1}
          {' '}
          /
          {pages.length}
        </span>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers size={20} className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Page Sequence</h3>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              {pages.length}
              {' '}
              pages
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddPage}
              disabled={pages.length >= maxPages}
              className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} />
              Add Page
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      {showPreview && currentPage && (
        <div className="border-b border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <div className="mx-auto aspect-video max-w-md overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
            {currentPage.content || (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <span>
                  Page
                  {currentPageIndex + 1}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="border-b border-gray-100 p-4 dark:border-gray-700">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigateToPage('prev')}
            disabled={currentPageIndex === 0}
            className="rounded-lg p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex items-center gap-2">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => onPageChange(index)}
                className={`relative h-8 w-12 overflow-hidden rounded border-2 transition-all ${
                  index === currentPageIndex
                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                }`}
              >
                {page.thumbnail
                  ? (
                      <img src={page.thumbnail} alt={page.title} className="h-full w-full object-cover" />
                    )
                  : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] text-gray-500 dark:bg-gray-700">
                        {index + 1}
                      </div>
                    )}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigateToPage('next')}
            disabled={currentPageIndex === pages.length - 1}
            className="rounded-lg p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
          >
            <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Page Settings */}
      {currentPage && (
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Settings size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Page Settings</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Title</label>
              <input
                type="text"
                value={currentPage.title}
                onChange={e => handleUpdatePage(currentPageIndex, { title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Duration (ms)</label>
              <input
                type="number"
                value={currentPage.duration || 3000}
                onChange={e => handleUpdatePage(currentPageIndex, { duration: Number(e.target.value) })}
                min={500}
                max={30000}
                step={500}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Transition</label>
            <div className="flex gap-2">
              {(['none', 'fade', 'slide', 'zoom'] as const).map(transition => (
                <button
                  key={transition}
                  onClick={() => handleUpdatePage(currentPageIndex, { transition })}
                  className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                    currentPage.transition === transition
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  {transition}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-2 dark:border-gray-700">
            <button
              onClick={() => handleDuplicatePage(currentPageIndex)}
              disabled={pages.length >= maxPages}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Copy size={14} />
              Duplicate
            </button>
            <button
              onClick={() => handleToggleVisibility(currentPageIndex)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {currentPage.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
              {currentPage.isVisible ? 'Visible' : 'Hidden'}
            </button>
            <button
              onClick={() => handleDeletePage(currentPageIndex)}
              disabled={pages.length <= 1}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
