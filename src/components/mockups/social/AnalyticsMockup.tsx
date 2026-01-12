'use client';

type AnalyticsData = {
  postTitle?: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';
  dateRange: string;
  metrics: {
    impressions: number;
    reach: number;
    engagement: number;
    engagementRate: number;
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
    clicks?: number;
    profileVisits?: number;
    followers?: number;
  };
  audienceDemographics?: {
    topLocations: { name: string; percentage: number }[];
    ageGroups: { range: string; percentage: number }[];
    genderSplit: { male: number; female: number; other: number };
  };
  performanceOverTime?: {
    labels: string[];
    impressions: number[];
    engagement: number[];
  };
  bestTimeToPost?: {
    day: string;
    time: string;
  };
};

type AnalyticsMockupProps = {
  data: AnalyticsData;
  appearance?: {
    theme?: 'light' | 'dark';
    showDemographics?: boolean;
    showTimeAnalysis?: boolean;
    showComparison?: boolean;
  };
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

function getPercentageChange(): { value: number; isPositive: boolean } {
  // Generate realistic percentage changes
  const change = Math.random() * 40 - 10; // -10% to +30%
  return {
    value: Math.abs(change),
    isPositive: change > 0,
  };
}

function SimpleBarChart({ data, maxValue, color }: { data: number[]; maxValue: number; color: string }) {
  return (
    <div className="flex h-32 items-end gap-1">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
          style={{
            height: `${(value / maxValue) * 100}%`,
            backgroundColor: color,
            minHeight: '4px',
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  change,
  isDark,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: number; isPositive: boolean };
  isDark: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {typeof value === 'number' ? formatNumber(value) : value}
        </span>
        {change && (
          <span className={`flex items-center text-sm ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change.isPositive
              ? (
                  <svg className="mr-0.5 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )
              : (
                  <svg className="mr-0.5 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
            {change.value.toFixed(1)}
            %
          </span>
        )}
      </div>
    </div>
  );
}

export function AnalyticsMockup({ data, appearance = {} }: AnalyticsMockupProps) {
  const {
    theme = 'light',
    showDemographics = true,
    showTimeAnalysis = true,
  } = appearance;

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const platformColors: Record<string, string> = {
    instagram: '#E1306C',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    tiktok: '#000000',
  };

  const primaryColor = platformColors[data.platform] || '#3B82F6';

  // Generate sample performance data if not provided
  const performanceData = data.performanceOverTime || {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    impressions: [1200, 1800, 2400, 2100, 3200, 2800, 2500],
    engagement: [120, 180, 240, 210, 320, 280, 250],
  };

  const maxImpressions = Math.max(...performanceData.impressions);

  return (
    <div className={`w-[800px] rounded-2xl ${bgColor} p-6`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textColor}`}>Post Analytics</h1>
          <p className={secondaryText}>
            {data.postTitle || 'Post Performance'}
            {' '}
            ·
            {data.dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-sm font-medium text-white capitalize"
            style={{ backgroundColor: primaryColor }}
          >
            {data.platform}
          </span>
          <button className={`rounded-lg p-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <svg className={`size-5 ${secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <MetricCard
          label="Impressions"
          value={data.metrics.impressions}
          change={getPercentageChange()}
          isDark={isDark}
          icon={(
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        />
        <MetricCard
          label="Reach"
          value={data.metrics.reach}
          change={getPercentageChange()}
          isDark={isDark}
          icon={(
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        />
        <MetricCard
          label="Engagement"
          value={data.metrics.engagement}
          change={getPercentageChange()}
          isDark={isDark}
          icon={(
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        />
        <MetricCard
          label="Eng. Rate"
          value={`${data.metrics.engagementRate.toFixed(2)}%`}
          change={getPercentageChange()}
          isDark={isDark}
          icon={(
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )}
        />
      </div>

      {/* Engagement Breakdown */}
      <div className={`mb-6 rounded-xl ${cardBg} p-4 shadow-sm`}>
        <h3 className={`mb-4 font-semibold ${textColor}`}>Engagement Breakdown</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Likes', value: data.metrics.likes, icon: '❤️' },
            { label: 'Comments', value: data.metrics.comments, icon: '💬' },
            { label: 'Shares', value: data.metrics.shares, icon: '🔄' },
            { label: 'Saves', value: data.metrics.saves || 0, icon: '🔖' },
            { label: 'Clicks', value: data.metrics.clicks || 0, icon: '👆' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="mb-1 text-2xl">{item.icon}</div>
              <div className={`text-lg font-bold ${textColor}`}>{formatNumber(item.value)}</div>
              <div className={`text-xs ${secondaryText}`}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Over Time */}
      <div className={`mb-6 rounded-xl ${cardBg} p-4 shadow-sm`}>
        <h3 className={`mb-4 font-semibold ${textColor}`}>Performance Over Time</h3>
        <SimpleBarChart data={performanceData.impressions} maxValue={maxImpressions} color={primaryColor} />
        <div className={`mt-2 flex justify-between text-xs ${secondaryText}`}>
          {performanceData.labels.map(label => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Audience Demographics */}
        {showDemographics && data.audienceDemographics && (
          <div className={`rounded-xl ${cardBg} p-4 shadow-sm`}>
            <h3 className={`mb-4 font-semibold ${textColor}`}>Audience Demographics</h3>

            {/* Top Locations */}
            <div className="mb-4">
              <p className={`mb-2 text-sm ${secondaryText}`}>Top Locations</p>
              <div className="space-y-2">
                {data.audienceDemographics.topLocations.slice(0, 3).map(loc => (
                  <div key={loc.name} className="flex items-center justify-between">
                    <span className={`text-sm ${textColor}`}>{loc.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${loc.percentage}%`, backgroundColor: primaryColor }}
                        />
                      </div>
                      <span className={`text-xs ${secondaryText}`}>
                        {loc.percentage}
                        %
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Split */}
            <div>
              <p className={`mb-2 text-sm ${secondaryText}`}>Gender</p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${textColor}`}>
                    {data.audienceDemographics.genderSplit.male}
                    %
                  </div>
                  <div className={`text-xs ${secondaryText}`}>Male</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${textColor}`}>
                    {data.audienceDemographics.genderSplit.female}
                    %
                  </div>
                  <div className={`text-xs ${secondaryText}`}>Female</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${textColor}`}>
                    {data.audienceDemographics.genderSplit.other}
                    %
                  </div>
                  <div className={`text-xs ${secondaryText}`}>Other</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Best Time to Post */}
        {showTimeAnalysis && (
          <div className={`rounded-xl ${cardBg} p-4 shadow-sm`}>
            <h3 className={`mb-4 font-semibold ${textColor}`}>Insights</h3>

            <div className={`mb-4 rounded-lg border ${borderColor} p-3`}>
              <p className={`mb-1 text-sm ${secondaryText}`}>Best Time to Post</p>
              <p className={`text-lg font-bold ${textColor}`}>
                {data.bestTimeToPost?.day || 'Wednesday'}
                {' '}
                at
                {data.bestTimeToPost?.time || '6:00 PM'}
              </p>
              <p className={`text-xs ${secondaryText}`}>Based on your audience activity</p>
            </div>

            <div className={`rounded-lg border ${borderColor} p-3`}>
              <p className={`mb-1 text-sm ${secondaryText}`}>Content Tip</p>
              <p className={`text-sm ${textColor}`}>
                Posts with images get 2.3x more engagement than text-only posts
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className={`text-sm ${secondaryText}`}>Profile Visits</p>
                <p className={`text-xl font-bold ${textColor}`}>
                  {formatNumber(data.metrics.profileVisits || 342)}
                </p>
              </div>
              <div>
                <p className={`text-sm ${secondaryText}`}>New Followers</p>
                <p className={`text-xl font-bold ${textColor}`}>
                  +
                  {formatNumber(data.metrics.followers || 28)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`mt-6 flex items-center justify-between border-t ${borderColor} pt-4`}>
        <p className={`text-xs ${secondaryText}`}>Last updated: Just now</p>
        <div className="flex items-center gap-2">
          <button className={`rounded-lg px-3 py-1.5 text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            Export Report
          </button>
          <button
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white"
            style={{ backgroundColor: primaryColor }}
          >
            View Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
