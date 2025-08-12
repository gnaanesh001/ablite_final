import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Database, Zap, Brain, Globe, Shield, 
  CheckCircle, XCircle, AlertTriangle, Clock,
  Play, Square, RefreshCw, Settings, Eye, Copy,
  Download, ExternalLink, Filter, Search, Plus,
  Activity, Cpu, HardDrive, Network, BarChart3,
  Terminal, Code, FileText, Key, Lock, Unlock,
  ChevronRight, ChevronDown, MoreHorizontal,
  Layers, Cloud, Container, GitBranch, Rocket,
  Monitor, TrendingUp, AlertCircle as Alert
} from 'lucide-react';

interface MCPServer {
  id: string;
  name: string;
  type: 'RAG' | 'Model Router' | 'A2A Relay' | 'API Gateway' | 'Storage' | 'Analytics';
  category: 'My MCP Servers' | 'Hosted MCP Providers' | 'My A2A Agents' | 'Hosted A2A Registries';
  status: 'Healthy' | 'Degraded' | 'Needs Auth' | 'Error' | 'Deploying';
  deploymentTarget: 'Azure' | 'AWS' | 'GCP' | 'Localhost';
  endpoint: string;
  lastDeployed: string;
  uptime: number;
  latency: number;
  errorRate: number;
  version: string;
  description: string;
  isPublic: boolean;
  authRequired: boolean;
  metrics: {
    requests24h: number;
    avgResponseTime: number;
    errorCount: number;
    cpuUsage: number;
    memoryUsage: number;
  };
}

interface Integration {
  id: string;
  name: string;
  platform: string;
  status: 'Connected' | 'Needs Auth' | 'Error' | 'Deprecated';
  authType: 'OAuth' | 'API Key' | 'Token' | 'Basic Auth';
  logo: string;
  lastTested: string;
  mcpIntegrated: boolean;
  endpoints: string[];
  scopes?: string[];
}

const mockMCPServers: MCPServer[] = [
  {
    id: 'mcp-1',
    name: 'Document RAG Server',
    type: 'RAG',
    category: 'My MCP Servers',
    status: 'Healthy',
    deploymentTarget: 'Azure',
    endpoint: 'https://doc-rag.agentbridge.io',
    lastDeployed: '2 hours ago',
    uptime: 99.9,
    latency: 145,
    errorRate: 0.1,
    version: '1.2.3',
    description: 'PDF document processing and retrieval server',
    isPublic: false,
    authRequired: true,
    metrics: {
      requests24h: 1247,
      avgResponseTime: 145,
      errorCount: 2,
      cpuUsage: 45,
      memoryUsage: 68
    }
  },
  {
    id: 'mcp-2',
    name: 'OpenAI Model Router',
    type: 'Model Router',
    category: 'Hosted MCP Providers',
    status: 'Healthy',
    deploymentTarget: 'AWS',
    endpoint: 'https://openai-router.mcp.dev',
    lastDeployed: '1 day ago',
    uptime: 99.8,
    latency: 89,
    errorRate: 0.05,
    version: '2.1.0',
    description: 'Load balancer for OpenAI API endpoints',
    isPublic: true,
    authRequired: true,
    metrics: {
      requests24h: 5432,
      avgResponseTime: 89,
      errorCount: 3,
      cpuUsage: 32,
      memoryUsage: 54
    }
  },
  {
    id: 'a2a-1',
    name: 'Sales Assistant Agent',
    type: 'A2A Relay',
    category: 'My A2A Agents',
    status: 'Degraded',
    deploymentTarget: 'GCP',
    endpoint: 'https://sales-agent.agentbridge.io',
    lastDeployed: '3 hours ago',
    uptime: 97.2,
    latency: 234,
    errorRate: 2.1,
    version: '1.0.5',
    description: 'Multi-agent sales pipeline automation',
    isPublic: false,
    authRequired: true,
    metrics: {
      requests24h: 892,
      avgResponseTime: 234,
      errorCount: 19,
      cpuUsage: 78,
      memoryUsage: 85
    }
  },
  {
    id: 'mcp-3',
    name: 'Vector Storage Server',
    type: 'Storage',
    category: 'My MCP Servers',
    status: 'Needs Auth',
    deploymentTarget: 'Azure',
    endpoint: 'https://vector-store.agentbridge.io',
    lastDeployed: '5 hours ago',
    uptime: 98.5,
    latency: 67,
    errorRate: 0.3,
    version: '1.1.2',
    description: 'High-performance vector database for embeddings',
    isPublic: false,
    authRequired: true,
    metrics: {
      requests24h: 3421,
      avgResponseTime: 67,
      errorCount: 10,
      cpuUsage: 56,
      memoryUsage: 72
    }
  }
];

const mockIntegrations: Integration[] = [
  {
    id: 'slack-1',
    name: 'Slack Workspace',
    platform: 'Slack',
    status: 'Connected',
    authType: 'OAuth',
    logo: '🟢',
    lastTested: '5 minutes ago',
    mcpIntegrated: true,
    endpoints: ['https://slack.com/api/chat.postMessage', 'https://slack.com/api/users.list'],
    scopes: ['chat:write', 'users:read', 'channels:read']
  },
  {
    id: 'stripe-1',
    name: 'Stripe Payments',
    platform: 'Stripe',
    status: 'Needs Auth',
    authType: 'API Key',
    logo: '🟣',
    lastTested: '2 hours ago',
    mcpIntegrated: false,
    endpoints: ['https://api.stripe.com/v1/charges', 'https://api.stripe.com/v1/customers']
  },
  {
    id: 'salesforce-1',
    name: 'Salesforce CRM',
    platform: 'Salesforce',
    status: 'Connected',
    authType: 'OAuth',
    logo: '🔵',
    lastTested: '1 hour ago',
    mcpIntegrated: true,
    endpoints: ['https://mycompany.salesforce.com/services/data/v58.0/sobjects'],
    scopes: ['api', 'refresh_token', 'offline_access']
  },
  {
    id: 'github-1',
    name: 'GitHub Repository',
    platform: 'GitHub',
    status: 'Error',
    authType: 'Token',
    logo: '⚫',
    lastTested: '6 hours ago',
    mcpIntegrated: false,
    endpoints: ['https://api.github.com/repos', 'https://api.github.com/user']
  }
];

const Wiring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'servers' | 'integrations' | 'deployments'>('servers');
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null);
  const [showDeploymentLogs, setShowDeploymentLogs] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    deploymentTarget: '',
    showConnectedOnly: false,
    showMCPOnly: false,
    showDeprecated: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['My MCP Servers']);

  const filteredServers = mockMCPServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         server.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || server.category === filters.category;
    const matchesStatus = !filters.status || server.status === filters.status;
    const matchesTarget = !filters.deploymentTarget || server.deploymentTarget === filters.deploymentTarget;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTarget;
  });

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.platform.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConnected = !filters.showConnectedOnly || integration.status === 'Connected';
    const matchesMCP = !filters.showMCPOnly || integration.mcpIntegrated;
    const matchesDeprecated = filters.showDeprecated || integration.status !== 'Deprecated';
    
    return matchesSearch && matchesConnected && matchesMCP && matchesDeprecated;
  });

  const groupedServers = filteredServers.reduce((acc, server) => {
    if (!acc[server.category]) {
      acc[server.category] = [];
    }
    acc[server.category].push(server);
    return acc;
  }, {} as Record<string, MCPServer[]>);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Needs Auth':
        return <Lock className="w-4 h-4 text-orange-500" />;
      case 'Error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Deploying':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
      case 'Connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Needs Auth':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Deploying':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Deprecated':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RAG':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'Model Router':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'A2A Relay':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'API Gateway':
        return <Globe className="w-5 h-5 text-green-500" />;
      case 'Storage':
        return <HardDrive className="w-5 h-5 text-indigo-500" />;
      case 'Analytics':
        return <BarChart3 className="w-5 h-5 text-pink-500" />;
      default:
        return <Server className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDeploymentIcon = (target: string) => {
    switch (target) {
      case 'Azure':
        return <Cloud className="w-4 h-4 text-blue-600" />;
      case 'AWS':
        return <Cloud className="w-4 h-4 text-orange-500" />;
      case 'GCP':
        return <Cloud className="w-4 h-4 text-red-500" />;
      case 'Localhost':
        return <Monitor className="w-4 h-4 text-gray-500" />;
      default:
        return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleServerAction = useCallback((action: string, server: MCPServer) => {
    console.log(`${action} server:`, server.name);
    
    switch (action) {
      case 'restart':
        // Simulate restart
        break;
      case 'logs':
        setSelectedServer(server);
        setShowDeploymentLogs(true);
        break;
      case 'test':
        // Open test tool
        break;
      case 'deploy':
        // Trigger deployment
        break;
    }
  }, []);

  const handleIntegrationTest = useCallback((integration: Integration) => {
    console.log('Testing integration:', integration.name);
    // Simulate API test
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Integrations & Orchestrators</h1>
            <p className="text-gray-600 dark:text-text-muted">MCP & A2A server registry, health manager, and deployment dashboard</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Registry</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Server</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'servers', label: 'Server Registry', icon: Server, count: mockMCPServers.length },
            { id: 'integrations', label: 'Authentication Panel', icon: Key, count: mockIntegrations.length },
            { id: 'deployments', label: 'Deployment Control', icon: Rocket },
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
        {activeTab === 'servers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search servers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="My MCP Servers">My MCP Servers</option>
                    <option value="Hosted MCP Providers">Hosted MCP Providers</option>
                    <option value="My A2A Agents">My A2A Agents</option>
                    <option value="Hosted A2A Registries">Hosted A2A Registries</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Status</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Degraded">Degraded</option>
                    <option value="Needs Auth">Needs Auth</option>
                    <option value="Error">Error</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filters.deploymentTarget}
                    onChange={(e) => setFilters(prev => ({ ...prev, deploymentTarget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Targets</option>
                    <option value="Azure">Azure</option>
                    <option value="AWS">AWS</option>
                    <option value="GCP">GCP</option>
                    <option value="Localhost">Localhost</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Server Registry */}
            <div className="space-y-6">
              {Object.entries(groupedServers).map(([category, servers]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-card-border">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: expandedCategories.includes(category) ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">{category}</h3>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-card-bg text-gray-600 dark:text-text-muted rounded-full text-sm">
                          {servers.length}
                        </span>
                      </div>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {expandedCategories.includes(category) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {servers.map((server, index) => (
                            <motion.div
                              key={server.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ y: -4, scale: 1.02 }}
                              className="border border-gray-200 dark:border-card-border rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                            >
                              {/* Server Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  {getTypeIcon(server.type)}
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-text-primary">{server.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-text-muted">{server.type}</p>
                                  </div>
                                </div>
                                {getStatusIcon(server.status)}
                              </div>

                              {/* Server Info */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-text-muted">Status:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                                    {server.status}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-text-muted">Target:</span>
                                  <div className="flex items-center space-x-1">
                                    {getDeploymentIcon(server.deploymentTarget)}
                                    <span className="text-gray-900 dark:text-text-primary">{server.deploymentTarget}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-text-muted">Uptime:</span>
                                  <span className="text-gray-900 dark:text-text-primary">{server.uptime}%</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-text-muted">Latency:</span>
                                  <span className="text-gray-900 dark:text-text-primary">{server.latency}ms</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-text-muted">Version:</span>
                                  <span className="text-gray-900 dark:text-text-primary">v{server.version}</span>
                                </div>
                              </div>

                              {/* Metrics */}
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="bg-gray-50 dark:bg-card-bg rounded p-2">
                                  <div className="text-xs text-gray-600 dark:text-text-muted">Requests 24h</div>
                                  <div className="font-medium text-gray-900 dark:text-text-primary">{server.metrics.requests24h.toLocaleString()}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-card-bg rounded p-2">
                                  <div className="text-xs text-gray-600 dark:text-text-muted">CPU Usage</div>
                                  <div className="font-medium text-gray-900 dark:text-text-primary">{server.metrics.cpuUsage}%</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleServerAction('test', server)}
                                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded text-xs hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                                >
                                  <Play className="w-3 h-3" />
                                  <span>Test</span>
                                </motion.button>
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleServerAction('logs', server)}
                                  className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Logs</span>
                                </motion.button>

                                <div className="relative group">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-1.5 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-card-bg rounded transition-colors"
                                  >
                                    <MoreHorizontal className="w-3 h-3" />
                                  </motion.button>
                                  
                                  <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleServerAction('restart', server)}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Restart</span>
                                      </button>
                                      <button
                                        onClick={() => navigator.clipboard.writeText(server.endpoint)}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary"
                                      >
                                        <Copy className="w-3 h-3" />
                                        <span>Copy URL</span>
                                      </button>
                                      <button
                                        onClick={() => handleServerAction('deploy', server)}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary"
                                      >
                                        <Rocket className="w-3 h-3" />
                                        <span>Deploy</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'integrations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Integration Filters */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search integrations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showConnectedOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, showConnectedOnly: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-text-muted">Connected Only</span>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.showMCPOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, showMCPOnly: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-text-muted">MCP Integrated</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* Integration Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{integration.logo}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-text-primary">{integration.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-text-muted">{integration.platform}</p>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>

                  {/* Integration Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-text-muted">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {integration.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-text-muted">Auth Type:</span>
                      <span className="text-sm text-gray-900 dark:text-text-primary">{integration.authType}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-text-muted">Last Tested:</span>
                      <span className="text-sm text-gray-900 dark:text-text-primary">{integration.lastTested}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-text-muted">MCP Integrated:</span>
                      <span className={`text-sm font-medium ${integration.mcpIntegrated ? 'text-green-600' : 'text-gray-500'}`}>
                        {integration.mcpIntegrated ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  {/* Scopes/Endpoints */}
                  {integration.scopes && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-text-muted mb-2">Scopes:</div>
                      <div className="flex flex-wrap gap-1">
                        {integration.scopes.slice(0, 3).map((scope, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded text-xs">
                            {scope}
                          </span>
                        ))}
                        {integration.scopes.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted rounded text-xs">
                            +{integration.scopes.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleIntegrationTest(integration)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Test</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'deployments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Deployment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">12</h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Healthy Servers</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">3</h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Need Attention</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">98.7%</h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Avg Uptime</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">156ms</h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Avg Latency</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Targets */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-6">Deployment Targets & Control</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Azure Deployment */}
                <div className="border border-gray-200 dark:border-card-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Cloud className="w-6 h-6 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">Azure Container Apps</h4>
                        <p className="text-sm text-gray-600 dark:text-text-muted">East US 2</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-text-muted">Resource Group:</span>
                      <span className="text-gray-900 dark:text-text-primary">rg-agentbridge-prod</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-text-muted">Container Registry:</span>
                      <span className="text-gray-900 dark:text-text-primary">acragentbridge.azurecr.io</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-text-muted">Active Deployments:</span>
                      <span className="text-gray-900 dark:text-text-primary">8 containers</span>
                    </div>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mb-4">
                    <div>az containerapp up \</div>
                    <div>  --name doc-rag-server \</div>
                    <div>  --resource-group rg-agentbridge \</div>
                    <div>  --image acr.azurecr.io/doc-rag:latest</div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                    >
                      <Terminal className="w-4 h-4" />
                      <span>CLI</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Portal</span>
                    </motion.button>
                  </div>
                </div>

                {/* AWS Deployment */}
                <div className="border border-gray-200 dark:border-card-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Cloud className="w-6 h-6 text-orange-500" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">AWS ECS Fargate</h4>
                        <p className="text-sm text-gray-600 dark:text-text-muted">us-east-1</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-text-muted">Cluster:</span>
                      <span className="text-gray-900 dark:text-text-primary">agentbridge-cluster</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-text-muted">ECR Repository:</span>
                      <span className="text-gray-900 dark:text-text-primary">123456789.dkr.ecr.us-east-1.amazonaws.com</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-text-muted">Running Tasks:</span>
                      <span className="text-gray-900 dark:text-text-primary">5 tasks</span>
                    </div>
                  </div>

                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono mb-4">
                    <div>aws ecs run-task \</div>
                    <div>  --cluster agentbridge-cluster \</div>
                    <div>  --task-definition openai-router:1 \</div>
                    <div>  --launch-type FARGATE</div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                    >
                      <Terminal className="w-4 h-4" />
                      <span>CLI</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Console</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deployments */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Recent Deployments</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeploymentLogs(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View All Logs</span>
                </motion.button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Document RAG Server', status: 'Success', time: '2 hours ago', target: 'Azure', version: 'v1.2.3' },
                  { name: 'Sales Assistant Agent', status: 'Failed', time: '3 hours ago', target: 'GCP', version: 'v1.0.5' },
                  { name: 'Vector Storage Server', status: 'Success', time: '5 hours ago', target: 'Azure', version: 'v1.1.2' },
                  { name: 'OpenAI Model Router', status: 'Success', time: '1 day ago', target: 'AWS', version: 'v2.1.0' },
                ].map((deployment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-card-border rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        deployment.status === 'Success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">{deployment.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-text-muted">{deployment.time} • {deployment.target}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 dark:text-text-muted">{deployment.version}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deployment.status === 'Success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {deployment.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Deployment Logs Modal */}
      <AnimatePresence>
        {showDeploymentLogs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeploymentLogs(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-card-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary">
                    Deployment Logs
                    {selectedServer && ` - ${selectedServer.name}`}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDeploymentLogs(false)}
                    className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="space-y-1">
                    <div>[2024-01-15 14:30:15] Starting deployment process...</div>
                    <div>[2024-01-15 14:30:16] Building Docker image...</div>
                    <div>[2024-01-15 14:30:45] Image built successfully: doc-rag:v1.2.3</div>
                    <div>[2024-01-15 14:30:46] Pushing to Azure Container Registry...</div>
                    <div>[2024-01-15 14:31:12] Image pushed successfully</div>
                    <div>[2024-01-15 14:31:13] Creating container app...</div>
                    <div>[2024-01-15 14:31:45] Container app created: doc-rag-server</div>
                    <div>[2024-01-15 14:31:46] Configuring ingress...</div>
                    <div>[2024-01-15 14:31:50] Health check passed</div>
                    <div className="text-green-500">[2024-01-15 14:31:51] Deployment completed successfully!</div>
                    <div>[2024-01-15 14:31:52] Endpoint: https://doc-rag.agentbridge.io</div>
                  </div>
                </div>

                {selectedServer && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">Configuration Files</h4>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg hover:bg-white dark:hover:bg-card-bg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>server.yaml</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg hover:bg-white dark:hover:bg-card-bg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Dockerfile</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg hover:bg-white dark:hover:bg-card-bg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>metadata.json</span>
                        </motion.button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">Server Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">CPU Usage:</span>
                          <span className="text-gray-900 dark:text-text-primary">{selectedServer.metrics.cpuUsage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">Memory:</span>
                          <span className="text-gray-900 dark:text-text-primary">{selectedServer.metrics.memoryUsage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">Requests:</span>
                          <span className="text-gray-900 dark:text-text-primary">{selectedServer.metrics.requests24h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">Errors:</span>
                          <span className="text-gray-900 dark:text-text-primary">{selectedServer.metrics.errorCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">Quick Actions</h4>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Restart Server</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg hover:bg-white dark:hover:bg-card-bg transition-colors"
                        >
                          <GitBranch className="w-4 h-4" />
                          <span>Rollback</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className="w-full flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg hover:bg-white dark:hover:bg-card-bg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy Endpoint</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Wiring;