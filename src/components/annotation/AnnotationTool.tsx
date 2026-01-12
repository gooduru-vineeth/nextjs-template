'use client';

import {
  ArrowRight,
  ChevronDown,
  Circle,
  Copy,
  Download,
  Eraser,
  Eye,
  EyeOff,
  Highlighter,
  Layers,
  Lock,
  MessageSquare,
  MousePointer2,
  Move,
  Pencil,
  Redo,
  Settings,
  Square,
  Trash2,
  Type,
  Undo,
  Unlock,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export type Annotation = {
  id: string;
  type: 'comment' | 'text' | 'circle' | 'rectangle' | 'arrow' | 'line' | 'freehand' | 'highlight';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  endX?: number;
  endY?: number;
  content?: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  isLocked?: boolean;
  isHidden?: boolean;
  author?: {
    name: string;
    avatar?: string;
  };
  timestamp?: string;
  resolved?: boolean;
};

export type AnnotationToolProps = {
  annotations: Annotation[];
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  onAnnotationAdd?: (annotation: Partial<Annotation>) => void;
  onAnnotationUpdate?: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete?: (id: string) => void;
  onAnnotationSelect?: (id: string | null) => void;
  selectedAnnotationId?: string | null;
  variant?: 'full' | 'toolbar' | 'floating' | 'sidebar' | 'minimal';
  showComments?: boolean;
  showShapes?: boolean;
  showDrawing?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function AnnotationTool({
  annotations,
  onAnnotationsChange: _onAnnotationsChange,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  onAnnotationSelect,
  selectedAnnotationId,
  variant = 'full',
  showComments = true,
  showShapes = true,
  showDrawing = true,
  darkMode = false,
  className = '',
}: AnnotationToolProps) {
  // Reserved for batch annotation changes
  void _onAnnotationsChange;

  const [activeTool, setActiveTool] = useState<string>('select');
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<Annotation[][]>([annotations]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';
  const selectedBg = darkMode ? 'bg-gray-700' : 'bg-gray-200';

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000', '#ffffff'];

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select', group: 'basic' },
    { id: 'move', icon: Move, label: 'Move', group: 'basic' },
    ...(showComments ? [{ id: 'comment', icon: MessageSquare, label: 'Comment', group: 'comment' }] : []),
    { id: 'text', icon: Type, label: 'Text', group: 'text' },
    ...(showShapes
      ? [
          { id: 'rectangle', icon: Square, label: 'Rectangle', group: 'shape' },
          { id: 'circle', icon: Circle, label: 'Circle', group: 'shape' },
          { id: 'arrow', icon: ArrowRight, label: 'Arrow', group: 'shape' },
        ]
      : []),
    ...(showDrawing
      ? [
          { id: 'freehand', icon: Pencil, label: 'Freehand', group: 'draw' },
          { id: 'highlight', icon: Highlighter, label: 'Highlight', group: 'draw' },
          { id: 'eraser', icon: Eraser, label: 'Eraser', group: 'draw' },
        ]
      : []),
  ];

  const addToHistory = useCallback((newAnnotations: Annotation[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAnnotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history.length]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'select' || activeTool === 'move') {
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (activeTool === 'freehand' || activeTool === 'highlight') {
      setIsDrawing(true);
      setCurrentPoints([{ x, y }]);
    } else if (activeTool === 'comment') {
      const annotation: Partial<Annotation> = {
        type: 'comment',
        x,
        y,
        color: activeColor,
        strokeWidth,
        opacity,
        content: '',
      };
      onAnnotationAdd?.(annotation);
    } else if (activeTool === 'text') {
      const annotation: Partial<Annotation> = {
        type: 'text',
        x,
        y,
        color: activeColor,
        strokeWidth,
        opacity,
        content: 'Click to edit',
      };
      onAnnotationAdd?.(annotation);
    }
  }, [activeTool, zoom, activeColor, strokeWidth, opacity, onAnnotationAdd]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) {
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setCurrentPoints(prev => [...prev, { x, y }]);
  }, [isDrawing, zoom]);

  const handleCanvasMouseUp = useCallback(() => {
    if (isDrawing && currentPoints.length > 1) {
      const annotation: Partial<Annotation> = {
        type: activeTool === 'highlight' ? 'highlight' : 'freehand',
        x: currentPoints[0]?.x || 0,
        y: currentPoints[0]?.y || 0,
        points: currentPoints,
        color: activeColor,
        strokeWidth: activeTool === 'highlight' ? 20 : strokeWidth,
        opacity: activeTool === 'highlight' ? 0.3 : opacity,
      };
      onAnnotationAdd?.(annotation);
      addToHistory([...annotations, annotation as Annotation]);
    }
    setIsDrawing(false);
    setCurrentPoints([]);
  }, [isDrawing, currentPoints, activeTool, activeColor, strokeWidth, opacity, onAnnotationAdd, addToHistory, annotations]);

  const handleAnnotationClick = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'select' || activeTool === 'eraser') {
      if (activeTool === 'eraser') {
        onAnnotationDelete?.(id);
      } else {
        onAnnotationSelect?.(id);
      }
    }
  }, [activeTool, onAnnotationDelete, onAnnotationSelect]);

  const renderAnnotation = (annotation: Annotation) => {
    if (annotation.isHidden) {
      return null;
    }

    const isSelected = selectedAnnotationId === annotation.id;
    const baseStyle = {
      position: 'absolute' as const,
      left: annotation.x * zoom,
      top: annotation.y * zoom,
      cursor: annotation.isLocked ? 'not-allowed' : 'pointer',
      opacity: annotation.opacity,
    };

    switch (annotation.type) {
      case 'comment':
        return (
          <div
            key={annotation.id}
            style={baseStyle}
            onClick={e => handleAnnotationClick(annotation.id, e)}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-start gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: annotation.color }}
              >
                <MessageSquare size={16} className="text-white" />
              </div>
              {annotation.content && (
                <div className={`${bgColor} rounded-lg border px-3 py-2 shadow-lg ${borderColor} max-w-[200px]`}>
                  {annotation.author && (
                    <div className={`text-xs font-medium ${textColor} mb-1`}>{annotation.author.name}</div>
                  )}
                  <p className={`text-sm ${textColor}`}>{annotation.content}</p>
                  {annotation.timestamp && (
                    <span className={`text-xs ${mutedColor}`}>{annotation.timestamp}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div
            key={annotation.id}
            style={baseStyle}
            onClick={e => handleAnnotationClick(annotation.id, e)}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <span
              style={{
                color: annotation.color,
                fontSize: `${16 + annotation.strokeWidth * 2}px`,
              }}
              className="font-medium whitespace-nowrap"
            >
              {annotation.content}
            </span>
          </div>
        );

      case 'rectangle':
        return (
          <div
            key={annotation.id}
            style={{
              ...baseStyle,
              width: (annotation.width || 100) * zoom,
              height: (annotation.height || 60) * zoom,
              border: `${annotation.strokeWidth}px solid ${annotation.color}`,
              borderRadius: 4,
            }}
            onClick={e => handleAnnotationClick(annotation.id, e)}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          />
        );

      case 'circle':
        return (
          <div
            key={annotation.id}
            style={{
              ...baseStyle,
              width: (annotation.width || 80) * zoom,
              height: (annotation.height || 80) * zoom,
              border: `${annotation.strokeWidth}px solid ${annotation.color}`,
              borderRadius: '50%',
            }}
            onClick={e => handleAnnotationClick(annotation.id, e)}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          />
        );

      case 'arrow':
      case 'freehand':
      case 'highlight':
        if (!annotation.points || annotation.points.length < 2) {
          return null;
        }
        const minX = Math.min(...annotation.points.map(p => p.x));
        const minY = Math.min(...annotation.points.map(p => p.y));
        const maxX = Math.max(...annotation.points.map(p => p.x));
        const maxY = Math.max(...annotation.points.map(p => p.y));
        const width = maxX - minX + annotation.strokeWidth * 2;
        const height = maxY - minY + annotation.strokeWidth * 2;

        return (
          <svg
            key={annotation.id}
            style={{
              position: 'absolute',
              left: minX * zoom - annotation.strokeWidth,
              top: minY * zoom - annotation.strokeWidth,
              width: width * zoom,
              height: height * zoom,
              cursor: annotation.isLocked ? 'not-allowed' : 'pointer',
              pointerEvents: 'stroke',
            }}
            onClick={e => handleAnnotationClick(annotation.id, e)}
            className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          >
            <path
              d={annotation.points.map((p, i) =>
                `${i === 0 ? 'M' : 'L'} ${(p.x - minX + annotation.strokeWidth) * zoom} ${(p.y - minY + annotation.strokeWidth) * zoom}`,
              ).join(' ')}
              fill="none"
              stroke={annotation.color}
              strokeWidth={annotation.strokeWidth * zoom}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={annotation.opacity}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          {tools.slice(0, 5).map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`rounded p-1.5 ${activeTool === tool.id ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
              title={tool.label}
            >
              <tool.icon size={14} />
            </button>
          ))}
        </div>
        <div
          className="h-5 w-5 cursor-pointer rounded border border-gray-300"
          style={{ backgroundColor: activeColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
      </div>
    );
  }

  // Toolbar variant
  if (variant === 'toolbar') {
    return (
      <div className={`${bgColor} border ${borderColor} flex items-center gap-2 rounded-lg p-2 ${className}`}>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`rounded p-2 ${activeTool === tool.id ? 'bg-blue-500 text-white' : `${hoverBg} ${mutedColor}`}`}
            title={tool.label}
          >
            <tool.icon size={16} />
          </button>
        ))}

        <div className={`h-6 w-px ${borderColor}`} />

        <div className="flex items-center gap-1">
          {colors.slice(0, 6).map(color => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className={`h-5 w-5 rounded-full border-2 ${activeColor === color ? 'border-blue-500' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className={`h-6 w-px ${borderColor}`} />

        <div className="flex items-center gap-1">
          <button onClick={handleUndo} disabled={historyIndex === 0} className={`p-2 ${hoverBg} rounded disabled:opacity-50`}>
            <Undo size={16} className={mutedColor} />
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={`p-2 ${hoverBg} rounded disabled:opacity-50`}>
            <Redo size={16} className={mutedColor} />
          </button>
        </div>
      </div>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <div className={`${bgColor} border ${borderColor} flex flex-col gap-1 rounded-xl p-2 shadow-lg ${className}`}>
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`rounded-lg p-2 ${activeTool === tool.id ? 'bg-blue-500 text-white' : `${hoverBg} ${mutedColor}`}`}
            title={tool.label}
          >
            <tool.icon size={18} />
          </button>
        ))}

        <div className={`h-px w-full ${borderColor} my-1`} />

        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={`w-full rounded-lg p-2 ${hoverBg} flex items-center justify-center`}
          >
            <div className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ backgroundColor: activeColor }} />
          </button>

          {showColorPicker && (
            <div className={`absolute top-0 left-full ml-2 ${bgColor} border ${borderColor} grid grid-cols-3 gap-1 rounded-lg p-2 shadow-lg`}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setActiveColor(color); setShowColorPicker(false);
                  }}
                  className={`h-6 w-6 rounded-full border-2 ${activeColor === color ? 'border-blue-500' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>

        <div className={`h-px w-full ${borderColor} my-1`} />

        <button onClick={handleUndo} disabled={historyIndex === 0} className={`p-2 ${hoverBg} rounded-lg disabled:opacity-50`}>
          <Undo size={18} className={mutedColor} />
        </button>
        <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={`p-2 ${hoverBg} rounded-lg disabled:opacity-50`}>
          <Redo size={18} className={mutedColor} />
        </button>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-64 flex-col border-r ${borderColor} ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <h3 className={`font-semibold ${textColor}`}>Annotations</h3>
          <p className={`text-sm ${mutedColor}`}>
            {annotations.length}
            {' '}
            annotations
          </p>
        </div>

        {/* Tools */}
        <div className={`border-b p-4 ${borderColor}`}>
          <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Tools</span>
          <div className="mt-2 grid grid-cols-4 gap-1">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`rounded p-2 ${activeTool === tool.id ? 'bg-blue-500 text-white' : `${hoverBg} ${mutedColor}`}`}
                title={tool.label}
              >
                <tool.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className={`border-b p-4 ${borderColor}`}>
          <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Color</span>
          <div className="mt-2 flex flex-wrap gap-1">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`h-6 w-6 rounded-full border-2 ${activeColor === color ? 'border-blue-500' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Stroke width */}
        <div className={`border-b p-4 ${borderColor}`}>
          <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Stroke</span>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={e => setStrokeWidth(Number.parseInt(e.target.value))}
              className="flex-1"
            />
            <span className={`text-sm ${textColor} w-6`}>{strokeWidth}</span>
          </div>
        </div>

        {/* Annotations list */}
        <div className="flex-1 overflow-y-auto p-4">
          <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>List</span>
          <div className="mt-2 space-y-2">
            {annotations.map(annotation => (
              <div
                key={annotation.id}
                onClick={() => onAnnotationSelect?.(annotation.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 ${
                  selectedAnnotationId === annotation.id ? selectedBg : hoverBg
                }`}
              >
                <div className="h-4 w-4 rounded" style={{ backgroundColor: annotation.color }} />
                <span className={`text-sm ${textColor} flex-1 truncate`}>
                  {annotation.type}
                  {' '}
                  {annotation.content ? `- ${annotation.content.substring(0, 20)}...` : ''}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); onAnnotationUpdate?.(annotation.id, { isHidden: !annotation.isHidden });
                    }}
                    className={`p-1 ${hoverBg} rounded`}
                  >
                    {annotation.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); onAnnotationDelete?.(annotation.id);
                    }}
                    className={`p-1 ${hoverBg} rounded text-red-500`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full flex-col ${className}`}>
      {/* Toolbar */}
      <div className={`border-b p-3 ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`rounded-lg p-2 ${activeTool === tool.id ? 'bg-blue-500 text-white' : `${hoverBg} ${mutedColor}`}`}
              title={tool.label}
            >
              <tool.icon size={18} />
            </button>
          ))}

          <div className={`h-6 w-px ${borderColor} mx-2`} />

          {/* Colors */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 ${hoverBg} flex items-center gap-2 rounded-lg`}
            >
              <div className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: activeColor }} />
              <ChevronDown size={14} className={mutedColor} />
            </button>

            {showColorPicker && (
              <div className={`absolute top-full left-0 mt-2 ${bgColor} border ${borderColor} z-10 rounded-lg p-3 shadow-xl`}>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setActiveColor(color); setShowColorPicker(false);
                      }}
                      className={`h-6 w-6 rounded-full border-2 ${activeColor === color ? 'border-blue-500' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={activeColor}
                  onChange={e => setActiveColor(e.target.value)}
                  className="mt-2 h-8 w-full cursor-pointer rounded"
                />
              </div>
            )}
          </div>

          {/* Stroke width */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={e => setStrokeWidth(Number.parseInt(e.target.value))}
              className="w-20"
            />
            <span className={`text-xs ${mutedColor}`}>
              {strokeWidth}
              px
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleUndo} disabled={historyIndex === 0} className={`p-2 ${hoverBg} rounded-lg disabled:opacity-50`}>
            <Undo size={18} className={mutedColor} />
          </button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={`p-2 ${hoverBg} rounded-lg disabled:opacity-50`}>
            <Redo size={18} className={mutedColor} />
          </button>

          <div className={`h-6 w-px ${borderColor}`} />

          <button onClick={() => setZoom(zoom - 0.1)} disabled={zoom <= 0.5} className={`p-2 ${hoverBg} rounded-lg disabled:opacity-50`}>
            <ZoomOut size={18} className={mutedColor} />
          </button>
          <span className={`text-sm ${textColor} w-12 text-center`}>
            {Math.round(zoom * 100)}
            %
          </span>
          <button onClick={() => setZoom(zoom + 0.1)} disabled={zoom >= 2} className={`p-2 ${hoverBg} rounded-lg disabled:opacity-50`}>
            <ZoomIn size={18} className={mutedColor} />
          </button>

          <div className={`h-6 w-px ${borderColor}`} />

          <button className={`p-2 ${hoverBg} rounded-lg`}>
            <Download size={18} className={mutedColor} />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-2 ${hoverBg} rounded-lg`}>
            <Settings size={18} className={mutedColor} />
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div
          ref={canvasRef}
          className={`flex-1 ${inputBg} cursor- relative overflow-auto${activeTool === 'freehand' || activeTool === 'highlight' ? 'crosshair' : activeTool === 'select' ? 'default' : 'crosshair'}`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Annotations */}
          {annotations.map(renderAnnotation)}

          {/* Current drawing */}
          {isDrawing && currentPoints.length > 1 && (
            <svg
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <path
                d={currentPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * zoom} ${p.y * zoom}`).join(' ')}
                fill="none"
                stroke={activeColor}
                strokeWidth={activeTool === 'highlight' ? 20 * zoom : strokeWidth * zoom}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={activeTool === 'highlight' ? 0.3 : opacity}
              />
            </svg>
          )}
        </div>

        {/* Sidebar */}
        {showSettings && (
          <div className={`w-64 border-l ${borderColor} space-y-4 p-4`}>
            <div>
              <span className={`text-sm font-medium ${textColor}`}>
                Annotations (
                {annotations.length}
                )
              </span>
              <div className="mt-2 max-h-60 space-y-2 overflow-y-auto">
                {annotations.map(annotation => (
                  <div
                    key={annotation.id}
                    onClick={() => onAnnotationSelect?.(annotation.id)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 ${
                      selectedAnnotationId === annotation.id ? selectedBg : hoverBg
                    }`}
                  >
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: annotation.color }} />
                    <span className={`text-sm ${textColor} flex-1 truncate`}>{annotation.type}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); onAnnotationDelete?.(annotation.id);
                      }}
                      className="text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {selectedAnnotationId && (() => {
              const selected = annotations.find(a => a.id === selectedAnnotationId);
              if (!selected) {
                return null;
              }

              return (
                <div className={`border-t ${borderColor} pt-4`}>
                  <span className={`text-sm font-medium ${textColor}`}>Properties</span>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className={`text-xs ${mutedColor}`}>Color</label>
                      <input
                        type="color"
                        value={selected.color}
                        onChange={e => onAnnotationUpdate?.(selected.id, { color: e.target.value })}
                        className="h-8 w-full cursor-pointer rounded"
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor}`}>Opacity</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={selected.opacity}
                        onChange={e => onAnnotationUpdate?.(selected.id, { opacity: Number.parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAnnotationUpdate?.(selected.id, { isLocked: !selected.isLocked })}
                        className={`flex flex-1 items-center justify-center gap-1 px-2 py-1.5 ${inputBg} rounded ${hoverBg}`}
                      >
                        {selected.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                        <span className={`text-xs ${textColor}`}>{selected.isLocked ? 'Unlock' : 'Lock'}</span>
                      </button>
                      <button
                        onClick={() => onAnnotationUpdate?.(selected.id, { isHidden: !selected.isHidden })}
                        className={`flex flex-1 items-center justify-center gap-1 px-2 py-1.5 ${inputBg} rounded ${hoverBg}`}
                      >
                        {selected.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span className={`text-xs ${textColor}`}>{selected.isHidden ? 'Show' : 'Hide'}</span>
                      </button>
                    </div>
                    <button
                      onClick={() => onAnnotationDelete?.(selected.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-500 dark:bg-red-900/20"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t p-2 ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Layers size={14} className={mutedColor} />
          <span className={`text-xs ${mutedColor}`}>
            {annotations.length}
            {' '}
            annotations
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Copy size={14} className={mutedColor} />
          <span className={`text-xs ${mutedColor}`}>Ctrl+C to copy</span>
        </div>
      </div>
    </div>
  );
}
