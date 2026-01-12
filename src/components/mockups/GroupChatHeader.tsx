'use client';

import { useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type GroupMember = {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
  role?: 'admin' | 'member';
};

type GroupChatHeaderProps = {
  name: string;
  members: GroupMember[];
  avatarUrl?: string;
  platform?: Platform;
  isDarkMode?: boolean;
  isVerified?: boolean;
  isMuted?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onInfo?: () => void;
  onSearch?: () => void;
  className?: string;
};

export function GroupChatHeader({
  name,
  members,
  avatarUrl,
  platform = 'generic',
  isDarkMode = false,
  isVerified = false,
  isMuted = false,
  onBack,
  onCall,
  onVideoCall,
  onInfo,
  onSearch,
  className = '',
}: GroupChatHeaderProps) {
  const onlineCount = members.filter(m => m.isOnline).length;

  const getHeaderStyle = () => {
    if (platform === 'whatsapp') {
      return isDarkMode
        ? 'bg-[#1f2c34] text-white'
        : 'bg-[#008069] text-white';
    }
    if (platform === 'imessage') {
      return isDarkMode
        ? 'bg-[#1c1c1e] text-white'
        : 'bg-[#f2f2f7] text-black';
    }
    if (platform === 'messenger') {
      return isDarkMode
        ? 'bg-[#242526] text-white'
        : 'bg-white text-black';
    }
    if (platform === 'telegram') {
      return isDarkMode
        ? 'bg-[#17212b] text-white'
        : 'bg-[#517da2] text-white';
    }
    if (platform === 'discord') {
      return 'bg-[#36393f] text-white';
    }
    if (platform === 'slack') {
      return isDarkMode
        ? 'bg-[#1a1d21] text-white'
        : 'bg-white text-black border-b border-gray-200';
    }
    return isDarkMode
      ? 'bg-gray-900 text-white'
      : 'bg-white text-black border-b border-gray-200';
  };

  const renderAvatar = () => {
    if (avatarUrl) {
      return (
        <img src={avatarUrl} alt={name} className="size-full object-cover" />
      );
    }

    // Generate initials from group name
    const initials = name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    // Group avatar with member avatars
    if (members.length > 0 && members.length <= 4) {
      return (
        <div className="relative grid size-full grid-cols-2 grid-rows-2 gap-[1px] overflow-hidden rounded-full bg-gray-300">
          {members.slice(0, 4).map(member => (
            <div key={member.id} className="flex items-center justify-center bg-gray-400">
              {member.avatarUrl
                ? (
                    <img src={member.avatarUrl} alt={member.name} className="size-full object-cover" />
                  )
                : (
                    <span className="text-[8px] font-medium text-white">{member.name[0]}</span>
                  )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
        {initials}
      </div>
    );
  };

  const getMemberString = () => {
    if (platform === 'telegram') {
      return `${members.length} members${onlineCount > 0 ? `, ${onlineCount} online` : ''}`;
    }
    if (platform === 'whatsapp') {
      const names = members.slice(0, 3).map(m => m.name.split(' ')[0]);
      const remaining = members.length - 3;
      return remaining > 0
        ? `${names.join(', ')} +${remaining} more`
        : names.join(', ');
    }
    return `${members.length} members`;
  };

  // WhatsApp style
  if (platform === 'whatsapp') {
    return (
      <div className={`flex h-14 items-center gap-3 px-2 ${getHeaderStyle()} ${className}`}>
        <button onClick={onBack} className="rounded-full p-1 hover:bg-white/10">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button onClick={onInfo} className="flex flex-1 items-center gap-3">
          <div className="size-10 overflow-hidden rounded-full">
            {renderAvatar()}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1">
              <h3 className="truncate font-semibold">{name}</h3>
              {isMuted && (
                <svg className="size-4 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              )}
            </div>
            <p className="truncate text-xs opacity-80">{getMemberString()}</p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {onVideoCall && (
            <button onClick={onVideoCall} className="rounded-full p-2 hover:bg-white/10">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}
          {onCall && (
            <button onClick={onCall} className="rounded-full p-2 hover:bg-white/10">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // iMessage style
  if (platform === 'imessage') {
    return (
      <div className={`pt-4 pb-2 text-center ${getHeaderStyle()} ${className}`}>
        <button onClick={onBack} className="absolute top-4 left-2 flex items-center gap-1 text-[#007aff]">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>

        <button onClick={onInfo} className="mx-auto block">
          <div className="mx-auto mb-2 size-16 overflow-hidden rounded-full">
            {renderAvatar()}
          </div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">
            {members.length}
            {' '}
            people
          </p>
        </button>

        <div className="mt-3 flex justify-center gap-6">
          {onCall && (
            <button onClick={onCall} className="flex flex-col items-center gap-1">
              <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xs text-[#007aff]">audio</span>
            </button>
          )}
          {onVideoCall && (
            <button onClick={onVideoCall} className="flex flex-col items-center gap-1">
              <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs text-[#007aff]">facetime</span>
            </button>
          )}
          {onInfo && (
            <button onClick={onInfo} className="flex flex-col items-center gap-1">
              <div className="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs text-[#007aff]">info</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Discord style
  if (platform === 'discord') {
    return (
      <div className={`flex h-12 items-center gap-2 px-4 ${getHeaderStyle()} ${className}`}>
        <svg className="size-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39287 3.41262C8.43477 3.17391 8.64221 3 8.88489 3H9.94489C10.256 3 10.4916 3.28107 10.4372 3.58738L9.84989 7H15.75L16.3829 3.41262C16.4248 3.17391 16.6322 3 16.8749 3H17.9349C18.246 3 18.4816 3.28107 18.4272 3.58738L17.8399 7H21.2449C21.5555 7 21.7909 7.28023 21.7374 7.58619L21.5624 8.58619C21.5205 8.82544 21.3128 9 21.0699 9H17.4899L16.4299 15H19.8349C20.1455 15 20.3809 15.2802 20.3274 15.5862L20.1524 16.5862C20.1105 16.8254 19.9028 17 19.6599 17H16.0799L15.4471 20.5874C15.4052 20.8261 15.1978 21 14.9551 21H13.8951C13.584 21 13.3484 20.7189 13.4028 20.4126L14.0099 17H8.10989L7.47701 20.5874C7.43511 20.8261 7.22768 21 6.98489 21H5.88657ZM9.49989 15H15.3999L16.4599 9H10.5599L9.49989 15Z" />
        </svg>
        <h3 className="font-semibold">{name}</h3>

        {isVerified && (
          <svg className="size-5 text-[#5865f2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.164 5.66l-6.66 11.536a2.007 2.007 0 01-1.734 1H6.23a2.007 2.007 0 01-1.734-1L-2.164 5.66a2.007 2.007 0 01.166-2.268L3.836-.536C4.504-1.204 5.5-1.204 6.168-.536l5.832 5.832 5.832-5.832c.668-.668 1.664-.668 2.332 0l5.834 5.928a2.007 2.007 0 01.166 2.268z" />
          </svg>
        )}

        <div className="ml-auto flex items-center gap-2">
          {onSearch && (
            <button onClick={onSearch} className="rounded p-1 text-gray-400 hover:text-gray-300">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          {onInfo && (
            <button onClick={onInfo} className="rounded p-1 text-gray-400 hover:text-gray-300">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Slack style
  if (platform === 'slack') {
    return (
      <div className={`flex h-14 items-center gap-3 px-4 ${getHeaderStyle()} ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">#</span>
          <h3 className="font-bold">{name}</h3>
          {isMuted && (
            <svg className="size-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{members.length}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {onCall && (
            <button onClick={onCall} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          )}
          {onSearch && (
            <button onClick={onSearch} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          {onInfo && (
            <button onClick={onInfo} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Generic header
  return (
    <div className={`flex h-14 items-center gap-3 px-4 ${getHeaderStyle()} ${className}`}>
      {onBack && (
        <button onClick={onBack} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <button onClick={onInfo} className="flex flex-1 items-center gap-3">
        <div className="size-10 overflow-hidden rounded-full">
          {renderAvatar()}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <h3 className="truncate font-semibold">{name}</h3>
          <p className="truncate text-xs text-gray-500">
            {members.length}
            {' '}
            members
          </p>
        </div>
      </button>

      <div className="flex items-center gap-1">
        {onCall && (
          <button onClick={onCall} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        )}
        {onInfo && (
          <button onClick={onInfo} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Member list popup
type MemberListProps = {
  members: GroupMember[];
  onMemberClick?: (member: GroupMember) => void;
  className?: string;
};

export function MemberList({ members, onMemberClick, className = '' }: MemberListProps) {
  const [search, setSearch] = useState('');

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const admins = filteredMembers.filter(m => m.role === 'admin');
  const regularMembers = filteredMembers.filter(m => m.role !== 'admin');

  const renderMember = (member: GroupMember) => (
    <button
      key={member.id}
      onClick={() => onMemberClick?.(member)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="relative">
        <div className="size-10 overflow-hidden rounded-full bg-gray-300">
          {member.avatarUrl
            ? (
                <img src={member.avatarUrl} alt={member.name} className="size-full object-cover" />
              )
            : (
                <div className="flex size-full items-center justify-center font-medium text-gray-600">
                  {member.name[0]}
                </div>
              )}
        </div>
        {member.isOnline && (
          <div className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-medium text-gray-900 dark:text-white">{member.name}</p>
        {member.role === 'admin' && (
          <p className="text-xs text-gray-500">Admin</p>
        )}
      </div>
    </button>
  );

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {admins.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-500 uppercase">
            Admins —
            {admins.length}
          </p>
          {admins.map(renderMember)}
        </div>
      )}

      {regularMembers.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 uppercase">
            Members —
            {regularMembers.length}
          </p>
          {regularMembers.map(renderMember)}
        </div>
      )}
    </div>
  );
}

export type { GroupMember };
