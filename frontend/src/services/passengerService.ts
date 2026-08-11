import api from './api'

export interface FlightOption { id: number; flight_number: string; origin: string; destination: string; departure_time: string; arrival_time: string; price: number; status: string; aircraft: string; stops: number; available_seats: number; terminal: string; gate: string }
export interface Booking { id: number; booking_reference: string; passenger_name: string; cabin_class: string; seat_number?: string; meal_preference?: string; extra_baggage_kg: number; payment_status: string; booking_status: string; total_amount: number; created_at: string; flight?: FlightOption }

export const passengerService = {
  dashboard: () => api.get<{ bookings: Booking[]; loyalty_points: number; notifications: Array<{ id: string; title: string; message: string; type: string }> }>('/api/passenger/dashboard'),
  search: (params: Record<string, string | number | undefined>) => api.get<FlightOption[]>('/api/passenger/flights', { params }),
  listBookings: () => api.get<Booking[]>('/api/passenger/bookings'),
  createBooking: (payload: object) => api.post<Booking>('/api/passenger/bookings', payload),
  pay: (bookingId: number, method: 'card' | 'upi' | 'net_banking' | 'wallet', succeed = true) => api.post<Booking>(`/api/passenger/bookings/${bookingId}/payment`, { method, succeed }),
  cancel: (bookingId: number) => api.post(`/api/passenger/bookings/${bookingId}/cancel`),
}
