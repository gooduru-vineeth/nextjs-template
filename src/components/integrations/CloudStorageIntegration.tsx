'use client';

import {
  CheckCircle,
  Clock,
  Cloud,
  Download,
  ExternalLink,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Upload,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type StorageProvider = 'google_drive' | 'dropbox' | 'notion' | 'onedrive';

type StorageConnection = {
  id: string;
  provider: StorageProvider;
  name: string;
  email: string;
  icon: string;
  color: string;
  connected: boolean;
  connectedAt?: string;
  storageUsed?: number;
  storageTotal?: number;
  lastSync?: string;
  autoSync: boolean;
  syncFolder?: string;
};

type StorageFile = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedAt: string;
  provider: StorageProvider;
  path: string;
};

type CloudStorageIntegrationProps = {
  variant?: 'full' | 'compact' | 'widget';
  onConnect?: (provider: StorageProvider) => void;
  onDisconnect?: (connectionId: string) => void;
  onSyncToggle?: (connectionId: string, enabled: boolean) => void;
  className?: string;
};

// Provider configurations
const providerConfig = {
  google_drive: { name: 'Google Drive', icon: '📁', color: 'bg-blue-500', textColor: 'text-blue-600' },
  dropbox: { name: 'Dropbox', icon: '📦', color: 'bg-blue-600', textColor: 'text-blue-700' },
  notion: { name: 'Notion', icon: '📝', color: 'bg-gray-900', textColor: 'text-gray-900' },
  onedrive: { name: 'OneDrive', icon: '☁️', color: 'bg-sky-500', textColor: 'text-sky-600' },
};

// Mock data
const mockConnections: StorageConnection[] = [
  {
    id: 'conn_1',
    provider: 'google_drive',
    name: 'Work Google Drive',
    email: 'user@company.com',
    icon: '📁',
    color: 'bg-blue-500',
    connected: true,
    connectedAt: '2024-01-05T00:00:00Z',
    storageUsed: 8.5 * 1024 * 1024 * 1024,
    storageTotal: 15 * 1024 * 1024 * 1024,
    lastSync: '2024-01-12T10:30:00Z',
    autoSync: true,
    syncFolder: '/MockFlow/Exports',
  },
  {
    id: 'conn_2',
    provider: 'dropbox',
    name: 'Personal Dropbox',
    email: 'user@personal.com',
    icon: '📦',
    color: 'bg-blue-600',
    connected: true,
    connectedAt: '2024-01-08T00:00:00Z',
    storageUsed: 1.2 * 1024 * 1024 * 1024,
    storageTotal: 2 * 1024 * 1024 * 1024,
    lastSync: '2024-01-12T09:15:00Z',
    autoSync: false,
    syncFolder: '/Apps/MockFlow',
  },
  {
    id: 'conn_3',
    provider: 'notion',
    name: 'Team Workspace',
    email: 'team@company.com',
    icon: '📝',
    color: 'bg-gray-900',
    connected: true,
    connectedAt: '2024-01-10T00:00:00Z',
    lastSync: '2024-01-11T14:00:00Z',
    autoSync: true,
  },
];

const mockFiles: StorageFile[] = [
  { id: 'f1', name: 'Social Campaign Mockups', type: 'folder', modifiedAt: '2024-01-12T08:00:00Z', provider: 'google_drive', path: '/MockFlow' },
  { id: 'f2', name: 'Landing Page v2.png', type: 'file', size: 2.5 * 1024 * 1024, modifiedAt: '2024-01-12T10:30:00Z', provider: 'google_drive', path: '/MockFlow/Exports' },
  { id: 'f3', name: 'Instagram Post.png', type: 'file', size: 1.8 * 1024 * 1024, modifiedAt: '2024-01-11T15:00:00Z', provider: 'dropbox', path: '/Apps/MockFlow' },
  { id: 'f4', name: 'Chat Mockup.png', type: 'file', size: 0.9 * 1024 * 1024, modifiedAt: '2024-01-10T12:00:00Z', provider: 'google_drive', path: '/MockFlow/Exports' },
];

const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};

export default function CloudStorageIntegration({
  variant = 'full',
  onConnect,
  onDisconnect,
  onSyncToggle,
  className = '',
}: CloudStorageIntegrationProps) {
  const [connections, setConnections] = useState<StorageConnection[]>(mockConnections);
  const [recentFiles] = useState<StorageFile[]>(mockFiles);
  const [, setSelectedConnection] = useState<StorageConnection | null>(null);
  const [activeTab, setActiveTab] = useState<'connections' | 'files' | 'settings'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleDisconnect = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
    onDisconnect?.(connectionId);
  }, [onDisconnect]);

  const handleSyncToggle = useCallback((connectionId: string) => {
    setConnections(prev => prev.map((c) => {
      if (c.id === connectionId) {
        const updated = { ...c, autoSync: !c.autoSync };
        onSyncToggle?.(connectionId, updated.autoSync);
        return updated;
      }
      return c;
    }));
  }, [onSyncToggle]);

  const handleManualSync = useCallback(async (connectionId: string) => {
    setIsSyncing(connectionId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnections(prev => prev.map(c =>
      c.id === connectionId ? { ...c, lastSync: new Date().toISOString() } : c,
    ));
    setIsSyncing(null);
  }, []);

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Cloud Storage</h3>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {connections.filter(c => c.connected).length}
            {' '}
            connected
          </span>
        </div>
        <div className="space-y-2">
          {connections.slice(0, 3).map(conn => (
            <div key={conn.id} className="flex items-center gap-2 rounded bg-gray-50 p-2 dark:bg-gray-700/50">
              <span>{conn.icon}</span>
              <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">{conn.name}</span>
              {conn.connected && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-sm text-blue-600 hover:underline dark:text-blue-400">
          Manage Storage
        </button>
      </div>
    );
  }

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Cloud className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Cloud Storage</span>
        </div>
        <div className="flex gap-1">
          {connections.map(conn => (
            <span key={conn.id} title={conn.name} className="text-lg">{conn.icon}</span>
          ))}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cloud Storage</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sync exports to your cloud storage</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Storage
          </button>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(providerConfig).map(([key, config]) => {
            const conn = connections.find(c => c.provider === key);
            return (
              <div
                key={key}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                  conn?.connected
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
                onClick={() => conn ? setSelectedConnection(conn) : onConnect?.(key as StorageProvider)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-2xl">{config.icon}</span>
                  {conn?.connected && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{config.name}</p>
                <p className="text-xs text-gray-500">{conn?.connected ? 'Connected' : 'Not connected'}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex px-6">
          {(['connections', 'files', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="p-6">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Connected Accounts</h3>
          <div className="space-y-4">
            {connections.map(conn => (
              <div
                key={conn.id}
                className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 ${conn.color} flex items-center justify-center rounded-xl text-xl text-white`}>
                      {conn.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{conn.name}</h4>
                      <p className="text-sm text-gray-500">{conn.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleManualSync(conn.id)}
                      disabled={isSyncing === conn.id}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <RefreshCw className={`h-4 w-4 ${isSyncing === conn.id ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => setSelectedConnection(conn)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDisconnect(conn.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Storage & Sync Info */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  {conn.storageUsed !== undefined && conn.storageTotal !== undefined && (
                    <div>
                      <p className="mb-1 text-gray-500">Storage</p>
                      <div className="mb-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${(conn.storageUsed / conn.storageTotal) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatBytes(conn.storageUsed)}
                        {' '}
                        /
                        {formatBytes(conn.storageTotal)}
                      </p>
                    </div>
                  )}
                  {conn.syncFolder && (
                    <div>
                      <p className="mb-1 text-gray-500">Sync Folder</p>
                      <p className="flex items-center gap-1 text-gray-900 dark:text-white">
                        <FolderOpen className="h-4 w-4" />
                        {conn.syncFolder}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="mb-1 text-gray-500">Last Sync</p>
                    <p className="flex items-center gap-1 text-gray-900 dark:text-white">
                      <Clock className="h-4 w-4" />
                      {conn.lastSync ? new Date(conn.lastSync).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>

                {/* Auto-sync toggle */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Auto-sync exports</p>
                    <p className="text-xs text-gray-500">Automatically upload new exports</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={conn.autoSync}
                      onChange={() => handleSyncToggle(conn.id)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Tab */}
      {activeTab === 'files' && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Files</h3>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            {recentFiles.map(file => (
              <div
                key={file.id}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  {file.type === 'folder'
                    ? (
                        <Folder className="h-8 w-8 text-yellow-500" />
                      )
                    : (
                        <FileText className="h-8 w-8 text-blue-500" />
                      )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{providerConfig[file.provider].name}</span>
                      <span>•</span>
                      <span>{file.path}</span>
                      {file.size && (
                        <>
                          <span>•</span>
                          <span>{formatBytes(file.size)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(file.modifiedAt).toLocaleDateString()}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Default Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Default Export Location</p>
                  <p className="text-sm text-gray-500">Choose where exports are saved by default</p>
                </div>
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option value="google_drive">Google Drive</option>
                  <option value="dropbox">Dropbox</option>
                  <option value="local">Local Download</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">File Naming</p>
                  <p className="text-sm text-gray-500">How exported files are named</p>
                </div>
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                  <option value="mockup_name">Mockup Name</option>
                  <option value="date_mockup">Date + Mockup Name</option>
                  <option value="custom">Custom Pattern</option>
                </select>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Overwrite Existing</p>
                  <p className="text-sm text-gray-500">Replace files with the same name</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Upload Settings</h3>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Quick Upload</p>
                  <p className="text-sm text-gray-500">Upload a file to your connected storage</p>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Choose File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { CloudStorageIntegrationProps, StorageConnection, StorageFile, StorageProvider };
