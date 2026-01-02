import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MessageItem from '../../composants/chat/MessageItem'
import { mockMessages, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('MessageItem Component', () => {
    const mockOnDelete = vi.fn()
    const mockOnEdit = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderMessageItem = (props = {}) => {
        return render(
            <MessageItem
                message={mockMessages[0]}
                isMine={true}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render message content', () => {
            renderMessageItem()
            expect(screen.getByText(mockMessages[0].contenu)).toBeInTheDocument()
        })

        it('should show timestamp', () => {
            renderMessageItem()
            expect(screen.getByTestId('message-time')).toBeInTheDocument()
        })

        it('should show read checkmark if sent by me', () => {
            renderMessageItem({ isMine: true })
            expect(screen.getByTestId('read-status')).toBeInTheDocument()
        })
    })

    describe('Actions', () => {
        it('should show action menu if mine', () => {
            renderMessageItem({ isMine: true })
            const menuBtn = screen.getByRole('button', { name: /actions/i })
            fireEvent.click(menuBtn)
            expect(screen.getByText(/modifier/i)).toBeInTheDocument()
            expect(screen.getByText(/supprimer/i)).toBeInTheDocument()
        })

        it('should not show actions if not mine', () => {
            renderMessageItem({ isMine: false })
            expect(screen.queryByRole('button', { name: /actions/i })).not.toBeInTheDocument()
        })

        it('should call onDelete when confirmed', () => {
            renderMessageItem({ isMine: true })
            fireEvent.click(screen.getByRole('button', { name: /actions/i }))
            fireEvent.click(screen.getByText(/supprimer/i))
            expect(mockOnDelete).toHaveBeenCalled()
        })
    })

    describe('Attachments', () => {
        it('should render file attachment link', () => {
            const msgWithFile = { ...mockMessages[0], pieceJointe: 'test.pdf' }
            renderMessageItem({ message: msgWithFile })
            expect(screen.getByText(/test.pdf/i)).toBeInTheDocument()
        })
    })
})
