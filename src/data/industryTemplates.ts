// Industry-specific template packs for rapid mockup creation
import type { ChatMessage, Participant } from '@/types/Mockup';

export type IndustryTemplate = {
  id: string;
  name: string;
  description: string;
  industry: 'saas' | 'ecommerce' | 'healthcare' | 'education' | 'finance' | 'hospitality' | 'real-estate';
  category: 'customer-support' | 'sales' | 'onboarding' | 'notification' | 'marketing';
  platform: 'whatsapp' | 'imessage' | 'slack' | 'discord' | 'telegram' | 'messenger';
  participants: Participant[];
  messages: Omit<ChatMessage, 'id'>[];
  tags: string[];
};

// Helper to generate participant IDs
const createParticipant = (name: string): Participant => ({
  id: `${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
  name,
  avatarUrl: '',
  isOnline: true,
  isTyping: false,
});

// Helper to create a text message
const createMessage = (
  senderId: string,
  content: string,
  timestamp: string,
  status: 'read' | 'delivered' = 'read',
): Omit<ChatMessage, 'id'> => ({
  senderId,
  content,
  timestamp,
  status,
  type: 'text',
});

export const industryTemplates: IndustryTemplate[] = [
  // SaaS Templates
  {
    id: 'saas-trial-expiry',
    name: 'Trial Expiry Reminder',
    description: 'Remind users about expiring free trial',
    industry: 'saas',
    category: 'notification',
    platform: 'slack',
    participants: [
      createParticipant('ProductBot'),
      createParticipant('Sarah Chen'),
    ],
    messages: [
      createMessage('productbot', 'Hi Sarah! Your free trial of Pro features expires in 3 days. You\'ve created 15 projects and invited 4 team members during your trial.', '10:30 AM'),
      createMessage('sarah-chen', 'Thanks for the reminder! What happens to my projects after the trial?', '10:32 AM'),
      createMessage('productbot', 'Your projects will remain safe! You\'ll just lose access to Pro features like advanced analytics and unlimited exports. Upgrade anytime to keep full access.', '10:32 AM'),
      createMessage('productbot', 'Use code KEEPGOING for 20% off your first year! Valid until trial end.', '10:33 AM'),
    ],
    tags: ['trial', 'conversion', 'retention'],
  },
  {
    id: 'saas-feature-announcement',
    name: 'Feature Announcement',
    description: 'Announce new product features to users',
    industry: 'saas',
    category: 'marketing',
    platform: 'slack',
    participants: [
      createParticipant('Product Updates'),
      createParticipant('Team Member'),
    ],
    messages: [
      createMessage('product-updates', 'New Feature Alert! We just launched AI-powered suggestions. Now you can get smart recommendations while you work.', '9:00 AM'),
      createMessage('team-member', 'This looks amazing! How do I enable it?', '9:15 AM'),
      createMessage('product-updates', 'It\'s already enabled for your workspace! Look for the sparkle icon in your editor. Click it anytime for AI suggestions.', '9:16 AM'),
    ],
    tags: ['feature', 'announcement', 'ai'],
  },
  {
    id: 'saas-onboarding-welcome',
    name: 'Welcome Onboarding',
    description: 'Welcome new users and guide them to first value',
    industry: 'saas',
    category: 'onboarding',
    platform: 'messenger',
    participants: [
      createParticipant('Welcome Bot'),
      createParticipant('New User'),
    ],
    messages: [
      createMessage('welcome-bot', 'Welcome to MockFlow! I\'m here to help you create your first mockup in under 5 minutes.', '2:00 PM'),
      createMessage('new-user', 'Hi! I want to create mockups for my app presentations.', '2:01 PM'),
      createMessage('welcome-bot', 'Perfect choice! Here\'s what we\'ll do:\n\n1. Pick a platform (WhatsApp, iMessage, etc.)\n2. Add your conversation\n3. Export as image\n\nReady to start?', '2:01 PM'),
    ],
    tags: ['onboarding', 'welcome', 'first-time'],
  },

  // E-commerce Templates
  {
    id: 'ecom-order-confirmation',
    name: 'Order Confirmation',
    description: 'Confirm customer order with details',
    industry: 'ecommerce',
    category: 'notification',
    platform: 'whatsapp',
    participants: [
      createParticipant('ShopName'),
      createParticipant('Customer'),
    ],
    messages: [
      createMessage('shopname', 'Order Confirmed! 🎉\n\nOrder #12345\nTotal: $89.99\n\n• Blue Running Shoes (Size 10)\n• White Sports Socks (3-pack)\n\nEstimated delivery: Jan 15-17', '3:45 PM'),
      createMessage('customer', 'Great! Can I change the delivery address?', '3:47 PM'),
      createMessage('shopname', 'Of course! You can update your address within the next 2 hours. Just tap here: [Update Address]\n\nOr reply with your new address and I\'ll update it for you.', '3:48 PM'),
    ],
    tags: ['order', 'confirmation', 'delivery'],
  },
  {
    id: 'ecom-shipping-update',
    name: 'Shipping Update',
    description: 'Update customer on shipping status',
    industry: 'ecommerce',
    category: 'notification',
    platform: 'whatsapp',
    participants: [
      createParticipant('FashionStore'),
      createParticipant('Emily'),
    ],
    messages: [
      createMessage('fashionstore', '📦 Your order is on its way!\n\nTracking: 1Z999AA10123456784\nCarrier: UPS\n\nExpected delivery: Tomorrow by 6 PM', '11:20 AM'),
      createMessage('emily', 'Thanks! Will I need to sign for it?', '11:25 AM'),
      createMessage('fashionstore', 'No signature required! The driver will leave it at your door. We\'ll send you a photo confirmation when delivered.', '11:26 AM'),
    ],
    tags: ['shipping', 'tracking', 'delivery'],
  },
  {
    id: 'ecom-abandoned-cart',
    name: 'Abandoned Cart Recovery',
    description: 'Re-engage customers who left items in cart',
    industry: 'ecommerce',
    category: 'marketing',
    platform: 'messenger',
    participants: [
      createParticipant('StyleShop'),
      createParticipant('Alex'),
    ],
    messages: [
      createMessage('styleshop', 'Hey Alex! You left some great items in your cart. Still thinking about the Vintage Denim Jacket?', '4:30 PM'),
      createMessage('alex', 'Yeah, I wasn\'t sure about the sizing', '5:15 PM'),
      createMessage('styleshop', 'Totally understand! This jacket runs true to size. Most customers order their usual size.\n\nPlus, we have free returns within 30 days - no questions asked!', '5:16 PM'),
      createMessage('styleshop', 'Here\'s 10% off to help you decide: COMEBACK10', '5:16 PM'),
    ],
    tags: ['cart', 'recovery', 'discount'],
  },

  // Healthcare Templates
  {
    id: 'health-appointment-reminder',
    name: 'Appointment Reminder',
    description: 'Remind patients about upcoming appointments',
    industry: 'healthcare',
    category: 'notification',
    platform: 'imessage',
    participants: [
      createParticipant('Dr. Smith Clinic'),
      createParticipant('Patient'),
    ],
    messages: [
      createMessage('dr-smith-clinic', 'Reminder: You have an appointment tomorrow at 2:30 PM with Dr. Smith.\n\n📍 123 Medical Center Dr, Suite 200\n\nPlease arrive 15 minutes early. Reply CONFIRM to confirm or RESCHEDULE to change.', '9:00 AM', 'delivered'),
      createMessage('patient', 'CONFIRM', '9:15 AM'),
      createMessage('dr-smith-clinic', 'Thank you! Your appointment is confirmed. Remember to bring:\n• Photo ID\n• Insurance card\n• List of current medications\n\nSee you tomorrow!', '9:15 AM', 'delivered'),
    ],
    tags: ['appointment', 'healthcare', 'reminder'],
  },
  {
    id: 'health-prescription-ready',
    name: 'Prescription Ready',
    description: 'Notify patient when prescription is ready',
    industry: 'healthcare',
    category: 'notification',
    platform: 'imessage',
    participants: [
      createParticipant('QuickPharmacy'),
      createParticipant('John'),
    ],
    messages: [
      createMessage('quickpharmacy', 'Your prescription is ready! 💊\n\nMedication: Lisinopril 10mg\nRx #: 789456\nPickup location: 456 Main St\n\nOpen until 9 PM today.', '1:30 PM', 'delivered'),
      createMessage('john', 'Can someone else pick it up for me?', '1:45 PM'),
      createMessage('quickpharmacy', 'Yes! They\'ll need to show their ID and know your date of birth for verification. The prescription will be held for 7 days.', '1:46 PM', 'delivered'),
    ],
    tags: ['prescription', 'pharmacy', 'pickup'],
  },

  // Education Templates
  {
    id: 'edu-class-reminder',
    name: 'Class Reminder',
    description: 'Remind students about upcoming classes',
    industry: 'education',
    category: 'notification',
    platform: 'telegram',
    participants: [
      createParticipant('Course Bot'),
      createParticipant('Student'),
    ],
    messages: [
      createMessage('course-bot', '📚 Class Starting Soon!\n\nAdvanced Python Programming\n⏰ Today at 6:00 PM EST\n👨‍🏫 Instructor: Prof. Johnson\n\nJoin link: [Click to Join]', '5:30 PM'),
      createMessage('student', 'Will the recording be available?', '5:35 PM'),
      createMessage('course-bot', 'Yes! All recordings are available in your dashboard within 24 hours. You\'ll also get the slides and code examples.', '5:35 PM'),
    ],
    tags: ['class', 'reminder', 'online-learning'],
  },
  {
    id: 'edu-assignment-due',
    name: 'Assignment Due Reminder',
    description: 'Remind students about upcoming assignment deadlines',
    industry: 'education',
    category: 'notification',
    platform: 'discord',
    participants: [
      createParticipant('ClassBot'),
      createParticipant('Student'),
    ],
    messages: [
      createMessage('classbot', '⚠️ Assignment Due Soon\n\n**Web Development Project**\nDue: Tomorrow at 11:59 PM\nSubmission: Canvas Portal\n\n3 students haven\'t submitted yet. Need an extension? Contact Prof. Lee.', '8:00 PM'),
      createMessage('student', 'I submitted mine yesterday, did it go through?', '8:05 PM'),
      createMessage('classbot', 'Let me check... ✅ Yes! Your submission was received on Jan 10 at 3:45 PM. You\'re all set!', '8:05 PM'),
    ],
    tags: ['assignment', 'deadline', 'submission'],
  },

  // Finance Templates
  {
    id: 'finance-payment-received',
    name: 'Payment Received',
    description: 'Confirm payment receipt to customers',
    industry: 'finance',
    category: 'notification',
    platform: 'whatsapp',
    participants: [
      createParticipant('SecureBank'),
      createParticipant('Customer'),
    ],
    messages: [
      createMessage('securebank', '✅ Payment Received\n\nAmount: $500.00\nTo: Credit Card ****4521\nDate: Jan 11, 2026\nRef: PAY789456\n\nNew balance: $1,234.56', '2:15 PM'),
      createMessage('customer', 'When will this reflect in my available credit?', '2:20 PM'),
      createMessage('securebank', 'Your available credit has been updated immediately! You now have $3,765.44 available. The payment will appear on your next statement.', '2:21 PM'),
    ],
    tags: ['payment', 'banking', 'confirmation'],
  },
  {
    id: 'finance-fraud-alert',
    name: 'Fraud Alert',
    description: 'Alert customers about suspicious activity',
    industry: 'finance',
    category: 'notification',
    platform: 'imessage',
    participants: [
      createParticipant('Bank Security'),
      createParticipant('Account Holder'),
    ],
    messages: [
      createMessage('bank-security', '🔴 Security Alert\n\nWe detected unusual activity on your card ****7890:\n\n$899.99 at ELECTROMART\nLocation: Miami, FL\n\nWas this you? Reply YES or NO', '6:45 PM'),
      createMessage('account-holder', 'NO', '6:46 PM'),
      createMessage('bank-security', 'Thank you. We\'ve blocked your card and reversed the charge. A new card will arrive in 3-5 business days.\n\nNeed immediate access? Call us at 1-800-XXX-XXXX for a virtual card.', '6:46 PM'),
    ],
    tags: ['security', 'fraud', 'alert'],
  },

  // Hospitality Templates
  {
    id: 'hotel-booking-confirm',
    name: 'Booking Confirmation',
    description: 'Confirm hotel reservation details',
    industry: 'hospitality',
    category: 'notification',
    platform: 'whatsapp',
    participants: [
      createParticipant('Grand Hotel'),
      createParticipant('Guest'),
    ],
    messages: [
      createMessage('grand-hotel', '🏨 Booking Confirmed!\n\nGuest: Michael Brown\nConfirmation: GH789456\nCheck-in: Jan 20, 2026 (3 PM)\nCheck-out: Jan 23, 2026 (11 AM)\nRoom: Deluxe King, Ocean View\n\nWe look forward to welcoming you!', '11:00 AM'),
      createMessage('guest', 'Can I request early check-in?', '11:15 AM'),
      createMessage('grand-hotel', 'We\'ll do our best! Early check-in is subject to availability. We\'ll notify you by 12 PM on your arrival day.\n\nWould you like to guarantee early check-in for $50?', '11:16 AM'),
    ],
    tags: ['booking', 'hotel', 'reservation'],
  },
  {
    id: 'restaurant-reservation',
    name: 'Restaurant Reservation',
    description: 'Confirm table reservation at restaurant',
    industry: 'hospitality',
    category: 'notification',
    platform: 'imessage',
    participants: [
      createParticipant('Bella Italia'),
      createParticipant('Diner'),
    ],
    messages: [
      createMessage('bella-italia', 'Table Reserved! 🍝\n\nParty of 4\nDate: Friday, Jan 17\nTime: 7:30 PM\nSpecial request: Window seat\n\nReply CANCEL to cancel or MODIFY to change.', '4:00 PM', 'delivered'),
      createMessage('diner', 'Can we change to 8:00 PM?', '4:30 PM'),
      createMessage('bella-italia', 'Done! Your reservation is now for 8:00 PM on Friday. Same window table. See you then! 🇮🇹', '4:31 PM', 'delivered'),
    ],
    tags: ['restaurant', 'reservation', 'dining'],
  },

  // Real Estate Templates
  {
    id: 'realestate-viewing-scheduled',
    name: 'Viewing Scheduled',
    description: 'Confirm property viewing appointment',
    industry: 'real-estate',
    category: 'notification',
    platform: 'whatsapp',
    participants: [
      createParticipant('Agent Lisa'),
      createParticipant('Buyer'),
    ],
    messages: [
      createMessage('agent-lisa', 'Hi! Your viewing is confirmed:\n\n🏠 123 Oak Street, Unit 4B\n📅 Saturday, Jan 18 at 2:00 PM\n\nI\'ll meet you at the lobby. The building has visitor parking on level P1.', '10:00 AM'),
      createMessage('buyer', 'Thanks! Is it okay to bring my parents?', '10:30 AM'),
      createMessage('agent-lisa', 'Absolutely! The more the merrier. I\'ll bring extra info packets. Also, here are some photos of the unit: [View Gallery]\n\nSee you Saturday!', '10:31 AM'),
    ],
    tags: ['viewing', 'property', 'appointment'],
  },
  {
    id: 'realestate-offer-update',
    name: 'Offer Update',
    description: 'Update buyer on offer status',
    industry: 'real-estate',
    category: 'notification',
    platform: 'imessage',
    participants: [
      createParticipant('Realtor Mark'),
      createParticipant('Client'),
    ],
    messages: [
      createMessage('realtor-mark', 'Great news! The seller has responded to your offer on 456 Maple Ave.\n\nThey\'ve countered at $485,000 (you offered $475,000). They\'re flexible on the closing date.', '3:45 PM'),
      createMessage('client', 'That\'s only $10k more. Can we meet in the middle at $480k?', '3:50 PM'),
      createMessage('realtor-mark', 'Smart thinking! I\'ll submit a counter-offer at $480,000 right now. I\'ll also request they include the washer/dryer. Will update you as soon as I hear back!', '3:51 PM'),
    ],
    tags: ['offer', 'negotiation', 'real-estate'],
  },
];

// Group templates by industry
export function getTemplatesByIndustry(industry: IndustryTemplate['industry']): IndustryTemplate[] {
  return industryTemplates.filter(t => t.industry === industry);
}

// Group templates by category
export function getTemplatesByCategory(category: IndustryTemplate['category']): IndustryTemplate[] {
  return industryTemplates.filter(t => t.category === category);
}

// Search templates
export function searchTemplates(query: string): IndustryTemplate[] {
  const lowerQuery = query.toLowerCase();
  return industryTemplates.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery)
      || t.description.toLowerCase().includes(lowerQuery)
      || t.tags.some(tag => tag.toLowerCase().includes(lowerQuery)),
  );
}

// Get all unique industries
export function getIndustries(): { id: IndustryTemplate['industry']; name: string; count: number }[] {
  const industries: Record<IndustryTemplate['industry'], string> = {
    'saas': 'SaaS & Software',
    'ecommerce': 'E-commerce',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'finance': 'Finance & Banking',
    'hospitality': 'Hospitality',
    'real-estate': 'Real Estate',
  };

  return Object.entries(industries).map(([id, name]) => ({
    id: id as IndustryTemplate['industry'],
    name,
    count: industryTemplates.filter(t => t.industry === id).length,
  }));
}
