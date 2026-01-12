'use client';

import {
  Activity,
  Check,
  CheckCircle,
  Clock,
  Cloud,
  ExternalLink,
  FileText,
  FolderOpen,
  Info,
  Link2,
  MessageSquare,
  MoreHorizontal,
  Plug,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Unlink,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Types
export type IntegrationCategory = 'automation' | 'storage' | 'communication' | 'productivity' | 'design' | 'analytics';

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error';

export type IntegrationPermission = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  granted: boolean;
};

export type IntegrationConfig = {
  [key: string]: string | boolean | number;
};

export type Integration = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  connectedAt?: Date;
  lastSyncAt?: Date;
  permissions?: IntegrationPermission[];
  config?: IntegrationConfig;
  isPremium?: boolean;
  docsUrl?: string;
  features: string[];
};

export type IntegrationEvent = {
  id: string;
  integrationId: string;
  type: 'sync' | 'export' | 'import' | 'webhook' | 'error';
  status: 'success' | 'failed' | 'pending';
  message: string;
  timestamp: Date;
  details?: Record<string, unknown>;
};

type IntegrationManagerProps = {
  integrations: Integration[];
  events?: IntegrationEvent[];
  onConnect?: (integrationId: string) => void;
  onDisconnect?: (integrationId: string) => void;
  onConfigure?: (integrationId: string, config: IntegrationConfig) => void;
  onSync?: (integrationId: string) => void;
  onRefresh?: () => void;
  premiumRequired?: boolean;
  onUpgrade?: () => void;
  variant?: 'full' | 'compact' | 'grid';
  className?: string;
};

// Default integrations data
const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect MockFlow to 5,000+ apps with automated workflows',
    icon: '⚡',
    category: 'automation',
    status: 'disconnected',
    isPremium: false,
    docsUrl: 'https://zapier.com',
    features: ['Automated exports', 'Trigger on mockup creation', 'Multi-step workflows'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Share mockups directly to Slack channels and get notifications',
    icon: '💬',
    category: 'communication',
    status: 'disconnected',
    isPremium: false,
    docsUrl: 'https://slack.com',
    features: ['Direct sharing', 'Channel notifications', 'Slash commands'],
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Save and sync mockups to your Google Drive automatically',
    icon: '📁',
    category: 'storage',
    status: 'disconnected',
    isPremium: false,
    docsUrl: 'https://drive.google.com',
    features: ['Auto-backup', 'Folder sync', 'Team drives support'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Sync mockups with Dropbox for easy access anywhere',
    icon: '📦',
    category: 'storage',
    status: 'disconnected',
    isPremium: false,
    docsUrl: 'https://dropbox.com',
    features: ['Automatic sync', 'Shared folders', 'Version history'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Embed mockups in Notion pages and databases',
    icon: '📝',
    category: 'productivity',
    status: 'disconnected',
    isPremium: true,
    docsUrl: 'https://notion.so',
    features: ['Page embeds', 'Database sync', 'Team workspaces'],
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Import designs from Figma and export mockups back',
    icon: '🎨',
    category: 'design',
    status: 'disconnected',
    isPremium: true,
    docsUrl: 'https://figma.com',
    features: ['Design import', 'Frame export', 'Plugin support'],
  },
  {
    id: 'sketch',
    name: 'Sketch',
    description: 'Integrate with Sketch for seamless design workflows',
    icon: '💎',
    category: 'design',
    status: 'disconnected',
    isPremium: true,
    docsUrl: 'https://sketch.com',
    features: ['Symbol import', 'Artboard export', 'Cloud sync'],
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    description: 'Share and collaborate on mockups within Teams',
    icon: '👥',
    category: 'communication',
    status: 'disconnected',
    isPremium: false,
    docsUrl: 'https://teams.microsoft.com',
    features: ['Channel sharing', 'Tab integration', 'Bot commands'],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Link mockups to issues and PRs for better context',
    icon: '🐙',
    category: 'productivity',
    status: 'disconnected',
    isPremium: true,
    docsUrl: 'https://github.com',
    features: ['Issue linking', 'PR comments', 'Actions integration'],
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Attach mockups to Jira tickets and stories',
    icon: '📋',
    category: 'productivity',
    status: 'disconnected',
    isPremium: true,
    docsUrl: 'https://atlassian.com/jira',
    features: ['Ticket attachments', 'Sprint boards', 'Confluence sync'],
  },
];

// Category icons and labels
const CATEGORY_INFO: Record<IntegrationCategory, { icon: typeof Plug; label: string; color: string }> = {
  automation: { icon: Zap, label: 'Automation', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  storage: { icon: Cloud, label: 'Storage', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
  communication: { icon: MessageSquare, label: 'Communication', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  productivity: { icon: FileText, label: 'Productivity', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  design: { icon: FolderOpen, label: 'Design', color: 'text-pink-600 bg-pink-100 dark:bg-pink-900/30' },
  analytics: { icon: Activity, label: 'Analytics', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
};

// Integration Card Component
function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
  onSync,
  premiumRequired,
  onUpgrade,
  compact = false,
}: {
  integration: Integration;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onConfigure?: () => void;
  onSync?: () => void;
  premiumRequired?: boolean;
  onUpgrade?: () => void;
  compact?: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const categoryInfo = CATEGORY_INFO[integration.category];
  const CategoryIcon = categoryInfo.icon;

  const getStatusBadge = () => {
    switch (integration.status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30">
            <CheckCircle className="h-3 w-3" />
            Connected
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600 dark:bg-red-900/30">
            <XCircle className="h-3 w-3" />
            Error
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600 dark:bg-yellow-900/30">
            <RefreshCw className="h-3 w-3 animate-spin" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const needsUpgrade = integration.isPremium && premiumRequired;

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{integration.icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{integration.name}</p>
            <p className="text-xs text-gray-500">{integration.status === 'connected' ? 'Connected' : 'Not connected'}</p>
          </div>
        </div>
        {integration.status === 'connected'
          ? (
              <button
                onClick={onDisconnect}
                className="text-sm text-red-600 hover:underline"
              >
                Disconnect
              </button>
            )
          : (
              <button
                onClick={needsUpgrade ? onUpgrade : onConnect}
                className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                {needsUpgrade ? 'Upgrade' : 'Connect'}
              </button>
            )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{integration.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{integration.name}</h3>
                {integration.isPremium && (
                  <span className="rounded bg-gradient-to-r from-purple-500 to-pink-500 px-1.5 py-0.5 text-xs font-medium text-white">
                    PRO
                  </span>
                )}
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${categoryInfo.color}`}>
                <CategoryIcon className="h-3 w-3" />
                {categoryInfo.label}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {integration.status === 'connected' && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </button>
                {showMenu && (
                  <div className="absolute top-full right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <button
                      onClick={() => {
                        onConfigure?.(); setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      Configure
                    </button>
                    <button
                      onClick={() => {
                        onSync?.(); setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Sync Now
                    </button>
                    <button
                      onClick={() => {
                        onDisconnect?.(); setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Unlink className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {integration.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {integration.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            >
              {feature}
            </span>
          ))}
        </div>

        {integration.status === 'connected' && integration.lastSyncAt && (
          <div className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            Last synced
            {' '}
            {integration.lastSyncAt.toLocaleString()}
          </div>
        )}
      </div>

      <div className="dark:bg-gray-750 flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700">
        {integration.docsUrl && (
          <a
            href={integration.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ExternalLink className="h-3 w-3" />
            Docs
          </a>
        )}
        {integration.status === 'connected'
          ? (
              <button
                onClick={onConfigure}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Settings className="h-4 w-4" />
                Configure
              </button>
            )
          : needsUpgrade
            ? (
                <button
                  onClick={onUpgrade}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <Zap className="h-4 w-4" />
                  Upgrade to Connect
                </button>
              )
            : (
                <button
                  onClick={onConnect}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Link2 className="h-4 w-4" />
                  Connect
                </button>
              )}
      </div>
    </div>
  );
}

// Event Log Item Component
function EventLogItem({ event }: { event: IntegrationEvent }) {
  const getStatusIcon = () => {
    switch (event.status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (event.type) {
      case 'sync':
        return 'Sync';
      case 'export':
        return 'Export';
      case 'import':
        return 'Import';
      case 'webhook':
        return 'Webhook';
      case 'error':
        return 'Error';
      default:
        return event.type;
    }
  };

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-0 dark:border-gray-800">
      <div className="mt-0.5">{getStatusIcon()}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{getTypeLabel()}</span>
          <span className={`rounded px-1.5 py-0.5 text-xs ${
            event.status === 'success'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : event.status === 'failed'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
          >
            {event.status}
          </span>
        </div>
        <p className="truncate text-sm text-gray-600 dark:text-gray-400">{event.message}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {event.timestamp.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Configuration Modal Component
function ConfigurationModal({
  integration,
  isOpen,
  onClose,
  onSave,
}: {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: IntegrationConfig) => void;
}) {
  const [config, setConfig] = useState<IntegrationConfig>(integration.config || {});

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{integration.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Configure
                {' '}
                {integration.name}
              </h3>
              <p className="text-sm text-gray-500">Adjust integration settings</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {/* Auto-sync toggle */}
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Auto-sync</p>
              <p className="text-sm text-gray-500">Automatically sync changes</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(config.autoSync)}
              onChange={e => setConfig({ ...config, autoSync: e.target.checked })}
              className="h-5 w-5 rounded"
            />
          </label>

          {/* Sync frequency */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sync Frequency
            </label>
            <select
              value={String(config.syncFrequency || 'hourly')}
              onChange={e => setConfig({ ...config, syncFrequency: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="manual">Manual only</option>
            </select>
          </div>

          {/* Notifications toggle */}
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifications</p>
              <p className="text-sm text-gray-500">Get notified on sync events</p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(config.notifications)}
              onChange={e => setConfig({ ...config, notifications: e.target.checked })}
              className="h-5 w-5 rounded"
            />
          </label>

          {/* Permissions */}
          {integration.permissions && integration.permissions.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</h4>
              <div className="space-y-2">
                {integration.permissions.map(perm => (
                  <div key={perm.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{perm.name}</p>
                      <p className="text-xs text-gray-500">{perm.description}</p>
                    </div>
                    {perm.granted
                      ? (
                          <Check className="h-5 w-5 text-green-600" />
                        )
                      : (
                          <X className="h-5 w-5 text-gray-400" />
                        )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(config); onClose();
            }}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Integration Manager Component
export function IntegrationManager({
  integrations = DEFAULT_INTEGRATIONS,
  events = [],
  onConnect,
  onDisconnect,
  onConfigure,
  onSync,
  onRefresh,
  premiumRequired = false,
  onUpgrade,
  variant = 'full',
  className = '',
}: IntegrationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IntegrationCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IntegrationStatus | 'all'>('all');
  const [configuring, setConfiguring] = useState<Integration | null>(null);

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase())
        || integration.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || integration.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [integrations, searchQuery, categoryFilter, statusFilter]);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const handleConfigure = (integration: Integration, config: IntegrationConfig) => {
    onConfigure?.(integration.id, config);
  };

  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
            <Plug className="h-5 w-5" />
            Integrations
          </h3>
          <span className="text-sm text-gray-500">
            {connectedCount}
            {' '}
            connected
          </span>
        </div>
        <div className="space-y-3 p-4">
          {integrations.slice(0, 4).map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConnect={() => onConnect?.(integration.id)}
              onDisconnect={() => onDisconnect?.(integration.id)}
              premiumRequired={premiumRequired}
              onUpgrade={onUpgrade}
              compact
            />
          ))}
          {integrations.length > 4 && (
            <p className="text-center text-sm text-gray-500">
              +
              {integrations.length - 4}
              {' '}
              more integrations
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {integrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={() => onConnect?.(integration.id)}
            onDisconnect={() => onDisconnect?.(integration.id)}
            onConfigure={() => setConfiguring(integration)}
            onSync={() => onSync?.(integration.id)}
            premiumRequired={premiumRequired}
            onUpgrade={onUpgrade}
          />
        ))}
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
              <Plug className="h-6 w-6" />
              Integrations
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Connect MockFlow with your favorite tools and services
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {connectedCount}
              {' '}
              of
              {integrations.length}
              {' '}
              connected
            </span>
            <button
              onClick={onRefresh}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search integrations..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as typeof categoryFilter)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="disconnected">Disconnected</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Premium Notice */}
        {premiumRequired && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-purple-200 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Unlock Premium Integrations</p>
                <p className="text-sm text-gray-500">Some integrations require a Pro plan or higher</p>
              </div>
            </div>
            <button
              onClick={onUpgrade}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Upgrade Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Integrations Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredIntegrations.length > 0
                ? (
                    filteredIntegrations.map(integration => (
                      <IntegrationCard
                        key={integration.id}
                        integration={integration}
                        onConnect={() => onConnect?.(integration.id)}
                        onDisconnect={() => onDisconnect?.(integration.id)}
                        onConfigure={() => setConfiguring(integration)}
                        onSync={() => onSync?.(integration.id)}
                        premiumRequired={premiumRequired}
                        onUpgrade={onUpgrade}
                      />
                    ))
                  )
                : (
                    <div className="col-span-2 py-12 text-center">
                      <Plug className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500">No integrations match your filters</p>
                    </div>
                  )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <Activity className="h-5 w-5" />
              Recent Activity
            </h3>
            {events.length > 0
              ? (
                  <div className="space-y-1">
                    {events.slice(0, 10).map(event => (
                      <EventLogItem key={event.id} event={event} />
                    ))}
                  </div>
                )
              : (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Need Help?</p>
            <p className="mt-1 text-sm text-gray-500">
              Check our
              {' '}
              <a href="#" className="text-blue-600 hover:underline">integration guides</a>
              {' '}
              for detailed setup instructions,
              or
              {' '}
              <a href="#" className="text-blue-600 hover:underline">contact support</a>
              {' '}
              if you need assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {configuring && (
        <ConfigurationModal
          integration={configuring}
          isOpen={true}
          onClose={() => setConfiguring(null)}
          onSave={config => handleConfigure(configuring, config)}
        />
      )}
    </div>
  );
}

// Integration Status Badge
export function IntegrationStatusBadge({
  integration,
  showName = false,
}: {
  integration: Integration;
  showName?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm ${
      integration.status === 'connected'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
    }`}
    >
      <span>{integration.icon}</span>
      {showName && <span>{integration.name}</span>}
      {integration.status === 'connected' && <Check className="h-3 w-3" />}
    </span>
  );
}

export default IntegrationManager;
