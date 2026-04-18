import { useState } from 'react'

const LOGO_SVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="30" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 24 44)"/>
    <rect x="35" y="25" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 49 39)"/>
    <path d="M58 35 L75 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M68 18 L75 18 L75 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

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

function useTheme() {
  const [theme, setTheme] = useState('dark')
  const cycleTheme = () => setTheme(t => t === 'dark' ? 'light' : t === 'light' ? 'system' : 'dark')
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  return { theme, resolved, cycleTheme }
}

function ThemeIcon({ theme }) {
  if (theme === 'dark') return <span style={{fontSize:'16px'}}>🌙</span>
  if (theme === 'light') return <span style={{fontSize:'16px'}}>☀️</span>
  return <span style={{fontSize:'16px'}}>⚙️</span>
}

export default function App() {
  const { theme, resolved, cycleTheme } = useTheme()
  const [active, setActive] = useState('home')
  const [animating, setAnimating] = useState(false)
  const dark = resolved === 'dark'

  const colors = {
    bg: dark ? '#000000' : '#F2F2F7',
    surface2: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.8)',
    border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#FFFFFF' : '#000000',
    text2: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    accent: dark ? '#FFFFFF' : '#000000',
    accentBg: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    accentBorder: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    navBg: dark ? 'rgba(18,18,18,0.92)' : 'rgba(249,249,249,0.92)',
    card: dark ? 'rgba(28,28,30,1)' : 'rgba(255,255,255,1)',
    btnText: dark ? '#000000' : '#FFFFFF',
    btnBg: dark ? '#FFFFFF' : '#000000',
  }

  const navigate = (tab) => {
    if (tab === active) return
    setAnimating(true)
    setTimeout(() => { setActive(tab); setAnimating(false) }, 150)
  }

  const tabs = [
    { id: 'home', emoji: '⊞', label: 'Home' },
    { id: 'gigs', emoji: '◈', label: 'Gigs' },
    { id: 'post', emoji: '⊕', label: 'Post' },
    { id: 'profile', emoji: '◉', label: 'Profile' },
  ]

  return (
    <div style={{
      backgroundColor: colors.bg,
      minHeight: '100vh',
      color: colors.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
      WebkitFontSmoothing: 'antialiased',
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>

      {dark && (
        <div style={{
          position: 'fixed', top: '-200px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)',
          filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0
        }}/>
      )}

      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: '16px 20px 12px',
        background: dark ? 'rgba(0,0,0,0.85)' : 'rgba(242,242,247,0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ color: colors.text }}><LOGO_SVG /></div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1 }}>QuestWork</div>
            <div style={{ fontSize: '9px', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>Freelance Network</div>
          </div>
        </div>
        <button onClick={cycleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: colors.surface2, border: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <ThemeIcon theme={theme} />
        </button>
      </div>

      <div style={{
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.15s ease, transform 0.15s ease',
        paddingBottom: '90px', position: 'relative', zIndex: 1
      }}>
        {active === 'home' && <HomePage colors={colors} dark={dark} navigate={navigate}/>}
        {active === 'gigs' && <GigsPage colors={colors} dark={dark}/>}
        {active === 'post' && <PostPage colors={colors} dark={dark}/>}
        {active === 'profile' && <ProfilePage colors={colors} dark={dark}/>}
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        padding: '8px 16px 28px',
        background: colors.navBg,
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTop: `1px solid ${colors.border}`,
        display: 'flex', justifyContent: 'space-around'
      }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => navigate(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: active === tab.id ? colors.accent : colors.text2,
            padding: '6px 20px', borderRadius: '12px',
            transition: 'all 0.2s ease',
            transform: active === tab.id ? 'scale(1.05)' : 'scale(1)'
          }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{tab.emoji}</span>
            <span style={{ fontSize: '10px', fontWeight: active === tab.id ? '600' : '400' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function HomePage({ colors, dark, navigate }) {
  return (
    <div>
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '6px' }}>Good day 👋</div>
        <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.8px', lineHeight: 1.2, marginBottom: '6px' }}>
          Find your next<br /><span style={{ color: colors.accent }}>Web3 Quest</span>
        </div>
        <div style={{ fontSize: '14px', color: colors.text2 }}>Global gigs. Crypto payments. Zero friction.</div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '13px 16px', borderRadius: '14px',
          background: colors.surface2, border: `1px solid ${colors.border}`,
        }}>
          <span style={{ fontSize: '15px', opacity: 0.5 }}>🔍</span>
          <span style={{ fontSize: '14px', color: colors.text2 }}>Search gigs, skills, companies...</span>
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { value: '120+', label: 'Active Gigs', emoji: '💼' },
            { value: '500+', label: 'Freelancers', emoji: '🌍' },
            { value: '$50K+', label: 'Paid Out', emoji: '💰' },
          ].map((s, i) => (
            <div key={i} style={{
              background: colors.card, border: `1px solid ${colors.border}`,
              borderRadius: '16px', padding: '14px 10px', textAlign: 'center',
              boxShadow: dark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
            }}>
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
            <button key={cat} style={{
              padding: '7px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
              background: i === 0 ? colors.btnBg : colors.surface2,
              border: `1px solid ${i === 0 ? colors.btnBg : colors.border}`,
              color: i === 0 ? colors.btnText : colors.text,
              fontSize: '13px', fontWeight: i === 0 ? '600' : '400',
              cursor: 'pointer'
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Featured</div>
          <button onClick={() => navigate('gigs')} style={{ fontSize: '13px', color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>See all →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAMPLE_GIGS.filter(g => g.featured).map((gig) => (
            <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>Latest Gigs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAMPLE_GIGS.filter(g => !g.featured).map((gig) => (
            <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GigCard({ gig, colors, dark }) {
  const [pressed, setPressed] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const [pitch, setPitch] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = async () => {
    if (!pitch.trim()) {
      alert('Please write a short pitch!')
      return
    }
    setApplying(true)
    try {
      const sql = (await import('./lib/db.js')).default
      await sql`
        INSERT INTO applications (gig_id, applicant_tg_id, applicant_username, pitch, status)
        VALUES (${gig.id}, ${'user_123'}, ${'@user'}, ${pitch}, 'pending')
      `
      setApplied(true)
      setShowApply(false)
      setPitch('')
    } catch (err) {
      console.error(err)
      alert('Error submitting application. Please try again.')
    }
    setApplying(false)
  }

  return (
    <>
      <div
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        style={{
          background: colors.card,
          border: `1px solid ${gig.featured ? colors.accentBorder : colors.border}`,
          borderRadius: '18px', padding: '16px',
          boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
          transform: pressed ? 'scale(0.98)' : 'scale(1)',
          transition: 'transform 0.15s ease',
          cursor: 'pointer'
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            {gig.featured && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '10px', fontWeight: '600', letterSpacing: '0.06em',
                padding: '3px 8px', borderRadius: '6px',
                background: colors.accentBg, color: colors.accent,
                marginBottom: '7px', textTransform: 'uppercase'
              }}>★ Featured</div>
            )}
            <div style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.3px', marginBottom: '3px' }}>{gig.title}</div>
            <div style={{ fontSize: '13px', color: colors.text2 }}>{gig.company}</div>
          </div>
          <div style={{ textAlign: 'right', marginLeft: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>{gig.pay}</div>
            <div style={{
              fontSize: '11px', marginTop: '4px', padding: '2px 8px',
              borderRadius: '6px', background: colors.surface2,
              color: colors.text2, display: 'inline-block'
            }}>{gig.tag}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{
            fontSize: '11px', padding: '3px 9px', borderRadius: '6px',
            background: colors.surface2, color: colors.text2, fontWeight: '500'
          }}>{gig.category}</div>
          <button
            onClick={() => applied ? null : setShowApply(true)}
            style={{
              flex: 1, padding: '10px', borderRadius: '12px',
              background: applied ? 'rgba(52,211,153,0.1)' : colors.btnBg,
              border: applied ? '1px solid rgba(52,211,153,0.3)' : 'none',
              color: applied ? '#34d399' : colors.btnText,
              fontSize: '13px', fontWeight: '600',
              cursor: applied ? 'default' : 'pointer',
              transition: 'all 0.2s ease'
            }}>
            {applied ? '✅ Applied' : 'Apply Now'}
          </button>
        </div>
      </div>

      {/* APPLY MODAL */}
      {showApply && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }} onClick={() => setShowApply(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: dark ? '#1c1c1e' : '#ffffff',
              borderRadius: '24px 24px 0 0',
              padding: '24px 20px 40px',
              width: '100%', maxWidth: '480px',
              border: `1px solid ${colors.border}`
            }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: colors.border, margin: '0 auto 20px' }}/>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Apply for {gig.title}</div>
            <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '20px' }}>{gig.company} · {gig.pay}</div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Your Pitch</div>
            <textarea
              value={pitch}
              onChange={e => setPitch(e.target.value)}
              placeholder="Tell them why you're the perfect fit..."
              style={{
                width: '100%', height: '120px', padding: '14px',
                borderRadius: '12px', resize: 'none',
                background: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.8)',
                border: `1px solid ${colors.border}`,
                color: colors.text, fontSize: '15px',
                fontFamily: 'inherit', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={() => setShowApply(false)}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px',
                  background: colors.surface2, border: `1px solid ${colors.border}`,
                  color: colors.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                }}>Cancel</button>
              <button
                onClick={handleApply}
                disabled={applying}
                style={{
                  flex: 2, padding: '14px', borderRadius: '12px',
                  background: applying ? colors.surface2 : colors.btnBg,
                  border: 'none',
                  color: applying ? colors.text2 : colors.btnText,
                  fontSize: '15px', fontWeight: '700', cursor: applying ? 'not-allowed' : 'pointer'
                }}>{applying ? 'Submitting...' : 'Submit Application →'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function GigsPage({ colors, dark }) {
  const [filter, setFilter] = useState('All')
  const [dbGigs, setDbGigs] = useState([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    const loadGigs = async () => {
      try {
        const sql = (await import('./lib/db.js')).default
        const result = await sql`SELECT * FROM gigs WHERE is_active = true ORDER BY created_at DESC`
        setDbGigs(result)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    loadGigs()
  }, [])

  const allGigs = [...dbGigs, ...SAMPLE_GIGS]
  const categories = ['All', 'Community Management', 'Business Development', 'Development', 'Social Media', 'Writing']
  const filtered = filter === 'All' ? allGigs : allGigs.filter(g => g.category === filter)

  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '20px' }}>All Gigs</div>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px' }}>
        {['All', 'Community', 'BD', 'Dev', 'Social', 'Writing'].map((cat, i) => (
          <button key={cat} onClick={() => setFilter(i === 0 ? 'All' : categories[i])} style={{
            padding: '7px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
            background: filter === (i === 0 ? 'All' : categories[i]) ? colors.btnBg : colors.surface2,
            border: `1px solid ${filter === (i === 0 ? 'All' : categories[i]) ? colors.btnBg : colors.border}`,
            color: filter === (i === 0 ? 'All' : categories[i]) ? colors.btnText : colors.text,
            fontSize: '13px', fontWeight: '500', cursor: 'pointer'
          }}>{cat}</button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.text2 }}>Loading gigs...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((gig) => (
            <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} />
          ))}
        </div>
      )}
    </div>
  )
}

function PostPage({ colors, dark }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '', category: 'Community Management',
    description: '', pay_usdt: '',
    duration: '1 Month', region: 'Global'
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.pay_usdt) {
      alert('Please fill in all required fields!')
      return
    }
    setLoading(true)
    try {
      const sql = (await import('./lib/db.js')).default
      await sql`
        INSERT INTO gigs (title, category, description, pay_usdt, duration, region, is_active)
        VALUES (${form.title}, ${form.category}, ${form.description}, ${form.pay_usdt}, ${form.duration}, ${form.region}, true)
      `
      setSuccess(true)
      setForm({ title: '', category: 'Community Management', description: '', pay_usdt: '', duration: '1 Month', region: 'Global' })
    } catch (err) {
      alert('Error saving gig. Please try again.')
      console.error(err)
    }
    setLoading(false)
  }

  const input = {
    width: '100%', padding: '13px 14px', borderRadius: '12px',
    background: colors.surface2, border: `1px solid ${colors.border}`,
    color: colors.text, fontSize: '15px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '6px' }}>Post a Gig</div>
      <div style={{ fontSize: '14px', color: colors.text2, marginBottom: '24px' }}>Find the perfect Web3 talent</div>
      {success && (
        <div style={{
          background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: '12px', padding: '14px', marginBottom: '20px',
          color: '#34d399', fontSize: '14px', textAlign: 'center'
        }}>✅ Gig posted successfully!</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Role Title *</div>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Community Manager" style={input} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Category</div>
          <select name="category" value={form.category} onChange={handleChange} style={{ ...input, appearance: 'none' }}>
            <option>Community Management</option>
            <option>Business Development</option>
            <option>Development</option>
            <option>Social Media</option>
            <option>Writing</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Description *</div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the role..." style={{ ...input, height: '100px', resize: 'none' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Budget (USDT) *</div>
            <input name="pay_usdt" value={form.pay_usdt} onChange={handleChange} type="number" placeholder="500" style={input} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Duration</div>
            <select name="duration" value={form.duration} onChange={handleChange} style={{ ...input, appearance: 'none' }}>
              <option>1 Week</option>
              <option>1 Month</option>
              <option>3 Months</option>
              <option>Ongoing</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Region</div>
          <select name="region" value={form.region} onChange={handleChange} style={{ ...input, appearance: 'none' }}>
            <option>Global</option>
            <option>Africa</option>
            <option>MENA</option>
            <option>Remote</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '16px', borderRadius: '14px', marginTop: '8px',
          background: loading ? colors.surface2 : colors.btnBg, border: 'none',
          color: loading ? colors.text2 : colors.btnText,
          fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
        }}>{loading ? 'Posting...' : 'Post Gig →'}</button>
      </div>
    </div>
  )
}

function ProfilePage({ colors, dark }) {
  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '24px' }}>Profile</div>
      <div style={{
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: '20px', padding: '20px', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: dark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: '700', flexShrink: 0
        }}>A</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>Al-amin</div>
          <div style={{ fontSize: '13px', color: colors.text2, marginTop: '2px' }}>@alameen · Web3 Builder</div>
          <div style={{ marginTop: '6px' }}>
            <div style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: colors.accentBg, color: colors.accent, fontWeight: '600', display: 'inline-block' }}>⭐ QuestScore: 0</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'Applications Sent', value: '0' },
          { label: 'Gigs Completed', value: '0' },
          { label: 'Total Earned', value: '$0 USDT' },
        ].map((item, i) => (
          <div key={i} style={{
            background: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '14px', color: colors.text2 }}>{item.label}</span>
            <span style={{ fontSize: '16px', fontWeight: '700' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}