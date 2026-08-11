import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Search, Wind, Thermometer, Cloud, PlaneLanding, PlaneTakeoff, MapPin, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import { airportService, Airport, AirportWeather, AirportTraffic, NearbyFlight } from '../../services/airportService'
import { getErrorMessage } from '../../services/authService'

function TrafficTable({ title, icon: Icon, rows }: { title: string; icon: typeof PlaneLanding; rows: NearbyFlight[] }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className="text-accent" />
        <p className="text-white font-semibold text-sm">{title}</p>
        <span className="text-sky-500 text-xs">({rows.length})</span>
      </div>
      {rows.length === 0 && <p className="text-sky-400 text-xs py-4 text-center">No live traffic within range right now.</p>}
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {rows.map(r => (
          <div key={r.icao24} className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-white/5">
            <span className="text-white font-semibold">{r.callsign || r.icao24}</span>
            <span className="text-sky-400">{r.distance_km} km</span>
            <span className="text-sky-500">{r.origin_country}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AirportExplorer() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Airport[]>([])
  const [selected, setSelected] = useState<Airport | null>(null)
  const [weather, setWeather] = useState<AirportWeather | null>(null)
  const [traffic, setTraffic] = useState<AirportTraffic | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const res = await airportService.search(query || 'International', 15)
        setResults(res.data)
        if (!selected && res.data.length) select(res.data[0])
      } catch { /* ignore transient search errors */ }
    }, 350)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const select = async (airport: Airport) => {
    setSelected(airport)
    setWeather(null)
    setTraffic(null)
    setError(null)
    setLoading(true)
    try {
      const [w, t] = await Promise.allSettled([airportService.weather(airport.iata), airportService.traffic(airport.iata)])
      if (w.status === 'fulfilled') setWeather(w.value.data)
      if (t.status === 'fulfilled') setTraffic(t.value.data)
      if (w.status === 'rejected' && t.status === 'rejected') setError(getErrorMessage(w.reason))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Airport Explorer" subtitle="Real airport database with live weather and traffic" icon={Building2} />

      <div className="card">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search airport, city, IATA/ICAO code..." className="input pl-9" />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {results.map(a => (
            <button key={a.iata} onClick={() => select(a)}
              className={`badge border text-xs cursor-pointer ${selected?.iata === a.iata ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-white/5 border-white/10 text-sky-300 hover:text-white'}`}>
              {a.iata} · {a.city || a.name}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-3">
            <StatCard title={selected.iata} value={selected.name} icon={MapPin} color="text-accent" />
            <StatCard title="Location" value={`${selected.city || '—'}, ${selected.country}`} icon={Building2} color="text-cyan-400" />
            <StatCard title="Elevation" value={selected.elevation_ft != null ? `${Math.round(selected.elevation_ft)} ft` : 'Unknown'} icon={MapPin} color="text-sky-400" />
          </motion.div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="card flex items-center gap-3 border border-rose-500/20 bg-rose-500/5">
              <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
              <p className="text-rose-300 text-sm">{error}</p>
            </div>
          )}

          {weather && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Cloud size={16} className="text-accent" />
                <p className="text-white font-semibold text-sm">Live Weather</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass rounded-xl p-3 flex items-center gap-3">
                  <Thermometer size={16} className="text-amber-400" />
                  <div><p className="text-sky-400 text-[10px] uppercase">Temperature</p><p className="text-white font-semibold text-sm">{weather.temperature_c}°C</p></div>
                </div>
                <div className="glass rounded-xl p-3 flex items-center gap-3">
                  <Wind size={16} className="text-cyan-400" />
                  <div><p className="text-sky-400 text-[10px] uppercase">Wind</p><p className="text-white font-semibold text-sm">{weather.windspeed_kmh} km/h</p></div>
                </div>
                <div className="glass rounded-xl p-3 flex items-center gap-3 col-span-2 sm:col-span-2">
                  <Cloud size={16} className="text-sky-400" />
                  <div><p className="text-sky-400 text-[10px] uppercase">Condition</p><p className="text-white font-semibold text-sm">{weather.condition}</p></div>
                </div>
              </div>
            </div>
          )}

          {traffic && (
            <div className="grid lg:grid-cols-3 gap-4">
              <TrafficTable title="Arriving" icon={PlaneLanding} rows={traffic.arrivals} />
              <TrafficTable title="Departing" icon={PlaneTakeoff} rows={traffic.departures} />
              <TrafficTable title="On Ground" icon={Building2} rows={traffic.on_ground} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
