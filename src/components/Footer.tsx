import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-surface dark:bg-primary border-t border-gray-200 dark:border-card-border px-6 py-4 transition-colors"
    >
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-text-muted">
        <div className="flex items-center space-x-4">
          <span>AgentBridge v1.0.0</span>
          <span>•</span>
          <a 
            href="https://www.sonata-software.com" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center space-x-2 hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            <span>Powered by</span>
            <img 
              src="/sonata.png" 
              alt="Sonata Software" 
              className="h-5 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>Sonata Software</span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            Privacy Policy
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="hover:text-gray-900 dark:hover:text-text-primary transition-colors"
          >
            Terms of Service
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;