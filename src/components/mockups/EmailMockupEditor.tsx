'use client';

import {
  AlertCircle,
  Archive,
  ChevronDown,
  Clock,
  FileText,
  Forward,
  Image,
  Inbox,
  Link,
  Mail,
  MoreHorizontal,
  Paperclip,
  Plus,
  Reply,
  ReplyAll,
  Search,
  Send,
  Settings,
  Star,
  Tag,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type EmailPlatform = 'gmail' | 'outlook' | 'apple-mail';
export type EmailView = 'inbox' | 'compose' | 'thread';
export type EmailTheme = 'light' | 'dark';

export type EmailAttachment = {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'document' | 'archive' | 'other';
};

export type EmailMessage = {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: { name: string; email: string }[];
  cc?: { name: string; email: string }[];
  subject: string;
  preview: string;
  body: string;
  date: Date;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  attachments?: EmailAttachment[];
  labels?: string[];
  isImportant?: boolean;
};

export type EmailThread = {
  id: string;
  subject: string;
  participants: { name: string; email: string; avatar?: string }[];
  messages: EmailMessage[];
  lastActivity: Date;
  unreadCount: number;
};

export type EmailMockupEditorProps = {
  platform?: EmailPlatform;
  view?: EmailView;
  theme?: EmailTheme;
  messages?: EmailMessage[];
  thread?: EmailThread;
  composeData?: {
    to: string;
    cc?: string;
    subject: string;
    body: string;
  };
  variant?: 'full' | 'compact' | 'preview';
  onPlatformChange?: (platform: EmailPlatform) => void;
  onViewChange?: (view: EmailView) => void;
  onSend?: (data: { to: string; subject: string; body: string }) => void;
  onExport?: () => void;
};

// Mock data generators
const generateMockMessages = (): EmailMessage[] => [
  {
    id: 'm1',
    from: { name: 'Sarah Chen', email: 'sarah.chen@company.com' },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Q4 Marketing Strategy Review',
    preview: 'Hi team, I wanted to share the updated marketing strategy for Q4. Please review the attached...',
    body: 'Hi team,\n\nI wanted to share the updated marketing strategy for Q4. Please review the attached document and let me know your thoughts by EOD Friday.\n\nKey highlights:\n- Social media campaign expansion\n- New influencer partnerships\n- Product launch timeline\n\nBest,\nSarah',
    date: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'a1', name: 'Q4_Strategy.pdf', size: '2.4 MB', type: 'document' },
    ],
    labels: ['Work', 'Important'],
    isImportant: true,
  },
  {
    id: 'm2',
    from: { name: 'GitHub', email: 'noreply@github.com' },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: '[mockflow/main] Pull request merged: feat: Add email mockup editor',
    preview: 'Your pull request #42 has been merged into main. View the commit...',
    body: 'Your pull request #42 has been merged into main.\n\nView the commit: https://github.com/...\n\n-- GitHub',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    labels: ['Notifications'],
  },
  {
    id: 'm3',
    from: { name: 'John Smith', email: 'john.smith@client.com' },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Re: Project Timeline Update',
    preview: 'Thanks for the update! The new timeline works for us. Let me check with the team and...',
    body: 'Thanks for the update! The new timeline works for us.\n\nLet me check with the team and get back to you with any questions.\n\nBest regards,\nJohn',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
  },
  {
    id: 'm4',
    from: { name: 'Stripe', email: 'receipts@stripe.com' },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Your receipt from MockFlow',
    preview: 'Receipt for your payment of $29.00 to MockFlow. View your receipt...',
    body: 'Receipt for your payment of $29.00 to MockFlow.\n\nView your receipt: https://stripe.com/...',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    labels: ['Receipts'],
  },
  {
    id: 'm5',
    from: { name: 'Design Team', email: 'design@company.com' },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'New Brand Guidelines Published',
    preview: 'The updated brand guidelines are now available. Please review the changes and update your...',
    body: 'The updated brand guidelines are now available.\n\nPlease review the changes and update your work accordingly.\n\nKey changes:\n- New color palette\n- Updated typography\n- Logo usage guidelines\n\nView the full guidelines: https://...',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRead: true,
    isStarred: true,
    hasAttachments: true,
    attachments: [
      { id: 'a2', name: 'Brand_Guidelines_2024.pdf', size: '8.1 MB', type: 'document' },
      { id: 'a3', name: 'Logo_Assets.zip', size: '15.2 MB', type: 'archive' },
    ],
    labels: ['Design'],
  },
];

// Helper functions
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Gmail Component
const GmailInterface = ({
  messages,
  view,
  theme,
  composeData,
}: {
  messages: EmailMessage[];
  view: EmailView;
  theme: EmailTheme;
  composeData?: { to: string; cc?: string; subject: string; body: string };
}) => {
  const [_selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  void _selectedMessage;
  void view;
  void composeData;

  const isDark = theme === 'dark';

  return (
    <div className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-700 bg-[#202124]' : 'border-gray-200 bg-white'}`}>
      {/* Gmail Header */}
      <div className={`flex items-center gap-4 border-b px-4 py-3 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <Mail className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
          <span className={`text-xl font-normal ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Gmail</span>
        </div>
        <div className={`mx-8 flex flex-1 items-center gap-3 rounded-full px-4 py-2 ${isDark ? 'bg-[#303134]' : 'bg-gray-100'}`}>
          <Search className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Search mail</span>
        </div>
        <div className="flex items-center gap-3">
          <Settings className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
            M
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-56 p-4 ${isDark ? 'bg-[#202124]' : 'bg-white'}`}>
          <button className={`mb-4 flex items-center gap-3 rounded-2xl px-6 py-3 shadow-md ${isDark ? 'bg-[#c2e7ff] text-[#001d35]' : 'bg-[#c2e7ff] text-[#001d35]'}`}>
            <Plus className="h-5 w-5" />
            <span className="font-medium">Compose</span>
          </button>

          <nav className="space-y-1">
            {[
              { icon: Inbox, label: 'Inbox', count: 3, active: true },
              { icon: Star, label: 'Starred', count: 2 },
              { icon: Clock, label: 'Snoozed' },
              { icon: Send, label: 'Sent' },
              { icon: FileText, label: 'Drafts', count: 1 },
              { icon: Trash2, label: 'Trash' },
            ].map(item => (
              <div
                key={item.label}
                className={`flex cursor-pointer items-center gap-4 rounded-r-full px-3 py-2 ${
                  item.active
                    ? isDark ? 'bg-[#d3e3fd] text-[#001d35]' : 'bg-[#d3e3fd] text-[#001d35]'
                    : isDark ? 'text-gray-300 hover:bg-[#303134]' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.count && (
                  <span className="text-sm">{item.count}</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${isDark ? 'bg-[#202124]' : 'bg-white'}`}>
          {view === 'compose' ? (
            <div className={`m-4 rounded-xl shadow-xl ${isDark ? 'bg-[#303134]' : 'bg-white'}`}>
              <div className={`flex items-center justify-between rounded-t-xl px-4 py-2 ${isDark ? 'bg-[#404347]' : 'bg-gray-100'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>New Message</span>
                <div className="flex items-center gap-2">
                  <button className={`rounded p-1 hover:bg-gray-600/30 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>−</button>
                  <button className={`rounded p-1 hover:bg-gray-600/30 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>□</button>
                  <button className={`rounded p-1 hover:bg-gray-600/30 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>×</button>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className={`flex items-center gap-2 border-b pb-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>To</span>
                  <input
                    type="text"
                    defaultValue={composeData?.to || ''}
                    className={`flex-1 text-sm outline-none ${isDark ? 'bg-transparent text-gray-200' : 'bg-transparent text-gray-800'}`}
                  />
                </div>
                <div className={`flex items-center gap-2 border-b pb-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Subject</span>
                  <input
                    type="text"
                    defaultValue={composeData?.subject || ''}
                    className={`flex-1 text-sm outline-none ${isDark ? 'bg-transparent text-gray-200' : 'bg-transparent text-gray-800'}`}
                  />
                </div>
                <textarea
                  className={`h-48 w-full resize-none text-sm outline-none ${isDark ? 'bg-transparent text-gray-200' : 'bg-transparent text-gray-800'}`}
                  defaultValue={composeData?.body || ''}
                />
              </div>
              <div className={`flex items-center justify-between border-t px-4 py-3 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center gap-1">
                  <button className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Send
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Image className="h-5 w-5" />
                  </button>
                  <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Link className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Toolbar */}
              <div className={`flex items-center gap-2 border-b px-4 py-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <input type="checkbox" className="rounded" />
                <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Archive className="h-5 w-5" />
                </button>
                <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <AlertCircle className="h-5 w-5" />
                </button>
                <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className={`mx-2 h-5 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Tag className="h-5 w-5" />
                </button>
                <button className={`rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Email List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2 ${
                      !msg.isRead
                        ? isDark ? 'bg-[#303134]' : 'bg-white'
                        : isDark ? 'bg-[#202124]' : 'bg-gray-50'
                    } ${isDark ? 'hover:bg-[#404347]' : 'hover:bg-gray-100'}`}
                  >
                    <input type="checkbox" className="rounded" />
                    <button className={`p-1 ${msg.isStarred ? 'text-yellow-500' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Star className={`h-5 w-5 ${msg.isStarred ? 'fill-current' : ''}`} />
                    </button>
                    {msg.isImportant && (
                      <Tag className="h-4 w-4 fill-current text-yellow-500" />
                    )}
                    <div className={`w-40 truncate text-sm ${!msg.isRead ? 'font-semibold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {msg.from.name}
                    </div>
                    <div className="flex flex-1 items-center gap-2 truncate">
                      <span className={`text-sm ${!msg.isRead ? 'font-semibold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {msg.subject}
                      </span>
                      <span className={`truncate text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        -
                        {' '}
                        {msg.preview}
                      </span>
                    </div>
                    {msg.hasAttachments && (
                      <Paperclip className={`h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                    <span className={`text-xs whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(msg.date)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Outlook Component
const OutlookInterface = ({
  messages,
  view,
  theme,
  composeData,
}: {
  messages: EmailMessage[];
  view: EmailView;
  theme: EmailTheme;
  composeData?: { to: string; cc?: string; subject: string; body: string };
}) => {
  void view;
  void composeData;
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(messages[0] || null);
  const isDark = theme === 'dark';

  return (
    <div className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-700 bg-[#1f1f1f]' : 'border-gray-200 bg-[#f3f2f1]'}`}>
      {/* Outlook Header */}
      <div className={`flex items-center gap-4 px-4 py-2 ${isDark ? 'bg-[#0078d4]' : 'bg-[#0078d4]'}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 rounded bg-white/20" />
            <div className="h-5 w-5 rounded bg-white/20" />
            <div className="h-5 w-5 rounded bg-white/20" />
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded bg-white/10 px-3 py-1.5">
          <Search className="h-4 w-4 text-white/70" />
          <span className="text-sm text-white/70">Search</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-medium text-white">
          M
        </div>
      </div>

      {/* Ribbon */}
      <div className={`flex items-center gap-4 border-b px-4 py-2 ${isDark ? 'border-gray-700 bg-[#2d2d2d]' : 'border-gray-200 bg-white'}`}>
        <button className={`rounded px-4 py-1.5 text-sm font-medium ${isDark ? 'bg-[#0078d4] text-white' : 'bg-[#0078d4] text-white'}`}>
          New mail
        </button>
        <div className={`h-6 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
        <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Archive className="h-5 w-5" />
        </button>
        <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Trash2 className="h-5 w-5" />
        </button>
        <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Reply className="h-5 w-5" />
        </button>
        <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Forward className="h-5 w-5" />
        </button>
      </div>

      <div className="flex h-[400px]">
        {/* Folder Pane */}
        <div className={`w-48 border-r ${isDark ? 'border-gray-700 bg-[#1f1f1f]' : 'border-gray-200 bg-[#f3f2f1]'}`}>
          <nav className="space-y-1 p-2">
            {[
              { icon: Inbox, label: 'Inbox', count: 3, active: true },
              { icon: FileText, label: 'Drafts' },
              { icon: Send, label: 'Sent Items' },
              { icon: Trash2, label: 'Deleted Items' },
              { icon: Archive, label: 'Archive' },
            ].map(item => (
              <div
                key={item.label}
                className={`flex cursor-pointer items-center gap-2 rounded px-3 py-1.5 ${
                  item.active
                    ? isDark ? 'bg-[#0078d4]/20 text-[#0078d4]' : 'bg-[#0078d4]/10 text-[#0078d4]'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.count && (
                  <span className={`rounded-full px-1.5 text-xs ${isDark ? 'bg-[#0078d4] text-white' : 'bg-[#0078d4] text-white'}`}>
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Message List */}
        <div className={`w-80 overflow-auto border-r ${isDark ? 'border-gray-700 bg-[#1f1f1f]' : 'border-gray-200 bg-white'}`}>
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`cursor-pointer border-b p-3 ${
                selectedMessage?.id === msg.id
                  ? isDark ? 'border-l-4 border-l-[#0078d4] bg-[#0078d4]/20' : 'border-l-4 border-l-[#0078d4] bg-[#0078d4]/10'
                  : isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
              } ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${
                  ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][Math.floor(Math.random() * 4)]
                }`}
                >
                  {getInitials(msg.from.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${!msg.isRead ? 'font-semibold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {msg.from.name}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatDate(msg.date)}
                    </span>
                  </div>
                  <div className={`truncate text-sm ${!msg.isRead ? 'font-semibold' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {msg.subject}
                  </div>
                  <div className={`truncate text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {msg.preview}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reading Pane */}
        <div className={`flex-1 overflow-auto ${isDark ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
          {selectedMessage
            ? (
                <div className="p-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-medium text-white">
                        {getInitials(selectedMessage.from.name)}
                      </div>
                      <div>
                        <div className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {selectedMessage.from.name}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          To:
                          {' '}
                          {selectedMessage.to.map(t => t.email).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Reply className="h-5 w-5" />
                      </button>
                      <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ReplyAll className="h-5 w-5" />
                      </button>
                      <button className={`rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Forward className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <h2 className={`mb-4 text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {selectedMessage.subject}
                  </h2>
                  <div className={`whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedMessage.body}
                  </div>
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className={`mt-4 rounded border p-3 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                      <div className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Attachments (
                        {selectedMessage.attachments.length}
                        )
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedMessage.attachments.map(att => (
                          <div
                            key={att.id}
                            className={`flex items-center gap-2 rounded border px-3 py-2 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}
                          >
                            <FileText className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <div>
                              <div className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{att.name}</div>
                              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{att.size}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            : (
                <div className="flex h-full items-center justify-center">
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Select a message to read</p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

// Apple Mail Component
const AppleMailInterface = ({
  messages,
  view,
  theme,
  composeData,
}: {
  messages: EmailMessage[];
  view: EmailView;
  theme: EmailTheme;
  composeData?: { to: string; cc?: string; subject: string; body: string };
}) => {
  void view;
  void composeData;
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(messages[0] || null);
  const isDark = theme === 'dark';

  return (
    <div className={`overflow-hidden rounded-xl border shadow-lg ${isDark ? 'border-gray-800 bg-[#1e1e1e]' : 'border-gray-200 bg-[#f5f5f5]'}`}>
      {/* Window Controls */}
      <div className={`flex items-center gap-2 px-4 py-3 ${isDark ? 'bg-[#2d2d2d]' : 'bg-[#e8e8e8]'}`}>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2">
          <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
            <ChevronDown className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
            <Archive className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
            <Trash2 className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          <div className={`mx-2 h-4 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
          <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
            <Reply className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
          <button className={`rounded p-1 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
            <Forward className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
        <div className={`flex items-center gap-1 rounded px-2 py-1 ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
          <Search className={`h-3 w-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Search</span>
        </div>
      </div>

      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className={`w-48 border-r ${isDark ? 'border-gray-800 bg-[#252525]' : 'border-gray-200 bg-[#f0f0f0]'}`}>
          <div className="p-2">
            <div className={`mb-2 px-2 text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Favorites
            </div>
            <nav className="space-y-0.5">
              {[
                { icon: Inbox, label: 'Inbox', count: 3, active: true },
                { icon: FileText, label: 'Drafts' },
                { icon: Send, label: 'Sent' },
                { icon: Trash2, label: 'Trash' },
              ].map(item => (
                <div
                  key={item.label}
                  className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 ${
                    item.active
                      ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.count && (
                    <span className={`text-xs ${item.active ? 'text-white/80' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Message List */}
        <div className={`w-72 overflow-auto border-r ${isDark ? 'border-gray-800 bg-[#1e1e1e]' : 'border-gray-200 bg-white'}`}>
          {messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`cursor-pointer border-b p-3 ${
                selectedMessage?.id === msg.id
                  ? isDark ? 'bg-blue-600/20' : 'bg-blue-50'
                  : isDark ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
              } ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <div className="mb-1 flex items-center gap-2">
                {!msg.isRead && (
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                )}
                <span className={`text-sm ${!msg.isRead ? 'font-semibold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {msg.from.name}
                </span>
                <span className={`ml-auto text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formatDate(msg.date)}
                </span>
              </div>
              <div className={`text-sm ${!msg.isRead ? 'font-semibold' : ''} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {msg.subject}
              </div>
              <div className={`truncate text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {msg.preview}
              </div>
              {msg.hasAttachments && (
                <div className="mt-1 flex items-center gap-1">
                  <Paperclip className={`h-3 w-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {msg.attachments?.length}
                    {' '}
                    attachment
                    {(msg.attachments?.length ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message View */}
        <div className={`flex-1 overflow-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
          {selectedMessage
            ? (
                <div className="p-4">
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">
                      {getInitials(selectedMessage.from.name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {selectedMessage.from.name}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {selectedMessage.date.toLocaleString()}
                        </div>
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        To:
                        {' '}
                        {selectedMessage.to.map(t => t.name || t.email).join(', ')}
                      </div>
                    </div>
                  </div>
                  <h2 className={`mb-4 text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {selectedMessage.subject}
                  </h2>
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedMessage.body}
                  </div>
                </div>
              )
            : (
                <div className="flex h-full items-center justify-center">
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No Message Selected</p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function EmailMockupEditor({
  platform = 'gmail',
  view = 'inbox',
  theme = 'light',
  messages = generateMockMessages(),
  composeData,
  variant = 'full',
  onPlatformChange,
  onViewChange,
  onExport,
}: EmailMockupEditorProps) {
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [currentView, setCurrentView] = useState(view);
  const [currentTheme, setCurrentTheme] = useState(theme);

  const handlePlatformChange = (newPlatform: EmailPlatform) => {
    setCurrentPlatform(newPlatform);
    onPlatformChange?.(newPlatform);
  };

  if (variant === 'preview') {
    return (
      <div className="w-full">
        {currentPlatform === 'gmail' && (
          <GmailInterface messages={messages} view={currentView} theme={currentTheme} composeData={composeData} />
        )}
        {currentPlatform === 'outlook' && (
          <OutlookInterface messages={messages} view={currentView} theme={currentTheme} composeData={composeData} />
        )}
        {currentPlatform === 'apple-mail' && (
          <AppleMailInterface messages={messages} view={currentView} theme={currentTheme} composeData={composeData} />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Mail className="h-5 w-5 text-blue-500" />
            Email Mockup Editor
          </h2>
          <button
            onClick={onExport}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Export
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Platform */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Platform:</span>
            <div className="flex gap-1">
              {(['gmail', 'outlook', 'apple-mail'] as EmailPlatform[]).map(p => (
                <button
                  key={p}
                  onClick={() => handlePlatformChange(p)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentPlatform === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {p === 'gmail' ? 'Gmail' : p === 'outlook' ? 'Outlook' : 'Apple Mail'}
                </button>
              ))}
            </div>
          </div>

          {/* View */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
            <div className="flex gap-1">
              {(['inbox', 'compose'] as EmailView[]).map(v => (
                <button
                  key={v}
                  onClick={() => {
                    setCurrentView(v);
                    onViewChange?.(v);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentView === v
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Theme:</span>
            <div className="flex gap-1">
              {(['light', 'dark'] as EmailTheme[]).map(t => (
                <button
                  key={t}
                  onClick={() => setCurrentTheme(t)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentTheme === t
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4">
        {currentPlatform === 'gmail' && (
          <GmailInterface messages={messages} view={currentView} theme={currentTheme} composeData={composeData} />
        )}
        {currentPlatform === 'outlook' && (
          <OutlookInterface messages={messages} view={currentView} theme={currentTheme} composeData={composeData} />
        )}
        {currentPlatform === 'apple-mail' && (
          <AppleMailInterface messages={messages} view={currentView} theme={currentTheme} composeData={composeData} />
        )}
      </div>
    </div>
  );
}
