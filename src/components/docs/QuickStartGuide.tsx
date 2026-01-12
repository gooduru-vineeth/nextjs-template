'use client';

import Link from 'next/link';
import { useState } from 'react';

type Step = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  image?: string;
};

const defaultSteps: Step[] = [
  {
    id: 'choose-template',
    title: 'Choose a Template',
    description: 'Select from our library of professionally designed templates',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          MockFlow offers a wide variety of templates organized by platform:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Chat apps (WhatsApp, iMessage, Discord, Slack, etc.)
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            AI interfaces (ChatGPT, Claude, Gemini, Perplexity)
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Social media (Instagram, Twitter, LinkedIn, TikTok)
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            App stores (iOS App Store, Google Play)
          </li>
        </ul>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Pro tip:</strong>
            {' '}
            Use the search bar to quickly find templates by platform name or use case.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'customize-content',
    title: 'Customize Your Content',
    description: 'Add messages, profiles, and personalize every detail',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Our editor makes it easy to customize every aspect of your mockup:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Messages</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add, edit, and reorder messages. Customize timestamps, read receipts, and reactions.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Profiles</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload custom avatars, set display names, and configure online status.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Appearance</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Toggle light/dark mode, adjust colors, and customize backgrounds.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Device Frames</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Wrap your mockup in iPhone, Android, or browser frames.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'preview-adjust',
    title: 'Preview and Adjust',
    description: 'See real-time changes as you build your mockup',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          MockFlow provides instant previews so you can see your changes in real-time:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              1
            </span>
            <p className="text-gray-700 dark:text-gray-300">
              The preview pane updates automatically as you type
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              2
            </span>
            <p className="text-gray-700 dark:text-gray-300">
              Use undo/redo (Ctrl+Z / Ctrl+Y) to experiment freely
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              3
            </span>
            <p className="text-gray-700 dark:text-gray-300">
              Toggle between device sizes to see responsive layouts
            </p>
          </li>
        </ul>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Keyboard shortcuts:</strong>
            {' '}
            Press
            <kbd className="rounded bg-white px-1.5 py-0.5 text-xs shadow dark:bg-gray-700">?</kbd>
            {' '}
            at any time to see all available shortcuts.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'export-share',
    title: 'Export and Share',
    description: 'Download in multiple formats or share with your team',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Export your finished mockups in various formats:
        </p>
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Format
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Best For
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              <tr>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  PNG
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  High-quality images with transparency
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  JPG
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  Smaller file sizes for web use
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  SVG
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  Scalable graphics that stay crisp at any size
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  PDF
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  Print-ready documents and presentations
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                  GIF
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  Animated mockups showing interactions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You can also share directly with a link, or save mockups to your dashboard for later.
        </p>
      </div>
    ),
  },
];

type QuickStartGuideProps = {
  steps?: Step[];
  title?: string;
  subtitle?: string;
};

export function QuickStartGuide({
  steps = defaultSteps,
  title = 'Quick Start Guide',
  subtitle = 'Get up and running with MockFlow in just a few minutes',
}: QuickStartGuideProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
          {title}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>

      {/* Steps Navigation */}
      <div className="mb-12">
        <nav className="flex justify-center" aria-label="Progress">
          <ol className="flex items-center space-x-4 sm:space-x-8">
            {steps.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`group flex flex-col items-center ${
                    index === activeStep
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <span
                    className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                      index === activeStep
                        ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-500'
                        : index < activeStep
                          ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-500'
                          : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    {index < activeStep
                      ? (
                          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )
                      : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                  </span>
                  <span className="mt-2 hidden text-sm font-medium sm:block">
                    {step.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`transition-all duration-300 ${
              index === activeStep ? 'block' : 'hidden'
            }`}
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {step.icon}
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            </div>

            <div className="pl-16">{step.content}</div>
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {activeStep < steps.length - 1
            ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Next
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )
            : (
                <Link
                  href="/editor"
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Start Creating
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Link
          href="/docs/tutorials"
          className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            Video Tutorials
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Watch step-by-step video guides for creating different types of mockups.
          </p>
        </Link>

        <Link
          href="/docs/api"
          className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            API Documentation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate mockups programmatically with our REST API.
          </p>
        </Link>

        <Link
          href="/templates"
          className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            Template Gallery
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Browse our collection of ready-to-use templates.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default QuickStartGuide;
