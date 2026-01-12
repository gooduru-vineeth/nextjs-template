'use client';

export type SvgExportSettings = {
  filename?: string;
  scale?: number;
  embedImages?: boolean;
  embedFonts?: boolean;
  optimizeSvg?: boolean;
  includeMetadata?: boolean;
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
  };
  backgroundColor?: string;
  viewBoxPadding?: number;
  preserveAspectRatio?: string;
};

export type SvgExportCallbacks = {
  onProgress?: (progress: number) => void;
  onComplete?: (svgString: string) => void;
  onError?: (error: Error) => void;
};

// Serialize CSS styles for an element
function getComputedStylesCSS(element: Element): string {
  const computed = window.getComputedStyle(element);
  const styles: string[] = [];

  // Important CSS properties to capture
  const importantProps = [
    'font-family',
    'font-size',
    'font-weight',
    'font-style',
    'color',
    'background-color',
    'background-image',
    'border',
    'border-radius',
    'box-shadow',
    'padding',
    'margin',
    'width',
    'height',
    'max-width',
    'max-height',
    'display',
    'flex-direction',
    'justify-content',
    'align-items',
    'position',
    'top',
    'left',
    'right',
    'bottom',
    'opacity',
    'transform',
    'overflow',
    'text-align',
    'line-height',
    'letter-spacing',
  ];

  for (const prop of importantProps) {
    const value = computed.getPropertyValue(prop);
    if (value && value !== 'none' && value !== 'auto' && value !== 'normal') {
      styles.push(`${prop}: ${value}`);
    }
  }

  return styles.join('; ');
}

// Convert HTML element to SVG foreignObject
function elementToForeignObject(element: HTMLElement, width: number, height: number): string {
  const serializer = new XMLSerializer();
  const clone = element.cloneNode(true) as HTMLElement;

  // Inline styles for all elements
  const allElements = clone.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      const styles = getComputedStylesCSS(el);
      if (styles) {
        el.setAttribute('style', styles);
      }
    }
  });

  // Set styles on root element
  const rootStyles = getComputedStylesCSS(element);
  clone.setAttribute('style', rootStyles);

  const htmlContent = serializer.serializeToString(clone);

  return `<foreignObject width="${width}" height="${height}" x="0" y="0">
    <div xmlns="http://www.w3.org/1999/xhtml">
      ${htmlContent}
    </div>
  </foreignObject>`;
}

// Collect and embed fonts used in the element
async function collectFonts(element: HTMLElement): Promise<string> {
  const fontFaces: Set<string> = new Set();

  // Get all unique font families used
  const allElements = element.querySelectorAll('*');
  const fontFamilies: Set<string> = new Set();

  allElements.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const fontFamily = computed.fontFamily;
    if (fontFamily) {
      fontFamily.split(',').forEach((f) => {
        fontFamilies.add(f.trim().replace(/["']/g, ''));
      });
    }
  });

  // Try to get @font-face rules from stylesheets
  try {
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule instanceof CSSFontFaceRule) {
            const fontFamily = rule.style.getPropertyValue('font-family')?.replace(/["']/g, '');
            if (fontFamily && fontFamilies.has(fontFamily)) {
              fontFaces.add(rule.cssText);
            }
          }
        }
      } catch {
        // Skip stylesheets we can't access (cross-origin)
      }
    }
  } catch {
    // Ignore errors when accessing stylesheets
  }

  if (fontFaces.size === 0) {
    return '';
  }

  return `<style type="text/css"><![CDATA[
    ${Array.from(fontFaces).join('\n')}
  ]]></style>`;
}

// Basic SVG optimization
function optimizeSvgString(svgString: string): string {
  return svgString
    // Remove unnecessary whitespace
    .replace(/>\s+</g, '><')
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove empty attributes
    .replace(/\s+[a-z-]+=""/gi, '')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Trim
    .trim();
}

export async function exportToSvg(
  element: HTMLElement,
  settings: SvgExportSettings = {},
  callbacks: SvgExportCallbacks = {},
): Promise<string> {
  const {
    filename = `mockflow-export-${Date.now()}.svg`,
    scale = 1,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    embedImages: _embedImages = true,
    embedFonts = true,
    optimizeSvg = false,
    includeMetadata = true,
    metadata = {},
    backgroundColor,
    viewBoxPadding = 0,
    preserveAspectRatio = 'xMidYMid meet',
  } = settings;

  const { onProgress, onComplete, onError } = callbacks;

  try {
    onProgress?.(10);

    // Get element dimensions
    const rect = element.getBoundingClientRect();
    const width = Math.ceil(rect.width * scale);
    const height = Math.ceil(rect.height * scale);

    onProgress?.(20);

    // Collect fonts if needed
    let fontStyles = '';
    if (embedFonts) {
      fontStyles = await collectFonts(element);
    }

    onProgress?.(30);

    // Use html2canvas for accurate rendering
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: backgroundColor || null,
    });

    onProgress?.(60);

    // Convert canvas to data URI
    const imageDataUri = canvas.toDataURL('image/png');

    onProgress?.(70);

    // Build metadata
    let metadataSection = '';
    if (includeMetadata) {
      metadataSection = `
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>${metadata.title || filename.replace('.svg', '')}</dc:title>
        <dc:description>${metadata.description || 'Exported from MockFlow'}</dc:description>
        <dc:creator>${metadata.author || 'MockFlow'}</dc:creator>
        <dc:date>${new Date().toISOString()}</dc:date>
        <dc:format>image/svg+xml</dc:format>
      </rdf:Description>
    </rdf:RDF>
  </metadata>`;
    }

    onProgress?.(80);

    // Build SVG
    const viewBoxWidth = width + viewBoxPadding * 2;
    const viewBoxHeight = height + viewBoxPadding * 2;

    let svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${viewBoxWidth}"
     height="${viewBoxHeight}"
     viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}"
     preserveAspectRatio="${preserveAspectRatio}">
  ${metadataSection}
  ${fontStyles}
  <defs>
    <style type="text/css"><![CDATA[
      .mockflow-export { image-rendering: optimizeQuality; }
    ]]></style>
  </defs>
  ${backgroundColor ? `<rect width="100%" height="100%" fill="${backgroundColor}"/>` : ''}
  <image class="mockflow-export"
         x="${viewBoxPadding}"
         y="${viewBoxPadding}"
         width="${width}"
         height="${height}"
         xlink:href="${imageDataUri}"/>
</svg>`;

    onProgress?.(90);

    // Optimize if requested
    if (optimizeSvg) {
      svgString = optimizeSvgString(svgString);
    }

    onProgress?.(100);
    onComplete?.(svgString);

    return svgString;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('SVG export failed');
    onError?.(err);
    throw err;
  }
}

export async function exportToSvgNative(
  element: HTMLElement,
  settings: SvgExportSettings = {},
  callbacks: SvgExportCallbacks = {},
): Promise<string> {
  // This version uses foreignObject for native HTML rendering
  // Better for editing in vector tools but may have compatibility issues
  const {
    scale = 1,
    includeMetadata = true,
    metadata = {},
    backgroundColor,
    viewBoxPadding = 0,
    preserveAspectRatio = 'xMidYMid meet',
    optimizeSvg = false,
  } = settings;

  const { onProgress, onComplete, onError } = callbacks;

  try {
    onProgress?.(10);

    const rect = element.getBoundingClientRect();
    const width = Math.ceil(rect.width * scale);
    const height = Math.ceil(rect.height * scale);

    onProgress?.(30);

    // Build metadata
    let metadataSection = '';
    if (includeMetadata) {
      metadataSection = `
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
             xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>${metadata.title || 'MockFlow Export'}</dc:title>
        <dc:description>${metadata.description || 'Exported from MockFlow'}</dc:description>
        <dc:creator>${metadata.author || 'MockFlow'}</dc:creator>
        <dc:date>${new Date().toISOString()}</dc:date>
        <dc:format>image/svg+xml</dc:format>
      </rdf:Description>
    </rdf:RDF>
  </metadata>`;
    }

    onProgress?.(50);

    // Create foreignObject content
    const foreignObjectContent = elementToForeignObject(element, width, height);

    onProgress?.(70);

    // Build SVG
    const viewBoxWidth = width + viewBoxPadding * 2;
    const viewBoxHeight = height + viewBoxPadding * 2;

    let svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${viewBoxWidth}"
     height="${viewBoxHeight}"
     viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}"
     preserveAspectRatio="${preserveAspectRatio}">
  ${metadataSection}
  ${backgroundColor ? `<rect width="100%" height="100%" fill="${backgroundColor}"/>` : ''}
  <g transform="translate(${viewBoxPadding}, ${viewBoxPadding})">
    ${foreignObjectContent}
  </g>
</svg>`;

    onProgress?.(90);

    if (optimizeSvg) {
      svgString = optimizeSvgString(svgString);
    }

    onProgress?.(100);
    onComplete?.(svgString);

    return svgString;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Native SVG export failed');
    onError?.(err);
    throw err;
  }
}

export function downloadSvg(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function svgToBlob(svgString: string): Blob {
  return new Blob([svgString], { type: 'image/svg+xml' });
}
