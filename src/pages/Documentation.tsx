import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ChevronRight, ChevronDown, ThumbsUp, ThumbsDown, ArrowLeft, ArrowRight,
  Store, Wrench, Brain, Zap, Monitor, Rocket, BookOpen, Building2, Users, Shield,
  Code, Database, Globe, Settings, Play, Eye, Download, Upload, GitBranch,
  MessageSquare, FileText, Terminal, Cloud, Key, Lock, Activity, BarChart3,
  CheckCircle, AlertTriangle, Info, Star, Heart, Bookmark, ExternalLink
} from 'lucide-react';

const categories = [
  {
    id: 'overview',
    title: '🚀 Platform Overview',
    icon: Rocket,
    articles: [
      { 
        id: '1', 
        title: 'What is AgentBridge?', 
        content: `AgentBridge is Sonata Software's comprehensive enterprise AI platform for building, deploying, and managing agentic workflows at scale. It provides a complete framework for Agent Network Orchestration & Optimization across your organization.`,
        sections: [
          {
            title: 'Core Value Proposition',
            content: `• **Enterprise-Grade**: Built for Fortune 500 companies with security, compliance, and scalability
• **Multi-Pattern Support**: ReAct, RAG, Multi-Agent, CodeAct, Tool-Use, Self-Reflection
• **No-Code/Low-Code**: Visual workflow builder with drag-and-drop interface
• **Production-Ready**: Deploy to any cloud provider with monitoring and analytics
• **Marketplace Ecosystem**: Share and monetize agentic workflows across teams`
          },
          {
            title: 'Key Differentiators',
            content: `• **30-Step Approval Process**: Enterprise governance with Builder → Manager → Admin workflows
• **LangGraph Compatibility**: Export workflows to LangGraph Studio seamlessly
• **MCP Protocol Support**: Model Context Protocol for advanced tool integration
• **Agent-to-Agent Communication**: A2A protocols for collaborative multi-agent systems
• **HITL Integration**: Human-in-the-Loop checkpoints for critical decisions`
          }
        ]
      },
      { 
        id: '2', 
        title: 'Architecture & Design', 
        content: `AgentBridge follows a layered architecture designed for enterprise scalability and maintainability.`,
        sections: [
          {
            title: 'Platform Layers',
            content: `**Layer 1: Agent Marketplace** - Discover, deploy, and manage 1000+ production-ready workflows
**Layer 2: Agent Builder** - Visual workflow creation with 4 entry points
**Layer 3: Core Agent Logic** - Advanced reasoning patterns and model orchestration  
**Layer 4: Integrations** - MCP protocols, A2A communication, and enterprise systems
**Layer 5: Observability & ROI** - Real-time monitoring, analytics, and cost optimization
**Layer 6: Launchpad** - Multi-cloud deployment with auto-scaling and management`
          },
          {
            title: 'Technology Stack',
            content: `• **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
• **Workflow Engine**: ReactFlow, LangGraph compatibility
• **Database**: Supabase with Row Level Security (RLS)
• **Authentication**: Supabase Auth with enterprise SSO
• **Deployment**: Multi-cloud support (AWS, Azure, GCP, NVIDIA, OCI)
• **Monitoring**: Langfuse integration for observability`
          }
        ]
      },
      { 
        id: '3', 
        title: 'Getting Started Guide', 
        content: `Follow this comprehensive guide to get started with AgentBridge in your organization.`,
        sections: [
          {
            title: 'Quick Start (5 Minutes)',
            content: `1. **Login**: Use admin@sonata.com with your assigned password
2. **Explore Marketplace**: Browse 1000+ pre-built workflows by industry
3. **Deploy Sample**: Click "Deploy" on any workflow to see it in action
4. **Monitor**: View real-time metrics in the Observability layer
5. **Customize**: Use Agent Builder to modify workflows for your needs`
          },
          {
            title: 'Enterprise Setup',
            content: `1. **User Management**: Set up teams with proper role-based access
2. **Approval Workflows**: Configure 30-step approval process for governance
3. **Integration Setup**: Connect to your enterprise systems via MCP protocols
4. **Cloud Configuration**: Set up multi-cloud deployment targets
5. **Monitoring Setup**: Configure Langfuse for production observability`
          }
        ]
      }
    ]
  },
  {
    id: 'marketplace',
    title: '🏪 Agent Marketplace',
    icon: Store,
    articles: [
      { 
        id: '4', 
        title: 'Marketplace Overview', 
        content: `The Agent Marketplace is your central hub for discovering, deploying, and managing agentic workflows across your organization.`,
        sections: [
          {
            title: 'Key Features',
            content: `• **1000+ Production Workflows**: Curated by industry experts
• **Industry Categories**: Healthcare, Finance, Retail, Manufacturing, and more
• **Advanced Search**: Filter by pattern, complexity, tags, and ratings
• **Approval System**: 30-step governance process for enterprise compliance
• **Analytics Dashboard**: Track usage, performance, and ROI metrics
• **Monetization**: Internal marketplace with pricing models`
          },
          {
            title: 'Workflow Categories',
            content: `**Healthcare & Life Sciences**: Clinical trials, drug discovery, patient diagnosis
**Finance & Banking**: Fraud detection, risk assessment, algorithmic trading
**Retail & E-commerce**: Recommendations, inventory, dynamic pricing
**Manufacturing**: Predictive maintenance, quality control, supply chain
**Legal & Compliance**: Contract analysis, regulatory monitoring
**And 5 more industries with 100+ workflows each`
          }
        ]
      },
      { 
        id: '5', 
        title: 'Publishing Workflows', 
        content: `Learn how to publish your custom workflows to the marketplace for team collaboration.`,
        sections: [
          {
            title: 'Publishing Process',
            content: `1. **Create Workflow**: Build in Agent Builder with proper documentation
2. **Add Metadata**: Tags, description, industry classification
3. **Set Monetization**: Choose Free, Tiered, or Pay-per-use pricing
4. **Submit for Approval**: Enters 30-step approval workflow
5. **Track Progress**: Monitor approval status and feedback
6. **Go Live**: Automatic deployment to marketplace upon approval`
          },
          {
            title: 'Approval Workflow',
            content: `**Builder Review (Steps 1-10)**: Technical validation and testing
**Manager Review (Steps 11-20)**: Business validation and compliance
**Admin Review (Steps 21-30)**: Final security and governance approval
Each step includes detailed feedback and revision capabilities`
          }
        ]
      },
      { 
        id: '6', 
        title: 'Deployment & Management', 
        content: `Deploy marketplace workflows to production with enterprise-grade management capabilities.`,
        sections: [
          {
            title: 'Deployment Options',
            content: `• **One-Click Deploy**: Instant deployment to default cloud environment
• **Custom Configuration**: Advanced settings for compute, scaling, networking
• **Multi-Cloud**: Deploy to AWS, Azure, GCP, NVIDIA, or on-premises
• **Auto-Scaling**: Dynamic resource allocation based on demand
• **Blue-Green Deployment**: Zero-downtime updates and rollbacks`
          },
          {
            title: 'Management Features',
            content: `• **Real-time Monitoring**: Performance metrics and health checks
• **Cost Optimization**: Automatic resource scaling and cost alerts
• **Version Control**: Rollback to previous versions instantly
• **A/B Testing**: Compare workflow performance across versions
• **Audit Trails**: Complete deployment and change history`
          }
        ]
      }
    ]
  },
  {
    id: 'builder',
    title: '🛠️ Agent Builder',
    icon: Wrench,
    articles: [
      { 
        id: '7', 
        title: 'Builder Overview', 
        content: `The Agent Builder provides four powerful entry points for creating sophisticated agentic workflows with visual drag-and-drop interface.`,
        sections: [
          {
            title: 'Four Entry Points',
            content: `**🧠 Prompt Generator**: 5-step guided workflow creation with AI recommendations
**📂 Import Workflow**: Support for LangGraph, CrewAI, Autogen, and more
**🛠️ Choose Agentic Pattern**: Start with proven patterns (ReAct, RAG, Multi-Agent, etc.)
**📚 Templates Library**: 1000+ production-ready workflows to customize`
          },
          {
            title: 'Canvas Features',
            content: `• **Visual Workflow Design**: Drag-and-drop nodes with automatic edge routing
• **Node Palette**: 50+ pre-built components for AI models, tools, and logic
• **Real-time Validation**: Instant feedback on workflow correctness
• **Execution Simulation**: Test workflows before deployment
• **LangGraph Export**: Generate production-ready LangGraph JSON`
          }
        ]
      },
      { 
        id: '8', 
        title: 'Prompt Generator', 
        content: `Create sophisticated agentic workflows through a guided 5-step process with AI-powered recommendations.`,
        sections: [
          {
            title: 'Step-by-Step Process',
            content: `**Step 1**: Domain Selection (Healthcare, Finance, Retail, etc.)
**Step 2**: Task Type (Decision Making, Data Processing, Content Generation, etc.)
**Step 3**: Execution Mode (Autonomous, HITL, Hybrid)
**Step 4**: Data & Tools (APIs, Databases, File Systems, etc.)
**Step 5**: Business Goal Description + Freeform Input`
          },
          {
            title: 'AI Recommendations',
            content: `The system analyzes your inputs and recommends the optimal agentic pattern:
• **ReAct**: For reasoning and action cycles
• **RAG**: For knowledge-based responses
• **Multi-Agent**: For collaborative workflows
• **CodeAct**: For code generation tasks
• **Tool-Use**: For MCP protocol integration
• **Self-Reflection**: For iterative improvement`
          }
        ]
      },
      { 
        id: '9', 
        title: 'Import Workflow', 
        content: `Import existing workflows from popular frameworks and convert them to AgentBridge format.`,
        sections: [
          {
            title: 'Supported Frameworks',
            content: `• **LangGraph**: Direct JSON import with full compatibility
• **CrewAI**: Agent team workflows with role-based collaboration
• **Autogen**: Multi-agent conversation frameworks
• **Semantic Kernel**: Microsoft's AI orchestration platform
• **LlamaIndex**: Data framework for LLM applications
• **OpenAI Swarm**: Lightweight multi-agent orchestration`
          },
          {
            title: 'Import Process',
            content: `1. **Select Framework**: Choose your source framework
2. **Upload File**: Support for .json, .ts, .py files
3. **Choose LLM Provider**: Vertex AI, Azure, Bedrock, OpenAI, Anthropic
4. **Configure Parameters**: Map framework-specific settings
5. **Select Protocols**: MCP or A2A communication patterns
6. **Import & Edit**: Load into canvas for customization`
          }
        ]
      },
      { 
        id: '10', 
        title: 'Agentic Patterns', 
        content: `Choose from six proven agentic patterns, each optimized for specific use cases and business requirements.`,
        sections: [
          {
            title: 'Pattern Descriptions',
            content: `**ReAct**: Reasoning and Acting in cycles for complex problem solving
**CodeAct**: Code generation and execution for programming tasks
**Tool Use (MCP)**: Model Context Protocol for advanced tool integration
**Self-Reflection**: Iterative improvement through self-evaluation
**Agentic RAG**: Retrieval-Augmented Generation for knowledge tasks
**Multi-Agent**: Collaborative workflows with specialized agent roles`
          },
          {
            title: 'Pattern Selection Guide',
            content: `• **Use ReAct for**: Complex reasoning tasks, decision trees, multi-step analysis
• **Use CodeAct for**: Software development, data analysis, automation scripts
• **Use Tool Use for**: API integrations, external system interactions
• **Use Self-Reflection for**: Quality improvement, iterative refinement
• **Use Agentic RAG for**: Knowledge retrieval, document analysis, Q&A
• **Use Multi-Agent for**: Team collaboration, specialized roles, parallel processing`
          }
        ]
      },
      { 
        id: '11', 
        title: 'Templates Library', 
        content: `Access 1000+ production-ready workflows organized by industry, each with 5+ meaningful business process steps.`,
        sections: [
          {
            title: 'Template Categories',
            content: `**Healthcare**: Clinical trials, drug discovery, patient diagnosis, medical imaging
**Finance**: Fraud detection, credit risk, algorithmic trading, compliance monitoring
**Retail**: Product recommendations, inventory optimization, dynamic pricing
**Manufacturing**: Predictive maintenance, quality control, supply chain optimization
**Legal**: Contract analysis, legal research, compliance monitoring
**Education**: Adaptive learning, automated grading, curriculum optimization
**And 4 more industries with comprehensive workflow coverage`
          },
          {
            title: 'Template Features',
            content: `• **5+ Workflow Steps**: Each template includes meaningful business process flow
• **Input/Output Nodes**: Clear data flow visualization on canvas
• **Drag & Drop Ready**: Immediate canvas integration with full editing
• **Production Tested**: All templates validated in real enterprise environments
• **Customizable**: Modify any template to fit your specific requirements
• **Export Ready**: Generate LangGraph JSON for external deployment`
          }
        ]
      }
    ]
  },
  {
    id: 'core-logic',
    title: '🧠 Core Agent Logic',
    icon: Brain,
    articles: [
      { 
        id: '12', 
        title: 'Agent Reasoning Patterns', 
        content: `AgentBridge implements advanced reasoning patterns for sophisticated AI decision-making and problem-solving.`,
        sections: [
          {
            title: 'ReAct Pattern',
            content: `**Reasoning and Acting** in iterative cycles:
1. **Thought**: Analyze the current situation and plan next steps
2. **Action**: Execute a specific action or tool call
3. **Observation**: Process the results and feedback
4. **Reflection**: Evaluate success and adjust strategy
5. **Iteration**: Continue until goal is achieved`
          },
          {
            title: 'Multi-Agent Coordination',
            content: `**Agent-to-Agent (A2A) Communication**:
• **Role Specialization**: Each agent has specific expertise and responsibilities
• **Message Passing**: Structured communication protocols between agents
• **Consensus Building**: Collaborative decision-making processes
• **Task Distribution**: Automatic workload balancing across agent teams
• **Conflict Resolution**: Mechanisms for handling disagreements`
          }
        ]
      },
      { 
        id: '13', 
        title: 'Model Integration', 
        content: `Seamlessly integrate with leading AI models and providers for optimal performance across different use cases.`,
        sections: [
          {
            title: 'Supported Models',
            content: `**OpenAI**: GPT-4o, GPT-4, GPT-3.5-turbo with function calling
**Anthropic**: Claude 3 Sonnet, Claude 3 Haiku for reasoning tasks
**Google**: Gemini Pro, PaLM 2 for multimodal applications
**Azure**: GPT-4 via Azure OpenAI with enterprise security
**Amazon**: Bedrock models including Claude, Titan, and Jurassic
**NVIDIA**: NIM endpoints for optimized inference`
          },
          {
            title: 'Model Selection Strategy',
            content: `• **Task Complexity**: Match model capabilities to workflow requirements
• **Cost Optimization**: Balance performance with operational costs
• **Latency Requirements**: Choose models based on response time needs
• **Security Compliance**: Select models meeting regulatory requirements
• **Multimodal Needs**: Integrate vision, text, and code models as needed`
          }
        ]
      },
      { 
        id: '14', 
        title: 'Memory & Context Management', 
        content: `Advanced memory systems for maintaining context across long-running workflows and multi-turn conversations.`,
        sections: [
          {
            title: 'Memory Types',
            content: `**Short-term Memory**: Conversation context within single workflow execution
**Long-term Memory**: Persistent knowledge across multiple sessions
**Episodic Memory**: Specific event and interaction history
**Semantic Memory**: General knowledge and learned patterns
**Working Memory**: Active information processing during task execution`
          },
          {
            title: 'Context Strategies',
            content: `• **Context Window Management**: Optimize token usage across model calls
• **Memory Compression**: Summarize and compress historical context
• **Retrieval Augmentation**: Pull relevant context from knowledge bases
• **Context Switching**: Maintain multiple conversation threads
• **Memory Persistence**: Store and retrieve context across sessions`
          }
        ]
      }
    ]
  },
  {
    id: 'integrations',
    title: '⚡ Integrations',
    icon: Zap,
    articles: [
      { 
        id: '15', 
        title: 'MCP Protocol Integration', 
        content: `Model Context Protocol (MCP) enables seamless integration with external tools and services for enhanced agent capabilities.`,
        sections: [
          {
            title: 'MCP Overview',
            content: `**Model Context Protocol** is an open standard for connecting AI models to external tools:
• **Standardized Interface**: Consistent API for tool integration
• **Security**: Built-in authentication and authorization
• **Scalability**: Support for thousands of concurrent tool calls
• **Reliability**: Error handling and retry mechanisms
• **Extensibility**: Easy addition of new tools and services`
          },
          {
            title: 'Available MCP Tools',
            content: `**Budget Reader**: Financial data analysis and reporting
**PDF Extractor**: Document processing and text extraction
**API Caller**: Generic REST API integration
**SQL Runner**: Database query execution and analysis
**File System**: File operations and document management
**Web Scraper**: Content extraction from web pages
**Email Integration**: Send and receive email communications
**Calendar Management**: Schedule and meeting coordination`
          }
        ]
      },
      { 
        id: '16', 
        title: 'Agent-to-Agent Communication', 
        content: `A2A protocols enable sophisticated multi-agent workflows with specialized roles and collaborative decision-making.`,
        sections: [
          {
            title: 'A2A Agent Types',
            content: `**Planner Agent**: Strategic planning and task decomposition
**Validator Agent**: Quality assurance and validation
**Executor Agent**: Task execution and implementation
**Critique Agent**: Critical analysis and feedback
**Self-Reflector**: Self-improvement and learning
**Coordinator**: Workflow orchestration and management`
          },
          {
            title: 'Communication Patterns',
            content: `• **Request-Response**: Direct communication between two agents
• **Publish-Subscribe**: Broadcast messages to multiple agents
• **Pipeline**: Sequential processing through agent chain
• **Consensus**: Collaborative decision-making process
• **Auction**: Competitive task assignment mechanism
• **Hierarchical**: Manager-subordinate communication structure`
          }
        ]
      },
      { 
        id: '17', 
        title: 'Enterprise System Integration', 
        content: `Connect AgentBridge to your existing enterprise systems for seamless workflow automation and data integration.`,
        sections: [
          {
            title: 'Supported Systems',
            content: `**CRM Systems**: Salesforce, HubSpot, Microsoft Dynamics
**ERP Systems**: SAP, Oracle, NetSuite integration
**Database Systems**: PostgreSQL, MySQL, MongoDB, Snowflake
**Cloud Storage**: AWS S3, Azure Blob, Google Cloud Storage
**Authentication**: Active Directory, LDAP, SAML, OAuth
**Monitoring**: Datadog, New Relic, Splunk integration`
          },
          {
            title: 'Integration Patterns',
            content: `• **API Integration**: RESTful and GraphQL API connections
• **Database Connectivity**: Direct database access with security
• **File System Access**: Secure file operations and transfers
• **Message Queues**: RabbitMQ, Apache Kafka integration
• **Webhook Support**: Real-time event-driven integrations
• **Batch Processing**: Scheduled data synchronization`
          }
        ]
      }
    ]
  },
  {
    id: 'observability',
    title: '📊 Observability & ROI',
    icon: Monitor,
    articles: [
      { 
        id: '18', 
        title: 'Real-time Monitoring', 
        content: `Comprehensive monitoring and observability for production agentic workflows with real-time insights and alerting.`,
        sections: [
          {
            title: 'Monitoring Capabilities',
            content: `**Performance Metrics**: Response time, throughput, error rates
**Resource Utilization**: CPU, memory, GPU usage tracking
**Cost Analytics**: Real-time cost tracking and optimization
**User Analytics**: Workflow usage patterns and adoption
**Health Checks**: Automated system health monitoring
**Custom Dashboards**: Configurable monitoring views`
          },
          {
            title: 'Langfuse Integration',
            content: `**Trace Visualization**: Complete workflow execution traces
**Performance Analysis**: Identify bottlenecks and optimization opportunities
**Cost Tracking**: Token usage and model costs per workflow
**Quality Metrics**: Output quality and user satisfaction scores
**A/B Testing**: Compare workflow versions and performance
**Custom Metrics**: Define and track business-specific KPIs`
          }
        ]
      },
      { 
        id: '19', 
        title: 'ROI Analytics', 
        content: `Measure and optimize the return on investment for your agentic workflows with comprehensive analytics and reporting.`,
        sections: [
          {
            title: 'ROI Metrics',
            content: `**Cost Savings**: Automation vs. manual process costs
**Time Efficiency**: Process acceleration and time-to-value
**Quality Improvement**: Error reduction and accuracy gains
**Scalability Benefits**: Handling increased workload without proportional cost
**Employee Productivity**: Human resource optimization and reallocation
**Revenue Impact**: Direct revenue generation from AI workflows`
          },
          {
            title: 'Reporting Features',
            content: `• **Executive Dashboards**: High-level ROI summaries for leadership
• **Detailed Analytics**: Granular performance and cost breakdowns
• **Trend Analysis**: Historical performance and improvement tracking
• **Comparative Analysis**: Benchmark against industry standards
• **Custom Reports**: Tailored reporting for specific business needs
• **Automated Alerts**: Proactive notifications for performance issues`
          }
        ]
      },
      { 
        id: '20', 
        title: 'Performance Optimization', 
        content: `Optimize workflow performance through intelligent resource management, caching, and continuous improvement mechanisms.`,
        sections: [
          {
            title: 'Optimization Strategies',
            content: `**Model Selection**: Choose optimal models for each task
**Caching**: Intelligent response caching for repeated queries
**Load Balancing**: Distribute workload across multiple instances
**Auto-scaling**: Dynamic resource allocation based on demand
**Batch Processing**: Optimize throughput for bulk operations
**Edge Deployment**: Reduce latency with edge computing`
          },
          {
            title: 'Continuous Improvement',
            content: `• **A/B Testing**: Compare workflow versions and configurations
• **Performance Profiling**: Identify and resolve bottlenecks
• **Model Fine-tuning**: Improve accuracy for specific use cases
• **Feedback Loops**: Incorporate user feedback for improvements
• **Automated Optimization**: ML-driven performance tuning
• **Best Practice Recommendations**: AI-powered optimization suggestions`
          }
        ]
      }
    ]
  },
  {
    id: 'launchpad',
    title: '🚀 Launchpad',
    icon: Rocket,
    articles: [
      { 
        id: '21', 
        title: 'Multi-Cloud Deployment', 
        content: `Deploy agentic workflows to any cloud provider with enterprise-grade security, scalability, and management capabilities.`,
        sections: [
          {
            title: 'Supported Cloud Providers',
            content: `**Amazon Web Services (AWS)**: EC2, Lambda, ECS, EKS deployment options
**Microsoft Azure**: Azure Container Instances, Azure Functions, AKS
**Google Cloud Platform (GCP)**: Compute Engine, Cloud Run, GKE
**NVIDIA Cloud**: Optimized GPU instances for AI workloads
**Oracle Cloud Infrastructure (OCI)**: Enterprise-grade compute and storage
**On-Premises**: Private cloud and hybrid deployment options`
          },
          {
            title: 'Deployment Configurations',
            content: `• **Compute Types**: CPU-optimized, GPU-enabled, memory-optimized instances
• **Scaling Options**: Auto-scaling, manual scaling, scheduled scaling
• **Networking**: VPC configuration, load balancing, SSL termination
• **Storage**: Persistent volumes, object storage, database connections
• **Security**: IAM roles, network policies, encryption at rest and in transit`
          }
        ]
      },
      { 
        id: '22', 
        title: 'Deployment Management', 
        content: `Comprehensive deployment lifecycle management with monitoring, scaling, and maintenance capabilities.`,
        sections: [
          {
            title: 'Lifecycle Management',
            content: `**Deployment**: One-click deployment with configuration validation
**Monitoring**: Real-time health checks and performance monitoring
**Scaling**: Automatic and manual scaling based on demand
**Updates**: Blue-green deployments with zero downtime
**Rollback**: Instant rollback to previous versions
**Maintenance**: Automated patching and security updates`
          },
          {
            title: 'Management Features',
            content: `• **Resource Optimization**: Automatic right-sizing and cost optimization
• **Health Monitoring**: Comprehensive health checks and alerting
• **Log Management**: Centralized logging and log analysis
• **Backup & Recovery**: Automated backups and disaster recovery
• **Security Scanning**: Continuous security vulnerability assessment
• **Compliance**: Automated compliance checking and reporting`
          }
        ]
      },
      { 
        id: '23', 
        title: 'Production Best Practices', 
        content: `Follow enterprise best practices for deploying and managing agentic workflows in production environments.`,
        sections: [
          {
            title: 'Security Best Practices',
            content: `**Access Control**: Role-based access control (RBAC) and least privilege
**Network Security**: VPC isolation, security groups, and network policies
**Data Encryption**: Encryption at rest and in transit
**Secret Management**: Secure storage and rotation of API keys and credentials
**Audit Logging**: Comprehensive audit trails for compliance
**Vulnerability Management**: Regular security scanning and patching`
          },
          {
            title: 'Operational Excellence',
            content: `• **Infrastructure as Code**: Version-controlled infrastructure definitions
• **CI/CD Pipelines**: Automated testing and deployment pipelines
• **Monitoring & Alerting**: Comprehensive observability and incident response
• **Disaster Recovery**: Multi-region backup and recovery procedures
• **Performance Testing**: Load testing and capacity planning
• **Documentation**: Comprehensive operational runbooks and procedures`
          }
        ]
      }
    ]
  },
  {
    id: 'enterprise',
    title: '🏢 Enterprise Features',
    icon: Building2,
    articles: [
      { 
        id: '24', 
        title: 'Governance & Compliance', 
        content: `Enterprise-grade governance with 30-step approval workflows, audit trails, and compliance management for regulated industries.`,
        sections: [
          {
            title: '30-Step Approval Process',
            content: `**Builder Review (Steps 1-10)**: Technical validation, code review, testing
**Manager Review (Steps 11-20)**: Business validation, compliance check, risk assessment
**Admin Review (Steps 21-30)**: Security review, final approval, deployment authorization
Each step includes detailed documentation, feedback mechanisms, and audit trails`
          },
          {
            title: 'Compliance Features',
            content: `• **SOC 2 Type II**: Security and availability controls
• **GDPR Compliance**: Data privacy and protection regulations
• **HIPAA**: Healthcare data protection and security
• **SOX**: Financial reporting and internal controls
• **ISO 27001**: Information security management
• **Custom Compliance**: Configurable rules for industry-specific requirements`
          }
        ]
      },
      { 
        id: '25', 
        title: 'Security & Access Control', 
        content: `Comprehensive security framework with role-based access control, encryption, and enterprise authentication integration.`,
        sections: [
          {
            title: 'Authentication & Authorization',
            content: `**Single Sign-On (SSO)**: SAML, OAuth, OpenID Connect integration
**Multi-Factor Authentication (MFA)**: Enhanced security for sensitive operations
**Role-Based Access Control (RBAC)**: Granular permissions and access control
**Active Directory Integration**: Seamless enterprise directory integration
**API Key Management**: Secure API key generation and rotation
**Session Management**: Secure session handling and timeout policies`
          },
          {
            title: 'Data Security',
            content: `• **Encryption**: AES-256 encryption at rest and TLS 1.3 in transit
• **Key Management**: Hardware security modules (HSM) for key storage
• **Data Classification**: Automatic data sensitivity classification
• **Access Logging**: Comprehensive access and activity logging
• **Data Loss Prevention (DLP)**: Prevent unauthorized data exfiltration
• **Backup Encryption**: Encrypted backups with secure key management`
          }
        ]
      },
      { 
        id: '26', 
        title: 'Scalability & Performance', 
        content: `Enterprise-scale architecture designed to handle thousands of concurrent workflows with optimal performance and reliability.`,
        sections: [
          {
            title: 'Scalability Features',
            content: `**Horizontal Scaling**: Auto-scaling across multiple instances
**Load Balancing**: Intelligent request distribution and failover
**Caching**: Multi-layer caching for optimal performance
**Database Scaling**: Read replicas and connection pooling
**CDN Integration**: Global content delivery for reduced latency
**Microservices Architecture**: Independently scalable service components`
          },
          {
            title: 'Performance Optimization',
            content: `• **Resource Management**: Intelligent resource allocation and optimization
• **Query Optimization**: Database query performance tuning
• **Caching Strategies**: Redis and in-memory caching layers
• **Connection Pooling**: Efficient database connection management
• **Async Processing**: Non-blocking operations for improved throughput
• **Performance Monitoring**: Real-time performance metrics and alerting`
          }
        ]
      }
    ]
  },
  {
    id: 'api-reference',
    title: '📖 API Reference',
    icon: Code,
    articles: [
      { 
        id: '27', 
        title: 'REST API Overview', 
        content: `Comprehensive REST API for programmatic access to all AgentBridge functionality with OpenAPI 3.0 specification.`,
        sections: [
          {
            title: 'API Endpoints',
            content: `**Workflows**: CRUD operations for workflow management
**Deployments**: Deploy, scale, and manage workflow instances
**Marketplace**: Browse, search, and download marketplace workflows
**Analytics**: Access performance metrics and usage analytics
**Users**: User management and authentication
**Organizations**: Multi-tenant organization management`
          },
          {
            title: 'Authentication',
            content: `• **API Keys**: Bearer token authentication for service accounts
• **OAuth 2.0**: Standard OAuth flow for user authentication
• **JWT Tokens**: JSON Web Tokens for stateless authentication
• **Rate Limiting**: Request throttling and quota management
• **CORS Support**: Cross-origin resource sharing configuration
• **Webhook Security**: HMAC signature verification for webhooks`
          }
        ]
      },
      { 
        id: '28', 
        title: 'SDK Documentation', 
        content: `Official SDKs for popular programming languages with comprehensive examples and best practices.`,
        sections: [
          {
            title: 'Available SDKs',
            content: `**Python SDK**: Full-featured Python client with async support
**JavaScript/TypeScript SDK**: Node.js and browser-compatible client
**Java SDK**: Enterprise Java client with Spring Boot integration
**C# SDK**: .NET client for Microsoft ecosystem integration
**Go SDK**: Lightweight Go client for microservices
**REST API**: Direct HTTP API access for any language`
          },
          {
            title: 'SDK Features',
            content: `• **Type Safety**: Full TypeScript definitions and type checking
• **Async Support**: Non-blocking operations with promises/async-await
• **Error Handling**: Comprehensive error handling and retry logic
• **Pagination**: Automatic pagination handling for large datasets
• **Caching**: Built-in response caching for improved performance
• **Logging**: Configurable logging and debugging capabilities`
          }
        ]
      },
      { 
        id: '29', 
        title: 'Webhook Integration', 
        content: `Real-time event notifications through webhooks for workflow events, deployment status, and system alerts.`,
        sections: [
          {
            title: 'Webhook Events',
            content: `**Workflow Events**: Created, updated, deployed, executed, completed
**Deployment Events**: Started, succeeded, failed, scaled
**Marketplace Events**: Published, approved, downloaded
**System Events**: Maintenance, alerts, performance issues
**User Events**: Login, logout, permission changes
**Custom Events**: Configurable business-specific events`
          },
          {
            title: 'Webhook Configuration',
            content: `• **Endpoint Configuration**: HTTPS endpoints with SSL verification
• **Event Filtering**: Subscribe to specific event types
• **Retry Logic**: Automatic retry with exponential backoff
• **Security**: HMAC signature verification and IP whitelisting
• **Payload Format**: JSON payload with event metadata
• **Testing Tools**: Webhook testing and debugging utilities`
          }
        ]
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: '🔧 Troubleshooting',
    icon: Settings,
    articles: [
      { 
        id: '30', 
        title: 'Common Issues', 
        content: `Solutions to frequently encountered issues and error messages in AgentBridge.`,
        sections: [
          {
            title: 'Deployment Issues',
            content: `**Issue**: Workflow deployment fails with timeout error
**Solution**: Check resource limits and increase timeout settings

**Issue**: Authentication errors during deployment
**Solution**: Verify API keys and cloud provider credentials

**Issue**: Out of memory errors during execution
**Solution**: Increase memory allocation or optimize workflow logic`
          },
          {
            title: 'Performance Issues',
            content: `• **Slow Response Times**: Check model selection and caching configuration
• **High Costs**: Review model usage and implement cost optimization
• **Rate Limiting**: Implement proper retry logic and request throttling
• **Memory Leaks**: Monitor resource usage and implement proper cleanup
• **Database Timeouts**: Optimize queries and connection pooling
• **Network Latency**: Use CDN and edge deployment strategies`
          }
        ]
      },
      { 
        id: '31', 
        title: 'Error Codes', 
        content: `Comprehensive reference for all error codes and their resolutions in the AgentBridge platform.`,
        sections: [
          {
            title: 'HTTP Error Codes',
            content: `**400 Bad Request**: Invalid request format or parameters
**401 Unauthorized**: Authentication required or invalid credentials
**403 Forbidden**: Insufficient permissions for requested operation
**404 Not Found**: Requested resource does not exist
**429 Too Many Requests**: Rate limit exceeded
**500 Internal Server Error**: Unexpected server error occurred`
          },
          {
            title: 'Application Error Codes',
            content: `• **WORKFLOW_INVALID**: Workflow validation failed
• **DEPLOYMENT_FAILED**: Deployment process encountered an error
• **MODEL_UNAVAILABLE**: Requested AI model is not available
• **QUOTA_EXCEEDED**: Usage quota or limits exceeded
• **PERMISSION_DENIED**: User lacks required permissions
• **RESOURCE_CONFLICT**: Resource conflict or version mismatch`
          }
        ]
      },
      { 
        id: '32', 
        title: 'Support & Resources', 
        content: `Access support channels, community resources, and additional help for using AgentBridge effectively.`,
        sections: [
          {
            title: 'Support Channels',
            content: `**Enterprise Support**: 24/7 support for enterprise customers
**Community Forum**: Community-driven support and discussions
**Documentation**: Comprehensive guides and tutorials
**Video Tutorials**: Step-by-step video walkthroughs
**Webinars**: Regular training sessions and product updates
**GitHub Issues**: Bug reports and feature requests`
          },
          {
            title: 'Additional Resources',
            content: `• **Best Practices Guide**: Proven patterns and recommendations
• **Case Studies**: Real-world implementation examples
• **Blog**: Latest updates, tips, and industry insights
• **Changelog**: Product updates and release notes
• **Roadmap**: Upcoming features and development plans
• **Training Materials**: Certification programs and learning paths`
          }
        ]
      }
    ]
  }
];

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['overview']);
  const [selectedArticle, setSelectedArticle] = useState(categories[0].articles[0]);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.sections?.some(section => 
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  })).filter(category => category.articles.length > 0 || searchTerm === '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen bg-gray-50 dark:bg-primary"
    >
      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white dark:bg-secondary border-r border-gray-200 dark:border-card-border flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 dark:border-card-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-text-primary">AgentBridge Docs</h1>
              <p className="text-sm text-gray-600 dark:text-text-muted">Complete Platform Guide</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-card-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-card-bg text-gray-900 dark:text-text-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {filteredCategories.map(category => {
              const Icon = category.icon;
              return (
                <div key={category.id}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-text-muted" />
                      <span className="font-medium text-gray-900 dark:text-text-primary">{category.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCategories.includes(category.id) ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-500 dark:text-text-muted" />
                    </motion.div>
                  </motion.button>

                  {expandedCategories.includes(category.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="ml-4 space-y-1"
                    >
                      {category.articles.map(article => (
                        <motion.button
                          key={article.id}
                          whileHover={{ scale: 1.02, x: 4 }}
                          onClick={() => setSelectedArticle(article)}
                          className={`
                            w-full text-left p-2 rounded-lg transition-colors text-sm
                            ${selectedArticle.id === article.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600'
                              : 'text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-card-bg hover:text-gray-900 dark:hover:text-text-primary'
                            }
                          `}
                        >
                          {article.title}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sonata Branding */}
        <div className="p-4 border-t border-gray-200 dark:border-card-border">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-text-muted">
            <span>Powered by</span>
            <img 
              src="/sonata.png" 
              alt="Sonata Software" 
              className="h-4 w-auto opacity-80"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>Sonata Software</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-secondary border-b border-gray-200 dark:border-card-border p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary mb-2">{selectedArticle.title}</h1>
              <p className="text-gray-600 dark:text-text-muted">Comprehensive guide to AgentBridge features and capabilities</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.a
                href="https://www.sonata-software.com/platformation-services/agentbridge"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Learn More</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={selectedArticle.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto p-6"
          >
            <div className="bg-white dark:bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-card-border p-8">
              {/* Article Content */}
              <div className="prose max-w-none">
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-text-muted leading-relaxed text-lg">
                    {selectedArticle.content}
                  </p>
                </div>

                {/* Article Sections */}
                {selectedArticle.sections?.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{section.title}</span>
                    </h3>
                    <div className="text-gray-700 dark:text-text-muted leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-card-border">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-card-border text-gray-700 dark:text-text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-card-bg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Feedback */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-card-border">
                <h4 className="font-medium text-gray-900 dark:text-text-primary mb-3">Was this helpful?</h4>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFeedback('up')}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors
                      ${feedback === 'up' 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' 
                        : 'border-gray-300 dark:border-card-border text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-card-bg'
                      }
                    `}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Yes</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFeedback('down')}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors
                      ${feedback === 'down' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400' 
                        : 'border-gray-300 dark:border-card-border text-gray-600 dark:text-text-muted hover:bg-gray-50 dark:hover:bg-card-bg'
                      }
                    `}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>No</span>
                  </motion.button>
                </div>
                
                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-gray-600 dark:text-text-muted"
                  >
                    Thank you for your feedback! We'll use this to improve our documentation.
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;