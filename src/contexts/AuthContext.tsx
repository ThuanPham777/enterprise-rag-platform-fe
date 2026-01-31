/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 * Integrates with backend auth API
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from '../types'
import { authService } from '../services/auth.service'
import {
  setAccessToken,
  clearAccessToken,
  getAccessToken,
  setForcedLogoutCallback,
} from '../services/api'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>
  register: (credentials: RegisterCredentials) => Promise<User>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Flag to prevent multiple simultaneous checkAuth calls
  const isCheckingAuth = useRef(false)

  /**
   * Login user
   * Stores access token in memory (refresh token is in httpOnly cookie)
   * Returns user object for role-based redirect
   */
  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true)
      const response = await authService.login(credentials)

      // Store access token in memory (not localStorage for security)
      setAccessToken(response.accessToken)

      // Get user info
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(true)

      // Return user for role-based redirect
      return currentUser
    } catch (error: any) {
      console.error('Login failed:', error)
      clearAccessToken()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register new user
   * Returns user object after auto-login
   */
  const register = async (credentials: RegisterCredentials): Promise<User> => {
    try {
      setIsLoading(true)
      await authService.register(credentials)
      // After registration, automatically log in
      const user = await login({
        email: credentials.email,
        password: credentials.password,
      })
      return user
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout user
   * Clears tokens
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Clear local state regardless of API call result
      clearAccessToken()
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  /**
   * Check authentication status
   * If access token exists in memory, validates it and gets current user
   * If no access token but refresh token cookie exists, attempts to refresh
   * This handles page refresh scenario where memory is cleared but cookie persists
   */
  const checkAuth = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous checkAuth calls
    if (isCheckingAuth.current) {
      return
    }

    isCheckingAuth.current = true

    try {
      setIsLoading(true)
      let token = getAccessToken()

      // If no access token in memory, try to refresh using refresh token cookie
      // This handles page refresh scenario
      if (!token) {
        try {
          const refreshResponse = await authService.refreshToken()
          token = refreshResponse.accessToken
          setAccessToken(token)
        } catch (refreshError) {
          // Refresh failed - no valid refresh token, user needs to login
          clearAccessToken()
          setIsAuthenticated(false)
          setUser(null)
          setIsLoading(false)
          isCheckingAuth.current = false
          return
        }
      }

      // Validate token and get current user
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      clearAccessToken()
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
      isCheckingAuth.current = false
    }
  }, [])

  // Set up forced logout callback for when refresh token fails
  useEffect(() => {
    setForcedLogoutCallback(() => {
      // Force logout when refresh token fails
      clearAccessToken()
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    })

    // Cleanup on unmount
    return () => {
      setForcedLogoutCallback(() => { })
    }
  }, [])

  // Check auth on mount - only once
  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run on mount

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
