import clsx from 'clsx'

const styles: Record<string, string> = {
  'On Time':    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Delayed':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Cancelled':  'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Boarding':   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Scheduled':  'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'In Service': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Maintenance':'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Standby':    'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'On Duty':    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Rest':       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'High':       'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Medium':     'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Low':        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Cruising':   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Climbing':   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Descending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'On Ground':  'bg-sky-500/10 text-sky-400 border-sky-500/20',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx('badge border text-xs', styles[status] ?? 'bg-white/10 text-sky-300 border-white/10')}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
