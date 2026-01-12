'use client';

import {
  Eye,
  EyeOff,
  MessageCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export type CursorPosition = {
  x: number;
  y: number;
  timestamp?: number;
};

export type Collaborator = {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor: CursorPosition;
  isTyping?: boolean;
  isIdle?: boolean;
  selectedElementId?: string;
  lastActive?: number;
};

export type CollaborationCursorProps = {
  collaborators: Collaborator[];
  currentUserId?: string;
  onCursorMove?: (position: CursorPosition) => void;
  onFollow?: (collaboratorId: string) => void;
  followingId?: string;
  variant?: 'full' | 'cursor-only' | 'avatar' | 'minimal';
  showNames?: boolean;
  showActivity?: boolean;
  smoothAnimation?: boolean;
  idleTimeout?: number;
  darkMode?: boolean;
  className?: string;
};

export default function CollaborationCursor({
  collaborators,
  currentUserId,
  onCursorMove,
  onFollow,
  followingId,
  variant = 'full',
  showNames = true,
  showActivity = true,
  smoothAnimation = true,
  idleTimeout = 30000,
  darkMode = false,
  className = '',
}: CollaborationCursorProps) {
  const [hoveredCursor, setHoveredCursor] = useState<string | null>(null);
  const [cursorPositions, setCursorPositions] = useState<Map<string, CursorPosition>>(new Map());

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  // Filter out current user and idle collaborators
  const activeCollaborators = collaborators.filter((c) => {
    if (c.id === currentUserId) {
      return false;
    }
    if (c.lastActive && Date.now() - c.lastActive > idleTimeout) {
      return false;
    }
    return true;
  });

  // Smooth cursor animation
  useEffect(() => {
    if (!smoothAnimation) {
      return;
    }

    const updatePositions = () => {
      setCursorPositions((prev) => {
        const next = new Map(prev);
        activeCollaborators.forEach((collaborator) => {
          const current = next.get(collaborator.id) || collaborator.cursor;
          const target = collaborator.cursor;

          // Lerp towards target position
          const newX = current.x + (target.x - current.x) * 0.3;
          const newY = current.y + (target.y - current.y) * 0.3;

          next.set(collaborator.id, { x: newX, y: newY });
        });
        return next;
      });
    };

    const interval = setInterval(updatePositions, 16); // ~60fps
    return () => clearInterval(interval);
  }, [activeCollaborators, smoothAnimation]);

  const getCursorPosition = useCallback((collaborator: Collaborator): CursorPosition => {
    if (smoothAnimation) {
      return cursorPositions.get(collaborator.id) || collaborator.cursor;
    }
    return collaborator.cursor;
  }, [smoothAnimation, cursorPositions]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = document.body.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onCursorMove?.({ x, y, timestamp: Date.now() });
  }, [onCursorMove]);

  useEffect(() => {
    if (onCursorMove) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
    return undefined;
  }, [onCursorMove, handleMouseMove]);

  const renderCursorSvg = (color: string) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 3.5L18.5 10L12 12L10 18.5L5.5 3.5Z"
        fill={color}
        stroke={darkMode ? '#000' : '#fff'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Minimal variant - just show cursor count
  if (variant === 'minimal') {
    return (
      <div className={`${bgColor} rounded-full border px-3 py-1.5 ${borderColor} flex items-center gap-2 ${className}`}>
        <div className="flex -space-x-1">
          {activeCollaborators.slice(0, 3).map(c => (
            <div
              key={c.id}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white dark:border-gray-800"
              style={{ backgroundColor: c.color }}
            >
              {c.avatar
                ? (
                    <img src={c.avatar} alt={c.name} className="h-full w-full rounded-full object-cover" />
                  )
                : (
                    c.name.charAt(0)
                  )}
            </div>
          ))}
        </div>
        {activeCollaborators.length > 3 && (
          <span className={`text-xs ${mutedColor}`}>
            +
            {activeCollaborators.length - 3}
          </span>
        )}
        <span className={`text-xs ${mutedColor}`}>online</span>
      </div>
    );
  }

  // Avatar variant - floating avatars
  if (variant === 'avatar') {
    return (
      <div className={`pointer-events-none fixed inset-0 z-50 ${className}`}>
        {activeCollaborators.map((collaborator) => {
          const pos = getCursorPosition(collaborator);
          const isHovered = hoveredCursor === collaborator.id;
          const isFollowing = followingId === collaborator.id;

          return (
            <div
              key={collaborator.id}
              className="absolute transition-transform"
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className={`pointer-events-auto relative cursor-pointer ${
                  isFollowing ? 'ring-2 ring-offset-2' : ''
                }`}
                style={isFollowing ? { ['--tw-ring-color' as string]: collaborator.color } : undefined}
                onMouseEnter={() => setHoveredCursor(collaborator.id)}
                onMouseLeave={() => setHoveredCursor(null)}
                onClick={() => onFollow?.(collaborator.id)}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white font-medium text-white shadow-lg dark:border-gray-800"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.avatar
                    ? (
                        <img src={collaborator.avatar} alt={collaborator.name} className="h-full w-full rounded-full object-cover" />
                      )
                    : (
                        collaborator.name.charAt(0)
                      )}
                </div>

                {/* Typing indicator */}
                {collaborator.isTyping && (
                  <div className="absolute -right-1 -bottom-1 flex gap-0.5 rounded-full bg-white px-1.5 py-0.5 dark:bg-gray-800">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '300ms' }} />
                  </div>
                )}

                {/* Hover tooltip */}
                {isHovered && showNames && (
                  <div className={`absolute top-full left-1/2 mt-2 -translate-x-1/2 ${bgColor} rounded border px-2 py-1 shadow-lg ${borderColor} whitespace-nowrap`}>
                    <span className={`text-xs ${textColor}`}>{collaborator.name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Cursor-only variant - just cursors without labels
  if (variant === 'cursor-only') {
    return (
      <div className={`pointer-events-none fixed inset-0 z-50 ${className}`}>
        {activeCollaborators.map((collaborator) => {
          const pos = getCursorPosition(collaborator);

          return (
            <div
              key={collaborator.id}
              className="absolute transition-transform"
              style={{
                left: pos.x,
                top: pos.y,
              }}
            >
              {renderCursorSvg(collaborator.color)}
            </div>
          );
        })}
      </div>
    );
  }

  // Full variant (default) - cursors with names and activity
  return (
    <div className={`pointer-events-none fixed inset-0 z-50 ${className}`}>
      {activeCollaborators.map((collaborator) => {
        const pos = getCursorPosition(collaborator);
        const isHovered = hoveredCursor === collaborator.id;
        const isFollowing = followingId === collaborator.id;
        const isIdle = collaborator.isIdle;

        return (
          <div
            key={collaborator.id}
            className={`absolute transition-all ${smoothAnimation ? 'duration-75' : ''} ${
              isIdle ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              left: pos.x,
              top: pos.y,
            }}
          >
            {/* Cursor */}
            <div className="relative">
              {renderCursorSvg(collaborator.color)}

              {/* Selection highlight */}
              {collaborator.selectedElementId && (
                <div
                  className="absolute top-6 left-0 rounded px-1.5 py-0.5 text-xs whitespace-nowrap"
                  style={{ backgroundColor: `${collaborator.color}20`, color: collaborator.color }}
                >
                  Selecting...
                </div>
              )}
            </div>

            {/* Label */}
            {showNames && (
              <div
                className="pointer-events-auto absolute top-4 left-4"
                onMouseEnter={() => setHoveredCursor(collaborator.id)}
                onMouseLeave={() => setHoveredCursor(null)}
                onClick={() => onFollow?.(collaborator.id)}
              >
                <div
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 shadow-lg ${
                    isFollowing ? 'ring-2 ring-offset-1' : ''
                  }`}
                  style={{
                    backgroundColor: collaborator.color,
                    ...(isFollowing ? { ['--tw-ring-color' as string]: collaborator.color } : {}),
                  }}
                >
                  {/* Avatar */}
                  {collaborator.avatar && (
                    <img
                      src={collaborator.avatar}
                      alt={collaborator.name}
                      className="h-4 w-4 rounded-full"
                    />
                  )}

                  {/* Name */}
                  <span className="max-w-[100px] truncate text-xs font-medium text-white">
                    {collaborator.name}
                  </span>

                  {/* Activity indicator */}
                  {showActivity && (
                    <>
                      {collaborator.isTyping && (
                        <MessageCircle size={10} className="text-white/80" />
                      )}
                      {isIdle && (
                        <EyeOff size={10} className="text-white/60" />
                      )}
                    </>
                  )}
                </div>

                {/* Expanded info on hover */}
                {isHovered && (
                  <div className={`absolute top-full left-0 mt-1 ${bgColor} rounded-lg border p-3 shadow-xl ${borderColor} min-w-[150px]`}>
                    <div className="mb-2 flex items-center gap-2">
                      {collaborator.avatar
                        ? (
                            <img src={collaborator.avatar} alt={collaborator.name} className="h-8 w-8 rounded-full" />
                          )
                        : (
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-full font-medium text-white"
                              style={{ backgroundColor: collaborator.color }}
                            >
                              {collaborator.name.charAt(0)}
                            </div>
                          )}
                      <div>
                        <p className={`font-medium ${textColor}`}>{collaborator.name}</p>
                        <p className={`text-xs ${mutedColor}`}>
                          {collaborator.isTyping ? 'Typing...' : isIdle ? 'Idle' : 'Active'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-500 px-2 py-1.5 text-xs text-white hover:bg-blue-600"
                        onClick={(e) => {
                          e.stopPropagation(); onFollow?.(collaborator.id);
                        }}
                      >
                        <Eye size={12} />
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Following indicator */}
      {followingId && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 ${bgColor} rounded-full border px-4 py-2 shadow-lg ${borderColor} pointer-events-auto flex items-center gap-2`}>
          <Eye size={14} className="text-blue-500" />
          <span className={`text-sm ${textColor}`}>
            Following
            {' '}
            {activeCollaborators.find(c => c.id === followingId)?.name}
          </span>
          <button
            onClick={() => onFollow?.('')}
            className={`text-xs ${mutedColor} hover:underline`}
          >
            Stop
          </button>
        </div>
      )}

      {/* Online users indicator */}
      <div className={`fixed top-4 right-4 ${bgColor} rounded-lg border px-3 py-2 shadow-lg ${borderColor} pointer-events-auto flex items-center gap-3`}>
        <div className="flex -space-x-2">
          {activeCollaborators.slice(0, 5).map(c => (
            <div
              key={c.id}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white dark:border-gray-800"
              style={{ backgroundColor: c.color }}
              onClick={() => onFollow?.(c.id)}
              title={c.name}
            >
              {c.avatar
                ? (
                    <img src={c.avatar} alt={c.name} className="h-full w-full rounded-full object-cover" />
                  )
                : (
                    c.name.charAt(0)
                  )}
            </div>
          ))}
          {activeCollaborators.length > 5 && (
            <div className={`h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 ${bgColor} flex items-center justify-center text-xs ${mutedColor}`}>
              +
              {activeCollaborators.length - 5}
            </div>
          )}
        </div>
        <span className={`text-sm ${mutedColor}`}>
          {activeCollaborators.length}
          {' '}
          online
        </span>
      </div>
    </div>
  );
}
