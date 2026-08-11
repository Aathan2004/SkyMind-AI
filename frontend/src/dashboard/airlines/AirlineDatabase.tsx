import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, Search, Radio, Wrench, Building2, Route as RouteIcon, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { airlineService, Airline, FleetEntry, AirlineHub, AirlineRoute } from '../../services/airlineService'
import { getErrorMessage } from '../../services/authService'

export default function AirlineDatabase() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Airline[]>([])
  const [selected, setSelected] = useState<Airline | null>(null)
  const [fleet, setFleet] = useState<FleetEntry[]>([])
  const [hub, setHub] = useState<AirlineHub | null>(null)
  const [routes, setRoutes] = useState<AirlineRoute[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const res = await airlineService.search(query || 'Airways', 15)
        setResults(res.data)
        if (!selected && res.data.length) select(res.data[0])
      } catch { /* ignore transient search errors */ }
    }, 350)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const select = async (airline: Airline) => {
    setSelected(airline)
    setFleet([])
    setHub(null)
    setRoutes([])
    setError(null)
    setLoading(true)
    try {
      const [f, h, r] = await Promise.all([
        airlineService.fleet(airline.iata),
        airlineService.hub(airline.iata),
        airlineService.routes(airline.iata, 30),
      ])
      setFleet(f.data.fleet)
      setHub(h.data.hub)
      setRoutes(r.data.routes)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const maxRouteCount = Math.max(1, ...fleet.map(f => f.route_count))

  return (
    <div className="space-y-5">
      <PageHeader title="Airline Database" subtitle="Real airline, fleet, hub, and route reference data" icon={Plane} />

      <div className="card">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search airline, country, IATA/ICAO code..." className="input pl-9" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {results.map(a => (
            <button key={a.iata} onClick={() => select(a)}
              className={`badge border text-xs cursor-pointer ${selected?.iata === a.iata ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-white/5 border-white/10 text-sky-300 hover:text-white'}`}>
              {a.iata} · {a.name}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-3">
            <StatCard title={selected.iata} value={selected.name} icon={Plane} color="text-accent" />
            <StatCard title="Country" value={selected.country || 'Unknown'} icon={Building2} color="text-cyan-400" />
            <StatCard title="Radio Callsign" value={selected.callsign || 'Unknown'} icon={Radio} color="text-sky-400" />
          </motion.div>

          {loading && <LoadingSpinner />}
          {error && (
            <div className="card flex items-center gap-3 border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Wrench size={16} className="text-accent" />
                <p className="text-white font-semibold text-sm">Fleet Composition</p>
                <span className="text-sky-500 text-xs">(derived from real route equipment data)</span>
              </div>
              {fleet.length === 0 && <p className="text-sky-400 text-xs py-4 text-center">No fleet data available.</p>}
              <div className="space-y-2">
                {fleet.map(f => (
                  <div key={f.code}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white font-medium">{f.aircraft}</span>
                      <span className="text-sky-400">{f.route_count} routes</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full" style={{ width: `${(f.route_count / maxRouteCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={16} className="text-accent" />
                <p className="text-white font-semibold text-sm">Primary Hub</p>
              </div>
              {hub ? (
                <div className="glass rounded-xl p-4">
                  <p className="text-white font-bold text-lg">{hub.iata} — {hub.name}</p>
                  <p className="text-sky-400 text-sm mt-1">{hub.city}, {hub.country}</p>
                  <p className="text-sky-500 text-xs mt-2">{hub.outbound_routes} outbound routes</p>
                </div>
              ) : <p className="text-sky-400 text-xs py-4 text-center">No hub data available.</p>}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <RouteIcon size={16} className="text-accent" />
              <p className="text-white font-semibold text-sm">Routes</p>
              <span className="text-sky-500 text-xs">({routes.length})</span>
            </div>
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {routes.map((r, i) => (
                <div key={`${r.source}-${r.dest}-${i}`} className="flex items-center justify-between py-2.5 text-xs">
                  <span className="text-white font-medium">{r.source_name} → {r.dest_name}</span>
                  {r.aircraft && <span className="text-sky-400">{r.aircraft}</span>}
                </div>
              ))}
              {routes.length === 0 && <p className="text-sky-400 text-xs py-6 text-center">No routes found.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
