/**
 * Admin Sidebar Component
 * Navigation sidebar for admin pages using shadcn/ui
 */

import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  FileText,
  ScrollText,
  LogOut,
  ChevronDown,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/constants'
import { useAuth } from '@/contexts/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

// Navigation items configuration
const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: ROUTES.ADMIN,
  },
  {
    title: 'User Management',
    icon: Users,
    items: [
      { title: 'Users', href: ROUTES.ADMIN_USERS },
      { title: 'Roles', href: ROUTES.ADMIN_ROLES },
      { title: 'Permissions', href: ROUTES.ADMIN_PERMISSIONS },
    ],
  },
  {
    title: 'Organization',
    icon: Building2,
    items: [
      { title: 'Departments', href: ROUTES.ADMIN_DEPARTMENTS },
      { title: 'Positions', href: ROUTES.ADMIN_POSITIONS },
    ],
  },
  {
    title: 'Knowledge Base',
    icon: FileText,
    items: [
      { title: 'Documents', href: ROUTES.ADMIN_DOCUMENTS },
      { title: 'Data Sources', href: ROUTES.ADMIN_DATA_SOURCES },
      { title: 'Embedding Jobs', href: ROUTES.ADMIN_EMBEDDING_JOBS },
    ],
  },
  {
    title: 'Analytics & Logs',
    icon: ScrollText,
    items: [
      { title: 'Query Logs', href: ROUTES.ADMIN_QUERY_LOGS },
      { title: 'System Logs', href: ROUTES.ADMIN_SYSTEM_LOGS },
    ],
  },
]

export function AdminSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (href: string) => {
    if (href === ROUTES.ADMIN) {
      return location.pathname === ROUTES.ADMIN
    }
    return location.pathname.startsWith(href)
  }

  const isGroupActive = (items?: { href: string }[]) => {
    if (!items) return false
    return items.some(item => isActive(item.href))
  }

  const handleLogout = async () => {
    await logout()
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link to={ROUTES.ADMIN}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">RAG Admin</span>
                  <span className="text-xs text-muted-foreground">Enterprise Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isGroupActive(item.items)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            isGroupActive(item.items) && 'bg-accent text-accent-foreground'
                          )}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map(subItem => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton asChild isActive={isActive(subItem.href)}>
                                <Link to={subItem.href}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item.href!)}>
                      <Link to={item.href!}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                      {getInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.email?.split('@')[0] || 'Admin'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link to={ROUTES.HOME} className="flex items-center gap-2 cursor-pointer">
                    <Home className="size-4" />
                    <span>Client View</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="size-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
