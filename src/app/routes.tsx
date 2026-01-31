/**
 * Application Routes Configuration
 * Centralized route definitions using react-router-dom v6
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ROUTES } from '../config/constants'
import { AuthLayout } from '../layouts/AuthLayout'
import { ClientLayout } from '../layouts/ClientLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AdminRoute } from '../components/AdminRoute'
import { LoginPage } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'
import { AdminHomePage } from '../pages/AdminHomePage'

// Create router configuration
const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            },
        ],
    },
    {
        path: ROUTES.HOME,
        element: (
            <ProtectedRoute>
                <ClientLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            // TODO: Add more client routes here
        ],
    },
    {
        path: ROUTES.ADMIN,
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminHomePage />,
            },
            // TODO: Add more admin routes here
        ],
    },
    // TODO: Add 404 page route
    {
        path: '*',
        element: <div>404 - Page Not Found</div>,
    },
])

export const AppRoutes = () => {
    return <RouterProvider router={router} />
}
