'use client';

import { useCallback, useState } from 'react';

export type BrandColor = {
  name: string;
  hex: string;
  usage?: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
};

export type BrandFont = {
  name: string;
  family: string;
  style: 'heading' | 'body' | 'accent';
  weight?: number;
  url?: string; // Custom font URL
};

export type BrandKit = {
  id: string;
  name: string;
  description?: string;
  logo?: {
    light: string; // URL for light mode
    dark?: string; // URL for dark mode
  };
  colors: BrandColor[];
  fonts: BrandFont[];
  settings?: {
    borderRadius?: number;
    spacing?: 'compact' | 'normal' | 'relaxed';
    shadowStyle?: 'none' | 'subtle' | 'medium' | 'strong';
  };
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
};

type BrandKitManagerProps = {
  brandKits: BrandKit[];
  activeBrandKit?: BrandKit;
  onSelect?: (brandKit: BrandKit) => void;
  onCreate?: (brandKit: Omit<BrandKit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<BrandKit>) => void;
  onDelete?: (id: string) => void;
};

const defaultColors: BrandColor[] = [
  { name: 'Primary', hex: '#3B82F6', usage: 'primary' },
  { name: 'Secondary', hex: '#6B7280', usage: 'secondary' },
  { name: 'Accent', hex: '#10B981', usage: 'accent' },
  { name: 'Background', hex: '#FFFFFF', usage: 'background' },
  { name: 'Text', hex: '#1F2937', usage: 'text' },
];

const defaultFonts: BrandFont[] = [
  { name: 'Inter', family: 'Inter, sans-serif', style: 'heading', weight: 600 },
  { name: 'Inter', family: 'Inter, sans-serif', style: 'body', weight: 400 },
];

export function BrandKitManager({
  brandKits,
  activeBrandKit,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
}: BrandKitManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  type FormSettings = {
    borderRadius: number;
    spacing: 'compact' | 'normal' | 'relaxed';
    shadowStyle: 'none' | 'subtle' | 'medium' | 'strong';
  };

  // Form state for creating/editing
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    colors: BrandColor[];
    fonts: BrandFont[];
    settings: FormSettings;
  }>({
    name: '',
    description: '',
    colors: [...defaultColors],
    fonts: [...defaultFonts],
    settings: {
      borderRadius: 8,
      spacing: 'normal',
      shadowStyle: 'subtle',
    },
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      colors: [...defaultColors],
      fonts: [...defaultFonts],
      settings: {
        borderRadius: 8,
        spacing: 'normal',
        shadowStyle: 'subtle',
      },
    });
  }, []);

  const handleStartCreate = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(null);
  };

  const handleStartEdit = (kit: BrandKit) => {
    setFormData({
      name: kit.name,
      description: kit.description || '',
      colors: [...kit.colors],
      fonts: [...kit.fonts],
      settings: {
        borderRadius: kit.settings?.borderRadius ?? 8,
        spacing: kit.settings?.spacing ?? 'normal',
        shadowStyle: kit.settings?.shadowStyle ?? 'subtle',
      },
    });
    setIsEditing(kit.id);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (isCreating) {
      onCreate?.(formData);
      setIsCreating(false);
    } else if (isEditing) {
      onUpdate?.(isEditing, formData);
      setIsEditing(null);
    }
    resetForm();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    resetForm();
  };

  const handleColorChange = (index: number, hex: string) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index]!, hex };
    setFormData({ ...formData, colors: newColors });
  };

  const handleAddColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: 'New Color', hex: '#000000' }],
    });
  };

  const handleRemoveColor = (index: number) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this brand kit?')) {
      onDelete?.(id);
    }
  };

  const isFormOpen = isCreating || isEditing;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Brand Kits</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage brand colors, fonts, and styles for consistent mockups
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleStartCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Brand Kit
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {isFormOpen && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
            {isCreating ? 'Create New Brand Kit' : 'Edit Brand Kit'}
          </h3>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Brand"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brand Colors
                </label>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  + Add Color
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                  >
                    <input
                      type="color"
                      value={color.hex}
                      onChange={e => handleColorChange(index, e.target.value)}
                      className="size-10 cursor-pointer rounded border-0"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index] = { ...newColors[index]!, name: e.target.value };
                          setFormData({ ...formData, colors: newColors });
                        }}
                        className="w-full border-0 bg-transparent p-0 text-sm font-medium focus:ring-0 focus:outline-none"
                        placeholder="Color name"
                      />
                      <p className="text-xs text-gray-500">{color.hex.toUpperCase()}</p>
                    </div>
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Typography
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {formData.fonts.map((font, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                        {font.style}
                      </span>
                    </div>
                    <select
                      value={font.family}
                      onChange={(e) => {
                        const newFonts = [...formData.fonts];
                        newFonts[index] = { ...newFonts[index]!, family: e.target.value };
                        setFormData({ ...formData, fonts: newFonts });
                      }}
                      className="w-full rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                    >
                      <option value="Inter, sans-serif">Inter</option>
                      <option value="Roboto, sans-serif">Roboto</option>
                      <option value="Open Sans, sans-serif">Open Sans</option>
                      <option value="Lato, sans-serif">Lato</option>
                      <option value="Poppins, sans-serif">Poppins</option>
                      <option value="Montserrat, sans-serif">Montserrat</option>
                      <option value="Georgia, serif">Georgia</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Settings */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Style Settings
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                    Border Radius
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={formData.settings.borderRadius}
                      onChange={e => setFormData({
                        ...formData,
                        settings: { ...formData.settings, borderRadius: Number(e.target.value) },
                      })}
                      className="flex-1 accent-blue-600"
                    />
                    <span className="w-8 text-xs text-gray-500">
                      {formData.settings.borderRadius}
                      px
                    </span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                    Spacing
                  </label>
                  <select
                    value={formData.settings.spacing}
                    onChange={e => setFormData({
                      ...formData,
                      settings: { ...formData.settings, spacing: e.target.value as 'compact' | 'normal' | 'relaxed' },
                    })}
                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="compact">Compact</option>
                    <option value="normal">Normal</option>
                    <option value="relaxed">Relaxed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                    Shadows
                  </label>
                  <select
                    value={formData.settings.shadowStyle}
                    onChange={e => setFormData({
                      ...formData,
                      settings: { ...formData.settings, shadowStyle: e.target.value as 'none' | 'subtle' | 'medium' | 'strong' },
                    })}
                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value="none">None</option>
                    <option value="subtle">Subtle</option>
                    <option value="medium">Medium</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!formData.name}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ? 'Create Brand Kit' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Kits List */}
      {brandKits.length === 0 && !isFormOpen ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
          <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No brand kits</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a brand kit to maintain consistent styling across mockups
          </p>
          <button
            type="button"
            onClick={handleStartCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create First Brand Kit
          </button>
        </div>
      ) : !isFormOpen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandKits.map(kit => (
            <div
              key={kit.id}
              className={`cursor-pointer rounded-xl border bg-white p-4 transition-all hover:shadow-md dark:bg-gray-800 ${
                activeBrandKit?.id === kit.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => onSelect?.(kit)}
            >
              {/* Color Swatches */}
              <div className="mb-3 flex gap-1">
                {kit.colors.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="size-6 rounded-full shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                {kit.colors.length > 5 && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500 dark:bg-gray-700">
                    +
                    {kit.colors.length - 5}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{kit.name}</h4>
                  {kit.isDefault && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Default
                    </span>
                  )}
                  {activeBrandKit?.id === kit.id && (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  )}
                </div>
                {kit.description && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{kit.description}</p>
                )}
              </div>

              {/* Fonts */}
              <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                Fonts:
                {' '}
                {kit.fonts.map(f => f.name).join(', ')}
              </div>

              {/* Actions */}
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleStartEdit(kit)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(kit.id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-red-900/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Generate sample brand kits
export function generateSampleBrandKits(): BrandKit[] {
  return [
    {
      id: 'bk_1',
      name: 'Modern Tech',
      description: 'Clean, modern look for tech products',
      colors: [
        { name: 'Primary', hex: '#6366F1', usage: 'primary' },
        { name: 'Secondary', hex: '#8B5CF6', usage: 'secondary' },
        { name: 'Accent', hex: '#22D3EE', usage: 'accent' },
        { name: 'Background', hex: '#F8FAFC', usage: 'background' },
        { name: 'Text', hex: '#0F172A', usage: 'text' },
      ],
      fonts: [
        { name: 'Inter', family: 'Inter, sans-serif', style: 'heading', weight: 600 },
        { name: 'Inter', family: 'Inter, sans-serif', style: 'body', weight: 400 },
      ],
      settings: {
        borderRadius: 12,
        spacing: 'normal',
        shadowStyle: 'subtle',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: true,
    },
    {
      id: 'bk_2',
      name: 'Warm & Friendly',
      description: 'Approachable, warm colors for consumer apps',
      colors: [
        { name: 'Primary', hex: '#F97316', usage: 'primary' },
        { name: 'Secondary', hex: '#FB923C', usage: 'secondary' },
        { name: 'Accent', hex: '#FBBF24', usage: 'accent' },
        { name: 'Background', hex: '#FFFBEB', usage: 'background' },
        { name: 'Text', hex: '#78350F', usage: 'text' },
      ],
      fonts: [
        { name: 'Poppins', family: 'Poppins, sans-serif', style: 'heading', weight: 600 },
        { name: 'Open Sans', family: 'Open Sans, sans-serif', style: 'body', weight: 400 },
      ],
      settings: {
        borderRadius: 16,
        spacing: 'relaxed',
        shadowStyle: 'medium',
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}
