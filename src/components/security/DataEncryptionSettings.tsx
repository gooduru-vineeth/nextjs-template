'use client';

import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  Database,
  Download,
  FileText,
  Info,
  Key,
  Lock,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type EncryptionAlgorithm = 'AES-256-GCM' | 'AES-256-CBC' | 'ChaCha20-Poly1305';
export type KeyDerivation = 'PBKDF2' | 'Argon2id' | 'scrypt';
export type DataCategory = 'user-data' | 'mockups' | 'exports' | 'backups' | 'api-keys' | 'session-data';

export type EncryptionKey = {
  id: string;
  name: string;
  algorithm: EncryptionAlgorithm;
  createdAt: Date;
  expiresAt?: Date;
  lastRotated?: Date;
  status: 'active' | 'expired' | 'revoked';
  usedFor: DataCategory[];
};

export type EncryptionSettings = {
  algorithm: EncryptionAlgorithm;
  keyDerivation: KeyDerivation;
  iterations: number;
  saltLength: number;
  ivLength: number;
  atRestEncryption: boolean;
  inTransitEncryption: boolean;
  autoKeyRotation: boolean;
  rotationPeriodDays: number;
};

export type DataEncryptionSettingsProps = {
  variant?: 'full' | 'compact' | 'widget';
  settings?: EncryptionSettings;
  keys?: EncryptionKey[];
  onUpdateSettings?: (settings: EncryptionSettings) => void;
  onRotateKey?: (keyId: string) => void;
  onRevokeKey?: (keyId: string) => void;
  onExportKey?: (keyId: string) => void;
};

// Default settings
const defaultSettings: EncryptionSettings = {
  algorithm: 'AES-256-GCM',
  keyDerivation: 'Argon2id',
  iterations: 100000,
  saltLength: 32,
  ivLength: 16,
  atRestEncryption: true,
  inTransitEncryption: true,
  autoKeyRotation: true,
  rotationPeriodDays: 90,
};

// Mock keys
const mockKeys: EncryptionKey[] = [
  {
    id: '1',
    name: 'Primary Data Key',
    algorithm: 'AES-256-GCM',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastRotated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    usedFor: ['user-data', 'mockups', 'exports'],
  },
  {
    id: '2',
    name: 'Backup Encryption Key',
    algorithm: 'AES-256-GCM',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    usedFor: ['backups'],
  },
  {
    id: '3',
    name: 'API Key Encryption',
    algorithm: 'AES-256-GCM',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    status: 'active',
    usedFor: ['api-keys'],
  },
];

// Helper functions
const getKeyStatusColor = (status: 'active' | 'expired' | 'revoked'): string => {
  const colors: Record<'active' | 'expired' | 'revoked', string> = {
    active: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    expired: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    revoked: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  };
  return colors[status];
};

const getCategoryIcon = (category: DataCategory) => {
  const icons: Record<DataCategory, typeof Database> = {
    'user-data': Database,
    'mockups': FileText,
    'exports': Download,
    'backups': Database,
    'api-keys': Key,
    'session-data': Clock,
  };
  return icons[category];
};

const formatDaysUntil = (date: Date): string => {
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) {
    return 'Expired';
  }
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return '1 day';
  }
  return `${days} days`;
};

// Main Component
export default function DataEncryptionSettings({
  variant = 'full',
  settings: initialSettings = defaultSettings,
  keys: initialKeys = mockKeys,
  onUpdateSettings,
  onRotateKey,
  onRevokeKey,
  onExportKey,
}: DataEncryptionSettingsProps) {
  const [settings, setSettings] = useState<EncryptionSettings>(initialSettings);
  const [keys, setKeys] = useState<EncryptionKey[]>(initialKeys);
  const [activeTab, setActiveTab] = useState<'settings' | 'keys'>('settings');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRotating, setIsRotating] = useState<string | null>(null);

  const updateSetting = <K extends keyof EncryptionSettings>(
    key: K,
    value: EncryptionSettings[K],
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateSettings?.(newSettings);
  };

  const handleRotateKey = async (keyId: string) => {
    setIsRotating(keyId);
    onRotateKey?.(keyId);

    // Simulate rotation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setKeys(prev =>
      prev.map(k =>
        k.id === keyId
          ? { ...k, lastRotated: new Date(), expiresAt: new Date(Date.now() + settings.rotationPeriodDays * 24 * 60 * 60 * 1000) }
          : k,
      ),
    );
    setIsRotating(null);
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys(prev =>
      prev.map(k => (k.id === keyId ? { ...k, status: 'revoked' as const } : k)),
    );
    onRevokeKey?.(keyId);
  };

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Encryption</span>
          </div>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Algorithm</span>
            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{settings.algorithm}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">At Rest</span>
            {settings.atRestEncryption
              ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )
              : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">In Transit</span>
            {settings.inTransitEncryption
              ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )
              : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Data Encryption</span>
            </div>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600 dark:bg-green-900/30">
              Enabled
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Algorithm</span>
              <div className="font-mono text-sm text-gray-900 dark:text-white">{settings.algorithm}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Key Derivation</span>
              <div className="font-mono text-sm text-gray-900 dark:text-white">{settings.keyDerivation}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Active Keys</span>
              <div className="text-sm text-gray-900 dark:text-white">{keys.filter(k => k.status === 'active').length}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Auto Rotation</span>
              <div className="text-sm text-gray-900 dark:text-white">
                {settings.autoKeyRotation ? `Every ${settings.rotationPeriodDays} days` : 'Disabled'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Encryption Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure encryption for data at rest and in transit</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="mr-2 inline h-4 w-4" />
          Settings
        </button>
        <button
          onClick={() => setActiveTab('keys')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'keys'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Key className="mr-2 inline h-4 w-4" />
          Encryption Keys (
          {keys.length}
          )
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Encryption status */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Encryption at Rest</span>
                    <p className="text-xs text-gray-500">Encrypt stored data on disk</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.atRestEncryption}
                  onChange={e => updateSetting('atRestEncryption', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Encryption in Transit</span>
                    <p className="text-xs text-gray-500">TLS for all connections</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inTransitEncryption}
                  onChange={e => updateSetting('inTransitEncryption', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>

            {/* Algorithm selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Encryption Algorithm
              </label>
              <select
                value={settings.algorithm}
                onChange={e => updateSetting('algorithm', e.target.value as EncryptionAlgorithm)}
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-3 text-gray-900 dark:bg-gray-800 dark:text-white"
              >
                <option value="AES-256-GCM">AES-256-GCM (Recommended)</option>
                <option value="AES-256-CBC">AES-256-CBC</option>
                <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                AES-256-GCM provides authenticated encryption with hardware acceleration support.
              </p>
            </div>

            {/* Key derivation */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Key Derivation Function
              </label>
              <select
                value={settings.keyDerivation}
                onChange={e => updateSetting('keyDerivation', e.target.value as KeyDerivation)}
                className="w-full rounded-lg border-0 bg-gray-100 px-4 py-3 text-gray-900 dark:bg-gray-800 dark:text-white"
              >
                <option value="Argon2id">Argon2id (Recommended)</option>
                <option value="PBKDF2">PBKDF2</option>
                <option value="scrypt">scrypt</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Argon2id is the winner of the Password Hashing Competition and resistant to GPU attacks.
              </p>
            </div>

            {/* Auto rotation */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-gray-400" />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Automatic Key Rotation</span>
                  <p className="text-xs text-gray-500">Automatically rotate encryption keys periodically</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {settings.autoKeyRotation && (
                  <select
                    value={settings.rotationPeriodDays}
                    onChange={e => updateSetting('rotationPeriodDays', Number.parseInt(e.target.value))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days</option>
                  </select>
                )}
                <input
                  type="checkbox"
                  checked={settings.autoKeyRotation}
                  onChange={e => updateSetting('autoKeyRotation', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Advanced settings toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              Advanced Settings
            </button>

            {showAdvanced && (
              <div className="space-y-4 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      PBKDF2 Iterations
                    </label>
                    <input
                      type="number"
                      value={settings.iterations}
                      onChange={e => updateSetting('iterations', Number.parseInt(e.target.value))}
                      className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Salt Length (bytes)
                    </label>
                    <input
                      type="number"
                      value={settings.saltLength}
                      onChange={e => updateSetting('saltLength', Number.parseInt(e.target.value))}
                      className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      IV Length (bytes)
                    </label>
                    <input
                      type="number"
                      value={settings.ivLength}
                      onChange={e => updateSetting('ivLength', Number.parseInt(e.target.value))}
                      className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                  <Info className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Changing these values may affect compatibility with existing encrypted data.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="space-y-4">
            {keys.map((key) => {
              const daysUntilExpiry = key.expiresAt ? formatDaysUntil(key.expiresAt) : 'Never';
              const isExpiringSoon = key.expiresAt && (key.expiresAt.getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;

              return (
                <div
                  key={key.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                        <Key className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">{key.name}</span>
                          <span className={`rounded px-2 py-0.5 text-xs font-medium ${getKeyStatusColor(key.status)}`}>
                            {key.status}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          <span className="font-mono">{key.algorithm}</span>
                          {' · '}
                          Created
                          {' '}
                          {key.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRotateKey(key.id)}
                        disabled={isRotating === key.id || key.status === 'revoked'}
                        className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 disabled:opacity-50 dark:hover:bg-blue-900/20"
                        title="Rotate key"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRotating === key.id ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => onExportKey?.(key.id)}
                        disabled={key.status === 'revoked'}
                        className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-500 disabled:opacity-50 dark:hover:bg-green-900/20"
                        title="Export key"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRevokeKey(key.id)}
                        disabled={key.status === 'revoked'}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 dark:hover:bg-red-900/20"
                        title="Revoke key"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500">Expires</span>
                      <div className={`flex items-center gap-1 ${isExpiringSoon ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {isExpiringSoon && <AlertTriangle className="h-4 w-4" />}
                        {daysUntilExpiry}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Last Rotated</span>
                      <div className="text-gray-700 dark:text-gray-300">
                        {key.lastRotated ? key.lastRotated.toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Used For</span>
                      <div className="flex flex-wrap items-center gap-1">
                        {key.usedFor.slice(0, 3).map((category) => {
                          const Icon = getCategoryIcon(category);
                          return (
                            <span
                              key={category}
                              className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
                              title={category}
                            >
                              <Icon className="h-3 w-3" />
                            </span>
                          );
                        })}
                        {key.usedFor.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +
                            {key.usedFor.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 py-3 text-gray-500 hover:border-blue-500 hover:text-blue-500 dark:border-gray-700">
              <Key className="h-4 w-4" />
              Generate New Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
