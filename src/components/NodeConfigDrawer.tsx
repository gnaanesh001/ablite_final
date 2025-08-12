import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw, Play, Settings, Brain, Zap, Database, Globe, Shield, Target, Users, Code, Sliders, ToggleLeft as Toggle, Key, Lock, Clock, AlertTriangle, CheckCircle, Info, HelpCircle, Eye, EyeOff, ChevronDown, ChevronRight, Plus, Minus, Copy, FileText, Link, Webhook, Bell, Mail, Share2, Rocket, PieChart, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface NodeConfig {
  id: string;
  type: string;
  category: string;
  name: string;
  description: string;
  config: any;
  supabaseTable: string;
}

interface NodeConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeConfig: NodeConfig | null;
  onSave: (config: NodeConfig) => void;
  onTest?: (config: NodeConfig) => Promise<any>;
}

const NodeConfigDrawer: React.FC<NodeConfigDrawerProps> = ({
  isOpen,
  onClose,
  nodeConfig,
  onSave,
  onTest
}) => {
  const [config, setConfig] = useState<any>({});
  const [activeTab, setActiveTab] = useState('basic');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  useEffect(() => {
    if (nodeConfig) {
      setConfig(nodeConfig.config || {});
      setActiveTab('basic');
      setTestResult(null);
    }
  }, [nodeConfig]);

  const handleConfigChange = useCallback((key: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleNestedConfigChange = useCallback((path: string, value: any) => {
    setConfig((prev: any) => {
      const keys = path.split('.');
      const newConfig = { ...prev };
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  }, []);

  const handleSave = useCallback(() => {
    if (nodeConfig) {
      onSave({
        ...nodeConfig,
        config
      });
    }
    onClose();
  }, [nodeConfig, config, onSave, onClose]);

  const handleTest = useCallback(async () => {
    if (!nodeConfig || !onTest) return;
    
    setIsTestingConnection(true);
    try {
      const result = await onTest({
        ...nodeConfig,
        config
      });
      setTestResult({ success: true, data: result });
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsTestingConnection(false);
    }
  }, [nodeConfig, config, onTest]);

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

  const renderLLMConfig = () => (
    <div className="space-y-6">
      {/* Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Model
        </label>
        <select
          value={config.model_name || ''}
          onChange={(e) => handleConfigChange('model_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
        >
          <option value="">Select Model</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
          <option value="gpt-4">Azure GPT-4</option>
        </select>
      </div>

      {/* Endpoint */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Endpoint
        </label>
        <input
          type="url"
          value={config.endpoint || ''}
          onChange={(e) => handleConfigChange('endpoint', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          placeholder="https://api.openai.com/v1/chat/completions"
        />
      </div>

      {/* Streaming Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-text-muted">
            Streaming
          </label>
          <p className="text-xs text-gray-600 dark:text-text-muted">
            Enable real-time response streaming
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleConfigChange('streaming', !config.streaming)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.streaming ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.streaming ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </motion.button>
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Temperature: {config.temperature || 0.7}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.temperature || 0.7}
          onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-600 dark:text-text-muted mt-1">
          <span>Focused</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Max Tokens
        </label>
        <input
          type="number"
          value={config.max_tokens || 4096}
          onChange={(e) => handleConfigChange('max_tokens', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          min="1"
          max="32768"
        />
      </div>

      {/* Confidence Threshold */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Confidence Threshold: {config.confidence_threshold || 0.8}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={config.confidence_threshold || 0.8}
          onChange={(e) => handleConfigChange('confidence_threshold', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Retry Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Retry Count
        </label>
        <input
          type="number"
          value={config.retry_count || 3}
          onChange={(e) => handleConfigChange('retry_count', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          min="0"
          max="10"
        />
      </div>
    </div>
  );

  const renderMCPConfig = () => (
    <div className="space-y-6">
      {/* Server Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Server Name
        </label>
        <input
          type="text"
          value={config.server_name || ''}
          onChange={(e) => handleConfigChange('server_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          placeholder="budget-reader"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          MCP URL
        </label>
        <input
          type="text"
          value={config.url || ''}
          onChange={(e) => handleConfigChange('url', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          placeholder="mcp://budget-reader"
        />
      </div>

      {/* Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Method
        </label>
        <select
          value={config.method || 'GET'}
          onChange={(e) => handleConfigChange('method', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Auth Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Auth Key
        </label>
        <div className="relative">
          <input
            type="password"
            value={config.auth_key || ''}
            onChange={(e) => handleConfigChange('auth_key', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
            placeholder="Enter API key"
          />
          <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Body Schema */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Body Schema (JSON)
        </label>
        <textarea
          rows={6}
          value={JSON.stringify(config.body_schema || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleConfigChange('body_schema', parsed);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary font-mono text-sm"
          placeholder='{"file_path": "string", "format": "csv|xlsx|json"}'
        />
      </div>

      {/* Available Tools */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Available Tools
        </label>
        <div className="space-y-2">
          {(config.tools || []).map((tool: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-card-bg rounded-lg">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-900 dark:text-text-primary">{tool}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Test Connection Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleTest}
        disabled={isTestingConnection}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isTestingConnection ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Testing...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span>Test Connection</span>
          </>
        )}
      </motion.button>
    </div>
  );

  const renderA2AConfig = () => (
    <div className="space-y-6">
      {/* Agent Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Agent Role
        </label>
        <select
          value={config.agent_role || ''}
          onChange={(e) => handleConfigChange('agent_role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
        >
          <option value="">Select Role</option>
          <option value="planner">Planner</option>
          <option value="validator">Validator</option>
          <option value="executor">Executor</option>
          <option value="critique">Critique</option>
          <option value="self_reflector">Self Reflector</option>
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Model
        </label>
        <select
          value={config.model || ''}
          onChange={(e) => handleConfigChange('model', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
        >
          <option value="">Select Model</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
      </div>

      {/* Memory Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-text-muted">
            Memory Enabled
          </label>
          <p className="text-xs text-gray-600 dark:text-text-muted">
            Enable conversation memory
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleConfigChange('memory_enabled', !config.memory_enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            config.memory_enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.memory_enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </motion.button>
      </div>

      {/* Turn Limits */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Turn Limits
        </label>
        <input
          type="number"
          value={config.turn_limits || 10}
          onChange={(e) => handleConfigChange('turn_limits', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          min="1"
          max="50"
        />
      </div>

      {/* Agent Config */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Agent Configuration (JSON)
        </label>
        <textarea
          rows={8}
          value={JSON.stringify(config.agent_config || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleConfigChange('agent_config', parsed);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary font-mono text-sm"
          placeholder='{"planning_depth": 3, "risk_assessment": true}'
        />
      </div>
    </div>
  );

  const renderExecutionModeConfig = () => (
    <div className="space-y-6">
      {/* Execution Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-3">
          Execution Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['hitl', 'autonomous', 'hybrid'].map((mode) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleConfigChange('execution_mode', mode)}
              className={`p-3 rounded-xl border-2 text-center transition-colors ${
                config.execution_mode === mode
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'border-gray-200 dark:border-card-border text-gray-700 dark:text-text-muted hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                {mode === 'hitl' && <Shield className="w-5 h-5" />}
                {mode === 'autonomous' && <Zap className="w-5 h-5" />}
                {mode === 'hybrid' && <Target className="w-5 h-5" />}
                <span className="text-sm font-medium capitalize">{mode}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Retry Logic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Retry Logic
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">
              Max Retries
            </label>
            <input
              type="number"
              value={config.max_retries || 3}
              onChange={(e) => handleConfigChange('max_retries', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">
              Retry Delay (ms)
            </label>
            <input
              type="number"
              value={config.retry_delay || 1000}
              onChange={(e) => handleConfigChange('retry_delay', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
              min="100"
              step="100"
            />
          </div>
        </div>
      </div>

      {/* Input/Output Bindings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
          Input/Output Bindings
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">
              Input Schema
            </label>
            <textarea
              rows={3}
              value={JSON.stringify(config.input_schema || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleConfigChange('input_schema', parsed);
                } catch (error) {
                  // Invalid JSON, don't update
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary font-mono text-sm"
              placeholder='{"type": "object", "properties": {}}'
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-text-muted mb-1">
              Output Schema
            </label>
            <textarea
              rows={3}
              value={JSON.stringify(config.output_schema || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleConfigChange('output_schema', parsed);
                } catch (error) {
                  // Invalid JSON, don't update
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary font-mono text-sm"
              placeholder='{"type": "object", "properties": {}}'
            />
          </div>
        </div>
      </div>
    </div>
  );

  const getNodeIcon = () => {
    if (!nodeConfig) return Settings;
    
    switch (nodeConfig.category) {
      case 'ai-models': return Brain;
      case 'mcp-tools': return Zap;
      case 'a2a-agents': return Users;
      case 'agent-templates': return Code;
      case 'control-logic': return Target;
      case 'output-finalization': return Rocket;
      default: return Settings;
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Settings },
    { id: 'advanced', label: 'Advanced', icon: Sliders },
    { id: 'execution', label: 'Execution', icon: Play }
  ];

  if (!isOpen || !nodeConfig) return null;

  const NodeIcon = getNodeIcon();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-card-bg border-l border-gray-200 dark:border-card-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <NodeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                  {nodeConfig.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-text-muted">
                  {nodeConfig.description}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-secondary rounded-xl p-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'basic' && (
              <>
                {nodeConfig.category === 'ai-models' && renderLLMConfig()}
                {nodeConfig.category === 'mcp-tools' && renderMCPConfig()}
                {nodeConfig.category === 'a2a-agents' && renderA2AConfig()}
                {nodeConfig.category === 'agent-templates' && (
                  <div className="text-center py-8">
                    <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-text-muted">
                      Template configurations are pre-defined and cannot be modified.
                    </p>
                  </div>
                )}
                {(nodeConfig.category === 'control-logic' || nodeConfig.category === 'output-finalization') && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Node Name
                      </label>
                      <input
                        type="text"
                        value={config.name || nodeConfig.name}
                        onChange={(e) => handleConfigChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={config.description || nodeConfig.description}
                        onChange={(e) => handleConfigChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                    Advanced Configuration (JSON)
                  </label>
                  <textarea
                    rows={12}
                    value={JSON.stringify(config, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setConfig(parsed);
                      } catch (error) {
                        // Invalid JSON, don't update
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'execution' && renderExecutionModeConfig()}
          </motion.div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`mx-6 mb-4 p-3 rounded-xl ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                testResult.success 
                  ? 'text-green-800 dark:text-green-400' 
                  : 'text-red-800 dark:text-red-400'
              }`}>
                {testResult.success ? 'Connection Successful' : 'Connection Failed'}
              </span>
            </div>
            {testResult.error && (
              <p className="text-sm text-red-700 dark:text-red-300">
                {testResult.error}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-card-border">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-xl hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Config</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NodeConfigDrawer;