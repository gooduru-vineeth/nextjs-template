'use client';

import { useState } from 'react';

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
};

const emojiCategories = {
  Smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '☺️',
    '😚',
    '😙',
    '🥲',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '😮‍💨',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🥴',
    '😵',
    '🤯',
    '🤠',
    '🥳',
    '🥸',
    '😎',
  ],
  Gestures: [
    '👋',
    '🤚',
    '🖐️',
    '✋',
    '🖖',
    '👌',
    '🤌',
    '🤏',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '☝️',
    '👍',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💅',
    '🤳',
    '💪',
    '🦾',
    '🦿',
    '🦵',
    '🦶',
    '👂',
  ],
  Hearts: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '💟',
    '❤️‍🔥',
    '❤️‍🩹',
    '💋',
    '💯',
    '🔥',
    '✨',
    '⭐',
    '🌟',
    '💫',
    '🎉',
    '🎊',
  ],
  Objects: [
    '📱',
    '💻',
    '⌨️',
    '🖥️',
    '🖨️',
    '🖱️',
    '💿',
    '📀',
    '🎥',
    '📷',
    '📹',
    '📺',
    '📻',
    '🎙️',
    '🎚️',
    '🎛️',
    '⏱️',
    '⏲️',
    '⏰',
    '🕰️',
    '📞',
    '☎️',
    '📟',
    '📠',
    '📧',
    '📨',
    '📩',
    '📮',
    '📦',
    '🏷️',
    '📝',
    '📁',
    '📂',
    '📅',
    '📆',
    '📇',
    '📈',
    '📉',
    '📊',
    '📋',
  ],
  Symbols: [
    '✅',
    '✔️',
    '❌',
    '❎',
    '➕',
    '➖',
    '➗',
    '✖️',
    '💲',
    '💱',
    '©️',
    '®️',
    '™️',
    '🔘',
    '🔴',
    '🟠',
    '🟡',
    '🟢',
    '🔵',
    '🟣',
    '⚫',
    '⚪',
    '🟤',
    '🔺',
    '🔻',
    '🔷',
    '🔶',
    '🔹',
    '🔸',
    '▪️',
  ],
};

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>('Smileys');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmojis = searchTerm
    ? Object.values(emojiCategories).flat().filter(() => true)
    : emojiCategories[activeCategory];

  return (
    <div className="w-72 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Header with search */}
      <div className="border-b border-gray-200 p-2 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search emoji..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {!searchTerm && (
        <div className="flex gap-1 border-b border-gray-200 p-1 dark:border-gray-700">
          {Object.keys(emojiCategories).map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category as keyof typeof emojiCategories)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div className="grid max-h-48 grid-cols-8 gap-1 overflow-y-auto p-2">
        {filteredEmojis.map((emoji, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(emoji)}
            className="flex size-8 items-center justify-center rounded text-xl hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
