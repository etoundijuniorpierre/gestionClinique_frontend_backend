import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RendezVousMedecin from '../../composants/medecin/RendezVousMedecin'
import { mockRendezVous, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('RendezVousMedecin Component', () => {
    const mockOnStart = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderRdv = (props = {}) => {
        return render(
            <RendezVousMedecin
                rendezVous={mockRendezVous}
                onStartConsultation={mockOnStart}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render the list of appointments', () => {
            renderRdv()
            expect(screen.getAllByTestId('rendez-vous-card')).toHaveLength(mockRendezVous.length)
        })

        it('should show patient name and time for each RDV', () => {
            renderRdv()
            expect(screen.getByText(mockRendezVous[0].patient.nom)).toBeInTheDocument()
            expect(screen.getByText(mockRendezVous[0].heure)).toBeInTheDocument()
        })

        it('should show appropriate status badge', () => {
            renderRdv()
            expect(screen.getByText(/confirmé/i)).toBeInTheDocument()
        })
    })

    describe('Actions', () => {
        it('should show "Commencer" button for confirmed RDVs', () => {
            renderRdv()
            const startBtn = screen.getAllByRole('button', { name: /commencer/i })[0]
            expect(startBtn).toBeEnabled()
        })

        it('should call onStartConsultation when clicking Commencer', () => {
            renderRdv()
            const startBtn = screen.getAllByRole('button', { name: /commencer/i })[0]
            fireEvent.click(startBtn)
            expect(mockOnStart).toHaveBeenCalledWith(mockRendezVous[0])
        })

        it('should disable button if RDV already finished', () => {
            const finishedRdv = { ...mockRendezVous[0], statut: 'TERMINE' }
            renderRdv({ rendezVous: [finishedRdv] })
            expect(screen.queryByRole('button', { name: /commencer/i })).not.toBeInTheDocument()
            expect(screen.getByText(/terminé/i)).toBeInTheDocument()
        })
    })
})
