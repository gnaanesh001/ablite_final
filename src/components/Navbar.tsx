import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, Settings, Sun, Moon, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { setShowPricing, isDarkMode, setIsDarkMode, setIsAuthenticated } = useApp();

  const handleLogout = () => {
    localStorage.removeItem('agentbridge_session');
    localStorage.removeItem('agentbridge_user');
    setIsAuthenticated(false);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-primary border-b border-gray-200 dark:border-card-border px-6 py-4 shadow-sm transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AB</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-text-primary">AgentBridge Agentic AI Framework</span>
            <span className="text-sm text-gray-600 dark:text-text-muted">by</span>
            <img 
              src="/sonata.png" 
              alt="Sonata Software" 
              className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity"
              onError={(e) => {
                // Fallback to text if image fails to load
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-xs font-semibold text-gray-700 dark:text-text-muted';
                  fallback.textContent = 'Sonata Software';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          
          {/* Official Link Icon */}
          <motion.a
            href="https://www.sonata-software.com/platformation-services/agentbridge"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-4 p-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            title="Visit AgentBridge Overview"
          >
            <ExternalLink className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search agents, workflows, or docs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPricing(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Pricing
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition-colors"
            title="Logout"
          >
            <User className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;