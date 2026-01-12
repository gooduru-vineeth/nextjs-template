'use client';

import { useState } from 'react';

type Collaborator = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline?: boolean;
  lastActive?: Date;
  cursorColor?: string;
};

type PendingInvite = {
  id: string;
  email: string;
  role: 'editor' | 'viewer';
  sentAt: Date;
};

type Comment = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  resolved?: boolean;
  replies?: Comment[];
};

type CollaborationPanelProps = {
  collaborators: Collaborator[];
  pendingInvites?: PendingInvite[];
  comments?: Comment[];
  currentUserId: string;
  isOwner?: boolean;
  onInvite?: (email: string, role: 'editor' | 'viewer') => void;
  onRemove?: (collaboratorId: string) => void;
  onChangeRole?: (collaboratorId: string, newRole: 'editor' | 'viewer') => void;
  onCancelInvite?: (inviteId: string) => void;
  onAddComment?: (content: string) => void;
  onResolveComment?: (commentId: string) => void;
  className?: string;
};

export function CollaborationPanel({
  collaborators,
  pendingInvites = [],
  comments = [],
  currentUserId,
  isOwner = false,
  onInvite,
  onRemove,
  onChangeRole,
  onCancelInvite,
  onAddComment,
  onResolveComment,
  className = '',
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'comments'>('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [newComment, setNewComment] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!inviteEmail || !onInvite) {
      return;
    }
    setIsInviting(true);
    try {
      await onInvite(inviteEmail, inviteRole);
      setInviteEmail('');
    } finally {
      setIsInviting(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !onAddComment) {
      return;
    }
    onAddComment(newComment);
    setNewComment('');
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return `${days}d ago`;
  };

  const onlineCollaborators = collaborators.filter(c => c.isOnline);

  return (
    <div className={`flex h-full flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Collaboration</h3>
        <p className="mt-1 text-sm text-gray-500">
          {onlineCollaborators.length}
          {' '}
          online •
          {collaborators.length}
          {' '}
          total
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'members'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'comments'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Comments
          {comments.filter(c => !c.resolved).length > 0 && (
            <span className="ml-1.5 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
              {comments.filter(c => !c.resolved).length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'members' && (
          <div className="p-4">
            {/* Invite Section */}
            {isOwner && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Invite collaborators
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as 'editor' | 'viewer')}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail || isInviting}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isInviting ? 'Sending...' : 'Invite'}
                  </button>
                </div>
              </div>
            )}

            {/* Online Users */}
            {onlineCollaborators.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase">Online Now</h4>
                <div className="space-y-2">
                  {onlineCollaborators.map(collaborator => (
                    <CollaboratorRow
                      key={collaborator.id}
                      collaborator={collaborator}
                      currentUserId={currentUserId}
                      isOwner={isOwner}
                      onRemove={onRemove}
                      onChangeRole={onChangeRole}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Members */}
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase">All Members</h4>
              <div className="space-y-2">
                {collaborators
                  .filter(c => !c.isOnline)
                  .map(collaborator => (
                    <CollaboratorRow
                      key={collaborator.id}
                      collaborator={collaborator}
                      currentUserId={currentUserId}
                      isOwner={isOwner}
                      onRemove={onRemove}
                      onChangeRole={onChangeRole}
                    />
                  ))}
              </div>
            </div>

            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium text-gray-500 uppercase">Pending Invites</h4>
                <div className="space-y-2">
                  {pendingInvites.map(invite => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                    >
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{invite.email}</p>
                        <p className="text-xs text-gray-500">
                          {invite.role}
                          {' '}
                          • Sent
                          {formatTimeAgo(invite.sentAt)}
                        </p>
                      </div>
                      {isOwner && onCancelInvite && (
                        <button
                          onClick={() => onCancelInvite(invite.id)}
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="flex h-full flex-col">
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4">
              {comments.length === 0
                ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center">
                      <svg className="mb-2 size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm text-gray-500">No comments yet</p>
                      <p className="text-xs text-gray-400">Start the conversation!</p>
                    </div>
                  )
                : (
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          onResolve={onResolveComment}
                          formatTimeAgo={formatTimeAgo}
                        />
                      ))}
                    </div>
                  )}
            </div>

            {/* Add Comment */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Collaborator Row Component
type CollaboratorRowProps = {
  collaborator: Collaborator;
  currentUserId: string;
  isOwner: boolean;
  onRemove?: (id: string) => void;
  onChangeRole?: (id: string, role: 'editor' | 'viewer') => void;
};

function CollaboratorRow({
  collaborator,
  currentUserId,
  isOwner,
  onRemove,
  onChangeRole,
}: CollaboratorRowProps) {
  const isCurrentUser = collaborator.id === currentUserId;
  const canManage = isOwner && !isCurrentUser && collaborator.role !== 'owner';

  return (
    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-8 overflow-hidden rounded-full bg-gray-300">
            {collaborator.avatarUrl
              ? (
                  <img src={collaborator.avatarUrl} alt={collaborator.name} className="size-full object-cover" />
                )
              : (
                  <div className="flex size-full items-center justify-center font-medium text-gray-600">
                    {collaborator.name[0]}
                  </div>
                )}
          </div>
          {collaborator.isOnline && (
            <div
              className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white dark:border-gray-800"
              style={{ backgroundColor: collaborator.cursorColor || '#22c55e' }}
            />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {collaborator.name}
            {isCurrentUser && <span className="ml-1 text-gray-500">(you)</span>}
          </p>
          <p className="text-xs text-gray-500">{collaborator.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canManage && onChangeRole
          ? (
              <select
                value={collaborator.role}
                onChange={e => onChangeRole(collaborator.id, e.target.value as 'editor' | 'viewer')}
                className="rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            )
          : (
              <span className={`rounded-full px-2 py-1 text-xs ${
                collaborator.role === 'owner'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : collaborator.role === 'editor'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              >
                {collaborator.role}
              </span>
            )}

        {canManage && onRemove && (
          <button
            onClick={() => onRemove(collaborator.id)}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Comment Item Component
type CommentItemProps = {
  comment: Comment;
  onResolve?: (id: string) => void;
  formatTimeAgo: (date: Date) => string;
};

function CommentItem({ comment, onResolve, formatTimeAgo }: CommentItemProps) {
  return (
    <div className={`rounded-lg border p-3 ${
      comment.resolved
        ? 'border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800'
        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
    }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="size-6 overflow-hidden rounded-full bg-gray-300">
            {comment.authorAvatar
              ? (
                  <img src={comment.authorAvatar} alt={comment.authorName} className="size-full object-cover" />
                )
              : (
                  <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                    {comment.authorName[0]}
                  </div>
                )}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.authorName}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        {!comment.resolved && onResolve && (
          <button
            onClick={() => onResolve(comment.id)}
            className="text-xs text-green-500 hover:text-green-600"
          >
            Resolve
          </button>
        )}
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
      {comment.resolved && (
        <p className="mt-2 text-xs text-gray-500">✓ Resolved</p>
      )}
    </div>
  );
}

// Presence indicator for showing online cursors
type PresenceAvatarsProps = {
  collaborators: Collaborator[];
  maxVisible?: number;
  className?: string;
};

export function PresenceAvatars({
  collaborators,
  maxVisible = 5,
  className = '',
}: PresenceAvatarsProps) {
  const onlineUsers = collaborators.filter(c => c.isOnline);
  const visible = onlineUsers.slice(0, maxVisible);
  const remaining = onlineUsers.length - maxVisible;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible.map(collaborator => (
        <div
          key={collaborator.id}
          className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-gray-300 dark:border-gray-800"
          title={collaborator.name}
          style={{ borderColor: collaborator.cursorColor }}
        >
          {collaborator.avatarUrl
            ? (
                <img src={collaborator.avatarUrl} alt={collaborator.name} className="size-full object-cover" />
              )
            : (
                <div className="flex size-full items-center justify-center text-xs font-medium text-gray-600">
                  {collaborator.name[0]}
                </div>
              )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-400">
          +
          {remaining}
        </div>
      )}
    </div>
  );
}

export type { Collaborator, Comment, PendingInvite };
