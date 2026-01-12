'use client';

import {
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Download,
  Edit2,
  Eye,
  FileJson,
  Filter,
  Layers,
  Link2,
  Palette,
  Plus,
  Search,
  Settings,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';
import { useCallback, useState } from 'react';

export type DesignToken = {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'border' | 'opacity' | 'radius' | 'animation';
  category?: string;
  description?: string;
  aliases?: string[];
  referenceId?: string;
  meta?: Record<string, unknown>;
};

export type TokenGroup = {
  id: string;
  name: string;
  tokens: DesignToken[];
  subgroups?: TokenGroup[];
};

export type DesignTokenManagerProps = {
  tokens: DesignToken[];
  groups?: TokenGroup[];
  selectedTokenId?: string;
  onTokenSelect?: (tokenId: string | null) => void;
  onTokenAdd?: (token: Partial<DesignToken>) => void;
  onTokenUpdate?: (tokenId: string, updates: Partial<DesignToken>) => void;
  onTokenDelete?: (tokenId: string) => void;
  onTokenCopy?: (token: DesignToken) => void;
  onExport?: (format: 'css' | 'scss' | 'json' | 'js' | 'figma') => void;
  onImport?: (data: string, format: string) => void;
  variant?: 'full' | 'compact' | 'sidebar' | 'modal' | 'minimal';
  showPreview?: boolean;
  showCode?: boolean;
  darkMode?: boolean;
  className?: string;
};

export default function DesignTokenManager({
  tokens,
  groups,
  selectedTokenId,
  onTokenSelect,
  onTokenAdd,
  onTokenUpdate,
  onTokenDelete,
  onTokenCopy,
  onExport,
  onImport: _onImport,
  variant = 'full',
  showPreview = true,
  showCode = true,
  darkMode = false,
  className = '',
}: DesignTokenManagerProps) {
  // Reserved for import functionality
  void _onImport;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [codeFormat, setCodeFormat] = useState<'css' | 'scss' | 'json' | 'js'>('css');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newToken, setNewToken] = useState<Partial<DesignToken>>({
    name: '',
    value: '',
    type: 'color',
  });

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const tokenTypes = [
    { type: 'color', icon: Palette, label: 'Colors' },
    { type: 'spacing', icon: Box, label: 'Spacing' },
    { type: 'typography', icon: Type, label: 'Typography' },
    { type: 'shadow', icon: Layers, label: 'Shadows' },
    { type: 'border', icon: Box, label: 'Borders' },
    { type: 'radius', icon: Box, label: 'Radius' },
    { type: 'opacity', icon: Eye, label: 'Opacity' },
    { type: 'animation', icon: Settings, label: 'Animation' },
  ];

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch = !searchQuery
      || token.name.toLowerCase().includes(searchQuery.toLowerCase())
      || token.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || token.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getTokensByType = (type: string) => filteredTokens.filter(t => t.type === type);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const handleCopyToken = useCallback((token: DesignToken) => {
    navigator.clipboard.writeText(token.value);
    setCopiedId(token.id);
    onTokenCopy?.(token);
    setTimeout(() => setCopiedId(null), 2000);
  }, [onTokenCopy]);

  const generateCode = useCallback((format: string): string => {
    switch (format) {
      case 'css':
        return filteredTokens.map(t => `  --${t.name}: ${t.value};`).join('\n');
      case 'scss':
        return filteredTokens.map(t => `$${t.name}: ${t.value};`).join('\n');
      case 'json':
        return JSON.stringify(
          filteredTokens.reduce((acc, t) => ({ ...acc, [t.name]: t.value }), {}),
          null,
          2,
        );
      case 'js':
        return `export const tokens = {\n${filteredTokens.map(t => `  ${t.name.replace(/-/g, '_')}: '${t.value}'`).join(',\n')}\n};`;
      default:
        return '';
    }
  }, [filteredTokens]);

  const renderTokenPreview = (token: DesignToken) => {
    switch (token.type) {
      case 'color':
        return (
          <div
            className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: token.value }}
          />
        );
      case 'spacing':
        return (
          <div className={`flex h-10 w-10 items-center justify-center ${inputBg} rounded-lg`}>
            <div className="rounded bg-blue-500" style={{ width: token.value, height: '4px' }} />
          </div>
        );
      case 'typography':
        return (
          <div className={`h-10 w-10 ${inputBg} flex items-center justify-center rounded-lg`}>
            <Type size={16} className={mutedColor} />
          </div>
        );
      case 'shadow':
        return (
          <div className={`h-10 w-10 ${bgColor} rounded-lg`} style={{ boxShadow: token.value }} />
        );
      case 'border':
        return (
          <div
            className={`h-10 w-10 ${inputBg} rounded-lg`}
            style={{ border: token.value }}
          />
        );
      case 'radius':
        return (
          <div
            className="h-10 w-10 bg-blue-500"
            style={{ borderRadius: token.value }}
          />
        );
      case 'opacity':
        return (
          <div className={`h-10 w-10 ${inputBg} flex items-center justify-center rounded-lg`}>
            <div className="h-6 w-6 rounded bg-blue-500" style={{ opacity: Number.parseFloat(token.value) }} />
          </div>
        );
      default:
        return (
          <div className={`h-10 w-10 ${inputBg} flex items-center justify-center rounded-lg`}>
            <Settings size={16} className={mutedColor} />
          </div>
        );
    }
  };

  const renderToken = (token: DesignToken, compact = false) => {
    const isSelected = selectedTokenId === token.id;
    const isCopied = copiedId === token.id;

    if (compact) {
      return (
        <div
          key={token.id}
          onClick={() => onTokenSelect?.(token.id)}
          className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 ${
            isSelected ? 'bg-blue-500 text-white' : `${hoverBg} ${textColor}`
          }`}
        >
          {renderTokenPreview(token)}
          <span className="truncate text-sm">{token.name}</span>
        </div>
      );
    }

    return (
      <div
        key={token.id}
        onClick={() => onTokenSelect?.(token.id)}
        className={`cursor-pointer rounded-lg border p-3 ${
          isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `${borderColor} ${hoverBg}`
        }`}
      >
        <div className="flex items-start gap-3">
          {showPreview && renderTokenPreview(token)}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : textColor}`}>
                {token.name}
              </span>
              {token.referenceId && (
                <Link2 size={12} className={mutedColor} />
              )}
            </div>
            <div className={`text-sm ${mutedColor} truncate font-mono`}>
              {token.value}
            </div>
            {token.description && (
              <p className={`text-xs ${mutedColor} mt-1 truncate`}>
                {token.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation(); handleCopyToken(token);
              }}
              className={`rounded p-1.5 ${hoverBg}`}
            >
              {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className={mutedColor} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onTokenUpdate?.(token.id, {});
              }}
              className={`rounded p-1.5 ${hoverBg}`}
            >
              <Edit2 size={14} className={mutedColor} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onTokenDelete?.(token.id);
              }}
              className={`rounded p-1.5 ${hoverBg}`}
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} flex items-center gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Palette size={16} className={mutedColor} />
          <span className={`text-sm ${textColor}`}>
            {tokens.length}
            {' '}
            tokens
          </span>
        </div>
        <div className="flex gap-1">
          {tokenTypes.slice(0, 4).map(({ type, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setActiveFilter(activeFilter === type ? null : type)}
              className={`rounded p-1.5 ${activeFilter === type ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Design Tokens</h3>
          <span className={`text-sm ${mutedColor}`}>
            {filteredTokens.length}
            {' '}
            tokens
          </span>
        </div>

        <div className={`flex items-center gap-2 ${inputBg} mb-4 rounded-lg px-3 py-2`}>
          <Search size={16} className={mutedColor} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className={`flex-1 bg-transparent ${textColor} text-sm outline-none`}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {tokenTypes.map(({ type, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setActiveFilter(activeFilter === type ? null : type)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
                activeFilter === type ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`
              }`}
            >
              <Icon size={12} />
              {getTokensByType(type).length}
            </button>
          ))}
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {filteredTokens.slice(0, 10).map(token => renderToken(token, true))}
          {filteredTokens.length > 10 && (
            <button className={`w-full py-2 text-center text-sm ${mutedColor}`}>
              +
              {filteredTokens.length - 10}
              {' '}
              more
            </button>
          )}
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
            <h3 className={`font-semibold ${textColor}`}>Design Tokens</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className={`p-1.5 ${mutedColor} ${hoverBg} rounded`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className={`border-b p-4 ${borderColor}`}>
          <div className={`flex items-center gap-2 ${inputBg} rounded-lg px-3 py-2`}>
            <Search size={16} className={mutedColor} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`flex-1 bg-transparent ${textColor} text-sm outline-none`}
            />
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {tokenTypes.map(({ type, icon: Icon, label }) => {
            const typeTokens = getTokensByType(type);
            if (typeTokens.length === 0) {
              return null;
            }

            const isExpanded = expandedGroups.has(type);

            return (
              <div key={type}>
                <button
                  onClick={() => toggleGroup(type)}
                  className={`flex w-full items-center justify-between py-2 ${textColor}`}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <Icon size={14} className={mutedColor} />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className={`text-xs ${mutedColor}`}>{typeTokens.length}</span>
                </button>

                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {typeTokens.map(token => (
                      <button
                        key={token.id}
                        onClick={() => onTokenSelect?.(token.id)}
                        className={`flex w-full items-center gap-2 rounded px-2 py-1.5 ${
                          selectedTokenId === token.id ? 'bg-blue-500 text-white' : `${hoverBg} ${textColor}`
                        }`}
                      >
                        <div className="h-4 w-4 flex-shrink-0">
                          {token.type === 'color' && (
                            <div className="h-4 w-4 rounded border border-gray-300" style={{ backgroundColor: token.value }} />
                          )}
                        </div>
                        <span className="truncate text-sm">{token.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={`border-t p-4 ${borderColor}`}>
          <button
            onClick={() => onExport?.('css')}
            className={`flex w-full items-center justify-center gap-2 px-3 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
          >
            <Download size={14} />
            Export Tokens
          </button>
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`${bgColor} flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl shadow-2xl ${className}`}>
        <div className={`border-b p-4 ${borderColor} flex items-center justify-between`}>
          <h2 className={`text-lg font-semibold ${textColor}`}>Design Token Manager</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white"
            >
              <Plus size={14} />
              Add Token
            </button>
          </div>
        </div>

        <div className={`border-b p-4 ${borderColor} flex items-center gap-4`}>
          <div className={`flex flex-1 items-center gap-2 ${inputBg} rounded-lg px-3 py-2`}>
            <Search size={16} className={mutedColor} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tokens..."
              className={`flex-1 bg-transparent ${textColor} text-sm outline-none`}
            />
          </div>

          <div className="flex gap-1">
            {tokenTypes.map(({ type, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                className={`rounded p-2 ${activeFilter === type ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
                title={type}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-3' : 'gap-2'}`}>
            {filteredTokens.map(token => renderToken(token))}
          </div>

          {filteredTokens.length === 0 && (
            <div className="py-12 text-center">
              <Palette size={48} className={`mx-auto mb-4 ${mutedColor}`} />
              <p className={mutedColor}>No tokens found</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full flex-col ${className}`}>
      {/* Header */}
      <div className={`border-b p-4 ${borderColor}`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${textColor}`}>Design Tokens</h2>
            <p className={`text-sm ${mutedColor}`}>
              {filteredTokens.length}
              {' '}
              tokens
              {activeFilter ? `in ${activeFilter}` : 'total'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
            >
              <Plus size={16} />
              Add Token
            </button>
            <div className={`flex items-center gap-1 ${inputBg} rounded-lg p-1`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded p-1.5 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : mutedColor}`}
              >
                <Layers size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded p-1.5 ${viewMode === 'list' ? 'bg-blue-500 text-white' : mutedColor}`}
              >
                <Filter size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex flex-1 items-center gap-2 ${inputBg} rounded-lg px-3 py-2`}>
            <Search size={16} className={mutedColor} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tokens..."
              className={`flex-1 bg-transparent ${textColor} outline-none`}
            />
          </div>

          <div className="flex gap-1">
            {tokenTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                  activeFilter === type
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${mutedColor} ${hoverBg}`
                }`}
                title={label}
              >
                <Icon size={16} />
                <span className="hidden text-sm lg:inline">{label}</span>
                <span className={`text-xs ${activeFilter === type ? 'text-blue-100' : mutedColor}`}>
                  {getTokensByType(type).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Token grid/list */}
        <div className="flex-1 overflow-y-auto p-4">
          {groups && groups.length > 0
            ? (
                <div className="space-y-4">
                  {groups.map((group) => {
                    const isExpanded = expandedGroups.has(group.id);
                    return (
                      <div key={group.id} className={`border ${borderColor} rounded-lg`}>
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className={`flex w-full items-center justify-between p-3 ${hoverBg}`}
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <span className={`font-medium ${textColor}`}>{group.name}</span>
                          </div>
                          <span className={`text-sm ${mutedColor}`}>
                            {group.tokens.length}
                            {' '}
                            tokens
                          </span>
                        </button>
                        {isExpanded && (
                          <div className={`border-t p-3 ${borderColor} grid ${viewMode === 'grid' ? 'grid-cols-2 gap-3' : 'gap-2'}`}>
                            {group.tokens.map(token => renderToken(token))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            : (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 gap-3 xl:grid-cols-3' : 'gap-2'}`}>
                  {filteredTokens.map(token => renderToken(token))}
                </div>
              )}

          {filteredTokens.length === 0 && (
            <div className="py-12 text-center">
              <Palette size={48} className={`mx-auto mb-4 ${mutedColor}`} />
              <p className={`${textColor} mb-2 font-medium`}>No tokens found</p>
              <p className={mutedColor}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Code panel */}
        {showCode && (
          <div className={`w-80 border-l ${borderColor} flex flex-col`}>
            <div className={`border-b p-3 ${borderColor} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Code size={16} className={mutedColor} />
                <span className={`font-medium ${textColor}`}>Code</span>
              </div>
              <div className="flex items-center gap-1">
                {(['css', 'scss', 'json', 'js'] as const).map(format => (
                  <button
                    key={format}
                    onClick={() => setCodeFormat(format)}
                    className={`rounded px-2 py-1 text-xs ${
                      codeFormat === format ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3">
              <pre className={`text-xs ${textColor} font-mono whitespace-pre-wrap`}>
                {generateCode(codeFormat)}
              </pre>
            </div>

            <div className={`border-t p-3 ${borderColor} flex gap-2`}>
              <button
                onClick={() => navigator.clipboard.writeText(generateCode(codeFormat))}
                className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                <Copy size={14} />
                Copy
              </button>
              <button
                onClick={() => onExport?.(codeFormat as 'css' | 'scss' | 'json' | 'js' | 'figma')}
                className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                <Download size={14} />
                Export
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`border-t p-3 ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button className={`flex items-center gap-2 text-sm ${mutedColor} ${hoverBg} rounded-lg px-3 py-1.5`}>
            <Upload size={14} />
            Import
          </button>
          <button
            onClick={() => onExport?.('json')}
            className={`flex items-center gap-2 text-sm ${mutedColor} ${hoverBg} rounded-lg px-3 py-1.5`}
          >
            <FileJson size={14} />
            Export JSON
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${mutedColor}`}>
            {tokens.filter(t => t.type === 'color').length}
            {' '}
            colors,
            {' '}
            {tokens.filter(t => t.type === 'spacing').length}
            {' '}
            spacing,
            {' '}
            {tokens.filter(t => t.type === 'typography').length}
            {' '}
            typography
          </span>
        </div>
      </div>

      {/* Add token modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`${bgColor} w-96 rounded-xl p-6 shadow-2xl`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Add Design Token</h3>

            <div className="space-y-4">
              <div>
                <label className={`text-sm ${mutedColor} mb-1 block`}>Name</label>
                <input
                  type="text"
                  value={newToken.name || ''}
                  onChange={e => setNewToken({ ...newToken, name: e.target.value })}
                  placeholder="e.g., color-primary-500"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                />
              </div>

              <div>
                <label className={`text-sm ${mutedColor} mb-1 block`}>Type</label>
                <select
                  value={newToken.type || 'color'}
                  onChange={e => setNewToken({ ...newToken, type: e.target.value as DesignToken['type'] })}
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                >
                  {tokenTypes.map(({ type, label }) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`text-sm ${mutedColor} mb-1 block`}>Value</label>
                <div className="flex gap-2">
                  {newToken.type === 'color' && (
                    <input
                      type="color"
                      value={newToken.value || '#000000'}
                      onChange={e => setNewToken({ ...newToken, value: e.target.value })}
                      className="h-10 w-10 cursor-pointer rounded"
                    />
                  )}
                  <input
                    type="text"
                    value={newToken.value || ''}
                    onChange={e => setNewToken({ ...newToken, value: e.target.value })}
                    placeholder={newToken.type === 'color' ? '#3b82f6' : '16px'}
                    className={`flex-1 px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-sm ${mutedColor} mb-1 block`}>Description (optional)</label>
                <input
                  type="text"
                  value={newToken.description || ''}
                  onChange={e => setNewToken({ ...newToken, description: e.target.value })}
                  placeholder="What is this token used for?"
                  className={`w-full px-3 py-2 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false); setNewToken({ name: '', value: '', type: 'color' });
                }}
                className={`px-4 py-2 ${inputBg} ${mutedColor} rounded-lg ${hoverBg}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newToken.name && newToken.value) {
                    onTokenAdd?.(newToken);
                    setNewToken({ name: '', value: '', type: 'color' });
                    setShowAddModal(false);
                  }
                }}
                disabled={!newToken.name || !newToken.value}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Add Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
