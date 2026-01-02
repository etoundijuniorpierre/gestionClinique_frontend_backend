import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Loading from '../composants/loading'

/**
 * Tests for Loading Component
 * Tests rendering and animation states
 */
describe('Loading Component', () => {
    const renderWithRouter = (component) => {
        return render(
            <BrowserRouter>
                {component}
            </BrowserRouter>
        )
    }

    it('should render loading spinner', () => {
        renderWithRouter(<Loading />)

        const spinner = screen.getByRole('status')
        expect(spinner).toBeInTheDocument()
    })

    it('should display loading text', () => {
        renderWithRouter(<Loading />)

        expect(screen.getByText(/chargement/i)).toBeInTheDocument()
    })

    it('should have proper ARIA attributes', () => {
        renderWithRouter(<Loading />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveAttribute('aria-live', 'polite')
        expect(spinner).toHaveAttribute('aria-busy', 'true')
    })

    it('should apply animation class', () => {
        renderWithRouter(<Loading />)

        const spinner = screen.getByRole('status')
        expect(spinner).toHaveClass('animate-spin')
    })

    it('should be centered on screen', () => {
        const { container } = renderWithRouter(<Loading />)

        const wrapper = container.firstChild
        expect(wrapper).toHaveClass('flex-center')
    })
})
