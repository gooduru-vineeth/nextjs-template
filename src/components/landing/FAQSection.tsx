'use client';

import { useState } from 'react';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const defaultFAQs: FAQItem[] = [
  {
    id: 'what-is-mockflow',
    question: 'What is MockFlow?',
    answer:
      'MockFlow is a powerful mockup creation platform that helps you transform screenshots and designs into professional mockups. Create social media posts, app store screenshots, and device frame presentations without any design skills.',
  },
  {
    id: 'free-trial',
    question: 'Is there a free trial?',
    answer:
      'Yes! We offer a generous free tier that includes 10 mockups per month with access to basic templates and device frames. All paid plans also come with a 14-day free trial, no credit card required.',
  },
  {
    id: 'export-formats',
    question: 'What export formats are supported?',
    answer:
      'MockFlow supports multiple export formats including PNG, JPG, SVG, PDF, and animated GIF. Pro users can also export with custom resolutions and access size presets for every major social media platform.',
  },
  {
    id: 'device-frames',
    question: 'What device frames are available?',
    answer:
      'We offer a comprehensive library of device frames including iPhone 15 Pro, iPhone SE, Google Pixel, Samsung Galaxy, MacBook Pro, iMac, and various browser windows (Chrome, Safari, Firefox). New devices are added regularly.',
  },
  {
    id: 'team-collaboration',
    question: 'Can I collaborate with my team?',
    answer:
      'Yes! Our Team plan supports up to 10 team members with shared brand kits, collaborative workspaces, and admin controls. Enterprise customers can contact us for custom team sizes.',
  },
  {
    id: 'api-access',
    question: 'Do you offer API access?',
    answer:
      'Pro and Team plans include API access for programmatic mockup generation. Our REST API allows you to create mockups at scale, integrate with your existing workflows, and automate your design processes.',
  },
  {
    id: 'cancel-subscription',
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. You can cancel your subscription at any time from your account settings. You will continue to have access to your plan features until the end of your billing period.',
  },
  {
    id: 'custom-templates',
    question: 'Can I create custom templates?',
    answer:
      'Yes! All users can save their mockup configurations as templates. Team plan users get additional features like shared templates and the ability to lock certain elements for brand consistency.',
  },
];

type FAQSectionProps = {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
};

export function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Got questions? We\'ve got answers. If you can\'t find what you\'re looking for, feel free to contact our support team.',
  faqs = defaultFAQs,
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="bg-white py-20 lg:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* FAQ Items */}
        <div className="mt-12 divide-y divide-gray-200 dark:divide-gray-700">
          {faqs.map(faq => (
            <div key={faq.id} className="py-6">
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="flex w-full items-start justify-between text-left"
              >
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <span className="ml-6 flex shrink-0 items-center">
                  <svg
                    className={`size-6 text-gray-500 transition-transform duration-200 ${
                      openItems.includes(faq.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`mt-4 overflow-hidden transition-all duration-200 ${
                  openItems.includes(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Our support team is here to help you get the most out of MockFlow.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Support
            </a>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
