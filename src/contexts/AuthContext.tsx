/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 * TODO: Implement actual authentication logic
 */

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, AuthState, LoginCredentials } from '../types'
import { authService } from '../services/auth.service'
import { STORAGE_KEYS } from '../config/constants'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
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

  /**
   * Login user
   * TODO: Implement actual login logic
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true)
      // TODO: Call authService.login and handle response
      const response = await authService.login(credentials)

      // TODO: Store tokens and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token)
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      }
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user))

      setUser(response.user)
      setIsAuthenticated(true)
    } catch (error) {
      // TODO: Handle error properly
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout user
   * TODO: Implement actual logout logic
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      // TODO: Call authService.logout
      await authService.logout()
    } catch (error) {
      // TODO: Handle error properly
      console.error('Logout failed:', error)
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  /**
   * Check authentication status
   * TODO: Implement actual auth check logic
   */
  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)

      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      // TODO: Validate token and get current user
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(true)
    } catch (error) {
      // TODO: Handle error properly
      console.error('Auth check failed:', error)
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
