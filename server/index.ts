import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createApi } from './app.ts'

const port = Number(process.env.PORT ?? 5103)
const host = process.env.HOST ?? '0.0.0.0'
const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const app = express()
app.use('/api', createApi())

if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(join(distDir, 'index.html'))
  })
} else {
  console.warn('No dist/ folder found. Run "npm run build" first, or use "npm run dev".')
}

app.listen(port, host, () => {
  console.log(`Potluck listening on http://localhost:${port}`)
})
