import { motion } from 'framer-motion'
import {
  Plane, Users, DollarSign, Clock, XCircle, Wrench, UserCheck, Brain
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import PageHeader from '../components/ui/PageHeader'
import { revenueData, todayFlights, routeData } from '../data/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark rounded-xl px-3 py-2 text-xs">
      <p className="text-sky-300 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{typeof p.value === 'number' && p.value > 10000 ? `$${(p.value / 1000000).toFixed(1)}M` : p.value}</span></p>
      ))}
    </div>
  )
}

export default function Overview() {
  return (
    <div className="space-y-5">
      <PageHeader title="Operations Overview" subtitle="Real-time airline intelligence dashboard" icon={Plane}>
        <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Flights" value="284" change="+12%" trend="up" icon={Plane} color="text-accent" delay={0} />
        <StatCard title="Passengers" value="38,420" change="+8%" trend="up" icon={Users} color="text-cyan-400" delay={0.05} />
        <StatCard title="Revenue Today" value="$1.24M" change="+5.2%" trend="up" icon={DollarSign} color="text-emerald-400" delay={0.1} />
        <StatCard title="Delayed Flights" value="18" change="-3" trend="up" icon={Clock} color="text-amber-400" delay={0.15} />
        <StatCard title="Cancelled" value="3" change="+1" trend="down" icon={XCircle} color="text-rose-400" delay={0.2} />
        <StatCard title="Aircraft in Service" value="142" change="98%" trend="neutral" icon={Wrench} color="text-purple-400" delay={0.25} />
        <StatCard title="Crew On Duty" value="1,840" change="+24" trend="up" icon={UserCheck} color="text-sky-400" delay={0.3} />
        <StatCard title="AI Predictions" value="12,480" change="91.4%" trend="up" icon={Brain} color="text-pink-400" delay={0.35} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold">Revenue Overview</p>
              <p className="text-sky-400 text-xs">Monthly revenue & passenger trends</p>
            </div>
            <select className="input text-xs py-1 px-2 h-7">
              <option>2024</option><option>2023</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Popular Routes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card">
          <p className="text-white font-semibold mb-1">Popular Routes</p>
          <p className="text-sky-400 text-xs mb-4">Top 5 by bookings</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={routeData} dataKey="bookings" nameKey="route" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                {routeData.map((entry: any, i: number) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {routeData.map((r: any) => (
              <div key={r.route} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: r.fill }} />
                  <span className="text-sky-300">{r.route}</span>
                </div>
                <span className="text-white font-medium">{r.bookings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Today's Flights Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-semibold">Today's Flights</p>
            <p className="text-sky-400 text-xs">{todayFlights.length} flights scheduled</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Flight', 'Route', 'Departure', 'Arrival', 'Aircraft', 'Passengers', 'Status'].map(h => (
                  <th key={h} className="text-left text-sky-500 text-xs font-medium pb-3 pr-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayFlights.map((f: any) => (
                <tr key={f.id} className="table-row">
                  <td className="py-3 pr-4 font-bold text-white">{f.id}</td>
                  <td className="py-3 pr-4 text-sky-300">{f.from} → {f.to}</td>
                  <td className="py-3 pr-4 text-white">{f.dep}</td>
                  <td className="py-3 pr-4 text-white">{f.arr}</td>
                  <td className="py-3 pr-4 text-sky-300">{f.aircraft}</td>
                  <td className="py-3 pr-4 text-white">{f.passengers}</td>
                  <td className="py-3"><StatusBadge status={f.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
