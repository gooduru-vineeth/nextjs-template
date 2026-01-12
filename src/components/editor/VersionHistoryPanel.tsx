'use client';

import { useCallback, useEffect, useState } from 'react';

type Version = {
  id: number;
  versionNumber: number;
  name: string;
  thumbnailUrl: string | null;
  changeDescription: string | null;
  createdAt: string;
};

type VersionHistoryPanelProps = {
  mockupId: number;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (versionData: { name: string; data: unknown; appearance: unknown }) => void;
};

export function VersionHistoryPanel({ mockupId, isOpen, onClose, onRestore }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRestoring, setIsRestoring] = useState<number | null>(null);
  const [changeDescription, setChangeDescription] = useState('');

  const fetchVersions = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/mockups/${mockupId}/versions`);
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions);
      }
    } catch (err) {
      console.error('Failed to fetch versions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mockupId]);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, fetchVersions]);

  const handleSaveVersion = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/mockups/${mockupId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changeDescription: changeDescription.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save version');
        return;
      }

      setSuccess(`Version ${data.version.versionNumber} saved`);
      setChangeDescription('');
      fetchVersions();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to save version');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreVersion = async (versionId: number) => {
    setError(null);
    setSuccess(null);
    setIsRestoring(versionId);

    try {
      // First, get the version data
      const getRes = await fetch(`/api/mockups/${mockupId}/versions/${versionId}`);
      if (!getRes.ok) {
        const data = await getRes.json();
        setError(data.error || 'Failed to get version');
        return;
      }

      const versionData = await getRes.json();

      // Then restore it
      const restoreRes = await fetch(`/api/mockups/${mockupId}/versions/${versionId}`, {
        method: 'POST',
      });

      const restoreData = await restoreRes.json();

      if (!restoreRes.ok) {
        setError(restoreData.error || 'Failed to restore version');
        return;
      }

      setSuccess(restoreData.message);

      // Call the onRestore callback to update the editor
      onRestore({
        name: versionData.version.name,
        data: versionData.version.data,
        appearance: versionData.version.appearance,
      });

      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to restore version');
    } finally {
      setIsRestoring(null);
    }
  };

  const handleDeleteVersion = async (versionId: number) => {
    if (!confirm('Are you sure you want to delete this version?')) {
      return;
    }

    try {
      const res = await fetch(`/api/mockups/${mockupId}/versions/${versionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchVersions();
      }
    } catch (err) {
      console.error('Failed to delete version:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Version History
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Save new version */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <textarea
          value={changeDescription}
          onChange={e => setChangeDescription(e.target.value)}
          placeholder="Describe your changes (optional)..."
          className="mb-2 w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={2}
        />
        <button
          type="button"
          onClick={handleSaveVersion}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {isSaving ? 'Saving...' : 'Save Current Version'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-4 mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Version list */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading
          ? (
              <div className="py-8 text-center text-sm text-gray-500">Loading versions...</div>
            )
          : versions.length === 0
            ? (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto mb-2 size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No versions saved yet
                </div>
              )
            : (
                <ul className="space-y-3">
                  {versions.map(version => (
                    <li
                      key={version.id}
                      className="rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Version
                          {' '}
                          {version.versionNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(version.createdAt)}
                        </span>
                      </div>
                      {version.changeDescription && (
                        <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">
                          {version.changeDescription}
                        </p>
                      )}
                      {version.thumbnailUrl && (
                        <img
                          src={version.thumbnailUrl}
                          alt={`Version ${version.versionNumber}`}
                          className="mb-2 h-20 w-full rounded object-cover"
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleRestoreVersion(version.id)}
                          disabled={isRestoring === version.id}
                          className="flex flex-1 items-center justify-center gap-1 rounded bg-gray-100 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          {isRestoring === version.id ? 'Restoring...' : 'Restore'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVersion(version.id)}
                          className="rounded bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                          title="Delete version"
                        >
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
      </div>

      {/* Footer info */}
      <div className="border-t border-gray-200 p-3 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Up to 50 versions are stored
      </div>
    </div>
  );
}
