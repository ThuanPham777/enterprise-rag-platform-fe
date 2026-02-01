/**
 * Documents management service
 * Integrates with backend Documents API
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponseDto,
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from '../types'

export const documentsService = {
  /**
   * Get all documents
   */
  getAll: async (): Promise<Document[]> => {
    const response = await apiClient.get<ApiResponseDto<Document[]>>(API_ENDPOINTS.DOCUMENTS.BASE)
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch documents')
    }
    return response.data.data
  },

  /**
   * Get document by ID
   */
  getById: async (id: string): Promise<Document> => {
    const response = await apiClient.get<ApiResponseDto<Document>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(id)
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch document')
    }
    return response.data.data
  },

  /**
   * Create new document
   */
  create: async (data: CreateDocumentRequest): Promise<Document> => {
    const response = await apiClient.post<ApiResponseDto<Document>>(
      API_ENDPOINTS.DOCUMENTS.BASE,
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create document')
    }
    return response.data.data
  },

  /**
   * Update document
   */
  update: async (id: string, data: UpdateDocumentRequest): Promise<Document> => {
    const response = await apiClient.put<ApiResponseDto<Document>>(
      API_ENDPOINTS.DOCUMENTS.BY_ID(id),
      data
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update document')
    }
    return response.data.data
  },

  /**
   * Delete document
   */
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponseDto<null>>(API_ENDPOINTS.DOCUMENTS.BY_ID(id))
    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Failed to delete document')
    }
  },
}
