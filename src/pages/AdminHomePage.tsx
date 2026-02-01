/**
 * Admin Dashboard Page
 * Overview of system statistics and quick actions
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  Shield,
  FileText,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/config/constants'
import {
  useUsers,
  useRoles,
  useDocuments,
  useDataSources,
  useEmbeddingJobs,
  useSystemLogs,
} from '@/hooks'
import { EmbeddingJobStatus, SystemLogLevel } from '@/types'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: string
  isLoading?: boolean
}

function StatCard({ title, value, description, icon, trend, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-1" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {trend && <span className="text-green-600 ml-1">{trend}</span>}
        </p>
      </CardContent>
    </Card>
  )
}

export const AdminHomePage = () => {
  const { data: users, isLoading: usersLoading } = useUsers()
  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: documents, isLoading: documentsLoading } = useDocuments()
  const { data: dataSources, isLoading: dataSourcesLoading } = useDataSources()
  const { data: embeddingJobs, isLoading: embeddingJobsLoading } = useEmbeddingJobs()
  const { data: systemLogs, isLoading: systemLogsLoading } = useSystemLogs({})

  // Calculate stats
  const activeUsers = users?.filter(u => u.status === 'ACTIVE').length || 0
  const totalDocuments = documents?.length || 0
  const readyDocuments = documents?.filter(d => d.status === 'READY').length || 0
  const processingJobs =
    embeddingJobs?.filter(j => j.status === EmbeddingJobStatus.PROCESSING).length || 0
  const failedJobs = embeddingJobs?.filter(j => j.status === EmbeddingJobStatus.FAILED).length || 0
  const recentErrors =
    systemLogs
      ?.filter(l => l.level === SystemLogLevel.ERROR || l.level === SystemLogLevel.FATAL)
      .slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Enterprise RAG Platform admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={users?.length || 0}
          description={`${activeUsers} active users`}
          icon={<Users className="h-4 w-4" />}
          isLoading={usersLoading}
        />
        <StatCard
          title="Roles"
          value={roles?.length || 0}
          description="Configured roles"
          icon={<Shield className="h-4 w-4" />}
          isLoading={rolesLoading}
        />
        <StatCard
          title="Documents"
          value={totalDocuments}
          description={`${readyDocuments} ready for queries`}
          icon={<FileText className="h-4 w-4" />}
          isLoading={documentsLoading}
        />
        <StatCard
          title="Data Sources"
          value={dataSources?.length || 0}
          description="Connected integrations"
          icon={<Database className="h-4 w-4" />}
          isLoading={dataSourcesLoading}
        />
      </div>

      {/* Secondary Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Processing Status */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Processing Status
            </CardTitle>
            <CardDescription>Current document embedding and processing status</CardDescription>
          </CardHeader>
          <CardContent>
            {embeddingJobsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">Documents being embedded</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {processingJobs}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Ready</p>
                      <p className="text-sm text-muted-foreground">Documents ready for queries</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {readyDocuments}
                  </Badge>
                </div>

                {failedJobs > 0 && (
                  <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Failed</p>
                        <p className="text-sm text-muted-foreground">Jobs requiring attention</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {failedJobs}
                    </Badge>
                  </div>
                )}

                <Button asChild variant="outline" className="w-full">
                  <Link to={ROUTES.ADMIN_EMBEDDING_JOBS}>
                    View All Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent System Errors */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Errors
            </CardTitle>
            <CardDescription>Latest system errors and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            {systemLogsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recentErrors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No recent errors</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentErrors.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        log.level === SystemLogLevel.FATAL ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Unknown time'}
                      </p>
                    </div>
                    <Badge variant={log.level === SystemLogLevel.FATAL ? 'destructive' : 'outline'}>
                      {log.level}
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link to={ROUTES.ADMIN_SYSTEM_LOGS}>
                    View All Logs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link to={ROUTES.ADMIN_USERS}>
                <Users className="h-5 w-5" />
                <span>Manage Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link to={ROUTES.ADMIN_DOCUMENTS}>
                <FileText className="h-5 w-5" />
                <span>Upload Documents</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link to={ROUTES.ADMIN_DATA_SOURCES}>
                <Database className="h-5 w-5" />
                <span>Add Data Source</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
              <Link to={ROUTES.ADMIN_QUERY_LOGS}>
                <TrendingUp className="h-5 w-5" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
