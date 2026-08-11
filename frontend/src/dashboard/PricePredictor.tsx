import { useEffect, useMemo, useState } from 'react'
import { DollarSign, Sparkles } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import { aiService } from '../services/aiService'
import { airportService, Airport } from '../services/airportService'
import { getErrorMessage } from '../services/authService'

// The price model (ai_models/price_prediction) was trained on a fixed vocabulary of airports,
// airlines and seat classes — see ai_models/datasets/ticket_price.csv. Picks outside this
// vocabulary still work (the encoder falls back gracefully) but lose accuracy, so the form is
// constrained to the airports/airlines/classes the model actually learned from.
const KNOWN_AIRPORTS = ['BOM', 'CDG', 'DXB', 'FRA', 'JFK', 'LAX', 'LHR', 'NRT', 'SIN', 'SYD']
const AIRLINES = ['SkyMind', 'AeroGulf', 'AsiaJet', 'EuroWings', 'PacificAir']
const SEAT_CLASSES = ['Economy', 'Business', 'First']
const SEASONS = ['spring', 'summer', 'autumn', 'winter']

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(a)))
}

interface PriceResult {
  prediction: number
  confidence: number
  meta: { feature_importance?: Record<string, number>; accuracy?: number; algorithm?: string }
}

export default function PricePredictor() {
  const [airports, setAirports] = useState<Airport[]>([])
  const [form, setForm] = useState({
    origin: 'DXB', destination: 'LHR', days_before_departure: 30, season: 'summer',
    seat_class: 'Economy', airline: 'SkyMind', demand_score: 0.7, competitor_price: 600, is_holiday: false,
  })
  const [result, setResult] = useState<PriceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all(KNOWN_AIRPORTS.map(iata => airportService.detail(iata).then(r => r.data).catch(() => null)))
      .then(rows => setAirports(rows.filter((a): a is Airport => a !== null)))
  }, [])

  const distanceKm = useMemo(() => {
    const o = airports.find(a => a.iata === form.origin)
    const d = airports.find(a => a.iata === form.destination)
    return o && d ? haversineKm(o.lat, o.lon, d.lat, d.lon) : null
  }, [airports, form.origin, form.destination])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!distanceKm) return
    setLoading(true)
    setError(null)
    try {
      const res = await aiService.predictPrice({ ...form, is_holiday: form.is_holiday ? 1 : 0, distance_km: distanceKm })
      setResult(res.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const explanation = useMemo(() => {
    const fi = result?.meta.feature_importance
    if (!fi) return []
    const total = Object.values(fi).reduce((a, b) => a + b, 0) || 1
    return Object.entries(fi).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([feature, value]) => ({ feature, pct: Math.round((value / total) * 100) }))
  }, [result])

  return (
    <div className="max-w-2xl space-y-5">
      <PageHeader title="Price Predictor" subtitle="Real ticket price ML model — XGBoost regressor" icon={DollarSign} />

      <form onSubmit={handleSubmit} className="card grid sm:grid-cols-2 gap-4">
        <label className="text-xs text-sky-400">Origin
          <select className="select mt-1" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}>
            {KNOWN_AIRPORTS.map(iata => <option key={iata} value={iata}>{iata} — {airports.find(a => a.iata === iata)?.city || ''}</option>)}
          </select>
        </label>
        <label className="text-xs text-sky-400">Destination
          <select className="select mt-1" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}>
            {KNOWN_AIRPORTS.map(iata => <option key={iata} value={iata}>{iata} — {airports.find(a => a.iata === iata)?.city || ''}</option>)}
          </select>
        </label>

        <label className="text-xs text-sky-400">Airline
          <select className="select mt-1" value={form.airline} onChange={e => setForm({ ...form, airline: e.target.value })}>
            {AIRLINES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className="text-xs text-sky-400">Seat Class
          <select className="select mt-1" value={form.seat_class} onChange={e => setForm({ ...form, seat_class: e.target.value })}>
            {SEAT_CLASSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <label className="text-xs text-sky-400">Season
          <select className="select mt-1" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
            {SEASONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </label>
        <label className="text-xs text-sky-400">Days Before Departure
          <input className="input mt-1" type="number" min={1} value={form.days_before_departure}
            onChange={e => setForm({ ...form, days_before_departure: +e.target.value })} />
        </label>

        <label className="text-xs text-sky-400">Demand Score ({form.demand_score.toFixed(2)})
          <input className="mt-2 w-full accent-accent" type="range" min={0} max={1} step={0.05} value={form.demand_score}
            onChange={e => setForm({ ...form, demand_score: +e.target.value })} />
        </label>
        <label className="text-xs text-sky-400">Competitor Price (USD)
          <input className="input mt-1" type="number" min={0} value={form.competitor_price}
            onChange={e => setForm({ ...form, competitor_price: +e.target.value })} />
        </label>

        <label className="text-xs text-sky-400 flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" className="auth-checkbox" checked={form.is_holiday}
            onChange={e => setForm({ ...form, is_holiday: e.target.checked })} />
          Holiday period
        </label>

        <div className="sm:col-span-2 text-xs text-sky-500">
          Great-circle distance: <span className="text-white font-medium">{distanceKm != null ? `${distanceKm.toLocaleString()} km` : 'calculating…'}</span>
        </div>

        <button className="btn-primary sm:col-span-2" type="submit" disabled={loading || !distanceKm}>
          {loading ? 'Predicting…' : 'Predict Price'}
        </button>
      </form>

      {loading && <LoadingSpinner />}
      {error && !loading && <p className="text-sm text-rose-400">{error}</p>}

      {result && !loading && !error && (
        <div className="card space-y-4">
          <div className="text-center">
            <p className="text-sky-400 text-xs">Predicted Price</p>
            <p className="text-4xl font-bold text-accent">${result.prediction.toLocaleString()}</p>
            <p className="text-sky-500 text-xs mt-1">{result.confidence}% model confidence · {result.meta.algorithm}</p>
          </div>
          {explanation.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-accent" />
                <p className="text-white font-semibold text-sm">Why this price — feature importance</p>
              </div>
              <div className="space-y-2">
                {explanation.map(row => (
                  <div key={row.feature}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-sky-300">{row.feature.replace(/_/g, ' ')}</span>
                      <span className="text-sky-400">{row.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
