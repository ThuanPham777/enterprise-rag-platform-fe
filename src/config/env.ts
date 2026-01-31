/**
 * Environment variables configuration
 * Access via Vite's import.meta.env
 */

interface EnvConfig {
    apiBaseUrl: string
    appName: string
    isDevelopment: boolean
    isProduction: boolean
}

export const env: EnvConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    appName: import.meta.env.VITE_APP_NAME || 'Enterprise RAG Platform',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
}

/**
 * Validate required environment variables
 * TODO: Add validation for production builds
 */
export const validateEnv = (): void => {
    // TODO: Implement environment variable validation
}
