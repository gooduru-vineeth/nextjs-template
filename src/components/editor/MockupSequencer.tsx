'use client';

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  Eye,
  GripVertical,
  Image,
  Layers,
  Link,
  Pause,
  Play,
  Plus,
  Settings,
  Trash2,
  Unlink,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type TransitionType = 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom';

type MockupPage = {
  id: string;
  name: string;
  thumbnail?: string;
  duration: number; // seconds
  transition: TransitionType;
  transitionDuration: number; // ms
  notes?: string;
};

type MockupSequence = {
  id: string;
  name: string;
  pages: MockupPage[];
  loop: boolean;
  autoPlay: boolean;
  showNavigation: boolean;
};

type MockupSequencerProps = {
  variant?: 'full' | 'compact' | 'timeline';
  sequence?: MockupSequence;
  onSequenceChange?: (sequence: MockupSequence) => void;
  onPageSelect?: (pageId: string) => void;
  onPreview?: () => void;
  onExport?: (format: 'gif' | 'video' | 'pdf') => void;
  className?: string;
};

// Default sequence
const defaultSequence: MockupSequence = {
  id: 'seq-1',
  name: 'Untitled Sequence',
  pages: [
    { id: 'page-1', name: 'Intro Screen', duration: 3, transition: 'fade', transitionDuration: 300 },
    { id: 'page-2', name: 'Main Chat', duration: 5, transition: 'slide-left', transitionDuration: 400 },
    { id: 'page-3', name: 'Response', duration: 4, transition: 'fade', transitionDuration: 300 },
    { id: 'page-4', name: 'Outro', duration: 3, transition: 'zoom', transitionDuration: 500 },
  ],
  loop: true,
  autoPlay: false,
  showNavigation: true,
};

const transitionOptions: { value: TransitionType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fade', label: 'Fade' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'zoom', label: 'Zoom' },
];

export default function MockupSequencer({
  variant = 'full',
  sequence: initialSequence = defaultSequence,
  onSequenceChange,
  onPageSelect,
  onPreview,
  onExport,
  className = '',
}: MockupSequencerProps) {
  const [sequence, setSequence] = useState<MockupSequence>(initialSequence);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(sequence.pages[0]?.id || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);

  const updateSequence = useCallback((updates: Partial<MockupSequence>) => {
    setSequence((prev) => {
      const updated = { ...prev, ...updates };
      onSequenceChange?.(updated);
      return updated;
    });
  }, [onSequenceChange]);

  const updatePage = useCallback((pageId: string, updates: Partial<MockupPage>) => {
    setSequence((prev) => {
      const updated = {
        ...prev,
        pages: prev.pages.map(p => p.id === pageId ? { ...p, ...updates } : p),
      };
      onSequenceChange?.(updated);
      return updated;
    });
  }, [onSequenceChange]);

  const addPage = useCallback(() => {
    const newPage: MockupPage = {
      id: `page-${Date.now()}`,
      name: `Page ${sequence.pages.length + 1}`,
      duration: 3,
      transition: 'fade',
      transitionDuration: 300,
    };
    updateSequence({ pages: [...sequence.pages, newPage] });
    setSelectedPageId(newPage.id);
  }, [sequence.pages, updateSequence]);

  const duplicatePage = useCallback((pageId: string) => {
    const pageIndex = sequence.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) {
      return;
    }
    const page = sequence.pages[pageIndex]!;
    const newPage: MockupPage = {
      ...page,
      id: `page-${Date.now()}`,
      name: `${page.name} (Copy)`,
    };
    const newPages = [...sequence.pages];
    newPages.splice(pageIndex + 1, 0, newPage);
    updateSequence({ pages: newPages });
    setSelectedPageId(newPage.id);
  }, [sequence.pages, updateSequence]);

  const deletePage = useCallback((pageId: string) => {
    if (sequence.pages.length <= 1) {
      return;
    }
    const newPages = sequence.pages.filter(p => p.id !== pageId);
    updateSequence({ pages: newPages });
    if (selectedPageId === pageId) {
      setSelectedPageId(newPages[0]?.id || null);
    }
  }, [sequence.pages, selectedPageId, updateSequence]);

  const movePage = useCallback((pageId: string, direction: 'up' | 'down') => {
    const pageIndex = sequence.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) {
      return;
    }
    if (direction === 'up' && pageIndex === 0) {
      return;
    }
    if (direction === 'down' && pageIndex === sequence.pages.length - 1) {
      return;
    }

    const newPages = [...sequence.pages];
    const swapIndex = direction === 'up' ? pageIndex - 1 : pageIndex + 1;
    [newPages[pageIndex], newPages[swapIndex]] = [newPages[swapIndex]!, newPages[pageIndex]!];
    updateSequence({ pages: newPages });
  }, [sequence.pages, updateSequence]);

  const handleSelectPage = useCallback((pageId: string) => {
    setSelectedPageId(pageId);
    onPageSelect?.(pageId);
  }, [onPageSelect]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (!isPlaying) {
      onPreview?.();
    }
  }, [isPlaying, onPreview]);

  const goToPrevPage = useCallback(() => {
    const currentIndex = sequence.pages.findIndex(p => p.id === selectedPageId);
    if (currentIndex > 0) {
      handleSelectPage(sequence.pages[currentIndex - 1]!.id);
    }
  }, [sequence.pages, selectedPageId, handleSelectPage]);

  const goToNextPage = useCallback(() => {
    const currentIndex = sequence.pages.findIndex(p => p.id === selectedPageId);
    if (currentIndex < sequence.pages.length - 1) {
      handleSelectPage(sequence.pages[currentIndex + 1]!.id);
    }
  }, [sequence.pages, selectedPageId, handleSelectPage]);

  const selectedPage = sequence.pages.find(p => p.id === selectedPageId);
  const totalDuration = sequence.pages.reduce((sum, p) => sum + p.duration, 0);

  // Suppress unused variables
  void draggedPageId;
  void setDraggedPageId;
  void currentPlayIndex;
  void setCurrentPlayIndex;

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {/* Timeline header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{sequence.name}</span>
            <span className="text-xs text-gray-500">
              (
              {sequence.pages.length}
              {' '}
              pages,
              {totalDuration}
              s)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={goToPrevPage} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <button onClick={togglePlayback} className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-700">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button onClick={goToNextPage} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Timeline track */}
        <div className="overflow-x-auto p-3">
          <div className="flex min-w-max gap-1">
            {sequence.pages.map(page => (
              <div
                key={page.id}
                onClick={() => handleSelectPage(page.id)}
                className={`w-24 flex-shrink-0 cursor-pointer rounded p-2 transition-colors ${
                  selectedPageId === page.id
                    ? 'bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/30'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="mb-1 flex h-12 w-full items-center justify-center rounded bg-gray-300 dark:bg-gray-600">
                  <Image className="h-5 w-5 text-gray-500" />
                </div>
                <p className="truncate text-xs font-medium text-gray-900 dark:text-white">{page.name}</p>
                <p className="text-xs text-gray-500">
                  {page.duration}
                  s
                </p>
              </div>
            ))}
            <button
              onClick={addPage}
              className="flex h-20 w-24 flex-shrink-0 items-center justify-center rounded border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-blue-900/20"
            >
              <Plus className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Layers className="h-5 w-5 text-blue-500" />
            Sequence
          </h3>
          <span className="text-sm text-gray-500">
            {sequence.pages.length}
            {' '}
            pages
          </span>
        </div>

        {/* Page list */}
        <div className="mb-4 space-y-2">
          {sequence.pages.map((page, index) => (
            <div
              key={page.id}
              onClick={() => handleSelectPage(page.id)}
              className={`flex cursor-pointer items-center gap-2 rounded p-2 ${
                selectedPageId === page.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="w-4 text-xs text-gray-400">{index + 1}</span>
              <span className="flex-1 truncate text-sm text-gray-900 dark:text-white">{page.name}</span>
              <span className="text-xs text-gray-500">
                {page.duration}
                s
              </span>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Preview'}
          </button>
          <button
            onClick={addPage}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Layers className="h-6 w-6 text-blue-500" />
            <div>
              <input
                type="text"
                value={sequence.name}
                onChange={e => updateSequence({ name: e.target.value })}
                className="border-none bg-transparent text-xl font-bold text-gray-900 outline-none focus:ring-0 dark:text-white"
              />
              <p className="text-sm text-gray-500">
                {sequence.pages.length}
                {' '}
                pages •
                {totalDuration}
                {' '}
                seconds total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExport?.('gif')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={goToPrevPage} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <span className="min-w-[80px] text-center text-sm text-gray-700 dark:text-gray-300">
              {sequence.pages.findIndex(p => p.id === selectedPageId) + 1}
              {' '}
              /
              {sequence.pages.length}
            </span>
            <button onClick={goToNextPage} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {sequence.pages.map((page) => {
              const widthPercent = (page.duration / totalDuration) * 100;
              return (
                <div
                  key={page.id}
                  onClick={() => handleSelectPage(page.id)}
                  className={`inline-block h-full cursor-pointer ${
                    selectedPageId === page.id ? 'bg-blue-500' : 'bg-blue-300 dark:bg-blue-700'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                  title={page.name}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={sequence.loop}
                onChange={e => updateSequence({ loop: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Loop
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={sequence.autoPlay}
                onChange={e => updateSequence({ autoPlay: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Auto-play
            </label>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Page list */}
        <div className="w-64 border-r border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Pages</h3>
            <button
              onClick={addPage}
              className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {sequence.pages.map((page, index) => (
              <div
                key={page.id}
                onClick={() => handleSelectPage(page.id)}
                className={`group flex cursor-pointer items-center gap-2 rounded-lg p-2 ${
                  selectedPageId === page.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <GripVertical className="h-4 w-4 cursor-grab text-gray-300" />
                <div className="flex h-7 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-200 dark:bg-gray-600">
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{page.name}</p>
                  <p className="text-xs text-gray-500">
                    {page.duration}
                    s
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); duplicatePage(page.id);
                    }}
                    className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Copy className="h-3 w-3 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); deletePage(page.id);
                    }}
                    className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page settings */}
        <div className="flex-1 p-6">
          {selectedPage ? (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Page Name</label>
                <input
                  type="text"
                  value={selectedPage.name}
                  onChange={e => updatePage(selectedPage.id, { name: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={selectedPage.duration}
                    onChange={e => updatePage(selectedPage.id, { duration: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Transition</label>
                  <select
                    value={selectedPage.transition}
                    onChange={e => updatePage(selectedPage.id, { transition: e.target.value as TransitionType })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {transitionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Transition Duration:
                  {' '}
                  {selectedPage.transitionDuration}
                  ms
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={selectedPage.transitionDuration}
                  onChange={e => updatePage(selectedPage.id, { transitionDuration: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Notes</label>
                <textarea
                  value={selectedPage.notes || ''}
                  onChange={e => updatePage(selectedPage.id, { notes: e.target.value })}
                  placeholder="Add notes for this page..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Page actions */}
              <div className="flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  onClick={() => movePage(selectedPage.id, 'up')}
                  disabled={sequence.pages.findIndex(p => p.id === selectedPage.id) === 0}
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <ChevronUp className="h-4 w-4" />
                  Move Up
                </button>
                <button
                  onClick={() => movePage(selectedPage.id, 'down')}
                  disabled={sequence.pages.findIndex(p => p.id === selectedPage.id) === sequence.pages.length - 1}
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <ChevronDown className="h-4 w-4" />
                  Move Down
                </button>
                <button
                  onClick={() => duplicatePage(selectedPage.id)}
                  className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => deletePage(selectedPage.id)}
                  disabled={sequence.pages.length <= 1}
                  className="ml-auto flex items-center gap-1 rounded px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-gray-500">
              <Eye className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p>Select a page to edit its settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Suppress unused variable warnings
void Settings;
void Link;
void Unlink;

export type { MockupPage, MockupSequence, MockupSequencerProps, TransitionType };
