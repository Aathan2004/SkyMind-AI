import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, Moon, Sun, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { notifications } from '../data/mockData'
import { useApp } from '../context/AppContext'

interface Props { onMenuToggle?: () => void }

export default function Topbar({ onMenuToggle }: Props) {
  const [showNotif, setShowNotif] = useState(false)
  const [search, setSearch] = useState('')
  const { dark, toggleDark, user } = useApp()

  const typeColor: Record<string, string> = {
    warning: 'text-amber-400', error: 'text-rose-400',
    success: 'text-emerald-400', info: 'text-blue-400',
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-sky-900/60 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} aria-label="Toggle navigation" className="text-sky-400 hover:text-white transition-colors lg:hidden">
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search flights, routes, passengers..."
            className="input pl-9 w-64 text-xs h-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleDark} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-sky-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(v => !v)}
            aria-label={`Notifications (${notifications.length} unread)`}
            aria-expanded={showNotif}
            className="relative w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-sky-300 hover:text-white transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <Bell size={15} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {notifications.length}
            </span>
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-10 w-80 glass-dark rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-white font-semibold text-sm">Notifications</span>
                  <button onClick={() => setShowNotif(false)} className="text-sky-400 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n: any) => (
                    <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${typeColor[n.type]} bg-current`} />
                        <div>
                          <p className="text-white text-xs font-semibold">{n.title}</p>
                          <p className="text-sky-400 text-xs mt-0.5">{n.message}</p>
                          <p className="text-sky-600 text-[10px] mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/dashboard/notifications" onClick={() => setShowNotif(false)} className="block text-center text-accent text-xs py-3 hover:bg-white/5 transition-colors">
                  View all notifications
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <Link to="/dashboard/profile" aria-label="Open profile">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-105 transition-transform" aria-hidden="true">
            {user?.name?.slice(0, 1).toUpperCase() || 'A'}
          </div>
        </Link>
      </div>
    </header>
  )
}
