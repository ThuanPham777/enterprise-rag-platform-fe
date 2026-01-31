/**
 * Admin Layout
 * Used for admin-facing pages
 */

import { Outlet, Link } from 'react-router-dom'
import { ROUTES } from '../config/constants'
import { useAuth } from '../contexts/AuthContext'

export const AdminLayout = () => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    // TODO: Implement logout handler
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TODO: Add admin layout structure (sidebar, header, navigation, etc.) */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Area</h1>
          <div className="flex gap-4">
            <Link to={ROUTES.HOME} className="text-blue-600 hover:text-blue-800">
              Client View
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* TODO: Add sidebar navigation if needed */}
    </div>
  )
}
