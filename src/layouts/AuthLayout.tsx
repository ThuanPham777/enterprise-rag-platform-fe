/**
 * Authentication Layout
 * Used for public/auth pages like login
 */

import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
