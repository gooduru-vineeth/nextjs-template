'use client';

import { Check, Copy, Hash, Plus, Sparkles, TrendingUp, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type Hashtag = {
  id: string;
  tag: string;
  count?: number;
  trending?: boolean;
};

export type HashtagEditorProps = {
  variant?: 'full' | 'compact' | 'inline' | 'suggestions';
  hashtags?: Hashtag[];
  onChange?: (hashtags: Hashtag[]) => void;
  maxHashtags?: number;
  suggestedHashtags?: Hashtag[];
  showTrending?: boolean;
  showCounts?: boolean;
  placeholder?: string;
  className?: string;
};

const defaultSuggestions: Hashtag[] = [
  { id: '1', tag: 'design', count: 125000000, trending: true },
  { id: '2', tag: 'ux', count: 45000000, trending: true },
  { id: '3', tag: 'ui', count: 38000000 },
  { id: '4', tag: 'webdesign', count: 28000000 },
  { id: '5', tag: 'creative', count: 95000000, trending: true },
  { id: '6', tag: 'inspiration', count: 72000000 },
  { id: '7', tag: 'branding', count: 34000000 },
  { id: '8', tag: 'product', count: 23000000 },
  { id: '9', tag: 'startup', count: 18000000 },
  { id: '10', tag: 'tech', count: 89000000, trending: true },
];

const HashtagEditor: React.FC<HashtagEditorProps> = ({
  variant = 'full',
  hashtags = [],
  onChange,
  maxHashtags = 30,
  suggestedHashtags = defaultSuggestions,
  showTrending = true,
  showCounts = true,
  placeholder = 'Add hashtags...',
  className = '',
}) => {
  const [tags, setTags] = useState<Hashtag[]>(hashtags);
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(hashtags);
  }, [hashtags]);

  const formatCount = (count: number): string => {
    if (count >= 1000000000) {
      return `${(count / 1000000000).toFixed(1)}B`;
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const addHashtag = useCallback((tag: string) => {
    if (tags.length >= maxHashtags) {
      return;
    }

    const cleanTag = tag.replace(/^#/, '').replace(/\W/g, '').toLowerCase();
    if (!cleanTag) {
      return;
    }

    if (tags.some(t => t.tag.toLowerCase() === cleanTag)) {
      return;
    }

    const newTag: Hashtag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      tag: cleanTag,
    };

    const newTags = [...tags, newTag];
    setTags(newTags);
    onChange?.(newTags);
    setInputValue('');
  }, [tags, maxHashtags, onChange]);

  const removeHashtag = useCallback((id: string) => {
    const newTags = tags.filter(t => t.id !== id);
    setTags(newTags);
    onChange?.(newTags);
  }, [tags, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addHashtag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeHashtag(tags[tags.length - 1]!.id);
    }
  }, [inputValue, tags, addHashtag, removeHashtag]);

  const copyHashtags = useCallback(async () => {
    const hashtagString = tags.map(t => `#${t.tag}`).join(' ');
    await navigator.clipboard.writeText(hashtagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tags]);

  const addSuggestion = useCallback((suggestion: Hashtag) => {
    if (tags.some(t => t.tag.toLowerCase() === suggestion.tag.toLowerCase())) {
      return;
    }
    if (tags.length >= maxHashtags) {
      return;
    }

    const newTags = [...tags, { ...suggestion, id: `tag-${Date.now()}` }];
    setTags(newTags);
    onChange?.(newTags);
  }, [tags, maxHashtags, onChange]);

  const availableSuggestions = suggestedHashtags.filter(
    s => !tags.some(t => t.tag.toLowerCase() === s.tag.toLowerCase()),
  );

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-1 ${className}`}>
        {tags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          >
            #
            {tag.tag}
            <button
              onClick={() => removeHashtag(tag.id)}
              className="hover:text-red-500"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[80px] flex-1 border-none bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
        />
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
          <Hash size={14} className="text-gray-400" />
          {tags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              {tag.tag}
              <button
                onClick={() => removeHashtag(tag.id)}
                className="hover:text-red-500"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="min-w-[60px] flex-1 border-none bg-transparent text-xs text-gray-700 outline-none dark:text-gray-300"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {tags.length}
            /
            {maxHashtags}
            {' '}
            hashtags
          </span>
          {tags.length > 0 && (
            <button onClick={copyHashtags} className="flex items-center gap-1 hover:text-blue-600">
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Suggestions variant
  if (variant === 'suggestions') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Current hashtags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                #
                {tag.tag}
                <button
                  onClick={() => removeHashtag(tag.id)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggestions */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Sparkles size={12} />
            Suggested
          </div>
          <div className="flex flex-wrap gap-1">
            {availableSuggestions.slice(0, 8).map(suggestion => (
              <button
                key={suggestion.id}
                onClick={() => addSuggestion(suggestion)}
                disabled={tags.length >= maxHashtags}
                className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                #
                {suggestion.tag}
                {suggestion.trending && showTrending && (
                  <TrendingUp size={10} className="text-orange-500" />
                )}
                {showCounts && suggestion.count && (
                  <span className="text-xs text-gray-400">{formatCount(suggestion.count)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
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
            <Hash size={18} />
            Hashtags
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {tags.length}
              /
              {maxHashtags}
            </span>
            {tags.length > 0 && (
              <button
                onClick={copyHashtags}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy all'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          {tags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            >
              #
              {tag.tag}
              <button
                onClick={() => removeHashtag(tag.id)}
                className="transition-colors hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="min-w-[100px] flex-1 border-none bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
          />
          {inputValue && (
            <button
              onClick={() => addHashtag(inputValue)}
              className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Press Enter, comma, or space to add a hashtag
        </p>
      </div>

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Sparkles size={14} className="text-purple-500" />
            Suggested Hashtags
          </div>

          {/* Trending */}
          {showTrending && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <TrendingUp size={12} />
                Trending
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSuggestions
                  .filter(s => s.trending)
                  .slice(0, 5)
                  .map(suggestion => (
                    <button
                      key={suggestion.id}
                      onClick={() => addSuggestion(suggestion)}
                      disabled={tags.length >= maxHashtags}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 text-sm text-orange-700 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
                    >
                      <TrendingUp size={12} />
                      #
                      {suggestion.tag}
                      {showCounts && suggestion.count && (
                        <span className="text-xs opacity-70">{formatCount(suggestion.count)}</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* All suggestions */}
          <div className="flex flex-wrap gap-2">
            {availableSuggestions
              .filter(s => !s.trending)
              .slice(0, 10)
              .map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => addSuggestion(suggestion)}
                  disabled={tags.length >= maxHashtags}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  #
                  {suggestion.tag}
                  {showCounts && suggestion.count && (
                    <span className="text-xs opacity-60">{formatCount(suggestion.count)}</span>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HashtagEditor;
