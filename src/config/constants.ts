/**
 * Application-wide constants
 */

export const ROUTES = {
    // Public routes
    LOGIN: '/login',

    // Client routes
    HOME: '/',

    // Admin routes
    ADMIN: '/admin',
} as const

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },

    // TODO: Add more API endpoints as needed
} as const

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
} as const
