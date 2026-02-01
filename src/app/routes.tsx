/**
 * Application Routes Configuration
 * Centralized route definitions using react-router-dom v6
 */

import { lazy, Suspense, type JSX } from 'react'
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
import { Loader2 } from 'lucide-react'

// Lazy load admin pages
const UsersPage = lazy(() => import('../pages/admin/UsersPage'))
const RolesPage = lazy(() => import('../pages/admin/RolesPage'))
const PermissionsPage = lazy(() => import('../pages/admin/PermissionsPage'))
const DepartmentsPage = lazy(() => import('../pages/admin/DepartmentsPage'))
const PositionsPage = lazy(() => import('../pages/admin/PositionsPage'))
const DocumentsPage = lazy(() => import('../pages/admin/DocumentsPage'))
const DataSourcesPage = lazy(() => import('../pages/admin/DataSourcesPage'))
const EmbeddingJobsPage = lazy(() => import('../pages/admin/EmbeddingJobsPage'))
const QueryLogsPage = lazy(() => import('../pages/admin/QueryLogsPage'))
const SystemLogsPage = lazy(() => import('../pages/admin/SystemLogsPage'))

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
)

// Wrap lazy component with Suspense
const LazyPage = ({ Component }: { Component: React.LazyExoticComponent<() => JSX.Element> }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

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
      {
        path: 'users',
        element: <LazyPage Component={UsersPage} />,
      },
      {
        path: 'roles',
        element: <LazyPage Component={RolesPage} />,
      },
      {
        path: 'permissions',
        element: <LazyPage Component={PermissionsPage} />,
      },
      {
        path: 'departments',
        element: <LazyPage Component={DepartmentsPage} />,
      },
      {
        path: 'positions',
        element: <LazyPage Component={PositionsPage} />,
      },
      {
        path: 'documents',
        element: <LazyPage Component={DocumentsPage} />,
      },
      {
        path: 'data-sources',
        element: <LazyPage Component={DataSourcesPage} />,
      },
      {
        path: 'embedding-jobs',
        element: <LazyPage Component={EmbeddingJobsPage} />,
      },
      {
        path: 'query-logs',
        element: <LazyPage Component={QueryLogsPage} />,
      },
      {
        path: 'system-logs',
        element: <LazyPage Component={SystemLogsPage} />,
      },
    ],
  },
  // 404 page route
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page Not Found</p>
        <a href="/" className="text-primary hover:underline">
          Go back home
        </a>
      </div>
    ),
  },
])

export const AppRoutes = () => {
  return <RouterProvider router={router} />
}
