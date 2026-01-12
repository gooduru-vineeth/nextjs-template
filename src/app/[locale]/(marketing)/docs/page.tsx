import Link from 'next/link';

const features = [
  {
    title: 'Chat Platforms',
    description: 'Create mockups for WhatsApp, iMessage, Discord, Telegram, Messenger, and Slack',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Device Frames',
    description: 'Export with iPhone, Android, MacBook, or browser frames',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Multiple Export Formats',
    description: 'Export as PNG, JPG, SVG, or PDF with customizable resolution',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    title: 'Rich Message Editor',
    description: 'Add emojis, text formatting, replies, and message statuses',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: 'Bulk Import',
    description: 'Import conversations from CSV or JSON files',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    title: 'Auto-Save',
    description: 'Your work is automatically saved as you create',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
  },
];

const quickStartSteps = [
  {
    step: 1,
    title: 'Choose a Platform',
    description: 'Select from WhatsApp, iMessage, Discord, Telegram, Messenger, or Slack to start creating your mockup.',
  },
  {
    step: 2,
    title: 'Add Participants',
    description: 'Set up the conversation participants with names, avatars, and online status.',
  },
  {
    step: 3,
    title: 'Create Messages',
    description: 'Add messages to your conversation with timestamps, statuses, and reactions.',
  },
  {
    step: 4,
    title: 'Customize Appearance',
    description: 'Switch between light/dark themes and toggle display options.',
  },
  {
    step: 5,
    title: 'Select Device Frame',
    description: 'Choose from various device frames including iPhone, Android, or browser windows.',
  },
  {
    step: 6,
    title: 'Export',
    description: 'Download your mockup in PNG, JPG, SVG, or PDF format with your preferred resolution.',
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            MockFlow Documentation
          </h1>
          <p className="mt-4 text-xl text-blue-100">
            Learn how to create stunning chat mockups in minutes
          </p>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Quick Start Guide
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickStartSteps.map(item => (
            <div
              key={item.step}
              className="rounded-xl border border-gray-200 p-6 dark:border-gray-700"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Start Creating
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Features
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-700"
              >
                <div className="mb-4 text-blue-600">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Platforms Section */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Supported Platforms
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Chat Applications */}
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">💬</span>
              Chat Applications
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-lg">📱</span>
                <div>
                  <span className="font-medium">WhatsApp</span>
                  <span className="ml-2 text-sm text-gray-500">Light & Dark modes</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-lg">💭</span>
                <div>
                  <span className="font-medium">iMessage</span>
                  <span className="ml-2 text-sm text-gray-500">iOS style bubbles</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-100 text-lg">🎮</span>
                <div>
                  <span className="font-medium">Discord</span>
                  <span className="ml-2 text-sm text-gray-500">Server & DM layouts</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-sky-100 text-lg">✈️</span>
                <div>
                  <span className="font-medium">Telegram</span>
                  <span className="ml-2 text-sm text-gray-500">Secret chat support</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-lg">💬</span>
                <div>
                  <span className="font-medium">Messenger</span>
                  <span className="ml-2 text-sm text-gray-500">Facebook Messenger</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-lg">💼</span>
                <div>
                  <span className="font-medium">Slack</span>
                  <span className="ml-2 text-sm text-gray-500">Workspace style</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Device Frames */}
          <div className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <span className="text-2xl">📱</span>
              Device Frames
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-lg">📱</span>
                <div>
                  <span className="font-medium">iPhone 15 Pro</span>
                  <span className="ml-2 text-sm text-gray-500">Dynamic Island</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-lg">📱</span>
                <div>
                  <span className="font-medium">iPhone 14</span>
                  <span className="ml-2 text-sm text-gray-500">Notch design</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-lg">📱</span>
                <div>
                  <span className="font-medium">iPhone SE</span>
                  <span className="ml-2 text-sm text-gray-500">Home button</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-lg">📱</span>
                <div>
                  <span className="font-medium">Google Pixel 8</span>
                  <span className="ml-2 text-sm text-gray-500">Android flagship</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-lg">📱</span>
                <div>
                  <span className="font-medium">Samsung S24</span>
                  <span className="ml-2 text-sm text-gray-500">Galaxy flagship</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-gray-200 text-lg">💻</span>
                <div>
                  <span className="font-medium">MacBook Pro</span>
                  <span className="ml-2 text-sm text-gray-500">Laptop frame</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="flex size-8 items-center justify-center rounded-lg bg-orange-100 text-lg">🌐</span>
                <div>
                  <span className="font-medium">Chrome / Safari</span>
                  <span className="ml-2 text-sm text-gray-500">Browser windows</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export Options Section */}
      <div className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Export Options
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-700">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                PNG
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">PNG Format</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Best for transparency and high quality
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-700">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                JPG
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">JPG Format</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Smaller file size, adjustable quality
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-700">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                SVG
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">SVG Format</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Scalable vector format
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-700">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
                PDF
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">PDF Format</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Document format for printing
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-600 dark:bg-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Resolution Options
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-600">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">1x</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Standard</div>
              </div>
              <div className="flex-1 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/30">
                <div className="text-2xl font-bold text-blue-600">2x</div>
                <div className="text-sm text-blue-500">Retina (Recommended)</div>
              </div>
              <div className="flex-1 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-600">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">3x</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Extra High</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Create Your First Mockup?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Start creating beautiful chat mockups in seconds
          </p>
          <Link
            href="/editor"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-medium text-blue-600 hover:bg-blue-50"
          >
            Open Editor
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
