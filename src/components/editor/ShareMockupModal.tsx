'use client';

import { useCallback, useEffect, useState } from 'react';

type ShareEntry = {
  id: number;
  permission: 'view' | 'edit';
  shareToken: string | null;
  expiresAt: string | null;
  sharedWithEmail: string | null;
  sharedWithUserId: number | null;
  sharedWithUserName: string | null;
  sharedWithUserEmail: string | null;
  createdAt: string;
};

type ShareMockupModalProps = {
  mockupId: number;
  mockupName: string;
  isOpen: boolean;
  onClose: () => void;
};

export function ShareMockupModal({ mockupId, mockupName, isOpen, onClose }: ShareMockupModalProps) {
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [linkExpiresDays, setLinkExpiresDays] = useState(7);

  const fetchShares = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/mockups/${mockupId}/shares`);
      if (res.ok) {
        const data = await res.json();
        setShares(data.shares);
      }
    } catch (err) {
      console.error('Failed to fetch shares:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mockupId]);

  useEffect(() => {
    if (isOpen) {
      fetchShares();
    }
  }, [isOpen, fetchShares]);

  const handleShareWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      const res = await fetch(`/api/mockups/${mockupId}/shares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), permission }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to share mockup');
        return;
      }

      setSuccess(`Shared with ${email}`);
      setEmail('');
      fetchShares();
    } catch (err) {
      setError('Failed to share mockup');
    }
  };

  const handleCreateShareLink = async () => {
    setError(null);
    setSuccess(null);
    setIsCreatingLink(true);

    try {
      const res = await fetch(`/api/mockups/${mockupId}/shares`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generateLink: true,
          permission,
          expiresInDays: linkExpiresDays,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create share link');
        return;
      }

      setSuccess('Share link created');
      fetchShares();
    } catch (err) {
      setError('Failed to create share link');
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleUpdatePermission = async (shareId: number, newPermission: 'view' | 'edit') => {
    try {
      const res = await fetch(`/api/mockups/${mockupId}/shares?shareId=${shareId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permission: newPermission }),
      });

      if (res.ok) {
        fetchShares();
      }
    } catch (err) {
      console.error('Failed to update permission:', err);
    }
  };

  const handleRemoveShare = async (shareId: number) => {
    try {
      const res = await fetch(`/api/mockups/${mockupId}/shares?shareId=${shareId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchShares();
      }
    } catch (err) {
      console.error('Failed to remove share:', err);
    }
  };

  const copyShareLink = async (token: string) => {
    const url = `${window.location.origin}/mockup/${mockupId}?token=${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setSuccess('Link copied to clipboard');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Share &quot;
            {mockupName}
            &quot;
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

        {/* Error/Success messages */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Share with email */}
        <form onSubmit={handleShareWithEmail} className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Share with email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={permission}
              onChange={e => setPermission(e.target.value as 'view' | 'edit')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Share
            </button>
          </div>
        </form>

        {/* Generate share link */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-600">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Generate share link
          </h3>
          <div className="mb-3 flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">Expires in:</label>
            <select
              value={linkExpiresDays}
              onChange={e => setLinkExpiresDays(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>1 day</option>
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleCreateShareLink}
            disabled={isCreatingLink}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {isCreatingLink ? 'Creating...' : 'Create Link'}
          </button>
        </div>

        {/* Current shares */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            People with access
          </h3>
          {isLoading
            ? (
                <div className="py-4 text-center text-sm text-gray-500">Loading...</div>
              )
            : shares.length === 0
              ? (
                  <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No one else has access yet
                  </div>
                )
              : (
                  <ul className="max-h-60 space-y-2 overflow-y-auto">
                    {shares.map(share => (
                      <li
                        key={share.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                      >
                        <div className="flex-1">
                          {share.shareToken
                            ? (
                                <div className="flex items-center gap-2">
                                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                  <span className="text-sm text-gray-700 dark:text-gray-300">Share link</span>
                                  {share.expiresAt && (
                                    <span className="text-xs text-gray-500">
                                      (expires
                                      {' '}
                                      {new Date(share.expiresAt).toLocaleDateString()}
                                      )
                                    </span>
                                  )}
                                </div>
                              )
                            : (
                                <div className="flex items-center gap-2">
                                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                                    {(share.sharedWithUserName ?? share.sharedWithEmail ?? 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {share.sharedWithUserName || share.sharedWithEmail || 'Unknown user'}
                                    </div>
                                    {share.sharedWithUserEmail && share.sharedWithUserName && (
                                      <div className="text-xs text-gray-500">{share.sharedWithUserEmail}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                        </div>
                        <div className="flex items-center gap-2">
                          {share.shareToken && (
                            <button
                              type="button"
                              onClick={() => copyShareLink(share.shareToken!)}
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                              title="Copy link"
                            >
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          )}
                          <select
                            value={share.permission}
                            onChange={e => handleUpdatePermission(share.id, e.target.value as 'view' | 'edit')}
                            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          >
                            <option value="view">View</option>
                            <option value="edit">Edit</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveShare(share.id)}
                            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                            title="Remove access"
                          >
                            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
        </div>
      </div>
    </div>
  );
}
