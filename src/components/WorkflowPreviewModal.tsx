import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Code, Download, Play, Copy, ExternalLink, FileText, Terminal, Pocket as Docker, GitBranch, Zap } from 'lucide-react';
import ReactFlowWrapper from './ReactFlowWrapper';
import { WorkflowAgent, DeploymentInstructions } from '../types/marketplace';
import { Node, Edge } from 'reactflow';

interface WorkflowPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: WorkflowAgent | null;
  onDeploy?: (workflow: WorkflowAgent) => void;
  onEdit?: (workflow: WorkflowAgent) => void;
}

const generateSampleNodes = (pattern: string): Node[] => {
  const baseY = 100;
  const spacing = 200;
  
  switch (pattern) {
    case 'ReAct':
      return [
        { 
          id: 'input', 
          type: 'custom', 
          data: { 
            label: 'User Input', 
            category: 'trigger', 
            nodeType: 'webhook',
            description: 'Receive user query'
          }, 
          position: { x: 100, y: baseY } 
        },
        { 
          id: 'reason', 
          type: 'custom', 
          data: { 
            label: 'Reasoning', 
            category: 'logic', 
            nodeType: 'condition',
            description: 'Analyze and plan'
          }, 
          position: { x: 100 + spacing, y: baseY } 
        },
        { 
          id: 'act', 
          type: 'custom', 
          data: { 
            label: 'Action', 
            category: 'integration', 
            nodeType: 'api',
            description: 'Execute action'
          }, 
          position: { x: 100 + spacing * 2, y: baseY } 
        },
        { 
          id: 'observe', 
          type: 'custom', 
          data: { 
            label: 'Observe', 
            category: 'utility', 
            nodeType: 'logger',
            description: 'Evaluate result'
          }, 
          position: { x: 100 + spacing * 3, y: baseY } 
        },
      ];
    case 'RAG':
      return [
        { 
          id: 'query', 
          type: 'custom', 
          data: { 
            label: 'Query Input', 
            category: 'trigger', 
            nodeType: 'webhook',
            description: 'User question'
          }, 
          position: { x: 100, y: baseY } 
        },
        { 
          id: 'retrieval', 
          type: 'custom', 
          data: { 
            label: 'Document Retrieval', 
            category: 'utility', 
            nodeType: 'database',
            description: 'Search knowledge base'
          }, 
          position: { x: 100 + spacing, y: baseY } 
        },
        { 
          id: 'generation', 
          type: 'custom', 
          data: { 
            label: 'Answer Generation', 
            category: 'model', 
            nodeType: 'llm',
            description: 'Generate response'
          }, 
          position: { x: 100 + spacing * 2, y: baseY } 
        },
        { 
          id: 'response', 
          type: 'custom', 
          data: { 
            label: 'Response', 
            category: 'utility', 
            nodeType: 'logger',
            description: 'Return answer'
          }, 
          position: { x: 100 + spacing * 3, y: baseY } 
        },
      ];
    case 'Multi-Agent':
      return [
        { 
          id: 'coordinator', 
          type: 'custom', 
          data: { 
            label: 'Coordinator', 
            category: 'logic', 
            nodeType: 'condition',
            description: 'Task distribution'
          }, 
          position: { x: 300, y: baseY } 
        },
        { 
          id: 'agent1', 
          type: 'custom', 
          data: { 
            label: 'Research Agent', 
            category: 'integration', 
            nodeType: 'api',
            description: 'Data gathering'
          }, 
          position: { x: 100, y: baseY + 100 } 
        },
        { 
          id: 'agent2', 
          type: 'custom', 
          data: { 
            label: 'Analysis Agent', 
            category: 'model', 
            nodeType: 'llm',
            description: 'Data analysis'
          }, 
          position: { x: 500, y: baseY + 100 } 
        },
        { 
          id: 'synthesizer', 
          type: 'custom', 
          data: { 
            label: 'Synthesizer', 
            category: 'utility', 
            nodeType: 'logger',
            description: 'Combine results'
          }, 
          position: { x: 300, y: baseY + 200 } 
        },
      ];
    default:
      return [
        { 
          id: 'start', 
          type: 'custom', 
          data: { 
            label: 'Start', 
            category: 'trigger', 
            nodeType: 'webhook'
          }, 
          position: { x: 100, y: baseY } 
        },
        { 
          id: 'process', 
          type: 'custom', 
          data: { 
            label: 'Process', 
            category: 'logic', 
            nodeType: 'condition'
          }, 
          position: { x: 300, y: baseY } 
        },
        { 
          id: 'end', 
          type: 'custom', 
          data: { 
            label: 'End', 
            category: 'utility', 
            nodeType: 'logger'
          }, 
          position: { x: 500, y: baseY } 
        },
      ];
  }
};

const generateSampleEdges = (pattern: string): Edge[] => {
  switch (pattern) {
    case 'ReAct':
      return [
        { id: 'e1', source: 'input', target: 'reason', type: 'custom', data: { label: 'analyze' } },
        { id: 'e2', source: 'reason', target: 'act', type: 'custom', data: { label: 'execute' } },
        { id: 'e3', source: 'act', target: 'observe', type: 'custom', data: { label: 'evaluate' } },
        { id: 'e4', source: 'observe', target: 'reason', type: 'custom', data: { label: 'iterate' } },
      ];
    case 'RAG':
      return [
        { id: 'e1', source: 'query', target: 'retrieval', type: 'custom', data: { label: 'search' } },
        { id: 'e2', source: 'retrieval', target: 'generation', type: 'custom', data: { label: 'context' } },
        { id: 'e3', source: 'generation', target: 'response', type: 'custom', data: { label: 'answer' } },
      ];
    case 'Multi-Agent':
      return [
        { id: 'e1', source: 'coordinator', target: 'agent1', type: 'custom', data: { label: 'assign' } },
        { id: 'e2', source: 'coordinator', target: 'agent2', type: 'custom', data: { label: 'assign' } },
        { id: 'e3', source: 'agent1', target: 'synthesizer', type: 'custom', data: { label: 'results' } },
        { id: 'e4', source: 'agent2', target: 'synthesizer', type: 'custom', data: { label: 'results' } },
      ];
    default:
      return [
        { id: 'e1', source: 'start', target: 'process', type: 'custom', data: { label: 'trigger' } },
        { id: 'e2', source: 'process', target: 'end', type: 'custom', data: { label: 'complete' } },
      ];
  }
};

const generateDeploymentInstructions = (workflow: WorkflowAgent): DeploymentInstructions => {
  const workflowName = workflow.name.toLowerCase().replace(/\s+/g, '-');
  
  return {
    cli: `# Install AgentBridge CLI
npm install -g @agentbridge/cli

# Deploy workflow
agentbridge deploy ${workflowName}.json --env production

# Monitor deployment
agentbridge status ${workflowName}`,
    
    docker: `# Build Docker image
docker build -t ${workflowName}:${workflow.currentVersion} .

# Run container
docker run -d \\
  --name ${workflowName} \\
  -p 8080:8080 \\
  -e AGENTBRIDGE_API_KEY=\${API_KEY} \\
  ${workflowName}:${workflow.currentVersion}

# Check logs
docker logs ${workflowName}`,
    
    langGraph: `from langgraph import StateGraph
from agentbridge import AgentBridgeAdapter

# Load workflow
adapter = AgentBridgeAdapter("${workflowName}.json")
graph = adapter.to_langgraph()

# Execute
result = graph.invoke({
    "input": "Your input here",
    "config": {"recursion_limit": 50}
})`,
    
    autoGen: `import autogen
from agentbridge.integrations import AutoGenAdapter

# Convert to AutoGen
adapter = AutoGenAdapter("${workflowName}.json")
agents = adapter.create_agents()

# Start conversation
groupchat = autogen.GroupChat(
    agents=agents,
    messages=[],
    max_round=10
)

manager = autogen.GroupChatManager(groupchat=groupchat)
manager.initiate_chat("Your task here")`,
    
    python: `import requests
import json

# AgentBridge API endpoint
url = "https://api.agentbridge.com/v1/workflows/${workflow.id}/execute"

# Execute workflow
response = requests.post(url, 
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "input": "Your input data",
        "parameters": {}
    }
)

result = response.json()
print(result)

# Life Sciences specific examples
${workflow.group === 'life-sciences' ? getLifeSciencesExample(workflow.name) : ''}`
  };
};

const getLifeSciencesExample = (workflowName: string): string => {
  switch (workflowName) {
    case 'Clinical Trial Protocol Optimizer':
      return `
# Example: Optimize Phase III oncology trial protocol
protocol_data = {
    "indication": "Non-small cell lung cancer",
    "phase": "III",
    "primary_endpoint": "Overall survival",
    "patient_population": "PD-L1 positive",
    "sample_size": 600
}

# AI generates optimized protocol with:
# - Patient stratification recommendations
# - Endpoint optimization suggestions  
# - Regulatory compliance validation
# - Audio summary of key protocol changes`;

    case 'GMP Batch Release Validator':
      return `
# Example: Validate manufacturing batch record
batch_data = {
    "batch_number": "LOT-2024-001",
    "product": "Monoclonal Antibody",
    "manufacturing_date": "2024-01-20",
    "test_results": batch_test_data
}

# AI validates against GMP requirements:
# - Automated compliance scoring
# - Deviation detection and flagging
# - Audio alerts for critical findings
# - Release recommendation with rationale`;

    case 'Safety Signal Detection Agent':
      return `
# Example: Monitor adverse events for signal detection
safety_data = {
    "product": "Drug X",
    "time_period": "Q4 2024", 
    "data_sources": ["FAERS", "Clinical trials", "Literature"],
    "events": adverse_event_reports
}

# AI detects potential safety signals:
# - Statistical signal detection algorithms
# - Causality assessment automation
# - Audio briefings on emerging signals
# - Risk assessment recommendations`;

    default:
      return `
# Life Sciences workflow execution
# Specialized for pharmaceutical and biotech applications
# Includes regulatory compliance and GxP validation`;
  }
};

const WorkflowPreviewModal: React.FC<WorkflowPreviewModalProps> = ({
  isOpen,
  onClose,
  workflow,
  onDeploy,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'deploy'>('visual');
  const [selectedLanguage, setSelectedLanguage] = useState<keyof DeploymentInstructions>('cli');
  const [copiedCode, setCopiedCode] = useState(false);

  const nodes = workflow ? generateSampleNodes(workflow.agenticPattern) : [];
  const edges = workflow ? generateSampleEdges(workflow.agenticPattern) : [];
  const deploymentInstructions = workflow ? generateDeploymentInstructions(workflow) : null;

  const handleCopyCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, []);

  const handleDownloadWorkflow = useCallback(() => {
    if (!workflow) return;
    
    const workflowData = {
      name: workflow.name,
      version: workflow.currentVersion,
      pattern: workflow.agenticPattern,
      nodes: nodes,
      edges: edges,
      metadata: workflow.metadata
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [workflow, nodes, edges]);

  if (!isOpen || !workflow) return null;

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
          className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-card-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">{workflow.name}</h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-gray-600 dark:text-text-muted">v{workflow.currentVersion}</span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        {workflow.agenticPattern}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted rounded-full text-xs">
                        {workflow.group}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadWorkflow}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </motion.button>
                
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(workflow)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Edit in Builder</span>
                  </motion.button>
                )}
                
                {onDeploy && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDeploy(workflow)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Deploy This</span>
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
            
            {/* Description */}
            <p className="mt-4 text-gray-600 dark:text-text-muted">{workflow.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {workflow.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-card-border">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'visual', label: 'Visual View', icon: Eye },
                { id: 'code', label: 'Code Snippet', icon: Code },
                { id: 'deploy', label: 'Deploy Instructions', icon: Terminal },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-text-muted hover:text-gray-700 dark:hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'visual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Workflow Visualization */}
                <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Workflow Architecture
                  </h3>
                  <ReactFlowWrapper
                    initialNodes={nodes}
                    initialEdges={edges}
                    readOnly={true}
                    height="400px"
                    className="border border-gray-200 dark:border-card-border rounded-lg"
                  />
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Workflow Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Nodes:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">{nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">{workflow.metadata.agentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Created:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">
                          {new Date(workflow.metadata.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Analytics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Views:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">{workflow.analytics.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Deployments:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">{workflow.analytics.deployments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Rating:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">★ {workflow.analytics.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Monetization</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">{workflow.monetization.type}</span>
                      </div>
                      {workflow.monetization.price && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-text-muted">Price:</span>
                          <span className="font-medium text-gray-900 dark:text-text-primary">${workflow.monetization.price}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Revenue:</span>
                        <span className="font-medium text-gray-900 dark:text-text-primary">${workflow.analytics.revenue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Usage Examples
                  </h3>
                  
                  <div className="flex space-x-2 mb-4">
                    {Object.keys(deploymentInstructions || {}).map((lang) => (
                      <motion.button
                        key={lang}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLanguage(lang as keyof DeploymentInstructions)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedLanguage === lang
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted hover:bg-gray-200 dark:hover:bg-card-bg'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </motion.button>
                    ))}
                  </div>

                  <div className="relative">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{deploymentInstructions?.[selectedLanguage]}</code>
                    </pre>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deploymentInstructions && handleCopyCode(deploymentInstructions[selectedLanguage])}
                      className="absolute top-2 right-2 p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'deploy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Deployment Options
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 dark:border-card-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Terminal className="w-5 h-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">CLI Deployment</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-text-muted mb-3">
                        Deploy using the AgentBridge CLI for production environments.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('code')}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                      >
                        View CLI Commands →
                      </motion.button>
                    </div>

                    <div className="border border-gray-200 dark:border-card-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Docker className="w-5 h-5 text-blue-500" />
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">Docker Container</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-text-muted mb-3">
                        Containerized deployment for scalable cloud environments.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedLanguage('docker');
                          setActiveTab('code');
                        }}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                      >
                        View Docker Setup →
                      </motion.button>
                    </div>

                    <div className="border border-gray-200 dark:border-card-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <GitBranch className="w-5 h-5 text-green-500" />
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">LangGraph Integration</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-text-muted mb-3">
                        Convert to LangGraph format for advanced workflow orchestration.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedLanguage('langGraph');
                          setActiveTab('code');
                        }}
                        className="text-green-500 hover:text-green-600 text-sm font-medium"
                      >
                        View Integration →
                      </motion.button>
                    </div>

                    <div className="border border-gray-200 dark:border-card-border rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Zap className="w-5 h-5 text-purple-500" />
                        <h4 className="font-medium text-gray-900 dark:text-text-primary">API Integration</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-text-muted mb-3">
                        Direct API calls for custom application integration.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedLanguage('python');
                          setActiveTab('code');
                        }}
                        className="text-purple-500 hover:text-purple-600 text-sm font-medium"
                      >
                        View API Usage →
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Prerequisites</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• AgentBridge API key (get from dashboard)</li>
                    <li>• Node.js 18+ or Python 3.8+ runtime</li>
                    <li>• Docker (for containerized deployment)</li>
                    <li>• Network access to AgentBridge services</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WorkflowPreviewModal;