'use client';

import html2canvas from 'html2canvas';

export type GifEncoderSettings = {
  animation: 'typing' | 'reveal' | 'scroll' | 'none';
  frameDuration: number; // ms per frame
  quality: 'low' | 'medium' | 'high';
  width: number;
  loop: boolean;
};

type GifEncoderCallbacks = {
  onProgress?: (progress: number, status: string) => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
};

// Quality settings mapped to gif.js parameters
const qualityMap = {
  low: { quality: 20, workers: 2, dither: false },
  medium: { quality: 10, workers: 4, dither: false },
  high: { quality: 1, workers: 4, dither: true },
};

/**
 * Captures a single frame from a DOM element
 */
async function captureFrame(
  element: HTMLElement,
  width: number,
): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    width,
    scale: width / element.offsetWidth,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });
  return canvas;
}

/**
 * Creates message reveal animation frames
 */
async function createRevealFrames(
  mockupElement: HTMLElement,
  messageSelector: string,
  width: number,
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  const frames: HTMLCanvasElement[] = [];
  const messages = mockupElement.querySelectorAll(messageSelector);
  const totalMessages = messages.length;

  // Store original visibility states
  const originalStates = Array.from(messages).map((msg) => {
    const el = msg as HTMLElement;
    return { element: el, display: el.style.display, opacity: el.style.opacity };
  });

  // Hide all messages initially
  messages.forEach((msg) => {
    const el = msg as HTMLElement;
    el.style.opacity = '0';
  });

  // Capture initial frame (empty or with header only)
  onProgress(5, 'Capturing initial frame...');
  frames.push(await captureFrame(mockupElement, width));

  // Reveal messages one by one
  for (let i = 0; i < totalMessages; i++) {
    const msg = messages[i] as HTMLElement;
    msg.style.opacity = '1';

    const progress = 10 + ((i + 1) / totalMessages) * 70;
    onProgress(progress, `Capturing message ${i + 1}/${totalMessages}...`);

    frames.push(await captureFrame(mockupElement, width));
  }

  // Capture final frame with slight delay appearance
  onProgress(85, 'Capturing final frame...');
  frames.push(await captureFrame(mockupElement, width));

  // Restore original states
  originalStates.forEach(({ element, opacity }) => {
    element.style.opacity = opacity || '1';
  });

  return frames;
}

/**
 * Creates typing animation frames (character by character reveal)
 */
async function createTypingFrames(
  mockupElement: HTMLElement,
  messageSelector: string,
  width: number,
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  const frames: HTMLCanvasElement[] = [];
  const messages = mockupElement.querySelectorAll(messageSelector);
  const totalMessages = messages.length;

  // Store original content
  const originalContent = Array.from(messages).map((msg) => {
    const el = msg as HTMLElement;
    const textEl = el.querySelector('[data-message-content]') || el;
    return {
      element: el,
      textElement: textEl as HTMLElement,
      originalText: textEl.textContent || '',
      opacity: el.style.opacity,
    };
  });

  // Hide all messages initially
  messages.forEach((msg) => {
    const el = msg as HTMLElement;
    el.style.opacity = '0';
  });

  // Capture initial frame
  onProgress(5, 'Capturing initial frame...');
  frames.push(await captureFrame(mockupElement, width));

  // Type out each message
  for (let i = 0; i < totalMessages; i++) {
    const { element, textElement, originalText } = originalContent[i]!;
    element.style.opacity = '1';

    // For typing effect, show message appearing with typing cursor
    const textLength = originalText.length;
    const steps = Math.min(textLength, 5); // Limit steps for performance

    for (let step = 1; step <= steps; step++) {
      const charIndex = Math.floor((step / steps) * textLength);
      textElement.textContent = `${originalText.substring(0, charIndex)}▌`;

      const progress = 10 + ((i * steps + step) / (totalMessages * steps)) * 70;
      onProgress(progress, `Typing message ${i + 1}/${totalMessages}...`);

      frames.push(await captureFrame(mockupElement, width));
    }

    // Final frame for this message (without cursor)
    textElement.textContent = originalText;
    frames.push(await captureFrame(mockupElement, width));
  }

  // Restore original content
  originalContent.forEach(({ element, textElement, originalText, opacity }) => {
    textElement.textContent = originalText;
    element.style.opacity = opacity || '1';
  });

  return frames;
}

/**
 * Creates scroll animation frames
 */
async function createScrollFrames(
  mockupElement: HTMLElement,
  width: number,
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  const frames: HTMLCanvasElement[] = [];
  const scrollContainer = mockupElement.querySelector('[data-scroll-container]') || mockupElement;
  const scrollEl = scrollContainer as HTMLElement;

  const originalScrollTop = scrollEl.scrollTop;
  const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
  const scrollSteps = 10;

  onProgress(5, 'Starting scroll animation...');

  // Scroll from top to bottom
  for (let step = 0; step <= scrollSteps; step++) {
    scrollEl.scrollTop = (step / scrollSteps) * maxScroll;

    const progress = 10 + (step / scrollSteps) * 80;
    onProgress(progress, `Scrolling ${Math.round((step / scrollSteps) * 100)}%...`);

    // Small delay to ensure scroll has rendered
    await new Promise(resolve => setTimeout(resolve, 50));
    frames.push(await captureFrame(mockupElement, width));
  }

  // Restore original scroll position
  scrollEl.scrollTop = originalScrollTop;

  return frames;
}

/**
 * Creates a static single frame
 */
async function createStaticFrame(
  mockupElement: HTMLElement,
  width: number,
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  onProgress(50, 'Capturing frame...');
  const frame = await captureFrame(mockupElement, width);
  return [frame];
}

/**
 * Main GIF encoder function
 */
export async function encodeGif(
  mockupElement: HTMLElement,
  settings: GifEncoderSettings,
  callbacks: GifEncoderCallbacks = {},
): Promise<Blob> {
  const { onProgress = () => {}, onComplete, onError } = callbacks;
  const qualitySettings = qualityMap[settings.quality];

  // Message selector for finding chat messages
  const messageSelector = '[data-message], .message-bubble, .chat-message';

  try {
    onProgress(0, 'Initializing...');

    // Dynamically import gif.js to avoid SSR issues
    const GIF = (await import('gif.js-upgrade')).default;

    // Create frames based on animation type
    let frames: HTMLCanvasElement[];

    switch (settings.animation) {
      case 'reveal':
        frames = await createRevealFrames(mockupElement, messageSelector, settings.width, onProgress);
        break;
      case 'typing':
        frames = await createTypingFrames(mockupElement, messageSelector, settings.width, onProgress);
        break;
      case 'scroll':
        frames = await createScrollFrames(mockupElement, settings.width, onProgress);
        break;
      case 'none':
      default:
        frames = await createStaticFrame(mockupElement, settings.width, onProgress);
        break;
    }

    if (frames.length === 0) {
      throw new Error('No frames captured');
    }

    onProgress(90, 'Encoding GIF...');

    // Create GIF encoder
    const gif = new GIF({
      workers: qualitySettings.workers,
      quality: qualitySettings.quality,
      width: frames[0]!.width,
      height: frames[0]!.height,
      workerScript: '/gif.worker.js',
      dither: qualitySettings.dither,
      repeat: settings.loop ? 0 : -1, // 0 = loop forever, -1 = no loop
    });

    // Add frames
    frames.forEach((frame, index) => {
      // Last frame stays longer
      const delay = index === frames.length - 1
        ? settings.frameDuration * 2
        : settings.frameDuration;
      gif.addFrame(frame, { delay, copy: true });
    });

    // Return promise that resolves with the blob
    return new Promise((resolve, _reject) => {
      gif.on('finished', (blob: Blob) => {
        onProgress(100, 'Complete!');
        onComplete?.(blob);
        resolve(blob);
      });

      gif.on('progress', (p: number) => {
        onProgress(90 + p * 10, 'Encoding GIF...');
      });

      gif.render();
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error('GIF encoding failed');
    onError?.(err);
    throw err;
  }
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Estimates the output file size
 */
export function estimateGifSize(
  messageCount: number,
  settings: GifEncoderSettings,
): string {
  let frameCount: number;

  switch (settings.animation) {
    case 'typing':
      frameCount = messageCount * 5 + 2; // ~5 frames per message + start/end
      break;
    case 'reveal':
      frameCount = messageCount + 3; // 1 frame per message + start/end/final
      break;
    case 'scroll':
      frameCount = 11; // Fixed scroll steps
      break;
    case 'none':
    default:
      frameCount = 1;
      break;
  }

  // Base KB per frame based on quality and width
  const qualityMultiplier = settings.quality === 'high' ? 1.5 : settings.quality === 'medium' ? 1 : 0.6;
  const widthMultiplier = settings.width / 400;
  const baseKbPerFrame = 30 * qualityMultiplier * widthMultiplier;

  const estimatedKb = frameCount * baseKbPerFrame;

  if (estimatedKb >= 1024) {
    return `~${(estimatedKb / 1024).toFixed(1)} MB`;
  }
  return `~${Math.round(estimatedKb)} KB`;
}
