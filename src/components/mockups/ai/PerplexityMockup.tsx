'use client';

import type { AIAppearance, AIMockupData } from '@/types/Mockup';

import React from 'react';

type PerplexityMockupProps = {
  data: AIMockupData;
  appearance?: AIAppearance;
};

type Source = {
  title: string;
  url: string;
  favicon?: string;
};

function SourceCard({ source, index }: { source: Source; index: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
      <span className="flex size-5 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-gray-900 dark:text-white">{source.title}</div>
        <div className="truncate text-xs text-gray-500">{source.url}</div>
      </div>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="my-3 overflow-hidden rounded-lg bg-[#1e1e1e]">
      <div className="flex items-center justify-between bg-[#2d2d2d] px-4 py-2">
        <span className="text-xs text-gray-400">{language}</span>
        <button className="text-xs text-gray-400 hover:text-white">Copy</button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm text-gray-300">{code}</code>
      </pre>
    </div>
  );
}

function MessageContent({ content, codeBlocks }: { content: string; codeBlocks?: { language: string; code: string }[] }) {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="mt-4 mb-2 text-lg font-semibold">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="mt-4 mb-2 text-xl font-semibold">{line.slice(3)}</h2>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc">{line.slice(2)}</li>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <li key={idx} className="ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      // Handle inline citations like [1], [2]
      let processedLine: React.ReactNode = line;
      if (line.includes('[') && line.includes(']')) {
        const parts = line.split(/(\[\d+\])/g);
        processedLine = parts.map((p, i) => {
          if (/^\[\d+\]$/.test(p)) {
            return (
              <sup key={i} className="mx-0.5 cursor-pointer text-blue-500 hover:underline">
                {p}
              </sup>
            );
          }
          return p;
        });
      }
      if (line.includes('**')) {
        const parts = String(processedLine).split(/\*\*(.*?)\*\*/g);
        processedLine = parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p);
      }
      return <p key={idx} className="mb-2">{processedLine}</p>;
    });
  };

  return (
    <div className="prose max-w-none">
      {renderContent(content)}
      {codeBlocks?.map((block, idx) => (
        <CodeBlock key={idx} language={block.language} code={block.code} />
      ))}
    </div>
  );
}

export function PerplexityMockup({ data, appearance }: PerplexityMockupProps) {
  const isDark = appearance?.theme === 'dark';
  const showSidebar = appearance?.showSidebar !== false;

  // Mock sources for demonstration
  const mockSources: Source[] = [
    { title: 'Wikipedia - Overview', url: 'en.wikipedia.org' },
    { title: 'Official Documentation', url: 'docs.example.com' },
    { title: 'Stack Overflow Discussion', url: 'stackoverflow.com' },
    { title: 'Research Paper', url: 'arxiv.org' },
  ];

  return (
    <div className={`flex h-[700px] w-[1000px] overflow-hidden rounded-xl ${
      isDark ? 'bg-[#191a1a]' : 'bg-[#f7f7f7]'
    }`}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div className={`flex w-64 flex-col border-r ${
          isDark ? 'border-gray-800 bg-[#191a1a]' : 'border-gray-200 bg-white'
        }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 p-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-blue-500">
              <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Perplexity
            </span>
          </div>

          {/* New Thread */}
          <div className="px-3">
            <button className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              isDark
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Thread
            </button>
          </div>

          {/* Navigation */}
          <div className="mt-4 px-2">
            <button className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
            <button className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover
            </button>
            <button className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
            }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Library
            </button>
          </div>

          {/* Recent Threads */}
          <div className="mt-4 flex-1 overflow-y-auto px-2">
            <div className={`mb-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Recent
            </div>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
              <span className="line-clamp-1">{data.conversationTitle || 'Current search'}</span>
            </button>
          </div>

          {/* User */}
          <div className={`border-t p-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-medium text-white">
                U
              </div>
              <span>User</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {data.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500">
                  <svg className="size-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h1 className={`mb-4 text-2xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  What do you want to know?
                </h1>
                <div className="flex gap-2">
                  {['Research', 'Writing', 'Math', 'Coding'].map(tag => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1 text-sm ${
                        isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              data.messages.map((message, idx) => (
                <div key={message.id || idx} className="mb-8">
                  {message.role === 'user' ? (
                    <div className="mb-4">
                      <div className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Sources */}
                      <div className="mb-4">
                        <div className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Sources
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {mockSources.map((source, sIdx) => (
                            <SourceCard key={sIdx} source={source} index={sIdx} />
                          ))}
                        </div>
                      </div>

                      {/* Answer */}
                      <div className={`${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                        >
                          <div className="flex size-5 items-center justify-center rounded bg-gradient-to-br from-teal-400 to-blue-500">
                            <svg className="size-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            </svg>
                          </div>
                          Answer
                        </div>
                        <MessageContent content={message.content} codeBlocks={message.codeBlocks} />
                      </div>

                      {/* Follow-up suggestions */}
                      <div className="mt-6">
                        <div className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Related
                        </div>
                        <div className="space-y-2">
                          {['What are the key differences?', 'Can you explain more about this?', 'Show me examples'].map((q, qIdx) => (
                            <button
                              key={qIdx}
                              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                                isDark
                                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <svg className="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="mx-auto max-w-3xl">
            <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
              isDark ? 'border-gray-700 bg-[#2a2b2b]' : 'border-gray-300 bg-white'
            }`}
            >
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  className={`w-full bg-transparent text-sm focus:outline-none ${
                    isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <button className={`rounded-lg p-1.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button className="rounded-lg bg-teal-500 p-1.5 text-white hover:bg-teal-600">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-4">
              <button className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Focus
              </button>
              <button className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Attach
              </button>
              <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Pro Search
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
