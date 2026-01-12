'use client';

import {
  Award,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  GraduationCap,
  Grid,
  List,
  Play,
  Search,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// Types
type TutorialCategory = 'getting-started' | 'mockups' | 'templates' | 'export' | 'collaboration' | 'advanced';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
type ViewMode = 'grid' | 'list';

type Tutorial = {
  id: string;
  title: string;
  description: string;
  category: TutorialCategory;
  difficulty: DifficultyLevel;
  duration: number; // in seconds
  thumbnailUrl: string;
  videoUrl: string;
  views: number;
  likes: number;
  isNew: boolean;
  isFeatured: boolean;
  completedByUser: boolean;
  bookmarked: boolean;
  chapters: TutorialChapter[];
  publishedAt: string;
};

type TutorialChapter = {
  id: string;
  title: string;
  startTime: number;
  duration: number;
};

type LearningPath = {
  id: string;
  title: string;
  description: string;
  tutorials: string[];
  progress: number;
  totalDuration: number;
  difficulty: DifficultyLevel;
};

type VideoTutorialLibraryProps = {
  variant?: 'full' | 'compact' | 'widget';
  userId?: string;
  onTutorialSelect?: (tutorial: Tutorial) => void;
  onBookmark?: (tutorialId: string) => void;
  className?: string;
};

// Mock data
const mockTutorials: Tutorial[] = [
  {
    id: 't1',
    title: 'Getting Started with MockFlow',
    description: 'Learn the basics of creating your first mockup in minutes',
    category: 'getting-started',
    difficulty: 'beginner',
    duration: 420,
    thumbnailUrl: '/thumbnails/getting-started.jpg',
    videoUrl: '/videos/getting-started.mp4',
    views: 15420,
    likes: 892,
    isNew: false,
    isFeatured: true,
    completedByUser: true,
    bookmarked: true,
    chapters: [
      { id: 'ch1', title: 'Welcome & Overview', startTime: 0, duration: 60 },
      { id: 'ch2', title: 'Creating Your First Mockup', startTime: 60, duration: 180 },
      { id: 'ch3', title: 'Basic Customization', startTime: 240, duration: 180 },
    ],
    publishedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 't2',
    title: 'Creating Chat Mockups',
    description: 'Master WhatsApp, iMessage, and Discord mockups',
    category: 'mockups',
    difficulty: 'beginner',
    duration: 720,
    thumbnailUrl: '/thumbnails/chat-mockups.jpg',
    videoUrl: '/videos/chat-mockups.mp4',
    views: 12350,
    likes: 645,
    isNew: false,
    isFeatured: false,
    completedByUser: true,
    bookmarked: false,
    chapters: [],
    publishedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 't3',
    title: 'Social Media Mockups Deep Dive',
    description: 'Create stunning Instagram, Twitter, and LinkedIn mockups',
    category: 'mockups',
    difficulty: 'intermediate',
    duration: 960,
    thumbnailUrl: '/thumbnails/social-mockups.jpg',
    videoUrl: '/videos/social-mockups.mp4',
    views: 8920,
    likes: 456,
    isNew: true,
    isFeatured: true,
    completedByUser: false,
    bookmarked: true,
    chapters: [],
    publishedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 't4',
    title: 'Using Templates Like a Pro',
    description: 'Save time with templates and learn to customize them',
    category: 'templates',
    difficulty: 'beginner',
    duration: 540,
    thumbnailUrl: '/thumbnails/templates.jpg',
    videoUrl: '/videos/templates.mp4',
    views: 6780,
    likes: 389,
    isNew: false,
    isFeatured: false,
    completedByUser: false,
    bookmarked: false,
    chapters: [],
    publishedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 't5',
    title: 'Advanced Export Options',
    description: 'Master animated GIFs, videos, and interactive HTML exports',
    category: 'export',
    difficulty: 'advanced',
    duration: 1080,
    thumbnailUrl: '/thumbnails/export.jpg',
    videoUrl: '/videos/export.mp4',
    views: 4560,
    likes: 312,
    isNew: true,
    isFeatured: false,
    completedByUser: false,
    bookmarked: false,
    chapters: [],
    publishedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: 't6',
    title: 'Team Collaboration Features',
    description: 'Learn to collaborate with your team in real-time',
    category: 'collaboration',
    difficulty: 'intermediate',
    duration: 660,
    thumbnailUrl: '/thumbnails/collaboration.jpg',
    videoUrl: '/videos/collaboration.mp4',
    views: 3240,
    likes: 198,
    isNew: false,
    isFeatured: false,
    completedByUser: false,
    bookmarked: false,
    chapters: [],
    publishedAt: '2024-01-08T00:00:00Z',
  },
];

const mockLearningPaths: LearningPath[] = [
  {
    id: 'lp1',
    title: 'MockFlow Fundamentals',
    description: 'Master the basics in 30 minutes',
    tutorials: ['t1', 't2', 't4'],
    progress: 67,
    totalDuration: 1680,
    difficulty: 'beginner',
  },
  {
    id: 'lp2',
    title: 'Social Media Expert',
    description: 'Become a social media mockup pro',
    tutorials: ['t3', 't5'],
    progress: 0,
    totalDuration: 2040,
    difficulty: 'intermediate',
  },
];

const categoryConfig = {
  'getting-started': { label: 'Getting Started', icon: '🚀', color: 'bg-blue-500' },
  'mockups': { label: 'Mockups', icon: '📱', color: 'bg-purple-500' },
  'templates': { label: 'Templates', icon: '📄', color: 'bg-green-500' },
  'export': { label: 'Export', icon: '📤', color: 'bg-orange-500' },
  'collaboration': { label: 'Collaboration', icon: '👥', color: 'bg-pink-500' },
  'advanced': { label: 'Advanced', icon: '⚡', color: 'bg-red-500' },
};

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30' },
  advanced: { label: 'Advanced', color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30' },
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatViews = (views: number): string => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

export default function VideoTutorialLibrary({
  variant = 'full',
  onTutorialSelect,
  onBookmark,
  className = '',
}: VideoTutorialLibraryProps) {
  const [tutorials] = useState<Tutorial[]>(mockTutorials);
  const [learningPaths] = useState<LearningPath[]>(mockLearningPaths);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(mockTutorials.filter(t => t.bookmarked).map(t => t.id)));

  const handleBookmark = useCallback((tutorialId: string) => {
    setBookmarks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tutorialId)) {
        newSet.delete(tutorialId);
      } else {
        newSet.add(tutorialId);
      }
      return newSet;
    });
    onBookmark?.(tutorialId);
  }, [onBookmark]);

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
      || tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const featuredTutorials = tutorials.filter(t => t.isFeatured);
  const completedCount = tutorials.filter(t => t.completedByUser).length;
  const totalDuration = tutorials.reduce((sum, t) => sum + t.duration, 0);

  // Widget variant
  if (variant === 'widget') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-2 flex items-center gap-2">
          <Play className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Tutorials</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {completedCount}
          /
          {tutorials.length}
          {' '}
          completed
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-red-500"
            style={{ width: `${(completedCount / tutorials.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Video Tutorials</h3>
          <span className="text-sm text-gray-500">
            {tutorials.length}
            {' '}
            videos
          </span>
        </div>
        <div className="space-y-2">
          {tutorials.slice(0, 3).map(tutorial => (
            <button
              key={tutorial.id}
              onClick={() => onTutorialSelect?.(tutorial)}
              className="flex w-full items-center gap-3 rounded-lg bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500">
                <Play className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{tutorial.title}</p>
                <p className="text-xs text-gray-500">{formatDuration(tutorial.duration)}</p>
              </div>
              {tutorial.completedByUser && <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />}
            </button>
          ))}
        </div>
        <button className="mt-3 w-full text-sm text-red-600 hover:underline dark:text-red-400">
          View all tutorials →
        </button>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-white shadow-lg dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6 dark:border-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-500">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Video Tutorial Library</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn MockFlow with step-by-step guides</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tutorials.length}</p>
              <p className="text-gray-500">Videos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              <p className="text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(totalDuration)}</p>
              <p className="text-gray-500">Total Time</p>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <Award className="h-4 w-4 text-yellow-500" />
            Learning Paths
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {learningPaths.map(path => (
              <div key={path.id} className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-800 dark:to-gray-700/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{path.title}</h4>
                    <p className="text-sm text-gray-500">{path.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-xs ${difficultyConfig[path.difficulty].color}`}>
                        {difficultyConfig[path.difficulty].label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {path.tutorials.length}
                        {' '}
                        tutorials
                      </span>
                      <span className="text-xs text-gray-500">
                        •
                        {formatDuration(path.totalDuration)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {path.progress}
                      %
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${path.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as TutorialCategory | 'all')}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.icon}
                {' '}
                {config.label}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <option value="all">All Levels</option>
            {Object.entries(difficultyConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tutorial Grid/List */}
      <div className="p-6">
        {/* Featured Section */}
        {featuredTutorials.length > 0 && selectedCategory === 'all' && !searchQuery && (
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Tutorials
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {featuredTutorials.map(tutorial => (
                <button
                  key={tutorial.id}
                  onClick={() => onTutorialSelect?.(tutorial)}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-left"
                >
                  <div className="p-6 text-white">
                    {tutorial.isNew && (
                      <span className="absolute top-4 right-4 rounded bg-yellow-400 px-2 py-1 text-xs font-bold text-yellow-900">
                        NEW
                      </span>
                    )}
                    <h4 className="mb-2 text-xl font-bold">{tutorial.title}</h4>
                    <p className="mb-4 text-sm text-white/80">{tutorial.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(tutorial.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {formatViews(tutorial.views)}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <Play className="ml-1 h-8 w-8 text-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* All Tutorials */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredTutorials.map(tutorial => (
            viewMode === 'grid'
              ? (
                  <div
                    key={tutorial.id}
                    className="group overflow-hidden rounded-xl bg-gray-50 transition-shadow hover:shadow-lg dark:bg-gray-800"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => onTutorialSelect?.(tutorial)}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Play className="ml-0.5 h-6 w-6 text-white" />
                        </button>
                      </div>
                      <span className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                        {formatDuration(tutorial.duration)}
                      </span>
                      {tutorial.isNew && (
                        <span className="absolute top-2 left-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          NEW
                        </span>
                      )}
                      {tutorial.completedByUser && (
                        <CheckCircle className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white text-green-500" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{tutorial.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(tutorial.id);
                          }}
                          className="ml-2 flex-shrink-0"
                        >
                          {bookmarks.has(tutorial.id)
                            ? (
                                <BookmarkCheck className="h-5 w-5 text-blue-500" />
                              )
                            : (
                                <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                              )}
                        </button>
                      </div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-xs ${difficultyConfig[tutorial.difficulty].color}`}>
                          {difficultyConfig[tutorial.difficulty].label}
                        </span>
                        <span className="text-xs text-gray-500">{categoryConfig[tutorial.category].label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(tutorial.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {tutorial.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              : (
                  <button
                    key={tutorial.id}
                    onClick={() => onTutorialSelect?.(tutorial)}
                    className="flex w-full items-center gap-4 rounded-xl bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                  >
                    <div className="relative flex h-20 w-32 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                      <Play className="h-8 w-8 text-gray-400" />
                      <span className="absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        {formatDuration(tutorial.duration)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        {tutorial.isNew && <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">NEW</span>}
                        <h4 className="font-semibold text-gray-900 dark:text-white">{tutorial.title}</h4>
                      </div>
                      <p className="line-clamp-1 text-sm text-gray-500">{tutorial.description}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className={`rounded px-2 py-0.5 text-xs ${difficultyConfig[tutorial.difficulty].color}`}>
                          {difficultyConfig[tutorial.difficulty].label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatViews(tutorial.views)}
                          {' '}
                          views
                        </span>
                        <span className="text-xs text-gray-500">
                          {tutorial.likes}
                          {' '}
                          likes
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tutorial.completedByUser && <CheckCircle className="h-5 w-5 text-green-500" />}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(tutorial.id);
                        }}
                      >
                        {bookmarks.has(tutorial.id)
                          ? (
                              <BookmarkCheck className="h-5 w-5 text-blue-500" />
                            )
                          : (
                              <Bookmark className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                      </button>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                )
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="py-12 text-center">
            <GraduationCap className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No tutorials found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export type { DifficultyLevel, LearningPath, Tutorial, TutorialCategory, TutorialChapter, VideoTutorialLibraryProps };
