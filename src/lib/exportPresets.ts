'use client';

export type ExportPreset = {
  id: string;
  name: string;
  platform: string;
  category: 'social' | 'device' | 'print' | 'web' | 'custom';
  width: number;
  height: number;
  scale?: number;
  description?: string;
  icon?: string;
};

// Social Media Presets
export const socialMediaPresets: ExportPreset[] = [
  // Instagram
  {
    id: 'instagram-post-square',
    name: 'Post (Square)',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1080,
    description: 'Standard square post',
    icon: 'instagram',
  },
  {
    id: 'instagram-post-portrait',
    name: 'Post (Portrait)',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1350,
    description: '4:5 portrait post',
    icon: 'instagram',
  },
  {
    id: 'instagram-post-landscape',
    name: 'Post (Landscape)',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 608,
    description: '1.91:1 landscape post',
    icon: 'instagram',
  },
  {
    id: 'instagram-story',
    name: 'Story',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1920,
    description: '9:16 vertical story',
    icon: 'instagram',
  },
  {
    id: 'instagram-reel',
    name: 'Reel',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1920,
    description: '9:16 vertical reel',
    icon: 'instagram',
  },

  // Twitter/X
  {
    id: 'twitter-post',
    name: 'Post Image',
    platform: 'Twitter/X',
    category: 'social',
    width: 1200,
    height: 675,
    description: '16:9 recommended',
    icon: 'twitter',
  },
  {
    id: 'twitter-header',
    name: 'Header',
    platform: 'Twitter/X',
    category: 'social',
    width: 1500,
    height: 500,
    description: 'Profile header banner',
    icon: 'twitter',
  },
  {
    id: 'twitter-card',
    name: 'Card Image',
    platform: 'Twitter/X',
    category: 'social',
    width: 800,
    height: 418,
    description: 'Link preview card',
    icon: 'twitter',
  },

  // Facebook
  {
    id: 'facebook-post',
    name: 'Post Image',
    platform: 'Facebook',
    category: 'social',
    width: 1200,
    height: 630,
    description: 'Standard feed post',
    icon: 'facebook',
  },
  {
    id: 'facebook-cover',
    name: 'Cover Photo',
    platform: 'Facebook',
    category: 'social',
    width: 1640,
    height: 924,
    description: 'Page cover image',
    icon: 'facebook',
  },
  {
    id: 'facebook-story',
    name: 'Story',
    platform: 'Facebook',
    category: 'social',
    width: 1080,
    height: 1920,
    description: '9:16 vertical story',
    icon: 'facebook',
  },
  {
    id: 'facebook-event',
    name: 'Event Cover',
    platform: 'Facebook',
    category: 'social',
    width: 1920,
    height: 1005,
    description: 'Event page banner',
    icon: 'facebook',
  },

  // LinkedIn
  {
    id: 'linkedin-post',
    name: 'Post Image',
    platform: 'LinkedIn',
    category: 'social',
    width: 1200,
    height: 627,
    description: 'Standard feed post',
    icon: 'linkedin',
  },
  {
    id: 'linkedin-banner',
    name: 'Banner',
    platform: 'LinkedIn',
    category: 'social',
    width: 1584,
    height: 396,
    description: 'Profile/company banner',
    icon: 'linkedin',
  },
  {
    id: 'linkedin-article',
    name: 'Article Cover',
    platform: 'LinkedIn',
    category: 'social',
    width: 1280,
    height: 720,
    description: 'Article header image',
    icon: 'linkedin',
  },

  // YouTube
  {
    id: 'youtube-thumbnail',
    name: 'Thumbnail',
    platform: 'YouTube',
    category: 'social',
    width: 1280,
    height: 720,
    description: 'Video thumbnail',
    icon: 'youtube',
  },
  {
    id: 'youtube-banner',
    name: 'Channel Banner',
    platform: 'YouTube',
    category: 'social',
    width: 2560,
    height: 1440,
    description: 'Channel art banner',
    icon: 'youtube',
  },
  {
    id: 'youtube-shorts',
    name: 'Shorts',
    platform: 'YouTube',
    category: 'social',
    width: 1080,
    height: 1920,
    description: '9:16 vertical short',
    icon: 'youtube',
  },

  // TikTok
  {
    id: 'tiktok-video',
    name: 'Video',
    platform: 'TikTok',
    category: 'social',
    width: 1080,
    height: 1920,
    description: '9:16 vertical video',
    icon: 'tiktok',
  },

  // Pinterest
  {
    id: 'pinterest-pin',
    name: 'Standard Pin',
    platform: 'Pinterest',
    category: 'social',
    width: 1000,
    height: 1500,
    description: '2:3 standard pin',
    icon: 'pinterest',
  },
  {
    id: 'pinterest-long',
    name: 'Long Pin',
    platform: 'Pinterest',
    category: 'social',
    width: 1000,
    height: 2100,
    description: 'Infographic style pin',
    icon: 'pinterest',
  },

  // Dribbble
  {
    id: 'dribbble-shot',
    name: 'Shot',
    platform: 'Dribbble',
    category: 'social',
    width: 1600,
    height: 1200,
    description: '4:3 standard shot',
    icon: 'dribbble',
  },
  {
    id: 'dribbble-shot-hd',
    name: 'Shot (Full HD)',
    platform: 'Dribbble',
    category: 'social',
    width: 1920,
    height: 1440,
    description: 'High resolution shot',
    icon: 'dribbble',
  },

  // Behance
  {
    id: 'behance-project',
    name: 'Project Cover',
    platform: 'Behance',
    category: 'social',
    width: 1400,
    height: 1050,
    description: 'Project cover image',
    icon: 'behance',
  },
  {
    id: 'behance-module',
    name: 'Module',
    platform: 'Behance',
    category: 'social',
    width: 1400,
    height: 788,
    description: 'Project module',
    icon: 'behance',
  },

  // Product Hunt
  {
    id: 'producthunt-thumbnail',
    name: 'Thumbnail',
    platform: 'Product Hunt',
    category: 'social',
    width: 1270,
    height: 760,
    description: 'Product thumbnail',
    icon: 'producthunt',
  },
  {
    id: 'producthunt-gallery',
    name: 'Gallery Image',
    platform: 'Product Hunt',
    category: 'social',
    width: 1270,
    height: 760,
    description: 'Product gallery slide',
    icon: 'producthunt',
  },
];

// Device Frame Presets
export const devicePresets: ExportPreset[] = [
  // iPhone
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    platform: 'Apple',
    category: 'device',
    width: 430,
    height: 932,
    description: '6.7" display',
    icon: 'apple',
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    platform: 'Apple',
    category: 'device',
    width: 393,
    height: 852,
    description: '6.1" display',
    icon: 'apple',
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    platform: 'Apple',
    category: 'device',
    width: 393,
    height: 852,
    description: '6.1" display',
    icon: 'apple',
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    platform: 'Apple',
    category: 'device',
    width: 375,
    height: 667,
    description: '4.7" display',
    icon: 'apple',
  },

  // iPad
  {
    id: 'ipad-pro-12',
    name: 'iPad Pro 12.9"',
    platform: 'Apple',
    category: 'device',
    width: 1024,
    height: 1366,
    description: '12.9" display',
    icon: 'apple',
  },
  {
    id: 'ipad-pro-11',
    name: 'iPad Pro 11"',
    platform: 'Apple',
    category: 'device',
    width: 834,
    height: 1194,
    description: '11" display',
    icon: 'apple',
  },
  {
    id: 'ipad-air',
    name: 'iPad Air',
    platform: 'Apple',
    category: 'device',
    width: 820,
    height: 1180,
    description: '10.9" display',
    icon: 'apple',
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini',
    platform: 'Apple',
    category: 'device',
    width: 744,
    height: 1133,
    description: '8.3" display',
    icon: 'apple',
  },

  // Android Phones
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    platform: 'Google',
    category: 'device',
    width: 448,
    height: 998,
    description: '6.7" display',
    icon: 'android',
  },
  {
    id: 'pixel-8',
    name: 'Pixel 8',
    platform: 'Google',
    category: 'device',
    width: 412,
    height: 915,
    description: '6.2" display',
    icon: 'android',
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung S24 Ultra',
    platform: 'Samsung',
    category: 'device',
    width: 480,
    height: 1034,
    description: '6.8" display',
    icon: 'android',
  },
  {
    id: 'samsung-s24',
    name: 'Samsung S24',
    platform: 'Samsung',
    category: 'device',
    width: 412,
    height: 915,
    description: '6.2" display',
    icon: 'android',
  },

  // Android Tablets
  {
    id: 'samsung-tab-s9',
    name: 'Galaxy Tab S9+',
    platform: 'Samsung',
    category: 'device',
    width: 800,
    height: 1280,
    description: '12.4" display',
    icon: 'android',
  },

  // Desktop
  {
    id: 'macbook-pro-16',
    name: 'MacBook Pro 16"',
    platform: 'Apple',
    category: 'device',
    width: 1728,
    height: 1117,
    description: '16" Retina display',
    icon: 'apple',
  },
  {
    id: 'macbook-pro-14',
    name: 'MacBook Pro 14"',
    platform: 'Apple',
    category: 'device',
    width: 1512,
    height: 982,
    description: '14" Retina display',
    icon: 'apple',
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air',
    platform: 'Apple',
    category: 'device',
    width: 1470,
    height: 956,
    description: '13.6" display',
    icon: 'apple',
  },
  {
    id: 'imac-24',
    name: 'iMac 24"',
    platform: 'Apple',
    category: 'device',
    width: 2240,
    height: 1260,
    description: '4.5K Retina display',
    icon: 'apple',
  },

  // Monitors
  {
    id: 'desktop-4k',
    name: '4K Monitor',
    platform: 'Desktop',
    category: 'device',
    width: 3840,
    height: 2160,
    description: '4K UHD resolution',
    icon: 'desktop',
  },
  {
    id: 'desktop-1440p',
    name: '1440p Monitor',
    platform: 'Desktop',
    category: 'device',
    width: 2560,
    height: 1440,
    description: 'QHD resolution',
    icon: 'desktop',
  },
  {
    id: 'desktop-1080p',
    name: '1080p Monitor',
    platform: 'Desktop',
    category: 'device',
    width: 1920,
    height: 1080,
    description: 'Full HD resolution',
    icon: 'desktop',
  },

  // Browsers
  {
    id: 'browser-hd',
    name: 'Browser (HD)',
    platform: 'Browser',
    category: 'device',
    width: 1920,
    height: 1080,
    description: 'Full HD browser',
    icon: 'browser',
  },
  {
    id: 'browser-standard',
    name: 'Browser (Standard)',
    platform: 'Browser',
    category: 'device',
    width: 1440,
    height: 900,
    description: 'Standard browser',
    icon: 'browser',
  },
  {
    id: 'browser-laptop',
    name: 'Browser (Laptop)',
    platform: 'Browser',
    category: 'device',
    width: 1280,
    height: 800,
    description: 'Laptop browser',
    icon: 'browser',
  },
];

// Web/Digital Presets
export const webPresets: ExportPreset[] = [
  {
    id: 'og-image',
    name: 'Open Graph Image',
    platform: 'Web',
    category: 'web',
    width: 1200,
    height: 630,
    description: 'Standard OG image',
    icon: 'web',
  },
  {
    id: 'favicon-32',
    name: 'Favicon (32x32)',
    platform: 'Web',
    category: 'web',
    width: 32,
    height: 32,
    description: 'Standard favicon',
    icon: 'web',
  },
  {
    id: 'favicon-16',
    name: 'Favicon (16x16)',
    platform: 'Web',
    category: 'web',
    width: 16,
    height: 16,
    description: 'Small favicon',
    icon: 'web',
  },
  {
    id: 'apple-touch-icon',
    name: 'Apple Touch Icon',
    platform: 'Web',
    category: 'web',
    width: 180,
    height: 180,
    description: 'iOS home screen icon',
    icon: 'apple',
  },
  {
    id: 'android-icon',
    name: 'Android Icon',
    platform: 'Web',
    category: 'web',
    width: 192,
    height: 192,
    description: 'Android home screen icon',
    icon: 'android',
  },
  {
    id: 'splash-screen',
    name: 'Splash Screen',
    platform: 'Web',
    category: 'web',
    width: 2048,
    height: 2732,
    description: 'PWA splash screen',
    icon: 'web',
  },
];

// Print Presets
export const printPresets: ExportPreset[] = [
  {
    id: 'print-a4',
    name: 'A4 Paper',
    platform: 'Print',
    category: 'print',
    width: 2480,
    height: 3508,
    scale: 1,
    description: '210 x 297 mm @ 300 DPI',
    icon: 'print',
  },
  {
    id: 'print-letter',
    name: 'US Letter',
    platform: 'Print',
    category: 'print',
    width: 2550,
    height: 3300,
    scale: 1,
    description: '8.5 x 11 in @ 300 DPI',
    icon: 'print',
  },
  {
    id: 'print-a3',
    name: 'A3 Paper',
    platform: 'Print',
    category: 'print',
    width: 3508,
    height: 4961,
    scale: 1,
    description: '297 x 420 mm @ 300 DPI',
    icon: 'print',
  },
  {
    id: 'print-business-card',
    name: 'Business Card',
    platform: 'Print',
    category: 'print',
    width: 1050,
    height: 600,
    scale: 1,
    description: '3.5 x 2 in @ 300 DPI',
    icon: 'print',
  },
  {
    id: 'print-postcard',
    name: 'Postcard',
    platform: 'Print',
    category: 'print',
    width: 1800,
    height: 1200,
    scale: 1,
    description: '6 x 4 in @ 300 DPI',
    icon: 'print',
  },
];

// All presets combined
export const allPresets: ExportPreset[] = [
  ...socialMediaPresets,
  ...devicePresets,
  ...webPresets,
  ...printPresets,
];

// Get presets by category
export function getPresetsByCategory(category: ExportPreset['category']): ExportPreset[] {
  return allPresets.filter(preset => preset.category === category);
}

// Get presets by platform
export function getPresetsByPlatform(platform: string): ExportPreset[] {
  return allPresets.filter(preset => preset.platform === platform);
}

// Get unique platforms
export function getUniquePlatforms(): string[] {
  return [...new Set(allPresets.map(preset => preset.platform))];
}

// Get preset by ID
export function getPresetById(id: string): ExportPreset | undefined {
  return allPresets.find(preset => preset.id === id);
}

// Create custom preset
export function createCustomPreset(
  name: string,
  width: number,
  height: number,
  description?: string,
): ExportPreset {
  return {
    id: `custom-${Date.now()}`,
    name,
    platform: 'Custom',
    category: 'custom',
    width,
    height,
    description,
    icon: 'custom',
  };
}

// Calculate aspect ratio
export function getAspectRatio(preset: ExportPreset): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(preset.width, preset.height);
  const w = preset.width / divisor;
  const h = preset.height / divisor;
  return `${w}:${h}`;
}

// Platform icon mapping
export const platformIcons: Record<string, string> = {
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  pinterest: 'M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z',
  dribbble: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.81zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.29zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z',
  behance: 'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z',
  producthunt: 'M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z',
  apple: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
  android: 'M17.6 11.4c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zm-11.2 0c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4 1.4-.6 1.4-1.4-.6-1.4-1.4-1.4zM18 8.8l2-3.6c.2-.3.1-.7-.2-.8-.3-.2-.7-.1-.8.2L17 8.2C15.5 7.5 13.8 7 12 7s-3.5.5-5 1.2L5 4.6c-.2-.3-.5-.4-.8-.2-.3.2-.4.5-.2.8l2 3.6C2.7 10.8.5 14.5.5 18.7h23c0-4.2-2.2-7.9-5.5-9.9z',
};
