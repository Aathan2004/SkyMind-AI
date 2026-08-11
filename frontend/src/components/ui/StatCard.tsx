import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: string
  delay?: number
}

export default function StatCard({ title, value, change, trend, icon: Icon, color = 'text-accent', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div className={clsx('p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300', color)}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={clsx('badge text-xs', trend === 'up' ? 'bg-emerald/10 text-emerald-400' : trend === 'down' ? 'bg-rose/10 text-rose-400' : 'bg-white/10 text-sky-300')}>
            {trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : null}
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </motion.div>
  )
}
