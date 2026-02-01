/**
 * Uploads service
 * Handles file uploads to backend
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiResponseDto } from '../types'

interface PresignedUrlResponse {
  url: string
  key: string
  fileUrl: string
}

export const uploadsService = {
  /**
   * Get presigned URL for uploading file to S3
   */
  getPresignedUrl: async (fileName: string, fileType: string): Promise<PresignedUrlResponse> => {
    const response = await apiClient.post<ApiResponseDto<PresignedUrlResponse>>(
      API_ENDPOINTS.UPLOADS.PRESIGNED,
      { fileName, fileType }
    )
    if (response.data.status === 'error' || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get presigned URL')
    }
    return response.data.data
  },

  /**
   * Upload file to S3 using presigned URL
   */
  uploadToS3: async (url: string, file: File): Promise<void> => {
    await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })
  },

  /**
   * Complete upload flow: get presigned URL, upload to S3, return file path
   */
  uploadFile: async (file: File): Promise<string> => {
    // 1. Get presigned URL
    const { url, fileUrl } = await uploadsService.getPresignedUrl(file.name, file.type)

    // 2. Upload to S3
    await uploadsService.uploadToS3(url, file)

    // 3. Return file URL/path for storing in database
    return fileUrl
  },
}
