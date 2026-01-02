import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { authService } from '../config/authService'

// Mock axios
vi.mock('axios')

/**
 * Tests for Authentication Service
 * Tests login, logout, token management, and API calls
 */
describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully and store tokens', async () => {
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 1,
            email: 'admin@gmail.com',
            role: 'ROLE_ADMIN'
          }
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      const result = await authService.login('admin@gmail.com', 'administrateur')

      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'admin@gmail.com',
        password: 'administrateur'
      })
      expect(localStorage.getItem('accessToken')).toBe('mock-access-token')
      expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token')
      expect(result.user.email).toBe('admin@gmail.com')
    })

    it('should throw error on login failure', async () => {
      axios.post.mockRejectedValue(new Error('Invalid credentials'))

      await expect(
        authService.login('wrong@email.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials')

      expect(localStorage.getItem('accessToken')).toBeNull()
    })
  })

  describe('logout', () => {
    it('should clear tokens on logout', () => {
      localStorage.setItem('accessToken', 'mock-token')
      localStorage.setItem('refreshToken', 'mock-refresh')

      authService.logout()

      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('accessToken', 'mock-token')

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('accessToken', 'mock-token')

      expect(authService.getToken()).toBe('mock-token')
    })

    it('should return null when no token', () => {
      expect(authService.getToken()).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      localStorage.setItem('refreshToken', 'old-refresh-token')

      const mockResponse = {
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token'
        }
      }

      axios.post.mockResolvedValue(mockResponse)

      await authService.refreshToken()

      expect(axios.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refreshToken: 'old-refresh-token'
      })
      expect(localStorage.getItem('accessToken')).toBe('new-access-token')
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token')
    })

    it('should logout on refresh failure', async () => {
      localStorage.setItem('refreshToken', 'invalid-token')
      axios.post.mockRejectedValue(new Error('Invalid refresh token'))

      await expect(authService.refreshToken()).rejects.toThrow()

      expect(localStorage.getItem('accessToken')).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user from localStorage', () => {
      const mockUser = {
        id: 1,
        email: 'admin@gmail.com',
        role: 'ROLE_ADMIN'
      }

      localStorage.setItem('user', JSON.stringify(mockUser))

      const user = authService.getCurrentUser()

      expect(user).toEqual(mockUser)
    })

    it('should return null when no user stored', () => {
      expect(authService.getCurrentUser()).toBeNull()
    })
  })

  describe('hasRole', () => {
    it('should return true when user has role', () => {
      const mockUser = {
        id: 1,
        email: 'admin@gmail.com',
        role: 'ROLE_ADMIN'
      }

      localStorage.setItem('user', JSON.stringify(mockUser))

      expect(authService.hasRole('ROLE_ADMIN')).toBe(true)
    })

    it('should return false when user does not have role', () => {
      const mockUser = {
        id: 1,
        email: 'user@gmail.com',
        role: 'ROLE_USER'
      }

      localStorage.setItem('user', JSON.stringify(mockUser))

      expect(authService.hasRole('ROLE_ADMIN')).toBe(false)
    })

    it('should return false when no user', () => {
      expect(authService.hasRole('ROLE_ADMIN')).toBe(false)
    })
  })
})
