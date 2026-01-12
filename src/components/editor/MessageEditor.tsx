'use client';

import type { ChatMessage, MessageReaction, MessageStatus, Participant } from '@/types/Mockup';
import { useRef, useState } from 'react';
import { EmojiPicker } from './EmojiPicker';
import { ReactionPicker } from './ReactionPicker';

type MessageEditorProps = {
  message?: ChatMessage;
  participants: Participant[];
  currentUserId: string;
  allMessages?: ChatMessage[];
  onSave: (message: ChatMessage) => void;
  onCancel: () => void;
};

export function MessageEditor({
  message,
  participants,
  currentUserId,
  allMessages = [],
  onSave,
  onCancel,
}: MessageEditorProps) {
  const isEditing = !!message;

  const [content, setContent] = useState(message?.content || '');
  const [senderId, setSenderId] = useState(message?.senderId || currentUserId);
  const [timestamp, setTimestamp] = useState(message?.timestamp || '10:30 AM');
  const [status, setStatus] = useState<MessageStatus>(message?.status || 'read');
  const [type, setType] = useState<ChatMessage['type']>(message?.type || 'text');
  const [mediaUrl, setMediaUrl] = useState(message?.mediaUrl || '');
  const [replyToId, setReplyToId] = useState<string | undefined>(message?.replyToId);
  const [reactions, setReactions] = useState<MessageReaction[]>(message?.reactions || []);
  const [isEdited, setIsEdited] = useState(message?.isEdited || false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getReplyToMessage = () => allMessages.find(m => m.id === replyToId);
  const getParticipantName = (id: string) => participants.find(p => p.id === id)?.name || 'Unknown';

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.slice(0, start) + emoji + content.slice(end);
      setContent(newContent);
      // Move cursor after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setContent(content + emoji);
    }
    setShowEmojiPicker(false);
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'code' | 'strikethrough') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);

    let wrappedText: string;
    let cursorOffset: number;

    switch (format) {
      case 'bold':
        wrappedText = selectedText ? `*${selectedText}*` : '*bold*';
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'italic':
        wrappedText = selectedText ? `_${selectedText}_` : '_italic_';
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'code':
        wrappedText = selectedText ? `\`${selectedText}\`` : '`code`';
        cursorOffset = selectedText ? 0 : -1;
        break;
      case 'strikethrough':
        wrappedText = selectedText ? `~${selectedText}~` : '~strikethrough~';
        cursorOffset = selectedText ? 0 : -1;
        break;
      default:
        return;
    }

    const newContent = content.slice(0, start) + wrappedText + content.slice(end);
    setContent(newContent);

    setTimeout(() => {
      const newCursorPos = start + wrappedText.length + cursorOffset;
      textarea.selectionStart = selectedText ? start : start + 1;
      textarea.selectionEnd = selectedText ? start + wrappedText.length : newCursorPos;
      textarea.focus();
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMessage: ChatMessage = {
      id: message?.id || `msg-${Date.now()}`,
      senderId,
      content,
      timestamp,
      status,
      type,
      mediaUrl: type === 'image' ? mediaUrl : undefined,
      reactions,
      replyToId,
      isDeleted: false,
      isEdited,
    };

    onSave(newMessage);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {isEditing ? 'Edit Message' : 'Add Message'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Sender Selection */}
        <div>
          <label htmlFor="sender" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sender
          </label>
          <select
            id="sender"
            value={senderId}
            onChange={e => setSenderId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {participants.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.id === currentUserId ? ' (You)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Reply To Selection */}
        {allMessages.length > 0 && (
          <div>
            <label htmlFor="replyTo" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reply To (Optional)
            </label>
            <select
              id="replyTo"
              value={replyToId || ''}
              onChange={e => setReplyToId(e.target.value || undefined)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">No reply</option>
              {allMessages
                .filter(m => m.id !== message?.id)
                .map(m => (
                  <option key={m.id} value={m.id}>
                    {getParticipantName(m.senderId)}
                    :
                    {' '}
                    {m.content.length > 30 ? `${m.content.slice(0, 30)}...` : m.content}
                  </option>
                ))}
            </select>
            {replyToId && (
              <div className="mt-2 rounded-lg border-l-4 border-blue-500 bg-gray-50 p-2 dark:bg-gray-700">
                <div className="text-xs font-semibold text-blue-600">
                  Replying to
                  {' '}
                  {getParticipantName(getReplyToMessage()?.senderId || '')}
                </div>
                <div className="mt-1 truncate text-sm text-gray-600 dark:text-gray-300">
                  {getReplyToMessage()?.content}
                </div>
                <button
                  type="button"
                  onClick={() => setReplyToId(undefined)}
                  className="mt-1 text-xs text-red-500 hover:text-red-700"
                >
                  Remove reply
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Type */}
        <div>
          <label htmlFor="type" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Message Type
          </label>
          <select
            id="type"
            value={type}
            onChange={e => setType(e.target.value as ChatMessage['type'])}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="voice">Voice Message</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="sticker">Sticker</option>
          </select>
        </div>

        {/* Media URL/Upload (for image type) */}
        {type === 'image' && (
          <div className="space-y-3">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>

            {/* Upload or URL toggle */}
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
                        setMediaUrl(dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Image
              </button>
              <span className="flex items-center text-xs text-gray-400">or</span>
            </div>

            {/* URL Input */}
            <input
              id="mediaUrl"
              type="url"
              value={mediaUrl}
              onChange={e => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />

            {/* Preview */}
            {mediaUrl && (
              <div className="relative">
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="h-32 w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  title="Remove image"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div>
          <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Message Content
          </label>

          {/* Formatting Toolbar */}
          <div className="mb-1 flex items-center gap-1 rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-700">
            <button
              type="button"
              onClick={() => applyFormatting('bold')}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
              title="Bold (*text*)"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => applyFormatting('italic')}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
              title="Italic (_text_)"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => applyFormatting('strikethrough')}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
              title="Strikethrough (~text~)"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M7 8h10M7 16h10" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => applyFormatting('code')}
              className="rounded p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
              title="Code (`text`)"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 5 4 5M16 7l4 5-4 5" />
              </svg>
            </button>
            <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-gray-500" />
            <span className="text-xs text-gray-400">Use *bold*, _italic_, ~strike~, `code`</span>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              placeholder="Type your message here..."
              className="w-full rounded-t-none rounded-b-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute top-2 right-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
              title="Add emoji"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full right-0 z-10 mt-1">
                <EmojiPicker
                  onSelect={insertEmoji}
                  onClose={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <div>
          <label htmlFor="timestamp" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Timestamp
          </label>
          <input
            id="timestamp"
            type="text"
            value={timestamp}
            onChange={e => setTimestamp(e.target.value)}
            placeholder="10:30 AM"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Status (only for sender messages) */}
        {senderId === currentUserId && (
          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message Status
            </label>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as MessageStatus)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="sending">Sending...</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        )}

        {/* Edited indicator toggle */}
        <div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isEdited}
              onChange={e => setIsEdited(e.target.checked)}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show "edited" indicator
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Shows "(edited)" label on the message in the mockup
          </p>
        </div>

        {/* Reactions */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-600">
          <ReactionPicker
            reactions={reactions}
            onReactionsChange={setReactions}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isEditing ? 'Update' : 'Add Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
