export default function Home({ theme }) {
  const dark = theme === 'dark'
  const card = {
    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px'
  }
  const gigs = [
    { id: 1, title: "Community Manager", company: "SuiNetwork", pay: "$800/mo", tag: "Africa", featured: true },
    { id: 2, title: "BD Manager", company: "TonWallet", pay: "$1200/mo", tag: "MENA", featured: true },
    { id: 3, title: "Social Media Manager", company: "BNBChain", pay: "$600/mo", tag: "Global", featured: false },
    { id: 4, title: "Web3 Writer", company: "CoinDesk", pay: "$400/mo", tag: "Remote", featured: false },
  ]
  return (
    <div style={{ padding: '50px 20px 100px' }}>
      <p style={{ fontSize: '13px', opacity: 0.5 }}>Welcome back 👋</p>
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '4px', marginBottom: '4px' }}>
        Quest<span style={{ color: '#F5C842' }}>Work</span>
      </h1>
      <p style={{ fontSize: '13px', opacity: 0.4, marginBottom: '24px' }}>
        Find Web3 work. Get paid in crypto.
      </p>
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <span>🔍</span>
        <span style={{ opacity: 0.4, fontSize: '14px' }}>Search gigs, skills, companies...</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}>
          <div>💼</div>
          <div style={{ color: '#F5C842', fontWeight: '700' }}>120+</div>
          <div style={{ fontSize: '11px', opacity: 0.4 }}>Active Gigs</div>
        </div>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}>
          <div>👥</div>
          <div style={{ color: '#F5C842', fontWeight: '700' }}>500+</div>
          <div style={{ fontSize: '11px', opacity: 0.4 }}>Freelancers</div>
        </div>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}>
          <div>📈</div>
          <div style={{ color: '#F5C842', fontWeight: '700' }}>$50K+</div>
          <div style={{ fontSize: '11px', opacity: 0.4 }}>Paid Out</div>
        </div>
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>Featured Gigs</h2>
      {gigs.map((gig) => (
        <div key={gig.id} style={{ ...card, border: gig.featured ? '1px solid rgba(245,200,66,0.3)' : card.border }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              {gig.featured && (
                <div style={{ display: 'inline-block', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: 'rgba(245,200,66,0.15)', color: '#F5C842', marginBottom: '4px' }}>⭐ Featured</div>
              )}
              <div style={{ fontSize: '15px', fontWeight: '600' }}>{gig.title}</div>
              <div style={{ fontSize: '12px', opacity: 0.5 }}>{gig.company}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#F5C842', fontWeight: '700' }}>{gig.pay}</div>
              <div style={{ fontSize: '11px', opacity: 0.4 }}>{gig.tag}</div>
            </div>
          </div>
          <button style={{ width: '100%', padding: '10px', borderRadius: '12px', background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.25)', color: '#F5C842', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
            Apply Now
          </button>
        </div>
      ))}
    </div>
  )
}