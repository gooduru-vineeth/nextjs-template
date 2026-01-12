'use client';

type DeviceType = 'iphone' | 'android' | 'ipad' | 'tablet';
type CarrierSignal = 0 | 1 | 2 | 3 | 4;
type WifiSignal = 0 | 1 | 2 | 3;
type BatteryLevel = number; // 0-100

type StatusBarProps = {
  deviceType?: DeviceType;
  time?: string;
  carrier?: string;
  carrierSignal?: CarrierSignal;
  wifiSignal?: WifiSignal;
  batteryLevel?: BatteryLevel;
  isCharging?: boolean;
  is5G?: boolean;
  isDarkMode?: boolean;
  showNotch?: boolean;
  className?: string;
};

export function StatusBar({
  deviceType = 'iphone',
  time,
  carrier: _carrier = 'Carrier',
  carrierSignal = 4,
  wifiSignal = 3,
  batteryLevel = 80,
  isCharging = false,
  is5G = true,
  isDarkMode = false,
  showNotch = true,
  className = '',
}: StatusBarProps) {
  void _carrier; // Reserved for future carrier display
  const currentTime = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';

  const renderSignalBars = (signal: number, maxBars: number) => {
    return (
      <div className="flex items-end gap-[1px]">
        {Array.from({ length: maxBars }, (_, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-sm ${
              i < signal ? (isDarkMode ? 'bg-white' : 'bg-black') : 'bg-gray-400'
            }`}
            style={{ height: `${4 + i * 2}px` }}
          />
        ))}
      </div>
    );
  };

  const renderWifiBars = (signal: WifiSignal) => {
    return (
      <svg className={`size-4 ${textColor}`} viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9z"
          opacity={signal >= 1 ? 1 : 0.3}
        />
        <path
          d="M5 13l2 2c2.76-2.76 7.24-2.76 10 0l2-2C14.14 8.14 9.87 8.14 5 13z"
          opacity={signal >= 2 ? 1 : 0.3}
        />
        <path
          d="M9 17l3 3 3-3c-1.65-1.66-4.34-1.66-6 0z"
          opacity={signal >= 3 ? 1 : 0.3}
        />
      </svg>
    );
  };

  const renderBattery = () => {
    const fillWidth = Math.min(100, Math.max(0, batteryLevel));
    const batteryColor = batteryLevel <= 20
      ? 'fill-red-500'
      : isCharging
        ? 'fill-green-500'
        : isDarkMode
          ? 'fill-white'
          : 'fill-black';

    return (
      <div className="flex items-center gap-1">
        {batteryLevel <= 100 && (
          <span className={`text-[10px] ${textColor}`}>
            {batteryLevel}
            %
          </span>
        )}
        <svg className="h-3 w-6" viewBox="0 0 25 12">
          {/* Battery body */}
          <rect
            x="0.5"
            y="0.5"
            width="21"
            height="11"
            rx="2"
            ry="2"
            fill="none"
            stroke={isDarkMode ? 'white' : 'black'}
            strokeWidth="1"
          />
          {/* Battery fill */}
          <rect
            x="2"
            y="2"
            width={(18 * fillWidth) / 100}
            height="8"
            rx="1"
            className={batteryColor}
          />
          {/* Battery tip */}
          <path
            d="M23 4v4c1 0 2-.5 2-2s-1-2-2-2z"
            fill={isDarkMode ? 'white' : 'black'}
            opacity="0.4"
          />
          {/* Charging bolt */}
          {isCharging && (
            <path
              d="M12 2L9 6h2l-1 4 4-5h-2l1-3z"
              fill={isDarkMode ? 'black' : 'white'}
            />
          )}
        </svg>
      </div>
    );
  };

  // iPhone style status bar
  if (deviceType === 'iphone' || deviceType === 'ipad') {
    return (
      <div className={`relative ${bgColor} ${className}`}>
        {showNotch && deviceType === 'iphone' && (
          <div className="absolute top-0 left-1/2 h-7 w-36 -translate-x-1/2 rounded-b-3xl bg-black" />
        )}
        <div className={`flex h-11 items-center justify-between px-6 ${textColor}`}>
          {/* Left side - Time (iPhone) */}
          <div className="w-24">
            <span className="text-sm font-semibold">{currentTime}</span>
          </div>

          {/* Right side - Status icons */}
          <div className="flex w-24 items-center justify-end gap-1">
            {renderSignalBars(carrierSignal, 4)}
            {is5G && <span className="text-[10px] font-semibold">5G</span>}
            {renderWifiBars(wifiSignal)}
            {renderBattery()}
          </div>
        </div>
      </div>
    );
  }

  // Android style status bar
  return (
    <div className={`flex h-6 items-center justify-between px-4 ${bgColor} ${textColor} ${className}`}>
      {/* Left side - Time and notifications */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">{currentTime}</span>
        {/* Notification icons placeholder */}
      </div>

      {/* Right side - Status icons */}
      <div className="flex items-center gap-2">
        {renderSignalBars(carrierSignal, 4)}
        {is5G && <span className="text-[9px] font-semibold">5G</span>}
        {renderWifiBars(wifiSignal)}
        {renderBattery()}
      </div>
    </div>
  );
}

// Compact time display for mockups
type TimeDisplayProps = {
  time?: string;
  format?: '12h' | '24h';
  isDarkMode?: boolean;
  className?: string;
};

export function TimeDisplay({
  time,
  format = '12h',
  isDarkMode = false,
  className = '',
}: TimeDisplayProps) {
  const getFormattedTime = () => {
    if (time) {
      return time;
    }
    const now = new Date();
    if (format === '24h') {
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'} ${className}`}>
      {getFormattedTime()}
    </span>
  );
}

// Battery indicator only
type BatteryIndicatorProps = {
  level?: number;
  isCharging?: boolean;
  isDarkMode?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function BatteryIndicator({
  level = 80,
  isCharging = false,
  isDarkMode = false,
  showPercentage = true,
  size = 'md',
  className = '',
}: BatteryIndicatorProps) {
  const sizeConfig = {
    sm: { width: 20, height: 10, text: 'text-[8px]' },
    md: { width: 25, height: 12, text: 'text-[10px]' },
    lg: { width: 32, height: 16, text: 'text-xs' },
  };

  const { width, height, text } = sizeConfig[size];
  const fillWidth = Math.min(100, Math.max(0, level));
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const batteryColor = level <= 20
    ? 'fill-red-500'
    : isCharging
      ? 'fill-green-500'
      : isDarkMode
        ? 'fill-white'
        : 'fill-black';

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showPercentage && (
        <span className={`${text} ${textColor}`}>
          {level}
          %
        </span>
      )}
      <svg width={width} height={height} viewBox="0 0 25 12">
        <rect
          x="0.5"
          y="0.5"
          width="21"
          height="11"
          rx="2"
          fill="none"
          stroke={isDarkMode ? 'white' : 'black'}
          strokeWidth="1"
        />
        <rect
          x="2"
          y="2"
          width={(18 * fillWidth) / 100}
          height="8"
          rx="1"
          className={batteryColor}
        />
        <path
          d="M23 4v4c1 0 2-.5 2-2s-1-2-2-2z"
          fill={isDarkMode ? 'white' : 'black'}
          opacity="0.4"
        />
        {isCharging && (
          <path
            d="M12 2L9 6h2l-1 4 4-5h-2l1-3z"
            fill={isDarkMode ? 'black' : 'white'}
          />
        )}
      </svg>
    </div>
  );
}

// Network signal indicator
type NetworkIndicatorProps = {
  signal?: CarrierSignal;
  type?: '4G' | '5G' | 'LTE' | '3G';
  carrier?: string;
  isDarkMode?: boolean;
  className?: string;
};

export function NetworkIndicator({
  signal = 4,
  type = '5G',
  carrier,
  isDarkMode = false,
  className = '',
}: NetworkIndicatorProps) {
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const barColor = isDarkMode ? 'bg-white' : 'bg-black';

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {carrier && (
        <span className={`text-[10px] ${textColor}`}>{carrier}</span>
      )}
      <div className="flex items-end gap-[1px]">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-sm ${
              i < signal ? barColor : 'bg-gray-400'
            }`}
            style={{ height: `${4 + i * 2}px` }}
          />
        ))}
      </div>
      <span className={`text-[9px] font-semibold ${textColor}`}>{type}</span>
    </div>
  );
}
