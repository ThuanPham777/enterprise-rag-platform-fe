/**
 * Common types used across the application
 */

// Backend API Response format
export interface ApiResponseDto<T = unknown> {
    status: 'success' | 'error'
    message?: string
    data?: T
    errors?: any[]
}

// API Error types
export interface ApiError {
    message: string
    code?: string
    status?: number
}

// Route types
export interface RouteConfig {
    path: string
    element: React.ComponentType
    requiresAuth?: boolean
    requiresAdmin?: boolean
}
