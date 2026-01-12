'use client';

import { Check, Copy } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export type MarkdownRendererProps = {
  content: string;
  variant?: 'full' | 'compact' | 'minimal';
  showCodeCopyButton?: boolean;
  className?: string;
  codeTheme?: 'light' | 'dark' | 'github' | 'monokai';
};

type ParsedBlock = {
  type: 'paragraph' | 'heading' | 'code' | 'blockquote' | 'list' | 'hr' | 'table';
  content: string;
  level?: number;
  language?: string;
  ordered?: boolean;
  items?: string[];
  rows?: string[][];
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  variant = 'full',
  showCodeCopyButton = true,
  className = '',
  codeTheme = 'dark',
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = useCallback(async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  // Parse inline markdown (bold, italic, code, links)
  const parseInline = useCallback((text: string): React.ReactNode[] => {
    // For simplicity, just process basic formatting using markers
    let processed = text;

    // Handle bold
    processed = processed.replace(/\*\*(.+?)\*\*/g, '⟨BOLD⟩$1⟨/BOLD⟩');
    // Handle italic
    processed = processed.replace(/\*(.+?)\*/g, '⟨ITALIC⟩$1⟨/ITALIC⟩');
    // Handle inline code
    processed = processed.replace(/`(.+?)`/g, '⟨CODE⟩$1⟨/CODE⟩');
    // Handle links
    processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, '⟨LINK:$2⟩$1⟨/LINK⟩');
    // Handle strikethrough
    processed = processed.replace(/~~(.+?)~~/g, '⟨STRIKE⟩$1⟨/STRIKE⟩');

    // Split and render
    const parts = processed.split(/(⟨[^⟩]+⟩[^⟨]*⟨\/[^⟩]+⟩)/);

    return parts.map((part, i) => {
      if (part.startsWith('⟨BOLD⟩')) {
        const innerText = part.replace(/⟨\/?BOLD⟩/g, '');
        return <strong key={i} className="font-semibold">{innerText}</strong>;
      }
      if (part.startsWith('⟨ITALIC⟩')) {
        const innerText = part.replace(/⟨\/?ITALIC⟩/g, '');
        return <em key={i} className="italic">{innerText}</em>;
      }
      if (part.startsWith('⟨CODE⟩')) {
        const innerText = part.replace(/⟨\/?CODE⟩/g, '');
        return <code key={i} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-pink-600 dark:bg-gray-800 dark:text-pink-400">{innerText}</code>;
      }
      if (part.startsWith('⟨LINK:')) {
        const urlMatch = part.match(/⟨LINK:(.+?)⟩(.+?)⟨\/LINK⟩/);
        if (urlMatch) {
          return <a key={i} href={urlMatch[1]} className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">{urlMatch[2]}</a>;
        }
      }
      if (part.startsWith('⟨STRIKE⟩')) {
        const innerText = part.replace(/⟨\/?STRIKE⟩/g, '');
        return <del key={i} className="line-through">{innerText}</del>;
      }
      return part || null;
    }).filter(Boolean);
  }, []);

  // Parse content into blocks
  const blocks = useMemo((): ParsedBlock[] => {
    const lines = content.split('\n');
    const result: ParsedBlock[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i]!;

      // Code block
      if (line.startsWith('```')) {
        const language = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i]!.startsWith('```')) {
          codeLines.push(lines[i]!);
          i++;
        }
        result.push({ type: 'code', content: codeLines.join('\n'), language });
        i++;
        continue;
      }

      // Heading
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        result.push({ type: 'heading', content: headingMatch[2]!, level: headingMatch[1]!.length });
        i++;
        continue;
      }

      // Horizontal rule
      if (/^[-*_]{3,}$/.test(line.trim())) {
        result.push({ type: 'hr', content: '' });
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i]!.startsWith('>')) {
          quoteLines.push(lines[i]!.slice(1).trim());
          i++;
        }
        result.push({ type: 'blockquote', content: quoteLines.join('\n') });
        continue;
      }

      // Unordered list
      if (/^[-*+]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*+]\s/.test(lines[i]!)) {
          items.push(lines[i]!.slice(2));
          i++;
        }
        result.push({ type: 'list', content: '', items, ordered: false });
        continue;
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i]!)) {
          items.push(lines[i]!.replace(/^\d+\.\s/, ''));
          i++;
        }
        result.push({ type: 'list', content: '', items, ordered: true });
        continue;
      }

      // Table
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1]!.includes('---')) {
        const rows: string[][] = [];
        while (i < lines.length && lines[i]!.includes('|')) {
          const row = lines[i]!.split('|').map(cell => cell.trim()).filter(Boolean);
          if (!lines[i]!.includes('---')) {
            rows.push(row);
          }
          i++;
        }
        result.push({ type: 'table', content: '', rows });
        continue;
      }

      // Empty line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Paragraph
      const paragraphLines: string[] = [];
      while (i < lines.length && lines[i]!.trim() && !lines[i]!.startsWith('#') && !lines[i]!.startsWith('```') && !lines[i]!.startsWith('>') && !/^[-*+]\s/.test(lines[i]!) && !/^\d+\.\s/.test(lines[i]!)) {
        paragraphLines.push(lines[i]!);
        i++;
      }
      if (paragraphLines.length > 0) {
        result.push({ type: 'paragraph', content: paragraphLines.join(' ') });
      }
    }

    return result;
  }, [content]);

  const codeThemeClasses = {
    light: 'bg-gray-100 text-gray-800',
    dark: 'bg-gray-900 text-gray-100',
    github: 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100',
    monokai: 'bg-[#272822] text-[#f8f8f2]',
  };

  const renderBlock = (block: ParsedBlock, index: number) => {
    switch (block.type) {
      case 'heading': {
        const headingSizes: Record<number, string> = {
          1: 'text-2xl font-bold',
          2: 'text-xl font-bold',
          3: 'text-lg font-semibold',
          4: 'text-base font-semibold',
          5: 'text-sm font-semibold',
          6: 'text-sm font-medium',
        };
        const level = block.level || 1;
        const sizeClass = headingSizes[level] || headingSizes[1];

        if (level === 1) {
          return (
            <h1 key={index} className={`${sizeClass} text-gray-900 dark:text-gray-100 ${variant === 'compact' ? 'mb-1' : 'mb-3'}`}>
              {parseInline(block.content)}
            </h1>
          );
        }
        if (level === 2) {
          return (
            <h2 key={index} className={`${sizeClass} text-gray-900 dark:text-gray-100 ${variant === 'compact' ? 'mb-1' : 'mb-3'}`}>
              {parseInline(block.content)}
            </h2>
          );
        }
        if (level === 3) {
          return (
            <h3 key={index} className={`${sizeClass} text-gray-900 dark:text-gray-100 ${variant === 'compact' ? 'mb-1' : 'mb-3'}`}>
              {parseInline(block.content)}
            </h3>
          );
        }
        if (level === 4) {
          return (
            <h4 key={index} className={`${sizeClass} text-gray-900 dark:text-gray-100 ${variant === 'compact' ? 'mb-1' : 'mb-3'}`}>
              {parseInline(block.content)}
            </h4>
          );
        }
        if (level === 5) {
          return (
            <h5 key={index} className={`${sizeClass} text-gray-900 dark:text-gray-100 ${variant === 'compact' ? 'mb-1' : 'mb-3'}`}>
              {parseInline(block.content)}
            </h5>
          );
        }
        return (
          <h6 key={index} className={`${sizeClass} text-gray-900 dark:text-gray-100 ${variant === 'compact' ? 'mb-1' : 'mb-3'}`}>
            {parseInline(block.content)}
          </h6>
        );
      }

      case 'code':
        return (
          <div key={index} className={`group relative ${variant === 'compact' ? 'my-2' : 'my-4'}`}>
            {block.language && (
              <div className="absolute top-0 left-0 rounded-br bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
                {block.language}
              </div>
            )}
            {showCodeCopyButton && (
              <button
                onClick={() => handleCopyCode(block.content)}
                className="absolute top-2 right-2 rounded bg-gray-700 p-1.5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-600 hover:text-gray-200"
                title="Copy code"
              >
                {copiedCode === block.content ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
            <pre className={`${codeThemeClasses[codeTheme]} overflow-x-auto rounded-lg p-4 ${variant === 'compact' ? 'text-xs' : 'text-sm'}`}>
              <code className="font-mono">{block.content}</code>
            </pre>
          </div>
        );

      case 'blockquote':
        return (
          <blockquote
            key={index}
            className={`border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400 ${variant === 'compact' ? 'my-2' : 'my-4'}`}
          >
            {parseInline(block.content)}
          </blockquote>
        );

      case 'list':
        if (block.ordered) {
          return (
            <ol
              key={index}
              className={`list-decimal pl-6 text-gray-700 dark:text-gray-300 ${variant === 'compact' ? 'my-2 space-y-0.5' : 'my-4 space-y-1'}`}
            >
              {block.items?.map((item, i) => (
                <li key={i}>{parseInline(item)}</li>
              ))}
            </ol>
          );
        }
        return (
          <ul
            key={index}
            className={`list-disc pl-6 text-gray-700 dark:text-gray-300 ${variant === 'compact' ? 'my-2 space-y-0.5' : 'my-4 space-y-1'}`}
          >
            {block.items?.map((item, i) => (
              <li key={i}>{parseInline(item)}</li>
            ))}
          </ul>
        );

      case 'hr':
        return <hr key={index} className="my-4 border-gray-200 dark:border-gray-700" />;

      case 'table':
        return (
          <div key={index} className={`overflow-x-auto ${variant === 'compact' ? 'my-2' : 'my-4'}`}>
            <table className="min-w-full border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {block.rows?.[0]?.map((cell, i) => (
                    <th key={i} className="border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
                      {parseInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows?.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-gray-50 dark:even:bg-gray-800/50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border-b border-gray-200 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                        {parseInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'paragraph':
      default:
        return (
          <p
            key={index}
            className={`text-gray-700 dark:text-gray-300 ${variant === 'compact' ? 'mb-2 text-sm' : 'mb-4'}`}
          >
            {parseInline(block.content)}
          </p>
        );
    }
  };

  if (variant === 'minimal') {
    return (
      <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
        {blocks.map(renderBlock)}
      </div>
    );
  }

  return (
    <div className={`${variant === 'compact' ? 'text-sm' : ''} ${className}`}>
      {blocks.map(renderBlock)}
    </div>
  );
};

export default MarkdownRenderer;
