import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  countries: {
    destinations: r.many.destinations(),
    regions: r.many.regions({
      from: r.countries.code.through(r.countriesToRegions.countryCode),
      to: r.regions.id.through(r.countriesToRegions.regionId),
    }),
  },
  regions: {
    countries: r.many.countries({
      from: r.regions.id.through(r.countriesToRegions.regionId),
      to: r.countries.code.through(r.countriesToRegions.countryCode),
    }),
    destinations: r.many.destinations({
      from: r.regions.id.through(r.destinationsToRegions.regionId),
      to: r.destinations.id.through(r.destinationsToRegions.destinationId),
    }),
    media: r.many.mediaAttachments({
      from: r.regions.id,
      to: r.mediaAttachments.entityId,
      where: { entityType: "region" },
    }),
  },
  destinations: {
    country: r.one.countries({
      from: r.destinations.countryCode,
      to: r.countries.code,
    }),
    parent: r.one.destinations({
      from: r.destinations.parentId,
      to: r.destinations.id,
    }),
    children: r.many.destinations({
      from: r.destinations.id,
      to: r.destinations.parentId,
    }),
    regions: r.many.regions({
      from: r.destinations.id.through(r.destinationsToRegions.destinationId),
      to: r.regions.id.through(r.destinationsToRegions.regionId),
    }),
    pois: r.many.poi({
      from: r.destinations.id,
      to: r.poi.destinationId
    }),
    seasons: r.many.destinationSeason({
      from: r.destinations.id,
      to: r.destinationSeason.destinationId
    }),
    media: r.many.mediaAttachments({
      from: r.destinations.id,
      to: r.mediaAttachments.entityId,
      where: { entityType: "destination" },
    }),
  },
  poi: {
    destination: r.one.destinations({
      from: r.poi.destinationId,
      to: r.destinations.id
    }),
    media: r.many.mediaAttachments({
      from: r.poi.id,
      to: r.mediaAttachments.entityId,
      where: { entityType: "poi" },
    }),
  },
  media: {
    attachments: r.many.mediaAttachments(),
  },
  mediaAttachments: {
    media: r.one.media({
      from: r.mediaAttachments.mediaId,
      to: r.media.id,
    }),
  },
}));
