'use client';

import type { ChatMessage, Participant } from '@/types/Mockup';
import { useRef, useState } from 'react';

type DraggableMessageProps = {
  message: ChatMessage;
  participants: Participant[];
  currentUserId: string;
  onUpdate: (message: ChatMessage) => void;
  onDelete: (id: string) => void;
  dragHandleProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragEnd: () => void;
    onDrop: (e: React.DragEvent) => void;
    className: string;
  };
};

export function DraggableMessage({
  message,
  participants,
  currentUserId,
  onUpdate,
  onDelete,
  dragHandleProps,
}: DraggableMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOwnMessage = message.senderId === currentUserId;

  const handleSave = () => {
    onUpdate({ ...message, content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      {...dragHandleProps}
      className={`group relative rounded-lg border p-3 transition-all ${
        isOwnMessage
          ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30'
          : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
      } ${dragHandleProps.className}`}
    >
      {/* Drag Handle */}
      <div className="absolute top-0 left-0 flex h-full cursor-grab items-center px-1 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
        <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      {/* Header */}
      <div className="mb-2 flex items-center justify-between pl-4">
        <div className="flex items-center gap-2">
          <select
            value={message.senderId}
            onChange={e => onUpdate({ ...message, senderId: e.target.value })}
            className="rounded border border-gray-200 bg-transparent px-2 py-0.5 text-xs dark:border-gray-500"
          >
            {participants.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={message.timestamp}
            onChange={e => onUpdate({ ...message, timestamp: e.target.value })}
            className="w-20 rounded border border-gray-200 bg-transparent px-2 py-0.5 text-xs dark:border-gray-500"
            placeholder="Time"
          />
        </div>
        <button
          type="button"
          onClick={() => onDelete(message.id)}
          className="rounded p-1 text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {isEditing
        ? (
            <div className="pl-4">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-500 dark:bg-gray-800"
                rows={3}
                autoFocus
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded border border-gray-200 px-3 py-1 text-xs hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        : (
            <div
              className="cursor-text pl-4 text-sm text-gray-700 dark:text-gray-300"
              onClick={() => {
                setIsEditing(true);
                setEditContent(message.content);
              }}
            >
              <p className="whitespace-pre-wrap">{message.content || 'Click to add message...'}</p>
              <span className="mt-1 block text-xs text-gray-400">Click to edit</span>
            </div>
          )}

      {/* Status selector for own messages */}
      {isOwnMessage && (
        <div className="mt-2 flex items-center gap-2 pl-4">
          <span className="text-xs text-gray-400">Status:</span>
          <select
            value={message.status || 'sent'}
            onChange={e => onUpdate({ ...message, status: e.target.value as ChatMessage['status'] })}
            className="rounded border border-gray-200 bg-transparent px-2 py-0.5 text-xs dark:border-gray-500"
          >
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="read">Read</option>
          </select>
        </div>
      )}
    </div>
  );
}
