'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Contrast,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Focus,
  Image,
  Info,
  Keyboard,
  RefreshCw,
  Type,
  Volume2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type IssueSeverity = 'error' | 'warning' | 'info' | 'pass';
export type IssueCategory = 'color' | 'typography' | 'navigation' | 'images' | 'forms' | 'structure' | 'multimedia' | 'general';

export type AccessibilityIssue = {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  category: IssueCategory;
  wcagCriteria: string;
  wcagLevel: WCAGLevel;
  element?: string;
  suggestion: string;
  learnMoreUrl?: string;
};

export type AccessibilityScore = {
  overall: number;
  color: number;
  typography: number;
  navigation: number;
  images: number;
  forms: number;
  structure: number;
};

export type AccessibilityReport = {
  timestamp: Date;
  score: AccessibilityScore;
  issues: AccessibilityIssue[];
  passedChecks: number;
  totalChecks: number;
};

export type AccessibilityCheckerProps = {
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  targetLevel?: WCAGLevel;
  onRunCheck?: () => void;
  onExportReport?: (report: AccessibilityReport) => void;
  onFixIssue?: (issue: AccessibilityIssue) => void;
};

// Mock data generator
const generateMockReport = (): AccessibilityReport => {
  const issues: AccessibilityIssue[] = [
    {
      id: '1',
      title: 'Low color contrast ratio',
      description: 'The text color does not have sufficient contrast with the background. Current ratio: 3.2:1, Required: 4.5:1',
      severity: 'error',
      category: 'color',
      wcagCriteria: '1.4.3',
      wcagLevel: 'AA',
      element: '.text-gray-400 on white background',
      suggestion: 'Increase the contrast by using a darker text color (e.g., #6B7280) or adjusting the background.',
      learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    },
    {
      id: '2',
      title: 'Missing alt text on image',
      description: 'Image does not have an alt attribute, making it inaccessible to screen reader users.',
      severity: 'error',
      category: 'images',
      wcagCriteria: '1.1.1',
      wcagLevel: 'A',
      element: '<img src="hero-image.jpg">',
      suggestion: 'Add a descriptive alt attribute that conveys the meaning or purpose of the image.',
    },
    {
      id: '3',
      title: 'Form input missing label',
      description: 'Input field does not have an associated label, making it difficult for screen reader users to understand its purpose.',
      severity: 'error',
      category: 'forms',
      wcagCriteria: '1.3.1',
      wcagLevel: 'A',
      element: '<input type="email" placeholder="Enter email">',
      suggestion: 'Add a <label> element with a for attribute matching the input\'s id, or use aria-label.',
    },
    {
      id: '4',
      title: 'Link text is not descriptive',
      description: 'Link text "Click here" does not describe the link destination or purpose.',
      severity: 'warning',
      category: 'navigation',
      wcagCriteria: '2.4.4',
      wcagLevel: 'A',
      element: '<a href="/pricing">Click here</a>',
      suggestion: 'Use descriptive link text like "View our pricing plans" that makes sense out of context.',
    },
    {
      id: '5',
      title: 'Focus indicator not visible',
      description: 'Interactive element does not have a visible focus indicator when navigating with keyboard.',
      severity: 'error',
      category: 'navigation',
      wcagCriteria: '2.4.7',
      wcagLevel: 'AA',
      element: '.btn-primary:focus',
      suggestion: 'Add a visible focus style using outline or box-shadow that is visible on all backgrounds.',
    },
    {
      id: '6',
      title: 'Heading levels skipped',
      description: 'Page jumps from H2 to H4, skipping H3. This can confuse screen reader users.',
      severity: 'warning',
      category: 'structure',
      wcagCriteria: '1.3.1',
      wcagLevel: 'A',
      element: '<h2>...</h2> followed by <h4>...</h4>',
      suggestion: 'Use heading levels sequentially without skipping levels.',
    },
    {
      id: '7',
      title: 'Touch target too small',
      description: 'Interactive element has a touch target smaller than 44x44 pixels.',
      severity: 'warning',
      category: 'navigation',
      wcagCriteria: '2.5.5',
      wcagLevel: 'AAA',
      element: '.icon-button (24x24px)',
      suggestion: 'Increase the touch target size to at least 44x44 pixels for better mobile accessibility.',
    },
    {
      id: '8',
      title: 'Text size uses fixed units',
      description: 'Font size uses px units which don\'t scale with user preferences.',
      severity: 'info',
      category: 'typography',
      wcagCriteria: '1.4.4',
      wcagLevel: 'AA',
      element: 'body { font-size: 14px }',
      suggestion: 'Use relative units like rem or em to allow text to scale with user preferences.',
    },
  ];

  return {
    timestamp: new Date(),
    score: {
      overall: 72,
      color: 60,
      typography: 85,
      navigation: 65,
      images: 50,
      forms: 70,
      structure: 90,
    },
    issues,
    passedChecks: 42,
    totalChecks: 50,
  };
};

// Helper functions
const getSeverityIcon = (severity: IssueSeverity) => {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    pass: CheckCircle,
  };
  return icons[severity];
};

const getSeverityColor = (severity: IssueSeverity): string => {
  const colors: Record<IssueSeverity, string> = {
    error: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    warning: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    info: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    pass: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  };
  return colors[severity];
};

const getCategoryIcon = (category: IssueCategory) => {
  const icons: Record<IssueCategory, typeof Eye> = {
    color: Contrast,
    typography: Type,
    navigation: Keyboard,
    images: Image,
    forms: FileText,
    structure: FileText,
    multimedia: Volume2,
    general: Eye,
  };
  return icons[category];
};

const getScoreColor = (score: number): string => {
  if (score >= 90) {
    return 'text-green-500';
  }
  if (score >= 70) {
    return 'text-amber-500';
  }
  return 'text-red-500';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 90) {
    return 'bg-green-100 dark:bg-green-900/30';
  }
  if (score >= 70) {
    return 'bg-amber-100 dark:bg-amber-900/30';
  }
  return 'bg-red-100 dark:bg-red-900/30';
};

// Main Component
export default function AccessibilityChecker({
  variant = 'full',
  targetLevel = 'AA',
  onRunCheck,
  onExportReport,
  onFixIssue,
}: AccessibilityCheckerProps) {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<IssueSeverity | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<IssueCategory | 'all'>('all');

  const runCheck = async () => {
    setIsChecking(true);
    onRunCheck?.();

    // Simulate check
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newReport = generateMockReport();
    setReport(newReport);
    setIsChecking(false);
  };

  const toggleIssue = (issueId: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  };

  const filteredIssues = report?.issues.filter((issue) => {
    if (filterSeverity !== 'all' && issue.severity !== filterSeverity) {
      return false;
    }
    if (filterCategory !== 'all' && issue.category !== filterCategory) {
      return false;
    }
    return true;
  }) || [];

  const issuesByCategory = filteredIssues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<IssueCategory, number>);

  void targetLevel;

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Accessibility</span>
          {report && (
            <span className={`text-lg font-bold ${getScoreColor(report.score.overall)}`}>
              {report.score.overall}
              %
            </span>
          )}
        </div>
        {report
          ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {report.issues.filter(i => i.severity === 'error').length}
                    {' '}
                    errors
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {report.issues.filter(i => i.severity === 'warning').length}
                    {' '}
                    warnings
                  </span>
                </div>
              </div>
            )
          : (
              <button
                onClick={runCheck}
                disabled={isChecking}
                className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isChecking ? 'Checking...' : 'Run Check'}
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
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Accessibility Check</span>
            </div>
            <button
              onClick={runCheck}
              disabled={isChecking}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isChecking
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  )
                : (
                    <>
                      <Zap className="h-4 w-4" />
                      Run Check
                    </>
                  )}
            </button>
          </div>
        </div>
        {report && (
          <div className="p-4">
            <div className="mb-4 flex items-center justify-center">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full ${getScoreBgColor(report.score.overall)}`}>
                <span className={`text-2xl font-bold ${getScoreColor(report.score.overall)}`}>
                  {report.score.overall}
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <span className="block text-lg font-semibold text-red-500">
                  {report.issues.filter(i => i.severity === 'error').length}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Errors</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-semibold text-amber-500">
                  {report.issues.filter(i => i.severity === 'warning').length}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Warnings</span>
              </div>
              <div className="text-center">
                <span className="block text-lg font-semibold text-green-500">
                  {report.passedChecks}
                </span>
                <span className="text-gray-500 dark:text-gray-400">Passed</span>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility Overview</h3>
          <button
            onClick={runCheck}
            disabled={isChecking}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isChecking
              ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Checking...
                  </>
                )
              : (
                  <>
                    <Zap className="h-4 w-4" />
                    Run Check
                  </>
                )}
          </button>
        </div>

        {report ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="col-span-1">
              <div className={`flex aspect-square items-center justify-center rounded-2xl ${getScoreBgColor(report.score.overall)}`}>
                <div className="text-center">
                  <span className={`text-5xl font-bold ${getScoreColor(report.score.overall)}`}>
                    {report.score.overall}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">Overall Score</span>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="col-span-2 grid grid-cols-3 gap-4">
              {Object.entries(report.score)
                .filter(([key]) => key !== 'overall')
                .map(([category, score]) => (
                  <div key={category} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="mb-2 flex items-center gap-2">
                      {(() => {
                        const Icon = getCategoryIcon(category as IssueCategory);
                        return <Icon className="h-4 w-4 text-gray-500" />;
                      })()}
                      <span className="text-sm font-medium text-gray-700 capitalize dark:text-gray-300">
                        {category}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
                      <span className="text-sm text-gray-400">%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {/* Issues Summary */}
            <div className="col-span-3 mt-4">
              <h4 className="mb-3 font-medium text-gray-900 dark:text-white">Issues by Category</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(issuesByCategory).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800"
                  >
                    {(() => {
                      const Icon = getCategoryIcon(category as IssueCategory);
                      return <Icon className="h-4 w-4 text-gray-500" />;
                    })()}
                    <span className="text-sm text-gray-700 capitalize dark:text-gray-300">{category}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Eye className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No report yet</h4>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              Run an accessibility check to see your score and issues
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
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility Checker</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">WCAG 2.1 compliance analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {report && (
              <button
                onClick={() => onExportReport?.(report)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>
            )}
            <button
              onClick={runCheck}
              disabled={isChecking}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isChecking
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  )
                : (
                    <>
                      <Zap className="h-4 w-4" />
                      Run Check
                    </>
                  )}
            </button>
          </div>
        </div>
      </div>

      {report ? (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4 dark:border-gray-700">
            {/* Score */}
            <div className={`rounded-xl p-4 ${getScoreBgColor(report.score.overall)} mb-4`}>
              <div className="text-center">
                <span className={`text-4xl font-bold ${getScoreColor(report.score.overall)}`}>
                  {report.score.overall}
                </span>
                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                  Accessibility Score
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-2 py-1.5 dark:bg-red-900/20">
                <span className="text-sm text-gray-600 dark:text-gray-400">Errors</span>
                <span className="font-semibold text-red-500">
                  {report.issues.filter(i => i.severity === 'error').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-2 py-1.5 dark:bg-amber-900/20">
                <span className="text-sm text-gray-600 dark:text-gray-400">Warnings</span>
                <span className="font-semibold text-amber-500">
                  {report.issues.filter(i => i.severity === 'warning').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-50 px-2 py-1.5 dark:bg-green-900/20">
                <span className="text-sm text-gray-600 dark:text-gray-400">Passed</span>
                <span className="font-semibold text-green-500">{report.passedChecks}</span>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Severity
                </label>
                <select
                  value={filterSeverity}
                  onChange={e => setFilterSeverity(e.target.value as IssueSeverity | 'all')}
                  className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                >
                  <option value="all">All severities</option>
                  <option value="error">Errors only</option>
                  <option value="warning">Warnings only</option>
                  <option value="info">Info only</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value as IssueCategory | 'all')}
                  className="w-full rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                >
                  <option value="all">All categories</option>
                  <option value="color">Color & Contrast</option>
                  <option value="typography">Typography</option>
                  <option value="navigation">Navigation</option>
                  <option value="images">Images</option>
                  <option value="forms">Forms</option>
                  <option value="structure">Structure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="max-h-[600px] flex-1 overflow-auto p-4">
            <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
              Issues (
              {filteredIssues.length}
              )
            </h3>
            <div className="space-y-3">
              {filteredIssues.map((issue) => {
                const SeverityIcon = getSeverityIcon(issue.severity);
                const CategoryIcon = getCategoryIcon(issue.category);
                const isExpanded = expandedIssues.has(issue.id);

                return (
                  <div
                    key={issue.id}
                    className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleIssue(issue.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className={`rounded p-1.5 ${getSeverityColor(issue.severity)}`}>
                        <SeverityIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-gray-900 dark:text-white">
                            {issue.title}
                          </span>
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                            WCAG
                            {' '}
                            {issue.wcagCriteria}
                            {' '}
                            (
                            {issue.wcagLevel}
                            )
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <CategoryIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 capitalize">{issue.category}</span>
                        </div>
                      </div>
                      {isExpanded
                        ? (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )
                        : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-200 px-4 pt-3 pb-4 dark:border-gray-700">
                        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                          {issue.description}
                        </p>

                        {issue.element && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              Affected Element:
                            </span>
                            <code className="mt-1 block rounded bg-gray-100 px-3 py-2 font-mono text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {issue.element}
                            </code>
                          </div>
                        )}

                        <div className="mb-3">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Suggestion:
                          </span>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {issue.suggestion}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onFixIssue?.(issue)}
                            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            <Focus className="h-4 w-4" />
                            Fix Issue
                          </button>
                          {issue.learnMoreUrl && (
                            <a
                              href={issue.learnMoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                              Learn More
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredIssues.length === 0 && (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                  <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                    No issues found
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {filterSeverity !== 'all' || filterCategory !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Great job! Your content passes all checks.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Eye className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Check Accessibility
          </h3>
          <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
            Run an accessibility check to identify issues and get suggestions for improving your content&apos;s accessibility.
          </p>
          <button
            onClick={runCheck}
            disabled={isChecking}
            className="mx-auto flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isChecking
              ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Running Check...
                  </>
                )
              : (
                  <>
                    <Zap className="h-5 w-5" />
                    Run Accessibility Check
                  </>
                )}
          </button>
        </div>
      )}
    </div>
  );
}
