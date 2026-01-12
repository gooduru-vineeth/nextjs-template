'use client';

import { useMemo, useState } from 'react';

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  category: 'coding' | 'writing' | 'analysis' | 'creative' | 'business' | 'education';
  systemPrompt?: string;
  userPrompt: string;
  aiResponse?: string;
};

// Pre-defined prompt templates
export const promptTemplates: PromptTemplate[] = [
  // Coding Prompts
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'Request a code review for your code',
    category: 'coding',
    systemPrompt: 'You are an expert software engineer conducting code reviews.',
    userPrompt: 'Please review this code and provide feedback on best practices, potential bugs, and improvements:\n\n```\n// Your code here\n```',
    aiResponse: 'I\'ll review your code and provide detailed feedback on:\n\n1. **Code Quality**: Looking for best practices...\n2. **Potential Bugs**: Checking for edge cases...\n3. **Performance**: Analyzing efficiency...\n4. **Suggestions**: Recommending improvements...',
  },
  {
    id: 'debug-help',
    title: 'Debug Assistance',
    description: 'Get help debugging an issue',
    category: 'coding',
    userPrompt: 'I\'m getting this error and need help debugging:\n\nError: [paste error here]\n\nCode:\n```\n// Your code here\n```',
    aiResponse: 'Let me help you debug this issue. Based on the error message, here\'s what might be happening:\n\n1. **Root Cause**: The error suggests...\n2. **Possible Fix**: Try modifying...\n3. **Prevention**: To avoid this in the future...',
  },
  {
    id: 'explain-code',
    title: 'Code Explanation',
    description: 'Get a detailed explanation of code',
    category: 'coding',
    userPrompt: 'Can you explain what this code does step by step?\n\n```\n// Code to explain\n```',
    aiResponse: 'I\'ll break down this code step by step:\n\n**Line 1-3**: Initialization phase...\n**Line 4-7**: Main logic...\n**Line 8-10**: Output handling...',
  },
  {
    id: 'unit-tests',
    title: 'Generate Unit Tests',
    description: 'Create unit tests for your code',
    category: 'coding',
    systemPrompt: 'You are a testing expert who writes comprehensive unit tests.',
    userPrompt: 'Please write unit tests for this function:\n\n```\nfunction add(a, b) {\n  return a + b;\n}\n```',
    aiResponse: '```javascript\ndescribe(\'add function\', () => {\n  test(\'adds two positive numbers\', () => {\n    expect(add(1, 2)).toBe(3);\n  });\n\n  test(\'adds negative numbers\', () => {\n    expect(add(-1, -2)).toBe(-3);\n  });\n\n  test(\'adds zero\', () => {\n    expect(add(0, 5)).toBe(5);\n  });\n});\n```',
  },

  // Writing Prompts
  {
    id: 'email-professional',
    title: 'Professional Email',
    description: 'Draft a professional email',
    category: 'writing',
    userPrompt: 'Help me write a professional email to [recipient] about [topic]. The tone should be [formal/friendly].',
    aiResponse: 'Subject: [Topic]\n\nDear [Recipient],\n\nI hope this email finds you well. I am writing to discuss...\n\n[Body paragraph]\n\nPlease let me know if you have any questions.\n\nBest regards,\n[Your name]',
  },
  {
    id: 'blog-post',
    title: 'Blog Post Outline',
    description: 'Create a blog post structure',
    category: 'writing',
    systemPrompt: 'You are an experienced content writer who creates engaging blog posts.',
    userPrompt: 'Create an outline for a blog post about [topic] targeting [audience].',
    aiResponse: '# Blog Post Outline: [Topic]\n\n## Introduction\n- Hook to grab attention\n- Brief overview\n\n## Main Points\n1. **First Key Point**\n   - Supporting detail\n   - Example\n\n2. **Second Key Point**\n   - Supporting detail\n   - Example\n\n## Conclusion\n- Summary\n- Call to action',
  },
  {
    id: 'proofread',
    title: 'Proofread & Edit',
    description: 'Get proofreading and editing suggestions',
    category: 'writing',
    userPrompt: 'Please proofread and edit this text for grammar, clarity, and style:\n\n[Your text here]',
    aiResponse: 'Here\'s your edited text with corrections highlighted:\n\n**Original issues found:**\n1. Grammar: [correction]\n2. Clarity: [suggestion]\n3. Style: [improvement]\n\n**Revised version:**\n[Edited text]',
  },

  // Analysis Prompts
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Analyze data and extract insights',
    category: 'analysis',
    systemPrompt: 'You are a data analyst who provides clear, actionable insights.',
    userPrompt: 'Analyze this data and provide key insights:\n\n[Paste data or describe dataset]',
    aiResponse: '## Data Analysis Results\n\n### Key Findings\n1. **Trend**: The data shows...\n2. **Pattern**: A notable pattern is...\n3. **Anomaly**: One unusual finding...\n\n### Recommendations\n- Action item 1\n- Action item 2',
  },
  {
    id: 'compare-options',
    title: 'Compare Options',
    description: 'Get a pros/cons analysis of options',
    category: 'analysis',
    userPrompt: 'Compare these options and help me decide:\n\nOption A: [description]\nOption B: [description]',
    aiResponse: '## Comparison Analysis\n\n### Option A\n**Pros:**\n- Benefit 1\n- Benefit 2\n\n**Cons:**\n- Drawback 1\n\n### Option B\n**Pros:**\n- Benefit 1\n\n**Cons:**\n- Drawback 1\n- Drawback 2\n\n### Recommendation\nBased on your criteria...',
  },

  // Creative Prompts
  {
    id: 'brainstorm-ideas',
    title: 'Brainstorm Ideas',
    description: 'Generate creative ideas',
    category: 'creative',
    systemPrompt: 'You are a creative brainstorming partner who thinks outside the box.',
    userPrompt: 'Help me brainstorm ideas for [project/problem]. I want at least 10 creative suggestions.',
    aiResponse: '# Creative Ideas Brainstorm\n\n1. **Innovative Approach**: Try...\n2. **Unconventional Method**: Consider...\n3. **Tech-Forward Solution**: Implement...\n4. **User-Centric Idea**: Focus on...\n5. **Cost-Effective Option**: Use...\n\n[Continue with more ideas...]',
  },
  {
    id: 'story-starter',
    title: 'Story Starter',
    description: 'Get a creative story opening',
    category: 'creative',
    userPrompt: 'Write a compelling opening paragraph for a story about [topic/genre].',
    aiResponse: 'The rain hadn\'t stopped for three days when she finally saw it—a light flickering in the abandoned lighthouse, the one everyone said had been dark for twenty years. Against every instinct telling her to turn back, she stepped forward into the storm...',
  },

  // Business Prompts
  {
    id: 'meeting-agenda',
    title: 'Meeting Agenda',
    description: 'Create a structured meeting agenda',
    category: 'business',
    userPrompt: 'Create a meeting agenda for a [type] meeting with [participants] lasting [duration].',
    aiResponse: '# Meeting Agenda\n**Date:** [Date]\n**Duration:** [Time]\n**Attendees:** [List]\n\n## Agenda Items\n\n1. **Welcome & Introductions** (5 min)\n2. **Review Previous Action Items** (10 min)\n3. **Main Discussion: [Topic]** (30 min)\n4. **Next Steps & Action Items** (10 min)\n5. **Q&A / Open Discussion** (5 min)\n\n## Pre-Meeting Materials\n- [Document 1]\n- [Document 2]',
  },
  {
    id: 'project-plan',
    title: 'Project Plan',
    description: 'Outline a project plan structure',
    category: 'business',
    systemPrompt: 'You are an experienced project manager creating actionable project plans.',
    userPrompt: 'Create a project plan for [project] with key milestones and deliverables.',
    aiResponse: '# Project Plan: [Project Name]\n\n## Overview\n- **Objective**: [Goal]\n- **Timeline**: [Duration]\n- **Team**: [Members]\n\n## Milestones\n1. **Phase 1: Planning** (Week 1-2)\n   - Deliverable: Project charter\n2. **Phase 2: Development** (Week 3-6)\n   - Deliverable: MVP\n3. **Phase 3: Launch** (Week 7-8)\n   - Deliverable: Final release',
  },

  // Education Prompts
  {
    id: 'explain-concept',
    title: 'Explain Like I\'m 5',
    description: 'Get a simple explanation of complex topics',
    category: 'education',
    systemPrompt: 'You explain complex topics in simple terms that anyone can understand.',
    userPrompt: 'Explain [complex topic] in simple terms that a beginner would understand.',
    aiResponse: 'Let me explain this simply:\n\nImagine you have a box of Legos. [Topic] is like...\n\n**The basic idea**: Think of it as...\n\n**Why it matters**: Just like how...\n\n**Real example**: It\'s similar to when you...',
  },
  {
    id: 'quiz-generator',
    title: 'Quiz Questions',
    description: 'Generate quiz questions on a topic',
    category: 'education',
    userPrompt: 'Create 5 quiz questions about [topic] with varying difficulty levels.',
    aiResponse: '# Quiz: [Topic]\n\n**Easy:**\n1. What is...?\n\n**Medium:**\n2. Explain the difference between...\n3. How does X relate to Y?\n\n**Hard:**\n4. Analyze the following scenario...\n5. Compare and contrast...',
  },
  {
    id: 'study-guide',
    title: 'Study Guide',
    description: 'Create a comprehensive study guide',
    category: 'education',
    systemPrompt: 'You are an expert tutor who creates effective study materials.',
    userPrompt: 'Create a study guide for [subject/topic] covering the key concepts.',
    aiResponse: '# Study Guide: [Topic]\n\n## Key Concepts\n1. **Concept 1**: Definition and explanation\n2. **Concept 2**: Definition and explanation\n\n## Important Terms\n- **Term A**: Meaning\n- **Term B**: Meaning\n\n## Practice Questions\n1. Question 1\n2. Question 2\n\n## Summary\nRemember these key points...',
  },
];

const categories: { id: PromptTemplate['category']; name: string; icon: string }[] = [
  { id: 'coding', name: 'Coding', icon: '💻' },
  { id: 'writing', name: 'Writing', icon: '✍️' },
  { id: 'analysis', name: 'Analysis', icon: '📊' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'education', name: 'Education', icon: '📚' },
];

type PromptLibraryProps = {
  onSelectPrompt: (prompt: PromptTemplate) => void;
  onClose: () => void;
};

export function PromptLibrary({ onSelectPrompt, onClose }: PromptLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<PromptTemplate['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = useMemo(() => {
    let prompts = promptTemplates;

    // Filter by category
    if (selectedCategory !== 'all') {
      prompts = prompts.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      prompts = prompts.filter(
        p =>
          p.title.toLowerCase().includes(query)
          || p.description.toLowerCase().includes(query)
          || p.userPrompt.toLowerCase().includes(query),
      );
    }

    return prompts;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Prompt Library</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a template to get started quickly
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Grid */}
        <div className="max-h-[50vh] overflow-y-auto p-6">
          {filteredPrompts.length === 0
            ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No prompts found matching your criteria</p>
                </div>
              )
            : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredPrompts.map(prompt => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => onSelectPrompt(prompt)}
                      className="group rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-600 dark:hover:border-blue-500"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                          {prompt.title}
                        </h3>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                          {categories.find(c => c.id === prompt.category)?.icon}
                          {' '}
                          {categories.find(c => c.id === prompt.category)?.name}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                        {prompt.description}
                      </p>
                      <div className="rounded border border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
                        <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                          {prompt.userPrompt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <p className="text-center text-xs text-gray-400">
            {filteredPrompts.length}
            {' '}
            prompt
            {filteredPrompts.length !== 1 ? 's' : ''}
            {' '}
            available
          </p>
        </div>
      </div>
    </div>
  );
}
