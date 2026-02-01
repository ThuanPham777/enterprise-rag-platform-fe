/**
 * Data Sources management service
 * Integrates with backend Data Sources API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  DataSource,
  DataSourceType,
  CreateDataSourceRequest,
  UpdateDataSourceRequest,
  DataSourceStatistics,
} from '../types'

export const dataSourcesService = {
  /**
   * Get all data sources
   */
  getAll: async (type?: DataSourceType): Promise<DataSource[]> => {
    const url = type
      ? `${API_ENDPOINTS.DATA_SOURCES.BASE}?type=${type}`
      : API_ENDPOINTS.DATA_SOURCES.BASE
    const response = await apiClient.get<ApiResponseDto<DataSource[]>>(url)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch data sources')
    }
    return response.data.data
  },

  /**
   * Get data source by ID
   */
  getById: async (id: string): Promise<DataSource> => {
    const response = await apiClient.get<ApiResponseDto<DataSource>>(
      API_ENDPOINTS.DATA_SOURCES.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch data source')
    }
    return response.data.data
  },

  /**
   * Get statistics
   */
  getStatistics: async (): Promise<DataSourceStatistics> => {
    const response = await apiClient.get<ApiResponseDto<DataSourceStatistics>>(
      API_ENDPOINTS.DATA_SOURCES.STATISTICS
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch statistics')
    }
    return response.data.data
  },

  /**
   * Create new data source
   */
  create: async (data: CreateDataSourceRequest): Promise<DataSource> => {
    const response = await apiClient.post<ApiResponseDto<DataSource>>(
      API_ENDPOINTS.DATA_SOURCES.BASE,
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create data source')
    }
    return response.data.data
  },

  /**
   * Update data source
   */
  update: async (id: string, data: UpdateDataSourceRequest): Promise<DataSource> => {
    const response = await apiClient.put<ApiResponseDto<DataSource>>(
      API_ENDPOINTS.DATA_SOURCES.BY_ID(id),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update data source')
    }
    return response.data.data
  },

  /**
   * Delete data source
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(
      API_ENDPOINTS.DATA_SOURCES.BY_ID(id)
    )
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete data source')
    }
  },

  /**
   * Sync data source
   */
  sync: async (id: string): Promise<void> => {
    const response = await apiClient.post<ApiResponseDto<null>>(API_ENDPOINTS.DATA_SOURCES.SYNC(id))
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to sync data source')
    }
  },

  /**
   * Test data source connection
   */
  test: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<ApiResponseDto<{ success: boolean; message: string }>>(
      API_ENDPOINTS.DATA_SOURCES.TEST(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to test connection')
    }
    return response.data.data
  },
}
