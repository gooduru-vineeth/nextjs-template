'use client';

import type { AIAppearance, AIMockupData } from '@/types/Mockup';

import React from 'react';
import { AICodeBlock } from '../common/AICodeBlock';

type GeminiMockupProps = {
  data: AIMockupData;
  appearance?: AIAppearance;
};

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
      let processedLine: React.ReactNode = line;
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        processedLine = parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p);
      }
      return <p key={idx} className="mb-2">{processedLine}</p>;
    });
  };

  return (
    <div className="prose max-w-none">
      {renderContent(content)}
      {codeBlocks?.map((block, idx) => (
        <AICodeBlock key={idx} language={block.language} code={block.code} theme="dark" />
      ))}
    </div>
  );
}

export function GeminiMockup({ data, appearance }: GeminiMockupProps) {
  const isDark = appearance?.theme === 'dark';
  const showSidebar = appearance?.showSidebar !== false;

  return (
    <div className={`flex h-[700px] w-[1000px] overflow-hidden rounded-xl ${
      isDark ? 'bg-[#1e1f20]' : 'bg-white'
    }`}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div className={`flex w-72 flex-col ${isDark ? 'bg-[#131314]' : 'bg-[#f0f4f9]'}`}>
          {/* Header */}
          <div className="flex items-center gap-2 p-4">
            <div className="flex items-center gap-2">
              {/* Gemini Logo - gradient star */}
              <div className="relative size-8">
                <svg viewBox="0 0 28 28" className="size-full">
                  <defs>
                    <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4285f4" />
                      <stop offset="50%" stopColor="#9b72cb" />
                      <stop offset="100%" stopColor="#d96570" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#gemini-gradient)"
                    d="M14 0C14 7.732 7.732 14 0 14c7.732 0 14 6.268 14 14 0-7.732 6.268-14 14-14-7.732 0-14-6.268-14-14z"
                  />
                </svg>
              </div>
              <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Gemini</span>
            </div>
          </div>

          {/* New Chat */}
          <div className="px-3">
            <button className={`flex w-full items-center gap-2 rounded-full px-4 py-2.5 text-sm ${
              isDark
                ? 'bg-[#2b2c2f] text-white hover:bg-[#3c4043]'
                : 'bg-white text-gray-700 shadow-sm hover:bg-gray-50'
            }`}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New chat
            </button>
          </div>

          {/* Recent Chats */}
          <div className="mt-4 flex-1 overflow-y-auto px-2">
            <div className={`mb-2 px-3 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Recent
            </div>
            <button className={`mb-1 flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm ${
              isDark ? 'bg-[#2b2c2f] text-white' : 'bg-[#e2e8f0] text-gray-900'
            }`}
            >
              <svg className="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="line-clamp-1">{data.conversationTitle || 'Current chat'}</span>
            </button>
            <button className={`mb-1 flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm ${
              isDark ? 'text-gray-300 hover:bg-[#2b2c2f]' : 'text-gray-700 hover:bg-[#e2e8f0]'
            }`}
            >
              <svg className="size-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="line-clamp-1">Previous conversation</span>
            </button>
          </div>

          {/* Extensions */}
          <div className={`border-t p-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button className={`flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-[#2b2c2f]' : 'text-gray-700 hover:bg-[#e2e8f0]'
            }`}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Extensions
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {data.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6 size-16">
                  <svg viewBox="0 0 28 28" className="size-full">
                    <defs>
                      <linearGradient id="gemini-gradient-big" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4285f4" />
                        <stop offset="50%" stopColor="#9b72cb" />
                        <stop offset="100%" stopColor="#d96570" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#gemini-gradient-big)"
                      d="M14 0C14 7.732 7.732 14 0 14c7.732 0 14 6.268 14 14 0-7.732 6.268-14 14-14-7.732 0-14-6.268-14-14z"
                    />
                  </svg>
                </div>
                <h1 className={`mb-2 text-3xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Hello, User
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  How can I help you today?
                </p>
              </div>
            ) : (
              data.messages.map((message, idx) => (
                <div key={message.id || idx} className="mb-6">
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isDark ? 'bg-[#2b2c2f] text-white' : 'bg-[#e2e8f0] text-gray-900'
                      }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="relative size-8 flex-shrink-0">
                        <svg viewBox="0 0 28 28" className="size-full">
                          <defs>
                            <linearGradient id={`gemini-msg-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#4285f4" />
                              <stop offset="50%" stopColor="#9b72cb" />
                              <stop offset="100%" stopColor="#d96570" />
                            </linearGradient>
                          </defs>
                          <path
                            fill={`url(#gemini-msg-${idx})`}
                            d="M14 0C14 7.732 7.732 14 0 14c7.732 0 14 6.268 14 14 0-7.732 6.268-14 14-14-7.732 0-14-6.268-14-14z"
                          />
                        </svg>
                      </div>
                      <div className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        <MessageContent content={message.content} codeBlocks={message.codeBlocks} />
                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-2">
                          <button className={`rounded-full p-2 ${isDark ? 'hover:bg-[#2b2c2f]' : 'hover:bg-gray-100'}`}>
                            <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          </button>
                          <button className={`rounded-full p-2 ${isDark ? 'hover:bg-[#2b2c2f]' : 'hover:bg-gray-100'}`}>
                            <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                          </button>
                          <button className={`rounded-full p-2 ${isDark ? 'hover:bg-[#2b2c2f]' : 'hover:bg-gray-100'}`}>
                            <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className={`rounded-full p-2 ${isDark ? 'hover:bg-[#2b2c2f]' : 'hover:bg-gray-100'}`}>
                            <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
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
            <div className={`flex items-end gap-2 rounded-3xl border px-4 py-3 ${
              isDark ? 'border-gray-700 bg-[#2b2c2f]' : 'border-gray-300 bg-[#f0f4f9]'
            }`}
            >
              <button className={`rounded-full p-1 ${isDark ? 'hover:bg-[#3c4043]' : 'hover:bg-gray-200'}`}>
                <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter a prompt here"
                  className={`w-full bg-transparent text-sm focus:outline-none ${
                    isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button className={`rounded-full p-1 ${isDark ? 'hover:bg-[#3c4043]' : 'hover:bg-gray-200'}`}>
                <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <p className={`mt-2 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Gemini may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
