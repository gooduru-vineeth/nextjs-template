/**
 * Thumbnail Generator Utility
 * Generates thumbnail images from mockup preview elements
 */

export type ThumbnailOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

const DEFAULT_OPTIONS: ThumbnailOptions = {
  width: 400,
  height: 300,
  quality: 0.8,
};

/**
 * Generates a thumbnail data URL from a DOM element
 */
export async function generateThumbnail(
  element: HTMLElement,
  options: ThumbnailOptions = {},
): Promise<string | null> {
  const { width, height, quality } = { ...DEFAULT_OPTIONS, ...options };

  try {
    // Dynamic import for client-side only
    const html2canvas = (await import('html2canvas')).default;

    // Capture the element
    const canvas = await html2canvas(element, {
      scale: 1, // Lower scale for thumbnails
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    // Create a smaller canvas for the thumbnail
    const thumbnailCanvas = document.createElement('canvas');
    thumbnailCanvas.width = width!;
    thumbnailCanvas.height = height!;
    const ctx = thumbnailCanvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Calculate aspect ratio to fit the image
    const sourceAspect = canvas.width / canvas.height;
    const targetAspect = width! / height!;

    let drawWidth = width!;
    let drawHeight = height!;
    let offsetX = 0;
    let offsetY = 0;

    if (sourceAspect > targetAspect) {
      // Source is wider - fit by height
      drawHeight = height!;
      drawWidth = height! * sourceAspect;
      offsetX = (width! - drawWidth) / 2;
    } else {
      // Source is taller - fit by width
      drawWidth = width!;
      drawHeight = width! / sourceAspect;
      offsetY = (height! - drawHeight) / 2;
    }

    // Fill background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width!, height!);

    // Draw the scaled image
    ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight);

    // Return as data URL
    return thumbnailCanvas.toDataURL('image/jpeg', quality);
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    return null;
  }
}

/**
 * Converts a data URL to a Blob for uploading
 */
export function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0]!.match(/:(.*?);/)![1];
  const bstr = atob(parts[1]!);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Creates a placeholder thumbnail with platform icon
 */
export function createPlaceholderThumbnail(
  platform: string,
  type: 'chat' | 'ai' | 'social',
): string {
  const platformColors: Record<string, { bg: string; accent: string }> = {
    // Chat platforms
    whatsapp: { bg: '#25D366', accent: '#128C7E' },
    imessage: { bg: '#34C759', accent: '#2AA14F' },
    discord: { bg: '#5865F2', accent: '#4752C4' },
    telegram: { bg: '#0088CC', accent: '#006699' },
    messenger: { bg: '#0084FF', accent: '#0066CC' },
    slack: { bg: '#4A154B', accent: '#611F69' },
    // AI platforms
    chatgpt: { bg: '#10A37F', accent: '#0D8A6A' },
    claude: { bg: '#D97706', accent: '#B45309' },
    gemini: { bg: '#4285F4', accent: '#1A73E8' },
    perplexity: { bg: '#1E90FF', accent: '#0066CC' },
    // Social platforms
    linkedin: { bg: '#0A66C2', accent: '#084E96' },
    instagram: { bg: '#E1306C', accent: '#C13584' },
    twitter: { bg: '#1DA1F2', accent: '#0C85D0' },
  };

  const typeIcons: Record<string, string> = {
    chat: '💬',
    ai: '🤖',
    social: '📱',
  };

  const colors = platformColors[platform] || { bg: '#6B7280', accent: '#4B5563' };
  const icon = typeIcons[type] || '📄';

  // Create an SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <text x="200" y="150" font-size="80" text-anchor="middle" dominant-baseline="middle">${icon}</text>
      <text x="200" y="220" font-size="24" fill="white" text-anchor="middle" font-family="system-ui, sans-serif" opacity="0.9">${platform}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
