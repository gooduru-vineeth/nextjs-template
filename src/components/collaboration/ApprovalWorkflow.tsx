'use client';

import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit3,
  Eye,
  MessageSquare,
  RotateCcw,
  Send,
  User,
  X,
  XCircle,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ApprovalStatus
  = | 'pending'
    | 'in_review'
    | 'approved'
    | 'rejected'
    | 'changes_requested'
    | 'cancelled';

export type ApprovalPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Approver = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status: ApprovalStatus;
  comment?: string;
  decidedAt?: Date;
  required: boolean;
};

export type ApprovalStage = {
  id: string;
  name: string;
  description?: string;
  approvers: Approver[];
  requireAll: boolean; // All approvers must approve vs. any one
  order: number;
  status: ApprovalStatus;
  deadline?: Date;
};

export type ApprovalRequest = {
  id: string;
  title: string;
  description?: string;
  templateId: string;
  templateName: string;
  submittedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  submittedAt: Date;
  stages: ApprovalStage[];
  currentStageId: string;
  status: ApprovalStatus;
  priority: ApprovalPriority;
  deadline?: Date;
  comments: ApprovalComment[];
};

export type ApprovalComment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  type: 'comment' | 'approval' | 'rejection' | 'request_changes';
};

export type ApprovalWorkflowProps = {
  request?: ApprovalRequest;
  currentUserId?: string;
  onApprove?: (stageId: string, comment?: string) => void;
  onReject?: (stageId: string, comment: string) => void;
  onRequestChanges?: (stageId: string, comment: string) => void;
  onComment?: (comment: string) => void;
  onCancel?: () => void;
  onResubmit?: () => void;
  variant?: 'full' | 'compact' | 'card';
  className?: string;
};

// ============================================================================
// Sample Data
// ============================================================================

const sampleRequest: ApprovalRequest = {
  id: 'req-1',
  title: 'New iMessage Template Design',
  description: 'Updated message bubble styling with iOS 18 design language',
  templateId: 'tpl-1',
  templateName: 'iMessage Pro v2.0',
  submittedBy: {
    id: 'u1',
    name: 'Sarah Chen',
    avatar: undefined,
  },
  submittedAt: new Date('2024-04-10T09:30:00'),
  stages: [
    {
      id: 'stage-1',
      name: 'Design Review',
      description: 'Review visual design and styling',
      approvers: [
        {
          id: 'u2',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Lead Designer',
          status: 'approved',
          comment: 'Looks great! Clean implementation.',
          decidedAt: new Date('2024-04-10T14:00:00'),
          required: true,
        },
      ],
      requireAll: true,
      order: 1,
      status: 'approved',
    },
    {
      id: 'stage-2',
      name: 'Technical Review',
      description: 'Check code quality and performance',
      approvers: [
        {
          id: 'u3',
          name: 'Emily Wong',
          email: 'emily@example.com',
          role: 'Senior Developer',
          status: 'in_review',
          required: true,
        },
        {
          id: 'u4',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'QA Engineer',
          status: 'pending',
          required: false,
        },
      ],
      requireAll: false,
      order: 2,
      status: 'in_review',
      deadline: new Date('2024-04-15'),
    },
    {
      id: 'stage-3',
      name: 'Final Approval',
      description: 'Executive sign-off',
      approvers: [
        {
          id: 'u5',
          name: 'Alex Rivera',
          email: 'alex@example.com',
          role: 'Product Manager',
          status: 'pending',
          required: true,
        },
      ],
      requireAll: true,
      order: 3,
      status: 'pending',
    },
  ],
  currentStageId: 'stage-2',
  status: 'in_review',
  priority: 'high',
  deadline: new Date('2024-04-20'),
  comments: [
    {
      id: 'c1',
      userId: 'u2',
      userName: 'John Doe',
      content: 'Approved! The design matches our style guide perfectly.',
      createdAt: new Date('2024-04-10T14:00:00'),
      type: 'approval',
    },
    {
      id: 'c2',
      userId: 'u3',
      userName: 'Emily Wong',
      content: 'Starting review now. Will check performance metrics.',
      createdAt: new Date('2024-04-11T10:00:00'),
      type: 'comment',
    },
  ],
};

// ============================================================================
// Sub-Components
// ============================================================================

type StatusBadgeProps = {
  status: ApprovalStatus;
  size?: 'sm' | 'md';
};

function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const configs: Record<ApprovalStatus, { icon: React.ReactNode; label: string; className: string }> = {
    pending: {
      icon: <Clock className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: 'Pending',
      className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    },
    in_review: {
      icon: <Eye className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: 'In Review',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    approved: {
      icon: <CheckCircle2 className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: 'Approved',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    },
    rejected: {
      icon: <XCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
    changes_requested: {
      icon: <Edit3 className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: 'Changes Requested',
      className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    },
    cancelled: {
      icon: <XCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />,
      label: 'Cancelled',
      className: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    },
  };

  const config = configs[status];
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${sizeClasses}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

type PriorityBadgeProps = {
  priority: ApprovalPriority;
};

function PriorityBadge({ priority }: PriorityBadgeProps) {
  const configs: Record<ApprovalPriority, { label: string; className: string }> = {
    low: { label: 'Low', className: 'bg-gray-100 text-gray-600' },
    medium: { label: 'Medium', className: 'bg-blue-100 text-blue-600' },
    high: { label: 'High', className: 'bg-orange-100 text-orange-600' },
    urgent: { label: 'Urgent', className: 'bg-red-100 text-red-600' },
  };

  const config = configs[priority];

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

type ApproverAvatarProps = {
  approver: Approver;
  showStatus?: boolean;
};

function ApproverAvatar({ approver, showStatus = true }: ApproverAvatarProps) {
  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'changes_requested': return 'bg-yellow-500';
      case 'in_review': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="relative">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
        {approver.avatar
          ? (
              <img src={approver.avatar} alt={approver.name} className="h-full w-full rounded-full" />
            )
          : (
              <User className="h-4 w-4 text-gray-500" />
            )}
      </div>
      {showStatus && (
        <div className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(approver.status)}`} />
      )}
    </div>
  );
}

type StageProgressProps = {
  stages: ApprovalStage[];
  currentStageId: string;
};

function StageProgress({ stages, currentStageId }: StageProgressProps) {
  return (
    <div className="flex items-center">
      {stages.map((stage, index) => {
        const isComplete = stage.status === 'approved';
        const isCurrent = stage.id === currentStageId;
        const isRejected = stage.status === 'rejected' || stage.status === 'changes_requested';

        return (
          <React.Fragment key={stage.id}>
            {/* Stage dot */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full transition-colors
                  ${isComplete
            ? 'bg-green-500 text-white'
            : isRejected
              ? 'bg-red-500 text-white'
              : isCurrent
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-500 dark:bg-gray-700'}
                `}
              >
                {isComplete
                  ? (
                      <CheckCircle2 className="h-5 w-5" />
                    )
                  : isRejected
                    ? (
                        <XCircle className="h-5 w-5" />
                      )
                    : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
              </div>
              <span className={`mt-1 text-xs ${isCurrent ? 'font-medium' : 'text-gray-500'}`}>
                {stage.name}
              </span>
            </div>

            {/* Connector */}
            {index < stages.length - 1 && (
              <div
                className={`
                  mx-2 h-0.5 flex-1 transition-colors
                  ${isComplete ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

type StageCardProps = {
  stage: ApprovalStage;
  isCurrent: boolean;
  currentUserId?: string;
  onApprove?: (comment?: string) => void;
  onReject?: (comment: string) => void;
  onRequestChanges?: (comment: string) => void;
};

function StageCard({
  stage,
  isCurrent,
  currentUserId,
  onApprove,
  onReject,
  onRequestChanges,
}: StageCardProps) {
  const [expanded, setExpanded] = useState(isCurrent);
  const [actionComment, setActionComment] = useState('');
  const [showActions, setShowActions] = useState(false);

  const currentUserApprover = stage.approvers.find(a => a.id === currentUserId);
  const canTakeAction = isCurrent && currentUserApprover
    && (currentUserApprover.status === 'pending' || currentUserApprover.status === 'in_review');

  const approvedCount = stage.approvers.filter(a => a.status === 'approved').length;
  const requiredCount = stage.approvers.filter(a => a.required).length;

  return (
    <div
      className={`
        overflow-hidden rounded-lg border transition-all
        ${isCurrent ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-700'}
      `}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium">{stage.name}</span>
              <StatusBadge status={stage.status} size="sm" />
              {isCurrent && (
                <span className="rounded bg-blue-500 px-1.5 py-0.5 text-xs text-white">Current</span>
              )}
            </div>
            {stage.description && (
              <p className="text-sm text-gray-500">{stage.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Approver avatars */}
          <div className="flex -space-x-2">
            {stage.approvers.slice(0, 4).map(approver => (
              <ApproverAvatar key={approver.id} approver={approver} />
            ))}
            {stage.approvers.length > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs dark:bg-gray-700">
                +
                {stage.approvers.length - 4}
              </div>
            )}
          </div>

          {/* Progress */}
          <span className="text-sm text-gray-500">
            {approvedCount}
            /
            {stage.requireAll ? stage.approvers.length : requiredCount || 1}
          </span>
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t bg-gray-50/50 px-4 pb-4 dark:bg-gray-900/30">
          {/* Approvers */}
          <div className="mt-3 space-y-3">
            {stage.approvers.map(approver => (
              <div
                key={approver.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <ApproverAvatar approver={approver} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{approver.name}</span>
                      {approver.required && (
                        <span className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-700">Required</span>
                      )}
                    </div>
                    {approver.role && (
                      <p className="text-xs text-gray-500">{approver.role}</p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <StatusBadge status={approver.status} size="sm" />
                  {approver.decidedAt && (
                    <p className="mt-1 text-xs text-gray-400">
                      {approver.decidedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Deadline */}
          {stage.deadline && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">
                Deadline:
                {' '}
                {stage.deadline.toLocaleDateString()}
              </span>
              {stage.deadline < new Date() && stage.status !== 'approved' && (
                <span className="font-medium text-red-500">Overdue</span>
              )}
            </div>
          )}

          {/* Actions */}
          {canTakeAction && (
            <div className="mt-4 border-t pt-4">
              {!showActions
                ? (
                    <button
                      onClick={() => setShowActions(true)}
                      className="w-full rounded-lg border border-dashed py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Take Action
                    </button>
                  )
                : (
                    <div className="space-y-3">
                      <textarea
                        value={actionComment}
                        onChange={e => setActionComment(e.target.value)}
                        placeholder="Add a comment (optional for approval, required for rejection)"
                        className="h-20 w-full resize-none rounded-lg border p-3 text-sm"
                      />

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onApprove?.(actionComment || undefined);
                            setShowActions(false);
                            setActionComment('');
                          }}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => {
                            if (actionComment) {
                              onRequestChanges?.(actionComment);
                              setShowActions(false);
                              setActionComment('');
                            }
                          }}
                          disabled={!actionComment}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
                        >
                          <Edit3 className="h-4 w-4" />
                          Request Changes
                        </button>

                        <button
                          onClick={() => {
                            if (actionComment) {
                              onReject?.(actionComment);
                              setShowActions(false);
                              setActionComment('');
                            }
                          }}
                          disabled={!actionComment}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setShowActions(false);
                          setActionComment('');
                        }}
                        className="w-full py-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type CommentSectionProps = {
  comments: ApprovalComment[];
  onAddComment?: (content: string) => void;
};

function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const getCommentIcon = (type: ApprovalComment['type']) => {
    switch (type) {
      case 'approval': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejection': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'request_changes': return <Edit3 className="h-4 w-4 text-yellow-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3 dark:bg-gray-700">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-medium">
          Comments (
          {comments.length}
          )
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {comments.length === 0
          ? (
              <p className="p-4 text-center text-sm text-gray-500">No comments yet</p>
            )
          : (
              <div className="divide-y">
                {comments.map(comment => (
                  <div key={comment.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.userName}</span>
                          {getCommentIcon(comment.type)}
                          <span className="text-xs text-gray-400">
                            {comment.createdAt.toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>

      {onAddComment && (
        <div className="border-t bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ApprovalWorkflow({
  request = sampleRequest,
  currentUserId = 'u3',
  onApprove,
  onReject,
  onRequestChanges,
  onComment,
  onCancel,
  onResubmit,
  variant = 'full',
  className = '',
}: ApprovalWorkflowProps) {
  const _currentStage = useMemo(() => {
    return request.stages.find(s => s.id === request.currentStageId);
  }, [request]);
  void _currentStage; // Reserved for future use

  const handleApprove = useCallback((stageId: string, comment?: string) => {
    onApprove?.(stageId, comment);
  }, [onApprove]);

  const handleReject = useCallback((stageId: string, comment: string) => {
    onReject?.(stageId, comment);
  }, [onReject]);

  const handleRequestChanges = useCallback((stageId: string, comment: string) => {
    onRequestChanges?.(stageId, comment);
  }, [onRequestChanges]);

  if (variant === 'card') {
    return (
      <div className={`rounded-lg border bg-white p-4 dark:bg-gray-800 ${className}`}>
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-medium">{request.title}</h3>
            <p className="text-sm text-gray-500">{request.templateName}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <StageProgress stages={request.stages} currentStageId={request.currentStageId} />

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Submitted by
            {' '}
            {request.submittedBy.name}
          </span>
          <span className="text-gray-400">
            {request.submittedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
          <span className="text-sm text-gray-500">
            Stage
            {' '}
            {request.stages.findIndex(s => s.id === request.currentStageId) + 1}
            {' '}
            of
            {' '}
            {request.stages.length}
          </span>
        </div>

        <StageProgress stages={request.stages} currentStageId={request.currentStageId} />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h2 className="text-xl font-bold">{request.title}</h2>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
          {request.description && (
            <p className="text-gray-500">{request.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-400">
            Template:
            {' '}
            {request.templateName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {request.status === 'rejected' || request.status === 'changes_requested'
            ? (
                <button
                  onClick={onResubmit}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resubmit
                </button>
              )
            : request.status === 'pending' || request.status === 'in_review'
              ? (
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel Request
                  </button>
                )
              : null}
        </div>
      </div>

      {/* Submitted by */}
      <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
          <User className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <p className="font-medium">{request.submittedBy.name}</p>
          <p className="text-sm text-gray-500">
            Submitted on
            {' '}
            {request.submittedAt.toLocaleString()}
          </p>
        </div>

        {request.deadline && (
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">Deadline</p>
            <p className={`font-medium ${
              request.deadline < new Date() && request.status !== 'approved'
                ? 'text-red-500'
                : ''
            }`}
            >
              {request.deadline.toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-medium">Approval Progress</h3>
        <StageProgress stages={request.stages} currentStageId={request.currentStageId} />
      </div>

      {/* Stages */}
      <div className="space-y-3">
        <h3 className="font-medium">Approval Stages</h3>
        {request.stages.map(stage => (
          <StageCard
            key={stage.id}
            stage={stage}
            isCurrent={stage.id === request.currentStageId}
            currentUserId={currentUserId}
            onApprove={comment => handleApprove(stage.id, comment)}
            onReject={comment => handleReject(stage.id, comment)}
            onRequestChanges={comment => handleRequestChanges(stage.id, comment)}
          />
        ))}
      </div>

      {/* Comments */}
      <CommentSection
        comments={request.comments}
        onAddComment={onComment}
      />
    </div>
  );
}

// ============================================================================
// Approval Request List
// ============================================================================

export type ApprovalRequestListProps = {
  requests: ApprovalRequest[];
  onSelect: (request: ApprovalRequest) => void;
  className?: string;
};

export function ApprovalRequestList({
  requests,
  onSelect,
  className = '',
}: ApprovalRequestListProps) {
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('all');

  const filteredRequests = useMemo(() => {
    if (filter === 'all') {
      return requests;
    }
    return requests.filter(r => r.status === filter);
  }, [requests, filter]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter */}
      <div className="flex items-center gap-2">
        {(['all', 'pending', 'in_review', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`
              rounded-lg px-3 py-1.5 text-sm transition-colors
              ${filter === status
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRequests.length === 0
          ? (
              <p className="py-8 text-center text-gray-500">No requests found</p>
            )
          : (
              filteredRequests.map(request => (
                <button
                  key={request.id}
                  onClick={() => onSelect(request)}
                  className="w-full rounded-lg border bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:bg-gray-800"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{request.title}</h3>
                      <p className="text-sm text-gray-500">{request.templateName}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                      By
                      {request.submittedBy.name}
                    </span>
                    <span>{request.submittedAt.toLocaleDateString()}</span>
                  </div>
                </button>
              ))
            )}
      </div>
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default ApprovalWorkflow;
