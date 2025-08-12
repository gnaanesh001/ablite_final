import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Building2, 
  Briefcase, 
  Heart, 
  ShoppingCart,
  GraduationCap,
  Car,
  Plane,
  Home,
  DollarSign,
  Star,
  Play,
  Rocket,
  Eye,
  MoreHorizontal
} from 'lucide-react';

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

interface IndustryGroup {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  agents: Agent[];
}

interface IndustryGroupViewProps {
  agents: Agent[];
  onPreview: (agent: Agent) => void;
  onDeploy: (agent: Agent) => void;
}

const defaultIndustryGroups: IndustryGroup[] = [
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    agents: []
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    agents: []
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: ShoppingCart,
    color: 'from-blue-500 to-cyan-600',
    agents: []
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'from-purple-500 to-violet-600',
    agents: []
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Building2,
    color: 'from-orange-500 to-amber-600',
    agents: []
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: Briefcase,
    color: 'from-gray-600 to-slate-700',
    agents: []
  }
  { icon: Building2, name: 'Microscope', color: 'text-teal-600' },
];

const IndustryGroupView: React.FC<IndustryGroupViewProps> = ({ 
  agents, 
  onPreview, 
  onDeploy 
}) => {
  const [sectionTitle, setSectionTitle] = useState('Industries');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitle);
  const [industryGroups, setIndustryGroups] = useState<IndustryGroup[]>(() => {
    // Group agents by industry
    const groupedAgents = defaultIndustryGroups.map(group => ({
      ...group,
      agents: agents.filter(agent => 
        agent.industry.toLowerCase() === group.name.toLowerCase()
      )
    }));
    return groupedAgents;
  });
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [tempGroupName, setTempGroupName] = useState('');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleTitleEdit = useCallback(() => {
    setIsEditingTitle(true);
    setTempTitle(sectionTitle);
  }, [sectionTitle]);

  const handleTitleSave = useCallback(() => {
    setSectionTitle(tempTitle);
    setIsEditingTitle(false);
  }, [tempTitle]);

  const handleTitleCancel = useCallback(() => {
    setTempTitle(sectionTitle);
    setIsEditingTitle(false);
  }, [sectionTitle]);

  const handleGroupEdit = useCallback((groupId: string, currentName: string) => {
    setEditingGroup(groupId);
    setTempGroupName(currentName);
  }, []);

  const handleGroupSave = useCallback((groupId: string) => {
    setIndustryGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, name: tempGroupName }
        : group
    ));
    setEditingGroup(null);
    setTempGroupName('');
  }, [tempGroupName]);

  const handleGroupCancel = useCallback(() => {
    setEditingGroup(null);
    setTempGroupName('');
  }, []);

  const handleGroupRemove = useCallback((groupId: string) => {
    setIndustryGroups(prev => prev.filter(group => group.id !== groupId));
  }, []);

  const handleAddGroup = useCallback(() => {
    if (!newGroupName.trim()) return;
    
    const newGroup: IndustryGroup = {
      id: `custom-${Date.now()}`,
      name: newGroupName,
      icon: Building2,
      color: 'from-indigo-500 to-blue-600',
      agents: []
    };
    
    setIndustryGroups(prev => [...prev, newGroup]);
    setNewGroupName('');
    setShowAddGroup(false);
  }, [newGroupName]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPlanBadge = (plan: string) => {
    if (plan === 'Free') return null;
    
    const colors = {
      Pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      Enterprise: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plan as keyof typeof colors]}`}>
        {plan}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isEditingTitle ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b-2 border-accent focus:outline-none text-gray-900 dark:text-text-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') handleTitleCancel();
                }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTitleSave}
                className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTitleCancel}
                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">{sectionTitle}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTitleEdit}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-text-primary transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddGroup(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Group</span>
        </motion.button>
      </div>

      {/* Industry Groups */}
      <div className="space-y-6">
        <AnimatePresence>
          {industryGroups.map((group, groupIndex) => {
            const Icon = group.icon;
            const hasAgents = group.agents.length > 0;
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${group.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {editingGroup === group.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tempGroupName}
                          onChange={(e) => setTempGroupName(e.target.value)}
                          className="text-xl font-semibold bg-transparent border-b-2 border-accent focus:outline-none text-gray-900 dark:text-text-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleGroupSave(group.id);
                            if (e.key === 'Escape') handleGroupCancel();
                          }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleGroupSave(group.id)}
                          className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleGroupCancel}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary">
                          {group.name}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted rounded-full text-sm">
                          {group.agents.length} agents
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGroupEdit(group.id, group.name)}
                      className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGroupRemove(group.id)}
                      className="flex items-center space-x-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </motion.button>
                  </div>
                </div>

                {/* Agents Grid */}
                {hasAgents ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.agents.map((agent, agentIndex) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: agentIndex * 0.05 }}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="bg-gray-50 dark:bg-secondary rounded-lg p-4 border border-gray-200 dark:border-card-border hover:shadow-md transition-all duration-300"
                      >
                        {/* Agent Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-text-primary text-sm">
                                {agent.title}
                              </h4>
                              {getPlanBadge(agent.plan)}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-text-muted line-clamp-2">
                              {agent.description}
                            </p>
                          </div>
                          
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                            {agent.status}
                          </span>
                        </div>

                        {/* Agent Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {agent.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-white dark:bg-card-bg text-gray-600 dark:text-text-muted text-xs rounded-full border border-gray-200 dark:border-card-border"
                            >
                              {tag}
                            </span>
                          ))}
                          {agent.tags.length > 2 && (
                            <span className="px-2 py-1 bg-white dark:bg-card-bg text-gray-400 dark:text-text-muted text-xs rounded-full border border-gray-200 dark:border-card-border">
                              +{agent.tags.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Agent Stats */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-medium text-gray-900 dark:text-text-primary">
                              {agent.rating}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-text-muted">
                              ({agent.reviews})
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-success">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              ${agent.roiSaved.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Agent Actions */}
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onPreview(agent)}
                            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded text-xs hover:bg-white dark:hover:bg-card-bg transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDeploy(agent)}
                            className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 bg-accent text-white rounded text-xs hover:bg-teal-600 transition-colors"
                          >
                            <Rocket className="w-3 h-3" />
                            <span>Deploy</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg"
                  >
                    <Icon className="w-12 h-12 text-gray-400 dark:text-text-muted mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-text-primary mb-2">
                      No agents in {group.name}
                    </h4>
                    <p className="text-gray-600 dark:text-text-muted mb-4">
                      Agents for this industry will appear here when available
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      Browse All Agents
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Group Modal */}
      <AnimatePresence>
        {showAddGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddGroup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-4">
                Add New Group
              </h3>
              <p className="text-gray-600 dark:text-text-muted mb-6">
                Create a new category to organize your agents
              </p>
              
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddGroup();
                  if (e.key === 'Escape') setShowAddGroup(false);
                }}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddGroup(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddGroup}
                  disabled={!newGroupName.trim()}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Group
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IndustryGroupView;