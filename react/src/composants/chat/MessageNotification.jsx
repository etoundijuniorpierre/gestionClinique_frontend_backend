import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificationItem = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0 !important;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;
  
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
  
  /* Masquer toutes les scrollbars */
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  &::-webkit-scrollbar-track {
    display: none !important;
  }
  
  &::-webkit-scbar-thumb {
    display: none !important;
  }
  
  &::-webkit-scrollbar-corner {
    display: none !important;
  }
  
  /* Firefox */
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const NotificationIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #1e40af;
  color: white;
  border-radius: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
`;

const NotificationContent = styled.div`
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #9ca3af;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0 !important;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
  
  /* Masquer toutes les scrollbars */
  &::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  &::-webkit-scrollbar-track {
    display: none !important;
  }
  
  &::-webkit-scrollbar-thumb {
    display: none !important;
  }
  
  &::-webkit-scrollbar-corner {
    display: none !important;
  }
  
  /* Firefox */
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
`;

const MessageNotification = ({ 
  notifications = [], 
  onMarkAsRead, 
  onOpenChat,
  onDismiss 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Filtrer les notifications non lues
    const unreadNotifications = notifications.filter(n => !n.read);
    setVisibleNotifications(unreadNotifications);
  }, [notifications]);

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead?.(notificationId);
  };

  const handleOpenChat = (conversationId) => {
    onOpenChat?.(conversationId);
  };

  const handleDismiss = (notificationId) => {
    onDismiss?.(notificationId);
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <NotificationContainer>
      {visibleNotifications.map((notification) => (
        <NotificationItem key={notification.id}>
          <NotificationHeader>
            <NotificationIcon>💬</NotificationIcon>
            <NotificationTitle>
              Nouveau message de {notification.senderName}
            </NotificationTitle>
          </NotificationHeader>
          
          <NotificationContent>
            {notification.messagePreview}
          </NotificationContent>
          
          <NotificationMeta>
            <span>{notification.timeAgo}</span>
            <span>{notification.conversationName}</span>
          </NotificationMeta>
          
          <NotificationActions>
            <ActionButton onClick={() => handleOpenChat(notification.conversationId)}>
              Ouvrir
            </ActionButton>
            <ActionButton onClick={() => handleMarkAsRead(notification.id)}>
              Marquer comme lu
            </ActionButton>
            <ActionButton onClick={() => handleDismiss(notification.id)}>
              Ignorer
            </ActionButton>
          </NotificationActions>
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};

export default MessageNotification;
