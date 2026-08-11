import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Plane, Download, Mail, Printer, CheckCircle, User, Calendar, MapPin, Clock, Hash } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

const BOOKINGS = [
  { id: 'BK8821', pnr: 'SKY4X2', passenger: 'James Wilson',    flight: 'SK001', from: 'DXB', to: 'LHR', date: '2024-01-20', dep: '06:30', arr: '11:45', seat: '12A', class: 'Business', gate: 'B14', terminal: 'T3', aircraft: 'Boeing 777', meal: 'Vegetarian', baggage: '32kg', status: 'Confirmed' },
  { id: 'BK8820', pnr: 'SKY9K1', passenger: 'Sarah Chen',      flight: 'SK002', from: 'JFK', to: 'CDG', date: '2024-01-21', dep: '08:15', arr: '21:30', seat: '2F', class: 'First',    gate: 'A22', terminal: 'T4', aircraft: 'Airbus A380', meal: 'Standard', baggage: '40kg', status: 'Confirmed' },
  { id: 'BK8819', pnr: 'SKY7M3', passenger: 'Ahmed Al-Rashid', flight: 'SK003', from: 'SIN', to: 'SYD', date: '2024-01-22', dep: '09:00', arr: '18:20', seat: '28C', class: 'Economy', gate: 'C08', terminal: 'T1', aircraft: 'Boeing 787', meal: 'Halal', baggage: '23kg', status: 'Confirmed' },
]

export default function BoardingPass() {
  const [selected, setSelected] = useState(BOOKINGS[0])
  const [emailSent, setEmailSent] = useState(false)
  const passRef = useRef<HTMLDivElement>(null)

  const classColor = selected.class === 'First' ? 'from-amber-600 to-amber-800' : selected.class === 'Business' ? 'from-sky-700 to-sky-900' : 'from-slate-700 to-slate-900'
  const qrData = `SKYMIND|${selected.pnr}|${selected.passenger}|${selected.flight}|${selected.from}|${selected.to}|${selected.seat}`

  const handleEmail = () => {
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const handlePrint = () => window.print()

  return (
    <div className="space-y-5">
      <PageHeader title="Boarding Pass" subtitle="Digital tickets and travel documents" icon={Plane}>
        <button onClick={handleEmail} className="btn-ghost text-xs flex items-center gap-1.5">
          {emailSent ? <><CheckCircle size={13} className="text-emerald-400" /> Sent!</> : <><Mail size={13} /> Email Ticket</>}
        </button>
        <button onClick={handlePrint} className="btn-primary text-xs flex items-center gap-1.5">
          <Printer size={13} /> Print
        </button>
      </PageHeader>

      {/* Booking selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {BOOKINGS.map(b => (
          <button key={b.id} onClick={() => setSelected(b)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${selected.id === b.id ? 'bg-accent/20 border-accent/40 text-accent' : 'bg-white/5 border-white/10 text-sky-300 hover:bg-white/10'}`}>
            {b.flight} · {b.from}→{b.to}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Boarding Pass Card */}
        <motion.div ref={passRef} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          key={selected.id} className="boarding-pass shadow-2xl glow">

          {/* Header */}
          <div className={`bg-gradient-to-r ${classColor} px-6 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Plane size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg">SkyMind AI</p>
                <p className="text-white/60 text-xs">Boarding Pass</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Class</p>
              <p className="text-white font-bold">{selected.class}</p>
            </div>
          </div>

          {/* Route */}
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-sky-400 text-xs uppercase tracking-widest">From</p>
              <p className="text-white font-black text-5xl">{selected.from}</p>
              <p className="text-sky-300 text-sm mt-1">{selected.dep}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-sky-500" />
              <div className="flex-1 w-px bg-gradient-to-b from-sky-500 to-accent h-8" />
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Plane size={22} className="text-accent rotate-90" />
              </motion.div>
              <div className="flex-1 w-px bg-gradient-to-b from-accent to-sky-500 h-8" />
              <div className="w-2 h-2 rounded-full border-2 border-accent" />
            </div>
            <div className="text-right">
              <p className="text-sky-400 text-xs uppercase tracking-widest">To</p>
              <p className="text-white font-black text-5xl">{selected.to}</p>
              <p className="text-sky-300 text-sm mt-1">{selected.arr}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mx-6 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-950 -ml-10 border-r border-sky-700/30" />
            <div className="flex-1 border-t-2 border-dashed border-sky-700/40" />
            <div className="w-4 h-4 rounded-full bg-sky-950 -mr-10 border-l border-sky-700/30" />
          </div>

          {/* Details Grid */}
          <div className="px-6 py-4 grid grid-cols-3 gap-4">
            {[
              { label: 'Passenger', value: selected.passenger.split(' ')[0], icon: User },
              { label: 'Flight', value: selected.flight, icon: Plane },
              { label: 'Date', value: selected.date.slice(5), icon: Calendar },
              { label: 'Seat', value: selected.seat, icon: Hash },
              { label: 'Gate', value: selected.gate, icon: MapPin },
              { label: 'Terminal', value: selected.terminal, icon: Clock },
            ].map(item => (
              <div key={item.label}>
                <p className="text-sky-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <item.icon size={9} />{item.label}
                </p>
                <p className="text-white font-bold text-sm mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* QR + Barcode */}
          <div className="px-6 pb-6 flex items-center gap-6">
            <div className="p-2 bg-white rounded-xl">
              <QRCodeSVG value={qrData} size={80} bgColor="#ffffff" fgColor="#020b18" level="H" />
            </div>
            <div className="flex-1">
              <p className="text-sky-400 text-xs mb-1">Booking Reference</p>
              <p className="text-white font-black text-2xl tracking-widest">{selected.pnr}</p>
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="bg-white/80 rounded-sm" style={{ width: Math.random() > 0.5 ? 2 : 1, height: 24 + Math.random() * 12 }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ticket Details */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card">
            <p className="text-white font-semibold mb-3 flex items-center gap-2"><User size={15} className="text-accent" /> Passenger Details</p>
            <div className="space-y-2">
              {[
                ['Full Name', selected.passenger],
                ['PNR', selected.pnr],
                ['Aircraft', selected.aircraft],
                ['Meal', selected.meal],
                ['Baggage', selected.baggage],
                ['Status', selected.status],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sky-400 text-xs">{k}</span>
                  <span className="text-white text-xs font-medium">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
            <p className="text-white font-semibold mb-3 flex items-center gap-2"><Clock size={15} className="text-accent" /> Flight Timeline</p>
            {[
              { time: selected.dep, event: 'Departure', detail: `Gate ${selected.gate} · Terminal ${selected.terminal}`, done: true },
              { time: '+2h', event: 'Cruising Altitude', detail: '38,000 ft · 890 km/h', done: true },
              { time: selected.arr, event: 'Arrival', detail: selected.to, done: false },
            ].map((step, i) => (
              <div key={i} className="flex gap-3 mb-3 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${step.done ? 'bg-accent border-accent' : 'border-sky-600'}`} />
                  {i < 2 && <div className="w-px flex-1 bg-sky-800 mt-1" style={{ minHeight: 24 }} />}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-accent text-xs font-bold">{step.time}</span>
                    <span className="text-white text-sm font-semibold">{step.event}</span>
                  </div>
                  <p className="text-sky-400 text-xs mt-0.5">{step.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
            <button onClick={handleEmail} className="btn-ghost flex-1 flex items-center justify-center gap-2 text-sm">
              <Mail size={15} /> Email Ticket
            </button>
            <button className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              <Download size={15} /> Download PDF
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
