'use client';

import { Check, ChevronDown, Monitor, Moon, Palette, Sun } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ThemeMode = {
  id: string;
  name: string;
  icon: 'sun' | 'moon' | 'monitor' | 'palette';
  description: string;
};

export type ColorScheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
};

export type ThemeModeToggleProps = {
  variant?: 'toggle' | 'dropdown' | 'buttons' | 'minimal';
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  showColorSchemes?: boolean;
  colorSchemes?: ColorScheme[];
  currentColorScheme?: string;
  onColorSchemeChange?: (schemeId: string) => void;
  showSystemOption?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const defaultThemes: ThemeMode[] = [
  { id: 'light', name: 'Light', icon: 'sun', description: 'Light mode for daytime' },
  { id: 'dark', name: 'Dark', icon: 'moon', description: 'Dark mode for nighttime' },
  { id: 'system', name: 'System', icon: 'monitor', description: 'Follow system preference' },
];

const defaultColorSchemes: ColorScheme[] = [
  { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#60A5FA', accent: '#2563EB', background: '#F8FAFC', foreground: '#1E293B' },
  { id: 'green', name: 'Forest Green', primary: '#22C55E', secondary: '#4ADE80', accent: '#16A34A', background: '#F0FDF4', foreground: '#14532D' },
  { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#7C3AED', background: '#FAF5FF', foreground: '#3B0764' },
  { id: 'orange', name: 'Sunset Orange', primary: '#F97316', secondary: '#FB923C', accent: '#EA580C', background: '#FFF7ED', foreground: '#7C2D12' },
  { id: 'pink', name: 'Rose Pink', primary: '#EC4899', secondary: '#F472B6', accent: '#DB2777', background: '#FDF2F8', foreground: '#831843' },
];

const ThemeModeToggle: React.FC<ThemeModeToggleProps> = ({
  variant = 'toggle',
  currentTheme = 'system',
  onThemeChange,
  showColorSchemes = false,
  colorSchemes = defaultColorSchemes,
  currentColorScheme = 'blue',
  onColorSchemeChange,
  showSystemOption = true,
  showLabels = true,
  size = 'md',
  className = '',
}) => {
  const [theme, setTheme] = useState(currentTheme);
  const [scheme, setScheme] = useState(currentColorScheme);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSchemeDropdownOpen, setIsSchemeDropdownOpen] = useState(false);

  const themes = showSystemOption ? defaultThemes : defaultThemes.filter(t => t.id !== 'system');

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    setScheme(currentColorScheme);
  }, [currentColorScheme]);

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
    setIsDropdownOpen(false);
  }, [onThemeChange]);

  const handleColorSchemeChange = useCallback((newScheme: string) => {
    setScheme(newScheme);
    onColorSchemeChange?.(newScheme);
    setIsSchemeDropdownOpen(false);
  }, [onColorSchemeChange]);

  const getIcon = (iconType: string) => {
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
    switch (iconType) {
      case 'sun':
        return <Sun size={iconSize} />;
      case 'moon':
        return <Moon size={iconSize} />;
      case 'monitor':
        return <Monitor size={iconSize} />;
      case 'palette':
        return <Palette size={iconSize} />;
      default:
        return <Sun size={iconSize} />;
    }
  };

  const getCurrentTheme = () => themes.find(t => t.id === theme) || themes[0]!;
  const getCurrentScheme = () => colorSchemes.find(s => s.id === scheme) || colorSchemes[0]!;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  // Toggle variant - simple switch between light/dark
  if (variant === 'toggle') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
          className={`relative ${buttonSizeClasses[size]} rounded-full bg-gray-200 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <div className="relative flex h-5 w-10 items-center">
            <div
              className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform dark:bg-gray-200 ${
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
            <Sun size={12} className="absolute left-1 text-yellow-500" />
            <Moon size={12} className="absolute right-1 text-blue-400" />
          </div>
        </button>
        {showLabels && (
          <span className={`${sizeClasses[size]} text-gray-600 dark:text-gray-400`}>
            {getCurrentTheme().name}
          </span>
        )}
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-2">
          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsSchemeDropdownOpen(false);
              }}
              className={`flex items-center gap-2 ${buttonSizeClasses[size]} rounded-lg border border-gray-200 bg-white px-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700`}
            >
              {getIcon(getCurrentTheme().icon)}
              {showLabels && (
                <span className={`${sizeClasses[size]} text-gray-700 dark:text-gray-300`}>
                  {getCurrentTheme().name}
                </span>
              )}
              <ChevronDown size={14} className="text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2 ${sizeClasses[size]} text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === t.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {getIcon(t.icon)}
                    <div className="flex-1">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.description}</div>
                    </div>
                    {theme === t.id && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Scheme Dropdown */}
          {showColorSchemes && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsSchemeDropdownOpen(!isSchemeDropdownOpen);
                  setIsDropdownOpen(false);
                }}
                className={`flex items-center gap-2 ${buttonSizeClasses[size]} rounded-lg border border-gray-200 bg-white px-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700`}
              >
                <div
                  className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: getCurrentScheme().primary }}
                />
                {showLabels && (
                  <span className={`${sizeClasses[size]} text-gray-700 dark:text-gray-300`}>
                    {getCurrentScheme().name}
                  </span>
                )}
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {isSchemeDropdownOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {colorSchemes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleColorSchemeChange(s.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2 ${sizeClasses[size]} text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        scheme === s.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div
                          className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: s.primary }}
                        />
                        <div
                          className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: s.secondary }}
                        />
                        <div
                          className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: s.accent }}
                        />
                      </div>
                      <span className="flex-1">{s.name}</span>
                      {scheme === s.id && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Buttons variant - all options visible as buttons
  if (variant === 'buttons') {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {/* Theme Buttons */}
        <div>
          {showLabels && (
            <div className={`${sizeClasses[size]} mb-2 font-medium text-gray-700 dark:text-gray-300`}>
              Theme Mode
            </div>
          )}
          <div className="flex gap-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center gap-2 ${buttonSizeClasses[size]} rounded-lg border px-4 transition-all ${
                  theme === t.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {getIcon(t.icon)}
                <span className={sizeClasses[size]}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Buttons */}
        {showColorSchemes && (
          <div>
            {showLabels && (
              <div className={`${sizeClasses[size]} mb-2 font-medium text-gray-700 dark:text-gray-300`}>
                Color Scheme
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {colorSchemes.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleColorSchemeChange(s.id)}
                  className={`flex items-center gap-2 ${buttonSizeClasses[size]} rounded-lg border px-3 transition-all ${
                    scheme === s.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                  }`}
                  title={s.name}
                >
                  <div
                    className="h-5 w-5 rounded-full border-2 border-white shadow dark:border-gray-800"
                    style={{ backgroundColor: s.primary }}
                  />
                  <span className={`${sizeClasses[size]} text-gray-700 dark:text-gray-300`}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Minimal variant - just icons
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => handleThemeChange(t.id)}
          className={`${buttonSizeClasses[size]} rounded-lg transition-all ${
            theme === t.id
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
              : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
          }`}
          title={t.name}
        >
          {getIcon(t.icon)}
        </button>
      ))}

      {showColorSchemes && (
        <>
          <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />
          {colorSchemes.slice(0, 4).map(s => (
            <button
              key={s.id}
              onClick={() => handleColorSchemeChange(s.id)}
              className={`${buttonSizeClasses[size]} rounded-lg transition-all ${
                scheme === s.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
              }`}
              title={s.name}
            >
              <div
                className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: s.primary }}
              />
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default ThemeModeToggle;
