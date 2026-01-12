'use client';

import type { ChatMessage, Participant } from '@/types/Mockup';
import { useState } from 'react';

type ImportMessagesProps = {
  participants: Participant[];
  currentUserId: string;
  onImport: (messages: ChatMessage[]) => void;
  onClose: () => void;
};

type ImportedMessage = {
  sender?: string;
  senderId?: string;
  content: string;
  timestamp?: string;
  status?: string;
  type?: string;
};

export function ImportMessages({
  participants,
  currentUserId,
  onImport,
  onClose,
}: ImportMessagesProps) {
  const [importType, setImportType] = useState<'json' | 'csv'>('json');
  const [rawInput, setRawInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportedMessage[]>([]);

  const sampleJson = JSON.stringify([
    { sender: 'contact', content: 'Hello!', timestamp: '10:00 AM' },
    { sender: 'user', content: 'Hi there!', timestamp: '10:01 AM' },
    { sender: 'contact', content: 'How are you?', timestamp: '10:02 AM' },
  ], null, 2);

  const sampleCsv = `sender,content,timestamp
contact,Hello!,10:00 AM
user,Hi there!,10:01 AM
contact,How are you?,10:02 AM`;

  const parseJson = (input: string): ImportedMessage[] => {
    const data = JSON.parse(input);
    if (!Array.isArray(data)) {
      throw new TypeError('JSON must be an array of messages');
    }
    return data.map((item: Record<string, unknown>) => ({
      sender: String(item.sender || ''),
      senderId: String(item.senderId || ''),
      content: String(item.content || item.message || item.text || ''),
      timestamp: String(item.timestamp || item.time || ''),
      status: String(item.status || 'read'),
      type: String(item.type || 'text'),
    }));
  };

  const parseCsv = (input: string): ImportedMessage[] => {
    const lines = input.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0]!.split(',').map(h => h.trim().toLowerCase());
    const contentIndex = headers.findIndex(h => ['content', 'message', 'text'].includes(h));
    const senderIndex = headers.findIndex(h => ['sender', 'senderid', 'from'].includes(h));
    const timestampIndex = headers.findIndex(h => ['timestamp', 'time', 'date'].includes(h));
    const statusIndex = headers.indexOf('status');
    const typeIndex = headers.indexOf('type');

    if (contentIndex === -1) {
      throw new Error('CSV must have a "content", "message", or "text" column');
    }

    return lines.slice(1).filter(line => line.trim()).map((line) => {
      // Simple CSV parsing (doesn't handle quoted commas)
      const values = line.split(',').map(v => v.trim());
      return {
        sender: senderIndex >= 0 ? values[senderIndex] : '',
        content: values[contentIndex] || '',
        timestamp: timestampIndex >= 0 ? values[timestampIndex] : '',
        status: statusIndex >= 0 ? values[statusIndex] : 'read',
        type: typeIndex >= 0 ? values[typeIndex] : 'text',
      };
    });
  };

  const handleParse = () => {
    setError(null);
    try {
      const parsed = importType === 'json' ? parseJson(rawInput) : parseCsv(rawInput);
      if (parsed.length === 0) {
        throw new Error('No messages found in input');
      }
      setPreview(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse input');
      setPreview([]);
    }
  };

  const handleImport = () => {
    const messages: ChatMessage[] = preview.map((msg, index) => {
      // Map sender name to participant ID
      let senderId = msg.senderId || '';
      if (!senderId && msg.sender) {
        const senderLower = msg.sender.toLowerCase();
        if (senderLower === 'user' || senderLower === 'you' || senderLower === 'me') {
          senderId = currentUserId;
        } else {
          const participant = participants.find(
            p => p.name.toLowerCase() === senderLower || p.id.toLowerCase() === senderLower,
          );
          senderId = participant?.id || participants[1]?.id || 'contact';
        }
      }
      if (!senderId) {
        senderId = index % 2 === 0 ? (participants[1]?.id || 'contact') : currentUserId;
      }

      return {
        id: `imported-${Date.now()}-${index}`,
        senderId,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: (msg.status as ChatMessage['status']) || 'read',
        type: (msg.type as ChatMessage['type']) || 'text',
      };
    });

    onImport(messages);
  };

  const loadSample = () => {
    setRawInput(importType === 'json' ? sampleJson : sampleCsv);
    setError(null);
    setPreview([]);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Import Messages
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Import Type Selection */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setImportType('json')}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium ${
            importType === 'json'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => setImportType('csv')}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium ${
            importType === 'csv'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          CSV
        </button>
      </div>

      {/* Input Area */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste your
            {' '}
            {importType.toUpperCase()}
            {' '}
            data
          </label>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={rawInput}
          onChange={e => setRawInput(e.target.value)}
          rows={8}
          placeholder={importType === 'json' ? sampleJson : sampleCsv}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Parse Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleParse}
          disabled={!rawInput.trim()}
          className="w-full rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Preview Messages
        </button>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview (
            {preview.length}
            {' '}
            messages)
          </h4>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-600">
            {preview.map((msg, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1 text-sm dark:bg-gray-700"
              >
                <span className="font-medium text-blue-600">
                  {msg.sender || 'Unknown'}
                </span>
                <span className="text-gray-400">:</span>
                <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
                  {msg.content}
                </span>
                {msg.timestamp && (
                  <span className="text-xs text-gray-400">{msg.timestamp}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={preview.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Import
          {' '}
          {preview.length > 0 ? `${preview.length} Messages` : ''}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        <p className="font-medium">Supported fields:</p>
        <ul className="mt-1 list-inside list-disc">
          <li>
            <strong>sender</strong>
            : Use "user" or participant name (required)
          </li>
          <li>
            <strong>content/message/text</strong>
            : Message text (required)
          </li>
          <li>
            <strong>timestamp</strong>
            : Time display (optional)
          </li>
          <li>
            <strong>status</strong>
            : sent, delivered, read (optional)
          </li>
          <li>
            <strong>type</strong>
            : text, image, voice, video (optional)
          </li>
        </ul>
      </div>
    </div>
  );
}
