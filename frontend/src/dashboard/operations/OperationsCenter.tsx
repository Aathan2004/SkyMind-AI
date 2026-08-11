import { useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, AlertTriangle, CheckCircle, Clock, Plane, Wind } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import PageHeader from '../../components/ui/PageHeader'
import { todayFlights, weatherData, notifications } from '../../data/mockData'

const alerts = notifications.slice(0, 4)

export default function OperationsCenter() {
  const [activeTab, setActiveTab] = useState<'flights' | 'alerts' | 'weather'>('flights')

  return (
    <div className="space-y-5">
      <PageHeader title="Operations Center" subtitle="Live flight monitoring and control" icon={Radio}>
        <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Feed
        </span>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Airborne Now" value="142" change="Active" trend="up" icon={Plane} color="text-accent" delay={0} />
        <StatCard title="On Time" value="82%" change="+2%" trend="up" icon={CheckCircle} color="text-emerald-400" delay={0.05} />
        <StatCard title="Delayed" value="18" change="6.3%" trend="down" icon={Clock} color="text-amber-400" delay={0.1} />
        <StatCard title="Alerts" value="4" change="Active" trend="neutral" icon={AlertTriangle} color="text-rose-400" delay={0.15} />
      </div>

      {/* Live Map Simulation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold">Live Flight Map</p>
          <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 142 aircraft tracked
          </span>
        </div>
        <div className="relative h-64 rounded-xl overflow-hidden bg-sky-900/50 border border-white/5"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        >
          {/* Simulated flight dots */}
          {todayFlights.slice(0, 6).map((f, i) => (
            <motion.div
              key={f.id}
              className="absolute"
              style={{ left: `${15 + i * 13}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative group cursor-pointer">
                <Plane size={14} className={`${f.status === 'Delayed' ? 'text-amber-400' : f.status === 'Cancelled' ? 'text-rose-400' : 'text-accent'} rotate-45`} />
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block glass-dark rounded-lg px-2 py-1 text-xs whitespace-nowrap z-10">
                  <p className="text-white font-bold">{f.id}</p>
                  <p className="text-sky-400">{f.from} → {f.to}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="absolute bottom-3 left-3 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-accent"><Plane size={10} className="rotate-45" /> On Time</span>
            <span className="flex items-center gap-1 text-amber-400"><Plane size={10} className="rotate-45" /> Delayed</span>
            <span className="flex items-center gap-1 text-rose-400"><Plane size={10} className="rotate-45" /> Cancelled</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
        <div className="flex gap-2 mb-4">
          {(['flights', 'alerts', 'weather'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-accent text-white' : 'text-sky-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'flights' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Flight', 'Route', 'Dep', 'Arr', 'Status'].map(h => (
                    <th key={h} className="text-left text-sky-500 text-xs font-medium pb-3 pr-4 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayFlights.map(f => (
                  <tr key={f.id} className="table-row">
                    <td className="py-2.5 pr-4 font-bold text-white">{f.id}</td>
                    <td className="py-2.5 pr-4 text-sky-300">{f.from} → {f.to}</td>
                    <td className="py-2.5 pr-4 text-white">{f.dep}</td>
                    <td className="py-2.5 pr-4 text-white">{f.arr}</td>
                    <td className="py-2.5"><StatusBadge status={f.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-2">
            {alerts.map(a => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border ${a.type === 'error' ? 'bg-rose-500/5 border-rose-500/20' : a.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                <AlertTriangle size={14} className={a.type === 'error' ? 'text-rose-400' : a.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'} />
                <div>
                  <p className="text-white text-sm font-semibold">{a.title}</p>
                  <p className="text-sky-400 text-xs mt-0.5">{a.message}</p>
                  <p className="text-sky-600 text-xs mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {weatherData.map(w => (
              <div key={w.city} className="glass rounded-xl p-3 text-center">
                <p className="text-white font-semibold text-sm">{w.city}</p>
                <p className="text-3xl font-black text-accent mt-1">{w.temp}°</p>
                <p className="text-sky-400 text-xs mt-1">{w.condition}</p>
                <span className={`badge mt-2 border text-xs ${w.impact === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : w.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  <Wind size={9} /> {w.impact} Impact
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
