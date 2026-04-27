import express from 'express'
import cors from 'cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import braintree from 'braintree'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const sql = neon(process.env.DATABASE_URL)

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
})

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

// Search users — must be before /api/users/:tg_id
app.get('/api/users/search', async (req, res) => {
  try {
    const { q } = req.query
    const users = await sql`
      SELECT * FROM users
      WHERE first_name ILIKE ${'%' + q + '%'}
      OR tg_username ILIKE ${'%' + q + '%'}
      LIMIT 20
    `
    res.json(users || [])
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
      body: JSON.stringify({ chat_id, text: message, parse_mode: 'HTML' })
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
          content: `Write a professional and compelling job application pitch for this Web3 role. Job Title: ${gig_title}. Company: ${gig_company}. My Skills: ${user_skills || 'Web3, Community Management, BD'}. My Bio: ${user_bio || 'Experienced Web3 professional'}. Write a 3 paragraph pitch that is professional, specific, and compelling. Do not include subject lines or greetings. Just the pitch paragraphs. Plain text only with simple line breaks between paragraphs.`
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
          content: `Write a professional Web3 job description based on this basic info: ${basic_info}. Write a clear professional job description with a role overview of 2 to 3 sentences, then key responsibilities as a simple numbered list, then requirements as a simple numbered list. Keep it concise and Web3 focused. Plain text only with simple line breaks.`
        }]
      })
    })
    const data = await response.json()
    res.json({ description: data.content[0].text })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get applications received by a gig poster
app.get('/api/applications/received/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const applications = await sql`
      SELECT
        a.id, a.applicant_tg_id, a.applicant_username,
        a.pitch, a.status, a.created_at,
        g.title as gig_title
      FROM applications a
      JOIN gigs g ON a.gig_id = g.id
      WHERE g.poster_tg_id = ${tg_id}
      ORDER BY a.created_at DESC
    `
    res.json(applications)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Web3.career API sync
const fetchWeb3Jobs = async () => {
  try {
    const res = await fetch('https://web3.career/api/v1/jobs?token=WXFnYiuMV5ydYG9iHZegWy2pNVFduW2P', {
      headers: { 'Accept': 'application/json' }
    })
    const data = await res.json()
    const jobs = data.jobs || data || []
    for (const job of jobs) {
      const title = (job.title || '').toLowerCase()
      let category = 'Other'
      if (title.includes('community') || title.includes('discord') || title.includes('telegram')) category = 'Community Management'
      else if (title.includes('business') || title.includes('bd') || title.includes('partnership')) category = 'Business Development'
      else if (title.includes('dev') || title.includes('engineer') || title.includes('solidity')) category = 'Dev'
      else if (title.includes('social') || title.includes('twitter') || title.includes('content') || title.includes('marketing')) category = 'Social'
      await sql`
        INSERT INTO external_gigs (job_id, title, company, location, salary, apply_url, posted_at, category)
        VALUES (${String(job.id)}, ${job.title}, ${job.company}, ${job.location}, ${job.salary}, ${job.url}, ${job.date}, ${category})
        ON CONFLICT (job_id) DO NOTHING
      `
    }
    console.log('✅ Web3.career jobs synced')
  } catch (err) {
    console.error('❌ Sync failed:', err.message)
  }
}

fetchWeb3Jobs()
setInterval(fetchWeb3Jobs, 60 * 60 * 1000)

// Get external gigs
app.get('/api/external-gigs', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM external_gigs ORDER BY posted_at DESC LIMIT 100`
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Braintree: Get client token
app.get('/api/braintree/token', async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({})
    res.json({ token: response.clientToken })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Braintree: Create subscription
app.post('/api/braintree/subscribe', async (req, res) => {
  try {
    const { paymentMethodNonce, tg_id } = req.body
    const result = await gateway.customer.create({ paymentMethodNonce })
    if (!result.success) return res.status(400).json({ error: result.message })
    const paymentMethodToken = result.customer.paymentMethods[0].token
    const subscription = await gateway.subscription.create({
      paymentMethodToken,
      planId: process.env.BRAINTREE_PLAN_ID,
    })
    if (!subscription.success) return res.status(400).json({ error: subscription.message })
    await sql`UPDATE users SET is_premium = true, subscription_id = ${subscription.subscription.id} WHERE tg_id = ${tg_id}`
    res.json({ success: true, subscriptionId: subscription.subscription.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Braintree: Cancel subscription
app.post('/api/braintree/cancel', async (req, res) => {
  try {
    const { tg_id } = req.body
    const user = await sql`SELECT subscription_id FROM users WHERE tg_id = ${tg_id}`
    if (user[0]?.subscription_id) {
      await gateway.subscription.cancel(user[0].subscription_id)
      await sql`UPDATE users SET is_premium = false, subscription_id = null WHERE tg_id = ${tg_id}`
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: Manual premium upgrade
app.post('/api/admin/premium', async (req, res) => {
  try {
    const { tg_id, is_premium } = req.body
    await sql`UPDATE users SET is_premium = ${is_premium} WHERE tg_id = ${tg_id}`
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// Telegram Bot - Admin Commands
import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

bot.onText(/\/upgrade (.+)/, async (msg, match) => {
  const adminId = String(msg.from.id)
  if (adminId !== process.env.ADMIN_TG_ID) {
    bot.sendMessage(msg.chat.id, '❌ You are not authorized.')
    return
  }
  const username = match[1].trim().replace('@', '')
  try {
    const user = await sql`SELECT * FROM users WHERE tg_username = ${username}`
    if (!user[0]) {
      bot.sendMessage(msg.chat.id, `❌ User @${username} not found. They must have opened the app first.`)
      return
    }
    await sql`UPDATE users SET is_premium = true WHERE tg_username = ${username}`
    bot.sendMessage(msg.chat.id, `✅ @${username} upgraded to Premium!`)
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

bot.onText(/\/downgrade (.+)/, async (msg, match) => {
  const adminId = String(msg.from.id)
  if (adminId !== process.env.ADMIN_TG_ID) {
    bot.sendMessage(msg.chat.id, '❌ You are not authorized.')
    return
  }
  const username = match[1].trim().replace('@', '')
  try {
    await sql`UPDATE users SET is_premium = false WHERE tg_username = ${username}`
    bot.sendMessage(msg.chat.id, `✅ @${username} downgraded.`)
  } catch (err) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`QuestWork API running on port ${PORT}`))