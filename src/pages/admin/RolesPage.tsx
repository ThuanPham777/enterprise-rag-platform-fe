/**
 * Roles Management Page
 * Create, edit, and manage roles with permission assignment
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Key, Shield } from 'lucide-react'
import {
  useRoles,
  usePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAssignPermissions,
} from '@/hooks'
import type { Role, CreateRoleRequest } from '@/types'

export default function RolesPage() {
  const [search, setSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: '',
    description: '',
  })
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])

  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: permissions, isLoading: permissionsLoading } = usePermissions()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()
  const assignPermissions = useAssignPermissions()

  // Filter roles based on search
  const filteredRoles = roles?.filter(
    role =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setSelectedRole(null)
  }

  // Handle create
  const handleCreate = async () => {
    try {
      await createRole.mutateAsync(formData)
      toast.success('Role created successfully')
      setCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to create role')
    }
  }

  // Open edit dialog
  const handleOpenEdit = (role: Role) => {
    setSelectedRole(role)
    setFormData({ name: role.name, description: role.description || '' })
    setEditDialogOpen(true)
  }

  // Handle update
  const handleUpdate = async () => {
    if (!selectedRole) return

    try {
      await updateRole.mutateAsync({
        id: selectedRole.id,
        data: formData,
      })
      toast.success('Role updated successfully')
      setEditDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  // Open permissions dialog
  const handleOpenPermissions = (role: Role) => {
    setSelectedRole(role)
    setSelectedPermissionIds(role.permissions?.map(p => p.id) || [])
    setPermissionsDialogOpen(true)
  }

  // Handle assign permissions
  const handleAssignPermissions = async () => {
    if (!selectedRole) return

    try {
      await assignPermissions.mutateAsync({
        roleId: selectedRole.id,
        data: { permissionIds: selectedPermissionIds },
      })
      toast.success('Permissions assigned successfully')
      setPermissionsDialogOpen(false)
    } catch (error) {
      toast.error('Failed to assign permissions')
    }
  }

  // Open delete dialog
  const handleOpenDelete = (role: Role) => {
    setSelectedRole(role)
    setDeleteDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRole) return

    try {
      await deleteRole.mutateAsync(selectedRole.id)
      toast.success('Role deleted successfully')
      setDeleteDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to delete role')
    }
  }

  // Toggle permission selection
  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <p className="text-muted-foreground">Manage roles and their permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Roles</CardTitle>
              <CardDescription>{filteredRoles?.length || 0} roles configured</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-8 w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Role</DialogTitle>
                    <DialogDescription>Add a new role to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Manager"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Role description..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!formData.name || createRole.isPending}
                    >
                      {createRole.isPending ? 'Creating...' : 'Create Role'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rolesLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles?.map(role => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-muted-foreground">{role.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions && role.permissions.length > 0 ? (
                          <>
                            {role.permissions.slice(0, 3).map(perm => (
                              <Badge key={perm.id} variant="outline">
                                {perm.code}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="secondary">+{role.permissions.length - 3} more</Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground text-sm">No permissions</span>
                        )}
                      </div>
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(role)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenPermissions(role)}>
                            <Key className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(role)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.name || updateRole.isPending}>
              {updateRole.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Permissions</DialogTitle>
            <DialogDescription>Assign permissions to {selectedRole?.name}</DialogDescription>
          </DialogHeader>
          {permissionsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {permissions?.map(permission => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-3 rounded-lg border p-3"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissionIds.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={permission.id}
                        className="font-medium cursor-pointer font-mono text-sm"
                      >
                        {permission.code}
                      </label>
                      {permission.description && (
                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPermissions} disabled={assignPermissions.isPending}>
              {assignPermissions.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be
              undone and will remove this role from all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRole.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
