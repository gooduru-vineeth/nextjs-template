'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'sent' | 'received';
  senderName?: string;
};

type TimelineMarker = {
  id: string;
  timestamp: Date;
  label?: string;
  color?: string;
};

type MessageTimelineProps = {
  messages: Message[];
  markers?: TimelineMarker[];
  startTime?: Date;
  endTime?: Date;
  onTimeChange?: (time: Date) => void;
  onMessageSelect?: (messageId: string) => void;
  selectedMessageId?: string;
  className?: string;
};

export function MessageTimeline({
  messages,
  markers = [],
  startTime,
  endTime,
  onTimeChange,
  onMessageSelect,
  selectedMessageId,
  className = '',
}: MessageTimelineProps) {
  const [currentTime, setCurrentTime] = useState<Date>(startTime || new Date());
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate time range
  const minTime = startTime || (messages.length > 0 ? new Date(Math.min(...messages.map(m => m.timestamp.getTime()))) : new Date());
  const maxTime = endTime || (messages.length > 0 ? new Date(Math.max(...messages.map(m => m.timestamp.getTime()))) : new Date());
  const timeRange = maxTime.getTime() - minTime.getTime();

  const getPositionFromTime = useCallback((time: Date) => {
    if (timeRange === 0) {
      return 0;
    }
    return ((time.getTime() - minTime.getTime()) / timeRange) * 100;
  }, [minTime, timeRange]);

  const getTimeFromPosition = useCallback((position: number) => {
    const time = minTime.getTime() + (position / 100) * timeRange;
    return new Date(time);
  }, [minTime, timeRange]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) {
      return;
    }
    const rect = timelineRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = getTimeFromPosition(Math.max(0, Math.min(100, position)));
    setCurrentTime(newTime);
    onTimeChange?.(newTime);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !timelineRef.current) {
        return;
      }
      const rect = timelineRef.current.getBoundingClientRect();
      const position = ((e.clientX - rect.left) / rect.width) * 100;
      const newTime = getTimeFromPosition(Math.max(0, Math.min(100, position)));
      setCurrentTime(newTime);
      onTimeChange?.(newTime);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, getTimeFromPosition, onTimeChange]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Message Timeline</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {messages.length}
          {' '}
          messages
        </span>
      </div>

      {/* Current time display */}
      <div className="mb-4 text-center">
        <span className="text-lg font-medium text-gray-900 dark:text-white">
          {formatDate(currentTime)}
          {' '}
          {formatTime(currentTime)}
        </span>
      </div>

      {/* Timeline track */}
      <div
        ref={timelineRef}
        className="relative h-12 cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-700"
        onClick={handleTimelineClick}
      >
        {/* Message markers */}
        {messages.map((message) => {
          const position = getPositionFromTime(message.timestamp);
          return (
            <button
              key={message.id}
              onClick={(e) => {
                e.stopPropagation();
                onMessageSelect?.(message.id);
              }}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 ${
                selectedMessageId === message.id ? 'z-10 scale-125' : ''
              }`}
              style={{ left: `${position}%` }}
              title={`${message.senderName || message.sender}: ${message.content.slice(0, 50)}...`}
            >
              <div
                className={`size-3 rounded-full ${
                  message.sender === 'sent'
                    ? 'bg-blue-500'
                    : 'bg-gray-400 dark:bg-gray-500'
                } ${selectedMessageId === message.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              />
            </button>
          );
        })}

        {/* Custom markers */}
        {markers.map((marker) => {
          const position = getPositionFromTime(marker.timestamp);
          return (
            <div
              key={marker.id}
              className="absolute top-0 h-full w-0.5"
              style={{ left: `${position}%`, backgroundColor: marker.color || '#ef4444' }}
              title={marker.label}
            >
              {marker.label && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-red-500 px-1 py-0.5 text-xs whitespace-nowrap text-white">
                  {marker.label}
                </div>
              )}
            </div>
          );
        })}

        {/* Current time indicator */}
        <div
          className="absolute top-0 h-full w-0.5 cursor-grab bg-blue-500 active:cursor-grabbing"
          style={{ left: `${getPositionFromTime(currentTime)}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full border-2 border-white bg-blue-500 shadow" />
        </div>
      </div>

      {/* Time labels */}
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>{formatTime(minTime)}</span>
        <span>{formatTime(maxTime)}</span>
      </div>

      {/* Message list by time */}
      <div className="mt-4 max-h-48 overflow-y-auto">
        <div className="space-y-2">
          {messages
            .filter(m => m.timestamp <= currentTime)
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            .map(message => (
              <button
                key={message.id}
                onClick={() => onMessageSelect?.(message.id)}
                className={`w-full rounded-lg p-2 text-left transition-colors ${
                  selectedMessageId === message.id
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    message.sender === 'sent' ? 'text-blue-600' : 'text-gray-500'
                  }`}
                  >
                    {message.senderName || (message.sender === 'sent' ? 'You' : 'Contact')}
                  </span>
                  <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-gray-700 dark:text-gray-300">
                  {message.content}
                </p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// Compact timeline for toolbar
type CompactTimelineProps = {
  messages: Message[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
};

export function CompactTimeline({
  messages,
  currentIndex,
  onIndexChange,
  className = '',
}: CompactTimelineProps) {
  const handlePrev = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < messages.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex items-center gap-1">
        {messages.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`size-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-blue-500'
                : index < currentIndex
                  ? 'bg-blue-200 dark:bg-blue-800'
                  : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentIndex === messages.length - 1}
        className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <span className="ml-2 text-xs text-gray-500">
        {currentIndex + 1}
        {' '}
        /
        {messages.length}
      </span>
    </div>
  );
}

// Playback controls for timeline animation
type PlaybackControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
};

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  className = '',
}: PlaybackControlsProps) {
  const speeds = [0.5, 1, 1.5, 2];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Reset */}
      <button
        onClick={onReset}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Reset"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Step backward */}
      <button
        onClick={onStepBackward}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Previous"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        onClick={onPlayPause}
        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying
          ? (
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          : (
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
      </button>

      {/* Step forward */}
      <button
        onClick={onStepForward}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Next"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Speed selector */}
      <div className="ml-2 flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 dark:border-gray-700">
        <span className="text-xs text-gray-500">Speed:</span>
        <select
          value={speed}
          onChange={e => onSpeedChange(Number(e.target.value))}
          className="bg-transparent text-xs text-gray-700 dark:text-gray-300"
        >
          {speeds.map(s => (
            <option key={s} value={s}>
              {s}
              x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
