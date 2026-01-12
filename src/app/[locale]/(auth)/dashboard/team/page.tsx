'use client';

import { useState } from 'react';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive?: string;
  mockupsCreated?: number;
};

type Team = {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  members: TeamMember[];
  mockupCount: number;
  storageUsed: number;
  storageLimit: number;
};

// Mock data for demonstration
const mockTeam: Team = {
  id: 'team_1',
  name: 'Design Team',
  plan: 'team',
  members: [
    {
      id: 'user_1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '2 minutes ago',
      mockupsCreated: 45,
    },
    {
      id: 'user_2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'editor',
      status: 'active',
      lastActive: '1 hour ago',
      mockupsCreated: 32,
    },
    {
      id: 'user_3',
      name: 'Emily Brown',
      email: 'emily@example.com',
      role: 'editor',
      status: 'active',
      lastActive: '3 hours ago',
      mockupsCreated: 28,
    },
    {
      id: 'user_4',
      name: 'Alex Kim',
      email: 'alex@example.com',
      role: 'viewer',
      status: 'pending',
      mockupsCreated: 0,
    },
  ],
  mockupCount: 156,
  storageUsed: 2.4,
  storageLimit: 10,
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

function RoleBadge({ role }: { role: TeamMember['role'] }) {
  const styles = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[role]}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: TeamMember['status'] }) {
  const styles = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function TeamWorkspacePage() {
  const [team] = useState<Team>(mockTeam);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('editor');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = team.members.filter(
    member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
      || member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const storagePercentage = (team.storageUsed / team.storageLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Team Workspace
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your team members and workspace settings
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Invite Member
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Team Members */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <svg className="size-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{team.members.length}</p>
              </div>
            </div>
          </div>

          {/* Total Mockups */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <svg className="size-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Mockups</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{team.mockupCount}</p>
              </div>
            </div>
          </div>

          {/* Storage Used */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <svg className="size-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {team.storageUsed}
                  {' '}
                  GB
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-2 rounded-full ${
                    storagePercentage > 90 ? 'bg-red-500' : storagePercentage > 70 ? 'bg-yellow-500' : 'bg-purple-600'
                  }`}
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {team.storageUsed}
                {' '}
                of
                {team.storageLimit}
                {' '}
                GB used
              </p>
            </div>
          </div>

          {/* Plan */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/30">
                <svg className="size-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900 capitalize dark:text-white">{team.plan}</p>
              </div>
            </div>
            <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Upgrade Plan →
            </button>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Members
              </h2>
              <div className="relative">
                <svg className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Mockups
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {member.avatar
                          ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="size-10 rounded-full object-cover"
                              />
                            )
                          : (
                              <div className={`flex size-10 items-center justify-center rounded-full text-sm font-medium text-white ${getAvatarColor(member.name)}`}>
                                {getInitials(member.name)}
                              </div>
                            )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={member.status} />
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-white">
                      {member.mockupsCreated}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {member.lastActive || 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No members found matching your search.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
              <svg className="size-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Workspace Settings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage team preferences</p>
            </div>
          </button>

          <button className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <svg className="size-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Brand Kit</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage logos, colors, fonts</p>
            </div>
          </button>

          <button className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/30">
              <svg className="size-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Usage Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View team activity</p>
            </div>
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Team Member</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

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
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as TeamMember['role'])}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="viewer">Viewer - Can view mockups</option>
                  <option value="editor">Editor - Can create and edit mockups</option>
                  <option value="admin">Admin - Full workspace access</option>
                </select>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Permissions</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {inviteRole === 'viewer' && (
                    <>
                      <li>• View shared mockups</li>
                      <li>• Leave comments</li>
                      <li>• Export mockups (with permission)</li>
                    </>
                  )}
                  {inviteRole === 'editor' && (
                    <>
                      <li>• Create and edit mockups</li>
                      <li>• Access templates</li>
                      <li>• Export mockups</li>
                      <li>• Share mockups</li>
                    </>
                  )}
                  {inviteRole === 'admin' && (
                    <>
                      <li>• All editor permissions</li>
                      <li>• Manage team members</li>
                      <li>• Manage workspace settings</li>
                      <li>• Manage billing</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle invite logic here
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
