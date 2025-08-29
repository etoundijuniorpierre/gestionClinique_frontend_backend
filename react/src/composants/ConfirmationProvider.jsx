import React, { createContext, useContext, useState } from 'react';
import { ConfirmationModal } from './shared/UnifiedModal';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    variant: 'default'
  });

  const showConfirmation = ({
    title,
    message,
    onConfirm,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'default'
  }) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      variant
    });
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    hideConfirmation();
  };

  const value = {
    showConfirmation
  };

  // Déterminer le type de confirmation selon la variante
  const getConfirmType = (variant) => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={handleConfirm}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        confirmType={getConfirmType(confirmation.variant)}
      />
    </ConfirmationContext.Provider>
  );
}; 
