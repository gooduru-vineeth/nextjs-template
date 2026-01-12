'use client';

import type { SocialAppearance, SocialMockupData } from '@/types/Mockup';

type LinkedInMockupProps = {
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
  return num.toString();
}

export function LinkedInMockup({ data, appearance }: LinkedInMockupProps) {
  const theme = appearance?.theme ?? 'light';
  const showEngagement = appearance?.showEngagement !== false;
  const showComments = appearance?.showComments !== false;

  const bgColor = theme === 'dark' ? 'bg-[#1b1f23]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const cardBg = theme === 'dark' ? 'bg-[#1b1f23]' : 'bg-white';

  return (
    <div className={`w-[600px] ${bgColor}`}>
      {/* Header Bar */}
      <div className={`flex items-center justify-between border-b px-4 py-2 ${borderColor} ${cardBg}`}>
        <div className="flex items-center gap-4">
          {/* LinkedIn Logo */}
          <svg className="size-8" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <div className={`flex items-center rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} px-3 py-1.5`}>
            <svg className={`mr-2 size-4 ${secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className={`text-sm ${secondaryText}`}>Search</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {['Home', 'Network', 'Jobs', 'Messaging', 'Notifications'].map(item => (
            <div key={item} className={`flex flex-col items-center ${secondaryText}`}>
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span className="text-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Post Card */}
      <div className={`border ${borderColor} ${cardBg}`}>
        {/* Post Header */}
        <div className="flex items-start gap-3 p-4">
          {/* Avatar */}
          <div className="size-12 shrink-0 overflow-hidden rounded-full bg-gray-300">
            {data.author.avatarUrl
              ? (
                  <img src={data.author.avatarUrl} alt={data.author.name} className="size-full object-cover" />
                )
              : (
                  <div className="flex size-full items-center justify-center bg-[#0A66C2] text-lg font-semibold text-white">
                    {data.author.name.charAt(0)}
                  </div>
                )}
          </div>

          {/* Author Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className={`font-semibold ${textColor}`}>{data.author.name}</span>
              {data.post.isVerified && (
                <svg className="size-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className={secondaryText}>• 1st</span>
            </div>
            <p className={`text-sm ${secondaryText}`}>
              {(data.author as unknown as { headline?: string }).headline || 'Professional at Company'}
            </p>
            <div className={`flex items-center gap-1 text-xs ${secondaryText}`}>
              <span>{data.post.timestamp}</span>
              <span>•</span>
              <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.95 6.95l-1.414-1.414-4.95 4.95-2.12-2.12-1.414 1.414 3.535 3.535 6.364-6.364z" />
              </svg>
            </div>
          </div>

          {/* More Options */}
          <button className={secondaryText}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
            </svg>
          </button>
        </div>

        {/* Post Content */}
        <div className={`px-4 pb-3 ${textColor}`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {data.post.content}
          </p>
          {data.post.hashtags && data.post.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {data.post.hashtags.map((tag, i) => (
                <span key={i} className="text-sm text-[#0A66C2] hover:underline">
                  #
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post Media */}
        {data.post.mediaUrls && data.post.mediaUrls.length > 0 && (
          <div className="mt-2">
            {data.post.mediaType === 'carousel'
              ? (
                  <div className="grid grid-cols-2 gap-0.5">
                    {data.post.mediaUrls.slice(0, 4).map((url, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden bg-gray-200">
                        <img src={url} alt="" className="size-full object-cover" />
                        {i === 3 && data.post.mediaUrls && data.post.mediaUrls.length > 4 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-2xl font-bold text-white">
                              +
                              {data.post.mediaUrls.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              : (
                  <div className="overflow-hidden bg-gray-200">
                    <img src={data.post.mediaUrls[0]} alt="" className="w-full object-cover" />
                  </div>
                )}
          </div>
        )}

        {/* Engagement Stats */}
        {showEngagement && (
          <div className={`flex items-center justify-between border-t px-4 py-2 ${borderColor}`}>
            <div className={`flex items-center gap-1 ${secondaryText}`}>
              {/* Reaction icons */}
              <div className="flex -space-x-1">
                <div className="flex size-4 items-center justify-center rounded-full bg-[#0A66C2]">
                  <svg className="size-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                  </svg>
                </div>
                <div className="flex size-4 items-center justify-center rounded-full bg-red-500">
                  <svg className="size-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="flex size-4 items-center justify-center rounded-full bg-[#FFC400]">
                  <span className="text-[8px]">💡</span>
                </div>
              </div>
              <span className="text-xs">{formatNumber(data.post.likes)}</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${secondaryText}`}>
              <span>
                {formatNumber(data.post.comments)}
                {' '}
                comments
              </span>
              <span>
                {formatNumber(data.post.shares)}
                {' '}
                reposts
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex items-center justify-around border-t px-2 py-1 ${borderColor}`}>
          {[
            { icon: '👍', label: 'Like' },
            { icon: '💬', label: 'Comment' },
            { icon: '🔄', label: 'Repost' },
            { icon: '📤', label: 'Send' },
          ].map(action => (
            <button
              key={action.label}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium ${secondaryText} hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Comments Section */}
        {showComments && data.comments && data.comments.length > 0 && (
          <div className={`border-t px-4 py-3 ${borderColor}`}>
            {data.comments.slice(0, 2).map(comment => (
              <div key={comment.id} className="mb-3 flex gap-2">
                <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-300">
                  <div className="flex size-full items-center justify-center bg-gray-400 text-xs font-semibold text-white">
                    U
                  </div>
                </div>
                <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} px-3 py-2`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${textColor}`}>User</span>
                    <span className={`text-xs ${secondaryText}`}>{comment.timestamp}</span>
                  </div>
                  <p className={`text-sm ${textColor}`}>{comment.content}</p>
                  <div className={`mt-1 flex items-center gap-3 text-xs ${secondaryText}`}>
                    <button className="hover:text-[#0A66C2]">Like</button>
                    <span>|</span>
                    <button className="hover:text-[#0A66C2]">Reply</button>
                    {comment.likes > 0 && (
                      <>
                        <span>|</span>
                        <span>
                          {comment.likes}
                          {' '}
                          likes
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
