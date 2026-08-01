# Competitive Analysis: Travel Agency Software Platforms — Strategic Brief for Atlora

## TL;DR
- **Atlora's genuinely defensible wedge is the combination of a platform-owned shared destination catalog + a cross-agency public discovery/marketplace layer, sitting on top of true organization-per-agency multi-tenancy with token-level theming — no incumbent combines all three.** Every established competitor is either an advisor-facing back-office/itinerary tool (Tern, TravelJoy, Travefy, TripSuite, TESS, PlanItEasy) or a traveler-app/content layer (mTrip, Vamoos, Axus, Wetu, Safari Portal); none owns both a shared catalog inherited by all tenants and a consumer-facing multi-agency marketplace.
- **The AI features Atlora treats as differentiators — email/PDF-to-proposal parsing, AI itinerary generation, semantic search — have become table stakes, not moats.** Tern, TravelJoy, mTrip, Polaris, Travefy, Vamoos, Safari Portal and Axus all shipped some form of AI import/parsing in 2025–2026. Atlora must have these at parity; the marketplace + shared-catalog layer is where it can actually differentiate.
- **The biggest commercial risk is that Atlora's public/marketplace discovery layer directly conflicts with the ownership instincts of the exact customers it targets** — advisors and agencies are conditioned to guard their client lists and brand, and every successful incumbent monetizes by reinforcing (not diluting) each agency's individual brand. Payment processing is the industry's proven monetization lever — TravelJoy Pro charges 3.5% + $0.30 per card transaction and WeTravel takes a fee "starting as low as 1% + $0.30 per transaction" with no monthly/setup/payout fees — and Atlora will be expected to offer it.

## Key Findings

1. **The market splits into three archetypes.** (a) Advisor CRM + itinerary all-in-ones for solo/small US leisure advisors (TravelJoy, Travefy, Tern, Polaris, TripSuite, TESS, PlanItEasy); (b) Design-led itinerary/proposal + traveler-app tools for luxury FIT, tour operators and DMCs (Safari Portal, Wetu, Axus, Vamoos, mTrip, Tourwriter, Ezus); (c) Payments-first and enterprise back-office/ERP (WeTravel, TravelOperations). Atlora spans (a) and (b) at the platform layer and adds a consumer discovery layer none of them has.

2. **"Combined public marketing site + back-office CRM" is only partially covered.** Travefy, TravelJoy, Polaris and Tern all offer per-agency website/landing-page builders bolted onto their CRM. But these are single-agency sites, not a shared discovery destination. Atlora's model — a public discovery layer that aggregates across all tenant agencies — has no direct analog among the advisor tools.

3. **A platform-owned shared destination catalog inherited by all tenants is Atlora's clearest structural advantage.** Competitors provide content libraries (TravelJoy: cruise-line and hotel content; Travefy: city guides; Axus/Wetu: destination content) but these are either licensed third-party content or per-agency private libraries — not a single canonical catalog that every tenant inherits and that also powers cross-agency discovery. Wetu's shared content ecosystem is the closest B2B analog but is supplier-distribution-oriented, not a consumer discovery catalog.

4. **True white-label multi-tenancy exists but is fragmented.** mTrip and Vamoos offer genuine white-label traveler apps (published under the agency's own name). WeTravel offers white-label checkout. But these are white-label at the *traveler-app or checkout* layer, not a full organization-per-agency architecture spanning public site + admin portal + traveler portal with token-level theming. That full-stack multi-tenant white-labeling is rare.

5. **A cross-agency public discovery/marketplace is essentially whitespace.** Only WeTravel operates a true consumer-facing cross-vendor marketplace (travelers discover trips from many operators). PlanItEasy has marketed a "virtual travel ecosystem / P2P marketplace" for years but it remains aspirational/future-tense and its consumer app is explicitly "not a booking app." Tern's consumer connectivity is on the roadmap ("much further down the road"). Travefy only has per-agency sites plus a B2B content-sharing "Marketplace" launched Aug 2024 that surfaces user- and supplier-generated content from its 30,000 travel brands — professional template-sharing, not consumer discovery. This is Atlora's most contested-but-open lane.

6. **Payments is the monetization battleground.** TravelJoy charges 3.5%+$0.30 (Pro) / 5%+$0.30 (Starter) on cards and 1.5%/3% ACH; WeTravel monetizes almost entirely through processing fees (from ~1%+$0.30 for local bank transfers) plus an optional $79/mo Pro tier; Travefy and Tern embed payments/credit-card authorization. For a working TravelJoy advisor, roughly 86% of total platform cost is payment fees, not subscription. Atlora will be expected to offer integrated payments and can monetize the same way.

## Details — Platform-by-Platform

### Tern (Dover/Plymouth; founded 2022–2023)
- **Segment:** Modern solo advisors → host agencies/enterprise. Tern's own site claims 11,000+ advisors; press coverage (PhocusWire/Travel Weekly, 2025) cites "more than 5,000 advisors and 1,000 agencies" — treat the higher figure as vendor-current and the press figure as the independently reported number. (Founding year is reported as 2022 by Crunchbase and 2023 by Tracxn/press.)
- **Features:** Full CRM, itinerary/proposal builder, client forms/intake, credit-card authorization, scheduling & booking, reports. Agency plans (3+ seats) add commission reconciliation, supplier payment management, agency-wide reporting. Insurance integrations (Chubb), consortia integrations (Signature; Virtuoso "coming soon"). AI: "AI Assist" parses pasted text, PDF upload, or a URL into activities; email monitoring drafts emails and builds itineraries; AI destination guides/packing lists. Mobile traveler app (refreshed 2025).
- **Pricing (2026):** Individual ~$39/seat/mo (as low as $32 annual); agency tiers scale from $33/seat down to $22–23/seat annually at 100+ seats. Tern Pro is an optional add-on for higher AI usage. Free trial (2 weeks; some comparisons cite 30-day), no card. Centralized agency billing.
- **Funding/momentum:** Confirmed via Travel Market Report — "$13 million ... led by Viewpoint Ventures and Haystack VC ... adds to a previously unannounced $4 million seed round from Upfront Ventures, bringing the total raised to $17 million." CEO David Shull. Acquired Lucia (advisor services) in 2025. Ships weekly; explicitly positions to "replace fragmented back-office tools."
- **Sentiment:** Praised for consolidation, modern UX, responsiveness. Watch items: newer platform, some enterprise features (GDS) still maturing.

### TravelJoy (San Francisco; founded 2016)
- **Segment:** Solo advisors and small leisure agencies; weak fit for GDS-heavy/host-mandated-ClientBase advisors (no Sabre/Amadeus/ClientBase integration).
- **Features:** CRM, itinerary builder (content library of cruise lines and hotels), forms, contracts, invoices, payments, automations, group tools (Pro). AI: "Magic Email" (forward supplier emails to magic@traveljoy.ai → auto-added to trip), "Magic Importer" (PDF/image → editable itinerary items), "Itinerary Copilot" (prompt-based). Premium adds Zapier, SMS, email marketing, integrated cruise bookings with own credentials.
- **Pricing (2026):** Starter $19/mo (12 trips/yr cap, 5%+$0.30 card, 3% ACH); Pro $39/mo or $32/mo annual (unlimited trips, 3.5%+$0.30 card, 1.5% ACH). Premium tier above. Per-advisor billing. 7-day trial, no card. No free plan.
- **Sentiment:** Praised for all-in-one simplicity and client-facing polish; complaints about card-processing fees being "a bit high," per-advisor cost scaling for agencies, and no host/GDS integration (forces two CRMs for hosted ICs).

### Travefy (founded 2012, pivoted to B2B ~2016; 30,000+ travel brands)
- **Segment:** Solo advisors and small-to-mid agencies, itinerary-first US leisure. Also DMOs. Rated "#1 itinerary builder for three consecutive years by Host Agency Reviews."
- **Features:** Drag-and-drop itinerary builder (city guides, 100+ supplier integrations, live flight data), CRM with forms/automations, proposals, invoicing & commission tracking, website/landing-page builder, mobile apps (Pro app with offline + live flight updates). AI: "Smart Import" (AI: paste text or PDF upload → bookings); separate non-AI email-forward booking import (template matching across ~1,500 suppliers, does NOT support PDFs/quotes). A B2B "Marketplace" (launched Aug 2024) shares user- and supplier-generated content across its 30,000-brand network.
- **Pricing (2026):** Core $39/mo (or $31–35/mo annual); Premium $59/mo (adds custom domain, business email hosting, phone support); Team/Agency add-on ~$20/mo per additional seat. New Travel Agent Program $25/mo (first year). 10-day free trial.
- **Sentiment:** Praised for professional output, support, webinars, constant feature additions. Complaints: limited layout/design flexibility, flat pricing hard to justify at low itinerary volume, choppy first-week onboarding; no built-in total-trip-cost calculation historically.

### Polaris CRM (polariscrm.ai)
- **Segment:** Independent advisors and boutique/host agencies wanting a modern, low-implementation AI-first CRM.
- **Features:** CRM, itinerary builder, sales pipeline, live flight tracking, marketing, payments, agency branding/sender identity, lead assignment, owner visibility. AI ("Copilot"): itinerary drafting from a single sentence, supplier PDF parsing & auto-import (plus a Chrome-extension smart sidebar that reads supplier booking pages and imports into the right trip), email drafting in your voice, AI CSV import.
- **Pricing (2026):** Free tier with Copilot (20 requests/mo); Pro (300 requests/mo); Agency (700 requests/mo); Enterprise on request. Sign in with Google, no migration/setup call.
- **Sentiment:** Positioned as fast-to-adopt and travel-specific; newer/smaller footprint than Tern/Travefy.

### Safari Portal (built by tour operators; not safari-only)
- **Segment:** High-end travel advisors, tour operators, DMCs; design-led luxury FIT.
- **Features:** Award-winning interactive itinerary builder + print PDF/Word proposals, sales pipeline, contacts, tasks, payments/invoicing, custom forms, Lookbooks, guest portal, branded Travel Portal traveler app (own fonts/colors/logo). AI: "Magic Import" (parse existing PDF itineraries → editable) + a "Built-in AI Assistant" (prompt-based text drafting inside text blocks). White-labeling for B2B is a paid add-on.
- **Pricing (2026):** Basic $199/mo (1 user); Standard $299/mo (adds unlimited itineraries, traveler app, tasks, custom forms, AI assistant); Deluxe adds 2 users. Add-ons: extra users, invoicing/financials, white-labeling, API, translation, custom templates. Independent reviews cite 4.5/5.
- **Sentiment:** Praised for design quality and travel-insider fit; premium price point; strong for HNW personalization.

### Wetu (South Africa; B2B content ecosystem)
- **Segment:** Tour operators, DMCs, travel agents, suppliers — heavy in safari/Africa and content-rich bespoke travel.
- **Features:** Interactive/digital itinerary builder, iBrochures, virtual brochure racks, one of the largest tourism content ecosystems, multi-language, CRM/customer database, quotes, customizable branding, supplier management. Integrates with Travefy, Lemax, Tourplan, ResRequest, Nightsbridge, Umapped, daVinci, Nitro, etc. Mobile app (online/offline).
- **Pricing (2026):** Commonly cited from ~$199/mo for small operations (varies; request-based).
- **Sentiment:** Praised for visual content depth and supplier network; more content-distribution CMS than back-office/CRM.

### Axus Travel App (acquired by Northstar Travel Group, 2017)
- **Segment:** Luxury FIT advisors, consortia, DMCs, host agencies, TMCs, multi-branch. Virtuoso "Best Specialty Partner."
- **Features:** Itinerary builder with agency branding, content library, Travel42 destination guides, branded traveler mobile app, document storage, in-app messaging, e-pages, digital guides, master calendar, tasks, analytics/CSV export. Integrations: ClientBase sync, GDS/PNR import (Sabre/Travelport), insurance/day-activity providers. Parsing: forward vendor confirmations to a unique parsing email (processed via AwardWallet, supported vendors, ~7–12 min import) — email-forward auto-import, not generative AI.
- **Pricing (2026):** Not publicly listed; monthly/annual subscriptions, per-seat, with branded-app and API add-ons. 14-day full-feature trial, no card.
- **Sentiment:** Praised for intuitive UI, document delivery via app, supplier ubiquity; users want stronger destination guidebooks.

### Vamoos (UK; ~10+ years)
- **Segment:** Luxury/boutique tour operators and FIT, especially European leisure. Sits on top of existing booking/CRM stacks via open API.
- **Features:** Branded traveler app (imagery-led itineraries, offline, countdown, pre/post-trip engagement, in-app brochure for rebooking), documents, flight updates, messaging. AI: "TripImport" (PDF itinerary → structured day-by-day trip; PDF only), "Imsert" (auto-tags image library). White-label app available at higher tiers.
- **Pricing (2026):** ~£200–£800/mo depending on operation size; priced on annual passenger volume; no setup fees; 10% annual discount; Imsert now included.
- **Sentiment:** Praised for premium visual output and client love; noted linear cost growth with volume; group per-passenger storyboard edits are a friction point.

### mTrip (300+ brands, 35+ countries)
- **Segment:** Travel agencies, tour operators, TMCs wanting fully white-label branded apps; GDS-connected operations.
- **Features:** White-label mobile app published under agency's own name (App Store/Google Play), Trip Builder, itinerary management, document delivery (mobile/web/PDF), destination guides, maps, packing list, expense tracker, translation, visa checks, messaging, push, duty-of-care/risk management, 10 languages, offline. AI: "AI Import Wizard" (published February 2026, Google Vertex AI) — "transforms booking content into a fully structured itinerary in just a few clicks"; processes PDFs, emails, Word, Excel, cruise/tour docs, or pasted details. Named GDS integrations: Amadeus, Sabre, Travelport; mid-office: Tourplan, Moonstride, Ezus, Juniper; Zapier.
- **Pricing (2026):** Sales-led/custom. Trip Agent (entry, shared infra, fast 1–2 week deploy) vs full white-label (own App Store listing, one-time setup + monthly by itinerary volume). No public per-seat price; no advertised free tier.
- **Sentiment:** Traveler app rated 4.9/5 across 448 reviews (vendor-cited); praised for breadth and GDS connectivity.

### TripSuite (venture-backed; Virtuoso Preferred Supplier since 2023)
- **Segment:** Travel agencies (front-to-back office), teams/branches, host agencies.
- **Features:** CRM, commission tracking, accounting, itineraries, analytics, workflow automation; permissions/branches; "AI-powered." Positions to replace legacy CRM/commission/accounting.
- **Pricing (2026):** ~$49/user/mo; Virtuoso members 10% off (~$44/user/mo). Demo-led.
- **Sentiment:** Early-stage; strong at fintech/accounting-meets-travel; smaller footprint.

### TESS (Travel eSolutions; Jacksonville, FL; founded 2014)
- **Segment:** Host agencies, storefront+IC hybrids, solo agents; strong at multi-agent commission reconciliation.
- **Features:** Custom travel CRM, agent management, commission management (multi-agent/sub-agent reconciliation), invoices, trips/bookings, vendor management, dashboards, Excel uploads, automated emails, task reminders. Central airline/cruise schedules. Used as ABC Host Agency's official CRM.
- **Pricing (2026):** From $10/mo (Standard flat-rate); ~$25/mo Advanced. Flat-rate per agency (not per seat). Free version + free trial.
- **Sentiment:** Praised as easy-to-learn CRM with strong commission/booking tracking and one-on-one training; complaints: dated UI, weak itinerary builder, some clunky automations, no client "sharing" across agents.

### PlanItEasy (founded 2013, Christopher Eriksen & Jakob Bay)
- **Segment:** Consortia, DMCs, hosted advisors, host agencies, multi-branch, tour operators — complex custom/group travel.
- **Features:** CRM, itinerary builder (complex multi-day/multi-supplier), forms/templates, invoices, payments (client credit cards), commission tracking, accounting, booking tools, client portal/app, directory. Client-facing app is delivery-only ("not a booking app"). Markets a "virtual travel ecosystem / P2P marketplace" — aspirational/future-tense, not a live consumer marketplace.
- **Pricing (2026):** Not publicly listed (request-based).
- **Sentiment:** Praised for consolidating tools, user-friendliness, value; minor complaints about document-location inconsistencies and room/price field UX.

### WeTravel (payments-first)
- **Segment:** Group trip organizers, tour operators, retreat/adventure/affinity, DMCs. Individual → enterprise.
- **Features:** Trip-page builder (public or private), package creation, booking management, document/signature collection, multi-currency (34+ currencies), payment plans/installments, supplier/vendor payouts (cross-border), reporting, itinerary builder (with AI text generation + supplier import). White-label checkout (custom URLs, branded traveler login on Pro). Partner API. Consumer-facing cross-vendor **marketplace** where organizers can list trips for traveler discovery.
- **Pricing (2026):** Free to create/accept payments (transaction fees only, "starting as low as 1% + $0.30 per transaction" for local bank/ACH; cards higher; 3.9% + WeTravel fee on non-standard currencies; $25 wire fee) with no monthly/setup/payout fees. Pro $79/mo per organization (30-day money-back) unlocks white-label elements, lead capture, API. Enterprise custom.
- **Sentiment:** Praised for payment simplicity, low fees, group management, reporting; serious complaints about chargeback handling, support responsiveness on disputes, and revenue-share on higher tiers.

### TravelOperations (Denmark/US/AU/IN; on Microsoft Dynamics 365)
- **Segment:** Mid-to-large TMCs and travel agencies needing ERP/mid-and-back-office + CRM. Enterprise.
- **Features:** ERP/back-office (finance, BSP/ARC reconciliation, GDS-neutral, package/group allotment), CRM (Dynamics 365 Sales, marketing automation, traveler profiles, VIP prioritization), Copilot AI for finance/ops. GDS integration.
- **Pricing (2026):** ~$120/user/mo (incl. Microsoft Business Central license + travel functionality); minimum 10 users. Implementation-led.
- **Sentiment:** Enterprise-grade, future-proofed via Microsoft; heavy implementation; not for solo/small advisors.

### Tourwriter (NZ; tailor-made tour operators/DMCs)
- **Segment:** Small boutique luxury FIT operators, DMCs (1–50 staff).
- **Features:** Supplier + rates database, itinerary builder (visual, live rates/markups), quotes, bookings, supplier email requests with status tracking, CRM, price/margin management, 2-way Xero accounting integration, reporting, customizable branding.
- **Pricing (2026):** Starter $99/user/mo (1 user, 25 itineraries/yr); Pro $149 (2–5 users, 50/user); Premium $249 (unlimited). No free trial.
- **Sentiment:** Praised for itinerary beauty, conversions, onboarding/support, Xero sync; complaints about slow feature implementation and pace of some rollouts.

### Ezus (France; 600–3,000+ agencies across 70–80+ countries)
- **Segment:** B2B DMCs, tour operators, tailor-made agencies, MICE. Not solo one-off advisors.
- **Features:** Itinerary/quote builder, reusable templates/components, supplier catalog with contracts/rates/blackouts, net/commissionable rate + markup + FX + multi-VAT (incl. EU margin scheme) tracking, margin/scenario tools with change history, multilingual branded document generation (PPT/Word/Excel/PDF), CRM pipeline, supplier email integration, client payments. No direct GDS; no built-in white-label traveler app.
- **Pricing (2026):** From €75/user/mo (Professional); €100/user/mo (Premium); Enterprise custom. No free trial. Capterra 4.7/5 (60 reviews); G2 4.9/5 (18 reviews).
- **Sentiment:** Praised for multi-currency/VAT/margin depth and document automation (claims up to 30% conversion lift); best for B2B inbound/DMC workflows.

## Feature Coverage Matrix

Legend: ● Full · ◐ Partial/add-on/third-party · ○ Absent/none found

| Capability | Tern | TravelJoy | Travefy | Polaris | Safari Portal | Wetu | Axus | Vamoos | mTrip | TripSuite | TESS | PlanItEasy | WeTravel | TravelOps | Tourwriter | Ezus |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CRM / lead mgmt | ● | ● | ● | ● | ◐ | ◐ | ◐ | ○ | ○ | ● | ● | ● | ◐ | ● | ◐ | ◐ |
| Itinerary/proposal builder | ● | ● | ● | ● | ● | ● | ● | ● | ● | ◐ | ◐ | ● | ◐ | ◐ | ● | ● |
| Payments / invoicing | ● | ● | ● | ● | ● | ◐ | ○ | ○ | ○ | ● | ● | ● | ● | ● | ● | ● |
| Commission tracking/reconciliation | ● | ◐ | ● | ◐ | ◐ | ○ | ○ | ○ | ○ | ● | ● | ● | ◐ | ● | ● | ● |
| Group trip management | ● | ● | ● | ◐ | ● | ● | ◐ | ◐ | ● | ◐ | ● | ● | ● | ● | ● | ● |
| GDS / supplier integrations | ◐ | ○ | ◐ | ◐ | ◐ | ● | ◐ | ◐ | ● | ◐ | ◐ | ◐ | ◐ | ● | ◐ | ● |
| Website / public marketing site | ○ | ◐ | ● | ◐ | ◐ | ◐ | ○ | ○ | ○ | ○ | ○ | ◐ | ● | ○ | ○ | ○ |
| Traveler portal / mobile app | ● | ● | ● | ● | ● | ● | ● | ● | ● | ○ | ◐ | ● | ● | ○ | ◐ | ○ |
| — White-labeled to agency? | ◐ | ◐ | ◐ | ● | ◐ | ◐ | ● | ● | ● | – | ○ | ● | ● | – | ◐ | – |
| Document collection / forms | ● | ● | ● | ● | ● | ◐ | ● | ● | ● | ◐ | ◐ | ● | ● | ◐ | ● | ● |
| Automation / workflows | ● | ● | ● | ● | ◐ | ◐ | ◐ | ◐ | ◐ | ● | ● | ● | ◐ | ● | ● | ● |
| AI email/PDF → structured proposal | ● | ● | ● | ● | ◐ | ○ | ◐ | ◐ | ● | ◐ | ○ | ○ | ◐ | ◐ | ○ | ○ |
| AI itinerary generation / drafting | ● | ● | ◐ | ● | ◐ | ◐ | ○ | ◐ | ● | ◐ | ○ | ○ | ◐ | ◐ | ○ | ○ |
| Shared platform-owned catalog | ◐ | ◐ | ◐ | ○ | ◐ | ● | ◐ | ◐ | ◐ | ○ | ○ | ◐ | ◐ | ○ | ○ | ◐ |
| Cross-agency public marketplace | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ● | ○ | ○ | ○ |

## Pricing Comparison Table (2026)

| Platform | Entry price | Working/typical | Model | Payment fees | White-label add-on | Trial |
|---|---|---|---|---|---|---|
| Tern | ~$32/seat/mo annual | $22–33/seat by volume | Per-seat, centralized agency billing | Card auth included; supplier payments on agency plans | Agency branding included | 2 wks / 30-day, no card |
| TravelJoy | $19/mo Starter (12 trips/yr) | $32/mo Pro annual | Per-advisor | 3.5%+$0.30 card / 1.5% ACH (Pro) | Branding included; no full WL | 7 days, no card |
| Travefy | $25/mo (New Agent yr1) | $39/mo Core ($31 annual); $59 Premium | Per-user + ~$20/seat add-on | Card processing embedded | Custom domain on Premium | 10 days |
| Polaris | Free (20 AI req/mo) | Pro / Agency tiers | Per-seat + AI request tiers | Payments included | Agency branding included | Free tier |
| Safari Portal | $199/mo Basic | $299/mo Standard | Flat + per-user add-ons | Card auth/invoicing add-on | Paid add-on | Demo |
| Wetu | ~$199/mo (varies) | Request-based | Subscription | n/a (content CMS) | ◐ | Demo |
| Axus | Not public | Per-seat + add-ons | Per-seat | None native | Branded-app add-on | 14 days, no card |
| Vamoos | ~£200/mo | £200–£800/mo | By annual passenger volume | n/a | Higher tiers | Demo |
| mTrip | Sales-led | Setup fee + monthly by itinerary volume | Custom | n/a | Full WL is core offering | On request |
| TripSuite | ~$44–49/user/mo | Same | Per-user | n/a | – | Demo |
| TESS | $10/mo Standard | $25/mo Advanced | Flat per agency | n/a | – | Free version + trial |
| PlanItEasy | Not public | Request-based | Subscription | Client CC payments | Client app included | Demo |
| WeTravel | Free (fees only) | $79/mo Pro | Transaction-fee-led | From ~1%+$0.30 (bank) up | WL elements on Pro | Free; 30-day back on Pro |
| TravelOperations | ~$120/user/mo (min 10) | Same | Per-user + implementation | n/a | – | Demo |
| Tourwriter | $99/user/mo | $149–$249/mo | Per-user tiers | Via Xero | – | None |
| Ezus | €75/user/mo | €100/user/mo Premium | Per-user | Client payments | – | None |

*Pricing verified against vendor pricing pages and review sites as of 2026 where marked; mTrip, Axus, Wetu, PlanItEasy, TripSuite and TravelOperations are demo/sales-led and could not be fully verified to a public list price — flagged accordingly.*

## Gap Analysis vs Atlora's Five Differentiators

**(a) Combined public marketing/discovery site + back-office CRM in one platform.**
Partially covered by Travefy, TravelJoy, Polaris and Tern (all bolt a per-agency website/landing-page builder onto their CRM). WeTravel combines a public bookable trip page with booking/payment back-office. *Whitespace:* none of them unify a **shared, cross-agency public discovery destination** with the back-office — they only produce isolated single-agency microsites. Atlora's edge is real but only if the public layer is genuinely a discovery destination, not just another site builder.

**(b) Platform-owned shared destination catalog inherited by all tenants.**
Closest analog is Wetu's shared tourism content ecosystem (B2B supplier-distribution), plus licensed content libraries in TravelJoy/Travefy/Axus (Travel42). *Whitespace:* nobody offers a single canonical, platform-owned catalog that (i) every tenant inherits by default, (ii) tenants extend with private content, and (iii) simultaneously powers a consumer discovery layer. This is Atlora's strongest structural moat and the hardest for incumbents to retrofit.

**(c) True white-labeling via organization-per-agency multi-tenancy with token-level theming.**
Partially covered: mTrip, Vamoos (traveler apps under agency's own name), WeTravel (branded checkout), Polaris/Axus (branded client experiences). *Whitespace:* white-labeling today is confined to the traveler-app or checkout surface. A full org-per-agency architecture spanning public site + admin portal + traveler portal with token-level theming is not offered as a unified stack. Atlora can win here, but this is an engineering/architecture advantage that is invisible to buyers unless surfaced as tangible brand control.

**(d) Cross-agency public discovery/marketplace layer.**
Only WeTravel runs a true consumer cross-vendor marketplace. PlanItEasy's "ecosystem/P2P marketplace" is aspirational/unshipped; Tern's is roadmap; Travefy's "Marketplace" is B2B content-sharing across its 30,000-brand network. *Whitespace:* wide open — but see commercial risk below. This is the most differentiated *and* the most commercially fraught differentiator.

**(e) AI features (email-to-proposal parsing, semantic search, itinerary generation).**
Heavily covered and rapidly commoditizing: Tern (AI Assist, agentic import, email monitoring), TravelJoy (Magic Email, Magic Importer, Copilot), mTrip (AI Import Wizard on Vertex AI, Feb 2026), Polaris (Copilot PDF parsing + Chrome sidebar + one-sentence itinerary drafting), Travefy (Smart Import), Vamoos (TripImport), Safari Portal (Magic Import + AI Assistant), Axus (AwardWallet parsing). *Whitespace:* narrow. Semantic search across a **shared catalog** is the one AI angle uniquely enabled by Atlora's architecture that competitors structurally can't match. Everything else here is parity, not advantage.

## Table Stakes vs Optional

**Table stakes (Atlora must have to be credible):**
- Itinerary/proposal builder with reusable content and branded output
- CRM / lead management with client profiles and pipeline
- Integrated payments + invoicing + credit-card authorization (also the primary monetization lever)
- Commission tracking/reconciliation (especially for host/agency tiers)
- Document collection / forms / intake questionnaires
- Traveler-facing portal/app, branded to the agency
- AI email/PDF-to-proposal parsing and AI itinerary drafting (now expected, not novel)
- Automation/workflows (reminders, follow-ups, payment nudges)
- Group trip management (deposits, room blocks, per-traveler variations)

**Optional / segment-specific (defer or make add-ons):**
- GDS integration (Sabre/Amadeus/Travelport) — only matters for host/corporate/enterprise; most advisor tools skip it
- Multi-currency / multi-VAT / net-rate margin engines — DMC/tour-operator territory (Ezus, Tourwriter)
- ERP/back-office accounting (TravelOperations territory)
- Duty-of-care/risk management (corporate/TMC)
- Fully independent App Store app per agency (mTrip-style) — expensive; a branded PWA/portal covers most needs early

## Recommendations

**Stage 1 — Reach table-stakes parity before selling the vision (0–6 months).** Ship the itinerary builder, CRM, forms, payments (with card authorization), commission tracking, branded traveler portal, and AI email/PDF-to-proposal parsing. Without these, agencies won't switch regardless of the marketplace story. *Benchmark to change course:* if fewer than ~50% of pilot agencies can run their full front-office workflow in Atlora without a second tool, keep investing here before expanding the discovery layer.

**Stage 2 — Monetize via payments, not just seats.** Adopt WeTravel/TravelJoy's proven model: modest per-seat SaaS plus a payment-processing margin (target below TravelJoy's 3.5% to win price-sensitive advisors, at or near WeTravel's ~1%+$0.30 bank-transfer rate for ACH). Payment fees are roughly 86% of a working advisor's platform spend — this is where the durable revenue is. *Benchmark:* track attach rate of Atlora payments; if <30% of GMV flows through Atlora, the marketplace and catalog lose their data flywheel.

**Stage 3 — Lead with the shared catalog + semantic search as the wedge, soft-launch the marketplace.** The shared destination catalog inherited by all tenants (differentiator b) plus semantic search over it (e) is the lowest-risk, highest-moat combination — it delivers immediate value to each agency privately while quietly building the content graph the marketplace needs. Launch the cross-agency public discovery layer (d) as **opt-in** initially. *Benchmark:* if opt-in marketplace participation exceeds ~25% of active agencies within two quarters, accelerate; if agencies opt out citing client/brand protection, pivot the public layer toward lead-generation-that-routes-to-the-agency rather than open browsing.

**Stage 4 — Sell the full-stack white-label as brand control, not architecture.** Token-level theming and org-per-agency multi-tenancy (c) are invisible unless framed as "your brand, your domain, your app — end to end." Position against mTrip/Vamoos (traveler-app-only WL) and Travefy/TravelJoy (site-builder-only). *Benchmark:* win rate in deals where the agency cites "brand ownership" as a top-three criterion.

## Caveats
- **Marketplace conflicts with the target customer's core instinct.** Advisors and agencies are structurally protective of client relationships and brand identity; every successful incumbent reinforces the *individual* agency's brand. A cross-agency public discovery layer risks being perceived as Atlora disintermediating its own customers or exposing their clients to competitors. This is the single largest strategic risk in Atlora's model and should be validated with design partners before heavy investment.
- **AI parsing is not a differentiator.** Treat it as a checkbox; do not build positioning around it. The one AI angle worth marketing is semantic search over the shared catalog, which is architecture-enabled.
- **Payments monetization invites chargeback/dispute liability.** WeTravel's most severe user complaints are about chargeback handling and dispute support. If Atlora monetizes payments, it must staff dispute resolution well or inherit the same reputational damage.
- **Pricing benchmarks are moving and partly unverifiable.** mTrip, Axus, Wetu, PlanItEasy, TripSuite, TravelOperations and (partly) Vamoos use demo/volume/quote-based pricing; figures cited are the best public evidence as of 2026 and should be re-verified before use in competitive collateral.
- **Vendor metrics conflict.** Tern's own site claims 11,000+ advisors while press coverage reports "more than 5,000 advisors and 1,000 agencies"; founding year is variously reported as 2022 (Crunchbase) and 2023 (Tracxn/press). Where vendor and independent figures diverge, both are noted.
- **Some feature-matrix "partial" marks reflect add-ons or third-party dependencies** (e.g., Axus parsing via AwardWallet; Ezus payments; Safari Portal white-label add-on) rather than native, included capabilities.
- **Source-bias note:** several competitive feature comparisons in the wild originate from vendors' own marketing pages (notably mTrip's comparison pages, which understate rivals' AI). All AI-capability claims here were cross-checked against each vendor's own docs.