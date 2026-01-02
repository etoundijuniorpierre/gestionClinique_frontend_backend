import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import FormulairePatient from '../../composants/administrateur/formulairepatient'
import { createMockPatient, setupMockAuth, mockUsers } from '../mocks/mockData'

/**
 * Tests for Patient Form Component (Add/Edit)
 * Tests form rendering, validation, submission
 */
describe('FormulairePatient Component', () => {
    const mockNavigate = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.admin)
        vi.clearAllMocks()

        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom')
            return {
                ...actual,
                useNavigate: () => mockNavigate,
                useParams: () => ({ id: null })
            }
        })
    })

    const renderForm = () => {
        return render(
            <BrowserRouter>
                <FormulairePatient />
            </BrowserRouter>
        )
    }

    describe('Form Rendering', () => {
        it('should render form title', () => {
            renderForm()
            expect(screen.getByText(/ajouter un patient/i)).toBeInTheDocument()
        })

        it('should render all form fields', () => {
            renderForm()
            expect(screen.getByLabelText(/nom/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/date de naissance/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/genre/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/adresse/i)).toBeInTheDocument()
        })

        it('should render submit and cancel buttons', () => {
            renderForm()
            expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument()
        })
    })

    describe('Form Validation', () => {
        it('should show error for empty nom', async () => {
            renderForm()

            const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(screen.getByText(/nom est requis/i)).toBeInTheDocument()
            })
        })

        it('should show error for empty prenom', async () => {
            renderForm()

            const nomInput = screen.getByLabelText(/nom/i)
            fireEvent.change(nomInput, { target: { value: 'Test' } })

            const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(screen.getByText(/prénom est requis/i)).toBeInTheDocument()
            })
        })

        it('should validate email format', async () => {
            renderForm()

            const emailInput = screen.getByLabelText(/email/i)
            fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
            fireEvent.blur(emailInput)

            await waitFor(() => {
                expect(screen.getByText(/email invalide/i)).toBeInTheDocument()
            })
        })

        it('should validate phone format', async () => {
            renderForm()

            const phoneInput = screen.getByLabelText(/téléphone/i)
            fireEvent.change(phoneInput, { target: { value: '123' } })
            fireEvent.blur(phoneInput)

            await waitFor(() => {
                expect(screen.getByText(/téléphone invalide/i)).toBeInTheDocument()
            })
        })

        it('should validate date of birth', async () => {
            renderForm()

            const dateInput = screen.getByLabelText(/date de naissance/i)
            const futureDate = new Date()
            futureDate.setFullYear(futureDate.getFullYear() + 1)

            fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } })
            fireEvent.blur(dateInput)

            await waitFor(() => {
                expect(screen.getByText(/date invalide/i)).toBeInTheDocument()
            })
        })
    })

    describe('Form Submission', () => {
        it('should submit form with valid data', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(createMockPatient())
                })
            )

            renderForm()

            fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Nguemo' } })
            fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'Jean' } })
            fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jean@email.com' } })
            fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '677000001' } })
            fireEvent.change(screen.getByLabelText(/date de naissance/i), { target: { value: '1990-01-01' } })
            fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'M' } })
            fireEvent.change(screen.getByLabelText(/adresse/i), { target: { value: 'Yaoundé' } })

            const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/api/patients'),
                    expect.objectContaining({
                        method: 'POST',
                        headers: expect.objectContaining({
                            'Content-Type': 'application/json'
                        })
                    })
                )
            })
        })

        it('should navigate back after successful submission', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(createMockPatient())
                })
            )

            renderForm()

            // Fill form with valid data
            fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Test' } })
            fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'User' } })
            fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@email.com' } })

            const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/admin/patients')
            })
        })

        it('should show error message on submission failure', async () => {
            global.fetch = vi.fn(() => Promise.reject(new Error('Server error')))

            renderForm()

            // Fill form
            fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Test' } })
            fireEvent.change(screen.getByLabelText(/prénom/i), { target: { value: 'User' } })

            const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(screen.getByText(/erreur lors de l'enregistrement/i)).toBeInTheDocument()
            })
        })
    })

    describe('Cancel Button', () => {
        it('should navigate back on cancel', () => {
            renderForm()

            const cancelBtn = screen.getByRole('button', { name: /annuler/i })
            fireEvent.click(cancelBtn)

            expect(mockNavigate).toHaveBeenCalledWith('/admin/patients')
        })

        it('should show confirmation dialog if form is dirty', async () => {
            renderForm()

            // Make form dirty
            fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Test' } })

            const cancelBtn = screen.getByRole('button', { name: /annuler/i })
            fireEvent.click(cancelBtn)

            await waitFor(() => {
                expect(screen.getByText(/modifications non enregistrées/i)).toBeInTheDocument()
            })
        })
    })

    describe('Auto-calculate Age', () => {
        it('should calculate age from date of birth', async () => {
            renderForm()

            const dateInput = screen.getByLabelText(/date de naissance/i)
            fireEvent.change(dateInput, { target: { value: '1990-01-01' } })

            await waitFor(() => {
                const ageDisplay = screen.getByText(/âge:/i)
                expect(ageDisplay).toHaveTextContent('34') // 2026 - 1990
            })
        })
    })

    describe('Accessibility', () => {
        it('should have proper labels for all inputs', () => {
            renderForm()

            const inputs = screen.getAllByRole('textbox')
            inputs.forEach(input => {
                expect(input).toHaveAccessibleName()
            })
        })

        it('should have required attributes', () => {
            renderForm()

            expect(screen.getByLabelText(/nom/i)).toHaveAttribute('required')
            expect(screen.getByLabelText(/prénom/i)).toHaveAttribute('required')
            expect(screen.getByLabelText(/email/i)).toHaveAttribute('required')
        })
    })
})
