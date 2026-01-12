'use client';

import { useEffect, useState } from 'react';

type Stats = {
  totalMockups: number;
  chatMockups: number;
  aiMockups: number;
  socialMockups: number;
};

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/mockups?limit=1000');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        const mockups = data.mockups || [];

        setStats({
          totalMockups: mockups.length,
          chatMockups: mockups.filter((m: { type: string }) => m.type === 'chat').length,
          aiMockups: mockups.filter((m: { type: string }) => m.type === 'ai').length,
          socialMockups: mockups.filter((m: { type: string }) => m.type === 'social').length,
        });
      } catch {
        // Set default stats on error
        setStats({
          totalMockups: 0,
          chatMockups: 0,
          aiMockups: 0,
          socialMockups: 0,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  const statItems = [
    { label: 'Total Mockups', value: stats?.totalMockups ?? 0, icon: '📄' },
    { label: 'Chat Mockups', value: stats?.chatMockups ?? 0, icon: '💬' },
    { label: 'AI Mockups', value: stats?.aiMockups ?? 0, icon: '🤖' },
    { label: 'Social Mockups', value: stats?.socialMockups ?? 0, icon: '📱' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statItems.map(stat => (
        <div
          key={stat.label}
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
