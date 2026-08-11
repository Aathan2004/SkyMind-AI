import { useState } from 'react'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { getErrorMessage } from '../services/authService'

export default function DelayPredictor() {
  const [form, setForm] = useState({ origin: '', destination: '', departure_hour: 8, day_of_week: 1, weather_score: 0.5 })
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/predictions/delay', form)
      setResult(res.data.prediction)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Delay Predictor</h1>
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
        <input className="input" placeholder="Origin (e.g. JFK)" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required />
        <input className="input" placeholder="Destination (e.g. LAX)" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
        <input className="input" type="number" placeholder="Departure Hour (0-23)" min={0} max={23} value={form.departure_hour} onChange={e => setForm({ ...form, departure_hour: +e.target.value })} />
        <input className="input" type="number" placeholder="Day of Week (1=Mon)" min={1} max={7} value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: +e.target.value })} />
        <input className="input" type="number" placeholder="Weather Score (0-1)" step={0.1} min={0} max={1} value={form.weather_score} onChange={e => setForm({ ...form, weather_score: +e.target.value })} />
        <button className="btn-primary" type="submit" disabled={loading}>Predict Delay</button>
      </form>
      {loading && <LoadingSpinner />}
      {error && !loading && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      {result !== null && !loading && !error && (
        <div className="mt-4 card text-center">
          <p className="text-sky-400">Predicted Delay</p>
          <p className="text-4xl font-bold text-accent">{result} min</p>
        </div>
      )}
    </div>
  )
}
