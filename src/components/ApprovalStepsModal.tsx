import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle, XCircle, Clock, User, Calendar, 
  MessageSquare, ChevronRight, AlertTriangle, Users,
  Shield, Crown, Wrench
} from 'lucide-react';
import { WorkflowAgent, ApprovalStep } from '../types/marketplace';

interface ApprovalStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: WorkflowAgent | null;
  onUpdateApproval?: (stepId: string, status: 'Approved' | 'Rejected', notes: string) => void;
}

const ApprovalStepsModal: React.FC<ApprovalStepsModalProps> = ({
  isOpen,
  onClose,
  workflow,
  onUpdateApproval
}) => {
  const [selectedStep, setSelectedStep] = useState<ApprovalStep | null>(null);
  const [notes, setNotes] = useState('');

  if (!isOpen || !workflow) return null;

  const getStepIcon = (category: string) => {
    switch (category) {
      case 'Builder':
        return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'Manager':
        return <Users className="w-5 h-5 text-orange-500" />;
      case 'Admin':
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Builder':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'Manager':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'Admin':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const groupedSteps = workflow.approvalSteps.reduce((acc, step) => {
    if (!acc[step.category]) {
      acc[step.category] = [];
    }
    acc[step.category].push(step);
    return acc;
  }, {} as Record<string, ApprovalStep[]>);

  const getProgressPercentage = () => {
    const totalSteps = workflow.approvalSteps.length;
    const completedSteps = workflow.approvalSteps.filter(step => 
      step.status === 'Approved' || step.status === 'Rejected'
    ).length;
    return (completedSteps / totalSteps) * 100;
  };

  const handleApprovalAction = (step: ApprovalStep, action: 'Approved' | 'Rejected') => {
    if (onUpdateApproval) {
      onUpdateApproval(step.id, action, notes);
    }
    setSelectedStep(null);
    setNotes('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-card-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                  30-Step Approval Process
                </h2>
                <p className="text-gray-600 dark:text-text-muted mt-1">
                  {workflow.name} • v{workflow.currentVersion}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-text-muted">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-text-muted">
                  {workflow.approvalSteps.filter(s => s.status === 'Approved').length} / {workflow.approvalSteps.length} approved
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-secondary rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="space-y-6">
              {Object.entries(groupedSteps).map(([category, steps]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 ${getCategoryColor(category)}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {getStepIcon(category)}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                      {category} Review ({steps.length} steps)
                    </h3>
                    <div className="flex-1 flex justify-end">
                      <span className="text-sm text-gray-600 dark:text-text-muted">
                        {steps.filter(s => s.status === 'Approved').length} / {steps.length} completed
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedStep(step)}
                        className="bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
                            Step {step.stepNumber}
                          </span>
                          {getStatusIcon(step.status)}
                        </div>
                        
                        <div className="space-y-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                          
                          {step.reviewerName && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-text-muted">
                              <User className="w-3 h-3" />
                              <span>{step.reviewerName}</span>
                            </div>
                          )}
                          
                          {step.timestamp && (
                            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-text-muted">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(step.timestamp).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step Detail Modal */}
          <AnimatePresence>
            {selectedStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                onClick={() => setSelectedStep(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-md w-full p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                      Step {selectedStep.stepNumber} Details
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedStep(null)}
                      className="p-1 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getStepIcon(selectedStep.category)}
                      <div>
                        <span className="font-medium text-gray-900 dark:text-text-primary">
                          {selectedStep.category} Review
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(selectedStep.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStep.status)}`}>
                            {selectedStep.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedStep.reviewerName && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                        <User className="w-4 h-4" />
                        <span>Reviewed by: {selectedStep.reviewerName}</span>
                      </div>
                    )}

                    {selectedStep.timestamp && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                        <Calendar className="w-4 h-4" />
                        <span>Date: {new Date(selectedStep.timestamp).toLocaleString()}</span>
                      </div>
                    )}

                    {selectedStep.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                          Notes
                        </label>
                        <div className="p-3 bg-gray-50 dark:bg-secondary rounded-lg text-sm text-gray-900 dark:text-text-primary">
                          {selectedStep.notes}
                        </div>
                      </div>
                    )}

                    {selectedStep.status === 'Pending' && onUpdateApproval && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                            Review Notes
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary resize-none"
                            placeholder="Add review notes..."
                          />
                        </div>

                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprovalAction(selectedStep, 'Approved')}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprovalAction(selectedStep, 'Rejected')}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApprovalStepsModal;