/**
 * Positions management service
 * Integrates with backend Positions API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  Position,
  CreatePositionRequest,
  UpdatePositionRequest,
} from '../types'

export const positionsService = {
  /**
   * Get all positions
   */
  getAll: async (): Promise<Position[]> => {
    const response = await apiClient.get<ApiResponseDto<Position[]>>(API_ENDPOINTS.POSITIONS.BASE)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch positions')
    }
    return response.data.data
  },

  /**
   * Get position by ID
   */
  getById: async (id: string): Promise<Position> => {
    const response = await apiClient.get<ApiResponseDto<Position>>(
      API_ENDPOINTS.POSITIONS.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch position')
    }
    return response.data.data
  },

  /**
   * Create new position
   */
  create: async (data: CreatePositionRequest): Promise<Position> => {
    const response = await apiClient.post<ApiResponseDto<Position>>(
      API_ENDPOINTS.POSITIONS.BASE,
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create position')
    }
    return response.data.data
  },

  /**
   * Update position
   */
  update: async (id: string, data: UpdatePositionRequest): Promise<Position> => {
    const response = await apiClient.put<ApiResponseDto<Position>>(
      API_ENDPOINTS.POSITIONS.BY_ID(id),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update position')
    }
    return response.data.data
  },

  /**
   * Delete position
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(API_ENDPOINTS.POSITIONS.BY_ID(id))
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete position')
    }
  },
}
