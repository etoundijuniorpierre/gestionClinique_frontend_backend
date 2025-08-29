import React, { useState } from 'react';
import styled from 'styled-components';
import MessageItem from './MessageItem';
import LoadMoreButton from './LoadMoreButton';

const MessageListContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #7f8c8d;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const MessageList = ({
  messages,
  currentUser,
  onLoadMore,
  hasMore,
  isLoadingMore,
  canEdit,
  canDelete,
  onUpdateMessage,
  onDeleteMessage
}) => {
  const [editingMessageId, setEditingMessageId] = useState(null);

  const handleEditMessage = (messageId) => {
    setEditingMessageId(messageId);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  const handleSaveEdit = async (messageId, newContent) => {
    try {
      await onUpdateMessage(messageId, newContent);
      setEditingMessageId(null);
    } catch (error) {
      // L'erreur est gérée dans le composant parent
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await onDeleteMessage(messageId);
    } catch (error) {
      // L'erreur est gérée dans le composant parent
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.creationDate || message.createdAt);
      const dateKey = date.toDateString();
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <MessageListContainer>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <div>Aucun message</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Commencez la conversation en envoyant un message
          </div>
        </EmptyState>
      </MessageListContainer>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <MessageListContainer>
      {hasMore && (
        <LoadMoreContainer>
          <LoadMoreButton
            onClick={onLoadMore}
            loading={isLoadingMore}
          />
        </LoadMoreContainer>
      )}
      
      {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
        <div key={dateKey}>
          <DateSeparator>
            {formatDate(dateMessages[0].creationDate || dateMessages[0].createdAt)}
          </DateSeparator>
          
          {dateMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              currentUser={currentUser}
              isEditing={editingMessageId === message.id}
              canEdit={canEdit(message)}
              canDelete={canDelete(message)}
              onEdit={handleEditMessage}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDeleteMessage}
            />
          ))}
        </div>
      ))}
    </MessageListContainer>
  );
};

const DateSeparator = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &::before {
    content: '';
    display: inline-block;
    width: 60px;
    height: 1px;
    background: #e0e0e0;
    margin-right: 10px;
    vertical-align: middle;
  }
  
  &::after {
    content: '';
    display: inline-block;
    width: 60px;
    height: 1px;
    background: #e0e0e0;
    margin-left: 10px;
    vertical-align: middle;
  }
`;

export default MessageList;
