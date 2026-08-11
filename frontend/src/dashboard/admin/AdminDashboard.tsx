import { motion } from 'framer-motion'
import { Zap, Users, Server, Activity, Shield, Database, RefreshCw, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'

const systemHealth = [
  { service: 'API Gateway', status: 'Operational', uptime: '99.98%', latency: '12ms' },
  { service: 'AI Engine', status: 'Operational', uptime: '99.91%', latency: '84ms' },
  { service: 'Database', status: 'Operational', uptime: '100%', latency: '3ms' },
  { service: 'Auth Service', status: 'Operational', uptime: '99.99%', latency: '8ms' },
  { service: 'Notification Service', status: 'Degraded', uptime: '98.2%', latency: '210ms' },
]

const apiUsage = [
  { hour: '00', calls: 1200 }, { hour: '04', calls: 800 }, { hour: '08', calls: 4200 },
  { hour: '12', calls: 6800 }, { hour: '16', calls: 5900 }, { hour: '20', calls: 3400 },
]

const users = [
  { name: 'Admin User', email: 'admin@skymind.ai', role: 'Super Admin', lastLogin: '2 min ago', status: 'Active' },
  { name: 'Ops Manager', email: 'ops@skymind.ai', role: 'Operations', lastLogin: '1 hr ago', status: 'Active' },
  { name: 'Data Analyst', email: 'analyst@skymind.ai', role: 'Analyst', lastLogin: '3 hr ago', status: 'Active' },
  { name: 'Crew Manager', email: 'crew@skymind.ai', role: 'Crew', lastLogin: '1 day ago', status: 'Inactive' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-5">
      <PageHeader title="Admin Dashboard" subtitle="System health, users, and platform management" icon={Zap}>
        <button className="btn-ghost text-xs flex items-center gap-1.5"><RefreshCw size={13} /> Refresh</button>
        <button className="btn-primary text-xs flex items-center gap-1.5"><Download size={13} /> Export</button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="248" change="+12" trend="up" icon={Users} color="text-accent" delay={0} />
        <StatCard title="API Calls Today" value="284K" change="+18%" trend="up" icon={Activity} color="text-cyan-400" delay={0.05} />
        <StatCard title="DB Size" value="4.2 GB" change="+0.3GB" trend="neutral" icon={Database} color="text-purple-400" delay={0.1} />
        <StatCard title="Security Score" value="98/100" change="A+" trend="up" icon={Shield} color="text-emerald-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* System Health */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Server size={16} className="text-accent" />
            <p className="text-white font-semibold">System Health</p>
          </div>
          <div className="space-y-2">
            {systemHealth.map(s => (
              <div key={s.service} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.status === 'Operational' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-white text-sm">{s.service}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-sky-400">{s.uptime}</span>
                  <span className="text-sky-400">{s.latency}</span>
                  <span className={s.status === 'Operational' ? 'text-emerald-400' : 'text-amber-400'}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* API Usage */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
          <p className="text-white font-semibold mb-1">API Usage Today</p>
          <p className="text-sky-400 text-xs mb-4">Calls per hour</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={apiUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#071a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
        <p className="text-white font-semibold mb-4">Platform Users</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Role', 'Last Login', 'Status'].map(h => (
                  <th key={h} className="text-left text-sky-500 text-xs font-medium pb-3 pr-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.email} className="table-row">
                  <td className="py-3 pr-4 text-white font-medium">{u.name}</td>
                  <td className="py-3 pr-4 text-sky-400">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className="badge bg-accent/10 text-accent border border-accent/20">{u.role}</span>
                  </td>
                  <td className="py-3 pr-4 text-sky-400 text-xs">{u.lastLogin}</td>
                  <td className="py-3">
                    <span className={`badge border ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-sky-400 border-white/10'}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
