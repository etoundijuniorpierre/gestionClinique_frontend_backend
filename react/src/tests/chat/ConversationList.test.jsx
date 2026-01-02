import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ConversationList from '../../composants/chat/ConversationList'
import { mockConversations, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('ConversationList Component', () => {
    const mockOnSelect = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderConversationList = (props = {}) => {
        return render(
            <BrowserRouter>
                <ConversationList
                    conversations={mockConversations}
                    onSelectConversation={mockOnSelect}
                    selectedId={null}
                    {...props}
                />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render all conversations', () => {
            renderConversationList()
            expect(screen.getByText(mockConversations[0].titre || /conversation/i)).toBeInTheDocument()
            expect(screen.getAllByRole('listitem')).toHaveLength(mockConversations.length)
        })

        it('should show empty state message', () => {
            renderConversationList({ conversations: [] })
            expect(screen.getByText(/aucune conversation/i)).toBeInTheDocument()
        })

        it('should highlight selected conversation', () => {
            renderConversationList({ selectedId: mockConversations[0].id })
            const selectedItem = screen.getAllByRole('listitem')[0]
            expect(selectedItem).toHaveClass('active') // Adjust based on actual CSS class
        })
    })

    describe('Interactions', () => {
        it('should call onSelectConversation when clicked', () => {
            renderConversationList()
            const firstConv = screen.getAllByRole('listitem')[0]
            fireEvent.click(firstConv)
            expect(mockOnSelect).toHaveBeenCalledWith(mockConversations[0])
        })

        it('should filter conversations based on search', async () => {
            renderConversationList()
            const searchInput = screen.getByPlaceholderText(/rechercher/i)
            fireEvent.change(searchInput, { target: { value: 'Admin' } })

            await waitFor(() => {
                // Only conversations with 'Admin' in title/participant should remain
                const items = screen.getAllByRole('listitem')
                items.forEach(item => {
                    expect(item.textContent).toContain('Admin')
                })
            })
        })
    })

    describe('Unread Indicators', () => {
        it('should display unread count badge', () => {
            const convWithUnread = { ...mockConversations[0], unreadCount: 5 }
            renderConversationList({ conversations: [convWithUnread] })
            expect(screen.getByText('5')).toBeInTheDocument()
        })
    })
})
