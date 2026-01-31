/**
 * Admin Route Component
 * Guards routes that require admin role
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../config/constants'

interface AdminRouteProps {
    children: React.ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth()

    // Show loading state while checking auth
    if (isLoading) {
        // TODO: Replace with actual loading component
        return <div>Loading...</div>
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }

    // Redirect to home if not admin
    // Check if user has admin role in roles array
    if (!user?.roles?.includes('ADMIN')) {
        return <Navigate to={ROUTES.HOME} replace />
    }

    return <>{children}</>
}
