// Interactive HTML Export Utility
// Generates standalone HTML files with interactive elements

export type HtmlExportOptions = {
  title?: string;
  includeInteractivity?: boolean;
  responsive?: boolean;
  darkMode?: boolean;
  customCSS?: string;
  includeHoverEffects?: boolean;
  includeClickFeedback?: boolean;
};

/**
 * Generates HTML template for a mockup export
 */
export function generateHtmlExport(
  mockupHtml: string,
  options: HtmlExportOptions = {},
): string {
  const {
    title = 'Mockup Export',
    includeInteractivity = true,
    responsive = true,
    darkMode = false,
    customCSS = '',
    includeHoverEffects = true,
    includeClickFeedback = true,
  } = options;

  const interactiveStyles = includeInteractivity
    ? `
    /* Interactive button styles */
    button, [role="button"], .clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    ${includeHoverEffects
      ? `
    button:hover, [role="button"]:hover, .clickable:hover {
      opacity: 0.85;
      transform: scale(0.98);
    }
    `
      : ''}

    ${includeClickFeedback
      ? `
    button:active, [role="button"]:active, .clickable:active {
      transform: scale(0.95);
    }
    `
      : ''}

    /* Link styles */
    a {
      cursor: pointer;
      transition: color 0.2s ease;
    }

    a:hover {
      opacity: 0.8;
    }

    /* Input focus styles */
    input:focus, textarea:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Message hover effect */
    .message-bubble:hover {
      background-color: rgba(0,0,0,0.05);
    }

    /* Avatar hover effect */
    .avatar:hover {
      transform: scale(1.05);
      transition: transform 0.2s ease;
    }
  `
    : '';

  const responsiveStyles = responsive
    ? `
    /* Responsive container */
    .mockup-container {
      max-width: 100%;
      margin: 0 auto;
      overflow-x: auto;
    }

    @media (max-width: 768px) {
      .mockup-wrapper {
        transform: scale(0.9);
        transform-origin: top center;
      }
    }

    @media (max-width: 480px) {
      .mockup-wrapper {
        transform: scale(0.75);
        transform-origin: top center;
      }
    }
  `
    : '';

  const interactiveScript = includeInteractivity
    ? `
    <script>
      // Interactive functionality
      document.addEventListener('DOMContentLoaded', function() {
        // Add click feedback to buttons
        const buttons = document.querySelectorAll('button, [role="button"], .clickable');
        buttons.forEach(btn => {
          btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = \`
              position: absolute;
              background: rgba(255,255,255,0.3);
              border-radius: 50%;
              transform: scale(0);
              animation: ripple 0.6s linear;
              pointer-events: none;
            \`;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size/2) + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
          });
        });

        // Add tooltip functionality
        const elementsWithTitle = document.querySelectorAll('[data-tooltip]');
        elementsWithTitle.forEach(el => {
          el.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = \`
              position: fixed;
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              z-index: 10000;
              pointer-events: none;
            \`;

            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - 30) + 'px';
            tooltip.style.left = rect.left + 'px';

            document.body.appendChild(tooltip);
            this._tooltip = tooltip;
          });

          el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
              this._tooltip.remove();
              delete this._tooltip;
            }
          });
        });

        console.log('MockFlow Interactive Export loaded');
      });
    </script>
  `
    : '';

  return `<!DOCTYPE html>
<html lang="en" ${darkMode ? 'class="dark"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    /* Reset and base styles */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: ${darkMode ? '#1f2937' : '#f3f4f6'};
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .mockup-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mockup-wrapper {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border-radius: 12px;
      overflow: hidden;
    }

    /* Animation keyframes */
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .mockup-wrapper {
      animation: fadeIn 0.3s ease;
    }

    ${interactiveStyles}
    ${responsiveStyles}

    /* Custom CSS */
    ${customCSS}
  </style>
</head>
<body>
  <div class="mockup-container">
    <div class="mockup-wrapper">
      ${mockupHtml}
    </div>
  </div>

  ${interactiveScript}

  <!-- Generated by MockFlow -->
  <!-- https://mockflow.io -->
</body>
</html>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char] || char);
}

/**
 * Download HTML file
 */
export function downloadHtmlExport(
  mockupHtml: string,
  filename: string = 'mockup-export.html',
  options: HtmlExportOptions = {},
): void {
  const htmlContent = generateHtmlExport(mockupHtml, options);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate HTML preview in new window
 */
export function previewHtmlExport(
  mockupHtml: string,
  options: HtmlExportOptions = {},
): Window | null {
  const htmlContent = generateHtmlExport(mockupHtml, options);
  const previewWindow = window.open('', '_blank');

  if (previewWindow) {
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  }

  return previewWindow;
}
