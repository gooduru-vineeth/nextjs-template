'use client';

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Types
type WalkthroughStep = {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'input' | 'hover' | 'none';
  actionLabel?: string;
  image?: string;
  videoUrl?: string;
  tips?: string[];
  isOptional?: boolean;
};

type WalkthroughVariant = 'modal' | 'tooltip' | 'spotlight' | 'sidebar';
type WalkthroughStatus = 'idle' | 'active' | 'paused' | 'completed';

type WalkthroughProgress = {
  currentStep: number;
  completedSteps: string[];
  startedAt?: string;
  completedAt?: string;
};

export type InteractiveWalkthroughProps = {
  variant?: WalkthroughVariant;
  steps: WalkthroughStep[];
  progress?: WalkthroughProgress;
  autoStart?: boolean;
  showSkip?: boolean;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  onSkip?: () => void;
  onDismiss?: () => void;
  className?: string;
};

// Default walkthrough steps
const defaultSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MockFlow!',
    description: 'Let\'s take a quick tour to help you create amazing mockups in minutes.',
    position: 'center',
    action: 'none',
    tips: ['You can skip this tour at any time', 'Press ? to see keyboard shortcuts'],
  },
  {
    id: 'create-mockup',
    title: 'Create Your First Mockup',
    description: 'Click the "New Mockup" button to start creating. Choose from various templates or start from scratch.',
    target: '#new-mockup-button',
    position: 'bottom',
    action: 'click',
    actionLabel: 'Click to create',
  },
  {
    id: 'choose-platform',
    title: 'Choose a Platform',
    description: 'Select the platform you want to create a mockup for - iPhone Messages, WhatsApp, AI Chat, and more.',
    target: '#platform-selector',
    position: 'right',
    action: 'click',
  },
  {
    id: 'add-messages',
    title: 'Add Messages',
    description: 'Type your message content here. Use Tab to switch between sender and receiver.',
    target: '#message-input',
    position: 'top',
    action: 'input',
    tips: ['Press Enter to add a new message', 'Use Tab to toggle sender'],
  },
  {
    id: 'customize',
    title: 'Customize Your Mockup',
    description: 'Change colors, add profile pictures, adjust timestamps, and more using the settings panel.',
    target: '#settings-panel',
    position: 'left',
    action: 'hover',
    isOptional: true,
  },
  {
    id: 'export',
    title: 'Export Your Mockup',
    description: 'When you\'re done, export your mockup as PNG, JPG, or PDF. Choose the quality and device frame.',
    target: '#export-button',
    position: 'bottom',
    action: 'click',
    actionLabel: 'Export mockup',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You\'ve completed the tour. Start creating amazing mockups now!',
    position: 'center',
    action: 'none',
    tips: ['Check out our templates for inspiration', 'Join our community for tips and updates'],
  },
];

export default function InteractiveWalkthrough({
  variant = 'modal',
  steps = defaultSteps,
  progress: initialProgress,
  autoStart = false,
  showSkip = true,
  onStepChange,
  onComplete,
  onSkip,
  onDismiss,
  className = '',
}: InteractiveWalkthroughProps) {
  const [status, setStatus] = useState<WalkthroughStatus>(autoStart ? 'active' : 'idle');
  const [currentStep, setCurrentStep] = useState(initialProgress?.currentStep ?? 0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(initialProgress?.completedSteps ?? []),
  );
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Find and highlight target element
  useEffect(() => {
    if (status !== 'active' || !step?.target) {
      setHighlightedElement(null);
      return;
    }

    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status, currentStep, step?.target]);

  const handleNext = useCallback(() => {
    if (step) {
      setCompletedSteps(prev => new Set([...prev, step.id]));
    }

    if (isLastStep) {
      setStatus('completed');
      onComplete?.();
    } else {
      setCurrentStep(prev => prev + 1);
      onStepChange?.(currentStep + 1);
    }
  }, [step, isLastStep, currentStep, onComplete, onStepChange]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      onStepChange?.(currentStep - 1);
    }
  }, [isFirstStep, currentStep, onStepChange]);

  const handleSkip = useCallback(() => {
    setStatus('idle');
    onSkip?.();
  }, [onSkip]);

  const handleDismiss = useCallback(() => {
    setStatus('idle');
    onDismiss?.();
  }, [onDismiss]);

  const handleStart = useCallback(() => {
    setStatus('active');
    setCurrentStep(0);
  }, []);

  // Suppress unused variable warning - available for future use
  void handleStart;

  const handleJumpToStep = useCallback((index: number) => {
    setCurrentStep(index);
    onStepChange?.(index);
  }, [onStepChange]);

  if (status === 'idle') {
    return null;
  }

  if (status === 'completed') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-w-md rounded-xl bg-white p-8 text-center dark:bg-gray-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Tour Complete!</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            You're ready to start creating amazing mockups.
          </p>
          <button
            onClick={handleDismiss}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`fixed top-0 right-0 z-50 flex h-full w-80 flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white">Getting Started</h3>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
            <span>Progress</span>
            <span>
              {currentStep + 1}
              {' '}
              of
              {' '}
              {steps.length}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {steps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => handleJumpToStep(index)}
                className={`w-full rounded-lg p-3 text-left transition-colors ${
                  index === currentStep
                    ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                    : completedSteps.has(s.id)
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    completedSteps.has(s.id)
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                  >
                    {completedSteps.has(s.id) ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <div>
                    <p className={`font-medium ${index === currentStep ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                      {s.title}
                    </p>
                    {index === currentStep && (
                      <p className="mt-1 text-sm text-gray-500">{s.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between border-t border-gray-200 p-4 dark:border-gray-800">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {isLastStep ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Tooltip variant
  if (variant === 'tooltip' && step) {
    const getTooltipPosition = () => {
      if (!highlightedElement) {
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }

      const rect = highlightedElement.getBoundingClientRect();
      const padding = 16;

      switch (step.position) {
        case 'top':
          return { bottom: `calc(100% - ${rect.top - padding}px)`, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' };
        case 'bottom':
          return { top: rect.bottom + padding, left: rect.left + rect.width / 2, transform: 'translateX(-50%)' };
        case 'left':
          return { top: rect.top + rect.height / 2, right: `calc(100% - ${rect.left - padding}px)`, transform: 'translateY(-50%)' };
        case 'right':
          return { top: rect.top + rect.height / 2, left: rect.right + padding, transform: 'translateY(-50%)' };
        default:
          return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      }
    };

    return (
      <>
        {/* Overlay */}
        <div className="fixed inset-0 z-40 bg-black/50" onClick={handleSkip} />

        {/* Spotlight on element */}
        {highlightedElement && (
          <div
            className="pointer-events-none fixed z-40 rounded-lg ring-4 ring-blue-500 ring-offset-4"
            style={{
              top: highlightedElement.getBoundingClientRect().top,
              left: highlightedElement.getBoundingClientRect().left,
              width: highlightedElement.getBoundingClientRect().width,
              height: highlightedElement.getBoundingClientRect().height,
            }}
          />
        )}

        {/* Tooltip */}
        <div
          className={`fixed z-50 w-80 rounded-xl bg-white p-4 shadow-2xl dark:bg-gray-900 ${className}`}
          style={getTooltipPosition() as React.CSSProperties}
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900/30">
                {currentStep + 1}
              </span>
              <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
            </div>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>

          {step.tips && step.tips.length > 0 && (
            <div className="mb-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="mb-1 flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">Tips</span>
              </div>
              <ul className="space-y-1 text-xs text-yellow-600 dark:text-yellow-400">
                {step.tips.map((tip, i) => (
                  <li key={i}>
                    •
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress dots */}
          <div className="mb-4 flex items-center justify-center gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => handleJumpToStep(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === currentStep
                    ? 'bg-blue-600'
                    : completedSteps.has(steps[i]!.id)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            {showSkip && !isLastStep && (
              <button onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-700">
                Skip tour
              </button>
            )}
            <div className="ml-auto flex items-center gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                {isLastStep ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Modal variant (default)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full max-w-lg overflow-hidden rounded-xl bg-white dark:bg-gray-900 ${className}`}>
        {/* Header with progress */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Step
              {currentStep + 1}
              {' '}
              of
              {steps.length}
            </span>
            <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Content */}
        {step && (
          <div className="p-6">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>

            {step.image && (
              <div className="mb-6 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <img src={step.image} alt={step.title} className="w-full" />
              </div>
            )}

            {step.tips && step.tips.length > 0 && (
              <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Pro Tips</span>
                </div>
                <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                  {step.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-blue-400" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-800">
          <div>
            {showSkip && !isLastStep && (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Skip tour
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-1 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { WalkthroughProgress, WalkthroughStatus, WalkthroughStep, WalkthroughVariant };
