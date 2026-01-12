'use client';

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Copy,
  Layers,
  Lock,
  Maximize2,
  Move,
  RotateCw,
  Trash2,
  Unlock,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export type InteractionMode = 'select' | 'pan' | 'zoom' | 'draw' | 'text' | 'measure';
export type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

export type CanvasElement = {
  id: string;
  name: string;
  bounds: BoundingBox;
  locked?: boolean;
  visible?: boolean;
  selected?: boolean;
  grouped?: boolean;
  groupId?: string;
};

export type SelectionState = {
  elements: string[];
  bounds: BoundingBox | null;
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
  activeHandle: HandlePosition | null;
};

export type CanvasInteractionLayerProps = {
  elements: CanvasElement[];
  selection: SelectionState;
  mode?: InteractionMode;
  zoom?: number;
  gridSize?: number;
  snapToGrid?: boolean;
  snapToGuides?: boolean;
  showGuides?: boolean;
  onSelectionChange?: (elementIds: string[]) => void;
  onElementMove?: (elementId: string, delta: { x: number; y: number }) => void;
  onElementResize?: (elementId: string, bounds: BoundingBox, handle: HandlePosition) => void;
  onElementRotate?: (elementId: string, rotation: number) => void;
  onElementDuplicate?: (elementId: string) => void;
  onElementDelete?: (elementId: string) => void;
  onElementLock?: (elementId: string) => void;
  variant?: 'full' | 'compact' | 'minimal' | 'overlay';
  showToolbar?: boolean;
  showHandles?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function CanvasInteractionLayer({
  elements,
  selection,
  mode = 'select',
  zoom = 1,
  gridSize = 8,
  snapToGrid = true,
  snapToGuides = true,
  showGuides = true,
  onSelectionChange,
  onElementMove,
  onElementResize,
  onElementRotate,
  onElementDuplicate,
  onElementDelete,
  onElementLock,
  variant = 'full',
  showToolbar = true,
  showHandles = true,
  darkMode = false,
  className = '',
}: CanvasInteractionLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [marqueeRect, setMarqueeRect] = useState<BoundingBox | null>(null);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [hoveredHandle, setHoveredHandle] = useState<HandlePosition | null>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  const selectedElements = elements.filter(el => selection.elements.includes(el.id));
  const hasSelection = selectedElements.length > 0;
  const isMultiSelect = selectedElements.length > 1;
  const isLocked = selectedElements.some(el => el.locked);

  // Calculate selection bounds
  const getSelectionBounds = useCallback((): BoundingBox | null => {
    if (selectedElements.length === 0) {
      return null;
    }

    let minX = Infinity; let minY = Infinity;
    let maxX = -Infinity; let maxY = -Infinity;

    selectedElements.forEach((el) => {
      minX = Math.min(minX, el.bounds.x);
      minY = Math.min(minY, el.bounds.y);
      maxX = Math.max(maxX, el.bounds.x + el.bounds.width);
      maxY = Math.max(maxY, el.bounds.y + el.bounds.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [selectedElements]);

  const selectionBounds = getSelectionBounds();

  // Snap to grid
  const snapValue = useCallback((value: number) => {
    if (!snapToGrid) {
      return value;
    }
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  // Calculate guides
  useEffect(() => {
    if (!showGuides || !selectionBounds) {
      setGuides({ x: [], y: [] });
      return;
    }

    const newGuides: { x: number[]; y: number[] } = { x: [], y: [] };

    // Add center guides
    const centerX = selectionBounds.x + selectionBounds.width / 2;
    const centerY = selectionBounds.y + selectionBounds.height / 2;

    elements.forEach((el) => {
      if (selection.elements.includes(el.id)) {
        return;
      }

      const elCenterX = el.bounds.x + el.bounds.width / 2;
      const elCenterY = el.bounds.y + el.bounds.height / 2;

      // Check for alignment
      if (Math.abs(elCenterX - centerX) < 5) {
        newGuides.x.push(elCenterX);
      }
      if (Math.abs(elCenterY - centerY) < 5) {
        newGuides.y.push(elCenterY);
      }
      if (Math.abs(el.bounds.x - selectionBounds.x) < 5) {
        newGuides.x.push(el.bounds.x);
      }
      if (Math.abs(el.bounds.y - selectionBounds.y) < 5) {
        newGuides.y.push(el.bounds.y);
      }
    });

    setGuides(newGuides);
  }, [elements, selection.elements, selectionBounds, showGuides, snapToGuides]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'select') {
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setDragStart({ x, y });

    // Check if clicking on an element
    const clickedElement = [...elements].reverse().find((el) => {
      return x >= el.bounds.x && x <= el.bounds.x + el.bounds.width
        && y >= el.bounds.y && y <= el.bounds.y + el.bounds.height;
    });

    if (clickedElement) {
      if (e.shiftKey) {
        // Toggle selection
        const newSelection = selection.elements.includes(clickedElement.id)
          ? selection.elements.filter(id => id !== clickedElement.id)
          : [...selection.elements, clickedElement.id];
        onSelectionChange?.(newSelection);
      } else if (!selection.elements.includes(clickedElement.id)) {
        // Select single element
        onSelectionChange?.([clickedElement.id]);
      }
    } else {
      // Start marquee selection
      setMarqueeRect({ x, y, width: 0, height: 0 });
      if (!e.shiftKey) {
        onSelectionChange?.([]);
      }
    }
  }, [mode, elements, selection.elements, zoom, onSelectionChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart) {
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const deltaX = snapValue(x - dragStart.x);
    const deltaY = snapValue(y - dragStart.y);

    if (marqueeRect) {
      // Update marquee
      setMarqueeRect({
        x: Math.min(dragStart.x, x),
        y: Math.min(dragStart.y, y),
        width: Math.abs(x - dragStart.x),
        height: Math.abs(y - dragStart.y),
      });
    } else if (selection.isDragging && hasSelection) {
      // Move elements
      selectedElements.forEach((el) => {
        if (!el.locked) {
          onElementMove?.(el.id, { x: deltaX, y: deltaY });
        }
      });
    } else if (selection.isResizing && selection.activeHandle) {
      // Resize element
      selectedElements.forEach((el) => {
        if (!el.locked) {
          onElementResize?.(el.id, el.bounds, selection.activeHandle!);
        }
      });
    } else if (selection.isRotating) {
      // Rotate element
      if (selectionBounds) {
        const centerX = selectionBounds.x + selectionBounds.width / 2;
        const centerY = selectionBounds.y + selectionBounds.height / 2;
        const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);

        selectedElements.forEach((el) => {
          if (!el.locked) {
            onElementRotate?.(el.id, angle);
          }
        });
      }
    }
  }, [dragStart, marqueeRect, selection, selectedElements, selectionBounds, zoom, snapValue, hasSelection, onElementMove, onElementResize, onElementRotate]);

  const handleMouseUp = useCallback(() => {
    if (marqueeRect) {
      // Find elements in marquee
      const selectedIds = elements.filter((el) => {
        return el.bounds.x < marqueeRect.x + marqueeRect.width
          && el.bounds.x + el.bounds.width > marqueeRect.x
          && el.bounds.y < marqueeRect.y + marqueeRect.height
          && el.bounds.y + el.bounds.height > marqueeRect.y;
      }).map(el => el.id);

      onSelectionChange?.(selectedIds);
    }

    setDragStart(null);
    setMarqueeRect(null);
  }, [marqueeRect, elements, onSelectionChange]);

  // Handle positions for resize handles
  const handlePositions: { position: HandlePosition; x: string; y: string; cursor: string }[] = [
    { position: 'nw', x: '0%', y: '0%', cursor: 'nw-resize' },
    { position: 'n', x: '50%', y: '0%', cursor: 'n-resize' },
    { position: 'ne', x: '100%', y: '0%', cursor: 'ne-resize' },
    { position: 'e', x: '100%', y: '50%', cursor: 'e-resize' },
    { position: 'se', x: '100%', y: '100%', cursor: 'se-resize' },
    { position: 's', x: '50%', y: '100%', cursor: 's-resize' },
    { position: 'sw', x: '0%', y: '100%', cursor: 'sw-resize' },
    { position: 'w', x: '0%', y: '50%', cursor: 'w-resize' },
  ];

  const renderSelectionBox = () => {
    if (!selectionBounds) {
      return null;
    }

    return (
      <div
        className="pointer-events-none absolute"
        style={{
          left: selectionBounds.x * zoom,
          top: selectionBounds.y * zoom,
          width: selectionBounds.width * zoom,
          height: selectionBounds.height * zoom,
          transform: selectionBounds.rotation ? `rotate(${selectionBounds.rotation}deg)` : undefined,
        }}
      >
        {/* Selection border */}
        <div className="absolute inset-0 rounded-sm border-2 border-blue-500" />

        {/* Resize handles */}
        {showHandles && !isLocked && (
          <>
            {handlePositions.map(({ position, x, y, cursor }) => (
              <div
                key={position}
                className={`pointer-events-auto absolute h-3 w-3 rounded-sm border-2 border-blue-500 bg-white ${
                  hoveredHandle === position ? 'scale-125' : ''
                } transition-transform`}
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                  cursor,
                }}
                onMouseEnter={() => setHoveredHandle(position)}
                onMouseLeave={() => setHoveredHandle(null)}
              />
            ))}

            {/* Rotation handle */}
            {!isMultiSelect && (
              <div
                className="pointer-events-auto absolute -top-8 left-1/2 flex flex-col items-center"
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="h-6 w-0.5 bg-blue-500" />
                <div
                  className={`flex h-4 w-4 cursor-grab items-center justify-center rounded-full border-2 border-blue-500 bg-white ${
                    hoveredHandle === 'rotate' ? 'scale-125' : ''
                  } transition-transform`}
                  onMouseEnter={() => setHoveredHandle('rotate')}
                  onMouseLeave={() => setHoveredHandle(null)}
                >
                  <RotateCw size={10} className="text-blue-500" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Lock indicator */}
        {isLocked && (
          <div className="absolute -top-2 -right-2 rounded-full bg-amber-500 p-1">
            <Lock size={12} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  const renderMarquee = () => {
    if (!marqueeRect) {
      return null;
    }

    return (
      <div
        className="pointer-events-none absolute border-2 border-blue-500 bg-blue-500/10"
        style={{
          left: marqueeRect.x * zoom,
          top: marqueeRect.y * zoom,
          width: marqueeRect.width * zoom,
          height: marqueeRect.height * zoom,
        }}
      />
    );
  };

  const renderGuides = () => {
    if (!showGuides || (guides.x.length === 0 && guides.y.length === 0)) {
      return null;
    }

    return (
      <>
        {guides.x.map((x, i) => (
          <div
            key={`guide-x-${i}`}
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-pink-500"
            style={{ left: x * zoom }}
          />
        ))}
        {guides.y.map((y, i) => (
          <div
            key={`guide-y-${i}`}
            className="pointer-events-none absolute right-0 left-0 h-px bg-pink-500"
            style={{ top: y * zoom }}
          />
        ))}
      </>
    );
  };

  const renderToolbar = () => {
    if (!showToolbar || !hasSelection) {
      return null;
    }

    const toolbarY = selectionBounds ? selectionBounds.y - 48 : 0;
    const toolbarX = selectionBounds ? selectionBounds.x + selectionBounds.width / 2 : 0;

    return (
      <div
        className={`absolute ${bgColor} rounded-lg border shadow-lg ${borderColor} pointer-events-auto flex items-center gap-1 p-1`}
        style={{
          left: toolbarX * zoom,
          top: toolbarY * zoom,
          transform: 'translateX(-50%)',
        }}
      >
        <button
          className={`p-2 ${mutedColor} ${hoverBg} rounded`}
          title="Move"
        >
          <Move size={16} />
        </button>
        <button
          className={`p-2 ${mutedColor} ${hoverBg} rounded`}
          title="Resize"
        >
          <Maximize2 size={16} />
        </button>
        <div className={`h-6 w-px ${borderColor} mx-1`} />
        <button
          onClick={() => selectedElements.forEach(el => onElementDuplicate?.(el.id))}
          className={`p-2 ${mutedColor} ${hoverBg} rounded`}
          title="Duplicate"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={() => selectedElements.forEach(el => onElementLock?.(el.id))}
          className={`p-2 ${isLocked ? 'text-amber-500' : mutedColor} ${hoverBg} rounded`}
          title={isLocked ? 'Unlock' : 'Lock'}
        >
          {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
        </button>
        <button
          onClick={() => selectedElements.forEach(el => onElementDelete?.(el.id))}
          className={`p-2 text-red-500 ${hoverBg} rounded`}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
        {isMultiSelect && (
          <>
            <div className={`h-6 w-px ${borderColor} mx-1`} />
            <button
              className={`p-2 ${mutedColor} ${hoverBg} rounded`}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              className={`p-2 ${mutedColor} ${hoverBg} rounded`}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              className={`p-2 ${mutedColor} ${hoverBg} rounded`}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
            <button
              className={`p-2 ${mutedColor} ${hoverBg} rounded`}
              title="Group"
            >
              <Layers size={16} />
            </button>
          </>
        )}
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {renderSelectionBox()}
        {renderMarquee()}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {renderGuides()}
        {renderSelectionBox()}
        {renderMarquee()}
      </div>
    );
  }

  // Overlay variant
  if (variant === 'overlay') {
    return (
      <div
        ref={containerRef}
        className={`pointer-events-none absolute inset-0 ${className}`}
      >
        <div
          className="pointer-events-auto absolute inset-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {renderGuides()}
        {renderSelectionBox()}
        {renderMarquee()}
        {renderToolbar()}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div
      ref={containerRef}
      className={`relative ${bgColor} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid pattern */}
      {snapToGrid && (
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${darkMode ? '#fff' : '#000'} 1px, transparent 1px),
              linear-gradient(to bottom, ${darkMode ? '#fff' : '#000'} 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
          }}
        />
      )}

      {/* Guides */}
      {renderGuides()}

      {/* Selection box */}
      {renderSelectionBox()}

      {/* Marquee selection */}
      {renderMarquee()}

      {/* Floating toolbar */}
      {renderToolbar()}

      {/* Info panel */}
      {hasSelection && selectionBounds && (
        <div className={`absolute bottom-4 left-4 ${bgColor} rounded-lg border shadow-lg ${borderColor} pointer-events-auto p-3`}>
          <div className={`text-xs ${mutedColor} space-y-1`}>
            <div>
              X:
              {Math.round(selectionBounds.x)}
              {' '}
              Y:
              {Math.round(selectionBounds.y)}
            </div>
            <div>
              W:
              {Math.round(selectionBounds.width)}
              {' '}
              H:
              {Math.round(selectionBounds.height)}
            </div>
            {isMultiSelect && (
              <div className={textColor}>
                {selectedElements.length}
                {' '}
                elements selected
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode indicator */}
      <div className={`absolute top-4 right-4 ${bgColor} rounded-lg border shadow-lg ${borderColor} px-3 py-2 text-sm ${textColor}`}>
        {mode.charAt(0).toUpperCase() + mode.slice(1)}
        {' '}
        Mode
      </div>
    </div>
  );
}
