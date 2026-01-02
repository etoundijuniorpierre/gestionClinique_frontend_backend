import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Patients from '../../composants/administrateur/patients'
import { mockPatients, createMockPatientList, setupMockAuth, mockUsers } from '../mocks/mockData'

/**
 * Tests for Admin Patients List Component
 * Tests patient list display, search, pagination, and CRUD operations
 */
describe('Admin Patients Component', () => {
    const mockNavigate = vi.fn()
    const mockPatientList = createMockPatientList(10)

    beforeEach(() => {
        setupMockAuth(mockUsers.admin)
        vi.clearAllMocks()

        vi.mock('react-router-dom', async () => {
            const actual = await vi.importActual('react-router-dom')
            return {
                ...actual,
                useNavigate: () => mockNavigate
            }
        })

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockPatientList)
            })
        )
    })

    const renderPatients = () => {
        return render(
            <BrowserRouter>
                <Patients />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render patients list title', () => {
            renderPatients()
            expect(screen.getByText(/liste des patients/i)).toBeInTheDocument()
        })

        it('should render add patient button', () => {
            renderPatients()
            expect(screen.getByRole('button', { name: /ajouter patient/i })).toBeInTheDocument()
        })

        it('should render search input', () => {
            renderPatients()
            expect(screen.getByPlaceholderText(/rechercher/i)).toBeInTheDocument()
        })

        it('should render patients table', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByRole('table')).toBeInTheDocument()
            })
        })
    })

    describe('Patient List Display', () => {
        it('should display all patients', async () => {
            renderPatients()

            await waitFor(() => {
                mockPatientList.slice(0, 5).forEach(patient => {
                    expect(screen.getByText(patient.nom)).toBeInTheDocument()
                })
            })
        })

        it('should display patient information columns', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByText(/nom/i)).toBeInTheDocument()
                expect(screen.getByText(/prénom/i)).toBeInTheDocument()
                expect(screen.getByText(/email/i)).toBeInTheDocument()
                expect(screen.getByText(/téléphone/i)).toBeInTheDocument()
                expect(screen.getByText(/actions/i)).toBeInTheDocument()
            })
        })

        it('should display patient age', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByText('33')).toBeInTheDocument() // Age from mock
            })
        })
    })

    describe('Search Functionality', () => {
        it('should filter patients by name', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByText('Patient1')).toBeInTheDocument()
            })

            const searchInput = screen.getByPlaceholderText(/rechercher/i)
            fireEvent.change(searchInput, { target: { value: 'Patient1' } })

            await waitFor(() => {
                expect(screen.getByText('Patient1')).toBeInTheDocument()
                expect(screen.queryByText('Patient2')).not.toBeInTheDocument()
            })
        })

        it('should show no results message when search has no matches', async () => {
            renderPatients()

            const searchInput = screen.getByPlaceholderText(/rechercher/i)
            fireEvent.change(searchInput, { target: { value: 'NonExistent' } })

            await waitFor(() => {
                expect(screen.getByText(/aucun patient trouvé/i)).toBeInTheDocument()
            })
        })

        it('should clear search on clear button click', async () => {
            renderPatients()

            const searchInput = screen.getByPlaceholderText(/rechercher/i)
            fireEvent.change(searchInput, { target: { value: 'Patient1' } })

            const clearBtn = screen.getByRole('button', { name: /effacer/i })
            fireEvent.click(clearBtn)

            expect(searchInput.value).toBe('')
        })
    })

    describe('Pagination', () => {
        it('should display pagination controls', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
            })
        })

        it('should show correct page numbers', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByText('1')).toBeInTheDocument()
                expect(screen.getByText('2')).toBeInTheDocument()
            })
        })

        it('should navigate to next page', async () => {
            renderPatients()

            await waitFor(() => {
                const nextBtn = screen.getByRole('button', { name: /suivant/i })
                fireEvent.click(nextBtn)
            })

            await waitFor(() => {
                expect(screen.getByText(/page 2/i)).toBeInTheDocument()
            })
        })

        it('should disable previous button on first page', async () => {
            renderPatients()

            await waitFor(() => {
                const prevBtn = screen.getByRole('button', { name: /précédent/i })
                expect(prevBtn).toBeDisabled()
            })
        })
    })

    describe('CRUD Operations', () => {
        it('should navigate to add patient form', () => {
            renderPatients()

            const addBtn = screen.getByRole('button', { name: /ajouter patient/i })
            fireEvent.click(addBtn)

            expect(mockNavigate).toHaveBeenCalledWith('/admin/patients/nouveau')
        })

        it('should navigate to edit patient', async () => {
            renderPatients()

            await waitFor(() => {
                const editBtn = screen.getAllByRole('button', { name: /modifier/i })[0]
                fireEvent.click(editBtn)
            })

            expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/modifier'))
        })

        it('should show delete confirmation dialog', async () => {
            renderPatients()

            await waitFor(() => {
                const deleteBtn = screen.getAllByRole('button', { name: /supprimer/i })[0]
                fireEvent.click(deleteBtn)
            })

            expect(screen.getByText(/confirmer la suppression/i)).toBeInTheDocument()
        })

        it('should delete patient on confirmation', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPatientList) })
                .mockResolvedValueOnce({ ok: true })

            renderPatients()

            await waitFor(() => {
                const deleteBtn = screen.getAllByRole('button', { name: /supprimer/i })[0]
                fireEvent.click(deleteBtn)
            })

            const confirmBtn = screen.getByRole('button', { name: /confirmer/i })
            fireEvent.click(confirmBtn)

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('/api/patients/'),
                    expect.objectContaining({ method: 'DELETE' })
                )
            })
        })

        it('should view patient details', async () => {
            renderPatients()

            await waitFor(() => {
                const viewBtn = screen.getAllByRole('button', { name: /voir/i })[0]
                fireEvent.click(viewBtn)
            })

            expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/details'))
        })
    })

    describe('Sorting', () => {
        it('should sort patients by name', async () => {
            renderPatients()

            await waitFor(() => {
                const nameHeader = screen.getByText(/nom/i)
                fireEvent.click(nameHeader)
            })

            // Verify sort indicator
            expect(screen.getByText(/↑/)).toBeInTheDocument()
        })

        it('should toggle sort direction', async () => {
            renderPatients()

            await waitFor(() => {
                const nameHeader = screen.getByText(/nom/i)
                fireEvent.click(nameHeader)
                fireEvent.click(nameHeader)
            })

            expect(screen.getByText(/↓/)).toBeInTheDocument()
        })
    })

    describe('Loading States', () => {
        it('should show loading spinner while fetching', () => {
            global.fetch = vi.fn(() => new Promise(() => { }))

            renderPatients()

            expect(screen.getByRole('status')).toBeInTheDocument()
        })

        it('should hide loading after data loads', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.queryByRole('status')).not.toBeInTheDocument()
            })
        })
    })

    describe('Error Handling', () => {
        it('should display error message on fetch failure', async () => {
            global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

            renderPatients()

            await waitFor(() => {
                expect(screen.getByText(/erreur/i)).toBeInTheDocument()
            })
        })

        it('should show error on delete failure', async () => {
            global.fetch = vi.fn()
                .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockPatientList) })
                .mockRejectedValueOnce(new Error('Delete failed'))

            renderPatients()

            await waitFor(() => {
                const deleteBtn = screen.getAllByRole('button', { name: /supprimer/i })[0]
                fireEvent.click(deleteBtn)
            })

            const confirmBtn = screen.getByRole('button', { name: /confirmer/i })
            fireEvent.click(confirmBtn)

            await waitFor(() => {
                expect(screen.getByText(/erreur lors de la suppression/i)).toBeInTheDocument()
            })
        })
    })

    describe('Empty State', () => {
        it('should show empty state when no patients', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([])
                })
            )

            renderPatients()

            await waitFor(() => {
                expect(screen.getByText(/aucun patient/i)).toBeInTheDocument()
            })
        })

        it('should show add patient button in empty state', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([])
                })
            )

            renderPatients()

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /ajouter le premier patient/i })).toBeInTheDocument()
            })
        })
    })

    describe('Accessibility', () => {
        it('should have proper table structure', async () => {
            renderPatients()

            await waitFor(() => {
                expect(screen.getByRole('table')).toBeInTheDocument()
                expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0)
                expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
            })
        })

        it('should have accessible action buttons', async () => {
            renderPatients()

            await waitFor(() => {
                const editButtons = screen.getAllByRole('button', { name: /modifier/i })
                editButtons.forEach(btn => {
                    expect(btn).toHaveAttribute('aria-label')
                })
            })
        })
    })
})
