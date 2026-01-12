'use client';

export type YouTubeVideoData = {
  thumbnail: string;
  title: string;
  channel: {
    name: string;
    avatar?: string;
    subscribers: string;
    verified?: boolean;
  };
  views: string;
  uploadDate: string;
  duration?: string;
  likes?: string;
  dislikes?: string;
  description?: string;
  comments?: {
    author: string;
    avatar?: string;
    content: string;
    likes: string;
    timeAgo: string;
    replies?: number;
    verified?: boolean;
    pinned?: boolean;
  }[];
  isLive?: boolean;
  isShort?: boolean;
  tags?: string[];
};

type YouTubeMockupProps = {
  data: YouTubeVideoData;
  appearance?: {
    theme?: 'light' | 'dark';
    view?: 'watch' | 'thumbnail' | 'shorts' | 'search';
    showComments?: boolean;
    showDescription?: boolean;
  };
};

export function YouTubeMockup({ data, appearance = {} }: YouTubeMockupProps) {
  const {
    theme = 'dark',
    view = 'watch',
    showComments = true,
    showDescription = true,
  } = appearance;

  const isDark = theme === 'dark';

  // Thumbnail card view
  if (view === 'thumbnail') {
    return (
      <div className={`w-80 cursor-pointer ${isDark ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <div
            className="size-full bg-cover bg-center"
            style={{ backgroundImage: `url(${data.thumbnail})` }}
          />
          {data.duration && (
            <span className="absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
              {data.duration}
            </span>
          )}
          {data.isLive && (
            <span className="absolute bottom-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white uppercase">
              Live
            </span>
          )}
        </div>

        {/* Video info */}
        <div className="mt-3 flex gap-3">
          {data.channel.avatar
            ? (
                <div
                  className="size-9 shrink-0 rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${data.channel.avatar})` }}
                />
              )
            : (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                  {data.channel.name.charAt(0)}
                </div>
              )}
          <div className="flex-1">
            <h3 className={`line-clamp-2 text-sm leading-tight font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.title}
            </h3>
            <div className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-1">
                <span>{data.channel.name}</span>
                {data.channel.verified && (
                  <svg className="size-3.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <p>
                {data.views}
                {' '}
                views ·
                {' '}
                {data.uploadDate}
              </p>
            </div>
          </div>
          <button type="button" className={`self-start rounded-full p-1 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <svg className={`size-5 ${isDark ? 'text-white' : 'text-gray-700'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Shorts view
  if (view === 'shorts') {
    return (
      <div className="relative mx-auto aspect-[9/16] w-80 overflow-hidden rounded-xl bg-black">
        <div
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url(${data.thumbnail})` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Top bar */}
        <div className="absolute top-0 right-0 left-0 flex items-center justify-between p-4">
          <button type="button" className="text-white">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button type="button" className="text-white">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Right side actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
          <button type="button" className="flex flex-col items-center gap-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">{data.likes}</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <svg className="size-6 rotate-180 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">Dislike</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9.5 14l2.5-3 2.5 3 2.5-3 4 5H5l4.5-5z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">{data.comments?.length || 0}</span>
          </button>
          <button type="button" className="flex flex-col items-center gap-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">Share</span>
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute right-16 bottom-0 left-0 p-4">
          <div className="mb-3 flex items-center gap-3">
            {data.channel.avatar
              ? (
                  <div
                    className="size-10 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.channel.avatar})` }}
                  />
                )
              : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                    {data.channel.name.charAt(0)}
                  </div>
                )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                @
                {data.channel.name}
              </span>
              <button type="button" className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black">
                Subscribe
              </button>
            </div>
          </div>
          <p className="line-clamp-2 text-sm text-white">{data.title}</p>
        </div>
      </div>
    );
  }

  // Watch page view (default)
  return (
    <div className={`mx-auto max-w-4xl ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
      {/* Video player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <div
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url(${data.thumbnail})` }}
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-black/60">
            <svg className="ml-1 size-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Video controls */}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress bar */}
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-1/3 bg-red-600" />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button type="button">
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <button type="button">
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
                <span className="text-sm">
                  1:23 /
                  {data.duration || '10:00'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button type="button">
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Live badge */}
        {data.isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 rounded bg-red-600 px-2 py-1">
            <span className="size-2 animate-pulse rounded-full bg-white" />
            <span className="text-xs font-semibold text-white uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="p-4">
        <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {data.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          {/* Channel info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {data.channel.avatar
                ? (
                    <div
                      className="size-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${data.channel.avatar})` }}
                    />
                  )
                : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-purple-600 font-semibold text-white">
                      {data.channel.name.charAt(0)}
                    </div>
                  )}
              <div>
                <div className="flex items-center gap-1">
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.channel.name}
                  </span>
                  {data.channel.verified && (
                    <svg className="size-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.channel.subscribers}
                  {' '}
                  subscribers
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Subscribe
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <button type="button" className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'hover:bg-white/20' : 'hover:bg-gray-200'}`}>
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                <span className="text-sm font-medium">{data.likes}</span>
              </button>
              <div className={`h-6 w-px ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
              <button type="button" className={`px-4 py-2 ${isDark ? 'hover:bg-white/20' : 'hover:bg-gray-200'}`}>
                <svg className="size-5 rotate-180" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
              </button>
            </div>

            <button type="button" className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
              </svg>
              <span className="text-sm font-medium">Share</span>
            </button>

            <button type="button" className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
              </svg>
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>

        {/* Description */}
        {showDescription && data.description && (
          <div className={`mt-4 rounded-xl p-3 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.views}
              {' '}
              views ·
              {data.uploadDate}
            </p>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {data.description}
            </p>
            {data.tags && data.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {data.tags.map((tag, i) => (
                  <span key={i} className="text-sm text-blue-500">
                    #
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        {showComments && data.comments && data.comments.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-6">
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.comments.length}
                {' '}
                Comments
              </span>
              <button type="button" className="flex items-center gap-1 text-sm">
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
                </svg>
                Sort by
              </button>
            </div>

            <div className="space-y-4">
              {data.comments.map((comment, i) => (
                <div key={i} className="flex gap-3">
                  {comment.avatar
                    ? (
                        <div
                          className="size-10 shrink-0 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${comment.avatar})` }}
                        />
                      )
                    : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
                          {comment.author.charAt(0)}
                        </div>
                      )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {comment.pinned && (
                        <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                          </svg>
                          Pinned by
                          {' '}
                          {data.channel.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        @
                        {comment.author}
                      </span>
                      {comment.verified && (
                        <svg className="size-3.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {comment.content}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <button type="button" className="flex items-center gap-1">
                        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{comment.likes}</span>
                      </button>
                      <button type="button">
                        <svg className="size-4 rotate-180" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                      </button>
                      <button type="button" className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Reply
                      </button>
                    </div>
                    {comment.replies !== undefined && comment.replies > 0 && (
                      <button type="button" className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-500">
                        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                        {comment.replies}
                        {' '}
                        replies
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default YouTubeMockup;
