'use client';

type ReelData = {
  authorName: string;
  authorHandle: string;
  authorAvatarUrl?: string;
  isVerified?: boolean;
  isFollowing?: boolean;
  thumbnailUrl?: string;
  caption: string;
  hashtags?: string[];
  soundName?: string;
  soundArtist?: string;
  soundOriginal?: boolean;
  likes: number;
  comments: number;
  saves?: number;
  shares: number;
  views?: number;
  duration?: string;
  isLiked?: boolean;
  isSaved?: boolean;
};

type ReelMockupProps = {
  platform: 'tiktok' | 'instagram-reels' | 'youtube-shorts';
  data: ReelData;
  appearance?: {
    theme?: 'light' | 'dark';
    showEngagement?: boolean;
    showCaption?: boolean;
    showSound?: boolean;
    deviceFrame?: boolean;
  };
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function ReelMockup({ platform, data, appearance = {} }: ReelMockupProps) {
  const {
    showEngagement = true,
    showCaption = true,
    showSound = true,
    deviceFrame = true,
  } = appearance;

  // Platform-specific colors and styling
  const platformConfig = {
    'tiktok': {
      primaryColor: '#FF0050',
      secondaryColor: '#00F2EA',
      gradient: 'linear-gradient(45deg, #FF0050, #00F2EA)',
      logo: (
        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      ),
    },
    'instagram-reels': {
      primaryColor: '#E1306C',
      secondaryColor: '#F77737',
      gradient: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)',
      logo: (
        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
          <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
      ),
    },
    'youtube-shorts': {
      primaryColor: '#FF0000',
      secondaryColor: '#FF0000',
      gradient: 'linear-gradient(45deg, #FF0000, #FF4444)',
      logo: (
        <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  };

  const config = platformConfig[platform];

  return (
    <div className={`relative ${deviceFrame ? 'p-4' : ''}`}>
      {/* Device Frame */}
      {deviceFrame && (
        <div className="absolute inset-0 rounded-[40px] bg-black shadow-2xl" />
      )}

      {/* Reel Container */}
      <div
        className={`relative overflow-hidden bg-black ${deviceFrame ? 'rounded-[32px]' : 'rounded-lg'}`}
        style={{
          width: '375px',
          height: '667px',
        }}
      >
        {/* Thumbnail/Video */}
        {data.thumbnailUrl
          ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${data.thumbnailUrl})` }}
              />
            )
          : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-800 to-black">
                <svg className="size-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/30 p-4 backdrop-blur-sm">
            <svg className="size-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration Badge */}
        {data.duration && (
          <div className="absolute top-3 right-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {data.duration}
          </div>
        )}

        {/* Right Side Actions */}
        {showEngagement && (
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
            {/* Profile */}
            <div className="flex flex-col items-center">
              <div
                className="size-12 rounded-full border-2 border-white bg-gray-300"
                style={{
                  backgroundImage: data.authorAvatarUrl ? `url(${data.authorAvatarUrl})` : undefined,
                  backgroundSize: 'cover',
                }}
              />
              <button
                type="button"
                className="mt-1 flex size-5 items-center justify-center rounded-full text-white"
                style={{ background: config.primaryColor }}
              >
                <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Like */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={`rounded-full p-2 ${data.isLiked ? '' : 'bg-white/10'}`}
                style={{ color: data.isLiked ? config.primaryColor : 'white' }}
              >
                <svg className="size-8" fill={data.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={data.isLiked ? 0 : 2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <span className="text-xs font-semibold text-white">{formatNumber(data.likes)}</span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center">
              <button type="button" className="rounded-full bg-white/10 p-2 text-white">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <span className="text-xs font-semibold text-white">{formatNumber(data.comments)}</span>
            </div>

            {/* Save/Bookmark (Instagram/TikTok) */}
            {(platform === 'tiktok' || platform === 'instagram-reels') && data.saves !== undefined && (
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className={`rounded-full p-2 ${data.isSaved ? '' : 'bg-white/10'}`}
                  style={{ color: data.isSaved ? '#FFD700' : 'white' }}
                >
                  <svg className="size-8" fill={data.isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={data.isSaved ? 0 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <span className="text-xs font-semibold text-white">{formatNumber(data.saves)}</span>
              </div>
            )}

            {/* Share */}
            <div className="flex flex-col items-center">
              <button type="button" className="rounded-full bg-white/10 p-2 text-white">
                <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <span className="text-xs font-semibold text-white">{formatNumber(data.shares)}</span>
            </div>

            {/* Sound/Disc */}
            {showSound && data.soundName && (
              <div className="mt-2">
                <div
                  className="size-12 animate-spin rounded-full border-2 border-gray-700 bg-gray-900 [animation-duration:3s]"
                  style={{
                    backgroundImage: data.authorAvatarUrl ? `url(${data.authorAvatarUrl})` : undefined,
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="flex size-full items-center justify-center rounded-full">
                    <div className="size-4 rounded-full bg-gray-800" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute right-16 bottom-0 left-0 p-4">
          {/* Author Info */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-base font-bold text-white">
              @
              {data.authorHandle}
            </span>
            {data.isVerified && (
              <svg className="size-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            )}
            {data.isFollowing === false && (
              <button
                type="button"
                className="rounded border border-white px-2 py-0.5 text-xs font-semibold text-white"
              >
                Follow
              </button>
            )}
          </div>

          {/* Caption */}
          {showCaption && (
            <div className="mb-2">
              <p className="line-clamp-2 text-sm text-white">
                {data.caption}
                {data.hashtags && data.hashtags.length > 0 && (
                  <span className="font-semibold">
                    {' '}
                    {data.hashtags.map(h => `#${h}`).join(' ')}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Sound */}
          {showSound && data.soundName && (
            <div className="flex items-center gap-2">
              <svg className="size-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <div className="overflow-hidden">
                <p className="animate-marquee text-sm whitespace-nowrap text-white">
                  {data.soundOriginal ? '♪ Original sound - ' : '♪ '}
                  {data.soundName}
                  {data.soundArtist && ` · ${data.soundArtist}`}
                </p>
              </div>
            </div>
          )}

          {/* Views (YouTube Shorts) */}
          {platform === 'youtube-shorts' && data.views !== undefined && (
            <div className="mt-2 text-xs text-white/70">
              {formatNumber(data.views)}
              {' '}
              views
            </div>
          )}
        </div>

        {/* Platform Logo */}
        <div className="absolute top-4 left-4 text-white">
          {config.logo}
        </div>

        {/* Search Icon (TikTok) */}
        {platform === 'tiktok' && (
          <div className="absolute top-4 right-4">
            <button type="button" className="text-white">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
