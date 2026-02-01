/**
 * React Query hooks for admin services
 * Provides data fetching, caching, and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  usersService,
  rolesService,
  permissionsService,
  departmentsService,
  positionsService,
  documentsService,
  dataSourcesService,
  embeddingJobsService,
  queryLogsService,
  systemLogsService,
} from '../services'
import type {
  AssignRolesRequest,
  UpdateUserStatusRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreatePositionRequest,
  UpdatePositionRequest,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateDataSourceRequest,
  UpdateDataSourceRequest,
  DataSourceType,
  EmbeddingJobStatus,
  QueryLogFilter,
  SystemLogFilter,
} from '../types'

// Query keys for cache management
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  roles: ['roles'] as const,
  role: (id: string) => ['roles', id] as const,
  permissions: ['permissions'] as const,
  permission: (id: string) => ['permissions', id] as const,
  departments: ['departments'] as const,
  department: (id: string) => ['departments', id] as const,
  positions: ['positions'] as const,
  position: (id: string) => ['positions', id] as const,
  documents: ['documents'] as const,
  document: (id: string) => ['documents', id] as const,
  dataSources: ['dataSources'] as const,
  dataSource: (id: string) => ['dataSources', id] as const,
  dataSourceStats: ['dataSources', 'statistics'] as const,
  embeddingJobs: ['embeddingJobs'] as const,
  embeddingJob: (id: string) => ['embeddingJobs', id] as const,
  queryLogs: ['queryLogs'] as const,
  queryLog: (id: string) => ['queryLogs', id] as const,
  queryLogStats: ['queryLogs', 'statistics'] as const,
  systemLogs: ['systemLogs'] as const,
  systemLogStats: ['systemLogs', 'statistics'] as const,
}

// ============ Users Hooks ============

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => usersService.getAll(),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  })
}

export function useAssignRoles() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: AssignRolesRequest }) =>
      usersService.assignRoles(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusRequest }) =>
      usersService.updateStatus(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
    },
  })
}

// ============ Roles Hooks ============

export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles,
    queryFn: () => rolesService.getAll(),
  })
}

export function useRole(id: string) {
  return useQuery({
    queryKey: queryKeys.role(id),
    queryFn: () => rolesService.getById(id),
    enabled: !!id,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      rolesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rolesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

export function useAssignPermissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: AssignPermissionsRequest }) =>
      rolesService.assignPermissions(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles })
    },
  })
}

// ============ Permissions Hooks ============

export function usePermissions() {
  return useQuery({
    queryKey: queryKeys.permissions,
    queryFn: () => permissionsService.getAll(),
  })
}

export function usePermission(id: string) {
  return useQuery({
    queryKey: queryKeys.permission(id),
    queryFn: () => permissionsService.getById(id),
    enabled: !!id,
  })
}

export function useCreatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => permissionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions })
    },
  })
}

export function useUpdatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionRequest }) =>
      permissionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions })
    },
  })
}

export function useDeletePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => permissionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.permissions })
    },
  })
}

// ============ Departments Hooks ============

export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: () => departmentsService.getAll(),
  })
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: queryKeys.department(id),
    queryFn: () => departmentsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => departmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments })
    },
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentRequest }) =>
      departmentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments })
    },
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments })
    },
  })
}

// ============ Positions Hooks ============

export function usePositions() {
  return useQuery({
    queryKey: queryKeys.positions,
    queryFn: () => positionsService.getAll(),
  })
}

export function usePosition(id: string) {
  return useQuery({
    queryKey: queryKeys.position(id),
    queryFn: () => positionsService.getById(id),
    enabled: !!id,
  })
}

export function useCreatePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePositionRequest) => positionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions })
    },
  })
}

export function useUpdatePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePositionRequest }) =>
      positionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions })
    },
  })
}

export function useDeletePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => positionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions })
    },
  })
}

// ============ Documents Hooks ============

export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: () => documentsService.getAll(),
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => documentsService.getById(id),
    enabled: !!id,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDocumentRequest) => documentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequest }) =>
      documentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => documentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents })
    },
  })
}

// ============ Data Sources Hooks ============

export function useDataSources(type?: DataSourceType) {
  return useQuery({
    queryKey: [...queryKeys.dataSources, type],
    queryFn: () => dataSourcesService.getAll(type),
  })
}

export function useDataSource(id: string) {
  return useQuery({
    queryKey: queryKeys.dataSource(id),
    queryFn: () => dataSourcesService.getById(id),
    enabled: !!id,
  })
}

export function useDataSourceStatistics() {
  return useQuery({
    queryKey: queryKeys.dataSourceStats,
    queryFn: () => dataSourcesService.getStatistics(),
  })
}

export function useCreateDataSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDataSourceRequest) => dataSourcesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataSources })
    },
  })
}

export function useUpdateDataSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDataSourceRequest }) =>
      dataSourcesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataSources })
    },
  })
}

export function useDeleteDataSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => dataSourcesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataSources })
    },
  })
}

export function useSyncDataSource() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => dataSourcesService.sync(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dataSources })
    },
  })
}

export function useTestDataSource() {
  return useMutation({
    mutationFn: (id: string) => dataSourcesService.test(id),
  })
}

// ============ Embedding Jobs Hooks ============

export function useEmbeddingJobs(status?: EmbeddingJobStatus) {
  return useQuery({
    queryKey: [...queryKeys.embeddingJobs, status],
    queryFn: () => embeddingJobsService.getAll(status),
  })
}

export function useEmbeddingJob(id: string) {
  return useQuery({
    queryKey: queryKeys.embeddingJob(id),
    queryFn: () => embeddingJobsService.getById(id),
    enabled: !!id,
  })
}

export function useDeleteEmbeddingJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => embeddingJobsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.embeddingJobs })
    },
  })
}

// ============ Query Logs Hooks ============

export function useQueryLogs(filter?: QueryLogFilter) {
  return useQuery({
    queryKey: [...queryKeys.queryLogs, filter],
    queryFn: () => queryLogsService.getAll(filter),
  })
}

export function useQueryLog(id: string) {
  return useQuery({
    queryKey: queryKeys.queryLog(id),
    queryFn: () => queryLogsService.getById(id),
    enabled: !!id,
  })
}

export function useQueryLogStatistics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [...queryKeys.queryLogStats, startDate, endDate],
    queryFn: () => queryLogsService.getStatistics(startDate, endDate),
  })
}

export function useDeleteQueryLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => queryLogsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.queryLogs })
    },
  })
}

// ============ System Logs Hooks ============

export function useSystemLogs(filter?: SystemLogFilter) {
  return useQuery({
    queryKey: [...queryKeys.systemLogs, filter],
    queryFn: () => systemLogsService.getAll(filter),
  })
}

export function useSystemLogStatistics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: [...queryKeys.systemLogStats, startDate, endDate],
    queryFn: () => systemLogsService.getStatistics(startDate, endDate),
  })
}

export function useClearSystemLogs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (before?: string) => systemLogsService.clear(before),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.systemLogs })
    },
  })
}
