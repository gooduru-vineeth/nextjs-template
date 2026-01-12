'use client';

import { ChevronRight, Clock, GripVertical, MessageSquare, MoreHorizontal, Plus, Reply, Trash2, User } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type ThreadMessage = {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  timestamp: string;
  isReply?: boolean;
  replyTo?: string;
  reactions?: { emoji: string; count: number }[];
  attachments?: { type: string; url: string }[];
};

export type Thread = {
  id: string;
  title?: string;
  messages: ThreadMessage[];
  createdAt: string;
  participants: string[];
};

export type ThreadBuilderProps = {
  variant?: 'full' | 'compact' | 'inline' | 'timeline';
  threads?: Thread[];
  onThreadsChange?: (threads: Thread[]) => void;
  editable?: boolean;
  maxMessagesPerThread?: number;
  showTimestamps?: boolean;
  showAvatars?: boolean;
  platform?: 'twitter' | 'discord' | 'slack' | 'reddit' | 'generic';
  className?: string;
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(7)}`;

const ThreadBuilder: React.FC<ThreadBuilderProps> = ({
  variant = 'full',
  threads = [],
  onThreadsChange,
  editable = true,
  maxMessagesPerThread = 20,
  showTimestamps = true,
  showAvatars = true,
  platform = 'generic',
  className = '',
}) => {
  const [threadList, setThreadList] = useState<Thread[]>(threads);
  const [expandedThread, setExpandedThread] = useState<string | null>(threads[0]?.id || null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);

  useEffect(() => {
    setThreadList(threads);
  }, [threads]);

  const addThread = useCallback(() => {
    const newThread: Thread = {
      id: generateId(),
      messages: [
        {
          id: generateId(),
          content: 'New thread message...',
          author: 'You',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      createdAt: new Date().toISOString(),
      participants: ['You'],
    };

    const newThreads = [...threadList, newThread];
    setThreadList(newThreads);
    onThreadsChange?.(newThreads);
    setExpandedThread(newThread.id);
  }, [threadList, onThreadsChange]);

  const removeThread = useCallback((threadId: string) => {
    const newThreads = threadList.filter(t => t.id !== threadId);
    setThreadList(newThreads);
    onThreadsChange?.(newThreads);
  }, [threadList, onThreadsChange]);

  const addMessage = useCallback((threadId: string, replyTo?: string) => {
    const newThreads = threadList.map((thread) => {
      if (thread.id === threadId && thread.messages.length < maxMessagesPerThread) {
        const newMessage: ThreadMessage = {
          id: generateId(),
          content: 'New message...',
          author: 'You',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isReply: !!replyTo,
          replyTo,
        };
        return {
          ...thread,
          messages: [...thread.messages, newMessage],
        };
      }
      return thread;
    });

    setThreadList(newThreads);
    onThreadsChange?.(newThreads);
  }, [threadList, maxMessagesPerThread, onThreadsChange]);

  const removeMessage = useCallback((threadId: string, messageId: string) => {
    const newThreads = threadList.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          messages: thread.messages.filter(m => m.id !== messageId),
        };
      }
      return thread;
    });

    setThreadList(newThreads);
    onThreadsChange?.(newThreads);
  }, [threadList, onThreadsChange]);

  const updateMessage = useCallback((threadId: string, messageId: string, content: string) => {
    const newThreads = threadList.map((thread) => {
      if (thread.id === threadId) {
        return {
          ...thread,
          messages: thread.messages.map(m =>
            m.id === messageId ? { ...m, content } : m,
          ),
        };
      }
      return thread;
    });

    setThreadList(newThreads);
    onThreadsChange?.(newThreads);
    setEditingMessage(null);
  }, [threadList, onThreadsChange]);

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`space-y-2 ${className}`}>
        {threadList.map(thread => (
          <div key={thread.id} className="flex items-start gap-2">
            <div className="w-1 self-stretch rounded-full bg-blue-500" />
            <div className="flex-1 space-y-1">
              {thread.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`text-sm ${index > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}
                >
                  {message.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {threadList.map(thread => (
          <div key={thread.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare size={14} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Thread •
                {' '}
                {thread.messages.length}
                {' '}
                messages
              </span>
              {editable && (
                <button
                  onClick={() => removeThread(thread.id)}
                  className="ml-auto p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {thread.messages.slice(0, 3).map(message => (
                <div key={message.id} className="flex items-start gap-2">
                  {showAvatars && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                      <User size={12} className="text-gray-500" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {message.author}
                    </div>
                    <div className="truncate text-sm text-gray-600 dark:text-gray-400">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {thread.messages.length > 3 && (
                <div className="text-xs text-blue-500">
                  +
                  {thread.messages.length - 3}
                  {' '}
                  more messages
                </div>
              )}
            </div>
          </div>
        ))}
        {editable && (
          <button
            onClick={addThread}
            className="w-full rounded-lg border border-dashed border-blue-300 p-2 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={14} className="mr-1 inline" />
            Add Thread
          </button>
        )}
      </div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className={`relative ${className}`}>
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-4">
          {threadList.flatMap(thread =>
            thread.messages.map((message, msgIndex) => (
              <div key={message.id} className="relative flex items-start gap-4 pl-8">
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${
                    msgIndex === 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />

                <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-1 flex items-center gap-2">
                    {showAvatars && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs text-white">
                        {message.author.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {message.author}
                    </span>
                    {showTimestamps && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={10} />
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {message.content}
                  </div>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <MessageSquare size={18} />
            Thread Builder
          </h4>
          <span className="text-xs text-gray-500 capitalize dark:text-gray-400">
            {platform}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create conversation threads with multiple messages
        </p>
      </div>

      {/* Threads list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {threadList.map((thread, threadIndex) => (
          <div key={thread.id} className="p-4">
            {/* Thread header */}
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
            >
              {editable && (
                <div className="cursor-grab text-gray-400">
                  <GripVertical size={16} />
                </div>
              )}
              <ChevronRight
                size={16}
                className={`text-gray-400 transition-transform ${
                  expandedThread === thread.id ? 'rotate-90' : ''
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thread
                    {' '}
                    {threadIndex + 1}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {thread.messages.length}
                    {' '}
                    message
                    {thread.messages.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              {editable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeThread(thread.id);
                  }}
                  className="p-1 text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Expanded thread content */}
            {expandedThread === thread.id && (
              <div className="mt-4 ml-6 space-y-3">
                {thread.messages.map((message, msgIndex) => (
                  <div key={message.id} className="relative">
                    {/* Thread line */}
                    {msgIndex < thread.messages.length - 1 && (
                      <div className="absolute top-8 bottom-0 left-3 w-0.5 bg-gray-200 dark:bg-gray-700" />
                    )}

                    <div className="flex items-start gap-3">
                      {showAvatars && (
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs text-white">
                          {message.author.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {message.author}
                          </span>
                          {showTimestamps && (
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          )}
                          {message.isReply && (
                            <span className="flex items-center gap-1 text-xs text-blue-500">
                              <Reply size={10} />
                              Reply
                            </span>
                          )}
                        </div>

                        {editingMessage === message.id && editable
                          ? (
                              <textarea
                                autoFocus
                                defaultValue={message.content}
                                onBlur={e => updateMessage(thread.id, message.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    updateMessage(thread.id, message.id, e.currentTarget.value);
                                  }
                                  if (e.key === 'Escape') {
                                    setEditingMessage(null);
                                  }
                                }}
                                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                                rows={2}
                              />
                            )
                          : (
                              <div
                                className={`text-sm text-gray-600 dark:text-gray-400 ${
                                  editable ? '-m-1 cursor-text rounded p-1 hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                                }`}
                                onClick={() => editable && setEditingMessage(message.id)}
                              >
                                {message.content}
                              </div>
                            )}

                        {editable && (
                          <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 hover:opacity-100">
                            <button
                              onClick={() => addMessage(thread.id, message.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500"
                            >
                              <Reply size={12} />
                              Reply
                            </button>
                            <button
                              onClick={() => removeMessage(thread.id, message.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                            <button className="text-xs text-gray-500 hover:text-gray-700">
                              <MoreHorizontal size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add message button */}
                {editable && thread.messages.length < maxMessagesPerThread && (
                  <button
                    onClick={() => addMessage(thread.id)}
                    className="ml-9 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Plus size={14} />
                    Add message
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add thread button */}
      {editable && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={addThread}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 p-3 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={16} />
            New Thread
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreadBuilder;
