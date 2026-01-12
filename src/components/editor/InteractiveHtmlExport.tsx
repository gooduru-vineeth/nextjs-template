'use client';

import type { ChatAppearance, ChatMockupData } from '@/types/Mockup';
import { useCallback, useState } from 'react';

type InteractiveHtmlExportProps = {
  mockupRef: React.RefObject<HTMLDivElement | null>;
  mockupData?: ChatMockupData;
  mockupAppearance?: ChatAppearance;
  platform?: string;
  onExport?: () => void;
};

type ExportSettings = {
  theme: 'auto' | 'light' | 'dark';
  includeInteractivity: boolean;
  includeTypingAnimation: boolean;
  includeScrolling: boolean;
  includeHoverEffects: boolean;
  includeClickHandlers: boolean;
  responsiveMode: 'fixed' | 'responsive';
  includeWatermark: boolean;
  customTitle: string;
  customFavicon: boolean;
  minifyCode: boolean;
};

export function InteractiveHtmlExport({
  mockupRef,
  mockupData,
  mockupAppearance,
  platform = 'whatsapp',
  onExport,
}: InteractiveHtmlExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState<ExportSettings>({
    theme: 'auto',
    includeInteractivity: true,
    includeTypingAnimation: true,
    includeScrolling: true,
    includeHoverEffects: true,
    includeClickHandlers: false,
    responsiveMode: 'responsive',
    includeWatermark: false,
    customTitle: 'MockFlow Export',
    customFavicon: true,
    minifyCode: false,
  });

  const generateHtmlContent = useCallback(async () => {
    if (!mockupRef.current) {
      return null;
    }

    // Capture the mockup as a base64 image for fallback
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(mockupRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imageDataUrl = canvas.toDataURL('image/png');

    // Generate CSS styles
    const styles = generateStyles(settings, platform, mockupAppearance);

    // Generate HTML structure
    const htmlStructure = generateHtmlStructure(
      mockupData,
      mockupAppearance,
      platform,
      settings,
      imageDataUrl,
    );

    // Generate JavaScript for interactivity
    const scripts = settings.includeInteractivity
      ? generateInteractiveScripts(settings, mockupData)
      : '';

    // Combine into full HTML document
    const fullHtml = `<!DOCTYPE html>
<html lang="en" data-theme="${settings.theme === 'auto' ? 'light' : settings.theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(settings.customTitle)}</title>
  ${settings.customFavicon ? generateFavicon() : ''}
  <style>
${settings.minifyCode ? minifyCSS(styles) : styles}
  </style>
</head>
<body>
${htmlStructure}
${scripts ? `<script>\n${settings.minifyCode ? minifyJS(scripts) : scripts}\n</script>` : ''}
</body>
</html>`;

    return fullHtml;
  }, [mockupRef, mockupData, mockupAppearance, platform, settings]);

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const htmlContent = await generateHtmlContent();
      if (!htmlContent) {
        throw new Error('Failed to generate HTML content');
      }

      // Create and download the HTML file
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${settings.customTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      onExport?.();
    } catch (error) {
      console.error('HTML export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = async () => {
    setIsExporting(true);

    try {
      const htmlContent = await generateHtmlContent();
      if (!htmlContent) {
        throw new Error('Failed to generate HTML content');
      }

      // Open in new window for preview
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const previewWindow = window.open(url, '_blank');

      // Clean up URL after window loads
      if (previewWindow) {
        previewWindow.onload = () => {
          URL.revokeObjectURL(url);
        };
      }
    } catch (error) {
      console.error('Preview failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Interactive HTML Export
        </h3>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          Beta
        </span>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Export your mockup as a self-contained HTML file with optional interactivity.
      </p>

      {/* Quick Settings */}
      <div className="space-y-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={settings.customTitle}
            onChange={e => setSettings({ ...settings, customTitle: e.target.value })}
            placeholder="MockFlow Export"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['auto', 'light', 'dark'] as const).map(theme => (
              <button
                key={theme}
                type="button"
                onClick={() => setSettings({ ...settings, theme })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  settings.theme === theme
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                {theme === 'auto' ? 'System' : theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Layout Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSettings({ ...settings, responsiveMode: 'responsive' })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                settings.responsiveMode === 'responsive'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              Responsive
            </button>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, responsiveMode: 'fixed' })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                settings.responsiveMode === 'fixed'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              Fixed Size
            </button>
          </div>
        </div>

        {/* Interactivity Toggle */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.includeInteractivity}
            onChange={e => setSettings({ ...settings, includeInteractivity: e.target.checked })}
            className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Include interactive features
          </span>
        </label>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <span>Advanced Settings</span>
        <svg
          className={`size-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Settings Panel */}
      {showAdvanced && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700/50">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Interactive Features
          </h4>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.includeTypingAnimation}
              onChange={e => setSettings({ ...settings, includeTypingAnimation: e.target.checked })}
              disabled={!settings.includeInteractivity}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className={`text-sm ${!settings.includeInteractivity ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              Typing animation on load
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.includeScrolling}
              onChange={e => setSettings({ ...settings, includeScrolling: e.target.checked })}
              disabled={!settings.includeInteractivity}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className={`text-sm ${!settings.includeInteractivity ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              Scrollable message area
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.includeHoverEffects}
              onChange={e => setSettings({ ...settings, includeHoverEffects: e.target.checked })}
              disabled={!settings.includeInteractivity}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className={`text-sm ${!settings.includeInteractivity ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              Hover effects on messages
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.includeClickHandlers}
              onChange={e => setSettings({ ...settings, includeClickHandlers: e.target.checked })}
              disabled={!settings.includeInteractivity}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <span className={`text-sm ${!settings.includeInteractivity ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
              Message click interactions
            </span>
          </label>

          <hr className="my-2 border-gray-200 dark:border-gray-600" />

          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Output Options
          </h4>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.customFavicon}
              onChange={e => setSettings({ ...settings, customFavicon: e.target.checked })}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Include custom favicon
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.includeWatermark}
              onChange={e => setSettings({ ...settings, includeWatermark: e.target.checked })}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Include MockFlow watermark
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.minifyCode}
              onChange={e => setSettings({ ...settings, minifyCode: e.target.checked })}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Minify output code
            </span>
          </label>
        </div>
      )}

      {/* Export Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isExporting}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
            exportSuccess
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isExporting
            ? (
                <>
                  <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              )
            : exportSuccess
              ? (
                  <>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Downloaded!
                  </>
                )
              : (
                  <>
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Export HTML
                  </>
                )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-500">
        Self-contained HTML file with embedded CSS and JavaScript
      </p>
    </div>
  );
}

// Helper functions for HTML generation
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char] || char);
}

function generateFavicon(): string {
  // Simple chat bubble favicon as base64 SVG
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#8B5CF6" rx="20" width="100" height="100"/><path fill="white" d="M25 30h50a5 5 0 015 5v30a5 5 0 01-5 5H55l-5 10-5-10H25a5 5 0 01-5-5V35a5 5 0 015-5z"/></svg>`;
  const base64Favicon = btoa(svgFavicon);
  return `<link rel="icon" href="data:image/svg+xml;base64,${base64Favicon}">`;
}

function generateStyles(
  settings: ExportSettings,
  platform: string,
  appearance?: ChatAppearance,
): string {
  const isDark = settings.theme === 'dark' || (settings.theme === 'auto' && appearance?.theme === 'dark');

  return `
    :root {
      --bg-primary: ${isDark ? '#1a1a1a' : '#f5f5f5'};
      --bg-secondary: ${isDark ? '#2d2d2d' : '#ffffff'};
      --text-primary: ${isDark ? '#ffffff' : '#1a1a1a'};
      --text-secondary: ${isDark ? '#a0a0a0' : '#666666'};
      --bubble-sent: ${getBubbleColor(platform, 'sent', isDark)};
      --bubble-received: ${getBubbleColor(platform, 'received', isDark)};
      --accent-color: ${getAccentColor(platform)};
    }

    @media (prefers-color-scheme: dark) {
      :root[data-theme="auto"] {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #a0a0a0;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mockup-container {
      ${settings.responsiveMode === 'responsive'
        ? 'width: 100%; max-width: 420px; height: 100vh; max-height: 900px;'
        : 'width: 375px; height: 812px;'}
      background: var(--bg-secondary);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
    }

    .header {
      background: var(--accent-color);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .contact-info {
      flex: 1;
    }

    .contact-name {
      font-weight: 600;
      font-size: 16px;
    }

    .contact-status {
      font-size: 12px;
      opacity: 0.8;
    }

    .messages {
      flex: 1;
      padding: 16px;
      overflow-y: ${settings.includeScrolling ? 'auto' : 'hidden'};
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      ${settings.includeHoverEffects ? 'transition: transform 0.2s ease, box-shadow 0.2s ease;' : ''}
    }

    .message.sent {
      align-self: flex-end;
      background: var(--bubble-sent);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.received {
      align-self: flex-start;
      background: var(--bubble-received);
      color: var(--text-primary);
      border-bottom-left-radius: 4px;
    }

    ${settings.includeHoverEffects
      ? `
    .message:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    `
      : ''}

    .message-time {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
      text-align: right;
    }

    .input-area {
      padding: 12px 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .input-field {
      flex: 1;
      padding: 10px 16px;
      border-radius: 24px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: 14px;
      outline: none;
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--accent-color);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ${settings.includeTypingAnimation
      ? `
    .typing-indicator {
      display: inline-flex;
      gap: 4px;
      padding: 12px 16px;
      background: var(--bubble-received);
      border-radius: 16px;
      align-self: flex-start;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-secondary);
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    .message {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.3s ease forwards;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    `
      : ''}

    ${settings.includeWatermark
      ? `
    .watermark {
      position: fixed;
      bottom: 8px;
      right: 8px;
      font-size: 10px;
      opacity: 0.5;
      color: var(--text-secondary);
    }
    `
      : ''}
  `;
}

function getBubbleColor(platform: string, type: 'sent' | 'received', isDark: boolean): string {
  const colors: Record<string, { sent: string; received: string }> = {
    whatsapp: { sent: '#25D366', received: isDark ? '#2d2d2d' : '#e5e5ea' },
    imessage: { sent: '#007AFF', received: isDark ? '#3a3a3c' : '#e5e5ea' },
    messenger: { sent: '#0084FF', received: isDark ? '#3a3a3c' : '#e5e5ea' },
    telegram: { sent: '#2AABEE', received: isDark ? '#2d2d2d' : '#f0f0f0' },
    discord: { sent: '#5865F2', received: isDark ? '#36393f' : '#f2f3f5' },
    slack: { sent: '#4A154B', received: isDark ? '#1a1d21' : '#f8f8f8' },
  };

  return colors[platform]?.[type] || (type === 'sent' ? '#007AFF' : '#e5e5ea');
}

function getAccentColor(platform: string): string {
  const colors: Record<string, string> = {
    whatsapp: '#075E54',
    imessage: '#007AFF',
    messenger: '#0084FF',
    telegram: '#2AABEE',
    discord: '#5865F2',
    slack: '#4A154B',
  };

  return colors[platform] || '#007AFF';
}

function generateHtmlStructure(
  mockupData?: ChatMockupData,
  _appearance?: ChatAppearance,
  _platform?: string,
  settings?: ExportSettings,
  _fallbackImage?: string,
): string {
  if (!mockupData) {
    return '<div class="mockup-container"><p>No data available</p></div>';
  }

  const contact = mockupData.participants.find(p => p.id !== 'user') || mockupData.participants[0];
  const initials = contact?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const messagesHtml = mockupData.messages.map((msg, index) => {
    const isSent = msg.senderId === 'user';
    const delay = settings?.includeTypingAnimation ? index * 0.5 : 0;

    return `
      <div class="message ${isSent ? 'sent' : 'received'}" style="animation-delay: ${delay}s">
        ${escapeHtml(msg.content)}
        <div class="message-time">${escapeHtml(msg.timestamp)}</div>
      </div>
    `;
  }).join('\n');

  return `
    <div class="mockup-container">
      <div class="header">
        <div class="avatar">${initials}</div>
        <div class="contact-info">
          <div class="contact-name">${escapeHtml(contact?.name || 'Contact')}</div>
          <div class="contact-status">${mockupData.lastSeen || 'Online'}</div>
        </div>
      </div>
      <div class="messages">
        ${messagesHtml}
      </div>
      <div class="input-area">
        <input type="text" class="input-field" placeholder="Type a message..." readonly>
        <button class="send-btn">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
    ${settings?.includeWatermark ? '<div class="watermark">Created with MockFlow</div>' : ''}
  `;
}

function generateInteractiveScripts(settings: ExportSettings, _mockupData?: ChatMockupData): string {
  const scripts: string[] = [];

  // Theme detection for auto mode
  if (settings.theme === 'auto') {
    scripts.push(`
      (function() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        });
      })();
    `);
  }

  // Click handlers
  if (settings.includeClickHandlers) {
    scripts.push(`
      document.querySelectorAll('.message').forEach((msg) => {
        msg.addEventListener('click', function() {
          this.style.background = this.classList.contains('sent')
            ? 'var(--accent-color)'
            : 'var(--bg-primary)';
          setTimeout(() => {
            this.style.background = '';
          }, 200);
        });
      });
    `);
  }

  // Scroll to bottom
  if (settings.includeScrolling) {
    scripts.push(`
      document.addEventListener('DOMContentLoaded', function() {
        const messages = document.querySelector('.messages');
        if (messages) {
          messages.scrollTop = messages.scrollHeight;
        }
      });
    `);
  }

  return scripts.join('\n');
}

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*\{\s*/g, '{')
    .replace(/\s*\}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .trim();
}

function minifyJS(js: string): string {
  return js
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default InteractiveHtmlExport;
