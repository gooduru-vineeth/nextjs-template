'use client';

import { useState } from 'react';

type FontSettings = {
  messageSize: number;
  timestampSize: number;
  nameSize: number;
  headerSize: number;
  scale: number;
};

const defaultSettings: FontSettings = {
  messageSize: 14,
  timestampSize: 11,
  nameSize: 13,
  headerSize: 16,
  scale: 100,
};

const presets: { name: string; settings: FontSettings }[] = [
  {
    name: 'Small',
    settings: { messageSize: 12, timestampSize: 9, nameSize: 11, headerSize: 14, scale: 90 },
  },
  {
    name: 'Default',
    settings: { messageSize: 14, timestampSize: 11, nameSize: 13, headerSize: 16, scale: 100 },
  },
  {
    name: 'Large',
    settings: { messageSize: 16, timestampSize: 12, nameSize: 14, headerSize: 18, scale: 110 },
  },
  {
    name: 'Extra Large',
    settings: { messageSize: 18, timestampSize: 13, nameSize: 16, headerSize: 20, scale: 120 },
  },
];

type FontSizeAdjusterProps = {
  settings?: FontSettings;
  onChange: (settings: FontSettings) => void;
  showAdvanced?: boolean;
};

export function FontSizeAdjuster({
  settings = defaultSettings,
  onChange,
  showAdvanced = false,
}: FontSizeAdjusterProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);

  const handlePresetChange = (preset: typeof presets[0]) => {
    onChange(preset.settings);
  };

  const handleScaleChange = (scale: number) => {
    onChange({ ...settings, scale });
  };

  const handleIndividualChange = (key: keyof FontSettings, value: number) => {
    onChange({ ...settings, [key]: value });
  };

  const currentPreset = presets.find(
    p =>
      p.settings.messageSize === settings.messageSize
      && p.settings.scale === settings.scale,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Font Size</h3>
        <button
          onClick={() => onChange(defaultSettings)}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Quick Presets */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-2">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => handlePresetChange(preset)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentPreset?.name === preset.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Slider */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Overall Scale</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {settings.scale}
            %
          </span>
        </div>
        <input
          type="range"
          min="75"
          max="150"
          value={settings.scale}
          onChange={e => handleScaleChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>75%</span>
          <span>100%</span>
          <span>150%</span>
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <span>Advanced Settings</span>
        <svg
          className={`size-4 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Settings */}
      {isAdvancedOpen && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          {/* Message Size */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Message Text</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.messageSize}
                px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="24"
              value={settings.messageSize}
              onChange={e => handleIndividualChange('messageSize', Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Timestamp Size */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Timestamp</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.timestampSize}
                px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="16"
              value={settings.timestampSize}
              onChange={e => handleIndividualChange('timestampSize', Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Name Size */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Contact Name</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.nameSize}
                px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="20"
              value={settings.nameSize}
              onChange={e => handleIndividualChange('nameSize', Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Header Size */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Header</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.headerSize}
                px
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={settings.headerSize}
              onChange={e => handleIndividualChange('headerSize', Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-1 text-gray-500 dark:text-gray-400" style={{ fontSize: `${settings.nameSize}px` }}>
          John Doe
        </p>
        <p className="mb-1 text-gray-900 dark:text-white" style={{ fontSize: `${settings.messageSize}px` }}>
          This is how your messages will look at this size.
        </p>
        <p className="text-gray-400 dark:text-gray-500" style={{ fontSize: `${settings.timestampSize}px` }}>
          12:34 PM
        </p>
      </div>
    </div>
  );
}

export type { FontSettings };
