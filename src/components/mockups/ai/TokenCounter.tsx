'use client';

import { useEffect, useMemo, useState } from 'react';

type AIModel = 'gpt-4' | 'gpt-3.5' | 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku' | 'gemini-pro' | 'gemini-ultra' | 'custom';

type TokenUsage = {
  input: number;
  output: number;
  total: number;
};

type TokenCounterProps = {
  usage: TokenUsage;
  model?: AIModel;
  maxTokens?: number;
  showCost?: boolean;
  showBreakdown?: boolean;
  variant?: 'minimal' | 'compact' | 'detailed' | 'inline';
  animated?: boolean;
  className?: string;
};

// Token costs per 1K tokens (approximate USD)
const tokenCosts: Record<AIModel, { input: number; output: number }> = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'gemini-pro': { input: 0.00025, output: 0.0005 },
  'gemini-ultra': { input: 0.00125, output: 0.00375 },
  'custom': { input: 0, output: 0 },
};

const modelMaxTokens: Record<AIModel, number> = {
  'gpt-4': 128000,
  'gpt-3.5': 16385,
  'claude-3-opus': 200000,
  'claude-3-sonnet': 200000,
  'claude-3-haiku': 200000,
  'gemini-pro': 32760,
  'gemini-ultra': 32760,
  'custom': 100000,
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

const calculateCost = (usage: TokenUsage, model: AIModel): number => {
  const costs = tokenCosts[model];
  return (usage.input / 1000) * costs.input + (usage.output / 1000) * costs.output;
};

export function TokenCounter({
  usage,
  model = 'gpt-4',
  maxTokens: customMaxTokens,
  showCost = false,
  showBreakdown = false,
  variant = 'compact',
  animated = true,
  className = '',
}: TokenCounterProps) {
  const [displayUsage, setDisplayUsage] = useState<TokenUsage>(usage);

  const maxTokens = customMaxTokens || modelMaxTokens[model];
  const percentage = Math.min((usage.total / maxTokens) * 100, 100);
  const cost = useMemo(() => calculateCost(usage, model), [usage, model]);

  // Animate counter changes
  useEffect(() => {
    if (!animated) {
      setDisplayUsage(usage);
      return;
    }

    const startUsage = displayUsage;
    const duration = 300;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);

      setDisplayUsage({
        input: Math.round(startUsage.input + (usage.input - startUsage.input) * eased),
        output: Math.round(startUsage.output + (usage.output - startUsage.output) * eased),
        total: Math.round(startUsage.total + (usage.total - startUsage.total) * eased),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [usage, animated]);

  const getProgressColor = () => {
    if (percentage >= 90) {
      return 'bg-red-500';
    }
    if (percentage >= 70) {
      return 'bg-yellow-500';
    }
    return 'bg-blue-500';
  };

  // Minimal variant - just shows count
  if (variant === 'minimal') {
    return (
      <span className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        {formatNumber(displayUsage.total)}
        {' '}
        tokens
      </span>
    );
  }

  // Inline variant - for chat input
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 ${className}`}>
        <span>{formatNumber(displayUsage.total)}</span>
        <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span>{formatNumber(maxTokens)}</span>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {formatNumber(displayUsage.total)}
              <span className="ml-1 text-gray-400">
                /
                {formatNumber(maxTokens)}
              </span>
            </div>
            {showBreakdown && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(displayUsage.input)}
                {' '}
                in ·
                {formatNumber(displayUsage.output)}
                {' '}
                out
              </div>
            )}
          </div>
        </div>
        {showCost && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            $
            {cost.toFixed(4)}
          </div>
        )}
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Token Usage
        </h4>
        {showCost && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            $
            {cost.toFixed(4)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {formatNumber(displayUsage.total)}
            {' '}
            tokens used
          </span>
          <span>
            {percentage.toFixed(1)}
            %
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-gray-400">
          {formatNumber(maxTokens - usage.total)}
          {' '}
          remaining
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Input</div>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {formatNumber(displayUsage.input)}
            </div>
            {showCost && (
              <div className="text-xs text-gray-400">
                $
                {((displayUsage.input / 1000) * tokenCosts[model].input).toFixed(4)}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Output</div>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              {formatNumber(displayUsage.output)}
            </div>
            {showCost && (
              <div className="text-xs text-gray-400">
                $
                {((displayUsage.output / 1000) * tokenCosts[model].output).toFixed(4)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Token estimator for text input
type TokenEstimatorProps = {
  text: string;
  model?: AIModel;
  showWarning?: boolean;
  warningThreshold?: number;
  className?: string;
};

export function TokenEstimator({
  text,
  model = 'gpt-4',
  showWarning = true,
  warningThreshold = 0.8,
  className = '',
}: TokenEstimatorProps) {
  // Simple estimation: ~4 chars per token for English
  const estimatedTokens = Math.ceil(text.length / 4);
  const maxTokens = modelMaxTokens[model];
  const percentage = (estimatedTokens / maxTokens) * 100;
  const isNearLimit = percentage >= warningThreshold * 100;

  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      <span className={`${isNearLimit ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
        ~
        {formatNumber(estimatedTokens)}
        {' '}
        tokens
      </span>
      {showWarning && isNearLimit && (
        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Near limit
        </span>
      )}
    </div>
  );
}

// Model selector with token info
type ModelSelectorProps = {
  value: AIModel;
  onChange: (model: AIModel) => void;
  showTokenLimit?: boolean;
  showCost?: boolean;
  className?: string;
};

export function ModelSelector({
  value,
  onChange,
  showTokenLimit = true,
  showCost = true,
  className = '',
}: ModelSelectorProps) {
  const models: Array<{ id: AIModel; name: string; provider: string }> = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google' },
  ];

  const selectedModel = models.find(m => m.id === value);

  return (
    <div className={className}>
      <select
        value={value}
        onChange={e => onChange(e.target.value as AIModel)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      >
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
            {' '}
            (
            {model.provider}
            )
          </option>
        ))}
      </select>
      {(showTokenLimit || showCost) && selectedModel && (
        <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {showTokenLimit && (
            <span>
              {formatNumber(modelMaxTokens[value])}
              {' '}
              max tokens
            </span>
          )}
          {showCost && (
            <span>
              $
              {tokenCosts[value].input.toFixed(4)}
              /1K in · $
              {tokenCosts[value].output.toFixed(4)}
              /1K out
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for tracking token usage
export function useTokenUsage(initialUsage: TokenUsage = { input: 0, output: 0, total: 0 }) {
  const [usage, setUsage] = useState<TokenUsage>(initialUsage);

  const addTokens = (input: number, output: number) => {
    setUsage(prev => ({
      input: prev.input + input,
      output: prev.output + output,
      total: prev.total + input + output,
    }));
  };

  const resetUsage = () => {
    setUsage({ input: 0, output: 0, total: 0 });
  };

  return {
    usage,
    addTokens,
    resetUsage,
    setUsage,
  };
}

export type { AIModel, TokenUsage };
