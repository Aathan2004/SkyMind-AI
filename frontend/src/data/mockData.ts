export const revenueData = [
  { month: 'Jan', revenue: 4200000, passengers: 38000 },
  { month: 'Feb', revenue: 3800000, passengers: 34000 },
  { month: 'Mar', revenue: 5100000, passengers: 46000 },
  { month: 'Apr', revenue: 4700000, passengers: 42000 },
  { month: 'May', revenue: 5800000, passengers: 52000 },
  { month: 'Jun', revenue: 6200000, passengers: 58000 },
  { month: 'Jul', revenue: 7100000, passengers: 64000 },
  { month: 'Aug', revenue: 6800000, passengers: 61000 },
  { month: 'Sep', revenue: 5900000, passengers: 53000 },
  { month: 'Oct', revenue: 5400000, passengers: 48000 },
  { month: 'Nov', revenue: 4900000, passengers: 44000 },
  { month: 'Dec', revenue: 6500000, passengers: 59000 },
]

export const delayData = [
  { route: 'DXB-LHR', onTime: 82, delayed: 18 },
  { route: 'JFK-LAX', onTime: 75, delayed: 25 },
  { route: 'SIN-SYD', onTime: 90, delayed: 10 },
  { route: 'CDG-FRA', onTime: 88, delayed: 12 },
  { route: 'HKG-NRT', onTime: 79, delayed: 21 },
  { route: 'DXB-BOM', onTime: 85, delayed: 15 },
]

export const routeData = [
  { route: 'DXB → LHR', bookings: 4200, fill: '#3b82f6' },
  { route: 'JFK → LAX', bookings: 3800, fill: '#06b6d4' },
  { route: 'SIN → SYD', bookings: 3100, fill: '#8b5cf6' },
  { route: 'CDG → FRA', bookings: 2700, fill: '#f59e0b' },
  { route: 'HKG → NRT', bookings: 2400, fill: '#10b981' },
]

export const predictionAccuracy = [
  { model: 'Delay', accuracy: 91 },
  { model: 'Price', accuracy: 87 },
  { model: 'No-Show', accuracy: 84 },
  { model: 'Cancel', accuracy: 89 },
  { model: 'Weather', accuracy: 93 },
  { model: 'Maintenance', accuracy: 86 },
]

export const todayFlights = [
  { id: 'SK001', from: 'DXB', to: 'LHR', dep: '06:30', arr: '11:45', status: 'On Time', aircraft: 'B777', passengers: 342 },
  { id: 'SK002', from: 'JFK', to: 'CDG', dep: '08:15', arr: '21:30', status: 'Delayed', aircraft: 'A380', passengers: 489 },
  { id: 'SK003', from: 'SIN', to: 'SYD', dep: '09:00', arr: '18:20', status: 'On Time', aircraft: 'B787', passengers: 256 },
  { id: 'SK004', from: 'LHR', to: 'DXB', dep: '11:30', arr: '21:00', status: 'Boarding', aircraft: 'A350', passengers: 312 },
  { id: 'SK005', from: 'HKG', to: 'NRT', dep: '13:45', arr: '18:30', status: 'On Time', aircraft: 'B737', passengers: 178 },
  { id: 'SK006', from: 'CDG', to: 'JFK', dep: '14:20', arr: '17:05', status: 'Cancelled', aircraft: 'A330', passengers: 0 },
  { id: 'SK007', from: 'BOM', to: 'DXB', dep: '16:00', arr: '18:30', status: 'On Time', aircraft: 'B777', passengers: 298 },
  { id: 'SK008', from: 'LAX', to: 'SIN', dep: '23:55', arr: '+2 07:40', status: 'Scheduled', aircraft: 'A380', passengers: 412 },
]

export const recentBookings = [
  { id: 'BK8821', passenger: 'James Wilson', route: 'DXB → LHR', class: 'Business', amount: 2840, date: '2024-01-15' },
  { id: 'BK8820', passenger: 'Sarah Chen', route: 'JFK → CDG', class: 'First', amount: 5200, date: '2024-01-15' },
  { id: 'BK8819', passenger: 'Ahmed Al-Rashid', route: 'SIN → SYD', class: 'Economy', amount: 680, date: '2024-01-14' },
  { id: 'BK8818', passenger: 'Emma Thompson', route: 'LHR → DXB', class: 'Business', amount: 3100, date: '2024-01-14' },
  { id: 'BK8817', passenger: 'Yuki Tanaka', route: 'HKG → NRT', class: 'Economy', amount: 420, date: '2024-01-13' },
]

export const aircraftFleet = [
  { id: 'A6-EDA', type: 'Airbus A380', status: 'In Service', route: 'DXB-JFK', hours: 18420, nextMaint: '2024-02-10' },
  { id: 'A6-EDB', type: 'Boeing 777', status: 'In Service', route: 'DXB-LHR', hours: 22100, nextMaint: '2024-01-28' },
  { id: 'A6-EDC', type: 'Boeing 787', status: 'Maintenance', route: '—', hours: 15300, nextMaint: '2024-01-20' },
  { id: 'A6-EDD', type: 'Airbus A350', status: 'In Service', route: 'LHR-DXB', hours: 9800, nextMaint: '2024-03-05' },
  { id: 'A6-EDE', type: 'Boeing 737', status: 'Standby', route: '—', hours: 31200, nextMaint: '2024-01-25' },
]

export const crewData = [
  { id: 'CR001', name: 'Capt. Michael Ross', role: 'Captain', flight: 'SK001', status: 'On Duty', hours: 842 },
  { id: 'CR002', name: 'FO. Lisa Park', role: 'First Officer', flight: 'SK001', status: 'On Duty', hours: 620 },
  { id: 'CR003', name: 'Capt. David Okafor', role: 'Captain', flight: 'SK003', status: 'On Duty', hours: 1120 },
  { id: 'CR004', name: 'FA. Priya Sharma', role: 'Flight Attendant', flight: 'SK002', status: 'Standby', hours: 380 },
  { id: 'CR005', name: 'Capt. Anna Müller', role: 'Captain', flight: '—', status: 'Rest', hours: 960 },
]

export const notifications = [
  { id: 1, type: 'warning', title: 'Flight SK002 Delayed', message: 'JFK → CDG delayed by 45 minutes due to ATC restrictions.', time: '2 min ago' },
  { id: 2, type: 'error', title: 'Flight SK006 Cancelled', message: 'CDG → JFK cancelled due to crew unavailability.', time: '18 min ago' },
  { id: 3, type: 'success', title: 'AI Model Updated', message: 'Delay prediction model retrained. Accuracy improved to 91.4%.', time: '1 hr ago' },
  { id: 4, type: 'info', title: 'Maintenance Alert', message: 'Aircraft A6-EDC scheduled for maintenance check.', time: '2 hr ago' },
  { id: 5, type: 'success', title: 'Revenue Milestone', message: 'Monthly revenue target achieved — $6.2M.', time: '5 hr ago' },
]

export const weatherData = [
  { city: 'Dubai', temp: 38, condition: 'Clear', impact: 'Low' },
  { city: 'London', temp: 12, condition: 'Cloudy', impact: 'Medium' },
  { city: 'New York', temp: 8, condition: 'Stormy', impact: 'High' },
  { city: 'Singapore', temp: 31, condition: 'Humid', impact: 'Low' },
  { city: 'Tokyo', temp: 18, condition: 'Clear', impact: 'Low' },
]
