import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, Check, AlertTriangle,
  Server, Cpu, HardDrive, Database, Globe, Key,
  Settings, Code, Brain, Zap, Users, Shield,
  Play, Clock, DollarSign, Activity, Monitor,
  Github, ExternalLink, Copy, Download, Terminal,
  Cloud, Building2
} from 'lucide-react';

interface LaunchConfig {
  blueprint: any;
  provider: string;
  region: string;
  compute: {
    type: string;
    cpu: string;
    memory: string;
    gpu: string;
    storage: string;
  };
  scaling: {
    mode: string;
    minInstances: number;
    maxInstances: number;
  };
  environment: {
    modelAccess: string[];
    langsmithToken: string;
    secretsManager: string;
    variables: Record<string, string>;
    hitlMode: boolean;
  };
  networking: {
    publicAccess: boolean;
    customDomain: string;
    ssl: boolean;
  };
}

interface LaunchConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: any;
  cloudProviders: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  onLaunch: (config: LaunchConfig) => void;
}

const computeTypes = [
  {
    id: 'cpu-optimized',
    name: 'CPU Optimized',
    description: 'Best for general workloads',
    specs: { cpu: '4 vCPUs', memory: '16 GB', gpu: 'None', storage: '100 GB SSD' },
    cost: '$0.15/hour',
    icon: Cpu
  },
  {
    id: 'gpu-single',
    name: 'Single GPU',
    description: 'For AI inference workloads',
    specs: { cpu: '8 vCPUs', memory: '32 GB', gpu: '1x NVIDIA A100', storage: '200 GB SSD' },
    cost: '$2.50/hour',
    icon: Brain
  },
  {
    id: 'gpu-multi',
    name: 'Multi-GPU',
    description: 'For large model training',
    specs: { cpu: '16 vCPUs', memory: '64 GB', gpu: '4x NVIDIA A100', storage: '500 GB SSD' },
    cost: '$8.00/hour',
    icon: Zap
  },
  {
    id: 'memory-optimized',
    name: 'Memory Optimized',
    description: 'For large dataset processing',
    specs: { cpu: '8 vCPUs', memory: '128 GB', gpu: 'None', storage: '250 GB SSD' },
    cost: '$1.20/hour',
    icon: Database
  }
];

const modelProviders = [
  { id: 'openai', name: 'OpenAI (GPT-4o, GPT-4)', icon: '🤖' },
  { id: 'anthropic', name: 'Anthropic (Claude)', icon: '🧠' },
  { id: 'google', name: 'Google (Gemini)', icon: '🔍' },
  { id: 'mistral', name: 'Mistral AI', icon: '🌪️' },
  { id: 'nvidia', name: 'NVIDIA NIM', icon: '🟢' },
  { id: 'huggingface', name: 'Hugging Face', icon: '🤗' }
];

const regions = {
  aws: [
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'us-west-2', name: 'US West (Oregon)' },
    { id: 'eu-west-1', name: 'Europe (Ireland)' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' }
  ],
  azure: [
    { id: 'eastus', name: 'East US' },
    { id: 'westus2', name: 'West US 2' },
    { id: 'westeurope', name: 'West Europe' },
    { id: 'southeastasia', name: 'Southeast Asia' }
  ],
  gcp: [
    { id: 'us-central1', name: 'US Central 1' },
    { id: 'us-west1', name: 'US West 1' },
    { id: 'europe-west1', name: 'Europe West 1' },
    { id: 'asia-southeast1', name: 'Asia Southeast 1' }
  ],
  nvidia: [
    { id: 'us-west', name: 'US West' },
    { id: 'us-east', name: 'US East' },
    { id: 'europe', name: 'Europe' }
  ],
  oci: [
    { id: 'us-ashburn-1', name: 'US East (Ashburn)' },
    { id: 'us-phoenix-1', name: 'US West (Phoenix)' },
    { id: 'eu-frankfurt-1', name: 'Germany Central (Frankfurt)' }
  ],
  onprem: [
    { id: 'datacenter-1', name: 'Primary Datacenter' },
    { id: 'datacenter-2', name: 'Secondary Datacenter' }
  ]
};

const LaunchConfiguratorModal: React.FC<LaunchConfiguratorModalProps> = ({
  isOpen,
  onClose,
  blueprint,
  cloudProviders,
  onLaunch
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [config, setConfig] = useState<Partial<LaunchConfig>>({
    provider: 'aws',
    region: 'us-west-2',
    compute: {
      type: 'gpu-single',
      cpu: '8 vCPUs',
      memory: '32 GB',
      gpu: '1x NVIDIA A100',
      storage: '200 GB SSD'
    },
    scaling: {
      mode: 'single',
      minInstances: 1,
      maxInstances: 1
    },
    environment: {
      modelAccess: ['openai'],
      langsmithToken: '',
      secretsManager: 'aws-secrets',
      variables: {},
      hitlMode: false
    },
    networking: {
      publicAccess: true,
      customDomain: '',
      ssl: true
    }
  });

  const steps = [
    { id: 1, title: 'Select Blueprint', icon: Code },
    { id: 2, title: 'Cloud Provider', icon: Globe },
    { id: 3, title: 'Compute Resources', icon: Server },
    { id: 4, title: 'Environment', icon: Settings },
    { id: 5, title: 'Review & Launch', icon: Play }
  ];

  const handleNext = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, steps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleLaunch = useCallback(async () => {
    if (!blueprint) return;
    
    setIsDeploying(true);
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const fullConfig: LaunchConfig = {
      blueprint,
      provider: config.provider!,
      region: config.region!,
      compute: config.compute!,
      scaling: config.scaling!,
      environment: config.environment!,
      networking: config.networking!
    };
    
    onLaunch(fullConfig);
    setIsDeploying(false);
    onClose();
  }, [blueprint, config, onLaunch, onClose]);

  if (!isOpen || !blueprint) return null;

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
                    Launch Blueprint
                  </h2>
                  <p className="text-gray-600 dark:text-text-muted mt-1">
                    Deploy {blueprint.name} to production
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4 mt-6 overflow-x-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {/* Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {currentStep === 1 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-2">
                    {blueprint.name}
                  </h3>
                  <p className="text-gray-600 dark:text-text-muted mb-4">
                    {blueprint.description}
                  </p>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                    <span>v{blueprint.currentVersion || '1.0.0'}</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Select Cloud Provider
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cloudProviders.map((provider) => (
                      <motion.button
                        key={provider.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfig(prev => ({ 
                          ...prev, 
                          provider: provider.id,
                          region: regions[provider.id as keyof typeof regions]?.[0]?.id || ''
                        }))}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          config.provider === provider.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{provider.icon}</span>
                          <span className="font-medium text-gray-900 dark:text-text-primary">
                            {provider.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-text-muted">
                          Deploy to {provider.name.split(' ')[0]} infrastructure
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Select Compute Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {computeTypes.map((computeType) => {
                      const Icon = computeType.icon;
                      return (
                        <motion.button
                          key={computeType.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setConfig(prev => ({ 
                            ...prev, 
                            compute: {
                              type: computeType.id,
                              ...computeType.specs
                            }
                          }))}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            config.compute?.type === computeType.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium text-gray-900 dark:text-text-primary">
                                {computeType.name}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {computeType.cost}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-text-muted">
                            {computeType.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">
                    Environment Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                        Model Access
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {modelProviders.map((provider) => (
                          <motion.button
                            key={provider.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 border rounded-lg text-left hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{provider.icon}</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
                                {provider.name}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-2">
                    Ready to Launch
                  </h3>
                  <p className="text-gray-600 dark:text-text-muted mb-6">
                    Your blueprint is configured and ready for deployment
                  </p>
                  <div className="bg-gray-50 dark:bg-secondary rounded-lg p-4 text-left max-w-md mx-auto">
                    <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">Configuration Summary</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-text-muted">
                      <div>Provider: {config.provider}</div>
                      <div>Region: {config.region}</div>
                      <div>Compute: {config.compute?.type}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-card-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </motion.button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  Cancel
                </motion.button>

                {currentStep < steps.length ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLaunch}
                    disabled={isDeploying}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isDeploying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Deploying...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Launch Blueprint</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LaunchConfiguratorModal;