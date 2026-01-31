/**
 * Custom hook for login form
 * Handles form setup, validation, and submission logic
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../config/constants'

// Zod schema for login form validation
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const useLoginForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        ROUTES.HOME

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            // Login and get user object
            const user = await login(data)

            // Redirect based on user role
            if (user?.roles?.includes('ADMIN')) {
                navigate(ROUTES.ADMIN, { replace: true })
            } else {
                navigate(from, { replace: true })
            }
        } catch (error: any) {
            // Handle error - show error message
            const errorMessage =
                error?.message || 'Login failed. Please check your credentials.'
            form.setError('root', {
                type: 'manual',
                message: errorMessage,
            })
        }
    }

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
    }
}
