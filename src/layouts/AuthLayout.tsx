/**
 * Authentication Layout
 * Used for public/auth pages like login
 */

import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        {/* TODO: Add auth layout styling and structure */}
        <Outlet />
      </div>
    </div>
  )
}
