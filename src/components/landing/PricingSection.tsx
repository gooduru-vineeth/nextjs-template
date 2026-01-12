'use client';

import Link from 'next/link';
import { useState } from 'react';

type PricingPlan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaHref?: string;
};

const defaultPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '10 mockups per month',
      'Basic templates',
      'PNG & JPG export',
      'Standard device frames',
      'Community support',
    ],
    ctaText: 'Get Started Free',
    ctaHref: '/signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and teams',
    monthlyPrice: 12,
    yearlyPrice: 9,
    features: [
      'Unlimited mockups',
      'All premium templates',
      'PNG, JPG, SVG, PDF, GIF export',
      'All device frames',
      'Brand kit storage',
      'Remove watermarks',
      'Priority support',
      'API access',
    ],
    highlighted: true,
    ctaText: 'Start Pro Trial',
    ctaHref: '/signup?plan=pro',
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For growing organizations',
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared brand kits',
      'Team collaboration',
      'Admin dashboard',
      'SSO integration',
      'Dedicated support',
      'Custom templates',
    ],
    ctaText: 'Contact Sales',
    ctaHref: '/contact',
  },
];

type PricingSectionProps = {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
};

export function PricingSection({
  title = 'Simple, Transparent Pricing',
  subtitle = 'Choose the plan that fits your needs. All plans include a 14-day free trial.',
  plans = defaultPlans,
}: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section className="bg-gray-50 py-20 lg:py-32 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                !isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                isYearly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={isYearly}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isYearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'border-2 border-blue-500 bg-white shadow-xl dark:bg-gray-900'
                  : 'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mt-6 text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  )}
                </div>
                {plan.monthlyPrice > 0 && isYearly && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Billed annually ($
                    {plan.yearlyPrice * 12}
                    /year)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 size-5 shrink-0 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href={plan.ctaHref || '/signup'}
                  className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {plan.ctaText || 'Get Started'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All plans include a 14-day free trial. No credit card required.
            <br />
            Need a custom plan?
            {' '}
            <a href="/contact" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
