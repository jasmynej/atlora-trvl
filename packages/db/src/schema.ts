import {
  type AnyPgColumn,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const statusEnum = pgEnum("Status", ["DRAFT", "PUBLISHED"]);
export const destinationTypeEnum = pgEnum("DestinationType", [
  "city",
  "region_area",
  "island",
  "beach",
  "national_park",
  "other",
]);
export const monthEnum = pgEnum("Month", [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
])
export const poiType = pgEnum("PoiType", [
    "hotel",
    "attraction",
    "restaurant",
    "aiport",
    "transport_hub",
    "neighborhood",
])
export const mediaEntityTypeEnum = pgEnum("MediaEntityType", [
  "region",
  "destination",
  "poi",
]);
export const mediaRoleEnum = pgEnum("MediaRole", ["hero", "gallery"]);

// ── Platform admin ──────────────────────────────────────────────────────────
// No tenancy column on anything below this line. Platform-level data is
// write-guarded at the procedure layer (platformProcedure), never by a
// row-scoping key.
export const platformUserRoleEnum = pgEnum("PlatformUserRole", [
  "platform_admin",
  "platform_editor",
]);
export const platformUserStatusEnum = pgEnum("PlatformUserStatus", [
  "active",
  "suspended",
]);

export const platformUsers = pgTable("platform_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: platformUserRoleEnum("role").notNull(),
  status: platformUserStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { precision: 3, mode: "date" })
    .notNull()
    .defaultNow(),
  lastActiveAt: timestamp("last_active_at", { precision: 3, mode: "date" }),
});

// Append-only. No update or delete procedure should ever be written against
// this table — if a row is wrong, a correcting row is written, not an edit.
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    actorId: text("actor_id")
      .notNull()
      .references(() => platformUsers.id),
    action: text("action").notNull(),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id").notNull(),
    before: jsonb("before"),
    after: jsonb("after"),
    ip: text("ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("audit_logs_subject_index").on(t.subjectType, t.subjectId, t.createdAt),
    index("audit_logs_actor_index").on(t.actorId, t.createdAt),
  ]
);

export const siteConfig = pgTable("SiteConfig", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const countries = pgTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  flagSvg: text("flag_svg").notNull(),
  region: text("region").notNull(),
  subRegion: text("subRegion").notNull(),
  borders: text("borders").array().notNull(),
  capital: text("capital").notNull(),
  capitalLat: doublePrecision("capitalLat").notNull(),
  capitalLong: doublePrecision("capitalLong").notNull(),
});

export const regions = pgTable("regions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: statusEnum("status").notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const destinations = pgTable("destinations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: destinationTypeEnum("type").notNull(),
  status: statusEnum("status").notNull(),
  tagline: text("tagline"),
  description: text("description"),
  bestTimeToVisit: text("bestTimeToVisit"),
  countryCode: text("countryCode").references(() => countries.code, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  parentId: text("parentId").references((): AnyPgColumn => destinations.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "date" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// Many-to-many join tables.
export const countriesToRegions = pgTable(
  "countries_to_regions",
  {
    countryCode: text("country_code")
      .notNull()
      .references(() => countries.code, { onDelete: "cascade", onUpdate: "cascade" }),
    regionId: text("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.countryCode, t.regionId] }),
    index("countries_to_regions_region_id_index").on(t.regionId),
  ]
);

export const destinationsToRegions = pgTable(
  "destinations_to_regions",
  {
    destinationId: text("destination_id")
      .notNull()
      .references(() => destinations.id, { onDelete: "cascade", onUpdate: "cascade" }),
    regionId: text("region_id")
      .notNull()
      .references(() => regions.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.destinationId, t.regionId] }),
    index("destinations_to_regions_region_id_index").on(t.regionId),
  ]
);

export const destinationSeason = pgTable("destination_season",
    {
    destinationId: text("destination_id")
        .notNull()
        .references(() => destinations.id, { onDelete: "cascade", onUpdate: "cascade" }),
    month: monthEnum("month").notNull(),
    rating: text("rating"),
    note: text("note"),
  },
    (t) => [
        primaryKey({columns: [t.destinationId, t.month]})
    ]
)

export const poi = pgTable("poi",
    {
      id: text("id")
          .primaryKey()
          .$defaultFn(() => createId()),
      slug: text("slug").notNull().unique(),
      name: text("name").notNull(),
      type: poiType("type").notNull(),
      destinationId: text("destination_id").notNull().references(() => destinations.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
      lat: doublePrecision("lat"),
      lng: doublePrecision("lng"),
      address: text("address"),
      summary: text("summary"),
      website: text("website"),
    }
)

// A single, reusable media library. Attach a row to any entity via
// media_attachments instead of copying the URL onto each entity.
export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  key: text("key").notNull().unique(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  width: integer("width"),
  height: integer("height"),
  mimeType: text("mime_type"),
  createdAt: timestamp("created_at", { precision: 3, mode: "date" })
    .notNull()
    .defaultNow(),
});

// Polymorphic join: entityType + entityId identify the row a media asset is
// attached to. This can't carry a real FK to region/destination/poi since it
// points at whichever table entityType names, so referential integrity to
// the actual entity row isn't enforced at the DB level.
export const mediaAttachments = pgTable(
  "media_attachments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    entityType: mediaEntityTypeEnum("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    role: mediaRoleEnum("role").notNull().default("gallery"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("media_attachments_entity_index").on(t.entityType, t.entityId),
    index("media_attachments_media_id_index").on(t.mediaId),
    unique("media_attachments_media_entity_role_unique").on(
      t.mediaId,
      t.entityType,
      t.entityId,
      t.role
    ),
  ]
);

