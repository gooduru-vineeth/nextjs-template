'use client';

import { useCallback, useEffect } from 'react';

export type KeyboardShortcut = {
  key: string;
  modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  action: () => void;
  description: string;
  enabled?: boolean;
};

type UseKeyboardShortcutsOptions = {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
};

/**
 * Hook for handling keyboard shortcuts
 * Supports combinations with Ctrl/Cmd, Shift, Alt modifiers
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) {
        return;
      }

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput
        = target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.isContentEditable;

      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) {
          continue;
        }

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch
          = shortcut.modifiers?.ctrl === true ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch
          = shortcut.modifiers?.shift === true ? event.shiftKey : !event.shiftKey;
        const altMatch
          = shortcut.modifiers?.alt === true ? event.altKey : !event.altKey;

        // For shortcuts with modifiers, allow execution even in inputs
        const hasModifier = shortcut.modifiers?.ctrl || shortcut.modifiers?.shift || shortcut.modifiers?.alt;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Skip non-modifier shortcuts when in input fields
          if (isInput && !hasModifier) {
            continue;
          }

          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Format shortcut key combination for display
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  // Use Cmd symbol on Mac, Ctrl on others
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

  if (shortcut.modifiers?.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.modifiers?.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.modifiers?.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }

  // Format special keys
  let key = shortcut.key.toUpperCase();
  if (key === 'ENTER') {
    key = '↵';
  } else if (key === 'ESCAPE') {
    key = 'Esc';
  } else if (key === 'ARROWUP') {
    key = '↑';
  } else if (key === 'ARROWDOWN') {
    key = '↓';
  } else if (key === 'ARROWLEFT') {
    key = '←';
  } else if (key === 'ARROWRIGHT') {
    key = '→';
  } else if (key === 'BACKSPACE') {
    key = '⌫';
  } else if (key === 'DELETE') {
    key = 'Del';
  } else if (key === ' ') {
    key = 'Space';
  }

  parts.push(key);

  return parts.join(isMac ? '' : '+');
}
