'use client';

import type { AIAppearance, AIMockupData } from '@/types/Mockup';

import React, { useMemo } from 'react';
import { estimateConversationTokens, formatTokenCount } from '@/utils/tokenCounter';
import { AICodeBlock } from '../common/AICodeBlock';
import { TextWithMath } from '../common/MathRenderer';

type ChatGPTMockupProps = {
  data: AIMockupData;
  appearance?: AIAppearance;
};

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5', name: 'GPT-3.5' },
];

function MessageContent({ content, codeBlocks, isDark = true }: { content: string; codeBlocks?: { language: string; code: string }[]; isDark?: boolean }) {
  // Simple markdown-like rendering with math support
  const renderContent = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/```(\w+)?\n([\s\S]*?)```/g);
    const elements: React.ReactElement[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) {
        continue;
      }

      // Check if this is a language identifier followed by code
      if (i % 3 === 1) {
        // Language identifier
        const lang = part || 'plaintext';
        const code = parts[i + 1] || '';
        elements.push(<AICodeBlock key={i} language={lang} code={code.trim()} theme={isDark ? 'dark' : 'light'} />);
        i++; // Skip the code part
      } else if (i % 3 === 0) {
        // Regular text - apply basic formatting with math support
        const formatted = part
          .split('\n')
          .map((line, lineIdx) => {
            // Headers
            if (line.startsWith('### ')) {
              return <h3 key={lineIdx} className="mt-4 mb-2 text-lg font-semibold"><TextWithMath text={line.slice(4)} theme={isDark ? 'dark' : 'light'} /></h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lineIdx} className="mt-4 mb-2 text-xl font-semibold"><TextWithMath text={line.slice(3)} theme={isDark ? 'dark' : 'light'} /></h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={lineIdx} className="mt-4 mb-2 text-2xl font-bold"><TextWithMath text={line.slice(2)} theme={isDark ? 'dark' : 'light'} /></h1>;
            }
            // List items
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return <li key={lineIdx} className="ml-4"><TextWithMath text={line.slice(2)} theme={isDark ? 'dark' : 'light'} /></li>;
            }
            // Numbered lists
            if (/^\d+\.\s/.test(line)) {
              return <li key={lineIdx} className="ml-4 list-decimal"><TextWithMath text={line.replace(/^\d+\.\s/, '')} theme={isDark ? 'dark' : 'light'} /></li>;
            }
            // Empty lines become breaks
            if (line.trim() === '') {
              return <br key={lineIdx} />;
            }
            // Regular text with math support
            return <p key={lineIdx} className="mb-2"><TextWithMath text={line} theme={isDark ? 'dark' : 'light'} /></p>;
          });
        elements.push(<div key={i}>{formatted}</div>);
      }
    }

    return elements;
  };

  return (
    <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
      {renderContent(content)}
      {codeBlocks?.map((block, idx) => (
        <AICodeBlock key={idx} language={block.language} code={block.code} theme={isDark ? 'dark' : 'light'} />
      ))}
    </div>
  );
}

export function ChatGPTMockup({ data, appearance }: ChatGPTMockupProps) {
  const isDark = appearance?.theme !== 'light';
  const showSidebar = appearance?.showSidebar !== false;
  const showTokenCount = appearance?.showTokenCount === true;

  // Calculate token counts
  const tokenCounts = useMemo(() => {
    return estimateConversationTokens(data.messages, data.systemPrompt);
  }, [data.messages, data.systemPrompt]);

  return (
    <div className={`flex h-[700px] w-[1000px] overflow-hidden rounded-xl ${isDark ? 'bg-[#212121]' : 'bg-white'}`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className={`flex w-64 flex-col ${isDark ? 'bg-[#171717]' : 'bg-gray-100'}`}>
          {/* New Chat Button */}
          <div className="p-3">
            <button className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              isDark
                ? 'border-gray-700 text-white hover:bg-gray-800'
                : 'border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New chat
            </button>
          </div>

          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className={`mb-2 px-2 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Today
            </div>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
            }`}
            >
              <span className="line-clamp-1">{data.conversationTitle || 'Current conversation'}</span>
            </button>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'
            }`}
            >
              <span className="line-clamp-1">Previous chat example</span>
            </button>

            <div className={`mt-4 mb-2 px-2 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Yesterday
            </div>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'
            }`}
            >
              <span className="line-clamp-1">Code review discussion</span>
            </button>
          </div>

          {/* User Section */}
          <div className={`border-t p-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'
            }`}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-medium text-white">
                U
              </div>
              <span>User</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-4 py-3 ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}
        >
          <div className="flex items-center gap-2">
            <select className={`rounded-lg border-none bg-transparent px-2 py-1 text-sm font-medium focus:outline-none ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <button className={`rounded-lg p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6">
            {/* System Prompt Display */}
            {data.systemPrompt && (
              <div className={`mb-6 rounded-lg border p-4 ${
                isDark
                  ? 'border-purple-800/30 bg-purple-900/20'
                  : 'border-purple-200 bg-purple-50'
              }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <svg className={`size-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className={`text-xs font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    System Prompt
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-purple-200' : 'text-purple-800'}`}>
                  {data.systemPrompt}
                </p>
              </div>
            )}
            {data.messages.map((message, idx) => (
              <div key={message.id || idx} className="mb-6">
                {message.role === 'user' ? (
                  <div className="flex gap-4">
                    <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-medium text-white">
                      U
                    </div>
                    <div className={`flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <div className="mb-1 text-sm font-medium">You</div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10a37f]">
                      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                      </svg>
                    </div>
                    <div className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <div className="mb-1 text-sm font-medium">ChatGPT</div>
                      <MessageContent content={message.content} codeBlocks={message.codeBlocks} isDark={isDark} />
                      {/* Action buttons */}
                      <div className="mt-3 flex items-center gap-2">
                        <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                          <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                          <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        </button>
                        <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                          <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                        </button>
                        <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                          <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Streaming indicator */}
            {data.messages[data.messages.length - 1]?.isStreaming && (
              <div className="flex gap-4">
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[#10a37f]">
                  <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="mx-auto max-w-3xl">
            <div className={`flex items-end gap-2 rounded-2xl border px-4 py-3 ${
              isDark ? 'border-gray-700 bg-[#2f2f2f]' : 'border-gray-300 bg-white'
            }`}
            >
              <button className={`rounded-lg p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Message ChatGPT"
                  className={`w-full bg-transparent text-sm focus:outline-none ${
                    isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <button className="rounded-lg bg-white p-1.5 text-black">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-3">
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                ChatGPT can make mistakes. Check important info.
              </p>
              {showTokenCount && (
                <div className={`flex items-center gap-2 rounded-full px-2 py-0.5 text-xs ${
                  isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
                >
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {formatTokenCount(tokenCounts.total)}
                    {' '}
                    tokens
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
