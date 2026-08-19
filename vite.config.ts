import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // Local-only: proxy the AI endpoint to the dev-api shim during QA.
  // In production on Vercel, /api is served by the serverless function directly.
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
