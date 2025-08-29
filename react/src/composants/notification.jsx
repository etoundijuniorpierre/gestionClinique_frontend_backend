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

  const getStyle = () => {
    const baseStyle = {
      padding: '12px 16px',
      margin: '8px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '400px'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fff3cd',
          color: '#856404',
          border: '1px solid #ffeaa7'
        };
      case 'info':
      default:
        return {
          ...baseStyle,
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          border: '1px solid #bee5eb'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  return (
    <div style={getStyle()}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px', fontSize: '14px' }}>{getIcon()}</span>
        <span>{message}</span>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          color: 'inherit',
          padding: '0',
          marginLeft: '12px',
          opacity: '0.7'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
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
