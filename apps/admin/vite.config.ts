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
      // Two separate bundles, one per surface. Vite's default single-entry
      // build only picks up index.html — platform.html has to be declared
      // explicitly or it silently isn't built at all.
      input: {
        agency: resolve(__dirname, 'index.html'),
        platform: resolve(__dirname, 'platform.html'),
      },
    },
  },
})
