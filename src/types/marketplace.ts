export interface WorkflowVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string;
  isActive: boolean;
  downloadUrl?: string;
}

export interface WorkflowAgent {
  id: string;
  name: string;
  description: string;
  tags: string[];
  group: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Published';
  approvalPath: 'Admin' | 'Manager';
  agenticPattern: 'ReAct' | 'RAG' | 'Multi-Agent' | 'CodeAct' | 'Tool-Use' | 'Reflection';
  monetization: {
    enabled: boolean;
    type: 'Free' | 'Tiered' | 'Pay-per-use';
    price?: number;
  };
  versions: WorkflowVersion[];
  currentVersion: string;
  workflow: {
    nodes: any[];
    edges: any[];
    json?: string;
  };
  analytics: {
    views: number;
    deployments: number;
    rating: number;
    reviews: number;
    revenue: number;
    conversionRate: number;
    timeToApproval: number;
    usageOverTime: { date: string; count: number }[];
  };
  metadata: {
    createdBy: string;
    modifiedBy: string;
    createdAt: string;
    updatedAt: string;
    nodeCount: number;
    agentType: 'Single Agent' | 'Agent Team';
    teamRoles?: string[];
    previewImage?: string;
  };
  auditTrail: AuditEntry[];
  approvalSteps: ApprovalStep[];
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  category: 'Builder' | 'Manager' | 'Admin';
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewerName?: string;
  timestamp?: string;
  notes?: string;
  required: boolean;
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  oldValue?: any;
  newValue?: any;
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  workflowName: string;
  requestedBy: string;
  requestedAt: string;
  approver: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  approvedAt?: string;
}

export interface AnalyticsData {
  topAgents: {
    byUsage: WorkflowAgent[];
    byRevenue: WorkflowAgent[];
  };
  groupBreakdown: {
    [key: string]: {
      count: number;
      revenue: number;
      deployments: number;
    };
  };
  deploymentTrends: {
    period: string;
    deployments: number;
    revenue: number;
  }[];
  approvalMetrics: {
    averageLatency: number;
    pendingCount: number;
    approvalRate: number;
  };
}

export interface FilterState {
  search: string;
  group: string;
  tags: string[];
  status: string;
  agenticPattern: string;
  sortBy: 'name' | 'rating' | 'deployments' | 'revenue' | 'updated';
  sortOrder: 'asc' | 'desc';
  groupBy: 'industry' | 'lob' | 'custom' | 'pattern';
}

export interface GroupConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  editable: boolean;
  count: number;
}

export interface TagConfig {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface DeploymentInstructions {
  cli: string;
  docker: string;
  langGraph: string;
  autoGen: string;
  python: string;
}

// Extended WorkflowAgent interface for Launchpad
declare module './marketplace' {
  interface WorkflowAgent {
    githubRepo?: string;
    maintainer?: string;
    healthStatus?: 'healthy' | 'degraded' | 'error';
    deploymentCount?: number;
    lastDeployed?: string;
  }
}