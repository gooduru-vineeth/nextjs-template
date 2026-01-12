'use client';

import { AtSign, BadgeCheck, Calendar, Camera, Check, Link as LinkIcon, MapPin, Pencil, User } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type AuthorProfile = {
  id?: string;
  displayName: string;
  username: string;
  bio?: string;
  avatar?: string;
  isVerified?: boolean;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  website?: string;
  location?: string;
  joinDate?: string;
  coverImage?: string;
};

export type AuthorProfileEditorProps = {
  variant?: 'full' | 'compact' | 'inline' | 'card' | 'header';
  profile?: AuthorProfile;
  onChange?: (profile: AuthorProfile) => void;
  platform?: 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'generic';
  showStats?: boolean;
  showBio?: boolean;
  editable?: boolean;
  className?: string;
};

const defaultProfile: AuthorProfile = {
  displayName: 'John Doe',
  username: 'johndoe',
  bio: 'Product designer passionate about creating delightful user experiences.',
  isVerified: true,
  followerCount: 12500,
  followingCount: 450,
  postCount: 328,
  location: 'San Francisco, CA',
  website: 'johndoe.design',
};

const AuthorProfileEditor: React.FC<AuthorProfileEditorProps> = ({
  variant = 'full',
  profile = defaultProfile,
  onChange,
  platform = 'generic',
  showStats = true,
  showBio = true,
  editable = true,
  className = '',
}) => {
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile>(profile);

  useEffect(() => {
    setAuthorProfile(profile);
  }, [profile]);

  const updateField = useCallback(<K extends keyof AuthorProfile>(
    field: K,
    value: AuthorProfile[K],
  ) => {
    const newProfile = { ...authorProfile, [field]: value };
    setAuthorProfile(newProfile);
    onChange?.(newProfile);
  }, [authorProfile, onChange]);

  const formatNumber = (num?: number): string => {
    if (!num) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPlatformStyle = () => {
    switch (platform) {
      case 'twitter':
        return { accent: 'blue-500', hover: 'blue-600', bg: 'blue-50 dark:bg-blue-900/20' };
      case 'instagram':
        return { accent: 'pink-500', hover: 'pink-600', bg: 'pink-50 dark:bg-pink-900/20' };
      case 'linkedin':
        return { accent: 'blue-700', hover: 'blue-800', bg: 'blue-50 dark:bg-blue-900/20' };
      case 'facebook':
        return { accent: 'blue-600', hover: 'blue-700', bg: 'blue-50 dark:bg-blue-900/20' };
      case 'tiktok':
        return { accent: 'black dark:white', hover: 'gray-800', bg: 'gray-50 dark:bg-gray-800' };
      default:
        return { accent: 'gray-700', hover: 'gray-800', bg: 'gray-50 dark:bg-gray-800' };
    }
  };

  const platformStyle = getPlatformStyle();
  void platformStyle; // Reserved for platform-specific styling

  // Inline variant - minimal single line
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="relative">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {authorProfile.avatar
              ? (
                  <img src={authorProfile.avatar} alt={authorProfile.displayName} className="h-full w-full object-cover" />
                )
              : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                )}
          </div>
          {authorProfile.isVerified && (
            <div className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
              <Check size={10} className="text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          {editable
            ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={authorProfile.displayName}
                    onChange={e => updateField('displayName', e.target.value)}
                    className="w-full border-b border-transparent bg-transparent font-semibold text-gray-900 hover:border-gray-300 dark:text-gray-100 dark:hover:border-gray-600"
                  />
                  {authorProfile.isVerified && <BadgeCheck size={14} className="flex-shrink-0 text-blue-500" />}
                </div>
              )
            : (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{authorProfile.displayName}</span>
                  {authorProfile.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
                </div>
              )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            @
            {authorProfile.username}
          </span>
        </div>
      </div>
    );
  }

  // Card variant - profile card style
  if (variant === 'card') {
    return (
      <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {/* Cover image */}
        <div className="relative h-24 bg-gradient-to-r from-blue-400 to-purple-500">
          {authorProfile.coverImage && (
            <img src={authorProfile.coverImage} alt="Cover" className="h-full w-full object-cover" />
          )}
        </div>

        {/* Avatar */}
        <div className="relative z-10 -mt-10 px-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white dark:border-gray-800 dark:bg-gray-800">
            {authorProfile.avatar
              ? (
                  <img src={authorProfile.avatar} alt={authorProfile.displayName} className="h-full w-full object-cover" />
                )
              : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <User size={32} className="text-gray-400" />
                  </div>
                )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 pt-2">
          <div className="mb-1 flex items-center gap-2">
            {editable
              ? (
                  <input
                    type="text"
                    value={authorProfile.displayName}
                    onChange={e => updateField('displayName', e.target.value)}
                    className="border-b border-transparent bg-transparent text-lg font-bold text-gray-900 hover:border-gray-300 dark:text-gray-100 dark:hover:border-gray-600"
                  />
                )
              : (
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{authorProfile.displayName}</span>
                )}
            {authorProfile.isVerified && <BadgeCheck size={18} className="text-blue-500" />}
          </div>

          <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            @
            {editable
              ? (
                  <input
                    type="text"
                    value={authorProfile.username}
                    onChange={e => updateField('username', e.target.value)}
                    className="border-b border-transparent bg-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  />
                )
              : authorProfile.username}
          </div>

          {showBio && (
            editable
              ? (
                  <textarea
                    value={authorProfile.bio || ''}
                    onChange={e => updateField('bio', e.target.value)}
                    placeholder="Add a bio..."
                    className="w-full resize-none border-b border-transparent bg-transparent text-sm text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-600"
                    rows={2}
                  />
                )
              : (
                  authorProfile.bio && (
                    <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{authorProfile.bio}</p>
                  )
                )
          )}

          {showStats && (
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.followerCount)}</span>
                <span className="text-gray-500 dark:text-gray-400"> Followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.followingCount)}</span>
                <span className="text-gray-500 dark:text-gray-400"> Following</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Header variant - like social media profile header
  if (variant === 'header') {
    return (
      <div className={`${className}`}>
        {/* Cover */}
        <div className="relative h-32 rounded-t-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          {editable && (
            <button className="absolute right-2 bottom-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
              <Camera size={16} />
            </button>
          )}
        </div>

        {/* Profile section */}
        <div className="rounded-b-xl bg-white px-6 pb-4 dark:bg-gray-800">
          <div className="-mt-12 flex items-end justify-between">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 dark:border-gray-800 dark:bg-gray-700">
                {authorProfile.avatar
                  ? (
                      <img src={authorProfile.avatar} alt={authorProfile.displayName} className="h-full w-full object-cover" />
                    )
                  : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User size={40} className="text-gray-400" />
                      </div>
                    )}
              </div>
              {editable && (
                <button className="absolute right-0 bottom-0 rounded-full bg-blue-500 p-1.5 text-white hover:bg-blue-600">
                  <Camera size={14} />
                </button>
              )}
            </div>
            {editable && (
              <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                Edit Profile
              </button>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{authorProfile.displayName}</span>
              {authorProfile.isVerified && <BadgeCheck size={20} className="text-blue-500" />}
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              @
              {authorProfile.username}
            </p>

            {showBio && authorProfile.bio && (
              <p className="mt-3 text-gray-700 dark:text-gray-300">{authorProfile.bio}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {authorProfile.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {authorProfile.location}
                </span>
              )}
              {authorProfile.website && (
                <span className="flex items-center gap-1 text-blue-500">
                  <LinkIcon size={14} />
                  {authorProfile.website}
                </span>
              )}
              {authorProfile.joinDate && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Joined
                  {' '}
                  {authorProfile.joinDate}
                </span>
              )}
            </div>

            {showStats && (
              <div className="mt-3 flex gap-4 text-sm">
                <span>
                  <strong className="text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.followingCount)}</strong>
                  <span className="text-gray-500 dark:text-gray-400"> Following</span>
                </span>
                <span>
                  <strong className="text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.followerCount)}</strong>
                  <span className="text-gray-500 dark:text-gray-400"> Followers</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        <div className="mb-4 flex items-center gap-3">
          <div className="relative">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              {authorProfile.avatar
                ? (
                    <img src={authorProfile.avatar} alt={authorProfile.displayName} className="h-full w-full object-cover" />
                  )
                : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={24} className="text-gray-400" />
                    </div>
                  )}
            </div>
            {editable && (
              <button className="absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-1 text-white">
                <Pencil size={10} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              {editable
                ? (
                    <input
                      type="text"
                      value={authorProfile.displayName}
                      onChange={e => updateField('displayName', e.target.value)}
                      className="border-b border-transparent bg-transparent font-semibold text-gray-900 hover:border-gray-300 dark:text-gray-100 dark:hover:border-gray-600"
                    />
                  )
                : (
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{authorProfile.displayName}</span>
                  )}
              {authorProfile.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
              {editable && (
                <button
                  onClick={() => updateField('isVerified', !authorProfile.isVerified)}
                  className="p-0.5 text-gray-400 hover:text-blue-500"
                  title="Toggle verification"
                >
                  <BadgeCheck size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <AtSign size={12} />
              {editable
                ? (
                    <input
                      type="text"
                      value={authorProfile.username}
                      onChange={e => updateField('username', e.target.value)}
                      className="border-b border-transparent bg-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    />
                  )
                : (
                    <span>{authorProfile.username}</span>
                  )}
            </div>
          </div>
        </div>

        {showStats && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.postCount)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
            </div>
            <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.followerCount)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
            </div>
            <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{formatNumber(authorProfile.followingCount)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
          <User size={18} />
          Author Profile
        </h4>
      </div>

      {/* Avatar section */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              {authorProfile.avatar
                ? (
                    <img src={authorProfile.avatar} alt={authorProfile.displayName} className="h-full w-full object-cover" />
                  )
                : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={32} className="text-gray-400" />
                    </div>
                  )}
            </div>
            {editable && (
              <button className="absolute right-0 bottom-0 rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600">
                <Camera size={14} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Profile picture</p>
            {editable && (
              <div className="flex gap-2">
                <button className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600">
                  Upload
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-4 p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            value={authorProfile.displayName}
            onChange={e => updateField('displayName', e.target.value)}
            disabled={!editable}
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <div className="flex items-center">
            <span className="rounded-l-lg border border-r-0 border-gray-200 bg-gray-200 px-3 py-2 text-gray-500 dark:border-gray-700 dark:bg-gray-700">
              @
            </span>
            <input
              type="text"
              value={authorProfile.username}
              onChange={e => updateField('username', e.target.value)}
              disabled={!editable}
              className="flex-1 rounded-r-lg border border-gray-200 bg-gray-100 px-3 py-2 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>

        {showBio && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={authorProfile.bio || ''}
              onChange={e => updateField('bio', e.target.value)}
              disabled={!editable}
              rows={3}
              placeholder="Write a short bio..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <BadgeCheck size={18} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified Badge</span>
          </div>
          <button
            onClick={() => updateField('isVerified', !authorProfile.isVerified)}
            disabled={!editable}
            className={`h-6 w-12 rounded-full transition-colors disabled:opacity-60 ${
              authorProfile.isVerified ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                authorProfile.isVerified ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {showStats && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stats
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Followers</label>
                <input
                  type="number"
                  value={authorProfile.followerCount || 0}
                  onChange={e => updateField('followerCount', Number(e.target.value))}
                  disabled={!editable}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Following</label>
                <input
                  type="number"
                  value={authorProfile.followingCount || 0}
                  onChange={e => updateField('followingCount', Number(e.target.value))}
                  disabled={!editable}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Posts</label>
                <input
                  type="number"
                  value={authorProfile.postCount || 0}
                  onChange={e => updateField('postCount', Number(e.target.value))}
                  disabled={!editable}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfileEditor;
