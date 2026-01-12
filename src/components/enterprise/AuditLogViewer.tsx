'use client';

import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  Share2,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type AuditActionType
  = | 'create'
    | 'update'
    | 'delete'
    | 'view'
    | 'export'
    | 'share'
    | 'login'
    | 'logout'
    | 'settings_change'
    | 'permission_change'
    | 'invite_sent'
    | 'invite_accepted';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export type AuditUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer' | 'owner';
};

export type AuditLogEntry = {
  id: string;
  timestamp: Date;
  user: AuditUser;
  action: AuditActionType;
  severity: AuditSeverity;
  resourceType: 'mockup' | 'template' | 'team' | 'user' | 'settings' | 'workspace';
  resourceId: string;
  resourceName: string;
  details: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export type AuditFilters = {
  search: string;
  actions: AuditActionType[];
  severities: AuditSeverity[];
  users: string[];
  dateRange: { start: Date | null; end: Date | null };
  resourceTypes: string[];
};

export type AuditLogViewerProps = {
  variant?: 'full' | 'compact' | 'widget';
  logs?: AuditLogEntry[];
  onExport?: (logs: AuditLogEntry[], format: 'csv' | 'json' | 'pdf') => void;
  onRefresh?: () => void;
  showFilters?: boolean;
  maxHeight?: string;
  className?: string;
};

// Mock data generator
const generateMockLogs = (): AuditLogEntry[] => {
  const users: AuditUser[] = [
    { id: '1', name: 'John Smith', email: 'john@company.com', role: 'admin' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'editor' },
    { id: '3', name: 'Mike Chen', email: 'mike@company.com', role: 'viewer' },
    { id: '4', name: 'Emily Davis', email: 'emily@company.com', role: 'owner' },
  ];

  const actions: { action: AuditActionType; severity: AuditSeverity; resource: string; detail: string }[] = [
    { action: 'create', severity: 'info', resource: 'mockup', detail: 'Created new WhatsApp mockup' },
    { action: 'update', severity: 'info', resource: 'mockup', detail: 'Updated message content' },
    { action: 'delete', severity: 'warning', resource: 'mockup', detail: 'Deleted mockup from workspace' },
    { action: 'export', severity: 'info', resource: 'mockup', detail: 'Exported as PNG (2x resolution)' },
    { action: 'share', severity: 'info', resource: 'mockup', detail: 'Shared with team members' },
    { action: 'login', severity: 'info', resource: 'user', detail: 'Logged in via Google OAuth' },
    { action: 'logout', severity: 'info', resource: 'user', detail: 'Session ended' },
    { action: 'settings_change', severity: 'warning', resource: 'settings', detail: 'Changed workspace settings' },
    { action: 'permission_change', severity: 'critical', resource: 'team', detail: 'Changed user permissions' },
    { action: 'invite_sent', severity: 'info', resource: 'team', detail: 'Sent team invitation' },
    { action: 'view', severity: 'info', resource: 'template', detail: 'Viewed template gallery' },
  ];

  const logs: AuditLogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)]!;
    const actionData = actions[Math.floor(Math.random() * actions.length)]!;
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    logs.push({
      id: `log-${i}`,
      timestamp,
      user,
      action: actionData.action,
      severity: actionData.severity,
      resourceType: actionData.resource as AuditLogEntry['resourceType'],
      resourceId: `res-${Math.floor(Math.random() * 1000)}`,
      resourceName: `${actionData.resource.charAt(0).toUpperCase() + actionData.resource.slice(1)} #${Math.floor(Math.random() * 100)}`,
      details: actionData.detail,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Helper components
const ActionIcon: React.FC<{ action: AuditActionType; className?: string }> = ({ action, className }) => {
  const iconProps = { className: className || 'w-4 h-4' };
  switch (action) {
    case 'create':
      return <FileText {...iconProps} />;
    case 'update':
      return <Edit {...iconProps} />;
    case 'delete':
      return <Trash2 {...iconProps} />;
    case 'view':
      return <Eye {...iconProps} />;
    case 'export':
      return <Download {...iconProps} />;
    case 'share':
      return <Share2 {...iconProps} />;
    case 'login':
      return <LogIn {...iconProps} />;
    case 'logout':
      return <LogOut {...iconProps} />;
    case 'settings_change':
      return <Settings {...iconProps} />;
    case 'permission_change':
      return <Shield {...iconProps} />;
    case 'invite_sent':
    case 'invite_accepted':
      return <User {...iconProps} />;
    default:
      return <Activity {...iconProps} />;
  }
};

const SeverityBadge: React.FC<{ severity: AuditSeverity }> = ({ severity }) => {
  const styles = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const icons = {
    info: <CheckCircle className="h-3 w-3" />,
    warning: <AlertTriangle className="h-3 w-3" />,
    critical: <AlertTriangle className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[severity]}`}>
      {icons[severity]}
      {severity}
    </span>
  );
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString();
};

// Log entry row component
export const LogEntryRow: React.FC<{
  log: AuditLogEntry;
  expanded: boolean;
  onToggle: () => void;
}> = ({ log, expanded, onToggle }) => {
  return (
    <div className="border-b border-gray-200 last:border-0 dark:border-gray-700">
      <div
        className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        onClick={onToggle}
      >
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="flex min-w-[200px] items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium dark:bg-gray-700">
            {log.user.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{log.user.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{log.user.email}</div>
          </div>
        </div>

        <div className="flex min-w-[120px] items-center gap-2">
          <ActionIcon action={log.action} className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700 capitalize dark:text-gray-300">
            {log.action.replace('_', ' ')}
          </span>
        </div>

        <div className="flex-1 truncate text-sm text-gray-600 dark:text-gray-400">{log.details}</div>

        <SeverityBadge severity={log.severity} />

        <div className="flex min-w-[100px] items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          {formatTimestamp(log.timestamp)}
        </div>
      </div>

      {expanded && (
        <div className="bg-gray-50 px-4 pb-4 pl-16 dark:bg-gray-800/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Resource:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{log.resourceName}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Resource ID:</span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">{log.resourceId}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Timestamp:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{log.timestamp.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">IP Address:</span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">{log.ipAddress}</span>
            </div>
            {log.userAgent && (
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">User Agent:</span>
                <span className="ml-2 text-xs text-gray-900 dark:text-white">{log.userAgent}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Filter panel component
export const FilterPanel: React.FC<{
  filters: AuditFilters;
  onChange: (filters: AuditFilters) => void;
  onReset: () => void;
}> = ({ filters, onChange, onReset }) => {
  const actionOptions: AuditActionType[] = [
    'create',
    'update',
    'delete',
    'view',
    'export',
    'share',
    'login',
    'logout',
    'settings_change',
    'permission_change',
  ];

  const severityOptions: AuditSeverity[] = ['info', 'warning', 'critical'];

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Actions
          </label>
          <div className="flex flex-wrap gap-1">
            {actionOptions.map(action => (
              <button
                key={action}
                onClick={() => {
                  const newActions = filters.actions.includes(action)
                    ? filters.actions.filter(a => a !== action)
                    : [...filters.actions, action];
                  onChange({ ...filters, actions: newActions });
                }}
                className={`rounded px-2 py-1 text-xs ${
                  filters.actions.includes(action)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {action.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Severity
          </label>
          <div className="flex gap-2">
            {severityOptions.map(severity => (
              <button
                key={severity}
                onClick={() => {
                  const newSeverities = filters.severities.includes(severity)
                    ? filters.severities.filter(s => s !== severity)
                    : [...filters.severities, severity];
                  onChange({ ...filters, severities: newSeverities });
                }}
                className={`rounded px-3 py-1 text-xs capitalize ${
                  filters.severities.includes(severity)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
            Date Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={e =>
                onChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value ? new Date(e.target.value) : null },
                })}
              className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={e =>
                onChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value ? new Date(e.target.value) : null },
                })}
              className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  variant = 'full',
  logs: propLogs,
  onExport,
  onRefresh,
  showFilters = true,
  maxHeight = '600px',
  className = '',
}) => {
  const [logs] = useState<AuditLogEntry[]>(() => propLogs || generateMockLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    actions: [],
    severities: [],
    users: [],
    dateRange: { start: null, end: null },
    resourceTypes: [],
  });

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch
          = log.user.name.toLowerCase().includes(query)
            || log.user.email.toLowerCase().includes(query)
            || log.details.toLowerCase().includes(query)
            || log.resourceName.toLowerCase().includes(query);
        if (!matchesSearch) {
          return false;
        }
      }

      // Action filter
      if (filters.actions.length > 0 && !filters.actions.includes(log.action)) {
        return false;
      }

      // Severity filter
      if (filters.severities.length > 0 && !filters.severities.includes(log.severity)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start && log.timestamp < filters.dateRange.start) {
        return false;
      }
      if (filters.dateRange.end && log.timestamp > filters.dateRange.end) {
        return false;
      }

      return true;
    });
  }, [logs, searchQuery, filters]);

  const toggleLogExpanded = (logId: string) => {
    setExpandedLogs((prev) => {
      const next = new Set(prev);
      if (next.has(logId)) {
        next.delete(logId);
      } else {
        next.add(logId);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      actions: [],
      severities: [],
      users: [],
      dateRange: { start: null, end: null },
      resourceTypes: [],
    });
    setSearchQuery('');
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    if (onExport) {
      onExport(filteredLogs, format);
    }
  };

  // Widget variant
  if (variant === 'widget') {
    const recentLogs = filteredLogs.slice(0, 5);
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h3>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentLogs.map(log => (
            <div key={log.id} className="flex items-center gap-3 p-3">
              <ActionIcon action={log.action} className="h-4 w-4 text-gray-500" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-gray-900 dark:text-white">{log.details}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {log.user.name}
                  {' '}
                  ·
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
              <SeverityBadge severity={log.severity} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm dark:border-gray-600 dark:bg-gray-800"
              />
            </div>
            <span className="text-sm text-gray-500">
              {filteredLogs.length}
              {' '}
              entries
            </span>
          </div>
        </div>
        <div style={{ maxHeight }} className="overflow-y-auto">
          {filteredLogs.map(log => (
            <LogEntryRow
              key={log.id}
              log={log}
              expanded={expandedLogs.has(log.id)}
              onToggle={() => toggleLogExpanded(log.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Activity className="h-6 w-6" />
              Audit Log
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track all activity and changes in your workspace
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, action, or resource..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                showFilterPanel
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(filters.actions.length > 0 || filters.severities.length > 0) && (
                <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">
                  {filters.actions.length + filters.severities.length}
                </span>
              )}
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {filteredLogs.length}
            {' '}
            entries
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && showFilterPanel && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <FilterPanel filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>
      )}

      {/* Log entries */}
      <div style={{ maxHeight }} className="overflow-y-auto">
        {filteredLogs.length === 0
          ? (
              <div className="p-12 text-center">
                <Activity className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No logs found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || filters.actions.length > 0
                    ? 'Try adjusting your filters or search query'
                    : 'Activity will appear here once users start interacting'}
                </p>
              </div>
            )
          : (
              filteredLogs.map(log => (
                <LogEntryRow
                  key={log.id}
                  log={log}
                  expanded={expandedLogs.has(log.id)}
                  onToggle={() => toggleLogExpanded(log.id)}
                />
              ))
            )}
      </div>
    </div>
  );
};

export default AuditLogViewer;
