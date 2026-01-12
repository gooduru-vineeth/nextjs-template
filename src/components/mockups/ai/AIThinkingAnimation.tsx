'use client';

import { useEffect, useState } from 'react';

type AIPlatform = 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'generic';
type AnimationStyle = 'dots' | 'pulse' | 'wave' | 'spinner' | 'typing' | 'brain' | 'sparkle';

type AIThinkingAnimationProps = {
  platform?: AIPlatform;
  style?: AnimationStyle;
  text?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
};

const platformStyles: Record<AIPlatform, AnimationStyle> = {
  chatgpt: 'dots',
  claude: 'pulse',
  gemini: 'sparkle',
  perplexity: 'wave',
  generic: 'dots',
};

const platformColors: Record<AIPlatform, string> = {
  chatgpt: '#10a37f',
  claude: '#cc785c',
  gemini: '#4285f4',
  perplexity: '#20808d',
  generic: '#6366f1',
};

const sizeClasses = {
  sm: { container: 'gap-1', dot: 'size-1.5', icon: 'size-4', text: 'text-xs' },
  md: { container: 'gap-1.5', dot: 'size-2', icon: 'size-5', text: 'text-sm' },
  lg: { container: 'gap-2', dot: 'size-2.5', icon: 'size-6', text: 'text-base' },
};

// Dots animation (ChatGPT style)
function DotsAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <div className={`flex items-center ${sizeClasses[size].container}`}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={`${sizeClasses[size].dot} animate-bounce rounded-full`}
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}

// Pulse animation (Claude style)
function PulseAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`${sizeClasses[size].icon} animate-ping rounded-full opacity-75`}
        style={{ backgroundColor: color }}
      />
      <div
        className={`${sizeClasses[size].dot} absolute rounded-full`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// Wave animation
function WaveAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <div className={`flex items-end ${sizeClasses[size].container}`}>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="w-0.5 rounded-full"
          style={{
            backgroundColor: color,
            height: size === 'sm' ? '8px' : size === 'md' ? '12px' : '16px',
            animation: 'wave 0.8s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style jsx>
        {`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}
      </style>
    </div>
  );
}

// Spinner animation
function SpinnerAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <svg
      className={`${sizeClasses[size].icon} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Typing animation (cursor blink)
function TypingAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <div className={`flex items-center ${sizeClasses[size].container}`}>
      <div
        className="w-0.5 animate-pulse rounded-full"
        style={{
          backgroundColor: color,
          height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px',
        }}
      />
    </div>
  );
}

// Brain animation (thinking)
function BrainAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <div className="relative">
      <svg
        className={`${sizeClasses[size].icon}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <div
        className="absolute -top-1 -right-1 size-2 animate-ping rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// Sparkle animation (Gemini style)
function SparkleAnimation({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  return (
    <div className={`flex items-center ${sizeClasses[size].container}`}>
      {[0, 1, 2].map(i => (
        <svg
          key={i}
          className={`${sizeClasses[size].dot}`}
          viewBox="0 0 24 24"
          fill={color}
          style={{
            animation: 'sparkle 1s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      ))}
      <style jsx>
        {`
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}
      </style>
    </div>
  );
}

export function AIThinkingAnimation({
  platform = 'generic',
  style: customStyle,
  text,
  showText = true,
  size = 'md',
  color: customColor,
  className = '',
}: AIThinkingAnimationProps) {
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const animStyle = customStyle || platformStyles[platform];
  const animColor = customColor || platformColors[platform];

  const thinkingTexts = [
    'Thinking...',
    'Processing...',
    'Analyzing...',
    'Generating response...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingPhase(prev => (prev + 1) % thinkingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const displayText = text || thinkingTexts[thinkingPhase];

  const renderAnimation = () => {
    switch (animStyle) {
      case 'dots':
        return <DotsAnimation size={size} color={animColor} />;
      case 'pulse':
        return <PulseAnimation size={size} color={animColor} />;
      case 'wave':
        return <WaveAnimation size={size} color={animColor} />;
      case 'spinner':
        return <SpinnerAnimation size={size} color={animColor} />;
      case 'typing':
        return <TypingAnimation size={size} color={animColor} />;
      case 'brain':
        return <BrainAnimation size={size} color={animColor} />;
      case 'sparkle':
        return <SparkleAnimation size={size} color={animColor} />;
      default:
        return <DotsAnimation size={size} color={animColor} />;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {renderAnimation()}
      {showText && (
        <span
          className={`${sizeClasses[size].text} text-gray-500 dark:text-gray-400`}
          style={{ color: customColor ? animColor : undefined }}
        >
          {displayText}
        </span>
      )}
    </div>
  );
}

// Full thinking message bubble
type ThinkingBubbleProps = {
  platform?: AIPlatform;
  showAvatar?: boolean;
  avatarUrl?: string;
  className?: string;
};

export function ThinkingBubble({
  platform = 'generic',
  showAvatar = true,
  avatarUrl,
  className = '',
}: ThinkingBubbleProps) {
  const getBubbleStyle = () => {
    switch (platform) {
      case 'chatgpt':
        return 'bg-gray-50 dark:bg-gray-800';
      case 'claude':
        return 'bg-[#faf9f7] dark:bg-[#2d2a28]';
      case 'gemini':
        return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700';
      case 'perplexity':
        return 'bg-white dark:bg-gray-900';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getAvatarStyle = () => {
    switch (platform) {
      case 'chatgpt':
        return 'bg-[#10a37f]';
      case 'claude':
        return 'bg-[#cc785c]';
      case 'gemini':
        return 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500';
      case 'perplexity':
        return 'bg-[#20808d]';
      default:
        return 'bg-indigo-500';
    }
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {showAvatar && (
        <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-white ${getAvatarStyle()}`}>
          {avatarUrl
            ? (
                <img src={avatarUrl} alt="AI" className="size-full rounded-full object-cover" />
              )
            : (
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              )}
        </div>
      )}
      <div className={`rounded-2xl px-4 py-3 ${getBubbleStyle()}`}>
        <AIThinkingAnimation platform={platform} />
      </div>
    </div>
  );
}

// Streaming text animation
type StreamingTextProps = {
  text: string;
  speed?: number; // characters per second
  onComplete?: () => void;
  className?: string;
};

export function StreamingText({
  text,
  speed = 30,
  onComplete,
  className = '',
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />
      )}
    </span>
  );
}

// Search animation for Perplexity-style
type SearchAnimationProps = {
  queries?: string[];
  className?: string;
};

export function SearchAnimation({
  queries = ['Searching the web...', 'Analyzing results...', 'Synthesizing information...'],
  className = '',
}: SearchAnimationProps) {
  const [currentQuery, setCurrentQuery] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const queryInterval = setInterval(() => {
      setCurrentQuery(prev => (prev + 1) % queries.length);
      setProgress(0);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 100));
    }, 100);

    return () => {
      clearInterval(queryInterval);
      clearInterval(progressInterval);
    };
  }, [queries.length]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>{queries[currentQuery]}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-[#20808d] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export type { AIPlatform, AnimationStyle };
