'use client';

import { useState } from 'react';

type BlurSettings = {
  enabled: boolean;
  intensity: number;
  blurredMessageIds: string[];
};

type BlurToolProps = {
  settings: BlurSettings;
  onSettingsChange: (settings: BlurSettings) => void;
  messages: { id: string; content: string }[];
};

export function BlurTool({
  settings,
  onSettingsChange,
  messages,
}: BlurToolProps) {
  const [showMessageSelector, setShowMessageSelector] = useState(false);

  const toggleBlurEnabled = () => {
    onSettingsChange({ ...settings, enabled: !settings.enabled });
  };

  const updateIntensity = (intensity: number) => {
    onSettingsChange({ ...settings, intensity });
  };

  const toggleMessageBlur = (messageId: string) => {
    const blurredIds = settings.blurredMessageIds.includes(messageId)
      ? settings.blurredMessageIds.filter(id => id !== messageId)
      : [...settings.blurredMessageIds, messageId];
    onSettingsChange({ ...settings, blurredMessageIds: blurredIds });
  };

  const blurAllMessages = () => {
    onSettingsChange({
      ...settings,
      blurredMessageIds: messages.map(m => m.id),
    });
  };

  const clearAllBlurs = () => {
    onSettingsChange({
      ...settings,
      blurredMessageIds: [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleBlurEnabled}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              settings.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Blur Sensitive Content
          </span>
        </div>
        <svg className="size-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      </div>

      {settings.enabled && (
        <>
          {/* Intensity Slider */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs text-gray-500">
              <span>Blur Intensity</span>
              <span className="font-medium">
                {settings.intensity}
                px
              </span>
            </label>
            <input
              type="range"
              min="3"
              max="20"
              value={settings.intensity}
              onChange={e => updateIntensity(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          {/* Message Selector */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowMessageSelector(!showMessageSelector)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400"
              >
                <span>Select Messages to Blur</span>
                <svg
                  className={`size-4 transition-transform ${showMessageSelector ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <span className="text-xs text-gray-500">
                {settings.blurredMessageIds.length}
                {' '}
                selected
              </span>
            </div>

            {showMessageSelector && (
              <div className="space-y-2">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={blurAllMessages}
                    className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    Blur All
                  </button>
                  <button
                    type="button"
                    onClick={clearAllBlurs}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                  >
                    Clear All
                  </button>
                </div>

                {/* Message List */}
                <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-600">
                  {messages.map(message => (
                    <label
                      key={message.id}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={settings.blurredMessageIds.includes(message.id)}
                        onChange={() => toggleMessageBlur(message.id)}
                        className="size-4 rounded border-gray-300 text-purple-600"
                      />
                      <span className="truncate text-sm text-gray-600 dark:text-gray-400">
                        {message.content.slice(0, 50)}
                        {message.content.length > 50 ? '...' : ''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <p className="text-xs text-gray-500">
            Blurred messages will appear censored in the preview and export. Use this to hide sensitive information like phone numbers, names, or addresses.
          </p>
        </>
      )}
    </div>
  );
}

// Default blur settings
export const defaultBlurSettings: BlurSettings = {
  enabled: false,
  intensity: 8,
  blurredMessageIds: [],
};

// Export types
export type { BlurSettings };
