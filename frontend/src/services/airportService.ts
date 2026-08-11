import api from './api'
import { LiveFlightState } from './liveFlightService'

export interface Airport {
  iata: string
  icao: string | null
  name: string
  city: string | null
  country: string
  lat: number
  lon: number
  elevation_ft: number | null
  type: string
}

export interface AirportWeather {
  airport: string
  temperature_c: number
  windspeed_kmh: number
  wind_direction_deg: number
  condition: string
  is_day: boolean
  observed_at: string
}

export interface NearbyFlight extends LiveFlightState { distance_km: number }

export interface AirportTraffic {
  airport: string
  arrivals: NearbyFlight[]
  departures: NearbyFlight[]
  on_ground: NearbyFlight[]
}

export const airportService = {
  search: (q: string, limit = 20) => api.get<Airport[]>('/api/airports/search', { params: { q, limit } }),
  detail: (iata: string) => api.get<Airport>(`/api/airports/${iata}`),
  weather: (iata: string) => api.get<AirportWeather>(`/api/airports/${iata}/weather`),
  traffic: (iata: string) => api.get<AirportTraffic>(`/api/airports/${iata}/traffic`),
}
