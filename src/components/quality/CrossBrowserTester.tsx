'use client';

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Monitor,
  Play,
  RefreshCw,
  Smartphone,
  Tablet,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type BrowserName = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'warning';
export type TestCategory = 'layout' | 'functionality' | 'performance' | 'accessibility';

export type BrowserVersion = {
  name: BrowserName;
  version: string;
  device: DeviceType;
  os: string;
};

export type TestResult = {
  id: string;
  browser: BrowserVersion;
  category: TestCategory;
  name: string;
  status: TestStatus;
  duration: number;
  message?: string;
  screenshot?: string;
};

export type TestSuite = {
  id: string;
  name: string;
  browsers: BrowserVersion[];
  tests: TestResult[];
  startedAt?: Date;
  completedAt?: Date;
};

export type CrossBrowserTesterProps = {
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onRunTests?: (browsers: BrowserVersion[]) => void;
  onExportReport?: (suite: TestSuite) => void;
};

// Browser configurations
const browsers: BrowserVersion[] = [
  { name: 'chrome', version: '120', device: 'desktop', os: 'Windows 11' },
  { name: 'chrome', version: '120', device: 'desktop', os: 'macOS 14' },
  { name: 'chrome', version: '120', device: 'mobile', os: 'Android 14' },
  { name: 'firefox', version: '121', device: 'desktop', os: 'Windows 11' },
  { name: 'firefox', version: '121', device: 'desktop', os: 'macOS 14' },
  { name: 'safari', version: '17', device: 'desktop', os: 'macOS 14' },
  { name: 'safari', version: '17', device: 'mobile', os: 'iOS 17' },
  { name: 'safari', version: '17', device: 'tablet', os: 'iPadOS 17' },
  { name: 'edge', version: '120', device: 'desktop', os: 'Windows 11' },
  { name: 'opera', version: '105', device: 'desktop', os: 'Windows 11' },
];

// Mock test generator
const generateMockTests = (selectedBrowsers: BrowserVersion[]): TestResult[] => {
  const testNames = [
    { name: 'Page renders correctly', category: 'layout' as TestCategory },
    { name: 'Responsive breakpoints work', category: 'layout' as TestCategory },
    { name: 'CSS Grid/Flexbox layout', category: 'layout' as TestCategory },
    { name: 'Button interactions', category: 'functionality' as TestCategory },
    { name: 'Form submissions', category: 'functionality' as TestCategory },
    { name: 'Modal/Dialog behavior', category: 'functionality' as TestCategory },
    { name: 'First paint time', category: 'performance' as TestCategory },
    { name: 'Time to interactive', category: 'performance' as TestCategory },
    { name: 'Focus management', category: 'accessibility' as TestCategory },
    { name: 'Color contrast', category: 'accessibility' as TestCategory },
  ];

  const results: TestResult[] = [];
  let id = 1;

  selectedBrowsers.forEach((browser) => {
    testNames.forEach((test) => {
      const random = Math.random();
      let status: TestStatus = 'passed';
      let message: string | undefined;

      if (random > 0.9) {
        status = 'failed';
        message = 'Element not found or incorrect behavior detected';
      } else if (random > 0.8) {
        status = 'warning';
        message = 'Minor visual difference detected';
      }

      results.push({
        id: String(id++),
        browser,
        category: test.category,
        name: test.name,
        status,
        duration: Math.floor(Math.random() * 2000) + 500,
        message,
      });
    });
  });

  return results;
};

// Helper functions
const getBrowserIcon = (name: BrowserName): string => {
  const icons: Record<BrowserName, string> = {
    chrome: '🌐',
    firefox: '🦊',
    safari: '🧭',
    edge: '🔷',
    opera: '🔴',
  };
  return icons[name];
};

const getDeviceIcon = (type: DeviceType) => {
  const icons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };
  return icons[type];
};

const getStatusIcon = (status: TestStatus) => {
  const icons = {
    pending: Clock,
    running: RefreshCw,
    passed: CheckCircle,
    failed: XCircle,
    warning: AlertTriangle,
  };
  return icons[status];
};

const getStatusColor = (status: TestStatus): string => {
  const colors: Record<TestStatus, string> = {
    pending: 'text-gray-400',
    running: 'text-blue-500',
    passed: 'text-green-500',
    failed: 'text-red-500',
    warning: 'text-amber-500',
  };
  return colors[status];
};

// Main Component
export default function CrossBrowserTester({
  variant = 'full',
  onRunTests,
  onExportReport,
}: CrossBrowserTesterProps) {
  const [selectedBrowsers, setSelectedBrowsers] = useState<Set<string>>(new Set());
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedBrowsers, setExpandedBrowsers] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<TestCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TestStatus | 'all'>('all');

  const getBrowserKey = (browser: BrowserVersion) =>
    `${browser.name}-${browser.version}-${browser.device}-${browser.os}`;

  const toggleBrowser = (browser: BrowserVersion) => {
    const key = getBrowserKey(browser);
    setSelectedBrowsers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAllBrowsers = () => {
    if (selectedBrowsers.size === browsers.length) {
      setSelectedBrowsers(new Set());
    } else {
      setSelectedBrowsers(new Set(browsers.map(getBrowserKey)));
    }
  };

  const runTests = async () => {
    const selected = browsers.filter(b => selectedBrowsers.has(getBrowserKey(b)));
    if (selected.length === 0) {
      return;
    }

    setIsRunning(true);
    onRunTests?.(selected);

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 3000));

    const tests = generateMockTests(selected);
    const suite: TestSuite = {
      id: Date.now().toString(),
      name: 'Cross-Browser Test Suite',
      browsers: selected,
      tests,
      startedAt: new Date(Date.now() - 3000),
      completedAt: new Date(),
    };

    setTestSuite(suite);
    setIsRunning(false);
  };

  const toggleExpandBrowser = (key: string) => {
    setExpandedBrowsers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const filteredTests = testSuite?.tests.filter((test) => {
    if (filterCategory !== 'all' && test.category !== filterCategory) {
      return false;
    }
    if (filterStatus !== 'all' && test.status !== filterStatus) {
      return false;
    }
    return true;
  }) || [];

  const getTestStats = () => {
    if (!testSuite) {
      return { total: 0, passed: 0, failed: 0, warning: 0 };
    }
    return {
      total: testSuite.tests.length,
      passed: testSuite.tests.filter(t => t.status === 'passed').length,
      failed: testSuite.tests.filter(t => t.status === 'failed').length,
      warning: testSuite.tests.filter(t => t.status === 'warning').length,
    };
  };

  const stats = getTestStats();

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Browser Tests</span>
          </div>
        </div>
        {testSuite
          ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Passed</span>
                  <span className="font-medium text-green-500">
                    {stats.passed}
                    /
                    {stats.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(stats.passed / stats.total) * 100}%` }}
                  />
                </div>
                {stats.failed > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <XCircle className="h-3 w-3" />
                    {stats.failed}
                    {' '}
                    failed
                  </div>
                )}
              </div>
            )
          : (
              <button
                onClick={runTests}
                disabled={isRunning || selectedBrowsers.size === 0}
                className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? 'Running...' : 'Run Tests'}
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
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Cross-Browser Testing</span>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning || selectedBrowsers.size === 0}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Running...
                    </>
                  )
                : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Tests
                    </>
                  )}
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {browsers.slice(0, 6).map((browser) => {
              const key = getBrowserKey(browser);
              const DeviceIcon = getDeviceIcon(browser.device);
              return (
                <button
                  key={key}
                  onClick={() => toggleBrowser(browser)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                    selectedBrowsers.has(key)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
                  }`}
                >
                  <span>{getBrowserIcon(browser.name)}</span>
                  <DeviceIcon className="h-4 w-4 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Browser Compatibility</h3>
          <button
            onClick={runTests}
            disabled={isRunning || selectedBrowsers.size === 0}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning
              ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                )
              : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Tests
                  </>
                )}
          </button>
        </div>

        {testSuite
          ? (
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
                  <Layers className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total Tests</div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                  <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
                  <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                  <div className="text-sm text-gray-500">Passed</div>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                  <XCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                  <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                  <div className="text-sm text-gray-500">Failed</div>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-900/20">
                  <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-500" />
                  <div className="text-2xl font-bold text-amber-600">{stats.warning}</div>
                  <div className="text-sm text-gray-500">Warnings</div>
                </div>
              </div>
            )
          : (
              <div className="py-8 text-center">
                <Globe className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Select browsers and run tests to see results</p>
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
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cross-Browser Tester</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Test compatibility across browsers and devices</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {testSuite && (
              <button
                onClick={() => onExportReport?.(testSuite)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
            )}
            <button
              onClick={runTests}
              disabled={isRunning || selectedBrowsers.size === 0}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Running Tests...
                    </>
                  )
                : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Tests (
                      {selectedBrowsers.size}
                      )
                    </>
                  )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Browser selector sidebar */}
        <div className="w-72 border-r border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Browsers</h3>
            <button
              onClick={toggleAllBrowsers}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {selectedBrowsers.size === browsers.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="space-y-2">
            {browsers.map((browser) => {
              const key = getBrowserKey(browser);
              const DeviceIcon = getDeviceIcon(browser.device);
              const isSelected = selectedBrowsers.has(key);

              return (
                <button
                  key={key}
                  onClick={() => toggleBrowser(browser)}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
                  }`}
                >
                  <span className="text-xl">{getBrowserIcon(browser.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 capitalize dark:text-white">
                        {browser.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        v
                        {browser.version}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <DeviceIcon className="h-3 w-3" />
                      {browser.os}
                    </div>
                  </div>
                  <div className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  >
                    {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results area */}
        <div className="flex-1 p-6">
          {testSuite ? (
            <>
              {/* Stats */}
              <div className="mb-6 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                  <div className="text-sm text-gray-500">Total Tests</div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
                  <div className="text-sm text-gray-500">Passed</div>
                </div>
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                  <div className="text-sm text-gray-500">Failed</div>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                  <div className="text-2xl font-bold text-amber-600">{stats.warning}</div>
                  <div className="text-sm text-gray-500">Warnings</div>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-4 flex items-center gap-4">
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value as TestCategory | 'all')}
                  className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                >
                  <option value="all">All Categories</option>
                  <option value="layout">Layout</option>
                  <option value="functionality">Functionality</option>
                  <option value="performance">Performance</option>
                  <option value="accessibility">Accessibility</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as TestStatus | 'all')}
                  className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              {/* Results by browser */}
              <div className="max-h-[500px] space-y-3 overflow-auto">
                {testSuite.browsers.map((browser) => {
                  const key = getBrowserKey(browser);
                  const browserTests = filteredTests.filter(
                    t => getBrowserKey(t.browser) === key,
                  );
                  const isExpanded = expandedBrowsers.has(key);
                  const DeviceIcon = getDeviceIcon(browser.device);
                  const passedCount = browserTests.filter(t => t.status === 'passed').length;
                  const failedCount = browserTests.filter(t => t.status === 'failed').length;

                  return (
                    <div key={key} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => toggleExpandBrowser(key)}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span className="text-xl">{getBrowserIcon(browser.name)}</span>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 capitalize dark:text-white">
                              {browser.name}
                              {' '}
                              {browser.version}
                            </span>
                            <DeviceIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{browser.os}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-green-500">
                            {passedCount}
                            {' '}
                            passed
                          </span>
                          {failedCount > 0 && (
                            <span className="text-sm text-red-500">
                              {failedCount}
                              {' '}
                              failed
                            </span>
                          )}
                          {isExpanded
                            ? (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )
                            : (
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          {browserTests.map((test) => {
                            const StatusIcon = getStatusIcon(test.status);
                            return (
                              <div
                                key={test.id}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <StatusIcon className={`h-4 w-4 ${getStatusColor(test.status)}`} />
                                <div className="flex-1">
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {test.name}
                                  </span>
                                  {test.message && (
                                    <p className="text-xs text-gray-500">{test.message}</p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {test.duration}
                                  ms
                                </span>
                                {test.screenshot && (
                                  <button className="p-1 text-gray-400 hover:text-gray-600">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <Globe className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Ready to Test
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
                Select the browsers you want to test and click &quot;Run Tests&quot; to check compatibility.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://browserstack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  Learn about browser testing
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
