/**
 * Roles management service
 * Integrates with backend Roles API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from '../types'

export const rolesService = {
  /**
   * Get all roles
   */
  getAll: async (): Promise<Role[]> => {
    const response = await apiClient.get<ApiResponseDto<Role[]>>(API_ENDPOINTS.ROLES.BASE)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch roles')
    }
    return response.data.data
  },

  /**
   * Get role by ID
   */
  getById: async (id: string): Promise<Role> => {
    const response = await apiClient.get<ApiResponseDto<Role>>(API_ENDPOINTS.ROLES.BY_ID(id))
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch role')
    }
    return response.data.data
  },

  /**
   * Create new role
   */
  create: async (data: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post<ApiResponseDto<Role>>(API_ENDPOINTS.ROLES.BASE, data)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create role')
    }
    return response.data.data
  },

  /**
   * Update role
   */
  update: async (id: string, data: UpdateRoleRequest): Promise<Role> => {
    const response = await apiClient.put<ApiResponseDto<Role>>(API_ENDPOINTS.ROLES.BY_ID(id), data)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update role')
    }
    return response.data.data
  },

  /**
   * Delete role
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(API_ENDPOINTS.ROLES.BY_ID(id))
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete role')
    }
  },

  /**
   * Assign permissions to role
   */
  assignPermissions: async (roleId: string, data: AssignPermissionsRequest): Promise<Role> => {
    const response = await apiClient.post<ApiResponseDto<Role>>(
      API_ENDPOINTS.ROLES.ASSIGN_PERMISSIONS(roleId),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to assign permissions')
    }
    return response.data.data
  },
}
