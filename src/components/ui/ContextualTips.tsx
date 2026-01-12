'use client';

import {
  ChevronRight,
  Info,
  Keyboard,
  Lightbulb,
  Target,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
type TipCategory = 'feature' | 'shortcut' | 'productivity' | 'tip';
type TipPosition = 'top' | 'bottom' | 'left' | 'right';
type TipTrigger = 'hover' | 'click' | 'focus' | 'auto';

type Tip = {
  id: string;
  title: string;
  description: string;
  category: TipCategory;
  shortcut?: string;
  learnMoreUrl?: string;
  relatedTips?: string[];
  dismissible?: boolean;
  showOnce?: boolean;
};

type ContextualTipProps = {
  tip: Tip;
  position?: TipPosition;
  trigger?: TipTrigger;
  children?: React.ReactNode;
  onDismiss?: (tipId: string) => void;
  onAction?: (tipId: string) => void;
  className?: string;
};

type ContextualTipsProviderProps = {
  children: React.ReactNode;
  tips?: Tip[];
  onTipDismiss?: (tipId: string) => void;
};

// Default tips
const defaultTips: Tip[] = [
  {
    id: 'save-shortcut',
    title: 'Quick Save',
    description: 'Press ⌘+S to save your mockup instantly',
    category: 'shortcut',
    shortcut: '⌘+S',
    dismissible: true,
  },
  {
    id: 'export-shortcut',
    title: 'Quick Export',
    description: 'Use ⌘+Shift+E to export your mockup as PNG',
    category: 'shortcut',
    shortcut: '⌘+Shift+E',
    dismissible: true,
  },
  {
    id: 'duplicate-message',
    title: 'Duplicate Messages',
    description: 'Hold Option and drag a message to duplicate it',
    category: 'productivity',
    dismissible: true,
  },
  {
    id: 'dark-mode',
    title: 'Dark Mode',
    description: 'Toggle between light and dark mode in mockups for different presentations',
    category: 'feature',
    dismissible: true,
  },
  {
    id: 'templates-tip',
    title: 'Start with Templates',
    description: 'Browse our template library to get started faster',
    category: 'tip',
    learnMoreUrl: '/templates',
    dismissible: true,
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Press ? to view all available keyboard shortcuts',
    category: 'shortcut',
    shortcut: '?',
    dismissible: true,
  },
  {
    id: 'undo-redo',
    title: 'Undo & Redo',
    description: 'Made a mistake? Use ⌘+Z to undo, ⌘+Shift+Z to redo',
    category: 'shortcut',
    shortcut: '⌘+Z',
    dismissible: true,
  },
  {
    id: 'zoom-controls',
    title: 'Zoom Controls',
    description: 'Use ⌘+Plus/Minus to zoom in/out. ⌘+0 to fit to screen',
    category: 'shortcut',
    shortcut: '⌘+0',
    dismissible: true,
  },
];

const categoryIcons: Record<TipCategory, React.ReactNode> = {
  feature: <Target className="h-4 w-4" />,
  shortcut: <Keyboard className="h-4 w-4" />,
  productivity: <Zap className="h-4 w-4" />,
  tip: <Lightbulb className="h-4 w-4" />,
};

const categoryColors: Record<TipCategory, string> = {
  feature: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  shortcut: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  productivity: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  tip: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
};

// Single contextual tip component
export function ContextualTip({
  tip,
  position = 'bottom',
  trigger = 'hover',
  children,
  onDismiss,
  onAction,
  className = '',
}: ContextualTipProps) {
  const [isVisible, setIsVisible] = useState(trigger === 'auto');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (trigger === 'auto' && tip.showOnce) {
      const dismissedTips = JSON.parse(localStorage.getItem('dismissedTips') || '[]');
      if (dismissedTips.includes(tip.id)) {
        setIsDismissed(true);
        setIsVisible(false);
      }
    }
  }, [tip.id, tip.showOnce, trigger]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setIsDismissed(true);
    if (tip.showOnce) {
      const dismissedTips = JSON.parse(localStorage.getItem('dismissedTips') || '[]');
      localStorage.setItem('dismissedTips', JSON.stringify([...dismissedTips, tip.id]));
    }
    onDismiss?.(tip.id);
  }, [tip.id, tip.showOnce, onDismiss]);

  const handleAction = useCallback(() => {
    onAction?.(tip.id);
    if (tip.learnMoreUrl) {
      window.open(tip.learnMoreUrl, '_blank');
    }
  }, [tip.id, tip.learnMoreUrl, onAction]);

  const positionClasses: Record<TipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses: Record<TipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-gray-700 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-gray-700 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-gray-700 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-gray-700 border-y-transparent border-l-transparent',
  };

  if (isDismissed) {
    return <>{children}</>;
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => trigger === 'hover' && setIsVisible(true)}
      onMouseLeave={() => trigger === 'hover' && setIsVisible(false)}
      onFocus={() => trigger === 'focus' && setIsVisible(true)}
      onBlur={() => trigger === 'focus' && setIsVisible(false)}
      onClick={() => trigger === 'click' && setIsVisible(!isVisible)}
    >
      {children}

      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="max-w-xs rounded-lg bg-gray-800 p-3 text-white shadow-lg dark:bg-gray-700">
            {/* Arrow */}
            <div className={`absolute h-0 w-0 border-[6px] ${arrowClasses[position]}`} />

            {/* Header */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`rounded p-1 ${categoryColors[tip.category]}`}>
                  {categoryIcons[tip.category]}
                </span>
                <span className="text-sm font-medium">{tip.title}</span>
              </div>
              {tip.dismissible && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Description */}
            <p className="mb-2 text-sm text-gray-300">{tip.description}</p>

            {/* Shortcut badge */}
            {tip.shortcut && (
              <div className="mb-2 flex items-center gap-2">
                <kbd className="rounded border border-gray-600 bg-gray-700 px-2 py-0.5 text-xs">
                  {tip.shortcut}
                </kbd>
              </div>
            )}

            {/* Action */}
            {tip.learnMoreUrl && (
              <button
                onClick={handleAction}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
              >
                Learn more
                {' '}
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Tips manager component
export function TipsManager({
  variant = 'floating',
  tips = defaultTips,
  maxTips = 3,
  onDismiss,
  onDismissAll,
  className = '',
}: {
  variant?: 'floating' | 'sidebar' | 'banner';
  tips?: Tip[];
  maxTips?: number;
  onDismiss?: (tipId: string) => void;
  onDismissAll?: () => void;
  className?: string;
}) {
  const [visibleTips, setVisibleTips] = useState<Tip[]>(tips.slice(0, maxTips));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDismiss = useCallback((tipId: string) => {
    setVisibleTips(prev => prev.filter(t => t.id !== tipId));
    onDismiss?.(tipId);
  }, [onDismiss]);

  const handleDismissAll = useCallback(() => {
    setVisibleTips([]);
    onDismissAll?.();
  }, [onDismissAll]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % visibleTips.length);
  }, [visibleTips.length]);

  if (visibleTips.length === 0) {
    return null;
  }

  // Banner variant
  if (variant === 'banner') {
    const tip = visibleTips[currentIndex]!;
    return (
      <div className={`bg-blue-600 px-4 py-2 text-white ${className}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5" />
            <span className="font-medium">
              {tip.title}
              :
            </span>
            <span className="text-blue-100">{tip.description}</span>
            {tip.shortcut && (
              <kbd className="rounded bg-blue-700 px-2 py-0.5 text-xs">{tip.shortcut}</kbd>
            )}
          </div>
          <div className="flex items-center gap-2">
            {visibleTips.length > 1 && (
              <button onClick={handleNext} className="text-sm text-blue-200 hover:text-white">
                Next tip (
                {currentIndex + 1}
                /
                {visibleTips.length}
                )
              </button>
            )}
            <button
              onClick={() => handleDismiss(tip.id)}
              className="text-blue-200 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Tips & Tricks
          </h3>
          <button
            onClick={handleDismissAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Dismiss all
          </button>
        </div>
        <div className="space-y-3">
          {visibleTips.map(tip => (
            <div
              key={tip.id}
              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded p-1 ${categoryColors[tip.category]}`}>
                    {categoryIcons[tip.category]}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{tip.title}</span>
                </div>
                <button
                  onClick={() => handleDismiss(tip.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="ml-8 text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
              {tip.shortcut && (
                <kbd className="mt-2 ml-8 inline-block rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                  {tip.shortcut}
                </kbd>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Floating variant (default)
  return (
    <div className={`fixed right-4 bottom-4 z-40 ${className}`}>
      <div className="max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Tip of the moment
          </span>
          <button
            onClick={() => handleDismiss(visibleTips[currentIndex]!.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3">
          <p className="mb-1 font-medium text-gray-900 dark:text-white">
            {visibleTips[currentIndex]!.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {visibleTips[currentIndex]!.description}
          </p>
          {visibleTips[currentIndex]!.shortcut && (
            <kbd className="mt-2 inline-block rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {visibleTips[currentIndex]!.shortcut}
            </kbd>
          )}
        </div>

        {visibleTips.length > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {visibleTips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    i === currentIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Next tip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Context provider for tips
export function ContextualTipsProvider({
  children,
  tips = defaultTips,
  onTipDismiss,
}: ContextualTipsProviderProps) {
  void tips;
  void onTipDismiss;

  return <>{children}</>;
}

// Suppress unused variable warnings
void Info;

export default TipsManager;
export type { ContextualTipProps, Tip, TipCategory };
