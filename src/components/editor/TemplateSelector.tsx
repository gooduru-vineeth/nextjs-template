'use client';

import type { ChatAppearance, ChatMockupData } from '@/types/Mockup';
import { useState } from 'react';

type TemplateSelectorProps = {
  onSelect: (data: ChatMockupData, appearance: ChatAppearance) => void;
  onClose: () => void;
};

type Template = {
  id: string;
  name: string;
  description: string;
  category: 'customer-support' | 'team-collaboration' | 'social' | 'e-commerce' | 'casual';
  icon: string;
  data: ChatMockupData;
  appearance: ChatAppearance;
};

const defaultAppearance: ChatAppearance = {
  theme: 'light',
  showTimestamps: true,
  showAvatars: true,
  showStatus: true,
  fontSize: 'medium',
};

const templates: Template[] = [
  {
    id: 'customer-support-basic',
    name: 'Customer Support Chat',
    description: 'A typical support conversation with greeting and resolution',
    category: 'customer-support',
    icon: '🎧',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'customer', name: 'Customer', isOnline: true },
        { id: 'support', name: 'Support Agent', isOnline: true, role: 'admin' },
      ],
      messages: [
        { id: '1', senderId: 'customer', content: 'Hi, I\'m having trouble with my order #12345', timestamp: '2:30 PM', status: 'read', type: 'text' },
        { id: '2', senderId: 'support', content: 'Hello! I\'d be happy to help you with that. Let me look up your order.', timestamp: '2:31 PM', status: 'read', type: 'text' },
        { id: '3', senderId: 'support', content: 'I found your order. It looks like there was a shipping delay. Your package is now on its way and should arrive by tomorrow.', timestamp: '2:32 PM', status: 'read', type: 'text' },
        { id: '4', senderId: 'customer', content: 'Oh great, thank you so much for checking!', timestamp: '2:33 PM', status: 'read', type: 'text' },
        { id: '5', senderId: 'support', content: 'You\'re welcome! Is there anything else I can help you with today?', timestamp: '2:33 PM', status: 'delivered', type: 'text' },
      ],
      isGroup: false,
      lastSeen: 'Online',
    },
  },
  {
    id: 'team-standup',
    name: 'Team Standup',
    description: 'A quick team standup conversation in a group chat',
    category: 'team-collaboration',
    icon: '👥',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'you', name: 'You', isOnline: true },
        { id: 'sarah', name: 'Sarah', isOnline: true },
        { id: 'mike', name: 'Mike', isOnline: true },
        { id: 'alex', name: 'Alex', isOnline: false },
      ],
      messages: [
        { id: '1', senderId: 'sarah', content: 'Good morning team! Let\'s do a quick standup. I\'ll start - finished the API integration yesterday, working on testing today.', timestamp: '9:00 AM', status: 'read', type: 'text' },
        { id: '2', senderId: 'mike', content: 'Morning! I reviewed the PRs yesterday. Today I\'m focusing on the dashboard redesign.', timestamp: '9:01 AM', status: 'read', type: 'text' },
        { id: '3', senderId: 'you', content: 'Hey everyone! Wrapped up the database migration. Will be pairing with Alex on the new feature today.', timestamp: '9:02 AM', status: 'read', type: 'text' },
        { id: '4', senderId: 'alex', content: 'Sorry I\'m late! Had a doctor\'s appointment. Ready to dive in now.', timestamp: '9:15 AM', status: 'read', type: 'text' },
        { id: '5', senderId: 'sarah', content: 'No worries! Let\'s sync up after lunch for a design review.', timestamp: '9:16 AM', status: 'delivered', type: 'text' },
      ],
      isGroup: true,
      chatName: 'Engineering Team',
      lastSeen: '4 members',
    },
  },
  {
    id: 'product-inquiry',
    name: 'Product Inquiry',
    description: 'E-commerce product question and recommendation',
    category: 'e-commerce',
    icon: '🛍️',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'customer', name: 'Customer', isOnline: true },
        { id: 'shop', name: 'Shop Assistant', isOnline: true, role: 'admin' },
      ],
      messages: [
        { id: '1', senderId: 'customer', content: 'Hi! I\'m looking for a birthday gift for my mom. She loves gardening. Any suggestions?', timestamp: '3:45 PM', status: 'read', type: 'text' },
        { id: '2', senderId: 'shop', content: 'Hi there! 🌸 We have some lovely options! How about our premium garden tool set? It includes ergonomic tools perfect for gardening enthusiasts.', timestamp: '3:46 PM', status: 'read', type: 'text' },
        { id: '3', senderId: 'shop', content: '📷 Garden Tool Set - $49.99', timestamp: '3:46 PM', status: 'read', type: 'image' },
        { id: '4', senderId: 'customer', content: 'That looks perfect! Do you offer gift wrapping?', timestamp: '3:47 PM', status: 'read', type: 'text' },
        { id: '5', senderId: 'shop', content: 'Yes, we do! 🎁 Free gift wrapping with a personalized card. Would you like me to add that to your order?', timestamp: '3:48 PM', status: 'delivered', type: 'text' },
      ],
      isGroup: false,
      lastSeen: 'Online',
    },
  },
  {
    id: 'friend-chat',
    name: 'Casual Friend Chat',
    description: 'A friendly conversation about weekend plans',
    category: 'casual',
    icon: '😊',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'you', name: 'You', isOnline: true },
        { id: 'friend', name: 'Best Friend', isOnline: true },
      ],
      messages: [
        { id: '1', senderId: 'friend', content: 'Hey! What are you up to this weekend?', timestamp: '7:30 PM', status: 'read', type: 'text' },
        { id: '2', senderId: 'you', content: 'Not much planned yet. Why, what\'s up?', timestamp: '7:31 PM', status: 'read', type: 'text' },
        { id: '3', senderId: 'friend', content: 'There\'s this new restaurant downtown that just opened. Want to check it out Saturday? 🍕', timestamp: '7:32 PM', status: 'read', type: 'text' },
        { id: '4', senderId: 'you', content: 'Ooh yes! I\'ve been wanting to try that place. What time?', timestamp: '7:33 PM', status: 'read', type: 'text' },
        { id: '5', senderId: 'friend', content: 'How about 7pm? I\'ll make a reservation', timestamp: '7:34 PM', status: 'read', type: 'text' },
        { id: '6', senderId: 'you', content: 'Perfect! See you then 🎉', timestamp: '7:35 PM', status: 'delivered', type: 'text' },
      ],
      isGroup: false,
      lastSeen: 'last seen today at 7:35 PM',
    },
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking',
    description: 'Healthcare or service appointment scheduling',
    category: 'customer-support',
    icon: '📅',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'patient', name: 'Patient', isOnline: true },
        { id: 'clinic', name: 'Clinic Reception', isOnline: true, role: 'admin' },
      ],
      messages: [
        { id: '1', senderId: 'patient', content: 'Hi, I\'d like to book an appointment with Dr. Smith please.', timestamp: '10:00 AM', status: 'read', type: 'text' },
        { id: '2', senderId: 'clinic', content: 'Good morning! Let me check Dr. Smith\'s availability. Are you looking for this week or next week?', timestamp: '10:01 AM', status: 'read', type: 'text' },
        { id: '3', senderId: 'patient', content: 'This week if possible, preferably Wednesday or Thursday afternoon.', timestamp: '10:02 AM', status: 'read', type: 'text' },
        { id: '4', senderId: 'clinic', content: 'I have an opening on Thursday at 3:30 PM. Would that work for you?', timestamp: '10:03 AM', status: 'read', type: 'text' },
        { id: '5', senderId: 'patient', content: 'That\'s perfect! Please book it.', timestamp: '10:04 AM', status: 'read', type: 'text' },
        { id: '6', senderId: 'clinic', content: '✅ Done! Your appointment is confirmed for Thursday at 3:30 PM. We\'ll send you a reminder the day before.', timestamp: '10:05 AM', status: 'delivered', type: 'text' },
      ],
      isGroup: false,
      lastSeen: 'Online',
    },
  },
  {
    id: 'project-discussion',
    name: 'Project Discussion',
    description: 'Team discussing project updates and blockers',
    category: 'team-collaboration',
    icon: '📊',
    appearance: { ...defaultAppearance, theme: 'dark' },
    data: {
      participants: [
        { id: 'pm', name: 'Project Manager', isOnline: true, role: 'admin' },
        { id: 'dev', name: 'Developer', isOnline: true },
        { id: 'designer', name: 'Designer', isOnline: true },
      ],
      messages: [
        { id: '1', senderId: 'pm', content: 'Quick update on the Q4 launch - we need to finalize the landing page by Friday.', timestamp: '2:00 PM', status: 'read', type: 'text' },
        { id: '2', senderId: 'designer', content: 'I\'ve completed the mockups. Will share in Figma by EOD.', timestamp: '2:01 PM', status: 'read', type: 'text' },
        { id: '3', senderId: 'dev', content: 'Great! I can start implementation tomorrow then. Any specific animations needed?', timestamp: '2:02 PM', status: 'read', type: 'text' },
        { id: '4', senderId: 'designer', content: 'Yes, I\'ve added interaction notes. Mostly subtle hover states and a hero section animation.', timestamp: '2:03 PM', status: 'read', type: 'text' },
        { id: '5', senderId: 'pm', content: 'Perfect! Let\'s aim for a review meeting Thursday morning. I\'ll send out the invite. 📩', timestamp: '2:04 PM', status: 'delivered', type: 'text' },
      ],
      isGroup: true,
      chatName: 'Q4 Launch Team',
      lastSeen: '3 members',
    },
  },
  {
    id: 'order-tracking',
    name: 'Order Tracking',
    description: 'Customer checking order status',
    category: 'e-commerce',
    icon: '📦',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'customer', name: 'Customer', isOnline: true },
        { id: 'bot', name: 'OrderBot', isOnline: true, role: 'bot' },
      ],
      messages: [
        { id: '1', senderId: 'customer', content: 'Track my order #ORD-78945', timestamp: '11:20 AM', status: 'read', type: 'text' },
        { id: '2', senderId: 'bot', content: '📦 Order #ORD-78945 Status:\n\n✅ Order Confirmed\n✅ Processing\n✅ Shipped\n⏳ Out for Delivery\n\nEstimated arrival: Today by 5 PM', timestamp: '11:20 AM', status: 'read', type: 'text' },
        { id: '3', senderId: 'customer', content: 'Great! Can I change the delivery address?', timestamp: '11:21 AM', status: 'read', type: 'text' },
        { id: '4', senderId: 'bot', content: 'I\'m sorry, but the order is already out for delivery and cannot be redirected. Would you like to contact the driver directly?', timestamp: '11:21 AM', status: 'read', type: 'text' },
        { id: '5', senderId: 'customer', content: 'No that\'s okay, I\'ll be home. Thanks!', timestamp: '11:22 AM', status: 'delivered', type: 'text' },
      ],
      isGroup: false,
      lastSeen: 'Always online',
    },
  },
  {
    id: 'social-collab',
    name: 'Content Collaboration',
    description: 'Social media team planning content',
    category: 'social',
    icon: '📱',
    appearance: defaultAppearance,
    data: {
      participants: [
        { id: 'you', name: 'You', isOnline: true },
        { id: 'content', name: 'Content Lead', isOnline: true },
      ],
      messages: [
        { id: '1', senderId: 'content', content: 'The new product photos look amazing! Ready to schedule the posts?', timestamp: '4:00 PM', status: 'read', type: 'text' },
        { id: '2', senderId: 'you', content: 'Yes! I was thinking Tuesday at 10 AM for Instagram and LinkedIn at noon.', timestamp: '4:01 PM', status: 'read', type: 'text' },
        { id: '3', senderId: 'content', content: 'Perfect timing. Did you write the captions?', timestamp: '4:02 PM', status: 'read', type: 'text' },
        { id: '4', senderId: 'you', content: 'Yep! "Introducing our latest innovation. Built for tomorrow, available today. 🚀 #Innovation #Launch"', timestamp: '4:03 PM', status: 'read', type: 'text' },
        { id: '5', senderId: 'content', content: 'Love it! ✨ Let\'s also do a behind-the-scenes story to build engagement.', timestamp: '4:04 PM', status: 'delivered', type: 'text' },
      ],
      isGroup: false,
      lastSeen: 'Online',
    },
  },
];

const categories = [
  { id: 'all', name: 'All', icon: '📋' },
  { id: 'customer-support', name: 'Support', icon: '🎧' },
  { id: 'team-collaboration', name: 'Team', icon: '👥' },
  { id: 'e-commerce', name: 'E-commerce', icon: '🛍️' },
  { id: 'social', name: 'Social', icon: '📱' },
  { id: 'casual', name: 'Casual', icon: '😊' },
];

export function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
      || template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose a Template</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start with a pre-made conversation template</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="border-b border-gray-200 px-6 py-3 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category filters */}
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
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
        </div>

        {/* Template Grid */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No templates found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelect(template.data, template.appearance)}
                  className="group flex flex-col rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:hover:border-blue-500"
                >
                  {/* Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {template.data.messages.length}
                          {' '}
                          messages
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      template.appearance.theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    >
                      {template.appearance.theme}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{template.description}</p>

                  {/* Preview */}
                  <div className="flex-1 space-y-1.5 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    {template.data.messages.slice(0, 3).map((msg, idx) => {
                      const sender = template.data.participants.find(p => p.id === msg.senderId);
                      const isFirst = idx === 0 || template.data.messages[idx - 1]?.senderId !== msg.senderId;
                      return (
                        <div key={msg.id} className="flex items-start gap-2">
                          {isFirst && (
                            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                              {sender?.name.charAt(0)}
                            </div>
                          )}
                          {!isFirst && <div className="size-5" />}
                          <p className="line-clamp-1 flex-1 text-xs text-gray-700 dark:text-gray-300">
                            {msg.content}
                          </p>
                        </div>
                      );
                    })}
                    {template.data.messages.length > 3 && (
                      <p className="text-center text-[10px] text-gray-400">
                        +
                        {template.data.messages.length - 3}
                        {' '}
                        more messages
                      </p>
                    )}
                  </div>

                  {/* Use button (appears on hover) */}
                  <div className="mt-3 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
                      Use Template
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTemplates.length}
            {' '}
            template
            {filteredTemplates.length !== 1 ? 's' : ''}
            {' '}
            available
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}
