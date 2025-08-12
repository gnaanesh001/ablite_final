import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, Grid3X3, List, MoreHorizontal,
  Star, Eye, Rocket, Edit3, Copy, Trash2, Download,
  Settings, BarChart3, Users, CheckCircle, Clock,
  XCircle, AlertTriangle, Crown, Shield, Zap, Brain,
  GitBranch, Code, MessageSquare, Database, Repeat,
  TrendingUp, DollarSign, Calendar, Tag as TagIcon,
  Building2, SortAsc, SortDesc, RefreshCw, Share2
} from 'lucide-react';
import PublishWorkflowModal from '../components/PublishWorkflowModal';
import WorkflowPreviewModal from '../components/WorkflowPreviewModal';
import ManageGroupsModal from '../components/ManageGroupsModal';
import ApprovalStepsModal from '../components/ApprovalStepsModal';
import AnalyticsPanel from '../components/AnalyticsPanel';
import ApprovalPanel from '../components/ApprovalPanel';
import { 
  WorkflowAgent, 
  FilterState, 
  GroupConfig, 
  TagConfig,
  AnalyticsData,
  ApprovalRequest
} from '../types/marketplace';

// Mock data
const initialGroups: GroupConfig[] = [
  { id: 'finance', name: 'Finance', icon: 'Finance', color: 'text-green-600', editable: false, count: 8 },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart', color: 'text-red-500', editable: false, count: 12 },
  { id: 'retail', name: 'Retail', icon: 'Shopping', color: 'text-blue-500', editable: false, count: 6 },
  { id: 'education', name: 'Education', icon: 'Education', color: 'text-purple-500', editable: false, count: 4 },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'Building', color: 'text-orange-500', editable: false, count: 7 },
  { id: 'legal', name: 'Legal', icon: 'Briefcase', color: 'text-gray-600', editable: false, count: 3 },
];

const initialTags: TagConfig[] = [
  { id: 'nlp', name: 'NLP', color: 'bg-blue-100 text-blue-800', count: 15 },
  { id: 'automation', name: 'Automation', color: 'bg-green-100 text-green-800', count: 22 },
  { id: 'analytics', name: 'Analytics', color: 'bg-purple-100 text-purple-800', count: 18 },
  { id: 'customer-service', name: 'Customer Service', color: 'bg-orange-100 text-orange-800', count: 12 },
  { id: 'data-processing', name: 'Data Processing', color: 'bg-indigo-100 text-indigo-800', count: 9 },
  { id: 'reporting', name: 'Reporting', color: 'bg-pink-100 text-pink-800', count: 7 },
  { id: 'integration', name: 'Integration', color: 'bg-yellow-100 text-yellow-800', count: 14 },
  { id: 'security', name: 'Security', color: 'bg-red-100 text-red-800', count: 6 },
];

const generateMockWorkflows = (): WorkflowAgent[] => {
  const patterns = ['ReAct', 'RAG', 'Multi-Agent', 'CodeAct', 'Tool-Use', 'Reflection'];
  const statuses = ['Draft', 'Pending Approval', 'Approved', 'Published'];
  const groups = initialGroups.map(g => g.id);
  const tagIds = initialTags.map(t => t.id);
  
  return Array.from({ length: 40 }, (_, i) => {
    const pattern = patterns[i % patterns.length];
    const status = statuses[i % statuses.length];
    const group = groups[i % groups.length];
    const selectedTags = tagIds.slice(0, Math.floor(Math.random() * 4) + 1);
    
    // Generate 30 approval steps
    const approvalSteps = [];
    const categories = ['Builder', 'Manager', 'Admin'];
    
    categories.forEach((category, categoryIndex) => {
      for (let j = 1; j <= 10; j++) {
        const stepNumber = categoryIndex * 10 + j;
        const stepStatus = stepNumber <= (i * 3) ? 'Approved' : 
                          stepNumber === (i * 3) + 1 ? 'Pending' : 'Pending';
        
        approvalSteps.push({
          id: `step-${i}-${stepNumber}`,
          stepNumber,
          category: category as 'Builder' | 'Manager' | 'Admin',
          status: stepStatus as 'Pending' | 'Approved' | 'Rejected',
          reviewerName: stepStatus === 'Approved' ? `${category} User ${j}` : undefined,
          timestamp: stepStatus === 'Approved' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          notes: stepStatus === 'Approved' ? 'Approved after review' : undefined,
          required: true
        });
      }
    });

    return {
      id: `workflow-${i + 1}`,
      name: `${pattern} Agent ${i + 1}`,
      description: `Advanced ${pattern.toLowerCase()} agent for ${group} automation and intelligent processing`,
      tags: selectedTags,
      group,
      status: status as any,
      approvalPath: i % 2 === 0 ? 'Manager' : 'Admin',
      agenticPattern: pattern as any,
      monetization: {
        enabled: i % 3 === 0,
        type: i % 3 === 0 ? (i % 2 === 0 ? 'Tiered' : 'Pay-per-use') : 'Free',
        price: i % 3 === 0 ? Math.floor(Math.random() * 100) + 10 : undefined
      },
      versions: [{
        version: '1.0.0',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'User Name',
        changes: 'Initial version',
        isActive: true
      }],
      currentVersion: '1.0.0',
      workflow: {
        nodes: [],
        edges: [],
        json: `{"pattern": "${pattern}", "nodes": [], "edges": []}`
      },
      analytics: {
        views: Math.floor(Math.random() * 1000) + 50,
        deployments: Math.floor(Math.random() * 100) + 5,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        reviews: Math.floor(Math.random() * 50) + 5,
        revenue: i % 3 === 0 ? Math.floor(Math.random() * 10000) + 500 : 0,
        conversionRate: Math.round(Math.random() * 30 + 10),
        timeToApproval: Math.floor(Math.random() * 48) + 2,
        usageOverTime: Array.from({ length: 30 }, (_, day) => ({
          date: new Date(Date.now() - (29 - day) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          count: Math.floor(Math.random() * 20) + 1
        }))
      },
      metadata: {
        createdBy: 'User Name',
        modifiedBy: 'User Name',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nodeCount: Math.floor(Math.random() * 10) + 3,
        agentType: i % 4 === 0 ? 'Agent Team' : 'Single Agent',
        teamRoles: i % 4 === 0 ? ['researcher', 'analyst', 'writer'] : undefined
      },
      auditTrail: [{
        id: `audit-${i}`,
        action: 'Created',
        user: 'User Name',
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Workflow created and submitted for approval'
      }],
      approvalSteps
    };
  });
};

const Marketplace: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowAgent[]>(generateMockWorkflows());
  const [groups, setGroups] = useState<GroupConfig[]>(initialGroups);
  const [tags, setTags] = useState<TagConfig[]>(initialTags);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'approvals' | 'analytics'>('marketplace');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showApprovalSteps, setShowApprovalSteps] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowAgent | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    group: '',
    tags: [],
    status: '',
    agenticPattern: '',
    sortBy: 'updated',
    sortOrder: 'desc',
    groupBy: 'industry'
  });

  // Filter and sort workflows
  const filteredWorkflows = useMemo(() => {
    let filtered = workflows.filter(workflow => {
      const matchesSearch = !filters.search || 
        workflow.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesGroup = !filters.group || workflow.group === filters.group;
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some(tag => workflow.tags.includes(tag));
      const matchesStatus = !filters.status || workflow.status === filters.status;
      const matchesPattern = !filters.agenticPattern || workflow.agenticPattern === filters.agenticPattern;
      
      return matchesSearch && matchesGroup && matchesTags && matchesStatus && matchesPattern;
    });

    // Sort workflows
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'rating':
          aValue = a.analytics.rating;
          bValue = b.analytics.rating;
          break;
        case 'deployments':
          aValue = a.analytics.deployments;
          bValue = b.analytics.deployments;
          break;
        case 'revenue':
          aValue = a.analytics.revenue;
          bValue = b.analytics.revenue;
          break;
        case 'updated':
          aValue = new Date(a.metadata.updatedAt).getTime();
          bValue = new Date(b.metadata.updatedAt).getTime();
          break;
        default:
          return 0;
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [workflows, filters]);

  // Group workflows
  const groupedWorkflows = useMemo(() => {
    if (filters.groupBy === 'industry') {
      return groups.reduce((acc, group) => {
        acc[group.name] = filteredWorkflows.filter(w => w.group === group.id);
        return acc;
      }, {} as Record<string, WorkflowAgent[]>);
    } else if (filters.groupBy === 'pattern') {
      return filteredWorkflows.reduce((acc, workflow) => {
        if (!acc[workflow.agenticPattern]) {
          acc[workflow.agenticPattern] = [];
        }
        acc[workflow.agenticPattern].push(workflow);
        return acc;
      }, {} as Record<string, WorkflowAgent[]>);
    }
    return { 'All Workflows': filteredWorkflows };
  }, [filteredWorkflows, groups, filters.groupBy]);

  // Analytics data
  const analyticsData: AnalyticsData = useMemo(() => {
    const topByUsage = [...workflows]
      .sort((a, b) => b.analytics.deployments - a.analytics.deployments)
      .slice(0, 10);
    
    const topByRevenue = [...workflows]
      .sort((a, b) => b.analytics.revenue - a.analytics.revenue)
      .slice(0, 10);

    const groupBreakdown = groups.reduce((acc, group) => {
      const groupWorkflows = workflows.filter(w => w.group === group.id);
      acc[group.name] = {
        count: groupWorkflows.length,
        revenue: groupWorkflows.reduce((sum, w) => sum + w.analytics.revenue, 0),
        deployments: groupWorkflows.reduce((sum, w) => sum + w.analytics.deployments, 0)
      };
      return acc;
    }, {} as Record<string, any>);

    return {
      topAgents: {
        byUsage: topByUsage,
        byRevenue: topByRevenue
      },
      groupBreakdown,
      deploymentTrends: [
        { period: 'Week 1', deployments: 45, revenue: 12500 },
        { period: 'Week 2', deployments: 52, revenue: 15200 },
        { period: 'Week 3', deployments: 38, revenue: 9800 },
        { period: 'Week 4', deployments: 61, revenue: 18900 },
      ],
      approvalMetrics: {
        averageLatency: 24,
        pendingCount: workflows.filter(w => w.status === 'Pending Approval').length,
        approvalRate: 0.87
      }
    };
  }, [workflows, groups]);

  // Approval requests
  const approvalRequests: ApprovalRequest[] = useMemo(() => {
    return workflows
      .filter(w => w.status === 'Pending Approval')
      .map(w => ({
        id: `req-${w.id}`,
        workflowId: w.id,
        workflowName: w.name,
        requestedBy: w.metadata.createdBy,
        requestedAt: w.metadata.createdAt,
        approver: '',
        status: 'Pending' as const
      }));
  }, [workflows]);

  const handlePublishWorkflow = useCallback((workflowData: Partial<WorkflowAgent>) => {
    const newWorkflow: WorkflowAgent = {
      id: `workflow-${Date.now()}`,
      ...workflowData
    } as WorkflowAgent;
    
    setWorkflows(prev => [newWorkflow, ...prev]);
    
    // Update group counts
    setGroups(prev => prev.map(group => 
      group.id === newWorkflow.group 
        ? { ...group, count: group.count + 1 }
        : group
    ));
    
    // Update tag counts
    setTags(prev => prev.map(tag => 
      newWorkflow.tags.includes(tag.id)
        ? { ...tag, count: tag.count + 1 }
        : tag
    ));
  }, []);

  const handlePreviewWorkflow = useCallback((workflow: WorkflowAgent) => {
    setSelectedWorkflow(workflow);
    setShowPreviewModal(true);
    
    // Update view count
    setWorkflows(prev => prev.map(w => 
      w.id === workflow.id 
        ? { ...w, analytics: { ...w.analytics, views: w.analytics.views + 1 } }
        : w
    ));
  }, []);

  const handleDeployWorkflow = useCallback((workflow: WorkflowAgent) => {
    // Update deployment count
    setWorkflows(prev => prev.map(w => 
      w.id === workflow.id 
        ? { ...w, analytics: { ...w.analytics, deployments: w.analytics.deployments + 1 } }
        : w
    ));
    
    console.log('Deploying workflow:', workflow.name);
  }, []);

  const handleDuplicateWorkflow = useCallback((workflow: WorkflowAgent) => {
    const duplicated: WorkflowAgent = {
      ...workflow,
      id: `workflow-${Date.now()}`,
      name: `${workflow.name} (Copy)`,
      status: 'Draft',
      currentVersion: '1.0.0',
      metadata: {
        ...workflow.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        modifiedBy: 'Current User'
      },
      analytics: {
        ...workflow.analytics,
        views: 0,
        deployments: 0,
        revenue: 0
      }
    };
    
    setWorkflows(prev => [duplicated, ...prev]);
  }, []);

  const handleDeleteWorkflow = useCallback((workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        setWorkflows(prev => prev.filter(w => w.id !== workflowId));
        
        // Update group counts
        setGroups(prev => prev.map(group => 
          group.id === workflow.group 
            ? { ...group, count: Math.max(0, group.count - 1) }
            : group
        ));
        
        // Update tag counts
        setTags(prev => prev.map(tag => 
          workflow.tags.includes(tag.id)
            ? { ...tag, count: Math.max(0, tag.count - 1) }
            : tag
        ));
      }
    }
  }, [workflows]);

  const handleApprovalAction = useCallback((requestId: string, notes?: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (request) {
      setWorkflows(prev => prev.map(w => 
        w.id === request.workflowId 
          ? { ...w, status: 'Approved' }
          : w
      ));
    }
  }, [approvalRequests]);

  const handleRejectWorkflow = useCallback((requestId: string, notes: string) => {
    const request = approvalRequests.find(r => r.id === requestId);
    if (request) {
      setWorkflows(prev => prev.map(w => 
        w.id === request.workflowId 
          ? { ...w, status: 'Rejected' }
          : w
      ));
    }
  }, [approvalRequests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Pending Approval':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Draft':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'ReAct':
        return <Brain className="w-4 h-4" />;
      case 'RAG':
        return <Database className="w-4 h-4" />;
      case 'Multi-Agent':
        return <Users className="w-4 h-4" />;
      case 'CodeAct':
        return <Code className="w-4 h-4" />;
      case 'Tool-Use':
        return <Zap className="w-4 h-4" />;
      case 'Reflection':
        return <Repeat className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const renderWorkflowCard = (workflow: WorkflowAgent, index: number) => (
    <motion.div
      key={workflow.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-text-primary text-lg">{workflow.name}</h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
              v{workflow.currentVersion}
            </span>
            {workflow.monetization.enabled && workflow.monetization.type !== 'Free' && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs">
                <Crown className="w-3 h-3" />
                <span>{workflow.monetization.type}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-text-muted text-sm mb-3 line-clamp-2">{workflow.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon(workflow.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
            {workflow.status}
          </span>
        </div>
      </div>

      {/* Pattern & Group */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          {getPatternIcon(workflow.agenticPattern)}
          <span className="text-sm text-gray-600 dark:text-text-muted">{workflow.agenticPattern}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-text-muted">
            {groups.find(g => g.id === workflow.group)?.name}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {workflow.tags.slice(0, 3).map((tagId, tagIndex) => {
          const tag = tags.find(t => t.id === tagId);
          return tag ? (
            <span
              key={tagIndex}
              className={`px-2 py-1 text-xs rounded-full ${tag.color}`}
            >
              {tag.name}
            </span>
          ) : null;
        })}
        {workflow.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted text-xs rounded-full">
            +{workflow.tags.length - 3}
          </span>
        )}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-text-muted">{workflow.analytics.views} views</span>
        </div>
        <div className="flex items-center space-x-2">
          <Rocket className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-text-muted">{workflow.analytics.deployments} deploys</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{workflow.analytics.rating}</span>
          <span className="text-sm text-gray-500 dark:text-text-muted">({workflow.analytics.reviews})</span>
        </div>
        {workflow.analytics.revenue > 0 && (
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              ${workflow.analytics.revenue.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePreviewWorkflow(workflow)}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDeployWorkflow(workflow)}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Rocket className="w-4 h-4" />
          <span>Deploy</span>
        </motion.button>

        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>
          
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setShowApprovalSteps(true);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary"
              >
                <CheckCircle className="w-4 h-4" />
                <span>View Approvals</span>
              </button>
              <button
                onClick={() => handleDuplicateWorkflow(workflow)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary"
              >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                onClick={() => handleDeleteWorkflow(workflow.id)}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-primary transition-colors"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-card-border px-6 py-4 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Agent Marketplace</h1>
            <p className="text-gray-600 dark:text-text-muted">Discover, deploy, and manage agentic workflows</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowManageModal(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Manage Groups & Tags</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPublishModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Workflow</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'marketplace', label: 'Marketplace', icon: Building2, count: workflows.length },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle, count: approvalRequests.length },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-text-muted hover:text-gray-700 dark:hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'marketplace' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search workflows..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                    />
                  </div>
                </div>

                {/* Group Filter */}
                <div>
                  <select
                    value={filters.group}
                    onChange={(e) => setFilters(prev => ({ ...prev, group: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Groups</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Pattern Filter */}
                <div>
                  <select
                    value={filters.agenticPattern}
                    onChange={(e) => setFilters(prev => ({ ...prev, agenticPattern: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Patterns</option>
                    <option value="ReAct">ReAct</option>
                    <option value="RAG">RAG</option>
                    <option value="Multi-Agent">Multi-Agent</option>
                    <option value="CodeAct">CodeAct</option>
                    <option value="Tool-Use">Tool-Use</option>
                    <option value="Reflection">Reflection</option>
                  </select>
                </div>

                {/* View Controls */}
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-card-bg rounded-lg p-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-secondary text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-secondary text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary text-sm"
                    >
                      <option value="updated">Last Updated</option>
                      <option value="name">Name</option>
                      <option value="rating">Rating</option>
                      <option value="deployments">Deployments</option>
                      <option value="revenue">Revenue</option>
                    </select>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                      }))}
                      className="p-2 border border-gray-300 dark:border-card-border rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                    >
                      {filters.sortOrder === 'asc' ? 
                        <SortAsc className="w-4 h-4 text-gray-600 dark:text-text-muted" /> : 
                        <SortDesc className="w-4 h-4 text-gray-600 dark:text-text-muted" />
                      }
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-8">
              {Object.entries(groupedWorkflows).map(([groupName, groupWorkflows]) => (
                <motion.div
                  key={groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary">
                      {groupName}
                    </h2>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted rounded-full text-sm">
                      {groupWorkflows.length} workflows
                    </span>
                  </div>

                  {groupWorkflows.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg">
                      <Building2 className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">
                        No workflows found
                      </h3>
                      <p className="text-gray-600 dark:text-text-muted">
                        Try adjusting your filters or create a new workflow
                      </p>
                    </div>
                  ) : (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {groupWorkflows.map((workflow, index) => renderWorkflowCard(workflow, index))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'approvals' && (
          <ApprovalPanel
            approvalRequests={approvalRequests}
            workflows={workflows}
            onApprove={handleApprovalAction}
            onReject={handleRejectWorkflow}
            onPreview={handlePreviewWorkflow}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPanel
            analyticsData={analyticsData}
            workflows={workflows}
          />
        )}
      </div>

      {/* Modals */}
      <PublishWorkflowModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublishWorkflow}
        groups={groups}
        tags={tags}
      />

      <WorkflowPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        workflow={selectedWorkflow}
        onDeploy={handleDeployWorkflow}
        onEdit={(workflow) => console.log('Edit workflow:', workflow)}
      />

      <ManageGroupsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        groups={groups}
        tags={tags}
        onUpdateGroups={setGroups}
        onUpdateTags={setTags}
      />

      <ApprovalStepsModal
        isOpen={showApprovalSteps}
        onClose={() => setShowApprovalSteps(false)}
        workflow={selectedWorkflow}
        onUpdateApproval={(stepId, status, notes) => {
          if (selectedWorkflow) {
            setWorkflows(prev => prev.map(w => 
              w.id === selectedWorkflow.id 
                ? {
                    ...w,
                    approvalSteps: w.approvalSteps.map(step =>
                      step.id === stepId
                        ? {
                            ...step,
                            status,
                            notes,
                            reviewerName: 'Current User',
                            timestamp: new Date().toISOString()
                          }
                        : step
                    )
                  }
                : w
            ));
          }
        }}
      />
    </motion.div>
  );
};

export default Marketplace;