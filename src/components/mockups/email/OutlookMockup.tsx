'use client';

export type OutlookEmailData = {
  from: {
    name: string;
    email: string;
    avatarUrl?: string;
    initials?: string;
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
    type: 'pdf' | 'doc' | 'excel' | 'ppt' | 'image' | 'other';
  }[];
  category?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';
  isFlagged?: boolean;
  isPinned?: boolean;
  importance?: 'high' | 'normal' | 'low';
};

type OutlookMockupProps = {
  data: OutlookEmailData;
  appearance?: {
    theme?: 'light' | 'dark';
    view?: 'list' | 'reading';
    layout?: 'horizontal' | 'vertical';
  };
};

const categoryColors: Record<string, { bg: string; border: string }> = {
  blue: { bg: 'bg-blue-500', border: 'border-blue-500' },
  green: { bg: 'bg-green-500', border: 'border-green-500' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-500' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-500' },
  red: { bg: 'bg-red-500', border: 'border-red-500' },
  yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500' },
};

const fileTypeColors: Record<string, string> = {
  pdf: 'bg-red-600',
  doc: 'bg-blue-700',
  excel: 'bg-green-700',
  ppt: 'bg-orange-600',
  image: 'bg-purple-600',
  other: 'bg-gray-600',
};

export function OutlookMockup({ data, appearance = {} }: OutlookMockupProps) {
  const {
    theme = 'light',
    view = 'reading',
  } = appearance;

  const isDark = theme === 'dark';

  const getInitials = () => {
    if (data.from.initials) {
      return data.from.initials;
    }
    return data.from.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`overflow-hidden rounded-lg shadow-lg ${
      isDark ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-900'
    }`}
    >
      {/* Outlook Header */}
      <div className={`flex items-center justify-between border-b px-4 py-2 ${
        isDark ? 'border-gray-700 bg-[#0078d4]' : 'border-gray-200 bg-[#0078d4]'
      }`}
      >
        <div className="flex items-center gap-3">
          {/* Outlook Logo */}
          <svg className="size-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3h-3zm0 4.5v3h3v-3h-3zm0 4.5v1.83l3.05-1.83H18zm-5.25-9v3h3.75v-3h-3.75zm0 4.5v3h3.75v-3h-3.75zm0 4.5v2.03l2.41 1.5 1.34-.8v-2.73h-3.75zM9 3.75V6h2l.13.01.12.04v-2.3H9zM3.62 13.17q.3.5.89.74.58.25 1.41.25h1.44q1.47 0 2.35-.78.89-.78.89-2.21 0-.76-.26-1.3-.27-.53-.73-.87-.46-.34-1.08-.5-.63-.16-1.34-.16H5.82l.27-1.3h2.3q.62 0 1.14-.11.51-.11.88-.35.38-.24.59-.61.21-.37.21-.89 0-.39-.12-.69-.12-.3-.36-.5-.23-.21-.57-.32-.34-.1-.78-.1-.85 0-1.37.39-.52.38-.72.99l-1.58-.58q.11-.44.39-.87.28-.42.72-.76.44-.33 1.05-.54.61-.2 1.41-.2 1.5 0 2.37.74.88.74.88 1.84 0 .68-.33 1.2-.32.53-.97.82v.04q.8.21 1.29.78.48.56.48 1.46 0 .8-.28 1.4-.27.61-.77 1.03-.5.42-1.18.63-.68.22-1.5.22-.78 0-1.48-.21-.7-.22-1.26-.62-.56-.41-.93-.98-.36-.58-.46-1.3z" />
          </svg>
          <span className="font-semibold text-white">Outlook</span>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="rounded p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button type="button" className="rounded p-1.5 text-white/80 hover:bg-white/10 hover:text-white">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className={`flex items-center gap-2 border-b px-4 py-2 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
      >
        <button
          type="button"
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm ${
            isDark
              ? 'bg-[#0078d4] text-white hover:bg-[#106ebe]'
              : 'bg-[#0078d4] text-white hover:bg-[#106ebe]'
          }`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Reply
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm ${
            isDark
              ? 'border border-gray-600 hover:bg-gray-700'
              : 'border border-gray-300 hover:bg-gray-100'
          }`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10h10M13 10l6 6m-6-6l6-6" />
          </svg>
          Reply All
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm ${
            isDark
              ? 'border border-gray-600 hover:bg-gray-700'
              : 'border border-gray-300 hover:bg-gray-100'
          }`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Forward
        </button>
        <div className="flex-1" />
        <button type="button" className={`rounded p-1.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <svg className="size-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Email Content */}
      {view === 'reading' && (
        <div className="p-6">
          {/* Subject */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              {data.category && (
                <div className={`size-3 rounded-full ${categoryColors[data.category]?.bg ?? 'bg-gray-400'}`} />
              )}
              <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.subject}
              </h1>
              {data.importance === 'high' && (
                <span className="text-red-500">!</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {data.isFlagged && (
                <svg className="size-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
                </svg>
              )}
              {data.isPinned && (
                <svg className="size-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
              )}
            </div>
          </div>

          {/* Sender Info */}
          <div className={`mb-6 flex items-start gap-4 border-b pb-4 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
          >
            {data.from.avatarUrl
              ? (
                  <div
                    className="size-12 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.from.avatarUrl})` }}
                  />
                )
              : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-[#0078d4] text-lg font-semibold text-white">
                    {getInitials()}
                  </div>
                )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.from.name}
                </span>
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {data.from.email}
              </div>
              <div className={`mt-1 flex items-center gap-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              >
                <span>
                  To:
                  {data.to.map(t => t.name || t.email).join(', ')}
                </span>
              </div>
              {data.cc && data.cc.length > 0 && (
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Cc:
                  {' '}
                  {data.cc.map(c => c.name || c.email).join(', ')}
                </div>
              )}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {data.date}
            </div>
          </div>

          {/* Email Body */}
          <div className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {data.isHtml
              ? (
                  <div dangerouslySetInnerHTML={{ __html: data.body }} />
                )
              : (
                  <div className="leading-relaxed whitespace-pre-wrap">{data.body}</div>
                )}
          </div>

          {/* Attachments */}
          {data.attachments && data.attachments.length > 0 && (
            <div className={`border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`mb-3 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Attachments (
                {data.attachments.length}
                )
              </p>
              <div className="flex flex-wrap gap-3">
                {data.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      isDark
                        ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    } cursor-pointer transition-colors`}
                  >
                    <div className={`flex size-10 items-center justify-center rounded ${fileTypeColors[attachment.type]} text-white`}>
                      <span className="text-xs font-bold uppercase">
                        {attachment.type === 'excel' ? 'XLS' : attachment.type.toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
        </div>
      )}
    </div>
  );
}
