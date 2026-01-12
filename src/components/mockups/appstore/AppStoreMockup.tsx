'use client';

import {
  Award,
  ChevronRight,
  Clock,
  Globe,
  Monitor,
  Share,
  Shield,
  Smartphone,
  Star,
} from 'lucide-react';

export type StorePlatform = 'ios' | 'android' | 'generic';

export type AppScreenshot = {
  url: string;
  alt?: string;
};

export type AppReview = {
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  helpful?: number;
};

export type AppData = {
  name: string;
  subtitle?: string;
  developer: string;
  developerUrl?: string;
  icon: string;
  price: string;
  rating: number;
  ratingsCount: string;
  category: string;
  ageRating: string;
  size: string;
  languages: string[];
  description: string;
  whatsNew?: string;
  version?: string;
  screenshots: AppScreenshot[];
  reviews?: AppReview[];
  inAppPurchases?: boolean;
  editorChoice?: boolean;
  featured?: boolean;
};

export type AppStoreMockupProps = {
  app: AppData;
  platform?: StorePlatform;
  variant?: 'full' | 'compact' | 'card' | 'featured' | 'search-result';
  showScreenshots?: boolean;
  showReviews?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function AppStoreMockup({
  app,
  platform = 'ios',
  variant = 'full',
  showScreenshots = true,
  showReviews = true,
  darkMode = false,
  className = '',
}: AppStoreMockupProps) {
  const getPlatformStyles = () => {
    switch (platform) {
      case 'ios':
        return {
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
          buttonText: app.price === 'Free' ? 'GET' : app.price,
          ratingColor: 'text-orange-500',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        };
      case 'android':
        return {
          button: 'bg-green-600 hover:bg-green-700 text-white',
          buttonText: 'Install',
          ratingColor: 'text-green-500',
          fontFamily: 'Roboto, sans-serif',
        };
      default:
        return {
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
          buttonText: app.price === 'Free' ? 'GET' : app.price,
          ratingColor: 'text-yellow-500',
          fontFamily: 'system-ui, sans-serif',
        };
    }
  };

  const styles = getPlatformStyles();

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 12 : 16;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={starSize}
            className={star <= rating ? styles.ratingColor : 'text-gray-300 dark:text-gray-600'}
            fill={star <= rating ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Search result variant
  if (variant === 'search-result') {
    return (
      <div className={`flex items-center gap-3 p-3 ${bgColor} rounded-xl ${className}`}>
        <img
          src={app.icon}
          alt={app.name}
          className="h-14 w-14 rounded-xl shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-medium ${textColor} truncate`}>{app.name}</h3>
          <p className={`text-sm ${mutedColor} truncate`}>{app.subtitle || app.category}</p>
          <div className="mt-1 flex items-center gap-2">
            {renderStars(app.rating, 'sm')}
            <span className={`text-xs ${mutedColor}`}>{app.ratingsCount}</span>
          </div>
        </div>
        <button className={`rounded-full px-4 py-1.5 text-sm font-semibold ${styles.button}`}>
          {styles.buttonText}
        </button>
      </div>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`${bgColor} rounded-2xl border ${borderColor} overflow-hidden ${className}`}>
        {app.featured && (
          <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <span className="absolute top-3 left-3 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur">
              Featured
            </span>
            <div className="absolute right-4 bottom-4 left-4">
              <span className="text-sm text-white/80">{app.category.toUpperCase()}</span>
              <h3 className="text-xl font-bold text-white">{app.name}</h3>
            </div>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <img
              src={app.icon}
              alt={app.name}
              className="h-16 w-16 rounded-xl shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold ${textColor}`}>{app.name}</h3>
              <p className={`text-sm ${mutedColor}`}>{app.subtitle || app.developer}</p>
              <div className="mt-1 flex items-center gap-2">
                {renderStars(app.rating, 'sm')}
                <span className={`text-xs ${mutedColor}`}>{app.ratingsCount}</span>
              </div>
            </div>
            <button className={`rounded-full px-4 py-1.5 text-sm font-semibold ${styles.button}`}>
              {styles.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`${bgColor} overflow-hidden rounded-3xl shadow-xl ${className}`}>
        <div className="relative h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          {app.editorChoice && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 backdrop-blur">
              <Award size={14} className="text-white" />
              <span className="text-xs font-medium text-white">Editor&apos;s Choice</span>
            </div>
          )}
          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <span className="text-sm font-medium text-white/80">{app.category}</span>
            <h2 className="mt-1 text-3xl font-bold text-white">{app.name}</h2>
            <p className="mt-1 text-white/80">{app.subtitle}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img
              src={app.icon}
              alt={app.name}
              className="h-20 w-20 rounded-2xl shadow-lg"
            />
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                {renderStars(app.rating)}
                <span className={`text-sm ${mutedColor}`}>
                  {app.rating.toFixed(1)}
                  {' '}
                  •
                  {' '}
                  {app.ratingsCount}
                  {' '}
                  Ratings
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={mutedColor}>{app.category}</span>
                <span className={mutedColor}>•</span>
                <span className={mutedColor}>{app.ageRating}</span>
              </div>
            </div>
            <button className={`rounded-full px-8 py-2.5 text-base font-semibold ${styles.button}`}>
              {styles.buttonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} border ${borderColor} rounded-xl p-4 ${className}`}>
        <div className="flex items-start gap-4">
          <img
            src={app.icon}
            alt={app.name}
            className="h-20 w-20 rounded-xl shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h3 className={`text-lg font-semibold ${textColor}`}>{app.name}</h3>
            <p className={`text-sm ${mutedColor}`}>{app.subtitle || app.developer}</p>
            <div className="mt-2 flex items-center gap-2">
              {renderStars(app.rating, 'sm')}
              <span className={`text-sm ${mutedColor}`}>{app.ratingsCount}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button className={`rounded-full px-6 py-1.5 text-sm font-semibold ${styles.button}`}>
                {styles.buttonText}
              </button>
              {app.inAppPurchases && (
                <span className={`text-xs ${mutedColor}`}>In-App Purchases</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${bgColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-6 ${borderColor}`}>
        <div className="flex items-start gap-5">
          <img
            src={app.icon}
            alt={app.name}
            className="h-28 w-28 rounded-[22px] shadow-lg"
          />
          <div className="flex-1">
            <h1 className={`text-2xl font-bold ${textColor}`}>{app.name}</h1>
            <p className={`text-lg ${mutedColor}`}>{app.subtitle}</p>
            <button className="mt-1 text-sm font-medium text-blue-500 hover:text-blue-600">
              {app.developer}
            </button>

            <div className="mt-4 flex items-center gap-4">
              <button className={`rounded-full px-8 py-2 text-base font-semibold ${styles.button}`}>
                {styles.buttonText}
              </button>
              <button className={`rounded-full border p-2 ${borderColor} ${mutedColor} hover:bg-gray-100 dark:hover:bg-gray-800`}>
                <Share size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {renderStars(app.rating, 'sm')}
            </div>
            <p className={`text-xs ${mutedColor} mt-1`}>
              {app.ratingsCount}
              {' '}
              Ratings
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className={`text-lg font-semibold ${textColor}`}>{app.ageRating}</p>
            <p className={`text-xs ${mutedColor}`}>Age</p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className={`text-lg font-semibold ${textColor}`}>{app.category}</p>
            <p className={`text-xs ${mutedColor}`}>Category</p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="text-center">
            <p className={`text-lg font-semibold ${textColor}`}>{app.developer}</p>
            <p className={`text-xs ${mutedColor}`}>Developer</p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center justify-center text-center">
            <Globe size={20} className={mutedColor} />
          </div>
        </div>
      </div>

      {/* Screenshots */}
      {showScreenshots && app.screenshots.length > 0 && (
        <div className={`border-b p-6 ${borderColor}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${textColor}`}>Preview</h2>
            <div className="flex items-center gap-2 text-blue-500">
              <Smartphone size={18} />
              <span className="text-sm font-medium">iPhone</span>
              <Monitor size={18} className={mutedColor} />
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {app.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot.url}
                alt={screenshot.alt || `Screenshot ${index + 1}`}
                className="h-[400px] flex-shrink-0 rounded-xl shadow-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className={`border-b p-6 ${borderColor}`}>
        <p className={`${textColor} leading-relaxed`}>{app.description}</p>
        <button className="mt-2 flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600">
          more
          {' '}
          <ChevronRight size={16} />
        </button>
      </div>

      {/* What's New */}
      {app.whatsNew && (
        <div className={`border-b p-6 ${borderColor}`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${textColor}`}>What&apos;s New</h2>
            <span className={`text-sm ${mutedColor}`}>
              Version
              {app.version}
            </span>
          </div>
          <p className={`${textColor} leading-relaxed`}>{app.whatsNew}</p>
        </div>
      )}

      {/* Ratings & Reviews */}
      {showReviews && app.reviews && app.reviews.length > 0 && (
        <div className={`border-b p-6 ${borderColor}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-xl font-bold ${textColor}`}>Ratings & Reviews</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600">
              See All
              {' '}
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mb-6 flex items-start gap-8">
            <div className="text-center">
              <p className={`text-5xl font-bold ${textColor}`}>{app.rating.toFixed(1)}</p>
              <p className={`text-sm ${mutedColor}`}>out of 5</p>
              <div className="mt-2">{renderStars(app.rating)}</div>
              <p className={`text-xs ${mutedColor} mt-1`}>
                {app.ratingsCount}
                {' '}
                Ratings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {app.reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${textColor}`}>{review.title}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      {renderStars(review.rating, 'sm')}
                      <span className={`text-sm ${mutedColor}`}>{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${textColor}`}>{review.body}</p>
                <p className={`text-xs ${mutedColor} mt-2`}>
                  by
                  {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information */}
      <div className="p-6">
        <h2 className={`text-xl font-bold ${textColor} mb-4`}>Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Provider', value: app.developer },
            { label: 'Size', value: app.size },
            { label: 'Category', value: app.category },
            { label: 'Age Rating', value: app.ageRating },
            { label: 'Languages', value: app.languages.join(', ') },
            { label: 'Price', value: app.price },
          ].map((item, index) => (
            <div key={index} className="flex justify-between border-b border-gray-100 py-2 dark:border-gray-800">
              <span className={mutedColor}>{item.label}</span>
              <span className={textColor}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Privacy Section */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <div className="mb-2 flex items-center gap-3">
            <Shield size={20} className="text-blue-500" />
            <h3 className={`font-semibold ${textColor}`}>App Privacy</h3>
          </div>
          <p className={`text-sm ${mutedColor}`}>
            The developer indicated that the app&apos;s privacy practices may include handling of data.
          </p>
        </div>

        {/* Supports */}
        <div className="mt-4 flex items-center gap-4">
          {[
            { icon: <Smartphone size={16} />, label: 'iPhone' },
            { icon: <Monitor size={16} />, label: 'iPad' },
            { icon: <Clock size={16} />, label: 'Apple Watch' },
          ].map((device, index) => (
            <div key={index} className={`flex items-center gap-1.5 ${mutedColor} text-sm`}>
              {device.icon}
              {device.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
