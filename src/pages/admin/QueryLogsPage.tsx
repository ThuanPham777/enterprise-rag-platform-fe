/**
 * Query Logs Page
 * View and analyze RAG query logs
 */

import { useState } from 'react'
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
  MessageSquare,
  Clock,
  User,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Timer,
  TrendingUp,
} from 'lucide-react'
import { useQueryLogs } from '@/hooks'
import type { QueryLog } from '@/types'

export default function QueryLogsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<QueryLog | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const { data: logs, isLoading, refetch } = useQueryLogs()

  // Filter logs
  const filteredLogs = logs?.filter(log => {
    const matchesSearch =
      log.query.toLowerCase().includes(search.toLowerCase()) ||
      log.response?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'success' && log.success) ||
      (statusFilter === 'failed' && !log.success)
    return matchesSearch && matchesStatus
  })

  // Sort by timestamp (newest first)
  const sortedLogs = filteredLogs?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Calculate stats
  const stats = {
    total: logs?.length || 0,
    success: logs?.filter(l => l.success).length || 0,
    failed: logs?.filter(l => !l.success).length || 0,
    avgResponseTime:
      logs && logs.length > 0
        ? Math.round(logs.reduce((sum, l) => sum + (l.responseTimeMs || 0), 0) / logs.length)
        : 0,
  }

  // View log details
  const handleViewDetails = (log: QueryLog) => {
    setSelectedLog(log)
    setDetailsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Query Logs</h1>
        <p className="text-muted-foreground">Monitor and analyze RAG queries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> Total Queries
            </CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Successful
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.success}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Failed
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">{stats.failed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Timer className="h-3 w-3" /> Avg Response Time
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.avgResponseTime}ms</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Query History</CardTitle>
              <CardDescription>{sortedLogs?.length || 0} queries recorded</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries..."
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
                  <SelectItem value="success">Successful</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
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
                  <TableHead>Query</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Sources</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLogs?.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-start gap-2 max-w-md">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="truncate text-sm">{log.query}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <XCircle className="mr-1 h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.responseTimeMs}ms
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {log.sourceCount || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(log.createdAt).toLocaleString()}
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
              <MessageSquare className="h-5 w-5" />
              Query Details
            </DialogTitle>
            <DialogDescription>Full query and response information</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {selectedLog.success ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 mt-1"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Success
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200 mt-1"
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedLog.responseTimeMs}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sources Used</p>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {selectedLog.sourceCount || 0} documents
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-sm mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(selectedLog.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedLog.userId && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">User ID</p>
                      <p className="text-sm mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <code className="text-xs bg-muted px-1 rounded">
                          {selectedLog.userId.slice(0, 8)}...
                        </code>
                      </p>
                    </div>
                  )}
                </div>

                {/* Query */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Query</p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">{selectedLog.query}</p>
                  </div>
                </div>

                {/* Response */}
                {selectedLog.response && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Response</p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedLog.response}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {selectedLog.errorMessage && (
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">Error</p>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm text-red-700">{selectedLog.errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Tokens */}
                {(selectedLog.tokensUsed ||
                  selectedLog.inputTokens ||
                  selectedLog.outputTokens) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Token Usage
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedLog.inputTokens !== undefined && (
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <p className="text-lg font-semibold">{selectedLog.inputTokens}</p>
                          <p className="text-xs text-muted-foreground">Input Tokens</p>
                        </div>
                      )}
                      {selectedLog.outputTokens !== undefined && (
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <p className="text-lg font-semibold">{selectedLog.outputTokens}</p>
                          <p className="text-xs text-muted-foreground">Output Tokens</p>
                        </div>
                      )}
                      {selectedLog.tokensUsed !== undefined && (
                        <div className="bg-muted/50 p-3 rounded-lg text-center">
                          <p className="text-lg font-semibold">{selectedLog.tokensUsed}</p>
                          <p className="text-xs text-muted-foreground">Total Tokens</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
