import { motion } from 'framer-motion'
import { Brain, TrendingUp, Zap, RefreshCw } from 'lucide-react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'
import { predictionAccuracy } from '../../data/mockData'

const models = [
  { name: 'Delay Prediction', accuracy: 91.4, predictions: '48,200', status: 'Active', color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
  { name: 'Price Prediction', accuracy: 87.2, predictions: '31,800', status: 'Active', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  { name: 'No-Show Prediction', accuracy: 84.6, predictions: '22,400', status: 'Active', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  { name: 'Cancellation', accuracy: 89.1, predictions: '18,900', status: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  { name: 'Sentiment Analysis', accuracy: 82.3, predictions: '9,400', status: 'Active', color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20' },
  { name: 'Weather Impact', accuracy: 93.0, predictions: '14,200', status: 'Active', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  { name: 'Maintenance', accuracy: 86.5, predictions: '6,800', status: 'Active', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  { name: 'Recommendation', accuracy: 88.9, predictions: '28,100', status: 'Active', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  { name: 'Chatbot', accuracy: 79.4, predictions: '5,200', status: 'Active', color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20' },
]

const recentPredictions = [
  { id: 'P-8821', model: 'Delay', input: 'SK002 JFK→CDG', result: '47 min delay', confidence: '94%', time: '1 min ago' },
  { id: 'P-8820', model: 'Price', input: 'DXB→LHR Summer', result: '$842', confidence: '88%', time: '3 min ago' },
  { id: 'P-8819', model: 'No-Show', input: 'BK8821 James W.', result: '12% probability', confidence: '91%', time: '5 min ago' },
  { id: 'P-8818', model: 'Weather', input: 'JFK 2024-01-15', result: 'High Impact', confidence: '96%', time: '8 min ago' },
  { id: 'P-8817', model: 'Maintenance', input: 'A6-EDB B777', result: 'Check in 14 days', confidence: '87%', time: '12 min ago' },
]

export default function AIDashboard() {
  return (
    <div className="space-y-5">
      <PageHeader title="AI Dashboard" subtitle="9 active models · Real-time inference engine" icon={Brain}>
        <button className="btn-ghost text-xs flex items-center gap-1.5"><RefreshCw size={13} /> Retrain All</button>
        <button className="btn-primary text-xs flex items-center gap-1.5"><Zap size={13} /> Run Prediction</button>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Models" value="9/9" change="100%" trend="up" icon={Brain} color="text-accent" delay={0} />
        <StatCard title="Predictions Today" value="184K" change="+22%" trend="up" icon={Zap} color="text-cyan-400" delay={0.05} />
        <StatCard title="Avg Accuracy" value="87.6%" change="+1.2%" trend="up" icon={TrendingUp} color="text-emerald-400" delay={0.1} />
        <StatCard title="Inference Time" value="84ms" change="-12ms" trend="up" icon={RefreshCw} color="text-purple-400" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <p className="text-white font-semibold mb-1">Model Accuracy Radar</p>
          <p className="text-sky-400 text-xs mb-4">Accuracy % across all models</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={predictionAccuracy}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="Accuracy" dataKey="accuracy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
          <p className="text-white font-semibold mb-1">Accuracy by Model</p>
          <p className="text-sky-400 text-xs mb-4">Current accuracy %</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={predictionAccuracy} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="model" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#071a35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="accuracy" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {models.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            whileHover={{ y: -3 }}
            className={`card border ${m.bg} cursor-pointer`}
          >
            <div className={`text-xs font-bold ${m.color} mb-2`}>{m.name}</div>
            <div className="text-2xl font-black text-white">{m.accuracy}%</div>
            <div className="text-sky-500 text-xs mt-1">{m.predictions} predictions</div>
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400" style={{ width: `${m.accuracy}%` }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Predictions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
        <p className="text-white font-semibold mb-4">Recent Predictions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID', 'Model', 'Input', 'Result', 'Confidence', 'Time'].map(h => (
                  <th key={h} className="text-left text-sky-500 text-xs font-medium pb-3 pr-4 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPredictions.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="py-2.5 pr-4 font-mono text-accent text-xs">{p.id}</td>
                  <td className="py-2.5 pr-4"><span className="badge bg-accent/10 text-accent border border-accent/20">{p.model}</span></td>
                  <td className="py-2.5 pr-4 text-sky-300 text-xs">{p.input}</td>
                  <td className="py-2.5 pr-4 text-white font-medium">{p.result}</td>
                  <td className="py-2.5 pr-4 text-emerald-400 font-semibold">{p.confidence}</td>
                  <td className="py-2.5 text-sky-500 text-xs">{p.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
