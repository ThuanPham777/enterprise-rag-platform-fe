/**
 * User types
 * Matches backend User and MeResponseDto
 */

export interface User {
    id: string
    email: string
    status: string
    roles: string[]
    permissions: string[]
    createdAt: Date | null
}
