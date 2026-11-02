/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import express from 'express'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'
import { createApi } from './server/app.ts'

/** Serves the JSON API from the Vite dev server so dev runs on one port. */
function potluckApi(): Plugin {
  return {
    name: 'potluck-api',
    configureServer(server) {
      const app = express()
      app.use(createApi())
      server.middlewares.use('/api', app)
    },
  }
}

export default defineConfig({
  plugins: [vue(), potluckApi()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5103,
    strictPort: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
