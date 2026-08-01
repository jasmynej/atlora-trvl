import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Tokens/Typography',
  parameters: { layout: 'padded' },
}
export default meta

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 border-b border-sand-200 pb-8 last:border-0">
      <span className="type-eyebrow">{title}</span>
      {children}
    </div>
  )
}

// ── Type scale ───────────────────────────────────────────────────────────────

export const TypeScale: StoryObj = {
  name: 'Type Scale',
  render: () => (
    <div className="flex flex-col gap-8">
      <Section title="Serif Display">
        {[
          ['5xl', '5.5rem / 88px', 'font-serif text-5xl font-medium tracking-tight'],
          ['4xl', '4rem / 64px',   'font-serif text-4xl font-medium tracking-tight'],
          ['3xl', '3rem / 48px',   'font-serif text-3xl font-medium tracking-tight'],
          ['2xl', '2.25rem / 36px','font-serif text-2xl font-medium'],
          ['xl',  '1.75rem / 28px','font-serif text-xl  font-semibold'],
        ].map(([step, size, classes]) => (
          <div key={step} className="flex items-baseline gap-6">
            <span className="type-caption w-12 shrink-0 tabular-nums">{step}</span>
            <span className={classes} style={{ lineHeight: 1.08 }}>
              Find the trip you didn&apos;t know you were looking for.
            </span>
            <span className="type-caption ml-auto shrink-0">{size}</span>
          </div>
        ))}
      </Section>

      <Section title="Sans Body & UI">
        {[
          ['lg',   '1.375rem / 22px', 'font-sans text-lg'],
          ['md',   '1.125rem / 18px', 'font-sans text-md'],
          ['base', '1rem / 16px',     'font-sans text-base'],
          ['sm',   '0.875rem / 14px', 'font-sans text-sm'],
          ['xs',   '0.75rem / 12px',  'font-sans text-xs'],
        ].map(([step, size, classes]) => (
          <div key={step} className="flex items-baseline gap-6">
            <span className="type-caption w-12 shrink-0 tabular-nums">{step}</span>
            <span className={`${classes} text-[var(--fg1)]`}>
              Slow mornings in the Douro Valley — 7 nights · 4 destinations · from $3,200
            </span>
            <span className="type-caption ml-auto shrink-0">{size}</span>
          </div>
        ))}
      </Section>
    </div>
  ),
}

// ── Semantic type classes ─────────────────────────────────────────────────────

export const SemanticStyles: StoryObj = {
  name: 'Semantic Styles',
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <Section title="Headings (Bodoni Moda Serif)">
        <div className="type-display">Display — Find the trip you didn&apos;t know you were looking for.</div>
        <div className="type-h1">H1 — Curated escapes, thoughtfully built.</div>
        <div className="type-h2">H2 — Destinations worth the journey.</div>
        <div className="type-h3">H3 — Atlora Console overview</div>
      </Section>

      <Section title="Eyebrow (Raleway spaced uppercase)">
        <div className="type-eyebrow">Curated Itineraries</div>
        <div className="type-eyebrow">Portugal · 5 Nights</div>
        <div className="type-eyebrow">Plan. Explore. Belong.</div>
      </Section>

      <Section title="Body & UI (Raleway)">
        <div className="type-subtitle">
          Subtitle — A knowledgeable, well-traveled friend. Warm, calm, and quietly confident.
        </div>
        <div className="type-body">
          Body — No trips yet. Create your first itinerary to get started. Speak to the reader as
          "you." Atlora refers to itself as "we" in marketing.
        </div>
        <div className="type-body-sm">
          Body SM — 7 nights · 4 destinations · from $3,200. Middots separate facts, no hype words.
        </div>
        <div className="type-caption">Caption — Last updated 3 days ago</div>
        <div className="type-label">Label — Trip title</div>
        <div className="type-mono">mono — agencyId: cuid_01JXKQ8F...</div>
      </Section>

      <Section title="Decorative Serif Italic">
        <div className="type-quote">
          &ldquo;Slow mornings in the Douro Valley.&rdquo;
        </div>
      </Section>
    </div>
  ),
}

// ── Letter spacing ────────────────────────────────────────────────────────────

export const LetterSpacing: StoryObj = {
  name: 'Letter Spacing',
  render: () => (
    <Section title="Tracking Scale">
      {[
        ['tight',  '-0.01em', 'tracking-tight',  'Bodoni headlines — tight feels refined'],
        ['normal', '0',       'tracking-normal',  'Body copy default'],
        ['wide',   '0.08em',  'tracking-wide',    'Moderate labels, UI text'],
        ['wider',  '0.18em',  'tracking-wider',   'EYEBROW / TAGLINE — brand signature'],
      ].map(([name, value, cls, note]) => (
        <div key={name} className="flex items-baseline gap-6">
          <span className="type-caption w-16 shrink-0">{name}</span>
          <span className={`font-sans text-base uppercase ${cls} text-[var(--fg1)]`}>
            Atlora Travel
          </span>
          <span className="type-caption text-[var(--fg-muted)]">{value} — {note}</span>
        </div>
      ))}
    </Section>
  ),
}

// ── Font families specimen ────────────────────────────────────────────────────

export const FontFamilies: StoryObj = {
  name: 'Font Families',
  render: () => (
    <div className="flex flex-col gap-8">
      <Section title="Bodoni Moda — Serif Display">
        <p className="font-serif text-3xl font-medium tracking-tight text-[var(--fg1)]">
          Find the trip you didn&apos;t know<br />you were looking for.
        </p>
        <p className="font-serif text-2xl italic text-[var(--fg2)]">
          &ldquo;Slow mornings in the Douro Valley&rdquo;
        </p>
        <p className="type-caption">
          Bodoni Moda variable (wght 400–900). Serif for expression — headings, display, pull-quotes.
          Never body copy.
        </p>
      </Section>

      <Section title="Raleway — Geometric Sans">
        <p className="font-sans text-base leading-relaxed text-[var(--fg1)]">
          A knowledgeable, well-traveled friend — warm, calm, and quietly confident.
          Never breathless or salesy. The tagline{' '}
          <strong className="font-semibold">PLAN. EXPLORE. BELONG.</strong> sets the emotional arc.
        </p>
        <p className="font-sans text-xs font-semibold tracking-wider uppercase text-[var(--teal-600)]">
          Curated Itineraries · Portugal · 5 Nights
        </p>
        <p className="type-caption">
          Raleway variable (wght 100–900). Sans for all information, UI, and labels.
          Wide-tracked uppercase is the brand&apos;s signature eyebrow style.
        </p>
      </Section>
    </div>
  ),
}
