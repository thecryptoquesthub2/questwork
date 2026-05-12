import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Config ───────────────────────────────
const API = 'https://questwork.up.railway.app'
const TON_CONTRACT = 'EQDucZhNYIW5TwinCcwmdPqzjz7yt_MpA7YfMS-B4rInPcis'
const COMMISSION = 0.10

// ─── Icons ────────────────────────────────
const IconHome      = ({ size=22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
const IconBriefcase = ({ size=22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/><path d="M2 12h20"/></svg>
const IconPlus      = ({ size=22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
const IconSearch    = ({ size=22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconUser      = ({ size=22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconMessage   = ({ size=22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
const IconBookmark  = ({ size=18, filled=false }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?'currentColor':'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
const IconStar      = ({ size=14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconSend      = ({ size=18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IconLock      = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const IconCheck     = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IconBack      = ({ size=20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
const IconContract  = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IconAlert     = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const IconCrown     = ({ size=16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 20l2-8 6 4 6-4 2 8"/><circle cx="12" cy="8" r="2"/></svg>

const LOGO_SVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="30" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 24 44)"/>
    <rect x="35" y="25" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 49 39)"/>
    <path d="M58 35 L75 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M68 18 L75 18 L75 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Sample Data ──────────────────────────
const SAMPLE_GIGS = [
  { id: 1, title: "Community Manager", company: "Sui Network", pay: "$800/mo", tag: "Global", duration: "Ongoing", category: "Community Management", featured: true, description: "Manage and grow our Discord and Telegram communities. Engage daily with members, host AMAs, and coordinate with the core team on announcements and campaigns.", requirements: "2+ years Web3 community experience, strong communication skills, experience with Discord bots and analytics." },
  { id: 2, title: "BD Manager", company: "TON Wallet", pay: "$1,200/mo", tag: "MENA", duration: "3 Months", category: "Business Development", featured: true, description: "Drive ecosystem partnerships and integrations. Identify and close deals with DeFi protocols, NFT projects, and Web3 infrastructure providers.", requirements: "3+ years BD in crypto, existing network of Web3 founders." },
  { id: 3, title: "Social Media Manager", company: "BNB Chain", pay: "$600/mo", tag: "Global", duration: "1 Month", category: "Social Media", featured: false, description: "Own all social channels including Twitter, TikTok and Instagram. Create viral content and grow follower base.", requirements: "Portfolio of managed crypto accounts, content creation skills." },
  { id: 4, title: "Web3 Writer", company: "CoinDesk", pay: "$400/mo", tag: "Remote", duration: "Ongoing", category: "Writing", featured: false, description: "Write 4-6 articles per week covering DeFi, NFTs, DAOs and blockchain technology.", requirements: "Published writing portfolio, deep Web3 knowledge." },
  { id: 5, title: "Smart Contract Dev", company: "Aave", pay: "$3,000/mo", tag: "Global", duration: "3 Months", category: "Development", featured: false, description: "Develop and audit smart contracts for Aave's lending protocol.", requirements: "Solidity expert, 2+ years DeFi experience." },
  { id: 6, title: "Discord Moderator", company: "Polygon", pay: "$300/mo", tag: "Global", duration: "Ongoing", category: "Community Management", featured: false, description: "Moderate Polygon's Discord server with 200K+ members.", requirements: "Active in Web3 communities, familiar with moderation tools." },
  { id: 7, title: "Growth Hacker", company: "Arbitrum", pay: "$1,500/mo", tag: "Global", duration: "3 Months", category: "Business Development", featured: false, description: "Design and execute growth experiments to acquire new users onto Arbitrum.", requirements: "Growth marketing background, data-driven mindset." },
  { id: 8, title: "NFT Artist", company: "OpenSea", pay: "$2,000/mo", tag: "Global", duration: "1 Month", category: "Writing", featured: false, description: "Create original NFT artwork for featured drops and collaborations.", requirements: "Strong digital art portfolio, experience minting NFTs." },
]

const SAMPLE_FREELANCERS = [
  { id: 's1', name: "Amara Okonkwo", skills: ["Community Management", "Discord"], questScore: 4.9, gigsCompleted: 52, earned: "$28K", available: true, bio: "Web3 community builder with 4+ years growing crypto projects globally.", dm_enabled: true, isReal: false },
  { id: 's2', name: "Hassan Al-Rashid", skills: ["Business Development", "Partnerships"], questScore: 4.7, gigsCompleted: 38, earned: "$19K", available: true, bio: "BD expert connecting Web3 projects with key partners worldwide.", dm_enabled: true, isReal: false },
  { id: 's3', name: "Zainab Ahmed", skills: ["Community Management", "Telegram"], questScore: 4.8, gigsCompleted: 47, earned: "$25K", available: false, bio: "Crypto community manager specialising in Telegram and Discord growth.", dm_enabled: true, isReal: false },
  { id: 's4', name: "Kofi Mensah", skills: ["Writing", "Research"], questScore: 4.6, gigsCompleted: 31, earned: "$14K", available: true, bio: "Web3 content writer covering DeFi, NFTs and blockchain technology.", dm_enabled: true, isReal: false },
  { id: 's5', name: "Fatima Al-Zahra", skills: ["Development", "Solidity"], questScore: 4.8, gigsCompleted: 29, earned: "$42K", available: true, bio: "Smart contract developer with auditing experience on Ethereum and TON.", dm_enabled: true, isReal: false },
  { id: 's6', name: "Emeka Obi", skills: ["Social Media", "Content"], questScore: 4.5, gigsCompleted: 44, earned: "$18K", available: true, bio: "Social media manager growing Web3 brands on Twitter, TikTok and Instagram.", dm_enabled: true, isReal: false },
]

// ─── Helpers ──────────────────────────────
const haptic = (type = 'light') => window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('qw_theme') || 'light')
  const cycleTheme = () => {
    haptic('medium')
    setTheme(t => { const n = t === 'light' ? 'dark' : 'light'; localStorage.setItem('qw_theme', n); return n })
  }
  return { theme, resolved: theme, cycleTheme }
}

function getColors(dark) {
  return {
    bg:          dark ? '#000000'               : '#F4F1EA',
    surface:     dark ? '#0B1220'               : '#FFFFFF',
    surface2:    dark ? 'rgba(44,44,46,0.9)'   : 'rgba(210,210,215,0.7)',
    border:      dark ? 'rgba(255,255,255,0.08)': 'rgba(0,0,0,0.08)',
    text:        dark ? '#F4F1EA'               : '#0B1220',
    text2:       dark ? 'rgba(244,241,234,0.5)' : 'rgba(11,18,32,0.45)',
    card:        dark ? '#0B1220'               : '#FFFFFF',
    navBg:       dark ? 'rgba(11,18,32,0.97)'  : 'rgba(255,255,255,0.97)',
    gold:        '#C8A95A',
    goldDeep:    '#9d8443',
    goldBg:      dark ? 'rgba(200,169,90,0.12)' : 'rgba(200,169,90,0.08)',
    goldBorder:  'rgba(200,169,90,0.3)',
    red:         '#FF5A3C',
    green:       '#4ADE80',
    greenBg:     'rgba(74,222,128,0.1)',
    greenBorder: 'rgba(74,222,128,0.3)',
    btnBg:       dark ? '#F4F1EA'               : '#0B1220',
    btnText:     dark ? '#0B1220'               : '#F4F1EA',
  }
}

const tabs = [
  { id: 'home',    label: 'Home',    Icon: IconHome },
  { id: 'gigs',    label: 'Gigs',    Icon: IconBriefcase },
  { id: 'post',    label: 'Post',    Icon: IconPlus },
  { id: 'search',  label: 'Search',  Icon: IconSearch },
  { id: 'profile', label: 'Profile', Icon: IconUser },
]

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM PAYWALL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PremiumPaywallModal({ colors, dark, onClose, onUpgrade }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px', padding: '32px 24px', width: '100%', maxWidth: '380px', border: `1px solid ${colors.goldBorder}`, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: colors.goldBg, border: `2px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: colors.gold }}>
          <IconCrown size={24}/>
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>Premium Feature</div>
        <div style={{ fontSize: '14px', color: colors.text2, lineHeight: 1.6, marginBottom: '24px' }}>
          Messaging is available to Premium members only. Upgrade to connect with freelancers and clients directly in QuestWork.
        </div>
        <div style={{ background: colors.surface2, borderRadius: '14px', padding: '14px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
          {['Message any freelancer or client', 'Create escrow contracts', 'AI Pitch Writer', 'Priority visibility', 'Premium badge'].map((f, i, arr) => (
            <div key={i} style={{ fontSize: '13px', padding: '5px 0', borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none', color: colors.text, display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <span style={{ color: colors.green }}>✓</span> {f}
            </div>
          ))}
        </div>
        <button onClick={onUpgrade} style={{ width: '100%', padding: '15px', borderRadius: '13px', background: colors.gold, border: 'none', color: '#0B1220', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '10px' }}>
          Upgrade to Premium — $15/mo
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '13px', background: 'none', border: 'none', color: colors.text2, fontSize: '14px', cursor: 'pointer' }}>
          Maybe later
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNUP MODAL
// ─────────────────────────────────────────────────────────────────────────────
function SignupModal({ colors, dark, onSave }) {
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
    try { await fetch(`${API}/api/users/backup-login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) }) } catch (_) {}
    localStorage.setItem('qw_backup_email', email)
    localStorage.setItem('qw_signup_done', '1')
    setSaving(false); haptic('heavy'); onSave(email)
  }

  const inp = { width: '100%', padding: '13px 14px', borderRadius: '12px', background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.6)', border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px', padding: '28px 24px 32px', width: '100%', maxWidth: '420px', border: `1px solid ${colors.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', boxSizing: 'border-box' }}>
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
        <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px', textAlign: 'center', color: colors.text }}>Set Backup Login</div>
        <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '6px', textAlign: 'center', lineHeight: 1.5 }}>Protects your account if Telegram is ever unavailable.</div>
        <div style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '10px 12px', marginBottom: '20px', lineHeight: 1.5, textAlign: 'center' }}>🔒 Telegram ban protection — your data stays yours</div>
        {error && <div style={{ fontSize: '13px', color: colors.red, marginBottom: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(255,90,60,0.1)', border: '1px solid rgba(255,90,60,0.2)' }}>{error}</div>}
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inp} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password (min 6 chars)" style={inp} />
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" style={{ ...inp, marginBottom: '20px' }} />
        <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '15px', borderRadius: '13px', background: saving ? colors.surface2 : colors.btnBg, border: 'none', color: saving ? colors.text2 : colors.btnText, fontSize: '16px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving...' : 'Save & Continue →'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPUTE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function DisputeModal({ contract, tgUser, colors, dark, onClose }) {
  const [reason, setReason] = useState('')
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) { alert('Please describe the issue.'); return }
    setSubmitting(true)
    try {
      await fetch(`${API}/api/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: contract.id,
          raised_by_tg_id: String(tgUser.id),
          against_tg_id: String(tgUser.id) === String(contract.client_tg_id) ? contract.freelancer_tg_id : contract.client_tg_id,
          reason,
          evidence_url: evidenceUrl,
        })
      })
      haptic('heavy'); setDone(true)
      setTimeout(onClose, 2000)
    } catch (_) { alert('Error submitting dispute.') }
    setSubmitting(false)
  }

  const inp = { width: '100%', padding: '12px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', padding: '24px 20px 40px', border: `1px solid ${colors.border}` }}>
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text, marginBottom: '6px' }}>Dispute Submitted</div>
            <div style={{ fontSize: '13px', color: colors.text2 }}>QuestWork support has been notified and will review your case.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text, marginBottom: '4px' }}>Raise a Dispute</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '20px' }}>Describe the issue clearly. QuestWork support will review and resolve it.</div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>What is the issue? *</div>
              <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe the problem in detail..." style={{ ...inp, height: '100px', resize: 'none' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Evidence Link (screenshot, file, etc.)</div>
              <input value={evidenceUrl} onChange={e => setEvidenceUrl(e.target.value)} placeholder="https://drive.google.com/..." style={inp} />
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,90,60,0.08)', border: '1px solid rgba(255,90,60,0.2)', marginBottom: '20px', fontSize: '12px', color: colors.red, lineHeight: 1.6 }}>
              ⚠️ Raising a dispute freezes the escrow payment until resolved by QuestWork support.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: submitting ? colors.surface2 : colors.red, border: 'none', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK SUBMIT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function WorkSubmitModal({ contract, tgUser, colors, dark, onClose, onSubmitted }) {
  const [note, setNote] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!note.trim() && !linkUrl.trim()) { alert('Please add a note or link.'); return }
    setSubmitting(true)
    try {
      await fetch(`${API}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract_id: contract.id, gig_id: contract.gig_id, gig_title: contract.gig_title, client_tg_id: contract.client_tg_id, freelancer_tg_id: contract.freelancer_tg_id, note, link_url: linkUrl })
      })
      haptic('heavy'); setDone(true)
      setTimeout(() => { onSubmitted?.(); onClose() }, 1800)
    } catch (_) { alert('Error submitting.') }
    setSubmitting(false)
  }

  const inp = { width: '100%', padding: '12px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', padding: '24px 20px 40px', border: `1px solid ${colors.border}` }}>
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📦</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: colors.green, marginBottom: '6px' }}>Work Submitted!</div>
            <div style={{ fontSize: '13px', color: colors.text2 }}>Client has been notified and has 5 days to review.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text, marginBottom: '4px' }}>Submit Work</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '20px' }}>For: {contract.gig_title || 'Contract'} · {contract.amount_ton} TON locked</div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Work Description *</div>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Describe what you delivered..." style={{ ...inp, height: '100px', resize: 'none' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Delivery Link</div>
              <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://drive.google.com/..." style={inp} />
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, marginBottom: '20px', fontSize: '12px', color: colors.gold, lineHeight: 1.6 }}>
              💡 Client has 5 days to approve. If no response, payment releases automatically.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: submitting ? colors.surface2 : colors.btnBg, border: 'none', color: submitting ? colors.text2 : colors.btnText, fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Submitting...' : 'Submit Work →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ESCROW MODAL
// ─────────────────────────────────────────────────────────────────────────────
function EscrowModal({ freelancer, tgUser, colors, dark, onClose, onFunded }) {
  const [amountTon, setAmountTon] = useState('')
  const [txHash, setTxHash] = useState('')
  const [step, setStep] = useState(1)
  const [funding, setFunding] = useState(false)
  const [done, setDone] = useState(false)

  const commission = amountTon ? (parseFloat(amountTon) * COMMISSION).toFixed(2) : '0'
  const freelancerGets = amountTon ? (parseFloat(amountTon) * (1 - COMMISSION)).toFixed(2) : '0'

  const handleFund = async () => {
    if (!txHash.trim()) { alert('Please paste the transaction hash.'); return }
    setFunding(true)
    try {
      await fetch(`${API}/api/escrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_tg_id: String(tgUser.id), freelancer_tg_id: String(freelancer.tg_id || freelancer.id), gig_title: `Contract with ${freelancer.name || freelancer.first_name}`, amount_ton: amountTon, tx_hash: txHash })
      })
      haptic('heavy'); setDone(true)
      setTimeout(() => { onFunded?.(); onClose() }, 2000)
    } catch (_) { alert('Error recording contract.') }
    setFunding(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', padding: '24px 20px 44px', border: `1px solid ${colors.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔒</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: colors.green, marginBottom: '6px' }}>Escrow Funded!</div>
            <div style={{ fontSize: '13px', color: colors.text2 }}>Funds locked. Freelancer notified to begin work.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text, marginBottom: '4px' }}>Create Escrow Contract</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '20px' }}>With: {freelancer.name || freelancer.first_name}</div>
            {step === 1 && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Amount (TON) *</div>
                  <input value={amountTon} onChange={e => setAmountTon(e.target.value)} type="number" placeholder="e.g. 50" style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '16px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {amountTon && parseFloat(amountTon) > 0 && (
                  <div style={{ background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                    {[['Total locked', `${amountTon} TON`], ['QuestWork (10%)', `${commission} TON`]].map(([l, v], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: colors.text2 }}>{l}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${colors.goldBorder}`, paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: colors.text }}>Freelancer receives</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: colors.green }}>{freelancerGets} TON</span>
                    </div>
                  </div>
                )}
                <button onClick={() => { if (!amountTon || parseFloat(amountTon) <= 0) { alert('Enter a valid amount.'); return } setStep(2) }} style={{ width: '100%', padding: '15px', borderRadius: '13px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>Continue →</button>
              </>
            )}
            {step === 2 && (
              <>
                <div style={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Send {amountTon} TON to:</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: colors.text, wordBreak: 'break-all', lineHeight: 1.7, padding: '10px', background: dark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)', borderRadius: '10px', marginBottom: '10px' }}>{TON_CONTRACT}</div>
                  <button onClick={() => { navigator.clipboard.writeText(TON_CONTRACT); haptic('medium') }} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Copy Address</button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Transaction Hash *</div>
                  <input value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="Paste your TX hash here..." style={{ width: '100%', padding: '13px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Back</button>
                  <button onClick={handleFund} disabled={funding} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: funding ? colors.surface2 : colors.green, border: 'none', color: '#0B1220', fontSize: '14px', fontWeight: '700', cursor: funding ? 'not-allowed' : 'pointer' }}>
                    {funding ? 'Recording...' : '✓ Confirm Escrow'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTRACT CARD
// ─────────────────────────────────────────────────────────────────────────────
function ContractCard({ contract, tgUser, colors, dark, onWorkSubmit, onRelease, onDispute }) {
  const isClient = String(tgUser?.id) === String(contract.client_tg_id)
  const isFreelancer = String(tgUser?.id) === String(contract.freelancer_tg_id)
  const [releasing, setReleasing] = useState(false)

  const statusColor = { funded: colors.gold, submitted: '#60a5fa', released: colors.green, disputed: colors.red }[contract.status] || colors.text2
  const statusLabel = { funded: '💰 Awaiting Work', submitted: '📦 Work Submitted', released: '✅ Completed', disputed: '⚠️ Disputed' }[contract.status] || contract.status

  const handleRelease = async () => {
    if (!window.confirm('Release payment to the freelancer? This cannot be undone.')) return
    setReleasing(true)
    try {
      await fetch(`${API}/api/escrow/${contract.id}/release`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ release_tx: 'client-approved' }) })
      haptic('heavy'); onRelease?.()
    } catch (_) { alert('Error releasing payment.') }
    setReleasing(false)
  }

  return (
    <div style={{ background: dark ? 'rgba(200,169,90,0.07)' : 'rgba(200,169,90,0.05)', border: `1px solid ${colors.goldBorder}`, borderRadius: '16px', padding: '14px', margin: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ color: colors.gold }}><IconContract size={16}/></div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: colors.gold }}>Escrow Contract</div>
        <div style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '600', color: statusColor }}>{statusLabel}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <div style={{ background: colors.surface2, borderRadius: '10px', padding: '10px', border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '10px', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Amount</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: colors.gold }}>{contract.amount_ton} TON</div>
        </div>
        <div style={{ background: colors.surface2, borderRadius: '10px', padding: '10px', border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: '10px', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Status</div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: statusColor }}>{contract.status}</div>
        </div>
      </div>
      {contract.gig_title && <div style={{ fontSize: '12px', color: colors.text2, marginBottom: '12px' }}>Gig: {contract.gig_title}</div>}
      {isFreelancer && contract.status === 'funded' && (
        <button onClick={() => onWorkSubmit?.(contract)} style={{ width: '100%', padding: '11px', borderRadius: '11px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' }}>Submit Work →</button>
      )}
      {isClient && contract.status === 'submitted' && (
        <button onClick={handleRelease} disabled={releasing} style={{ width: '100%', padding: '11px', borderRadius: '11px', background: releasing ? colors.surface2 : colors.green, border: 'none', color: '#0B1220', fontSize: '13px', fontWeight: '700', cursor: releasing ? 'not-allowed' : 'pointer', marginBottom: '8px' }}>
          {releasing ? 'Releasing...' : '✓ Approve & Release Payment'}
        </button>
      )}
      {contract.status === 'released' && <div style={{ textAlign: 'center', fontSize: '12px', color: colors.green, fontWeight: '600' }}>Payment released to freelancer.</div>}
      {['funded', 'submitted'].includes(contract.status) && (
        <button onClick={() => onDispute?.(contract)} style={{ width: '100%', padding: '9px', borderRadius: '11px', background: 'rgba(255,90,60,0.08)', border: '1px solid rgba(255,90,60,0.2)', color: colors.red, fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
          Raise Dispute
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL SCREEN MESSAGING
// ─────────────────────────────────────────────────────────────────────────────
function MessagingScreen({ tgUser, isPremium, colors, dark, initialRecipient, onClose, onUpgrade }) {
  const [threads, setThreads] = useState([])
  const [threadsLoading, setThreadsLoading] = useState(true)
  const [activeThread, setActiveThread] = useState(initialRecipient || null)
  const [messages, setMessages] = useState([])
  const [contracts, setContracts] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [msgError, setMsgError] = useState('')
  const [showEscrow, setShowEscrow] = useState(false)
  const [showWorkSubmit, setShowWorkSubmit] = useState(null)
  const [showDispute, setShowDispute] = useState(null)
  const bottomRef = useRef(null)
  const pollRef = useRef(null)

  const loadThreads = useCallback(async () => {
    if (!tgUser?.id) return
    try {
      const res = await fetch(`${API}/api/messages/threads/${tgUser.id}`)
      const data = await res.json()
      setThreads(Array.isArray(data) ? data : [])
    } catch (_) {}
    setThreadsLoading(false)
  }, [tgUser])

  useEffect(() => { loadThreads() }, [loadThreads])

  const loadThread = useCallback(async (thread) => {
    if (!tgUser?.id || !thread?.other_id) return
    try {
      const [mRes, cRes] = await Promise.all([
        fetch(`${API}/api/messages/${tgUser.id}/${thread.other_id}`),
        fetch(`${API}/api/escrow/${tgUser.id}/${thread.other_id}`),
      ])
      const [mData, cData] = await Promise.all([mRes.json(), cRes.json()])
      setMessages(Array.isArray(mData) ? mData : [])
      setContracts(Array.isArray(cData) ? cData : [])
    } catch (_) {}
  }, [tgUser])

  useEffect(() => {
    if (activeThread) {
      loadThread(activeThread)
      pollRef.current = setInterval(() => loadThread(activeThread), 2000)
    }
    return () => clearInterval(pollRef.current)
  }, [activeThread, loadThread])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (initialRecipient) setActiveThread(initialRecipient) }, [initialRecipient])

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeThread) return
    if (!isPremium) { onUpgrade?.(); return }
    setMsgError(''); setSending(true)
    try {
      const res = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_tg_id: String(tgUser.id), receiver_tg_id: activeThread.other_id, content: newMsg })
      })
      const data = await res.json()
      if (data.error === 'premium_required') { onUpgrade?.(); }
      else if (data.error === 'blocked') { setMsgError('🚫 Message blocked: contact information detected. Keep all communication in-app.') }
      else { setMessages(prev => [...prev, { sender_tg_id: String(tgUser.id), content: newMsg, created_at: new Date().toISOString() }]); setNewMsg(''); haptic('light') }
    } catch (_) { setMsgError('Failed to send. Please try again.') }
    setSending(false)
  }

  const timeline = [
    ...messages.map(m => ({ type: 'msg', data: m, ts: new Date(m.created_at) })),
    ...contracts.map(c => ({ type: 'contract', data: c, ts: new Date(c.created_at) })),
  ].sort((a, b) => a.ts - b.ts)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 8000, background: dark ? '#000' : '#F4F1EA', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', background: dark ? 'rgba(11,18,32,0.97)' : 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <button onClick={activeThread ? () => { setActiveThread(null); setMessages([]); setContracts([]) } : onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.surface2, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.text, flexShrink: 0 }}>
          <IconBack size={18}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: '700', color: colors.text }}>{activeThread ? (activeThread.other_name || 'Chat') : 'Messages'}</div>
          {activeThread && <div style={{ fontSize: '12px', color: colors.text2 }}>QuestWork Chat</div>}
        </div>
        {activeThread && isPremium && (
          <button onClick={() => setShowEscrow(true)} style={{ padding: '7px 12px', borderRadius: '10px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold, fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconLock size={13}/> Escrow
          </button>
        )}
        {!activeThread && <button onClick={onClose} style={{ background: 'none', border: 'none', color: colors.text2, cursor: 'pointer', fontSize: '22px', lineHeight: 1 }}>×</button>}
      </div>

      {/* Thread list */}
      {!activeThread && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {threadsLoading && <div style={{ textAlign: 'center', padding: '40px', color: colors.text2 }}>Loading...</div>}
          {!threadsLoading && threads.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.text2 }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: colors.text }}>No messages yet</div>
              <div style={{ fontSize: '13px' }}>Find freelancers in Search and message them directly.</div>
            </div>
          )}
          {threads.map((t, i) => (
            <div key={i} onClick={() => { haptic('light'); setActiveThread(t); setMessages([]); setContracts([]) }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', background: colors.card, border: `1px solid ${colors.border}`, marginBottom: '8px', cursor: 'pointer', boxShadow: dark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: colors.gold, flexShrink: 0 }}>
                {(t.other_name || '?')[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text, marginBottom: '2px' }}>{t.other_name || 'Unknown'}</div>
                <div style={{ fontSize: '12px', color: colors.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.last_message || '...'}</div>
              </div>
              {parseInt(t.unread_count) > 0 && (
                <div style={{ minWidth: '22px', height: '22px', borderRadius: '11px', background: colors.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#fff', padding: '0 6px', flexShrink: 0 }}>
                  {t.unread_count}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Active chat */}
      {activeThread && (
        <>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {timeline.map((item, i) => {
              if (item.type === 'contract') {
                return <ContractCard key={`c-${item.data.id}`} contract={item.data} tgUser={tgUser} colors={colors} dark={dark} onWorkSubmit={c => setShowWorkSubmit(c)} onRelease={() => loadThread(activeThread)} onDispute={c => setShowDispute(c)} />
              }
              const m = item.data
              const isMine = String(m.sender_tg_id) === String(tgUser?.id)
              return (
                <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: '2px' }}>
                  <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMine ? colors.btnBg : colors.card, color: isMine ? colors.btnText : colors.text, fontSize: '14px', lineHeight: 1.55, border: isMine ? 'none' : `1px solid ${colors.border}` }}>
                    {m.content}
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {msgError && (
            <div style={{ margin: '0 16px 8px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,90,60,0.1)', border: '1px solid rgba(255,90,60,0.3)', fontSize: '12px', color: colors.red, lineHeight: 1.5 }}>
              {msgError}
            </div>
          )}

          {/* Premium paywall banner in chat */}
          {!isPremium && (
            <div style={{ margin: '0 16px 8px', padding: '12px 14px', borderRadius: '12px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconCrown size={16} />
              <div style={{ flex: 1, fontSize: '12px', color: colors.gold, fontWeight: '600' }}>Upgrade to Premium to send messages</div>
              <button onClick={onUpgrade} style={{ padding: '6px 12px', borderRadius: '8px', background: colors.gold, border: 'none', color: '#0B1220', fontSize: '11px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>Upgrade</button>
            </div>
          )}

          <div style={{ padding: '10px 16px 20px', borderTop: `1px solid ${colors.border}`, background: dark ? 'rgba(11,18,32,0.97)' : 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input
              value={newMsg}
              onChange={e => { setNewMsg(e.target.value); setMsgError('') }}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={isPremium ? 'Send a message...' : 'Premium required to message'}
              disabled={!isPremium}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '22px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', opacity: isPremium ? 1 : 0.5 }}
            />
            <button onClick={sendMessage} disabled={sending || !newMsg.trim() || !isPremium} style={{ width: '44px', height: '44px', borderRadius: '50%', background: newMsg.trim() && isPremium ? colors.btnBg : colors.surface2, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMsg.trim() && isPremium ? 'pointer' : 'default', color: newMsg.trim() && isPremium ? colors.btnText : colors.text2, flexShrink: 0 }}>
              <IconSend size={17}/>
            </button>
          </div>
        </>
      )}

      {showEscrow && activeThread && (
        <EscrowModal freelancer={{ tg_id: activeThread.other_id, name: activeThread.other_name }} tgUser={tgUser} colors={colors} dark={dark} onClose={() => setShowEscrow(false)} onFunded={() => loadThread(activeThread)} />
      )}
      {showWorkSubmit && (
        <WorkSubmitModal contract={showWorkSubmit} tgUser={tgUser} colors={colors} dark={dark} onClose={() => setShowWorkSubmit(null)} onSubmitted={() => loadThread(activeThread)} />
      )}
      {showDispute && (
        <DisputeModal contract={showDispute} tgUser={tgUser} colors={colors} dark={dark} onClose={() => setShowDispute(null)} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GIG DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
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
      const data = await res.json(); setPitch(data.pitch)
    } catch (_) { alert('Error generating pitch.') }
    setGeneratingPitch(false)
  }

  const handleApply = async () => {
    if (!pitch.trim()) { haptic('heavy'); alert('Please write a short pitch!'); return }
    haptic('medium'); setApplying(true)
    try {
      await fetch(`${API}/api/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gig_id: gig.id, gig_title: gig.title, applicant_tg_id: tgUser ? String(tgUser.id) : 'unknown', applicant_username: tgUser?.username || 'unknown', pitch: `${pitch}\n\nPortfolio: ${portfolio || 'Not provided'}` }) })
      if (gig.poster_tg_id) {
        await fetch(`${API}/api/notify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: gig.poster_tg_id, message: `New Application!\n\nGig: ${gig.title}\nFrom: @${tgUser?.username || 'someone'}\n\nhttps://t.me/Questworkbot` }) })
      }
      setApplied(true); setApplying(false); haptic('heavy')
    } catch (_) { alert('Error submitting.'); setApplying(false) }
  }

  const inp = { width: '100%', padding: '12px 14px', borderRadius: '12px', background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.6)', border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', maxHeight: '92vh', overflowY: 'auto', border: `1px solid ${colors.border}`, boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: dark ? '#0B1220' : '#fff', padding: '16px 20px 12px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.surface2, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.text, fontSize: '18px' }}>‹</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: colors.text }}>{gig.title}</div>
            <div style={{ fontSize: '12px', color: colors.text2 }}>{gig.company}</div>
          </div>
          {gig.featured && <div style={{ fontSize: '10px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: colors.goldBg, color: colors.gold, textTransform: 'uppercase' }}>Featured</div>}
        </div>
        <div style={{ padding: '20px 20px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[{ label: 'Pay', value: gig.pay || gig.pay_usdt || 'Negotiable', hi: true }, { label: 'Region', value: gig.tag || gig.region || 'Global', hi: false }, { label: 'Duration', value: gig.duration || 'Ongoing', hi: false }].map((item, i) => (
              <div key={i} style={{ background: i === 0 ? colors.goldBg : colors.surface2, border: `1px solid ${i === 0 ? colors.goldBorder : colors.border}`, borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '600', color: i === 0 ? colors.gold : colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: i === 0 ? colors.gold : colors.text }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '20px' }}><div style={{ display: 'inline-flex', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: colors.surface2, color: colors.text2, border: `1px solid ${colors.border}` }}>{gig.category}</div></div>
          <div style={{ marginBottom: '20px', background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>About the Role</div>
            <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.75 }}>{gig.description || 'No description provided.'}</div>
          </div>
          {gig.requirements && (
            <div style={{ marginBottom: '24px', background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>Requirements</div>
              <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.75 }}>{gig.requirements}</div>
            </div>
          )}
          {!applied ? (
            !showApply ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { haptic('medium'); gig.source === 'web3.career' ? window.open(gig.apply_url, '_blank', 'noreferrer') : setShowApply(true) }} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                  {gig.source === 'web3.career' ? 'Apply on web3.career ↗' : 'Apply Now'}
                </button>
                <button onClick={() => { haptic('light'); toggleBookmark(gig.id) }} style={{ width: '52px', height: '52px', borderRadius: '14px', background: isBookmarked ? colors.goldBg : colors.surface2, border: `1px solid ${isBookmarked ? colors.goldBorder : colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isBookmarked ? colors.gold : colors.text2, flexShrink: 0 }}>
                  <IconBookmark size={20} filled={isBookmarked}/>
                </button>
              </div>
            ) : (
              <div>
                {tgUser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors.goldBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: colors.gold }}>{tgUser.first_name?.[0]}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text }}>{tgUser.first_name} {tgUser.last_name || ''}</div>
                      <div style={{ fontSize: '11px', color: colors.text2 }}>Applying as you</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Pitch</div>
                  <button onClick={handleAIPitch} disabled={generatingPitch} style={{ padding: '4px 10px', borderRadius: '8px', background: isPremium ? colors.goldBg : 'rgba(0,0,0,0.06)', border: `1px solid ${colors.border}`, color: isPremium ? colors.gold : colors.text2, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                    {generatingPitch ? 'Writing...' : isPremium ? 'AI Write ✦' : 'AI Write (Premium)'}
                  </button>
                </div>
                <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder="Tell them why you're the perfect fit..." style={{ ...inp, height: '100px', resize: 'none', marginBottom: '10px' }} />
                <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Portfolio / LinkedIn URL</div>
                <input type="text" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://your-portfolio.com" style={{ ...inp, marginBottom: '14px' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowApply(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleApply} disabled={applying} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: applying ? colors.surface2 : colors.btnBg, border: 'none', color: applying ? colors.text2 : colors.btnText, fontSize: '15px', fontWeight: '700', cursor: applying ? 'not-allowed' : 'pointer' }}>{applying ? 'Submitting...' : 'Submit'}</button>
                </div>
              </div>
            )
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', borderRadius: '14px', background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, color: colors.green, fontSize: '16px', fontWeight: '600' }}>✓ Application Submitted!</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FREELANCER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function FreelancerModal({ freelancer, colors, dark, tgUser, isPremium, onClose, onMessage, onUpgrade }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', border: `1px solid ${colors.border}`, boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: dark ? '#0B1220' : '#fff', padding: '16px 20px 12px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.surface2, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.text, fontSize: '18px' }}>‹</button>
          <div style={{ fontSize: '16px', fontWeight: '700', color: colors.text }}>Freelancer Profile</div>
        </div>
        <div style={{ padding: '20px 20px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: colors.goldBg, border: `2px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', color: colors.gold, flexShrink: 0 }}>{freelancer.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: colors.text }}>{freelancer.name}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', background: freelancer.available ? colors.greenBg : colors.surface2, border: `1px solid ${freelancer.available ? colors.greenBorder : colors.border}`, color: freelancer.available ? colors.green : colors.text2, fontSize: '11px', fontWeight: '600' }}>
                {freelancer.available ? '● Available' : '● Busy'}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {[{ label: 'QuestScore', value: freelancer.questScore || 0 }, { label: 'Gigs Done', value: freelancer.gigsCompleted || 0 }, { label: 'Earned', value: freelancer.earned || '$0' }].map((s, i) => (
              <div key={i} style={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: colors.text }}>{s.value}</div>
              </div>
            ))}
          </div>
          {freelancer.bio && freelancer.bio !== 'No bio yet.' && (
            <div style={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>About</div>
              <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.7 }}>{freelancer.bio}</div>
            </div>
          )}
          {freelancer.skills?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {freelancer.skills.map((s, i) => <div key={i} style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '20px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold, fontWeight: '500' }}>{s}</div>)}
              </div>
            </div>
          )}
          {freelancer.dm_enabled !== false ? (
            isPremium ? (
              <button onClick={() => { haptic('light'); onMessage?.(freelancer); onClose() }} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                Message in QuestWork
              </button>
            ) : (
              <button onClick={() => { haptic('light'); onUpgrade?.(); onClose() }} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: colors.gold, border: 'none', color: '#0B1220', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <IconCrown size={18}/> Upgrade to Message
              </button>
            )
          ) : (
            <div style={{ width: '100%', padding: '16px', borderRadius: '14px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text2, fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>
              DM Disabled by User
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GIG CARD
// ─────────────────────────────────────────────────────────────────────────────
function GigCard({ gig, colors, dark, bookmarks, toggleBookmark, setSelectedGig }) {
  const [pressed, setPressed] = useState(false)
  const isBookmarked = bookmarks?.includes(gig.id)
  return (
    <div onMouseDown={() => { setPressed(true); haptic('light') }} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} onTouchStart={() => { setPressed(true); haptic('light') }} onTouchEnd={() => setPressed(false)} onClick={() => setSelectedGig(gig)}
      style={{ background: colors.card, border: `1px solid ${gig.featured ? colors.goldBorder : colors.border}`, borderRadius: '18px', padding: '16px', boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform 0.15s ease', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          {gig.featured && <div style={{ display: 'inline-flex', fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '6px', background: colors.goldBg, color: colors.gold, marginBottom: '7px', textTransform: 'uppercase' }}>Featured</div>}
          <div style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.3px', marginBottom: '3px', color: colors.text }}>{gig.title}</div>
          <div style={{ fontSize: '13px', color: colors.text2 }}>{gig.company}</div>
        </div>
        <div style={{ textAlign: 'right', marginLeft: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: colors.text }}>{gig.pay || gig.pay_usdt}</div>
          <div style={{ fontSize: '11px', marginTop: '4px', padding: '2px 8px', borderRadius: '6px', background: colors.surface2, color: colors.text2, display: 'inline-block' }}>{gig.tag || gig.region || 'Global'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: colors.surface2, color: colors.text2, fontWeight: '500' }}>{gig.category}</div>
        <button onClick={e => { e.stopPropagation(); toggleBookmark?.(gig.id) }} style={{ marginLeft: 'auto', width: '34px', height: '34px', borderRadius: '10px', background: isBookmarked ? colors.goldBg : colors.surface2, border: `1px solid ${isBookmarked ? colors.goldBorder : colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isBookmarked ? colors.gold : colors.text2 }}>
          <IconBookmark size={15} filled={isBookmarked}/>
        </button>
        <button onClick={e => { e.stopPropagation(); setSelectedGig(gig) }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View & Apply</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
function HomePage({ colors, dark, navigate, tgUser, isPremium, bookmarks, toggleBookmark, setSelectedGig }) {
  const [search, setSearch] = useState('')
  const [filteredGigs, setFilteredGigs] = useState(SAMPLE_GIGS)
  const handleSearch = (value) => {
    setSearch(value)
    if (!value.trim()) { setFilteredGigs(SAMPLE_GIGS); return }
    const lower = value.toLowerCase()
    setFilteredGigs(SAMPLE_GIGS.filter(g => g.title.toLowerCase().includes(lower) || g.company?.toLowerCase().includes(lower) || g.category.toLowerCase().includes(lower) || (g.tag||'').toLowerCase().includes(lower)))
  }
  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '6px' }}>Good day, {tgUser?.first_name || 'there'} 👋</div>
        <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: '6px', color: colors.text }}>Find your next<br /><span style={{ color: colors.gold }}>Web3 Quest</span></div>
        <div style={{ fontSize: '14px', color: colors.text2 }}>Global gigs. Crypto payments. Zero friction.</div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', borderRadius: '14px', background: colors.surface2, border: `1px solid ${colors.border}` }}>
          <IconSearch size={16}/>
          <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search gigs, skills, companies..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: colors.text, fontSize: '14px', fontFamily: 'inherit' }} />
          {search && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: colors.text2, fontSize: '16px', cursor: 'pointer', padding: 0 }}>×</button>}
        </div>
      </div>
      {search ? (
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '14px' }}>{filteredGigs.length} result{filteredGigs.length !== 1 ? 's' : ''} for "{search}"</div>
          {filteredGigs.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}><div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: colors.text }}>No gigs found</div></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{filteredGigs.map(g => <GigCard key={g.id} gig={g} colors={colors} dark={dark} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig}/>)}</div>
          }
        </div>
      ) : (
        <>
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[{ value: '120+', label: 'Active Gigs', icon: <IconBriefcase size={18}/> }, { value: '500+', label: 'Freelancers', icon: <IconUser size={18}/> }, { value: '$50K+', label: 'Paid Out', icon: <IconCheck size={18}/> }].map((s, i) => (
                <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '14px 10px', textAlign: 'center', boxShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px', color: colors.text2 }}>{s.icon}</div>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: colors.text }}>{s.value}</div>
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
              <button onClick={() => { haptic('light'); navigate('gigs') }} style={{ fontSize: '13px', color: colors.text, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>See all</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{SAMPLE_GIGS.filter(g => g.featured).map(g => <GigCard key={g.id} gig={g} colors={colors} dark={dark} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig}/>)}</div>
          </div>
          <div style={{ padding: '24px 20px 0' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>Latest Gigs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{SAMPLE_GIGS.filter(g => !g.featured).map(g => <GigCard key={g.id} gig={g} colors={colors} dark={dark} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig}/>)}</div>
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GIGS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function GigsPage({ colors, dark, tgUser, bookmarks, toggleBookmark, setSelectedGig }) {
  const [filter, setFilter] = useState('All')
  const [dbGigs, setDbGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const categories = ['All', 'Community Management', 'Business Development', 'Development', 'Social Media', 'Writing']
  const labels = ['All', 'Community', 'BD', 'Dev', 'Social', 'Writing']
  useEffect(() => {
    fetch(`${API}/api/gigs`).then(r => r.json()).then(d => setDbGigs(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false))
  }, [])
  const allGigs = [...dbGigs, ...SAMPLE_GIGS]
  const filtered = filter === 'All' ? allGigs : allGigs.filter(g => g.category === filter)
  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '20px', color: colors.text }}>All Gigs</div>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px' }}>
        {labels.map((lab, i) => {
          const cat = i === 0 ? 'All' : categories[i]
          return <button key={lab} onClick={() => { haptic('light'); setFilter(cat) }} style={{ padding: '7px 14px', borderRadius: '20px', whiteSpace: 'nowrap', background: filter === cat ? colors.btnBg : colors.surface2, border: `1px solid ${filter === cat ? colors.btnBg : colors.border}`, color: filter === cat ? colors.btnText : colors.text, fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>{lab}</button>
        })}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: '40px', color: colors.text2 }}>Loading gigs...</div> : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{filtered.map(g => <GigCard key={g.id} gig={g} colors={colors} dark={dark} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig}/>)}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// POST PAGE
// ─────────────────────────────────────────────────────────────────────────────
function PostPage({ colors, dark, tgUser }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [form, setForm] = useState({ title: '', category: 'Community Management', description: '', pay_usdt: '', duration: '1 Month', region: 'Global' })
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleAIDescription = async () => {
    haptic('medium')
    if (!form.title) { alert('Please enter a role title first!'); return }
    setGeneratingDesc(true)
    try {
      const res = await fetch(`${API}/api/ai/gig`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ basic_info: `${form.title} at a Web3 company, budget: ${form.pay_usdt || 'negotiable'}, duration: ${form.duration}, region: ${form.region}` }) })
      const data = await res.json(); setForm(f => ({ ...f, description: data.description })); haptic('heavy')
    } catch (_) { alert('Error generating description.') }
    setGeneratingDesc(false)
  }
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.pay_usdt) { haptic('heavy'); alert('Please fill in all required fields!'); return }
    haptic('medium'); setLoading(true)
    const finalCategory = form.category === 'Other' ? customCategory : form.category
    try {
      await fetch(`${API}/api/gigs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, category: finalCategory, poster_tg_id: tgUser ? String(tgUser.id) : null, poster_username: tgUser?.username || null }) })
      haptic('heavy'); setSuccess(true); setForm({ title: '', category: 'Community Management', description: '', pay_usdt: '', duration: '1 Month', region: 'Global' })
    } catch (_) { alert('Error saving gig.') }
    setLoading(false)
  }
  const inp = { width: '100%', padding: '13px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px', color: colors.text }}>Post a Gig</div>
      <div style={{ fontSize: '14px', color: colors.text2, marginBottom: '24px' }}>Find the perfect Web3 talent</div>
      {success && <div style={{ background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, borderRadius: '12px', padding: '14px', marginBottom: '20px', color: colors.green, fontSize: '14px', textAlign: 'center' }}>Gig posted successfully!</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Role Title *</div><input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Community Manager" style={inp} /></div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Category</div>
          <select name="category" value={form.category} onChange={handleChange} style={{ ...inp, appearance: 'none' }}>
            <option>Community Management</option><option>Business Development</option><option>Development</option><option>Social Media</option><option>Writing</option><option>Other</option>
          </select>
          {form.category === 'Other' && <input value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="Type your category..." style={{ ...inp, marginTop: '10px' }} />}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Description *</div>
            <button onClick={handleAIDescription} disabled={generatingDesc} style={{ padding: '4px 10px', borderRadius: '8px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>{generatingDesc ? 'Writing...' : 'AI Generate (Free)'}</button>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role or tap AI Generate..." style={{ ...inp, height: '100px', resize: 'none' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Budget (USDT) *</div><input name="pay_usdt" value={form.pay_usdt} onChange={handleChange} placeholder="500 or Negotiable" style={inp} /></div>
          <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Duration</div><select name="duration" value={form.duration} onChange={handleChange} style={{ ...inp, appearance: 'none' }}><option>1 Week</option><option>1 Month</option><option>3 Months</option><option>Ongoing</option></select></div>
        </div>
        <div><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Region</div><select name="region" value={form.region} onChange={handleChange} style={{ ...inp, appearance: 'none' }}><option>Global</option><option>Africa</option><option>MENA</option><option>Remote</option></select></div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '14px', marginTop: '8px', background: loading ? colors.surface2 : colors.btnBg, border: 'none', color: loading ? colors.text2 : colors.btnText, fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Posting...' : 'Post Gig'}</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH PAGE — real users + samples merged
// ─────────────────────────────────────────────────────────────────────────────
function SearchPage({ colors, dark, tgUser, isPremium, onMessage, onUpgrade }) {
  const [mode, setMode] = useState('freelancers')
  const [query, setQuery] = useState('')
  const [gigResults, setGigResults] = useState([])
  const [selectedFreelancer, setSelectedFreelancer] = useState(null)
  const [skillFilter, setSkillFilter] = useState('All')
  const [dbUsers, setDbUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const categories = ['All', 'Community Management', 'Business Development', 'Development', 'Social Media', 'Writing']
  const labels = ['All', 'Community', 'BD', 'Dev', 'Social', 'Writing']

  useEffect(() => {
    fetch(`${API}/api/users/search?q=`).then(r => r.json()).then(d => setDbUsers(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoadingUsers(false))
  }, [])

  useEffect(() => {
    if (mode !== 'freelancers') return
    const timer = setTimeout(() => {
      fetch(`${API}/api/users/search?q=${encodeURIComponent(query)}`).then(r => r.json()).then(d => setDbUsers(Array.isArray(d) ? d : [])).catch(() => {})
    }, 300)
    return () => clearTimeout(timer)
  }, [query, mode])

  const searchGigs = (value) => {
    if (!value.trim()) { setGigResults([]); return }
    const lower = value.toLowerCase()
    setGigResults(SAMPLE_GIGS.filter(g => g.title.toLowerCase().includes(lower) || g.company?.toLowerCase().includes(lower) || g.category.toLowerCase().includes(lower)))
  }

  const handleSearch = (value) => { setQuery(value); if (mode === 'gigs') searchGigs(value) }

  const realUserIds = new Set(dbUsers.map(u => u.tg_username).filter(Boolean))
  const filteredSamples = SAMPLE_FREELANCERS.filter(f => !realUserIds.has(f.username))

  const allFreelancers = [
    ...dbUsers.map(u => ({
      id: u.tg_id, tg_id: u.tg_id,
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Anonymous',
      skills: u.skills ? u.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      questScore: u.quest_score || 0,
      gigsCompleted: u.jobs_completed || 0,
      earned: '$0',
      available: u.availability === 'Available',
      bio: u.bio || '',
      dm_enabled: u.dm_enabled !== false,
      isReal: true,
    })),
    ...filteredSamples,
  ]

  const filteredFreelancers = allFreelancers.filter(f => {
    const matchSkill = skillFilter === 'All' || f.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase().split(' ')[0].toLowerCase()))
    const matchQuery = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
    return matchSkill && matchQuery
  })

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px', color: colors.text }}>Search</div>
      <div style={{ fontSize: '14px', color: colors.text2, marginBottom: '20px' }}>Find gigs or freelancers</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[{ key: 'freelancers', label: 'Freelancers' }, { key: 'gigs', label: 'Gigs' }].map(m => (
          <button key={m.key} onClick={() => { haptic('light'); setMode(m.key); setQuery(''); setGigResults([]) }} style={{ flex: 1, padding: '11px', borderRadius: '12px', background: mode === m.key ? colors.btnBg : colors.surface2, border: `1px solid ${mode === m.key ? colors.btnBg : colors.border}`, color: mode === m.key ? colors.btnText : colors.text2, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>{m.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', borderRadius: '14px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '16px' }}>
        <IconSearch size={16}/>
        <input value={query} onChange={e => handleSearch(e.target.value)} placeholder={mode === 'gigs' ? 'Search gigs, companies...' : 'Search by name or skill...'} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: colors.text, fontSize: '14px', fontFamily: 'inherit' }} />
        {query && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: colors.text2, fontSize: '16px', cursor: 'pointer', padding: 0 }}>×</button>}
      </div>

      {mode === 'freelancers' && (
        <>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px' }}>
            {labels.map((lab, i) => {
              const cat = i === 0 ? 'All' : categories[i]
              return <button key={lab} onClick={() => { haptic('light'); setSkillFilter(cat) }} style={{ padding: '6px 14px', borderRadius: '20px', whiteSpace: 'nowrap', background: skillFilter === cat ? colors.btnBg : colors.surface2, border: `1px solid ${skillFilter === cat ? colors.btnBg : colors.border}`, color: skillFilter === cat ? colors.btnText : colors.text, fontSize: '12px', fontWeight: skillFilter === cat ? '600' : '400', cursor: 'pointer' }}>{lab}</button>
            })}
          </div>

          <div style={{ fontSize: '12px', color: colors.text2, marginBottom: '12px' }}>
            {loadingUsers ? 'Loading...' : `${filteredFreelancers.length} freelancer${filteredFreelancers.length !== 1 ? 's' : ''} found`}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredFreelancers.map((f, idx) => (
              <div key={f.tg_id || idx} onClick={() => { haptic('light'); setSelectedFreelancer(f) }} style={{ background: colors.card, border: `1px solid ${f.isReal ? colors.goldBorder : colors.border}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', boxShadow: dark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: f.bio ? '10px' : '0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: colors.gold, flexShrink: 0 }}>{f.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: colors.text }}>{f.name}</div>
                      {f.isReal && <div style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: colors.goldBg, color: colors.gold, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</div>}
                      {f.questScore > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: '600', color: colors.gold }}><IconStar size={12}/>{f.questScore}</div>}
                    </div>
                    {f.gigsCompleted > 0 && <div style={{ fontSize: '12px', color: colors.text2 }}>{f.gigsCompleted} gigs completed</div>}
                  </div>
                  <div style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', background: f.dm_enabled !== false ? colors.greenBg : colors.surface2, color: f.dm_enabled !== false ? colors.green : colors.text2, border: `1px solid ${f.dm_enabled !== false ? colors.greenBorder : colors.border}`, fontWeight: '600', flexShrink: 0 }}>
                    {f.dm_enabled !== false ? 'Available' : 'DM Off'}
                  </div>
                </div>
                {f.bio && <div style={{ fontSize: '13px', color: colors.text2, lineHeight: 1.5, marginBottom: '10px', marginTop: '8px' }}>{f.bio}</div>}
                {f.skills?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>{f.skills.map((s, i) => <div key={i} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold }}>{s}</div>)}</div>}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    if (f.dm_enabled === false) { alert('This user has turned off direct messages.'); return }
                    if (!isPremium) { onUpgrade?.(); return }
                    onMessage?.({ other_id: String(f.tg_id || f.id), other_name: f.name, other_username: f.username || '' })
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '11px', background: f.dm_enabled !== false ? (isPremium ? colors.btnBg : colors.gold) : colors.surface2, border: `1px solid ${f.dm_enabled !== false ? (isPremium ? colors.btnBg : colors.gold) : colors.border}`, color: f.dm_enabled !== false ? (isPremium ? colors.btnText : '#0B1220') : colors.text2, fontSize: '13px', fontWeight: '600', cursor: f.dm_enabled !== false ? 'pointer' : 'not-allowed' }}>
                  {f.dm_enabled === false ? 'DM Disabled' : isPremium ? 'Message in QuestWork' : '⭐ Upgrade to Message'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'gigs' && (
        <>
          {!query && <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}><div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: colors.text }}>Search Web3 Gigs</div><div style={{ fontSize: '13px' }}>Search by title, company or category</div></div>}
          {query && (
            <div>
              <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '14px' }}>{gigResults.length} result{gigResults.length !== 1 ? 's' : ''} for "{query}"</div>
              {gigResults.length === 0
                ? <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}><div style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>No gigs found</div></div>
                : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{gigResults.map(g => <div key={g.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '16px' }}><div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '3px', color: colors.text }}>{g.title}</div><div style={{ fontSize: '13px', color: colors.text2, marginBottom: '8px' }}>{g.company} · {g.pay}</div><div style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: colors.surface2, color: colors.text2, display: 'inline-block' }}>{g.category}</div></div>)}</div>
              }
            </div>
          )}
        </>
      )}

      {selectedFreelancer && (
        <FreelancerModal freelancer={selectedFreelancer} colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} onClose={() => setSelectedFreelancer(null)} onMessage={f => onMessage?.({ other_id: String(f.tg_id || f.id), other_name: f.name, other_username: f.username || '' })} onUpgrade={onUpgrade} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS RECEIVED
// ─────────────────────────────────────────────────────────────────────────────
function ApplicationsReceived({ colors, dark, tgUser }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!tgUser?.id) { setLoading(false); return }
    fetch(`${API}/api/applications/received/${tgUser.id}`).then(r => r.json()).then(d => setApplications(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false))
  }, [tgUser])

  if (loading) return <div style={{ textAlign: 'center', padding: '30px', color: colors.text2 }}>Loading...</div>
  if (!applications.length) return <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.text2 }}><div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: colors.text }}>No applications yet</div><div style={{ fontSize: '13px' }}>When someone applies to your gigs, they appear here</div></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {applications.map((app, i) => (
        <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div onClick={() => setExpanded(expanded === i ? null : i)} style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '3px', color: colors.text }}>{app.gig_title || 'Gig Application'}</div><div style={{ fontSize: '13px', color: colors.text2 }}>@{app.applicant_username || 'unknown'}</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', fontWeight: '600', textTransform: 'uppercase' }}>{app.status || 'Pending'}</div>
              <span style={{ color: colors.text2, fontSize: '16px' }}>{expanded === i ? '−' : '+'}</span>
            </div>
          </div>
          {expanded === i && (
            <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px', marginTop: '14px' }}>Pitch</div>
              <div style={{ fontSize: '14px', color: colors.text, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{app.pitch || 'No pitch provided'}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ProfilePage({ colors, dark, tgUser, isPremium, setIsPremium, notificationsOn, setNotificationsOn, cycleTheme, theme, bookmarks, backupEmail, setShowSignup, onUpgrade }) {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('usdt')
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(() => localStorage.getItem('qw_bio') || '')
  const [skills, setSkills] = useState(() => localStorage.getItem('qw_skills') || '')
  const [availability, setAvailability] = useState(() => localStorage.getItem('qw_availability') || 'Available')
  const [xHandle, setXHandle] = useState(() => localStorage.getItem('qw_x_handle') || '')
  const [savedBio, setSavedBio] = useState(() => localStorage.getItem('qw_bio') || '')
  const [savedSkills, setSavedSkills] = useState(() => localStorage.getItem('qw_skills') || '')
  const [savedAvailability, setSavedAvailability] = useState(() => localStorage.getItem('qw_availability') || 'Available')
  const [savedXHandle, setSavedXHandle] = useState(() => localStorage.getItem('qw_x_handle') || '')
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [questScore, setQuestScore] = useState(0)
  const [jobsDone, setJobsDone] = useState(0)
  const [dmEnabled, setDmEnabled] = useState(true)

  useEffect(() => {
    if (!tgUser?.id) return
    fetch(`${API}/api/users/${tgUser.id}`).then(r => r.json()).then(d => {
      if (d?.quest_score !== undefined) setQuestScore(d.quest_score)
      if (d?.jobs_completed !== undefined) setJobsDone(d.jobs_completed)
      if (d?.dm_enabled !== undefined) setDmEnabled(d.dm_enabled)
      if (d?.x_handle) { setXHandle(d.x_handle); setSavedXHandle(d.x_handle); localStorage.setItem('qw_x_handle', d.x_handle) }
    }).catch(() => {})
  }, [tgUser])

  const handleSave = async () => {
    haptic('heavy')
    localStorage.setItem('qw_bio', bio); localStorage.setItem('qw_skills', skills); localStorage.setItem('qw_availability', availability); localStorage.setItem('qw_x_handle', xHandle)
    setSavedBio(bio); setSavedSkills(skills); setSavedAvailability(availability); setSavedXHandle(xHandle)
    setSaved(true); setIsEditing(false); setTimeout(() => setSaved(false), 2500)
    if (tgUser?.id) {
      try { await fetch(`${API}/api/users/${tgUser.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bio, skills, availability, dm_enabled: dmEnabled, x_handle: xHandle }) }) } catch (_) {}
    }
  }

  const displayName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Guest'
  const bookmarkedGigs = SAMPLE_GIGS.filter(g => bookmarks?.includes(g.id))

  const sections = [
    { title: 'Preferences', items: [
      { label: 'Appearance', value: theme === 'dark' ? 'Dark' : 'Light', arrow: true, action: cycleTheme },
      { label: 'Notifications', value: notificationsOn ? 'On' : 'Off', arrow: true, action: () => setNotificationsOn(!notificationsOn) },
      { label: 'Open to Messages (DM)', value: dmEnabled ? 'On' : 'Off', arrow: true, action: async () => {
        const next = !dmEnabled; setDmEnabled(next)
        if (tgUser?.id) { try { await fetch(`${API}/api/users/${tgUser.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dm_enabled: next }) }) } catch (_) {} }
      }},
    ]},
    { title: 'Help', items: [
      { label: 'Support', value: '', arrow: true, action: () => { haptic('light'); window.open('https://t.me/QuestWorkSupport') } },
      { label: 'Terms & Conditions', value: '', arrow: true, action: () => { haptic('light'); window.open('https://t.me/QuestWorkSupport?start=terms') } },
      { label: 'Privacy Policy', value: '', arrow: true, action: () => { haptic('light'); window.open('https://t.me/QuestWorkSupport?start=privacy') } },
    ]},
    { title: 'QuestWork Social', items: [
      { label: 'Telegram', value: '@TheCryptoQuestHub', arrow: true, action: () => { haptic('light'); window.open('https://t.me/TheCryptoQuestHub') } },
      { label: 'X (Twitter)', value: '@TheCryptoQuestHub', arrow: true, action: () => { haptic('light'); window.open('https://twitter.com/TheCryptoQuestHub') } },
      { label: 'Instagram', value: '@questwork.io', arrow: true, action: () => { haptic('light'); window.open('https://www.instagram.com/questwork.io') } },
    ]},
  ]

  const inp = { width: '100%', padding: '12px 14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: '24px 20px', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          {tgUser?.photo_url
            ? <img src={tgUser.photo_url} style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${colors.border}`, objectFit: 'cover', flexShrink: 0 }} alt="avatar"/>
            : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: colors.goldBg, border: `2px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', color: colors.gold, flexShrink: 0 }}>{tgUser?.first_name?.[0] || '?'}</div>
          }
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: colors.text }}>{displayName}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: isPremium ? 'rgba(245,200,66,0.15)' : colors.surface2, color: isPremium ? '#F5C842' : colors.text2, fontWeight: '600', border: `1px solid ${isPremium ? 'rgba(245,200,66,0.3)' : colors.border}` }}>{isPremium ? '⭐ Premium' : 'Free Plan'}</div>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: savedAvailability === 'Available' ? colors.greenBg : colors.surface2, color: savedAvailability === 'Available' ? colors.green : colors.text2, fontWeight: '500', border: `1px solid ${savedAvailability === 'Available' ? colors.greenBorder : colors.border}` }}>{savedAvailability}</div>
            </div>
          </div>
        </div>

        {/* QuestScore */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, marginBottom: '12px' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: colors.gold }}>{questScore}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: colors.gold }}>QuestScore</div>
            <div style={{ fontSize: '11px', color: colors.goldDeep }}>{jobsDone} gig{jobsDone !== 1 ? 's' : ''} completed · increases with each payment</div>
          </div>
          <IconStar size={20}/>
        </div>

        {backupEmail ? (
          <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '10px', background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: '10px', fontWeight: '600', color: colors.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Backup Login</div><div style={{ fontSize: '13px', color: colors.text, marginTop: '1px' }}>{backupEmail}</div></div>
            <div style={{ fontSize: '11px', color: colors.green, fontWeight: '600' }}>✓ Set</div>
          </div>
        ) : (
          <button onClick={() => setShowSignup(true)} style={{ width: '100%', padding: '11px', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px', textAlign: 'center' }}>⚠️ Set Backup Login (Telegram Ban Protection)</button>
        )}

        {savedBio && !isEditing && <div style={{ marginBottom: '10px', padding: '10px 12px', borderRadius: '10px', background: colors.surface2, border: `1px solid ${colors.border}` }}><div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>About</div><div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5 }}>{savedBio}</div></div>}
        {savedSkills && !isEditing && <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{savedSkills.split(',').map((s, i) => <div key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold, fontWeight: '500' }}>{s.trim()}</div>)}</div>}
        {savedXHandle && !isEditing && <div style={{ marginBottom: '14px', fontSize: '12px', color: colors.text2 }}>𝕏 @{savedXHandle.replace('@', '')}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['profile', 'bookmarks', 'applications'].map(tab => (
            <button key={tab} onClick={() => { haptic('light'); setActiveTab(tab); if (tab !== 'profile') setIsEditing(false) }} style={{ flex: 1, padding: '9px 4px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', background: activeTab === tab ? colors.btnBg : colors.surface2, border: `1px solid ${activeTab === tab ? colors.btnBg : colors.border}`, color: activeTab === tab ? colors.btnText : colors.text2, cursor: 'pointer' }}>
              {tab === 'applications' ? 'Applied' : tab === 'bookmarks' ? `Saved${bookmarks?.length > 0 ? ` (${bookmarks.length})` : ''}` : 'Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          !isEditing ? (
            <div>
              {!savedBio && !savedSkills && <div style={{ textAlign: 'center', padding: '12px 0 8px', color: colors.text2 }}><div style={{ fontSize: '13px' }}>No profile info yet. Tap Edit Profile.</div></div>}
              {saved && <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', background: colors.greenBg, border: `1px solid ${colors.greenBorder}`, color: colors.green, fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>✓ Profile saved!</div>}
              <button onClick={() => { haptic('light'); setBio(savedBio); setSkills(savedSkills); setAvailability(savedAvailability); setXHandle(savedXHandle); setIsEditing(true) }} style={{ width: '100%', padding: '13px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>✏️ Edit Profile</button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Availability</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Available', 'Busy', 'Open to Offers'].map(a => <button key={a} onClick={() => { haptic('light'); setAvailability(a) }} style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', fontSize: '10px', fontWeight: '600', background: availability === a ? colors.btnBg : colors.surface2, border: `1px solid ${availability === a ? colors.btnBg : colors.border}`, color: availability === a ? colors.btnText : colors.text2, cursor: 'pointer' }}>{a}</button>)}
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>About Me</div><textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell clients about yourself..." style={{ ...inp, height: '80px', resize: 'none' }} /></div>
              <div style={{ marginBottom: '14px' }}><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Skills (comma separated)</div><input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. Community Management, BD, Writing..." style={inp} /></div>
              <div style={{ marginBottom: '14px' }}><div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>X (Twitter) Handle</div><input value={xHandle} onChange={e => setXHandle(e.target.value)} placeholder="@yourhandle" style={inp} /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { haptic('light'); setBio(savedBio); setSkills(savedSkills); setAvailability(savedAvailability); setXHandle(savedXHandle); setIsEditing(false) }} style={{ flex: 1, padding: '13px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ flex: 2, padding: '13px', borderRadius: '12px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Save Profile</button>
              </div>
            </>
          )
        )}

        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedGigs.length === 0
              ? <div style={{ textAlign: 'center', padding: '30px 20px', color: colors.text2 }}><div style={{ fontSize: '24px', marginBottom: '8px' }}>🔖</div><div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '6px', color: colors.text }}>No saved gigs yet</div></div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{bookmarkedGigs.map(g => <div key={g.id} style={{ background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px', color: colors.text }}>{g.title}</div><div style={{ fontSize: '12px', color: colors.text2 }}>{g.company} · {g.pay}</div></div><div style={{ color: colors.gold }}><IconBookmark size={16} filled/></div></div>)}</div>
            }
          </div>
        )}

        {activeTab === 'applications' && <ApplicationsReceived colors={colors} dark={dark} tgUser={tgUser}/>}
      </div>

      {!isPremium && (
        <div onClick={() => { haptic('medium'); setShowPayment(true) }} style={{ background: dark ? 'rgba(200,169,90,0.06)' : 'rgba(200,169,90,0.04)', border: `1px solid ${colors.goldBorder}`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', cursor: 'pointer' }}>
          <div><div style={{ fontSize: '14px', fontWeight: '700', color: colors.text }}>Upgrade to Premium</div><div style={{ fontSize: '12px', color: colors.text2, marginTop: '2px' }}>Messaging, AI features, priority visibility</div></div>
          <div style={{ background: colors.gold, color: '#0B1220', fontSize: '12px', fontWeight: '700', padding: '8px 14px', borderRadius: '10px' }}>$15/mo</div>
        </div>
      )}

      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '4px' }}>{section.title}</div>
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden' }}>
            {section.items.map((item, ii) => (
              <div key={ii} onClick={() => { if (item.action) { haptic('light'); item.action() } }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: ii < section.items.length - 1 ? `1px solid ${colors.border}` : 'none', cursor: item.action ? 'pointer' : 'default' }}>
                <span style={{ flex: 1, fontSize: '15px', fontWeight: '500', color: colors.text }}>{item.label}</span>
                {item.value && <span style={{ fontSize: '13px', color: item.label.includes('DM') ? (dmEnabled ? colors.green : colors.text2) : item.label === 'Notifications' ? (notificationsOn ? colors.green : colors.text2) : colors.text2 }}>{item.value}</span>}
                {item.arrow && <span style={{ fontSize: '16px', color: colors.text2 }}>›</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Founder card */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>Meet the Founder</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: colors.goldBg, border: `2px solid ${colors.goldBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700', color: colors.gold, flexShrink: 0 }}>A</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px', color: colors.text }}>Aminu Abdulhamid</div>
            <div style={{ fontSize: '12px', color: colors.text2 }}>Founder & CEO, QuestWork</div>
            <div style={{ fontSize: '12px', color: colors.gold, marginTop: '2px' }}>@TheCryptoQuestHub</div>
          </div>
        </div>
        <div style={{ fontSize: '13px', color: colors.text2, lineHeight: 1.7, marginBottom: '14px' }}>Building the on-chain talent economy for Web3 professionals worldwide. QuestWork is my mission to ensure your reputation travels with you — forever.</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['Telegram', 'https://t.me/TheCryptoQuestHub'], ['X (Twitter)', 'https://twitter.com/TheCryptoQuestHub'], ['Instagram', 'https://instagram.com/questwork.io']].map(([label, url]) => (
            <button key={label} onClick={() => { haptic('light'); window.open(url, '_blank') }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
        <div style={{ fontSize: '12px', color: colors.text2 }}>QuestWork v1.0.0</div>
        <div style={{ fontSize: '11px', color: colors.text2, marginTop: '2px', opacity: 0.6 }}>Web3 Freelance Network</div>
      </div>

      {/* Premium payment modal */}
      {showPayment && (
        <div onClick={() => setShowPayment(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#0B1220' : '#fff', borderRadius: '24px', padding: '28px 24px 32px', width: '100%', maxWidth: '420px', border: `1px solid ${colors.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', textAlign: 'center', color: colors.text }}>Go Premium</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '24px', textAlign: 'center' }}>$15/month · Cancel anytime</div>
            <div style={{ background: colors.surface2, borderRadius: '14px', padding: '14px', marginBottom: '20px', border: `1px solid ${colors.border}` }}>
              {['Message any freelancer or client', 'Create escrow contracts', 'AI Pitch Writer', 'Priority visibility', 'Premium badge', 'Unlimited applications'].map((f, i, arr) => (
                <div key={i} style={{ fontSize: '13px', padding: '6px 0', borderBottom: i < arr.length - 1 ? `1px solid ${colors.border}` : 'none', color: colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: colors.green }}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['usdt', 'card'].map(m => <button key={m} onClick={() => setPaymentMethod(m)} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: paymentMethod === m ? colors.btnBg : colors.surface2, border: `1px solid ${paymentMethod === m ? colors.btnBg : colors.border}`, color: paymentMethod === m ? colors.btnText : colors.text2, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{m === 'card' ? 'Credit Card' : 'USDT'}</button>)}
            </div>
            {paymentMethod === 'usdt' && (
              <div>
                <div style={{ background: colors.surface2, borderRadius: '14px', padding: '16px', marginBottom: '16px', border: `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Send $15 USDT (TRC20) to:</div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: colors.text, wordBreak: 'break-all', lineHeight: 1.6 }}>THXAwQnQ22bjq3C862C4yejXcFeEZ8dcJW</div>
                  <button onClick={() => { haptic('medium'); navigator.clipboard.writeText('THXAwQnQ22bjq3C862C4yejXcFeEZ8dcJW') }} style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '10px', cursor: 'pointer', background: colors.goldBg, border: `1px solid ${colors.goldBorder}`, color: colors.gold, fontSize: '13px', fontWeight: '600' }}>Copy Address</button>
                </div>
                <div style={{ background: colors.surface2, borderRadius: '14px', padding: '14px', marginBottom: '16px', border: `1px solid ${colors.border}`, fontSize: '12px', color: colors.text2, lineHeight: 1.6 }}>After sending, DM @QuestWorkSupport with your transaction hash to activate Premium instantly.</div>
                <button onClick={() => { haptic('medium'); window.open('https://t.me/QuestWorkSupport', '_blank'); setShowPayment(false) }} style={{ width: '100%', padding: '16px', borderRadius: '14px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>I've Sent Payment →</button>
              </div>
            )}
            {paymentMethod === 'card' && (
              <div>
                <div style={{ padding: '20px', background: colors.surface2, borderRadius: '14px', marginBottom: '16px', border: `1px solid ${colors.border}`, textAlign: 'center', color: colors.text2, fontSize: '13px' }}>Contact @QuestWorkSupport to set up card payment.</div>
                <button onClick={() => { haptic('light'); window.open('https://t.me/QuestWorkSupport', '_blank') }} style={{ width: '100%', padding: '15px', borderRadius: '14px', background: colors.btnBg, border: 'none', color: colors.btnText, fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Contact Support</button>
              </div>
            )}
            <button onClick={() => setShowPayment(false)} style={{ width: '100%', padding: '12px', borderRadius: '14px', marginTop: '10px', background: 'none', border: 'none', color: colors.text2, fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const { theme, resolved, cycleTheme } = useTheme()
  const [active, setActive] = useState('home')
  const [animating, setAnimating] = useState(false)
  const [tgUser, setTgUser] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [notificationsOn, setNotificationsOn] = useState(() => localStorage.getItem('qw_notifications') !== 'off')
  const dark = resolved === 'dark'
  const colors = getColors(dark)

  const [showMessages, setShowMessages] = useState(false)
  const [messagingRecipient, setMessagingRecipient] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showSignup, setShowSignup] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [backupEmail, setBackupEmail] = useState(() => localStorage.getItem('qw_backup_email') || '')
  const [bookmarks, setBookmarks] = useState(() => { try { return JSON.parse(localStorage.getItem('qw_bookmarks') || '[]') } catch { return [] } })
  const [selectedGig, setSelectedGig] = useState(null)

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.disableVerticalSwipes?.()
      // Prevent zoom on input focus
      const meta = document.createElement('meta')
      meta.name = 'viewport'
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
      document.head.appendChild(meta)
    }
    document.body.style.margin = '0'; document.body.style.padding = '0'

    const user = window.Telegram?.WebApp?.initDataUnsafe?.user
    if (user) {
      setTgUser(user)
      const userId = String(user.id)
      fetch(`${API}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tg_id: userId, tg_username: user.username || '', first_name: user.first_name || '', last_name: user.last_name || '' }) }).catch(() => {})
      fetch(`${API}/api/users/${userId}`).then(r => r.json()).then(d => { if (d?.is_premium) setIsPremium(true) }).catch(() => {})
      if (!localStorage.getItem('qw_signup_done')) setTimeout(() => setShowSignup(true), 2000)
      const pollUnread = () => fetch(`${API}/api/messages/unread/${userId}`).then(r => r.json()).then(d => setUnreadCount(d.count || 0)).catch(() => {})
      pollUnread()
      const iv = setInterval(pollUnread, 10000)
      return () => clearInterval(iv)
    }
  }, [])

  useEffect(() => {
    document.body.style.backgroundColor = dark ? '#000000' : '#F4F1EA'
    document.documentElement.style.backgroundColor = dark ? '#000000' : '#F4F1EA'
  }, [dark])

  const toggleBookmark = (gigId) => {
    haptic('medium')
    setBookmarks(prev => {
      const next = prev.includes(gigId) ? prev.filter(id => id !== gigId) : [...prev, gigId]
      localStorage.setItem('qw_bookmarks', JSON.stringify(next)); return next
    })
  }

  const navigate = (tab) => {
    if (tab === active) return
    haptic('light'); setAnimating(true)
    setTimeout(() => { setActive(tab); setAnimating(false) }, 150)
  }

  const openMessaging = (recipient = null) => {
    if (!isPremium && recipient) { setShowPaywall(true); return }
    setMessagingRecipient(recipient); setShowMessages(true)
  }

  const handleUpgrade = () => { setShowPaywall(true) }

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, color: colors.text, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', WebkitFontSmoothing: 'antialiased', position: 'relative', overflowX: 'hidden', transition: 'background-color 0.3s ease', boxSizing: 'border-box' }}>

      {/* Top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '16px 20px 12px', background: dark ? 'rgba(0,0,0,0.92)' : 'rgba(244,241,234,0.92)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: colors.text }}><LOGO_SVG/></div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1, color: colors.text }}>QuestWork</div>
            <div style={{ fontSize: '9px', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>Freelance Network</div>
          </div>
        </div>
        <button onClick={() => setShowMessages(true)} style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', background: colors.surface2, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: colors.text }}>
          <IconMessage size={20}/>
          {unreadCount > 0 && (
            <div style={{ position: 'absolute', top: '1px', right: '1px', minWidth: '16px', height: '16px', borderRadius: '8px', background: colors.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '700', color: '#fff', border: `2px solid ${dark ? '#000' : '#F4F1EA'}`, padding: '0 3px' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Page content */}
      <div style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.15s ease, transform 0.15s ease', paddingBottom: '80px', position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
        {active === 'home'    && <HomePage    colors={colors} dark={dark} navigate={navigate} tgUser={tgUser} isPremium={isPremium} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig}/>}
        {active === 'gigs'    && <GigsPage    colors={colors} dark={dark} tgUser={tgUser} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setSelectedGig={setSelectedGig}/>}
        {active === 'post'    && <PostPage    colors={colors} dark={dark} tgUser={tgUser}/>}
        {active === 'search'  && <SearchPage  colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} onMessage={openMessaging} onUpgrade={handleUpgrade}/>}
        {active === 'profile' && <ProfilePage colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} setIsPremium={setIsPremium} notificationsOn={notificationsOn} setNotificationsOn={(val) => { setNotificationsOn(val); localStorage.setItem('qw_notifications', val ? 'on' : 'off') }} cycleTheme={cycleTheme} theme={theme} bookmarks={bookmarks} backupEmail={backupEmail} setShowSignup={setShowSignup} onUpgrade={handleUpgrade}/>}
      </div>

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: colors.navBg, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 24px 0', width: '100vw', boxSizing: 'border-box' }}>
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={() => navigate(id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: isActive ? colors.gold : colors.text2, padding: '4px 12px', borderRadius: '12px', transition: 'all 0.2s ease', transform: isActive ? 'scale(1.08)' : 'scale(1)' }}>
              <Icon size={22}/>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '700' : '400', letterSpacing: '0.02em' }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Full screen messaging */}
      {showMessages && (
        <MessagingScreen tgUser={tgUser} isPremium={isPremium} colors={colors} dark={dark} initialRecipient={messagingRecipient} onClose={() => { setShowMessages(false); setMessagingRecipient(null) }} onUpgrade={() => { setShowMessages(false); setShowPaywall(true) }}/>
      )}

      {/* Premium paywall */}
      {showPaywall && (
        <PremiumPaywallModal colors={colors} dark={dark} onClose={() => setShowPaywall(false)} onUpgrade={() => { setShowPaywall(false); navigate('profile') }}/>
      )}

      {/* Modals */}
      {showSignup && <SignupModal colors={colors} dark={dark} onSave={(email) => { setBackupEmail(email); setShowSignup(false) }}/>}
      {selectedGig && <GigDetailModal gig={selectedGig} colors={colors} dark={dark} tgUser={tgUser} isPremium={isPremium} onClose={() => setSelectedGig(null)} bookmarks={bookmarks} toggleBookmark={toggleBookmark}/>}
    </div>
  )
}