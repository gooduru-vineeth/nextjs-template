'use client';

import { Bot, Clock, MessageSquare, Pause, Play, RefreshCw, Settings, SkipBack, SkipForward, User } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type FlowMessage = {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  delay?: number;
};

export type ConversationFlowPreviewProps = {
  variant?: 'full' | 'compact' | 'timeline' | 'player';
  messages?: FlowMessage[];
  onChange?: (messages: FlowMessage[]) => void;
  autoPlay?: boolean;
  messageDelay?: number;
  showTimeline?: boolean;
  loop?: boolean;
  className?: string;
};

const defaultMessages: FlowMessage[] = [
  { id: '1', sender: 'user', content: 'Hello! Can you help me with something?', delay: 0 },
  { id: '2', sender: 'assistant', content: 'Of course! I\'d be happy to help. What do you need assistance with?', delay: 1500 },
  { id: '3', sender: 'user', content: 'I need to understand how React hooks work.', delay: 3000 },
  { id: '4', sender: 'assistant', content: 'React hooks are functions that let you use state and lifecycle features in functional components. The most common hooks are useState and useEffect.', delay: 4500 },
  { id: '5', sender: 'user', content: 'Can you show me an example?', delay: 6000 },
];

const ConversationFlowPreview: React.FC<ConversationFlowPreviewProps> = ({
  variant = 'full',
  messages = defaultMessages,
  onChange: _onChange,
  autoPlay = false,
  messageDelay = 1500,
  showTimeline = true,
  loop = false,
  className = '',
}) => {
  void _onChange; // Reserved for future use
  const [messageList, setMessageList] = useState<FlowMessage[]>(messages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setTimeout(() => {
      if (currentIndex < messageList.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (loop) {
        setCurrentIndex(0);
      } else {
        setIsPlaying(false);
      }
    }, messageDelay / playbackSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, messageList.length, messageDelay, playbackSpeed, loop]);

  const togglePlay = useCallback(() => {
    if (currentIndex >= messageList.length - 1 && !isPlaying) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  }, [currentIndex, messageList.length, isPlaying]);

  const goToNext = useCallback(() => {
    if (currentIndex < messageList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, messageList.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, []);

  const goToMessage = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  }, []);

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'user':
        return <User size={14} />;
      case 'assistant':
        return <Bot size={14} />;
      default:
        return <Settings size={14} />;
    }
  };

  const visibleMessages = messageList.slice(0, currentIndex + 1);
  const progress = ((currentIndex + 1) / messageList.length) * 100;

  // Player variant - minimal playback controls
  if (variant === 'player') {
    return (
      <div className={`rounded-xl bg-gray-100 p-4 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
              {' '}
              {currentIndex + 1}
              {' '}
              of
              {' '}
              {messageList.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded px-2 py-0.5 text-xs ${
                  playbackSpeed === speed
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {speed}
                x
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-1 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= messageList.length - 1}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={reset}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className={`${className}`}>
        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-gray-200 dark:bg-gray-700" />

          {messageList.map((message, index) => (
            <div
              key={message.id}
              className={`relative mb-4 cursor-pointer transition-opacity ${
                index > currentIndex ? 'opacity-30' : ''
              }`}
              onClick={() => goToMessage(index)}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-[-16px] h-4 w-4 rounded-full border-2 ${
                  index === currentIndex
                    ? 'border-blue-500 bg-blue-500'
                    : index < currentIndex
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700'
                }`}
              />

              {/* Message content */}
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : message.sender === 'assistant'
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : 'bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`rounded p-1 ${
                      message.sender === 'user'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : message.sender === 'assistant'
                          ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {getSenderIcon(message.sender)}
                  </span>
                  <span className="text-xs font-medium text-gray-600 capitalize dark:text-gray-400">
                    {message.sender}
                  </span>
                  {message.timestamp && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {message.timestamp}
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
          >
            <SkipBack size={16} />
          </button>
          <button
            onClick={togglePlay}
            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= messageList.length - 1}
            className="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-3 dark:bg-gray-800 ${className}`}>
        {/* Mini preview */}
        <div className="mb-3 max-h-32 overflow-y-auto rounded-lg bg-white p-3 dark:bg-gray-900">
          {visibleMessages.map((message, index) => (
            <div
              key={message.id}
              className={`mb-2 flex gap-2 last:mb-0 ${
                index === currentIndex ? 'animate-fadeIn' : ''
              }`}
            >
              <span className="flex-shrink-0">{getSenderIcon(message.sender)}</span>
              <p className="line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
                {message.content}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentIndex + 1}
            /
            {messageList.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-300"
            >
              <SkipBack size={14} />
            </button>
            <button
              onClick={togglePlay}
              className="rounded bg-blue-500 p-1.5 text-white"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= messageList.length - 1}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-300"
            >
              <SkipForward size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Play size={18} />
            Conversation Flow Preview
          </h4>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((messageList.length * messageDelay) / 1000 / playbackSpeed)}
              s total
            </span>
          </div>
        </div>
      </div>

      {/* Message preview area */}
      <div className="max-h-[400px] min-h-[200px] overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800/50">
        {visibleMessages.map((message, index) => (
          <div
            key={message.id}
            className={`mb-4 last:mb-0 ${
              message.sender === 'user' ? 'flex justify-end' : ''
            } ${index === currentIndex ? 'animate-fadeIn' : ''}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 ${
                message.sender === 'user'
                  ? 'rounded-br-sm bg-blue-500 text-white'
                  : message.sender === 'assistant'
                    ? 'rounded-bl-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                    : 'mx-auto bg-yellow-100 text-center text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
              }`}
            >
              {message.sender !== 'system' && (
                <div className="mb-1 flex items-center gap-1">
                  {getSenderIcon(message.sender)}
                  <span className="text-xs capitalize opacity-75">{message.sender}</span>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}

        {isPlaying && currentIndex < messageList.length - 1 && (
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 dark:bg-gray-600" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 dark:bg-gray-600" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300 dark:bg-gray-600" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-2 flex items-center gap-1">
            {messageList.map((message, index) => (
              <button
                key={message.id}
                onClick={() => goToMessage(index)}
                className={`h-2 flex-1 rounded-full transition-all ${
                  index < currentIndex
                    ? 'bg-green-500'
                    : index === currentIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                }`}
                title={`${message.sender}: ${message.content.substring(0, 30)}...`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              Message
              {currentIndex + 1}
              {' '}
              of
              {messageList.length}
            </span>
            <span>
              {Math.round(progress)}
              % complete
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Reset"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="rounded-xl bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= messageList.length - 1}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Speed controls */}
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            {[0.5, 1, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`rounded px-2 py-1 text-xs ${
                  playbackSpeed === speed
                    ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {speed}
                x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationFlowPreview;
