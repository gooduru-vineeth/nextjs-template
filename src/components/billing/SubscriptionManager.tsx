'use client';

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CreditCard,
  Crown,
  Download,
  ExternalLink,
  FileText,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
export type PlanFeature = {
  name: string;
  included: boolean;
  limit?: string | number;
  tooltip?: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PlanFeature[];
  popular?: boolean;
  enterprise?: boolean;
  mockupsLimit: number;
  storageLimit: number;
  exportsLimit: number;
  teamMembersLimit: number;
  apiAccessEnabled: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
};

export type Subscription = {
  id: string;
  planId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'paused';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  nextBillingAmount?: number;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
};

export type Invoice = {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl?: string;
};

type SubscriptionManagerProps = {
  plans: SubscriptionPlan[];
  currentSubscription?: Subscription;
  paymentMethods?: PaymentMethod[];
  invoices?: Invoice[];
  onPlanSelect?: (planId: string) => void;
  onSubscribe?: (planId: string, interval: 'month' | 'year') => void;
  onCancelSubscription?: () => void;
  onResumeSubscription?: () => void;
  onUpdatePaymentMethod?: () => void;
  onAddPaymentMethod?: () => void;
  onRemovePaymentMethod?: (methodId: string) => void;
  onSetDefaultPaymentMethod?: (methodId: string) => void;
  onDownloadInvoice?: (invoiceId: string) => void;
  onContactSales?: () => void;
  variant?: 'full' | 'plans-only' | 'billing-only';
  className?: string;
};

// Plan Card Component
function PlanCard({
  plan,
  isCurrentPlan,
  interval,
  onSelect,
  onSubscribe,
}: {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  interval: 'month' | 'year';
  onSelect?: () => void;
  onSubscribe?: () => void;
}) {
  const yearlyDiscount = interval === 'year' ? 0.8 : 1;
  const displayPrice = plan.price * yearlyDiscount;

  const getPlanIcon = () => {
    if (plan.enterprise) {
      return Building2;
    }
    if (plan.name.toLowerCase().includes('pro')) {
      return Crown;
    }
    if (plan.name.toLowerCase().includes('team')) {
      return Users;
    }
    return Zap;
  };

  const PlanIcon = getPlanIcon();

  return (
    <div
      className={`relative rounded-2xl border-2 bg-white p-6 transition-all dark:bg-gray-800 ${
        plan.popular
          ? 'border-blue-500 shadow-lg shadow-blue-500/10'
          : isCurrentPlan
            ? 'border-green-500'
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
            <Star className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
            <Check className="h-3 w-3" />
            Current Plan
          </span>
        </div>
      )}

      <div className="mb-6 text-center">
        <div className={`mb-4 inline-flex rounded-xl p-3 ${
          plan.popular ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
        }`}
        >
          <PlanIcon className={`h-6 w-6 ${plan.popular ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{plan.name}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
      </div>

      <div className="mb-6 text-center">
        {plan.enterprise
          ? (
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">Custom</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact sales for pricing</p>
              </div>
            )
          : (
              <div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-sm text-gray-500">{plan.currency}</span>
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {displayPrice.toFixed(0)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /
                    {interval}
                  </span>
                </div>
                {interval === 'year' && plan.price > 0 && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    Save 20% with annual billing
                  </p>
                )}
              </div>
            )}
      </div>

      <ul className="mb-6 space-y-3">
        {plan.features.slice(0, 6).map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included
              ? (
                  <Check className="h-5 w-5 shrink-0 text-green-500" />
                )
              : (
                  <X className="h-5 w-5 shrink-0 text-gray-300 dark:text-gray-600" />
                )}
            <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
              {feature.name}
              {feature.limit && feature.included && (
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  (
                  {feature.limit}
                  )
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {plan.enterprise
        ? (
            <button
              onClick={onSelect}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Contact Sales
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )
        : isCurrentPlan
          ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-green-100 px-4 py-3 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                Current Plan
              </button>
            )
          : (
              <button
                onClick={onSubscribe}
                className={`w-full rounded-xl px-4 py-3 font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {plan.price === 0 ? 'Get Started Free' : 'Subscribe'}
              </button>
            )}
    </div>
  );
}

// Payment Method Card Component
function PaymentMethodCard({
  method,
  onRemove,
  onSetDefault,
}: {
  method: PaymentMethod;
  onRemove?: () => void;
  onSetDefault?: () => void;
}) {
  const getBrandIcon = () => {
    switch (method.brand?.toLowerCase()) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      default:
        return '💳 Card';
    }
  };

  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${
      method.isDefault
        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
        : 'border-gray-200 dark:border-gray-700'
    }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{getBrandIcon()}</div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            •••• •••• ••••
            {' '}
            {method.last4}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Expires
            {' '}
            {method.expiryMonth}
            /
            {method.expiryYear}
          </p>
        </div>
        {method.isDefault && (
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            Default
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!method.isDefault && onSetDefault && (
          <button
            onClick={onSetDefault}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Set Default
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 transition-colors hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Invoice Row Component
function InvoiceRow({
  invoice,
  onDownload,
}: {
  invoice: Invoice;
  onDownload?: () => void;
}) {
  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
          <FileText className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {invoice.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Invoice #
            {invoice.id}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${getStatusBadge()}`}>
          {invoice.status}
        </span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {invoice.currency}
          {invoice.amount.toFixed(2)}
        </span>
        {invoice.pdfUrl && onDownload && (
          <button
            onClick={onDownload}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Main Subscription Manager Component
export function SubscriptionManager({
  plans,
  currentSubscription,
  paymentMethods = [],
  invoices = [],
  onPlanSelect,
  onSubscribe,
  onCancelSubscription,
  onResumeSubscription,
  onUpdatePaymentMethod,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultPaymentMethod,
  onDownloadInvoice,
  onContactSales,
  variant = 'full',
  className = '',
}: SubscriptionManagerProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'billing' | 'invoices'>('plans');

  const currentPlan = plans.find(p => p.id === currentSubscription?.planId);

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'trialing':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'past_due':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'canceled':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const handleSubscribe = useCallback((planId: string) => {
    onSubscribe?.(planId, billingInterval);
  }, [onSubscribe, billingInterval]);

  // Silence unused variable warnings
  void onUpdatePaymentMethod;

  if (variant === 'plans-only') {
    return (
      <div className={className}>
        {/* Billing Interval Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setBillingInterval('month')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                billingInterval === 'month'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                billingInterval === 'year'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/50 dark:text-green-300">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={plan.id === currentSubscription?.planId}
              interval={billingInterval}
              onSelect={() => plan.enterprise ? onContactSales?.() : onPlanSelect?.(plan.id)}
              onSubscribe={() => handleSubscribe(plan.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'billing-only') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Current Subscription */}
        {currentSubscription && currentPlan && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Subscription</h3>
              <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${getStatusColor(currentSubscription.status)}`}>
                {currentSubscription.status}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-4">
              <Crown className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{currentPlan.name}</p>
                <p className="text-sm text-gray-500">
                  {currentPlan.currency}
                  {currentPlan.price}
                  /
                  {currentPlan.interval}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Next billing:
                  {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{currentSubscription.nextBillingAmount && `${currentPlan.currency}${currentSubscription.nextBillingAmount}`}</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Methods</h3>
            <button
              onClick={onAddPaymentMethod}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Add new
            </button>
          </div>
          <div className="space-y-3">
            {paymentMethods.length > 0
              ? (
                  paymentMethods.map(method => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      onRemove={() => onRemovePaymentMethod?.(method.id)}
                      onSetDefault={() => onSetDefaultPaymentMethod?.(method.id)}
                    />
                  ))
                )
              : (
                  <p className="py-4 text-center text-gray-500">No payment methods added</p>
                )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Invoices</h3>
          {invoices.length > 0
            ? (
                invoices.slice(0, 5).map(invoice => (
                  <InvoiceRow
                    key={invoice.id}
                    invoice={invoice}
                    onDownload={() => onDownloadInvoice?.(invoice.id)}
                  />
                ))
              )
            : (
                <p className="py-4 text-center text-gray-500">No invoices yet</p>
              )}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subscription & Billing</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your subscription, payment methods, and invoices
        </p>
      </div>

      {/* Current Plan Alert */}
      {currentSubscription?.cancelAtPeriodEnd && (
        <div className="mx-6 mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Subscription ending soon</p>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Your subscription will end on
              {' '}
              {currentSubscription.currentPeriodEnd.toLocaleDateString()}
              .
              You will lose access to premium features.
            </p>
          </div>
          <button
            onClick={onResumeSubscription}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
          >
            Resume Subscription
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 dark:border-gray-700">
        <div className="flex gap-6">
          {[
            { id: 'plans', label: 'Plans', icon: Sparkles },
            { id: 'billing', label: 'Billing', icon: CreditCard },
            { id: 'invoices', label: 'Invoices', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'plans' && (
          <div>
            {/* Billing Interval Toggle */}
            <div className="mb-8 flex justify-center">
              <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                <button
                  onClick={() => setBillingInterval('month')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    billingInterval === 'month'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('year')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    billingInterval === 'year'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Yearly
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {plans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={plan.id === currentSubscription?.planId}
                  interval={billingInterval}
                  onSelect={() => plan.enterprise ? onContactSales?.() : onPlanSelect?.(plan.id)}
                  onSubscribe={() => handleSubscribe(plan.id)}
                />
              ))}
            </div>

            {/* Feature Comparison */}
            <div className="mt-12">
              <h3 className="mb-6 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                Compare All Features
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">Feature</th>
                      {plans.map(plan => (
                        <th key={plan.id} className="px-4 py-4 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">Mockups</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                          {plan.mockupsLimit === -1 ? 'Unlimited' : plan.mockupsLimit}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">Storage</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                          {plan.storageLimit === -1 ? 'Unlimited' : `${plan.storageLimit} GB`}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">Team Members</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="px-4 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                          {plan.teamMembersLimit === -1 ? 'Unlimited' : plan.teamMembersLimit}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">API Access</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="px-4 py-4 text-center">
                          {plan.apiAccessEnabled
                            ? (
                                <Check className="mx-auto h-5 w-5 text-green-500" />
                              )
                            : (
                                <X className="mx-auto h-5 w-5 text-gray-300" />
                              )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">Priority Support</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="px-4 py-4 text-center">
                          {plan.prioritySupport
                            ? (
                                <Check className="mx-auto h-5 w-5 text-green-500" />
                              )
                            : (
                                <X className="mx-auto h-5 w-5 text-gray-300" />
                              )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Current Subscription */}
            {currentSubscription && currentPlan && (
              <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current Subscription</h3>
                  <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${getStatusColor(currentSubscription.status)}`}>
                    {currentSubscription.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Plan</p>
                    <p className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                      <Crown className="h-4 w-4 text-blue-600" />
                      {currentPlan.name}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Billing Period</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {currentSubscription.currentPeriodStart.toLocaleDateString()}
                      {' '}
                      -
                      {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Next Payment</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {currentPlan.currency}
                      {currentSubscription.nextBillingAmount || currentPlan.price}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Change Plan
                  </button>
                  {!currentSubscription.cancelAtPeriodEnd && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Payment Methods</h3>
                <button
                  onClick={onAddPaymentMethod}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <CreditCard className="h-4 w-4" />
                  Add Payment Method
                </button>
              </div>
              <div className="space-y-3">
                {paymentMethods.length > 0
                  ? (
                      paymentMethods.map(method => (
                        <PaymentMethodCard
                          key={method.id}
                          method={method}
                          onRemove={() => onRemovePaymentMethod?.(method.id)}
                          onSetDefault={() => onSetDefaultPaymentMethod?.(method.id)}
                        />
                      ))
                    )
                  : (
                      <div className="py-8 text-center">
                        <CreditCard className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">No payment methods added</p>
                        <button
                          onClick={onAddPaymentMethod}
                          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Add Payment Method
                        </button>
                      </div>
                    )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Secure Payment Processing</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  All payment information is encrypted and securely processed. We never store your full card details.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Billing History</h3>
              <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400">
                Download All
                {' '}
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            {invoices.length > 0
              ? (
                  <div>
                    {invoices.map(invoice => (
                      <InvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        onDownload={() => onDownloadInvoice?.(invoice.id)}
                      />
                    ))}
                  </div>
                )
              : (
                  <div className="py-12 text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No invoices yet</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                      Your billing history will appear here
                    </p>
                  </div>
                )}
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Cancel Subscription?</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You will lose access to all premium features at the end of your billing period.
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your subscription will remain active until:
              </p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                {currentSubscription?.currentPeriodEnd.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  onCancelSubscription?.();
                  setShowCancelModal(false);
                }}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Plan Badge Component
export function PlanBadge({
  planName,
  className = '',
}: {
  planName: string;
  className?: string;
}) {
  const isEnterprise = planName.toLowerCase().includes('enterprise');
  const isPro = planName.toLowerCase().includes('pro');

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
        isEnterprise
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
          : isPro
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      } ${className}`}
    >
      {isEnterprise ? <Building2 className="h-3 w-3" /> : isPro ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
      {planName}
    </span>
  );
}

export default SubscriptionManager;
