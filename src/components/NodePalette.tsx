import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, Brain, Zap, Users, Puzzle, RotateCcw, Rocket, Settings, Play, Database, Code, MessageSquare, FileText, Globe, Shield, Target, Repeat, AlertTriangle, CheckCircle, Clock, GitBranch, Layers, Network, Cpu, HardDrive, Cloud, Key, Lock, Eye, Download, Upload, Share2, Bell, Mail, Webhook, PieChart, BarChart3, TrendingUp, Activity, Monitor, Wrench, PenTool as Tool, Cog, Filter, SortAsc as Sort, Grid, List, Plus, Minus, X, Check, Info, BadgeHelp as Help, Star, Heart, Bookmark } from 'lucide-react';

// Node type definitions with Supabase schema mapping
interface NodeType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: string;
  defaultConfig: any;
  supabaseTable: string;
  dragData: any;
}

// AI Models from model_registry
const aiModels: NodeType[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s most advanced multimodal model',
    icon: Brain,
    color: 'from-green-500 to-green-600',
    category: 'ai-models',
    supabaseTable: 'model_registry',
    defaultConfig: {
      model_name: 'gpt-4o',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      streaming: true,
      retry_count: 3,
      confidence_threshold: 0.8,
      temperature: 0.7,
      max_tokens: 4096
    },
    dragData: { nodeType: 'llm', category: 'ai-models' }
  },
  {
    id: 'claude-3',
    name: 'Claude 3 Sonnet',
    description: 'Anthropic\'s balanced model for complex tasks',
    icon: Brain,
    color: 'from-purple-500 to-purple-600',
    category: 'ai-models',
    supabaseTable: 'model_registry',
    defaultConfig: {
      model_name: 'claude-3-sonnet-20240229',
      endpoint: 'https://api.anthropic.com/v1/messages',
      streaming: true,
      retry_count: 3,
      confidence_threshold: 0.85,
      temperature: 0.6,
      max_tokens: 4096
    },
    dragData: { nodeType: 'llm', category: 'ai-models' }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced reasoning model',
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    category: 'ai-models',
    supabaseTable: 'model_registry',
    defaultConfig: {
      model_name: 'gemini-pro',
      endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro',
      streaming: false,
      retry_count: 2,
      confidence_threshold: 0.75,
      temperature: 0.8,
      max_tokens: 2048
    },
    dragData: { nodeType: 'llm', category: 'ai-models' }
  },
  {
    id: 'azure-gpt',
    name: 'Azure GPT-4',
    description: 'Enterprise GPT-4 via Azure OpenAI',
    icon: Cloud,
    color: 'from-cyan-500 to-cyan-600',
    category: 'ai-models',
    supabaseTable: 'model_registry',
    defaultConfig: {
      model_name: 'gpt-4',
      endpoint: 'https://{resource}.openai.azure.com/openai/deployments/{deployment}/chat/completions',
      streaming: true,
      retry_count: 3,
      confidence_threshold: 0.8,
      temperature: 0.7,
      max_tokens: 4096
    },
    dragData: { nodeType: 'llm', category: 'ai-models' }
  },
  {
    id: 'bedrock-claude',
    name: 'Bedrock Claude',
    description: 'Claude via Amazon Bedrock',
    icon: Shield,
    color: 'from-orange-500 to-orange-600',
    category: 'ai-models',
    supabaseTable: 'model_registry',
    defaultConfig: {
      model_name: 'anthropic.claude-3-sonnet-20240229-v1:0',
      endpoint: 'bedrock-runtime',
      streaming: true,
      retry_count: 3,
      confidence_threshold: 0.85,
      temperature: 0.6,
      max_tokens: 4096
    },
    dragData: { nodeType: 'llm', category: 'ai-models' }
  },
  {
    id: 'vertex-palm',
    name: 'Vertex PaLM 2',
    description: 'Google Cloud\'s PaLM 2 model',
    icon: Network,
    color: 'from-indigo-500 to-indigo-600',
    category: 'ai-models',
    supabaseTable: 'model_registry',
    defaultConfig: {
      model_name: 'text-bison@001',
      endpoint: 'https://us-central1-aiplatform.googleapis.com/v1/projects/{project}/locations/us-central1/publishers/google/models/text-bison',
      streaming: false,
      retry_count: 2,
      confidence_threshold: 0.75,
      temperature: 0.8,
      max_tokens: 1024
    },
    dragData: { nodeType: 'llm', category: 'ai-models' }
  }
];

// MCP Protocol Tools from server_registry + tool_registry
const mcpTools: NodeType[] = [
  {
    id: 'budget-reader',
    name: 'Budget Reader',
    description: 'MCP server for reading and analyzing budget files',
    icon: PieChart,
    color: 'from-green-500 to-emerald-600',
    category: 'mcp-tools',
    supabaseTable: 'server_registry',
    defaultConfig: {
      server_name: 'budget-reader',
      url: 'mcp://budget-reader',
      method: 'GET',
      auth_key: '',
      body_schema: {
        file_path: 'string',
        format: 'csv|xlsx|json'
      },
      tools: ['read_budget', 'analyze_spending', 'generate_report']
    },
    dragData: { nodeType: 'mcp', category: 'mcp-tools' }
  },
  {
    id: 'pdf-extractor',
    name: 'PDF Extractor',
    description: 'Extract text and data from PDF documents',
    icon: FileText,
    color: 'from-red-500 to-red-600',
    category: 'mcp-tools',
    supabaseTable: 'server_registry',
    defaultConfig: {
      server_name: 'pdf-extractor',
      url: 'mcp://pdf-extractor',
      method: 'POST',
      auth_key: '',
      body_schema: {
        pdf_url: 'string',
        extract_images: 'boolean',
        ocr_enabled: 'boolean'
      },
      tools: ['extract_text', 'extract_tables', 'extract_metadata']
    },
    dragData: { nodeType: 'mcp', category: 'mcp-tools' }
  },
  {
    id: 'api-caller',
    name: 'API Caller',
    description: 'Generic REST API integration tool',
    icon: Globe,
    color: 'from-blue-500 to-blue-600',
    category: 'mcp-tools',
    supabaseTable: 'server_registry',
    defaultConfig: {
      server_name: 'api-caller',
      url: 'mcp://api-caller',
      method: 'POST',
      auth_key: '',
      body_schema: {
        endpoint: 'string',
        method: 'GET|POST|PUT|DELETE',
        headers: 'object',
        payload: 'object'
      },
      tools: ['call_api', 'validate_response', 'transform_data']
    },
    dragData: { nodeType: 'mcp', category: 'mcp-tools' }
  },
  {
    id: 'sql-runner',
    name: 'SQL Runner',
    description: 'Execute SQL queries against databases',
    icon: Database,
    color: 'from-purple-500 to-purple-600',
    category: 'mcp-tools',
    supabaseTable: 'server_registry',
    defaultConfig: {
      server_name: 'sql-runner',
      url: 'mcp://sql-runner',
      method: 'POST',
      auth_key: '',
      body_schema: {
        connection_string: 'string',
        query: 'string',
        parameters: 'object'
      },
      tools: ['execute_query', 'validate_schema', 'export_results']
    },
    dragData: { nodeType: 'mcp', category: 'mcp-tools' }
  }
];

// A2A Agents from a2a_agent_registry
const a2aAgents: NodeType[] = [
  {
    id: 'planner-agent',
    name: 'Planner Agent',
    description: 'Strategic planning and task decomposition',
    icon: Target,
    color: 'from-indigo-500 to-indigo-600',
    category: 'a2a-agents',
    supabaseTable: 'a2a_agent_registry',
    defaultConfig: {
      agent_role: 'planner',
      model: 'gpt-4o',
      memory_enabled: true,
      turn_limits: 10,
      agent_config: {
        planning_depth: 3,
        risk_assessment: true,
        resource_allocation: true
      }
    },
    dragData: { nodeType: 'a2a', category: 'a2a-agents' }
  },
  {
    id: 'validator-agent',
    name: 'Validator Agent',
    description: 'Quality assurance and validation',
    icon: CheckCircle,
    color: 'from-green-500 to-green-600',
    category: 'a2a-agents',
    supabaseTable: 'a2a_agent_registry',
    defaultConfig: {
      agent_role: 'validator',
      model: 'claude-3-sonnet',
      memory_enabled: true,
      turn_limits: 5,
      agent_config: {
        validation_criteria: [],
        strict_mode: true,
        confidence_threshold: 0.9
      }
    },
    dragData: { nodeType: 'a2a', category: 'a2a-agents' }
  },
  {
    id: 'executor-agent',
    name: 'Executor Agent',
    description: 'Task execution and implementation',
    icon: Play,
    color: 'from-orange-500 to-orange-600',
    category: 'a2a-agents',
    supabaseTable: 'a2a_agent_registry',
    defaultConfig: {
      agent_role: 'executor',
      model: 'gpt-4o',
      memory_enabled: false,
      turn_limits: 3,
      agent_config: {
        execution_timeout: 300,
        retry_on_failure: true,
        parallel_execution: false
      }
    },
    dragData: { nodeType: 'a2a', category: 'a2a-agents' }
  },
  {
    id: 'critique-agent',
    name: 'Critique Agent',
    description: 'Critical analysis and feedback',
    icon: MessageSquare,
    color: 'from-red-500 to-red-600',
    category: 'a2a-agents',
    supabaseTable: 'a2a_agent_registry',
    defaultConfig: {
      agent_role: 'critique',
      model: 'claude-3-sonnet',
      memory_enabled: true,
      turn_limits: 7,
      agent_config: {
        critique_depth: 'detailed',
        constructive_feedback: true,
        scoring_enabled: true
      }
    },
    dragData: { nodeType: 'a2a', category: 'a2a-agents' }
  },
  {
    id: 'self-reflector',
    name: 'Self-Reflector',
    description: 'Self-improvement and learning agent',
    icon: Eye,
    color: 'from-purple-500 to-purple-600',
    category: 'a2a-agents',
    supabaseTable: 'a2a_agent_registry',
    defaultConfig: {
      agent_role: 'self_reflector',
      model: 'gpt-4o',
      memory_enabled: true,
      turn_limits: 15,
      agent_config: {
        reflection_cycles: 3,
        learning_rate: 0.1,
        improvement_tracking: true
      }
    },
    dragData: { nodeType: 'a2a', category: 'a2a-agents' }
  }
];

// Agent Templates with agentic_pattern tags
const agentTemplates: NodeType[] = [
  {
    id: 'multi-agent-flow',
    name: 'Multi-Agent Flow',
    description: 'Collaborative multi-agent workflow template',
    icon: Users,
    color: 'from-cyan-500 to-cyan-600',
    category: 'agent-templates',
    supabaseTable: 'workflow_templates',
    defaultConfig: {
      agentic_pattern: 'multi-agent',
      node_count: 5,
      template_nodes: [
        { type: 'coordinator', position: { x: 200, y: 100 } },
        { type: 'planner', position: { x: 100, y: 200 } },
        { type: 'executor', position: { x: 300, y: 200 } },
        { type: 'validator', position: { x: 200, y: 300 } },
        { type: 'reporter', position: { x: 200, y: 400 } }
      ]
    },
    dragData: { nodeType: 'template', category: 'agent-templates' }
  },
  {
    id: 'codeact-chain',
    name: 'CodeAct Chain',
    description: 'Code generation and execution pipeline',
    icon: Code,
    color: 'from-yellow-500 to-yellow-600',
    category: 'agent-templates',
    supabaseTable: 'workflow_templates',
    defaultConfig: {
      agentic_pattern: 'codeact',
      node_count: 4,
      template_nodes: [
        { type: 'code_planner', position: { x: 100, y: 100 } },
        { type: 'code_generator', position: { x: 300, y: 100 } },
        { type: 'code_executor', position: { x: 500, y: 100 } },
        { type: 'result_validator', position: { x: 700, y: 100 } }
      ]
    },
    dragData: { nodeType: 'template', category: 'agent-templates' }
  },
  {
    id: 'hitl-escalation',
    name: 'HITL Escalation',
    description: 'Human-in-the-loop escalation workflow',
    icon: Shield,
    color: 'from-pink-500 to-pink-600',
    category: 'agent-templates',
    supabaseTable: 'workflow_templates',
    defaultConfig: {
      agentic_pattern: 'hitl',
      node_count: 6,
      template_nodes: [
        { type: 'input', position: { x: 100, y: 100 } },
        { type: 'confidence_check', position: { x: 300, y: 100 } },
        { type: 'auto_process', position: { x: 500, y: 50 } },
        { type: 'human_review', position: { x: 500, y: 150 } },
        { type: 'final_decision', position: { x: 700, y: 100 } },
        { type: 'output', position: { x: 900, y: 100 } }
      ]
    },
    dragData: { nodeType: 'template', category: 'agent-templates' }
  }
];

// Control & Logic Nodes with LangGraph support
const controlNodes: NodeType[] = [
  {
    id: 'condition-node',
    name: 'Condition',
    description: 'If/else branching logic',
    icon: GitBranch,
    color: 'from-blue-500 to-blue-600',
    category: 'control-logic',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'condition',
      condition_expression: 'input.confidence > 0.8',
      true_path: 'continue',
      false_path: 'escalate',
      langgraph_compatible: true
    },
    dragData: { nodeType: 'condition', category: 'control-logic' }
  },
  {
    id: 'switch-node',
    name: 'Switch',
    description: 'Multi-path routing based on values',
    icon: Layers,
    color: 'from-purple-500 to-purple-600',
    category: 'control-logic',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'switch',
      switch_expression: 'input.category',
      cases: {
        'urgent': 'priority_path',
        'normal': 'standard_path',
        'low': 'batch_path'
      },
      default_case: 'standard_path',
      langgraph_compatible: true
    },
    dragData: { nodeType: 'switch', category: 'control-logic' }
  },
  {
    id: 'retry-node',
    name: 'Retry',
    description: 'Retry logic with backoff',
    icon: Repeat,
    color: 'from-orange-500 to-orange-600',
    category: 'control-logic',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'retry',
      max_attempts: 3,
      backoff_strategy: 'exponential',
      retry_conditions: ['timeout', 'rate_limit', 'temporary_error'],
      langgraph_compatible: true
    },
    dragData: { nodeType: 'retry', category: 'control-logic' }
  },
  {
    id: 'loop-node',
    name: 'Loop',
    description: 'Iterative processing loop',
    icon: RotateCcw,
    color: 'from-green-500 to-green-600',
    category: 'control-logic',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'loop',
      loop_type: 'for_each',
      max_iterations: 100,
      break_condition: 'all_processed',
      langgraph_compatible: true
    },
    dragData: { nodeType: 'loop', category: 'control-logic' }
  },
  {
    id: 'hitl-checkpoint',
    name: 'HITL Checkpoint',
    description: 'Human intervention checkpoint',
    icon: AlertTriangle,
    color: 'from-yellow-500 to-yellow-600',
    category: 'control-logic',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'hitl_checkpoint',
      trigger_conditions: ['low_confidence', 'error_detected', 'manual_review'],
      timeout_minutes: 60,
      escalation_path: 'supervisor',
      langgraph_compatible: true
    },
    dragData: { nodeType: 'hitl', category: 'control-logic' }
  },
  {
    id: 'confidence-router',
    name: 'Confidence Router',
    description: 'Route based on confidence scores',
    icon: TrendingUp,
    color: 'from-indigo-500 to-indigo-600',
    category: 'control-logic',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'confidence_router',
      high_confidence_threshold: 0.9,
      medium_confidence_threshold: 0.7,
      low_confidence_path: 'human_review',
      langgraph_compatible: true
    },
    dragData: { nodeType: 'router', category: 'control-logic' }
  }
];

// Output & Finalization nodes with execution_mode support
const outputNodes: NodeType[] = [
  {
    id: 'notify-action',
    name: 'Notify',
    description: 'Send notifications via multiple channels',
    icon: Bell,
    color: 'from-blue-500 to-blue-600',
    category: 'output-finalization',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'notify',
      channels: ['email', 'slack', 'teams'],
      execution_mode: 'autonomous',
      template: 'default_notification',
      recipients: []
    },
    dragData: { nodeType: 'output', category: 'output-finalization' }
  },
  {
    id: 'report-pdf',
    name: 'Report PDF',
    description: 'Generate PDF reports',
    icon: FileText,
    color: 'from-red-500 to-red-600',
    category: 'output-finalization',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'report_pdf',
      template: 'standard_report',
      execution_mode: 'hitl',
      include_charts: true,
      watermark: true
    },
    dragData: { nodeType: 'output', category: 'output-finalization' }
  },
  {
    id: 'trigger-webhook',
    name: 'Trigger Webhook',
    description: 'Send HTTP webhook notifications',
    icon: Webhook,
    color: 'from-purple-500 to-purple-600',
    category: 'output-finalization',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'webhook',
      url: '',
      method: 'POST',
      execution_mode: 'autonomous',
      headers: {},
      retry_count: 3
    },
    dragData: { nodeType: 'output', category: 'output-finalization' }
  },
  {
    id: 'write-supabase',
    name: 'Write to Supabase',
    description: 'Store data in Supabase database',
    icon: Database,
    color: 'from-green-500 to-green-600',
    category: 'output-finalization',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'supabase_write',
      table: '',
      operation: 'insert',
      execution_mode: 'autonomous',
      conflict_resolution: 'upsert'
    },
    dragData: { nodeType: 'output', category: 'output-finalization' }
  },
  {
    id: 'publish-marketplace',
    name: 'Publish to Marketplace',
    description: 'Publish workflow to AgentBridge marketplace',
    icon: Share2,
    color: 'from-cyan-500 to-cyan-600',
    category: 'output-finalization',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'marketplace_publish',
      visibility: 'public',
      execution_mode: 'hitl',
      pricing_model: 'free',
      approval_required: true
    },
    dragData: { nodeType: 'output', category: 'output-finalization' }
  },
  {
    id: 'launch-blueprint',
    name: 'Launch Blueprint',
    description: 'Deploy workflow as production blueprint',
    icon: Rocket,
    color: 'from-orange-500 to-orange-600',
    category: 'output-finalization',
    supabaseTable: 'workflow_nodes',
    defaultConfig: {
      node_type: 'blueprint_launch',
      environment: 'production',
      execution_mode: 'hybrid',
      auto_scaling: true,
      monitoring_enabled: true
    },
    dragData: { nodeType: 'output', category: 'output-finalization' }
  }
];

// Palette sections configuration
const paletteConfig = [
  {
    id: 'ai-models',
    title: '🧠 AI Models',
    description: 'Drag and drop AI models',
    nodes: aiModels,
    defaultExpanded: true
  },
  {
    id: 'mcp-tools',
    title: '🧪 MCP Protocol Tools',
    description: 'Model Context Protocol tools',
    nodes: mcpTools,
    defaultExpanded: false
  },
  {
    id: 'a2a-agents',
    title: '🤖 A2A Agents',
    description: 'Agent-to-Agent communication',
    nodes: a2aAgents,
    defaultExpanded: false
  },
  {
    id: 'agent-templates',
    title: '🧩 Agent Templates',
    description: 'Pre-built mini-graphs',
    nodes: agentTemplates,
    defaultExpanded: false
  },
  {
    id: 'control-logic',
    title: '🔄 Control & Logic Nodes',
    description: 'Flow control and logic',
    nodes: controlNodes,
    defaultExpanded: false
  },
  {
    id: 'output-finalization',
    title: '🚀 Output / Finalization',
    description: 'Actions and outputs',
    nodes: outputNodes,
    defaultExpanded: false
  }
];

interface NodePaletteProps {
  onNodeDrag: (nodeType: NodeType, event: React.DragEvent) => void;
  onNodeClick: (nodeType: NodeType) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({
  onNodeDrag,
  onNodeClick,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(paletteConfig.filter(section => section.defaultExpanded).map(section => section.id))
  );
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const filteredSections = useMemo(() => {
    if (!searchTerm) return paletteConfig;
    
    return paletteConfig.map(section => ({
      ...section,
      nodes: section.nodes.filter(node =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(section => section.nodes.length > 0);
  }, [searchTerm]);

  const handleDragStart = useCallback((nodeType: NodeType, event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      ...nodeType.dragData,
      nodeConfig: nodeType.defaultConfig,
      supabaseTable: nodeType.supabaseTable
    }));
    event.dataTransfer.effectAllowed = 'move';
    onNodeDrag(nodeType, event);
  }, [onNodeDrag]);

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 60 }}
        className="h-full bg-white dark:bg-card-bg border-r border-gray-200 dark:border-card-border flex flex-col items-center py-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleCollapse}
          className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 320 }}
      className="h-full bg-white dark:bg-card-bg border-r border-gray-200 dark:border-card-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-card-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
            Node Palette
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCollapse}
            className="p-1 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary text-sm"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {filteredSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-gray-200 dark:border-card-border rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <motion.button
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => toggleSection(section.id)}
                className="w-full p-3 flex items-center justify-between text-left bg-gray-50 dark:bg-secondary hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-text-primary text-sm">
                    {section.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-text-muted">
                    {section.description}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.has(section.id) ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Section Content */}
              <AnimatePresence>
                {expandedSections.has(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      {section.nodes.map((node, index) => {
                        const Icon = node.icon;
                        return (
                          <motion.div
                            key={node.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            draggable
                            onDragStart={(e) => handleDragStart(node, e)}
                            onClick={() => onNodeClick(node)}
                            className="group relative p-3 rounded-xl border border-gray-200 dark:border-card-border hover:border-blue-300 dark:hover:border-blue-600 cursor-move hover:shadow-md transition-all duration-200 bg-white dark:bg-card-bg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${node.color} text-white flex-shrink-0`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 dark:text-text-primary text-sm truncate">
                                  {node.name}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-text-muted line-clamp-2">
                                  {node.description}
                                </p>
                              </div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 top-0 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg p-2 whitespace-nowrap shadow-lg">
                                <div className="font-medium">{node.name}</div>
                                <div className="text-gray-300 dark:text-gray-400 max-w-xs">
                                  {node.description}
                                </div>
                                <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                  Drag to canvas or click to configure
                                </div>
                              </div>
                            </div>

                            {/* Drag indicator */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-card-border">
        <div className="text-xs text-gray-600 dark:text-text-muted text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Puzzle className="w-3 h-3" />
            <span>AgentBridge Node Palette</span>
          </div>
          <div>Drag nodes to canvas • Click to configure</div>
        </div>
      </div>
    </motion.div>
  );
};

export default NodePalette;