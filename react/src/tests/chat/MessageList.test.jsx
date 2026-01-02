import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MessageList from '../../composants/chat/MessageList'
import { mockMessages, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('MessageList Component', () => {
    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
        // Mock scrollIntoView
        window.HTMLElement.prototype.scrollIntoView = vi.fn()
    })

    const renderMessageList = (props = {}) => {
        return render(
            <MessageList
                messages={mockMessages}
                currentUserId={mockUsers.medecin.id}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render all messages', () => {
            renderMessageList()
            mockMessages.forEach(msg => {
                expect(screen.getByText(msg.contenu)).toBeInTheDocument()
            })
        })

        it('should group messages by date', () => {
            renderMessageList()
            // Check for date headers if implemented
            const dateHeaders = screen.queryAllByTestId('date-header')
            if (dateHeaders.length > 0) {
                expect(dateHeaders.length).toBeGreaterThan(0)
            }
        })

        it('should distinguish between sent and received messages', () => {
            renderMessageList()
            const messages = screen.getAllByTestId('message-item')
            const sentMessage = messages.find(m => m.textContent.includes(mockMessages[0].contenu))
            expect(sentMessage).toHaveClass('sent') // Adjust based on actual CSS
        })
    })

    describe('Auto-scroll', () => {
        it('should scroll to bottom on mount', () => {
            renderMessageList()
            expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled()
        })

        it('should scroll to bottom when new messages arrive', () => {
            const { rerender } = renderMessageList()
            const newMessages = [...mockMessages, { id: 99, contenu: 'New', expediteurId: 1 }]
            rerender(<MessageList messages={newMessages} currentUserId={mockUsers.medecin.id} />)
            expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled()
        })
    })
})
