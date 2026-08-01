CREATE TYPE "DestinationType" AS ENUM('city', 'region_area', 'island', 'beach', 'national_park', 'other');--> statement-breakpoint
CREATE TYPE "Status" AS ENUM('DRAFT', 'PUBLISHED');--> statement-breakpoint
CREATE TABLE "countries" (
	"code" text PRIMARY KEY,
	"name" text NOT NULL,
	"flag_svg" text NOT NULL,
	"region" text NOT NULL,
	"subRegion" text NOT NULL,
	"borders" text[] NOT NULL,
	"capital" text NOT NULL,
	"capitalLat" double precision NOT NULL,
	"capitalLong" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_CountryToRegion" (
	"A" text,
	"B" text,
	CONSTRAINT "_CountryToRegion_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "_DestinationToRegion" (
	"A" text,
	"B" text,
	CONSTRAINT "_DestinationToRegion_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "destinations" (
	"id" text PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"type" "DestinationType" NOT NULL,
	"status" "Status" NOT NULL,
	"tagline" text,
	"description" text,
	"heroImageUrl" text,
	"bestTimeToVisit" text,
	"countryCode" text,
	"parentId" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" text PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"description" text,
	"heroImageUrl" text,
	"status" "Status" NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SiteConfig" (
	"id" text PRIMARY KEY,
	"key" text NOT NULL UNIQUE,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "_CountryToRegion_B_index" ON "_CountryToRegion" ("B");--> statement-breakpoint
CREATE INDEX "_DestinationToRegion_B_index" ON "_DestinationToRegion" ("B");--> statement-breakpoint
ALTER TABLE "_CountryToRegion" ADD CONSTRAINT "_CountryToRegion_A_countries_code_fkey" FOREIGN KEY ("A") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_CountryToRegion" ADD CONSTRAINT "_CountryToRegion_B_regions_id_fkey" FOREIGN KEY ("B") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_DestinationToRegion" ADD CONSTRAINT "_DestinationToRegion_A_destinations_id_fkey" FOREIGN KEY ("A") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "_DestinationToRegion" ADD CONSTRAINT "_DestinationToRegion_B_regions_id_fkey" FOREIGN KEY ("B") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_countryCode_countries_code_fkey" FOREIGN KEY ("countryCode") REFERENCES "countries"("code") ON DELETE SET NULL ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_parentId_destinations_id_fkey" FOREIGN KEY ("parentId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;