'use client';

import { useEffect, useState } from 'react';

type SaveMockupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, isPublic: boolean) => Promise<boolean>;
  defaultName?: string;
  isSaving?: boolean;
  isUpdate?: boolean;
};

export function SaveMockupModal({
  isOpen,
  onClose,
  onSave,
  defaultName = '',
  isSaving = false,
  isUpdate = false,
}: SaveMockupModalProps) {
  const [name, setName] = useState(defaultName);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(defaultName);
      setError(null);
    }
  }, [isOpen, defaultName]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a name for your mockup');
      return;
    }

    const success = await onSave(name.trim(), isPublic);
    if (success) {
      onClose();
    } else {
      setError('Failed to save mockup. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isUpdate ? 'Update Mockup' : 'Save Mockup'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Name field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mockup Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="My Awesome Mockup"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                autoFocus
              />
            </div>

            {/* Public toggle */}
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make public
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Anyone with the link can view this mockup
                </p>
              </div>
            </label>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving
                ? (
                    <>
                      <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  )
                : (
                    <>
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {isUpdate ? 'Update' : 'Save to Cloud'}
                    </>
                  )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
