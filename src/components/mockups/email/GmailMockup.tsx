'use client';

export type GmailEmailData = {
  from: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  cc?: {
    name: string;
    email: string;
  }[];
  subject: string;
  date: string;
  body: string;
  isHtml?: boolean;
  attachments?: {
    name: string;
    size: string;
    type: 'pdf' | 'doc' | 'image' | 'zip' | 'other';
  }[];
  labels?: string[];
  isStarred?: boolean;
  isImportant?: boolean;
};

type GmailMockupProps = {
  data: GmailEmailData;
  appearance?: {
    theme?: 'light' | 'dark';
    view?: 'inbox' | 'email';
    density?: 'comfortable' | 'cozy' | 'compact';
  };
};

const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: (
    <svg className="size-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
  doc: (
    <svg className="size-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  ),
  image: (
    <svg className="size-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  ),
  zip: (
    <svg className="size-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-2 6h-2v2h2v2h-2v2h-2v-2h2v-2h-2v-2h2v-2h-2V8h2v2h2v2z" />
    </svg>
  ),
  other: (
    <svg className="size-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
    </svg>
  ),
};

export function GmailMockup({ data, appearance = {} }: GmailMockupProps) {
  const {
    theme = 'light',
    view = 'email',
    density = 'comfortable',
  } = appearance;

  const isDark = theme === 'dark';

  const densityPadding = {
    comfortable: 'p-4',
    cozy: 'p-3',
    compact: 'p-2',
  };

  return (
    <div className={`overflow-hidden rounded-xl border ${
      isDark
        ? 'border-gray-700 bg-[#1f1f1f] text-white'
        : 'border-gray-200 bg-white text-gray-900'
    }`}
    >
      {/* Gmail Header */}
      <div className={`flex items-center justify-between border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } ${densityPadding[density]}`}
      >
        <div className="flex items-center gap-3">
          {/* Gmail Logo */}
          <svg className="h-8 w-auto" viewBox="0 0 75 24" fill="none">
            <path d="M7.04 20.5c-4.23 0-7.04-3.25-7.04-7.5S2.81 5.5 7.04 5.5c2.24 0 3.85.88 5.05 2.02l-1.42 1.42c-.87-.82-2.04-1.44-3.63-1.44-2.97 0-5.29 2.39-5.29 5.5s2.32 5.5 5.29 5.5c1.92 0 3.01-.77 3.71-1.47.58-.58.95-1.41 1.1-2.55H7.04v-2h6.79c.07.36.11.8.11 1.26 0 1.52-.42 3.4-1.75 4.75-1.3 1.37-2.95 2.01-4.95 2.01z" fill={isDark ? '#fff' : '#4285F4'} />
            <path d="M27.06 13c0 3.69-2.89 6.4-6.43 6.4s-6.43-2.71-6.43-6.4 2.89-6.4 6.43-6.4 6.43 2.71 6.43 6.4zm-2.82 0c0-2.3-1.67-3.87-3.61-3.87S17 10.7 17 13s1.67 3.87 3.63 3.87 3.61-1.57 3.61-3.87z" fill={isDark ? '#fff' : '#EA4335'} />
            <path d="M41.13 13c0 3.69-2.89 6.4-6.43 6.4s-6.43-2.71-6.43-6.4 2.89-6.4 6.43-6.4 6.43 2.71 6.43 6.4zm-2.82 0c0-2.3-1.67-3.87-3.61-3.87S31.07 10.7 31.07 13s1.67 3.87 3.63 3.87 3.61-1.57 3.61-3.87z" fill={isDark ? '#fff' : '#FBBC04'} />
            <path d="M54.58 6.96v11.4c0 4.69-2.77 6.6-6.04 6.6-3.08 0-4.94-2.06-5.64-3.75l2.46-1.02c.43 1.03 1.49 2.25 3.18 2.25 2.08 0 3.36-1.28 3.36-3.7v-.91h-.1c-.62.76-1.81 1.43-3.31 1.43-3.14 0-6.02-2.74-6.02-6.27s2.88-6.35 6.02-6.35c1.5 0 2.69.67 3.31 1.41h.1v-1.07h2.68zm-2.48 6.05c0-2.24-1.49-3.87-3.39-3.87s-3.52 1.63-3.52 3.87c0 2.22 1.62 3.79 3.52 3.79s3.39-1.57 3.39-3.79z" fill={isDark ? '#fff' : '#4285F4'} />
            <path d="M58.35 0h2.82v19.19h-2.82z" fill={isDark ? '#fff' : '#34A853'} />
            <path d="M70.98 15.38l2.19 1.46c-.71 1.04-2.41 2.84-5.35 2.84-3.65 0-6.37-2.82-6.37-6.42 0-3.82 2.74-6.42 6.06-6.42 3.34 0 4.97 2.66 5.5 4.09l.29.73-8.59 3.56c.66 1.29 1.68 1.95 3.12 1.95 1.44 0 2.44-.71 3.15-1.79zm-6.74-2.31l5.74-2.38c-.32-.8-1.26-1.36-2.38-1.36-1.43 0-3.42 1.26-3.36 3.74z" fill={isDark ? '#fff' : '#EA4335'} />
          </svg>

          {/* Mail label */}
          <span className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
            Mail
          </span>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-2">
          <button type="button" className={`rounded-full p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button type="button" className={`rounded-full p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Email Content */}
      {view === 'email' && (
        <div className={densityPadding[density]}>
          {/* Email Header */}
          <div className="mb-4">
            {/* Subject Line */}
            <div className="mb-4 flex items-start justify-between">
              <h1 className={`text-xl font-normal ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.subject}
              </h1>
              <div className="flex items-center gap-2">
                {data.isImportant && (
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                  </svg>
                )}
                {data.isStarred && (
                  <svg className="size-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                )}
                {data.labels?.map(label => (
                  <span
                    key={label}
                    className={`rounded px-2 py-0.5 text-xs ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Sender Info */}
            <div className="flex items-start gap-3">
              {data.from.avatarUrl
                ? (
                    <div
                      className="size-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${data.from.avatarUrl})` }}
                    />
                  )
                : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white">
                      {data.from.name.charAt(0).toUpperCase()}
                    </div>
                  )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.from.name}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    &lt;
                    {data.from.email}
                    &gt;
                  </span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>
                    to
                    {data.to.map(t => t.name || t.email).join(', ')}
                  </span>
                  {data.cc && data.cc.length > 0 && (
                    <span>
                      , cc:
                      {data.cc.map(c => c.name || c.email).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {data.date}
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className={`mb-4 whitespace-pre-wrap ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
          >
            {data.isHtml
              ? (
                  <div dangerouslySetInnerHTML={{ __html: data.body }} />
                )
              : (
                  <p className="leading-relaxed">{data.body}</p>
                )}
          </div>

          {/* Attachments */}
          {data.attachments && data.attachments.length > 0 && (
            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
              <p className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {data.attachments.length}
                {' '}
                Attachment
                {data.attachments.length > 1 ? 's' : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {data.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-lg border ${
                      isDark
                        ? 'border-gray-700 bg-gray-800'
                        : 'border-gray-200 bg-gray-50'
                    } px-3 py-2`}
                  >
                    {fileTypeIcons[attachment.type]}
                    <div>
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {attachment.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {attachment.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className={`flex items-center gap-2 rounded-lg border ${
                isDark
                  ? 'border-gray-600 bg-[#8ab4f8] text-[#1f1f1f]'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              } px-4 py-2 text-sm font-medium`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 rounded-lg border ${
                isDark
                  ? 'border-gray-600 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-50'
              } px-4 py-2 text-sm font-medium`}
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Forward
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
