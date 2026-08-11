import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Globe, CheckSquare, Phone, Cloud, AlertTriangle, CheckCircle, Square } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

// ── Currency Converter ────────────────────────────────────────────────────────
const RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, AED: 3.67, JPY: 149.5, INR: 83.2, SGD: 1.34, AUD: 1.53 }
const FLAGS: Record<string, string> = { USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', AED: '🇦🇪', JPY: '🇯🇵', INR: '🇮🇳', SGD: '🇸🇬', AUD: '🇦🇺' }

function CurrencyConverter() {
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('AED')
  const result = (parseFloat(amount || '0') / RATES[from] * RATES[to]).toFixed(2)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <p className="text-white font-semibold mb-4 flex items-center gap-2"><DollarSign size={15} className="text-accent" /> Currency Converter</p>
      <div className="space-y-3">
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input" placeholder="Amount" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sky-400 text-xs mb-1 block">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="select">
              {Object.keys(RATES).map(c => <option key={c} value={c}>{FLAGS[c]} {c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sky-400 text-xs mb-1 block">To</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="select">
              {Object.keys(RATES).map(c => <option key={c} value={c}>{FLAGS[c]} {c}</option>)}
            </select>
          </div>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-sky-400 text-xs mb-1">{amount} {from} =</p>
          <p className="text-white font-black text-3xl">{result} <span className="text-accent">{to}</span></p>
          <p className="text-sky-500 text-xs mt-1">1 {from} = {(RATES[to] / RATES[from]).toFixed(4)} {to}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(RATES).filter(([c]) => c !== from && c !== to).slice(0, 4).map(([c, r]) => (
            <div key={c} className="glass rounded-xl p-2 text-center">
              <p className="text-lg">{FLAGS[c]}</p>
              <p className="text-white text-xs font-bold">{(parseFloat(amount || '0') / RATES[from] * r).toFixed(0)}</p>
              <p className="text-sky-500 text-[10px]">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Visa Information ──────────────────────────────────────────────────────────
const VISA_INFO = [
  { dest: 'United Arab Emirates', flag: '🇦🇪', type: 'Visa on Arrival', duration: '30 days', fee: 'Free', note: 'For most nationalities' },
  { dest: 'United Kingdom', flag: '🇬🇧', type: 'eVisa Required', duration: '6 months', fee: '$115', note: 'Apply 3 weeks before' },
  { dest: 'Japan', flag: '🇯🇵', type: 'Visa Free', duration: '90 days', fee: 'Free', note: 'Most passport holders' },
  { dest: 'Singapore', flag: '🇸🇬', type: 'Visa Free', duration: '30 days', fee: 'Free', note: 'Most nationalities' },
  { dest: 'France', flag: '🇫🇷', type: 'Schengen Visa', duration: '90 days', fee: '$80', note: 'Apply at embassy' },
  { dest: 'USA', flag: '🇺🇸', type: 'ESTA Required', duration: '90 days', fee: '$21', note: 'Apply online 72h before' },
]

function VisaInfo() {
  const [search, setSearch] = useState('')
  const filtered = VISA_INFO.filter(v => v.dest.toLowerCase().includes(search.toLowerCase()))
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
      <p className="text-white font-semibold mb-3 flex items-center gap-2"><Globe size={15} className="text-accent" /> Visa Information</p>
      <input value={search} onChange={e => setSearch(e.target.value)} className="input mb-3 text-xs" placeholder="Search destination..." />
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.map(v => (
          <div key={v.dest} className="flex items-center justify-between p-3 glass rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{v.flag}</span>
              <div>
                <p className="text-white text-sm font-semibold">{v.dest}</p>
                <p className="text-sky-400 text-xs">{v.note}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`badge border text-xs ${v.type === 'Visa Free' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : v.type === 'Visa on Arrival' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                {v.type}
              </span>
              <p className="text-sky-400 text-xs mt-1">{v.duration} · {v.fee}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Travel Checklist ──────────────────────────────────────────────────────────
const DEFAULT_CHECKLIST = [
  { id: 1, item: 'Valid Passport (6+ months)', done: true, category: 'Documents' },
  { id: 2, item: 'Boarding Pass / E-ticket', done: true, category: 'Documents' },
  { id: 3, item: 'Travel Insurance', done: false, category: 'Documents' },
  { id: 4, item: 'Visa / Entry Requirements', done: false, category: 'Documents' },
  { id: 5, item: 'Hotel Booking Confirmation', done: true, category: 'Accommodation' },
  { id: 6, item: 'Local Currency / Travel Card', done: false, category: 'Finance' },
  { id: 7, item: 'Medications & Prescriptions', done: false, category: 'Health' },
  { id: 8, item: 'Phone Charger & Adaptor', done: true, category: 'Electronics' },
  { id: 9, item: 'Luggage Weight Check', done: false, category: 'Baggage' },
  { id: 10, item: 'Emergency Contact Numbers', done: false, category: 'Safety' },
]

function TravelChecklist() {
  const [items, setItems] = useState(DEFAULT_CHECKLIST)
  const [newItem, setNewItem] = useState('')
  const done = items.filter(i => i.done).length

  const toggle = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const addItem = () => {
    if (!newItem.trim()) return
    setItems(prev => [...prev, { id: Date.now(), item: newItem, done: false, category: 'Custom' }])
    setNewItem('')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-semibold flex items-center gap-2"><CheckSquare size={15} className="text-accent" /> Travel Checklist</p>
        <span className="badge bg-accent/10 text-accent border border-accent/20">{done}/{items.length}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${(done / items.length) * 100}%` }} />
      </div>
      <div className="space-y-1.5 max-h-56 overflow-y-auto mb-3">
        {items.map(item => (
          <button key={item.id} onClick={() => toggle(item.id)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left">
            {item.done
              ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
              : <Square size={16} className="text-sky-600 flex-shrink-0" />}
            <span className={`text-sm flex-1 ${item.done ? 'line-through text-sky-600' : 'text-white'}`}>{item.item}</span>
            <span className="text-[10px] text-sky-600">{item.category}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newItem} onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addItem()}
          className="input text-xs flex-1" placeholder="Add item..." />
        <button onClick={addItem} className="btn-primary text-xs px-3 py-2">Add</button>
      </div>
    </motion.div>
  )
}

// ── Emergency Contacts ────────────────────────────────────────────────────────
const EMERGENCY = [
  { country: 'UAE', flag: '🇦🇪', police: '999', ambulance: '998', embassy: '+971-4-309-4000', hospital: 'Dubai Hospital: +971-4-219-5000' },
  { country: 'UK', flag: '🇬🇧', police: '999', ambulance: '999', embassy: '+44-20-7499-9000', hospital: 'NHS: 111' },
  { country: 'USA', flag: '🇺🇸', police: '911', ambulance: '911', embassy: '+1-202-501-4444', hospital: 'Emergency: 911' },
  { country: 'Singapore', flag: '🇸🇬', police: '999', ambulance: '995', embassy: '+65-6737-9100', hospital: 'SGH: +65-6222-3322' },
]

function EmergencyContacts() {
  const [active, setActive] = useState('UAE')
  const info = EMERGENCY.find(e => e.country === active)!
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
      <p className="text-white font-semibold mb-3 flex items-center gap-2"><Phone size={15} className="text-rose-400" /> Emergency Contacts</p>
      <div className="flex gap-2 mb-3 flex-wrap">
        {EMERGENCY.map(e => (
          <button key={e.country} onClick={() => setActive(e.country)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${active === e.country ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-sky-400 border border-white/10 hover:bg-white/10'}`}>
            {e.flag} {e.country}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {[
          { label: '🚔 Police', value: info.police },
          { label: '🚑 Ambulance', value: info.ambulance },
          { label: '🏛️ Embassy', value: info.embassy },
          { label: '🏥 Hospital', value: info.hospital },
        ].map(c => (
          <div key={c.label} className="flex items-center justify-between p-3 glass rounded-xl">
            <span className="text-sky-300 text-sm">{c.label}</span>
            <a href={`tel:${c.value}`} className="text-white font-bold text-sm hover:text-accent transition-colors">{c.value}</a>
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start gap-2">
        <AlertTriangle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
        <p className="text-rose-300 text-xs">In a life-threatening emergency, always call local emergency services first.</p>
      </div>
    </motion.div>
  )
}

// ── Weather Widget ────────────────────────────────────────────────────────────
const WEATHER = [
  { city: 'Dubai', code: 'DXB', temp: 38, feels: 42, condition: 'Sunny', humidity: 45, wind: 18, icon: '☀️', forecast: [38,39,37,36,38] },
  { city: 'London', code: 'LHR', temp: 12, feels: 9, condition: 'Cloudy', humidity: 78, wind: 32, icon: '☁️', forecast: [12,11,13,14,12] },
  { city: 'New York', code: 'JFK', temp: 8, feels: 4, condition: 'Stormy', humidity: 85, wind: 45, icon: '⛈️', forecast: [8,6,9,11,10] },
  { city: 'Singapore', code: 'SIN', temp: 31, feels: 36, condition: 'Humid', humidity: 88, wind: 12, icon: '🌤️', forecast: [31,32,30,31,31] },
  { city: 'Tokyo', code: 'NRT', temp: 18, feels: 16, condition: 'Clear', humidity: 55, wind: 20, icon: '🌸', forecast: [18,19,17,18,20] },
]

function WeatherWidget() {
  const [active, setActive] = useState('DXB')
  const w = WEATHER.find(x => x.code === active)!
  const days = ['Mon','Tue','Wed','Thu','Fri']
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card">
      <p className="text-white font-semibold mb-3 flex items-center gap-2"><Cloud size={15} className="text-sky-400" /> Weather at Destination</p>
      <div className="flex gap-2 mb-4 flex-wrap">
        {WEATHER.map(x => (
          <button key={x.code} onClick={() => setActive(x.code)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${active === x.code ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-white/5 text-sky-500 border border-white/10 hover:bg-white/10'}`}>
            {x.code}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{w.icon}</span>
        <div>
          <p className="text-white font-black text-4xl">{w.temp}°C</p>
          <p className="text-sky-400 text-sm">{w.city} · {w.condition}</p>
          <p className="text-sky-500 text-xs">Feels like {w.feels}°C</p>
        </div>
        <div className="ml-auto space-y-1 text-xs text-right">
          <p className="text-sky-400">💧 {w.humidity}%</p>
          <p className="text-sky-400">💨 {w.wind} km/h</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {w.forecast.map((t, i) => (
          <div key={i} className="glass rounded-xl p-2 text-center">
            <p className="text-sky-500 text-[10px]">{days[i]}</p>
            <p className="text-white font-bold text-sm">{t}°</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TravelTools() {
  return (
    <div className="space-y-5">
      <PageHeader title="Travel Tools" subtitle="Currency, visa, weather, checklist & emergency info" icon={Globe} />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <CurrencyConverter />
          <TravelChecklist />
        </div>
        <div className="space-y-5">
          <WeatherWidget />
          <VisaInfo />
          <EmergencyContacts />
        </div>
      </div>
    </div>
  )
}
