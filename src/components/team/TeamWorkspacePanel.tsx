'use client';

import {
  ChevronRight,
  Clock,
  Crown,
  Edit3,
  Eye,
  FileText,
  FolderOpen,
  Image,
  Link,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Shield,
  UserPlus,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  lastActive?: Date;
  status?: 'online' | 'offline' | 'away';
};

export type TeamProject = {
  id: string;
  name: string;
  thumbnail?: string;
  updatedAt: Date;
  createdBy: string;
  memberCount: number;
};

export type TeamWorkspace = {
  id: string;
  name: string;
  logo?: string;
  members: TeamMember[];
  projects: TeamProject[];
  plan?: 'free' | 'pro' | 'team' | 'enterprise';
};

export type TeamWorkspacePanelProps = {
  workspace: TeamWorkspace;
  currentUserId: string;
  onInviteMember?: (email: string, role: MemberRole) => void;
  onRemoveMember?: (memberId: string) => void;
  onUpdateRole?: (memberId: string, role: MemberRole) => void;
  onCreateProject?: (name: string) => void;
  variant?: 'full' | 'compact' | 'sidebar' | 'members-only';
  className?: string;
};

export default function TeamWorkspacePanel({
  workspace,
  currentUserId,
  onInviteMember,
  onRemoveMember: _onRemoveMember,
  onUpdateRole: _onUpdateRole,
  onCreateProject,
  variant = 'full',
  className = '',
}: TeamWorkspacePanelProps) {
  void _onRemoveMember; // Reserved for member removal functionality
  void _onUpdateRole; // Reserved for role update functionality
  const [activeTab, setActiveTab] = useState<'projects' | 'members' | 'settings'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('viewer');

  const currentMember = workspace.members.find(m => m.id === currentUserId);
  const isAdmin = currentMember?.role === 'owner' || currentMember?.role === 'admin';

  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case 'owner':
        return <Crown size={14} className="text-yellow-500" />;
      case 'admin':
        return <Shield size={14} className="text-blue-500" />;
      case 'editor':
        return <Edit3 size={14} className="text-green-500" />;
      case 'viewer':
        return <Eye size={14} className="text-gray-500" />;
    }
  };

  const getRoleLabel = (role: MemberRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleInvite = useCallback(() => {
    if (inviteEmail.trim() && onInviteMember) {
      onInviteMember(inviteEmail, inviteRole);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  }, [inviteEmail, inviteRole, onInviteMember]);

  const filteredMembers = workspace.members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
    || m.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredProjects = workspace.projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Members-only variant
  if (variant === 'members-only') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Team Members</h3>
          {isAdmin && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <UserPlus size={18} />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {workspace.members.slice(0, 5).map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-sm font-medium text-white">
                  {member.avatar
                    ? (
                        <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                      )
                    : (
                        member.name.charAt(0)
                      )}
                </div>
                <div className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
              </div>
              {getRoleIcon(member.role)}
            </div>
          ))}
          {workspace.members.length > 5 && (
            <button className="w-full py-2 text-sm text-blue-500 hover:text-blue-600">
              +
              {workspace.members.length - 5}
              {' '}
              more members
            </button>
          )}
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        {/* Workspace Header */}
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
              {workspace.logo
                ? (
                    <img src={workspace.logo} alt={workspace.name} className="h-full w-full rounded-lg object-cover" />
                  )
                : (
                    workspace.name.charAt(0)
                  )}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-gray-900 dark:text-white">{workspace.name}</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {workspace.members.length}
                {' '}
                members
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-b border-gray-200 p-2 dark:border-gray-700">
          <button
            onClick={() => onCreateProject?.('New Project')}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-2">
          <h3 className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Projects
          </h3>
          {workspace.projects.map(project => (
            <button
              key={project.id}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FolderOpen size={16} className="text-gray-400" />
              <span className="truncate">{project.name}</span>
            </button>
          ))}
        </div>

        {/* Members Quick View */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex -space-x-2">
            {workspace.members.slice(0, 4).map(member => (
              <div
                key={member.id}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-medium text-white dark:border-gray-800"
                title={member.name}
              >
                {member.avatar
                  ? (
                      <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                    )
                  : (
                      member.name.charAt(0)
                    )}
              </div>
            ))}
            {workspace.members.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400">
                +
                {workspace.members.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="border-b border-gray-100 p-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
              {workspace.logo
                ? (
                    <img src={workspace.logo} alt={workspace.name} className="h-full w-full rounded-xl object-cover" />
                  )
                : (
                    workspace.name.charAt(0)
                  )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{workspace.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {workspace.members.length}
                {' '}
                members •
                {workspace.projects.length}
                {' '}
                projects
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          {/* Recent Projects */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Recent Projects</h3>
            <div className="space-y-2">
              {workspace.projects.slice(0, 3).map(project => (
                <div key={project.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FileText size={14} />
                  <span className="truncate">{project.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members Preview */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {workspace.members.slice(0, 5).map(member => (
                <div
                  key={member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-medium text-white dark:border-gray-800"
                  title={member.name}
                >
                  {member.avatar
                    ? (
                        <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                      )
                    : (
                        member.name.charAt(0)
                      )}
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600">
              View all
              {' '}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
              {workspace.logo
                ? (
                    <img src={workspace.logo} alt={workspace.name} className="h-full w-full rounded-xl object-cover" />
                  )
                : (
                    workspace.name.charAt(0)
                  )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{workspace.name}</h2>
                {workspace.plan && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    workspace.plan === 'enterprise'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : workspace.plan === 'team'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                  >
                    {workspace.plan.charAt(0).toUpperCase() + workspace.plan.slice(1)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {workspace.members.length}
                {' '}
                members •
                {workspace.projects.length}
                {' '}
                projects
              </p>
            </div>
          </div>

          {isAdmin && (
            <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Settings size={20} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-4">
          {(['projects', 'members', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Projects</h3>
              <button
                onClick={() => onCreateProject?.('New Project')}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
              >
                <Plus size={16} />
                New Project
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="group cursor-pointer rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    {project.thumbnail
                      ? (
                          <img src={project.thumbnail} alt={project.name} className="h-full w-full object-cover" />
                        )
                      : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Image size={24} className="text-gray-400" />
                          </div>
                        )}
                  </div>
                  <h4 className="truncate font-medium text-gray-900 dark:text-white">{project.name}</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} />
                    Updated
                    {' '}
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Team Members</h3>
              {isAdmin && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                >
                  <UserPlus size={16} />
                  Invite Member
                </button>
              )}
            </div>

            <div className="space-y-2">
              {filteredMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
                >
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-medium text-white">
                      {member.avatar
                        ? (
                            <img src={member.avatar} alt={member.name} className="h-full w-full rounded-full object-cover" />
                          )
                        : (
                            member.name.charAt(0)
                          )}
                    </div>
                    <div className={`absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-900`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      member.role === 'owner'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : member.role === 'admin'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                    >
                      {getRoleLabel(member.role)}
                    </span>

                    {isAdmin && member.id !== currentUserId && member.role !== 'owner' && (
                      <div className="relative">
                        <button className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                          <MoreHorizontal size={16} className="text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && isAdmin && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Workspace Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    defaultValue={workspace.name}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://mockflow.app/join/${workspace.id}`}
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-500 dark:border-gray-600 dark:bg-gray-900"
                    />
                    <button className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                      <Link size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <h3 className="mb-2 font-semibold text-red-600">Danger Zone</h3>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Permanently delete this workspace and all its projects.
              </p>
              <button className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                Delete Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['viewer', 'editor', 'admin'] as MemberRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => setInviteRole(role)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        inviteRole === role
                          ? 'border-2 border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'border-2 border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {getRoleIcon(role)}
                      {getRoleLabel(role)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserPlus size={16} />
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
