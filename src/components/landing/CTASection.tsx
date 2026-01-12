'use client';

import Link from 'next/link';

type CTASectionProps = {
  title?: string;
  subtitle?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  showStats?: boolean;
  variant?: 'default' | 'gradient' | 'minimal';
};

export function CTASection({
  title = 'Ready to Create Stunning Mockups?',
  subtitle = 'Join thousands of creators who use MockFlow to bring their ideas to life. Start creating professional mockups in minutes.',
  primaryCTA = { text: 'Start Creating Free', href: '/signup' },
  secondaryCTA = { text: 'View Pricing', href: '/pricing' },
  showStats = true,
  variant = 'gradient',
}: CTASectionProps) {
  const stats = [
    { value: '10K+', label: 'Mockups Created' },
    { value: '5K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
  ];

  if (variant === 'minimal') {
    return (
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{subtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={primaryCTA.href}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {primaryCTA.text}
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={secondaryCTA.href}
              className="text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {secondaryCTA.text}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'default') {
    return (
      <section className="bg-gray-50 py-20 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white px-8 py-16 text-center shadow-sm lg:px-16 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={primaryCTA.href}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30"
              >
                {primaryCTA.text}
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={secondaryCTA.href}
                className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {secondaryCTA.text}
              </Link>
            </div>

            {showStats && (
              <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-10 dark:border-gray-700">
                {stats.map(stat => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Gradient variant (default)
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            <span className="text-sm font-medium text-white">
              Free to get started
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={primaryCTA.href}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
            >
              {primaryCTA.text}
              <svg
                className="size-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href={secondaryCTA.href}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
            >
              {secondaryCTA.text}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2 text-white/80">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">No credit card required</span>
            </div>
            <span className="hidden text-white/40 sm:inline">|</span>
            <div className="flex items-center gap-2 text-white/80">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Cancel anytime</span>
            </div>
            <span className="hidden text-white/40 sm:inline">|</span>
            <div className="flex items-center gap-2 text-white/80">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">14-day free trial</span>
            </div>
          </div>

          {/* Stats */}
          {showStats && (
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
              {stats.map(stat => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CTASection;
