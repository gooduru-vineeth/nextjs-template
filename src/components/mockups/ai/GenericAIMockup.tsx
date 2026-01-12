'use client';

export type GenericAIMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
  attachments?: {
    type: 'image' | 'file' | 'code';
    name: string;
    preview?: string;
    language?: string;
  }[];
  codeBlocks?: {
    language: string;
    code: string;
  }[];
  thinking?: boolean;
  tokens?: number;
};

export type GenericAIData = {
  messages: GenericAIMessage[];
  conversationTitle?: string;
  modelName?: string;
  modelVersion?: string;
  systemPrompt?: string;
  totalTokens?: number;
  maxTokens?: number;
};

export type GenericAIBranding = {
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor?: string;
  userBubbleColor?: string;
  assistantBubbleColor?: string;
  fontFamily?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
};

type GenericAIMockupProps = {
  data: GenericAIData;
  branding?: GenericAIBranding;
  appearance?: {
    theme?: 'light' | 'dark';
    showSidebar?: boolean;
    showHeader?: boolean;
    showTokenCounter?: boolean;
    showModelSelector?: boolean;
    showSystemPrompt?: boolean;
    layout?: 'centered' | 'full-width';
  };
};

const defaultBranding: GenericAIBranding = {
  name: 'AI Assistant',
  primaryColor: '#6366F1',
  secondaryColor: '#818CF8',
  userBubbleColor: '#6366F1',
  assistantBubbleColor: '#F3F4F6',
  fontFamily: 'system-ui',
  borderRadius: 'lg',
};

export function GenericAIMockup({ data, branding = defaultBranding, appearance = {} }: GenericAIMockupProps) {
  const {
    theme = 'light',
    showSidebar = true,
    showHeader = true,
    showTokenCounter = true,
    showModelSelector = true,
    showSystemPrompt = false,
    layout = 'centered',
  } = appearance;

  const brand = { ...defaultBranding, ...branding };
  const isDark = theme === 'dark';

  const getBorderRadius = () => {
    switch (brand.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'lg': return 'rounded-lg';
      case 'full': return 'rounded-2xl';
      default: return 'rounded-lg';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderCodeBlock = (code: string, language: string) => (
    <div className={`mt-3 overflow-hidden ${getBorderRadius()} ${isDark ? 'bg-gray-900' : 'bg-gray-800'}`}>
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
        <span className="text-xs font-medium text-gray-400">{language}</span>
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm text-gray-300">
        <code>{code}</code>
      </pre>
    </div>
  );

  const renderMessage = (message: GenericAIMessage) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    if (isSystem && !showSystemPrompt) {
      return null;
    }

    return (
      <div
        key={message.id}
        className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} ${isSystem ? 'opacity-60' : ''}`}
      >
        {/* Avatar */}
        <div className="shrink-0">
          {isUser
            ? (
                <div className="flex size-8 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700">
                  U
                </div>
              )
            : brand.logo
              ? (
                  <div
                    className="size-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${brand.logo})` }}
                  />
                )
              : (
                  <div
                    className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {getInitials(brand.name)}
                  </div>
                )}
        </div>

        {/* Message Content */}
        <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
          {/* Sender Name */}
          <div className={`mb-1 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isUser ? 'You' : isSystem ? 'System' : brand.name}
            {message.timestamp && (
              <span className="ml-2 opacity-60">{message.timestamp}</span>
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`inline-block px-4 py-3 ${getBorderRadius()} ${
              isUser
                ? 'text-white'
                : isSystem
                  ? isDark ? 'bg-yellow-900/30 text-yellow-200' : 'border border-yellow-200 bg-yellow-50 text-yellow-800'
                  : isDark ? 'bg-gray-700 text-white' : 'text-gray-900'
            }`}
            style={{
              backgroundColor: isUser
                ? brand.userBubbleColor
                : isSystem
                  ? undefined
                  : isDark ? undefined : brand.assistantBubbleColor,
            }}
          >
            {/* Thinking indicator */}
            {message.thinking && (
              <div className="mb-2 flex items-center gap-2 text-sm opacity-70">
                <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Thinking...
              </div>
            )}

            {/* Content */}
            <div className={`text-sm whitespace-pre-wrap ${isUser ? '' : 'text-left'}`}>
              {message.content}
              {message.isStreaming && (
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-current" />
              )}
            </div>

            {/* Code Blocks */}
            {message.codeBlocks?.map((block, index) => (
              <div key={index}>
                {renderCodeBlock(block.code, block.language)}
              </div>
            ))}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${getBorderRadius()} ${
                      isDark ? 'bg-gray-600' : 'bg-gray-100'
                    } p-2`}
                  >
                    {attachment.type === 'image' && attachment.preview
                      ? (
                          <div
                            className="size-10 rounded bg-cover bg-center"
                            style={{ backgroundImage: `url(${attachment.preview})` }}
                          />
                        )
                      : (
                          <div className={`flex size-10 items-center justify-center rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}>
                            <svg className="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {attachment.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Token count */}
            {message.tokens && showTokenCounter && (
              <div className="mt-2 text-xs opacity-50">
                {message.tokens}
                {' '}
                tokens
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex h-[700px] w-full max-w-5xl overflow-hidden ${getBorderRadius()} shadow-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{ fontFamily: brand.fontFamily }}
    >
      {/* Sidebar */}
      {showSidebar && (
        <div className={`w-64 shrink-0 border-r ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-700">
            {brand.logo
              ? (
                  <div
                    className="size-8 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${brand.logo})` }}
                  />
                )
              : (
                  <div
                    className={`flex size-8 items-center justify-center ${getBorderRadius()} text-sm font-bold text-white`}
                    style={{ backgroundColor: brand.primaryColor }}
                  >
                    {getInitials(brand.name)}
                  </div>
                )}
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {brand.name}
            </span>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              type="button"
              className={`flex w-full items-center gap-2 ${getBorderRadius()} border px-4 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? 'border-gray-600 text-white hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversation History */}
          <div className="p-3">
            <h3 className={`mb-2 text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Recent
            </h3>
            <div className="space-y-1">
              <div
                className={`${getBorderRadius()} px-3 py-2 text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                style={{ borderLeft: `3px solid ${brand.primaryColor}` }}
              >
                {data.conversationTitle || 'Current Conversation'}
              </div>
              {['Previous chat 1', 'Previous chat 2'].map((chat, index) => (
                <div
                  key={index}
                  className={`${getBorderRadius()} px-3 py-2 text-sm ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {chat}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        {showHeader && (
          <div className={`flex items-center justify-between border-b px-6 py-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.conversationTitle || 'New Conversation'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Model Selector */}
              {showModelSelector && (
                <select
                  className={`${getBorderRadius()} border px-3 py-1.5 text-sm ${
                    isDark
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <option>
                    {data.modelName || brand.name}
                    {' '}
                    {data.modelVersion || 'v1.0'}
                  </option>
                </select>
              )}

              {/* Token Counter */}
              {showTokenCounter && data.totalTokens !== undefined && (
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {data.totalTokens.toLocaleString()}
                  {' '}
                  /
                  {(data.maxTokens || 128000).toLocaleString()}
                  {' '}
                  tokens
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-6 ${layout === 'centered' ? 'mx-auto max-w-3xl' : ''}`}>
          <div className="space-y-6">
            {data.messages.map(message => renderMessage(message))}
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`mx-auto ${layout === 'centered' ? 'max-w-3xl' : ''}`}>
            <div
              className={`flex items-end gap-3 ${getBorderRadius()} border p-3 ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
              }`}
            >
              {/* Attachment Button */}
              <button
                type="button"
                className={`shrink-0 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Input Field */}
              <div className={`flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <textarea
                  placeholder={`Message ${brand.name}...`}
                  rows={1}
                  className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-400"
                  readOnly
                />
              </div>

              {/* Send Button */}
              <button
                type="button"
                className={`shrink-0 ${getBorderRadius()} p-2 text-white transition-colors`}
                style={{ backgroundColor: brand.primaryColor }}
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            <p className={`mt-2 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {brand.name}
              {' '}
              can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenericAIMockup;
