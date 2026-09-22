import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // Served behind the Caddy proxy (docker/Caddyfile) at /admin/*, not at the
  // origin root. Without this, the dev server (and a production build)
  // still emit root-absolute asset URLs (/src/main.tsx, /assets/...), the
  // browser requests those from the site root instead of under /admin/*,
  // and Caddy's catch-all route sends them to apps/web instead — a 404 that
  // looks like a missing file, not a base-path mismatch. This also means
  // the dev server itself must be reached via .../admin/... — Caddy is
  // configured to pass the /admin prefix through rather than stripping it.
  base: '/admin/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    // Vite defaults to binding localhost only. The Caddy proxy (docker/)
    // reaches this dev server via host.docker.internal, which resolves to
    // the host's real network interface, not 127.0.0.1 — so without this,
    // every request through the proxy gets "connection refused".
    host: true,
    // Dev-only escape hatch for hitting this dev server directly
    // (http://localhost:3002/admin/...), bypassing Caddy entirely. The
    // app's tRPC clients use relative paths (/api/trpc) so the built
    // container works correctly behind the proxy — but that means direct
    // access has nothing to route /api/* anywhere, and every API call
    // (including login) 404s. This proxies it to the host's own apps/api
    // (pnpm dev, port 3001), which already points at the same
    // Docker-hosted db/MinIO everything else uses (apps/api/.env) — so
    // direct localhost access and the proxied path end up hitting the
    // same underlying data, just through a different api process.
    // Has zero effect on `vite build` — `server.*` only applies to the
    // dev server, never the production bundle the container ships.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      // The HMR client runs in the browser and infers its websocket target
      // from the page's own origin unless told otherwise. The browser only
      // ever sees atlora.localhost:443 (through Caddy), never the dev
      // server's real host:port, so the client needs those values spelled
      // out explicitly instead of guessing.
      host: 'atlora.localhost',
      protocol: 'wss',
      clientPort: 443,
    },
  },
  build: {
    rollupOptions: {
      // Second entry point for the platform-admin surface (§ Milestone 1 —
      // "ships as a second Vite entry point inside the existing apps/admin
      // project, not a new app and not a route inside the agency SPA").
      // Two inputs, two independent bundles: platform-admin code never
      // ships in the agency bundle, and vice versa.
      input: {
        main: resolve(__dirname, 'index.html'),
        platform: resolve(__dirname, 'platform.html'),
      },
    },
  },
})
