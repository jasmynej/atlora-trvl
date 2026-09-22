import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  transpilePackages: ['@atlora/ui'],
  // Self-contained server bundle with only the node_modules it actually
  // needs — what makes a reasonable image size possible in a monorepo
  // (Docker handoff, Milestone 6).
  output: 'standalone',
  // Standalone's file tracer walks up from this config file to find the
  // workspace root; without pointing it explicitly at the monorepo root,
  // it can trace from the wrong place and the copied bundle ends up
  // missing workspace dependencies (@atlora/ui, @atlora/trpc,
  // @atlora/types), failing at runtime with a module-not-found instead of
  // at build time.
  outputFileTracingRoot: path.join(__dirname, '../../'),
}

export default nextConfig
