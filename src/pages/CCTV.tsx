import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Monitor, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, Users, Brain, Database, Globe, Settings, Play, Pause, Square, RotateCcw, Filter, Search, BarChart3, PieChart, LineChart, Eye, EyeOff, ArrowRight, ArrowDown, Cpu, HardDrive, DollarSign, Target, Layers, Network, GitBranch, MessageSquare, RefreshCw, Download, Share2, Maximize2, Minimize2, ChevronRight, ChevronDown, Info, FileWarning as Warning, XCircle, PlayCircle, PauseCircle, StopCircle, Sliders, Calendar, FileText, Code, Repeat, Shield } from 'lucide-react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle
} from 'reactflow';
import 'reactflow/dist/style.css';

// Agent Status Types
type AgentStatus = 'idle' | 'running' | 'error' | 'waiting' | 'paused' | 'completed';

// Mock Agent Data Structure
interface Agent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  group: string;
  pattern: string;
  version: string;
  lastActivity: string;
  metrics: {
    invocations: number;
    successRate: number;
    avgResponseTime: number;
    tokenUsage: number;
    cost: number;
    idleTime: number;
  };
  connections: string[];
  position: { x: number; y: number };
  roi: {
    timeSaved: number;
    costAvoided: number;
    revenueImpact: number;
    accuracyUplift: number;
    manualEffortEliminated: number;
  };
}

interface HandoffLog {
  id: string;
  fromAgent: string;
  toAgent: string;
  timestamp: string;
  context: any;
  status: 'success' | 'failed' | 'pending';
  duration: number;
  dataSize: number;
}

interface SystemBottleneck {
  id: string;
  type: 'wait_time' | 'retry_excessive' | 'underutilized' | 'overloaded';
  agentId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  impact: number;
}

// Generate Mock Data
const generateMockAgents = (): Agent[] => {
  const patterns = ['ReAct', 'RAG', 'Multi-Agent', 'CodeAct', 'Tool-Use', 'Reflection'];
  const groups = ['Finance', 'Healthcare', 'Retail', 'Education', 'Manufacturing', 'Legal'];
  const statuses: AgentStatus[] = ['idle', 'running', 'error', 'waiting', 'paused', 'completed'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `agent-${i + 1}`,
    name: `Agent ${i + 1}`,
    type: patterns[i % patterns.length],
    status: statuses[i % statuses.length],
    group: groups[i % groups.length],
    pattern: patterns[i % patterns.length],
    version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.0`,
    lastActivity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    metrics: {
      invocations: Math.floor(Math.random() * 1000) + 100,
      successRate: Math.round((Math.random() * 30 + 70) * 100) / 100,
      avgResponseTime: Math.round((Math.random() * 2000 + 500) * 100) / 100,
      tokenUsage: Math.floor(Math.random() * 50000) + 10000,
      cost: Math.round((Math.random() * 100 + 10) * 100) / 100,
      idleTime: Math.round((Math.random() * 60 + 5) * 100) / 100
    },
    connections: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      `agent-${Math.floor(Math.random() * 20) + 1}`
    ).filter(id => id !== `agent-${i + 1}`),
    position: {
      x: (i % 5) * 200 + Math.random() * 50,
      y: Math.floor(i / 5) * 150 + Math.random() * 50
    },
    roi: {
      timeSaved: Math.floor(Math.random() * 100) + 20,
      costAvoided: Math.floor(Math.random() * 10000) + 1000,
      revenueImpact: Math.floor(Math.random() * 50000) + 5000,
      accuracyUplift: Math.round((Math.random() * 20 + 5) * 100) / 100,
      manualEffortEliminated: Math.round((Math.random() * 80 + 10) * 100) / 100
    }
  }));
};

const generateMockHandoffs = (agents: Agent[]): HandoffLog[] => {
  return Array.from({ length: 50 }, (_, i) => {
    const fromAgent = agents[Math.floor(Math.random() * agents.length)];
    const toAgent = agents[Math.floor(Math.random() * agents.length)];
    
    return {
      id: `handoff-${i + 1}`,
      fromAgent: fromAgent.id,
      toAgent: toAgent.id,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      context: { task: `Task ${i + 1}`, data: `Data payload ${i + 1}` },
      status: ['success', 'failed', 'pending'][Math.floor(Math.random() * 3)] as any,
      duration: Math.floor(Math.random() * 5000) + 100,
      dataSize: Math.floor(Math.random() * 1000) + 50
    };
  });
};

const generateMockBottlenecks = (agents: Agent[]): SystemBottleneck[] => {
  const types: SystemBottleneck['type'][] = ['wait_time', 'retry_excessive', 'underutilized', 'overloaded'];
  const severities: SystemBottleneck['severity'][] = ['low', 'medium', 'high', 'critical'];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `bottleneck-${i + 1}`,
    type: types[i % types.length],
    agentId: agents[i % agents.length].id,
    severity: severities[i % severities.length],
    description: `Performance issue detected in ${agents[i % agents.length].name}`,
    recommendation: 'Consider scaling or optimization',
    impact: Math.floor(Math.random() * 100) + 10
  }));
};

// Agent Node Component for ReactFlow
const AgentNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'from-green-500 to-green-600';
      case 'idle': return 'from-gray-500 to-gray-600';
      case 'error': return 'from-red-500 to-red-600';
      case 'waiting': return 'from-yellow-500 to-yellow-600';
      case 'paused': return 'from-blue-500 to-blue-600';
      case 'completed': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />;
      case 'idle': return <Clock className="w-3 h-3" />;
      case 'error': return <XCircle className="w-3 h-3" />;
      case 'waiting': return <Pause className="w-3 h-3" />;
      case 'paused': return <PauseCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-500" />
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`
          px-4 py-3 rounded-xl border-2 min-w-[140px] text-center cursor-pointer
          ${selected ? 'border-blue-400 shadow-blue-200/50' : 'border-white/20'}
          bg-gradient-to-br ${getStatusColor(data.status)} text-white shadow-lg
          hover:shadow-xl transition-all duration-200
        `}
      >
        <div className="flex items-center justify-center space-x-2 mb-1">
          {getStatusIcon(data.status)}
          <span className="text-sm font-semibold">{data.name}</span>
        </div>
        <div className="text-xs opacity-80">{data.pattern}</div>
        <div className="text-xs opacity-60 mt-1">
          {data.metrics.invocations} calls
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-500" />
    </>
  );
};

const nodeTypes = {
  agent: AgentNode,
};

const CCTV: React.FC = () => {
  const [activeView, setActiveView] = useState<'matrix' | 'mesh' | 'analytics' | 'handoffs' | 'bottlenecks' | 'lifecycle' | 'roi' | 'control'>('matrix');
  const [agents] = useState<Agent[]>(generateMockAgents());
  const [handoffs] = useState<HandoffLog[]>(generateMockHandoffs(agents));
  const [bottlenecks] = useState<SystemBottleneck[]>(generateMockBottlenecks(agents));
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    group: '',
    pattern: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ReactFlow setup for mesh graph
  const initialNodes: Node[] = agents.map(agent => ({
    id: agent.id,
    type: 'agent',
    position: agent.position,
    data: agent
  }));

  const initialEdges: Edge[] = agents.flatMap(agent =>
    agent.connections.map(targetId => ({
      id: `${agent.id}-${targetId}`,
      source: agent.id,
      target: targetId,
      type: 'smoothstep',
      animated: agent.status === 'running',
      style: { stroke: '#3B82F6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' }
    }))
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filter agents based on search and filters
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = !searchTerm || 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !filters.status || agent.status === filters.status;
      const matchesGroup = !filters.group || agent.group === filters.group;
      const matchesPattern = !filters.pattern || agent.pattern === filters.pattern;
      
      return matchesSearch && matchesStatus && matchesGroup && matchesPattern;
    });
  }, [agents, searchTerm, filters]);

  // Agent control actions
  const handleAgentAction = useCallback((agentId: string, action: 'pause' | 'resume' | 'restart' | 'stop') => {
    console.log(`${action} agent ${agentId}`);
    // In real implementation, this would call the Supabase API
  }, []);

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'idle': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'waiting': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paused': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getSeverityColor = (severity: SystemBottleneck['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderAgentMatrix = () => (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {['running', 'idle', 'error', 'waiting', 'paused', 'completed'].map((status) => {
          const count = agents.filter(a => a.status === status).length;
          return (
            <motion.div
              key={status}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-card-bg rounded-lg p-4 border border-gray-200 dark:border-card-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{count}</p>
                  <p className="text-sm text-gray-600 dark:text-text-muted capitalize">{status}</p>
                </div>
                <div className={`p-2 rounded-lg ${getStatusColor(status as AgentStatus).split(' ')[1]}`}>
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Grid */}
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border">
        <div className="p-6 border-b border-gray-200 dark:border-card-border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Agent Activity Matrix</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedAgent(agent)}
                className="bg-gray-50 dark:bg-secondary rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-text-primary">{agent.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-text-muted">
                  <div className="flex justify-between">
                    <span>Pattern:</span>
                    <span className="font-medium">{agent.pattern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invocations:</span>
                    <span className="font-medium">{agent.metrics.invocations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium">{agent.metrics.successRate}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeshGraph = () => (
    <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border h-[600px]">
      <div className="p-6 border-b border-gray-200 dark:border-card-border">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Agent Mesh Topology</h3>
      </div>
      <div className="h-[540px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
          <Background gap={20} size={1} color="#e5e7eb" />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.data.status) {
                case 'running': return '#22c55e';
                case 'error': return '#ef4444';
                case 'waiting': return '#eab308';
                case 'paused': return '#3b82f6';
                default: return '#6b7280';
              }
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          />
        </ReactFlow>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {agents.reduce((sum, agent) => sum + agent.metrics.invocations, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Total Invocations</p>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">+2.1%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {(agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length).toFixed(1)}%
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Avg Success Rate</p>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">+150ms</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {(agents.reduce((sum, agent) => sum + agent.metrics.avgResponseTime, 0) / agents.length).toFixed(0)}ms
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Avg Response Time</p>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">+$234</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            ${agents.reduce((sum, agent) => sum + agent.metrics.cost, 0).toFixed(2)}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Total Cost</p>
        </div>
      </div>

      {/* Utilization Chart */}
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">Agent Utilization</h3>
        <div className="space-y-4">
          {agents.slice(0, 10).map((agent, index) => (
            <div key={agent.id} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-900 dark:text-text-primary">
                {agent.name}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-secondary rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - agent.metrics.idleTime}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
              <div className="w-16 text-sm text-gray-600 dark:text-text-muted text-right">
                {(100 - agent.metrics.idleTime).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHandoffLogs = () => (
    <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border">
      <div className="p-6 border-b border-gray-200 dark:border-card-border">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Handoff Logs & Context Chains</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {handoffs.slice(0, 10).map((handoff, index) => (
            <motion.div
              key={handoff.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-secondary rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
                  {agents.find(a => a.id === handoff.fromAgent)?.name}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
                  {agents.find(a => a.id === handoff.toAgent)?.name}
                </span>
              </div>
              <div className="flex-1" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                handoff.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                handoff.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {handoff.status}
              </span>
              <span className="text-sm text-gray-600 dark:text-text-muted">
                {handoff.duration}ms
              </span>
              <span className="text-sm text-gray-600 dark:text-text-muted">
                {new Date(handoff.timestamp).toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBottlenecks = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border">
        <div className="p-6 border-b border-gray-200 dark:border-card-border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">System Bottlenecks & Recommendations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {bottlenecks.map((bottleneck, index) => (
              <motion.div
                key={bottleneck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-card-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      bottleneck.severity === 'critical' ? 'text-red-500' :
                      bottleneck.severity === 'high' ? 'text-orange-500' :
                      bottleneck.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-text-primary">
                        {agents.find(a => a.id === bottleneck.agentId)?.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-text-muted">{bottleneck.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(bottleneck.severity)}`}>
                    {bottleneck.severity}
                  </span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Recommendation:</strong> {bottleneck.recommendation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderROIDashboard = () => (
    <div className="space-y-6">
      {/* ROI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-right">
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">+15.2%</span>
              <div className="text-xs text-gray-500 dark:text-text-muted">vs last month</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {agents.reduce((sum, agent) => sum + agent.roi.timeSaved, 0).toLocaleString()}h
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Time Saved</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-text-muted">
            ≈ {Math.round(agents.reduce((sum, agent) => sum + agent.roi.timeSaved, 0) / 8)} work days
          </div>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">+8.7%</span>
              <div className="text-xs text-gray-500 dark:text-text-muted">vs last month</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            ${agents.reduce((sum, agent) => sum + agent.roi.costAvoided, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Cost Avoided</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-text-muted">
            Operational savings
          </div>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-right">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">+22.1%</span>
              <div className="text-xs text-gray-500 dark:text-text-muted">vs last month</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            ${agents.reduce((sum, agent) => sum + agent.roi.revenueImpact, 0).toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Revenue Impact</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-text-muted">
            Direct & indirect gains
          </div>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-right">
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">+3.2%</span>
              <div className="text-xs text-gray-500 dark:text-text-muted">vs baseline</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {(agents.reduce((sum, agent) => sum + agent.roi.accuracyUplift, 0) / agents.length).toFixed(1)}%
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Accuracy Uplift</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-text-muted">
            Quality improvement
          </div>
        </div>

        <div className="bg-white dark:bg-card-bg rounded-lg p-6 border border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-right">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">+12.8%</span>
              <div className="text-xs text-gray-500 dark:text-text-muted">vs manual</div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {(agents.reduce((sum, agent) => sum + agent.roi.manualEffortEliminated, 0) / agents.length).toFixed(1)}%
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Manual Effort Eliminated</p>
          <div className="mt-2 text-xs text-gray-500 dark:text-text-muted">
            Automation efficiency
          </div>
        </div>
      </div>

      {/* ROI Calculation Methodology */}
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">ROI Calculation Methodology</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm font-medium"
          >
            View Full Report →
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Time Saved Calculation */}
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-medium text-green-900 dark:text-green-400">Time Saved</h4>
            </div>
            <div className="text-sm text-green-800 dark:text-green-300 space-y-2">
              <div className="font-mono bg-green-100 dark:bg-green-900/20 p-2 rounded">
                <div>Manual Time - Agent Time</div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  = Baseline Process Duration - Automated Duration
                </div>
              </div>
              <div className="text-xs">
                <strong>Factors:</strong> Task complexity, human processing speed, agent efficiency, parallel execution capability
              </div>
            </div>
          </div>

          {/* Cost Avoided Calculation */}
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-medium text-blue-900 dark:text-blue-400">Cost Avoided</h4>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
              <div className="font-mono bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                <div>(Labor Cost × Time Saved) - Agent Cost</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  = (Hourly Rate × Hours) - (Compute + API Costs)
                </div>
              </div>
              <div className="text-xs">
                <strong>Factors:</strong> Employee hourly rates, benefits, infrastructure costs, API usage, compute resources
              </div>
            </div>
          </div>

          {/* Revenue Impact Calculation */}
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-medium text-purple-900 dark:text-purple-400">Revenue Impact</h4>
            </div>
            <div className="text-sm text-purple-800 dark:text-purple-300 space-y-2">
              <div className="font-mono bg-purple-100 dark:bg-purple-900/20 p-2 rounded">
                <div>Faster Processing × Revenue/Unit</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  = Throughput Increase × Unit Economics
                </div>
              </div>
              <div className="text-xs">
                <strong>Factors:</strong> Processing speed improvement, customer satisfaction, reduced errors, faster time-to-market
              </div>
            </div>
          </div>

          {/* Accuracy Uplift Calculation */}
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h4 className="font-medium text-orange-900 dark:text-orange-400">Accuracy Uplift</h4>
            </div>
            <div className="text-sm text-orange-800 dark:text-orange-300 space-y-2">
              <div className="font-mono bg-orange-100 dark:bg-orange-900/20 p-2 rounded">
                <div>Agent Accuracy - Baseline Accuracy</div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  = (Correct Results / Total) - Manual Rate
                </div>
              </div>
              <div className="text-xs">
                <strong>Factors:</strong> Error reduction, consistency improvement, validation mechanisms, quality controls
              </div>
            </div>
          </div>

          {/* Manual Effort Eliminated */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-medium text-red-900 dark:text-red-400">Manual Effort Eliminated</h4>
            </div>
            <div className="text-sm text-red-800 dark:text-red-300 space-y-2">
              <div className="font-mono bg-red-100 dark:bg-red-900/20 p-2 rounded">
                <div>Automated Tasks / Total Tasks</div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  = (Agent Handled / All Tasks) × 100
                </div>
              </div>
              <div className="text-xs">
                <strong>Factors:</strong> Task automation rate, human intervention frequency, process complexity, exception handling
              </div>
            </div>
          </div>

          {/* Total ROI Formula */}
          <div className="bg-gray-50 dark:bg-gray-900/10 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h4 className="font-medium text-gray-900 dark:text-gray-400">Total ROI</h4>
            </div>
            <div className="text-sm text-gray-800 dark:text-gray-300 space-y-2">
              <div className="font-mono bg-gray-100 dark:bg-gray-900/20 p-2 rounded">
                <div>((Benefits - Costs) / Costs) × 100</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  = Net Gain / Investment × 100%
                </div>
              </div>
              <div className="text-xs">
                <strong>Benefits:</strong> Time saved value + Cost avoided + Revenue impact
                <br />
                <strong>Costs:</strong> Development + Infrastructure + Maintenance
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Trends Chart */}
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">ROI Trends (Last 6 Months)</h3>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-1 border border-gray-300 dark:border-card-border rounded-lg text-sm bg-white dark:bg-secondary text-gray-900 dark:text-text-primary">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
            const value = 150 + (index * 25) + Math.random() * 50;
            const growth = index > 0 ? ((value - (150 + ((index-1) * 25))) / (150 + ((index-1) * 25)) * 100) : 0;
            
            return (
              <div key={month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-900 dark:text-text-primary">
                  {month}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-secondary rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(value / 3, 100)}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  />
                </div>
                <div className="w-20 text-sm text-gray-600 dark:text-text-muted text-right">
                  {value.toFixed(0)}% ROI
                </div>
                <div className={`w-16 text-xs text-right ${growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI by Agent */}
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">ROI by Agent</h3>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-card-border rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
            >
              Export Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generate Report
            </motion.button>
          </div>
        </div>
        
        <div className="space-y-4">
          {agents.slice(0, 8).map((agent, index) => {
            const totalROI = ((agent.roi.revenueImpact + agent.roi.costAvoided - agent.metrics.cost) / agent.metrics.cost) * 100;
            
            return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary rounded-lg hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${
                  totalROI > 200 ? 'from-green-500 to-emerald-500' :
                  totalROI > 100 ? 'from-blue-500 to-purple-500' :
                  totalROI > 50 ? 'from-yellow-500 to-orange-500' :
                  'from-red-500 to-pink-500'
                } rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {agent.name.charAt(agent.name.length - 1)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-text-primary">{agent.name}</h4>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600 dark:text-text-muted">{agent.pattern}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-text-primary">
                    {totalROI.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-text-muted">Total ROI</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ${agent.roi.revenueImpact.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-text-muted">Revenue</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ${agent.roi.costAvoided.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-text-muted">Cost Saved</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {agent.roi.timeSaved}h
                  </p>
                  <p className="text-xs text-gray-600 dark:text-text-muted">Time Saved</p>
                </div>
                
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderControlPanel = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border">
        <div className="p-6 border-b border-gray-200 dark:border-card-border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Agent Control Panel</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 dark:border-card-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-text-primary">{agent.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAgentAction(agent.id, 'pause')}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
                  >
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAgentAction(agent.id, 'restart')}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restart</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAgentAction(agent.id, 'stop')}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const views = [
    { id: 'matrix', label: 'Activity Matrix', icon: Monitor },
    { id: 'mesh', label: 'Agent Mesh', icon: Network },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'handoffs', label: 'Handoff Logs', icon: GitBranch },
    { id: 'bottlenecks', label: 'Bottlenecks', icon: AlertTriangle },
    { id: 'roi', label: 'ROI Dashboard', icon: DollarSign },
    { id: 'control', label: 'Control Panel', icon: Settings },
  ];

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Agent Control Tower</h1>
            <p className="text-gray-600 dark:text-text-muted">Centralized monitoring and control for all deployed agents</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
              >
                <option value="">All Status</option>
                <option value="running">Running</option>
                <option value="idle">Idle</option>
                <option value="error">Error</option>
                <option value="waiting">Waiting</option>
                <option value="paused">Paused</option>
              </select>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mt-6 overflow-x-auto">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(view.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeView === view.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-card-bg'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{view.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className={`p-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-50 dark:bg-primary pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'matrix' && renderAgentMatrix()}
            {activeView === 'mesh' && renderMeshGraph()}
            {activeView === 'analytics' && renderAnalytics()}
            {activeView === 'handoffs' && renderHandoffLogs()}
            {activeView === 'bottlenecks' && renderBottlenecks()}
            {activeView === 'roi' && renderROIDashboard()}
            {activeView === 'control' && renderControlPanel()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary">
                  {selectedAgent.name} Details
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedAgent(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                >
                  ×
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Invocations:</span>
                      <span className="font-medium">{selectedAgent.metrics.invocations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Success Rate:</span>
                      <span className="font-medium">{selectedAgent.metrics.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Avg Response:</span>
                      <span className="font-medium">{selectedAgent.metrics.avgResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Cost:</span>
                      <span className="font-medium">${selectedAgent.metrics.cost}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">ROI Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Time Saved:</span>
                      <span className="font-medium">{selectedAgent.roi.timeSaved}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Cost Avoided:</span>
                      <span className="font-medium">${selectedAgent.roi.costAvoided}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Revenue Impact:</span>
                      <span className="font-medium">${selectedAgent.roi.revenueImpact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-text-muted">Accuracy Uplift:</span>
                      <span className="font-medium">{selectedAgent.roi.accuracyUplift}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CCTV;