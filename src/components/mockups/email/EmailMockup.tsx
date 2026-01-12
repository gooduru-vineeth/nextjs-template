'use client';
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Forward,
  Mail,
  Menu,
  MoreHorizontal,
  Paperclip,
  Reply,
  Search,
  Send,
  Star,
  Tag,
  Trash2,
} from 'lucide-react';

export type EmailClient = 'gmail' | 'outlook' | 'apple' | 'generic';

export type EmailAttachment = {
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'image' | 'zip' | 'other';
};

export type EmailData = {
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  date: string;
  time: string;
  attachments?: EmailAttachment[];
  isStarred?: boolean;
  isRead?: boolean;
  labels?: string[];
};

export type EmailMockupProps = {
  email: EmailData;
  client?: EmailClient;
  variant?: 'full' | 'compact' | 'inbox-view' | 'compose';
  showToolbar?: boolean;
  showSidebar?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function EmailMockup({
  email,
  client = 'gmail',
  variant = 'full',
  showToolbar = true,
  showSidebar = false,
  darkMode = false,
  className = '',
}: EmailMockupProps) {
  const getClientColors = () => {
    switch (client) {
      case 'gmail':
        return {
          primary: 'text-red-500',
          accent: 'bg-blue-500',
          hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
          star: 'text-yellow-500',
          headerBg: darkMode ? 'bg-gray-900' : 'bg-white',
          bodyBg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
        };
      case 'outlook':
        return {
          primary: 'text-blue-600',
          accent: 'bg-blue-600',
          hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/30',
          star: 'text-yellow-500',
          headerBg: darkMode ? 'bg-gray-900' : 'bg-white',
          bodyBg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
        };
      case 'apple':
        return {
          primary: 'text-blue-500',
          accent: 'bg-blue-500',
          hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
          star: 'text-orange-500',
          headerBg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
          bodyBg: darkMode ? 'bg-gray-800' : 'bg-white',
        };
      default:
        return {
          primary: 'text-gray-700 dark:text-gray-300',
          accent: 'bg-gray-700 dark:bg-gray-300',
          hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
          star: 'text-yellow-500',
          headerBg: darkMode ? 'bg-gray-900' : 'bg-white',
          bodyBg: darkMode ? 'bg-gray-800' : 'bg-gray-50',
        };
    }
  };

  const colors = getClientColors();

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      case 'doc':
        return <FileText size={16} className="text-blue-500" />;
      case 'image':
        return <FileText size={16} className="text-green-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  // Inbox view variant
  if (variant === 'inbox-view') {
    return (
      <div className={`${colors.headerBg} overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className={`flex items-center gap-3 px-4 py-3 ${colors.hover} cursor-pointer ${
          !email.isRead ? 'font-semibold' : ''
        }`}
        >
          <button className={`p-1 ${email.isStarred ? colors.star : 'text-gray-400'}`}>
            <Star size={16} fill={email.isStarred ? 'currentColor' : 'none'} />
          </button>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">
            {email.from.avatar
              ? (
                  <img src={email.from.avatar} alt={email.from.name} className="h-full w-full rounded-full object-cover" />
                )
              : (
                  email.from.name.charAt(0)
                )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`truncate ${!email.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                {email.from.name}
              </span>
              {email.labels && email.labels.map((label, i) => (
                <span key={i} className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className={`truncate ${!email.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                {email.subject}
              </span>
              <span className="truncate text-gray-500 dark:text-gray-500">
                -
                {' '}
                {email.body.substring(0, 50)}
                ...
              </span>
            </div>
          </div>

          {email.attachments && email.attachments.length > 0 && (
            <Paperclip size={14} className="text-gray-400" />
          )}

          <span className="text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
            {email.time}
          </span>
        </div>
      </div>
    );
  }

  // Compose variant
  if (variant === 'compose') {
    return (
      <div className={`${colors.headerBg} overflow-hidden rounded-lg border border-gray-200 shadow-xl dark:border-gray-700 ${className}`}>
        {/* Compose Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">New Message</h3>
          <button className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
            <MoreHorizontal size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Recipients */}
        <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-12 text-sm text-gray-500 dark:text-gray-400">To</span>
            <div className="flex flex-1 flex-wrap gap-1">
              {email.to.map((recipient, i) => (
                <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {recipient}
                </span>
              ))}
            </div>
          </div>
        </div>

        {email.cc && email.cc.length > 0 && (
          <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-12 text-sm text-gray-500 dark:text-gray-400">Cc</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{email.cc.join(', ')}</span>
            </div>
          </div>
        )}

        <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-12 text-sm text-gray-500 dark:text-gray-400">Subject</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{email.subject}</span>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-[200px] p-4">
          <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {email.body}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <button className={`px-4 py-2 ${colors.accent} flex items-center gap-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90`}>
            <Send size={14} />
            Send
          </button>

          <div className="flex items-center gap-2">
            <button className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Paperclip size={18} className="text-gray-500" />
            </button>
            <button className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Trash2 size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${colors.headerBg} overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        {/* Compact Header */}
        <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-medium text-white">
              {email.from.avatar
                ? (
                    <img src={email.from.avatar} alt={email.from.name} className="h-full w-full rounded-full object-cover" />
                  )
                : (
                    email.from.name.charAt(0)
                  )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">{email.from.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{email.date}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{email.from.email}</span>
            </div>
          </div>
          <h2 className="mt-2 font-semibold text-gray-900 dark:text-white">{email.subject}</h2>
        </div>

        {/* Body */}
        <div className="p-4 text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {email.body}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${colors.bodyBg} overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Client Header */}
      {showToolbar && (
        <div className={`${colors.headerBg} border-b border-gray-200 dark:border-gray-700`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <button className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Menu size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-2">
                {client === 'gmail' && (
                  <span className="text-xl font-medium">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">m</span>
                    <span className="text-yellow-500">a</span>
                    <span className="text-blue-500">i</span>
                    <span className="text-green-500">l</span>
                  </span>
                )}
                {client === 'outlook' && (
                  <span className="text-xl font-semibold text-blue-600">Outlook</span>
                )}
                {client === 'apple' && (
                  <span className="text-xl font-medium text-gray-900 dark:text-white">Mail</span>
                )}
              </div>
            </div>

            <div className="mx-4 max-w-xl flex-1">
              <div className="relative">
                <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mail"
                  className="w-full rounded-lg border-none bg-gray-100 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                U
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2">
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Archive size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Trash2 size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Mail size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Clock size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Tag size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1" />
            <span className="text-sm text-gray-500 dark:text-gray-400">1 of 100</span>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className={`w-64 ${colors.headerBg} space-y-2 border-r border-gray-200 p-4 dark:border-gray-700`}>
            <button className={`flex w-full items-center gap-3 px-4 py-3 ${colors.accent} rounded-2xl text-white`}>
              <Send size={18} />
              Compose
            </button>
            {['Inbox', 'Starred', 'Sent', 'Drafts', 'Trash'].map(item => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${colors.hover} rounded-full`}
              >
                <Mail size={18} />
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Email Content */}
        <div className={`flex-1 ${colors.headerBg}`}>
          {/* Email Header */}
          <div className="border-b border-gray-100 p-6 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-lg font-medium text-white">
                {email.from.avatar
                  ? (
                      <img src={email.from.avatar} alt={email.from.name} className="h-full w-full rounded-full object-cover" />
                    )
                  : (
                      email.from.name.charAt(0)
                    )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{email.subject}</h2>
                  <div className="flex items-center gap-2">
                    <button className={`p-2 ${colors.hover} rounded-full`}>
                      <Star size={18} className={email.isStarred ? colors.star : 'text-gray-400'} fill={email.isStarred ? 'currentColor' : 'none'} />
                    </button>
                    <button className={`p-2 ${colors.hover} rounded-full`}>
                      <Reply size={18} className="text-gray-500" />
                    </button>
                    <button className={`p-2 ${colors.hover} rounded-full`}>
                      <MoreHorizontal size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{email.from.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    &lt;
                    {email.from.email}
                    &gt;
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    to
                    {email.to.join(', ')}
                  </span>
                  {email.cc && (
                    <span>
                      , Cc:
                      {email.cc.join(', ')}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {email.date}
                    {' '}
                    at
                    {' '}
                    {email.time}
                  </span>
                  {email.labels && email.labels.map((label, i) => (
                    <span key={i} className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {email.body}
            </div>

            {/* Attachments */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Attachments (
                  {email.attachments.length}
                  )
                </h4>
                <div className="flex flex-wrap gap-2">
                  {email.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      {getAttachmentIcon(attachment.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{attachment.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{attachment.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reply Actions */}
          <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button className={`flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300 ${colors.hover}`}>
                <Reply size={16} />
                Reply
              </button>
              <button className={`flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300 ${colors.hover}`}>
                <Forward size={16} />
                Forward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
