'use client';

export type PdfExportSettings = {
  filename?: string;
  scale?: number;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'letter' | 'legal' | 'a3' | 'custom';
  customWidth?: number;
  customHeight?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  quality?: number;
  includeMetadata?: boolean;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
  };
  fitToPage?: boolean;
  centerOnPage?: boolean;
  backgroundColor?: string;
};

export type PdfExportCallbacks = {
  onProgress?: (progress: number) => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
};

// Page size dimensions in mm
const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
  a3: { width: 297, height: 420 },
};

export async function exportToPdf(
  element: HTMLElement,
  settings: PdfExportSettings = {},
  callbacks: PdfExportCallbacks = {},
): Promise<Blob> {
  const {
    filename = `mockflow-export-${Date.now()}.pdf`,
    scale = 2,
    orientation = 'portrait',
    pageSize = 'a4',
    customWidth,
    customHeight,
    margins = { top: 10, right: 10, bottom: 10, left: 10 },
    quality = 0.92,
    includeMetadata = true,
    metadata = {},
    fitToPage = true,
    centerOnPage = true,
    backgroundColor,
  } = settings;

  const { onProgress, onComplete, onError } = callbacks;

  try {
    onProgress?.(10);

    // Dynamic import html2canvas
    const html2canvas = (await import('html2canvas')).default;

    onProgress?.(20);

    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: backgroundColor || null,
    });

    onProgress?.(50);

    // Get page dimensions
    let pageWidth: number;
    let pageHeight: number;

    if (pageSize === 'custom' && customWidth && customHeight) {
      pageWidth = customWidth;
      pageHeight = customHeight;
    } else {
      const size = PAGE_SIZES[pageSize] ?? PAGE_SIZES.a4;
      if (orientation === 'landscape') {
        pageWidth = size!.height;
        pageHeight = size!.width;
      } else {
        pageWidth = size!.width;
        pageHeight = size!.height;
      }
    }

    // Calculate available space after margins
    const availableWidth = pageWidth - margins.left - margins.right;
    const availableHeight = pageHeight - margins.top - margins.bottom;

    // Get image dimensions in mm (convert from pixels assuming 96 DPI)
    const imgWidthMm = (canvas.width / scale) * (25.4 / 96);
    const imgHeightMm = (canvas.height / scale) * (25.4 / 96);

    // Calculate scale factor if fitToPage is enabled
    let scaleFactor = 1;
    if (fitToPage) {
      const widthRatio = availableWidth / imgWidthMm;
      const heightRatio = availableHeight / imgHeightMm;
      scaleFactor = Math.min(widthRatio, heightRatio, 1); // Don't scale up, only down
    }

    const finalWidth = imgWidthMm * scaleFactor;
    const finalHeight = imgHeightMm * scaleFactor;

    // Calculate position
    let x = margins.left;
    let y = margins.top;

    if (centerOnPage) {
      x = margins.left + (availableWidth - finalWidth) / 2;
      y = margins.top + (availableHeight - finalHeight) / 2;
    }

    onProgress?.(60);

    // Get image data
    const imgData = canvas.toDataURL('image/jpeg', quality);

    onProgress?.(70);

    // Dynamic import jsPDF
    const { jsPDF } = await import('jspdf');

    // Create PDF document
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize === 'custom' ? [pageWidth, pageHeight] : pageSize,
    });

    // Add metadata if enabled
    if (includeMetadata) {
      pdf.setDocumentProperties({
        title: metadata.title || filename.replace('.pdf', ''),
        author: metadata.author || 'MockFlow',
        subject: metadata.subject || 'Mockup Export',
        keywords: metadata.keywords?.join(', ') || 'mockup, design, mockflow',
        creator: metadata.creator || 'MockFlow Export',
      });
    }

    onProgress?.(80);

    // Add image to PDF
    pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

    onProgress?.(90);

    // Generate blob
    const blob = pdf.output('blob');

    onProgress?.(100);
    onComplete?.(blob);

    return blob;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('PDF export failed');
    onError?.(err);
    throw err;
  }
}

export async function exportMultiPagePdf(
  elements: HTMLElement[],
  settings: PdfExportSettings = {},
  callbacks: PdfExportCallbacks = {},
): Promise<Blob> {
  const {
    filename = `mockflow-export-${Date.now()}.pdf`,
    scale = 2,
    orientation = 'portrait',
    pageSize = 'a4',
    customWidth,
    customHeight,
    margins = { top: 10, right: 10, bottom: 10, left: 10 },
    quality = 0.92,
    includeMetadata = true,
    metadata = {},
    fitToPage = true,
    centerOnPage = true,
    backgroundColor,
  } = settings;

  const { onProgress, onComplete, onError } = callbacks;

  try {
    const totalSteps = elements.length + 2;
    let currentStep = 0;

    onProgress?.(Math.round((currentStep / totalSteps) * 100));

    // Dynamic imports
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    currentStep++;
    onProgress?.(Math.round((currentStep / totalSteps) * 100));

    // Get page dimensions
    let pageWidth: number;
    let pageHeight: number;

    if (pageSize === 'custom' && customWidth && customHeight) {
      pageWidth = customWidth;
      pageHeight = customHeight;
    } else {
      const size = PAGE_SIZES[pageSize] ?? PAGE_SIZES.a4;
      if (orientation === 'landscape') {
        pageWidth = size!.height;
        pageHeight = size!.width;
      } else {
        pageWidth = size!.width;
        pageHeight = size!.height;
      }
    }

    const availableWidth = pageWidth - margins.left - margins.right;
    const availableHeight = pageHeight - margins.top - margins.bottom;

    // Create PDF document
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize === 'custom' ? [pageWidth, pageHeight] : pageSize,
    });

    // Add metadata if enabled
    if (includeMetadata) {
      pdf.setDocumentProperties({
        title: metadata.title || filename.replace('.pdf', ''),
        author: metadata.author || 'MockFlow',
        subject: metadata.subject || 'Mockup Export',
        keywords: metadata.keywords?.join(', ') || 'mockup, design, mockflow',
        creator: metadata.creator || 'MockFlow Export',
      });
    }

    // Process each element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (!element) {
        continue;
      }

      // Add new page for all except first
      if (i > 0) {
        pdf.addPage();
      }

      // Capture element as canvas
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: backgroundColor || null,
      });

      // Get image dimensions in mm
      const imgWidthMm = (canvas.width / scale) * (25.4 / 96);
      const imgHeightMm = (canvas.height / scale) * (25.4 / 96);

      // Calculate scale factor
      let scaleFactor = 1;
      if (fitToPage) {
        const widthRatio = availableWidth / imgWidthMm;
        const heightRatio = availableHeight / imgHeightMm;
        scaleFactor = Math.min(widthRatio, heightRatio, 1);
      }

      const finalWidth = imgWidthMm * scaleFactor;
      const finalHeight = imgHeightMm * scaleFactor;

      // Calculate position
      let x = margins.left;
      let y = margins.top;

      if (centerOnPage) {
        x = margins.left + (availableWidth - finalWidth) / 2;
        y = margins.top + (availableHeight - finalHeight) / 2;
      }

      // Get image data
      const imgData = canvas.toDataURL('image/jpeg', quality);

      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

      currentStep++;
      onProgress?.(Math.round((currentStep / totalSteps) * 100));
    }

    // Generate blob
    const blob = pdf.output('blob');

    currentStep++;
    onProgress?.(100);
    onComplete?.(blob);

    return blob;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Multi-page PDF export failed');
    onError?.(err);
    throw err;
  }
}

export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
