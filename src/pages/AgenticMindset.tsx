import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Brain, DollarSign, Heart, FileText, Lightbulb, Target, Users, Zap } from 'lucide-react';

interface PlatformExample {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
  industry: string;
}

const platformExamples: PlatformExample[] = [
  {
    id: 'ctis',
    title: 'Clinical Trial Intelligence System Platform',
    description: 'An advanced AI-powered platform that revolutionizes clinical trial management through intelligent automation and data-driven insights. The system leverages agentic AI to optimize patient recruitment, protocol design, and regulatory compliance processes. It demonstrates how autonomous agents can transform complex healthcare workflows while maintaining the highest standards of safety and efficacy.',
    url: 'https://ctis-example-app.whitefield-37f6a367.eastus.azurecontainerapps.io/',
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    industry: 'Healthcare'
  },
  {
    id: 'finops',
    title: 'FinOps Platform',
    description: 'A comprehensive financial operations platform that employs agentic AI to automate cost optimization, budget forecasting, and resource allocation across cloud infrastructure. The platform showcases how intelligent agents can continuously monitor, analyze, and optimize financial performance without human intervention. It represents the future of autonomous financial management in enterprise environments.',
    url: 'https://agentbridge-finops-app--x2cmqh2.whitefield-37f6a367.eastus.azurecontainerapps.io/',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    industry: 'Finance'
  },
  {
    id: 'medicaid',
    title: 'Medicaid Assist Platform',
    description: 'An intelligent healthcare assistance platform that streamlines Medicaid application processes and eligibility verification through agentic AI workflows. The system autonomously guides users through complex application procedures, validates documentation, and provides real-time status updates. This platform exemplifies how AI agents can democratize access to healthcare services while reducing administrative burden.',
    url: 'https://agentbridge-medicaid.blackpebble-ce020fe5.canadacentral.azurecontainerapps.io/',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    industry: 'Healthcare'
  },
  {
    id: 'clm',
    title: 'Contract Life Cycle Management Platform',
    description: 'A sophisticated contract management system powered by agentic AI that automates the entire contract lifecycle from creation to renewal. The platform intelligently drafts contracts, negotiates terms, monitors compliance, and predicts renewal opportunities using autonomous agent workflows. It demonstrates how AI can transform legal and procurement processes through intelligent automation.',
    url: 'https://contract-lifecycle-agentic-app.whitefield-37f6a367.eastus.azurecontainerapps.io/',
    icon: FileText,
    color: 'from-purple-500 to-violet-600',
    industry: 'Legal'
  }
];

const AgenticMindset: React.FC = () => {
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
        className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-card-border px-6 py-8 transition-colors"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary">The Agentic Mindset</h1>
              <p className="text-lg text-gray-600 dark:text-text-muted mt-2">
                Exploring Real-World Applications of Autonomous AI Agents
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-4">
              <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-2">
                  What is the Agentic Mindset?
                </h3>
                <p className="text-gray-700 dark:text-text-muted leading-relaxed">
                  The agentic mindset represents a fundamental shift in how we approach AI implementation - moving from reactive, 
                  human-directed systems to proactive, autonomous agents that can reason, plan, and execute complex workflows 
                  independently. These platforms showcase real-world applications where AI agents operate with minimal human 
                  intervention, making intelligent decisions and adapting to changing conditions in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Platform Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-4">
              Live Platform Demonstrations
            </h2>
            <p className="text-gray-600 dark:text-text-muted max-w-3xl mx-auto">
              Explore these production-ready platforms that demonstrate the power of agentic AI across different industries. 
              Each platform showcases autonomous agents working together to solve complex business challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platformExamples.map((platform, index) => {
              const Icon = platform.icon;
              
              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white dark:bg-card-bg rounded-xl shadow-lg border border-gray-200 dark:border-card-border overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${platform.color} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8" />
                        <div>
                          <h3 className="text-xl font-bold">{platform.title}</h3>
                          <span className="inline-block px-2 py-1 bg-white/20 rounded-full text-sm font-medium mt-1">
                            {platform.industry}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleExternalLink(platform.url)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Open Platform"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-text-muted leading-relaxed mb-6">
                      {platform.description}
                    </p>

                    {/* Key Features */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-text-primary flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>Agentic Capabilities</span>
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {platform.id === 'ctis' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Autonomous patient recruitment optimization</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Intelligent protocol design assistance</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Real-time regulatory compliance monitoring</span>
                            </div>
                          </>
                        )}
                        {platform.id === 'finops' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Automated cost optimization strategies</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Predictive budget forecasting</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Dynamic resource allocation</span>
                            </div>
                          </>
                        )}
                        {platform.id === 'medicaid' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Intelligent application guidance</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Automated eligibility verification</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Real-time status tracking</span>
                            </div>
                          </>
                        )}
                        {platform.id === 'clm' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Autonomous contract drafting</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Intelligent term negotiation</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
                              <Zap className="w-3 h-3 text-green-500" />
                              <span>Proactive compliance monitoring</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleExternalLink(platform.url)}
                      className={`w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r ${platform.color} text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium`}
                    >
                      <span>Explore Live Platform</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Build Your Own Agentic Platform?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            These platforms demonstrate the transformative power of agentic AI. Start building your own autonomous 
            agent workflows with AgentBridge's comprehensive development platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('https://agentbridge.cloud/', '_blank')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Start Building
            </motion.button>
          </div>
          <div className="flex justify-center mt-4">
            <style dangerouslySetInnerHTML={{
              __html: `
                .libutton {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  padding: 7px;
                  text-align: center;
                  outline: none;
                  text-decoration: none !important;
                  color: #ffffff !important;
                  width: 200px;
                  height: 32px;
                  border-radius: 16px;
                  background-color: #0A66C2;
                  font-family: "SF Pro Text", Helvetica, sans-serif;
                }
              `
            }} />
            <a className="libutton" href="https://www.sonata-software.com/" target="_blank" rel="noopener noreferrer">
              Sonata Software
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AgenticMindset;