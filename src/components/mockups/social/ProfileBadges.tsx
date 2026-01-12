'use client';

import { Award, BadgeCheck, Check, Crown, Flame, Heart, Shield, Sparkles, Star, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type Badge = {
  id: string;
  type: 'verified' | 'premium' | 'creator' | 'official' | 'partner' | 'staff' | 'vip' | 'top-fan' | 'new' | 'custom';
  label: string;
  color: string;
  bgColor: string;
  icon: string;
};

export type ProfileBadgesProps = {
  variant?: 'full' | 'compact' | 'inline' | 'icon-only';
  badges?: Badge[];
  onBadgesChange?: (badges: Badge[]) => void;
  editable?: boolean;
  platform?: 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'generic';
  maxBadges?: number;
  showTooltip?: boolean;
  className?: string;
};

const defaultBadges: Badge[] = [
  { id: 'verified', type: 'verified', label: 'Verified', color: '#1D9BF0', bgColor: '#E8F5FE', icon: 'check' },
  { id: 'premium', type: 'premium', label: 'Premium', color: '#FFD700', bgColor: '#FFF9E6', icon: 'crown' },
  { id: 'creator', type: 'creator', label: 'Creator', color: '#9333EA', bgColor: '#F3E8FF', icon: 'sparkles' },
  { id: 'official', type: 'official', label: 'Official', color: '#059669', bgColor: '#ECFDF5', icon: 'shield' },
  { id: 'partner', type: 'partner', label: 'Partner', color: '#DC2626', bgColor: '#FEF2F2', icon: 'star' },
  { id: 'staff', type: 'staff', label: 'Staff', color: '#7C3AED', bgColor: '#EDE9FE', icon: 'zap' },
  { id: 'vip', type: 'vip', label: 'VIP', color: '#F59E0B', bgColor: '#FFFBEB', icon: 'award' },
  { id: 'top-fan', type: 'top-fan', label: 'Top Fan', color: '#EC4899', bgColor: '#FDF2F8', icon: 'heart' },
  { id: 'new', type: 'new', label: 'New', color: '#10B981', bgColor: '#ECFDF5', icon: 'flame' },
];

const platformBadges: Record<string, Badge[]> = {
  twitter: [
    { id: 'blue', type: 'verified', label: 'Blue', color: '#1D9BF0', bgColor: '#E8F5FE', icon: 'check' },
    { id: 'gold', type: 'official', label: 'Gold', color: '#FFB800', bgColor: '#FFF9E6', icon: 'check' },
    { id: 'gray', type: 'official', label: 'Government', color: '#829AAB', bgColor: '#F1F5F9', icon: 'check' },
  ],
  instagram: [
    { id: 'verified', type: 'verified', label: 'Verified', color: '#0095F6', bgColor: '#E8F5FE', icon: 'check' },
  ],
  linkedin: [
    { id: 'premium', type: 'premium', label: 'Premium', color: '#B8860B', bgColor: '#FFF9E6', icon: 'crown' },
    { id: 'creator', type: 'creator', label: 'Creator Mode', color: '#0A66C2', bgColor: '#E8F4FE', icon: 'sparkles' },
  ],
  facebook: [
    { id: 'verified', type: 'verified', label: 'Verified', color: '#1877F2', bgColor: '#E8F4FE', icon: 'check' },
    { id: 'top-fan', type: 'top-fan', label: 'Top Fan', color: '#9D38BD', bgColor: '#F5E9FA', icon: 'star' },
  ],
  tiktok: [
    { id: 'verified', type: 'verified', label: 'Verified', color: '#25F4EE', bgColor: '#E6FFFD', icon: 'check' },
  ],
  youtube: [
    { id: 'verified', type: 'verified', label: 'Official Artist', color: '#FF0000', bgColor: '#FEE2E2', icon: 'check' },
    { id: 'member', type: 'premium', label: 'Member', color: '#065FD4', bgColor: '#E8F4FE', icon: 'heart' },
  ],
  generic: defaultBadges,
};

const ProfileBadges: React.FC<ProfileBadgesProps> = ({
  variant = 'full',
  badges,
  onBadgesChange,
  editable = false,
  platform = 'generic',
  maxBadges = 3,
  showTooltip = true,
  className = '',
}) => {
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>(badges || []);
  const availableBadges = platformBadges[platform] || defaultBadges;

  useEffect(() => {
    if (badges) {
      setSelectedBadges(badges);
    }
  }, [badges]);

  const getIcon = (iconName: string, size: number = 12) => {
    switch (iconName) {
      case 'check':
        return <Check size={size} />;
      case 'shield':
        return <Shield size={size} />;
      case 'star':
        return <Star size={size} />;
      case 'award':
        return <Award size={size} />;
      case 'crown':
        return <Crown size={size} />;
      case 'zap':
        return <Zap size={size} />;
      case 'heart':
        return <Heart size={size} />;
      case 'flame':
        return <Flame size={size} />;
      case 'sparkles':
        return <Sparkles size={size} />;
      default:
        return <BadgeCheck size={size} />;
    }
  };

  const toggleBadge = useCallback((badge: Badge) => {
    const exists = selectedBadges.some(b => b.id === badge.id);
    let newBadges: Badge[];

    if (exists) {
      newBadges = selectedBadges.filter(b => b.id !== badge.id);
    } else {
      if (selectedBadges.length >= maxBadges) {
        return;
      }
      newBadges = [...selectedBadges, badge];
    }

    setSelectedBadges(newBadges);
    onBadgesChange?.(newBadges);
  }, [selectedBadges, maxBadges, onBadgesChange]);

  // Icon-only variant
  if (variant === 'icon-only') {
    return (
      <div className={`flex items-center gap-0.5 ${className}`}>
        {selectedBadges.map(badge => (
          <span
            key={badge.id}
            style={{ color: badge.color }}
            title={showTooltip ? badge.label : undefined}
          >
            {getIcon(badge.icon, 14)}
          </span>
        ))}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {selectedBadges.map(badge => (
          <span
            key={badge.id}
            className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium"
            style={{ color: badge.color, backgroundColor: badge.bgColor }}
            title={showTooltip ? badge.label : undefined}
          >
            {getIcon(badge.icon, 10)}
            {badge.label}
          </span>
        ))}
        {editable && selectedBadges.length < maxBadges && (
          <button
            onClick={() => {
              const nextBadge = availableBadges.find(b => !selectedBadges.some(s => s.id === b.id));
              if (nextBadge) {
                toggleBadge(nextBadge);
              }
            }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            + Add
          </button>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {selectedBadges.map(badge => (
          <div
            key={badge.id}
            className="group relative"
          >
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full"
              style={{ color: badge.color, backgroundColor: badge.bgColor }}
            >
              {getIcon(badge.icon, 12)}
            </span>
            {showTooltip && (
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                {badge.label}
              </div>
            )}
            {editable && (
              <button
                onClick={() => toggleBadge(badge)}
                className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {editable && selectedBadges.length < maxBadges && (
          <button
            className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-500 dark:border-gray-600"
            title="Add badge"
          >
            +
          </button>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <BadgeCheck size={18} />
            Profile Badges
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedBadges.length}
            /
            {maxBadges}
            {' '}
            selected
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add verification and status badges to your profile
        </p>
      </div>

      {/* Selected badges */}
      {selectedBadges.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Selected</div>
          <div className="flex flex-wrap gap-2">
            {selectedBadges.map(badge => (
              <div
                key={badge.id}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{ backgroundColor: badge.bgColor }}
              >
                <span style={{ color: badge.color }}>{getIcon(badge.icon, 16)}</span>
                <span className="text-sm font-medium" style={{ color: badge.color }}>
                  {badge.label}
                </span>
                {editable && (
                  <button
                    onClick={() => toggleBadge(badge)}
                    className="text-gray-400 transition-colors hover:text-red-500"
                  >
                    <Check size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available badges */}
      {editable && (
        <div className="p-4">
          <div className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            Available Badges (
            {platform}
            )
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {availableBadges.map((badge) => {
              const isSelected = selectedBadges.some(b => b.id === badge.id);
              const isDisabled = !isSelected && selectedBadges.length >= maxBadges;

              return (
                <button
                  key={badge.id}
                  onClick={() => toggleBadge(badge)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 rounded-lg border p-3 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDisabled
                        ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                  }`}
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: badge.bgColor, color: badge.color }}
                  >
                    {getIcon(badge.icon, 16)}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {badge.label}
                    </div>
                    <div className="text-xs text-gray-500 capitalize dark:text-gray-400">
                      {badge.type.replace('-', ' ')}
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={16} className="ml-auto text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview */}
      {selectedBadges.length > 0 && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Preview</div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-800 dark:text-gray-200">Username</span>
                {selectedBadges.map(badge => (
                  <span key={badge.id} style={{ color: badge.color }} title={badge.label}>
                    {getIcon(badge.icon, 14)}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">@username</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBadges;
