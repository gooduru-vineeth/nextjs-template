// Brand Kit types for consistent styling across mockups

export type BrandColor = {
  name: string;
  hex: string;
  usage?: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
};

export type BrandFont = {
  name: string;
  family: string;
  weight?: number;
  usage?: 'heading' | 'body' | 'caption';
};

export type BrandLogo = {
  id: string;
  name: string;
  url: string;
  type: 'full' | 'icon' | 'wordmark';
  format: 'png' | 'svg' | 'jpg';
  backgroundColor?: 'light' | 'dark' | 'transparent';
};

export type BrandKit = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;

  // Colors
  colors: BrandColor[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Typography
  fonts: BrandFont[];
  headingFont?: string;
  bodyFont?: string;

  // Logos
  logos: BrandLogo[];

  // Additional styling
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacing?: 'compact' | 'normal' | 'relaxed';

  // Custom CSS
  customCSS?: string;
};

// Pre-defined brand kit templates
export const brandKitTemplates: Partial<BrandKit>[] = [
  {
    name: 'Modern Tech',
    description: 'Clean and modern tech company style',
    colors: [
      { name: 'Primary Blue', hex: '#0066FF', usage: 'primary' },
      { name: 'Dark Gray', hex: '#1F2937', usage: 'text' },
      { name: 'Light Gray', hex: '#F3F4F6', usage: 'background' },
      { name: 'Accent Green', hex: '#10B981', usage: 'accent' },
    ],
    primaryColor: '#0066FF',
    secondaryColor: '#1F2937',
    accentColor: '#10B981',
    fonts: [
      { name: 'Inter', family: 'Inter, sans-serif', usage: 'body' },
      { name: 'Inter Bold', family: 'Inter, sans-serif', weight: 700, usage: 'heading' },
    ],
    borderRadius: 'lg',
    spacing: 'normal',
  },
  {
    name: 'Startup Fresh',
    description: 'Vibrant and energetic startup vibe',
    colors: [
      { name: 'Coral', hex: '#FF6B6B', usage: 'primary' },
      { name: 'Purple', hex: '#845EC2', usage: 'secondary' },
      { name: 'Yellow', hex: '#FFD93D', usage: 'accent' },
      { name: 'White', hex: '#FFFFFF', usage: 'background' },
    ],
    primaryColor: '#FF6B6B',
    secondaryColor: '#845EC2',
    accentColor: '#FFD93D',
    fonts: [
      { name: 'Poppins', family: 'Poppins, sans-serif', usage: 'body' },
      { name: 'Poppins Bold', family: 'Poppins, sans-serif', weight: 600, usage: 'heading' },
    ],
    borderRadius: 'full',
    spacing: 'relaxed',
  },
  {
    name: 'Corporate Professional',
    description: 'Classic and professional corporate style',
    colors: [
      { name: 'Navy Blue', hex: '#1E3A5F', usage: 'primary' },
      { name: 'Gold', hex: '#D4AF37', usage: 'accent' },
      { name: 'Dark Text', hex: '#2D3748', usage: 'text' },
      { name: 'Off White', hex: '#FAF9F6', usage: 'background' },
    ],
    primaryColor: '#1E3A5F',
    secondaryColor: '#2D3748',
    accentColor: '#D4AF37',
    fonts: [
      { name: 'Georgia', family: 'Georgia, serif', usage: 'heading' },
      { name: 'Arial', family: 'Arial, sans-serif', usage: 'body' },
    ],
    borderRadius: 'sm',
    spacing: 'normal',
  },
  {
    name: 'Minimal Dark',
    description: 'Dark mode minimalist design',
    colors: [
      { name: 'Black', hex: '#0F0F0F', usage: 'background' },
      { name: 'White', hex: '#FFFFFF', usage: 'text' },
      { name: 'Gray', hex: '#6B7280', usage: 'secondary' },
      { name: 'Accent Blue', hex: '#3B82F6', usage: 'accent' },
    ],
    primaryColor: '#FFFFFF',
    secondaryColor: '#6B7280',
    accentColor: '#3B82F6',
    fonts: [
      { name: 'SF Pro', family: '-apple-system, BlinkMacSystemFont, sans-serif', usage: 'body' },
    ],
    borderRadius: 'md',
    spacing: 'compact',
  },
  {
    name: 'Eco Friendly',
    description: 'Nature-inspired sustainable brand',
    colors: [
      { name: 'Forest Green', hex: '#2D5A27', usage: 'primary' },
      { name: 'Earth Brown', hex: '#8B4513', usage: 'secondary' },
      { name: 'Sage', hex: '#9CAF88', usage: 'accent' },
      { name: 'Cream', hex: '#FDF5E6', usage: 'background' },
    ],
    primaryColor: '#2D5A27',
    secondaryColor: '#8B4513',
    accentColor: '#9CAF88',
    fonts: [
      { name: 'Merriweather', family: 'Merriweather, serif', usage: 'heading' },
      { name: 'Open Sans', family: 'Open Sans, sans-serif', usage: 'body' },
    ],
    borderRadius: 'md',
    spacing: 'relaxed',
  },
];
