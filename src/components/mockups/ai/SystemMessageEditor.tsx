'use client';

import { BookOpen, Check, ChevronDown, Copy, Eye, EyeOff, RotateCcw, Save, Settings, Wand2 } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type SystemMessageTemplate = {
  id: string;
  name: string;
  content: string;
  category: string;
  description?: string;
};

export type SystemMessageEditorProps = {
  variant?: 'full' | 'compact' | 'inline' | 'modal';
  value?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  templates?: SystemMessageTemplate[];
  maxLength?: number;
  showCharCount?: boolean;
  showPreview?: boolean;
  placeholder?: string;
  className?: string;
};

const defaultTemplates: SystemMessageTemplate[] = [
  {
    id: 'helpful-assistant',
    name: 'Helpful Assistant',
    category: 'General',
    content: 'You are a helpful, harmless, and honest AI assistant. You provide accurate information and assist users with their questions to the best of your ability.',
    description: 'Standard helpful assistant persona',
  },
  {
    id: 'code-expert',
    name: 'Code Expert',
    category: 'Development',
    content: 'You are an expert software developer with deep knowledge of multiple programming languages and frameworks. You write clean, efficient, and well-documented code. You explain concepts clearly and help debug issues.',
    description: 'Expert programmer assistant',
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    category: 'Creative',
    content: 'You are a creative writing assistant with expertise in storytelling, poetry, and various literary forms. You help users craft compelling narratives, develop characters, and refine their writing style.',
    description: 'Creative writing assistant',
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'Analysis',
    content: 'You are a data analysis expert skilled in statistics, data visualization, and deriving insights from complex datasets. You explain your analysis clearly and provide actionable recommendations.',
    description: 'Data and analytics specialist',
  },
  {
    id: 'teacher',
    name: 'Patient Teacher',
    category: 'Education',
    content: 'You are a patient and encouraging teacher who adapts explanations to the student\'s level. You use examples, analogies, and step-by-step breakdowns to make complex concepts understandable.',
    description: 'Educational assistant',
  },
  {
    id: 'concise',
    name: 'Concise Responder',
    category: 'Style',
    content: 'You are an AI assistant that values brevity. Provide clear, direct answers without unnecessary elaboration. Use bullet points and short sentences when appropriate.',
    description: 'Brief and direct responses',
  },
  {
    id: 'professional',
    name: 'Professional Consultant',
    category: 'Business',
    content: 'You are a professional business consultant with expertise in strategy, operations, and management. You provide thoughtful advice backed by industry best practices and maintain a formal, professional tone.',
    description: 'Business professional persona',
  },
  {
    id: 'friendly',
    name: 'Friendly Chat',
    category: 'Social',
    content: 'You are a friendly and engaging conversational AI. You\'re warm, approachable, and enjoy casual conversation while still being helpful. You use a relaxed tone and occasional humor.',
    description: 'Casual friendly assistant',
  },
];

const SystemMessageEditor: React.FC<SystemMessageEditorProps> = ({
  variant = 'full',
  value = '',
  onChange,
  onSave,
  templates = defaultTemplates,
  maxLength = 4000,
  showCharCount = true,
  showPreview = false,
  placeholder = 'Enter system message to customize AI behavior...',
  className = '',
}) => {
  const [message, setMessage] = useState(value);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(showPreview);

  useEffect(() => {
    setMessage(value);
  }, [value]);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleChange = useCallback((newValue: string) => {
    if (newValue.length <= maxLength) {
      setMessage(newValue);
      onChange?.(newValue);
    }
  }, [maxLength, onChange]);

  const handleTemplateSelect = useCallback((template: SystemMessageTemplate) => {
    setMessage(template.content);
    onChange?.(template.content);
    setShowTemplates(false);
  }, [onChange]);

  const handleReset = useCallback(() => {
    setMessage('');
    onChange?.('');
  }, [onChange]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message]);

  const handleSave = useCallback(() => {
    onSave?.(message);
  }, [message, onSave]);

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Settings size={14} className="text-gray-500" />
        <input
          type="text"
          value={message}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title="Templates"
        >
          <BookOpen size={14} />
        </button>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">System Message</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Templates"
            >
              <BookOpen size={12} />
            </button>
            <button
              onClick={handleReset}
              className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Reset"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
        <textarea
          value={message}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />
        {showCharCount && (
          <div className="mt-0.5 text-right text-xs text-gray-400">
            {message.length}
            /
            {maxLength}
          </div>
        )}

        {showTemplates && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
            {templates.slice(0, 5).map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="w-full border-b border-gray-100 px-3 py-2 text-left text-xs last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="font-medium text-gray-800 dark:text-gray-200">{template.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Modal variant - content for modal container
  if (variant === 'modal') {
    return (
      <div className={`p-4 ${className}`}>
        {/* Template selector */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Templates</span>
            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <span>{selectedCategory}</span>
                <ChevronDown size={12} />
              </button>
              {showTemplates && (
                <div className="absolute top-full right-0 z-50 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowTemplates(false);
                      }}
                      className={`w-full px-3 py-1 text-left text-xs ${
                        selectedCategory === cat ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {filteredTemplates.slice(0, 4).map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            System Message
          </label>
          <textarea
            value={message}
            onChange={e => handleChange(e.target.value)}
            placeholder={placeholder}
            rows={6}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </div>
            {showCharCount && (
              <span className={`text-xs ${message.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                {message.length}
                /
                {maxLength}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-gray-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">System Message</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewVisible(!isPreviewVisible)}
              className={`rounded p-1.5 transition-colors ${
                isPreviewVisible ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-gray-400 hover:text-gray-600'
              }`}
              title={isPreviewVisible ? 'Hide preview' : 'Show preview'}
            >
              {isPreviewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={handleCopy}
              className="rounded p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
            <button
              onClick={handleReset}
              className="rounded p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize the AI&apos;s behavior and personality with a system message
        </p>
      </div>

      {/* Templates section */}
      <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 size={14} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Templates</span>
          </div>
          {/* Category filter */}
          <div className="flex items-center gap-1">
            {categories.slice(0, 4).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {filteredTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="rounded-lg border border-gray-200 bg-white p-2 text-left transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                {template.name}
              </div>
              {template.description && (
                <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                  {template.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="p-4">
        <textarea
          value={message}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        />

        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Tip: A good system message sets the tone, expertise, and constraints for the AI
          </div>
          {showCharCount && (
            <span className={`text-xs ${
              message.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'
            }`}
            >
              {message.length.toLocaleString()}
              /
              {maxLength.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Preview */}
      {isPreviewVisible && message && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">Preview</div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-start gap-2">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Settings size={12} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {message}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={handleReset}
          className="rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SystemMessageEditor;
