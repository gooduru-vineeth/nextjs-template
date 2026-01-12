'use client';

import { useState } from 'react';

type Reaction = {
  emoji: string;
  label: string;
  count?: number;
  users?: string[];
  isSelected?: boolean;
};

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

// Platform-specific quick reactions
const platformReactions: Record<Platform, string[]> = {
  whatsapp: ['👍', '❤️', '😂', '😮', '😢', '🙏'],
  imessage: ['❤️', '👍', '👎', '😂', '‼️', '❓'],
  messenger: ['❤️', '😆', '😮', '😢', '😠', '👍'],
  telegram: ['👍', '❤️', '🔥', '🎉', '😢', '💩'],
  discord: ['👍', '❤️', '😂', '🎉', '🤔', '👀'],
  slack: ['👍', '❤️', '😂', '🎉', '👀', '✅'],
  generic: ['👍', '❤️', '😂', '😮', '😢', '🎉'],
};

// Extended emoji categories
const emojiCategories = [
  {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐'],
  },
  {
    name: 'Gestures',
    emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏'],
  },
  {
    name: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  },
  {
    name: 'Symbols',
    emojis: ['✅', '❌', '❓', '❗', '‼️', '⭐', '🌟', '💫', '✨', '⚡', '🔥', '💯', '💢', '💬', '💭', '🎉', '🎊', '🏆', '🥇', '🏅'],
  },
  {
    name: 'Animals',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧'],
  },
  {
    name: 'Food',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍕', '🍔', '🍟'],
  },
];

type ReactionPickerProps = {
  platform?: Platform;
  onSelect: (emoji: string) => void;
  showExtended?: boolean;
  className?: string;
};

export function ReactionPicker({
  platform = 'generic',
  onSelect,
  showExtended = false,
  className = '',
}: ReactionPickerProps) {
  const [isExtendedOpen, setIsExtendedOpen] = useState(showExtended);
  const [activeCategory, setActiveCategory] = useState(0);

  const quickReactions = platformReactions[platform];

  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Quick reactions */}
      <div className="flex items-center gap-1 p-2">
        {quickReactions.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="rounded-full p-2 text-xl transition-transform hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {emoji}
          </button>
        ))}
        <button
          onClick={() => setIsExtendedOpen(!isExtendedOpen)}
          className="ml-1 rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Extended picker */}
      {isExtendedOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-gray-200 p-2 dark:border-gray-700">
            {emojiCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === index
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="h-48 overflow-y-auto p-2">
            <div className="grid grid-cols-8 gap-1">
              {(emojiCategories[activeCategory]?.emojis ?? []).map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelect(emoji);
                    setIsExtendedOpen(false);
                  }}
                  className="rounded p-1.5 text-xl transition-transform hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline reaction display (shown below messages)
type ReactionDisplayProps = {
  reactions: Reaction[];
  platform?: Platform;
  onReactionClick?: (emoji: string) => void;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeConfig = {
  sm: { container: 'gap-0.5', pill: 'px-1.5 py-0.5 text-xs', emoji: 'text-sm' },
  md: { container: 'gap-1', pill: 'px-2 py-1 text-xs', emoji: 'text-base' },
  lg: { container: 'gap-1.5', pill: 'px-2.5 py-1.5 text-sm', emoji: 'text-lg' },
};

export function ReactionDisplay({
  reactions,
  platform: _platform = 'generic',
  onReactionClick,
  maxVisible = 5,
  size = 'md',
  className = '',
}: ReactionDisplayProps) {
  void _platform; // Reserved for future platform-specific styling
  const [showAll, setShowAll] = useState(false);
  const sizeStyle = sizeConfig[size];

  const visibleReactions = showAll ? reactions : reactions.slice(0, maxVisible);
  const hiddenCount = reactions.length - maxVisible;

  if (reactions.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center ${sizeStyle.container} ${className}`}>
      {visibleReactions.map((reaction, index) => (
        <button
          key={index}
          onClick={() => onReactionClick?.(reaction.emoji)}
          className={`flex items-center ${sizeStyle.pill} rounded-full transition-colors ${
            reaction.isSelected
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
          title={reaction.users?.join(', ')}
        >
          <span className={sizeStyle.emoji}>{reaction.emoji}</span>
          {reaction.count && reaction.count > 1 && (
            <span className="ml-1 font-medium">{reaction.count}</span>
          )}
        </button>
      ))}
      {!showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className={`${sizeStyle.pill} rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600`}
        >
          +
          {hiddenCount}
        </button>
      )}
    </div>
  );
}

// Compact reaction picker (floating bubble style)
type FloatingReactionPickerProps = {
  platform?: Platform;
  onSelect: (emoji: string) => void;
  position?: 'above' | 'below';
  className?: string;
};

export function FloatingReactionPicker({
  platform = 'generic',
  onSelect,
  position = 'above',
  className = '',
}: FloatingReactionPickerProps) {
  const quickReactions = platformReactions[platform];

  return (
    <div
      className={`absolute ${position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 flex items-center gap-0.5 rounded-full border border-gray-200 bg-white px-1 py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {quickReactions.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onSelect(emoji)}
          className="rounded-full p-1.5 text-lg transition-transform hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

// Slack-style reaction with user names
type DetailedReactionProps = {
  reactions: Reaction[];
  currentUser?: string;
  onAdd: (emoji: string) => void;
  onRemove: (emoji: string) => void;
  className?: string;
};

export function DetailedReactionDisplay({
  reactions,
  currentUser,
  onAdd,
  onRemove,
  className = '',
}: DetailedReactionProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    if (reaction?.users?.includes(currentUser || '')) {
      onRemove(emoji);
    } else {
      onAdd(emoji);
    }
  };

  return (
    <div className={`relative flex flex-wrap items-center gap-1 ${className}`}>
      {reactions.map((reaction, index) => {
        const isMyReaction = reaction.users?.includes(currentUser || '');
        return (
          <button
            key={index}
            onClick={() => handleReactionClick(reaction.emoji)}
            className={`group flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-colors ${
              isMyReaction
                ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
            }`}
            title={reaction.users?.join(', ')}
          >
            <span className="text-sm">{reaction.emoji}</span>
            <span className="font-medium text-gray-600 dark:text-gray-400">
              {reaction.count || reaction.users?.length || 1}
            </span>
          </button>
        );
      })}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center justify-center rounded border border-dashed border-gray-300 px-2 py-0.5 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {showPicker && (
          <div className="absolute bottom-full left-0 z-10 mb-2">
            <ReactionPicker
              onSelect={(emoji) => {
                onAdd(emoji);
                setShowPicker(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export type { Reaction };
