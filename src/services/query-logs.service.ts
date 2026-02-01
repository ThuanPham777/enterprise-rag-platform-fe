/**
 * Query Logs service
 * Integrates with backend Query Logs API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponseDto, QueryLog, QueryLogFilter, QueryLogStatistics } from '../types'

export const queryLogsService = {
  /**
   * Get all query logs with optional filters
   */
  getAll: async (filter?: QueryLogFilter): Promise<QueryLog[]> => {
    const params = new URLSearchParams()
    if (filter?.userId) params.append('userId', filter.userId)
    if (filter?.startDate) params.append('startDate', filter.startDate)
    if (filter?.endDate) params.append('endDate', filter.endDate)

    const url = params.toString()
      ? `${API_ENDPOINTS.QUERY_LOGS.BASE}?${params.toString()}`
      : API_ENDPOINTS.QUERY_LOGS.BASE

    const response = await apiClient.get<ApiResponseDto<QueryLog[]>>(url)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch query logs')
    }
    return response.data.data
  },

  /**
   * Get query log by ID
   */
  getById: async (id: string): Promise<QueryLog> => {
    const response = await apiClient.get<ApiResponseDto<QueryLog>>(
      API_ENDPOINTS.QUERY_LOGS.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch query log')
    }
    return response.data.data
  },

  /**
   * Get statistics
   */
  getStatistics: async (startDate?: string, endDate?: string): Promise<QueryLogStatistics> => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const url = params.toString()
      ? `${API_ENDPOINTS.QUERY_LOGS.STATISTICS}?${params.toString()}`
      : API_ENDPOINTS.QUERY_LOGS.STATISTICS

    const response = await apiClient.get<ApiResponseDto<QueryLogStatistics>>(url)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch statistics')
    }
    return response.data.data
  },

  /**
   * Delete query log
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(
      API_ENDPOINTS.QUERY_LOGS.BY_ID(id)
    )
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete query log')
    }
  },
}
