import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed top-5 right-5 z-50 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300"
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        backdropFilter: 'blur(20px)',
        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
      }}>
      {theme === 'dark'
        ? <Sun size={16} color="#F5C842"/>
        : <Moon size={16} color="#1a1a1a"/>
      }
    </button>
  )
}