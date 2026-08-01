import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Tokens/Spacing',
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

// ── Spacing scale ─────────────────────────────────────────────────────────────

export const SpacingScale: StoryObj = {
  name: 'Spacing Scale',
  render: () => (
    <Section title="Spacing (4px base grid)">
      <div className="flex flex-col gap-2">
        {[
          ['1', '0.25rem', '4px'],
          ['2', '0.5rem',  '8px'],
          ['3', '0.75rem', '12px'],
          ['4', '1rem',    '16px'],
          ['5', '1.5rem',  '24px'],
          ['6', '2rem',    '32px'],
          ['7', '3rem',    '48px'],
          ['8', '4rem',    '64px'],
          ['9', '6rem',    '96px'],
        ].map(([step, rem, px]) => (
          <div key={step} className="flex items-center gap-4">
            <span className="type-caption w-6 shrink-0 tabular-nums text-right">{step}</span>
            <div
              className="bg-teal-200 rounded-xs shrink-0"
              style={{ width: rem, height: '20px' }}
            />
            <span className="type-caption text-[var(--fg-muted)]">{rem} / {px}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
}

// ── Border radius ─────────────────────────────────────────────────────────────

export const BorderRadius: StoryObj = {
  name: 'Border Radius',
  render: () => (
    <Section title="Radii">
      <div className="flex flex-wrap gap-6">
        {[
          ['xs',   '4px',   'rounded-xs'],
          ['sm',   '8px',   'rounded-sm'],
          ['md',   '12px',  'rounded-md'],
          ['lg',   '18px',  'rounded-lg'],
          ['xl',   '28px',  'rounded-xl'],
          ['pill', '999px', 'rounded-pill'],
        ].map(([name, value, cls]) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div
              className={`w-20 h-20 bg-teal-100 border border-teal-300 ${cls}`}
            />
            <span className="type-label text-xs">{name}</span>
            <span className="type-caption">{value}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
}

// ── Shadows ───────────────────────────────────────────────────────────────────

export const Shadows: StoryObj = {
  name: 'Shadows',
  render: () => (
    <Section title="Shadow Scale (warm-tinted, charcoal-based)">
      <div className="flex flex-wrap gap-8">
        {[
          ['xs',   'shadow-xs',   'Hairline lift'],
          ['sm',   'shadow-sm',   'Subtle card'],
          ['md',   'shadow-md',   'Card default'],
          ['lg',   'shadow-lg',   'Card hover / raised'],
          ['xl',   'shadow-xl',   'Modals / overlays'],
          ['teal', 'shadow-teal', 'Primary action (teal-tinted)'],
        ].map(([name, cls, note]) => (
          <div key={name} className="flex flex-col items-center gap-3">
            <div
              className={`w-24 h-24 bg-white rounded-lg ${cls}`}
            />
            <span className="type-label text-xs">{name}</span>
            <span className="type-caption text-center max-w-[96px]">{note}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <span className="type-eyebrow text-[10px]">Focus ring</span>
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-10 bg-white rounded-sm"
            style={{ boxShadow: '0 0 0 3px rgba(0, 145, 171, 0.28)' }}
          />
          <span className="type-caption">ring — 3px teal at 28% opacity. Always visible, accessible.</span>
        </div>
      </div>
    </Section>
  ),
}

// ── Motion ────────────────────────────────────────────────────────────────────

export const Motion: StoryObj = {
  name: 'Motion',
  render: () => (
    <div className="flex flex-col gap-8">
      <Section title="Easing">
        <div className="flex flex-col gap-3">
          {[
            ['brand-out',  'cubic-bezier(0.22, 1, 0.36, 1)',  'ease-brand-out',  'Entrances — calm deceleration'],
            ['brand-soft', 'cubic-bezier(0.4, 0, 0.2, 1)',    'ease-brand-soft', 'State changes — smooth in/out'],
          ].map(([name, value, , note]) => (
            <div key={name} className="flex flex-col gap-1">
              <div className="flex gap-4 items-baseline">
                <span className="type-label text-xs w-28">{name}</span>
                <span className="type-caption text-[var(--fg-muted)]">{note}</span>
              </div>
              <span className="type-mono text-xs">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Duration">
        <div className="flex gap-8">
          {[
            ['fast', '120ms', 'Micro-interactions, icon swaps'],
            ['base', '220ms', 'Standard transitions, hover'],
            ['slow', '420ms', 'Entrances, page-level fades'],
          ].map(([name, value, note]) => (
            <div key={name} className="flex flex-col gap-1">
              <span className="type-label text-xs">{name}</span>
              <span className="font-sans text-lg font-medium text-[var(--fg1)]">{value}</span>
              <span className="type-caption max-w-[140px]">{note}</span>
            </div>
          ))}
        </div>
        <p className="type-body-sm text-[var(--fg-muted)] mt-2">
          Motion is calm — gentle fades and small rises. No bounces, no spring overshoot.
          Hover: surfaces lift (shadow + translateY -2px). Press: scale-down 0.98.
        </p>
      </Section>
    </div>
  ),
}
