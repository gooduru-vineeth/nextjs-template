'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Key,
  Lock,
  RefreshCw,
  Shield,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type VulnerabilityCategory = 'authentication' | 'authorization' | 'injection' | 'xss' | 'csrf' | 'encryption' | 'configuration' | 'dependencies';
export type ComplianceStandard = 'OWASP' | 'GDPR' | 'CCPA' | 'SOC2' | 'HIPAA';

export type SecurityVulnerability = {
  id: string;
  title: string;
  description: string;
  category: VulnerabilityCategory;
  severity: SeverityLevel;
  location?: string;
  recommendation: string;
  cweId?: string;
  cvss?: number;
};

export type ComplianceCheck = {
  id: string;
  standard: ComplianceStandard;
  requirement: string;
  status: 'passed' | 'failed' | 'warning' | 'not-applicable';
  details?: string;
};

export type SecurityAuditReport = {
  timestamp: Date;
  vulnerabilities: SecurityVulnerability[];
  complianceChecks: ComplianceCheck[];
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
};

export type SecurityAuditPanelProps = {
  variant?: 'full' | 'compact' | 'widget' | 'dashboard';
  onRunAudit?: () => void;
  onExportReport?: (report: SecurityAuditReport) => void;
  onFixVulnerability?: (vulnerability: SecurityVulnerability) => void;
};

// Mock data generator
const generateMockReport = (): SecurityAuditReport => {
  const vulnerabilities: SecurityVulnerability[] = [
    {
      id: '1',
      title: 'Insecure Direct Object Reference',
      description: 'API endpoints expose internal database IDs without proper access control validation.',
      category: 'authorization',
      severity: 'high',
      location: '/api/mockups/[id]',
      recommendation: 'Implement proper authorization checks and use UUIDs instead of sequential IDs.',
      cweId: 'CWE-639',
      cvss: 7.5,
    },
    {
      id: '2',
      title: 'Missing Content Security Policy',
      description: 'The application does not implement a Content Security Policy header.',
      category: 'configuration',
      severity: 'medium',
      recommendation: 'Add CSP headers to prevent XSS attacks and limit resource loading.',
      cweId: 'CWE-1021',
      cvss: 5.3,
    },
    {
      id: '3',
      title: 'Outdated Dependency',
      description: 'Package "lodash" version 4.17.15 has known vulnerabilities.',
      category: 'dependencies',
      severity: 'medium',
      location: 'package.json',
      recommendation: 'Update lodash to version 4.17.21 or later.',
      cweId: 'CWE-1395',
      cvss: 5.0,
    },
    {
      id: '4',
      title: 'Session Cookie Missing Secure Flag',
      description: 'Session cookies are not marked as Secure, allowing transmission over HTTP.',
      category: 'authentication',
      severity: 'medium',
      recommendation: 'Set the Secure flag on all session cookies.',
      cweId: 'CWE-614',
      cvss: 4.8,
    },
    {
      id: '5',
      title: 'Verbose Error Messages',
      description: 'Application returns detailed error messages that may leak sensitive information.',
      category: 'configuration',
      severity: 'low',
      location: 'Error handler middleware',
      recommendation: 'Implement generic error messages for production and log detailed errors server-side.',
      cweId: 'CWE-209',
      cvss: 3.1,
    },
    {
      id: '6',
      title: 'Missing Rate Limiting',
      description: 'API endpoints lack rate limiting, making them vulnerable to brute force attacks.',
      category: 'authentication',
      severity: 'high',
      location: '/api/auth/*',
      recommendation: 'Implement rate limiting using middleware like express-rate-limit or similar.',
      cweId: 'CWE-770',
      cvss: 7.0,
    },
  ];

  const complianceChecks: ComplianceCheck[] = [
    { id: '1', standard: 'OWASP', requirement: 'A01:2021 - Broken Access Control', status: 'warning', details: 'Some endpoints need additional access control' },
    { id: '2', standard: 'OWASP', requirement: 'A02:2021 - Cryptographic Failures', status: 'passed' },
    { id: '3', standard: 'OWASP', requirement: 'A03:2021 - Injection', status: 'passed' },
    { id: '4', standard: 'OWASP', requirement: 'A04:2021 - Insecure Design', status: 'passed' },
    { id: '5', standard: 'OWASP', requirement: 'A05:2021 - Security Misconfiguration', status: 'warning', details: 'Missing security headers' },
    { id: '6', standard: 'GDPR', requirement: 'Data Encryption at Rest', status: 'passed' },
    { id: '7', standard: 'GDPR', requirement: 'Data Encryption in Transit', status: 'passed' },
    { id: '8', standard: 'GDPR', requirement: 'Right to be Forgotten', status: 'passed' },
    { id: '9', standard: 'GDPR', requirement: 'Data Breach Notification', status: 'warning', details: 'Notification process needs documentation' },
    { id: '10', standard: 'SOC2', requirement: 'Access Controls', status: 'passed' },
    { id: '11', standard: 'SOC2', requirement: 'Audit Logging', status: 'passed' },
    { id: '12', standard: 'SOC2', requirement: 'Incident Response', status: 'warning', details: 'Response plan needs review' },
  ];

  const score = 72;
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (score >= 90) {
    grade = 'A';
  } else if (score >= 80) {
    grade = 'B';
  } else if (score >= 70) {
    grade = 'C';
  } else if (score >= 60) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  return {
    timestamp: new Date(),
    vulnerabilities,
    complianceChecks,
    score,
    grade,
  };
};

// Helper functions
const getSeverityColor = (severity: SeverityLevel): string => {
  const colors: Record<SeverityLevel, string> = {
    critical: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    high: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    medium: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    low: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    info: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
  };
  return colors[severity];
};

const getCategoryIcon = (category: VulnerabilityCategory) => {
  const icons: Record<VulnerabilityCategory, typeof Shield> = {
    authentication: Key,
    authorization: Lock,
    injection: Database,
    xss: Globe,
    csrf: Globe,
    encryption: Lock,
    configuration: FileText,
    dependencies: FileText,
  };
  return icons[category];
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, typeof CheckCircle> = {
    'passed': CheckCircle,
    'failed': XCircle,
    'warning': AlertTriangle,
    'not-applicable': AlertCircle,
  };
  return icons[status] || AlertCircle;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'passed': 'text-green-500',
    'failed': 'text-red-500',
    'warning': 'text-amber-500',
    'not-applicable': 'text-gray-400',
  };
  return colors[status] || 'text-gray-400';
};

const getGradeColor = (grade: 'A' | 'B' | 'C' | 'D' | 'F'): string => {
  const colors: Record<'A' | 'B' | 'C' | 'D' | 'F', string> = {
    A: 'text-green-500 bg-green-100 dark:bg-green-900/30',
    B: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    C: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    D: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
    F: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  };
  return colors[grade];
};

// Main Component
export default function SecurityAuditPanel({
  variant = 'full',
  onRunAudit,
  onExportReport,
  onFixVulnerability,
}: SecurityAuditPanelProps) {
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'vulnerabilities' | 'compliance'>('vulnerabilities');
  const [expandedVulnerabilities, setExpandedVulnerabilities] = useState<Set<string>>(new Set());
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | 'all'>('all');
  const [filterStandard, setFilterStandard] = useState<ComplianceStandard | 'all'>('all');

  const runAudit = async () => {
    setIsAuditing(true);
    onRunAudit?.();

    // Simulate audit
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newReport = generateMockReport();
    setReport(newReport);
    setIsAuditing(false);
  };

  const toggleVulnerability = (id: string) => {
    setExpandedVulnerabilities((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredVulnerabilities = report?.vulnerabilities.filter((v) => {
    if (filterSeverity !== 'all' && v.severity !== filterSeverity) {
      return false;
    }
    return true;
  }) || [];

  const filteredCompliance = report?.complianceChecks.filter((c) => {
    if (filterStandard !== 'all' && c.standard !== filterStandard) {
      return false;
    }
    return true;
  }) || [];

  const vulnerabilityStats = report
    ? {
        critical: report.vulnerabilities.filter(v => v.severity === 'critical').length,
        high: report.vulnerabilities.filter(v => v.severity === 'high').length,
        medium: report.vulnerabilities.filter(v => v.severity === 'medium').length,
        low: report.vulnerabilities.filter(v => v.severity === 'low').length,
      }
    : { critical: 0, high: 0, medium: 0, low: 0 };

  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Security</span>
          </div>
          {report && (
            <span className={`rounded px-2 py-1 text-lg font-bold ${getGradeColor(report.grade)}`}>
              {report.grade}
            </span>
          )}
        </div>
        {report
          ? (
              <div className="space-y-2">
                {vulnerabilityStats.high > 0 && (
                  <div className="flex items-center gap-2 text-xs text-red-500">
                    <AlertTriangle className="h-3 w-3" />
                    {vulnerabilityStats.high}
                    {' '}
                    high severity issues
                  </div>
                )}
                {vulnerabilityStats.medium > 0 && (
                  <div className="flex items-center gap-2 text-xs text-amber-500">
                    <AlertTriangle className="h-3 w-3" />
                    {vulnerabilityStats.medium}
                    {' '}
                    medium severity issues
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Score:
                  {' '}
                  {report.score}
                  /100
                </div>
              </div>
            )
          : (
              <button
                onClick={runAudit}
                disabled={isAuditing}
                className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isAuditing ? 'Auditing...' : 'Run Audit'}
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
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Security Audit</span>
            </div>
            <button
              onClick={runAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isAuditing
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Auditing...
                    </>
                  )
                : (
                    <>
                      <Eye className="h-4 w-4" />
                      Run Audit
                    </>
                  )}
            </button>
          </div>
        </div>
        {report && (
          <div className="p-4">
            <div className="flex items-center justify-center gap-6">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${getGradeColor(report.grade)}`}>
                <span className="text-2xl font-bold">{report.grade}</span>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{report.score}</div>
                <div className="text-sm text-gray-500">Security Score</div>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Overview</h3>
          <button
            onClick={runAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isAuditing
              ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Auditing...
                  </>
                )
              : (
                  <>
                    <Eye className="h-4 w-4" />
                    Run Audit
                  </>
                )}
          </button>
        </div>

        {report
          ? (
              <div className="grid grid-cols-5 gap-4">
                <div className={`rounded-xl p-4 text-center ${getGradeColor(report.grade)}`}>
                  <div className="text-4xl font-bold">{report.grade}</div>
                  <div className="text-sm opacity-75">Grade</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{report.score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-600">{vulnerabilityStats.high}</div>
                  <div className="text-sm text-gray-500">High</div>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 text-center dark:bg-amber-900/20">
                  <div className="text-2xl font-bold text-amber-600">{vulnerabilityStats.medium}</div>
                  <div className="text-sm text-gray-500">Medium</div>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                  <div className="text-2xl font-bold text-blue-600">{vulnerabilityStats.low}</div>
                  <div className="text-sm text-gray-500">Low</div>
                </div>
              </div>
            )
          : (
              <div className="py-8 text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">Run an audit to see security status</p>
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
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Audit</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vulnerability scanning and compliance checking</p>
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
              onClick={runAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isAuditing
                ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  )
                : (
                    <>
                      <Eye className="h-4 w-4" />
                      Run Audit
                    </>
                  )}
            </button>
          </div>
        </div>
      </div>

      {report ? (
        <>
          {/* Score banner */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full ${getGradeColor(report.grade)}`}>
                  <span className="text-3xl font-bold">{report.grade}</span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {report.score}
                    /100
                  </div>
                  <div className="text-sm text-gray-500">Security Score</div>
                </div>
              </div>
              <div className="flex gap-6">
                {vulnerabilityStats.critical > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{vulnerabilityStats.critical}</div>
                    <div className="text-xs text-gray-500">Critical</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{vulnerabilityStats.high}</div>
                  <div className="text-xs text-gray-500">High</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{vulnerabilityStats.medium}</div>
                  <div className="text-xs text-gray-500">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{vulnerabilityStats.low}</div>
                  <div className="text-xs text-gray-500">Low</div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {report.timestamp.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('vulnerabilities')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'vulnerabilities'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              Vulnerabilities (
              {report.vulnerabilities.length}
              )
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'compliance'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CheckCircle className="mr-2 inline h-4 w-4" />
              Compliance (
              {report.complianceChecks.length}
              )
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'vulnerabilities' && (
              <>
                {/* Filter */}
                <div className="mb-4">
                  <select
                    value={filterSeverity}
                    onChange={e => setFilterSeverity(e.target.value as SeverityLevel | 'all')}
                    className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Vulnerabilities list */}
                <div className="space-y-3">
                  {filteredVulnerabilities.map((vuln) => {
                    const CategoryIcon = getCategoryIcon(vuln.category);
                    const isExpanded = expandedVulnerabilities.has(vuln.id);

                    return (
                      <div
                        key={vuln.id}
                        className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <button
                          onClick={() => toggleVulnerability(vuln.id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className={`rounded px-2 py-1 text-xs font-medium uppercase ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </div>
                          <CategoryIcon className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {vuln.title}
                            </span>
                            {vuln.cweId && (
                              <span className="ml-2 text-xs text-gray-500">{vuln.cweId}</span>
                            )}
                          </div>
                          {vuln.cvss && (
                            <span className="text-sm text-gray-500">
                              CVSS:
                              {vuln.cvss}
                            </span>
                          )}
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
                              {vuln.description}
                            </p>

                            {vuln.location && (
                              <div className="mb-3">
                                <span className="text-xs font-medium text-gray-500">Location:</span>
                                <code className="mt-1 block rounded bg-gray-100 px-3 py-2 font-mono text-xs dark:bg-gray-800">
                                  {vuln.location}
                                </code>
                              </div>
                            )}

                            <div className="mb-3">
                              <span className="text-xs font-medium text-gray-500">Recommendation:</span>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {vuln.recommendation}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onFixVulnerability?.(vuln)}
                                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                              >
                                <Lock className="h-4 w-4" />
                                Fix Issue
                              </button>
                              {vuln.cweId && (
                                <a
                                  href={`https://cwe.mitre.org/data/definitions/${vuln.cweId.replace('CWE-', '')}.html`}
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
                </div>
              </>
            )}

            {activeTab === 'compliance' && (
              <>
                {/* Filter */}
                <div className="mb-4">
                  <select
                    value={filterStandard}
                    onChange={e => setFilterStandard(e.target.value as ComplianceStandard | 'all')}
                    className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                  >
                    <option value="all">All Standards</option>
                    <option value="OWASP">OWASP Top 10</option>
                    <option value="GDPR">GDPR</option>
                    <option value="SOC2">SOC 2</option>
                    <option value="CCPA">CCPA</option>
                    <option value="HIPAA">HIPAA</option>
                  </select>
                </div>

                {/* Compliance list */}
                <div className="space-y-2">
                  {filteredCompliance.map((check) => {
                    const StatusIcon = getStatusIcon(check.status);
                    return (
                      <div
                        key={check.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800"
                      >
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(check.status)}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium dark:bg-gray-700">
                              {check.standard}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {check.requirement}
                            </span>
                          </div>
                          {check.details && (
                            <p className="mt-1 text-xs text-gray-500">{check.details}</p>
                          )}
                        </div>
                        <span className={`text-sm font-medium capitalize ${getStatusColor(check.status)}`}>
                          {check.status.replace('-', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="p-12 text-center">
          <Shield className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Security Audit
          </h3>
          <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
            Run a comprehensive security audit to identify vulnerabilities and check compliance with industry standards.
          </p>
          <button
            onClick={runAudit}
            disabled={isAuditing}
            className="mx-auto flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isAuditing
              ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Scanning...
                  </>
                )
              : (
                  <>
                    <Eye className="h-5 w-5" />
                    Run Security Audit
                  </>
                )}
          </button>
        </div>
      )}
    </div>
  );
}
