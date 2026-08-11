import api from './api'

export interface LiveFlightState {
  icao24: string
  callsign: string | null
  origin_country: string
  lat: number
  lon: number
  altitude_m: number | null
  velocity_ms: number | null
  heading: number | null
  vertical_rate_ms: number | null
  on_ground: boolean
  category: string
}

export interface DelayEstimate {
  icao24: string
  callsign: string | null
  predicted_delay_minutes: number
  inputs_used: Record<string, unknown>
  notes: { weather_score: string; destination: string }
}

export interface Bbox { lamin: number; lomin: number; lamax: number; lomax: number }

export const liveFlightService = {
  list: (bbox?: Bbox) => api.get<{ flights: LiveFlightState[]; count: number }>('/api/live/flights', { params: bbox }),
  search: (q: string) => api.get<{ flights: LiveFlightState[] }>('/api/live/flights/search', { params: { q } }),
  detail: (icao24: string) => api.get<LiveFlightState>(`/api/live/flights/${icao24}`),
  delayEstimate: (icao24: string) => api.get<DelayEstimate>(`/api/live/flights/${icao24}/delay-estimate`),
}
