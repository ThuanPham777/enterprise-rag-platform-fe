/**
 * Permissions management service
 * Integrates with backend Permissions API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from '../types'

export const permissionsService = {
  /**
   * Get all permissions
   */
  getAll: async (): Promise<Permission[]> => {
    const response = await apiClient.get<ApiResponseDto<Permission[]>>(
      API_ENDPOINTS.PERMISSIONS.BASE
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch permissions')
    }
    return response.data.data
  },

  /**
   * Get permission by ID
   */
  getById: async (id: string): Promise<Permission> => {
    const response = await apiClient.get<ApiResponseDto<Permission>>(
      API_ENDPOINTS.PERMISSIONS.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch permission')
    }
    return response.data.data
  },

  /**
   * Create new permission
   */
  create: async (data: CreatePermissionRequest): Promise<Permission> => {
    const response = await apiClient.post<ApiResponseDto<Permission>>(
      API_ENDPOINTS.PERMISSIONS.BASE,
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create permission')
    }
    return response.data.data
  },

  /**
   * Update permission
   */
  update: async (id: string, data: UpdatePermissionRequest): Promise<Permission> => {
    const response = await apiClient.put<ApiResponseDto<Permission>>(
      API_ENDPOINTS.PERMISSIONS.BY_ID(id),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update permission')
    }
    return response.data.data
  },

  /**
   * Delete permission
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(
      API_ENDPOINTS.PERMISSIONS.BY_ID(id)
    )
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete permission')
    }
  },
}
