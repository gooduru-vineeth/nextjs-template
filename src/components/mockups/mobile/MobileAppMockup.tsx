'use client';

import {
  Battery,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Image,
  Layers,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Signal,
  Square,
  Trash2,
  Type,
  User,
  Wifi,
} from 'lucide-react';
import React, { useCallback, useState } from 'react';

// Types
export type DeviceType = 'iphone-15-pro' | 'iphone-15' | 'iphone-se' | 'pixel-8' | 'galaxy-s24' | 'ipad-pro' | 'ipad-mini';

export type ScreenType = 'home' | 'list' | 'detail' | 'profile' | 'settings' | 'login' | 'onboarding' | 'custom';

export type DeviceSpecs = {
  name: string;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  borderRadius: number;
  notch: boolean;
  dynamicIsland: boolean;
  homeIndicator: boolean;
  statusBarHeight: number;
};

export type AppElement = {
  id: string;
  type: 'text' | 'button' | 'image' | 'icon' | 'input' | 'card' | 'list-item' | 'nav-bar' | 'tab-bar' | 'header';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, string | number>;
  children?: AppElement[];
};

export type AppScreen = {
  id: string;
  name: string;
  type: ScreenType;
  elements: AppElement[];
  backgroundColor: string;
};

export type MobileAppMockupProps = {
  variant?: 'editor' | 'preview' | 'thumbnail';
  device?: DeviceType;
  screens?: AppScreen[];
  onScreenChange?: (screens: AppScreen[]) => void;
  onExport?: () => void;
  showControls?: boolean;
  className?: string;
};

// Device specifications
const deviceSpecs: Record<DeviceType, DeviceSpecs> = {
  'iphone-15-pro': {
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    screenWidth: 373,
    screenHeight: 812,
    borderRadius: 55,
    notch: false,
    dynamicIsland: true,
    homeIndicator: true,
    statusBarHeight: 54,
  },
  'iphone-15': {
    name: 'iPhone 15',
    width: 390,
    height: 844,
    screenWidth: 370,
    screenHeight: 804,
    borderRadius: 47,
    notch: true,
    dynamicIsland: false,
    homeIndicator: true,
    statusBarHeight: 47,
  },
  'iphone-se': {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    screenWidth: 355,
    screenHeight: 647,
    borderRadius: 0,
    notch: false,
    dynamicIsland: false,
    homeIndicator: false,
    statusBarHeight: 20,
  },
  'pixel-8': {
    name: 'Google Pixel 8',
    width: 412,
    height: 915,
    screenWidth: 392,
    screenHeight: 875,
    borderRadius: 40,
    notch: false,
    dynamicIsland: false,
    homeIndicator: true,
    statusBarHeight: 24,
  },
  'galaxy-s24': {
    name: 'Samsung Galaxy S24',
    width: 412,
    height: 915,
    screenWidth: 392,
    screenHeight: 875,
    borderRadius: 35,
    notch: false,
    dynamicIsland: false,
    homeIndicator: true,
    statusBarHeight: 24,
  },
  'ipad-pro': {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    screenWidth: 1004,
    screenHeight: 1346,
    borderRadius: 18,
    notch: false,
    dynamicIsland: false,
    homeIndicator: true,
    statusBarHeight: 24,
  },
  'ipad-mini': {
    name: 'iPad Mini',
    width: 744,
    height: 1133,
    screenWidth: 724,
    screenHeight: 1113,
    borderRadius: 18,
    notch: false,
    dynamicIsland: false,
    homeIndicator: true,
    statusBarHeight: 24,
  },
};

// Default screens
const createDefaultScreens = (): AppScreen[] => [
  {
    id: 'home',
    name: 'Home',
    type: 'home',
    backgroundColor: '#FFFFFF',
    elements: [
      {
        id: 'header',
        type: 'header',
        x: 0,
        y: 0,
        width: 100,
        height: 60,
        content: 'My App',
        style: { backgroundColor: '#3B82F6', color: '#FFFFFF' },
      },
      {
        id: 'card-1',
        type: 'card',
        x: 16,
        y: 80,
        width: 341,
        height: 120,
        content: 'Featured Content',
        style: { backgroundColor: '#F3F4F6', borderRadius: 12 },
      },
      {
        id: 'tab-bar',
        type: 'tab-bar',
        x: 0,
        y: 752,
        width: 100,
        height: 80,
        style: { backgroundColor: '#FFFFFF' },
      },
    ],
  },
];

// Status bar component
export const StatusBar: React.FC<{
  device: DeviceType;
  time?: string;
  darkMode?: boolean;
}> = ({ device, time = '9:41', darkMode = false }) => {
  const specs = deviceSpecs[device];
  const textColor = darkMode ? 'text-white' : 'text-black';

  return (
    <div
      className={`flex items-center justify-between px-6 ${textColor}`}
      style={{ height: specs.statusBarHeight }}
    >
      <span className="text-sm font-semibold">{time}</span>
      {specs.dynamicIsland && (
        <div className="absolute top-3 left-1/2 h-9 w-28 -translate-x-1/2 rounded-full bg-black" />
      )}
      {specs.notch && (
        <div className="absolute top-0 left-1/2 h-8 w-40 -translate-x-1/2 rounded-b-3xl bg-black" />
      )}
      <div className="flex items-center gap-1">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Battery className="h-5 w-5" />
      </div>
    </div>
  );
};

// App header component
export const AppHeader: React.FC<{
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  backgroundColor?: string;
  textColor?: string;
}> = ({
  title,
  showBack = false,
  showMenu = false,
  backgroundColor = '#3B82F6',
  textColor = '#FFFFFF',
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ backgroundColor }}
    >
      {showBack
        ? (
            <button className="p-1">
              <ChevronLeft className="h-6 w-6" style={{ color: textColor }} />
            </button>
          )
        : (
            <div className="w-8" />
          )}
      <h1 className="text-lg font-semibold" style={{ color: textColor }}>
        {title}
      </h1>
      {showMenu
        ? (
            <button className="p-1">
              <MoreHorizontal className="h-6 w-6" style={{ color: textColor }} />
            </button>
          )
        : (
            <div className="w-8" />
          )}
    </div>
  );
};

// Tab bar component
export const TabBar: React.FC<{
  activeTab?: number;
  tabs?: { icon: React.ReactNode; label: string }[];
}> = ({
  activeTab = 0,
  tabs = [
    { icon: <Home className="h-5 w-5" />, label: 'Home' },
    { icon: <Search className="h-5 w-5" />, label: 'Search' },
    { icon: <Heart className="h-5 w-5" />, label: 'Favorites' },
    { icon: <User className="h-5 w-5" />, label: 'Profile' },
  ],
}) => {
  return (
    <div className="flex items-center justify-around border-t border-gray-200 bg-white py-2">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${
            activeTab === index ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          {tab.icon}
          <span className="text-xs">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// Card component
export const MockupCard: React.FC<{
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  actions?: boolean;
}> = ({
  title = 'Card Title',
  subtitle = 'Card description goes here',
  imageUrl,
  actions = false,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {imageUrl && (
        <div className="flex h-32 items-center justify-center bg-gray-200">
          <Image className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        {actions && (
          <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
            <button className="flex items-center gap-1 text-gray-500">
              <Heart className="h-4 w-4" />
              <span className="text-xs">24</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">12</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// List item component
export const ListItem: React.FC<{
  title: string;
  subtitle?: string;
  avatar?: boolean;
  chevron?: boolean;
}> = ({ title, subtitle, avatar = false, chevron = false }) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
      {avatar && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <User className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-gray-900">{title}</div>
        {subtitle && <div className="truncate text-sm text-gray-500">{subtitle}</div>}
      </div>
      {chevron && <ChevronRight className="h-5 w-5 text-gray-400" />}
    </div>
  );
};

// Device frame component
export const DeviceFrame: React.FC<{
  device: DeviceType;
  children: React.ReactNode;
  scale?: number;
  showFrame?: boolean;
}> = ({ device, children, scale = 1, showFrame = true }) => {
  const specs = deviceSpecs[device];

  if (!showFrame) {
    return (
      <div
        style={{
          width: specs.screenWidth * scale,
          height: specs.screenHeight * scale,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="overflow-hidden bg-white"
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="relative bg-gray-900 shadow-2xl"
      style={{
        width: specs.width * scale,
        height: specs.height * scale,
        borderRadius: specs.borderRadius * scale,
        padding: ((specs.width - specs.screenWidth) / 2) * scale,
      }}
    >
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{
          width: specs.screenWidth * scale,
          height: specs.screenHeight * scale,
          borderRadius: (specs.borderRadius - 10) * scale,
        }}
      >
        {children}
      </div>

      {/* Home indicator */}
      {specs.homeIndicator && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gray-800"
          style={{
            width: 134 * scale,
            height: 5 * scale,
          }}
        />
      )}
    </div>
  );
};

// Element palette
export const ElementPalette: React.FC<{
  onAddElement: (type: AppElement['type']) => void;
}> = ({ onAddElement }) => {
  const elements: { type: AppElement['type']; icon: React.ReactNode; label: string }[] = [
    { type: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
    { type: 'button', icon: <Square className="h-4 w-4" />, label: 'Button' },
    { type: 'image', icon: <Image className="h-4 w-4" />, label: 'Image' },
    { type: 'input', icon: <Type className="h-4 w-4" />, label: 'Input' },
    { type: 'card', icon: <Square className="h-4 w-4" />, label: 'Card' },
    { type: 'list-item', icon: <Menu className="h-4 w-4" />, label: 'List Item' },
    { type: 'header', icon: <Square className="h-4 w-4" />, label: 'Header' },
    { type: 'tab-bar', icon: <Menu className="h-4 w-4" />, label: 'Tab Bar' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {elements.map(el => (
        <button
          key={el.type}
          onClick={() => onAddElement(el.type)}
          className="flex flex-col items-center gap-1 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {el.icon}
          <span className="text-xs text-gray-600 dark:text-gray-400">{el.label}</span>
        </button>
      ))}
    </div>
  );
};

// Screen preview template
const ScreenPreview: React.FC<{
  screen: AppScreen;
  device: DeviceType;
}> = ({ screen, device }) => {
  // Render home screen template
  if (screen.type === 'home') {
    return (
      <div className="flex h-full flex-col" style={{ backgroundColor: screen.backgroundColor }}>
        <StatusBar device={device} />
        <AppHeader title="Home" showMenu />
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <MockupCard title="Featured" subtitle="Check out the latest updates" imageUrl="placeholder" actions />
          <div className="grid grid-cols-2 gap-3">
            <MockupCard title="Item 1" subtitle="Description" />
            <MockupCard title="Item 2" subtitle="Description" />
          </div>
        </div>
        <TabBar />
      </div>
    );
  }

  // Render list screen template
  if (screen.type === 'list') {
    return (
      <div className="flex h-full flex-col" style={{ backgroundColor: screen.backgroundColor }}>
        <StatusBar device={device} />
        <AppHeader title="List" showBack />
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ListItem key={i} title={`Item ${i}`} subtitle="Subtitle text" avatar chevron />
          ))}
        </div>
        <TabBar activeTab={1} />
      </div>
    );
  }

  // Render profile screen template
  if (screen.type === 'profile') {
    return (
      <div className="flex h-full flex-col" style={{ backgroundColor: screen.backgroundColor }}>
        <StatusBar device={device} />
        <div className="flex-1 overflow-y-auto">
          <div className="relative h-32 bg-blue-500">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="px-4 pt-16 text-center">
            <h2 className="text-xl font-bold text-gray-900">John Doe</h2>
            <p className="text-gray-500">@johndoe</p>
            <div className="mt-4 flex justify-center gap-8">
              <div className="text-center">
                <div className="font-bold text-gray-900">128</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">1.2K</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">348</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
            </div>
            <button className="mt-4 rounded-full bg-blue-500 px-6 py-2 font-medium text-white">
              Edit Profile
            </button>
          </div>
        </div>
        <TabBar activeTab={3} />
      </div>
    );
  }

  // Render settings screen template
  if (screen.type === 'settings') {
    return (
      <div className="flex h-full flex-col bg-gray-100" style={{ backgroundColor: screen.backgroundColor }}>
        <StatusBar device={device} />
        <AppHeader title="Settings" showBack />
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="overflow-hidden rounded-xl bg-white">
            <ListItem title="Account" subtitle="Manage your account" chevron />
            <ListItem title="Privacy" subtitle="Control your privacy settings" chevron />
            <ListItem title="Notifications" subtitle="Customize notifications" chevron />
          </div>
          <div className="overflow-hidden rounded-xl bg-white">
            <ListItem title="Help & Support" chevron />
            <ListItem title="About" chevron />
          </div>
        </div>
      </div>
    );
  }

  // Custom or default
  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: screen.backgroundColor }}>
      <StatusBar device={device} />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-400">
          <Layers className="mx-auto mb-2 h-12 w-12" />
          <p>Custom Screen</p>
        </div>
      </div>
    </div>
  );
};

// Main component
export const MobileAppMockup: React.FC<MobileAppMockupProps> = ({
  variant = 'editor',
  device: propDevice = 'iphone-15-pro',
  screens: propScreens,
  onScreenChange,
  onExport,
  showControls = true,
  className = '',
}) => {
  const [device, setDevice] = useState<DeviceType>(propDevice);
  const [screens, setScreens] = useState<AppScreen[]>(() => propScreens || createDefaultScreens());
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [showPalette, setShowPalette] = useState(false);
  const [scale, setScale] = useState(0.65);

  const activeScreen = screens[activeScreenIndex] || screens[0]!;

  const handleAddScreen = useCallback(() => {
    const newScreen: AppScreen = {
      id: `screen-${Date.now()}`,
      name: `Screen ${screens.length + 1}`,
      type: 'custom',
      backgroundColor: '#FFFFFF',
      elements: [],
    };
    const updatedScreens = [...screens, newScreen];
    setScreens(updatedScreens);
    setActiveScreenIndex(updatedScreens.length - 1);
    onScreenChange?.(updatedScreens);
  }, [screens, onScreenChange]);

  const handleDeleteScreen = useCallback((index: number) => {
    if (screens.length <= 1) {
      return;
    }
    const updatedScreens = screens.filter((_, i) => i !== index);
    setScreens(updatedScreens);
    if (activeScreenIndex >= updatedScreens.length) {
      setActiveScreenIndex(updatedScreens.length - 1);
    }
    onScreenChange?.(updatedScreens);
  }, [screens, activeScreenIndex, onScreenChange]);

  const handleAddElement = useCallback((type: AppElement['type']) => {
    const newElement: AppElement = {
      id: `element-${Date.now()}`,
      type,
      x: 50,
      y: 100,
      width: 200,
      height: type === 'button' ? 44 : type === 'input' ? 48 : 100,
      content: type === 'text' ? 'Text Label' : type === 'button' ? 'Button' : undefined,
    };
    const updatedScreens = screens.map((s, i) =>
      i === activeScreenIndex ? { ...s, elements: [...s.elements, newElement] } : s,
    );
    setScreens(updatedScreens);
    onScreenChange?.(updatedScreens);
    setShowPalette(false);
  }, [screens, activeScreenIndex, onScreenChange]);

  // Thumbnail variant
  if (variant === 'thumbnail') {
    return (
      <div className={`${className}`}>
        <DeviceFrame device={device} scale={0.2}>
          <ScreenPreview screen={activeScreen} device={device} />
        </DeviceFrame>
      </div>
    );
  }

  // Preview variant
  if (variant === 'preview') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 p-8 dark:bg-gray-800 ${className}`}>
        <DeviceFrame device={device} scale={scale}>
          <ScreenPreview screen={activeScreen} device={device} />
        </DeviceFrame>
      </div>
    );
  }

  // Editor variant
  return (
    <div className={`flex h-full bg-gray-100 dark:bg-gray-900 ${className}`}>
      {/* Left sidebar - Screens */}
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Screens</h3>
            <button
              onClick={handleAddScreen}
              className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-2">
          {screens.map((screen, index) => (
            <div
              key={screen.id}
              onClick={() => setActiveScreenIndex(index)}
              className={`group cursor-pointer rounded-lg p-2 transition-colors ${
                activeScreenIndex === index
                  ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="mb-2 aspect-[9/16] overflow-hidden rounded bg-gray-100 dark:bg-gray-600">
                <div className="h-[666%] w-[666%] origin-top-left scale-[0.15] transform">
                  <ScreenPreview screen={screen} device={device} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {screen.name}
                </span>
                {screens.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScreen(index);
                    }}
                    className="rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main canvas area */}
      <div className="flex flex-1 flex-col">
        {/* Toolbar */}
        {showControls && (
          <div className="border-b border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Device selector */}
                <select
                  value={device}
                  onChange={e => setDevice(e.target.value as DeviceType)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700"
                >
                  <optgroup label="iPhone">
                    <option value="iphone-15-pro">iPhone 15 Pro</option>
                    <option value="iphone-15">iPhone 15</option>
                    <option value="iphone-se">iPhone SE</option>
                  </optgroup>
                  <optgroup label="Android">
                    <option value="pixel-8">Google Pixel 8</option>
                    <option value="galaxy-s24">Samsung Galaxy S24</option>
                  </optgroup>
                  <optgroup label="Tablet">
                    <option value="ipad-pro">iPad Pro 12.9"</option>
                    <option value="ipad-mini">iPad Mini</option>
                  </optgroup>
                </select>

                {/* Scale */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Scale:</span>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={scale}
                    onChange={e => setScale(Number.parseFloat(e.target.value))}
                    className="w-24"
                  />
                  <span className="w-12 text-sm text-gray-600">
                    {Math.round(scale * 100)}
                    %
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPalette(!showPalette)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
                    showPalette
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add Element
                </button>
                {onExport && (
                  <button
                    onClick={onExport}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-white hover:bg-blue-700"
                  >
                    Export
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-8">
          <DeviceFrame device={device} scale={scale}>
            <ScreenPreview screen={activeScreen} device={device} />
          </DeviceFrame>
        </div>
      </div>

      {/* Right sidebar - Properties / Element palette */}
      <div className="w-64 border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {showPalette
          ? (
              <div>
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Add Element</h3>
                  <button
                    onClick={() => setShowPalette(false)}
                    className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ×
                  </button>
                </div>
                <ElementPalette onAddElement={handleAddElement} />
              </div>
            )
          : (
              <div>
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Screen Properties</h3>
                </div>
                <div className="space-y-4 p-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Screen Name
                    </label>
                    <input
                      type="text"
                      value={activeScreen.name}
                      onChange={(e) => {
                        const updatedScreens = screens.map((s, i) =>
                          i === activeScreenIndex ? { ...s, name: e.target.value } : s,
                        );
                        setScreens(updatedScreens);
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Screen Type
                    </label>
                    <select
                      value={activeScreen.type}
                      onChange={(e) => {
                        const updatedScreens = screens.map((s, i) =>
                          i === activeScreenIndex ? { ...s, type: e.target.value as ScreenType } : s,
                        );
                        setScreens(updatedScreens);
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                    >
                      <option value="home">Home</option>
                      <option value="list">List</option>
                      <option value="detail">Detail</option>
                      <option value="profile">Profile</option>
                      <option value="settings">Settings</option>
                      <option value="login">Login</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeScreen.backgroundColor}
                        onChange={(e) => {
                          const updatedScreens = screens.map((s, i) =>
                            i === activeScreenIndex ? { ...s, backgroundColor: e.target.value } : s,
                          );
                          setScreens(updatedScreens);
                        }}
                        className="h-10 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={activeScreen.backgroundColor}
                        onChange={(e) => {
                          const updatedScreens = screens.map((s, i) =>
                            i === activeScreenIndex ? { ...s, backgroundColor: e.target.value } : s,
                          );
                          setScreens(updatedScreens);
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-gray-600 dark:bg-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
};

export default MobileAppMockup;
