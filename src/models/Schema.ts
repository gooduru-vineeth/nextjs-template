import { boolean, integer, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// It automatically run the command `db-server:file`, which apply the migration before Next.js starts in development mode,
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Just claim it by running `npm run neon:claim`.
// Tested and compatible with Next.js Boilerplate

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const userSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Enum for mockup types
export const mockupTypeEnum = pgEnum('mockup_type', ['chat', 'ai', 'social']);

// Enum for mockup platforms
export const mockupPlatformEnum = pgEnum('mockup_platform', [
  // Chat platforms
  'whatsapp',
  'imessage',
  'discord',
  'telegram',
  'messenger',
  'slack',
  // AI platforms
  'chatgpt',
  'claude',
  'gemini',
  'perplexity',
  // Social platforms
  'linkedin',
  'instagram',
  'twitter',
  'facebook',
  'tiktok',
]);

// Projects table - folders for organizing mockups
export const projectSchema = pgTable('projects', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => userSchema.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(false).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Mockups table - the main content
export const mockupSchema = pgTable('mockups', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => userSchema.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').references(() => projectSchema.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: mockupTypeEnum('type').notNull(),
  platform: mockupPlatformEnum('platform').notNull(),
  // Store the mockup data as JSON (messages, participants, settings, etc.)
  data: jsonb('data').notNull().default({}),
  // Store appearance settings (theme, colors, etc.)
  appearance: jsonb('appearance').notNull().default({}),
  // Thumbnail URL for preview
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  isPublic: boolean('is_public').default(false).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Templates table - pre-made mockup templates
export const templateSchema = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: mockupTypeEnum('type').notNull(),
  platform: mockupPlatformEnum('platform').notNull(),
  data: jsonb('data').notNull().default({}),
  appearance: jsonb('appearance').notNull().default({}),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Export count tracking for free tier limits
export const exportSchema = pgTable('exports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => userSchema.id, { onDelete: 'cascade' }),
  mockupId: integer('mockup_id').notNull().references(() => mockupSchema.id, { onDelete: 'cascade' }),
  format: varchar('format', { length: 10 }).notNull(), // png, jpg, svg, pdf
  resolution: varchar('resolution', { length: 20 }), // 1x, 2x, etc.
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Enum for share permissions
export const sharePermissionEnum = pgEnum('share_permission', ['view', 'edit']);

// Mockup shares table - user-specific sharing with permissions
export const mockupShareSchema = pgTable('mockup_shares', {
  id: serial('id').primaryKey(),
  mockupId: integer('mockup_id').notNull().references(() => mockupSchema.id, { onDelete: 'cascade' }),
  ownerId: integer('owner_id').notNull().references(() => userSchema.id, { onDelete: 'cascade' }),
  sharedWithUserId: integer('shared_with_user_id').references(() => userSchema.id, { onDelete: 'cascade' }),
  // For sharing via email before user signs up
  sharedWithEmail: varchar('shared_with_email', { length: 255 }),
  permission: sharePermissionEnum('permission').notNull().default('view'),
  // Unique share link token for public link sharing
  shareToken: varchar('share_token', { length: 64 }).unique(),
  // Token expiration for link sharing
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Mockup version history table - stores previous versions of mockups
export const mockupVersionSchema = pgTable('mockup_versions', {
  id: serial('id').primaryKey(),
  mockupId: integer('mockup_id').notNull().references(() => mockupSchema.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => userSchema.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  // Snapshot of the mockup data at this version
  name: varchar('name', { length: 255 }).notNull(),
  data: jsonb('data').notNull().default({}),
  appearance: jsonb('appearance').notNull().default({}),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  // Optional description of what changed
  changeDescription: text('change_description'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// API Keys table - for programmatic access to mockup generation
export const apiKeySchema = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => userSchema.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  key: varchar('key', { length: 64 }).notNull().unique(),
  // Optional description for key purpose
  description: text('description'),
  // Rate limiting
  rateLimit: integer('rate_limit').default(100).notNull(), // requests per hour
  // Permissions
  canGenerateMockups: boolean('can_generate_mockups').default(true).notNull(),
  canSaveMockups: boolean('can_save_mockups').default(true).notNull(),
  canAccessTemplates: boolean('can_access_templates').default(true).notNull(),
  // Status
  isActive: boolean('is_active').default(true).notNull(),
  lastUsedAt: timestamp('last_used_at', { mode: 'date' }),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
