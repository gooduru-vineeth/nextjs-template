'use client';

import { useState } from 'react';

type TroubleshootingItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  steps?: string[];
  relatedLinks?: { label: string; href: string }[];
};

const troubleshootingItems: TroubleshootingItem[] = [
  // Export Issues
  {
    id: 'export-blank',
    category: 'Export Issues',
    question: 'My exported image is blank or incomplete',
    answer: 'This can happen when the mockup hasn\'t fully rendered before export. Try the following solutions:',
    steps: [
      'Wait a few seconds for all images and content to load before exporting',
      'Try refreshing the page and exporting again',
      'Check if any images in your mockup failed to load (look for broken image icons)',
      'Try a different export format (PNG instead of JPG)',
      'Reduce the export resolution if your browser is running low on memory',
    ],
  },
  {
    id: 'export-low-quality',
    category: 'Export Issues',
    question: 'Exported images are blurry or low quality',
    answer: 'Low quality exports are usually caused by resolution settings:',
    steps: [
      'Increase the export resolution to 2x or 3x in the Export panel',
      'Use PNG format for the sharpest results',
      'Avoid using JPG with quality below 80%',
      'Make sure your browser zoom is set to 100%',
    ],
  },
  {
    id: 'export-timeout',
    category: 'Export Issues',
    question: 'Export is taking too long or timing out',
    answer: 'Large or complex mockups can take longer to export:',
    steps: [
      'Try reducing the number of messages in your conversation',
      'Lower the export resolution temporarily',
      'Close other browser tabs to free up memory',
      'Try using a different browser (Chrome recommended)',
      'For GIF/Video exports, reduce the frame count',
    ],
  },
  {
    id: 'export-watermark',
    category: 'Export Issues',
    question: 'How do I remove the watermark from exports?',
    answer: 'Watermarks are included in Free plan exports. To remove them:',
    steps: [
      'Upgrade to Pro, Team, or Enterprise plan',
      'The watermark will be automatically removed on all future exports',
      'Previously exported images will still have watermarks',
    ],
    relatedLinks: [
      { label: 'View pricing plans', href: '/pricing' },
    ],
  },

  // Mockup Issues
  {
    id: 'mockup-not-saving',
    category: 'Mockup Issues',
    question: 'My mockup changes are not being saved',
    answer: 'MockFlow auto-saves your work, but sometimes issues can occur:',
    steps: [
      'Check for the "Saved" indicator in the bottom status bar',
      'Make sure you\'re logged in to your account',
      'Try clicking the "Save Draft" button manually',
      'Check your internet connection',
      'If using incognito mode, auto-save to cloud won\'t work',
    ],
  },
  {
    id: 'mockup-slow',
    category: 'Mockup Issues',
    question: 'The editor is slow or laggy',
    answer: 'Performance issues can be caused by several factors:',
    steps: [
      'Reduce the number of messages in the conversation',
      'Remove unused images or media attachments',
      'Close other browser tabs and applications',
      'Try disabling browser extensions temporarily',
      'Clear your browser cache and cookies',
      'Use Chrome or Edge for best performance',
    ],
  },
  {
    id: 'mockup-images',
    category: 'Mockup Issues',
    question: 'Images are not displaying in my mockup',
    answer: 'Image loading issues can happen for various reasons:',
    steps: [
      'Check that the image URL is accessible and correct',
      'For uploaded images, try re-uploading',
      'Check if your image file size exceeds the limit (10MB)',
      'Try using a different image format (PNG, JPG, WebP)',
      'Check if the image URL requires authentication',
      'For external URLs, ensure they allow cross-origin requests',
    ],
  },
  {
    id: 'mockup-font',
    category: 'Mockup Issues',
    question: 'Fonts look different than expected',
    answer: 'Font rendering varies between systems and browsers:',
    steps: [
      'Make sure the correct platform template is selected',
      'Check if your browser has hardware acceleration enabled',
      'Try a different browser to compare results',
      'For custom fonts, ensure they are properly loaded',
    ],
  },

  // Account Issues
  {
    id: 'account-login',
    category: 'Account Issues',
    question: 'I can\'t log in to my account',
    answer: 'Login issues can be resolved by trying these steps:',
    steps: [
      'Double-check your email address and password',
      'Use the "Forgot Password" link to reset your password',
      'Clear your browser cookies and cache',
      'Try logging in with a different browser',
      'Check if you signed up with Google or GitHub instead',
      'If using 2FA, ensure your authenticator app time is synced',
    ],
    relatedLinks: [
      { label: 'Reset password', href: '/forgot-password' },
      { label: 'Contact support', href: '/contact' },
    ],
  },
  {
    id: 'account-email',
    category: 'Account Issues',
    question: 'I\'m not receiving verification or password reset emails',
    answer: 'Email delivery issues are common. Try these solutions:',
    steps: [
      'Check your spam/junk folder',
      'Add noreply@mockflow.com to your contacts',
      'Wait a few minutes for the email to arrive',
      'Request a new email (there\'s a cooldown period)',
      'Check if your email provider blocks automated emails',
      'Try using a different email address',
    ],
  },
  {
    id: 'account-subscription',
    category: 'Account Issues',
    question: 'My subscription features aren\'t working',
    answer: 'If paid features aren\'t available after subscribing:',
    steps: [
      'Log out and log back in to refresh your session',
      'Wait a few minutes for payment processing',
      'Check your payment method for any issues',
      'Verify your subscription status in Account Settings',
      'Contact support with your payment confirmation',
    ],
    relatedLinks: [
      { label: 'Account settings', href: '/dashboard/settings' },
      { label: 'Contact support', href: '/contact' },
    ],
  },

  // Team & Collaboration
  {
    id: 'team-invite',
    category: 'Team & Collaboration',
    question: 'Team members aren\'t receiving invite emails',
    answer: 'Team invitation issues can be resolved by:',
    steps: [
      'Ask team members to check their spam folder',
      'Verify the email address is correct',
      'Generate a new invite link instead',
      'Ensure you haven\'t exceeded your team member limit',
    ],
  },
  {
    id: 'team-access',
    category: 'Team & Collaboration',
    question: 'Team members can\'t access shared mockups',
    answer: 'Access issues in team workspaces:',
    steps: [
      'Check the mockup\'s sharing settings',
      'Verify the team member has the correct role (Admin, Editor, Viewer)',
      'Ensure the mockup is in a shared workspace folder',
      'Ask the team member to refresh their browser',
      'Check if the mockup is in a different workspace',
    ],
  },

  // Browser & Technical
  {
    id: 'browser-support',
    category: 'Browser & Technical',
    question: 'Which browsers are supported?',
    answer: 'MockFlow works best on modern browsers:',
    steps: [
      'Google Chrome (recommended) - version 90+',
      'Microsoft Edge - version 90+',
      'Mozilla Firefox - version 90+',
      'Safari - version 14+',
      'Internet Explorer is NOT supported',
    ],
  },
  {
    id: 'browser-mobile',
    category: 'Browser & Technical',
    question: 'Can I use MockFlow on mobile devices?',
    answer: 'MockFlow is optimized for desktop use, but has limited mobile support:',
    steps: [
      'Viewing mockups works on mobile browsers',
      'Editing features are limited on small screens',
      'For best experience, use a tablet in landscape mode',
      'Export features may not work on all mobile devices',
      'We recommend using a desktop computer for creating mockups',
    ],
  },
  {
    id: 'browser-cookies',
    category: 'Browser & Technical',
    question: 'I see a message about cookies being disabled',
    answer: 'MockFlow requires cookies for authentication:',
    steps: [
      'Enable cookies in your browser settings',
      'Add mockflow.com to your allowed cookies list',
      'Disable any cookie-blocking browser extensions',
      'Try using incognito/private mode temporarily',
      'Clear existing cookies and try again',
    ],
  },
];

const categories = [...new Set(troubleshootingItems.map(item => item.category))];

export function TroubleshootingGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = troubleshootingItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchQuery
      || item.question.toLowerCase().includes(searchQuery.toLowerCase())
      || item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Troubleshooting Guide
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Find solutions to common issues and problems
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <svg
              className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for issues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-4">
          {filteredItems.length === 0
            ? (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                  <svg
                    className="mx-auto size-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No results found
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )
            : (
                filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left"
                    >
                      <div>
                        <span className="mb-1 block text-xs font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
                          {item.category}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.question}
                        </span>
                      </div>
                      <svg
                        className={`ml-4 size-5 shrink-0 text-gray-500 transition-transform ${
                          expandedItem === item.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {expandedItem === item.id && (
                      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <p className="mb-4 text-gray-600 dark:text-gray-300">{item.answer}</p>

                        {item.steps && (
                          <ol className="mb-4 list-inside list-decimal space-y-2">
                            {item.steps.map((step, index) => (
                              <li key={index} className="text-gray-600 dark:text-gray-300">
                                {step}
                              </li>
                            ))}
                          </ol>
                        )}

                        {item.relatedLinks && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.relatedLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link.href}
                                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                {link.label}
                                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="size-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                Still need help?
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </a>
                <a
                  href="https://discord.gg/mockflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                  </svg>
                  Join Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TroubleshootingGuide;
