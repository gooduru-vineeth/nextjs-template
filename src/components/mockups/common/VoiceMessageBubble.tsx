'use client';

import type { ThemeMode } from '@/types/Mockup';

type VoiceMessageBubbleProps = {
  duration: string; // e.g., "0:32"
  isSender: boolean;
  theme?: ThemeMode;
  platform?: 'whatsapp' | 'imessage' | 'telegram' | 'messenger';
  isPlaying?: boolean;
  timestamp?: string;
  progress?: number; // 0-100 percentage for playback progress
};

// Generate a random but consistent waveform pattern based on duration
function generateWaveformBars(duration: string, seed: number = 42): number[] {
  const bars: number[] = [];
  const numBars = 35; // Number of bars in the waveform

  // Parse duration to get a seed for randomness
  const durationParts = duration.split(':');
  const seconds = Number.parseInt(durationParts[0] || '0') * 60 + Number.parseInt(durationParts[1] || '0');
  const baseSeed = seconds + seed;

  // Generate waveform heights using a simple pseudo-random function
  for (let i = 0; i < numBars; i++) {
    // Create a pseudo-random but reproducible pattern
    const randomValue = Math.sin(baseSeed * (i + 1) * 0.7) * 0.5 + 0.5;
    // Add some natural envelope (higher in middle, lower at edges)
    const envelope = Math.sin((i / numBars) * Math.PI) * 0.4 + 0.6;
    const height = randomValue * envelope;
    bars.push(Math.max(0.15, Math.min(1, height)));
  }

  return bars;
}

export function VoiceMessageBubble({
  duration,
  isSender,
  theme = 'light',
  platform = 'whatsapp',
  isPlaying = false,
  timestamp,
  progress = 0,
}: VoiceMessageBubbleProps) {
  const isDark = theme === 'dark';
  const waveformBars = generateWaveformBars(duration);

  // Platform-specific colors
  const getBubbleColor = () => {
    if (isSender) {
      switch (platform) {
        case 'whatsapp':
          return isDark ? 'bg-[#005c4b]' : 'bg-[#dcf8c6]';
        case 'imessage':
          return 'bg-[#007aff]';
        case 'telegram':
          return isDark ? 'bg-[#2b5278]' : 'bg-[#effdde]';
        case 'messenger':
          return 'bg-[#0084ff]';
        default:
          return isDark ? 'bg-[#005c4b]' : 'bg-[#dcf8c6]';
      }
    } else {
      switch (platform) {
        case 'whatsapp':
          return isDark ? 'bg-[#202c33]' : 'bg-white';
        case 'imessage':
          return isDark ? 'bg-[#3a3a3c]' : 'bg-[#e9e9eb]';
        case 'telegram':
          return isDark ? 'bg-[#182533]' : 'bg-white';
        case 'messenger':
          return isDark ? 'bg-[#3a3a3c]' : 'bg-[#e4e6eb]';
        default:
          return isDark ? 'bg-[#202c33]' : 'bg-white';
      }
    }
  };

  const getWaveformColor = () => {
    if (isSender) {
      switch (platform) {
        case 'imessage':
        case 'messenger':
          return 'bg-white/60';
        default:
          return isDark ? 'bg-[#8696a0]' : 'bg-[#54656f]';
      }
    }
    return isDark ? 'bg-[#8696a0]' : 'bg-[#54656f]';
  };

  const getWaveformActiveColor = () => {
    if (isSender) {
      switch (platform) {
        case 'imessage':
        case 'messenger':
          return 'bg-white';
        default:
          return isDark ? 'bg-[#00a884]' : 'bg-[#25d366]';
      }
    }
    return isDark ? 'bg-[#00a884]' : 'bg-[#25d366]';
  };

  const getTextColor = () => {
    if (isSender) {
      switch (platform) {
        case 'imessage':
        case 'messenger':
          return 'text-white';
        default:
          return isDark ? 'text-white' : 'text-gray-700';
      }
    }
    return isDark ? 'text-white' : 'text-gray-700';
  };

  // Calculate which bars should be highlighted based on progress
  const activeBarIndex = Math.floor((progress / 100) * waveformBars.length);

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} px-4 py-0.5`}>
      <div
        className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${getBubbleColor()} max-w-[75%]`}
      >
        {/* Play/Pause button */}
        <button
          type="button"
          className={`flex size-10 flex-shrink-0 items-center justify-center rounded-full ${
            isSender
              ? (platform === 'imessage' || platform === 'messenger' ? 'bg-white/20' : 'bg-[#00a884]')
              : 'bg-[#00a884]'
          }`}
        >
          {isPlaying
            ? (
                <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )
            : (
                <svg className="size-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
        </button>

        {/* Waveform and duration */}
        <div className="flex flex-1 flex-col gap-1">
          {/* Waveform bars */}
          <div className="flex h-6 items-center gap-0.5">
            {waveformBars.map((height, idx) => (
              <div
                key={idx}
                className={`w-0.5 rounded-full transition-all ${
                  idx < activeBarIndex ? getWaveformActiveColor() : getWaveformColor()
                }`}
                style={{
                  height: `${height * 100}%`,
                  minHeight: '3px',
                }}
              />
            ))}
          </div>

          {/* Duration and timestamp */}
          <div className={`flex items-center justify-between text-xs ${getTextColor()}`}>
            <span className="opacity-70">{duration}</span>
            {timestamp && <span className="opacity-50">{timestamp}</span>}
          </div>
        </div>

        {/* Avatar for received messages (WhatsApp style) */}
        {!isSender && platform === 'whatsapp' && (
          <div className="size-8 flex-shrink-0 rounded-full bg-gray-400">
            <svg className="size-full text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
