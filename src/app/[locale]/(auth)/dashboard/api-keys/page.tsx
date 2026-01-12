'use client';

import { useCallback, useState } from 'react';

type ApiKey = {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  expiresAt?: string;
  permissions: ('read' | 'write' | 'delete')[];
  usageCount: number;
  rateLimit: number;
};

// Mock data
const mockApiKeys: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production API Key',
    key: 'mf_live_a1b2c3d4e5f6g7h8i9j0...',
    createdAt: 'Jan 5, 2026',
    lastUsed: '2 hours ago',
    permissions: ['read', 'write', 'delete'],
    usageCount: 1250,
    rateLimit: 1000,
  },
  {
    id: 'key_2',
    name: 'Development Key',
    key: 'mf_test_k1l2m3n4o5p6q7r8s9t0...',
    createdAt: 'Jan 8, 2026',
    lastUsed: '5 minutes ago',
    permissions: ['read', 'write'],
    usageCount: 342,
    rateLimit: 100,
  },
  {
    id: 'key_3',
    name: 'CI/CD Integration',
    key: 'mf_live_u1v2w3x4y5z6a7b8c9d0...',
    createdAt: 'Jan 10, 2026',
    expiresAt: 'Feb 10, 2026',
    permissions: ['read'],
    usageCount: 89,
    rateLimit: 500,
  },
];

function maskKey(key: string): string {
  if (key.length <= 20) {
    return key;
  }
  return `${key.substring(0, 15)}...${key.substring(key.length - 4)}`;
}

function PermissionBadge({ permission }: { permission: string }) {
  const colors: Record<string, string> = {
    read: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    write: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${colors[permission] || 'bg-gray-100 text-gray-700'}`}>
      {permission}
    </span>
  );
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<('read' | 'write' | 'delete')[]>(['read']);
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(100);
  const [isCreating, setIsCreating] = useState(false);

  const copyToClipboard = useCallback(async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleCreateKey = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `mf_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      permissions: newKeyPermissions,
      usageCount: 0,
      rateLimit: newKeyRateLimit,
    };

    setApiKeys(prev => [newKey, ...prev]);
    setShowCreateModal(false);
    setNewKeyName('');
    setNewKeyPermissions(['read']);
    setNewKeyRateLimit(100);
    setIsCreating(false);
  };

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
    setShowDeleteModal(null);
  };

  const togglePermission = (permission: 'read' | 'write' | 'delete') => {
    setNewKeyPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission);
      }
      return [...prev, permission];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your API keys for programmatic access to MockFlow
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create API Key
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Banner */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
          <div className="flex gap-3">
            <svg className="size-6 shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">API Key Security</h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Keep your API keys secure and never share them publicly. API keys grant access to your MockFlow account and should be treated like passwords.
              </p>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map(apiKey => (
            <div
              key={apiKey.id}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{apiKey.name}</h3>
                    {apiKey.expiresAt && (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Expires
                        {' '}
                        {apiKey.expiresAt}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      {maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      title="Copy to clipboard"
                    >
                      {copiedKeyId === apiKey.id
                        ? (
                            <svg className="size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )
                        : (
                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {apiKey.permissions.map(permission => (
                      <PermissionBadge key={permission} permission={permission} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(apiKey.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Revoke
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-4 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{apiKey.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Used</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{apiKey.lastUsed || 'Never'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Usage</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {apiKey.usageCount.toLocaleString()}
                    {' '}
                    requests
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rate Limit</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {apiKey.rateLimit}
                    /min
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {apiKeys.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No API Keys</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Create your first API key to start using the MockFlow API.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create API Key
            </button>
          </div>
        )}

        {/* Documentation Link */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">API Documentation</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Learn how to use the MockFlow API to create and manage mockups programmatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/docs/api"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Documentation
            </a>
            <a
              href="/docs/api/examples"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code Examples
            </a>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create API Key</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['read', 'write', 'delete'] as const).map(permission => (
                    <button
                      key={permission}
                      onClick={() => togglePermission(permission)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                        newKeyPermissions.includes(permission)
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {permission}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rate Limit (requests/minute)
                </label>
                <select
                  value={newKeyRateLimit}
                  onChange={e => setNewKeyRateLimit(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value={10}>10 requests/min (Testing)</option>
                  <option value={100}>100 requests/min (Development)</option>
                  <option value={500}>500 requests/min (Standard)</option>
                  <option value={1000}>1000 requests/min (Professional)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={!newKeyName || newKeyPermissions.length === 0 || isCreating}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating && (
                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isCreating ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-6">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="size-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">Revoke API Key</h2>
              <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                Are you sure you want to revoke this API key? This action cannot be undone and any applications using this key will stop working.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteKey(showDeleteModal)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
