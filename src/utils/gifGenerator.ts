'use client';

import GIF from 'gif.js-upgrade';

export type GifOptions = {
  width: number;
  height: number;
  quality?: number; // 1-30, lower is better quality
  frameDuration?: number; // milliseconds per frame
  repeat?: number; // 0 = loop forever, -1 = no repeat, n = repeat n times
  workers?: number;
};

export type GifFrame = {
  canvas: HTMLCanvasElement;
  delay?: number; // Override duration for this frame
};

/**
 * Generate a GIF from a sequence of canvas frames
 */
export async function generateGif(
  frames: GifFrame[],
  options: GifOptions,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: options.workers ?? 4,
      quality: options.quality ?? 10,
      width: options.width,
      height: options.height,
      repeat: options.repeat ?? 0,
      workerScript: '/gif.worker.js',
    });

    // Add each frame
    for (const frame of frames) {
      gif.addFrame(frame.canvas, {
        delay: frame.delay ?? options.frameDuration ?? 500,
        copy: true,
      });
    }

    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    gif.on('error', (err: Error) => {
      reject(err);
    });

    gif.render();
  });
}

/**
 * Capture a DOM element as a canvas frame
 */
export async function captureFrame(
  element: HTMLElement,
  scale: number = 1,
): Promise<HTMLCanvasElement> {
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: null,
  });

  return canvas;
}

/**
 * Create multiple frames with a typing animation effect
 * Gradually reveals text character by character
 */
export async function createTypingAnimationFrames(
  element: HTMLElement,
  textElements: HTMLElement[],
  scale: number = 1,
  charsPerFrame: number = 3,
): Promise<GifFrame[]> {
  const frames: GifFrame[] = [];

  // Store original text content
  const originalTexts = textElements.map(el => el.textContent || '');

  // Calculate total characters to animate
  const maxLength = Math.max(...originalTexts.map(t => t.length));
  const totalFrames = Math.ceil(maxLength / charsPerFrame);

  for (let i = 0; i <= totalFrames; i++) {
    const charCount = i * charsPerFrame;

    // Update each text element with partial text
    textElements.forEach((el, idx) => {
      const fullText = originalTexts[idx] || '';
      el.textContent = fullText.slice(0, Math.min(charCount, fullText.length));
    });

    // Capture frame
    const canvas = await captureFrame(element, scale);
    frames.push({
      canvas,
      delay: i === totalFrames ? 1500 : 80, // Longer delay on last frame
    });
  }

  // Restore original text
  textElements.forEach((el, idx) => {
    el.textContent = originalTexts[idx] || '';
  });

  return frames;
}

/**
 * Create frames that scroll through content
 */
export async function createScrollAnimationFrames(
  element: HTMLElement,
  scrollContainer: HTMLElement,
  scale: number = 1,
  scrollStep: number = 50,
): Promise<GifFrame[]> {
  const frames: GifFrame[] = [];

  const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const originalScrollTop = scrollContainer.scrollTop;

  // Start from top
  scrollContainer.scrollTop = 0;
  await new Promise(r => setTimeout(r, 50));

  // Capture initial frame with longer delay
  let canvas = await captureFrame(element, scale);
  frames.push({ canvas, delay: 1000 });

  // Scroll through content
  let currentScroll = 0;
  while (currentScroll < maxScroll) {
    currentScroll = Math.min(currentScroll + scrollStep, maxScroll);
    scrollContainer.scrollTop = currentScroll;
    await new Promise(r => setTimeout(r, 50));

    canvas = await captureFrame(element, scale);
    frames.push({ canvas, delay: 100 });
  }

  // Final frame with longer delay
  canvas = await captureFrame(element, scale);
  frames.push({ canvas, delay: 1500 });

  // Restore original scroll position
  scrollContainer.scrollTop = originalScrollTop;

  return frames;
}

/**
 * Create a simple static GIF from a single element
 * (useful for creating GIFs from static mockups)
 */
export async function createStaticGif(
  element: HTMLElement,
  scale: number = 1,
  duration: number = 2000,
): Promise<Blob> {
  const canvas = await captureFrame(element, scale);

  return generateGif(
    [{ canvas, delay: duration }],
    {
      width: canvas.width,
      height: canvas.height,
      quality: 10,
      repeat: 0,
    },
  );
}

/**
 * Create a fade-in animation GIF
 */
export async function createFadeInAnimationFrames(
  element: HTMLElement,
  scale: number = 1,
  steps: number = 10,
): Promise<GifFrame[]> {
  const frames: GifFrame[] = [];
  const originalOpacity = element.style.opacity;

  for (let i = 0; i <= steps; i++) {
    const opacity = i / steps;
    element.style.opacity = opacity.toString();
    await new Promise(r => setTimeout(r, 20));

    const canvas = await captureFrame(element, scale);
    frames.push({
      canvas,
      delay: i === steps ? 1500 : 50,
    });
  }

  // Restore original opacity
  element.style.opacity = originalOpacity;

  return frames;
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
