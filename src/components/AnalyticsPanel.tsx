import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Clock, 
  BarChart3, PieChart, Activity, Star,
  Calendar, Filter, Download, RefreshCw
} from 'lucide-react';
import { AnalyticsData, WorkflowAgent } from '../types/marketplace';

interface AnalyticsPanelProps {
  analyticsData: AnalyticsData;
  workflows: WorkflowAgent[];
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  analyticsData,
  workflows
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('deployments');

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const metrics = [
    { value: 'deployments', label: 'Deployments', icon: Activity },
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
    { value: 'views', label: 'Views', icon: Users },
    { value: 'rating', label: 'Rating', icon: Star }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const totalRevenue = Object.values(analyticsData.groupBreakdown)
    .reduce((sum, group) => sum + group.revenue, 0);

  const totalDeployments = Object.values(analyticsData.groupBreakdown)
    .reduce((sum, group) => sum + group.deployments, 0);

  const totalViews = workflows.reduce((sum, workflow) => sum + workflow.analytics.views, 0);

  const averageRating = workflows.length > 0 
    ? workflows.reduce((sum, workflow) => sum + workflow.analytics.rating, 0) / workflows.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Analytics Dashboard</h2>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 dark:text-text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {formatCurrency(totalRevenue)}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {formatNumber(totalDeployments)}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Total Deployments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {formatNumber(totalViews)}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Total Views</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">+0.2</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-1">
            {averageRating.toFixed(1)}
          </h3>
          <p className="text-gray-600 dark:text-text-muted text-sm">Average Rating</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Deployment Trends</span>
            </h3>
            
            <div className="flex items-center space-x-2">
              {metrics.map(metric => {
                const Icon = metric.icon;
                return (
                  <motion.button
                    key={metric.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMetric(metric.value)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedMetric === metric.value
                        ? 'bg-accent text-white'
                        : 'text-gray-600 dark:text-text-muted hover:bg-gray-100 dark:hover:bg-secondary'
                    }`}
                    title={metric.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Simple Chart Visualization */}
          <div className="space-y-3">
            {analyticsData.deploymentTrends.map((trend, index) => (
              <div key={trend.period} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-text-muted w-16">
                  {trend.period}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-secondary rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(selectedMetric === 'revenue' ? trend.revenue : trend.deployments) / 
                        Math.max(...analyticsData.deploymentTrends.map(t => 
                          selectedMetric === 'revenue' ? t.revenue : t.deployments
                        )) * 100}%` 
                    }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-accent h-2 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-text-primary w-16 text-right">
                  {selectedMetric === 'revenue' 
                    ? formatCurrency(trend.revenue)
                    : formatNumber(trend.deployments)
                  }
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Group Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-6 flex items-center space-x-2">
            <PieChart className="w-5 h-5" />
            <span>Group Breakdown</span>
          </h3>

          <div className="space-y-4">
            {Object.entries(analyticsData.groupBreakdown).map(([group, data], index) => {
              const percentage = (data.revenue / totalRevenue) * 100;
              
              return (
                <div key={group} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-text-primary">{group}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-text-primary">
                        {formatCurrency(data.revenue)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-text-muted">
                        {data.deployments} deployments
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-secondary rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-accent to-teal-600 h-2 rounded-full"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-text-muted">
                    {percentage.toFixed(1)}% of total revenue
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top by Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Top Agents by Usage</span>
          </h3>

          <div className="space-y-4">
            {analyticsData.topAgents.byUsage.slice(0, 5).map((agent, index) => (
              <div key={agent.id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-text-primary">{agent.name}</div>
                  <div className="text-sm text-gray-600 dark:text-text-muted">
                    {agent.analytics.deployments} deployments • {agent.analytics.views} views
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{agent.analytics.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top by Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-6 flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Top Agents by Revenue</span>
          </h3>

          <div className="space-y-4">
            {analyticsData.topAgents.byRevenue.slice(0, 5).map((agent, index) => (
              <div key={agent.id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-text-primary">{agent.name}</div>
                  <div className="text-sm text-gray-600 dark:text-text-muted">
                    {agent.monetization.type} • {agent.group}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(agent.analytics.revenue)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-text-muted">
                    {agent.analytics.deployments} deployments
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Approval Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-6 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Approval Metrics</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
              {analyticsData.approvalMetrics.averageLatency}h
            </div>
            <div className="text-sm text-gray-600 dark:text-text-muted">Average Approval Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {analyticsData.approvalMetrics.pendingCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-text-muted">Pending Approvals</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {(analyticsData.approvalMetrics.approvalRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-text-muted">Approval Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPanel;