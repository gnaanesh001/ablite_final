import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Edit3, Trash2, Check, AlertCircle, 
  Building2, Tag, Users, Briefcase, Heart, ShoppingCart,
  GraduationCap, Car, Plane, Home, DollarSign, Zap
} from 'lucide-react';
import { GroupConfig, TagConfig } from '../types/marketplace';

interface ManageGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: GroupConfig[];
  tags: TagConfig[];
  onUpdateGroups: (groups: GroupConfig[]) => void;
  onUpdateTags: (tags: TagConfig[]) => void;
}

const defaultIcons = [
  { icon: Building2, name: 'Building', color: 'text-blue-500' },
  { icon: Briefcase, name: 'Briefcase', color: 'text-gray-600' },
  { icon: Heart, name: 'Heart', color: 'text-red-500' },
  { icon: ShoppingCart, name: 'Shopping', color: 'text-green-500' },
  { icon: GraduationCap, name: 'Education', color: 'text-purple-500' },
  { icon: Car, name: 'Transport', color: 'text-orange-500' },
  { icon: Plane, name: 'Travel', color: 'text-blue-600' },
  { icon: Home, name: 'Home', color: 'text-indigo-500' },
  { icon: DollarSign, name: 'Finance', color: 'text-green-600' },
  { icon: Zap, name: 'Energy', color: 'text-yellow-500' },
  { icon: Users, name: 'Team', color: 'text-pink-500' },
];

const tagColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-red-100 text-red-800',
  'bg-yellow-100 text-yellow-800',
];

const ManageGroupsModal: React.FC<ManageGroupsModalProps> = ({
  isOpen,
  onClose,
  groups,
  tags,
  onUpdateGroups,
  onUpdateTags
}) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'tags'>('groups');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(defaultIcons[0]);
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateGroupName = useCallback((name: string, excludeId?: string) => {
    if (!name.trim()) return 'Group name is required';
    if (groups.some(g => g.name.toLowerCase() === name.toLowerCase() && g.id !== excludeId)) {
      return 'Group name already exists';
    }
    return null;
  }, [groups]);

  const validateTagName = useCallback((name: string, excludeId?: string) => {
    if (!name.trim()) return 'Tag name is required';
    if (tags.some(t => t.name.toLowerCase() === name.toLowerCase() && t.id !== excludeId)) {
      return 'Tag name already exists';
    }
    return null;
  }, [tags]);

  const handleAddGroup = useCallback(() => {
    const error = validateGroupName(newGroupName);
    if (error) {
      setErrors({ newGroup: error });
      return;
    }

    const newGroup: GroupConfig = {
      id: `group-${Date.now()}`,
      name: newGroupName,
      icon: selectedIcon.name,
      color: selectedIcon.color,
      editable: true,
      count: 0
    };

    onUpdateGroups([...groups, newGroup]);
    setNewGroupName('');
    setShowAddGroup(false);
    setErrors({});
  }, [newGroupName, selectedIcon, groups, onUpdateGroups, validateGroupName]);

  const handleAddTag = useCallback(() => {
    const error = validateTagName(newTagName);
    if (error) {
      setErrors({ newTag: error });
      return;
    }

    const newTag: TagConfig = {
      id: `tag-${Date.now()}`,
      name: newTagName,
      color: selectedColor,
      count: 0
    };

    onUpdateTags([...tags, newTag]);
    setNewTagName('');
    setShowAddTag(false);
    setErrors({});
  }, [newTagName, selectedColor, tags, onUpdateTags, validateTagName]);

  const handleEditGroup = useCallback((groupId: string, newName: string) => {
    const error = validateGroupName(newName, groupId);
    if (error) {
      setErrors({ [groupId]: error });
      return;
    }

    const updatedGroups = groups.map(group =>
      group.id === groupId ? { ...group, name: newName } : group
    );
    onUpdateGroups(updatedGroups);
    setEditingGroup(null);
    setErrors({});
  }, [groups, onUpdateGroups, validateGroupName]);

  const handleEditTag = useCallback((tagId: string, newName: string) => {
    const error = validateTagName(newName, tagId);
    if (error) {
      setErrors({ [tagId]: error });
      return;
    }

    const updatedTags = tags.map(tag =>
      tag.id === tagId ? { ...tag, name: newName } : tag
    );
    onUpdateTags(updatedTags);
    setEditingTag(null);
    setErrors({});
  }, [tags, onUpdateTags, validateTagName]);

  const handleDeleteGroup = useCallback((groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group && group.count > 0) {
      if (!confirm(`This group contains ${group.count} workflows. Are you sure you want to delete it?`)) {
        return;
      }
    }
    
    const updatedGroups = groups.filter(g => g.id !== groupId);
    onUpdateGroups(updatedGroups);
  }, [groups, onUpdateGroups]);

  const handleDeleteTag = useCallback((tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && tag.count > 0) {
      if (!confirm(`This tag is used by ${tag.count} workflows. Are you sure you want to delete it?`)) {
        return;
      }
    }
    
    const updatedTags = tags.filter(t => t.id !== tagId);
    onUpdateTags(updatedTags);
  }, [tags, onUpdateTags]);

  if (!isOpen) return null;

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
          className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                Manage Groups & Tags
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-secondary rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('groups')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'groups'
                    ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Groups ({groups.length})</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('tags')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'tags'
                    ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Tags ({tags.length})</span>
              </motion.button>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              {activeTab === 'groups' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Add Group Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddGroup(true)}
                    className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg text-gray-600 dark:text-text-muted hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Group</span>
                  </motion.button>

                  {/* Add Group Form */}
                  {showAddGroup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border border-gray-200 dark:border-card-border rounded-lg p-4 bg-gray-50 dark:bg-secondary"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                            Group Name
                          </label>
                          <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary ${
                              errors.newGroup ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                            }`}
                            placeholder="Enter group name..."
                          />
                          {errors.newGroup && (
                            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.newGroup}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                            Icon
                          </label>
                          <div className="grid grid-cols-6 gap-2">
                            {defaultIcons.map((iconOption, index) => {
                              const Icon = iconOption.icon;
                              return (
                                <motion.button
                                  key={index}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setSelectedIcon(iconOption)}
                                  className={`p-3 rounded-lg border-2 transition-colors ${
                                    selectedIcon.name === iconOption.name
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                                  }`}
                                >
                                  <Icon className={`w-5 h-5 ${iconOption.color}`} />
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowAddGroup(false);
                              setNewGroupName('');
                              setErrors({});
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddGroup}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Add Group
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Groups List */}
                  <div className="space-y-3">
                    {groups.map((group) => {
                      const IconComponent = defaultIcons.find(i => i.name === group.icon)?.icon || Building2;
                      
                      return (
                        <motion.div
                          key={group.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-card-border rounded-lg hover:shadow-md transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-5 h-5 ${group.color}`} />
                            {editingGroup === group.id ? (
                              <input
                                type="text"
                                defaultValue={group.name}
                                onBlur={(e) => handleEditGroup(group.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleEditGroup(group.id, e.currentTarget.value);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingGroup(null);
                                    setErrors({});
                                  }
                                }}
                                className={`px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary ${
                                  errors[group.id] ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                                }`}
                                autoFocus
                              />
                            ) : (
                              <div>
                                <span className="font-medium text-gray-900 dark:text-text-primary">{group.name}</span>
                                <span className="ml-2 text-sm text-gray-500 dark:text-text-muted">
                                  ({group.count} workflows)
                                </span>
                              </div>
                            )}
                            {errors[group.id] && (
                              <p className="text-sm text-red-600 flex items-center space-x-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors[group.id]}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {group.editable && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setEditingGroup(group.id)}
                                  className="p-2 text-gray-600 dark:text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteGroup(group.id)}
                                  className="p-2 text-gray-600 dark:text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'tags' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Add Tag Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddTag(true)}
                    className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 dark:border-card-border rounded-lg text-gray-600 dark:text-text-muted hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Tag</span>
                  </motion.button>

                  {/* Add Tag Form */}
                  {showAddTag && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border border-gray-200 dark:border-card-border rounded-lg p-4 bg-gray-50 dark:bg-secondary"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                            Tag Name
                          </label>
                          <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary ${
                              errors.newTag ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                            }`}
                            placeholder="Enter tag name..."
                          />
                          {errors.newTag && (
                            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors.newTag}</span>
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                            Color
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {tagColors.map((color, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedColor(color)}
                                className={`p-3 rounded-lg border-2 transition-colors ${
                                  selectedColor === color
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-card-border hover:border-blue-300'
                                }`}
                              >
                                <div className={`w-full h-4 rounded ${color.split(' ')[0]} ${color.split(' ')[0].replace('100', '500')}`} />
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowAddTag(false);
                              setNewTagName('');
                              setErrors({});
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddTag}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Add Tag
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tags List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tags.map((tag) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-card-border rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          {editingTag === tag.id ? (
                            <input
                              type="text"
                              defaultValue={tag.name}
                              onBlur={(e) => handleEditTag(tag.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditTag(tag.id, e.currentTarget.value);
                                }
                                if (e.key === 'Escape') {
                                  setEditingTag(null);
                                  setErrors({});
                                }
                              }}
                              className={`px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary ${
                                errors[tag.id] ? 'border-red-500' : 'border-gray-300 dark:border-card-border'
                              }`}
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}>
                                {tag.name}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-text-muted">
                                ({tag.count})
                              </span>
                            </div>
                          )}
                          {errors[tag.id] && (
                            <p className="text-sm text-red-600 flex items-center space-x-1">
                              <AlertCircle className="w-4 h-4" />
                              <span>{errors[tag.id]}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingTag(tag.id)}
                            className="p-2 text-gray-600 dark:text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-2 text-gray-600 dark:text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ManageGroupsModal;