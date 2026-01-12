'use client';

import { useCallback, useRef, useState } from 'react';

type UndoRedoOptions<T> = {
  maxHistory?: number;
  onChange?: (state: T) => void;
};

type UndoRedoReturn<T> = {
  state: T;
  setState: (newState: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (initialState: T) => void;
  historyLength: number;
  currentIndex: number;
};

export function useUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions<T> = {},
): UndoRedoReturn<T> {
  const { maxHistory = 50, onChange } = options;

  // Use refs to store history to avoid re-renders on every history change
  const historyRef = useRef<T[]>([initialState]);
  const currentIndexRef = useRef(0);

  // Track current state for rendering
  const [state, setInternalState] = useState<T>(initialState);
  const [, forceUpdate] = useState({});

  const updateState = useCallback((newState: T, addToHistory = true) => {
    setInternalState(newState);
    onChange?.(newState);

    if (addToHistory) {
      // Remove any redo history when new state is added
      const newHistory = historyRef.current.slice(0, currentIndexRef.current + 1);
      newHistory.push(newState);

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
      } else {
        currentIndexRef.current++;
      }

      historyRef.current = newHistory;
      forceUpdate({});
    }
  }, [maxHistory, onChange]);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    const resolvedState = typeof newState === 'function'
      ? (newState as (prev: T) => T)(state)
      : newState;
    updateState(resolvedState);
  }, [state, updateState]);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current--;
      const previousState = historyRef.current[currentIndexRef.current];
      if (previousState !== undefined) {
        setInternalState(previousState);
        onChange?.(previousState);
        forceUpdate({});
      }
    }
  }, [onChange]);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current++;
      const nextState = historyRef.current[currentIndexRef.current];
      if (nextState !== undefined) {
        setInternalState(nextState);
        onChange?.(nextState);
        forceUpdate({});
      }
    }
  }, [onChange]);

  const reset = useCallback((newInitialState: T) => {
    historyRef.current = [newInitialState];
    currentIndexRef.current = 0;
    setInternalState(newInitialState);
    onChange?.(newInitialState);
    forceUpdate({});
  }, [onChange]);

  const canUndo = currentIndexRef.current > 0;
  const canRedo = currentIndexRef.current < historyRef.current.length - 1;

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: historyRef.current.length,
    currentIndex: currentIndexRef.current,
  };
}

// Debounced version for performance with frequent updates
export function useDebouncedUndoRedo<T>(
  initialState: T,
  options: UndoRedoOptions<T> & { debounceMs?: number } = {},
): UndoRedoReturn<T> & { debouncedSetState: (newState: T | ((prev: T) => T)) => void } {
  const { debounceMs = 300, ...undoRedoOptions } = options;
  const undoRedo = useUndoRedo(initialState, undoRedoOptions);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<T | null>(null);

  const debouncedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    const resolvedState = typeof newState === 'function'
      ? (newState as (prev: T) => T)(undoRedo.state)
      : newState;

    pendingStateRef.current = resolvedState;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to commit to history
    timeoutRef.current = setTimeout(() => {
      if (pendingStateRef.current !== null) {
        undoRedo.setState(pendingStateRef.current);
        pendingStateRef.current = null;
      }
    }, debounceMs);
  }, [undoRedo, debounceMs]);

  return {
    ...undoRedo,
    debouncedSetState,
  };
}
