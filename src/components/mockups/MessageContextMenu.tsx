'use client';

import { useEffect, useRef, useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
};

type MessageContextMenuProps = {
  isOpen: boolean;
  position: { x: number; y: number };
  platform?: Platform;
  sender?: 'sent' | 'received';
  messageType?: 'text' | 'image' | 'video' | 'audio' | 'document';
  onClose: () => void;
  onAction: (actionId: string) => void;
  customItems?: MenuItem[];
  className?: string;
};

const defaultIcons = {
  reply: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  ),
  forward: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  copy: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  delete: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  edit: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  star: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  pin: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  info: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  download: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  react: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const getPlatformMenuItems = (
  platform: Platform,
  sender: 'sent' | 'received',
  messageType: string,
): MenuItem[] => {
  const common: MenuItem[] = [
    { id: 'reply', label: 'Reply', icon: defaultIcons.reply },
    { id: 'forward', label: 'Forward', icon: defaultIcons.forward },
    { id: 'copy', label: 'Copy', icon: defaultIcons.copy },
  ];

  if (platform === 'whatsapp') {
    return [
      { id: 'react', label: 'React', icon: defaultIcons.react },
      ...common,
      { id: 'star', label: 'Star', icon: defaultIcons.star },
      { id: 'info', label: 'Info', icon: defaultIcons.info },
      { id: 'divider', label: '', divider: true },
      { id: 'delete', label: 'Delete', icon: defaultIcons.delete, danger: true },
    ];
  }

  if (platform === 'imessage') {
    const items = [
      { id: 'react', label: 'Tapback', icon: defaultIcons.react },
      { id: 'reply', label: 'Reply', icon: defaultIcons.reply },
      { id: 'copy', label: 'Copy', icon: defaultIcons.copy },
    ];
    if (messageType === 'text' && sender === 'sent') {
      items.push({ id: 'edit', label: 'Edit', icon: defaultIcons.edit });
    }
    return items;
  }

  if (platform === 'messenger') {
    return [
      { id: 'react', label: 'React', icon: defaultIcons.react },
      ...common,
      { id: 'divider', label: '', divider: true },
      { id: 'delete', label: sender === 'sent' ? 'Unsend' : 'Remove', icon: defaultIcons.delete, danger: true },
    ];
  }

  if (platform === 'telegram') {
    const items: MenuItem[] = [
      { id: 'reply', label: 'Reply', icon: defaultIcons.reply },
      { id: 'forward', label: 'Forward', icon: defaultIcons.forward },
      { id: 'copy', label: 'Copy Text', icon: defaultIcons.copy },
      { id: 'pin', label: 'Pin', icon: defaultIcons.pin },
    ];
    if (sender === 'sent') {
      items.push({ id: 'edit', label: 'Edit', icon: defaultIcons.edit });
    }
    items.push(
      { id: 'divider', label: '', divider: true },
      { id: 'delete', label: 'Delete', icon: defaultIcons.delete, danger: true },
    );
    return items;
  }

  if (platform === 'discord') {
    return [
      { id: 'react', label: 'Add Reaction', icon: defaultIcons.react },
      { id: 'reply', label: 'Reply', icon: defaultIcons.reply },
      { id: 'copy', label: 'Copy Text', icon: defaultIcons.copy, shortcut: 'Ctrl+C' },
      { id: 'pin', label: 'Pin Message', icon: defaultIcons.pin },
      { id: 'divider', label: '', divider: true },
      { id: 'delete', label: 'Delete Message', icon: defaultIcons.delete, danger: true },
    ];
  }

  if (platform === 'slack') {
    return [
      { id: 'react', label: 'Add reaction...', icon: defaultIcons.react },
      { id: 'reply', label: 'Reply in thread', icon: defaultIcons.reply },
      { id: 'forward', label: 'Share message', icon: defaultIcons.forward },
      { id: 'pin', label: 'Pin to channel', icon: defaultIcons.pin },
      { id: 'divider', label: '', divider: true },
      { id: 'copy', label: 'Copy text', icon: defaultIcons.copy },
      { id: 'copy-link', label: 'Copy link', icon: defaultIcons.copy },
      { id: 'divider2', label: '', divider: true },
      { id: 'delete', label: 'Delete message', icon: defaultIcons.delete, danger: true },
    ];
  }

  // Generic
  return [
    ...common,
    { id: 'divider', label: '', divider: true },
    { id: 'delete', label: 'Delete', icon: defaultIcons.delete, danger: true },
  ];
};

export function MessageContextMenu({
  isOpen,
  position,
  platform = 'generic',
  sender = 'received',
  messageType = 'text',
  onClose,
  onAction,
  customItems,
  className = '',
}: MessageContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  const menuItems = customItems || getPlatformMenuItems(platform, sender, messageType);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10;
      }
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10;
      }

      setAdjustedPosition({ x, y });
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const getMenuStyle = () => {
    if (platform === 'discord') {
      return 'bg-[#18191c] text-[#dcddde] rounded-md';
    }
    if (platform === 'slack') {
      return 'bg-white dark:bg-[#1a1d21] text-gray-700 dark:text-gray-200 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700';
    }
    return 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700';
  };

  const getItemStyle = (item: MenuItem) => {
    const base = 'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors';

    if (item.danger) {
      return `${base} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`;
    }
    if (item.disabled) {
      return `${base} opacity-50 cursor-not-allowed`;
    }

    if (platform === 'discord') {
      return `${base} hover:bg-[#4752c4] hover:text-white`;
    }

    return `${base} hover:bg-gray-100 dark:hover:bg-gray-700`;
  };

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 min-w-[180px] overflow-hidden py-1 ${getMenuStyle()} ${className}`}
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      {menuItems.map((item, index) => {
        if (item.divider) {
          return (
            <div
              key={`divider-${index}`}
              className="my-1 h-px bg-gray-200 dark:bg-gray-700"
            />
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              if (!item.disabled) {
                onAction(item.id);
                onClose();
              }
            }}
            className={getItemStyle(item)}
            disabled={item.disabled}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Quick reaction bar (shown on hover)
type QuickReactionBarProps = {
  reactions?: string[];
  onReact: (emoji: string) => void;
  onMoreReactions?: () => void;
  platform?: Platform;
  className?: string;
};

export function QuickReactionBar({
  reactions,
  onReact,
  onMoreReactions,
  platform = 'generic',
  className = '',
}: QuickReactionBarProps) {
  const defaultReactions = platform === 'imessage'
    ? ['❤️', '👍', '👎', '😂', '‼️', '❓']
    : ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const emojis = reactions || defaultReactions;

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      {emojis.slice(0, 6).map((emoji, index) => (
        <button
          key={index}
          onClick={() => onReact(emoji)}
          className="rounded-full p-1 text-base transition-transform hover:scale-125 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {emoji}
        </button>
      ))}
      {onMoreReactions && (
        <button
          onClick={onMoreReactions}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Hook for managing context menu state
export function useContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetId, setTargetId] = useState<string | null>(null);

  const open = (e: React.MouseEvent, id?: string) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setTargetId(id || null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTargetId(null);
  };

  return {
    isOpen,
    position,
    targetId,
    open,
    close,
  };
}

export type { MenuItem };
