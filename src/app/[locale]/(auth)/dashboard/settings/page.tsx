'use client';

import { useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ExportFormat = 'png' | 'jpg' | 'svg' | 'pdf';
type ExportQuality = 'standard' | 'high' | 'ultra';

type UserSettings = {
  profile: {
    name: string;
    email: string;
    avatar?: string;
    timezone: string;
    language: string;
  };
  appearance: {
    theme: Theme;
    accentColor: string;
    compactMode: boolean;
  };
  editor: {
    autoSave: boolean;
    autoSaveInterval: number;
    showGrid: boolean;
    snapToGrid: boolean;
    defaultPlatform: string;
  };
  export: {
    defaultFormat: ExportFormat;
    defaultQuality: ExportQuality;
    includeWatermark: boolean;
    defaultDeviceFrame: boolean;
  };
  notifications: {
    emailUpdates: boolean;
    marketingEmails: boolean;
    exportComplete: boolean;
    teamActivity: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    publicProfile: boolean;
  };
};

const defaultSettings: UserSettings = {
  profile: {
    name: 'John Doe',
    email: 'john@example.com',
    timezone: 'America/New_York',
    language: 'en',
  },
  appearance: {
    theme: 'system',
    accentColor: '#3B82F6',
    compactMode: false,
  },
  editor: {
    autoSave: true,
    autoSaveInterval: 30,
    showGrid: false,
    snapToGrid: true,
    defaultPlatform: 'whatsapp',
  },
  export: {
    defaultFormat: 'png',
    defaultQuality: 'high',
    includeWatermark: false,
    defaultDeviceFrame: true,
  },
  notifications: {
    emailUpdates: true,
    marketingEmails: false,
    exportComplete: true,
    teamActivity: true,
  },
  privacy: {
    shareAnalytics: true,
    publicProfile: false,
  },
};

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
];

const accentColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

const platforms = [
  { id: 'whatsapp', name: 'WhatsApp' },
  { id: 'imessage', name: 'iMessage' },
  { id: 'discord', name: 'Discord' },
  { id: 'slack', name: 'Slack' },
  { id: 'telegram', name: 'Telegram' },
  { id: 'messenger', name: 'Messenger' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ) },
    { id: 'appearance', label: 'Appearance', icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ) },
    { id: 'editor', label: 'Editor', icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ) },
    { id: 'export', label: 'Export', icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ) },
    { id: 'notifications', label: 'Notifications', icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ) },
    { id: 'privacy', label: 'Privacy', icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ) },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const updateSettings = <T extends keyof UserSettings>(
    section: T,
    key: keyof UserSettings[T],
    value: UserSettings[T][keyof UserSettings[T]],
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <nav className="w-full lg:w-64">
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Settings</h2>

                  <div className="flex items-center gap-6">
                    <div className="flex size-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {settings.profile.name.charAt(0)}
                    </div>
                    <div>
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Change Avatar
                      </button>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.profile.name}
                        onChange={e => updateSettings('profile', 'name', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={e => updateSettings('profile', 'email', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Timezone
                      </label>
                      <select
                        value={settings.profile.timezone}
                        onChange={e => updateSettings('profile', 'timezone', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        {timezones.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Language
                      </label>
                      <select
                        value={settings.profile.language}
                        onChange={e => updateSettings('profile', 'language', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </label>
                    <div className="flex gap-3">
                      {(['light', 'dark', 'system'] as Theme[]).map(theme => (
                        <button
                          key={theme}
                          onClick={() => updateSettings('appearance', 'theme', theme)}
                          className={`flex-1 rounded-lg border-2 p-4 text-center capitalize transition-colors ${
                            settings.appearance.theme === theme
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                              : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className={`mx-auto mb-2 flex size-10 items-center justify-center rounded-lg ${
                            theme === 'light' ? 'bg-white shadow' : theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-white to-gray-800'
                          }`}
                          >
                            {theme === 'light' && (
                              <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                              </svg>
                            )}
                            {theme === 'dark' && (
                              <svg className="size-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                              </svg>
                            )}
                            {theme === 'system' && (
                              <svg className="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{theme}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accent Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {accentColors.map(color => (
                        <button
                          key={color}
                          onClick={() => updateSettings('appearance', 'accentColor', color)}
                          className={`size-10 rounded-full transition-transform hover:scale-110 ${
                            settings.appearance.accentColor === color ? 'ring-2 ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Compact Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use smaller UI elements</p>
                    </div>
                    <button
                      onClick={() => updateSettings('appearance', 'compactMode', !settings.appearance.compactMode)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        settings.appearance.compactMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        settings.appearance.compactMode ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Editor Settings */}
              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editor Preferences</h2>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Default Platform
                    </label>
                    <select
                      value={settings.editor.defaultPlatform}
                      onChange={e => updateSettings('editor', 'defaultPlatform', e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      {platforms.map(platform => (
                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto-save</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your work</p>
                      </div>
                      <button
                        onClick={() => updateSettings('editor', 'autoSave', !settings.editor.autoSave)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.editor.autoSave ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.editor.autoSave ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>

                    {settings.editor.autoSave && (
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Auto-save Interval (seconds)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          value={settings.editor.autoSaveInterval}
                          onChange={e => updateSettings('editor', 'autoSaveInterval', Number(e.target.value))}
                          className="w-32 rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Show Grid</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Display alignment grid in editor</p>
                      </div>
                      <button
                        onClick={() => updateSettings('editor', 'showGrid', !settings.editor.showGrid)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.editor.showGrid ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.editor.showGrid ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Snap to Grid</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Align elements to grid when moving</p>
                      </div>
                      <button
                        onClick={() => updateSettings('editor', 'snapToGrid', !settings.editor.snapToGrid)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.editor.snapToGrid ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.editor.snapToGrid ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Settings */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Defaults</h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Default Format
                      </label>
                      <select
                        value={settings.export.defaultFormat}
                        onChange={e => updateSettings('export', 'defaultFormat', e.target.value as ExportFormat)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="svg">SVG</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Default Quality
                      </label>
                      <select
                        value={settings.export.defaultQuality}
                        onChange={e => updateSettings('export', 'defaultQuality', e.target.value as ExportQuality)}
                        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="standard">Standard (1x)</option>
                        <option value="high">High (2x)</option>
                        <option value="ultra">Ultra (3x)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Include Watermark</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add MockFlow watermark to exports</p>
                      </div>
                      <button
                        onClick={() => updateSettings('export', 'includeWatermark', !settings.export.includeWatermark)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.export.includeWatermark ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.export.includeWatermark ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Default Device Frame</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Include device frame by default</p>
                      </div>
                      <button
                        onClick={() => updateSettings('export', 'defaultDeviceFrame', !settings.export.defaultDeviceFrame)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.export.defaultDeviceFrame ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.export.defaultDeviceFrame ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'emailUpdates' as const, title: 'Email Updates', desc: 'Receive product updates and announcements' },
                      { key: 'marketingEmails' as const, title: 'Marketing Emails', desc: 'Tips, tutorials, and promotional offers' },
                      { key: 'exportComplete' as const, title: 'Export Complete', desc: 'Get notified when exports finish' },
                      { key: 'teamActivity' as const, title: 'Team Activity', desc: 'Updates from team members' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => updateSettings('notifications', item.key, !settings.notifications[item.key])}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            settings.notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            settings.notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Share Analytics</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Help us improve by sharing usage data</p>
                      </div>
                      <button
                        onClick={() => updateSettings('privacy', 'shareAnalytics', !settings.privacy.shareAnalytics)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.privacy.shareAnalytics ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.privacy.shareAnalytics ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Public Profile</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your profile</p>
                      </div>
                      <button
                        onClick={() => updateSettings('privacy', 'publicProfile', !settings.privacy.publicProfile)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          settings.privacy.publicProfile ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          settings.privacy.publicProfile ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                    <h3 className="mb-4 font-medium text-red-600">Danger Zone</h3>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30">
                        Export All Data
                      </button>
                      <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end border-t border-gray-200 pt-6 dark:border-gray-700">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving && (
                    <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
