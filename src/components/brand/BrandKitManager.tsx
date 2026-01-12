'use client';

import { useState } from 'react';

type BrandColor = {
  id: string;
  name: string;
  hex: string;
};

type BrandFont = {
  id: string;
  name: string;
  family: string;
  weight: string;
  style: 'normal' | 'italic';
};

type BrandLogo = {
  id: string;
  name: string;
  url: string;
  type: 'primary' | 'secondary' | 'icon' | 'wordmark';
  format: 'svg' | 'png' | 'jpg';
};

type BrandKit = {
  id: string;
  name: string;
  description: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
};

const mockBrandKits: BrandKit[] = [
  {
    id: 'brand_1',
    name: 'MockFlow Brand',
    description: 'Official MockFlow brand guidelines',
    colors: [
      { id: 'color_1', name: 'Primary Blue', hex: '#2563eb' },
      { id: 'color_2', name: 'Dark Blue', hex: '#1e40af' },
      { id: 'color_3', name: 'Light Blue', hex: '#60a5fa' },
      { id: 'color_4', name: 'Gray', hex: '#6b7280' },
      { id: 'color_5', name: 'White', hex: '#ffffff' },
    ],
    fonts: [
      { id: 'font_1', name: 'Heading', family: 'Inter', weight: '700', style: 'normal' },
      { id: 'font_2', name: 'Body', family: 'Inter', weight: '400', style: 'normal' },
      { id: 'font_3', name: 'Code', family: 'JetBrains Mono', weight: '400', style: 'normal' },
    ],
    logos: [
      { id: 'logo_1', name: 'Primary Logo', url: '/brand/logo-primary.svg', type: 'primary', format: 'svg' },
      { id: 'logo_2', name: 'Icon Only', url: '/brand/logo-icon.svg', type: 'icon', format: 'svg' },
      { id: 'logo_3', name: 'Wordmark', url: '/brand/logo-wordmark.svg', type: 'wordmark', format: 'svg' },
    ],
    createdAt: 'Jan 1, 2026',
    updatedAt: 'Jan 10, 2026',
    isDefault: true,
  },
  {
    id: 'brand_2',
    name: 'Marketing Campaign',
    description: 'Special brand kit for Q1 marketing campaign',
    colors: [
      { id: 'color_6', name: 'Accent Orange', hex: '#f97316' },
      { id: 'color_7', name: 'Deep Purple', hex: '#7c3aed' },
      { id: 'color_8', name: 'Black', hex: '#000000' },
    ],
    fonts: [
      { id: 'font_4', name: 'Display', family: 'Poppins', weight: '800', style: 'normal' },
      { id: 'font_5', name: 'Body', family: 'Poppins', weight: '400', style: 'normal' },
    ],
    logos: [
      { id: 'logo_4', name: 'Campaign Logo', url: '/brand/campaign-logo.svg', type: 'primary', format: 'svg' },
    ],
    createdAt: 'Jan 5, 2026',
    updatedAt: 'Jan 8, 2026',
    isDefault: false,
  },
];

type ColorPickerProps = {
  color: BrandColor;
  onChange: (color: BrandColor) => void;
  onDelete: () => void;
};

function ColorPicker({ color, onChange, onDelete }: ColorPickerProps) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="relative">
        <input
          type="color"
          value={color.hex}
          onChange={e => onChange({ ...color, hex: e.target.value })}
          className="size-10 cursor-pointer rounded-lg border-0"
        />
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={color.name}
          onChange={e => onChange({ ...color, name: e.target.value })}
          className="mb-1 block w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none dark:text-white"
          placeholder="Color name"
        />
        <span className="text-xs text-gray-500 uppercase dark:text-gray-400">{color.hex}</span>
      </div>
      <button
        onClick={onDelete}
        className="rounded p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

type BrandKitCardProps = {
  kit: BrandKit;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

function BrandKitCard({ kit, isSelected, onSelect, onEdit, onDelete }: BrandKitCardProps) {
  return (
    <div
      className={`group cursor-pointer rounded-xl border p-4 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {/* Color Preview */}
      <div className="mb-4 flex gap-1">
        {kit.colors.slice(0, 5).map(color => (
          <div
            key={color.id}
            className="size-8 rounded-full"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
        {kit.colors.length > 5 && (
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            +
            {kit.colors.length - 5}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{kit.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{kit.description}</p>
        </div>
        {kit.isDefault && (
          <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Default
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="mb-3 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {kit.colors.length}
          {' '}
          colors
        </span>
        <span>
          {kit.fonts.length}
          {' '}
          fonts
        </span>
        <span>
          {kit.logos.length}
          {' '}
          logos
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function BrandKitManager() {
  const [brandKits, setBrandKits] = useState<BrandKit[]>(mockBrandKits);
  const [selectedKit, setSelectedKit] = useState<BrandKit | null>(mockBrandKits[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKit, setEditingKit] = useState<BrandKit | null>(null);

  const handleCreateKit = () => {
    const newKit: BrandKit = {
      id: `brand_${Date.now()}`,
      name: 'New Brand Kit',
      description: 'Add a description for your brand kit',
      colors: [
        { id: `color_${Date.now()}`, name: 'Primary', hex: '#3b82f6' },
      ],
      fonts: [],
      logos: [],
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isDefault: false,
    };
    setEditingKit(newKit);
    setIsEditing(true);
  };

  const handleEditKit = (kit: BrandKit) => {
    setEditingKit({ ...kit });
    setIsEditing(true);
  };

  const handleDeleteKit = (kitId: string) => {
    setBrandKits(prev => prev.filter(k => k.id !== kitId));
    if (selectedKit?.id === kitId) {
      setSelectedKit(brandKits[0] || null);
    }
  };

  const handleSaveKit = () => {
    if (!editingKit) {
      return;
    }

    setBrandKits((prev) => {
      const exists = prev.find(k => k.id === editingKit.id);
      if (exists) {
        return prev.map(k => (k.id === editingKit.id ? editingKit : k));
      }
      return [...prev, editingKit];
    });
    setSelectedKit(editingKit);
    setIsEditing(false);
    setEditingKit(null);
  };

  const handleAddColor = () => {
    if (!editingKit) {
      return;
    }
    const newColor: BrandColor = {
      id: `color_${Date.now()}`,
      name: 'New Color',
      hex: '#6b7280',
    };
    setEditingKit({
      ...editingKit,
      colors: [...editingKit.colors, newColor],
    });
  };

  const handleUpdateColor = (colorId: string, updatedColor: BrandColor) => {
    if (!editingKit) {
      return;
    }
    setEditingKit({
      ...editingKit,
      colors: editingKit.colors.map(c => (c.id === colorId ? updatedColor : c)),
    });
  };

  const handleDeleteColor = (colorId: string) => {
    if (!editingKit) {
      return;
    }
    setEditingKit({
      ...editingKit,
      colors: editingKit.colors.filter(c => c.id !== colorId),
    });
  };

  if (isEditing && editingKit) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div>
            <input
              type="text"
              value={editingKit.name}
              onChange={e => setEditingKit({ ...editingKit, name: e.target.value })}
              className="mb-1 block text-xl font-bold text-gray-900 focus:outline-none dark:bg-transparent dark:text-white"
              placeholder="Brand Kit Name"
            />
            <input
              type="text"
              value={editingKit.description}
              onChange={e => setEditingKit({ ...editingKit, description: e.target.value })}
              className="block w-full text-sm text-gray-500 focus:outline-none dark:bg-transparent dark:text-gray-400"
              placeholder="Add a description"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingKit(null);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveKit}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Save Brand Kit
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Colors Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Brand Colors</h3>
              <button
                onClick={handleAddColor}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Color
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {editingKit.colors.map(color => (
                <ColorPicker
                  key={color.id}
                  color={color}
                  onChange={updatedColor => handleUpdateColor(color.id, updatedColor)}
                  onDelete={() => handleDeleteColor(color.id)}
                />
              ))}
            </div>
          </div>

          {/* Fonts Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Typography</h3>
              <button className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Font
              </button>
            </div>
            {editingKit.fonts.length > 0
              ? (
                  <div className="space-y-3">
                    {editingKit.fonts.map(font => (
                      <div
                        key={font.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{font.name}</span>
                          <p className="text-lg text-gray-900 dark:text-white" style={{ fontFamily: font.family, fontWeight: font.weight }}>
                            {font.family}
                            {' '}
                            (
                            {font.weight}
                            )
                          </p>
                        </div>
                        <button className="rounded p-1 text-gray-400 hover:text-red-500">
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )
              : (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
                    <svg className="mx-auto size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No fonts added yet</p>
                  </div>
                )}
          </div>

          {/* Logos Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Logos</h3>
              <button className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Logo
              </button>
            </div>
            {editingKit.logos.length > 0
              ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {editingKit.logos.map(logo => (
                      <div
                        key={logo.id}
                        className="group rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="mb-3 flex aspect-video items-center justify-center rounded bg-white dark:bg-gray-800">
                          <span className="text-4xl">🖼️</span>
                        </div>
                        <p className="font-medium text-gray-900 dark:text-white">{logo.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {logo.type}
                          {' '}
                          ·
                          {logo.format.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              : (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
                    <svg className="mx-auto size-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No logos uploaded yet</p>
                  </div>
                )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Brand Kits</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your brand colors, fonts, and logos for consistent mockups.
          </p>
        </div>
        <button
          onClick={handleCreateKit}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Brand Kit
        </button>
      </div>

      {/* Brand Kit List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brandKits.map(kit => (
          <BrandKitCard
            key={kit.id}
            kit={kit}
            isSelected={selectedKit?.id === kit.id}
            onSelect={() => setSelectedKit(kit)}
            onEdit={() => handleEditKit(kit)}
            onDelete={() => handleDeleteKit(kit.id)}
          />
        ))}

        {/* Create New Card */}
        <button
          onClick={handleCreateKit}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
        >
          <svg className="mb-2 size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-sm font-medium">Create New Brand Kit</span>
        </button>
      </div>

      {/* Selected Brand Kit Preview */}
      {selectedKit && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedKit.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedKit.description}</p>
            </div>
            <button
              onClick={() => handleEditKit(selectedKit)}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Edit Brand Kit
            </button>
          </div>

          {/* Colors Preview */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Colors</h4>
            <div className="flex flex-wrap gap-3">
              {selectedKit.colors.map(color => (
                <div key={color.id} className="flex items-center gap-2">
                  <div
                    className="size-10 rounded-lg border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{color.name}</p>
                    <p className="text-xs text-gray-500 uppercase dark:text-gray-400">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts Preview */}
          {selectedKit.fonts.length > 0 && (
            <div className="mb-6">
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Typography</h4>
              <div className="flex flex-wrap gap-4">
                {selectedKit.fonts.map(font => (
                  <div key={font.id} className="rounded-lg bg-gray-50 px-4 py-2 dark:bg-gray-900">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{font.name}</span>
                    <p className="text-lg text-gray-900 dark:text-white" style={{ fontFamily: font.family, fontWeight: font.weight }}>
                      {font.family}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logos Preview */}
          {selectedKit.logos.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Logos</h4>
              <div className="flex flex-wrap gap-4">
                {selectedKit.logos.map(logo => (
                  <div
                    key={logo.id}
                    className="flex size-20 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900"
                  >
                    <span className="text-3xl">🖼️</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
