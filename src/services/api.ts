/**
 * Centralized Axios instance for API requests
 * Handles authentication, token refresh, and error handling
 */

import axios, {
    type AxiosInstance,
    AxiosError,
    type InternalAxiosRequestConfig,
    type AxiosResponse,
} from 'axios'
import { env } from '../config/env'
import { API_ENDPOINTS } from '../config/constants'
import type { ApiError, RefreshResponse, ApiResponseDto } from '../types'

// Store access token in memory (not localStorage for security)
let accessToken: string | null = null

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// Callback for forced logout when refresh fails
let onForcedLogout: (() => void) | null = null

/**
 * Set callback for forced logout
 * Called when refresh token fails
 */
export const setForcedLogoutCallback = (callback: () => void): void => {
    onForcedLogout = callback
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important: Include cookies (for refresh token)
})

/**
 * Set access token in memory
 */
export const setAccessToken = (token: string | null): void => {
    accessToken = token
}

/**
 * Get access token from memory
 */
export const getAccessToken = (): string | null => {
    return accessToken
}

/**
 * Clear access token from memory
 */
export const clearAccessToken = (): void => {
    accessToken = null
}

/**
 * Refresh access token using refresh token from cookie
 * Exported for use in authService to ensure concurrency handling
 */
export const refreshAccessToken = async (): Promise<string | null> => {
    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
        return refreshPromise
    }

    isRefreshing = true
    refreshPromise = (async () => {
        try {
            const response = await axios.post<ApiResponseDto<RefreshResponse>>(
                `${env.apiBaseUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
                {},
                {
                    withCredentials: true,
                },
            )

            if (response.data.status === 'success' && response.data.data) {
                const newToken = response.data.data.accessToken
                setAccessToken(newToken)
                return newToken
            }
            return null
        } catch (error) {
            // Refresh failed, clear token and trigger forced logout
            clearAccessToken()
            // Trigger forced logout callback if set
            if (onForcedLogout) {
                onForcedLogout()
            }
            return null
        } finally {
            isRefreshing = false
            refreshPromise = null
        }
    })()

    return refreshPromise
}

// Request interceptor
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add access token to requests from memory
        const token = getAccessToken()
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    },
)

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    async (error: AxiosError<{ message?: string }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }

        // Handle 401 Unauthorized - try to refresh token
        // Skip refresh attempt if this is already a refresh request to prevent infinite loop
        const isRefreshRequest = originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true

            // Attempt to refresh token
            const newToken = await refreshAccessToken()

            if (newToken && originalRequest.headers) {
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return apiClient(originalRequest)
            }

            // Refresh failed - forced logout already triggered in refreshAccessToken
            // Reject with 401 error
            const apiError: ApiError = {
                message: 'Token refresh failed. Please login again.',
                code: 'REFRESH_FAILED',
                status: 401,
            }
            return Promise.reject(apiError)
        }

        // Transform error to consistent format
        const apiError: ApiError = {
            message:
                error.response?.data?.message || error.message || 'An error occurred',
            code: error.code,
            status: error.response?.status,
        }

        return Promise.reject(apiError)
    },
)

export default apiClient
