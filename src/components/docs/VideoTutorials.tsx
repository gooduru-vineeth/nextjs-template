'use client';

import { useState } from 'react';

type VideoTutorial = {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  category: 'getting-started' | 'features' | 'advanced' | 'tips';
  views: number;
  publishedAt: string;
};

const tutorials: VideoTutorial[] = [
  {
    id: 'vid_1',
    title: 'Getting Started with MockFlow',
    description: 'Learn the basics of creating your first mockup in under 5 minutes. This tutorial covers the interface, creating messages, and exporting.',
    duration: '4:32',
    thumbnail: '/tutorials/getting-started.jpg',
    videoUrl: 'https://example.com/video1',
    category: 'getting-started',
    views: 12500,
    publishedAt: 'Jan 5, 2026',
  },
  {
    id: 'vid_2',
    title: 'Creating WhatsApp Mockups',
    description: 'Step-by-step guide to creating realistic WhatsApp conversations with all features including voice messages and reactions.',
    duration: '8:15',
    thumbnail: '/tutorials/whatsapp.jpg',
    videoUrl: 'https://example.com/video2',
    category: 'features',
    views: 8420,
    publishedAt: 'Jan 8, 2026',
  },
  {
    id: 'vid_3',
    title: 'AI Chat Interface Design',
    description: 'Master the art of creating ChatGPT, Claude, and Gemini mockups with code blocks and markdown rendering.',
    duration: '12:45',
    thumbnail: '/tutorials/ai-chat.jpg',
    videoUrl: 'https://example.com/video3',
    category: 'features',
    views: 6230,
    publishedAt: 'Jan 10, 2026',
  },
  {
    id: 'vid_4',
    title: 'Export Options Deep Dive',
    description: 'Explore all export formats, device frames, and quality settings to get the perfect output for your needs.',
    duration: '6:20',
    thumbnail: '/tutorials/export.jpg',
    videoUrl: 'https://example.com/video4',
    category: 'advanced',
    views: 4890,
    publishedAt: 'Jan 12, 2026',
  },
  {
    id: 'vid_5',
    title: 'Team Collaboration Features',
    description: 'Learn how to work with your team using shared workspaces, comments, and real-time collaboration.',
    duration: '9:30',
    thumbnail: '/tutorials/collaboration.jpg',
    videoUrl: 'https://example.com/video5',
    category: 'advanced',
    views: 3560,
    publishedAt: 'Jan 14, 2026',
  },
  {
    id: 'vid_6',
    title: 'Keyboard Shortcuts Masterclass',
    description: 'Speed up your workflow with essential keyboard shortcuts and power user tips.',
    duration: '5:45',
    thumbnail: '/tutorials/shortcuts.jpg',
    videoUrl: 'https://example.com/video6',
    category: 'tips',
    views: 2890,
    publishedAt: 'Jan 16, 2026',
  },
  {
    id: 'vid_7',
    title: 'Using Templates Effectively',
    description: 'Discover how to use, customize, and save templates to streamline your mockup creation process.',
    duration: '7:10',
    thumbnail: '/tutorials/templates.jpg',
    videoUrl: 'https://example.com/video7',
    category: 'tips',
    views: 4120,
    publishedAt: 'Jan 18, 2026',
  },
  {
    id: 'vid_8',
    title: 'Social Media Mockup Guide',
    description: 'Create stunning Instagram, LinkedIn, and Twitter post mockups for your marketing campaigns.',
    duration: '10:25',
    thumbnail: '/tutorials/social.jpg',
    videoUrl: 'https://example.com/video8',
    category: 'features',
    views: 5670,
    publishedAt: 'Jan 20, 2026',
  },
];

const categories = [
  { id: 'all', label: 'All Tutorials', icon: '📚' },
  { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
  { id: 'features', label: 'Features', icon: '✨' },
  { id: 'advanced', label: 'Advanced', icon: '🎯' },
  { id: 'tips', label: 'Tips & Tricks', icon: '💡' },
];

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

type VideoCardProps = {
  video: VideoTutorial;
  onPlay: (video: VideoTutorial) => void;
};

function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <div
      onClick={() => onPlay(video)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <div className="flex h-full items-center justify-center">
          <div className="rounded-full bg-white/90 p-4 shadow-lg transition-transform group-hover:scale-110 dark:bg-gray-800/90">
            <svg className="size-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration Badge */}
        <div className="absolute right-2 bottom-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {video.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {video.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {formatViews(video.views)}
            {' '}
            views
          </span>
          <span>{video.publishedAt}</span>
        </div>
      </div>
    </div>
  );
}

export function VideoTutorials() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingVideo, setPlayingVideo] = useState<VideoTutorial | null>(null);

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch
      = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
        || tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Tutorials</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Learn how to create amazing mockups with our step-by-step video guides
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Featured Video */}
        {!playingVideo && tutorials.length > 0 && tutorials[0] && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-700 dark:border-gray-700">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto">
                <div className="flex h-full items-center justify-center p-8">
                  <button
                    onClick={() => setPlayingVideo(tutorials[0] ?? null)}
                    className="rounded-full bg-white/20 p-6 backdrop-blur-sm transition-transform hover:scale-110"
                  >
                    <svg className="size-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 text-white">
                <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                  Featured Tutorial
                </span>
                <h2 className="mb-4 text-2xl font-bold">{tutorials[0]?.title}</h2>
                <p className="mb-6 text-white/80">{tutorials[0]?.description}</p>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {tutorials[0]?.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    {formatViews(tutorials[0]?.views ?? 0)}
                    {' '}
                    views
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {playingVideo && (
          <div className="mb-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black dark:border-gray-700">
              <div className="relative aspect-video">
                <div className="flex h-full items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="mx-auto size-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <p className="mt-4 text-gray-400">Video player placeholder</p>
                    <p className="text-sm text-gray-500">
                      Playing:
                      {playingVideo.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{playingVideo.title}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{playingVideo.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {formatViews(playingVideo.views)}
                  {' '}
                  views
                </span>
                <span>{playingVideo.publishedAt}</span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize dark:bg-gray-700 dark:text-gray-400">
                  {playingVideo.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTutorials.map(tutorial => (
            <VideoCard key={tutorial.id} video={tutorial} onPlay={setPlayingVideo} />
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
            <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No tutorials found</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Request Tutorial */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Can't find what you're looking for?</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Let us know what tutorial you'd like to see and we'll create it for you.
          </p>
          <button className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Request a Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
