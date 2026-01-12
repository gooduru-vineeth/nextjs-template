'use client';

import { useEffect, useRef, useState } from 'react';

export type Comment = {
  id: string;
  x: number;
  y: number;
  content: string;
  author: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  createdAt: Date;
  resolved?: boolean;
  replies?: CommentReply[];
};

export type CommentReply = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  createdAt: Date;
};

type CommentsAnnotationsProps = {
  comments: Comment[];
  onAddComment: (x: number, y: number, content: string) => void;
  onEditComment: (id: string, content: string) => void;
  onDeleteComment: (id: string) => void;
  onResolveComment: (id: string) => void;
  onAddReply: (commentId: string, content: string) => void;
  currentUser: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  containerRef: React.RefObject<HTMLElement>;
  enabled?: boolean;
  showResolved?: boolean;
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
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

export function CommentsAnnotations({
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onResolveComment,
  onAddReply,
  currentUser,
  containerRef,
  enabled = true,
  showResolved = false,
}: CommentsAnnotationsProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number } | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Filter comments based on resolved status
  const visibleComments = showResolved
    ? comments
    : comments.filter(c => !c.resolved);

  // Handle clicking on the container to add a comment
  useEffect(() => {
    if (!enabled || !containerRef.current) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      if (!isAddingComment) {
        return;
      }

      const rect = containerRef.current!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setNewCommentPosition({ x, y });
      setTimeout(() => inputRef.current?.focus(), 0);
    };

    const container = containerRef.current;
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [enabled, isAddingComment, containerRef]);

  const handleSubmitNewComment = () => {
    if (!newCommentPosition || !newCommentContent.trim()) {
      return;
    }

    onAddComment(newCommentPosition.x, newCommentPosition.y, newCommentContent.trim());
    setNewCommentContent('');
    setNewCommentPosition(null);
    setIsAddingComment(false);
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) {
      return;
    }

    onAddReply(commentId, replyContent.trim());
    setReplyContent('');
  };

  const handleSubmitEdit = (commentId: string) => {
    if (!editContent.trim()) {
      return;
    }

    onEditComment(commentId, editContent.trim());
    setEditingComment(null);
    setEditContent('');
  };

  const handleCancelNewComment = () => {
    setNewCommentPosition(null);
    setNewCommentContent('');
    setIsAddingComment(false);
  };

  const Avatar = ({ author }: { author: { name: string; avatar?: string; initials?: string } }) => {
    if (author.avatar) {
      return (
        <div
          className="size-8 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${author.avatar})` }}
        />
      );
    }

    const initials = author.initials || author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
        {initials}
      </div>
    );
  };

  return (
    <>
      {/* Comment Toggle Button */}
      <div className="fixed right-4 bottom-4 z-50">
        <button
          type="button"
          onClick={() => setIsAddingComment(!isAddingComment)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-lg transition-all ${
            isAddingComment
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          {isAddingComment ? 'Click to add comment' : 'Add Comment'}
        </button>
      </div>

      {/* Comment Markers */}
      {visibleComments.map(comment => (
        <div
          key={comment.id}
          className="absolute z-40"
          style={{ left: `${comment.x}%`, top: `${comment.y}%` }}
        >
          {/* Marker dot */}
          <button
            type="button"
            onClick={() => setSelectedComment(selectedComment === comment.id ? null : comment.id)}
            className={`flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 ${
              comment.resolved
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          {/* Comment popup */}
          {selectedComment === comment.id && (
            <div className="absolute top-0 left-4 z-50 w-80 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 p-3 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Avatar author={comment.author} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!comment.resolved && (
                    <button
                      type="button"
                      onClick={() => onResolveComment(comment.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700"
                      title="Resolve"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                    title="Edit"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteComment(comment.id)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
                    title="Delete"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedComment(null)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                {editingComment === comment.id
                  ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingComment(null)}
                            className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmitEdit(comment.id)}
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )
                  : (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    )}

                {/* Resolved badge */}
                {comment.resolved && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Resolved
                  </div>
                )}
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="border-b border-gray-100 p-3 last:border-b-0 dark:border-gray-700">
                      <div className="mb-1 flex items-center gap-2">
                        <Avatar author={reply.author} />
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">
                            {reply.author.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(reply.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="ml-10 text-sm text-gray-700 dark:text-gray-300">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {!comment.resolved && (
                <div className="border-t border-gray-200 p-3 dark:border-gray-700">
                  <div className="flex items-start gap-2">
                    <Avatar author={currentUser} />
                    <div className="flex-1">
                      <textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        rows={2}
                      />
                      {replyContent.trim() && (
                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleSubmitReply(comment.id)}
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* New comment input */}
      {newCommentPosition && (
        <div
          className="absolute z-50"
          style={{ left: `${newCommentPosition.x}%`, top: `${newCommentPosition.y}%` }}
        >
          <div className="flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          <div className="absolute top-0 left-4 w-72 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="p-3">
              <div className="mb-2 flex items-center gap-2">
                <Avatar author={currentUser} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.name}
                </span>
              </div>
              <textarea
                ref={inputRef}
                value={newCommentContent}
                onChange={e => setNewCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) {
                    handleSubmitNewComment();
                  }
                  if (e.key === 'Escape') {
                    handleCancelNewComment();
                  }
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ⌘ + Enter to submit
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancelNewComment}
                    className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitNewComment}
                    disabled={!newCommentContent.trim()}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cursor indicator when adding comment */}
      {isAddingComment && !newCommentPosition && (
        <div className="pointer-events-none fixed inset-0 z-30">
          <style jsx>
            {`
            div :global(body) {
              cursor: crosshair !important;
            }
          `}
          </style>
        </div>
      )}
    </>
  );
}

export default CommentsAnnotations;
