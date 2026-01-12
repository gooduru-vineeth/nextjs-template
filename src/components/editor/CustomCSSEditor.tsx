'use client';

import {
  AlertCircle,
  Box,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Download,
  Eye,
  EyeOff,
  Info,
  Layers,
  Palette,
  Redo2,
  Search,
  Sparkles,
  Type,
  Undo2,
  Upload,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type CSSTarget
  = | 'container'
    | 'message'
    | 'bubble'
    | 'avatar'
    | 'timestamp'
    | 'header'
    | 'input'
    | 'background';

export type CSSVariable = {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'typography' | 'border' | 'shadow' | 'other';
  description?: string;
};

export type CSSSnippet = {
  id: string;
  name: string;
  description: string;
  css: string;
  category: string;
  target: CSSTarget;
};

export type CSSValidationError = {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
};

export type CustomCSSEditorProps = {
  initialCSS?: string;
  cssVariables?: CSSVariable[];
  onCSSChange?: (css: string) => void;
  onApply?: (css: string) => void;
  target?: CSSTarget;
  previewEnabled?: boolean;
  className?: string;
};

// ============================================================================
// CSS Snippets Library
// ============================================================================

const cssSnippets: CSSSnippet[] = [
  {
    id: 'rounded-bubbles',
    name: 'Rounded Bubbles',
    description: 'Extra rounded message bubbles',
    css: `.message-bubble {
  border-radius: 20px;
}`,
    category: 'Shape',
    target: 'bubble',
  },
  {
    id: 'gradient-background',
    name: 'Gradient Background',
    description: 'Colorful gradient background',
    css: `.chat-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`,
    category: 'Background',
    target: 'container',
  },
  {
    id: 'glass-effect',
    name: 'Glass Effect',
    description: 'Frosted glass appearance',
    css: `.message-bubble {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`,
    category: 'Effect',
    target: 'bubble',
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Glowing neon effect',
    css: `.message-bubble.sent {
  box-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88;
  border: 1px solid #00ff88;
}`,
    category: 'Effect',
    target: 'bubble',
  },
  {
    id: 'retro-font',
    name: 'Retro Typography',
    description: 'Pixel-style retro font',
    css: `.message-text {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}`,
    category: 'Typography',
    target: 'message',
  },
  {
    id: 'shadow-depth',
    name: 'Shadow Depth',
    description: 'Deep shadow for 3D effect',
    css: `.message-bubble {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
              0 10px 20px rgba(0, 0, 0, 0.1);
}`,
    category: 'Effect',
    target: 'bubble',
  },
  {
    id: 'custom-scrollbar',
    name: 'Custom Scrollbar',
    description: 'Styled scrollbar',
    css: `.chat-messages::-webkit-scrollbar {
  width: 8px;
}
.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}`,
    category: 'UI',
    target: 'container',
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode Override',
    description: 'Force dark theme',
    css: `.chat-container {
  background: #1a1a2e;
  color: #eee;
}
.message-bubble.received {
  background: #16213e;
}`,
    category: 'Theme',
    target: 'container',
  },
];

// ============================================================================
// CSS Validation
// ============================================================================

function validateCSS(css: string): CSSValidationError[] {
  const errors: CSSValidationError[] = [];
  const lines = css.split('\n');

  let braceCount = 0;
  let inComment = false;

  lines.forEach((line, lineIndex) => {
    const lineNum = lineIndex + 1;

    // Track multi-line comments
    if (line.includes('/*')) {
      inComment = true;
    }
    if (line.includes('*/')) {
      inComment = false;
    }
    if (inComment) {
      return;
    }

    // Check brace balance
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '{') {
        braceCount++;
      }
      if (line[i] === '}') {
        braceCount--;
      }

      if (braceCount < 0) {
        errors.push({
          line: lineNum,
          column: i + 1,
          message: 'Unexpected closing brace',
          severity: 'error',
        });
        braceCount = 0;
      }
    }

    // Check for missing semicolons in property declarations
    const trimmed = line.trim();
    if (trimmed && !trimmed.endsWith('{') && !trimmed.endsWith('}')
      && !trimmed.endsWith(';') && !trimmed.startsWith('/*')
      && !trimmed.endsWith('*/') && !trimmed.startsWith('//')
      && trimmed.includes(':')) {
      errors.push({
        line: lineNum,
        column: line.length,
        message: 'Missing semicolon',
        severity: 'warning',
      });
    }

    // Check for common typos
    const commonTypos = [
      { wrong: 'colour', right: 'color' },
      { wrong: 'backround', right: 'background' },
      { wrong: 'boarder', right: 'border' },
      { wrong: 'paddding', right: 'padding' },
      { wrong: 'marginn', right: 'margin' },
    ];

    commonTypos.forEach(({ wrong, right }) => {
      if (line.toLowerCase().includes(wrong)) {
        errors.push({
          line: lineNum,
          column: line.toLowerCase().indexOf(wrong) + 1,
          message: `Did you mean '${right}'?`,
          severity: 'info',
        });
      }
    });
  });

  // Check final brace balance
  if (braceCount > 0) {
    errors.push({
      line: lines.length,
      column: 1,
      message: `Missing ${braceCount} closing brace(s)`,
      severity: 'error',
    });
  }

  return errors;
}

// ============================================================================
// Hooks
// ============================================================================

export function useCSSHistory(initialValue: string = '') {
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentValue = history[currentIndex] ?? initialValue;

  const push = useCallback((value: string) => {
    if (value === currentValue) {
      return;
    }

    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(value);
      // Keep last 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setCurrentIndex(prev => Math.min(prev + 1, 49));
  }, [currentIndex, currentValue]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { currentValue, push, undo, redo, canUndo, canRedo };
}

// ============================================================================
// Sub-Components
// ============================================================================

type SnippetLibraryProps = {
  onInsert: (css: string) => void;
  target?: CSSTarget;
};

function SnippetLibrary({ onInsert, target }: SnippetLibraryProps) {
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredSnippets = useMemo(() => {
    return cssSnippets.filter((snippet) => {
      const matchesSearch = !search
        || snippet.name.toLowerCase().includes(search.toLowerCase())
        || snippet.description.toLowerCase().includes(search.toLowerCase());
      const matchesTarget = !target || snippet.target === target;
      return matchesSearch && matchesTarget;
    });
  }, [search, target]);

  const categories = useMemo(() => {
    const cats = new Set(filteredSnippets.map(s => s.category));
    return Array.from(cats);
  }, [filteredSnippets]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
      <div className="border-b bg-gray-50 p-3 dark:bg-gray-700">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search snippets..."
            className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm dark:bg-gray-800"
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {categories.map(category => (
          <div key={category}>
            <button
              onClick={() => setExpandedCategory(
                expandedCategory === category ? null : category,
              )}
              className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>{category}</span>
              {expandedCategory === category
                ? (
                    <ChevronDown className="h-4 w-4" />
                  )
                : (
                    <ChevronRight className="h-4 w-4" />
                  )}
            </button>

            {expandedCategory === category && (
              <div className="space-y-2 px-3 pb-2">
                {filteredSnippets
                  .filter(s => s.category === category)
                  .map(snippet => (
                    <button
                      key={snippet.id}
                      onClick={() => onInsert(snippet.css)}
                      className="w-full rounded border p-2 text-left transition-colors hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <div className="text-sm font-medium">{snippet.name}</div>
                      <div className="text-xs text-gray-500">{snippet.description}</div>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type CSSVariablePickerProps = {
  variables: CSSVariable[];
  onInsert: (variable: string) => void;
};

function CSSVariablePicker({ variables, onInsert }: CSSVariablePickerProps) {
  const [activeCategory, setActiveCategory] = useState<CSSVariable['category'] | 'all'>('all');

  const filteredVars = useMemo(() => {
    if (activeCategory === 'all') {
      return variables;
    }
    return variables.filter(v => v.category === activeCategory);
  }, [variables, activeCategory]);

  const categories: Array<{ value: CSSVariable['category'] | 'all'; label: string; icon: React.ReactNode }> = [
    { value: 'all', label: 'All', icon: <Layers className="h-4 w-4" /> },
    { value: 'color', label: 'Colors', icon: <Palette className="h-4 w-4" /> },
    { value: 'typography', label: 'Typography', icon: <Type className="h-4 w-4" /> },
    { value: 'spacing', label: 'Spacing', icon: <Box className="h-4 w-4" /> },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
      <div className="flex gap-1 border-b bg-gray-50 p-2 dark:bg-gray-700">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`
              flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors
              ${activeCategory === cat.value
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-200 dark:hover:bg-gray-600'}
            `}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="max-h-48 space-y-1 overflow-y-auto p-2">
        {filteredVars.map(variable => (
          <button
            key={variable.name}
            onClick={() => onInsert(`var(${variable.name})`)}
            className="flex w-full items-center gap-2 rounded p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {variable.category === 'color' && (
              <div
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: variable.value }}
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-xs">{variable.name}</div>
              <div className="truncate text-xs text-gray-500">{variable.value}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

type ValidationPanelProps = {
  errors: CSSValidationError[];
  onErrorClick?: (line: number) => void;
};

function ValidationPanel({ errors, onErrorClick }: ValidationPanelProps) {
  if (errors.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-300">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">No issues found</span>
      </div>
    );
  }

  const getIcon = (severity: CSSValidationError['severity']) => {
    switch (severity) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="border-b bg-gray-50 px-3 py-2 dark:bg-gray-700">
        <span className="text-sm font-medium">
          {errors.length}
          {' '}
          issue
          {errors.length !== 1 ? 's' : ''}
          {' '}
          found
        </span>
      </div>
      <div className="max-h-32 overflow-y-auto">
        {errors.map((error, index) => (
          <button
            key={index}
            onClick={() => onErrorClick?.(error.line)}
            className="flex w-full items-start gap-2 border-b p-2 text-left last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {getIcon(error.severity)}
            <div className="min-w-0 flex-1">
              <div className="text-sm">{error.message}</div>
              <div className="text-xs text-gray-500">
                Line
                {error.line}
                , Column
                {error.column}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function CustomCSSEditor({
  initialCSS = '',
  cssVariables = [],
  onCSSChange,
  onApply,
  target,
  previewEnabled: initialPreviewEnabled = true,
  className = '',
}: CustomCSSEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentValue, push, undo, redo, canUndo, canRedo } = useCSSHistory(initialCSS);
  const [localCSS, setLocalCSS] = useState(currentValue);
  const [showPreview, setShowPreview] = useState(initialPreviewEnabled);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [errors, setErrors] = useState<CSSValidationError[]>([]);

  // Sync local state with history
  useEffect(() => {
    setLocalCSS(currentValue);
  }, [currentValue]);

  // Validate on change
  useEffect(() => {
    const validationErrors = validateCSS(localCSS);
    setErrors(validationErrors);
  }, [localCSS]);

  const handleChange = useCallback((value: string) => {
    setLocalCSS(value);
    onCSSChange?.(value);
  }, [onCSSChange]);

  const handleBlur = useCallback(() => {
    if (localCSS !== currentValue) {
      push(localCSS);
    }
  }, [localCSS, currentValue, push]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(localCSS);
  }, [localCSS]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([localCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-styles.css';
    a.click();
    URL.revokeObjectURL(url);
  }, [localCSS]);

  const handleUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.css';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          handleChange(content);
          push(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [handleChange, push]);

  const handleInsertSnippet = useCallback((css: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = `${localCSS.slice(0, start)}\n${css}\n${localCSS.slice(end)}`;
      handleChange(newValue);
      push(newValue);
    } else {
      const newValue = `${localCSS}\n${css}`;
      handleChange(newValue);
      push(newValue);
    }
    setShowSnippets(false);
  }, [localCSS, handleChange, push]);

  const handleInsertVariable = useCallback((variable: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = localCSS.slice(0, start) + variable + localCSS.slice(end);
      handleChange(newValue);
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }
    setShowVariables(false);
  }, [localCSS, handleChange]);

  const handleApply = useCallback(() => {
    const hasErrors = errors.some(e => e.severity === 'error');
    if (!hasErrors) {
      onApply?.(localCSS);
    }
  }, [localCSS, errors, onApply]);

  const handleGoToLine = useCallback((line: number) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const lines = localCSS.split('\n');
      let position = 0;
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        position += (lines[i]?.length ?? 0) + 1;
      }
      textarea.focus();
      textarea.setSelectionRange(position, position);
    }
  }, [localCSS]);

  const hasErrors = errors.some(e => e.severity === 'error');

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Custom CSS</span>
          {target && (
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
              Target:
              {' '}
              {target}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="rounded p-2 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-600" />

          <button
            onClick={handleCopy}
            className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Copy CSS"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Download CSS"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleUpload}
            className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Upload CSS"
          >
            <Upload className="h-4 w-4" />
          </button>

          <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-600" />

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`rounded p-2 transition-colors ${
              showPreview
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setShowSnippets(!showSnippets);
            setShowVariables(false);
          }}
          className={`
            flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors
            ${showSnippets
      ? 'bg-blue-500 text-white'
      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}
          `}
        >
          <Sparkles className="h-4 w-4" />
          Snippets
        </button>

        {cssVariables.length > 0 && (
          <button
            onClick={() => {
              setShowVariables(!showVariables);
              setShowSnippets(false);
            }}
            className={`
              flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors
              ${showVariables
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}
            `}
          >
            <Palette className="h-4 w-4" />
            Variables
          </button>
        )}
      </div>

      {/* Snippets Panel */}
      {showSnippets && (
        <SnippetLibrary onInsert={handleInsertSnippet} target={target} />
      )}

      {/* Variables Panel */}
      {showVariables && cssVariables.length > 0 && (
        <CSSVariablePicker variables={cssVariables} onInsert={handleInsertVariable} />
      )}

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={localCSS}
          onChange={e => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={`
            h-64 w-full resize-y rounded-lg border bg-gray-50 p-4 font-mono
            text-sm dark:bg-gray-900
            ${hasErrors
      ? 'border-red-300 focus:ring-red-500 dark:border-red-700'
      : 'border-gray-200 focus:ring-blue-500 dark:border-gray-700'}
            focus:ring-2 focus:outline-none
          `}
          placeholder="/* Enter your custom CSS here */

.message-bubble {
  border-radius: 16px;
  padding: 12px;
}"
          spellCheck={false}
        />

        {localCSS && (
          <button
            onClick={() => {
              handleChange('');
              push('');
            }}
            className="absolute top-2 right-2 rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Validation Panel */}
      <ValidationPanel errors={errors} onErrorClick={handleGoToLine} />

      {/* Preview */}
      {showPreview && localCSS && (
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-gray-50 px-3 py-2 text-sm font-medium dark:bg-gray-700">
            Live Preview
          </div>
          <div className="p-4">
            <style dangerouslySetInnerHTML={{ __html: localCSS }} />
            <div className="chat-container rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <div className="chat-messages space-y-3">
                <div className="flex justify-start">
                  <div className="message-bubble received max-w-[70%] rounded-lg bg-white px-4 py-2 dark:bg-gray-700">
                    <span className="message-text">Hello! This is a preview of your styles.</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="message-bubble sent max-w-[70%] rounded-lg bg-blue-500 px-4 py-2 text-white">
                    <span className="message-text">Your custom CSS is applied here!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      {onApply && (
        <button
          onClick={handleApply}
          disabled={hasErrors}
          className={`
            w-full rounded-lg py-2 font-medium transition-colors
            ${hasErrors
          ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
          : 'bg-blue-500 text-white hover:bg-blue-600'}
          `}
        >
          {hasErrors ? 'Fix errors to apply' : 'Apply Styles'}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Compact Variant
// ============================================================================

export type CSSQuickEditorProps = {
  value: string;
  onChange: (value: string) => void;
  property: string;
  label?: string;
  type?: 'color' | 'size' | 'text' | 'select';
  options?: string[];
  className?: string;
};

export function CSSQuickEditor({
  value,
  onChange,
  property,
  label,
  type = 'text',
  options = [],
  className = '',
}: CSSQuickEditorProps) {
  const renderInput = () => {
    switch (type) {
      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={e => onChange(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border"
          />
        );

      case 'size':
        return (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={Number.parseInt(value) || 0}
              onChange={e => onChange(`${e.target.value}px`)}
              className="w-16 rounded border px-2 py-1 text-sm"
            />
            <span className="text-sm text-gray-500">px</span>
          </div>
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={property}
            className="flex-1 rounded border px-2 py-1 text-sm"
          />
        );
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="min-w-[80px] text-sm text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default CustomCSSEditor;
