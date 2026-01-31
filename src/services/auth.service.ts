/**
 * Authentication service
 * Integrates with backend auth API
 */

import apiClient, { refreshAccessToken } from './api'
import { API_ENDPOINTS } from '../config/constants'
import type {
    LoginCredentials,
    RegisterCredentials,
    LoginResponse,
    RefreshResponse,
    RegisterResponse,
    User,
    ApiResponseDto,
} from '../types'

export const authService = {
    /**
     * Login user
     * Returns access token (refresh token is stored in httpOnly cookie by backend)
     */
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponseDto<LoginResponse>>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials,
        )
        if (response.data.status === 'error' || !response.data.data) {
            throw new Error(response.data.message || 'Login failed')
        }
        return response.data.data
    },

    /**
     * Register new user
     */
    register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
        const response = await apiClient.post<ApiResponseDto<RegisterResponse>>(
            API_ENDPOINTS.AUTH.REGISTER,
            credentials,
        )
        if (response.data.status === 'error' || !response.data.data) {
            throw new Error(response.data.message || 'Registration failed')
        }
        return response.data.data
    },

    /**
     * Logout user
     * Revokes refresh token and clears cookie
     */
    logout: async (): Promise<void> => {
        try {
            await apiClient.post<ApiResponseDto<null>>(API_ENDPOINTS.AUTH.LOGOUT)
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API call failed:', error)
        }
    },

    /**
     * Get current user
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<ApiResponseDto<User>>(API_ENDPOINTS.AUTH.ME)
        if (response.data.status === 'error' || !response.data.data) {
            throw new Error(response.data.message || 'Failed to get current user')
        }
        return response.data.data
    },

    /**
     * Refresh access token
     * Uses refresh token from httpOnly cookie automatically
     * Uses internal refreshAccessToken to ensure concurrency handling
     */
    refreshToken: async (): Promise<RefreshResponse> => {
        // Use internal refreshAccessToken function for concurrency handling
        const newToken = await refreshAccessToken()
        if (!newToken) {
            throw new Error('Token refresh failed')
        }
        return { accessToken: newToken }
    },
}
