/**
 * Authentication types
 */

import type { User } from '../user'

// Auth state
export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

// Login credentials
export interface LoginCredentials {
    email: string
    password: string
}

// Register credentials
export interface RegisterCredentials {
    email: string
    password: string
    fullName?: string
}

// Login response - matches backend LoginResponseDto
export interface LoginResponse {
    accessToken: string
}

// Refresh response - matches backend RefreshResponseDto
export interface RefreshResponse {
    accessToken: string
}

// Register response - matches backend RegisterResponseDto
export interface RegisterResponse {
    id: string
    email: string
    fullName: string | null
    status: string
    createdAt: Date | null
}
