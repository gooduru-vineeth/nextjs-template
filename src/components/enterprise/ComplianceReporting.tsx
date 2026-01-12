'use client';

import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  Key,
  Lock,
  RefreshCw,
  Server,
  Shield,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// Types
export type ComplianceFramework = 'gdpr' | 'ccpa' | 'hipaa' | 'soc2' | 'iso27001' | 'pci-dss';
export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
export type ControlCategory = 'data-protection' | 'access-control' | 'audit-logging' | 'encryption' | 'incident-response' | 'vendor-management';

export type ComplianceControl = {
  id: string;
  name: string;
  description: string;
  category: ControlCategory;
  framework: ComplianceFramework[];
  status: ComplianceStatus;
  lastAssessed: Date;
  nextAssessment: Date;
  owner: string;
  evidence?: string[];
  findings?: string[];
  recommendations?: string[];
};

export type ComplianceReport = {
  id: string;
  name: string;
  framework: ComplianceFramework;
  generatedAt: Date;
  period: { start: Date; end: Date };
  overallScore: number;
  controls: ComplianceControl[];
  summary: {
    compliant: number;
    partial: number;
    nonCompliant: number;
    notApplicable: number;
  };
};

export type ComplianceReportingProps = {
  variant?: 'full' | 'dashboard' | 'widget';
  reports?: ComplianceReport[];
  onGenerateReport?: (framework: ComplianceFramework) => void;
  onExportReport?: (report: ComplianceReport, format: 'pdf' | 'csv' | 'json') => void;
  onRefresh?: () => void;
  className?: string;
};

// Framework info
const frameworkInfo: Record<ComplianceFramework, { name: string; description: string; icon: React.ReactNode }> = {
  'gdpr': { name: 'GDPR', description: 'General Data Protection Regulation', icon: <Globe className="h-5 w-5" /> },
  'ccpa': { name: 'CCPA', description: 'California Consumer Privacy Act', icon: <Shield className="h-5 w-5" /> },
  'hipaa': { name: 'HIPAA', description: 'Health Insurance Portability and Accountability', icon: <Lock className="h-5 w-5" /> },
  'soc2': { name: 'SOC 2', description: 'Service Organization Control 2', icon: <Server className="h-5 w-5" /> },
  'iso27001': { name: 'ISO 27001', description: 'Information Security Management', icon: <Key className="h-5 w-5" /> },
  'pci-dss': { name: 'PCI DSS', description: 'Payment Card Industry Data Security', icon: <Database className="h-5 w-5" /> },
};

// Mock data generator
const generateMockReports = (): ComplianceReport[] => {
  const frameworks: ComplianceFramework[] = ['gdpr', 'soc2', 'iso27001'];
  const now = new Date();

  return frameworks.map((framework) => {
    const controls: ComplianceControl[] = [
      {
        id: `${framework}-1`,
        name: 'Data Encryption at Rest',
        description: 'All sensitive data must be encrypted when stored',
        category: 'encryption',
        framework: [framework],
        status: 'compliant',
        lastAssessed: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(now.getTime() + 83 * 24 * 60 * 60 * 1000),
        owner: 'Security Team',
        evidence: ['Encryption policy document', 'Key management records'],
      },
      {
        id: `${framework}-2`,
        name: 'Access Control Policies',
        description: 'Role-based access control implemented across all systems',
        category: 'access-control',
        framework: [framework],
        status: 'compliant',
        lastAssessed: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(now.getTime() + 76 * 24 * 60 * 60 * 1000),
        owner: 'IT Operations',
        evidence: ['Access control matrix', 'User provisioning logs'],
      },
      {
        id: `${framework}-3`,
        name: 'Audit Trail Logging',
        description: 'Comprehensive logging of all system activities',
        category: 'audit-logging',
        framework: [framework],
        status: 'partial',
        lastAssessed: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(now.getTime() + 27 * 24 * 60 * 60 * 1000),
        owner: 'DevOps Team',
        findings: ['Some legacy systems have incomplete logging'],
        recommendations: ['Implement centralized logging for all systems'],
      },
      {
        id: `${framework}-4`,
        name: 'Data Retention Policy',
        description: 'Data retention and deletion procedures in place',
        category: 'data-protection',
        framework: [framework],
        status: 'compliant',
        lastAssessed: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(now.getTime() + 69 * 24 * 60 * 60 * 1000),
        owner: 'Data Governance',
        evidence: ['Retention policy', 'Automated deletion scripts'],
      },
      {
        id: `${framework}-5`,
        name: 'Incident Response Plan',
        description: 'Documented and tested incident response procedures',
        category: 'incident-response',
        framework: [framework],
        status: 'non-compliant',
        lastAssessed: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        owner: 'Security Team',
        findings: ['IR plan not tested in 12+ months', 'Contact list outdated'],
        recommendations: ['Schedule quarterly IR drills', 'Update contact information'],
      },
      {
        id: `${framework}-6`,
        name: 'Vendor Risk Assessment',
        description: 'Third-party vendor security assessments',
        category: 'vendor-management',
        framework: [framework],
        status: 'partial',
        lastAssessed: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        nextAssessment: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        owner: 'Procurement',
        findings: ['3 vendors missing current SOC 2 reports'],
        recommendations: ['Request updated certifications'],
      },
    ];

    const summary = {
      compliant: controls.filter(c => c.status === 'compliant').length,
      partial: controls.filter(c => c.status === 'partial').length,
      nonCompliant: controls.filter(c => c.status === 'non-compliant').length,
      notApplicable: controls.filter(c => c.status === 'not-applicable').length,
    };

    const overallScore = Math.round(
      ((summary.compliant * 100 + summary.partial * 50) / (controls.length - summary.notApplicable)),
    );

    return {
      id: `report-${framework}`,
      name: `${frameworkInfo[framework].name} Compliance Report`,
      framework,
      generatedAt: now,
      period: {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end: now,
      },
      overallScore,
      controls,
      summary,
    };
  });
};

// Helper components
const StatusBadge: React.FC<{ status: ComplianceStatus }> = ({ status }) => {
  const styles = {
    'compliant': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'partial': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'non-compliant': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'not-applicable': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };

  const icons = {
    'compliant': <CheckCircle className="h-3 w-3" />,
    'partial': <AlertTriangle className="h-3 w-3" />,
    'non-compliant': <XCircle className="h-3 w-3" />,
    'not-applicable': <Clock className="h-3 w-3" />,
  };

  const labels = {
    'compliant': 'Compliant',
    'partial': 'Partial',
    'non-compliant': 'Non-Compliant',
    'not-applicable': 'N/A',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  );
};

const ScoreGauge: React.FC<{ score: number; size?: 'sm' | 'md' | 'lg' }> = ({ score, size = 'md' }) => {
  const sizes = {
    sm: { width: 60, strokeWidth: 4, fontSize: 'text-sm' },
    md: { width: 100, strokeWidth: 6, fontSize: 'text-xl' },
    lg: { width: 140, strokeWidth: 8, fontSize: 'text-3xl' },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) {
      return '#10B981';
    }
    if (score >= 60) {
      return '#F59E0B';
    }
    return '#EF4444';
  };

  return (
    <div className="relative" style={{ width, height: width }}>
      <svg width={width} height={width} className="-rotate-90 transform">
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${fontSize}`} style={{ color: getColor(score) }}>
          {score}
          %
        </span>
      </div>
    </div>
  );
};

const ControlRow: React.FC<{
  control: ComplianceControl;
  expanded: boolean;
  onToggle: () => void;
}> = ({ control, expanded, onToggle }) => {
  const categoryIcons: Record<ControlCategory, React.ReactNode> = {
    'data-protection': <Database className="h-4 w-4" />,
    'access-control': <Users className="h-4 w-4" />,
    'audit-logging': <Activity className="h-4 w-4" />,
    'encryption': <Lock className="h-4 w-4" />,
    'incident-response': <AlertTriangle className="h-4 w-4" />,
    'vendor-management': <Globe className="h-4 w-4" />,
  };

  return (
    <div className="border-b border-gray-200 last:border-0 dark:border-gray-700">
      <div
        className="flex cursor-pointer items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        onClick={onToggle}
      >
        <button className="text-gray-400">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <div className="rounded-lg bg-gray-100 p-2 text-gray-500 dark:bg-gray-800">
          {categoryIcons[control.category]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 dark:text-white">{control.name}</div>
          <div className="truncate text-sm text-gray-500 dark:text-gray-400">{control.description}</div>
        </div>
        <StatusBadge status={control.status} />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {control.lastAssessed.toLocaleDateString()}
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 bg-gray-50 px-4 pb-4 pl-16 dark:bg-gray-800/30">
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Owner:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{control.owner}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Assessed:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{control.lastAssessed.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Next Assessment:</span>
              <span className="ml-2 text-gray-900 dark:text-white">{control.nextAssessment.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Category:</span>
              <span className="ml-2 text-gray-900 capitalize dark:text-white">{control.category.replace('-', ' ')}</span>
            </div>
          </div>

          {control.evidence && control.evidence.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Evidence</h5>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {control.evidence.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {control.findings && control.findings.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-medium text-red-600 dark:text-red-400">Findings</h5>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {control.findings.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {control.recommendations && control.recommendations.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">Recommendations</h5>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {control.recommendations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Report card component
export const ReportCard: React.FC<{
  report: ComplianceReport;
  onView?: () => void;
  onExport?: () => void;
}> = ({ report, onView, onExport }) => {
  const framework = frameworkInfo[report.framework];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {framework.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{framework.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{framework.description}</p>
          </div>
        </div>
        <ScoreGauge score={report.overallScore} size="sm" />
      </div>

      <div className="mb-4 grid grid-cols-4 gap-3">
        <div className="rounded-lg bg-green-50 p-2 text-center dark:bg-green-900/20">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{report.summary.compliant}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Compliant</div>
        </div>
        <div className="rounded-lg bg-yellow-50 p-2 text-center dark:bg-yellow-900/20">
          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{report.summary.partial}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Partial</div>
        </div>
        <div className="rounded-lg bg-red-50 p-2 text-center dark:bg-red-900/20">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">{report.summary.nonCompliant}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Non-Comp</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-700">
          <div className="text-lg font-bold text-gray-600 dark:text-gray-400">{report.summary.notApplicable}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">N/A</div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Generated
          {' '}
          {report.generatedAt.toLocaleDateString()}
        </span>
        <span>
          {report.controls.length}
          {' '}
          controls
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <button
          onClick={onExport}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
};

// Main component
export const ComplianceReporting: React.FC<ComplianceReportingProps> = ({
  variant = 'full',
  reports: propReports,
  onGenerateReport,
  onExportReport,
  onRefresh,
  className = '',
}) => {
  const [reports] = useState<ComplianceReport[]>(() => propReports || generateMockReports());
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | 'all'>('all');

  const filteredControls = useMemo(() => {
    if (!selectedReport) {
      return [];
    }
    if (statusFilter === 'all') {
      return selectedReport.controls;
    }
    return selectedReport.controls.filter(c => c.status === statusFilter);
  }, [selectedReport, statusFilter]);

  const toggleControl = (controlId: string) => {
    setExpandedControls((prev) => {
      const next = new Set(prev);
      if (next.has(controlId)) {
        next.delete(controlId);
      } else {
        next.add(controlId);
      }
      return next;
    });
  };

  // Widget variant
  if (variant === 'widget') {
    const avgScore = Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length);
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Shield className="h-5 w-5" />
            Compliance Score
          </h3>
          {onRefresh && (
            <button onClick={onRefresh} className="text-gray-500 hover:text-gray-700">
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-center">
            <ScoreGauge score={avgScore} size="lg" />
          </div>
          <div className="space-y-2">
            {reports.slice(0, 3).map(report => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  {frameworkInfo[report.framework].icon}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {frameworkInfo[report.framework].name}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    report.overallScore >= 80
                      ? 'text-green-600'
                      : report.overallScore >= 60
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
                  {report.overallScore}
                  %
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard variant
  if (variant === 'dashboard') {
    return (
      <div className={`${className}`}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Shield className="h-6 w-6" />
            Compliance Dashboard
          </h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onView={() => setSelectedReport(report)}
              onExport={() => onExportReport?.(report, 'pdf')}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex h-full bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sidebar - Reports list */}
      <div className="flex w-80 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-blue-500 p-2 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">Compliance</h2>
              <p className="text-xs text-gray-500">
                {reports.length}
                {' '}
                frameworks
              </p>
            </div>
          </div>
          {onGenerateReport && (
            <button
              onClick={() => onGenerateReport('gdpr')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-2">
          {reports.map((report) => {
            const framework = frameworkInfo[report.framework];
            const isSelected = selectedReport?.id === report.id;

            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className={`w-full rounded-lg p-3 text-left transition-colors ${
                  isSelected
                    ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {framework.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{framework.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Score:
                      {' '}
                      {report.overallScore}
                      %
                    </div>
                  </div>
                  <ScoreGauge score={report.overallScore} size="sm" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {selectedReport ? (
          <>
            {/* Header */}
            <div className="border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {frameworkInfo[selectedReport.framework].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {frameworkInfo[selectedReport.framework].name}
                      {' '}
                      Compliance Report
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {frameworkInfo[selectedReport.framework].description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreGauge score={selectedReport.overallScore} size="md" />
                </div>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-1 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Compliant</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedReport.summary.compliant}
                  </div>
                </div>
                <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Partial</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {selectedReport.summary.partial}
                  </div>
                </div>
                <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
                  <div className="mb-1 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Non-Compliant</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {selectedReport.summary.nonCompliant}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="mb-1 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">N/A</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {selectedReport.summary.notApplicable}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls filter */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as ComplianceStatus | 'all')}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="all">All Controls</option>
                  <option value="compliant">Compliant</option>
                  <option value="partial">Partial</option>
                  <option value="non-compliant">Non-Compliant</option>
                  <option value="not-applicable">N/A</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onExportReport?.(selectedReport, 'pdf')}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Controls list */}
            <div className="flex-1 overflow-y-auto">
              <div className="m-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                {filteredControls.length === 0
                  ? (
                      <div className="p-12 text-center">
                        <Shield className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                          No controls found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Try adjusting your filter to see more controls
                        </p>
                      </div>
                    )
                  : (
                      filteredControls.map(control => (
                        <ControlRow
                          key={control.id}
                          control={control}
                          expanded={expandedControls.has(control.id)}
                          onToggle={() => toggleControl(control.id)}
                        />
                      ))
                    )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Shield className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                Select a Report
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a compliance framework from the sidebar to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceReporting;
