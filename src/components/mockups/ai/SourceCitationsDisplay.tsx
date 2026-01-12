'use client';

import { Book, Check, ChevronDown, ChevronUp, Copy, ExternalLink, FileText, Globe, Plus, Video, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type SourceCitation = {
  id: string;
  number: number;
  title: string;
  url: string;
  domain?: string;
  snippet?: string;
  favicon?: string;
  type?: 'website' | 'article' | 'video' | 'document' | 'book';
  relevance?: number;
};

export type SourceCitationsDisplayProps = {
  variant?: 'full' | 'compact' | 'inline' | 'sidebar' | 'numbered';
  citations?: SourceCitation[];
  onChange?: (citations: SourceCitation[]) => void;
  editable?: boolean;
  maxVisible?: number;
  showSnippets?: boolean;
  showRelevance?: boolean;
  className?: string;
};

const defaultCitations: SourceCitation[] = [
  {
    id: '1',
    number: 1,
    title: 'Understanding React Hooks',
    url: 'https://react.dev/learn/hooks-overview',
    domain: 'react.dev',
    snippet: 'Hooks let you use state and other React features without writing a class...',
    type: 'article',
    relevance: 95,
  },
  {
    id: '2',
    number: 2,
    title: 'React Documentation',
    url: 'https://react.dev/reference/react',
    domain: 'react.dev',
    snippet: 'Reference documentation for React hooks, components, and APIs...',
    type: 'website',
    relevance: 88,
  },
  {
    id: '3',
    number: 3,
    title: 'MDN Web Docs - JavaScript',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    domain: 'developer.mozilla.org',
    snippet: 'JavaScript (JS) is a lightweight interpreted programming language...',
    type: 'article',
    relevance: 75,
  },
];

const SourceCitationsDisplay: React.FC<SourceCitationsDisplayProps> = ({
  variant = 'full',
  citations = defaultCitations,
  onChange,
  editable = false,
  maxVisible = 5,
  showSnippets = true,
  showRelevance = false,
  className = '',
}) => {
  const [citationList, setCitationList] = useState<SourceCitation[]>(citations);
  const [expanded, setExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setCitationList(citations);
  }, [citations]);

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'article':
        return <FileText size={14} />;
      case 'video':
        return <Video size={14} />;
      case 'document':
        return <FileText size={14} />;
      case 'book':
        return <Book size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  const copyUrl = useCallback((citation: SourceCitation) => {
    navigator.clipboard.writeText(citation.url);
    setCopiedId(citation.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const removeCitation = useCallback((id: string) => {
    const newCitations = citationList.filter(c => c.id !== id);
    setCitationList(newCitations);
    onChange?.(newCitations);
  }, [citationList, onChange]);

  const addCitation = useCallback(() => {
    const newCitation: SourceCitation = {
      id: `citation-${Date.now()}`,
      number: citationList.length + 1,
      title: 'New Source',
      url: 'https://example.com',
      domain: 'example.com',
      type: 'website',
    };
    const newCitations = [...citationList, newCitation];
    setCitationList(newCitations);
    onChange?.(newCitations);
  }, [citationList, onChange]);

  const visibleCitations = expanded ? citationList : citationList.slice(0, maxVisible);
  const hasMore = citationList.length > maxVisible;

  // Inline variant - just numbered links
  if (variant === 'inline') {
    return (
      <span className={`inline-flex flex-wrap gap-1 ${className}`}>
        {citationList.map(citation => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-5 w-5 items-center justify-center rounded bg-blue-100 text-xs text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            title={citation.title}
          >
            {citation.number}
          </a>
        ))}
      </span>
    );
  }

  // Numbered variant - vertical list with numbers
  if (variant === 'numbered') {
    return (
      <div className={`space-y-1 ${className}`}>
        {visibleCitations.map(citation => (
          <div
            key={citation.id}
            className="group flex items-start gap-2 text-sm"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {citation.number}
            </span>
            <div className="min-w-0 flex-1">
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-blue-600 hover:underline dark:text-blue-400"
              >
                {citation.title}
              </a>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {citation.domain}
              </span>
            </div>
            {editable && (
              <button
                onClick={() => removeCitation(citation.id)}
                className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-blue-600 hover:underline dark:text-blue-400"
          >
            +
            {citationList.length - maxVisible}
            {' '}
            more sources
          </button>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {visibleCitations.map(citation => (
          <a
            key={citation.id}
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1 text-sm transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-500 text-xs font-medium text-white">
              {citation.number}
            </span>
            <span className="max-w-32 truncate text-gray-600 dark:text-gray-400">
              {citation.domain}
            </span>
            <ExternalLink size={12} className="text-gray-400 opacity-0 group-hover:opacity-100" />
          </a>
        ))}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="rounded-lg px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            +
            {citationList.length - maxVisible}
          </button>
        )}
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Sources (
            {citationList.length}
            )
          </h4>
          {editable && (
            <button
              onClick={addCitation}
              className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {visibleCitations.map(citation => (
            <div
              key={citation.id}
              className="group flex items-start gap-2 rounded-lg bg-white p-2 dark:bg-gray-800"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                {citation.number}
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-1 text-sm font-medium text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                >
                  {citation.title}
                </a>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {getTypeIcon(citation.type)}
                  <span>{citation.domain}</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(citation)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {copiedId === citation.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
                {editable && (
                  <button
                    onClick={() => removeCitation(citation.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex w-full items-center justify-center gap-1 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {expanded
              ? (
                  <>
                    <ChevronUp size={14} />
                    Show less
                  </>
                )
              : (
                  <>
                    <ChevronDown size={14} />
                    Show
                    {' '}
                    {citationList.length - maxVisible}
                    {' '}
                    more
                  </>
                )}
          </button>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <Book size={18} />
            Sources
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {citationList.length}
              {' '}
              citations
            </span>
            {editable && (
              <button
                onClick={addCitation}
                className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Citation list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {visibleCitations.map(citation => (
          <div
            key={citation.id}
            className="group p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {citation.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-medium text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                    >
                      {citation.title}
                      <ExternalLink size={14} className="flex-shrink-0 opacity-50" />
                    </a>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {getTypeIcon(citation.type)}
                      <span>{citation.domain}</span>
                      {showRelevance && citation.relevance && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {citation.relevance}
                          % relevant
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-1 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(citation)}
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      title="Copy URL"
                    >
                      {copiedId === citation.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    {editable && (
                      <button
                        onClick={() => removeCitation(citation.id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {showSnippets && citation.snippet && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {citation.snippet}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      {hasMore && (
        <div className="border-t border-gray-100 p-3 dark:border-gray-800">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            {expanded
              ? (
                  <>
                    <ChevronUp size={16} />
                    Show fewer sources
                  </>
                )
              : (
                  <>
                    <ChevronDown size={16} />
                    Show
                    {' '}
                    {citationList.length - maxVisible}
                    {' '}
                    more sources
                  </>
                )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SourceCitationsDisplay;
