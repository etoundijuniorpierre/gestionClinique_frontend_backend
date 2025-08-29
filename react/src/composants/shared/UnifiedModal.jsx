import React from 'react';
import styled from 'styled-components';

// Composants de base pour tous les modaux
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e0e0e0;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    color: #666;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalMessage = styled.p`
  margin: 0 0 16px 0;
  color: #333333;
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  text-align: center;
`;

export const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const ModalButton = styled.button`
  background-color: ${props => props.$primary ? 'rgba(159, 159, 255, 1)' : 'transparent'};
  color: ${props => props.$primary ? 'white' : 'rgba(159, 159, 255, 1)'};
  border: 1px solid rgba(159, 159, 255, 1);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  white-space: nowrap; /* Empêcher le débordement de texte */
  overflow: hidden; /* Empêcher le débordement */
  text-overflow: ellipsis; /* Ajouter des points de suspension si nécessaire */
  box-sizing: border-box; /* Inclure padding et border dans la largeur */
  
  &:hover {
    background-color: ${props => props.$primary ? 'rgba(139, 139, 235, 1)' : 'rgba(239, 239, 255, 1)'};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:focus {
    outline: none; /* Supprimer l'outline par défaut */
    transform: translateY(-1px);
    box-shadow: 0 0 0 3px rgba(159, 159, 255, 0.3); /* Focus visible sans débordement */
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// Composant Modal de confirmation unifié
export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  confirmText = "Confirmer", 
  cancelText = "Annuler",
  onConfirm,
  confirmType = "danger" // "danger", "warning", "info"
}) => {
  if (!isOpen) return null;

  const getConfirmButtonStyle = () => {
    switch (confirmType) {
      case "danger":
        return { backgroundColor: '#dc3545', borderColor: '#dc3545' };
      case "warning":
        return { backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#212529' };
      case "info":
        return { backgroundColor: 'rgba(159, 159, 255, 1)', borderColor: 'rgba(159, 159, 255, 1)' };
      default:
        return { backgroundColor: 'rgba(159, 159, 255, 1)', borderColor: 'rgba(159, 159, 255, 1)' };
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose onClick={onClose}>&times;</ModalClose>
        </ModalHeader>
        <ModalBody>
          <ModalMessage>{message}</ModalMessage>
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={onClose}>{cancelText}</ModalButton>
          <ModalButton 
            $primary 
            onClick={onConfirm}
            style={getConfirmButtonStyle()}
          >
            {confirmText}
          </ModalButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Composant Modal unifié pour tous les usages
export const UnifiedModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'medium',
    showFooter = true,
    footerContent
}) => {
    if (!isOpen) return null;

    const getModalSize = () => {
        switch (size) {
            case 'small':
                return { maxWidth: '400px' };
            case 'large':
                return { maxWidth: '800px' };
            case 'xl':
                return { maxWidth: '1200px' };
            default: // medium
                return { maxWidth: '600px' };
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()} style={getModalSize()}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <ModalClose onClick={onClose}>&times;</ModalClose>
                </ModalHeader>
                
                <ModalBody>
                    {children}
                </ModalBody>
                
                {showFooter && (
                    <ModalFooter>
                        {footerContent || (
                            <ModalButton onClick={onClose}>
                                Fermer
                            </ModalButton>
                        )}
                    </ModalFooter>
                )}
            </ModalContainer>
        </ModalOverlay>
    );
};

// Composant Modal d'information unifié
export const InfoModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = "OK"
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose onClick={onClose}>&times;</ModalClose>
        </ModalHeader>
        <ModalBody>
          <ModalMessage>{message}</ModalMessage>
        </ModalBody>
        <ModalFooter>
          <ModalButton $primary onClick={onClose}>{buttonText}</ModalButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
}; 
