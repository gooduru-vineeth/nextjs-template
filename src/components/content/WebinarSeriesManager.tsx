'use client';

import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  Play,
  Plus,
  Share2,
  Users,
  Video,
} from 'lucide-react';
import { useState } from 'react';

// Types
type WebinarStatus = 'draft' | 'scheduled' | 'live' | 'ended' | 'archived';
type WebinarType = 'live' | 'on-demand' | 'hybrid';
type RegistrationStatus = 'open' | 'closed' | 'waitlist';

type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  bio: string;
};

type WebinarSession = {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  speakers: Speaker[];
  status: WebinarStatus;
  type: WebinarType;
  registrationStatus: RegistrationStatus;
  registeredCount: number;
  maxAttendees?: number;
  attendedCount?: number;
  recordingUrl?: string;
  thumbnail?: string;
  tags: string[];
};

type WebinarSeries = {
  id: string;
  title: string;
  description: string;
  sessions: WebinarSession[];
  category: string;
  isPublished: boolean;
  createdAt: Date;
};

type WebinarConfig = {
  series: WebinarSeries[];
  primaryColor: string;
  brandName: string;
  enableChat: boolean;
  enableQA: boolean;
  requireRegistration: boolean;
  sendReminders: boolean;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type WebinarSeriesManagerProps = {
  variant?: Variant;
  config?: Partial<WebinarConfig>;
  onConfigChange?: (config: WebinarConfig) => void;
  className?: string;
};

// Default data
const defaultSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'VP of Product',
    company: 'TechCorp',
    bio: 'Over 15 years of experience in product management and development.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Engineering Lead',
    company: 'TechCorp',
    bio: 'Expert in scalable systems and cloud architecture.',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Design Director',
    company: 'Creative Studio',
    bio: 'Award-winning designer specializing in user experience.',
  },
];

const defaultSessions: WebinarSession[] = [
  {
    id: '1',
    title: 'Introduction to Modern Product Design',
    description: 'Learn the fundamentals of modern product design principles and methodologies.',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    duration: 60,
    speakers: [defaultSpeakers[0]!],
    status: 'scheduled',
    type: 'live',
    registrationStatus: 'open',
    registeredCount: 234,
    maxAttendees: 500,
    tags: ['design', 'fundamentals', 'beginner'],
  },
  {
    id: '2',
    title: 'Advanced UX Research Techniques',
    description: 'Deep dive into user research methods that drive product decisions.',
    startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    duration: 90,
    speakers: [defaultSpeakers[2]!],
    status: 'scheduled',
    type: 'live',
    registrationStatus: 'open',
    registeredCount: 156,
    maxAttendees: 300,
    tags: ['ux', 'research', 'advanced'],
  },
  {
    id: '3',
    title: 'Building Scalable Design Systems',
    description: 'How to create and maintain design systems that scale across teams.',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 75,
    speakers: [defaultSpeakers[0]!, defaultSpeakers[2]!],
    status: 'ended',
    type: 'on-demand',
    registrationStatus: 'closed',
    registeredCount: 412,
    attendedCount: 356,
    recordingUrl: 'https://example.com/recording',
    tags: ['design systems', 'scalability', 'teams'],
  },
];

const defaultSeries: WebinarSeries[] = [
  {
    id: '1',
    title: 'Product Design Masterclass',
    description: 'A comprehensive series on modern product design practices',
    sessions: defaultSessions,
    category: 'Design',
    isPublished: true,
    createdAt: new Date(),
  },
];

const defaultConfig: WebinarConfig = {
  series: defaultSeries,
  primaryColor: '#3B82F6',
  brandName: 'TechCorp Academy',
  enableChat: true,
  enableQA: true,
  requireRegistration: true,
  sendReminders: true,
};

// Status styles
const statusStyles: Record<WebinarStatus, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', label: 'Draft' },
  scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', label: 'Scheduled' },
  live: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', label: 'LIVE' },
  ended: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', label: 'Ended' },
  archived: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500', label: 'Archived' },
};

export function WebinarSeriesManager({
  variant = 'full',
  config: initialConfig,
  onConfigChange,
  className = '',
}: WebinarSeriesManagerProps) {
  const [config] = useState<WebinarConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [, setShowCreateModal] = useState(false);
  const [expandedSeries, setExpandedSeries] = useState<string[]>([config.series[0]?.id ?? '']);

  // Notify parent of config changes if needed
  if (onConfigChange) {
    // Can be used to propagate changes
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}min`;
    }
    if (mins === 0) {
      return `${hours}hr`;
    }
    return `${hours}hr ${mins}min`;
  };

  const toggleSeriesExpand = (seriesId: string) => {
    setExpandedSeries(prev =>
      prev.includes(seriesId)
        ? prev.filter(id => id !== seriesId)
        : [...prev, seriesId],
    );
  };

  // Render Series List
  const renderSeriesList = () => (
    <div className="space-y-4">
      {config.series.map(series => (
        <div
          key={series.id}
          className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <button
            onClick={() => toggleSeriesExpand(series.id)}
            className="flex w-full items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-center space-x-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Video className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {series.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {series.sessions.length}
                  {' '}
                  sessions &middot;
                  {series.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`rounded-full px-2 py-1 text-xs ${series.isPublished ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                {series.isPublished ? 'Published' : 'Draft'}
              </span>
              {expandedSeries.includes(series.id)
                ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )
                : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
            </div>
          </button>

          {expandedSeries.includes(series.id) && (
            <div className="space-y-3 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/30">
              {series.sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all ${
                    selectedSession === session.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[session.status].bg} ${statusStyles[session.status].text}`}>
                          {statusStyles[session.status].label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {session.type === 'live' ? 'Live' : 'On-demand'}
                        </span>
                      </div>
                      <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                        {session.title}
                      </h4>
                      <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                        {session.description}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end space-y-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(session.startTime)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {session.speakers.slice(0, 3).map(speaker => (
                          <div
                            key={speaker.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-medium text-white dark:border-gray-800"
                            title={speaker.name}
                          >
                            {speaker.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {session.speakers.map(s => s.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        {session.registeredCount}
                        {session.maxAttendees && ` / ${session.maxAttendees}`}
                      </span>
                      {session.recordingUrl && (
                        <button className="flex items-center text-blue-500 hover:text-blue-600">
                          <Play className="mr-1 h-4 w-4" />
                          Watch
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:text-gray-400"
              >
                <Plus className="h-5 w-5" />
                <span>Add Session</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Render Session Detail
  const renderSessionDetail = () => {
    const session = config.series
      .flatMap(s => s.sessions)
      .find(s => s.id === selectedSession);

    if (!session) {
      return (
        <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <Video className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Select a session to view details</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center space-x-2">
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusStyles[session.status].bg} ${statusStyles[session.status].text}`}>
                {statusStyles[session.status].label}
              </span>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              {session.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {session.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <Edit2 className="h-5 w-5 text-gray-500" />
            </button>
            <button className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <Share2 className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: 'Date', value: formatDate(session.startTime) },
            { icon: Clock, label: 'Duration', value: formatDuration(session.duration) },
            { icon: Users, label: 'Registered', value: session.registeredCount.toString() },
            { icon: Eye, label: 'Attended', value: session.attendedCount?.toString() ?? '-' },
          ].map((stat, index) => (
            <div key={index} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <stat.icon className="mb-2 h-5 w-5 text-gray-400" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Speakers */}
        <div>
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Speakers</h3>
          <div className="space-y-3">
            {session.speakers.map(speaker => (
              <div key={speaker.id} className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
                  {speaker.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{speaker.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {speaker.title}
                    {' '}
                    at
                    {speaker.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {session.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          {session.status === 'scheduled' && (
            <button
              className="flex-1 rounded-lg py-3 font-medium text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              Start Webinar
            </button>
          )}
          {session.status === 'live' && (
            <button className="flex-1 rounded-lg bg-red-500 py-3 font-medium text-white">
              End Webinar
            </button>
          )}
          {session.recordingUrl && (
            <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg border border-gray-200 py-3 font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
              <Download className="h-5 w-5" />
              <span>Download Recording</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-2">
            <Video className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">{config.brandName}</span>
          </div>
          <div className="space-y-3">
            {config.series[0]?.sessions.slice(0, 2).map(session => (
              <div key={session.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <div className="mb-1 flex items-center space-x-2">
                  <span className={`h-2 w-2 rounded-full ${session.status === 'live' ? 'animate-pulse bg-red-500' : 'bg-green-500'}`} />
                  <span className="text-xs text-gray-500">{statusStyles[session.status].label}</span>
                </div>
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {session.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(session.startTime)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <Video className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className="font-medium text-gray-900 dark:text-white">Webinar Series</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <div className="text-center text-white">
            <Play className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">{config.brandName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className="font-medium text-gray-900 dark:text-white">Webinar Manager</span>
          </div>
          <button
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Plus className="mr-1 inline h-4 w-4" />
            New Series
          </button>
        </div>
        <div className="max-h-[400px] overflow-auto p-4">
          {renderSeriesList()}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Video className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {config.brandName}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Settings
              </button>
              <button
                className="rounded-lg px-4 py-2 font-medium text-white"
                style={{ backgroundColor: config.primaryColor }}
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="mr-2 inline h-5 w-5" />
                Create Webinar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Panel - Series List */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Series', value: config.series.length, icon: Video },
                { label: 'Total Sessions', value: config.series.flatMap(s => s.sessions).length, icon: Calendar },
                { label: 'Total Registrations', value: config.series.flatMap(s => s.sessions).reduce((sum, s) => sum + s.registeredCount, 0), icon: Users },
                { label: 'Live Now', value: config.series.flatMap(s => s.sessions).filter(s => s.status === 'live').length, icon: Play },
              ].map((stat, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <stat.icon className="mb-2 h-5 w-5" style={{ color: config.primaryColor }} />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Series List */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Webinar Series</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    <Users className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`rounded-lg p-2 ${viewMode === 'calendar' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  >
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              {renderSeriesList()}
            </div>
          </div>

          {/* Right Panel - Session Detail */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            {renderSessionDetail()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebinarSeriesManager;
