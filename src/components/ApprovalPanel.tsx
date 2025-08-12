import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, Clock, User, Calendar, 
  MessageSquare, Eye, FileText, AlertTriangle,
  ThumbsUp, ThumbsDown, History
} from 'lucide-react';
import { ApprovalRequest, WorkflowAgent } from '../types/marketplace';

interface ApprovalPanelProps {
  approvalRequests: ApprovalRequest[];
  workflows: WorkflowAgent[];
  onApprove: (requestId: string, notes?: string) => void;
  onReject: (requestId: string, notes: string) => void;
  onPreview: (workflow: WorkflowAgent) => void;
}

const ApprovalPanel: React.FC<ApprovalPanelProps> = ({
  approvalRequests,
  workflows,
  onApprove,
  onReject,
  onPreview
}) => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [showAuditTrail, setShowAuditTrail] = useState<string | null>(null);

  const pendingRequests = approvalRequests.filter(req => req.status === 'Pending');
  const completedRequests = approvalRequests.filter(req => req.status !== 'Pending');

  const handleAction = useCallback((requestId: string, type: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setActionType(type);
    setNotes('');
  }, []);

  const confirmAction = useCallback(() => {
    if (!selectedRequest || !actionType) return;

    if (actionType === 'approve') {
      onApprove(selectedRequest, notes);
    } else {
      if (!notes.trim()) {
        alert('Rejection reason is required');
        return;
      }
      onReject(selectedRequest, notes);
    }

    setSelectedRequest(null);
    setActionType(null);
    setNotes('');
  }, [selectedRequest, actionType, notes, onApprove, onReject]);

  const getWorkflowById = useCallback((workflowId: string) => {
    return workflows.find(w => w.id === workflowId);
  }, [workflows]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span>Pending Approvals</span>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-sm">
              {pendingRequests.length}
            </span>
          </h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">
              All caught up!
            </h4>
            <p className="text-gray-600 dark:text-text-muted">
              No pending approvals at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const workflow = getWorkflowById(request.workflowId);
              
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 dark:border-card-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">
                          {request.workflowName}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {workflow?.metadata.agentType === 'Agent Team' && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                            Team
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-text-muted mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Requested by: {request.requestedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(request.requestedAt)}</span>
                        </div>
                      </div>

                      {workflow && (
                        <div className="text-sm text-gray-600 dark:text-text-muted mb-3">
                          <p className="line-clamp-2">{workflow.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span>Version: {workflow.currentVersion}</span>
                            <span>Nodes: {workflow.metadata.nodeCount}</span>
                            <span>Group: {workflow.group}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {workflow && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onPreview(workflow)}
                          className="p-2 text-gray-600 dark:text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Preview Workflow"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAuditTrail(request.workflowId)}
                        className="p-2 text-gray-600 dark:text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View Audit Trail"
                      >
                        <History className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(request.id, 'approve')}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Approve</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(request.id, 'reject')}
                        className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>Reject</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Decisions */}
      {completedRequests.length > 0 && (
        <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-6 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Recent Decisions</span>
          </h3>

          <div className="space-y-3">
            {completedRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-secondary rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <span className="font-medium text-gray-900 dark:text-text-primary">
                      {request.workflowName}
                    </span>
                    <div className="text-sm text-gray-600 dark:text-text-muted">
                      {request.status} by {request.approver} • {formatDate(request.approvedAt || request.requestedAt)}
                    </div>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {selectedRequest && actionType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setSelectedRequest(null);
              setActionType(null);
              setNotes('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                {actionType === 'approve' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                  {actionType === 'approve' ? 'Approve Workflow' : 'Reject Workflow'}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-text-muted mb-4">
                {actionType === 'approve' 
                  ? 'Are you sure you want to approve this workflow? It will be published to the marketplace.'
                  : 'Please provide a reason for rejecting this workflow.'
                }
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                  {actionType === 'approve' ? 'Notes (optional)' : 'Rejection Reason *'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary resize-none"
                  placeholder={actionType === 'approve' 
                    ? 'Add any notes about this approval...'
                    : 'Explain why this workflow is being rejected...'
                  }
                />
              </div>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                    setNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAction}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audit Trail Modal */}
      <AnimatePresence>
        {showAuditTrail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAuditTrail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary flex items-center space-x-2">
                  <History className="w-5 h-5" />
                  <span>Audit Trail</span>
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAuditTrail(null)}
                  className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                >
                  ×
                </motion.button>
              </div>

              {(() => {
                const workflow = getWorkflowById(showAuditTrail);
                if (!workflow) return <p>Workflow not found</p>;

                return (
                  <div className="space-y-4">
                    {workflow.auditTrail.map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg"
                      >
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900 dark:text-text-primary">
                              {entry.action}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-text-muted">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-text-muted mb-1">
                            {entry.details}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-text-muted">
                            by {entry.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApprovalPanel;