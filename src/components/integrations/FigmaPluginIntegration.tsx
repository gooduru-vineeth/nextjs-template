'use client';

import {
  AlertCircle,
  Check,
  Download,
  ExternalLink,
  Figma,
  FileImage,
  FolderOpen,
  Layers,
  Link,
  RefreshCw,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';
type SyncDirection = 'import' | 'export' | 'both';

type FigmaFile = {
  id: string;
  name: string;
  lastModified: string;
  thumbnail?: string;
  pagesCount: number;
  componentsCount: number;
};

type FigmaFrame = {
  id: string;
  name: string;
  type: 'frame' | 'component' | 'instance';
  width: number;
  height: number;
  thumbnail?: string;
};

type SyncSettings = {
  direction: SyncDirection;
  includeComponents: boolean;
  includeStyles: boolean;
  overwriteExisting: boolean;
  autoSync: boolean;
  syncInterval: number; // minutes
};

type FigmaPluginIntegrationProps = {
  variant?: 'full' | 'compact' | 'widget';
  onConnect?: () => Promise<boolean>;
  onDisconnect?: () => void;
  onImport?: (fileId: string, frames: string[]) => Promise<void>;
  onExport?: (frames: FigmaFrame[]) => Promise<void>;
  onSync?: (direction: SyncDirection) => Promise<void>;
  className?: string;
};

// Mock data
const mockFigmaFiles: FigmaFile[] = [
  {
    id: 'file-1',
    name: 'MockFlow Design System',
    lastModified: '2024-01-15T10:00:00Z',
    pagesCount: 5,
    componentsCount: 124,
  },
  {
    id: 'file-2',
    name: 'Marketing Assets',
    lastModified: '2024-01-14T15:30:00Z',
    pagesCount: 3,
    componentsCount: 48,
  },
  {
    id: 'file-3',
    name: 'App Screens v2',
    lastModified: '2024-01-12T09:00:00Z',
    pagesCount: 8,
    componentsCount: 256,
  },
];

const mockFigmaFrames: FigmaFrame[] = [
  { id: 'frame-1', name: 'Homepage Hero', type: 'frame', width: 1440, height: 900 },
  { id: 'frame-2', name: 'Button Component', type: 'component', width: 120, height: 40 },
  { id: 'frame-3', name: 'Card Instance', type: 'instance', width: 320, height: 240 },
  { id: 'frame-4', name: 'Navigation Bar', type: 'frame', width: 1440, height: 64 },
  { id: 'frame-5', name: 'Footer', type: 'frame', width: 1440, height: 320 },
];

export default function FigmaPluginIntegration({
  variant = 'full',
  onConnect,
  onDisconnect,
  onImport,
  onExport,
  onSync,
  className = '',
}: FigmaPluginIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [selectedFile, setSelectedFile] = useState<FigmaFile | null>(null);
  const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
  const [settings, setSettings] = useState<SyncSettings>({
    direction: 'both',
    includeComponents: true,
    includeStyles: true,
    overwriteExisting: false,
    autoSync: false,
    syncInterval: 30,
  });
  const [activeTab, setActiveTab] = useState<'files' | 'settings'>('files');

  const handleConnect = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const success = await onConnect?.() ?? true;
      if (success) {
        setIsConnected(true);
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch {
      setSyncStatus('error');
    }
  }, [onConnect]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setSelectedFile(null);
    setSelectedFrames([]);
    setSyncStatus('idle');
    onDisconnect?.();
  }, [onDisconnect]);

  const handleImport = useCallback(async () => {
    if (!selectedFile || selectedFrames.length === 0) {
      return;
    }
    setSyncStatus('syncing');
    try {
      await onImport?.(selectedFile.id, selectedFrames);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, [selectedFile, selectedFrames, onImport]);

  const handleExport = useCallback(async () => {
    const frames = mockFigmaFrames.filter(f => selectedFrames.includes(f.id));
    if (frames.length === 0) {
      return;
    }
    setSyncStatus('syncing');
    try {
      await onExport?.(frames);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, [selectedFrames, onExport]);

  const handleSync = useCallback(async (direction: SyncDirection) => {
    setSyncStatus('syncing');
    try {
      await onSync?.(direction);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, [onSync]);

  const toggleFrameSelection = useCallback((frameId: string) => {
    setSelectedFrames(prev =>
      prev.includes(frameId)
        ? prev.filter(id => id !== frameId)
        : [...prev, frameId],
    );
  }, []);

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'synced': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getFrameTypeIcon = (type: FigmaFrame['type']) => {
    switch (type) {
      case 'component': return <Layers className="h-4 w-4 text-purple-500" />;
      case 'instance': return <FileImage className="h-4 w-4 text-blue-500" />;
      default: return <FileImage className="h-4 w-4 text-gray-500" />;
    }
  };

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Figma className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Figma</span>
          </div>
          {isConnected
            ? (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Check className="h-3 w-3" />
                  Connected
                </span>
              )
            : (
                <button
                  onClick={handleConnect}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Connect
                </button>
              )}
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSync('import')}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Download className="h-3 w-3" />
              Import
            </button>
            <button
              onClick={() => handleSync('export')}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <Upload className="h-3 w-3" />
              Export
            </button>
          </div>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Figma className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Figma Integration</h3>
              <p className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          {getSyncStatusIcon()}
        </div>

        {!isConnected
          ? (
              <button
                onClick={handleConnect}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Link className="h-4 w-4" />
                Connect to Figma
              </button>
            )
          : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSync('import')}
                  disabled={syncStatus === 'syncing'}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Download className="h-4 w-4" />
                  Import
                </button>
                <button
                  onClick={() => handleSync('export')}
                  disabled={syncStatus === 'syncing'}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <Upload className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={handleDisconnect}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <Figma className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Figma Integration</h2>
              <p className="text-sm text-gray-500">
                Sync your designs between MockFlow and Figma
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getSyncStatusIcon()}
            {isConnected
              ? (
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                    Disconnect
                  </button>
                )
              : (
                  <button
                    onClick={handleConnect}
                    disabled={syncStatus === 'syncing'}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Link className="h-4 w-4" />
                    Connect to Figma
                  </button>
                )}
          </div>
        </div>

        {/* Tabs */}
        {isConnected && (
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'files'
                  ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <FolderOpen className="mr-2 inline h-4 w-4" />
              Files
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Settings className="mr-2 inline h-4 w-4" />
              Settings
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isConnected && (
        <div className="p-6">
          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* File selection */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Your Figma Files</h3>
                <div className="space-y-2">
                  {mockFigmaFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                        selectedFile?.id === file.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.pagesCount}
                              {' '}
                              pages •
                              {file.componentsCount}
                              {' '}
                              components
                            </p>
                          </div>
                        </div>
                        <a
                          href="#"
                          onClick={e => e.stopPropagation()}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frame selection */}
              {selectedFile && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    Select Frames to Import
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mockFigmaFrames.map(frame => (
                      <div
                        key={frame.id}
                        onClick={() => toggleFrameSelection(frame.id)}
                        className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                          selectedFrames.includes(frame.id)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          {getFrameTypeIcon(frame.type)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{frame.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {frame.width}
                          ×
                          {frame.height}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  onClick={handleImport}
                  disabled={selectedFrames.length === 0 || syncStatus === 'syncing'}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Import Selected (
                  {selectedFrames.length}
                  )
                </button>
                <button
                  onClick={handleExport}
                  disabled={selectedFrames.length === 0 || syncStatus === 'syncing'}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  Export to Figma
                </button>
                <button
                  onClick={() => handleSync('both')}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <RefreshCw className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  Sync All
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Sync direction */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Sync Direction
                </label>
                <div className="flex gap-2">
                  {(['import', 'export', 'both'] as SyncDirection[]).map(direction => (
                    <button
                      key={direction}
                      onClick={() => setSettings(prev => ({ ...prev, direction }))}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        settings.direction === direction
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {direction.charAt(0).toUpperCase() + direction.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {[
                  { key: 'includeComponents', label: 'Include components' },
                  { key: 'includeStyles', label: 'Include styles (colors, typography)' },
                  { key: 'overwriteExisting', label: 'Overwrite existing items' },
                  { key: 'autoSync', label: 'Enable auto-sync' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings[key as keyof SyncSettings] as boolean}
                      onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>

              {/* Sync interval */}
              {settings.autoSync && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Auto-sync Interval
                  </label>
                  <select
                    value={settings.syncInterval}
                    onChange={e => setSettings(prev => ({ ...prev, syncInterval: Number(e.target.value) }))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value={5}>Every 5 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every hour</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Not connected state */}
      {!isConnected && (
        <div className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Figma className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Connect your Figma account
          </h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-500">
            Import your Figma designs directly into MockFlow or export your mockups back to Figma.
          </p>
          <button
            onClick={handleConnect}
            disabled={syncStatus === 'syncing'}
            className="mx-auto flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {syncStatus === 'syncing'
              ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                )
              : (
                  <Link className="h-5 w-5" />
                )}
            Connect to Figma
          </button>
        </div>
      )}
    </div>
  );
}

export type { FigmaFile, FigmaFrame, FigmaPluginIntegrationProps, SyncDirection, SyncSettings };
