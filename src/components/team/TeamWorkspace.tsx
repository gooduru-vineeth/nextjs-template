'use client';

import { useState } from 'react';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  lastActive?: Date;
};

export type TeamWorkspaceData = {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  members: TeamMember[];
  createdAt: Date;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  mockupCount: number;
  storageUsed: number;
  storageLimit: number;
};

type TeamWorkspaceProps = {
  workspace: TeamWorkspaceData;
  onInviteMember: (email: string, role: TeamMember['role']) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateMemberRole: (memberId: string, role: TeamMember['role']) => void;
  onUpdateWorkspace: (data: Partial<TeamWorkspaceData>) => void;
  currentUserId: string;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  }
  if (hours > 0) {
    return `${hours}h ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ago`;
  }
  return 'Just now';
}

const roleColors: Record<TeamMember['role'], string> = {
  owner: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  editor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const statusColors: Record<TeamMember['status'], string> = {
  active: 'bg-green-500',
  pending: 'bg-yellow-500',
  inactive: 'bg-gray-400',
};

export function TeamWorkspace({
  workspace,
  onInviteMember,
  onRemoveMember,
  onUpdateMemberRole,
  onUpdateWorkspace,
  currentUserId,
}: TeamWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'settings' | 'activity'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(workspace.name);

  const currentUserMember = workspace.members.find(m => m.id === currentUserId);
  const canManageMembers = currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin';
  const canEditSettings = currentUserMember?.role === 'owner' || currentUserMember?.role === 'admin';

  const filteredMembers = workspace.members.filter(
    member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
      || member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const storagePercentage = (workspace.storageUsed / workspace.storageLimit) * 100;

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      onInviteMember(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const handleSaveName = () => {
    if (newName.trim() && newName !== workspace.name) {
      onUpdateWorkspace({ name: newName.trim() });
    }
    setEditingName(false);
  };

  const Avatar = ({ member, size = 'md' }: { member: TeamMember; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-12',
    };

    if (member.avatar) {
      return (
        <div
          className={`${sizeClasses[size]} rounded-full bg-cover bg-center`}
          style={{ backgroundImage: `url(${member.avatar})` }}
        />
      );
    }

    const initials = member.initials || member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {workspace.logo
            ? (
                <div
                  className="size-16 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${workspace.logo})` }}
                />
              )
            : (
                <div className="flex size-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                  {workspace.name.charAt(0)}
                </div>
              )}
          <div>
            {editingName
              ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xl font-bold focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveName();
                        }
                        if (e.key === 'Escape') {
                          setEditingName(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      className="rounded px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )
              : (
                  <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {workspace.name}
                    {canEditSettings && (
                      <button
                        type="button"
                        onClick={() => setEditingName(true)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </h1>
                )}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {workspace.members.length}
              {' '}
              members | Created
              {formatDate(workspace.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            workspace.plan === 'enterprise'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              : workspace.plan === 'team'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : workspace.plan === 'pro'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
          >
            {workspace.plan.charAt(0).toUpperCase() + workspace.plan.slice(1)}
            {' '}
            Plan
          </span>
          {canManageMembers && (
            <button
              type="button"
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Invite Member
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Mockups</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {workspace.mockupCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {workspace.members.filter(m => m.status === 'active').length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {(workspace.storageUsed / 1024 / 1024 / 1024).toFixed(1)}
              {' '}
              GB
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              /
              {' '}
              {(workspace.storageLimit / 1024 / 1024 / 1024).toFixed(0)}
              {' '}
              GB
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all ${
                storagePercentage > 90 ? 'bg-red-500' : storagePercentage > 70 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, storagePercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-8">
          {[
            { id: 'members' as const, label: 'Members', count: workspace.members.length },
            { id: 'settings' as const, label: 'Settings' },
            { id: 'activity' as const, label: 'Activity' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'members' && (
        <div>
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search members..."
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <svg
                className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Members list */}
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {filteredMembers.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-white p-4 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar member={member} />
                    <span
                      className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white dark:border-gray-800 ${statusColors[member.status]}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                        {member.id === currentUserId && (
                          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">(You)</span>
                        )}
                      </p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[member.role]}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {member.lastActive && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(member.lastActive)}
                    </span>
                  )}

                  {canManageMembers && member.role !== 'owner' && member.id !== currentUserId && (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={e => onUpdateMemberRole(member.id, e.target.value as TeamMember['role'])}
                        className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => onRemoveMember(member.id)}
                        className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Workspace Settings
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Settings content coming soon...
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Activity feed coming soon...
          </p>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Invite Team Member
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as TeamMember['role'])}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="admin">Admin - Can manage members and settings</option>
                  <option value="editor">Editor - Can create and edit mockups</option>
                  <option value="viewer">Viewer - Can only view mockups</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamWorkspace;
