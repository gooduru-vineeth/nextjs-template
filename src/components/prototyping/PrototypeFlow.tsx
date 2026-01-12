'use client';

import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Eye,
  Layers,
  Link2,
  Maximize2,
  Monitor,
  MousePointer2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings,
  Share2,
  Smartphone,
  Tablet,
  Unlink,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export type FlowNode = {
  id: string;
  name: string;
  type: 'screen' | 'component' | 'modal' | 'overlay' | 'action';
  x: number;
  y: number;
  width: number;
  height: number;
  thumbnail?: string;
  isStartScreen?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
};

export type FlowConnection = {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromAnchor?: 'top' | 'right' | 'bottom' | 'left';
  toAnchor?: 'top' | 'right' | 'bottom' | 'left';
  trigger: 'tap' | 'swipe' | 'hover' | 'drag' | 'longPress' | 'doubleTap' | 'scroll';
  animation?: 'instant' | 'dissolve' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'pushLeft' | 'pushRight' | 'flip' | 'zoom';
  duration?: number;
  condition?: string;
  hotspotArea?: { x: number; y: number; width: number; height: number };
};

export type PrototypeFlowProps = {
  nodes: FlowNode[];
  connections: FlowConnection[];
  selectedNodeId?: string;
  selectedConnectionId?: string;
  onNodeSelect?: (nodeId: string | null) => void;
  onConnectionSelect?: (connectionId: string | null) => void;
  onNodeMove?: (nodeId: string, x: number, y: number) => void;
  onNodeAdd?: (node: Partial<FlowNode>) => void;
  onConnectionAdd?: (connection: Partial<FlowConnection>) => void;
  onConnectionRemove?: (connectionId: string) => void;
  onPreviewStart?: (startNodeId: string) => void;
  onZoomChange?: (zoom: number) => void;
  variant?: 'full' | 'compact' | 'canvas' | 'sidebar' | 'minimal';
  showMinimap?: boolean;
  showToolbar?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function PrototypeFlow({
  nodes,
  connections,
  selectedNodeId,
  selectedConnectionId,
  onNodeSelect,
  onConnectionSelect,
  onNodeMove,
  onNodeAdd,
  onConnectionAdd,
  onConnectionRemove,
  onPreviewStart,
  onZoomChange,
  variant = 'full',
  showMinimap = true,
  showToolbar = true,
  darkMode = false,
  className = '',
}: PrototypeFlowProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showNodePanel, setShowNodePanel] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';
  const canvasBg = darkMode ? 'bg-gray-950' : 'bg-gray-100';

  const handleZoom = useCallback((delta: number) => {
    const newZoom = Math.max(0.25, Math.min(2, zoom + delta));
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onNodeSelect?.(null);
      onConnectionSelect?.(null);
    }
  }, [pan, onNodeSelect, onConnectionSelect]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleNodeDrag = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      return;
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const nodeStartX = node.x;
    const nodeStartY = node.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;
      onNodeMove?.(nodeId, nodeStartX + deltaX, nodeStartY + deltaY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [nodes, zoom, onNodeMove]);

  const handleStartConnection = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);

  const handleEndConnection = useCallback((toNodeId: string) => {
    if (isConnecting && connectingFrom && connectingFrom !== toNodeId) {
      onConnectionAdd?.({
        fromNodeId: connectingFrom,
        toNodeId,
        trigger: 'tap',
        animation: 'slideLeft',
        duration: 300,
      });
    }
    setIsConnecting(false);
    setConnectingFrom(null);
  }, [isConnecting, connectingFrom, onConnectionAdd]);

  const getConnectionPath = (connection: FlowConnection): string => {
    const fromNode = nodes.find(n => n.id === connection.fromNodeId);
    const toNode = nodes.find(n => n.id === connection.toNodeId);
    if (!fromNode || !toNode) {
      return '';
    }

    const fromX = fromNode.x + fromNode.width;
    const fromY = fromNode.y + fromNode.height / 2;
    const toX = toNode.x;
    const toY = toNode.y + toNode.height / 2;

    const controlX1 = fromX + Math.abs(toX - fromX) / 3;
    const controlX2 = toX - Math.abs(toX - fromX) / 3;

    return `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
  };

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      tap: 'Tap',
      swipe: 'Swipe',
      hover: 'Hover',
      drag: 'Drag',
      longPress: 'Long Press',
      doubleTap: 'Double Tap',
      scroll: 'Scroll',
    };
    return labels[trigger] || trigger;
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone size={14} />;
      case 'tablet':
        return <Tablet size={14} />;
      default:
        return <Monitor size={14} />;
    }
  };

  const renderNode = (node: FlowNode) => {
    const isSelected = selectedNodeId === node.id;
    const hasConnections = connections.some(c => c.fromNodeId === node.id || c.toNodeId === node.id);

    return (
      <div
        key={node.id}
        className={`absolute cursor-move select-none ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          left: node.x * zoom + pan.x,
          top: node.y * zoom + pan.y,
          width: node.width * zoom,
          height: node.height * zoom,
        }}
        onClick={(e) => {
          e.stopPropagation(); onNodeSelect?.(node.id);
        }}
        onMouseDown={e => handleNodeDrag(node.id, e)}
      >
        {/* Node card */}
        <div className={`h-full w-full ${bgColor} rounded-lg border shadow-lg ${borderColor} overflow-hidden`}>
          {/* Thumbnail/preview */}
          <div className={`h-[calc(100%-40px)] w-full ${canvasBg} flex items-center justify-center`}>
            {node.thumbnail
              ? (
                  <img src={node.thumbnail} alt={node.name} className="h-full w-full object-cover" />
                )
              : (
                  <div className={`text-center ${mutedColor}`}>
                    {node.type === 'screen' && <Monitor size={32} className="mx-auto mb-2" />}
                    {node.type === 'component' && <Layers size={32} className="mx-auto mb-2" />}
                    {node.type === 'modal' && <Maximize2 size={32} className="mx-auto mb-2" />}
                    <span className="text-xs">No preview</span>
                  </div>
                )}
          </div>

          {/* Node info */}
          <div className={`flex h-10 items-center justify-between border-t px-3 ${borderColor}`}>
            <div className="flex items-center gap-2 overflow-hidden">
              {node.isStartScreen && (
                <Play size={12} className="flex-shrink-0 text-green-500" />
              )}
              <span className={`truncate text-sm ${textColor}`}>{node.name}</span>
            </div>
            {node.deviceType && getDeviceIcon(node.deviceType)}
          </div>
        </div>

        {/* Connection points */}
        {isSelected && (
          <>
            {/* Left anchor */}
            <div
              className={`absolute top-1/2 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                hasConnections ? 'bg-blue-500' : inputBg
              } cursor-crosshair border-2 border-white`}
              onClick={(e) => {
                e.stopPropagation(); handleEndConnection(node.id);
              }}
            />
            {/* Right anchor */}
            <div
              className={`absolute top-1/2 right-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full ${
                isConnecting && connectingFrom === node.id ? 'bg-green-500' : inputBg
              } cursor-crosshair border-2 border-white`}
              onClick={(e) => {
                e.stopPropagation(); handleStartConnection(node.id);
              }}
            />
          </>
        )}

        {/* Start screen badge */}
        {node.isStartScreen && (
          <div className="absolute -top-2 -left-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
            Start
          </div>
        )}
      </div>
    );
  };

  const renderConnection = (connection: FlowConnection) => {
    const isSelected = selectedConnectionId === connection.id;
    const path = getConnectionPath(connection);
    if (!path) {
      return null;
    }

    const fromNode = nodes.find(n => n.id === connection.fromNodeId);
    const toNode = nodes.find(n => n.id === connection.toNodeId);
    if (!fromNode || !toNode) {
      return null;
    }

    const midX = (fromNode.x + fromNode.width + toNode.x) / 2;
    const midY = (fromNode.y + fromNode.height / 2 + toNode.y + toNode.height / 2) / 2;

    return (
      <g key={connection.id}>
        {/* Connection line */}
        <path
          d={path}
          fill="none"
          stroke={isSelected ? '#3b82f6' : darkMode ? '#4b5563' : '#9ca3af'}
          strokeWidth={isSelected ? 3 : 2}
          strokeDasharray={connection.trigger === 'hover' ? '5,5' : undefined}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); onConnectionSelect?.(connection.id);
          }}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        />

        {/* Arrow head */}
        <polygon
          points={`${toNode.x * zoom - 10 + pan.x},${(toNode.y + toNode.height / 2) * zoom - 5 + pan.y} ${toNode.x * zoom + pan.x},${(toNode.y + toNode.height / 2) * zoom + pan.y} ${toNode.x * zoom - 10 + pan.x},${(toNode.y + toNode.height / 2) * zoom + 5 + pan.y}`}
          fill={isSelected ? '#3b82f6' : darkMode ? '#4b5563' : '#9ca3af'}
        />

        {/* Trigger label */}
        {isSelected && (
          <foreignObject
            x={midX * zoom + pan.x - 40}
            y={midY * zoom + pan.y - 12}
            width={80}
            height={24}
          >
            <div className={`${bgColor} rounded px-2 py-1 text-xs ${textColor} border text-center ${borderColor} shadow`}>
              {getTriggerLabel(connection.trigger)}
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Layers size={16} className={mutedColor} />
          <span className={`text-sm ${textColor}`}>
            {nodes.length}
            {' '}
            screens
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link2 size={16} className={mutedColor} />
          <span className={`text-sm ${textColor}`}>
            {connections.length}
            {' '}
            links
          </span>
        </div>
        <button
          onClick={() => {
            setIsPlaying(true); onPreviewStart?.(nodes.find(n => n.isStartScreen)?.id || nodes[0]?.id || '');
          }}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white"
        >
          <Play size={14} />
          Preview
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Prototype Flow</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleZoom(-0.1)}
              className={`p-1.5 ${inputBg} rounded ${hoverBg}`}
            >
              <ZoomOut size={14} className={mutedColor} />
            </button>
            <span className={`text-xs ${mutedColor} w-10 text-center`}>
              {Math.round(zoom * 100)}
              %
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className={`p-1.5 ${inputBg} rounded ${hoverBg}`}
            >
              <ZoomIn size={14} className={mutedColor} />
            </button>
          </div>
        </div>

        <div
          className={`${canvasBg} relative h-48 overflow-hidden rounded-lg`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          ref={canvasRef}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {connections.map(renderConnection)}
          </svg>
          {nodes.map(renderNode)}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs ${mutedColor}`}>
            {nodes.length}
            {' '}
            screens •
            {connections.length}
            {' '}
            connections
          </span>
          <button
            onClick={() => {
              setIsPlaying(true); onPreviewStart?.(nodes.find(n => n.isStartScreen)?.id || nodes[0]?.id || '');
            }}
            className="flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs text-white"
          >
            <Play size={12} />
            Preview
          </button>
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-72 flex-col border-l ${borderColor} ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${textColor}`}>Flow</h3>
            <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}>
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Screens list */}
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>
              Screens (
              {nodes.length}
              )
            </span>
            <button
              onClick={() => onNodeAdd?.({ name: 'New Screen', type: 'screen', x: 100, y: 100, width: 200, height: 300 })}
              className={`p-1 ${mutedColor} ${hoverBg} rounded`}
            >
              <Plus size={14} />
            </button>
          </div>

          {nodes.map(node => (
            <button
              key={node.id}
              onClick={() => onNodeSelect?.(node.id)}
              className={`flex w-full items-center gap-3 rounded-lg p-2 ${
                selectedNodeId === node.id ? 'bg-blue-500 text-white' : `${hoverBg} ${textColor}`
              }`}
            >
              <div className={`h-14 w-10 ${canvasBg} flex flex-shrink-0 items-center justify-center rounded`}>
                {node.thumbnail
                  ? (
                      <img src={node.thumbnail} alt="" className="h-full w-full rounded object-cover" />
                    )
                  : (
                      getDeviceIcon(node.deviceType || 'mobile')
                    )}
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <div className="flex items-center gap-1">
                  {node.isStartScreen && <Play size={10} className="flex-shrink-0 text-green-500" />}
                  <span className="truncate text-sm">{node.name}</span>
                </div>
                <span className={`text-xs ${selectedNodeId === node.id ? 'text-blue-100' : mutedColor}`}>
                  {connections.filter(c => c.fromNodeId === node.id).length}
                  {' '}
                  outgoing
                </span>
              </div>
              <ChevronRight size={16} className={selectedNodeId === node.id ? 'text-blue-100' : mutedColor} />
            </button>
          ))}
        </div>

        {/* Connections panel */}
        <div className={`border-t p-4 ${borderColor}`}>
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>
              Connections (
              {connections.length}
              )
            </span>
          </div>

          {selectedNodeId && (
            <div className="space-y-1">
              {connections
                .filter(c => c.fromNodeId === selectedNodeId || c.toNodeId === selectedNodeId)
                .slice(0, 3)
                .map((conn) => {
                  const targetNode = nodes.find(n => n.id === (conn.fromNodeId === selectedNodeId ? conn.toNodeId : conn.fromNodeId));
                  return (
                    <div
                      key={conn.id}
                      onClick={() => onConnectionSelect?.(conn.id)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 ${
                        selectedConnectionId === conn.id ? 'bg-blue-500/20' : hoverBg
                      }`}
                    >
                      <ArrowRight size={12} className={mutedColor} />
                      <span className={`text-xs ${textColor} truncate`}>{targetNode?.name}</span>
                      <span className={`text-xs ${mutedColor}`}>{getTriggerLabel(conn.trigger)}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Preview button */}
        <div className={`border-t p-4 ${borderColor}`}>
          <button
            onClick={() => {
              setIsPlaying(true); onPreviewStart?.(nodes.find(n => n.isStartScreen)?.id || nodes[0]?.id || '');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            <Play size={16} />
            Preview Prototype
          </button>
        </div>
      </div>
    );
  }

  // Canvas variant
  if (variant === 'canvas') {
    return (
      <div className={`${canvasBg} relative h-full w-full ${className}`}>
        {/* Canvas */}
        <div
          className="h-full w-full cursor-grab overflow-hidden active:cursor-grabbing"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          ref={canvasRef}
        >
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
            {connections.map(renderConnection)}
          </svg>
          {nodes.map(renderNode)}
        </div>

        {/* Floating controls */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 ${bgColor} rounded-full border shadow-lg ${borderColor} flex items-center gap-1 p-1`}>
          <button onClick={() => handleZoom(-0.1)} className={`p-2 ${hoverBg} rounded-full`}>
            <ZoomOut size={16} className={mutedColor} />
          </button>
          <span className={`text-xs ${textColor} w-12 text-center`}>
            {Math.round(zoom * 100)}
            %
          </span>
          <button onClick={() => handleZoom(0.1)} className={`p-2 ${hoverBg} rounded-full`}>
            <ZoomIn size={16} className={mutedColor} />
          </button>
          <div className={`h-6 w-px ${borderColor} mx-1`} />
          <button
            onClick={() => {
              setZoom(1); setPan({ x: 0, y: 0 });
            }}
            className={`p-2 ${hoverBg} rounded-full`}
          >
            <RotateCcw size={16} className={mutedColor} />
          </button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full flex-col ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className={`border-b p-3 ${borderColor} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <h2 className={`font-semibold ${textColor}`}>Prototype Flow</h2>
            <span className={`text-sm ${mutedColor}`}>
              {nodes.length}
              {' '}
              screens •
              {connections.length}
              {' '}
              connections
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Device selector */}
            <div className={`flex items-center gap-1 ${inputBg} rounded-lg p-1`}>
              {(['mobile', 'tablet', 'desktop'] as const).map(device => (
                <button
                  key={device}
                  onClick={() => setPreviewDevice(device)}
                  className={`rounded p-1.5 ${
                    previewDevice === device ? 'bg-blue-500 text-white' : `${mutedColor} ${hoverBg}`
                  }`}
                >
                  {getDeviceIcon(device)}
                </button>
              ))}
            </div>

            <div className={`h-6 w-px ${borderColor}`} />

            {/* Zoom controls */}
            <button onClick={() => handleZoom(-0.1)} className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
              <ZoomOut size={16} className={mutedColor} />
            </button>
            <span className={`text-sm ${textColor} w-12 text-center`}>
              {Math.round(zoom * 100)}
              %
            </span>
            <button onClick={() => handleZoom(0.1)} className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
              <ZoomIn size={16} className={mutedColor} />
            </button>

            <div className={`h-6 w-px ${borderColor}`} />

            {/* Actions */}
            <button
              onClick={() => onNodeAdd?.({ name: 'New Screen', type: 'screen', x: 100, y: 100, width: 200, height: 300 })}
              className={`flex items-center gap-2 px-3 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
            >
              <Plus size={16} />
              Add Screen
            </button>

            <button
              onClick={() => {
                setIsPlaying(true); onPreviewStart?.(nodes.find(n => n.isStartScreen)?.id || nodes[0]?.id || '');
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Stop' : 'Preview'}
            </button>

            <button className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
              <Share2 size={16} className={mutedColor} />
            </button>
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Node panel */}
        {showNodePanel && (
          <div className={`w-64 border-r ${borderColor} flex flex-col`}>
            <div className={`border-b p-3 ${borderColor} flex items-center justify-between`}>
              <button
                onClick={() => setShowNodePanel(!showNodePanel)}
                className={`flex items-center gap-2 ${textColor}`}
              >
                <ChevronDown size={16} />
                <span className="text-sm font-medium">Screens</span>
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {nodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => onNodeSelect?.(node.id)}
                  className={`flex w-full items-center gap-3 rounded-lg p-2 ${
                    selectedNodeId === node.id ? 'bg-blue-500 text-white' : `${hoverBg} ${textColor}`
                  }`}
                >
                  <div className={`h-12 w-8 ${canvasBg} flex flex-shrink-0 items-center justify-center rounded text-xs`}>
                    {node.thumbnail
                      ? (
                          <img src={node.thumbnail} alt="" className="h-full w-full rounded object-cover" />
                        )
                      : (
                          getDeviceIcon(node.deviceType || 'mobile')
                        )}
                  </div>
                  <div className="flex-1 overflow-hidden text-left">
                    <div className="flex items-center gap-1">
                      {node.isStartScreen && <Play size={10} className="text-green-500" />}
                      <span className="truncate text-sm">{node.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Canvas area */}
        <div
          className={`flex-1 ${canvasBg} relative cursor-grab overflow-hidden active:cursor-grabbing`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          ref={canvasRef}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, ${darkMode ? '#374151' : '#9ca3af'} 1px, transparent 1px)`,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              backgroundPosition: `${pan.x % (20 * zoom)}px ${pan.y % (20 * zoom)}px`,
            }}
          />

          {/* Connections */}
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
            {connections.map(renderConnection)}
          </svg>

          {/* Nodes */}
          {nodes.map(renderNode)}

          {/* Connection mode indicator */}
          {isConnecting && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 ${bgColor} flex items-center gap-2 rounded-full px-4 py-2 shadow-lg`}>
              <MousePointer2 size={16} className="text-blue-500" />
              <span className={`text-sm ${textColor}`}>Click on a screen to connect</span>
              <button
                onClick={() => {
                  setIsConnecting(false); setConnectingFrom(null);
                }}
                className="text-sm text-red-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Properties panel */}
        {(selectedNodeId || selectedConnectionId) && (
          <div className={`w-72 border-l ${borderColor} flex flex-col`}>
            <div className={`border-b p-3 ${borderColor}`}>
              <h4 className={`font-medium ${textColor}`}>
                {selectedNodeId ? 'Screen Properties' : 'Connection Properties'}
              </h4>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {selectedNodeId && (() => {
                const node = nodes.find(n => n.id === selectedNodeId);
                if (!node) {
                  return null;
                }

                return (
                  <>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>Name</label>
                      <input
                        type="text"
                        value={node.name}
                        readOnly
                        className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>Type</label>
                      <div className={`px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}>
                        {node.type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={node.isStartScreen} readOnly className="rounded" />
                      <span className={`text-sm ${textColor}`}>Start screen</span>
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-2 block`}>Outgoing Connections</label>
                      <div className="space-y-1">
                        {connections.filter(c => c.fromNodeId === selectedNodeId).map((conn) => {
                          const target = nodes.find(n => n.id === conn.toNodeId);
                          return (
                            <div
                              key={conn.id}
                              className={`flex items-center justify-between p-2 ${inputBg} rounded-lg`}
                            >
                              <div className="flex items-center gap-2">
                                <ArrowRight size={14} className={mutedColor} />
                                <span className={`text-sm ${textColor}`}>{target?.name}</span>
                              </div>
                              <button
                                onClick={() => onConnectionRemove?.(conn.id)}
                                className="text-xs text-red-500"
                              >
                                <Unlink size={12} />
                              </button>
                            </div>
                          );
                        })}
                        <button
                          onClick={() => handleStartConnection(selectedNodeId)}
                          className={`flex w-full items-center justify-center gap-2 p-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
                        >
                          <Link2 size={14} />
                          Add Connection
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}

              {selectedConnectionId && (() => {
                const conn = connections.find(c => c.id === selectedConnectionId);
                if (!conn) {
                  return null;
                }

                const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                const toNode = nodes.find(n => n.id === conn.toNodeId);

                return (
                  <>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>From</label>
                      <div className={`px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}>
                        {fromNode?.name}
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>To</label>
                      <div className={`px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor} text-sm`}>
                        {toNode?.name}
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>Trigger</label>
                      <select className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}>
                        <option value="tap">Tap</option>
                        <option value="swipe">Swipe</option>
                        <option value="hover">Hover</option>
                        <option value="longPress">Long Press</option>
                        <option value="doubleTap">Double Tap</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>Animation</label>
                      <select className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}>
                        <option value="instant">Instant</option>
                        <option value="dissolve">Dissolve</option>
                        <option value="slideLeft">Slide Left</option>
                        <option value="slideRight">Slide Right</option>
                        <option value="slideUp">Slide Up</option>
                        <option value="slideDown">Slide Down</option>
                        <option value="pushLeft">Push Left</option>
                        <option value="pushRight">Push Right</option>
                        <option value="flip">Flip</option>
                        <option value="zoom">Zoom</option>
                      </select>
                    </div>
                    <div>
                      <label className={`text-xs ${mutedColor} mb-1 block`}>Duration (ms)</label>
                      <input
                        type="number"
                        value={conn.duration || 300}
                        className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                      />
                    </div>
                    <button
                      onClick={() => onConnectionRemove?.(selectedConnectionId)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-500 dark:bg-red-900/20"
                    >
                      <Unlink size={14} />
                      Remove Connection
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Minimap */}
      {showMinimap && (
        <div className={`absolute right-4 bottom-4 h-28 w-40 ${bgColor} rounded-lg border shadow-lg ${borderColor} p-2`}>
          <div className={`h-full w-full ${canvasBg} relative overflow-hidden rounded`}>
            {nodes.map(node => (
              <div
                key={node.id}
                className={`absolute ${selectedNodeId === node.id ? 'bg-blue-500' : 'bg-gray-400'} rounded`}
                style={{
                  left: `${(node.x / 2000) * 100}%`,
                  top: `${(node.y / 1500) * 100}%`,
                  width: `${(node.width / 2000) * 100}%`,
                  height: `${(node.height / 1500) * 100}%`,
                }}
              />
            ))}
            {/* Viewport indicator */}
            <div
              className="absolute rounded border-2 border-blue-500"
              style={{
                left: `${(-pan.x / zoom / 2000) * 100}%`,
                top: `${(-pan.y / zoom / 1500) * 100}%`,
                width: `${(100 / zoom)}%`,
                height: `${(100 / zoom)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Preview overlay */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className={`${bgColor} overflow-hidden rounded-3xl shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
              <span className={`text-sm ${textColor}`}>Preview Mode</span>
              <div className="flex items-center gap-2">
                <Eye size={14} className={mutedColor} />
                <button
                  onClick={() => setIsPlaying(false)}
                  className="text-sm text-red-500"
                >
                  Exit Preview
                </button>
              </div>
            </div>
            <div className="p-8">
              <div
                className={`${canvasBg} overflow-hidden rounded-2xl`}
                style={{
                  width: previewDevice === 'mobile' ? 375 : previewDevice === 'tablet' ? 768 : 1024,
                  height: previewDevice === 'mobile' ? 812 : previewDevice === 'tablet' ? 1024 : 768,
                }}
              >
                {/* Preview content would go here */}
                <div className="flex h-full w-full items-center justify-center text-gray-500">
                  Preview content
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
