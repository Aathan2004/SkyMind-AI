import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, Plane } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { dark, toggleDark, isAuthenticated, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-sky-950/80 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20"><Plane size={18} /></span>SkyMind <span className="text-cyan-300">AI</span></Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <button onClick={toggleDark} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="hover:text-accent transition">Logout</button>
        ) : (
          <Link to="/login" className="hover:text-accent transition">Login</Link>
        )}
        <Link to="/dashboard" className="bg-accent px-4 py-1 rounded hover:opacity-90 transition">Dashboard</Link>
      </div>
      </div>
    </nav>
  )
}
