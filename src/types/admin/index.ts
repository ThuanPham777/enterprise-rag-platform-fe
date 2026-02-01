/**
 * Admin-related type definitions
 * Matches backend DTOs
 */

// ============ Enums (as const for erasableSyntaxOnly compatibility) ============

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export const DataSourceType = {
  LOCAL_FOLDER: 'LOCAL_FOLDER',
  S3: 'S3',
  WEB_CRAWLER: 'WEB_CRAWLER',
  DATABASE: 'DATABASE',
  NOTION: 'NOTION',
  SLACK: 'SLACK',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  CONFLUENCE: 'CONFLUENCE',
  SHAREPOINT: 'SHAREPOINT',
  DROPBOX: 'DROPBOX',
  CUSTOM_API: 'CUSTOM_API',
} as const
export type DataSourceType = (typeof DataSourceType)[keyof typeof DataSourceType]

export const DataSourceStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SYNCING: 'SYNCING',
  ERROR: 'ERROR',
  PENDING_AUTH: 'PENDING_AUTH',
} as const
export type DataSourceStatus = (typeof DataSourceStatus)[keyof typeof DataSourceStatus]

export const DocumentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  INDEXED: 'INDEXED',
  READY: 'READY',
  FAILED: 'FAILED',
} as const
export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus]

export const FileType = {
  PDF: 'PDF',
  DOC: 'DOC',
  DOCX: 'DOCX',
  XLS: 'XLS',
  XLSX: 'XLSX',
  PPTX: 'PPTX',
  PNG: 'PNG',
  JPG: 'JPG',
  JPEG: 'JPEG',
  GIF: 'GIF',
  JSON: 'JSON',
  XML: 'XML',
  MARKDOWN: 'MARKDOWN',
  HTML: 'HTML',
  CSV: 'CSV',
  TXT: 'TXT',
} as const
export type FileType = (typeof FileType)[keyof typeof FileType]

export const EmbeddingJobStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const
export type EmbeddingJobStatus = (typeof EmbeddingJobStatus)[keyof typeof EmbeddingJobStatus]

export const SystemLogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL',
} as const
export type SystemLogLevel = (typeof SystemLogLevel)[keyof typeof SystemLogLevel]

// ============ Permission Types ============

export interface Permission {
  id: string
  code: string
  description?: string
}

export interface CreatePermissionRequest {
  code: string
  description?: string
}

export interface UpdatePermissionRequest {
  code?: string
  description?: string
}

// ============ Role Types ============

export interface Role {
  id: string
  name: string
  description?: string
  permissions?: Permission[]
}

export interface CreateRoleRequest {
  name: string
  description?: string
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
}

export interface AssignPermissionsRequest {
  permissionIds: string[]
}

// ============ User Types ============

export interface UserRole {
  roles: Role
}

export interface AdminUser {
  id: string
  email: string
  full_name?: string
  status?: UserStatus
  created_at?: string
  updated_at?: string
  user_roles: UserRole[]
}

export interface AssignRolesRequest {
  roleIds: string[]
}

export interface UpdateUserStatusRequest {
  status: UserStatus
}

// ============ Department Types ============

export interface Department {
  id: string
  name: string
  description?: string
}

export interface CreateDepartmentRequest {
  name: string
  description?: string
}

export interface UpdateDepartmentRequest {
  name?: string
  description?: string
}

// ============ Position Types ============

export interface Position {
  id: string
  name: string
  level: number
}

export interface CreatePositionRequest {
  name: string
  level: number
}

export interface UpdatePositionRequest {
  name?: string
  level?: number
}

// ============ User Profile Types ============

export interface UserProfile {
  user_id: string
  department_id?: string
  position_id?: string
  joined_at?: string
  departments?: Department
  positions?: Position
  users?: {
    id: string
    email: string
    full_name?: string
  }
}

export interface CreateUserProfileRequest {
  userId: string
  departmentId?: string
  positionId?: string
  joinedAt?: string
}

export interface UpdateUserProfileRequest {
  departmentId?: string
  positionId?: string
  joinedAt?: string
}

// ============ Document Types ============

export interface AccessRule {
  roleId?: string
  departmentId?: string
  positionId?: string
}

export interface Document {
  id: string
  title: string
  filePath?: string
  originalFileName?: string
  fileType?: FileType
  fileSize?: number
  status: DocumentStatus
  chunkCount?: number
  uploadedBy?: string
  dataSourceId?: string
  dataSource?: {
    id: string
    name?: string
  }
  accessRules?: AccessRule[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateDocumentRequest {
  title: string
  filePath: string
  fileType: FileType
  sourceType?: string
  accessRules?: AccessRule[]
}

export interface UpdateDocumentRequest {
  title?: string
  accessRules?: AccessRule[]
}

// ============ Data Source Types ============

export interface DataSource {
  id: string
  type: DataSourceType
  name: string
  description?: string
  config?: Record<string, any>
  status: DataSourceStatus
  lastSyncedAt?: string
  documentCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateDataSourceRequest {
  type: DataSourceType
  name: string
  description?: string
  config?: Record<string, any>
}

export interface UpdateDataSourceRequest {
  name?: string
  description?: string
  config?: Record<string, any>
}

export interface DataSourceStatistics {
  totalCount: number
  byType: Record<DataSourceType, number>
  byStatus: Record<DataSourceStatus, number>
  totalDocuments: number
}

// ============ Embedding Job Types ============

export interface EmbeddingJob {
  id: string
  documentId?: string
  status: EmbeddingJobStatus
  totalChunks?: number
  processedChunks: number
  errorMessage?: string
  startedAt?: string
  finishedAt?: string
  createdAt: string
  documentTitle?: string
}

// ============ Query Log Types ============

export interface QueryLog {
  id: string
  userId?: string
  query: string
  response?: string
  success: boolean
  responseTimeMs: number
  sourceCount?: number
  tokensUsed?: number
  inputTokens?: number
  outputTokens?: number
  errorMessage?: string
  createdAt: string
  userName?: string
  userEmail?: string
}

export interface QueryLogFilter {
  userId?: string
  startDate?: string
  endDate?: string
}

export interface QueryLogStatistics {
  totalQueries: number
  averageResponseTime: number
  queriesByDay: { date: string; count: number }[]
  topUsers: { userId: string; userName: string; count: number }[]
}

// ============ System Log Types ============

export interface SystemLog {
  id: string
  level: SystemLogLevel
  message: string
  source?: string
  context?: string | Record<string, any>
  stackTrace?: string
  metadata?: Record<string, any>
  timestamp: string
  createdAt?: string
}

export interface SystemLogFilter {
  level?: SystemLogLevel
  startDate?: string
  endDate?: string
  search?: string
}

export interface SystemLogStatistics {
  totalLogs: number
  byLevel: Record<SystemLogLevel, number>
  recentErrors: SystemLog[]
}
