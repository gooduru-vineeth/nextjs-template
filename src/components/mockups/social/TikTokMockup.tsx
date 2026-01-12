'use client';

import type { SocialAppearance, SocialMockupData } from '@/types/Mockup';

type TikTokMockupProps = {
  data: SocialMockupData;
  appearance?: SocialAppearance;
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

export function TikTokMockup({ data, appearance }: TikTokMockupProps) {
  const showEngagement = appearance?.showEngagement !== false;

  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-black">
      {/* Video Background/Thumbnail */}
      <div className="absolute inset-0">
        {data.post.mediaUrls?.[0]
          ? (
              <img
                src={data.post.mediaUrls[0]}
                alt="Video thumbnail"
                className="size-full object-cover"
              />
            )
          : (
              <div className="size-full bg-gradient-to-b from-gray-800 to-gray-900" />
            )}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between px-4 pt-12">
        <button className="text-white/80">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <div className="flex gap-4">
          <button className="text-base font-semibold text-white/60">Following</button>
          <span className="text-white/30">|</span>
          <button className="text-base font-semibold text-white">For You</button>
        </div>

        <button className="text-white/80">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      {/* Right Side Action Buttons */}
      {showEngagement && (
        <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="size-12 overflow-hidden rounded-full border-2 border-white bg-gray-300">
              {data.author.avatarUrl
                ? (
                    <img src={data.author.avatarUrl} alt={data.author.name} className="size-full object-cover" />
                  )
                : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-pink-500 to-red-500 text-lg font-bold text-white">
                      {data.author.name.charAt(0)}
                    </div>
                  )}
            </div>
            {/* Follow Button */}
            <div className="absolute -bottom-2 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-[#fe2c55] text-white">
              <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
            </div>
          </div>

          {/* Like Button */}
          <button className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <svg className="size-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="mt-1 text-xs font-semibold text-white">{formatNumber(data.post.likes)}</span>
          </button>

          {/* Comment Button */}
          <button className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <svg className="size-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            </div>
            <span className="mt-1 text-xs font-semibold text-white">{formatNumber(data.post.comments)}</span>
          </button>

          {/* Bookmark Button */}
          <button className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <svg className="size-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <span className="mt-1 text-xs font-semibold text-white">{formatNumber(Math.floor(data.post.likes * 0.1))}</span>
          </button>

          {/* Share Button */}
          <button className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
              <svg className="size-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
            </div>
            <span className="mt-1 text-xs font-semibold text-white">{formatNumber(data.post.shares)}</span>
          </button>

          {/* Music Disc */}
          <div className="mt-2 size-12 animate-spin rounded-full border-4 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-2" style={{ animationDuration: '3s' }}>
            <div className="size-full rounded-full bg-gray-600" />
          </div>
        </div>
      )}

      {/* Bottom Info */}
      <div className="absolute right-20 bottom-6 left-3">
        {/* Username */}
        <div className="mb-2 flex items-center gap-1">
          <span className="text-base font-bold text-white">
            @
            {data.author.name.toLowerCase().replace(/\s/g, '')}
          </span>
          {data.post.isVerified && (
            <svg className="size-4 text-[#20d5ec]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </div>

        {/* Caption */}
        <p className="mb-3 line-clamp-2 text-sm text-white">{data.post.content}</p>

        {/* Hashtags */}
        {data.post.hashtags && data.post.hashtags.length > 0 && (
          <p className="mb-3 text-sm font-semibold text-white">
            {data.post.hashtags.map(tag => `#${tag}`).join(' ')}
          </p>
        )}

        {/* Music Info */}
        <div className="flex items-center gap-2">
          <svg className="size-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <div className="overflow-hidden">
            <p className="animate-marquee text-sm whitespace-nowrap text-white">
              Original sound -
              {' '}
              {data.author.name}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute right-0 bottom-0 left-0 flex items-center justify-around bg-black py-3">
        <button className="flex flex-col items-center">
          <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="mt-1 text-xs text-white">Home</span>
        </button>
        <button className="flex flex-col items-center">
          <svg className="size-6 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span className="mt-1 text-xs text-white/60">Friends</span>
        </button>
        <button className="flex flex-col items-center">
          <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-white">
            <svg className="size-5 text-black" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
        </button>
        <button className="flex flex-col items-center">
          <svg className="size-6 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <span className="mt-1 text-xs text-white/60">Inbox</span>
        </button>
        <button className="flex flex-col items-center">
          <svg className="size-6 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="mt-1 text-xs text-white/60">Profile</span>
        </button>
      </div>

      {/* Play Button Overlay (center) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-black/20 p-4 opacity-0 transition-opacity hover:opacity-100">
          <svg className="size-16 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
