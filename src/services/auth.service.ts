/**
 * Authentication service
 * TODO: Implement actual authentication API calls
 */

import apiClient from './api'
import { API_ENDPOINTS } from '../config/constants'
import type { LoginCredentials, AuthResponse, User } from '../types'

export const authService = {
    /**
     * Login user
     * TODO: Implement login API call
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        // TODO: Replace with actual API call
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
        return response.data
    },

    /**
     * Logout user
     * TODO: Implement logout API call
     */
    logout: async (): Promise<void> => {
        // TODO: Replace with actual API call
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    },

    /**
     * Get current user
     * TODO: Implement get current user API call
     */
    getCurrentUser: async (): Promise<User> => {
        // TODO: Replace with actual API call
        const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME)
        return response.data
    },

    /**
     * Refresh access token
     * TODO: Implement token refresh API call
     */
    refreshToken: async (): Promise<AuthResponse> => {
        // TODO: Replace with actual API call
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH)
        return response.data
    },
}
