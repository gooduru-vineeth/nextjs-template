'use client';

export type GooglePlayData = {
  appIcon: string;
  appName: string;
  developer: {
    name: string;
    verified?: boolean;
  };
  rating: number;
  reviewsCount: string;
  downloadsCount: string;
  contentRating: string;
  price?: string;
  containsAds?: boolean;
  inAppPurchases?: boolean;
  screenshots: string[];
  shortDescription: string;
  fullDescription?: string;
  whatsNew?: string;
  dataPrivacy?: {
    dataSafety: 'verified' | 'pending';
    dataShared?: string[];
    dataCollected?: string[];
  };
  reviews?: {
    rating: number;
    content: string;
    author: string;
    date: string;
    avatarUrl?: string;
    helpful?: number;
    developerResponse?: {
      content: string;
      date: string;
    };
  }[];
  size?: string;
  version?: string;
  lastUpdated?: string;
  requiresAndroid?: string;
  similarApps?: {
    icon: string;
    name: string;
    rating: number;
    price?: string;
  }[];
};

type GooglePlayMockupProps = {
  data: GooglePlayData;
  appearance?: {
    theme?: 'light' | 'dark';
    showFullDescription?: boolean;
  };
};

function PlayStarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const starSize = size === 'md' ? 'size-4' : 'size-3';
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? 'text-[#1f7a1f]'
              : star - 0.5 <= rating
                ? 'text-[#1f7a1f]'
                : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function GooglePlayMockup({ data, appearance = {} }: GooglePlayMockupProps) {
  const {
    theme = 'light',
    showFullDescription = false,
  } = appearance;

  const isDark = theme === 'dark';

  return (
    <div className={`mx-auto max-w-md overflow-hidden ${
      isDark ? 'bg-[#1f1f1f] text-white' : 'bg-white text-black'
    }`}
    >
      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-1 ${
        isDark ? 'bg-[#1f1f1f]' : 'bg-white'
      }`}
      >
        <span className="text-sm">10:30</span>
        <div className="flex items-center gap-2">
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" />
          </svg>
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 4h-3V2h-4v2H7v18h10V4zm-4 16h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v6z" />
          </svg>
        </div>
      </div>

      {/* App Header */}
      <div className={`p-4 ${isDark ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
        <div className="flex gap-4">
          <div
            className="size-20 flex-shrink-0 rounded-2xl bg-cover bg-center shadow-md"
            style={{ backgroundImage: `url(${data.appIcon})` }}
          />
          <div className="flex-1">
            <h1 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              {data.appName}
            </h1>
            <p className="text-sm text-[#01875f]">
              {data.developer.name}
              {data.developer.verified && (
                <svg className="ml-1 inline-block size-3.5 text-[#01875f]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              )}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              {data.containsAds && (
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Contains ads</span>
              )}
              {data.inAppPurchases && (
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>In-app purchases</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 flex items-center justify-start gap-6 overflow-x-auto">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                {data.rating.toFixed(1)}
              </span>
              <svg className="size-3 text-[#1f7a1f]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {data.reviewsCount}
              {' '}
              reviews
            </p>
          </div>
          <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="flex-shrink-0">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              {data.downloadsCount}
              +
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Downloads
            </p>
          </div>
          <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <div className="flex-shrink-0">
            <div className={`flex size-6 items-center justify-center rounded border text-xs font-medium ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}
            >
              {data.contentRating.replace('+', '')}
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              Rated for
              {' '}
              {data.contentRating}
            </p>
          </div>
        </div>

        {/* Install Button */}
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-[#01875f] py-2.5 text-sm font-medium text-white"
        >
          {data.price || 'Install'}
        </button>
        <p className={`mt-2 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          By tapping Install, you agree to the Google Play Terms of Service
        </p>
      </div>

      {/* Screenshots */}
      {data.screenshots.length > 0 && (
        <div className={`px-4 py-2 ${isDark ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {data.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="h-56 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200"
              >
                <div
                  className="size-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${screenshot})` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About this app */}
      <div className={`px-4 py-4 ${isDark ? 'bg-[#1f1f1f]' : 'bg-white'}`}>
        <h2 className={`mb-3 font-medium ${isDark ? 'text-white' : 'text-black'}`}>
          About this app
        </h2>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {showFullDescription && data.fullDescription
            ? data.fullDescription
            : data.shortDescription}
        </p>
        {data.fullDescription && !showFullDescription && (
          <button type="button" className="mt-2 text-sm font-medium text-[#01875f]">
            See more
          </button>
        )}
      </div>

      {/* What's New */}
      {data.whatsNew && (
        <div className={`border-t px-4 py-4 ${
          isDark ? 'border-gray-800 bg-[#1f1f1f]' : 'border-gray-100 bg-white'
        }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              What&apos;s new
            </h2>
            {data.lastUpdated && (
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Updated
                {' '}
                {data.lastUpdated}
              </span>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {data.whatsNew}
          </p>
        </div>
      )}

      {/* Data Safety */}
      {data.dataPrivacy && (
        <div className={`border-t px-4 py-4 ${
          isDark ? 'border-gray-800 bg-[#1f1f1f]' : 'border-gray-100 bg-white'
        }`}
        >
          <h2 className={`mb-3 font-medium ${isDark ? 'text-white' : 'text-black'}`}>
            Data safety
          </h2>
          <div className={`rounded-lg border p-3 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
          >
            <div className="flex items-start gap-3">
              <svg className="size-5 text-[#01875f]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <div>
                <p className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>
                  Safety starts with understanding how developers collect and share your data
                </p>
                <button type="button" className="mt-1 text-sm font-medium text-[#01875f]">
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ratings and Reviews */}
      {data.reviews && data.reviews.length > 0 && (
        <div className={`border-t px-4 py-4 ${
          isDark ? 'border-gray-800 bg-[#1f1f1f]' : 'border-gray-100 bg-white'
        }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              Ratings and reviews
            </h2>
            <button type="button" className="text-sm font-medium text-[#01875f]">
              See all
            </button>
          </div>

          {/* Overall Rating */}
          <div className="mb-4 flex items-center gap-4">
            <div>
              <p className={`text-5xl font-light ${isDark ? 'text-white' : 'text-black'}`}>
                {data.rating.toFixed(1)}
              </p>
              <PlayStarRating rating={data.rating} size="md" />
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {data.reviewsCount}
                {' '}
                reviews
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {data.reviews.slice(0, 2).map((review, index) => (
              <div key={index}>
                <div className="mb-2 flex items-start gap-3">
                  {review.avatarUrl
                    ? (
                        <div
                          className="size-8 rounded-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${review.avatarUrl})` }}
                        />
                      )
                    : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#01875f] text-sm font-medium text-white">
                          {review.author.charAt(0)}
                        </div>
                      )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                        {review.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayStarRating rating={review.rating} />
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {review.content}
                </p>
                {review.helpful && (
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    {review.helpful}
                    {' '}
                    people found this review helpful
                  </p>
                )}
                {review.developerResponse && (
                  <div className={`mt-2 rounded-lg p-3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className={`mb-1 text-xs font-medium ${isDark ? 'text-white' : 'text-black'}`}>
                      {data.developer.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {review.developerResponse.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Apps */}
      {data.similarApps && data.similarApps.length > 0 && (
        <div className={`border-t px-4 py-4 ${
          isDark ? 'border-gray-800 bg-[#1f1f1f]' : 'border-gray-100 bg-white'
        }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              Similar apps
            </h2>
            <button type="button" className="text-sm font-medium text-[#01875f]">
              See more
            </button>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4">
            {data.similarApps.map((app, index) => (
              <div key={index} className="w-24 flex-shrink-0">
                <div
                  className="mb-2 size-16 rounded-xl bg-cover bg-center shadow"
                  style={{ backgroundImage: `url(${app.icon})` }}
                />
                <p className={`truncate text-xs ${isDark ? 'text-white' : 'text-black'}`}>
                  {app.name}
                </p>
                <div className="flex items-center gap-1">
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    {app.rating.toFixed(1)}
                  </span>
                  <svg className="size-2.5 text-[#1f7a1f]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
