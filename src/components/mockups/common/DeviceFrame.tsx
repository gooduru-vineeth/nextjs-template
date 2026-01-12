'use client';

import type { ReactNode } from 'react';

export type DeviceType
  = | 'iphone-15-pro'
    | 'iphone-14'
    | 'iphone-se'
    | 'pixel-8'
    | 'samsung-s24'
    | 'macbook-pro'
    | 'browser-chrome'
    | 'browser-safari'
    | 'none';

type DeviceFrameProps = {
  device: DeviceType;
  children: ReactNode;
  className?: string;
};

const deviceDimensions: Record<DeviceType, { width: number; height: number; borderRadius: number }> = {
  'iphone-15-pro': { width: 393, height: 852, borderRadius: 55 },
  'iphone-14': { width: 390, height: 844, borderRadius: 47 },
  'iphone-se': { width: 375, height: 667, borderRadius: 0 },
  'pixel-8': { width: 412, height: 915, borderRadius: 40 },
  'samsung-s24': { width: 412, height: 915, borderRadius: 35 },
  'macbook-pro': { width: 1440, height: 900, borderRadius: 10 },
  'browser-chrome': { width: 1280, height: 800, borderRadius: 8 },
  'browser-safari': { width: 1280, height: 800, borderRadius: 10 },
  'none': { width: 375, height: 812, borderRadius: 0 },
};

function IPhoneFrame({ children, variant }: { children: ReactNode; variant: 'pro' | 'standard' | 'se' }) {
  const isProOrStandard = variant === 'pro' || variant === 'standard';
  const borderRadius = variant === 'pro' ? 55 : variant === 'standard' ? 47 : 0;

  return (
    <div className="relative inline-block">
      {/* Device outer frame */}
      <div
        className="relative bg-[#1a1a1a] p-3"
        style={{ borderRadius: borderRadius + 8 }}
      >
        {/* Side buttons - left */}
        <div className="absolute top-28 -left-1 h-8 w-1 rounded-l bg-[#2a2a2a]" />
        <div className="absolute top-44 -left-1 h-16 w-1 rounded-l bg-[#2a2a2a]" />
        <div className="absolute top-64 -left-1 h-16 w-1 rounded-l bg-[#2a2a2a]" />

        {/* Side buttons - right */}
        <div className="absolute top-36 -right-1 h-20 w-1 rounded-r bg-[#2a2a2a]" />

        {/* Screen bezel */}
        <div
          className="relative overflow-hidden bg-black"
          style={{ borderRadius }}
        >
          {/* Dynamic Island / Notch */}
          {variant === 'pro' && (
            <div className="absolute top-3 left-1/2 z-20 h-9 w-32 -translate-x-1/2 rounded-full bg-black" />
          )}
          {variant === 'standard' && (
            <div className="absolute top-0 left-1/2 z-20 h-8 w-40 -translate-x-1/2 rounded-b-3xl bg-black" />
          )}

          {/* Home button for SE */}
          {variant === 'se' && (
            <>
              <div className="absolute top-2 left-1/2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#222]" />
              <div className="absolute bottom-2 left-1/2 z-20 size-12 -translate-x-1/2 rounded-full border-2 border-[#333] bg-[#111]" />
            </>
          )}

          {/* Screen content */}
          <div className={`relative ${isProOrStandard ? 'pt-12' : 'pt-6 pb-16'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function AndroidFrame({ children, variant }: { children: ReactNode; variant: 'pixel' | 'samsung' }) {
  const borderRadius = variant === 'pixel' ? 40 : 35;

  return (
    <div className="relative inline-block">
      {/* Device outer frame */}
      <div
        className={`relative p-2.5 ${variant === 'pixel' ? 'bg-[#f5f5f5]' : 'bg-[#1a1a1a]'}`}
        style={{ borderRadius: borderRadius + 6 }}
      >
        {/* Volume buttons */}
        <div className={`absolute top-28 -right-1 h-10 w-1 rounded-r ${variant === 'pixel' ? 'bg-[#e0e0e0]' : 'bg-[#2a2a2a]'}`} />
        <div className={`absolute top-44 -right-1 h-16 w-1 rounded-r ${variant === 'pixel' ? 'bg-[#e0e0e0]' : 'bg-[#2a2a2a]'}`} />

        {/* Power button */}
        <div className={`absolute top-72 -right-1 h-12 w-1 rounded-r ${variant === 'pixel' ? 'bg-[#81c784]' : 'bg-[#2a2a2a]'}`} />

        {/* Screen */}
        <div
          className="relative overflow-hidden bg-black"
          style={{ borderRadius }}
        >
          {/* Camera punch hole */}
          <div className="absolute top-3 left-1/2 z-20 size-4 -translate-x-1/2 rounded-full bg-[#111]">
            <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#222]" />
          </div>

          {/* Screen content */}
          <div className="relative pt-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function MacBookFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative inline-block">
      {/* Screen portion */}
      <div className="relative rounded-t-xl bg-[#2a2a2a] p-2 pb-0">
        {/* Camera */}
        <div className="absolute top-1 left-1/2 z-20 size-2 -translate-x-1/2 rounded-full bg-[#1a1a1a]">
          <div className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3a3a3a]" />
        </div>

        {/* Screen bezel */}
        <div className="overflow-hidden rounded-t-lg bg-black pt-4">
          {children}
        </div>
      </div>

      {/* Keyboard/base portion */}
      <div className="h-3 rounded-b-sm bg-gradient-to-b from-[#c0c0c0] to-[#a0a0a0]">
        <div className="mx-auto h-1 w-24 rounded-b bg-[#888]" />
      </div>
      <div className="h-1.5 rounded-b-lg bg-[#909090]" />
    </div>
  );
}

function BrowserFrame({ children, variant }: { children: ReactNode; variant: 'chrome' | 'safari' }) {
  return (
    <div className="relative inline-block overflow-hidden rounded-lg shadow-2xl">
      {/* Browser chrome */}
      <div className={`${variant === 'chrome' ? 'bg-[#dee1e6]' : 'bg-[#f6f6f6]'} px-3 py-2`}>
        {/* Traffic lights / window controls */}
        <div className="mb-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-[#ff5f57]" />
            <div className="size-3 rounded-full bg-[#febc2e]" />
            <div className="size-3 rounded-full bg-[#28c840]" />
          </div>

          {/* Tab bar (Chrome style) */}
          {variant === 'chrome' && (
            <div className="ml-4 flex items-center">
              <div className="flex h-7 items-center gap-2 rounded-t-lg bg-white px-3">
                <div className="size-4 rounded bg-gray-200" />
                <span className="text-xs text-gray-600">MockFlow</span>
                <button className="ml-2 text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="ml-1 flex size-7 items-center justify-center rounded-full hover:bg-gray-300">
                <span className="text-lg text-gray-500">+</span>
              </div>
            </div>
          )}
        </div>

        {/* URL bar */}
        <div className={`flex items-center gap-2 ${variant === 'chrome' ? 'rounded-full bg-[#f1f3f4] px-4 py-1.5' : 'rounded-lg bg-white px-3 py-1.5'}`}>
          {variant === 'chrome' && (
            <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
          {variant === 'safari' && (
            <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
          <span className="flex-1 text-center text-sm text-gray-600">mockflow.app</span>
          {variant === 'safari' && (
            <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}

export function DeviceFrame({ device, children, className = '' }: DeviceFrameProps) {
  if (device === 'none') {
    return <div className={className}>{children}</div>;
  }

  const wrapperClass = `inline-flex items-center justify-center ${className}`;

  switch (device) {
    case 'iphone-15-pro':
      return (
        <div className={wrapperClass}>
          <IPhoneFrame variant="pro">{children}</IPhoneFrame>
        </div>
      );
    case 'iphone-14':
      return (
        <div className={wrapperClass}>
          <IPhoneFrame variant="standard">{children}</IPhoneFrame>
        </div>
      );
    case 'iphone-se':
      return (
        <div className={wrapperClass}>
          <IPhoneFrame variant="se">{children}</IPhoneFrame>
        </div>
      );
    case 'pixel-8':
      return (
        <div className={wrapperClass}>
          <AndroidFrame variant="pixel">{children}</AndroidFrame>
        </div>
      );
    case 'samsung-s24':
      return (
        <div className={wrapperClass}>
          <AndroidFrame variant="samsung">{children}</AndroidFrame>
        </div>
      );
    case 'macbook-pro':
      return (
        <div className={wrapperClass}>
          <MacBookFrame>{children}</MacBookFrame>
        </div>
      );
    case 'browser-chrome':
      return (
        <div className={wrapperClass}>
          <BrowserFrame variant="chrome">{children}</BrowserFrame>
        </div>
      );
    case 'browser-safari':
      return (
        <div className={wrapperClass}>
          <BrowserFrame variant="safari">{children}</BrowserFrame>
        </div>
      );
    default:
      return <div className={className}>{children}</div>;
  }
}

export function getDeviceDimensions(device: DeviceType) {
  return deviceDimensions[device];
}

export const deviceOptions: { value: DeviceType; label: string; category: string }[] = [
  { value: 'none', label: 'No Frame', category: 'None' },
  { value: 'iphone-15-pro', label: 'iPhone 15 Pro', category: 'Apple' },
  { value: 'iphone-14', label: 'iPhone 14', category: 'Apple' },
  { value: 'iphone-se', label: 'iPhone SE', category: 'Apple' },
  { value: 'pixel-8', label: 'Google Pixel 8', category: 'Android' },
  { value: 'samsung-s24', label: 'Samsung S24', category: 'Android' },
  { value: 'macbook-pro', label: 'MacBook Pro', category: 'Desktop' },
  { value: 'browser-chrome', label: 'Chrome Browser', category: 'Browser' },
  { value: 'browser-safari', label: 'Safari Browser', category: 'Browser' },
];
