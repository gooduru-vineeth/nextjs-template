'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';

type AICodeBlockProps = {
  language: string;
  code: string;
  theme?: 'dark' | 'light';
  filename?: string;
  codeTheme?: 'vscode' | 'github' | 'dracula' | 'monokai';
};

// Map language aliases to prism language names
function normalizeLanguage(lang: string): string {
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    sh: 'bash',
    shell: 'bash',
    yml: 'yaml',
    md: 'markdown',
    json5: 'json',
    plaintext: 'plain',
    text: 'plain',
  };
  return aliases[lang.toLowerCase()] || lang.toLowerCase();
}

// Map codeTheme to prism-react-renderer theme
function getCodeTheme(themeName: string | undefined, isDark: boolean) {
  switch (themeName) {
    case 'github':
      return isDark ? themes.github : themes.github;
    case 'dracula':
      return themes.dracula;
    case 'monokai':
      return themes.oneDark; // monokai-like
    case 'vscode':
    default:
      return isDark ? themes.vsDark : themes.vsLight;
  }
}

export function AICodeBlock({ language, code, theme = 'dark', filename, codeTheme }: AICodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const isDark = theme === 'dark';
  const normalizedLang = normalizeLanguage(language);
  const prismTheme = getCodeTheme(codeTheme, isDark);

  return (
    <div className={`my-3 overflow-hidden rounded-lg ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-100'}`}>
      <div className={`flex items-center justify-between px-4 py-2 ${isDark ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`}>
        <div className="flex items-center gap-2">
          {filename && (
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {filename}
            </span>
          )}
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition-colors ${
            copied
              ? 'text-green-400'
              : isDark
                ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                : 'text-gray-500 hover:bg-gray-300 hover:text-gray-800'
          }`}
        >
          {copied
            ? (
                <>
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              )
            : (
                <>
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy code
                </>
              )}
        </button>
      </div>
      <Highlight theme={prismTheme} code={code.trim()} language={normalizedLang}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="overflow-x-auto p-4 text-sm"
            style={{ ...style, margin: 0, background: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className={`mr-4 inline-block w-6 text-right select-none ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
