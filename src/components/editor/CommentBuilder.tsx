'use client';

import type { SocialComment } from '@/types/Mockup';
import { useState } from 'react';

type CommentBuilderProps = {
  comments: SocialComment[];
  onChange: (comments: SocialComment[]) => void;
  maxComments?: number;
  allowReplies?: boolean;
  theme?: 'light' | 'dark';
};

export function CommentBuilder({
  comments,
  onChange,
  maxComments = 20,
  allowReplies = true,
  theme = 'light',
}: CommentBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const addComment = () => {
    if (comments.length >= maxComments) {
      return;
    }

    const newComment: SocialComment = {
      id: `comment-${Date.now()}`,
      authorId: `user-${Date.now()}`,
      authorName: 'User Name',
      authorAvatarUrl: '',
      content: 'This is a great post!',
      timestamp: 'Just now',
      likes: Math.floor(Math.random() * 100),
      replies: [],
    };

    onChange([...comments, newComment]);
    setEditingId(newComment.id);
  };

  const updateComment = (id: string, updates: Partial<SocialComment>) => {
    onChange(
      comments.map(comment =>
        comment.id === id ? { ...comment, ...updates } : comment,
      ),
    );
  };

  const deleteComment = (id: string) => {
    onChange(comments.filter(comment => comment.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const addReply = (parentId: string) => {
    if (!allowReplies) {
      return;
    }

    const newReply: SocialComment = {
      id: `reply-${Date.now()}`,
      authorId: `user-${Date.now()}`,
      authorName: 'Reply User',
      authorAvatarUrl: '',
      content: 'Thanks for sharing!',
      timestamp: 'Just now',
      likes: Math.floor(Math.random() * 50),
    };

    onChange(
      comments.map(comment =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment,
      ),
    );
  };

  const updateReply = (
    parentId: string,
    replyId: string,
    updates: Partial<SocialComment>,
  ) => {
    onChange(
      comments.map(comment =>
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies?.map(reply =>
                reply.id === replyId ? { ...reply, ...updates } : reply,
              ),
            }
          : comment,
      ),
    );
  };

  const deleteReply = (parentId: string, replyId: string) => {
    onChange(
      comments.map(comment =>
        comment.id === parentId
          ? {
              ...comment,
              replies: comment.replies?.filter(reply => reply.id !== replyId),
            }
          : comment,
      ),
    );
  };

  const moveComment = (id: string, direction: 'up' | 'down') => {
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) {
      return;
    }
    if (direction === 'up' && index === 0) {
      return;
    }
    if (direction === 'down' && index === comments.length - 1) {
      return;
    }

    const newComments = [...comments];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newComments[index], newComments[targetIndex]] = [newComments[targetIndex]!, newComments[index]!];
    onChange(newComments);
  };

  return (
    <div className={`rounded-lg border p-4 ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Comments (
          {comments.length}
          /
          {maxComments}
          )
        </h3>
        <button
          type="button"
          onClick={addComment}
          disabled={comments.length >= maxComments}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            comments.length >= maxComments
              ? 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Comment
        </button>
      </div>

      {comments.length === 0 ? (
        <div className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg className="mx-auto mb-2 size-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">No comments yet</p>
          <p className="text-xs opacity-75">Click &quot;Add Comment&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={comment.id} className={`rounded-lg border p-3 ${isDark ? 'border-gray-700 bg-gray-700/50' : 'border-gray-100 bg-gray-50'}`}>
              {/* Comment Header */}
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                    {index + 1}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {comment.authorName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveComment(comment.id, 'up')}
                    disabled={index === 0}
                    className={`rounded p-1 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} disabled:opacity-30`}
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveComment(comment.id, 'down')}
                    disabled={index === comments.length - 1}
                    className={`rounded p-1 ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} disabled:opacity-30`}
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteComment(comment.id)}
                    className={`rounded p-1 text-red-400 ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}`}
                  >
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Comment Fields */}
              {editingId === comment.id
                ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={comment.authorName}
                        onChange={e => updateComment(comment.id, { authorName: e.target.value })}
                        placeholder="Author name"
                        className={`w-full rounded border px-2 py-1 text-sm ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                      />
                      <input
                        type="text"
                        value={comment.authorAvatarUrl || ''}
                        onChange={e => updateComment(comment.id, { authorAvatarUrl: e.target.value })}
                        placeholder="Avatar URL (optional)"
                        className={`w-full rounded border px-2 py-1 text-sm ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                      />
                      <textarea
                        value={comment.content}
                        onChange={e => updateComment(comment.id, { content: e.target.value })}
                        placeholder="Comment text"
                        rows={2}
                        className={`w-full rounded border px-2 py-1 text-sm ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={comment.timestamp}
                          onChange={e => updateComment(comment.id, { timestamp: e.target.value })}
                          placeholder="Timestamp"
                          className={`flex-1 rounded border px-2 py-1 text-sm ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                        />
                        <input
                          type="number"
                          value={comment.likes}
                          onChange={e => updateComment(comment.id, { likes: Number(e.target.value) })}
                          placeholder="Likes"
                          className={`w-20 rounded border px-2 py-1 text-sm ${isDark ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-200 bg-white'}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="mt-1 rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
                      >
                        Done
                      </button>
                    </div>
                  )
                : (
                    <div
                      onClick={() => setEditingId(comment.id)}
                      className="cursor-pointer"
                    >
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{comment.content}</p>
                      <div className={`mt-1 flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>{comment.timestamp}</span>
                        <span>
                          {comment.likes}
                          {' '}
                          likes
                        </span>
                        <span className="text-blue-500">Click to edit</span>
                      </div>
                    </div>
                  )}

              {/* Replies */}
              {allowReplies && (
                <div className="mt-3 border-t border-dashed pt-2 dark:border-gray-600">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Replies (
                      {comment.replies?.length || 0}
                      )
                    </span>
                    <button
                      type="button"
                      onClick={() => addReply(comment.id)}
                      className={`rounded px-2 py-0.5 text-xs ${isDark ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    >
                      + Reply
                    </button>
                  </div>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-4 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className={`rounded border p-2 ${isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-100 bg-white'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <input
                                type="text"
                                value={reply.authorName}
                                onChange={e => updateReply(comment.id, reply.id, { authorName: e.target.value })}
                                placeholder="Reply author"
                                className={`mb-1 w-full rounded border-none bg-transparent p-0 text-xs font-medium focus:ring-0 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                              />
                              <textarea
                                value={reply.content}
                                onChange={e => updateReply(comment.id, reply.id, { content: e.target.value })}
                                placeholder="Reply content"
                                rows={1}
                                className={`w-full rounded border-none bg-transparent p-0 text-xs focus:ring-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteReply(comment.id, reply.id)}
                              className={`rounded p-0.5 text-red-400 ${isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}`}
                            >
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
