// ============================================================
// QuestWork Backend — index.js
// Deploy to: Railway
// Node.js + Express + PostgreSQL (Neon DB)
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// DATABASE
// ─────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ─────────────────────────────────────────
// LAZY IMPORTS (CommonJS compat)
// ─────────────────────────────────────────
let fetch;
(async () => { fetch = (await import('node-fetch')).default; })();

// ─────────────────────────────────────────
// TELEGRAM BOT (webhook / polling off)
// ─────────────────────────────────────────
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// ─────────────────────────────────────────
// BRAINTREE
// ─────────────────────────────────────────
const braintree = require('braintree');
const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey:  process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// ─────────────────────────────────────────
// ANTHROPIC
// ─────────────────────────────────────────
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================
// DB INIT — creates all tables on startup
// ============================================================
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      tg_id            TEXT PRIMARY KEY,
      tg_username      TEXT,
      first_name       TEXT,
      last_name        TEXT,
      bio              TEXT,
      skills           TEXT,
      availability     TEXT DEFAULT 'Available',
      wallet_address   TEXT,
      is_premium       BOOLEAN DEFAULT FALSE,
      subscription_id  TEXT,
      dm_enabled       BOOLEAN DEFAULT TRUE,
      quest_score      INTEGER DEFAULT 0,
      jobs_completed   INTEGER DEFAULT 0,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS gigs (
      id              SERIAL PRIMARY KEY,
      title           TEXT NOT NULL,
      category        TEXT,
      description     TEXT,
      pay_usdt        TEXT,
      duration        TEXT,
      region          TEXT DEFAULT 'Global',
      poster_tg_id    TEXT,
      poster_username TEXT,
      source          TEXT DEFAULT 'questwork',
      apply_url       TEXT,
      featured        BOOLEAN DEFAULT FALSE,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS applications (
      id                  SERIAL PRIMARY KEY,
      gig_id              TEXT,
      gig_title           TEXT,
      applicant_tg_id     TEXT,
      applicant_username  TEXT,
      pitch               TEXT,
      status              TEXT DEFAULT 'Pending',
      created_at          TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id              SERIAL PRIMARY KEY,
      sender_tg_id    TEXT NOT NULL,
      receiver_tg_id  TEXT NOT NULL,
      content         TEXT,
      msg_type        TEXT DEFAULT 'text',
      file_url        TEXT,
      file_name       TEXT,
      is_read         BOOLEAN DEFAULT FALSE,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS escrow_contracts (
      id                  SERIAL PRIMARY KEY,
      gig_id              TEXT,
      gig_title           TEXT,
      client_tg_id        TEXT NOT NULL,
      freelancer_tg_id    TEXT NOT NULL,
      contract_address    TEXT DEFAULT 'EQDucZhNYIW5TwinCcwmdPqzjz7yt_MpA7YfMS-B4rInPcis',
      amount_ton          TEXT NOT NULL,
      amount_usdt         TEXT,
      status              TEXT DEFAULT 'funded',
      tx_hash             TEXT,
      release_tx          TEXT,
      created_at          TIMESTAMPTZ DEFAULT NOW(),
      released_at         TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS work_submissions (
      id                  SERIAL PRIMARY KEY,
      contract_id         INTEGER REFERENCES escrow_contracts(id),
      gig_id              TEXT,
      gig_title           TEXT,
      client_tg_id        TEXT NOT NULL,
      freelancer_tg_id    TEXT NOT NULL,
      note                TEXT,
      file_url            TEXT,
      link_url            TEXT,
      status              TEXT DEFAULT 'pending',
      submitted_at        TIMESTAMPTZ DEFAULT NOW(),
      reviewed_at         TIMESTAMPTZ
    );
  `);
  console.log('✅ DB tables ready');
}

// ============================================================
// CONTACT INFO DETECTION — blocks phone/email/social in messages
// ============================================================
function containsContactInfo(text) {
  if (!text) return false;
  const patterns = [
    /(\+?\d[\d\s\-().]{7,}\d)/,                        // phone numbers
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/, // email
    /(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]+/i,           // telegram links
    /(?:wa\.me|whatsapp\.com)\/[0-9]+/i,                 // whatsapp links
    /(?:instagram\.com|ig\.me)\/[a-zA-Z0-9_.]+/i,       // instagram
    /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+/i,          // twitter/x
    /(?:discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/i, // discord invites
    /\bskype:[a-zA-Z0-9._\-]+/i,                        // skype
    /\b@[a-zA-Z0-9_]{3,}\b/,                            // @username handles
  ];
  return patterns.some(p => p.test(text));
}

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/', (req, res) => res.json({ status: 'QuestWork API running' }));

// ─────────────────────────────────────────
// USERS
// ─────────────────────────────────────────

// Register / upsert user on login
app.post('/api/users', async (req, res) => {
  const { tg_id, tg_username, first_name, last_name } = req.body;
  if (!tg_id) return res.status(400).json({ error: 'tg_id required' });
  try {
    await pool.query(`
      INSERT INTO users (tg_id, tg_username, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (tg_id) DO UPDATE SET
        tg_username = EXCLUDED.tg_username,
        first_name  = EXCLUDED.first_name,
        last_name   = EXCLUDED.last_name
    `, [String(tg_id), tg_username || '', first_name || '', last_name || '']);
    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/users:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Search users — MUST be before /:tg_id
app.get('/api/users/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const { rows } = await pool.query(`
      SELECT tg_id, tg_username, first_name, last_name, bio, skills, availability, quest_score, jobs_completed, dm_enabled, is_premium
      FROM users
      WHERE dm_enabled = TRUE
        AND (
          LOWER(first_name) LIKE $1 OR
          LOWER(last_name)  LIKE $1 OR
          LOWER(tg_username) LIKE $1 OR
          LOWER(skills)      LIKE $1
        )
      LIMIT 20
    `, [`%${q.toLowerCase()}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Backup login
app.post('/api/users/backup-login', async (req, res) => {
  const { email, password } = req.body;
  // Store hashed in production — for now just acknowledge
  res.json({ success: true });
});

// Get user by tg_id
app.get('/api/users/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE tg_id = $1',
      [req.params.tg_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile (bio, skills, availability, wallet, dm_enabled)
app.patch('/api/users/:tg_id', async (req, res) => {
  const { bio, skills, availability, wallet_address, dm_enabled } = req.body;
  try {
    await pool.query(`
      UPDATE users SET
        bio            = COALESCE($1, bio),
        skills         = COALESCE($2, skills),
        availability   = COALESCE($3, availability),
        wallet_address = COALESCE($4, wallet_address),
        dm_enabled     = COALESCE($5, dm_enabled)
      WHERE tg_id = $6
    `, [bio, skills, availability, wallet_address, dm_enabled, req.params.tg_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// GIGS
// ─────────────────────────────────────────

app.get('/api/gigs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM gigs ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/gigs', async (req, res) => {
  const { title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'title and description required' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO gigs (title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [title, category, description, pay_usdt, duration, region || 'Global', poster_tg_id, poster_username]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────

app.post('/api/applications', async (req, res) => {
  const { gig_id, gig_title, applicant_tg_id, applicant_username, pitch } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO applications (gig_id, gig_title, applicant_tg_id, applicant_username, pitch)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
    `, [gig_id, gig_title, applicant_tg_id, applicant_username, pitch]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/applications/received/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, g.title AS gig_title
      FROM applications a
      LEFT JOIN gigs g ON g.id::TEXT = a.gig_id
      WHERE g.poster_tg_id = $1
      ORDER BY a.created_at DESC
    `, [req.params.tg_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/applications/sent/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM applications WHERE applicant_tg_id = $1 ORDER BY created_at DESC',
      [req.params.tg_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────

// Get all threads for a user
app.get('/api/messages/threads/:tg_id', async (req, res) => {
  const userId = req.params.tg_id;
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT ON (other_id)
        other_id,
        other_name,
        other_username,
        last_message,
        last_time,
        unread_count
      FROM (
        SELECT
          CASE WHEN sender_tg_id = $1 THEN receiver_tg_id ELSE sender_tg_id END AS other_id,
          CASE WHEN sender_tg_id = $1
            THEN (SELECT first_name || ' ' || COALESCE(last_name,'') FROM users WHERE tg_id = m.receiver_tg_id)
            ELSE (SELECT first_name || ' ' || COALESCE(last_name,'') FROM users WHERE tg_id = m.sender_tg_id)
          END AS other_name,
          CASE WHEN sender_tg_id = $1
            THEN (SELECT tg_username FROM users WHERE tg_id = m.receiver_tg_id)
            ELSE (SELECT tg_username FROM users WHERE tg_id = m.sender_tg_id)
          END AS other_username,
          content AS last_message,
          created_at AS last_time,
          (
            SELECT COUNT(*) FROM messages
            WHERE sender_tg_id != $1
              AND receiver_tg_id = $1
              AND is_read = FALSE
              AND sender_tg_id = CASE WHEN m.sender_tg_id = $1 THEN m.receiver_tg_id ELSE m.sender_tg_id END
          ) AS unread_count
        FROM messages m
        WHERE sender_tg_id = $1 OR receiver_tg_id = $1
        ORDER BY created_at DESC
      ) sub
      ORDER BY other_id, last_time DESC
    `, [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages between two users
app.get('/api/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    await pool.query(`
      UPDATE messages SET is_read = TRUE
      WHERE receiver_tg_id = $1 AND sender_tg_id = $2
    `, [user1, user2]);

    const { rows } = await pool.query(`
      SELECT * FROM messages
      WHERE (sender_tg_id = $1 AND receiver_tg_id = $2)
         OR (sender_tg_id = $2 AND receiver_tg_id = $1)
      ORDER BY created_at ASC
      LIMIT 200
    `, [user1, user2]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a message (with contact info detection)
app.post('/api/messages', async (req, res) => {
  const { sender_tg_id, receiver_tg_id, content, msg_type, file_url, file_name } = req.body;
  if (!sender_tg_id || !receiver_tg_id) return res.status(400).json({ error: 'sender and receiver required' });

  // Block contact info
  if (content && containsContactInfo(content)) {
    return res.status(400).json({
      error: 'blocked',
      reason: 'Messages containing contact information (phone numbers, emails, social handles) are not allowed. All communication must stay in-app to protect both parties.'
    });
  }

  try {
    const { rows } = await pool.query(`
      INSERT INTO messages (sender_tg_id, receiver_tg_id, content, msg_type, file_url, file_name)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [sender_tg_id, receiver_tg_id, content || '', msg_type || 'text', file_url, file_name]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unread count for a user
app.get('/api/messages/unread/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT COUNT(*) AS count FROM messages WHERE receiver_tg_id = $1 AND is_read = FALSE',
      [req.params.tg_id]
    );
    res.json({ count: parseInt(rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// ESCROW CONTRACTS
// ─────────────────────────────────────────

// Create escrow contract record (called after client sends TON)
app.post('/api/escrow', async (req, res) => {
  const { gig_id, gig_title, client_tg_id, freelancer_tg_id, amount_ton, amount_usdt, tx_hash } = req.body;
  if (!client_tg_id || !freelancer_tg_id || !amount_ton) {
    return res.status(400).json({ error: 'client_tg_id, freelancer_tg_id, amount_ton required' });
  }
  try {
    const { rows } = await pool.query(`
      INSERT INTO escrow_contracts (gig_id, gig_title, client_tg_id, freelancer_tg_id, amount_ton, amount_usdt, tx_hash, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'funded')
      RETURNING *
    `, [gig_id, gig_title, client_tg_id, freelancer_tg_id, amount_ton, amount_usdt, tx_hash]);

    // Notify freelancer via Telegram bot
    try {
      await bot.sendMessage(freelancer_tg_id, 
        `💰 Escrow funded!\n\nGig: ${gig_title || 'New Gig'}\nAmount: ${amount_ton} TON (~$${amount_usdt || '?'} USDT)\n\nFunds are locked in escrow. Complete the work and submit via QuestWork.\n\nhttps://t.me/Questworkbot`
      );
    } catch (_) {}

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contracts for a user (as client or freelancer)
app.get('/api/escrow/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM escrow_contracts
      WHERE client_tg_id = $1 OR freelancer_tg_id = $1
      ORDER BY created_at DESC
    `, [req.params.tg_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contracts between two specific users (for inline chat display)
app.get('/api/escrow/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT * FROM escrow_contracts
      WHERE (client_tg_id = $1 AND freelancer_tg_id = $2)
         OR (client_tg_id = $2 AND freelancer_tg_id = $1)
      ORDER BY created_at DESC
    `, [user1, user2]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Release payment (client approves work)
app.post('/api/escrow/:id/release', async (req, res) => {
  const { release_tx } = req.body;
  const contractId = req.params.id;
  try {
    const { rows } = await pool.query(`
      UPDATE escrow_contracts
      SET status = 'released', release_tx = $1, released_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [release_tx || 'manual', contractId]);

    if (!rows.length) return res.status(404).json({ error: 'Contract not found' });
    const contract = rows[0];

    // Update freelancer QuestScore + jobs_completed
    await pool.query(`
      UPDATE users
      SET quest_score    = quest_score + 10,
          jobs_completed = jobs_completed + 1
      WHERE tg_id = $1
    `, [contract.freelancer_tg_id]);

    // Notify both parties
    try {
      await bot.sendMessage(contract.freelancer_tg_id,
        `✅ Payment Released!\n\nAmount: ${contract.amount_ton} TON\nGig: ${contract.gig_title || 'Completed'}\n\nYour QuestScore has been updated. Keep up the great work!\n\nhttps://t.me/Questworkbot`
      );
      await bot.sendMessage(contract.client_tg_id,
        `✅ You released payment to your freelancer.\n\nGig: ${contract.gig_title || 'Completed'}\nAmount: ${contract.amount_ton} TON\n\nThank you for using QuestWork!`
      );
    } catch (_) {}

    res.json({ success: true, contract: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// WORK SUBMISSIONS
// ─────────────────────────────────────────

app.post('/api/submissions', async (req, res) => {
  const { contract_id, gig_id, gig_title, client_tg_id, freelancer_tg_id, note, file_url, link_url } = req.body;
  if (!client_tg_id || !freelancer_tg_id) return res.status(400).json({ error: 'client and freelancer tg_id required' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO work_submissions (contract_id, gig_id, gig_title, client_tg_id, freelancer_tg_id, note, file_url, link_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [contract_id, gig_id, gig_title, client_tg_id, freelancer_tg_id, note, file_url, link_url]);

    // Update contract status to submitted
    if (contract_id) {
      await pool.query(
        `UPDATE escrow_contracts SET status = 'submitted' WHERE id = $1`,
        [contract_id]
      );
    }

    // Notify client
    try {
      await bot.sendMessage(client_tg_id,
        `📦 Work Submitted!\n\nGig: ${gig_title || 'Your Gig'}\nFreelancer has submitted their work for review.\n\nOpen QuestWork to review and release payment.\n\nhttps://t.me/Questworkbot`
      );
    } catch (_) {}

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/submissions/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM work_submissions
      WHERE client_tg_id = $1 OR freelancer_tg_id = $1
      ORDER BY submitted_at DESC
    `, [req.params.tg_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// NOTIFICATIONS (Telegram bot push)
// ─────────────────────────────────────────
app.post('/api/notify', async (req, res) => {
  const { chat_id, message } = req.body;
  if (!chat_id || !message) return res.status(400).json({ error: 'chat_id and message required' });
  try {
    await bot.sendMessage(chat_id, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// AI — GIG DESCRIPTION
// ─────────────────────────────────────────
app.post('/api/ai/gig', async (req, res) => {
  const { basic_info } = req.body;
  if (!basic_info) return res.status(400).json({ error: 'basic_info required' });
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Write a professional Web3 job description for the following role. Be specific, engaging, and concise (3-4 sentences). Only output the description, nothing else.\n\nRole info: ${basic_info}`
      }]
    });
    res.json({ description: msg.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// AI — PITCH WRITER (Premium)
// ─────────────────────────────────────────
app.post('/api/ai/pitch', async (req, res) => {
  const { gig_title, gig_company, user_skills, user_bio } = req.body;
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Write a short, confident freelance pitch (3-4 sentences) for applying to this Web3 job. Only output the pitch text, no intro.\n\nJob: ${gig_title} at ${gig_company}\nApplicant skills: ${user_skills || 'Web3, community management'}\nApplicant bio: ${user_bio || 'Experienced Web3 professional'}`
      }]
    });
    res.json({ pitch: msg.content[0].text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// AI — SMART MATCHING (matches freelancers to a gig)
// ─────────────────────────────────────────
app.post('/api/ai/match', async (req, res) => {
  const { gig_id, gig_title, gig_category, gig_description } = req.body;
  try {
    const { rows: users } = await pool.query(
      `SELECT tg_id, first_name, skills, quest_score, jobs_completed
       FROM users WHERE skills IS NOT NULL AND skills != '' AND dm_enabled = TRUE
       ORDER BY quest_score DESC LIMIT 50`
    );
    if (!users.length) return res.json({ matches: [] });

    const userList = users.map(u => `${u.first_name} (${u.tg_id}): skills=${u.skills}, score=${u.quest_score}`).join('\n');

    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Given this Web3 gig and list of freelancers, return the top 5 best-matched freelancer tg_ids as a JSON array. Only output valid JSON, nothing else.\n\nGig: ${gig_title} (${gig_category})\nDescription: ${gig_description}\n\nFreelancers:\n${userList}\n\nOutput format: {"matches": ["tg_id1","tg_id2",...]}`
      }]
    });

    let parsed = { matches: [] };
    try { parsed = JSON.parse(msg.content[0].text); } catch (_) {}
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// AI — FREELANCER SCORE
// ─────────────────────────────────────────
app.get('/api/ai/score/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE tg_id = $1', [req.params.tg_id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];

    const msg = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Score this Web3 freelancer out of 100 based on their profile. Return only JSON: {"score": number, "reason": "short reason"}.\n\nName: ${user.first_name}\nBio: ${user.bio || 'None'}\nSkills: ${user.skills || 'None'}\nJobs completed: ${user.jobs_completed || 0}\nCurrent score: ${user.quest_score || 0}`
      }]
    });

    let parsed = { score: 0, reason: '' };
    try { parsed = JSON.parse(msg.content[0].text); } catch (_) {}
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// BRAINTREE — Premium subscription
// ─────────────────────────────────────────
app.get('/api/braintree/token', async (req, res) => {
  try {
    const response = await btGateway.clientToken.generate({});
    res.json({ token: response.clientToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/braintree/subscribe', async (req, res) => {
  const { paymentMethodNonce, tg_id } = req.body;
  try {
    const customerResult = await btGateway.customer.create({
      paymentMethodNonce
    });
    if (!customerResult.success) {
      return res.status(400).json({ error: customerResult.message });
    }
    const paymentMethodToken = customerResult.customer.paymentMethods[0].token;
    const subResult = await btGateway.subscription.create({
      paymentMethodToken,
      planId: process.env.BRAINTREE_PLAN_ID,
    });
    if (!subResult.success) {
      return res.status(400).json({ error: subResult.message });
    }
    if (tg_id) {
      await pool.query(
        'UPDATE users SET is_premium = TRUE, subscription_id = $1 WHERE tg_id = $2',
        [subResult.subscription.id, tg_id]
      );
    }
    res.json({ success: true, subscription_id: subResult.subscription.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/braintree/cancel', async (req, res) => {
  const { tg_id } = req.body;
  try {
    const { rows } = await pool.query('SELECT subscription_id FROM users WHERE tg_id = $1', [tg_id]);
    if (!rows.length || !rows[0].subscription_id) return res.status(404).json({ error: 'No subscription found' });
    await btGateway.subscription.cancel(rows[0].subscription_id);
    await pool.query('UPDATE users SET is_premium = FALSE, subscription_id = NULL WHERE tg_id = $1', [tg_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// ADMIN — Premium toggle
// ─────────────────────────────────────────
app.post('/api/admin/premium', async (req, res) => {
  const { admin_key, tg_id, set_premium } = req.body;
  if (admin_key !== process.env.ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
  try {
    await pool.query('UPDATE users SET is_premium = $1 WHERE tg_id = $2', [set_premium, tg_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// TELEGRAM BOT ADMIN COMMANDS (polling)
// ─────────────────────────────────────────
const adminBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

adminBot.onText(/\/upgrade (.+)/, async (msg, match) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) {
    return adminBot.sendMessage(msg.chat.id, '❌ Not authorized.');
  }
  const target = match[1].trim();
  try {
    await pool.query('UPDATE users SET is_premium = TRUE WHERE tg_id = $1 OR tg_username = $1', [target]);
    adminBot.sendMessage(msg.chat.id, `✅ User ${target} upgraded to Premium!`);
  } catch (err) {
    adminBot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
  }
});

adminBot.onText(/\/downgrade (.+)/, async (msg, match) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) {
    return adminBot.sendMessage(msg.chat.id, '❌ Not authorized.');
  }
  const target = match[1].trim();
  try {
    await pool.query('UPDATE users SET is_premium = FALSE WHERE tg_id = $1 OR tg_username = $1', [target]);
    adminBot.sendMessage(msg.chat.id, `✅ User ${target} downgraded.`);
  } catch (err) {
    adminBot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
  }
});

adminBot.onText(/\/stats/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) return;
  try {
    const { rows: [stats] } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE is_premium = TRUE) AS premium_users,
        (SELECT COUNT(*) FROM gigs) AS total_gigs,
        (SELECT COUNT(*) FROM applications) AS total_applications,
        (SELECT COUNT(*) FROM messages) AS total_messages,
        (SELECT COUNT(*) FROM escrow_contracts) AS total_contracts
    `);
    adminBot.sendMessage(msg.chat.id,
      `📊 QuestWork Stats\n\n👥 Users: ${stats.total_users}\n⭐ Premium: ${stats.premium_users}\n💼 Gigs: ${stats.total_gigs}\n📨 Applications: ${stats.total_applications}\n💬 Messages: ${stats.total_messages}\n🔒 Contracts: ${stats.total_contracts}`
    );
  } catch (err) {
    adminBot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
  }
});

// ─────────────────────────────────────────
// EXTERNAL GIGS — web3.career (proxy to hide API key)
// ─────────────────────────────────────────
app.get('/api/external-gigs', async (req, res) => {
  const { search, category } = req.query;
  try {
    let url = `https://web3.career/api/v1?token=${process.env.WEB3_CAREER_TOKEN}`;
    if (search)   url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&tag=${encodeURIComponent(category)}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// START
// ─────────────────────────────────────────
const PORT = process.env.PORT || 3001;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 QuestWork API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ DB init failed:', err.message);
  process.exit(1);
});