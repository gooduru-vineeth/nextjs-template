'use client';

import { AtSign, Check, Search, User, Users, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type MentionUser = {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  verified?: boolean;
  followers?: number;
};

export type MentionEditorProps = {
  variant?: 'full' | 'compact' | 'inline' | 'suggestions';
  mentions?: MentionUser[];
  onChange?: (mentions: MentionUser[]) => void;
  maxMentions?: number;
  suggestedUsers?: MentionUser[];
  placeholder?: string;
  showVerified?: boolean;
  showFollowers?: boolean;
  className?: string;
};

const defaultSuggestions: MentionUser[] = [
  { id: '1', username: 'johndoe', displayName: 'John Doe', verified: true, followers: 125000 },
  { id: '2', username: 'janesmit', displayName: 'Jane Smith', verified: true, followers: 89000 },
  { id: '3', username: 'techguru', displayName: 'Tech Guru', verified: false, followers: 45000 },
  { id: '4', username: 'designmaster', displayName: 'Design Master', verified: true, followers: 234000 },
  { id: '5', username: 'creativelabs', displayName: 'Creative Labs', verified: true, followers: 567000 },
  { id: '6', username: 'startuphub', displayName: 'Startup Hub', verified: false, followers: 78000 },
  { id: '7', username: 'devlife', displayName: 'Dev Life', verified: false, followers: 34000 },
  { id: '8', username: 'uxinsights', displayName: 'UX Insights', verified: true, followers: 156000 },
];

const MentionEditor: React.FC<MentionEditorProps> = ({
  variant = 'full',
  mentions = [],
  onChange,
  maxMentions = 10,
  suggestedUsers = defaultSuggestions,
  placeholder = 'Mention users...',
  showVerified = true,
  showFollowers = true,
  className = '',
}) => {
  const [mentionedUsers, setMentionedUsers] = useState<MentionUser[]>(mentions);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMentionedUsers(mentions);
  }, [mentions]);

  const formatFollowers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const addMention = useCallback((user: MentionUser) => {
    if (mentionedUsers.length >= maxMentions) {
      return;
    }
    if (mentionedUsers.some(m => m.id === user.id)) {
      return;
    }

    const newMentions = [...mentionedUsers, user];
    setMentionedUsers(newMentions);
    onChange?.(newMentions);
    setInputValue('');
    setShowDropdown(false);
  }, [mentionedUsers, maxMentions, onChange]);

  const removeMention = useCallback((id: string) => {
    const newMentions = mentionedUsers.filter(m => m.id !== id);
    setMentionedUsers(newMentions);
    onChange?.(newMentions);
  }, [mentionedUsers, onChange]);

  const filteredSuggestions = suggestedUsers.filter((user) => {
    if (mentionedUsers.some(m => m.id === user.id)) {
      return false;
    }
    if (!inputValue) {
      return true;
    }
    const search = inputValue.toLowerCase().replace('@', '');
    return (
      user.username.toLowerCase().includes(search)
      || user.displayName.toLowerCase().includes(search)
    );
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !inputValue && mentionedUsers.length > 0) {
      removeMention(mentionedUsers[mentionedUsers.length - 1]!.id);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }, [inputValue, mentionedUsers, removeMention]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  }, []);

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-1 ${className}`}>
        {mentionedUsers.map(user => (
          <span
            key={user.id}
            className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          >
            @
            {user.username}
            {user.verified && showVerified && (
              <Check size={10} className="text-blue-500" />
            )}
            <button
              onClick={() => removeMention(user.id)}
              className="hover:text-red-500"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <div className="relative min-w-[80px] flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder={mentionedUsers.length === 0 ? placeholder : ''}
            className="w-full border-none bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
          />
          {showDropdown && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-1 max-h-40 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {filteredSuggestions.slice(0, 5).map(user => (
                <button
                  key={user.id}
                  onClick={() => addMention(user)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User size={14} className="text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200">
                    @
                    {user.username}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="relative">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
            <AtSign size={14} className="text-gray-400" />
            {mentionedUsers.map(user => (
              <span
                key={user.id}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                @
                {user.username}
                <button
                  onClick={() => removeMention(user.id)}
                  className="hover:text-red-500"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder={mentionedUsers.length === 0 ? placeholder : ''}
              className="min-w-[60px] flex-1 border-none bg-transparent text-xs text-gray-700 outline-none dark:text-gray-300"
            />
          </div>
          {showDropdown && filteredSuggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {filteredSuggestions.slice(0, 5).map(user => (
                <button
                  key={user.id}
                  onClick={() => addMention(user)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <User size={12} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                      @
                      {user.username}
                      {user.verified && showVerified && (
                        <Check size={10} className="text-blue-500" />
                      )}
                    </div>
                    <div className="text-gray-500">{user.displayName}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {mentionedUsers.length}
          /
          {maxMentions}
          {' '}
          mentions
        </div>
      </div>
    );
  }

  // Suggestions variant
  if (variant === 'suggestions') {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Current mentions */}
        {mentionedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mentionedUsers.map(user => (
              <span
                key={user.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 text-sm text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              >
                @
                {user.username}
                {user.verified && showVerified && (
                  <Check size={12} className="text-blue-500" />
                )}
                <button
                  onClick={() => removeMention(user.id)}
                  className="hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggestions */}
        <div>
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Users size={12} />
            Suggested Users
          </div>
          <div className="flex flex-wrap gap-1">
            {filteredSuggestions.slice(0, 6).map(user => (
              <button
                key={user.id}
                onClick={() => addMention(user)}
                disabled={mentionedUsers.length >= maxMentions}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                @
                {user.username}
                {user.verified && showVerified && (
                  <Check size={10} className="text-blue-500" />
                )}
              </button>
            ))}
          </div>
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
            <AtSign size={18} />
            Mentions
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {mentionedUsers.length}
            /
            {maxMentions}
          </span>
        </div>
      </div>

      {/* Input area */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="relative">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <Search size={16} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search users to mention..."
              className="flex-1 border-none bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
            />
          </div>

          {/* Dropdown */}
          {showDropdown && filteredSuggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              {filteredSuggestions.slice(0, 8).map(user => (
                <button
                  key={user.id}
                  onClick={() => addMention(user)}
                  disabled={mentionedUsers.length >= maxMentions}
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-0 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-medium text-white">
                    {user.displayName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {user.displayName}
                      </span>
                      {user.verified && showVerified && (
                        <Check size={14} className="text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        @
                        {user.username}
                      </span>
                      {showFollowers && user.followers && (
                        <span>
                          •
                          {formatFollowers(user.followers)}
                          {' '}
                          followers
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected mentions */}
        {mentionedUsers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {mentionedUsers.map(user => (
              <div
                key={user.id}
                className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/30"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xs font-medium text-white">
                  {user.displayName.charAt(0)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    @
                    {user.username}
                  </span>
                  {user.verified && showVerified && (
                    <Check size={12} className="text-blue-500" />
                  )}
                </div>
                <button
                  onClick={() => removeMention(user.id)}
                  className="text-blue-500 transition-colors hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested users */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Users size={14} />
          Suggested Users
        </div>
        <div className="grid grid-cols-2 gap-2">
          {filteredSuggestions.slice(0, 6).map(user => (
            <button
              key={user.id}
              onClick={() => addMention(user)}
              disabled={mentionedUsers.length >= maxMentions}
              className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-sm font-medium text-white dark:from-gray-600 dark:to-gray-700">
                {user.displayName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  @
                  {user.username}
                  {user.verified && showVerified && (
                    <Check size={10} className="flex-shrink-0 text-blue-500" />
                  )}
                </div>
                {showFollowers && user.followers && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFollowers(user.followers)}
                    {' '}
                    followers
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentionEditor;
