import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
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
