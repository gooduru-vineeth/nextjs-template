'use client';
import {
  ArrowRight,
  Building,
  Check,
  Crown,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react';

export type TierType = 'free' | 'pro' | 'team' | 'enterprise';

export type TierFeature = {
  text: string;
  included: boolean;
  highlight?: boolean;
};

export type SubscriptionTier = {
  id: TierType;
  name: string;
  description: string;
  price: number | null;
  priceLabel?: string;
  billingPeriod?: 'monthly' | 'yearly';
  features: TierFeature[];
  ctaText: string;
  popular?: boolean;
  discount?: number;
};

export type SubscriptionTierCardProps = {
  tier: SubscriptionTier;
  currentTier?: TierType;
  onSelect: (tier: SubscriptionTier) => void;
  variant?: 'full' | 'compact' | 'minimal' | 'horizontal';
  showFeatures?: boolean;
  billingToggle?: boolean;
  className?: string;
};

export default function SubscriptionTierCard({
  tier,
  currentTier,
  onSelect,
  variant = 'full',
  showFeatures = true,
  className = '',
}: SubscriptionTierCardProps) {
  const isCurrentTier = currentTier === tier.id;

  const getTierIcon = () => {
    switch (tier.id) {
      case 'free':
        return <Sparkles size={20} />;
      case 'pro':
        return <Zap size={20} />;
      case 'team':
        return <Users size={20} />;
      case 'enterprise':
        return <Building size={20} />;
      default:
        return <Star size={20} />;
    }
  };

  const getTierColors = () => {
    switch (tier.id) {
      case 'free':
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
          button: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100',
        };
      case 'pro':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      case 'team':
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-200 dark:border-purple-800',
          icon: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
          button: 'bg-purple-600 hover:bg-purple-700 text-white',
        };
      case 'enterprise':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          icon: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-gray-200 dark:border-gray-700',
          icon: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
          button: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100',
        };
    }
  };

  const colors = getTierColors();

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <button
        onClick={() => onSelect(tier)}
        className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
          isCurrentTier
            ? `${colors.border} ${colors.bg} border-2`
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
        } ${className}`}
      >
        <div className={`h-8 w-8 rounded-full ${colors.icon} flex items-center justify-center`}>
          {getTierIcon()}
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900 dark:text-white">{tier.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {tier.price !== null ? `$${tier.price}/mo` : tier.priceLabel || 'Custom'}
          </div>
        </div>
        {isCurrentTier && (
          <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Current
          </span>
        )}
      </button>
    );
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 rounded-xl border p-4 ${colors.border} ${colors.bg} ${className}`}>
        <div className={`h-12 w-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
          {getTierIcon()}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
            {tier.popular && (
              <span className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-2 py-0.5 text-xs text-white">
                Popular
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
        </div>

        <div className="text-right">
          {tier.price !== null
            ? (
                <>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    $
                    {tier.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    /
                    {tier.billingPeriod || 'month'}
                  </div>
                </>
              )
            : (
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{tier.priceLabel || 'Custom'}</div>
              )}
        </div>

        <button
          onClick={() => onSelect(tier)}
          disabled={isCurrentTier}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${colors.button} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isCurrentTier ? 'Current Plan' : tier.ctaText}
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`relative rounded-xl border ${colors.border} ${colors.bg} overflow-hidden ${className}`}>
        {tier.popular && (
          <div className="absolute top-0 right-0 rounded-bl-lg bg-gradient-to-r from-orange-500 to-pink-500 px-3 py-1 text-xs font-medium text-white">
            <Crown size={12} className="mr-1 inline" />
            Popular
          </div>
        )}

        <div className="p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${colors.icon} flex items-center justify-center`}>
              {getTierIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
              {tier.price !== null
                ? (
                    <div className="text-sm">
                      <span className="font-bold text-gray-900 dark:text-white">
                        $
                        {tier.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /
                        {tier.billingPeriod || 'mo'}
                      </span>
                    </div>
                  )
                : (
                    <div className="text-sm text-gray-600 dark:text-gray-400">{tier.priceLabel || 'Custom pricing'}</div>
                  )}
            </div>
          </div>

          <button
            onClick={() => onSelect(tier)}
            disabled={isCurrentTier}
            className={`w-full rounded-lg py-2 font-medium transition-colors ${colors.button} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isCurrentTier ? 'Current Plan' : tier.ctaText}
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`relative rounded-2xl border ${tier.popular ? `border-2 ${colors.border}` : colors.border} ${colors.bg} overflow-hidden ${className}`}>
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-orange-500 to-pink-500 py-1.5 text-center text-sm font-medium text-white">
          <Crown size={14} className="-mt-0.5 mr-1.5 inline" />
          Most Popular
        </div>
      )}

      <div className={`p-6 ${tier.popular ? 'pt-12' : ''}`}>
        {/* Header */}
        <div className="mb-4 flex items-start gap-4">
          <div className={`h-12 w-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
            {getTierIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tier.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          {tier.price !== null
            ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $
                    {tier.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /
                    {tier.billingPeriod || 'month'}
                  </span>
                  {tier.discount && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Save
                      {' '}
                      {tier.discount}
                      %
                    </span>
                  )}
                </div>
              )
            : (
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{tier.priceLabel || 'Custom Pricing'}</div>
              )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSelect(tier)}
          disabled={isCurrentTier}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-colors ${colors.button} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isCurrentTier
            ? (
                <>
                  <Check size={18} />
                  Current Plan
                </>
              )
            : (
                <>
                  {tier.ctaText}
                  <ArrowRight size={18} />
                </>
              )}
        </button>

        {/* Features */}
        {showFeatures && tier.features.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">What&apos;s included:</h4>
            <ul className="space-y-3">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {feature.included
                    ? (
                        <Check size={18} className="mt-0.5 flex-shrink-0 text-green-500" />
                      )
                    : (
                        <X size={18} className="mt-0.5 flex-shrink-0 text-gray-300 dark:text-gray-600" />
                      )}
                  <span className={`text-sm ${
                    feature.included
                      ? feature.highlight
                        ? 'font-medium text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 line-through dark:text-gray-500'
                  }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
