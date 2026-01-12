'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Clock,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

type Reviewer = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: ApprovalStatus;
  comment?: string;
  reviewedAt?: string;
};

type ApprovalRequest = {
  id: string;
  title: string;
  description: string;
  mockupId: string;
  mockupName: string;
  mockupThumbnail?: string;
  status: ApprovalStatus;
  priority: Priority;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  deadline?: string;
  reviewers: Reviewer[];
  comments: ApprovalComment[];
  version: number;
};

type ApprovalComment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
};

type WorkflowStep = {
  id: string;
  name: string;
  description: string;
  reviewers: string[];
  requireAll: boolean;
  order: number;
};

type ApprovalWorkflowProps = {
  variant?: 'full' | 'compact' | 'widget';
  onApprove?: (requestId: string, comment?: string) => void;
  onReject?: (requestId: string, comment: string) => void;
  onRequestChanges?: (requestId: string, comment: string) => void;
  onCreateRequest?: (request: Partial<ApprovalRequest>) => void;
  className?: string;
};

// Mock data
const mockRequests: ApprovalRequest[] = [
  {
    id: 'req-1',
    title: 'Homepage Redesign',
    description: 'Updated hero section with new brand colors',
    mockupId: 'mockup-1',
    mockupName: 'Homepage Hero v2',
    status: 'pending',
    priority: 'high',
    createdBy: { id: 'user-1', name: 'Alice Chen' },
    createdAt: '2024-01-15T10:00:00Z',
    deadline: '2024-01-20T18:00:00Z',
    version: 2,
    reviewers: [
      { id: 'r-1', name: 'Bob Smith', email: 'bob@example.com', role: 'Design Lead', status: 'approved', reviewedAt: '2024-01-15T14:30:00Z' },
      { id: 'r-2', name: 'Carol White', email: 'carol@example.com', role: 'Product Manager', status: 'pending' },
    ],
    comments: [
      { id: 'c-1', userId: 'r-1', userName: 'Bob Smith', content: 'Looks great! Approved.', createdAt: '2024-01-15T14:30:00Z' },
    ],
  },
  {
    id: 'req-2',
    title: 'Mobile App Onboarding',
    description: 'New user onboarding flow mockups',
    mockupId: 'mockup-2',
    mockupName: 'Onboarding Screens',
    status: 'changes_requested',
    priority: 'medium',
    createdBy: { id: 'user-2', name: 'David Lee' },
    createdAt: '2024-01-14T09:00:00Z',
    version: 1,
    reviewers: [
      { id: 'r-3', name: 'Eve Brown', email: 'eve@example.com', role: 'UX Lead', status: 'changes_requested', comment: 'Please adjust the CTA button contrast', reviewedAt: '2024-01-14T16:00:00Z' },
    ],
    comments: [
      { id: 'c-2', userId: 'r-3', userName: 'Eve Brown', content: 'The CTA button needs more contrast for accessibility.', createdAt: '2024-01-14T16:00:00Z' },
    ],
  },
  {
    id: 'req-3',
    title: 'Email Campaign Template',
    description: 'Q1 newsletter design',
    mockupId: 'mockup-3',
    mockupName: 'Newsletter Q1',
    status: 'approved',
    priority: 'low',
    createdBy: { id: 'user-1', name: 'Alice Chen' },
    createdAt: '2024-01-12T11:00:00Z',
    version: 3,
    reviewers: [
      { id: 'r-4', name: 'Frank Green', email: 'frank@example.com', role: 'Marketing Director', status: 'approved', reviewedAt: '2024-01-13T10:00:00Z' },
    ],
    comments: [],
  },
];

const mockWorkflowSteps: WorkflowStep[] = [
  { id: 'step-1', name: 'Design Review', description: 'Initial review by design team', reviewers: ['Design Lead', 'UX Lead'], requireAll: false, order: 1 },
  { id: 'step-2', name: 'Stakeholder Approval', description: 'Final approval from stakeholders', reviewers: ['Product Manager', 'Marketing Director'], requireAll: true, order: 2 },
];

export default function ApprovalWorkflow({
  variant = 'full',
  onApprove,
  onReject,
  onRequestChanges,
  onCreateRequest,
  className = '',
}: ApprovalWorkflowProps) {
  const [requests] = useState<ApprovalRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  const getStatusColor = useCallback((status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'changes_requested': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  }, []);

  const getStatusIcon = useCallback((status: ApprovalStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'changes_requested': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-yellow-500';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase())
      || req.mockupName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = useCallback(() => {
    if (selectedRequest) {
      onApprove?.(selectedRequest.id, commentText);
      setCommentText('');
    }
  }, [selectedRequest, commentText, onApprove]);

  const handleReject = useCallback(() => {
    if (selectedRequest && commentText.trim()) {
      onReject?.(selectedRequest.id, commentText);
      setCommentText('');
    }
  }, [selectedRequest, commentText, onReject]);

  const handleRequestChanges = useCallback(() => {
    if (selectedRequest && commentText.trim()) {
      onRequestChanges?.(selectedRequest.id, commentText);
      setCommentText('');
    }
  }, [selectedRequest, commentText, onRequestChanges]);

  void onCreateRequest;
  void showNewRequestModal;
  void setShowNewRequestModal;
  void mockWorkflowSteps;

  // Widget variant
  if (variant === 'widget') {
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Approvals</span>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              {pendingCount}
              {' '}
              pending
            </span>
          )}
        </div>
        <div className="space-y-1">
          {requests.slice(0, 3).map(req => (
            <div key={req.id} className="flex items-center gap-2 text-xs">
              {getStatusIcon(req.status)}
              <span className="truncate text-gray-600 dark:text-gray-400">{req.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Pending Approvals</h3>
          <span className="text-sm text-gray-500">
            {filteredRequests.length}
            {' '}
            items
          </span>
        </div>
        <div className="space-y-2">
          {filteredRequests.slice(0, 5).map(req => (
            <div
              key={req.id}
              className={`cursor-pointer rounded-lg border-l-4 bg-gray-50 p-3 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 ${getPriorityColor(req.priority)}`}
              onClick={() => setSelectedRequest(req)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{req.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${getStatusColor(req.status)}`}>
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {req.createdBy.name}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {req.reviewers.filter(r => r.status === 'approved').length}
                  /
                  {req.reviewers.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Approval Workflow</h2>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as ApprovalStatus | 'all')}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="changes_requested">Changes Requested</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Request List */}
        <div className="max-h-[600px] w-1/3 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className={`cursor-pointer border-b border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                selectedRequest?.id === req.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{req.title}</span>
                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${getStatusColor(req.status)}`}>
                  {getStatusIcon(req.status)}
                  {req.status.replace('_', ' ')}
                </span>
              </div>
              <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{req.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  by
                  {req.createdBy.name}
                </span>
                <span>
                  v
                  {req.version}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Request Details */}
        <div className="flex-1 p-6">
          {selectedRequest ? (
            <div className="space-y-6">
              {/* Request Info */}
              <div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{selectedRequest.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedRequest.description}</p>
              </div>

              {/* Mockup Preview */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm text-gray-500">Mockup</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedRequest.mockupName}</p>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                    View
                    {' '}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Reviewers */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Reviewers</h4>
                <div className="space-y-2">
                  {selectedRequest.reviewers.map(reviewer => (
                    <div key={reviewer.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{reviewer.name}</p>
                          <p className="text-xs text-gray-500">{reviewer.role}</p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getStatusColor(reviewer.status)}`}>
                        {getStatusIcon(reviewer.status)}
                        {reviewer.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Comments</h4>
                <div className="mb-4 space-y-3">
                  {selectedRequest.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <button
                    onClick={handleApprove}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={handleRequestChanges}
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Request Changes
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              )}

              {/* Workflow Progress */}
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Workflow Progress</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" />
                    Design Review
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <Clock className="h-3 w-3" />
                    Stakeholder Approval
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <CheckCircle className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p>Select a request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export type { ApprovalRequest, ApprovalStatus, ApprovalWorkflowProps, Reviewer, WorkflowStep };
