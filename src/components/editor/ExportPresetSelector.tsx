'use client';

import type { ExportPreset } from '@/lib/exportPresets';
import { useMemo, useState } from 'react';
import {
  allPresets,
  createCustomPreset,
  devicePresets,

  getAspectRatio,
  printPresets,
  socialMediaPresets,
  webPresets,
} from '@/lib/exportPresets';

type ExportPresetSelectorProps = {
  selectedPreset?: ExportPreset | null;
  onSelect: (preset: ExportPreset) => void;
  onCustomSize?: (width: number, height: number) => void;
};

type CategoryTab = 'all' | 'social' | 'device' | 'web' | 'print' | 'custom';

export function ExportPresetSelector({
  selectedPreset,
  onSelect,
  onCustomSize,
}: ExportPresetSelectorProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('social');
  const [searchQuery, setSearchQuery] = useState('');
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);

  const filteredPresets = useMemo(() => {
    let presets: ExportPreset[];

    switch (activeTab) {
      case 'social':
        presets = socialMediaPresets;
        break;
      case 'device':
        presets = devicePresets;
        break;
      case 'web':
        presets = webPresets;
        break;
      case 'print':
        presets = printPresets;
        break;
      case 'all':
      default:
        presets = allPresets;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      presets = presets.filter(
        preset =>
          preset.name.toLowerCase().includes(query)
          || preset.platform.toLowerCase().includes(query)
          || preset.description?.toLowerCase().includes(query),
      );
    }

    return presets;
  }, [activeTab, searchQuery]);

  // Group presets by platform
  const groupedPresets = useMemo(() => {
    const groups: Record<string, ExportPreset[]> = {};
    filteredPresets.forEach((preset) => {
      if (!groups[preset.platform]) {
        groups[preset.platform] = [];
      }
      groups[preset.platform]!.push(preset);
    });
    return groups;
  }, [filteredPresets]);

  const handleCustomCreate = () => {
    const preset = createCustomPreset(
      `${customWidth}×${customHeight}`,
      customWidth,
      customHeight,
      'Custom size',
    );
    onSelect(preset);
    onCustomSize?.(customWidth, customHeight);
  };

  const tabs: { id: CategoryTab; label: string; count: number }[] = [
    { id: 'social', label: 'Social', count: socialMediaPresets.length },
    { id: 'device', label: 'Devices', count: devicePresets.length },
    { id: 'web', label: 'Web', count: webPresets.length },
    { id: 'print', label: 'Print', count: printPresets.length },
    { id: 'custom', label: 'Custom', count: 0 },
  ];

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Export Size
        </h3>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search presets..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <svg
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto p-4">
        {activeTab === 'custom' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={e => setCustomWidth(Number(e.target.value))}
                  min={1}
                  max={10000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={e => setCustomHeight(Number(e.target.value))}
                  min={1}
                  max={10000}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Aspect Ratio</span>
                <span className="font-medium">
                  {getAspectRatio({ width: customWidth, height: customHeight } as ExportPreset)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Total Pixels</span>
                <span className="font-medium">
                  {(customWidth * customHeight).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Common Custom Presets */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Sizes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { w: 1920, h: 1080, label: '1080p' },
                  { w: 2560, h: 1440, label: '1440p' },
                  { w: 3840, h: 2160, label: '4K' },
                  { w: 800, h: 600, label: '4:3' },
                  { w: 1000, h: 1000, label: 'Square' },
                  { w: 1080, h: 1920, label: '9:16' },
                ].map(size => (
                  <button
                    key={`${size.w}x${size.h}`}
                    type="button"
                    onClick={() => {
                      setCustomWidth(size.w);
                      setCustomHeight(size.h);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {size.label}
                    {' '}
                    (
                    {size.w}
                    ×
                    {size.h}
                    )
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCustomCreate}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Apply Custom Size
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPresets).map(([platform, presets]) => (
              <div key={platform}>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {platform}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelect(preset)}
                      className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                        selectedPreset?.id === preset.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                          <PresetIcon preset={preset} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            selectedPreset?.id === preset.id
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                          >
                            {preset.name}
                          </p>
                          {preset.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {preset.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {preset.width}
                          {' '}
                          ×
                          {preset.height}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getAspectRatio(preset)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {filteredPresets.length === 0 && (
              <div className="py-8 text-center">
                <svg
                  className="mx-auto mb-3 size-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No presets found for &quot;
                  {searchQuery}
                  &quot;
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Preset Info */}
      {selectedPreset && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Selected:
                {' '}
                {selectedPreset.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedPreset.width}
                {' '}
                ×
                {selectedPreset.height}
                {' '}
                px (
                {getAspectRatio(selectedPreset)}
                )
              </p>
            </div>
            <div className="flex size-16 items-center justify-center rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
              <div
                className="bg-blue-200 dark:bg-blue-700"
                style={{
                  width: `${Math.min(selectedPreset.width / selectedPreset.height, 1) * 40}px`,
                  height: `${Math.min(selectedPreset.height / selectedPreset.width, 1) * 40}px`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Preset icon component
function PresetIcon({ preset }: { preset: ExportPreset }) {
  // Simple icon based on category/platform
  switch (preset.category) {
    case 'social':
      return (
        <svg className="size-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      );
    case 'device':
      return (
        <svg className="size-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'web':
      return (
        <svg className="size-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'print':
      return (
        <svg className="size-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      );
    default:
      return (
        <svg className="size-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
  }
}

export default ExportPresetSelector;
