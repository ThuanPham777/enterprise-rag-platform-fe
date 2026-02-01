/**
 * Users Management Page
 * List, view, and manage user accounts
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, MoreHorizontal, Shield, Power, PowerOff } from 'lucide-react'
import { useUsers, useRoles, useAssignRoles, useUpdateUserStatus } from '@/hooks'
import { UserStatus, type AdminUser } from '@/types'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [rolesDialogOpen, setRolesDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [newStatus, setNewStatus] = useState<UserStatus>(UserStatus.ACTIVE)

  const { data: users, isLoading: usersLoading } = useUsers()
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const assignRoles = useAssignRoles()
  const updateStatus = useUpdateUserStatus()

  // Filter users based on search
  const filteredUsers = users?.filter(
    user =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  // Get user roles as a flat array
  const getUserRoles = (user: AdminUser): string[] => {
    return user.user_roles?.map(ur => ur.roles.name) || []
  }

  // Get user role IDs
  const getUserRoleIds = (user: AdminUser): string[] => {
    return user.user_roles?.map(ur => ur.roles.id) || []
  }

  // Open roles dialog
  const handleOpenRolesDialog = (user: AdminUser) => {
    setSelectedUser(user)
    setSelectedRoleIds(getUserRoleIds(user))
    setRolesDialogOpen(true)
  }

  // Open status dialog
  const handleOpenStatusDialog = (user: AdminUser) => {
    setSelectedUser(user)
    setNewStatus(user.status || UserStatus.ACTIVE)
    setStatusDialogOpen(true)
  }

  // Handle role assignment
  const handleAssignRoles = async () => {
    if (!selectedUser) return

    try {
      await assignRoles.mutateAsync({
        userId: selectedUser.id,
        data: { roleIds: selectedRoleIds },
      })
      toast.success('Roles assigned successfully')
      setRolesDialogOpen(false)
    } catch (error) {
      toast.error('Failed to assign roles')
    }
  }

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selectedUser) return

    try {
      await updateStatus.mutateAsync({
        userId: selectedUser.id,
        data: { status: newStatus },
      })
      toast.success('User status updated successfully')
      setStatusDialogOpen(false)
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  // Toggle role selection
  const toggleRole = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{filteredUsers?.length || 0} users total</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8 w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getUserRoles(user).length > 0 ? (
                          getUserRoles(user).map(role => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === UserStatus.ACTIVE ? 'default' : 'secondary'}>
                        {user.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenRolesDialog(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenStatusDialog(user)}>
                            {user.status === UserStatus.ACTIVE ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Assign Roles Dialog */}
      <Dialog open={rolesDialogOpen} onOpenChange={setRolesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
            <DialogDescription>Assign roles to {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {rolesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {roles?.map(role => (
                  <div key={role.id} className="flex items-center space-x-3 rounded-lg border p-3">
                    <Checkbox
                      id={role.id}
                      checked={selectedRoleIds.includes(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={role.id} className="font-medium cursor-pointer">
                        {role.name}
                      </label>
                      {role.description && (
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRolesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignRoles} disabled={assignRoles.isPending}>
              {assignRoles.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
            <DialogDescription>Change the status for {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={value => setNewStatus(value as UserStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={UserStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
