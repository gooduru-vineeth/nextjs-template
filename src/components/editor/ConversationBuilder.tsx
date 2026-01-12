'use client';

import type { ConversationTemplate } from './ConversationTemplates';
import type { ChatAppearance, ChatMessage, ChatMockupData, Participant } from '@/types/Mockup';
import { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';
import { ConversationTemplates } from './ConversationTemplates';
import { ImportMessages } from './ImportMessages';
import { MessageEditor } from './MessageEditor';

type ConversationBuilderProps = {
  data: ChatMockupData;
  appearance: ChatAppearance;
  onChange: (data: ChatMockupData, appearance: ChatAppearance) => void;
};

function ParticipantEditor({
  participants,
  onChange,
}: {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const addParticipant = () => {
    if (newName.trim()) {
      onChange([
        ...participants,
        {
          id: `participant-${Date.now()}`,
          name: newName.trim(),
          isOnline: true,
          role: 'member',
        },
      ]);
      setNewName('');
      setIsAdding(false);
    }
  };

  const removeParticipant = (id: string) => {
    // Don't allow removing if only 2 participants
    if (participants.length <= 2) {
      return;
    }
    onChange(participants.filter(p => p.id !== id));
  };

  const updateParticipant = (id: string, updates: Partial<Participant>) => {
    onChange(participants.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const cycleRole = (currentRole?: 'admin' | 'member' | 'bot') => {
    const roles: Array<'admin' | 'member' | 'bot'> = ['member', 'admin', 'bot'];
    const currentIndex = roles.indexOf(currentRole || 'member');
    return roles[(currentIndex + 1) % roles.length];
  };

  const getRoleBadge = (role?: 'admin' | 'member' | 'bot') => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' };
      case 'bot':
        return { label: 'Bot', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
      default:
        return { label: 'Member', class: 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300' };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Participants</h3>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + Add
        </button>
      </div>

      {participants.map((p, index) => {
        const roleBadge = getRoleBadge(p.role);
        return (
          <div key={p.id} className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
            {/* Avatar with upload */}
            <div className="relative flex-shrink-0">
              <AvatarUpload
                currentUrl={p.avatarUrl}
                name={p.name}
                onUpload={dataUrl => updateParticipant(p.id, { avatarUrl: dataUrl })}
                onRemove={() => updateParticipant(p.id, { avatarUrl: undefined })}
                size="md"
              />
              {p.isOnline && (
                <div className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-700" />
              )}
            </div>

            {/* Name and Role */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={p.name}
                  onChange={e => updateParticipant(p.id, { name: e.target.value })}
                  className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                {index === 0 && (
                  <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {/* Role badge */}
                <button
                  type="button"
                  onClick={() => updateParticipant(p.id, { role: cycleRole(p.role) })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${roleBadge.class}`}
                  title="Click to change role"
                >
                  {roleBadge.label}
                </button>

                {/* Online toggle */}
                <button
                  type="button"
                  onClick={() => updateParticipant(p.id, { isOnline: !p.isOnline })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    p.isOnline
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                  }`}
                >
                  {p.isOnline ? 'Online' : 'Offline'}
                </button>

                {/* Typing indicator toggle */}
                <button
                  type="button"
                  onClick={() => updateParticipant(p.id, { isTyping: !p.isTyping })}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    p.isTyping
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                  }`}
                >
                  {p.isTyping ? 'Typing...' : 'Typing'}
                </button>
              </div>
            </div>

            {/* Delete button */}
            {participants.length > 2 && (
              <button
                type="button"
                onClick={() => removeParticipant(p.id)}
                className="flex-shrink-0 text-red-500 hover:text-red-600"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        );
      })}

      {isAdding && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Participant name"
            className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addParticipant();
              }
              if (e.key === 'Escape') {
                setIsAdding(false);
              }
            }}
          />
          <button
            type="button"
            onClick={addParticipant}
            className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function MessageList({
  messages,
  participants,
  currentUserId,
  onEdit,
  onDelete,
  onReorder,
}: {
  messages: ChatMessage[];
  participants: Participant[];
  currentUserId: string;
  onEdit: (message: ChatMessage) => void;
  onDelete: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const getSenderName = (senderId: string) => {
    const participant = participants.find(p => p.id === senderId);
    return participant?.name || 'Unknown';
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Add drag image styling
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.4';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);

    // Determine if dropping before or after based on mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    setDropPosition(e.clientY < midpoint ? 'before' : 'after');
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      // Calculate the actual target index based on drop position
      let targetIndex = index;
      if (dropPosition === 'after') {
        targetIndex = dragIndex < index ? index : index + 1;
      } else {
        targetIndex = dragIndex < index ? index - 1 : index;
      }
      // Ensure we don't reorder to the same position
      if (targetIndex !== dragIndex) {
        onReorder(dragIndex, targetIndex);
      }
    }
    setDragIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDragIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  // Move message up/down with keyboard
  const moveMessage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      onReorder(index, index - 1);
    } else if (direction === 'down' && index < messages.length - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Messages (
          {messages.length}
          )
        </h3>
        <span className="text-xs text-gray-400">Drag to reorder</span>
      </div>

      {messages.length === 0
        ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
              <p className="text-sm text-gray-500">No messages yet. Add your first message!</p>
            </div>
          )
        : (
            <div className="space-y-1">
              {messages.map((message, index) => {
                const isSender = message.senderId === currentUserId;
                const isDragging = dragIndex === index;
                const isDragOver = dragOverIndex === index && dragIndex !== index;
                const showDropBefore = isDragOver && dropPosition === 'before';
                const showDropAfter = isDragOver && dropPosition === 'after';

                return (
                  <div key={message.id} className="relative">
                    {/* Drop indicator - before */}
                    {showDropBefore && (
                      <div className="absolute -top-1 right-0 left-0 z-10 h-1 rounded-full bg-blue-500 shadow-lg" />
                    )}

                    <div
                      draggable
                      onDragStart={e => handleDragStart(e, index)}
                      onDragOver={e => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={e => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group flex cursor-grab items-center gap-2 rounded-lg p-2 transition-all duration-200 ${
                        isDragging ? 'scale-105 opacity-50 shadow-lg' : ''
                      } ${isDragOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''} ${
                        isSender
                          ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
                          : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
                      } active:cursor-grabbing`}
                    >
                      {/* Drag handle */}
                      <div className="flex flex-col text-gray-400 transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </div>

                      {/* Index badge */}
                      <div className={`flex size-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${
                        isSender
                          ? 'bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                      >
                        {index + 1}
                      </div>

                      {/* Message preview */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${isSender ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {getSenderName(message.senderId)}
                          </span>
                          <span className="text-[10px] text-gray-400">{message.timestamp}</span>
                          {message.type !== 'text' && (
                            <span className="text-[10px] text-gray-400">
                              {message.type === 'image' && '📷'}
                              {message.type === 'voice' && '🎤'}
                              {message.type === 'video' && '🎬'}
                              {message.type === 'document' && '📎'}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                          {message.type === 'image' ? 'Image' : message.type === 'voice' ? 'Voice message' : message.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {/* Move up */}
                        <button
                          type="button"
                          onClick={() => moveMessage(index, 'up')}
                          disabled={index === 0}
                          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-600"
                          title="Move up"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        {/* Move down */}
                        <button
                          type="button"
                          onClick={() => moveMessage(index, 'down')}
                          disabled={index === messages.length - 1}
                          className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-gray-600"
                          title="Move down"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(message)}
                          className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-600"
                          title="Edit message"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete(message.id)}
                          className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          title="Delete message"
                        >
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Drop indicator - after */}
                    {showDropAfter && (
                      <div className="absolute right-0 -bottom-1 left-0 z-10 h-1 rounded-full bg-blue-500 shadow-lg" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
    </div>
  );
}

function GroupChatSettings({
  data,
  onChange,
}: {
  data: ChatMockupData;
  onChange: (data: ChatMockupData) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Group Chat Settings</h3>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={data.isGroup || false}
            onChange={e => onChange({ ...data, isGroup: e.target.checked })}
            className="peer sr-only"
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800" />
        </label>
      </div>

      {data.isGroup && (
        <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          {/* Group Avatar */}
          <div className="flex items-center gap-4">
            <AvatarUpload
              currentUrl={data.chatAvatar}
              name={data.chatName || 'Group'}
              onUpload={dataUrl => onChange({ ...data, chatAvatar: dataUrl })}
              onRemove={() => onChange({ ...data, chatAvatar: undefined })}
              size="lg"
            />
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Group Name</label>
              <input
                type="text"
                value={data.chatName || ''}
                onChange={e => onChange({ ...data, chatName: e.target.value })}
                placeholder="Enter group name"
                className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Group info hint */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            In group chat mode, participant names and roles will be shown in messages.
            Admin badges are displayed for participants with the "Admin" role.
          </p>

          {/* Participant count */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>
              {data.participants.length}
              {' '}
              participants
            </span>
          </div>
        </div>
      )}

      {!data.isGroup && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enable group chat mode to customize the group name, avatar, and show participant names in messages.
        </p>
      )}
    </div>
  );
}

function AppearanceSettings({
  appearance,
  onChange,
}: {
  appearance: ChatAppearance;
  onChange: (appearance: ChatAppearance) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Appearance</h3>

      {/* Theme */}
      <div>
        <label className="mb-1 block text-xs text-gray-500">Theme</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...appearance, theme: 'light' })}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
              appearance.theme === 'light'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            ☀️ Light
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...appearance, theme: 'dark' })}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
              appearance.theme === 'dark'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            🌙 Dark
          </button>
        </div>
      </div>

      {/* Device Frame */}
      <div>
        <label className="mb-1 block text-xs text-gray-500">Device Frame</label>
        <select
          value={appearance.deviceFrame || 'none'}
          onChange={e => onChange({ ...appearance, deviceFrame: e.target.value as ChatAppearance['deviceFrame'] })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="none">No Frame</option>
          <option value="iphone">iPhone</option>
          <option value="android">Android</option>
        </select>
      </div>

      {/* Show options */}
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={appearance.showTimestamps !== false}
            onChange={e => onChange({ ...appearance, showTimestamps: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show timestamps</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={appearance.showAvatars !== false}
            onChange={e => onChange({ ...appearance, showAvatars: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show avatars</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={appearance.showStatus !== false}
            onChange={e => onChange({ ...appearance, showStatus: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show message status</span>
        </label>
      </div>

      {/* Font size */}
      <div>
        <label className="mb-1 block text-xs text-gray-500">Font Size</label>
        <select
          value={appearance.fontSize || 'medium'}
          onChange={e => onChange({ ...appearance, fontSize: e.target.value as ChatAppearance['fontSize'] })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Wallpaper / Background */}
      <div>
        <label className="mb-1 block text-xs text-gray-500">Chat Wallpaper</label>
        <div className="space-y-2">
          {/* Preset wallpapers */}
          <div className="grid grid-cols-5 gap-2">
            {/* None option */}
            <button
              type="button"
              onClick={() => onChange({ ...appearance, wallpaper: undefined })}
              className={`h-12 rounded-lg border-2 transition-all ${
                !appearance.wallpaper
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              } bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800`}
              title="No wallpaper"
            >
              <span className="text-xs text-gray-500">None</span>
            </button>
            {/* WhatsApp-style green */}
            <button
              type="button"
              onClick={() => onChange({ ...appearance, wallpaper: 'linear-gradient(to bottom, #128c7e, #075e54)' })}
              className={`h-12 rounded-lg border-2 transition-all ${
                appearance.wallpaper?.includes('128c7e')
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ background: 'linear-gradient(to bottom, #128c7e, #075e54)' }}
              title="WhatsApp Green"
            />
            {/* Blue gradient */}
            <button
              type="button"
              onClick={() => onChange({ ...appearance, wallpaper: 'linear-gradient(to bottom, #667eea, #764ba2)' })}
              className={`h-12 rounded-lg border-2 transition-all ${
                appearance.wallpaper?.includes('667eea')
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ background: 'linear-gradient(to bottom, #667eea, #764ba2)' }}
              title="Purple Blue"
            />
            {/* Sunset gradient */}
            <button
              type="button"
              onClick={() => onChange({ ...appearance, wallpaper: 'linear-gradient(to bottom, #ff6b6b, #feca57)' })}
              className={`h-12 rounded-lg border-2 transition-all ${
                appearance.wallpaper?.includes('ff6b6b')
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ background: 'linear-gradient(to bottom, #ff6b6b, #feca57)' }}
              title="Sunset"
            />
            {/* Dark gradient */}
            <button
              type="button"
              onClick={() => onChange({ ...appearance, wallpaper: 'linear-gradient(to bottom, #1a1a2e, #16213e)' })}
              className={`h-12 rounded-lg border-2 transition-all ${
                appearance.wallpaper?.includes('1a1a2e')
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
              title="Dark Blue"
            />
          </div>

          {/* Custom wallpaper upload */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const dataUrl = e.target?.result as string;
                      onChange({ ...appearance, wallpaper: `url(${dataUrl})` });
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Custom
            </button>
            {appearance.wallpaper && (
              <button
                type="button"
                onClick={() => onChange({ ...appearance, wallpaper: undefined })}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                title="Remove wallpaper"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bubble Colors */}
      <div>
        <label className="mb-1 block text-xs text-gray-500">Bubble Colors</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-[10px] text-gray-400">Sender</span>
            <input
              type="color"
              value={appearance.bubbleColorSender || '#dcf8c6'}
              onChange={e => onChange({ ...appearance, bubbleColorSender: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-gray-200"
            />
          </div>
          <div>
            <span className="mb-1 block text-[10px] text-gray-400">Receiver</span>
            <input
              type="color"
              value={appearance.bubbleColorReceiver || '#ffffff'}
              onChange={e => onChange({ ...appearance, bubbleColorReceiver: e.target.value })}
              className="h-8 w-full cursor-pointer rounded border border-gray-200"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...appearance, bubbleColorSender: undefined, bubbleColorReceiver: undefined })}
          className="mt-1 text-xs text-blue-600 hover:text-blue-700"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}

export function ConversationBuilder({
  data,
  appearance,
  onChange,
}: ConversationBuilderProps) {
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [isAddingMessage, setIsAddingMessage] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSelectingTemplate, setIsSelectingTemplate] = useState(false);
  const currentUserId = data.participants[0]?.id || 'user';

  const handleParticipantsChange = (participants: Participant[]) => {
    onChange({ ...data, participants }, appearance);
  };

  const handleAddMessage = (message: ChatMessage) => {
    onChange({ ...data, messages: [...data.messages, message] }, appearance);
    setIsAddingMessage(false);
  };

  const handleEditMessage = (message: ChatMessage) => {
    onChange(
      {
        ...data,
        messages: data.messages.map(m => (m.id === message.id ? message : m)),
      },
      appearance,
    );
    setEditingMessage(null);
  };

  const handleDeleteMessage = (id: string) => {
    onChange(
      { ...data, messages: data.messages.filter(m => m.id !== id) },
      appearance,
    );
  };

  const handleImportMessages = (messages: ChatMessage[]) => {
    onChange({ ...data, messages: [...data.messages, ...messages] }, appearance);
    setIsImporting(false);
  };

  const handleReorderMessages = (fromIndex: number, toIndex: number) => {
    const newMessages = [...data.messages];
    const [movedMessage] = newMessages.splice(fromIndex, 1);
    newMessages.splice(toIndex, 0, movedMessage!);
    onChange({ ...data, messages: newMessages }, appearance);
  };

  const handleAppearanceChange = (newAppearance: ChatAppearance) => {
    onChange(data, newAppearance);
  };

  const handleDataChange = (newData: ChatMockupData) => {
    onChange(newData, appearance);
  };

  const handleSelectTemplate = (template: ConversationTemplate) => {
    // Convert template messages to ChatMessages with IDs
    const messages: ChatMessage[] = template.messages.map((msg, index) => ({
      ...msg,
      id: `template-msg-${Date.now()}-${index}`,
    }));

    // Update data with template participants and messages
    onChange(
      {
        ...data,
        participants: template.participants,
        messages,
        isGroup: template.participants.length > 2,
      },
      appearance,
    );
    setIsSelectingTemplate(false);
  };

  return (
    <div className="space-y-6">
      {/* Group Chat Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <GroupChatSettings
          data={data}
          onChange={handleDataChange}
        />
      </div>

      {/* Participants Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <ParticipantEditor
          participants={data.participants}
          onChange={handleParticipantsChange}
        />
      </div>

      {/* Messages Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        {editingMessage
          ? (
              <MessageEditor
                message={editingMessage}
                participants={data.participants}
                currentUserId={currentUserId}
                allMessages={data.messages}
                onSave={handleEditMessage}
                onCancel={() => setEditingMessage(null)}
              />
            )
          : isAddingMessage
            ? (
                <MessageEditor
                  participants={data.participants}
                  currentUserId={currentUserId}
                  allMessages={data.messages}
                  onSave={handleAddMessage}
                  onCancel={() => setIsAddingMessage(false)}
                />
              )
            : isImporting
              ? (
                  <ImportMessages
                    participants={data.participants}
                    currentUserId={currentUserId}
                    onImport={handleImportMessages}
                    onClose={() => setIsImporting(false)}
                  />
                )
              : isSelectingTemplate
                ? (
                    <ConversationTemplates
                      onSelect={handleSelectTemplate}
                      onClose={() => setIsSelectingTemplate(false)}
                    />
                  )
                : (
                    <>
                      <MessageList
                        messages={data.messages}
                        participants={data.participants}
                        currentUserId={currentUserId}
                        onEdit={setEditingMessage}
                        onDelete={handleDeleteMessage}
                        onReorder={handleReorderMessages}
                      />
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingMessage(true)}
                          className="flex-1 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500"
                        >
                          + Add Message
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsSelectingTemplate(true)}
                          className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-purple-500 hover:text-purple-500"
                          title="Use a conversation template"
                        >
                          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsImporting(true)}
                          className="rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500"
                          title="Import from CSV/JSON"
                        >
                          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
      </div>

      {/* Appearance Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <AppearanceSettings
          appearance={appearance}
          onChange={handleAppearanceChange}
        />
      </div>
    </div>
  );
}
