'use client';

import {
  AlertCircle,
  Check,
  Diamond,
  Download,
  ExternalLink,
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

type SketchDocument = {
  id: string;
  name: string;
  lastModified: string;
  pagesCount: number;
  artboardsCount: number;
  cloudStatus: 'local' | 'cloud' | 'synced';
};

type SketchArtboard = {
  id: string;
  name: string;
  pageId: string;
  pageName: string;
  width: number;
  height: number;
  isSymbol: boolean;
};

type SketchSyncSettings = {
  direction: SyncDirection;
  includeSymbols: boolean;
  includeSharedStyles: boolean;
  includeColorVariables: boolean;
  overwriteExisting: boolean;
  autoSync: boolean;
};

type SketchPluginIntegrationProps = {
  variant?: 'full' | 'compact' | 'widget';
  onConnect?: () => Promise<boolean>;
  onDisconnect?: () => void;
  onImport?: (documentId: string, artboards: string[]) => Promise<void>;
  onExport?: (artboards: SketchArtboard[]) => Promise<void>;
  onSync?: (direction: SyncDirection) => Promise<void>;
  className?: string;
};

// Mock data
const mockSketchDocuments: SketchDocument[] = [
  {
    id: 'doc-1',
    name: 'MockFlow UI Kit',
    lastModified: '2024-01-15T10:00:00Z',
    pagesCount: 4,
    artboardsCount: 86,
    cloudStatus: 'synced',
  },
  {
    id: 'doc-2',
    name: 'Marketing Materials',
    lastModified: '2024-01-14T15:30:00Z',
    pagesCount: 2,
    artboardsCount: 24,
    cloudStatus: 'cloud',
  },
  {
    id: 'doc-3',
    name: 'Mobile App Screens',
    lastModified: '2024-01-12T09:00:00Z',
    pagesCount: 6,
    artboardsCount: 156,
    cloudStatus: 'local',
  },
];

const mockSketchArtboards: SketchArtboard[] = [
  { id: 'ab-1', name: 'Home - Desktop', pageId: 'p1', pageName: 'Homepage', width: 1440, height: 900, isSymbol: false },
  { id: 'ab-2', name: 'Home - Mobile', pageId: 'p1', pageName: 'Homepage', width: 375, height: 812, isSymbol: false },
  { id: 'ab-3', name: 'Button/Primary', pageId: 'p2', pageName: 'Components', width: 120, height: 44, isSymbol: true },
  { id: 'ab-4', name: 'Button/Secondary', pageId: 'p2', pageName: 'Components', width: 120, height: 44, isSymbol: true },
  { id: 'ab-5', name: 'Card/Product', pageId: 'p2', pageName: 'Components', width: 320, height: 400, isSymbol: true },
  { id: 'ab-6', name: 'Navigation', pageId: 'p1', pageName: 'Homepage', width: 1440, height: 64, isSymbol: false },
];

export default function SketchPluginIntegration({
  variant = 'full',
  onConnect,
  onDisconnect,
  onImport,
  onExport,
  onSync,
  className = '',
}: SketchPluginIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [selectedDocument, setSelectedDocument] = useState<SketchDocument | null>(null);
  const [selectedArtboards, setSelectedArtboards] = useState<string[]>([]);
  const [settings, setSettings] = useState<SketchSyncSettings>({
    direction: 'both',
    includeSymbols: true,
    includeSharedStyles: true,
    includeColorVariables: true,
    overwriteExisting: false,
    autoSync: false,
  });
  const [activeTab, setActiveTab] = useState<'documents' | 'settings'>('documents');

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
    setSelectedDocument(null);
    setSelectedArtboards([]);
    setSyncStatus('idle');
    onDisconnect?.();
  }, [onDisconnect]);

  const handleImport = useCallback(async () => {
    if (!selectedDocument || selectedArtboards.length === 0) {
      return;
    }
    setSyncStatus('syncing');
    try {
      await onImport?.(selectedDocument.id, selectedArtboards);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, [selectedDocument, selectedArtboards, onImport]);

  const handleExport = useCallback(async () => {
    const artboards = mockSketchArtboards.filter(a => selectedArtboards.includes(a.id));
    if (artboards.length === 0) {
      return;
    }
    setSyncStatus('syncing');
    try {
      await onExport?.(artboards);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, [selectedArtboards, onExport]);

  const handleSync = useCallback(async (direction: SyncDirection) => {
    setSyncStatus('syncing');
    try {
      await onSync?.(direction);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  }, [onSync]);

  const toggleArtboardSelection = useCallback((artboardId: string) => {
    setSelectedArtboards(prev =>
      prev.includes(artboardId)
        ? prev.filter(id => id !== artboardId)
        : [...prev, artboardId],
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

  const getCloudStatusBadge = (status: SketchDocument['cloudStatus']) => {
    switch (status) {
      case 'synced': return <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">Synced</span>;
      case 'cloud': return <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Cloud</span>;
      default: return <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">Local</span>;
    }
  };

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Diamond className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Sketch</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Diamond className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Sketch Integration</h3>
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
              >
                <Link className="h-4 w-4" />
                Connect to Sketch
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <Diamond className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sketch Integration</h2>
              <p className="text-sm text-gray-500">
                Sync your designs between MockFlow and Sketch
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
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                  >
                    <Link className="h-4 w-4" />
                    Connect to Sketch
                  </button>
                )}
          </div>
        </div>

        {/* Tabs */}
        {isConnected && (
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'bg-white text-gray-900 shadow dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <FolderOpen className="mr-2 inline h-4 w-4" />
              Documents
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
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document selection */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Recent Sketch Documents</h3>
                <div className="space-y-2">
                  {mockSketchDocuments.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                        selectedDocument?.id === doc.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.pagesCount}
                              {' '}
                              pages •
                              {doc.artboardsCount}
                              {' '}
                              artboards
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getCloudStatusBadge(doc.cloudStatus)}
                          <a
                            href="#"
                            onClick={e => e.stopPropagation()}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artboard selection */}
              {selectedDocument && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    Select Artboards to Import
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mockSketchArtboards.map(artboard => (
                      <div
                        key={artboard.id}
                        onClick={() => toggleArtboardSelection(artboard.id)}
                        className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                          selectedArtboards.includes(artboard.id)
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          {artboard.isSymbol
                            ? (
                                <Layers className="h-4 w-4 text-purple-500" />
                              )
                            : (
                                <FileImage className="h-4 w-4 text-gray-500" />
                              )}
                          <span className="truncate text-sm font-medium text-gray-900 dark:text-white">{artboard.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {artboard.width}
                          ×
                          {artboard.height}
                          {' '}
                          •
                          {' '}
                          {artboard.pageName}
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
                  disabled={selectedArtboards.length === 0 || syncStatus === 'syncing'}
                  className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Import Selected (
                  {selectedArtboards.length}
                  )
                </button>
                <button
                  onClick={handleExport}
                  disabled={selectedArtboards.length === 0 || syncStatus === 'syncing'}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Upload className="h-4 w-4" />
                  Export to Sketch
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
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
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
                  { key: 'includeSymbols', label: 'Include Symbols' },
                  { key: 'includeSharedStyles', label: 'Include Shared Styles' },
                  { key: 'includeColorVariables', label: 'Include Color Variables' },
                  { key: 'overwriteExisting', label: 'Overwrite existing items' },
                  { key: 'autoSync', label: 'Enable auto-sync' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings[key as keyof SketchSyncSettings] as boolean}
                      onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Not connected state */}
      {!isConnected && (
        <div className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Diamond className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Connect your Sketch account
          </h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-500">
            Import your Sketch designs directly into MockFlow or export your mockups back to Sketch.
          </p>
          <button
            onClick={handleConnect}
            disabled={syncStatus === 'syncing'}
            className="mx-auto flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {syncStatus === 'syncing'
              ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                )
              : (
                  <Link className="h-5 w-5" />
                )}
            Connect to Sketch
          </button>
        </div>
      )}
    </div>
  );
}

export type { SketchArtboard, SketchDocument, SketchPluginIntegrationProps, SketchSyncSettings };
