import { useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { getErrorMessage } from '../services/authService'

const seasons = ['spring', 'summer', 'autumn', 'winter']

export default function PricePredictor() {
  const [form, setForm] = useState({ origin: '', destination: '', days_before_departure: 30, season: 'summer' })
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/predictions/price', form)
      setResult(res.data.prediction)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Price Predictor</h1>
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        <input className="input" placeholder="Origin (e.g. DXB)" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required />
        <input className="input" placeholder="Destination (e.g. LHR)" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
        <input className="input" type="number" placeholder="Days Before Departure" min={1} value={form.days_before_departure} onChange={e => setForm({ ...form, days_before_departure: +e.target.value })} />
        <select className="select" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
          {seasons.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button className="btn-primary" type="submit" disabled={loading}>Predict Price</button>
      </form>
      {loading && <LoadingSpinner />}
      {error && !loading && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      {result !== null && !loading && !error && (
        <div className="mt-4 card text-center">
          <p className="text-sky-400">Predicted Price</p>
          <p className="text-4xl font-bold text-accent">${result}</p>
        </div>
      )}
    </div>
  )
}
