'use client';

import { useCallback, useState } from 'react';

type SaveMockupOptions = {
  name: string;
  type: 'chat' | 'ai' | 'social';
  platform: string;
  data: Record<string, unknown>;
  appearance?: Record<string, unknown>;
  isPublic?: boolean;
};

type UpdateMockupOptions = {
  id: number;
  name?: string;
  data?: Record<string, unknown>;
  appearance?: Record<string, unknown>;
  isPublic?: boolean;
};

type UseMockupSaveReturn = {
  isSaving: boolean;
  error: string | null;
  saveToCloud: (options: SaveMockupOptions) => Promise<{ id: number } | null>;
  updateInCloud: (options: UpdateMockupOptions) => Promise<boolean>;
  loadFromCloud: (id: number) => Promise<Record<string, unknown> | null>;
};

export function useMockupSave(): UseMockupSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveToCloud = useCallback(async (options: SaveMockupOptions) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/mockups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: options.name,
          type: options.type,
          platform: options.platform,
          data: options.data,
          appearance: options.appearance || {},
          isPublic: options.isPublic || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save mockup');
      }

      const result = await response.json();
      return { id: result.mockup.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save mockup';
      setError(errorMessage);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateInCloud = useCallback(async (options: UpdateMockupOptions) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/mockups/${options.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: options.name,
          data: options.data,
          appearance: options.appearance,
          isPublic: options.isPublic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update mockup');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update mockup';
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const loadFromCloud = useCallback(async (id: number) => {
    setError(null);

    try {
      const response = await fetch(`/api/mockups/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load mockup');
      }

      const result = await response.json();
      return result.mockup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load mockup';
      setError(errorMessage);
      return null;
    }
  }, []);

  return {
    isSaving,
    error,
    saveToCloud,
    updateInCloud,
    loadFromCloud,
  };
}
