'use client';

import type { SocialAppearance, SocialMockupData } from '@/types/Mockup';

type InstagramMockupProps = {
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

export function InstagramMockup({ data, appearance }: InstagramMockupProps) {
  const theme = appearance?.theme ?? 'light';
  const showEngagement = appearance?.showEngagement !== false;
  const showComments = appearance?.showComments !== false;

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';

  return (
    <div className={`w-[400px] ${bgColor}`}>
      {/* Header Bar */}
      <div className={`flex items-center justify-between border-b px-4 py-3 ${borderColor}`}>
        {/* Instagram Logo */}
        <svg className={`h-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 1200 340" fill="currentColor">
          <path d="M182.42,113.9C147.51,113.9,119,142.41,119,177.32s28.51,63.42,63.42,63.42,63.42-28.51,63.42-63.42S217.33,113.9,182.42,113.9Zm0,104.55A41.13,41.13,0,1,1,223.55,177.32,41.13,41.13,0,0,1,182.42,218.45Z" />
          <circle cx="249.96" cy="108.15" r="14.83" />
          <path d="M305.07,65.83c-10.45-10.76-25-16.49-42.21-16.61l-160.89,0c-35.28.24-64.11,28.76-64.35,63.58l0,129.14c.24,35.28,29.07,63.58,64.35,63.58h160.89c17.21-.12,31.76-5.85,42.21-16.61,10.76-11.07,16.49-26.57,16.49-44.9l0-133.28C321.56,92.4,315.83,76.9,305.07,65.83ZM298.7,244.05c0,25.94-15.89,39.18-39.84,39.3l-152.89,0c-23.71-.12-39.84-13.36-39.84-39.3l0-129.14c0-25.94,16.13-39.18,39.84-39.3l152.89,0c23.95.12,39.84,13.36,39.84,39.3Z" />
          <path d="M417.36,196.39l-19.13,0,0,97h24.54V223.78l-5.41-27.39Z" />
          <path d="M502.88,110.88c-8.8.12-17,2.31-23.83,6.11v-8.72H454.5l0,185.11h24.55V217c6.85,3.92,15.15,6.11,24.19,6.23,28.08-.24,50.74-24.07,50.38-56.15C553.26,134.95,530.72,111.12,502.88,110.88Zm-2.67,90.78c-13.48,0-24.43-12.41-24.43-27.75s10.94-27.75,24.43-27.75,24.43,12.41,24.43,27.75S513.69,201.66,500.21,201.66Z" />
          <path d="M625.58,108.27v8.72c-6.85-3.8-15-6-23.83-6.11-27.84.24-50.38,24.07-50,56.2.36,32.08,23,55.91,50.38,56.15,9,0,17.33-2.31,24.19-6.23v4.94c0,16.85-10.34,26.93-28.92,27.17-12.41-.24-21.69-4.52-31.21-14l-14.67,16.37c13.24,13.48,28.92,20.45,47,20.57,34.68-.36,52.36-21.57,52.36-49.87l0-113.88Zm-21.16,93.39c-13.48,0-24.43-12.41-24.43-27.75s10.94-27.75,24.43-27.75,24.43,12.41,24.43,27.75S617.91,201.66,604.43,201.66Z" />
          <path d="M758.62,108.27v8.72c-6.85-3.8-15-6-23.83-6.11-27.84.24-50.38,24.07-50,56.2.36,32.08,23,55.91,50.38,56.15,9,0,17.33-2.31,24.19-6.23V293.36h24.55l0-185.1Zm-21.16,93.39c-13.48,0-24.43-12.41-24.43-27.75s10.94-27.75,24.43-27.75,24.43,12.41,24.43,27.75S750.94,201.66,737.46,201.66Z" />
          <path d="M883.36,110.88c-8.8.12-17,2.31-23.83,6.11v-8.72H835l0,185.11h24.55V217c6.85,3.92,15.15,6.11,24.19,6.23,28.08-.24,50.74-24.07,50.38-56.15C933.74,134.95,911.2,111.12,883.36,110.88Zm-2.67,90.78c-13.48,0-24.43-12.41-24.43-27.75s10.94-27.75,24.43-27.75,24.43,12.41,24.43,27.75S894.17,201.66,880.69,201.66Z" />
          <path d="M1014.85,157.66a80,80,0,0,0-5.77-7.08c-9-9.76-22.05-15.39-36.12-15.51-28.32.24-51.22,24.55-50.86,56.2.24,31.9,22.53,55.79,50.86,56,14.07-.12,27.16-5.77,36.12-15.51,9.28-10,14.43-24.19,14.31-39.58C1023.27,180.08,1019.83,167.78,1014.85,157.66Zm-41.89,68.82c-17.69,0-32-14.55-32-32.48s14.31-32.48,32-32.48,32,14.55,32,32.48S990.65,226.48,973,226.48Z" />
          <path d="M1098.56,108.27l-31,76.64-29.89-76.64h-26.57l44.43,100.58-27.39,70.51h25.26l70.39-171.09Z" />
          <rect x="398.23" y="66.51" width="24.54" height="24.54" />
        </svg>

        <div className="flex items-center gap-4">
          {/* Heart Icon */}
          <button className={textColor}>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* DM Icon */}
          <button className={textColor}>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar with gradient ring */}
          <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
            <div className={`rounded-full ${bgColor} p-0.5`}>
              <div className="size-8 overflow-hidden rounded-full bg-gray-300">
                {data.author.avatarUrl
                  ? (
                      <img src={data.author.avatarUrl} alt={data.author.name} className="size-full object-cover" />
                    )
                  : (
                      <div className="flex size-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-semibold text-white">
                        {data.author.name.charAt(0)}
                      </div>
                    )}
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-1">
            <span className={`text-sm font-semibold ${textColor}`}>{data.author.name.toLowerCase().replace(/\s/g, '')}</span>
            {data.post.isVerified && (
              <svg className="size-4 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* More Options */}
        <button className={textColor}>
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
          </svg>
        </button>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square bg-gray-200">
        {data.post.mediaUrls && data.post.mediaUrls.length > 0
          ? (
              <>
                <img src={data.post.mediaUrls[0]} alt="" className="size-full object-cover" />
                {data.post.mediaType === 'carousel' && data.post.mediaUrls.length > 1 && (
                  <div className="absolute top-4 right-4 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
                    1/
                    {data.post.mediaUrls.length}
                  </div>
                )}
              </>
            )
          : (
              <div className="flex size-full items-center justify-center">
                <svg className="size-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button className={textColor}>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* Comment */}
          <button className={textColor}>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          {/* Share */}
          <button className={textColor}>
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {/* Save */}
        <button className={textColor}>
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Likes */}
      {showEngagement && (
        <div className="px-4 pb-2">
          <span className={`text-sm font-semibold ${textColor}`}>
            {formatNumber(data.post.likes)}
            {' '}
            likes
          </span>
        </div>
      )}

      {/* Caption */}
      <div className="px-4 pb-2">
        <span className={`text-sm ${textColor}`}>
          <span className="font-semibold">{data.author.name.toLowerCase().replace(/\s/g, '')}</span>
          {' '}
          {data.post.content}
        </span>
        {data.post.hashtags && data.post.hashtags.length > 0 && (
          <span className="text-sm text-[#3897f0]">
            {' '}
            {data.post.hashtags.map(tag => `#${tag}`).join(' ')}
          </span>
        )}
      </div>

      {/* View Comments */}
      {showComments && data.comments && data.comments.length > 0 && (
        <div className="px-4 pb-2">
          <button className={`text-sm ${secondaryText}`}>
            View all
            {' '}
            {data.post.comments}
            {' '}
            comments
          </button>

          {/* Sample Comments */}
          {data.comments.slice(0, 2).map(comment => (
            <div key={comment.id} className="mt-1">
              <span className={`text-sm ${textColor}`}>
                <span className="font-semibold">user</span>
                {' '}
                {comment.content}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 pb-4">
        <span className={`text-xs uppercase ${secondaryText}`}>
          {data.post.timestamp}
        </span>
      </div>

      {/* Add Comment */}
      <div className={`flex items-center gap-3 border-t px-4 py-3 ${borderColor}`}>
        <button className="text-xl">😊</button>
        <input
          type="text"
          placeholder="Add a comment..."
          className={`flex-1 bg-transparent text-sm ${textColor} placeholder:${secondaryText} outline-none`}
          readOnly
        />
        <button className="text-sm font-semibold text-[#3897f0] opacity-50">
          Post
        </button>
      </div>
    </div>
  );
}
