CREATE TYPE "MediaEntityType" AS ENUM('region', 'destination', 'poi');--> statement-breakpoint
CREATE TYPE "MediaRole" AS ENUM('hero', 'gallery');--> statement-breakpoint
CREATE TYPE "Month" AS ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december');--> statement-breakpoint
CREATE TYPE "PoiType" AS ENUM('hotel', 'attraction', 'restaurant', 'aiport', 'transport_hub', 'neighborhood');--> statement-breakpoint
CREATE TABLE "destination_season" (
	"destination_id" text,
	"month" "Month",
	"rating" text,
	"note" text,
	CONSTRAINT "destination_season_pkey" PRIMARY KEY("destination_id","month")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" text PRIMARY KEY,
	"key" text NOT NULL UNIQUE,
	"url" text NOT NULL,
	"alt_text" text,
	"width" integer,
	"height" integer,
	"mime_type" text,
	"created_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_attachments" (
	"id" text PRIMARY KEY,
	"media_id" text NOT NULL,
	"entity_type" "MediaEntityType" NOT NULL,
	"entity_id" text NOT NULL,
	"role" "MediaRole" DEFAULT 'gallery'::"MediaRole" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "media_attachments_media_entity_role_unique" UNIQUE("media_id","entity_type","entity_id","role")
);
--> statement-breakpoint
CREATE TABLE "poi" (
	"id" text PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"type" "PoiType" NOT NULL,
	"destination_id" text NOT NULL,
	"lat" double precision,
	"lng" double precision,
	"address" text,
	"summary" text,
	"website" text
);
--> statement-breakpoint
CREATE INDEX "media_attachments_entity_index" ON "media_attachments" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "media_attachments_media_id_index" ON "media_attachments" ("media_id");--> statement-breakpoint
ALTER TABLE "destination_season" ADD CONSTRAINT "destination_season_destination_id_destinations_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "media_attachments" ADD CONSTRAINT "media_attachments_media_id_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE CASCADE;