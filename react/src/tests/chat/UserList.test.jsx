import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserList from '../../composants/chat/UserList'
import { mockUsers, setupMockAuth } from '../mocks/mockData'

describe('UserList Component', () => {
    const mockOnSelect = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderUserList = (props = {}) => {
        return render(
            <UserList
                users={Object.values(mockUsers)}
                onSelectUser={mockOnSelect}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render all users', () => {
            renderUserList()
            Object.values(mockUsers).forEach(user => {
                expect(screen.getByText(user.nom)).toBeInTheDocument()
            })
        })

        it('should show online status indicators', () => {
            renderUserList()
            const indicators = screen.getAllByTestId('status-indicator')
            expect(indicators.length).toBe(Object.values(mockUsers).length)
        })
    })

    describe('Interactions', () => {
        it('should call onSelectUser when a user is clicked', () => {
            renderUserList()
            const firstUser = screen.getByText(Object.values(mockUsers)[0].nom)
            fireEvent.click(firstUser)
            expect(mockOnSelect).toHaveBeenCalledWith(Object.values(mockUsers)[0])
        })

        it('should filter users by search term', () => {
            renderUserList()
            const searchInput = screen.getByPlaceholderText(/rechercher un utilisateur/i)
            fireEvent.change(searchInput, { target: { value: 'Admin' } })

            expect(screen.getByText(/admin/i)).toBeInTheDocument()
            expect(screen.queryByText(/secretaire/i)).not.toBeInTheDocument()
        })
    })
})
