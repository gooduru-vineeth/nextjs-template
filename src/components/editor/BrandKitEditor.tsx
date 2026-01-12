'use client';

import type { BrandColor, BrandFont, BrandKit } from '@/types/BrandKit';
import { useState } from 'react';
import { brandKitTemplates } from '@/types/BrandKit';

type BrandKitEditorProps = {
  brandKit: BrandKit | null;
  onChange: (brandKit: BrandKit) => void;
  onClose: () => void;
};

export function BrandKitEditor({ brandKit, onChange, onClose }: BrandKitEditorProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'logos' | 'templates'>('colors');
  const [editingKit, setEditingKit] = useState<BrandKit>(
    brandKit || {
      id: `kit-${Date.now()}`,
      name: 'My Brand Kit',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      colors: [
        { name: 'Primary', hex: '#3B82F6', usage: 'primary' },
        { name: 'Secondary', hex: '#6B7280', usage: 'secondary' },
        { name: 'Accent', hex: '#10B981', usage: 'accent' },
      ],
      fonts: [
        { name: 'Heading', family: 'Inter, sans-serif', weight: 700, usage: 'heading' },
        { name: 'Body', family: 'Inter, sans-serif', weight: 400, usage: 'body' },
      ],
      logos: [],
      borderRadius: 'md',
      spacing: 'normal',
    },
  );

  const handleSave = () => {
    const updatedKit = {
      ...editingKit,
      updatedAt: new Date().toISOString(),
      primaryColor: editingKit.colors.find(c => c.usage === 'primary')?.hex,
      secondaryColor: editingKit.colors.find(c => c.usage === 'secondary')?.hex,
      accentColor: editingKit.colors.find(c => c.usage === 'accent')?.hex,
    };
    onChange(updatedKit);
    onClose();
  };

  const addColor = () => {
    setEditingKit(prev => ({
      ...prev,
      colors: [...prev.colors, { name: 'New Color', hex: '#000000' }],
    }));
  };

  const updateColor = (index: number, updates: Partial<BrandColor>) => {
    setEditingKit(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    }));
  };

  const removeColor = (index: number) => {
    setEditingKit(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const addFont = () => {
    setEditingKit(prev => ({
      ...prev,
      fonts: [...prev.fonts, { name: 'New Font', family: 'Arial, sans-serif' }],
    }));
  };

  const updateFont = (index: number, updates: Partial<BrandFont>) => {
    setEditingKit(prev => ({
      ...prev,
      fonts: prev.fonts.map((f, i) => (i === index ? { ...f, ...updates } : f)),
    }));
  };

  const removeFont = (index: number) => {
    setEditingKit(prev => ({
      ...prev,
      fonts: prev.fonts.filter((_, i) => i !== index),
    }));
  };

  const applyTemplate = (template: Partial<BrandKit>) => {
    setEditingKit(prev => ({
      ...prev,
      name: template.name || prev.name,
      description: template.description || prev.description,
      colors: template.colors || prev.colors,
      fonts: template.fonts || prev.fonts,
      borderRadius: template.borderRadius || prev.borderRadius,
      spacing: template.spacing || prev.spacing,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Brand Kit Editor</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create consistent styling across your mockups
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Kit Name and Description */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <input
            type="text"
            value={editingKit.name}
            onChange={e => setEditingKit(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Brand Kit Name"
            className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-lg font-medium focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            value={editingKit.description || ''}
            onChange={e => setEditingKit(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description (optional)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {(['colors', 'fonts', 'templates'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-h-[400px] overflow-y-auto p-6">
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">Brand Colors</h3>
                <button
                  type="button"
                  onClick={addColor}
                  className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  + Add Color
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {editingKit.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                  >
                    <input
                      type="color"
                      value={color.hex}
                      onChange={e => updateColor(index, { hex: e.target.value })}
                      className="size-10 cursor-pointer rounded border-0"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={color.name}
                        onChange={e => updateColor(index, { name: e.target.value })}
                        placeholder="Color name"
                        className="mb-1 w-full border-none bg-transparent p-0 text-sm font-medium focus:ring-0 dark:text-white"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={color.hex}
                          onChange={e => updateColor(index, { hex: e.target.value })}
                          placeholder="#000000"
                          className="w-20 border-none bg-transparent p-0 text-xs text-gray-500 focus:ring-0 dark:text-gray-400"
                        />
                        <select
                          value={color.usage || ''}
                          onChange={e => updateColor(index, { usage: e.target.value as BrandColor['usage'] || undefined })}
                          className="border-none bg-transparent p-0 text-xs text-gray-500 focus:ring-0 dark:text-gray-400"
                        >
                          <option value="">No usage</option>
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                          <option value="accent">Accent</option>
                          <option value="background">Background</option>
                          <option value="text">Text</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="rounded p-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h4>
                <div className="flex gap-2">
                  {editingKit.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="size-12 rounded-lg shadow-md"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">Typography</h3>
                <button
                  type="button"
                  onClick={addFont}
                  className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  + Add Font
                </button>
              </div>

              <div className="space-y-3">
                {editingKit.fonts.map((font, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                  >
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={font.name}
                        onChange={e => updateFont(index, { name: e.target.value })}
                        placeholder="Font name"
                        className="w-full border-none bg-transparent p-0 text-sm font-medium focus:ring-0 dark:text-white"
                      />
                      <input
                        type="text"
                        value={font.family}
                        onChange={e => updateFont(index, { family: e.target.value })}
                        placeholder="Font family (e.g., Inter, sans-serif)"
                        className="w-full border-none bg-transparent p-0 text-xs text-gray-500 focus:ring-0 dark:text-gray-400"
                      />
                      <div className="flex items-center gap-3">
                        <select
                          value={font.weight || 400}
                          onChange={e => updateFont(index, { weight: Number(e.target.value) })}
                          className="rounded border border-gray-200 p-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <option value={300}>Light (300)</option>
                          <option value={400}>Regular (400)</option>
                          <option value={500}>Medium (500)</option>
                          <option value={600}>Semibold (600)</option>
                          <option value={700}>Bold (700)</option>
                        </select>
                        <select
                          value={font.usage || ''}
                          onChange={e => updateFont(index, { usage: e.target.value as BrandFont['usage'] || undefined })}
                          className="rounded border border-gray-200 p-1 text-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <option value="">No usage</option>
                          <option value="heading">Heading</option>
                          <option value="body">Body</option>
                          <option value="caption">Caption</option>
                        </select>
                      </div>
                    </div>
                    <div
                      className="w-32 text-center"
                      style={{ fontFamily: font.family, fontWeight: font.weight }}
                    >
                      <span className="text-gray-900 dark:text-white">Sample Aa</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFont(index)}
                      className="rounded p-1 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Additional Options */}
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Options</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Border Radius</label>
                    <select
                      value={editingKit.borderRadius || 'md'}
                      onChange={e => setEditingKit(prev => ({ ...prev, borderRadius: e.target.value as BrandKit['borderRadius'] }))}
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="none">None</option>
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                      <option value="full">Full</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Spacing</label>
                    <select
                      value={editingKit.spacing || 'normal'}
                      onChange={e => setEditingKit(prev => ({ ...prev, spacing: e.target.value as BrandKit['spacing'] }))}
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Quick Start Templates</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Apply a pre-designed brand kit template as a starting point
              </p>

              <div className="grid grid-cols-2 gap-4">
                {brandKitTemplates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-600 dark:hover:border-blue-500"
                  >
                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{template.name}</h4>
                    <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{template.description}</p>
                    <div className="flex gap-1">
                      {template.colors?.slice(0, 4).map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="size-6 rounded"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Brand Kit
          </button>
        </div>
      </div>
    </div>
  );
}
