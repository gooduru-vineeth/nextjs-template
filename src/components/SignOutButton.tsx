'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const SignOutButton = ({ children, locale }: { children: React.ReactNode; locale: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await fetch(`/${locale}/api/auth/logout`, {
        method: 'POST',
      });
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="border-none text-gray-700 hover:text-gray-900 disabled:opacity-50"
      type="button"
    >
      {children}
    </button>
  );
};
