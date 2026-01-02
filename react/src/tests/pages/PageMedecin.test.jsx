import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PageMedecin from '../../pages/PageMedecin'
import { mockUsers, setupMockAuth } from '../mocks/mockData'

vi.mock('../../composants/medecin/CalendrierMedecin', () => ({ default: () => <div data-testid="medecin-calendar">Calendar</div> }))
vi.mock('../../composants/medecin/RendezVousMedecin', () => ({ default: () => <div data-testid="medecin-rdv">RDV List</div> }))

describe('PageMedecin Layout', () => {
    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderPage = (initialEntry = '/medecin') => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/medecin/*" element={<PageMedecin />} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('should render medecin sidebar links', () => {
        renderPage()
        expect(screen.getByText(/mes rendez-vous/i)).toBeInTheDocument()
        expect(screen.getByText(/calendrier/i)).toBeInTheDocument()
        expect(screen.getByText(/chat/i)).toBeInTheDocument()
    })

    it('should render RDV list by default', () => {
        renderPage('/medecin')
        expect(screen.getByTestId('medecin-rdv')).toBeInTheDocument()
    })
})
