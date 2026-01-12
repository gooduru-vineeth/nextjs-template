'use client';

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  FileText,
  Globe,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type SEOScore = 'good' | 'average' | 'poor';

type SEOCheck = {
  id: string;
  category: 'meta' | 'content' | 'technical' | 'social';
  name: string;
  description: string;
  status: SEOScore;
  value?: string;
  recommendation?: string;
  impact: 'high' | 'medium' | 'low';
};

type KeywordAnalysis = {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  currentRank?: number;
};

type PageAnalysis = {
  url: string;
  title: string;
  score: number;
  checks: SEOCheck[];
  keywords: KeywordAnalysis[];
  analyzedAt: string;
};

type SEOOptimizationToolsProps = {
  variant?: 'full' | 'compact' | 'widget';
  pageUrl?: string;
  onAnalyze?: (url: string) => void;
  onOptimize?: (checkId: string) => void;
  className?: string;
};

// Mock data
const mockAnalysis: PageAnalysis = {
  url: 'https://mockflow.com/templates/social-media',
  title: 'Social Media Mockup Templates | MockFlow',
  score: 78,
  analyzedAt: new Date().toISOString(),
  checks: [
    { id: 'c1', category: 'meta', name: 'Title Tag', description: 'Page has a unique title tag', status: 'good', value: 'Social Media Mockup Templates | MockFlow (52 chars)', impact: 'high' },
    { id: 'c2', category: 'meta', name: 'Meta Description', description: 'Page has a meta description', status: 'average', value: 'Create stunning social media mockups with our templates... (145 chars)', recommendation: 'Add more detail and include target keywords', impact: 'high' },
    { id: 'c3', category: 'meta', name: 'Canonical URL', description: 'Page has canonical URL set', status: 'good', value: 'https://mockflow.com/templates/social-media', impact: 'medium' },
    { id: 'c4', category: 'content', name: 'H1 Tag', description: 'Page has exactly one H1 tag', status: 'good', value: 'Social Media Mockup Templates', impact: 'high' },
    { id: 'c5', category: 'content', name: 'Content Length', description: 'Page has sufficient content', status: 'average', value: '450 words (recommended: 1000+)', recommendation: 'Add more descriptive content about template features', impact: 'medium' },
    { id: 'c6', category: 'content', name: 'Keyword Density', description: 'Target keywords appear naturally', status: 'good', value: '"mockup templates" appears 5 times (1.1%)', impact: 'medium' },
    { id: 'c7', category: 'content', name: 'Image Alt Tags', description: 'Images have descriptive alt tags', status: 'poor', value: '3 of 12 images missing alt tags', recommendation: 'Add descriptive alt text to all images', impact: 'medium' },
    { id: 'c8', category: 'technical', name: 'Page Speed', description: 'Page loads quickly', status: 'good', value: 'LCP: 1.8s, FCP: 0.9s', impact: 'high' },
    { id: 'c9', category: 'technical', name: 'Mobile Friendly', description: 'Page is mobile responsive', status: 'good', impact: 'high' },
    { id: 'c10', category: 'technical', name: 'HTTPS', description: 'Page uses secure connection', status: 'good', impact: 'high' },
    { id: 'c11', category: 'technical', name: 'Structured Data', description: 'Page has schema markup', status: 'poor', recommendation: 'Add Product or SoftwareApplication schema', impact: 'medium' },
    { id: 'c12', category: 'social', name: 'Open Graph Tags', description: 'Page has OG tags for social sharing', status: 'average', recommendation: 'Add og:image with 1200x630 dimensions', impact: 'medium' },
    { id: 'c13', category: 'social', name: 'Twitter Card', description: 'Page has Twitter card meta tags', status: 'good', impact: 'low' },
  ],
  keywords: [
    { keyword: 'mockup templates', searchVolume: 12100, difficulty: 45, cpc: 2.50, trend: 'up', currentRank: 8 },
    { keyword: 'social media mockup', searchVolume: 8100, difficulty: 38, cpc: 1.80, trend: 'up', currentRank: 12 },
    { keyword: 'instagram mockup', searchVolume: 18100, difficulty: 52, cpc: 3.20, trend: 'stable', currentRank: 24 },
    { keyword: 'free mockup generator', searchVolume: 6600, difficulty: 42, cpc: 1.50, trend: 'up' },
    { keyword: 'linkedin post mockup', searchVolume: 2900, difficulty: 28, cpc: 0.90, trend: 'stable', currentRank: 5 },
  ],
};

const categoryConfig = {
  meta: { label: 'Meta Tags', icon: FileText, color: 'text-blue-500' },
  content: { label: 'Content', icon: FileText, color: 'text-green-500' },
  technical: { label: 'Technical', icon: Zap, color: 'text-orange-500' },
  social: { label: 'Social', icon: Globe, color: 'text-purple-500' },
};

export default function SEOOptimizationTools({
  variant = 'full',
  pageUrl = '',
  onAnalyze,
  onOptimize,
  className = '',
}: SEOOptimizationToolsProps) {
  const [analysis, setAnalysis] = useState<PageAnalysis | null>(mockAnalysis);
  const [url, setUrl] = useState(pageUrl || mockAnalysis.url);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'suggestions'>('overview');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['meta', 'content']);

  const handleAnalyze = useCallback(async () => {
    if (!url) {
      return;
    }
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAnalysis({
      ...mockAnalysis,
      url,
      analyzedAt: new Date().toISOString(),
    });
    setIsAnalyzing(false);
    onAnalyze?.(url);
  }, [url, onAnalyze]);

  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category],
    );
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) {
      return 'text-green-600';
    }
    if (score >= 60) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  const getStatusIcon = (status: SEOScore) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'average': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'poor': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const groupedChecks = analysis?.checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category]!.push(check);
    return acc;
  }, {} as Record<string, SEOCheck[]>) || {};

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">SEO Score</span>
          </div>
          <span className={`text-lg font-bold ${analysis ? getScoreColor(analysis.score) : 'text-gray-400'}`}>
            {analysis?.score || '--'}
            %
          </span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-green-600">
            {analysis?.checks.filter(c => c.status === 'good').length || 0}
            {' '}
            good
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-yellow-600">
            {analysis?.checks.filter(c => c.status === 'average').length || 0}
            {' '}
            avg
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-red-600">
            {analysis?.checks.filter(c => c.status === 'poor').length || 0}
            {' '}
            poor
          </span>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">SEO Analysis</h3>
          <div className={`text-2xl font-bold ${analysis ? getScoreColor(analysis.score) : 'text-gray-400'}`}>
            {analysis?.score || '--'}
            %
          </div>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter URL to analyze"
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !url}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
        {analysis && (
          <div className="space-y-2">
            {analysis.checks.filter(c => c.status !== 'good').slice(0, 3).map(check => (
              <div key={check.id} className="flex items-center gap-2 rounded bg-gray-50 p-2 text-sm dark:bg-gray-700/50">
                {getStatusIcon(check.status)}
                <span className="text-gray-700 dark:text-gray-300">{check.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">SEO Optimization Tools</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analyze and improve page visibility</p>
            </div>
          </div>
          {analysis && (
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</div>
              <p className="text-sm text-gray-500">SEO Score</p>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Enter URL to analyze (e.g., https://example.com/page)"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !url}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnalyzing
              ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                )
              : (
                  <>
                    <Search className="h-5 w-5" />
                    Analyze
                  </>
                )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {analysis && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-6">
            {(['overview', 'keywords', 'suggestions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {analysis && (
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {(Object.keys(groupedChecks) as Array<keyof typeof categoryConfig>).map((category) => {
                const config = categoryConfig[category];
                const Icon = config.icon;
                const checks = groupedChecks[category] || [];
                const isExpanded = expandedCategories.includes(category);

                return (
                  <div key={category} className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex w-full items-center justify-between bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        <span className="font-medium text-gray-900 dark:text-white">{config.label}</span>
                        <span className="text-sm text-gray-500">
                          (
                          {checks.length}
                          {' '}
                          checks)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                          <span className="text-xs text-green-600">
                            {checks.filter(c => c.status === 'good').length}
                            {' '}
                            ✓
                          </span>
                          <span className="text-xs text-yellow-600">
                            {checks.filter(c => c.status === 'average').length}
                            {' '}
                            ⚠
                          </span>
                          <span className="text-xs text-red-600">
                            {checks.filter(c => c.status === 'poor').length}
                            {' '}
                            ✗
                          </span>
                        </div>
                        <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {checks.map(check => (
                          <div key={check.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                {getStatusIcon(check.status)}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900 dark:text-white">{check.name}</p>
                                    <span className={`rounded px-2 py-0.5 text-xs ${
                                      check.impact === 'high'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : check.impact === 'medium'
                                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                    }`}
                                    >
                                      {check.impact}
                                      {' '}
                                      impact
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">{check.description}</p>
                                  {check.value && (
                                    <p className="mt-1 font-mono text-xs text-gray-400">{check.value}</p>
                                  )}
                                  {check.recommendation && (
                                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                                      💡
                                      {' '}
                                      {check.recommendation}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {check.status !== 'good' && (
                                <button
                                  onClick={() => onOptimize?.(check.id)}
                                  className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                >
                                  <Zap className="h-3 w-3" />
                                  Fix
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === 'keywords' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Target Keywords</h3>
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                  <Target className="h-4 w-4" />
                  Add Keyword
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-sm text-gray-500 dark:border-gray-700">
                      <th className="pb-3 font-medium">Keyword</th>
                      <th className="pb-3 font-medium">Volume</th>
                      <th className="pb-3 font-medium">Difficulty</th>
                      <th className="pb-3 font-medium">CPC</th>
                      <th className="pb-3 font-medium">Trend</th>
                      <th className="pb-3 font-medium">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.keywords.map(keyword => (
                      <tr key={keyword.keyword} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 font-medium text-gray-900 dark:text-white">{keyword.keyword}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{keyword.searchVolume.toLocaleString()}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`h-full ${
                                  keyword.difficulty < 35
                                    ? 'bg-green-500'
                                    : keyword.difficulty < 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${keyword.difficulty}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{keyword.difficulty}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          $
                          {keyword.cpc.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span className={`flex items-center gap-1 ${
                            keyword.trend === 'up'
                              ? 'text-green-600'
                              : keyword.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                          }`}
                          >
                            <TrendingUp className={`h-4 w-4 ${keyword.trend === 'down' ? 'rotate-180' : keyword.trend === 'stable' ? 'rotate-90' : ''}`} />
                            {keyword.trend}
                          </span>
                        </td>
                        <td className="py-3">
                          {keyword.currentRank
                            ? (
                                <span className={`font-medium ${keyword.currentRank <= 10 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                  #
                                  {keyword.currentRank}
                                </span>
                              )
                            : (
                                <span className="text-gray-400">--</span>
                              )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Optimization Suggestions</h3>
              {analysis.checks.filter(c => c.status !== 'good').sort((a, b) => {
                const impactOrder = { high: 0, medium: 1, low: 2 };
                return impactOrder[a.impact] - impactOrder[b.impact];
              }).map((check, index) => (
                <div key={check.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                      check.impact === 'high'
                        ? 'bg-red-100 text-red-600'
                        : check.impact === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{check.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{check.recommendation || check.description}</p>
                      {check.value && (
                        <div className="mt-2 rounded bg-white p-2 font-mono text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          Current:
                          {' '}
                          {check.value}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onOptimize?.(check.id)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Apply Fix
                    </button>
                  </div>
                </div>
              ))}
              {analysis.checks.filter(c => c.status !== 'good').length === 0 && (
                <div className="py-8 text-center">
                  <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                  <h4 className="font-medium text-gray-900 dark:text-white">All checks passed!</h4>
                  <p className="text-sm text-gray-500">Your page is well optimized</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysis && (
        <div className="p-12 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No analysis yet</h3>
          <p className="text-gray-500">Enter a URL above to analyze its SEO performance</p>
        </div>
      )}

      {/* Footer */}
      {analysis && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-center text-xs text-gray-500">
            Last analyzed:
            {' '}
            {new Date(analysis.analyzedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export type { KeywordAnalysis, PageAnalysis, SEOCheck, SEOOptimizationToolsProps, SEOScore };
