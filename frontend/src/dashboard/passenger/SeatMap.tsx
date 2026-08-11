import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, UtensilsCrossed, Luggage, Coffee, ShieldCheck, CheckCircle } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

type SeatStatus = 'available' | 'occupied' | 'selected' | 'business' | 'business-selected'

const MEALS = [
  { id: 'standard', label: 'Standard', desc: 'Chicken or pasta', icon: '🍽️', price: 0 },
  { id: 'vegetarian', label: 'Vegetarian', desc: 'Plant-based meal', icon: '🥗', price: 0 },
  { id: 'halal', label: 'Halal', desc: 'Certified halal', icon: '🥩', price: 0 },
  { id: 'vegan', label: 'Vegan', desc: 'Fully plant-based', icon: '🌱', price: 0 },
  { id: 'kids', label: "Kids' Meal", desc: 'Child-friendly', icon: '🧒', price: 0 },
  { id: 'diabetic', label: 'Diabetic', desc: 'Low sugar', icon: '💊', price: 0 },
]

const EXTRAS = [
  { id: 'bag10', label: '+10kg Baggage', price: 45, icon: Luggage },
  { id: 'bag20', label: '+20kg Baggage', price: 80, icon: Luggage },
  { id: 'lounge', label: 'Lounge Access', price: 65, icon: Coffee },
  { id: 'insurance', label: 'Travel Insurance', price: 35, icon: ShieldCheck },
]

function generateSeats(rows: number, startRow: number, cols: string[], occupied: string[]): Record<string, SeatStatus> {
  const seats: Record<string, SeatStatus> = {}
  for (let r = startRow; r < startRow + rows; r++) {
    for (const c of cols) {
      const key = `${r}${c}`
      seats[key] = occupied.includes(key) ? 'occupied' : 'available'
    }
  }
  return seats
}

const OCCUPIED_BUSINESS = ['1A','1C','2D','2F','3B','4A','4F']
const OCCUPIED_ECONOMY  = ['10A','10B','11C','12D','13E','14F','15A','16B','17C','18D','20A','20B','21C','22D','23E','24F','25A','26B','27C','28D','29E','30F']

export default function SeatMap() {
  const [businessSeats, setBusinessSeats] = useState<Record<string, SeatStatus>>({
    ...generateSeats(6, 1, ['A','C','D','F'], OCCUPIED_BUSINESS),
    ...Object.fromEntries(OCCUPIED_BUSINESS.map(s => [s, 'occupied' as SeatStatus])),
  })
  const [econSeats, setEconSeats] = useState<Record<string, SeatStatus>>({
    ...generateSeats(25, 10, ['A','B','C','D','E','F'], OCCUPIED_ECONOMY),
    ...Object.fromEntries(OCCUPIED_ECONOMY.map(s => [s, 'occupied' as SeatStatus])),
  })
  const [selectedMeal, setSelectedMeal] = useState('standard')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const selectedBusiness = Object.entries(businessSeats).filter(([,v]) => v === 'business-selected').map(([k]) => k)
  const selectedEcon = Object.entries(econSeats).filter(([,v]) => v === 'selected').map(([k]) => k)
  const allSelected = [...selectedBusiness, ...selectedEcon]

  const toggleBusiness = (key: string) => {
    setBusinessSeats(prev => {
      const cur = prev[key]
      if (cur === 'occupied') return prev
      const cleared = Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, v === 'business-selected' ? 'business' : v]))
      return { ...cleared, [key]: cur === 'business-selected' ? 'business' : 'business-selected' }
    })
  }

  const toggleEcon = (key: string) => {
    setEconSeats(prev => {
      const cur = prev[key]
      if (cur === 'occupied') return prev
      const cleared = Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, v === 'selected' ? 'available' : v]))
      return { ...cleared, [key]: cur === 'selected' ? 'available' : 'selected' }
    })
  }

  const toggleExtra = (id: string) => setSelectedExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])

  const totalExtras = selectedExtras.reduce((sum, id) => sum + (EXTRAS.find(e => e.id === id)?.price ?? 0), 0)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="space-y-5">
      <PageHeader title="Seat Selection" subtitle="Choose your seat, meal, and extras" icon={Plane}>
        <button onClick={handleSave} className="btn-primary text-xs flex items-center gap-1.5">
          {saved ? <><CheckCircle size={13} /> Saved!</> : 'Confirm Selection'}
        </button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Seat Map */}
        <div className="lg:col-span-2 space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { cls: 'w-4 h-4 rounded bg-amber-500/30 border border-amber-500/40', label: 'Business Available' },
              { cls: 'w-4 h-4 rounded bg-amber-500 border border-amber-400', label: 'Business Selected' },
              { cls: 'w-4 h-4 rounded bg-sky-800/60 border border-sky-700/40', label: 'Economy Available' },
              { cls: 'w-4 h-4 rounded bg-accent border border-accent', label: 'Selected' },
              { cls: 'w-4 h-4 rounded bg-white/5 border border-white/5', label: 'Occupied' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-sky-400">
                <div className={l.cls} />{l.label}
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            {/* Aircraft nose */}
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-16 h-8 bg-sky-800/40 rounded-t-full border border-sky-700/30 flex items-center justify-center">
                  <Plane size={14} className="text-accent -rotate-90" />
                </div>
                <p className="text-sky-500 text-[10px] uppercase tracking-widest">Front</p>
              </div>
            </div>

            {/* Business Class */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-amber-500/20" />
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest px-2">Business Class</span>
                <div className="h-px flex-1 bg-amber-500/20" />
              </div>
              <div className="flex flex-col gap-1.5 items-center">
                {[1,2,3,4,5,6].map(row => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="text-sky-600 text-[10px] w-4 text-right">{row}</span>
                    <div className="flex gap-1.5">
                      {['A','C'].map(col => {
                        const key = `${row}${col}`
                        const st = businessSeats[key] ?? 'business'
                        return (
                          <button key={key} onClick={() => toggleBusiness(key)}
                            className={`seat-btn ${st === 'occupied' ? 'seat-occupied' : st === 'business-selected' ? 'seat-business-selected' : 'seat-business'}`}>
                            {st !== 'occupied' ? key : ''}
                          </button>
                        )
                      })}
                    </div>
                    <div className="w-8" />
                    <div className="flex gap-1.5">
                      {['D','F'].map(col => {
                        const key = `${row}${col}`
                        const st = businessSeats[key] ?? 'business'
                        return (
                          <button key={key} onClick={() => toggleBusiness(key)}
                            className={`seat-btn ${st === 'occupied' ? 'seat-occupied' : st === 'business-selected' ? 'seat-business-selected' : 'seat-business'}`}>
                            {st !== 'occupied' ? key : ''}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Economy Class */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-sky-700/30" />
                <span className="text-sky-400 text-xs font-bold uppercase tracking-widest px-2">Economy Class</span>
                <div className="h-px flex-1 bg-sky-700/30" />
              </div>
              <div className="flex flex-col gap-1 items-center overflow-y-auto" style={{ maxHeight: 320 }}>
                <div className="flex gap-1 mb-1 text-[9px] text-sky-600 font-bold">
                  {['A','B','C','','D','E','F'].map((c,i) => <div key={i} className="w-8 text-center">{c}</div>)}
                </div>
                {Array.from({ length: 25 }, (_, i) => i + 10).map(row => (
                  <div key={row} className="flex items-center gap-1">
                    <span className="text-sky-600 text-[9px] w-5 text-right">{row}</span>
                    <div className="flex gap-1">
                      {['A','B','C'].map(col => {
                        const key = `${row}${col}`
                        const st = econSeats[key] ?? 'available'
                        return (
                          <button key={key} onClick={() => toggleEcon(key)}
                            className={`seat-btn text-[9px] ${st === 'occupied' ? 'seat-occupied' : st === 'selected' ? 'seat-selected' : 'seat-available'}`}>
                            {st !== 'occupied' ? col : ''}
                          </button>
                        )
                      })}
                    </div>
                    <div className="w-4" />
                    <div className="flex gap-1">
                      {['D','E','F'].map(col => {
                        const key = `${row}${col}`
                        const st = econSeats[key] ?? 'available'
                        return (
                          <button key={key} onClick={() => toggleEcon(key)}
                            className={`seat-btn text-[9px] ${st === 'occupied' ? 'seat-occupied' : st === 'selected' ? 'seat-selected' : 'seat-available'}`}>
                            {st !== 'occupied' ? col : ''}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Selected Seats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
            <p className="text-white font-semibold mb-3">Selected Seats</p>
            {allSelected.length === 0
              ? <p className="text-sky-500 text-sm">No seats selected</p>
              : <div className="flex flex-wrap gap-2">
                  {allSelected.map(s => (
                    <span key={s} className="badge bg-accent/20 text-accent border border-accent/30">{s}</span>
                  ))}
                </div>
            }
          </motion.div>

          {/* Meal Selection */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
            <p className="text-white font-semibold mb-3 flex items-center gap-2"><UtensilsCrossed size={14} className="text-accent" /> Meal Preference</p>
            <div className="grid grid-cols-2 gap-2">
              {MEALS.map(m => (
                <button key={m.id} onClick={() => setSelectedMeal(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${selectedMeal === m.id ? 'bg-accent/20 border-accent/40' : 'bg-white/3 border-white/5 hover:bg-white/8'}`}>
                  <div className="text-lg mb-0.5">{m.icon}</div>
                  <p className="text-white text-xs font-semibold">{m.label}</p>
                  <p className="text-sky-500 text-[10px]">{m.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Extras */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
            <p className="text-white font-semibold mb-3">Add-ons</p>
            <div className="space-y-2">
              {EXTRAS.map(e => (
                <button key={e.id} onClick={() => toggleExtra(e.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedExtras.includes(e.id) ? 'bg-accent/20 border-accent/40' : 'bg-white/3 border-white/5 hover:bg-white/8'}`}>
                  <div className="flex items-center gap-2">
                    <e.icon size={14} className={selectedExtras.includes(e.id) ? 'text-accent' : 'text-sky-400'} />
                    <span className="text-white text-xs font-medium">{e.label}</span>
                  </div>
                  <span className="text-accent text-xs font-bold">+${e.price}</span>
                </button>
              ))}
            </div>
            {totalExtras > 0 && (
              <div className="mt-3 pt-3 border-t border-white/5 flex justify-between">
                <span className="text-sky-400 text-sm">Add-ons Total</span>
                <span className="text-white font-bold">${totalExtras}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
