'use client';

import { useCallback, useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type FormatType = 'bold' | 'italic' | 'strikethrough' | 'code' | 'monospace' | 'underline' | 'spoiler' | 'link' | 'quote' | 'codeblock';

type FormatOption = {
  id: FormatType;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  wrapChars: { start: string; end: string };
};

type TextFormattingToolbarProps = {
  platform?: Platform;
  value: string;
  onChange: (value: string) => void;
  selection?: { start: number; end: number };
  onSelectionChange?: (selection: { start: number; end: number }) => void;
  variant?: 'toolbar' | 'floating' | 'compact' | 'inline';
  enabledFormats?: FormatType[];
  className?: string;
};

const icons = {
  bold: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m-2 0l-4 16m0 0h4" />
    </svg>
  ),
  strikethrough: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12M9 6c0 0-2 0-2 3s2 3 5 3 5 0 5 3-2 3-2 3" />
    </svg>
  ),
  underline: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3M4 21h16" />
    </svg>
  ),
  code: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  monospace: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <text x="4" y="17" fontSize="12" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
    </svg>
  ),
  spoiler: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  link: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  quote: (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  ),
  codeblock: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
};

// Platform-specific format configurations
const platformFormats: Record<Platform, FormatOption[]> = {
  whatsapp: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Ctrl+B', wrapChars: { start: '*', end: '*' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Ctrl+I', wrapChars: { start: '_', end: '_' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, shortcut: 'Ctrl+Shift+X', wrapChars: { start: '~', end: '~' } },
    { id: 'monospace', label: 'Monospace', icon: icons.monospace, shortcut: 'Ctrl+Shift+M', wrapChars: { start: '```', end: '```' } },
  ],
  imessage: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Cmd+B', wrapChars: { start: '**', end: '**' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Cmd+I', wrapChars: { start: '*', end: '*' } },
    { id: 'underline', label: 'Underline', icon: icons.underline, shortcut: 'Cmd+U', wrapChars: { start: '__', end: '__' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, wrapChars: { start: '~~', end: '~~' } },
  ],
  messenger: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Ctrl+B', wrapChars: { start: '*', end: '*' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Ctrl+I', wrapChars: { start: '_', end: '_' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, wrapChars: { start: '~', end: '~' } },
    { id: 'code', label: 'Code', icon: icons.code, wrapChars: { start: '`', end: '`' } },
  ],
  telegram: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Ctrl+B', wrapChars: { start: '**', end: '**' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Ctrl+I', wrapChars: { start: '__', end: '__' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, wrapChars: { start: '~~', end: '~~' } },
    { id: 'underline', label: 'Underline', icon: icons.underline, wrapChars: { start: '++', end: '++' } },
    { id: 'spoiler', label: 'Spoiler', icon: icons.spoiler, wrapChars: { start: '||', end: '||' } },
    { id: 'code', label: 'Code', icon: icons.code, wrapChars: { start: '`', end: '`' } },
    { id: 'codeblock', label: 'Code Block', icon: icons.codeblock, wrapChars: { start: '```\n', end: '\n```' } },
  ],
  discord: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Ctrl+B', wrapChars: { start: '**', end: '**' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Ctrl+I', wrapChars: { start: '*', end: '*' } },
    { id: 'underline', label: 'Underline', icon: icons.underline, shortcut: 'Ctrl+U', wrapChars: { start: '__', end: '__' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, wrapChars: { start: '~~', end: '~~' } },
    { id: 'spoiler', label: 'Spoiler', icon: icons.spoiler, wrapChars: { start: '||', end: '||' } },
    { id: 'code', label: 'Code', icon: icons.code, wrapChars: { start: '`', end: '`' } },
    { id: 'codeblock', label: 'Code Block', icon: icons.codeblock, wrapChars: { start: '```\n', end: '\n```' } },
    { id: 'quote', label: 'Quote', icon: icons.quote, wrapChars: { start: '> ', end: '' } },
  ],
  slack: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Ctrl+B', wrapChars: { start: '*', end: '*' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Ctrl+I', wrapChars: { start: '_', end: '_' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, shortcut: 'Ctrl+Shift+X', wrapChars: { start: '~', end: '~' } },
    { id: 'code', label: 'Code', icon: icons.code, wrapChars: { start: '`', end: '`' } },
    { id: 'codeblock', label: 'Code Block', icon: icons.codeblock, wrapChars: { start: '```\n', end: '\n```' } },
    { id: 'quote', label: 'Quote', icon: icons.quote, wrapChars: { start: '> ', end: '' } },
    { id: 'link', label: 'Link', icon: icons.link, wrapChars: { start: '<', end: '>' } },
  ],
  generic: [
    { id: 'bold', label: 'Bold', icon: icons.bold, shortcut: 'Ctrl+B', wrapChars: { start: '**', end: '**' } },
    { id: 'italic', label: 'Italic', icon: icons.italic, shortcut: 'Ctrl+I', wrapChars: { start: '*', end: '*' } },
    { id: 'strikethrough', label: 'Strikethrough', icon: icons.strikethrough, wrapChars: { start: '~~', end: '~~' } },
    { id: 'code', label: 'Code', icon: icons.code, wrapChars: { start: '`', end: '`' } },
    { id: 'link', label: 'Link', icon: icons.link, wrapChars: { start: '[', end: '](url)' } },
  ],
};

export function TextFormattingToolbar({
  platform = 'generic',
  value,
  onChange,
  selection,
  onSelectionChange,
  variant = 'toolbar',
  enabledFormats,
  className = '',
}: TextFormattingToolbarProps) {
  const [activeFormats, setActiveFormats] = useState<Set<FormatType>>(new Set());

  const formats = platformFormats[platform].filter(f =>
    !enabledFormats || enabledFormats.includes(f.id),
  );

  const applyFormat = useCallback((format: FormatOption) => {
    if (!selection || selection.start === selection.end) {
      // No selection - insert placeholder
      const placeholder = format.id === 'link' ? 'text' : 'text';
      const newText = value.slice(0, selection?.start ?? value.length)
        + format.wrapChars.start
        + placeholder
        + format.wrapChars.end
        + value.slice(selection?.end ?? value.length);
      onChange(newText);

      // Update selection to highlight the placeholder
      const newStart = (selection?.start ?? value.length) + format.wrapChars.start.length;
      onSelectionChange?.({ start: newStart, end: newStart + placeholder.length });
    } else {
      // Wrap selection
      const selectedText = value.slice(selection.start, selection.end);
      const newText = value.slice(0, selection.start)
        + format.wrapChars.start
        + selectedText
        + format.wrapChars.end
        + value.slice(selection.end);
      onChange(newText);

      // Update selection to include the formatted text
      const newStart = selection.start + format.wrapChars.start.length;
      const newEnd = newStart + selectedText.length;
      onSelectionChange?.({ start: newStart, end: newEnd });
    }

    // Toggle active state
    setActiveFormats((prev) => {
      const next = new Set(prev);
      if (next.has(format.id)) {
        next.delete(format.id);
      } else {
        next.add(format.id);
      }
      return next;
    });
  }, [value, selection, onChange, onSelectionChange]);

  const getButtonStyle = (format: FormatOption) => {
    const isActive = activeFormats.has(format.id);
    const baseStyle = 'flex items-center justify-center transition-colors';

    if (variant === 'floating' || variant === 'compact') {
      return `${baseStyle} p-1.5 rounded ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`;
    }

    return `${baseStyle} p-2 rounded-lg ${
      isActive
        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
    }`;
  };

  // Floating variant (appears above selection)
  if (variant === 'floating') {
    return (
      <div className={`flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {formats.map(format => (
          <button
            key={format.id}
            onClick={() => applyFormat(format)}
            className={getButtonStyle(format)}
            title={`${format.label}${format.shortcut ? ` (${format.shortcut})` : ''}`}
          >
            {format.icon}
          </button>
        ))}
      </div>
    );
  }

  // Compact variant (minimal)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-0.5 ${className}`}>
        {formats.slice(0, 4).map(format => (
          <button
            key={format.id}
            onClick={() => applyFormat(format)}
            className={getButtonStyle(format)}
            title={format.label}
          >
            {format.icon}
          </button>
        ))}
      </div>
    );
  }

  // Inline variant (inside input field)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1 border-t border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        {formats.map(format => (
          <button
            key={format.id}
            onClick={() => applyFormat(format)}
            className={`rounded p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 ${
              activeFormats.has(format.id) ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' : ''
            }`}
            title={format.label}
          >
            {format.icon}
          </button>
        ))}
      </div>
    );
  }

  // Default toolbar variant
  return (
    <div className={`flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {formats.map((format, index) => (
        <div key={format.id} className="flex items-center">
          <button
            onClick={() => applyFormat(format)}
            className={getButtonStyle(format)}
            title={`${format.label}${format.shortcut ? ` (${format.shortcut})` : ''}`}
          >
            {format.icon}
          </button>
          {index < formats.length - 1 && (index + 1) % 4 === 0 && (
            <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
}

// Preview formatted text
type FormattedTextPreviewProps = {
  text: string;
  platform?: Platform;
  className?: string;
};

export function FormattedTextPreview({
  text,
  platform = 'generic',
  className = '',
}: FormattedTextPreviewProps) {
  const parseFormattedText = (input: string): React.ReactNode[] => {
    const patterns: Array<{ pattern: RegExp; render: (match: string, content: string) => React.ReactNode }> = [];

    if (platform === 'discord' || platform === 'telegram' || platform === 'generic') {
      patterns.push(
        { pattern: /\*\*(.+?)\*\*/g, render: (_, c) => <strong key={Math.random()}>{c}</strong> },
        { pattern: /\*(.+?)\*/g, render: (_, c) => <em key={Math.random()}>{c}</em> },
        { pattern: /~~(.+?)~~/g, render: (_, c) => <del key={Math.random()}>{c}</del> },
        { pattern: /__(.+?)__/g, render: (_, c) => <u key={Math.random()}>{c}</u> },
        { pattern: /`(.+?)`/g, render: (_, c) => <code key={Math.random()} className="rounded bg-gray-100 px-1 font-mono text-sm dark:bg-gray-800">{c}</code> },
      );
    } else if (platform === 'whatsapp') {
      patterns.push(
        { pattern: /\*(.+?)\*/g, render: (_, c) => <strong key={Math.random()}>{c}</strong> },
        { pattern: /_(.+?)_/g, render: (_, c) => <em key={Math.random()}>{c}</em> },
        { pattern: /~(.+?)~/g, render: (_, c) => <del key={Math.random()}>{c}</del> },
        { pattern: /```(.+?)```/g, render: (_, c) => <code key={Math.random()} className="rounded bg-gray-100 px-1 font-mono text-sm dark:bg-gray-800">{c}</code> },
      );
    } else if (platform === 'slack') {
      patterns.push(
        { pattern: /\*(.+?)\*/g, render: (_, c) => <strong key={Math.random()}>{c}</strong> },
        { pattern: /_(.+?)_/g, render: (_, c) => <em key={Math.random()}>{c}</em> },
        { pattern: /~(.+?)~/g, render: (_, c) => <del key={Math.random()}>{c}</del> },
        { pattern: /`(.+?)`/g, render: (_, c) => <code key={Math.random()} className="rounded bg-gray-100 px-1 font-mono text-sm dark:bg-gray-800">{c}</code> },
      );
    }

    // Simple rendering - just show formatted preview
    const elements: React.ReactNode[] = [];

    // For simplicity, we'll just render the raw text with basic formatting hints
    elements.push(<span key="text">{input}</span>);

    return elements;
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {parseFormattedText(text)}
    </div>
  );
}

// Format guide tooltip
type FormatGuideProps = {
  platform?: Platform;
  className?: string;
};

export function FormatGuide({
  platform = 'generic',
  className = '',
}: FormatGuideProps) {
  const formats = platformFormats[platform];

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
        Text Formatting
      </h3>
      <div className="space-y-2">
        {formats.map(format => (
          <div key={format.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">{format.icon}</span>
              <span className="text-gray-700 dark:text-gray-200">{format.label}</span>
            </div>
            <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {format.wrapChars.start}
              text
              {format.wrapChars.end}
            </code>
          </div>
        ))}
      </div>
      {formats.some(f => f.shortcut) && (
        <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
          <h4 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Keyboard Shortcuts
          </h4>
          <div className="space-y-1">
            {formats.filter(f => f.shortcut).map(format => (
              <div key={format.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-300">{format.label}</span>
                <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {format.shortcut}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { FormatOption, FormatType };
