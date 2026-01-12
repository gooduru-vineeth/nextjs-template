'use client';

type StoryData = {
  authorName: string;
  authorHandle?: string;
  authorAvatarUrl?: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  timestamp: string;
  duration?: number; // Duration in seconds for video
  viewerCount?: number;
  hasCaption?: boolean;
  caption?: string;
  captionPosition?: 'top' | 'center' | 'bottom';
  mentions?: string[];
  hashtags?: string[];
  stickers?: StorySticker[];
  musicTrack?: {
    title: string;
    artist: string;
  };
  isHighlight?: boolean;
  highlightName?: string;
};

type StorySticker = {
  id: string;
  type: 'poll' | 'question' | 'countdown' | 'location' | 'mention' | 'hashtag' | 'link' | 'music' | 'emoji';
  content: string;
  position: { x: number; y: number };
};

type StoryMockupProps = {
  platform: 'instagram' | 'facebook' | 'snapchat';
  data: StoryData;
  appearance?: {
    theme?: 'light' | 'dark';
    showProgressBar?: boolean;
    showViewerCount?: boolean;
    deviceFrame?: boolean;
  };
};

export function StoryMockup({ platform, data, appearance = {} }: StoryMockupProps) {
  const {
    showProgressBar = true,
    showViewerCount = true,
    deviceFrame = true,
  } = appearance;

  // Platform-specific styling
  const platformConfig = {
    instagram: {
      gradientStart: '#833AB4',
      gradientMid: '#FD1D1D',
      gradientEnd: '#F77737',
      borderRadius: '24px',
    },
    facebook: {
      gradientStart: '#1877F2',
      gradientMid: '#1877F2',
      gradientEnd: '#42A5F5',
      borderRadius: '16px',
    },
    snapchat: {
      gradientStart: '#FFFC00',
      gradientMid: '#FFFC00',
      gradientEnd: '#FFEB3B',
      borderRadius: '24px',
    },
  };

  const config = platformConfig[platform];
  const progressBarGradient = `linear-gradient(90deg, ${config.gradientStart}, ${config.gradientMid}, ${config.gradientEnd})`;

  // Caption position styles
  const captionPositionStyles = {
    top: 'top-20',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-24',
  };

  return (
    <div className={`relative ${deviceFrame ? 'p-4' : ''}`}>
      {/* Device Frame */}
      {deviceFrame && (
        <div className="absolute inset-0 rounded-[40px] bg-black shadow-2xl" />
      )}

      {/* Story Container */}
      <div
        className={`relative overflow-hidden bg-black ${deviceFrame ? 'rounded-[32px]' : ''}`}
        style={{
          width: '375px',
          height: '667px',
          borderRadius: deviceFrame ? '32px' : config.borderRadius,
        }}
      >
        {/* Background Media/Gradient */}
        {data.mediaUrl
          ? (
              <div className="absolute inset-0">
                {data.mediaType === 'video'
                  ? (
                      <div className="flex size-full items-center justify-center bg-black">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="size-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${data.mediaUrl})`, opacity: 0.3 }}
                        />
                      </div>
                    )
                  : (
                      <div
                        className="size-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${data.mediaUrl})` }}
                      />
                    )}
              </div>
            )
          : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${config.gradientStart}40 0%, ${config.gradientEnd}40 100%)`,
                }}
              />
            )}

        {/* Progress Bar */}
        {showProgressBar && (
          <div className="absolute top-3 right-4 left-4 flex gap-1">
            <div
              className="h-0.5 flex-1 rounded-full"
              style={{ background: progressBarGradient }}
            />
          </div>
        )}

        {/* Header */}
        <div className="absolute top-6 right-0 left-0 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="size-10 rounded-full border-2 bg-gray-300"
              style={{
                borderColor: config.gradientStart,
                backgroundImage: data.authorAvatarUrl ? `url(${data.authorAvatarUrl})` : undefined,
                backgroundSize: 'cover',
              }}
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-white drop-shadow-md">
                  {data.authorName}
                </span>
                {platform === 'instagram' && (
                  <svg className="size-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-white/70 drop-shadow-md">{data.timestamp}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button type="button" className="text-white drop-shadow-md">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <button type="button" className="text-white drop-shadow-md">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Caption */}
        {data.hasCaption && data.caption && (
          <div className={`absolute right-4 left-4 ${captionPositionStyles[data.captionPosition || 'bottom']}`}>
            <div className="rounded-lg bg-black/30 px-4 py-2 backdrop-blur-sm">
              <p className="text-center text-lg font-medium text-white drop-shadow-md">
                {data.caption}
              </p>
              {data.mentions && data.mentions.length > 0 && (
                <p className="mt-1 text-center text-sm text-white/80">
                  {data.mentions.map(m => `@${m}`).join(' ')}
                </p>
              )}
              {data.hashtags && data.hashtags.length > 0 && (
                <p className="mt-1 text-center text-sm text-white/80">
                  {data.hashtags.map(h => `#${h}`).join(' ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stickers */}
        {data.stickers && data.stickers.map(sticker => (
          <div
            key={sticker.id}
            className="absolute"
            style={{
              left: `${sticker.position.x}%`,
              top: `${sticker.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {sticker.type === 'poll' && (
              <div className="w-64 rounded-xl bg-white p-3 shadow-lg">
                <p className="mb-2 text-center text-sm font-semibold">{sticker.content}</p>
                <div className="space-y-2">
                  <button type="button" className="w-full rounded-lg border-2 border-gray-200 py-2 text-sm font-medium">
                    Yes
                  </button>
                  <button type="button" className="w-full rounded-lg border-2 border-gray-200 py-2 text-sm font-medium">
                    No
                  </button>
                </div>
              </div>
            )}
            {sticker.type === 'question' && (
              <div className="w-64 rounded-xl bg-white/90 p-3 backdrop-blur-sm">
                <p className="mb-2 text-center text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Ask me a question
                </p>
                <p className="text-center text-sm">{sticker.content}</p>
              </div>
            )}
            {sticker.type === 'location' && (
              <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                <svg className="size-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-sm font-medium text-gray-800">{sticker.content}</span>
              </div>
            )}
            {sticker.type === 'music' && (
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm">
                <svg className="size-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span className="text-sm font-medium text-gray-800">{sticker.content}</span>
              </div>
            )}
            {sticker.type === 'countdown' && (
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white">
                <p className="text-xs font-bold tracking-wider uppercase">Countdown</p>
                <p className="text-lg font-bold">{sticker.content}</p>
                <p className="text-2xl font-bold">2d 5h 30m</p>
              </div>
            )}
            {sticker.type === 'emoji' && (
              <span className="text-4xl drop-shadow-lg">{sticker.content}</span>
            )}
          </div>
        ))}

        {/* Music Track */}
        {data.musicTrack && (
          <div className="absolute right-4 bottom-20 left-4">
            <div className="flex items-center gap-3 rounded-full bg-black/40 px-4 py-2 backdrop-blur-sm">
              <div className="size-8 animate-spin rounded-full bg-gradient-to-r from-pink-500 to-purple-500 [animation-duration:3s]">
                <div className="flex size-full items-center justify-center rounded-full bg-black">
                  <div className="size-2 rounded-full bg-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{data.musicTrack.title}</p>
                <p className="truncate text-xs text-white/70">{data.musicTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="flex items-center gap-3">
            {/* Message Input */}
            <div className="flex-1 rounded-full border border-white/30 bg-black/20 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-sm text-white/70">Send message</span>
            </div>

            {/* Quick Reactions */}
            <div className="flex gap-2">
              <button type="button" className="rounded-full bg-black/20 p-2 backdrop-blur-sm">
                <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button type="button" className="rounded-full bg-black/20 p-2 backdrop-blur-sm">
                <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>

          {/* Viewer Count */}
          {showViewerCount && data.viewerCount !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-white/70">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <span className="text-xs">
                {data.viewerCount.toLocaleString()}
                {' '}
                viewers
              </span>
            </div>
          )}
        </div>

        {/* Highlight Badge */}
        {data.isHighlight && data.highlightName && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1">
            <span className="text-xs font-medium text-gray-800">{data.highlightName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
