/**
 * Application-wide constants
 */

export const ROUTES = {
  // Public routes
  LOGIN: '/login',

  // Client routes
  HOME: '/',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_POSITIONS: '/admin/positions',
  ADMIN_DOCUMENTS: '/admin/documents',
  ADMIN_DATA_SOURCES: '/admin/data-sources',
  ADMIN_EMBEDDING_JOBS: '/admin/embedding-jobs',
  ADMIN_QUERY_LOGS: '/admin/query-logs',
  ADMIN_SYSTEM_LOGS: '/admin/system-logs',
} as const

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Users endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ASSIGN_ROLES: (id: string) => `/users/${id}/roles`,
    UPDATE_STATUS: (id: string) => `/users/${id}/status`,
  },

  // Roles endpoints
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
    ASSIGN_PERMISSIONS: (id: string) => `/roles/${id}/permissions`,
  },

  // Permissions endpoints
  PERMISSIONS: {
    BASE: '/permissions',
    BY_ID: (id: string) => `/permissions/${id}`,
  },

  // Departments endpoints
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id: string) => `/departments/${id}`,
  },

  // Positions endpoints
  POSITIONS: {
    BASE: '/positions',
    BY_ID: (id: string) => `/positions/${id}`,
  },

  // Documents endpoints
  DOCUMENTS: {
    BASE: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
  },

  // Data Sources endpoints
  DATA_SOURCES: {
    BASE: '/data-sources',
    BY_ID: (id: string) => `/data-sources/${id}`,
    STATISTICS: '/data-sources/statistics',
    SYNC: (id: string) => `/data-sources/${id}/sync`,
    TEST: (id: string) => `/data-sources/${id}/test`,
  },

  // Embedding Jobs endpoints
  EMBEDDING_JOBS: {
    BASE: '/embedding-jobs',
    BY_ID: (id: string) => `/embedding-jobs/${id}`,
  },

  // Query Logs endpoints
  QUERY_LOGS: {
    BASE: '/query-logs',
    BY_ID: (id: string) => `/query-logs/${id}`,
    STATISTICS: '/query-logs/statistics',
  },

  // System Logs endpoints
  SYSTEM_LOGS: {
    BASE: '/system-logs',
    STATISTICS: '/system-logs/statistics',
    CLEAR: '/system-logs/clear',
  },

  // Uploads endpoints
  UPLOADS: {
    BASE: '/uploads',
    PRESIGNED: '/uploads/presigned-url',
    FILE_URL: '/uploads/file-url',
  },

  // User Profiles endpoints
  USER_PROFILES: {
    BASE: '/user-profiles',
    BY_USER_ID: (userId: string) => `/user-profiles/${userId}`,
  },
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const
