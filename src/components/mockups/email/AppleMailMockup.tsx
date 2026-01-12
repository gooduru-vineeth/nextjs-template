'use client';

export type AppleMailEmailData = {
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
  isFlagged?: boolean;
  isRead?: boolean;
  folder?: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'junk';
};

type AppleMailMockupProps = {
  data: AppleMailEmailData;
  appearance?: {
    theme?: 'light' | 'dark';
    view?: 'list' | 'email';
    platform?: 'mac' | 'ios';
  };
};

const fileTypeIcons: Record<string, React.ReactNode> = {
  pdf: (
    <svg className="size-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  doc: (
    <svg className="size-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  image: (
    <svg className="size-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  zip: (
    <svg className="size-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  other: (
    <svg className="size-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
  ] as const;
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index] as string;
}

export function AppleMailMockup({ data, appearance = {} }: AppleMailMockupProps) {
  const {
    theme = 'light',
    // view is available for future use (list view vs email view)
    view: _view = 'email',
    platform = 'mac',
  } = appearance;

  const isDark = theme === 'dark';
  const isMac = platform === 'mac';

  // macOS Mail app rendering
  if (isMac) {
    return (
      <div className={`overflow-hidden rounded-xl border shadow-lg ${
        isDark
          ? 'border-gray-700 bg-[#1e1e1e] text-white'
          : 'border-gray-300 bg-[#f5f5f5] text-gray-900'
      }`}
      >
        {/* Window Controls */}
        <div className={`flex items-center gap-2 px-4 py-3 ${
          isDark ? 'bg-[#2d2d2d]' : 'bg-[#e8e8e8]'
        }`}
        >
          <div className="flex gap-2">
            <div className="size-3 rounded-full bg-[#ff5f57]" />
            <div className="size-3 rounded-full bg-[#febc2e]" />
            <div className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1" />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {data.subject}
          </span>
          <div className="flex-1" />
        </div>

        {/* Toolbar */}
        <div className={`flex items-center gap-4 border-b px-4 py-2 ${
          isDark ? 'border-gray-700 bg-[#2d2d2d]' : 'border-gray-300 bg-[#f0f0f0]'
        }`}
        >
          <div className="flex gap-2">
            {/* Delete */}
            <button className={`rounded p-1.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            {/* Reply */}
            <button className={`rounded p-1.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </button>
            {/* Forward */}
            <button className={`rounded p-1.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
            </button>
          </div>
          <div className={`h-6 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          {/* Flag */}
          <button className={`rounded p-1.5 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <svg className={`size-5 ${data.isFlagged ? 'fill-orange-500 text-orange-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </button>
          <div className="flex-1" />
        </div>

        {/* Email Header */}
        <div className={`border-b p-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-start gap-3">
            {/* Avatar */}
            {data.from.avatarUrl
              ? (
                  <img
                    src={data.from.avatarUrl}
                    alt={data.from.name}
                    className="size-12 rounded-full object-cover"
                  />
                )
              : (
                  <div className={`flex size-12 items-center justify-center rounded-full text-lg font-semibold text-white ${getAvatarColor(data.from.name)}`}>
                    {getInitials(data.from.name)}
                  </div>
                )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{data.from.name}</h2>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {data.date}
                </span>
              </div>
              <h3 className="mt-0.5 text-xl font-medium">{data.subject}</h3>
              <div className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>To: </span>
                {data.to.map((recipient, idx) => (
                  <span key={idx}>
                    {recipient.name}
                    {idx < data.to.length - 1 && ', '}
                  </span>
                ))}
              </div>
              {data.cc && data.cc.length > 0 && (
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>Cc: </span>
                  {data.cc.map((recipient, idx) => (
                    <span key={idx}>
                      {recipient.name}
                      {idx < (data.cc?.length ?? 0) - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className={`min-h-[300px] p-4 ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
          {data.isHtml
            ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.body }}
                />
              )
            : (
                <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                  {data.body}
                </div>
              )}

          {/* Attachments */}
          {data.attachments && data.attachments.length > 0 && (
            <div className={`mt-6 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className={`mb-3 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {data.attachments.length}
                {' '}
                Attachment
                {data.attachments.length > 1 ? 's' : ''}
              </h4>
              <div className="flex flex-wrap gap-3">
                {data.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      isDark
                        ? 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {fileTypeIcons[attachment.type]}
                    <div>
                      <p className="text-sm font-medium">{attachment.name}</p>
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
      </div>
    );
  }

  // iOS Mail app rendering
  return (
    <div
      className={`overflow-hidden rounded-[40px] border-[8px] ${
        isDark ? 'border-gray-800 bg-black' : 'border-gray-900 bg-white'
      }`}
      style={{ width: 390, minHeight: 844 }}
    >
      {/* iOS Status Bar */}
      <div className={`flex items-center justify-between px-6 py-2 ${
        isDark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
      >
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="h-4 w-5" fill="currentColor" viewBox="0 0 20 16">
            <path d="M2 6.5A1.5 1.5 0 013.5 5h1A1.5 1.5 0 016 6.5v7A1.5 1.5 0 014.5 15h-1A1.5 1.5 0 012 13.5v-7zM7 4.5A1.5 1.5 0 018.5 3h1A1.5 1.5 0 0111 4.5v9a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 017 13.5v-9zM12 2.5A1.5 1.5 0 0113.5 1h1A1.5 1.5 0 0116 2.5v11a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5v-11z" />
          </svg>
          <svg className="h-4 w-5" fill="currentColor" viewBox="0 0 20 16">
            <path d="M10 2.5c4.25 0 7.5 3.25 7.5 7.5h-2.5c0-2.75-2.25-5-5-5s-5 2.25-5 5H2.5c0-4.25 3.25-7.5 7.5-7.5z" />
            <circle cx="10" cy="13" r="2" />
          </svg>
          <svg className="h-4 w-7" fill="currentColor" viewBox="0 0 28 14">
            <rect x="0" y="0" width="25" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none" />
            <rect x="26" y="4" width="2" height="6" rx="1" />
            <rect x="2" y="2" width="20" height="10" rx="1.5" />
          </svg>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={`flex items-center justify-between border-b px-4 py-2 ${
        isDark ? 'border-gray-800 bg-black' : 'border-gray-200 bg-[#f2f2f7]'
      }`}
      >
        <button className="flex items-center gap-1 text-[#007aff]">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-base">Inbox</span>
        </button>
        <div className="flex gap-5">
          <button className="text-[#007aff]">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
          </button>
          <button className="text-[#007aff]">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
          <button className="text-[#007aff]">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className={`flex-1 overflow-auto ${isDark ? 'bg-black' : 'bg-white'}`}>
        {/* Sender Info */}
        <div className={`border-b p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-start gap-3">
            {data.from.avatarUrl
              ? (
                  <img
                    src={data.from.avatarUrl}
                    alt={data.from.name}
                    className="size-10 rounded-full object-cover"
                  />
                )
              : (
                  <div className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(data.from.name)}`}>
                    {getInitials(data.from.name)}
                  </div>
                )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{data.from.name}</span>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {data.date}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                To:
                {' '}
                {data.to.map(r => r.name).join(', ')}
              </p>
            </div>
          </div>
          <h1 className="mt-3 text-xl font-bold">{data.subject}</h1>
        </div>

        {/* Email Body */}
        <div className="p-4">
          {data.isHtml
            ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.body }}
                />
              )
            : (
                <div className={`text-base leading-relaxed whitespace-pre-wrap ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}
                >
                  {data.body}
                </div>
              )}

          {/* Attachments */}
          {data.attachments && data.attachments.length > 0 && (
            <div className={`mt-6 border-t pt-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h4 className={`mb-3 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {data.attachments.length}
                {' '}
                Attachment
                {data.attachments.length > 1 ? 's' : ''}
              </h4>
              <div className="space-y-2">
                {data.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 rounded-xl p-3 ${
                      isDark ? 'bg-gray-900' : 'bg-gray-100'
                    }`}
                  >
                    {fileTypeIcons[attachment.type]}
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {attachment.size}
                      </p>
                    </div>
                    <button className="text-[#007aff]">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className={`h-8 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className={`mx-auto mt-4 h-1 w-32 rounded-full ${
          isDark ? 'bg-gray-700' : 'bg-gray-300'
        }`}
        />
      </div>
    </div>
  );
}
