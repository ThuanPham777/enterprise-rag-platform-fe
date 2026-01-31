/**
 * Client Layout
 * Used for client-facing pages
 */

import { Outlet } from 'react-router-dom'

export const ClientLayout = () => {
  return (
    <div className="min-h-screen">
      {/* TODO: Add client layout structure (header, navigation, footer, etc.) */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Client Area</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* TODO: Add footer if needed */}
    </div>
  )
}
