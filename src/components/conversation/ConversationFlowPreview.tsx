'use client';

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Maximize2,
  MessageCircle,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  Smartphone,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'other' | 'system';
  senderName?: string;
  avatar?: string;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'audio' | 'video' | 'file' | 'typing';
  delay?: number;
  reactions?: string[];
};

export type ConversationFlowPreviewProps = {
  messages: Message[];
  title?: string;
  subtitle?: string;
  onMessageChange?: (index: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
  defaultDelay?: number;
  typingSpeed?: number;
  showControls?: boolean;
  showTimeline?: boolean;
  platform?: 'whatsapp' | 'imessage' | 'telegram' | 'slack' | 'discord' | 'generic';
  variant?: 'full' | 'compact' | 'player' | 'preview' | 'minimal';
  darkMode?: boolean;
  className?: string;
};

export default function ConversationFlowPreview({
  messages,
  title = 'Conversation',
  subtitle,
  onMessageChange,
  onComplete,
  autoPlay = false,
  loop = false,
  defaultDelay = 1500,
  typingSpeed = 50,
  showControls = true,
  showTimeline = true,
  platform = 'generic',
  variant = 'full',
  darkMode = false,
  className = '',
}: ConversationFlowPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const getPlatformStyles = () => {
    switch (platform) {
      case 'whatsapp':
        return {
          userBubble: 'bg-green-100 dark:bg-green-900',
          otherBubble: 'bg-white dark:bg-gray-800',
          background: darkMode ? 'bg-[#0b141a]' : 'bg-[#e5ddd5]',
        };
      case 'imessage':
        return {
          userBubble: 'bg-blue-500 text-white',
          otherBubble: 'bg-gray-200 dark:bg-gray-700',
          background: darkMode ? 'bg-black' : 'bg-white',
        };
      case 'telegram':
        return {
          userBubble: 'bg-blue-400 text-white',
          otherBubble: 'bg-white dark:bg-gray-800',
          background: darkMode ? 'bg-gray-900' : 'bg-gray-100',
        };
      case 'slack':
        return {
          userBubble: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          otherBubble: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          background: darkMode ? 'bg-gray-900' : 'bg-white',
        };
      case 'discord':
        return {
          userBubble: 'bg-gray-700',
          otherBubble: 'bg-gray-700',
          background: 'bg-[#36393f]',
        };
      default:
        return {
          userBubble: 'bg-blue-500 text-white',
          otherBubble: darkMode ? 'bg-gray-800' : 'bg-gray-100',
          background: darkMode ? 'bg-gray-900' : 'bg-gray-50',
        };
    }
  };

  const platformStyles = getPlatformStyles();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages, scrollToBottom]);

  useEffect(() => {
    if (!isPlaying || currentIndex >= messages.length) {
      if (currentIndex >= messages.length && loop) {
        setCurrentIndex(0);
        setVisibleMessages([]);
      } else if (currentIndex >= messages.length) {
        setIsPlaying(false);
        onComplete?.();
      }
      return;
    }

    const message = messages[currentIndex];
    const delay = (message?.delay || defaultDelay) / playbackSpeed;

    // Simulate typing effect
    if (message?.sender === 'other') {
      setIsTyping(true);
      setTypingText('');

      // Type out the message character by character
      let charIndex = 0;
      const content = message?.content || '';
      const typingInterval = setInterval(() => {
        if (charIndex < content.length) {
          setTypingText(content.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          if (message) {
            setVisibleMessages(prev => [...prev, message]);
          }
          setCurrentIndex(prev => prev + 1);
          onMessageChange?.(currentIndex + 1);
        }
      }, typingSpeed / playbackSpeed);

      return () => clearInterval(typingInterval);
    } else {
      const timer = setTimeout(() => {
        if (message) {
          setVisibleMessages(prev => [...prev, message]);
        }
        setCurrentIndex(prev => prev + 1);
        onMessageChange?.(currentIndex + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentIndex, messages, defaultDelay, typingSpeed, playbackSpeed, loop, onComplete, onMessageChange]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setVisibleMessages([]);
    setIsPlaying(true);
  }, []);

  const handlePrevious = useCallback(() => {
    if (visibleMessages.length > 0) {
      setVisibleMessages(prev => prev.slice(0, -1));
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  }, [visibleMessages.length]);

  const handleNext = useCallback(() => {
    if (currentIndex < messages.length) {
      const message = messages[currentIndex];
      if (message) {
        setVisibleMessages(prev => [...prev, message]);
      }
      setCurrentIndex(prev => prev + 1);
      onMessageChange?.(currentIndex + 1);
    }
  }, [currentIndex, messages, onMessageChange]);

  const handleSeek = useCallback((index: number) => {
    setVisibleMessages(messages.slice(0, index));
    setCurrentIndex(index);
    onMessageChange?.(index);
  }, [messages, onMessageChange]);

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';

    if (isSystem) {
      return (
        <div key={message.id} className="my-4 text-center">
          <span className={`text-xs ${mutedColor} ${inputBg} rounded-full px-3 py-1`}>
            {message.content}
          </span>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in mb-3`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {!isUser && message.avatar && (
          <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-sm text-white">
            {message.avatar.startsWith('http')
              ? (
                  <img src={message.avatar} alt="" className="h-full w-full object-cover" />
                )
              : (
                  message.avatar.charAt(0)
                )}
          </div>
        )}
        <div className="max-w-[70%]">
          {!isUser && message.senderName && (
            <span className={`text-xs ${mutedColor} ml-2`}>{message.senderName}</span>
          )}
          <div
            className={`rounded-2xl px-4 py-2 ${
              isUser
                ? `${platformStyles.userBubble} rounded-br-sm`
                : `${platformStyles.otherBubble} ${!isUser && !message.avatar ? '' : ''} rounded-bl-sm`
            }`}
          >
            <p className={`text-sm ${isUser && platform === 'imessage' ? 'text-white' : textColor}`}>
              {message.content}
            </p>
          </div>
          <div className={`mt-1 flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {message.timestamp && (
              <span className={`text-xs ${mutedColor}`}>{message.timestamp}</span>
            )}
            {message.status && isUser && (
              <span className={`text-xs ${message.status === 'read' ? 'text-blue-500' : mutedColor}`}>
                {message.status === 'sent' && '✓'}
                {message.status === 'delivered' && '✓✓'}
                {message.status === 'read' && '✓✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-3 ${className}`}>
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className={`p-2 ${inputBg} rounded-full`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="flex-1">
          <div className={`h-1 ${inputBg} overflow-hidden rounded-full`}>
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(currentIndex / messages.length) * 100}%` }}
            />
          </div>
        </div>
        <span className={`text-xs ${mutedColor}`}>
          {currentIndex}
          /
          {messages.length}
        </span>
      </div>
    );
  }

  // Preview variant
  if (variant === 'preview') {
    return (
      <div className={`${bgColor} border ${borderColor} overflow-hidden rounded-lg ${className}`}>
        <div className={`border-b p-3 ${borderColor} flex items-center justify-between`}>
          <span className={`font-medium ${textColor}`}>{title}</span>
          <span className={`text-xs ${mutedColor}`}>
            {messages.length}
            {' '}
            messages
          </span>
        </div>
        <div className={`${platformStyles.background} h-48 overflow-y-auto p-4`}>
          {visibleMessages.slice(-3).map((msg, idx) => renderMessage(msg, idx))}
          {isTyping && (
            <div className="mb-3 flex justify-start">
              <div className={`px-4 py-2 ${platformStyles.otherBubble} rounded-2xl`}>
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={`border-t p-2 ${borderColor} flex items-center justify-center gap-2`}>
          <button onClick={handleRestart} className={`p-1.5 ${hoverBg} rounded`}>
            <RotateCcw size={14} className={mutedColor} />
          </button>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="rounded-full bg-blue-500 p-2 text-white"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} border ${borderColor} overflow-hidden rounded-xl ${className}`}>
        <div className={`${platformStyles.background} h-64 overflow-y-auto p-4`}>
          {visibleMessages.map((msg, idx) => renderMessage(msg, idx))}
          {isTyping && (
            <div className="mb-3 flex justify-start">
              <div className={`px-4 py-2 ${platformStyles.otherBubble} rounded-2xl`}>
                <p className={`text-sm ${textColor}`}>
                  {typingText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showControls && (
          <div className={`border-t p-3 ${borderColor} flex items-center justify-between`}>
            <div className="flex items-center gap-1">
              <button onClick={handleRestart} className={`p-1.5 ${hoverBg} rounded`}>
                <RotateCcw size={14} className={mutedColor} />
              </button>
              <button onClick={handlePrevious} className={`p-1.5 ${hoverBg} rounded`}>
                <SkipBack size={14} className={mutedColor} />
              </button>
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="mx-1 rounded-full bg-blue-500 p-2 text-white"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={handleNext} className={`p-1.5 ${hoverBg} rounded`}>
                <SkipForward size={14} className={mutedColor} />
              </button>
            </div>
            <span className={`text-xs ${mutedColor}`}>
              {currentIndex}
              /
              {messages.length}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Player variant
  if (variant === 'player') {
    return (
      <div className={`${bgColor} border ${borderColor} overflow-hidden rounded-xl ${className}`} ref={containerRef}>
        {/* Header */}
        <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className={`font-semibold ${textColor}`}>{title}</h3>
              {subtitle && <p className={`text-sm ${mutedColor}`}>{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 ${hoverBg} rounded-lg`}>
              <Smartphone size={16} className={mutedColor} />
            </button>
            <button className={`p-2 ${hoverBg} rounded-lg`}>
              <Monitor size={16} className={mutedColor} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={`${platformStyles.background} h-80 overflow-y-auto p-4`}>
          {visibleMessages.map((msg, idx) => renderMessage(msg, idx))}
          {isTyping && (
            <div className="mb-3 flex justify-start">
              <div className={`px-4 py-2 ${platformStyles.otherBubble} rounded-2xl`}>
                <p className={`text-sm ${textColor}`}>
                  {typingText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Controls */}
        <div className={`border-t p-4 ${borderColor}`}>
          {/* Timeline */}
          {showTimeline && (
            <div className="mb-4">
              <div
                className={`h-1 ${inputBg} cursor-pointer overflow-hidden rounded-full`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  const index = Math.round(percentage * messages.length);
                  handleSeek(index);
                }}
              >
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(currentIndex / messages.length) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between">
                <span className={`text-xs ${mutedColor}`}>0:00</span>
                <span className={`text-xs ${mutedColor}`}>
                  {Math.ceil((messages.length * defaultDelay) / 1000 / 60)}
                  :00
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 ${hoverBg} rounded-lg`}
              >
                {isMuted ? <VolumeX size={18} className={mutedColor} /> : <Volume2 size={18} className={mutedColor} />}
              </button>
              <select
                value={playbackSpeed}
                onChange={e => setPlaybackSpeed(Number.parseFloat(e.target.value))}
                className={`px-2 py-1 ${inputBg} ${textColor} rounded border text-xs ${borderColor}`}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleRestart} className={`p-2 ${hoverBg} rounded-lg`}>
                <RotateCcw size={18} className={mutedColor} />
              </button>
              <button onClick={handlePrevious} className={`p-2 ${hoverBg} rounded-lg`}>
                <SkipBack size={18} className={mutedColor} />
              </button>
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button onClick={handleNext} className={`p-2 ${hoverBg} rounded-lg`}>
                <SkipForward size={18} className={mutedColor} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 ${hoverBg} rounded-lg`}
              >
                <Maximize2 size={18} className={mutedColor} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${mutedColor}`}>
                {currentIndex}
                {' '}
                /
                {messages.length}
              </span>
              <button className={`p-2 ${hoverBg} rounded-lg`}>
                <Download size={18} className={mutedColor} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full flex-col ${className}`} ref={containerRef}>
      {/* Header */}
      <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${textColor}`}>{title}</h2>
            {subtitle && <p className={`text-sm ${mutedColor}`}>{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-2 ${hoverBg} rounded-lg`}>
            <Clock size={18} className={mutedColor} />
          </button>
          <button className={`p-2 ${hoverBg} rounded-lg`}>
            <Settings size={18} className={mutedColor} />
          </button>
        </div>
      </div>

      {/* Device frame */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8 dark:bg-gray-800">
        <div className={`w-80 ${bgColor} overflow-hidden rounded-3xl border-8 border-gray-800 shadow-2xl`}>
          {/* Phone header */}
          <div className={`p-3 ${inputBg} flex items-center justify-between`}>
            <button className={mutedColor}>
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <p className={`font-medium ${textColor}`}>{title}</p>
              <p className={`text-xs ${mutedColor}`}>
                {isTyping ? 'typing...' : 'online'}
              </p>
            </div>
            <button className={mutedColor}>
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className={`${platformStyles.background} h-96 overflow-y-auto p-4`}>
            {visibleMessages.map((msg, idx) => renderMessage(msg, idx))}
            {isTyping && (
              <div className="mb-3 flex justify-start">
                <div className={`px-4 py-2 ${platformStyles.otherBubble} rounded-2xl`}>
                  <p className={`text-sm ${textColor}`}>
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className={`p-3 ${inputBg} flex items-center gap-2`}>
            <div className={`flex-1 px-4 py-2 ${bgColor} rounded-full ${borderColor} border`}>
              <span className={`text-sm ${mutedColor}`}>Message</span>
            </div>
            <button className="rounded-full bg-blue-500 p-2 text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className={`border-t p-4 ${borderColor}`}>
          {/* Timeline */}
          {showTimeline && (
            <div className="mb-4">
              <div className="flex gap-1">
                {messages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeek(idx + 1)}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      idx < currentIndex ? 'bg-blue-500' : inputBg
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Playback controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 ${hoverBg} rounded-lg`}
              >
                {isMuted ? <VolumeX size={20} className={mutedColor} /> : <Volume2 size={20} className={mutedColor} />}
              </button>
              <select
                value={playbackSpeed}
                onChange={e => setPlaybackSpeed(Number.parseFloat(e.target.value))}
                className={`px-3 py-1.5 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleRestart} className={`p-2 ${hoverBg} rounded-lg`}>
                <RotateCcw size={20} className={mutedColor} />
              </button>
              <button onClick={handlePrevious} className={`p-2 ${hoverBg} rounded-lg`}>
                <SkipBack size={20} className={mutedColor} />
              </button>
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="rounded-full bg-blue-500 p-4 text-white shadow-lg hover:bg-blue-600"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={handleNext} className={`p-2 ${hoverBg} rounded-lg`}>
                <SkipForward size={20} className={mutedColor} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-2 ${hoverBg} rounded-lg`}
              >
                <Maximize2 size={20} className={mutedColor} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${textColor}`}>
                {currentIndex}
                {' '}
                /
                {messages.length}
              </span>
              <button className={`flex items-center gap-2 px-3 py-1.5 ${inputBg} rounded-lg ${hoverBg}`}>
                <Download size={16} className={mutedColor} />
                <span className={`text-sm ${mutedColor}`}>Export</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for MoreHorizontal since we didn't import it
function MoreHorizontal({ size, className }: { size: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
