'use client';

import { useCallback, useState } from 'react';

type ResponseTone = 'professional' | 'casual' | 'friendly' | 'formal' | 'technical' | 'creative' | 'concise' | 'detailed';
type ResponseLength = 'short' | 'medium' | 'long' | 'custom';
type ContentType = 'explanation' | 'code' | 'list' | 'comparison' | 'tutorial' | 'analysis' | 'summary' | 'conversation';

type GeneratorSettings = {
  tone: ResponseTone;
  length: ResponseLength;
  contentType: ContentType;
  customLength?: number; // word count for custom
  includeCode?: boolean;
  includeExamples?: boolean;
  includeSources?: boolean;
};

type AIResponseGeneratorProps = {
  onGenerate: (response: string, settings: GeneratorSettings) => void;
  initialPrompt?: string;
  platform?: 'chatgpt' | 'claude' | 'gemini' | 'generic';
  isGenerating?: boolean;
  className?: string;
};

const toneLabels: Record<ResponseTone, { label: string; description: string }> = {
  professional: { label: 'Professional', description: 'Formal and business-appropriate' },
  casual: { label: 'Casual', description: 'Relaxed and conversational' },
  friendly: { label: 'Friendly', description: 'Warm and approachable' },
  formal: { label: 'Formal', description: 'Very structured and official' },
  technical: { label: 'Technical', description: 'Precise with technical terminology' },
  creative: { label: 'Creative', description: 'Imaginative and engaging' },
  concise: { label: 'Concise', description: 'Brief and to the point' },
  detailed: { label: 'Detailed', description: 'Comprehensive and thorough' },
};

const lengthOptions: Record<ResponseLength, { label: string; wordRange: string }> = {
  short: { label: 'Short', wordRange: '50-100 words' },
  medium: { label: 'Medium', wordRange: '150-300 words' },
  long: { label: 'Long', wordRange: '400-600 words' },
  custom: { label: 'Custom', wordRange: 'Set your own' },
};

const contentTypes: Record<ContentType, { label: string; icon: React.ReactNode }> = {
  explanation: {
    label: 'Explanation',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  code: {
    label: 'Code',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  list: {
    label: 'List',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  comparison: {
    label: 'Comparison',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  tutorial: {
    label: 'Tutorial',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  analysis: {
    label: 'Analysis',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  summary: {
    label: 'Summary',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  conversation: {
    label: 'Conversation',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
};

// Sample response templates
const sampleResponses: Record<ContentType, Record<ResponseLength, string>> = {
  explanation: {
    short: 'This is a brief explanation of the concept. It covers the key points without going into extensive detail, making it perfect for quick understanding.',
    medium: 'Let me explain this concept in detail.\n\nThe core idea involves understanding how different components interact with each other. When you look at the fundamental principles, you\'ll notice that each element plays a specific role.\n\nHere\'s what makes this important:\n- First, it establishes a foundation for further learning\n- Second, it connects multiple concepts together\n- Third, it provides practical applications\n\nBy understanding these basics, you\'ll be well-equipped to tackle more advanced topics.',
    long: 'Let me provide a comprehensive explanation of this topic.\n\n## Overview\n\nThis concept represents a fundamental principle that has wide-ranging applications across multiple domains. Understanding it thoroughly requires examining both its theoretical foundations and practical implications.\n\n## Core Principles\n\nAt its heart, this concept is built on several key principles:\n\n1. **Foundational Element**: The base upon which everything else is built\n2. **Interconnection**: How different parts relate to each other\n3. **Application**: Putting theory into practice\n\n## Detailed Breakdown\n\nWhen we examine each component more closely, we find that the complexity emerges from simple rules applied consistently. This is similar to how complex systems in nature arise from basic principles.\n\n## Practical Implications\n\nIn real-world scenarios, this understanding enables:\n- Better decision-making\n- Improved problem-solving\n- More effective communication\n\n## Conclusion\n\nBy grasping these fundamentals, you establish a strong foundation for continued learning and application in your work.',
    custom: '',
  },
  code: {
    short: '```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet(\'World\'));\n```\n\nThis simple function demonstrates the basics of function declaration and template literals.',
    medium: 'Here\'s a well-structured implementation:\n\n```typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nclass UserService {\n  private users: Map<string, User> = new Map();\n\n  create(user: User): User {\n    this.users.set(user.id, user);\n    return user;\n  }\n\n  findById(id: string): User | undefined {\n    return this.users.get(id);\n  }\n\n  update(id: string, data: Partial<User>): User | null {\n    const user = this.users.get(id);\n    if (!user) return null;\n    \n    const updated = { ...user, ...data };\n    this.users.set(id, updated);\n    return updated;\n  }\n}\n```\n\nThis implementation follows clean architecture principles with proper TypeScript typing.',
    long: 'Here\'s a comprehensive implementation with full documentation:\n\n```typescript\n/**\n * User entity representing a system user\n */\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\n/**\n * Data transfer object for creating users\n */\ninterface CreateUserDTO {\n  name: string;\n  email: string;\n}\n\n/**\n * User repository interface\n */\ninterface IUserRepository {\n  create(dto: CreateUserDTO): Promise<User>;\n  findById(id: string): Promise<User | null>;\n  findByEmail(email: string): Promise<User | null>;\n  update(id: string, data: Partial<User>): Promise<User>;\n  delete(id: string): Promise<boolean>;\n}\n\n/**\n * User service handling business logic\n */\nclass UserService {\n  constructor(private readonly repository: IUserRepository) {}\n\n  async createUser(dto: CreateUserDTO): Promise<User> {\n    // Validate email uniqueness\n    const existing = await this.repository.findByEmail(dto.email);\n    if (existing) {\n      throw new Error(\'Email already registered\');\n    }\n\n    return this.repository.create(dto);\n  }\n\n  async getUser(id: string): Promise<User> {\n    const user = await this.repository.findById(id);\n    if (!user) {\n      throw new Error(\'User not found\');\n    }\n    return user;\n  }\n}\n```\n\n## Usage Example\n\n```typescript\nconst userService = new UserService(new UserRepository());\n\n// Create a new user\nconst user = await userService.createUser({\n  name: \'John Doe\',\n  email: \'john@example.com\'\n});\n\nconsole.log(user);\n```\n\n## Key Features\n\n1. **Type Safety**: Full TypeScript support with interfaces\n2. **Separation of Concerns**: Repository pattern for data access\n3. **Validation**: Built-in business rule validation\n4. **Async/Await**: Modern async patterns',
    custom: '',
  },
  list: {
    short: 'Here are the key points:\n\n1. First important item\n2. Second consideration\n3. Third element\n4. Final point',
    medium: 'Here\'s a comprehensive breakdown:\n\n## Main Categories\n\n**Category A:**\n- Point 1: Description of the first item\n- Point 2: Details about the second item\n- Point 3: Information on the third item\n\n**Category B:**\n- Item 1: Explanation here\n- Item 2: More details\n- Item 3: Additional context\n\n**Category C:**\n- Element 1: First consideration\n- Element 2: Second aspect\n- Element 3: Third factor',
    long: 'Here\'s an extensive list covering all aspects:\n\n## Section 1: Foundation\n\n### Core Elements\n1. **First Element**\n   - Sub-point A: Detailed explanation\n   - Sub-point B: Supporting information\n   - Sub-point C: Additional context\n\n2. **Second Element**\n   - Sub-point A: Key consideration\n   - Sub-point B: Important factor\n   - Sub-point C: Related aspect\n\n### Supporting Components\n- Component 1: Description and relevance\n- Component 2: How it fits in\n- Component 3: Why it matters\n\n## Section 2: Implementation\n\n### Steps to Follow\n1. **Step One**: Begin with this action\n2. **Step Two**: Continue with this process\n3. **Step Three**: Complete with this task\n\n### Best Practices\n- Practice A: Why it\'s recommended\n- Practice B: Benefits explained\n- Practice C: Common pitfalls to avoid\n\n## Section 3: Advanced Topics\n\n### Deep Dive Areas\n1. Topic A: Comprehensive coverage\n2. Topic B: Detailed exploration\n3. Topic C: Expert-level insights',
    custom: '',
  },
  comparison: {
    short: '| Feature | Option A | Option B |\n|---------|----------|----------|\n| Speed | Fast | Moderate |\n| Cost | High | Low |\n| Quality | Excellent | Good |',
    medium: '## Comparison Analysis\n\n### Option A\n**Pros:**\n- High performance\n- Excellent support\n- Modern features\n\n**Cons:**\n- Higher cost\n- Steeper learning curve\n\n### Option B\n**Pros:**\n- Cost-effective\n- Easy to use\n- Wide adoption\n\n**Cons:**\n- Limited features\n- Slower updates\n\n### Recommendation\nChoose Option A for enterprise needs, Option B for smaller projects.',
    long: '## Comprehensive Comparison\n\n### Executive Summary\nThis analysis compares two leading solutions across multiple dimensions to help you make an informed decision.\n\n---\n\n### Option A: Detailed Analysis\n\n**Overview:** A premium solution designed for enterprise-scale operations.\n\n**Strengths:**\n- Enterprise-grade security\n- 24/7 dedicated support\n- Advanced analytics\n- Custom integrations\n- Scalable architecture\n\n**Weaknesses:**\n- Premium pricing model\n- Requires specialized training\n- Longer implementation time\n\n**Best For:** Large organizations, complex requirements, mission-critical applications\n\n---\n\n### Option B: Detailed Analysis\n\n**Overview:** A cost-effective solution ideal for growing businesses.\n\n**Strengths:**\n- Affordable pricing\n- Quick setup\n- User-friendly interface\n- Active community\n- Regular updates\n\n**Weaknesses:**\n- Limited customization\n- Basic reporting\n- Community support only\n\n**Best For:** Startups, small businesses, straightforward use cases\n\n---\n\n### Side-by-Side Comparison\n\n| Criteria | Option A | Option B |\n|----------|----------|----------|\n| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| Cost | $$$$$ | $$ |\n| Ease of Use | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |\n| Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n| Features | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |\n\n---\n\n### Final Recommendation\n\nYour choice depends on your specific needs:\n- **Choose Option A** if budget isn\'t the primary concern and you need robust, scalable features\n- **Choose Option B** if you\'re looking for a quick, cost-effective solution with room to grow',
    custom: '',
  },
  tutorial: {
    short: '**Quick Tutorial**\n\n1. Open the application\n2. Click \'New Project\'\n3. Enter your details\n4. Click \'Create\'\n\nThat\'s it! Your project is ready.',
    medium: '# Step-by-Step Tutorial\n\n## Prerequisites\n- Basic understanding of the topic\n- Required tools installed\n\n## Step 1: Setup\nBegin by preparing your environment. Make sure all necessary components are in place.\n\n## Step 2: Configuration\nConfigure the settings according to your needs:\n1. Open settings panel\n2. Adjust parameters\n3. Save changes\n\n## Step 3: Implementation\nNow implement the solution:\n1. Create the base structure\n2. Add the core functionality\n3. Test your implementation\n\n## Step 4: Verification\nVerify everything works:\n- Run the tests\n- Check the output\n- Fix any issues\n\n## Next Steps\nExplore advanced features in our documentation.',
    long: '# Comprehensive Tutorial Guide\n\n## Introduction\n\nWelcome to this detailed tutorial. By the end, you\'ll have a complete understanding of the topic and practical skills to apply.\n\n---\n\n## Part 1: Getting Started\n\n### Prerequisites\n\nBefore beginning, ensure you have:\n- [ ] Required software installed\n- [ ] Basic knowledge of fundamentals\n- [ ] Access to necessary resources\n- [ ] At least 30 minutes of dedicated time\n\n### Initial Setup\n\n1. **Download and Install**\n   ```bash\n   npm install package-name\n   ```\n\n2. **Verify Installation**\n   ```bash\n   package-name --version\n   ```\n\n3. **Create Project Structure**\n   ```\n   project/\n   ├── src/\n   ├── config/\n   └── tests/\n   ```\n\n---\n\n## Part 2: Core Concepts\n\n### Understanding the Basics\n\nThe foundation consists of three key concepts:\n\n1. **Concept A**: This forms the base layer\n2. **Concept B**: This handles processing\n3. **Concept C**: This manages output\n\n### Practical Example\n\n```javascript\n// Example implementation\nconst example = new Example({\n  setting: \'value\'\n});\n\nexample.run();\n```\n\n---\n\n## Part 3: Advanced Implementation\n\n### Building the Feature\n\nFollow these steps to build the complete feature:\n\n#### Step 1: Create the Foundation\nStart by setting up the base structure...\n\n#### Step 2: Add Core Logic\nImplement the main functionality...\n\n#### Step 3: Handle Edge Cases\nAccount for various scenarios...\n\n---\n\n## Part 4: Testing and Debugging\n\n### Running Tests\n\n```bash\nnpm test\n```\n\n### Common Issues\n\n| Issue | Solution |\n|-------|----------|\n| Error A | Fix with X |\n| Error B | Fix with Y |\n\n---\n\n## Conclusion\n\nCongratulations! You\'ve completed the tutorial. Key takeaways:\n- Understanding of core concepts\n- Practical implementation skills\n- Debugging knowledge\n\n## Additional Resources\n- Official documentation\n- Community forums\n- Video tutorials',
    custom: '',
  },
  analysis: {
    short: '**Quick Analysis**\n\nThe data shows a 15% improvement in key metrics. Main factors: increased efficiency, better resource allocation, and improved processes.',
    medium: '## Analysis Report\n\n### Overview\nThis analysis examines the current state and identifies key insights.\n\n### Key Findings\n\n1. **Trend 1**: Upward trajectory observed\n   - 15% increase YoY\n   - Consistent growth pattern\n\n2. **Trend 2**: Shift in user behavior\n   - Mobile usage up 25%\n   - Desktop declining\n\n3. **Trend 3**: Market dynamics\n   - Competition intensifying\n   - New opportunities emerging\n\n### Recommendations\n- Focus on mobile experience\n- Invest in emerging technologies\n- Monitor competitor activity\n\n### Conclusion\nPositive trajectory with areas requiring attention.',
    long: '## Comprehensive Analysis Report\n\n### Executive Summary\n\nThis in-depth analysis provides a thorough examination of current trends, patterns, and recommendations for strategic decision-making.\n\n---\n\n### Section 1: Data Overview\n\n#### Methodology\n- Data collection period: 12 months\n- Sample size: 10,000 data points\n- Analysis tools: Advanced statistical methods\n\n#### Key Metrics Examined\n| Metric | Current | Previous | Change |\n|--------|---------|----------|--------|\n| Metric A | 85% | 72% | +13% |\n| Metric B | 1,200 | 980 | +22% |\n| Metric C | 4.5 | 4.2 | +0.3 |\n\n---\n\n### Section 2: Detailed Findings\n\n#### Finding 1: Growth Patterns\n\nThe data reveals consistent growth across all major indicators:\n\n- **Q1**: Initial acceleration\n- **Q2**: Sustained momentum\n- **Q3**: Peak performance\n- **Q4**: Consolidation phase\n\n#### Finding 2: User Behavior\n\nSignificant shifts in user patterns:\n\n1. Mobile-first adoption increasing\n2. Session duration extending\n3. Engagement metrics improving\n\n#### Finding 3: Market Position\n\nCompetitive analysis shows:\n- Strong position in core segments\n- Opportunities in adjacent markets\n- Threats from emerging players\n\n---\n\n### Section 3: Strategic Recommendations\n\n#### Short-term (0-6 months)\n1. Optimize mobile experience\n2. Enhance user engagement features\n3. Address identified gaps\n\n#### Medium-term (6-12 months)\n1. Expand into new segments\n2. Develop partnership strategy\n3. Invest in technology upgrades\n\n#### Long-term (12+ months)\n1. Market expansion planning\n2. Innovation initiatives\n3. Sustainable growth framework\n\n---\n\n### Section 4: Risk Assessment\n\n| Risk | Probability | Impact | Mitigation |\n|------|-------------|--------|------------|\n| Risk A | Medium | High | Strategy X |\n| Risk B | Low | Medium | Strategy Y |\n| Risk C | High | Low | Strategy Z |\n\n---\n\n### Conclusion\n\nThe analysis indicates a favorable trajectory with specific areas requiring attention. Implementation of recommended strategies will position for continued success.',
    custom: '',
  },
  summary: {
    short: '**Summary**: The main topic covers three key areas: foundation, implementation, and optimization. Key takeaway: focus on core principles for best results.',
    medium: '## Summary\n\n### Key Points\n\n1. **Main Topic**: Overview of the subject matter\n2. **Important Finding**: Critical insight discovered\n3. **Recommendation**: Suggested course of action\n\n### Highlights\n- Point A is crucial for understanding\n- Point B provides practical guidance\n- Point C offers strategic direction\n\n### Conclusion\nThe overall assessment is positive, with clear opportunities for improvement in specific areas. Focus on the identified priorities for optimal outcomes.',
    long: '## Executive Summary\n\n### Document Overview\n\nThis summary synthesizes the key information from the source material, providing a comprehensive yet accessible overview of the main themes, findings, and recommendations.\n\n---\n\n### Background\n\nThe subject matter addresses several critical areas:\n- Historical context and evolution\n- Current state analysis\n- Future projections\n\n---\n\n### Key Themes\n\n#### Theme 1: Foundation\nThe foundational elements establish the framework for understanding the broader context. Key aspects include:\n- Core principles and concepts\n- Underlying assumptions\n- Fundamental relationships\n\n#### Theme 2: Implementation\nPractical application reveals important patterns:\n- Success factors identified\n- Common challenges addressed\n- Best practices documented\n\n#### Theme 3: Optimization\nOpportunities for improvement include:\n- Process enhancements\n- Resource allocation\n- Performance metrics\n\n---\n\n### Main Findings\n\n1. **Finding 1**: Significant correlation between X and Y\n2. **Finding 2**: Emerging trend in Z direction\n3. **Finding 3**: Gap identified in current approach\n4. **Finding 4**: Opportunity for competitive advantage\n\n---\n\n### Recommendations\n\n#### Priority Actions\n1. Implement recommendation A\n2. Address gap B\n3. Develop strategy C\n\n#### Supporting Initiatives\n- Initiative 1: Support primary goals\n- Initiative 2: Build capabilities\n- Initiative 3: Ensure sustainability\n\n---\n\n### Conclusion\n\nThe analysis provides clear direction for moving forward. Success depends on:\n- Commitment to identified priorities\n- Consistent execution\n- Ongoing monitoring and adjustment\n\n### Next Steps\n1. Review detailed findings\n2. Develop action plan\n3. Assign responsibilities\n4. Begin implementation',
    custom: '',
  },
  conversation: {
    short: '**User**: Can you help me with this?\n\n**AI**: Of course! I\'d be happy to help. What specifically would you like to know?',
    medium: '**User**: I need help understanding this concept.\n\n**AI**: Absolutely! I\'ll explain it step by step.\n\nFirst, let\'s start with the basics. The concept involves...\n\n**User**: That makes sense. What about the advanced parts?\n\n**AI**: Great question! For the advanced aspects, you\'ll want to consider:\n\n1. First consideration\n2. Second factor\n3. Third element\n\nWould you like me to elaborate on any of these?',
    long: '**User**: Hello! I\'m working on a project and could use some guidance.\n\n**AI**: Hello! I\'d be delighted to help with your project. Could you tell me more about what you\'re working on?\n\n**User**: Sure! I\'m building a web application and I\'m stuck on the authentication system.\n\n**AI**: Authentication is a crucial component. Let me help you think through this.\n\nThere are several approaches you could consider:\n\n1. **Session-based authentication**: Traditional approach using server-side sessions\n2. **JWT tokens**: Stateless authentication with JSON Web Tokens\n3. **OAuth/OIDC**: For social login or enterprise SSO\n\nWhich direction are you leaning, or would you like me to explain the trade-offs?\n\n**User**: I think JWT would work best. Can you explain how to implement it?\n\n**AI**: Absolutely! Here\'s a high-level implementation approach:\n\n**Step 1: User Login**\n- Validate credentials\n- Generate JWT with user claims\n- Return token to client\n\n**Step 2: Token Storage**\n- Store in httpOnly cookie (recommended) or localStorage\n- Include in Authorization header for requests\n\n**Step 3: Token Validation**\n- Verify signature\n- Check expiration\n- Extract user claims\n\nWould you like specific code examples for any of these steps?\n\n**User**: Yes, code examples would be helpful!\n\n**AI**: Here\'s a basic implementation:\n\n```javascript\n// Generate token\nconst token = jwt.sign(\n  { userId: user.id, email: user.email },\n  process.env.JWT_SECRET,\n  { expiresIn: \'24h\' }\n);\n\n// Verify token\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);\n```\n\nWant me to show you the complete authentication flow with middleware?',
    custom: '',
  },
};

export function AIResponseGenerator({
  onGenerate,
  initialPrompt = '',
  platform: _platform = 'generic',
  isGenerating = false,
  className = '',
}: AIResponseGeneratorProps) {
  // Platform available for future platform-specific styling
  void _platform;
  const [prompt, setPrompt] = useState(initialPrompt);
  const [settings, setSettings] = useState<GeneratorSettings>({
    tone: 'professional',
    length: 'medium',
    contentType: 'explanation',
    includeCode: false,
    includeExamples: true,
    includeSources: false,
  });

  const handleGenerate = useCallback(() => {
    // In a real app, this would call an AI API
    // For the mockup, we use sample responses
    const response = sampleResponses[settings.contentType][settings.length]
      || `Generated response for "${prompt}" with ${settings.tone} tone.`;
    onGenerate(response, settings);
  }, [prompt, settings, onGenerate]);

  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          AI Response Generator
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Generate realistic AI responses for your mockups
        </p>
      </div>

      <div className="space-y-4 p-4">
        {/* Prompt input */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt (optional)
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter a prompt or topic for the response..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
        </div>

        {/* Content type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Response Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(contentTypes) as [ContentType, { label: string; icon: React.ReactNode }][]).map(([type, { label, icon }]) => (
              <button
                key={type}
                onClick={() => setSettings({ ...settings, contentType: type })}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors ${
                  settings.contentType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone and Length */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tone
            </label>
            <select
              value={settings.tone}
              onChange={e => setSettings({ ...settings, tone: e.target.value as ResponseTone })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {(Object.entries(toneLabels) as [ResponseTone, { label: string }][]).map(([tone, { label }]) => (
                <option key={tone} value={tone}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Length
            </label>
            <select
              value={settings.length}
              onChange={e => setSettings({ ...settings, length: e.target.value as ResponseLength })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {(Object.entries(lengthOptions) as [ResponseLength, { label: string; wordRange: string }][]).map(([length, { label, wordRange }]) => (
                <option key={length} value={length}>
                  {label}
                  {' '}
                  (
                  {wordRange}
                  )
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.includeCode}
              onChange={e => setSettings({ ...settings, includeCode: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            Include code
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.includeExamples}
              onChange={e => setSettings({ ...settings, includeExamples: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            Include examples
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={settings.includeSources}
              onChange={e => setSettings({ ...settings, includeSources: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            Include sources
          </label>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          {isGenerating
            ? (
                <>
                  <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              )
            : (
                <>
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Response
                </>
              )}
        </button>
      </div>
    </div>
  );
}

// Quick response picker with presets
type QuickResponsePickerProps = {
  onSelect: (response: string) => void;
  className?: string;
};

export function QuickResponsePicker({
  onSelect,
  className = '',
}: QuickResponsePickerProps) {
  const presets = [
    { label: 'Greeting', response: 'Hello! I\'m happy to help. What would you like to know?' },
    { label: 'Explanation', response: 'Let me explain this step by step.\n\nFirst, we need to understand the basics...' },
    { label: 'Code help', response: 'Here\'s a solution for that:\n\n```javascript\n// Your code here\n```' },
    { label: 'Apology', response: 'I apologize for any confusion. Let me clarify...' },
    { label: 'Follow-up', response: 'That\'s a great question! Building on what I mentioned earlier...' },
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {presets.map(preset => (
        <button
          key={preset.label}
          onClick={() => onSelect(preset.response)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

export type { ContentType, GeneratorSettings, ResponseLength, ResponseTone };
