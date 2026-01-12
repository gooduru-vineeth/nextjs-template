'use client';

import { BrandKitManager } from '@/components/brand';

export default function BrandKitsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brand Kits</h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Manage your brand colors, fonts, and logos
              </p>
            </div>
            <nav className="flex items-center gap-2 text-sm">
              <a href="/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Dashboard
              </a>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="font-medium text-gray-900 dark:text-white">Brand Kits</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BrandKitManager />
      </div>
    </div>
  );
}
