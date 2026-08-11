import { useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const seasons = ['spring', 'summer', 'autumn', 'winter']

export default function PricePredictor() {
  const [form, setForm] = useState({ origin: '', destination: '', days_before_departure: 30, season: 'summer' })
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/api/predictions/price', form)
      setResult(res.data.prediction)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-primary mb-6">Price Predictor</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <input className="border rounded px-3 py-2" placeholder="Origin (e.g. DXB)" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required />
        <input className="border rounded px-3 py-2" placeholder="Destination (e.g. LHR)" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
        <input className="border rounded px-3 py-2" type="number" placeholder="Days Before Departure" min={1} value={form.days_before_departure} onChange={e => setForm({ ...form, days_before_departure: +e.target.value })} />
        <select className="border rounded px-3 py-2" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })}>
          {seasons.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <button className="bg-accent text-white py-2 rounded hover:opacity-90 transition" type="submit">Predict Price</button>
      </form>
      {loading && <LoadingSpinner />}
      {result !== null && !loading && (
        <div className="mt-4 bg-white rounded-xl shadow p-4 text-center">
          <p className="text-gray-500">Predicted Price</p>
          <p className="text-4xl font-bold text-accent">${result}</p>
        </div>
      )}
    </div>
  )
}
