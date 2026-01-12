'use client';

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Image,
  Info,
  Palette,
  RefreshCw,
  Shield,
  Type,
  XCircle,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ComplianceLevel = 'pass' | 'warning' | 'fail';
type CheckCategory = 'colors' | 'typography' | 'logos' | 'spacing' | 'content';

type ComplianceCheck = {
  id: string;
  category: CheckCategory;
  name: string;
  description: string;
  status: ComplianceLevel;
  details?: string;
  suggestion?: string;
  autoFix?: boolean;
};

type BrandGuidelineRule = {
  id: string;
  category: CheckCategory;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'error' | 'warning' | 'info';
};

type ComplianceReport = {
  totalChecks: number;
  passed: number;
  warnings: number;
  failed: number;
  score: number;
  checks: ComplianceCheck[];
  generatedAt: string;
};

type BrandComplianceCheckerProps = {
  variant?: 'full' | 'compact' | 'widget';
  mockupId?: string;
  brandKitId?: string;
  onAutoFix?: (checkId: string) => void;
  onExportReport?: (report: ComplianceReport) => void;
  className?: string;
};

// Mock data
const mockReport: ComplianceReport = {
  totalChecks: 12,
  passed: 8,
  warnings: 3,
  failed: 1,
  score: 85,
  generatedAt: new Date().toISOString(),
  checks: [
    { id: 'c1', category: 'colors', name: 'Primary Color Match', description: 'Primary brand color is used correctly', status: 'pass', details: '#3B82F6 matches brand guideline' },
    { id: 'c2', category: 'colors', name: 'Secondary Color Match', description: 'Secondary colors follow brand palette', status: 'pass' },
    { id: 'c3', category: 'colors', name: 'Contrast Ratio', description: 'Text contrast meets WCAG AA standards', status: 'warning', details: 'Some text has 4.2:1 ratio (minimum 4.5:1 recommended)', suggestion: 'Darken the text color slightly for better accessibility' },
    { id: 'c4', category: 'typography', name: 'Primary Font Family', description: 'Correct font family is used', status: 'pass', details: 'Inter font detected' },
    { id: 'c5', category: 'typography', name: 'Font Sizes', description: 'Font sizes follow brand scale', status: 'pass' },
    { id: 'c6', category: 'typography', name: 'Line Height', description: 'Line heights are within brand guidelines', status: 'warning', details: 'Body text line height is 1.4, brand recommends 1.5', autoFix: true },
    { id: 'c7', category: 'logos', name: 'Logo Placement', description: 'Logo is positioned correctly', status: 'pass' },
    { id: 'c8', category: 'logos', name: 'Logo Clear Space', description: 'Minimum clear space around logo is maintained', status: 'fail', details: 'Logo has only 8px spacing, minimum is 16px required', suggestion: 'Add more padding around the logo', autoFix: true },
    { id: 'c9', category: 'logos', name: 'Logo Color Variant', description: 'Correct logo color variant for background', status: 'pass' },
    { id: 'c10', category: 'spacing', name: 'Grid Alignment', description: 'Elements align to brand grid system', status: 'pass' },
    { id: 'c11', category: 'spacing', name: 'Consistent Margins', description: 'Margins follow brand spacing scale', status: 'warning', details: 'Inconsistent margins detected: 12px, 16px, 14px', autoFix: true },
    { id: 'c12', category: 'content', name: 'Brand Voice', description: 'Copy follows brand tone guidelines', status: 'pass', details: 'Professional tone detected' },
  ],
};

const mockRules: BrandGuidelineRule[] = [
  { id: 'r1', category: 'colors', name: 'Primary Color Check', description: 'Verify primary brand color usage', enabled: true, severity: 'error' },
  { id: 'r2', category: 'colors', name: 'Contrast Validation', description: 'Check WCAG contrast ratios', enabled: true, severity: 'warning' },
  { id: 'r3', category: 'typography', name: 'Font Family Check', description: 'Validate approved font families', enabled: true, severity: 'error' },
  { id: 'r4', category: 'typography', name: 'Font Size Scale', description: 'Check font sizes against type scale', enabled: true, severity: 'warning' },
  { id: 'r5', category: 'logos', name: 'Logo Clear Space', description: 'Verify minimum clear space', enabled: true, severity: 'error' },
  { id: 'r6', category: 'logos', name: 'Logo Color Variant', description: 'Check correct color variant usage', enabled: true, severity: 'warning' },
  { id: 'r7', category: 'spacing', name: 'Grid Alignment', description: 'Validate grid system alignment', enabled: false, severity: 'info' },
  { id: 'r8', category: 'content', name: 'Brand Voice Analysis', description: 'AI-powered brand voice checking', enabled: true, severity: 'info' },
];

const categoryConfig = {
  colors: { icon: Palette, label: 'Colors', color: 'text-blue-500' },
  typography: { icon: Type, label: 'Typography', color: 'text-purple-500' },
  logos: { icon: Image, label: 'Logos', color: 'text-orange-500' },
  spacing: { icon: FileText, label: 'Spacing', color: 'text-green-500' },
  content: { icon: FileText, label: 'Content', color: 'text-pink-500' },
};

export default function BrandComplianceChecker({
  variant = 'full',
  onAutoFix,
  onExportReport,
  className = '',
}: BrandComplianceCheckerProps) {
  const [report, setReport] = useState<ComplianceReport>(mockReport);
  const [rules, setRules] = useState<BrandGuidelineRule[]>(mockRules);
  const [activeTab, setActiveTab] = useState<'results' | 'rules'>('results');
  const [expandedCategories, setExpandedCategories] = useState<CheckCategory[]>(['colors', 'typography', 'logos']);
  const [isScanning, setIsScanning] = useState(false);
  const [, setSelectedCheck] = useState<ComplianceCheck | null>(null);
  void setSelectedCheck;

  const handleScan = useCallback(async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setReport({
      ...mockReport,
      generatedAt: new Date().toISOString(),
    });
    setIsScanning(false);
  }, []);

  const handleAutoFix = useCallback((checkId: string) => {
    setReport(prev => ({
      ...prev,
      checks: prev.checks.map(c =>
        c.id === checkId ? { ...c, status: 'pass' as ComplianceLevel } : c,
      ),
      passed: prev.passed + 1,
      warnings: prev.checks.find(c => c.id === checkId)?.status === 'warning' ? prev.warnings - 1 : prev.warnings,
      failed: prev.checks.find(c => c.id === checkId)?.status === 'fail' ? prev.failed - 1 : prev.failed,
      score: Math.min(100, prev.score + 5),
    }));
    onAutoFix?.(checkId);
  }, [onAutoFix]);

  const handleRuleToggle = useCallback((ruleId: string) => {
    setRules(prev => prev.map(r =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r,
    ));
  }, []);

  const toggleCategory = useCallback((category: CheckCategory) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  }, []);

  const getStatusIcon = (status: ComplianceLevel) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return 'text-green-600';
    }
    if (score >= 70) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const groupedChecks = report.checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<CheckCategory, ComplianceCheck[]>);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Brand Compliance</span>
          </div>
          <span className={`text-lg font-bold ${getScoreColor(report.score)}`}>
            {report.score}
            %
          </span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-green-600">
            {report.passed}
            {' '}
            passed
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-yellow-600">
            {report.warnings}
            {' '}
            warnings
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-red-600">
            {report.failed}
            {' '}
            failed
          </span>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Brand Compliance</h3>
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
            {report.score}
            %
          </div>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-green-50 p-2 text-center dark:bg-green-900/20">
            <p className="text-lg font-bold text-green-600">{report.passed}</p>
            <p className="text-xs text-green-600">Passed</p>
          </div>
          <div className="rounded-lg bg-yellow-50 p-2 text-center dark:bg-yellow-900/20">
            <p className="text-lg font-bold text-yellow-600">{report.warnings}</p>
            <p className="text-xs text-yellow-600">Warnings</p>
          </div>
          <div className="rounded-lg bg-red-50 p-2 text-center dark:bg-red-900/20">
            <p className="text-lg font-bold text-red-600">{report.failed}</p>
            <p className="text-xs text-red-600">Failed</p>
          </div>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          {isScanning ? 'Scanning...' : 'Run Compliance Check'}
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Brand Compliance Checker</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Validate mockups against brand guidelines</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onExportReport?.(report)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isScanning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              {isScanning ? 'Scanning...' : 'Run Check'}
            </button>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
            <p className="mb-1 text-sm text-blue-600 dark:text-blue-400">Compliance Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(report.score)}`}>
              {report.score}
              %
            </p>
          </div>
          <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
            <p className="mb-1 text-sm text-green-600 dark:text-green-400">Passed</p>
            <p className="text-4xl font-bold text-green-700 dark:text-green-300">{report.passed}</p>
          </div>
          <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="mb-1 text-sm text-yellow-600 dark:text-yellow-400">Warnings</p>
            <p className="text-4xl font-bold text-yellow-700 dark:text-yellow-300">{report.warnings}</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
            <p className="mb-1 text-sm text-red-600 dark:text-red-400">Failed</p>
            <p className="text-4xl font-bold text-red-700 dark:text-red-300">{report.failed}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex px-6">
          {(['results', 'rules'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'results' ? 'Compliance Results' : 'Guideline Rules'}
            </button>
          ))}
        </div>
      </div>

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="p-6">
          <div className="space-y-4">
            {(Object.keys(groupedChecks) as CheckCategory[]).map((category) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              const checks = groupedChecks[category];
              const isExpanded = expandedCategories.includes(category);

              return (
                <div key={category} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex w-full items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${config.color}`} />
                      <span className="font-medium text-gray-900 dark:text-white">{config.label}</span>
                      <span className="text-sm text-gray-500">
                        (
                        {checks.length}
                        {' '}
                        checks)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <span className="text-xs text-green-600">
                          {checks.filter(c => c.status === 'pass').length}
                          {' '}
                          ✓
                        </span>
                        <span className="text-xs text-yellow-600">
                          {checks.filter(c => c.status === 'warning').length}
                          {' '}
                          ⚠
                        </span>
                        <span className="text-xs text-red-600">
                          {checks.filter(c => c.status === 'fail').length}
                          {' '}
                          ✗
                        </span>
                      </div>
                      {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {checks.map(check => (
                        <div
                          key={check.id}
                          className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              {getStatusIcon(check.status)}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{check.name}</p>
                                <p className="text-sm text-gray-500">{check.description}</p>
                                {check.details && (
                                  <p className="mt-1 text-xs text-gray-400">{check.details}</p>
                                )}
                                {check.suggestion && (
                                  <p className="mt-1 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                    <Info className="h-3 w-3" />
                                    {check.suggestion}
                                  </p>
                                )}
                              </div>
                            </div>
                            {check.autoFix && check.status !== 'pass' && (
                              <button
                                onClick={() => handleAutoFix(check.id)}
                                className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                              >
                                <Zap className="h-3 w-3" />
                                Auto-fix
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Guideline Rules</h3>
            <p className="text-sm text-gray-500">
              {rules.filter(r => r.enabled).length}
              {' '}
              of
              {' '}
              {rules.length}
              {' '}
              enabled
            </p>
          </div>
          <div className="space-y-3">
            {rules.map((rule) => {
              const config = categoryConfig[rule.category];
              const Icon = config.icon;

              return (
                <div
                  key={rule.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    rule.enabled
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${rule.enabled ? config.color : 'text-gray-400'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{rule.name}</p>
                        <span className={`rounded px-2 py-0.5 text-xs ${
                          rule.severity === 'error'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : rule.severity === 'warning'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                        >
                          {rule.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{rule.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => handleRuleToggle(rule.id)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Last scanned info */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-center text-xs text-gray-500">
          Last checked:
          {' '}
          {new Date(report.generatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export type { BrandComplianceCheckerProps, BrandGuidelineRule, CheckCategory, ComplianceCheck, ComplianceLevel, ComplianceReport };
