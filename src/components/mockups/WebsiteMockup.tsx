'use client';

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Box,
  ChevronDown,
  ChevronUp,
  Circle,
  Download,
  Eye,
  EyeOff,
  FileCode,
  Grid,
  Hand,
  Image,
  Layers,
  Layout,
  Lock,
  Menu,
  Monitor,
  MousePointer2,
  Pencil,
  Play,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Sparkles,
  Square,
  Tablet,
  Type,
  Unlock,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

// Types
export type MockupElement = {
  id: string;
  type: 'section' | 'container' | 'text' | 'image' | 'button' | 'input' | 'nav' | 'footer' | 'hero' | 'card' | 'form';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  styles: ElementStyles;
  children?: MockupElement[];
  content?: string;
  placeholder?: string;
};

export type ElementStyles = {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  padding?: number | { top: number; right: number; bottom: number; left: number };
  margin?: number | { top: number; right: number; bottom: number; left: number };
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  fontFamily?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  boxShadow?: string;
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'none';
  flexDirection?: 'row' | 'column';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
};

export type ViewportSize = {
  name: string;
  width: number;
  height: number;
  icon: React.ReactNode;
};

export type WebsiteMockupProps = {
  variant?: 'full' | 'preview' | 'editor';
  initialElements?: MockupElement[];
  viewportSize?: 'desktop' | 'tablet' | 'mobile';
  showGrid?: boolean;
  showRulers?: boolean;
  editable?: boolean;
  onElementsChange?: (elements: MockupElement[]) => void;
  onElementSelect?: (element: MockupElement | null) => void;
  onExport?: (format: 'png' | 'svg' | 'pdf') => void;
  className?: string;
};

// Viewport presets
const viewportPresets: Record<string, ViewportSize> = {
  desktop: { name: 'Desktop', width: 1440, height: 900, icon: <Monitor className="h-4 w-4" /> },
  laptop: { name: 'Laptop', width: 1280, height: 800, icon: <Monitor className="h-4 w-4" /> },
  tablet: { name: 'Tablet', width: 768, height: 1024, icon: <Tablet className="h-4 w-4" /> },
  mobile: { name: 'Mobile', width: 375, height: 812, icon: <Smartphone className="h-4 w-4" /> },
};

// Mock elements for demo
const generateMockElements = (): MockupElement[] => [
  {
    id: 'nav',
    type: 'nav',
    name: 'Navigation',
    x: 0,
    y: 0,
    width: 1440,
    height: 80,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    zIndex: 10,
    styles: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      borderStyle: 'solid',
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      padding: { top: 16, right: 48, bottom: 16, left: 48 },
    },
  },
  {
    id: 'hero',
    type: 'hero',
    name: 'Hero Section',
    x: 0,
    y: 80,
    width: 1440,
    height: 600,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    zIndex: 1,
    styles: {
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 64,
    },
    children: [
      {
        id: 'hero-title',
        type: 'text',
        name: 'Hero Title',
        x: 0,
        y: 0,
        width: 800,
        height: 60,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: 2,
        content: 'Build Beautiful Mockups',
        styles: {
          fontSize: 48,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
        },
      },
      {
        id: 'hero-subtitle',
        type: 'text',
        name: 'Hero Subtitle',
        x: 0,
        y: 70,
        width: 600,
        height: 40,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: 2,
        content: 'Create stunning website mockups in minutes',
        styles: {
          fontSize: 20,
          fontWeight: 'normal',
          color: '#6b7280',
          textAlign: 'center',
        },
      },
      {
        id: 'hero-cta',
        type: 'button',
        name: 'CTA Button',
        x: 0,
        y: 140,
        width: 200,
        height: 56,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: 2,
        content: 'Get Started',
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: 16,
          fontWeight: 'semibold',
          borderRadius: 8,
          textAlign: 'center',
        },
      },
    ],
  },
  {
    id: 'features',
    type: 'section',
    name: 'Features Section',
    x: 0,
    y: 680,
    width: 1440,
    height: 500,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    zIndex: 1,
    styles: {
      backgroundColor: '#ffffff',
      padding: 64,
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
    },
  },
  {
    id: 'footer',
    type: 'footer',
    name: 'Footer',
    x: 0,
    y: 1180,
    width: 1440,
    height: 200,
    rotation: 0,
    opacity: 1,
    locked: false,
    visible: true,
    zIndex: 1,
    styles: {
      backgroundColor: '#1f2937',
      padding: 48,
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'start',
    },
  },
];

// Element type palette
const elementTypes = [
  { type: 'section', name: 'Section', icon: <Layout className="h-4 w-4" /> },
  { type: 'container', name: 'Container', icon: <Box className="h-4 w-4" /> },
  { type: 'text', name: 'Text', icon: <Type className="h-4 w-4" /> },
  { type: 'image', name: 'Image', icon: <Image className="h-4 w-4" /> },
  { type: 'button', name: 'Button', icon: <Square className="h-4 w-4" /> },
  { type: 'input', name: 'Input', icon: <AlignLeft className="h-4 w-4" /> },
  { type: 'nav', name: 'Navigation', icon: <Menu className="h-4 w-4" /> },
  { type: 'hero', name: 'Hero', icon: <Sparkles className="h-4 w-4" /> },
  { type: 'card', name: 'Card', icon: <Square className="h-4 w-4" /> },
  { type: 'form', name: 'Form', icon: <FileCode className="h-4 w-4" /> },
];

// Sub-components
const Toolbar: React.FC<{
  activeTool: string;
  onToolChange: (tool: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}> = ({ activeTool, onToolChange, zoom, onZoomChange, onUndo, onRedo }) => {
  const tools = [
    { id: 'select', icon: <MousePointer2 className="h-4 w-4" />, label: 'Select' },
    { id: 'hand', icon: <Hand className="h-4 w-4" />, label: 'Pan' },
    { id: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
    { id: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
    { id: 'ellipse', icon: <Circle className="h-4 w-4" />, label: 'Ellipse' },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
      {/* Tools */}
      <div className="flex items-center gap-1 border-r border-gray-200 px-2 dark:border-gray-700">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className={`rounded-lg p-2 transition-colors ${
              activeTool === tool.id
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 border-r border-gray-200 px-2 dark:border-gray-700">
        <button
          onClick={onUndo}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={onRedo}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Redo"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1 px-2">
        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="w-16 text-center text-sm text-gray-700 dark:text-gray-300">
          {zoom}
          %
        </span>
        <button
          onClick={() => onZoomChange(Math.min(200, zoom + 25))}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const LayerPanel: React.FC<{
  elements: MockupElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}> = ({ elements, selectedId, onSelect, onToggleVisibility, onToggleLock, onDelete: _onDelete, onReorder: _onReorder }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderLayer = (element: MockupElement, depth = 0) => (
    <div key={element.id}>
      <div
        onClick={() => onSelect(element.id)}
        className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 transition-colors ${
          selectedId === element.id
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); onToggleVisibility(element.id);
          }}
          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {element.visible
            ? (
                <Eye className="h-3 w-3 text-gray-500" />
              )
            : (
                <EyeOff className="h-3 w-3 text-gray-400" />
              )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); onToggleLock(element.id);
          }}
          className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {element.locked
            ? (
                <Lock className="h-3 w-3 text-gray-500" />
              )
            : (
                <Unlock className="h-3 w-3 text-gray-400" />
              )}
        </button>
        <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">{element.name}</span>
        <span className="text-xs text-gray-400">{element.type}</span>
      </div>
      {element.children?.map(child => renderLayer(child, depth + 1))}
    </div>
  );

  return (
    <div className="flex w-64 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-white">Layers</span>
        </div>
        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </div>
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {elements.map(element => renderLayer(element))}
        </div>
      )}
    </div>
  );
};

const PropertiesPanel: React.FC<{
  element: MockupElement | null;
  onUpdate: (updates: Partial<MockupElement>) => void;
  onStyleUpdate: (styles: Partial<ElementStyles>) => void;
}> = ({ element, onUpdate, onStyleUpdate }) => {
  if (!element) {
    return (
      <div className="w-72 border-l border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Select an element to edit properties
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-72 flex-col border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-white">{element.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{element.type}</p>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Position & Size */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Position & Size</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">X</label>
              <input
                type="number"
                value={element.x}
                onChange={e => onUpdate({ x: Number(e.target.value) })}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Y</label>
              <input
                type="number"
                value={element.y}
                onChange={e => onUpdate({ y: Number(e.target.value) })}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Width</label>
              <input
                type="number"
                value={element.width}
                onChange={e => onUpdate({ width: Number(e.target.value) })}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Height</label>
              <input
                type="number"
                value={element.height}
                onChange={e => onUpdate({ height: Number(e.target.value) })}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.styles.backgroundColor || '#ffffff'}
                  onChange={e => onStyleUpdate({ backgroundColor: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  value={element.styles.backgroundColor || '#ffffff'}
                  onChange={e => onStyleUpdate({ backgroundColor: e.target.value })}
                  className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Border Radius</label>
              <input
                type="number"
                value={element.styles.borderRadius || 0}
                onChange={e => onStyleUpdate({ borderRadius: Number(e.target.value) })}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={element.opacity}
                onChange={e => onUpdate({ opacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Text Properties */}
        {(element.type === 'text' || element.type === 'button') && (
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Typography</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={element.styles.color || '#000000'}
                    onChange={e => onStyleUpdate({ color: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={element.styles.color || '#000000'}
                    onChange={e => onStyleUpdate({ color: e.target.value })}
                    className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Font Size</label>
                <input
                  type="number"
                  value={element.styles.fontSize || 16}
                  onChange={e => onStyleUpdate({ fontSize: Number(e.target.value) })}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Font Weight</label>
                <select
                  value={element.styles.fontWeight || 'normal'}
                  onChange={e => onStyleUpdate({ fontWeight: e.target.value as ElementStyles['fontWeight'] })}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">Text Align</label>
                <div className="flex gap-1">
                  {(['left', 'center', 'right', 'justify'] as const).map(align => (
                    <button
                      key={align}
                      onClick={() => onStyleUpdate({ textAlign: align })}
                      className={`rounded p-2 ${
                        element.styles.textAlign === align
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {align === 'left' && <AlignLeft className="h-4 w-4" />}
                      {align === 'center' && <AlignCenter className="h-4 w-4" />}
                      {align === 'right' && <AlignRight className="h-4 w-4" />}
                      {align === 'justify' && <AlignJustify className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ElementPalette: React.FC<{
  onAddElement: (type: string) => void;
}> = ({ onAddElement }) => (
  <div className="w-64 border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <h3 className="mb-4 font-medium text-gray-900 dark:text-white">Elements</h3>
    <div className="grid grid-cols-2 gap-2">
      {elementTypes.map(item => (
        <button
          key={item.type}
          onClick={() => onAddElement(item.type)}
          className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <div className="text-gray-600 dark:text-gray-300">{item.icon}</div>
          <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const Canvas: React.FC<{
  elements: MockupElement[];
  selectedId: string | null;
  viewport: ViewportSize;
  zoom: number;
  showGrid: boolean;
  onSelect: (id: string | null) => void;
  onElementMove: (id: string, x: number, y: number) => void;
  onElementResize: (id: string, width: number, height: number) => void;
}> = ({ elements, selectedId, viewport, zoom, showGrid, onSelect, onElementMove: _onElementMove, onElementResize: _onElementResize }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [, setIsDragging] = useState(false);
  const [, setDragOffset] = useState({ x: 0, y: 0 });

  const scale = zoom / 100;

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onSelect(elementId);
    setIsDragging(true);
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const renderElement = (element: MockupElement) => {
    const isSelected = selectedId === element.id;

    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      opacity: element.opacity,
      backgroundColor: element.styles.backgroundColor,
      borderRadius: element.styles.borderRadius,
      borderWidth: element.styles.borderWidth,
      borderColor: element.styles.borderColor,
      borderStyle: element.styles.borderStyle,
      color: element.styles.color,
      fontSize: element.styles.fontSize,
      fontWeight: element.styles.fontWeight === 'semibold' ? 600 : element.styles.fontWeight === 'medium' ? 500 : element.styles.fontWeight,
      textAlign: element.styles.textAlign,
      display: element.visible ? (element.styles.display || 'block') : 'none',
      flexDirection: element.styles.flexDirection,
      justifyContent: element.styles.justifyContent === 'between' ? 'space-between' : element.styles.justifyContent === 'around' ? 'space-around' : element.styles.justifyContent,
      alignItems: element.styles.alignItems,
      gap: element.styles.gap,
      cursor: element.locked ? 'default' : 'move',
      zIndex: element.zIndex,
    };

    // Apply padding
    if (element.styles.padding) {
      if (typeof element.styles.padding === 'number') {
        style.padding = element.styles.padding;
      } else {
        style.paddingTop = element.styles.padding.top;
        style.paddingRight = element.styles.padding.right;
        style.paddingBottom = element.styles.padding.bottom;
        style.paddingLeft = element.styles.padding.left;
      }
    }

    return (
      <div
        key={element.id}
        style={style}
        onMouseDown={e => !element.locked && handleMouseDown(e, element.id)}
        className={`${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      >
        {element.content && (
          <span className="flex h-full items-center justify-center">
            {element.content}
          </span>
        )}
        {element.children?.map(child => renderElement(child))}

        {/* Resize Handles */}
        {isSelected && !element.locked && (
          <>
            <div className="absolute -top-1 -left-1 h-2 w-2 cursor-nw-resize bg-blue-500" />
            <div className="absolute -top-1 -right-1 h-2 w-2 cursor-ne-resize bg-blue-500" />
            <div className="absolute -bottom-1 -left-1 h-2 w-2 cursor-sw-resize bg-blue-500" />
            <div className="absolute -right-1 -bottom-1 h-2 w-2 cursor-se-resize bg-blue-500" />
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900"
      onClick={() => onSelect(null)}
    >
      <div
        className="relative mx-auto my-8"
        style={{
          width: viewport.width * scale,
          height: viewport.height * scale,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {/* Canvas Background */}
        <div
          ref={canvasRef}
          className="relative bg-white shadow-2xl"
          style={{
            width: viewport.width,
            height: viewport.height,
            backgroundImage: showGrid
              ? 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)'
              : 'none',
            backgroundSize: '20px 20px',
          }}
        >
          {elements.map(element => renderElement(element))}
        </div>
      </div>
    </div>
  );
};

// Main component
export const WebsiteMockup: React.FC<WebsiteMockupProps> = ({
  variant = 'full',
  initialElements,
  viewportSize = 'desktop',
  showGrid: initialShowGrid = true,
  showRulers: _initialShowRulers = false,
  editable = true,
  onElementsChange,
  onElementSelect,
  onExport,
  className = '',
}) => {
  const [elements, setElements] = useState<MockupElement[]>(initialElements || generateMockElements());
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(100);
  const [viewport, setViewport] = useState<ViewportSize>(viewportPresets[viewportSize]!);
  const [showGrid, setShowGrid] = useState(initialShowGrid);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const selectedElement = useMemo(() =>
    elements.find(el => el.id === selectedElementId) || null, [elements, selectedElementId]);

  const handleElementSelect = useCallback((id: string | null) => {
    setSelectedElementId(id);
    const element = id ? elements.find(el => el.id === id) : null;
    onElementSelect?.(element || null);
  }, [elements, onElementSelect]);

  const handleElementUpdate = useCallback((updates: Partial<MockupElement>) => {
    if (!selectedElementId) {
      return;
    }
    setElements((prev) => {
      const updated = prev.map(el =>
        el.id === selectedElementId ? { ...el, ...updates } : el,
      );
      onElementsChange?.(updated);
      return updated;
    });
  }, [selectedElementId, onElementsChange]);

  const handleStyleUpdate = useCallback((styles: Partial<ElementStyles>) => {
    if (!selectedElementId) {
      return;
    }
    setElements((prev) => {
      const updated = prev.map(el =>
        el.id === selectedElementId
          ? { ...el, styles: { ...el.styles, ...styles } }
          : el,
      );
      onElementsChange?.(updated);
      return updated;
    });
  }, [selectedElementId, onElementsChange]);

  const handleToggleVisibility = useCallback((id: string) => {
    setElements((prev) => {
      const updated = prev.map(el =>
        el.id === id ? { ...el, visible: !el.visible } : el,
      );
      onElementsChange?.(updated);
      return updated;
    });
  }, [onElementsChange]);

  const handleToggleLock = useCallback((id: string) => {
    setElements((prev) => {
      const updated = prev.map(el =>
        el.id === id ? { ...el, locked: !el.locked } : el,
      );
      onElementsChange?.(updated);
      return updated;
    });
  }, [onElementsChange]);

  const handleDeleteElement = useCallback((id: string) => {
    setElements((prev) => {
      const updated = prev.filter(el => el.id !== id);
      onElementsChange?.(updated);
      return updated;
    });
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId, onElementsChange]);

  const handleAddElement = useCallback((type: string) => {
    const newElement: MockupElement = {
      id: `element-${Date.now()}`,
      type: type as MockupElement['type'],
      name: `New ${type}`,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : type === 'button' ? 120 : 300,
      height: type === 'text' ? 40 : type === 'button' ? 48 : 200,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: elements.length + 1,
      content: type === 'text' ? 'New Text' : type === 'button' ? 'Button' : undefined,
      styles: {
        backgroundColor: type === 'button' ? '#3b82f6' : '#f3f4f6',
        borderRadius: type === 'button' ? 8 : 0,
        color: type === 'button' ? '#ffffff' : '#1f2937',
        fontSize: type === 'text' ? 16 : 14,
        fontWeight: type === 'button' ? 'semibold' : 'normal',
        textAlign: 'center',
      },
    };
    setElements((prev) => {
      const updated = [...prev, newElement];
      onElementsChange?.(updated);
      return updated;
    });
    setSelectedElementId(newElement.id);
  }, [elements.length, onElementsChange]);

  // Preview variant
  if (variant === 'preview' || isPreviewMode) {
    return (
      <div className={`relative bg-gray-100 dark:bg-gray-900 ${className}`}>
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            {Object.entries(viewportPresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setViewport(preset)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  viewport.name === preset.name
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {preset.icon}
                <span className="text-sm">{preset.name}</span>
              </button>
            ))}
          </div>
          {variant === 'full' && (
            <button
              onClick={() => setIsPreviewMode(false)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

        {/* Preview Canvas */}
        <Canvas
          elements={elements}
          selectedId={null}
          viewport={viewport}
          zoom={zoom}
          showGrid={false}
          onSelect={() => {}}
          onElementMove={() => {}}
          onElementResize={() => {}}
        />
      </div>
    );
  }

  // Full editor variant
  return (
    <div className={`flex h-full flex-col bg-gray-100 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Website Mockup</h2>
          <div className="flex items-center gap-2">
            {Object.entries(viewportPresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setViewport(preset)}
                className={`rounded-lg p-2 transition-colors ${
                  viewport.name === preset.name
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
                title={preset.name}
              >
                {preset.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`rounded-lg p-2 transition-colors ${
              showGrid
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
            title="Toggle Grid"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            <Play className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => onExport?.('png')}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {editable && (
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Element Palette */}
        {editable && <ElementPalette onAddElement={handleAddElement} />}

        {/* Canvas */}
        <Canvas
          elements={elements}
          selectedId={selectedElementId}
          viewport={viewport}
          zoom={zoom}
          showGrid={showGrid}
          onSelect={handleElementSelect}
          onElementMove={(id, x, y) => {
            setElements(prev => prev.map(el =>
              el.id === id ? { ...el, x, y } : el,
            ));
          }}
          onElementResize={(id, width, height) => {
            setElements(prev => prev.map(el =>
              el.id === id ? { ...el, width, height } : el,
            ));
          }}
        />

        {/* Layers Panel */}
        <LayerPanel
          elements={elements}
          selectedId={selectedElementId}
          onSelect={handleElementSelect}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
          onDelete={handleDeleteElement}
          onReorder={() => {}}
        />

        {/* Properties Panel */}
        {editable && (
          <PropertiesPanel
            element={selectedElement}
            onUpdate={handleElementUpdate}
            onStyleUpdate={handleStyleUpdate}
          />
        )}
      </div>
    </div>
  );
};

// Export sub-components
export { Canvas, ElementPalette, LayerPanel, PropertiesPanel, Toolbar };

export default WebsiteMockup;
