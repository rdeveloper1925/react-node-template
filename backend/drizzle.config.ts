import { config } from 'dotenv'
import { resolve } from 'path'
import { defineConfig } from 'drizzle-kit'

// process.cwd() is always backend/ when npm scripts run, so .. = project root.
// __dirname is avoided here because drizzle-kit bundles this file internally
// and __dirname can be undefined or incorrect in that bundled context.
const root = resolve(process.cwd(), '..')
config({ path: resolve(root, '.env') })
config({ path: resolve(root, '.env.local'), override: true })

export default defineConfig({
  schema:  './src/db/schema.ts',
  out:     './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
