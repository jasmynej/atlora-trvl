# Atlora — Data Model

> **Status:** Derived from `FEATURES.md` (two-sided marketplace reframe). Supersedes the domain models in `atlora_spec.md`. `ARCHITECTURE.md` is out of sync and should be revised against this.

**Count:** ~58 models across 9 domains. ~24 of them are Phase 1.

---

## Scoping legend

Every model carries exactly one scope. This determines which tRPC procedure may touch it and whether it has an `agencyId` column.

| Scope | Column | Guard | Meaning |
|---|---|---|---|
| **P** — Platform | none | `platformProcedure` | Owned by Atlora staff. Inherited by every tenant. |
| **A** — Agency | `agencyId` | `agencyProcedure` | Tenant data. RLS-isolated. |
| **T** — Traveler | `travelerProfileId` | `travelerProcedure` | Owned by the traveler across all agencies. |
| **J** — Join | both | either, via `Engagement` | Cross-boundary. Reads resolve through consent tier, never direct FK. |
| **X** — Cross-cutting | varies | mixed | Billing, media, audit, embeddings. |

The rule that keeps this honest: **no model gets a nullable `agencyId`.** If something can exist without an agency, it belongs in P or T, or it needs polymorphic ownership (see Decision 1).

---

## Domain 1 — Catalog (Epic A)

Platform-owned. This is the substrate for discovery, specialty tagging, and semantic search.

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Region` | P | name, slug, description, heroMediaId, sortOrder | Editorial/categorical. No coordinates. Self-referential `parentId` optional. |
| `Country` | P | name, iso2, iso3, slug, currencyCode, callingCode | m2m to `Region` via `CountryRegion` — a country can sit in several editorial groupings. |
| `Destination` | P | name, slug, type, countryId, parentId, lat, lng, timezone, summary, body, status | Single model + `DestinationType` enum. Self-referential hierarchy (Amalfi Coast → Positano). |
| `DestinationSeason` | P | destinationId, month, rating, note | Powers "best time to go" and match reasoning. Optional Phase 2. |
| `Poi` | P | name, slug, type, destinationId, lat, lng, address, summary, website | Replaces separate `Hotel` / `Attraction`. `PoiType` enum: HOTEL, ATTRACTION, RESTAURANT, AIRPORT, TRANSPORT_HUB, NEIGHBORHOOD. |
| `TripStyle` | P | key, label, description, sortOrder | Lookup table, not an enum — see Decision 6. Honeymoon, family, group, adventure, luxury FIT, wellness, culinary. |
| `Article` | P | title, slug, type, body, destinationIds, status, publishedAt | Blog posts and travel guides. `ArticleType` enum. See Decision 7 on agency-authored content. |
| `CatalogRevision` | P | entityType, entityId, editorId, diff, createdAt | Editorial audit trail. Defer to Phase 2. |

**Enums:** `DestinationType`, `PoiType`, `ArticleType`, `PublishStatus`.

---

## Domain 2 — Tenancy & public identity (Epic B)

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Agency` | A (root) | clerkOrgId, name, slug, status, planTier, createdAt | The tenancy container. Everything with `agencyId` points here. |
| `AgencyProfile` | A | agencyId, headline, bio, foundedYear, budgetTiers[], typicalResponseHours, heroMediaId, isListed | The public face. `isListed` is the marketplace tier gate. |
| `Advisor` | A | agencyId, clerkUserId, role, status, email, displayName | Agency staff. `AgencyRole` enum: OWNER, ADMIN, ADVISOR, ASSISTANT. |
| `AdvisorProfile` | A | advisorId, headline, bio, yearsExperience, photoMediaId, isListed | Travelers hire people, not companies. Specialties may diverge from the agency's. |
| `Specialty` | A | agencyId, advisorId (nullable), destinationId (nullable), tripStyleId (nullable), strength | One table, two subject types and two target types — see Decision 4. |
| `Consortium` | P | name, slug, logoMediaId | Virtuoso, Signature, Ensemble. Platform-owned vocabulary. |
| `AgencyAffiliation` | A | agencyId, consortiumId, memberSince, verifiedAt | `verifiedAt` matters — unverified affiliation claims are a trust problem in this market. |
| `Credential` | A | agencyId, advisorId, name, issuer, issuedAt, expiresAt | CTA, CTC, destination specialist certificates. |
| `LanguageProficiency` | A | agencyId, advisorId, languageCode, level | ISO 639-1. Discovery filter. |

---

## Domain 3 — Traveler identity (Epic D)

Platform-scoped. The traveler owns all of it.

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `TravelerProfile` | T (root) | clerkUserId, firstName, lastName, email, phone, dateOfBirth, homeAirport, marketingOptIn | No `agencyId`. Can exist with zero engagements. |
| `TravelerPreferences` | T | travelerProfileId, dietary[], accessibility[], seatPreference, roomPreference, pace, extras (JSON) | One row per profile. Typed columns for the known set, JSON for the tail — see Decision 5. |
| `PartyMember` | T | travelerProfileId, linkedProfileId (nullable), relationship, firstName, lastName, dateOfBirth | Family and companions. `linkedProfileId` handles a spouse who has their own account. |
| `TravelerDocument` | T | travelerProfileId, partyMemberId (nullable), type, storageKey, number (encrypted), issuingCountry, expiresAt | `DocumentType`: PASSPORT, NATIONAL_ID, VISA, INSURANCE, VACCINATION, OTHER. Only readable at `booked` consent tier. |
| `LoyaltyMembership` | T | travelerProfileId, partyMemberId (nullable), programName, membershipNumber, tier | Airline, hotel, rental. |
| `EmergencyContact` | T | travelerProfileId, name, relationship, phone, email | |
| `SavedItem` | T | travelerProfileId, targetType, targetId, collectionId (nullable), note, createdAt | Polymorphic: TRIP, DESTINATION, POI, AGENCY, ADVISOR, ARTICLE. Free tier, always. |
| `Collection` | T | travelerProfileId, name, isPrivate | Wishlist grouping. |
| `TravelerDevice` | T | travelerProfileId, platform, pushToken, lastSeenAt | Expo push. Phase 3. |

**Note on documents:** store the file in R2 and the number encrypted at the application layer, not just at rest. Passport numbers leaking through a consent-tier bug is the failure mode that kills the platform's credibility with both sides.

---

## Domain 4 — Relationship & consent (Epics D, G)

The join layer. This is where the two sides meet and where every cross-boundary read is authorised.

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Client` | A | agencyId, travelerProfileId (nullable), firstName, lastName, email, phone, stage, ownerAdvisorId, source | **Nullable `travelerProfileId` is deliberate** — agencies import offline clients who never sign up. See Decision 3. |
| `Engagement` | J | travelerProfileId, agencyId, clientId, status, assignedAdvisorId, startedAt, archivedAt | The consent-bearing join. `EngagementStatus`: INQUIRY, ACTIVE, BOOKED, ARCHIVED. |
| `ConsentGrant` | J | engagementId, tier, scope[], grantedAt, revokedAt, revokedReason | Explicit grant rows, not just derived status — see Decision 2. |
| `ConsentAuditEvent` | X | engagementId, actorType, actorId, action, tier, createdAt | Revocations are logged and surfaced to the agency. Also your compliance story. |
| `ClientNote` | A | clientId, advisorId, body, pinned | Never traveler-visible. Ever. |
| `ClientTag` | A | agencyId, label, color | Agency-scoped vocabulary, distinct from platform `TripStyle`. |
| `Communication` | A | clientId, engagementId, channel, direction, subject, body, occurredAt | Email/call/note log. `Channel`: EMAIL, PHONE, SMS, IN_APP, NOTE. |
| `ClientClaim` | J | clientId, token, email, claimedAt, expiresAt | The invite flow that links an imported `Client` to a real `TravelerProfile`. |

---

## Domain 5 — Trips & itineraries (Epics E, F, H)

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Trip` | A | agencyId, title, slug, summary, body, priceFrom, currency, durationDays, status, heroMediaId | The agency's packaged, sellable product. Unchanged from the original model. |
| `TripDestination` | A | tripId, destinationId, sortOrder | m2m to platform catalog. This join is what makes cross-agency destination pages work. |
| `TripStyleLink` | A | tripId, tripStyleId | |
| `TripDeparture` | A | tripId, startDate, endDate, capacity, booked, priceOverride, status | Fixed departures for group trips. Table stakes per the competitive brief. |
| `Itinerary` | J | ownerType, ownerTravelerProfileId, ownerAgencyId, tripId (nullable), forkedFromId, title, status, version | Polymorphic owner — see Decision 1. `forkedFromId` makes all three fork flows one operation. |
| `ItineraryDay` | J | itineraryId, dayNumber, date, destinationId, title, notes | |
| `ItineraryItem` | J | itineraryDayId, type, startTime, endTime, poiId (nullable), title, notes, cost, confirmationRef | `ItineraryItemType`: LODGING, ACTIVITY, TRANSPORT, FLIGHT, MEAL, NOTE, FREE_TIME. |
| `ItineraryCollaborator` | T | itineraryId, travelerProfileId, role, invitedAt | Traveler-side co-planning. Paid tier, Epic F. |
| `FlightSegment` | J | itineraryItemId (nullable), bookingId (nullable), carrier, flightNumber, departureIata, arrivalIata, scheduledDeparture | Live flight alerts need this structured, not buried in item notes. |
| `Booking` | A | agencyId, clientId, engagementId, tripId (nullable), itineraryId (nullable), status, totalAmount, currency, depositDue | |
| `BookingTraveler` | A | bookingId, partyMemberId (nullable), travelerProfileId (nullable), firstName, lastName | Per-person on a booking. Nullable both ways because not everyone on a trip has a profile. |
| `Payment` | A | bookingId, amount, currency, method, status, processorRef, paidAt | Stripe Connect fields land in Phase 4; the model can exist earlier for manual tracking. |
| `Commission` | A | bookingId, supplierName, expectedAmount, receivedAmount, expectedDate, status | Reconciliation is table stakes for agency tiers. |

---

## Domain 6 — Discovery & matching (Epic C)

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `DiscoveryQuery` | X | travelerProfileId (nullable), destinationIds[], tripStyleIds[], budgetTier, partySize, startDate, flexibility, rawText | Nullable profile — anonymous browse is the top of the funnel. Also your cold-start research data. |
| `MatchResult` | X | discoveryQueryId, agencyId, advisorId, score, reasonCodes[], position, clickedAt, inquiredAt | `reasonCodes` is what you show the traveler ("specialises in Amalfi Coast, 12 honeymoons booked"). Also makes ranking auditable. |
| `RankingSnapshot` | A | agencyId, advisorId, profileCompleteness, medianResponseHours, inquiryResponseRate, engagementConversionRate, recencyScore, computedAt | Recomputed on a schedule, not written on the hot path — see Decision 8. Addresses Open Decision 3. |

**Ranking policy is enforced in the model:** there is deliberately no `boostAmount`, `sponsoredUntil`, or `placementBid` field anywhere. Tier gates `AgencyProfile.isListed`; nothing gates position.

---

## Domain 7 — Inquiry routing (Epic G)

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Inquiry` | T | travelerProfileId, destinationIds[], startDate, endDate, flexibility, partySize, budgetTier, tripStyleIds[], message, itineraryId (nullable), discoveryQueryId (nullable), status | Owned by the traveler. The brief exists once. |
| `InquiryRecipient` | J | inquiryId, agencyId, advisorId (nullable), status, sentAt, viewedAt, respondedAt, declinedReason | **The fan-out table.** One inquiry, N agencies. This is where Open Decision 2 lives — add `recipientCountVisible: boolean` or a denormalised `siblingCount` here, not on `Inquiry`. |
| `InquiryResponse` | A | inquiryRecipientId, advisorId, message, proposedItineraryId (nullable), estimatedPrice, planningFee, sentAt | |
| `InquirySource` | — | enum on `Inquiry` | DESTINATION_PAGE, TRIP_PAGE, ADVISOR_PROFILE, GUIDED_MATCH, SELF_PLAN_HANDOFF, DIRECT. Tracks which surface converts. |

Accepting an `InquiryResponse` creates the `Engagement` and promotes it to `ACTIVE`, which is what unlocks the next consent tier.

---

## Domain 8 — Trip hub & messaging (Epic E)

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Conversation` | J | engagementId, subject, lastMessageAt | Scoped to the engagement, so a traveler working with three agencies gets three threads in one inbox. |
| `Message` | J | conversationId, senderType, senderId, body, readAt | `SenderType`: TRAVELER, ADVISOR, SYSTEM. |
| `MessageAttachment` | J | messageId, mediaId, documentId (nullable) | |
| `SharedDocument` | J | engagementId, mediaId, name, type, uploadedByType, expiresAt | Agency→traveler delivery (vouchers, tickets) — distinct from `TravelerDocument`, which the traveler owns. |
| `Notification` | X | subjectType, subjectId, type, payload, readAt, sentAt | One table for both traveler and agency recipients. |
| `NotificationPreference` | X | subjectType, subjectId, channel, type, enabled | |

**The trip hub itself is a view, not a table** — a query over `Engagement` + `Trip`/`Itinerary` + `Booking` + `SharedDocument`, grouped by trip and branded per agency. Don't create a `TripHubEntry` model; it will drift from its sources.

---

## Domain 9 — Entitlements, billing, cross-cutting (Epic I)

| Model | Scope | Key fields | Notes |
|---|---|---|---|
| `Plan` | X | key, subjectType, tier, interval, priceCents, currency, stripePriceId | `SubjectType`: AGENCY, TRAVELER. `Interval`: MONTHLY, ANNUAL, PER_TRIP. |
| `PlanEntitlement` | X | planId, featureKey, limitValue, limitPeriod | Feature map. `limitValue: null` = unlimited. |
| `Subscription` | X | subjectType, subjectId, planId, status, currentPeriodStart, currentPeriodEnd, seats, stripeSubscriptionId | Polymorphic subject, same pattern as `Itinerary`. |
| `TripUnlock` | T | travelerProfileId, itineraryId, purchasedAt, expiresAt | The per-trip entry point from the monetization section. |
| `UsageRecord` | X | subjectType, subjectId, featureKey, quantity, tokensIn, tokensOut, costCents, occurredAt | **Log from the first AI call, before enforcing any limit.** |
| `Media` | X | ownerType, ownerId, storageKey, mimeType, width, height, altText, credit | Polymorphic asset table. |
| `Embedding` | X | entityType, entityId, vector, model, contentHash, updatedAt | pgvector. Single table — see Decision 9. |
| `AuditLog` | X | actorType, actorId, agencyId (nullable), action, entityType, entityId, metadata, createdAt | Catalog edits, consent changes, impersonation, plan changes. |

`hasEntitlement(subject, feature)` reads `Subscription` → `Plan` → `PlanEntitlement`, then checks `UsageRecord` against `limitValue` for metered features. One resolver, called from the tRPC middleware layer.

---

## Design decisions — options and recommendations

### 1. Polymorphic ownership (`Itinerary`, `Media`, `Subscription`)

Prisma has no native polymorphism, so you're picking a workaround.

- **Option A — nullable FK pair + check constraint.** `ownerTravelerProfileId` and `ownerAgencyId`, both nullable, with a raw-SQL `CHECK (num_nonnulls(...) = 1)`. Real FKs, real cascades, real Prisma relations. Costs a migration escape hatch and two nullable columns.
- **Option B — `ownerType` + `ownerId` string.** Clean and extensible. No referential integrity, no cascade, no `include`. You will hand-write every join.
- **Option C — two tables** (`TravelerItinerary`, `AgencyItinerary`). Full integrity, but forking becomes a cross-table copy and every query that spans both needs a union.

**Recommend A** for `Itinerary` and `Subscription` — they're few, high-integrity, and forking is a core operation. **Option B** is acceptable for `Media` and `Embedding`, where the owner set is wide and cascade behaviour is genuinely per-case.

### 2. Consent — derived vs explicit

- **Option A — derive from `Engagement.status`.** Zero extra tables. But revocation has nowhere to live, and you can't express "booked, but passport sharing withdrawn."
- **Option B — `ConsentGrant` rows are the source of truth**, status is a convenience denormalisation.

**Recommend B.** The spec already promises "travelers can revoke at any tier" and "revocation is logged and surfaced to the agency" — that needs a row with a `revokedAt`. Status alone can't hold it. Keep the tier ladder as the default grant set created on status transition, so the UX stays simple.

### 3. `Client` without a `TravelerProfile`

- **Option A — require the link.** Clean model, but agencies can't import their existing book of business, which kills onboarding.
- **Option B — nullable link + `ClientClaim` flow.** Agency creates a `Client` with just a name and email; an invite converts it to a linked profile when the traveler signs up.

**Recommend B.** Migration friction at signup is the single biggest switching cost in this market. Watch for the merge case: a traveler who already has a profile receiving a claim invite needs a merge, not a create.

### 4. Specialty tagging

- **Option A — four tables** (`AgencyDestinationSpecialty`, `AgencyStyleSpecialty`, and the advisor equivalents). Maximum FK integrity, maximum boilerplate, and discovery filters have to union four sources.
- **Option B — one `Specialty` table** with nullable `advisorId`, nullable `destinationId`, nullable `tripStyleId`, and a check constraint that exactly one target is set.

**Recommend B.** Discovery filtering across both target types in one query is worth the looser schema, and `agencyId` is always present so tenancy stays enforceable. `strength` (1–5, self-declared, later corrected by outcome data) feeds ranking.

### 5. Traveler preferences — columns vs rows

- **Option A — typed columns** on `TravelerPreferences`. Advisors get structured prefill, queries are trivial, adding a field is a migration.
- **Option B — `PreferenceEntry` rows** with a category enum. Infinitely extensible, unqueryable without pain, and the admin-side prefill UI becomes generic and worse.

**Recommend A plus a JSON `extras` column.** The value proposition here is "advisors stop sending intake forms" — that only works if the fields are structured enough to map onto an agency's own form.

### 6. `TripStyle` — enum vs table

- **Option A — Prisma enum.** Fastest, type-safe, but every new style is a migration and you can't attach descriptions, icons, or sort order.
- **Option B — lookup table.** Editable by platform staff, carries editorial metadata, joinable from `Specialty` and `Trip`.

**Recommend B.** Epics B and C both filter on it and it's editorial vocabulary, which is exactly the shape of the `Destination`/`Region` decision you already made.

### 7. Article ownership — open

`Article` is platform-scoped above, matching the "catalog is infrastructure" framing. But agencies will want to publish their own content, and per-agency microsites are only *deferred*, not cancelled. Options: keep it platform-only for now and add `AgencyArticle` later; or give `Article` the same polymorphic ownership as `Itinerary` from day one. **Leaning platform-only** — deferring is cheap here because there's no cross-agency data to migrate, unlike the traveler split.

### 8. Ranking signals — live columns vs snapshot

- **Option A — columns on `AgencyProfile`**, updated on every relevant event. Fast reads, but profile writes now happen on inquiry response, booking, and revocation paths.
- **Option B — `RankingSnapshot`**, recomputed on a schedule.

**Recommend B.** It keeps ranking auditable (you can show an agency exactly what their score was and when), makes proxy signals easy to swap while you resolve Open Decision 3, and keeps the write path off the profile record.

### 9. Embeddings — one table vs per-entity columns

- **Option A — `vector` column on each embeddable model.** Fewer joins, but the index and re-embed logic get duplicated across `Destination`, `Trip`, `Article`, `Poi`, `AgencyProfile`.
- **Option B — one `Embedding` table** with `entityType` + `entityId` + `contentHash`.

**Recommend B.** One HNSW index, one re-embed worker, one `contentHash` staleness check. Cross-entity semantic search ("find me things like this") is a single query instead of a five-way union — and cross-entity search over the shared catalog is the one AI angle the competitive brief says is actually defensible.

---

## Epic → model map

| Epic | Primary models |
|---|---|
| A — Shared catalog | `Region`, `Country`, `Destination`, `Poi`, `TripStyle`, `Article`, `Embedding` |
| B — Public profiles | `AgencyProfile`, `AdvisorProfile`, `Advisor`, `Specialty`, `Consortium`, `AgencyAffiliation`, `Credential`, `LanguageProficiency` |
| C — Discovery & matching | `DiscoveryQuery`, `MatchResult`, `RankingSnapshot` |
| D — Identity & vault | `TravelerProfile`, `TravelerPreferences`, `PartyMember`, `TravelerDocument`, `LoyaltyMembership`, `EmergencyContact`, `ConsentGrant`, `ConsentAuditEvent` |
| E — Unified trip hub | `Engagement`, `Booking`, `Itinerary`, `SharedDocument`, `Conversation`, `Message`, `FlightSegment`, `Notification` |
| F — Self-planning | `Itinerary`, `ItineraryDay`, `ItineraryItem`, `ItineraryCollaborator`, `SavedItem`, `Collection`, `TripUnlock` |
| G — Inquiry routing | `Inquiry`, `InquiryRecipient`, `InquiryResponse`, `Engagement` |
| H — Agency CRM | `Client`, `ClientNote`, `ClientTag`, `Communication`, `Trip`, `TripDeparture`, `Payment`, `Commission` |
| I — Entitlements | `Plan`, `PlanEntitlement`, `Subscription`, `UsageRecord`, `TripUnlock` |

---

## Phase 1 cut

The models that must exist before anything else, because retrofitting them means migrating live records:

**Catalog:** `Region`, `Country`, `Destination`, `TripStyle`, `Media`
**Tenancy:** `Agency`, `Advisor`, `AgencyProfile`
**Traveler:** `TravelerProfile`, `TravelerPreferences`, `SavedItem`
**Relationship:** `Client`, `Engagement`, `ConsentGrant`
**Trips:** `Trip`, `TripDestination`, `TripStyleLink`, `Itinerary`, `ItineraryDay`, `ItineraryItem`
**Cross-cutting:** `AuditLog`, `Plan`, `Subscription`, `UsageRecord`

That's 24 models. `Poi`, `Article`, `PartyMember`, `TravelerDocument`, and the whole discovery and inquiry set can arrive later without a painful migration, because none of them changes the scope of an existing record.

**The two that look deferrable but aren't:**

- `Engagement` + `ConsentGrant` — every cross-boundary read in the system routes through these. Building agency reads of traveler data any other way, even once, sets a precedent you'll be unpicking for months.
- `UsageRecord` — the spec is right that limits should be set against real data. The cost of logging from day one is one insert per AI call; the cost of not having it is guessing your traveler free-tier limits.
