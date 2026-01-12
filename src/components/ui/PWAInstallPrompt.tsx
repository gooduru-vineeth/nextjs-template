'use client';

import {
  AlertCircle,
  ArrowDown,
  CheckCircle,
  Download,
  Monitor,
  Plus,
  RefreshCw,
  Share,
  Smartphone,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Types
export type InstallState = 'idle' | 'available' | 'installing' | 'installed' | 'dismissed';
export type DevicePlatform = 'ios' | 'android' | 'desktop' | 'unknown';

export type PWACapabilities = {
  isStandalone: boolean;
  canInstall: boolean;
  hasServiceWorker: boolean;
  isOnline: boolean;
  supportsNotifications: boolean;
  supportsBackgroundSync: boolean;
  supportsPush: boolean;
};

export type PWAInstallPromptProps = {
  variant?: 'banner' | 'modal' | 'toast' | 'widget';
  showOfflineIndicator?: boolean;
  onInstall?: () => void;
  onDismiss?: () => void;
  onInstallSuccess?: () => void;
  onInstallError?: (error: Error) => void;
};

type BeforeInstallPromptEvent = {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
} & Event;

// Detect platform
const detectPlatform = (): DevicePlatform => {
  if (typeof window === 'undefined') {
    return 'unknown';
  }

  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    return 'ios';
  }
  if (/Android/.test(ua)) {
    return 'android';
  }
  if (/Windows|Mac|Linux/.test(ua)) {
    return 'desktop';
  }
  return 'unknown';
};

// Check PWA capabilities
const checkCapabilities = (): PWACapabilities => {
  if (typeof window === 'undefined') {
    return {
      isStandalone: false,
      canInstall: false,
      hasServiceWorker: false,
      isOnline: true,
      supportsNotifications: false,
      supportsBackgroundSync: false,
      supportsPush: false,
    };
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone);

  return {
    isStandalone,
    canInstall: 'BeforeInstallPromptEvent' in window || detectPlatform() === 'ios',
    hasServiceWorker: 'serviceWorker' in navigator,
    isOnline: navigator.onLine,
    supportsNotifications: 'Notification' in window,
    supportsBackgroundSync: 'serviceWorker' in navigator && 'SyncManager' in window,
    supportsPush: 'PushManager' in window,
  };
};

// Main Component
export default function PWAInstallPrompt({
  variant = 'banner',
  showOfflineIndicator = true,
  onInstall,
  onDismiss,
  onInstallSuccess,
  onInstallError,
}: PWAInstallPromptProps) {
  const [installState, setInstallState] = useState<InstallState>('idle');
  const [platform, setPlatform] = useState<DevicePlatform>('unknown');
  const [capabilities, setCapabilities] = useState<PWACapabilities>(checkCapabilities());
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Initialize
  useEffect(() => {
    setPlatform(detectPlatform());
    setCapabilities(checkCapabilities());

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setInstallState('dismissed');
        return;
      }
    }

    // Check if already installed
    const installed = localStorage.getItem('pwa-installed');
    if (installed) {
      setInstallState('installed');
    }
  }, []);

  // Handle beforeinstallprompt event
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallState('available');
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handle appinstalled event
  useEffect(() => {
    const handler = () => {
      setInstallState('installed');
      localStorage.setItem('pwa-installed', new Date().toISOString());
      onInstallSuccess?.();
    };

    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, [onInstallSuccess]);

  // Handle online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setCapabilities(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Show iOS prompt after delay
  useEffect(() => {
    if (platform === 'ios' && !capabilities.isStandalone && installState === 'idle') {
      const timer = setTimeout(() => {
        setInstallState('available');
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [platform, capabilities.isStandalone, installState]);

  // Install handler
  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIOSInstructions(true);
      onInstall?.();
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    setInstallState('installing');
    onInstall?.();

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      if (result.outcome === 'accepted') {
        setInstallState('installed');
        localStorage.setItem('pwa-installed', new Date().toISOString());
        onInstallSuccess?.();
      } else {
        setInstallState('available');
      }
    } catch (error) {
      setInstallState('available');
      onInstallError?.(error as Error);
    }

    setDeferredPrompt(null);
  };

  // Dismiss handler
  const handleDismiss = () => {
    setIsVisible(false);
    setInstallState('dismissed');
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    onDismiss?.();
  };

  // Don't render if already installed or in standalone mode
  if (capabilities.isStandalone || installState === 'installed') {
    return showOfflineIndicator && !capabilities.isOnline
      ? (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-700 shadow-lg dark:bg-amber-900/30 dark:text-amber-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">You&apos;re offline</span>
            </div>
          </div>
        )
      : null;
  }

  // Don't render if dismissed
  if (installState === 'dismissed' || !isVisible) {
    return showOfflineIndicator && !capabilities.isOnline
      ? (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-700 shadow-lg dark:bg-amber-900/30 dark:text-amber-400">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">You&apos;re offline</span>
            </div>
          </div>
        )
      : null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions && platform === 'ios') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Install MockFlow</h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Install this app on your iPhone for quick access:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Tap the Share button
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Share className="h-5 w-5 text-blue-500" />
                    <span className="text-xs text-gray-500">at the bottom of Safari</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Scroll and tap &quot;Add to Home Screen&quot;
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Plus className="h-5 w-5 text-gray-500" />
                    <span className="text-xs text-gray-500">in the share menu</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Tap &quot;Add&quot; to confirm
                  </p>
                  <span className="text-xs text-gray-500">The app will appear on your home screen</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700/50">
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex items-center gap-3">
          {platform === 'ios' || platform === 'android'
            ? (
                <Smartphone className="h-8 w-8 text-blue-500" />
              )
            : (
                <Monitor className="h-8 w-8 text-blue-500" />
              )}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Install App</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get the full experience
            </p>
          </div>
        </div>
        <button
          onClick={handleInstall}
          disabled={installState === 'installing'}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {installState === 'installing'
            ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Installing...
                </span>
              )
            : (
                <span className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Install
                </span>
              )}
        </button>
      </div>
    );
  }

  // Toast variant
  if (variant === 'toast') {
    return (
      <div className="animate-slide-up fixed right-4 bottom-4 z-50">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex-shrink-0 rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Install MockFlow</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Add to home screen</p>
          </div>
          <button
            onClick={handleInstall}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Download className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Install MockFlow
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Install our app for a better experience with offline support and quick access from your home screen.
            </p>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Works Offline</span>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Native Feel</span>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <ArrowDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Quick Access</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 rounded-lg py-3 font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                disabled={installState === 'installing'}
                className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {installState === 'installing'
                  ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Installing...
                      </span>
                    )
                  : (
                      'Install'
                    )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant (default)
  return (
    <>
      <div className="animate-slide-down fixed top-0 right-0 left-0 z-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                {platform === 'ios' || platform === 'android'
                  ? (
                      <Smartphone className="h-5 w-5" />
                    )
                  : (
                      <Monitor className="h-5 w-5" />
                    )}
              </div>
              <div>
                <p className="font-medium">Install MockFlow</p>
                <p className="text-sm text-white/80">
                  {platform === 'ios'
                    ? 'Add to your home screen for the best experience'
                    : 'Install for quick access and offline support'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleInstall}
                disabled={installState === 'installing'}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-blue-600 hover:bg-white/90 disabled:opacity-50"
              >
                {installState === 'installing'
                  ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Installing...
                      </>
                    )
                  : (
                      <>
                        <Download className="h-4 w-4" />
                        Install
                      </>
                    )}
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offline indicator */}
      {showOfflineIndicator && !capabilities.isOnline && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-700 shadow-lg dark:bg-amber-900/30 dark:text-amber-400">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">You&apos;re offline</span>
          </div>
        </div>
      )}
    </>
  );
}

// PWA Status Widget
export function PWAStatusWidget() {
  const [capabilities, setCapabilities] = useState<PWACapabilities>(checkCapabilities());

  useEffect(() => {
    setCapabilities(checkCapabilities());
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h4 className="mb-3 font-medium text-gray-900 dark:text-white">App Status</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Installed</span>
          {capabilities.isStandalone
            ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )
            : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
          {capabilities.isOnline
            ? (
                <Wifi className="h-5 w-5 text-green-500" />
              )
            : (
                <WifiOff className="h-5 w-5 text-amber-500" />
              )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Service Worker</span>
          {capabilities.hasServiceWorker
            ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )
            : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Notifications</span>
          {capabilities.supportsNotifications
            ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )
            : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
        </div>
      </div>
    </div>
  );
}
