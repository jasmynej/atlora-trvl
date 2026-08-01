import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Tokens/Colors',
  parameters: { layout: 'padded' },
}
export default meta

// ── helpers ──────────────────────────────────────────────────────────────────

function Swatch({ hex, name, label }: { hex: string; name: string; label?: string }) {
  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <div
        className="h-14 w-full rounded-md border border-sand-300"
        style={{ backgroundColor: hex }}
      />
      <span className="type-label text-xs">{name}</span>
      <span className="type-caption">{label ?? hex}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="type-eyebrow">{title}</h3>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  )
}

// ── stories ──────────────────────────────────────────────────────────────────

export const BrandPrimitives: StoryObj = {
  render: () => (
    <Section title="Brand Primitives">
      <Swatch hex="#0091AB" name="Teal"     label="Primary action, links" />
      <Swatch hex="#FAF8F6" name="Cream"    label="Default canvas" />
      <Swatch hex="#343432" name="Charcoal" label="Primary ink" />
      <Swatch hex="#F7AAC1" name="Pink"     label="Warm accent" />
      <Swatch hex="#E7B06F" name="Gold"     label="Premium cues" />
      <Swatch hex="#B9B1C9" name="Lavender" label="Muted accent" />
    </Section>
  ),
}

// @ts-ignore
// @ts-ignore
export const TealScale: StoryObj = {
  render: () => (
    <Section title="Teal Scale">
      {[
        ['50',  '#E6F4F7'],
        ['100', '#C2E5EC'],
        ['200', '#8DD0DC'],
        ['300', '#4FB6C8'],
        ['400', '#1F9FB8'],
        ['500', '#0091AB'],
        ['600', '#007C93'],
        ['700', '#006375'],
        ['800', '#054C5A'],
        ['900', '#0A3A44'],
      ].map(([step, hex]) => (
        <Swatch key={step} hex={hex ? hex : ""} name={`teal-${step}`} />
      ))}
    </Section>
  ),
}

export const SandScale: StoryObj = {
  render: () => (
    <Section title="Sand (Warm Neutrals)">
      {[
        ['50',  '#FFFFFF'],
        ['100', '#FAF8F6'],
        ['150', '#F4F0EB'],
        ['200', '#EDE7DF'],
        ['300', '#E0D8CD'],
        ['400', '#C9BFB2'],
        ['500', '#A89E90'],
        ['600', '#7C7468'],
        ['700', '#57524B'],
        ['800', '#3D3A35'],
        ['900', '#343432'],
      ].map(([step, hex]) => (
        <Swatch key={step} hex={hex ? hex : ""} name={`sand-${step}`} />
      ))}
    </Section>
  ),
}

export const AccentTints: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Section title="Pink">
        <Swatch hex="#FDEDF2" name="pink-100" />
        <Swatch hex="#FBD3DF" name="pink-200" />
        <Swatch hex="#F7AAC1" name="pink-500" />
        <Swatch hex="#D97A99" name="pink-700" />
      </Section>
      <Section title="Gold">
        <Swatch hex="#FBF1E3" name="gold-100" />
        <Swatch hex="#F4DDBE" name="gold-200" />
        <Swatch hex="#E7B06F" name="gold-500" />
        <Swatch hex="#C68B43" name="gold-700" />
      </Section>
      <Section title="Lavender">
        <Swatch hex="#F1EFF5" name="lavender-100" />
        <Swatch hex="#DEDAE7" name="lavender-200" />
        <Swatch hex="#B9B1C9" name="lavender-500" />
        <Swatch hex="#8C829F" name="lavender-700" />
      </Section>
    </div>
  ),
}

export const SemanticRoles: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Section title="Surfaces">
        <Swatch hex="#FAF8F6" name="bg"           label="Default canvas" />
        <Swatch hex="#FFFFFF" name="bg-raised"    label="Elevated surface" />
        <Swatch hex="#F4F0EB" name="bg-sunken"    label="Recessed / hover wash" />
        <Swatch hex="#FFFFFF" name="surface"      label="Card background" />
        <Swatch hex="#F4F0EB" name="surface-muted" label="Muted surface" />
      </Section>
      <Section title="Foreground">
        <Swatch hex="#343432" name="fg1"       label="Primary text" />
        <Swatch hex="#57524B" name="fg2"       label="Secondary text" />
        <Swatch hex="#7C7468" name="fg3"       label="Captions" />
        <Swatch hex="#A89E90" name="fg-muted"  label="Placeholder / disabled" />
        <Swatch hex="#FFFFFF" name="fg-on-teal" label="Text on teal" />
      </Section>
      <Section title="Interactive">
        <Swatch hex="#0091AB" name="accent"       label="Default" />
        <Swatch hex="#007C93" name="accent-hover" label="Hover" />
        <Swatch hex="#006375" name="accent-press" label="Press" />
        <Swatch hex="#E6F4F7" name="accent-soft"  label="Wash / tinted bg" />
      </Section>
      <Section title="Status">
        <Swatch hex="#2F8F6B" name="success"      />
        <Swatch hex="#E2F1EA" name="success-soft" />
        <Swatch hex="#C68B43" name="warning"      />
        <Swatch hex="#FBF1E3" name="warning-soft" />
        <Swatch hex="#C8553D" name="danger"       />
        <Swatch hex="#F8E5DF" name="danger-soft"  />
        <Swatch hex="#007C93" name="info"         />
        <Swatch hex="#E6F4F7" name="info-soft"    />
      </Section>
    </div>
  ),
}
