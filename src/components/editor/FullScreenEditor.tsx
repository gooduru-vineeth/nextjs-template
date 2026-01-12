'use client';

import type { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';

type FullScreenEditorProps = {
  mockupRef: RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
  onExitFullScreen?: () => void;
  showToolbar?: boolean;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  backgroundColor?: string;
  gridEnabled?: boolean;
};

type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function FullScreenEditor({
  mockupRef,
  children,
  onExitFullScreen,
  showToolbar = true,
  zoom: controlledZoom,
  onZoomChange,
  backgroundColor = 'bg-gray-900',
  gridEnabled: initialGridEnabled = false,
}: FullScreenEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [internalZoom, setInternalZoom] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(initialGridEnabled);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState(false);

  const zoom = controlledZoom ?? internalZoom;
  const setZoom = onZoomChange ?? setInternalZoom;

  // Handle fullscreen API
  const enterFullScreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullScreen(true);
    } catch {
      // Fallback to pseudo-fullscreen
      setIsFullScreen(true);
    }
  }, []);

  const exitFullScreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore errors
    }
    setIsFullScreen(false);
    onExitFullScreen?.();
  }, [onExitFullScreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && isFullScreen) {
        setIsFullScreen(false);
        onExitFullScreen?.();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, [isFullScreen, onExitFullScreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreen) {
        return;
      }

      if (e.key === 'Escape') {
        exitFullScreen();
      } else if (e.key === '+' || e.key === '=') {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          setZoom(Math.min(200, zoom + 10));
        }
      } else if (e.key === '-') {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          setZoom(Math.max(25, zoom - 10));
        }
      } else if (e.key === '0' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom(100);
        setPosition({ x: 0, y: 0 });
      } else if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setGridEnabled(!gridEnabled);
      } else if (e.key === 'm' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowMinimap(!showMinimap);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, zoom, gridEnabled, showMinimap, exitFullScreen, setZoom]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(Math.max(25, Math.min(200, zoom + delta)));
    }
  }, [zoom, setZoom]);

  // Handle panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Toolbar actions
  const toolbarActions: ToolbarAction[] = [
    {
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
      label: 'Zoom In (Cmd++)',
      onClick: () => setZoom(Math.min(200, zoom + 10)),
      disabled: zoom >= 200,
    },
    {
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
        </svg>
      ),
      label: 'Zoom Out (Cmd+-)',
      onClick: () => setZoom(Math.max(25, zoom - 10)),
      disabled: zoom <= 25,
    },
    {
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      label: 'Fit to Screen (Cmd+0)',
      onClick: () => {
        setZoom(100);
        setPosition({ x: 0, y: 0 });
      },
    },
    {
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      label: `Grid ${gridEnabled ? 'On' : 'Off'} (Cmd+G)`,
      onClick: () => setGridEnabled(!gridEnabled),
    },
    {
      icon: (
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      label: `Minimap ${showMinimap ? 'On' : 'Off'} (Cmd+M)`,
      onClick: () => setShowMinimap(!showMinimap),
    },
  ];

  if (!isFullScreen) {
    return (
      <button
        type="button"
        onClick={enterFullScreen}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        Full Screen
      </button>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${backgroundColor}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800/95 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">Full Screen Editor</span>
            <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-300">
              {zoom}
              %
            </span>
          </div>

          <div className="flex items-center gap-1">
            {toolbarActions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                disabled={action.disabled}
                title={action.label}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50"
              >
                {action.icon}
              </button>
            ))}

            <div className="mx-2 h-6 w-px bg-gray-600" />

            <button
              type="button"
              onClick={exitFullScreen}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit
            </button>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div
        className={`relative flex-1 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundImage: gridEnabled
            ? `
                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
              `
            : undefined,
          backgroundSize: gridEnabled ? '20px 20px' : undefined,
        }}
      >
        <div
          className="flex size-full items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <div ref={mockupRef} className="relative">
            {children}
          </div>
        </div>

        {/* Minimap */}
        {showMinimap && (
          <div className="absolute right-4 bottom-4 h-32 w-48 overflow-hidden rounded-lg border border-gray-600 bg-gray-800/90 shadow-xl backdrop-blur-sm">
            <div className="p-2 text-xs font-medium text-gray-400">Minimap</div>
            <div className="relative mx-2 mb-2 h-20 overflow-hidden rounded bg-gray-700">
              <div
                className="absolute flex items-center justify-center"
                style={{
                  transform: `scale(0.1)`,
                  transformOrigin: 'top left',
                }}
              >
                {children}
              </div>
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/20"
                style={{
                  width: `${100 / (zoom / 100)}%`,
                  height: `${100 / (zoom / 100)}%`,
                  left: `${50 - position.x * 0.01}%`,
                  top: `${50 - position.y * 0.01}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-between border-t border-gray-700 bg-gray-800/95 px-4 py-1.5 text-xs text-gray-400 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>Pan: Alt+Drag or Middle Mouse</span>
          <span>Zoom: Cmd+Scroll or Cmd++/-</span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Position: (
            {Math.round(position.x)}
            ,
            {Math.round(position.y)}
            )
          </span>
          <span>
            Zoom:
            {zoom}
            %
          </span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}

// Standalone hook for fullscreen management
export function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const enterFullScreen = useCallback(async (element?: HTMLElement) => {
    const target = element || document.documentElement;
    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      }
    } catch {
      // Browser may block fullscreen
    }
  }, []);

  const exitFullScreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore errors
    }
  }, []);

  const toggleFullScreen = useCallback(async (element?: HTMLElement) => {
    if (isFullScreen) {
      await exitFullScreen();
    } else {
      await enterFullScreen(element);
    }
  }, [isFullScreen, enterFullScreen, exitFullScreen]);

  return {
    isFullScreen,
    enterFullScreen,
    exitFullScreen,
    toggleFullScreen,
  };
}

export default FullScreenEditor;
