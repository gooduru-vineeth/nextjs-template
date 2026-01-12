'use client';

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Layers,
  Layout,
  Palette,
  RefreshCw,
  Settings,
  Type,
  Wand2,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type ViolationSeverity = 'error' | 'warning' | 'info' | 'suggestion';
export type ViolationCategory = 'color' | 'typography' | 'spacing' | 'layout' | 'component' | 'accessibility';

export type StyleViolation = {
  id: string;
  severity: ViolationSeverity;
  category: ViolationCategory;
  title: string;
  description: string;
  location?: string;
  suggestion?: string;
  autoFixable?: boolean;
};

export type StyleGuideRule = {
  id: string;
  name: string;
  description: string;
  category: ViolationCategory;
  enabled: boolean;
  severity: ViolationSeverity;
};

export type StyleGuideEnforcementProps = {
  violations: StyleViolation[];
  rules?: StyleGuideRule[];
  onFixViolation?: (violationId: string) => void;
  onFixAll?: () => void;
  onIgnoreViolation?: (violationId: string) => void;
  onToggleRule?: (ruleId: string) => void;
  onRefresh?: () => void;
  variant?: 'full' | 'compact' | 'inline' | 'panel' | 'minimal';
  showAutoFix?: boolean;
  showRules?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function StyleGuideEnforcement({
  violations,
  rules = [],
  onFixViolation,
  onFixAll,
  onIgnoreViolation,
  onToggleRule,
  onRefresh,
  variant = 'full',
  showAutoFix = true,
  showRules = true,
  darkMode = false,
  className = '',
}: StyleGuideEnforcementProps) {
  const [selectedCategory, setSelectedCategory] = useState<ViolationCategory | 'all'>('all');
  const [expandedViolations, setExpandedViolations] = useState<Set<string>>(new Set());
  const [showIgnored, setShowIgnored] = useState(false);
  const [ignoredViolations, setIgnoredViolations] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'violations' | 'rules'>('violations');

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const getSeverityConfig = (severity: ViolationSeverity) => {
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
      case 'info':
        return {
          icon: <Info size={16} />,
          color: 'text-blue-500',
          bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
          border: 'border-blue-200 dark:border-blue-800',
        };
      case 'suggestion':
        return {
          icon: <CheckCircle size={16} />,
          color: 'text-green-500',
          bg: darkMode ? 'bg-green-900/20' : 'bg-green-50',
          border: 'border-green-200 dark:border-green-800',
        };
    }
  };

  const getCategoryIcon = (category: ViolationCategory) => {
    switch (category) {
      case 'color':
        return <Palette size={16} />;
      case 'typography':
        return <Type size={16} />;
      case 'spacing':
        return <Layout size={16} />;
      case 'layout':
        return <Layers size={16} />;
      case 'component':
        return <Layers size={16} />;
      case 'accessibility':
        return <Eye size={16} />;
    }
  };

  const filteredViolations = violations.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesIgnored = showIgnored || !ignoredViolations.has(v.id);
    return matchesCategory && matchesIgnored;
  });

  const violationCounts = {
    error: violations.filter(v => v.severity === 'error').length,
    warning: violations.filter(v => v.severity === 'warning').length,
    info: violations.filter(v => v.severity === 'info').length,
    suggestion: violations.filter(v => v.severity === 'suggestion').length,
  };

  const autoFixableCount = violations.filter(v => v.autoFixable && !ignoredViolations.has(v.id)).length;

  const toggleViolation = useCallback((violationId: string) => {
    setExpandedViolations((prev) => {
      const next = new Set(prev);
      if (next.has(violationId)) {
        next.delete(violationId);
      } else {
        next.add(violationId);
      }
      return next;
    });
  }, []);

  const handleIgnore = useCallback((violationId: string) => {
    setIgnoredViolations((prev) => {
      const next = new Set(prev);
      next.add(violationId);
      return next;
    });
    onIgnoreViolation?.(violationId);
  }, [onIgnoreViolation]);

  const renderViolationItem = (violation: StyleViolation, compact = false) => {
    const config = getSeverityConfig(violation.severity);
    const isExpanded = expandedViolations.has(violation.id);
    const isIgnored = ignoredViolations.has(violation.id);

    return (
      <div
        key={violation.id}
        className={`${config.bg} border ${config.border} rounded-lg ${isIgnored ? 'opacity-50' : ''} ${compact ? 'p-2' : 'p-3'}`}
      >
        <div
          className={`flex items-start gap-3 ${compact ? '' : 'cursor-pointer'}`}
          onClick={() => !compact && toggleViolation(violation.id)}
        >
          <div className={config.color}>{config.icon}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-medium ${textColor} ${compact ? 'text-sm' : ''}`}>{violation.title}</h4>
              <span className={`rounded px-1.5 py-0.5 text-xs ${inputBg} ${mutedColor}`}>
                {violation.category}
              </span>
            </div>
            {!compact && (
              <p className={`text-sm ${mutedColor} mt-1`}>{violation.description}</p>
            )}
            {violation.location && (
              <span className={`text-xs ${mutedColor}`}>{violation.location}</span>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-2">
              {violation.autoFixable && showAutoFix && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); onFixViolation?.(violation.id);
                  }}
                  className="rounded-lg bg-blue-500 p-1.5 text-white hover:bg-blue-600"
                  title="Auto-fix"
                >
                  <Wand2 size={14} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation(); handleIgnore(violation.id);
                }}
                className={`p-1.5 ${mutedColor} ${hoverBg} rounded-lg`}
                title="Ignore"
              >
                <EyeOff size={14} />
              </button>
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
        {isExpanded && violation.suggestion && (
          <div className={`mt-3 border-t pt-3 ${borderColor}`}>
            <div className="flex items-start gap-2">
              <Info size={14} className={mutedColor} />
              <div>
                <span className={`text-sm font-medium ${textColor}`}>Suggestion:</span>
                <p className={`text-sm ${mutedColor} mt-1`}>{violation.suggestion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRuleItem = (rule: StyleGuideRule) => (
    <div
      key={rule.id}
      className={`flex items-center gap-3 rounded-lg border p-3 ${borderColor} ${hoverBg}`}
    >
      <button
        onClick={() => onToggleRule?.(rule.id)}
        className={`flex h-5 w-5 items-center justify-center rounded ${
          rule.enabled
            ? 'bg-blue-500 text-white'
            : `${inputBg} ${mutedColor}`
        }`}
      >
        {rule.enabled && <CheckCircle size={12} />}
      </button>

      <div className={`${mutedColor}`}>{getCategoryIcon(rule.category)}</div>

      <div className="min-w-0 flex-1">
        <h4 className={`font-medium ${textColor} ${!rule.enabled ? 'opacity-50' : ''}`}>
          {rule.name}
        </h4>
        <p className={`text-sm ${mutedColor} truncate`}>{rule.description}</p>
      </div>

      <span className={`rounded-full px-2 py-1 text-xs ${getSeverityConfig(rule.severity).bg} ${getSeverityConfig(rule.severity).color}`}>
        {rule.severity}
      </span>
    </div>
  );

  const renderSummaryBadges = () => (
    <div className="flex items-center gap-2">
      {violationCounts.error > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <XCircle size={12} />
          {violationCounts.error}
        </span>
      )}
      {violationCounts.warning > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertTriangle size={12} />
          {violationCounts.warning}
        </span>
      )}
      {violationCounts.info > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Info size={12} />
          {violationCounts.info}
        </span>
      )}
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} rounded-lg p-2 ${className}`}>
        <div className="flex items-center justify-between">
          {renderSummaryBadges()}
          {autoFixableCount > 0 && showAutoFix && (
            <button
              onClick={onFixAll}
              className="text-xs text-blue-500 hover:underline"
            >
              Fix
              {' '}
              {autoFixableCount}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderSummaryBadges()}
        {violations.length === 0 && (
          <span className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle size={14} />
            No issues
          </span>
        )}
        {autoFixableCount > 0 && showAutoFix && (
          <button
            onClick={onFixAll}
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            <Wand2 size={12} />
            Fix
            {' '}
            {autoFixableCount}
          </button>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Style Guide</h3>
          {renderSummaryBadges()}
        </div>
        <div className="space-y-2">
          {filteredViolations.slice(0, 3).map(v => renderViolationItem(v, true))}
        </div>
        {violations.length > 3 && (
          <p className={`text-sm ${mutedColor} mt-2 text-center`}>
            +
            {violations.length - 3}
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
            <h3 className={`font-semibold ${textColor}`}>Style Guide</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={onRefresh}
                className={`p-1.5 ${mutedColor} ${hoverBg} rounded-lg`}
              >
                <RefreshCw size={14} />
              </button>
              <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded-lg`}>
                <Settings size={14} />
              </button>
            </div>
          </div>
          {renderSummaryBadges()}
        </div>

        {/* Category filter */}
        <div className={`border-b p-2 ${borderColor} flex gap-1 overflow-x-auto`}>
          {(['all', 'color', 'typography', 'spacing', 'layout'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : `${inputBg} ${mutedColor}`
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Violations list */}
        <div className="flex-1 space-y-2 overflow-y-auto p-3">
          {filteredViolations.map(v => renderViolationItem(v))}
          {filteredViolations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle size={32} className="text-green-500" />
              <p className={`mt-2 ${mutedColor}`}>No issues found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {autoFixableCount > 0 && showAutoFix && (
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

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-6 ${borderColor}`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>Style Guide Enforcement</h2>
            <p className={`${mutedColor} mt-1`}>
              {violations.length}
              {' '}
              issues found in your design
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}
            >
              <RefreshCw size={18} className={mutedColor} />
            </button>
            {autoFixableCount > 0 && showAutoFix && (
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

        {/* Summary */}
        <div className="flex items-center gap-4">
          {renderSummaryBadges()}
          <button
            onClick={() => setShowIgnored(!showIgnored)}
            className={`text-sm ${mutedColor} flex items-center gap-1 hover:underline`}
          >
            {showIgnored ? <Eye size={14} /> : <EyeOff size={14} />}
            {ignoredViolations.size}
            {' '}
            ignored
          </button>
        </div>
      </div>

      {/* Tabs */}
      {showRules && (
        <div className={`flex border-b ${borderColor}`}>
          <button
            onClick={() => setActiveTab('violations')}
            className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'violations'
                ? 'border-blue-500 text-blue-500'
                : `border-transparent ${mutedColor}`
            }`}
          >
            Violations (
            {filteredViolations.length}
            )
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'rules'
                ? 'border-blue-500 text-blue-500'
                : `border-transparent ${mutedColor}`
            }`}
          >
            Rules (
            {rules.length}
            )
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {activeTab === 'violations' && (
          <>
            {/* Category filter */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {(['all', 'color', 'typography', 'spacing', 'layout', 'component', 'accessibility'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : `${inputBg} ${mutedColor} hover:bg-gray-200 dark:hover:bg-gray-700`
                  }`}
                >
                  {cat !== 'all' && getCategoryIcon(cat as ViolationCategory)}
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Violations list */}
            <div className="space-y-3">
              {filteredViolations.map(v => renderViolationItem(v))}
            </div>

            {filteredViolations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle size={48} className="text-green-500" />
                <h3 className={`mt-4 font-semibold ${textColor}`}>All Clear!</h3>
                <p className={`${mutedColor} mt-1`}>No style guide violations detected</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-2">
            {rules.map(renderRuleItem)}
            {rules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Settings size={48} className={mutedColor} />
                <p className={`${mutedColor} mt-4`}>No rules configured</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
