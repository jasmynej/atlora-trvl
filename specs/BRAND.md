# Atlora — Brand Direction

> Replaces the "Brand Direction" section of `atlora_spec.md`. Read alongside `FEATURES.md`.

---

## Position

Atlora exists because planning travel well is a skill, and access to that skill is currently rationed by budget.

People who spend enough get an advisor. Everyone else gets a search box, twelve open tabs, and a booking site optimizing for its own margin. The expertise doesn't scale down, so the people who can least afford a bad decision get the least help making a good one.

Atlora is planning infrastructure that works at any budget and any level of involvement. Want an expert? Find one who fits what you're actually spending. Want to do it yourself? Take real tools, not a booking funnel. Want help on the parts that are hard and control over the rest? That should be normal.

**Atlora is not a luxury brand and not a budget brand.** It is range-agnostic by design. A $2,000 trip and a $30,000 trip are the same product problem: someone is trying to spend meaningful money on something they can't preview, and they'd like to get it right.

---

## What we're positioned against

**Online travel agencies.** Transactional, inventory-first, no expertise. They sell you a room; they don't help you decide whether it's the right one.

**Luxury advisor networks.** Real expertise, gatekept by spend. Fine for the people they serve — but their entire economic model assumes you're worth the commission, and most travelers aren't.

**Single-agency tools.** Every existing platform serves one agency's clients, post-booking. The traveler is a recipient of documents, not a user of anything.

---

## Personality

Atlora should feel:

- **Capable** — the tools are real and do actual work, not a lead-capture form with a nice photo
- **Warm** — travel is emotional; the product shouldn't pretend otherwise
- **Unpretentious** — no velvet rope, no implication that a cheaper trip is a lesser one
- **Honest** — clear about what things cost, how advisors get paid, and what the free tier does and doesn't include
- **Knowledgeable** — the catalog is authoritative because it's platform-owned and maintained, not scraped

Think:

> A friend who happens to be very good at this, and is glad to help however much you want

Not:

> A concierge for people who can afford a concierge

---

## Voice

Plain, specific, useful. Concrete over evocative — "three hours by train from Naples" beats "a sun-drenched escape." Sensory language belongs to advisors writing about places they know, not to the platform describing itself.

**Never:** "curated," "bespoke," "elevated," "unlock," "journey" as a synonym for trip, or any construction implying the reader is being granted access to something.

**Avoid budget-shaming in both directions.** No "affordable luxury," no "smart travelers know," no framing that treats one price range as the default and others as compromises or splurges.

---

## Visual identity

The existing palette stands. What changes is the rationale.

| | | |
|---|---|---|
| Teal | `#0091AB` | Primary. Confident without being corporate. |
| Soft Pink | `#F7AAC1` | Accent. Warmth, used sparingly. |
| Warm Gold | `#E7B06F` | Accent. Highlight and emphasis — not a luxury signifier. |
| Cream | `#FAF8F6` | Surface. Softens density; the alternative to clinical white. |
| Lavender | `#B9B1C9` | Secondary accent. |
| Charcoal | `#343432` | Text. Warmer than black. |

These are chosen for warmth and approachability, not to signal price tier. The palette should never be deployed in a way that reads as either premium or economy — no gold-on-black luxury cues, no discount-retail urgency.

**Two token themes** remain: `brand` for traveler-facing surfaces and `admin` for the agency dashboard. Per-trip agency branding scopes inside the Atlora shell rather than replacing it.

Imagery should show a range of destinations, price points, and travelers. A guesthouse and a resort both belong on the site.

---

## Guardrails

These follow from the position and should be treated as non-negotiable, the same way discovery ranking is.

**Never make the free tier feel like a demo.** Self-planning tools, the catalog, the profile vault, and the trip hub serve travelers whom advisors have no commercial reason to serve. That's not a funnel — it's the reason the platform exists. Paid tiers charge for AI features with real marginal cost, never for access to planning itself.

**Never rank by spend.** Discovery placement is not for sale, and it is not influenced by trip value. An advisor good at $3,000 trips ranks on being good at $3,000 trips.

**Treat budget-conscious expertise as expertise.** Doing Japan well on $3,000 is harder than doing it on $30,000. Discovery should surface that as a specialty, not as a lower rung.

**Be transparent about advisor cost.** Travelers who've never worked with an advisor mostly don't know how they're paid. Making that clear is a feature, and it's the one most consistent with the position.

**Be transparent about how Atlora gets paid.** The same promise, turned inward. If Workbench tools ever carry affiliate links, disclose it plainly at the point of the link — not buried in a footer policy page. Travelers assume affiliate revenue exists; disclosing it costs nothing and buys credibility that would otherwise be left on the table.

**Never let commission influence a result.** Affiliate payout rate must not enter any sort, rank, or default-selection path in Workbench, and no payout field belongs anywhere in the ranking code path. This is the discovery ranking policy applied to a surface where violations are harder to notice — nobody audits why a hotel came third. Structural, not configurable.

---

## What changed and why

The previous framing positioned Atlora as "modern, feminine, approachable luxury" and "boutique luxury travel advisor." That was written against the original single-sided white-label CMS model, where the customer was an agency and the brand was a skin.

It no longer fits. Half the epics in `FEATURES.md` serve travelers who will never hire an advisor, and a luxury position makes those features look like a downmarket afterthought rather than the point. The feminine framing narrowed the audience without a strategic reason to.

The palette survived the rewrite unchanged — it never read as luxury-coded or gendered. Only the copy around it did.
