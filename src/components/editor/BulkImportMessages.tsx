'use client';

import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// Types
type ImportFormat = 'csv' | 'json' | 'txt';
type ImportStatus = 'idle' | 'parsing' | 'preview' | 'importing' | 'success' | 'error';
type ImportVariant = 'full' | 'compact' | 'modal';

type MessageRow = {
  id: string;
  sender: string;
  content: string;
  timestamp?: string;
  type?: 'sent' | 'received';
  isValid: boolean;
  errors?: string[];
};

type ImportMapping = {
  sender: string;
  content: string;
  timestamp?: string;
  type?: string;
};

type ImportResult = {
  total: number;
  successful: number;
  failed: number;
  errors: string[];
};

export type BulkImportMessagesProps = {
  variant?: ImportVariant;
  onImport?: (messages: MessageRow[]) => void;
  onCancel?: () => void;
  maxMessages?: number;
  className?: string;
};

// Sample CSV template
const csvTemplate = `sender,content,timestamp,type
John,Hey! How are you?,2024-01-12 10:30,received
Me,I'm doing great! Thanks for asking.,2024-01-12 10:31,sent
John,Want to grab lunch later?,2024-01-12 10:32,received
Me,Sure! What time?,2024-01-12 10:33,sent`;

// Sample JSON template
const jsonTemplate = `[
  {
    "sender": "John",
    "content": "Hey! How are you?",
    "timestamp": "2024-01-12 10:30",
    "type": "received"
  },
  {
    "sender": "Me",
    "content": "I'm doing great! Thanks for asking.",
    "timestamp": "2024-01-12 10:31",
    "type": "sent"
  }
]`;

export default function BulkImportMessages({
  variant = 'full',
  onImport,
  onCancel,
  maxMessages = 100,
  className = '',
}: BulkImportMessagesProps) {
  const [importFormat, setImportFormat] = useState<ImportFormat>('csv');
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [rawContent, setRawContent] = useState('');
  const [parsedMessages, setParsedMessages] = useState<MessageRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [mapping, _setMapping] = useState<ImportMapping>({
    sender: 'sender',
    content: 'content',
    timestamp: 'timestamp',
    type: 'type',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suppress unused variable warning - available for future use
  void _setMapping;

  const parseCSV = useCallback((content: string): MessageRow[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      setErrors(['CSV must have a header row and at least one data row']);
      return [];
    }

    const headers = lines[0]!.split(',').map(h => h.trim().toLowerCase());
    const messages: MessageRow[] = [];
    const parseErrors: string[] = [];

    for (let i = 1; i < lines.length && i <= maxMessages; i++) {
      const values = lines[i]!.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const senderValue = row[mapping.sender] || '';
      const contentValue = row[mapping.content] || '';
      const rowErrors: string[] = [];

      if (!senderValue) {
        rowErrors.push('Missing sender');
      }
      if (!contentValue) {
        rowErrors.push('Missing content');
      }

      messages.push({
        id: `import-${i}`,
        sender: senderValue,
        content: contentValue,
        timestamp: row[mapping.timestamp || ''] || undefined,
        type: (row[mapping.type || ''] as 'sent' | 'received') || 'received',
        isValid: rowErrors.length === 0,
        errors: rowErrors.length > 0 ? rowErrors : undefined,
      });

      if (rowErrors.length > 0) {
        parseErrors.push(`Row ${i}: ${rowErrors.join(', ')}`);
      }
    }

    setErrors(parseErrors);
    return messages;
  }, [mapping, maxMessages]);

  const parseJSON = useCallback((content: string): MessageRow[] => {
    try {
      const data = JSON.parse(content);
      if (!Array.isArray(data)) {
        setErrors(['JSON must be an array of message objects']);
        return [];
      }

      const messages: MessageRow[] = [];
      const parseErrors: string[] = [];

      data.slice(0, maxMessages).forEach((item: Record<string, string>, index: number) => {
        const senderValue = item[mapping.sender] || '';
        const contentValue = item[mapping.content] || '';
        const rowErrors: string[] = [];

        if (!senderValue) {
          rowErrors.push('Missing sender');
        }
        if (!contentValue) {
          rowErrors.push('Missing content');
        }

        messages.push({
          id: `import-${index}`,
          sender: senderValue,
          content: contentValue,
          timestamp: item[mapping.timestamp || ''] || undefined,
          type: (item[mapping.type || ''] as 'sent' | 'received') || 'received',
          isValid: rowErrors.length === 0,
          errors: rowErrors.length > 0 ? rowErrors : undefined,
        });

        if (rowErrors.length > 0) {
          parseErrors.push(`Item ${index + 1}: ${rowErrors.join(', ')}`);
        }
      });

      setErrors(parseErrors);
      return messages;
    } catch {
      setErrors(['Invalid JSON format']);
      return [];
    }
  }, [mapping, maxMessages]);

  const parseTXT = useCallback((content: string): MessageRow[] => {
    const lines = content.trim().split('\n');
    const messages: MessageRow[] = [];

    lines.slice(0, maxMessages).forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        return;
      }

      // Try to parse "Sender: Message" format
      const colonIndex = trimmedLine.indexOf(':');
      let sender = 'Unknown';
      let messageContent = trimmedLine;

      if (colonIndex > 0 && colonIndex < 30) {
        sender = trimmedLine.substring(0, colonIndex).trim();
        messageContent = trimmedLine.substring(colonIndex + 1).trim();
      }

      messages.push({
        id: `import-${index}`,
        sender,
        content: messageContent,
        type: 'received',
        isValid: true,
      });
    });

    return messages;
  }, [maxMessages]);

  const handleParse = useCallback(() => {
    setStatus('parsing');
    let messages: MessageRow[] = [];

    switch (importFormat) {
      case 'csv':
        messages = parseCSV(rawContent);
        break;
      case 'json':
        messages = parseJSON(rawContent);
        break;
      case 'txt':
        messages = parseTXT(rawContent);
        break;
    }

    setParsedMessages(messages);
    setStatus(messages.length > 0 ? 'preview' : 'error');
  }, [importFormat, rawContent, parseCSV, parseJSON, parseTXT]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawContent(content);

      // Auto-detect format
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'csv') {
        setImportFormat('csv');
      } else if (ext === 'json') {
        setImportFormat('json');
      } else {
        setImportFormat('txt');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleImport = useCallback(() => {
    setStatus('importing');
    const validMessages = parsedMessages.filter(m => m.isValid);
    onImport?.(validMessages);
    setStatus('success');
  }, [parsedMessages, onImport]);

  const handleDownloadTemplate = useCallback(() => {
    const content = importFormat === 'json' ? jsonTemplate : csvTemplate;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `message-template.${importFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [importFormat]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setRawContent('');
    setParsedMessages([]);
    setErrors([]);
  }, []);

  const validCount = parsedMessages.filter(m => m.isValid).length;
  const invalidCount = parsedMessages.filter(m => !m.isValid).length;

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <Upload className="h-4 w-4" />
            Import Messages
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            {(['csv', 'json', 'txt'] as ImportFormat[]).map(format => (
              <button
                key={format}
                onClick={() => setImportFormat(format)}
                className={`rounded px-3 py-1 text-sm uppercase ${
                  importFormat === format
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {format}
              </button>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 py-6 text-gray-500 hover:border-blue-400 hover:text-blue-500 dark:border-gray-700"
          >
            <Upload className="mx-auto mb-2 h-6 w-6" />
            <span className="text-sm">Click to upload file</span>
          </button>

          {rawContent && (
            <button
              onClick={handleParse}
              className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              Parse & Preview
            </button>
          )}
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className={`max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-gray-900 ${className}`}>
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Import Messages</h3>
            <button
              onClick={onCancel}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {status === 'idle' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['csv', 'json', 'txt'] as ImportFormat[]).map(format => (
                    <button
                      key={format}
                      onClick={() => setImportFormat(format)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                        importFormat === format
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {format === 'csv' ? <FileSpreadsheet className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      <span className="uppercase">{format}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  value={rawContent}
                  onChange={e => setRawContent(e.target.value)}
                  placeholder={`Paste your ${importFormat.toUpperCase()} data here...`}
                  className="h-48 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <div className="flex justify-between">
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Download className="h-4 w-4" />
                    Download template
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:underline dark:text-gray-400"
                  >
                    <Upload className="h-4 w-4" />
                    Upload file
                  </button>
                </div>
              </div>
            )}

            {status === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Found
                      {' '}
                      <span className="font-medium text-gray-900 dark:text-white">{parsedMessages.length}</span>
                      {' '}
                      messages
                    </p>
                    {invalidCount > 0 && (
                      <p className="text-sm text-red-500">
                        {invalidCount}
                        {' '}
                        messages have errors
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  {parsedMessages.map(message => (
                    <div
                      key={message.id}
                      className={`border-b border-gray-200 p-3 last:border-0 dark:border-gray-800 ${
                        !message.isValid ? 'bg-red-50 dark:bg-red-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {message.sender}
                          </p>
                          <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                            {message.content}
                          </p>
                        </div>
                        {message.isValid
                          ? (
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                            )
                          : (
                              <span title={message.errors?.join(', ')}>
                                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                              </span>
                            )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">Import Successful!</p>
                <p className="mt-1 text-sm text-gray-500">
                  {validCount}
                  {' '}
                  messages have been imported
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 p-4 dark:border-gray-800">
            <button
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            {status === 'idle' && (
              <button
                onClick={handleParse}
                disabled={!rawContent}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Preview
              </button>
            )}
            {status === 'preview' && (
              <button
                onClick={handleImport}
                disabled={validCount === 0}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Import
                {' '}
                {validCount}
                {' '}
                Messages
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {status === 'success' && (
              <button
                onClick={onCancel}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Upload className="h-5 w-5" />
          Bulk Import Messages
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Import messages from CSV, JSON, or plain text files
        </p>
      </div>

      {/* Format selector */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Select Format</p>
        <div className="grid grid-cols-3 gap-3">
          {([
            { format: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Spreadsheet format' },
            { format: 'json', label: 'JSON', icon: FileText, desc: 'Structured data' },
            { format: 'txt', label: 'Plain Text', icon: FileText, desc: 'Simple text format' },
          ] as const).map(({ format, label, icon: Icon, desc }) => (
            <button
              key={format}
              onClick={() => setImportFormat(format)}
              className={`rounded-lg border-2 p-4 text-left transition-colors ${
                importFormat === format
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
            >
              <Icon className={`mb-2 h-6 w-6 ${importFormat === format ? 'text-blue-600' : 'text-gray-400'}`} />
              <p className="font-medium text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-800">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Input</p>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <Download className="h-4 w-4" />
              Template
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
        </div>

        <textarea
          value={rawContent}
          onChange={e => setRawContent(e.target.value)}
          placeholder={`Paste your ${importFormat.toUpperCase()} data here...\n\n${importFormat === 'csv' ? csvTemplate : importFormat === 'json' ? jsonTemplate : 'Sender: Message content'}`}
          className="h-48 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />

        {errors.length > 0 && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="mb-1 text-sm font-medium text-red-700 dark:text-red-400">Parsing Errors</p>
            <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
              {errors.slice(0, 5).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
              {errors.length > 5 && (
                <li>
                  ...and
                  {errors.length - 5}
                  {' '}
                  more errors
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Preview */}
      {status === 'preview' && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview (
              {validCount}
              {' '}
              valid,
              {' '}
              {invalidCount}
              {' '}
              invalid)
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
            {parsedMessages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-3 border-b border-gray-200 p-3 last:border-0 dark:border-gray-800 ${
                  !message.isValid ? 'bg-red-50 dark:bg-red-900/10' : ''
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  message.type === 'sent' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                }`}
                >
                  {message.sender.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{message.sender}</p>
                    {message.timestamp && (
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{message.content}</p>
                  {message.errors && (
                    <p className="mt-1 text-xs text-red-500">{message.errors.join(', ')}</p>
                  )}
                </div>
                {message.isValid
                  ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                    )
                  : (
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                    )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between p-4">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          {status === 'idle' && (
            <button
              onClick={handleParse}
              disabled={!rawContent}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          )}
          {status === 'preview' && (
            <button
              onClick={handleImport}
              disabled={validCount === 0}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Import
              {' '}
              {validCount}
              {' '}
              Messages
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export type { ImportFormat, ImportMapping, ImportResult, ImportStatus, ImportVariant, MessageRow };
