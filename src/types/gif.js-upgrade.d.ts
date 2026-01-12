declare module 'gif.js-upgrade' {
  type GIFOptions = {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    repeat?: number; // 0 = loop forever, -1 = no repeat, n = repeat n times
    background?: string;
    transparent?: string | null;
    workerScript?: string;
    dither?: boolean | string;
  };

  type FrameOptions = {
    delay?: number;
    copy?: boolean;
    dispose?: number;
  };

  type GIF = {
    addFrame(
      element: HTMLImageElement | HTMLCanvasElement | CanvasRenderingContext2D | ImageData,
      options?: FrameOptions
    ): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'error', callback: (error: Error) => void): void;
    on(event: 'start' | 'abort', callback: () => void): void;
    render(): void;
    abort(): void;
    running: boolean;
  };

  export type GIFConstructor = {
    new(options?: GIFOptions): GIF;
  };

  const GIF: GIFConstructor;
  export default GIF;
}
