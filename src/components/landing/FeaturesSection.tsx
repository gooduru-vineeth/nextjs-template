'use client';

import { useState } from 'react';

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  preview?: React.ReactNode;
};

const defaultFeatures: Feature[] = [
  {
    id: 'social-media',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    title: 'Social Media Mockups',
    description: 'Create stunning mockups for Instagram, Twitter, Facebook, LinkedIn, and more with pixel-perfect templates.',
    color: 'bg-pink-500',
  },
  {
    id: 'app-store',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: 'App Store Screenshots',
    description: 'Generate professional iOS App Store and Google Play screenshots with device frames and marketing text.',
    color: 'bg-blue-500',
  },
  {
    id: 'device-frames',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Device Frames',
    description: 'Wrap your designs in realistic iPhone, Android, MacBook, and browser frames for professional presentations.',
    color: 'bg-purple-500',
  },
  {
    id: 'export',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    title: 'Multiple Export Formats',
    description: 'Export your mockups as PNG, JPG, SVG, PDF, or animated GIF with customizable quality and size presets.',
    color: 'bg-green-500',
  },
  {
    id: 'templates',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: 'Template Gallery',
    description: 'Access 50+ professionally designed templates for every use case, from marketing to product showcases.',
    color: 'bg-orange-500',
  },
  {
    id: 'brand-kit',
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Brand Kit',
    description: 'Save your brand colors, fonts, and styles for consistent mockups across all your projects.',
    color: 'bg-red-500',
  },
];

type FeaturesSectionProps = {
  title?: string;
  subtitle?: string;
  features?: Feature[];
};

export function FeaturesSection({
  title = 'Everything You Need for Professional Mockups',
  subtitle = 'Powerful features designed to help you create stunning visual content in minutes, not hours.',
  features = defaultFeatures,
}: FeaturesSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <section className="bg-white py-20 lg:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map(feature => (
            <div
              key={feature.id}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Icon */}
              <div
                className={`mb-6 inline-flex size-14 items-center justify-center rounded-xl ${feature.color} text-white transition-transform group-hover:scale-110`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>

              {/* Hover arrow */}
              <div
                className={`mt-6 flex items-center gap-2 text-sm font-medium transition-all ${
                  hoveredFeature === feature.id
                    ? 'translate-x-2 opacity-100'
                    : 'translate-x-0 opacity-0'
                } ${feature.color.replace('bg-', 'text-')}`}
              >
                Learn more
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 ${feature.color}`}
                style={{
                  background: `linear-gradient(135deg, ${feature.color.replace('bg-', '')}10 0%, transparent 60%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/features"
            className="inline-flex items-center gap-2 text-lg font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all features
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
