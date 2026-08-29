CREATE TYPE "PlatformUserRole" AS ENUM('platform_admin', 'platform_editor');--> statement-breakpoint
CREATE TYPE "PlatformUserStatus" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY,
	"actor_id" text NOT NULL,
	"action" text NOT NULL,
	"subject_type" text NOT NULL,
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
	"clerk_user_id" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"role" "PlatformUserRole" NOT NULL,
	"status" "PlatformUserStatus" DEFAULT 'active'::"PlatformUserStatus" NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"last_active_at" timestamp(3)
);
--> statement-breakpoint
CREATE INDEX "audit_logs_subject_index" ON "audit_logs" ("subject_type","subject_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_index" ON "audit_logs" ("actor_id","created_at");--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_platform_users_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "platform_users"("id");