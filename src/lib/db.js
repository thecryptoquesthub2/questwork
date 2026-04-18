import { neon } from '@neondatabase/serverless'

let sql

try {
  sql = neon(import.meta.env.VITE_DATABASE_URL)
} catch (e) {
  console.error('DB connection failed:', e)
}

export default sql