import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ChatContainer from '../../composants/chat/ChatContainer'
import { mockUsers, setupMockAuth, createMockNotification } from '../mocks/mockData'

/**
 * Tests for ChatContainer Component
 * Tests WebSocket connection, message handling, conversation management
 */
describe('ChatContainer Component', () => {
    let mockWebSocket

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()

        // Mock WebSocket
        mockWebSocket = {
            send: vi.fn(),
            close: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            readyState: WebSocket.OPEN
        }

        global.WebSocket = vi.fn(() => mockWebSocket)
    })

    const renderChat = () => {
        return render(
            <BrowserRouter>
                <ChatContainer />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render chat container', () => {
            renderChat()
            expect(screen.getByRole('main')).toBeInTheDocument()
        })

        it('should render conversation list', () => {
            renderChat()
            expect(screen.getByText(/conversations/i)).toBeInTheDocument()
        })

        it('should render message area', () => {
            renderChat()
            expect(screen.getByPlaceholderText(/écrire un message/i)).toBeInTheDocument()
        })
    })

    describe('WebSocket Connection', () => {
        it('should establish WebSocket connection on mount', () => {
            renderChat()
            expect(global.WebSocket).toHaveBeenCalled()
        })

        it('should close WebSocket on unmount', () => {
            const { unmount } = renderChat()
            unmount()
            expect(mockWebSocket.close).toHaveBeenCalled()
        })

        it('should show connection status', () => {
            renderChat()
            expect(screen.getByText(/connecté/i)).toBeInTheDocument()
        })

        it('should handle connection error', async () => {
            mockWebSocket.readyState = WebSocket.CLOSED
            renderChat()

            await waitFor(() => {
                expect(screen.getByText(/déconnecté/i)).toBeInTheDocument()
            })
        })
    })

    describe('Message Sending', () => {
        it('should send message on submit', async () => {
            renderChat()

            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })

            const sendBtn = screen.getByRole('button', { name: /envoyer/i })
            fireEvent.click(sendBtn)

            await waitFor(() => {
                expect(mockWebSocket.send).toHaveBeenCalledWith(
                    expect.stringContaining('Hello')
                )
            })
        })

        it('should clear input after sending', async () => {
            renderChat()

            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            fireEvent.submit(input.closest('form'))

            await waitFor(() => {
                expect(input.value).toBe('')
            })
        })

        it('should not send empty message', () => {
            renderChat()

            const sendBtn = screen.getByRole('button', { name: /envoyer/i })
            fireEvent.click(sendBtn)

            expect(mockWebSocket.send).not.toHaveBeenCalled()
        })
    })

    describe('Message Receiving', () => {
        it('should display received messages', async () => {
            renderChat()

            const messageEvent = new MessageEvent('message', {
                data: JSON.stringify({
                    type: 'message',
                    content: 'New message',
                    sender: 'User1'
                })
            })

            mockWebSocket.addEventListener.mock.calls
                .find(call => call[0] === 'message')[1](messageEvent)

            await waitFor(() => {
                expect(screen.getByText('New message')).toBeInTheDocument()
            })
        })

        it('should show notification for new message', async () => {
            renderChat()

            const messageEvent = new MessageEvent('message', {
                data: JSON.stringify({
                    type: 'message',
                    content: 'New message'
                })
            })

            mockWebSocket.addEventListener.mock.calls
                .find(call => call[0] === 'message')[1](messageEvent)

            await waitFor(() => {
                expect(screen.getByRole('alert')).toBeInTheDocument()
            })
        })
    })

    describe('Conversation Management', () => {
        it('should switch conversations', async () => {
            renderChat()

            const conversation = screen.getByText(/conversation 1/i)
            fireEvent.click(conversation)

            await waitFor(() => {
                expect(screen.getByText(/conversation 1/i)).toHaveClass('active')
            })
        })

        it('should load conversation history', async () => {
            global.fetch = vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { id: 1, content: 'Message 1' },
                        { id: 2, content: 'Message 2' }
                    ])
                })
            )

            renderChat()

            await waitFor(() => {
                expect(screen.getByText('Message 1')).toBeInTheDocument()
                expect(screen.getByText('Message 2')).toBeInTheDocument()
            })
        })
    })

    describe('Online Status', () => {
        it('should display online users', () => {
            renderChat()
            expect(screen.getByText(/en ligne/i)).toBeInTheDocument()
        })

        it('should update user status', async () => {
            renderChat()

            const statusEvent = new MessageEvent('message', {
                data: JSON.stringify({
                    type: 'status',
                    userId: 1,
                    status: 'online'
                })
            })

            mockWebSocket.addEventListener.mock.calls
                .find(call => call[0] === 'message')[1](statusEvent)

            await waitFor(() => {
                expect(screen.getByText(/en ligne/i)).toBeInTheDocument()
            })
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            renderChat()
            expect(screen.getByRole('main')).toHaveAttribute('aria-label')
        })

        it('should support keyboard navigation', () => {
            renderChat()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            expect(input).toHaveAttribute('aria-label')
        })
    })
})
