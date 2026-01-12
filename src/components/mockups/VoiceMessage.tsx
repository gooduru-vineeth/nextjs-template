'use client';

import { useEffect, useRef, useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type VoiceMessageData = {
  id: string;
  duration: number; // in seconds
  waveform?: number[]; // normalized 0-1 values
  url?: string;
};

type VoiceMessageProps = {
  message: VoiceMessageData;
  platform?: Platform;
  sender?: 'sent' | 'received';
  isPlaying?: boolean;
  currentTime?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  maxWidth?: number;
  className?: string;
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Generate random waveform if not provided
const generateWaveform = (bars: number): number[] => {
  return Array.from({ length: bars }, () => 0.2 + Math.random() * 0.8);
};

export function VoiceMessage({
  message,
  platform = 'generic',
  sender = 'received',
  isPlaying = false,
  currentTime = 0,
  onPlay,
  onPause,
  onSeek,
  maxWidth = 280,
  className = '',
}: VoiceMessageProps) {
  const [waveform] = useState<number[]>(message.waveform || generateWaveform(40));
  const waveformRef = useRef<HTMLDivElement>(null);

  const progress = message.duration > 0 ? (currentTime / message.duration) * 100 : 0;

  const getBubbleStyle = () => {
    if (platform === 'whatsapp') {
      return sender === 'sent'
        ? 'bg-[#dcf8c6] dark:bg-[#005c4b]'
        : 'bg-white dark:bg-[#202c33]';
    }
    if (platform === 'imessage') {
      return sender === 'sent'
        ? 'bg-[#007aff]'
        : 'bg-[#e5e5ea] dark:bg-[#3a3a3c]';
    }
    if (platform === 'messenger') {
      return sender === 'sent'
        ? 'bg-[#0084ff]'
        : 'bg-[#f0f0f0] dark:bg-gray-700';
    }
    if (platform === 'telegram') {
      return sender === 'sent'
        ? 'bg-[#effdde] dark:bg-[#2b5278]'
        : 'bg-white dark:bg-gray-800';
    }
    return sender === 'sent'
      ? 'bg-blue-500'
      : 'bg-gray-200 dark:bg-gray-700';
  };

  const getPlayButtonStyle = () => {
    if (platform === 'whatsapp') {
      return 'bg-[#25d366] text-white';
    }
    if (platform === 'imessage' && sender === 'sent') {
      return 'bg-white/20 text-white';
    }
    if (platform === 'messenger' && sender === 'sent') {
      return 'bg-white/20 text-white';
    }
    if (platform === 'telegram') {
      return 'bg-[#3390ec] text-white';
    }
    return 'bg-blue-500 text-white';
  };

  const getWaveformColor = () => {
    if (platform === 'imessage' && sender === 'sent') {
      return { active: 'bg-white', inactive: 'bg-white/40' };
    }
    if (platform === 'messenger' && sender === 'sent') {
      return { active: 'bg-white', inactive: 'bg-white/40' };
    }
    if (platform === 'whatsapp') {
      return { active: 'bg-[#25d366]', inactive: 'bg-gray-400' };
    }
    if (platform === 'telegram') {
      return { active: 'bg-[#3390ec]', inactive: 'bg-gray-300 dark:bg-gray-600' };
    }
    return { active: 'bg-blue-500', inactive: 'bg-gray-300 dark:bg-gray-600' };
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || !onSeek) {
      return;
    }
    const rect = waveformRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    onSeek(position * message.duration);
  };

  const waveformColors = getWaveformColor();
  const playedBars = Math.floor((progress / 100) * waveform.length);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl p-3 ${getBubbleStyle()} ${className}`}
      style={{ maxWidth }}
    >
      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${getPlayButtonStyle()}`}
      >
        {isPlaying
          ? (
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            )
          : (
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
      </button>

      {/* Waveform and Duration */}
      <div className="flex-1">
        {/* Waveform */}
        <div
          ref={waveformRef}
          className="flex h-8 cursor-pointer items-center gap-[2px]"
          onClick={handleWaveformClick}
        >
          {waveform.map((height, index) => (
            <div
              key={index}
              className={`w-[3px] rounded-full transition-colors ${
                index < playedBars ? waveformColors.active : waveformColors.inactive
              }`}
              style={{ height: `${height * 100}%` }}
            />
          ))}
        </div>

        {/* Duration */}
        <div className="mt-1 flex justify-between text-xs">
          <span className={`${sender === 'sent' && (platform === 'imessage' || platform === 'messenger') ? 'text-white/70' : 'text-gray-500'}`}>
            {isPlaying ? formatDuration(currentTime) : formatDuration(message.duration)}
          </span>
          {isPlaying && (
            <span className={`${sender === 'sent' && (platform === 'imessage' || platform === 'messenger') ? 'text-white/70' : 'text-gray-500'}`}>
              -
              {formatDuration(message.duration - currentTime)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Voice message with avatar (WhatsApp style)
type VoiceMessageWithAvatarProps = {
  avatarUrl?: string;
  contactName?: string;
} & VoiceMessageProps;

export function VoiceMessageWithAvatar({
  avatarUrl,
  contactName,
  ...props
}: VoiceMessageWithAvatarProps) {
  return (
    <div className="flex items-end gap-2">
      {props.sender === 'received' && (
        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-300">
          {avatarUrl
            ? (
                <img src={avatarUrl} alt={contactName} className="size-full object-cover" />
              )
            : (
                <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                  {contactName?.[0] || '?'}
                </div>
              )}
        </div>
      )}
      <VoiceMessage {...props} />
    </div>
  );
}

// Voice message recorder UI
type VoiceRecorderProps = {
  isRecording?: boolean;
  duration?: number;
  onStart?: () => void;
  onStop?: () => void;
  onCancel?: () => void;
  platform?: Platform;
  className?: string;
};

export function VoiceRecorder({
  isRecording = false,
  duration = 0,
  onStart,
  onStop,
  onCancel,
  platform = 'generic',
  className = '',
}: VoiceRecorderProps) {
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform(prev => [...prev, 0.2 + Math.random() * 0.8].slice(-50));
      }, 100);
      return () => clearInterval(interval);
    }
    setWaveform([]);
    return undefined;
  }, [isRecording]);

  const getRecordButtonColor = () => {
    if (platform === 'whatsapp') {
      return 'bg-[#25d366]';
    }
    if (platform === 'telegram') {
      return 'bg-[#3390ec]';
    }
    if (platform === 'imessage') {
      return 'bg-[#007aff]';
    }
    return 'bg-red-500';
  };

  if (!isRecording) {
    return (
      <button
        onClick={onStart}
        className={`flex items-center gap-2 rounded-full ${getRecordButtonColor()} px-4 py-2 text-white ${className}`}
      >
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
        <span className="text-sm font-medium">Record</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-3 rounded-full bg-gray-100 px-4 py-2 dark:bg-gray-800 ${className}`}>
      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="rounded-full p-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Recording indicator */}
      <div className="flex items-center gap-2">
        <div className="size-3 animate-pulse rounded-full bg-red-500" />
        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Live waveform */}
      <div className="flex h-6 flex-1 items-center gap-[2px]">
        {waveform.map((height, index) => (
          <div
            key={index}
            className="w-[2px] rounded-full bg-red-400"
            style={{ height: `${height * 100}%` }}
          />
        ))}
      </div>

      {/* Stop button */}
      <button
        onClick={onStop}
        className={`flex size-10 items-center justify-center rounded-full ${getRecordButtonColor()} text-white`}
      >
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      </button>
    </div>
  );
}

// Playback hook for managing voice message state
export function useVoicePlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const play = (messageId: string, duration: number) => {
    // Stop previous playback
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setCurrentMessageId(messageId);
    setCurrentTime(0);
    setIsPlaying(true);

    // Simulate playback
    intervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsPlaying(false);
          return 0;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    setCurrentTime(time);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentMessageId(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    currentMessageId,
    play,
    pause,
    seek,
    stop,
  };
}

export type { VoiceMessageData };
