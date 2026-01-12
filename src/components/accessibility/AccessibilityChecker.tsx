'use client';

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Info,
  Keyboard,
  MousePointer,
  Palette,
  RefreshCw,
  Type,
  Volume2,
  Wand2,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type AccessibilityLevel = 'A' | 'AA' | 'AAA';
export type IssueCategory = 'color' | 'text' | 'interaction' | 'structure' | 'media' | 'navigation';
export type IssueSeverity = 'error' | 'warning' | 'suggestion';

export type AccessibilityIssue = {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  wcagCriteria?: string;
  wcagLevel?: AccessibilityLevel;
  elementId?: string;
  suggestion?: string;
  autoFixable?: boolean;
};

export type ColorContrastResult = {
  foreground: string;
  background: string;
  ratio: number;
  normalTextPass: boolean;
  largeTextPass: boolean;
  level: AccessibilityLevel;
};

export type AccessibilityScore = {
  overall: number;
  color: number;
  text: number;
  interaction: number;
  structure: number;
  media: number;
  navigation: number;
};

export type AccessibilityCheckerProps = {
  issues: AccessibilityIssue[];
  score?: AccessibilityScore;
  colorContrasts?: ColorContrastResult[];
  targetLevel?: AccessibilityLevel;
  onRunCheck?: () => void;
  onFixIssue?: (issueId: string) => void;
  onFixAll?: () => void;
  onIgnoreIssue?: (issueId: string) => void;
  onViewElement?: (elementId: string) => void;
  variant?: 'full' | 'compact' | 'panel' | 'report' | 'minimal';
  showScore?: boolean;
  showColorContrast?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function AccessibilityChecker({
  issues,
  score,
  colorContrasts = [],
  targetLevel = 'AA',
  onRunCheck,
  onFixIssue,
  onFixAll,
  onIgnoreIssue,
  onViewElement,
  variant = 'full',
  showScore = true,
  showColorContrast = true,
  darkMode = false,
  className = '',
}: AccessibilityCheckerProps) {
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'issues' | 'contrast' | 'report'>('issues');

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const categoryIcons: Record<IssueCategory, React.ReactNode> = {
    color: <Palette size={16} />,
    text: <Type size={16} />,
    interaction: <MousePointer size={16} />,
    structure: <Eye size={16} />,
    media: <Volume2 size={16} />,
    navigation: <Keyboard size={16} />,
  };

  const categoryLabels: Record<IssueCategory, string> = {
    color: 'Color & Contrast',
    text: 'Text & Typography',
    interaction: 'Interactive Elements',
    structure: 'Page Structure',
    media: 'Media Content',
    navigation: 'Navigation',
  };

  const getSeverityConfig = (severity: IssueSeverity) => {
    switch (severity) {
      case 'error':
        return {
          icon: <XCircle size={16} />,
          color: 'text-red-500',
          bg: darkMode ? 'bg-red-900/20' : 'bg-red-50',
          border: 'border-red-200 dark:border-red-800',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={16} />,
          color: 'text-amber-500',
          bg: darkMode ? 'bg-amber-900/20' : 'bg-amber-50',
          border: 'border-amber-200 dark:border-amber-800',
        };
      case 'suggestion':
        return {
          icon: <Info size={16} />,
          color: 'text-blue-500',
          bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
          border: 'border-blue-200 dark:border-blue-800',
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return 'text-green-500';
    }
    if (score >= 70) {
      return 'text-amber-500';
    }
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) {
      return 'from-green-500 to-emerald-500';
    }
    if (score >= 70) {
      return 'from-amber-500 to-orange-500';
    }
    return 'from-red-500 to-rose-500';
  };

  const filteredIssues = issues.filter(issue =>
    selectedCategory === 'all' || issue.category === selectedCategory,
  );

  const issueCounts = {
    error: issues.filter(i => i.severity === 'error').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    suggestion: issues.filter(i => i.severity === 'suggestion').length,
  };

  const autoFixableCount = issues.filter(i => i.autoFixable).length;

  const toggleIssue = useCallback((issueId: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }
      return next;
    });
  }, []);

  const renderScoreCircle = (value: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: { outer: 48, inner: 40, stroke: 4, text: 'text-sm' },
      md: { outer: 80, inner: 68, stroke: 6, text: 'text-xl' },
      lg: { outer: 120, inner: 104, stroke: 8, text: 'text-3xl' },
    };
    const s = sizes[size];
    const circumference = 2 * Math.PI * (s.inner / 2);
    const progress = (value / 100) * circumference;

    return (
      <div className="relative" style={{ width: s.outer, height: s.outer }}>
        <svg className="-rotate-90 transform" width={s.outer} height={s.outer}>
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={s.inner / 2}
            stroke={darkMode ? '#374151' : '#E5E7EB'}
            strokeWidth={s.stroke}
            fill="none"
          />
          <circle
            cx={s.outer / 2}
            cy={s.outer / 2}
            r={s.inner / 2}
            stroke="currentColor"
            className={getScoreColor(value)}
            strokeWidth={s.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center ${s.text} font-bold ${textColor}`}>
          {value}
        </div>
      </div>
    );
  };

  const renderIssueItem = (issue: AccessibilityIssue, compact = false) => {
    const config = getSeverityConfig(issue.severity);
    const isExpanded = expandedIssues.has(issue.id);

    return (
      <div
        key={issue.id}
        className={`${config.bg} border ${config.border} rounded-lg ${compact ? 'p-2' : 'p-3'}`}
      >
        <div
          className={`flex items-start gap-3 ${compact ? '' : 'cursor-pointer'}`}
          onClick={() => !compact && toggleIssue(issue.id)}
        >
          <div className={config.color}>{config.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-medium ${textColor} ${compact ? 'text-sm' : ''}`}>{issue.title}</h4>
              {issue.wcagCriteria && (
                <span className={`px-1.5 py-0.5 text-xs ${inputBg} ${mutedColor} rounded font-mono`}>
                  {issue.wcagCriteria}
                </span>
              )}
              {issue.wcagLevel && (
                <span className={`px-1.5 py-0.5 text-xs ${inputBg} ${mutedColor} rounded`}>
                  Level
                  {' '}
                  {issue.wcagLevel}
                </span>
              )}
            </div>
            {!compact && (
              <p className={`text-sm ${mutedColor} mt-1`}>{issue.description}</p>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-2">
              {issue.autoFixable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); onFixIssue?.(issue.id);
                  }}
                  className="rounded-lg bg-blue-500 p-1.5 text-white hover:bg-blue-600"
                  title="Auto-fix"
                >
                  <Wand2 size={14} />
                </button>
              )}
              {isExpanded
                ? (
                    <ChevronDown size={16} className={mutedColor} />
                  )
                : (
                    <ChevronRight size={16} className={mutedColor} />
                  )}
            </div>
          )}
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className={`mt-3 border-t pt-3 ${borderColor} space-y-3`}>
            {issue.suggestion && (
              <div>
                <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>
                  Suggestion
                </span>
                <p className={`text-sm ${textColor} mt-1`}>{issue.suggestion}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {issue.elementId && (
                <button
                  onClick={() => onViewElement?.(issue.elementId!)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
                >
                  <Eye size={14} />
                  View Element
                </button>
              )}
              <button
                onClick={() => onIgnoreIssue?.(issue.id)}
                className={`px-3 py-1.5 text-sm ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                Ignore
              </button>
              {issue.wcagCriteria && (
                <a
                  href={`https://www.w3.org/WAI/WCAG21/Understanding/${issue.wcagCriteria.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm text-blue-500 ${hoverBg} rounded-lg`}
                >
                  Learn More
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderColorContrastItem = (contrast: ColorContrastResult) => (
    <div className={`rounded-lg border p-4 ${borderColor} ${hoverBg}`}>
      <div className="mb-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded border"
            style={{ backgroundColor: contrast.foreground }}
            title={contrast.foreground}
          />
          <span className={mutedColor}>/</span>
          <div
            className="h-8 w-8 rounded border"
            style={{ backgroundColor: contrast.background }}
            title={contrast.background}
          />
        </div>
        <div className={`text-2xl font-bold ${contrast.ratio >= 4.5 ? 'text-green-500' : contrast.ratio >= 3 ? 'text-amber-500' : 'text-red-500'}`}>
          {contrast.ratio.toFixed(2)}
          :1
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className={`flex items-center gap-2 rounded p-2 ${contrast.normalTextPass ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          {contrast.normalTextPass
            ? (
                <CheckCircle size={14} className="text-green-500" />
              )
            : (
                <XCircle size={14} className="text-red-500" />
              )}
          <span className={`text-sm ${textColor}`}>Normal Text</span>
        </div>
        <div className={`flex items-center gap-2 rounded p-2 ${contrast.largeTextPass ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          {contrast.largeTextPass
            ? (
                <CheckCircle size={14} className="text-green-500" />
              )
            : (
                <XCircle size={14} className="text-red-500" />
              )}
          <span className={`text-sm ${textColor}`}>Large Text</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className={`flex items-center gap-1 text-xs ${mutedColor} ${hoverBg} rounded px-2 py-1`}>
          <Copy size={12} />
          Copy Colors
        </button>
      </div>
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {score && renderScoreCircle(score.overall, 'sm')}
            <div className="flex items-center gap-2">
              {issueCounts.error > 0 && (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <XCircle size={14} />
                  {issueCounts.error}
                </span>
              )}
              {issueCounts.warning > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-500">
                  <AlertTriangle size={14} />
                  {issueCounts.warning}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onRunCheck}
            className={`p-2 ${mutedColor} ${hoverBg} rounded-lg`}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Accessibility</h3>
          {score && (
            <span className={`text-lg font-bold ${getScoreColor(score.overall)}`}>
              {score.overall}
              %
            </span>
          )}
        </div>

        <div className="mb-4 flex items-center gap-3">
          {issueCounts.error > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <XCircle size={12} />
              {issueCounts.error}
              {' '}
              errors
            </span>
          )}
          {issueCounts.warning > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle size={12} />
              {issueCounts.warning}
              {' '}
              warnings
            </span>
          )}
        </div>

        <div className="space-y-2">
          {filteredIssues.slice(0, 3).map(issue => renderIssueItem(issue, true))}
        </div>

        {issues.length > 3 && (
          <p className={`text-sm ${mutedColor} mt-2 text-center`}>
            +
            {issues.length - 3}
            {' '}
            more issues
          </p>
        )}
      </div>
    );
  }

  // Panel variant
  if (variant === 'panel') {
    return (
      <div className={`${bgColor} flex h-full w-80 flex-col border-l ${borderColor} ${className}`}>
        {/* Header */}
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`font-semibold ${textColor}`}>Accessibility</h3>
            <button
              onClick={onRunCheck}
              className={`p-1.5 ${mutedColor} ${hoverBg} rounded-lg`}
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {showScore && score && (
            <div className="flex items-center gap-4">
              {renderScoreCircle(score.overall, 'sm')}
              <div>
                <span className={`text-sm ${mutedColor}`}>
                  WCAG
                  {targetLevel}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-red-500">{issueCounts.error}</span>
                  <span className="text-xs text-amber-500">{issueCounts.warning}</span>
                  <span className="text-xs text-blue-500">{issueCounts.suggestion}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category filter */}
        <div className={`border-b p-2 ${borderColor} flex gap-1 overflow-x-auto`}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : `${inputBg} ${mutedColor}`
            }`}
          >
            All
          </button>
          {(Object.keys(categoryLabels) as IssueCategory[]).slice(0, 4).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : `${inputBg} ${mutedColor}`
              }`}
            >
              {categoryLabels[cat].split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Issues list */}
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {filteredIssues.map(issue => renderIssueItem(issue))}
          {filteredIssues.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle size={32} className="text-green-500" />
              <p className={`mt-2 ${mutedColor}`}>No issues found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {autoFixableCount > 0 && (
          <div className={`border-t p-3 ${borderColor}`}>
            <button
              onClick={onFixAll}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              <Wand2 size={16} />
              Fix All (
              {autoFixableCount}
              )
            </button>
          </div>
        )}
      </div>
    );
  }

  // Report variant
  if (variant === 'report') {
    return (
      <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
        <div className={`border-b p-6 ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor}`}>Accessibility Report</h2>
          <p className={`${mutedColor} mt-1`}>
            WCAG
            {targetLevel}
            {' '}
            Compliance Check
          </p>
        </div>

        {/* Score overview */}
        {showScore && score && (
          <div className={`border-b p-6 ${borderColor} bg-gradient-to-r ${getScoreGradient(score.overall)} bg-opacity-10`}>
            <div className="flex items-center gap-8">
              {renderScoreCircle(score.overall, 'lg')}
              <div className="grid flex-1 grid-cols-3 gap-4">
                {(Object.entries(score) as [keyof AccessibilityScore, number][])
                  .filter(([key]) => key !== 'overall')
                  .map(([key, value]) => (
                    <div key={key} className="text-center">
                      {renderScoreCircle(value, 'sm')}
                      <p className={`text-xs ${mutedColor} mt-1 capitalize`}>{key}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Issues by category */}
        <div className="p-6">
          {(Object.keys(categoryLabels) as IssueCategory[]).map((category) => {
            const categoryIssues = issues.filter(i => i.category === category);
            if (categoryIssues.length === 0) {
              return null;
            }

            return (
              <div key={category} className="mb-6 last:mb-0">
                <div className="mb-3 flex items-center gap-2">
                  {categoryIcons[category]}
                  <h3 className={`font-semibold ${textColor}`}>{categoryLabels[category]}</h3>
                  <span className={`text-sm ${mutedColor}`}>
                    (
                    {categoryIssues.length}
                    )
                  </span>
                </div>
                <div className="space-y-2">
                  {categoryIssues.map(issue => renderIssueItem(issue))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-6 ${borderColor}`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>Accessibility Checker</h2>
            <p className={`${mutedColor} mt-1`}>
              Target: WCAG
              {' '}
              {targetLevel}
              {' '}
              •
              {' '}
              {issues.length}
              {' '}
              issues found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRunCheck}
              className={`flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
            >
              <RefreshCw size={16} />
              Re-check
            </button>
            {autoFixableCount > 0 && (
              <button
                onClick={onFixAll}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <Wand2 size={16} />
                Fix All (
                {autoFixableCount}
                )
              </button>
            )}
          </div>
        </div>

        {/* Score and summary */}
        {showScore && score && (
          <div className="flex items-center gap-8">
            {renderScoreCircle(score.overall, 'md')}
            <div className="grid flex-1 grid-cols-3 gap-4">
              <div className={`rounded-lg p-3 ${issueCounts.error > 0 ? 'bg-red-50 dark:bg-red-900/20' : `${inputBg}`}`}>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className={issueCounts.error > 0 ? 'text-red-500' : mutedColor} />
                  <span className={`text-lg font-bold ${issueCounts.error > 0 ? 'text-red-500' : mutedColor}`}>
                    {issueCounts.error}
                  </span>
                </div>
                <span className={`text-xs ${mutedColor}`}>Errors</span>
              </div>
              <div className={`rounded-lg p-3 ${issueCounts.warning > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : `${inputBg}`}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className={issueCounts.warning > 0 ? 'text-amber-500' : mutedColor} />
                  <span className={`text-lg font-bold ${issueCounts.warning > 0 ? 'text-amber-500' : mutedColor}`}>
                    {issueCounts.warning}
                  </span>
                </div>
                <span className={`text-xs ${mutedColor}`}>Warnings</span>
              </div>
              <div className={`rounded-lg p-3 ${inputBg}`}>
                <div className="flex items-center gap-2">
                  <Info size={16} className="text-blue-500" />
                  <span className="text-lg font-bold text-blue-500">
                    {issueCounts.suggestion}
                  </span>
                </div>
                <span className={`text-xs ${mutedColor}`}>Suggestions</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${borderColor}`}>
        <button
          onClick={() => setActiveTab('issues')}
          className={`border-b-2 px-6 py-3 text-sm font-medium ${
            activeTab === 'issues'
              ? 'border-blue-500 text-blue-500'
              : `border-transparent ${mutedColor}`
          }`}
        >
          Issues (
          {issues.length}
          )
        </button>
        {showColorContrast && (
          <button
            onClick={() => setActiveTab('contrast')}
            className={`border-b-2 px-6 py-3 text-sm font-medium ${
              activeTab === 'contrast'
                ? 'border-blue-500 text-blue-500'
                : `border-transparent ${mutedColor}`
            }`}
          >
            Color Contrast (
            {colorContrasts.length}
            )
          </button>
        )}
        <button
          onClick={() => setActiveTab('report')}
          className={`border-b-2 px-6 py-3 text-sm font-medium ${
            activeTab === 'report'
              ? 'border-blue-500 text-blue-500'
              : `border-transparent ${mutedColor}`
          }`}
        >
          Full Report
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'issues' && (
          <>
            {/* Category filter */}
            <div className="mb-4 flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${mutedColor}`
                }`}
              >
                All
              </button>
              {(Object.keys(categoryLabels) as IssueCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : `${inputBg} ${mutedColor}`
                  }`}
                >
                  {categoryIcons[cat]}
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>

            {/* Issues list */}
            <div className="space-y-3">
              {filteredIssues.map(issue => renderIssueItem(issue))}
            </div>

            {filteredIssues.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle size={48} className="text-green-500" />
                <h3 className={`mt-4 font-semibold ${textColor}`}>All Clear!</h3>
                <p className={`${mutedColor} mt-1`}>No accessibility issues detected</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'contrast' && (
          <div className="grid grid-cols-2 gap-4">
            {colorContrasts.map((contrast, i) => (
              <div key={i}>{renderColorContrastItem(contrast)}</div>
            ))}
            {colorContrasts.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-12">
                <Palette size={48} className={mutedColor} />
                <p className={`${mutedColor} mt-4`}>No color contrasts to check</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            {(Object.keys(categoryLabels) as IssueCategory[]).map((category) => {
              const categoryIssues = issues.filter(i => i.category === category);

              return (
                <div key={category}>
                  <div className="mb-3 flex items-center gap-2">
                    {categoryIcons[category]}
                    <h3 className={`font-semibold ${textColor}`}>{categoryLabels[category]}</h3>
                    {categoryIssues.length > 0
                      ? (
                          <span className={`text-sm ${mutedColor}`}>
                            (
                            {categoryIssues.length}
                            {' '}
                            issues)
                          </span>
                        )
                      : (
                          <CheckCircle size={14} className="text-green-500" />
                        )}
                  </div>
                  {categoryIssues.length > 0
                    ? (
                        <div className="space-y-2">
                          {categoryIssues.map(issue => renderIssueItem(issue))}
                        </div>
                      )
                    : (
                        <p className={`text-sm ${mutedColor} ml-6`}>No issues in this category</p>
                      )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
