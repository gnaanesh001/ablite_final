import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ExternalLink, Activity, RefreshCw, Square, Play,
  Monitor, Cpu, HardDrive, Globe, DollarSign, Clock,
  TrendingUp, AlertTriangle, CheckCircle, BarChart3,
  Terminal, Download, Copy, Settings, Trash2, Edit3
} from 'lucide-react';

interface DeploymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deployment: any;
  onAction: (action: string, deployment: any) => void;
}

const DeploymentDetailsModal: React.FC<DeploymentDetailsModalProps> = ({
  isOpen,
  onClose,
  deployment,
  onAction
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'logs' | 'settings'>('overview');

  if (!isOpen || !deployment) return null;

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
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const mockLogs = [
    { timestamp: '2024-01-24T14:22:15Z', level: 'INFO', message: 'Processing PDF document: financial_report_q4.pdf' },
    { timestamp: '2024-01-24T14:22:18Z', level: 'INFO', message: 'Text extraction completed: 45 pages processed' },
    { timestamp: '2024-01-24T14:22:22Z', level: 'INFO', message: 'Generating podcast script using GPT-4' },
    { timestamp: '2024-01-24T14:22:45Z', level: 'INFO', message: 'Voice synthesis started with ElevenLabs' },
    { timestamp: '2024-01-24T14:23:12Z', level: 'INFO', message: 'Podcast generation completed successfully' },
    { timestamp: '2024-01-24T14:23:15Z', level: 'WARN', message: 'High memory usage detected: 89% of allocated memory' },
    { timestamp: '2024-01-24T14:23:18Z', level: 'INFO', message: 'Response sent to client: 200 OK' }
  ];

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
          className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Sonata Branding */}
          <div className="p-6 border-b border-gray-200 dark:border-card-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                    {deployment.name}
                  </h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(deployment.status)}`}>
                      {getStatusIcon(deployment.status)}
                      <span>{deployment.status}</span>
                    </span>
                    <span className="text-sm text-gray-600 dark:text-text-muted">
                      {deployment.provider.toUpperCase()} • {deployment.region}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <a 
                  href="https://www.sonata-software.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img 
                    src="/sonata.png" 
                    alt="Sonata Software" 
                    className="h-8 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </a>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(deployment.url, '_blank')}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open App</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(deployment.langfuseUrl, '_blank')}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Activity className="w-4 h-4" />
                  <span>Langfuse</span>
                </motion.button>
                
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

            {/* Tabs */}
            <div className="flex space-x-8 mt-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Monitor },
                { id: 'metrics', label: 'Metrics', icon: BarChart3 },
                { id: 'logs', label: 'Logs', icon: Terminal },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 pb-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
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
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction('restart', deployment)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restart</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction('stop', deployment)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAction('scale', deployment)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Scale</span>
                  </motion.button>
                </div>

                {/* Resource Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Cpu className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium text-gray-900 dark:text-text-primary">Compute</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">CPU:</span>
                        <span className="text-gray-900 dark:text-text-primary">{deployment.resources.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Memory:</span>
                        <span className="text-gray-900 dark:text-text-primary">{deployment.resources.memory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">GPU:</span>
                        <span className="text-gray-900 dark:text-text-primary">{deployment.resources.gpu}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <HardDrive className="w-5 h-5 text-purple-500" />
                      <h3 className="font-medium text-gray-900 dark:text-text-primary">Storage</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Type:</span>
                        <span className="text-gray-900 dark:text-text-primary">SSD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Size:</span>
                        <span className="text-gray-900 dark:text-text-primary">{deployment.resources.storage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Used:</span>
                        <span className="text-gray-900 dark:text-text-primary">45%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Globe className="w-5 h-5 text-green-500" />
                      <h3 className="font-medium text-gray-900 dark:text-text-primary">Network</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Bandwidth:</span>
                        <span className="text-gray-900 dark:text-text-primary">10 Gbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">SSL:</span>
                        <span className="text-green-600 dark:text-green-400">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">CDN:</span>
                        <span className="text-green-600 dark:text-green-400">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <DollarSign className="w-5 h-5 text-orange-500" />
                      <h3 className="font-medium text-gray-900 dark:text-text-primary">Cost</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Current:</span>
                        <span className="text-gray-900 dark:text-text-primary">{deployment.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">This Month:</span>
                        <span className="text-gray-900 dark:text-text-primary">$2,847.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-text-muted">Projected:</span>
                        <span className="text-orange-600 dark:text-orange-400">$3,825.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'metrics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">+5.2%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                      {deployment.metrics.requests.toLocaleString()}
                    </h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Total Requests</p>
                  </div>

                  <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">-12ms</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                      {deployment.metrics.avgLatency}
                    </h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Avg Latency</p>
                  </div>

                  <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">+0.1%</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                      {deployment.metrics.errorRate}
                    </h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Error Rate</p>
                  </div>

                  <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">{deployment.metrics.uptime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                      24/7
                    </h3>
                    <p className="text-gray-600 dark:text-text-muted text-sm">Availability</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">
                    Application Logs
                  </h3>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </motion.button>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="space-y-1">
                    {mockLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-gray-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`font-medium whitespace-nowrap ${
                          log.level === 'ERROR' ? 'text-red-400' :
                          log.level === 'WARN' ? 'text-yellow-400' :
                          log.level === 'INFO' ? 'text-blue-400' :
                          'text-gray-400'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-gray-300">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Deployment Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Environment Variables
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-card-bg rounded-lg">
                          <span className="font-mono text-sm text-gray-900 dark:text-text-primary">OPENAI_API_KEY</span>
                          <span className="text-gray-500">•••••••••••••••••••••••••••••••••••••••••</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                      <h4 className="font-medium text-red-900 dark:text-red-400 mb-3">Danger Zone</h4>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onAction('delete', deployment)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Deployment</span>
                        </motion.button>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          This action cannot be undone. All data and configurations will be permanently deleted.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeploymentDetailsModal;