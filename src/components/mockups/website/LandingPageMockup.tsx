'use client';

import {
  ArrowRight,
  Check,
  Globe,
  Menu,
  Play,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react';

export type HeroSection = {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaSecondaryText?: string;
  heroImage?: string;
  backgroundStyle?: 'gradient' | 'image' | 'pattern' | 'solid';
  stats?: { value: string; label: string }[];
};

export type Feature = {
  icon?: React.ReactNode;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
};

export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
};

export type LandingPageData = {
  brand: {
    name: string;
    logo?: string;
  };
  navigation: string[];
  hero: HeroSection;
  features?: Feature[];
  testimonials?: Testimonial[];
  pricing?: PricingTier[];
  cta?: {
    headline: string;
    description?: string;
    buttonText: string;
  };
};

export type LandingPageMockupProps = {
  data: LandingPageData;
  variant?: 'full' | 'hero-only' | 'above-fold' | 'minimal';
  colorScheme?: 'light' | 'dark' | 'brand';
  accentColor?: string;
  className?: string;
};

export default function LandingPageMockup({
  data,
  variant = 'full',
  colorScheme = 'light',
  accentColor = '#3B82F6',
  className = '',
}: LandingPageMockupProps) {
  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';

  const defaultFeatureIcons = [
    <Zap key="zap" size={24} />,
    <Shield key="shield" size={24} />,
    <Globe key="globe" size={24} />,
    <Users key="users" size={24} />,
  ];

  // Hero-only variant
  if (variant === 'hero-only') {
    return (
      <div className={`${bgColor} ${className}`}>
        <section className="relative overflow-hidden">
          {data.hero.backgroundStyle === 'gradient' && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90" />
          )}
          <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
            <h1 className={`text-4xl font-bold md:text-6xl ${data.hero.backgroundStyle === 'gradient' ? 'text-white' : textColor} mb-6`}>
              {data.hero.headline}
            </h1>
            {data.hero.subheadline && (
              <p className={`text-xl ${data.hero.backgroundStyle === 'gradient' ? 'text-white/80' : mutedColor} mx-auto mb-8 max-w-2xl`}>
                {data.hero.subheadline}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                {data.hero.ctaText}
                <ArrowRight size={18} />
              </button>
              {data.hero.ctaSecondaryText && (
                <button className={`px-8 py-4 ${data.hero.backgroundStyle === 'gradient' ? 'border-white/20 bg-white/10 text-white' : `bg-gray-100 ${textColor} border-gray-200`} rounded-full border font-semibold`}>
                  {data.hero.ctaSecondaryText}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex min-h-screen items-center justify-center ${className}`}>
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mb-8">
            {data.brand.logo
              ? (
                  <img src={data.brand.logo} alt={data.brand.name} className="mx-auto h-12" />
                )
              : (
                  <span className={`text-2xl font-bold ${textColor}`}>{data.brand.name}</span>
                )}
          </div>
          <h1 className={`text-3xl font-bold md:text-5xl ${textColor} mb-4`}>
            {data.hero.headline}
          </h1>
          {data.hero.subheadline && (
            <p className={`text-lg ${mutedColor} mb-8`}>{data.hero.subheadline}</p>
          )}
          <button
            className="rounded-lg px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            {data.hero.ctaText}
          </button>
        </div>
      </div>
    );
  }

  // Above-fold variant
  if (variant === 'above-fold') {
    return (
      <div className={`${bgColor} ${className}`}>
        {/* Navigation */}
        <nav className={`border-b ${borderColor}`}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              {data.brand.logo
                ? (
                    <img src={data.brand.logo} alt={data.brand.name} className="h-8" />
                  )
                : (
                    <span className={`text-xl font-bold ${textColor}`}>{data.brand.name}</span>
                  )}
            </div>
            <div className="hidden items-center gap-8 md:flex">
              {data.navigation.map((item, index) => (
                <a key={index} href="#" className={`${mutedColor} hover:${textColor} transition-colors`}>
                  {item}
                </a>
              ))}
            </div>
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: accentColor }}
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className={`text-4xl font-bold md:text-5xl ${textColor} mb-6 leading-tight`}>
              {data.hero.headline}
            </h1>
            {data.hero.subheadline && (
              <p className={`text-lg ${mutedColor} mb-8`}>{data.hero.subheadline}</p>
            )}
            <div className="flex flex-wrap gap-4">
              <button
                className="flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                {data.hero.ctaText}
                <ArrowRight size={18} />
              </button>
              {data.hero.ctaSecondaryText && (
                <button className={`border px-6 py-3 ${borderColor} ${textColor} flex items-center gap-2 rounded-lg font-semibold`}>
                  <Play size={18} />
                  {data.hero.ctaSecondaryText}
                </button>
              )}
            </div>

            {/* Stats */}
            {data.hero.stats && (
              <div className="mt-10 flex gap-8">
                {data.hero.stats.map((stat, index) => (
                  <div key={index}>
                    <p className={`text-3xl font-bold ${textColor}`}>{stat.value}</p>
                    <p className={`text-sm ${mutedColor}`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {data.hero.heroImage
              ? (
                  <img src={data.hero.heroImage} alt="Hero" className="w-full rounded-xl shadow-2xl" />
                )
              : (
                  <div className={`aspect-video ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center rounded-xl`}>
                    <span className={mutedColor}>Hero Image</span>
                  </div>
                )}
          </div>
        </section>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${bgColor} ${className}`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${bgColor} border-b ${borderColor}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {data.brand.logo
              ? (
                  <img src={data.brand.logo} alt={data.brand.name} className="h-8" />
                )
              : (
                  <span className={`text-xl font-bold ${textColor}`}>{data.brand.name}</span>
                )}
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {data.navigation.map((item, index) => (
              <a key={index} href="#" className={`text-sm ${mutedColor} hover:${textColor} transition-colors`}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className={`hidden text-sm md:block ${mutedColor} hover:${textColor}`}>Log in</button>
            <button
              className="rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: accentColor }}
            >
              Get Started
            </button>
            <button className="p-2 md:hidden">
              <Menu size={24} className={textColor} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {data.hero.backgroundStyle === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className={`text-4xl font-bold md:text-6xl ${data.hero.backgroundStyle === 'gradient' ? 'text-white' : textColor} mb-6 leading-tight`}>
              {data.hero.headline}
            </h1>
            {data.hero.subheadline && (
              <p className={`text-xl ${data.hero.backgroundStyle === 'gradient' ? 'text-white/80' : mutedColor} mx-auto mb-10 max-w-2xl`}>
                {data.hero.subheadline}
              </p>
            )}
            <div className="mb-10 flex flex-wrap justify-center gap-4">
              <button
                className="flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                style={{ backgroundColor: accentColor }}
              >
                {data.hero.ctaText}
                <ArrowRight size={18} />
              </button>
              {data.hero.ctaSecondaryText && (
                <button className={`px-8 py-4 ${data.hero.backgroundStyle === 'gradient' ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : `bg-white ${textColor} border-gray-200 hover:bg-gray-50`} rounded-full border font-semibold transition-colors`}>
                  {data.hero.ctaSecondaryText}
                </button>
              )}
            </div>

            {/* Stats */}
            {data.hero.stats && (
              <div className="flex justify-center gap-12">
                {data.hero.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className={`text-3xl font-bold ${data.hero.backgroundStyle === 'gradient' ? 'text-white' : textColor}`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${data.hero.backgroundStyle === 'gradient' ? 'text-white/70' : mutedColor}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Image */}
          {data.hero.heroImage && (
            <div className="mt-16">
              <img
                src={data.hero.heroImage}
                alt="Product"
                className="mx-auto w-full max-w-4xl rounded-xl shadow-2xl"
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {data.features && data.features.length > 0 && (
        <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className={`text-3xl font-bold md:text-4xl ${textColor} mb-4`}>
                Why Choose Us
              </h2>
              <p className={`text-lg ${mutedColor} mx-auto max-w-2xl`}>
                Everything you need to succeed
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {data.features.map((feature, index) => (
                <div key={index} className={`p-6 ${bgColor} rounded-xl border ${borderColor}`}>
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    {feature.icon || defaultFeatureIcons[index % defaultFeatureIcons.length]}
                  </div>
                  <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{feature.title}</h3>
                  <p className={mutedColor}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className={`text-3xl font-bold md:text-4xl ${textColor} mb-4`}>
                Loved by Thousands
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {data.testimonials.map((testimonial, index) => (
                <div key={index} className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
                  {testimonial.rating && (
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-500" fill="currentColor" />
                      ))}
                    </div>
                  )}
                  <p className={`${textColor} mb-6`}>
                    &quot;
                    {testimonial.quote}
                    &quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-medium text-white">
                      {testimonial.avatar
                        ? (
                            <img src={testimonial.avatar} alt={testimonial.author} className="h-full w-full rounded-full object-cover" />
                          )
                        : (
                            testimonial.author.charAt(0)
                          )}
                    </div>
                    <div>
                      <p className={`font-medium ${textColor}`}>{testimonial.author}</p>
                      <p className={`text-sm ${mutedColor}`}>
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {data.pricing && data.pricing.length > 0 && (
        <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className={`text-3xl font-bold md:text-4xl ${textColor} mb-4`}>
                Simple, Transparent Pricing
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {data.pricing.map((tier, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-8 ${
                    tier.highlighted
                      ? 'scale-105 bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : `${bgColor} border ${borderColor}`
                  }`}
                >
                  <h3 className={`text-xl font-bold ${tier.highlighted ? 'text-white' : textColor} mb-2`}>
                    {tier.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : textColor}`}>
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className={tier.highlighted ? 'text-white/70' : mutedColor}>
                        /
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className={`${tier.highlighted ? 'text-white/80' : mutedColor} mb-6`}>
                    {tier.description}
                  </p>
                  <ul className="mb-8 space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <Check size={16} className={tier.highlighted ? 'text-white' : 'text-green-500'} />
                        <span className={tier.highlighted ? 'text-white' : textColor}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full rounded-lg py-3 font-semibold transition-colors ${
                      tier.highlighted
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={!tier.highlighted ? { backgroundColor: accentColor } : undefined}
                  >
                    {tier.ctaText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {data.cta && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className={`text-3xl font-bold md:text-4xl ${textColor} mb-4`}>
              {data.cta.headline}
            </h2>
            {data.cta.description && (
              <p className={`text-lg ${mutedColor} mb-8`}>{data.cta.description}</p>
            )}
            <button
              className="mx-auto flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {data.cta.buttonText}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`border-t ${borderColor} py-12`}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              {data.brand.logo
                ? (
                    <img src={data.brand.logo} alt={data.brand.name} className="h-6" />
                  )
                : (
                    <span className={`font-bold ${textColor}`}>{data.brand.name}</span>
                  )}
            </div>
            <p className={`text-sm ${mutedColor}`}>
              ©
              {' '}
              {new Date().getFullYear()}
              {' '}
              {data.brand.name}
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
