'use client';

import { useCallback, useEffect, useState } from 'react';

type TutorialStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to MockFlow!',
    description: 'Create stunning mockups for chat apps, AI interfaces, and social media posts in minutes. Let us show you around.',
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'platform',
    title: 'Choose Your Platform',
    description: 'Select from WhatsApp, iMessage, Discord, Slack, and more. Each platform has its own authentic look and feel.',
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 'customize',
    title: 'Customize Your Mockup',
    description: 'Add participants, write messages, set timestamps, and adjust the appearance with light/dark mode, custom colors, and more.',
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 'templates',
    title: 'Start with Templates',
    description: 'Use pre-built conversation templates for common scenarios like customer support, team chats, and social conversations.',
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    id: 'export',
    title: 'Export & Share',
    description: 'Export your mockups as PNG, JPG, SVG, or PDF. Add device frames for extra polish, then share with your team or clients.',
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Pro Tip: Keyboard Shortcuts',
    description: 'Press Shift+? anytime to see keyboard shortcuts. Use Ctrl+S to save, Ctrl+E to export, and Ctrl+Z to undo.',
    icon: (
      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
];

type OnboardingTutorialProps = {
  onComplete: () => void;
  onSkip: () => void;
};

export function OnboardingTutorial({ onComplete, onSkip }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = useCallback(() => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
      onComplete();
    }
  }, [currentStep, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    onSkip();
  }, [onSkip]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, handleSkip]);

  if (!isVisible) {
    return null;
  }

  const step = tutorialSteps[currentStep];
  if (!step) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {step.icon}
          </div>

          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            {step.title}
          </h2>

          {/* Description */}
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            {step.description}
          </p>

          {/* Step Indicators */}
          <div className="mb-8 flex justify-center gap-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`size-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-blue-600'
                    : index < currentStep
                      ? 'bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Skip tutorial
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="border-t border-gray-200 bg-gray-50 px-8 py-3 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/50">
          Use arrow keys to navigate, Esc to skip
        </div>
      </div>
    </div>
  );
}

// Hook to manage onboarding state
const ONBOARDING_KEY = 'mockflow-onboarding-completed';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompleted = localStorage.getItem(ONBOARDING_KEY);
    setShowOnboarding(!hasCompleted);
    setIsLoaded(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  }, []);

  return {
    showOnboarding: isLoaded && showOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}
