'use client';

import {
  AtSign,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Edit2,
  Flag,
  Heart,
  Image,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Plus,
  Reply,
  Share2,
  Smile,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type Comment = {
  id: string;
  author: {
    name: string;
    username?: string;
    avatar?: string;
    isVerified?: boolean;
    isAuthor?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  replies?: Comment[];
  isEdited?: boolean;
  images?: string[];
  mentions?: string[];
};

export type CommentSectionBuilderProps = {
  comments: Comment[];
  onCommentsChange?: (comments: Comment[]) => void;
  onCommentAdd?: (comment: Partial<Comment>, parentId?: string) => void;
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
  onCommentLike?: (commentId: string) => void;
  platform?: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'youtube' | 'tiktok' | 'generic';
  maxReplies?: number;
  showReplies?: boolean;
  showLikes?: boolean;
  showTimestamps?: boolean;
  allowEditing?: boolean;
  variant?: 'full' | 'compact' | 'preview' | 'minimal';
  darkMode?: boolean;
  className?: string;
};

export default function CommentSectionBuilder({
  comments,
  onCommentsChange: _onCommentsChange,
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
  onCommentLike,
  platform = 'generic',
  maxReplies = 3,
  showReplies = true,
  showLikes = true,
  showTimestamps = true,
  allowEditing = true,
  variant = 'full',
  darkMode = false,
  className = '',
}: CommentSectionBuilderProps) {
  // Reserved for future batch comment changes
  void _onCommentsChange;

  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const getPlatformStyles = () => {
    switch (platform) {
      case 'instagram':
        return {
          likeIcon: Heart,
          likeColor: 'text-red-500',
          avatarSize: 'w-8 h-8',
          fontStyle: 'font-normal',
        };
      case 'linkedin':
        return {
          likeIcon: ThumbsUp,
          likeColor: 'text-blue-500',
          avatarSize: 'w-10 h-10',
          fontStyle: 'font-normal',
        };
      case 'twitter':
        return {
          likeIcon: Heart,
          likeColor: 'text-pink-500',
          avatarSize: 'w-10 h-10',
          fontStyle: 'font-normal',
        };
      case 'facebook':
        return {
          likeIcon: ThumbsUp,
          likeColor: 'text-blue-600',
          avatarSize: 'w-10 h-10',
          fontStyle: 'font-normal',
        };
      case 'youtube':
        return {
          likeIcon: ThumbsUp,
          likeColor: 'text-blue-500',
          avatarSize: 'w-10 h-10',
          fontStyle: 'font-medium',
        };
      case 'tiktok':
        return {
          likeIcon: Heart,
          likeColor: 'text-red-500',
          avatarSize: 'w-9 h-9',
          fontStyle: 'font-semibold',
        };
      default:
        return {
          likeIcon: Heart,
          likeColor: 'text-red-500',
          avatarSize: 'w-9 h-9',
          fontStyle: 'font-medium',
        };
    }
  };

  const platformStyles = getPlatformStyles();
  const LikeIcon = platformStyles.likeIcon;

  const toggleExpand = useCallback((commentId: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  }, []);

  const handleStartEdit = useCallback((comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingCommentId && editContent.trim()) {
      onCommentEdit?.(editingCommentId, editContent.trim());
      setEditingCommentId(null);
      setEditContent('');
    }
  }, [editingCommentId, editContent, onCommentEdit]);

  const handleAddReply = useCallback(() => {
    if (replyingToId && replyContent.trim()) {
      onCommentAdd?.(
        {
          content: replyContent.trim(),
          author: { name: 'You', avatar: '' },
          timestamp: 'Just now',
          likes: 0,
        },
        replyingToId,
      );
      setReplyingToId(null);
      setReplyContent('');
    }
  }, [replyingToId, replyContent, onCommentAdd]);

  const handleAddNewComment = useCallback(() => {
    if (newCommentContent.trim()) {
      onCommentAdd?.({
        content: newCommentContent.trim(),
        author: { name: 'You', avatar: '' },
        timestamp: 'Just now',
        likes: 0,
      });
      setNewCommentContent('');
      setShowAddComment(false);
    }
  }, [newCommentContent, onCommentAdd]);

  const formatContent = (content: string) => {
    // Highlight mentions
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="cursor-pointer text-blue-500 hover:underline">
            {part}
          </span>
        );
      }
      // Highlight hashtags
      if (part.startsWith('#')) {
        return (
          <span key={index} className="cursor-pointer text-blue-500 hover:underline">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const renderComment = (comment: Comment, isReply = false, depth = 0) => {
    const isExpanded = expandedComments.has(comment.id);
    const isEditing = editingCommentId === comment.id;
    const isReplying = replyingToId === comment.id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const visibleReplies = isExpanded ? comment.replies : comment.replies?.slice(0, maxReplies);

    return (
      <div
        key={comment.id}
        className={`${isReply ? `ml-${Math.min(depth * 8, 16)} mt-3 border-l-2 pl-4 ${borderColor}` : ''}`}
      >
        <div className={`flex gap-3 ${comment.isPinned ? `${inputBg} -mr-3 -ml-3 rounded-lg p-3` : ''}`}>
          {/* Avatar */}
          <div className={`${platformStyles.avatarSize} flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-500 font-medium text-white`}>
            {comment.author.avatar
              ? (
                  <img src={comment.author.avatar} alt={comment.author.name} className="h-full w-full object-cover" />
                )
              : (
                  comment.author.name.charAt(0)
                )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${platformStyles.fontStyle} ${textColor}`}>
                {comment.author.name}
              </span>
              {comment.author.isVerified && (
                <BadgeCheck size={14} className="text-blue-500" />
              )}
              {comment.author.isAuthor && (
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  Author
                </span>
              )}
              {comment.author.username && (
                <span className={`text-sm ${mutedColor}`}>
                  @
                  {comment.author.username}
                </span>
              )}
              {showTimestamps && (
                <>
                  <span className={mutedColor}>·</span>
                  <span className={`text-sm ${mutedColor}`}>{comment.timestamp}</span>
                </>
              )}
              {comment.isEdited && (
                <span className={`text-xs ${mutedColor}`}>(edited)</span>
              )}
              {comment.isPinned && (
                <div className="flex items-center gap-1 text-xs text-blue-500">
                  <Pin size={12} />
                  Pinned
                </div>
              )}
            </div>

            {/* Comment content */}
            {isEditing
              ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} resize-none`}
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(null); setEditContent('');
                        }}
                        className={`px-3 py-1 text-sm ${mutedColor} ${hoverBg} rounded`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )
              : (
                  <p className={`mt-1 ${textColor} text-sm`}>{formatContent(comment.content)}</p>
                )}

            {/* Images */}
            {comment.images && comment.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {comment.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="max-w-[200px] rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-2 flex items-center gap-4">
              {showLikes && (
                <button
                  onClick={() => onCommentLike?.(comment.id)}
                  className={`flex items-center gap-1 text-sm ${comment.isLiked ? platformStyles.likeColor : mutedColor} hover:opacity-80`}
                >
                  <LikeIcon size={14} className={comment.isLiked ? 'fill-current' : ''} />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </button>
              )}

              {showReplies && !isReply && (
                <button
                  onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                  className={`flex items-center gap-1 text-sm ${mutedColor} hover:opacity-80`}
                >
                  <Reply size={14} />
                  Reply
                </button>
              )}

              {allowEditing && (
                <div className="group relative">
                  <button className={`p-1 ${mutedColor} ${hoverBg} rounded`}>
                    <MoreHorizontal size={14} />
                  </button>
                  <div className={`absolute top-full right-0 mt-1 ${bgColor} border ${borderColor} invisible z-10 min-w-[120px] rounded-lg py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100`}>
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm ${textColor} ${hoverBg}`}
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => onCommentDelete?.(comment.id)}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-500 ${hoverBg}`}
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                    <button className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm ${textColor} ${hoverBg}`}>
                      <Flag size={12} />
                      Report
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reply input */}
            {isReplying && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className={`flex-1 px-3 py-2 ${inputBg} ${textColor} rounded-full border text-sm ${borderColor}`}
                  autoFocus
                />
                <button
                  onClick={handleAddReply}
                  disabled={!replyContent.trim()}
                  className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Reply
                </button>
              </div>
            )}

            {/* Replies */}
            {hasReplies && showReplies && (
              <div className="mt-3">
                {visibleReplies?.map(reply => renderComment(reply, true, depth + 1))}

                {comment.replies && comment.replies.length > maxReplies && (
                  <button
                    onClick={() => toggleExpand(comment.id)}
                    className="mt-2 flex items-center gap-1 text-sm text-blue-500 hover:underline"
                  >
                    {isExpanded
                      ? (
                          <>
                            <ChevronUp size={14} />
                            Hide replies
                          </>
                        )
                      : (
                          <>
                            <ChevronDown size={14} />
                            View
                            {' '}
                            {comment.replies.length - maxReplies}
                            {' '}
                            more replies
                          </>
                        )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} ${className}`}>
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className={mutedColor} />
          <span className={`text-sm ${textColor}`}>
            {comments.length}
            {' '}
            comments
          </span>
        </div>
      </div>
    );
  }

  // Preview variant
  if (variant === 'preview') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className={`text-sm font-medium ${textColor}`}>
            {comments.length}
            {' '}
            Comments
          </span>
        </div>
        <div className="space-y-3">
          {comments.slice(0, 3).map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-xs text-white">
                {comment.author.avatar
                  ? (
                      <img src={comment.author.avatar} alt="" className="h-full w-full rounded-full object-cover" />
                    )
                  : (
                      comment.author.name.charAt(0)
                    )}
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-xs font-medium ${textColor}`}>{comment.author.name}</span>
                <p className={`text-xs ${mutedColor} truncate`}>{comment.content}</p>
              </div>
            </div>
          ))}
          {comments.length > 3 && (
            <button className="text-xs text-blue-500 hover:underline">
              View all
              {' '}
              {comments.length}
              {' '}
              comments
            </button>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className={mutedColor} />
            <span className={`font-medium ${textColor}`}>
              {comments.length}
              {' '}
              Comments
            </span>
          </div>
          <button
            onClick={() => setShowAddComment(true)}
            className={`p-1.5 ${inputBg} rounded ${hoverBg}`}
          >
            <Plus size={14} className={mutedColor} />
          </button>
        </div>

        <div className="max-h-80 space-y-4 overflow-y-auto">
          {comments.map(comment => renderComment(comment))}
        </div>

        {showAddComment && (
          <div className={`mt-4 border-t pt-4 ${borderColor}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCommentContent}
                onChange={e => setNewCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className={`flex-1 px-3 py-2 ${inputBg} ${textColor} rounded-full border text-sm ${borderColor}`}
                autoFocus
              />
              <button
                onClick={handleAddNewComment}
                disabled={!newCommentContent.trim()}
                className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <MessageCircle size={20} className={mutedColor} />
          <h3 className={`font-semibold ${textColor}`}>
            {comments.length}
            {' '}
            Comments
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <select className={`px-3 py-1.5 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Most liked</option>
          </select>
          <button
            onClick={() => setShowAddComment(!showAddComment)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            <Plus size={14} />
            Add Comment
          </button>
        </div>
      </div>

      {/* Add comment input */}
      {showAddComment && (
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-medium text-white">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={newCommentContent}
                onChange={e => setNewCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className={`w-full px-4 py-3 ${inputBg} ${textColor} rounded-lg border ${borderColor} resize-none`}
                rows={3}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className={`p-2 ${hoverBg} rounded`}>
                    <Image size={16} className={mutedColor} />
                  </button>
                  <button className={`p-2 ${hoverBg} rounded`}>
                    <Smile size={16} className={mutedColor} />
                  </button>
                  <button className={`p-2 ${hoverBg} rounded`}>
                    <AtSign size={16} className={mutedColor} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowAddComment(false); setNewCommentContent('');
                    }}
                    className={`px-4 py-2 ${mutedColor} ${hoverBg} rounded-lg text-sm`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewComment}
                    disabled={!newCommentContent.trim()}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="max-h-[500px] space-y-4 overflow-y-auto p-4">
        {comments.length === 0
          ? (
              <div className="py-12 text-center">
                <MessageCircle size={48} className={`mx-auto mb-4 ${mutedColor} opacity-30`} />
                <p className={textColor}>No comments yet</p>
                <p className={`text-sm ${mutedColor} mt-1`}>Be the first to comment!</p>
              </div>
            )
          : (
              comments.map(comment => renderComment(comment))
            )}
      </div>

      {/* Footer */}
      <div className={`border-t p-3 ${borderColor} flex items-center justify-between`}>
        <span className={`text-xs ${mutedColor}`}>
          Platform:
          {' '}
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </span>
        <div className="flex items-center gap-2">
          <button className={`flex items-center gap-1 text-xs ${mutedColor} ${hoverBg} rounded px-2 py-1`}>
            <Share2 size={12} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
