'use client';

import {
  AlertCircle,
  AtSign,
  Bell,
  CheckCircle,
  ExternalLink,
  Hash,
  Image,
  Link as LinkIcon,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Users,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type SlackChannel = {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount: number;
  description?: string;
  isConnected: boolean;
};

type SlackWorkspace = {
  id: string;
  name: string;
  domain: string;
  icon: string;
  channels: SlackChannel[];
  connectedAt: string;
  botToken: string;
};

type NotificationSetting = {
  event: string;
  label: string;
  description: string;
  enabled: boolean;
  channel?: string;
};

type SlackAppIntegrationProps = {
  variant?: 'full' | 'compact' | 'widget';
  onWorkspaceConnect?: (workspace: SlackWorkspace) => void;
  onWorkspaceDisconnect?: (workspaceId: string) => void;
  onChannelUpdate?: (channelId: string, connected: boolean) => void;
  className?: string;
};

// Mock data
const mockWorkspace: SlackWorkspace = {
  id: 'ws_1',
  name: 'MockFlow Team',
  domain: 'mockflow',
  icon: '🎨',
  connectedAt: '2024-01-10T00:00:00Z',
  botToken: 'xoxb-xxxxx-xxxxx-xxxxx',
  channels: [
    { id: 'ch_1', name: 'general', isPrivate: false, memberCount: 45, isConnected: true },
    { id: 'ch_2', name: 'design-team', isPrivate: false, memberCount: 12, description: 'Design discussions', isConnected: true },
    { id: 'ch_3', name: 'mockups-feed', isPrivate: false, memberCount: 28, description: 'Automatic mockup notifications', isConnected: true },
    { id: 'ch_4', name: 'engineering', isPrivate: false, memberCount: 18, isConnected: false },
    { id: 'ch_5', name: 'secret-project', isPrivate: true, memberCount: 5, isConnected: false },
  ],
};

const mockNotificationSettings: NotificationSetting[] = [
  { event: 'mockup_created', label: 'Mockup Created', description: 'Notify when a new mockup is created', enabled: true, channel: 'mockups-feed' },
  { event: 'mockup_exported', label: 'Mockup Exported', description: 'Notify when a mockup is exported', enabled: false },
  { event: 'mockup_shared', label: 'Mockup Shared', description: 'Notify when a mockup is shared', enabled: true, channel: 'general' },
  { event: 'comment_added', label: 'Comment Added', description: 'Notify when someone comments on a mockup', enabled: true, channel: 'design-team' },
  { event: 'template_published', label: 'Template Published', description: 'Notify when a template is published', enabled: false },
];

export default function SlackAppIntegration({
  variant = 'full',
  onWorkspaceConnect: _onWorkspaceConnect,
  onWorkspaceDisconnect,
  onChannelUpdate,
  className = '',
}: SlackAppIntegrationProps) {
  // onWorkspaceConnect is available for future use when implementing OAuth flow
  void _onWorkspaceConnect;
  const [workspace, setWorkspace] = useState<SlackWorkspace | null>(mockWorkspace);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(mockNotificationSettings);
  const [activeTab, setActiveTab] = useState<'channels' | 'notifications' | 'settings'>('channels');
  const [testMessageChannel, setTestMessageChannel] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleChannelToggle = useCallback((channelId: string) => {
    if (!workspace) {
      return;
    }

    setWorkspace((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        channels: prev.channels.map(ch =>
          ch.id === channelId ? { ...ch, isConnected: !ch.isConnected } : ch,
        ),
      };
    });

    const channel = workspace.channels.find(ch => ch.id === channelId);
    if (channel) {
      onChannelUpdate?.(channelId, !channel.isConnected);
    }
  }, [workspace, onChannelUpdate]);

  const handleNotificationToggle = useCallback((event: string) => {
    setNotifications(prev =>
      prev.map(n => n.event === event ? { ...n, enabled: !n.enabled } : n),
    );
  }, []);

  const handleDisconnect = useCallback(() => {
    if (workspace) {
      onWorkspaceDisconnect?.(workspace.id);
      setWorkspace(null);
    }
  }, [workspace, onWorkspaceDisconnect]);

  const handleSendTestMessage = useCallback(async () => {
    if (!testMessageChannel) {
      return;
    }
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setTestMessageChannel('');
  }, [testMessageChannel]);

  const connectedChannels = workspace?.channels.filter(ch => ch.isConnected) || [];

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A154B]">
              <Hash className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Slack</h3>
          </div>
          {workspace
            ? (
                <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Connected
                </span>
              )
            : (
                <button className="text-sm text-[#4A154B] hover:underline dark:text-purple-400">
                  Connect
                </button>
              )}
        </div>
        {workspace && (
          <>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {workspace.name}
              {' '}
              (
              {connectedChannels.length}
              {' '}
              channels)
            </p>
            <div className="flex flex-wrap gap-2">
              {connectedChannels.slice(0, 3).map(ch => (
                <span key={ch.id} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700">
                  <Hash className="h-3 w-3" />
                  {ch.name}
                </span>
              ))}
              {connectedChannels.length > 3 && (
                <span className="text-xs text-gray-500">
                  +
                  {connectedChannels.length - 3}
                  {' '}
                  more
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#4A154B]">
            <Hash className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Slack</span>
          {workspace && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {workspace ? `${connectedChannels.length} channels connected` : 'Not connected'}
        </p>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4A154B]">
              <Hash className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Slack Integration</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect your workspace to receive notifications</p>
            </div>
          </div>
          {workspace
            ? (
                <button
                  onClick={handleDisconnect}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                  Disconnect
                </button>
              )
            : (
                <button className="flex items-center gap-2 rounded-lg bg-[#4A154B] px-4 py-2 text-white hover:bg-[#3a1039]">
                  <Plus className="h-4 w-4" />
                  Add to Slack
                </button>
              )}
        </div>

        {/* Workspace Info */}
        {workspace && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{workspace.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{workspace.name}</h3>
                  <p className="text-sm text-gray-500">
                    {workspace.domain}
                    .slack.com
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-600 dark:text-gray-400">Connected since</p>
                <p className="text-gray-900 dark:text-white">{new Date(workspace.connectedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      {workspace && (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex px-6">
              {(['channels', 'notifications', 'settings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'border-[#4A154B] text-[#4A154B] dark:border-purple-400 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Channels Tab */}
          {activeTab === 'channels' && (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Connected Channels</h3>
                <button className="flex items-center gap-1 text-sm text-[#4A154B] hover:underline dark:text-purple-400">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
              <div className="space-y-2">
                {workspace.channels.map(channel => (
                  <div
                    key={channel.id}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                      channel.isConnected
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {channel.isPrivate
                        ? (
                            <Lock className="h-5 w-5 text-gray-500" />
                          )
                        : (
                            <Hash className="h-5 w-5 text-gray-500" />
                          )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{channel.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>
                            {channel.memberCount}
                            {' '}
                            members
                          </span>
                          {channel.description && (
                            <>
                              <span>•</span>
                              <span>{channel.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleChannelToggle(channel.id)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        channel.isConnected
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {channel.isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div
                    key={notification.event}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      <Bell className={`mt-0.5 h-5 w-5 ${notification.enabled ? 'text-[#4A154B] dark:text-purple-400' : 'text-gray-400'}`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{notification.label}</h4>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                        {notification.enabled && notification.channel && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            <Hash className="h-3 w-3" />
                            {notification.channel}
                          </span>
                        )}
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notification.enabled}
                        onChange={() => handleNotificationToggle(notification.event)}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#4A154B] peer-focus:ring-4 peer-focus:ring-purple-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-purple-800" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 p-6">
              {/* Test Message */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Test Connection</h3>
                <div className="flex gap-3">
                  <select
                    value={testMessageChannel}
                    onChange={e => setTestMessageChannel(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a channel...</option>
                    {connectedChannels.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        #
                        {ch.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSendTestMessage}
                    disabled={!testMessageChannel || isSending}
                    className="flex items-center gap-2 rounded-lg bg-[#4A154B] px-4 py-2 text-white hover:bg-[#3a1039] disabled:opacity-50"
                  >
                    {isSending
                      ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        )
                      : (
                          <Send className="h-4 w-4" />
                        )}
                    Send Test
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Bot Permissions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MessageSquare, label: 'Send messages', enabled: true },
                    { icon: Image, label: 'Upload files', enabled: true },
                    { icon: AtSign, label: 'Mention users', enabled: true },
                    { icon: LinkIcon, label: 'Unfurl links', enabled: false },
                  ].map((perm, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <perm.icon className={`h-4 w-4 ${perm.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{perm.label}</span>
                      {perm.enabled
                        ? (
                            <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
                          )
                        : (
                            <AlertCircle className="ml-auto h-4 w-4 text-gray-400" />
                          )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <h3 className="mb-3 font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-300">Disconnect Workspace</p>
                    <p className="text-sm text-red-600 dark:text-red-400">Remove all Slack connections</p>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Not Connected State */}
      {!workspace && (
        <div className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4A154B]/10">
            <Hash className="h-8 w-8 text-[#4A154B]" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Connect to Slack</h3>
          <p className="mx-auto mb-6 max-w-sm text-gray-600 dark:text-gray-400">
            Connect your Slack workspace to receive notifications about mockups and collaborate with your team.
          </p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#4A154B] px-6 py-3 font-medium text-white hover:bg-[#3a1039]">
            <Plus className="h-5 w-5" />
            Add to Slack
          </button>
          <a
            href="https://slack.com/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Learn more about Slack apps
            {' '}
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
}

export type { NotificationSetting, SlackAppIntegrationProps, SlackChannel, SlackWorkspace };
