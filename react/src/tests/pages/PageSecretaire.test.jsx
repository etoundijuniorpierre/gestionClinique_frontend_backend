import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PageSecretaire from '../../pages/PageSecretaire'
import { mockUsers, setupMockAuth } from '../mocks/mockData'

vi.mock('../../composants/secretaire/CalendrierSecretaire', () => ({ default: () => <div data-testid="secretaire-calendar">Calendar</div> }))

describe('PageSecretaire Layout', () => {
    beforeEach(() => {
        setupMockAuth(mockUsers.secretaire)
        vi.clearAllMocks()
    })

    const renderPage = (initialEntry = '/secretaire') => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/secretaire/*" element={<PageSecretaire />} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('should render secretaire sidebar links', () => {
        renderPage()
        expect(screen.getByText(/rendez-vous/i)).toBeInTheDocument()
        expect(screen.getByText(/facturation/i)).toBeInTheDocument()
        expect(screen.getByText(/nouveau rdv/i)).toBeInTheDocument()
    })
})
