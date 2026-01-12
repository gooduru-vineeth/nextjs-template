'use client';

import { useEffect, useState } from 'react';

type Webhook = {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
};

type AvailableEvent = {
  event: string;
  description: string;
};

type WebhookManagerProps = {
  onWebhookChange?: () => void;
};

export function WebhookManager({ onWebhookChange }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [availableEvents, setAvailableEvents] = useState<AvailableEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [newUrl, setNewUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const fetchWebhooks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/v1/webhooks');
      const data = await response.json();

      if (data.success) {
        setWebhooks(data.webhooks);
        setAvailableEvents(data.availableEvents || []);
      } else {
        setError(data.error || 'Failed to load webhooks');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching webhooks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCreate = async () => {
    if (!newUrl) {
      setError('URL is required');
      return;
    }

    if (selectedEvents.length === 0) {
      setError('Select at least one event');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          events: selectedEvents,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setWebhooks([...webhooks, {
          id: data.webhook.id,
          url: data.webhook.url,
          events: data.webhook.events,
          enabled: data.webhook.enabled,
          createdAt: data.webhook.createdAt,
        }]);
        setShowSecret(data.webhook.secret);
        setNewUrl('');
        setSelectedEvents([]);
        setIsCreating(false);
        onWebhookChange?.();
      } else {
        setError(data.error || 'Failed to create webhook');
      }
    } catch (err) {
      setError('Failed to create webhook');
      console.error('Error creating webhook:', err);
    }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch('/api/v1/webhooks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled }),
      });

      const data = await response.json();

      if (data.success) {
        setWebhooks(webhooks.map(w =>
          w.id === id ? { ...w, enabled } : w,
        ));
        onWebhookChange?.();
      } else {
        setError(data.error || 'Failed to update webhook');
      }
    } catch (err) {
      setError('Failed to update webhook');
      console.error('Error updating webhook:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/webhooks?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setWebhooks(webhooks.filter(w => w.id !== id));
        onWebhookChange?.();
      } else {
        setError(data.error || 'Failed to delete webhook');
      }
    } catch (err) {
      setError('Failed to delete webhook');
      console.error('Error deleting webhook:', err);
    }
  };

  const copySecret = async () => {
    if (showSecret) {
      await navigator.clipboard.writeText(showSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const eventColors: Record<string, string> = {
    'mockup.created': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'mockup.updated': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'mockup.deleted': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'mockup.exported': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'template.applied': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'api_key.created': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    'api_key.deleted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="size-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Webhooks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Receive real-time notifications when events occur
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          disabled={webhooks.length >= 5}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Webhook
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Secret Modal */}
      {showSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <svg className="size-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Webhook Created!
              </h3>
            </div>

            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Copy your webhook secret below. This is the only time it will be shown.
            </p>

            <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
              <code className="flex-1 text-xs break-all text-gray-800 dark:text-gray-200">
                {showSecret}
              </code>
              <button
                type="button"
                onClick={copySecret}
                className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {copiedSecret
                  ? (
                      <svg className="size-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )
                  : (
                      <svg className="size-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSecret(null)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 font-medium text-gray-900 dark:text-white">Create Webhook</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payload URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={e => setNewUrl(e.target.value)}
                placeholder="https://example.com/webhooks"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Events to subscribe
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableEvents.map(event => (
                  <label
                    key={event.event}
                    className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents([...selectedEvents, event.event]);
                        } else {
                          setSelectedEvents(selectedEvents.filter(ev => ev !== event.event));
                        }
                      }}
                      className="mt-1 size-4 rounded border-gray-300 text-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.event}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewUrl('');
                  setSelectedEvents([]);
                  setError(null);
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Webhook
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks List */}
      {webhooks.length === 0 && !isCreating
        ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
              <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No webhooks</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a webhook to receive real-time event notifications
              </p>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Webhook
              </button>
            </div>
          )
        : (
            <div className="space-y-3">
              {webhooks.map(webhook => (
                <div
                  key={webhook.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <code className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {webhook.url}
                        </code>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          webhook.enabled
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                        >
                          {webhook.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {webhook.events.map(event => (
                          <span
                            key={event}
                            className={`rounded px-1.5 py-0.5 text-xs ${eventColors[event] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Created
                        {' '}
                        {new Date(webhook.createdAt).toLocaleDateString()}
                        {webhook.lastTriggeredAt && (
                          <>
                            {' '}
                            • Last triggered
                            {new Date(webhook.lastTriggeredAt).toLocaleDateString()}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(webhook.id, !webhook.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          webhook.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block size-4 rounded-full bg-white transition-transform ${
                            webhook.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(webhook.id)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

      {/* Usage Info */}
      <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
        <p className="font-medium">Webhook Signature Verification</p>
        <p className="mt-1">
          Each webhook request includes an
          {' '}
          <code className="rounded bg-gray-200 px-1 dark:bg-gray-700">X-Webhook-Signature</code>
          {' '}
          header.
          Verify this signature using HMAC-SHA256 with your secret key to ensure the request is legitimate.
        </p>
      </div>
    </div>
  );
}
