'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type AutoSaveOptions = {
  key: string;
  data: unknown;
  debounceMs?: number;
  enabled?: boolean;
  onSave?: () => void;
  onLoad?: (data: unknown) => void;
};

type AutoSaveState = {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
};

export function useAutoSave({
  key,
  data,
  debounceMs = 2000,
  enabled = true,
  onSave,
  onLoad,
}: AutoSaveOptions) {
  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string | null>(null);
  const initialLoadDoneRef = useRef(false);

  // Load saved data on mount
  useEffect(() => {
    if (!enabled || initialLoadDoneRef.current) {
      return;
    }

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data && onLoad) {
          onLoad(parsed.data);
          setState(prev => ({
            ...prev,
            lastSaved: parsed.timestamp ? new Date(parsed.timestamp) : null,
          }));
          lastSavedDataRef.current = JSON.stringify(parsed.data);
        }
      }
    } catch (error) {
      console.error('Failed to load auto-saved data:', error);
    }

    initialLoadDoneRef.current = true;
  }, [key, enabled, onLoad]);

  // Save function
  const save = useCallback(() => {
    if (!enabled) {
      return;
    }

    const dataString = JSON.stringify(data);

    // Skip if data hasn't changed
    if (dataString === lastSavedDataRef.current) {
      setState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isSaving: true }));

    try {
      const savePayload = {
        data,
        timestamp: new Date().toISOString(),
        version: 1,
      };

      localStorage.setItem(key, JSON.stringify(savePayload));
      lastSavedDataRef.current = dataString;

      setState({
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      });

      onSave?.();
    } catch (error) {
      console.error('Failed to auto-save:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [key, data, enabled, onSave]);

  // Debounced save on data change
  useEffect(() => {
    if (!enabled || !initialLoadDoneRef.current) {
      return;
    }

    const dataString = JSON.stringify(data);
    const hasChanges = dataString !== lastSavedDataRef.current;

    setState(prev => ({
      ...prev,
      hasUnsavedChanges: hasChanges,
    }));

    if (!hasChanges) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled, save]);

  // Save on window unload
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleBeforeUnload = () => {
      if (state.hasUnsavedChanges) {
        save();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, state.hasUnsavedChanges, save]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
      lastSavedDataRef.current = null;
      setState({
        isSaving: false,
        lastSaved: null,
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, [key]);

  return {
    ...state,
    saveNow,
    clearSaved,
  };
}

// Format the last saved time for display
export function formatLastSaved(date: Date | null): string {
  if (!date) {
    return 'Not saved';
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10) {
    return 'Just now';
  }
  if (diffSec < 60) {
    return `${diffSec}s ago`;
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  if (diffHour < 24) {
    return `${diffHour}h ago`;
  }

  return date.toLocaleDateString();
}
