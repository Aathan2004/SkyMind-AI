import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  icon?: LucideIcon
  children?: React.ReactNode
}

export default function PageHeader({ title, subtitle, icon: Icon, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
            <Icon size={22} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sky-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </motion.div>
  )
}
