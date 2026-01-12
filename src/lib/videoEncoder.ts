'use client';

import html2canvas from 'html2canvas';

export type VideoEncoderSettings = {
  animation: 'typing' | 'reveal' | 'scroll' | 'none';
  duration: number; // total duration in seconds
  fps: number; // frames per second (24, 30, or 60)
  resolution: '720p' | '1080p' | '4k';
  format: 'webm' | 'mp4';
};

type VideoEncoderCallbacks = {
  onProgress?: (progress: number, status: string) => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;
};

// Resolution settings
const resolutionMap = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4k': { width: 3840, height: 2160 },
};

/**
 * Captures a single frame from a DOM element at specified resolution
 */
async function captureFrame(
  element: HTMLElement,
  resolution: '720p' | '1080p' | '4k',
): Promise<HTMLCanvasElement> {
  const { width } = resolutionMap[resolution];
  const scale = width / element.offsetWidth;

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });
  return canvas;
}

/**
 * Creates frames for reveal animation
 */
async function createRevealFrames(
  mockupElement: HTMLElement,
  messageSelector: string,
  frameCount: number,
  resolution: '720p' | '1080p' | '4k',
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  const frames: HTMLCanvasElement[] = [];
  const messages = mockupElement.querySelectorAll(messageSelector);
  const totalMessages = messages.length;

  // Store original visibility
  const originalStates = Array.from(messages).map((msg) => {
    const el = msg as HTMLElement;
    return { element: el, opacity: el.style.opacity };
  });

  // Hide all messages
  messages.forEach((msg) => {
    (msg as HTMLElement).style.opacity = '0';
  });

  // Calculate frames per message
  const framesPerMessage = Math.floor(frameCount / (totalMessages + 2));
  const holdFrames = Math.floor(framesPerMessage * 0.3); // 30% hold time after reveal

  // Initial empty frames
  onProgress(5, 'Capturing initial frames...');
  for (let i = 0; i < holdFrames; i++) {
    frames.push(await captureFrame(mockupElement, resolution));
  }

  // Reveal each message
  for (let msgIdx = 0; msgIdx < totalMessages; msgIdx++) {
    const msg = messages[msgIdx] as HTMLElement;
    msg.style.opacity = '1';

    onProgress(10 + (msgIdx / totalMessages) * 70, `Animating message ${msgIdx + 1}/${totalMessages}...`);

    // Add frames for this message (with fade-in simulation via multiple captures)
    for (let i = 0; i < framesPerMessage - holdFrames; i++) {
      frames.push(await captureFrame(mockupElement, resolution));
    }

    // Hold frames
    for (let i = 0; i < holdFrames; i++) {
      frames.push(await captureFrame(mockupElement, resolution));
    }
  }

  // Final hold frames
  onProgress(85, 'Adding final frames...');
  const remainingFrames = frameCount - frames.length;
  for (let i = 0; i < remainingFrames; i++) {
    frames.push(await captureFrame(mockupElement, resolution));
  }

  // Restore original states
  originalStates.forEach(({ element, opacity }) => {
    element.style.opacity = opacity || '1';
  });

  return frames;
}

/**
 * Creates frames for scroll animation
 */
async function createScrollFrames(
  mockupElement: HTMLElement,
  frameCount: number,
  resolution: '720p' | '1080p' | '4k',
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  const frames: HTMLCanvasElement[] = [];
  const scrollContainer = mockupElement.querySelector('[data-scroll-container]') || mockupElement;
  const scrollEl = scrollContainer as HTMLElement;

  const originalScrollTop = scrollEl.scrollTop;
  const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

  // Start at top
  scrollEl.scrollTop = 0;
  const holdFrames = Math.floor(frameCount * 0.1); // 10% hold at start and end
  const scrollFrames = frameCount - (holdFrames * 2);

  // Initial hold
  onProgress(5, 'Capturing start frames...');
  for (let i = 0; i < holdFrames; i++) {
    frames.push(await captureFrame(mockupElement, resolution));
  }

  // Scroll animation
  for (let i = 0; i < scrollFrames; i++) {
    const scrollProgress = i / scrollFrames;
    // Ease in-out function for smooth scroll
    const easedProgress = scrollProgress < 0.5
      ? 2 * scrollProgress * scrollProgress
      : 1 - (-2 * scrollProgress + 2) ** 2 / 2;

    scrollEl.scrollTop = easedProgress * maxScroll;

    onProgress(10 + (i / scrollFrames) * 80, `Scrolling ${Math.round(scrollProgress * 100)}%...`);

    await new Promise(resolve => setTimeout(resolve, 10)); // Let DOM update
    frames.push(await captureFrame(mockupElement, resolution));
  }

  // End hold
  onProgress(90, 'Capturing end frames...');
  scrollEl.scrollTop = maxScroll;
  for (let i = 0; i < holdFrames; i++) {
    frames.push(await captureFrame(mockupElement, resolution));
  }

  // Restore
  scrollEl.scrollTop = originalScrollTop;

  return frames;
}

/**
 * Creates static frames (single image repeated)
 */
async function createStaticFrames(
  mockupElement: HTMLElement,
  frameCount: number,
  resolution: '720p' | '1080p' | '4k',
  onProgress: (progress: number, status: string) => void,
): Promise<HTMLCanvasElement[]> {
  onProgress(50, 'Capturing static frame...');
  const frame = await captureFrame(mockupElement, resolution);

  // Return same frame multiple times (will be optimized by encoder)
  return new Array(frameCount).fill(frame);
}

/**
 * Creates a video blob from canvas frames using MediaRecorder
 */
async function encodeFramesToVideo(
  frames: HTMLCanvasElement[],
  settings: VideoEncoderSettings,
  onProgress: (progress: number, status: string) => void,
): Promise<Blob> {
  const { fps, format } = settings;

  // Create a canvas for the video
  const canvas = document.createElement('canvas');
  canvas.width = frames[0]!.width;
  canvas.height = frames[0]!.height;
  const ctx = canvas.getContext('2d')!;

  // Determine mime type
  const mimeType = format === 'webm' ? 'video/webm;codecs=vp9' : 'video/webm'; // MP4 requires more complex encoding

  // Check if codec is supported
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    throw new Error(`Video format ${format} is not supported in this browser`);
  }

  // Create MediaRecorder
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8000000, // 8 Mbps
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    recorder.onerror = (e) => {
      reject(new Error(`Recording error: ${e}`));
    };

    recorder.start();

    // Draw frames at specified fps
    const frameInterval = 1000 / fps;
    let frameIndex = 0;

    const drawNextFrame = () => {
      if (frameIndex >= frames.length) {
        recorder.stop();
        return;
      }

      ctx.drawImage(frames[frameIndex]!, 0, 0);
      frameIndex++;

      onProgress(92 + (frameIndex / frames.length) * 8, `Encoding frame ${frameIndex}/${frames.length}...`);

      setTimeout(drawNextFrame, frameInterval);
    };

    drawNextFrame();
  });
}

/**
 * Main video encoder function
 */
export async function encodeVideo(
  mockupElement: HTMLElement,
  settings: VideoEncoderSettings,
  callbacks: VideoEncoderCallbacks = {},
): Promise<Blob> {
  const { onProgress = () => {}, onComplete, onError } = callbacks;
  const messageSelector = '[data-message], .message-bubble, .chat-message';

  try {
    onProgress(0, 'Initializing video encoder...');

    // Calculate total frames
    const totalFrames = settings.duration * settings.fps;

    // Generate frames based on animation type
    let frames: HTMLCanvasElement[];

    switch (settings.animation) {
      case 'reveal':
        frames = await createRevealFrames(
          mockupElement,
          messageSelector,
          totalFrames,
          settings.resolution,
          onProgress,
        );
        break;
      case 'scroll':
        frames = await createScrollFrames(
          mockupElement,
          totalFrames,
          settings.resolution,
          onProgress,
        );
        break;
      case 'typing':
        // For typing, use reveal with more frames
        frames = await createRevealFrames(
          mockupElement,
          messageSelector,
          totalFrames,
          settings.resolution,
          onProgress,
        );
        break;
      case 'none':
      default:
        frames = await createStaticFrames(
          mockupElement,
          totalFrames,
          settings.resolution,
          onProgress,
        );
        break;
    }

    if (frames.length === 0) {
      throw new Error('No frames captured');
    }

    onProgress(92, 'Encoding video...');

    const blob = await encodeFramesToVideo(frames, settings, onProgress);

    onProgress(100, 'Complete!');
    onComplete?.(blob);

    return blob;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Video encoding failed');
    onError?.(err);
    throw err;
  }
}

/**
 * Downloads a blob as a video file
 */
export function downloadVideo(blob: Blob, filename: string): void {
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
 * Estimates video file size
 */
export function estimateVideoSize(settings: VideoEncoderSettings): string {
  // Rough estimate based on resolution, fps, and duration
  const resMultiplier = settings.resolution === '4k' ? 4 : settings.resolution === '1080p' ? 2 : 1;
  const baseKbps = 2000; // ~2 Mbps for 720p WebM
  const estimatedKb = (baseKbps * settings.duration * resMultiplier * (settings.fps / 30));

  if (estimatedKb >= 1024) {
    return `~${(estimatedKb / 1024).toFixed(1)} MB`;
  }
  return `~${Math.round(estimatedKb)} KB`;
}

/**
 * Checks if video encoding is supported
 */
export function isVideoEncodingSupported(): boolean {
  return typeof MediaRecorder !== 'undefined'
    && MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
}
