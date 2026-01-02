import React, { createContext, useContext, useState, useEffect } from 'react';

// Contexte pour les notifications
const NotificationContext = createContext();

// Hook personnalisé pour utiliser les notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Fallback si le contexte n'est pas disponible
    return {
      showNotification: (message, type = 'info') => {
        console.log(`[Notification] ${type}: ${message}`);
        if (type === 'error') {
          alert(`Erreur: ${message}`);
        }
      }
    };
  }
  return context;
};

// Composant de notification simple
const NotificationItem = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const getColors = () => {
    switch (type) {
      case 'success': return { bg: 'var(--success-50)', text: 'var(--success-700)', border: 'var(--success-500)', icon: '✅' };
      case 'error': return { bg: 'var(--error-50)', text: 'var(--error-700)', border: 'var(--error-500)', icon: '❌' };
      case 'warning': return { bg: 'var(--warning-50)', text: 'var(--warning-700)', border: 'var(--warning-500)', icon: '⚠️' };
      case 'info':
      default: return { bg: 'var(--info-50)', text: 'var(--info-700)', border: 'var(--info-500)', icon: 'ℹ️' };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      padding: '16px 20px',
      margin: '12px 0',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      backgroundColor: colors.bg,
      color: colors.text,
      borderLeft: `5px solid ${colors.border}`,
      boxShadow: 'var(--shadow-lg)',
      backdropFilter: 'var(--glass-blur)',
      animation: isVisible ? 'slideInRight 0.3s ease-out' : 'fadeOut 0.3s ease-in',
      maxWidth: '380px',
      pointerEvents: 'auto',
      pointer: 'default'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '18px' }}>{colors.icon}</span>
        <span style={{ fontFamily: 'var(--font-body)', lineHeight: '1.4' }}>{message}</span>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: 'inherit',
          padding: '4px',
          marginLeft: '12px',
          opacity: '0.5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.5'}
      >
        &times;
      </button>
    </div>
  );
};

// Container pour les notifications
const NotificationContainer = ({ children }) => (
  <div style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    maxWidth: '400px'
  }}>
    {children}
  </div>
);

// Provider principal
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [counter, setCounter] = useState(0);

  const addNotification = (message, type = 'info', duration = 5000) => {
    try {
      const id = `notification-${Date.now()}-${counter}`;
      setCounter(prev => prev + 1);
      setNotifications(prev => [...prev, { id, message, type, duration }]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la notification:', error);
    }
  };

  const removeNotification = (id) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    }
  };

  // Exposer la fonction globalement
  useEffect(() => {
    window.showNotification = addNotification;
    return () => {
      delete window.showNotification;
    };
  }, []);

  const contextValue = {
    showNotification: addNotification,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

// Composant Notification pour compatibilité
export const Notification = NotificationItem;

export default NotificationProvider;
