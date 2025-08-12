import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, Grid3X3, List, Star, 
  Download, Eye, Play, Clock, Users, Building2,
  Heart, Bookmark, TrendingUp, Zap, Brain, Code,
  Database, Globe, Shield, Target, Repeat, GitBranch,
  ChevronDown, ChevronRight, X, Tag, Activity,
  Sparkles, Crown, Award, Cpu, Cloud, Server
} from 'lucide-react';
import { Node, Edge } from 'reactflow';

// Industry categories with comprehensive templates
const industries = [
  'Healthcare & Life Sciences',
  'Banking & Finance', 
  'Retail & E-commerce',
  'Manufacturing & Industry',
  'Education & Training',
  'Legal & Compliance',
  'Automotive & Transportation',
  'Energy & Utilities',
  'Agriculture & Food',
  'Media & Entertainment'
];

// Agentic patterns
const agenticPatterns = [
  'ReAct', 'RAG', 'Multi-Agent', 'CodeAct', 'Tool-Use', 'Reflection'
];

// Complexity levels
const complexityLevels = [
  'Beginner', 'Intermediate', 'Advanced', 'Expert'
];

// Generate comprehensive workflow templates (1000+ templates)
const generateWorkflowTemplates = () => {
  const templates: any[] = [];
  let templateId = 1;

  industries.forEach((industry, industryIndex) => {
    // Generate 100 templates per industry
    for (let i = 0; i < 100; i++) {
      const pattern = agenticPatterns[i % agenticPatterns.length];
      const complexity = complexityLevels[Math.floor(i / 25)];
      
      // Industry-specific template names and descriptions
      const templateData = getIndustryTemplateData(industry, i, pattern);
      
      const template = {
        id: `template-${templateId++}`,
        name: templateData.name,
        description: templateData.description,
        industry,
        pattern,
        complexity,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
        downloads: Math.floor(Math.random() * 10000) + 100,
        favorites: Math.floor(Math.random() * 1000) + 50,
        executionTime: `${Math.floor(Math.random() * 30) + 5}min`,
        tags: templateData.tags,
        steps: templateData.steps, // At least 5 steps
        nodes: generateTemplateNodes(templateData.steps, pattern),
        edges: generateTemplateEdges(templateData.steps),
        preview: templateData.preview,
        featured: i < 5, // First 5 in each industry are featured
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        author: templateData.author || 'AgentBridge Team'
      };
      
      templates.push(template);
    }
  });

  return templates;
};

// Generate industry-specific template data
const getIndustryTemplateData = (industry: string, index: number, pattern: string) => {
  const industryTemplates: Record<string, any[]> = {
    'Healthcare & Life Sciences': [
      {
        name: 'Clinical Trial Protocol Optimizer',
        description: 'AI agent that optimizes clinical trial protocols for maximum efficiency and regulatory compliance',
        tags: ['clinical-trials', 'optimization', 'regulatory', 'gcp'],
        steps: [
          { id: 'input', name: 'Protocol Input', description: 'Receive clinical trial protocol draft' },
          { id: 'analyze', name: 'Protocol Analysis', description: 'Analyze protocol for compliance and efficiency' },
          { id: 'optimize', name: 'Optimization Engine', description: 'Generate optimization recommendations' },
          { id: 'validate', name: 'Regulatory Validation', description: 'Validate against FDA/EMA guidelines' },
          { id: 'report', name: 'Protocol Report', description: 'Generate optimized protocol with rationale' },
          { id: 'review', name: 'Expert Review', description: 'Route to clinical expert for final review' },
          { id: 'output', name: 'Final Protocol', description: 'Deliver optimized, compliant protocol' }
        ],
        preview: 'Protocol → Analysis → Optimization → Validation → Expert Review → Output',
        author: 'Clinical Research Team'
      },
      {
        name: 'Drug Discovery Compound Screener',
        description: 'Multi-agent system for automated compound screening and drug discovery pipeline',
        tags: ['drug-discovery', 'screening', 'compounds', 'ai-ml'],
        steps: [
          { id: 'input', name: 'Compound Library', description: 'Load compound database for screening' },
          { id: 'filter', name: 'Initial Filtering', description: 'Apply ADMET and drug-likeness filters' },
          { id: 'predict', name: 'Activity Prediction', description: 'Predict biological activity using ML models' },
          { id: 'dock', name: 'Molecular Docking', description: 'Perform virtual docking simulations' },
          { id: 'score', name: 'Scoring & Ranking', description: 'Score and rank compounds by potential' },
          { id: 'validate', name: 'Literature Validation', description: 'Cross-reference with scientific literature' },
          { id: 'output', name: 'Lead Compounds', description: 'Output prioritized lead compounds' }
        ],
        preview: 'Compounds → Filter → Predict → Dock → Score → Validate → Leads',
        author: 'Drug Discovery Lab'
      },
      {
        name: 'Patient Diagnosis Assistant',
        description: 'AI diagnostic assistant that analyzes symptoms and medical history for differential diagnosis',
        tags: ['diagnosis', 'symptoms', 'medical-history', 'decision-support'],
        steps: [
          { id: 'input', name: 'Patient Data', description: 'Collect symptoms, history, and test results' },
          { id: 'analyze', name: 'Symptom Analysis', description: 'Analyze presenting symptoms and patterns' },
          { id: 'differential', name: 'Differential Diagnosis', description: 'Generate differential diagnosis list' },
          { id: 'evidence', name: 'Evidence Review', description: 'Review medical literature and guidelines' },
          { id: 'rank', name: 'Diagnosis Ranking', description: 'Rank diagnoses by probability and severity' },
          { id: 'recommend', name: 'Test Recommendations', description: 'Suggest additional tests if needed' },
          { id: 'output', name: 'Diagnostic Report', description: 'Generate comprehensive diagnostic report' }
        ],
        preview: 'Symptoms → Analysis → Differential → Evidence → Ranking → Tests → Report',
        author: 'Medical AI Team'
      },
      {
        name: 'Medical Imaging Analyzer',
        description: 'Advanced AI system for automated medical image analysis and anomaly detection',
        tags: ['medical-imaging', 'radiology', 'anomaly-detection', 'ai-vision'],
        steps: [
          { id: 'input', name: 'Image Upload', description: 'Receive medical images (X-ray, CT, MRI)' },
          { id: 'preprocess', name: 'Image Preprocessing', description: 'Enhance and normalize image quality' },
          { id: 'segment', name: 'Image Segmentation', description: 'Identify and segment anatomical structures' },
          { id: 'detect', name: 'Anomaly Detection', description: 'Detect potential abnormalities using AI' },
          { id: 'classify', name: 'Classification', description: 'Classify findings by type and severity' },
          { id: 'compare', name: 'Historical Comparison', description: 'Compare with previous patient images' },
          { id: 'output', name: 'Radiology Report', description: 'Generate detailed radiology report' }
        ],
        preview: 'Images → Preprocess → Segment → Detect → Classify → Compare → Report',
        author: 'Radiology AI Lab'
      },
      {
        name: 'Telemedicine Triage System',
        description: 'Intelligent triage system for telemedicine consultations and patient prioritization',
        tags: ['telemedicine', 'triage', 'prioritization', 'remote-care'],
        steps: [
          { id: 'input', name: 'Patient Intake', description: 'Collect patient information and chief complaint' },
          { id: 'assess', name: 'Symptom Assessment', description: 'Assess symptoms using clinical protocols' },
          { id: 'triage', name: 'Triage Classification', description: 'Classify urgency level (emergency, urgent, routine)' },
          { id: 'route', name: 'Provider Routing', description: 'Route to appropriate healthcare provider' },
          { id: 'schedule', name: 'Appointment Scheduling', description: 'Schedule based on urgency and availability' },
          { id: 'prepare', name: 'Consultation Prep', description: 'Prepare provider with patient summary' },
          { id: 'output', name: 'Triage Decision', description: 'Final triage decision and care plan' }
        ],
        preview: 'Intake → Assess → Triage → Route → Schedule → Prep → Decision',
        author: 'Telemedicine Team'
      }
    ],
    'Banking & Finance': [
      {
        name: 'Fraud Detection Engine',
        description: 'Real-time fraud detection system using advanced ML algorithms and behavioral analysis',
        tags: ['fraud-detection', 'real-time', 'ml', 'behavioral-analysis'],
        steps: [
          { id: 'input', name: 'Transaction Data', description: 'Receive real-time transaction information' },
          { id: 'enrich', name: 'Data Enrichment', description: 'Enrich with customer and merchant data' },
          { id: 'analyze', name: 'Behavioral Analysis', description: 'Analyze transaction patterns and behavior' },
          { id: 'score', name: 'Risk Scoring', description: 'Calculate fraud risk score using ML models' },
          { id: 'rules', name: 'Rules Engine', description: 'Apply business rules and compliance checks' },
          { id: 'decide', name: 'Decision Engine', description: 'Make approve/decline/review decision' },
          { id: 'output', name: 'Fraud Decision', description: 'Output decision with confidence score' }
        ],
        preview: 'Transaction → Enrich → Analyze → Score → Rules → Decide → Output',
        author: 'Risk Management Team'
      },
      {
        name: 'Credit Risk Assessment',
        description: 'Comprehensive credit risk evaluation system for loan applications and portfolio management',
        tags: ['credit-risk', 'lending', 'assessment', 'portfolio-management'],
        steps: [
          { id: 'input', name: 'Application Data', description: 'Collect loan application and financial data' },
          { id: 'verify', name: 'Data Verification', description: 'Verify income, employment, and identity' },
          { id: 'score', name: 'Credit Scoring', description: 'Calculate credit score using multiple models' },
          { id: 'analyze', name: 'Risk Analysis', description: 'Analyze default probability and risk factors' },
          { id: 'policy', name: 'Policy Check', description: 'Apply lending policies and regulations' },
          { id: 'decision', name: 'Credit Decision', description: 'Make lending decision with terms' },
          { id: 'output', name: 'Risk Report', description: 'Generate comprehensive risk assessment' }
        ],
        preview: 'Application → Verify → Score → Analyze → Policy → Decision → Report',
        author: 'Credit Risk Team'
      },
      {
        name: 'Algorithmic Trading Bot',
        description: 'Sophisticated trading algorithm that executes trades based on market analysis and signals',
        tags: ['algorithmic-trading', 'market-analysis', 'execution', 'quantitative'],
        steps: [
          { id: 'input', name: 'Market Data', description: 'Ingest real-time market data and news' },
          { id: 'analyze', name: 'Technical Analysis', description: 'Perform technical and fundamental analysis' },
          { id: 'signal', name: 'Signal Generation', description: 'Generate trading signals from analysis' },
          { id: 'risk', name: 'Risk Management', description: 'Apply risk management and position sizing' },
          { id: 'execute', name: 'Order Execution', description: 'Execute trades through broker APIs' },
          { id: 'monitor', name: 'Position Monitoring', description: 'Monitor positions and market conditions' },
          { id: 'output', name: 'Trading Report', description: 'Generate performance and risk reports' }
        ],
        preview: 'Market Data → Analysis → Signals → Risk Mgmt → Execute → Monitor → Report',
        author: 'Quantitative Trading Team'
      },
      {
        name: 'Robo-Advisor Portfolio Manager',
        description: 'Automated investment advisor that creates and manages personalized portfolios',
        tags: ['robo-advisor', 'portfolio-management', 'investment', 'personalization'],
        steps: [
          { id: 'input', name: 'Client Profile', description: 'Collect investor profile and preferences' },
          { id: 'assess', name: 'Risk Assessment', description: 'Assess risk tolerance and investment goals' },
          { id: 'allocate', name: 'Asset Allocation', description: 'Determine optimal asset allocation strategy' },
          { id: 'select', name: 'Security Selection', description: 'Select specific securities and ETFs' },
          { id: 'optimize', name: 'Portfolio Optimization', description: 'Optimize portfolio for risk-return' },
          { id: 'rebalance', name: 'Rebalancing', description: 'Monitor and rebalance portfolio periodically' },
          { id: 'output', name: 'Investment Plan', description: 'Deliver personalized investment plan' }
        ],
        preview: 'Profile → Risk Assessment → Allocation → Selection → Optimize → Rebalance → Plan',
        author: 'Wealth Management Team'
      },
      {
        name: 'Regulatory Compliance Monitor',
        description: 'Automated compliance monitoring system for financial regulations and reporting',
        tags: ['compliance', 'regulatory', 'monitoring', 'reporting'],
        steps: [
          { id: 'input', name: 'Transaction Monitoring', description: 'Monitor all financial transactions' },
          { id: 'screen', name: 'Compliance Screening', description: 'Screen against regulatory requirements' },
          { id: 'detect', name: 'Violation Detection', description: 'Detect potential compliance violations' },
          { id: 'investigate', name: 'Investigation', description: 'Investigate flagged transactions' },
          { id: 'report', name: 'Regulatory Reporting', description: 'Generate required regulatory reports' },
          { id: 'escalate', name: 'Escalation', description: 'Escalate serious violations to compliance team' },
          { id: 'output', name: 'Compliance Status', description: 'Output compliance status and actions' }
        ],
        preview: 'Monitor → Screen → Detect → Investigate → Report → Escalate → Status',
        author: 'Compliance Team'
      }
    ],
    'Retail & E-commerce': [
      {
        name: 'Personalized Recommendation Engine',
        description: 'Advanced recommendation system using collaborative filtering and deep learning',
        tags: ['recommendations', 'personalization', 'ml', 'customer-experience'],
        steps: [
          { id: 'input', name: 'User Behavior', description: 'Collect user browsing and purchase history' },
          { id: 'profile', name: 'User Profiling', description: 'Build comprehensive user preference profile' },
          { id: 'analyze', name: 'Product Analysis', description: 'Analyze product features and relationships' },
          { id: 'filter', name: 'Collaborative Filtering', description: 'Apply collaborative filtering algorithms' },
          { id: 'rank', name: 'Ranking Algorithm', description: 'Rank recommendations by relevance' },
          { id: 'personalize', name: 'Personalization', description: 'Personalize based on individual preferences' },
          { id: 'output', name: 'Recommendations', description: 'Deliver personalized product recommendations' }
        ],
        preview: 'Behavior → Profile → Analysis → Filter → Rank → Personalize → Recommendations',
        author: 'E-commerce AI Team'
      },
      {
        name: 'Inventory Optimization System',
        description: 'AI-powered inventory management system for demand forecasting and stock optimization',
        tags: ['inventory', 'optimization', 'demand-forecasting', 'supply-chain'],
        steps: [
          { id: 'input', name: 'Sales Data', description: 'Collect historical sales and inventory data' },
          { id: 'forecast', name: 'Demand Forecasting', description: 'Forecast future demand using ML models' },
          { id: 'analyze', name: 'Trend Analysis', description: 'Analyze seasonal trends and patterns' },
          { id: 'optimize', name: 'Stock Optimization', description: 'Optimize stock levels and reorder points' },
          { id: 'plan', name: 'Procurement Planning', description: 'Plan procurement and supplier orders' },
          { id: 'monitor', name: 'Performance Monitoring', description: 'Monitor inventory performance metrics' },
          { id: 'output', name: 'Inventory Plan', description: 'Generate optimized inventory plan' }
        ],
        preview: 'Sales Data → Forecast → Trends → Optimize → Plan → Monitor → Inventory Plan',
        author: 'Supply Chain Team'
      },
      {
        name: 'Dynamic Pricing Engine',
        description: 'Real-time pricing optimization system based on market conditions and competition',
        tags: ['dynamic-pricing', 'optimization', 'competition', 'market-analysis'],
        steps: [
          { id: 'input', name: 'Market Data', description: 'Collect competitor prices and market data' },
          { id: 'analyze', name: 'Demand Analysis', description: 'Analyze demand elasticity and patterns' },
          { id: 'compete', name: 'Competitive Analysis', description: 'Analyze competitor pricing strategies' },
          { id: 'optimize', name: 'Price Optimization', description: 'Optimize prices for maximum profit' },
          { id: 'test', name: 'A/B Testing', description: 'Test pricing strategies with customer segments' },
          { id: 'implement', name: 'Price Implementation', description: 'Implement optimized pricing across channels' },
          { id: 'output', name: 'Pricing Strategy', description: 'Output dynamic pricing recommendations' }
        ],
        preview: 'Market Data → Demand → Competition → Optimize → Test → Implement → Strategy',
        author: 'Pricing Analytics Team'
      },
      {
        name: 'Customer Service Chatbot',
        description: 'Intelligent customer service agent with natural language processing and issue resolution',
        tags: ['customer-service', 'chatbot', 'nlp', 'automation'],
        steps: [
          { id: 'input', name: 'Customer Query', description: 'Receive customer inquiry or complaint' },
          { id: 'understand', name: 'Intent Recognition', description: 'Understand customer intent and sentiment' },
          { id: 'classify', name: 'Issue Classification', description: 'Classify issue type and priority' },
          { id: 'resolve', name: 'Resolution Engine', description: 'Attempt automated issue resolution' },
          { id: 'escalate', name: 'Escalation Logic', description: 'Escalate complex issues to human agents' },
          { id: 'follow', name: 'Follow-up', description: 'Follow up on resolution and satisfaction' },
          { id: 'output', name: 'Service Response', description: 'Provide final response and resolution' }
        ],
        preview: 'Query → Intent → Classify → Resolve → Escalate → Follow-up → Response',
        author: 'Customer Experience Team'
      },
      {
        name: 'Visual Search Engine',
        description: 'AI-powered visual search system for product discovery using image recognition',
        tags: ['visual-search', 'image-recognition', 'product-discovery', 'computer-vision'],
        steps: [
          { id: 'input', name: 'Image Upload', description: 'Receive product image from customer' },
          { id: 'process', name: 'Image Processing', description: 'Process and enhance image quality' },
          { id: 'extract', name: 'Feature Extraction', description: 'Extract visual features and attributes' },
          { id: 'match', name: 'Product Matching', description: 'Match features against product catalog' },
          { id: 'rank', name: 'Similarity Ranking', description: 'Rank products by visual similarity' },
          { id: 'filter', name: 'Availability Filter', description: 'Filter by stock and availability' },
          { id: 'output', name: 'Search Results', description: 'Return visually similar products' }
        ],
        preview: 'Image → Process → Extract → Match → Rank → Filter → Results',
        author: 'Computer Vision Team'
      }
    ],
    'Manufacturing & Industry': [
      {
        name: 'Predictive Maintenance System',
        description: 'IoT-enabled predictive maintenance system for industrial equipment monitoring',
        tags: ['predictive-maintenance', 'iot', 'monitoring', 'equipment'],
        steps: [
          { id: 'input', name: 'Sensor Data', description: 'Collect real-time sensor data from equipment' },
          { id: 'process', name: 'Data Processing', description: 'Process and clean sensor data streams' },
          { id: 'analyze', name: 'Condition Analysis', description: 'Analyze equipment condition and health' },
          { id: 'predict', name: 'Failure Prediction', description: 'Predict potential equipment failures' },
          { id: 'schedule', name: 'Maintenance Scheduling', description: 'Schedule optimal maintenance windows' },
          { id: 'alert', name: 'Alert System', description: 'Alert maintenance teams of issues' },
          { id: 'output', name: 'Maintenance Plan', description: 'Generate predictive maintenance plan' }
        ],
        preview: 'Sensors → Process → Analyze → Predict → Schedule → Alert → Plan',
        author: 'Industrial IoT Team'
      },
      {
        name: 'Quality Control Inspector',
        description: 'Automated quality control system using computer vision and statistical analysis',
        tags: ['quality-control', 'computer-vision', 'inspection', 'automation'],
        steps: [
          { id: 'input', name: 'Product Inspection', description: 'Capture product images and measurements' },
          { id: 'detect', name: 'Defect Detection', description: 'Detect visual and dimensional defects' },
          { id: 'classify', name: 'Defect Classification', description: 'Classify defect types and severity' },
          { id: 'measure', name: 'Quality Metrics', description: 'Calculate quality metrics and scores' },
          { id: 'decide', name: 'Pass/Fail Decision', description: 'Make pass/fail quality decision' },
          { id: 'track', name: 'Quality Tracking', description: 'Track quality trends and patterns' },
          { id: 'output', name: 'Quality Report', description: 'Generate quality inspection report' }
        ],
        preview: 'Inspection → Detect → Classify → Measure → Decide → Track → Report',
        author: 'Quality Assurance Team'
      },
      {
        name: 'Supply Chain Optimizer',
        description: 'End-to-end supply chain optimization system for logistics and inventory management',
        tags: ['supply-chain', 'optimization', 'logistics', 'inventory'],
        steps: [
          { id: 'input', name: 'Supply Data', description: 'Collect supplier, inventory, and demand data' },
          { id: 'forecast', name: 'Demand Forecasting', description: 'Forecast demand across supply network' },
          { id: 'optimize', name: 'Route Optimization', description: 'Optimize transportation routes and costs' },
          { id: 'plan', name: 'Production Planning', description: 'Plan production schedules and capacity' },
          { id: 'coordinate', name: 'Supplier Coordination', description: 'Coordinate with suppliers and vendors' },
          { id: 'monitor', name: 'Performance Monitoring', description: 'Monitor supply chain performance' },
          { id: 'output', name: 'Supply Plan', description: 'Generate optimized supply chain plan' }
        ],
        preview: 'Supply Data → Forecast → Optimize → Plan → Coordinate → Monitor → Supply Plan',
        author: 'Supply Chain Team'
      },
      {
        name: 'Energy Optimization Controller',
        description: 'Smart energy management system for industrial facilities and equipment',
        tags: ['energy-optimization', 'smart-grid', 'efficiency', 'sustainability'],
        steps: [
          { id: 'input', name: 'Energy Data', description: 'Monitor energy consumption and production' },
          { id: 'analyze', name: 'Usage Analysis', description: 'Analyze energy usage patterns and trends' },
          { id: 'optimize', name: 'Load Optimization', description: 'Optimize energy load distribution' },
          { id: 'control', name: 'Equipment Control', description: 'Control equipment for energy efficiency' },
          { id: 'predict', name: 'Demand Prediction', description: 'Predict future energy demand' },
          { id: 'balance', name: 'Grid Balancing', description: 'Balance supply and demand with grid' },
          { id: 'output', name: 'Energy Plan', description: 'Generate energy optimization plan' }
        ],
        preview: 'Energy Data → Analysis → Optimize → Control → Predict → Balance → Plan',
        author: 'Energy Management Team'
      },
      {
        name: 'Production Scheduler',
        description: 'AI-driven production scheduling system for manufacturing optimization',
        tags: ['production-scheduling', 'manufacturing', 'optimization', 'capacity-planning'],
        steps: [
          { id: 'input', name: 'Production Orders', description: 'Receive production orders and requirements' },
          { id: 'capacity', name: 'Capacity Analysis', description: 'Analyze available production capacity' },
          { id: 'sequence', name: 'Job Sequencing', description: 'Sequence jobs for optimal throughput' },
          { id: 'resource', name: 'Resource Allocation', description: 'Allocate machines and workers' },
          { id: 'schedule', name: 'Schedule Generation', description: 'Generate detailed production schedule' },
          { id: 'optimize', name: 'Schedule Optimization', description: 'Optimize for cost and efficiency' },
          { id: 'output', name: 'Production Schedule', description: 'Output optimized production schedule' }
        ],
        preview: 'Orders → Capacity → Sequence → Resources → Schedule → Optimize → Output',
        author: 'Production Planning Team'
      }
    ],
    'Education & Training': [
      {
        name: 'Adaptive Learning System',
        description: 'Personalized learning platform that adapts to individual student needs and progress',
        tags: ['adaptive-learning', 'personalization', 'education', 'ai-tutoring'],
        steps: [
          { id: 'input', name: 'Student Assessment', description: 'Assess student knowledge and learning style' },
          { id: 'profile', name: 'Learning Profile', description: 'Create personalized learning profile' },
          { id: 'adapt', name: 'Content Adaptation', description: 'Adapt content to student needs' },
          { id: 'deliver', name: 'Content Delivery', description: 'Deliver personalized learning content' },
          { id: 'track', name: 'Progress Tracking', description: 'Track learning progress and performance' },
          { id: 'adjust', name: 'Dynamic Adjustment', description: 'Adjust difficulty and pace dynamically' },
          { id: 'output', name: 'Learning Path', description: 'Generate optimized learning path' }
        ],
        preview: 'Assessment → Profile → Adapt → Deliver → Track → Adjust → Path',
        author: 'EdTech Team'
      },
      {
        name: 'Automated Grading System',
        description: 'AI-powered grading system for essays, assignments, and assessments',
        tags: ['automated-grading', 'assessment', 'nlp', 'evaluation'],
        steps: [
          { id: 'input', name: 'Assignment Submission', description: 'Receive student assignment submissions' },
          { id: 'analyze', name: 'Content Analysis', description: 'Analyze content quality and structure' },
          { id: 'evaluate', name: 'Criteria Evaluation', description: 'Evaluate against grading criteria' },
          { id: 'score', name: 'Scoring Algorithm', description: 'Calculate scores using AI models' },
          { id: 'feedback', name: 'Feedback Generation', description: 'Generate detailed feedback comments' },
          { id: 'review', name: 'Quality Review', description: 'Review grades for consistency' },
          { id: 'output', name: 'Graded Assignment', description: 'Return graded assignment with feedback' }
        ],
        preview: 'Submission → Analyze → Evaluate → Score → Feedback → Review → Graded',
        author: 'Assessment Technology Team'
      },
      {
        name: 'Virtual Tutoring Assistant',
        description: 'AI tutor that provides personalized help and explanations to students',
        tags: ['virtual-tutoring', 'ai-tutor', 'personalized-help', 'education'],
        steps: [
          { id: 'input', name: 'Student Question', description: 'Receive student question or problem' },
          { id: 'understand', name: 'Question Understanding', description: 'Understand question context and intent' },
          { id: 'analyze', name: 'Problem Analysis', description: 'Analyze problem type and difficulty' },
          { id: 'explain', name: 'Explanation Generation', description: 'Generate step-by-step explanation' },
          { id: 'adapt', name: 'Adaptive Teaching', description: 'Adapt explanation to student level' },
          { id: 'practice', name: 'Practice Problems', description: 'Provide related practice problems' },
          { id: 'output', name: 'Tutoring Response', description: 'Deliver comprehensive tutoring response' }
        ],
        preview: 'Question → Understand → Analyze → Explain → Adapt → Practice → Response',
        author: 'AI Tutoring Team'
      },
      {
        name: 'Plagiarism Detection Engine',
        description: 'Advanced plagiarism detection system using NLP and similarity analysis',
        tags: ['plagiarism-detection', 'nlp', 'similarity-analysis', 'academic-integrity'],
        steps: [
          { id: 'input', name: 'Document Submission', description: 'Receive document for plagiarism check' },
          { id: 'preprocess', name: 'Text Preprocessing', description: 'Clean and preprocess text content' },
          { id: 'fingerprint', name: 'Text Fingerprinting', description: 'Create unique text fingerprints' },
          { id: 'compare', name: 'Similarity Comparison', description: 'Compare against reference databases' },
          { id: 'detect', name: 'Plagiarism Detection', description: 'Detect potential plagiarism instances' },
          { id: 'analyze', name: 'Source Analysis', description: 'Analyze and identify original sources' },
          { id: 'output', name: 'Plagiarism Report', description: 'Generate detailed plagiarism report' }
        ],
        preview: 'Document → Preprocess → Fingerprint → Compare → Detect → Analyze → Report',
        author: 'Academic Integrity Team'
      },
      {
        name: 'Curriculum Optimization System',
        description: 'AI system for optimizing curriculum design and learning outcomes',
        tags: ['curriculum-optimization', 'learning-outcomes', 'education-planning', 'analytics'],
        steps: [
          { id: 'input', name: 'Learning Objectives', description: 'Define learning objectives and outcomes' },
          { id: 'analyze', name: 'Content Analysis', description: 'Analyze existing curriculum content' },
          { id: 'map', name: 'Competency Mapping', description: 'Map content to required competencies' },
          { id: 'optimize', name: 'Sequence Optimization', description: 'Optimize learning sequence and flow' },
          { id: 'align', name: 'Standards Alignment', description: 'Align with educational standards' },
          { id: 'validate', name: 'Outcome Validation', description: 'Validate against learning outcomes' },
          { id: 'output', name: 'Optimized Curriculum', description: 'Generate optimized curriculum plan' }
        ],
        preview: 'Objectives → Analyze → Map → Optimize → Align → Validate → Curriculum',
        author: 'Curriculum Design Team'
      }
    ],
    'Legal & Compliance': [
      {
        name: 'Contract Analysis Engine',
        description: 'AI-powered contract analysis system for risk assessment and clause extraction',
        tags: ['contract-analysis', 'legal-ai', 'risk-assessment', 'clause-extraction'],
        steps: [
          { id: 'input', name: 'Contract Upload', description: 'Upload contract documents for analysis' },
          { id: 'extract', name: 'Text Extraction', description: 'Extract text from various document formats' },
          { id: 'parse', name: 'Contract Parsing', description: 'Parse contract structure and clauses' },
          { id: 'analyze', name: 'Risk Analysis', description: 'Analyze contract risks and obligations' },
          { id: 'compare', name: 'Template Comparison', description: 'Compare against standard templates' },
          { id: 'flag', name: 'Issue Flagging', description: 'Flag potential issues and concerns' },
          { id: 'output', name: 'Analysis Report', description: 'Generate comprehensive analysis report' }
        ],
        preview: 'Contract → Extract → Parse → Analyze → Compare → Flag → Report',
        author: 'Legal Technology Team'
      },
      {
        name: 'Legal Research Assistant',
        description: 'AI assistant for legal research, case law analysis, and precedent finding',
        tags: ['legal-research', 'case-law', 'precedent-analysis', 'legal-ai'],
        steps: [
          { id: 'input', name: 'Research Query', description: 'Receive legal research question or topic' },
          { id: 'search', name: 'Case Law Search', description: 'Search legal databases and case law' },
          { id: 'analyze', name: 'Precedent Analysis', description: 'Analyze relevant precedents and rulings' },
          { id: 'synthesize', name: 'Information Synthesis', description: 'Synthesize findings and arguments' },
          { id: 'cite', name: 'Citation Generation', description: 'Generate proper legal citations' },
          { id: 'summarize', name: 'Summary Creation', description: 'Create executive summary of findings' },
          { id: 'output', name: 'Research Brief', description: 'Deliver comprehensive research brief' }
        ],
        preview: 'Query → Search → Analyze → Synthesize → Cite → Summarize → Brief',
        author: 'Legal Research Team'
      },
      {
        name: 'Compliance Monitoring System',
        description: 'Automated compliance monitoring and reporting system for regulatory requirements',
        tags: ['compliance-monitoring', 'regulatory', 'reporting', 'automation'],
        steps: [
          { id: 'input', name: 'Regulatory Updates', description: 'Monitor regulatory changes and updates' },
          { id: 'assess', name: 'Impact Assessment', description: 'Assess impact on current operations' },
          { id: 'monitor', name: 'Compliance Monitoring', description: 'Monitor ongoing compliance status' },
          { id: 'detect', name: 'Violation Detection', description: 'Detect potential compliance violations' },
          { id: 'report', name: 'Automated Reporting', description: 'Generate required compliance reports' },
          { id: 'alert', name: 'Alert System', description: 'Alert stakeholders of compliance issues' },
          { id: 'output', name: 'Compliance Dashboard', description: 'Provide compliance status dashboard' }
        ],
        preview: 'Updates → Assess → Monitor → Detect → Report → Alert → Dashboard',
        author: 'Compliance Team'
      },
      {
        name: 'Document Discovery System',
        description: 'AI-powered e-discovery system for legal document review and analysis',
        tags: ['e-discovery', 'document-review', 'legal-analytics', 'litigation-support'],
        steps: [
          { id: 'input', name: 'Document Collection', description: 'Collect documents from various sources' },
          { id: 'process', name: 'Document Processing', description: 'Process and index document content' },
          { id: 'classify', name: 'Document Classification', description: 'Classify documents by relevance and type' },
          { id: 'review', name: 'Automated Review', description: 'Perform automated document review' },
          { id: 'privilege', name: 'Privilege Screening', description: 'Screen for attorney-client privilege' },
          { id: 'produce', name: 'Production Preparation', description: 'Prepare documents for production' },
          { id: 'output', name: 'Discovery Package', description: 'Generate final discovery package' }
        ],
        preview: 'Collection → Process → Classify → Review → Privilege → Produce → Package',
        author: 'E-Discovery Team'
      },
      {
        name: 'Patent Analysis System',
        description: 'AI system for patent analysis, prior art search, and IP intelligence',
        tags: ['patent-analysis', 'prior-art', 'ip-intelligence', 'patent-search'],
        steps: [
          { id: 'input', name: 'Patent Application', description: 'Receive patent application or invention disclosure' },
          { id: 'search', name: 'Prior Art Search', description: 'Search existing patents and publications' },
          { id: 'analyze', name: 'Novelty Analysis', description: 'Analyze novelty and non-obviousness' },
          { id: 'compare', name: 'Claim Comparison', description: 'Compare claims against prior art' },
          { id: 'assess', name: 'Patentability Assessment', description: 'Assess patentability prospects' },
          { id: 'landscape', name: 'Patent Landscape', description: 'Analyze competitive patent landscape' },
          { id: 'output', name: 'Patent Report', description: 'Generate comprehensive patent analysis' }
        ],
        preview: 'Application → Search → Analyze → Compare → Assess → Landscape → Report',
        author: 'IP Analytics Team'
      }
    ],
    'Automotive & Transportation': [
      {
        name: 'Autonomous Vehicle Controller',
        description: 'AI system for autonomous vehicle navigation and decision making',
        tags: ['autonomous-vehicles', 'navigation', 'decision-making', 'safety'],
        steps: [
          { id: 'input', name: 'Sensor Fusion', description: 'Fuse data from cameras, lidar, and radar' },
          { id: 'perceive', name: 'Environment Perception', description: 'Perceive and map surrounding environment' },
          { id: 'localize', name: 'Vehicle Localization', description: 'Determine precise vehicle location' },
          { id: 'plan', name: 'Path Planning', description: 'Plan optimal route and trajectory' },
          { id: 'decide', name: 'Decision Making', description: 'Make driving decisions and maneuvers' },
          { id: 'control', name: 'Vehicle Control', description: 'Control steering, acceleration, and braking' },
          { id: 'output', name: 'Driving Commands', description: 'Execute safe driving commands' }
        ],
        preview: 'Sensors → Perceive → Localize → Plan → Decide → Control → Commands',
        author: 'Autonomous Driving Team'
      },
      {
        name: 'Fleet Maintenance Optimizer',
        description: 'Predictive maintenance system for vehicle fleet management',
        tags: ['fleet-management', 'predictive-maintenance', 'vehicle-health', 'optimization'],
        steps: [
          { id: 'input', name: 'Vehicle Telemetry', description: 'Collect real-time vehicle telemetry data' },
          { id: 'monitor', name: 'Health Monitoring', description: 'Monitor vehicle health and performance' },
          { id: 'predict', name: 'Failure Prediction', description: 'Predict potential component failures' },
          { id: 'schedule', name: 'Maintenance Scheduling', description: 'Schedule optimal maintenance windows' },
          { id: 'optimize', name: 'Route Optimization', description: 'Optimize maintenance facility routes' },
          { id: 'track', name: 'Cost Tracking', description: 'Track maintenance costs and ROI' },
          { id: 'output', name: 'Maintenance Plan', description: 'Generate fleet maintenance plan' }
        ],
        preview: 'Telemetry → Monitor → Predict → Schedule → Optimize → Track → Plan',
        author: 'Fleet Operations Team'
      },
      {
        name: 'Traffic Optimization System',
        description: 'Smart traffic management system for urban traffic optimization',
        tags: ['traffic-optimization', 'smart-city', 'traffic-management', 'urban-planning'],
        steps: [
          { id: 'input', name: 'Traffic Data', description: 'Collect real-time traffic flow data' },
          { id: 'analyze', name: 'Pattern Analysis', description: 'Analyze traffic patterns and congestion' },
          { id: 'predict', name: 'Flow Prediction', description: 'Predict traffic flow and bottlenecks' },
          { id: 'optimize', name: 'Signal Optimization', description: 'Optimize traffic signal timing' },
          { id: 'route', name: 'Route Guidance', description: 'Provide optimal route recommendations' },
          { id: 'coordinate', name: 'System Coordination', description: 'Coordinate with connected vehicles' },
          { id: 'output', name: 'Traffic Control', description: 'Execute traffic control strategies' }
        ],
        preview: 'Traffic Data → Analyze → Predict → Optimize → Route → Coordinate → Control',
        author: 'Smart City Team'
      },
      {
        name: 'Ride Sharing Optimizer',
        description: 'AI system for ride sharing optimization and dynamic pricing',
        tags: ['ride-sharing', 'optimization', 'dynamic-pricing', 'matching'],
        steps: [
          { id: 'input', name: 'Ride Requests', description: 'Receive ride requests from passengers' },
          { id: 'match', name: 'Driver Matching', description: 'Match passengers with available drivers' },
          { id: 'optimize', name: 'Route Optimization', description: 'Optimize pickup and dropoff routes' },
          { id: 'price', name: 'Dynamic Pricing', description: 'Calculate dynamic pricing based on demand' },
          { id: 'dispatch', name: 'Driver Dispatch', description: 'Dispatch drivers to pickup locations' },
          { id: 'track', name: 'Trip Tracking', description: 'Track trip progress and performance' },
          { id: 'output', name: 'Service Delivery', description: 'Complete ride sharing service' }
        ],
        preview: 'Requests → Match → Optimize → Price → Dispatch → Track → Service',
        author: 'Mobility Platform Team'
      },
      {
        name: 'Insurance Claims Processor',
        description: 'Automated vehicle insurance claims processing and fraud detection',
        tags: ['insurance-claims', 'fraud-detection', 'automation', 'damage-assessment'],
        steps: [
          { id: 'input', name: 'Claim Submission', description: 'Receive insurance claim with photos and details' },
          { id: 'assess', name: 'Damage Assessment', description: 'Assess vehicle damage using AI vision' },
          { id: 'estimate', name: 'Cost Estimation', description: 'Estimate repair costs and coverage' },
          { id: 'verify', name: 'Fraud Verification', description: 'Verify claim authenticity and detect fraud' },
          { id: 'approve', name: 'Claim Approval', description: 'Make claim approval or denial decision' },
          { id: 'process', name: 'Payment Processing', description: 'Process approved claim payments' },
          { id: 'output', name: 'Claim Resolution', description: 'Complete claim resolution process' }
        ],
        preview: 'Claim → Assess → Estimate → Verify → Approve → Process → Resolution',
        author: 'Insurance Technology Team'
      }
    ],
    'Energy & Utilities': [
      {
        name: 'Smart Grid Management System',
        description: 'AI-powered smart grid management for energy distribution optimization',
        tags: ['smart-grid', 'energy-distribution', 'optimization', 'grid-management'],
        steps: [
          { id: 'input', name: 'Grid Monitoring', description: 'Monitor grid status and energy flows' },
          { id: 'forecast', name: 'Demand Forecasting', description: 'Forecast energy demand patterns' },
          { id: 'balance', name: 'Load Balancing', description: 'Balance supply and demand across grid' },
          { id: 'optimize', name: 'Distribution Optimization', description: 'Optimize energy distribution paths' },
          { id: 'integrate', name: 'Renewable Integration', description: 'Integrate renewable energy sources' },
          { id: 'respond', name: 'Demand Response', description: 'Implement demand response programs' },
          { id: 'output', name: 'Grid Control', description: 'Execute grid control commands' }
        ],
        preview: 'Monitor → Forecast → Balance → Optimize → Integrate → Respond → Control',
        author: 'Smart Grid Team'
      },
      {
        name: 'Renewable Energy Forecaster',
        description: 'AI system for renewable energy generation forecasting and optimization',
        tags: ['renewable-energy', 'forecasting', 'solar', 'wind', 'optimization'],
        steps: [
          { id: 'input', name: 'Weather Data', description: 'Collect weather and environmental data' },
          { id: 'analyze', name: 'Pattern Analysis', description: 'Analyze weather patterns and trends' },
          { id: 'predict', name: 'Generation Prediction', description: 'Predict renewable energy generation' },
          { id: 'optimize', name: 'Output Optimization', description: 'Optimize energy output scheduling' },
          { id: 'integrate', name: 'Grid Integration', description: 'Plan grid integration strategies' },
          { id: 'store', name: 'Storage Management', description: 'Manage energy storage systems' },
          { id: 'output', name: 'Energy Plan', description: 'Generate renewable energy plan' }
        ],
        preview: 'Weather → Analyze → Predict → Optimize → Integrate → Store → Plan',
        author: 'Renewable Energy Team'
      },
      {
        name: 'Building Energy Optimizer',
        description: 'Smart building energy management system for efficiency optimization',
        tags: ['building-automation', 'energy-efficiency', 'hvac', 'smart-building'],
        steps: [
          { id: 'input', name: 'Building Sensors', description: 'Monitor building systems and occupancy' },
          { id: 'analyze', name: 'Usage Analysis', description: 'Analyze energy usage patterns' },
          { id: 'control', name: 'HVAC Control', description: 'Control heating, cooling, and ventilation' },
          { id: 'optimize', name: 'Efficiency Optimization', description: 'Optimize for energy efficiency' },
          { id: 'schedule', name: 'System Scheduling', description: 'Schedule equipment operation' },
          { id: 'adapt', name: 'Adaptive Control', description: 'Adapt to occupancy and weather' },
          { id: 'output', name: 'Energy Savings', description: 'Achieve optimal energy savings' }
        ],
        preview: 'Sensors → Analyze → Control → Optimize → Schedule → Adapt → Savings',
        author: 'Building Automation Team'
      },
      {
        name: 'Carbon Footprint Tracker',
        description: 'AI system for carbon footprint tracking and sustainability reporting',
        tags: ['carbon-tracking', 'sustainability', 'emissions', 'reporting'],
        steps: [
          { id: 'input', name: 'Activity Data', description: 'Collect energy and activity data' },
          { id: 'calculate', name: 'Emissions Calculation', description: 'Calculate carbon emissions' },
          { id: 'track', name: 'Footprint Tracking', description: 'Track carbon footprint over time' },
          { id: 'analyze', name: 'Impact Analysis', description: 'Analyze environmental impact' },
          { id: 'recommend', name: 'Reduction Recommendations', description: 'Recommend emission reduction strategies' },
          { id: 'report', name: 'Sustainability Reporting', description: 'Generate sustainability reports' },
          { id: 'output', name: 'Carbon Report', description: 'Deliver comprehensive carbon report' }
        ],
        preview: 'Activity → Calculate → Track → Analyze → Recommend → Report → Output',
        author: 'Sustainability Team'
      },
      {
        name: 'Outage Prediction System',
        description: 'Predictive system for power outage prevention and grid reliability',
        tags: ['outage-prediction', 'grid-reliability', 'predictive-maintenance', 'power-systems'],
        steps: [
          { id: 'input', name: 'Grid Monitoring', description: 'Monitor grid infrastructure and conditions' },
          { id: 'analyze', name: 'Risk Analysis', description: 'Analyze outage risk factors' },
          { id: 'predict', name: 'Outage Prediction', description: 'Predict potential outage events' },
          { id: 'prioritize', name: 'Risk Prioritization', description: 'Prioritize high-risk areas' },
          { id: 'prevent', name: 'Prevention Actions', description: 'Take preventive maintenance actions' },
          { id: 'respond', name: 'Emergency Response', description: 'Coordinate emergency response' },
          { id: 'output', name: 'Reliability Report', description: 'Generate grid reliability report' }
        ],
        preview: 'Monitor → Analyze → Predict → Prioritize → Prevent → Respond → Report',
        author: 'Grid Reliability Team'
      }
    ],
    'Agriculture & Food': [
      {
        name: 'Precision Agriculture System',
        description: 'AI-powered precision agriculture system for crop optimization and yield prediction',
        tags: ['precision-agriculture', 'crop-optimization', 'yield-prediction', 'farming'],
        steps: [
          { id: 'input', name: 'Field Monitoring', description: 'Monitor soil, weather, and crop conditions' },
          { id: 'analyze', name: 'Crop Analysis', description: 'Analyze crop health and growth patterns' },
          { id: 'predict', name: 'Yield Prediction', description: 'Predict crop yields and harvest timing' },
          { id: 'optimize', name: 'Resource Optimization', description: 'Optimize water, fertilizer, and pesticide use' },
          { id: 'plan', name: 'Treatment Planning', description: 'Plan targeted treatments and interventions' },
          { id: 'execute', name: 'Automated Execution', description: 'Execute precision farming actions' },
          { id: 'output', name: 'Farm Management', description: 'Deliver optimized farm management plan' }
        ],
        preview: 'Monitor → Analyze → Predict → Optimize → Plan → Execute → Management',
        author: 'AgTech Team'
      },
      {
        name: 'Livestock Monitoring System',
        description: 'IoT-enabled livestock health monitoring and management system',
        tags: ['livestock-monitoring', 'animal-health', 'iot', 'farm-management'],
        steps: [
          { id: 'input', name: 'Animal Sensors', description: 'Monitor animal health and behavior' },
          { id: 'track', name: 'Health Tracking', description: 'Track vital signs and activity levels' },
          { id: 'detect', name: 'Disease Detection', description: 'Detect early signs of illness' },
          { id: 'alert', name: 'Health Alerts', description: 'Alert farmers to health issues' },
          { id: 'manage', name: 'Herd Management', description: 'Manage breeding and feeding schedules' },
          { id: 'optimize', name: 'Production Optimization', description: 'Optimize milk/meat production' },
          { id: 'output', name: 'Livestock Report', description: 'Generate livestock management report' }
        ],
        preview: 'Sensors → Track → Detect → Alert → Manage → Optimize → Report',
        author: 'Livestock Technology Team'
      },
      {
        name: 'Food Safety Inspector',
        description: 'AI system for food safety inspection and quality assurance',
        tags: ['food-safety', 'quality-assurance', 'inspection', 'compliance'],
        steps: [
          { id: 'input', name: 'Product Inspection', description: 'Inspect food products and facilities' },
          { id: 'test', name: 'Safety Testing', description: 'Test for contaminants and pathogens' },
          { id: 'analyze', name: 'Risk Analysis', description: 'Analyze food safety risks' },
          { id: 'trace', name: 'Traceability Check', description: 'Verify product traceability' },
          { id: 'comply', name: 'Compliance Verification', description: 'Verify regulatory compliance' },
          { id: 'certify', name: 'Quality Certification', description: 'Issue quality certifications' },
          { id: 'output', name: 'Safety Report', description: 'Generate food safety report' }
        ],
        preview: 'Inspect → Test → Analyze → Trace → Comply → Certify → Report',
        author: 'Food Safety Team'
      },
      {
        name: 'Supply Chain Tracer',
        description: 'Blockchain-enabled food supply chain traceability system',
        tags: ['supply-chain', 'traceability', 'blockchain', 'food-safety'],
        steps: [
          { id: 'input', name: 'Product Origin', description: 'Record product origin and source' },
          { id: 'track', name: 'Chain Tracking', description: 'Track product through supply chain' },
          { id: 'verify', name: 'Authenticity Verification', description: 'Verify product authenticity' },
          { id: 'record', name: 'Blockchain Recording', description: 'Record transactions on blockchain' },
          { id: 'trace', name: 'End-to-End Tracing', description: 'Enable end-to-end traceability' },
          { id: 'alert', name: 'Contamination Alerts', description: 'Alert on contamination events' },
          { id: 'output', name: 'Traceability Report', description: 'Generate traceability report' }
        ],
        preview: 'Origin → Track → Verify → Record → Trace → Alert → Report',
        author: 'Supply Chain Team'
      },
      {
        name: 'Crop Disease Detector',
        description: 'AI-powered crop disease detection and treatment recommendation system',
        tags: ['crop-disease', 'plant-pathology', 'computer-vision', 'agriculture'],
        steps: [
          { id: 'input', name: 'Plant Images', description: 'Capture images of crops and plants' },
          { id: 'process', name: 'Image Processing', description: 'Process and enhance plant images' },
          { id: 'detect', name: 'Disease Detection', description: 'Detect diseases and pests' },
          { id: 'identify', name: 'Pathogen Identification', description: 'Identify specific pathogens' },
          { id: 'assess', name: 'Severity Assessment', description: 'Assess disease severity and spread' },
          { id: 'recommend', name: 'Treatment Recommendation', description: 'Recommend treatment options' },
          { id: 'output', name: 'Disease Report', description: 'Generate disease management report' }
        ],
        preview: 'Images → Process → Detect → Identify → Assess → Recommend → Report',
        author: 'Plant Pathology Team'
      }
    ],
    'Media & Entertainment': [
      {
        name: 'Content Recommendation Engine',
        description: 'AI-powered content recommendation system for streaming platforms',
        tags: ['content-recommendation', 'streaming', 'personalization', 'entertainment'],
        steps: [
          { id: 'input', name: 'User Behavior', description: 'Collect user viewing history and preferences' },
          { id: 'profile', name: 'User Profiling', description: 'Build comprehensive user profiles' },
          { id: 'analyze', name: 'Content Analysis', description: 'Analyze content features and metadata' },
          { id: 'match', name: 'Preference Matching', description: 'Match content to user preferences' },
          { id: 'rank', name: 'Recommendation Ranking', description: 'Rank recommendations by relevance' },
          { id: 'personalize', name: 'Personalization', description: 'Personalize recommendations for each user' },
          { id: 'output', name: 'Content Suggestions', description: 'Deliver personalized content suggestions' }
        ],
        preview: 'Behavior → Profile → Analyze → Match → Rank → Personalize → Suggestions',
        author: 'Content AI Team'
      },
      {
        name: 'Automated Video Editor',
        description: 'AI system for automated video editing and content creation',
        tags: ['video-editing', 'automation', 'content-creation', 'ai-editing'],
        steps: [
          { id: 'input', name: 'Raw Footage', description: 'Import raw video footage and assets' },
          { id: 'analyze', name: 'Content Analysis', description: 'Analyze video content and scenes' },
          { id: 'segment', name: 'Scene Segmentation', description: 'Segment video into meaningful scenes' },
          { id: 'select', name: 'Shot Selection', description: 'Select best shots and moments' },
          { id: 'edit', name: 'Automated Editing', description: 'Apply cuts, transitions, and effects' },
          { id: 'enhance', name: 'Quality Enhancement', description: 'Enhance audio and video quality' },
          { id: 'output', name: 'Final Video', description: 'Generate polished final video' }
        ],
        preview: 'Footage → Analyze → Segment → Select → Edit → Enhance → Video',
        author: 'Video Production Team'
      },
      {
        name: 'Content Moderation System',
        description: 'AI-powered content moderation for social media and user-generated content',
        tags: ['content-moderation', 'safety', 'user-generated-content', 'ai-moderation'],
        steps: [
          { id: 'input', name: 'Content Submission', description: 'Receive user-generated content' },
          { id: 'scan', name: 'Content Scanning', description: 'Scan for inappropriate content' },
          { id: 'classify', name: 'Content Classification', description: 'Classify content by type and risk' },
          { id: 'detect', name: 'Violation Detection', description: 'Detect policy violations' },
          { id: 'review', name: 'Human Review', description: 'Route complex cases to human reviewers' },
          { id: 'action', name: 'Moderation Action', description: 'Take appropriate moderation action' },
          { id: 'output', name: 'Moderation Decision', description: 'Deliver final moderation decision' }
        ],
        preview: 'Content → Scan → Classify → Detect → Review → Action → Decision',
        author: 'Content Safety Team'
      },
      {
        name: 'Music Composition AI',
        description: 'AI system for automated music composition and arrangement',
        tags: ['music-composition', 'ai-music', 'composition', 'creative-ai'],
        steps: [
          { id: 'input', name: 'Musical Parameters', description: 'Define genre, mood, and style parameters' },
          { id: 'generate', name: 'Melody Generation', description: 'Generate melodic themes and motifs' },
          { id: 'harmonize', name: 'Harmony Creation', description: 'Create harmonic progressions' },
          { id: 'arrange', name: 'Musical Arrangement', description: 'Arrange for different instruments' },
          { id: 'structure', name: 'Song Structure', description: 'Create song structure and form' },
          { id: 'produce', name: 'Audio Production', description: 'Produce final audio mix' },
          { id: 'output', name: 'Composed Music', description: 'Deliver complete musical composition' }
        ],
        preview: 'Parameters → Generate → Harmonize → Arrange → Structure → Produce → Music',
        author: 'Music AI Team'
      },
      {
        name: 'News Aggregation System',
        description: 'AI-powered news aggregation and personalization system',
        tags: ['news-aggregation', 'personalization', 'content-curation', 'media'],
        steps: [
          { id: 'input', name: 'News Sources', description: 'Collect news from multiple sources' },
          { id: 'extract', name: 'Content Extraction', description: 'Extract and clean news content' },
          { id: 'classify', name: 'Topic Classification', description: 'Classify news by topic and category' },
          { id: 'dedupe', name: 'Deduplication', description: 'Remove duplicate and similar stories' },
          { id: 'rank', name: 'Relevance Ranking', description: 'Rank stories by relevance and importance' },
          { id: 'personalize', name: 'Personalization', description: 'Personalize news feed for users' },
          { id: 'output', name: 'News Feed', description: 'Deliver personalized news feed' }
        ],
        preview: 'Sources → Extract → Classify → Dedupe → Rank → Personalize → Feed',
        author: 'News Technology Team'
      }
    ]
  };

  const industryData = industryTemplates[industry] || [];
  const templateIndex = index % industryData.length;
  return industryData[templateIndex] || {
    name: `${industry} ${pattern} Agent ${index + 1}`,
    description: `Advanced ${pattern.toLowerCase()} agent for ${industry.toLowerCase()} automation`,
    tags: [industry.toLowerCase().replace(/\s+/g, '-'), pattern.toLowerCase(), 'automation'],
    steps: [
      { id: 'input', name: 'Data Input', description: 'Receive input data' },
      { id: 'process', name: 'Data Processing', description: 'Process and analyze data' },
      { id: 'analyze', name: 'Analysis', description: 'Perform detailed analysis' },
      { id: 'decide', name: 'Decision Making', description: 'Make intelligent decisions' },
      { id: 'execute', name: 'Execution', description: 'Execute recommended actions' },
      { id: 'output', name: 'Results Output', description: 'Deliver final results' }
    ],
    preview: 'Input → Process → Analyze → Decide → Execute → Output',
    author: 'AgentBridge Team'
  };
};

// Generate nodes from workflow steps
const generateTemplateNodes = (steps: any[], pattern: string): Node[] => {
  const spacing = 200;
  const baseY = 100;
  
  return steps.map((step, index) => ({
    id: step.id,
    type: 'agentbridge',
    data: {
      label: step.name,
      description: step.description,
      nodeType: getNodeTypeFromStep(step, index, steps.length),
      category: getCategoryFromPattern(pattern),
      executionMode: 'autonomous'
    },
    position: { x: 50 + index * spacing, y: baseY }
  }));
};

// Generate edges from workflow steps
const generateTemplateEdges = (steps: any[]): Edge[] => {
  const edges: Edge[] = [];
  
  for (let i = 0; i < steps.length - 1; i++) {
    edges.push({
      id: `edge-${i}`,
      source: steps[i].id,
      target: steps[i + 1].id,
      type: 'agentbridge',
      data: { label: 'flow' }
    });
  }
  
  return edges;
};

// Helper functions
const getNodeTypeFromStep = (step: any, index: number, totalSteps: number) => {
  if (index === 0) return 'input';
  if (index === totalSteps - 1) return 'output';
  
  const stepName = step.name.toLowerCase();
  if (stepName.includes('analysis') || stepName.includes('analyze')) return 'llm';
  if (stepName.includes('api') || stepName.includes('tool') || stepName.includes('execute')) return 'mcp';
  if (stepName.includes('decision') || stepName.includes('condition')) return 'condition';
  if (stepName.includes('database') || stepName.includes('storage')) return 'database';
  if (stepName.includes('agent') || stepName.includes('team')) return 'a2a';
  
  return 'llm'; // Default to LLM node
};

const getCategoryFromPattern = (pattern: string) => {
  switch (pattern) {
    case 'ReAct': return 'ai-models';
    case 'RAG': return 'ai-models';
    case 'Multi-Agent': return 'a2a-agents';
    case 'CodeAct': return 'ai-models';
    case 'Tool-Use': return 'mcp-tools';
    case 'Reflection': return 'ai-models';
    default: return 'ai-models';
  }
};

interface TemplatesLibraryProps {
  onSelectTemplate: (workflow: any) => void;
  onBack: () => void;
}

const TemplatesLibrary: React.FC<TemplatesLibraryProps> = ({ onSelectTemplate, onBack }) => {
  const [templates] = useState(() => generateWorkflowTemplates());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'created'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = !searchTerm || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesIndustry = !selectedIndustry || template.industry === selectedIndustry;
      const matchesPattern = !selectedPattern || template.pattern === selectedPattern;
      const matchesComplexity = !selectedComplexity || template.complexity === selectedComplexity;
      
      return matchesSearch && matchesIndustry && matchesPattern && matchesComplexity;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchTerm, selectedIndustry, selectedPattern, selectedComplexity, sortBy]);

  const handleTemplateSelect = useCallback((template: any) => {
    const workflow = {
      name: template.name,
      description: template.description,
      pattern: template.pattern,
      industry: template.industry,
      executionMode: 'autonomous',
      nodes: template.nodes,
      edges: template.edges,
      tags: template.tags,
      steps: template.steps
    };
    
    onSelectTemplate(workflow);
  }, [onSelectTemplate]);

  const handlePreview = useCallback((template: any) => {
    setPreviewTemplate(template);
  }, []);

  const renderTemplateCard = (template: any, index: number) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-200 dark:border-card-border p-6 hover:shadow-lg transition-all duration-300 relative"
    >
      {/* Featured Badge */}
      {template.featured && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <Crown className="w-3 h-3" />
          <span>Featured</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-text-primary text-lg line-clamp-1">
              {template.name}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-text-muted text-sm mb-3 line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>

      {/* Pattern & Industry */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
          {template.pattern}
        </span>
        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
          {template.complexity}
        </span>
        <span className="text-xs text-gray-500 dark:text-text-muted">
          {template.industry}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {template.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
          <span
            key={tagIndex}
            className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {template.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-500 dark:text-text-muted text-xs rounded-full">
            +{template.tags.length - 3}
          </span>
        )}
      </div>

      {/* Workflow Steps Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-text-primary mb-2">
          Workflow Steps ({template.steps.length})
        </h4>
        <div className="text-xs text-gray-600 dark:text-text-muted font-mono bg-gray-50 dark:bg-secondary rounded-lg p-2">
          {template.preview}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
              {template.rating}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-text-muted">Rating</p>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-1 text-blue-500 mb-1">
            <Download className="w-3 h-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
              {template.downloads > 1000 ? `${Math.floor(template.downloads / 1000)}k` : template.downloads}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-text-muted">Downloads</p>
        </div>
        <div>
          <div className="flex items-center justify-center space-x-1 text-green-500 mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-sm font-medium text-gray-900 dark:text-text-primary">
              {template.executionTime}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-text-muted">Runtime</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePreview(template)}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleTemplateSelect(template)}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Import</span>
        </motion.button>
      </div>

      {/* Author */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-card-border">
        <p className="text-xs text-gray-500 dark:text-text-muted">
          by {template.author}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-orange-900 dark:to-red-900">
      {/* Header */}
      <div className="bg-white dark:bg-card-bg border-b border-gray-200 dark:border-card-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Workshop</span>
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                📚 Templates Library
              </h1>
              <p className="text-gray-600 dark:text-text-muted">
                {filteredTemplates.length} production-ready agentic workflows
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-secondary rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-card-bg text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-text-muted hover:text-gray-900 dark:hover:text-text-primary'
                }`}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
            >
              <option value="rating">Sort by Rating</option>
              <option value="downloads">Sort by Downloads</option>
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created</option>
            </select>

            {/* Filters Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-secondary'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-secondary text-gray-900 dark:text-text-primary"
            />
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-secondary rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                    Pattern
                  </label>
                  <select
                    value={selectedPattern}
                    onChange={(e) => setSelectedPattern(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Patterns</option>
                    {agenticPatterns.map(pattern => (
                      <option key={pattern} value={pattern}>{pattern}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-text-muted mb-2">
                    Complexity
                  </label>
                  <select
                    value={selectedComplexity}
                    onChange={(e) => setSelectedComplexity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
                  >
                    <option value="">All Levels</option>
                    {complexityLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedIndustry('');
                      setSelectedPattern('');
                      setSelectedComplexity('');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                  >
                    Clear Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Templates Grid */}
      <div className="p-6">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-400 dark:text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-2">
              No templates found
            </h3>
            <p className="text-gray-600 dark:text-text-muted">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredTemplates.map((template, index) => renderTemplateCard(template, index))}
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-card-bg rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">
                    {previewTemplate.name}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPreviewTemplate(null)}
                    className="p-2 text-gray-400 dark:text-text-muted hover:text-gray-600 dark:hover:text-text-primary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Template Info */}
                  <div>
                    <p className="text-gray-600 dark:text-text-muted mb-6">
                      {previewTemplate.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-2">
                          Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-text-muted">Industry:</span>
                            <p className="font-medium text-gray-900 dark:text-text-primary">
                              {previewTemplate.industry}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-text-muted">Pattern:</span>
                            <p className="font-medium text-gray-900 dark:text-text-primary">
                              {previewTemplate.pattern}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-text-muted">Complexity:</span>
                            <p className="font-medium text-gray-900 dark:text-text-primary">
                              {previewTemplate.complexity}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-text-muted">Runtime:</span>
                            <p className="font-medium text-gray-900 dark:text-text-primary">
                              {previewTemplate.executionTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-2">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {previewTemplate.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-text-muted text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-text-primary mb-4">
                      Workflow Steps ({previewTemplate.steps.length})
                    </h3>
                    <div className="space-y-3">
                      {previewTemplate.steps.map((step: any, index: number) => (
                        <div
                          key={step.id}
                          className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-text-primary text-sm">
                              {step.name}
                            </h4>
                            <p className="text-gray-600 dark:text-text-muted text-xs mt-1">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 dark:text-text-primary mb-2">
                        Flow Preview
                      </h4>
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-3">
                        <code className="text-green-400 text-xs font-mono">
                          {previewTemplate.preview}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-card-border">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPreviewTemplate(null)}
                    className="px-6 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors"
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleTemplateSelect(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Import Template</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplatesLibrary;