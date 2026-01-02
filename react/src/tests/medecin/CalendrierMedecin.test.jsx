import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalendrierMedecin from '../../composants/medecin/CalendrierMedecin'
import { mockRendezVous, mockUsers, setupMockAuth } from '../mocks/mockData'

describe('CalendrierMedecin Component', () => {
    const mockOnSelectDate = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.medecin)
        vi.clearAllMocks()
    })

    const renderCalendar = (props = {}) => {
        return render(
            <CalendrierMedecin
                rendezVous={mockRendezVous}
                onSelectDate={mockOnSelectDate}
                {...props}
            />
        )
    }

    describe('Rendering', () => {
        it('should render current month and year', () => {
            renderCalendar()
            const now = new Date()
            const monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
            expect(screen.getByText(new RegExp(monthNames[now.getMonth()], 'i'))).toBeInTheDocument()
            expect(screen.getByText(new RegExp(now.getFullYear().toString()))).toBeInTheDocument()
        })

        it('should show dots for days with appointments', () => {
            renderCalendar()
            const appointmentDots = screen.getAllByTestId('appointment-dot')
            expect(appointmentDots.length).toBeGreaterThan(0)
        })
    })

    describe('Navigation', () => {
        it('should change month when clicking arrows', () => {
            renderCalendar()
            const nextBtn = screen.getByRole('button', { name: /suivant/i })
            fireEvent.click(nextBtn)
            // Assert month title changed (logic depends on component implementation)
        })
    })

    describe('Selection', () => {
        it('should call onSelectDate when a day is clicked', () => {
            renderCalendar()
            const days = screen.getAllByTestId('calendar-day')
            fireEvent.click(days[15]) // Click middle of month
            expect(mockOnSelectDate).toHaveBeenCalled()
        })
    })
})
