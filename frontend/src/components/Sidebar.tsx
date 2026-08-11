import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Plane, BarChart3, Brain, Radio, Wrench,
  Building2, Users, UserCircle, Settings, Bell, HelpCircle,
  ChevronLeft, ChevronRight, Zap, Clock, DollarSign
} from 'lucide-react'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'

const navGroups = [
  {
    label: 'Main',
    links: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/dashboard/admin', icon: Zap, label: 'Admin' },
    ],
  },
  {
    label: 'Operations',
    links: [
      { to: '/dashboard/operations', icon: Radio, label: 'Operations Center' },
      { to: '/dashboard/flights', icon: Plane, label: 'Flight Control' },
      { to: '/dashboard/aircraft', icon: Wrench, label: 'Aircraft' },
      { to: '/dashboard/airport', icon: Building2, label: 'Airport' },
      { to: '/dashboard/airlines', icon: Plane, label: 'Airlines' },
      { to: '/dashboard/crew', icon: Users, label: 'Crew' },
      { to: '/dashboard/passenger', icon: UserCircle, label: 'Passengers' },
    ],
  },
  {
    label: 'Intelligence',
    links: [
      { to: '/dashboard/ai', icon: Brain, label: 'AI Dashboard' },
      { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/dashboard/delay', icon: Clock, label: 'Delay Predictor' },
      { to: '/dashboard/price', icon: DollarSign, label: 'Price Predictor' },
    ],
  },
  {
    label: 'Account',
    links: [
      { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
      { to: '/dashboard/profile', icon: UserCircle, label: 'Profile' },
      { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
      { to: '/dashboard/support', icon: HelpCircle, label: 'Support' },
    ],
  },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useApp()

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-sky-900/80 backdrop-blur-xl border-r border-white/5 z-30 flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center flex-shrink-0">
          <Plane size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-white text-base whitespace-nowrap"
            >
              SkyMind <span className="text-accent">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sky-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-1"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.links.map(({ to, icon: Icon, label }) => {
                const isActive = to === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(to)
                return (
                  <NavLink
                    key={to}
                    to={to}
                    title={collapsed ? label : undefined}
                    className={clsx(
                      'sidebar-link',
                      isActive && 'active',
                      collapsed && 'justify-center px-2'
                    )}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="whitespace-nowrap"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sky-700 border border-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors z-40"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* User */}
      <div className={clsx('border-t border-white/5 p-3 flex items-center gap-3', collapsed && 'justify-center')}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {user?.name?.slice(0, 1).toUpperCase() || 'A'}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-white text-xs font-semibold truncate max-w-[145px]">{user?.name || 'SkyMind User'}</p>
              <p className="text-sky-400 text-[10px] truncate max-w-[145px]">{user?.email || 'operations@skymind.ai'}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && <button onClick={() => { logout(); navigate('/login', { replace: true }) }} className="ml-auto text-[10px] text-sky-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label="Sign out">Sign out</button>}
      </div>
    </motion.aside>
  )
}
