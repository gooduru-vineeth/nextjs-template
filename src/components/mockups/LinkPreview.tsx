'use client';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type LinkPreviewData = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
};

type LinkPreviewProps = {
  link: LinkPreviewData;
  platform?: Platform;
  sender?: 'sent' | 'received';
  onClick?: () => void;
  maxWidth?: number;
  className?: string;
};

export function LinkPreview({
  link,
  platform = 'generic',
  sender = 'received',
  onClick,
  maxWidth = 320,
  className = '',
}: LinkPreviewProps) {
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getBubbleStyle = () => {
    if (platform === 'whatsapp') {
      return sender === 'sent'
        ? 'bg-[#dcf8c6] dark:bg-[#005c4b]'
        : 'bg-white dark:bg-[#202c33]';
    }
    if (platform === 'imessage') {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    if (platform === 'messenger') {
      return 'bg-gray-100 dark:bg-gray-800';
    }
    if (platform === 'telegram') {
      return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
    if (platform === 'discord') {
      return 'bg-[#2f3136] border-l-4 border-[#4f545c]';
    }
    if (platform === 'slack') {
      return 'border-l-4 border-gray-300 bg-white dark:bg-gray-800';
    }
    return 'bg-gray-100 dark:bg-gray-800';
  };

  // Discord-style embed
  if (platform === 'discord') {
    return (
      <div
        className={`cursor-pointer overflow-hidden rounded ${getBubbleStyle()} ${className}`}
        style={{ maxWidth }}
        onClick={onClick}
      >
        <div className="p-3">
          {/* Site name */}
          {(link.siteName || link.favicon) && (
            <div className="mb-1 flex items-center gap-1.5">
              {link.favicon && (
                <img src={link.favicon} alt="" className="size-4 rounded" />
              )}
              <span className="text-xs text-gray-400">{link.siteName || getDomain(link.url)}</span>
            </div>
          )}

          {/* Title */}
          {link.title && (
            <h4 className="mb-1 text-sm font-medium text-[#00b0f4] hover:underline">
              {link.title}
            </h4>
          )}

          {/* Description */}
          {link.description && (
            <p className="line-clamp-3 text-xs text-gray-300">
              {link.description}
            </p>
          )}
        </div>

        {/* Image */}
        {link.image && (
          <img
            src={link.image}
            alt={link.title || 'Preview'}
            className="w-full object-cover"
            style={{ maxHeight: 200 }}
          />
        )}
      </div>
    );
  }

  // Slack-style preview
  if (platform === 'slack') {
    return (
      <div
        className={`cursor-pointer overflow-hidden rounded-md ${getBubbleStyle()} ${className}`}
        style={{ maxWidth }}
        onClick={onClick}
      >
        <div className="flex">
          <div className="flex-1 p-3">
            {/* Site name */}
            <div className="mb-1 flex items-center gap-1.5">
              {link.favicon && (
                <img src={link.favicon} alt="" className="size-4" />
              )}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {link.siteName || getDomain(link.url)}
              </span>
            </div>

            {/* Title */}
            {link.title && (
              <h4 className="mb-1 text-sm font-bold text-[#1264a3] hover:underline dark:text-blue-400">
                {link.title}
              </h4>
            )}

            {/* Description */}
            {link.description && (
              <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                {link.description}
              </p>
            )}
          </div>

          {/* Thumbnail */}
          {link.image && (
            <div className="w-20 shrink-0">
              <img
                src={link.image}
                alt=""
                className="size-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // iMessage-style preview
  if (platform === 'imessage') {
    return (
      <div
        className={`cursor-pointer overflow-hidden rounded-xl ${getBubbleStyle()} ${className}`}
        style={{ maxWidth }}
        onClick={onClick}
      >
        {/* Image */}
        {link.image && (
          <img
            src={link.image}
            alt={link.title || 'Preview'}
            className="w-full object-cover"
            style={{ maxHeight: 180 }}
          />
        )}

        <div className="p-3">
          {/* Title */}
          {link.title && (
            <h4 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
              {link.title}
            </h4>
          )}

          {/* Domain */}
          <p className="text-xs text-gray-500">
            {getDomain(link.url)}
          </p>
        </div>
      </div>
    );
  }

  // WhatsApp-style preview
  if (platform === 'whatsapp') {
    return (
      <div
        className={`cursor-pointer overflow-hidden rounded-lg ${getBubbleStyle()} ${className}`}
        style={{ maxWidth }}
        onClick={onClick}
      >
        {/* Image */}
        {link.image && (
          <img
            src={link.image}
            alt={link.title || 'Preview'}
            className="w-full object-cover"
            style={{ maxHeight: 160 }}
          />
        )}

        <div className="p-2">
          {/* Domain with favicon */}
          <div className="mb-1 flex items-center gap-1.5">
            {link.favicon && (
              <img src={link.favicon} alt="" className="size-3" />
            )}
            <span className="text-[10px] text-gray-500 uppercase">
              {getDomain(link.url)}
            </span>
          </div>

          {/* Title */}
          {link.title && (
            <h4 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
              {link.title}
            </h4>
          )}

          {/* Description */}
          {link.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {link.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Telegram-style preview
  if (platform === 'telegram') {
    return (
      <div
        className={`cursor-pointer overflow-hidden rounded-lg ${getBubbleStyle()} ${className}`}
        style={{ maxWidth }}
        onClick={onClick}
      >
        <div className="flex">
          <div className="w-1 shrink-0 bg-[#3390ec]" />
          <div className="flex flex-1 gap-3 p-3">
            <div className="min-w-0 flex-1">
              {/* Site name */}
              <p className="mb-0.5 text-xs font-medium text-[#3390ec]">
                {link.siteName || getDomain(link.url)}
              </p>

              {/* Title */}
              {link.title && (
                <h4 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
                  {link.title}
                </h4>
              )}

              {/* Description */}
              {link.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                  {link.description}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            {link.image && (
              <div className="size-16 shrink-0 overflow-hidden rounded">
                <img
                  src={link.image}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generic/Messenger preview
  return (
    <div
      className={`cursor-pointer overflow-hidden rounded-xl ${getBubbleStyle()} ${className}`}
      style={{ maxWidth }}
      onClick={onClick}
    >
      {/* Image */}
      {link.image && (
        <img
          src={link.image}
          alt={link.title || 'Preview'}
          className="w-full object-cover"
          style={{ maxHeight: 200 }}
        />
      )}

      <div className="p-3">
        {/* Domain */}
        <p className="mb-1 text-xs text-gray-500 uppercase">
          {getDomain(link.url)}
        </p>

        {/* Title */}
        {link.title && (
          <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
            {link.title}
          </h4>
        )}

        {/* Description */}
        {link.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {link.description}
          </p>
        )}
      </div>
    </div>
  );
}

// URL text with link detection
type LinkTextProps = {
  text: string;
  onLinkClick?: (url: string) => void;
  className?: string;
};

export function LinkText({ text, onLinkClick, className = '' }: LinkTextProps) {
  const urlRegex = /(https?:\/\/\S+)/g;
  const parts = text.split(urlRegex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          urlRegex.lastIndex = 0; // Reset regex
          return (
            <button
              key={index}
              onClick={() => onLinkClick?.(part)}
              className="text-blue-500 hover:underline"
            >
              {part}
            </button>
          );
        }
        return part;
      })}
    </span>
  );
}

// Link preview loading skeleton
type LinkPreviewSkeletonProps = {
  platform?: Platform;
  maxWidth?: number;
  className?: string;
};

export function LinkPreviewSkeleton({
  platform = 'generic',
  maxWidth = 320,
  className = '',
}: LinkPreviewSkeletonProps) {
  void platform; // Reserved for future platform-specific skeletons

  return (
    <div
      className={`animate-pulse overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 ${className}`}
      style={{ maxWidth }}
    >
      {/* Image placeholder */}
      <div className="h-40 w-full bg-gray-300 dark:bg-gray-700" />

      <div className="p-3">
        {/* Domain */}
        <div className="mb-2 h-3 w-20 rounded bg-gray-300 dark:bg-gray-700" />
        {/* Title */}
        <div className="mb-1 h-4 w-full rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
        {/* Description */}
        <div className="mt-2 h-3 w-full rounded bg-gray-300 dark:bg-gray-700" />
        <div className="mt-1 h-3 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export type { LinkPreviewData };
