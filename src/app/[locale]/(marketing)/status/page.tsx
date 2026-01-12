'use client';

import { useEffect, useState } from 'react';

type ServiceStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';

type Service = {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  uptime: number;
  lastChecked: string;
};

type Incident = {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  affectedServices: string[];
  updates: {
    timestamp: string;
    message: string;
    status: string;
  }[];
  createdAt: string;
  resolvedAt?: string;
};

type MaintenanceWindow = {
  id: string;
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServices: string[];
  status: 'scheduled' | 'in_progress' | 'completed';
};

const services: Service[] = [
  {
    id: 'web_app',
    name: 'Web Application',
    description: 'Main MockFlow web application',
    status: 'operational',
    uptime: 99.98,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'api',
    name: 'API',
    description: 'REST API for mockup generation',
    status: 'operational',
    uptime: 99.95,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'export',
    name: 'Export Service',
    description: 'PNG, PDF, SVG export engine',
    status: 'operational',
    uptime: 99.92,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'storage',
    name: 'Cloud Storage',
    description: 'Mockup and asset storage',
    status: 'operational',
    uptime: 99.99,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'cdn',
    name: 'CDN',
    description: 'Content delivery network',
    status: 'operational',
    uptime: 99.99,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'auth',
    name: 'Authentication',
    description: 'User authentication and sessions',
    status: 'operational',
    uptime: 99.97,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Primary database cluster',
    status: 'operational',
    uptime: 99.99,
    lastChecked: '2 minutes ago',
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    description: 'Webhook delivery service',
    status: 'operational',
    uptime: 99.89,
    lastChecked: '2 minutes ago',
  },
];

const recentIncidents: Incident[] = [
  {
    id: 'inc_1',
    title: 'Increased Export Times',
    status: 'resolved',
    severity: 'minor',
    affectedServices: ['export'],
    updates: [
      {
        timestamp: 'Jan 8, 2026 14:45 UTC',
        message: 'We have resolved the issue causing slow export times. All systems are operating normally.',
        status: 'Resolved',
      },
      {
        timestamp: 'Jan 8, 2026 14:20 UTC',
        message: 'We have identified the root cause and are implementing a fix.',
        status: 'Identified',
      },
      {
        timestamp: 'Jan 8, 2026 14:00 UTC',
        message: 'We are investigating reports of slower than normal export times.',
        status: 'Investigating',
      },
    ],
    createdAt: 'Jan 8, 2026 14:00 UTC',
    resolvedAt: 'Jan 8, 2026 14:45 UTC',
  },
];

const scheduledMaintenance: MaintenanceWindow[] = [
  {
    id: 'maint_1',
    title: 'Database Upgrade',
    description: 'Scheduled database upgrade to improve performance. Expected downtime: 15 minutes.',
    scheduledStart: 'Jan 20, 2026 02:00 UTC',
    scheduledEnd: 'Jan 20, 2026 02:30 UTC',
    affectedServices: ['database', 'api', 'web_app'],
    status: 'scheduled',
  },
];

const statusConfig: Record<ServiceStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
  operational: {
    label: 'Operational',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    dotColor: 'bg-green-500',
  },
  degraded: {
    label: 'Degraded Performance',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    dotColor: 'bg-yellow-500',
  },
  partial_outage: {
    label: 'Partial Outage',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    dotColor: 'bg-orange-500',
  },
  major_outage: {
    label: 'Major Outage',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    dotColor: 'bg-red-500',
  },
  maintenance: {
    label: 'Under Maintenance',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    dotColor: 'bg-blue-500',
  },
};

function getOverallStatus(servicesList: Service[]): ServiceStatus {
  const hasOutage = servicesList.some(s => s.status === 'major_outage');
  if (hasOutage) {
    return 'major_outage';
  }

  const hasPartialOutage = servicesList.some(s => s.status === 'partial_outage');
  if (hasPartialOutage) {
    return 'partial_outage';
  }

  const hasDegraded = servicesList.some(s => s.status === 'degraded');
  if (hasDegraded) {
    return 'degraded';
  }

  const hasMaintenance = servicesList.some(s => s.status === 'maintenance');
  if (hasMaintenance) {
    return 'maintenance';
  }

  return 'operational';
}

function UptimeBar({ days }: { days: number[] }) {
  return (
    <div className="flex gap-0.5">
      {days.map((uptime, index) => (
        <div
          key={index}
          className={`h-8 w-1 rounded-full ${
            uptime >= 99.9
              ? 'bg-green-500'
              : uptime >= 99
                ? 'bg-yellow-500'
                : uptime >= 95
                  ? 'bg-orange-500'
                  : 'bg-red-500'
          }`}
          title={`${uptime.toFixed(2)}% uptime`}
        />
      ))}
    </div>
  );
}

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const overallStatus = getOverallStatus(services);
  const overallConfig = statusConfig[overallStatus];

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  // Generate mock uptime data for the last 90 days
  const uptimeHistory = Array.from({ length: 90 }, () => 99 + Math.random() * 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`border-b border-gray-200 px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-700 ${overallConfig.bgColor}`}>
        <div className="mx-auto max-w-4xl text-center">
          <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 ${overallConfig.bgColor}`}>
            <span className={`size-3 animate-pulse rounded-full ${overallConfig.dotColor}`} />
            <span className={`font-semibold ${overallConfig.color}`}>{overallConfig.label}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">MockFlow Status</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Current status of MockFlow services and infrastructure
          </p>
          {lastUpdated && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Last updated:
              {' '}
              {lastUpdated}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Subscribe to Updates */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Subscribe to Updates</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified when we have scheduled maintenance or outages
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Uptime Overview */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">90-Day Uptime</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {(uptimeHistory.reduce((a, b) => a + b, 0) / uptimeHistory.length).toFixed(2)}
              % average
            </span>
          </div>
          <UptimeBar days={uptimeHistory} />
          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Services</h2>
          <div className="space-y-3">
            {services.map((service) => {
              const config = statusConfig[service.status];
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className={`size-3 rounded-full ${config.dotColor}`} />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{service.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {service.uptime}
                      % uptime
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Maintenance */}
        {scheduledMaintenance.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Scheduled Maintenance</h2>
            <div className="space-y-4">
              {scheduledMaintenance.map(maintenance => (
                <div
                  key={maintenance.id}
                  className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-blue-900 dark:text-blue-300">{maintenance.title}</h3>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                      {maintenance.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">{maintenance.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-blue-700 dark:text-blue-400">
                    <span>
                      Start:
                      {maintenance.scheduledStart}
                    </span>
                    <span>
                      End:
                      {maintenance.scheduledEnd}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {maintenance.affectedServices.map((serviceId) => {
                      const service = services.find(s => s.id === serviceId);
                      return (
                        <span
                          key={serviceId}
                          className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                        >
                          {service?.name || serviceId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Incidents */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Incidents</h2>
          {recentIncidents.length > 0
            ? (
                <div className="space-y-4">
                  {recentIncidents.map(incident => (
                    <div
                      key={incident.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{incident.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{incident.createdAt}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            incident.status === 'resolved'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : incident.status === 'monitoring'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {incident.status}
                        </span>
                      </div>
                      <div className="space-y-3 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                        {incident.updates.map((update, index) => (
                          <div key={index}>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {update.timestamp}
                              {' '}
                              -
                              {update.status}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{update.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            : (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                  <svg
                    className="mx-auto size-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">No Recent Incidents</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    All systems have been operating normally
                  </p>
                </div>
              )}
        </div>

        {/* Historical Uptime */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Historical Uptime</h2>
          <div className="space-y-3">
            {[
              { month: 'January 2026', uptime: 99.97 },
              { month: 'December 2025', uptime: 99.95 },
              { month: 'November 2025', uptime: 99.98 },
              { month: 'October 2025', uptime: 99.92 },
            ].map(record => (
              <div key={record.month} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{record.month}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${record.uptime}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {record.uptime}
                    %
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
