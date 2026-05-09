import { useState, useEffect } from 'react'

const LOGO_SVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="30" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 24 44)"/>
    <rect x="35" y="25" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 49 39)"/>
    <path d="M58 35 L75 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M68 18 L75 18 L75 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconHome = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)

const IconBriefcase = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12.01"/>
    <path d="M2 12h20"/>
  </svg>
)

const IconPlus = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)

const IconSearch = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconUser = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

// ── NEW: Message bell icon ──
const IconMessage = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

// ── NEW: Bookmark icon ──
const IconBookmark = ({ size = 18, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
)

const API = 'https://questwork.up.railway.app'

const SAMPLE_GIGS = [
  { id: 1, title: "Community Manager", company: "Sui Network", pay: "$800/mo", tag: "Africa", category: "Community Management", featured: true, description: "Manage and grow our Discord and Telegram communities. Engage daily with members, host AMAs, and coordinate with the core team on announcements and campaigns.", requirements: "2+ years Web3 community experience, strong communication skills, experience with Discord bots and analytics." },
  { id: 2, title: "BD Manager", company: "TON Wallet", pay: "$1,200/mo", tag: "MENA", category: "Business Development", featured: true, description: "Drive ecosystem partnerships and integrations. Identify and close deals with DeFi protocols, NFT projects, and Web3 infrastructure providers in the MENA region.", requirements: "3+ years BD in crypto, existing network of Web3 founders, ability to travel occasionally." },
  { id: 3, title: "Social Media Manager", company: "BNB Chain", pay: "$600/mo", tag: "Global", category: "Social Media", featured: false, description: "Own all social channels including Twitter, TikTok and Instagram. Create viral content, grow follower base, and coordinate campaigns with the marketing team.", requirements: "Portfolio of managed crypto accounts, experience with analytics tools, content creation skills." },
  { id: 4, title: "Web3 Writer", company: "CoinDesk", pay: "$400/mo", tag: "Remote", category: "Writing", featured: false, description: "Write 4-6 articles per week covering DeFi, NFTs, DAOs and blockchain technology. Research, interview sources, and meet deadlines consistently.", requirements: "Published writing portfolio, deep Web3 knowledge, ability to explain complex topics simply." },
  { id: 5, title: "Smart Contract Dev", company: "Aave", pay: "$3,000/mo", tag: "Global", category: "Development", featured: false, description: "Develop and audit smart contracts for Aave's lending protocol. Work closely with the security team on upgrades and new feature deployments.", requirements: "Solidity expert, 2+ years DeFi experience, security auditing background preferred." },
  { id: 6, title: "Discord Moderator", company: "Polygon", pay: "$300/mo", tag: "Africa", category: "Community Management", featured: false, description: "Moderate Polygon's Discord server with 200K+ members. Enforce community rules, support users, and escalate issues to the community team.", requirements: "Active in Web3 communities, familiar with Discord moderation tools, good English communication." },
  { id: 7, title: "Growth Hacker", company: "Arbitrum", pay: "$1,500/mo", tag: "MENA", category: "Business Development", featured: false, description: "Design and execute growth experiments to acquire new users and protocols onto Arbitrum. Own KPIs and report weekly to leadership.", requirements: "Growth marketing background, data-driven mindset, crypto-native with deep ecosystem knowledge." },
  { id: 8, title: "NFT Artist", company: "OpenSea", pay: "$2,000/mo", tag: "Global", category: "Writing", featured: false, description: "Create original NFT artwork for featured drops and collaborations. Work with partner artists and the curation team to maintain quality standards.", requirements: "Strong digital art portfolio, experience minting NFTs, knowledge of generative art tools." },
]

const haptic = (type = 'light') => {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('qw_theme') || 'light')
  const cycleTheme = () => {
    haptic('medium')
    setTheme(t => {
      const next = t === 'light' ? 'dark' : 'light'
      localStorage.setItem('qw_theme', next)
      return next
    })
  }
  return { theme, resolved: theme, cycleTheme }
}

function getLastSeen() {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const tabs = [
  { id: 'home',    label: 'Home',    Icon: IconHome },
  { id: 'gigs',    label: 'Gigs',    Icon: IconBriefcase },
  { id: 'post',    label: 'Post',    Icon: IconPlus },
  { id: 'search',  label: 'Search',  Icon: IconSearch },
  { id: 'profile', label: 'Profile', Icon: IconUser },
]

// ── NEW: Email/Password Signup Modal ──
function SignupModal({ colors, dark, onClose, onSave }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setSaving(true)
    try {
      await fetch(`${API}/api/users/backup-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
    } catch (_) {}
    localStorage.setItem('qw_backup_email', email)
    localStorage.setItem('qw_signup_done', '1')
    setSaving(false)
    haptic('heavy')
    onSave(email)
  }

  const inputStyle = { width: '100%', padding: '13px 14px', borderRadius: '12px', background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.6)', border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#1c1c1e' : '#ffffff', borderRadius: '24px', padding: '28px 24px 32px', width: '100%', maxWidth: '420px', border: `1px solid ${colors.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', boxSizing: 'border-box' }}>
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
        <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px', textAlign: 'center' }}>Set Backup Login</div>
        <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '6px', textAlign: 'center', lineHeight: 1.5 }}>
          Save your email and password in case Telegram is ever unavailable. This keeps your account safe.
        </div>
        <div style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '10px 12px', marginBottom: '20px', lineHeight: 1.5, textAlign: 'center' }}>
          🔒 Telegram ban protection — your data stays yours
        </div>
        {error && <div style={{ fontSize: '13px', color: '#ef4444', marginBottom: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password (min 6 chars)" style={inputStyle} />
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" style={{ ...inputStyle, marginBottom: '20px' }} />
        <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '15px', borderRadius: '13px', background: saving ? colors.surface2 : colors.btnBg, border: 'none', color: saving ? colors.text2 : colors.btnText, fontSize: '16px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', marginBottom: '10px' }}>
          {saving ? 'Saving...' : 'Save Backup Login'}
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '13px', background: 'none', border: 'none', color: colors.text2, fontSize: '14px', cursor: 'pointer' }}>
          Skip for now
        </button>
      </div>
    </div>
  )
}

// ── NEW: Messages Panel ──
function MessagesPanel({ colors, dark, tgUser, onClose }) {
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeThread, setActiveThread] = useState(null)
  const [newMsg, setNewMsg] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!tgUser?.id) { setLoading(false); return }
      try {
        const res = await fetch(`${API}/api/messages/threads/${tgUser.id}`)
        const data = await res.json()
        setThreads(Array.isArray(data) ? data : [])
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [tgUser])

  const openThread = async (thread) => {
    setActiveThread(thread)
    try {
      const res = await fetch(`${API}/api/messages/${tgUser.id}/${thread.other_tg_id}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (_) {}
  }

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeThread) return
    setSending(true)
    try {
      await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_tg_id: String(tgUser.id), receiver_tg_id: activeThread.other_tg_id, content: newMsg })
      })
      setMessages(prev => [...prev, { sender_tg_id: String(tgUser.id), content: newMsg, created_at: new Date().toISOString() }])
      setNewMsg('')
      haptic('light')
    } catch (_) {}
    setSending(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#1c1c1e' : '#ffffff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', border: `1px solid ${colors.border}`, boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
        {/* Panel Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeThread && (
              <button onClick={() => setActiveThread(null)} style={{ background: 'none', border: 'none', color: colors.text2, cursor: 'pointer', fontSize: '20px', padding: '0 4px' }}>‹</button>
            )}
            <div style={{ fontSize: '17px', fontWeight: '700' }}>{activeThread ? activeThread.other_name || 'Chat' : 'Messages'}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: colors.text2, cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}>×</button>
        </div>

        {/* Thread list */}
        {!activeThread && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {loading && <div style={{ textAlign: 'center', padding: '30px', color: colors.text2 }}>Loading...</div>}
            {!loading && threads.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>No messages yet</div>
                <div style={{ fontSize: '13px' }}>When someone messages you, it will appear here</div>
              </div>
            )}
            {threads.map((t, i) => (
              <div key={i} onClick={() => openThread(t)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '14px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '8px', cursor: 'pointer' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: colors.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', flexShrink: 0 }}>
                  {(t.other_name || '?')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{t.other_name || 'Unknown'}</div>
                  <div style={{ fontSize: '12px', color: colors.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.last_message || '...'}</div>
                </div>
                {t.unread_count > 0 && (
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FF5A3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>{t.unread_count}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Active thread / chat view */}
        {activeThread && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((m, i) => {
                const isMine = String(m.sender_tg_id) === String(tgUser?.id)
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMine ? colors.btnBg : colors.surface2, color: isMine ? colors.btnText : colors.text, fontSize: '14px', lineHeight: 1.5 }}>
                      {m.content}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '8px', flexShrink: 0 }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." style={{ flex: 1, padding: '11px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} />
              <button onClick={sendMessage} disabled={sending || !newMsg.trim()} style={{ padding: '11px 16px', borderRadius: '12px', background: newMsg.trim() ? colors.btnBg : colors.surface2, border: 'none', color: newMsg.trim() ? colors.btnText : colors.text2, fontSize: '14px', fontWeight: '600', cursor: newMsg.trim() ? 'pointer' : 'default' }}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── NEW: Gig Detail Modal ──
function GigDetailModal({ gig, colors, dark, tgUser, isPremium, onClose, bookmarks, toggleBookmark }) {
  const [showApply, setShowApply] = useState(false)
  const [pitch, setPitch] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [generatingPitch, setGeneratingPitch] = useState(false)
  const isBookmarked = bookmarks.includes(gig.id)

  const handleAIPitch = async () => {
    haptic('medium')
    if (!isPremium) { alert('Upgrade to Premium to use AI Pitch Writer!'); return }
    setGeneratingPitch(true)
    try {
      const res = await fetch(`${API}/api/ai/pitch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gig_title: gig.title, gig_company: gig.company, user_skills: '', user_bio: '' }) })
      const data = await res.json()
      setPitch(data.pitch)
    } catch (_) { alert('Error generating pitch.') }
    setGeneratingPitch(false)
  }

  const handleApply = async () => {
    if (!pitch.trim()) { haptic('heavy'); alert('Please write a short pitch!'); return }
    haptic('medium'); setApplying(true)
    try {
      await fetch(`${API}/api/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gig_id: gig.id, applicant_tg_id: tgUser ? String(tgUser.id) : 'unknown', applicant_username: tgUser?.username || 'unknown', pitch: `${pitch}\n\nPortfolio: ${portfolio || 'Not provided'}\n\n---\nApplied via QuestWork\nWeb3 Freelance Network | t.me/Questworkbot\nquestworkio.netlify.app` }) })
      if (gig.poster_tg_id) {
        await fetch(`${API}/api/notify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: gig.poster_tg_id, message: `New Application!\n\nGig: ${gig.title}\nFrom: @${tgUser?.username || 'someone'}\n\nhttps://questworkio.netlify.app` }) })
      }
      setApplied(true); setApplying(false); haptic('heavy')
    } catch (_) { alert('Error submitting.'); setApplying(false) }
  }

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '12px', background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.6)', border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#1c1c1e' : '#ffffff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${colors.border}`, boxShadow: '0 -10px 40px rgba(0,0,0,0.3)', padding: '24px 20px 40px' }}>
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />

        {/* Gig header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            {gig.featured && <div style={{ display: 'inline-flex', fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: colors.accentBg, color: colors.accent, marginBottom: '6px', textTransform: 'uppercase' }}>Featured</div>}
            <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.4px', marginBottom: '4px' }}>{gig.title}</div>
            <div style={{ fontSize: '15px', color: colors.text2 }}>{gig.company}</div>
          </div>
          <button onClick={() => { haptic('light'); toggleBookmark(gig.id) }} style={{ width: '40px', height: '40px', borderRadius: '12px', background: isBookmarked ? 'rgba(200,169,90,0.15)' : colors.surface2, border: `1px solid ${isBookmarked ? 'rgba(200,169,90,0.4)' : colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isBookmarked ? '#C8A95A' : colors.text2, flexShrink: 0, marginLeft: '12px' }}>
            <IconBookmark size={18} filled={isBookmarked} />
          </button>
        </div>

        {/* Pay + tag row */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{gig.pay}</div>
          <div style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '8px', background: colors.surface2, color: colors.text2, alignSelf: 'center' }}>{gig.tag || 'Global'}</div>
          <div style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '8px', background: colors.surface2, color: colors.text2, alignSelf: 'center' }}>{gig.category}</div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>About this Role</div>
          <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.7 }}>{gig.description || 'No description provided.'}</div>
        </div>

        {/* Requirements */}
        {gig.requirements && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Requirements</div>
            <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.7 }}>{gig.requirements}</div>
          </div>
        )}

        {/* Source tag for external gigs */}
        {gig.source === 'web3.career' && (
          <div style={{ fontSize: '11px', color: colors.text2, padding: '8px 12px', borderRadius: '8px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '20px', textAlign: 'center' }}>
            Listed via <strong>web3.career</strong> — Apply on their platform
          </div>
        )}

        {/* Apply section */}
        {!applied ? (
          <>
            {!showApply ? (
              <button onClick={() => { haptic('medium'); gig.source === 'web3.career' ? window.open(gig.apply_url, '_blank') : setShowApply(true) }} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                {gig.source === 'web3.career' ? 'Apply on web3.career ↗' : 'Apply Now'}
              </button>
            ) : (
              <div>
                {tgUser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>{tgUser.first_name?.[0]}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{tgUser.first_name} {tgUser.last_name || ''}</div>
                      <div style={{ fontSize: '11px', color: colors.text2 }}>@{tgUser.username || 'user'}</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Pitch</div>
                  <button onClick={handleAIPitch} disabled={generatingPitch} style={{ padding: '4px 10px', borderRadius: '8px', background: isPremium ? colors.accentBg : 'rgba(0,0,0,0.06)', border: `1px solid ${colors.border}`, color: isPremium ? colors.accent : colors.text2, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                    {generatingPitch ? 'Writing...' : isPremium ? 'AI Write ✦' : 'AI Write (Premium)'}
                  </button>
                </div>
                <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder="Tell them why you're the perfect fit..." style={{ ...inputStyle, height: '100px', resize: 'none', marginBottom: '10px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Portfolio / LinkedIn URL</div>
                <input type="text" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://your-portfolio.com" style={{ ...inputStyle, marginBottom: '14px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowApply(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleApply} disabled={applying} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: applying ? colors.surface2 : colors.btnBg, border: 'none', color: applying ? colors.text2 : colors.btnText, fontSize: '15px', fontWeight: '700', cursor: applying ? 'not-allowed' : 'pointer' }}>{applying ? 'Submitting...' : 'Submit'}</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px', borderRadius: '14px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '16px', fontWeight: '600' }}>
            ✓ Application Submitted!
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const { theme, resolved, cycleTheme } = useTheme()
  const [active, setActive] = useState('home')
  const [animating, setAnimating] = useState(false)
  const [tgUser, setTgUser] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(() => localStorage.getItem('qw_notifications') !== 'off')
  const dark = resolved === 'dark'

  // ── NEW state ──
  const [showMessages, setShowMessages] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showSignup, setShowSignup] = useState(false)
  const [backupEmail, setBackupEmail] = useState(() => localStorage.getItem('qw_backup_email') || '')
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qw_bookmarks') || '[]') } catch { return [] }
  })
  const [selectedGig, setSelectedGig] = useState(null)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.disableVerticalSwipes()
    }
    document.body.style.margin = '0'
    document.body.style.padding = '0'
    document.documentElement.style.margin = '0'
    document.documentElement.style.padding = '0'

    const user = window.Telegram?.WebApp?.initDataUnsafe?.user
    const userId = String(user?.id || '')
    if (user) {
      setTgUser(user)
      fetch(`${API}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tg_id: userId, tg_username: user.username || '', first_name: user.first_name || '', last_name: user.last_name || '' })
      })
      fetch(`${API}/api/users/${userId}`)
        .then(r => r.json())
        .then(data => { if (data?.is_premium) setIsPremium(true) })
        .catch(() => {})

      // ── NEW: Show signup modal for first-time users after 2s ──
      if (!localStorage.getItem('qw_signup_done')) {
        setTimeout(() => setShowSignup(true), 2000)
      }

      // ── NEW: Poll unread message count ──
      const pollUnread = async () => {
        try {
          const res = await fetch(`${API}/api/messages/unread/${userId}`)
          const data = await res.json()
          setUnreadCount(data.count || 0)
        } catch (_) {}
      }
      pollUnread()
      const unreadInterval = setInterval(pollUnread, 30000)
      return () => clearInterval(unreadInterval)
    }
  }, [])

  useEffect(() => {
    document.body.style.backgroundColor = dark ? '#000000' : '#F2F2F7'
    document.documentElement.style.backgroundColor = dark ? '#000000' : '#F2F2F7'
  }, [dark])

  // ── NEW: bookmark toggle ──
  const toggleBookmark = (gigId) => {
    haptic('medium')
    setBookmarks(prev => {
      const next = prev.includes(gigId) ? prev.filter(id => id !== gigId) : [...prev, gigId]
      localStorage.setItem('qw_bookmarks', JSON.stringify(next))
      return next
    })
  }

  const colors = {
    bg: dark ? '#000000' : '#F2F2F7',
    surface2: dark ? 'rgba(44,44,46,0.8)' : 'rgba(210,210,215,0.8)',
    border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#FFFFFF' : '#000000',
    text2: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    accent: dark ? '#FFFFFF' : '#000000',
    accentBg: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    accentBorder: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    navBg: dark ? 'rgba(18,18,18,0.97)' : 'rgba(255,255,255,0.97)',
    card: dark ? 'rgba(28,28,30,1)' : 'rgba(255,255,255,1)',
    btnText: dark ? '#000000' : '#FFFFFF',
    btnBg: dark ? '#FFFFFF' : '#000000',
    green: '#34d399',
  }

  const navigate = (tab) => {
    if (tab === active) return
    haptic('light')
    setAnimating(true)
    setTimeout(() => { setActive(tab); setAnimating(false) }, 150)
  }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, color: colors.text, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', WebkitFontSmoothing: 'antialiased', position: 'relative', overflowX: 'hidden', transition: 'background-color 0.3s ease, color 0.3s ease', boxSizing: 'border-box' }}>

      {/* ── UPDATED Header — message icon replaces theme toggle ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '16px 20px 12px', background: dark ? 'rgba(0,0,0,0.92)' : 'rgba(242,242,247,0.92)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: colors.text }}><LOGO_SVG /></div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1 }}>QuestWork</div>
            <div style={{ fontSize: '9px', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>Freelance Network</div>
          </div>
        </div>
        {/* Message icon with red badge */}
        <button onClick={() => { haptic('light'); setShowMessages(true) }} style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', background: colors.surface2, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.text }}>
          <IconMessage size={20} />
          {unreadCount > 0 && (
            <div style={{ position: 'absolute', top: '1px', right: '1px', width: '16px', height: '16px', borderRadius: '50%', background: '#FF5A3C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', color: '#fff', border: `2px solid ${dark ? '#000' : '#F2F2F7'}` }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Page content */}
      <div style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.15s ease, transform 0.15s ease', paddingBottom: '80px', position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
        {active === 'home'    && <HomePage    colors={colors} dark={dark} navigate={navigate} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig} />}
        {active === 'gigs'    && <GigsPage    colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig} />}
        {active === 'post'    && <PostPage    colors={colors} dark={dark} tgUser={tgUser} />}
        {active === 'search'  && <SearchPage  colors={colors} dark={dark} tgUser={tgUser} />}
        {active === 'profile' && <ProfilePage colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} setIsPremium={setIsPremium} notificationsOn={notificationsOn} setNotificationsOn={(val) => { setNotificationsOn(val); localStorage.setItem('qw_notifications', val ? 'on' : 'off') }} cycleTheme={cycleTheme} theme={theme} bookmarks={bookmarks} backupEmail={backupEmail} setShowSignup={setShowSignup} />}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: colors.navBg, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 24px 0', width: '100vw', boxSizing: 'border-box' }}>
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={() => navigate(id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? colors.accent : colors.text2, padding: '4px 12px', borderRadius: '12px', transition: 'all 0.2s ease', transform: isActive ? 'scale(1.08)' : 'scale(1)' }}>
              <Icon size={22} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '400', letterSpacing: '0.02em' }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* ── NEW: Messages Panel ── */}
      {showMessages && (
        <MessagesPanel colors={colors} dark={dark} tgUser={tgUser} onClose={() => setShowMessages(false)} />
      )}

      {/* ── NEW: Signup Modal (first time) ── */}
      {showSignup && (
        <SignupModal
          colors={colors}
          dark={dark}
          onClose={() => setShowSignup(false)}
          onSave={(email) => { setBackupEmail(email); setShowSignup(false) }}
        />
      )}

      {/* ── NEW: Gig Detail Modal ── */}
      {selectedGig && (
        <GigDetailModal
          gig={selectedGig}
          colors={colors}
          dark={dark}
          tgUser={tgUser}
          isPremium={isPremium}
          onClose={() => setSelectedGig(null)}
          bookmarks={bookmarks}
          toggleBookmark={toggleBookmark}
        />
      )}
    </div>
  )
}

// ── GigCard updated: tap = detail modal, no inline apply modal anymore ──
function GigCard({ gig, colors, dark, tgUser, isPremium, bookmarks, toggleBookmark, setSelectedGig }) {
  const [pressed, setPressed] = useState(false)
  const isBookmarked = bookmarks?.includes(gig.id)

  return (
    <div
      onMouseDown={() => { setPressed(true); haptic('light') }}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => { setPressed(true); haptic('light') }}
      onTouchEnd={() => setPressed(false)}
      onClick={() => setSelectedGig(gig)}
      style={{ background: colors.card, border: `1px solid ${gig.featured ? colors.accentBorder : colors.border}`, borderRadius: '18px', padding: '16px', boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform 0.15s ease', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          {gig.featured && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '6px', background: colors.accentBg, color: colors.accent, marginBottom: '7px', textTransform: 'uppercase' }}>Featured</div>}
          <div style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.3px', marginBottom: '3px' }}>{gig.title}</div>
          <div style={{ fontSize: '13px', color: colors.text2 }}>{gig.company}</div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700' }}>{gig.pay || gig.pay_usdt}</div>
          <div style={{ fontSize: '11px', marginTop: '4px', padding: '2px 8px', borderRadius: '6px', background: colors.surface2, color: colors.text2, display: 'inline-block' }}>{gig.tag || gig.region || 'Global'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: colors.surface2, color: colors.text2, fontWeight: '500' }}>{gig.category}</div>
        {/* Bookmark button */}
        <button onClick={e => { e.stopPropagation(); toggleBookmark && toggleBookmark(gig.id) }} style={{ marginLeft: 'auto', width: '34px', height: '34px', borderRadius: '10px', background: isBookmarked ? 'rgba(200,169,90,0.15)' : colors.surface2, border: `1px solid ${isBookmarked ? 'rgba(200,169,90,0.4)' : colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isBookmarked ? '#C8A95A' : colors.text2 }}>
          <IconBookmark size={15} filled={isBookmarked} />
        </button>
        <button onClick={e => { e.stopPropagation(); setSelectedGig(gig) }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}>
          View & Apply
        </button>
      </div>
    </div>
  )
}

function HomePage({ colors, dark, navigate, tgUser, isPremium, bookmarks, toggleBookmark, setSelectedGig }) {
  const [search, setSearch] = useState('')
  const [filteredGigs, setFilteredGigs] = useState(SAMPLE_GIGS)

  const handleSearch = (value) => {
    setSearch(value)
    if (!value.trim()) { setFilteredGigs(SAMPLE_GIGS); return }
    const lower = value.toLowerCase()
    setFilteredGigs(SAMPLE_GIGS.filter(g =>
      g.title.toLowerCase().includes(lower) ||
      g.company.toLowerCase().includes(lower) ||
      g.category.toLowerCase().includes(lower) ||
      (g.tag || '').toLowerCase().includes(lower)
    ))
  }

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '6px' }}>Good day, {tgUser?.first_name || 'there'} 👋</div>
        <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: '6px' }}>Find your next<br /><span style={{ color: colors.accent }}>Web3 Quest</span></div>
        <div style={{ fontSize: '14px', color: colors.text2 }}>Global gigs. Crypto payments. Zero friction.</div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', borderRadius: '14px', background: colors.surface2, border: `1px solid ${colors.border}` }}>
          <IconSearch size={16} />
          <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search gigs, skills, companies..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: colors.text, fontSize: '14px', fontFamily: 'inherit' }} />
          {search && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: colors.text2, fontSize: '16px', cursor: 'pointer', padding: 0 }}>×</button>}
        </div>
      </div>
      {search ? (
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '14px' }}>{filteredGigs.length} result{filteredGigs.length !== 1 ? 's' : ''} for "{search}"</div>
          {filteredGigs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>No gigs found</div>
              <div style={{ fontSize: '13px' }}>Try different keywords</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredGigs.map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig} />)}
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[{ value: '120+', label: 'Active Gigs', icon: <IconBriefcase size={18}/> }, { value: '500+', label: 'Freelancers', icon: <IconUser size={18}/> }, { value: '$50K+', label: 'Paid Out', icon: <IconPlus size={18}/> }].map((s, i) => (
                <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '14px 10px', textAlign: 'center', boxShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: colors.text2 }}>{s.icon}</div>
                  <div style={{ fontSize: '17px', fontWeight: '700' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: colors.text2, marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>Categories</div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['All', 'Community', 'BD', 'Dev', 'Social', 'Writing'].map((cat, i) => (
                <button key={cat} onClick={() => haptic('light')} style={{ padding: '7px 14px', borderRadius: '20px', whiteSpace: 'nowrap', background: i === 0 ? colors.btnBg : colors.surface2, border: `1px solid ${i === 0 ? colors.btnBg : colors.border}`, color: i === 0 ? colors.btnText : colors.text, fontSize: '13px', fontWeight: i === 0 ? '600' : '400', cursor: 'pointer' }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Featured</div>
              <button onClick={() => { haptic('light'); navigate('gigs') }} style={{ fontSize: '13px', color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>See all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SAMPLE_GIGS.filter(g => g.featured).map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig} />)}
            </div>
          </div>
          <div style={{ padding: '24px 20px 0' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>Latest Gigs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SAMPLE_GIGS.filter(g => !g.featured).map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig} />)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function GigsPage({ colors, dark, tgUser, isPremium, bookmarks, toggleBookmark, setSelectedGig }) {
  const [filter, setFilter] = useState('All')
  const [dbGigs, setDbGigs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGigs = async () => {
      try {
        const res = await fetch(`${API}/api/gigs`)
        const data = await res.json()
        setDbGigs(data)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    loadGigs()
  }, [])

  const allGigs = [...dbGigs, ...SAMPLE_GIGS]
  const categories = ['All', 'Community Management', 'Business Development', 'Development', 'Social Media', 'Writing']
  const filtered = filter === 'All' ? allGigs : allGigs.filter(g => g.category === filter)

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '20px' }}>All Gigs</div>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px' }}>
        {['All', 'Community', 'BD', 'Dev', 'Social', 'Writing'].map((cat, i) => (
          <button key={cat} onClick={() => { haptic('light'); setFilter(i === 0 ? 'All' : categories[i]) }} style={{ padding: '7px 14px', borderRadius: '20px', whiteSpace: 'nowrap', background: filter === (i === 0 ? 'All' : categories[i]) ? colors.btnBg : colors.surface2, border: `1px solid ${filter === (i === 0 ? 'All' : categories[i]) ? colors.btnBg : colors.border}`, color: filter === (i === 0 ? 'All' : categories[i]) ? colors.btnText : colors.text, fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>{cat}</button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.text2 }}>Loading gigs...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig} />)}
        </div>
      )}
    </div>
  )
}

function PostPage({ colors, dark, tgUser }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Community Management', description: '', pay_usdt: '', duration: '1 Month', region: 'Global' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAIDescription = async () => {
    haptic('medium')
    if (!form.title) { alert('Please enter a role title first!'); return }
    setGeneratingDesc(true)
    try {
      const res = await fetch(`${API}/api/ai/gig`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basic_info: `${form.title} at a Web3 company, budget: ${form.pay_usdt || 'negotiable'}, duration: ${form.duration}, region: ${form.region}` }) })
      const data = await res.json()
      setForm({ ...form, description: data.description })
      haptic('heavy')
    } catch (err) { alert('Error generating description.') }
    setGeneratingDesc(false)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.pay_usdt) { haptic('heavy'); alert('Please fill in all required fields!'); return }
    haptic('medium'); setLoading(true)
    const finalCategory = form.category === 'Other' ? customCategory : form.category
    try {
      await fetch(`${API}/api/gigs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, category: finalCategory, poster_tg_id: tgUser ? String(tgUser.id) : null, poster_username: tgUser?.username || null }) })
      haptic('heavy'); setSuccess(true)
      setForm({ title: '', category: 'Community Management', description: '', pay_usdt: '', duration: '1 Month', region: 'Global' })
      setCustomCategory('')
    } catch (err) { alert('Error saving gig.') }
    setLoading(false)
  }

  const input = { width: '100%', padding: '13px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>Post a Gig</div>
      <div style={{ fontSize: '14px', color: colors.text2, marginBottom: '24px' }}>Find the perfect Web3 talent</div>
      {success && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px', color: '#34d399', fontSize: '14px', textAlign: 'center' }}>Gig posted successfully!</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Role Title *</div>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Community Manager" style={input} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Category</div>
          <select name="category" value={form.category} onChange={handleChange} style={{ ...input, appearance: 'none' }}>
            <option>Community Management</option><option>Business Development</option><option>Development</option><option>Social Media</option><option>Writing</option><option>Other</option>
          </select>
          {form.category === 'Other' && <input value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="Type your category..." style={{ ...input, marginTop: '10px' }} />}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Description *</div>
            <button onClick={handleAIDescription} disabled={generatingDesc} style={{ padding: '4px 10px', borderRadius: '8px', background: colors.accentBg, border: `1px solid ${colors.accentBorder}`, color: colors.accent, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>{generatingDesc ? 'Writing...' : 'AI Generate (Free)'}</button>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role or tap AI Generate..." style={{ ...input, height: '100px', resize: 'none' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Budget (USDT) *</div>
            <input name="pay_usdt" value={form.pay_usdt} onChange={handleChange} type="text" placeholder="500 or Negotiable" style={input} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Duration</div>
            <select name="duration" value={form.duration} onChange={handleChange} style={{ ...input, appearance: 'none' }}>
              <option>1 Week</option><option>1 Month</option><option>3 Months</option><option>Ongoing</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Region</div>
          <select name="region" value={form.region} onChange={handleChange} style={{ ...input, appearance: 'none' }}>
            <option>Global</option><option>Africa</option><option>MENA</option><option>Remote</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '14px', marginTop: '8px', background: loading ? colors.surface2 : colors.btnBg, border: 'none', color: loading ? colors.text2 : colors.btnText, fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Posting...' : 'Post Gig'}</button>
      </div>
    </div>
  )
}

function SearchPage({ colors, dark, tgUser }) {
  const [mode, setMode] = useState('gigs')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const searchGigs = (value) => {
    if (!value.trim()) { setResults([]); return }
    const lower = value.toLowerCase()
    setResults(SAMPLE_GIGS.filter(g =>
      g.title.toLowerCase().includes(lower) ||
      g.company.toLowerCase().includes(lower) ||
      g.category.toLowerCase().includes(lower) ||
      (g.tag || '').toLowerCase().includes(lower)
    ))
  }

  const searchUsers = async (value) => {
    if (!value.trim()) { setUsers([]); return }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/users/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleSearch = (value) => {
    setQuery(value)
    if (mode === 'gigs') searchGigs(value)
    else searchUsers(value)
  }

  const handleModeSwitch = (newMode) => {
    haptic('light'); setMode(newMode); setQuery(''); setResults([]); setUsers([])
  }

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>Search</div>
      <div style={{ fontSize: '14px', color: colors.text2, marginBottom: '20px' }}>Find gigs or freelancers</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['gigs', 'users'].map(m => (
          <button key={m} onClick={() => handleModeSwitch(m)} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: mode === m ? colors.btnBg : colors.surface2, border: `1px solid ${mode === m ? colors.btnBg : colors.border}`, color: mode === m ? colors.btnText : colors.text2, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            {m === 'gigs' ? 'Gigs' : 'Freelancers'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', borderRadius: '14px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '20px' }}>
        <IconSearch size={16} />
        <input value={query} onChange={e => handleSearch(e.target.value)} placeholder={mode === 'gigs' ? 'Search gigs, companies, categories...' : 'Search by name or username...'} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: colors.text, fontSize: '14px', fontFamily: 'inherit' }} />
        {query && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: colors.text2, fontSize: '16px', cursor: 'pointer', padding: 0 }}>×</button>}
      </div>
      {!query && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>{mode === 'gigs' ? 'Search Web3 Gigs' : 'Find Freelancers'}</div>
          <div style={{ fontSize: '13px' }}>{mode === 'gigs' ? 'Search by title, company or category' : 'Search by name or username'}</div>
        </div>
      )}
      {loading && <div style={{ textAlign: 'center', padding: '30px', color: colors.text2 }}>Searching...</div>}
      {mode === 'gigs' && query && !loading && (
        <div>
          <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '14px' }}>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</div>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>No gigs found</div>
              <div style={{ fontSize: '13px' }}>Try different keywords</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} isPremium={false} bookmarks={[]} toggleBookmark={() => {}} setSelectedGig={() => {}} />)}
            </div>
          )}
        </div>
      )}
      {mode === 'users' && query && !loading && (
        <div>
          <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '14px' }}>{users.length} freelancer{users.length !== 1 ? 's' : ''} found</div>
          {users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>No freelancers found</div>
              <div style={{ fontSize: '13px' }}>Try a different name or username</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {users.map((user, i) => (
                <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: colors.accentBg, border: `1px solid ${colors.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', flexShrink: 0 }}>{user.first_name?.[0] || '?'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>{user.first_name} {user.last_name || ''}</div>
                    <div style={{ fontSize: '13px', color: colors.text2 }}>@{user.tg_username || 'unknown'}</div>
                  </div>
                  <button onClick={() => { haptic('light'); window.open(`https://t.me/${user.tg_username}`, '_blank') }} style={{ padding: '8px 14px', borderRadius: '10px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Message</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ApplicationsReceived({ colors, dark, tgUser }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!tgUser?.id) { setLoading(false); return }
      try {
        const res = await fetch(`${API}/api/applications/received/${tgUser.id}`)
        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    load()
  }, [tgUser])

  if (loading) return <div style={{ textAlign: 'center', padding: '30px', color: colors.text2 }}>Loading applications...</div>
  if (applications.length === 0) return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}>
      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>No applications yet</div>
      <div style={{ fontSize: '13px' }}>When someone applies to your gigs, they will appear here</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {applications.map((app, i) => (
        <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '3px' }}>{app.gig_title || 'Gig Application'}</div>
              <div style={{ fontSize: '13px', color: colors.text2 }}>@{app.applicant_username || 'unknown'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', fontWeight: '600', textTransform: 'uppercase' }}>{app.status || 'Pending'}</div>
              <span style={{ color: colors.text2, fontSize: '16px' }}>{expanded === i ? '−' : '+'}</span>
            </div>
          </div>
          {expanded === i && (
            <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', marginTop: '14px' }}>Pitch</div>
              <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{app.pitch || 'No pitch provided'}</div>
              <button onClick={() => { haptic('medium'); window.open(`https://t.me/${app.applicant_username}`, '_blank') }} style={{ width: '100%', marginTop: '14px', padding: '11px', borderRadius: '12px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Message Applicant</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ProfilePage({ colors, dark, tgUser, isPremium, setIsPremium, notificationsOn, setNotificationsOn, cycleTheme, theme, bookmarks, backupEmail, setShowSignup }) {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [dropinInstance, setDropinInstance] = useState(null)

  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(() => localStorage.getItem('qw_bio') || '')
  const [skills, setSkills] = useState(() => localStorage.getItem('qw_skills') || '')
  const [availability, setAvailability] = useState(() => localStorage.getItem('qw_availability') || 'Available')
  const [savedBio, setSavedBio] = useState(() => localStorage.getItem('qw_bio') || '')
  const [savedSkills, setSavedSkills] = useState(() => localStorage.getItem('qw_skills') || '')
  const [savedAvailability, setSavedAvailability] = useState(() => localStorage.getItem('qw_availability') || 'Available')
  const [saved, setSaved] = useState(false)

  const [activeTab, setActiveTab] = useState('profile')
  const [lastSeen] = useState(getLastSeen())

  useEffect(() => {
    if (showPayment && paymentMethod === 'card') {
      const initDropin = async () => {
        try {
          if (dropinInstance) { await dropinInstance.teardown(); setDropinInstance(null) }
          const tokenRes = await fetch(`${API}/api/braintree/token`)
          const { token } = await tokenRes.json()
          const instance = await window.braintree.dropin.create({ authorization: token, container: '#dropin-container' })
          setDropinInstance(instance)
        } catch (err) { console.error('Dropin init error:', err) }
      }
      setTimeout(initDropin, 300)
    }
  }, [showPayment, paymentMethod])

  const handleSave = () => {
    haptic('heavy')
    localStorage.setItem('qw_bio', bio)
    localStorage.setItem('qw_skills', skills)
    localStorage.setItem('qw_availability', availability)
    setSavedBio(bio); setSavedSkills(skills); setSavedAvailability(availability)
    setSaved(true); setIsEditing(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleEdit = () => { haptic('light'); setBio(savedBio); setSkills(savedSkills); setAvailability(savedAvailability); setIsEditing(true) }
  const handleCancel = () => { haptic('light'); setBio(savedBio); setSkills(savedSkills); setAvailability(savedAvailability); setIsEditing(false) }

  const displayName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Guest'
  const displayUsername = tgUser?.username || 'guest'

  // ── Bookmarked gigs for display ──
  const bookmarkedGigs = SAMPLE_GIGS.filter(g => bookmarks?.includes(g.id))

  const sections = [
    { title: 'Preferences', items: [
      { label: 'Appearance', value: theme === 'dark' ? 'Dark' : 'Light', arrow: true, action: () => cycleTheme() },
      { label: 'Notifications', value: notificationsOn ? 'On' : 'Off', arrow: true, action: () => setNotificationsOn(!notificationsOn) },
    ]},
    { title: 'Help', items: [
      { label: 'Support', value: '', arrow: true, action: () => { haptic('light'); window.open('https://t.me/QuestWorkSupport') } },
      { label: 'Information', value: '', arrow: true },
      { label: 'Privacy Policy', value: '', arrow: true },
      { label: 'Terms & Conditions', value: '', arrow: true },
    ]},
    { title: 'QuestWork Social', items: [
      { label: 'Instagram', value: '@questwork.io', arrow: true, action: () => { haptic('light'); window.open('https://www.instagram.com/questwork.io') } },
    ]}
  ]

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>

      {/* Profile Card */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          {tgUser?.photo_url ? (
            <img src={tgUser.photo_url} style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${colors.border}`, objectFit: 'cover', flexShrink: 0 }} alt="avatar" />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', flexShrink: 0, border: `2px solid ${colors.border}` }}>{tgUser ? tgUser.first_name?.[0] : '?'}</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>{displayName}</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginTop: '2px' }}>@{displayUsername}</div>
            <div style={{ fontSize: '11px', color: colors.text2, marginTop: '2px' }}>Active at {lastSeen}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: isPremium ? 'rgba(245,200,66,0.15)' : colors.accentBg, color: isPremium ? '#F5C842' : colors.accent, fontWeight: '600', border: `1px solid ${isPremium ? 'rgba(245,200,66,0.3)' : colors.accentBorder}` }}>
                {isPremium ? '⭐ Premium' : 'Free Plan'}
              </div>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: savedAvailability === 'Available' ? 'rgba(52,211,153,0.1)' : colors.surface2, color: savedAvailability === 'Available' ? '#34d399' : colors.text2, fontWeight: '500', border: `1px solid ${savedAvailability === 'Available' ? 'rgba(52,211,153,0.3)' : colors.border}` }}>
                {savedAvailability}
              </div>
            </div>
          </div>
        </div>

        {/* ── NEW: Backup email display ── */}
        {backupEmail ? (
          <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Backup Login</div>
              <div style={{ fontSize: '13px', color: colors.text, marginTop: '1px' }}>{backupEmail}</div>
            </div>
            <div style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>✓ Set</div>
          </div>
        ) : (
          <button onClick={() => setShowSignup(true)} style={{ width: '100%', padding: '11px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px', textAlign: 'center' }}>
            ⚠️ Set Backup Login (Telegram Ban Protection)
          </button>
        )}

        {savedBio && !isEditing && (
          <div style={{ marginBottom: '10px', padding: '10px 12px', borderRadius: '10px', background: colors.surface2, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>About</div>
            <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5 }}>{savedBio}</div>
          </div>
        )}

        {savedSkills && !isEditing && (
          <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {savedSkills.split(',').map((s, i) => (
              <div key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: colors.accentBg, border: `1px solid ${colors.accentBorder}`, color: colors.accent, fontWeight: '500' }}>{s.trim()}</div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['profile', 'bookmarks', 'applications'].map(tab => (
            <button key={tab} onClick={() => { haptic('light'); setActiveTab(tab); if (tab !== 'profile') setIsEditing(false) }} style={{ flex: 1, padding: '9px 4px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', background: activeTab === tab ? colors.btnBg : colors.surface2, border: `1px solid ${activeTab === tab ? colors.btnBg : colors.border}`, color: activeTab === tab ? colors.btnText : colors.text2, cursor: 'pointer' }}>
              {tab === 'applications' ? 'Applied' : tab === 'bookmarks' ? `Saved ${bookmarks?.length > 0 ? `(${bookmarks.length})` : ''}` : 'Profile'}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <>
            {!isEditing ? (
              <div>
                {!savedBio && !savedSkills && (
                  <div style={{ textAlign: 'center', padding: '12px 0 8px', color: colors.text2 }}>
                    <div style={{ fontSize: '13px' }}>No profile info yet. Tap Edit Profile to get started.</div>
                  </div>
                )}
                {saved && (
                  <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>✓ Profile saved!</div>
                )}
                <button onClick={handleEdit} style={{ width: '100%', padding: '13px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>✏️ Edit Profile</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Availability</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Available', 'Busy', 'Open to Offers'].map(a => (
                      <button key={a} onClick={() => { haptic('light'); setAvailability(a) }} style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', background: availability === a ? colors.btnBg : colors.surface2, border: `1px solid ${availability === a ? colors.btnBg : colors.border}`, color: availability === a ? colors.btnText : colors.text2, cursor: 'pointer' }}>{a}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>About Me</div>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell clients about yourself..." style={{ width: '100%', height: '80px', padding: '12px 14px', borderRadius: '12px', resize: 'none', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Skills (comma separated)</div>
                  <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Community Management, BD, Writing..." style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCancel} style={{ flex: 1, padding: '13px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleSave} style={{ flex: 2, padding: '13px', borderRadius: '12px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Save Profile</button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── NEW: Bookmarks tab ── */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedGigs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: colors.text2 }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔖</div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>No saved gigs yet</div>
                <div style={{ fontSize: '13px' }}>Tap the bookmark icon on any gig to save it here</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {bookmarkedGigs.map(gig => (
                  <div key={gig.id} style={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>{gig.title}</div>
                      <div style={{ fontSize: '12px', color: colors.text2 }}>{gig.company} · {gig.pay}</div>
                    </div>
                    <div style={{ color: '#C8A95A' }}><IconBookmark size={16} filled /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && <ApplicationsReceived colors={colors} dark={dark} tgUser={tgUser} />}
      </div>

      {/* Stats */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
        {[{ label: 'QuestScore', value: '0' }, { label: 'Applications Sent', value: '0' }, { label: 'Gigs Completed', value: '0' }, { label: 'Total Earned', value: '$0 USDT' }].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
            <span style={{ flex: 1, fontSize: '14px', color: colors.text2 }}>{item.label}</span>
            <span style={{ fontSize: '16px', fontWeight: '700' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Upgrade banner */}
      {!isPremium && (
        <div onClick={() => { haptic('medium'); setShowPayment(true) }} style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${colors.accentBorder}`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>Upgrade to Premium</div>
            <div style={{ fontSize: '12px', color: colors.text2, marginTop: '2px' }}>AI features, priority visibility and more</div>
          </div>
          <div style={{ background: colors.btnBg, color: colors.btnText, fontSize: '12px', fontWeight: '700', padding: '8px 14px', borderRadius: '10px' }}>$15/mo</div>
        </div>
      )}

      {/* Digital Products */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>Digital Products</div>
            <div style={{ fontSize: '12px', color: colors.text2, marginTop: '3px' }}>Courses, guides and more</div>
          </div>
          <div style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Coming Soon</div>
        </div>
      </div>

      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '4px' }}>{section.title}</div>
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
            {section.items.map((item, ii) => (
              <div key={ii} onClick={() => { if (item.action) { haptic('light'); item.action() } }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: ii < section.items.length - 1 ? `1px solid ${colors.border}` : 'none', cursor: item.action ? 'pointer' : 'default' }}>
                <span style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{item.label}</span>
                {item.value && <span style={{ fontSize: '13px', color: item.label === 'Notifications' ? (notificationsOn ? '#34d399' : colors.text2) : colors.text2 }}>{item.value}</span>}
                {item.arrow && <span style={{ fontSize: '16px', color: colors.text2 }}>›</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '4px' }}>
        <div style={{ fontSize: '12px', color: colors.text2 }}>QuestWork v1.0.0</div>
        <div style={{ fontSize: '11px', color: colors.text2, marginTop: '2px', opacity: 0.6 }}>Web3 Freelance Network</div>
      </div>

      {/* ── NEW: Founder Section ── */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '20px', marginTop: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>Meet the Founder</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(200,169,90,0.3), rgba(200,169,90,0.1))', border: '2px solid rgba(200,169,90,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: '#C8A95A', flexShrink: 0 }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>Al-amin Abdullahi</div>
            <div style={{ fontSize: '12px', color: colors.text2 }}>Founder & CEO, QuestWork</div>
            <div style={{ fontSize: '12px', color: '#C8A95A', marginTop: '2px' }}>@TheCryptoQuestHub</div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: colors.text2, lineHeight: 1.7, marginBottom: '14px' }}>
          Building the on-chain talent economy for Web3 professionals across Africa and beyond. QuestWork is my mission to ensure your reputation travels with you — forever.
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { haptic('light'); window.open('https://t.me/TheCryptoQuestHub', '_blank') }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Telegram</button>
          <button onClick={() => { haptic('light'); window.open('https://twitter.com/TheCryptoQuestHub', '_blank') }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Twitter / X</button>
          <button onClick={() => { haptic('light'); window.open('https://instagram.com/questwork.io', '_blank') }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Instagram</button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div onClick={() => { haptic('light'); setShowPayment(false) }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#1c1c1e' : '#ffffff', borderRadius: '24px', padding: '28px 24px 32px', width: '100%', maxWidth: '420px', border: `1px solid ${colors.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', textAlign: 'center' }}>Go Premium</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '24px', textAlign: 'center' }}>$15/month · Cancel anytime</div>
            <div style={{ background: colors.surface2, borderRadius: '14px', padding: '14px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
              {['AI Pitch Writer', 'Priority Visibility', 'Premium Badge', 'Advanced Analytics', 'AI Job Matching', 'Direct Client Invites', 'Resume Builder', 'Custom Profile URL', 'Unlimited Applications'].map((f, i, arr) => (
                <div key={i} style={{ fontSize: '13px', padding: '6px 0', borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none', color: colors.text }}>{f}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['card', 'usdt'].map(m => (
                <button key={m} onClick={() => setPaymentMethod(m)} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: paymentMethod === m ? colors.btnBg : colors.surface2, border: `1px solid ${paymentMethod === m ? colors.btnBg : colors.border}`, color: paymentMethod === m ? colors.btnText : colors.text2, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  {m === 'card' ? 'Credit Card' : 'USDT'}
                </button>
              ))}
            </div>
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div id="dropin-container"></div>
                {paymentError && <div style={{ fontSize: '13px', color: '#ef4444', padding: '10px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{paymentError}</div>}
                <button onClick={async () => {
                  if (!dropinInstance) { setPaymentError('Payment form not ready.'); return }
                  setProcessing(true); setPaymentError('')
                  try {
                    const payload = await dropinInstance.requestPaymentMethod()
                    const res = await fetch(`${API}/api/braintree/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentMethodNonce: payload.nonce, tg_id: tgUser ? String(tgUser.id) : null }) })
                    const data = await res.json()
                    if (data.success) { setIsPremium(true); setShowPayment(false); alert('Welcome to Premium!') }
                    else setPaymentError(data.error || 'Payment failed.')
                  } catch (_) { setPaymentError('Payment failed. Check your card.') }
                  setProcessing(false)
                }} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: processing ? colors.surface2 : '#F5C842', border: 'none', color: '#000000', fontSize: '16px', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer' }}>
                  {processing ? 'Processing...' : 'Pay $15/month'}
                </button>
                <div style={{ fontSize: '11px', color: colors.text2, textAlign: 'center' }}>Secured by Braintree · Cancel anytime</div>
              </div>
            )}
            {paymentMethod === 'usdt' && (
              <div>
                <div style={{ background: colors.surface2, borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Send $15 USDT (TRC20) to:</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: colors.text, wordBreak: 'break-all', lineHeight: 1.6 }}>THXAwQnQ22bjq3C862C4yejXcFeEZ8dcJW</div>
                  <button onClick={() => { haptic('medium'); navigator.clipboard.writeText('THXAwQnQ22bjq3C862C4yejXcFeEZ8dcJW'); alert('Address copied!') }} style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '10px', cursor: 'pointer', background: colors.accentBg, border: `1px solid ${colors.accentBorder}`, color: colors.accent, fontSize: '13px', fontWeight: '600' }}>Copy Address</button>
                </div>
                <div style={{ background: colors.surface2, borderRadius: '14px', padding: '14px', marginBottom: '16px', border: `1px solid ${colors.border}`, fontSize: '12px', color: colors.text2, lineHeight: 1.6 }}>
                  After sending, DM @QuestWorkSupport with your transaction hash to activate Premium instantly.
                </div>
                <button onClick={() => { haptic('medium'); window.open('https://t.me/QuestWorkSupport', '_blank'); setShowPayment(false) }} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>I have Sent Payment</button>
              </div>
            )}
            <button onClick={() => { haptic('light'); setShowPayment(false) }} style={{ width: '100%', padding: '12px', borderRadius: '14px', marginTop: '10px', background: 'none', border: 'none', color: colors.text2, fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}