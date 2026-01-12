'use client';

import { BookOpen, Briefcase, Check, ChevronDown, Coffee, Heart, Lightbulb, Palette, Smile, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ToneStyle = {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  example?: string;
  color?: string;
};

export type ToneStyleSelectorProps = {
  variant?: 'full' | 'compact' | 'dropdown' | 'cards' | 'inline';
  tones?: ToneStyle[];
  selectedTone?: string;
  onChange?: (tone: ToneStyle) => void;
  showExamples?: boolean;
  showDescriptions?: boolean;
  label?: string;
  className?: string;
};

const defaultTones: ToneStyle[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clear, formal, and business-appropriate',
    icon: <Briefcase size={18} />,
    example: 'I would be happy to assist you with this matter.',
    color: 'blue',
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Friendly, relaxed, and conversational',
    icon: <Coffee size={18} />,
    example: 'Hey! Sure thing, I can help you out with that.',
    color: 'green',
  },
  {
    id: 'enthusiastic',
    name: 'Enthusiastic',
    description: 'Energetic, excited, and upbeat',
    icon: <Zap size={18} />,
    example: 'Absolutely! I\'m thrilled to help you with this!',
    color: 'yellow',
  },
  {
    id: 'empathetic',
    name: 'Empathetic',
    description: 'Understanding, supportive, and warm',
    icon: <Heart size={18} />,
    example: 'I understand how you feel. Let me help you through this.',
    color: 'pink',
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Informative, detailed, and instructive',
    icon: <BookOpen size={18} />,
    example: 'Let me explain this concept step by step.',
    color: 'purple',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Imaginative, playful, and inventive',
    icon: <Lightbulb size={18} />,
    example: 'Picture this: a world where anything is possible...',
    color: 'orange',
  },
  {
    id: 'concise',
    name: 'Concise',
    description: 'Brief, direct, and to the point',
    icon: <Zap size={18} />,
    example: 'Done. Next question?',
    color: 'gray',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, and personable',
    icon: <Smile size={18} />,
    example: 'Great question! I\'d love to help you figure this out.',
    color: 'teal',
  },
];

const defaultColorStyle = { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-600 dark:text-blue-400' };

const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-500', text: 'text-green-600 dark:text-green-400' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-500', text: 'text-pink-600 dark:text-pink-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  gray: { bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-500', text: 'text-gray-600 dark:text-gray-400' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-500', text: 'text-teal-600 dark:text-teal-400' },
};

const ToneStyleSelector: React.FC<ToneStyleSelectorProps> = ({
  variant = 'full',
  tones = defaultTones,
  selectedTone,
  onChange,
  showExamples = true,
  showDescriptions = true,
  label = 'Tone & Style',
  className = '',
}) => {
  const [selected, setSelected] = useState<string>(selectedTone || tones[0]?.id || '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedTone) {
      setSelected(selectedTone);
    }
  }, [selectedTone]);

  const handleSelect = useCallback((tone: ToneStyle) => {
    setSelected(tone.id);
    onChange?.(tone);
    setIsOpen(false);
  }, [onChange]);

  const selectedToneData = tones.find(t => t.id === selected);
  const styles = (selectedToneData?.color && colorStyles[selectedToneData.color]) || defaultColorStyle;

  // Inline variant - horizontal pills
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {label && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
            :
          </span>
        )}
        {tones.map((tone) => {
          const toneStyles = (tone.color && colorStyles[tone.color]) || defaultColorStyle;
          const isSelected = selected === tone.id;
          return (
            <button
              key={tone.id}
              onClick={() => handleSelect(tone)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
                isSelected
                  ? `${toneStyles.bg} ${toneStyles.text} border-2 ${toneStyles.border}`
                  : 'border-2 border-transparent bg-gray-100 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600'
              }`}
            >
              {tone.icon}
              <span>{tone.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-4 py-2.5 transition-all dark:bg-gray-800 ${
            isOpen ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {selectedToneData?.icon}
            <span className="text-gray-800 dark:text-gray-200">{selectedToneData?.name}</span>
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {tones.map(tone => (
              <button
                key={tone.id}
                onClick={() => handleSelect(tone)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selected === tone.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <span className={tone.color ? colorStyles[tone.color]?.text : 'text-gray-600'}>
                  {tone.icon}
                </span>
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{tone.name}</div>
                  {showDescriptions && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{tone.description}</div>
                  )}
                </div>
                {selected === tone.id && <Check size={16} className="text-blue-500" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Cards variant - visual cards
  if (variant === 'cards') {
    return (
      <div className={`${className}`}>
        {label && (
          <div className="mb-4 flex items-center gap-2">
            <Palette size={18} className="text-gray-400" />
            <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {tones.map((tone) => {
            const toneStyles = (tone.color && colorStyles[tone.color]) || defaultColorStyle;
            const isSelected = selected === tone.id;
            return (
              <button
                key={tone.id}
                onClick={() => handleSelect(tone)}
                className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? `${toneStyles.bg} ${toneStyles.border}`
                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check size={16} className={toneStyles.text} />
                  </div>
                )}
                <div className={`mb-2 ${isSelected ? toneStyles.text : 'text-gray-500'}`}>
                  {tone.icon}
                </div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{tone.name}</div>
                {showDescriptions && (
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tone.description}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {selectedToneData && styles && (
            <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs ${styles.bg} ${styles.text}`}>
              {selectedToneData.icon}
              {selectedToneData.name}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {tones.slice(0, 6).map((tone) => {
            const isSelected = selected === tone.id;
            return (
              <button
                key={tone.id}
                onClick={() => handleSelect(tone)}
                className={`rounded-lg p-2 transition-all ${
                  isSelected
                    ? `${tone.color ? colorStyles[tone.color]?.bg : ''} ${tone.color ? colorStyles[tone.color]?.text : ''}`
                    : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                }`}
                title={tone.name}
              >
                {tone.icon}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
          <Palette size={18} />
          {label}
        </h4>
      </div>

      {/* Tone options */}
      <div className="space-y-2 p-4">
        {tones.map((tone) => {
          const toneStyles = (tone.color && colorStyles[tone.color]) || defaultColorStyle;
          const isSelected = selected === tone.id;
          return (
            <button
              key={tone.id}
              onClick={() => handleSelect(tone)}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? `${toneStyles.bg} ${toneStyles.border}`
                  : 'border-gray-100 bg-white hover:border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 ${isSelected ? toneStyles.text : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>
                  {tone.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{tone.name}</span>
                    {isSelected && <Check size={16} className={toneStyles.text} />}
                  </div>
                  {showDescriptions && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{tone.description}</p>
                  )}
                  {showExamples && tone.example && isSelected && (
                    <div className="mt-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 italic dark:text-gray-400">
                        "
                        {tone.example}
                        "
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ToneStyleSelector;
