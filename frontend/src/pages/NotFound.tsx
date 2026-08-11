import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <h1 className="text-6xl font-bold text-accent">404</h1>
      <p className="text-gray-500">Page not found.</p>
      <Link to="/" className="text-accent underline">Go Home</Link>
    </div>
  )
}
