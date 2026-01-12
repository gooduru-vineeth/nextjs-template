'use client';

type NotchStyle = 'dynamic-island' | 'notch' | 'pill' | 'punch-hole' | 'none';
type DeviceModel
  = | 'iphone-15-pro'
    | 'iphone-15'
    | 'iphone-14-pro'
    | 'iphone-14'
    | 'iphone-13'
    | 'iphone-12'
    | 'iphone-11'
    | 'iphone-x'
    | 'iphone-se'
    | 'pixel-8'
    | 'pixel-7'
    | 'samsung-s24'
    | 'samsung-s23';

type NotchOverlayProps = {
  model?: DeviceModel;
  style?: NotchStyle;
  isDarkMode?: boolean;
  className?: string;
};

const deviceNotchStyles: Record<DeviceModel, NotchStyle> = {
  'iphone-15-pro': 'dynamic-island',
  'iphone-15': 'dynamic-island',
  'iphone-14-pro': 'dynamic-island',
  'iphone-14': 'notch',
  'iphone-13': 'notch',
  'iphone-12': 'notch',
  'iphone-11': 'notch',
  'iphone-x': 'notch',
  'iphone-se': 'none',
  'pixel-8': 'punch-hole',
  'pixel-7': 'punch-hole',
  'samsung-s24': 'punch-hole',
  'samsung-s23': 'punch-hole',
};

export function NotchOverlay({
  model = 'iphone-15-pro',
  style,
  isDarkMode = true,
  className = '',
}: NotchOverlayProps) {
  const notchStyle = style || deviceNotchStyles[model] || 'notch';
  const bgColor = isDarkMode ? 'bg-black' : 'bg-black';

  // Dynamic Island (iPhone 14 Pro, 15 Pro)
  if (notchStyle === 'dynamic-island') {
    return (
      <div className={`absolute top-3 left-1/2 -translate-x-1/2 ${className}`}>
        <div className={`h-9 w-32 rounded-full ${bgColor}`}>
          {/* Camera lens indicator */}
          <div className="absolute top-1/2 right-3 size-3 -translate-y-1/2 rounded-full bg-gray-900 ring-1 ring-gray-700">
            <div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  // Traditional notch (iPhone X - 14)
  if (notchStyle === 'notch') {
    return (
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${className}`}>
        <svg width="209" height="30" viewBox="0 0 209 30" fill="none">
          <path
            d="M0 0H209V0C209 0 194.5 0 184 0C173.5 0 171.5 14 161 22C150.5 30 58.5 30 48 22C37.5 14 35.5 0 25 0C14.5 0 0 0 0 0V0Z"
            className={bgColor}
            fill="currentColor"
          />
          {/* Speaker grille */}
          <rect x="80" y="6" width="50" height="5" rx="2.5" fill="#1a1a1a" />
          {/* Camera */}
          <circle cx="150" cy="10" r="5" fill="#1a1a1a" />
          <circle cx="150" cy="10" r="2" fill="#2a2a2a" />
        </svg>
      </div>
    );
  }

  // Pill-shaped cutout
  if (notchStyle === 'pill') {
    return (
      <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${className}`}>
        <div className={`h-6 w-24 rounded-full ${bgColor}`}>
          <div className="absolute top-1/2 right-2 size-2.5 -translate-y-1/2 rounded-full bg-gray-800" />
        </div>
      </div>
    );
  }

  // Punch hole (Android)
  if (notchStyle === 'punch-hole') {
    return (
      <div className={`absolute top-3 left-1/2 -translate-x-1/2 ${className}`}>
        <div className={`size-4 rounded-full ${bgColor}`}>
          <div className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800" />
        </div>
      </div>
    );
  }

  // No notch
  return null;
}

// Safe area indicator for design guidance
type SafeAreaGuideProps = {
  deviceModel?: DeviceModel;
  showTop?: boolean;
  showBottom?: boolean;
  showGuides?: boolean;
  className?: string;
};

export function SafeAreaGuide({
  deviceModel = 'iphone-15-pro',
  showTop = true,
  showBottom = true,
  showGuides = true,
  className = '',
}: SafeAreaGuideProps) {
  const hasNotch = deviceNotchStyles[deviceModel] !== 'none';
  const topInset = hasNotch ? 47 : 20;
  const bottomInset = hasNotch ? 34 : 0;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Top safe area */}
      {showTop && (
        <div
          className="absolute top-0 right-0 left-0 border-b border-dashed border-blue-500/50"
          style={{ height: topInset }}
        >
          {showGuides && (
            <div className="absolute right-2 bottom-0 bg-blue-500/20 px-1 text-[8px] text-blue-500">
              Safe Area Top:
              {' '}
              {topInset}
              px
            </div>
          )}
        </div>
      )}

      {/* Bottom safe area (home indicator) */}
      {showBottom && bottomInset > 0 && (
        <div
          className="absolute right-0 bottom-0 left-0 border-t border-dashed border-blue-500/50"
          style={{ height: bottomInset }}
        >
          {showGuides && (
            <div className="absolute top-0 left-2 bg-blue-500/20 px-1 text-[8px] text-blue-500">
              Safe Area Bottom:
              {' '}
              {bottomInset}
              px
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Home indicator bar (iPhone gesture bar)
type HomeIndicatorProps = {
  isDarkMode?: boolean;
  width?: number;
  className?: string;
};

export function HomeIndicator({
  isDarkMode = false,
  width = 134,
  className = '',
}: HomeIndicatorProps) {
  const barColor = isDarkMode ? 'bg-white' : 'bg-black';

  return (
    <div className={`flex justify-center pt-5 pb-2 ${className}`}>
      <div
        className={`h-[5px] rounded-full ${barColor} opacity-40`}
        style={{ width }}
      />
    </div>
  );
}

// Combined device frame overlay
type DeviceOverlayProps = {
  model?: DeviceModel;
  isDarkMode?: boolean;
  showHomeIndicator?: boolean;
  className?: string;
};

export function DeviceOverlay({
  model = 'iphone-15-pro',
  isDarkMode = true,
  showHomeIndicator = true,
  className = '',
}: DeviceOverlayProps) {
  const notchStyle = deviceNotchStyles[model];
  const hasHomeIndicator = notchStyle !== 'none' && model.includes('iphone');

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Notch/Dynamic Island */}
      <NotchOverlay model={model} isDarkMode={isDarkMode} />

      {/* Home Indicator */}
      {showHomeIndicator && hasHomeIndicator && (
        <div className="absolute right-0 bottom-0 left-0">
          <HomeIndicator isDarkMode={isDarkMode} />
        </div>
      )}
    </div>
  );
}

// Device corner radius helper
type CornerRadiusConfig = {
  outer: number;
  inner: number;
  screen: number;
};

export function getDeviceCornerRadius(model: DeviceModel): CornerRadiusConfig {
  const radiusMap: Record<DeviceModel, CornerRadiusConfig> = {
    'iphone-15-pro': { outer: 55, inner: 47, screen: 39 },
    'iphone-15': { outer: 55, inner: 47, screen: 39 },
    'iphone-14-pro': { outer: 55, inner: 47, screen: 39 },
    'iphone-14': { outer: 47, inner: 40, screen: 32 },
    'iphone-13': { outer: 47, inner: 40, screen: 32 },
    'iphone-12': { outer: 47, inner: 40, screen: 32 },
    'iphone-11': { outer: 41, inner: 34, screen: 26 },
    'iphone-x': { outer: 39, inner: 32, screen: 24 },
    'iphone-se': { outer: 0, inner: 0, screen: 0 },
    'pixel-8': { outer: 24, inner: 20, screen: 16 },
    'pixel-7': { outer: 24, inner: 20, screen: 16 },
    'samsung-s24': { outer: 28, inner: 24, screen: 20 },
    'samsung-s23': { outer: 28, inner: 24, screen: 20 },
  };

  return radiusMap[model] || { outer: 40, inner: 32, screen: 24 };
}

export type { DeviceModel, NotchStyle };
