import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import FormulaireConsultation from '../../composants/medecin/FormulaireConsultation'
import { mockRendezVous, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('FormulaireConsultation Component', () => {
    const mockOnSubmit = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderForm = (props = {}) => {
        return render(
            <BrowserRouter>
                <FormulaireConsultation
                    rendezVous={mockRendezVous[0]}
                    onSubmit={mockOnSubmit}
                    {...props}
                />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render patient info', () => {
            renderForm()
            expect(screen.getByText(mockRendezVous[0].patient.nom)).toBeInTheDocument()
        })

        it('should render vital signs fields', () => {
            renderForm()
            expect(screen.getByLabelText(/tension/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/température/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/poids/i)).toBeInTheDocument()
        })

        it('should render clinical notes fields', () => {
            renderForm()
            expect(screen.getByLabelText(/motifs/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/diagnostic/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/compte-rendu/i)).toBeInTheDocument()
        })
    })

    describe('Validations', () => {
        it('should show error for invalid vital signs', async () => {
            renderForm()
            const tempInput = screen.getByLabelText(/température/i)
            fireEvent.change(tempInput, { target: { value: '50' } }) // Fever too high

            const submitBtn = screen.getByRole('button', { name: /valider/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(screen.getByText(/température invalide/i)).toBeInTheDocument()
            })
        })

        it('should require diagnostic', async () => {
            renderForm()
            const submitBtn = screen.getByRole('button', { name: /valider/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(screen.getByText(/diagnostic requis/i)).toBeInTheDocument()
            })
        })
    })

    describe('Prescription Section', () => {
        it('should allow adding medications', () => {
            renderForm()
            const addMedBtn = screen.getByRole('button', { name: /ajouter un médicament/i })
            fireEvent.click(addMedBtn)

            const medInputs = screen.getAllByPlaceholderText(/nom du médicament/i)
            expect(medInputs).toHaveLength(1)
        })

        it('should allow removing medications', () => {
            renderForm()
            fireEvent.click(screen.getByRole('button', { name: /ajouter un médicament/i }))
            const removeBtn = screen.getByRole('button', { name: /supprimer/i })
            fireEvent.click(removeBtn)

            expect(screen.queryByPlaceholderText(/nom du médicament/i)).not.toBeInTheDocument()
        })
    })

    describe('Submission', () => {
        it('should call onSubmit with complete data', async () => {
            renderForm()

            // Fill vitals
            fireEvent.change(screen.getByLabelText(/tension/i), { target: { value: '12/8' } })
            fireEvent.change(screen.getByLabelText(/température/i), { target: { value: '37' } })

            // Fill clinical
            fireEvent.change(screen.getByLabelText(/diagnostic/i), { target: { value: 'Toux' } })

            const submitBtn = screen.getByRole('button', { name: /valider/i })
            fireEvent.click(submitBtn)

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                    diagnostic: 'Toux',
                    tensionArterielle: '12/8'
                }))
            })
        })
    })
})
