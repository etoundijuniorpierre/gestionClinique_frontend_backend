import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PageLogin from '../pages/pagelogin'

/**
 * Tests for Login Page Component
 * Tests rendering, user interactions, and form validation
 */
describe('PageLogin Component', () => {
    const renderWithRouter = (component) => {
        return render(
            <BrowserRouter>
                {component}
            </BrowserRouter>
        )
    }

    it('should render login form', () => {
        renderWithRouter(<PageLogin />)

        expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
    })

    it('should update email input value', () => {
        renderWithRouter(<PageLogin />)

        const emailInput = screen.getByLabelText(/email/i)
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

        expect(emailInput.value).toBe('test@example.com')
    })

    it('should update password input value', () => {
        renderWithRouter(<PageLogin />)

        const passwordInput = screen.getByLabelText(/mot de passe/i)
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        expect(passwordInput.value).toBe('password123')
    })

    it('should show validation error for empty email', async () => {
        renderWithRouter(<PageLogin />)

        const submitButton = screen.getByRole('button', { name: /se connecter/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/email requis/i)).toBeInTheDocument()
        })
    })

    it('should show validation error for invalid email format', async () => {
        renderWithRouter(<PageLogin />)

        const emailInput = screen.getByLabelText(/email/i)
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

        const submitButton = screen.getByRole('button', { name: /se connecter/i })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/email invalide/i)).toBeInTheDocument()
        })
    })

    it('should toggle password visibility', () => {
        renderWithRouter(<PageLogin />)

        const passwordInput = screen.getByLabelText(/mot de passe/i)
        const toggleButton = screen.getByRole('button', { name: /afficher/i })

        expect(passwordInput.type).toBe('password')

        fireEvent.click(toggleButton)
        expect(passwordInput.type).toBe('text')

        fireEvent.click(toggleButton)
        expect(passwordInput.type).toBe('password')
    })

    it('should call login API on form submit', async () => {
        const mockLogin = vi.fn()
        vi.mock('../services/authService', () => ({
            login: mockLogin
        }))

        renderWithRouter(<PageLogin />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/mot de passe/i)
        const submitButton = screen.getByRole('button', { name: /se connecter/i })

        fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } })
        fireEvent.change(passwordInput, { target: { value: 'administrateur' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'admin@gmail.com',
                password: 'administrateur'
            })
        })
    })

    it('should display error message on login failure', async () => {
        const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'))
        vi.mock('../services/authService', () => ({
            login: mockLogin
        }))

        renderWithRouter(<PageLogin />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/mot de passe/i)
        const submitButton = screen.getByRole('button', { name: /se connecter/i })

        fireEvent.change(emailInput, { target: { value: 'wrong@email.com' } })
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument()
        })
    })

    it('should disable submit button while loading', async () => {
        renderWithRouter(<PageLogin />)

        const submitButton = screen.getByRole('button', { name: /se connecter/i })

        expect(submitButton).not.toBeDisabled()

        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(submitButton).toBeDisabled()
        })
    })

    it('should have proper accessibility attributes', () => {
        renderWithRouter(<PageLogin />)

        const emailInput = screen.getByLabelText(/email/i)
        const passwordInput = screen.getByLabelText(/mot de passe/i)

        expect(emailInput).toHaveAttribute('type', 'email')
        expect(emailInput).toHaveAttribute('required')
        expect(passwordInput).toHaveAttribute('type', 'password')
        expect(passwordInput).toHaveAttribute('required')
    })
})
