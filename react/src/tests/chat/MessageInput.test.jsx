import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MessageInput from '../../composants/chat/MessageInput'
import { setupMockAuth, mockUsers } from '../mocks/mockData'

describe('MessageInput Component', () => {
    const mockOnSend = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderMessageInput = () => {
        return render(
            <BrowserRouter>
                <MessageInput onSend={mockOnSend} />
            </BrowserRouter>
        )
    }

    describe('Rendering', () => {
        it('should render input field', () => {
            renderMessageInput()
            expect(screen.getByPlaceholderText(/écrire un message/i)).toBeInTheDocument()
        })

        it('should render send button', () => {
            renderMessageInput()
            expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument()
        })

        it('should render emoji button', () => {
            renderMessageInput()
            expect(screen.getByRole('button', { name: /emoji/i })).toBeInTheDocument()
        })

        it('should render file upload button', () => {
            renderMessageInput()
            expect(screen.getByRole('button', { name: /fichier/i })).toBeInTheDocument()
        })
    })

    describe('Text Input', () => {
        it('should update input value on change', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            expect(input.value).toBe('Hello')
        })

        it('should call onSend on submit', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            fireEvent.submit(input.closest('form'))
            expect(mockOnSend).toHaveBeenCalledWith('Hello')
        })

        it('should clear input after sending', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            fireEvent.submit(input.closest('form'))
            expect(input.value).toBe('')
        })

        it('should not send empty message', () => {
            renderMessageInput()
            const sendBtn = screen.getByRole('button', { name: /envoyer/i })
            fireEvent.click(sendBtn)
            expect(mockOnSend).not.toHaveBeenCalled()
        })
    })

    describe('Character Limit', () => {
        it('should show character count', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            expect(screen.getByText(/5\/500/i)).toBeInTheDocument()
        })

        it('should prevent input beyond limit', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            const longText = 'a'.repeat(501)
            fireEvent.change(input, { target: { value: longText } })
            expect(input.value.length).toBeLessThanOrEqual(500)
        })
    })

    describe('Emoji Picker', () => {
        it('should toggle emoji picker', () => {
            renderMessageInput()
            const emojiBtn = screen.getByRole('button', { name: /emoji/i })
            fireEvent.click(emojiBtn)
            expect(screen.getByRole('dialog', { name: /emoji/i })).toBeInTheDocument()
        })

        it('should insert emoji into input', () => {
            renderMessageInput()
            const emojiBtn = screen.getByRole('button', { name: /emoji/i })
            fireEvent.click(emojiBtn)
            const emoji = screen.getByText('😊')
            fireEvent.click(emoji)
            const input = screen.getByPlaceholderText(/écrire un message/i)
            expect(input.value).toContain('😊')
        })
    })

    describe('File Upload', () => {
        it('should open file picker', () => {
            renderMessageInput()
            const fileBtn = screen.getByRole('button', { name: /fichier/i })
            const fileInput = document.querySelector('input[type="file"]')
            fireEvent.click(fileBtn)
            expect(fileInput).toHaveAttribute('accept')
        })

        it('should handle file selection', async () => {
            renderMessageInput()
            const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
            const fileInput = document.querySelector('input[type="file"]')
            fireEvent.change(fileInput, { target: { files: [file] } })
            await waitFor(() => {
                expect(screen.getByText('test.pdf')).toBeInTheDocument()
            })
        })
    })

    describe('Keyboard Shortcuts', () => {
        it('should send on Enter key', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
            expect(mockOnSend).toHaveBeenCalledWith('Hello')
        })

        it('should not send on Shift+Enter', () => {
            renderMessageInput()
            const input = screen.getByPlaceholderText(/écrire un message/i)
            fireEvent.change(input, { target: { value: 'Hello' } })
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true })
            expect(mockOnSend).not.toHaveBeenCalled()
        })
    })
})
