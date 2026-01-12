'use client';

import { Eye, EyeOff, Image, RotateCcw, Stamp, Trash2, Type, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type WatermarkSettings = {
  enabled: boolean;
  type: 'text' | 'image';
  text: string;
  imageUrl?: string;
  position: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  opacity: number;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  repeat?: boolean;
  locked?: boolean;
};

export type WatermarkEditorProps = {
  variant?: 'full' | 'compact' | 'inline' | 'preview';
  settings?: WatermarkSettings;
  onChange?: (settings: WatermarkSettings) => void;
  previewSize?: { width: number; height: number };
  className?: string;
};

const defaultSettings: WatermarkSettings = {
  enabled: true,
  type: 'text',
  text: 'PREVIEW',
  position: 'bottom-right',
  opacity: 30,
  scale: 100,
  rotation: 0,
  offsetX: 20,
  offsetY: 20,
  fontFamily: 'sans-serif',
  fontSize: 14,
  fontColor: '#000000',
  repeat: false,
  locked: false,
};

const WatermarkEditor: React.FC<WatermarkEditorProps> = ({
  variant = 'full',
  settings = defaultSettings,
  onChange,
  previewSize = { width: 300, height: 200 },
  className = '',
}) => {
  const [watermark, setWatermark] = useState<WatermarkSettings>(settings);

  useEffect(() => {
    setWatermark(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof WatermarkSettings>(
    key: K,
    value: WatermarkSettings[K],
  ) => {
    const newSettings = { ...watermark, [key]: value };
    setWatermark(newSettings);
    onChange?.(newSettings);
  }, [watermark, onChange]);

  const resetSettings = useCallback(() => {
    setWatermark(defaultSettings);
    onChange?.(defaultSettings);
  }, [onChange]);

  const getPositionStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      transform: `scale(${watermark.scale / 100}) rotate(${watermark.rotation}deg)`,
      opacity: watermark.opacity / 100,
    };

    switch (watermark.position) {
      case 'top-left':
        return { ...base, top: watermark.offsetY, left: watermark.offsetX };
      case 'top-center':
        return { ...base, top: watermark.offsetY, left: '50%', marginLeft: `-${watermark.offsetX}px` };
      case 'top-right':
        return { ...base, top: watermark.offsetY, right: watermark.offsetX };
      case 'center':
        return { ...base, top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${watermark.scale / 100}) rotate(${watermark.rotation}deg)` };
      case 'bottom-left':
        return { ...base, bottom: watermark.offsetY, left: watermark.offsetX };
      case 'bottom-center':
        return { ...base, bottom: watermark.offsetY, left: '50%', marginLeft: `-${watermark.offsetX}px` };
      case 'bottom-right':
      default:
        return { ...base, bottom: watermark.offsetY, right: watermark.offsetX };
    }
  };

  const WatermarkPreview: React.FC = () => (
    <div
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20"
      style={{ width: previewSize.width, height: previewSize.height }}
    >
      {/* Mock content */}
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="mb-2 h-20 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="mb-1 h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Watermark */}
      {watermark.enabled && (
        watermark.repeat
          ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      ...getPositionStyle(),
                      position: 'static',
                      transform: `rotate(${watermark.rotation}deg)`,
                      left: `${(i % 5) * 25}%`,
                      top: `${Math.floor(i / 5) * 25}%`,
                    }}
                  >
                    {watermark.type === 'text'
                      ? (
                          <span
                            style={{
                              fontFamily: watermark.fontFamily,
                              fontSize: `${(watermark.fontSize || 14) * (watermark.scale / 100)}px`,
                              color: watermark.fontColor,
                              opacity: watermark.opacity / 100,
                            }}
                          >
                            {watermark.text}
                          </span>
                        )
                      : watermark.imageUrl
                        ? (
                            <img
                              src={watermark.imageUrl}
                              alt="Watermark"
                              style={{
                                maxWidth: 50 * (watermark.scale / 100),
                                opacity: watermark.opacity / 100,
                              }}
                            />
                          )
                        : null}
                  </div>
                ))}
              </div>
            )
          : (
              <div style={getPositionStyle()} className="pointer-events-none">
                {watermark.type === 'text'
                  ? (
                      <span
                        style={{
                          fontFamily: watermark.fontFamily,
                          fontSize: watermark.fontSize,
                          color: watermark.fontColor,
                        }}
                      >
                        {watermark.text}
                      </span>
                    )
                  : watermark.imageUrl
                    ? (
                        <img
                          src={watermark.imageUrl}
                          alt="Watermark"
                          style={{ maxWidth: 100 }}
                        />
                      )
                    : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-300 dark:bg-gray-600">
                          <Image size={24} className="text-gray-500" />
                        </div>
                      )}
              </div>
            )
      )}
    </div>
  );

  const positions: Array<{ id: WatermarkSettings['position']; label: string }> = [
    { id: 'top-left', label: 'TL' },
    { id: 'top-center', label: 'TC' },
    { id: 'top-right', label: 'TR' },
    { id: 'center', label: 'C' },
    { id: 'bottom-left', label: 'BL' },
    { id: 'bottom-center', label: 'BC' },
    { id: 'bottom-right', label: 'BR' },
  ];

  // Preview variant - just shows the watermark preview
  if (variant === 'preview') {
    return (
      <div className={className}>
        <WatermarkPreview />
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          onClick={() => updateSetting('enabled', !watermark.enabled)}
          className={`rounded-lg p-2 ${
            watermark.enabled
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
          }`}
        >
          <Stamp size={18} />
        </button>
        <input
          type="text"
          value={watermark.text}
          onChange={e => updateSetting('text', e.target.value)}
          placeholder="Watermark text"
          className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
          disabled={!watermark.enabled}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={watermark.opacity}
          onChange={e => updateSetting('opacity', Number(e.target.value))}
          className="w-20"
          disabled={!watermark.enabled}
        />
        <span className="w-8 text-xs text-gray-500">
          {watermark.opacity}
          %
        </span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Toggle and type */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => updateSetting('enabled', !watermark.enabled)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
              watermark.enabled
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
            }`}
          >
            {watermark.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="text-sm">{watermark.enabled ? 'Enabled' : 'Disabled'}</span>
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => updateSetting('type', 'text')}
              className={`rounded p-2 ${
                watermark.type === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Type size={14} />
            </button>
            <button
              onClick={() => updateSetting('type', 'image')}
              className={`rounded p-2 ${
                watermark.type === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Image size={14} />
            </button>
          </div>
        </div>

        {/* Text or image input */}
        {watermark.type === 'text'
          ? (
              <input
                type="text"
                value={watermark.text}
                onChange={e => updateSetting('text', e.target.value)}
                placeholder="Watermark text"
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              />
            )
          : (
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                <Upload size={14} />
                Upload Image
              </button>
            )}

        {/* Opacity slider */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>Opacity</span>
            <span>
              {watermark.opacity}
              %
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={watermark.opacity}
            onChange={e => updateSetting('opacity', Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
          />
        </div>

        {/* Preview */}
        <div className="origin-top-left scale-75">
          <WatermarkPreview />
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Stamp size={18} />
            Watermark Settings
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSetting('enabled', !watermark.enabled)}
              className={`rounded-lg p-2 ${
                watermark.enabled
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
              }`}
            >
              {watermark.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={resetSettings}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <WatermarkPreview />
      </div>

      {/* Type selector */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Type</div>
        <div className="flex gap-2">
          <button
            onClick={() => updateSetting('type', 'text')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 ${
              watermark.type === 'text'
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            <Type size={16} />
            <span className="text-sm">Text</span>
          </button>
          <button
            onClick={() => updateSetting('type', 'image')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 ${
              watermark.type === 'image'
                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
            }`}
          >
            <Image size={16} />
            <span className="text-sm">Image</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        {watermark.type === 'text'
          ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Text</label>
                  <input
                    type="text"
                    value={watermark.text}
                    onChange={e => updateSetting('text', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font</label>
                    <select
                      value={watermark.fontFamily}
                      onChange={e => updateSetting('fontFamily', e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <option value="sans-serif">Sans Serif</option>
                      <option value="serif">Serif</option>
                      <option value="monospace">Monospace</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
                    <input
                      type="number"
                      value={watermark.fontSize}
                      onChange={e => updateSetting('fontSize', Number(e.target.value))}
                      min={8}
                      max={72}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={watermark.fontColor}
                      onChange={e => updateSetting('fontColor', e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded"
                    />
                    <input
                      type="text"
                      value={watermark.fontColor}
                      onChange={e => updateSetting('fontColor', e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            )
          : (
              <div className="space-y-3">
                {watermark.imageUrl
                  ? (
                      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                        <img
                          src={watermark.imageUrl}
                          alt="Watermark"
                          className="h-16 w-16 object-contain"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Watermark image</p>
                          <p className="text-xs text-gray-500">Click to change</p>
                        </div>
                        <button
                          onClick={() => updateSetting('imageUrl', undefined)}
                          className="rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )
                  : (
                      <button className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                        <Upload size={24} />
                        <span className="text-sm">Upload watermark image</span>
                        <span className="text-xs text-gray-400">PNG with transparency recommended</span>
                      </button>
                    )}
              </div>
            )}
      </div>

      {/* Position */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Position</div>
        <div className="grid max-w-[160px] grid-cols-3 gap-2">
          {positions.map(pos => (
            <button
              key={pos.id}
              onClick={() => updateSetting('position', pos.id)}
              className={`rounded p-2 text-xs ${
                watermark.position === pos.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title={pos.id}
            >
              {pos.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Opacity</span>
            <span className="text-xs text-gray-500">
              {watermark.opacity}
              %
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={watermark.opacity}
            onChange={e => updateSetting('opacity', Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Scale</span>
            <span className="text-xs text-gray-500">
              {watermark.scale}
              %
            </span>
          </div>
          <input
            type="range"
            min={25}
            max={200}
            value={watermark.scale}
            onChange={e => updateSetting('scale', Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Rotation</span>
            <span className="text-xs text-gray-500">
              {watermark.rotation}
              °
            </span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            value={watermark.rotation}
            onChange={e => updateSetting('rotation', Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500 dark:bg-gray-700"
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-4 pt-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={watermark.repeat}
              onChange={e => updateSetting('repeat', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Repeat pattern</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={watermark.locked}
              onChange={e => updateSetting('locked', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Lock position</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default WatermarkEditor;
