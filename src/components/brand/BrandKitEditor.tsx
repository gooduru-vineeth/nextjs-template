'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit,
  Eye,
  Image,
  Lock,
  Palette,
  Plus,
  Settings,
  Trash2,
  Type,
  Unlock,
  Upload,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type BrandColor = {
  id: string;
  name: string;
  hex: string;
  usage?: string;
  locked?: boolean;
};

export type BrandFont = {
  id: string;
  name: string;
  family: string;
  weight?: number;
  style?: 'normal' | 'italic';
  usage?: 'heading' | 'body' | 'accent' | 'other';
  sampleText?: string;
};

export type BrandLogo = {
  id: string;
  name: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'icon' | 'wordmark' | 'inverse';
  format?: string;
  dimensions?: { width: number; height: number };
};

export type BrandAsset = {
  id: string;
  name: string;
  type: 'image' | 'pattern' | 'illustration' | 'icon';
  url: string;
  tags?: string[];
};

export type BrandKit = {
  id: string;
  name: string;
  description?: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  assets?: BrandAsset[];
  createdAt?: string;
  updatedAt?: string;
};

export type BrandKitEditorProps = {
  brandKit: BrandKit;
  onUpdateColors?: (colors: BrandColor[]) => void;
  onUpdateFonts?: (fonts: BrandFont[]) => void;
  onUpdateLogos?: (logos: BrandLogo[]) => void;
  onUpdateAssets?: (assets: BrandAsset[]) => void;
  onSave?: (brandKit: BrandKit) => void;
  onExport?: (brandKit: BrandKit) => void;
  variant?: 'full' | 'compact' | 'tabs' | 'sidebar' | 'minimal';
  showExport?: boolean;
  editMode?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function BrandKitEditor({
  brandKit,
  onUpdateColors,
  onUpdateFonts: _onUpdateFonts,
  onUpdateLogos: _onUpdateLogos,
  onUpdateAssets: _onUpdateAssets,
  onSave,
  onExport,
  variant = 'full',
  showExport = true,
  editMode = true,
  darkMode = false,
  className = '',
}: BrandKitEditorProps) {
  // Reserved for font, logo, and asset update functionality
  void _onUpdateFonts;
  void _onUpdateLogos;
  void _onUpdateAssets;
  const [activeSection, setActiveSection] = useState<'colors' | 'fonts' | 'logos' | 'assets'>('colors');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['colors', 'fonts', 'logos']));
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [editingFontId, setEditingFontId] = useState<string | null>(null);
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorName, setNewColorName] = useState('');

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  const handleAddColor = useCallback(() => {
    if (newColorHex && newColorName) {
      const newColor: BrandColor = {
        id: `color-${Date.now()}`,
        name: newColorName,
        hex: newColorHex,
      };
      onUpdateColors?.([...brandKit.colors, newColor]);
      setNewColorHex('#000000');
      setNewColorName('');
    }
  }, [newColorHex, newColorName, brandKit.colors, onUpdateColors]);

  const handleDeleteColor = useCallback((colorId: string) => {
    onUpdateColors?.(brandKit.colors.filter(c => c.id !== colorId));
  }, [brandKit.colors, onUpdateColors]);

  const handleToggleColorLock = useCallback((colorId: string) => {
    onUpdateColors?.(brandKit.colors.map(c =>
      c.id === colorId ? { ...c, locked: !c.locked } : c,
    ));
  }, [brandKit.colors, onUpdateColors]);

  const handleCopyColor = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex);
  }, []);

  const renderColorSwatch = (color: BrandColor, compact = false) => {
    const isEditing = editingColorId === color.id;

    return (
      <div
        key={color.id}
        className={`group ${compact ? 'flex items-center gap-2' : `rounded-lg border p-3 ${borderColor}`} ${hoverBg}`}
      >
        {compact
          ? (
              <>
                <div
                  className="h-8 w-8 cursor-pointer rounded-lg"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                <span className={`text-sm ${textColor}`}>{color.name}</span>
              </>
            )
          : (
              <>
                <div className="flex items-start gap-3">
                  <div
                    className="h-16 w-16 cursor-pointer rounded-lg shadow-inner"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleCopyColor(color.hex)}
                    title="Click to copy"
                  />
                  <div className="min-w-0 flex-1">
                    {isEditing
                      ? (
                          <input
                            type="text"
                            defaultValue={color.name}
                            className={`w-full px-2 py-1 ${inputBg} ${textColor} rounded border ${borderColor} text-sm`}
                            onBlur={() => setEditingColorId(null)}
                            autoFocus
                          />
                        )
                      : (
                          <h4 className={`font-medium ${textColor}`}>{color.name}</h4>
                        )}
                    <p className={`text-sm ${mutedColor} mt-0.5 font-mono`}>{color.hex.toUpperCase()}</p>
                    {color.usage && (
                      <p className={`text-xs ${mutedColor} mt-1`}>{color.usage}</p>
                    )}
                  </div>

                  {editMode && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => handleToggleColorLock(color.id)}
                        className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}
                        title={color.locked ? 'Unlock' : 'Lock'}
                      >
                        {color.locked ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                      <button
                        onClick={() => setEditingColorId(color.id)}
                        className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleCopyColor(color.hex)}
                        className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}
                      >
                        <Copy size={14} />
                      </button>
                      {!color.locked && (
                        <button
                          onClick={() => handleDeleteColor(color.id)}
                          className={`p-1.5 text-red-500 ${hoverBg} rounded`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
      </div>
    );
  };

  const renderFontItem = (font: BrandFont, compact = false) => {
    const isEditing = editingFontId === font.id;
    void isEditing; // Reserved for inline editing

    return (
      <div
        key={font.id}
        className={`group ${compact ? 'py-2' : `rounded-lg border p-4 ${borderColor}`} ${hoverBg}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4
              className={`font-medium ${textColor} ${compact ? 'text-sm' : 'text-lg'}`}
              style={{ fontFamily: font.family, fontWeight: font.weight }}
            >
              {font.name}
            </h4>
            <p className={`text-sm ${mutedColor} mt-0.5`}>
              {font.family}
              {' '}
              {font.weight && `• ${font.weight}`}
              {' '}
              {font.style && `• ${font.style}`}
            </p>
            {font.usage && (
              <span className={`mt-1 inline-block px-2 py-0.5 text-xs ${inputBg} ${mutedColor} rounded`}>
                {font.usage}
              </span>
            )}
          </div>

          {editMode && !compact && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setEditingFontId(font.id)}
                className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}
              >
                <Edit size={14} />
              </button>
              <button
                className={`p-1.5 text-red-500 ${hoverBg} rounded`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {!compact && font.sampleText && (
          <p
            className={`mt-3 text-2xl ${textColor}`}
            style={{ fontFamily: font.family, fontWeight: font.weight, fontStyle: font.style }}
          >
            {font.sampleText}
          </p>
        )}
      </div>
    );
  };

  const renderLogoItem = (logo: BrandLogo, compact = false) => (
    <div
      key={logo.id}
      className={`group ${compact ? 'p-2' : `rounded-lg border p-4 ${borderColor}`} ${hoverBg}`}
    >
      <div className={`aspect-video ${inputBg} mb-3 flex items-center justify-center overflow-hidden rounded-lg`}>
        <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className={`font-medium ${textColor} ${compact ? 'text-sm' : ''}`}>{logo.name}</h4>
          {logo.variant && (
            <span className={`text-xs ${mutedColor}`}>{logo.variant}</span>
          )}
        </div>
        {editMode && !compact && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}>
              <Eye size={14} />
            </button>
            <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}>
              <Download size={14} />
            </button>
            <button className={`p-1.5 text-red-500 ${hoverBg} rounded`}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderColorSection = (compact = false) => (
    <div>
      {!compact && editMode && (
        <div className={`mb-4 flex items-center gap-3 p-3 ${inputBg} rounded-lg`}>
          <input
            type="color"
            value={newColorHex}
            onChange={e => setNewColorHex(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded"
          />
          <input
            type="text"
            value={newColorName}
            onChange={e => setNewColorName(e.target.value)}
            placeholder="Color name"
            className={`flex-1 px-3 py-2 ${bgColor} ${textColor} rounded-lg border ${borderColor}`}
          />
          <button
            onClick={handleAddColor}
            disabled={!newColorName || !newColorHex}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      )}
      <div className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-2 gap-4 lg:grid-cols-3'}>
        {brandKit.colors.map(color => renderColorSwatch(color, compact))}
      </div>
    </div>
  );

  const renderFontSection = (compact = false) => (
    <div>
      {!compact && editMode && (
        <button className={`mb-4 flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}>
          <Plus size={16} />
          Add Font
        </button>
      )}
      <div className={compact ? 'space-y-2' : 'space-y-4'}>
        {brandKit.fonts.map(font => renderFontItem(font, compact))}
      </div>
    </div>
  );

  const renderLogoSection = (compact = false) => (
    <div>
      {!compact && editMode && (
        <button className={`mb-4 flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}>
          <Upload size={16} />
          Upload Logo
        </button>
      )}
      <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-4 lg:grid-cols-3'}`}>
        {brandKit.logos.map(logo => renderLogoItem(logo, compact))}
      </div>
    </div>
  );

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} p-3 ${className}`}>
        <div className="mb-3 flex items-center gap-2">
          <Palette size={16} className={mutedColor} />
          <span className={`text-sm font-medium ${textColor}`}>{brandKit.name}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {brandKit.colors.slice(0, 6).map(color => (
            <div
              key={color.id}
              className="h-6 w-6 cursor-pointer rounded"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>{brandKit.name}</h3>
          {showExport && (
            <button
              onClick={() => onExport?.(brandKit)}
              className={`p-2 ${mutedColor} ${hoverBg} rounded-lg`}
            >
              <Download size={16} />
            </button>
          )}
        </div>

        {/* Colors */}
        <div className="mb-4">
          <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Colors</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {brandKit.colors.slice(0, 5).map(color => (
              <div
                key={color.id}
                className="h-8 w-8 cursor-pointer rounded-lg"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div>
          <span className={`text-xs font-medium ${mutedColor} tracking-wider uppercase`}>Fonts</span>
          <div className="mt-2 space-y-1">
            {brandKit.fonts.slice(0, 2).map(font => (
              <p
                key={font.id}
                className={`text-sm ${textColor}`}
                style={{ fontFamily: font.family }}
              >
                {font.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tabs variant
  if (variant === 'tabs') {
    return (
      <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
        {/* Header */}
        <div className={`border-b p-6 ${borderColor}`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${textColor}`}>{brandKit.name}</h2>
              {brandKit.description && (
                <p className={`${mutedColor} mt-1`}>{brandKit.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {showExport && (
                <button
                  onClick={() => onExport?.(brandKit)}
                  className={`flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
                >
                  <Download size={16} />
                  Export
                </button>
              )}
              {editMode && (
                <button
                  onClick={() => onSave?.(brandKit)}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  <Check size={16} />
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${borderColor} -mb-px`}>
            {(['colors', 'fonts', 'logos', 'assets'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeSection === tab
                    ? 'border-blue-500 text-blue-500'
                    : `border-transparent ${mutedColor}`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'colors' && renderColorSection()}
          {activeSection === 'fonts' && renderFontSection()}
          {activeSection === 'logos' && renderLogoSection()}
          {activeSection === 'assets' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image size={48} className={mutedColor} />
              <p className={`mt-4 ${mutedColor}`}>No brand assets yet</p>
              {editMode && (
                <button className="mt-2 text-sm text-blue-500 hover:underline">
                  Upload assets
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-72 flex-col border-r ${borderColor} ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${textColor}`}>Brand Kit</h3>
            <button className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}>
              <Settings size={16} />
            </button>
          </div>
          <p className={`text-sm ${mutedColor} mt-1`}>{brandKit.name}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Colors section */}
          <div>
            <button
              onClick={() => toggleSection('colors')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} rounded-lg px-2 py-1`}
            >
              {expandedSections.has('colors') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Palette size={14} />
              <span className="text-sm font-medium">Colors</span>
              <span className="ml-auto text-xs">{brandKit.colors.length}</span>
            </button>
            {expandedSections.has('colors') && (
              <div className="mt-2 ml-4">
                {renderColorSection(true)}
              </div>
            )}
          </div>

          {/* Fonts section */}
          <div>
            <button
              onClick={() => toggleSection('fonts')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} rounded-lg px-2 py-1`}
            >
              {expandedSections.has('fonts') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Type size={14} />
              <span className="text-sm font-medium">Fonts</span>
              <span className="ml-auto text-xs">{brandKit.fonts.length}</span>
            </button>
            {expandedSections.has('fonts') && (
              <div className="mt-2 ml-4">
                {renderFontSection(true)}
              </div>
            )}
          </div>

          {/* Logos section */}
          <div>
            <button
              onClick={() => toggleSection('logos')}
              className={`flex w-full items-center gap-2 ${mutedColor} ${hoverBg} rounded-lg px-2 py-1`}
            >
              {expandedSections.has('logos') ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Image size={14} />
              <span className="text-sm font-medium">Logos</span>
              <span className="ml-auto text-xs">{brandKit.logos.length}</span>
            </button>
            {expandedSections.has('logos') && (
              <div className="mt-2 ml-4">
                {renderLogoSection(true)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} ${className}`}>
      {/* Header */}
      <div className={`border-b p-6 ${borderColor}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>{brandKit.name}</h2>
            {brandKit.description && (
              <p className={`${mutedColor} mt-1`}>{brandKit.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showExport && (
              <button
                onClick={() => onExport?.(brandKit)}
                className={`flex items-center gap-2 px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                <Download size={16} />
                Export
              </button>
            )}
            {editMode && (
              <button
                onClick={() => onSave?.(brandKit)}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <Check size={16} />
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 p-6">
        {/* Colors */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Palette size={20} className={mutedColor} />
            <h3 className={`text-lg font-semibold ${textColor}`}>Colors</h3>
            <span className={`text-sm ${mutedColor}`}>
              (
              {brandKit.colors.length}
              )
            </span>
          </div>
          {renderColorSection()}
        </section>

        {/* Fonts */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Type size={20} className={mutedColor} />
            <h3 className={`text-lg font-semibold ${textColor}`}>Typography</h3>
            <span className={`text-sm ${mutedColor}`}>
              (
              {brandKit.fonts.length}
              )
            </span>
          </div>
          {renderFontSection()}
        </section>

        {/* Logos */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Image size={20} className={mutedColor} />
            <h3 className={`text-lg font-semibold ${textColor}`}>Logos</h3>
            <span className={`text-sm ${mutedColor}`}>
              (
              {brandKit.logos.length}
              )
            </span>
          </div>
          {renderLogoSection()}
        </section>

        {/* Brand Assets */}
        {brandKit.assets && brandKit.assets.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-3">
              <Image size={20} className={mutedColor} />
              <h3 className={`text-lg font-semibold ${textColor}`}>Brand Assets</h3>
              <span className={`text-sm ${mutedColor}`}>
                (
                {brandKit.assets.length}
                )
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {brandKit.assets.map(asset => (
                <div key={asset.id} className={`rounded-lg border p-3 ${borderColor} ${hoverBg}`}>
                  <div className={`aspect-square ${inputBg} mb-2 flex items-center justify-center overflow-hidden rounded-lg`}>
                    <img src={asset.url} alt={asset.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className={`text-sm ${textColor} truncate`}>{asset.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
