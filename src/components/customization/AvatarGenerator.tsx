'use client';

import {
  Check,
  Circle,
  Palette,
  Shuffle,
  Smile,
  Sparkles,
  Square,
  Upload,
  User,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

// Types
type AvatarStyle = 'initials' | 'gradient' | 'pattern' | 'emoji' | 'abstract' | 'pixel';
type AvatarShape = 'circle' | 'square' | 'rounded' | 'hexagon';
type GeneratorVariant = 'full' | 'compact' | 'inline';

type AvatarConfig = {
  style: AvatarStyle;
  shape: AvatarShape;
  backgroundColor: string;
  textColor: string;
  initials: string;
  emoji?: string;
  gradientColors?: [string, string];
  pattern?: string;
  size: number;
};

type GeneratedAvatar = {
  id: string;
  config: AvatarConfig;
  dataUrl?: string;
};

export type AvatarGeneratorProps = {
  variant?: GeneratorVariant;
  initialName?: string;
  onSelect?: (avatar: GeneratedAvatar) => void;
  onUpload?: (file: File) => void;
  className?: string;
};

// Color palettes
const colorPalettes = [
  { name: 'Blue', bg: '#3B82F6', text: '#FFFFFF' },
  { name: 'Purple', bg: '#8B5CF6', text: '#FFFFFF' },
  { name: 'Pink', bg: '#EC4899', text: '#FFFFFF' },
  { name: 'Red', bg: '#EF4444', text: '#FFFFFF' },
  { name: 'Orange', bg: '#F97316', text: '#FFFFFF' },
  { name: 'Yellow', bg: '#EAB308', text: '#000000' },
  { name: 'Green', bg: '#22C55E', text: '#FFFFFF' },
  { name: 'Teal', bg: '#14B8A6', text: '#FFFFFF' },
  { name: 'Cyan', bg: '#06B6D4', text: '#FFFFFF' },
  { name: 'Indigo', bg: '#6366F1', text: '#FFFFFF' },
  { name: 'Gray', bg: '#6B7280', text: '#FFFFFF' },
  { name: 'Black', bg: '#1F2937', text: '#FFFFFF' },
];

const gradients = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#ff9a9e', '#fecfef'],
  ['#ffecd2', '#fcb69f'],
  ['#667eea', '#764ba2'],
  ['#11998e', '#38ef7d'],
  ['#fc5c7d', '#6a82fb'],
  ['#ee9ca7', '#ffdde1'],
];

const emojis = ['😊', '🎨', '🚀', '💡', '🌟', '🎯', '🔥', '💎', '🌈', '⚡', '🎭', '🦄', '🐱', '🐶', '🦊', '🐼'];

export default function AvatarGenerator({
  variant = 'full',
  initialName = '',
  onSelect,
  onUpload,
  className = '',
}: AvatarGeneratorProps) {
  const [name, setName] = useState(initialName);
  const [style, setStyle] = useState<AvatarStyle>('initials');
  const [shape, setShape] = useState<AvatarShape>('circle');
  const [selectedColor, setSelectedColor] = useState(colorPalettes[0]!);
  const [selectedGradient, setSelectedGradient] = useState(gradients[0]!);
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]!);
  const [generatedAvatars, setGeneratedAvatars] = useState<GeneratedAvatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<GeneratedAvatar | null>(null);

  const getInitials = useCallback((fullName: string) => {
    if (!fullName.trim()) {
      return '?';
    }
    const words = fullName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0]!.charAt(0).toUpperCase();
    }
    return (words[0]!.charAt(0) + words[words.length - 1]!.charAt(0)).toUpperCase();
  }, []);

  const generateRandomColor = useCallback(() => {
    return colorPalettes[Math.floor(Math.random() * colorPalettes.length)]!;
  }, []);

  const currentConfig: AvatarConfig = useMemo(() => ({
    style,
    shape,
    backgroundColor: (style === 'gradient' ? selectedGradient[0] : selectedColor.bg) || '#3B82F6',
    textColor: selectedColor.text,
    initials: getInitials(name),
    emoji: selectedEmoji,
    gradientColors: selectedGradient as [string, string],
    size: 80,
  }), [style, shape, selectedColor, selectedGradient, selectedEmoji, name, getInitials]);

  const handleRandomize = useCallback(() => {
    const randomColor = generateRandomColor();
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]!;
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]!;
    const styles: AvatarStyle[] = ['initials', 'gradient', 'emoji', 'abstract'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]!;

    setSelectedColor(randomColor);
    setSelectedGradient(randomGradient);
    setSelectedEmoji(randomEmoji);
    setStyle(randomStyle);
  }, [generateRandomColor]);

  const handleGenerate = useCallback(() => {
    const newAvatar: GeneratedAvatar = {
      id: `avatar-${Date.now()}`,
      config: { ...currentConfig },
    };
    setGeneratedAvatars(prev => [newAvatar, ...prev.slice(0, 7)]);
    setSelectedAvatar(newAvatar);
  }, [currentConfig]);

  const handleSelectAvatar = useCallback((avatar: GeneratedAvatar) => {
    setSelectedAvatar(avatar);
    onSelect?.(avatar);
  }, [onSelect]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload?.(file);
    }
  }, [onUpload]);

  const getShapeClass = (avatarShape: AvatarShape) => {
    switch (avatarShape) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-xl';
      case 'hexagon': return 'clip-hexagon';
      default: return 'rounded-full';
    }
  };

  const renderAvatar = (config: AvatarConfig, size: number = 80) => {
    const shapeClass = getShapeClass(config.shape);
    const baseStyle: React.CSSProperties = {
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.4,
      fontWeight: 600,
    };

    if (config.style === 'gradient') {
      return (
        <div
          className={`${shapeClass}`}
          style={{
            ...baseStyle,
            background: `linear-gradient(135deg, ${config.gradientColors?.[0]} 0%, ${config.gradientColors?.[1]} 100%)`,
            color: '#FFFFFF',
          }}
        >
          {config.initials}
        </div>
      );
    }

    if (config.style === 'emoji') {
      return (
        <div
          className={`${shapeClass} bg-gray-100 dark:bg-gray-800`}
          style={{ ...baseStyle, fontSize: size * 0.5 }}
        >
          {config.emoji}
        </div>
      );
    }

    if (config.style === 'abstract') {
      return (
        <div
          className={`${shapeClass} relative overflow-hidden`}
          style={{
            ...baseStyle,
            backgroundColor: config.backgroundColor,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%),
                          radial-gradient(circle at 70% 70%, rgba(0,0,0,0.3) 0%, transparent 50%)`,
            }}
          />
          <span style={{ color: config.textColor, position: 'relative', zIndex: 1 }}>
            {config.initials}
          </span>
        </div>
      );
    }

    // Default: initials
    return (
      <div
        className={`${shapeClass}`}
        style={{
          ...baseStyle,
          backgroundColor: config.backgroundColor,
          color: config.textColor,
        }}
      >
        {config.initials}
      </div>
    );
  };

  // Inline variant - just avatar selector
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderAvatar(currentConfig, 48)}
        <button
          onClick={handleRandomize}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="avatar-upload-inline"
        />
        <label
          htmlFor="avatar-upload-inline"
          className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Upload className="h-4 w-4" />
        </label>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="mb-4 flex items-center gap-4">
          {renderAvatar(currentConfig, 64)}
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mb-3 flex gap-1">
          {(['initials', 'gradient', 'emoji'] as AvatarStyle[]).map(s => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`rounded px-2 py-1 text-xs capitalize ${
                style === s
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {colorPalettes.slice(0, 6).map(color => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`h-6 w-6 rounded-full border-2 ${
                selectedColor.name === color.name ? 'border-blue-500' : 'border-transparent'
              }`}
              style={{ backgroundColor: color.bg }}
            />
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleRandomize}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Shuffle className="h-3 w-3" />
            Random
          </button>
          <button
            onClick={handleGenerate}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <Check className="h-3 w-3" />
            Use
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <User className="h-5 w-5" />
          Avatar Generator
        </h2>
        <p className="mt-1 text-sm text-gray-500">Create custom avatars for your mockups</p>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        {/* Preview */}
        <div className="flex flex-col items-center">
          <div className="mb-4">
            {renderAvatar(currentConfig, 120)}
          </div>

          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name for initials"
            className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Shuffle className="h-4 w-4" />
              Randomize
            </button>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </button>
          </div>

          {/* Upload option */}
          <div className="mt-6 text-center">
            <p className="mb-2 text-sm text-gray-500">Or upload a custom image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </label>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-6">
          {/* Style */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Style</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { style: 'initials', icon: User, label: 'Initials' },
                { style: 'gradient', icon: Palette, label: 'Gradient' },
                { style: 'emoji', icon: Smile, label: 'Emoji' },
                { style: 'abstract', icon: Sparkles, label: 'Abstract' },
              ] as const).map(({ style: s, icon: Icon, label }) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 ${
                    style === s
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${style === s ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shape */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Shape</p>
            <div className="flex gap-2">
              {([
                { shape: 'circle', icon: Circle },
                { shape: 'rounded', icon: Square },
                { shape: 'square', icon: Square },
              ] as const).map(({ shape: s, icon: Icon }) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`rounded-lg border-2 p-3 ${
                    shape === s
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${shape === s ? 'text-blue-600' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          {style !== 'gradient' && style !== 'emoji' && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Background Color</p>
              <div className="flex flex-wrap gap-2">
                {colorPalettes.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      selectedColor.name === color.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.bg }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gradients */}
          {style === 'gradient' && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Gradient</p>
              <div className="grid grid-cols-4 gap-2">
                {gradients.map((grad, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGradient(grad)}
                    className={`aspect-square w-full rounded-lg border-2 transition-transform hover:scale-105 ${
                      selectedGradient === grad ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Emojis */}
          {style === 'emoji' && (
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Emoji</p>
              <div className="flex flex-wrap gap-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`h-10 w-10 rounded-lg text-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedEmoji === emoji ? 'bg-blue-100 ring-2 ring-blue-500 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated avatars history */}
      {generatedAvatars.length > 0 && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Recent Avatars</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {generatedAvatars.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => handleSelectAvatar(avatar)}
                className={`flex-shrink-0 rounded-lg border-2 p-1 transition-transform hover:scale-105 ${
                  selectedAvatar?.id === avatar.id ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                {renderAvatar(avatar.config, 48)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export type { AvatarConfig, AvatarShape, AvatarStyle, GeneratedAvatar, GeneratorVariant };
