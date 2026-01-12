'use client';

import type { AIAppearance, AIMockupData } from '@/types/Mockup';

import { useMemo } from 'react';
import { estimateConversationTokens, formatTokenCount } from '@/utils/tokenCounter';
import { AICodeBlock } from '../common/AICodeBlock';
import { TextWithMath } from '../common/MathRenderer';

type ClaudeMockupProps = {
  data: AIMockupData;
  appearance?: AIAppearance;
};

const models = [
  { id: 'claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku' },
];

function ArtifactPreview({ artifact }: { artifact: { type: string; title: string; content: string } }) {
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#d4a574]/30 bg-[#faf6f1]">
      <div className="flex items-center justify-between border-b border-[#d4a574]/20 bg-[#f5ede4] px-4 py-2">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-[#d4a574]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-[#8b6914]">{artifact.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-[#8b6914] hover:bg-[#d4a574]/20">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-h-48 overflow-auto p-4">
        <pre className="text-xs text-gray-700">
          {artifact.content.slice(0, 500)}
          ...
        </pre>
      </div>
    </div>
  );
}

function MessageContent({ content, codeBlocks, artifacts, isDark = false }: {
  content: string;
  codeBlocks?: { language: string; code: string }[];
  artifacts?: { type: string; title: string; content: string }[];
  isDark?: boolean;
}) {
  // Simple markdown-like rendering with math support
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="mt-4 mb-2 text-lg font-semibold"><TextWithMath text={line.slice(4)} theme={isDark ? 'dark' : 'light'} /></h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="mt-4 mb-2 text-xl font-semibold"><TextWithMath text={line.slice(3)} theme={isDark ? 'dark' : 'light'} /></h2>;
      }
      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} className="ml-4 list-disc"><TextWithMath text={line.slice(2)} theme={isDark ? 'dark' : 'light'} /></li>;
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return <li key={idx} className="ml-4 list-decimal"><TextWithMath text={line.replace(/^\d+\.\s/, '')} theme={isDark ? 'dark' : 'light'} /></li>;
      }
      // Empty lines
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      // Regular text with math support
      return <p key={idx} className="mb-2"><TextWithMath text={line} theme={isDark ? 'dark' : 'light'} /></p>;
    });
  };

  return (
    <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
      {renderContent(content)}
      {codeBlocks?.map((block, idx) => (
        <AICodeBlock key={idx} language={block.language} code={block.code} theme={isDark ? 'dark' : 'light'} />
      ))}
      {artifacts?.map((artifact, idx) => (
        <ArtifactPreview key={idx} artifact={artifact} />
      ))}
    </div>
  );
}

export function ClaudeMockup({ data, appearance }: ClaudeMockupProps) {
  const isDark = appearance?.theme === 'dark';
  const showSidebar = appearance?.showSidebar !== false;
  const showTokenCount = appearance?.showTokenCount === true;

  // Calculate token counts
  const tokenCounts = useMemo(() => {
    return estimateConversationTokens(data.messages, data.systemPrompt);
  }, [data.messages, data.systemPrompt]);

  return (
    <div className={`flex h-[700px] w-[1000px] overflow-hidden rounded-xl ${
      isDark ? 'bg-[#2b2a27]' : 'bg-[#f9f7f3]'
    }`}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div className={`flex w-64 flex-col border-r ${
          isDark ? 'border-[#3d3c38] bg-[#1f1e1b]' : 'border-[#e8e4dc] bg-white'
        }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              {/* Claude Logo */}
              <svg className={`size-6 ${isDark ? 'text-[#d4a574]' : 'text-[#d4a574]'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Claude</span>
            </div>
            <button className={`rounded-lg p-1.5 ${
              isDark ? 'hover:bg-[#3d3c38]' : 'hover:bg-gray-100'
            }`}
            >
              <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className={`mb-2 px-2 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Recent
            </div>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'bg-[#3d3c38] text-white' : 'bg-[#f0ebe3] text-gray-900'
            }`}
            >
              <span className="line-clamp-1">{data.conversationTitle || 'Current chat'}</span>
            </button>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'text-gray-300 hover:bg-[#3d3c38]' : 'text-gray-700 hover:bg-[#f0ebe3]'
            }`}
            >
              <span className="line-clamp-1">Code assistance chat</span>
            </button>
            <button className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-sm ${
              isDark ? 'text-gray-300 hover:bg-[#3d3c38]' : 'text-gray-700 hover:bg-[#f0ebe3]'
            }`}
            >
              <span className="line-clamp-1">Writing review</span>
            </button>
          </div>

          {/* Bottom section */}
          <div className={`border-t p-3 ${isDark ? 'border-[#3d3c38]' : 'border-[#e8e4dc]'}`}>
            <button className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm ${
              isDark ? 'text-gray-300 hover:bg-[#3d3c38]' : 'text-gray-700 hover:bg-[#f0ebe3]'
            }`}
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-medium text-white">
                U
              </div>
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className={`flex items-center justify-between border-b px-4 py-3 ${
          isDark ? 'border-[#3d3c38]' : 'border-[#e8e4dc]'
        }`}
        >
          <div className="flex items-center gap-2">
            <select className={`rounded-lg border px-3 py-1.5 text-sm focus:outline-none ${
              isDark
                ? 'border-[#3d3c38] bg-[#2b2a27] text-white'
                : 'border-[#e8e4dc] bg-white text-gray-900'
            }`}
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className={`rounded-lg p-2 ${isDark ? 'hover:bg-[#3d3c38]' : 'hover:bg-[#f0ebe3]'}`}>
              <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
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
                  ? 'border-[#d4a574]/30 bg-[#d4a574]/10'
                  : 'border-[#d4a574]/30 bg-[#faf6f1]'
              }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <svg className="size-4 text-[#d4a574]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-medium text-[#d4a574]">
                    System Prompt
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-[#e8d4c0]' : 'text-[#8b6914]'}`}>
                  {data.systemPrompt}
                </p>
              </div>
            )}
            {data.messages.map((message, idx) => (
              <div key={message.id || idx} className="mb-6">
                {message.role === 'user' ? (
                  <div className="flex gap-4">
                    <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-medium text-white">
                      U
                    </div>
                    <div className={`flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <div className="mb-1 text-sm font-medium">You</div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[#d4a574]">
                      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    </div>
                    <div className={`flex-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <div className="mb-1 text-sm font-medium">Claude</div>
                      <MessageContent
                        content={message.content}
                        codeBlocks={message.codeBlocks}
                        artifacts={message.artifacts}
                        isDark={isDark}
                      />
                      {/* Action buttons */}
                      <div className="mt-3 flex items-center gap-2">
                        <button className={`rounded p-1 ${isDark ? 'hover:bg-[#3d3c38]' : 'hover:bg-[#f0ebe3]'}`}>
                          <svg className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className={`rounded p-1 ${isDark ? 'hover:bg-[#3d3c38]' : 'hover:bg-[#f0ebe3]'}`}>
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

            {/* Typing indicator */}
            {data.messages[data.messages.length - 1]?.isStreaming && (
              <div className="flex gap-4">
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-[#d4a574]">
                  <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
                <div className="flex items-center">
                  <span className={`animate-pulse text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Claude is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t p-4 ${isDark ? 'border-[#3d3c38]' : 'border-[#e8e4dc]'}`}>
          <div className="mx-auto max-w-3xl">
            <div className={`flex items-end gap-2 rounded-2xl border px-4 py-3 ${
              isDark ? 'border-[#3d3c38] bg-[#1f1e1b]' : 'border-[#e8e4dc] bg-white'
            }`}
            >
              <button className={`rounded-lg p-1 ${isDark ? 'hover:bg-[#3d3c38]' : 'hover:bg-[#f0ebe3]'}`}>
                <svg className={`size-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Message Claude..."
                  className={`w-full bg-transparent text-sm focus:outline-none ${
                    isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
              <button className="rounded-lg bg-[#d4a574] p-1.5 text-white hover:bg-[#c49664]">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-center gap-3">
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Claude can make mistakes. Please double-check responses.
              </p>
              {showTokenCount && (
                <div className={`flex items-center gap-2 rounded-full px-2 py-0.5 text-xs ${
                  isDark ? 'bg-[#3d3c38] text-[#d4a574]' : 'bg-[#f0ebe3] text-[#8b6914]'
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
