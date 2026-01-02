import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PageAdmin from '../../pages/PageAdmin'
import { mockUsers, setupMockAuth } from '../mocks/mockData'

// Mocking child components to focus on layout/routing
vi.mock('../../composants/admin/Dashboard', () => ({ default: () => <div data-testid="admin-dashboard">Dashboard</div> }))
vi.mock('../../composants/admin/Patients', () => ({ default: () => <div data-testid="admin-patients">Patients</div> }))

describe('PageAdmin Layout', () => {
    beforeEach(() => {
        setupMockAuth(mockUsers.admin)
        vi.clearAllMocks()
    })

    const renderPage = (initialEntry = '/admin') => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/admin/*" element={<PageAdmin />} />
                </Routes>
            </MemoryRouter>
        )
    }

    describe('Sidebar Rendering', () => {
        it('should render sidebar with admin links', () => {
            renderPage()
            expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
            expect(screen.getByText(/patients/i)).toBeInTheDocument()
            expect(screen.getByText(/utilisateurs/i)).toBeInTheDocument()
        })

        it('should show admin profile info', () => {
            renderPage()
            expect(screen.getByText(mockUsers.admin.nom)).toBeInTheDocument()
        })
    })

    describe('Nested Routing', () => {
        it('should render Dashboard by default', () => {
            renderPage('/admin')
            expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
        })

        it('should navigate to Patients page', () => {
            renderPage('/admin/patients')
            expect(screen.getByTestId('admin-patients')).toBeInTheDocument()
        })
    })
})
