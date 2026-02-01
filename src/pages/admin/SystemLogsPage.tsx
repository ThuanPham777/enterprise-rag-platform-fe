/**
 * System Logs Page
 * View and monitor system events and errors
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
  DialogHeader,
  DialogTitle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Search,
  AlertTriangle,
  AlertCircle,
  Info,
  Bug,
  Eye,
  Trash2,
  Activity,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import { useSystemLogs, useClearSystemLogs } from '@/hooks'
import type { SystemLog } from '@/types'
import { SystemLogLevel } from '@/types'

export default function SystemLogsPage() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [clearDays, setClearDays] = useState('30')

  const { data: logs, isLoading, refetch } = useSystemLogs()
  const clearLogs = useClearSystemLogs()

  // Filter logs
  const filteredLogs = logs?.filter(log => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.context?.toLowerCase().includes(search.toLowerCase()) ||
      log.source?.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    return matchesSearch && matchesLevel
  })

  // Sort by timestamp (newest first)
  const sortedLogs = filteredLogs?.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  // Calculate stats
  const stats = {
    total: logs?.length || 0,
    error: logs?.filter(l => l.level === SystemLogLevel.ERROR).length || 0,
    warn: logs?.filter(l => l.level === SystemLogLevel.WARN).length || 0,
    info: logs?.filter(l => l.level === SystemLogLevel.INFO).length || 0,
    debug: logs?.filter(l => l.level === SystemLogLevel.DEBUG).length || 0,
  }

  // View log details
  const handleViewDetails = (log: SystemLog) => {
    setSelectedLog(log)
    setDetailsDialogOpen(true)
  }

  // Handle clear old logs
  const handleClearLogs = async () => {
    try {
      // Calculate date N days ago
      const daysAgo = parseInt(clearDays)
      const beforeDate = new Date()
      beforeDate.setDate(beforeDate.getDate() - daysAgo)
      await clearLogs.mutateAsync(beforeDate.toISOString())
      toast.success(`Logs older than ${clearDays} days cleared`)
      setClearDialogOpen(false)
    } catch (error) {
      toast.error('Failed to clear logs')
    }
  }

  // Get level badge
  const getLevelBadge = (level: SystemLogLevel) => {
    switch (level) {
      case SystemLogLevel.ERROR:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        )
      case SystemLogLevel.WARN:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        )
      case SystemLogLevel.INFO:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="mr-1 h-3 w-3" />
            Info
          </Badge>
        )
      case SystemLogLevel.DEBUG:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Bug className="mr-1 h-3 w-3" />
            Debug
          </Badge>
        )
      default:
        return <Badge variant="secondary">{level}</Badge>
    }
  }

  // Get level icon
  const getLevelIcon = (level: SystemLogLevel) => {
    switch (level) {
      case SystemLogLevel.ERROR:
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case SystemLogLevel.WARN:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case SystemLogLevel.INFO:
        return <Info className="h-4 w-4 text-blue-500" />
      case SystemLogLevel.DEBUG:
        return <Bug className="h-4 w-4 text-gray-500" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">Monitor system events and errors</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Activity className="h-3 w-3" /> Total Logs
            </CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-red-500" /> Errors
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.error}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500" /> Warnings
            </CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.warn}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Info className="h-3 w-3 text-blue-500" /> Info
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.info}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Bug className="h-3 w-3 text-gray-500" /> Debug
            </CardDescription>
            <CardTitle className="text-2xl text-gray-600">{stats.debug}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Log Entries</CardTitle>
              <CardDescription>{sortedLogs?.length || 0} log entries</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8 w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value={SystemLogLevel.ERROR}>Errors</SelectItem>
                  <SelectItem value={SystemLogLevel.WARN}>Warnings</SelectItem>
                  <SelectItem value={SystemLogLevel.INFO}>Info</SelectItem>
                  <SelectItem value={SystemLogLevel.DEBUG}>Debug</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => setClearDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Old
              </Button>
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
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs?.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{getLevelIcon(log.level)}</TableCell>
                    <TableCell>
                      <p className="truncate max-w-md text-sm">{log.message}</p>
                    </TableCell>
                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {log.source || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && getLevelIcon(selectedLog.level)}
              Log Details
            </DialogTitle>
            <DialogDescription>Full log entry information</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Level</p>
                    <div className="mt-1">{getLevelBadge(selectedLog.level)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {selectedLog.source && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Source</p>
                      <code className="text-sm mt-1 bg-muted px-2 py-0.5 rounded">
                        {selectedLog.source}
                      </code>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">{selectedLog.message}</p>
                  </div>
                </div>

                {/* Context */}
                {selectedLog.context && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Context</p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {typeof selectedLog.context === 'string'
                          ? selectedLog.context
                          : JSON.stringify(selectedLog.context, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Stack Trace */}
                {selectedLog.stackTrace && (
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">Stack Trace</p>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <pre className="text-xs font-mono text-red-700 overflow-x-auto whitespace-pre-wrap">
                        {selectedLog.stackTrace}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Metadata</p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="text-xs font-mono overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Clear Old Logs Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Old Logs</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete logs older than the specified number of days. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Delete logs older than:</label>
            <Select value={clearDays} onValueChange={setClearDays}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="60">60 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearLogs}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {clearLogs.isPending ? 'Clearing...' : 'Clear Logs'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
