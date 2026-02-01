/**
 * Admin Layout
 * Used for admin-facing pages with sidebar navigation
 */

import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useLocation, Link } from 'react-router-dom'
import { ROUTES } from '@/config/constants'
import { Toaster } from '@/components/ui/sonner'

// Map routes to breadcrumb labels
const routeLabels: Record<string, string> = {
  [ROUTES.ADMIN]: 'Dashboard',
  [ROUTES.ADMIN_USERS]: 'Users',
  [ROUTES.ADMIN_ROLES]: 'Roles',
  [ROUTES.ADMIN_PERMISSIONS]: 'Permissions',
  [ROUTES.ADMIN_DEPARTMENTS]: 'Departments',
  [ROUTES.ADMIN_POSITIONS]: 'Positions',
  [ROUTES.ADMIN_DOCUMENTS]: 'Documents',
  [ROUTES.ADMIN_DATA_SOURCES]: 'Data Sources',
  [ROUTES.ADMIN_EMBEDDING_JOBS]: 'Embedding Jobs',
  [ROUTES.ADMIN_QUERY_LOGS]: 'Query Logs',
  [ROUTES.ADMIN_SYSTEM_LOGS]: 'System Logs',
}

export const AdminLayout = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const currentLabel = routeLabels[currentPath] || 'Admin'

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to={ROUTES.ADMIN}>Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {currentPath !== ROUTES.ADMIN && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster position="top-right" />
    </SidebarProvider>
  )
}
