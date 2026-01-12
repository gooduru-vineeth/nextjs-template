'use client';

import { useState } from 'react';

type Subscription = {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
};

type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string;
  isDefault: boolean;
};

// Mock data
const mockSubscription: Subscription = {
  plan: 'pro',
  status: 'active',
  currentPeriodEnd: 'Feb 15, 2026',
  cancelAtPeriodEnd: false,
};

const mockInvoices: Invoice[] = [
  { id: 'inv_001', date: 'Jan 15, 2026', amount: 19, status: 'paid', pdfUrl: '#' },
  { id: 'inv_002', date: 'Dec 15, 2025', amount: 19, status: 'paid', pdfUrl: '#' },
  { id: 'inv_003', date: 'Nov 15, 2025', amount: 19, status: 'paid', pdfUrl: '#' },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm_1', type: 'card', last4: '4242', brand: 'Visa', expiryMonth: 12, expiryYear: 2027, isDefault: true },
  { id: 'pm_2', type: 'paypal', email: 'john@example.com', isDefault: false },
];

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'For getting started',
    features: [
      '5 mockups per month',
      'Basic templates',
      'Watermarked exports',
      'Community support',
    ],
    limitations: [
      'No AI chat mockups',
      'No team features',
      'Limited storage',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19,
    description: 'For professionals',
    popular: true,
    features: [
      'Unlimited mockups',
      'All templates',
      'No watermarks',
      'AI chat mockups',
      'Priority support',
      'Export in all formats',
      '10GB storage',
    ],
    limitations: [],
  },
  {
    id: 'team',
    name: 'Team',
    price: 49,
    description: 'For teams',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Brand kits',
      'Team workspaces',
      'Collaboration tools',
      'API access',
      '50GB storage',
      'Admin dashboard',
    ],
    limitations: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    description: 'For large organizations',
    features: [
      'Everything in Team',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Unlimited storage',
      'SSO/SAML',
    ],
    limitations: [],
  },
];

function StatusBadge({ status }: { status: Subscription['status'] }) {
  const styles = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    canceled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
    past_due: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const labels = {
    active: 'Active',
    canceled: 'Canceled',
    past_due: 'Past Due',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const styles = {
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function BillingPage() {
  const [subscription] = useState<Subscription>(mockSubscription);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const currentPlan = plans.find(p => p.id === subscription.plan);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your subscription and payment methods
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Current Plan */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentPlan?.name}
                  {' '}
                  Plan
                </h2>
                <StatusBadge status={subscription.status} />
              </div>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{currentPlan?.description}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {subscription.cancelAtPeriodEnd
                  ? `Your subscription will end on ${subscription.currentPeriodEnd}`
                  : `Next billing date: ${subscription.currentPeriodEnd}`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {subscription.plan === 'enterprise' ? 'Contact Sales' : 'Upgrade Plan'}
              </button>
              {subscription.plan !== 'free' && (
                <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>

          {/* Plan Features */}
          {currentPlan && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Included Features</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {currentPlan.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Payment Methods */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Add New
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    method.isDefault
                      ? 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {method.type === 'card'
                      ? (
                          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                            <svg className="size-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                        )
                      : (
                          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">P</span>
                          </div>
                        )}
                    <div>
                      {method.type === 'card'
                        ? (
                            <>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {method.brand}
                                {' '}
                                ••••
                                {method.last4}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Expires
                                {' '}
                                {method.expiryMonth}
                                /
                                {method.expiryYear}
                              </p>
                            </>
                          )
                        : (
                            <>
                              <p className="font-medium text-gray-900 dark:text-white">PayPal</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{method.email}</p>
                            </>
                          )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {method.isDefault && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Default
                      </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Billing History</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {invoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      $
                      {invoice.amount}
                      .00
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <InvoiceStatusBadge status={invoice.status} />
                    <a
                      href={invoice.pdfUrl}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Download PDF"
                    >
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Current Usage</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mockups Created</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">156 / Unlimited</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '15%' }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">2.4 GB / 10 GB</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '24%' }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Calls</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">8,420 / 50,000</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: '17%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0.5'
                }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Yearly
              </span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Save 20%
              </span>
            </div>

            {/* Plan Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : plan.popular
                        ? 'border-blue-200 dark:border-blue-900'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  {plan.popular && (
                    <span className="mb-2 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-2">
                    {plan.price !== null
                      ? (
                          <>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              $
                              {billingCycle === 'yearly' ? Math.round(plan.price * 0.8) : plan.price}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">/mo</span>
                          </>
                        )
                      : (
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">Custom</span>
                        )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.slice(0, 4).map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={!selectedPlan || selectedPlan === subscription.plan}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {selectedPlan === 'enterprise' ? 'Contact Sales' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
