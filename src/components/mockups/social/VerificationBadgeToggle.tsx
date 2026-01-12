'use client';

import {
  Award,
  Building,
  CheckCircle,
  ChevronDown,
  Crown,
  Music,
  Shield,
  Sparkles,
  Star,
  Verified,
  Zap,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

export type BadgeType = 'verified' | 'official' | 'creator' | 'business' | 'government' | 'music' | 'gold' | 'premium' | 'partner' | 'none';
export type BadgePlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'generic';

export type BadgeConfig = {
  type: BadgeType;
  platform?: BadgePlatform;
  customColor?: string;
  customIcon?: React.ReactNode;
  tooltip?: string;
};

export type VerificationBadgeToggleProps = {
  badge: BadgeConfig;
  onChange: (badge: BadgeConfig) => void;
  variant?: 'full' | 'compact' | 'inline' | 'dropdown' | 'icon-only';
  showPlatformOptions?: boolean;
  allowCustom?: boolean;
  className?: string;
};

export default function VerificationBadgeToggle({
  badge,
  onChange,
  variant = 'full',
  showPlatformOptions = true,
  allowCustom = false,
  className = '',
}: VerificationBadgeToggleProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const badgeTypes: { type: BadgeType; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    { type: 'none', label: 'None', icon: null, color: 'gray', description: 'No badge' },
    { type: 'verified', label: 'Verified', icon: <CheckCircle size={16} />, color: 'blue', description: 'Standard verified account' },
    { type: 'official', label: 'Official', icon: <Shield size={16} />, color: 'blue', description: 'Official organization' },
    { type: 'creator', label: 'Creator', icon: <Star size={16} />, color: 'purple', description: 'Content creator' },
    { type: 'business', label: 'Business', icon: <Building size={16} />, color: 'gray', description: 'Business account' },
    { type: 'government', label: 'Government', icon: <Shield size={16} />, color: 'gray', description: 'Government entity' },
    { type: 'music', label: 'Music', icon: <Music size={16} />, color: 'pink', description: 'Music artist' },
    { type: 'gold', label: 'Gold', icon: <Verified size={16} />, color: 'yellow', description: 'Gold verified (paid)' },
    { type: 'premium', label: 'Premium', icon: <Crown size={16} />, color: 'gold', description: 'Premium subscriber' },
    { type: 'partner', label: 'Partner', icon: <Award size={16} />, color: 'purple', description: 'Platform partner' },
  ];

  const platforms: { id: BadgePlatform; label: string }[] = [
    { id: 'generic', label: 'Generic' },
    { id: 'twitter', label: 'Twitter/X' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
  ];

  const defaultColorStyle = { bg: 'bg-gray-500', text: 'text-gray-500', border: 'border-gray-500', hover: 'hover:bg-gray-50 dark:hover:bg-gray-800' };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; hover: string }> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20' },
      gray: defaultColorStyle,
      pink: { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', hover: 'hover:bg-pink-50 dark:hover:bg-pink-900/20' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500', hover: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20' },
      gold: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20' },
    };
    return colors[color] || defaultColorStyle;
  };

  const handleTypeChange = useCallback((type: BadgeType) => {
    onChange({ ...badge, type });
    setIsDropdownOpen(false);
  }, [badge, onChange]);

  const handlePlatformChange = useCallback((platform: BadgePlatform) => {
    onChange({ ...badge, platform });
  }, [badge, onChange]);

  const currentBadge = badgeTypes.find(b => b.type === badge.type) || badgeTypes[0]!;
  const currentColors = getColorClasses(currentBadge.color) || defaultColorStyle;

  const renderBadgePreview = (size: 'sm' | 'md' | 'lg' = 'md') => {
    if (badge.type === 'none') {
      return null;
    }

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const iconSize = size === 'sm' ? 10 : size === 'md' ? 12 : 14;

    return (
      <div className={`${sizeClasses[size]} ${currentColors.bg} flex items-center justify-center rounded-full text-white`}>
        {badge.customIcon || (currentBadge.icon && React.cloneElement(currentBadge.icon as React.ReactElement<{ size?: number }>, {
          size: iconSize,
        }))}
      </div>
    );
  };

  // Icon-only variant
  if (variant === 'icon-only') {
    return (
      <button
        onClick={() => {
          const currentIndex = badgeTypes.findIndex(b => b.type === badge.type);
          const nextIndex = (currentIndex + 1) % badgeTypes.length;
          handleTypeChange(badgeTypes[nextIndex]!.type);
        }}
        className={`rounded-lg p-2 transition-colors ${currentColors.hover} ${className}`}
        title={`Badge: ${currentBadge.label}`}
      >
        {renderBadgePreview('md') || <Sparkles size={20} className="text-gray-400" />}
      </button>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-600 dark:text-gray-400">Badge:</span>
        <div className="flex items-center gap-1">
          {badgeTypes.slice(0, 5).map(badgeOption => (
            <button
              key={badgeOption.type}
              onClick={() => handleTypeChange(badgeOption.type)}
              className={`rounded p-1.5 transition-colors ${
                badge.type === badgeOption.type
                  ? `${getColorClasses(badgeOption.color).bg} text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              title={badgeOption.label}
            >
              {badgeOption.icon || <Zap size={14} className="opacity-30" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="dark:hover:bg-gray-750 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        >
          {renderBadgePreview('sm') || <Sparkles size={16} className="text-gray-400" />}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentBadge.label}</span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="max-h-64 overflow-y-auto p-2">
              {badgeTypes.map((badgeOption) => {
                const colors = getColorClasses(badgeOption.color) || defaultColorStyle;
                return (
                  <button
                    key={badgeOption.type}
                    onClick={() => handleTypeChange(badgeOption.type)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      badge.type === badgeOption.type
                        ? `${colors.bg} text-white`
                        : `text-gray-700 dark:text-gray-300 ${colors.hover}`
                    }`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      badge.type === badgeOption.type ? 'bg-white/20' : colors.bg
                    } ${badge.type === badgeOption.type ? '' : 'text-white'}`}
                    >
                      {badgeOption.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{badgeOption.label}</div>
                      <div className={`text-xs ${badge.type === badgeOption.type ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                        {badgeOption.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {renderBadgePreview('md') || <Sparkles size={20} className="text-gray-400" />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentBadge.label}
              {' '}
              Badge
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {badgeTypes.map((badgeOption) => {
            const colors = getColorClasses(badgeOption.color) || defaultColorStyle;
            return (
              <button
                key={badgeOption.type}
                onClick={() => handleTypeChange(badgeOption.type)}
                className={`rounded-lg p-2 transition-colors ${
                  badge.type === badgeOption.type
                    ? `${colors.bg} text-white`
                    : `bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600`
                }`}
                title={badgeOption.label}
              >
                {badgeOption.icon || <Zap size={16} className="opacity-30" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full ${currentColors.bg} flex items-center justify-center text-white`}>
            <Verified size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Verification Badge</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Configure the verification badge appearance</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border-b border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm dark:bg-gray-800">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700" />
            <span className="font-semibold text-gray-900 dark:text-white">Username</span>
            {renderBadgePreview('md')}
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">Preview of badge appearance</p>
      </div>

      {/* Badge Type Selection */}
      <div className="space-y-4 p-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Badge Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {badgeTypes.map((badgeOption) => {
              const colors = getColorClasses(badgeOption.color) || defaultColorStyle;
              return (
                <button
                  key={badgeOption.type}
                  onClick={() => handleTypeChange(badgeOption.type)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
                    badge.type === badgeOption.type
                      ? `${colors.border} ${colors.bg} border-2 text-white`
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    badge.type === badgeOption.type ? 'bg-white/20' : `${colors.bg} text-white`
                  }`}
                  >
                    {badgeOption.icon || <Zap size={12} className="opacity-50" />}
                  </div>
                  <span className="text-sm font-medium">{badgeOption.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Platform Selection */}
        {showPlatformOptions && badge.type !== 'none' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform Style
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformChange(platform.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                    badge.platform === platform.id
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Color */}
        {allowCustom && badge.type !== 'none' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={badge.customColor || '#3B82F6'}
                onChange={e => onChange({ ...badge, customColor: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-600"
              />
              <input
                type="text"
                value={badge.customColor || '#3B82F6'}
                onChange={e => onChange({ ...badge, customColor: e.target.value })}
                placeholder="#3B82F6"
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
          </div>
        )}

        {/* Tooltip */}
        {badge.type !== 'none' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tooltip Text
            </label>
            <input
              type="text"
              value={badge.tooltip || currentBadge.description}
              onChange={e => onChange({ ...badge, tooltip: e.target.value })}
              placeholder="Hover tooltip text"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
            />
          </div>
        )}
      </div>
    </div>
  );
}
