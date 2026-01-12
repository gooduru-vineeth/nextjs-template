'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type HeroSectionProps = {
  title?: string;
  subtitle?: string;
  ctaPrimary?: {
    text: string;
    href: string;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
  showDemo?: boolean;
  showStats?: boolean;
};

const defaultStats = [
  { value: '10K+', label: 'Mockups Created' },
  { value: '5K+', label: 'Happy Users' },
  { value: '50+', label: 'Templates' },
  { value: '99.9%', label: 'Uptime' },
];

export function HeroSection({
  title = 'Create Beautiful Mockups in Minutes',
  subtitle = 'Transform your screenshots into professional mockups with device frames, social media templates, and app store previews. No design skills required.',
  ctaPrimary = { text: 'Start Creating Free', href: '/editor' },
  ctaSecondary = { text: 'View Templates', href: '/templates' },
  showDemo = true,
  showStats = true,
}: HeroSectionProps) {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (showDemo) {
      const interval = setInterval(() => {
        setActiveDemo(prev => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [showDemo]);

  const demoTypes = [
    { name: 'Social Media', color: 'from-pink-500 to-purple-600' },
    { name: 'App Store', color: 'from-blue-500 to-cyan-500' },
    { name: 'Device Frames', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 size-80 rounded-full bg-blue-100 opacity-50 blur-3xl dark:bg-blue-900/30" />
        <div className="absolute top-20 -right-40 size-80 rounded-full bg-purple-100 opacity-50 blur-3xl dark:bg-purple-900/30" />
        <div className="absolute -bottom-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-pink-100 opacity-50 blur-3xl dark:bg-pink-900/30" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.05]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Text content */}
          <div
            className={`text-center transition-all duration-1000 lg:text-left ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-900/30">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                New: App Store Mockups Available
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              {title.split(' ').map((word, i) => (
                <span
                  key={i}
                  className={
                    word === 'Beautiful' || word === 'Mockups'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                      : ''
                  }
                >
                  {word}
                  {' '}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="mb-8 max-w-2xl text-lg text-gray-600 lg:max-w-xl dark:text-gray-300">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href={ctaPrimary.href}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 sm:w-auto"
              >
                {ctaPrimary.text}
                <svg
                  className="size-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                href={ctaSecondary.href}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {ctaSecondary.text}
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col items-center gap-4 lg:items-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-medium text-white dark:border-gray-800"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg
                      key={i}
                      className="size-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong className="font-semibold text-gray-900 dark:text-white">4.9/5</strong>
                  {' '}
                  from 1,000+ reviews
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Demo/Preview */}
          {showDemo && (
            <div
              className={`relative transition-all delay-300 duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {/* Main preview card */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating cards */}
                <div className="animate-float absolute -top-4 -left-8 z-10">
                  <div className="rounded-xl bg-white p-3 shadow-xl dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                        <svg className="size-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Instagram</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Story Ready</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="animate-float-delayed absolute top-1/3 -right-4 z-10">
                  <div className="rounded-xl bg-white p-3 shadow-xl dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <svg className="size-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">App Store</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Preview</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="animate-float absolute -bottom-4 left-1/4 z-10">
                  <div className="rounded-xl bg-white p-3 shadow-xl dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <svg className="size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Export Ready!</span>
                    </div>
                  </div>
                </div>

                {/* Main mockup preview */}
                <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                  {/* Browser chrome */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-400" />
                      <div className="size-3 rounded-full bg-yellow-400" />
                      <div className="size-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 rounded-full bg-gray-100 px-4 py-1.5 dark:bg-gray-700">
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        mockflow.app
                      </div>
                    </div>
                  </div>

                  {/* Demo content */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                    {demoTypes.map((type, i) => (
                      <div
                        key={type.name}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                          activeDemo === i
                            ? 'scale-100 opacity-100'
                            : 'scale-95 opacity-0'
                        }`}
                      >
                        <div
                          className={`flex size-32 items-center justify-center rounded-xl bg-gradient-to-br ${type.color} text-white shadow-lg`}
                        >
                          <span className="text-center text-sm font-semibold">{type.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Demo type indicators */}
                  <div className="mt-4 flex justify-center gap-2">
                    {demoTypes.map((type, i) => (
                      <button
                        key={type.name}
                        type="button"
                        onClick={() => setActiveDemo(i)}
                        className={`h-2 rounded-full transition-all ${
                          activeDemo === i
                            ? 'w-8 bg-blue-500'
                            : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600'
                        }`}
                        aria-label={`Show ${type.name} demo`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {showStats && (
          <div
            className={`mt-20 grid grid-cols-2 gap-8 border-t border-gray-200 pt-10 transition-all delay-500 duration-1000 sm:grid-cols-4 dark:border-gray-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {defaultStats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}
      </style>
    </section>
  );
}

export default HeroSection;
