'use client';

export type PinterestPinData = {
  image: string;
  title: string;
  description?: string;
  link?: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
    followers?: string;
    verified?: boolean;
  };
  board?: {
    name: string;
    pinCount?: number;
  };
  saves: string;
  comments?: number;
  relatedPins?: {
    image: string;
    title: string;
  }[];
  tags?: string[];
};

type PinterestMockupProps = {
  data: PinterestPinData;
  appearance?: {
    theme?: 'light' | 'dark';
    view?: 'pin' | 'feed' | 'closeup';
    showRelated?: boolean;
  };
};

export function PinterestMockup({ data, appearance = {} }: PinterestMockupProps) {
  const {
    theme = 'light',
    view = 'closeup',
    showRelated = true,
  } = appearance;

  const isDark = theme === 'dark';

  const getInitials = () => {
    return data.author.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Feed view - Pin card in grid
  if (view === 'feed') {
    return (
      <div className={`w-64 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        <div className="group relative cursor-pointer">
          {/* Pin Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="aspect-[2/3] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${data.image})` }}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-3 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              {/* Top actions */}
              <div className="flex items-center justify-between">
                <select className="rounded-full bg-[#e60023] px-4 py-2 text-sm font-semibold text-white">
                  <option>Profile</option>
                </select>
                <button
                  type="button"
                  className="rounded-full bg-[#e60023] px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-between">
                {data.link && (
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-gray-900"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit
                  </button>
                )}
                <div className="flex gap-2">
                  <button type="button" className="rounded-full bg-white/90 p-2">
                    <svg className="size-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <button type="button" className="rounded-full bg-white/90 p-2">
                    <svg className="size-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pin info */}
          <div className="p-2">
            {data.title && (
              <h3 className={`line-clamp-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.title}
              </h3>
            )}
            <div className="mt-2 flex items-center gap-2">
              {data.author.avatar
                ? (
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${data.author.avatar})` }}
                    />
                  )
                : (
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-600">
                      {getInitials()}
                    </div>
                  )}
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {data.author.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Closeup view - Pin detail page
  return (
    <div className={`mx-auto max-w-5xl overflow-hidden rounded-3xl shadow-2xl ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="lg:w-1/2">
          <div
            className="aspect-[3/4] w-full bg-cover bg-center lg:aspect-auto lg:h-full"
            style={{ backgroundImage: `url(${data.image})` }}
          />
        </div>

        {/* Right side - Content */}
        <div className={`flex flex-col p-6 lg:w-1/2 lg:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
          {/* Top actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" className={`rounded-full p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <svg className={`size-6 ${isDark ? 'text-white' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              <button type="button" className={`rounded-full p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <svg className={`size-6 ${isDark ? 'text-white' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
              <button type="button" className={`rounded-full p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <svg className={`size-6 ${isDark ? 'text-white' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select className={`rounded-lg border px-4 py-2 text-sm ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white'}`}>
                <option>{data.board?.name || 'Profile'}</option>
              </select>
              <button
                type="button"
                className="rounded-full bg-[#e60023] px-6 py-3 text-base font-semibold text-white hover:bg-[#ad081b]"
              >
                Save
              </button>
            </div>
          </div>

          {/* Link preview */}
          {data.link && (
            <a
              href={data.link}
              className={`mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {new URL(data.link).hostname}
            </a>
          )}

          {/* Title */}
          <h1 className={`mb-4 text-2xl font-bold lg:text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.title}
          </h1>

          {/* Description */}
          {data.description && (
            <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {data.description}
            </p>
          )}

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {data.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`rounded-full px-3 py-1 text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="mt-auto">
            <div className={`flex items-center justify-between border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                {data.author.avatar
                  ? (
                      <div
                        className="size-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${data.author.avatar})` }}
                      />
                    )
                  : (
                      <div className="flex size-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-gray-600">
                        {getInitials()}
                      </div>
                    )}
                <div>
                  <div className="flex items-center gap-1">
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {data.author.name}
                    </span>
                    {data.author.verified && (
                      <svg className="size-4 text-[#e60023]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {data.author.followers}
                    {' '}
                    followers
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              >
                Follow
              </button>
            </div>

            {/* Engagement */}
            <div className={`mt-4 flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>
                {data.saves}
                {' '}
                saves
              </span>
              {data.comments !== undefined && (
                <span>
                  {data.comments}
                  {' '}
                  comments
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Pins */}
      {showRelated && data.relatedPins && data.relatedPins.length > 0 && (
        <div className={`border-t p-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`mb-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            More like this
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.relatedPins.slice(0, 6).map((pin, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <div
                    className="size-full bg-cover bg-center transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${pin.image})` }}
                  />
                </div>
                <p className={`mt-2 line-clamp-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {pin.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PinterestMockup;
