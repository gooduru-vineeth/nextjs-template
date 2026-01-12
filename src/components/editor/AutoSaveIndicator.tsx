'use client';

import { useEffect, useState } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type AutoSaveIndicatorProps = {
  status: SaveStatus;
  lastSaved?: Date;
  onRetry?: () => void;
  showTimestamp?: boolean;
  position?: 'inline' | 'fixed';
};

export function AutoSaveIndicator({
  status,
  lastSaved,
  onRetry,
  showTimestamp = true,
  position = 'inline',
}: AutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!lastSaved) {
      return;
    }

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 10) {
        setTimeAgo('just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}m ago`);
      } else if (hours < 24) {
        setTimeAgo(`${hours}h ago`);
      } else {
        setTimeAgo(lastSaved.toLocaleDateString());
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return (
          <div className="flex items-center gap-2">
            <svg
              className="size-4 animate-spin text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">Saving...</span>
          </div>
        );

      case 'saved':
        return (
          <div className="flex items-center gap-2">
            <svg
              className="size-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Saved
              {' '}
              {showTimestamp && timeAgo && (
                <span className="text-gray-400 dark:text-gray-500">
                  •
                  {timeAgo}
                </span>
              )}
            </span>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center gap-2">
            <svg
              className="size-4 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-red-500">Failed to save</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm font-medium text-blue-500 hover:text-blue-600"
              >
                Retry
              </button>
            )}
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-2">
            <svg
              className="size-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {showTimestamp && lastSaved && timeAgo ? `Last saved ${timeAgo}` : 'Ready'}
            </span>
          </div>
        );
    }
  };

  if (position === 'fixed') {
    return (
      <div className="fixed right-4 bottom-4 z-50 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {getStatusContent()}
      </div>
    );
  }

  return getStatusContent();
}

// Hook for managing auto-save state
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  options?: {
    debounceMs?: number;
    enabled?: boolean;
  },
) {
  const { debounceMs = 2000, enabled = true } = options ?? {};
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setStatus('saving');
      try {
        await onSave(data);
        setStatus('saved');
        setLastSaved(new Date());
        setError(null);
      } catch (e) {
        setStatus('error');
        setError(e instanceof Error ? e : new Error('Save failed'));
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [data, onSave, debounceMs, enabled]);

  const retry = async () => {
    setStatus('saving');
    try {
      await onSave(data);
      setStatus('saved');
      setLastSaved(new Date());
      setError(null);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e : new Error('Save failed'));
    }
  };

  return {
    status,
    lastSaved,
    error,
    retry,
  };
}

// Compact version for toolbar display
type CompactAutoSaveIndicatorProps = {
  status: SaveStatus;
  lastSaved?: Date;
};

export function CompactAutoSaveIndicator({ status, lastSaved }: CompactAutoSaveIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (!lastSaved) {
      return;
    }

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);

      if (seconds < 60) {
        setTimeAgo('now');
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}m`);
      } else {
        setTimeAgo(lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000);

    return () => clearInterval(interval);
  }, [lastSaved]);

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return (
          <div className="size-2 animate-pulse rounded-full bg-blue-500" title="Saving..." />
        );
      case 'saved':
        return (
          <div className="size-2 rounded-full bg-green-500" title={`Saved ${timeAgo}`} />
        );
      case 'error':
        return (
          <div className="size-2 rounded-full bg-red-500" title="Save failed" />
        );
      default:
        return (
          <div className="size-2 rounded-full bg-gray-400" title="Ready" />
        );
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {getStatusIcon()}
      {status === 'saved' && timeAgo && (
        <span className="text-xs text-gray-400">{timeAgo}</span>
      )}
    </div>
  );
}
