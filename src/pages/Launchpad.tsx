import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Layers, 
  Server, 
  Globe, 
  Settings,
  FileText,
  RefreshCw,
  Trash2,
  Zap,
  Database,
  Cpu,
  Play,
  Pause,
  Square,
  Monitor,
  Cloud,
  HardDrive,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  ExternalLink,
  Github,
  Star,
  Eye,
  Download,
  Copy,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  Tag,
  GitBranch,
  Code,
  Brain,
  MessageSquare,
  Repeat,
  Shield,
  Key,
  Link,
  Activity,
  BarChart3,
  Workflow,
  Container,
  Terminal
} from 'lucide-react';
import LaunchConfiguratorModal from '../components/LaunchConfiguratorModal';
import DeploymentDetailsModal from '../components/DeploymentDetailsModal';

// Mock data for blueprints
const blueprints = [
  {
    id: 'bp-1',
    name: 'PDF to Podcast Generator',
    description: 'Transform PDF documents into engaging podcast episodes using advanced AI narration and content structuring',
    tags: ['nlp', 'audio', 'content-generation'],
    group: 'media',
    status: 'Published',
    approvalPath: 'Manager',
    agenticPattern: 'RAG',
    monetization: { enabled: true, type: 'Pay-per-use', price: 0.15 },
    currentVersion: '2.1.0',
    analytics: { views: 15420, deployments: 892, rating: 4.8, reviews: 156, revenue: 12450, conversionRate: 28, timeToApproval: 12, usageOverTime: [] },
    metadata: {
      createdBy: 'NVIDIA Team',
      modifiedBy: 'NVIDIA Team',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      nodeCount: 8,
      agentType: 'Agent Team',
      teamRoles: ['content-analyzer', 'script-writer', 'voice-synthesizer'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/NVIDIA-AI-Blueprints/pdf-to-podcast',
    maintainer: 'NVIDIA AI Blueprints',
    healthStatus: 'healthy',
    deploymentCount: 892,
    lastDeployed: '2 hours ago'
  },
  {
    id: 'bp-2',
    name: 'Financial Risk Analyzer',
    description: 'Real-time financial risk assessment using multi-agent analysis and regulatory compliance checking',
    tags: ['finance', 'risk-analysis', 'compliance'],
    group: 'finance',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'Multi-Agent',
    monetization: { enabled: true, type: 'Tiered', price: 299 },
    currentVersion: '1.5.2',
    analytics: { views: 8920, deployments: 234, rating: 4.9, reviews: 89, revenue: 45600, conversionRate: 35, timeToApproval: 18, usageOverTime: [] },
    metadata: {
      createdBy: 'FinTech Solutions',
      modifiedBy: 'FinTech Solutions',
      createdAt: '2024-01-18',
      updatedAt: '2024-01-22',
      nodeCount: 12,
      agentType: 'Agent Team',
      teamRoles: ['risk-assessor', 'compliance-checker', 'report-generator'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/fintech-solutions/risk-analyzer',
    maintainer: 'FinTech Solutions',
    healthStatus: 'healthy',
    deploymentCount: 234,
    lastDeployed: '4 hours ago'
  },
  {
    id: 'bp-3',
    name: 'Customer Support Orchestrator',
    description: 'Intelligent customer support automation with sentiment analysis and escalation management',
    tags: ['customer-service', 'nlp', 'automation'],
    group: 'customer-service',
    status: 'Published',
    approvalPath: 'Manager',
    agenticPattern: 'ReAct',
    monetization: { enabled: true, type: 'Tiered', price: 149 },
    currentVersion: '3.0.1',
    analytics: { views: 12340, deployments: 567, rating: 4.7, reviews: 203, revenue: 28900, conversionRate: 42, timeToApproval: 8, usageOverTime: [] },
    metadata: {
      createdBy: 'ServiceAI Corp',
      modifiedBy: 'ServiceAI Corp',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-23',
      nodeCount: 6,
      agentType: 'Single Agent',
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/serviceai/support-orchestrator',
    maintainer: 'ServiceAI Corp',
    healthStatus: 'healthy',
    deploymentCount: 567,
    lastDeployed: '1 hour ago'
  },
  {
    id: 'bp-4',
    name: 'Medical Diagnosis Assistant',
    description: 'AI-powered medical diagnosis support with evidence-based recommendations and clinical decision support',
    tags: ['healthcare', 'diagnosis', 'medical'],
    group: 'healthcare',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'RAG',
    monetization: { enabled: true, type: 'Pay-per-use', price: 2.50 },
    currentVersion: '1.2.0',
    analytics: { views: 6780, deployments: 123, rating: 4.9, reviews: 67, revenue: 18750, conversionRate: 18, timeToApproval: 24, usageOverTime: [] },
    metadata: {
      createdBy: 'MedAI Research',
      modifiedBy: 'MedAI Research',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-21',
      nodeCount: 10,
      agentType: 'Agent Team',
      teamRoles: ['symptom-analyzer', 'evidence-researcher', 'recommendation-engine'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/medai/diagnosis-assistant',
    maintainer: 'MedAI Research',
    healthStatus: 'healthy',
    deploymentCount: 123,
    lastDeployed: '6 hours ago'
  },
  {
    id: 'bp-5',
    name: 'Code Review Automation',
    description: 'Automated code review with security scanning, best practices enforcement, and performance optimization suggestions',
    tags: ['development', 'code-review', 'security'],
    group: 'development',
    status: 'Published',
    approvalPath: 'Manager',
    agenticPattern: 'CodeAct',
    monetization: { enabled: true, type: 'Tiered', price: 99 },
    currentVersion: '2.3.1',
    analytics: { views: 9850, deployments: 445, rating: 4.6, reviews: 178, revenue: 22100, conversionRate: 38, timeToApproval: 6, usageOverTime: [] },
    metadata: {
      createdBy: 'DevTools Inc',
      modifiedBy: 'DevTools Inc',
      createdAt: '2024-01-19',
      updatedAt: '2024-01-24',
      nodeCount: 7,
      agentType: 'Single Agent',
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/devtools/code-review-ai',
    maintainer: 'DevTools Inc',
    healthStatus: 'healthy',
    deploymentCount: 445,
    lastDeployed: '3 hours ago'
  },
  {
    id: 'bp-6',
    name: 'Supply Chain Optimizer',
    description: 'End-to-end supply chain optimization with demand forecasting and inventory management',
    tags: ['supply-chain', 'optimization', 'forecasting'],
    group: 'operations',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'Multi-Agent',
    monetization: { enabled: true, type: 'Tiered', price: 499 },
    currentVersion: '1.8.0',
    analytics: { views: 5420, deployments: 89, rating: 4.8, reviews: 34, revenue: 34500, conversionRate: 16, timeToApproval: 36, usageOverTime: [] },
    metadata: {
      createdBy: 'LogiTech AI',
      modifiedBy: 'LogiTech AI',
      createdAt: '2024-01-17',
      updatedAt: '2024-01-22',
      nodeCount: 15,
      agentType: 'Agent Team',
      teamRoles: ['demand-forecaster', 'inventory-optimizer', 'route-planner'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/logitech-ai/supply-chain-optimizer',
    maintainer: 'LogiTech AI',
    healthStatus: 'degraded',
    deploymentCount: 89,
    lastDeployed: '1 day ago'
  },
  // Life Sciences Blueprints
  {
    id: 'bp-ls-1',
    name: 'Clinical Trial Protocol Optimizer',
    description: 'AI-powered optimization of clinical trial protocols with patient stratification, endpoint selection, and regulatory compliance validation',
    tags: ['GSK', 'Life Sciences', 'Clinical Trials', 'Regulatory', 'Protocol Design'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'Multi-Agent',
    monetization: { enabled: true, type: 'Tiered', price: 1299 },
    currentVersion: '2.4.1',
    analytics: { views: 3420, deployments: 67, rating: 4.9, reviews: 23, revenue: 87000, conversionRate: 19, timeToApproval: 48, usageOverTime: [] },
    metadata: {
      createdBy: 'GSK Digital Labs',
      modifiedBy: 'GSK Digital Labs',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-22',
      nodeCount: 18,
      agentType: 'Agent Team',
      teamRoles: ['protocol-analyzer', 'regulatory-validator', 'patient-stratifier', 'endpoint-optimizer'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/gsk-digital/clinical-protocol-optimizer',
    maintainer: 'GSK Digital Labs',
    healthStatus: 'healthy',
    deploymentCount: 67,
    lastDeployed: '5 hours ago'
  },
  {
    id: 'bp-ls-2',
    name: 'GMP Batch Release Validator',
    description: 'Automated validation of manufacturing batch records against GMP requirements with real-time compliance scoring and deviation detection',
    tags: ['Pfizer', 'Life Sciences', 'GMP', 'Manufacturing', 'Quality Control'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'ReAct',
    monetization: { enabled: true, type: 'Pay-per-use', price: 25.00 },
    currentVersion: '1.8.3',
    analytics: { views: 2890, deployments: 145, rating: 4.8, reviews: 41, revenue: 72500, conversionRate: 50, timeToApproval: 36, usageOverTime: [] },
    metadata: {
      createdBy: 'Pfizer Manufacturing AI',
      modifiedBy: 'Pfizer Manufacturing AI',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-23',
      nodeCount: 12,
      agentType: 'Single Agent',
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/pfizer-ai/gmp-batch-validator',
    maintainer: 'Pfizer Manufacturing AI',
    healthStatus: 'healthy',
    deploymentCount: 145,
    lastDeployed: '2 hours ago'
  },
  {
    id: 'bp-ls-3',
    name: 'Regulatory Document QA Assistant',
    description: 'Intelligent review and quality assurance of regulatory submissions with automated compliance checking and gap analysis',
    tags: ['Novartis', 'Life Sciences', 'Regulatory', 'FDA', 'Document Review'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'RAG',
    monetization: { enabled: true, type: 'Tiered', price: 899 },
    currentVersion: '3.1.2',
    analytics: { views: 4120, deployments: 89, rating: 4.7, reviews: 34, revenue: 79900, conversionRate: 22, timeToApproval: 42, usageOverTime: [] },
    metadata: {
      createdBy: 'Novartis Regulatory AI',
      modifiedBy: 'Novartis Regulatory AI',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-21',
      nodeCount: 14,
      agentType: 'Agent Team',
      teamRoles: ['document-analyzer', 'compliance-checker', 'gap-identifier', 'recommendation-engine'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/novartis-ai/regulatory-qa-assistant',
    maintainer: 'Novartis Regulatory AI',
    healthStatus: 'healthy',
    deploymentCount: 89,
    lastDeployed: '7 hours ago'
  },
  {
    id: 'bp-ls-4',
    name: 'Safety Signal Detection Agent',
    description: 'Advanced pharmacovigilance system for real-time adverse event monitoring with automated signal detection and risk assessment',
    tags: ['Roche', 'Life Sciences', 'Pharmacovigilance', 'Safety', 'Signal Detection'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'Multi-Agent',
    monetization: { enabled: true, type: 'Pay-per-use', price: 15.50 },
    currentVersion: '2.7.0',
    analytics: { views: 5670, deployments: 234, rating: 4.9, reviews: 78, revenue: 91200, conversionRate: 41, timeToApproval: 24, usageOverTime: [] },
    metadata: {
      createdBy: 'Roche Safety Intelligence',
      modifiedBy: 'Roche Safety Intelligence',
      createdAt: '2024-01-14',
      updatedAt: '2024-01-24',
      nodeCount: 16,
      agentType: 'Agent Team',
      teamRoles: ['signal-detector', 'risk-assessor', 'causality-analyzer', 'report-generator'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/roche-ai/safety-signal-detection',
    maintainer: 'Roche Safety Intelligence',
    healthStatus: 'healthy',
    deploymentCount: 234,
    lastDeployed: '1 hour ago'
  },
  {
    id: 'bp-ls-5',
    name: 'R&D Literature Summarizer',
    description: 'Comprehensive analysis and summarization of scientific literature with competitive intelligence and research gap identification',
    tags: ['J&J', 'Life Sciences', 'Research', 'Literature Review', 'Competitive Intelligence'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Manager',
    agenticPattern: 'RAG',
    monetization: { enabled: true, type: 'Tiered', price: 649 },
    currentVersion: '1.9.4',
    analytics: { views: 7230, deployments: 178, rating: 4.6, reviews: 67, revenue: 115400, conversionRate: 25, timeToApproval: 18, usageOverTime: [] },
    metadata: {
      createdBy: 'Johnson & Johnson Innovation',
      modifiedBy: 'Johnson & Johnson Innovation',
      createdAt: '2024-01-11',
      updatedAt: '2024-01-23',
      nodeCount: 10,
      agentType: 'Single Agent',
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/jnj-innovation/rd-literature-summarizer',
    maintainer: 'Johnson & Johnson Innovation',
    healthStatus: 'healthy',
    deploymentCount: 178,
    lastDeployed: '4 hours ago'
  },
  {
    id: 'bp-ls-6',
    name: 'Manufacturing Exception Monitor',
    description: 'Real-time monitoring and analysis of manufacturing deviations with automated root cause analysis and CAPA recommendations',
    tags: ['Merck', 'Life Sciences', 'Manufacturing', 'Quality Assurance', 'CAPA'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Admin',
    agenticPattern: 'ReAct',
    monetization: { enabled: true, type: 'Pay-per-use', price: 12.75 },
    currentVersion: '2.2.1',
    analytics: { views: 3890, deployments: 156, rating: 4.8, reviews: 52, revenue: 63400, conversionRate: 40, timeToApproval: 30, usageOverTime: [] },
    metadata: {
      createdBy: 'Merck Manufacturing Excellence',
      modifiedBy: 'Merck Manufacturing Excellence',
      createdAt: '2024-01-13',
      updatedAt: '2024-01-22',
      nodeCount: 11,
      agentType: 'Agent Team',
      teamRoles: ['deviation-monitor', 'root-cause-analyzer', 'capa-recommender'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/merck-ai/manufacturing-exception-monitor',
    maintainer: 'Merck Manufacturing Excellence',
    healthStatus: 'healthy',
    deploymentCount: 156,
    lastDeployed: '3 hours ago'
  },
  {
    id: 'bp-ls-7',
    name: 'Commercial Field Force Planner',
    description: 'AI-driven optimization of pharmaceutical field force deployment with territory planning and HCP engagement strategies',
    tags: ['AbbVie', 'Life Sciences', 'Commercial', 'Field Force', 'Territory Planning'],
    group: 'life-sciences',
    status: 'Published',
    approvalPath: 'Manager',
    agenticPattern: 'Multi-Agent',
    monetization: { enabled: true, type: 'Tiered', price: 799 },
    currentVersion: '1.6.3',
    analytics: { views: 4560, deployments: 112, rating: 4.7, reviews: 45, revenue: 89500, conversionRate: 25, timeToApproval: 21, usageOverTime: [] },
    metadata: {
      createdBy: 'AbbVie Commercial Analytics',
      modifiedBy: 'AbbVie Commercial Analytics',
      createdAt: '2024-01-09',
      updatedAt: '2024-01-20',
      nodeCount: 13,
      agentType: 'Agent Team',
      teamRoles: ['territory-optimizer', 'hcp-analyzer', 'engagement-strategist', 'performance-tracker'],
      previewImage: '/api/placeholder/400/300'
    },
    githubRepo: 'https://github.com/abbvie-ai/field-force-planner',
    maintainer: 'AbbVie Commercial Analytics',
    healthStatus: 'healthy',
    deploymentCount: 112,
    lastDeployed: '6 hours ago'
  }
];

// Mock deployed instances
const deployedInstances = [
  {
    id: 'deploy-1',
    blueprintId: 'bp-1',
    name: 'PDF Podcast - Production',
    status: 'healthy',
    provider: 'aws',
    region: 'us-west-2',
    deployedAt: '2024-01-20T10:30:00Z',
    lastActivity: '2024-01-24T14:22:00Z',
    resources: {
      cpu: '4 vCPUs',
      memory: '16 GB',
      gpu: '1x NVIDIA A100',
      storage: '100 GB SSD'
    },
    metrics: {
      uptime: '99.8%',
      requests: 15420,
      avgLatency: '245ms',
      errorRate: '0.2%'
    },
    cost: '$127.50/day',
    url: 'https://pdf-podcast-prod.agentbridge.ai',
    langfuseUrl: 'https://langfuse.agentbridge.ai/project/pdf-podcast-prod'
  },
  {
    id: 'deploy-2',
    blueprintId: 'bp-2',
    name: 'Risk Analyzer - Staging',
    status: 'healthy',
    provider: 'azure',
    region: 'eastus',
    deployedAt: '2024-01-22T08:15:00Z',
    lastActivity: '2024-01-24T13:45:00Z',
    resources: {
      cpu: '8 vCPUs',
      memory: '32 GB',
      gpu: '2x NVIDIA V100',
      storage: '250 GB Premium SSD'
    },
    metrics: {
      uptime: '100%',
      requests: 8920,
      avgLatency: '180ms',
      errorRate: '0.1%'
    },
    cost: '$245.80/day',
    url: 'https://risk-analyzer-staging.agentbridge.ai',
    langfuseUrl: 'https://langfuse.agentbridge.ai/project/risk-analyzer-staging'
  },
  {
    id: 'deploy-3',
    blueprintId: 'bp-3',
    name: 'Support Bot - Development',
    status: 'degraded',
    provider: 'gcp',
    region: 'us-central1',
    deployedAt: '2024-01-23T16:20:00Z',
    lastActivity: '2024-01-24T12:10:00Z',
    resources: {
      cpu: '2 vCPUs',
      memory: '8 GB',
      gpu: 'None',
      storage: '50 GB Standard'
    },
    metrics: {
      uptime: '97.2%',
      requests: 3450,
      avgLatency: '320ms',
      errorRate: '2.8%'
    },
    cost: '$45.20/day',
    url: 'https://support-bot-dev.agentbridge.ai',
    langfuseUrl: 'https://langfuse.agentbridge.ai/project/support-bot-dev'
  }
];

const cloudProviders = [
  { id: 'aws', name: 'Amazon Web Services', icon: '🟠', color: 'from-orange-500 to-orange-600' },
  { id: 'azure', name: 'Microsoft Azure', icon: '🔵', color: 'from-blue-500 to-blue-600' },
  { id: 'gcp', name: 'Google Cloud Platform', icon: '🔴', color: 'from-red-500 to-red-600' },
  { id: 'nvidia', name: 'NVIDIA DGX Cloud', icon: '🟢', color: 'from-green-500 to-green-600' },
  { id: 'oci', name: 'Oracle Cloud', icon: '🔴', color: 'from-red-600 to-red-700' },
  { id: 'onprem', name: 'On-Premises', icon: '⚫', color: 'from-gray-600 to-gray-700' }
];

const Launchpad: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blueprints' | 'deployments' | 'analytics'>('blueprints');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<any>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<any>(null);

  // Filter blueprints
  const filteredBlueprints = useMemo(() => {
    return blueprints.filter(blueprint => {
      const matchesSearch = !searchTerm || 
        blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blueprint.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesGroup = !selectedGroup || blueprint.group === selectedGroup;
      
      return matchesSearch && matchesGroup;
    });
  }, [blueprints, searchTerm, selectedGroup]);

  const handleLaunchBlueprint = useCallback((blueprint: any) => {
    setSelectedBlueprint(blueprint);
    setShowLaunchModal(true);
  }, []);

  const handleViewDeployment = useCallback((deployment: any) => {
    setSelectedDeployment(deployment);
    setShowDeploymentModal(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProviderIcon = (provider: string) => {
    const p = cloudProviders.find(cp => cp.id === provider);
    return p ? p.icon : '☁️';
  };

  const getPatternIcon = (pattern: string) => {
    switch (pattern) {
      case 'ReAct':
        return '🧠';
      case 'RAG':
        return '📚';
      case 'Multi-Agent':
        return '👥';
      case 'CodeAct':
        return '💻';
      case 'Tool-Use':
        return '⚡';
      case 'Reflection':
        return '🔄';
      default:
        return '🤖';
    }
  };

  const renderBlueprintCard = (blueprint: any, index: number) => (
    <motion.div
      key={blueprint.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Preview Image */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
        {blueprint.metadata?.previewImage ? (
          <img 
            src={blueprint.metadata.previewImage} 
            alt={blueprint.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">{getPatternIcon(blueprint.agenticPattern)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blueprint.healthStatus || 'healthy')}`}>
              {getStatusIcon(blueprint.healthStatus || 'healthy')}
            </span>
            {blueprint.monetization.enabled && blueprint.monetization.type !== 'Free' && (
              <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                ${blueprint.monetization.price}
              </span>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold mb-1">{blueprint.name}</h3>
            <p className="text-sm opacity-90">v{blueprint.currentVersion}</p>
          </div>
        </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                {blueprint.agenticPattern}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted rounded-full text-xs">
                {blueprint.group}
              </span>
            </div>
            <p className="text-gray-600 dark:text-text-muted text-sm mb-3 line-clamp-2">{blueprint.description}</p>
          </div>
        </div>

        {/* Maintainer & GitHub */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-text-muted">{blueprint.maintainer}</span>
          </div>
          {blueprint.githubRepo ? (
            <motion.a
              href={blueprint.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
            >
              <Github className="w-4 h-4" />
            </motion.a>
          ) : (
            <div className="p-2 text-gray-300 dark:text-gray-600">
              <Github className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blueprint.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {blueprint.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted text-xs rounded-full">
              +{blueprint.tags.length - 3}
            </span>
          )}
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-text-muted">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{blueprint.analytics.views.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-text-muted">Views</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-text-muted">
              <Rocket className="w-4 h-4" />
              <span className="text-sm">{blueprint.deploymentCount}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-text-muted">Deploys</p>
          </div>
          <div>
            <div className="flex items-center justify-center space-x-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{blueprint.analytics.rating}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-text-muted">Rating</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Preview functionality coming soon!')}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLaunchBlueprint(blueprint)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            <Rocket className="w-4 h-4" />
            <span>Launch Now</span>
          </motion.button>
        </div>

        {/* Last Deployed */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-text-muted">
            <span>Last deployed: {blueprint.lastDeployed}</span>
            <span>{blueprint.deploymentCount} active instances</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderDeploymentCard = (deployment: any, index: number) => (
    <motion.div
      key={deployment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-text-primary">{deployment.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(deployment.status)}`}>
              {getStatusIcon(deployment.status)}
              <span>{deployment.status}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-text-muted">
            <div className="flex items-center space-x-1">
              <span className="text-lg">{getProviderIcon(deployment.provider)}</span>
              <span>{deployment.region}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Deployed {new Date(deployment.deployedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(deployment.url, '_blank')}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Open Application"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(deployment.langfuseUrl, '_blank')}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="View Langfuse Traces"
          >
            <Activity className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Resources */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-text-primary">Resources</h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-text-muted">
            <div className="flex justify-between">
              <span>CPU:</span>
              <span>{deployment.resources.cpu}</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>{deployment.resources.memory}</span>
            </div>
            <div className="flex justify-between">
              <span>GPU:</span>
              <span>{deployment.resources.gpu}</span>
            </div>
            <div className="flex justify-between">
              <span>Storage:</span>
              <span>{deployment.resources.storage}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-text-primary">Metrics</h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-text-muted">
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="text-green-600 dark:text-green-400">{deployment.metrics.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span>Requests:</span>
              <span>{deployment.metrics.requests.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Latency:</span>
              <span>{deployment.metrics.avgLatency}</span>
            </div>
            <div className="flex justify-between">
              <span>Error Rate:</span>
              <span className={deployment.metrics.errorRate === '0.1%' || deployment.metrics.errorRate === '0.2%' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {deployment.metrics.errorRate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cost & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-card-border">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-text-primary">{deployment.cost}</span>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDeployment(deployment)}
            className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors text-sm"
          >
            <Monitor className="w-4 h-4" />
            <span>Details</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart</span>
          </motion.button>
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
        className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-card-border px-6 py-6 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">AI Blueprint Launcher</h1>
            <p className="text-gray-600 dark:text-text-muted">Deploy enterprise-grade AI workflows to any cloud or on-premises environment</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Config</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blueprint</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'blueprints', label: 'AI Blueprints', icon: Layers, count: blueprints.length },
            { id: 'deployments', label: 'My Deployments', icon: Server, count: deployedInstances.length },
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
                <Icon className="w-5 h-5" />
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
        {activeTab === 'blueprints' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search blueprints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                    />
                  </div>

                  {/* Group Filter */}
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="media">Media & Content</option>
                    <option value="finance">Finance</option>
                    <option value="customer-service">Customer Service</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="development">Development</option>
                    <option value="operations">Operations</option>
                    <option value="life-sciences">Life Sciences</option>
                  </select>

                  {/* Provider Filter */}
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Providers</option>
                    {cloudProviders.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-2">
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
                </div>
              </div>
            </div>

            {/* Blueprints Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredBlueprints.map((blueprint, index) => renderBlueprintCard(blueprint, index))}
            </div>

            {filteredBlueprints.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg">
                <Layers className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">
                  No blueprints found
                </h3>
                <p className="text-gray-600 dark:text-text-muted">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'deployments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Deployment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                      {deployedInstances.filter(d => d.status === 'healthy').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-text-muted">Healthy</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                      {deployedInstances.filter(d => d.status === 'degraded').length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-text-muted">Degraded</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">$418.50</p>
                    <p className="text-sm text-gray-600 dark:text-text-muted">Daily Cost</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">27.8K</p>
                    <p className="text-sm text-gray-600 dark:text-text-muted">Total Requests</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deployedInstances.map((deployment, index) => renderDeploymentCard(deployment, index))}
            </div>

            {deployedInstances.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg">
                <Server className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">
                  No deployments yet
                </h3>
                <p className="text-gray-600 dark:text-text-muted mb-4">
                  Launch your first AI blueprint to get started
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab('blueprints')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Blueprints
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.5%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">2,350</h3>
                <p className="text-gray-600 dark:text-text-muted text-sm">Total Deployments</p>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">+8.2%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">98.7%</h3>
                <p className="text-gray-600 dark:text-text-muted text-sm">Success Rate</p>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">-15.3%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">4.2m</h3>
                <p className="text-gray-600 dark:text-text-muted text-sm">Avg Deploy Time</p>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">+22.1%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">$12.5K</h3>
                <p className="text-gray-600 dark:text-text-muted text-sm">Monthly Spend</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                  Deployment Trends
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-text-muted">
                  <BarChart3 className="w-16 h-16 mb-4" />
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                  Resource Utilization
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-text-muted">
                  <Activity className="w-16 h-16 mb-4" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <LaunchConfiguratorModal
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        blueprint={selectedBlueprint}
        cloudProviders={cloudProviders}
        onLaunch={(config) => {
          console.log('Launching with config:', config);
          setShowLaunchModal(false);
        }}
      />

      <DeploymentDetailsModal
        isOpen={showDeploymentModal}
        onClose={() => setShowDeploymentModal(false)}
        deployment={selectedDeployment}
        onAction={(action, deployment) => {
          console.log(`${action} deployment:`, deployment);
        }}
      />
    </motion.div>
  );
};

export default Launchpad;