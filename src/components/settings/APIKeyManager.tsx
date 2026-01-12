'use client';

import {
  Activity,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Key,
  Lock,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type APIKey = {
  id: string;
  name: string;
  key: string;
  prefix: string;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  scopes: string[];
  status: 'active' | 'expired' | 'revoked';
  rateLimit?: number;
  usageCount?: number;
  createdBy?: string;
};

export type APIScope = {
  id: string;
  name: string;
  description: string;
  category: 'read' | 'write' | 'delete' | 'admin';
};

export type APIUsageStats = {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  requestsByDay: { date: string; count: number }[];
};

type APIKeyManagerProps = {
  apiKeys: APIKey[];
  availableScopes?: APIScope[];
  usageStats?: APIUsageStats;
  onCreateKey?: (name: string, scopes: string[], expiresIn?: number) => Promise<string>;
  onRevokeKey?: (keyId: string) => void;
  onRegenerateKey?: (keyId: string) => Promise<string>;
  onDeleteKey?: (keyId: string) => void;
  onUpdateKey?: (keyId: string, updates: Partial<APIKey>) => void;
  maxKeys?: number;
  variant?: 'full' | 'compact' | 'list';
  className?: string;
};

// Default scopes
const DEFAULT_SCOPES: APIScope[] = [
  { id: 'mockups:read', name: 'Read Mockups', description: 'View and list mockups', category: 'read' },
  { id: 'mockups:write', name: 'Create/Update Mockups', description: 'Create and modify mockups', category: 'write' },
  { id: 'mockups:delete', name: 'Delete Mockups', description: 'Delete mockups', category: 'delete' },
  { id: 'templates:read', name: 'Read Templates', description: 'View and list templates', category: 'read' },
  { id: 'templates:write', name: 'Create/Update Templates', description: 'Create and modify templates', category: 'write' },
  { id: 'exports:create', name: 'Create Exports', description: 'Export mockups', category: 'write' },
  { id: 'team:read', name: 'Read Team', description: 'View team information', category: 'read' },
  { id: 'team:manage', name: 'Manage Team', description: 'Manage team members and settings', category: 'admin' },
];

// Expiration options
const EXPIRATION_OPTIONS = [
  { label: 'Never', value: 0 },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: '1 year', value: 365 },
];

// Helper to mask API key
const maskAPIKey = (key: string): string => {
  if (key.length < 12) {
    return '•'.repeat(key.length);
  }
  return key.slice(0, 8) + '•'.repeat(20) + key.slice(-4);
};

// Helper to get time ago string
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) {
    return 'Just now';
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

// Create API Key Modal Component
function CreateKeyModal({
  isOpen,
  onClose,
  availableScopes,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  availableScopes: APIScope[];
  onCreate: (name: string, scopes: string[], expiresIn?: number) => Promise<string>;
}) {
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresIn, setExpiresIn] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const scopesByCategory = useMemo(() => {
    const grouped: Record<string, APIScope[]> = {};
    availableScopes.forEach((scope) => {
      if (!grouped[scope.category]) {
        grouped[scope.category] = [];
      }
      grouped[scope.category]!.push(scope);
    });
    return grouped;
  }, [availableScopes]);

  const handleCreate = async () => {
    if (!name.trim()) {
      return;
    }
    setIsCreating(true);
    try {
      const key = await onCreate(name, selectedScopes, expiresIn || undefined);
      setNewKey(key);
    } catch {
      // Handle error
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedScopes([]);
    setExpiresIn(0);
    setNewKey(null);
    setCopied(false);
    onClose();
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes(prev =>
      prev.includes(scopeId)
        ? prev.filter(s => s !== scopeId)
        : [...prev, scopeId],
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
        {newKey ? (
          // Success State - Show new key
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">API Key Created</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Make sure to copy your API key now. You won&apos;t be able to see it again.
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <div className="flex items-center justify-between gap-3">
                <code className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                  {newKey}
                </code>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {copied
                    ? (
                        <Check className="h-4 w-4 text-green-600" />
                      )
                    : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                </button>
              </div>
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                This key will only be shown once. Store it securely and never share it publicly.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          // Create Form
          <>
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create API Key</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Generate a new API key with specific permissions
              </p>
            </div>

            <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              {/* Expiration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expiration
                </label>
                <select
                  value={expiresIn}
                  onChange={e => setExpiresIn(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  {EXPIRATION_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scopes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Permissions
                </label>
                <div className="space-y-4">
                  {Object.entries(scopesByCategory).map(([category, scopes]) => (
                    <div key={category}>
                      <h4 className="mb-2 text-xs font-medium tracking-wide text-gray-500 capitalize uppercase dark:text-gray-400">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {scopes.map(scope => (
                          <label
                            key={scope.id}
                            className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedScopes.includes(scope.id)}
                              onChange={() => toggleScope(scope.id)}
                              className="mt-0.5"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {scope.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {scope.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || isCreating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating
                  ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    )
                  : (
                      <>
                        <Key className="h-4 w-4" />
                        Create Key
                      </>
                    )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// API Key Card Component
function APIKeyCard({
  apiKey,
  onRevoke,
  onDelete,
  onRegenerate,
  showActions = true,
}: {
  apiKey: APIKey;
  onRevoke?: () => void;
  onDelete?: () => void;
  onRegenerate?: () => Promise<string>;
  showActions?: boolean;
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    switch (apiKey.status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'expired':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'revoked':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Silence unused variable warning
  void onRegenerate;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${
              apiKey.status === 'active'
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
            >
              <Key className={`h-5 w-5 ${
                apiKey.status === 'active'
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{apiKey.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created
                {' '}
                {getTimeAgo(apiKey.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${getStatusBadge()}`}>
              {apiKey.status}
            </span>
            {showActions && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
                {showMenu && (
                  <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {apiKey.status === 'active' && onRevoke && (
                      <button
                        onClick={() => {
                          onRevoke(); setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                      >
                        <Lock className="h-4 w-4" />
                        Revoke Key
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(); setShowMenu(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Key
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* API Key Display */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <code className="flex-1 font-mono text-sm text-gray-700 dark:text-gray-300">
            {showKey ? apiKey.key : maskAPIKey(apiKey.key)}
          </code>
          <button
            onClick={() => setShowKey(!showKey)}
            className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            title={showKey ? 'Hide' : 'Show'}
          >
            {showKey
              ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                )
              : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
          </button>
          <button
            onClick={handleCopy}
            className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Copy"
          >
            {copied
              ? (
                  <Check className="h-4 w-4 text-green-600" />
                )
              : (
                  <Copy className="h-4 w-4 text-gray-500" />
                )}
          </button>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {isExpanded
            ? (
                <ChevronDown className="h-4 w-4" />
              )
            : (
                <ChevronRight className="h-4 w-4" />
              )}
          {isExpanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 border-t border-gray-100 px-4 pt-4 pb-4 dark:border-gray-700">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Used</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {apiKey.lastUsedAt ? getTimeAgo(apiKey.lastUsedAt) : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Expires</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {apiKey.expiresAt ? apiKey.expiresAt.toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Requests</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {apiKey.usageCount?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Scopes */}
          <div>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {apiKey.scopes.map(scope => (
                <span
                  key={scope}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main API Key Manager Component
export function APIKeyManager({
  apiKeys,
  availableScopes = DEFAULT_SCOPES,
  usageStats,
  onCreateKey,
  onRevokeKey,
  onRegenerateKey,
  onDeleteKey,
  onUpdateKey,
  maxKeys = 10,
  variant = 'full',
  className = '',
}: APIKeyManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'revoked'>('all');

  // Silence unused variable warnings
  void onUpdateKey;

  const filteredKeys = useMemo(() => {
    return apiKeys.filter((key) => {
      const matchesSearch = key.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [apiKeys, searchQuery, statusFilter]);

  const activeKeysCount = apiKeys.filter(k => k.status === 'active').length;
  const canCreateMore = activeKeysCount < maxKeys;

  const handleCreateKey = async (name: string, scopes: string[], expiresIn?: number): Promise<string> => {
    if (onCreateKey) {
      return onCreateKey(name, scopes, expiresIn);
    }
    return '';
  };

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {apiKeys.map(key => (
          <APIKeyCard
            key={key.id}
            apiKey={key}
            onRevoke={() => onRevokeKey?.(key.id)}
            onDelete={() => onDeleteKey?.(key.id)}
            showActions={false}
          />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
            <Key className="h-5 w-5" />
            API Keys
          </h3>
          <span className="text-sm text-gray-500">
            {activeKeysCount}
            /
            {maxKeys}
          </span>
        </div>
        <div className="space-y-3 p-4">
          {apiKeys.slice(0, 3).map(key => (
            <div key={key.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{key.name}</p>
                <p className="text-xs text-gray-500">
                  {key.prefix}
                  ...
                  {key.key.slice(-4)}
                </p>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
                key.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
              >
                {key.status}
              </span>
            </div>
          ))}
          {apiKeys.length > 3 && (
            <p className="text-center text-sm text-gray-500">
              +
              {apiKeys.length - 3}
              {' '}
              more
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Key className="h-6 w-6" />
              API Keys
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage API keys for programmatic access
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!canCreateMore}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Usage Stats */}
        {usageStats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-2 flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Requests</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {usageStats.totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-2 flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {usageStats.successRate}
                %
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-2 flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Avg Latency</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {usageStats.averageLatency}
                ms
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div className="mb-2 flex items-center gap-3">
                <Key className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Active Keys</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {activeKeysCount}
                /
                {maxKeys}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search keys..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        {/* Security Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">Security Best Practices</p>
            <ul className="mt-1 space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Never share API keys publicly or commit them to version control</li>
              <li>• Rotate keys periodically and use expiration dates</li>
              <li>• Grant only the minimum permissions needed</li>
            </ul>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {filteredKeys.length > 0
            ? (
                filteredKeys.map(key => (
                  <APIKeyCard
                    key={key.id}
                    apiKey={key}
                    onRevoke={() => onRevokeKey?.(key.id)}
                    onDelete={() => onDeleteKey?.(key.id)}
                    onRegenerate={onRegenerateKey ? () => onRegenerateKey(key.id) : undefined}
                  />
                ))
              )
            : (
                <div className="py-12 text-center">
                  <Key className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery || statusFilter !== 'all'
                      ? 'No API keys match your filters'
                      : 'No API keys created yet'}
                  </p>
                  {!searchQuery && statusFilter === 'all' && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Create Your First API Key
                    </button>
                  )}
                </div>
              )}
        </div>

        {/* Documentation Link */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learn how to use the API in our documentation
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
            View API Docs
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Create Modal */}
      <CreateKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        availableScopes={availableScopes}
        onCreate={handleCreateKey}
      />
    </div>
  );
}

// API Key Badge Component
export function APIKeyBadge({
  prefix,
  status = 'active',
}: {
  prefix: string;
  status?: 'active' | 'expired' | 'revoked';
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expired':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'revoked':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-xs ${getStatusColor()}`}>
      <Key className="h-3 w-3" />
      {prefix}
      ...
    </span>
  );
}

export default APIKeyManager;
