import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ModifierUtilisateur from '../../composants/admin/ModifierUtilisateur'
import { mockUsers, setupMockAuth } from '../mocks/mockData'

describe('ModifierUtilisateur Component', () => {
    const mockOnUpdate = vi.fn()

    beforeEach(() => {
        setupMockAuth(mockUsers.admin)
        vi.clearAllMocks()
    })

    const renderComponent = (props = {}) => {
        return render(
            <ModifierUtilisateur
                utilisateur={mockUsers.medecin}
                onUpdate={mockOnUpdate}
                {...props}
            />
        )
    }

    it('should prepopulate fields with existing user data', () => {
        renderComponent()
        expect(screen.getByDisplayValue(mockUsers.medecin.nom)).toBeInTheDocument()
        expect(screen.getByDisplayValue(mockUsers.medecin.email)).toBeInTheDocument()
    })

    it('should call onUpdate when form is submitted', async () => {
        renderComponent()
        fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Updated' } })
        fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }))

        await waitFor(() => {
            expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({
                nom: 'Updated'
            }))
        })
    })
})
