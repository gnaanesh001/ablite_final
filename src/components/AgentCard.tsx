import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Rocket, DollarSign, Crown, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Agent {
  id: number;
  title: string;
  description: string;
  tags: string[];
  rating: number;
  reviews: number;
  status: string;
  roiSaved: number;
  plan: string;
  useCase: string;
  industry: string;
}

interface AgentCardProps {
  agent: Agent;
  index: number;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, index }) => {
  const { setShowPricing } = useApp();

  const handleDeploy = () => {
    if (agent.plan === 'Pro' || agent.plan === 'Enterprise') {
      setShowPricing(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'Pro':
        return <Crown className="w-3 h-3" />;
      case 'Enterprise':
        return <Shield className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-card-bg rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-6 hover:shadow-md transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-text-primary text-lg">{agent.title}</h3>
            {agent.plan !== 'Free' && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs">
                {getPlanIcon(agent.plan)}
                <span>{agent.plan}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-text-muted text-sm mb-3">{agent.description}</p>
        </div>
        
        <div className="flex items-center space-x-1 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
            {agent.status}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {agent.tags.map((tag, tagIndex) => (
          <span
            key={tagIndex}
            className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-700 dark:text-text-muted text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Rating & ROI */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{agent.rating}</span>
          </div>
          <span className="text-gray-400 dark:text-text-muted text-sm">({agent.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center space-x-1 text-success">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm font-medium">${agent.roiSaved.toLocaleString()} saved</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Preview</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDeploy}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Rocket className="w-4 h-4" />
          <span>Deploy</span>
        </motion.button>
      </div>

      {/* Pro Only Ribbon */}
      {agent.plan !== 'Free' && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          {agent.plan} Only
        </div>
      )}
    </motion.div>
  );
};

export default AgentCard;