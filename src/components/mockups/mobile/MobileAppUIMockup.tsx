'use client';

import {
  Battery,
  Bell,
  ChevronLeft,
  Home,
  Search,
  Signal,
  User,
  Wifi,
} from 'lucide-react';

export type MobileOS = 'ios' | 'android' | 'generic';
export type ScreenType = 'home' | 'profile' | 'feed' | 'detail' | 'settings' | 'chat' | 'custom';

export type StatusBarData = {
  time: string;
  carrier?: string;
  batteryLevel?: number;
  wifiEnabled?: boolean;
};

export type TabBarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
};

export type AppHeader = {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  rightActions?: React.ReactNode[];
};

export type MobileAppUIData = {
  appName: string;
  appIcon?: string;
  statusBar?: StatusBarData;
  header?: AppHeader;
  tabBar?: TabBarItem[];
  content: React.ReactNode;
};

export type MobileAppUIMockupProps = {
  data: MobileAppUIData;
  os?: MobileOS;
  screenType?: ScreenType;
  variant?: 'full' | 'compact' | 'screen-only' | 'with-frame';
  deviceColor?: 'black' | 'white' | 'gold' | 'silver';
  showStatusBar?: boolean;
  showNavBar?: boolean;
  showTabBar?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function MobileAppUIMockup({
  data,
  os = 'ios',
  variant = 'full',
  deviceColor = 'black',
  showStatusBar = true,
  showNavBar = true,
  showTabBar = true,
  darkMode = false,
  className = '',
}: MobileAppUIMockupProps) {
  const bgColor = darkMode ? 'bg-black' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-800' : 'border-gray-200';

  const getDeviceFrameColor = () => {
    switch (deviceColor) {
      case 'white':
        return 'bg-gray-100';
      case 'gold':
        return 'bg-amber-100';
      case 'silver':
        return 'bg-gray-200';
      default:
        return 'bg-gray-900';
    }
  };

  const defaultTabBar: TabBarItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={22} />, active: true },
    { id: 'search', label: 'Search', icon: <Search size={22} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={22} />, badge: 3 },
    { id: 'profile', label: 'Profile', icon: <User size={22} /> },
  ];

  const tabItems = data.tabBar || defaultTabBar;

  const renderStatusBar = () => {
    const statusData = data.statusBar || { time: '9:41' };

    if (os === 'ios') {
      return (
        <div className={`flex items-center justify-between px-6 py-2 ${darkMode ? 'text-white' : 'text-black'}`}>
          <div className="w-20">
            <span className="text-sm font-semibold">{statusData.time}</span>
          </div>
          <div className="flex flex-1 justify-center">
            {/* Notch indicator */}
            <div className="h-6 w-28 rounded-full bg-black" />
          </div>
          <div className="flex w-20 items-center justify-end gap-1">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={18} />
          </div>
        </div>
      );
    }

    // Android status bar
    return (
      <div className={`flex items-center justify-between px-4 py-1 ${darkMode ? 'text-white' : 'text-black'}`}>
        <span className="text-sm">{statusData.time}</span>
        <div className="flex items-center gap-1">
          <Wifi size={14} />
          <Signal size={14} />
          <span className="text-xs">
            {statusData.batteryLevel || 85}
            %
          </span>
          <Battery size={16} />
        </div>
      </div>
    );
  };

  const renderNavBar = () => {
    if (!data.header) {
      return null;
    }

    return (
      <div className={`flex items-center justify-between px-4 py-3 ${borderColor} border-b`}>
        <div className="flex items-center gap-3">
          {data.header.showBack && (
            <button className={`p-1 ${mutedColor}`}>
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className={`text-lg font-semibold ${textColor}`}>{data.header.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {data.header.showSearch && (
            <button className={`p-2 ${mutedColor}`}>
              <Search size={20} />
            </button>
          )}
          {data.header.rightActions?.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderTabBar = () => {
    if (os === 'ios') {
      return (
        <div className={`flex items-center justify-around py-2 pb-6 ${borderColor} border-t ${bgColor}`}>
          {tabItems.map(item => (
            <button
              key={item.id}
              className={`flex flex-col items-center gap-1 px-4 py-1 ${
                item.active ? 'text-blue-500' : mutedColor
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      );
    }

    // Android tab bar (bottom navigation)
    return (
      <div className={`flex items-center justify-around py-3 ${borderColor} border-t ${bgColor}`}>
        {tabItems.map(item => (
          <button
            key={item.id}
            className={`flex flex-col items-center gap-0.5 px-4 ${
              item.active ? 'text-blue-500' : mutedColor
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <span className="absolute -top-1 -right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Screen-only variant
  if (variant === 'screen-only') {
    return (
      <div className={`${bgColor} ${className}`}>
        {showNavBar && renderNavBar()}
        <div className="flex-1 overflow-y-auto">
          {data.content}
        </div>
        {showTabBar && renderTabBar()}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`w-64 overflow-hidden rounded-2xl border ${borderColor} shadow-lg ${className}`}>
        <div className={bgColor}>
          {showStatusBar && (
            <div className={`flex items-center justify-between px-4 py-1 text-xs ${darkMode ? 'text-white' : 'text-black'}`}>
              <span>{data.statusBar?.time || '9:41'}</span>
              <div className="flex items-center gap-1">
                <Wifi size={12} />
                <Battery size={14} />
              </div>
            </div>
          )}
          {showNavBar && data.header && (
            <div className={`px-3 py-2 ${borderColor} border-b`}>
              <h1 className={`text-sm font-semibold ${textColor}`}>{data.header.title}</h1>
            </div>
          )}
          <div className="h-48 overflow-hidden">
            {data.content}
          </div>
          {showTabBar && (
            <div className={`flex items-center justify-around py-2 ${borderColor} border-t`}>
              {tabItems.slice(0, 4).map(item => (
                <button
                  key={item.id}
                  className={item.active ? 'text-blue-500' : mutedColor}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // With-frame variant
  if (variant === 'with-frame') {
    return (
      <div className={`inline-block ${className}`}>
        <div className={`${getDeviceFrameColor()} rounded-[3rem] p-3 shadow-2xl`}>
          <div className={`h-[680px] w-80 ${bgColor} flex flex-col overflow-hidden rounded-[2.5rem]`}>
            {showStatusBar && renderStatusBar()}
            {showNavBar && renderNavBar()}
            <div className="flex-1 overflow-y-auto">
              {data.content}
            </div>
            {showTabBar && renderTabBar()}
            {/* Home indicator */}
            {os === 'ios' && (
              <div className="flex justify-center py-2">
                <div className="h-1 w-32 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`w-80 ${bgColor} overflow-hidden rounded-3xl border ${borderColor} flex flex-col shadow-xl ${className}`}>
      {/* Status Bar */}
      {showStatusBar && renderStatusBar()}

      {/* Navigation Bar */}
      {showNavBar && renderNavBar()}

      {/* Main Content */}
      <div className="min-h-[400px] flex-1 overflow-y-auto">
        {data.content}
      </div>

      {/* Tab Bar */}
      {showTabBar && renderTabBar()}

      {/* Home Indicator (iOS) */}
      {os === 'ios' && (
        <div className={`flex justify-center py-2 ${bgColor}`}>
          <div className="h-1 w-32 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      )}
    </div>
  );
}
