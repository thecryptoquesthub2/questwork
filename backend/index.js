import express from 'express'
import cors from 'cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const sql = neon(process.env.DATABASE_URL)

// Get all gigs
app.get('/api/gigs', async (req, res) => {
  try {
    const gigs = await sql`SELECT * FROM gigs WHERE is_active = true ORDER BY created_at DESC`
    res.json(gigs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Post a gig
app.post('/api/gigs', async (req, res) => {
  try {
    const { title, category, description, pay_usdt, duration, region } = req.body
    await sql`
      INSERT INTO gigs (title, category, description, pay_usdt, duration, region, is_active)
      VALUES (${title}, ${category}, ${description}, ${pay_usdt}, ${duration}, ${region}, true)
    `
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Post an application
app.post('/api/applications', async (req, res) => {
  try {
    const { gig_id, applicant_tg_id, applicant_username, pitch } = req.body
    await sql`
      INSERT INTO applications (gig_id, applicant_tg_id, applicant_username, pitch, status)
      VALUES (${gig_id}, ${applicant_tg_id}, ${applicant_username}, ${pitch}, 'pending')
    `
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`QuestWork API running on port ${PORT}`))