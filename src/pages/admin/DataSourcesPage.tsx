/**
 * Data Sources Management Page
 * Create, configure, and manage data sources
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Database,
  RefreshCw,
  PlayCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  HardDrive,
  Globe,
  FolderOpen,
} from 'lucide-react'
import {
  useDataSources,
  useCreateDataSource,
  useUpdateDataSource,
  useDeleteDataSource,
  useSyncDataSource,
  useTestDataSource,
} from '@/hooks'
import type { DataSource, CreateDataSourceRequest } from '@/types'
import { DataSourceType, DataSourceStatus } from '@/types'

export default function DataSourcesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null)
  const [formData, setFormData] = useState<CreateDataSourceRequest>({
    name: '',
    type: DataSourceType.LOCAL_FOLDER,
    description: '',
    config: {},
  })

  const { data: dataSources, isLoading } = useDataSources()
  const createDataSource = useCreateDataSource()
  const updateDataSource = useUpdateDataSource()
  const deleteDataSource = useDeleteDataSource()
  const syncDataSource = useSyncDataSource()
  const testDataSource = useTestDataSource()

  // Filter data sources
  const filteredDataSources = dataSources?.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ds.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      type: DataSourceType.LOCAL_FOLDER,
      description: '',
      config: {},
    })
    setSelectedDataSource(null)
  }

  // Handle create
  const handleCreate = async () => {
    try {
      await createDataSource.mutateAsync(formData)
      toast.success('Data source created successfully')
      setCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to create data source')
    }
  }

  // Open edit dialog
  const handleOpenEdit = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource)
    setFormData({
      name: dataSource.name,
      type: dataSource.type,
      description: dataSource.description || '',
      config: dataSource.config || {},
    })
    setEditDialogOpen(true)
  }

  // Handle update
  const handleUpdate = async () => {
    if (!selectedDataSource) return

    try {
      await updateDataSource.mutateAsync({
        id: selectedDataSource.id,
        data: formData,
      })
      toast.success('Data source updated successfully')
      setEditDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to update data source')
    }
  }

  // Open delete dialog
  const handleOpenDelete = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource)
    setDeleteDialogOpen(true)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedDataSource) return

    try {
      await deleteDataSource.mutateAsync(selectedDataSource.id)
      toast.success('Data source deleted successfully')
      setDeleteDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to delete data source')
    }
  }

  // Handle sync
  const handleSync = async (id: string) => {
    try {
      await syncDataSource.mutateAsync(id)
      toast.success('Sync started')
    } catch (error) {
      toast.error('Failed to start sync')
    }
  }

  // Handle test
  const handleTest = async (id: string) => {
    try {
      await testDataSource.mutateAsync(id)
      toast.success('Connection test successful')
    } catch (error) {
      toast.error('Connection test failed')
    }
  }

  // Get type icon
  const getTypeIcon = (type: DataSourceType) => {
    switch (type) {
      case DataSourceType.LOCAL_FOLDER:
        return <FolderOpen className="h-4 w-4 text-yellow-600" />
      case DataSourceType.S3:
        return <HardDrive className="h-4 w-4 text-orange-500" />
      case DataSourceType.WEB_CRAWLER:
        return <Globe className="h-4 w-4 text-blue-500" />
      case DataSourceType.DATABASE:
        return <Database className="h-4 w-4 text-green-500" />
      default:
        return <Database className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Get status badge
  const getStatusBadge = (status: DataSourceStatus) => {
    switch (status) {
      case DataSourceStatus.ACTIVE:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case DataSourceStatus.INACTIVE:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Clock className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        )
      case DataSourceStatus.SYNCING:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Syncing
          </Badge>
        )
      case DataSourceStatus.ERROR:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
        <p className="text-muted-foreground">Manage and configure knowledge base data sources</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Data Sources</CardTitle>
              <CardDescription>
                {filteredDataSources?.length || 0} data sources configured
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search data sources..."
                  className="pl-8 w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={DataSourceStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={DataSourceStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={DataSourceStatus.SYNCING}>Syncing</SelectItem>
                  <SelectItem value={DataSourceStatus.ERROR}>Error</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Data Source
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Data Source</DialogTitle>
                    <DialogDescription>
                      Add a new data source to the knowledge base
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Company Docs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: DataSourceType) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DataSourceType.LOCAL_FOLDER}>
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4" />
                              Local Folder
                            </div>
                          </SelectItem>
                          <SelectItem value={DataSourceType.S3}>
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4" />
                              Amazon S3
                            </div>
                          </SelectItem>
                          <SelectItem value={DataSourceType.WEB_CRAWLER}>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Web Crawler
                            </div>
                          </SelectItem>
                          <SelectItem value={DataSourceType.DATABASE}>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4" />
                              Database
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                        placeholder="Data source description..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!formData.name || createDataSource.isPending}
                    >
                      {createDataSource.isPending ? 'Creating...' : 'Create'}
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
                  <TableHead>Data Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDataSources?.map(dataSource => (
                  <TableRow key={dataSource.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getTypeIcon(dataSource.type)}
                        <div>
                          <p className="font-medium">{dataSource.name}</p>
                          {dataSource.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {dataSource.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataSource.type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(dataSource.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {dataSource.documentCount || 0}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {dataSource.lastSyncedAt
                        ? new Date(dataSource.lastSyncedAt).toLocaleString()
                        : 'Never'}
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
                          <DropdownMenuItem onClick={() => handleSync(dataSource.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Sync Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTest(dataSource.id)}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Test Connection
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenEdit(dataSource)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleOpenDelete(dataSource)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Source</DialogTitle>
            <DialogDescription>Update data source configuration</DialogDescription>
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
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: DataSourceType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DataSourceType.LOCAL_FOLDER}>Local Folder</SelectItem>
                  <SelectItem value={DataSourceType.S3}>Amazon S3</SelectItem>
                  <SelectItem value={DataSourceType.WEB_CRAWLER}>Web Crawler</SelectItem>
                  <SelectItem value={DataSourceType.DATABASE}>Database</SelectItem>
                </SelectContent>
              </Select>
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
            <Button onClick={handleUpdate} disabled={!formData.name || updateDataSource.isPending}>
              {updateDataSource.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Data Source</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDataSource?.name}"? This will remove the
              data source and all associated documents from the knowledge base. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDataSource.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
