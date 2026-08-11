import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Building2, CircleHelp, ClipboardCheck, Headphones, Plane, ShieldCheck, UserRound, Users, Wrench, type LucideIcon } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'

type WorkspaceKind = 'aircraft' | 'airport' | 'crew' | 'notifications' | 'profile' | 'support'

interface WorkspaceConfig {
  title: string
  subtitle: string
  icon: LucideIcon
  entity: string
  metrics: Array<{ title: string; value: string; change: string; icon: LucideIcon; color: string }>
  rows: Array<{ name: string; detail: string; state: string; owner: string }>
}

const configs: Record<WorkspaceKind, WorkspaceConfig> = {
  aircraft: {
    title: 'Aircraft Fleet', subtitle: 'Readiness, maintenance windows, and utilization across the fleet.', icon: Wrench, entity: 'aircraft',
    metrics: [{ title: 'In Service', value: '142', change: '98.6%', icon: Plane, color: 'text-accent' }, { title: 'Maintenance Due', value: '6', change: 'Next 24h', icon: Wrench, color: 'text-amber-400' }, { title: 'Fleet Readiness', value: '99.1%', change: '+0.4%', icon: ShieldCheck, color: 'text-emerald-400' }],
    rows: [{ name: 'Boeing 777-300ER · SK-001', detail: 'DXB · 3,942 flight hours', state: 'Available', owner: 'Engineering' }, { name: 'Airbus A380 · SK-014', detail: 'LHR · Inspection in 6h', state: 'Scheduled', owner: 'Line Maintenance' }, { name: 'Boeing 787-9 · SK-032', detail: 'SIN · 84% utilization', state: 'In flight', owner: 'Operations' }],
  },
  airport: {
    title: 'Airport Operations', subtitle: 'Gate allocation, turnaround health, and network coordination.', icon: Building2, entity: 'airport',
    metrics: [{ title: 'Active Gates', value: '37', change: 'of 42', icon: Building2, color: 'text-cyan-400' }, { title: 'Turnaround SLA', value: '94%', change: '+3.1%', icon: ClipboardCheck, color: 'text-emerald-400' }, { title: 'Gate Conflicts', value: '2', change: 'Review', icon: Bell, color: 'text-amber-400' }],
    rows: [{ name: 'Dubai International · DXB', detail: 'Terminal 3 · 18 gates active', state: 'Nominal', owner: 'Airport Control' }, { name: 'London Heathrow · LHR', detail: 'Terminal 4 · Weather watch', state: 'Monitor', owner: 'Station Manager' }, { name: 'Singapore Changi · SIN', detail: 'Terminal 1 · 6 arrivals next hour', state: 'Nominal', owner: 'Ground Ops' }],
  },
  crew: {
    title: 'Crew Management', subtitle: 'Crew availability, duty compliance, and roster coverage.', icon: Users, entity: 'crew member',
    metrics: [{ title: 'On Duty', value: '1,840', change: '+24 today', icon: Users, color: 'text-accent' }, { title: 'Roster Coverage', value: '99.4%', change: 'Next 72h', icon: ClipboardCheck, color: 'text-emerald-400' }, { title: 'Duty Alerts', value: '3', change: 'Action needed', icon: Bell, color: 'text-amber-400' }],
    rows: [{ name: 'Aisha Rahman · Captain', detail: 'SK001 · Duty ends 14:20 UTC', state: 'On duty', owner: 'Flight Operations' }, { name: 'Daniel Hart · Purser', detail: 'SK014 · Briefing in 35 min', state: 'Ready', owner: 'Cabin Services' }, { name: 'Maya Patel · First Officer', detail: 'Rest period ends 09:45 UTC', state: 'Resting', owner: 'Crew Planning' }],
  },
  notifications: {
    title: 'Notifications', subtitle: 'Prioritized operational updates across the SkyMind network.', icon: Bell, entity: 'notification',
    metrics: [{ title: 'Unread', value: '7', change: '3 high priority', icon: Bell, color: 'text-rose-400' }, { title: 'Resolved Today', value: '24', change: '+8', icon: ClipboardCheck, color: 'text-emerald-400' }, { title: 'Response SLA', value: '4m', change: 'Average', icon: ShieldCheck, color: 'text-cyan-400' }],
    rows: [{ name: 'Weather advisory — LHR', detail: 'Low visibility expected at 16:00 UTC', state: 'High priority', owner: 'Network Control' }, { name: 'Gate update — SK014', detail: 'Moved from A22 to A26', state: 'New', owner: 'Airport Control' }, { name: 'Crew roster confirmed', detail: 'SK001 crew is fully assigned', state: 'Resolved', owner: 'Crew Planning' }],
  },
  profile: {
    title: 'Profile & Access', subtitle: 'Manage your operator profile, role, and workspace access.', icon: UserRound, entity: 'access item',
    metrics: [{ title: 'Access Role', value: 'Operator', change: 'Active', icon: ShieldCheck, color: 'text-emerald-400' }, { title: 'Active Sessions', value: '1', change: 'This device', icon: UserRound, color: 'text-accent' }, { title: 'Security Status', value: 'Protected', change: '2FA ready', icon: ClipboardCheck, color: 'text-cyan-400' }],
    rows: [{ name: 'Operations dashboard', detail: 'Read and control access', state: 'Granted', owner: 'SkyMind Admin' }, { name: 'Predictive intelligence', detail: 'Model and history access', state: 'Granted', owner: 'SkyMind Admin' }, { name: 'User administration', detail: 'Role management restricted', state: 'Limited', owner: 'Security' }],
  },
  support: {
    title: 'Support Center', subtitle: 'Get context-aware assistance for your operations workspace.', icon: CircleHelp, entity: 'support request',
    metrics: [{ title: 'Open Requests', value: '2', change: 'Assigned', icon: Headphones, color: 'text-accent' }, { title: 'Response Time', value: '12m', change: 'Priority plan', icon: ClipboardCheck, color: 'text-emerald-400' }, { title: 'Platform Status', value: 'Operational', change: 'All systems', icon: ShieldCheck, color: 'text-cyan-400' }],
    rows: [{ name: 'Flight monitor data refresh', detail: 'Case #SM-1842 · Updated 8 min ago', state: 'In progress', owner: 'Product Support' }, { name: 'Analytics export question', detail: 'Case #SM-1837 · Reply received', state: 'Waiting for you', owner: 'Data Support' }, { name: 'Knowledge base', detail: 'Search operations guides and runbooks', state: 'Available', owner: 'SkyMind Help' }],
  },
}

export default function WorkspacePage({ kind }: { kind: WorkspaceKind }) {
  const [query, setQuery] = useState('')
  const [updated, setUpdated] = useState(false)
  const config = configs[kind]
  const Icon = config.icon
  const rows = useMemo(() => config.rows.filter(row => `${row.name} ${row.detail} ${row.state}`.toLowerCase().includes(query.toLowerCase())), [config.rows, query])

  const refresh = () => {
    setUpdated(true)
    window.setTimeout(() => setUpdated(false), 1600)
  }

  return <div className="space-y-5">
    <PageHeader title={config.title} subtitle={config.subtitle} icon={Icon}>
      <button onClick={refresh} className="btn-ghost text-xs">{updated ? 'Updated just now' : 'Refresh workspace'}</button>
      <button className="btn-primary text-xs">New {config.entity}</button>
    </PageHeader>
    <div className="grid gap-4 sm:grid-cols-3">
      {config.metrics.map((metric, index) => <StatCard key={metric.title} title={metric.title} value={metric.value} change={metric.change} trend="up" icon={metric.icon} color={metric.color} delay={index * .05} />)}
    </div>
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-semibold text-white">Live workspace</h2><p className="mt-1 text-xs text-sky-400">Current {config.entity} activity and ownership</p></div><input value={query} onChange={event => setQuery(event.target.value)} className="input w-full sm:w-64" placeholder={`Search ${config.entity}s...`} aria-label={`Search ${config.entity}s`} /></div>
      <div className="divide-y divide-white/5">{rows.map(row => <div key={row.name} className="flex flex-col gap-2 py-4 transition-colors hover:bg-white/[.03] sm:flex-row sm:items-center sm:justify-between sm:px-3"><div><p className="text-sm font-semibold text-white">{row.name}</p><p className="mt-1 text-xs text-sky-400">{row.detail}</p></div><div className="flex items-center gap-3"><span className="badge border border-white/10 bg-white/5 text-sky-300">{row.state}</span><span className="text-xs text-sky-500">{row.owner}</span></div></div>)}{rows.length === 0 && <p className="py-10 text-center text-sm text-sky-400">No matching {config.entity}s found.</p>}</div>
    </motion.section>
  </div>
}
