'use client';

import type { SocialAppearance, SocialMockupData } from '@/types/Mockup';

type SponsoredPostMockupProps = {
  data: SocialMockupData;
  appearance?: SocialAppearance;
  platform?: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  adConfig?: {
    ctaText?: string;
    ctaUrl?: string;
    sponsoredLabel?: string;
    targetingInfo?: string;
    impressions?: number;
    reach?: number;
    clicks?: number;
    ctr?: number;
  };
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function SponsoredPostMockup({
  data,
  appearance,
  platform = 'facebook',
  adConfig = {},
}: SponsoredPostMockupProps) {
  const isDark = appearance?.theme === 'dark';
  const showEngagement = appearance?.showEngagement !== false;

  const {
    ctaText = 'Learn More',
    sponsoredLabel = 'Sponsored',
    targetingInfo = '',
    impressions = 0,
    reach = 0,
    clicks = 0,
    ctr = 0,
  } = adConfig;

  // Platform-specific styling
  const getPlatformStyles = () => {
    switch (platform) {
      case 'instagram':
        return {
          width: 'w-[400px]',
          primaryColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
          ctaColor: 'bg-blue-500 hover:bg-blue-600',
          borderRadius: 'rounded-none',
          sponsoredStyle: 'text-gray-400 text-xs',
        };
      case 'linkedin':
        return {
          width: 'w-[550px]',
          primaryColor: 'bg-[#0077b5]',
          ctaColor: 'bg-[#0077b5] hover:bg-[#005885]',
          borderRadius: 'rounded-lg',
          sponsoredStyle: 'text-gray-500 text-xs',
        };
      case 'twitter':
        return {
          width: 'w-[550px]',
          primaryColor: 'bg-black',
          ctaColor: 'bg-black hover:bg-gray-800',
          borderRadius: 'rounded-2xl',
          sponsoredStyle: 'text-gray-500 text-xs',
        };
      default: // Facebook
        return {
          width: 'w-[500px]',
          primaryColor: 'bg-[#1877f2]',
          ctaColor: 'bg-[#1877f2] hover:bg-[#166fe5]',
          borderRadius: 'rounded-lg',
          sponsoredStyle: 'text-gray-500 text-xs',
        };
    }
  };

  const styles = getPlatformStyles();
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${styles.width} ${styles.borderRadius} border ${borderColor} ${bgColor} overflow-hidden shadow-lg`}>
      {/* Ad Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Profile Avatar */}
          <div className="size-10 overflow-hidden rounded-full bg-gray-200">
            {data.author.avatarUrl
              ? (
                  <img src={data.author.avatarUrl} alt={data.author.name} className="size-full object-cover" />
                )
              : (
                  <div className={`flex size-full items-center justify-center ${styles.primaryColor} text-lg font-bold text-white`}>
                    {data.author.name.charAt(0)}
                  </div>
                )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className={`font-semibold ${textColor}`}>{data.author.name}</span>
              {data.post.isVerified && (
                <svg className="size-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={styles.sponsoredStyle}>{sponsoredLabel}</span>
              {targetingInfo && (
                <>
                  <span className={secondaryText}>·</span>
                  <span className={`text-xs ${secondaryText}`}>{targetingInfo}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sponsored Badge */}
        <div className={`rounded-full px-2 py-0.5 text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          Ad
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className={`text-sm ${textColor}`}>{data.post.content}</p>
        {/* Hashtags */}
        {data.post.hashtags && data.post.hashtags.length > 0 && (
          <p className="mt-2 text-sm text-blue-500">
            {data.post.hashtags.map(tag => `#${tag}`).join(' ')}
          </p>
        )}
      </div>

      {/* Media */}
      {data.post.mediaUrls && data.post.mediaUrls.length > 0 && (
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={data.post.mediaUrls[0]}
            alt="Ad media"
            className="size-full object-cover"
          />
          {/* Overlay for video indicator if needed */}
          {data.post.mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="flex size-16 items-center justify-center rounded-full bg-white/80">
                <svg className="size-8 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA Section */}
      <div className={`flex items-center justify-between border-t ${borderColor} p-4`}>
        <div className="flex flex-col">
          <span className={`text-sm font-semibold ${textColor}`}>{data.author.name}</span>
          <span className={`text-xs ${secondaryText}`}>
            {data.post.content.length > 50 ? `${data.post.content.substring(0, 50)}...` : data.post.content}
          </span>
        </div>
        <button className={`${styles.ctaColor} rounded-lg px-6 py-2 text-sm font-semibold text-white transition-colors`}>
          {ctaText}
        </button>
      </div>

      {/* Engagement Stats */}
      {showEngagement && (
        <div className={`flex items-center justify-between border-t ${borderColor} px-4 py-3`}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <svg className={`size-5 ${secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className={`text-sm ${secondaryText}`}>{formatNumber(data.post.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className={`size-5 ${secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className={`text-sm ${secondaryText}`}>{formatNumber(data.post.comments)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className={`size-5 ${secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className={`text-sm ${secondaryText}`}>{formatNumber(data.post.shares)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Ad Performance Metrics (Optional) */}
      {(impressions > 0 || reach > 0 || clicks > 0) && (
        <div className={`border-t ${borderColor} px-4 py-3`}>
          <p className={`mb-2 text-xs font-semibold ${secondaryText}`}>AD PERFORMANCE</p>
          <div className="grid grid-cols-4 gap-4">
            {impressions > 0 && (
              <div>
                <p className={`text-lg font-bold ${textColor}`}>{formatNumber(impressions)}</p>
                <p className={`text-xs ${secondaryText}`}>Impressions</p>
              </div>
            )}
            {reach > 0 && (
              <div>
                <p className={`text-lg font-bold ${textColor}`}>{formatNumber(reach)}</p>
                <p className={`text-xs ${secondaryText}`}>Reach</p>
              </div>
            )}
            {clicks > 0 && (
              <div>
                <p className={`text-lg font-bold ${textColor}`}>{formatNumber(clicks)}</p>
                <p className={`text-xs ${secondaryText}`}>Clicks</p>
              </div>
            )}
            {ctr > 0 && (
              <div>
                <p className={`text-lg font-bold ${textColor}`}>
                  {ctr.toFixed(2)}
                  %
                </p>
                <p className={`text-xs ${secondaryText}`}>CTR</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
