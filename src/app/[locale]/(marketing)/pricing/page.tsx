'use client';

import Link from 'next/link';
import { useState } from 'react';

type PricingTier = {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  limitations?: string[];
  cta: string;
  popular?: boolean;
  enterprise?: boolean;
};

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for getting started with mockup creation',
    features: [
      '10 mockups per month',
      '5 exports per month',
      'Basic templates',
      'PNG export only',
      'Standard resolution (1x)',
      'Community support',
    ],
    limitations: [
      'Watermark on exports',
      'No team features',
      'No API access',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: { monthly: 19, yearly: 15 },
    description: 'For professionals who need more power and flexibility',
    features: [
      'Unlimited mockups',
      'Unlimited exports',
      'All templates',
      'All export formats (PNG, JPG, SVG, PDF)',
      'High resolution (3x)',
      'No watermarks',
      'Custom branding',
      'Priority support',
      'Version history',
      'Brand kit (1)',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Team',
    price: { monthly: 49, yearly: 39 },
    description: 'For teams that collaborate on mockup projects',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Team workspace',
      'Shared mockup library',
      'Real-time collaboration',
      'Comments & annotations',
      'Brand kits (5)',
      'API access',
      'Webhook integrations',
      'Analytics dashboard',
      'Dedicated support',
    ],
    cta: 'Start Team Trial',
  },
  {
    name: 'Enterprise',
    price: { monthly: 0, yearly: 0 },
    description: 'Custom solutions for large organizations',
    features: [
      'Everything in Team',
      'Unlimited team members',
      'Unlimited brand kits',
      'SSO / SAML',
      'Custom integrations',
      'On-premise deployment',
      'Dedicated account manager',
      '99.9% SLA',
      'Custom contracts',
      'Training sessions',
      'White-label options',
    ],
    cta: 'Contact Sales',
    enterprise: true,
  },
];

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at the end of your billing cycle.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! Both Pro and Team plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise customers.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.',
  },
  {
    question: 'What happens to my mockups if I downgrade?',
    answer: 'Your existing mockups remain accessible, but you\'ll be limited to the features of your new plan. You won\'t lose any data.',
  },
  {
    question: 'Do you offer discounts for nonprofits or education?',
    answer: 'Yes! We offer 50% off for verified nonprofits and educational institutions. Contact us to apply.',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Choose the perfect plan for your mockup needs. Start free, upgrade when you need more.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none ${
                  billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map(tier => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm dark:bg-gray-800 ${
                tier.popular
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
              </div>

              <div className="mb-6">
                {tier.enterprise
                  ? (
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">Custom</div>
                    )
                  : (
                      <>
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          $
                          {billingPeriod === 'yearly' ? tier.price.yearly : tier.price.monthly}
                        </span>
                        {tier.price.monthly > 0 && (
                          <span className="text-gray-500 dark:text-gray-400">
                            /month
                            {billingPeriod === 'yearly' && ', billed yearly'}
                          </span>
                        )}
                      </>
                    )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="mt-0.5 size-5 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
                {tier.limitations?.map((limitation, index) => (
                  <li key={`limit-${index}`} className="flex items-start gap-3">
                    <svg className="mt-0.5 size-5 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-400 dark:text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.enterprise ? '/contact' : '/sign-up'}
                className={`block w-full rounded-lg py-3 text-center text-sm font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : tier.enterprise
                      ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="border-t border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Compare all features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Feature</th>
                  {pricingTiers.map(tier => (
                    <th key={tier.name} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { feature: 'Monthly mockups', values: ['10', 'Unlimited', 'Unlimited', 'Unlimited'] },
                  { feature: 'Monthly exports', values: ['5', 'Unlimited', 'Unlimited', 'Unlimited'] },
                  { feature: 'Templates', values: ['Basic', 'All', 'All', 'All + Custom'] },
                  { feature: 'Export formats', values: ['PNG', 'All', 'All', 'All'] },
                  { feature: 'Resolution', values: ['1x', '3x', '3x', '3x'] },
                  { feature: 'Watermark-free', values: [false, true, true, true] },
                  { feature: 'Brand kits', values: ['0', '1', '5', 'Unlimited'] },
                  { feature: 'Team members', values: ['1', '1', '10', 'Unlimited'] },
                  { feature: 'API access', values: [false, false, true, true] },
                  { feature: 'SSO/SAML', values: [false, false, false, true] },
                  { feature: 'Support', values: ['Community', 'Priority', 'Dedicated', 'Account Manager'] },
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="py-4 text-sm text-gray-600 dark:text-gray-300">{row.feature}</td>
                    {row.values.map((value, vIndex) => (
                      <td key={vIndex} className="px-4 py-4 text-center">
                        {typeof value === 'boolean'
                          ? (
                              value
                                ? (
                                    <svg className="mx-auto size-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )
                                : (
                                    <svg className="mx-auto size-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  )
                            )
                          : (
                              <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>
                            )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <svg
                  className={`size-5 text-gray-500 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === index && (
                <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to create amazing mockups?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join thousands of designers, marketers, and creators who use MockFlow every day.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow-lg transition-colors hover:bg-blue-50"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
