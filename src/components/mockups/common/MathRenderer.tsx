'use client';

import katex from 'katex';
import { useEffect, useMemo, useRef } from 'react';

type MathRendererProps = {
  math: string;
  display?: boolean; // true for display mode (centered block), false for inline
  theme?: 'dark' | 'light';
};

/**
 * Renders LaTeX math expressions using KaTeX
 */
export function MathRenderer({ math, display = false, theme = 'dark' }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          errorColor: theme === 'dark' ? '#ff6b6b' : '#dc2626',
          trust: false,
          strict: 'warn',
        });
      } catch (error) {
        // If rendering fails, show the raw math
        if (containerRef.current) {
          containerRef.current.textContent = math;
        }
      }
    }
  }, [math, display, theme]);

  return (
    <span
      ref={containerRef}
      className={`katex-math ${display ? 'my-4 block text-center' : 'inline'} ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
      }`}
    />
  );
}

/**
 * Parses text and extracts math expressions
 * Supports:
 * - $...$ for inline math
 * - $$...$$ for display math
 * - \[...\] for display math (LaTeX style)
 * - \(...\) for inline math (LaTeX style)
 */
export function parseMathInText(text: string): { type: 'text' | 'inline-math' | 'display-math'; content: string }[] {
  const result: { type: 'text' | 'inline-math' | 'display-math'; content: string }[] = [];

  // Combined regex for all math delimiters
  // Order matters: longer delimiters first
  const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+\$|\\\([\s\S]+?\\\))/g;

  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    // Add text before the math
    if (match.index > lastIndex) {
      result.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
      });
    }

    const mathString = match[1]!;
    let mathContent: string;
    let isDisplay: boolean;

    // Determine type and extract content
    if (mathString.startsWith('$$') && mathString.endsWith('$$')) {
      mathContent = mathString.slice(2, -2);
      isDisplay = true;
    } else if (mathString.startsWith('\\[') && mathString.endsWith('\\]')) {
      mathContent = mathString.slice(2, -2);
      isDisplay = true;
    } else if (mathString.startsWith('$') && mathString.endsWith('$')) {
      mathContent = mathString.slice(1, -1);
      isDisplay = false;
    } else if (mathString.startsWith('\\(') && mathString.endsWith('\\)')) {
      mathContent = mathString.slice(2, -2);
      isDisplay = false;
    } else {
      // Shouldn't happen, but treat as text
      result.push({ type: 'text', content: mathString });
      lastIndex = match.index + mathString.length;
      continue;
    }

    result.push({
      type: isDisplay ? 'display-math' : 'inline-math',
      content: mathContent.trim(),
    });

    lastIndex = match.index + mathString.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  return result;
}

type TextWithMathProps = {
  text: string;
  theme?: 'dark' | 'light';
};

/**
 * Renders text that may contain inline and display math expressions
 */
export function TextWithMath({ text, theme = 'dark' }: TextWithMathProps) {
  const parts = useMemo(() => parseMathInText(text), [text]);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        }
        if (part.type === 'inline-math') {
          return <MathRenderer key={index} math={part.content} display={false} theme={theme} />;
        }
        if (part.type === 'display-math') {
          return (
            <div key={index} className="my-3">
              <MathRenderer math={part.content} display theme={theme} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
}
