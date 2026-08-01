CREATE TABLE "countries_to_regions" (
	"country_code" text,
	"region_id" text,
	CONSTRAINT "countries_to_regions_pkey" PRIMARY KEY("country_code","region_id")
);
--> statement-breakpoint
CREATE TABLE "destinations_to_regions" (
	"destination_id" text,
	"region_id" text,
	CONSTRAINT "destinations_to_regions_pkey" PRIMARY KEY("destination_id","region_id")
);
--> statement-breakpoint
DROP TABLE "_CountryToRegion";--> statement-breakpoint
DROP TABLE "_DestinationToRegion";--> statement-breakpoint
CREATE INDEX "countries_to_regions_region_id_index" ON "countries_to_regions" ("region_id");--> statement-breakpoint
CREATE INDEX "destinations_to_regions_region_id_index" ON "destinations_to_regions" ("region_id");--> statement-breakpoint
ALTER TABLE "countries_to_regions" ADD CONSTRAINT "countries_to_regions_country_code_countries_code_fkey" FOREIGN KEY ("country_code") REFERENCES "countries"("code") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "countries_to_regions" ADD CONSTRAINT "countries_to_regions_region_id_regions_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "destinations_to_regions" ADD CONSTRAINT "destinations_to_regions_destination_id_destinations_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "destinations_to_regions" ADD CONSTRAINT "destinations_to_regions_region_id_regions_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;