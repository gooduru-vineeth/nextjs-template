'use client';

import { BarChart3, Bookmark, Eye, Heart, MessageCircle, Repeat2, Share2, ThumbsUp, TrendingUp, Users } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type MetricValue = {
  value: number;
  label: string;
  icon: 'likes' | 'comments' | 'shares' | 'saves' | 'views' | 'reposts' | 'reactions';
  color?: string;
};

export type EngagementMetricsProps = {
  variant?: 'full' | 'compact' | 'inline' | 'minimal' | 'card';
  platform?: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'generic';
  metrics?: MetricValue[];
  onMetricsChange?: (metrics: MetricValue[]) => void;
  editable?: boolean;
  showTrending?: boolean;
  showAnalytics?: boolean;
  className?: string;
};

const defaultMetricsByPlatform: Record<string, MetricValue[]> = {
  instagram: [
    { value: 1234, label: 'Likes', icon: 'likes', color: '#ED4956' },
    { value: 56, label: 'Comments', icon: 'comments', color: '#0095F6' },
    { value: 23, label: 'Saves', icon: 'saves', color: '#FD8D32' },
    { value: 12, label: 'Shares', icon: 'shares', color: '#8E8E8E' },
  ],
  twitter: [
    { value: 456, label: 'Likes', icon: 'likes', color: '#F91880' },
    { value: 78, label: 'Replies', icon: 'comments', color: '#1D9BF0' },
    { value: 23, label: 'Reposts', icon: 'reposts', color: '#00BA7C' },
    { value: 12500, label: 'Views', icon: 'views', color: '#536471' },
  ],
  linkedin: [
    { value: 234, label: 'Reactions', icon: 'reactions', color: '#0A66C2' },
    { value: 45, label: 'Comments', icon: 'comments', color: '#0A66C2' },
    { value: 12, label: 'Reposts', icon: 'reposts', color: '#0A66C2' },
    { value: 5600, label: 'Impressions', icon: 'views', color: '#666666' },
  ],
  facebook: [
    { value: 567, label: 'Reactions', icon: 'reactions', color: '#1877F2' },
    { value: 89, label: 'Comments', icon: 'comments', color: '#1877F2' },
    { value: 34, label: 'Shares', icon: 'shares', color: '#1877F2' },
  ],
  tiktok: [
    { value: 45600, label: 'Likes', icon: 'likes', color: '#FE2C55' },
    { value: 1230, label: 'Comments', icon: 'comments', color: '#25F4EE' },
    { value: 567, label: 'Shares', icon: 'shares', color: '#FFFFFF' },
    { value: 890000, label: 'Views', icon: 'views', color: '#FFFFFF' },
  ],
  youtube: [
    { value: 12300, label: 'Likes', icon: 'likes', color: '#065FD4' },
    { value: 456, label: 'Comments', icon: 'comments', color: '#030303' },
    { value: 234000, label: 'Views', icon: 'views', color: '#606060' },
  ],
  generic: [
    { value: 1000, label: 'Likes', icon: 'likes', color: '#3B82F6' },
    { value: 50, label: 'Comments', icon: 'comments', color: '#10B981' },
    { value: 25, label: 'Shares', icon: 'shares', color: '#8B5CF6' },
  ],
};

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({
  variant = 'full',
  platform = 'generic',
  metrics,
  onMetricsChange,
  editable = false,
  showTrending = false,
  showAnalytics = false,
  className = '',
}) => {
  const [metricValues, setMetricValues] = useState<MetricValue[]>(metrics || defaultMetricsByPlatform[platform] || []);

  useEffect(() => {
    if (metrics) {
      setMetricValues(metrics);
    } else {
      setMetricValues(defaultMetricsByPlatform[platform] || []);
    }
  }, [metrics, platform]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const handleMetricChange = useCallback((index: number, value: number) => {
    const newMetrics = [...metricValues];
    newMetrics[index] = { ...newMetrics[index]!, value };
    setMetricValues(newMetrics);
    onMetricsChange?.(newMetrics);
  }, [metricValues, onMetricsChange]);

  const getIcon = (icon: string, size: number = 16) => {
    switch (icon) {
      case 'likes':
        return <Heart size={size} />;
      case 'comments':
        return <MessageCircle size={size} />;
      case 'shares':
        return <Share2 size={size} />;
      case 'saves':
        return <Bookmark size={size} />;
      case 'views':
        return <Eye size={size} />;
      case 'reposts':
        return <Repeat2 size={size} />;
      case 'reactions':
        return <ThumbsUp size={size} />;
      default:
        return <Heart size={size} />;
    }
  };

  // Minimal variant - just numbers
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {metricValues.map((metric, index) => (
          <div key={index} className="flex items-center gap-1">
            <span style={{ color: metric.color }} className="opacity-80">
              {getIcon(metric.icon, 14)}
            </span>
            {editable
              ? (
                  <input
                    type="number"
                    value={metric.value}
                    onChange={e => handleMetricChange(index, Number(e.target.value))}
                    className="w-16 border-b border-gray-300 bg-transparent text-center text-xs text-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                )
              : (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {formatNumber(metric.value)}
                  </span>
                )}
          </div>
        ))}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {metricValues.map((metric, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span style={{ color: metric.color }}>
              {getIcon(metric.icon, 16)}
            </span>
            {editable
              ? (
                  <input
                    type="number"
                    value={metric.value}
                    onChange={e => handleMetricChange(index, Number(e.target.value))}
                    className="w-16 border-b border-gray-300 bg-transparent text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                )
              : (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatNumber(metric.value)}
                  </span>
                )}
          </div>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {metricValues.map((metric, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center gap-1" style={{ color: metric.color }}>
              {getIcon(metric.icon, 18)}
              {editable
                ? (
                    <input
                      type="number"
                      value={metric.value}
                      onChange={e => handleMetricChange(index, Number(e.target.value))}
                      className="w-16 border-b border-gray-300 bg-transparent text-center text-sm font-semibold dark:border-gray-600"
                      style={{ color: metric.color }}
                    />
                  )
                : (
                    <span className="text-sm font-semibold">{formatNumber(metric.value)}</span>
                  )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            <BarChart3 size={16} />
            Engagement
          </h4>
          {showTrending && (
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp size={12} />
              <span>+12.5%</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {metricValues.map((metric, index) => (
            <div
              key={index}
              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
            >
              <div className="mb-1 flex items-center gap-2">
                <span style={{ color: metric.color }}>{getIcon(metric.icon, 16)}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</span>
              </div>
              {editable
                ? (
                    <input
                      type="number"
                      value={metric.value}
                      onChange={e => handleMetricChange(index, Number(e.target.value))}
                      className="w-full border-b border-gray-300 bg-transparent text-lg font-bold text-gray-800 dark:border-gray-600 dark:text-gray-200"
                    />
                  )
                : (
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {formatNumber(metric.value)}
                    </div>
                  )}
            </div>
          ))}
        </div>
        {showAnalytics && (
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>Reach: 15.2K</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>Impressions: 23.4K</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <BarChart3 size={18} />
            Engagement Metrics
          </h4>
          <span className="text-xs text-gray-500 capitalize dark:text-gray-400">{platform}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metricValues.map((metric, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                >
                  {getIcon(metric.icon, 20)}
                </span>
                {showTrending && (
                  <span className="flex items-center gap-0.5 text-xs text-green-500">
                    <TrendingUp size={10} />
                    +
                    {Math.floor(Math.random() * 20 + 5)}
                    %
                  </span>
                )}
              </div>
              {editable
                ? (
                    <input
                      type="number"
                      value={metric.value}
                      onChange={e => handleMetricChange(index, Number(e.target.value))}
                      className="mb-1 w-full border-b border-gray-300 bg-transparent text-2xl font-bold text-gray-800 dark:border-gray-600 dark:text-gray-200"
                    />
                  )
                : (
                    <div className="mb-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {formatNumber(metric.value)}
                    </div>
                  )}
              <div className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {showAnalytics && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Engagement Rate:</span>
              {' '}
              <span className="font-semibold text-green-600 dark:text-green-400">4.7%</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>15.2K Reach</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>23.4K Impressions</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementMetrics;
