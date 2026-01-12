'use client';

import { useEffect, useRef, useState } from 'react';

type Testimonial = {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
    initials?: string;
  };
  rating?: number;
  featured?: boolean;
};

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    content: 'MockFlow has transformed how we create product demos. What used to take hours in Figma now takes minutes. Our marketing team loves it!',
    author: {
      name: 'Sarah Chen',
      role: 'Head of Product',
      company: 'TechStart Inc',
      initials: 'SC',
    },
    rating: 5,
    featured: true,
  },
  {
    id: '2',
    content: 'As a developer, I never had time to create polished mockups for my projects. MockFlow changed that - now I can showcase my work professionally without any design skills.',
    author: {
      name: 'Marcus Rodriguez',
      role: 'Senior Developer',
      company: 'DevCorp',
      initials: 'MR',
    },
    rating: 5,
  },
  {
    id: '3',
    content: 'The app store screenshot generator saved us thousands in design costs. We launched our app on both iOS and Android with professional-looking screenshots in just one afternoon.',
    author: {
      name: 'Emily Watson',
      role: 'Indie Developer',
      company: 'Watson Apps',
      initials: 'EW',
    },
    rating: 5,
  },
  {
    id: '4',
    content: 'I use MockFlow daily for creating social media content. The Instagram and Twitter templates are pixel-perfect. My engagement has increased 40% since switching.',
    author: {
      name: 'Alex Kim',
      role: 'Social Media Manager',
      company: 'GrowthLab',
      initials: 'AK',
    },
    rating: 5,
    featured: true,
  },
  {
    id: '5',
    content: 'The team collaboration features are excellent. We can all work on mockups together and maintain brand consistency across our entire product line.',
    author: {
      name: 'Jordan Mitchell',
      role: 'Design Lead',
      company: 'Creative Studio',
      initials: 'JM',
    },
    rating: 4,
  },
  {
    id: '6',
    content: 'MockFlow\'s AI chat mockup generator is incredible. I create realistic ChatGPT and Claude conversation demos for my AI product tutorials in minutes.',
    author: {
      name: 'David Park',
      role: 'Content Creator',
      company: 'AI Academy',
      initials: 'DP',
    },
    rating: 5,
  },
];

type TestimonialsSectionProps = {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  autoplay?: boolean;
  autoplayInterval?: number;
};

export function TestimonialsSection({
  title = 'Loved by Thousands of Creators',
  subtitle = 'See what our customers have to say about MockFlow',
  testimonials = defaultTestimonials,
  autoplay = true,
  autoplayInterval = 5000,
}: TestimonialsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const featuredTestimonials = testimonials.filter(t => t.featured);
  const regularTestimonials = testimonials.filter(t => !t.featured);

  // Autoplay logic
  useEffect(() => {
    if (isAutoPlaying && regularTestimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % regularTestimonials.length);
      }, autoplayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, autoplayInterval, regularTestimonials.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => (prev - 1 + regularTestimonials.length) % regularTestimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => (prev + 1) % regularTestimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`size-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const Avatar = ({ author }: { author: Testimonial['author'] }) => {
    if (author.avatar) {
      return (
        <div
          className="size-12 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${author.avatar})` }}
        />
      );
    }

    return (
      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
        {author.initials}
      </div>
    );
  };

  return (
    <section className="bg-gray-50 py-20 lg:py-32 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && (
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {featuredTestimonials.map(testimonial => (
              <div
                key={testimonial.id}
                className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                {/* Quote icon */}
                <svg
                  className="absolute top-8 right-8 size-12 text-gray-100 dark:text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                </svg>

                <div className="relative">
                  {testimonial.rating && <StarRating rating={testimonial.rating} />}
                  <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                    &quot;
                    {testimonial.content}
                    &quot;
                  </p>

                  <div className="mt-6 flex items-center gap-4">
                    <Avatar author={testimonial.author} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.author.role}
                        {' '}
                        at
                        {testimonial.author.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonial Carousel */}
        {regularTestimonials.length > 0 && (
          <div className="mt-16">
            <div className="relative mx-auto max-w-3xl">
              {/* Testimonial Card */}
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                {regularTestimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`transition-all duration-500 ${
                      index === activeIndex
                        ? 'opacity-100'
                        : 'pointer-events-none absolute inset-0 opacity-0'
                    }`}
                  >
                    <div className="text-center">
                      {testimonial.rating && (
                        <div className="flex justify-center">
                          <StarRating rating={testimonial.rating} />
                        </div>
                      )}
                      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                        &quot;
                        {testimonial.content}
                        &quot;
                      </p>

                      <div className="mt-8 flex flex-col items-center">
                        <Avatar author={testimonial.author} />
                        <p className="mt-3 font-semibold text-gray-900 dark:text-white">
                          {testimonial.author.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.author.role}
                          {' '}
                          at
                          {testimonial.author.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              {regularTestimonials.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-50 lg:-translate-x-16 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <svg className="size-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-50 lg:translate-x-16 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <svg className="size-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Dots */}
                  <div className="mt-6 flex justify-center gap-2">
                    {regularTestimonials.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDotClick(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === activeIndex
                            ? 'w-8 bg-blue-600'
                            : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Logos/Companies */}
        <div className="mt-20">
          <p className="mb-8 text-center text-sm font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale">
            {['Google', 'Microsoft', 'Stripe', 'Notion', 'Figma', 'Vercel'].map(company => (
              <span
                key={company}
                className="text-xl font-bold text-gray-400 dark:text-gray-500"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
