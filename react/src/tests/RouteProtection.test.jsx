import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../composants/protectedroute'
import RoleBasedRoute from '../composants/rolebasedroute'

/**
 * Tests for Route Protection Components
 * Tests authentication and authorization logic
 */
describe('ProtectedRoute Component', () => {
    const mockNavigate = vi.fn()

    beforeEach(() => {
        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom')
            return {
                ...actual,
                Navigate: ({ to }) => {
                    mockNavigate(to)
                    return <div>Redirecting to {to}</div>
                }
            }
        })
    })

    it('should render children when authenticated', () => {
        // Mock authenticated user
        localStorage.setItem('accessToken', 'mock-token')

        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should redirect to login when not authenticated', () => {
        // Clear authentication
        localStorage.clear()

        render(
            <BrowserRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </BrowserRouter>
        )

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
        expect(screen.getByText(/redirecting to \//i)).toBeInTheDocument()
    })
})

describe('RoleBasedRoute Component', () => {
    it('should render children when user has required role', () => {
        const mockUser = {
            id: 1,
            email: 'admin@gmail.com',
            role: 'ROLE_ADMIN'
        }

        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('accessToken', 'mock-token')

        render(
            <BrowserRouter>
                <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                    <div>Admin Content</div>
                </RoleBasedRoute>
            </BrowserRouter>
        )

        expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    it('should redirect when user does not have required role', () => {
        const mockUser = {
            id: 2,
            email: 'user@gmail.com',
            role: 'ROLE_USER'
        }

        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('accessToken', 'mock-token')

        render(
            <BrowserRouter>
                <RoleBasedRoute allowedRoles={['ROLE_ADMIN']}>
                    <div>Admin Content</div>
                </RoleBasedRoute>
            </BrowserRouter>
        )

        expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    })

    it('should allow multiple roles', () => {
        const mockUser = {
            id: 3,
            email: 'medecin@gmail.com',
            role: 'ROLE_MEDECIN'
        }

        localStorage.setItem('user', JSON.stringify(mockUser))
        localStorage.setItem('accessToken', 'mock-token')

        render(
            <BrowserRouter>
                <RoleBasedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MEDECIN']}>
                    <div>Medical Content</div>
                </RoleBasedRoute>
            </BrowserRouter>
        )

        expect(screen.getByText('Medical Content')).toBeInTheDocument()
    })
})
