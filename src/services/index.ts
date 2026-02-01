/**
 * Services index
 * Re-exports all services for convenient imports
 */

export { authService } from './auth.service'
export { usersService } from './users.service'
export { rolesService } from './roles.service'
export { permissionsService } from './permissions.service'
export { departmentsService } from './departments.service'
export { positionsService } from './positions.service'
export { documentsService } from './documents.service'
export { dataSourcesService } from './data-sources.service'
export { embeddingJobsService } from './embedding-jobs.service'
export { queryLogsService } from './query-logs.service'
export { systemLogsService } from './system-logs.service'
export { uploadsService } from './uploads.service'

export { default as apiClient } from './api'
