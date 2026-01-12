'use client';

import {
  AtSign,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  Heart,
  Image,
  MessageCircle,
  Plus,
  Smile,
  ThumbsUp,
  Trash2,
  User,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'generic';
type CommentVariant = 'full' | 'compact' | 'minimal';

type CommentAuthor = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isVerified: boolean;
  isCreator: boolean;
  badges?: string[];
};

type Comment = {
  id: string;
  author: CommentAuthor;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  isHearted: boolean; // Creator hearted
  replies?: Comment[];
  isEdited: boolean;
};

export type CommentSectionBuilderProps = {
  variant?: CommentVariant;
  platform?: Platform;
  comments?: Comment[];
  totalComments?: number;
  showReplies?: boolean;
  maxRepliesVisible?: number;
  onAddComment?: (comment: Partial<Comment>) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, reply: Partial<Comment>) => void;
  className?: string;
};

// Mock data
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Sarah Designer',
      username: 'sarahdesign',
      isVerified: true,
      isCreator: false,
    },
    content: 'This is absolutely amazing! Love the attention to detail 🔥',
    timestamp: '2h',
    likes: 142,
    isLiked: false,
    isPinned: true,
    isHearted: true,
    isEdited: false,
    replies: [
      {
        id: '1-1',
        author: {
          id: '2',
          name: 'MockFlow',
          username: 'mockflow',
          isVerified: true,
          isCreator: true,
        },
        content: '@sarahdesign Thank you so much! Glad you like it! 🙏',
        timestamp: '1h',
        likes: 28,
        isLiked: false,
        isPinned: false,
        isHearted: false,
        isEdited: false,
      },
    ],
  },
  {
    id: '2',
    author: {
      id: '3',
      name: 'Tech Guy',
      username: 'techguy_dev',
      isVerified: false,
      isCreator: false,
    },
    content: 'How did you achieve this effect? Would love to learn!',
    timestamp: '4h',
    likes: 56,
    isLiked: true,
    isPinned: false,
    isHearted: false,
    isEdited: false,
    replies: [],
  },
  {
    id: '3',
    author: {
      id: '4',
      name: 'Creative Mind',
      username: 'creativemind',
      isVerified: false,
      isCreator: false,
    },
    content: 'This is exactly what I was looking for. Bookmarked! 📌',
    timestamp: '6h',
    likes: 89,
    isLiked: false,
    isPinned: false,
    isHearted: false,
    isEdited: true,
  },
];

export default function CommentSectionBuilder({
  variant = 'full',
  platform = 'instagram',
  comments = mockComments,
  totalComments = 156,
  showReplies = true,
  maxRepliesVisible = 2,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onLikeComment,
  onReplyComment,
  className = '',
}: CommentSectionBuilderProps) {
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);

  const toggleReplies = useCallback((commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  }, []);

  const handleAddComment = useCallback(() => {
    if (newComment.trim()) {
      onAddComment?.({
        content: newComment,
        author: {
          id: 'new',
          name: 'You',
          username: 'you',
          isVerified: false,
          isCreator: false,
        },
      });
      setNewComment('');
      setShowAddComment(false);
    }
  }, [newComment, onAddComment]);

  const handleEditComment = useCallback((commentId: string) => {
    if (editContent.trim()) {
      onEditComment?.(commentId, editContent);
      setEditingComment(null);
      setEditContent('');
    }
  }, [editContent, onEditComment]);

  const handleReply = useCallback((commentId: string) => {
    if (replyContent.trim()) {
      onReplyComment?.(commentId, {
        content: replyContent,
        author: {
          id: 'new',
          name: 'You',
          username: 'you',
          isVerified: false,
          isCreator: false,
        },
      });
      setReplyingTo(null);
      setReplyContent('');
    }
  }, [replyContent, onReplyComment]);

  const getPlatformStyles = () => {
    switch (platform) {
      case 'instagram':
        return {
          likeIcon: Heart,
          likeColor: 'text-red-500',
          verifiedColor: 'text-blue-500',
        };
      case 'facebook':
        return {
          likeIcon: ThumbsUp,
          likeColor: 'text-blue-600',
          verifiedColor: 'text-blue-500',
        };
      case 'twitter':
        return {
          likeIcon: Heart,
          likeColor: 'text-pink-500',
          verifiedColor: 'text-blue-400',
        };
      case 'youtube':
        return {
          likeIcon: ThumbsUp,
          likeColor: 'text-blue-600',
          verifiedColor: 'text-gray-500',
        };
      default:
        return {
          likeIcon: ThumbsUp,
          likeColor: 'text-blue-600',
          verifiedColor: 'text-blue-500',
        };
    }
  };

  const styles = getPlatformStyles();
  const LikeIcon = styles.likeIcon;

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.avatar
            ? (
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className={`rounded-full ${isReply ? 'h-8 w-8' : 'h-10 w-10'}`}
                />
              )
            : (
                <div className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700`}>
                  <User className="h-4 w-4 text-gray-500" />
                </div>
              )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {editingComment === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditComment(comment.id)}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {comment.author.name}
                </span>
                {comment.author.isVerified && (
                  <CheckCircle className={`h-3.5 w-3.5 ${styles.verifiedColor}`} />
                )}
                {comment.author.isCreator && (
                  <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                    Creator
                  </span>
                )}
                {comment.isPinned && (
                  <span className="text-xs text-gray-500">• Pinned</span>
                )}
              </div>

              {/* Comment text */}
              <p className="mt-0.5 text-sm text-gray-800 dark:text-gray-200">
                {comment.content}
              </p>

              {/* Actions */}
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span>{comment.timestamp}</span>
                <button
                  onClick={() => onLikeComment?.(comment.id)}
                  className={`flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 ${
                    comment.isLiked ? styles.likeColor : ''
                  }`}
                >
                  <LikeIcon className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </button>
                {comment.isHearted && (
                  <span className="flex items-center gap-1 text-red-500">
                    <Heart className="h-3.5 w-3.5 fill-current" />
                  </span>
                )}
                {!isReply && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Reply
                  </button>
                )}
                {comment.isEdited && <span className="text-gray-400">(edited)</span>}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingComment(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteComment?.(comment.id)}
                    className="rounded p-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={() => handleReply(comment.id)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
              >
                Reply
              </button>
            </div>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.length > maxRepliesVisible && !expandedReplies.has(comment.id)
                ? (
                    <>
                      {comment.replies.slice(0, maxRepliesVisible).map(reply => renderComment(reply, true))}
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400"
                      >
                        <ChevronDown className="h-4 w-4" />
                        View
                        {' '}
                        {comment.replies.length - maxRepliesVisible}
                        {' '}
                        more replies
                      </button>
                    </>
                  )
                : (
                    <>
                      {comment.replies.map(reply => renderComment(reply, true))}
                      {comment.replies.length > maxRepliesVisible && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400"
                        >
                          <ChevronUp className="h-4 w-4" />
                          Hide replies
                        </button>
                      )}
                    </>
                  )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`space-y-3 ${className}`}>
        {comments.slice(0, 3).map(comment => (
          <div key={comment.id} className="flex gap-2 text-sm">
            <span className="font-semibold text-gray-900 dark:text-white">{comment.author.username}</span>
            <span className="line-clamp-1 text-gray-700 dark:text-gray-300">{comment.content}</span>
          </div>
        ))}
        {totalComments > 3 && (
          <button className="text-sm text-gray-500">
            View all
            {' '}
            {totalComments}
            {' '}
            comments
          </button>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
            <MessageCircle className="h-4 w-4" />
            {totalComments}
            {' '}
            Comments
          </span>
          <button
            onClick={() => setShowAddComment(!showAddComment)}
            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showAddComment && (
          <div className="border-b border-gray-200 p-3 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={handleAddComment}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
              >
                Post
              </button>
            </div>
          </div>
        )}

        <div className="max-h-64 space-y-4 overflow-y-auto p-3">
          {comments.map(comment => renderComment(comment))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <MessageCircle className="h-5 w-5" />
            Comments (
            {totalComments}
            )
          </h3>
          <select className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option>Top comments</option>
            <option>Newest first</option>
          </select>
        </div>
      </div>

      {/* Add comment */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {newComment && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Smile className="h-5 w-5" />
                  </button>
                  <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Image className="h-5 w-5" />
                  </button>
                  <button className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <AtSign className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={handleAddComment}
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white"
                >
                  Comment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6 p-4">
        {comments.length === 0
          ? (
              <div className="py-8 text-center">
                <MessageCircle className="mx-auto mb-2 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500">No comments yet</p>
                <p className="text-sm text-gray-400">Be the first to comment</p>
              </div>
            )
          : (
              comments.map(comment => renderComment(comment))
            )}
      </div>

      {/* Load more */}
      {comments.length < totalComments && (
        <div className="border-t border-gray-200 p-4 text-center dark:border-gray-800">
          <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
}

export type { Comment, CommentAuthor, CommentVariant, Platform };
