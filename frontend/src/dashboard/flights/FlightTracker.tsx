import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Plane, Search, Filter, RefreshCw, Wind, Eye, Thermometer } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatusBadge from '../../components/ui/StatusBadge'

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const planeIcon = (color = '#3b82f6') => L.divIcon({
  html: `<div style="color:${color};transform:rotate(45deg);font-size:18px;filter:drop-shadow(0 0 4px ${color})">✈</div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const FLIGHTS = [
  { id: 'SK001', from: 'DXB', to: 'LHR', dep: '06:30', arr: '11:45', status: 'On Time',   aircraft: 'B777', alt: 38000, speed: 890, fromCoord: [25.2, 55.4] as [number,number], toCoord: [51.5, -0.1] as [number,number], progress: 0.45, color: '#10b981' },
  { id: 'SK002', from: 'JFK', to: 'CDG', dep: '08:15', arr: '21:30', status: 'Delayed',   aircraft: 'A380', alt: 36000, speed: 850, fromCoord: [40.6, -73.8] as [number,number], toCoord: [49.0, 2.5]  as [number,number], progress: 0.30, color: '#f59e0b' },
  { id: 'SK003', from: 'SIN', to: 'SYD', dep: '09:00', arr: '18:20', status: 'On Time',   aircraft: 'B787', alt: 40000, speed: 910, fromCoord: [1.4,  103.9] as [number,number], toCoord: [-33.9, 151.2] as [number,number], progress: 0.60, color: '#10b981' },
  { id: 'SK004', from: 'LHR', to: 'DXB', dep: '11:30', arr: '21:00', status: 'Boarding',  aircraft: 'A350', alt: 0,     speed: 0,   fromCoord: [51.5, -0.1] as [number,number], toCoord: [25.2, 55.4]  as [number,number], progress: 0.02, color: '#3b82f6' },
  { id: 'SK005', from: 'HKG', to: 'NRT', dep: '13:45', arr: '18:30', status: 'On Time',   aircraft: 'B737', alt: 35000, speed: 820, fromCoord: [22.3, 113.9] as [number,number], toCoord: [35.7, 140.4] as [number,number], progress: 0.70, color: '#10b981' },
  { id: 'SK006', from: 'LAX', to: 'SIN', dep: '23:55', arr: '07:40', status: 'Scheduled', aircraft: 'A380', alt: 0,     speed: 0,   fromCoord: [33.9, -118.4] as [number,number], toCoord: [1.4, 103.9] as [number,number], progress: 0.00, color: '#64748b' },
]

function lerp(a: [number,number], b: [number,number], t: number): [number,number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

export default function FlightTracker() {
  const [flights, setFlights] = useState(FLIGHTS)
  const [selected, setSelected] = useState<typeof FLIGHTS[0] | null>(null)
  const [search, setSearch] = useState('')
  const [tick, setTick] = useState(0)

  // Animate flight positions
  useEffect(() => {
    const id = setInterval(() => {
      setFlights(prev => prev.map(f =>
        f.progress > 0 && f.progress < 1
          ? { ...f, progress: Math.min(1, f.progress + 0.001) }
          : f
      ))
      setTick(t => t + 1)
    }, 500)
    return () => clearInterval(id)
  }, [])

  const filtered = flights.filter(f =>
    f.id.toLowerCase().includes(search.toLowerCase()) ||
    f.from.toLowerCase().includes(search.toLowerCase()) ||
    f.to.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader title="Live Flight Tracker" subtitle="Real-time global flight monitoring" icon={Plane}>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium">{flights.filter(f => f.progress > 0 && f.progress < 1).length} Airborne</span>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 card p-0 overflow-hidden" style={{ height: 480 }}>
          <MapContainer center={[20, 20]} zoom={2} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {flights.map(f => {
              const pos = lerp(f.fromCoord, f.toCoord, f.progress)
              return (
                <Marker key={f.id} position={pos} icon={planeIcon(f.color)}
                  eventHandlers={{ click: () => setSelected(f) }}>
                  <Popup>
                    <div className="text-xs font-bold">{f.id}: {f.from} → {f.to}</div>
                    <div className="text-xs">{f.status} · {f.aircraft}</div>
                  </Popup>
                </Marker>
              )
            })}
            {flights.map(f => (
              <Polyline key={f.id + '-line'} positions={[f.fromCoord, f.toCoord]}
                pathOptions={{ color: f.color, weight: 1, opacity: 0.3, dashArray: '6 6' }} />
            ))}
          </MapContainer>
        </motion.div>

        {/* Flight List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card flex flex-col gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search flight, airport..." className="input pl-8 text-xs h-8" />
          </div>
          <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight: 380 }}>
            {filtered.map(f => (
              <motion.div key={f.id} whileHover={{ x: 2 }}
                onClick={() => setSelected(f)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === f.id ? 'bg-accent/10 border-accent/30' : 'bg-white/3 border-white/5 hover:bg-white/8'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold text-sm">{f.id}</span>
                  <StatusBadge status={f.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-sky-300">
                  <span className="font-semibold">{f.from}</span>
                  <div className="flex-1 border-t border-dashed border-sky-700 relative">
                    <Plane size={10} className="absolute -top-1.5 text-accent" style={{ left: `${f.progress * 100}%`, transform: 'translateX(-50%)' }} />
                  </div>
                  <span className="font-semibold">{f.to}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-sky-500">
                  <span>{f.aircraft}</span>
                  {f.alt > 0 && <span>{f.alt.toLocaleString()} ft · {f.speed} km/h</span>}
                </div>
                {f.progress > 0 && f.progress < 1 && (
                  <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${f.progress * 100}%` }} />
                  </div>
                )}
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
                  <p className="text-white font-bold">{selected.id} — {selected.from} → {selected.to}</p>
                  <p className="text-sky-400 text-xs">{selected.aircraft} · {selected.dep} → {selected.arr}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-sky-400 hover:text-white text-xs btn-ghost py-1 px-3">Close</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Plane, label: 'Status', value: selected.status },
                { icon: Wind, label: 'Speed', value: selected.speed > 0 ? `${selected.speed} km/h` : 'Ground' },
                { icon: Eye, label: 'Altitude', value: selected.alt > 0 ? `${selected.alt.toLocaleString()} ft` : 'On Ground' },
                { icon: Thermometer, label: 'Progress', value: `${Math.round(selected.progress * 100)}%` },
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
            {/* Timeline */}
            <div className="mt-4 flex items-center gap-3">
              <div className="text-center">
                <p className="text-white font-black text-xl">{selected.from}</p>
                <p className="text-sky-400 text-xs">{selected.dep}</p>
              </div>
              <div className="flex-1 relative h-8 flex items-center">
                <div className="w-full h-0.5 bg-white/10 rounded-full" />
                <div className="absolute h-0.5 bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all duration-1000"
                  style={{ width: `${selected.progress * 100}%` }} />
                <motion.div className="absolute" style={{ left: `${selected.progress * 100}%`, transform: 'translateX(-50%)' }}
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Plane size={16} className="text-accent" />
                </motion.div>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-xl">{selected.to}</p>
                <p className="text-sky-400 text-xs">{selected.arr}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
