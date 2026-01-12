'use client';

import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  File,
  FileImage,
  FileText,
  Loader2,
  Pause,
  Play,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'paused' | 'cancelled';
type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf' | 'webp' | 'gif';
type ProgressVariant = 'full' | 'compact' | 'minimal' | 'toast';

type ExportItem = {
  id: string;
  name: string;
  format: ExportFormat;
  status: ExportStatus;
  progress: number;
  size?: number;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  downloadUrl?: string;
};

type ExportBatch = {
  id: string;
  name: string;
  items: ExportItem[];
  totalProgress: number;
  status: ExportStatus;
  startedAt: string;
  estimatedTimeRemaining?: number;
};

export type ExportProgressIndicatorProps = {
  variant?: ProgressVariant;
  batch?: ExportBatch;
  onPause?: (batchId: string) => void;
  onResume?: (batchId: string) => void;
  onCancel?: (batchId: string) => void;
  onRetry?: (itemId: string) => void;
  onDownload?: (itemId: string) => void;
  onDismiss?: () => void;
  className?: string;
};

// Mock data
const mockBatch: ExportBatch = {
  id: '1',
  name: 'iPhone Mockups',
  items: [
    { id: '1', name: 'chat-mockup-1.png', format: 'png', status: 'completed', progress: 100, size: 245000, completedAt: '2024-01-12T10:30:00Z' },
    { id: '2', name: 'chat-mockup-2.png', format: 'png', status: 'completed', progress: 100, size: 312000, completedAt: '2024-01-12T10:30:05Z' },
    { id: '3', name: 'chat-mockup-3.png', format: 'png', status: 'processing', progress: 65, startedAt: '2024-01-12T10:30:10Z' },
    { id: '4', name: 'chat-mockup-4.png', format: 'png', status: 'pending', progress: 0 },
    { id: '5', name: 'all-mockups.pdf', format: 'pdf', status: 'pending', progress: 0 },
  ],
  totalProgress: 53,
  status: 'processing',
  startedAt: '2024-01-12T10:30:00Z',
  estimatedTimeRemaining: 45,
};

export default function ExportProgressIndicator({
  variant = 'full',
  batch = mockBatch,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onDownload,
  onDismiss,
  className = '',
}: ExportProgressIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [_animatedProgress, setAnimatedProgress] = useState(batch.totalProgress);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(batch.totalProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [batch.totalProgress]);

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'png':
      case 'jpg':
      case 'webp':
      case 'gif':
        return <FileImage className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: ExportStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ExportStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const completedCount = batch.items.filter(i => i.status === 'completed').length;
  const failedCount = batch.items.filter(i => i.status === 'failed').length;

  const handlePause = useCallback(() => {
    onPause?.(batch.id);
  }, [batch.id, onPause]);

  const handleResume = useCallback(() => {
    onResume?.(batch.id);
  }, [batch.id, onResume]);

  const handleCancel = useCallback(() => {
    onCancel?.(batch.id);
  }, [batch.id, onCancel]);

  // Toast variant - minimal floating notification
  if (variant === 'toast') {
    return (
      <div className={`fixed right-4 bottom-4 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Exporting...</span>
          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-300 ${getStatusColor(batch.status)}`}
            style={{ width: `${batch.totalProgress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            {completedCount}
            /
            {batch.items.length}
            {' '}
            files
          </span>
          {batch.estimatedTimeRemaining && (
            <span>
              ~
              {formatTime(batch.estimatedTimeRemaining)}
              {' '}
              remaining
            </span>
          )}
        </div>
      </div>
    );
  }

  // Minimal variant - inline progress bar
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {getStatusIcon(batch.status)}
        <div className="flex-1">
          <div className="relative h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`absolute inset-y-0 left-0 transition-all duration-300 ${getStatusColor(batch.status)}`}
              style={{ width: `${batch.totalProgress}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {batch.totalProgress}
          %
        </span>
      </div>
    );
  }

  // Compact variant - collapsible summary
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(batch.status)}
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{batch.name}</p>
              <p className="text-xs text-gray-500">
                {completedCount}
                /
                {batch.items.length}
                {' '}
                completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {batch.totalProgress}
              %
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 px-3 pb-3 dark:border-gray-800">
            <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-300 ${getStatusColor(batch.status)}`}
                style={{ width: `${batch.totalProgress}%` }}
              />
            </div>
            <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
              {batch.items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="max-w-[150px] truncate text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  {item.status === 'processing' && (
                    <span className="text-gray-500">
                      {item.progress}
                      %
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${
              batch.status === 'completed'
                ? 'bg-green-100 dark:bg-green-900/30'
                : batch.status === 'failed'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
            }`}
            >
              <Download className={`h-5 w-5 ${
                batch.status === 'completed'
                  ? 'text-green-600 dark:text-green-400'
                  : batch.status === 'failed'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-blue-600 dark:text-blue-400'
              }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{batch.name}</h3>
              <p className="text-sm text-gray-500">
                {completedCount}
                {' '}
                of
                {batch.items.length}
                {' '}
                files exported
                {failedCount > 0 && (
                  <span className="text-red-500">
                    {' '}
                    (
                    {failedCount}
                    {' '}
                    failed)
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {batch.status === 'processing' && (
              <button
                onClick={handlePause}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Pause"
              >
                <Pause className="h-4 w-4" />
              </button>
            )}
            {batch.status === 'paused' && (
              <button
                onClick={handleResume}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Resume"
              >
                <Play className="h-4 w-4" />
              </button>
            )}
            {(batch.status === 'processing' || batch.status === 'paused') && (
              <button
                onClick={handleCancel}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {batch.totalProgress}
            %
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`absolute inset-y-0 left-0 transition-all duration-500 ${getStatusColor(batch.status)}`}
            style={{ width: `${batch.totalProgress}%` }}
          />
        </div>
        {batch.estimatedTimeRemaining && batch.status === 'processing' && (
          <p className="mt-2 text-xs text-gray-500">
            Estimated time remaining:
            {' '}
            {formatTime(batch.estimatedTimeRemaining)}
          </p>
        )}
      </div>

      {/* Items list */}
      <div className="max-h-64 divide-y divide-gray-200 overflow-y-auto dark:divide-gray-800">
        {batch.items.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="rounded bg-gray-100 p-1.5 dark:bg-gray-800">
                {getFormatIcon(item.format)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="uppercase">{item.format}</span>
                  {item.size && <span>{formatFileSize(item.size)}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.status === 'processing' && (
                <div className="w-20">
                  <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-right text-xs text-gray-500">
                    {item.progress}
                    %
                  </p>
                </div>
              )}

              {item.status === 'completed' && (
                <button
                  onClick={() => onDownload?.(item.id)}
                  className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              )}

              {item.status === 'failed' && (
                <button
                  onClick={() => onRetry?.(item.id)}
                  className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  Retry
                </button>
              )}

              {getStatusIcon(item.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {batch.status === 'completed' && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <button
            onClick={() => {}}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download All as ZIP
          </button>
        </div>
      )}
    </div>
  );
}

export type { ExportBatch, ExportFormat, ExportItem, ExportStatus, ProgressVariant };
