'use client';

import {
  Award,
  Car,
  Check,
  ChevronRight,
  Clock,
  Code,
  DollarSign,
  Download,
  Dumbbell,
  ExternalLink,
  Eye,
  Film,
  GraduationCap,
  Grid3X3,
  Heart,
  Home,
  Layers,
  LayoutList,
  Plane,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Stethoscope,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// Types
export type IndustryCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  templateCount: number;
  color: string;
};

export type IndustryTemplate = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  industry: string;
  type: 'website' | 'mobile' | 'dashboard' | 'landing' | 'app';
  tags: string[];
  features: string[];
  screens: number;
  components: number;
  rating: number;
  reviews: number;
  downloads: number;
  isPremium: boolean;
  isNew: boolean;
  isFeatured: boolean;
  price?: number;
  previewUrl?: string;
  lastUpdated: Date;
};

export type IndustryTemplatesProps = {
  variant?: 'full' | 'grid' | 'carousel';
  categories?: IndustryCategory[];
  templates?: IndustryTemplate[];
  onTemplateSelect?: (template: IndustryTemplate) => void;
  onPreview?: (template: IndustryTemplate) => void;
  onCategorySelect?: (category: IndustryCategory) => void;
  className?: string;
};

// Default industries data
const defaultIndustries: IndustryCategory[] = [
  { id: 'technology', name: 'Technology', icon: <Code className="h-5 w-5" />, description: 'SaaS, software, and tech products', templateCount: 48, color: 'bg-blue-500' },
  { id: 'healthcare', name: 'Healthcare', icon: <Stethoscope className="h-5 w-5" />, description: 'Medical, wellness, and health services', templateCount: 32, color: 'bg-emerald-500' },
  { id: 'education', name: 'Education', icon: <GraduationCap className="h-5 w-5" />, description: 'Schools, courses, and e-learning', templateCount: 28, color: 'bg-purple-500' },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="h-5 w-5" />, description: 'Online stores and marketplaces', templateCount: 56, color: 'bg-orange-500' },
  { id: 'travel', name: 'Travel', icon: <Plane className="h-5 w-5" />, description: 'Tourism, booking, and hospitality', templateCount: 24, color: 'bg-cyan-500' },
  { id: 'restaurant', name: 'Food & Dining', icon: <Utensils className="h-5 w-5" />, description: 'Restaurants, cafes, and food delivery', templateCount: 36, color: 'bg-red-500' },
  { id: 'automotive', name: 'Automotive', icon: <Car className="h-5 w-5" />, description: 'Car dealerships and automotive services', templateCount: 18, color: 'bg-gray-500' },
  { id: 'realestate', name: 'Real Estate', icon: <Home className="h-5 w-5" />, description: 'Property listings and real estate agencies', templateCount: 22, color: 'bg-amber-500' },
  { id: 'finance', name: 'Finance', icon: <DollarSign className="h-5 w-5" />, description: 'Banking, fintech, and financial services', templateCount: 38, color: 'bg-green-500' },
  { id: 'entertainment', name: 'Entertainment', icon: <Film className="h-5 w-5" />, description: 'Media, streaming, and entertainment', templateCount: 26, color: 'bg-pink-500' },
  { id: 'fitness', name: 'Fitness', icon: <Dumbbell className="h-5 w-5" />, description: 'Gyms, fitness apps, and wellness', templateCount: 20, color: 'bg-lime-500' },
  { id: 'nonprofit', name: 'Non-profit', icon: <Heart className="h-5 w-5" />, description: 'Charities and organizations', templateCount: 16, color: 'bg-rose-500' },
];

// Mock templates data
const generateMockTemplates = (): IndustryTemplate[] => [
  {
    id: '1',
    name: 'SaaS Dashboard Pro',
    description: 'Complete dashboard template for SaaS products with analytics, user management, and billing features',
    thumbnail: '/templates/saas-dashboard.jpg',
    industry: 'technology',
    type: 'dashboard',
    tags: ['dashboard', 'analytics', 'saas', 'admin'],
    features: ['Dark mode support', 'Real-time analytics', 'User management', 'Billing integration', 'API documentation'],
    screens: 24,
    components: 85,
    rating: 4.9,
    reviews: 128,
    downloads: 3420,
    isPremium: true,
    isNew: false,
    isFeatured: true,
    price: 79,
    lastUpdated: new Date('2024-02-15'),
  },
  {
    id: '2',
    name: 'HealthCare Patient Portal',
    description: 'Modern patient portal for healthcare providers with appointment booking and medical records',
    thumbnail: '/templates/healthcare-portal.jpg',
    industry: 'healthcare',
    type: 'app',
    tags: ['healthcare', 'medical', 'patient', 'appointments'],
    features: ['Appointment scheduling', 'Medical records', 'Prescription management', 'Video consultations', 'Insurance integration'],
    screens: 18,
    components: 62,
    rating: 4.8,
    reviews: 86,
    downloads: 1890,
    isPremium: true,
    isNew: true,
    isFeatured: true,
    price: 89,
    lastUpdated: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'E-Learning Platform',
    description: 'Comprehensive e-learning platform with course management, quizzes, and progress tracking',
    thumbnail: '/templates/elearning.jpg',
    industry: 'education',
    type: 'website',
    tags: ['education', 'courses', 'learning', 'lms'],
    features: ['Course catalog', 'Video lessons', 'Quiz system', 'Progress tracking', 'Certificates'],
    screens: 22,
    components: 74,
    rating: 4.7,
    reviews: 94,
    downloads: 2156,
    isPremium: false,
    isNew: false,
    isFeatured: true,
    lastUpdated: new Date('2024-02-10'),
  },
  {
    id: '4',
    name: 'Fashion E-commerce Store',
    description: 'Stylish e-commerce template for fashion brands with lookbook and wishlist features',
    thumbnail: '/templates/fashion-store.jpg',
    industry: 'ecommerce',
    type: 'website',
    tags: ['ecommerce', 'fashion', 'store', 'shopping'],
    features: ['Product catalog', 'Shopping cart', 'Wishlist', 'Size guide', 'Lookbook'],
    screens: 28,
    components: 96,
    rating: 4.9,
    reviews: 156,
    downloads: 4280,
    isPremium: true,
    isNew: false,
    isFeatured: true,
    price: 69,
    lastUpdated: new Date('2024-02-18'),
  },
  {
    id: '5',
    name: 'Travel Booking App',
    description: 'Mobile-first travel booking app with flight search, hotel booking, and trip planning',
    thumbnail: '/templates/travel-app.jpg',
    industry: 'travel',
    type: 'mobile',
    tags: ['travel', 'booking', 'flights', 'hotels'],
    features: ['Flight search', 'Hotel booking', 'Trip planner', 'Reviews', 'Itinerary'],
    screens: 16,
    components: 52,
    rating: 4.6,
    reviews: 72,
    downloads: 1560,
    isPremium: false,
    isNew: true,
    isFeatured: false,
    lastUpdated: new Date('2024-02-22'),
  },
  {
    id: '6',
    name: 'Restaurant Website',
    description: 'Beautiful restaurant website with menu showcase, reservations, and online ordering',
    thumbnail: '/templates/restaurant.jpg',
    industry: 'restaurant',
    type: 'website',
    tags: ['restaurant', 'food', 'menu', 'reservations'],
    features: ['Menu display', 'Online reservations', 'Food ordering', 'Gallery', 'Reviews'],
    screens: 12,
    components: 45,
    rating: 4.8,
    reviews: 108,
    downloads: 2890,
    isPremium: false,
    isNew: false,
    isFeatured: true,
    lastUpdated: new Date('2024-02-05'),
  },
  {
    id: '7',
    name: 'Fintech Banking App',
    description: 'Modern banking app with account management, transfers, and investment tracking',
    thumbnail: '/templates/banking.jpg',
    industry: 'finance',
    type: 'mobile',
    tags: ['fintech', 'banking', 'finance', 'payments'],
    features: ['Account overview', 'Money transfers', 'Bill payments', 'Investment tracking', 'Budgeting'],
    screens: 20,
    components: 68,
    rating: 4.9,
    reviews: 142,
    downloads: 3650,
    isPremium: true,
    isNew: false,
    isFeatured: true,
    price: 99,
    lastUpdated: new Date('2024-02-12'),
  },
  {
    id: '8',
    name: 'Real Estate Listing',
    description: 'Property listing website with advanced search, virtual tours, and agent profiles',
    thumbnail: '/templates/realestate.jpg',
    industry: 'realestate',
    type: 'website',
    tags: ['realestate', 'property', 'listings', 'agents'],
    features: ['Property search', 'Virtual tours', 'Agent profiles', 'Mortgage calculator', 'Saved searches'],
    screens: 14,
    components: 56,
    rating: 4.7,
    reviews: 68,
    downloads: 1420,
    isPremium: true,
    isNew: true,
    isFeatured: false,
    price: 59,
    lastUpdated: new Date('2024-02-19'),
  },
  {
    id: '9',
    name: 'Fitness Tracker App',
    description: 'Comprehensive fitness app with workout plans, nutrition tracking, and progress analytics',
    thumbnail: '/templates/fitness.jpg',
    industry: 'fitness',
    type: 'mobile',
    tags: ['fitness', 'health', 'workout', 'nutrition'],
    features: ['Workout plans', 'Nutrition tracker', 'Progress charts', 'Social features', 'Challenges'],
    screens: 18,
    components: 64,
    rating: 4.8,
    reviews: 98,
    downloads: 2340,
    isPremium: false,
    isNew: false,
    isFeatured: true,
    lastUpdated: new Date('2024-02-08'),
  },
  {
    id: '10',
    name: 'Startup Landing Page',
    description: 'High-converting landing page template for tech startups with pricing and features sections',
    thumbnail: '/templates/startup-landing.jpg',
    industry: 'technology',
    type: 'landing',
    tags: ['landing', 'startup', 'marketing', 'conversion'],
    features: ['Hero section', 'Feature showcase', 'Pricing tables', 'Testimonials', 'CTA sections'],
    screens: 1,
    components: 32,
    rating: 4.9,
    reviews: 186,
    downloads: 5680,
    isPremium: false,
    isNew: false,
    isFeatured: true,
    lastUpdated: new Date('2024-01-28'),
  },
];

// Sub-components
const IndustryCard: React.FC<{
  category: IndustryCategory;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ category, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`relative cursor-pointer rounded-xl border p-6 transition-all ${
      isSelected
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
    }`}
  >
    <div className={`h-12 w-12 rounded-xl ${category.color} mb-4 flex items-center justify-center text-white`}>
      {category.icon}
    </div>
    <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{category.name}</h3>
    <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      <Layers className="mr-1 h-4 w-4" />
      {category.templateCount}
      {' '}
      templates
    </div>
    {isSelected && (
      <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
        <Check className="h-4 w-4 text-white" />
      </div>
    )}
  </div>
);

const TemplateCard: React.FC<{
  template: IndustryTemplate;
  onClick?: () => void;
  onPreview?: () => void;
}> = ({ template, onClick, onPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeColors = {
    website: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    mobile: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    dashboard: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    landing: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    app: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
  };

  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <div className="h-full w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.isNew && (
            <span className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
              <Sparkles className="h-3 w-3" />
              New
            </span>
          )}
          {template.isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">
              <Award className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>

        {/* Price/Free Badge */}
        <div className="absolute top-3 right-3">
          {template.isPremium
            ? (
                <span className="rounded-full bg-purple-500 px-2 py-1 text-xs font-bold text-white">
                  $
                  {template.price}
                </span>
              )
            : (
                <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                  Free
                </span>
              )}
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60">
            <button
              onClick={(e) => {
                e.stopPropagation(); onPreview?.();
              }}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onClick?.();
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              <Zap className="h-4 w-4" />
              Use
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3
              onClick={onClick}
              className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            >
              {template.name}
            </h3>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[template.type]}`}>
              {template.type}
            </span>
          </div>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{template.rating}</span>
          </div>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {template.description}
        </p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              {template.screens}
              {' '}
              screens
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {template.downloads.toLocaleString()}
            </span>
          </div>
          <span className="flex items-center gap-1">
            (
            {template.reviews}
            {' '}
            reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

const TemplateDetailModal: React.FC<{
  template: IndustryTemplate;
  isOpen: boolean;
  onClose: () => void;
  onUse?: () => void;
  onPreview?: () => void;
}> = ({ template, isOpen, onClose, onUse, onPreview }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 dark:bg-gray-700/90"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Preview */}
          <div className="aspect-[16/10] bg-gray-100 lg:w-3/5 dark:bg-gray-900">
            <div className="h-full w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500" />
          </div>

          {/* Details */}
          <div className="overflow-y-auto p-6 lg:w-2/5">
            {/* Badges */}
            <div className="mb-4 flex gap-2">
              {template.isNew && (
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Sparkles className="h-3 w-3" />
                  New
                </span>
              )}
              {template.isFeatured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Award className="h-3 w-3" />
                  Featured
                </span>
              )}
              {template.isPremium
                ? (
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      Premium
                    </span>
                  )
                : (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Free
                    </span>
                  )}
            </div>

            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{template.name}</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">{template.description}</p>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[...Array.from({ length: 5 })].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(template.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{template.rating}</span>
              <span className="text-gray-500 dark:text-gray-400">
                (
                {template.reviews}
                {' '}
                reviews)
              </span>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{template.screens}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Screens</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{template.components}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Components</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700/50">
                <div className="text-xl font-bold text-gray-900 dark:text-white">{template.downloads.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Downloads</div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Features</h4>
              <ul className="space-y-2">
                {template.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    #
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="space-y-3">
              {template.isPremium && (
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    $
                    {template.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">one-time</span>
                </div>
              )}
              <button
                onClick={onUse}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
              >
                <Zap className="h-5 w-5" />
                {template.isPremium ? 'Purchase & Use' : 'Use Template'}
              </button>
              <button
                onClick={onPreview}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ExternalLink className="h-5 w-5" />
                Live Preview
              </button>
            </div>

            {/* Last Updated */}
            <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <Clock className="mr-1 inline-block h-4 w-4" />
              Last updated
              {' '}
              {template.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export const IndustryTemplates: React.FC<IndustryTemplatesProps> = ({
  variant = 'full',
  categories: propCategories,
  templates: propTemplates,
  onTemplateSelect,
  onPreview,
  onCategorySelect,
  className = '',
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    pricing: 'all',
    sortBy: 'popular',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use props or mock data
  const categories = propCategories || defaultIndustries;
  const templates = propTemplates || generateMockTemplates();

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Industry filter
    if (selectedIndustry) {
      filtered = filtered.filter(t => t.industry === selectedIndustry);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query)
        || t.description.toLowerCase().includes(query)
        || t.tags.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Pricing filter
    if (filters.pricing === 'free') {
      filtered = filtered.filter(t => !t.isPremium);
    } else if (filters.pricing === 'premium') {
      filtered = filtered.filter(t => t.isPremium);
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        break;
    }

    return filtered;
  }, [templates, selectedIndustry, searchQuery, filters]);

  const handleCategoryClick = useCallback((category: IndustryCategory) => {
    setSelectedIndustry(selectedIndustry === category.id ? null : category.id);
    onCategorySelect?.(category);
  }, [selectedIndustry, onCategorySelect]);

  // Carousel variant
  if (variant === 'carousel') {
    const featuredTemplates = templates.filter(t => t.isFeatured).slice(0, 6);

    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Industry Templates</h2>
          <button className="flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400">
            View all
            {' '}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4">
          {featuredTemplates.map(template => (
            <div key={template.id} className="w-72 flex-shrink-0">
              <TemplateCard
                template={template}
                onClick={() => onTemplateSelect?.(template)}
                onPreview={() => onPreview?.(template)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Grid variant (templates only)
  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={() => onTemplateSelect?.(template)}
            onPreview={() => onPreview?.(template)}
          />
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industry Templates</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Ready-to-use templates designed for specific industries
        </p>
      </div>

      {/* Industry Categories */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Browse by Industry</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map(category => (
            <IndustryCard
              key={category.id}
              category={category}
              isSelected={selectedIndustry === category.id}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row dark:bg-gray-800/50">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="website">Website</option>
            <option value="mobile">Mobile</option>
            <option value="dashboard">Dashboard</option>
            <option value="landing">Landing Page</option>
            <option value="app">App</option>
          </select>
          <select
            value={filters.pricing}
            onChange={e => setFilters(f => ({ ...f, pricing: e.target.value }))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTemplates.length}
          {' '}
          templates found
          {selectedIndustry && ` in ${categories.find(c => c.id === selectedIndustry)?.name}`}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={() => setSelectedTemplate(template)}
            onPreview={() => onPreview?.(template)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No templates found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search</p>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          isOpen={true}
          onClose={() => setSelectedTemplate(null)}
          onUse={() => {
            onTemplateSelect?.(selectedTemplate);
            setSelectedTemplate(null);
          }}
          onPreview={() => onPreview?.(selectedTemplate)}
        />
      )}
    </div>
  );
};

// Export sub-components
export { IndustryCard, TemplateCard, TemplateDetailModal };

export default IndustryTemplates;
