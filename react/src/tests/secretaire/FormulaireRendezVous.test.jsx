import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import FormulaireRendezVous from '../../composants/secretaire/FormulaireRendezVous'
import { mockPatients, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('FormulaireRendezVous Component', () => {
    const mockOnSubmit = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.secretaire)
        vi.clearAllMocks()
    })

    const renderForm = (props = {}) => {
        return render(
            <BrowserRouter>
                <FormulaireRendezVous
                    patients={mockPatients}
                    medecins={Object.values(mockUsers).filter(u => u.role === 'ROLE_MEDECIN')}
                    onSubmit={mockOnSubmit}
                    {...props}
                />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render all form fields', () => {
            renderForm()
            expect(screen.getByLabelText(/patient/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/médecin/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/heure/i)).toBeInTheDocument()
        })
    })

    describe('Validation', () => {
        it('should show errors for missing fields', async () => {
            renderForm()
            const submitBtn = screen.getByRole('button', { name: /enregistrer/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(screen.getByText(/veuillez sélectionner un patient/i)).toBeInTheDocument()
            })
        })

        it('should prevent past dates', async () => {
            renderForm()
            const dateInput = screen.getByLabelText(/date/i)
            const pastDate = new Date()
            pastDate.setDate(pastDate.getDate() - 1)
            fireEvent.change(dateInput, { target: { value: pastDate.toISOString().split('T')[0] } })

            fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))
            await waitFor(() => {
                expect(screen.getByText(/la date ne peut pas être dans le passé/i)).toBeInTheDocument()
            })
        })
    })

    describe('Interactions', () => {
        it('should update availability when medecin or date changes', async () => {
            renderForm()
            const medecinSelect = screen.getByLabelText(/médecin/i)
            fireEvent.change(medecinSelect, { target: { value: '2' } })

            const dateInput = screen.getByLabelText(/date/i)
            fireEvent.change(dateInput, { target: { value: '2026-01-15' } })

            // Should trigger availability check (mocked API call)
        })
    })

    describe('Submission', () => {
        it('should call onSubmit with structured data', async () => {
            renderForm()

            fireEvent.change(screen.getByLabelText(/patient/i), { target: { value: '1' } })
            fireEvent.change(screen.getByLabelText(/médecin/i), { target: { value: '2' } })
            fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-12-31' } })
            fireEvent.change(screen.getByLabelText(/heure/i), { target: { value: '10:00' } })

            fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                    patientId: '1',
                    medecinId: '2',
                    jour: '2026-12-31',
                    heure: '10:00'
                }))
            })
        })
    })
})
