'use client';

import Link from 'next/link';
import { useState } from 'react';

type Department = 'engineering' | 'design' | 'product' | 'marketing' | 'sales' | 'operations';
type JobType = 'full-time' | 'part-time' | 'contract';
type Location = 'remote' | 'san-francisco' | 'new-york' | 'london';

type JobPosting = {
  id: string;
  title: string;
  department: Department;
  type: JobType;
  location: Location;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
};

const jobs: JobPosting[] = [
  {
    id: 'job_1',
    title: 'Senior Frontend Engineer',
    department: 'engineering',
    type: 'full-time',
    location: 'remote',
    salary: '$150,000 - $200,000',
    description: 'We are looking for a Senior Frontend Engineer to help build the next generation of our mockup creation tools. You will work closely with designers and product managers to create beautiful, performant user interfaces.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Experience with Next.js and modern frontend tooling',
      'Strong understanding of web performance optimization',
      'Excellent communication and collaboration skills',
      'Experience with design systems and component libraries',
    ],
    benefits: [
      'Competitive salary and equity',
      'Remote-first culture',
      'Unlimited PTO',
      'Health, dental, and vision insurance',
      '$2,000 annual learning budget',
    ],
    postedAt: 'Jan 5, 2026',
  },
  {
    id: 'job_2',
    title: 'Product Designer',
    department: 'design',
    type: 'full-time',
    location: 'remote',
    salary: '$120,000 - $160,000',
    description: 'Join our design team to create intuitive and delightful user experiences. You will be responsible for designing new features, improving existing workflows, and maintaining our design system.',
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma and design tools',
      'Strong portfolio showcasing UX/UI work',
      'Experience with user research and testing',
      'Ability to work in a fast-paced environment',
    ],
    benefits: [
      'Competitive salary and equity',
      'Remote-first culture',
      'Unlimited PTO',
      'Health, dental, and vision insurance',
      'Latest design tools and equipment',
    ],
    postedAt: 'Jan 8, 2026',
  },
  {
    id: 'job_3',
    title: 'Backend Engineer',
    department: 'engineering',
    type: 'full-time',
    location: 'san-francisco',
    salary: '$140,000 - $190,000',
    description: 'We are seeking a Backend Engineer to help scale our infrastructure and build robust APIs. You will work on our export service, real-time collaboration features, and data processing pipelines.',
    requirements: [
      '4+ years of backend development experience',
      'Strong proficiency in Node.js and TypeScript',
      'Experience with PostgreSQL and Redis',
      'Knowledge of cloud services (AWS, GCP, or Azure)',
      'Understanding of API design best practices',
    ],
    benefits: [
      'Competitive salary and equity',
      'Hybrid work arrangement',
      'Unlimited PTO',
      'Health, dental, and vision insurance',
      'Commuter benefits',
    ],
    postedAt: 'Jan 10, 2026',
  },
  {
    id: 'job_4',
    title: 'Product Manager',
    department: 'product',
    type: 'full-time',
    location: 'remote',
    salary: '$130,000 - $170,000',
    description: 'Lead product strategy and execution for key features. You will work with engineering, design, and marketing to define roadmap priorities and deliver impactful product improvements.',
    requirements: [
      '4+ years of product management experience',
      'Experience with B2B SaaS or design tools',
      'Strong analytical and data-driven decision making',
      'Excellent written and verbal communication',
      'Technical background preferred',
    ],
    benefits: [
      'Competitive salary and equity',
      'Remote-first culture',
      'Unlimited PTO',
      'Health, dental, and vision insurance',
      'Annual company retreats',
    ],
    postedAt: 'Jan 12, 2026',
  },
  {
    id: 'job_5',
    title: 'Growth Marketing Manager',
    department: 'marketing',
    type: 'full-time',
    location: 'new-york',
    salary: '$110,000 - $150,000',
    description: 'Drive user acquisition and growth through data-driven marketing strategies. You will own paid advertising, content marketing, and conversion optimization efforts.',
    requirements: [
      '3+ years of growth marketing experience',
      'Experience with paid social and search advertising',
      'Strong analytical skills and proficiency in analytics tools',
      'Experience with A/B testing and optimization',
      'Knowledge of SEO and content marketing',
    ],
    benefits: [
      'Competitive salary and equity',
      'Hybrid work arrangement',
      'Unlimited PTO',
      'Health, dental, and vision insurance',
      'Marketing conference budget',
    ],
    postedAt: 'Jan 15, 2026',
  },
  {
    id: 'job_6',
    title: 'Customer Success Manager',
    department: 'sales',
    type: 'full-time',
    location: 'remote',
    salary: '$80,000 - $120,000',
    description: 'Help our customers succeed with MockFlow. You will onboard new customers, provide training, and identify opportunities for expansion and upselling.',
    requirements: [
      '2+ years of customer success experience',
      'Experience with SaaS products',
      'Excellent communication and presentation skills',
      'Strong problem-solving abilities',
      'Experience with CRM tools (HubSpot, Salesforce)',
    ],
    benefits: [
      'Competitive base salary plus commission',
      'Remote-first culture',
      'Unlimited PTO',
      'Health, dental, and vision insurance',
      'Career development opportunities',
    ],
    postedAt: 'Jan 18, 2026',
  },
];

const departmentLabels: Record<Department, string> = {
  engineering: 'Engineering',
  design: 'Design',
  product: 'Product',
  marketing: 'Marketing',
  sales: 'Sales',
  operations: 'Operations',
};

const locationLabels: Record<Location, string> = {
  'remote': 'Remote',
  'san-francisco': 'San Francisco, CA',
  'new-york': 'New York, NY',
  'london': 'London, UK',
};

const values = [
  {
    icon: '🚀',
    title: 'Move Fast',
    description: 'We ship quickly and iterate based on feedback. Perfect is the enemy of good.',
  },
  {
    icon: '🎨',
    title: 'Design Matters',
    description: 'We obsess over details and create products that are a joy to use.',
  },
  {
    icon: '🤝',
    title: 'Customer First',
    description: 'Every decision starts with how it benefits our users.',
  },
  {
    icon: '📈',
    title: 'Data Informed',
    description: 'We use data to guide decisions while leaving room for creativity.',
  },
  {
    icon: '💬',
    title: 'Transparent',
    description: 'We share information openly and communicate with honesty.',
  },
  {
    icon: '🌱',
    title: 'Always Learning',
    description: 'We invest in growth and embrace continuous improvement.',
  },
];

const benefits = [
  { icon: '💰', title: 'Competitive Compensation', description: 'Salary, equity, and bonuses that recognize your value' },
  { icon: '🏠', title: 'Remote First', description: 'Work from anywhere in the world' },
  { icon: '🏖️', title: 'Unlimited PTO', description: 'Take the time you need to recharge' },
  { icon: '🏥', title: 'Health Coverage', description: 'Medical, dental, and vision insurance' },
  { icon: '📚', title: 'Learning Budget', description: '$2,000 annual budget for courses and conferences' },
  { icon: '💻', title: 'Equipment', description: 'Latest MacBook Pro and accessories' },
  { icon: '👶', title: 'Parental Leave', description: '16 weeks paid leave for all parents' },
  { icon: '✈️', title: 'Team Retreats', description: 'Annual company-wide gatherings' },
];

type JobCardProps = {
  job: JobPosting;
};

function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/careers/${job.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{departmentLabels[job.department]}</p>
        </div>
        <span className="shrink-0 text-sm font-medium text-green-600 dark:text-green-400">{job.salary}</span>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{job.description}</p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          {locationLabels[job.location]}
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {job.type.replace('-', ' ')}
        </span>
      </div>
    </Link>
  );
}

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | 'all'>('all');

  const filteredJobs = jobs
    .filter(j => selectedDepartment === 'all' || j.department === selectedDepartment)
    .filter(j => selectedLocation === 'all' || j.location === selectedLocation);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">Join Our Team</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Help us build the future of mockup creation. We&apos;re looking for talented people who are passionate about design and developer tools.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#openings"
              className="rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              View Open Positions (
              {jobs.length}
              )
            </a>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Values</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              The principles that guide how we work and build together.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 text-4xl">{value.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Benefits & Perks</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              We take care of our team so they can do their best work.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 text-3xl">{benefit.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="openings" className="border-t border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Open Positions</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {filteredJobs.length}
                {' '}
                {filteredJobs.length === 1 ? 'position' : 'positions'}
                {' '}
                available
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedDepartment}
                onChange={e => setSelectedDepartment(e.target.value as Department | 'all')}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Departments</option>
                {(Object.entries(departmentLabels) as [Department, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value as Location | 'all')}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Locations</option>
                {(Object.entries(locationLabels) as [Location, string][]).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredJobs.length > 0
            ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )
            : (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800">
                  <svg
                    className="mx-auto size-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No positions found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-100 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Don&apos;t See a Perfect Fit?</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            We&apos;re always looking for talented people. Send us your resume and we&apos;ll reach out when a matching position opens up.
          </p>
          <a
            href="mailto:careers@mockflow.com"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Send Your Resume
          </a>
        </div>
      </div>
    </div>
  );
}
