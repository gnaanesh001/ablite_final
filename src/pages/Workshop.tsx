import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, Download, Share2, Play, Settings, 
  Zap, Users, Code, FileText, Brain, Target, Rocket,
  Plus, Search, Filter, Grid3X3, List, MoreHorizontal,
  CheckCircle, Clock, AlertTriangle, Eye, Edit3, Copy,
  Upload, Sparkles, Layers, GitBranch, Database, Globe,
  Shield, Crown, Repeat, RotateCcw, PieChart, Bell,
  Mail, Webhook, Building2, Tag, Star, Heart, Bookmark,
  X, ChevronDown, ChevronRight, Info, HelpCircle,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Move, Link,
  Trash2, RefreshCw, ExternalLink, Terminal, Monitor,
  Wand2, FolderOpen, Wrench, BookOpen, ChevronLeft,
  Cpu, Cloud, Server, Key, Lock, Activity, TrendingUp
} from 'lucide-react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodePalette from '../components/NodePalette';
import NodeConfigDrawer from '../components/NodeConfigDrawer';
import TemplatesLibrary from '../components/TemplatesLibrary';

// Enhanced Node Component with better styling and functionality
const AgentBridgeNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const getNodeColor = (nodeType: string) => {
    switch (nodeType) {
      case 'llm': return 'from-blue-500 to-blue-600';
      case 'mcp': return 'from-orange-500 to-orange-600';
      case 'a2a': return 'from-indigo-500 to-indigo-600';
      case 'template': return 'from-purple-500 to-purple-600';
      case 'condition': return 'from-yellow-500 to-yellow-600';
      case 'loop': return 'from-cyan-500 to-cyan-600';
      case 'output': return 'from-green-500 to-green-600';
      case 'input': return 'from-gray-500 to-gray-600';
      case 'webhook': return 'from-emerald-500 to-emerald-600';
      case 'api': return 'from-rose-500 to-rose-600';
      case 'database': return 'from-violet-500 to-violet-600';
      case 'logger': return 'from-slate-500 to-slate-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'llm': return <Brain className="w-4 h-4" />;
      case 'mcp': return <Zap className="w-4 h-4" />;
      case 'a2a': return <Users className="w-4 h-4" />;
      case 'template': return <Code className="w-4 h-4" />;
      case 'condition': return <GitBranch className="w-4 h-4" />;
      case 'loop': return <Repeat className="w-4 h-4" />;
      case 'output': return <Rocket className="w-4 h-4" />;
      case 'input': return <Globe className="w-4 h-4" />;
      case 'webhook': return <Webhook className="w-4 h-4" />;
      case 'api': return <Link className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'logger': return <Monitor className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'success': return <CheckCircle className="w-3 h-3 text-green-200" />;
      case 'error': return <AlertTriangle className="w-3 h-3 text-red-200" />;
      case 'running': return <div className="w-3 h-3 bg-yellow-200 rounded-full animate-pulse" />;
      case 'pending': return <Clock className="w-3 h-3 text-blue-200" />;
      default: return null;
    }
  };

  return (
    <>
      {data.nodeType !== 'input' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-gray-400 border-2 border-white"
        />
      )}
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`
          px-4 py-3 shadow-lg rounded-2xl border-2 min-w-[160px] text-center
          ${selected ? 'border-blue-400 shadow-blue-200/50' : 'border-white/20'}
          bg-gradient-to-br ${getNodeColor(data.nodeType)} text-white
          hover:shadow-xl transition-all duration-200 cursor-pointer
        `}
      >
        <div className="flex items-center justify-center space-x-2 mb-1">
          {getNodeIcon(data.nodeType)}
          <span className="text-sm font-semibold">{data.label}</span>
        </div>
        
        {data.description && (
          <p className="text-xs text-white/80 mb-2">{data.description}</p>
        )}
        
        {data.model && (
          <div className="text-xs text-white/70 mb-1">
            Model: {data.model}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {data.executionMode && (
            <div className={`text-xs px-2 py-1 rounded-full ${
              data.executionMode === 'hitl' ? 'bg-orange-300/20 text-orange-100' :
              data.executionMode === 'hybrid' ? 'bg-purple-300/20 text-purple-100' :
              'bg-green-300/20 text-green-100'
            }`}>
              {data.executionMode.toUpperCase()}
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            {data.hitl && (
              <div className="w-2 h-2 bg-yellow-300 rounded-full" title="Human in Loop" />
            )}
          </div>
        </div>
      </motion.div>
      
      {data.nodeType !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-gray-400 border-2 border-white"
        />
      )}
    </>
  );
};

// Custom Edge Component
const AgentBridgeEdge = ({ id, sourceX, sourceY, targetX, targetY, data }: any) => {
  const edgePath = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;
  
  return (
    <g>
      <path
        id={id}
        d={edgePath}
        stroke={data?.color || '#002855'}
        strokeWidth={data?.animated ? 3 : 2}
        fill="none"
        markerEnd="url(#arrowhead)"
        className={data?.animated ? 'animate-pulse' : ''}
      />
      {data?.label && (
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" className="fill-gray-600 text-xs">
            {data.label}
          </textPath>
        </text>
      )}
    </g>
  );
};

const nodeTypes: NodeTypes = {
  agentbridge: AgentBridgeNode,
};

const edgeTypes: EdgeTypes = {
  agentbridge: AgentBridgeEdge,
};

// Agentic Patterns Data
const agenticPatterns = [
  {
    id: 'react',
    name: 'ReAct',
    description: 'Reasoning and Acting in language models',
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    githubUrl: 'https://github.com/ysymyth/ReAct',
    useCase: 'Question answering, fact verification, interactive decision making',
    preview: 'Think → Act → Observe → Repeat'
  },
  {
    id: 'codeact',
    name: 'CodeAct',
    description: 'Code generation and execution agent',
    icon: Code,
    color: 'from-green-500 to-green-600',
    githubUrl: 'https://github.com/xingyaoww/code-act',
    useCase: 'Code generation, debugging, automated programming tasks',
    preview: 'Plan → Code → Execute → Validate'
  },
  {
    id: 'tool-use',
    name: 'Tool Use (MCP)',
    description: 'Model Context Protocol for tool integration',
    icon: Zap,
    color: 'from-orange-500 to-orange-600',
    githubUrl: 'https://github.com/modelcontextprotocol/python-sdk',
    useCase: 'API integration, external tool usage, system interactions',
    preview: 'Input → Tool Selection → Execute → Output'
  },
  {
    id: 'self-reflection',
    name: 'Self-Reflection',
    description: 'Self-improving agent with reflection loops',
    icon: Repeat,
    color: 'from-purple-500 to-purple-600',
    githubUrl: 'https://github.com/noahshinn024/reflexion',
    useCase: 'Iterative improvement, self-correction, learning from mistakes',
    preview: 'Act → Reflect → Learn → Improve'
  },
  {
    id: 'multi-agent',
    name: 'Multi-Agent Workflow',
    description: 'Collaborative multi-agent systems',
    icon: Users,
    color: 'from-indigo-500 to-indigo-600',
    githubUrl: 'https://github.com/microsoft/autogen',
    useCase: 'Complex problem solving, role-based collaboration, distributed tasks',
    preview: 'Coordinate → Delegate → Collaborate → Synthesize'
  },
  {
    id: 'agentic-rag',
    name: 'Agentic RAG',
    description: 'Retrieval-Augmented Generation with agency',
    icon: Database,
    color: 'from-cyan-500 to-cyan-600',
    githubUrl: 'https://github.com/run-llama/llama_index',
    useCase: 'Knowledge retrieval, document QA, contextual responses',
    preview: 'Query → Retrieve → Augment → Generate'
  }
];

// Framework options for import
const frameworks = [
  { id: 'langgraph', name: 'LangGraph', icon: '🦜', color: 'from-green-500 to-green-600' },
  { id: 'crewai', name: 'CrewAI', icon: '🚢', color: 'from-blue-500 to-blue-600' },
  { id: 'autogen', name: 'Autogen', icon: '🤖', color: 'from-purple-500 to-purple-600' },
  { id: 'semantic-kernel', name: 'Semantic Kernel', icon: '🧠', color: 'from-orange-500 to-orange-600' },
  { id: 'llamaindex', name: 'LlamaIndex', icon: '🦙', color: 'from-red-500 to-red-600' },
  { id: 'openai-swarm', name: 'OpenAI Swarm', icon: '🐝', color: 'from-yellow-500 to-yellow-600' }
];

// LLM Providers
const llmProviders = [
  { id: 'vertex-ai', name: 'Vertex AI', icon: '🔍', color: 'from-blue-500 to-blue-600' },
  { id: 'azure-foundry', name: 'Azure Foundry', icon: '☁️', color: 'from-cyan-500 to-cyan-600' },
  { id: 'amazon-bedrock', name: 'Amazon Bedrock', icon: '🪨', color: 'from-orange-500 to-orange-600' },
  { id: 'openai', name: 'OpenAI', icon: '🤖', color: 'from-green-500 to-green-600' },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', color: 'from-purple-500 to-purple-600' }
];

// Domain options for prompt generator
const domains = [
  'Banking & Finance', 'Healthcare & Life Sciences', 'Retail & E-commerce',
  'Manufacturing & Industry', 'Education & Training', 'Legal & Compliance',
  'Automotive & Transportation', 'Energy & Utilities', 'Agriculture & Food',
  'Media & Entertainment', 'Cybersecurity & IT', 'Real Estate', 'Insurance',
  'Government & Public Sector', 'Non-profit & NGO', 'Consulting & Services'
];

// Task types
const taskTypes = [
  'Data Analysis & Insights', 'Customer Service & Support', 'Content Generation',
  'Process Automation', 'Decision Making', 'Quality Assurance', 'Risk Assessment',
  'Compliance Monitoring', 'Predictive Analytics', 'Recommendation Systems',
  'Document Processing', 'Image/Video Analysis', 'Natural Language Processing',
  'Code Generation & Review', 'Research & Investigation', 'Planning & Scheduling'
];

// Data/Tool types
const dataToolTypes = [
  'APIs & Web Services', 'Databases (SQL/NoSQL)', 'File Systems & Documents',
  'Cloud Storage', 'Real-time Streams', 'IoT Sensors', 'Email & Communication',
  'CRM Systems', 'ERP Systems', 'Analytics Platforms', 'Social Media',
  'Financial Markets', 'Scientific Instruments', 'Mobile Applications',
  'Web Scraping', 'Third-party Integrations'
];

// Generate LangGraph workflow from pattern
const generateWorkflowFromPattern = (pattern: string, config?: any): { nodes: Node[], edges: Edge[] } => {
  const baseY = 100;
  const spacing = 250;
  
  switch (pattern) {
    case 'react':
      return {
        nodes: [
          {
            id: 'input-1',
            type: 'agentbridge',
            data: {
              label: 'User Input',
              nodeType: 'input',
              description: 'Receive user query or task',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50, y: baseY }
          },
          {
            id: 'thought-1',
            type: 'agentbridge',
            data: {
              label: 'Thought Process',
              nodeType: 'llm',
              description: 'Analyze and reason about the task',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing, y: baseY }
          },
          {
            id: 'action-1',
            type: 'agentbridge',
            data: {
              label: 'Action Selection',
              nodeType: 'condition',
              description: 'Choose appropriate action',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY }
          },
          {
            id: 'tool-1',
            type: 'agentbridge',
            data: {
              label: 'Tool Execution',
              nodeType: 'mcp',
              description: 'Execute selected tool/action',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 3, y: baseY }
          },
          {
            id: 'observe-1',
            type: 'agentbridge',
            data: {
              label: 'Observation',
              nodeType: 'llm',
              description: 'Analyze results and observations',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 4, y: baseY }
          },
          {
            id: 'decision-1',
            type: 'agentbridge',
            data: {
              label: 'Continue/Finish',
              nodeType: 'condition',
              description: 'Decide if task is complete',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 5, y: baseY }
          },
          {
            id: 'output-1',
            type: 'agentbridge',
            data: {
              label: 'Final Output',
              nodeType: 'output',
              description: 'Return final result to user',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 6, y: baseY }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'thought-1', type: 'agentbridge', data: { label: 'query' } },
          { id: 'e2', source: 'thought-1', target: 'action-1', type: 'agentbridge', data: { label: 'reasoning' } },
          { id: 'e3', source: 'action-1', target: 'tool-1', type: 'agentbridge', data: { label: 'execute' } },
          { id: 'e4', source: 'tool-1', target: 'observe-1', type: 'agentbridge', data: { label: 'results' } },
          { id: 'e5', source: 'observe-1', target: 'decision-1', type: 'agentbridge', data: { label: 'analysis' } },
          { id: 'e6', source: 'decision-1', target: 'output-1', type: 'agentbridge', data: { label: 'complete' } },
          { id: 'e7', source: 'decision-1', target: 'thought-1', type: 'agentbridge', data: { label: 'continue' } }
        ]
      };

    case 'codeact':
      return {
        nodes: [
          {
            id: 'input-1',
            type: 'agentbridge',
            data: {
              label: 'Code Request',
              nodeType: 'input',
              description: 'Programming task or requirement',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50, y: baseY }
          },
          {
            id: 'plan-1',
            type: 'agentbridge',
            data: {
              label: 'Code Planning',
              nodeType: 'llm',
              description: 'Plan code structure and approach',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing, y: baseY }
          },
          {
            id: 'generate-1',
            type: 'agentbridge',
            data: {
              label: 'Code Generation',
              nodeType: 'llm',
              description: 'Generate code implementation',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY }
          },
          {
            id: 'execute-1',
            type: 'agentbridge',
            data: {
              label: 'Code Execution',
              nodeType: 'mcp',
              description: 'Execute generated code',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 3, y: baseY }
          },
          {
            id: 'validate-1',
            type: 'agentbridge',
            data: {
              label: 'Validation',
              nodeType: 'condition',
              description: 'Validate code execution results',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 4, y: baseY }
          },
          {
            id: 'output-1',
            type: 'agentbridge',
            data: {
              label: 'Code Output',
              nodeType: 'output',
              description: 'Return final code and results',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 5, y: baseY }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'plan-1', type: 'agentbridge', data: { label: 'requirements' } },
          { id: 'e2', source: 'plan-1', target: 'generate-1', type: 'agentbridge', data: { label: 'plan' } },
          { id: 'e3', source: 'generate-1', target: 'execute-1', type: 'agentbridge', data: { label: 'code' } },
          { id: 'e4', source: 'execute-1', target: 'validate-1', type: 'agentbridge', data: { label: 'results' } },
          { id: 'e5', source: 'validate-1', target: 'output-1', type: 'agentbridge', data: { label: 'success' } },
          { id: 'e6', source: 'validate-1', target: 'generate-1', type: 'agentbridge', data: { label: 'retry' } }
        ]
      };

    case 'tool-use':
      return {
        nodes: [
          {
            id: 'input-1',
            type: 'agentbridge',
            data: {
              label: 'Task Input',
              nodeType: 'input',
              description: 'Receive task requiring tool usage',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50, y: baseY }
          },
          {
            id: 'analyze-1',
            type: 'agentbridge',
            data: {
              label: 'Task Analysis',
              nodeType: 'llm',
              description: 'Analyze task requirements',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing, y: baseY }
          },
          {
            id: 'select-1',
            type: 'agentbridge',
            data: {
              label: 'Tool Selection',
              nodeType: 'condition',
              description: 'Select appropriate MCP tools',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY }
          },
          {
            id: 'execute-1',
            type: 'agentbridge',
            data: {
              label: 'Tool Execution',
              nodeType: 'mcp',
              description: 'Execute selected MCP tools',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 3, y: baseY }
          },
          {
            id: 'process-1',
            type: 'agentbridge',
            data: {
              label: 'Result Processing',
              nodeType: 'llm',
              description: 'Process and interpret tool results',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 4, y: baseY }
          },
          {
            id: 'output-1',
            type: 'agentbridge',
            data: {
              label: 'Final Result',
              nodeType: 'output',
              description: 'Return processed results',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 5, y: baseY }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'analyze-1', type: 'agentbridge', data: { label: 'task' } },
          { id: 'e2', source: 'analyze-1', target: 'select-1', type: 'agentbridge', data: { label: 'requirements' } },
          { id: 'e3', source: 'select-1', target: 'execute-1', type: 'agentbridge', data: { label: 'tools' } },
          { id: 'e4', source: 'execute-1', target: 'process-1', type: 'agentbridge', data: { label: 'raw_results' } },
          { id: 'e5', source: 'process-1', target: 'output-1', type: 'agentbridge', data: { label: 'processed' } }
        ]
      };

    case 'self-reflection':
      return {
        nodes: [
          {
            id: 'input-1',
            type: 'agentbridge',
            data: {
              label: 'Initial Task',
              nodeType: 'input',
              description: 'Receive task for iterative improvement',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50, y: baseY }
          },
          {
            id: 'attempt-1',
            type: 'agentbridge',
            data: {
              label: 'Initial Attempt',
              nodeType: 'llm',
              description: 'First attempt at solving the task',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing, y: baseY }
          },
          {
            id: 'evaluate-1',
            type: 'agentbridge',
            data: {
              label: 'Self-Evaluation',
              nodeType: 'llm',
              description: 'Evaluate attempt quality and identify issues',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY }
          },
          {
            id: 'reflect-1',
            type: 'agentbridge',
            data: {
              label: 'Reflection',
              nodeType: 'llm',
              description: 'Reflect on mistakes and improvements',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 3, y: baseY }
          },
          {
            id: 'improve-1',
            type: 'agentbridge',
            data: {
              label: 'Improvement',
              nodeType: 'llm',
              description: 'Generate improved solution',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 4, y: baseY }
          },
          {
            id: 'check-1',
            type: 'agentbridge',
            data: {
              label: 'Quality Check',
              nodeType: 'condition',
              description: 'Check if solution meets standards',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 5, y: baseY }
          },
          {
            id: 'output-1',
            type: 'agentbridge',
            data: {
              label: 'Final Solution',
              nodeType: 'output',
              description: 'Return refined solution',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 6, y: baseY }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'attempt-1', type: 'agentbridge', data: { label: 'task' } },
          { id: 'e2', source: 'attempt-1', target: 'evaluate-1', type: 'agentbridge', data: { label: 'solution' } },
          { id: 'e3', source: 'evaluate-1', target: 'reflect-1', type: 'agentbridge', data: { label: 'evaluation' } },
          { id: 'e4', source: 'reflect-1', target: 'improve-1', type: 'agentbridge', data: { label: 'insights' } },
          { id: 'e5', source: 'improve-1', target: 'check-1', type: 'agentbridge', data: { label: 'improved' } },
          { id: 'e6', source: 'check-1', target: 'output-1', type: 'agentbridge', data: { label: 'approved' } },
          { id: 'e7', source: 'check-1', target: 'evaluate-1', type: 'agentbridge', data: { label: 'iterate' } }
        ]
      };

    case 'multi-agent':
      return {
        nodes: [
          {
            id: 'input-1',
            type: 'agentbridge',
            data: {
              label: 'Complex Task',
              nodeType: 'input',
              description: 'Receive complex multi-faceted task',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50, y: baseY }
          },
          {
            id: 'coordinator-1',
            type: 'agentbridge',
            data: {
              label: 'Task Coordinator',
              nodeType: 'a2a',
              description: 'Coordinate and distribute subtasks',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing, y: baseY }
          },
          {
            id: 'agent1-1',
            type: 'agentbridge',
            data: {
              label: 'Specialist Agent 1',
              nodeType: 'a2a',
              description: 'Handle specialized subtask 1',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY - 100 }
          },
          {
            id: 'agent2-1',
            type: 'agentbridge',
            data: {
              label: 'Specialist Agent 2',
              nodeType: 'a2a',
              description: 'Handle specialized subtask 2',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY + 100 }
          },
          {
            id: 'synthesizer-1',
            type: 'agentbridge',
            data: {
              label: 'Result Synthesizer',
              nodeType: 'llm',
              description: 'Combine and synthesize agent results',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 3, y: baseY }
          },
          {
            id: 'validator-1',
            type: 'agentbridge',
            data: {
              label: 'Quality Validator',
              nodeType: 'condition',
              description: 'Validate synthesized results',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 4, y: baseY }
          },
          {
            id: 'output-1',
            type: 'agentbridge',
            data: {
              label: 'Unified Output',
              nodeType: 'output',
              description: 'Return comprehensive solution',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 5, y: baseY }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'coordinator-1', type: 'agentbridge', data: { label: 'task' } },
          { id: 'e2', source: 'coordinator-1', target: 'agent1-1', type: 'agentbridge', data: { label: 'subtask_1' } },
          { id: 'e3', source: 'coordinator-1', target: 'agent2-1', type: 'agentbridge', data: { label: 'subtask_2' } },
          { id: 'e4', source: 'agent1-1', target: 'synthesizer-1', type: 'agentbridge', data: { label: 'result_1' } },
          { id: 'e5', source: 'agent2-1', target: 'synthesizer-1', type: 'agentbridge', data: { label: 'result_2' } },
          { id: 'e6', source: 'synthesizer-1', target: 'validator-1', type: 'agentbridge', data: { label: 'synthesis' } },
          { id: 'e7', source: 'validator-1', target: 'output-1', type: 'agentbridge', data: { label: 'validated' } }
        ]
      };

    case 'agentic-rag':
      return {
        nodes: [
          {
            id: 'input-1',
            type: 'agentbridge',
            data: {
              label: 'User Query',
              nodeType: 'input',
              description: 'Receive user question or information need',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50, y: baseY }
          },
          {
            id: 'analyze-1',
            type: 'agentbridge',
            data: {
              label: 'Query Analysis',
              nodeType: 'llm',
              description: 'Analyze query intent and requirements',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing, y: baseY }
          },
          {
            id: 'retrieve-1',
            type: 'agentbridge',
            data: {
              label: 'Knowledge Retrieval',
              nodeType: 'database',
              description: 'Retrieve relevant documents/context',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 2, y: baseY }
          },
          {
            id: 'rank-1',
            type: 'agentbridge',
            data: {
              label: 'Context Ranking',
              nodeType: 'llm',
              description: 'Rank and filter retrieved context',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 3, y: baseY }
          },
          {
            id: 'generate-1',
            type: 'agentbridge',
            data: {
              label: 'Response Generation',
              nodeType: 'llm',
              description: 'Generate contextual response',
              model: 'gpt-4o',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 4, y: baseY }
          },
          {
            id: 'verify-1',
            type: 'agentbridge',
            data: {
              label: 'Fact Verification',
              nodeType: 'condition',
              description: 'Verify response accuracy',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 5, y: baseY }
          },
          {
            id: 'output-1',
            type: 'agentbridge',
            data: {
              label: 'Verified Answer',
              nodeType: 'output',
              description: 'Return verified, contextual answer',
              executionMode: config?.executionMode || 'autonomous'
            },
            position: { x: 50 + spacing * 6, y: baseY }
          }
        ],
        edges: [
          { id: 'e1', source: 'input-1', target: 'analyze-1', type: 'agentbridge', data: { label: 'query' } },
          { id: 'e2', source: 'analyze-1', target: 'retrieve-1', type: 'agentbridge', data: { label: 'search_terms' } },
          { id: 'e3', source: 'retrieve-1', target: 'rank-1', type: 'agentbridge', data: { label: 'documents' } },
          { id: 'e4', source: 'rank-1', target: 'generate-1', type: 'agentbridge', data: { label: 'context' } },
          { id: 'e5', source: 'generate-1', target: 'verify-1', type: 'agentbridge', data: { label: 'response' } },
          { id: 'e6', source: 'verify-1', target: 'output-1', type: 'agentbridge', data: { label: 'verified' } },
          { id: 'e7', source: 'verify-1', target: 'retrieve-1', type: 'agentbridge', data: { label: 'refine' } }
        ]
      };

    default:
      return { nodes: [], edges: [] };
  }
};

// Workflow Canvas Component
const WorkflowCanvas: React.FC<{
  initialWorkflow?: any;
  onSave: (workflow: any) => void;
  onExport: (workflow: any) => void;
  onPublish: (workflow: any) => void;
  onBack: () => void;
}> = ({ initialWorkflow, onSave, onExport, onPublish, onBack }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [showNodePalette, setShowNodePalette] = useState(true);
  const [workflowMetadata, setWorkflowMetadata] = useState({
    name: initialWorkflow?.name || 'Untitled Workflow',
    description: initialWorkflow?.description || '',
    tags: initialWorkflow?.tags || [],
    industry: initialWorkflow?.industry || '',
    executionMode: initialWorkflow?.executionMode || 'autonomous',
    pattern: initialWorkflow?.pattern || 'react'
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { project } = useReactFlow();

  // Track changes for auto-save
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [nodes, edges, workflowMetadata]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'agentbridge',
        data: { 
          label: 'connect', 
          animated: false,
          color: '#002855'
        },
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setShowConfigDrawer(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeData = event.dataTransfer.getData('application/reactflow');

      if (!nodeData || !reactFlowBounds) return;

      const parsedData = JSON.parse(nodeData);
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'agentbridge',
        position,
        data: {
          ...parsedData,
          label: parsedData.name || 'New Node',
          nodeType: parsedData.nodeType,
          category: parsedData.category,
          config: parsedData.nodeConfig || {},
          executionMode: workflowMetadata.executionMode
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes, workflowMetadata.executionMode]
  );

  const handleSave = useCallback(() => {
    const workflow = {
      ...workflowMetadata,
      nodes,
      edges,
      lastModified: new Date().toISOString(),
      version: '1.0.0'
    };
    onSave(workflow);
    setHasUnsavedChanges(false);
  }, [nodes, edges, workflowMetadata, onSave]);

  const handleExport = useCallback(() => {
    const langGraphWorkflow = {
      name: workflowMetadata.name,
      description: workflowMetadata.description,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data.nodeType,
        config: node.data.config,
        position: node.position
      })),
      edges: edges.map(edge => ({
        source: edge.source,
        target: edge.target,
        condition: edge.data?.label || 'default'
      })),
      metadata: {
        ...workflowMetadata,
        exportedAt: new Date().toISOString(),
        format: 'langgraph',
        version: '1.0.0'
      }
    };
    
    // Download as JSON file
    const blob = new Blob([JSON.stringify(langGraphWorkflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowMetadata.name.toLowerCase().replace(/\s+/g, '-')}-langgraph.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onExport(langGraphWorkflow);
  }, [nodes, edges, workflowMetadata, onExport]);

  const handlePublish = useCallback(() => {
    const publishData = {
      ...workflowMetadata,
      nodes,
      edges,
      publishedAt: new Date().toISOString(),
      status: 'published',
      analytics: {
        views: 0,
        deployments: 0,
        rating: 0,
        reviews: 0
      }
    };
    onPublish(publishData);
  }, [nodes, edges, workflowMetadata, onPublish]);

  const executeWorkflow = useCallback(() => {
    setIsExecuting(true);
    
    // Simulate workflow execution
    const nodeIds = nodes.map(n => n.id);
    let currentIndex = 0;
    
    const executeNext = () => {
      if (currentIndex < nodeIds.length) {
        const nodeId = nodeIds[currentIndex];
        
        // Update node status to running
        setNodes(nds => nds.map(node => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, status: 'running' } }
            : { ...node, data: { ...node.data, status: node.data.status === 'running' ? 'success' : node.data.status } }
        ));
        
        // Animate edges
        setEdges(eds => eds.map(edge => 
          edge.source === nodeId || edge.target === nodeId
            ? { ...edge, data: { ...edge.data, animated: true } }
            : edge
        ));
        
        setTimeout(() => {
          // Mark as success and move to next
          setNodes(nds => nds.map(node => 
            node.id === nodeId 
              ? { ...node, data: { ...node.data, status: 'success' } }
              : node
          ));
          
          currentIndex++;
          if (currentIndex < nodeIds.length) {
            executeNext();
          } else {
            setIsExecuting(false);
            // Reset animations
            setEdges(eds => eds.map(edge => ({ ...edge, data: { ...edge.data, animated: false } })));
          }
        }, 1500);
      }
    };
    
    executeNext();
  }, [nodes, setNodes, setEdges]);

  const handleNodeConfigSave = useCallback((nodeConfig: any) => {
    if (selectedNode) {
      setNodes(nds => nds.map(node => 
        node.id === selectedNode.id 
          ? { ...node, data: { ...node.data, config: nodeConfig.config } }
          : node
      ));
    }
    setShowConfigDrawer(false);
    setSelectedNode(null);
  }, [selectedNode, setNodes]);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Action Bar */}
      <div className="bg-white dark:bg-card-bg border-b border-gray-200 dark:border-card-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
            
            <div>
              <input
                type="text"
                value={workflowMetadata.name}
                onChange={(e) => setWorkflowMetadata(prev => ({ ...prev, name: e.target.value }))}
                className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2 py-1 text-gray-900 dark:text-text-primary"
              />
              <p className="text-sm text-gray-600 dark:text-text-muted">
                {nodes.length} nodes • {edges.length} connections • {workflowMetadata.pattern.toUpperCase()}
                {hasUnsavedChanges && <span className="text-orange-500 ml-2">• Unsaved changes</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Execution Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-secondary rounded-2xl p-1">
              {['hitl', 'autonomous', 'hybrid'].map((mode) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWorkflowMetadata(prev => ({ ...prev, executionMode: mode }))}
                  className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                    workflowMetadata.executionMode === mode
                      ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                  }`}
                >
                  {mode.toUpperCase()}
                </motion.button>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={executeWorkflow}
              disabled={isExecuting || nodes.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute</span>
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-2xl hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export LangGraph</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePublish}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Publish</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex">
        {/* Node Palette */}
        {showNodePalette && (
          <NodePalette
            onNodeDrag={(nodeType, event) => {
              // Handle drag start
            }}
            onNodeClick={(nodeType) => {
              // Handle node click from palette
            }}
            isCollapsed={false}
            onToggleCollapse={() => setShowNodePalette(!showNodePalette)}
          />
        )}

        {/* Main Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid={true}
            snapGrid={[20, 20]}
            defaultEdgeOptions={{
              type: 'agentbridge',
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2, stroke: '#002855' },
            }}
            className="bg-gray-50 dark:bg-gray-900"
            proOptions={{ hideAttribution: true }}
          >
            <Controls 
              className="bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-2xl shadow-lg"
              showInteractive={false}
            />
            <Background 
              gap={20} 
              size={1}
              className="bg-gray-100 dark:bg-gray-800" 
              color="#e5e7eb"
              variant="dots"
            />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.data.nodeType) {
                  case 'llm': return '#3b82f6';
                  case 'mcp': return '#f97316';
                  case 'a2a': return '#6366f1';
                  case 'template': return '#8b5cf6';
                  case 'condition': return '#eab308';
                  case 'loop': return '#06b6d4';
                  case 'output': return '#22c55e';
                  case 'input': return '#6b7280';
                  default: return '#6b7280';
                }
              }}
              className="bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-2xl shadow-lg"
              pannable
              zoomable
            />

            {/* Canvas Status Panel */}
            <Panel position="top-center">
              <div className="bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-2xl shadow-lg px-4 py-2">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-700 dark:text-text-muted">Canvas Ready</span>
                  </div>
                  <div className="text-gray-400">|</div>
                  <span className="text-gray-600 dark:text-text-muted">
                    Mode: {workflowMetadata.executionMode.toUpperCase()}
                  </span>
                  <div className="text-gray-400">|</div>
                  <span className="text-gray-600 dark:text-text-muted">
                    Pattern: {workflowMetadata.pattern.toUpperCase()}
                  </span>
                </div>
              </div>
            </Panel>

            {/* Toggle Palette Button */}
            <Panel position="top-left">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNodePalette(!showNodePalette)}
                className="bg-white dark:bg-card-bg border border-gray-200 dark:border-card-border rounded-2xl shadow-lg p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
              >
                {showNodePalette ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </motion.button>
            </Panel>
          </ReactFlow>

          {/* SVG Definitions for Markers */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#002855"
                />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Node Config Drawer */}
        <NodeConfigDrawer
          isOpen={showConfigDrawer}
          onClose={() => {
            setShowConfigDrawer(false);
            setSelectedNode(null);
          }}
          nodeConfig={selectedNode ? {
            id: selectedNode.id,
            type: selectedNode.data.nodeType,
            category: selectedNode.data.category,
            name: selectedNode.data.label,
            description: selectedNode.data.description || '',
            config: selectedNode.data.config || {},
            supabaseTable: selectedNode.data.supabaseTable || 'workflow_nodes'
          } : null}
          onSave={handleNodeConfigSave}
          onTest={async (config) => {
            // Simulate testing
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Connection successful' };
          }}
        />
      </div>
    </div>
  );
};

// Prompt Generator Component
const PromptGenerator: React.FC<{ onGenerate: (workflow: any) => void; onBack: () => void }> = ({ onGenerate, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    domain: '',
    taskType: '',
    executionMode: 'autonomous',
    dataTools: '',
    businessGoal: '',
    freeformDescription: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const analyzeAndGenerate = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Intelligent pattern recommendation based on inputs
    let recommendedPattern = 'react';
    
    if (formData.taskType.includes('Code') || formData.taskType.includes('Programming')) {
      recommendedPattern = 'codeact';
    } else if (formData.taskType.includes('Multi') || formData.businessGoal.includes('collaborate')) {
      recommendedPattern = 'multi-agent';
    } else if (formData.dataTools.includes('Database') || formData.taskType.includes('Research')) {
      recommendedPattern = 'agentic-rag';
    } else if (formData.dataTools.includes('API') || formData.dataTools.includes('Tool')) {
      recommendedPattern = 'tool-use';
    } else if (formData.businessGoal.includes('improve') || formData.businessGoal.includes('learn')) {
      recommendedPattern = 'self-reflection';
    }
    
    const workflow = generateWorkflowFromPattern(recommendedPattern, {
      executionMode: formData.executionMode,
      domain: formData.domain,
      taskType: formData.taskType
    });
    
    const workflowData = {
      name: `${formData.domain} ${formData.taskType} Agent`,
      description: formData.businessGoal || formData.freeformDescription,
      pattern: recommendedPattern,
      executionMode: formData.executionMode,
      industry: formData.domain,
      ...workflow
    };
    
    setIsGenerating(false);
    onGenerate(workflowData);
  }, [formData, onGenerate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Workshop</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
              🧠 Prompt Generator
            </h1>
            <p className="text-gray-600 dark:text-text-muted">
              Step {step} of 5 - Let's build your perfect agentic workflow
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-text-muted">Progress</span>
            <span className="text-sm text-gray-600 dark:text-text-muted">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-card-bg rounded-2xl shadow-xl p-8 mb-8"
        >
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">
                What is your domain?
              </h2>
              <p className="text-gray-600 dark:text-text-muted mb-6">
                Select the industry or domain where your agent will operate
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {domains.map((domain) => (
                  <motion.button
                    key={domain}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, domain }))}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      formData.domain === domain
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-text-primary">{domain}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">
                What kind of decision or task should the agent perform?
              </h2>
              <p className="text-gray-600 dark:text-text-muted mb-6">
                Choose the primary function your agent will handle
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {taskTypes.map((task) => (
                  <motion.button
                    key={task}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, taskType: task }))}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      formData.taskType === task
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-text-primary">{task}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">
                Should it be autonomous or include HITL (Human-in-the-Loop)?
              </h2>
              <p className="text-gray-600 dark:text-text-muted mb-6">
                Choose how much human oversight your agent needs
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    mode: 'autonomous',
                    title: 'Fully Autonomous',
                    description: 'Agent operates independently without human intervention',
                    icon: Zap,
                    color: 'from-green-500 to-green-600'
                  },
                  {
                    mode: 'hitl',
                    title: 'Human-in-the-Loop',
                    description: 'Human approval required for critical decisions',
                    icon: Users,
                    color: 'from-orange-500 to-orange-600'
                  },
                  {
                    mode: 'hybrid',
                    title: 'Hybrid Mode',
                    description: 'Autonomous with human oversight for complex cases',
                    icon: Shield,
                    color: 'from-purple-500 to-purple-600'
                  }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.mode}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, executionMode: option.mode }))}
                      className={`p-6 rounded-xl border-2 text-center transition-colors ${
                        formData.executionMode === option.mode
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-text-primary mb-2">{option.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-text-muted">{option.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">
                What kind of data/tools does it interact with?
              </h2>
              <p className="text-gray-600 dark:text-text-muted mb-6">
                Select the data sources and tools your agent will use
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataToolTypes.map((tool) => (
                  <motion.button
                    key={tool}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, dataTools: tool }))}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      formData.dataTools === tool
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900 dark:text-text-primary">{tool}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">
                Describe the business goal in one sentence
              </h2>
              <p className="text-gray-600 dark:text-text-muted mb-6">
                What specific business outcome should this agent achieve?
              </p>
              <textarea
                rows={4}
                value={formData.businessGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, businessGoal: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary resize-none"
                placeholder="e.g., Automatically process customer support tickets and route them to the appropriate department while maintaining 95% accuracy..."
              />
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                  Or provide a freeform use case description
                </h3>
                <textarea
                  rows={6}
                  value={formData.freeformDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, freeformDescription: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary resize-none"
                  placeholder="Describe your use case in detail. Include any specific requirements, constraints, or expected outcomes..."
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-xl hover:bg-gray-50 dark:hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </motion.button>

          {step < 5 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.domain) ||
                (step === 2 && !formData.taskType) ||
                (step === 4 && !formData.dataTools)
              }
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeAndGenerate}
              disabled={isGenerating || (!formData.businessGoal && !formData.freeformDescription)}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Workflow</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

// Import Workflow Component
const ImportWorkflow: React.FC<{ onImport: (workflow: any) => void; onBack: () => void }> = ({ onImport, onBack }) => {
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleImport = async () => {
    if (!uploadedFile || !selectedFramework || !selectedProvider) return;
    
    setIsImporting(true);
    
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a sample workflow based on framework
    const workflow = generateWorkflowFromPattern('react', {
      executionMode: 'autonomous',
      framework: selectedFramework,
      provider: selectedProvider
    });
    
    const workflowData = {
      name: `Imported ${selectedFramework} Workflow`,
      description: `Workflow imported from ${selectedFramework} using ${selectedProvider}`,
      pattern: 'react',
      executionMode: 'autonomous',
      framework: selectedFramework,
      provider: selectedProvider,
      ...workflow
    };
    
    setIsImporting(false);
    onImport(workflowData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Workshop</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
              📂 Import Workflow
            </h1>
            <p className="text-gray-600 dark:text-text-muted">
              Import existing workflows from popular frameworks
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-card-bg rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">
              Choose Framework
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frameworks.map((framework) => (
                <motion.button
                  key={framework.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFramework(framework.id)}
                  className={`p-6 rounded-xl border-2 text-center transition-colors ${
                    selectedFramework === framework.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${framework.color} flex items-center justify-center text-2xl`}>
                    {framework.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-text-primary">{framework.name}</h3>
                </motion.button>
              ))}
            </div>
            
            {selectedFramework && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(2)}
                className="mt-8 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-card-bg rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">
              Select LLM Provider
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {llmProviders.map((provider) => (
                <motion.button
                  key={provider.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-6 rounded-xl border-2 text-center transition-colors ${
                    selectedProvider === provider.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-2xl`}>
                    {provider.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-text-primary">{provider.name}</h3>
                </motion.button>
              ))}
            </div>
            
            {selectedProvider && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(3)}
                className="mt-8 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-card-bg rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-6">
              Upload Workflow File
            </h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-card-border rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-text-muted mb-4">
                Upload your {selectedFramework} workflow file (.json, .ts, .py)
              </p>
              <input
                type="file"
                accept=".json,.ts,.py"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Choose File
              </label>
              {uploadedFile && (
                <p className="mt-4 text-green-600 dark:text-green-400">
                  ✓ {uploadedFile.name} uploaded
                </p>
              )}
            </div>
            
            {uploadedFile && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                disabled={isImporting}
                className="mt-8 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isImporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <FolderOpen className="w-4 h-4" />
                    <span>Import Workflow</span>
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-xl hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Agentic Pattern Selector Component
const AgenticPatternSelector: React.FC<{ onSelect: (workflow: any) => void; onBack: () => void }> = ({ onSelect, onBack }) => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const handlePatternSelect = (patternId: string) => {
    const pattern = agenticPatterns.find(p => p.id === patternId);
    if (!pattern) return;

    const workflow = generateWorkflowFromPattern(patternId, {
      executionMode: 'autonomous'
    });

    const workflowData = {
      name: `${pattern.name} Workflow`,
      description: pattern.description,
      pattern: patternId,
      executionMode: 'autonomous',
      useCase: pattern.useCase,
      ...workflow
    };

    onSelect(workflowData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Workshop</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
              🛠️ Choose Agentic Pattern
            </h1>
            <p className="text-gray-600 dark:text-text-muted">
              Select the perfect pattern for your use case
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer */}
        </div>

        {/* Pattern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agenticPatterns.map((pattern, index) => {
            const Icon = pattern.icon;
            return (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-white dark:bg-card-bg rounded-2xl shadow-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedPattern === pattern.id
                    ? 'border-blue-500 shadow-blue-200/50'
                    : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                }`}
                onClick={() => setSelectedPattern(pattern.id)}
              >
                {/* Pattern Header */}
                <div className={`p-6 bg-gradient-to-br ${pattern.color} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <motion.a
                      href={pattern.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{pattern.name}</h3>
                  <p className="text-white/90 text-sm">{pattern.description}</p>
                </div>

                {/* Pattern Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Use Cases</h4>
                    <p className="text-gray-600 dark:text-text-muted text-sm">{pattern.useCase}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Flow Preview</h4>
                    <div className="bg-gray-50 dark:bg-secondary rounded-lg p-3">
                      <code className="text-xs text-gray-700 dark:text-text-muted font-mono">
                        {pattern.preview}
                      </code>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatternSelect(pattern.id);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                      selectedPattern === pattern.id
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted hover:bg-gray-200 dark:hover:bg-card-bg'
                    }`}
                  >
                    Initialize Canvas
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main Workshop Component
const Workshop: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'canvas' | 'prompt' | 'import' | 'pattern' | 'templates'>('landing');
  const [currentWorkflow, setCurrentWorkflow] = useState<any>(null);

  const handleWorkflowGenerated = useCallback((workflow: any) => {
    setCurrentWorkflow(workflow);
    setCurrentView('canvas');
  }, []);

  const handleSaveWorkflow = useCallback((workflow: any) => {
    console.log('Saving workflow:', workflow);
    // Here you would save to Supabase
  }, []);

  const handleExportWorkflow = useCallback((workflow: any) => {
    console.log('Exporting workflow:', workflow);
    // Here you would export to LangGraph format
  }, []);

  const handlePublishWorkflow = useCallback((workflow: any) => {
    console.log('Publishing workflow:', workflow);
    // Here you would publish to marketplace
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentView('landing');
    setCurrentWorkflow(null);
  }, []);

  // Landing Screen
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                scale: 0 
              }}
              animate={{ 
                y: [null, -100, (typeof window !== 'undefined' ? window.innerHeight : 1080) + 100],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto text-center">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-16"
            >
              <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                🛠️ Agent Builder
              </h1>
              <p className="text-xl text-blue-200 mb-4">
                Create production-ready agentic workflows with LangGraph compatibility
              </p>
              <p className="text-lg text-blue-300">
                Choose your preferred entry point to start building
              </p>
            </motion.div>

            {/* Entry Point Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  id: 'prompt',
                  icon: '🧠',
                  title: 'Prompt Generator',
                  description: 'AI-guided workflow creation through intelligent prompts',
                  gradient: 'from-blue-500 to-cyan-600',
                  hoverGradient: 'from-blue-600 to-cyan-700'
                },
                {
                  id: 'import',
                  icon: '📂',
                  title: 'Import Workflow',
                  description: 'Import from LangGraph, CrewAI, Autogen, and more',
                  gradient: 'from-green-500 to-emerald-600',
                  hoverGradient: 'from-green-600 to-emerald-700'
                },
                {
                  id: 'pattern',
                  icon: '🛠️',
                  title: 'Choose Agentic Pattern',
                  description: 'Start with proven patterns: ReAct, RAG, Multi-Agent',
                  gradient: 'from-purple-500 to-violet-600',
                  hoverGradient: 'from-purple-600 to-violet-700'
                },
                {
                  id: 'templates',
                  icon: '📚',
                  title: 'Templates Library',
                  description: '1000+ production-ready workflows across industries',
                  gradient: 'from-orange-500 to-red-600',
                  hoverGradient: 'from-orange-600 to-red-700'
                }
              ].map((entry, index) => (
                <motion.button
                  key={entry.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView(entry.id as any)}
                  className={`group relative p-8 rounded-2xl bg-gradient-to-br ${entry.gradient} hover:${entry.hoverGradient} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {entry.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{entry.title}</h3>
                    <p className="text-white/90 leading-relaxed">{entry.description}</p>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 text-center"
            >
              <p className="text-blue-300 mb-4">
                All workflows are LangGraph-compatible and production-ready
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-blue-400">
                <span>✓ Drag & Drop Canvas</span>
                <span>✓ Node Configuration</span>
                <span>✓ Export to LangGraph</span>
                <span>✓ Publish to Marketplace</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate view
  return (
    <ReactFlowProvider>
      {currentView === 'canvas' && (
        <WorkflowCanvas
          initialWorkflow={currentWorkflow}
          onSave={handleSaveWorkflow}
          onExport={handleExportWorkflow}
          onPublish={handlePublishWorkflow}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'prompt' && (
        <PromptGenerator
          onGenerate={handleWorkflowGenerated}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'import' && (
        <ImportWorkflow
          onImport={handleWorkflowGenerated}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'pattern' && (
        <AgenticPatternSelector
          onSelect={handleWorkflowGenerated}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'templates' && (
        <TemplatesLibrary
          onSelectTemplate={handleWorkflowGenerated}
          onBack={handleBackToLanding}
        />
      )}
    </ReactFlowProvider>
  );
};

export default Workshop;