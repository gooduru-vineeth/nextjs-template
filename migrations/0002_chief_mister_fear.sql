CREATE TYPE "public"."mockup_platform" AS ENUM('whatsapp', 'imessage', 'discord', 'telegram', 'messenger', 'slack', 'chatgpt', 'claude', 'gemini', 'perplexity', 'linkedin', 'instagram', 'twitter', 'facebook', 'tiktok');--> statement-breakpoint
CREATE TYPE "public"."mockup_type" AS ENUM('chat', 'ai', 'social');--> statement-breakpoint
CREATE TABLE "exports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mockup_id" integer NOT NULL,
	"format" varchar(10) NOT NULL,
	"resolution" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mockups" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer,
	"name" varchar(255) NOT NULL,
	"type" "mockup_type" NOT NULL,
	"platform" "mockup_platform" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"appearance" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"thumbnail_url" varchar(500),
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" "mockup_type" NOT NULL,
	"platform" "mockup_platform" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"appearance" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"thumbnail_url" varchar(500),
	"category" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" varchar(500);--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "exports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exports" ADD CONSTRAINT "exports_mockup_id_mockups_id_fk" FOREIGN KEY ("mockup_id") REFERENCES "public"."mockups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mockups" ADD CONSTRAINT "mockups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mockups" ADD CONSTRAINT "mockups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;