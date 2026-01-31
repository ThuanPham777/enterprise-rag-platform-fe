/**
 * Centralized Axios instance for API requests
 */

import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { env } from '../config/env'
import { STORAGE_KEYS } from '../config/constants'
import type { ApiError } from '../types'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // TODO: Add auth token to requests
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error: AxiosError<{ message?: string }>) => {
        // TODO: Implement token refresh logic
        if (error.response?.status === 401) {
            // Handle unauthorized - clear auth and redirect to login
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            // TODO: Redirect to login page
        }

        // Transform error to consistent format
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            code: error.code,
            status: error.response?.status,
        }

        return Promise.reject(apiError)
    }
)

export default apiClient
