'use client';

import { Check, ChevronLeft, ChevronRight, Copy, Edit2, Plus, RefreshCw, Sparkles, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ResponseVariation = {
  id: string;
  content: string;
  tone?: 'formal' | 'casual' | 'technical' | 'creative' | 'concise';
  rating?: number;
  selected?: boolean;
  timestamp?: string;
};

export type ResponseVariationsProps = {
  variant?: 'full' | 'compact' | 'carousel' | 'compare' | 'inline';
  variations?: ResponseVariation[];
  onChange?: (variations: ResponseVariation[]) => void;
  onSelect?: (variation: ResponseVariation) => void;
  maxVariations?: number;
  showRatings?: boolean;
  showTones?: boolean;
  editable?: boolean;
  className?: string;
};

const defaultVariations: ResponseVariation[] = [
  {
    id: '1',
    content: 'React hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8.',
    tone: 'technical',
    rating: 4,
  },
  {
    id: '2',
    content: 'Think of React hooks as special tools that give your functional components superpowers! They let you add memory (state) and side effects without writing complex class code.',
    tone: 'casual',
    rating: 5,
  },
  {
    id: '3',
    content: 'Hooks enable state management in functional components.',
    tone: 'concise',
    rating: 3,
  },
];

const toneLabels: Record<string, { label: string; color: string }> = {
  formal: { label: 'Formal', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  casual: { label: 'Casual', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  technical: { label: 'Technical', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  creative: { label: 'Creative', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  concise: { label: 'Concise', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};

const ResponseVariations: React.FC<ResponseVariationsProps> = ({
  variant = 'full',
  variations = defaultVariations,
  onChange,
  onSelect,
  maxVariations = 5,
  showRatings = true,
  showTones = true,
  editable = false,
  className = '',
}) => {
  const [variationList, setVariationList] = useState<ResponseVariation[]>(variations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setVariationList(variations);
  }, [variations]);

  const selectVariation = useCallback((variation: ResponseVariation) => {
    const newVariations = variationList.map(v => ({
      ...v,
      selected: v.id === variation.id,
    }));
    setVariationList(newVariations);
    onChange?.(newVariations);
    onSelect?.(variation);
  }, [variationList, onChange, onSelect]);

  const rateVariation = useCallback((id: string, rating: number) => {
    const newVariations = variationList.map(v =>
      v.id === id ? { ...v, rating } : v,
    );
    setVariationList(newVariations);
    onChange?.(newVariations);
  }, [variationList, onChange]);

  const copyContent = useCallback((variation: ResponseVariation) => {
    navigator.clipboard.writeText(variation.content);
    setCopiedId(variation.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const deleteVariation = useCallback((id: string) => {
    const newVariations = variationList.filter(v => v.id !== id);
    setVariationList(newVariations);
    onChange?.(newVariations);
    if (currentIndex >= newVariations.length) {
      setCurrentIndex(Math.max(0, newVariations.length - 1));
    }
  }, [variationList, onChange, currentIndex]);

  const addVariation = useCallback(() => {
    if (variationList.length >= maxVariations) {
      return;
    }
    const newVariation: ResponseVariation = {
      id: `var-${Date.now()}`,
      content: 'New response variation...',
      tone: 'casual',
    };
    const newVariations = [...variationList, newVariation];
    setVariationList(newVariations);
    onChange?.(newVariations);
    setCurrentIndex(newVariations.length - 1);
  }, [variationList, maxVariations, onChange]);

  const updateContent = useCallback((id: string, content: string) => {
    const newVariations = variationList.map(v =>
      v.id === id ? { ...v, content } : v,
    );
    setVariationList(newVariations);
    onChange?.(newVariations);
  }, [variationList, onChange]);

  const nextVariation = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % variationList.length);
  }, [variationList.length]);

  const prevVariation = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + variationList.length) % variationList.length);
  }, [variationList.length]);

  // Inline variant - simple text with navigation
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={prevVariation}
          disabled={variationList.length <= 1}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-300"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1}
          /
          {variationList.length}
        </span>
        <button
          onClick={nextVariation}
          disabled={variationList.length <= 1}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-300"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => copyContent(variationList[currentIndex]!)}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {copiedId === variationList[currentIndex]?.id ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    );
  }

  // Carousel variant
  if (variant === 'carousel') {
    const currentVariation = variationList[currentIndex];
    if (!currentVariation) {
      return null;
    }

    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        {/* Navigation */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Variation
              {' '}
              {currentIndex + 1}
              {' '}
              of
              {' '}
              {variationList.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevVariation}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextVariation}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-3 rounded-lg bg-white p-4 dark:bg-gray-800">
          <p className="text-gray-700 dark:text-gray-300">{currentVariation.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showTones && currentVariation.tone && (
              <span className={`rounded px-2 py-0.5 text-xs ${toneLabels[currentVariation.tone]?.color}`}>
                {toneLabels[currentVariation.tone]?.label}
              </span>
            )}
            {showRatings && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => rateVariation(currentVariation.id, star)}
                    className={`text-sm ${
                      (currentVariation.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyContent(currentVariation)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {copiedId === currentVariation.id ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={() => selectVariation(currentVariation)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                currentVariation.selected
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {currentVariation.selected ? 'Selected' : 'Use This'}
            </button>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="mt-3 flex items-center justify-center gap-1">
          {variationList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? 'w-4 bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Compare variant - side by side
  if (variant === 'compare') {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {variationList.slice(0, 2).map(variation => (
          <div
            key={variation.id}
            className={`rounded-xl border-2 bg-white transition-all dark:bg-gray-800 ${
              variation.selected
                ? 'border-green-500'
                : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
            }`}
          >
            <div className="p-4">
              {showTones && variation.tone && (
                <span className={`mb-2 inline-block rounded px-2 py-0.5 text-xs ${toneLabels[variation.tone]?.color}`}>
                  {toneLabels[variation.tone]?.label}
                </span>
              )}
              <p className="line-clamp-6 text-sm text-gray-700 dark:text-gray-300">
                {variation.content}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 p-3 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rateVariation(variation.id, (variation.rating || 0) > 0 ? 0 : 5)}
                  className={`rounded p-1.5 ${
                    (variation.rating || 0) > 3
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => rateVariation(variation.id, (variation.rating || 0) < 3 ? 5 : 1)}
                  className={`rounded p-1.5 ${
                    (variation.rating || 0) > 0 && (variation.rating || 0) < 3
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
              <button
                onClick={() => selectVariation(variation)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  variation.selected
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {variation.selected ? 'Selected' : 'Choose'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {variationList.map((variation, index) => (
          <div
            key={variation.id}
            className={`cursor-pointer rounded-lg border p-3 transition-all ${
              variation.selected
                ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'
            }`}
            onClick={() => selectVariation(variation)}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {index + 1}
              </span>
              <p className="line-clamp-2 flex-1 text-sm text-gray-700 dark:text-gray-300">
                {variation.content}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyContent(variation);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {copiedId === variation.id ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <RefreshCw size={18} />
            Response Variations
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {variationList.length}
              {' '}
              variations
            </span>
            {editable && variationList.length < maxVariations && (
              <button
                onClick={addVariation}
                className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Variations list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {variationList.map((variation, index) => (
          <div
            key={variation.id}
            className={`p-4 transition-colors ${
              variation.selected ? 'bg-green-50 dark:bg-green-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex gap-4">
              {/* Number */}
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-medium ${
                variation.selected
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
              >
                {index + 1}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {/* Tone badge */}
                {showTones && variation.tone && (
                  <span className={`mb-2 inline-block rounded px-2 py-0.5 text-xs ${toneLabels[variation.tone]?.color}`}>
                    {toneLabels[variation.tone]?.label}
                  </span>
                )}

                {/* Text */}
                {editingId === variation.id
                  ? (
                      <textarea
                        value={variation.content}
                        onChange={e => updateContent(variation.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        className="w-full resize-none rounded border border-gray-200 bg-gray-100 p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                        rows={3}
                        autoFocus
                      />
                    )
                  : (
                      <p className="text-gray-700 dark:text-gray-300">{variation.content}</p>
                    )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Rating */}
                    {showRatings && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => rateVariation(variation.id, Math.max(1, (variation.rating || 0) - 1))}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <ThumbsDown size={14} />
                        </button>
                        <span className="w-4 text-center text-sm text-gray-500">
                          {variation.rating || '-'}
                        </span>
                        <button
                          onClick={() => rateVariation(variation.id, Math.min(5, (variation.rating || 0) + 1))}
                          className="p-1 text-gray-400 hover:text-green-500"
                        >
                          <ThumbsUp size={14} />
                        </button>
                      </div>
                    )}

                    {/* Timestamp */}
                    {variation.timestamp && (
                      <span className="text-xs text-gray-400">{variation.timestamp}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyContent(variation)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      title="Copy"
                    >
                      {copiedId === variation.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    {editable && (
                      <>
                        <button
                          onClick={() => setEditingId(variation.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteVariation(variation.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => selectVariation(variation)}
                      className={`ml-2 rounded-lg px-3 py-1.5 text-sm ${
                        variation.selected
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {variation.selected ? 'Selected' : 'Use This'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate more */}
      {editable && variationList.length < maxVariations && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <button
            onClick={addVariation}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Sparkles size={16} />
            Generate More Variations
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponseVariations;
