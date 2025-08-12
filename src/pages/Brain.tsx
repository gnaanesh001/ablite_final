import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainIcon as Brain, 
  Server, 
  Network, 
  Code, 
  Play, 
  Download, 
  Upload, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Terminal, 
  Cloud, 
  GitBranch, 
  Zap, 
  Users, 
  MessageSquare, 
  Database, 
  Shield, 
  Eye, 
  Edit3, 
  Trash2, 
  Copy, 
  RefreshCw, 
  ExternalLink,
  Plus,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Save,
  X,
  Globe,
  Container,
  Layers,
  Activity,
  Target,
  Link,
  Workflow,
  Bot,
  Cpu,
  HardDrive,
  Monitor
} from 'lucide-react';

// Types
interface MCPServer {
  id: string;
  name: string;
  status: 'building' | 'deployed' | 'failed' | 'stopped';
  version: string;
  endpoint?: string;
  tools: string[];
  createdAt: string;
  lastDeployed?: string;
  logs: string[];
  metadata: {
    runtime: string;
    memory: string;
    timeout: number;
  };
}

interface A2AAgent {
  id: string;
  name: string;
  type: 'initiator' | 'responder' | 'relay';
  status: 'draft' | 'deployed' | 'active' | 'error';
  version: string;
  capabilities: string[];
  intents: string[];
  endpoint?: string;
  createdAt: string;
  lastActive?: string;
  metadata: {
    protocol: string;
    timeout: number;
    retries: number;
  };
}

interface Tool {
  id: string;
  name: string;
  description: string;
  inputSchema: any;
  outputSchema: any;
  category: string;
}

interface Intent {
  id: string;
  name: string;
  description: string;
  agentRole: string;
  timeout: number;
  retries: number;
  schema: any;
}

const BrainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'a2a'>('mcp');
  const [mcpTab, setMcpTab] = useState<'builder' | 'servers' | 'registry'>('builder');
  const [a2aTab, setA2aTab] = useState<'builder' | 'agents' | 'intents'>('builder');
  
  // MCP Builder State
  const [mcpCurrentStep, setMcpCurrentStep] = useState(1);
  const [mcpExpandedSteps, setMcpExpandedSteps] = useState<number[]>([1]);
  const [mcpFormData, setMcpFormData] = useState({
    template: '',
    serverName: '',
    description: '',
    tools: [] as Tool[],
    runtime: 'python',
    timeout: 30,
    maxTokens: 1000,
    temperature: 0.7,
    authModel: 'api_key',
    tags: [] as string[],
    llms: [] as string[],
    dockerfile: '',
    deploymentConfig: {
      resourceGroup: 'rg-agentbridge',
      containerApp: '',
      registry: 'agentbridge.azurecr.io'
    }
  });
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [mcpTools, setMcpTools] = useState<Tool[]>([
    {
      id: 'fetch_webpage',
      name: 'Fetch Webpage',
      description: 'Fetch and parse webpage content',
      inputSchema: { url: 'string', timeout: 'number' },
      outputSchema: { content: 'string', title: 'string' },
      category: 'web'
    },
    {
      id: 'query_database',
      name: 'Query Database',
      description: 'Execute SQL queries on connected databases',
      inputSchema: { query: 'string', database: 'string' },
      outputSchema: { rows: 'array', count: 'number' },
      category: 'data'
    }
  ]);
  const [mcpIsBuilding, setMcpIsBuilding] = useState(false);
  const [mcpBuildLogs, setMcpBuildLogs] = useState<string[]>([]);
  
  // A2A Builder State
  const [a2aCurrentStep, setA2aCurrentStep] = useState(1);
  const [a2aExpandedSteps, setA2aExpandedSteps] = useState<number[]>([1]);
  const [a2aFormData, setA2aFormData] = useState({
    agentName: '',
    agentType: 'initiator' as 'initiator' | 'responder' | 'relay',
    description: '',
    capabilities: [] as string[],
    protocol: 'sequential',
    handshakeLogic: '',
    events: [] as string[],
    intents: [] as string[],
    timeout: 30,
    retries: 3,
    deploymentTarget: 'fastapi',
    tags: [] as string[]
  });
  const [a2aAgents, setA2aAgents] = useState<A2AAgent[]>([]);
  const [a2aIntents, setA2aIntents] = useState<Intent[]>([
    {
      id: 'task_complete',
      name: 'Task Complete',
      description: 'Signal when a task is completed',
      agentRole: 'responder',
      timeout: 10,
      retries: 2,
      schema: { taskId: 'string', result: 'object' }
    },
    {
      id: 'error_handling',
      name: 'Error Handling',
      description: 'Handle and propagate errors between agents',
      agentRole: 'relay',
      timeout: 5,
      retries: 1,
      schema: { error: 'string', context: 'object' }
    }
  ]);
  const [a2aIsDeploying, setA2aIsDeploying] = useState(false);
  const [a2aDeployLogs, setA2aDeployLogs] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // MCP Builder Functions
  const handleMcpStepToggle = useCallback((step: number) => {
    setMcpExpandedSteps(prev => 
      prev.includes(step) 
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  }, []);

  const handleMcpTemplateSelect = useCallback((template: string) => {
    setMcpFormData(prev => ({ ...prev, template }));
    
    if (template === 'fastapi') {
      setMcpFormData(prev => ({
        ...prev,
        dockerfile: `FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`
      }));
    }
    
    setMcpCurrentStep(2);
    setMcpExpandedSteps([2]);
  }, []);

  const handleMcpFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File uploaded:', file.name, content.substring(0, 100));
        // Process uploaded file
        setMcpFormData(prev => ({ ...prev, serverName: file.name.replace(/\.[^/.]+$/, "") }));
      };
      reader.readAsText(file);
    }
  }, []);

  const handleMcpAddTool = useCallback((toolId: string) => {
    const tool = mcpTools.find(t => t.id === toolId);
    if (tool && !mcpFormData.tools.find(t => t.id === toolId)) {
      setMcpFormData(prev => ({
        ...prev,
        tools: [...prev.tools, tool]
      }));
    }
  }, [mcpTools, mcpFormData.tools]);

  const handleMcpRemoveTool = useCallback((toolId: string) => {
    setMcpFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== toolId)
    }));
  }, []);

  const handleMcpBuild = useCallback(async () => {
    if (!mcpFormData.serverName) {
      alert('Please provide a server name');
      return;
    }

    setMcpIsBuilding(true);
    setMcpBuildLogs(['Starting build process...']);

    // Simulate build process
    const buildSteps = [
      'Validating configuration...',
      'Generating Dockerfile...',
      'Building Docker image...',
      'Pushing to registry...',
      'Deploying to Azure Container Apps...',
      'Configuring endpoints...',
      'Running health checks...',
      'Build completed successfully!'
    ];

    for (let i = 0; i < buildSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMcpBuildLogs(prev => [...prev, buildSteps[i]]);
    }

    const newServer: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: mcpFormData.serverName,
      status: 'deployed',
      version: '1.0.0',
      endpoint: `https://${mcpFormData.deploymentConfig.containerApp}.azurecontainerapps.io`,
      tools: mcpFormData.tools.map(t => t.name),
      createdAt: new Date().toISOString(),
      lastDeployed: new Date().toISOString(),
      logs: [...mcpBuildLogs],
      metadata: {
        runtime: mcpFormData.runtime,
        memory: '512MB',
        timeout: mcpFormData.timeout
      }
    };

    setMcpServers(prev => [newServer, ...prev]);
    setMcpIsBuilding(false);
    setMcpCurrentStep(5);
    setMcpExpandedSteps([5]);
  }, [mcpFormData, mcpBuildLogs]);

  const handleMcpDownloadConfig = useCallback(() => {
    const config = {
      name: mcpFormData.serverName,
      tools: mcpFormData.tools,
      runtime: mcpFormData.runtime,
      deployment: mcpFormData.deploymentConfig,
      dockerfile: mcpFormData.dockerfile
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mcpFormData.serverName}-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mcpFormData]);

  const handleMcpTestServer = useCallback(async (server: MCPServer) => {
    console.log('Testing server:', server.name);
    // Simulate server test
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Server ${server.name} is responding correctly!`);
  }, []);

  // A2A Builder Functions
  const handleA2aStepToggle = useCallback((step: number) => {
    setA2aExpandedSteps(prev => 
      prev.includes(step) 
        ? prev.filter(s => s !== step)
        : [...prev, step]
    );
  }, []);

  const handleA2aAgentTypeSelect = useCallback((type: 'initiator' | 'responder' | 'relay') => {
    setA2aFormData(prev => ({ ...prev, agentType: type }));
    setA2aCurrentStep(2);
    setA2aExpandedSteps([2]);
  }, []);

  const handleA2aProtocolSelect = useCallback((protocol: string) => {
    setA2aFormData(prev => ({ ...prev, protocol }));
    
    // Set default handshake logic based on protocol
    let handshakeLogic = '';
    switch (protocol) {
      case 'sequential':
        handshakeLogic = `async def handshake(self, target_agent):
    response = await target_agent.ping()
    if response.status == "ready":
        return await self.establish_connection(target_agent)
    return False`;
        break;
      case 'chat':
        handshakeLogic = `async def handshake(self, target_agent):
    await target_agent.send_message({
        "type": "handshake",
        "agent_id": self.id,
        "capabilities": self.capabilities
    })`;
        break;
      case 'signal':
        handshakeLogic = `async def handshake(self, target_agent):
    signal = await self.create_signal_channel(target_agent)
    return await signal.establish()`;
        break;
    }
    
    setA2aFormData(prev => ({ ...prev, handshakeLogic }));
  }, []);

  const handleA2aAddIntent = useCallback((intentId: string) => {
    if (!a2aFormData.intents.includes(intentId)) {
      setA2aFormData(prev => ({
        ...prev,
        intents: [...prev.intents, intentId]
      }));
    }
  }, [a2aFormData.intents]);

  const handleA2aRemoveIntent = useCallback((intentId: string) => {
    setA2aFormData(prev => ({
      ...prev,
      intents: prev.intents.filter(i => i !== intentId)
    }));
  }, []);

  const handleA2aDeploy = useCallback(async () => {
    if (!a2aFormData.agentName) {
      alert('Please provide an agent name');
      return;
    }

    setA2aIsDeploying(true);
    setA2aDeployLogs(['Starting A2A agent deployment...']);

    const deploySteps = [
      'Validating agent configuration...',
      'Generating agent.yaml...',
      'Setting up communication protocols...',
      'Registering capabilities and intents...',
      'Deploying to target environment...',
      'Configuring agent endpoints...',
      'Testing agent communication...',
      'Agent deployed successfully!'
    ];

    for (let i = 0; i < deploySteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setA2aDeployLogs(prev => [...prev, deploySteps[i]]);
    }

    const newAgent: A2AAgent = {
      id: `a2a-${Date.now()}`,
      name: a2aFormData.agentName,
      type: a2aFormData.agentType,
      status: 'deployed',
      version: '1.0.0',
      capabilities: a2aFormData.capabilities,
      intents: a2aFormData.intents,
      endpoint: `https://a2a-${a2aFormData.agentName.toLowerCase()}.azurecontainerapps.io`,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      metadata: {
        protocol: a2aFormData.protocol,
        timeout: a2aFormData.timeout,
        retries: a2aFormData.retries
      }
    };

    setA2aAgents(prev => [newAgent, ...prev]);
    setA2aIsDeploying(false);
    setA2aCurrentStep(5);
    setA2aExpandedSteps([5]);
  }, [a2aFormData, a2aDeployLogs]);

  const handleA2aDownloadConfig = useCallback(() => {
    const agentYaml = `name: ${a2aFormData.agentName}
type: ${a2aFormData.agentType}
description: ${a2aFormData.description}
protocol: ${a2aFormData.protocol}
capabilities:
${a2aFormData.capabilities.map(cap => `  - ${cap}`).join('\n')}
intents:
${a2aFormData.intents.map(intent => `  - ${intent}`).join('\n')}
timeout: ${a2aFormData.timeout}
retries: ${a2aFormData.retries}
handshake_logic: |
${a2aFormData.handshakeLogic.split('\n').map(line => `  ${line}`).join('\n')}`;

    const blob = new Blob([agentYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${a2aFormData.agentName}-agent.yaml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [a2aFormData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'building':
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'stopped':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'building':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'stopped':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <span>Core Agent Logic</span>
            </h1>
            <p className="text-gray-600 dark:text-text-muted">Build and deploy MCP servers and A2A protocol agents</p>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex space-x-8 mt-6">
          {[
            { id: 'mcp', label: 'MCP Protocol', icon: Server, description: 'Model Context Protocol servers' },
            { id: 'a2a', label: 'A2A Protocol', icon: Network, description: 'Agent-to-Agent communication' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-text-muted hover:text-gray-700 dark:hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div>{tab.label}</div>
                  <div className="text-xs text-gray-500 dark:text-text-muted">{tab.description}</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'mcp' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* MCP Sub-tabs */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-4">
              <div className="flex space-x-6">
                {[
                  { id: 'builder', label: 'MCP Builder', icon: Code },
                  { id: 'servers', label: 'My MCP Servers', icon: Server },
                  { id: 'registry', label: 'Tool Registry', icon: Database },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMcpTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        mcpTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-card-bg'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* MCP Builder Content */}
            {mcpTab === 'builder' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Progress Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">Build Progress</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Choose Template', icon: FileText },
                        { step: 2, title: 'Define Logic', icon: Code },
                        { step: 3, title: 'Configure Metadata', icon: Settings },
                        { step: 4, title: 'Package & Deploy', icon: Cloud },
                        { step: 5, title: 'Register Server', icon: CheckCircle },
                      ].map(({ step, title, icon: Icon }) => (
                        <motion.button
                          key={step}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setMcpCurrentStep(step);
                            handleMcpStepToggle(step);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            mcpCurrentStep === step
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                              : mcpCurrentStep > step
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'text-gray-600 dark:text-text-muted hover:bg-gray-100 dark:hover:bg-card-bg'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">Step {step}</div>
                            <div className="text-sm">{title}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    {mcpCurrentStep === 1 && (
                      <motion.div
                        key="mcp-step-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Choose Template or Start from Scratch</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {[
                            { id: 'fastapi', name: 'FastAPI Template', description: 'Pre-configured FastAPI server with Docker', icon: Zap },
                            { id: 'blank', name: 'Blank Template', description: 'Start with empty configuration', icon: FileText },
                            { id: 'import', name: 'Import Existing', description: 'Upload existing MCP codebase', icon: Upload },
                          ].map((template) => {
                            const Icon = template.icon;
                            return (
                              <motion.button
                                key={template.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => template.id === 'import' ? fileInputRef.current?.click() : handleMcpTemplateSelect(template.id)}
                                className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
                                  mcpFormData.template === template.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-card-border hover:border-blue-400'
                                }`}
                              >
                                <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-text-muted" />
                                <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">{template.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-text-muted">{template.description}</p>
                              </motion.button>
                            );
                          })}
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".zip,.py,.json,.yaml"
                          onChange={handleMcpFileUpload}
                          className="hidden"
                        />

                        {mcpFormData.template && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t border-gray-200 dark:border-card-border pt-6"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Template Preview</h4>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                              {mcpFormData.template === 'fastapi' && (
                                <pre>{`from fastapi import FastAPI
from mcp import MCPServer

app = FastAPI()
mcp = MCPServer()

@app.get("/tools")
async def list_tools():
    return mcp.get_tools()

@app.post("/tools/{tool_name}")
async def execute_tool(tool_name: str, params: dict):
    return await mcp.execute_tool(tool_name, params)`}</pre>
                              )}
                              {mcpFormData.template === 'blank' && (
                                <pre>{`# Your MCP server code will go here
# Start building your custom server logic`}</pre>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {mcpCurrentStep === 2 && (
                      <motion.div
                        key="mcp-step-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Define MCP Server Logic</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Server Configuration</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Server Name *
                                </label>
                                <input
                                  type="text"
                                  value={mcpFormData.serverName}
                                  onChange={(e) => setMcpFormData(prev => ({ ...prev, serverName: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                  placeholder="my-mcp-server"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Description
                                </label>
                                <textarea
                                  rows={3}
                                  value={mcpFormData.description}
                                  onChange={(e) => setMcpFormData(prev => ({ ...prev, description: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary resize-none"
                                  placeholder="Describe your MCP server functionality..."
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Authentication Model
                                </label>
                                <select
                                  value={mcpFormData.authModel}
                                  onChange={(e) => setMcpFormData(prev => ({ ...prev, authModel: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                >
                                  <option value="api_key">API Key</option>
                                  <option value="oauth">OAuth 2.0</option>
                                  <option value="none">No Authentication</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Available Tools</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {mcpTools.map((tool) => (
                                <div
                                  key={tool.id}
                                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-card-border rounded-lg"
                                >
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 dark:text-text-primary">{tool.name}</h5>
                                    <p className="text-sm text-gray-600 dark:text-text-muted">{tool.description}</p>
                                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-card-bg text-gray-600 dark:text-text-muted text-xs rounded-full mt-1">
                                      {tool.category}
                                    </span>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMcpAddTool(tool.id)}
                                    disabled={mcpFormData.tools.some(t => t.id === tool.id)}
                                    className="ml-3 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {mcpFormData.tools.some(t => t.id === tool.id) ? 'Added' : 'Add'}
                                  </motion.button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {mcpFormData.tools.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-card-border">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Selected Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {mcpFormData.tools.map((tool) => (
                                <motion.div
                                  key={tool.id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg"
                                >
                                  <span className="text-sm font-medium">{tool.name}</span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleMcpRemoveTool(tool.id)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </motion.button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setMcpCurrentStep(3);
                              setMcpExpandedSteps([3]);
                            }}
                            disabled={!mcpFormData.serverName || mcpFormData.tools.length === 0}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Continue to Metadata
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {mcpCurrentStep === 3 && (
                      <motion.div
                        key="mcp-step-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Configure Metadata</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Runtime Configuration
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">Timeout (seconds)</label>
                                  <input
                                    type="number"
                                    value={mcpFormData.timeout}
                                    onChange={(e) => setMcpFormData(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">Max Tokens</label>
                                  <input
                                    type="number"
                                    value={mcpFormData.maxTokens}
                                    onChange={(e) => setMcpFormData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Associated LLMs
                              </label>
                              <div className="space-y-2">
                                {['Claude 3.5 Sonnet', 'GPT-4o', 'Gemini Pro'].map((llm) => (
                                  <label key={llm} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={mcpFormData.llms.includes(llm)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setMcpFormData(prev => ({ ...prev, llms: [...prev.llms, llm] }));
                                        } else {
                                          setMcpFormData(prev => ({ ...prev, llms: prev.llms.filter(l => l !== llm) }));
                                        }
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-text-muted">{llm}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Tags
                              </label>
                              <input
                                type="text"
                                placeholder="Enter tags separated by commas"
                                onChange={(e) => {
                                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                                  setMcpFormData(prev => ({ ...prev, tags }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Route Configuration</h4>
                            <div className="bg-gray-50 dark:bg-card-bg rounded-lg p-4">
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-text-muted">Tools endpoint:</span>
                                  <code className="text-blue-600 dark:text-blue-400">/tools/</code>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-text-muted">Health check:</span>
                                  <code className="text-blue-600 dark:text-blue-400">/ping</code>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-text-muted">Metadata:</span>
                                  <code className="text-blue-600 dark:text-blue-400">/metadata</code>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-text-muted">Documentation:</span>
                                  <code className="text-blue-600 dark:text-blue-400">/docs</code>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2">Server Preview</h5>
                              <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                                <div>Server: {mcpFormData.serverName || 'unnamed-server'}</div>
                                <div>Tools: {mcpFormData.tools.length}</div>
                                <div>Runtime: {mcpFormData.runtime}</div>
                                <div>Auth: {mcpFormData.authModel}</div>
                                <div>LLMs: {mcpFormData.llms.length}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setMcpCurrentStep(2);
                              setMcpExpandedSteps([2]);
                            }}
                            className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Back to Logic
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setMcpCurrentStep(4);
                              setMcpExpandedSteps([4]);
                            }}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Continue to Deploy
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {mcpCurrentStep === 4 && (
                      <motion.div
                        key="mcp-step-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Package and Deploy</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Auto-generated Dockerfile</h4>
                            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                              <pre>{mcpFormData.dockerfile}</pre>
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2">Local Test Command</h5>
                              <div className="bg-gray-100 dark:bg-card-bg p-3 rounded-lg">
                                <code className="text-sm text-gray-800 dark:text-text-primary">
                                  uvicorn {mcpFormData.serverName}:app --port 8000
                                </code>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Azure Deployment</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Resource Group
                                </label>
                                <input
                                  type="text"
                                  value={mcpFormData.deploymentConfig.resourceGroup}
                                  onChange={(e) => setMcpFormData(prev => ({
                                    ...prev,
                                    deploymentConfig: { ...prev.deploymentConfig, resourceGroup: e.target.value }
                                  }))}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Container App Name
                                </label>
                                <input
                                  type="text"
                                  value={mcpFormData.deploymentConfig.containerApp}
                                  onChange={(e) => setMcpFormData(prev => ({
                                    ...prev,
                                    deploymentConfig: { ...prev.deploymentConfig, containerApp: e.target.value }
                                  }))}
                                  placeholder={`mcp-${mcpFormData.serverName}`}
                                  className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                />
                              </div>

                              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <h5 className="font-medium text-blue-900 dark:text-blue-400 mb-2">Deployment Command</h5>
                                <code className="text-xs text-blue-800 dark:text-blue-300 break-all">
                                  az containerapp up --name {mcpFormData.deploymentConfig.containerApp || `mcp-${mcpFormData.serverName}`} --resource-group {mcpFormData.deploymentConfig.resourceGroup} --image {mcpFormData.deploymentConfig.registry}/{mcpFormData.serverName}:latest
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>

                        {mcpIsBuilding && (
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-card-bg rounded-lg">
                            <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2 flex items-center space-x-2">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Building and Deploying...</span>
                            </h5>
                            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm max-h-32 overflow-y-auto">
                              {mcpBuildLogs.map((log, index) => (
                                <div key={index}>{log}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setMcpCurrentStep(3);
                              setMcpExpandedSteps([3]);
                            }}
                            className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Back to Metadata
                          </motion.button>
                          
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleMcpDownloadConfig}
                              className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                            >
                              Download Config
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleMcpBuild}
                              disabled={mcpIsBuilding || !mcpFormData.serverName}
                              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                              {mcpIsBuilding ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Building...</span>
                                </>
                              ) : (
                                <>
                                  <Cloud className="w-4 h-4" />
                                  <span>Build & Deploy</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {mcpCurrentStep === 5 && (
                      <motion.div
                        key="mcp-step-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <div className="text-center">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-2">
                            MCP Server Deployed Successfully!
                          </h3>
                          <p className="text-gray-600 dark:text-text-muted mb-6">
                            Your MCP server "{mcpFormData.serverName}" is now live and ready to use.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 dark:bg-card-bg rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Server Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Name:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{mcpFormData.serverName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Version:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">1.0.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Tools:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{mcpFormData.tools.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Status:</span>
                                <span className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-green-600 dark:text-green-400">Deployed</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-card-bg rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Quick Actions</h4>
                            <div className="space-y-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                <Globe className="w-4 h-4" />
                                <span>View in Browser</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setMcpTab('servers')}
                                className="w-full flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                              >
                                <Server className="w-4 h-4" />
                                <span>Manage Server</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setMcpCurrentStep(1);
                                  setMcpExpandedSteps([1]);
                                  setMcpFormData({
                                    template: '',
                                    serverName: '',
                                    description: '',
                                    tools: [],
                                    runtime: 'python',
                                    timeout: 30,
                                    maxTokens: 1000,
                                    temperature: 0.7,
                                    authModel: 'api_key',
                                    tags: [],
                                    llms: [],
                                    dockerfile: '',
                                    deploymentConfig: {
                                      resourceGroup: 'rg-agentbridge',
                                      containerApp: '',
                                      registry: 'agentbridge.azurecr.io'
                                    }
                                  });
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Create Another</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* My MCP Servers */}
            {mcpTab === 'servers' && (
              <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">My MCP Servers</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMcpTab('builder')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Server</span>
                  </motion.button>
                </div>

                {mcpServers.length === 0 ? (
                  <div className="text-center py-12">
                    <Server className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">No MCP servers yet</h4>
                    <p className="text-gray-600 dark:text-text-muted mb-4">Create your first MCP server to get started</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMcpTab('builder')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Create MCP Server
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mcpServers.map((server, index) => (
                      <motion.div
                        key={server.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-card-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-text-primary">{server.name}</h4>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(server.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                              {server.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Version:</span>
                            <span className="text-gray-900 dark:text-text-primary">{server.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Tools:</span>
                            <span className="text-gray-900 dark:text-text-primary">{server.tools.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Runtime:</span>
                            <span className="text-gray-900 dark:text-text-primary">{server.metadata.runtime}</span>
                          </div>
                          {server.endpoint && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-text-muted">Endpoint:</span>
                              <a
                                href={server.endpoint}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-32"
                              >
                                {server.endpoint.replace('https://', '')}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMcpTestServer(server)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            <span>Test</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tool Registry */}
            {mcpTab === 'registry' && (
              <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Tool Registry</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tools..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Tool</span>
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mcpTools.map((tool, index) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-card-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-text-primary">{tool.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-text-muted mt-1">{tool.description}</p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-card-bg text-gray-600 dark:text-text-muted text-xs rounded-full">
                          {tool.category}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-text-muted">Input:</span>
                          <code className="ml-2 text-blue-600 dark:text-blue-400">
                            {JSON.stringify(tool.inputSchema)}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 dark:text-text-muted">Output:</span>
                          <code className="ml-2 text-green-600 dark:text-green-400">
                            {JSON.stringify(tool.outputSchema)}
                          </code>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Test</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'a2a' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* A2A Sub-tabs */}
            <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-4">
              <div className="flex space-x-6">
                {[
                  { id: 'builder', label: 'A2A Builder', icon: Bot },
                  { id: 'agents', label: 'My A2A Agents', icon: Users },
                  { id: 'intents', label: 'Intent Registry', icon: Target },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setA2aTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        a2aTab === tab.id
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                          : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-card-bg'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* A2A Builder Content */}
            {a2aTab === 'builder' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Progress Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">Build Progress</h3>
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Define Agent', icon: Bot },
                        { step: 2, title: 'Communication', icon: MessageSquare },
                        { step: 3, title: 'Capabilities', icon: Zap },
                        { step: 4, title: 'Deploy Target', icon: Cloud },
                        { step: 5, title: 'Register Agent', icon: CheckCircle },
                      ].map(({ step, title, icon: Icon }) => (
                        <motion.button
                          key={step}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => {
                            setA2aCurrentStep(step);
                            handleA2aStepToggle(step);
                          }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            a2aCurrentStep === step
                              ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                              : a2aCurrentStep > step
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'text-gray-600 dark:text-text-muted hover:bg-gray-100 dark:hover:bg-card-bg'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">Step {step}</div>
                            <div className="text-sm">{title}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    {a2aCurrentStep === 1 && (
                      <motion.div
                        key="a2a-step-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Define A2A Agent</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                              Agent Type
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { type: 'initiator', name: 'Initiator', description: 'Starts conversations and tasks', icon: Play },
                                { type: 'responder', name: 'Responder', description: 'Responds to requests and queries', icon: MessageSquare },
                                { type: 'relay', name: 'Relay', description: 'Routes messages between agents', icon: Network },
                              ].map((agentType) => {
                                const Icon = agentType.icon;
                                return (
                                  <motion.button
                                    key={agentType.type}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleA2aAgentTypeSelect(agentType.type as any)}
                                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                                      a2aFormData.agentType === agentType.type
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-300 dark:border-card-border hover:border-purple-400'
                                    }`}
                                  >
                                    <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-text-muted" />
                                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">{agentType.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-text-muted">{agentType.description}</p>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Agent Name *
                              </label>
                              <input
                                type="text"
                                value={a2aFormData.agentName}
                                onChange={(e) => setA2aFormData(prev => ({ ...prev, agentName: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                placeholder="my-a2a-agent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Tags
                              </label>
                              <input
                                type="text"
                                placeholder="Enter tags separated by commas"
                                onChange={(e) => {
                                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                                  setA2aFormData(prev => ({ ...prev, tags }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={a2aFormData.description}
                              onChange={(e) => setA2aFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary resize-none"
                              placeholder="Describe your A2A agent's purpose and capabilities..."
                            />
                          </div>

                          {a2aFormData.agentType && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
                            >
                              <h4 className="font-medium text-purple-900 dark:text-purple-400 mb-2">Auto-generated agent.yaml Preview</h4>
                              <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm">
                                <pre>{`name: ${a2aFormData.agentName || 'unnamed-agent'}
type: ${a2aFormData.agentType}
description: ${a2aFormData.description || 'Agent description'}
capabilities: []
intents: []
protocol:
  handshake: true
  timeout: 30
  retries: 3`}</pre>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex justify-end mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setA2aCurrentStep(2);
                              setA2aExpandedSteps([2]);
                            }}
                            disabled={!a2aFormData.agentName || !a2aFormData.agentType}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Continue to Communication
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {a2aCurrentStep === 2 && (
                      <motion.div
                        key="a2a-step-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Define Agent Communication</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-4">
                              Communication Protocol
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { id: 'sequential', name: 'Sequential Multi-Agent', description: 'Agents work in sequence', icon: Workflow },
                                { id: 'chat', name: 'Chat-style A2A', description: 'Conversational interaction', icon: MessageSquare },
                                { id: 'signal', name: 'Signal → Act → Notify', description: 'Event-driven communication', icon: Zap },
                              ].map((protocol) => {
                                const Icon = protocol.icon;
                                return (
                                  <motion.button
                                    key={protocol.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleA2aProtocolSelect(protocol.id)}
                                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                                      a2aFormData.protocol === protocol.id
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-300 dark:border-card-border hover:border-purple-400'
                                    }`}
                                  >
                                    <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-text-muted" />
                                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">{protocol.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-text-muted">{protocol.description}</p>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Handshake Logic
                              </label>
                              <textarea
                                rows={8}
                                value={a2aFormData.handshakeLogic}
                                onChange={(e) => setA2aFormData(prev => ({ ...prev, handshakeLogic: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary font-mono text-sm resize-none"
                                placeholder="Define your agent handshake logic..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                Event Definitions
                              </label>
                              <div className="space-y-2">
                                {['on_task_complete', 'on_error', 'on_timeout', 'on_retry'].map((event) => (
                                  <label key={event} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={a2aFormData.events.includes(event)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setA2aFormData(prev => ({ ...prev, events: [...prev.events, event] }));
                                        } else {
                                          setA2aFormData(prev => ({ ...prev, events: prev.events.filter(e => e !== event) }));
                                        }
                                      }}
                                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-text-muted">{event}</span>
                                  </label>
                                ))}
                              </div>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Timeout & Retries
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">Timeout (seconds)</label>
                                    <input
                                      type="number"
                                      value={a2aFormData.timeout}
                                      onChange={(e) => setA2aFormData(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">Max Retries</label>
                                    <input
                                      type="number"
                                      value={a2aFormData.retries}
                                      onChange={(e) => setA2aFormData(prev => ({ ...prev, retries: parseInt(e.target.value) }))}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setA2aCurrentStep(1);
                              setA2aExpandedSteps([1]);
                            }}
                            className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Back to Agent
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setA2aCurrentStep(3);
                              setA2aExpandedSteps([3]);
                            }}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            Continue to Capabilities
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {a2aCurrentStep === 3 && (
                      <motion.div
                        key="a2a-step-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Register Capabilities & Intents</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Available Intents</h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                              {a2aIntents.map((intent) => (
                                <div
                                  key={intent.id}
                                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-card-border rounded-lg"
                                >
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 dark:text-text-primary">{intent.name}</h5>
                                    <p className="text-sm text-gray-600 dark:text-text-muted">{intent.description}</p>
                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-text-muted">
                                      <span>Role: {intent.agentRole}</span>
                                      <span>Timeout: {intent.timeout}s</span>
                                      <span>Retries: {intent.retries}</span>
                                    </div>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleA2aAddIntent(intent.id)}
                                    disabled={a2aFormData.intents.includes(intent.id)}
                                    className="ml-3 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {a2aFormData.intents.includes(intent.id) ? 'Added' : 'Add'}
                                  </motion.button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Agent Capabilities</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                  Add Capability
                                </label>
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    placeholder="e.g., text_processing, data_analysis"
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        const capability = e.currentTarget.value.trim();
                                        if (capability && !a2aFormData.capabilities.includes(capability)) {
                                          setA2aFormData(prev => ({
                                            ...prev,
                                            capabilities: [...prev.capabilities, capability]
                                          }));
                                          e.currentTarget.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                      const capability = input.value.trim();
                                      if (capability && !a2aFormData.capabilities.includes(capability)) {
                                        setA2aFormData(prev => ({
                                          ...prev,
                                          capabilities: [...prev.capabilities, capability]
                                        }));
                                        input.value = '';
                                      }
                                    }}
                                    className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                  >
                                    Add
                                  </motion.button>
                                </div>
                              </div>

                              {a2aFormData.capabilities.length > 0 && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                                    Current Capabilities
                                  </label>
                                  <div className="space-y-2">
                                    {a2aFormData.capabilities.map((capability, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg"
                                      >
                                        <span className="text-sm font-medium">{capability}</span>
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => {
                                            setA2aFormData(prev => ({
                                              ...prev,
                                              capabilities: prev.capabilities.filter((_, i) => i !== index)
                                            }));
                                          }}
                                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                                        >
                                          <X className="w-4 h-4" />
                                        </motion.button>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {a2aFormData.intents.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-card-border">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Selected Intents</h4>
                            <div className="flex flex-wrap gap-2">
                              {a2aFormData.intents.map((intentId) => {
                                const intent = a2aIntents.find(i => i.id === intentId);
                                return intent ? (
                                  <motion.div
                                    key={intentId}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg"
                                  >
                                    <span className="text-sm font-medium">{intent.name}</span>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleA2aRemoveIntent(intentId)}
                                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                                    >
                                      <X className="w-4 h-4" />
                                    </motion.button>
                                  </motion.div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setA2aCurrentStep(2);
                              setA2aExpandedSteps([2]);
                            }}
                            className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Back to Communication
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setA2aCurrentStep(4);
                              setA2aExpandedSteps([4]);
                            }}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            Continue to Deploy
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {a2aCurrentStep === 4 && (
                      <motion.div
                        key="a2a-step-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-6">Configure Deployment Target</h3>
                        
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-4">
                              Deployment Options
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { id: 'fastapi', name: 'FastAPI Server', description: 'Deploy as FastAPI with uvicorn', icon: Zap },
                                { id: 'gunicorn', name: 'Gunicorn + Azure', description: 'Production deployment with Gunicorn', icon: Cloud },
                                { id: 'default', name: 'Default A2A Server', description: 'Use AgentBridge A2A infrastructure', icon: Server },
                              ].map((target) => {
                                const Icon = target.icon;
                                return (
                                  <motion.button
                                    key={target.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setA2aFormData(prev => ({ ...prev, deploymentTarget: target.id }))}
                                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                                      a2aFormData.deploymentTarget === target.id
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-300 dark:border-card-border hover:border-purple-400'
                                    }`}
                                  >
                                    <Icon className="w-8 h-8 mx-auto mb-3 text-gray-600 dark:text-text-muted" />
                                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">{target.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-text-muted">{target.description}</p>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">CLI Commands</h4>
                              <div className="space-y-4">
                                {a2aFormData.deploymentTarget === 'fastapi' && (
                                  <div className="bg-gray-100 dark:bg-card-bg p-3 rounded-lg">
                                    <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2">FastAPI Deployment</h5>
                                    <code className="text-sm text-gray-800 dark:text-text-primary">
                                      uvicorn agent2agent.app:app --host 0.0.0.0 --port 8002
                                    </code>
                                  </div>
                                )}
                                
                                {a2aFormData.deploymentTarget === 'gunicorn' && (
                                  <div className="bg-gray-100 dark:bg-card-bg p-3 rounded-lg">
                                    <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2">Production Deployment</h5>
                                    <code className="text-sm text-gray-800 dark:text-text-primary">
                                      gunicorn -w 4 -k uvicorn.workers.UvicornWorker agent2agent.app:app --bind 0.0.0.0:8002
                                    </code>
                                  </div>
                                )}
                                
                                {a2aFormData.deploymentTarget === 'default' && (
                                  <div className="bg-gray-100 dark:bg-card-bg p-3 rounded-lg">
                                    <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2">AgentBridge A2A</h5>
                                    <code className="text-sm text-gray-800 dark:text-text-primary">
                                      agentbridge a2a deploy {a2aFormData.agentName} --type {a2aFormData.agentType}
                                    </code>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-text-primary mb-4">Agent Configuration Preview</h4>
                              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                                <pre>{`name: ${a2aFormData.agentName}
type: ${a2aFormData.agentType}
description: ${a2aFormData.description}
protocol: ${a2aFormData.protocol}
capabilities:
${a2aFormData.capabilities.map(cap => `  - ${cap}`).join('\n')}
intents:
${a2aFormData.intents.map(intent => `  - ${intent}`).join('\n')}
timeout: ${a2aFormData.timeout}
retries: ${a2aFormData.retries}
deployment:
  target: ${a2aFormData.deploymentTarget}
  port: 8002`}</pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        {a2aIsDeploying && (
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-card-bg rounded-lg">
                            <h5 className="font-medium text-gray-900 dark:text-text-primary mb-2 flex items-center space-x-2">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Deploying A2A Agent...</span>
                            </h5>
                            <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm max-h-32 overflow-y-auto">
                              {a2aDeployLogs.map((log, index) => (
                                <div key={index}>{log}</div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setA2aCurrentStep(3);
                              setA2aExpandedSteps([3]);
                            }}
                            className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Back to Capabilities
                          </motion.button>
                          
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleA2aDownloadConfig}
                              className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                            >
                              Download YAML
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleA2aDeploy}
                              disabled={a2aIsDeploying || !a2aFormData.agentName}
                              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                            >
                              {a2aIsDeploying ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  <span>Deploying...</span>
                                </>
                              ) : (
                                <>
                                  <Cloud className="w-4 h-4" />
                                  <span>Deploy Agent</span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {a2aCurrentStep === 5 && (
                      <motion.div
                        key="a2a-step-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
                      >
                        <div className="text-center">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-2">
                            A2A Agent Deployed Successfully!
                          </h3>
                          <p className="text-gray-600 dark:text-text-muted mb-6">
                            Your A2A agent "{a2aFormData.agentName}" is now active and ready for communication.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 dark:bg-card-bg rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Agent Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Name:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{a2aFormData.agentName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Type:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{a2aFormData.agentType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Protocol:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{a2aFormData.protocol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Capabilities:</span>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{a2aFormData.capabilities.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-text-muted">Status:</span>
                                <span className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-green-600 dark:text-green-400">Active</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-card-bg rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Quick Actions</h4>
                            <div className="space-y-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center space-x-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                              >
                                <Activity className="w-4 h-4" />
                                <span>Monitor Activity</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setA2aTab('agents')}
                                className="w-full flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                              >
                                <Users className="w-4 h-4" />
                                <span>Manage Agents</span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setA2aCurrentStep(1);
                                  setA2aExpandedSteps([1]);
                                  setA2aFormData({
                                    agentName: '',
                                    agentType: 'initiator',
                                    description: '',
                                    capabilities: [],
                                    protocol: 'sequential',
                                    handshakeLogic: '',
                                    events: [],
                                    intents: [],
                                    timeout: 30,
                                    retries: 3,
                                    deploymentTarget: 'fastapi',
                                    tags: []
                                  });
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Create Another</span>
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* My A2A Agents */}
            {a2aTab === 'agents' && (
              <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">My A2A Agents</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setA2aTab('builder')}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Agent</span>
                  </motion.button>
                </div>

                {a2aAgents.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">No A2A agents yet</h4>
                    <p className="text-gray-600 dark:text-text-muted mb-4">Create your first A2A agent to enable agent communication</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setA2aTab('builder')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Create A2A Agent
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {a2aAgents.map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-card-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-text-primary">{agent.name}</h4>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(agent.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                              {agent.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Type:</span>
                            <span className="text-gray-900 dark:text-text-primary capitalize">{agent.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Protocol:</span>
                            <span className="text-gray-900 dark:text-text-primary">{agent.metadata.protocol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Capabilities:</span>
                            <span className="text-gray-900 dark:text-text-primary">{agent.capabilities.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-text-muted">Intents:</span>
                            <span className="text-gray-900 dark:text-text-primary">{agent.intents.length}</span>
                          </div>
                          {agent.lastActive && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-text-muted">Last Active:</span>
                              <span className="text-gray-900 dark:text-text-primary">
                                {new Date(agent.lastActive).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            <Activity className="w-4 h-4" />
                            <span>Monitor</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Intent Registry */}
            {a2aTab === 'intents' && (
              <div className="bg-white dark:bg-secondary rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">Intent Registry</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search intents..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Intent</span>
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {a2aIntents.map((intent, index) => (
                    <motion.div
                      key={intent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 dark:border-card-border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-text-primary">{intent.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-text-muted mt-1">{intent.description}</p>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                          {intent.agentRole}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">Timeout:</span>
                          <span className="text-gray-900 dark:text-text-primary">{intent.timeout}s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">Retries:</span>
                          <span className="text-gray-900 dark:text-text-primary">{intent.retries}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-text-muted">Schema:</span>
                          <code className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                            {JSON.stringify(intent.schema)}
                          </code>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Test</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Clone</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BrainPage;