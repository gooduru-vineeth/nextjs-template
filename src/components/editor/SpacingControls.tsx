'use client';

import { Link2, Link2Off, Maximize2, MoveHorizontal, MoveVertical, RotateCcw } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type SpacingValues = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type SpacingControlsProps = {
  variant?: 'full' | 'compact' | 'inline' | 'visual';
  padding?: SpacingValues;
  margin?: SpacingValues;
  onPaddingChange?: (padding: SpacingValues) => void;
  onMarginChange?: (margin: SpacingValues) => void;
  showMargin?: boolean;
  showPadding?: boolean;
  unit?: 'px' | 'rem' | 'em' | '%';
  minValue?: number;
  maxValue?: number;
  step?: number;
  presets?: { name: string; padding?: SpacingValues; margin?: SpacingValues }[];
  className?: string;
};

const defaultSpacing: SpacingValues = { top: 0, right: 0, bottom: 0, left: 0 };

const defaultPresets = [
  { name: 'None', padding: { top: 0, right: 0, bottom: 0, left: 0 } },
  { name: 'Small', padding: { top: 8, right: 8, bottom: 8, left: 8 } },
  { name: 'Medium', padding: { top: 16, right: 16, bottom: 16, left: 16 } },
  { name: 'Large', padding: { top: 24, right: 24, bottom: 24, left: 24 } },
  { name: 'XL', padding: { top: 32, right: 32, bottom: 32, left: 32 } },
];

const SpacingControls: React.FC<SpacingControlsProps> = ({
  variant = 'full',
  padding = defaultSpacing,
  margin = defaultSpacing,
  onPaddingChange,
  onMarginChange,
  showMargin = true,
  showPadding = true,
  unit = 'px',
  minValue = 0,
  maxValue = 100,
  step = 1,
  presets = defaultPresets,
  className = '',
}) => {
  const [paddingValues, setPaddingValues] = useState<SpacingValues>(padding);
  const [marginValues, setMarginValues] = useState<SpacingValues>(margin);
  const [paddingLinked, setPaddingLinked] = useState(false);
  const [marginLinked, setMarginLinked] = useState(false);

  useEffect(() => {
    setPaddingValues(padding);
  }, [padding]);

  useEffect(() => {
    setMarginValues(margin);
  }, [margin]);

  const handlePaddingChange = useCallback((key: keyof SpacingValues, value: number) => {
    const newValue = Math.max(minValue, Math.min(maxValue, value));

    if (paddingLinked) {
      const linkedPadding = { top: newValue, right: newValue, bottom: newValue, left: newValue };
      setPaddingValues(linkedPadding);
      onPaddingChange?.(linkedPadding);
    } else {
      const newPadding = { ...paddingValues, [key]: newValue };
      setPaddingValues(newPadding);
      onPaddingChange?.(newPadding);
    }
  }, [paddingValues, paddingLinked, minValue, maxValue, onPaddingChange]);

  const handleMarginChange = useCallback((key: keyof SpacingValues, value: number) => {
    const newValue = Math.max(minValue, Math.min(maxValue, value));

    if (marginLinked) {
      const linkedMargin = { top: newValue, right: newValue, bottom: newValue, left: newValue };
      setMarginValues(linkedMargin);
      onMarginChange?.(linkedMargin);
    } else {
      const newMargin = { ...marginValues, [key]: newValue };
      setMarginValues(newMargin);
      onMarginChange?.(newMargin);
    }
  }, [marginValues, marginLinked, minValue, maxValue, onMarginChange]);

  const resetPadding = useCallback(() => {
    setPaddingValues(defaultSpacing);
    onPaddingChange?.(defaultSpacing);
  }, [onPaddingChange]);

  const resetMargin = useCallback(() => {
    setMarginValues(defaultSpacing);
    onMarginChange?.(defaultSpacing);
  }, [onMarginChange]);

  const applyPreset = useCallback((preset: { name: string; padding?: SpacingValues; margin?: SpacingValues }) => {
    if (preset.padding && showPadding) {
      setPaddingValues(preset.padding);
      onPaddingChange?.(preset.padding);
    }
    if (preset.margin && showMargin) {
      setMarginValues(preset.margin);
      onMarginChange?.(preset.margin);
    }
  }, [showPadding, showMargin, onPaddingChange, onMarginChange]);

  const SpacingInput: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
  }> = ({ label, value, onChange }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-500 uppercase dark:text-gray-400">{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={minValue}
        max={maxValue}
        step={step}
        className="w-14 rounded border border-gray-200 bg-white px-2 py-1 text-center text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
      />
    </div>
  );

  // Visual variant - box model visualization
  if (variant === 'visual') {
    return (
      <div className={`p-4 ${className}`}>
        {/* Presets */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">Presets</div>
          <div className="flex flex-wrap gap-1">
            {presets.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Box Model Visualization */}
        <div className="relative rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
          {/* Margin label */}
          {showMargin && (
            <div className="absolute -top-1 left-2 text-xs font-medium text-orange-600 dark:text-orange-400">
              Margin
            </div>
          )}

          {/* Margin inputs */}
          {showMargin && (
            <>
              <input
                type="number"
                value={marginValues.top}
                onChange={e => handleMarginChange('top', Number(e.target.value))}
                className="absolute top-1 left-1/2 w-10 -translate-x-1/2 border-none bg-transparent text-center text-xs text-orange-700 outline-none dark:text-orange-400"
              />
              <input
                type="number"
                value={marginValues.bottom}
                onChange={e => handleMarginChange('bottom', Number(e.target.value))}
                className="absolute bottom-1 left-1/2 w-10 -translate-x-1/2 border-none bg-transparent text-center text-xs text-orange-700 outline-none dark:text-orange-400"
              />
              <input
                type="number"
                value={marginValues.left}
                onChange={e => handleMarginChange('left', Number(e.target.value))}
                className="absolute top-1/2 left-1 w-10 -translate-y-1/2 border-none bg-transparent text-center text-xs text-orange-700 outline-none dark:text-orange-400"
              />
              <input
                type="number"
                value={marginValues.right}
                onChange={e => handleMarginChange('right', Number(e.target.value))}
                className="absolute top-1/2 right-1 w-10 -translate-y-1/2 border-none bg-transparent text-center text-xs text-orange-700 outline-none dark:text-orange-400"
              />
            </>
          )}

          {/* Padding container */}
          <div className="relative m-4 rounded-md bg-green-100 p-2 dark:bg-green-900/30">
            {/* Padding label */}
            {showPadding && (
              <div className="absolute -top-1 left-2 text-xs font-medium text-green-600 dark:text-green-400">
                Padding
              </div>
            )}

            {/* Padding inputs */}
            {showPadding && (
              <>
                <input
                  type="number"
                  value={paddingValues.top}
                  onChange={e => handlePaddingChange('top', Number(e.target.value))}
                  className="absolute top-1 left-1/2 w-10 -translate-x-1/2 border-none bg-transparent text-center text-xs text-green-700 outline-none dark:text-green-400"
                />
                <input
                  type="number"
                  value={paddingValues.bottom}
                  onChange={e => handlePaddingChange('bottom', Number(e.target.value))}
                  className="absolute bottom-1 left-1/2 w-10 -translate-x-1/2 border-none bg-transparent text-center text-xs text-green-700 outline-none dark:text-green-400"
                />
                <input
                  type="number"
                  value={paddingValues.left}
                  onChange={e => handlePaddingChange('left', Number(e.target.value))}
                  className="absolute top-1/2 left-1 w-10 -translate-y-1/2 border-none bg-transparent text-center text-xs text-green-700 outline-none dark:text-green-400"
                />
                <input
                  type="number"
                  value={paddingValues.right}
                  onChange={e => handlePaddingChange('right', Number(e.target.value))}
                  className="absolute top-1/2 right-1 w-10 -translate-y-1/2 border-none bg-transparent text-center text-xs text-green-700 outline-none dark:text-green-400"
                />
              </>
            )}

            {/* Content area */}
            <div className="m-4 rounded bg-blue-100 p-4 text-center dark:bg-blue-900/30">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Content</span>
            </div>
          </div>
        </div>

        {/* Unit selector */}
        <div className="mt-2 flex items-center justify-end gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Unit:
            {unit}
          </span>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {showPadding && (
          <div className="flex items-center gap-2">
            <Maximize2 size={14} className="text-gray-500" />
            <input
              type="number"
              value={paddingValues.top}
              onChange={e => handlePaddingChange('top', Number(e.target.value))}
              className="w-12 rounded border border-gray-200 bg-white px-1 py-0.5 text-center text-xs dark:border-gray-700 dark:bg-gray-800"
              placeholder="P"
            />
            <button
              onClick={() => setPaddingLinked(!paddingLinked)}
              className={`rounded p-1 ${paddingLinked ? 'text-blue-600' : 'text-gray-400'}`}
            >
              {paddingLinked ? <Link2 size={12} /> : <Link2Off size={12} />}
            </button>
          </div>
        )}
        {showMargin && (
          <div className="flex items-center gap-2">
            <MoveVertical size={14} className="text-gray-500" />
            <input
              type="number"
              value={marginValues.top}
              onChange={e => handleMarginChange('top', Number(e.target.value))}
              className="w-12 rounded border border-gray-200 bg-white px-1 py-0.5 text-center text-xs dark:border-gray-700 dark:bg-gray-800"
              placeholder="M"
            />
            <button
              onClick={() => setMarginLinked(!marginLinked)}
              className={`rounded p-1 ${marginLinked ? 'text-blue-600' : 'text-gray-400'}`}
            >
              {marginLinked ? <Link2 size={12} /> : <Link2Off size={12} />}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showPadding && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">P:</span>
            {(['top', 'right', 'bottom', 'left'] as const).map(key => (
              <input
                key={key}
                type="number"
                value={paddingValues[key]}
                onChange={e => handlePaddingChange(key, Number(e.target.value))}
                className="w-10 rounded border border-gray-200 bg-white px-1 py-0.5 text-center text-xs dark:border-gray-700 dark:bg-gray-800"
                title={key}
              />
            ))}
          </div>
        )}
        {showMargin && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">M:</span>
            {(['top', 'right', 'bottom', 'left'] as const).map(key => (
              <input
                key={key}
                type="number"
                value={marginValues[key]}
                onChange={e => handleMarginChange(key, Number(e.target.value))}
                className="w-10 rounded border border-gray-200 bg-white px-1 py-0.5 text-center text-xs dark:border-gray-700 dark:bg-gray-800"
                title={key}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Presets */}
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quick Presets</div>
        <div className="flex flex-wrap gap-2">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Padding Controls */}
      {showPadding && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Maximize2 size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Padding</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPaddingLinked(!paddingLinked)}
                className={`rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  paddingLinked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`}
                title={paddingLinked ? 'Unlink values' : 'Link values'}
              >
                {paddingLinked ? <Link2 size={14} /> : <Link2Off size={14} />}
              </button>
              <button
                onClick={resetPadding}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Reset padding"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <SpacingInput label="Top" value={paddingValues.top} onChange={v => handlePaddingChange('top', v)} />
            <SpacingInput label="Right" value={paddingValues.right} onChange={v => handlePaddingChange('right', v)} />
            <SpacingInput label="Bottom" value={paddingValues.bottom} onChange={v => handlePaddingChange('bottom', v)} />
            <SpacingInput label="Left" value={paddingValues.left} onChange={v => handlePaddingChange('left', v)} />
          </div>
        </div>
      )}

      {/* Margin Controls */}
      {showMargin && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MoveHorizontal size={16} className="text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Margin</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMarginLinked(!marginLinked)}
                className={`rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  marginLinked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`}
                title={marginLinked ? 'Unlink values' : 'Link values'}
              >
                {marginLinked ? <Link2 size={14} /> : <Link2Off size={14} />}
              </button>
              <button
                onClick={resetMargin}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Reset margin"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <SpacingInput label="Top" value={marginValues.top} onChange={v => handleMarginChange('top', v)} />
            <SpacingInput label="Right" value={marginValues.right} onChange={v => handleMarginChange('right', v)} />
            <SpacingInput label="Bottom" value={marginValues.bottom} onChange={v => handleMarginChange('bottom', v)} />
            <SpacingInput label="Left" value={marginValues.left} onChange={v => handleMarginChange('left', v)} />
          </div>
        </div>
      )}

      {/* Unit display */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Unit:
          {unit}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Range:
          {' '}
          {minValue}
          {' '}
          -
          {' '}
          {maxValue}
        </span>
      </div>
    </div>
  );
};

export default SpacingControls;
