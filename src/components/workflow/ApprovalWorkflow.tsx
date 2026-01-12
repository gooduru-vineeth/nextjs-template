'use client';

import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Clock,
  History,
  MessageSquare,
  Send,
  User,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested' | 'draft';

export type ApprovalStep = {
  id: string;
  name: string;
  approver: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: ApprovalStatus;
  comments?: string;
  timestamp?: Date;
  order: number;
};

export type ApprovalRequest = {
  id: string;
  title: string;
  description?: string;
  requestedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  currentStep: number;
  steps: ApprovalStep[];
  overallStatus: ApprovalStatus;
};

export type ApprovalWorkflowProps = {
  request: ApprovalRequest;
  currentUserId: string;
  onApprove?: (stepId: string, comments?: string) => void;
  onReject?: (stepId: string, comments: string) => void;
  onRequestChanges?: (stepId: string, comments: string) => void;
  variant?: 'full' | 'compact' | 'timeline' | 'inline';
  showComments?: boolean;
  className?: string;
};

export default function ApprovalWorkflow({
  request,
  currentUserId,
  onApprove,
  onReject,
  onRequestChanges,
  variant = 'full',
  showComments = true,
  className = '',
}: ApprovalWorkflowProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'changes' | null>(null);

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      case 'changes_requested':
        return <AlertCircle size={20} className="text-orange-500" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-500' };
      case 'rejected':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-500' };
      case 'changes_requested':
        return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500' };
      case 'pending':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-500' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-400' };
    }
  };

  const getStatusLabel = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'changes_requested':
        return 'Changes Requested';
      case 'pending':
        return 'Pending';
      default:
        return 'Draft';
    }
  };

  const currentStep = request.steps.find(s => s.order === request.currentStep);
  const isCurrentApprover = currentStep?.approver.id === currentUserId && currentStep?.status === 'pending';

  const handleAction = useCallback((action: 'approve' | 'reject' | 'changes') => {
    if (!currentStep) {
      return;
    }

    if (action === 'approve') {
      onApprove?.(currentStep.id, commentText || undefined);
    } else if (action === 'reject') {
      if (!commentText.trim()) {
        return;
      }
      onReject?.(currentStep.id, commentText);
    } else if (action === 'changes') {
      if (!commentText.trim()) {
        return;
      }
      onRequestChanges?.(currentStep.id, commentText);
    }

    setCommentText('');
    setActiveAction(null);
  }, [currentStep, commentText, onApprove, onReject, onRequestChanges]);

  // Inline variant
  if (variant === 'inline') {
    const overallColors = getStatusColor(request.overallStatus);
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {getStatusIcon(request.overallStatus)}
        <span className={`rounded-full px-2 py-1 text-sm font-medium ${overallColors.bg} ${overallColors.text}`}>
          {getStatusLabel(request.overallStatus)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Step
          {' '}
          {request.currentStep}
          {' '}
          of
          {' '}
          {request.steps.length}
        </span>
      </div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className={`${className}`}>
        <div className="relative">
          {request.steps.map((step, index) => {
            const colors = getStatusColor(step.status);
            const isLast = index === request.steps.length - 1;
            const isCurrent = step.order === request.currentStep;

            return (
              <div key={step.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center border-2 ${colors.border}`}>
                    {getStatusIcon(step.status)}
                  </div>
                  {!isLast && (
                    <div className={`h-16 w-0.5 ${
                      step.status === 'approved' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-8 ${isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{step.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.approver.name}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {getStatusLabel(step.status)}
                    </span>
                  </div>

                  {step.comments && (
                    <div className="mt-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{step.comments}</p>
                    </div>
                  )}

                  {step.timestamp && (
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      {new Date(step.timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    const overallColors = getStatusColor(request.overallStatus);
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(request.overallStatus)}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{request.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                by
                {request.requestedBy.name}
              </p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${overallColors.bg} ${overallColors.text}`}>
            {getStatusLabel(request.overallStatus)}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {request.steps.map((step, index) => {
            const colors = getStatusColor(step.status);
            return (
              <div key={step.id} className="flex flex-1 items-center gap-2">
                <div className={`h-8 w-8 rounded-full ${colors.bg} flex items-center justify-center`}>
                  {step.status === 'approved'
                    ? (
                        <CheckCircle size={16} className="text-green-500" />
                      )
                    : step.status === 'rejected'
                      ? (
                          <XCircle size={16} className="text-red-500" />
                        )
                      : (
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{index + 1}</span>
                        )}
                </div>
                {index < request.steps.length - 1 && (
                  <div className={`h-1 flex-1 rounded-full ${
                    step.status === 'approved' ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Approver Action */}
        {isCurrentApprover && (
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('approve')}
                className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => setActiveAction('reject')}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  const overallColors = getStatusColor(request.overallStatus);
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-100 p-6 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${overallColors.bg} flex items-center justify-center`}>
              {getStatusIcon(request.overallStatus)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{request.title}</h2>
              {request.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{request.description}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs text-white">
                    {request.requestedBy.avatar
                      ? (
                          <img src={request.requestedBy.avatar} alt={request.requestedBy.name} className="h-full w-full rounded-full object-cover" />
                        )
                      : (
                          request.requestedBy.name.charAt(0)
                        )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{request.requestedBy.name}</span>
                </div>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <span className={`rounded-full px-3 py-1.5 font-medium ${overallColors.bg} ${overallColors.text}`}>
            {getStatusLabel(request.overallStatus)}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 p-6">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <History size={18} />
          Approval Steps
        </h3>

        {request.steps.map((step, index) => {
          const colors = getStatusColor(step.status);
          const isCurrent = step.order === request.currentStep;
          const isExpanded = expandedStep === step.id;
          const canApprove = step.approver.id === currentUserId && step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`rounded-xl border transition-all ${
                isCurrent
                  ? `${colors.border} border-2 bg-white dark:bg-gray-800`
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                className="flex w-full items-center gap-4 p-4"
              >
                {/* Step Number */}
                <div className={`h-10 w-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                  {step.status === 'approved' || step.status === 'rejected'
                    ? (
                        getStatusIcon(step.status)
                      )
                    : (
                        <span className={`font-semibold ${colors.text}`}>{index + 1}</span>
                      )}
                </div>

                {/* Step Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{step.name}</h4>
                    {isCurrent && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs dark:bg-gray-700">
                      {step.approver.avatar
                        ? (
                            <img src={step.approver.avatar} alt={step.approver.name} className="h-full w-full rounded-full object-cover" />
                          )
                        : (
                            <User size={12} className="text-gray-500" />
                          )}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{step.approver.name}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}>
                  {getStatusLabel(step.status)}
                </span>

                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="ml-14 space-y-4 border-t border-gray-100 px-4 pt-4 pb-4 dark:border-gray-700">
                  {/* Comments */}
                  {step.comments && showComments && (
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                      <div className="mb-1 flex items-center gap-2">
                        <MessageSquare size={14} className="text-gray-400" />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Comments</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{step.comments}</p>
                    </div>
                  )}

                  {/* Timestamp */}
                  {step.timestamp && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Responded on
                      {' '}
                      {new Date(step.timestamp).toLocaleString()}
                    </p>
                  )}

                  {/* Action Buttons */}
                  {canApprove && (
                    <div className="space-y-3">
                      {activeAction && (
                        <div>
                          <textarea
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder={activeAction === 'approve' ? 'Add a comment (optional)...' : 'Please provide feedback...'}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {activeAction === null
                          ? (
                              <>
                                <button
                                  onClick={() => setActiveAction('approve')}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
                                >
                                  <CheckCircle size={16} />
                                  Approve
                                </button>
                                <button
                                  onClick={() => setActiveAction('changes')}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600"
                                >
                                  <AlertCircle size={16} />
                                  Request Changes
                                </button>
                                <button
                                  onClick={() => setActiveAction('reject')}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600"
                                >
                                  <XCircle size={16} />
                                  Reject
                                </button>
                              </>
                            )
                          : (
                              <>
                                <button
                                  onClick={() => setActiveAction(null)}
                                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleAction(activeAction)}
                                  disabled={activeAction !== 'approve' && !commentText.trim()}
                                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                                    activeAction === 'approve'
                                      ? 'bg-green-500 hover:bg-green-600'
                                      : activeAction === 'reject'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-orange-500 hover:bg-orange-600'
                                  }`}
                                >
                                  <Send size={16} />
                                  Submit
                                  {' '}
                                  {activeAction === 'approve' ? 'Approval' : activeAction === 'reject' ? 'Rejection' : 'Changes'}
                                </button>
                              </>
                            )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
