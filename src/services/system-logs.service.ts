/**
 * System Logs service
 * Integrates with backend System Logs API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponseDto, SystemLog, SystemLogFilter, SystemLogStatistics } from '../types'

export const systemLogsService = {
  /**
   * Get all system logs with optional filters
   */
  getAll: async (filter?: SystemLogFilter): Promise<SystemLog[]> => {
    const params = new URLSearchParams()
    if (filter?.level) params.append('level', filter.level)
    if (filter?.startDate) params.append('startDate', filter.startDate)
    if (filter?.endDate) params.append('endDate', filter.endDate)
    if (filter?.search) params.append('search', filter.search)

    const url = params.toString()
      ? `${API_ENDPOINTS.SYSTEM_LOGS.BASE}?${params.toString()}`
      : API_ENDPOINTS.SYSTEM_LOGS.BASE

    const response = await apiClient.get<ApiResponseDto<SystemLog[]>>(url)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch system logs')
    }
    return response.data.data
  },

  /**
   * Get statistics
   */
  getStatistics: async (startDate?: string, endDate?: string): Promise<SystemLogStatistics> => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    const url = params.toString()
      ? `${API_ENDPOINTS.SYSTEM_LOGS.STATISTICS}?${params.toString()}`
      : API_ENDPOINTS.SYSTEM_LOGS.STATISTICS

    const response = await apiClient.get<ApiResponseDto<SystemLogStatistics>>(url)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch statistics')
    }
    return response.data.data
  },

  /**
   * Clear old logs
   */
  clear: async (before?: string): Promise<{ deletedCount: number }> => {
    const params = before ? `?before=${before}` : ''
    const response = await apiClient.delete<ApiResponseDto<{ deletedCount: number }>>(
      `${API_ENDPOINTS.SYSTEM_LOGS.CLEAR}${params}`
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to clear logs')
    }
    return response.data.data
  },
}
