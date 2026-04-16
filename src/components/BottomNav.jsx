import { Home, Briefcase, PlusCircle, User } from 'lucide-react'

export default function BottomNav({ active, setActive, theme }) {
  const tabs = [
    { id: 'home', icon: <Home size={20}/>, label: 'Home' },
    { id: 'gigs', icon: <Briefcase size={20}/>, label: 'Gigs' },
    { id: 'post', icon: <PlusCircle size={20}/>, label: 'Post' },
    { id: 'profile', icon: <User size={20}/>, label: 'Profile' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-2 z-50">
      <div className="flex items-center justify-around rounded-3xl px-2 py-3"
        style={{
          background: theme === 'dark' ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(30px)',
          border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-200"
            style={{
              color: active === tab.id ? '#F5C842' : theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
              background: active === tab.id ? 'rgba(245,200,66,0.1)' : 'transparent',
            }}>
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}