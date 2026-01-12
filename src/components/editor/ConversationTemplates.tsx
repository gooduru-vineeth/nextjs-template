'use client';

import type { ChatMessage, Participant } from '@/types/Mockup';
import { useState } from 'react';

export type ConversationTemplate = {
  id: string;
  name: string;
  description: string;
  category: 'customer-support' | 'sales' | 'team-collaboration' | 'social' | 'other';
  participants: Participant[];
  messages: Omit<ChatMessage, 'id'>[];
};

// Pre-defined conversation templates
export const conversationTemplates: ConversationTemplate[] = [
  // Customer Support Templates
  {
    id: 'support-order-inquiry',
    name: 'Order Status Inquiry',
    description: 'Customer asking about their order status',
    category: 'customer-support',
    participants: [
      { id: 'user', name: 'Customer', isOnline: true },
      { id: 'support', name: 'Support Agent', isOnline: true, role: 'admin' },
    ],
    messages: [
      {
        senderId: 'user',
        content: 'Hi, I placed an order 3 days ago but haven\'t received any shipping updates. My order number is #12345.',
        timestamp: '10:30 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'Hello! Thank you for reaching out. I\'d be happy to help you track your order. Let me look that up for you right away.',
        timestamp: '10:31 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'I found your order #12345. It was shipped yesterday and is currently in transit. You should receive it within 2-3 business days. Here\'s your tracking number: TRK789456123',
        timestamp: '10:33 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'Thank you so much! That\'s really helpful.',
        timestamp: '10:34 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'You\'re welcome! Is there anything else I can help you with today?',
        timestamp: '10:35 AM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'support-refund-request',
    name: 'Refund Request',
    description: 'Customer requesting a refund for a product',
    category: 'customer-support',
    participants: [
      { id: 'user', name: 'Customer', isOnline: true },
      { id: 'support', name: 'Sarah (Support)', isOnline: true, role: 'admin' },
    ],
    messages: [
      {
        senderId: 'user',
        content: 'I need to return an item I bought last week. It doesn\'t fit properly.',
        timestamp: '2:15 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'I\'m sorry to hear that! I can definitely help you with the return. Could you please provide your order number?',
        timestamp: '2:16 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'Sure, it\'s ORD-2024-5678',
        timestamp: '2:17 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'Perfect! I\'ve initiated the return process for you. You\'ll receive an email with a prepaid shipping label within the next hour. Once we receive the item, your refund will be processed within 3-5 business days.',
        timestamp: '2:19 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'That\'s great, thank you for making this so easy!',
        timestamp: '2:20 PM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'support-technical-issue',
    name: 'Technical Support',
    description: 'Customer experiencing technical difficulties',
    category: 'customer-support',
    participants: [
      { id: 'user', name: 'User', isOnline: true },
      { id: 'support', name: 'Tech Support', isOnline: true, role: 'admin' },
    ],
    messages: [
      {
        senderId: 'user',
        content: 'My app keeps crashing when I try to upload photos. I\'ve tried restarting but it\'s still happening.',
        timestamp: '3:45 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'I\'m sorry you\'re experiencing this issue. Let me help troubleshoot. What device and OS version are you using?',
        timestamp: '3:46 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'iPhone 14 Pro, iOS 17.2',
        timestamp: '3:47 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'support',
        content: 'Thanks for that info. Please try these steps:\n1. Force close the app completely\n2. Go to Settings > General > iPhone Storage\n3. Find our app and tap "Offload App"\n4. Then reinstall from the App Store\n\nThis should resolve the crashing issue.',
        timestamp: '3:49 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'That worked perfectly! Thank you so much!',
        timestamp: '3:55 PM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },

  // Sales Templates
  {
    id: 'sales-product-inquiry',
    name: 'Product Inquiry',
    description: 'Potential customer asking about a product',
    category: 'sales',
    participants: [
      { id: 'user', name: 'Prospect', isOnline: true },
      { id: 'sales', name: 'Sales Rep', isOnline: true, role: 'admin' },
    ],
    messages: [
      {
        senderId: 'user',
        content: 'Hi! I\'m interested in your enterprise plan. Can you tell me more about the features?',
        timestamp: '11:00 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'sales',
        content: 'Hello! Great to hear from you. Our Enterprise plan includes:\n\n- Unlimited users\n- Priority 24/7 support\n- Custom integrations\n- Advanced analytics\n- Dedicated account manager\n\nWould you like to schedule a demo to see these features in action?',
        timestamp: '11:02 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'That sounds interesting! What\'s the pricing like?',
        timestamp: '11:03 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'sales',
        content: 'Our Enterprise pricing is customized based on your team size and needs. Typically it ranges from $99-299/user/month with volume discounts. I\'d love to understand your requirements better to give you an accurate quote.',
        timestamp: '11:05 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'We have about 50 users. Can we schedule that demo for next week?',
        timestamp: '11:07 AM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'sales-follow-up',
    name: 'Sales Follow-up',
    description: 'Following up with a prospect after initial contact',
    category: 'sales',
    participants: [
      { id: 'sales', name: 'Alex (Sales)', isOnline: true, role: 'admin' },
      { id: 'prospect', name: 'John', isOnline: false },
    ],
    messages: [
      {
        senderId: 'sales',
        content: 'Hi John! Hope you had a great weekend. Just following up on our conversation last week about the marketing automation tools. Have you had a chance to review the proposal I sent?',
        timestamp: '9:30 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'prospect',
        content: 'Hi Alex! Yes, I did. The team had some questions about the implementation timeline.',
        timestamp: '10:15 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'sales',
        content: 'Of course! Our typical implementation takes 2-4 weeks depending on complexity. We provide a dedicated implementation specialist and full training for your team. What specific concerns does your team have?',
        timestamp: '10:17 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'prospect',
        content: 'That\'s actually faster than we expected. The main concern is data migration from our current system.',
        timestamp: '10:20 AM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },

  // Team Collaboration Templates
  {
    id: 'team-project-update',
    name: 'Project Update',
    description: 'Team discussing project progress',
    category: 'team-collaboration',
    participants: [
      { id: 'user', name: 'You', isOnline: true },
      { id: 'pm', name: 'Project Manager', isOnline: true, role: 'admin' },
      { id: 'dev', name: 'Developer', isOnline: true },
    ],
    messages: [
      {
        senderId: 'pm',
        content: 'Good morning team! Quick sync - how are we looking for the Friday release?',
        timestamp: '9:00 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'dev',
        content: 'Backend APIs are done and tested. Just waiting on the final UI designs.',
        timestamp: '9:02 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'Design review is scheduled for 2 PM today. Should have everything finalized by EOD.',
        timestamp: '9:03 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'pm',
        content: 'Perfect! Let\'s do a final integration test on Thursday then. I\'ll block time for everyone.',
        timestamp: '9:05 AM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'team-standup',
    name: 'Daily Standup',
    description: 'Team daily standup meeting',
    category: 'team-collaboration',
    participants: [
      { id: 'user', name: 'You', isOnline: true },
      { id: 'member1', name: 'Emily', isOnline: true },
      { id: 'member2', name: 'Mike', isOnline: true },
    ],
    messages: [
      {
        senderId: 'user',
        content: '*Yesterday*: Finished the user authentication flow\n*Today*: Working on profile settings page\n*Blockers*: None',
        timestamp: '9:00 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'member1',
        content: '*Yesterday*: Fixed 3 bugs from QA\n*Today*: Starting on the dashboard charts\n*Blockers*: Need API docs for analytics endpoint',
        timestamp: '9:02 AM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'member2',
        content: '*Yesterday*: Code review and documentation\n*Today*: Implementing push notifications\n*Blockers*: Waiting on Apple developer account approval',
        timestamp: '9:04 AM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },

  // Social Templates
  {
    id: 'social-catch-up',
    name: 'Friend Catch-up',
    description: 'Friends catching up',
    category: 'social',
    participants: [
      { id: 'user', name: 'You', isOnline: true },
      { id: 'friend', name: 'Best Friend', isOnline: true },
    ],
    messages: [
      {
        senderId: 'friend',
        content: 'Hey! Long time no see! How have you been?',
        timestamp: '7:30 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'OMG hi!! I\'ve been good, just super busy with work. How about you?',
        timestamp: '7:32 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'friend',
        content: 'Same here! We should grab coffee this weekend and catch up properly',
        timestamp: '7:33 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'Yes! Saturday afternoon works for me. That new cafe downtown?',
        timestamp: '7:35 PM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'social-group-plans',
    name: 'Group Planning',
    description: 'Friends making weekend plans',
    category: 'social',
    participants: [
      { id: 'user', name: 'You', isOnline: true },
      { id: 'friend1', name: 'Alex', isOnline: true },
      { id: 'friend2', name: 'Sam', isOnline: true },
    ],
    messages: [
      {
        senderId: 'friend1',
        content: 'Anyone free this Saturday? Thinking of a beach day',
        timestamp: '6:00 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'user',
        content: 'I\'m in! What time are you thinking?',
        timestamp: '6:05 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'friend2',
        content: 'Count me in too! Early morning before it gets too hot?',
        timestamp: '6:08 PM',
        type: 'text',
        status: 'read',
      },
      {
        senderId: 'friend1',
        content: 'Perfect! Let\'s meet at 8 AM. I\'ll bring snacks!',
        timestamp: '6:10 PM',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
];

type ConversationTemplatesProps = {
  onSelect: (template: ConversationTemplate) => void;
  onClose: () => void;
};

const categoryLabels: Record<ConversationTemplate['category'], string> = {
  'customer-support': 'Customer Support',
  'sales': 'Sales',
  'team-collaboration': 'Team Collaboration',
  'social': 'Social',
  'other': 'Other',
};

const categoryIcons: Record<ConversationTemplate['category'], string> = {
  'customer-support': '\uD83C\uDFE2',
  'sales': '\uD83D\uDCBC',
  'team-collaboration': '\uD83D\uDC65',
  'social': '\uD83D\uDCAC',
  'other': '\uD83D\uDCDD',
};

export function ConversationTemplates({ onSelect, onClose }: ConversationTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<ConversationTemplate['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = conversationTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = searchQuery === ''
      || template.name.toLowerCase().includes(searchQuery.toLowerCase())
      || template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: Array<ConversationTemplate['category'] | 'all'> = ['all', 'customer-support', 'sales', 'team-collaboration', 'social'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversation Templates</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
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
          placeholder="Search templates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category === 'all' ? 'All' : categoryLabels[category]}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {filteredTemplates.length === 0
          ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">No templates found</p>
              </div>
            )
          : (
              filteredTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelect(template)}
                  className="w-full rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{categoryIcons[template.category]}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-600 dark:text-gray-400">
                          {template.messages.length}
                          {' '}
                          messages
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {template.participants.map((p, idx) => (
                          <span
                            key={p.id}
                            className="flex items-center gap-1 text-xs text-gray-400"
                          >
                            {idx > 0 && <span>&bull;</span>}
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <svg className="size-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))
            )}
      </div>

      <p className="text-xs text-gray-400">
        Click a template to load it. Your current conversation will be replaced.
      </p>
    </div>
  );
}
