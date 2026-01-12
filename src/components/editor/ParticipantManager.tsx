'use client';

import { useCallback, useState } from 'react';

type Platform = 'whatsapp' | 'imessage' | 'messenger' | 'telegram' | 'discord' | 'slack' | 'generic';

type OnlineStatus = 'online' | 'offline' | 'away' | 'busy' | 'dnd' | 'invisible';

type Participant = {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string;
  status?: OnlineStatus;
  role?: 'admin' | 'moderator' | 'member' | 'owner';
  lastSeen?: Date;
  phoneNumber?: string;
  username?: string;
  isTyping?: boolean;
  customStatus?: string;
};

type ParticipantManagerProps = {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
  platform?: Platform;
  maxParticipants?: number;
  showRoles?: boolean;
  showStatus?: boolean;
  allowAdd?: boolean;
  allowRemove?: boolean;
  allowEdit?: boolean;
  className?: string;
};

// Random colors for participants
const defaultColors = [
  '#e53935',
  '#d81b60',
  '#8e24aa',
  '#5e35b1',
  '#3949ab',
  '#1e88e5',
  '#039be5',
  '#00acc1',
  '#00897b',
  '#43a047',
  '#7cb342',
  '#c0ca33',
  '#fdd835',
  '#ffb300',
  '#fb8c00',
  '#f4511e',
  '#6d4c41',
  '#757575',
  '#546e7a',
];

const getRandomColor = (): string => {
  return defaultColors[Math.floor(Math.random() * defaultColors.length)] ?? '#e53935';
};

const statusColors: Record<OnlineStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  dnd: 'bg-red-600',
  invisible: 'bg-gray-400',
};

const statusLabels: Record<OnlineStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy',
  dnd: 'Do Not Disturb',
  invisible: 'Invisible',
};

// Platform-specific role badges
const getRoleBadge = (role: string, platform: Platform) => {
  if (platform === 'discord') {
    const roleColors: Record<string, string> = {
      owner: 'bg-yellow-500',
      admin: 'bg-red-500',
      moderator: 'bg-blue-500',
      member: 'bg-gray-500',
    };
    return (
      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white uppercase ${roleColors[role] || 'bg-gray-500'}`}>
        {role}
      </span>
    );
  }

  if (platform === 'slack') {
    if (role === 'admin' || role === 'owner') {
      return (
        <span className="text-[10px] font-medium text-gray-500">
          {role === 'owner' ? 'Workspace Owner' : 'Workspace Admin'}
        </span>
      );
    }
    return null;
  }

  if (platform === 'whatsapp' && (role === 'admin' || role === 'owner')) {
    return (
      <span className="text-[10px] font-medium text-green-600">Group Admin</span>
    );
  }

  return null;
};

export function ParticipantManager({
  participants,
  onParticipantsChange,
  platform = 'generic',
  maxParticipants = 256,
  showRoles = true,
  showStatus = true,
  allowAdd = true,
  allowRemove = true,
  allowEdit = true,
  className = '',
}: ParticipantManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState<Partial<Participant>>({
    name: '',
    status: 'online',
    role: 'member',
  });

  const addParticipant = useCallback(() => {
    if (!newParticipant.name?.trim()) {
      return;
    }
    if (participants.length >= maxParticipants) {
      return;
    }

    const participant: Participant = {
      id: `p-${Date.now()}`,
      name: newParticipant.name.trim(),
      color: newParticipant.color || getRandomColor(),
      status: newParticipant.status || 'online',
      role: newParticipant.role || 'member',
      avatarUrl: newParticipant.avatarUrl,
      username: newParticipant.username,
      phoneNumber: newParticipant.phoneNumber,
    };

    onParticipantsChange([...participants, participant]);
    setNewParticipant({ name: '', status: 'online', role: 'member' });
    setIsAddingNew(false);
  }, [newParticipant, participants, maxParticipants, onParticipantsChange]);

  const removeParticipant = useCallback((id: string) => {
    onParticipantsChange(participants.filter(p => p.id !== id));
  }, [participants, onParticipantsChange]);

  const updateParticipant = useCallback((id: string, updates: Partial<Participant>) => {
    onParticipantsChange(
      participants.map(p => (p.id === id ? { ...p, ...updates } : p)),
    );
  }, [participants, onParticipantsChange]);

  const reorderParticipant = useCallback((fromIndex: number, toIndex: number) => {
    const newParticipants = [...participants];
    const [removed] = newParticipants.splice(fromIndex, 1);
    if (removed) {
      newParticipants.splice(toIndex, 0, removed);
      onParticipantsChange(newParticipants);
    }
  }, [participants, onParticipantsChange]);

  return (
    <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Participants
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {participants.length}
            {' '}
            /
            {maxParticipants}
            {' '}
            members
          </p>
        </div>
        {allowAdd && participants.length < maxParticipants && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        )}
      </div>

      {/* Participant list */}
      <div className="max-h-80 overflow-y-auto">
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0 dark:border-gray-700/50"
          >
            {/* Avatar */}
            <div className="relative">
              {participant.avatarUrl
                ? (
                    <img
                      src={participant.avatarUrl}
                      alt={participant.name}
                      className="size-10 rounded-full object-cover"
                    />
                  )
                : (
                    <div
                      className="flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                  )}
              {showStatus && participant.status && (
                <div className={`absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-white dark:border-gray-800 ${statusColors[participant.status]}`} />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              {editingId === participant.id
                ? (
                    <input
                      type="text"
                      value={participant.name}
                      onChange={e => updateParticipant(participant.id, { name: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={e => e.key === 'Enter' && setEditingId(null)}
                      autoFocus
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  )
                : (
                    <div className="flex items-center gap-2">
                      <span
                        className="truncate font-medium text-gray-900 dark:text-white"
                        onClick={() => allowEdit && setEditingId(participant.id)}
                        style={{ cursor: allowEdit ? 'pointer' : 'default' }}
                      >
                        {participant.name}
                      </span>
                      {showRoles && participant.role && getRoleBadge(participant.role, platform)}
                    </div>
                  )}
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {participant.username && (
                  <span>
                    @
                    {participant.username}
                  </span>
                )}
                {participant.phoneNumber && (
                  <span>{participant.phoneNumber}</span>
                )}
                {showStatus && participant.status && (
                  <span>{statusLabels[participant.status]}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            {(allowEdit || allowRemove) && (
              <div className="flex items-center gap-1">
                {allowEdit && (
                  <button
                    onClick={() => setEditingId(participant.id)}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                    title="Edit"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
                {allowRemove && (
                  <button
                    onClick={() => removeParticipant(participant.id)}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    title="Remove"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                {/* Reorder buttons */}
                <div className="flex flex-col">
                  <button
                    onClick={() => index > 0 && reorderParticipant(index, index - 1)}
                    disabled={index === 0}
                    className="rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-300"
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => index < participants.length - 1 && reorderParticipant(index, index + 1)}
                    disabled={index === participants.length - 1}
                    className="rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-300"
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {participants.length === 0 && !isAddingNew && (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <svg className="mx-auto mb-2 size-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No participants yet</p>
            <p className="text-sm">Add participants to your conversation</p>
          </div>
        )}
      </div>

      {/* Add new participant form */}
      {isAddingNew && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={newParticipant.name || ''}
                onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                placeholder="Enter name"
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {showStatus && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={newParticipant.status || 'online'}
                    onChange={e => setNewParticipant({ ...newParticipant, status: e.target.value as OnlineStatus })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              {showRoles && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <select
                    value={newParticipant.role || 'member'}
                    onChange={e => setNewParticipant({ ...newParticipant, role: e.target.value as Participant['role'] })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                Color
              </label>
              <div className="flex flex-wrap gap-1">
                {defaultColors.slice(0, 10).map(color => (
                  <button
                    key={color}
                    onClick={() => setNewParticipant({ ...newParticipant, color })}
                    className={`size-6 rounded-full transition-transform ${
                      newParticipant.color === color ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setNewParticipant({ name: '', status: 'online', role: 'member' });
                }}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addParticipant}
                disabled={!newParticipant.name?.trim()}
                className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                Add Participant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact participant list (for display in header)
type ParticipantListProps = {
  participants: Participant[];
  maxVisible?: number;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function ParticipantList({
  participants,
  maxVisible = 5,
  showStatus = true,
  size = 'md',
  className = '',
}: ParticipantListProps) {
  const visibleParticipants = participants.slice(0, maxVisible);
  const remainingCount = participants.length - maxVisible;

  const sizeClasses = {
    sm: 'size-6',
    md: 'size-8',
    lg: 'size-10',
  };

  const fontSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-2">
        {visibleParticipants.map(participant => (
          <div
            key={participant.id}
            className="relative"
            title={participant.name}
          >
            {participant.avatarUrl
              ? (
                  <img
                    src={participant.avatarUrl}
                    alt={participant.name}
                    className={`${sizeClasses[size]} rounded-full border-2 border-white object-cover dark:border-gray-800`}
                  />
                )
              : (
                  <div
                    className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 border-white font-semibold text-white dark:border-gray-800 ${fontSize[size]}`}
                    style={{ backgroundColor: participant.color }}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                )}
            {showStatus && participant.status && (
              <div className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border border-white dark:border-gray-800 ${statusColors[participant.status]}`} />
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 border-white bg-gray-200 font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300 ${fontSize[size]}`}
          >
            +
            {remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}

// Online status indicator
type OnlineIndicatorProps = {
  status: OnlineStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function OnlineIndicator({
  status,
  showLabel = false,
  size = 'md',
  className = '',
}: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: 'size-2',
    md: 'size-2.5',
    lg: 'size-3',
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full ${statusColors[status]}`} />
      {showLabel && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
}

export type { OnlineStatus, Participant };
