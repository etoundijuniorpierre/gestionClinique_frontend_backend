import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateGroupModal from '../../composants/chat/CreateGroupModal'
import { mockUsers, setupMockAuth } from '../mocks/mockData'

describe('CreateGroupModal Component', () => {
    const mockOnClose = vi.fn()
    const mockOnCreate = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderModal = (props = {}) => {
        return render(
            <CreateGroupModal
                isOpen={true}
                onClose={mockOnClose}
                onCreate={mockOnCreate}
                users={Object.values(mockUsers)}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render modal title and fields', () => {
            renderModal()
            expect(screen.getByText(/créer un groupe/i)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(/nom du groupe/i)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument()
        })

        it('should render user list for selection', () => {
            renderModal()
            Object.values(mockUsers).forEach(user => {
                expect(screen.getByText(user.nom)).toBeInTheDocument()
            })
        })
    })

    describe('Form Validation', () => {
        it('should show error if name is empty', async () => {
            renderModal()
            const createBtn = screen.getByRole('button', { name: /créer/i })
            fireEvent.click(createBtn)
            await waitFor(() => {
                expect(screen.getByText(/nom requis/i)).toBeInTheDocument()
            })
        })

        it('should require at least one participant', async () => {
            renderModal()
            fireEvent.change(screen.getByPlaceholderText(/nom du groupe/i), { target: { value: 'Team A' } })
            fireEvent.click(screen.getByRole('button', { name: /créer/i }))
            await waitFor(() => {
                expect(screen.getByText(/sélectionner au moins un membre/i)).toBeInTheDocument()
            })
        })
    })

    describe('User Selection', () => {
        it('should toggle user selection', () => {
            renderModal()
            const userCheckbox = screen.getAllByRole('checkbox')[0]
            fireEvent.click(userCheckbox)
            expect(userCheckbox).toBeChecked()
            fireEvent.click(userCheckbox)
            expect(userCheckbox).not.toBeChecked()
        })
    })

    describe('Submission', () => {
        it('should call onCreate with correct data', async () => {
            renderModal()
            fireEvent.change(screen.getByPlaceholderText(/nom du groupe/i), { target: { value: 'Team A' } })
            const checkboxes = screen.getAllByRole('checkbox')
            fireEvent.click(checkboxes[0])

            fireEvent.click(screen.getByRole('button', { name: /créer/i }))

            await waitFor(() => {
                expect(mockOnCreate).toHaveBeenCalledWith(expect.objectContaining({
                    nom: 'Team A',
                    idsMembres: expect.any(Array)
                }))
            })
        })
    })
})
