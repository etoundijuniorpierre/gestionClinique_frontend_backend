import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DossierMedical from '../../composants/medecin/DossierMedical'
import { mockPatients, mockConsultations, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('DossierMedical Component', () => {
    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderDossier = (props = {}) => {
        return render(
            <DossierMedical
                patient={mockPatients[0]}
                consultations={mockConsultations}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render patient header info', () => {
            renderDossier()
            expect(screen.getByText(mockPatients[0].nom)).toBeInTheDocument()
            expect(screen.getByText(new RegExp(mockPatients[0].groupeSanguin, 'i'))).toBeInTheDocument()
        })

        it('should render consultation history list', () => {
            renderDossier()
            expect(screen.getAllByTestId('consultation-item')).toHaveLength(mockConsultations.length)
        })

        it('should show allergy warnings if present', () => {
            const patientWithAllergies = { ...mockPatients[0], allergies: 'Pénicilline' }
            renderDossier({ patient: patientWithAllergies })
            expect(screen.getByText(/allergies/i)).toBeInTheDocument()
            expect(screen.getByText(/pénicilline/i)).toBeInTheDocument()
        })
    })

    describe('Tabs & Navigation', () => {
        it('should switch between History and Summary tabs', () => {
            renderDossier()
            const summaryTab = screen.getByRole('tab', { name: /résumé/i })
            fireEvent.click(summaryTab)
            expect(screen.getByText(/antécédents/i)).toBeInTheDocument()

            const historyTab = screen.getByRole('tab', { name: /historique/i })
            fireEvent.click(historyTab)
            expect(screen.getAllByTestId('consultation-item')).toHaveLength(mockConsultations.length)
        })
    })

    describe('Consultation Details', () => {
        it('should expand consultation details on click', () => {
            renderDossier()
            const firstConsult = screen.getAllByTestId('consultation-item')[0]
            fireEvent.click(firstConsult)
            expect(screen.getByText(mockConsultations[0].diagnostic)).toBeInTheDocument()
            expect(screen.getByText(/prescriptions/i)).toBeInTheDocument()
        })
    })
})
