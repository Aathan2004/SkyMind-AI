import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Plane, Brain, BarChart3, Shield, Zap, Globe, Star,
  ArrowRight, Search, Calendar, Users, ChevronDown, Mail
} from 'lucide-react'

const destinations = [
  { city: 'Dubai', code: 'DXB', country: 'UAE', price: 299, img: '🇦🇪' },
  { city: 'London', code: 'LHR', country: 'UK', price: 449, img: '🇬🇧' },
  { city: 'New York', code: 'JFK', country: 'USA', price: 599, img: '🇺🇸' },
  { city: 'Singapore', code: 'SIN', country: 'SGP', price: 389, img: '🇸🇬' },
  { city: 'Tokyo', code: 'NRT', country: 'JPN', price: 520, img: '🇯🇵' },
  { city: 'Paris', code: 'CDG', country: 'FRA', price: 410, img: '🇫🇷' },
]

const stats = [
  { value: '180+', label: 'Destinations' },
  { value: '2.4M', label: 'Passengers/Year' },
  { value: '99.2%', label: 'AI Accuracy' },
  { value: '94%', label: 'On-Time Rate' },
]

const features = [
  { icon: Brain, title: 'AI Delay Prediction', desc: 'Predict flight delays up to 6 hours in advance with 91% accuracy using real-time weather and ATC data.' },
  { icon: BarChart3, title: 'Revenue Analytics', desc: 'Deep revenue intelligence with route profitability, demand forecasting, and pricing optimization.' },
  { icon: Zap, title: 'Real-Time Operations', desc: 'Live flight tracking, crew management, and gate assignments in a single unified operations center.' },
  { icon: Shield, title: 'Predictive Maintenance', desc: 'AI-powered aircraft health monitoring reduces unplanned maintenance by 40%.' },
  { icon: Globe, title: 'Global Route Intelligence', desc: 'Optimize routes using historical data, weather patterns, and passenger demand signals.' },
  { icon: Users, title: 'Passenger Intelligence', desc: 'No-show prediction, sentiment analysis, and personalized recommendations for every passenger.' },
]

const reviews = [
  { name: 'James Whitfield', role: 'VP Operations, AeroGulf', text: 'SkyMind transformed our operations. Delay prediction alone saved us $2.4M in the first quarter.', rating: 5 },
  { name: 'Priya Nair', role: 'Head of Analytics, SkyLink', text: 'The AI dashboard is unlike anything I\'ve seen. Real-time insights that actually drive decisions.', rating: 5 },
  { name: 'Marcus Chen', role: 'CTO, Pacific Airways', text: 'We integrated SkyMind in 3 weeks. The API is clean, the UI is stunning, and the team is world-class.', rating: 5 },
]

function FloatingPlane({ delay = 0, top = '20%', duration = 20 }: { delay?: number; top?: string; duration?: number }) {
  return (
    <motion.div
      className="absolute text-accent/10 pointer-events-none"
      style={{ top }}
      initial={{ x: '-10vw', opacity: 0 }}
      animate={{ x: '110vw', opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      <Plane size={32} />
    </motion.div>
  )
}

export default function LandingPage() {
  const [from, setFrom] = useState('DXB')
  const [to, setTo] = useState('LHR')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDate(today)
  }, [])

  return (
    <div className="min-h-screen bg-sky-950 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
            <Plane size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">SkyMind <span className="text-accent">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-sky-300">
          {['Features', 'Analytics', 'Pricing', 'Docs'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
          <Link to="/dashboard" className="btn-primary text-sm py-2 px-4">Dashboard</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-accent/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
        </div>

        <FloatingPlane delay={0} top="15%" duration={22} />
        <FloatingPlane delay={8} top="55%" duration={18} />
        <FloatingPlane delay={14} top="75%" duration={25} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent/30 text-accent text-sm font-medium mb-6"
          >
            <Zap size={14} />
            Powered by 9 AI Models
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          >
            The Future of
            <br />
            <span className="text-gradient">Airline Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sky-300 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Enterprise-grade AI platform for flight operations, revenue analytics, predictive maintenance, and passenger intelligence.
          </motion.p>

          {/* Flight Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-4 max-w-3xl mx-auto glow"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sky-400 text-xs font-medium px-1">From</label>
                <div className="relative">
                  <Plane size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 rotate-45" />
                  <input value={from} onChange={e => setFrom(e.target.value)} className="input pl-8 w-full" placeholder="DXB" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sky-400 text-xs font-medium px-1">To</label>
                <div className="relative">
                  <Plane size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                  <input value={to} onChange={e => setTo(e.target.value)} className="input pl-8 w-full" placeholder="LHR" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sky-400 text-xs font-medium px-1">Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input pl-8 w-full" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sky-400 text-xs font-medium px-1">Passengers</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
                  <input type="number" min={1} max={9} value={passengers} onChange={e => setPassengers(+e.target.value)} className="input pl-8 w-full" />
                </div>
              </div>
            </div>
            <button className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
              <Search size={16} /> Search Flights
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <Link to="/dashboard" className="btn-primary flex items-center gap-2">
              Open Dashboard <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-ghost flex items-center gap-2">
              Explore Features <ChevronDown size={16} />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-black text-gradient">{s.value}</p>
              <p className="text-sky-400 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Destinations</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Popular Routes</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {destinations.map((d, i) => (
            <motion.div
              key={d.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{d.img}</span>
                  <div>
                    <p className="text-white font-bold">{d.city}</p>
                    <p className="text-sky-400 text-xs">{d.code} · {d.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-accent font-bold">from ${d.price}</p>
                  <p className="text-sky-500 text-xs">one way</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">AI Features</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Intelligence at Every Layer</h2>
          <p className="text-sky-400 mt-3 max-w-xl mx-auto">9 specialized AI models working together to optimize every aspect of airline operations.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card group"
            >
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent w-fit mb-3 group-hover:scale-110 transition-transform">
                <f.icon size={20} />
              </div>
              <h3 className="text-white font-bold mb-1">{f.title}</h3>
              <p className="text-sky-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Trusted by Industry Leaders</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-sky-200 text-sm leading-relaxed">"{r.text}"</p>
              <div>
                <p className="text-white font-semibold text-sm">{r.name}</p>
                <p className="text-sky-400 text-xs">{r.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 glow"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-sky-400 mb-8">Join the airlines already using SkyMind AI to reduce delays, optimize revenue, and delight passengers.</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                  <Plane size={14} className="text-white" />
                </div>
                <span className="font-bold text-white">SkyMind AI</span>
              </div>
              <p className="text-sky-400 text-sm">Enterprise airline intelligence platform powered by 9 AI models.</p>
              <div className="flex gap-3 mt-4">
                {[Mail, Mail, Mail, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-sky-400 hover:text-white transition-all">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Dashboard', 'AI Models', 'Analytics', 'API Docs'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sky-400 hover:text-white text-sm transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sky-500 text-xs">© 2024 SkyMind AI. All rights reserved.</p>
            <p className="text-sky-500 text-xs">Built with ❤️ for the Final Year AI & DS Project</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
