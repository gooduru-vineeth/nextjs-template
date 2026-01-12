'use client';

export type NotificationData = {
  app: {
    name: string;
    icon?: string;
    color?: string;
  };
  title: string;
  body: string;
  subtitle?: string;
  image?: string;
  timestamp?: string;
  actions?: {
    label: string;
    style?: 'default' | 'destructive' | 'primary';
  }[];
  badge?: number;
  isGrouped?: boolean;
  groupCount?: number;
  attachment?: {
    type: 'image' | 'video' | 'audio' | 'file';
    preview?: string;
    name?: string;
  };
  category?: string;
  priority?: 'low' | 'default' | 'high' | 'urgent';
};

type NotificationMockupProps = {
  data: NotificationData;
  appearance?: {
    platform?: 'ios' | 'android' | 'macos' | 'windows';
    theme?: 'light' | 'dark';
    style?: 'banner' | 'alert' | 'lock-screen' | 'notification-center';
    expanded?: boolean;
  };
};

export function NotificationMockup({ data, appearance = {} }: NotificationMockupProps) {
  const {
    platform = 'ios',
    theme = 'light',
    // style is available for future use with different notification presentations
    style: _style = 'banner',
    expanded = false,
  } = appearance;

  const isDark = theme === 'dark';

  const getInitials = () => {
    return data.app.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTimestamp = () => {
    if (data.timestamp) {
      return data.timestamp;
    }
    return 'now';
  };

  // iOS Notification
  if (platform === 'ios') {
    return (
      <div className={`w-96 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div
          className={`mx-3 my-2 overflow-hidden rounded-2xl backdrop-blur-xl ${
            isDark ? 'bg-gray-800/90' : 'bg-white/90'
          } shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3">
            {/* App Icon */}
            {data.app.icon
              ? (
                  <div
                    className="size-8 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.app.icon})` }}
                  />
                )
              : (
                  <div
                    className="flex size-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: data.app.color || '#007AFF' }}
                  >
                    {getInitials()}
                  </div>
                )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {data.app.name}
                </span>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {getTimestamp()}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.title}
            </h3>
            {data.subtitle && (
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {data.subtitle}
              </p>
            )}
            <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} ${expanded ? '' : 'line-clamp-2'}`}>
              {data.body}
            </p>

            {/* Attachment Preview */}
            {data.attachment && expanded && (
              <div className={`mt-3 overflow-hidden rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {data.attachment.type === 'image' && data.attachment.preview && (
                  <div
                    className="aspect-video w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.attachment.preview})` }}
                  />
                )}
              </div>
            )}

            {/* Image Thumbnail */}
            {data.image && !expanded && (
              <div className="absolute top-10 right-4">
                <div
                  className="size-10 rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${data.image})` }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          {data.actions && expanded && (
            <div className={`flex border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {data.actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`flex-1 py-3 text-center text-sm font-medium ${
                    action.style === 'destructive'
                      ? 'text-red-500'
                      : action.style === 'primary'
                        ? 'font-semibold text-blue-500'
                        : isDark
                          ? 'text-blue-400'
                          : 'text-blue-500'
                  } ${
                    index > 0 ? (isDark ? 'border-l border-gray-700' : 'border-l border-gray-200') : ''
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Group indicator */}
          {data.isGrouped && data.groupCount && data.groupCount > 1 && (
            <div className={`border-t px-4 py-2 text-center text-xs ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
              {data.groupCount}
              {' '}
              more notifications
            </div>
          )}
        </div>
      </div>
    );
  }

  // Android Notification
  if (platform === 'android') {
    return (
      <div className={`w-96 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div
          className={`mx-2 my-2 overflow-hidden rounded-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3">
            {/* App Icon */}
            {data.app.icon
              ? (
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.app.icon})` }}
                  />
                )
              : (
                  <div
                    className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: data.app.color || '#4285F4' }}
                  >
                    {getInitials().charAt(0)}
                  </div>
                )}

            <span className={`flex-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {data.app.name}
            </span>

            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {getTimestamp()}
            </span>

            {/* Expand arrow */}
            <svg
              className={`size-4 ${isDark ? 'text-gray-500' : 'text-gray-400'} ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex gap-3 px-4 pb-3">
            <div className="flex-1">
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.title}
              </h3>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} ${expanded ? '' : 'line-clamp-2'}`}>
                {data.body}
              </p>
            </div>

            {/* Image Thumbnail */}
            {data.image && !expanded && (
              <div
                className="size-12 shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            )}
          </div>

          {/* Expanded Image */}
          {data.image && expanded && (
            <div className="px-4 pb-3">
              <div
                className="aspect-video w-full rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            </div>
          )}

          {/* Actions */}
          {data.actions && expanded && (
            <div className="flex gap-2 px-4 pb-3">
              {data.actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                    action.style === 'primary'
                      ? 'bg-blue-600 text-white'
                      : action.style === 'destructive'
                        ? 'text-red-500'
                        : isDark
                          ? 'text-blue-400'
                          : 'text-blue-600'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Priority indicator */}
          {data.priority === 'urgent' && (
            <div className="flex items-center gap-2 bg-red-500 px-4 py-2 text-xs font-medium text-white">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Urgent
            </div>
          )}
        </div>
      </div>
    );
  }

  // macOS Notification
  if (platform === 'macos') {
    return (
      <div className={`w-80 ${isDark ? 'bg-transparent' : 'bg-transparent'}`}>
        <div
          className={`overflow-hidden rounded-xl backdrop-blur-2xl ${
            isDark ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-2xl ring-1 ${isDark ? 'ring-white/10' : 'ring-black/5'}`}
        >
          <div className="flex gap-3 p-3">
            {/* App Icon */}
            {data.app.icon
              ? (
                  <div
                    className="size-10 shrink-0 rounded-lg bg-cover bg-center shadow-md"
                    style={{ backgroundImage: `url(${data.app.icon})` }}
                  />
                )
              : (
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-md"
                    style={{ backgroundColor: data.app.color || '#007AFF' }}
                  >
                    {getInitials()}
                  </div>
                )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.app.name}
                  </span>
                </div>
                <span className={`shrink-0 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {getTimestamp()}
                </span>
              </div>
              <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.title}
              </h3>
              <p className={`mt-0.5 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} ${expanded ? '' : 'line-clamp-2'}`}>
                {data.body}
              </p>
            </div>

            {/* Image Thumbnail */}
            {data.image && !expanded && (
              <div
                className="size-10 shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            )}
          </div>

          {/* Expanded content */}
          {expanded && data.image && (
            <div className="px-3 pb-3">
              <div
                className="aspect-video w-full rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            </div>
          )}

          {/* Actions */}
          {data.actions && expanded && (
            <div className={`flex border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {data.actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`flex-1 py-2 text-center text-sm font-medium ${
                    action.style === 'destructive'
                      ? 'text-red-500'
                      : action.style === 'primary'
                        ? isDark ? 'text-blue-400' : 'text-blue-500'
                        : isDark
                          ? 'text-gray-300'
                          : 'text-gray-700'
                  } hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} ${
                    index > 0 ? (isDark ? 'border-l border-gray-700' : 'border-l border-gray-200') : ''
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Windows Notification
  if (platform === 'windows') {
    return (
      <div className={`w-80 ${isDark ? 'bg-gray-900' : 'bg-gray-200'}`}>
        <div
          className={`overflow-hidden rounded ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          {/* Header */}
          <div className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {/* App Icon */}
            {data.app.icon
              ? (
                  <div
                    className="size-4 rounded bg-cover bg-center"
                    style={{ backgroundImage: `url(${data.app.icon})` }}
                  />
                )
              : (
                  <div
                    className="flex size-4 items-center justify-center rounded text-[8px] font-bold text-white"
                    style={{ backgroundColor: data.app.color || '#0078D4' }}
                  >
                    {getInitials().charAt(0)}
                  </div>
                )}

            <span className={`flex-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {data.app.name}
            </span>

            <button
              type="button"
              className={`rounded p-0.5 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
            >
              <svg className={`size-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex gap-3 p-4">
            <div className="flex-1">
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.title}
              </h3>
              {data.subtitle && (
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {data.subtitle}
                </p>
              )}
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} ${expanded ? '' : 'line-clamp-3'}`}>
                {data.body}
              </p>
            </div>

            {/* Hero Image */}
            {data.image && (
              <div
                className="size-16 shrink-0 rounded bg-cover bg-center"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            )}
          </div>

          {/* Expanded Image */}
          {data.image && expanded && (
            <div className="px-4 pb-4">
              <div
                className="aspect-video w-full rounded bg-cover bg-center"
                style={{ backgroundImage: `url(${data.image})` }}
              />
            </div>
          )}

          {/* Actions */}
          {data.actions && data.actions.length > 0 && (
            <div className={`flex gap-2 border-t px-4 py-3 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              {data.actions.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
                    action.style === 'primary'
                      ? 'bg-[#0078D4] text-white'
                      : action.style === 'destructive'
                        ? isDark
                          ? 'bg-gray-700 text-red-400'
                          : 'bg-gray-100 text-red-600'
                        : isDark
                          ? 'bg-gray-700 text-white'
                          : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className={`border-t px-4 py-2 text-xs ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-100 text-gray-400'}`}>
            {getTimestamp()}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="w-80 rounded-lg bg-white p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500 text-white">
          {getInitials()}
        </div>
        <div>
          <h3 className="font-semibold">{data.title}</h3>
          <p className="text-sm text-gray-500">{data.body}</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationMockup;
