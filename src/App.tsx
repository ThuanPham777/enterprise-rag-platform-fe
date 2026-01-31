/**
 * Main App Component
 * Root component that sets up providers and routing
 */

import { useEffect } from 'react'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppRoutes } from './app/routes'

// Component to check auth on mount
const AppInitializer = () => {
  const { checkAuth } = useAuth()

  useEffect(() => {
    // Check authentication status on app load
    checkAuth()
  }, [checkAuth])

  return <AppRoutes />
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppInitializer />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
