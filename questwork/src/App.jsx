import { useState, useEffect } from 'react'
import DropIn from 'braintree-web-drop-in'
const LOGO_SVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="30" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 24 44)"/>
    <rect x="35" y="25" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 49 39)"/>
    <path d="M58 35 L75 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M68 18 L75 18 L75 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const API = 'https://questwork.up.railway.app'

const SAMPLE_GIGS = [
  { id: 1, title: "Community Manager", company: "Sui Network", pay: "$800/mo", tag: "Africa", category: "Community Management", featured: true },
  { id: 2, title: "BD Manager", company: "TON Wallet", pay: "$1,200/mo", tag: "MENA", category: "Business Development", featured: true },
  { id: 3, title: "Social Media Manager", company: "BNB Chain", pay: "$600/mo", tag: "Global", category: "Social Media", featured: false },
  { id: 4, title: "Web3 Writer", company: "CoinDesk", pay: "$400/mo", tag: "Remote", category: "Writing", featured: false },
  { id: 5, title: "Smart Contract Dev", company: "Aave", pay: "$3,000/mo", tag: "Global", category: "Development", featured: false },
  { id: 6, title: "Discord Moderator", company: "Polygon", pay: "$300/mo", tag: "Africa", category: "Community Management", featured: false },
  { id: 7, title: "Growth Hacker", company: "Arbitrum", pay: "$1,500/mo", tag: "MENA", category: "Business Development", featured: false },
  { id: 8, title: "NFT Artist", company: "OpenSea", pay: "$2,000/mo", tag: "Global", category: "Writing", featured: false },
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

function ThemeIcon({ theme }) {
  return <span style={{ fontSize: '16px' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
}

function getLastSeen() {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function App() {
  const { theme, resolved, cycleTheme } = useTheme()
  const [active, setActive] = useState('home')
  const [animating, setAnimating] = useState(false)
  const [tgUser, setTgUser] = useState(null)
  const [notificationsOn, setNotificationsOn] = useState(() => localStorage.getItem('qw_notifications') !== 'off')
  const dark = resolved === 'dark'

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
    if (user) {
      setTgUser(user)
      fetch(`${API}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tg_id: String(user.id), tg_username: user.username || '', first_name: user.first_name || '', last_name: user.last_name || '' })
      })
    }
  }, [])

  useEffect(() => {
    document.body.style.backgroundColor = dark ? '#000000' : '#F2F2F7'
    document.documentElement.style.backgroundColor = dark ? '#000000' : '#F2F2F7'
  }, [dark])

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

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'gigs', label: 'Gigs' },
    { id: 'post', label: 'Post' },
    { id: 'search', label: 'Search' },
    { id: 'profile', label: 'Profile' },
  ]

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, color: colors.text, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', WebkitFontSmoothing: 'antialiased', position: 'relative', overflowX: 'hidden', transition: 'background-color 0.3s ease, color 0.3s ease', boxSizing: 'border-box' }}>

      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '16px 20px 12px', background: dark ? 'rgba(0,0,0,0.92)' : 'rgba(242,242,247,0.92)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: colors.text }}><LOGO_SVG /></div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1 }}>QuestWork</div>
            <div style={{ fontSize: '9px', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>Freelance Network</div>
          </div>
        </div>
        <button onClick={cycleTheme} style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors.surface2, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ThemeIcon theme={theme} />
        </button>
      </div>

      <div style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.15s ease, transform 0.15s ease', paddingBottom: '80px', position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
        {active === 'home' && <HomePage colors={colors} dark={dark} navigate={navigate} tgUser={tgUser} />}
        {active === 'gigs' && <GigsPage colors={colors} dark={dark} tgUser={tgUser} />}
        {active === 'post' && <PostPage colors={colors} dark={dark} tgUser={tgUser} />}
        {active === 'search' && <SearchPage colors={colors} dark={dark} tgUser={tgUser} />}
        {active === 'profile' && <ProfilePage colors={colors} dark={dark} tgUser={tgUser} notificationsOn={notificationsOn} setNotificationsOn={(val) => { setNotificationsOn(val); localStorage.setItem('qw_notifications', val ? 'on' : 'off') }} cycleTheme={cycleTheme} theme={theme} />}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: colors.navBg, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 0 24px 0', width: '100vw', boxSizing: 'border-box' }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', color: active === tab.id ? colors.accent : colors.text2, padding: '6px 12px', borderRadius: '12px', transition: 'all 0.2s ease', transform: active === tab.id ? 'scale(1.08)' : 'scale(1)' }}>
            <span style={{ fontSize: '11px', fontWeight: active === tab.id ? '700' : '400' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function HomePage({ colors, dark, navigate, tgUser }) {
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
      g.tag.toLowerCase().includes(lower)
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
          <span style={{ fontSize: '15px', opacity: 0.5 }}>🔍</span>
          <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search gigs, skills, companies..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: colors.text, fontSize: '14px', fontFamily: 'inherit' }} />
          {search && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: colors.text2, fontSize: '16px', cursor: 'pointer', padding: 0 }}>x</button>}
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
              {filteredGigs.map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} />)}
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ padding: '0 20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[{ value: '120+', label: 'Active Gigs', emoji: '💼' }, { value: '500+', label: 'Freelancers', emoji: '🌍' }, { value: '$50K+', label: 'Paid Out', emoji: '💰' }].map((s, i) => (
                <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '14px 10px', textAlign: 'center', boxShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.emoji}</div>
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
              {SAMPLE_GIGS.filter(g => g.featured).map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} />)}
            </div>
          </div>
          <div style={{ padding: '24px 20px 0' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>Latest Gigs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SAMPLE_GIGS.filter(g => !g.featured).map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} />)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function GigCard({ gig, colors, dark, tgUser }) {
  const [pressed, setPressed] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [pitch, setPitch] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [generatingPitch, setGeneratingPitch] = useState(false)
  const isPremium = false

  const handleAIPitch = async () => {
    haptic('medium')
    if (!isPremium) { alert('Upgrade to Premium to use AI Pitch Writer!'); return }
    setGeneratingPitch(true)
    try {
      const res = await fetch(`${API}/api/ai/pitch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gig_title: gig.title, gig_company: gig.company, user_skills: '', user_bio: '' }) })
      const data = await res.json()
      setPitch(data.pitch)
    } catch (err) { alert('Error generating pitch.') }
    setGeneratingPitch(false)
  }

  const handleApply = async () => {
    if (!pitch.trim()) { haptic('heavy'); alert('Please write a short pitch!'); return }
    haptic('medium'); setApplying(true)
    try {
      await fetch(`${API}/api/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gig_id: gig.id, applicant_tg_id: tgUser ? String(tgUser.id) : 'unknown', applicant_username: tgUser?.username || 'unknown', pitch: `${pitch}\n\nPortfolio: ${portfolio || 'Not provided'}\n\n---\nApplied via QuestWork\nWeb3 Freelance Network | t.me/Questworkbot\nquestworkio.netlify.app` }) })
      if (gig.poster_tg_id) {
        await fetch(`${API}/api/notify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: gig.poster_tg_id, message: `New Application!\n\nGig: ${gig.title}\nFrom: @${tgUser?.username || 'someone'}\nName: ${tgUser?.first_name || 'Unknown'}\n\nPitch: ${pitch}\n\nhttps://questworkio.netlify.app` }) })
      }
      setApplied(true); setShowApply(false); setPitch(''); setPortfolio(''); haptic('heavy')
    } catch (err) { alert('Error submitting.') }
    setApplying(false)
  }

  return (
    <>
      <div onMouseDown={() => { setPressed(true); haptic('light') }} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} onTouchStart={() => { setPressed(true); haptic('light') }} onTouchEnd={() => setPressed(false)} style={{ background: colors.card, border: `1px solid ${gig.featured ? colors.accentBorder : colors.border}`, borderRadius: '18px', padding: '16px', boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)', transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform 0.15s ease', cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            {gig.featured && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '6px', background: colors.accentBg, color: colors.accent, marginBottom: '7px', textTransform: 'uppercase' }}>Featured</div>}
            <div style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.3px', marginBottom: '3px' }}>{gig.title}</div>
            <div style={{ fontSize: '13px', color: colors.text2 }}>{gig.company}</div>
          </div>
          <div style={{ textAlign: 'right', marginLeft: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>{gig.pay}</div>
            <div style={{ fontSize: '11px', marginTop: '4px', padding: '2px 8px', borderRadius: '6px', background: colors.surface2, color: colors.text2, display: 'inline-block' }}>{gig.tag}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: colors.surface2, color: colors.text2, fontWeight: '500' }}>{gig.category}</div>
          <button onClick={() => { haptic('medium'); applied ? null : setShowApply(true) }} style={{ flex: 1, padding: '10px', borderRadius: '12px', background: applied ? 'rgba(52,211,153,0.1)' : colors.btnBg, border: applied ? '1px solid rgba(52,211,153,0.3)' : 'none', color: applied ? '#34d399' : colors.btnText, fontSize: '13px', fontWeight: '600', cursor: applied ? 'default' : 'pointer', transition: 'all 0.2s ease' }}>
            {applied ? 'Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
      {showApply && (
        <div onClick={() => { haptic('light'); setShowApply(false) }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: dark ? '#1c1c1e' : '#ffffff', borderRadius: '24px', padding: '28px 24px 32px', width: '100%', maxWidth: '420px', border: `1px solid ${colors.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }} />
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>Apply for {gig.title}</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '20px' }}>{gig.company} · {gig.pay}</div>
            {tgUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: colors.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' }}>{tgUser.first_name?.[0]}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{tgUser.first_name} {tgUser.last_name || ''}</div>
                  <div style={{ fontSize: '11px', color: colors.text2 }}>@{tgUser.username || 'user'}</div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your Pitch</div>
              <button onClick={handleAIPitch} disabled={generatingPitch} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(0,0,0,0.06)', border: `1px solid ${colors.border}`, color: colors.text2, fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                {generatingPitch ? 'Writing...' : 'AI Write (Premium)'}
              </button>
            </div>
            <textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder="Tell them why you're the perfect fit..." style={{ width: '100%', height: '100px', padding: '14px', borderRadius: '12px', resize: 'none', background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.6)', border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Portfolio / LinkedIn URL</div>
              <input type="text" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="https://your-portfolio.com" style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.6)', border: `1px solid ${colors.border}`, color: colors.text, fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${colors.border}`, fontSize: '11px', color: colors.text2, lineHeight: 1.6 }}>
              Your application will be sent with your QuestWork profile signature
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => { haptic('light'); setShowApply(false) }} style={{ flex: 1, padding: '14px', borderRadius: '12px', background: colors.surface2, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleApply} disabled={applying} style={{ flex: 2, padding: '14px', borderRadius: '12px', background: applying ? colors.surface2 : colors.btnBg, border: 'none', color: applying ? colors.text2 : colors.btnText, fontSize: '15px', fontWeight: '700', cursor: applying ? 'not-allowed' : 'pointer' }}>{applying ? 'Submitting...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function GigsPage({ colors, dark, tgUser }) {
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
          {filtered.map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} />)}
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
      g.tag.toLowerCase().includes(lower)
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
        <span style={{ fontSize: '15px', opacity: 0.5 }}>🔍</span>
        <input value={query} onChange={e => handleSearch(e.target.value)} placeholder={mode === 'gigs' ? 'Search gigs, companies, categories...' : 'Search by name or username...'} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: colors.text, fontSize: '14px', fontFamily: 'inherit' }} />
        {query && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: colors.text2, fontSize: '16px', cursor: 'pointer', padding: 0 }}>x</button>}
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
              {results.map(gig => <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} tgUser={tgUser} />)}
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
              <span style={{ color: colors.text2, fontSize: '16px' }}>{expanded === i ? '-' : '+'}</span>
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

function ProfilePage({ colors, dark, tgUser, notificationsOn, setNotificationsOn, cycleTheme, theme }) {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [dropinInstance, setDropinInstance] = useState(null)
  const [bio, setBio] = useState(() => localStorage.getItem('qw_bio') || '')
  const [skills, setSkills] = useState(() => localStorage.getItem('qw_skills') || '')
  const [availability, setAvailability] = useState(() => localStorage.getItem('qw_availability') || 'Available')
  const [saved, setSaved] = useState(false)
  const [savedBio, setSavedBio] = useState(() => localStorage.getItem('qw_bio') || '')
  const [savedSkills, setSavedSkills] = useState(() => localStorage.getItem('qw_skills') || '')
  const [activeTab, setActiveTab] = useState('profile')
  const [lastSeen] = useState(getLastSeen())
  const isPremium = false

  useEffect(() => {
    if (showPayment && paymentMethod === 'card') {
      const initDropin = async () => {
        try {
          if (dropinInstance) {
            await dropinInstance.teardown()
            setDropinInstance(null)
          }
          const tokenRes = await fetch(`${API}/api/braintree/token`)
          const { token } = await tokenRes.json()
          const instance = await DropIn.create({
            authorization: token,
            container: '#dropin-container'
          })
          setDropinInstance(instance)
        } catch (err) {
          console.error('Dropin init error:', err)
        }
      }
      setTimeout(initDropin, 300)
    }
  }, [showPayment, paymentMethod])

  const handleSave = () => {
    haptic('heavy')
    localStorage.setItem('qw_bio', bio)
    localStorage.setItem('qw_skills', skills)
    localStorage.setItem('qw_availability', availability)
    setSavedBio(bio)
    setSavedSkills(skills)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const displayName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : 'Guest'
  const displayUsername = tgUser?.username || 'guest'

  const sections = [
    { title: 'Preferences', items: [
      { icon: 'Appearance', label: 'Appearance', value: theme === 'dark' ? 'Dark' : 'Light', arrow: true, action: () => cycleTheme() },
      { icon: 'Notifications', label: 'Notifications', value: notificationsOn ? 'On' : 'Off', arrow: true, action: () => setNotificationsOn(!notificationsOn) },
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

      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '20px', marginBottom: '16px', boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          {tgUser?.photo_url ? (
            <img src={tgUser.photo_url} style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${colors.border}`, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', flexShrink: 0, border: `2px solid ${colors.border}` }}>{tgUser ? tgUser.first_name?.[0] : '?'}</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>{displayName}</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginTop: '2px' }}>@{displayUsername}</div>
            <div style={{ fontSize: '11px', color: colors.text2, marginTop: '2px' }}>Active at {lastSeen}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: isPremium ? 'rgba(245,200,66,0.15)' : colors.accentBg, color: isPremium ? '#F5C842' : colors.accent, fontWeight: '600', border: `1px solid ${colors.accentBorder}` }}>{isPremium ? 'Premium' : 'Free Plan'}</div>
              <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: availability === 'Available' ? 'rgba(52,211,153,0.1)' : colors.surface2, color: availability === 'Available' ? '#34d399' : colors.text2, fontWeight: '500', border: `1px solid ${availability === 'Available' ? 'rgba(52,211,153,0.3)' : colors.border}` }}>
                {availability === 'Available' ? 'Available' : availability === 'Busy' ? 'Busy' : 'Open to Offers'}
              </div>
            </div>
          </div>
        </div>

        {savedBio && (
          <div style={{ marginBottom: '10px', padding: '10px 12px', borderRadius: '10px', background: colors.surface2, border: `1px solid ${colors.border}` }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: colors.text2, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>About</div>
            <div style={{ fontSize: '13px', color: colors.text, lineHeight: 1.5 }}>{savedBio}</div>
          </div>
        )}

        {savedSkills && (
          <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {savedSkills.split(',').map((s, i) => (
              <div key={i} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: colors.accentBg, border: `1px solid ${colors.accentBorder}`, color: colors.accent, fontWeight: '500' }}>{s.trim()}</div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['profile', 'applications'].map(tab => (
            <button key={tab} onClick={() => { haptic('light'); setActiveTab(tab) }} style={{ flex: 1, padding: '9px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', background: activeTab === tab ? colors.btnBg : colors.surface2, border: `1px solid ${activeTab === tab ? colors.btnBg : colors.border}`, color: activeTab === tab ? colors.btnText : colors.text2, cursor: 'pointer' }}>
              {tab === 'applications' ? 'Applications Received' : 'Edit Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
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
            <button onClick={handleSave} style={{ width: '100%', padding: '13px', borderRadius: '12px', background: saved ? 'rgba(52,211,153,0.1)' : colors.btnBg, border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none', color: saved ? '#34d399' : colors.btnText, fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease' }}>{saved ? 'Profile Saved!' : 'Save Profile'}</button>
          </>
        )}

        {activeTab === 'applications' && <ApplicationsReceived colors={colors} dark={dark} tgUser={tgUser} />}
      </div>

      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
        {[{ label: 'QuestScore', value: '0' }, { label: 'Applications Sent', value: '0' }, { label: 'Gigs Completed', value: '0' }, { label: 'Total Earned', value: '$0 USDT' }].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
            <span style={{ flex: 1, fontSize: '14px', color: colors.text2 }}>{item.label}</span>
            <span style={{ fontSize: '16px', fontWeight: '700' }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div onClick={() => { haptic('medium'); setShowPayment(true) }} style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: `1px solid ${colors.accentBorder}`, borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', cursor: 'pointer' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700' }}>Upgrade to Premium</div>
          <div style={{ fontSize: '12px', color: colors.text2, marginTop: '2px' }}>AI features, priority visibility and more</div>
        </div>
        <div style={{ background: colors.btnBg, color: colors.btnText, fontSize: '12px', fontWeight: '700', padding: '8px 14px', borderRadius: '10px' }}>$15/mo</div>
      </div>

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

      <div style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: colors.text2 }}>QuestWork v1.0.0</div>
        <div style={{ fontSize: '11px', color: colors.text2, marginTop: '2px', opacity: 0.6 }}>Web3 Freelance Network</div>
      </div>

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
                {paymentError && (
                  <div style={{ fontSize: '13px', color: '#ef4444', padding: '10px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>{paymentError}</div>
                )}
                <button
                  onClick={async () => {
                    if (!dropinInstance) { setPaymentError('Payment form not ready. Please wait.'); return }
                    setProcessing(true)
                    setPaymentError('')
                    try {
                      const payload = await dropinInstance.requestPaymentMethod()
                      const res = await fetch(`${API}/api/braintree/subscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentMethodNonce: payload.nonce, tg_id: tgUser ? String(tgUser.id) : null })
                      })
                      const data = await res.json()
                      if (data.success) {
                        setShowPayment(false)
                        alert('Welcome to Premium! Your account has been upgraded.')
                      } else {
                        setPaymentError(data.error || 'Payment failed. Please try again.')
                      }
                    } catch (err) {
                      setPaymentError('Payment failed. Please check your card details.')
                    }
                    setProcessing(false)
                  }}
                  style={{ width: '100%', padding: '16px', borderRadius: '14px', background: processing ? colors.surface2 : '#F5C842', border: 'none', color: '#000000', fontSize: '16px', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer' }}>
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
