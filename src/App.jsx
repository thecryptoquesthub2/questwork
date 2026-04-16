import { useState } from 'react'

const LOGO_SVG = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="30" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 24 44)"/>
    <rect x="35" y="25" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="8" fill="none" transform="rotate(-15 49 39)"/>
    <path d="M58 35 L75 18" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
    <path d="M68 18 L75 18 L75 25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const gigs = [
  { id: 1, title: "Community Manager", company: "Sui Network", pay: "$800/mo", tag: "Africa", category: "Community", featured: true },
  { id: 2, title: "BD Manager", company: "TON Wallet", pay: "$1,200/mo", tag: "MENA", category: "BD", featured: true },
  { id: 3, title: "Social Media Manager", company: "BNB Chain", pay: "$600/mo", tag: "Global", category: "Social", featured: false },
  { id: 4, title: "Web3 Writer", company: "CoinDesk", pay: "$400/mo", tag: "Remote", category: "Writing", featured: false },
  { id: 5, title: "Smart Contract Dev", company: "Aave", pay: "$3,000/mo", tag: "Global", category: "Dev", featured: false },
]

function useTheme() {
  const [theme, setTheme] = useState('dark')
  const cycleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : t === 'light' ? 'system' : 'dark')
  }
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
    surface: dark ? 'rgba(28,28,30,0.95)' : 'rgba(255,255,255,0.95)',
    surface2: dark ? 'rgba(44,44,46,0.8)' : 'rgba(230,230,235,0.8)',
    border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#FFFFFF' : '#000000',
    text2: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    text3: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
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
    setTimeout(() => {
      setActive(tab)
      setAnimating(false)
    }, 150)
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

      {/* AMBIENT GLOW - subtle in dark mode */}
      {dark && (
        <div style={{
          position: 'fixed', top: '-200px', left: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)',
          filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0
        }}/>
      )}

      {/* HEADER */}
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
          <div style={{ color: colors.text }}>
            <LOGO_SVG />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px', lineHeight: 1 }}>
              QuestWork
            </div>
            <div style={{ fontSize: '9px', color: colors.text2, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>
              Freelance Network
            </div>
          </div>
        </div>
        <button onClick={cycleTheme} style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: colors.surface2,
          border: `1px solid ${colors.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s ease'
        }}>
          <ThemeIcon theme={theme} />
        </button>
      </div>

      {/* PAGE CONTENT */}
      <div style={{
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.15s ease, transform 0.15s ease',
        paddingBottom: '90px',
        position: 'relative', zIndex: 1
      }}>
        {active === 'home' && <HomePage colors={colors} dark={dark} gigs={gigs} navigate={navigate}/>}
        {active === 'gigs' && <GigsPage colors={colors} dark={dark} gigs={gigs}/>}
        {active === 'post' && <PostPage colors={colors} dark={dark}/>}
        {active === 'profile' && <ProfilePage colors={colors} dark={dark}/>}
      </div>

      {/* BOTTOM NAV */}
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

function HomePage({ colors, dark, gigs, navigate }) {
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
              cursor: 'pointer', transition: 'all 0.2s ease'
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
          {gigs.filter(g => g.featured).map((gig) => (
            <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} />
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>Latest Gigs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {gigs.filter(g => !g.featured).map((gig) => (
            <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  )
}

function GigCard({ gig, colors, dark }) {
  const [pressed, setPressed] = useState(false)
  return (
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
        <button style={{
          flex: 1, padding: '10px', borderRadius: '12px',
          background: colors.btnBg,
          border: 'none',
          color: colors.btnText,
          fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>Apply Now</button>
      </div>
    </div>
  )
}

function GigsPage({ colors, dark, gigs }) {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Community', 'BD', 'Dev', 'Social', 'Writing']
  const filtered = filter === 'All' ? gigs : gigs.filter(g => g.category === filter)
  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '20px' }}>All Gigs</div>
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px' }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: '7px 14px', borderRadius: '20px', whiteSpace: 'nowrap',
            background: filter === cat ? colors.btnBg : colors.surface2,
            border: `1px solid ${filter === cat ? colors.btnBg : colors.border}`,
            color: filter === cat ? colors.btnText : colors.text,
            fontSize: '13px', fontWeight: filter === cat ? '600' : '400',
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((gig) => (
          <GigCard key={gig.id} gig={gig} colors={colors} dark={dark} />
        ))}
      </div>
    </div>
  )
}

function PostPage({ colors, dark }) {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Role Title</div>
          <input placeholder="e.g. Community Manager" style={input} />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Category</div>
          <select style={{ ...input, appearance: 'none' }}>
            <option>Community Management</option>
            <option>Business Development</option>
            <option>Development</option>
            <option>Social Media</option>
            <option>Writing</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Description</div>
          <textarea placeholder="Describe the role, responsibilities, and requirements..." style={{ ...input, height: '100px', resize: 'none' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Budget (USDT)</div>
            <input type="number" placeholder="500" style={input} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Duration</div>
            <select style={{ ...input, appearance: 'none' }}>
              <option>1 Week</option>
              <option>1 Month</option>
              <option>3 Months</option>
              <option>Ongoing</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: colors.text2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Region</div>
          <select style={{ ...input, appearance: 'none' }}>
            <option>Global</option>
            <option>Africa</option>
            <option>MENA</option>
            <option>Remote</option>
          </select>
        </div>
        <button style={{
          width: '100%', padding: '16px', borderRadius: '14px', marginTop: '8px',
          background: colors.btnBg, border: 'none',
          color: colors.btnText, fontSize: '16px', fontWeight: '700',
          cursor: 'pointer', letterSpacing: '-0.2px',
        }}>Post Gig →</button>
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