import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import notificationApi from '../services/notificationApi';
import { connectWebSocket, disconnectWebSocket } from '../services/messagerieService';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 350px;
`;

const NotificationToast = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', sans-serif;
  animation: slideIn 0.3s ease-out;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
`;

const NotificationSender = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

const NotificationMessage = styled.div`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const NotificationTime = styled.div`
  font-size: 11px;
  color: #9ca3af;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #6b7280;
  }
`;

const GlobalNotificationHandler = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les notifications non lues depuis l'API
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem('id');
        if (userId) {
          const apiNotifications = await notificationApi.getUnreadNotifications(userId);
          // Filtrer types MESSAGE et RENDEZVOUS
          const filtered = apiNotifications.filter(n => n.type === 'MESSAGE' || n.type === 'RENDEZVOUS');
          setNotifications(filtered);
          setUnreadCount(filtered.length);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Effet pour surveiller les changements de route et gérer le WebSocket global
  useEffect(() => {
    const userId = localStorage.getItem('id');
    
    if (userId) {
      // Vérifier si l'utilisateur est sur la page chat
      const isOnChatPage = window.location.pathname.includes('/chat') || 
                          window.location.pathname.includes('chat');
      
      console.log('🔄 Changement de route détecté:', {
        pathname: window.location.pathname,
        isOnChatPage
      });
      
      // Si on est sur la page chat, ne pas connecter le WebSocket global
      if (isOnChatPage) {
        console.log('🔌 WebSocket global non connecté (page chat active)');
        return;
      }
      
      console.log('🔌 Connexion WebSocket globale pour les notifications');
      
      const handleGlobalWebSocketMessage = (message) => {
        console.log('📨 Message WebSocket global reçu:', message);
        
        // Traiter seulement les nouveaux messages
        if (message.type === 'NEW_MESSAGE' && message.message) {
          const conversationId = message.message.conversationId;
          
          console.log('🔔 Notification globale pour nouveau message:', {
            conversationId,
            sender: message.message.expediteur?.nom,
            isOnChatPage: false
          });
          
          // Créer une notification temporaire pour affichage immédiat
          const tempNotification = {
            id: Date.now() + Math.random(),
            messageId: message.message.id,
            conversationId: conversationId,
            conversationName: 'Nouvelle conversation',
            senderName: message.message.expediteur?.nom || 'Quelqu\'un',
            messagePreview: message.message.contenu?.substring(0, 100) || 'Nouveau message',
            timeAgo: 'à l\'instant',
            timestamp: new Date().toISOString(),
            read: false,
            type: 'NEW_MESSAGE',
            isTemporary: true
          };
          
          // Ajouter à la liste temporaire
          setNotifications(prev => [tempNotification, ...prev.slice(0, 4)]);
          
          // Supprimer après 5 secondes
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== tempNotification.id));
          }, 5000);
        }
      };

      connectWebSocket(
        parseInt(userId),
        handleGlobalWebSocketMessage,
        () => {
          console.log('✅ WebSocket global connecté pour les notifications');
        }
      );

      return () => {
        disconnectWebSocket();
        console.log('🔌 WebSocket global déconnecté');
      };
    }
  }, [window.location.pathname]); // Dépendance sur le pathname pour détecter les changements de route

  const handleNotificationClick = async (notification) => {
    // Marquer comme lue côté API
    if (!notification.isTemporary && notification.id) {
      try {
        await notificationApi.markAsRead(notification.id);
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Erreur lors du marquage comme lue:', error);
      }
    }
    // Rediriger selon le type
    if (notification.type === 'MESSAGE') {
      // Rediriger vers la page chat selon le rôle de l'utilisateur
      const userRole = localStorage.getItem('user');
      let chatPath = '/chat'; // fallback
      if (userRole) {
        try {
          const role = JSON.parse(userRole);
          switch (role) {
            case 'ROLE_ADMIN':
              chatPath = '/admin/chat';
              break;
            case 'ROLE_MEDECIN':
              chatPath = '/medecin/chat';
              break;
            case 'ROLE_SECRETAIRE':
              chatPath = '/secretaire/chat';
              break;
            default:
              chatPath = '/chat';
          }
        } catch (error) {
          console.error('Erreur lors du parsing du rôle:', error);
          chatPath = '/chat';
        }
      }
      window.location.href = chatPath;
    } else if (notification.type === 'RENDEZVOUS') {
      // Rediriger vers la page de rendez-vous (à adapter selon votre routing)
      window.location.href = '/rendezvous';
    }
  };

  const handleCloseNotification = (notificationId, event) => {
    event.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Afficher les 10 notifications les plus récentes (types MESSAGE et RENDEZVOUS)
  const recentNotifications = notifications
    .filter(n => n.type === 'MESSAGE' || n.type === 'RENDEZVOUS')
    .slice(0, 10);

  if (loading) {
    return <NotificationContainer>Chargement des notifications...</NotificationContainer>;
  }

  return (
    <NotificationContainer>
      {recentNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
        >
          <NotificationHeader>
            <div>
              <NotificationTitle>
                {notification.type === 'MESSAGE' ? notification.conversationName : 'Notification Rendez-vous'}
              </NotificationTitle>
              <NotificationSender>
                {notification.senderName || ''}
              </NotificationSender>
            </div>
            <CloseButton
              onClick={(e) => handleCloseNotification(notification.id, e)}
            >
              ×
            </CloseButton>
          </NotificationHeader>
          <NotificationMessage>
            {notification.messagePreview || notification.contenu}
          </NotificationMessage>
          <NotificationTime>
            {notification.timeAgo || ''}
          </NotificationTime>
        </NotificationToast>
      ))}
    </NotificationContainer>
  );
};

export default GlobalNotificationHandler;
