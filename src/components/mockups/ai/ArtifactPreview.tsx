'use client';

import { useState } from 'react';

type ArtifactType = 'code' | 'image' | 'document' | 'spreadsheet' | 'chart' | 'diagram' | 'website' | 'component' | 'markdown' | 'svg';

type Artifact = {
  id: string;
  type: ArtifactType;
  title: string;
  content?: string;
  language?: string; // for code
  imageUrl?: string; // for image/svg
  metadata?: Record<string, string | number>;
};

type ArtifactPreviewProps = {
  artifact: Artifact;
  variant?: 'inline' | 'modal' | 'panel' | 'card';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  showToolbar?: boolean;
  maxHeight?: number;
  className?: string;
};

// Type icons
const artifactIcons: Record<ArtifactType, React.ReactNode> = {
  code: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  image: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  document: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  spreadsheet: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  diagram: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  website: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  component: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  markdown: (
    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.27 19.385H1.73A1.73 1.73 0 010 17.655V6.345a1.73 1.73 0 011.73-1.73h20.54A1.73 1.73 0 0124 6.345v11.31a1.73 1.73 0 01-1.73 1.73zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zm12.693-3.348l-2.308-2.885v2.885h-2.307v-4.5h2.307l2.308 2.885 2.307-2.885h2.308v4.5h-2.308v-2.885z" />
    </svg>
  ),
  svg: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

const artifactLabels: Record<ArtifactType, string> = {
  code: 'Code',
  image: 'Image',
  document: 'Document',
  spreadsheet: 'Spreadsheet',
  chart: 'Chart',
  diagram: 'Diagram',
  website: 'Website',
  component: 'Component',
  markdown: 'Markdown',
  svg: 'SVG',
};

// Simple syntax highlighting colors
const languageColors: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  rust: '#dea584',
  go: '#00add8',
  java: '#b07219',
  html: '#e34c26',
  css: '#563d7c',
  json: '#292929',
  markdown: '#083fa1',
};

export function ArtifactPreview({
  artifact,
  variant = 'card',
  isExpanded = false,
  onToggleExpand,
  onCopy,
  onDownload,
  onEdit,
  showToolbar = true,
  maxHeight = 400,
  className = '',
}: ArtifactPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (artifact.content) {
      navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    }
  };

  const renderContent = () => {
    switch (artifact.type) {
      case 'code':
        return (
          <pre
            className="overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-sm text-gray-100"
            style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
          >
            <code>{artifact.content}</code>
          </pre>
        );

      case 'image':
      case 'svg':
        return (
          <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            {artifact.imageUrl
              ? (
                  <img
                    src={artifact.imageUrl}
                    alt={artifact.title}
                    className="max-h-[400px] rounded object-contain"
                  />
                )
              : artifact.content && artifact.type === 'svg'
                ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: artifact.content }}
                      className="max-h-[400px]"
                    />
                  )
                : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      {artifactIcons[artifact.type]}
                      <span className="text-sm">No preview available</span>
                    </div>
                  )}
          </div>
        );

      case 'markdown':
        return (
          <div
            className="prose prose-sm dark:prose-invert max-w-none overflow-auto p-4"
            style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
          >
            {/* In a real app, render markdown here */}
            <pre className="whitespace-pre-wrap">{artifact.content}</pre>
          </div>
        );

      case 'component':
      case 'website':
        return (
          <div
            className="overflow-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
            style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
          >
            <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 dark:border-gray-700">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-yellow-500" />
                <div className="size-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 rounded bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800">
                preview.local
              </div>
            </div>
            <div className="p-4">
              {artifact.content
                ? (
                    <div dangerouslySetInnerHTML={{ __html: artifact.content }} />
                  )
                : (
                    <div className="flex h-40 items-center justify-center text-gray-400">
                      Component Preview
                    </div>
                  )}
            </div>
          </div>
        );

      case 'chart':
      case 'diagram':
        return (
          <div className="flex h-60 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col items-center gap-2 text-gray-400">
              {artifactIcons[artifact.type]}
              <span className="text-sm">
                {artifactLabels[artifact.type]}
                {' '}
                Preview
              </span>
            </div>
          </div>
        );

      default:
        return (
          <div
            className="overflow-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
            style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
          >
            <pre className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {artifact.content || 'No content'}
            </pre>
          </div>
        );
    }
  };

  // Inline variant (minimal, embedded in text)
  if (variant === 'inline') {
    return (
      <div className={`my-2 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
          {artifactIcons[artifact.type]}
          <span className="font-medium">{artifact.title}</span>
          {artifact.language && (
            <span
              className="rounded px-1.5 py-0.5 text-xs text-white"
              style={{ backgroundColor: languageColors[artifact.language] || '#6b7280' }}
            >
              {artifact.language}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {artifactIcons[artifact.type]}
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{artifact.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {artifactLabels[artifact.type]}
              {artifact.language && ` • ${artifact.language}`}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        {showToolbar && (
          <div className="flex items-center gap-1">
            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isExpanded
                    ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      )
                    : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      )}
                </svg>
              </button>
            )}
            {artifact.content && (
              <button
                onClick={handleCopy}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Copy"
              >
                {copied
                  ? (
                      <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  : (
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Download"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Edit"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {renderContent()}
      </div>

      {/* Metadata */}
      {artifact.metadata && Object.keys(artifact.metadata).length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {Object.entries(artifact.metadata).map(([key, value]) => (
              <span
                key={key}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {key}
                :
                {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Artifact list/gallery
type ArtifactGalleryProps = {
  artifacts: Artifact[];
  onSelect?: (artifact: Artifact) => void;
  className?: string;
};

export function ArtifactGallery({
  artifacts,
  onSelect,
  className = '',
}: ArtifactGalleryProps) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 ${className}`}>
      {artifacts.map(artifact => (
        <button
          key={artifact.id}
          onClick={() => onSelect?.(artifact)}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {artifactIcons[artifact.type]}
          </div>
          <div>
            <p className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white">
              {artifact.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {artifactLabels[artifact.type]}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

// Mini artifact badge (for showing in messages)
type ArtifactBadgeProps = {
  artifact: Artifact;
  onClick?: () => void;
  className?: string;
};

export function ArtifactBadge({
  artifact,
  onClick,
  className = '',
}: ArtifactBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${className}`}
    >
      {artifactIcons[artifact.type]}
      <span className="font-medium text-gray-700 dark:text-gray-200">{artifact.title}</span>
    </button>
  );
}

export type { Artifact, ArtifactType };
