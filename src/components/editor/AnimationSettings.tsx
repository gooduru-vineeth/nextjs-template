'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type AnimationType
  = | 'none'
    | 'fade'
    | 'slide'
    | 'scale'
    | 'bounce'
    | 'shake'
    | 'pulse'
    | 'rotate'
    | 'flip'
    | 'swing'
    | 'wobble'
    | 'heartbeat'
    | 'typing'
    | 'wave';

export type EasingFunction
  = | 'linear'
    | 'ease'
    | 'ease-in'
    | 'ease-out'
    | 'ease-in-out'
    | 'cubic-bezier';

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

export type AnimationConfig = {
  type: AnimationType;
  duration: number; // in ms
  delay: number; // in ms
  easing: EasingFunction;
  customEasing?: string; // for cubic-bezier
  direction: AnimationDirection;
  iterationCount: number | 'infinite';
  fillMode: AnimationFillMode;
  stagger?: number; // delay between sequential items
};

export type AnimationPreset = {
  id: string;
  name: string;
  description: string;
  config: AnimationConfig;
  category: 'entrance' | 'exit' | 'attention' | 'message' | 'typing' | 'custom';
};

export type AnimationSettingsProps = {
  config: AnimationConfig;
  onChange: (config: AnimationConfig) => void;
  onPreview?: () => void;
  presets?: AnimationPreset[];
  showPreview?: boolean;
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
};

// ============================================================================
// Animation Presets
// ============================================================================

const defaultPresets: AnimationPreset[] = [
  // Entrance animations
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Simple opacity fade',
    config: {
      type: 'fade',
      duration: 300,
      delay: 0,
      easing: 'ease-out',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'forwards',
    },
    category: 'entrance',
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    description: 'Slide from bottom',
    config: {
      type: 'slide',
      duration: 400,
      delay: 0,
      easing: 'ease-out',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'forwards',
    },
    category: 'entrance',
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    description: 'Pop-in scale effect',
    config: {
      type: 'scale',
      duration: 300,
      delay: 0,
      easing: 'cubic-bezier',
      customEasing: '0.175, 0.885, 0.32, 1.275',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'forwards',
    },
    category: 'entrance',
  },
  {
    id: 'bounce-in',
    name: 'Bounce In',
    description: 'Bouncy entrance',
    config: {
      type: 'bounce',
      duration: 600,
      delay: 0,
      easing: 'ease-out',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'forwards',
    },
    category: 'entrance',
  },

  // Attention animations
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Subtle pulsing',
    config: {
      type: 'pulse',
      duration: 1000,
      delay: 0,
      easing: 'ease-in-out',
      direction: 'normal',
      iterationCount: 'infinite',
      fillMode: 'none',
    },
    category: 'attention',
  },
  {
    id: 'shake',
    name: 'Shake',
    description: 'Shake for attention',
    config: {
      type: 'shake',
      duration: 500,
      delay: 0,
      easing: 'ease-in-out',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'none',
    },
    category: 'attention',
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    description: 'Heartbeat pulse',
    config: {
      type: 'heartbeat',
      duration: 1500,
      delay: 0,
      easing: 'ease-in-out',
      direction: 'normal',
      iterationCount: 'infinite',
      fillMode: 'none',
    },
    category: 'attention',
  },
  {
    id: 'wobble',
    name: 'Wobble',
    description: 'Wobbly movement',
    config: {
      type: 'wobble',
      duration: 1000,
      delay: 0,
      easing: 'ease-in-out',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'none',
    },
    category: 'attention',
  },

  // Message animations
  {
    id: 'message-bubble',
    name: 'Message Bubble',
    description: 'iMessage-style bubble',
    config: {
      type: 'scale',
      duration: 250,
      delay: 0,
      easing: 'cubic-bezier',
      customEasing: '0.34, 1.56, 0.64, 1',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'forwards',
      stagger: 50,
    },
    category: 'message',
  },
  {
    id: 'message-slide',
    name: 'Message Slide',
    description: 'WhatsApp-style slide',
    config: {
      type: 'slide',
      duration: 200,
      delay: 0,
      easing: 'ease-out',
      direction: 'normal',
      iterationCount: 1,
      fillMode: 'forwards',
      stagger: 30,
    },
    category: 'message',
  },

  // Typing animations
  {
    id: 'typing-dots',
    name: 'Typing Dots',
    description: 'Classic typing indicator',
    config: {
      type: 'typing',
      duration: 1200,
      delay: 0,
      easing: 'ease-in-out',
      direction: 'normal',
      iterationCount: 'infinite',
      fillMode: 'none',
    },
    category: 'typing',
  },
  {
    id: 'typing-wave',
    name: 'Typing Wave',
    description: 'Wave-style typing',
    config: {
      type: 'wave',
      duration: 1000,
      delay: 0,
      easing: 'ease-in-out',
      direction: 'normal',
      iterationCount: 'infinite',
      fillMode: 'none',
      stagger: 100,
    },
    category: 'typing',
  },
];

// ============================================================================
// Animation CSS Generator
// ============================================================================

export function generateAnimationCSS(config: AnimationConfig): string {
  const keyframes = getKeyframes(config.type);
  const easing = config.easing === 'cubic-bezier' && config.customEasing
    ? `cubic-bezier(${config.customEasing})`
    : config.easing;

  const iterations = config.iterationCount === 'infinite'
    ? 'infinite'
    : config.iterationCount.toString();

  return `
animation: ${config.type}-animation ${config.duration}ms ${easing} ${config.delay}ms ${iterations} ${config.direction} ${config.fillMode};

@keyframes ${config.type}-animation {
${keyframes}
}`.trim();
}

function getKeyframes(type: AnimationType): string {
  const keyframeMap: Record<AnimationType, string> = {
    none: '0%, 100% { opacity: 1; }',
    fade: `0% { opacity: 0; }
  100% { opacity: 1; }`,
    slide: `0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }`,
    scale: `0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }`,
    bounce: `0% { opacity: 0; transform: scale(0.3); }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }`,
    shake: `0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }`,
    pulse: `0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }`,
    rotate: `0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }`,
    flip: `0% { transform: perspective(400px) rotateY(90deg); opacity: 0; }
  40% { transform: perspective(400px) rotateY(-10deg); }
  70% { transform: perspective(400px) rotateY(10deg); }
  100% { transform: perspective(400px) rotateY(0); opacity: 1; }`,
    swing: `20% { transform: rotate(15deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(5deg); }
  80% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }`,
    wobble: `0%, 100% { transform: translateX(0) rotate(0); }
  15% { transform: translateX(-25%) rotate(-5deg); }
  30% { transform: translateX(20%) rotate(3deg); }
  45% { transform: translateX(-15%) rotate(-3deg); }
  60% { transform: translateX(10%) rotate(2deg); }
  75% { transform: translateX(-5%) rotate(-1deg); }`,
    heartbeat: `0%, 100% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }`,
    typing: `0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }`,
    wave: `0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-15px); }`,
  };

  return keyframeMap[type];
}

// ============================================================================
// Sub-Components
// ============================================================================

type PresetSelectorProps = {
  presets: AnimationPreset[];
  currentConfig: AnimationConfig;
  onSelect: (preset: AnimationPreset) => void;
};

function PresetSelector({ presets, currentConfig, onSelect }: PresetSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('entrance');

  const categories = useMemo(() => {
    const cats = new Map<string, AnimationPreset[]>();
    presets.forEach((preset) => {
      const existing = cats.get(preset.category) || [];
      existing.push(preset);
      cats.set(preset.category, existing);
    });
    return cats;
  }, [presets]);

  const categoryLabels: Record<string, string> = {
    entrance: 'Entrance',
    exit: 'Exit',
    attention: 'Attention',
    message: 'Message',
    typing: 'Typing',
    custom: 'Custom',
  };

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
      {Array.from(categories.entries()).map(([category, categoryPresets]) => (
        <div key={category}>
          <button
            onClick={() => setExpandedCategory(
              expandedCategory === category ? null : category,
            )}
            className="flex w-full items-center justify-between border-b px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span>{categoryLabels[category] || category}</span>
            {expandedCategory === category
              ? (
                  <ChevronDown className="h-4 w-4" />
                )
              : (
                  <ChevronRight className="h-4 w-4" />
                )}
          </button>

          {expandedCategory === category && (
            <div className="space-y-1 bg-gray-50 p-2 dark:bg-gray-900/50">
              {categoryPresets.map((preset) => {
                const isActive = preset.config.type === currentConfig.type
                  && preset.config.duration === currentConfig.duration;

                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelect(preset)}
                    className={`
                      w-full rounded p-2 text-left transition-colors
                      ${isActive
                    ? 'border-blue-300 bg-blue-100 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                  >
                    <div className="text-sm font-medium">{preset.name}</div>
                    <div className="text-xs text-gray-500">{preset.description}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type AnimationPreviewBoxProps = {
  config: AnimationConfig;
  onReplay: () => void;
  playing: boolean;
};

function AnimationPreviewBox({ config, onReplay, playing }: AnimationPreviewBoxProps) {
  const animationStyle = useMemo(() => {
    if (!playing || config.type === 'none') {
      return {};
    }

    const easing = config.easing === 'cubic-bezier' && config.customEasing
      ? `cubic-bezier(${config.customEasing})`
      : config.easing;

    const iterations = config.iterationCount === 'infinite'
      ? 'infinite'
      : config.iterationCount;

    return {
      animation: `preview-${config.type} ${config.duration}ms ${easing} ${config.delay}ms ${iterations} ${config.direction} ${config.fillMode}`,
    };
  }, [config, playing]);

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2 dark:bg-gray-700">
        <span className="text-sm font-medium">Preview</span>
        <button
          onClick={onReplay}
          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8 dark:from-gray-800 dark:to-gray-900">
        <style>
          {`
          @keyframes preview-fade {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes preview-slide {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes preview-scale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes preview-bounce {
            0% { opacity: 0; transform: scale(0.3); }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes preview-shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          @keyframes preview-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes preview-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes preview-heartbeat {
            0%, 100% { transform: scale(1); }
            14% { transform: scale(1.3); }
            28% { transform: scale(1); }
            42% { transform: scale(1.3); }
            70% { transform: scale(1); }
          }
          @keyframes preview-wobble {
            0%, 100% { transform: translateX(0) rotate(0); }
            15% { transform: translateX(-25%) rotate(-5deg); }
            30% { transform: translateX(20%) rotate(3deg); }
            45% { transform: translateX(-15%) rotate(-3deg); }
            60% { transform: translateX(10%) rotate(2deg); }
            75% { transform: translateX(-5%) rotate(-1deg); }
          }
          @keyframes preview-typing {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
          @keyframes preview-wave {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-15px); }
          }
        `}
        </style>

        <div
          className="w-48 rounded-2xl bg-blue-500 px-4 py-3 text-white shadow-lg"
          style={animationStyle}
        >
          <p className="text-sm">Hello! This is a preview message.</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AnimationSettings({
  config,
  onChange,
  onPreview,
  presets = defaultPresets,
  showPreview = true,
  variant = 'full',
  className = '',
}: AnimationSettingsProps) {
  const [playing, setPlaying] = useState(false);
  const [showCSSCode, setShowCSSCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePresetSelect = useCallback((preset: AnimationPreset) => {
    onChange(preset.config);
  }, [onChange]);

  const handleConfigChange = useCallback(<K extends keyof AnimationConfig>(
    key: K,
    value: AnimationConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  }, [config, onChange]);

  const handleReplay = useCallback(() => {
    setPlaying(false);
    setTimeout(() => setPlaying(true), 50);
    onPreview?.();
  }, [onPreview]);

  const handleCopyCSS = useCallback(async () => {
    const css = generateAnimationCSS(config);
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [config]);

  const animationTypes: AnimationType[] = [
    'none',
    'fade',
    'slide',
    'scale',
    'bounce',
    'shake',
    'pulse',
    'rotate',
    'flip',
    'swing',
    'wobble',
    'heartbeat',
    'typing',
    'wave',
  ];

  const easingOptions: EasingFunction[] = [
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'cubic-bezier',
  ];

  const directionOptions: AnimationDirection[] = [
    'normal',
    'reverse',
    'alternate',
    'alternate-reverse',
  ];

  const fillModeOptions: AnimationFillMode[] = [
    'none',
    'forwards',
    'backwards',
    'both',
  ];

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <select
          value={config.type}
          onChange={e => handleConfigChange('type', e.target.value as AnimationType)}
          className="rounded border px-2 py-1 text-sm"
        >
          {animationTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <input
            type="number"
            value={config.duration}
            onChange={e => handleConfigChange('duration', Number.parseInt(e.target.value) || 0)}
            className="w-16 rounded border px-2 py-1 text-sm"
            min={0}
            step={50}
          />
          <span className="text-xs text-gray-500">ms</span>
        </div>

        <button
          onClick={handleReplay}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Play className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Animation</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Type</label>
            <select
              value={config.type}
              onChange={e => handleConfigChange('type', e.target.value as AnimationType)}
              className="w-full rounded border px-2 py-1.5 text-sm"
            >
              {animationTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">Duration</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={config.duration}
                onChange={e => handleConfigChange('duration', Number.parseInt(e.target.value) || 0)}
                className="flex-1 rounded border px-2 py-1.5 text-sm"
                min={0}
                step={50}
              />
              <span className="text-xs text-gray-500">ms</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">Easing</label>
            <select
              value={config.easing}
              onChange={e => handleConfigChange('easing', e.target.value as EasingFunction)}
              className="w-full rounded border px-2 py-1.5 text-sm"
            >
              {easingOptions.map(easing => (
                <option key={easing} value={easing}>
                  {easing}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-500">Delay</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={config.delay}
                onChange={e => handleConfigChange('delay', Number.parseInt(e.target.value) || 0)}
                className="flex-1 rounded border px-2 py-1.5 text-sm"
                min={0}
                step={50}
              />
              <span className="text-xs text-gray-500">ms</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReplay}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-sm text-white hover:bg-blue-600"
        >
          <Play className="h-4 w-4" />
          Preview Animation
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">Animation Settings</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCSSCode(!showCSSCode)}
            className={`
              flex items-center gap-1 rounded px-3 py-1 text-sm transition-colors
              ${showCSSCode
      ? 'bg-gray-200 dark:bg-gray-700'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            <Settings className="h-4 w-4" />
            CSS
          </button>

          <button
            onClick={() => onChange({
              type: 'none',
              duration: 300,
              delay: 0,
              easing: 'ease',
              direction: 'normal',
              iterationCount: 1,
              fillMode: 'none',
            })}
            className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Presets */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Presets</h3>
        <PresetSelector
          presets={presets}
          currentConfig={config}
          onSelect={handlePresetSelect}
        />
      </div>

      {/* Custom Settings */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Custom Settings</h3>
        <div className="space-y-4">
          {/* Type & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block flex items-center gap-1 text-xs text-gray-500">
                <Zap className="h-3 w-3" />
                Animation Type
              </label>
              <select
                value={config.type}
                onChange={e => handleConfigChange('type', e.target.value as AnimationType)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {animationTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                Duration (ms)
              </label>
              <input
                type="number"
                value={config.duration}
                onChange={e => handleConfigChange('duration', Number.parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border px-3 py-2"
                min={0}
                step={50}
              />
            </div>
          </div>

          {/* Easing & Delay */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp className="h-3 w-3" />
                Easing
              </label>
              <select
                value={config.easing}
                onChange={e => handleConfigChange('easing', e.target.value as EasingFunction)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {easingOptions.map(easing => (
                  <option key={easing} value={easing}>
                    {easing}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                Delay (ms)
              </label>
              <input
                type="number"
                value={config.delay}
                onChange={e => handleConfigChange('delay', Number.parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border px-3 py-2"
                min={0}
                step={50}
              />
            </div>
          </div>

          {/* Custom Easing */}
          {config.easing === 'cubic-bezier' && (
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Cubic Bezier Values
              </label>
              <input
                type="text"
                value={config.customEasing || '0.4, 0, 0.2, 1'}
                onChange={e => handleConfigChange('customEasing', e.target.value)}
                placeholder="0.4, 0, 0.2, 1"
                className="w-full rounded-lg border px-3 py-2 font-mono text-sm"
              />
            </div>
          )}

          {/* Direction & Iterations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Direction
              </label>
              <select
                value={config.direction}
                onChange={e => handleConfigChange('direction', e.target.value as AnimationDirection)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {directionOptions.map(dir => (
                  <option key={dir} value={dir}>
                    {dir}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block flex items-center gap-1 text-xs text-gray-500">
                <Repeat className="h-3 w-3" />
                Iterations
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={config.iterationCount === 'infinite' ? '' : config.iterationCount}
                  onChange={e => handleConfigChange(
                    'iterationCount',
                    e.target.value ? Number.parseInt(e.target.value) : 1,
                  )}
                  placeholder="∞"
                  disabled={config.iterationCount === 'infinite'}
                  className="flex-1 rounded-lg border px-3 py-2 disabled:bg-gray-100"
                  min={1}
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={config.iterationCount === 'infinite'}
                    onChange={e => handleConfigChange(
                      'iterationCount',
                      e.target.checked ? 'infinite' : 1,
                    )}
                    className="rounded"
                  />
                  ∞
                </label>
              </div>
            </div>
          </div>

          {/* Fill Mode & Stagger */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Fill Mode
              </label>
              <select
                value={config.fillMode}
                onChange={e => handleConfigChange('fillMode', e.target.value as AnimationFillMode)}
                className="w-full rounded-lg border px-3 py-2"
              >
                {fillModeOptions.map(mode => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-500">
                Stagger (ms)
              </label>
              <input
                type="number"
                value={config.stagger || 0}
                onChange={e => handleConfigChange('stagger', Number.parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border px-3 py-2"
                min={0}
                step={10}
                placeholder="Delay between items"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <AnimationPreviewBox
          config={config}
          onReplay={handleReplay}
          playing={playing}
        />
      )}

      {/* CSS Code */}
      {showCSSCode && (
        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between border-b bg-gray-50 px-3 py-2 dark:bg-gray-700">
            <span className="text-sm font-medium">Generated CSS</span>
            <button
              onClick={handleCopyCSS}
              className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <pre className="overflow-x-auto bg-gray-900 p-3 font-mono text-xs text-gray-100">
            {generateAnimationCSS(config)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Utility Hook
// ============================================================================

export function useAnimation(initialConfig?: Partial<AnimationConfig>) {
  const defaultConfig: AnimationConfig = {
    type: 'fade',
    duration: 300,
    delay: 0,
    easing: 'ease-out',
    direction: 'normal',
    iterationCount: 1,
    fillMode: 'forwards',
    ...initialConfig,
  };

  const [config, setConfig] = useState<AnimationConfig>(defaultConfig);
  const [isAnimating, setIsAnimating] = useState(false);

  const play = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 10);
  }, []);

  const stop = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const reset = useCallback(() => {
    setConfig(defaultConfig);
    setIsAnimating(false);
  }, []);

  const getStyle = useCallback((): React.CSSProperties => {
    if (!isAnimating || config.type === 'none') {
      return {};
    }

    const easing = config.easing === 'cubic-bezier' && config.customEasing
      ? `cubic-bezier(${config.customEasing})`
      : config.easing;

    return {
      animation: `${config.type}-anim ${config.duration}ms ${easing} ${config.delay}ms ${
        config.iterationCount
      } ${config.direction} ${config.fillMode}`,
    };
  }, [config, isAnimating]);

  return {
    config,
    setConfig,
    isAnimating,
    play,
    stop,
    reset,
    getStyle,
    css: generateAnimationCSS(config),
  };
}

// ============================================================================
// Exports
// ============================================================================

export { defaultPresets as animationPresets };
export default AnimationSettings;
