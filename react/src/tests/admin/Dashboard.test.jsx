import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../../composants/administrateur/dashboard'
import { mockUsers, mockPatients, mockRendezVous, mockStatistics, setupMockAuth } from '../mocks/mockData'

/**
 * Tests for Admin Dashboard Component
 * Tests statistics display, charts, and admin overview
 */
describe('Admin Dashboard Component', () => {
    const mockNavigate = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.admin)
        vi.clearAllMocks()

        // Mock react-router-dom
        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom')
            return {
                ...actual,
                useNavigate: () => mockNavigate
            }
        })
    })

    const renderDashboard = () => {
        return render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render dashboard title', () => {
            renderDashboard()
            expect(screen.getByText(/tableau de bord/i)).toBeInTheDocument()
        })

        it('should display welcome message with admin name', () => {
            renderDashboard()
            expect(screen.getByText(/bienvenue/i)).toBeInTheDocument()
            expect(screen.getByText(/admin/i)).toBeInTheDocument()
        })

        it('should render all statistics cards', () => {
            renderDashboard()
            expect(screen.getByText(/total patients/i)).toBeInTheDocument()
            expect(screen.getByText(/rendez-vous/i)).toBeInTheDocument()
            expect(screen.getByText(/factures/i)).toBeInTheDocument()
            expect(screen.getByText(/revenu/i)).toBeInTheDocument()
        })
    })

    describe('Statistics Display', () => {
        it('should display correct patient count', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ totalPatients: 150 })
                })
            )

            renderDashboard()

            await waitFor(() => {
                expect(screen.getByText('150')).toBeInTheDocument()
            })
        })

        it('should display correct rendez-vous count', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ totalRendezVous: 45 })
                })
            )

            renderDashboard()

            await waitFor(() => {
                expect(screen.getByText('45')).toBeInTheDocument()
            })
        })

        it('should format revenue correctly', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ revenuMensuel: 2500000 })
                })
            )

            renderDashboard()

            await waitFor(() => {
                expect(screen.getByText(/2\.500\.000/i)).toBeInTheDocument()
            })
        })
    })

    describe('Charts', () => {
        it('should render consultations chart', () => {
            renderDashboard()
            expect(screen.getByRole('img', { name: /consultations/i })).toBeInTheDocument()
        })

        it('should render revenue chart', () => {
            renderDashboard()
            expect(screen.getByRole('img', { name: /revenus/i })).toBeInTheDocument()
        })

        it('should display chart labels', () => {
            renderDashboard()
            mockStatistics.monthly.labels.forEach(label => {
                expect(screen.getByText(label)).toBeInTheDocument()
            })
        })
    })

    describe('Quick Actions', () => {
        it('should display quick action buttons', () => {
            renderDashboard()
            expect(screen.getByRole('button', { name: /ajouter patient/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /ajouter utilisateur/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /voir rendez-vous/i })).toBeInTheDocument()
        })

        it('should navigate to add patient on button click', () => {
            renderDashboard()
            const addPatientBtn = screen.getByRole('button', { name: /ajouter patient/i })
            fireEvent.click(addPatientBtn)
            expect(mockNavigate).toHaveBeenCalledWith('/admin/patients/nouveau')
        })

        it('should navigate to add user on button click', () => {
            renderDashboard()
            const addUserBtn = screen.getByRole('button', { name: /ajouter utilisateur/i })
            fireEvent.click(addUserBtn)
            expect(mockNavigate).toHaveBeenCalledWith('/admin/utilisateurs/nouveau')
        })
    })

    describe('Recent Activity', () => {
        it('should display recent patients list', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([mockPatients.patient1, mockPatients.patient2])
                })
            )

            renderDashboard()

            await waitFor(() => {
                expect(screen.getByText(mockPatients.patient1.nom)).toBeInTheDocument()
                expect(screen.getByText(mockPatients.patient2.nom)).toBeInTheDocument()
            })
        })

        it('should display recent rendez-vous', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([mockRendezVous.rdv1])
                })
            )

            renderDashboard()

            await waitFor(() => {
                expect(screen.getByText(/consultation de routine/i)).toBeInTheDocument()
            })
        })
    })

    describe('Loading States', () => {
        it('should show loading spinner while fetching data', () => {
            global.fetch = vi.fn(() => new Promise(() => { })) // Never resolves

            renderDashboard()

            expect(screen.getByRole('status')).toBeInTheDocument()
            expect(screen.getByText(/chargement/i)).toBeInTheDocument()
        })

        it('should hide loading spinner after data loads', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockStatistics.dashboard)
                })
            )

            renderDashboard()

            await waitFor(() => {
                expect(screen.queryByRole('status')).not.toBeInTheDocument()
            })
        })
    })

    describe('Error Handling', () => {
        it('should display error message on fetch failure', async () => {
            global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

            renderDashboard()

            await waitFor(() => {
                expect(screen.getByText(/erreur/i)).toBeInTheDocument()
            })
        })

        it('should allow retry on error', async () => {
            global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

            renderDashboard()

            await waitFor(() => {
                const retryBtn = screen.getByRole('button', { name: /réessayer/i })
                expect(retryBtn).toBeInTheDocument()
            })
        })
    })

    describe('Responsive Design', () => {
        it('should apply responsive classes', () => {
            const { container } = renderDashboard()
            expect(container.querySelector('.grid')).toBeInTheDocument()
            expect(container.querySelector('.grid-cols-1')).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderDashboard()
            expect(screen.getByRole('main')).toBeInTheDocument()
            expect(screen.getByRole('navigation')).toBeInTheDocument()
        })

        it('should have accessible statistics cards', () => {
            renderDashboard()
            const cards = screen.getAllByRole('article')
            expect(cards.length).toBeGreaterThan(0)
        })
    })

    describe('Data Refresh', () => {
        it('should refresh data on interval', async () => {
            vi.useFakeTimers()
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockStatistics.dashboard)
                })
            )

            renderDashboard()

            // Initial fetch
            expect(global.fetch).toHaveBeenCalledTimes(1)

            // Fast-forward 30 seconds
            vi.advanceTimersByTime(30000)

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledTimes(2)
            })

            vi.useRealTimers()
        })
    })
})
