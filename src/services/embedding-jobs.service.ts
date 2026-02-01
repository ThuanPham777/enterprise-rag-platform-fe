/**
 * Embedding Jobs management service
 * Integrates with backend Embedding Jobs API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponseDto, EmbeddingJob, EmbeddingJobStatus } from '../types'

export const embeddingJobsService = {
  /**
   * Get all embedding jobs
   */
  getAll: async (status?: EmbeddingJobStatus): Promise<EmbeddingJob[]> => {
    const url = status
      ? `${API_ENDPOINTS.EMBEDDING_JOBS.BASE}?status=${status}`
      : API_ENDPOINTS.EMBEDDING_JOBS.BASE
    const response = await apiClient.get<ApiResponseDto<EmbeddingJob[]>>(url)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch embedding jobs')
    }
    return response.data.data
  },

  /**
   * Get embedding job by ID
   */
  getById: async (id: string): Promise<EmbeddingJob> => {
    const response = await apiClient.get<ApiResponseDto<EmbeddingJob>>(
      API_ENDPOINTS.EMBEDDING_JOBS.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch embedding job')
    }
    return response.data.data
  },

  /**
   * Delete embedding job
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(
      API_ENDPOINTS.EMBEDDING_JOBS.BY_ID(id)
    )
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete embedding job')
    }
  },
}
