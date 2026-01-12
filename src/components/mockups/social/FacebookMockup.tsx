'use client';

import type { SocialAppearance, SocialMockupData } from '@/types/Mockup';

type FacebookMockupProps = {
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

function formatTimestamp(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  }
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  if (diffInHours < 48) {
    return 'Yesterday';
  }
  if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d`;
  }
  return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function FacebookMockup({ data, appearance }: FacebookMockupProps) {
  const theme = appearance?.theme ?? 'light';
  const showEngagement = appearance?.showEngagement !== false;
  const showComments = appearance?.showComments !== false;

  const bgColor = theme === 'dark' ? 'bg-[#242526]' : 'bg-white';
  const cardBg = theme === 'dark' ? 'bg-[#3a3b3c]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryText = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#4e4f50]' : 'hover:bg-gray-100';

  return (
    <div className={`w-[500px] ${theme === 'dark' ? 'bg-[#18191a]' : 'bg-gray-100'}`}>
      {/* Header Bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${bgColor} border-b ${borderColor}`}>
        {/* Facebook Logo */}
        <svg className="h-10 w-auto" viewBox="0 0 36 36" fill="#1877f2">
          <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z" />
          <path fill="#fff" d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.167-.065-2.081-.065-2.952 0-4.09 1.116-4.09 4.025V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.53-.399Z" />
        </svg>

        <div className="flex items-center gap-2">
          {/* Menu Icon */}
          <button className={`rounded-full p-2 ${cardBg}`}>
            <svg className={`size-5 ${textColor}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          {/* Messenger Icon */}
          <button className={`rounded-full p-2 ${cardBg}`}>
            <svg className={`size-5 ${textColor}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.13.26.35.27.57l.05 1.78c.04.57.61.94 1.13.71l1.98-.87c.17-.08.36-.1.55-.06.9.25 1.85.39 2.88.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.93 4.67c-.47.74-1.46.93-2.2.42l-2.34-1.75a.6.6 0 00-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.93-4.67c.47-.74 1.46-.93 2.2-.42l2.34 1.75a.6.6 0 00.72 0l3.16-2.4c.42-.32.97.18.69.63z" />
            </svg>
          </button>
          {/* Notifications Icon */}
          <button className={`rounded-full p-2 ${cardBg}`}>
            <svg className={`size-5 ${textColor}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Card */}
      <div className={`m-2 rounded-lg ${bgColor} shadow`}>
        {/* Post Header */}
        <div className="flex items-start justify-between p-3">
          <div className="flex items-start gap-2">
            {/* Avatar */}
            <div className="size-10 overflow-hidden rounded-full bg-gray-300">
              {data.author.avatarUrl
                ? (
                    <img src={data.author.avatarUrl} alt={data.author.name} className="size-full object-cover" />
                  )
                : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white">
                      {data.author.name.charAt(0)}
                    </div>
                  )}
            </div>

            {/* Name and Meta */}
            <div>
              <div className="flex items-center gap-1">
                <span className={`font-semibold ${textColor}`}>{data.author.name}</span>
                {data.post.isVerified && (
                  <svg className="size-4 text-[#1877f2]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <div className={`flex items-center gap-1 text-xs ${secondaryText}`}>
                <span>{formatTimestamp(data.post.timestamp)}</span>
                <span>·</span>
                {/* Globe Icon for public */}
                <svg className="size-3" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm5.6 5.2h-1.9c-.2-1-.5-2-1-2.9 1.3.6 2.3 1.6 2.9 2.9zm-4.6-3a5.5 5.5 0 011.3 3h-2.6c.2-1.1.7-2.2 1.3-3zM2.4 5.2c.6-1.3 1.6-2.3 2.9-2.9-.5.9-.8 1.9-1 2.9H2.4zM2 8c0-.5 0-1 .1-1.4h2.2c0 .5-.1.9-.1 1.4 0 .5 0 .9.1 1.4H2.1c-.1-.4-.1-.9-.1-1.4zm.4 2.8h1.9c.2 1 .5 2 1 2.9-1.3-.6-2.3-1.6-2.9-2.9zm1.9 0h2.4c-.2 1-.5 2-.9 2.9-.4-.7-.7-1.6-.9-2.9h-1.5zm2.7 3c-.6-.8-1.1-1.9-1.3-3h2.6c-.2 1.1-.7 2.2-1.3 3zm2.7-4.4c0-.5 0-.9-.1-1.4h2.7c0 .5.1.9.1 1.4 0 .5 0 .9-.1 1.4H9.9c0-.5.1-.9.1-1.4h-.1zm1.6-2.8h-2.4c.2-1 .5-2 .9-2.9.4.7.7 1.6.9 2.9h1.5zm-.6 7.4c.5-.9.8-1.9 1-2.9h1.9c-.6 1.3-1.6 2.3-2.9 2.9zm1.1-4.3h2.2c.1.4.1.9.1 1.4s0 1-.1 1.4h-2.2c0-.5.1-.9.1-1.4 0-.5 0-.9-.1-1.4z" />
                </svg>
              </div>
            </div>
          </div>

          {/* More Options */}
          <button className={`rounded-full p-1.5 ${hoverBg}`}>
            <svg className={`size-5 ${secondaryText}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>

        {/* Post Content */}
        <div className={`px-3 pb-3 ${textColor}`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.post.content}</p>
        </div>

        {/* Post Image */}
        {data.post.mediaUrls?.[0] && (
          <div className="relative">
            <img
              src={data.post.mediaUrls[0]}
              alt="Post content"
              className="w-full object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        {/* Engagement Stats */}
        {showEngagement && (
          <div className={`flex items-center justify-between border-b px-3 py-2 ${borderColor}`}>
            <div className="flex items-center gap-1">
              {/* Reaction Icons */}
              <div className="flex -space-x-1">
                <div className="flex size-5 items-center justify-center rounded-full bg-[#1877f2] ring-2 ring-white dark:ring-gray-800">
                  <svg className="size-3 text-white" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287h-.001z" />
                  </svg>
                </div>
                {data.post.likes > 10 && (
                  <div className="flex size-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800">
                    <svg className="size-3 text-white" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-sm ${secondaryText}`}>{formatNumber(data.post.likes)}</span>
            </div>
            <div className={`flex items-center gap-3 text-sm ${secondaryText}`}>
              <span>
                {formatNumber(data.post.comments)}
                {' '}
                comments
              </span>
              <span>
                {formatNumber(data.post.shares)}
                {' '}
                shares
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`flex border-b ${borderColor}`}>
          <button className={`flex flex-1 items-center justify-center gap-2 py-2.5 ${hoverBg} ${secondaryText}`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </button>
          <button className={`flex flex-1 items-center justify-center gap-2 py-2.5 ${hoverBg} ${secondaryText}`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className={`flex flex-1 items-center justify-center gap-2 py-2.5 ${hoverBg} ${secondaryText}`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && data.comments && data.comments.length > 0 && (
          <div className="p-3">
            {data.comments.slice(0, 2).map((comment, index) => (
              <div key={index} className="mb-3 flex gap-2">
                <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-300">
                  {comment.authorAvatarUrl
                    ? (
                        <img src={comment.authorAvatarUrl} alt={comment.authorName} className="size-full object-cover" />
                      )
                    : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500 text-xs font-semibold text-white">
                          {comment.authorName.charAt(0)}
                        </div>
                      )}
                </div>
                <div>
                  <div className={`rounded-2xl px-3 py-2 ${cardBg}`}>
                    <span className={`text-sm font-semibold ${textColor}`}>{comment.authorName}</span>
                    <p className={`text-sm ${textColor}`}>{comment.content}</p>
                  </div>
                  <div className={`mt-1 flex items-center gap-3 px-3 text-xs ${secondaryText}`}>
                    <span>Like</span>
                    <span>Reply</span>
                    <span>{comment.timestamp}</span>
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
