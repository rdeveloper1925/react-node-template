import { config } from 'dotenv'
import { resolve } from 'path'

// Resolve env files relative to this file (backend/src/), not process.cwd(),
// so paths are correct regardless of which directory you run the server from.
// __dirname → backend/src  →  ../../ → project root
const root = resolve(__dirname, '../..')
config({ path: resolve(root, '.env') })
config({ path: resolve(root, '.env.local'), override: true })

import express, { Request, Response } from 'express'
import { db } from './db'
import { users } from './db/schema';
import { sql } from 'drizzle-orm';

const app = express()
const PORT = Number(process.env.BACKEND_PORT) || 3000

app.use(express.json())

// GET /health — liveness probe
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /hello — simple greeting
app.get('/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend epp API!' })
})

// GET /db-check — verifies MySQL connectivity via Drizzle
app.get('/db-check', async (_req: Request, res: Response) => {
  try {
    //const result = await db.select().from(users).limit(1);
    const query = sql`SELECT 'Firing on all cylinders' AS STATUS`;
    const result = await db.execute(query);
    const rows = result as unknown as Array<{ STATUS: string }[]>;
    res.json({ connected: true, result: rows[0][0].STATUS })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ connected: false, error: message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`)
})
