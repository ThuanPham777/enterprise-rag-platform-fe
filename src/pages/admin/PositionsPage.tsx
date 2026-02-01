/**
 * Positions Management Page
 * Create, edit, and manage organization positions
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Search, Plus, MoreHorizontal, Pencil, Trash2, Briefcase } from 'lucide-react'
import { usePositions, useCreatePosition, useUpdatePosition, useDeletePosition } from '@/hooks'
import type { Position, CreatePositionRequest } from '@/types'

export default function PositionsPage() {
  const [search, setSearch] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState<CreatePositionRequest>({
    name: '',
    level: 1,
  })

  const { data: positions, isLoading } = usePositions()
  const createPosition = useCreatePosition()
  const updatePosition = useUpdatePosition()
  const deletePosition = useDeletePosition()

  // Filter positions based on search
  const filteredPositions = positions?.filter(pos =>
    pos.name.toLowerCase().includes(search.toLowerCase())
  )

  // Sort by level (highest first)
  const sortedPositions = filteredPositions?.sort((a, b) => b.level - a.level)

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', level: 1 })
    setSelectedPosition(null)
  }

  // Handle create
  const handleCreate = async () => {
    try {
      await createPosition.mutateAsync(formData)
      toast.success('Position created successfully')
      setCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to create position')
    }
  }

  // Open edit dialog
  const handleOpenEdit = (position: Position) => {
    setSelectedPosition(position)
    setFormData({ name: position.name, level: position.level })
    setEditDialogOpen(true)
  }

  // Handle update
  const handleUpdate = async () => {
    if (!selectedPosition) return

    try {
      await updatePosition.mutateAsync({
        id: selectedPosition.id,
        data: formData,
      })
      toast.success('Position updated successfully')
      setEditDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to update position')
    }
  }

  // Open delete dialog
  const handleOpenDelete = (position: Position) => {
    setSelectedPosition(position)
    setDeleteDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPosition) return

    try {
      await deletePosition.mutateAsync(selectedPosition.id)
      toast.success('Position deleted successfully')
      setDeleteDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to delete position')
    }
  }

  // Get level color
  const getLevelColor = (level: number) => {
    if (level >= 8) return 'bg-purple-100 text-purple-800 border-purple-200'
    if (level >= 6) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (level >= 4) return 'bg-green-100 text-green-800 border-green-200'
    if (level >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Positions</h1>
        <p className="text-muted-foreground">Manage organization positions and levels</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Positions</CardTitle>
              <CardDescription>{sortedPositions?.length || 0} positions configured</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search positions..."
                  className="pl-8 w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Position
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Position</DialogTitle>
                    <DialogDescription>Add a new position to the organization</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Input
                        id="level"
                        type="number"
                        min={1}
                        max={10}
                        value={formData.level}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            level: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Higher level = more seniority (1-10)
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!formData.name || createPosition.isPending}
                    >
                      {createPosition.isPending ? 'Creating...' : 'Create Position'}
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
                  <TableHead>Position</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPositions?.map(position => (
                  <TableRow key={position.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{position.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLevelColor(position.level)}>
                        Level {position.level}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleOpenEdit(position)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(position)}
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
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>Update position information</DialogDescription>
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
              <Label htmlFor="edit-level">Level</Label>
              <Input
                id="edit-level"
                type="number"
                min={1}
                max={10}
                value={formData.level}
                onChange={e =>
                  setFormData({
                    ...formData,
                    level: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.name || updatePosition.isPending}>
              {updatePosition.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Position</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the position "{selectedPosition?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePosition.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
