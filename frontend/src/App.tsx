import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Overview from './dashboard/Overview'
import DelayPredictor from './dashboard/DelayPredictor'
import PricePredictor from './dashboard/PricePredictor'
import AdminDashboard from './dashboard/admin/AdminDashboard'
import OperationsCenter from './dashboard/operations/OperationsCenter'
import FlightTracker from './dashboard/flights/FlightTracker'
import AIDashboard from './dashboard/ai/AIDashboard'
import AnalyticsDashboard from './dashboard/analytics/AnalyticsDashboard'
import TravelTools from './dashboard/passenger/TravelTools'
import PassengerPortal from './dashboard/passenger/PassengerPortal'
import SeatMap from './dashboard/passenger/SeatMap'
import BoardingPass from './dashboard/passenger/BoardingPass'
import SettingsPage from './dashboard/settings/SettingsPage'
import WorkspacePage from './dashboard/WorkspacePage'
import { useApp } from './context/AppContext'

function ProtectedDashboard() {
  const { isAuthenticated, isAuthLoading } = useApp()
  if (isAuthLoading) return <div className="min-h-screen grid place-items-center text-slate-600">Restoring your session…</div>
  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedDashboard />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/operations" element={<OperationsCenter />} />
          <Route path="/dashboard/flights" element={<FlightTracker />} />
          <Route path="/dashboard/aircraft" element={<WorkspacePage kind="aircraft" />} />
          <Route path="/dashboard/airport" element={<WorkspacePage kind="airport" />} />
          <Route path="/dashboard/crew" element={<WorkspacePage kind="crew" />} />
          <Route path="/dashboard/passenger" element={<PassengerPortal />} />
          <Route path="/dashboard/passenger/travel-tools" element={<TravelTools />} />
          <Route path="/dashboard/passenger/seats" element={<SeatMap />} />
          <Route path="/dashboard/passenger/boarding-pass" element={<BoardingPass />} />
          <Route path="/dashboard/ai" element={<AIDashboard />} />
          <Route path="/dashboard/analytics" element={<AnalyticsDashboard />} />
          <Route path="/dashboard/notifications" element={<WorkspacePage kind="notifications" />} />
          <Route path="/dashboard/profile" element={<WorkspacePage kind="profile" />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/support" element={<WorkspacePage kind="support" />} />
          <Route path="/dashboard/delay" element={<DelayPredictor />} />
          <Route path="/dashboard/price" element={<PricePredictor />} />
          <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
