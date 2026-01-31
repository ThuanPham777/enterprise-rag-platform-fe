/**
 * Global TypeScript type definitions
 */

// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'client' | 'admin'
  // TODO: Add more user fields as needed
}

// Auth types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

// API types
export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

// Route types
export interface RouteConfig {
  path: string
  element: React.ComponentType
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

// TODO: Add more type definitions as needed
