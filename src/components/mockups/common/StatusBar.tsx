'use client';

import type { ThemeMode } from '@/types/Mockup';

type StatusBarProps = {
  time?: string;
  batteryLevel?: number;
  signalStrength?: number;
  carrier?: string;
  theme?: ThemeMode;
  variant?: 'ios' | 'android';
};

export function StatusBar({
  time = '9:41',
  batteryLevel = 100,
  signalStrength = 4,
  carrier = '',
  theme = 'light',
  variant = 'ios',
}: StatusBarProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-black';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-white';

  if (variant === 'ios') {
    return (
      <div className={`flex h-11 items-center justify-between px-6 ${bgColor}`}>
        {/* Left side - Time */}
        <div className={`text-base font-semibold ${textColor}`}>
          {time}
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center gap-1">
          {/* Signal */}
          <div className="flex items-end gap-0.5">
            {[1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-0.5 rounded-sm ${
                  level <= signalStrength
                    ? isDark ? 'bg-white' : 'bg-black'
                    : isDark ? 'bg-gray-600' : 'bg-gray-300'
                }`}
                style={{ height: `${level * 2 + 2}px` }}
              />
            ))}
          </div>

          {/* Carrier */}
          {carrier && (
            <span className={`ml-1 text-xs ${textColor}`}>{carrier}</span>
          )}

          {/* WiFi */}
          <svg className={`ml-1 size-4 ${textColor}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-4c2.8 0 5.3 1.1 7.2 2.9l-2.8 2.8C15.2 18.6 13.7 18 12 18s-3.2.6-4.4 1.7L4.8 16.9C6.7 15.1 9.2 14 12 14zm0-4c4 0 7.6 1.6 10.2 4.2l-2.8 2.8C17.4 15 14.8 14 12 14s-5.4 1-7.4 3l-2.8-2.8C4.4 11.6 8 10 12 10zm0-4c5.2 0 9.9 2.1 13.4 5.5l-2.8 2.8C20 11.5 16.2 10 12 10s-8 1.5-10.6 4.3L-1.4 11.5C2.1 8.1 6.8 6 12 6z" />
          </svg>

          {/* Battery */}
          <div className="ml-1 flex items-center">
            <div className={`relative h-3 w-6 rounded-sm border ${isDark ? 'border-white' : 'border-black'}`}>
              <div
                className={`absolute inset-0.5 rounded-xs ${
                  batteryLevel > 20
                    ? isDark ? 'bg-white' : 'bg-black'
                    : 'bg-red-500'
                }`}
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
            <div
              className={`ml-0.5 h-1.5 w-0.5 rounded-r-sm ${isDark ? 'bg-white' : 'bg-black'}`}
            />
          </div>
        </div>
      </div>
    );
  }

  // Android variant
  return (
    <div className={`flex h-6 items-center justify-between px-4 ${bgColor}`}>
      {/* Left side - Time */}
      <div className={`text-xs font-medium ${textColor}`}>
        {time}
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center gap-2">
        {/* Signal */}
        <svg className={`size-4 ${textColor}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 22h20V2L2 22zm18-2H6.83L20 6.83V20z" />
        </svg>

        {/* WiFi */}
        <svg className={`size-4 ${textColor}`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" />
        </svg>

        {/* Battery */}
        <div className="flex items-center">
          <span className={`mr-1 text-xs ${textColor}`}>
            {batteryLevel}
            %
          </span>
          <div className={`relative h-3 w-5 rounded-sm border ${isDark ? 'border-white' : 'border-black'}`}>
            <div
              className={`absolute inset-0.5 ${
                batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
