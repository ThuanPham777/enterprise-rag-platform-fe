/**
 * Main App Component
 * Root component that sets up providers and routing
 */

import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './app/routes'

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryProvider>
  )
}

export default App
