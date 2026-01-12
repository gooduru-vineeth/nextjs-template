'use client';

import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle,
  Copy,
  Download,
  Eye,
  EyeOff,
  Info,
  Key,
  Lock,
  RefreshCw,
  Settings,
  Shield,
  UserCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
export type SSOProvider = 'saml' | 'oidc' | 'google' | 'microsoft' | 'okta' | 'auth0' | 'custom';

export type SSOProviderConfig = {
  id: string;
  name: string;
  provider: SSOProvider;
  enabled: boolean;
  config: SAMLConfig | OIDCConfig | OAuthConfig;
  createdAt: Date;
  updatedAt: Date;
  testStatus?: 'success' | 'failed' | 'pending';
  lastTestedAt?: Date;
};

export type SAMLConfig = {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  signatureAlgorithm: 'sha256' | 'sha384' | 'sha512';
  nameIdFormat: 'email' | 'persistent' | 'transient';
  attributeMapping: {
    email: string;
    firstName?: string;
    lastName?: string;
    groups?: string;
  };
};

export type OIDCConfig = {
  issuer: string;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  jwksUri?: string;
};

export type OAuthConfig = {
  clientId: string;
  clientSecret: string;
  tenantId?: string;
  domain?: string;
};

export type SSOSession = {
  id: string;
  userId: string;
  userEmail: string;
  providerId: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
};

export type SSOPolicy = {
  enforceForAllUsers: boolean;
  allowPasswordLogin: boolean;
  allowedEmailDomains: string[];
  autoProvisionUsers: boolean;
  defaultRole: string;
  sessionTimeout: number;
  requireMfa: boolean;
};

type SSOConfigurationProps = {
  providers: SSOProviderConfig[];
  policy: SSOPolicy;
  sessions?: SSOSession[];
  serviceProviderMetadata?: {
    entityId: string;
    acsUrl: string;
    metadataUrl: string;
  };
  onAddProvider?: (provider: Omit<SSOProviderConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProvider?: (id: string, updates: Partial<SSOProviderConfig>) => void;
  onDeleteProvider?: (id: string) => void;
  onTestProvider?: (id: string) => Promise<boolean>;
  onUpdatePolicy?: (policy: SSOPolicy) => void;
  onRevokeSession?: (sessionId: string) => void;
  onDownloadMetadata?: () => void;
  isEnterprise?: boolean;
  onUpgrade?: () => void;
  variant?: 'full' | 'compact';
  className?: string;
};

// Provider icons and info
const PROVIDER_INFO: Record<SSOProvider, { name: string; icon: string; color: string }> = {
  saml: { name: 'SAML 2.0', icon: '🔐', color: 'bg-blue-100 text-blue-700' },
  oidc: { name: 'OpenID Connect', icon: '🔑', color: 'bg-green-100 text-green-700' },
  google: { name: 'Google Workspace', icon: '🌐', color: 'bg-red-100 text-red-700' },
  microsoft: { name: 'Microsoft Entra ID', icon: '🪟', color: 'bg-blue-100 text-blue-700' },
  okta: { name: 'Okta', icon: '⭕', color: 'bg-indigo-100 text-indigo-700' },
  auth0: { name: 'Auth0', icon: '🔴', color: 'bg-orange-100 text-orange-700' },
  custom: { name: 'Custom Provider', icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
};

// SAML Configuration Form (available for future use)
export function SAMLConfigForm({
  config,
  onChange,
}: {
  config: SAMLConfig;
  onChange: (config: SAMLConfig) => void;
}) {
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Entity ID (Issuer)
        </label>
        <input
          type="text"
          value={config.entityId}
          onChange={e => onChange({ ...config, entityId: e.target.value })}
          placeholder="https://idp.example.com/entity"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          SSO URL (Login URL)
        </label>
        <input
          type="text"
          value={config.ssoUrl}
          onChange={e => onChange({ ...config, ssoUrl: e.target.value })}
          placeholder="https://idp.example.com/sso/saml"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          X.509 Certificate
        </label>
        <div className="relative">
          <textarea
            value={config.certificate}
            onChange={e => onChange({ ...config, certificate: e.target.value })}
            placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
            rows={4}
            className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${
              !showCertificate ? 'blur-sm' : ''
            }`}
          />
          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="absolute top-2 right-2 rounded bg-gray-100 p-1 dark:bg-gray-600"
          >
            {showCertificate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Signature Algorithm
          </label>
          <select
            value={config.signatureAlgorithm}
            onChange={e => onChange({ ...config, signatureAlgorithm: e.target.value as SAMLConfig['signatureAlgorithm'] })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="sha256">SHA-256</option>
            <option value="sha384">SHA-384</option>
            <option value="sha512">SHA-512</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            NameID Format
          </label>
          <select
            value={config.nameIdFormat}
            onChange={e => onChange({ ...config, nameIdFormat: e.target.value as SAMLConfig['nameIdFormat'] })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="email">Email Address</option>
            <option value="persistent">Persistent</option>
            <option value="transient">Transient</option>
          </select>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Attribute Mapping</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Email Attribute</label>
            <input
              type="text"
              value={config.attributeMapping.email}
              onChange={e => onChange({
                ...config,
                attributeMapping: { ...config.attributeMapping, email: e.target.value },
              })}
              placeholder="email"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Groups Attribute</label>
            <input
              type="text"
              value={config.attributeMapping.groups || ''}
              onChange={e => onChange({
                ...config,
                attributeMapping: { ...config.attributeMapping, groups: e.target.value },
              })}
              placeholder="groups"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// OIDC Configuration Form (available for future use)
export function OIDCConfigForm({
  config,
  onChange,
}: {
  config: OIDCConfig;
  onChange: (config: OIDCConfig) => void;
}) {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Issuer URL
        </label>
        <input
          type="text"
          value={config.issuer}
          onChange={e => onChange({ ...config, issuer: e.target.value })}
          placeholder="https://idp.example.com"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client ID
          </label>
          <input
            type="text"
            value={config.clientId}
            onChange={e => onChange({ ...config, clientId: e.target.value })}
            placeholder="your-client-id"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client Secret
          </label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={config.clientSecret}
              onChange={e => onChange({ ...config, clientSecret: e.target.value })}
              placeholder="your-client-secret"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
            >
              {showSecret ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Scopes
        </label>
        <input
          type="text"
          value={config.scopes.join(' ')}
          onChange={e => onChange({ ...config, scopes: e.target.value.split(' ') })}
          placeholder="openid profile email"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        />
        <p className="mt-1 text-xs text-gray-500">Space-separated list of scopes</p>
      </div>
    </div>
  );
}

// Provider Card Component
function ProviderCard({
  provider,
  onEdit,
  onDelete,
  onTest,
  onToggle,
}: {
  provider: SSOProviderConfig;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
  onToggle: () => void;
}) {
  const info = PROVIDER_INFO[provider.provider];

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${
      !provider.enabled ? 'opacity-60' : ''
    }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{info.icon}</span>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{provider.name}</h4>
              <span className={`rounded px-2 py-0.5 text-xs ${info.color}`}>
                {info.name}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {provider.testStatus && (
              <span className={`flex items-center gap-1 text-xs ${
                provider.testStatus === 'success'
                  ? 'text-green-600'
                  : provider.testStatus === 'failed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
              }`}
              >
                {provider.testStatus === 'success'
                  ? <CheckCircle className="h-3 w-3" />
                  : provider.testStatus === 'failed'
                    ? <XCircle className="h-3 w-3" />
                    : <RefreshCw className="h-3 w-3 animate-spin" />}
                {provider.testStatus}
              </span>
            )}
            <button
              onClick={onToggle}
              className={`relative h-6 w-10 rounded-full transition-colors ${
                provider.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  provider.enabled ? 'left-5' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Settings className="h-4 w-4" />
            Configure
          </button>
          <button
            onClick={onTest}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <RefreshCw className="h-4 w-4" />
            Test
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <X className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>

      <div className="dark:bg-gray-750 border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500 dark:border-gray-700">
        Last updated
        {' '}
        {provider.updatedAt.toLocaleDateString()}
      </div>
    </div>
  );
}

// Session Row Component
function SessionRow({
  session,
  onRevoke,
}: {
  session: SSOSession;
  onRevoke: () => void;
}) {
  const isExpired = new Date() > session.expiresAt;

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${isExpired ? 'bg-gray-100' : 'bg-green-100'}`}>
          <UserCheck className={`h-4 w-4 ${isExpired ? 'text-gray-500' : 'text-green-600'}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{session.userEmail}</p>
          <p className="text-xs text-gray-500">
            {session.ipAddress}
            {' '}
            •
            {' '}
            {session.userAgent.slice(0, 30)}
            ...
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right text-xs text-gray-500">
          <p>
            Created
            {session.createdAt.toLocaleString()}
          </p>
          <p className={isExpired ? 'text-red-500' : ''}>
            {isExpired ? 'Expired' : `Expires ${session.expiresAt.toLocaleString()}`}
          </p>
        </div>
        <button
          onClick={onRevoke}
          className="rounded px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Revoke
        </button>
      </div>
    </div>
  );
}

// Main SSO Configuration Component
export function SSOConfiguration({
  providers,
  policy,
  sessions = [],
  serviceProviderMetadata,
  onAddProvider: _onAddProvider,
  onUpdateProvider,
  onDeleteProvider,
  onTestProvider,
  onUpdatePolicy,
  onRevokeSession,
  onDownloadMetadata,
  isEnterprise = true,
  onUpgrade,
  variant = 'full',
  className = '',
}: SSOConfigurationProps) {
  const [activeTab, setActiveTab] = useState<'providers' | 'policy' | 'sessions'>('providers');
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [, setEditingProvider] = useState<SSOProviderConfig | null>(null);
  const [newProviderType, setNewProviderType] = useState<SSOProvider>('saml');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = useCallback((value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  if (!isEnterprise) {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          Enterprise Single Sign-On
        </h3>
        <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
          Enable SSO with SAML 2.0, OpenID Connect, or integrate with Okta, Auth0, Google Workspace, and Microsoft Entra ID.
        </p>
        <button
          onClick={onUpgrade}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
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
            <Shield className="h-5 w-5" />
            SSO Configuration
          </h3>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {providers.filter(p => p.enabled).length}
              {' '}
              active providers
            </span>
            <button
              onClick={() => setShowAddProvider(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Add Provider
            </button>
          </div>
          <div className="space-y-2">
            {providers.slice(0, 3).map((provider) => {
              const info = PROVIDER_INFO[provider.provider];
              return (
                <div key={provider.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{provider.name}</span>
                  </div>
                  <span className={`h-2 w-2 rounded-full ${provider.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              );
            })}
          </div>
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
              <Shield className="h-6 w-6" />
              Single Sign-On
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure enterprise authentication providers
            </p>
          </div>
          <button
            onClick={() => setShowAddProvider(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Key className="h-4 w-4" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6 dark:border-gray-700">
        <div className="flex gap-6">
          {[
            { id: 'providers', label: 'Identity Providers', icon: Building2 },
            { id: 'policy', label: 'Security Policy', icon: Lock },
            { id: 'sessions', label: 'Active Sessions', icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'providers' && (
          <div className="space-y-6">
            {/* Service Provider Metadata */}
            {serviceProviderMetadata && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h3 className="mb-3 flex items-center gap-2 font-medium text-blue-800 dark:text-blue-200">
                  <Info className="h-4 w-4" />
                  Service Provider Details
                </h3>
                <p className="mb-4 text-sm text-blue-700 dark:text-blue-300">
                  Use these details when configuring your identity provider
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'Entity ID', value: serviceProviderMetadata.entityId },
                    { label: 'ACS URL', value: serviceProviderMetadata.acsUrl },
                    { label: 'Metadata URL', value: serviceProviderMetadata.metadataUrl },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-white p-2 dark:bg-gray-800">
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{item.value}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(item.value, item.label)}
                        className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {copiedField === item.label
                          ? (
                              <Check className="h-4 w-4 text-green-600" />
                            )
                          : (
                              <Copy className="h-4 w-4 text-gray-400" />
                            )}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onDownloadMetadata}
                  className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  <Download className="h-4 w-4" />
                  Download SAML Metadata
                </button>
              </div>
            )}

            {/* Providers List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {providers.length > 0
                ? (
                    providers.map(provider => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        onEdit={() => setEditingProvider(provider)}
                        onDelete={() => onDeleteProvider?.(provider.id)}
                        onTest={() => onTestProvider?.(provider.id)}
                        onToggle={() => onUpdateProvider?.(provider.id, { enabled: !provider.enabled })}
                      />
                    ))
                  )
                : (
                    <div className="col-span-2 py-12 text-center">
                      <Key className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-500">No identity providers configured</p>
                      <button
                        onClick={() => setShowAddProvider(true)}
                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                      >
                        Add Your First Provider
                      </button>
                    </div>
                  )}
            </div>
          </div>
        )}

        {activeTab === 'policy' && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Security Policy</p>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                  Changes to these settings affect how users can authenticate. Test thoroughly before enabling enforcement.
                </p>
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Authentication Rules</h3>

              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Enforce SSO for All Users</p>
                  <p className="text-sm text-gray-500">Require SSO authentication for all users</p>
                </div>
                <input
                  type="checkbox"
                  checked={policy.enforceForAllUsers}
                  onChange={e => onUpdatePolicy?.({ ...policy, enforceForAllUsers: e.target.checked })}
                  className="h-5 w-5 rounded"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Allow Password Login</p>
                  <p className="text-sm text-gray-500">Users can also log in with email and password</p>
                </div>
                <input
                  type="checkbox"
                  checked={policy.allowPasswordLogin}
                  onChange={e => onUpdatePolicy?.({ ...policy, allowPasswordLogin: e.target.checked })}
                  className="h-5 w-5 rounded"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Auto-Provision Users</p>
                  <p className="text-sm text-gray-500">Automatically create accounts for new SSO users</p>
                </div>
                <input
                  type="checkbox"
                  checked={policy.autoProvisionUsers}
                  onChange={e => onUpdatePolicy?.({ ...policy, autoProvisionUsers: e.target.checked })}
                  className="h-5 w-5 rounded"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Require MFA</p>
                  <p className="text-sm text-gray-500">Require multi-factor authentication after SSO</p>
                </div>
                <input
                  type="checkbox"
                  checked={policy.requireMfa}
                  onChange={e => onUpdatePolicy?.({ ...policy, requireMfa: e.target.checked })}
                  className="h-5 w-5 rounded"
                />
              </label>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Domain Restrictions</h3>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Allowed Email Domains
                </label>
                <input
                  type="text"
                  value={policy.allowedEmailDomains.join(', ')}
                  onChange={e => onUpdatePolicy?.({
                    ...policy,
                    allowedEmailDomains: e.target.value.split(',').map(d => d.trim()).filter(Boolean),
                  })}
                  placeholder="company.com, subsidiary.com"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">Comma-separated list of allowed domains. Leave empty to allow all.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Session Settings</h3>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session Timeout (hours)
                </label>
                <input
                  type="number"
                  value={policy.sessionTimeout}
                  onChange={e => onUpdatePolicy?.({ ...policy, sessionTimeout: Number.parseInt(e.target.value) || 24 })}
                  min={1}
                  max={720}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Default Role for New Users
                </label>
                <select
                  value={policy.defaultRole}
                  onChange={e => onUpdatePolicy?.({ ...policy, defaultRole: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="member">Member</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Active Sessions (
                {sessions.length}
                )
              </h3>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => sessions.forEach(s => onRevokeSession?.(s.id))}
              >
                Revoke All Sessions
              </button>
            </div>

            {sessions.length > 0
              ? (
                  <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                    {sessions.map(session => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        onRevoke={() => onRevokeSession?.(session.id)}
                      />
                    ))}
                  </div>
                )
              : (
                  <div className="py-12 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500">No active SSO sessions</p>
                  </div>
                )}
          </div>
        )}
      </div>

      {/* Add Provider Modal */}
      {showAddProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-800">
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add Identity Provider</h3>
              <p className="mt-1 text-sm text-gray-500">Configure a new SSO provider</p>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Provider Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setNewProviderType(key as SSOProvider)}
                      className={`rounded-lg border-2 p-3 text-center transition-colors ${
                        newProviderType === key
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span className="mb-1 block text-2xl">{info.icon}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{info.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
              <button
                onClick={() => setShowAddProvider(false)}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Would create provider with selected type
                  setShowAddProvider(false);
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SSOConfiguration;
