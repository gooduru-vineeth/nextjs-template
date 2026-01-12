'use client';

import {
  ArrowRight,
  Check,
  ChevronDown,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Layout,
  Linkedin,
  Mail,
  Menu,
  Play,
  Star,
  Twitter,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Types
type WebsiteType = 'landing' | 'blog' | 'portfolio' | 'corporate' | 'startup';
type ThemeStyle = 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
type ColorScheme = 'light' | 'dark' | 'custom';

type NavigationItem = {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  children?: NavigationItem[];
};

type HeroSection = {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary?: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundValue: string;
  alignment: 'left' | 'center' | 'right';
};

type FeatureItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating?: number;
};

type FooterColumn = {
  id: string;
  title: string;
  links: { label: string; href: string }[];
};

type WebsiteConfig = {
  type: WebsiteType;
  theme: ThemeStyle;
  colorScheme: ColorScheme;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  companyName: string;
  navigation: NavigationItem[];
  hero: HeroSection;
  features: FeatureItem[];
  testimonials: TestimonialItem[];
  footerColumns: FooterColumn[];
  socialLinks: { platform: string; url: string }[];
  showCookieBanner: boolean;
  showChatWidget: boolean;
};

type Variant = 'full' | 'compact' | 'widget' | 'dashboard';

type WebsiteMockupProps = {
  variant?: Variant;
  config?: Partial<WebsiteConfig>;
  onConfigChange?: (config: WebsiteConfig) => void;
  className?: string;
};

// Default configuration
const defaultConfig: WebsiteConfig = {
  type: 'landing',
  theme: 'modern',
  colorScheme: 'light',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  logo: '',
  companyName: 'TechCorp',
  navigation: [
    { id: '1', label: 'Products', href: '#products', hasDropdown: true },
    { id: '2', label: 'Solutions', href: '#solutions' },
    { id: '3', label: 'Pricing', href: '#pricing' },
    { id: '4', label: 'About', href: '#about' },
    { id: '5', label: 'Contact', href: '#contact' },
  ],
  hero: {
    headline: 'Build Amazing Products Faster',
    subheadline: 'The all-in-one platform for modern teams to design, develop, and deploy.',
    ctaPrimary: 'Get Started Free',
    ctaSecondary: 'Watch Demo',
    backgroundType: 'gradient',
    backgroundValue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    alignment: 'center',
  },
  features: [
    { id: '1', icon: 'Layout', title: 'Intuitive Design', description: 'Create stunning interfaces with our drag-and-drop builder.' },
    { id: '2', icon: 'Globe', title: 'Global Scale', description: 'Deploy anywhere with our worldwide CDN infrastructure.' },
    { id: '3', icon: 'Shield', title: 'Enterprise Security', description: 'Bank-level encryption and compliance certifications.' },
    { id: '4', icon: 'Zap', title: 'Lightning Fast', description: 'Optimized performance with sub-second load times.' },
  ],
  testimonials: [
    {
      id: '1',
      quote: 'This platform transformed how we build products. Incredible time savings!',
      author: 'Sarah Chen',
      role: 'CTO',
      company: 'Innovate Inc',
      rating: 5,
    },
    {
      id: '2',
      quote: 'The best investment we made this year. Our team productivity doubled.',
      author: 'Michael Brown',
      role: 'Product Lead',
      company: 'Scale Up',
      rating: 5,
    },
  ],
  footerColumns: [
    {
      id: '1',
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Roadmap', href: '#' },
      ],
    },
    {
      id: '2',
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      id: '3',
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      id: '4',
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'GDPR', href: '#' },
      ],
    },
  ],
  socialLinks: [
    { platform: 'twitter', url: '#' },
    { platform: 'linkedin', url: '#' },
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
  ],
  showCookieBanner: true,
  showChatWidget: true,
};

// Feature icon mapping
const featureIcons: Record<string, React.ReactNode> = {
  Layout: <Layout className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
  Shield: <Check className="h-6 w-6" />,
  Zap: <Play className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
};

// Social icon mapping
const socialIcons: Record<string, React.ReactNode> = {
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
};

export function WebsiteMockup({
  variant = 'full',
  config: initialConfig,
  onConfigChange,
  className = '',
}: WebsiteMockupProps) {
  const [config, setConfig] = useState<WebsiteConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const updateConfig = useCallback((updates: Partial<WebsiteConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [config, onConfigChange]);

  const isDark = config.colorScheme === 'dark';

  // Render Navigation
  const renderNavigation = () => (
    <nav className={`sticky top-0 z-50 ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} border-b`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              {config.companyName.charAt(0)}
            </div>
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {config.companyName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {config.navigation.map(item => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveNavItem(item.id)}
                onMouseLeave={() => setActiveNavItem(null)}
              >
                <button
                  className={`flex items-center space-x-1 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </button>
                {item.hasDropdown && activeNavItem === item.id && (
                  <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} py-2`}>
                    <a href="#" className={`block px-4 py-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      Feature 1
                    </a>
                    <a href="#" className={`block px-4 py-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      Feature 2
                    </a>
                    <a href="#" className={`block px-4 py-2 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      Feature 3
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <button className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Sign In
            </button>
            <button
              className="rounded-lg px-4 py-2 font-medium text-white transition-transform hover:scale-105"
              style={{ backgroundColor: config.primaryColor }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className={`h-6 w-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className={`md:hidden ${isDark ? 'bg-gray-900' : 'bg-white'} border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="space-y-3 px-4 py-4">
            {config.navigation.map(item => (
              <a
                key={item.id}
                href={item.href}
                className={`block py-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {item.label}
              </a>
            ))}
            <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <button className={`block w-full py-2 text-left ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Sign In
              </button>
              <button
                className="w-full rounded-lg px-4 py-2 font-medium text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  // Render Hero Section
  const renderHero = () => (
    <section
      className="relative py-20 lg:py-32"
      style={{
        background: config.hero.backgroundType === 'gradient'
          ? config.hero.backgroundValue
          : config.hero.backgroundType === 'solid'
            ? config.hero.backgroundValue
            : `url(${config.hero.backgroundValue}) center/cover`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${config.hero.alignment === 'center' ? 'mx-auto text-center' : config.hero.alignment === 'right' ? 'ml-auto text-right' : ''} max-w-3xl`}>
          <h1 className="mb-6 text-4xl leading-tight font-bold text-white lg:text-6xl">
            {config.hero.headline}
          </h1>
          <p className="mb-8 text-xl text-white/80">
            {config.hero.subheadline}
          </p>
          <div className={`flex ${config.hero.alignment === 'center' ? 'justify-center' : config.hero.alignment === 'right' ? 'justify-end' : ''} flex-wrap gap-4`}>
            <button className="flex items-center space-x-2 rounded-lg bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100">
              <span>{config.hero.ctaPrimary}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            {config.hero.ctaSecondary && (
              <button className="flex items-center space-x-2 rounded-lg border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/20">
                <Play className="h-5 w-5" />
                <span>{config.hero.ctaSecondary}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // Render Features Section
  const renderFeatures = () => (
    <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={`mb-4 text-3xl font-bold lg:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Everything you need to succeed
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mx-auto max-w-2xl`}>
            Powerful features to help you build, launch, and grow your products faster than ever.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {config.features.map(feature => (
            <div
              key={feature.id}
              className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-shadow hover:shadow-md`}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                {featureIcons[feature.icon] ?? <Layout className="h-6 w-6" />}
              </div>
              <h3 className={`mb-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Render Testimonials Section
  const renderTestimonials = () => (
    <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={`mb-4 text-3xl font-bold lg:text-4xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Loved by thousands of teams
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            See what our customers have to say about their experience.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {config.testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className={`rounded-xl p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
            >
              {testimonial.rating && (
                <div className="mb-4 flex space-x-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
              )}
              <p className={`mb-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                &ldquo;
                {testimonial.quote}
                &rdquo;
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-semibold text-white">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.author}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {testimonial.role}
                    {' '}
                    at
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Render CTA Section
  const renderCTA = () => (
    <section
      className="py-20"
      style={{ backgroundColor: config.primaryColor }}
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
          Ready to get started?
        </h2>
        <p className="mb-8 text-xl text-white/80">
          Join thousands of teams already using our platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="rounded-lg bg-white px-8 py-4 font-semibold text-gray-900 transition-colors hover:bg-gray-100">
            Start Free Trial
          </button>
          <button className="rounded-lg border border-white/30 bg-white/10 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/20">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );

  // Render Footer
  const renderFooter = () => (
    <footer className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center space-x-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.companyName.charAt(0)}
              </div>
              <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {config.companyName}
              </span>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Building the future of product development, one feature at a time.
            </p>
            <div className="flex space-x-4">
              {config.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={`rounded-lg p-2 ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-gray-200 text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  {socialIcons[social.platform]}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {config.footerColumns.map(column => (
            <div key={column.id}>
              <h3 className={`mb-4 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className={`border-t pt-8 ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &copy;
            {' '}
            {new Date().getFullYear()}
            {' '}
            {config.companyName}
            . All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Privacy Policy
            </a>
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Terms of Service
            </a>
            <a href="#" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );

  // Render Cookie Banner
  const renderCookieBanner = () => (
    config.showCookieBanner && (
      <div className={`fixed right-0 bottom-0 left-0 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} z-50 p-4 shadow-lg`}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div className="flex space-x-3">
            <button className={`px-4 py-2 text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Manage Preferences
            </button>
            <button
              className="rounded-lg px-4 py-2 text-sm text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Render Chat Widget
  const renderChatWidget = () => (
    config.showChatWidget && (
      <button
        className="fixed right-6 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ backgroundColor: config.primaryColor }}
      >
        <Mail className="h-6 w-6" />
      </button>
    )
  );

  // Render based on variant
  if (variant === 'compact') {
    return (
      <div className={`overflow-hidden rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="h-[400px] w-[200%] origin-top-left scale-50 transform overflow-hidden">
          {renderNavigation()}
          {renderHero()}
        </div>
      </div>
    );
  }

  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border p-4 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="mb-3 flex items-center space-x-3">
          <Globe className="h-5 w-5" style={{ color: config.primaryColor }} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Website Mockup</span>
        </div>
        <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
          <div className="text-center text-white">
            <Layout className="mx-auto mb-2 h-8 w-8" />
            <p className="text-sm font-medium">{config.companyName}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`overflow-hidden rounded-xl border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'} ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" style={{ color: config.primaryColor }} />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {config.companyName}
              {' '}
              Landing Page
            </span>
          </div>
          <select
            className={`rounded-lg border px-3 py-1 text-sm ${isDark ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            value={config.type}
            onChange={e => updateConfig({ type: e.target.value as WebsiteType })}
          >
            <option value="landing">Landing Page</option>
            <option value="blog">Blog</option>
            <option value="portfolio">Portfolio</option>
            <option value="corporate">Corporate</option>
            <option value="startup">Startup</option>
          </select>
        </div>
        <div className="h-[400px] overflow-auto">
          <div className="w-[133.33%] origin-top-left scale-75 transform">
            {renderNavigation()}
            {renderHero()}
            {renderFeatures()}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} ${className}`}>
      {renderNavigation()}
      {renderHero()}
      {renderFeatures()}
      {renderTestimonials()}
      {renderCTA()}
      {renderFooter()}
      {renderCookieBanner()}
      {renderChatWidget()}
    </div>
  );
}

export default WebsiteMockup;
