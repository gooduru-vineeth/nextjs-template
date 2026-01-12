'use client';

import {
  AlertTriangle,
  Archive,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Download,
  Edit,
  Eye,
  FileText,
  History,
  Image,
  Pause,
  Play,
  RefreshCw,
  Settings,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type DataCategory = 'mockups' | 'exports' | 'user-data' | 'analytics' | 'audit-logs' | 'backups' | 'temp-files';
export type RetentionAction = 'delete' | 'archive' | 'anonymize' | 'export-then-delete';
export type PolicyStatus = 'active' | 'paused' | 'draft' | 'archived';

export type RetentionPolicy = {
  id: string;
  name: string;
  description: string;
  dataCategory: DataCategory;
  retentionPeriod: number; // days
  action: RetentionAction;
  status: PolicyStatus;
  createdAt: Date;
  updatedAt: Date;
  lastExecuted?: Date;
  nextExecution?: Date;
  affectedRecords?: number;
  exceptions?: string[];
  createdBy: string;
  isSystemPolicy: boolean;
};

export type DataCategoryStats = {
  category: DataCategory;
  totalRecords: number;
  totalSize: string;
  oldestRecord: Date;
  retentionPolicy?: RetentionPolicy;
  scheduledForDeletion: number;
};

export type DataRetentionManagerProps = {
  variant?: 'full' | 'compact' | 'widget';
  policies?: RetentionPolicy[];
  stats?: DataCategoryStats[];
  onCreatePolicy?: (policy: Partial<RetentionPolicy>) => void;
  onUpdatePolicy?: (policy: RetentionPolicy) => void;
  onDeletePolicy?: (policyId: string) => void;
  onExecutePolicy?: (policyId: string) => void;
  onExportData?: (category: DataCategory) => void;
  readOnly?: boolean;
  className?: string;
};

// Category info
const categoryInfo: Record<DataCategory, { name: string; icon: React.ReactNode; description: string }> = {
  'mockups': { name: 'Mockups', icon: <Image className="h-4 w-4" />, description: 'User-created mockup projects' },
  'exports': { name: 'Exports', icon: <Download className="h-4 w-4" />, description: 'Generated export files' },
  'user-data': { name: 'User Data', icon: <Users className="h-4 w-4" />, description: 'Profile and account data' },
  'analytics': { name: 'Analytics', icon: <Eye className="h-4 w-4" />, description: 'Usage and behavior data' },
  'audit-logs': { name: 'Audit Logs', icon: <FileText className="h-4 w-4" />, description: 'System activity logs' },
  'backups': { name: 'Backups', icon: <Archive className="h-4 w-4" />, description: 'System backups' },
  'temp-files': { name: 'Temp Files', icon: <Clock className="h-4 w-4" />, description: 'Temporary processing files' },
};

// Mock data generator
const generateMockPolicies = (): RetentionPolicy[] => {
  const now = new Date();
  return [
    {
      id: 'policy-1',
      name: 'Temp Files Cleanup',
      description: 'Automatically delete temporary files after 24 hours',
      dataCategory: 'temp-files',
      retentionPeriod: 1,
      action: 'delete',
      status: 'active',
      createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      lastExecuted: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      nextExecution: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      affectedRecords: 1247,
      createdBy: 'System',
      isSystemPolicy: true,
    },
    {
      id: 'policy-2',
      name: 'Export Archive Policy',
      description: 'Archive exports older than 30 days',
      dataCategory: 'exports',
      retentionPeriod: 30,
      action: 'archive',
      status: 'active',
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      lastExecuted: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      nextExecution: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      affectedRecords: 523,
      createdBy: 'Admin',
      isSystemPolicy: false,
    },
    {
      id: 'policy-3',
      name: 'Analytics Data Retention',
      description: 'Anonymize analytics data older than 90 days for GDPR compliance',
      dataCategory: 'analytics',
      retentionPeriod: 90,
      action: 'anonymize',
      status: 'active',
      createdAt: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      lastExecuted: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      nextExecution: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      affectedRecords: 15420,
      exceptions: ['Enterprise accounts', 'Opted-in users'],
      createdBy: 'System',
      isSystemPolicy: true,
    },
    {
      id: 'policy-4',
      name: 'Audit Log Archival',
      description: 'Archive audit logs after 1 year, delete after 7 years',
      dataCategory: 'audit-logs',
      retentionPeriod: 365,
      action: 'archive',
      status: 'active',
      createdAt: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      affectedRecords: 89234,
      createdBy: 'System',
      isSystemPolicy: true,
    },
    {
      id: 'policy-5',
      name: 'Inactive User Data',
      description: 'Export and delete data for users inactive for 2 years',
      dataCategory: 'user-data',
      retentionPeriod: 730,
      action: 'export-then-delete',
      status: 'paused',
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      affectedRecords: 342,
      createdBy: 'Admin',
      isSystemPolicy: false,
    },
  ];
};

const generateMockStats = (): DataCategoryStats[] => {
  const now = new Date();
  return [
    {
      category: 'mockups',
      totalRecords: 45678,
      totalSize: '12.4 GB',
      oldestRecord: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      scheduledForDeletion: 0,
    },
    {
      category: 'exports',
      totalRecords: 23456,
      totalSize: '45.2 GB',
      oldestRecord: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      scheduledForDeletion: 523,
    },
    {
      category: 'user-data',
      totalRecords: 12890,
      totalSize: '2.1 GB',
      oldestRecord: new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000),
      scheduledForDeletion: 342,
    },
    {
      category: 'analytics',
      totalRecords: 1567890,
      totalSize: '8.7 GB',
      oldestRecord: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000),
      scheduledForDeletion: 15420,
    },
    {
      category: 'audit-logs',
      totalRecords: 892340,
      totalSize: '4.3 GB',
      oldestRecord: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      scheduledForDeletion: 0,
    },
    {
      category: 'temp-files',
      totalRecords: 3456,
      totalSize: '1.2 GB',
      oldestRecord: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      scheduledForDeletion: 1247,
    },
  ];
};

// Helper components
const StatusBadge: React.FC<{ status: PolicyStatus }> = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    archived: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const icons = {
    active: <CheckCircle className="h-3 w-3" />,
    paused: <Pause className="h-3 w-3" />,
    draft: <Edit className="h-3 w-3" />,
    archived: <Archive className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const ActionBadge: React.FC<{ action: RetentionAction }> = ({ action }) => {
  const styles = {
    'delete': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'archive': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'anonymize': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'export-then-delete': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const labels = {
    'delete': 'Delete',
    'archive': 'Archive',
    'anonymize': 'Anonymize',
    'export-then-delete': 'Export & Delete',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[action]}`}>
      {labels[action]}
    </span>
  );
};

const formatRetentionPeriod = (days: number): string => {
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
  if (days < 30) {
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? 's' : ''}`;
  }
  if (days < 365) {
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) !== 1 ? 's' : ''}`;
  }
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) !== 1 ? 's' : ''}`;
};

// Policy card component
export const PolicyCard: React.FC<{
  policy: RetentionPolicy;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
  onExecute?: () => void;
  readOnly?: boolean;
}> = ({ policy, onEdit, onDelete, onToggle, onExecute, readOnly }) => {
  const [expanded, setExpanded] = useState(false);
  const category = categoryInfo[policy.dataCategory];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div
        className="cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <button className="text-gray-400">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <div className="rounded-lg bg-gray-100 p-2 text-gray-500 dark:bg-gray-700">
            {category.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">{policy.name}</h3>
              {policy.isSystemPolicy && (
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  System
                </span>
              )}
            </div>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{policy.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatRetentionPeriod(policy.retentionPeriod)}
              </div>
              <div className="text-xs text-gray-500">retention</div>
            </div>
            <ActionBadge action={policy.action} />
            <StatusBadge status={policy.status} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 pb-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="grid grid-cols-2 gap-4 pt-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Data Category:</span>
              <span className="ml-2 text-gray-900 capitalize dark:text-white">{category.name}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Affected Records:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {policy.affectedRecords?.toLocaleString() || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Executed:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {policy.lastExecuted?.toLocaleDateString() || 'Never'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Next Execution:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {policy.nextExecution?.toLocaleDateString() || 'N/A'}
              </span>
            </div>
          </div>

          {policy.exceptions && policy.exceptions.length > 0 && (
            <div className="mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Exceptions:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {policy.exceptions.map((exception, i) => (
                  <span
                    key={i}
                    className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  >
                    {exception}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!readOnly && (
            <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle?.();
                }}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm ${
                  policy.status === 'active'
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                }`}
              >
                {policy.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {policy.status === 'active' ? 'Pause' : 'Activate'}
              </button>
              {policy.status === 'active' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExecute?.();
                  }}
                  className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  <RefreshCw className="h-4 w-4" />
                  Run Now
                </button>
              )}
              {!policy.isSystemPolicy && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Data category stats card
export const CategoryStatsCard: React.FC<{
  stats: DataCategoryStats;
  onExport?: () => void;
}> = ({ stats, onExport }) => {
  const category = categoryInfo[stats.category];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2 text-gray-500 dark:bg-gray-700">
            {category.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{category.description}</p>
          </div>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Export data"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalRecords.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Total Records</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSize}</div>
          <div className="text-xs text-gray-500">Storage Used</div>
        </div>
      </div>

      {stats.scheduledForDeletion > 0 && (
        <div className="mt-3 rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">
              {stats.scheduledForDeletion.toLocaleString()}
              {' '}
              records scheduled for processing
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
export const DataRetentionManager: React.FC<DataRetentionManagerProps> = ({
  variant = 'full',
  policies: propPolicies,
  stats: propStats,
  onCreatePolicy,
  onUpdatePolicy,
  onDeletePolicy,
  onExecutePolicy,
  onExportData,
  readOnly = false,
  className = '',
}) => {
  const [policies] = useState<RetentionPolicy[]>(() => propPolicies || generateMockPolicies());
  const [stats] = useState<DataCategoryStats[]>(() => propStats || generateMockStats());
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | 'all'>('all');
  const [_showCreateModal, setShowCreateModal] = useState(false);

  const filteredPolicies = useMemo(() => {
    if (selectedCategory === 'all') {
      return policies;
    }
    return policies.filter(p => p.dataCategory === selectedCategory);
  }, [policies, selectedCategory]);

  const totalScheduledForDeletion = useMemo(() => {
    return stats.reduce((sum, s) => sum + s.scheduledForDeletion, 0);
  }, [stats]);

  const totalStorageUsed = useMemo(() => {
    return stats.reduce((sum, s) => {
      const size = Number.parseFloat(s.totalSize);
      return sum + size;
    }, 0);
  }, [stats]);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Database className="h-5 w-5" />
            Data Retention
          </h3>
          <StatusBadge status="active" />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Active Policies</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {policies.filter(p => p.status === 'active').length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Scheduled for Processing</span>
            <span className="font-semibold text-yellow-600">{totalScheduledForDeletion.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Storage</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalStorageUsed.toFixed(1)}
              {' '}
              GB
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Database className="h-5 w-5" />
            Data Retention Policies
          </h3>
        </div>
        <div className="max-h-96 space-y-3 overflow-y-auto p-4">
          {policies.slice(0, 5).map(policy => (
            <div
              key={policy.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                {categoryInfo[policy.dataCategory].icon}
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{policy.name}</div>
                  <div className="text-xs text-gray-500">{formatRetentionPeriod(policy.retentionPeriod)}</div>
                </div>
              </div>
              <StatusBadge status={policy.status} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 text-white">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Retention</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage data lifecycle and compliance policies
              </p>
            </div>
          </div>
          {!readOnly && onCreatePolicy && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Settings className="h-4 w-4" />
              New Policy
            </button>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Active Policies</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {policies.filter(p => p.status === 'active').length}
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Scheduled Processing</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {totalScheduledForDeletion.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Database className="h-4 w-4" />
              <span className="text-sm">Total Storage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalStorageUsed.toFixed(1)}
              {' '}
              GB
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50">
            <div className="mb-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <History className="h-4 w-4" />
              <span className="text-sm">Data Categories</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.length}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Category filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {Object.entries(categoryInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as DataCategory)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === key
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {info.icon}
              {info.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Policies list */}
          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Retention Policies</h2>
            {filteredPolicies.length === 0
              ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                    <Database className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No Policies Found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedCategory === 'all'
                        ? 'Create your first data retention policy to get started'
                        : `No policies found for ${categoryInfo[selectedCategory].name}`}
                    </p>
                  </div>
                )
              : (
                  filteredPolicies.map(policy => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      readOnly={readOnly}
                      onEdit={() => onUpdatePolicy?.(policy)}
                      onDelete={() => onDeletePolicy?.(policy.id)}
                      onToggle={() => {
                        const updated = {
                          ...policy,
                          status: policy.status === 'active' ? 'paused' : 'active',
                        } as RetentionPolicy;
                        onUpdatePolicy?.(updated);
                      }}
                      onExecute={() => onExecutePolicy?.(policy.id)}
                    />
                  ))
                )}
          </div>

          {/* Category stats */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Categories</h2>
            {stats.map(stat => (
              <CategoryStatsCard key={stat.category} stats={stat} onExport={() => onExportData?.(stat.category)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRetentionManager;
