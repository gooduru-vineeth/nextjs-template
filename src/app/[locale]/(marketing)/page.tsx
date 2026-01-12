import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MockFlow - Create Professional Mockups in Minutes',
    description: 'Create pixel-perfect mockups of chat apps, AI interfaces, and social media posts. No design skills required.',
  };
}

const features = [
  {
    icon: '💬',
    title: 'Chat App Mockups',
    description: 'Create realistic WhatsApp, iMessage, Discord, Telegram, and more with pixel-perfect accuracy.',
  },
  {
    icon: '🤖',
    title: 'AI Chat Interfaces',
    description: 'Design ChatGPT, Claude, Gemini conversation mockups with code blocks and artifacts.',
  },
  {
    icon: '📱',
    title: 'Social Media Posts',
    description: 'Build LinkedIn, Instagram, Twitter, and Facebook post mockups for marketing.',
  },
  {
    icon: '🎨',
    title: 'Customizable Themes',
    description: 'Light and dark modes, custom colors, and device frames for every mockup.',
  },
  {
    icon: '📥',
    title: 'Export Anywhere',
    description: 'Download as PNG, JPG, SVG, or PDF in multiple resolutions for any use case.',
  },
  {
    icon: '⚡',
    title: 'Real-time Preview',
    description: 'See your changes instantly as you build. No waiting, no refreshing.',
  },
];

const platforms = [
  { name: 'WhatsApp', color: 'bg-green-500' },
  { name: 'iMessage', color: 'bg-blue-500' },
  { name: 'Discord', color: 'bg-indigo-500' },
  { name: 'ChatGPT', color: 'bg-emerald-500' },
  { name: 'Claude', color: 'bg-orange-500' },
  { name: 'LinkedIn', color: 'bg-sky-500' },
  { name: 'Instagram', color: 'bg-pink-500' },
  { name: 'Twitter/X', color: 'bg-gray-800' },
];

const useCases = [
  {
    title: 'Product Designers',
    description: 'Create conversation flow mockups and user journey visualizations for your portfolio.',
    icon: '🎯',
  },
  {
    title: 'Product Managers',
    description: 'Build feature demonstrations and stakeholder presentations in minutes.',
    icon: '📊',
  },
  {
    title: 'Marketing Teams',
    description: 'Design social media campaign mockups and ad creative previews.',
    icon: '📣',
  },
  {
    title: 'Content Creators',
    description: 'Create tutorial visuals and educational content with realistic interfaces.',
    icon: '🎬',
  },
];

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 px-4 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
            <span className="mr-2">✨</span>
            Create mockups 10x faster than traditional design tools
          </div>

          <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
            Create Professional
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Mockups in Minutes
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
            Design pixel-perfect mockups of chat applications, AI interfaces, and social media posts.
            No design skills required. Export-ready in seconds.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Start Creating Free
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>

          {/* Platform badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {platforms.map(platform => (
              <span
                key={platform.name}
                className={`${platform.color} rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-lg`}
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 left-1/2 h-20 w-[200%] -translate-x-1/2 bg-white" style={{ borderRadius: '100% 100% 0 0' }} />
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Everything You Need to Create
              <br />
              <span className="text-blue-600">Beautiful Mockups</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              MockFlow gives you all the tools to create professional mockups without the complexity of traditional design software.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Built for
              {' '}
              <span className="text-purple-600">Every Creator</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Whether you're a designer, marketer, or developer, MockFlow helps you create professional mockups fast.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map(useCase => (
              <div
                key={useCase.title}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{useCase.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Create Mockups in
              {' '}
              <span className="text-green-600">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Choose Platform</h3>
              <p className="text-gray-600">
                Select from WhatsApp, iMessage, Discord, ChatGPT, LinkedIn, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Build Your Content</h3>
              <p className="text-gray-600">
                Add messages, customize participants, and style your mockup with real-time preview.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Export & Share</h3>
              <p className="text-gray-600">
                Download in PNG, JPG, SVG, or PDF. Ready for presentations, portfolios, or marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Ready to Create Your First Mockup?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Join thousands of designers, marketers, and creators who use MockFlow to bring their ideas to life.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:scale-105"
          >
            Start Creating - It's Free
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-gray-400">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">MockFlow</span>
              <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">Beta</span>
            </div>
            <p className="text-sm">
              © 2026 MockFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
