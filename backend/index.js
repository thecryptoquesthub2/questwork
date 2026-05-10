import express from 'express'
import cors from 'cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import braintree from 'braintree'
import TelegramBot from 'node-telegram-bot-api'

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

// ─────────────────────────────────────────
// RUN THESE SQL STATEMENTS IN NEON CONSOLE
// to add new columns/tables before deploying
//
// ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
// ALTER TABLE messages ADD COLUMN IF NOT EXISTS blocked_reason TEXT;
// ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_url TEXT;
// ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_name TEXT;
// ALTER TABLE messages ADD COLUMN IF NOT EXISTS msg_type TEXT DEFAULT 'text';
// ALTER TABLE users ADD COLUMN IF NOT EXISTS quest_score INTEGER DEFAULT 0;
// ALTER TABLE users ADD COLUMN IF NOT EXISTS jobs_completed INTEGER DEFAULT 0;
// ALTER TABLE users ADD COLUMN IF NOT EXISTS wallet_address TEXT;
//
// CREATE TABLE IF NOT EXISTS escrow_contracts (
//   id SERIAL PRIMARY KEY,
//   gig_id TEXT,
//   client_tg_id TEXT,
//   freelancer_tg_id TEXT,
//   contract_address TEXT NOT NULL,
//   amount_ton TEXT NOT NULL,
//   amount_usdt TEXT,
//   status TEXT DEFAULT 'funded',
//   tx_hash TEXT,
//   release_tx TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   released_at TIMESTAMPTZ
// );
//
// CREATE TABLE IF NOT EXISTS work_submissions (
//   id SERIAL PRIMARY KEY,
//   gig_id TEXT,
//   client_tg_id TEXT,
//   freelancer_tg_id TEXT,
//   note TEXT,
//   file_url TEXT,
//   link_url TEXT,
//   status TEXT DEFAULT 'pending',
//   submitted_at TIMESTAMPTZ DEFAULT NOW(),
//   reviewed_at TIMESTAMPTZ
// );
// ─────────────────────────────────────────


// ─────────────────────────────────────────
// CONTACT INFO DETECTION
// ─────────────────────────────────────────
const CONTACT_PATTERNS = [
  { pattern: /(\+?\d[\d\s\-().]{7,}\d)/g,                          reason: 'phone number' },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,  reason: 'email address' },
  { pattern: /(?<![a-zA-Z])@[a-zA-Z0-9_]{3,}/g,                   reason: 'social handle' },
  { pattern: /whatsapp[\s:.\-]*[\d\s+()]{7,}/gi,                   reason: 'WhatsApp number' },
  { pattern: /instagram\.com\/[a-zA-Z0-9_.]+/gi,                   reason: 'Instagram profile' },
  { pattern: /\bIG[\s:]+@?[a-zA-Z0-9_.]{3,}/gi,                   reason: 'Instagram handle' },
  { pattern: /twitter\.com\/[a-zA-Z0-9_]+/gi,                      reason: 'Twitter profile' },
  { pattern: /x\.com\/[a-zA-Z0-9_]+/gi,                            reason: 'X profile' },
  { pattern: /linkedin\.com\/in\/[a-zA-Z0-9_\-]+/gi,              reason: 'LinkedIn profile' },
  { pattern: /discord[\s:.]*[a-zA-Z0-9_#]{3,}/gi,                  reason: 'Discord handle' },
  { pattern: /t\.me\/[a-zA-Z0-9_]+/gi,                             reason: 'Telegram link' },
  { pattern: /\b(wa\.me|api\.whatsapp)\//gi,                       reason: 'WhatsApp link' },
]

function detectContactInfo(text) {
  if (!text || typeof text !== 'string') return { blocked: false }
  for (const { pattern, reason } of CONTACT_PATTERNS) {
    pattern.lastIndex = 0
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason: `Message blocked — contains ${reason}. Keep all communication on QuestWork to stay protected.`,
      }
    }
  }
  return { blocked: false }
}


// ─────────────────────────────────────────
// QUESTSCORE RECALCULATION
// ─────────────────────────────────────────
async function recalcQuestScore(tg_id) {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM work_submissions
      WHERE freelancer_tg_id = ${String(tg_id)} AND status = 'approved'
    `
    const completed = parseInt(result[0]?.count || 0, 10)
    const user = await sql`SELECT is_premium FROM users WHERE tg_id = ${String(tg_id)}`
    const premiumBonus = user[0]?.is_premium ? 5 : 0
    const score = Math.min(20 + completed * 12 + premiumBonus, 100)
    await sql`
      UPDATE users SET quest_score = ${score}, jobs_completed = ${completed}
      WHERE tg_id = ${String(tg_id)}
    `
    return score
  } catch (err) {
    console.error('QuestScore recalc error:', err.message)
    return 0
  }
}


// ─────────────────────────────────────────
// GIGS
// ─────────────────────────────────────────

app.get('/api/gigs', async (req, res) => {
  try {
    const gigs = await sql`SELECT * FROM gigs WHERE is_active = true ORDER BY created_at DESC`
    res.json(gigs)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/gigs', async (req, res) => {
  try {
    const { title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username } = req.body
    await sql`
      INSERT INTO gigs (title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username, is_active)
      VALUES (${title}, ${category}, ${description}, ${pay_usdt}, ${duration}, ${region}, ${poster_tg_id}, ${poster_username}, true)
    `
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────

app.post('/api/applications', async (req, res) => {
  try {
    const { gig_id, applicant_tg_id, applicant_username, pitch } = req.body
    await sql`
      INSERT INTO applications (gig_id, applicant_tg_id, applicant_username, pitch, status)
      VALUES (${gig_id}, ${applicant_tg_id}, ${applicant_username}, ${pitch}, 'pending')
    `
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/applications/received/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const applications = await sql`
      SELECT a.id, a.applicant_tg_id, a.applicant_username,
             a.pitch, a.status, a.created_at, g.title as gig_title
      FROM applications a
      JOIN gigs g ON a.gig_id = g.id
      WHERE g.poster_tg_id = ${tg_id}
      ORDER BY a.created_at DESC
    `
    res.json(applications)
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// USERS — search/photo MUST be before /:tg_id
// ─────────────────────────────────────────

app.post('/api/users', async (req, res) => {
  try {
    const { tg_id, tg_username, first_name, last_name } = req.body
    await sql`
      INSERT INTO users (tg_id, tg_username, first_name, last_name)
      VALUES (${tg_id}, ${tg_username}, ${first_name}, ${last_name})
      ON CONFLICT (tg_id) DO UPDATE
      SET tg_username = ${tg_username}, first_name = ${first_name}, last_name = ${last_name}
    `
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/users/search', async (req, res) => {
  try {
    const { q } = req.query
    const users = await sql`
      SELECT * FROM users
      WHERE first_name ILIKE ${'%' + q + '%'} OR tg_username ILIKE ${'%' + q + '%'}
      LIMIT 20
    `
    res.json(users || [])
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/users/photo/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const BOT_TOKEN = process.env.BOT_TOKEN
    const profileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${tg_id}&limit=1`)
    const profileData = await profileRes.json()
    const fileId = profileData?.result?.photos?.[0]?.[0]?.file_id
    if (!fileId) return res.json({ photo_url: null })
    const fileRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`)
    const fileData = await fileRes.json()
    const filePath = fileData?.result?.file_path
    if (!filePath) return res.json({ photo_url: null })
    res.json({ photo_url: `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}` })
  } catch (err) { res.json({ photo_url: null }) }
})

app.get('/api/users/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const user = await sql`SELECT * FROM users WHERE tg_id = ${String(tg_id)}`
    res.json(user[0] || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/users/backup-login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/users/:tg_id/backup-login', async (req, res) => {
  try {
    const { tg_id } = req.params
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
    const { createHash } = await import('crypto')
    const hashed = createHash('sha256')
      .update(password + (process.env.PASSWORD_SALT || 'questwork_salt_2024'))
      .digest('hex')
    await sql`
      UPDATE users SET backup_email = ${email.toLowerCase().trim()}, backup_password = ${hashed}
      WHERE tg_id = ${String(tg_id)}
    `
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/users/:tg_id/wallet', async (req, res) => {
  try {
    const { tg_id } = req.params
    const { wallet_address } = req.body
    await sql`UPDATE users SET wallet_address = ${wallet_address} WHERE tg_id = ${String(tg_id)}`
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// MESSAGES — with contact detection
// ─────────────────────────────────────────

app.post('/api/messages', async (req, res) => {
  try {
    const { sender_tg_id, receiver_tg_id, content, msg_type, file_url, file_name } = req.body
    if (!sender_tg_id || !receiver_tg_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Contact detection — skip for file messages
    if (msg_type !== 'file' && content) {
      const check = detectContactInfo(content)
      if (check.blocked) {
        return res.status(200).json({ success: false, blocked: true, reason: check.reason })
      }
    }

    const type = msg_type || 'text'
    await sql`
      INSERT INTO messages (sender_tg_id, receiver_tg_id, content, msg_type, file_url, file_name, is_read, created_at)
      VALUES (${String(sender_tg_id)}, ${String(receiver_tg_id)}, ${content || ''}, ${type}, ${file_url || null}, ${file_name || null}, false, NOW())
    `
    res.json({ success: true, blocked: false })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// MUST be before /:tg_id_1/:tg_id_2
app.get('/api/messages/unread/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const result = await sql`
      SELECT COUNT(*) as count FROM messages
      WHERE receiver_tg_id = ${String(tg_id)} AND is_read = false
    `
    res.json({ count: parseInt(result[0]?.count || 0) })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/messages/threads/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const threads = await sql`
      SELECT
        sub.other_tg_id,
        MAX(u.first_name) as other_name,
        MAX(u.tg_username) as other_username,
        MAX(sub.last_message) as last_message,
        MAX(sub.last_time) as last_time,
        SUM(sub.unread) as unread_count
      FROM (
        SELECT
          CASE WHEN sender_tg_id = ${String(tg_id)} THEN receiver_tg_id ELSE sender_tg_id END as other_tg_id,
          content as last_message,
          created_at as last_time,
          CASE WHEN receiver_tg_id = ${String(tg_id)} AND is_read = false THEN 1 ELSE 0 END as unread
        FROM messages
        WHERE sender_tg_id = ${String(tg_id)} OR receiver_tg_id = ${String(tg_id)}
      ) sub
      LEFT JOIN users u ON u.tg_id = sub.other_tg_id
      GROUP BY sub.other_tg_id
      ORDER BY MAX(sub.last_time) DESC
    `
    res.json(threads)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/messages/:tg_id_1/:tg_id_2', async (req, res) => {
  try {
    const { tg_id_1, tg_id_2 } = req.params
    const msgs = await sql`
      SELECT * FROM messages
      WHERE (sender_tg_id = ${String(tg_id_1)} AND receiver_tg_id = ${String(tg_id_2)})
         OR (sender_tg_id = ${String(tg_id_2)} AND receiver_tg_id = ${String(tg_id_1)})
      ORDER BY created_at ASC LIMIT 200
    `
    await sql`
      UPDATE messages SET is_read = true
      WHERE receiver_tg_id = ${String(tg_id_1)} AND sender_tg_id = ${String(tg_id_2)} AND is_read = false
    `
    res.json(msgs)
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// ESCROW CONTRACTS (TON blockchain)
// ─────────────────────────────────────────

app.post('/api/escrow', async (req, res) => {
  try {
    const { gig_id, client_tg_id, freelancer_tg_id, contract_address, amount_ton, amount_usdt, tx_hash } = req.body
    const existing = await sql`
      SELECT id FROM escrow_contracts WHERE gig_id = ${String(gig_id)} AND status = 'funded'
    `
    if (existing.length > 0) {
      await sql`
        UPDATE escrow_contracts SET tx_hash = ${tx_hash}, amount_ton = ${String(amount_ton)}, amount_usdt = ${String(amount_usdt || '')}
        WHERE gig_id = ${String(gig_id)} AND status = 'funded'
      `
      return res.json({ success: true, updated: true })
    }
    await sql`
      INSERT INTO escrow_contracts (gig_id, client_tg_id, freelancer_tg_id, contract_address, amount_ton, amount_usdt, tx_hash, status)
      VALUES (${String(gig_id)}, ${String(client_tg_id)}, ${String(freelancer_tg_id)}, ${contract_address}, ${String(amount_ton)}, ${String(amount_usdt || '')}, ${tx_hash || ''}, 'funded')
    `
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/escrow/:gig_id', async (req, res) => {
  try {
    const { gig_id } = req.params
    const result = await sql`
      SELECT * FROM escrow_contracts WHERE gig_id = ${String(gig_id)} ORDER BY created_at DESC LIMIT 1
    `
    res.json(result[0] || null)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/escrow/user/:tg_id', async (req, res) => {
  try {
    const { tg_id } = req.params
    const result = await sql`
      SELECT * FROM escrow_contracts
      WHERE client_tg_id = ${String(tg_id)} OR freelancer_tg_id = ${String(tg_id)}
      ORDER BY created_at DESC
    `
    res.json(result)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/escrow/:gig_id/release', async (req, res) => {
  try {
    const { gig_id } = req.params
    const { release_tx, client_tg_id } = req.body
    const contract = await sql`
      SELECT * FROM escrow_contracts WHERE gig_id = ${String(gig_id)} AND status = 'funded'
    `
    if (!contract.length) return res.status(404).json({ error: 'No funded escrow found' })
    if (contract[0].client_tg_id !== String(client_tg_id)) {
      return res.status(403).json({ error: 'Only the client can release payment' })
    }
    await sql`
      UPDATE escrow_contracts
      SET status = 'released', release_tx = ${release_tx || ''}, released_at = NOW()
      WHERE gig_id = ${String(gig_id)} AND status = 'funded'
    `
    await sql`
      UPDATE work_submissions SET status = 'approved', reviewed_at = NOW()
      WHERE gig_id = ${String(gig_id)} AND status = 'pending'
    `
    const freelancerTgId = contract[0].freelancer_tg_id
    const newScore = await recalcQuestScore(freelancerTgId)
    const BOT_TOKEN = process.env.BOT_TOKEN
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: client_tg_id, text: `✅ Payment of ${contract[0].amount_ton} TON released from escrow!\n\nTx: ${release_tx || 'N/A'}` })
    }).catch(() => {})
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: freelancerTgId, text: `💰 ${contract[0].amount_ton} TON released to your wallet!\n\n🏆 QuestScore updated: ${newScore}\n\nTx: ${release_tx || 'N/A'}` })
    }).catch(() => {})
    res.json({ success: true, new_quest_score: newScore })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// WORK SUBMISSIONS
// ─────────────────────────────────────────

app.post('/api/submissions', async (req, res) => {
  try {
    const { gig_id, client_tg_id, freelancer_tg_id, note, file_url, link_url } = req.body
    if (!gig_id || !freelancer_tg_id) return res.status(400).json({ error: 'Missing fields' })
    const existing = await sql`
      SELECT id FROM work_submissions
      WHERE gig_id = ${String(gig_id)} AND freelancer_tg_id = ${String(freelancer_tg_id)} AND status = 'pending'
    `
    if (existing.length > 0) {
      await sql`
        UPDATE work_submissions SET note = ${note || ''}, file_url = ${file_url || null}, link_url = ${link_url || null}, submitted_at = NOW()
        WHERE gig_id = ${String(gig_id)} AND freelancer_tg_id = ${String(freelancer_tg_id)} AND status = 'pending'
      `
      return res.json({ success: true, updated: true })
    }
    await sql`
      INSERT INTO work_submissions (gig_id, client_tg_id, freelancer_tg_id, note, file_url, link_url, status)
      VALUES (${String(gig_id)}, ${String(client_tg_id || '')}, ${String(freelancer_tg_id)}, ${note || ''}, ${file_url || null}, ${link_url || null}, 'pending')
    `
    if (client_tg_id) {
      const BOT_TOKEN = process.env.BOT_TOKEN
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: client_tg_id, text: `📬 Work submitted for review!\n\nOpen QuestWork to review and release payment from escrow.` })
      }).catch(() => {})
    }
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.get('/api/submissions/:gig_id', async (req, res) => {
  try {
    const { gig_id } = req.params
    const result = await sql`
      SELECT * FROM work_submissions WHERE gig_id = ${String(gig_id)} ORDER BY submitted_at DESC
    `
    res.json(result)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/submissions/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const sub = await sql`SELECT * FROM work_submissions WHERE id = ${parseInt(id)}`
    if (!sub.length) return res.status(404).json({ error: 'Not found' })
    await sql`UPDATE work_submissions SET status = 'approved', reviewed_at = NOW() WHERE id = ${parseInt(id)}`
    const newScore = await recalcQuestScore(sub[0].freelancer_tg_id)
    res.json({ success: true, new_quest_score: newScore })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────

app.post('/api/notify', async (req, res) => {
  try {
    const { chat_id, message } = req.body
    const BOT_TOKEN = process.env.BOT_TOKEN
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text: message, parse_mode: 'HTML' })
    })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// AI ROUTES
// ─────────────────────────────────────────

app.post('/api/ai/pitch', async (req, res) => {
  try {
    const { gig_title, gig_company, user_skills, user_bio } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-opus-4-6', max_tokens: 500,
        messages: [{ role: 'user', content: `Write a professional and compelling job application pitch for this Web3 role. Job Title: ${gig_title}. Company: ${gig_company}. My Skills: ${user_skills || 'Web3, Community Management, BD'}. My Bio: ${user_bio || 'Experienced Web3 professional'}. Write a 3 paragraph pitch that is professional, specific, and compelling. No subject lines or greetings. Plain text only with line breaks between paragraphs.` }]
      })
    })
    const data = await response.json()
    res.json({ pitch: data.content[0].text })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/ai/gig', async (req, res) => {
  try {
    const { basic_info } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-opus-4-6', max_tokens: 500,
        messages: [{ role: 'user', content: `Write a professional Web3 job description based on: ${basic_info}. Role overview 2-3 sentences, then numbered responsibilities, then numbered requirements. Concise and Web3 focused. Plain text only.` }]
      })
    })
    const data = await response.json()
    res.json({ description: data.content[0].text })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// EXTERNAL GIGS
// ─────────────────────────────────────────

const fetchWeb3Jobs = async () => {
  try {
    const res = await fetch('https://web3.career/api/v1/jobs?token=WXFnYiuMV5ydYG9iHZegWy2pNVFduW2P', { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    const jobs = data.jobs || data || []
    for (const job of jobs) {
      const title = (job.title || '').toLowerCase()
      let category = 'Other'
      if (title.includes('community') || title.includes('discord')) category = 'Community Management'
      else if (title.includes('business') || title.includes('bd') || title.includes('partnership')) category = 'Business Development'
      else if (title.includes('dev') || title.includes('engineer') || title.includes('solidity')) category = 'Development'
      else if (title.includes('social') || title.includes('content') || title.includes('marketing')) category = 'Social Media'
      await sql`
        INSERT INTO external_gigs (job_id, title, company, location, salary, apply_url, posted_at, category)
        VALUES (${String(job.id)}, ${job.title}, ${job.company}, ${job.location}, ${job.salary}, ${job.url}, ${job.date}, ${category})
        ON CONFLICT (job_id) DO NOTHING
      `
    }
    console.log('✅ Web3.career jobs synced')
  } catch (err) { console.error('❌ Sync failed:', err.message) }
}

fetchWeb3Jobs()
setInterval(fetchWeb3Jobs, 60 * 60 * 1000)

app.get('/api/external-gigs', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM external_gigs ORDER BY posted_at DESC LIMIT 100`
    res.json(result)
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// BRAINTREE
// ─────────────────────────────────────────

app.get('/api/braintree/token', async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({})
    res.json({ token: response.clientToken })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/braintree/subscribe', async (req, res) => {
  try {
    const { paymentMethodNonce, tg_id } = req.body
    const result = await gateway.customer.create({ paymentMethodNonce })
    if (!result.success) return res.status(400).json({ error: result.message })
    const paymentMethodToken = result.customer.paymentMethods[0].token
    const subscription = await gateway.subscription.create({ paymentMethodToken, planId: process.env.BRAINTREE_PLAN_ID })
    if (!subscription.success) return res.status(400).json({ error: subscription.message })
    await sql`UPDATE users SET is_premium = true, subscription_id = ${subscription.subscription.id} WHERE tg_id = ${tg_id}`
    res.json({ success: true, subscriptionId: subscription.subscription.id })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/braintree/cancel', async (req, res) => {
  try {
    const { tg_id } = req.body
    const user = await sql`SELECT subscription_id FROM users WHERE tg_id = ${tg_id}`
    if (user[0]?.subscription_id) {
      await gateway.subscription.cancel(user[0].subscription_id)
      await sql`UPDATE users SET is_premium = false, subscription_id = null WHERE tg_id = ${tg_id}`
    }
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

app.post('/api/admin/premium', async (req, res) => {
  try {
    const { tg_id, is_premium } = req.body
    await sql`UPDATE users SET is_premium = ${is_premium} WHERE tg_id = ${tg_id}`
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})


// ─────────────────────────────────────────
// TELEGRAM BOT
// ─────────────────────────────────────────

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: { autoStart: true, params: { timeout: 10 } }
})

bot.on('polling_error', (err) => console.log('Bot polling error:', err.code))

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome to QuestWork! 🚀\nFind Web3 gigs and get paid in crypto.', {
    reply_markup: { inline_keyboard: [[{ text: '🚀 Open QuestWork', web_app: { url: 'https://questwork-green.vercel.app' } }]] }
  })
})

bot.onText(/\/upgrade (.+)/, async (msg, match) => {
  const username = match[1].trim().replace('@', '')
  try {
    const user = await sql`SELECT * FROM users WHERE tg_username = ${username}`
    if (!user[0]) { bot.sendMessage(msg.chat.id, `❌ User @${username} not found.`); return }
    await sql`UPDATE users SET is_premium = true WHERE tg_username = ${username}`
    bot.sendMessage(msg.chat.id, `✅ @${username} upgraded to Premium!`)
  } catch (err) { bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`) }
})

bot.onText(/\/downgrade (.+)/, async (msg, match) => {
  const username = match[1].trim().replace('@', '')
  try {
    await sql`UPDATE users SET is_premium = false WHERE tg_username = ${username}`
    bot.sendMessage(msg.chat.id, `✅ @${username} downgraded.`)
  } catch (err) { bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`) }
})

bot.onText(/\/score (.+)/, async (msg, match) => {
  const username = match[1].trim().replace('@', '')
  try {
    const user = await sql`SELECT * FROM users WHERE tg_username = ${username}`
    if (!user[0]) { bot.sendMessage(msg.chat.id, `❌ User not found.`); return }
    const score = await recalcQuestScore(user[0].tg_id)
    bot.sendMessage(msg.chat.id, `🏆 @${username} QuestScore: ${score}`)
  } catch (err) { bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`) }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`QuestWork API running on port ${PORT}`))