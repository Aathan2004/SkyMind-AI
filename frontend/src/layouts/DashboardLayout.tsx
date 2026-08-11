import { useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024)

  return (
    <div className="dashboard-shell flex h-screen overflow-hidden bg-sky-950 transition-colors duration-300">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuToggle={() => setCollapsed(v => !v)} />
        <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}
