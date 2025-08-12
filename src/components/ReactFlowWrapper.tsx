import React, { useCallback, useState } from 'react';
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
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Database, 
  Globe, 
  MessageSquare,
  FileText,
  Brain,
  Settings,
  Play,
  Pause,
  Square,
  Users,
  Shield,
  Target,
  Repeat,
  RotateCcw,
  Code,
  Wrench
} from 'lucide-react';

// AgentBridge Node Component with enhanced styling
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

  const showHandles = data.nodeType !== 'input' && data.nodeType !== 'output';

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

// AgentBridge Edge Component
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

interface ReactFlowWrapperProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  readOnly?: boolean;
  showControls?: boolean;
  showMiniMap?: boolean;
  height?: string;
  className?: string;
}

const ReactFlowWrapper: React.FC<ReactFlowWrapperProps> = ({
  initialNodes,
  initialEdges,
  onNodeClick,
  onEdgeClick,
  onNodesChange,
  onEdgesChange,
  readOnly = false,
  showControls = true,
  showMiniMap = true,
  height = '400px',
  className = '',
}) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return;
      const newEdge = {
        ...params,
        type: 'custom',
        data: { label: 'connect', animated: false },
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, readOnly]
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (onEdgeClick) {
      onEdgeClick(edge);
    }
  }, [onEdgeClick]);

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeInternal(changes);
    if (onNodesChange) {
      onNodesChange(nodes);
    }
  }, [onNodesChangeInternal, onNodesChange, nodes]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
    if (onEdgesChange) {
      onEdgesChange(edges);
    }
  }, [onEdgesChangeInternal, onEdgesChange, edges]);

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

  const stopExecution = useCallback(() => {
    setIsExecuting(false);
    setNodes(nds => nds.map(node => ({ ...node, data: { ...node.data, status: undefined } })));
    setEdges(eds => eds.map(edge => ({ ...edge, data: { ...edge.data, animated: false } })));
  }, [setNodes, setEdges]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid={!readOnly}
        snapGrid={[20, 20]}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        deleteKeyCode={readOnly ? null : 'Delete'}
        multiSelectionKeyCode={readOnly ? null : 'Meta'}
        defaultEdgeOptions={{
          type: 'custom',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: '#14B8A6' },
        }}
        className="bg-gray-50 dark:bg-gray-900 rounded-lg"
        proOptions={{ hideAttribution: true }}
      >
        {showControls && !readOnly && (
          <Controls 
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            showInteractive={false}
          />
        )}
        <Background 
          gap={20} 
          size={1}
          className="bg-gray-100 dark:bg-gray-800" 
          color="#e5e7eb"
          variant="dots"
        />
        {showMiniMap && (
          <MiniMap 
            nodeColor={(node) => {
              switch (node.data.nodeType) {
                case 'input': return '#22c55e';
                case 'output': return '#ef4444';
                case 'llm': return '#3b82f6';
                case 'tool': return '#8b5cf6';
                case 'mcp': return '#f97316';
                case 'a2a': return '#6366f1';
                case 'hitl': return '#ec4899';
                case 'condition': return '#eab308';
                case 'loop': return '#06b6d4';
                case 'memory': return '#6b7280';
                case 'pattern': return '#10b981';
                default: return '#6b7280';
              }
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            pannable
            zoomable
          />
        )}
      </ReactFlow>
      
      {/* Execution Controls */}
      {!readOnly && (
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {!isExecuting ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={executeWorkflow}
              className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors backdrop-blur-sm"
            >
              <Play className="w-4 h-4" />
              <span>Execute</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopExecution}
              className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors backdrop-blur-sm"
            >
              <Square className="w-4 h-4" />
              <span>Stop</span>
            </motion.button>
          )}
        </div>
      )}
      
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
              fill="#14B8A6"
            />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default ReactFlowWrapper;