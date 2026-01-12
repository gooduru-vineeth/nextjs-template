'use client';

import { useCallback, useMemo, useState } from 'react';

type AvatarStyle = 'initials' | 'gradient' | 'pattern' | 'geometric' | 'emoji' | 'robot' | 'abstract';
type ShapeType = 'circle' | 'rounded' | 'square';

type AvatarGeneratorProps = {
  name?: string;
  email?: string;
  seed?: string;
  size?: number;
  style?: AvatarStyle;
  shape?: ShapeType;
  backgroundColor?: string;
  textColor?: string;
  onClick?: () => void;
  className?: string;
};

// Color generation utilities
const generateColorFromSeed = (seed: string): { bg: string; text: string } => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    { bg: '#ef4444', text: '#ffffff' }, // red
    { bg: '#f97316', text: '#ffffff' }, // orange
    { bg: '#f59e0b', text: '#000000' }, // amber
    { bg: '#eab308', text: '#000000' }, // yellow
    { bg: '#84cc16', text: '#000000' }, // lime
    { bg: '#22c55e', text: '#ffffff' }, // green
    { bg: '#10b981', text: '#ffffff' }, // emerald
    { bg: '#14b8a6', text: '#ffffff' }, // teal
    { bg: '#06b6d4', text: '#000000' }, // cyan
    { bg: '#0ea5e9', text: '#ffffff' }, // sky
    { bg: '#3b82f6', text: '#ffffff' }, // blue
    { bg: '#6366f1', text: '#ffffff' }, // indigo
    { bg: '#8b5cf6', text: '#ffffff' }, // violet
    { bg: '#a855f7', text: '#ffffff' }, // purple
    { bg: '#d946ef', text: '#ffffff' }, // fuchsia
    { bg: '#ec4899', text: '#ffffff' }, // pink
    { bg: '#f43f5e', text: '#ffffff' }, // rose
  ];

  const index = Math.abs(hash) % colors.length;
  return colors[index]!;
};

const generateGradient = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
    'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
    'linear-gradient(135deg, #9890e3 0%, #b1f4cf 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff8177 0%, #cf556c 100%)',
  ];

  const index = Math.abs(hash) % gradients.length;
  return gradients[index]!;
};

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) {
    return '?';
  }

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    const first = parts[0];
    return first ? first.charAt(0).toUpperCase() : '?';
  }

  const firstPart = parts[0];
  const lastPart = parts[parts.length - 1];
  return ((firstPart?.charAt(0) ?? '') + (lastPart?.charAt(0) ?? '')).toUpperCase();
};

// Robot/Avatar emojis for robot style
const robotEmojis = ['🤖', '👾', '🎮', '🎯', '🎨', '🎭', '🌟', '💫', '🔮', '🎪'];
const animalEmojis = ['🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐯', '🐻', '🐰', '🦄'];
const foodEmojis = ['🍕', '🍔', '🌮', '🍩', '🧁', '🍦', '🍪', '🎂', '🍎', '🍓'];

const getEmojiFromSeed = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const allEmojis = [...robotEmojis, ...animalEmojis, ...foodEmojis];
  return allEmojis[Math.abs(hash) % allEmojis.length] ?? '🤖';
};

// Generate geometric pattern
const generateGeometricSVG = (seed: string, size: number): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
  const bgColor = colors[Math.abs(hash) % colors.length];
  const fgColor = colors[Math.abs(hash + 3) % colors.length];

  const patterns = [
    // Circles
    `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="${fgColor}" opacity="0.7"/>`,
    // Triangles
    `<polygon points="${size / 2},${size / 4} ${size / 4},${size * 3 / 4} ${size * 3 / 4},${size * 3 / 4}" fill="${fgColor}" opacity="0.7"/>`,
    // Squares rotated
    `<rect x="${size / 4}" y="${size / 4}" width="${size / 2}" height="${size / 2}" fill="${fgColor}" opacity="0.7" transform="rotate(45 ${size / 2} ${size / 2})"/>`,
    // Multiple circles
    `<circle cx="${size / 3}" cy="${size / 3}" r="${size / 5}" fill="${fgColor}" opacity="0.5"/><circle cx="${size * 2 / 3}" cy="${size * 2 / 3}" r="${size / 5}" fill="${fgColor}" opacity="0.5"/>`,
  ];

  const pattern = patterns[Math.abs(hash) % patterns.length];

  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${bgColor}"/>${pattern}</svg>`)}`;
};

// Generate abstract pattern
const generateAbstractSVG = (seed: string, size: number): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 60) % 360;
  const hue3 = (hue1 + 180) % 360;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue1},70%,60%);stop-opacity:1" />
        <stop offset="100%" style="stop-color:hsl(${hue2},70%,60%);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#g)"/>
    <circle cx="${size * 0.7}" cy="${size * 0.3}" r="${size * 0.25}" fill="hsl(${hue3},70%,70%)" opacity="0.6"/>
    <circle cx="${size * 0.3}" cy="${size * 0.7}" r="${size * 0.2}" fill="hsl(${hue1},80%,80%)" opacity="0.5"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export function AvatarGenerator({
  name = '',
  email = '',
  seed: customSeed,
  size = 48,
  style = 'initials',
  shape = 'circle',
  backgroundColor,
  textColor,
  onClick,
  className = '',
}: AvatarGeneratorProps) {
  const seed = customSeed || name || email || 'default';
  const colors = useMemo(() => generateColorFromSeed(seed), [seed]);
  const initials = useMemo(() => getInitials(name || email), [name, email]);

  const shapeClass = {
    circle: 'rounded-full',
    rounded: 'rounded-xl',
    square: 'rounded-none',
  };

  const bgColor = backgroundColor || colors.bg;
  const txtColor = textColor || colors.text;

  const renderContent = () => {
    switch (style) {
      case 'initials':
        return (
          <div
            className={`flex items-center justify-center font-semibold ${shapeClass[shape]}`}
            style={{
              width: size,
              height: size,
              backgroundColor: bgColor,
              color: txtColor,
              fontSize: size * 0.4,
            }}
          >
            {initials}
          </div>
        );

      case 'gradient':
        return (
          <div
            className={`flex items-center justify-center font-semibold text-white ${shapeClass[shape]}`}
            style={{
              width: size,
              height: size,
              background: generateGradient(seed),
              fontSize: size * 0.4,
            }}
          >
            {initials}
          </div>
        );

      case 'emoji':
        return (
          <div
            className={`flex items-center justify-center ${shapeClass[shape]}`}
            style={{
              width: size,
              height: size,
              backgroundColor: bgColor,
              fontSize: size * 0.5,
            }}
          >
            {getEmojiFromSeed(seed)}
          </div>
        );

      case 'robot':
        return (
          <div
            className={`flex items-center justify-center ${shapeClass[shape]}`}
            style={{
              width: size,
              height: size,
              background: generateGradient(seed),
              fontSize: size * 0.5,
            }}
          >
            🤖
          </div>
        );

      case 'geometric':
        return (
          <img
            src={generateGeometricSVG(seed, size)}
            alt={name || 'Avatar'}
            className={shapeClass[shape]}
            style={{ width: size, height: size }}
          />
        );

      case 'abstract':
        return (
          <img
            src={generateAbstractSVG(seed, size)}
            alt={name || 'Avatar'}
            className={shapeClass[shape]}
            style={{ width: size, height: size }}
          />
        );

      case 'pattern':
        return (
          <div
            className={`flex items-center justify-center font-semibold ${shapeClass[shape]}`}
            style={{
              width: size,
              height: size,
              background: `repeating-linear-gradient(45deg, ${bgColor}, ${bgColor} 10px, ${txtColor}22 10px, ${txtColor}22 20px)`,
              color: txtColor,
              fontSize: size * 0.35,
            }}
          >
            {initials}
          </div>
        );

      default:
        return null;
    }
  };

  const content = renderContent();

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`cursor-pointer transition-transform hover:scale-105 ${className}`}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

// Avatar picker component
type AvatarPickerProps = {
  value?: { style: AvatarStyle; color?: string };
  onChange: (value: { style: AvatarStyle; color?: string }) => void;
  name?: string;
  size?: number;
  className?: string;
};

export function AvatarPicker({
  value,
  onChange,
  name = 'User',
  size = 64,
  className = '',
}: AvatarPickerProps) {
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(value?.style || 'initials');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(value?.color);

  const styles: AvatarStyle[] = ['initials', 'gradient', 'emoji', 'geometric', 'abstract', 'pattern'];

  const colors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#0ea5e9',
    '#6366f1',
    '#a855f7',
    '#ec4899',
    '#64748b',
  ];

  const handleStyleChange = useCallback((style: AvatarStyle) => {
    setSelectedStyle(style);
    onChange({ style, color: selectedColor });
  }, [selectedColor, onChange]);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    onChange({ style: selectedStyle, color });
  }, [selectedStyle, onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview */}
      <div className="flex justify-center">
        <AvatarGenerator
          name={name}
          size={size}
          style={selectedStyle}
          backgroundColor={selectedColor}
        />
      </div>

      {/* Style selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => handleStyleChange(style)}
              className={`flex items-center justify-center rounded-lg border-2 p-2 transition-all ${
                selectedStyle === style
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <AvatarGenerator
                name={name}
                size={32}
                style={style}
                backgroundColor={selectedColor}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Color selector */}
      {(selectedStyle === 'initials' || selectedStyle === 'pattern') && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`size-8 rounded-full transition-transform ${
                  selectedColor === color ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button
              onClick={() => handleColorChange('')}
              className={`flex size-8 items-center justify-center rounded-full border-2 border-dashed border-gray-300 transition-transform ${
                !selectedColor ? 'scale-110 ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
              }`}
            >
              <span className="text-xs text-gray-400">Auto</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Avatar group for displaying multiple avatars
type AvatarGroupProps = {
  users: Array<{ name: string; avatarUrl?: string; color?: string }>;
  max?: number;
  size?: number;
  overlap?: number;
  className?: string;
};

export function AvatarGroup({
  users,
  max = 4,
  size = 32,
  overlap = 8,
  className = '',
}: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const extraCount = users.length - max;

  return (
    <div className={`flex items-center ${className}`} style={{ paddingLeft: overlap }}>
      {visibleUsers.map((user, index) => (
        <div
          key={index}
          className="relative rounded-full border-2 border-white dark:border-gray-900"
          style={{ marginLeft: -overlap, zIndex: visibleUsers.length - index }}
        >
          {user.avatarUrl
            ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="rounded-full object-cover"
                  style={{ width: size, height: size }}
                />
              )
            : (
                <AvatarGenerator
                  name={user.name}
                  size={size}
                  backgroundColor={user.color}
                />
              )}
        </div>
      ))}
      {extraCount > 0 && (
        <div
          className="flex items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-semibold text-gray-600 dark:border-gray-900 dark:bg-gray-700 dark:text-gray-300"
          style={{ width: size, height: size, marginLeft: -overlap }}
        >
          +
          {extraCount}
        </div>
      )}
    </div>
  );
}

// Upload avatar button
type UploadAvatarProps = {
  currentAvatar?: string;
  onUpload: (file: File) => void;
  size?: number;
  name?: string;
  className?: string;
};

export function UploadAvatar({
  currentAvatar,
  onUpload,
  size = 80,
  name = 'User',
  className = '',
}: UploadAvatarProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <label
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {currentAvatar
        ? (
            <img
              src={currentAvatar}
              alt={name}
              className="rounded-full object-cover"
              style={{ width: size, height: size }}
            />
          )
        : (
            <AvatarGenerator name={name} size={size} />
          )}
      {isHovering && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50"
          style={{ width: size, height: size }}
        >
          <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      )}
    </label>
  );
}

export type { AvatarStyle, ShapeType };
