'use client';

import { Brain, Check, ChevronDown, Info, Lock, Sparkles, Star, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type AIModel = {
  id: string;
  name: string;
  provider: string;
  version: string;
  description: string;
  capabilities: string[];
  contextWindow: number;
  isPremium?: boolean;
  isDefault?: boolean;
  badge?: string;
  icon?: string;
};

export type ModelSelectorProps = {
  variant?: 'dropdown' | 'cards' | 'inline' | 'minimal';
  models?: AIModel[];
  selectedModelId?: string;
  onModelSelect?: (model: AIModel) => void;
  showDescription?: boolean;
  showCapabilities?: boolean;
  showContextWindow?: boolean;
  allowPremium?: boolean;
  platform?: 'chatgpt' | 'claude' | 'gemini' | 'perplexity' | 'generic';
  className?: string;
};

const defaultModels: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    version: '2024-05-13',
    description: 'Most capable GPT-4 model for complex tasks',
    capabilities: ['Vision', 'Code', 'Analysis', 'Creative'],
    contextWindow: 128000,
    isDefault: true,
    badge: 'Recommended',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    version: '2024-04-09',
    description: 'Fast and intelligent for most tasks',
    capabilities: ['Vision', 'Code', 'Analysis'],
    contextWindow: 128000,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    version: '0125',
    description: 'Fast responses for simple tasks',
    capabilities: ['Code', 'Chat'],
    contextWindow: 16385,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    version: '20240229',
    description: 'Most powerful model for complex reasoning',
    capabilities: ['Analysis', 'Code', 'Creative', 'Vision'],
    contextWindow: 200000,
    isPremium: true,
    badge: 'Pro',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    version: '20240229',
    description: 'Balanced performance and speed',
    capabilities: ['Analysis', 'Code', 'Creative', 'Vision'],
    contextWindow: 200000,
    isDefault: true,
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    version: '20240307',
    description: 'Lightning fast for simple tasks',
    capabilities: ['Code', 'Chat', 'Vision'],
    contextWindow: 200000,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    version: '001',
    description: 'Advanced reasoning with massive context',
    capabilities: ['Vision', 'Code', 'Analysis', 'Multimodal'],
    contextWindow: 1000000,
    isDefault: true,
    badge: 'New',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    version: '001',
    description: 'Fast and efficient for most tasks',
    capabilities: ['Vision', 'Code', 'Chat'],
    contextWindow: 1000000,
  },
];

const platformModels: Record<string, string[]> = {
  chatgpt: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  claude: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  gemini: ['gemini-1.5-pro', 'gemini-1.5-flash'],
  perplexity: ['gpt-4o', 'claude-3-sonnet'],
  generic: defaultModels.map(m => m.id),
};

const ModelSelector: React.FC<ModelSelectorProps> = ({
  variant = 'dropdown',
  models = defaultModels,
  selectedModelId,
  onModelSelect,
  showDescription = true,
  showCapabilities = true,
  showContextWindow = false,
  allowPremium = true,
  platform = 'generic',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<AIModel | null>(null);

  // Filter models by platform
  const filteredModels = models.filter(m =>
    platform === 'generic' || platformModels[platform]?.includes(m.id),
  );

  useEffect(() => {
    if (selectedModelId) {
      const model = filteredModels.find(m => m.id === selectedModelId);
      if (model) {
        setSelected(model);
      }
    } else {
      const defaultModel = filteredModels.find(m => m.isDefault) || filteredModels[0];
      if (defaultModel) {
        setSelected(defaultModel);
      }
    }
  }, [selectedModelId, filteredModels]);

  const handleSelect = useCallback((model: AIModel) => {
    if (model.isPremium && !allowPremium) {
      return;
    }
    setSelected(model);
    onModelSelect?.(model);
    setIsOpen(false);
  }, [allowPremium, onModelSelect]);

  const formatContextWindow = (tokens: number): string => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}K`;
    }
    return tokens.toString();
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return <Sparkles size={14} className="text-emerald-500" />;
      case 'anthropic':
        return <Brain size={14} className="text-orange-500" />;
      case 'google':
        return <Zap size={14} className="text-blue-500" />;
      default:
        return <Star size={14} className="text-gray-500" />;
    }
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <span>{selected?.name || 'Select Model'}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {filteredModels.map(model => (
              <button
                key={model.id}
                onClick={() => handleSelect(model)}
                disabled={model.isPremium && !allowPremium}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selected?.id === model.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                } ${model.isPremium && !allowPremium ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <span>{model.name}</span>
                {selected?.id === model.id && <Check size={12} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-500 dark:text-gray-400">Model:</span>
        <div className="flex flex-wrap items-center gap-1">
          {filteredModels.map(model => (
            <button
              key={model.id}
              onClick={() => handleSelect(model)}
              disabled={model.isPremium && !allowPremium}
              className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs transition-all ${
                selected?.id === model.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
              } ${model.isPremium && !allowPremium ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {getProviderIcon(model.provider)}
              <span>{model.name}</span>
              {model.isPremium && <Lock size={10} className="text-yellow-500" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Cards variant
  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {filteredModels.map(model => (
          <button
            key={model.id}
            onClick={() => handleSelect(model)}
            disabled={model.isPremium && !allowPremium}
            className={`rounded-xl border p-4 text-left transition-all ${
              selected?.id === model.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-900/20'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
            } ${model.isPremium && !allowPremium ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getProviderIcon(model.provider)}
                <span className="font-medium text-gray-800 dark:text-gray-200">{model.name}</span>
              </div>
              {model.badge && (
                <span className={`rounded px-1.5 py-0.5 text-xs ${
                  model.badge === 'Pro'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : model.badge === 'New'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}
                >
                  {model.badge}
                </span>
              )}
            </div>

            {showDescription && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                {model.description}
              </p>
            )}

            {showCapabilities && (
              <div className="mb-2 flex flex-wrap gap-1">
                {model.capabilities.slice(0, 3).map(cap => (
                  <span
                    key={cap}
                    className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            )}

            {showContextWindow && (
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Info size={10} />
                <span>
                  {formatContextWindow(model.contextWindow)}
                  {' '}
                  tokens
                </span>
              </div>
            )}

            {selected?.id === model.id && (
              <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                <Check size={12} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
      >
        <div className="flex items-center gap-2">
          {selected && getProviderIcon(selected.provider)}
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {selected?.name || 'Select a model'}
          </span>
          {selected?.badge && (
            <span className={`rounded px-1.5 py-0.5 text-xs ${
              selected.badge === 'Pro'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : selected.badge === 'New'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
            >
              {selected.badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {filteredModels.map(model => (
            <button
              key={model.id}
              onClick={() => handleSelect(model)}
              disabled={model.isPremium && !allowPremium}
              className={`flex w-full items-start gap-3 border-b border-gray-100 p-3 text-left last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                selected?.id === model.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              } ${model.isPremium && !allowPremium ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="mt-0.5">
                {getProviderIcon(model.provider)}
              </div>
              <div className="flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {model.name}
                  </span>
                  {model.badge && (
                    <span className={`rounded px-1.5 py-0.5 text-xs ${
                      model.badge === 'Pro'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : model.badge === 'New'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                    >
                      {model.badge}
                    </span>
                  )}
                  {model.isPremium && !allowPremium && (
                    <Lock size={12} className="text-yellow-500" />
                  )}
                </div>
                {showDescription && (
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    {model.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {showCapabilities && (
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.slice(0, 3).map(cap => (
                        <span
                          key={cap}
                          className="rounded bg-gray-100 px-1 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}
                  {showContextWindow && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatContextWindow(model.contextWindow)}
                    </span>
                  )}
                </div>
              </div>
              {selected?.id === model.id && (
                <Check size={16} className="mt-0.5 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
