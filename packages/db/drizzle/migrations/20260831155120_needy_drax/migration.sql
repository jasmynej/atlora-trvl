CREATE TYPE "PlatformRole" AS ENUM('platform_admin', 'platform_editor');--> statement-breakpoint
CREATE TYPE "SubjectType" AS ENUM('platform', 'agency', 'traveler');--> statement-breakpoint
CREATE TYPE "UserStatus" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY,
	"actor_id" text NOT NULL,
	"action" text NOT NULL,
	"subject_type" "SubjectType" NOT NULL,
	"subject_id" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_users" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "PlatformRole" NOT NULL,
	"status" "UserStatus" DEFAULT 'active'::"UserStatus" NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"last_login_at" timestamp(3),
	"failed_login_count" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY,
	"subject_type" "SubjectType" NOT NULL,
	"subject_id" text NOT NULL,
	"token_hash" text NOT NULL UNIQUE,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"last_used_at" timestamp(3) DEFAULT now() NOT NULL,
	"expires_at" timestamp(3) NOT NULL,
	"revoked_at" timestamp(3),
	"ip" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE INDEX "audit_logs_subject_index" ON "audit_logs" ("subject_type","subject_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_index" ON "audit_logs" ("actor_id","created_at");--> statement-breakpoint
CREATE INDEX "sessions_subject_index" ON "sessions" ("subject_type","subject_id","revoked_at");--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_platform_users_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "platform_users"("id");