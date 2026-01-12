'use client';

type UndoRedoControlsProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  historyLength?: number;
  currentIndex?: number;
  showHistoryInfo?: boolean;
};

export function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  historyLength,
  currentIndex,
  showHistoryInfo = false,
}: UndoRedoControlsProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Undo button */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Undo (Ctrl+Z)"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>

      {/* Redo button */}
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-700"
        title="Redo (Ctrl+Shift+Z)"
      >
        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
          />
        </svg>
      </button>

      {/* Optional history info */}
      {showHistoryInfo && historyLength !== undefined && currentIndex !== undefined && (
        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
          {currentIndex + 1}
          {' '}
          /
          {historyLength}
        </span>
      )}
    </div>
  );
}
