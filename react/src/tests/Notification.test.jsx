import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { NotificationProvider, useNotification } from '../composants/notification'

/**
 * Tests for Notification System
 * Tests notification display, types, and auto-dismiss
 */
describe('Notification System', () => {
    // Test component to trigger notifications
    const TestComponent = () => {
        const { showNotification } = useNotification()

        return (
            <div>
                <button onClick={() => showNotification('Success message', 'success')}>
                    Show Success
                </button>
                <button onClick={() => showNotification('Error message', 'error')}>
                    Show Error
                </button>
                <button onClick={() => showNotification('Info message', 'info')}>
                    Show Info
                </button>
                <button onClick={() => showNotification('Warning message', 'warning')}>
                    Show Warning
                </button>
            </div>
        )
    }

    const renderWithProvider = (component) => {
        return render(
            <BrowserRouter>
                <NotificationProvider>
                    {component}
                </NotificationProvider>
            </BrowserRouter>
        )
    }

    it('should display success notification', async () => {
        renderWithProvider(<TestComponent />)

        const button = screen.getByText('Show Success')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Success message')).toBeInTheDocument()
        })
    })

    it('should display error notification', async () => {
        renderWithProvider(<TestComponent />)

        const button = screen.getByText('Show Error')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Error message')).toBeInTheDocument()
        })
    })

    it('should display info notification', async () => {
        renderWithProvider(<TestComponent />)

        const button = screen.getByText('Show Info')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Info message')).toBeInTheDocument()
        })
    })

    it('should display warning notification', async () => {
        renderWithProvider(<TestComponent />)

        const button = screen.getByText('Show Warning')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Warning message')).toBeInTheDocument()
        })
    })

    it('should auto-dismiss notification after timeout', async () => {
        vi.useFakeTimers()

        renderWithProvider(<TestComponent />)

        const button = screen.getByText('Show Success')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Success message')).toBeInTheDocument()
        })

        // Fast-forward time
        vi.advanceTimersByTime(5000)

        await waitFor(() => {
            expect(screen.queryByText('Success message')).not.toBeInTheDocument()
        })

        vi.useRealTimers()
    })

    it('should allow manual dismiss of notification', async () => {
        renderWithProvider(<TestComponent />)

        const button = screen.getByText('Show Success')
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Success message')).toBeInTheDocument()
        })

        const closeButton = screen.getByRole('button', { name: /close/i })
        fireEvent.click(closeButton)

        await waitFor(() => {
            expect(screen.queryByText('Success message')).not.toBeInTheDocument()
        })
    })

    it('should stack multiple notifications', async () => {
        renderWithProvider(<TestComponent />)

        fireEvent.click(screen.getByText('Show Success'))
        fireEvent.click(screen.getByText('Show Error'))

        await waitFor(() => {
            expect(screen.getByText('Success message')).toBeInTheDocument()
            expect(screen.getByText('Error message')).toBeInTheDocument()
        })
    })

    it('should apply correct CSS class for notification type', async () => {
        renderWithProvider(<TestComponent />)

        fireEvent.click(screen.getByText('Show Success'))

        await waitFor(() => {
            const notification = screen.getByText('Success message').closest('.notification')
            expect(notification).toHaveClass('notification-success')
        })
    })
})
