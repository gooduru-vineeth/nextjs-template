'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  MoreVertical,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ZapTrigger = {
  id: string;
  type: 'mockup_created' | 'mockup_exported' | 'mockup_shared' | 'template_used' | 'comment_added';
  label: string;
  description: string;
};

type ZapAction = {
  id: string;
  type: 'slack' | 'email' | 'sheets' | 'drive' | 'notion' | 'webhook';
  label: string;
  icon: string;
  config: Record<string, string>;
};

type Zap = {
  id: string;
  name: string;
  trigger: ZapTrigger;
  actions: ZapAction[];
  enabled: boolean;
  lastRun?: string;
  runCount: number;
  status: 'active' | 'paused' | 'error' | 'draft';
  createdAt: string;
};

type ZapierIntegrationProps = {
  variant?: 'full' | 'compact' | 'widget';
  onZapCreate?: (zap: Zap) => void;
  onZapUpdate?: (zap: Zap) => void;
  onZapDelete?: (zapId: string) => void;
  className?: string;
};

// Mock data
const mockTriggers: ZapTrigger[] = [
  { id: 'trigger_1', type: 'mockup_created', label: 'Mockup Created', description: 'Triggers when a new mockup is created' },
  { id: 'trigger_2', type: 'mockup_exported', label: 'Mockup Exported', description: 'Triggers when a mockup is exported' },
  { id: 'trigger_3', type: 'mockup_shared', label: 'Mockup Shared', description: 'Triggers when a mockup is shared' },
  { id: 'trigger_4', type: 'template_used', label: 'Template Used', description: 'Triggers when a template is used' },
  { id: 'trigger_5', type: 'comment_added', label: 'Comment Added', description: 'Triggers when a comment is added' },
];

const mockActions: ZapAction[] = [
  { id: 'action_1', type: 'slack', label: 'Send Slack Message', icon: '💬', config: {} },
  { id: 'action_2', type: 'email', label: 'Send Email', icon: '📧', config: {} },
  { id: 'action_3', type: 'sheets', label: 'Add Google Sheets Row', icon: '📊', config: {} },
  { id: 'action_4', type: 'drive', label: 'Upload to Google Drive', icon: '📁', config: {} },
  { id: 'action_5', type: 'notion', label: 'Create Notion Page', icon: '📝', config: {} },
  { id: 'action_6', type: 'webhook', label: 'Send Webhook', icon: '🔗', config: {} },
];

const mockZaps: Zap[] = [
  {
    id: 'zap_1',
    name: 'New Mockup to Slack',
    trigger: mockTriggers[0]!,
    actions: [mockActions[0]!],
    enabled: true,
    lastRun: '2024-01-12T10:30:00Z',
    runCount: 156,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'zap_2',
    name: 'Export to Google Drive',
    trigger: mockTriggers[1]!,
    actions: [mockActions[3]!],
    enabled: true,
    lastRun: '2024-01-12T09:15:00Z',
    runCount: 89,
    status: 'active',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'zap_3',
    name: 'Share Notification Email',
    trigger: mockTriggers[2]!,
    actions: [mockActions[1]!],
    enabled: false,
    lastRun: '2024-01-10T14:22:00Z',
    runCount: 34,
    status: 'paused',
    createdAt: '2024-01-08T00:00:00Z',
  },
];

export default function ZapierIntegration({
  variant = 'full',
  onZapCreate,
  onZapUpdate,
  onZapDelete,
  className = '',
}: ZapierIntegrationProps) {
  const [zaps, setZaps] = useState<Zap[]>(mockZaps);
  const [, setSelectedZap] = useState<Zap | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus] = useState<string>('all');
  const [apiKey] = useState('zk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const [webhookUrl] = useState('https://hooks.zapier.com/hooks/catch/123456/abcdef/');

  const handleToggleZap = useCallback((zapId: string) => {
    setZaps(prev => prev.map((z) => {
      if (z.id === zapId) {
        const updated = { ...z, enabled: !z.enabled, status: z.enabled ? 'paused' as const : 'active' as const };
        onZapUpdate?.(updated);
        return updated;
      }
      return z;
    }));
  }, [onZapUpdate]);

  const handleDeleteZap = useCallback((zapId: string) => {
    setZaps(prev => prev.filter(z => z.id !== zapId));
    onZapDelete?.(zapId);
  }, [onZapDelete]);

  const handleCreateZap = useCallback((name: string, trigger: ZapTrigger, actions: ZapAction[]) => {
    const newZap: Zap = {
      id: `zap_${Date.now()}`,
      name,
      trigger,
      actions,
      enabled: false,
      runCount: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    setZaps(prev => [...prev, newZap]);
    onZapCreate?.(newZap);
    setShowCreateModal(false);
  }, [onZapCreate]);

  const filteredZaps = zaps.filter((zap) => {
    const matchesSearch = zap.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || zap.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Zap['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'error': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'draft': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: Zap['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit3 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Zapier</h3>
          </div>
          <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Connected
          </span>
        </div>
        <div className="space-y-2">
          {zaps.slice(0, 3).map(zap => (
            <div key={zap.id} className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700/50">
              <span className="truncate text-sm text-gray-700 dark:text-gray-300">{zap.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(zap.status)}`}>
                {zap.status}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-sm text-orange-600 hover:underline dark:text-orange-400">
          Manage Zaps (
          {zaps.length}
          )
        </button>
      </div>
    );
  }

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Zapier Integration</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {zaps.filter(z => z.status === 'active').length}
            {' '}
            active zaps
          </span>
          <button className="text-xs text-orange-600 hover:underline dark:text-orange-400">
            Configure
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Zapier Integration</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automate workflows with 5,000+ apps</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white transition-colors hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            Create Zap
          </button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Connected to Zapier</p>
            <p className="text-xs text-green-600 dark:text-green-400">Your account is linked and ready to automate</p>
          </div>
          <a
            href="https://zapier.com/app/zaps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-green-700 hover:underline dark:text-green-400"
          >
            Open Zapier
            {' '}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">API Configuration</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">API Key</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                readOnly
                className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <Copy className="h-4 w-4" />
              </button>
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Webhook URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 truncate rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search zaps..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm dark:border-gray-700 dark:bg-gray-800"
          />
        </div>
        <div className="relative">
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
            <Filter className="h-4 w-4" />
            {filterStatus === 'all' ? 'All Status' : filterStatus}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Zaps List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredZaps.length === 0
          ? (
              <div className="p-12 text-center">
                <Zap className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No zaps found</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Create your first zap to automate your workflow
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Zap
                </button>
              </div>
            )
          : (
              filteredZaps.map(zap => (
                <div
                  key={zap.id}
                  className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleZap(zap.id)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          zap.enabled
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
                        }`}
                      >
                        {zap.enabled ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{zap.name}</h4>
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${getStatusColor(zap.status)}`}>
                            {getStatusIcon(zap.status)}
                            {zap.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
                            {zap.trigger.label}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          {zap.actions.map(action => (
                            <span key={action.id} className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
                              {action.icon}
                              {' '}
                              {action.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {zap.runCount}
                          {' '}
                          runs
                        </p>
                        {zap.lastRun && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last:
                            {' '}
                            {new Date(zap.lastRun).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedZap(zap)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteZap(zap.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
      </div>

      {/* Available Triggers & Actions */}
      <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Available Triggers & Actions</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">Triggers</h4>
            <div className="space-y-2">
              {mockTriggers.map(trigger => (
                <div key={trigger.id} className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-800">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{trigger.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">Actions</h4>
            <div className="space-y-2">
              {mockActions.map(action => (
                <div key={action.id} className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-800">
                  <span>{action.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{action.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl dark:bg-gray-800">
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Zap</h3>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Zap Name</label>
                <input
                  type="text"
                  placeholder="My awesome zap"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Trigger</label>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  {mockTriggers.map(trigger => (
                    <option key={trigger.id} value={trigger.id}>{trigger.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Action</label>
                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  {mockActions.map(action => (
                    <option key={action.id} value={action.id}>
                      {action.icon}
                      {' '}
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateZap('New Zap', mockTriggers[0]!, [mockActions[0]!])}
                className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
              >
                Create Zap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { Zap, ZapAction, ZapierIntegrationProps, ZapTrigger };
