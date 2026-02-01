/**
 * Permissions Management Page
 * Create, edit, and manage system permissions
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Key } from 'lucide-react'
import {
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from '@/hooks'
import type { Permission, CreatePermissionRequest } from '@/types'

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [formData, setFormData] = useState<CreatePermissionRequest>({
    code: '',
    description: '',
  })

  const { data: permissions, isLoading } = usePermissions()
  const createPermission = useCreatePermission()
  const updatePermission = useUpdatePermission()
  const deletePermission = useDeletePermission()

  // Filter permissions based on search
  const filteredPermissions = permissions?.filter(
    perm =>
      perm.code.toLowerCase().includes(search.toLowerCase()) ||
      perm.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Reset form
  const resetForm = () => {
    setFormData({ code: '', description: '' })
    setSelectedPermission(null)
  }

  // Handle create
  const handleCreate = async () => {
    try {
      await createPermission.mutateAsync(formData)
      toast.success('Permission created successfully')
      setCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to create permission')
    }
  }

  // Open edit dialog
  const handleOpenEdit = (permission: Permission) => {
    setSelectedPermission(permission)
    setFormData({ code: permission.code, description: permission.description || '' })
    setEditDialogOpen(true)
  }

  // Handle update
  const handleUpdate = async () => {
    if (!selectedPermission) return

    try {
      await updatePermission.mutateAsync({
        id: selectedPermission.id,
        data: formData,
      })
      toast.success('Permission updated successfully')
      setEditDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to update permission')
    }
  }

  // Open delete dialog
  const handleOpenDelete = (permission: Permission) => {
    setSelectedPermission(permission)
    setDeleteDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPermission) return

    try {
      await deletePermission.mutateAsync(selectedPermission.id)
      toast.success('Permission deleted successfully')
      setDeleteDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to delete permission')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
        <p className="text-muted-foreground">Manage system permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Permissions</CardTitle>
              <CardDescription>
                {filteredPermissions?.length || 0} permissions configured
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  className="pl-8 w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Permission
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Permission</DialogTitle>
                    <DialogDescription>Add a new permission to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">Permission Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase().replace(/\s+/g, '_'),
                          })
                        }
                        placeholder="e.g., MANAGE_USERS"
                        className="font-mono"
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
                        placeholder="Permission description..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!formData.code || createPermission.isPending}
                    >
                      {createPermission.isPending ? 'Creating...' : 'Create Permission'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions?.map(permission => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <code className="font-mono text-sm bg-muted px-2 py-0.5 rounded">
                          {permission.code}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {permission.description || '-'}
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(permission)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(permission)}
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
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>Update permission information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Permission Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={e =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase().replace(/\s+/g, '_'),
                  })
                }
                className="font-mono"
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
            <Button onClick={handleUpdate} disabled={!formData.code || updatePermission.isPending}>
              {updatePermission.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the permission "{selectedPermission?.code}"? This
              action cannot be undone and will remove this permission from all roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePermission.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
