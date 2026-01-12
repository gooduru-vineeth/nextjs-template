'use client';

import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Square,
  Trash2,
  Video,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type RecordingFormat = 'webm' | 'mp4' | 'gif';
export type RecordingQuality = 'low' | 'medium' | 'high' | 'ultra';
export type RecordingSource = 'screen' | 'camera' | 'both';

export type RecordingConfig = {
  format: RecordingFormat;
  quality: RecordingQuality;
  frameRate: number;
  includeAudio: boolean;
  includeMicrophone: boolean;
  source: RecordingSource;
  maxDuration?: number; // in seconds
  countdown: number; // seconds before recording starts
};

export type RecordingState = {
  status: 'idle' | 'countdown' | 'recording' | 'paused' | 'processing' | 'done' | 'error';
  duration: number; // in seconds
  fileSize?: number; // in bytes
  error?: string;
  previewUrl?: string;
};

export type ScreenRecordingModeProps = {
  onRecordingStart?: () => void;
  onRecordingStop?: (blob: Blob) => void;
  onRecordingError?: (error: string) => void;
  defaultConfig?: Partial<RecordingConfig>;
  targetElement?: HTMLElement | null;
  className?: string;
};

// ============================================================================
// Constants
// ============================================================================

const qualitySettings: Record<RecordingQuality, { width: number; height: number; bitrate: number }> = {
  low: { width: 854, height: 480, bitrate: 1000000 },
  medium: { width: 1280, height: 720, bitrate: 2500000 },
  high: { width: 1920, height: 1080, bitrate: 5000000 },
  ultra: { width: 2560, height: 1440, bitrate: 8000000 },
};

const formatLabels: Record<RecordingFormat, string> = {
  webm: 'WebM (Best compatibility)',
  mp4: 'MP4 (Needs conversion)',
  gif: 'GIF (Animated image)',
};

// ============================================================================
// Hooks
// ============================================================================

export function useScreenRecording(config: RecordingConfig) {
  const [state, setState] = useState<RecordingState>({
    status: 'idle',
    duration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const startRecording = useCallback(async () => {
    try {
      cleanup();

      // Start countdown
      if (config.countdown > 0) {
        setState({ status: 'countdown', duration: config.countdown });

        for (let i = config.countdown; i > 0; i--) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setState(prev => ({ ...prev, duration: i - 1 }));
        }
      }

      // Get display media
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: qualitySettings[config.quality].width,
          height: qualitySettings[config.quality].height,
          frameRate: config.frameRate,
        },
        audio: config.includeAudio,
      });

      // Get microphone if needed
      let micStream: MediaStream | null = null;
      if (config.includeMicrophone) {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          console.warn('Microphone access denied');
        }
      }

      // Combine streams
      const tracks = [...displayStream.getTracks()];
      if (micStream) {
        tracks.push(...micStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // Setup MediaRecorder
      const mimeType = config.format === 'webm'
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const options: MediaRecorderOptions = {
        mimeType,
        videoBitsPerSecond: qualitySettings[config.quality].bitrate,
      };

      const mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);

        setState(prev => ({
          ...prev,
          status: 'done',
          previewUrl: url,
          fileSize: blob.size,
        }));
      };

      mediaRecorder.onerror = () => {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: 'Recording failed',
        }));
      };

      // Handle stream end
      displayStream.getVideoTracks()[0]?.addEventListener('ended', () => {
        if (state.status === 'recording') {
          stopRecording();
        }
      });

      // Start recording
      mediaRecorder.start(1000); // Capture in 1-second chunks
      startTimeRef.current = Date.now();

      setState({ status: 'recording', duration: 0 });

      // Start duration timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setState(prev => ({ ...prev, duration: elapsed }));

        // Check max duration
        if (config.maxDuration && elapsed >= config.maxDuration) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start recording';
      setState({ status: 'error', duration: 0, error: message });
    }
  }, [config, cleanup]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState(prev => ({ ...prev, status: 'processing' }));
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, status: 'paused' }));
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, status: 'recording' }));
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setState({ status: 'idle', duration: 0 });
  }, [cleanup]);

  const getBlob = useCallback((): Blob | null => {
    if (chunksRef.current.length === 0) {
      return null;
    }
    return new Blob(chunksRef.current, { type: 'video/webm' });
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset,
    getBlob,
  };
}

// ============================================================================
// Sub-Components
// ============================================================================

type RecordingControlsProps = {
  state: RecordingState;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
};

function RecordingControls({
  state,
  onStart,
  onStop,
  onPause,
  onResume,
  onReset,
}: RecordingControlsProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4">
      {state.status === 'idle' && (
        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
        >
          <Circle className="h-4 w-4 fill-current" />
          Start Recording
        </button>
      )}

      {state.status === 'countdown' && (
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-red-500 text-xl font-bold text-white">
            {state.duration}
          </div>
          <span className="text-gray-500">Starting in...</span>
        </div>
      )}

      {(state.status === 'recording' || state.status === 'paused') && (
        <>
          <div className="flex items-center gap-2">
            {state.status === 'recording' && (
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
            )}
            <span className="font-mono text-lg">{formatDuration(state.duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            {state.status === 'recording'
              ? (
                  <button
                    onClick={onPause}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Pause"
                  >
                    <Pause className="h-5 w-5" />
                  </button>
                )
              : (
                  <button
                    onClick={onResume}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Resume"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                )}

            <button
              onClick={onStop}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-900"
            >
              <Square className="h-4 w-4 fill-current" />
              Stop
            </button>
          </div>
        </>
      )}

      {state.status === 'processing' && (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          Processing recording...
        </div>
      )}

      {state.status === 'done' && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <RotateCcw className="h-4 w-4" />
          Record Again
        </button>
      )}

      {state.status === 'error' && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            {state.error}
          </div>
          <button
            onClick={onReset}
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

type RecordingPreviewProps = {
  previewUrl: string;
  fileSize?: number;
  onDownload: () => void;
  onDelete: () => void;
};

function RecordingPreview({ previewUrl, fileSize, onDownload, onDelete }: RecordingPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) {
      return 'Unknown size';
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && videoRef.current) {
      videoRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={previewUrl}
          controls
          className="max-h-96 w-full object-contain"
        />

        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 rounded bg-black/50 p-2 text-white hover:bg-black/70"
        >
          {isFullscreen
            ? (
                <Minimize2 className="h-4 w-4" />
              )
            : (
                <Maximize2 className="h-4 w-4" />
              )}
        </button>
      </div>

      <div className="flex items-center justify-between bg-gray-50 p-3 dark:bg-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          Recording complete •
          {' '}
          {formatFileSize(fileSize)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="rounded p-2 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded bg-blue-500 px-3 py-1.5 text-white transition-colors hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

type ConfigPanelProps = {
  config: RecordingConfig;
  onChange: (config: RecordingConfig) => void;
  disabled?: boolean;
};

function ConfigPanel({ config, onChange, disabled }: ConfigPanelProps) {
  const handleChange = <K extends keyof RecordingConfig>(
    key: K,
    value: RecordingConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4 rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
      <div className="mb-3 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        <span className="text-sm font-medium">Recording Settings</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Format */}
        <div>
          <label className="mb-1 block text-xs text-gray-500">Format</label>
          <select
            value={config.format}
            onChange={e => handleChange('format', e.target.value as RecordingFormat)}
            disabled={disabled}
            className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            {Object.entries(formatLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Quality */}
        <div>
          <label className="mb-1 block text-xs text-gray-500">Quality</label>
          <select
            value={config.quality}
            onChange={e => handleChange('quality', e.target.value as RecordingQuality)}
            disabled={disabled}
            className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="low">480p (Low)</option>
            <option value="medium">720p (Medium)</option>
            <option value="high">1080p (High)</option>
            <option value="ultra">1440p (Ultra)</option>
          </select>
        </div>

        {/* Frame Rate */}
        <div>
          <label className="mb-1 block text-xs text-gray-500">Frame Rate</label>
          <select
            value={config.frameRate}
            onChange={e => handleChange('frameRate', Number.parseInt(e.target.value))}
            disabled={disabled}
            className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value={15}>15 FPS</option>
            <option value={24}>24 FPS</option>
            <option value={30}>30 FPS</option>
            <option value={60}>60 FPS</option>
          </select>
        </div>

        {/* Countdown */}
        <div>
          <label className="mb-1 block flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            Countdown
          </label>
          <select
            value={config.countdown}
            onChange={e => handleChange('countdown', Number.parseInt(e.target.value))}
            disabled={disabled}
            className="w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value={0}>No countdown</option>
            <option value={3}>3 seconds</option>
            <option value={5}>5 seconds</option>
            <option value={10}>10 seconds</option>
          </select>
        </div>
      </div>

      {/* Audio Options */}
      <div className="flex items-center gap-4 border-t pt-2">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.includeAudio}
            onChange={e => handleChange('includeAudio', e.target.checked)}
            disabled={disabled}
            className="rounded"
          />
          <span className="flex items-center gap-1 text-sm">
            {config.includeAudio
              ? (
                  <Volume2 className="h-4 w-4" />
                )
              : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
            System Audio
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.includeMicrophone}
            onChange={e => handleChange('includeMicrophone', e.target.checked)}
            disabled={disabled}
            className="rounded"
          />
          <span className="flex items-center gap-1 text-sm">
            {config.includeMicrophone
              ? (
                  <Mic className="h-4 w-4" />
                )
              : (
                  <MicOff className="h-4 w-4 text-gray-400" />
                )}
            Microphone
          </span>
        </label>
      </div>

      {/* Max Duration */}
      <div className="border-t pt-2">
        <label className="mb-1 block text-xs text-gray-500">Max Duration (optional)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={config.maxDuration || ''}
            onChange={e => handleChange('maxDuration', e.target.value ? Number.parseInt(e.target.value) : undefined)}
            placeholder="No limit"
            disabled={disabled}
            className="flex-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
            min={10}
            max={3600}
          />
          <span className="text-sm text-gray-500">seconds</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ScreenRecordingMode({
  onRecordingStart,
  onRecordingStop,
  onRecordingError,
  defaultConfig,
  className = '',
}: ScreenRecordingModeProps) {
  const [config, setConfig] = useState<RecordingConfig>({
    format: 'webm',
    quality: 'high',
    frameRate: 30,
    includeAudio: true,
    includeMicrophone: false,
    source: 'screen',
    countdown: 3,
    ...defaultConfig,
  });

  const [showSettings, setShowSettings] = useState(false);

  const {
    state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reset,
    getBlob,
  } = useScreenRecording(config);

  const handleStart = useCallback(async () => {
    onRecordingStart?.();
    await startRecording();
  }, [startRecording, onRecordingStart]);

  const handleStop = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  // Handle recording completion
  useEffect(() => {
    if (state.status === 'done') {
      const blob = getBlob();
      if (blob) {
        onRecordingStop?.(blob);
      }
    }
    if (state.status === 'error' && state.error) {
      onRecordingError?.(state.error);
    }
  }, [state.status, state.error, getBlob, onRecordingStop, onRecordingError]);

  const handleDownload = useCallback(() => {
    const blob = getBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.${config.format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [getBlob, config.format]);

  const handleDelete = useCallback(() => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    reset();
  }, [state.previewUrl, reset]);

  const isRecording = state.status === 'recording' || state.status === 'paused';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-red-500" />
          <span className="font-medium">Screen Recording</span>
          {isRecording && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
              Recording
            </span>
          )}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          disabled={isRecording}
          className={`
            rounded-lg p-2 transition-colors
            ${showSettings
      ? 'bg-gray-200 dark:bg-gray-700'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            ${isRecording ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && !isRecording && (
        <ConfigPanel
          config={config}
          onChange={setConfig}
          disabled={isRecording}
        />
      )}

      {/* Recording Controls */}
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-800">
        <RecordingControls
          state={state}
          onStart={handleStart}
          onStop={handleStop}
          onPause={pauseRecording}
          onResume={resumeRecording}
          onReset={reset}
        />
      </div>

      {/* Preview */}
      {state.status === 'done' && state.previewUrl && (
        <RecordingPreview
          previewUrl={state.previewUrl}
          fileSize={state.fileSize}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      {/* Tips */}
      {state.status === 'idle' && (
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="flex items-start gap-2">
            <Monitor className="mt-0.5 h-4 w-4 text-blue-500" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="mb-1 font-medium">Tips for best results:</p>
              <ul className="list-inside list-disc space-y-1 text-xs">
                <li>Select the specific tab or window you want to record</li>
                <li>For tutorials, enable microphone to add voiceover</li>
                <li>Use countdown to prepare before recording starts</li>
                <li>Click the &quot;Stop Sharing&quot; browser button or use controls to end</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Floating Recording Indicator
// ============================================================================

export type RecordingIndicatorProps = {
  isRecording: boolean;
  duration: number;
  onStop: () => void;
  className?: string;
};

export function RecordingIndicator({
  isRecording,
  duration,
  onStop,
  className = '',
}: RecordingIndicatorProps) {
  if (!isRecording) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`
        fixed bottom-4 left-1/2 z-50 flex
        -translate-x-1/2 items-center gap-3 rounded-full bg-red-500 px-4 py-2 text-white shadow-lg
        ${className}
      `}
    >
      <span className="h-3 w-3 animate-pulse rounded-full bg-white" />
      <span className="font-mono">{formatDuration(duration)}</span>
      <button
        onClick={onStop}
        className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm transition-colors hover:bg-white/30"
      >
        <Square className="h-3 w-3 fill-current" />
        Stop
      </button>
    </div>
  );
}

// ============================================================================
// Quick Recording Button
// ============================================================================

export type QuickRecordButtonProps = {
  onRecordingComplete: (blob: Blob) => void;
  className?: string;
};

export function QuickRecordButton({
  onRecordingComplete,
  className = '',
}: QuickRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);

  const config: RecordingConfig = {
    format: 'webm',
    quality: 'high',
    frameRate: 30,
    includeAudio: false,
    includeMicrophone: false,
    source: 'screen',
    countdown: 0,
  };

  const { state, startRecording, stopRecording, getBlob } = useScreenRecording(config);

  useEffect(() => {
    if (state.status === 'done') {
      const blob = getBlob();
      if (blob) {
        onRecordingComplete(blob);
      }
      setIsRecording(false);
    }
  }, [state.status, getBlob, onRecordingComplete]);

  const handleClick = useCallback(async () => {
    if (isRecording) {
      stopRecording();
    } else {
      setIsRecording(true);
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 rounded-lg px-4 py-2 transition-colors
        ${isRecording
      ? 'bg-red-500 text-white hover:bg-red-600'
      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'}
        ${className}
      `}
    >
      {isRecording
        ? (
            <>
              <Square className="h-4 w-4 fill-current" />
              Stop Recording
            </>
          )
        : (
            <>
              <Video className="h-4 w-4" />
              Record Screen
            </>
          )}
    </button>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default ScreenRecordingMode;
