import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring AgentBridge',
    features: [
      '5 agents per month',
      'Basic marketplace access',
      'Community support',
      '1GB storage'
    ],
    buttonText: 'Current Plan',
    buttonDisabled: true
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For teams building production agents',
    features: [
      'Unlimited agents',
      'Advanced marketplace features',
      'Priority support',
      '10GB storage',
      'Custom integrations',
      'Advanced analytics'
    ],
    buttonText: 'Upgrade to Pro',
    buttonDisabled: false,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale deployments',
    features: [
      'Everything in Pro',
      'Custom deployment options',
      'Dedicated support',
      'Unlimited storage',
      'SSO integration',
      'SLA guarantees'
    ],
    buttonText: 'Contact Sales',
    buttonDisabled: false
  }
];

const PricingModal: React.FC = () => {
  const { setShowPricing } = useApp();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setShowPricing(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Choose Your Plan</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPricing(false)}
                className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative rounded-lg border-2 p-6 ${
                      plan.popular
                        ? 'border-accent bg-blue-50 dark:bg-accent/10'
                        : 'border-gray-200 dark:border-card-border bg-white dark:bg-secondary'
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
                      {plan.price}
                      {plan.name !== 'Enterprise' && (
                        <span className="text-sm font-normal text-gray-600 dark:text-text-muted">/month</span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-text-muted">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: plan.buttonDisabled ? 1 : 1.05 }}
                    whileTap={{ scale: plan.buttonDisabled ? 1 : 0.95 }}
                    disabled={plan.buttonDisabled}
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        plan.buttonDisabled
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-accent text-white hover:bg-teal-600'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }
                    `}
                  >
                    {plan.buttonText}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingModal;