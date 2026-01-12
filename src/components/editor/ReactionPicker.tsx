'use client';

import type { MessageReaction } from '@/types/Mockup';
import { useState } from 'react';

// Common reaction emojis
const REACTION_EMOJIS = [
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💯', label: '100' },
  { emoji: '✅', label: 'Check' },
  { emoji: '👀', label: 'Eyes' },
];

type ReactionPickerProps = {
  reactions: MessageReaction[];
  onReactionsChange: (reactions: MessageReaction[]) => void;
};

export function ReactionPicker({ reactions, onReactionsChange }: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingReaction, setEditingReaction] = useState<{ emoji: string; count: number } | null>(null);

  const addReaction = (emoji: string) => {
    const existingIndex = reactions.findIndex(r => r.emoji === emoji);
    if (existingIndex >= 0) {
      // Increment count
      const newReactions = [...reactions];
      newReactions[existingIndex] = {
        ...newReactions[existingIndex]!,
        count: newReactions[existingIndex]!.count + 1,
      };
      onReactionsChange(newReactions);
    } else {
      // Add new reaction
      onReactionsChange([...reactions, { emoji, count: 1 }]);
    }
    setIsOpen(false);
  };

  const updateReactionCount = (emoji: string, newCount: number) => {
    if (newCount <= 0) {
      // Remove reaction
      onReactionsChange(reactions.filter(r => r.emoji !== emoji));
    } else {
      // Update count
      const newReactions = reactions.map(r =>
        r.emoji === emoji ? { ...r, count: newCount } : r,
      );
      onReactionsChange(newReactions);
    }
    setEditingReaction(null);
  };

  const removeReaction = (emoji: string) => {
    onReactionsChange(reactions.filter(r => r.emoji !== emoji));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Reactions
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Reaction
        </button>
      </div>

      {/* Current Reactions */}
      {reactions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {reactions.map(reaction => (
            <div
              key={reaction.emoji}
              className="group relative flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700"
            >
              <span className="text-sm">{reaction.emoji}</span>
              {editingReaction?.emoji === reaction.emoji
                ? (
                    <input
                      type="number"
                      min="1"
                      max="999"
                      value={editingReaction.count}
                      onChange={e => setEditingReaction({ ...editingReaction, count: Number.parseInt(e.target.value) || 1 })}
                      onBlur={() => updateReactionCount(reaction.emoji, editingReaction.count)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateReactionCount(reaction.emoji, editingReaction.count);
                        }
                        if (e.key === 'Escape') {
                          setEditingReaction(null);
                        }
                      }}
                      className="w-10 rounded border border-gray-300 bg-white px-1 py-0.5 text-center text-xs dark:border-gray-600 dark:bg-gray-800"
                      autoFocus
                    />
                  )
                : (
                    <button
                      type="button"
                      onClick={() => setEditingReaction({ emoji: reaction.emoji, count: reaction.count })}
                      className="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                      {reaction.count}
                    </button>
                  )}
              <button
                type="button"
                onClick={() => removeReaction(reaction.emoji)}
                className="ml-1 rounded-full p-0.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-200 hover:text-red-500 dark:hover:bg-gray-600"
                title="Remove reaction"
              >
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reaction Picker Dropdown */}
      {isOpen && (
        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="grid grid-cols-6 gap-1">
            {REACTION_EMOJIS.map(({ emoji, label }) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addReaction(emoji)}
                className="flex size-8 items-center justify-center rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={label}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Custom emoji input */}
          <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Custom emoji"
                maxLength={2}
                className="flex-1 rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    addReaction(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview of how reactions will appear */}
      {reactions.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-2 text-xs text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
          Preview: Reactions will appear below the message bubble
        </div>
      )}
    </div>
  );
}
