'use client';

import type { SocialAppearance, SocialMockupData } from '@/types/Mockup';

type TwitterMockupProps = {
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

export function TwitterMockup({ data, appearance }: TwitterMockupProps) {
  const theme = appearance?.theme ?? 'dark';
  const showEngagement = appearance?.showEngagement !== false;
  const showComments = appearance?.showComments !== false;

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-500' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50';

  return (
    <div className={`w-[500px] ${bgColor}`}>
      {/* Header */}
      <div className={`flex items-center gap-6 border-b px-4 py-3 ${borderColor}`}>
        {/* Back button */}
        <button className={textColor}>
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className={`text-xl font-bold ${textColor}`}>Post</h1>
        </div>
      </div>

      {/* Tweet */}
      <div className={`border-b px-4 py-3 ${borderColor}`}>
        {/* Author */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="size-10 shrink-0 overflow-hidden rounded-full bg-gray-300">
            {data.author.avatarUrl
              ? (
                  <img src={data.author.avatarUrl} alt={data.author.name} className="size-full object-cover" />
                )
              : (
                  <div className="flex size-full items-center justify-center bg-[#1d9bf0] text-lg font-semibold text-white">
                    {data.author.name.charAt(0)}
                  </div>
                )}
          </div>

          <div className="min-w-0 flex-1">
            {/* Author info */}
            <div className="flex items-center gap-1">
              <span className={`font-bold ${textColor}`}>{data.author.name}</span>
              {data.post.isVerified && (
                <svg className="size-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </svg>
              )}
            </div>
            <span className={`text-sm ${secondaryText}`}>
              @
              {data.author.name.toLowerCase().replace(/\s/g, '')}
            </span>
          </div>

          {/* More options */}
          <button className={secondaryText}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-3">
          <p className={`text-base leading-relaxed whitespace-pre-wrap ${textColor}`}>
            {data.post.content}
          </p>

          {/* Hashtags */}
          {data.post.hashtags && data.post.hashtags.length > 0 && (
            <div className="mt-1">
              {data.post.hashtags.map((tag, i) => (
                <span key={i} className="text-[#1d9bf0]">
                  #
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        {data.post.mediaUrls && data.post.mediaUrls.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-gray-800">
            {data.post.mediaType === 'carousel' || data.post.mediaUrls.length > 1
              ? (
                  <div className={`grid gap-0.5 ${data.post.mediaUrls.length === 2 ? 'grid-cols-2' : data.post.mediaUrls.length === 3 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                    {data.post.mediaUrls.slice(0, 4).map((url, i) => (
                      <div
                        key={i}
                        className={`overflow-hidden bg-gray-800 ${
                          data.post.mediaUrls?.length === 3 && i === 0 ? 'row-span-2' : ''
                        }`}
                      >
                        <img src={url} alt="" className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                )
              : (
                  <img src={data.post.mediaUrls[0]} alt="" className="w-full object-cover" />
                )}
          </div>
        )}

        {/* Timestamp */}
        <div className={`mt-4 flex items-center gap-1 text-sm ${secondaryText}`}>
          <span>{data.post.timestamp}</span>
          <span>·</span>
          {data.post.views && (
            <>
              <span className={`font-semibold ${textColor}`}>{formatNumber(data.post.views)}</span>
              <span>Views</span>
            </>
          )}
        </div>

        {/* Engagement Stats */}
        {showEngagement && (
          <div className={`mt-3 flex items-center gap-4 border-y py-3 ${borderColor}`}>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${textColor}`}>{formatNumber(data.post.shares)}</span>
              <span className={secondaryText}>Reposts</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${textColor}`}>{formatNumber(Math.floor(data.post.shares * 0.3))}</span>
              <span className={secondaryText}>Quotes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${textColor}`}>{formatNumber(data.post.likes)}</span>
              <span className={secondaryText}>Likes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${textColor}`}>{formatNumber(Math.floor(data.post.likes * 0.1))}</span>
              <span className={secondaryText}>Bookmarks</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-1 flex items-center justify-around py-2">
          {/* Reply */}
          <button className={`rounded-full p-2 ${secondaryText} ${hoverBg} hover:text-[#1d9bf0]`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          {/* Retweet */}
          <button className={`rounded-full p-2 ${secondaryText} ${hoverBg} hover:text-green-500`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          {/* Like */}
          <button className={`rounded-full p-2 ${secondaryText} ${hoverBg} hover:text-pink-500`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* Bookmark */}
          <button className={`rounded-full p-2 ${secondaryText} ${hoverBg} hover:text-[#1d9bf0]`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          {/* Share */}
          <button className={`rounded-full p-2 ${secondaryText} ${hoverBg} hover:text-[#1d9bf0]`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reply Input */}
      <div className={`flex gap-3 border-b px-4 py-3 ${borderColor}`}>
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-gray-600">
          <div className="flex size-full items-center justify-center text-white">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-1 items-center">
          <span className={secondaryText}>Post your reply</span>
        </div>
        <button className="rounded-full bg-[#1d9bf0] px-4 py-1.5 text-sm font-bold text-white opacity-50">
          Reply
        </button>
      </div>

      {/* Replies */}
      {showComments && data.comments && data.comments.length > 0 && (
        <div>
          {data.comments.slice(0, 2).map(comment => (
            <div key={comment.id} className={`flex gap-3 border-b px-4 py-3 ${borderColor}`}>
              <div className="size-10 shrink-0 overflow-hidden rounded-full bg-gray-600">
                <div className="flex size-full items-center justify-center text-sm font-semibold text-white">
                  U
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className={`font-bold ${textColor}`}>User</span>
                  <span className={`text-sm ${secondaryText}`}>
                    @user ·
                    {comment.timestamp}
                  </span>
                </div>
                <div className={`text-sm ${secondaryText}`}>
                  Replying to
                  {' '}
                  <span className="text-[#1d9bf0]">
                    @
                    {data.author.name.toLowerCase().replace(/\s/g, '')}
                  </span>
                </div>
                <p className={`mt-1 ${textColor}`}>{comment.content}</p>

                {/* Reply actions */}
                <div className="mt-2 flex items-center gap-8">
                  <button className={`flex items-center gap-1 ${secondaryText} hover:text-[#1d9bf0]`}>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs">{comment.replies?.length || 0}</span>
                  </button>
                  <button className={`flex items-center gap-1 ${secondaryText} hover:text-green-500`}>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button className={`flex items-center gap-1 ${secondaryText} hover:text-pink-500`}>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs">{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
