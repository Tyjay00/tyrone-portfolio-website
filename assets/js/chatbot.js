/**
 * AI Chatbot Widget - Gemini API Integration
 * Portfolio Navigation Assistant
 */

class PortfolioChatbot {
  constructor() {
    // Gemini API Configuration
    // IMPORTANT: For production, use environment variables or a backend proxy
    this.GEMINI_API_KEY = this.getApiKey();
    this.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    // DOM Elements
    this.chatbotToggle = document.getElementById('chatbot-toggle');
    this.chatbotContainer = document.getElementById('chatbot-container');
    this.chatbotClose = document.getElementById('chatbot-close');
    this.chatbotMessages = document.getElementById('chatbot-messages');
    this.chatbotInput = document.getElementById('chatbot-input');
    this.chatbotSend = document.getElementById('chatbot-send');
    this.chatbotSuggestions = document.getElementById('chatbot-suggestions');
    
    // State
    this.isOpen = false;
    this.conversationHistory = [];
    
    // Portfolio context for better responses
    this.portfolioContext = this.buildPortfolioContext();
    
    // Initialize
    this.init();
  }
  
  getApiKey() {
    // For production portfolio site: API key is included but restricted in Google Cloud Console
    // The key is restricted to only work on your domain (tyrone.studio)
    
    // Option 1: Try to get from a config file (if available)
    if (typeof GEMINI_CONFIG !== 'undefined' && GEMINI_CONFIG.apiKey) {
      return GEMINI_CONFIG.apiKey;
    }
    
    // Option 2: Use embedded API key (restricted to your domain in Google Cloud Console)
    // IMPORTANT: This key should be restricted to only work on https://www.tyrone.studio
    return 'AIzaSyA2xKdOFP-NK3IOndG-Dyc3USE1YyZ2Ixw';
  }
  
  buildPortfolioContext() {
    return `
You are a helpful and elegant portfolio assistant for Tyrone Joel's Cloud Engineering portfolio website. 

ABOUT TYRONE:
- AWS Cloud Engineer with hands-on experience in serverless architectures, container orchestration, and enterprise cloud solutions
- Completed CloudSec Network AWS Cloud Engineering Program
- AWS Certified Cloud Practitioner
- Additional Certifications: Oracle Cloud AI Foundations, Oracle Multicloud Architect Professional
- Expertise: ECS Fargate, Lambda, Docker, CloudFront, Route 53, RDS, VPC networking, CloudFormation

KEY PROJECTS:
1. Static Website on AWS - Global CDN with S3, CloudFront & Route53
2. Grafana on ECS Fargate - Scalable monitoring with Docker containers
3. Metabase BI Platform - Business intelligence with RDS PostgreSQL
4. Serverless Image Processing - AI-powered automation with Lambda & Rekognition
5. Secure Windows EC2 - Enterprise Windows Server deployment
6. Multi-VPC Architecture - Enterprise networking with VPC peering

CORE SKILLS:
- Cloud Engineering: AWS ECS Fargate, Docker, AWS Lambda, CloudFormation
- Infrastructure: VPC, Security Groups, IAM, Route 53, CloudFront
- Databases: RDS PostgreSQL, DynamoDB
- DevOps: CI/CD, Infrastructure as Code, Monitoring
- Migration: AWS Migration Hub, VMware to AWS transformation

PROFESSIONAL FOCUS:
- Building scalable, secure cloud architectures
- Automation and Infrastructure as Code
- Containerization and orchestration
- Serverless solutions and event-driven architectures

CONTACT:
- Email: tyronejoel04@gmail.com
- LinkedIn: linkedin.com/in/tyronejoel
- GitHub: github.com/Tyjay00
- Location: Johannesburg, South Africa (Remote work available)

RESPONSE GUIDELINES:
1. Be professional, warm, and conversational
2. Keep responses concise but informative (2-4 sentences)
3. Use proper formatting with paragraphs and lists when helpful
4. Guide users to explore relevant sections
5. Highlight Tyrone's expertise and hands-on experience
6. Use subtle emojis sparingly for a professional touch
7. When mentioning sections, provide clear navigation guidance
8. Focus on value and capabilities, not just listing facts
9. Be encouraging and highlight practical experience
10. Answer naturally as if you're a knowledgeable assistant who knows Tyrone's work well

Your goal is to help visitors understand Tyrone's cloud engineering capabilities and guide them through the portfolio naturally.
`;
  }
  
  init() {
    // Event Listeners
    this.chatbotToggle.addEventListener('click', () => this.toggleChat());
    this.chatbotClose.addEventListener('click', () => this.toggleChat());
    this.chatbotSend.addEventListener('click', () => this.sendMessage());
    this.chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    // Suggestion chips
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const message = chip.getAttribute('data-message');
        this.chatbotInput.value = message;
        this.sendMessage();
      });
    });
    
    // Check if API key is set
    this.checkApiKey();
  }
  
  checkApiKey() {
    // API key check - silently validate
    if (this.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      // API key not configured
    }
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatbotContainer.style.display = this.isOpen ? 'flex' : 'none';
    
    // Hide/show scroll-to-top arrow to avoid overlap
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
      if (this.isOpen) {
        scrollTop.style.opacity = '0';
        scrollTop.style.visibility = 'hidden';
      } else {
        // Restore scroll-to-top visibility based on scroll position
        scrollTop.style.opacity = '';
        scrollTop.style.visibility = '';
      }
    }
    
    if (this.isOpen) {
      this.chatbotInput.focus();
      
      // Hide suggestions after first interaction
      if (this.conversationHistory.length > 0) {
        this.chatbotSuggestions.style.display = 'none';
      }
    }
  }
  
  async sendMessage() {
    const message = this.chatbotInput.value.trim();
    
    if (!message) return;
    
    // Disable input while processing
    this.chatbotInput.disabled = true;
    this.chatbotSend.disabled = true;
    
    // Add user message
    this.addMessage(message, 'user');
    
    // Clear input
    this.chatbotInput.value = '';
    
    // Hide suggestions after first message
    this.chatbotSuggestions.style.display = 'none';
    
    // Show typing indicator
    const typingIndicator = this.showTypingIndicator();
    
    try {
      // Check for navigation commands first
      const navigationResponse = this.handleNavigation(message);
      
      if (navigationResponse) {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add bot response
        this.addMessage(navigationResponse, 'bot', true);
      } else {
        // Call Gemini API for general questions
        const response = await this.callGeminiAPI(message);
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Add bot response
        this.addMessage(response, 'bot', true);
      }
    } catch (error) {
      // Error handling
      
      // Remove typing indicator
      typingIndicator.remove();
      
      // Show error message
      const errorMsg = this.getErrorMessage(error);
      this.addMessage(errorMsg, 'bot');
    }
    
    // Re-enable input
    this.chatbotInput.disabled = false;
    this.chatbotSend.disabled = false;
    this.chatbotInput.focus();
  }
  
  handleNavigation(message) {
    const lowerMessage = message.toLowerCase();
    
    // Navigation patterns
    const patterns = {
      home: /\b(home|start|beginning|main|hero)\b/i,
      about: /\b(about|background|story|journey|bio|who|experience)\b/i,
      skills: /\b(skills|expertise|technical|certifications|cert|certified|tech|abilities)\b/i,
      portfolio: /\b(portfolio|projects|work|built|created|showcase)\b/i,
      contact: /\b(contact|email|reach|connect|hire|linkedin|github)\b/i
    };
    
    // Check for section-specific requests
    for (const [section, pattern] of Object.entries(patterns)) {
      if (pattern.test(lowerMessage)) {
        return this.getNavigationResponse(section);
      }
    }
    
    // Check for specific project mentions
    if (/\b(static website|s3|cloudfront)\b/i.test(lowerMessage)) {
      return this.getProjectResponse('static-website');
    }
    if (/\b(grafana|monitoring|ecs|fargate|containers)\b/i.test(lowerMessage)) {
      return this.getProjectResponse('grafana');
    }
    if (/\b(metabase|analytics|bi|business intelligence|rds)\b/i.test(lowerMessage)) {
      return this.getProjectResponse('metabase');
    }
    if (/\b(serverless|lambda|image processing|rekognition)\b/i.test(lowerMessage)) {
      return this.getProjectResponse('serverless');
    }
    if (/\b(windows|ec2|rdp|server)\b/i.test(lowerMessage)) {
      return this.getProjectResponse('windows-ec2');
    }
    if (/\b(vpc|network|peering|multi.vpc)\b/i.test(lowerMessage)) {
      return this.getProjectResponse('multi-vpc');
    }
    
    return null;
  }
  
  getNavigationResponse(section) {
    const responses = {
      home: `
        <p>Welcome! Let me take you to the home section where you'll discover Tyrone's professional overview.</p>
        <p>As an AWS Cloud Engineer, he specializes in serverless architectures, container orchestration, and enterprise cloud solutions.</p>
        <div class="message-actions">
          <a href="#hero" class="action-link" onclick="document.getElementById('chatbot-close').click();">
            <i class="bi bi-house"></i> Go to Home
          </a>
        </div>
      `,
      about: `
        <p>Tyrone is an AWS Cloud Engineer with practical experience in building production-ready cloud solutions.</p>
        <p><strong>Key highlights:</strong></p>
        <ul>
          <li>Deployed ECS Fargate clusters and Docker containers</li>
          <li>Built serverless architectures with Lambda</li>
          <li>Implemented multi-VPC networking and security</li>
          <li>AWS Certified with hands-on project experience</li>
        </ul>
        <div class="message-actions">
          <a href="#about" class="action-link" onclick="document.getElementById('chatbot-close').click();">
            <i class="bi bi-person"></i> Learn More
          </a>
        </div>
      `,
      skills: `
        <p>Tyrone brings comprehensive cloud engineering expertise across multiple domains:</p>
        <p><strong>Core Competencies:</strong></p>
        <ul>
          <li><strong>Container Orchestration:</strong> ECS Fargate, Docker</li>
          <li><strong>Serverless:</strong> AWS Lambda, API Gateway</li>
          <li><strong>Infrastructure:</strong> VPC, CloudFormation, IAM</li>
          <li><strong>Data:</strong> RDS PostgreSQL, S3, DynamoDB</li>
        </ul>
        <div class="message-actions">
          <a href="#skills" class="action-link" onclick="document.getElementById('chatbot-close').click();">
            <i class="bi bi-lightning"></i> View All Skills
          </a>
        </div>
      `,
      portfolio: `
        <p>Explore Tyrone's hands-on AWS projects demonstrating real-world cloud engineering capabilities:</p>
        <ul>
          <li><strong>Static Website:</strong> Global CDN with CloudFront & Route53</li>
          <li><strong>Grafana on ECS:</strong> Containerized monitoring dashboard</li>
          <li><strong>Metabase Platform:</strong> Data analytics with RDS</li>
          <li><strong>Serverless Processing:</strong> AI-powered image analysis</li>
          <li><strong>Multi-VPC Network:</strong> Enterprise architecture</li>
        </ul>
        <div class="message-actions">
          <a href="#portfolio" class="action-link" onclick="document.getElementById('chatbot-close').click();">
            <i class="bi bi-briefcase"></i> View Projects
          </a>
        </div>
      `,
      contact: `
        <p>Ready to connect with Tyrone?</p>
        <p><strong>He's open to:</strong></p>
        <ul>
          <li>Cloud engineering opportunities</li>
          <li>Remote or hybrid positions</li>
          <li>Technical consultations</li>
        </ul>
        <p><strong>Best ways to reach out:</strong></p>
        <p>📧 <strong>Email:</strong> tyronejoel04@gmail.com<br>
        💼 <strong>LinkedIn:</strong> linkedin.com/in/tyronejoel<br>
        🐙 <strong>GitHub:</strong> github.com/Tyjay00</p>
        <div class="message-actions">
          <a href="#contact" class="action-link" onclick="document.getElementById('chatbot-close').click();">
            <i class="bi bi-envelope"></i> Contact Info
          </a>
          <a href="mailto:tyronejoel04@gmail.com" class="action-link">
            <i class="bi bi-send"></i> Email Now
          </a>
        </div>
      `
    };
    
    return responses[section] || null;
  }
  
  getProjectResponse(project) {
    const projects = {
      'static-website': `
        <p><strong>Static Website on AWS</strong></p>
        <p>A production-ready static website hosting solution demonstrating enterprise-grade infrastructure:</p>
        <ul>
          <li><strong>Amazon S3:</strong> Reliable, scalable storage</li>
          <li><strong>CloudFront CDN:</strong> Global content delivery</li>
          <li><strong>Route 53:</strong> DNS management</li>
          <li><strong>ACM:</strong> SSL/TLS certificates</li>
        </ul>
        <p>This architecture ensures high availability, low latency, and secure HTTPS delivery worldwide.</p>
        <div class="message-actions">
          <a href="portfolio-details.html" class="action-link" target="_blank">
            <i class="bi bi-info-circle"></i> View Full Details
          </a>
        </div>
      `,
      'grafana': `
        <p><strong>Grafana Monitoring on ECS Fargate</strong></p>
        <p>A scalable, containerized monitoring solution showcasing modern DevOps practices:</p>
        <ul>
          <li><strong>Docker:</strong> Container packaging</li>
          <li><strong>ECS Fargate:</strong> Serverless container orchestration</li>
          <li><strong>ALB:</strong> Load balancing and traffic distribution</li>
          <li><strong>CloudWatch:</strong> Metrics and logging integration</li>
        </ul>
        <p>Perfect for real-time infrastructure monitoring and observability at scale.</p>
        <div class="message-actions">
          <a href="grafana-ecs-details.html" class="action-link" target="_blank">
            <i class="bi bi-info-circle"></i> Explore Project
          </a>
        </div>
      `,
      'metabase': `
        <p><strong>Metabase Business Intelligence Platform</strong></p>
        <p>A comprehensive data analytics solution demonstrating full-stack cloud architecture:</p>
        <ul>
          <li><strong>Metabase:</strong> Self-service BI tool on ECS Fargate</li>
          <li><strong>RDS PostgreSQL:</strong> Managed database service</li>
          <li><strong>VPC Peering:</strong> Secure network connectivity</li>
          <li><strong>Security Groups:</strong> Layered security controls</li>
        </ul>
        <p>Enables data-driven decision making with powerful visualization and querying capabilities.</p>
        <div class="message-actions">
          <a href="metabase-details.html" class="action-link" target="_blank">
            <i class="bi bi-info-circle"></i> Learn More
          </a>
        </div>
      `,
      'serverless': `
        <p><strong>Serverless Image Processing Pipeline</strong></p>
        <p>An intelligent, event-driven automation system showcasing AI integration:</p>
        <ul>
          <li><strong>AWS Lambda:</strong> Serverless compute</li>
          <li><strong>Amazon Rekognition:</strong> AI-powered image analysis</li>
          <li><strong>S3 Events:</strong> Automatic trigger mechanism</li>
          <li><strong>SES:</strong> Email notification delivery</li>
        </ul>
        <p>Demonstrates modern serverless patterns and machine learning integration in the cloud.</p>
        <div class="message-actions">
          <a href="serverless-image-processing-details.html" class="action-link" target="_blank">
            <i class="bi bi-info-circle"></i> See How It Works
          </a>
        </div>
      `,
      'windows-ec2': `
        <p><strong>Secure Windows EC2 Infrastructure</strong></p>
        <p>Enterprise Windows Server deployment with comprehensive security:</p>
        <ul>
          <li><strong>EC2 Instances:</strong> Windows Server configuration</li>
          <li><strong>RDP Access:</strong> Secure remote desktop setup</li>
          <li><strong>Security Groups:</strong> Fine-grained access control</li>
          <li><strong>IAM Roles:</strong> Least privilege principles</li>
        </ul>
        <p>Production-ready infrastructure following AWS best practices and security standards.</p>
        <div class="message-actions">
          <a href="windows-ec2-details.html" class="action-link" target="_blank">
            <i class="bi bi-info-circle"></i> View Architecture
          </a>
        </div>
      `,
      'multi-vpc': `
        <p><strong>Multi-VPC Enterprise Architecture</strong></p>
        <p>Complex network infrastructure demonstrating advanced AWS networking:</p>
        <ul>
          <li><strong>Multiple VPCs:</strong> Isolated network environments</li>
          <li><strong>VPC Peering:</strong> Secure cross-VPC communication</li>
          <li><strong>Security Groups & NACLs:</strong> Multi-layer security</li>
          <li><strong>Cross-Region:</strong> Geographic redundancy</li>
        </ul>
        <p>Showcases enterprise-grade networking skills and security architecture expertise.</p>
        <div class="message-actions">
          <a href="multi-vpc-details.html" class="action-link" target="_blank">
            <i class="bi bi-info-circle"></i> Explore Network Design
          </a>
        </div>
      `
    };
    
    return projects[project] || null;
  }
  
  async callGeminiAPI(userMessage) {
    // Check if API key is configured
    if (this.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return `
        <div class="error-message">
          <p><strong>⚠️ API Key Not Configured</strong></p>
          <p>To use the AI chatbot, please:</p>
          <ol>
            <li>Get a free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
            <li>Open <code>assets/js/chatbot.js</code></li>
            <li>Replace <code>YOUR_GEMINI_API_KEY_HERE</code> with your actual API key</li>
          </ol>
          <p>For now, try asking about specific sections or projects, and I'll help you navigate!</p>
        </div>
      `;
    }
    
    // Build the prompt with context
    const prompt = `${this.portfolioContext}\n\nUser question: ${userMessage}\n\nProvide a helpful, professional, and conversational response. Be warm but elegant. Keep responses focused and concise (2-4 sentences maximum unless providing lists). If the question relates to portfolio sections or projects, guide them naturally. Format your response with proper HTML paragraphs and lists where appropriate for readability.`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 400,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the response text
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid API response format');
  }
  
  getErrorMessage(error) {
    // Handle error silently
    
    if (error.message.includes('API Error')) {
      return `
        <div class="error-message">
          <p><strong>⚠️ API Connection Error</strong></p>
          <p>I'm having trouble connecting to the AI service. Please check your API key and internet connection.</p>
          <p>You can still ask me about specific sections or projects, and I'll help you navigate!</p>
        </div>
      `;
    }
    
    return `
      <p>I apologize, but I encountered an error. However, I can still help you navigate the portfolio!</p>
      <p>Try asking about:</p>
      <ul>
        <li>Tyrone's projects and experience</li>
        <li>Specific skills or certifications</li>
        <li>How to contact him</li>
      </ul>
    `;
  }
  
  addMessage(text, sender, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="bi bi-robot"></i>' : '<i class="bi bi-person"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    if (isHTML) {
      content.innerHTML = text;
    } else {
      content.textContent = text;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    this.chatbotMessages.appendChild(messageDiv);
    
    // Add quick action chips after bot messages
    if (sender === 'bot') {
      this.addQuickActionChips();
    }
    
    // Scroll to bottom
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    
    // Store in conversation history
    this.conversationHistory.push({
      sender,
      text,
      timestamp: new Date()
    });
  }
  
  addQuickActionChips() {
    // Remove any existing quick action chips
    const existingChips = this.chatbotMessages.querySelectorAll('.quick-actions');
    existingChips.forEach(chip => chip.remove());
    
    const quickActionsDiv = document.createElement('div');
    quickActionsDiv.className = 'quick-actions';
    quickActionsDiv.innerHTML = `
      <div class="quick-actions-label">Quick Actions:</div>
      <div class="quick-actions-chips">
        <button class="quick-action-chip" data-action="projects">
          <i class="bi bi-cloud"></i> AWS Projects
        </button>
        <button class="quick-action-chip" data-action="certifications">
          <i class="bi bi-trophy"></i> Certifications
        </button>
        <button class="quick-action-chip" data-action="portfolio">
          <i class="bi bi-briefcase"></i> Portfolio
        </button>
        <button class="quick-action-chip" data-action="contact">
          <i class="bi bi-envelope"></i> Contact
        </button>
      </div>
    `;
    
    this.chatbotMessages.appendChild(quickActionsDiv);
    
    // Add click handlers to quick action chips
    const chips = quickActionsDiv.querySelectorAll('.quick-action-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const action = chip.getAttribute('data-action');
        let message = '';
        
        switch(action) {
          case 'projects':
            message = 'Tell me about the AWS projects';
            break;
          case 'certifications':
            message = 'What are the certifications?';
            break;
          case 'portfolio':
            message = 'Show me the portfolio';
            break;
          case 'contact':
            message = 'How can I contact Tyrone?';
            break;
        }
        
        this.chatbotInput.value = message;
        this.sendMessage();
      });
    });
    
    // Scroll to bottom after adding chips
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
  }
  
  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<i class="bi bi-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    
    this.chatbotMessages.appendChild(typingDiv);
    this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    
    return typingDiv;
  }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioChatbot = new PortfolioChatbot();
});
