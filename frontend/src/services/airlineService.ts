import api from './api'

export interface Airline {
  iata: string
  icao: string | null
  name: string
  country: string | null
  callsign: string | null
}

export interface FleetEntry { code: string; aircraft: string; route_count: number }
export interface AirlineRoute { source: string; source_name: string; dest: string; dest_name: string; aircraft: string | null }
export interface AirlineHub { iata: string; outbound_routes: number; name: string | null; city: string | null; country: string | null }

export const airlineService = {
  search: (q: string, limit = 20) => api.get<Airline[]>('/api/airlines/search', { params: { q, limit } }),
  detail: (iata: string) => api.get<Airline>(`/api/airlines/${iata}`),
  fleet: (iata: string) => api.get<{ airline: string; fleet: FleetEntry[] }>(`/api/airlines/${iata}/fleet`),
  routes: (iata: string, limit = 50) => api.get<{ airline: string; routes: AirlineRoute[] }>(`/api/airlines/${iata}/routes`, { params: { limit } }),
  hub: (iata: string) => api.get<{ airline: string; hub: AirlineHub | null }>(`/api/airlines/${iata}/hub`),
}
