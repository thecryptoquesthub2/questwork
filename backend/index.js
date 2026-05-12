// ============================================================
// QuestWork Backend — index.js (Phase 1 Complete)
// Railway deployment
// Phase 1 additions:
//   - Unread message counts (by thread and total)
//   - Mark messages as read
//   - Auto-release escrow after 5 days
//   - Dispute submission + admin notification
//   - Premium check on messaging
//   - Daily reminder bot for pending approvals
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let fetch;
(async () => { fetch = (await import('node-fetch')).default; })();

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
const adminBot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const braintree = require('braintree');
const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey:  process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================
// DB INIT
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
      x_handle         TEXT,
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
      deadline_days       INTEGER DEFAULT 5,
      work_submitted_at   TIMESTAMPTZ,
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
    CREATE TABLE IF NOT EXISTS disputes (
      id                  SERIAL PRIMARY KEY,
      contract_id         INTEGER REFERENCES escrow_contracts(id),
      raised_by_tg_id     TEXT NOT NULL,
      against_tg_id       TEXT,
      reason              TEXT,
      evidence_url        TEXT,
      status              TEXT DEFAULT 'pending',
      resolution          TEXT,
      created_at          TIMESTAMPTZ DEFAULT NOW(),
      resolved_at         TIMESTAMPTZ
    );
    ALTER TABLE users ADD COLUMN IF NOT EXISTS x_handle TEXT;
    ALTER TABLE escrow_contracts ADD COLUMN IF NOT EXISTS work_submitted_at TIMESTAMPTZ;
    ALTER TABLE escrow_contracts ADD COLUMN IF NOT EXISTS deadline_days INTEGER DEFAULT 5;
  `);
  console.log('✅ DB tables ready');
}

// ============================================================
// CONTACT INFO DETECTION
// ============================================================
function containsContactInfo(text) {
  if (!text) return false;
  const patterns = [
    /(\+?\d[\d\s\-().]{7,}\d)/,
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/,
    /(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]+/i,
    /(?:wa\.me|whatsapp\.com)\/[0-9]+/i,
    /(?:instagram\.com|ig\.me)\/[a-zA-Z0-9_.]+/i,
    /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+/i,
    /(?:discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/i,
    /\b@[a-zA-Z0-9_]{3,}\b/,
  ];
  return patterns.some(p => p.test(text));
}

// ============================================================
// AUTO-RELEASE — runs every hour
// ============================================================
async function checkAutoRelease() {
  try {
    const { rows } = await pool.query(`
      SELECT ec.*, ws.submitted_at
      FROM escrow_contracts ec
      JOIN work_submissions ws ON ws.contract_id = ec.id
      WHERE ec.status = 'submitted'
        AND ws.status = 'pending'
        AND ws.submitted_at < NOW() - INTERVAL '5 days'
    `);
    for (const contract of rows) {
      await pool.query(`UPDATE escrow_contracts SET status = 'released', release_tx = 'auto-release', released_at = NOW() WHERE id = $1`, [contract.id]);
      await pool.query(`UPDATE work_submissions SET status = 'auto-approved', reviewed_at = NOW() WHERE contract_id = $1`, [contract.id]);
      await pool.query(`UPDATE users SET quest_score = quest_score + 10, jobs_completed = jobs_completed + 1 WHERE tg_id = $1`, [contract.freelancer_tg_id]);
      try {
        await bot.sendMessage(contract.freelancer_tg_id, `✅ Payment Auto-Released!\n\nGig: ${contract.gig_title || 'Completed'}\nAmount: ${contract.amount_ton} TON\n\nClient did not respond in 5 days. Payment released to you automatically. Your QuestScore has been updated! 🎯`);
        await bot.sendMessage(contract.client_tg_id, `⚠️ Payment Auto-Released\n\nYou did not review submitted work within 5 days. Payment was released to the freelancer.\n\nGig: ${contract.gig_title}\nAmount: ${contract.amount_ton} TON\n\nContact @QuestWorkSupport if you have concerns.`);
      } catch (_) {}
    }
  } catch (err) { console.error('Auto-release error:', err.message); }
}

// ============================================================
// DAILY REMINDERS — runs every 24 hours
// ============================================================
async function sendDailyReminders() {
  try {
    const { rows } = await pool.query(`
      SELECT ec.*, ws.submitted_at,
        EXTRACT(DAY FROM NOW() - ws.submitted_at) AS days_waiting
      FROM escrow_contracts ec
      JOIN work_submissions ws ON ws.contract_id = ec.id
      WHERE ec.status = 'submitted'
        AND ws.status = 'pending'
        AND ws.submitted_at < NOW() - INTERVAL '1 day'
        AND ws.submitted_at > NOW() - INTERVAL '5 days'
    `);
    for (const contract of rows) {
      const daysLeft = 5 - Math.floor(contract.days_waiting);
      try {
        await bot.sendMessage(contract.client_tg_id, `⏰ Action Required!\n\nYour freelancer submitted work for review.\n\nGig: ${contract.gig_title || 'Active Gig'}\nAmount locked: ${contract.amount_ton} TON\nDays left to review: ${daysLeft}\n\n⚠️ Payment auto-releases in ${daysLeft} day(s) if no action taken.\n\nOpen QuestWork → https://t.me/Questworkbot`);
      } catch (_) {}
    }
  } catch (err) { console.error('Daily reminder error:', err.message); }
}

// ============================================================
// ROUTES
// ============================================================

app.get('/', (req, res) => res.json({ status: 'QuestWork API — Phase 1' }));

// ─── USERS ───────────────────────────────
app.post('/api/users', async (req, res) => {
  const { tg_id, tg_username, first_name, last_name } = req.body;
  if (!tg_id) return res.status(400).json({ error: 'tg_id required' });
  try {
    await pool.query(`
      INSERT INTO users (tg_id, tg_username, first_name, last_name)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (tg_id) DO UPDATE SET
        tg_username = EXCLUDED.tg_username,
        first_name  = EXCLUDED.first_name,
        last_name   = EXCLUDED.last_name
    `, [String(tg_id), tg_username || '', first_name || '', last_name || '']);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/search', async (req, res) => {
  const { q } = req.query;
  try {
    const { rows } = await pool.query(`
      SELECT tg_id, tg_username, first_name, last_name, bio, skills,
             availability, quest_score, jobs_completed, dm_enabled, is_premium, x_handle
      FROM users
      WHERE ($1 = '' OR (
        LOWER(first_name)  LIKE $2 OR
        LOWER(last_name)   LIKE $2 OR
        LOWER(tg_username) LIKE $2 OR
        LOWER(skills)      LIKE $2
      ))
      ORDER BY quest_score DESC, created_at DESC
      LIMIT 100
    `, [q || '', `%${(q || '').toLowerCase()}%`]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/users/backup-login', async (req, res) => res.json({ success: true }));

app.get('/api/users/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE tg_id = $1', [req.params.tg_id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/users/:tg_id', async (req, res) => {
  const { bio, skills, availability, wallet_address, dm_enabled, x_handle } = req.body;
  try {
    await pool.query(`
      UPDATE users SET
        bio            = COALESCE($1, bio),
        skills         = COALESCE($2, skills),
        availability   = COALESCE($3, availability),
        wallet_address = COALESCE($4, wallet_address),
        dm_enabled     = COALESCE($5, dm_enabled),
        x_handle       = COALESCE($6, x_handle)
      WHERE tg_id = $7
    `, [bio, skills, availability, wallet_address, dm_enabled, x_handle, req.params.tg_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── GIGS ────────────────────────────────
app.get('/api/gigs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM gigs ORDER BY created_at DESC LIMIT 100');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gigs', async (req, res) => {
  const { title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'title and description required' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO gigs (title, category, description, pay_usdt, duration, region, poster_tg_id, poster_username)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [title, category, description, pay_usdt, duration, region || 'Global', poster_tg_id, poster_username]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── APPLICATIONS ─────────────────────────
app.post('/api/applications', async (req, res) => {
  const { gig_id, gig_title, applicant_tg_id, applicant_username, pitch } = req.body;
  try {
    const { rows } = await pool.query(`
      INSERT INTO applications (gig_id, gig_title, applicant_tg_id, applicant_username, pitch)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [gig_id, gig_title, applicant_tg_id, applicant_username, pitch]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/applications/received/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, g.title AS gig_title FROM applications a
      LEFT JOIN gigs g ON g.id::TEXT = a.gig_id
      WHERE g.poster_tg_id = $1 ORDER BY a.created_at DESC
    `, [req.params.tg_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/applications/sent/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM applications WHERE applicant_tg_id = $1 ORDER BY created_at DESC', [req.params.tg_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── MESSAGES ────────────────────────────

// Threads with correct unread count per person
app.get('/api/messages/threads/:tg_id', async (req, res) => {
  const userId = req.params.tg_id;
  try {
    const { rows } = await pool.query(`
      SELECT
        other_id,
        MAX(other_name)     AS other_name,
        MAX(other_username) AS other_username,
        MAX(last_message)   AS last_message,
        MAX(last_time)      AS last_time,
        SUM(unread_count)   AS unread_count
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
          CASE WHEN sender_tg_id != $1 AND is_read = FALSE THEN 1 ELSE 0 END AS unread_count
        FROM messages m
        WHERE sender_tg_id = $1 OR receiver_tg_id = $1
      ) sub
      GROUP BY other_id
      ORDER BY MAX(last_time) DESC
    `, [userId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get messages + mark as read
app.get('/api/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    await pool.query(`
      UPDATE messages SET is_read = TRUE
      WHERE receiver_tg_id = $1 AND sender_tg_id = $2 AND is_read = FALSE
    `, [user1, user2]);
    const { rows } = await pool.query(`
      SELECT * FROM messages
      WHERE (sender_tg_id = $1 AND receiver_tg_id = $2)
         OR (sender_tg_id = $2 AND receiver_tg_id = $1)
      ORDER BY created_at ASC LIMIT 500
    `, [user1, user2]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Send message — premium check + contact detection
app.post('/api/messages', async (req, res) => {
  const { sender_tg_id, receiver_tg_id, content, msg_type, file_url, file_name } = req.body;
  if (!sender_tg_id || !receiver_tg_id) return res.status(400).json({ error: 'sender and receiver required' });

  // Premium check
  try {
    const { rows } = await pool.query('SELECT is_premium FROM users WHERE tg_id = $1', [sender_tg_id]);
    if (!rows.length || !rows[0].is_premium) {
      return res.status(403).json({ error: 'premium_required', reason: 'Messaging is a Premium feature. Upgrade to send messages.' });
    }
  } catch (_) {}

  // Contact info block
  if (content && containsContactInfo(content)) {
    return res.status(400).json({ error: 'blocked', reason: 'Messages containing contact information are not allowed. Keep all communication in-app.' });
  }

  try {
    const { rows } = await pool.query(`
      INSERT INTO messages (sender_tg_id, receiver_tg_id, content, msg_type, file_url, file_name)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [sender_tg_id, receiver_tg_id, content || '', msg_type || 'text', file_url, file_name]);
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Unread count = number of PEOPLE with unread messages
app.get('/api/messages/unread/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT COUNT(DISTINCT sender_tg_id) AS count
      FROM messages
      WHERE receiver_tg_id = $1 AND is_read = FALSE
    `, [req.params.tg_id]);
    res.json({ count: parseInt(rows[0].count) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ESCROW ──────────────────────────────
app.post('/api/escrow', async (req, res) => {
  const { gig_id, gig_title, client_tg_id, freelancer_tg_id, amount_ton, amount_usdt, tx_hash } = req.body;
  if (!client_tg_id || !freelancer_tg_id || !amount_ton) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO escrow_contracts (gig_id, gig_title, client_tg_id, freelancer_tg_id, amount_ton, amount_usdt, tx_hash, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'funded') RETURNING *
    `, [gig_id, gig_title, client_tg_id, freelancer_tg_id, amount_ton, amount_usdt, tx_hash]);
    try { await bot.sendMessage(freelancer_tg_id, `💰 Escrow Funded!\n\nGig: ${gig_title || 'New Contract'}\nAmount: ${amount_ton} TON${amount_usdt ? ` (~$${amount_usdt} USDT)` : ''}\n\nFunds locked. Complete the work and submit via QuestWork.\n\nhttps://t.me/Questworkbot`); } catch (_) {}
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/escrow/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM escrow_contracts WHERE client_tg_id = $1 OR freelancer_tg_id = $1 ORDER BY created_at DESC', [req.params.tg_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

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
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/escrow/:id/release', async (req, res) => {
  const { release_tx } = req.body;
  try {
    const { rows } = await pool.query(`UPDATE escrow_contracts SET status = 'released', release_tx = $1, released_at = NOW() WHERE id = $2 RETURNING *`, [release_tx || 'client-approved', req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const c = rows[0];
    await pool.query('UPDATE users SET quest_score = quest_score + 10, jobs_completed = jobs_completed + 1 WHERE tg_id = $1', [c.freelancer_tg_id]);
    try {
      await bot.sendMessage(c.freelancer_tg_id, `✅ Payment Released!\n\nGig: ${c.gig_title || 'Completed'}\nAmount: ${c.amount_ton} TON\n\nYour QuestScore has been updated! 🎯`);
      await bot.sendMessage(c.client_tg_id, `✅ Payment Released\n\nGig: ${c.gig_title || 'Completed'}\nAmount: ${c.amount_ton} TON\n\nThank you for using QuestWork!`);
    } catch (_) {}
    res.json({ success: true, contract: rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── WORK SUBMISSIONS ─────────────────────
app.post('/api/submissions', async (req, res) => {
  const { contract_id, gig_id, gig_title, client_tg_id, freelancer_tg_id, note, file_url, link_url } = req.body;
  if (!client_tg_id || !freelancer_tg_id) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO work_submissions (contract_id, gig_id, gig_title, client_tg_id, freelancer_tg_id, note, file_url, link_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [contract_id, gig_id, gig_title, client_tg_id, freelancer_tg_id, note, file_url, link_url]);
    if (contract_id) {
      await pool.query('UPDATE escrow_contracts SET status = $1, work_submitted_at = NOW() WHERE id = $2', ['submitted', contract_id]);
    }
    try { await bot.sendMessage(client_tg_id, `📦 Work Submitted!\n\nGig: ${gig_title || 'Your Gig'}\nFreelancer submitted work for review.\n\n⏰ You have 5 days to approve. Payment auto-releases after 5 days.\n\nOpen QuestWork → https://t.me/Questworkbot`); } catch (_) {}
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/submissions/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT ws.*, ec.amount_ton, ec.amount_usdt, ec.status AS contract_status
      FROM work_submissions ws
      LEFT JOIN escrow_contracts ec ON ec.id = ws.contract_id
      WHERE ws.client_tg_id = $1 OR ws.freelancer_tg_id = $1
      ORDER BY ws.submitted_at DESC
    `, [req.params.tg_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── DISPUTES ─────────────────────────────
app.post('/api/disputes', async (req, res) => {
  const { contract_id, raised_by_tg_id, against_tg_id, reason, evidence_url } = req.body;
  if (!raised_by_tg_id || !reason) return res.status(400).json({ error: 'raised_by and reason required' });
  try {
    const { rows } = await pool.query(`
      INSERT INTO disputes (contract_id, raised_by_tg_id, against_tg_id, reason, evidence_url)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [contract_id, raised_by_tg_id, against_tg_id, reason, evidence_url]);
    if (contract_id) await pool.query('UPDATE escrow_contracts SET status = $1 WHERE id = $2', ['disputed', contract_id]);
    try {
      if (process.env.ADMIN_TG_ID) {
        await bot.sendMessage(process.env.ADMIN_TG_ID, `🚨 Dispute Raised!\n\nContract: ${contract_id || 'N/A'}\nBy: ${raised_by_tg_id}\nAgainst: ${against_tg_id || 'N/A'}\n\nReason: ${reason}\nEvidence: ${evidence_url || 'None'}\n\nResolve: /resolve_dispute ${rows[0].id} freelancer\nOR: /resolve_dispute ${rows[0].id} client`);
      }
    } catch (_) {}
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/disputes/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM disputes WHERE raised_by_tg_id = $1 OR against_tg_id = $1 ORDER BY created_at DESC', [req.params.tg_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── NOTIFICATIONS ────────────────────────
app.post('/api/notify', async (req, res) => {
  const { chat_id, message } = req.body;
  if (!chat_id || !message) return res.status(400).json({ error: 'chat_id and message required' });
  try { await bot.sendMessage(chat_id, message); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── AI ───────────────────────────────────
app.post('/api/ai/gig', async (req, res) => {
  const { basic_info } = req.body;
  if (!basic_info) return res.status(400).json({ error: 'basic_info required' });
  try {
    const msg = await anthropic.messages.create({ model: 'claude-opus-4-5', max_tokens: 400, messages: [{ role: 'user', content: `Write a professional Web3 job description (3-4 sentences). Only output the description.\n\nRole: ${basic_info}` }] });
    res.json({ description: msg.content[0].text });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/pitch', async (req, res) => {
  const { gig_title, gig_company, user_skills, user_bio } = req.body;
  try {
    const msg = await anthropic.messages.create({ model: 'claude-opus-4-5', max_tokens: 300, messages: [{ role: 'user', content: `Write a short freelance pitch (3-4 sentences). Only output the pitch.\n\nJob: ${gig_title} at ${gig_company}\nSkills: ${user_skills || 'Web3'}\nBio: ${user_bio || 'Experienced Web3 professional'}` }] });
    res.json({ pitch: msg.content[0].text });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/ai/score/:tg_id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE tg_id = $1', [req.params.tg_id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const u = rows[0];
    const msg = await anthropic.messages.create({ model: 'claude-opus-4-5', max_tokens: 200, messages: [{ role: 'user', content: `Score this Web3 freelancer 0-100. Return only JSON: {"score": number, "reason": "short"}.\n\nBio: ${u.bio || 'None'}\nSkills: ${u.skills || 'None'}\nJobs: ${u.jobs_completed || 0}` }] });
    let parsed = { score: 0, reason: '' };
    try { parsed = JSON.parse(msg.content[0].text); } catch (_) {}
    res.json(parsed);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── BRAINTREE ────────────────────────────
app.get('/api/braintree/token', async (req, res) => {
  try { const r = await btGateway.clientToken.generate({}); res.json({ token: r.clientToken }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/braintree/subscribe', async (req, res) => {
  const { paymentMethodNonce, tg_id } = req.body;
  try {
    const cr = await btGateway.customer.create({ paymentMethodNonce });
    if (!cr.success) return res.status(400).json({ error: cr.message });
    const token = cr.customer.paymentMethods[0].token;
    const sr = await btGateway.subscription.create({ paymentMethodToken: token, planId: process.env.BRAINTREE_PLAN_ID });
    if (!sr.success) return res.status(400).json({ error: sr.message });
    if (tg_id) await pool.query('UPDATE users SET is_premium = TRUE, subscription_id = $1 WHERE tg_id = $2', [sr.subscription.id, tg_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/braintree/cancel', async (req, res) => {
  const { tg_id } = req.body;
  try {
    const { rows } = await pool.query('SELECT subscription_id FROM users WHERE tg_id = $1', [tg_id]);
    if (!rows.length || !rows[0].subscription_id) return res.status(404).json({ error: 'No subscription' });
    await btGateway.subscription.cancel(rows[0].subscription_id);
    await pool.query('UPDATE users SET is_premium = FALSE, subscription_id = NULL WHERE tg_id = $1', [tg_id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ADMIN ────────────────────────────────
app.post('/api/admin/premium', async (req, res) => {
  const { admin_key, tg_id, set_premium } = req.body;
  if (admin_key !== process.env.ADMIN_SECRET) return res.status(403).json({ error: 'Unauthorized' });
  try { await pool.query('UPDATE users SET is_premium = $1 WHERE tg_id = $2', [set_premium, tg_id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── EXTERNAL GIGS ────────────────────────
app.get('/api/external-gigs', async (req, res) => {
  const { search, category } = req.query;
  try {
    let url = `https://web3.career/api/v1?token=${process.env.WEB3_CAREER_TOKEN}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&tag=${encodeURIComponent(category)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── ADMIN BOT COMMANDS ───────────────────
adminBot.onText(/\/upgrade (.+)/, async (msg, match) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) return adminBot.sendMessage(msg.chat.id, '❌ Not authorized.');
  const target = match[1].trim();
  try { await pool.query('UPDATE users SET is_premium = TRUE WHERE tg_id = $1 OR tg_username = $1', [target]); adminBot.sendMessage(msg.chat.id, `✅ ${target} upgraded to Premium!`); }
  catch (err) { adminBot.sendMessage(msg.chat.id, `❌ ${err.message}`); }
});

adminBot.onText(/\/downgrade (.+)/, async (msg, match) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) return adminBot.sendMessage(msg.chat.id, '❌ Not authorized.');
  const target = match[1].trim();
  try { await pool.query('UPDATE users SET is_premium = FALSE WHERE tg_id = $1 OR tg_username = $1', [target]); adminBot.sendMessage(msg.chat.id, `✅ ${target} downgraded.`); }
  catch (err) { adminBot.sendMessage(msg.chat.id, `❌ ${err.message}`); }
});

adminBot.onText(/\/stats/, async (msg) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) return;
  try {
    const { rows: [s] } = await pool.query(`SELECT (SELECT COUNT(*) FROM users) AS u, (SELECT COUNT(*) FROM users WHERE is_premium=TRUE) AS p, (SELECT COUNT(*) FROM gigs) AS g, (SELECT COUNT(*) FROM messages) AS m, (SELECT COUNT(*) FROM escrow_contracts) AS e, (SELECT COUNT(*) FROM disputes) AS d`);
    adminBot.sendMessage(msg.chat.id, `📊 QuestWork Stats\n\n👥 Users: ${s.u}\n⭐ Premium: ${s.p}\n💼 Gigs: ${s.g}\n💬 Messages: ${s.m}\n🔒 Contracts: ${s.e}\n⚠️ Disputes: ${s.d}`);
  } catch (err) { adminBot.sendMessage(msg.chat.id, `❌ ${err.message}`); }
});

adminBot.onText(/\/resolve_dispute (\d+) (freelancer|client)/, async (msg, match) => {
  if (String(msg.from.id) !== String(process.env.ADMIN_TG_ID)) return;
  const [, disputeId, decision] = match;
  try {
    const { rows: [dispute] } = await pool.query('SELECT * FROM disputes WHERE id = $1', [disputeId]);
    if (!dispute) return adminBot.sendMessage(msg.chat.id, '❌ Dispute not found.');
    await pool.query('UPDATE disputes SET status=$1, resolution=$2, resolved_at=NOW() WHERE id=$3', ['resolved', decision, disputeId]);
    if (dispute.contract_id) await pool.query('UPDATE escrow_contracts SET status=$1 WHERE id=$2', [decision === 'freelancer' ? 'released' : 'refunded', dispute.contract_id]);
    adminBot.sendMessage(msg.chat.id, `✅ Dispute ${disputeId} resolved in favor of ${decision}.`);
    try {
      const winnerId = decision === 'freelancer' ? dispute.raised_by_tg_id : dispute.against_tg_id;
      const loserId = decision === 'freelancer' ? dispute.against_tg_id : dispute.raised_by_tg_id;
      await bot.sendMessage(winnerId, `✅ Dispute Resolved in your favor.\n\nThank you for your patience. Contact @QuestWorkSupport if you need help.`);
      await bot.sendMessage(loserId, `⚠️ Dispute Resolved. Payment decision has been made.\n\nContact @QuestWorkSupport if you have questions.`);
    } catch (_) {}
  } catch (err) { adminBot.sendMessage(msg.chat.id, `❌ ${err.message}`); }
});

// ─── START ────────────────────────────────
const PORT = process.env.PORT || 3001;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 QuestWork API running on port ${PORT}`);
    setInterval(checkAutoRelease, 60 * 60 * 1000);
    setInterval(sendDailyReminders, 24 * 60 * 60 * 1000);
    checkAutoRelease();
  });
}).catch(err => { console.error('❌ DB init failed:', err.message); process.exit(1); });