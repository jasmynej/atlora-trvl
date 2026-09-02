# Atlora — Feature Specification

> **Status:** Reframed from the original single-sided "white-label CMS + CRM" model to a two-sided marketplace. Supersedes the feature framing in `atlora_spec.md`. Read alongside `ARCHITECTURE.md`.

---

## Positioning

Atlora connects travelers who want expert help with the agencies who provide it, and gives both sides tooling they can't get elsewhere.

**The traveler problem:** People want to work with a travel advisor but don't know how to find one, how to evaluate one, or how to work with more than one without their trips fragmenting across email threads, PDFs, and half a dozen apps.

**The agency problem:** Agencies pay for CRM and itinerary tools that do nothing to bring them clients. Lead generation is the unsolved half of their business, and every incumbent platform ignores it.

**Atlora's answer:** A shared destination catalog powers a public discovery layer where travelers find advisors by expertise. Travelers keep one identity and one consolidated trip hub across every agency they work with. Agencies get a full CRM plus qualified inbound leads carrying real intent.

### Why this is defensible

No incumbent combines all three of the following, and single-tenant competitors structurally cannot retrofit them:

1. A platform-owned destination catalog every tenant inherits
2. A cross-agency public discovery layer
3. A traveler identity that persists across agencies

Competitors' traveler apps are all **delivery-only**: invite-gated, post-booking, one app per agency, dead until a trip is sold. Atlora's traveler surface exists *before* a booking and *across* agencies. That is the whole difference.

---

## Foundational Data Model Changes

These changes precede feature work. Retrofitting them later means migrating every agency-scoped traveler record.

### 1. Split `Traveler` into identity and relationship

The original model had `Traveler` agency-scoped (`agency_id` FK), like `Trip`. That cannot survive multi-agency consolidation — a traveler working with three agencies would exist as three disconnected records holding three copies of their passport.

| Model | Scope | Owner | Contains |
|---|---|---|---|
| `TravelerProfile` | Platform-level (no `agency_id`) | The traveler | Platform identity (credentials + session), personal details, documents, preferences, saved trips, trip history |
| `Client` | Agency-scoped | The agency | Pipeline stage, advisor notes, internal tags, communications, commission data |
| `Engagement` | Join | Both, scoped | Consent tier, status, assigned advisor, linked trips |

**The principle that makes this politically viable with agencies:** the traveler owns their identity; the agency owns its relationship data. An advisor's private notes are never visible to the traveler or to another agency. Nothing an agency builds is shared. Only what the traveler explicitly grants is shared, and only with agencies they've engaged.

It also allows a `TravelerProfile` to exist with zero agency relationships — which is what makes discovery and self-planning possible at all.

### 2. Separate the sellable product from the itinerary

`Trip` is currently agency-scoped by design. A self-planned trip has no `agency_id`. Making that nullable would quietly break every tenancy guarantee in the system.

Instead:

- **`Trip`** — an agency's packaged, sellable offering. Stays agency-scoped. Unchanged.
- **`Itinerary`** — a day-by-day plan, owned by *either* a `TravelerProfile` or an `Agency` via a polymorphic owner.

An `Itinerary` can be **forked** with an ownership change. This makes three important flows the same operation:

- Traveler self-plans, then hands the draft to an advisor → fork to agency
- Agency proposes, traveler personalizes their copy → fork to traveler
- Agency templates a past trip for a new client → fork to agency

### 3. Three-way procedure scoping

`platformProcedure` vs. agency-scoped is no longer sufficient. Add **traveler-scoped procedures**, keyed on `traveler_id` from the session rather than `agency_id`. This is a security boundary, not a convenience — get it into `packages/trpc` before any traveler surfaces are built.

| Procedure | Enforcement key | Guards |
|---|---|---|
| `platformProcedure` | Platform admin role | Destination catalog, platform config |
| `agencyProcedure` | `agency_id` from session | Trips, clients, CRM, agency profile |
| `travelerProcedure` | `traveler_id` from session | Profile vault, saved trips, self-planned itineraries, trip hub |

Cross-boundary reads (an agency reading traveler-granted profile fields) resolve through `Engagement` consent tier, never by direct FK access.

---

## Feature Epics

### Epic A — Shared Destination Catalog *(existing, expanded role)*

Platform-owned, guarded by `platformProcedure`. Unchanged in structure: single `Destination` model with `DestinationType` enum, self-referential parent/child hierarchy, editorial `Region`.

What changes is its **strategic role**. The catalog is now:

- The browse substrate for traveler discovery
- The tagging vocabulary for advisor expertise (`AgencySpecialty` references `Destination`)
- The semantic search index (pgvector)
- The join key connecting travelers to agencies

A traveler on the Amalfi Coast destination page sees trips *and* the advisors who specialize there. The catalog stops being content and becomes infrastructure.

**Surfaces:** public site (browse), admin (platform catalog management)

---

### Epic B — Agency & Advisor Public Profiles *(new)*

`Agency` gains a public identity beyond being a tenancy container.

**Agency profile:** name, branding, bio, destination specialties, trip-type specialties (honeymoon, family, group, adventure, luxury FIT), budget tier, consortia and credential affiliations, languages, typical response time, sample itineraries drawn from their own trip catalog.

**Advisor profiles:** individual staff within an agency get their own profile — travelers hire people, not companies. Advisor-level specialties may differ from the agency's.

Agencies already write this copy for their own sites. Atlora gives it distribution.

**Models:** `AgencyProfile`, `AdvisorProfile`, `AgencySpecialty` (→ `Destination`), `TripTypeSpecialty`

**Surfaces:** public site (profile pages), admin (profile editor)

---

### Epic C — Advisor Discovery & Matching *(new — headline traveler feature)*

The direct answer to "people want travel agents but don't know how to find them."

**Phase 1 — Directory.** Browse and filter advisors by destination expertise, trip style, budget tier, language, and specialty. Entry points: dedicated advisor search, destination pages, trip detail pages.

**Phase 2 — Guided match.** A short intake (destination, style, budget, group size, dates) returns 2–3 recommended advisors with reasoning. Built as an additive layer over the same profile and specialty fields as the directory.

**Deferred — Trip request broadcast.** Traveler posts a brief; matching agencies respond with proposals. Highest traveler value, but invites price competition, and some agencies will resent being one of five bidders. Requires supply density to avoid failing visibly. Revisit after directory traction.

> **Ranking policy — non-negotiable.** Placement in discovery is never for sale. Tier may gate *whether* an agency appears; it must never influence *where*. Ranking is driven by fit, responsiveness, and outcomes only. Selling rank turns matching into a function of budget, travelers notice, and the discovery layer degrades into an ad marketplace — destroying the one thing that makes Atlora not-Tern.

**Models:** `DiscoveryQuery`, `MatchResult`, ranking signals on `AgencyProfile`

**Surfaces:** public site, traveler portal

---

### Epic D — Traveler Identity & Profile Vault *(reframed from "Traveler Accounts")*

Enter it once, reuse it everywhere.

**Contents:** personal details, passport and ID documents, travelers-in-party (family, companions) with their own details, dietary restrictions, accessibility needs, seat and room preferences, loyalty program numbers, emergency contacts, travel insurance.

**Consent model — trip-scoped and tiered**, mapped to `Engagement.status`:

| Engagement status | Agency can access |
|---|---|
| `inquiry` | Basic profile: name, contact, party size, stated preferences |
| `active` | Full preferences, dietary/accessibility, travelers-in-party |
| `booked` | Sensitive documents: passport, ID, insurance |
| `archived` | Retained per retention policy; no new reads |

Travelers can revoke at any tier. Revocation is logged and surfaced to the agency.

*Alternatives considered: all-or-nothing sharing (travelers balk at handing passport data to an unhired agency); field-level grants (maximum control, unusable UX).*

**Why both sides win:** this is the highest-value traveler feature *and* it eliminates the repetitive intake-form drudgery advisors complain about across every competitor platform.

**Models:** `TravelerProfile`, `TravelerDocument`, `PartyMember`, `ConsentGrant`

**Surfaces:** traveler portal, mobile, admin (read-only, consent-scoped)

---

### Epic E — Unified Trip Hub *(reframed from "Traveler Portal")*

One place for every trip across every agency — upcoming, in progress, past.

Per trip: itinerary, documents, messages with that agency's advisor, payment status, flight details. **Branding surfaces per trip**, not per app — each trip carries its agency's identity, while the shell is Atlora's. This is the inverse of every competitor, where the entire app is one agency's skin and travelers need a separate app per agency.

**Table-stakes delivery features** (Vamoos is the bar; match it, don't try to beat it in v1): offline itinerary access, live flight alerts, document storage, in-app messaging, maps with points of interest, weather, countdown.

**Persistent travel history.** Past trips remain permanently, searchable by destination, date, and agency. Travelers demonstrably want this — reviewers of competitor apps cite looking back years later for hotel names and places visited — and today they only get it as a side effect.

**Models:** trip hub views over `Engagement`, `Trip`, `Itinerary`, `TravelerDocument`

**Surfaces:** traveler portal, mobile (Expo)

---

### Epic F — Self-Planning Tools *(new — traveler paid tier)*

For travelers who want to plan their own trips but want real tooling.

**Free:** saved trips, wishlists, basic day-by-day itinerary, catalog browse and search, trip hub, profile vault, inquiries.

**Paid:** multi-day itinerary building with time and logistics awareness, AI itinerary generation and iterative refinement, collaborative planning with companions, offline maps and document management for self-organized trips, budget tracking, deep semantic search and side-by-side comparison over the catalog.

**Hand-off to an advisor.** A prominent affordance converting a self-planned draft into an inquiry brief — the fork operation from the data model. A traveler who starts self-planning and hits complexity (multi-country routing, a group of eight, a honeymoon they don't want to get wrong) is the most qualified lead an agency could receive: intent, destination, dates, budget, and party size are already declared.

> Keep this affordance prominent, not buried. It is the mechanism that converts the overlap between self-planners and advisor-users, and the hedge against the paid traveler tier cannibalizing agency leads.

**Models:** `Itinerary` (traveler-owned), `ItineraryDay`, `ItineraryItem`, `Collaborator`

**Surfaces:** traveler portal, mobile

---

### Epic G — Inquiry & Engagement Routing *(reframed from "Lead Management")*

An inquiry now originates from a **known traveler** with a populated profile and saved-trips history.

**Traveler side:** submit to one or more agencies, track status, compare responses, convert to an active engagement or archive.

**Agency side:** arrives in the existing CRM as a qualified lead — same object advisors already work, but richer. Includes consent-scoped profile data, saved trips signalling interest, and any self-planned itinerary attached.

**Multi-agency inquiries** are supported and visible to the traveler. Whether agencies see that they are one of several is a policy decision (see Open Decisions).

**Models:** `Inquiry`, `Engagement`, `InquiryResponse`

**Surfaces:** public site, traveler portal, admin

---

### Epic H — Agency CRM & Trip Management *(existing, extended)*

Largely unchanged. Extensions:

- Agency and advisor profile management
- Inbound lead handling from discovery
- Consent-scoped reads of traveler profile data
- Itinerary fork from traveler drafts

Existing scope stands: trips, clients, bookings, communications, documents, reporting.

**Surfaces:** admin

---

### Epic I — Entitlements & Billing *(new, cross-cutting)*

Plans now exist on **two subject types** with different billing cycles and different feature sets. Scattered tier checks will metastasize across the API.

**Single resolver:** `hasEntitlement(subject, feature)` called from tRPC procedures. `subject` is an `Agency` or a `TravelerProfile`; the resolver handles plan lookup, feature mapping, and usage limits.

**AI usage metering from day one.** The traveler free tier carries real marginal cost and zero revenue, subsidized by agency subscriptions. Log token spend per subject from the first AI call — before enforcing any limits — so limits are set against real data. Every competitor with AI features has hit this wall.

**Models:** `Plan`, `Subscription`, `Entitlement`, `UsageRecord`

---

### Epic J — Workbench *(new — shared surface, both sides)*

Targeted single-purpose planning tools, available in the traveler portal and inside the agency CRM. Same tool, same output contract, two contexts. This is the first feature where advisor and DIY traveler use identical tooling — the advisor just works faster and on someone else's behalf.

Route: `/workbench`. The container carries the personality; individual tools are named literally.

| Tool | Purpose |
|---|---|
| Flight Search | Routing, fare windows, cabin comparison |
| Layover Planner | Deliberate stopovers — minimum connection time, transit visa eligibility, whether the city is worth leaving the airport for, cost delta vs. direct |
| Stay Finder | Hotels and alternatives, filtered against profile vault preferences |
| Activity Finder | Things to do, tied to catalog destinations |

**Backlog tools:** ground transport, visa and entry requirements, seasonality and weather windows, budget estimator.

**Lead with Layover Planner.** Flight and hotel search are commodities — every OTA has them and Atlora's will be worse. Strategic layover planning is genuinely underserved, is a real advisor skill, demos in fifteen seconds, and runs largely on static data (routes, airports, transit visa rules) rather than live supplier APIs. Cheapest differentiated thing to build, and the one most likely to make a DIY user conclude the platform actually knows travel.

**Architectural spine — every tool emits a candidate `ItineraryItem`.** A tool result is not a search page to screenshot; it is a thing you pin to an `Itinerary`. That single contract is what makes this an epic rather than a pile of widgets, and it is what lets an advisor run the Layover Planner and drop the result straight into a client proposal.

> **Booking boundary — non-negotiable.** Atlora never takes payment for flights, rooms, or activities, and never holds inventory. Workbench brings the user to the point of decision with everything knowable in hand, then hands off — to an advisor, or out to the supplier. `BRAND.md` positions Atlora against OTAs; the moment Workbench takes a payment, the structural difference between Atlora and Expedia collapses to "we also have a CRM," and Atlora inherits fulfillment and cancellation liability it has no business inheriting. Structural, in the same class as the discovery ranking policy — not a configuration flag.

> **Affiliate guardrail.** Affiliate commission on referred bookings is a viable revenue line and does not violate the booking boundary. But commission rate must never enter a sort, rank, or default-selection path, and no payout field belongs in the ranking code path. Affiliate relationships are disclosed at the point of the link. See `BRAND.md` guardrails.

**Entitlements.** Tools are a natural metering unit for both subject types — `hasEntitlement(subject, 'tool:layover_planner')`. No new machinery; fits Epic I as-is. Basic search and single-variable lookup are free; AI-assisted reasoning, multi-variable optimization, and saved comparisons are paid, consistent with the Epic F line.

**Secondary effect — catalog flywheel.** Activity and stay results enrich the shared destination catalog. Tool usage reveals which places, routes, and seasons travelers actually care about, feeding the pgvector index and the structural moat. Free tools generating catalog signal is a stronger version of the flywheel argument already made for the traveler free tier.

**Models:** `ToolRun` (invocation record — subject, tool, params, timestamp; feeds usage metering), `ToolResult` (structured output, convertible to `ItineraryItem`), `SupplierQuery` (cache layer over external supplier APIs for per-call cost and rate-limit control), `ItineraryItem` (existing — the output contract)

**Surfaces:** traveler portal, admin, mobile (review-only in v1)

---

## Monetization

### Agency tiers

Metered on **seats × feature depth**. Marketplace access is a tier gate, never a metered charge, and never a ranking input.

| Tier | Marketplace | Core | Advanced |
|---|---|---|---|
| **Starter** | Not listed | CRM, trips, itineraries, documents, traveler portal delivery | — |
| **Growth** | Public profile, inbound leads | + automations, forms, group trips | — |
| **Agency** | Full discovery presence, advisor profiles | + team management, permissions | Commission reconciliation, reporting, API, custom domain |

*Alternatives considered: pure per-seat (most commoditized axis, punishes hiring junior staff); trip/booking volume caps (aligns price with value but caps are the most-complained-about mechanic in this market — TravelJoy's 12-trips/year Starter is a recurring gripe).*

**Payments processing** remains the longer-term revenue anchor. It captures value from every trip regardless of whether discovery was involved, and it is the industry's proven lever — payment fees are roughly 86% of a working advisor's platform spend. Deferred to a later phase; when it lands, price below TravelJoy's 3.5% card rate and near WeTravel's ~1% + $0.30 bank-transfer rate.

### Traveler freemium

**Constraint: everything that generates demand signal stays free.** Saved trips, wishlists, profile vault, document storage, inquiries, the unified trip hub, catalog browse. These are what agencies pay for. Gating them starves the flywheel to collect small consumer dollars — a bad trade.

Paid tier is the productive self-planning tooling in Epic F — conveniently, also the AI-heavy features with real marginal cost.

**Billing cycle.** Most people travel once or twice a year. A monthly subscription mismatches this badly: travelers subscribe in planning season and churn immediately, producing terrible retention metrics that don't reflect a bad product.

**Recommended: annual, with a per-trip unlock as the entry point.** Unlock full planning tools for one trip cheaply; annual priced to pay for itself if you travel twice. Per-trip maps to how people actually think about travel spend and is psychologically easy next to a $4,000 flight.

*Alternatives considered: monthly (brutal churn, seasonal revenue swings); annual only (smooths revenue, harder first conversion); credits (aligns with COGS directly, but widely disliked and adds friction at exactly the wrong moment).*

---

## Phase Alignment (revised)

The reframing pulls traveler identity forward. The model is incoherent without it.

### Phase 1 — Foundation + Identity
- `packages/db`: `TravelerProfile` / `Client` / `Engagement` split, `Itinerary` polymorphic ownership
- `packages/trpc`: three-way procedure scoping
- Destination catalog, trips, agency onboarding
- Traveler auth and basic profile
- Public site: catalog browse, trip discovery

### Phase 2 — Discovery
- Agency and advisor public profiles
- Advisor directory with filtering
- Inquiry and engagement routing
- Agency CRM lead handling
- Profile vault with consent tiers

### Phase 3 — Traveler Experience
- Unified trip hub
- Mobile app (Expo)
- Document delivery, messaging, offline itineraries
- Self-planning tools (free tier)
- Workbench shell, tool registry, `ItineraryItem` pinning
- Workbench tools with no supplier dependency: Layover Planner (static route/airport/transit-visa data), Activity Finder (runs off the shared catalog)

### Phase 4 — Monetization & Intelligence
- Entitlements and billing, both subject types
- Traveler paid tier and AI planning tools
- Guided match
- Semantic search (Python AI service)
- `SupplierQuery` caching layer
- Workbench tools requiring live supplier APIs: Flight Search, Stay Finder
- Affiliate link handling and disclosure
- Payments processing

> **Why Workbench splits across two phases.** The supplier-API tools carry per-call cost, rate limits, contract negotiation, and a caching layer none of the other epics need. Splitting lets the differentiated tool (Layover Planner) ship and demo in Phase 3 without signing a supplier contract.

**Deferred:** per-agency public microsites — these matter far less if platform discovery is where travelers land. Trip request broadcast. Platform super-admin.

---

## Open Decisions

1. **Cold-start sequencing.** Seed agencies first (sell CRM, build supply, add discovery once dense) — lower risk, slower story. Or run a narrow vertical (one destination, one trip style) where density is achievable — better demo, higher risk. Two-sided marketplaces fail on the expensive side, which here is travelers.

2. **Inquiry transparency.** Do agencies see that they're one of several receiving an inquiry? Transparency is honest and lets agencies self-select out; opacity avoids depressing response quality. Affects `Inquiry` schema either way.

3. **Advisor ranking signals.** Response time and outcome data don't exist at launch. Interim ranking needs a defensible proxy (specialty match strength, profile completeness, recency) that won't be gamed.

4. **Cannibalization watch.** If self-planning tools get genuinely good, some travelers who would have hired an advisor won't — capturing a few consumer dollars from someone an agency would have paid far more to reach. Likely small if traveler personas are behavioral modes rather than distinct populations, but revisit once data exists.

5. **Workbench supplier API selection and cost model.** Air: Duffel, Amadeus Self-Service, or Kiwi. Activities: Viator or GetYourGuide. Hotel content source undetermined. This is the largest external dependency in the platform and the most likely cause of Epic J slipping.

6. **Affiliate disclosure copy and placement.** Policy is settled (disclose at the point of the link, never let payout influence a sort). Wording and surface treatment are not written.

7. **Advisor vs. traveler Workbench parity.** Whether advisors get bulk or side-by-side comparison modes that DIY travelers don't, or whether the tools stay strictly identical across both sides. Identical is simpler and reinforces the "same tooling, both sides" claim; differentiated is a plausible agency-tier upsell.
