'use client';

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  FileText,
  Gauge,
  HardDrive,
  Image,
  RefreshCw,
  Settings,
  Trash2,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// Types
export type MetricStatus = 'good' | 'needs-improvement' | 'poor';
export type CacheStrategy = 'network-first' | 'cache-first' | 'stale-while-revalidate' | 'cache-only';
export type ResourceType = 'image' | 'script' | 'style' | 'font' | 'document' | 'xhr' | 'other';

export type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  status: MetricStatus;
  target: number;
  description: string;
};

export type CacheEntry = {
  key: string;
  size: number;
  timestamp: Date;
  type: ResourceType;
  hits: number;
  strategy: CacheStrategy;
};

export type LazyLoadConfig = {
  images: boolean;
  videos: boolean;
  iframes: boolean;
  threshold: number;
  placeholder: 'blur' | 'skeleton' | 'none';
};

export type PerformanceReport = {
  timestamp: Date;
  metrics: PerformanceMetric[];
  cacheSize: number;
  cacheEntries: CacheEntry[];
  lazyLoadConfig: LazyLoadConfig;
  suggestions: string[];
};

export type PerformanceOptimizerProps = {
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onOptimize?: () => void;
  onClearCache?: () => void;
  onUpdateConfig?: (config: LazyLoadConfig) => void;
};

// Mock data generator
const generateMockReport = (): PerformanceReport => {
  const metrics: PerformanceMetric[] = [
    {
      name: 'First Contentful Paint',
      value: 1.2,
      unit: 's',
      status: 'good',
      target: 1.8,
      description: 'Time until the first content is painted on screen',
    },
    {
      name: 'Largest Contentful Paint',
      value: 2.8,
      unit: 's',
      status: 'needs-improvement',
      target: 2.5,
      description: 'Time until the largest content element is visible',
    },
    {
      name: 'Time to Interactive',
      value: 3.5,
      unit: 's',
      status: 'needs-improvement',
      target: 3.0,
      description: 'Time until the page is fully interactive',
    },
    {
      name: 'Cumulative Layout Shift',
      value: 0.05,
      unit: '',
      status: 'good',
      target: 0.1,
      description: 'Measure of visual stability',
    },
    {
      name: 'First Input Delay',
      value: 45,
      unit: 'ms',
      status: 'good',
      target: 100,
      description: 'Time from first interaction to browser response',
    },
    {
      name: 'Total Blocking Time',
      value: 280,
      unit: 'ms',
      status: 'needs-improvement',
      target: 200,
      description: 'Total time when main thread was blocked',
    },
  ];

  const cacheEntries: CacheEntry[] = [
    { key: '/api/templates', size: 45000, timestamp: new Date(), type: 'xhr', hits: 23, strategy: 'stale-while-revalidate' },
    { key: '/images/hero.webp', size: 120000, timestamp: new Date(), type: 'image', hits: 156, strategy: 'cache-first' },
    { key: '/fonts/inter.woff2', size: 85000, timestamp: new Date(), type: 'font', hits: 89, strategy: 'cache-first' },
    { key: '/styles/main.css', size: 32000, timestamp: new Date(), type: 'style', hits: 234, strategy: 'cache-first' },
    { key: '/scripts/editor.js', size: 280000, timestamp: new Date(), type: 'script', hits: 67, strategy: 'network-first' },
    { key: '/api/user/profile', size: 2500, timestamp: new Date(), type: 'xhr', hits: 45, strategy: 'network-first' },
  ];

  return {
    timestamp: new Date(),
    metrics,
    cacheSize: cacheEntries.reduce((sum, e) => sum + e.size, 0),
    cacheEntries,
    lazyLoadConfig: {
      images: true,
      videos: true,
      iframes: true,
      threshold: 0.1,
      placeholder: 'blur',
    },
    suggestions: [
      'Optimize hero image - consider WebP format and responsive sizes',
      'Enable text compression for API responses',
      'Preload critical fonts to reduce layout shift',
      'Consider code splitting for the editor module',
      'Add resource hints (preconnect, prefetch) for external APIs',
    ],
  };
};

// Helper functions
const getStatusColor = (status: MetricStatus): string => {
  const colors: Record<MetricStatus, string> = {
    'good': 'text-green-500 bg-green-100 dark:bg-green-900/30',
    'needs-improvement': 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    'poor': 'text-red-500 bg-red-100 dark:bg-red-900/30',
  };
  return colors[status];
};

const getStatusIcon = (status: MetricStatus) => {
  const icons = {
    'good': CheckCircle,
    'needs-improvement': AlertTriangle,
    'poor': AlertTriangle,
  };
  return icons[status];
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getResourceIcon = (type: ResourceType) => {
  const icons: Record<ResourceType, typeof Image> = {
    image: Image,
    script: FileText,
    style: FileText,
    font: FileText,
    document: FileText,
    xhr: Database,
    other: FileText,
  };
  return icons[type];
};

// Main Component
export default function PerformanceOptimizer({
  variant = 'full',
  onOptimize,
  onClearCache,
  onUpdateConfig,
}: PerformanceOptimizerProps) {
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'cache' | 'config'>('metrics');
  const [expandedSuggestions, setExpandedSuggestions] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize lazy loading observer
  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              if (target.dataset.src) {
                (target as HTMLImageElement).src = target.dataset.src;
                observerRef.current?.unobserve(target);
              }
            }
          });
        },
        { threshold: report?.lazyLoadConfig.threshold || 0.1 },
      );
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [report?.lazyLoadConfig.threshold]);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    onOptimize?.();

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newReport = generateMockReport();
    setReport(newReport);
    setIsAnalyzing(false);
  }, [onOptimize]);

  const handleClearCache = () => {
    if (report) {
      setReport({
        ...report,
        cacheSize: 0,
        cacheEntries: [],
      });
      onClearCache?.();
    }
  };

  const updateLazyLoadConfig = (updates: Partial<LazyLoadConfig>) => {
    if (report) {
      const newConfig = { ...report.lazyLoadConfig, ...updates };
      setReport({
        ...report,
        lazyLoadConfig: newConfig,
      });
      onUpdateConfig?.(newConfig);
    }
  };

  const overallScore = report
    ? Math.round(
        (report.metrics.filter(m => m.status === 'good').length / report.metrics.length) * 100,
      )
    : 0;

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Performance</span>
          </div>
          {report && (
            <span className={`text-lg font-bold ${overallScore >= 80 ? 'text-green-500' : overallScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {overallScore}
              %
            </span>
          )}
        </div>
        {report
          ? (
              <div className="space-y-2">
                {report.metrics.slice(0, 3).map(metric => (
                  <div key={metric.name} className="flex items-center justify-between text-xs">
                    <span className="truncate text-gray-600 dark:text-gray-400">{metric.name}</span>
                    <span className={getStatusColor(metric.status).split(' ')[0]}>
                      {metric.value}
                      {metric.unit}
                    </span>
                  </div>
                ))}
              </div>
            )
          : (
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full rounded-lg bg-amber-500 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-gray-900 dark:text-white">Performance</span>
            </div>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {isAnalyzing
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  )
                : (
                    <>
                      <Activity className="h-4 w-4" />
                      Analyze
                    </>
                  )}
            </button>
          </div>
        </div>
        {report && (
          <div className="p-4">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Gauge className={`mx-auto mb-1 h-6 w-6 ${overallScore >= 80 ? 'text-green-500' : overallScore >= 50 ? 'text-amber-500' : 'text-red-500'}`} />
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">{overallScore}</span>
                <span className="text-xs text-gray-500">Score</span>
              </div>
              <div className="text-center">
                <HardDrive className="mx-auto mb-1 h-6 w-6 text-blue-500" />
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                  {formatBytes(report.cacheSize).split(' ')[0]}
                </span>
                <span className="text-xs text-gray-500">
                  Cache (
                  {formatBytes(report.cacheSize).split(' ')[1]}
                  )
                </span>
              </div>
              <div className="text-center">
                <Clock className="mx-auto mb-1 h-6 w-6 text-purple-500" />
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                  {report.metrics.find(m => m.name === 'First Contentful Paint')?.value}
                  s
                </span>
                <span className="text-xs text-gray-500">FCP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Dashboard</h3>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {isAnalyzing
              ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                )
              : (
                  <>
                    <Activity className="h-4 w-4" />
                    Run Analysis
                  </>
                )}
          </button>
        </div>

        {report ? (
          <div className="space-y-6">
            {/* Core Web Vitals */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Core Web Vitals
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {report.metrics.slice(0, 3).map((metric) => {
                  const StatusIcon = getStatusIcon(metric.status);
                  return (
                    <div
                      key={metric.name}
                      className={`rounded-lg p-4 ${getStatusColor(metric.status)}`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-xs font-medium tracking-wide uppercase">
                          {metric.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.value}
                        {metric.unit}
                      </div>
                      <div className="mt-1 text-xs opacity-75">
                        {metric.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Metrics */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Additional Metrics
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {report.metrics.slice(3).map(metric => (
                  <div
                    key={metric.name}
                    className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.name}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(metric.status)}`}>
                        {metric.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                      {metric.unit}
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full ${metric.status === 'good' ? 'bg-green-500' : metric.status === 'needs-improvement' ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((metric.target / metric.value) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cache Stats */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="flex items-center gap-4">
                <HardDrive className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Cache Size:
                    {' '}
                    {formatBytes(report.cacheSize)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {report.cacheEntries.length}
                    {' '}
                    cached resources
                  </div>
                </div>
              </div>
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cache
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No analysis yet</h4>
            <p className="text-gray-500 dark:text-gray-400">
              Run an analysis to see performance metrics
            </p>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Optimizer</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Analyze and optimize your app&apos;s performance</p>
            </div>
          </div>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {isAnalyzing
              ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                )
              : (
                  <>
                    <Activity className="h-4 w-4" />
                    Run Analysis
                  </>
                )}
          </button>
        </div>
      </div>

      {report ? (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {(['metrics', 'cache', 'config'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-amber-600 text-amber-600'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'metrics' && (
                  <>
                    <Gauge className="mr-2 inline h-4 w-4" />
                    Metrics
                  </>
                )}
                {tab === 'cache' && (
                  <>
                    <HardDrive className="mr-2 inline h-4 w-4" />
                    Cache
                  </>
                )}
                {tab === 'config' && (
                  <>
                    <Settings className="mr-2 inline h-4 w-4" />
                    Config
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                {/* Score overview */}
                <div className="flex items-center gap-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <div className={`flex h-24 w-24 items-center justify-center rounded-full ${
                    overallScore >= 80
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : overallScore >= 50
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                  >
                    <span className={`text-3xl font-bold ${
                      overallScore >= 80
                        ? 'text-green-500'
                        : overallScore >= 50
                          ? 'text-amber-500'
                          : 'text-red-500'
                    }`}
                    >
                      {overallScore}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
                      Performance Score
                    </h3>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      Based on
                      {' '}
                      {report.metrics.length}
                      {' '}
                      metrics analyzed
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        {report.metrics.filter(m => m.status === 'good').length}
                        {' '}
                        good
                      </span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <AlertTriangle className="h-4 w-4" />
                        {report.metrics.filter(m => m.status === 'needs-improvement').length}
                        {' '}
                        needs work
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        {report.metrics.filter(m => m.status === 'poor').length}
                        {' '}
                        poor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics list */}
                <div className="space-y-3">
                  {report.metrics.map((metric) => {
                    const StatusIcon = getStatusIcon(metric.status);
                    const progress = Math.min((metric.target / metric.value) * 100, 100);
                    const isImproved = metric.value <= metric.target;

                    return (
                      <div
                        key={metric.name}
                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded p-1.5 ${getStatusColor(metric.status)}`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {metric.name}
                              </span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {metric.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {metric.value}
                                {metric.unit}
                              </span>
                              {isImproved
                                ? (
                                    <TrendingDown className="h-4 w-4 text-green-500" />
                                  )
                                : (
                                    <TrendingUp className="h-4 w-4 text-red-500" />
                                  )}
                            </div>
                            <span className="text-xs text-gray-500">
                              Target:
                              {' '}
                              {metric.target}
                              {metric.unit}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className={`h-full transition-all ${
                              metric.status === 'good'
                                ? 'bg-green-500'
                                : metric.status === 'needs-improvement'
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Suggestions */}
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setExpandedSuggestions(!expandedSuggestions)}
                    className="flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      Optimization Suggestions (
                      {report.suggestions.length}
                      )
                    </span>
                    {expandedSuggestions
                      ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )
                      : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                  </button>
                  {expandedSuggestions && (
                    <div className="space-y-2 px-4 pb-4">
                      {report.suggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20"
                        >
                          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cache Tab */}
            {activeTab === 'cache' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <HardDrive className="h-10 w-10 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatBytes(report.cacheSize)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.cacheEntries.length}
                        {' '}
                        cached resources
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </button>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hits</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strategy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {report.cacheEntries.map((entry, i) => {
                        const TypeIcon = getResourceIcon(entry.type);
                        return (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3">
                              <code className="text-sm text-gray-700 dark:text-gray-300">
                                {entry.key}
                              </code>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600 capitalize dark:text-gray-400">
                                  {entry.type}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {formatBytes(entry.size)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {entry.hits}
                            </td>
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                {entry.strategy}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 font-medium text-gray-900 dark:text-white">Lazy Loading</h3>
                  <div className="space-y-4">
                    {(['images', 'videos', 'iframes'] as const).map(type => (
                      <label key={type} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <Image className="h-5 w-5 text-gray-400" />
                          <span className="font-medium text-gray-700 capitalize dark:text-gray-300">
                            Lazy load
                            {' '}
                            {type}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={report.lazyLoadConfig[type]}
                          onChange={e => updateLazyLoadConfig({ [type]: e.target.checked })}
                          className="h-5 w-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-900 dark:text-white">
                    Intersection Threshold
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={report.lazyLoadConfig.threshold}
                      onChange={e => updateLazyLoadConfig({ threshold: Number.parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-mono text-sm text-gray-600 dark:text-gray-400">
                      {report.lazyLoadConfig.threshold}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How much of the element should be visible before loading (0 = start loading immediately)
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-gray-900 dark:text-white">
                    Placeholder Style
                  </label>
                  <div className="flex gap-2">
                    {(['blur', 'skeleton', 'none'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => updateLazyLoadConfig({ placeholder: style })}
                        className={`flex-1 rounded-lg border px-4 py-2 capitalize transition-colors ${
                          report.lazyLoadConfig.placeholder === style
                            ? 'border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-900/20'
                            : 'border-gray-200 text-gray-600 hover:border-amber-300 dark:border-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-12 text-center">
          <Activity className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Analyze Performance
          </h3>
          <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
            Run an analysis to identify performance bottlenecks and get optimization suggestions.
          </p>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="mx-auto flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {isAnalyzing
              ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                )
              : (
                  <>
                    <Activity className="h-5 w-5" />
                    Run Performance Analysis
                  </>
                )}
          </button>
        </div>
      )}
    </div>
  );
}
