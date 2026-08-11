import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Plane, Search, RefreshCw, Wind, Gauge, Navigation, Hash, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatusBadge from '../../components/ui/StatusBadge'
import { liveFlightService, LiveFlightState, DelayEstimate } from '../../services/liveFlightService'
import { getErrorMessage } from '../../services/authService'

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const planeIcon = (heading: number | null, onGround: boolean) => L.divIcon({
  html: `<div style="color:${onGround ? '#64748b' : '#3b82f6'};transform:rotate(${(heading ?? 0) - 45}deg);font-size:16px;filter:drop-shadow(0 0 4px ${onGround ? '#64748b' : '#3b82f6'})">✈</div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// Default live-map region: Europe / Middle East / South Asia — SkyMind's DXB-centric operating area
const HOME_BBOX = { lamin: 0, lomin: -20, lamax: 65, lomax: 90 }
const POLL_MS = 30000

const flightStatus = (f: LiveFlightState) =>
  f.on_ground ? 'On Ground' : (f.vertical_rate_ms ?? 0) < -1 ? 'Descending' : (f.vertical_rate_ms ?? 0) > 1 ? 'Climbing' : 'Cruising'

export default function FlightTracker() {
  const [flights, setFlights] = useState<LiveFlightState[]>([])
  const [selected, setSelected] = useState<LiveFlightState | null>(null)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<LiveFlightState[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [delay, setDelay] = useState<DelayEstimate | null>(null)
  const [delayLoading, setDelayLoading] = useState(false)
  const [delayError, setDelayError] = useState<string | null>(null)

  const loadFlights = useCallback(async () => {
    try {
      const res = await liveFlightService.list(HOME_BBOX)
      setFlights(res.data.flights)
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFlights()
    const id = setInterval(loadFlights, POLL_MS)
    return () => clearInterval(id)
  }, [loadFlights])

  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return }
    const id = setTimeout(async () => {
      try {
        const res = await liveFlightService.search(search.trim())
        setSearchResults(res.data.flights)
      } catch {
        setSearchResults([])
      }
    }, 400)
    return () => clearTimeout(id)
  }, [search])

  const select = async (f: LiveFlightState) => {
    setSelected(f)
    setDelay(null)
    setDelayError(null)
  }

  const predictDelay = async () => {
    if (!selected) return
    setDelayLoading(true)
    setDelayError(null)
    try {
      const res = await liveFlightService.delayEstimate(selected.icao24)
      setDelay(res.data)
    } catch (err) {
      setDelayError(getErrorMessage(err))
    } finally {
      setDelayLoading(false)
    }
  }

  const listed = searchResults ?? flights

  return (
    <div className="space-y-5">
      <PageHeader title="Live Flight Tracker" subtitle="Real-time global flight monitoring via OpenSky Network" icon={Plane}>
        <button onClick={loadFlights} className="btn-ghost text-xs flex items-center gap-1.5">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">{flights.filter(f => !f.on_ground).length} Airborne</span>
        </div>
      </PageHeader>

      {error && (
        <div className="card flex items-center gap-3 border border-rose-500/20 bg-rose-500/5">
          <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
          <p className="text-rose-300 text-sm">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 card p-0 overflow-hidden" style={{ height: 480 }}>
          <MapContainer center={[25, 40]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {flights.map(f => (
              <Marker key={f.icao24} position={[f.lat, f.lon]} icon={planeIcon(f.heading, f.on_ground)}
                eventHandlers={{ click: () => select(f) }}>
                <Popup>
                  <div className="text-xs font-bold">{f.callsign || f.icao24}</div>
                  <div className="text-xs">{flightStatus(f)} · {f.origin_country}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Flight List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search flight number / callsign..." className="input pl-8 text-xs h-8" />
          </div>
          <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight: 380 }}>
            {loading && listed.length === 0 && <p className="text-sky-400 text-xs text-center py-8">Loading live flights…</p>}
            {!loading && listed.length === 0 && <p className="text-sky-400 text-xs text-center py-8">No flights found.</p>}
            {listed.map(f => (
              <motion.div key={f.icao24} whileHover={{ x: 2 }}
                onClick={() => select(f)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${selected?.icao24 === f.icao24 ? 'bg-accent/10 border-accent/30' : 'bg-white/3 border-white/5 hover:bg-white/8'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-sm">{f.callsign || f.icao24}</span>
                  <StatusBadge status={flightStatus(f)} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-sky-500">
                  <span>{f.origin_country}</span>
                  {!f.on_ground && f.altitude_m != null && <span>{Math.round(f.altitude_m).toLocaleString()} m · {Math.round((f.velocity_ms ?? 0) * 3.6)} km/h</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Selected Flight Detail */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent"><Plane size={18} /></div>
                <div>
                  <p className="text-white font-bold">{selected.callsign || 'Unknown callsign'} — {selected.origin_country}</p>
                  <p className="text-sky-400 text-xs">ICAO24 {selected.icao24} · {flightStatus(selected)}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-sky-400 hover:text-white text-xs btn-ghost py-1 px-3">Close</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Hash, label: 'Aircraft Class', value: selected.category },
                { icon: Wind, label: 'Speed', value: selected.on_ground ? 'On Ground' : `${Math.round((selected.velocity_ms ?? 0) * 3.6)} km/h` },
                { icon: Gauge, label: 'Altitude', value: selected.on_ground ? 'Ground level' : selected.altitude_m != null ? `${Math.round(selected.altitude_m).toLocaleString()} m` : 'Unknown' },
                { icon: Navigation, label: 'Heading', value: selected.heading != null ? `${Math.round(selected.heading)}°` : 'Unknown' },
              ].map(item => (
                <div key={item.label} className="glass rounded-xl p-3 flex items-center gap-3">
                  <item.icon size={16} className="text-accent" />
                  <div>
                    <p className="text-sky-400 text-[10px] uppercase tracking-wider">{item.label}</p>
                    <p className="text-white font-semibold text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Delay Prediction */}
            <div className="mt-4 pt-4 border-t border-white/5">
              {!delay && (
                <button onClick={predictDelay} disabled={delayLoading} className="btn-primary text-xs">
                  {delayLoading ? 'Predicting…' : 'Predict Delay with AI Model'}
                </button>
              )}
              {delayError && <p className="text-rose-400 text-xs mt-2">{delayError}</p>}
              {delay && (
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm">
                    Predicted delay: <span className="font-bold text-accent">{delay.predicted_delay_minutes} min</span>
                  </p>
                  <p className="text-sky-400 text-[11px]">{delay.notes.weather_score}</p>
                  <p className="text-sky-500 text-[11px]">{delay.notes.destination}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
