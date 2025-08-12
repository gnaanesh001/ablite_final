import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Store, 
  Wrench, 
  Brain, 
  Zap, 
  Monitor, 
  Rocket,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const layers = [
  { id: 'marketplace', label: 'Agent Marketplace', icon: Store, path: '/marketplace' },
  { id: 'workshop', label: 'Agent Builder', icon: Wrench, path: '/workshop' },
  { id: 'brain', label: 'Core Agent Logic', icon: Brain, path: '/brain' },
  { id: 'wiring', label: 'Integrations', icon: Zap, path: '/wiring' },
  { id: 'cctv', label: 'Observability & ROI', icon: Monitor, path: '/cctv' },
  { id: 'launchpad', label: 'Launchpad', icon: Rocket, path: '/launchpad' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeLayer, setActiveLayer } = useApp();

  const handleLayerClick = (layer: typeof layers[0]) => {
    setActiveLayer(layer.id);
    navigate(layer.path);
  };

  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 bg-white dark:bg-secondary border-r border-gray-200 dark:border-card-border shadow-sm transition-colors"
    >
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-text-muted uppercase tracking-wider mb-4">
          Platform Layers
        </h2>
        
        <nav className="space-y-2">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            const isActive = location.pathname === layer.path || 
                           (location.pathname === '/' && layer.id === 'marketplace');
            
            return (
              <motion.button
                key={layer.id}
                onClick={() => handleLayerClick(layer)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-accent/20 text-blue-700 dark:text-accent shadow-sm border-r-2 border-accent' 
                    : 'text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-card-bg hover:text-gray-900 dark:hover:text-text-primary'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-accent' : 'text-gray-400 dark:text-text-muted'}`} />
                <span className="font-medium">{layer.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-blue-600 dark:bg-accent rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-card-border">
          <motion.button
            onClick={() => navigate('/docs')}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
              ${location.pathname === '/docs'
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-card-bg hover:text-gray-900 dark:hover:text-text-primary'
              }
            `}
          >
            <BookOpen className={`w-5 h-5 ${location.pathname === '/docs' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-text-muted'}`} />
            <span className="font-medium">Documentation</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/agentic-mindset')}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mt-2
              ${location.pathname === '/agentic-mindset'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-card-bg hover:text-gray-900 dark:hover:text-text-primary'
              }
            `}
          >
            <Lightbulb className={`w-5 h-5 ${location.pathname === '/agentic-mindset' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-text-muted'}`} />
            <span className="font-medium">The Agentic Mindset</span>
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;