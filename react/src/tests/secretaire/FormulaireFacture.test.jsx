import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FormulaireFacture from '../../composants/secretaire/FormulaireFacture'
import { mockRendezVous, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('FormulaireFacture Component', () => {
    const mockOnSubmit = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.secretaire)
        vi.clearAllMocks()
    })

    const renderForm = (props = {}) => {
        return render(
            <FormulaireFacture
                rendezVous={mockRendezVous[0]}
                onSubmit={mockOnSubmit}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should display patient and consultation info', () => {
            renderForm()
            expect(screen.getByText(mockRendezVous[0].patient.nom)).toBeInTheDocument()
            expect(screen.getByText(/consultation de spécialité/i)).toBeInTheDocument()
        })

        it('should show default amount from service medical', () => {
            renderForm()
            expect(screen.getByDisplayValue(/50000/)).toBeInTheDocument()
        })
    })

    describe('Calculation', () => {
        it('should calculate total with items', () => {
            renderForm()
            // Add a manual item
            const itemInput = screen.getByPlaceholderText(/libellé acte/i)
            const priceInput = screen.getByPlaceholderText(/prix/i)
            const addBtn = screen.getByRole('button', { name: /ajouter/i })

            fireEvent.change(itemInput, { target: { value: 'Pansement' } })
            fireEvent.change(priceInput, { target: { value: '5000' } })
            fireEvent.click(addBtn)

            expect(screen.getByText(/total : 55000/i)).toBeInTheDocument()
        })
    })

    describe('Payment Mode', () => {
        it('should allow selecting payment mode', () => {
            renderForm()
            const modeSelect = screen.getByLabelText(/mode de paiement/i)
            fireEvent.change(modeSelect, { target: { value: 'ORANGE_MONEY' } })
            expect(modeSelect.value).toBe('ORANGE_MONEY')
        })
    })

    describe('Submission', () => {
        it('should call onSubmit with final amounts', async () => {
            renderForm()
            fireEvent.click(screen.getByRole('button', { name: /générer la facture/i }))

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                    montantTotal: 50000,
                    statut: 'IMPAYEE'
                }))
            })
        })
    })
})
