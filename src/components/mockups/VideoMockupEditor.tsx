'use client';

import {
  Bookmark,
  ChevronDown,
  Compass,
  Download,
  Heart,
  Home,
  Maximize,
  MessageSquare,
  MoreHorizontal,
  Music2,
  Play,
  PlaySquare,
  Plus,
  Repeat,
  Search,
  Settings,
  Share2,
  ThumbsDown,
  ThumbsUp,
  User,
  Volume2,
} from 'lucide-react';
import { useState } from 'react';

// Types
export type VideoPlatform = 'youtube' | 'tiktok' | 'shorts';
export type VideoTheme = 'light' | 'dark';

export type VideoCreator = {
  name: string;
  handle: string;
  avatar?: string;
  subscribers: number;
  verified: boolean;
};

export type VideoComment = {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  likes: number;
  date: Date;
  replies?: number;
};

export type VideoInfo = {
  title: string;
  description: string;
  creator: VideoCreator;
  views: number;
  likes: number;
  dislikes?: number;
  comments: number;
  publishedAt: Date;
  duration: string;
  thumbnail?: string;
  hashtags?: string[];
  musicTrack?: {
    name: string;
    artist: string;
  };
  commentsList?: VideoComment[];
};

export type VideoMockupEditorProps = {
  platform?: VideoPlatform;
  theme?: VideoTheme;
  videoInfo?: VideoInfo;
  variant?: 'full' | 'compact' | 'preview';
  onPlatformChange?: (platform: VideoPlatform) => void;
  onExport?: () => void;
};

// Mock data
const generateMockVideoInfo = (): VideoInfo => ({
  title: 'How to Create Stunning Mockups in 5 Minutes | MockFlow Tutorial',
  description: `In this tutorial, I'll show you how to create professional-looking mockups for your projects using MockFlow.

🔥 What you'll learn:
• Setting up your first mockup project
• Using templates effectively
• Customizing every element
• Exporting in high resolution

📚 Resources:
• MockFlow: https://mockflow.com
• Free templates: https://mockflow.com/templates

⏰ Timestamps:
0:00 - Introduction
1:23 - Getting Started
3:45 - Template Selection
5:12 - Customization Tips
7:30 - Export Options
9:15 - Pro Tips & Tricks

#mockflow #design #tutorial #uidesign`,
  creator: {
    name: 'MockFlow',
    handle: '@mockflow',
    subscribers: 125000,
    verified: true,
  },
  views: 45678,
  likes: 3421,
  dislikes: 42,
  comments: 234,
  publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  duration: '10:32',
  hashtags: ['mockflow', 'design', 'tutorial', 'uidesign'],
  musicTrack: {
    name: 'Creative Vibes',
    artist: 'Electronic Dreams',
  },
  commentsList: [
    {
      id: 'c1',
      author: 'DesignFan2024',
      content: 'This is exactly what I was looking for! Great tutorial 🔥',
      likes: 142,
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      replies: 5,
    },
    {
      id: 'c2',
      author: 'UIUXPro',
      content: 'The export feature is amazing. Just saved hours of work!',
      likes: 89,
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      replies: 2,
    },
    {
      id: 'c3',
      author: 'NewDesigner',
      content: 'Can you make a tutorial on creating mobile app mockups?',
      likes: 56,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      replies: 1,
    },
  ],
});

// Helper functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`;
  }
  if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  }
  return `${diffYears} years ago`;
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// YouTube Component
const YouTubeInterface = ({ videoInfo, theme }: { videoInfo: VideoInfo; theme: VideoTheme }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div className={`overflow-hidden rounded-xl ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-white text-gray-900'}`}>
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
            <Play className="ml-1 h-8 w-8 fill-white text-white" />
          </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute right-0 bottom-0 left-0 p-3">
          <div className="flex items-center gap-2 text-sm text-white">
            <span>0:00</span>
            <div className="h-1 flex-1 rounded-full bg-gray-600">
              <div className="h-1 w-1/3 rounded-full bg-red-600" />
            </div>
            <span>{videoInfo.duration}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Play className="h-5 w-5" />
              <Volume2 className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-4">
              <Settings className="h-5 w-5" />
              <Maximize className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h1 className={`text-lg leading-tight font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {videoInfo.title}
        </h1>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {formatNumber(videoInfo.views)}
            {' '}
            views
          </span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>•</span>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {formatDate(videoInfo.publishedAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
          <button className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDark ? 'bg-[#272727] hover:bg-[#3f3f3f]' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <ThumbsUp className="h-5 w-5" />
            <span className="font-medium">{formatNumber(videoInfo.likes)}</span>
            <div className={`h-6 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            <ThumbsDown className="h-5 w-5" />
          </button>
          <button className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDark ? 'bg-[#272727] hover:bg-[#3f3f3f]' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share</span>
          </button>
          <button className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDark ? 'bg-[#272727] hover:bg-[#3f3f3f]' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Download className="h-5 w-5" />
            <span className="font-medium">Download</span>
          </button>
          <button className={`flex items-center gap-2 rounded-full px-4 py-2 ${isDark ? 'bg-[#272727] hover:bg-[#3f3f3f]' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Bookmark className="h-5 w-5" />
            <span className="font-medium">Save</span>
          </button>
        </div>

        {/* Channel Info */}
        <div className={`mt-4 flex items-center justify-between rounded-xl p-4 ${isDark ? 'bg-[#272727]' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
              {getInitials(videoInfo.creator.name)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{videoInfo.creator.name}</span>
                {videoInfo.creator.verified && (
                  <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatNumber(videoInfo.creator.subscribers)}
                {' '}
                subscribers
              </span>
            </div>
          </div>
          <button className="rounded-full bg-white px-4 py-2 font-medium text-black">
            Subscribe
          </button>
        </div>

        {/* Description */}
        <div className={`mt-4 rounded-xl p-4 ${isDark ? 'bg-[#272727]' : 'bg-gray-100'}`}>
          <p className={`text-sm whitespace-pre-line ${!showFullDescription ? 'line-clamp-3' : ''}`}>
            {videoInfo.description}
          </p>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 text-sm font-medium"
          >
            {showFullDescription ? 'Show less' : 'Show more'}
          </button>
        </div>

        {/* Comments */}
        <div className="mt-4">
          <div className="mb-4 flex items-center gap-6">
            <span className="font-medium">
              {formatNumber(videoInfo.comments)}
              {' '}
              Comments
            </span>
            <button className="flex items-center gap-2 text-sm">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
              </svg>
              Sort by
            </button>
          </div>

          {/* Add Comment */}
          <div className="mb-6 flex items-start gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-[#272727]' : 'bg-gray-200'}`}>
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                className={`w-full border-b bg-transparent pb-1 outline-none ${isDark ? 'border-gray-700 text-white placeholder:text-gray-500' : 'border-gray-300 placeholder:text-gray-400'}`}
              />
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {videoInfo.commentsList?.map(comment => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-sm font-medium text-white">
                  {comment.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatDate(comment.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button>
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                    <button className="text-sm font-medium">Reply</button>
                  </div>
                  {comment.replies && comment.replies > 0 && (
                    <button className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-500">
                      <ChevronDown className="h-4 w-4" />
                      {comment.replies}
                      {' '}
                      replies
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// TikTok Component
const TikTokInterface = ({ videoInfo, theme: _theme }: { videoInfo: VideoInfo; theme: VideoTheme }) => {
  void _theme;
  return (
    <div className="relative h-[667px] w-[375px] overflow-hidden rounded-3xl bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black" />

      {/* Top Bar */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
        <button className="p-2">
          <Search className="h-6 w-6 text-white" />
        </button>
        <div className="flex items-center gap-4">
          <span className="text-lg text-white/60">Following</span>
          <span className="border-b-2 border-white pb-1 text-lg font-semibold text-white">For You</span>
        </div>
        <button className="p-2">
          <Play className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Play className="ml-1 h-10 w-10 fill-white text-white" />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="absolute right-3 bottom-32 z-10 flex flex-col items-center gap-6">
        {/* Profile */}
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-pink-500 to-purple-600 font-bold text-white">
            {getInitials(videoInfo.creator.name)}
          </div>
          <div className="absolute -bottom-2 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full bg-pink-500">
            <Plus className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Like */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">{formatNumber(videoInfo.likes)}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <MessageSquare className="h-7 w-7 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">{formatNumber(videoInfo.comments)}</span>
        </button>

        {/* Bookmark */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Bookmark className="h-7 w-7 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">Save</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Share2 className="h-7 w-7 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">Share</span>
        </button>

        {/* Music Disc */}
        <div className="animate-spin-slow flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-700 bg-gray-800">
          <Music2 className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute right-16 bottom-20 left-0 z-10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-semibold text-white">{videoInfo.creator.handle}</span>
          {videoInfo.creator.verified && (
            <svg className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          )}
        </div>
        <p className="mb-2 line-clamp-2 text-sm text-white">
          {videoInfo.title}
        </p>
        <div className="mb-2 flex flex-wrap gap-1">
          {videoInfo.hashtags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-sm font-medium text-white">
              #
              {tag}
            </span>
          ))}
        </div>
        {videoInfo.musicTrack && (
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-white" />
            <span className="text-sm text-white">
              {videoInfo.musicTrack.name}
              {' '}
              -
              {videoInfo.musicTrack.artist}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-around bg-black p-4">
        <button className="flex flex-col items-center gap-1">
          <Home className="h-6 w-6 text-white" />
          <span className="text-xs text-white">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Compass className="h-6 w-6 text-white/60" />
          <span className="text-xs text-white/60">Discover</span>
        </button>
        <button className="flex h-8 w-12 items-center justify-center rounded-lg bg-white">
          <Plus className="h-5 w-5 text-black" />
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageSquare className="h-6 w-6 text-white/60" />
          <span className="text-xs text-white/60">Inbox</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <User className="h-6 w-6 text-white/60" />
          <span className="text-xs text-white/60">Profile</span>
        </button>
      </div>
    </div>
  );
};

// YouTube Shorts Component
const YouTubeShortsInterface = ({ videoInfo, theme: _theme }: { videoInfo: VideoInfo; theme: VideoTheme }) => {
  void _theme;
  return (
    <div className="relative h-[667px] w-[375px] overflow-hidden rounded-3xl bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black" />

      {/* Top Bar */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
        <button className="p-2">
          <Search className="h-6 w-6 text-white" />
        </button>
        <span className="text-lg font-semibold text-white">Shorts</span>
        <button className="p-2">
          <MoreHorizontal className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Play className="ml-1 h-10 w-10 fill-white text-white" />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="absolute right-3 bottom-32 z-10 flex flex-col items-center gap-5">
        {/* Like */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <ThumbsUp className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">{formatNumber(videoInfo.likes)}</span>
        </button>

        {/* Dislike */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <ThumbsDown className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">Dislike</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">{formatNumber(videoInfo.comments)}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">Share</span>
        </button>

        {/* Remix */}
        <button className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Repeat className="h-6 w-6 text-white" />
          </div>
          <span className="mt-1 text-xs text-white">Remix</span>
        </button>

        {/* Channel */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-white bg-gradient-to-br from-red-500 to-pink-600 text-sm font-bold text-white">
          {getInitials(videoInfo.creator.name)}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute right-16 bottom-16 left-0 z-10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-semibold text-white">{videoInfo.creator.handle}</span>
          <span className="text-white/60">•</span>
          <button className="rounded-full border border-white px-3 py-1 text-sm text-white">
            Subscribe
          </button>
        </div>
        <p className="mb-2 line-clamp-2 text-sm text-white">
          {videoInfo.title}
        </p>
        {videoInfo.musicTrack && (
          <div className="flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-2">
            <Music2 className="h-4 w-4 text-white" />
            <span className="max-w-[200px] truncate text-sm text-white">
              {videoInfo.musicTrack.name}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-around bg-black p-3">
        <button className="flex flex-col items-center gap-0.5">
          <Home className="h-6 w-6 text-white/60" />
          <span className="text-[10px] text-white/60">Home</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <PlaySquare className="h-6 w-6 text-white" />
          <span className="text-[10px] text-white">Shorts</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
          <Plus className="h-6 w-6 text-black" />
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <PlaySquare className="h-6 w-6 text-white/60" />
          <span className="text-[10px] text-white/60">Subscriptions</span>
        </button>
        <button className="flex flex-col items-center gap-0.5">
          <User className="h-6 w-6 text-white/60" />
          <span className="text-[10px] text-white/60">You</span>
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function VideoMockupEditor({
  platform = 'youtube',
  theme = 'dark',
  videoInfo = generateMockVideoInfo(),
  variant = 'full',
  onPlatformChange,
  onExport,
}: VideoMockupEditorProps) {
  const [currentPlatform, setCurrentPlatform] = useState(platform);
  const [currentTheme, setCurrentTheme] = useState(theme);

  const handlePlatformChange = (newPlatform: VideoPlatform) => {
    setCurrentPlatform(newPlatform);
    onPlatformChange?.(newPlatform);
  };

  if (variant === 'preview') {
    return (
      <div className="flex w-full justify-center">
        {currentPlatform === 'youtube' && (
          <div className="max-w-[600px]">
            <YouTubeInterface videoInfo={videoInfo} theme={currentTheme} />
          </div>
        )}
        {currentPlatform === 'tiktok' && <TikTokInterface videoInfo={videoInfo} theme={currentTheme} />}
        {currentPlatform === 'shorts' && <YouTubeShortsInterface videoInfo={videoInfo} theme={currentTheme} />}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Play className="h-5 w-5 text-red-500" />
            Video Platform Mockup Editor
          </h2>
          <button
            onClick={onExport}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Export
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Platform */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Platform:</span>
            <div className="flex gap-1">
              <button
                onClick={() => handlePlatformChange('youtube')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentPlatform === 'youtube'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                YouTube
              </button>
              <button
                onClick={() => handlePlatformChange('shorts')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentPlatform === 'shorts'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Shorts
              </button>
              <button
                onClick={() => handlePlatformChange('tiktok')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentPlatform === 'tiktok'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                TikTok
              </button>
            </div>
          </div>

          {/* Theme (YouTube only) */}
          {currentPlatform === 'youtube' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Theme:</span>
              <div className="flex gap-1">
                {(['light', 'dark'] as VideoTheme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setCurrentTheme(t)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      currentTheme === t
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex justify-center bg-gray-100 p-6 dark:bg-gray-800">
        {currentPlatform === 'youtube' && (
          <div className="w-full max-w-[600px]">
            <YouTubeInterface videoInfo={videoInfo} theme={currentTheme} />
          </div>
        )}
        {currentPlatform === 'tiktok' && <TikTokInterface videoInfo={videoInfo} theme={currentTheme} />}
        {currentPlatform === 'shorts' && <YouTubeShortsInterface videoInfo={videoInfo} theme={currentTheme} />}
      </div>
    </div>
  );
}
