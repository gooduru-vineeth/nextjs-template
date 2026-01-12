'use client';

export type iOSAppStoreData = {
  appIcon: string;
  appName: string;
  subtitle?: string;
  developer: {
    name: string;
    verified?: boolean;
  };
  rating: number;
  ratingsCount: string;
  ageRating: string;
  category: string;
  rank?: {
    position: number;
    category: string;
  };
  price?: string;
  inAppPurchases?: boolean;
  screenshots: {
    url: string;
    device: 'iphone' | 'ipad';
  }[];
  description: string;
  whatsNew?: {
    version: string;
    date: string;
    notes: string;
  };
  reviews?: {
    rating: number;
    title: string;
    content: string;
    author: string;
    date: string;
    helpful?: number;
  }[];
  size?: string;
  compatibility?: string;
  languages?: string[];
  developerApps?: {
    icon: string;
    name: string;
    price: string;
  }[];
};

type iOSAppStoreMockupProps = {
  data: iOSAppStoreData;
  appearance?: {
    theme?: 'light' | 'dark';
    device?: 'iphone' | 'ipad';
    showFullDescription?: boolean;
  };
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`size-3 ${star <= Math.round(rating) ? 'text-[#ff9500]' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function iOSAppStoreMockup({ data, appearance = {} }: iOSAppStoreMockupProps) {
  const {
    theme = 'light',
    showFullDescription = false,
  } = appearance;

  const isDark = theme === 'dark';

  return (
    <div className={`mx-auto max-w-md overflow-hidden ${
      isDark ? 'bg-black text-white' : 'bg-[#f2f2f7] text-black'
    }`}
    >
      {/* Status Bar */}
      <div className={`flex items-center justify-between px-5 py-2 ${isDark ? 'bg-black' : 'bg-[#f2f2f7]'}`}>
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="h-3 w-4" fill="currentColor" viewBox="0 0 24 12">
            <rect x="0" y="4" width="3" height="8" rx="0.5" />
            <rect x="5" y="2" width="3" height="10" rx="0.5" />
            <rect x="10" y="0" width="3" height="12" rx="0.5" />
            <rect x="15" y="0" width="3" height="12" rx="0.5" />
          </svg>
          <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21l-1.5-2.5c-3-5-4.5-7.5-4.5-10.5a6 6 0 0112 0c0 3-1.5 5.5-4.5 10.5L12 21z" />
          </svg>
          <svg className="h-4 w-6" fill="currentColor" viewBox="0 0 25 12">
            <rect x="0" y="0" width="22" height="12" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
            <rect x="2" y="2" width="18" height="8" rx="1" />
            <rect x="23" y="4" width="2" height="4" rx="0.5" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className={`px-4 pt-2 ${isDark ? 'bg-black' : 'bg-[#f2f2f7]'}`}>
        {/* App Header */}
        <div className="mb-4 flex gap-4">
          <div
            className="size-28 flex-shrink-0 rounded-[22px] bg-cover bg-center shadow-lg"
            style={{ backgroundImage: `url(${data.appIcon})` }}
          />
          <div className="flex-1">
            <h1 className={`text-xl leading-tight font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {data.appName}
            </h1>
            {data.subtitle && (
              <p className={`mt-0.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {data.subtitle}
              </p>
            )}
            <p className="mt-1 text-xs text-[#007aff]">
              {data.developer.name}
            </p>

            {/* Get Button */}
            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                className="rounded-full bg-[#007aff] px-6 py-1.5 text-sm font-bold text-white"
              >
                {data.price || 'GET'}
              </button>
              {data.inAppPurchases && (
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  In-App Purchases
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={`mb-4 flex items-center justify-between border-y py-3 ${
          isDark ? 'border-gray-800' : 'border-gray-300'
        }`}
        >
          <div className="flex-1 text-center">
            <p className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {data.ratingsCount}
              {' '}
              Ratings
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                {data.rating.toFixed(1)}
              </span>
              <StarRating rating={data.rating} />
            </div>
          </div>
          <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
          <div className="flex-1 text-center">
            <p className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Age
            </p>
            <p className={`mt-1 text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {data.ageRating}
            </p>
          </div>
          <div className={`h-8 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
          <div className="flex-1 text-center">
            <p className={`text-xs uppercase ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Category
            </p>
            <p className={`mt-1 text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              {data.rank ? `#${data.rank.position}` : data.category}
            </p>
          </div>
        </div>

        {/* Screenshots */}
        {data.screenshots.length > 0 && (
          <div className="mb-4">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {data.screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="h-64 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200"
                >
                  <div
                    className="size-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${screenshot.url})` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {showFullDescription
              ? data.description
              : `${data.description.slice(0, 200)}${data.description.length > 200 ? '...' : ''}`}
          </p>
          {data.description.length > 200 && !showFullDescription && (
            <button type="button" className="mt-1 text-sm font-medium text-[#007aff]">
              more
            </button>
          )}
        </div>

        {/* What's New */}
        {data.whatsNew && (
          <div className={`mb-4 rounded-xl p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>What&apos;s New</h2>
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Version
                {' '}
                {data.whatsNew.version}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {data.whatsNew.date}
            </p>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {data.whatsNew.notes}
            </p>
          </div>
        )}

        {/* Reviews */}
        {data.reviews && data.reviews.length > 0 && (
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                Ratings & Reviews
              </h2>
              <button type="button" className="text-sm text-[#007aff]">
                See All
              </button>
            </div>
            <div className="space-y-3">
              {data.reviews.slice(0, 2).map((review, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                        {review.title}
                      </h3>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {review.date}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {review.content}
                  </p>
                  <p className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {review.author}
                    {review.helpful && ` · ${review.helpful} found this helpful`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information */}
        <div className={`mb-4 rounded-xl p-4 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <h2 className={`mb-3 font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            Information
          </h2>
          <div className="space-y-3">
            {data.size && (
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Size</span>
                <span className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>{data.size}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Category</span>
              <span className="text-sm text-[#007aff]">{data.category}</span>
            </div>
            {data.compatibility && (
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Compatibility</span>
                <span className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>{data.compatibility}</span>
              </div>
            )}
            {data.languages && (
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Languages</span>
                <span className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>
                  {data.languages.slice(0, 3).join(', ')}
                  {data.languages.length > 3 && ` +${data.languages.length - 3}`}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Age Rating</span>
              <span className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>{data.ageRating}</span>
            </div>
            {data.price && (
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Price</span>
                <span className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}>{data.price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Developer Apps */}
        {data.developerApps && data.developerApps.length > 0 && (
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                More by
                {' '}
                {data.developer.name}
              </h2>
              <button type="button" className="text-sm text-[#007aff]">
                See All
              </button>
            </div>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4">
              {data.developerApps.map((app, index) => (
                <div key={index} className="w-20 flex-shrink-0">
                  <div
                    className="mb-2 size-20 rounded-[18px] bg-cover bg-center shadow"
                    style={{ backgroundImage: `url(${app.icon})` }}
                  />
                  <p className={`truncate text-xs ${isDark ? 'text-white' : 'text-black'}`}>
                    {app.name}
                  </p>
                  <p className="text-xs text-[#007aff]">{app.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className={`flex justify-center py-2 ${isDark ? 'bg-black' : 'bg-[#f2f2f7]'}`}>
        <div className={`h-1 w-32 rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
      </div>
    </div>
  );
}
