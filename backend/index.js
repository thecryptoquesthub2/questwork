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
    const { title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username } = req.body
    await sql`
      INSERT INTO gigs (title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username, is_active)
      VALUES (${title}, ${category}, ${description}, ${pay_usdt}, ${duration}, ${region}, ${poster_tg_id}, ${poster_username}, true)
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

// Save or update user
app.post('/api/users', async (req, res) => {
  try {
    const { tg_id, tg_username, first_name, last_name } = req.body
    await sql`
      INSERT INTO users (tg_id, tg_username, first_name, last_name)
      VALUES (${tg_id}, ${tg_username}, ${first_name}, ${last_name})
      ON CONFLICT (tg_id) DO UPDATE
      SET tg_username = ${tg_username},
          first_name = ${first_name},
          last_name = ${last_name}
    `
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user by tg_id
app.get('/api/users/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const user = await sql`SELECT * FROM users WHERE tg_id = ${tg_id}`
    res.json(user[0] || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Send Telegram notification
app.post('/api/notify', async (req, res) => {
  try {
    const { chat_id, message } = req.body
    const BOT_TOKEN = process.env.BOT_TOKEN
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat_id,
        text: message,
        parse_mode: 'HTML'
      })
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// AI Pitch Writer
app.post('/api/ai/pitch', async (req, res) => {
  try {
    const { gig_title, gig_company, user_skills, user_bio } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Write a professional and compelling job application pitch for this Web3 role. Job Title: ${gig_title}. Company: ${gig_company}. My Skills: ${user_skills || 'Web3, Community Management, BD'}. My Bio: ${user_bio || 'Experienced Web3 professional'}. Write a 3 paragraph pitch that is professional, specific, and compelling. Do not include subject lines or greetings. Just the pitch paragraphs. Do not use any markdown formatting, no asterisks, no hash symbols, no bold text. Plain text only with simple line breaks between paragraphs.`
        }]
      })
    })
    const data = await response.json()
    res.json({ pitch: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// AI Gig Description Writer
app.post('/api/ai/gig', async (req, res) => {
  try {
    const { basic_info } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Write a professional Web3 job description based on this basic info: ${basic_info}. Write a clear professional job description with a role overview of 2 to 3 sentences, then key responsibilities as a simple numbered list, then requirements as a simple numbered list. Keep it concise and Web3 focused. Do not use any markdown formatting, no asterisks, no hash symbols, no bold text. Plain text only with simple line breaks.`
        }]
      })
    })
    const data = await response.json()
    res.json({ description: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// Web3.career API sync
const fetchWeb3Jobs = async () => {
  try {
    const res = await fetch('https://web3.career/api/v1/jobs?token=WXFnYiuMV5ydYG9iHZegWy2pNVFduW2P')
    const data = await res.json()
    const jobs = data.jobs || []

    for (const job of jobs) {
      // Auto categorize
      const title = (job.title || '').toLowerCase()
      let category = 'Other'
      if (title.includes('community') || title.includes('discord') || title.includes('telegram')) category = 'Community Management'
      else if (title.includes('business') || title.includes('bd') || title.includes('partnership')) category = 'Business Development'
      else if (title.includes('dev') || title.includes('engineer') || title.includes('solidity') || title.includes('smart contract')) category = 'Dev'
      else if (title.includes('social') || title.includes('twitter') || title.includes('content') || title.includes('marketing')) category = 'Social'

      await pool.query(
        `INSERT INTO external_gigs (job_id, title, company, location, salary, apply_url, posted_at, category)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (job_id) DO NOTHING`,
        [String(job.id), job.title, job.company, job.location, job.salary, job.url, job.date, category]
      )
    }
    console.log('✅ Web3.career jobs synced')
  } catch (err) {
    console.error('❌ Sync failed:', err.message)
  }
}

// Run on startup and every hour
fetchWeb3Jobs()
setInterval(fetchWeb3Jobs, 60 * 60 * 1000)

// Endpoint to get external gigs
app.get('/api/external-gigs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM external_gigs ORDER BY posted_at DESC LIMIT 100'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`QuestWork API running on port ${PORT}`))