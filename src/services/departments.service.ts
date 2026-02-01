/**
 * Departments management service
 * Integrates with backend Departments API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '../types'

export const departmentsService = {
  /**
   * Get all departments
   */
  getAll: async (): Promise<Department[]> => {
    const response = await apiClient.get<ApiResponseDto<Department[]>>(
      API_ENDPOINTS.DEPARTMENTS.BASE
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch departments')
    }
    return response.data.data
  },

  /**
   * Get department by ID
   */
  getById: async (id: string): Promise<Department> => {
    const response = await apiClient.get<ApiResponseDto<Department>>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch department')
    }
    return response.data.data
  },

  /**
   * Create new department
   */
  create: async (data: CreateDepartmentRequest): Promise<Department> => {
    const response = await apiClient.post<ApiResponseDto<Department>>(
      API_ENDPOINTS.DEPARTMENTS.BASE,
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create department')
    }
    return response.data.data
  },

  /**
   * Update department
   */
  update: async (id: string, data: UpdateDepartmentRequest): Promise<Department> => {
    const response = await apiClient.put<ApiResponseDto<Department>>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update department')
    }
    return response.data.data
  },

  /**
   * Delete department
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(
      API_ENDPOINTS.DEPARTMENTS.BY_ID(id)
    )
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete department')
    }
  },
}
