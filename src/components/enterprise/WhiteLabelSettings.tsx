'use client';

import {
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Info,
  Mail,
  Monitor,
  Palette,
  Save,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
export type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export type BrandLogo = {
  light: string;
  dark: string;
  favicon: string;
  appIcon: string;
};

export type BrandTypography = {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
};

export type CustomDomain = {
  domain: string;
  status: 'pending' | 'active' | 'error';
  sslStatus: 'pending' | 'active' | 'error';
  verifiedAt?: Date;
  dnsRecords?: { type: string; name: string; value: string }[];
};

export type EmailSettings = {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  customSmtp?: {
    host: string;
    port: number;
    username: string;
    secure: boolean;
  };
};

export type WatermarkSettings = {
  enabled: boolean;
  text?: string;
  logoUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
};

export type WhiteLabelConfig = {
  companyName: string;
  productName: string;
  tagline?: string;
  colors: BrandColors;
  logos: BrandLogo;
  typography: BrandTypography;
  customDomain?: CustomDomain;
  emailSettings: EmailSettings;
  watermark: WatermarkSettings;
  hideOriginalBranding: boolean;
  customCss?: string;
  customJs?: string;
  metaTags?: { property: string; content: string }[];
};

type WhiteLabelSettingsProps = {
  config: WhiteLabelConfig;
  onSave?: (config: WhiteLabelConfig) => void;
  onPreview?: (config: WhiteLabelConfig) => void;
  onVerifyDomain?: (domain: string) => void;
  onTestEmail?: () => void;
  isEnterprise?: boolean;
  onUpgrade?: () => void;
  variant?: 'full' | 'compact';
  className?: string;
};

// Default colors (exported for reference)
export const DEFAULT_COLORS: BrandColors = {
  primary: '#2563eb',
  secondary: '#4f46e5',
  accent: '#06b6d4',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Google Fonts options
const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat',
  'Source Sans Pro',
  'Nunito',
  'Raleway',
  'Work Sans',
  'DM Sans',
  'Plus Jakarta Sans',
];

// Color Picker Component
function ColorPicker({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="h-10 w-10 rounded-lg border-2 border-gray-200 shadow-sm dark:border-gray-600"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="#000000"
        />
        {showPicker && (
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute h-0 w-0 opacity-0"
            ref={el => el?.click()}
          />
        )}
      </div>
    </div>
  );
}

// Logo Upload Component
function LogoUpload({
  label,
  value,
  onChange,
  description,
  aspectRatio = 'auto',
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  aspectRatio?: 'auto' | 'square' | '16:9' | '4:3';
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In real implementation, would handle file upload
    const file = e.dataTransfer.files[0];
    if (file) {
      // Mock URL for demo
      onChange(URL.createObjectURL(file));
    }
  }, [onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <div
        className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={(e) => {
          e.preventDefault(); setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value
          ? (
              <div className="relative inline-block">
                <img
                  src={value}
                  alt={label}
                  className={`max-h-20 ${
                    aspectRatio === 'square' ? 'aspect-square object-cover' : 'object-contain'
                  }`}
                />
                <button
                  onClick={() => onChange('')}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          : (
              <div className="py-4">
                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drop image here or
                  {' '}
                  <span className="cursor-pointer text-blue-600">browse</span>
                </p>
                <p className="mt-1 text-xs text-gray-400">PNG, SVG up to 2MB</p>
              </div>
            )}
      </div>
    </div>
  );
}

// Domain Configuration Component
function DomainConfig({
  domain,
  onVerify,
  onRemove,
}: {
  domain?: CustomDomain;
  onVerify: (domain: string) => void;
  onRemove: () => void;
}) {
  const [newDomain, setNewDomain] = useState(domain?.domain || '');
  const [showDnsRecords, setShowDnsRecords] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'error':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Globe className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={newDomain}
            onChange={e => setNewDomain(e.target.value)}
            placeholder="app.yourcompany.com"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <button
          onClick={() => onVerify(newDomain)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Verify
        </button>
      </div>

      {domain && (
        <div className="space-y-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{domain.domain}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusBadge(domain.status)}`}>
                {domain.status}
              </span>
              <button
                onClick={onRemove}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">SSL:</span>
              <span className={`font-medium ${
                domain.sslStatus === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`}
              >
                {domain.sslStatus}
              </span>
            </div>
            {domain.verifiedAt && (
              <span className="text-gray-400">
                Verified
                {' '}
                {domain.verifiedAt.toLocaleDateString()}
              </span>
            )}
          </div>

          {domain.dnsRecords && domain.dnsRecords.length > 0 && (
            <div>
              <button
                onClick={() => setShowDnsRecords(!showDnsRecords)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showDnsRecords ? 'Hide' : 'Show'}
                {' '}
                DNS Records
              </button>
              {showDnsRecords && (
                <div className="mt-2 space-y-2">
                  {domain.dnsRecords.map((record, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded bg-white p-2 font-mono text-sm dark:bg-gray-700"
                    >
                      <span className="text-gray-500">{record.type}</span>
                      <span className="text-gray-700 dark:text-gray-300">{record.name}</span>
                      <span className="flex-1 truncate text-gray-600 dark:text-gray-400">
                        {record.value}
                      </span>
                      <button className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Preview Frame Component
function PreviewFrame({
  config,
  device = 'desktop',
}: {
  config: WhiteLabelConfig;
  device?: 'desktop' | 'mobile';
}) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
      device === 'mobile' ? 'w-[375px]' : 'w-full'
    }`}
    >
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-600 dark:bg-gray-700">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="mx-4 flex-1">
          <div className="rounded bg-white px-3 py-1 text-center text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400">
            {config.customDomain?.domain || 'app.mockflow.com'}
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div
        className="p-6"
        style={{
          backgroundColor: config.colors.background,
          color: config.colors.text,
        }}
      >
        {/* Header */}
        <div
          className="mb-4 flex items-center justify-between rounded-lg p-4"
          style={{ backgroundColor: config.colors.surface }}
        >
          {config.logos.light
            ? (
                <img src={config.logos.light} alt="Logo" className="h-8" />
              )
            : (
                <div
                  className="text-xl font-bold"
                  style={{ color: config.colors.primary }}
                >
                  {config.productName || 'Your Product'}
                </div>
              )}
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: config.colors.primary }}
          >
            Get Started
          </button>
        </div>

        {/* Sample Content */}
        <div className="space-y-4">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: config.typography.headingFont }}
          >
            Welcome to
            {' '}
            {config.productName}
          </h2>
          <p
            style={{
              color: config.colors.textSecondary,
              fontFamily: config.typography.bodyFont,
            }}
          >
            {config.tagline || 'Create beautiful mockups in minutes'}
          </p>
          <div className="flex gap-3">
            <button
              className="rounded-lg px-4 py-2 text-sm text-white"
              style={{ backgroundColor: config.colors.primary }}
            >
              Primary Action
            </button>
            <button
              className="rounded-lg px-4 py-2 text-sm"
              style={{
                backgroundColor: config.colors.surface,
                color: config.colors.text,
                border: `1px solid ${config.colors.border}`,
              }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main White Label Settings Component
export function WhiteLabelSettings({
  config,
  onSave,
  onPreview: _onPreview,
  onVerifyDomain,
  onTestEmail,
  isEnterprise = true,
  onUpgrade,
  variant = 'full',
  className = '',
}: WhiteLabelSettingsProps) {
  const [localConfig, setLocalConfig] = useState<WhiteLabelConfig>(config);
  const [activeTab, setActiveTab] = useState<'branding' | 'domain' | 'email' | 'advanced'>('branding');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const updateConfig = useCallback(<K extends keyof WhiteLabelConfig>(
    key: K,
    value: WhiteLabelConfig[K],
  ) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const updateColors = useCallback((colorKey: keyof BrandColors, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      colors: { ...prev.colors, [colorKey]: value },
    }));
    setIsDirty(true);
  }, []);

  const updateLogos = useCallback((logoKey: keyof BrandLogo, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      logos: { ...prev.logos, [logoKey]: value },
    }));
    setIsDirty(true);
  }, []);

  const updateTypography = useCallback((fontKey: keyof BrandTypography, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      typography: { ...prev.typography, [fontKey]: value },
    }));
    setIsDirty(true);
  }, []);

  const handleSave = () => {
    onSave?.(localConfig);
    setIsDirty(false);
  };

  if (!isEnterprise) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          White Label Your Platform
        </h3>
        <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
          Remove MockFlow branding, use your own domain, customize colors, and create a seamless experience for your users.
        </p>
        <button
          onClick={onUpgrade}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          Upgrade to Enterprise
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h3 className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
            <Palette className="h-5 w-5" />
            White Label
          </h3>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Name
            </label>
            <input
              type="text"
              value={localConfig.productName}
              onChange={e => updateConfig('productName', e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localConfig.colors.primary}
                onChange={e => updateColors('primary', e.target.value)}
                className="h-10 w-10 cursor-pointer rounded"
              />
              <input
                type="text"
                value={localConfig.colors.primary}
                onChange={e => updateColors('primary', e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-white dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Palette className="h-6 w-6" />
              White Label Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Customize the platform to match your brand identity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide' : 'Show'}
              {' '}
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Tabs */}
        <div className="w-56 space-y-1 border-r border-gray-200 p-4 dark:border-gray-700">
          {[
            { id: 'branding', label: 'Branding', icon: Palette },
            { id: 'domain', label: 'Custom Domain', icon: Globe },
            { id: 'email', label: 'Email Settings', icon: Mail },
            { id: 'advanced', label: 'Advanced', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            {activeTab === 'branding' && (
              <div className="space-y-8">
                {/* Basic Info */}
                <section>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={localConfig.companyName}
                        onChange={e => updateConfig('companyName', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={localConfig.productName}
                        onChange={e => updateConfig('productName', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={localConfig.tagline || ''}
                        onChange={e => updateConfig('tagline', e.target.value)}
                        placeholder="Your catchy tagline here"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </section>

                {/* Logos */}
                <section>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Logos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <LogoUpload
                      label="Logo (Light Mode)"
                      value={localConfig.logos.light}
                      onChange={url => updateLogos('light', url)}
                      description="Used on light backgrounds"
                    />
                    <LogoUpload
                      label="Logo (Dark Mode)"
                      value={localConfig.logos.dark}
                      onChange={url => updateLogos('dark', url)}
                      description="Used on dark backgrounds"
                    />
                    <LogoUpload
                      label="Favicon"
                      value={localConfig.logos.favicon}
                      onChange={url => updateLogos('favicon', url)}
                      description="32x32 PNG or ICO"
                      aspectRatio="square"
                    />
                    <LogoUpload
                      label="App Icon"
                      value={localConfig.logos.appIcon}
                      onChange={url => updateLogos('appIcon', url)}
                      description="512x512 PNG for PWA"
                      aspectRatio="square"
                    />
                  </div>
                </section>

                {/* Colors */}
                <section>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Brand Colors
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <ColorPicker
                      label="Primary"
                      value={localConfig.colors.primary}
                      onChange={color => updateColors('primary', color)}
                      description="Main brand color"
                    />
                    <ColorPicker
                      label="Secondary"
                      value={localConfig.colors.secondary}
                      onChange={color => updateColors('secondary', color)}
                      description="Accent elements"
                    />
                    <ColorPicker
                      label="Background"
                      value={localConfig.colors.background}
                      onChange={color => updateColors('background', color)}
                      description="Page background"
                    />
                    <ColorPicker
                      label="Surface"
                      value={localConfig.colors.surface}
                      onChange={color => updateColors('surface', color)}
                      description="Cards & panels"
                    />
                    <ColorPicker
                      label="Text"
                      value={localConfig.colors.text}
                      onChange={color => updateColors('text', color)}
                      description="Primary text"
                    />
                    <ColorPicker
                      label="Border"
                      value={localConfig.colors.border}
                      onChange={color => updateColors('border', color)}
                      description="Borders & dividers"
                    />
                  </div>
                </section>

                {/* Typography */}
                <section>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Typography
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Heading Font
                      </label>
                      <select
                        value={localConfig.typography.headingFont}
                        onChange={e => updateTypography('headingFont', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Body Font
                      </label>
                      <select
                        value={localConfig.typography.bodyFont}
                        onChange={e => updateTypography('bodyFont', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Monospace Font
                      </label>
                      <select
                        value={localConfig.typography.monoFont}
                        onChange={e => updateTypography('monoFont', e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      >
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Fira Code">Fira Code</option>
                        <option value="Source Code Pro">Source Code Pro</option>
                        <option value="IBM Plex Mono">IBM Plex Mono</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Hide Branding Toggle */}
                <section className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <label className="flex cursor-pointer items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Hide MockFlow Branding
                      </p>
                      <p className="text-sm text-gray-500">
                        Remove all MockFlow references from the platform
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localConfig.hideOriginalBranding}
                      onChange={e => updateConfig('hideOriginalBranding', e.target.checked)}
                      className="h-5 w-5 rounded"
                    />
                  </label>
                </section>
              </div>
            )}

            {activeTab === 'domain' && (
              <div className="space-y-6">
                <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Custom Domain Setup</p>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      Configure your custom domain to provide a seamless branded experience for your users.
                    </p>
                  </div>
                </div>

                <DomainConfig
                  domain={localConfig.customDomain}
                  onVerify={domain => onVerifyDomain?.(domain)}
                  onRemove={() => updateConfig('customDomain', undefined)}
                />
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <section>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Email Sender Settings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={localConfig.emailSettings.fromName}
                        onChange={e => updateConfig('emailSettings', {
                          ...localConfig.emailSettings,
                          fromName: e.target.value,
                        })}
                        placeholder="Your Company"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={localConfig.emailSettings.fromEmail}
                        onChange={e => updateConfig('emailSettings', {
                          ...localConfig.emailSettings,
                          fromEmail: e.target.value,
                        })}
                        placeholder="noreply@yourcompany.com"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        value={localConfig.emailSettings.replyToEmail}
                        onChange={e => updateConfig('emailSettings', {
                          ...localConfig.emailSettings,
                          replyToEmail: e.target.value,
                        })}
                        placeholder="support@yourcompany.com"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </section>

                <button
                  onClick={onTestEmail}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Mail className="h-4 w-4" />
                  Send Test Email
                </button>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <section>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Custom CSS
                  </h3>
                  <p className="mb-2 text-sm text-gray-500">
                    Add custom CSS to further customize the appearance
                  </p>
                  <textarea
                    value={localConfig.customCss || ''}
                    onChange={e => updateConfig('customCss', e.target.value)}
                    placeholder="/* Add your custom CSS here */"
                    rows={8}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  />
                </section>

                <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Advanced Settings</p>
                    <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      Custom code can affect platform functionality. Test thoroughly before publishing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-[450px] border-l border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Live Preview</h3>
              <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`rounded p-1.5 ${previewDevice === 'desktop' ? 'bg-white shadow-sm dark:bg-gray-600' : ''}`}
                >
                  <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`rounded p-1.5 ${previewDevice === 'mobile' ? 'bg-white shadow-sm dark:bg-gray-600' : ''}`}
                >
                  <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <PreviewFrame config={localConfig} device={previewDevice} />
          </div>
        )}
      </div>
    </div>
  );
}

export default WhiteLabelSettings;
