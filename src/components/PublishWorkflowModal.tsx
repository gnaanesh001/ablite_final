import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, DollarSign, Users, User, Shield, 
  FileText, Tag, Building2, CheckCircle, AlertCircle,
  Zap, Crown, Globe, Image, Brain, GitBranch, Code,
  MessageSquare, Database, Repeat, Eye
} from 'lucide-react';
import { WorkflowAgent, GroupConfig, TagConfig } from '../types/marketplace';

interface PublishWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (workflow: Partial<WorkflowAgent>) => void;
  groups: GroupConfig[];
  tags: TagConfig[];
}

const agenticPatterns = [
  { id: 'ReAct', name: 'ReAct', description: 'Reasoning and Acting', icon: Brain, color: 'bg-blue-500' },
  { id: 'RAG', name: 'RAG', description: 'Retrieval Augmented Generation', icon: Database, color: 'bg-green-500' },
  { id: 'Multi-Agent', name: 'Multi-Agent', description: 'Collaborative agents', icon: Users, color: 'bg-purple-500' },
  { id: 'CodeAct', name: 'CodeAct', description: 'Code generation agent', icon: Code, color: 'bg-orange-500' },
  { id: 'Tool-Use', name: 'Tool-Use', description: 'Advanced tool calling', icon: Zap, color: 'bg-yellow-500' },
  { id: 'Reflection', name: 'Reflection', description: 'Self-improving agent', icon: Repeat, color: 'bg-pink-500' },
];

const PublishWorkflowModal: React.FC<PublishWorkflowModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  groups,
  tags
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedTags: [] as string[],
    group: groups[0]?.id || '',
    approvalPath: 'Manager' as 'Admin' | 'Manager',
    agenticPattern: 'ReAct' as string,
    monetizationEnabled: false,
    monetizationType: 'Free' as 'Free' | 'Tiered' | 'Pay-per-use',
    price: 0,
    agentType: 'Single Agent' as 'Single Agent' | 'Agent Team',
    teamRoles: '',
    workflowFile: null as File | null,
    previewImage: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.selectedTags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (formData.monetizationEnabled && formData.monetizationType !== 'Free' && formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.agentType === 'Agent Team' && !formData.teamRoles.trim()) {
      newErrors.teamRoles = 'Team roles are required for Agent Team type';
    }

    if (!formData.workflowFile) {
      newErrors.workflowFile = 'Workflow file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsUploading(true);

    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate approval steps (30 total: 10 Builder, 10 Manager, 10 Admin)
      const approvalSteps = [];
      const categories = ['Builder', 'Manager', 'Admin'];
      
      categories.forEach((category, categoryIndex) => {
        for (let i = 1; i <= 10; i++) {
          approvalSteps.push({
            id: `step-${categoryIndex * 10 + i}`,
            stepNumber: categoryIndex * 10 + i,
            category: category as 'Builder' | 'Manager' | 'Admin',
            status: 'Pending' as const,
            required: true
          });
        }
      });

      const workflow: Partial<WorkflowAgent> = {
        name: formData.name,
        description: formData.description,
        tags: formData.selectedTags,
        group: formData.group,
        status: 'Draft',
        approvalPath: formData.approvalPath,
        agenticPattern: formData.agenticPattern as any,
        monetization: {
          enabled: formData.monetizationEnabled,
          type: formData.monetizationType,
          price: formData.monetizationType !== 'Free' ? formData.price : undefined
        },
        currentVersion: '1.0.0',
        versions: [{
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          createdBy: 'Current User',
          changes: 'Initial version',
          isActive: true
        }],
        workflow: {
          nodes: [], // Would be populated from uploaded file
          edges: [],
          json: formData.workflowFile ? await formData.workflowFile.text() : ''
        },
        analytics: {
          views: 0,
          deployments: 0,
          rating: 0,
          reviews: 0,
          revenue: 0,
          conversionRate: 0,
          timeToApproval: 0,
          usageOverTime: []
        },
        metadata: {
          createdBy: 'Current User',
          modifiedBy: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodeCount: 0,
          agentType: formData.agentType,
          teamRoles: formData.agentType === 'Agent Team' 
            ? formData.teamRoles.split(',').map(role => role.trim())
            : undefined,
          previewImage: formData.previewImage ? URL.createObjectURL(formData.previewImage) : undefined
        },
        auditTrail: [{
          id: `audit-${Date.now()}`,
          action: 'Created',
          user: 'Current User',
          timestamp: new Date().toISOString(),
          details: 'Workflow created and submitted for approval'
        }],
        approvalSteps
      };

      onPublish(workflow);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        selectedTags: [],
        group: groups[0]?.id || '',
        approvalPath: 'Manager',
        agenticPattern: 'ReAct',
        monetizationEnabled: false,
        monetizationType: 'Free',
        price: 0,
        agentType: 'Single Agent',
        teamRoles: '',
        workflowFile: null,
        previewImage: null
      });
    } catch (error) {
      console.error('Error publishing workflow:', error);
    } finally {
      setIsUploading(false);
    }
  }, [formData, validateForm, onPublish, onClose, groups]);

  const handleFileUpload = useCallback((file: File, type: 'workflow' | 'preview') => {
    if (type === 'workflow') {
      setFormData(prev => ({ ...prev, workflowFile: file }));
    } else {
      setFormData(prev => ({ ...prev, previewImage: file }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, type: 'workflow' | 'preview') => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const toggleTag = useCallback((tagId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }));
  }, []);

  if (!isOpen) return null;

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
          className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                Publish Workflow
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Basic Information</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Agent Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary ${
                          errors.name ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                        }`}
                        placeholder="Enter agent name..."
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Description *
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary resize-none ${
                          errors.description ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                        }`}
                        placeholder="Describe what this agent does..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.description}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Tags * (select multiple)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <motion.button
                            key={tag.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              formData.selectedTags.includes(tag.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted hover:bg-gray-200 dark:hover:bg-card-bg'
                            }`}
                          >
                            {tag.name}
                          </motion.button>
                        ))}
                      </div>
                      {errors.tags && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.tags}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                          Group
                        </label>
                        <select
                          value={formData.group}
                          onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
                        >
                          {groups.map(group => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                          Approval Path
                        </label>
                        <select
                          value={formData.approvalPath}
                          onChange={(e) => setFormData(prev => ({ ...prev, approvalPath: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
                        >
                          <option value="Manager">Manager</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agentic Pattern Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4 flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Agentic Pattern</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {agenticPatterns.map(pattern => {
                      const Icon = pattern.icon;
                      return (
                        <motion.button
                          key={pattern.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, agenticPattern: pattern.id }))}
                          className={`p-4 border rounded-lg text-left transition-colors ${
                            formData.agenticPattern === pattern.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-card-border hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${pattern.color} text-white`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-text-primary">{pattern.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-text-muted">{pattern.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* File Uploads */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4 flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Files</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Workflow File */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Workflow JSON *
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-card-border'
                        } ${errors.workflowFile ? 'border-red-500' : ''}`}
                        onDrop={(e) => handleDrop(e, 'workflow')}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <Upload className="w-8 h-8 text-gray-400 dark:text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-text-muted mb-2">
                          Drop JSON file or click to upload
                        </p>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'workflow')}
                          className="hidden"
                          id="workflow-upload"
                        />
                        <label
                          htmlFor="workflow-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                          Choose File
                        </label>
                        {formData.workflowFile && (
                          <p className="mt-2 text-sm text-green-600 flex items-center justify-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{formData.workflowFile.name}</span>
                          </p>
                        )}
                      </div>
                      {errors.workflowFile && (
                        <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.workflowFile}</span>
                        </p>
                      )}
                    </div>

                    {/* Preview Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Preview Image (optional)
                      </label>
                      <div
                        className="border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg p-6 text-center"
                        onDrop={(e) => handleDrop(e, 'preview')}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                      >
                        <Image className="w-8 h-8 text-gray-400 dark:text-text-muted mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-text-muted mb-2">
                          Drop image or click to upload
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'preview')}
                          className="hidden"
                          id="preview-upload"
                        />
                        <label
                          htmlFor="preview-upload"
                          className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          Choose Image
                        </label>
                        {formData.previewImage && (
                          <p className="mt-2 text-sm text-green-600 flex items-center justify-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{formData.previewImage.name}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Advanced Settings */}
              <div className="space-y-6">
                {/* Agent Type */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Agent Configuration</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Agent Type
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, agentType: 'Single Agent' }))}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.agentType === 'Single Agent'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted hover:border-blue-500'
                          }`}
                        >
                          <User className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">Single Agent</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, agentType: 'Agent Team' }))}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            formData.agentType === 'Agent Team'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : 'border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted hover:border-blue-500'
                          }`}
                        >
                          <Users className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-medium">Agent Team</span>
                        </motion.button>
                      </div>
                    </div>

                    {formData.agentType === 'Agent Team' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                          Team Roles * (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.teamRoles}
                          onChange={(e) => setFormData(prev => ({ ...prev, teamRoles: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary ${
                            errors.teamRoles ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                          }`}
                          placeholder="researcher, writer, reviewer"
                        />
                        {errors.teamRoles && (
                          <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.teamRoles}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Monetization */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Monetization</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-text-muted">
                        Enable Monetization
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          monetizationEnabled: !prev.monetizationEnabled,
                          monetizationType: !prev.monetizationEnabled ? 'Free' : prev.monetizationType
                        }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          formData.monetizationEnabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.monetizationEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </motion.button>
                    </div>

                    {formData.monetizationEnabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                            Pricing Model
                          </label>
                          <div className="grid grid-cols-1 gap-2">
                            {['Free', 'Tiered', 'Pay-per-use'].map((type) => (
                              <motion.button
                                key={type}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData(prev => ({ ...prev, monetizationType: type as any }))}
                                className={`p-2 border rounded-lg text-center transition-colors ${
                                  formData.monetizationType === type
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                    : 'border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted hover:border-blue-500'
                                }`}
                              >
                                <span className="text-sm font-medium">{type}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {formData.monetizationType !== 'Free' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary ${
                                errors.price ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                              }`}
                              placeholder="0.00"
                            />
                            {errors.price && (
                              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.price}</span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3 flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Version:</span>
                      <span className="font-medium text-gray-900 dark:text-text-primary">v1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Status:</span>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-full text-xs">
                        Draft
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Pattern:</span>
                      <span className="font-medium text-gray-900 dark:text-text-primary">{formData.agenticPattern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Monetization:</span>
                      <span className="font-medium text-gray-900 dark:text-text-primary">
                        {formData.monetizationEnabled 
                          ? `${formData.monetizationType}${formData.monetizationType !== 'Free' ? ` ($${formData.price})` : ''}`
                          : 'Disabled'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-card-border">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isUploading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Publish Workflow</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PublishWorkflowModal;