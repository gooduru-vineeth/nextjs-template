'use client';

import { useState } from 'react';

type ShareOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color?: string;
  action?: () => void;
};

type ShareSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  imageUrl?: string;
  description?: string;
  onShare?: (platform: string) => void;
  showCopyLink?: boolean;
  showQRCode?: boolean;
  customOptions?: ShareOption[];
  className?: string;
};

const defaultShareOptions: ShareOption[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-black',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'bg-[#1877f2]',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: 'bg-[#0077b5]',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: 'bg-[#25d366]',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: 'bg-[#0088cc]',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: (
      <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
      </svg>
    ),
    color: 'bg-[#e60023]',
  },
];

const emailShareOption: ShareOption = {
  id: 'email',
  name: 'Email',
  icon: (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  color: 'bg-gray-600',
};

export function ShareSheet({
  isOpen,
  onClose,
  title = 'Share',
  url,
  imageUrl,
  description,
  onShare,
  showCopyLink = true,
  showQRCode = false,
  customOptions,
  className = '',
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'link' | 'embed'>('social');

  const shareOptions = customOptions || [...defaultShareOptions, emailShareOption];

  const handleShare = (platformId: string) => {
    onShare?.(platformId);

    const shareUrl = url || window.location.href;
    const shareText = description || title;

    switch (platformId) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'pinterest':
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(imageUrl || '')}&description=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, '_blank');
        break;
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = url || window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getEmbedCode = () => {
    const shareUrl = url || window.location.href;
    return `<iframe src="${shareUrl}" width="600" height="400" frameborder="0"></iframe>`;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`relative w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-gray-800 ${className}`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('social')}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'social'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Social
          </button>
          {showCopyLink && (
            <button
              onClick={() => setActiveTab('link')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'link'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Link
            </button>
          )}
          <button
            onClick={() => setActiveTab('embed')}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'embed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Embed
          </button>
        </div>

        {/* Social Share */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map(option => (
              <button
                key={option.id}
                onClick={() => option.action ? option.action() : handleShare(option.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-full text-white ${option.color || 'bg-gray-500'}`}
                >
                  {option.icon}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{option.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Copy Link */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={url || window.location.href}
                readOnly
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleCopyLink}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {showQRCode && (
              <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                <div className="flex size-32 items-center justify-center rounded-lg bg-white p-4">
                  {/* QR Code placeholder */}
                  <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm-2 8h8v8H3v-8zm2 2v4h4v-4H5zM13 3h8v8h-8V3zm2 2v4h4V5h-4zm-2 8h2v2h-2v-2zm4 0h4v2h-4v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Scan to share</p>
              </div>
            )}
          </div>
        )}

        {/* Embed Code */}
        {activeTab === 'embed' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Copy the embed code below to add this to your website:
            </p>
            <div className="relative">
              <textarea
                value={getEmbedCode()}
                readOnly
                className="h-24 w-full rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(getEmbedCode());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute top-2 right-2 rounded bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact share button
type ShareButtonProps = {
  url?: string;
  title?: string;
  onShare?: () => void;
  variant?: 'icon' | 'button';
  className?: string;
};

export function ShareButton({
  url,
  title,
  onShare,
  variant = 'button',
  className = '',
}: ShareButtonProps) {
  const handleShare = async () => {
    onShare?.();

    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          url: url || window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={`rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
        title="Share"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 ${className}`}
    >
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </button>
  );
}

export type { ShareOption };
