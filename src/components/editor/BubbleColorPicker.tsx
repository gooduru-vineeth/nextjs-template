'use client';

import { useState } from 'react';

type BubbleColors = {
  sent: {
    background: string;
    text: string;
  };
  received: {
    background: string;
    text: string;
  };
};

const platformPresets: Record<string, BubbleColors> = {
  whatsapp: {
    sent: { background: '#dcf8c6', text: '#000000' },
    received: { background: '#ffffff', text: '#000000' },
  },
  whatsapp_dark: {
    sent: { background: '#005c4b', text: '#ffffff' },
    received: { background: '#202c33', text: '#ffffff' },
  },
  imessage: {
    sent: { background: '#007aff', text: '#ffffff' },
    received: { background: '#e5e5ea', text: '#000000' },
  },
  imessage_dark: {
    sent: { background: '#0b84fe', text: '#ffffff' },
    received: { background: '#3a3a3c', text: '#ffffff' },
  },
  messenger: {
    sent: { background: '#0084ff', text: '#ffffff' },
    received: { background: '#f0f0f0', text: '#000000' },
  },
  telegram: {
    sent: { background: '#effdde', text: '#000000' },
    received: { background: '#ffffff', text: '#000000' },
  },
  discord: {
    sent: { background: '#5865f2', text: '#ffffff' },
    received: { background: '#2f3136', text: '#dcddde' },
  },
  slack: {
    sent: { background: '#1264a3', text: '#ffffff' },
    received: { background: '#ffffff', text: '#1d1c1d' },
  },
};

const colorSwatches = [
  '#ffffff',
  '#f3f4f6',
  '#e5e7eb',
  '#d1d5db',
  '#9ca3af',
  '#6b7280',
  '#4b5563',
  '#374151',
  '#1f2937',
  '#000000',
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
  '#fff7ed',
  '#ffedd5',
  '#fed7aa',
  '#fdba74',
  '#fb923c',
  '#f97316',
  '#ea580c',
  '#c2410c',
  '#9a3412',
  '#7c2d12',
  '#fefce8',
  '#fef9c3',
  '#fef08a',
  '#fde047',
  '#facc15',
  '#eab308',
  '#ca8a04',
  '#a16207',
  '#854d0e',
  '#713f12',
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d',
  '#ecfeff',
  '#cffafe',
  '#a5f3fc',
  '#67e8f9',
  '#22d3ee',
  '#06b6d4',
  '#0891b2',
  '#0e7490',
  '#155e75',
  '#164e63',
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
  '#f5f3ff',
  '#ede9fe',
  '#ddd6fe',
  '#c4b5fd',
  '#a78bfa',
  '#8b5cf6',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
  '#4c1d95',
  '#fdf4ff',
  '#fae8ff',
  '#f5d0fe',
  '#f0abfc',
  '#e879f9',
  '#d946ef',
  '#c026d3',
  '#a21caf',
  '#86198f',
  '#701a75',
  '#fdf2f8',
  '#fce7f3',
  '#fbcfe8',
  '#f9a8d4',
  '#f472b6',
  '#ec4899',
  '#db2777',
  '#be185d',
  '#9d174d',
  '#831843',
];

type BubbleColorPickerProps = {
  colors?: BubbleColors;
  onChange: (colors: BubbleColors) => void;
  platform?: string;
};

const defaultColors: BubbleColors = {
  sent: { background: '#007aff', text: '#ffffff' },
  received: { background: '#e5e5ea', text: '#000000' },
};

export function BubbleColorPicker({
  colors = defaultColors,
  onChange,
  platform,
}: BubbleColorPickerProps) {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [activeProperty, setActiveProperty] = useState<'background' | 'text'>('background');

  const handleColorChange = (color: string) => {
    onChange({
      ...colors,
      [activeTab]: {
        ...colors[activeTab],
        [activeProperty]: color,
      },
    });
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = platformPresets[presetKey];
    if (preset) {
      onChange(preset);
    }
  };

  const handleReset = () => {
    if (platform && platformPresets[platform]) {
      onChange(platformPresets[platform]);
    } else {
      onChange(defaultColors);
    }
  };

  const currentColor = colors[activeTab][activeProperty];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Bubble Colors</h3>
        <button
          onClick={handleReset}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Platform Presets */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Platform Presets</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(platformPresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetSelect(key)}
              className="group flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs transition-colors hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
              title={key.replace('_', ' ')}
            >
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: preset.sent.background }}
              />
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: preset.received.background }}
              />
              <span className="text-gray-600 capitalize dark:text-gray-400">
                {key.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bubble Type Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Sent Messages
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Received Messages
        </button>
      </div>

      {/* Property Selection */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveProperty('background')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeProperty === 'background'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <div
            className="size-4 rounded border border-gray-300"
            style={{ backgroundColor: colors[activeTab].background }}
          />
          Background
        </button>
        <button
          onClick={() => setActiveProperty('text')}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            activeProperty === 'text'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <div
            className="size-4 rounded border border-gray-300"
            style={{ backgroundColor: colors[activeTab].text }}
          />
          Text
        </button>
      </div>

      {/* Custom Color Input */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="color"
          value={currentColor}
          onChange={e => handleColorChange(e.target.value)}
          className="size-10 cursor-pointer rounded border-0"
        />
        <input
          type="text"
          value={currentColor}
          onChange={e => handleColorChange(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm uppercase dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Color Swatches */}
      <div className="mb-4 grid grid-cols-10 gap-1">
        {colorSwatches.map(color => (
          <button
            key={color}
            onClick={() => handleColorChange(color)}
            className={`aspect-square rounded transition-transform hover:scale-110 ${
              currentColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <p className="mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">Preview</p>
        <div className="space-y-2">
          {/* Received Message */}
          <div className="flex justify-start">
            <div
              className="max-w-[70%] rounded-2xl rounded-bl-sm px-4 py-2"
              style={{
                backgroundColor: colors.received.background,
                color: colors.received.text,
              }}
            >
              <p className="text-sm">Hey! How are you?</p>
            </div>
          </div>
          {/* Sent Message */}
          <div className="flex justify-end">
            <div
              className="max-w-[70%] rounded-2xl rounded-br-sm px-4 py-2"
              style={{
                backgroundColor: colors.sent.background,
                color: colors.sent.text,
              }}
            >
              <p className="text-sm">I&apos;m doing great, thanks!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { BubbleColors };
