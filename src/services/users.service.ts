/**
 * Users management service
 * Integrates with backend Users API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  AdminUser,
  AssignRolesRequest,
  UpdateUserStatusRequest,
} from '../types'

export const usersService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get<ApiResponseDto<AdminUser[]>>(API_ENDPOINTS.USERS.BASE)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch users')
    }
    return response.data.data
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get<ApiResponseDto<AdminUser>>(API_ENDPOINTS.USERS.BY_ID(id))
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user')
    }
    return response.data.data
  },

  /**
   * Assign roles to user
   */
  assignRoles: async (userId: string, data: AssignRolesRequest): Promise<void> => {
    const response = await apiClient.post<ApiResponseDto<null>>(
      API_ENDPOINTS.USERS.ASSIGN_ROLES(userId),
      data
    )
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to assign roles')
    }
  },

  /**
   * Update user status
   */
  updateStatus: async (userId: string, data: UpdateUserStatusRequest): Promise<AdminUser> => {
    const response = await apiClient.patch<ApiResponseDto<AdminUser>>(
      API_ENDPOINTS.USERS.UPDATE_STATUS(userId),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update status')
    }
    return response.data.data
  },
}
