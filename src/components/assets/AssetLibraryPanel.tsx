'use client';

import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Film,
  Filter,
  Folder,
  FolderPlus,
  Grid,
  Image,
  Link,
  List,
  MoreHorizontal,
  Music,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export type AssetType = 'image' | 'video' | 'audio' | 'document' | 'font' | 'icon' | 'other';
export type AssetCategory = 'all' | 'images' | 'videos' | 'documents' | 'icons' | 'fonts' | 'uploads';

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  size: number;
  url: string;
  thumbnailUrl?: string;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  uploadedBy?: string;
  tags?: string[];
  isFavorite?: boolean;
  folderId?: string;
};

export type AssetFolder = {
  id: string;
  name: string;
  parentId?: string;
  assetCount: number;
};

export type AssetLibraryPanelProps = {
  assets: Asset[];
  folders?: AssetFolder[];
  onSelectAsset?: (asset: Asset) => void;
  onUploadAsset?: (files: FileList) => void;
  onDeleteAsset?: (assetId: string) => void;
  onRenameAsset?: (assetId: string, newName: string) => void;
  onToggleFavorite?: (assetId: string) => void;
  onCreateFolder?: (name: string, parentId?: string) => void;
  onMoveAsset?: (assetId: string, folderId: string) => void;
  onDownloadAsset?: (asset: Asset) => void;
  onCopyLink?: (asset: Asset) => void;
  variant?: 'full' | 'compact' | 'sidebar' | 'modal' | 'minimal';
  showUpload?: boolean;
  showFolders?: boolean;
  allowMultiSelect?: boolean;
  acceptedTypes?: AssetType[];
  darkMode?: boolean;
  className?: string;
};

export default function AssetLibraryPanel({
  assets,
  folders = [],
  onSelectAsset,
  onUploadAsset,
  onDeleteAsset,
  onRenameAsset,
  onToggleFavorite,
  onCreateFolder,
  onMoveAsset,
  onDownloadAsset,
  onCopyLink,
  variant = 'full',
  showUpload = true,
  showFolders = true,
  allowMultiSelect = false,
  darkMode = false,
  className = '',
}: AssetLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [renamingAssetId, setRenamingAssetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Suppress unused variable warnings for reserved functionality
  void onMoveAsset;

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const inputBg = darkMode ? 'bg-gray-800' : 'bg-gray-100';

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'image':
        return <Image size={16} />;
      case 'video':
        return <Film size={16} />;
      case 'audio':
        return <Music size={16} />;
      case 'document':
        return <FileText size={16} />;
      case 'font':
        return <FileText size={16} />;
      case 'icon':
        return <Image size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = searchQuery === ''
        || asset.name.toLowerCase().includes(searchQuery.toLowerCase())
        || asset.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all'
        || (selectedCategory === 'images' && asset.type === 'image')
        || (selectedCategory === 'videos' && asset.type === 'video')
        || (selectedCategory === 'documents' && asset.type === 'document')
        || (selectedCategory === 'icons' && asset.type === 'icon')
        || (selectedCategory === 'fonts' && asset.type === 'font');

      const matchesFolder = currentFolderId === null || asset.folderId === currentFolderId;

      return matchesSearch && matchesCategory && matchesFolder;
    });
  }, [assets, searchQuery, selectedCategory, currentFolderId]);

  const handleAssetClick = useCallback((asset: Asset, event: React.MouseEvent) => {
    if (allowMultiSelect && (event.ctrlKey || event.metaKey)) {
      setSelectedAssets((prev) => {
        const next = new Set(prev);
        if (next.has(asset.id)) {
          next.delete(asset.id);
        } else {
          next.add(asset.id);
        }
        return next;
      });
    } else {
      setSelectedAssets(new Set([asset.id]));
      onSelectAsset?.(asset);
    }
  }, [allowMultiSelect, onSelectAsset]);

  const handleRenameStart = useCallback((asset: Asset) => {
    setRenamingAssetId(asset.id);
    setRenameValue(asset.name);
  }, []);

  const handleRenameSubmit = useCallback(() => {
    if (renamingAssetId && renameValue.trim()) {
      onRenameAsset?.(renamingAssetId, renameValue.trim());
    }
    setRenamingAssetId(null);
    setRenameValue('');
  }, [renamingAssetId, renameValue, onRenameAsset]);

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUploadAsset?.(files);
    }
  }, [onUploadAsset]);

  const renderUploadArea = () => (
    <div
      className={`border-2 border-dashed ${borderColor} rounded-lg p-6 text-center ${hoverBg} cursor-pointer`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById('asset-upload')?.click()}
    >
      <Upload size={24} className={`mx-auto ${mutedColor} mb-2`} />
      <p className={`text-sm ${textColor}`}>Drop files here or click to upload</p>
      <p className={`text-xs ${mutedColor} mt-1`}>PNG, JPG, SVG, PDF up to 10MB</p>
      <input
        id="asset-upload"
        type="file"
        multiple
        className="hidden"
        onChange={e => e.target.files && onUploadAsset?.(e.target.files)}
      />
    </div>
  );

  const renderFolderTree = () => (
    <div className="space-y-1">
      <button
        onClick={() => setCurrentFolderId(null)}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          currentFolderId === null ? 'bg-blue-500 text-white' : `${mutedColor} ${hoverBg}`
        }`}
      >
        <Folder size={16} />
        <span>All Assets</span>
      </button>

      {folders.filter(f => !f.parentId).map(folder => (
        <div key={folder.id}>
          <button
            onClick={() => setCurrentFolderId(folder.id)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              currentFolderId === folder.id ? 'bg-blue-500 text-white' : `${mutedColor} ${hoverBg}`
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation(); toggleFolder(folder.id);
              }}
              className="p-0.5"
            >
              {expandedFolders.has(folder.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <Folder size={16} />
            <span className="flex-1 truncate text-left">{folder.name}</span>
            <span className={`text-xs ${currentFolderId === folder.id ? 'text-blue-100' : ''}`}>
              {folder.assetCount}
            </span>
          </button>

          {expandedFolders.has(folder.id) && (
            <div className="mt-1 ml-4 space-y-1">
              {folders.filter(f => f.parentId === folder.id).map(subFolder => (
                <button
                  key={subFolder.id}
                  onClick={() => setCurrentFolderId(subFolder.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${
                    currentFolderId === subFolder.id ? 'bg-blue-500 text-white' : `${mutedColor} ${hoverBg}`
                  }`}
                >
                  <Folder size={14} />
                  <span className="flex-1 truncate text-left">{subFolder.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => onCreateFolder?.('New Folder', currentFolderId || undefined)}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${mutedColor} ${hoverBg}`}
      >
        <FolderPlus size={16} />
        <span>New Folder</span>
      </button>
    </div>
  );

  const renderAssetCard = (asset: Asset) => {
    const isSelected = selectedAssets.has(asset.id);
    const isRenaming = renamingAssetId === asset.id;

    return (
      <div
        key={asset.id}
        onClick={e => handleAssetClick(asset, e)}
        className={`group relative overflow-hidden rounded-lg border ${
          isSelected ? 'border-blue-500 ring-2 ring-blue-200' : borderColor
        } ${hoverBg} cursor-pointer transition-all`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          {asset.thumbnailUrl || asset.type === 'image'
            ? (
                <img
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.name}
                  className="h-full w-full object-cover"
                />
              )
            : (
                <div className="flex h-full w-full items-center justify-center">
                  {getAssetIcon(asset.type)}
                </div>
              )}

          {/* Selection checkbox */}
          {allowMultiSelect && (
            <div className={`absolute top-2 left-2 h-5 w-5 rounded border ${
              isSelected
                ? 'border-blue-500 bg-blue-500 text-white'
                : `${bgColor} ${borderColor}`
            } flex items-center justify-center`}
            >
              {isSelected && <Check size={12} />}
            </div>
          )}

          {/* Favorite */}
          <button
            onClick={(e) => {
              e.stopPropagation(); onToggleFavorite?.(asset.id);
            }}
            className={`absolute top-2 right-2 rounded-full p-1.5 ${
              asset.isFavorite ? 'bg-amber-500 text-white' : 'bg-white/80 text-gray-600'
            } opacity-0 transition-opacity group-hover:opacity-100`}
          >
            <Star size={12} fill={asset.isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation(); onSelectAsset?.(asset);
              }}
              className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); onDownloadAsset?.(asset);
              }}
              className="rounded-lg bg-white p-2 text-gray-900 hover:bg-gray-100"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-2">
          {isRenaming
            ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRenameSubmit()}
                    className={`flex-1 px-2 py-1 text-sm ${inputBg} ${textColor} rounded border ${borderColor}`}
                    autoFocus
                  />
                  <button onClick={handleRenameSubmit} className="p-1 text-green-500">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setRenamingAssetId(null)} className="p-1 text-red-500">
                    <X size={14} />
                  </button>
                </div>
              )
            : (
                <>
                  <h4 className={`text-sm font-medium ${textColor} truncate`}>{asset.name}</h4>
                  <div className="mt-1 flex items-center justify-between">
                    <span className={`text-xs ${mutedColor}`}>{formatFileSize(asset.size)}</span>
                    {asset.dimensions && (
                      <span className={`text-xs ${mutedColor}`}>
                        {asset.dimensions.width}
                        ×
                        {asset.dimensions.height}
                      </span>
                    )}
                  </div>
                </>
              )}
        </div>

        {/* Context menu button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); handleRenameStart(asset);
          }}
          className={`absolute right-2 bottom-2 p-1 ${mutedColor} ${hoverBg} rounded opacity-0 transition-opacity group-hover:opacity-100`}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    );
  };

  const renderAssetListItem = (asset: Asset) => {
    const isSelected = selectedAssets.has(asset.id);

    return (
      <div
        key={asset.id}
        onClick={e => handleAssetClick(asset, e)}
        className={`flex items-center gap-4 rounded-lg border p-3 ${
          isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `${borderColor} ${hoverBg}`
        } cursor-pointer transition-colors`}
      >
        {/* Checkbox */}
        {allowMultiSelect && (
          <div className={`h-5 w-5 rounded border ${
            isSelected ? 'border-blue-500 bg-blue-500 text-white' : `${bgColor} ${borderColor}`
          } flex flex-shrink-0 items-center justify-center`}
          >
            {isSelected && <Check size={12} />}
          </div>
        )}

        {/* Thumbnail */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
          {asset.thumbnailUrl || asset.type === 'image'
            ? (
                <img src={asset.thumbnailUrl || asset.url} alt={asset.name} className="h-full w-full object-cover" />
              )
            : (
                getAssetIcon(asset.type)
              )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className={`font-medium ${textColor} truncate`}>{asset.name}</h4>
          <div className="mt-0.5 flex items-center gap-3">
            <span className={`text-xs ${mutedColor}`}>{asset.type}</span>
            <span className={`text-xs ${mutedColor}`}>{formatFileSize(asset.size)}</span>
            {asset.dimensions && (
              <span className={`text-xs ${mutedColor}`}>
                {asset.dimensions.width}
                ×
                {asset.dimensions.height}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation(); onToggleFavorite?.(asset.id);
            }}
            className={`rounded-lg p-2 ${asset.isFavorite ? 'text-amber-500' : mutedColor} ${hoverBg}`}
          >
            <Star size={16} fill={asset.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onCopyLink?.(asset);
            }}
            className={`p-2 ${mutedColor} ${hoverBg} rounded-lg`}
          >
            <Link size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onDownloadAsset?.(asset);
            }}
            className={`p-2 ${mutedColor} ${hoverBg} rounded-lg`}
          >
            <Download size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); handleRenameStart(asset);
            }}
            className={`p-2 ${mutedColor} ${hoverBg} rounded-lg`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); onDeleteAsset?.(asset.id);
            }}
            className={`p-2 text-red-500 ${hoverBg} rounded-lg`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} p-3 ${className}`}>
        <div className="mb-3 flex items-center gap-2">
          <Search size={14} className={mutedColor} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className={`flex-1 ${inputBg} ${textColor} rounded border px-2 py-1 text-sm ${borderColor}`}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {filteredAssets.slice(0, 6).map(asset => (
            <button
              key={asset.id}
              onClick={() => onSelectAsset?.(asset)}
              className={`aspect-square rounded-lg ${inputBg} ${hoverBg} overflow-hidden`}
            >
              {asset.thumbnailUrl || asset.type === 'image'
                ? (
                    <img src={asset.thumbnailUrl || asset.url} alt={asset.name} className="h-full w-full object-cover" />
                  )
                : (
                    <div className="flex h-full w-full items-center justify-center">
                      {getAssetIcon(asset.type)}
                    </div>
                  )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`${bgColor} rounded-lg border p-4 ${borderColor} ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-semibold ${textColor}`}>Assets</h3>
          <span className={`text-xs ${mutedColor}`}>
            {assets.length}
            {' '}
            files
          </span>
        </div>
        {showUpload && renderUploadArea()}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {filteredAssets.slice(0, 6).map(renderAssetCard)}
        </div>
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`${bgColor} flex h-full w-64 flex-col border-r ${borderColor} ${className}`}>
        <div className={`border-b p-4 ${borderColor}`}>
          <h3 className={`font-semibold ${textColor} mb-3`}>Asset Library</h3>
          <div className="relative">
            <Search size={14} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`w-full py-2 pr-3 pl-9 ${inputBg} ${textColor} rounded-lg border text-sm ${borderColor}`}
            />
          </div>
        </div>

        {showFolders && (
          <div className={`border-b p-3 ${borderColor}`}>
            {renderFolderTree()}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {filteredAssets.map(renderAssetCard)}
          </div>
        </div>

        {showUpload && (
          <div className={`border-t p-3 ${borderColor}`}>
            <button
              onClick={() => document.getElementById('asset-upload-sidebar')?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              <Upload size={16} />
              Upload
            </button>
            <input
              id="asset-upload-sidebar"
              type="file"
              multiple
              className="hidden"
              onChange={e => e.target.files && onUploadAsset?.(e.target.files)}
            />
          </div>
        )}
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className={`${bgColor} flex max-h-[80vh] w-full max-w-4xl flex-col rounded-xl shadow-2xl ${className}`}>
        {/* Header */}
        <div className={`border-b p-6 ${borderColor}`}>
          <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Asset Library</h2>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search size={16} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className={`w-full py-2 pr-4 pl-10 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {(['all', 'images', 'videos', 'documents', 'icons'] as AssetCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${mutedColor}`
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showUpload && <div className="mb-6">{renderUploadArea()}</div>}

          {viewMode === 'grid'
            ? (
                <div className="grid grid-cols-4 gap-4">
                  {filteredAssets.map(renderAssetCard)}
                </div>
              )
            : (
                <div className="space-y-2">
                  {filteredAssets.map(renderAssetListItem)}
                </div>
              )}

          {filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image size={48} className={mutedColor} />
              <p className={`mt-4 ${mutedColor}`}>No assets found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t p-4 ${borderColor} flex items-center justify-between`}>
          <span className={`text-sm ${mutedColor}`}>
            {selectedAssets.size > 0 ? `${selectedAssets.size} selected` : `${filteredAssets.length} assets`}
          </span>
          <div className="flex gap-2">
            {selectedAssets.size > 0 && (
              <button
                onClick={() => setSelectedAssets(new Set())}
                className={`px-4 py-2 ${inputBg} ${mutedColor} rounded-lg`}
              >
                Clear Selection
              </button>
            )}
            <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              {selectedAssets.size > 0 ? `Insert ${selectedAssets.size} Assets` : 'Done'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} flex h-full ${className}`}>
      {/* Sidebar */}
      {showFolders && (
        <div className={`w-56 flex-shrink-0 border-r ${borderColor} p-4`}>
          <h3 className={`text-sm font-semibold ${textColor} mb-3`}>Folders</h3>
          {renderFolderTree()}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className={`border-b p-6 ${borderColor}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${textColor}`}>Asset Library</h2>
            <div className="flex items-center gap-2">
              <button className={`p-2 ${inputBg} rounded-lg ${hoverBg}`}>
                <Filter size={18} className={mutedColor} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : `${inputBg} ${mutedColor}`}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search size={16} className={`absolute top-1/2 left-3 -translate-y-1/2 ${mutedColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search assets..."
                className={`w-full py-2 pr-4 pl-10 ${inputBg} ${textColor} rounded-lg border ${borderColor}`}
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-4 flex gap-2">
            {(['all', 'images', 'videos', 'documents', 'icons', 'fonts'] as AssetCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : `${inputBg} ${mutedColor}`
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showUpload && <div className="mb-6">{renderUploadArea()}</div>}

          {viewMode === 'grid'
            ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredAssets.map(renderAssetCard)}
                </div>
              )
            : (
                <div className="space-y-2">
                  {filteredAssets.map(renderAssetListItem)}
                </div>
              )}

          {filteredAssets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Image size={48} className={mutedColor} />
              <p className={`mt-4 ${mutedColor}`}>No assets found</p>
              <button
                onClick={() => {
                  setSearchQuery(''); setSelectedCategory('all');
                }}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedAssets.size > 0 && (
          <div className={`border-t p-4 ${borderColor} flex items-center justify-between`}>
            <span className={`text-sm ${mutedColor}`}>
              {selectedAssets.size}
              {' '}
              selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedAssets(new Set())}
                className={`px-4 py-2 ${inputBg} ${mutedColor} rounded-lg`}
              >
                Clear
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                <Copy size={16} />
                Insert Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
