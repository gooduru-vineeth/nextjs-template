'use client';

import { Check, Clock, Copy, ExternalLink, Eye, Facebook, Link, Linkedin, Lock, Mail, QrCode, RefreshCw, Settings, Share2, Twitter, Users } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ShareLinkSettings = {
  url: string;
  isPublic: boolean;
  requiresPassword: boolean;
  password?: string;
  expiresAt?: Date;
  expiresInDays?: number;
  viewLimit?: number;
  viewCount?: number;
  allowDownload?: boolean;
  allowComments?: boolean;
  showWatermark?: boolean;
};

export type ShareLinkGeneratorProps = {
  variant?: 'full' | 'compact' | 'minimal' | 'modal';
  settings?: ShareLinkSettings;
  onChange?: (settings: ShareLinkSettings) => void;
  onShare?: (platform: string) => void;
  mockupTitle?: string;
  showQRCode?: boolean;
  showSocialShare?: boolean;
  className?: string;
};

const defaultSettings: ShareLinkSettings = {
  url: 'https://mockflow.app/share/abc123xyz',
  isPublic: true,
  requiresPassword: false,
  allowDownload: true,
  allowComments: false,
  showWatermark: false,
  viewCount: 0,
};

const ShareLinkGenerator: React.FC<ShareLinkGeneratorProps> = ({
  variant = 'full',
  settings = defaultSettings,
  onChange,
  onShare,
  mockupTitle = 'My Mockup',
  showQRCode = true,
  showSocialShare = true,
  className = '',
}) => {
  const [linkSettings, setLinkSettings] = useState<ShareLinkSettings>(settings);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLinkSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof ShareLinkSettings>(
    key: K,
    value: ShareLinkSettings[K],
  ) => {
    const newSettings = { ...linkSettings, [key]: value };
    setLinkSettings(newSettings);
    onChange?.(newSettings);
  }, [linkSettings, onChange]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(linkSettings.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [linkSettings.url]);

  const regenerateLink = useCallback(() => {
    const newUrl = `https://mockflow.app/share/${Math.random().toString(36).substring(2, 15)}`;
    updateSetting('url', newUrl);
  }, [updateSetting]);

  const shareToSocial = useCallback((platform: string) => {
    const shareText = `Check out my mockup: ${mockupTitle}`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(linkSettings.url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkSettings.url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkSettings.url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${linkSettings.url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    onShare?.(platform);
  }, [linkSettings.url, mockupTitle, onShare]);

  const expirationOptions = [
    { label: 'Never', value: 0 },
    { label: '1 day', value: 1 },
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
    { label: '90 days', value: 90 },
  ];

  // Minimal variant - just the link and copy button
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
          <Link size={14} className="flex-shrink-0 text-gray-400" />
          <span className="truncate text-sm text-gray-600 dark:text-gray-400">{linkSettings.url}</span>
        </div>
        <button
          onClick={copyLink}
          className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        {/* Link */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
            <Link size={14} className="flex-shrink-0 text-gray-400" />
            <input
              type="text"
              value={linkSettings.url}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-600 outline-none dark:text-gray-400"
            />
          </div>
          <button
            onClick={copyLink}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Quick options */}
        <div className="mb-4 flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={linkSettings.isPublic}
              onChange={e => updateSetting('isPublic', e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Public</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={linkSettings.requiresPassword}
              onChange={e => updateSetting('requiresPassword', e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Password</span>
          </label>
        </div>

        {/* Social share */}
        {showSocialShare && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Share:</span>
            <button
              onClick={() => shareToSocial('twitter')}
              className="rounded p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Twitter size={16} />
            </button>
            <button
              onClick={() => shareToSocial('linkedin')}
              className="rounded p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
            >
              <Linkedin size={16} />
            </button>
            <button
              onClick={() => shareToSocial('email')}
              className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <Mail size={16} />
            </button>
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
          <Share2 size={18} />
          Share Link
        </h4>
      </div>

      {/* Link section */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-3 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
            <Link size={16} className="flex-shrink-0 text-gray-400" />
            <input
              type="text"
              value={linkSettings.url}
              readOnly
              className="flex-1 bg-transparent text-gray-700 outline-none dark:text-gray-300"
            />
          </div>
          <button
            onClick={copyLink}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={regenerateLink}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <RefreshCw size={14} />
            Generate new link
          </button>
          <a
            href={linkSettings.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            <ExternalLink size={14} />
            Open link
          </a>
        </div>
      </div>

      {/* Privacy settings */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-4 flex items-center gap-2">
          <Settings size={16} className="text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Privacy Settings</span>
        </div>

        <div className="space-y-4">
          {/* Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Anyone with link can view</span>
            </div>
            <button
              onClick={() => updateSetting('isPublic', !linkSettings.isPublic)}
              className={`h-6 w-12 rounded-full transition-colors ${
                linkSettings.isPublic ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  linkSettings.isPublic ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Password protection */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Password protected</span>
              </div>
              <button
                onClick={() => updateSetting('requiresPassword', !linkSettings.requiresPassword)}
                className={`h-6 w-12 rounded-full transition-colors ${
                  linkSettings.requiresPassword ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    linkSettings.requiresPassword ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            {linkSettings.requiresPassword && (
              <div className="ml-6">
                <input
                  type="password"
                  value={linkSettings.password || ''}
                  onChange={e => updateSetting('password', e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                />
              </div>
            )}
          </div>

          {/* Expiration */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Link expires</span>
            </div>
            <select
              value={linkSettings.expiresInDays || 0}
              onChange={e => updateSetting('expiresInDays', Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {expirationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View limit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">View limit</span>
            </div>
            <input
              type="number"
              value={linkSettings.viewLimit || ''}
              onChange={e => updateSetting('viewLimit', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Unlimited"
              className="w-24 rounded-lg border border-gray-200 bg-gray-100 px-3 py-1.5 text-right text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Viewer Permissions</div>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Allow download</span>
            <input
              type="checkbox"
              checked={linkSettings.allowDownload}
              onChange={e => updateSetting('allowDownload', e.target.checked)}
              className="h-4 w-4 rounded"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Allow comments</span>
            <input
              type="checkbox"
              checked={linkSettings.allowComments}
              onChange={e => updateSetting('allowComments', e.target.checked)}
              className="h-4 w-4 rounded"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show watermark</span>
            <input
              type="checkbox"
              checked={linkSettings.showWatermark}
              onChange={e => updateSetting('showWatermark', e.target.checked)}
              className="h-4 w-4 rounded"
            />
          </label>
        </div>
      </div>

      {/* Social sharing */}
      {showSocialShare && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Share on Social</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex items-center gap-2 rounded-lg bg-[#1DA1F2]/10 px-4 py-2 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
            >
              <Twitter size={18} />
              <span className="text-sm">Twitter</span>
            </button>
            <button
              onClick={() => shareToSocial('linkedin')}
              className="flex items-center gap-2 rounded-lg bg-[#0077B5]/10 px-4 py-2 text-[#0077B5] hover:bg-[#0077B5]/20"
            >
              <Linkedin size={18} />
              <span className="text-sm">LinkedIn</span>
            </button>
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex items-center gap-2 rounded-lg bg-[#1877F2]/10 px-4 py-2 text-[#1877F2] hover:bg-[#1877F2]/20"
            >
              <Facebook size={18} />
              <span className="text-sm">Facebook</span>
            </button>
            <button
              onClick={() => shareToSocial('email')}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Mail size={18} />
              <span className="text-sm">Email</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Code */}
      {showQRCode && (
        <div className="p-4">
          <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">QR Code</div>
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <QrCode size={64} className="text-gray-400" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Scan to open on mobile</p>
              <button className="mt-1 text-blue-600 hover:underline dark:text-blue-400">
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {linkSettings.viewCount !== undefined && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total views</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{linkSettings.viewCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareLinkGenerator;
