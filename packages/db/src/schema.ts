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

// --- Auth (Platform admin handoff, Milestone 1) ---
//
// Session mechanism is shared across all three subject types (platform,
// agency, traveler) even though only platform accounts exist so far.
// `sessions.subjectId` is deliberately not a real FK: it points at one of
// three different tables depending on `subjectType`, and a real FK can only
// reference one table. Do not add per-subject nullable FK columns instead —
// that reintroduces "infer subject from which column is populated", which is
// exactly what the explicit `subjectType` discriminant exists to prevent.
export const subjectTypeEnum = pgEnum("SubjectType", [
  "platform",
  "agency",
  "traveler",
]);
export const platformRoleEnum = pgEnum("PlatformRole", [
  "platform_admin",
  "platform_editor",
]);
export const userStatusEnum = pgEnum("UserStatus", ["active", "suspended"]);

export type SubjectType = (typeof subjectTypeEnum.enumValues)[number];
export type PlatformRole = (typeof platformRoleEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];

// The only account-creation path for this table is the seed/CLI command in
// src/seed.ts. No procedure may insert into this table.
export const platformUsers = pgTable("platform_users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  // Stored lowercased on write (app-layer, not citext) so lookups are
  // case-insensitive without a custom column type.
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  // platform_editor is catalog-only: no agency or billing access.
  role: platformRoleEnum("role").notNull(),
  status: userStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { precision: 3, mode: "date" })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { precision: 3, mode: "date" }),
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { precision: 3, mode: "date" }),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    subjectType: subjectTypeEnum("subject_type").notNull(),
    subjectId: text("subject_id").notNull(),
    // Only the hash is stored — the raw token exists only in the cookie and
    // in memory for the duration of the request that issued it.
    tokenHash: text("token_hash").notNull().unique(),
    createdAt: timestamp("created_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
    lastUsedAt: timestamp("last_used_at", { precision: 3, mode: "date" })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { precision: 3, mode: "date" }).notNull(),
    revokedAt: timestamp("revoked_at", { precision: 3, mode: "date" }),
    ip: text("ip"),
    userAgent: text("user_agent"),
  },
  (t) => [
    index("sessions_subject_index").on(t.subjectType, t.subjectId, t.revokedAt),
  ]
);

// Append-only: no update/delete procedure should ever be written against
// this table. Written exclusively by the audit middleware in apps/api, in
// the same transaction as the mutation it is logging.
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    actorId: text("actor_id")
      .notNull()
      .references(() => platformUsers.id),
    // e.g. "destinations.update" — the tRPC procedure path.
    action: text("action").notNull(),
    subjectType: subjectTypeEnum("subject_type").notNull(),
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

